package com.mandi.auth.dto;

public class OtpRequestResponse {

    private boolean success = true;
    private String message;
    private String otpRequestId;
    private String maskedPhone;
    private int expiresIn = 300;
    private String previewOtp;
    private String targetPhone;

    public OtpRequestResponse() {}

    public OtpRequestResponse(boolean success, String message, String otpRequestId, String maskedPhone, int expiresIn) {
        this.success = success;
        this.message = message;
        this.otpRequestId = otpRequestId;
        this.maskedPhone = maskedPhone;
        this.expiresIn = expiresIn;
    }

    public OtpRequestResponse(boolean success, String message, String otpRequestId, String maskedPhone, int expiresIn, String previewOtp) {
        this.success = success;
        this.message = message;
        this.otpRequestId = otpRequestId;
        this.maskedPhone = maskedPhone;
        this.expiresIn = expiresIn;
        this.previewOtp = previewOtp;
    }

    public OtpRequestResponse(boolean success, String message, String otpRequestId, String maskedPhone, int expiresIn, String previewOtp, String targetPhone) {
        this.success = success;
        this.message = message;
        this.otpRequestId = otpRequestId;
        this.maskedPhone = maskedPhone;
        this.expiresIn = expiresIn;
        this.previewOtp = previewOtp;
        this.targetPhone = targetPhone;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getOtpRequestId() { return otpRequestId; }
    public void setOtpRequestId(String otpRequestId) { this.otpRequestId = otpRequestId; }
    public String getVerificationId() { return otpRequestId; }
    public void setVerificationId(String verificationId) { this.otpRequestId = verificationId; }
    public String getMaskedPhone() { return maskedPhone; }
    public void setMaskedPhone(String maskedPhone) { this.maskedPhone = maskedPhone; }
    public int getExpiresIn() { return expiresIn; }
    public void setExpiresIn(int expiresIn) { this.expiresIn = expiresIn; }
    public String getPreviewOtp() { return previewOtp; }
    public void setPreviewOtp(String previewOtp) { this.previewOtp = previewOtp; }
    public String getTargetPhone() { return targetPhone; }
    public void setTargetPhone(String targetPhone) { this.targetPhone = targetPhone; }
}
