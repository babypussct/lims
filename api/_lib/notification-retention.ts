export const NOTIFICATION_RETENTION_DAYS = 7;
export const NOTIFICATION_RETENTION_MS = NOTIFICATION_RETENTION_DAYS * 24 * 60 * 60 * 1000;

// Keep each Firestore write batch below the 500-operation limit.
export const NOTIFICATION_CLEANUP_BATCH_SIZE = 400;

// Spark has a daily delete quota. This cap leaves headroom for normal app
// traffic while allowing the small LIMS inbox to catch up in one daily run.
export const NOTIFICATION_CLEANUP_MAX_DOCS_PER_RUN = 2_000;

export function notificationRetentionCutoff(nowMs = Date.now()): number {
  return nowMs - NOTIFICATION_RETENTION_MS;
}

export function isExpiredNotificationCreatedAt(
  createdAt: unknown,
  nowMs = Date.now()
): boolean {
  return typeof createdAt === 'number'
    && Number.isFinite(createdAt)
    && createdAt < notificationRetentionCutoff(nowMs);
}
