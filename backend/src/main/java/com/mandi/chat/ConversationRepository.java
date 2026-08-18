package com.mandi.chat;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    Optional<Conversation> findByEntityTypeAndEntityId(String entityType, Long entityId);

    @Query("SELECT c FROM Conversation c WHERE c.initiator.id = :userId OR c.participant.id = :userId OR (c.mitra IS NOT NULL AND c.mitra.id = :userId) ORDER BY c.lastMessageAt DESC")
    List<Conversation> findUserConversations(@Param("userId") Long userId);
}
