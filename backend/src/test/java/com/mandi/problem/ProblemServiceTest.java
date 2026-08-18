package com.mandi.problem;

import com.mandi.matching.MatchingEngineService;
import com.mandi.matching.NoDeadEndFallbackService;
import com.mandi.problem.dto.CreateProblemRequest;
import com.mandi.problem.dto.ProblemDto;
import com.mandi.solution.SolutionGraph;
import com.mandi.solution.SolutionGraphRepository;
import com.mandi.solution.SolutionStep;
import com.mandi.solution.SolutionStepStatus;
import com.mandi.user.Role;
import com.mandi.user.User;
import com.mandi.user.UserProfile;
import com.mandi.user.UserProfileRepository;
import com.mandi.user.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProblemServiceTest {

    @Mock
    private ProblemRepository problemRepository;

    @Mock
    private ProblemPassportRepository passportRepository;

    @Mock
    private ProblemEventRepository eventRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserProfileRepository profileRepository;

    @Mock
    private StateTransitionValidator stateTransitionValidator;

    @Mock
    private ClassifierEngine classifierEngine;

    @Mock
    private MatchingEngineService matchingEngineService;

    @Mock
    private NoDeadEndFallbackService fallbackService;

    @Mock
    private SolutionGraphRepository solutionGraphRepository;

    @InjectMocks
    private ProblemService problemService;

    @Test
    @DisplayName("Creating a problem should classify intent, generate passport code, and create solution graph")
    void testCreateProblemLifecycle() {
        Long userId = 1L;
        User user = new User("9876543210", "citizen@mandi.org", "pass", "Rameshwar");
        user.setId(userId);
        user.setRoles(Set.of(Role.ROLE_CITIZEN));

        CreateProblemRequest req = new CreateProblemRequest();
        req.setRawDescription("Mere paas 50 quintal gehu hai aur buyer chahiye.");
        req.setVillageOrTown("Malihabad");

        ClassifierEngine.ClassificationResult classification = new ClassifierEngine.ClassificationResult(
                ProblemCategory.AGRICULTURE,
                ProblemUrgency.MEDIUM,
                "50 Quintal Wheat Produce Sale",
                List.of("agriculture", "kisan_seva"),
                List.of("Crop Buyer", "Tractor Transport"),
                "Listing -> Match -> Transport -> Sale"
        );

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(classifierEngine.classify(any(), any())).thenReturn(classification);

        Problem savedProblem = new Problem();
        savedProblem.setId(42L);
        savedProblem.setUser(user);
        savedProblem.setTitle(classification.getTitle());
        savedProblem.setCategory(classification.getCategory());
        savedProblem.setStatus(ProblemStatus.SUBMITTED);
        savedProblem.setRawDescription(req.getRawDescription());

        when(problemRepository.save(any(Problem.class))).thenReturn(savedProblem);
        when(matchingEngineService.findBestMatches(any(), anyInt())).thenReturn(List.of());

        SolutionStep step1 = new SolutionStep(1, "Broadcast to Kisan Seva", "Desc", "Agri Network");
        step1.setStatus(SolutionStepStatus.READY);
        NoDeadEndFallbackService.FallbackSolutionResult fallback = new NoDeadEndFallbackService.FallbackSolutionResult(
                "COMMUNITY_RESOURCE", "Fallback explanation", List.of(step1)
        );
        when(fallbackService.generateFallbackSolution(any(), eq(false))).thenReturn(fallback);

        // When
        ProblemDto result = problemService.createProblem(userId, req);

        // Then
        assertNotNull(result);
        assertEquals("MDI-2026-000042", result.getPassportCode());
        assertEquals(ProblemCategory.AGRICULTURE, result.getCategory());
        verify(passportRepository, times(1)).save(any(ProblemPassport.class));
        verify(solutionGraphRepository, times(1)).save(any(SolutionGraph.class));
        verify(eventRepository, atLeast(1)).save(any(ProblemEvent.class));
    }
}
