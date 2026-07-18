import { NotificationLevel, NotificationType } from '../models/notification.model';

export type ForegroundSurface = 'toast' | 'browser' | 'none';

export function levelForNotificationType(type?: NotificationType): NotificationLevel {
  if (type === 'REQUEST_APPROVED') return 'success';
  if (type === 'REQUEST_REJECTED') return 'error';
  if (type === 'STOCK_LOW_ALERT' || type === 'RETURN_OVERDUE') return 'warning';
  return 'info';
}

export function selectForegroundSurface(
  visibility: DocumentVisibilityState,
  browserPermission: NotificationPermission
): ForegroundSurface {
  if (visibility === 'visible') return 'toast';
  if (browserPermission === 'granted') return 'browser';
  return 'none';
}
