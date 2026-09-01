export const CHUNK_RECOVERY_RELOAD_KEY = 'lims_chunk_reload';
export const CHUNK_RECOVERY_RELOAD_COOLDOWN_MS = 30_000;

type RecoveryStorage = Pick<Storage, 'getItem' | 'setItem'>;

/**
 * Claims the automatic stale-chunk recovery reload for the current cooldown
 * window. Storage failures fail closed because reloading without a durable
 * guard can trap the tab in a reload loop.
 */
export function claimChunkRecoveryReload(
  storage: RecoveryStorage,
  now: number,
  cooldownMs = CHUNK_RECOVERY_RELOAD_COOLDOWN_MS
): boolean {
  try {
    const storedValue = storage.getItem(CHUNK_RECOVERY_RELOAD_KEY);
    const lastReload = Number(storedValue || '0');
    const safeLastReload = Number.isFinite(lastReload) ? lastReload : 0;

    if (now - safeLastReload <= cooldownMs) return false;

    storage.setItem(CHUNK_RECOVERY_RELOAD_KEY, now.toString());
    return true;
  } catch {
    return false;
  }
}
