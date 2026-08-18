package com.mandi.auth.audit;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_login_audits", indexes = {
        @Index(name = "idx_audit_user_id", columnList = "userId"),
        @Index(name = "idx_audit_identifier", columnList = "identifier"),
        @Index(name = "idx_audit_created_at", columnList = "createdAt")
})
public class UserLoginAudit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false, length = 100)
    private String identifier;

    @Column(nullable = false, length = 30)
    private String loginMethod; // "OTP_LOGIN", "ADMIN_OTP_LOGIN", "PASSWORD_LOGIN"

    @Column(length = 64)
    private String ipAddress;

    @Column(length = 255)
    private String userAgent;

    @Column(nullable = false, length = 20)
    private String status; // "SUCCESS", "FAILED"

    @Column(length = 255)
    private String failureReason;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public UserLoginAudit() {}

    public UserLoginAudit(Long userId, String identifier, String loginMethod, String ipAddress,
                          String userAgent, String status, String failureReason) {
        this.userId = userId;
        this.identifier = identifier;
        this.loginMethod = loginMethod;
        this.ipAddress = ipAddress;
        this.userAgent = userAgent;
        this.status = status;
        this.failureReason = failureReason;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getIdentifier() { return identifier; }
    public void setIdentifier(String identifier) { this.identifier = identifier; }
    public String getLoginMethod() { return loginMethod; }
    public void setLoginMethod(String loginMethod) { this.loginMethod = loginMethod; }
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getFailureReason() { return failureReason; }
    public void setFailureReason(String failureReason) { this.failureReason = failureReason; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
