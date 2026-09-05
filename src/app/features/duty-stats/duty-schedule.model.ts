export type DutyScheduleStatus = 'planned' | 'cancelled';

export interface DutyStaff {
  id: string;
  displayName: string;
  employeeCode?: string;
  linkedUserUid?: string | null;
  active: boolean;
  note?: string;
  createdAt?: unknown;
  createdByUid?: string;
  updatedAt?: unknown;
  updatedByUid?: string;
}

export interface DutyScheduleEntry {
  id: string;
  date: string;
  staffIds: string[];
  unresolvedAssignees?: string[];
  needsVerification?: boolean;
  sourceAssignees?: string;
  startTime: string;
  status: DutyScheduleStatus;
  note?: string;
  source?: 'manual' | 'import' | 'batch';
  createdAt?: unknown;
  createdByUid?: string;
  updatedAt?: unknown;
  updatedByUid?: string;
}

export interface DutyStaffDraft {
  id?: string;
  displayName: string;
  employeeCode?: string;
  linkedUserUid?: string | null;
  active?: boolean;
  note?: string;
}

export interface DutyScheduleDraft {
  originalDate?: string;
  date: string;
  staffIds: string[];
  unresolvedAssignees?: string[];
  needsVerification?: boolean;
  sourceAssignees?: string;
  startTime?: string;
  status?: DutyScheduleStatus;
  note?: string;
  source?: 'manual' | 'import' | 'batch';
}

export interface DutyPersonStat {
  staffId: string;
  displayName: string;
  employeeCode?: string;
  linkedUserUid?: string | null;
  total: number;
  mondayCount: number;
  activeMonthCount: number;
  lastDate: string;
}

export interface DutyMonthRange {
  start: string;
  end: string;
}
