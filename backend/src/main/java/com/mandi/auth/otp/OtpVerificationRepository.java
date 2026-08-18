package com.mandi.auth.otp;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OtpVerificationRepository extends JpaRepository<OtpVerification, Long> {

    Optional<OtpVerification> findByOtpRequestId(String otpRequestId);

    Optional<OtpVerification> findTopByIdentifierAndPurposeOrderByCreatedAtDesc(String identifier, OtpPurpose purpose);

    List<OtpVerification> findByIdentifierAndConsumedFalse(String identifier);

    long countByIdentifierAndCreatedAtAfter(String identifier, LocalDateTime afterTime);

    long countByIdentifierAndAttemptCountGreaterThanEqualAndCreatedAtAfter(String identifier, int minAttempts, LocalDateTime afterTime);

    Optional<OtpVerification> findTopByIdentifierAndAttemptCountGreaterThanEqualOrderByCreatedAtDesc(String identifier, int minAttempts);
}
