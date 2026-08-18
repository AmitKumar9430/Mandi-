package com.mandi.auth;

import com.mandi.auth.audit.*;
import com.mandi.auth.dto.*;
import com.mandi.auth.otp.*;
import com.mandi.common.SmsService;
import com.mandi.email.EmailJsService;
import com.mandi.exception.UnauthorizedActionException;
import com.mandi.security.JwtUtils;
import com.mandi.user.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@org.mockito.junit.jupiter.MockitoSettings(strictness = org.mockito.quality.Strictness.LENIENT)
class OtpAuthenticationSecurityTests {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserProfileRepository userProfileRepository;

    @Mock
    private OtpVerificationRepository otpVerificationRepository;

    @Mock
    private UserLoginAuditRepository userLoginAuditRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private SmsService smsService;

    @Mock
    private EmailJsService emailJsService;

    @InjectMocks
    private DefaultOtpService otpService;

    private User sampleCitizen;
    private User sampleAdmin;

    @BeforeEach
    void setUp() {
        sampleCitizen = new User("9876543210", "citizen@mandi.org", "encodedPass", "Rameshwar Kumar");
        sampleCitizen.setId(1L);
        sampleCitizen.setRoles(Set.of(Role.ROLE_CITIZEN));
        sampleCitizen.setActive(true);

        sampleAdmin = new User("9876543217", "admin@mandi.org", "encodedPass", "MANDI Super Admin");
        sampleAdmin.setId(8L);
        sampleAdmin.setRoles(Set.of(Role.ROLE_ADMIN, Role.ROLE_CITIZEN));
        sampleAdmin.setActive(true);
    }

    @Test
    @DisplayName("1. Valid Mobile OTP Request should retrieve registered phone, hash OTP, and return masked destination")
    void testValidMobileOtpRequest() {
        when(otpVerificationRepository.findTopByIdentifierAndPurposeOrderByCreatedAtDesc("9876543210", OtpPurpose.LOGIN))
                .thenReturn(Optional.empty());
        when(userRepository.findByPhone("9876543210")).thenReturn(Optional.of(sampleCitizen));
        when(passwordEncoder.encode(anyString())).thenReturn("hashed_otp");
        when(otpVerificationRepository.findByIdentifierAndConsumedFalse("9876543210")).thenReturn(Collections.emptyList());

        OtpRequestDto req = new OtpRequestDto("9876543210");
        OtpRequestResponse res = otpService.requestLoginOtp(req, false);

        assertNotNull(res);
        assertTrue(res.isSuccess());
        assertNotNull(res.getOtpRequestId());
        assertTrue(res.getOtpRequestId().startsWith("REQ_"));
        assertEquals("+91 ******3210", res.getMaskedPhone());
        assertEquals(300, res.getExpiresIn());
        verify(smsService, times(1)).sendOtp(eq("9876543210"), eq("citizen@mandi.org"), anyString());
    }

    @Test
    @DisplayName("2. Valid Email OTP Request must retrieve database registered phone and not trust client")
    void testValidEmailOtpRequest() {
        when(otpVerificationRepository.findTopByIdentifierAndPurposeOrderByCreatedAtDesc("citizen@mandi.org", OtpPurpose.LOGIN))
                .thenReturn(Optional.empty());
        when(userRepository.findByPhone("citizen@mandi.org")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("citizen@mandi.org")).thenReturn(Optional.of(sampleCitizen));
        when(passwordEncoder.encode(anyString())).thenReturn("hashed_otp");
        when(otpVerificationRepository.findByIdentifierAndConsumedFalse("citizen@mandi.org")).thenReturn(Collections.emptyList());

        OtpRequestDto req = new OtpRequestDto("citizen@mandi.org");
        OtpRequestResponse res = otpService.requestLoginOtp(req, false);

        assertNotNull(res);
        assertTrue(res.isSuccess());
        // Destination phone MUST be the one registered in database (9876543210)
        verify(smsService, times(1)).sendOtp(eq("9876543210"), eq("citizen@mandi.org"), anyString());
    }

