package com.mandi.solution;

import com.mandi.exception.InvalidStateTransitionException;
import com.mandi.exception.ResourceNotFoundException;
import com.mandi.exception.UnauthorizedActionException;
import com.mandi.matching.MatchingEngineService;
import com.mandi.problem.Problem;
import com.mandi.problem.ProblemEvent;
import com.mandi.problem.ProblemEventRepository;
import com.mandi.problem.ProblemRepository;
import com.mandi.problem.ProblemStatus;
import com.mandi.resource.Resource;
import com.mandi.resource.ResourceRepository;
import com.mandi.solution.dto.*;
import com.mandi.user.User;
import com.mandi.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SolutionGraphService {

    private final SolutionGraphRepository solutionGraphRepository;
    private final SolutionStepRepository solutionStepRepository;
    private final ProblemRepository problemRepository;
    private final ProblemEventRepository eventRepository;
    private final ResourceRepository resourceRepository;
    private final UserRepository userRepository;
    private final MatchingEngineService matchingEngineService;

    public SolutionGraphService(
            SolutionGraphRepository solutionGraphRepository,
            SolutionStepRepository solutionStepRepository,
            ProblemRepository problemRepository,
            ProblemEventRepository eventRepository,
            ResourceRepository resourceRepository,
            UserRepository userRepository,
            MatchingEngineService matchingEngineService) {
        this.solutionGraphRepository = solutionGraphRepository;
        this.solutionStepRepository = solutionStepRepository;
        this.problemRepository = problemRepository;
        this.eventRepository = eventRepository;
        this.resourceRepository = resourceRepository;
        this.userRepository = userRepository;
        this.matchingEngineService = matchingEngineService;
    }

    @Transactional(readOnly = true)
    public SolutionGraphDto getSolutionByProblemId(Long problemId) {
        SolutionGraph graph = solutionGraphRepository.findByProblemId(problemId)
                .orElseThrow(() -> new ResourceNotFoundException("SolutionGraph for problem", problemId));
        return SolutionGraphDto.from(graph);
    }

    @Transactional(readOnly = true)
    public List<MatchingEngineService.MatchCandidate> getMatchesForProblem(Long problemId) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new ResourceNotFoundException("Problem", problemId));
        return matchingEngineService.findBestMatches(problem, 6);
    }

    @Transactional
    public SolutionGraphDto acceptSolutionGraph(Long problemId, Long userId) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new ResourceNotFoundException("Problem", problemId));

        if (!problem.getUser().getId().equals(userId)) {
            throw new UnauthorizedActionException("Only the problem creator can accept the solution path");
        }

        SolutionGraph graph = solutionGraphRepository.findByProblemId(problemId)
                .orElseThrow(() -> new ResourceNotFoundException("SolutionGraph for problem", problemId));

        graph.setAcceptedByUser(true);
        solutionGraphRepository.save(graph);

        ProblemStatus oldStatus = problem.getStatus();
        problem.setStatus(ProblemStatus.ASSIGNED);
        problemRepository.save(problem);

        ProblemEvent event = new ProblemEvent(
                problem,
                oldStatus,
                ProblemStatus.ASSIGNED,
                "SOLUTION_ACCEPTED",
                "User approved the solution path. Solution steps are now activated for execution.",
                problem.getUser().getFullName(),
                userId
        );
        eventRepository.save(event);

        return SolutionGraphDto.from(graph);
    }

    @Transactional
    public SolutionStepDto claimOrAssignStep(Long stepId, Long actorUserId, AssignStepRequest request) {
        SolutionStep step = solutionStepRepository.findById(stepId)
                .orElseThrow(() -> new ResourceNotFoundException("SolutionStep", stepId));

        User actor = userRepository.findById(actorUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", actorUserId));

        step.setAssignedUser(actor);
        step.setStatus(SolutionStepStatus.ASSIGNED);

        if (request != null && request.getResourceId() != null) {
            Resource resource = resourceRepository.findById(request.getResourceId()).orElse(null);
            step.setAssignedResource(resource);
            if (resource != null) {
                step.setAssignedEntityName(resource.getName());
                step.setContactPhone(resource.getContactPhone());
            }
        } else {
            step.setAssignedEntityName(actor.getFullName());
            step.setContactPhone(actor.getPhone());
        }

        if (request != null && request.getDeadline() != null) {
            step.setDeadline(request.getDeadline());
        }

        SolutionStep saved = solutionStepRepository.save(step);

        // Update Problem Status to IN_PROGRESS if not already
        Problem problem = step.getSolutionGraph().getProblem();
        if (problem.getStatus() != ProblemStatus.IN_PROGRESS) {
            ProblemStatus oldStatus = problem.getStatus();
            problem.setStatus(ProblemStatus.IN_PROGRESS);
            problemRepository.save(problem);

            ProblemEvent event = new ProblemEvent(
                    problem,
                    oldStatus,
                    ProblemStatus.IN_PROGRESS,
                    "STEP_ASSIGNED",
                    "Step " + step.getStepSequence() + " ('" + step.getTitle() + "') assigned to " + actor.getFullName() + ".",
                    actor.getFullName(),
                    actorUserId
            );
            eventRepository.save(event);
        }

        return SolutionStepDto.from(saved);
    }

    @Transactional
    public SolutionStepDto completeStep(Long stepId, Long actorUserId, CompleteStepRequest request) {
        SolutionStep step = solutionStepRepository.findById(stepId)
                .orElseThrow(() -> new ResourceNotFoundException("SolutionStep", stepId));

        step.setStatus(SolutionStepStatus.COMPLETED);
        step.setCompletedAt(Instant.now());
        step.setCompletionNotes(request.getCompletionNotes());
        SolutionStep saved = solutionStepRepository.save(step);

        SolutionGraph graph = step.getSolutionGraph();
        long completedCount = graph.getSteps().stream().filter(s -> s.getStatus() == SolutionStepStatus.COMPLETED).count();
        graph.setCompletedSteps((int) completedCount);

        // Unlock next step in sequence
        graph.getSteps().stream()
                .filter(s -> s.getStepSequence() == step.getStepSequence() + 1 && s.getStatus() == SolutionStepStatus.PENDING)
                .findFirst()
                .ifPresent(nextStep -> {
                    nextStep.setStatus(SolutionStepStatus.READY);
                    solutionStepRepository.save(nextStep);
                });

        solutionGraphRepository.save(graph);

        Problem problem = graph.getProblem();
        ProblemEvent event = new ProblemEvent(
                problem,
                problem.getStatus(),
                problem.getStatus(),
                "STEP_COMPLETED",
                "Step " + step.getStepSequence() + " ('" + step.getTitle() + "') completed: " + request.getCompletionNotes(),
                step.getAssignedEntityName() != null ? step.getAssignedEntityName() : "Assignee",
                actorUserId
        );
        eventRepository.save(event);

        return SolutionStepDto.from(saved);
    }

    @Transactional(readOnly = true)
    public List<SolutionStepDto> getClaimableSteps() {
        return solutionStepRepository.findClaimableSteps().stream()
                .map(SolutionStepDto::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SolutionStepDto> getUserTasks(Long userId) {
        return solutionStepRepository.findByAssignedUserId(userId).stream()
                .map(SolutionStepDto::from)
                .collect(Collectors.toList());
    }
}
