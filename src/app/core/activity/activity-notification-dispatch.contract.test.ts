import assert from 'node:assert/strict';
import test from 'node:test';
import { ACTIVITY_NOTIFICATION_DISPATCH_CONTRACT } from '../../../../api/_lib/activity-notification-dispatch';
import { ACTIVITY_ACTION_REGISTRY } from './activity-event-registry';

test('server dispatch allowlist matches every frontend WORKFLOW notification policy', () => {
  const frontend = Object.fromEntries(Object.entries(ACTIVITY_ACTION_REGISTRY)
    .filter(([, definition]) => definition.notification?.mode === 'WORKFLOW')
    .map(([action, definition]) => [action, {
      module: definition.module,
      audience: definition.audience,
      type: definition.notification?.type,
      channels: definition.notification?.defaultChannels,
      suppressActor: definition.notification?.suppressActor
    }]));

  const backend = Object.fromEntries(Object.entries(ACTIVITY_NOTIFICATION_DISPATCH_CONTRACT)
    .map(([action, contract]) => [action, {
      module: contract.module,
      audience: contract.audience,
      type: contract.type,
      channels: [...contract.channels],
      suppressActor: contract.suppressActor
    }]));

  assert.deepEqual(backend, frontend);
});
