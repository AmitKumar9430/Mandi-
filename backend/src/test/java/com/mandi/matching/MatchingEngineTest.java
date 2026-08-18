package com.mandi.matching;

import com.mandi.problem.Problem;
import com.mandi.problem.ProblemCategory;
import com.mandi.problem.ProblemUrgency;
import com.mandi.resource.Resource;
import com.mandi.resource.ResourceCategory;
import com.mandi.resource.ResourceRepository;
import com.mandi.user.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MatchingEngineTest {

    @Mock
    private ResourceRepository resourceRepository;

    @InjectMocks
    private MatchingEngineService matchingEngineService;

    @Test
    @DisplayName("Matching engine should rank nearest verified compatible resource highest with explainability reasons")
    void testMatchingEngineRankingAndExplanation() {
        // Given a farmer agriculture problem in Lucknow (26.9200, 80.7100)
        Problem problem = new Problem();
        problem.setCategory(ProblemCategory.AGRICULTURE);
        problem.setUrgency(ProblemUrgency.MEDIUM);
        problem.setLatitude(26.9200);
        problem.setLongitude(80.7100);

        User owner = new User("9876543215", "provider@mandi.org", "pass", "Agri Provider");

        // Close verified tractor resource (approx 5km away)
        Resource tractor = new Resource();
        tractor.setOwner(owner);
        tractor.setName("Tractor Service");
        tractor.setCategory(ResourceCategory.TRACTOR_EQUIPMENT);
        tractor.setLatitude(26.8700);
        tractor.setLongitude(80.7900);
        tractor.setAvailable(true);
        tractor.setVerified(true);
        tractor.setRating(4.9);
        tractor.setSuccessfulCasesCount(40);
        tractor.setCostPerUnit(400.0);
        tractor.setCostUnit("per hour");

        // Distant medical equipment (incompatible category and far away)
        Resource medical = new Resource();
        medical.setOwner(owner);
        medical.setName("Oxygen Kit");
        medical.setCategory(ResourceCategory.MEDICAL_EQUIPMENT);
        medical.setLatitude(28.7041);
        medical.setLongitude(77.1025);
        medical.setAvailable(true);
        medical.setVerified(false);

        when(resourceRepository.findAll()).thenReturn(List.of(tractor, medical));

        // When
        List<MatchingEngineService.MatchCandidate> matches = matchingEngineService.findBestMatches(problem, 2);

        // Then
        assertFalse(matches.isEmpty());
        MatchingEngineService.MatchCandidate topMatch = matches.get(0);
        assertEquals("Tractor Service", topMatch.getResource().getName());
        assertTrue(topMatch.getScore() > 70.0, "Score should be high for verified near matching category");
        assertFalse(topMatch.getReasons().isEmpty(), "Must provide transparent explainability reasons");
        assertTrue(topMatch.getReasons().stream().anyMatch(r -> r.contains("skill/resource") || r.contains("TRACTOR")));
    }

    @Test
    @DisplayName("Haversine distance calculation should accurately compute distance between two coordinates")
    void testHaversineDistance() {
        // Lucknow Central (26.8467, 80.9462) to Malihabad (26.9200, 80.7100) is approx 24-26 km
        double distance = MatchingEngineService.calculateHaversineDistance(26.8467, 80.9462, 26.9200, 80.7100);
        assertTrue(distance > 20.0 && distance < 30.0, "Calculated distance should be ~24km, was: " + distance);
    }
}
