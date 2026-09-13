import { Sop, SopTarget, CalculatedItem } from '../../core/models/sop.model';
import { Recipe } from '../../core/models/recipe.model';
import { InventoryItem } from '../../core/models/inventory.model';
import { SafetyConfig } from '../../core/models/config.model';
import { SampleDescriptionMap, SampleDescriptionSnapshot } from '../../core/models/sample-description.model';
import { CalculatorService } from '../../core/services/calculator.service';

export interface TargetMasterInfo {
  id: string;
  name: string;
  uniqueKey?: string;
  matrixTags?: string[];
}

export interface PlanningInputBlock {
  id: string | number;
  name: string;
  samples: string[];
  selectedTargets: Set<string>;
  matrixType?: string;
  sourceGroupId?: string;
  forcedSopId?: string;
  forcedSopAssignments?: Record<string, string>;
  sampleDescriptionMap?: SampleDescriptionMap;
  analysisDate?: string;
}

export interface JobBlock {
  id: number;
  name: string;
  rawSamples: string;
  selectedTargets: Set<string>;
  targetSearch: string;
  isCollapsed: boolean;
  forcedSopId?: string;
  matrixType?: string;
  sourceGroupId?: string;
  sourceGroupModified?: boolean;
  sampleDescriptionMap: SampleDescriptionMap;
}

export interface AnalysisTask {
  sample: string;
  targetId: string;
  targetName: string;
  covered: boolean;
  matrixType?: string;
  sourceGroupId?: string;
}

export type BatchResourceStatus = 'stock_ready' | 'stock_insufficient' | 'calculation_invalid';

export interface ProposedBatch {
  id: string;
  name: string;
  sop: Sop;
  targets: SopTarget[];
  samples: Set<string>;
  sampleCount: number;
  tasks: AnalysisTask[];
  inputValues: Record<string, any>;
  safetyMargin: number;
  resourceImpact: CalculatedItem[];
  status: 'ready' | 'missing_stock' | 'processed';
  resourceStatus?: BatchResourceStatus;
  resourceIssues?: string[];
  tags?: string[];
  isExpanded?: boolean;
  sampleDescriptionMap: SampleDescriptionMap;
}

export interface SmartBatchPlanningContext {
  sops: Sop[];
  availableTargets: TargetMasterInfo[];
  inventoryCache: Record<string, InventoryItem>;
  recipeCache: Record<string, Recipe>;
  safetyConfig: SafetyConfig;
  calculator: CalculatorService;
}

export interface SingleSampleDraft {
  sampleCode: string;
  matrixType?: string;
  sampleDescription?: SampleDescriptionSnapshot;
  selectedTargets: ReadonlySet<string>;
  forcedSopAssignments: Readonly<Record<string, string>>;
  analysisDate: string;
}

export type TargetMappingStatus = 'mapped' | 'no_sop' | 'matrix_incompatible' | 'manual_assignment_required';

export interface TargetAssignment {
  targetId: string;
  targetName: string;
  sopId: string;
  sopName: string;
  batchIndex: number;
}

export interface SopCandidateSummary {
  id: string;
  name: string;
  ref?: string;
  device?: string;
  matrixTags?: string[];
}

export interface TargetMappingIssue {
  targetId: string;
  targetName: string;
  status: Exclude<TargetMappingStatus, 'mapped'>;
  candidateSops?: SopCandidateSummary[];
  matrixType?: string;
  supportedMatrices?: string[];
}

export interface SingleSamplePreview {
  sample: SingleSampleDraft;
  proposedBatches: ProposedBatch[];
  assignments: TargetAssignment[];
  mappingIssues: TargetMappingIssue[];
  isFullyCovered: boolean;
  hasResourceIssues: boolean;
  generatedAt: number;
  draftFingerprint: string;
}
