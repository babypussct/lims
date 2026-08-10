/** Keep notification filter badges compact on narrow screens. */
export const NOTIFICATION_FILTER_COUNT_CAP = 99;

export function formatNotificationFilterCount(count: number): string {
  if (!Number.isFinite(count) || count <= 0) return '0';

  const normalized = Math.floor(count);
  return normalized > NOTIFICATION_FILTER_COUNT_CAP
    ? `${NOTIFICATION_FILTER_COUNT_CAP}+`
    : String(normalized);
}
