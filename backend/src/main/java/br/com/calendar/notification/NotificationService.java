package br.com.calendar.notification;

import br.com.calendar.common.exception.ResourceNotFoundException;
import br.com.calendar.notification.dto.NotificationReadResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Transactional
    public NotificationReadResponse markAsRead(String notificationId, String userId) {
        int updatedCount = notificationRepository.markUnreadAsRead(notificationId, userId);
        if (updatedCount == 0 && !notificationRepository.existsByIdAndUser_Id(notificationId, userId)) {
            throw new ResourceNotFoundException("Notification not found");
        }

        return new NotificationReadResponse(updatedCount);
    }

    @Transactional
    public NotificationReadResponse markAllAsRead(String userId) {
        return new NotificationReadResponse(notificationRepository.markAllUnreadAsRead(userId));
    }
}