    @Test
    @DisplayName("3. Account Enumeration Protection: Non-existent account returns generic success without leaking existence")
    void testNonExistentAccountEnumerationProtection() {
        when(otpVerificationRepository.findTopByIdentifierAndPurposeOrderByCreatedAtDesc("unknown@domain.com", OtpPurpose.LOGIN))
                .thenReturn(Optional.empty());
        when(userRepository.findByPhone("unknown@domain.com")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("unknown@domain.com")).thenReturn(Optional.empty());
        when(userRepository.findByPhoneOrEmail("unknown@domain.com", "unknown@domain.com")).thenReturn(Optional.empty());

        OtpRequestDto req = new OtpRequestDto("unknown@domain.com");
        OtpRequestResponse res = otpService.requestLoginOtp(req, false);

        assertNotNull(res);
        assertTrue(res.isSuccess());
        assertTrue(res.getMessage().contains("If the account is eligible for verification"));
        // Does NOT dispatch OTP to unknown user
        verify(smsService, never()).sendOtp(anyString(), anyString(), anyString());
    }

    @Test
    @DisplayName("4. Resend Cooldown Enforcement: Requesting within 45s throws UnauthorizedActionException")
    void testResendCooldownEnforcement() {
        OtpVerification recent = new OtpVerification("REQ_RECENT", sampleCitizen, "9876543210", "hash", OtpPurpose.LOGIN, "masked", LocalDateTime.now().plusMinutes(5));
        recent.setCreatedAt(LocalDateTime.now().minusSeconds(15)); // 15 seconds ago (within 45s)

        when(otpVerificationRepository.findTopByIdentifierAndPurposeOrderByCreatedAtDesc("9876543210", OtpPurpose.LOGIN))
                .thenReturn(Optional.of(recent));

        OtpRequestDto req = new OtpRequestDto("9876543210");
        assertThrows(UnauthorizedActionException.class, () -> otpService.requestLoginOtp(req, false));
    }

    @Test
    @DisplayName("5. Inactive / Suspended Account must be rejected from OTP request")
    void testInactiveAccountRejected() {
        sampleCitizen.setActive(false);
        when(otpVerificationRepository.findTopByIdentifierAndPurposeOrderByCreatedAtDesc("9876543210", OtpPurpose.LOGIN))
                .thenReturn(Optional.empty());
        when(userRepository.findByPhone("9876543210")).thenReturn(Optional.of(sampleCitizen));

        OtpRequestDto req = new OtpRequestDto("9876543210");
        assertThrows(UnauthorizedActionException.class, () -> otpService.requestLoginOtp(req, false));
    }

    @Test
    @DisplayName("6. Authorized Admin OTP request generates challenge successfully")
    void testAuthorizedAdminOtpRequest() {
        when(otpVerificationRepository.findTopByIdentifierAndPurposeOrderByCreatedAtDesc("admin@mandi.org", OtpPurpose.LOGIN))
                .thenReturn(Optional.empty());
        when(userRepository.findByEmail("admin@mandi.org")).thenReturn(Optional.of(sampleAdmin));
        when(passwordEncoder.encode(anyString())).thenReturn("hashed_otp");
        when(otpVerificationRepository.findByIdentifierAndConsumedFalse("admin@mandi.org")).thenReturn(Collections.emptyList());

        OtpRequestDto req = new OtpRequestDto("admin@mandi.org");
        OtpRequestResponse res = otpService.requestLoginOtp(req, true);

        assertNotNull(res);
        assertTrue(res.isSuccess());
    }

    @Test
    @DisplayName("7. Non-admin attempting Admin Portal OTP request must be rejected")
    void testNonAdminAttemptingAdminPortal() {
        when(otpVerificationRepository.findTopByIdentifierAndPurposeOrderByCreatedAtDesc("9876543210", OtpPurpose.LOGIN))
                .thenReturn(Optional.empty());
        when(userRepository.findByPhone("9876543210")).thenReturn(Optional.of(sampleCitizen));

        OtpRequestDto req = new OtpRequestDto("9876543210");
        assertThrows(UnauthorizedActionException.class, () -> otpService.requestLoginOtp(req, true));
    }

    @Test
    @DisplayName("8. Successful OTP Verification generates JWT with database roles and marks challenge consumed")
    void testSuccessfulOtpVerification() {
        OtpVerification challenge = new OtpVerification("REQ_VALID_123", sampleCitizen, "9876543210", "hashed_otp_code", OtpPurpose.LOGIN, "masked", LocalDateTime.now().plusMinutes(5));
        when(otpVerificationRepository.findByOtpRequestId("REQ_VALID_123")).thenReturn(Optional.of(challenge));
        when(passwordEncoder.matches("482910", "hashed_otp_code")).thenReturn(true);
        when(jwtUtils.generateToken(any(Authentication.class))).thenReturn("signed.jwt.token");

        OtpVerifyDto verifyReq = new OtpVerifyDto("REQ_VALID_123", "482910");
        AuthResponse authRes = otpService.verifyLoginOtp(verifyReq, false);

        assertNotNull(authRes);
        assertEquals("signed.jwt.token", authRes.getToken());
        assertEquals("Rameshwar Kumar", authRes.getFullName());
        assertTrue(challenge.isConsumed());
        verify(otpVerificationRepository, times(1)).save(challenge);
    }

