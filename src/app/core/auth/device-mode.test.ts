import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  resolveDeviceMode,
  resolveFirestoreCacheMode,
  persistDeviceMode,
  DEVICE_MODE_STORAGE_KEY,
  LEGACY_SHARED_DEVICE_KEY,
  LEGACY_REMEMBER_SESSION_KEY,
  type StorageLike,
} from './device-mode.js';

class MockStorage implements StorageLike {
  private data = new Map<string, string>();

  getItem(key: string): string | null {
    return this.data.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.data.set(key, value);
  }
}

describe('device-mode resolution & migration', () => {
  it('keeps Firestore document cache memory-only for both personal and shared modes', () => {
    assert.equal(resolveFirestoreCacheMode('personal'), 'memory');
    assert.equal(resolveFirestoreCacheMode('shared'), 'memory');
  });

  it('defaults to shared when storage is null or undefined', () => {
    assert.equal(resolveDeviceMode(null), 'shared');
    assert.equal(resolveDeviceMode(undefined), 'shared');
  });

  it('defaults to shared when storage is completely empty', () => {
    const storage = new MockStorage();
    assert.equal(resolveDeviceMode(storage), 'shared');
  });

  it('honors canonical key when set to personal', () => {
    const storage = new MockStorage();
    storage.setItem(DEVICE_MODE_STORAGE_KEY, 'personal');
    assert.equal(resolveDeviceMode(storage), 'personal');
  });

  it('honors canonical key when set to shared', () => {
    const storage = new MockStorage();
    storage.setItem(DEVICE_MODE_STORAGE_KEY, 'shared');
    assert.equal(resolveDeviceMode(storage), 'shared');
  });

  it('migrates from legacy remember session when canonical key is missing', () => {
    const storage = new MockStorage();
    storage.setItem(LEGACY_REMEMBER_SESSION_KEY, 'true');
    assert.equal(resolveDeviceMode(storage), 'personal');
  });

  it('migrates from legacy shared device when canonical key is missing', () => {
    const storage = new MockStorage();
    storage.setItem(LEGACY_SHARED_DEVICE_KEY, 'true');
    assert.equal(resolveDeviceMode(storage), 'shared');
  });

  it('falls back to shared when legacy keys conflict (both true)', () => {
    const storage = new MockStorage();
    storage.setItem(LEGACY_REMEMBER_SESSION_KEY, 'true');
    storage.setItem(LEGACY_SHARED_DEVICE_KEY, 'true');
    assert.equal(resolveDeviceMode(storage), 'shared');
  });

  it('falls back to shared when canonical key has invalid value', () => {
    const storage = new MockStorage();
    storage.setItem(DEVICE_MODE_STORAGE_KEY, 'corrupted_value');
    assert.equal(resolveDeviceMode(storage), 'shared');
  });

  it('safely falls back to shared when storage throws an exception', () => {
    const throwingStorage: StorageLike = {
      getItem() {
        throw new Error('Access denied');
      },
      setItem() {},
    };
    assert.equal(resolveDeviceMode(throwingStorage), 'shared');
  });

  it('persists canonical and syncs legacy keys for shared mode', () => {
    const storage = new MockStorage();
    persistDeviceMode(storage, 'shared');
    assert.equal(storage.getItem(DEVICE_MODE_STORAGE_KEY), 'shared');
    assert.equal(storage.getItem(LEGACY_SHARED_DEVICE_KEY), 'true');
    assert.equal(storage.getItem(LEGACY_REMEMBER_SESSION_KEY), 'false');
  });

  it('persists canonical and syncs legacy keys for personal mode', () => {
    const storage = new MockStorage();
    persistDeviceMode(storage, 'personal');
    assert.equal(storage.getItem(DEVICE_MODE_STORAGE_KEY), 'personal');
    assert.equal(storage.getItem(LEGACY_SHARED_DEVICE_KEY), 'false');
    assert.equal(storage.getItem(LEGACY_REMEMBER_SESSION_KEY), 'true');
  });

  it('safely handles setItem throwing an exception without throwing error', () => {
    const throwingStorage: StorageLike = {
      getItem() {
        return null;
      },
      setItem() {
        throw new Error('QuotaExceededError');
      },
    };
    assert.doesNotThrow(() => {
      persistDeviceMode(throwingStorage, 'personal');
    });
  });
});
