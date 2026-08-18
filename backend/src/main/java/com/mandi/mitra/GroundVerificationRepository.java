package com.mandi.mitra;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroundVerificationRepository extends JpaRepository<GroundVerification, Long> {

    List<GroundVerification> findByProblemIdOrderByVerifiedAtDesc(Long problemId);

    List<GroundVerification> findByMitraIdOrderByVerifiedAtDesc(Long mitraId);
}
