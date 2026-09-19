import { createHash } from 'node:crypto';

export function notificationDocumentId(eventId: string, recipientUid: string): string {
  const digest = createHash('sha256')
    .update(eventId)
    .update('\0')
    .update(recipientUid)
    .digest('hex');
  return `event_${digest}`;
}

export function uniqueStringValues(values: unknown): string[] {
  if (!Array.isArray(values)) return [];
  return [...new Set(values.filter((value): value is string =>
    typeof value === 'string' && value.trim().length > 0
  ))];
}

/**
 * Converts an internal Angular route into a browser launch URL for this app's
 * HashLocationStrategy. In-app navigation keeps using `/route`; only browser
 * launches (FCM links, service-worker openWindow, manifest shortcuts) need
 * the `/#/route` form.
 */
export function pwaLaunchUrl(actionUrl: unknown): string {
  const value = typeof actionUrl === 'string' ? actionUrl.trim() : '';
  if (!value || value === '/') return '/#/';
  if (value.startsWith('/#/')) return value;
  if (value.startsWith('/') && !value.startsWith('//')) return `/#${value}`;
  return '/#/';
}

export function shouldClaimNotificationPush(
  existing: Record<string, unknown>,
  sendPush: boolean,
  now: number,
  claimTimeoutMs = 2 * 60_000
): boolean {
  if (!sendPush) return false;
  if (existing['pushStatus'] === 'failed') return true;
  return existing['pushStatus'] === 'sending'
    && Number(existing['pushClaimedAt'] || 0) < now - claimTimeoutMs;
}
