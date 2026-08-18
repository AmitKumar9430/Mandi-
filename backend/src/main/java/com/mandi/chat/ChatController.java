package com.mandi.chat;

import com.mandi.chat.dto.ChatMessageDto;
import com.mandi.chat.dto.ConversationDto;
import com.mandi.chat.dto.SendMessageRequest;
import com.mandi.common.ApiResponse;
import com.mandi.security.UserPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/conversations")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<ConversationDto>>> getMyConversations(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<ConversationDto> list = chatService.getUserConversations(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PostMapping("/entity/{entityType}/{entityId}")
    public ResponseEntity<ApiResponse<ConversationDto>> getOrCreateConversation(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String entityType,
            @PathVariable Long entityId,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) Long participantUserId,
            @RequestParam(required = false) Long mitraUserId) {
        ConversationDto dto = chatService.getOrCreateConversation(
                principal.getId(), entityType, entityId, title, participantUserId, mitraUserId);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @GetMapping("/{conversationId}/messages")
    public ResponseEntity<ApiResponse<List<ChatMessageDto>>> getMessages(
            @PathVariable Long conversationId) {
        List<ChatMessageDto> messages = chatService.getMessages(conversationId);
        return ResponseEntity.ok(ApiResponse.success(messages));
    }

    @PostMapping("/{conversationId}/messages")
    public ResponseEntity<ApiResponse<ChatMessageDto>> sendMessage(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long conversationId,
            @RequestBody SendMessageRequest req) {
        ChatMessageDto dto = chatService.sendMessage(principal.getId(), conversationId, req);
        return ResponseEntity.ok(ApiResponse.success(dto, "Message sent"));
    }
}
