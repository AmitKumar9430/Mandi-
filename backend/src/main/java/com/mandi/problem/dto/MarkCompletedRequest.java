package com.mandi.problem.dto;

import jakarta.validation.constraints.NotBlank;

public class MarkCompletedRequest {

    @NotBlank(message = "Resolution description is required")
    private String resolutionDescription;

    private String actionTaken;
    private String resolutionProofUrl;
    private String resolverRemarks;

    public MarkCompletedRequest() {}

    public String getResolutionDescription() { return resolutionDescription; }
    public void setResolutionDescription(String resolutionDescription) { this.resolutionDescription = resolutionDescription; }
    public String getActionTaken() { return actionTaken; }
    public void setActionTaken(String actionTaken) { this.actionTaken = actionTaken; }
    public String getResolutionProofUrl() { return resolutionProofUrl; }
    public void setResolutionProofUrl(String resolutionProofUrl) { this.resolutionProofUrl = resolutionProofUrl; }
    public String getResolverRemarks() { return resolverRemarks; }
    public void setResolverRemarks(String resolverRemarks) { this.resolverRemarks = resolverRemarks; }
}
