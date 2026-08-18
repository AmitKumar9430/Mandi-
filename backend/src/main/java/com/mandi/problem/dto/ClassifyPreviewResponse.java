package com.mandi.problem.dto;

import com.mandi.problem.ProblemCategory;
import com.mandi.problem.ProblemUrgency;
import java.util.List;

public class ClassifyPreviewResponse {
    private ProblemCategory category;
    private ProblemUrgency urgency;
    private String suggestedTitle;
    private List<String> extractedTags;
    private List<String> requiredResources;
    private String solutionPathSummary;
    private String engineUsed; // "AI_ENGINE" or "DETERMINISTIC_FALLBACK_ENGINE"

    public ClassifyPreviewResponse() {}

    public ClassifyPreviewResponse(ProblemCategory category, ProblemUrgency urgency, String suggestedTitle,
                                   List<String> extractedTags, List<String> requiredResources, String solutionPathSummary, String engineUsed) {
        this.category = category;
        this.urgency = urgency;
        this.suggestedTitle = suggestedTitle;
        this.extractedTags = extractedTags;
        this.requiredResources = requiredResources;
        this.solutionPathSummary = solutionPathSummary;
        this.engineUsed = engineUsed;
    }

    public ProblemCategory getCategory() { return category; }
    public void setCategory(ProblemCategory category) { this.category = category; }
    public ProblemUrgency getUrgency() { return urgency; }
    public void setUrgency(ProblemUrgency urgency) { this.urgency = urgency; }
    public String getSuggestedTitle() { return suggestedTitle; }
    public void setSuggestedTitle(String suggestedTitle) { this.suggestedTitle = suggestedTitle; }
    public List<String> getExtractedTags() { return extractedTags; }
    public void setExtractedTags(List<String> extractedTags) { this.extractedTags = extractedTags; }
    public List<String> getRequiredResources() { return requiredResources; }
    public void setRequiredResources(List<String> requiredResources) { this.requiredResources = requiredResources; }
    public String getSolutionPathSummary() { return solutionPathSummary; }
    public void setSolutionPathSummary(String solutionPathSummary) { this.solutionPathSummary = solutionPathSummary; }
    public String getEngineUsed() { return engineUsed; }
    public void setEngineUsed(String engineUsed) { this.engineUsed = engineUsed; }
}
