package br.com.calendar.notification;

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
        return new NotificationReadResponse(
                notificationRepository.markUnreadAsRead(notificationId, userId));
    }

    @Transactional
    public NotificationReadResponse markAllAsRead(String userId) {
        return new NotificationReadResponse(notificationRepository.markAllUnreadAsRead(userId));
    }
}
