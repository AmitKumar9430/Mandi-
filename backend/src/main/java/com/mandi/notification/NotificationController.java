package com.mandi.notification;

import com.mandi.common.ApiResponse;
import com.mandi.common.PageResponse;
import com.mandi.security.UserPrincipal;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<Notification>>> getNotifications(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        if (userPrincipal == null) {
            return ResponseEntity.ok(ApiResponse.ok(new PageResponse<>(List.of(), 0, size, 0, 0, true)));
        }
        Pageable pageable = PageRequest.of(page, size);
        PageResponse<Notification> result = notificationService.getUserNotifications(userPrincipal.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<List<Notification>>> getRecentNotifications(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        if (userPrincipal == null) {
            return ResponseEntity.ok(ApiResponse.ok(List.of()));
        }
        List<Notification> list = notificationService.getRecentNotifications(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        if (userPrincipal == null) {
            return ResponseEntity.ok(ApiResponse.ok(Map.of("unreadCount", 0L)));
        }
        long count = notificationService.getUnreadCount(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok(Map.of("unreadCount", count)));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        if (userPrincipal != null) {
            notificationService.markAsRead(id, userPrincipal.getId());
        }
        return ResponseEntity.ok(ApiResponse.ok("Notification marked as read", null));
    }

    @PostMapping("/read-all")
    public ResponseEntity<ApiResponse<Map<String, Integer>>> markAllAsRead(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        int updated = 0;
        if (userPrincipal != null) {
            updated = notificationService.markAllAsRead(userPrincipal.getId());
        }
        return ResponseEntity.ok(ApiResponse.ok("All notifications marked as read", Map.of("updatedCount", updated)));
    }
}
