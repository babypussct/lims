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
