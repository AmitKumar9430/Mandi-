package com.mandi.problem;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mandi.common.BaseEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "problem_passports", indexes = {
        @Index(name = "idx_passport_code", columnList = "passport_code", unique = true)
})
public class ProblemPassport extends BaseEntity {

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false, unique = true)
    private Problem problem;

    @Column(name = "passport_code", nullable = false, unique = true, length = 30)
    private String passportCode; // e.g. MDI-2026-000001

    @Column(length = 2000)
    private String aiAnalysisSummary;

    @Column(length = 2000)
    private String identifiedSolutionPath;

    @Column(length = 1000)
    private String assignedResourcesSummary;

    @Column(length = 1000)
    private String resolutionSummary;

    private Integer estimatedPeopleImpacted = 1;
    private Long resolutionTimeSeconds;
    private boolean userConfirmedResolution = false;
    private Integer userRating; // 1-5
    private String userFeedback;

    public ProblemPassport() {}

    public ProblemPassport(Problem problem, String passportCode) {
        this.problem = problem;
        this.passportCode = passportCode;
    }

    public Problem getProblem() { return problem; }
    public void setProblem(Problem problem) { this.problem = problem; }
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
}