    @Test
    @DisplayName("9. Invalid OTP Code increments attempt count and throws UnauthorizedActionException")
    void testInvalidOtpCode() {
        OtpVerification challenge = new OtpVerification("REQ_VALID_123", sampleCitizen, "9876543210", "hashed_otp_code", OtpPurpose.LOGIN, "masked", LocalDateTime.now().plusMinutes(5));
        when(otpVerificationRepository.findByOtpRequestId("REQ_VALID_123")).thenReturn(Optional.of(challenge));
        when(passwordEncoder.matches("000000", "hashed_otp_code")).thenReturn(false);

        OtpVerifyDto verifyReq = new OtpVerifyDto("REQ_VALID_123", "000000");
        UnauthorizedActionException ex = assertThrows(UnauthorizedActionException.class, () -> otpService.verifyLoginOtp(verifyReq, false));

        assertTrue(ex.getMessage().contains("Invalid OTP entered"));
        assertEquals(1, challenge.getAttemptCount());
        assertFalse(challenge.isConsumed());
    }

    @Test
    @DisplayName("10. Exceeding 5 Max Attempts invalidates the OTP challenge permanently")
    void testMaxAttemptsInvalidation() {
        OtpVerification challenge = new OtpVerification("REQ_VALID_123", sampleCitizen, "9876543210", "hashed_otp_code", OtpPurpose.LOGIN, "masked", LocalDateTime.now().plusMinutes(5));
        challenge.setAttemptCount(5); // Already reached 5

        when(otpVerificationRepository.findByOtpRequestId("REQ_VALID_123")).thenReturn(Optional.of(challenge));

        OtpVerifyDto verifyReq = new OtpVerifyDto("REQ_VALID_123", "482910");
        UnauthorizedActionException ex = assertThrows(UnauthorizedActionException.class, () -> otpService.verifyLoginOtp(verifyReq, false));

        assertTrue(ex.getMessage().contains("Too many incorrect attempts"));
        assertTrue(challenge.isConsumed());
    }

    @Test
    @DisplayName("11. Expired OTP must be rejected and marked consumed")
    void testExpiredOtpRejection() {
        OtpVerification challenge = new OtpVerification("REQ_EXPIRED", sampleCitizen, "9876543210", "hashed_otp_code", OtpPurpose.LOGIN, "masked", LocalDateTime.now().minusMinutes(1)); // Expired
        when(otpVerificationRepository.findByOtpRequestId("REQ_EXPIRED")).thenReturn(Optional.of(challenge));

        OtpVerifyDto verifyReq = new OtpVerifyDto("REQ_EXPIRED", "482910");
        assertThrows(UnauthorizedActionException.class, () -> otpService.verifyLoginOtp(verifyReq, false));
        assertTrue(challenge.isConsumed());
    }

    @Test
    @DisplayName("12. Reused / Already Consumed OTP must be rejected immediately (Single-Use Protection)")
    void testReusedOtpRejection() {
        OtpVerification challenge = new OtpVerification("REQ_CONSUMED", sampleCitizen, "9876543210", "hashed_otp_code", OtpPurpose.LOGIN, "masked", LocalDateTime.now().plusMinutes(5));
        challenge.setConsumed(true); // Already used

        when(otpVerificationRepository.findByOtpRequestId("REQ_CONSUMED")).thenReturn(Optional.of(challenge));

        OtpVerifyDto verifyReq = new OtpVerifyDto("REQ_CONSUMED", "482910");
        UnauthorizedActionException ex = assertThrows(UnauthorizedActionException.class, () -> otpService.verifyLoginOtp(verifyReq, false));
        assertTrue(ex.getMessage().contains("already been used"));
    }

