import { PurchaseRequestStatus, StandardRequestStatus } from '../../core/models/standard.model';

const STANDARD_TRANSITIONS: Record<StandardRequestStatus, readonly StandardRequestStatus[]> = {
  PENDING_APPROVAL: ['IN_PROGRESS', 'REJECTED'],
  IN_PROGRESS: ['PENDING_RETURN'],
  PENDING_RETURN: ['IN_PROGRESS', 'COMPLETED'],
  // Legacy state: old records can only move into the supported return flow.
  PENDING_DEPLETION: ['PENDING_RETURN', 'IN_PROGRESS', 'COMPLETED'],
  COMPLETED: [],
  REJECTED: []
};

const PURCHASE_TRANSITIONS: Record<PurchaseRequestStatus, readonly PurchaseRequestStatus[]> = {
  // COMPLETED is retained as an audited fast-track for the existing receive flow.
  PENDING: ['ORDERED', 'COMPLETED', 'REJECTED'],
  ORDERED: ['COMPLETED', 'REJECTED'],
  COMPLETED: [],
  REJECTED: []
};

export function normalizeLegacyStandardRequestStatus(status: StandardRequestStatus): StandardRequestStatus {
  return status === 'PENDING_DEPLETION' ? 'PENDING_RETURN' : status;
}

export function canTransitionStandardRequest(
  from: StandardRequestStatus,
  to: StandardRequestStatus
): boolean {
  if (from === to) return isActiveStandardRequestStatus(from);
  return STANDARD_TRANSITIONS[from].includes(to);
}

export function assertStandardRequestTransition(
  from: StandardRequestStatus,
  to: StandardRequestStatus
): void {
  if (!canTransitionStandardRequest(from, to)) {
    throw new Error(`Chuyển trạng thái yêu cầu không hợp lệ: ${from} → ${to}.`);
  }
}

export function isActiveStandardRequestStatus(status: StandardRequestStatus): boolean {
  return ['PENDING_APPROVAL', 'IN_PROGRESS', 'PENDING_RETURN', 'PENDING_DEPLETION'].includes(status);
}

/** Admin receive/force-return may atomically combine report + completion. */
export function canCompleteStandardReturn(status: StandardRequestStatus): boolean {
  return ['IN_PROGRESS', 'PENDING_RETURN', 'PENDING_DEPLETION'].includes(status);
}

export function canTransitionPurchaseRequest(
  from: PurchaseRequestStatus,
  to: PurchaseRequestStatus
): boolean {
  return from === to || PURCHASE_TRANSITIONS[from].includes(to);
}

export function assertPurchaseRequestTransition(
  from: PurchaseRequestStatus,
  to: PurchaseRequestStatus
): void {
  if (!canTransitionPurchaseRequest(from, to)) {
    throw new Error(`Chuyển trạng thái mua hàng không hợp lệ: ${from} → ${to}.`);
  }
}
