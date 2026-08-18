package com.mandi.problem;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProblemPassportRepository extends JpaRepository<ProblemPassport, Long> {
    Optional<ProblemPassport> findByPassportCode(String passportCode);
    Optional<ProblemPassport> findByProblemId(Long problemId);
}
