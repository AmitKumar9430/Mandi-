package com.mandi.solution;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SolutionStepRepository extends JpaRepository<SolutionStep, Long> {
    List<SolutionStep> findByAssignedUserId(Long assignedUserId);

    @Query("SELECT s FROM SolutionStep s WHERE s.status = 'READY' OR (s.status = 'PENDING' AND s.stepSequence = 1)")
    List<SolutionStep> findClaimableSteps();
}
