export interface AppBadgeTarget {
  setAppBadge?: (count?: number) => Promise<void> | void;
  clearAppBadge?: () => Promise<void> | void;
}

/**
 * Synchronize the installed-app badge without assuming both Badging API
 * methods are present. Some browser shells expose only `setAppBadge`; passing
 * zero is the spec-compatible clear fallback in that case.
 *
 * Promise failures are intentionally allowed to reject so the caller can log
 * one bounded diagnostic instead of creating an unhandled rejection.
 */
export async function syncAppBadge(target: AppBadgeTarget | null | undefined, count: number): Promise<void> {
  if (!target) return;

  const normalizedCount = Math.max(0, Math.floor(Number(count) || 0));
  if (normalizedCount > 0) {
    if (typeof target.setAppBadge !== 'function') return;
    await target.setAppBadge(normalizedCount);
    return;
  }

  if (typeof target.clearAppBadge === 'function') {
    await target.clearAppBadge();
    return;
  }

  if (typeof target.setAppBadge === 'function') {
    await target.setAppBadge(0);
  }
}
