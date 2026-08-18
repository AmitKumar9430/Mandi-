package com.mandi.solution.dto;

import jakarta.validation.constraints.NotBlank;

public class CompleteStepRequest {

    @NotBlank(message = "Completion notes are required")
    private String completionNotes;

    public CompleteStepRequest() {}

    public CompleteStepRequest(String completionNotes) {
        this.completionNotes = completionNotes;
    }

    public String getCompletionNotes() { return completionNotes; }
    public void setCompletionNotes(String completionNotes) { this.completionNotes = completionNotes; }
}
