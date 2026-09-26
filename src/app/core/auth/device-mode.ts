export type DeviceMode = 'shared' | 'personal';
export type FirestoreCacheMode = 'memory';

export const DEVICE_MODE_STORAGE_KEY = 'lims_device_mode';
export const LEGACY_SHARED_DEVICE_KEY = 'lims_shared_device';
export const LEGACY_REMEMBER_SESSION_KEY = 'lims_remember_session';

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

/**
 * Firestore documents may contain cross-user laboratory data, so the browser
 * cache is always memory-only. Device mode still controls Firebase Auth
 * persistence independently.
 */
export function resolveFirestoreCacheMode(_deviceMode: DeviceMode): FirestoreCacheMode {
  return 'memory';
}

/**
 * Phân giải chế độ thiết bị từ bộ nhớ với cơ chế 4 tầng fail-safe:
 * 1. Khóa chuẩn `lims_device_mode` hợp lệ ('shared' hoặc 'personal')
 * 2. Khóa cũ `lims_remember_session === 'true'` -> 'personal'
 * 3. Khóa cũ `lims_shared_device === 'true'` -> 'shared'
 * 4. Thiếu dữ liệu, sai định dạng, xung đột hoặc lỗi bộ nhớ -> 'shared' (Mặc định an toàn cho Lab)
 */
export function resolveDeviceMode(storage: StorageLike | null | undefined): DeviceMode {
  if (!storage) {
    return 'shared';
  }

  try {
    const canonical = storage.getItem(DEVICE_MODE_STORAGE_KEY);
    if (canonical === 'personal' || canonical === 'shared') {
      return canonical;
    }

    const legacyRemember = storage.getItem(LEGACY_REMEMBER_SESSION_KEY) === 'true';
    const legacyShared = storage.getItem(LEGACY_SHARED_DEVICE_KEY) === 'true';

    // Xung đột cả hai cùng true -> fail-safe về shared
    if (legacyRemember && legacyShared) {
      return 'shared';
    }

    if (legacyRemember) {
      return 'personal';
    }

    if (legacyShared) {
      return 'shared';
    }

    return 'shared';
  } catch (e) {
    console.warn('[DeviceMode] Failed to read from storage, fallback to shared mode:', e);
    return 'shared';
  }
}

/**
 * Lưu trữ chế độ thiết bị vào khóa chuẩn và đồng bộ hai khóa tương thích ngược.
 * Được bọc an toàn tránh crash khi bộ nhớ bị chặn (Private Browsing / QuotaExceeded).
 */
export function persistDeviceMode(storage: StorageLike | null | undefined, mode: DeviceMode): void {
  if (!storage) {
    return;
  }

  try {
    storage.setItem(DEVICE_MODE_STORAGE_KEY, mode);
    storage.setItem(LEGACY_SHARED_DEVICE_KEY, mode === 'shared' ? 'true' : 'false');
    storage.setItem(LEGACY_REMEMBER_SESSION_KEY, mode === 'personal' ? 'true' : 'false');
  } catch (e) {
    console.warn('[DeviceMode] Failed to persist device mode to storage:', e);
  }
}
