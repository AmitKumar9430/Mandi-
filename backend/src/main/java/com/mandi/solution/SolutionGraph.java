package com.mandi.solution;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mandi.common.BaseEntity;
import com.mandi.problem.Problem;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "solution_graphs", indexes = {
        @Index(name = "idx_solution_problem", columnList = "problem_id")
})
public class SolutionGraph extends BaseEntity {

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(length = 50)
    private String resolutionTier = "DIRECT_MATCH"; // DIRECT_MATCH, COMMUNITY_RESOURCE, VOLUNTEER, NGO, MITRA_ESCALATION

    @Column(nullable = false)
    private boolean acceptedByUser = false;

    private Integer totalSteps = 0;
    private Integer completedSteps = 0;

    @OneToMany(mappedBy = "solutionGraph", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @OrderBy("stepSequence ASC")
    private List<SolutionStep> steps = new ArrayList<>();

    public SolutionGraph() {}

    public SolutionGraph(Problem problem, String title, String description) {
        this.problem = problem;
        this.title = title;
        this.description = description;
    }

    public void addStep(SolutionStep step) {
        steps.add(step);
        step.setSolutionGraph(this);
        this.totalSteps = steps.size();
    }

    public Problem getProblem() { return problem; }
    public void setProblem(Problem problem) { this.problem = problem; }
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
    public List<SolutionStep> getSteps() { return steps; }
    public void setSteps(List<SolutionStep> steps) { this.steps = steps; }
}
