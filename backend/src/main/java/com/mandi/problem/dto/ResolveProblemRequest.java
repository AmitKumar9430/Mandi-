package com.mandi.problem.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class ResolveProblemRequest {

    @NotBlank(message = "Resolution summary is required")
    private String resolutionSummary;

    private Integer estimatedPeopleImpacted = 1;

    @Min(value = 1, message = "Rating must be between 1 and 5")
    @Max(value = 5, message = "Rating must be between 1 and 5")
    private Integer userRating = 5;

    private String userFeedback;

    public ResolveProblemRequest() {}

    public String getResolutionSummary() { return resolutionSummary; }
    public void setResolutionSummary(String resolutionSummary) { this.resolutionSummary = resolutionSummary; }
    public Integer getEstimatedPeopleImpacted() { return estimatedPeopleImpacted; }
    public void setEstimatedPeopleImpacted(Integer estimatedPeopleImpacted) { this.estimatedPeopleImpacted = estimatedPeopleImpacted; }
    public Integer getUserRating() { return userRating; }
    public void setUserRating(Integer userRating) { this.userRating = userRating; }
    public String getUserFeedback() { return userFeedback; }
    public void setUserFeedback(String userFeedback) { this.userFeedback = userFeedback; }
}
