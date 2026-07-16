import { Request } from '../../core/models/request.model';

export type ApprovedBatchStatus = Extract<Request['status'], 'approved' | 'draft' | 'completed'>;

export interface ApprovedBatchSample {
  sampleId: string;
  targetIds: string[];
  targetNames: string[];
}

export interface ApprovedBatchOverview {
  requestId: string;
  sopId: string;
  sopName: string;
  sopVersion?: number;
  sopRef?: string;
  status: ApprovedBatchStatus;
  analysisDate: string;
  approvedAt?: Date;
  ownerName?: string;
  samples: ApprovedBatchSample[];
  uniqueTargetIds: string[];
  uniqueTargetNames: string[];
  targetAssignments: number;
}

export interface DailyBatchAssignmentGroup {
  signature: string;
  targetIds: string[];
  targetNames: string[];
  sampleIds: string[];
  formattedSamples: string;
}

export interface DailyBatchView {
  requestId: string;
  sopId: string;
  sopName: string;
  sopVersion?: number;
  sopRef?: string;
  status: ApprovedBatchStatus;
  analysisDate: string;
  approvedAt?: Date;
  ownerName?: string;
  groups: DailyBatchAssignmentGroup[];
  uniqueSamples: number;
  uniqueTargets: number;
  targetAssignments: number;
}

export type DailyPrintOrientation = 'portrait' | 'landscape';
export type DailyPrintOrientationPreference = 'auto' | DailyPrintOrientation;
export type DailyPrintMode = 'compact' | 'list';
export type DailyPrintModePreference = 'auto' | DailyPrintMode;

export interface DailyPrintLayoutCandidate {
  mode: DailyPrintMode;
  orientation: DailyPrintOrientation;
  estimatedPages: number;
  estimatedBatchSplits: number;
  wrappedLineCount: number;
  score: number;
}

export interface DailyPrintLayoutPlan extends DailyPrintLayoutCandidate {
  reason: string;
}
