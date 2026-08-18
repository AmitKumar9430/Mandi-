package com.mandi.notification;

import com.mandi.common.PageResponse;
import com.mandi.exception.ResourceNotFoundException;
import com.mandi.user.Role;
import com.mandi.user.User;
import com.mandi.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void sendNotification(User recipient, String title, String message, NotificationType type, Long refId, String refCode, String targetUrl) {
        if (recipient == null) return;
        try {
            // Deduplication Guard: Do not send duplicate unread notification for the same reference
            if (refId != null && notificationRepository.existsByUserIdAndTypeAndReferenceIdAndReadFalse(recipient.getId(), type, refId)) {
                log.debug("Deduplication: Notification already exists for user {} type {} refId {}", recipient.getId(), type, refId);
                return;
            }
            Notification notification = new Notification(recipient, title, message, type, refId, refCode, targetUrl);
            notificationRepository.save(notification);
            log.info("🔔 [IN-APP NOTIFICATION] Sent to user {} ({}): {} - {}", recipient.getId(), recipient.getFullName(), title, refCode);
        } catch (Exception e) {
            log.warn("⚠️ Notification dispatch failed: {}", e.getMessage());
        }
    }

    @Transactional
    public void createNotification(Long userId, String title, String message, String typeStr, Long refId) {
        if (userId == null) return;
        userRepository.findById(userId).ifPresent(user -> {
            NotificationType type = NotificationType.ANNOUNCEMENT;
            try {
                if (typeStr != null) {
                    type = NotificationType.valueOf(typeStr.toUpperCase());
                }
            } catch (Exception ignored) {}
            sendNotification(user, title, message, type, refId, null, null);
        });
    }

    @Transactional
    public void notifyAdmins(String title, String message, NotificationType type, Long refId, String refCode, String targetUrl) {
        try {
            List<User> admins = userRepository.findAll().stream()
                    .filter(u -> u.getRoles() != null && u.getRoles().stream().anyMatch(r -> r == Role.ROLE_ADMIN || r == Role.ROLE_SUPER_ADMIN))
                    .toList();

            for (User admin : admins) {
                sendNotification(admin, title, message, type, refId, refCode, targetUrl);
            }
        } catch (Exception e) {
            log.warn("⚠️ Admin notification broadcast failed: {}", e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public PageResponse<Notification> getUserNotifications(Long userId, Pageable pageable) {
        Page<Notification> page = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        return new PageResponse<>(page.getContent(), page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages(), page.isLast());
    }

    @Transactional(readOnly = true)
    public List<Notification> getRecentNotifications(Long userId) {
        return notificationRepository.findTop10ByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        Notification n = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", notificationId));
        if (n.getUser().getId().equals(userId)) {
            n.setRead(true);
            notificationRepository.save(n);
        }
    }

    @Transactional
    public int markAllAsRead(Long userId) {
        return notificationRepository.markAllAsReadForUser(userId);
    }
}
