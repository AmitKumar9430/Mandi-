package com.mandi.auth;

import com.mandi.auth.dto.*;
import com.mandi.auth.otp.OtpService;
import com.mandi.common.ApiResponse;
import com.mandi.security.UserPrincipal;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final OtpService otpService;

    public AuthController(AuthService authService, OtpService otpService) {
        this.authService = authService;
        this.otpService = otpService;
    }

    // ==========================================================
    // STANDARDIZED SECURE OTP AUTHENTICATION ENDPOINTS (EMAILJS)
    // ==========================================================

    @PostMapping("/register/request-otp")
    public ResponseEntity<ApiResponse<OtpRequestResponse>> requestRegisterOtp(@Valid @RequestBody RegisterRequest request, HttpServletRequest httpRequest) {
        OtpRequestResponse response = otpService.requestRegistrationOtp(request, httpRequest);
        return ResponseEntity.ok(ApiResponse.ok(response.getMessage(), response));
    }

    @PostMapping("/register/verify-otp")
    public ResponseEntity<ApiResponse<AuthResponse>> verifyRegisterOtp(@Valid @RequestBody OtpVerifyDto request, HttpServletRequest httpRequest) {
        AuthResponse response = otpService.verifyRegistrationOtp(request, httpRequest);
        return ResponseEntity.ok(ApiResponse.ok("Registration completed successfully", response));
    }

    @PostMapping("/login/request-otp")
    public ResponseEntity<ApiResponse<OtpRequestResponse>> requestUserOtp(@Valid @RequestBody OtpRequestDto request, HttpServletRequest httpRequest) {
        OtpRequestResponse response = otpService.requestLoginOtp(request, false, httpRequest);
        return ResponseEntity.ok(ApiResponse.ok(response.getMessage(), response));
    }

    @PostMapping("/login/verify-otp")
    public ResponseEntity<ApiResponse<AuthResponse>> verifyUserOtp(@Valid @RequestBody OtpVerifyDto request, HttpServletRequest httpRequest) {
        AuthResponse response = otpService.verifyLoginOtp(request, false, httpRequest);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }

    @PostMapping("/admin-login/request-otp")
    public ResponseEntity<ApiResponse<OtpRequestResponse>> requestAdminOtp(@Valid @RequestBody OtpRequestDto request, HttpServletRequest httpRequest) {
        OtpRequestResponse response = otpService.requestLoginOtp(request, true, httpRequest);
        return ResponseEntity.ok(ApiResponse.ok(response.getMessage(), response));
    }

    @PostMapping("/admin-login/verify-otp")
    public ResponseEntity<ApiResponse<AuthResponse>> verifyAdminOtp(@Valid @RequestBody OtpVerifyDto request, HttpServletRequest httpRequest) {
        AuthResponse response = otpService.verifyLoginOtp(request, true, httpRequest);
        return ResponseEntity.ok(ApiResponse.ok("Administrator Login successful", response));
    }

    // ==========================================================
    // EXISTING AUTHENTICATION ENDPOINTS (FOR REGRESSION SAFETY)
    // ==========================================================

    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse<SendOtpResponse>> sendOtp(@Valid @RequestBody SendOtpRequest request) {
        SendOtpResponse response = authService.sendOtp(request);
        return ResponseEntity.ok(ApiResponse.ok(response.getMessage(), response));
    }

    @PostMapping("/verify-otp-login")
    public ResponseEntity<ApiResponse<AuthResponse>> verifyOtpLogin(@Valid @RequestBody VerifyOtpRequest request) {
        AuthResponse response = authService.verifyOtpLogin(request);
        return ResponseEntity.ok(ApiResponse.ok("OTP verified successfully. Login successful.", response));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(ApiResponse.ok("Registration successful", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }

    @PostMapping("/user-login")
    public ResponseEntity<ApiResponse<AuthResponse>> userLogin(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.userLogin(request);
        return ResponseEntity.ok(ApiResponse.ok("User Login successful", response));
    }

    @PostMapping("/admin-login")
    public ResponseEntity<ApiResponse<AuthResponse>> adminLogin(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.adminLogin(request);
        return ResponseEntity.ok(ApiResponse.ok("Admin Login successful", response));
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Password changed successfully", null));
    }
}
