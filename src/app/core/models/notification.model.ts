export type NotificationType = 'COA_REQUEST' | 'BORROW_REQUEST' | 'REQUEST_APPROVED' | 'REQUEST_REJECTED' | 'RETURN_OVERDUE' | 'STOCK_LOW_ALERT' | 'SYSTEM_INFO' | 'SYSTEM_UPDATE';

export type NotificationLevel = 'success' | 'error' | 'info' | 'warning';
export type NotificationChannel = 'toast' | 'inbox' | 'push';
export type NotificationRecipient = string | 'role:admin' | 'role:all';

/**
 * Contract duy nhất dùng khi một nghiệp vụ muốn phát thông báo.
 * NotificationCenterService sẽ quyết định chuyển event tới toast, bell hoặc push.
 */
export interface NotificationEvent {
  eventId?: string;
  recipientUid?: NotificationRecipient;
  senderUid?: string;
  senderName?: string;
  type?: NotificationType;
  level?: NotificationLevel;
  title?: string;
  message: string;
  targetId?: string;
  actionUrl?: string;
  actionLabel?: string;
  channels: NotificationChannel[];
  dedupeKey?: string;
  durationMs?: number;
  persistent?: boolean;
}

export interface AppNotification {
  id?: string;
  recipientUid: string;           // UID of recipient (always a specific user UID in Fan-out architecture)
  senderUid?: string;             // UID of the person triggering it (or 'System')
  senderName?: string;            // Name to display

  type: NotificationType;
  level?: NotificationLevel;
  title: string;                  // Short title: "Yêu cầu bổ sung CoA"
  message: string;                // Detailed message

  targetId?: string;              // Related entity ID (e.g., standard ID)
  actionUrl?: string;             // Route to navigate to when clicked (e.g., '/standards/123')
  groupId?: string;               // Optional: shared ID grouping fan-out copies of the same event
  eventId?: string;               // Stable ID shared by inbox, toast and push channels

  isRead: boolean;
  createdAt: number;              // Timestamp (Date.now())
}
