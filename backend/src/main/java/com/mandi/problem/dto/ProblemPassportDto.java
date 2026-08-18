package com.mandi.problem.dto;

import com.mandi.problem.ProblemPassport;
import java.time.Instant;

public class ProblemPassportDto {
    private Long id;
    private Long problemId;
    private String passportCode;
    private String aiAnalysisSummary;
    private String identifiedSolutionPath;
    private String assignedResourcesSummary;
    private String resolutionSummary;
    private Integer estimatedPeopleImpacted;
    private Long resolutionTimeSeconds;
    private boolean userConfirmedResolution;
    private Integer userRating;
    private String userFeedback;
    private Instant createdAt;
    private Instant updatedAt;

    public ProblemPassportDto() {}

    public static ProblemPassportDto from(ProblemPassport passport) {
        if (passport == null) return null;
        ProblemPassportDto dto = new ProblemPassportDto();
        dto.setId(passport.getId());
        if (passport.getProblem() != null) {
            dto.setProblemId(passport.getProblem().getId());
        }
        dto.setPassportCode(passport.getPassportCode());
        dto.setAiAnalysisSummary(passport.getAiAnalysisSummary());
        dto.setIdentifiedSolutionPath(passport.getIdentifiedSolutionPath());
        dto.setAssignedResourcesSummary(passport.getAssignedResourcesSummary());
        dto.setResolutionSummary(passport.getResolutionSummary());
        dto.setEstimatedPeopleImpacted(passport.getEstimatedPeopleImpacted());
        dto.setResolutionTimeSeconds(passport.getResolutionTimeSeconds());
        dto.setUserConfirmedResolution(passport.isUserConfirmedResolution());
        dto.setUserRating(passport.getUserRating());
        dto.setUserFeedback(passport.getUserFeedback());
        dto.setCreatedAt(passport.getCreatedAt());
        dto.setUpdatedAt(passport.getUpdatedAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getProblemId() { return problemId; }
    public void setProblemId(Long problemId) { this.problemId = problemId; }
    public String getPassportCode() { return passportCode; }
    public void setPassportCode(String passportCode) { this.passportCode = passportCode; }
    public String getAiAnalysisSummary() { return aiAnalysisSummary; }
    public void setAiAnalysisSummary(String aiAnalysisSummary) { this.aiAnalysisSummary = aiAnalysisSummary; }
    public String getIdentifiedSolutionPath() { return identifiedSolutionPath; }
    public void setIdentifiedSolutionPath(String identifiedSolutionPath) { this.identifiedSolutionPath = identifiedSolutionPath; }
    public String getAssignedResourcesSummary() { return assignedResourcesSummary; }
    public void setAssignedResourcesSummary(String assignedResourcesSummary) { this.assignedResourcesSummary = assignedResourcesSummary; }
    public String getResolutionSummary() { return resolutionSummary; }
    public void setResolutionSummary(String resolutionSummary) { this.resolutionSummary = resolutionSummary; }
    public Integer getEstimatedPeopleImpacted() { return estimatedPeopleImpacted; }
    public void setEstimatedPeopleImpacted(Integer estimatedPeopleImpacted) { this.estimatedPeopleImpacted = estimatedPeopleImpacted; }
    public Long getResolutionTimeSeconds() { return resolutionTimeSeconds; }
    public void setResolutionTimeSeconds(Long resolutionTimeSeconds) { this.resolutionTimeSeconds = resolutionTimeSeconds; }
    public boolean isUserConfirmedResolution() { return userConfirmedResolution; }
    public void setUserConfirmedResolution(boolean userConfirmedResolution) { this.userConfirmedResolution = userConfirmedResolution; }
    public Integer getUserRating() { return userRating; }
    public void setUserRating(Integer userRating) { this.userRating = userRating; }
    public String getUserFeedback() { return userFeedback; }
    public void setUserFeedback(String userFeedback) { this.userFeedback = userFeedback; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
