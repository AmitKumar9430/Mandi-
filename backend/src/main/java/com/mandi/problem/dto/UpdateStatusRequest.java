package com.mandi.problem.dto;

import com.mandi.problem.ProblemStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateStatusRequest {

    @NotNull(message = "New status is required")
    private ProblemStatus status;

    private String remarks;

    public UpdateStatusRequest() {}

    public UpdateStatusRequest(ProblemStatus status, String remarks) {
        this.status = status;
        this.remarks = remarks;
    }

    public ProblemStatus getStatus() { return status; }
    public void setStatus(ProblemStatus status) { this.status = status; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
