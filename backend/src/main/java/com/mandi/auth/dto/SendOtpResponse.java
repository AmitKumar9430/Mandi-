package com.mandi.auth.dto;

public class SendOtpResponse {

    private String identifier;
    private String otp;
    private String message;
    private int expiresInSeconds;

    public SendOtpResponse() {}

    public SendOtpResponse(String identifier, String otp, String message, int expiresInSeconds) {
        this.identifier = identifier;
        this.otp = otp;
        this.message = message;
        this.expiresInSeconds = expiresInSeconds;
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getExpiresInSeconds() {
        return expiresInSeconds;
    }

    public void setExpiresInSeconds(int expiresInSeconds) {
        this.expiresInSeconds = expiresInSeconds;
    }
}
