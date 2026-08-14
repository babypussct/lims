export const SERVICE_WORKER_RECOVERY_RELOAD_KEY_PREFIX = 'lims_sw_recovery_reload';

type RecoveryStorage = Pick<Storage, 'getItem' | 'setItem'>;

/**
 * Claims the single automatic recovery reload allowed for one app version.
 * sessionStorage survives a page reload but is isolated per browser tab, so it
 * breaks an unrecoverable -> reload -> unrecoverable loop without disabling
 * automatic recovery for future application versions.
 */
export function claimServiceWorkerRecoveryReload(
  storage: RecoveryStorage,
  appVersion: string | null | undefined
): boolean {
  const normalizedVersion = appVersion?.trim() || 'unknown';
  const key = `${SERVICE_WORKER_RECOVERY_RELOAD_KEY_PREFIX}:${normalizedVersion}`;

  if (storage.getItem(key) === '1') return false;

  storage.setItem(key, '1');
  return true;
}
