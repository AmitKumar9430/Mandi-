package com.mandi.problem;

import com.mandi.common.ApiResponse;
import com.mandi.common.PageResponse;
import com.mandi.problem.dto.*;
import com.mandi.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/problems")
public class ProblemController {

    private final ProblemService problemService;

    public ProblemController(ProblemService problemService) {
        this.problemService = problemService;
    }

    @PostMapping("/classify-preview")
    public ResponseEntity<ApiResponse<ClassifyPreviewResponse>> previewClassification(
            @RequestParam String text,
            @RequestParam(required = false) ProblemCategory category) {
        ClassifyPreviewResponse response = problemService.previewClassification(text, category);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/detect-duplicates")
    public ResponseEntity<ApiResponse<DuplicateCheckResponse>> detectDuplicates(
            @RequestParam(required = false) ProblemCategory category,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String text) {
        DuplicateCheckResponse response = problemService.detectDuplicates(category, district, text);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProblemDto>> createProblem(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody CreateProblemRequest request) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        ProblemDto created = problemService.createProblem(userId, request);
        return ResponseEntity.ok(ApiResponse.ok("Complaint registered successfully. Ticket generated: " + created.getPassportCode(), created));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProblemDto>> getProblemById(@PathVariable Long id) {
        ProblemDto problem = problemService.getProblemById(id);
        return ResponseEntity.ok(ApiResponse.ok(problem));
    }

    @GetMapping("/{id}/best-matches")
    public ResponseEntity<ApiResponse<List<com.mandi.matching.MatchingEngineService.MatchCandidate>>> getBestMatches(
            @PathVariable Long id,
            @RequestParam(defaultValue = "5") int limit) {
        List<com.mandi.matching.MatchingEngineService.MatchCandidate> matches = problemService.getBestMatches(id, limit);
        return ResponseEntity.ok(ApiResponse.ok(matches));
    }

    @GetMapping("/passport/{code}")
    public ResponseEntity<ApiResponse<ProblemDto>> getPassportByCode(@PathVariable String code) {
        ProblemPassportDto passport = problemService.getPassportByCode(code);
        ProblemDto problem = problemService.getProblemById(passport.getProblemId());
        return ResponseEntity.ok(ApiResponse.ok(problem));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ProblemDto>>> searchProblems(
            @RequestParam(required = false) ProblemCategory category,
            @RequestParam(required = false) ProblemStatus status,
            @RequestParam(required = false) ProblemUrgency urgency,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) Long orgId,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        PageResponse<ProblemDto> result = problemService.searchProblems(category, status, urgency, district, orgId, search, pageable);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<PageResponse<ProblemDto>>> getMyProblems(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        if (userPrincipal == null) {
            return ResponseEntity.ok(ApiResponse.ok(new PageResponse<>(List.of(), 0, size, 0, 0, true)));
        }
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        PageResponse<ProblemDto> result = problemService.getUserProblems(userPrincipal.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/organization/{orgId}")
    public ResponseEntity<ApiResponse<PageResponse<ProblemDto>>> getOrganizationProblems(
            @PathVariable Long orgId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        PageResponse<ProblemDto> result = problemService.getOrganizationProblems(orgId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/map")
    public ResponseEntity<ApiResponse<List<ProblemDto>>> getMapProblems() {
        List<ProblemDto> mapProblems = problemService.getMapProblems();
        return ResponseEntity.ok(ApiResponse.ok(mapProblems));
    }

    // ==========================================
    // WORKFLOW TRANSITION ACTION APIS
    // ==========================================

    @PostMapping("/{id}/assign")
    public ResponseEntity<ApiResponse<ProblemDto>> assignComplaint(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody AssignComplaintRequest request) {
        Long actorId = userPrincipal != null ? userPrincipal.getId() : null;
        String actorName = userPrincipal != null ? userPrincipal.getFullName() : "System Admin";
        ProblemDto updated = problemService.assignComplaint(id, actorId, actorName, request);
        return ResponseEntity.ok(ApiResponse.ok("Complaint assigned to organization successfully.", updated));
    }

    @PostMapping("/{id}/accept")
    public ResponseEntity<ApiResponse<ProblemDto>> acceptComplaint(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody(required = false) Map<String, String> body) {
        Long actorId = userPrincipal != null ? userPrincipal.getId() : null;
        String actorName = userPrincipal != null ? userPrincipal.getFullName() : "Organization Resolver";
        String remarks = body != null ? body.get("remarks") : null;
        ProblemDto updated = problemService.acceptComplaint(id, actorId, actorName, remarks);
        return ResponseEntity.ok(ApiResponse.ok("Task accepted. Work scheduled.", updated));
    }

    @PostMapping("/{id}/start-work")
    public ResponseEntity<ApiResponse<ProblemDto>> startWork(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody(required = false) Map<String, String> body) {
        Long actorId = userPrincipal != null ? userPrincipal.getId() : null;
        String actorName = userPrincipal != null ? userPrincipal.getFullName() : "Field Resolver";
        String remarks = body != null ? body.get("remarks") : null;
        ProblemDto updated = problemService.startWork(id, actorId, actorName, remarks);
        return ResponseEntity.ok(ApiResponse.ok("Work marked in progress.", updated));
    }

    @PostMapping("/{id}/progress")
    public ResponseEntity<ApiResponse<ProblemDto>> addProgress(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody ProgressUpdateRequest request) {
        Long actorId = userPrincipal != null ? userPrincipal.getId() : null;
        String actorName = userPrincipal != null ? userPrincipal.getFullName() : "Field Team";
        ProblemDto updated = problemService.addProgress(id, actorId, actorName, request);
        return ResponseEntity.ok(ApiResponse.ok("Progress report added successfully.", updated));
    }

    @PostMapping("/{id}/mark-completed")
    public ResponseEntity<ApiResponse<ProblemDto>> markCompleted(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody MarkCompletedRequest request) {
        Long actorId = userPrincipal != null ? userPrincipal.getId() : null;
        String actorName = userPrincipal != null ? userPrincipal.getFullName() : "Field Team";
        ProblemDto updated = problemService.markCompleted(id, actorId, actorName, request);
        return ResponseEntity.ok(ApiResponse.ok("Work marked completed. Citizen verification requested.", updated));
    }

    @PostMapping("/{id}/verify")
    public ResponseEntity<ApiResponse<ProblemDto>> verifyResolution(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody VerifyResolutionRequest request) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        String userName = userPrincipal != null ? userPrincipal.getFullName() : "Citizen";
        ProblemDto updated = problemService.verifyResolution(id, userId, userName, request);
        String msg = request.isVerified()
                ? "Resolution verified! Please share your rating & feedback."
                : "Complaint reopened. Administrative escalation dispatched.";
        return ResponseEntity.ok(ApiResponse.ok(msg, updated));
    }

    @PostMapping("/{id}/feedback")
    public ResponseEntity<ApiResponse<ProblemDto>> submitFeedback(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody SubmitFeedbackRequest request) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        String userName = userPrincipal != null ? userPrincipal.getFullName() : "Citizen";
        ProblemDto updated = problemService.submitFeedback(id, userId, userName, request);
        return ResponseEntity.ok(ApiResponse.ok("Thank you! Feedback recorded and ticket closed.", updated));
    }

    @PostMapping("/{id}/escalate")
    public ResponseEntity<ApiResponse<ProblemDto>> escalateProblem(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody EscalateComplaintRequest request) {
        Long actorId = userPrincipal != null ? userPrincipal.getId() : null;
        String actorName = userPrincipal != null ? userPrincipal.getFullName() : "Admin";
        ProblemDto updated = problemService.escalateProblem(id, actorId, actorName, request);
        return ResponseEntity.ok(ApiResponse.ok("Complaint escalated to CRITICAL priority.", updated));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<ApiResponse<ProblemDto>> addCitizenComment(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody Map<String, String> body) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        String userName = userPrincipal != null ? userPrincipal.getFullName() : "Citizen";
        String comment = body.getOrDefault("comment", "");
        String photoUrl = body.get("photoUrl");
        ProblemDto updated = problemService.addCitizenComment(id, userId, userName, comment, photoUrl);
        return ResponseEntity.ok(ApiResponse.ok("Comment added to timeline.", updated));
    }

    @PostMapping("/{id}/internal-note")
    public ResponseEntity<ApiResponse<ProblemDto>> addInternalNote(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody Map<String, String> body) {
        Long adminId = userPrincipal != null ? userPrincipal.getId() : null;
        String adminName = userPrincipal != null ? userPrincipal.getFullName() : "Admin";
        String note = body.getOrDefault("note", "");
        ProblemDto updated = problemService.addInternalNote(id, adminId, adminName, note);
        return ResponseEntity.ok(ApiResponse.ok("Internal note added to audit trail.", updated));
    }
}
