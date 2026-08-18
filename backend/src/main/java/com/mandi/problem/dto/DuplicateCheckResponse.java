package com.mandi.problem.dto;

import java.util.List;

public class DuplicateCheckResponse {
    private boolean duplicateFound;
    private String message;
    private List<ProblemDto> similarProblems;

    public DuplicateCheckResponse() {}

    public DuplicateCheckResponse(boolean duplicateFound, String message, List<ProblemDto> similarProblems) {
        this.duplicateFound = duplicateFound;
        this.message = message;
        this.similarProblems = similarProblems;
    }

    public boolean isDuplicateFound() { return duplicateFound; }
    public void setDuplicateFound(boolean duplicateFound) { this.duplicateFound = duplicateFound; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public List<ProblemDto> getSimilarProblems() { return similarProblems; }
    public void setSimilarProblems(List<ProblemDto> similarProblems) { this.similarProblems = similarProblems; }
}
