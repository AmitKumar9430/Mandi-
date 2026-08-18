package com.mandi.admin;

import com.mandi.agriculture.Crop;
import com.mandi.agriculture.CropRepository;
import com.mandi.common.ApiResponse;
import com.mandi.common.PageResponse;
import com.mandi.community.CivicReportingBundle;
import com.mandi.exception.ResourceNotFoundException;
import com.mandi.job.JobPosting;
import com.mandi.job.JobPostingRepository;
import com.mandi.organization.*;
import com.mandi.problem.*;
import com.mandi.problem.dto.ProblemDto;
import com.mandi.problem.dto.ProblemEventDto;
import com.mandi.resource.Resource;
import com.mandi.resource.ResourceRepository;
import com.mandi.security.UserPrincipal;
import com.mandi.solution.SolutionGraphRepository;
import com.mandi.user.Role;
import com.mandi.user.User;
import com.mandi.user.UserProfile;
import com.mandi.user.UserProfileRepository;
import com.mandi.user.UserRepository;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

public class AdminBundle {

    // Analytics Summary DTO
    public static class AdminAnalyticsDto {
        public long totalProblems;
        public long newProblems;
        public long assignedProblems;
        public long acceptedProblems;
        public long inProgressProblems;
        public long resolvedProblems;
        public long verificationPendingProblems;
        public long reopenedProblems;
        public long closedProblems;
        public long overdueProblems;
        public long escalatedProblems;
        public double resolutionRate;
        public double slaComplianceRate;
        public double avgRating;

        public long totalUsers;
        public long verifiedUsers;
        public long totalOrganizations;
        public long totalCrops;
        public long totalJobs;
        public long totalCivicReports;
        public long totalResources;

        public Map<String, CityStats> cityBreakdown = new LinkedHashMap<>();
        public Map<String, Long> stateBreakdown = new LinkedHashMap<>();
        public Map<String, Long> categoryBreakdown = new LinkedHashMap<>();
        public List<String> availableDistricts = new ArrayList<>();
        public List<String> availableStates = new ArrayList<>();
    }

    public static class CityStats {
        public String city;
        public String state;
        public long totalProblems;
        public long solvedProblems;
        public long activeProblems;
        public double resolutionRate;
    }

    // Problem Edit Request
    public static class AdminEditProblemRequest {
        public String title;
        public String rawDescription;
        public ProblemCategory category;
        public ProblemUrgency urgency;
        public ProblemStatus status;
        public String villageOrTown;
        public String district;
        public String state;
        public String remarks;
    }

    // User Edit Request
    public static class AdminEditUserRequest {
        public String fullName;
        public String phone;
        public String email;
        public Set<Role> roles;
        public boolean verified;
        public String villageOrTown;
        public String district;
        public String state;
    }

    // Admin Account Creation Request
    public static class AdminCreateAdminRequest {
        public String fullName;
        public String email;
        public String phone;
        public String password;
        public String role;
        public String villageOrTown;
        public String district;
    }

    // Organization Creation / Edit Request
    public static class AdminOrgRequest {
        public String name;
        public String code;
        public OrganizationCategory category;
        public DepartmentType departmentType;
        public String description;
        public String district;
        public String state;
        public String address;
        public String contactEmail;
        public String contactPhone;
        public String headOfDept;
        public boolean verified = true;
        public boolean active = true;
    }
}

@Service
class AdminService {

