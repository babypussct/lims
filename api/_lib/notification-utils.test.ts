import assert from 'node:assert/strict';
import test from 'node:test';
import { notificationDocumentId, uniqueStringValues } from './notification-utils.js';

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
