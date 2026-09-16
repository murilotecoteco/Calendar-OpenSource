package br.com.calendar.notification;

import br.com.calendar.notification.dto.NotificationReadResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    private static final String USER_ID = "usr_abc123";
    private static final String NOTIFICATION_ID = "notification_123";

    @Mock
    private NotificationRepository notificationRepository;

    private NotificationService notificationService;

    @BeforeEach
    void setUp() {
        notificationService = new NotificationService(notificationRepository);
    }

    @Test
    void marksOneUnreadNotificationAsReadAndReturnsUpdatedCount() {
        when(notificationRepository.markUnreadAsRead(NOTIFICATION_ID, USER_ID)).thenReturn(1);

        NotificationReadResponse response = notificationService.markAsRead(NOTIFICATION_ID, USER_ID);

        assertEquals(1, response.count());
        verify(notificationRepository).markUnreadAsRead(NOTIFICATION_ID, USER_ID);
    }

    @Test
    void marksAllUnreadNotificationsAsReadAndReturnsUpdatedCount() {
        when(notificationRepository.markAllUnreadAsRead(USER_ID)).thenReturn(3);

        NotificationReadResponse response = notificationService.markAllAsRead(USER_ID);

        assertEquals(3, response.count());
        verify(notificationRepository).markAllUnreadAsRead(USER_ID);
    }
}
