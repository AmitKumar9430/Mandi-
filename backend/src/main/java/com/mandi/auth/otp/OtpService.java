package com.mandi.auth.otp;

import com.mandi.auth.dto.AuthResponse;
import com.mandi.auth.dto.OtpRequestDto;
import com.mandi.auth.dto.OtpRequestResponse;
import com.mandi.auth.dto.OtpVerifyDto;

import jakarta.servlet.http.HttpServletRequest;

public interface OtpService {

    OtpRequestResponse requestLoginOtp(OtpRequestDto request, boolean isAdminPortal);

    OtpRequestResponse requestLoginOtp(OtpRequestDto request, boolean isAdminPortal, HttpServletRequest httpRequest);

    AuthResponse verifyLoginOtp(OtpVerifyDto request, boolean isAdminPortal);

    AuthResponse verifyLoginOtp(OtpVerifyDto request, boolean isAdminPortal, HttpServletRequest httpRequest);

    OtpRequestResponse requestRegistrationOtp(com.mandi.auth.dto.RegisterRequest request, HttpServletRequest httpRequest);

    AuthResponse verifyRegistrationOtp(OtpVerifyDto request, HttpServletRequest httpRequest);
}
