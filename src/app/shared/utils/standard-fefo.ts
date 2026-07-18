import { ReferenceStandard } from '../../core/models/standard.model';

const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Parse a stored standard date without treating YYYY-MM-DD as UTC.
 * Returns local midnight for date-only values and null for invalid values.
 */
export function parseStandardDate(value: string | null | undefined): number | null {
  const raw = value?.trim();
  if (!raw) return null;

  const dateOnly = DATE_ONLY_PATTERN.exec(raw);
  if (dateOnly) {
    const year = Number(dateOnly[1]);
    const month = Number(dateOnly[2]);
    const day = Number(dateOnly[3]);
    const parsed = new Date(year, month - 1, day);

    if (
      parsed.getFullYear() !== year ||
      parsed.getMonth() !== month - 1 ||
      parsed.getDate() !== day
    ) {
      return null;
    }
    return parsed.getTime();
  }

  const parsed = new Date(raw);
  const timestamp = parsed.getTime();
  return Number.isFinite(timestamp) ? timestamp : null;
}

export function startOfLocalDay(now: Date = new Date()): number {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
}

export function isStandardExpired(
  expiryDate: string | null | undefined,
  now: Date = new Date()
): boolean {
  const expiry = parseStandardDate(expiryDate);
  return expiry !== null && expiry < startOfLocalDay(now);
}

/** Normalize user-entered names so FEFO groups are stable across case/spacing/accents. */
export function normalizeStandardName(name: string | null | undefined): string {
  return (name || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/\s+/g, ' ')
    .trim()
    .toLocaleLowerCase('vi');
}

/**
 * Whether the lot can enter the borrow/dispense workflow.
 * A pending request is handled separately so existing UIs can still show
 * the "Chờ duyệt" action state.
 */
export function canAssign(std: ReferenceStandard, now: Date = new Date()): boolean {
  if (!std || std._isDeleted) return false;
  if (std.status === 'IN_USE' || std.status === 'DEPLETED' || std.status === 'DELETED') return false;
  if (std.current_holder || std.current_request_id) return false;

  const currentAmount = Number(std.current_amount);
  if (!Number.isFinite(currentAmount) || currentAmount <= 0) return false;

  if (std.expiry_date) {
    const expiry = parseStandardDate(std.expiry_date);
    if (expiry === null || expiry < startOfLocalDay(now)) return false;
  }

  return true;
}

/** A FEFO candidate must also be unreserved by another pending request. */
export function isFefoCandidate(std: ReferenceStandard, now: Date = new Date()): boolean {
  return canAssign(std, now) && !std.has_pending_request;
}

export function getFefoUnavailableReason(
  std: ReferenceStandard,
  now: Date = new Date()
): string | null {
  if (std._isDeleted) return 'Đã xóa';
  if (std.status === 'IN_USE' || std.current_holder || std.current_request_id) return 'Đang sử dụng';
  if (std.status === 'DEPLETED' || !Number.isFinite(Number(std.current_amount)) || Number(std.current_amount) <= 0) {
    return 'Đã hết';
  }
  if (std.has_pending_request) return 'Chờ duyệt';
  if (std.expiry_date && parseStandardDate(std.expiry_date) === null) return 'Hạn dùng không hợp lệ';
  if (isStandardExpired(std.expiry_date, now)) return 'Hết hạn';
  return null;
}

function amountForSort(std: ReferenceStandard): number {
  const amount = Number(std.current_amount);
  return Number.isFinite(amount) ? amount : Number.POSITIVE_INFINITY;
}

function identityForSort(std: ReferenceStandard): string {
  return std.internal_id || std.lot_number || std.id || '';
}

/**
 * FEFO order used everywhere in the standards workflow:
 * available/unreserved -> nearest valid expiry -> least remaining amount ->
 * oldest receipt date -> stable natural identifier.
 * Lots without an expiry remain usable for backward compatibility, but rank
 * after lots with a known valid expiry.
 */
export function compareStandardsByFefo(
  a: ReferenceStandard,
  b: ReferenceStandard,
  now: Date = new Date()
): number {
  const aCandidate = isFefoCandidate(a, now);
  const bCandidate = isFefoCandidate(b, now);
  if (aCandidate !== bCandidate) return aCandidate ? -1 : 1;

  const aExpiry = parseStandardDate(a.expiry_date) ?? Number.POSITIVE_INFINITY;
  const bExpiry = parseStandardDate(b.expiry_date) ?? Number.POSITIVE_INFINITY;
  if (aExpiry !== bExpiry) return aExpiry - bExpiry;

  const aAmount = amountForSort(a);
  const bAmount = amountForSort(b);
  if (aAmount !== bAmount) return aAmount < bAmount ? -1 : 1;

  const aReceived = parseStandardDate(a.received_date) ?? Number.POSITIVE_INFINITY;
  const bReceived = parseStandardDate(b.received_date) ?? Number.POSITIVE_INFINITY;
  if (aReceived !== bReceived) return aReceived - bReceived;

  return identityForSort(a).localeCompare(identityForSort(b), undefined, {
    numeric: true,
    sensitivity: 'base'
  });
}

export function sortStandardsByFefo(
  standards: readonly ReferenceStandard[],
  now: Date = new Date()
): ReferenceStandard[] {
  return [...standards].sort((a, b) => compareStandardsByFefo(a, b, now));
}

export function getSameStandardLots(
  current: ReferenceStandard,
  standards: readonly ReferenceStandard[],
  includeCurrent = true
): ReferenceStandard[] {
  const groupName = normalizeStandardName(current.name);
  if (!groupName) return [];

  return standards.filter(std =>
    !std._isDeleted &&
    (includeCurrent || std.id !== current.id) &&
    normalizeStandardName(std.name) === groupName
  );
}

export function getFefoPriorityStandard(
  current: ReferenceStandard,
  standards: readonly ReferenceStandard[],
  now: Date = new Date()
): ReferenceStandard | null {
  // The detail page loads `current` separately from the delta-sync cache.
  // Always inject the fresh current record and replace any stale cached copy;
  // otherwise a cache miss can incorrectly promote the first sibling.
  const group = [
    current,
    ...getSameStandardLots(current, standards, true).filter(std => std.id !== current.id)
  ];
  return sortStandardsByFefo(group, now).find(std => isFefoCandidate(std, now)) ?? null;
}

export function getFefoPredecessor(
  current: ReferenceStandard,
  standards: readonly ReferenceStandard[],
  now: Date = new Date()
): ReferenceStandard | null {
  if (!isFefoCandidate(current, now)) return null;
  const priority = getFefoPriorityStandard(current, standards, now);
  return priority && priority.id !== current.id ? priority : null;
}

export function isFefoPriorityStandard(
  current: ReferenceStandard,
  standards: readonly ReferenceStandard[],
  now: Date = new Date()
): boolean {
  const priority = getFefoPriorityStandard(current, standards, now);
  return !!priority && priority.id === current.id;
}
