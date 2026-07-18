import { Request, TargetScopeSnapshot } from '../../core/models/request.model';
import { SampleDescriptionSnapshot } from '../../core/models/sample-description.model';
import { TargetScopePresentation } from '../targets/target-scope-classifier';

export type ApprovedBatchStatus = Extract<Request['status'], 'approved' | 'draft' | 'completed'>;

export interface ApprovedBatchSample {
  sampleId: string;
  targetIds: string[];
  targetNames: string[];
  description?: SampleDescriptionSnapshot;
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
  targetNamesSnapshot?: Record<string, string>;
  targetScopeSnapshots?: TargetScopeSnapshot[];
}

export interface DailyBatchAssignmentGroup {
  signature: string;
  targetIds: string[];
  targetNames: string[];
  sampleIds: string[];
  formattedSamples: string;
  samples: DailySampleView[];
  formattedDescriptions: string;
  hasDescriptionConflict: boolean;
  targetScope: TargetScopePresentation;
}

export interface DailySampleView {
  sampleId: string;
  description?: SampleDescriptionSnapshot;
  descriptionAlternatives?: string[];
  sourceRequestIds: string[];
}

export interface DailyPhysicalBatchRef {
  requestId: string;
  status: ApprovedBatchStatus;
  approvedAt?: Date;
  ownerName?: string;
  sampleIds: string[];
  formattedSamples: string;
}

export interface DailyBatchView {
  cardKey: string;
  sopId: string;
  sopName: string;
  sopVersion?: number;
  sopRef?: string;
  analysisDate: string;
  approvedAt?: Date;
  ownerName?: string;
  groups: DailyBatchAssignmentGroup[];
  sourceBatches: DailyPhysicalBatchRef[];
  physicalBatchCount: number;
  statusCounts: Record<ApprovedBatchStatus, number>;
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
