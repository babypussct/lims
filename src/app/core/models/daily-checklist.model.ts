import { TargetScopeSnapshot } from './request.model';
import { SampleDescriptionSnapshot } from './sample-description.model';

export type DailyChecklistStatus = 'approved' | 'draft' | 'completed';

export interface DailyChecklistSample {
  sampleId: string;
  targetIds: string[];
  targetNames: string[];
  description?: SampleDescriptionSnapshot;
}

export interface DailyChecklistEntry {
  requestId: string;
  sopId: string;
  sopName: string;
  sopVersion?: number;
  sopRef?: string;
  status: DailyChecklistStatus;
  approvedAt?: unknown;
  ownerName?: string;
  samples: DailyChecklistSample[];
  fallbackTargetIds?: string[];
  targetNamesSnapshot?: Record<string, string>;
  targetScopeSnapshots?: TargetScopeSnapshot[];
}

export interface DailyChecklistDocument {
  schemaVersion: 1;
  analysisDate: string;
  updatedAt?: unknown;
  entries: Record<string, DailyChecklistEntry>;
}