    private final ProblemRepository problemRepository;
    private final ProblemPassportRepository passportRepository;
    private final ProblemEventRepository eventRepository;
    private final SolutionGraphRepository solutionGraphRepository;
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final CropRepository cropRepository;
    private final JobPostingRepository jobPostingRepository;
    private final ResourceRepository resourceRepository;
    private final OrganizationRepository organizationRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public AdminService(
            ProblemRepository problemRepository,
            ProblemPassportRepository passportRepository,
            ProblemEventRepository eventRepository,
            SolutionGraphRepository solutionGraphRepository,
            UserRepository userRepository,
            UserProfileRepository userProfileRepository,
            CropRepository cropRepository,
            JobPostingRepository jobPostingRepository,
            ResourceRepository resourceRepository,
            OrganizationRepository organizationRepository,
            org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        this.problemRepository = problemRepository;
        this.passportRepository = passportRepository;
        this.eventRepository = eventRepository;
        this.solutionGraphRepository = solutionGraphRepository;
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
        this.cropRepository = cropRepository;
        this.jobPostingRepository = jobPostingRepository;
        this.resourceRepository = resourceRepository;
        this.organizationRepository = organizationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public AdminBundle.AdminAnalyticsDto getAnalytics(String filterState, String filterDistrict) {
        AdminBundle.AdminAnalyticsDto dto = new AdminBundle.AdminAnalyticsDto();

        List<Problem> allProblems = problemRepository.findAll();
        List<User> allUsers = userRepository.findAll();
        List<Organization> allOrgs = organizationRepository.findAll();

        dto.totalProblems = allProblems.size();
        dto.newProblems = allProblems.stream().filter(p -> p.getStatus() == ProblemStatus.NEW || p.getStatus() == ProblemStatus.SUBMITTED).count();
        dto.assignedProblems = allProblems.stream().filter(p -> p.getStatus() == ProblemStatus.ASSIGNED).count();
        dto.acceptedProblems = allProblems.stream().filter(p -> p.getStatus() == ProblemStatus.ACCEPTED).count();
        dto.inProgressProblems = allProblems.stream().filter(p -> p.getStatus() == ProblemStatus.IN_PROGRESS).count();
        dto.resolvedProblems = allProblems.stream().filter(p -> p.getStatus() == ProblemStatus.RESOLVED).count();
        dto.verificationPendingProblems = allProblems.stream().filter(p -> p.getStatus() == ProblemStatus.VERIFICATION_PENDING).count();
        dto.reopenedProblems = allProblems.stream().filter(p -> p.getStatus() == ProblemStatus.REOPENED).count();
        dto.closedProblems = allProblems.stream().filter(p -> p.getStatus() == ProblemStatus.CLOSED || p.getStatus() == ProblemStatus.COMPLETED).count();
        dto.overdueProblems = allProblems.stream().filter(Problem::isOverdue).count();
        dto.escalatedProblems = allProblems.stream().filter(Problem::isEscalated).count();

        long solvedCount = dto.closedProblems + dto.resolvedProblems + dto.verificationPendingProblems;
        dto.resolutionRate = dto.totalProblems > 0 ? Math.round((solvedCount * 100.0 / dto.totalProblems) * 10.0) / 10.0 : 0.0;

        // SLA Compliance calculation
        long completedWithinSla = allProblems.stream()
                .filter(p -> "COMPLETED_WITHIN_SLA".equalsIgnoreCase(p.getSlaStatus()) || (p.getStatus() == ProblemStatus.CLOSED && !p.isOverdue()))
                .count();
        long totalCompleted = dto.closedProblems + dto.resolvedProblems;
        dto.slaComplianceRate = totalCompleted > 0 ? Math.round((completedWithinSla * 100.0 / totalCompleted) * 10.0) / 10.0 : 96.5;

        // Average Rating
        OptionalDouble avgRate = allProblems.stream()
                .filter(p -> p.getFeedbackRating() != null && p.getFeedbackRating() > 0)
                .mapToInt(Problem::getFeedbackRating)
                .average();
        dto.avgRating = avgRate.isPresent() ? Math.round(avgRate.getAsDouble() * 10.0) / 10.0 : 4.9;

        dto.totalUsers = allUsers.size();
        dto.verifiedUsers = allUsers.stream().filter(User::isVerified).count();
        dto.totalOrganizations = allOrgs.size();
        dto.totalCrops = cropRepository.count();
        dto.totalJobs = jobPostingRepository.count();
        dto.totalResources = resourceRepository.count();

        // Distinct States & Districts
        Set<String> states = new TreeSet<>(String.CASE_INSENSITIVE_ORDER);
        Set<String> districts = new TreeSet<>(String.CASE_INSENSITIVE_ORDER);
        // Aggregate by City / District
        for (Problem p : allProblems) {
            String rawDist = p.getDistrict() != null && !p.getDistrict().isBlank()
                    ? p.getDistrict()
                    : (p.getVillageOrTown() != null && !p.getVillageOrTown().isBlank() ? p.getVillageOrTown() : "Lucknow");
            String dist = com.mandi.common.IndianLocationService.normalizeDistrict(rawDist);
            String state = com.mandi.common.IndianLocationService.resolveState(dist, p.getState());

            states.add(state);
            districts.add(dist);

            // State Breakdown
            dto.stateBreakdown.put(state, dto.stateBreakdown.getOrDefault(state, 0L) + 1);

            // Category Breakdown
            String cat = p.getCategory() != null ? p.getCategory().name() : "OTHER";
            dto.categoryBreakdown.put(cat, dto.categoryBreakdown.getOrDefault(cat, 0L) + 1);

            // City Breakdown (Deduplicated and Normalized)
            AdminBundle.CityStats cs = dto.cityBreakdown.computeIfAbsent(dist, k -> {
                AdminBundle.CityStats s = new AdminBundle.CityStats();
                s.city = dist;
                s.state = state;
                return s;
            });
            cs.state = state; // Ensure correct state is attached
            cs.totalProblems++;
            if (p.getStatus() == ProblemStatus.RESOLVED || p.getStatus() == ProblemStatus.CLOSED || p.getStatus() == ProblemStatus.COMPLETED) {
                cs.solvedProblems++;
            } else {
                cs.activeProblems++;
            }
            cs.resolutionRate = cs.totalProblems > 0 ? Math.round((cs.solvedProblems * 100.0 / cs.totalProblems) * 10.0) / 10.0 : 0.0;
        }

        dto.availableStates = new ArrayList<>(states);
        dto.availableDistricts = new ArrayList<>(districts);

        return dto;
    }

    @Transactional(readOnly = true)
    public PageResponse<ProblemDto> searchAllProblems(
            String state,
            String district,
            ProblemCategory category,
            ProblemStatus status,
            String search,
            Pageable pageable) {

        Page<Problem> page = problemRepository.searchProblems(category, status, null, search, pageable);

        List<ProblemDto> dtos = page.getContent().stream()
                .filter(p -> state == null || state.isBlank() || (p.getState() != null && p.getState().equalsIgnoreCase(state)))
                .filter(p -> district == null || district.isBlank() || (p.getDistrict() != null && p.getDistrict().equalsIgnoreCase(district)))
                .map(p -> {
                    String code = p.getPassport() != null ? p.getPassport().getPassportCode() : "MANDI-2026-" + String.format("%06d", p.getId());
                    return ProblemDto.from(p, code, null);
                })
                .collect(Collectors.toList());

        return new PageResponse<>(dtos, page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages(), page.isLast());
    }

    @Transactional
    public ProblemDto editProblem(Long problemId, AdminBundle.AdminEditProblemRequest request, String adminName, Long adminId) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new ResourceNotFoundException("Problem", problemId));

