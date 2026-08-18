package com.mandi.solution;

import com.mandi.common.ApiResponse;
import com.mandi.matching.MatchingEngineService;
import com.mandi.security.UserPrincipal;
import com.mandi.solution.dto.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/solutions")
public class SolutionGraphController {

    private final SolutionGraphService solutionGraphService;

    public SolutionGraphController(SolutionGraphService solutionGraphService) {
        this.solutionGraphService = solutionGraphService;
    }

    @GetMapping("/problem/{problemId}")
    public ResponseEntity<ApiResponse<SolutionGraphDto>> getSolutionByProblemId(@PathVariable Long problemId) {
        SolutionGraphDto graph = solutionGraphService.getSolutionByProblemId(problemId);
        return ResponseEntity.ok(ApiResponse.ok(graph));
    }

    @GetMapping("/problem/{problemId}/matches")
    public ResponseEntity<ApiResponse<List<MatchingEngineService.MatchCandidate>>> getMatchesForProblem(@PathVariable Long problemId) {
        List<MatchingEngineService.MatchCandidate> matches = solutionGraphService.getMatchesForProblem(problemId);
        return ResponseEntity.ok(ApiResponse.ok(matches));
    }

    @PostMapping("/problem/{problemId}/accept")
    public ResponseEntity<ApiResponse<SolutionGraphDto>> acceptSolution(
            @PathVariable Long problemId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        SolutionGraphDto graph = solutionGraphService.acceptSolutionGraph(problemId, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Solution path accepted and activated", graph));
    }

    @PostMapping("/steps/{stepId}/claim")
    public ResponseEntity<ApiResponse<SolutionStepDto>> claimStep(
            @PathVariable Long stepId,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody(required = false) AssignStepRequest request) {
        SolutionStepDto step = solutionGraphService.claimOrAssignStep(stepId, userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Task step claimed successfully", step));
    }

    @PostMapping("/steps/{stepId}/complete")
    public ResponseEntity<ApiResponse<SolutionStepDto>> completeStep(
            @PathVariable Long stepId,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody CompleteStepRequest request) {
        SolutionStepDto step = solutionGraphService.completeStep(stepId, userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Task step marked completed", step));
    }

    @GetMapping("/tasks/claimable")
    public ResponseEntity<ApiResponse<List<SolutionStepDto>>> getClaimableSteps() {
        List<SolutionStepDto> steps = solutionGraphService.getClaimableSteps();
        return ResponseEntity.ok(ApiResponse.ok(steps));
    }

    @GetMapping("/tasks/my")
    public ResponseEntity<ApiResponse<List<SolutionStepDto>>> getMyTasks(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<SolutionStepDto> steps = solutionGraphService.getUserTasks(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok(steps));
    }
}
