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
  uniqueTargetNames: string[];
  targetAssignments: number;
}

export interface DailyPrintTargetSetGroup {
  signature: string;
  requestId: string;
  status: ApprovedBatchStatus;
  sopVersion?: number;
  sopRef?: string;
  targetIds: string[];
  targetNames: string[];
  sampleIds: string[];
  formattedSamples: string;
}

export interface DailyPrintSopGroup {
  sopId: string;
  sopName: string;
  groups: DailyPrintTargetSetGroup[];
  uniqueSamples: number;
  uniqueTargets: number;
}