    @Test
    @DisplayName("13. Wrong OTP Purpose (e.g. PASSWORD_RESET) must not authenticate login")
    void testWrongPurposeOtpRejection() {
        OtpVerification challenge = new OtpVerification("REQ_RESET", sampleCitizen, "9876543210", "hashed_otp_code", OtpPurpose.PASSWORD_RESET, "masked", LocalDateTime.now().plusMinutes(5));
        when(otpVerificationRepository.findByOtpRequestId("REQ_RESET")).thenReturn(Optional.of(challenge));

        OtpVerifyDto verifyReq = new OtpVerifyDto("REQ_RESET", "482910");
        UnauthorizedActionException ex = assertThrows(UnauthorizedActionException.class, () -> otpService.verifyLoginOtp(verifyReq, false));
        assertTrue(ex.getMessage().contains("Invalid OTP purpose"));
    }

    @Test
    @DisplayName("14. Leading Zero OTP string (e.g. 012345) must be preserved as 6-char string without truncation")
    void testLeadingZeroStringOtpHandling() {
        OtpVerification challenge = new OtpVerification("REQ_ZERO_LEAD", sampleCitizen, "9876543210", "hashed_otp_with_zero", OtpPurpose.LOGIN, "masked", LocalDateTime.now().plusMinutes(5));
        when(otpVerificationRepository.findByOtpRequestId("REQ_ZERO_LEAD")).thenReturn(Optional.of(challenge));
        when(passwordEncoder.matches("012345", "hashed_otp_with_zero")).thenReturn(true);
        when(jwtUtils.generateToken(any(Authentication.class))).thenReturn("signed.jwt.token");

        OtpVerifyDto verifyReq = new OtpVerifyDto("REQ_ZERO_LEAD", "012345");
        AuthResponse authRes = otpService.verifyLoginOtp(verifyReq, false);

        assertNotNull(authRes);
        assertEquals("signed.jwt.token", authRes.getToken());
        assertTrue(challenge.isConsumed());
    }

    @Test
    @DisplayName("15. IP Binding Security: OTP Verification rejected when submitted from a mismatched IP address")
    void testIpMismatchRejection() {
        jakarta.servlet.http.HttpServletRequest mockRequest = mock(jakarta.servlet.http.HttpServletRequest.class);
        lenient().when(mockRequest.getHeader(anyString())).thenReturn(null);
        lenient().when(mockRequest.getRemoteAddr()).thenReturn("198.51.100.25"); // Attacker IP

        OtpVerification challenge = new OtpVerification(
                "REQ_IP_TEST", sampleCitizen, "9876543210", "hashed_otp_code",
                OtpPurpose.LOGIN, "masked", LocalDateTime.now().plusMinutes(5),
                "203.0.113.10", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" // Legitimate IP
        );

        when(otpVerificationRepository.findByOtpRequestId("REQ_IP_TEST")).thenReturn(Optional.of(challenge));

        OtpVerifyDto verifyReq = new OtpVerifyDto("REQ_IP_TEST", "482910");
        UnauthorizedActionException ex = assertThrows(UnauthorizedActionException.class,
                () -> otpService.verifyLoginOtp(verifyReq, false, mockRequest));

        assertTrue(ex.getMessage().contains("same network"));
        assertFalse(challenge.isConsumed());
        assertEquals(1, challenge.getAttemptCount());
    }

    @Test
    @DisplayName("16. Device / User-Agent Binding: OTP Verification rejected when submitted from a different browser / device")
    void testUserAgentMismatchRejection() {
        jakarta.servlet.http.HttpServletRequest mockRequest = mock(jakarta.servlet.http.HttpServletRequest.class);
        lenient().when(mockRequest.getHeader(anyString())).thenAnswer(inv -> {
            String h = inv.getArgument(0);
            if ("User-Agent".equalsIgnoreCase(h)) {
                return "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)"; // Different Device
            }
            return null;
        });
        lenient().when(mockRequest.getRemoteAddr()).thenReturn("203.0.113.10"); // Same IP

        OtpVerification challenge = new OtpVerification(
                "REQ_UA_TEST", sampleCitizen, "9876543210", "hashed_otp_code",
                OtpPurpose.LOGIN, "masked", LocalDateTime.now().plusMinutes(5),
                "203.0.113.10", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" // Original Device
        );

        when(otpVerificationRepository.findByOtpRequestId("REQ_UA_TEST")).thenReturn(Optional.of(challenge));

        OtpVerifyDto verifyReq = new OtpVerifyDto("REQ_UA_TEST", "482910");
        UnauthorizedActionException ex = assertThrows(UnauthorizedActionException.class,
                () -> otpService.verifyLoginOtp(verifyReq, false, mockRequest));

        assertTrue(ex.getMessage().contains("Device mismatch"));
        assertFalse(challenge.isConsumed());
        assertEquals(1, challenge.getAttemptCount());
    }

