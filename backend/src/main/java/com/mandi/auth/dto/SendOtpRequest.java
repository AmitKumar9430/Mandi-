package com.mandi.auth.dto;

import jakarta.validation.constraints.NotBlank;

public class SendOtpRequest {

    @NotBlank(message = "Mobile number or email is required")
    private String identifier;

    public SendOtpRequest() {}

    public SendOtpRequest(String identifier) {
        this.identifier = identifier;
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }
}
