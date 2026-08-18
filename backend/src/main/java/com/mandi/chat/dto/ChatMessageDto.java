package com.mandi.chat.dto;

import com.mandi.chat.ChatMessage;

import java.time.LocalDateTime;

public class ChatMessageDto {
    private Long id;
    private Long conversationId;
    private Long senderId;
    private String senderName;
    private String messageText;
    private String messageType;
    private String attachmentUrl;
    private boolean isRead;
    private LocalDateTime sentAt;

    public static ChatMessageDto fromEntity(ChatMessage m) {
        if (m == null) return null;
        ChatMessageDto dto = new ChatMessageDto();
        dto.setId(m.getId());
        if (m.getConversation() != null) {
            dto.setConversationId(m.getConversation().getId());
        }
        if (m.getSender() != null) {
            dto.setSenderId(m.getSender().getId());
            dto.setSenderName(m.getSender().getFullName());
        }
        dto.setMessageText(m.getMessageText());
        dto.setMessageType(m.getMessageType());
        dto.setAttachmentUrl(m.getAttachmentUrl());
        dto.setRead(m.isRead());
        dto.setSentAt(m.getSentAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getConversationId() { return conversationId; }
    public void setConversationId(Long conversationId) { this.conversationId = conversationId; }
    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }
    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }
    public String getMessageText() { return messageText; }
    public void setMessageText(String messageText) { this.messageText = messageText; }
    public String getMessageType() { return messageType; }
    public void setMessageType(String messageType) { this.messageType = messageType; }
    public String getAttachmentUrl() { return attachmentUrl; }
    public void setAttachmentUrl(String attachmentUrl) { this.attachmentUrl = attachmentUrl; }
    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }
    public LocalDateTime getSentAt() { return sentAt; }
    public void setSentAt(LocalDateTime sentAt) { this.sentAt = sentAt; }
}
