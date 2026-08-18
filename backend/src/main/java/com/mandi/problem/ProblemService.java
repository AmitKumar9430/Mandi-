package com.mandi.problem;

import com.mandi.common.PageResponse;
import com.mandi.exception.InvalidStateTransitionException;
import com.mandi.exception.ResourceNotFoundException;
import com.mandi.exception.UnauthorizedActionException;
import com.mandi.matching.MatchingEngineService;
import com.mandi.matching.NoDeadEndFallbackService;
import com.mandi.notification.NotificationService;
import com.mandi.notification.NotificationType;
import com.mandi.organization.Organization;
import com.mandi.organization.OrganizationRepository;
import com.mandi.organization.OrganizationService;
import com.mandi.problem.dto.*;
import com.mandi.solution.SolutionGraph;
import com.mandi.solution.SolutionGraphRepository;
import com.mandi.solution.SolutionStep;
import com.mandi.user.User;
import com.mandi.user.UserProfile;
import com.mandi.user.UserProfileRepository;
import com.mandi.user.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProblemService {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(ProblemService.class);

    private final ProblemRepository problemRepository;
    private final ProblemPassportRepository passportRepository;
    private final ProblemEventRepository eventRepository;
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final StateTransitionValidator stateTransitionValidator;
    private final ClassifierEngine classifierEngine;
    private final MatchingEngineService matchingEngineService;
    private final NoDeadEndFallbackService fallbackService;
    private final SolutionGraphRepository solutionGraphRepository;
    private final OrganizationRepository organizationRepository;
    private final OrganizationService organizationService;
    private final NotificationService notificationService;
    private final SlaService slaService;

    public ProblemService(
            ProblemRepository problemRepository,
            ProblemPassportRepository passportRepository,
            ProblemEventRepository eventRepository,
            UserRepository userRepository,
            UserProfileRepository userProfileRepository,
            StateTransitionValidator stateTransitionValidator,
            ClassifierEngine classifierEngine,
            MatchingEngineService matchingEngineService,
            NoDeadEndFallbackService fallbackService,
            SolutionGraphRepository solutionGraphRepository,
            OrganizationRepository organizationRepository,
            OrganizationService organizationService,
            NotificationService notificationService,
            SlaService slaService) {
        this.problemRepository = problemRepository;
        this.passportRepository = passportRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
        this.stateTransitionValidator = stateTransitionValidator;
        this.classifierEngine = classifierEngine;
        this.matchingEngineService = matchingEngineService;
        this.fallbackService = fallbackService;
        this.solutionGraphRepository = solutionGraphRepository;
        this.organizationRepository = organizationRepository;
        this.organizationService = organizationService;
        this.notificationService = notificationService;
        this.slaService = slaService;
    }

    public ClassifyPreviewResponse previewClassification(String text, ProblemCategory category) {
        ClassifierEngine.ClassificationResult result = classifierEngine.classify(text, category);
        return new ClassifyPreviewResponse(
                result.getCategory(),
                result.getUrgency(),
                result.getTitle(),
                result.getExtractedTags(),
                result.getRequiredResources(),
                result.getSolutionPathSummary(),
                "DETERMINISTIC_AI_FALLBACK_ENGINE"
        );
    }

    @Transactional(readOnly = true)
    public DuplicateCheckResponse detectDuplicates(ProblemCategory category, String district, String text) {
        if (category == null && (district == null || district.isBlank())) {
            return new DuplicateCheckResponse(false, "No criteria for duplicate check", List.of());
        }

        Pageable pageable = PageRequest.of(0, 5);
        List<Problem> potentialList = problemRepository.findPotentialDuplicates(
                category != null ? category : ProblemCategory.OTHER,
                district,
                pageable
        );

        if (potentialList.isEmpty()) {
            return new DuplicateCheckResponse(false, "No existing duplicates found in this locality.", List.of());
        }

        List<ProblemDto> dtos = potentialList.stream()
                .map(p -> {
                    String code = p.getPassport() != null ? p.getPassport().getPassportCode() : "MDI-2026-" + p.getId();
                    return ProblemDto.from(p, code, null);
                })
                .collect(Collectors.toList());

        return new DuplicateCheckResponse(true, "A similar problem ticket may already exist in " + (district != null ? district : "your district") + ".", dtos);
    }

    @Transactional
    public ProblemDto createProblem(Long userId, CreateProblemRequest request) {
        User user = null;
        if (userId != null) {
            user = userRepository.findById(userId).orElse(null);
        }
        if (user == null) {
            user = userRepository.findByPhone("9876543210")
                    .orElseGet(() -> userRepository.findAll().stream().findFirst().orElse(null));
        }

        // Classify using NLP/Rule engine
        ClassifierEngine.ClassificationResult classification = classifierEngine.classify(
                request.getRawDescription(),
                request.getCategory()
        );

        Problem problem = new Problem();
        problem.setUser(user);
        problem.setRawDescription(request.getRawDescription());
        problem.setTitle(request.getTitle() != null && !request.getTitle().isBlank() ? request.getTitle() : classification.getTitle());
        problem.setCategory(request.getCategory() != null ? request.getCategory() : classification.getCategory());
        problem.setSubCategory(request.getSubCategory());
        problem.setUrgency(request.getUrgency() != null ? request.getUrgency() : classification.getUrgency());

        // Geolocation & Address
        if (request.getLatitude() != null && request.getLongitude() != null) {
            problem.setLatitude(request.getLatitude());
            problem.setLongitude(request.getLongitude());
        } else if (user != null && user.getProfile() != null && user.getProfile().getLatitude() != null) {
            problem.setLatitude(user.getProfile().getLatitude());
            problem.setLongitude(user.getProfile().getLongitude());
        } else {
            problem.setLatitude(26.8467);
            problem.setLongitude(80.9462);
        }

        String rawDist = request.getDistrict() != null && !request.getDistrict().isBlank()
                ? request.getDistrict()
                : (user != null && user.getProfile() != null && user.getProfile().getDistrict() != null ? user.getProfile().getDistrict() : "Lucknow");
        String dist = com.mandi.common.IndianLocationService.normalizeDistrict(rawDist);
        String rawState = request.getState() != null && !request.getState().isBlank()
                ? request.getState()
                : (user != null && user.getProfile() != null && user.getProfile().getState() != null ? user.getProfile().getState() : "");
        String state = com.mandi.common.IndianLocationService.resolveState(dist, rawState);

        problem.setLocationName(request.getLocationName() != null && !request.getLocationName().isBlank() ? request.getLocationName() : (request.getVillageOrTown() != null ? request.getVillageOrTown() : dist));
        problem.setVillageOrTown(request.getVillageOrTown() != null ? request.getVillageOrTown() : (user != null && user.getProfile() != null ? user.getProfile().getVillageOrTown() : ""));
        problem.setDistrict(dist);
        problem.setState(state);
        problem.setPincode(request.getPincode() != null ? request.getPincode() : (user != null && user.getProfile() != null ? user.getProfile().getPincode() : "226001"));
        problem.setAddress(request.getAddress());
        problem.setLandmark(request.getLandmark());

        problem.setContactPhone(request.getContactPhone() != null ? request.getContactPhone() : (user != null ? user.getPhone() : ""));
        problem.setContactName(request.getContactName() != null ? request.getContactName() : (user != null ? user.getFullName() : ""));
        problem.setAdditionalComments(request.getAdditionalComments());

        // Attachments
        problem.setAudioRecordingUrl(request.getAudioRecordingUrl());
        problem.setPhotoUrl(request.getPhotoUrl());
        problem.setVideoUrl(request.getVideoUrl());
        problem.setSupportingDocUrl(request.getSupportingDocUrl());

        // Dynamic Request & Offer fields
        problem.setRequestType(request.getRequestType() != null ? request.getRequestType() : RequestType.REPORT_PROBLEM);
        problem.setServiceType(request.getServiceType());
        problem.setOffer(request.getIsOffer() != null && request.getIsOffer());
        problem.setRequiredDate(request.getRequiredDate());
        problem.setRequiredStartTime(request.getRequiredStartTime());
        problem.setRequiredEndTime(request.getRequiredEndTime());
        problem.setBudgetAmount(request.getBudgetAmount());
        problem.setBudgetUnit(request.getBudgetUnit());
        problem.setStructuredAttributes(request.getStructuredAttributes());

        validateDynamicAttributes(request);
        problem.setExtractedTags(String.join(",", classification.getExtractedTags()));
        problem.setRequiredResourceTypes(String.join(",", classification.getRequiredResources()));

        // SLA Calculation
        Instant now = Instant.now();
        Instant slaDeadline = slaService.calculateDeadline(now, problem.getUrgency());
        problem.setSlaDeadline(slaDeadline);
        problem.setSlaStatus("ON_TIME");

        // Auto-Assignment to Responsible Organization where matching rule allows
        Organization autoMatchedOrg = organizationService.findBestMatchingOrganization(problem.getCategory(), problem.getDistrict());
        if (autoMatchedOrg != null) {
            problem.setAssignedOrganization(autoMatchedOrg);
            problem.setAssignedAt(now);
            problem.setStatus(ProblemStatus.ASSIGNED);
            organizationService.recordAssignment(autoMatchedOrg.getId());
        } else {
            problem.setStatus(ProblemStatus.NEW);
        }

        Problem savedProblem = problemRepository.save(problem);

        // Generate Unique Problem Ticket / Passport Code
        String passportCode = String.format("MANDI-2026-%06d", savedProblem.getId());
        ProblemPassport passport = new ProblemPassport(savedProblem, passportCode);
        passport.setAiAnalysisSummary("Classified as " + savedProblem.getCategory() + " with " + savedProblem.getUrgency() + " urgency. Key needs: " + savedProblem.getRequiredResourceTypes());
        passport.setIdentifiedSolutionPath(classification.getSolutionPathSummary());
        passportRepository.save(passport);
        savedProblem.setPassport(passport);

        // Initial Audit Event
        ProblemEvent initialEvent = new ProblemEvent(
                savedProblem,
                ProblemStatus.DRAFT,
                savedProblem.getStatus(),
                "CREATE_COMPLAINT",
                "Complaint #" + passportCode + " created by " + (user != null ? user.getFullName() : "Citizen") +
                        (autoMatchedOrg != null ? ". Automatically assigned to: " + autoMatchedOrg.getName() : ". Sent to Admin triage queue."),
                user != null ? user.getFullName() : "Citizen",
                user != null ? user.getId() : null
        );
        eventRepository.save(initialEvent);

        // Notifications
        if (user != null) {
            notificationService.sendNotification(
                    user,
                    "Complaint #" + passportCode + " Registered",
                    "Your complaint '" + savedProblem.getTitle() + "' is logged. Status: " + savedProblem.getStatus() +
                            (autoMatchedOrg != null ? " (Assigned to " + autoMatchedOrg.getName() + ")" : " (Awaiting Assignment)"),
                    NotificationType.COMPLAINT_CREATED,
                    savedProblem.getId(),
                    passportCode,
                    "/user/problems/" + savedProblem.getId()
            );
        }

        notificationService.notifyAdmins(
                "New Complaint: #" + passportCode,
                "New " + savedProblem.getCategory() + " complaint in " + savedProblem.getDistrict() + ": " + savedProblem.getTitle(),
                NotificationType.COMPLAINT_CREATED,
                savedProblem.getId(),
                passportCode,
                "/admin/problems"
        );

        if (autoMatchedOrg != null && autoMatchedOrg.getLeadUser() != null) {
            notificationService.sendNotification(
                    autoMatchedOrg.getLeadUser(),
                    "New Task Assigned: #" + passportCode,
                    "Complaint '" + savedProblem.getTitle() + "' in " + savedProblem.getDistrict() + " assigned to " + autoMatchedOrg.getName(),
                    NotificationType.COMPLAINT_ASSIGNED,
                    savedProblem.getId(),
                    passportCode,
                    "/user/problems/" + savedProblem.getId()
            );
        }

        List<ProblemEventDto> eventDtos = List.of(ProblemEventDto.from(initialEvent));
        return ProblemDto.from(savedProblem, passportCode, eventDtos);
    }

    @Transactional(readOnly = true)
    public ProblemDto getProblemById(Long problemId) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new ResourceNotFoundException("Problem", problemId));

        String passportCode = passportRepository.findByProblemId(problemId)
                .map(ProblemPassport::getPassportCode)
                .orElse("MANDI-2026-" + String.format("%06d", problem.getId()));

        // Recompute current SLA status on the fly
        String currentSlaStatus = slaService.computeSlaStatus(
                problem.getCreatedAt(),
                problem.getSlaDeadline(),
                problem.getResolvedAt(),
                problem.getStatus()
        );
        problem.setSlaStatus(currentSlaStatus);
        problem.setOverdue("OVERDUE".equals(currentSlaStatus));

        List<ProblemEventDto> events = eventRepository.findByProblemIdOrderByCreatedAtDesc(problemId).stream()
                .map(ProblemEventDto::from)
                .collect(Collectors.toList());

        return ProblemDto.from(problem, passportCode, events);
    }

    @Transactional(readOnly = true)
    public ProblemPassportDto getPassportByCode(String passportCode) {
        ProblemPassport passport = passportRepository.findByPassportCode(passportCode)
                .orElseThrow(() -> new ResourceNotFoundException("ProblemPassport with code " + passportCode + " not found"));
        return ProblemPassportDto.from(passport);
    }
    public PageResponse<ProblemDto> searchProblems(
            ProblemCategory category,
            ProblemStatus status,
            ProblemUrgency urgency,
            String district,
            Long orgId,
            String search,
            Pageable pageable) {

        Page<Problem> page = problemRepository.searchProblemsAdvanced(category, status, urgency, district, orgId, search, pageable);

        List<ProblemDto> dtos = page.getContent().stream()
                .map(p -> {
                    String code = p.getPassport() != null ? p.getPassport().getPassportCode() : "MANDI-2026-" + String.format("%06d", p.getId());
                    String sla = slaService.computeSlaStatus(p.getCreatedAt(), p.getSlaDeadline(), p.getResolvedAt(), p.getStatus());
                    p.setSlaStatus(sla);
                    p.setOverdue("OVERDUE".equals(sla));
                    return ProblemDto.from(p, code, null);
                })
                .collect(Collectors.toList());

        return new PageResponse<>(dtos, page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages(), page.isLast());
    }

    @Transactional(readOnly = true)
    public PageResponse<ProblemDto> getUserProblems(Long userId, Pageable pageable) {
        Page<Problem> page = problemRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);

        List<ProblemDto> dtos = page.getContent().stream()
                .map(p -> {
                    String code = p.getPassport() != null ? p.getPassport().getPassportCode() : "MANDI-2026-" + String.format("%06d", p.getId());
                    String sla = slaService.computeSlaStatus(p.getCreatedAt(), p.getSlaDeadline(), p.getResolvedAt(), p.getStatus());
                    p.setSlaStatus(sla);
                    p.setOverdue("OVERDUE".equals(sla));
                    return ProblemDto.from(p, code, null);
                })
                .collect(Collectors.toList());

        return new PageResponse<>(dtos, page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages(), page.isLast());
    }

    @Transactional(readOnly = true)
    public PageResponse<ProblemDto> getOrganizationProblems(Long orgId, Pageable pageable) {
        Page<Problem> page = problemRepository.findByAssignedOrganizationIdOrderByCreatedAtDesc(orgId, pageable);

        List<ProblemDto> dtos = page.getContent().stream()
                .map(p -> {
                    String code = p.getPassport() != null ? p.getPassport().getPassportCode() : "MANDI-2026-" + String.format("%06d", p.getId());
                    return ProblemDto.from(p, code, null);
                })
                .collect(Collectors.toList());

        return new PageResponse<>(dtos, page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages(), page.isLast());
    }

    @Transactional
    public ProblemDto assignComplaint(Long problemId, Long actorUserId, String actorName, AssignComplaintRequest request) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new ResourceNotFoundException("Problem", problemId));

        Organization org = organizationRepository.findById(request.getOrganizationId())
                .orElseThrow(() -> new ResourceNotFoundException("Organization", request.getOrganizationId()));

        ProblemStatus oldStatus = problem.getStatus();
        stateTransitionValidator.validateTransition(oldStatus, ProblemStatus.ASSIGNED);

        problem.setAssignedOrganization(org);
        problem.setAssignedAt(Instant.now());
        problem.setStatus(ProblemStatus.ASSIGNED);

        if (request.getResolverUserId() != null) {
            userRepository.findById(request.getResolverUserId()).ifPresent(problem::setAssignedResolver);
        }

        if (request.getCustomDeadlineHours() != null && request.getCustomDeadlineHours() > 0) {
            problem.setSlaDeadline(Instant.now().plus(Duration.ofHours(request.getCustomDeadlineHours())));
        } else if (problem.getSlaDeadline() == null) {
            problem.setSlaDeadline(slaService.calculateDeadline(Instant.now(), problem.getUrgency()));
        }

        organizationService.recordAssignment(org.getId());
        Problem saved = problemRepository.save(problem);

        String passportCode = saved.getPassport() != null ? saved.getPassport().getPassportCode() : "MANDI-2026-" + saved.getId();

        ProblemEvent event = new ProblemEvent(
                saved,
                oldStatus,
                ProblemStatus.ASSIGNED,
                "ASSIGN_COMPLAINT",
                "Assigned to organization: " + org.getName() + (request.getAssignmentRemarks() != null ? ". Note: " + request.getAssignmentRemarks() : ""),
                actorName,
                actorUserId
        );
        eventRepository.save(event);

        // Notify Citizen
        if (saved.getUser() != null) {
            notificationService.sendNotification(
                    saved.getUser(),
                    "Complaint #" + passportCode + " Assigned",
                    "Your complaint has been assigned to " + org.getName() + ". Expected resolution: " + saved.getSlaDeadline(),
                    NotificationType.COMPLAINT_ASSIGNED,
                    saved.getId(),
                    passportCode,
                    "/user/problems/" + saved.getId()
            );
        }

        // Notify Org Lead
        if (org.getLeadUser() != null) {
            notificationService.sendNotification(
                    org.getLeadUser(),
                    "New Task Assignment: #" + passportCode,
                    "Complaint '" + saved.getTitle() + "' in " + saved.getDistrict() + " assigned to your department.",
                    NotificationType.COMPLAINT_ASSIGNED,
                    saved.getId(),
                    passportCode,
                    "/user/problems/" + saved.getId()
            );
        }

        return getProblemById(saved.getId());
    }

    @Transactional
    public ProblemDto acceptComplaint(Long problemId, Long actorUserId, String actorName, String remarks) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new ResourceNotFoundException("Problem", problemId));

        ProblemStatus oldStatus = problem.getStatus();
        stateTransitionValidator.validateTransition(oldStatus, ProblemStatus.ACCEPTED);

        problem.setStatus(ProblemStatus.ACCEPTED);
        problem.setAcceptedAt(Instant.now());
        Problem saved = problemRepository.save(problem);

        String passportCode = saved.getPassport() != null ? saved.getPassport().getPassportCode() : "MANDI-2026-" + saved.getId();

        ProblemEvent event = new ProblemEvent(
                saved,
                oldStatus,
                ProblemStatus.ACCEPTED,
                "ACCEPT_COMPLAINT",
                "Assignment accepted by " + actorName + (remarks != null ? ". " + remarks : ""),
                actorName,
                actorUserId
        );
        eventRepository.save(event);

        if (saved.getUser() != null) {
            notificationService.sendNotification(
                    saved.getUser(),
                    "Complaint #" + passportCode + " Accepted",
                    "Responsible team has officially accepted your complaint and queued work.",
                    NotificationType.TASK_ACCEPTED,
                    saved.getId(),
                    passportCode,
                    "/user/problems/" + saved.getId()
            );
        }

        return getProblemById(saved.getId());
    }

    @Transactional
    public ProblemDto startWork(Long problemId, Long actorUserId, String actorName, String remarks) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new ResourceNotFoundException("Problem", problemId));

        ProblemStatus oldStatus = problem.getStatus();
        stateTransitionValidator.validateTransition(oldStatus, ProblemStatus.IN_PROGRESS);

        problem.setStatus(ProblemStatus.IN_PROGRESS);
        if (problem.getWorkStartedAt() == null) {
            problem.setWorkStartedAt(Instant.now());
        }
        Problem saved = problemRepository.save(problem);

        String passportCode = saved.getPassport() != null ? saved.getPassport().getPassportCode() : "MANDI-2026-" + saved.getId();

        ProblemEvent event = new ProblemEvent(
                saved,
                oldStatus,
                ProblemStatus.IN_PROGRESS,
                "START_WORK",
                "Work started on ground by " + actorName + (remarks != null ? ". " + remarks : ""),
                actorName,
                actorUserId
        );
        eventRepository.save(event);

        if (saved.getUser() != null) {
            notificationService.sendNotification(
                    saved.getUser(),
                    "Work Started: #" + passportCode,
                    "Field resolver has started active resolution work on your complaint.",
                    NotificationType.WORK_STARTED,
                    saved.getId(),
                    passportCode,
                    "/user/problems/" + saved.getId()
            );
        }

        return getProblemById(saved.getId());
    }

    @Transactional
    public ProblemDto addProgress(Long problemId, Long actorUserId, String actorName, ProgressUpdateRequest request) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new ResourceNotFoundException("Problem", problemId));

        ProblemEvent event = new ProblemEvent(
                problem,
                problem.getStatus(),
                problem.getStatus(),
                "ADD_PROGRESS",
                "Progress update: " + request.getProgressRemarks() +
                        (request.getProgressPercent() != null ? " (" + request.getProgressPercent() + "% completed)" : ""),
                actorName,
                actorUserId
        );
        if (request.getProofPhotoUrl() != null) {
            event.setMetadata(request.getProofPhotoUrl());
        }
        eventRepository.save(event);

        String passportCode = problem.getPassport() != null ? problem.getPassport().getPassportCode() : "MANDI-2026-" + problem.getId();

        if (problem.getUser() != null) {
            notificationService.sendNotification(
                    problem.getUser(),
                    "Progress Update: #" + passportCode,
                    request.getProgressRemarks(),
                    NotificationType.PROGRESS_UPDATED,
                    problem.getId(),
                    passportCode,
                    "/user/problems/" + problem.getId()
            );
        }

        return getProblemById(problem.getId());
    }

    @Transactional
    public ProblemDto markCompleted(Long problemId, Long actorUserId, String actorName, MarkCompletedRequest request) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new ResourceNotFoundException("Problem", problemId));

        ProblemStatus oldStatus = problem.getStatus();
        stateTransitionValidator.validateTransition(oldStatus, ProblemStatus.RESOLVED);

        Instant now = Instant.now();
        problem.setStatus(ProblemStatus.RESOLVED);
        problem.setResolvedAt(now);
        problem.setVerificationRequestedAt(now);
        problem.setResolutionDescription(request.getResolutionDescription());
        problem.setActionTaken(request.getActionTaken());
        problem.setResolutionProofUrl(request.getResolutionProofUrl());
        problem.setResolverRemarks(request.getResolverRemarks());

        // SLA outcome
        String slaOutcome = slaService.computeSlaStatus(problem.getCreatedAt(), problem.getSlaDeadline(), now, ProblemStatus.RESOLVED);
        problem.setSlaStatus(slaOutcome);

        // Update Organization Stats
        if (problem.getAssignedOrganization() != null) {
            long seconds = Duration.between(problem.getCreatedAt(), now).getSeconds();
            double hours = seconds / 3600.0;
            organizationService.recordResolution(problem.getAssignedOrganization().getId(), hours, null);
        }

        Problem saved = problemRepository.save(problem);
        String passportCode = saved.getPassport() != null ? saved.getPassport().getPassportCode() : "MANDI-2026-" + saved.getId();

        ProblemEvent event = new ProblemEvent(
                saved,
                oldStatus,
                ProblemStatus.RESOLVED,
                "MARK_RESOLVED",
                "Work marked completed by " + actorName + ". Resolution: " + request.getResolutionDescription(),
                actorName,
                actorUserId
        );
        eventRepository.save(event);

        // Transition to VERIFICATION_PENDING
        saved.setStatus(ProblemStatus.VERIFICATION_PENDING);
        problemRepository.save(saved);

        ProblemEvent verEvent = new ProblemEvent(
                saved,
                ProblemStatus.RESOLVED,
                ProblemStatus.VERIFICATION_PENDING,
                "REQUEST_VERIFICATION",
                "Resolution verification requested from citizen owner.",
                "System Workflow",
                null
        );
        eventRepository.save(verEvent);

        if (saved.getUser() != null) {
            notificationService.sendNotification(
                    saved.getUser(),
                    "Verification Required: #" + passportCode,
                    "Your complaint has been marked as RESOLVED by the team. Please verify if the problem has actually been fixed.",
                    NotificationType.VERIFICATION_REQUESTED,
                    saved.getId(),
                    passportCode,
                    "/user/problems/" + saved.getId()
            );
        }

        notificationService.notifyAdmins(
                "Complaint Resolved: #" + passportCode,
                "Resolver " + actorName + " marked #" + passportCode + " as resolved. Citizen verification pending.",
                NotificationType.WORK_COMPLETED,
                saved.getId(),
                passportCode,
                "/admin/problems"
        );

        return getProblemById(saved.getId());
    }

    @Transactional
    public ProblemDto verifyResolution(Long problemId, Long userId, String userName, VerifyResolutionRequest request) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new ResourceNotFoundException("Problem", problemId));

        if (!problem.getUser().getId().equals(userId)) {
            throw new UnauthorizedActionException("Only the citizen who submitted the complaint can verify its resolution.");
        }

        ProblemStatus oldStatus = problem.getStatus();
        String passportCode = problem.getPassport() != null ? problem.getPassport().getPassportCode() : "MANDI-2026-" + problem.getId();

        if (request.isVerified()) {
            // Citizen confirms problem was successfully fixed
            stateTransitionValidator.validateTransition(oldStatus, ProblemStatus.COMPLETED);
            problem.setStatus(ProblemStatus.COMPLETED);
            problem.setCompletedAt(Instant.now());
            Problem saved = problemRepository.save(problem);

            ProblemEvent event = new ProblemEvent(
                    saved,
                    oldStatus,
                    ProblemStatus.COMPLETED,
                    "VERIFY_RESOLUTION_CONFIRMED",
                    "Citizen confirmed problem is successfully resolved! Awaiting feedback & rating.",
                    userName,
                    userId
            );
            eventRepository.save(event);

            notificationService.notifyAdmins(
                    "Citizen Verified Resolution: #" + passportCode,
                    "Citizen " + userName + " verified that #" + passportCode + " is successfully resolved.",
                    NotificationType.WORK_COMPLETED,
                    saved.getId(),
                    passportCode,
                    "/admin/problems"
            );

            return getProblemById(saved.getId());
        } else {
            // Citizen says problem is STILL NOT RESOLVED
            stateTransitionValidator.validateTransition(oldStatus, ProblemStatus.REOPENED);
            problem.setStatus(ProblemStatus.REOPENED);
            problem.setReopenReason(request.getRejectionReason());
            problem.setReopenProofUrl(request.getReopenProofUrl());
            problem.setReopenedCount(problem.getReopenedCount() + 1);

            if (problem.getAssignedOrganization() != null) {
                organizationService.recordReopen(problem.getAssignedOrganization().getId());
            }

            Problem saved = problemRepository.save(problem);

            ProblemEvent event = new ProblemEvent(
                    saved,
                    oldStatus,
                    ProblemStatus.REOPENED,
                    "REOPEN_COMPLAINT",
                    "Citizen reported problem is STILL NOT RESOLVED. Reason: " + request.getRejectionReason(),
                    userName,
                    userId
            );
            eventRepository.save(event);

            // Notify Admin & Organization
            notificationService.notifyAdmins(
                    "⚠️ Complaint Reopened by Citizen: #" + passportCode,
                    "Citizen " + userName + " rejected resolution for #" + passportCode + ": " + request.getRejectionReason(),
                    NotificationType.COMPLAINT_REOPENED,
                    saved.getId(),
                    passportCode,
                    "/admin/problems"
            );

            if (saved.getAssignedOrganization() != null && saved.getAssignedOrganization().getLeadUser() != null) {
                notificationService.sendNotification(
                        saved.getAssignedOrganization().getLeadUser(),
                        "⚠️ Task Reopened: #" + passportCode,
                        "Citizen rejected resolution. Reason: " + request.getRejectionReason(),
                        NotificationType.COMPLAINT_REOPENED,
                        saved.getId(),
                        passportCode,
                        "/user/problems/" + saved.getId()
                );
            }

            return getProblemById(saved.getId());
        }
    }

    @Transactional
    public ProblemDto submitFeedback(Long problemId, Long userId, String userName, SubmitFeedbackRequest request) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new ResourceNotFoundException("Problem", problemId));

        if (!problem.getUser().getId().equals(userId)) {
            throw new UnauthorizedActionException("Only the problem owner can submit feedback.");
        }

        ProblemStatus oldStatus = problem.getStatus();
        stateTransitionValidator.validateTransition(oldStatus, ProblemStatus.CLOSED);

        problem.setStatus(ProblemStatus.CLOSED);
        problem.setClosedAt(Instant.now());
        problem.setFeedbackRating(request.getRating());
        problem.setFeedbackComments(request.getFeedbackComments());
        problem.setFeedbackTags(request.getFeedbackTags());

        // Update Organization rating scorecard
        if (problem.getAssignedOrganization() != null) {
            organizationService.recordResolution(problem.getAssignedOrganization().getId(), 0.0, request.getRating());
        }

        // Increment user resolved problems count
        userProfileRepository.findByUserId(userId).ifPresent(p -> {
            p.setProblemsResolvedCount(p.getProblemsResolvedCount() + 1);
            userProfileRepository.save(p);
        });

        Problem saved = problemRepository.save(problem);
        String passportCode = saved.getPassport() != null ? saved.getPassport().getPassportCode() : "MANDI-2026-" + saved.getId();

        ProblemEvent event = new ProblemEvent(
                saved,
                oldStatus,
                ProblemStatus.CLOSED,
                "SUBMIT_FEEDBACK_AND_CLOSE",
                "Citizen submitted " + request.getRating() + "★ feedback. Complaint permanently closed.",
                userName,
                userId
        );
        eventRepository.save(event);

        notificationService.notifyAdmins(
                "Complaint Closed: #" + passportCode,
                "#" + passportCode + " verified and closed with " + request.getRating() + "★ rating by citizen.",
                NotificationType.COMPLAINT_CLOSED,
                saved.getId(),
                passportCode,
                "/admin/problems"
        );

        return getProblemById(saved.getId());
    }

    @Transactional
    public ProblemDto escalateProblem(Long problemId, Long actorUserId, String actorName, EscalateComplaintRequest request) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new ResourceNotFoundException("Problem", problemId));

        ProblemStatus oldStatus = problem.getStatus();
        stateTransitionValidator.validateTransition(oldStatus, ProblemStatus.ESCALATED);

        problem.setStatus(ProblemStatus.ESCALATED);
        problem.setEscalated(true);
        problem.setUrgency(ProblemUrgency.CRITICAL);
        problem.setEscalationReason(request.getReason());
        problem.setEscalatedBy(actorName);
        problem.setEscalatedAt(Instant.now());

        if (request.getTargetOrganizationId() != null) {
            organizationRepository.findById(request.getTargetOrganizationId()).ifPresent(problem::setAssignedOrganization);
        }

        Problem saved = problemRepository.save(problem);
        String passportCode = saved.getPassport() != null ? saved.getPassport().getPassportCode() : "MANDI-2026-" + saved.getId();

        ProblemEvent event = new ProblemEvent(
                saved,
                oldStatus,
                ProblemStatus.ESCALATED,
                "ESCALATE_COMPLAINT",
                "Escalated by " + actorName + ". Reason: " + request.getReason() + (request.getDirective() != null ? ". Directive: " + request.getDirective() : ""),
                actorName,
                actorUserId
        );
        eventRepository.save(event);

        if (saved.getUser() != null) {
            notificationService.sendNotification(
                    saved.getUser(),
                    "Priority Escalation: #" + passportCode,
                    "Your complaint has been escalated to CRITICAL executive priority. Reason: " + request.getReason(),
                    NotificationType.ESCALATION,
                    saved.getId(),
                    passportCode,
                    "/user/problems/" + saved.getId()
            );
        }

        if (saved.getAssignedOrganization() != null && saved.getAssignedOrganization().getLeadUser() != null) {
            notificationService.sendNotification(
                    saved.getAssignedOrganization().getLeadUser(),
                    "🚨 ESCALATED TICKET: #" + passportCode,
                    "Complaint #" + passportCode + " has been escalated to CRITICAL priority by Admin. Immediate action requested.",
                    NotificationType.ESCALATION,
                    saved.getId(),
                    passportCode,
                    "/user/problems/" + saved.getId()
            );
        }

        return getProblemById(saved.getId());
    }

    @Transactional
    public ProblemDto addCitizenComment(Long problemId, Long userId, String userName, String comment, String photoUrl) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new ResourceNotFoundException("Problem", problemId));

        if (!problem.getUser().getId().equals(userId)) {
            throw new UnauthorizedActionException("Only the complaint owner can add remarks.");
        }

        ProblemEvent event = new ProblemEvent(
                problem,
                problem.getStatus(),
                problem.getStatus(),
                "CITIZEN_COMMENT",
                comment,
                userName,
                userId
        );
        if (photoUrl != null) {
            event.setMetadata(photoUrl);
        }
        eventRepository.save(event);

        return getProblemById(problem.getId());
    }

    @Transactional
    public ProblemDto addInternalNote(Long problemId, Long adminId, String adminName, String note) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new ResourceNotFoundException("Problem", problemId));

        ProblemEvent event = new ProblemEvent(
                problem,
                problem.getStatus(),
                problem.getStatus(),
                "INTERNAL_ADMIN_NOTE",
                note,
                adminName,
                adminId
        );
        eventRepository.save(event);

        return getProblemById(problem.getId());
    }

    @Transactional(readOnly = true)
    public List<ProblemDto> getMapProblems() {
        return problemRepository.findActiveProblemsForMap().stream()
                .map(p -> ProblemDto.from(p, p.getPassport() != null ? p.getPassport().getPassportCode() : "MANDI-2026-" + p.getId(), null))
                .collect(Collectors.toList());
    }

    private void validateDynamicAttributes(CreateProblemRequest req) {
        if (req == null) return;
        ServiceType st = req.getServiceType();
        if (st == null) return;

        boolean isOffer = req.getIsOffer() != null && req.getIsOffer();
        String attrs = req.getStructuredAttributes() != null ? req.getStructuredAttributes() : "";

        if (st == ServiceType.TRACTOR) {
            if (isOffer) {
                // If tractor offer, hourlyRate or horsePower is expected
                if (req.getBudgetAmount() == null && !attrs.contains("\"hourlyRate\"") && !attrs.contains("\"horsePower\"")) {
                    log.info("ℹ️ Tractor offer submitted without explicit hourly rate; using default pricing.");
                }
            } else {
                // If tractor request, landSize is recommended
                if (!attrs.contains("\"landSize\"") && !attrs.contains("landSize")) {
                    log.info("ℹ️ Tractor request submitted without explicit landSize.");
                }
            }
        }
    }

    @Transactional(readOnly = true)
    public List<MatchingEngineService.MatchCandidate> getBestMatches(Long problemId, int limit) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new ResourceNotFoundException("Problem", problemId));
        return matchingEngineService.findBestMatches(problem, limit);
    }
}
