package com.mandi.problem.dto;

import com.mandi.problem.ProblemEvent;
import com.mandi.problem.ProblemStatus;
import java.time.Instant;

public class ProblemEventDto {
    private Long id;
    private ProblemStatus previousStatus;
    private ProblemStatus newStatus;
    private String eventType;
    private String description;
    private String actorName;
    private Long actorUserId;
    private Instant createdAt;

    public ProblemEventDto() {}

    public static ProblemEventDto from(ProblemEvent event) {
        ProblemEventDto dto = new ProblemEventDto();
        dto.setId(event.getId());
        dto.setPreviousStatus(event.getPreviousStatus());
        dto.setNewStatus(event.getNewStatus());
        dto.setEventType(event.getEventType());
        dto.setDescription(event.getDescription());
        dto.setActorName(event.getActorName());
        dto.setActorUserId(event.getActorUserId());
        dto.setCreatedAt(event.getCreatedAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
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
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
