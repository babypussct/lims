/**
 * Status values that represent a standard available to operational screens.
 *
 * Historical/admin flows must deliberately omit this constraint when they
 * need to inspect, restore, audit, or reconcile soft-deleted standards.
 */
export const ACTIVE_STANDARD_STATUSES = [
  'AVAILABLE',
  'IN_USE',
  'DEPLETED',
  'ACTIVE'
] as const;

export type ActiveStandardStatus = typeof ACTIVE_STANDARD_STATUSES[number];

export function isActiveStandardStatus(value: unknown): value is ActiveStandardStatus {
  return typeof value === 'string'
    && (ACTIVE_STANDARD_STATUSES as readonly string[]).includes(value);
}
