package com.mandi.chat;

import com.mandi.common.BaseEntity;
import com.mandi.user.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "conversations", indexes = {
        @Index(name = "idx_conv_entity", columnList = "entityType, entityId"),
        @Index(name = "idx_conv_user1", columnList = "initiator_user_id"),
        @Index(name = "idx_conv_user2", columnList = "participant_user_id")
})
public class Conversation extends BaseEntity {

    @Column(nullable = false, length = 40)
    private String entityType; // PROBLEM, REQUEST, CROP_ORDER, TRANSPORT_BOOKING, COORDINATION_CASE

    @Column(nullable = false)
    private Long entityId;

    @Column(nullable = false, length = 150)
    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "initiator_user_id", nullable = false)
    private User initiator;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "participant_user_id")
    private User participant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mitra_user_id")
    private User mitra;

    @Column(length = 500)
    private String lastMessageSnippet;

    private LocalDateTime lastMessageAt = LocalDateTime.now();

    public Conversation() {}

    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }

    public Long getEntityId() { return entityId; }
    public void setEntityId(Long entityId) { this.entityId = entityId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public User getInitiator() { return initiator; }
    public void setInitiator(User initiator) { this.initiator = initiator; }

    public User getParticipant() { return participant; }
    public void setParticipant(User participant) { this.participant = participant; }

    public User getMitra() { return mitra; }
    public void setMitra(User mitra) { this.mitra = mitra; }

    public String getLastMessageSnippet() { return lastMessageSnippet; }
    public void setLastMessageSnippet(String lastMessageSnippet) { this.lastMessageSnippet = lastMessageSnippet; }

    public LocalDateTime getLastMessageAt() { return lastMessageAt; }
    public void setLastMessageAt(LocalDateTime lastMessageAt) { this.lastMessageAt = lastMessageAt; }
}
