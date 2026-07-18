
import { AnalysisResultDraft } from './analysis-result.model';
import { SampleDescriptionMap } from './sample-description.model';

export type TargetScopeKind = 'sop-all' | 'target-group' | 'manual' | 'unassigned' | 'ambiguous';
export type TargetScopeTraceability = 'snapshot' | 'legacy-derived' | 'current-config';

/** Immutable explanation of where one distinct assigned-target set came from. */
export interface TargetScopeSnapshot {
  signature: string;
  kind: TargetScopeKind;
  assignedTargetIds: string[];
  sourceId?: string;
  sourceName?: string;
  sourceRevision?: string;
  sourceTargetIds?: string[];
  sopId: string;
  sopVersion?: number;
  capturedAt?: string;
  traceability: TargetScopeTraceability;
}

export interface RequestItem {
  name: string; // ID of the item
  displayName?: string; // Human readable name (Denormalized)
  amount: number;
  displayAmount: number;
  baseAmount?: number; // Theoretical amount without margin (in stock unit)
  unit: string;
  stockUnit: string;
}


export interface Request {
  id: string;
  sopId: string;
  sopName: string;
  items: RequestItem[];
  status: 'pending' | 'approved' | 'rejected' | 'draft' | 'completed';
  timestamp: any;
  lastUpdated?: any;
  approvedAt?: any;
  rejectedAt?: any;
  user?: string;
  inputs?: any;
  margin?: number;
  analysisDate?: string;
  
  // New Feature: Sample & Target Tracking
  sampleList?: string[]; // List of Sample IDs
  targetIds?: string[];  // List of Selected Target IDs
  sampleTargetMap?: Record<string, string[]>; // Maps sample ID -> assigned Target IDs
  sampleDescriptionMap?: SampleDescriptionMap; // Optional immutable description snapshot per sample ID
  targetNames?: Record<string, string>; // Immutable target-name snapshot for traceability
  targetScopeSnapshots?: TargetScopeSnapshot[]; // Immutable scope/source snapshot per distinct target set
  sopVersion?: number;
  sopRef?: string;

  
  // Legacy: Embed Analysis Result directly in Request (pre-Document-Splitting)
  analysisResult?: AnalysisResultDraft;

  // Post-Document-Splitting: lightweight summary stored on metadata doc
  analysisResultSummary?: {
    version?: number;
    status?: 'draft' | 'completed';
    pdfUrl?: string;
    pdfViewUrl?: string;
    docsUrl?: string;
    reports?: Record<string, any>;
    updatedAt?: string;
    updatedBy?: string;
  };

  // Virtual Master Run details (Option C merging)
  isVirtualMaster?: boolean;
  childRequestIds?: string[];
  parentMasterId?: string;

  // Locking mechanism fields
  lockedBy?: string;
  lockedByName?: string;
  lockedAt?: any;
  lastActiveAt?: any;
}