    @Test
    @DisplayName("17. Matching IP & Device Verification: Successfully authenticates when IP and User-Agent match")
    void testMatchingIpAndDeviceVerification() {
        jakarta.servlet.http.HttpServletRequest mockRequest = mock(jakarta.servlet.http.HttpServletRequest.class);
        lenient().when(mockRequest.getHeader(anyString())).thenAnswer(inv -> {
            String h = inv.getArgument(0);
            if ("X-Forwarded-For".equalsIgnoreCase(h)) {
                return "203.0.113.10";
            }
            if ("User-Agent".equalsIgnoreCase(h)) {
                return "Mozilla/5.0 (Windows NT 10.0; Win64; x64)";
            }
            return null;
        });
        lenient().when(mockRequest.getRemoteAddr()).thenReturn("203.0.113.10");

        OtpVerification challenge = new OtpVerification(
                "REQ_MATCH_TEST", sampleCitizen, "9876543210", "hashed_otp_code",
                OtpPurpose.LOGIN, "masked", LocalDateTime.now().plusMinutes(5),
                "203.0.113.10", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        );

        when(otpVerificationRepository.findByOtpRequestId("REQ_MATCH_TEST")).thenReturn(Optional.of(challenge));
        when(passwordEncoder.matches("482910", "hashed_otp_code")).thenReturn(true);
        when(jwtUtils.generateToken(any(Authentication.class))).thenReturn("signed.jwt.token");

        OtpVerifyDto verifyReq = new OtpVerifyDto("REQ_MATCH_TEST", "482910");
        AuthResponse authRes = otpService.verifyLoginOtp(verifyReq, false, mockRequest);

        assertNotNull(authRes);
        assertEquals("signed.jwt.token", authRes.getToken());
        assertTrue(challenge.isConsumed());
    }

    @Test
    @DisplayName("18. Account Lockout Protection: Identifier with 3+ failed challenges in last hour is locked for 30 minutes")
    void testAccountLockoutProtection() {
        OtpVerification lastFailed = new OtpVerification("REQ_FAILED_3", sampleCitizen, "9876543210", "hash",
                OtpPurpose.LOGIN, "masked", LocalDateTime.now().minusMinutes(5));
        lastFailed.setCreatedAt(LocalDateTime.now().minusMinutes(10)); // Failed 10 mins ago (within 30m)
        lastFailed.setAttemptCount(5);

        when(otpVerificationRepository.countByIdentifierAndAttemptCountGreaterThanEqualAndCreatedAtAfter(
                eq("9876543210"), eq(5), any(LocalDateTime.class))).thenReturn(3L);
        when(otpVerificationRepository.findTopByIdentifierAndAttemptCountGreaterThanEqualOrderByCreatedAtDesc("9876543210", 5))
                .thenReturn(Optional.of(lastFailed));

        OtpRequestDto req = new OtpRequestDto("9876543210");
        UnauthorizedActionException ex = assertThrows(UnauthorizedActionException.class,
                () -> otpService.requestLoginOtp(req, false));

        assertTrue(ex.getMessage().contains("temporarily locked"));
        verify(smsService, never()).sendOtp(anyString(), anyString(), anyString());
    }

    @Test
    @DisplayName("19. Login Audit Trail: Verification records SUCCESS or FAILED in audit repository")
    void testLoginAuditRecording() {
        OtpVerification challenge = new OtpVerification(
                "REQ_AUDIT_TEST", sampleCitizen, "9876543210", "hashed_otp_code",
                OtpPurpose.LOGIN, "masked", LocalDateTime.now().plusMinutes(5)
        );

        when(otpVerificationRepository.findByOtpRequestId("REQ_AUDIT_TEST")).thenReturn(Optional.of(challenge));
        when(passwordEncoder.matches("482910", "hashed_otp_code")).thenReturn(true);
        when(jwtUtils.generateToken(any(Authentication.class))).thenReturn("signed.jwt.token");

        OtpVerifyDto verifyReq = new OtpVerifyDto("REQ_AUDIT_TEST", "482910");
        otpService.verifyLoginOtp(verifyReq, false);

        verify(userLoginAuditRepository, times(1)).save(any(UserLoginAudit.class));
    }

