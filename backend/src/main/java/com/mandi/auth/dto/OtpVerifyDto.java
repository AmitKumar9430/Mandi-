package com.mandi.auth.dto;

import jakarta.validation.constraints.NotBlank;

public class OtpVerifyDto {

    @NotBlank(message = "OTP Request ID is required")
    private String otpRequestId;

    @NotBlank(message = "OTP code is required")
    private String otp;

    public OtpVerifyDto() {}

    public OtpVerifyDto(String otpRequestId, String otp) {
        this.otpRequestId = otpRequestId;
        this.otp = otp;
    }

    public String getOtpRequestId() {
        return (otpRequestId != null && !otpRequestId.isBlank()) ? otpRequestId : verificationId;
    }
    public void setOtpRequestId(String otpRequestId) { this.otpRequestId = otpRequestId; }

    public String getVerificationId() {
        return (verificationId != null && !verificationId.isBlank()) ? verificationId : otpRequestId;
    }
    public void setVerificationId(String verificationId) { this.verificationId = verificationId; }

    private String verificationId;

    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }
}
