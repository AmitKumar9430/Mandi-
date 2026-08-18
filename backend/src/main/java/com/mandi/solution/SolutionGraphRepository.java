package com.mandi.solution;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SolutionGraphRepository extends JpaRepository<SolutionGraph, Long> {
    Optional<SolutionGraph> findByProblemId(Long problemId);
}
