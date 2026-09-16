import type { DutyScheduleEntry, DutyScheduleStatus } from './duty-schedule.model';

export type DutySwapRequestType = 'SWAP' | 'COVER';
export type DutySwapRequestStatus =
  | 'PENDING_TARGET'
  | 'PENDING_MANAGER'
  | 'APPROVED'
  | 'REJECTED_TARGET'
  | 'REJECTED_MANAGER'
  | 'CANCELLED'
  | 'EXPIRED';

export interface DutyShiftSnapshot {
  date: string;
  staffIds: string[];
  unresolvedAssignees: string[];
  needsVerification: boolean;
  sourceAssignees: string;
  startTime: string;
  status: DutyScheduleStatus;
  note: string;
  source: 'manual' | 'import' | 'batch';
}

export interface DutySwapRequest {
  id: string;
  type: DutySwapRequestType;
  status: DutySwapRequestStatus;
  requesterUid: string;
  requesterStaffId: string;
  requesterName: string;
  targetUid: string;
  targetStaffId: string;
  targetName: string;
  participantUids: string[];
  sourceDate: string;
  targetDate: string;
  reason: string;
  sourceSnapshot: DutyShiftSnapshot;
  targetSnapshot: DutyShiftSnapshot | null;
  expiresAt: unknown;
  createdAt: unknown;
  createdByUid: string;
  updatedAt: unknown;
  updatedByUid: string;
  targetRespondedAt: unknown | null;
  targetResponseByUid: string;
  managerReviewedAt: unknown | null;
  managerUid: string;
  decisionNote: string;
}

export interface DutySwapAuditEntry {
  requestId: string;
  action: 'CREATED' | 'TARGET_ACCEPTED' | 'TARGET_REJECTED' | 'MANAGER_APPROVED' | 'MANAGER_REJECTED' | 'CANCELLED' | 'EXPIRED';
  actorUid: string;
  actorName: string;
  fromStatus: DutySwapRequestStatus | '';
  toStatus: DutySwapRequestStatus;
  details: string;
  createdAt: unknown;
}

export interface DutySwapRequestDraft {
  type: DutySwapRequestType;
  sourceDate: string;
  targetStaffId: string;
  targetDate?: string;
  reason: string;
}

export type DutyScheduleForSwap = Pick<
  DutyScheduleEntry,
  'date' | 'staffIds' | 'unresolvedAssignees' | 'needsVerification' | 'sourceAssignees' | 'startTime' | 'status' | 'note' | 'source'
>;
