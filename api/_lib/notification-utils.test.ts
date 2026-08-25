import assert from 'node:assert/strict';
import test from 'node:test';
import { notificationDocumentId, shouldClaimNotificationPush, uniqueStringValues } from './notification-utils.js';

test('notification document IDs are stable per event and recipient', () => {
  const first = notificationDocumentId('event-123', 'user-a');
  const retry = notificationDocumentId('event-123', 'user-a');
  const anotherRecipient = notificationDocumentId('event-123', 'user-b');

  assert.equal(first, retry);
  assert.notEqual(first, anotherRecipient);
  assert.match(first, /^event_[a-f0-9]{64}$/);
});

test('FCM token normalization removes duplicates and invalid values', () => {
  assert.deepEqual(
    uniqueStringValues(['token-a', '', 'token-a', null, 'token-b', 42]),
    ['token-a', 'token-b']
  );
});

test('same event retry never duplicates inbox and only reclaims failed or stale push work', () => {
  const now = 1_000_000;
  assert.equal(notificationDocumentId('event-123', 'user-a'), notificationDocumentId('event-123', 'user-a'));
  assert.equal(shouldClaimNotificationPush({ pushStatus: 'sent' }, true, now), false);
  assert.equal(shouldClaimNotificationPush({ pushStatus: 'no_token' }, true, now), false);
  assert.equal(shouldClaimNotificationPush({ pushStatus: 'failed' }, true, now), true);
  assert.equal(shouldClaimNotificationPush({ pushStatus: 'sending', pushClaimedAt: now - 30_000 }, true, now), false);
  assert.equal(shouldClaimNotificationPush({ pushStatus: 'sending', pushClaimedAt: now - 180_000 }, true, now), true);
  assert.equal(shouldClaimNotificationPush({ pushStatus: 'failed' }, false, now), false);
});
