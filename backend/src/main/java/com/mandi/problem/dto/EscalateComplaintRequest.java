package com.mandi.problem.dto;

import jakarta.validation.constraints.NotBlank;

public class EscalateComplaintRequest {

    @NotBlank(message = "Escalation reason is required")
    private String reason;

    private String directive;
    private Long targetOrganizationId;

    public EscalateComplaintRequest() {}

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public String getDirective() { return directive; }
    public void setDirective(String directive) { this.directive = directive; }
    public Long getTargetOrganizationId() { return targetOrganizationId; }
    public void setTargetOrganizationId(Long targetOrganizationId) { this.targetOrganizationId = targetOrganizationId; }
}
