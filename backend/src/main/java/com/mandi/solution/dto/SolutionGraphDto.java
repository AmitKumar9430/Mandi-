package com.mandi.solution.dto;

import com.mandi.solution.SolutionGraph;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

public class SolutionGraphDto {
    private Long id;
    private Long problemId;
    private String title;
    private String description;
    private String resolutionTier;
    private boolean acceptedByUser;
    private Integer totalSteps;
    private Integer completedSteps;
    private List<SolutionStepDto> steps;
    private Instant createdAt;
    private Instant updatedAt;

    public SolutionGraphDto() {}

    public static SolutionGraphDto from(SolutionGraph graph) {
        if (graph == null) return null;
        SolutionGraphDto dto = new SolutionGraphDto();
        dto.setId(graph.getId());
        if (graph.getProblem() != null) {
            dto.setProblemId(graph.getProblem().getId());
        }
        dto.setTitle(graph.getTitle());
        dto.setDescription(graph.getDescription());
        dto.setResolutionTier(graph.getResolutionTier());
        dto.setAcceptedByUser(graph.isAcceptedByUser());
        dto.setTotalSteps(graph.getTotalSteps());
        dto.setCompletedSteps(graph.getCompletedSteps());
        if (graph.getSteps() != null) {
            dto.setSteps(graph.getSteps().stream().map(SolutionStepDto::from).collect(Collectors.toList()));
        }
        dto.setCreatedAt(graph.getCreatedAt());
        dto.setUpdatedAt(graph.getUpdatedAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getProblemId() { return problemId; }
    public void setProblemId(Long problemId) { this.problemId = problemId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getResolutionTier() { return resolutionTier; }
    public void setResolutionTier(String resolutionTier) { this.resolutionTier = resolutionTier; }
    public boolean isAcceptedByUser() { return acceptedByUser; }
    public void setAcceptedByUser(boolean acceptedByUser) { this.acceptedByUser = acceptedByUser; }
    public Integer getTotalSteps() { return totalSteps; }
    public void setTotalSteps(Integer totalSteps) { this.totalSteps = totalSteps; }
    public Integer getCompletedSteps() { return completedSteps; }
    public void setCompletedSteps(Integer completedSteps) { this.completedSteps = completedSteps; }
    public List<SolutionStepDto> getSteps() { return steps; }
    public void setSteps(List<SolutionStepDto> steps) { this.steps = steps; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
