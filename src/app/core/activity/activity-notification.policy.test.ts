import assert from 'node:assert/strict';
import test from 'node:test';
import {
  filterActivityNotificationRecipients,
  resolveActivityNotificationDecision,
  shouldSuppressActivityActor
} from './activity-notification.policy';

test('notification policy is an explicit subset of activity actions', () => {
  assert.deepEqual(resolveActivityNotificationDecision('SAVE_RESULT_DRAFT'), {
    enabled: false, channels: [], suppressActor: false
  });
  assert.deepEqual(resolveActivityNotificationDecision('PUBLISH_RESULT_REPORT'), {
    enabled: true, type: 'RESULT_PUBLISHED', channels: ['inbox', 'push'], suppressActor: true
  });
});

test('actor suppression is pure, deterministic, and deduplicates recipients', () => {
  const event = { action: 'PUBLISH_RESULT_REPORT', actorUid: 'actor-1' };
  assert.equal(shouldSuppressActivityActor(event, 'actor-1'), true);
  assert.equal(shouldSuppressActivityActor(event, 'recipient-1'), false);
  assert.deepEqual(
    filterActivityNotificationRecipients(event, ['actor-1', 'recipient-1', 'recipient-1', '', 'recipient-2']),
    ['recipient-1', 'recipient-2']
  );
});

test('non-notifying actions do not suppress the actor implicitly', () => {
  const event = { action: 'SAVE_RESULT_DRAFT', actorUid: 'actor-1' };
  assert.equal(shouldSuppressActivityActor(event, 'actor-1'), false);
  assert.deepEqual(filterActivityNotificationRecipients(event, ['actor-1']), ['actor-1']);
});
