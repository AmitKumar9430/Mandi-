package com.mandi.problem;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProblemEventRepository extends JpaRepository<ProblemEvent, Long> {
    List<ProblemEvent> findByProblemIdOrderByCreatedAtDesc(Long problemId);
}
