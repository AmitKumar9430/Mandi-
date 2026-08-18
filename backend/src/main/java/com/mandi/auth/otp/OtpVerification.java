package com.mandi.auth.otp;

import com.mandi.user.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "otp_verifications", indexes = {
        @Index(name = "idx_otp_request_id", columnList = "otpRequestId", unique = true),
        @Index(name = "idx_otp_identifier", columnList = "identifier")
})
public class OtpVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 64)
    private String otpRequestId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false, length = 100)
    private String identifier;

    @Column(nullable = false, length = 255)
    private String otpHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private OtpPurpose purpose;

    @Column(length = 50)
    private String destinationMasked;

    @Column(nullable = false)
    private int attemptCount = 0;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @Column(nullable = false)
    private boolean consumed = false;

    @Column(length = 20)
    private String channel = "SMS";

    @Column(length = 64)
    private String ipAddress;

    @Column(length = 255)
    private String userAgent;

    @Column(columnDefinition = "LONGTEXT")
    private String registrationPayloadJson;

    @Column
    private LocalDateTime verifiedAt;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public OtpVerification() {}

    public OtpVerification(String otpRequestId, User user, String identifier, String otpHash,
                           OtpPurpose purpose, String destinationMasked, LocalDateTime expiresAt) {
        this.otpRequestId = otpRequestId;
        this.user = user;
        this.identifier = identifier;
        this.otpHash = otpHash;
        this.purpose = purpose;
        this.destinationMasked = destinationMasked;
        this.expiresAt = expiresAt;
        this.createdAt = LocalDateTime.now();
    }

    public OtpVerification(String otpRequestId, User user, String identifier, String otpHash,
                           OtpPurpose purpose, String destinationMasked, LocalDateTime expiresAt,
                           String ipAddress, String userAgent) {
        this(otpRequestId, user, identifier, otpHash, purpose, destinationMasked, expiresAt);
        this.ipAddress = ipAddress;
        this.userAgent = userAgent;
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }

    public boolean isMaxAttemptsExceeded() {
        return attemptCount >= 5;
    }

    public void incrementAttemptCount() {
        this.attemptCount++;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public String getOtpRequestId() { return otpRequestId; }
    public void setOtpRequestId(String otpRequestId) { this.otpRequestId = otpRequestId; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getIdentifier() { return identifier; }
    public void setIdentifier(String identifier) { this.identifier = identifier; }
    public String getOtpHash() { return otpHash; }
    public void setOtpHash(String otpHash) { this.otpHash = otpHash; }
    public OtpPurpose getPurpose() { return purpose; }
    public void setPurpose(OtpPurpose purpose) { this.purpose = purpose; }
    public String getDestinationMasked() { return destinationMasked; }
    public void setDestinationMasked(String destinationMasked) { this.destinationMasked = destinationMasked; }
    public int getAttemptCount() { return attemptCount; }
    public void setAttemptCount(int attemptCount) { this.attemptCount = attemptCount; }
    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }
    public boolean isConsumed() { return consumed; }
    public void setConsumed(boolean consumed) { this.consumed = consumed; }
    public String getChannel() { return channel; }
    public void setChannel(String channel) { this.channel = channel; }
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }
    public String getRegistrationPayloadJson() { return registrationPayloadJson; }
    public void setRegistrationPayloadJson(String registrationPayloadJson) { this.registrationPayloadJson = registrationPayloadJson; }
    public LocalDateTime getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(LocalDateTime verifiedAt) { this.verifiedAt = verifiedAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
