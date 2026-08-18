package com.mandi.problem.dto;

public class VerifyResolutionRequest {

    private boolean verified; // true = successfully resolved, false = still not resolved
    private String rejectionReason;
    private String reopenProofUrl;

    public VerifyResolutionRequest() {}

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }
    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
    public String getReopenProofUrl() { return reopenProofUrl; }
    public void setReopenProofUrl(String reopenProofUrl) { this.reopenProofUrl = reopenProofUrl; }
}
