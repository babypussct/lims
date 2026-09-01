import assert from 'node:assert/strict';
import test from 'node:test';

import {
  CHUNK_RECOVERY_RELOAD_COOLDOWN_MS,
  CHUNK_RECOVERY_RELOAD_KEY,
  claimChunkRecoveryReload
} from './chunk-reload-recovery';

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

test('allows the first stale-chunk recovery reload', () => {
  const storage = createStorage();
  const now = 1_000_000;

  assert.equal(claimChunkRecoveryReload(storage, now), true);
  assert.equal(storage.values.get(CHUNK_RECOVERY_RELOAD_KEY), now.toString());
});

test('blocks another reload inside the cooldown window', () => {
  const storage = createStorage();
  const now = 1_000_000;

  assert.equal(claimChunkRecoveryReload(storage, now), true);
  assert.equal(
    claimChunkRecoveryReload(storage, now + CHUNK_RECOVERY_RELOAD_COOLDOWN_MS),
    false
  );
});

test('allows recovery again after the cooldown window', () => {
  const storage = createStorage();
  const now = 1_000_000;

  assert.equal(claimChunkRecoveryReload(storage, now), true);
  assert.equal(
    claimChunkRecoveryReload(storage, now + CHUNK_RECOVERY_RELOAD_COOLDOWN_MS + 1),
    true
  );
});

test('fails closed when recovery storage is unavailable', () => {
  const storage = {
    getItem() {
      throw new Error('storage disabled');
    },
    setItem() {
      throw new Error('storage disabled');
    }
  };

  assert.equal(claimChunkRecoveryReload(storage, 1_000_000), false);
});
