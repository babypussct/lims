import { Request } from '../../core/models/request.model';

export type ApprovedBatchStatus = Extract<Request['status'], 'approved' | 'draft' | 'completed'>;
export type DailyOverviewMode = 'samples' | 'batches';

export interface ApprovedBatchSample {
  sampleId: string;
  targetIds: string[];
  targetNames: string[];
}

export interface ApprovedBatchOverview {
  requestId: string;
  sopId: string;
  sopName: string;
  status: ApprovedBatchStatus;
  analysisDate: string;
  approvedAt?: Date;
  ownerName?: string;
  samples: ApprovedBatchSample[];
  uniqueTargetNames: string[];
  targetAssignments: number;
}

export interface SampleBatchReference {
  requestId: string;
  sopId: string;
  sopName: string;
  status: ApprovedBatchStatus;
  targetIds: string[];
  targetNames: string[];
}

export interface DailySampleOverview {
  sampleId: string;
  batches: SampleBatchReference[];
  sopNames: string[];
  targetNames: string[];
  targetAssignments: number;
}

export interface DailyApprovedSummary {
  batches: number;
  uniqueSamples: number;
  sampleOccurrences: number;
  sops: number;
  targetAssignments: number;
  statuses: Record<ApprovedBatchStatus, number>;
}
