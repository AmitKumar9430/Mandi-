package com.mandi.solution;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mandi.common.BaseEntity;
import com.mandi.resource.Resource;
import com.mandi.user.User;
import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "solution_steps", indexes = {
        @Index(name = "idx_step_graph", columnList = "solution_graph_id"),
        @Index(name = "idx_step_status", columnList = "status"),
        @Index(name = "idx_step_assignee", columnList = "assigned_user_id")
})
public class SolutionStep extends BaseEntity {

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "solution_graph_id", nullable = false)
    private SolutionGraph solutionGraph;

    @Column(nullable = false)
    private Integer stepSequence; // 1, 2, 3...

    @Column(nullable = false, length = 150)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(length = 100)
    private String requiredResourceType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private SolutionStepStatus status = SolutionStepStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_user_id")
    private User assignedUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_resource_id")
    private Resource assignedResource;

    @Column(length = 100)
    private String assignedEntityName;

    @Column(length = 50)
    private String contactPhone;

    private Instant deadline;
    private Instant completedAt;

    @Column(length = 1000)
    private String completionNotes;

    @Column(length = 1000)
    private String matchReason;

    private Double matchScore;

    @Version
    private Long version;

    public SolutionStep() {}

    public SolutionStep(Integer stepSequence, String title, String description, String requiredResourceType) {
        this.stepSequence = stepSequence;
        this.title = title;
        this.description = description;
        this.requiredResourceType = requiredResourceType;
    }

    public SolutionGraph getSolutionGraph() { return solutionGraph; }
    public void setSolutionGraph(SolutionGraph solutionGraph) { this.solutionGraph = solutionGraph; }
    public Integer getStepSequence() { return stepSequence; }
    public void setStepSequence(Integer stepSequence) { this.stepSequence = stepSequence; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getRequiredResourceType() { return requiredResourceType; }
    public void setRequiredResourceType(String requiredResourceType) { this.requiredResourceType = requiredResourceType; }
    public SolutionStepStatus getStatus() { return status; }
    public void setStatus(SolutionStepStatus status) { this.status = status; }
    public User getAssignedUser() { return assignedUser; }
    public void setAssignedUser(User assignedUser) { this.assignedUser = assignedUser; }
    public Resource getAssignedResource() { return assignedResource; }
    public void setAssignedResource(Resource assignedResource) { this.assignedResource = assignedResource; }
    public String getAssignedEntityName() { return assignedEntityName; }
    public void setAssignedEntityName(String assignedEntityName) { this.assignedEntityName = assignedEntityName; }
    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }
    public Instant getDeadline() { return deadline; }
    public void setDeadline(Instant deadline) { this.deadline = deadline; }
    public Instant getCompletedAt() { return completedAt; }
    public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt; }
    public String getCompletionNotes() { return completionNotes; }
    public void setCompletionNotes(String completionNotes) { this.completionNotes = completionNotes; }
    public String getMatchReason() { return matchReason; }
    public void setMatchReason(String matchReason) { this.matchReason = matchReason; }
    public Double getMatchScore() { return matchScore; }
    public void setMatchScore(Double matchScore) { this.matchScore = matchScore; }
    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }
}
