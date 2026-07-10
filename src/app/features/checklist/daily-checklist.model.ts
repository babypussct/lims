import { Request } from '../../core/models/request.model';

export type ChecklistRequestStatus = Request['status'];
export type ChecklistCheckFilter = 'all' | 'checked' | 'unchecked';

export interface DailyChecklistAssignment {
  key: string;
  requestId: string;
  sopId: string;
  sopName: string;
  sampleId: string;
  targetId: string;
  targetName: string;
  status: ChecklistRequestStatus;
  analysisDate?: string;
  daySuffix: string;
  isLegacyDate: boolean;
  hasDayMismatch: boolean;
}

export interface DailyCheckEntry {
  id: string;
  requestId: string;
  sopId: string;
  sampleId: string;
  targetId: string;
  analysisDate?: string;
  daySuffix: string;
  checked: boolean;
  checkedAt?: unknown;
  checkedBy?: string;
  checkedByName?: string;
  updatedAt?: unknown;
  updatedBy?: string;
  updatedByName?: string;
}

export interface ChecklistSample extends DailyChecklistAssignment {
  checked: boolean;
}

export interface ChecklistTargetGroup {
  targetId: string;
  targetName: string;
  samples: ChecklistSample[];
}

export interface ChecklistSopGroup {
  sopId: string;
  sopName: string;
  targets: ChecklistTargetGroup[];
  collapsed: boolean;
}

export interface DailyChecklistSummary {
  uniqueSamples: number;
  assignments: number;
  checkedAssignments: number;
  batches: number;
  legacyAssignments: number;
  dayMismatches: number;
  statuses: Record<ChecklistRequestStatus, number>;
}
