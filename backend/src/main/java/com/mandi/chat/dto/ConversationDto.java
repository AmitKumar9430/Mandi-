package com.mandi.chat.dto;

import com.mandi.chat.Conversation;

import java.time.LocalDateTime;

public class ConversationDto {
    private Long id;
    private String entityType;
    private Long entityId;
    private String title;
    private Long initiatorId;
    private String initiatorName;
    private Long participantId;
    private String participantName;
    private Long mitraId;
    private String mitraName;
    private String lastMessageSnippet;
    private LocalDateTime lastMessageAt;
    private long unreadCount;

    public static ConversationDto fromEntity(Conversation c) {
        if (c == null) return null;
        ConversationDto dto = new ConversationDto();
        dto.setId(c.getId());
        dto.setEntityType(c.getEntityType());
        dto.setEntityId(c.getEntityId());
        dto.setTitle(c.getTitle());
        if (c.getInitiator() != null) {
            dto.setInitiatorId(c.getInitiator().getId());
            dto.setInitiatorName(c.getInitiator().getFullName());
        }
        if (c.getParticipant() != null) {
            dto.setParticipantId(c.getParticipant().getId());
            dto.setParticipantName(c.getParticipant().getFullName());
        }
        if (c.getMitra() != null) {
            dto.setMitraId(c.getMitra().getId());
            dto.setMitraName(c.getMitra().getFullName());
        }
        dto.setLastMessageSnippet(c.getLastMessageSnippet());
        dto.setLastMessageAt(c.getLastMessageAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }
    public Long getEntityId() { return entityId; }
    public void setEntityId(Long entityId) { this.entityId = entityId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public Long getInitiatorId() { return initiatorId; }
    public void setInitiatorId(Long initiatorId) { this.initiatorId = initiatorId; }
    public String getInitiatorName() { return initiatorName; }
    public void setInitiatorName(String initiatorName) { this.initiatorName = initiatorName; }
    public Long getParticipantId() { return participantId; }
    public void setParticipantId(Long participantId) { this.participantId = participantId; }
    public String getParticipantName() { return participantName; }
    public void setParticipantName(String participantName) { this.participantName = participantName; }
    public Long getMitraId() { return mitraId; }
    public void setMitraId(Long mitraId) { this.mitraId = mitraId; }
    public String getMitraName() { return mitraName; }
    public void setMitraName(String mitraName) { this.mitraName = mitraName; }
    public String getLastMessageSnippet() { return lastMessageSnippet; }
    public void setLastMessageSnippet(String lastMessageSnippet) { this.lastMessageSnippet = lastMessageSnippet; }
    public LocalDateTime getLastMessageAt() { return lastMessageAt; }
    public void setLastMessageAt(LocalDateTime lastMessageAt) { this.lastMessageAt = lastMessageAt; }
    public long getUnreadCount() { return unreadCount; }
    public void setUnreadCount(long unreadCount) { this.unreadCount = unreadCount; }
}
