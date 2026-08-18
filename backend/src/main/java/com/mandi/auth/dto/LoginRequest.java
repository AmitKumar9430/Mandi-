package com.mandi.auth.dto;

import jakarta.validation.constraints.NotBlank;

public class LoginRequest {

    @NotBlank(message = "Phone number or email is required")
    private String identifier;

    @NotBlank(message = "Password is required")
    private String password;

    private String adminPasskey;

    public LoginRequest() {}

    public LoginRequest(String identifier, String password) {
        this.identifier = identifier;
        this.password = password;
    }

    public LoginRequest(String identifier, String password, String adminPasskey) {
        this.identifier = identifier;
        this.password = password;
        this.adminPasskey = adminPasskey;
    }

    public String getIdentifier() { return identifier; }
    public void setIdentifier(String identifier) { this.identifier = identifier; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getAdminPasskey() { return adminPasskey; }
    public void setAdminPasskey(String adminPasskey) { this.adminPasskey = adminPasskey; }
}
