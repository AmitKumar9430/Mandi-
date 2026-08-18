package com.mandi.problem.dto;

import jakarta.validation.constraints.NotNull;

public class AssignComplaintRequest {

    @NotNull(message = "Responsible Organization ID is required")
    private Long organizationId;

    private Long resolverUserId;
    private Integer customDeadlineHours;
    private String assignmentRemarks;

    public AssignComplaintRequest() {}

    public Long getOrganizationId() { return organizationId; }
    public void setOrganizationId(Long organizationId) { this.organizationId = organizationId; }
    public Long getResolverUserId() { return resolverUserId; }
    public void setResolverUserId(Long resolverUserId) { this.resolverUserId = resolverUserId; }
    public Integer getCustomDeadlineHours() { return customDeadlineHours; }
    public void setCustomDeadlineHours(Integer customDeadlineHours) { this.customDeadlineHours = customDeadlineHours; }
    public String getAssignmentRemarks() { return assignmentRemarks; }
    public void setAssignmentRemarks(String assignmentRemarks) { this.assignmentRemarks = assignmentRemarks; }
}
