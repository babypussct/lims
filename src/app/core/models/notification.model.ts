export type NotificationType = 'COA_REQUEST' | 'BORROW_REQUEST' | 'REQUEST_APPROVED' | 'REQUEST_REJECTED' | 'RETURN_OVERDUE' | 'STOCK_LOW_ALERT' | 'SYSTEM_INFO';

export interface AppNotification {
  id?: string;
  recipientUid: string;           // UID of recipient (always a specific user UID in Fan-out architecture)
  senderUid?: string;             // UID of the person triggering it (or 'System')
  senderName?: string;            // Name to display

  type: NotificationType;
  title: string;                  // Short title: "Yêu cầu bổ sung CoA"
  message: string;                // Detailed message

  targetId?: string;              // Related entity ID (e.g., standard ID)
  actionUrl?: string;             // Route to navigate to when clicked (e.g., '/standards/123')
  groupId?: string;               // Optional: shared ID grouping fan-out copies of the same event

  isRead: boolean;
  createdAt: number;              // Timestamp (Date.now())
}