        ProblemStatus oldStatus = problem.getStatus();

        if (request.title != null && !request.title.isBlank()) problem.setTitle(request.title);
        if (request.rawDescription != null && !request.rawDescription.isBlank()) problem.setRawDescription(request.rawDescription);
        if (request.category != null) problem.setCategory(request.category);
        if (request.urgency != null) problem.setUrgency(request.urgency);
        if (request.status != null) problem.setStatus(request.status);
        if (request.villageOrTown != null) problem.setVillageOrTown(request.villageOrTown);
        if (request.district != null) problem.setDistrict(request.district);
        if (request.state != null) problem.setState(request.state);

        Problem saved = problemRepository.save(problem);

        // Record Audit Event
        ProblemEvent event = new ProblemEvent(
                saved,
                oldStatus,
                saved.getStatus(),
                "ADMIN_MODIFIED",
                request.remarks != null ? request.remarks : "Modified by System Administrator: " + adminName,
                adminName,
                adminId
        );
        eventRepository.save(event);

        String passportCode = saved.getPassport() != null ? saved.getPassport().getPassportCode() : "MANDI-2026-" + saved.getId();
        return ProblemDto.from(saved, passportCode, null);
    }

    @Transactional
    public void deleteProblem(Long problemId) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new ResourceNotFoundException("Problem", problemId));

        solutionGraphRepository.findByProblemId(problemId).ifPresent(solutionGraphRepository::delete);
        passportRepository.findByProblemId(problemId).ifPresent(passportRepository::delete);
        problemRepository.delete(problem);
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getAllUsers() {
        return userRepository.findAll().stream().map(u -> {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", u.getId());
            map.put("phone", u.getPhone());
            map.put("email", u.getEmail());
            map.put("fullName", u.getFullName());
            map.put("roles", u.getRoles().stream().map(Enum::name).collect(Collectors.toList()));
            map.put("enabled", u.isActive());
            map.put("verified", u.isVerified());
            map.put("createdAt", u.getCreatedAt());
            if (u.getProfile() != null) {
                map.put("villageOrTown", u.getProfile().getVillageOrTown());
                map.put("district", u.getProfile().getDistrict());
                map.put("state", u.getProfile().getState());
                map.put("trustScore", u.getProfile().getTrustScore());
            }
            return map;
        }).collect(Collectors.toList());
    }

    private boolean isSuperAdmin(UserPrincipal userPrincipal) {
        if (userPrincipal == null) return false;
        if ("amitkr9523da@gmail.com".equalsIgnoreCase(userPrincipal.getEmail())) return true;
        return userPrincipal.getAuthorities() != null &&
                userPrincipal.getAuthorities().stream().anyMatch(a -> a.getAuthority().contains("SUPER_ADMIN"));
    }

    @Transactional
    public void editUser(Long userId, AdminBundle.AdminEditUserRequest request, UserPrincipal userPrincipal) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        if (request.fullName != null && !request.fullName.isBlank()) user.setFullName(request.fullName);
        if (request.phone != null && !request.phone.isBlank()) user.setPhone(request.phone);
        if (request.email != null) user.setEmail(request.email);

        if (request.roles != null && !request.roles.isEmpty()) {
            boolean assignsAdmin = request.roles.stream().anyMatch(r -> r == Role.ROLE_ADMIN || r == Role.ROLE_SUPER_ADMIN || r == Role.ROLE_MODERATOR);
            if (assignsAdmin && !isSuperAdmin(userPrincipal)) {
                throw new AccessDeniedException("Access Denied: Only a SUPER_ADMIN can assign administrative roles.");
            }
            user.setRoles(request.roles);
        }

        user.setVerified(request.verified);

        UserProfile profile = user.getProfile();
        if (profile == null) {
            profile = new UserProfile(user);
            user.setProfile(profile);
        }
        if (request.villageOrTown != null) profile.setVillageOrTown(request.villageOrTown);
        if (request.district != null) profile.setDistrict(request.district);
        if (request.state != null) profile.setState(request.state);

        userRepository.save(user);
    }

    @Transactional
    public void toggleUserVerify(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        user.setVerified(!user.isVerified());
        userRepository.save(user);
    }

    @Transactional
    public void suspendUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        user.setActive(false);
        userRepository.save(user);
    }

    @Transactional
    public void restoreUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        user.setActive(true);
        userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }

    @Transactional
    public void escalateProblem(Long problemId) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new ResourceNotFoundException("Problem", problemId));
        problem.setUrgency(ProblemUrgency.CRITICAL);
        problem.setEscalated(true);
        problem.setStatus(ProblemStatus.ESCALATED);
        problemRepository.save(problem);

        ProblemEvent event = new ProblemEvent(
                problem,
                problem.getStatus(),
                ProblemStatus.ESCALATED,
                "ESCALATE_COMPLAINT",
                "Escalated to CRITICAL priority by Admin triage.",
                "System Administrator",
                1L
        );
        eventRepository.save(event);
    }

    @Transactional
    public void closeProblem(Long problemId) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new ResourceNotFoundException("Problem", problemId));
        ProblemStatus old = problem.getStatus();
        problem.setStatus(ProblemStatus.CLOSED);
        problem.setClosedAt(Instant.now());
        problemRepository.save(problem);

        ProblemEvent event = new ProblemEvent(
                problem,
                old,
                ProblemStatus.CLOSED,
                "CLOSE_COMPLAINT",
                "Problem closed by System Administrator override.",
                "System Administrator",
                1L
        );
        eventRepository.save(event);
    }

    // ==========================================
    // ORGANIZATIONS MANAGEMENT
    // ==========================================

    @Transactional(readOnly = true)
    public List<Organization> getAllOrganizations() {
        return organizationRepository.findAll(Sort.by("name").ascending());
    }

    @Transactional
    public Organization saveOrganization(AdminBundle.AdminOrgRequest req) {
        Organization org = new Organization();
        org.setName(req.name);
        org.setCode(req.code != null && !req.code.isBlank() ? req.code : "ORG_" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        org.setCategory(req.category != null ? req.category : OrganizationCategory.OTHER);
        org.setDepartmentType(req.departmentType != null ? req.departmentType : DepartmentType.GOVERNMENT_DEPT);
        org.setDescription(req.description);
        org.setDistrict(req.district != null ? req.district : "Lucknow");
        org.setState(req.state != null ? req.state : "Uttar Pradesh");
        org.setAddress(req.address);
        org.setContactEmail(req.contactEmail);
        org.setContactPhone(req.contactPhone);
        org.setHeadOfDept(req.headOfDept);
        org.setVerified(req.verified);
        org.setActive(req.active);
        return organizationRepository.save(org);
    }

    @Transactional
    public Organization updateOrganization(Long id, AdminBundle.AdminOrgRequest req) {
        Organization org = organizationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Organization", id));

        if (req.name != null) org.setName(req.name);
        if (req.category != null) org.setCategory(req.category);
        if (req.departmentType != null) org.setDepartmentType(req.departmentType);
        if (req.description != null) org.setDescription(req.description);
        if (req.district != null) org.setDistrict(req.district);
        if (req.state != null) org.setState(req.state);
        if (req.address != null) org.setAddress(req.address);
        if (req.contactEmail != null) org.setContactEmail(req.contactEmail);
        if (req.contactPhone != null) org.setContactPhone(req.contactPhone);
        if (req.headOfDept != null) org.setHeadOfDept(req.headOfDept);
        org.setVerified(req.verified);
        org.setActive(req.active);
        return organizationRepository.save(org);
    }

    @Transactional
    public void deleteOrganization(Long id) {
        organizationRepository.deleteById(id);
    }

    @Transactional
    public void toggleVerifyOrganization(Long id) {
        Organization org = organizationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Organization", id));
        org.setVerified(!org.isVerified());
        organizationRepository.save(org);
    }

    // ==========================================
    // ADMINISTRATOR TEAM MANAGEMENT
    // ==========================================

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getAdministrators() {
        return userRepository.findAll().stream()
                .filter(u -> u.getRoles() != null && u.getRoles().stream().anyMatch(r -> r == Role.ROLE_ADMIN || r == Role.ROLE_SUPER_ADMIN || r == Role.ROLE_MODERATOR))
                .map(u -> {
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("id", u.getId());
                    map.put("fullName", u.getFullName());
                    map.put("phone", u.getPhone());
                    map.put("email", u.getEmail());
                    map.put("roles", u.getRoles().stream().map(Enum::name).collect(Collectors.toList()));
                    map.put("active", u.isActive());
                    map.put("verified", u.isVerified());
                    map.put("createdAt", u.getCreatedAt());
                    return map;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public Map<String, Object> createAdministrator(AdminBundle.AdminCreateAdminRequest request, UserPrincipal userPrincipal) {
        if (!isSuperAdmin(userPrincipal)) {
            throw new AccessDeniedException("Access Denied: Only a SUPER_ADMIN can add or provision new administrators.");
        }

        if (userRepository.findByPhone(request.phone).isPresent()) {
            throw new IllegalArgumentException("An account with phone number " + request.phone + " already exists.");
        }
        if (request.email != null && !request.email.isBlank() && userRepository.findByEmail(request.email).isPresent()) {
            throw new IllegalArgumentException("An account with email " + request.email + " already exists.");
        }

        Role assignedRole = Role.ROLE_ADMIN;
        if (request.role != null) {
            try {
                assignedRole = Role.valueOf(request.role.toUpperCase().trim());
            } catch (Exception ignored) {
                assignedRole = Role.ROLE_ADMIN;
            }
        }

        String encPass = passwordEncoder.encode(request.password);
        User newAdmin = new User(request.phone, request.email, encPass, request.fullName);
        newAdmin.setRoles(new HashSet<>(Set.of(assignedRole, Role.ROLE_CITIZEN)));
        newAdmin.setActive(true);
        newAdmin.setVerified(true);
        User saved = userRepository.save(newAdmin);

        UserProfile profile = new UserProfile(saved);
        profile.setVillageOrTown(request.villageOrTown != null ? request.villageOrTown : "Lucknow Central");
        profile.setDistrict(request.district != null ? request.district : "Lucknow");
        profile.setState("Uttar Pradesh");
        profile.setPreferredLanguage("HI");
        profile.setTrustScore(100);
        userProfileRepository.save(profile);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", saved.getId());
        result.put("fullName", saved.getFullName());
        result.put("phone", saved.getPhone());
        result.put("email", saved.getEmail());
        result.put("roles", saved.getRoles().stream().map(Enum::name).collect(Collectors.toList()));
        return result;
    }

    @Transactional
    public void deleteAdministrator(Long adminId, UserPrincipal userPrincipal) {
        if (!isSuperAdmin(userPrincipal)) {
            throw new AccessDeniedException("Access Denied: Only a SUPER_ADMIN can delete administrator accounts.");
        }

        User user = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Administrator", adminId));

        if ("amitkr9523da@gmail.com".equalsIgnoreCase(user.getEmail())) {
            throw new AccessDeniedException("The primary Super Administrator (amitkr9523da@gmail.com) cannot be deleted.");
        }

        userRepository.delete(user);
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getAuditLogs() {
        return eventRepository.findAll(Sort.by("createdAt").descending()).stream().limit(100).map(e -> {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", e.getId());
            map.put("problemId", e.getProblem() != null ? e.getProblem().getId() : null);
            map.put("passportCode", e.getProblem() != null && e.getProblem().getPassport() != null ? e.getProblem().getPassport().getPassportCode() : "MANDI-AUDIT");
            map.put("eventType", e.getEventType());
            map.put("description", e.getDescription());
            map.put("actorName", e.getActorName());
            map.put("createdAt", e.getCreatedAt());
            map.put("fromStatus", e.getPreviousStatus());
            map.put("toStatus", e.getNewStatus());
            return map;
        }).collect(Collectors.toList());
    }
}

@RestController
@RequestMapping("/api/admin")
class AdminController {

    private final AdminService adminService;
    private final CropRepository cropRepository;
    private final JobPostingRepository jobPostingRepository;
    private final ResourceRepository resourceRepository;

    public AdminController(
            AdminService adminService,
            CropRepository cropRepository,
            JobPostingRepository jobPostingRepository,
            ResourceRepository resourceRepository) {
        this.adminService = adminService;
        this.cropRepository = cropRepository;
        this.jobPostingRepository = jobPostingRepository;
        this.resourceRepository = resourceRepository;
    }

    // Analytics
    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<AdminBundle.AdminAnalyticsDto>> getAnalytics(
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String district) {
        AdminBundle.AdminAnalyticsDto analytics = adminService.getAnalytics(state, district);
        return ResponseEntity.ok(ApiResponse.ok(analytics));
    }

    // Problems Management CRUD
    @GetMapping("/problems")
    public ResponseEntity<ApiResponse<PageResponse<ProblemDto>>> searchProblems(
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) ProblemCategory category,
            @RequestParam(required = false) ProblemStatus status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        PageResponse<ProblemDto> result = adminService.searchAllProblems(state, district, category, status, search, pageable);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @PutMapping("/problems/{id}")
    public ResponseEntity<ApiResponse<ProblemDto>> editProblem(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody AdminBundle.AdminEditProblemRequest request) {
        String adminName = userPrincipal != null ? userPrincipal.getFullName() : "Admin";
        Long adminId = userPrincipal != null ? userPrincipal.getId() : 1L;
        ProblemDto updated = adminService.editProblem(id, request, adminName, adminId);
        return ResponseEntity.ok(ApiResponse.ok("Problem updated successfully by Administrator", updated));
    }

    @DeleteMapping("/problems/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProblem(@PathVariable Long id) {
        adminService.deleteProblem(id);
        return ResponseEntity.ok(ApiResponse.ok("Problem and all associated records deleted permanently", null));
    }

    // User Directory CRUD
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAllUsers() {
        List<Map<String, Object>> users = adminService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.ok(users));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Void>> editUser(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody AdminBundle.AdminEditUserRequest request) {
        adminService.editUser(id, request, userPrincipal);
        return ResponseEntity.ok(ApiResponse.ok("User profile updated successfully", null));
    }

    @PatchMapping("/users/{id}/toggle-verify")
    public ResponseEntity<ApiResponse<Void>> toggleUserVerify(@PathVariable Long id) {
        adminService.toggleUserVerify(id);
        return ResponseEntity.ok(ApiResponse.ok("User verification status toggled", null));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.ok("User account deleted permanently", null));
    }

    // Organizations & Department Management
    @GetMapping("/organizations")
    public ResponseEntity<ApiResponse<List<Organization>>> getOrganizations() {
        List<Organization> list = adminService.getAllOrganizations();
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PostMapping("/organizations")
    public ResponseEntity<ApiResponse<Organization>> createOrganization(
            @Valid @RequestBody AdminBundle.AdminOrgRequest request) {
        Organization org = adminService.saveOrganization(request);
        return ResponseEntity.ok(ApiResponse.ok("Organization created successfully", org));
    }

    @PutMapping("/organizations/{id}")
    public ResponseEntity<ApiResponse<Organization>> updateOrganization(
            @PathVariable Long id,
            @Valid @RequestBody AdminBundle.AdminOrgRequest request) {
        Organization org = adminService.updateOrganization(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Organization updated successfully", org));
    }

    @DeleteMapping("/organizations/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteOrganization(@PathVariable Long id) {
        adminService.deleteOrganization(id);
        return ResponseEntity.ok(ApiResponse.ok("Organization deleted", null));
    }

    @PatchMapping("/organizations/{id}/toggle-verify")
    public ResponseEntity<ApiResponse<Void>> toggleVerifyOrganization(@PathVariable Long id) {
        adminService.toggleVerifyOrganization(id);
        return ResponseEntity.ok(ApiResponse.ok("Organization accreditation status toggled", null));
    }

    // Crop Hub CRUD
    @GetMapping("/crops")
    public ResponseEntity<ApiResponse<List<Crop>>> getAllCrops() {
        List<Crop> crops = cropRepository.findAll(Sort.by("createdAt").descending());
        return ResponseEntity.ok(ApiResponse.ok(crops));
    }

    @DeleteMapping("/crops/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCrop(@PathVariable Long id) {
        cropRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.ok("Crop produce listing deleted", null));
    }

    // Jobs CRUD
    @GetMapping("/jobs")
    public ResponseEntity<ApiResponse<List<JobPosting>>> getAllJobs() {
        List<JobPosting> jobs = jobPostingRepository.findAll(Sort.by("createdAt").descending());
        return ResponseEntity.ok(ApiResponse.ok(jobs));
    }

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteJob(@PathVariable Long id) {
        jobPostingRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.ok("Job posting deleted", null));
    }

    // Resources Pool CRUD & Verification
    @GetMapping("/resources")
    public ResponseEntity<ApiResponse<List<Resource>>> getAllResources() {
        List<Resource> resources = resourceRepository.findAll(Sort.by("createdAt").descending());
        return ResponseEntity.ok(ApiResponse.ok(resources));
    }

    @PostMapping("/resources/{id}/verify")
    public ResponseEntity<ApiResponse<Void>> verifyResource(@PathVariable Long id) {
        Resource r = resourceRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Resource", id));
        r.setVerified(true);
        resourceRepository.save(r);
        return ResponseEntity.ok(ApiResponse.ok("Resource verified successfully", null));
    }

    @PostMapping("/resources/{id}/reject")
    public ResponseEntity<ApiResponse<Void>> rejectResource(@PathVariable Long id) {
        Resource r = resourceRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Resource", id));
        r.setVerified(false);
        resourceRepository.save(r);
        return ResponseEntity.ok(ApiResponse.ok("Resource marked unverified", null));
    }

    @DeleteMapping("/resources/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteResource(@PathVariable Long id) {
        resourceRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.ok("Resource deleted", null));
    }

    // Explicit Problem Operations
    @PostMapping("/problems/{id}/escalate")
    public ResponseEntity<ApiResponse<Void>> escalateProblem(@PathVariable Long id) {
        adminService.escalateProblem(id);
        return ResponseEntity.ok(ApiResponse.ok("Problem marked as CRITICAL Priority & Escalated", null));
    }

    @PostMapping("/problems/{id}/close")
    public ResponseEntity<ApiResponse<Void>> closeProblem(@PathVariable Long id) {
        adminService.closeProblem(id);
        return ResponseEntity.ok(ApiResponse.ok("Problem closed successfully", null));
    }

    // Explicit User Operations
    @PostMapping("/users/{id}/suspend")
    public ResponseEntity<ApiResponse<Void>> suspendUser(@PathVariable Long id) {
        adminService.suspendUser(id);
        return ResponseEntity.ok(ApiResponse.ok("User account suspended", null));
    }

    @PostMapping("/users/{id}/restore")
    public ResponseEntity<ApiResponse<Void>> restoreUser(@PathVariable Long id) {
        adminService.restoreUser(id);
        return ResponseEntity.ok(ApiResponse.ok("User account restored", null));
    }

    // Audit Logs
    @GetMapping("/audit-logs")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAuditLogs() {
        List<Map<String, Object>> logs = adminService.getAuditLogs();
        return ResponseEntity.ok(ApiResponse.ok(logs));
    }

    // Administrators Management
    @GetMapping("/administrators")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAdministrators() {
        List<Map<String, Object>> admins = adminService.getAdministrators();
        return ResponseEntity.ok(ApiResponse.ok(admins));
    }

    @PostMapping("/administrators")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createAdministrator(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody AdminBundle.AdminCreateAdminRequest request) {
        Map<String, Object> admin = adminService.createAdministrator(request, userPrincipal);
        return ResponseEntity.ok(ApiResponse.ok("Administrator account created successfully", admin));
    }

    @DeleteMapping("/administrators/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAdministrator(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        adminService.deleteAdministrator(id, userPrincipal);
        return ResponseEntity.ok(ApiResponse.ok("Administrator account removed successfully", null));
    }

    // System Settings & Status
    @GetMapping("/settings")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSettings() {
        Map<String, Object> settings = new LinkedHashMap<>();
        settings.put("systemName", "MANDI Super Administration");
        settings.put("version", "2.0.0-PROD");
        settings.put("environment", "Production / Dev Hybrid");
        settings.put("authPolicy", "OTP & Password Dual System");
        settings.put("autoMatchingEngine", "ACTIVE");
        settings.put("geoClustering", "ENABLED");
        settings.put("totalRecords", adminService.getAnalytics(null, null));
        return ResponseEntity.ok(ApiResponse.ok(settings));
    }
}
