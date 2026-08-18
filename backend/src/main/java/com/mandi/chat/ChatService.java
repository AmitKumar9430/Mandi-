package com.mandi.chat;

import com.mandi.chat.dto.ChatMessageDto;
import com.mandi.chat.dto.ConversationDto;
import com.mandi.chat.dto.SendMessageRequest;
import com.mandi.exception.ResourceNotFoundException;
import com.mandi.notification.NotificationService;
import com.mandi.user.User;
import com.mandi.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private final ConversationRepository conversationRepository;
    private final ChatMessageRepository messageRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public ChatService(ConversationRepository conversationRepository,
                       ChatMessageRepository messageRepository,
                       UserRepository userRepository,
                       NotificationService notificationService) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public ConversationDto getOrCreateConversation(Long currentUserId, String entityType, Long entityId, String title, Long participantUserId, Long mitraUserId) {
        User initiator = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Conversation conv = conversationRepository.findByEntityTypeAndEntityId(entityType, entityId)
                .orElseGet(() -> {
                    Conversation c = new Conversation();
                    c.setEntityType(entityType);
                    c.setEntityId(entityId);
                    c.setTitle(title != null ? title : (entityType + " #" + entityId));
                    c.setInitiator(initiator);
                    if (participantUserId != null) {
                        userRepository.findById(participantUserId).ifPresent(c::setParticipant);
                    }
                    if (mitraUserId != null) {
                        userRepository.findById(mitraUserId).ifPresent(c::setMitra);
                    }
                    return conversationRepository.save(c);
                });

        ConversationDto dto = ConversationDto.fromEntity(conv);
        dto.setUnreadCount(messageRepository.countByConversationIdAndSenderIdNotAndIsReadFalse(conv.getId(), currentUserId));
        return dto;
    }

    @Transactional
    public ChatMessageDto sendMessage(Long senderId, Long conversationId, SendMessageRequest req) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found"));
        Conversation conv = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));

        ChatMessage msg = new ChatMessage();
        msg.setConversation(conv);
        msg.setSender(sender);
        msg.setMessageText(req.getMessageText());
        msg.setMessageType(req.getMessageType() != null ? req.getMessageType() : "TEXT");
        msg.setAttachmentUrl(req.getAttachmentUrl());
        msg.setSentAt(LocalDateTime.now());

        ChatMessage saved = messageRepository.save(msg);

        conv.setLastMessageSnippet(sender.getFullName() + ": " + (req.getMessageText().length() > 50 ? req.getMessageText().substring(0, 47) + "..." : req.getMessageText()));
        conv.setLastMessageAt(LocalDateTime.now());
        conversationRepository.save(conv);

        // Notify other participants
        Long otherUserId = null;
        if (conv.getInitiator() != null && !conv.getInitiator().getId().equals(senderId)) {
            otherUserId = conv.getInitiator().getId();
        } else if (conv.getParticipant() != null && !conv.getParticipant().getId().equals(senderId)) {
            otherUserId = conv.getParticipant().getId();
        }
        if (otherUserId != null) {
            try {
                notificationService.createNotification(
                        otherUserId,
                        "💬 New Message on " + conv.getTitle(),
                        sender.getFullName() + ": " + req.getMessageText(),
                        "CHAT",
                        conv.getEntityId()
                );
            } catch (Exception ignored) {}
        }

        return ChatMessageDto.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<ChatMessageDto> getMessages(Long conversationId) {
        return messageRepository.findByConversationIdOrderBySentAtAsc(conversationId)
                .stream().map(ChatMessageDto::fromEntity).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ConversationDto> getUserConversations(Long userId) {
        return conversationRepository.findUserConversations(userId).stream()
                .map(c -> {
                    ConversationDto dto = ConversationDto.fromEntity(c);
                    dto.setUnreadCount(messageRepository.countByConversationIdAndSenderIdNotAndIsReadFalse(c.getId(), userId));
                    return dto;
                }).collect(Collectors.toList());
    }
}
