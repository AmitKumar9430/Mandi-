package com.mandi.auth.otp;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mandi.auth.audit.UserLoginAudit;
import com.mandi.auth.audit.UserLoginAuditRepository;
import com.mandi.auth.dto.*;
import com.mandi.common.SmsService;
import com.mandi.email.EmailJsService;
import com.mandi.exception.UnauthorizedActionException;
import com.mandi.security.JwtUtils;
import com.mandi.security.UserPrincipal;
import com.mandi.user.*;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DefaultOtpService implements OtpService {

    private static final Logger log = LoggerFactory.getLogger(DefaultOtpService.class);

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final OtpVerificationRepository otpVerificationRepository;
    private final UserLoginAuditRepository userLoginAuditRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final SmsService smsService;
    private final EmailJsService emailJsService;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final SecureRandom secureRandom = new SecureRandom();

    public DefaultOtpService(UserRepository userRepository,
                             UserProfileRepository userProfileRepository,
                             OtpVerificationRepository otpVerificationRepository,
                             UserLoginAuditRepository userLoginAuditRepository,
                             PasswordEncoder passwordEncoder,
                             JwtUtils jwtUtils,
                             SmsService smsService,
                             EmailJsService emailJsService) {
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
        this.otpVerificationRepository = otpVerificationRepository;
        this.userLoginAuditRepository = userLoginAuditRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
        this.smsService = smsService;
        this.emailJsService = emailJsService;
    }

    private String normalizeIdentifier(String identifier) {
        if (identifier == null) return "";
        String trimmed = identifier.trim();
        if (trimmed.contains("@")) {
            return trimmed.toLowerCase();
        }
        String digits = trimmed.replaceAll("[^0-9]", "");
        if (digits.length() == 12 && digits.startsWith("91")) {
            digits = digits.substring(2);
        } else if (digits.length() == 11 && digits.startsWith("0")) {
            digits = digits.substring(1);
        }
        return digits.isEmpty() ? trimmed : digits;
    }

    private String maskPhoneNumber(String phone) {
        if (phone == null || phone.isBlank()) return "******0000";
        String clean = phone.replaceAll("[^0-9]", "");
        if (clean.length() <= 4) return "******" + clean;
        return "+91 ******" + clean.substring(clean.length() - 4);
    }

    private String maskEmail(String email) {
        if (email == null || !email.contains("@")) return "masked@domain.com";
        String[] parts = email.split("@");
        String name = parts[0];
        String domain = parts[1];
        if (name.length() <= 2) return name.charAt(0) + "*@" + domain;
        return name.substring(0, 2) + "***@" + domain;
    }

    public static String extractClientIp(HttpServletRequest request) {
        if (request == null) return null;
        String[] headers = {
                "X-Forwarded-For",
                "X-Real-IP",
                "Proxy-Client-IP",
                "WL-Proxy-Client-IP",
                "HTTP_CLIENT_IP",
                "HTTP_X_FORWARDED_FOR"
        };
        for (String header : headers) {
            String ip = request.getHeader(header);
            if (ip != null && !ip.isBlank() && !"unknown".equalsIgnoreCase(ip.trim())) {
                if (ip.contains(",")) {
                    ip = ip.split(",")[0].trim();
                }
                if ("0:0:0:0:0:0:0:1".equals(ip) || "::1".equals(ip)) {
                    return "127.0.0.1";
                }
                return ip.trim();
            }
        }
        String remote = request.getRemoteAddr();
        if ("0:0:0:0:0:0:0:1".equals(remote) || "::1".equals(remote)) {
            return "127.0.0.1";
        }
        return remote;
    }

    public static String extractUserAgent(HttpServletRequest request) {
        if (request == null) return null;
        String userAgent = request.getHeader("User-Agent");
        if (userAgent == null || userAgent.isBlank()) {
            return "Unknown-Device";
        }
        return userAgent.length() > 250 ? userAgent.substring(0, 250) : userAgent.trim();
    }

    private void recordAuditSafely(Long userId, String identifier, String method, String ip, String ua, String status, String reason) {
        try {
            UserLoginAudit audit = new UserLoginAudit(userId, identifier, method, ip, ua, status, reason);
            userLoginAuditRepository.save(audit);
        } catch (Exception e) {
            log.warn("⚠️ Failed to record login audit trail: {}", e.getMessage());
        }
    }

    // ==========================================================
    // 1. REGISTRATION OTP REQUEST & VERIFICATION (EMAILJS)
    // ==========================================================

    @Override
    @Transactional
    public OtpRequestResponse requestRegistrationOtp(RegisterRequest request, HttpServletRequest httpRequest) {
        if (request == null) {
            throw new IllegalArgumentException("Registration request payload is required.");
        }

        String fullName = request.getFullName() != null ? request.getFullName().trim() : "";
        String email = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "";
        String rawPhone = request.getPhone() != null ? request.getPhone().trim() : "";
        String password = request.getPassword();
        String confirmPassword = request.getConfirmPassword();

        if (fullName.length() < 2) {
            throw new IllegalArgumentException("Full name must be at least 2 characters long.");
        }
        if (email.isBlank() || !email.contains("@") || !email.contains(".")) {
            throw new IllegalArgumentException("A valid email address is required for registration verification.");
        }
        if (rawPhone.replaceAll("[^0-9]", "").length() < 10) {
            throw new IllegalArgumentException("A valid 10-digit mobile number is required.");
        }
        if (password == null || password.length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters long.");
        }
        if (confirmPassword != null && !confirmPassword.isBlank() && !password.equals(confirmPassword)) {
            throw new IllegalArgumentException("Password and Confirm Password do not match.");
        }

        String phone = rawPhone.replaceAll("[^0-9]", "");
        if (phone.length() > 10) {
            phone = phone.substring(phone.length() - 10);
        }

        // Check duplicate email
        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("An account with email " + email + " is already registered.");
        }

        // Check duplicate phone
        if (userRepository.findByPhone(phone).isPresent()) {
            throw new IllegalArgumentException("An account with mobile number " + phone + " is already registered.");
        }

        // 60-second Resend Cooldown Check
        Optional<OtpVerification> lastChallenge = otpVerificationRepository
                .findTopByIdentifierAndPurposeOrderByCreatedAtDesc(email, OtpPurpose.REGISTRATION);
        if (lastChallenge.isPresent()) {
            LocalDateTime cooldownLimit = lastChallenge.get().getCreatedAt().plusSeconds(60);
            if (LocalDateTime.now().isBefore(cooldownLimit)) {
                long remainingSeconds = java.time.Duration.between(LocalDateTime.now(), cooldownLimit).getSeconds();
                throw new UnauthorizedActionException("Please wait " + Math.max(1, remainingSeconds) + " seconds before requesting a new registration code.");
            }
        }

        // Invalidate prior unconsumed registration challenges for this email
        List<OtpVerification> pendingChallenges = otpVerificationRepository.findByIdentifierAndConsumedFalse(email);
        for (OtpVerification pending : pendingChallenges) {
            pending.setConsumed(true);
        }
        otpVerificationRepository.saveAll(pendingChallenges);

        // Generate 6-Digit Cryptographic OTP
        int code = 100000 + secureRandom.nextInt(900000);
        String plainOtp = String.valueOf(code);
        String otpHash = passwordEncoder.encode(plainOtp);

        String otpRequestId = "REQ_" + UUID.randomUUID().toString().replace("-", "");
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(5);

        // Pre-hash user password and package registration payload
        RegisterRequest pendingData = new RegisterRequest();
        pendingData.setFullName(fullName);
        pendingData.setEmail(email);
        pendingData.setPhone(phone);
        pendingData.setPassword(passwordEncoder.encode(password)); // Store pre-hashed password
        pendingData.setRoles(request.getRoles() != null && !request.getRoles().isEmpty() ? request.getRoles() : Set.of(Role.ROLE_CITIZEN));
        pendingData.setVillageOrTown(request.getVillageOrTown() != null ? request.getVillageOrTown().trim() : "Village");
        pendingData.setDistrict(request.getDistrict() != null ? request.getDistrict().trim() : "District");
        pendingData.setState(request.getState());
        pendingData.setPincode(request.getPincode());
        pendingData.setLatitude(request.getLatitude());
        pendingData.setLongitude(request.getLongitude());
        pendingData.setPreferredLanguage(request.getPreferredLanguage() != null ? request.getPreferredLanguage() : "HI");

        String payloadJson;
        try {
            payloadJson = objectMapper.writeValueAsString(pendingData);
        } catch (Exception e) {
            throw new RuntimeException("Failed to serialize registration payload", e);
        }

        String clientIp = extractClientIp(httpRequest);
        String userAgent = extractUserAgent(httpRequest);

        OtpVerification verification = new OtpVerification(
                otpRequestId,
                null,
                email,
                otpHash,
                OtpPurpose.REGISTRATION,
                maskEmail(email),
                expiresAt,
                clientIp,
                userAgent
        );
        verification.setRegistrationPayloadJson(payloadJson);
        otpVerificationRepository.save(verification);

        log.info("🔐 [REGISTRATION_OTP_REQUESTED] Generated secure registration challenge {} for email: {} (IP: {}, Device: {})",
                otpRequestId, maskEmail(email), clientIp, userAgent);

        // Dispatch OTP via EmailJS Registration Template
        boolean emailSent = emailJsService.sendRegistrationOtpEmail(email, fullName, plainOtp);
        if (!emailSent) {
            log.error("❌ Failed to transmit registration OTP email via EmailJS for {}", maskEmail(email));
            verification.setConsumed(true);
            otpVerificationRepository.save(verification);
            throw new UnauthorizedActionException("Unable to send verification code. Please try again later.");
        }

        String message = "Verification code sent to your email " + maskEmail(email) + ".";
        return new OtpRequestResponse(true, message, otpRequestId, maskEmail(email), 300);
    }

    @Override
    @Transactional
    public AuthResponse verifyRegistrationOtp(OtpVerifyDto request, HttpServletRequest httpRequest) {
        String otpRequestId = request.getOtpRequestId();
        String inputOtp = request.getOtp() != null ? request.getOtp().trim() : "";
        String currentIp = extractClientIp(httpRequest);
        String currentUserAgent = extractUserAgent(httpRequest);

        if (otpRequestId == null || otpRequestId.isBlank() || inputOtp.isBlank()) {
            throw new UnauthorizedActionException("Verification ID and 6-digit OTP code are required.");
        }

        OtpVerification challenge = otpVerificationRepository.findByOtpRequestId(otpRequestId)
                .orElseThrow(() -> new UnauthorizedActionException("Invalid or expired registration challenge. Please request a new code."));

        if (challenge.getPurpose() != OtpPurpose.REGISTRATION) {
            challenge.setConsumed(true);
            otpVerificationRepository.save(challenge);
            throw new UnauthorizedActionException("Invalid verification purpose. Expected registration challenge.");
        }

        if (challenge.isConsumed()) {
            throw new UnauthorizedActionException("This verification code has already been used. Please request a new code.");
        }

        if (challenge.isExpired()) {
            challenge.setConsumed(true);
            otpVerificationRepository.save(challenge);
            throw new UnauthorizedActionException("Your verification code has expired (5 minute limit). Please request a new code.");
        }

        if (challenge.isMaxAttemptsExceeded()) {
            challenge.setConsumed(true);
            otpVerificationRepository.save(challenge);
            throw new UnauthorizedActionException("Too many incorrect attempts. This verification challenge has been locked. Please register again.");
        }

        // Verify cryptographic OTP hash
        if (!passwordEncoder.matches(inputOtp, challenge.getOtpHash())) {
            challenge.incrementAttemptCount();
            otpVerificationRepository.save(challenge);
            int remaining = Math.max(0, 5 - challenge.getAttemptCount());
            log.warn("⚠️ [REG_OTP_FAILED] Incorrect OTP attempt for challenge {}. Remaining: {}", otpRequestId, remaining);
            throw new UnauthorizedActionException("Invalid OTP entered. (" + remaining + " attempts remaining).");
        }

        // Mark challenge consumed atomically
        challenge.setConsumed(true);
        challenge.setVerifiedAt(LocalDateTime.now());
        otpVerificationRepository.save(challenge);

        // Deserialize pending registration data
        RegisterRequest pending;
        try {
            pending = objectMapper.readValue(challenge.getRegistrationPayloadJson(), RegisterRequest.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to restore registration state", e);
        }

        // Race Condition Check: Ensure user was not registered concurrently
        if (userRepository.findByEmail(pending.getEmail()).isPresent() || userRepository.findByPhone(pending.getPhone()).isPresent()) {
            throw new UnauthorizedActionException("An account with this email or mobile number already exists.");
        }

        // Instantiate and persist new User
        User user = new User(pending.getPhone(), pending.getEmail(), pending.getPassword(), pending.getFullName());
        user.setRoles(pending.getRoles() != null && !pending.getRoles().isEmpty() ? pending.getRoles() : Set.of(Role.ROLE_CITIZEN));
        user.setActive(true);
        user.setVerified(true); // Email & Account verified
        User savedUser = userRepository.save(user);

        // Create and persist UserProfile
        String rawDist = pending.getDistrict() != null && !pending.getDistrict().isBlank() ? pending.getDistrict() : "Lucknow";
        String dist = com.mandi.common.IndianLocationService.normalizeDistrict(rawDist);
        String state = com.mandi.common.IndianLocationService.resolveState(dist, pending.getState());

        UserProfile profile = new UserProfile();
        profile.setUser(savedUser);
        profile.setVillageOrTown(pending.getVillageOrTown());
        profile.setDistrict(dist);
        profile.setState(state);
        profile.setPincode(pending.getPincode());
        profile.setLatitude(pending.getLatitude());
        profile.setLongitude(pending.getLongitude());
        profile.setPreferredLanguage(pending.getPreferredLanguage() != null ? pending.getPreferredLanguage() : "HI");
        userProfileRepository.save(profile);

        // Generate JWT Token for immediate authenticated session
        UserPrincipal userPrincipal = UserPrincipal.create(savedUser);
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userPrincipal,
                null,
                userPrincipal.getAuthorities()
        );
        String jwt = jwtUtils.generateToken(authentication);

        Set<String> roles = savedUser.getRoles().stream().map(Role::name).collect(Collectors.toSet());

        recordAuditSafely(savedUser.getId(), savedUser.getEmail(), "REGISTRATION_OTP", currentIp, currentUserAgent, "SUCCESS", null);

        log.info("🎉 [REGISTRATION_COMPLETED] User {} (ID: {}, Email: {}) successfully registered and verified via EmailJS OTP.",
                savedUser.getFullName(), savedUser.getId(), savedUser.getEmail());

        return new AuthResponse(jwt, savedUser.getId(), savedUser.getFullName(), savedUser.getPhone(), savedUser.getEmail(), roles, profile.getPreferredLanguage());
    }

    // ==========================================================
    // 2. LOGIN OTP REQUEST & VERIFICATION (EMAILJS + MULTI-CHANNEL)
    // ==========================================================

    @Override
    public OtpRequestResponse requestLoginOtp(OtpRequestDto request, boolean isAdminPortal) {
        return requestLoginOtp(request, isAdminPortal, null);
    }

    @Override
    @Transactional
    public OtpRequestResponse requestLoginOtp(OtpRequestDto request, boolean isAdminPortal, HttpServletRequest httpRequest) {
        String rawIdentifier = request.getIdentifier();
        if (rawIdentifier == null || rawIdentifier.isBlank()) {
            throw new IllegalArgumentException("Identifier (Mobile number or Email) is required.");
        }

        String normIdentifier = normalizeIdentifier(rawIdentifier);

        // 1. Check 30-Minute Account Lockout Policy (3+ failed challenges in last hour)
        long failedChallengesLastHour = otpVerificationRepository
                .countByIdentifierAndAttemptCountGreaterThanEqualAndCreatedAtAfter(normIdentifier, 5, LocalDateTime.now().minusHours(1));
        if (failedChallengesLastHour >= 3) {
            Optional<OtpVerification> lastFailed = otpVerificationRepository
                    .findTopByIdentifierAndAttemptCountGreaterThanEqualOrderByCreatedAtDesc(normIdentifier, 5);
            if (lastFailed.isPresent()) {
                LocalDateTime lockoutLimit = lastFailed.get().getCreatedAt().plusMinutes(30);
                if (LocalDateTime.now().isBefore(lockoutLimit)) {
                    long remainingMinutes = Math.max(1, Duration.between(LocalDateTime.now(), lockoutLimit).toMinutes());
                    log.warn("⛔ [ACCOUNT_LOCKED] Identifier {} is locked for {} more minutes due to {} failed challenges.",
                            normIdentifier, remainingMinutes, failedChallengesLastHour);
                    throw new UnauthorizedActionException("Account is temporarily locked due to multiple failed verification attempts. Please try again in " + remainingMinutes + " minutes.");
                }
            }
        }

        // 2. Check 60-second Resend Cooldown
        Optional<OtpVerification> lastChallenge = otpVerificationRepository
                .findTopByIdentifierAndPurposeOrderByCreatedAtDesc(normIdentifier, OtpPurpose.LOGIN);
        if (lastChallenge.isPresent()) {
            LocalDateTime cooldownLimit = lastChallenge.get().getCreatedAt().plusSeconds(60);
            if (LocalDateTime.now().isBefore(cooldownLimit)) {
                long remainingSeconds = java.time.Duration.between(LocalDateTime.now(), cooldownLimit).getSeconds();
                throw new UnauthorizedActionException("Please wait " + Math.max(1, remainingSeconds) + " seconds before requesting a new OTP.");
            }
        }

        // Database lookup: find registered user by email or phone
        Optional<User> userOpt = userRepository.findByEmail(normIdentifier);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByPhone(normIdentifier);
        }
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByPhoneOrEmail(normIdentifier, normIdentifier);
        }

        if (userOpt.isEmpty()) {
            log.info("✨ [AUTO_REGISTER_ON_OTP_LOGIN] Creating user account for identifier: {}", normIdentifier);
            String autoPhone = normIdentifier.contains("@")
                    ? "9" + String.format("%09d", Math.abs(normIdentifier.hashCode()) % 1000000000L)
                    : normIdentifier;
            String autoEmail = normIdentifier.contains("@") ? normIdentifier : normIdentifier + "@mandi.org";
            String autoName = normIdentifier.contains("@") ? normIdentifier.substring(0, normIdentifier.indexOf('@')) : "MANDI User (" + normIdentifier + ")";

            User newUser = new User(autoPhone, autoEmail, passwordEncoder.encode("Password@123"), autoName);
            newUser.setRoles(new HashSet<>(Set.of(Role.ROLE_CITIZEN, Role.ROLE_FARMER)));
            newUser.setActive(true);
            newUser.setVerified(true);
            User savedUser = userRepository.save(newUser);

            UserProfile profile = new UserProfile(savedUser);
            profile.setVillageOrTown("Gharuan");
            profile.setDistrict("Mohali");
            profile.setState("Punjab");
            profile.setPreferredLanguage("HI");
            profile.setTrustScore(90);
            userProfileRepository.save(profile);

            userOpt = Optional.of(savedUser);
        }

        User user = userOpt.get();

        if (!user.isActive()) {
            throw new UnauthorizedActionException("This account is suspended or inactive. Please contact administrator.");
        }

        // Admin Portal Role Verification
        if (isAdminPortal) {
            boolean hasAdminRole = user.getRoles().stream().anyMatch(r ->
                    r == Role.ROLE_ADMIN || r == Role.ROLE_SUPER_ADMIN || r == Role.ROLE_MODERATOR || r.name().contains("ADMIN") || r.name().contains("MODERATOR"));
            if (!hasAdminRole) {
                throw new UnauthorizedActionException("Access Denied: Only authorized administrators can request OTP for Admin Operations.");
            }
        }

        // Invalidate any previous unconsumed challenges for this identifier
        List<OtpVerification> pendingChallenges = otpVerificationRepository.findByIdentifierAndConsumedFalse(normIdentifier);
        for (OtpVerification pending : pendingChallenges) {
            pending.setConsumed(true);
        }
        otpVerificationRepository.saveAll(pendingChallenges);

        // Generate 6-Digit Cryptographic OTP
        int code = 100000 + secureRandom.nextInt(900000);
        String plainOtp = String.valueOf(code);
        String otpHash = passwordEncoder.encode(plainOtp);

        String otpRequestId = "REQ_" + UUID.randomUUID().toString().replace("-", "");
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(5);

        // Registered destinations
        String registeredEmail = user.getEmail();
        String registeredPhone = user.getPhone();
        String maskedDestination;
        if (rawIdentifier.contains("@") && registeredEmail != null && !registeredEmail.isBlank()) {
            maskedDestination = maskEmail(registeredEmail);
        } else {
            maskedDestination = maskPhoneNumber(registeredPhone);
        }

        // IP & Device Fingerprinting
        String clientIp = extractClientIp(httpRequest);
        String userAgent = extractUserAgent(httpRequest);

        OtpVerification verification = new OtpVerification(
                otpRequestId,
                user,
                normIdentifier,
                otpHash,
                OtpPurpose.LOGIN,
                maskedDestination,
                expiresAt,
                clientIp,
                userAgent
        );
        otpVerificationRepository.save(verification);

        log.info("🔐 [LOGIN_OTP_REQUESTED] Generated secure challenge {} for user ID: {} (Destination: {}, IP: {}, Device: {})",
                otpRequestId, user.getId(), maskedDestination, clientIp, userAgent);

        // 1. Dispatch OTP via EmailJS Login Template
        if (registeredEmail != null && !registeredEmail.isBlank()) {
            emailJsService.sendLoginOtpEmail(registeredEmail, user.getFullName(), plainOtp);
        }

        // 2. Dispatch OTP via SMS Gateway (Fast2SMS / MSG91)
        if (registeredPhone != null && !registeredPhone.isBlank()) {
            smsService.sendOtp(registeredPhone, registeredEmail, plainOtp);
        }

        String message = "Verification code sent to " + maskedDestination + ".";
        return new OtpRequestResponse(true, message, otpRequestId, maskedDestination, 300);
    }

    @Override
    public AuthResponse verifyLoginOtp(OtpVerifyDto request, boolean isAdminPortal) {
        return verifyLoginOtp(request, isAdminPortal, null);
    }

    @Override
    @Transactional
    public AuthResponse verifyLoginOtp(OtpVerifyDto request, boolean isAdminPortal, HttpServletRequest httpRequest) {
        String otpRequestId = request.getOtpRequestId();
        String inputOtp = request.getOtp() != null ? request.getOtp().trim() : "";
        String method = isAdminPortal ? "ADMIN_OTP_LOGIN" : "OTP_LOGIN";
        String currentIp = extractClientIp(httpRequest);
        String currentUserAgent = extractUserAgent(httpRequest);

        if (otpRequestId == null || otpRequestId.isBlank() || inputOtp.isBlank()) {
            throw new UnauthorizedActionException("OTP Request ID and 6-digit OTP are required.");
        }

        OtpVerification challenge = otpVerificationRepository.findByOtpRequestId(otpRequestId)
                .orElseThrow(() -> new UnauthorizedActionException("Invalid or expired OTP challenge. Please request a new OTP."));

        if (challenge.getUser() == null) {
            throw new UnauthorizedActionException("Invalid OTP verification challenge.");
        }

        Long userId = challenge.getUser().getId();
        String identifier = challenge.getIdentifier();

        if (challenge.isConsumed()) {
            recordAuditSafely(userId, identifier, method, currentIp, currentUserAgent, "FAILED", "Replayed consumed OTP challenge");
            throw new UnauthorizedActionException("This OTP has already been used. Please request a new OTP.");
        }

        if (challenge.isExpired()) {
            challenge.setConsumed(true);
            otpVerificationRepository.save(challenge);
            recordAuditSafely(userId, identifier, method, currentIp, currentUserAgent, "FAILED", "Expired OTP challenge");
            throw new UnauthorizedActionException("Your OTP has expired (5 minute limit). Please request a new OTP.");
        }

        if (challenge.getPurpose() != OtpPurpose.LOGIN) {
            challenge.setConsumed(true);
            otpVerificationRepository.save(challenge);
            recordAuditSafely(userId, identifier, method, currentIp, currentUserAgent, "FAILED", "Invalid OTP purpose");
            throw new UnauthorizedActionException("Invalid OTP purpose for login.");
        }

        if (challenge.isMaxAttemptsExceeded()) {
            challenge.setConsumed(true);
            otpVerificationRepository.save(challenge);
            recordAuditSafely(userId, identifier, method, currentIp, currentUserAgent, "FAILED", "Max verification attempts exceeded");
            throw new UnauthorizedActionException("Too many incorrect attempts. This OTP has been invalidated. Please request a new OTP.");
        }

        // ==========================================================
        // IP & DEVICE BINDING SECURITY ENFORCEMENT
        // ==========================================================
        if (httpRequest != null) {
            if (challenge.getIpAddress() != null && currentIp != null) {
                if (!challenge.getIpAddress().equals(currentIp)) {
                    log.warn("🚨 [SECURITY ALERT] IP Mismatch during OTP verification! Request IP: {}, Verify IP: {} for challenge: {}",
                            challenge.getIpAddress(), currentIp, otpRequestId);
                    challenge.incrementAttemptCount();
                    otpVerificationRepository.save(challenge);
                    recordAuditSafely(userId, identifier, method, currentIp, currentUserAgent, "FAILED", "IP Address Mismatch: " + currentIp + " != " + challenge.getIpAddress());
                    throw new UnauthorizedActionException("Security Error: OTP verification must be completed from the same network where the request was initiated.");
                }
            }

            if (challenge.getUserAgent() != null && currentUserAgent != null) {
                if (!challenge.getUserAgent().equals(currentUserAgent)) {
                    log.warn("🚨 [SECURITY ALERT] Device/Browser Mismatch during OTP verification! Request Device: {}, Verify Device: {} for challenge: {}",
                            challenge.getUserAgent(), currentUserAgent, otpRequestId);
                    challenge.incrementAttemptCount();
                    otpVerificationRepository.save(challenge);
                    recordAuditSafely(userId, identifier, method, currentIp, currentUserAgent, "FAILED", "Device Mismatch: " + currentUserAgent);
                    throw new UnauthorizedActionException("Security Error: Device mismatch detected during OTP verification.");
                }
            }
        }

        // Verify cryptographic hash
        if (!passwordEncoder.matches(inputOtp, challenge.getOtpHash())) {
            challenge.incrementAttemptCount();
            otpVerificationRepository.save(challenge);
            int remaining = Math.max(0, 5 - challenge.getAttemptCount());
            log.warn("⚠️ [OTP_VERIFICATION_FAILED] Incorrect OTP attempt for challenge {}. Remaining: {}", otpRequestId, remaining);
            recordAuditSafely(userId, identifier, method, currentIp, currentUserAgent, "FAILED", "Incorrect OTP. Remaining: " + remaining);
            throw new UnauthorizedActionException("Invalid OTP entered. (" + remaining + " attempts remaining).");
        }

        // Mark challenge consumed immediately (Atomic Single-Use Protection)
        challenge.setConsumed(true);
        challenge.setVerifiedAt(LocalDateTime.now());
        otpVerificationRepository.save(challenge);

        User user = challenge.getUser();
        if (!user.isActive()) {
            recordAuditSafely(userId, identifier, method, currentIp, currentUserAgent, "FAILED", "User account inactive/suspended");
            throw new UnauthorizedActionException("This account is suspended or inactive.");
        }

        Set<String> roles = user.getRoles().stream()
                .map(Role::name)
                .collect(Collectors.toSet());

        boolean hasAdminRole = roles.contains("ROLE_ADMIN") || roles.contains("ROLE_SUPER_ADMIN") || roles.contains("ROLE_MODERATOR") || roles.contains("ADMIN");

        if (isAdminPortal) {
            if (!hasAdminRole) {
                recordAuditSafely(userId, identifier, method, currentIp, currentUserAgent, "FAILED", "Admin portal access denied to non-admin");
                throw new UnauthorizedActionException("Access Denied: User does not have administrator privileges.");
            }
        } else {
            if (hasAdminRole && roles.size() == 1) {
                recordAuditSafely(userId, identifier, method, currentIp, currentUserAgent, "FAILED", "Pure admin attempting user portal login");
                throw new UnauthorizedActionException("This account belongs to the Administrator Operations Portal. Please use /admin/login.");
            }
        }

        UserPrincipal userPrincipal = UserPrincipal.create(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userPrincipal,
                null,
                userPrincipal.getAuthorities()
        );

        String jwt = jwtUtils.generateToken(authentication);

        String preferredLang = "HI";
        var profileOpt = userProfileRepository.findByUserId(user.getId());
        if (profileOpt.isPresent() && profileOpt.get().getPreferredLanguage() != null) {
            preferredLang = profileOpt.get().getPreferredLanguage();
        }

        // Record Successful Login Audit Trail
        recordAuditSafely(userId, identifier, method, currentIp, currentUserAgent, "SUCCESS", null);

        log.info("✅ [LOGIN_SUCCESS] User {} (ID: {}) successfully authenticated via verified OTP from IP: {}",
                user.getFullName(), user.getId(), currentIp != null ? currentIp : challenge.getIpAddress());

        return new AuthResponse(jwt, user.getId(), user.getFullName(), user.getPhone(), user.getEmail(), roles, preferredLang);
    }
}
