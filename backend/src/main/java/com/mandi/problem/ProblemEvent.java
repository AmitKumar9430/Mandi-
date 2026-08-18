package com.mandi.problem;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mandi.common.BaseEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "problem_events", indexes = {
        @Index(name = "idx_event_problem", columnList = "problem_id")
})
public class ProblemEvent extends BaseEntity {

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ProblemStatus previousStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ProblemStatus newStatus;

    @Column(nullable = false, length = 100)
    private String eventType; // e.g., CREATE_COMPLAINT, ASSIGN_COMPLAINT, START_WORK, MARK_RESOLVED, REOPEN_COMPLAINT, SUBMIT_FEEDBACK

    @Column(nullable = false, length = 1000)
    private String description;

    @Column(length = 100)
    private String actorName;

    private Long actorUserId;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String metadata;

    public ProblemEvent() {}

    public ProblemEvent(Problem problem, ProblemStatus previousStatus, ProblemStatus newStatus, String eventType, String description, String actorName, Long actorUserId) {
        this.problem = problem;
        this.previousStatus = previousStatus;
        this.newStatus = newStatus;
        this.eventType = eventType;
        this.description = description;
        this.actorName = actorName;
        this.actorUserId = actorUserId;
    }

    public Problem getProblem() { return problem; }
    public void setProblem(Problem problem) { this.problem = problem; }
    public ProblemStatus getPreviousStatus() { return previousStatus; }
    public void setPreviousStatus(ProblemStatus previousStatus) { this.previousStatus = previousStatus; }
    public ProblemStatus getNewStatus() { return newStatus; }
    public void setNewStatus(ProblemStatus newStatus) { this.newStatus = newStatus; }
    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getActorName() { return actorName; }
    public void setActorName(String actorName) { this.actorName = actorName; }
    public Long getActorUserId() { return actorUserId; }
    public void setActorUserId(Long actorUserId) { this.actorUserId = actorUserId; }
    public String getMetadata() { return metadata; }
    public void setMetadata(String metadata) { this.metadata = metadata; }
}
