package com.mandi.problem.dto;

import jakarta.validation.constraints.NotBlank;

public class ProgressUpdateRequest {

    private Integer progressPercent;

    @NotBlank(message = "Progress update details are required")
    private String progressRemarks;

    private String proofPhotoUrl;

    public ProgressUpdateRequest() {}

    public Integer getProgressPercent() { return progressPercent; }
    public void setProgressPercent(Integer progressPercent) { this.progressPercent = progressPercent; }
    public String getProgressRemarks() { return progressRemarks; }
    public void setProgressRemarks(String progressRemarks) { this.progressRemarks = progressRemarks; }
    public String getProofPhotoUrl() { return proofPhotoUrl; }
    public void setProofPhotoUrl(String proofPhotoUrl) { this.proofPhotoUrl = proofPhotoUrl; }
}
