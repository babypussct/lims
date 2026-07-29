import { NotificationLevel, NotificationType } from '../models/notification.model';

export type ForegroundSurface = 'toast' | 'browser' | 'none';

export interface MetadataSyncEvent {
  id?: string;
  version?: number;
  actorUid?: string;
  actorName?: string;
  action?: string;
  message?: string;
  targetId?: string;
}

export interface MetadataSyncToast {
  message: string;
  dedupeKey: string;
}

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

/**
 * Resolve a metadata change without consulting the activity-log cache. The log
 * and metadata listeners are independent, so the latest cached log can be stale.
 */
export function resolveMetadataSyncToast(
  moduleKey: string,
  moduleVersion: unknown,
  rawEvent: unknown,
  currentUserUid: string | undefined,
  fallbackMessage: string
): MetadataSyncToast | null {
  const version = typeof moduleVersion === 'number' ? moduleVersion : Number(moduleVersion);
  const event = isMetadataSyncEvent(rawEvent) && rawEvent.version === version ? rawEvent : undefined;

  // The initiating screen already shows its own operation result.
  if (event?.actorUid && currentUserUid && event.actorUid === currentUserUid) return null;

  return {
    message: event?.message?.trim() || fallbackMessage,
    dedupeKey: event?.id?.trim() || `${moduleKey}-sync-${Number.isFinite(version) ? version : String(moduleVersion)}`
  };
}

function isMetadataSyncEvent(value: unknown): value is MetadataSyncEvent {
  if (!value || typeof value !== 'object') return false;
  const event = value as Record<string, unknown>;
  return typeof event['version'] === 'number';
}
