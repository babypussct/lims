import assert from 'node:assert/strict';
import test from 'node:test';

import {
  SERVICE_WORKER_RECOVERY_RELOAD_KEY_PREFIX,
  claimServiceWorkerRecoveryReload
} from './service-worker-recovery';

function createStorage() {
  const values = new Map<string, string>();
  return {
    getItem(key: string) {
      return values.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      values.set(key, value);
    },
    values
  };
}

test('allows the first automatic recovery reload for an app version', () => {
  const storage = createStorage();

  assert.equal(claimServiceWorkerRecoveryReload(storage, 'v26.08.13-b01'), true);
  assert.equal(
    storage.values.get(`${SERVICE_WORKER_RECOVERY_RELOAD_KEY_PREFIX}:v26.08.13-b01`),
    '1'
  );
});

test('blocks a second automatic recovery reload for the same app version', () => {
  const storage = createStorage();

  assert.equal(claimServiceWorkerRecoveryReload(storage, 'v26.08.13-b01'), true);
  assert.equal(claimServiceWorkerRecoveryReload(storage, 'v26.08.13-b01'), false);
});

test('allows recovery again after the app version changes', () => {
  const storage = createStorage();

  assert.equal(claimServiceWorkerRecoveryReload(storage, 'v26.08.13-b01'), true);
  assert.equal(claimServiceWorkerRecoveryReload(storage, 'v26.08.13-b02'), true);
});

test('uses a stable fallback key when the app version is unavailable', () => {
  const storage = createStorage();

  assert.equal(claimServiceWorkerRecoveryReload(storage, null), true);
  assert.equal(claimServiceWorkerRecoveryReload(storage, '   '), false);
});