    @Test
    @DisplayName("20. Registration OTP Request: Dispatches EmailJS registration email and stores pending challenge")
    void testRegistrationOtpRequest() {
        when(userRepository.findByEmail("newcitizen@mandi.org")).thenReturn(Optional.empty());
        when(userRepository.findByPhone("9876500001")).thenReturn(Optional.empty());
        when(otpVerificationRepository.findTopByIdentifierAndPurposeOrderByCreatedAtDesc(eq("newcitizen@mandi.org"), eq(OtpPurpose.REGISTRATION)))
                .thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("hashed_otp_or_pass");
        when(emailJsService.sendRegistrationOtpEmail(eq("newcitizen@mandi.org"), eq("New Citizen"), anyString())).thenReturn(true);

        RegisterRequest regReq = new RegisterRequest();
        regReq.setFullName("New Citizen");
        regReq.setEmail("newcitizen@mandi.org");
        regReq.setPhone("9876500001");
        regReq.setPassword("Password@123");
        regReq.setConfirmPassword("Password@123");

        OtpRequestResponse res = otpService.requestRegistrationOtp(regReq, null);

        assertNotNull(res);
        assertTrue(res.isSuccess());
        assertNotNull(res.getOtpRequestId());
        assertTrue(res.getOtpRequestId().startsWith("REQ_"));
        verify(emailJsService, times(1)).sendRegistrationOtpEmail(eq("newcitizen@mandi.org"), eq("New Citizen"), anyString());
        verify(otpVerificationRepository, times(1)).save(any(OtpVerification.class));
    }

    @Test
    @DisplayName("21. Registration OTP Request Rejects Duplicate Email or Mobile")
    void testRegistrationDuplicateEmailRejection() {
        when(userRepository.findByEmail("existing@mandi.org")).thenReturn(Optional.of(sampleCitizen));

        RegisterRequest regReq = new RegisterRequest();
        regReq.setFullName("Duplicate User");
        regReq.setEmail("existing@mandi.org");
        regReq.setPhone("9876500099");
        regReq.setPassword("Password@123");

        assertThrows(IllegalArgumentException.class, () -> otpService.requestRegistrationOtp(regReq, null));
    }

    @Test
    @DisplayName("22. Registration OTP Verification: Creates User and Profile transactionally, generates JWT")
    void testRegistrationOtpVerificationSuccess() {
        String pendingJson = "{\"fullName\":\"New Farmer\",\"email\":\"farmer2@mandi.org\",\"phone\":\"9876500002\",\"password\":\"encodedPass\",\"roles\":[\"ROLE_FARMER\"],\"villageOrTown\":\"Malihabad\",\"district\":\"Lucknow\",\"preferredLanguage\":\"HI\"}";

        OtpVerification regChallenge = new OtpVerification(
                "REQ_REG_VALID", null, "farmer2@mandi.org", "hashed_otp_code",
                OtpPurpose.REGISTRATION, "fa***@mandi.org", LocalDateTime.now().plusMinutes(5)
        );
        regChallenge.setRegistrationPayloadJson(pendingJson);

        when(otpVerificationRepository.findByOtpRequestId("REQ_REG_VALID")).thenReturn(Optional.of(regChallenge));
        when(passwordEncoder.matches("592810", "hashed_otp_code")).thenReturn(true);
        when(userRepository.findByEmail("farmer2@mandi.org")).thenReturn(Optional.empty());
        when(userRepository.findByPhone("9876500002")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(inv -> {
            User u = inv.getArgument(0);
            u.setId(50L);
            return u;
        });
        when(jwtUtils.generateToken(any(Authentication.class))).thenReturn("jwt.registered.token");

        OtpVerifyDto verifyDto = new OtpVerifyDto("REQ_REG_VALID", "592810");
        AuthResponse res = otpService.verifyRegistrationOtp(verifyDto, null);

        assertNotNull(res);
        assertEquals("jwt.registered.token", res.getToken());
        assertEquals("New Farmer", res.getFullName());
        assertEquals("farmer2@mandi.org", res.getEmail());
        assertTrue(regChallenge.isConsumed());
        assertNotNull(regChallenge.getVerifiedAt());
        verify(userRepository, times(1)).save(any(User.class));
        verify(userProfileRepository, times(1)).save(any(UserProfile.class));
    }
}
