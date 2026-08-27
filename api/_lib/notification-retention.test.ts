import assert from 'node:assert/strict';
import test from 'node:test';
import {
  isExpiredNotificationCreatedAt,
  NOTIFICATION_CLEANUP_BATCH_SIZE,
  NOTIFICATION_CLEANUP_MAX_DOCS_PER_RUN,
  NOTIFICATION_RETENTION_DAYS,
  NOTIFICATION_RETENTION_MS,
  notificationRetentionCutoff
} from './notification-retention.js';

test('notification retention is exactly seven days and uses an exclusive cutoff', () => {
  const now = 1_800_000_000_000;
  const cutoff = notificationRetentionCutoff(now);

  assert.equal(NOTIFICATION_RETENTION_DAYS, 7);
  assert.equal(NOTIFICATION_RETENTION_MS, 7 * 24 * 60 * 60 * 1000);
  assert.equal(cutoff, now - 7 * 24 * 60 * 60 * 1000);
  assert.equal(isExpiredNotificationCreatedAt(cutoff - 1, now), true);
  assert.equal(isExpiredNotificationCreatedAt(cutoff, now), false);
  assert.equal(isExpiredNotificationCreatedAt(cutoff + 1, now), false);
});

test('retention cleanup ignores timestamps that cannot establish document age', () => {
  const now = 1_800_000_000_000;
  const cutoff = notificationRetentionCutoff(now);

  assert.equal(isExpiredNotificationCreatedAt(undefined, now), false);
  assert.equal(isExpiredNotificationCreatedAt(null, now), false);
  assert.equal(isExpiredNotificationCreatedAt('legacy-date', now), false);
  assert.equal(isExpiredNotificationCreatedAt(Number.NaN, now), false);
  assert.equal(isExpiredNotificationCreatedAt(cutoff - 1, now), true);
});

test('cleanup stays within a safe Firestore batch and daily quota budget', () => {
  assert.equal(NOTIFICATION_CLEANUP_BATCH_SIZE, 400);
  assert.equal(NOTIFICATION_CLEANUP_MAX_DOCS_PER_RUN, 2_000);
  assert.ok(NOTIFICATION_CLEANUP_MAX_DOCS_PER_RUN < 20_000);
});
