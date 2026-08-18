package com.mandi.solution.dto;

import com.mandi.solution.SolutionStep;
import com.mandi.solution.SolutionStepStatus;
import java.time.Instant;

public class SolutionStepDto {
    private Long id;
    private Integer stepSequence;
    private String title;
    private String description;
    private String requiredResourceType;
    private SolutionStepStatus status;
    private Long assignedUserId;
    private String assignedUserName;
    private Long assignedResourceId;
    private String assignedResourceName;
    private String assignedEntityName;
    private String contactPhone;
    private Instant deadline;
    private Instant completedAt;
    private String completionNotes;
    private String matchReason;
    private Double matchScore;
    private Long version;

    public SolutionStepDto() {}

    public static SolutionStepDto from(SolutionStep step) {
        if (step == null) return null;
        SolutionStepDto dto = new SolutionStepDto();
        dto.setId(step.getId());
        dto.setStepSequence(step.getStepSequence());
        dto.setTitle(step.getTitle());
        dto.setDescription(step.getDescription());
        dto.setRequiredResourceType(step.getRequiredResourceType());
        dto.setStatus(step.getStatus());
        if (step.getAssignedUser() != null) {
            dto.setAssignedUserId(step.getAssignedUser().getId());
            dto.setAssignedUserName(step.getAssignedUser().getFullName());
        }
        if (step.getAssignedResource() != null) {
            dto.setAssignedResourceId(step.getAssignedResource().getId());
            dto.setAssignedResourceName(step.getAssignedResource().getName());
        }
        dto.setAssignedEntityName(step.getAssignedEntityName());
        dto.setContactPhone(step.getContactPhone());
        dto.setDeadline(step.getDeadline());
        dto.setCompletedAt(step.getCompletedAt());
        dto.setCompletionNotes(step.getCompletionNotes());
        dto.setMatchReason(step.getMatchReason());
        dto.setMatchScore(step.getMatchScore());
        dto.setVersion(step.getVersion());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Integer getStepSequence() { return stepSequence; }
    public void setStepSequence(Integer stepSequence) { this.stepSequence = stepSequence; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getRequiredResourceType() { return requiredResourceType; }
    public void setRequiredResourceType(String requiredResourceType) { this.requiredResourceType = requiredResourceType; }
    public SolutionStepStatus getStatus() { return status; }
    public void setStatus(SolutionStepStatus status) { this.status = status; }
    public Long getAssignedUserId() { return assignedUserId; }
    public void setAssignedUserId(Long assignedUserId) { this.assignedUserId = assignedUserId; }
    public String getAssignedUserName() { return assignedUserName; }
    public void setAssignedUserName(String assignedUserName) { this.assignedUserName = assignedUserName; }
    public Long getAssignedResourceId() { return assignedResourceId; }
    public void setAssignedResourceId(Long assignedResourceId) { this.assignedResourceId = assignedResourceId; }
    public String getAssignedResourceName() { return assignedResourceName; }
    public void setAssignedResourceName(String assignedResourceName) { this.assignedResourceName = assignedResourceName; }
    public String getAssignedEntityName() { return assignedEntityName; }
    public void setAssignedEntityName(String assignedEntityName) { this.assignedEntityName = assignedEntityName; }
    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }
    public Instant getDeadline() { return deadline; }
    public void setDeadline(Instant deadline) { this.deadline = deadline; }
    public Instant getCompletedAt() { return completedAt; }
    public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt; }
    public String getCompletionNotes() { return completionNotes; }
    public void setCompletionNotes(String completionNotes) { this.completionNotes = completionNotes; }
    public String getMatchReason() { return matchReason; }
    public void setMatchReason(String matchReason) { this.matchReason = matchReason; }
    public Double getMatchScore() { return matchScore; }
    public void setMatchScore(Double matchScore) { this.matchScore = matchScore; }
    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }
}
