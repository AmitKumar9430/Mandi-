package com.mandi.auth.dto;

import jakarta.validation.constraints.NotBlank;

public class OtpRequestDto {

    @NotBlank(message = "Identifier (Mobile number or Email) is required")
    private String identifier;

    private String adminPasskey;

    public OtpRequestDto() {}

    public OtpRequestDto(String identifier) {
        this.identifier = identifier;
    }

    public OtpRequestDto(String identifier, String adminPasskey) {
        this.identifier = identifier;
        this.adminPasskey = adminPasskey;
    }

    public String getIdentifier() { return identifier; }
    public void setIdentifier(String identifier) { this.identifier = identifier; }
    public String getAdminPasskey() { return adminPasskey; }
    public void setAdminPasskey(String adminPasskey) { this.adminPasskey = adminPasskey; }
}
