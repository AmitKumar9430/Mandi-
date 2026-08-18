package com.mandi.problem.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class SubmitFeedbackRequest {

    @NotNull(message = "Rating (1 to 5 stars) is required")
    @Min(value = 1, message = "Rating must be at least 1 star")
    @Max(value = 5, message = "Rating cannot exceed 5 stars")
    private Integer rating;

    private String feedbackComments;
    private String feedbackTags;

    public SubmitFeedbackRequest() {}

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    public String getFeedbackComments() { return feedbackComments; }
    public void setFeedbackComments(String feedbackComments) { this.feedbackComments = feedbackComments; }
    public String getFeedbackTags() { return feedbackTags; }
    public void setFeedbackTags(String feedbackTags) { this.feedbackTags = feedbackTags; }
}
