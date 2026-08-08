
import { ChangeDetectionStrategy, Component, inject, signal, computed, effect } from '@angular/core';
import { Router } from '@angular/router';
import { getCanonicalId, normalizeSampleCode, resolveTargetMasterInfo } from '../results/shared/compound-id-resolver';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '../../core/services/state.service';
import { AuthService } from '../../core/services/auth.service';
import { CalculatorService } from '../../core/services/calculator.service';
import { RecipeService } from '../recipes/recipe.service';
import { TargetService } from '../targets/target.service'; 
import { InventoryService } from '../inventory/inventory.service';
import { Sop, SopTarget, CalculatedItem, TargetGroup, MatrixType, MasterDevice } from '../../core/models/sop.model';
import { MatrixTypeService } from '../config/matrix-type.service';
import { MasterDeviceService } from '../config/master-device.service';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { formatNum, generateSlug, formatSampleList } from '../../shared/utils/utils';
import { InventoryItem } from '../../core/models/inventory.model';
import { Recipe } from '../../core/models/recipe.model';
import { GHS_DICTIONARY } from '../../core/services/pubchem.service';
import { computeTargetSignature } from '../targets/target-scope-classifier';
import {
  SampleDescriptionMap,
  SampleDescriptionMaster,
  SampleDescriptionSnapshot
} from '../../core/models/sample-description.model';
import { SampleDescriptionMasterService } from '../config/sample-description-master.service';
import {
  formatSampleDescriptions,
  getSampleDescriptionSnapshot,
  setSampleDescriptionSnapshot,
  subsetSampleDescriptionMap
} from '../../shared/utils/sample-description.utils';
import {
  applyNeedsToStockLedger,
  BatchPlanValidationIssue,
  buildAnalysisTaskKey,
  countUnavailableStockItems,
  getSopTargetKey,
  isSopMatrixCompatible,
  parseUniqueSampleCodes,
  validateCalculatedItems
} from './smart-batch.utils';

// --- DATA MODELS ---

interface JobBlock {
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

interface AnalysisTask {
    sample: string;
    targetId: string;
    targetName: string;
    covered: boolean;
    matrixType?: string;
    sourceGroupId?: string;
}

interface ProposedBatch {
    id: string; 
    name: string; 
    sop: Sop;
    targets: SopTarget[]; 
    samples: Set<string>; 
    sampleCount: number;
    tasks: AnalysisTask[]; // TRACKING TASKS (Task-Based Logic)
    inputValues: Record<string, any>; 
    safetyMargin: number;
    resourceImpact: CalculatedItem[];
    status: 'ready' | 'missing_stock' | 'processed';
    tags?: string[]; 
    isExpanded?: boolean; 
    sampleDescriptionMap: SampleDescriptionMap;
}

export interface SopSuggestion {
    sop: Sop;
    coverageCount: number;
    totalRequired: number;
    coverageRatio: number;
    coveredTargets: {id: string, name: string}[];
    missingTargets: {id: string, name: string}[];
    extraTargets: {id: string, name: string}[];
    isMissingStock: boolean;
    isBest: boolean;
    isPartial: boolean;
}

// Wizard State for Split Modal
interface SplitWizardState {
    step: 1 | 2 | 3;
    sourceBatchIndex: number;
    sourceBatchName: string;
    availableSamples: string[]; // From Source
    selectedSamples: Set<string>; // Step 1 Output
    
    availableTargets: SopTarget[]; // From Source (What source was doing)
    selectedTargets: Set<string>; // Step 2 Output (What we want new batch to do)
    
    selectedSopId: string | null; // Step 3 Output
}

// --- FIX COVERAGE STATE ---

interface DiagGroup1Item {
  targetId: string;
  targetName: string;
  affectedSamples: string[];          
  blockId: number;                     
  candidateSops: Sop[];               
  chosenSopId: string | null;          
}

interface DiagGroup2Item {
  targetId: string;
  targetName: string;
  affectedSamples: string[];
  blockId: number;
  currentMatrix: string | undefined;   
  compatibleSops: { sop: Sop; matrices: string[] }[]; 
  action: 'remove' | 'ignore_matrix';
}

interface DiagGroup3Item {
  targetId: string;
  targetName: string;
  affectedSamples: string[];
  blockId: number;
  action: 'remove' | 'keep_unmapped';
}

interface FixCoverageState {
  isOpen: boolean;
  isProcessing: boolean;
  group1: DiagGroup1Item[];  
  group2: DiagGroup2Item[];  
  group3: DiagGroup3Item[];  
}

import { QuickGenerateSampleModalComponent } from '../../shared/components/quick-generate-sample-modal/quick-generate-sample-modal.component';
import { BatchSplitWizardComponent } from './components/batch-split-wizard.component';

@Component({
  selector: 'app-smart-batch',
  standalone: true,
  imports: [CommonModule, FormsModule, QuickGenerateSampleModalComponent, BatchSplitWizardComponent],
  templateUrl: './smart-batch.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SmartBatchComponent {
  state = inject(StateService);
  auth = inject(AuthService);
  router = inject(Router);
  calculator = inject(CalculatorService);
  recipeService = inject(RecipeService);
  targetService = inject(TargetService); 
  invService = inject(InventoryService);
  toast = inject(ToastService);
  confirmation = inject(ConfirmationService);
  matrixTypeService = inject(MatrixTypeService);
  masterDeviceService = inject(MasterDeviceService);
  sampleDescriptionMasterService = inject(SampleDescriptionMasterService);
  formatNum = formatNum;
  formatSampleList = formatSampleList;

  get GHS_DICT() { return GHS_DICTIONARY; }
  step = signal<number>(0);
  smartBatchMode = signal<'multiple' | 'single'>('multiple');

  // Single mode state
  singleSampleCode = signal<string>('');
  singleSelectedTargets = signal<Set<string>>(new Set());
  singleSourceGroupId = signal<string | null>(null);
  singleMatrixType = signal<string | undefined>(undefined);
  singleTargetSearch = signal<string>('');
  singleForcedSopId = signal<string | undefined>(undefined);
  singleSampleDescription = signal<SampleDescriptionSnapshot | undefined>(undefined);

  blocks = signal<JobBlock[]>([this.createEmptyBlock()]);
  batches = signal<ProposedBatch[]>([]);
  unmappedTasks = signal<AnalysisTask[]>([]);
  excludedTaskKeys = signal<Set<string>>(new Set());
  isProcessing = signal(false);
  isEditingName = signal<number | null>(null);
  availableMatrices = signal<MatrixType[]>([]);
  availableDevices = signal<MasterDevice[]>([]);
  availableSampleDescriptions = signal<SampleDescriptionMaster[]>([]);
  matrixById = computed(() => new Map(this.availableMatrices().map(matrix => [matrix.id, matrix])));
  private blockSamplesCache = new Map<number, { rawSamples: string; samples: string[] }>();
  private blockDescriptionCountCache = new Map<number, {
      rawSamples: string;
      sampleDescriptionMap: SampleDescriptionMap;
      count: number;
  }>();

  constructor() {
      effect(() => {
          const activeIds = new Set(this.activeSops().map(s => s.id));
          
          if (this.singleForcedSopId() && !activeIds.has(this.singleForcedSopId()!)) {
              this.singleForcedSopId.set(undefined);
          }
          
          let changed = false;
          const updatedBlocks = this.blocks().map(b => {
              if (b.forcedSopId && !activeIds.has(b.forcedSopId)) {
                  changed = true;
                  return { ...b, forcedSopId: undefined };
              }
              return b;
          });
          
          if (changed) {
              this.blocks.set(updatedBlocks);
          }
      });
  }
  
  // Quick Generate Modal State
  quickGenerateModalOpen = signal(false);
  activeBlockIndexForGenerate = signal<number | null>(null);
  
  private inventoryCache: Record<string, InventoryItem> = {};
  private recipeCache: Record<string, Recipe> = {};
  private setupDataLoadPromise?: Promise<void>;
  
  sampleSearchTerm = signal('');
  
  // --- SPLIT WIZARD STATE ---
  showSplitModal = signal(false);
  splitState = signal<SplitWizardState>({ 
      step: 1,
      sourceBatchIndex: -1,
      sourceBatchName: '',
      availableSamples: [],
      selectedSamples: new Set(),
      availableTargets: [],
      selectedTargets: new Set(),
      selectedSopId: null
  });

  showGroupModal = signal(false);
  availableGroups = signal<TargetGroup[]>([]);
  currentBlockIndexForGroupImport = signal<number>(-1);

  // --- PREVIEW PANEL STATE ---
  previewSop = signal<{blockIndex: number, suggestion: SopSuggestion} | null>(null);

  // --- QUICK IMPORT STATE ---
  showQuickImport = signal(false);
  quickImportState = signal<{id: string, name: string, unit: string, currentStock: number, missingAmount: number}>({
      id: '', name: '', unit: '', currentStock: 0, missingAmount: 0
  });
  quickImportInput = 0;

  // --- FIX COVERAGE MODAL STATE ---
  fixCoverageState = signal<FixCoverageState>({
    isOpen: false,
    isProcessing: false,
    group1: [],
    group2: [],
    group3: []
  });

  // --- COMPUTED: GENERAL ---
  activeSops = computed(() => this.state.sops().filter(s => !s.isArchived));
  allAvailableTargets = computed(() => {
    const targets = new Map<string, {id: string, name: string, uniqueKey: string}>();
    this.activeSops().forEach(sop => {
      sop.targets?.forEach(target => {
        if (!target.name) return;
        const canonical = getCanonicalId(target.name);
        if (!targets.has(canonical)) {
          targets.set(canonical, { id: canonical, name: target.name, uniqueKey: canonical });
        }
      });
    });
    return Array.from(targets.values()).sort((a, b) => a.name.localeCompare(b.name));
  });

  // --- COMPUTED MAPS ---
  // Tránh tính lại không cần thiết mỗi change detection cycle trong @for loops
  filteredTargetsMap = computed(() => {
    const map = new Map<number, {id: string, name: string, uniqueKey: string}[]>();
    const all = this.allAvailableTargets();
    for (const block of this.blocks()) {
      const term = (block.targetSearch || '').toLowerCase().trim();
      map.set(block.id, !term ? all : all.filter(t =>
        t.name.toLowerCase().includes(term) || t.id.toLowerCase().includes(term)
      ));
    }
    return map;
  });

  singleFilteredTargets = computed(() => {
    const term = this.singleTargetSearch().toLowerCase().trim();
    const all = this.allAvailableTargets();
    if (!term) return all;
    return all.filter(t => t.name.toLowerCase().includes(term) || t.id.toLowerCase().includes(term));
  });

  private buildSopSuggestion(
    sop: Sop,
    reqTargetIds: string[],
    allTargets: {uniqueKey: string, name: string}[],
    inventory: Record<string, any>,
    matrixType?: string
  ): SopSuggestion | null {
    if (!sop.targets || sop.targets.length === 0) return null;
    
    // Matrix Filter
    const sopMatrices = sop.matrixTags || [];
    if (sopMatrices.length > 0 && matrixType && !sopMatrices.includes(matrixType)) {
        return null; // doesn't match matrix
    }

    const sopTargetIds = new Set(sop.targets.map(t => getCanonicalId(t.name)));
    const covered: {id: string, name: string}[] = [];
    const missing: {id: string, name: string}[] = [];
    
    reqTargetIds.forEach(reqId => {
        const foundName = allTargets.find(t => t.uniqueKey === reqId)?.name || reqId;
        if (sopTargetIds.has(reqId)) {
            covered.push({id: reqId, name: foundName});
        } else {
            missing.push({id: reqId, name: foundName});
        }
    });

    if (covered.length === 0) return null; // No overlap

    const extra: {id: string, name: string}[] = [];
    sop.targets.forEach(t => {
        const id = getCanonicalId(t.name);
        if (!reqTargetIds.includes(id)) {
            extra.push({id, name: t.name});
        }
    });

    // Check stock
    let isMissingStock = false;
    if (sop.consumables) {
        for (const c of sop.consumables) {
            if (c.type === 'simple') {
                const stockItem = inventory[c.name];
                if (!stockItem || stockItem.stock <= 0) {
                    isMissingStock = true;
                    break;
                }
            }
        }
    }

    const ratio = covered.length / sop.targets.length; // high ratio means less waste

    return {
        sop,
        coverageCount: covered.length,
        totalRequired: reqTargetIds.length,
        coverageRatio: ratio,
        coveredTargets: covered,
        missingTargets: missing,
        extraTargets: extra,
        isMissingStock,
        isBest: false,
        isPartial: missing.length > 0
    };
  }

  sopSuggestionsMap = computed(() => {
    const map = new Map<number, SopSuggestion[]>();
    const activeNormal = this.activeSops().filter(s => !s.isManualOnly);
    const inventory = this.state.inventoryMap();
    const allTargets = this.allAvailableTargets(); // Extracted from loop

    for (const block of this.blocks()) {
      if (block.selectedTargets.size === 0) { map.set(block.id, []); continue; }
      
      const reqTargetIds = Array.from(block.selectedTargets);
      
      const candidates: SopSuggestion[] = [];

      for (const sop of activeNormal) {
          const sug = this.buildSopSuggestion(sop, reqTargetIds, allTargets, inventory, block.matrixType);
          if (sug) candidates.push(sug);
      }

      // We have all candidates.
      // Filter logic: if there are 100% matches (missing.length === 0), only show them.
      // If no 100% matches, show top 5 partial matches.
      const fullMatches = candidates.filter(c => !c.isPartial);
      let results: SopSuggestion[] = [];

      if (fullMatches.length > 0) {
          results = fullMatches.sort((a, b) => b.coverageRatio - a.coverageRatio);
      } else {
          results = candidates.sort((a, b) => b.coverageCount - a.coverageCount || b.coverageRatio - a.coverageRatio).slice(0, 5);
      }

      if (results.length > 0) {
          results[0].isBest = true; // Best overall based on sort order
      }

      // Inject forced SOP if needed
      if (block.forcedSopId) {
          const alreadyInResults = results.some(r => r.sop.id === block.forcedSopId);
          if (!alreadyInResults) {
              const forcedSop = this.activeSops().find(s => s.id === block.forcedSopId);
              if (forcedSop) {
                  const forcedSug = this.buildSopSuggestion(forcedSop, reqTargetIds, allTargets, inventory, block.matrixType);
                  if (forcedSug) {
                      results = [forcedSug, ...results];
                  }
              }
          }
      }

      map.set(block.id, results);
    }
    return map;
  });

  eligibleManualSopsMap = computed(() => {
    const map = new Map<number, SopSuggestion[]>();
    const manualSops = this.activeSops().filter(s => s.isManualOnly);
    const inventory = this.state.inventoryMap();
    const allTargets = this.allAvailableTargets(); // Extracted from loop

    for (const block of this.blocks()) {
      if (block.selectedTargets.size === 0) { map.set(block.id, []); continue; }
      
      const reqTargetIds = Array.from(block.selectedTargets);
      
      const eligibles: SopSuggestion[] = [];
      for (const sop of manualSops) {
          const sug = this.buildSopSuggestion(sop, reqTargetIds, allTargets, inventory, block.matrixType);
          if (sug) eligibles.push(sug);
      }
      map.set(block.id, eligibles);
    }
    return map;
  });

  singleSopSuggestions = computed(() => {
    if (this.singleSelectedTargets().size === 0) return [];
    
    const reqTargetIds = Array.from(this.singleSelectedTargets());
    const allTargets = this.allAvailableTargets();
    const activeNormal = this.activeSops().filter(s => !s.isManualOnly);
    const inventory = this.state.inventoryMap();
    const matrixType = this.singleMatrixType();
    
    const candidates: SopSuggestion[] = [];

    for (const sop of activeNormal) {
        const sug = this.buildSopSuggestion(sop, reqTargetIds, allTargets, inventory, matrixType);
        if (sug) candidates.push(sug);
    }

    const fullMatches = candidates.filter(c => !c.isPartial);
    let results: SopSuggestion[] = [];

    if (fullMatches.length > 0) {
        results = fullMatches.sort((a, b) => b.coverageRatio - a.coverageRatio);
    } else {
        results = candidates.sort((a, b) => b.coverageCount - a.coverageCount || b.coverageRatio - a.coverageRatio).slice(0, 5);
    }

    if (results.length > 0) {
        results[0].isBest = true;
    }

    // Inject forced SOP if needed
    if (this.singleForcedSopId()) {
        const forcedId = this.singleForcedSopId();
        const alreadyInResults = results.some(r => r.sop.id === forcedId);
        if (!alreadyInResults) {
            const forcedSop = this.activeSops().find(s => s.id === forcedId);
            if (forcedSop) {
                const forcedSug = this.buildSopSuggestion(forcedSop, reqTargetIds, allTargets, inventory, matrixType);
                if (forcedSug) {
                    results = [forcedSug, ...results];
                }
            }
        }
    }

    return results;
  });

  singleEligibleManualSops = computed(() => {
    if (this.singleSelectedTargets().size === 0) return [];
    
    const reqTargetIds = Array.from(this.singleSelectedTargets());
    const allTargets = this.allAvailableTargets();
    const manualSops = this.activeSops().filter(s => s.isManualOnly);
    const inventory = this.state.inventoryMap();
    const matrixType = this.singleMatrixType();
    
    const eligibles: SopSuggestion[] = [];
    for (const sop of manualSops) {
        const sug = this.buildSopSuggestion(sop, reqTargetIds, allTargets, inventory, matrixType);
        if (sug) eligibles.push(sug);
    }
    return eligibles;
  });

  totalUniqueSamples = computed(() => {
    if (this.smartBatchMode() === 'single') {
      return this.singleSampleCode().trim() ? 1 : 0;
    }
    const allSamples = new Set<string>();
    this.blocks().forEach(b => {
      this.getBlockSamples(b).forEach(sample => allSamples.add(normalizeSampleCode(sample)));
    });
    return allSamples.size;
  });

  totalUniqueTargets = computed(() => {
    if (this.smartBatchMode() === 'single') {
      return this.singleSelectedTargets().size;
    }
    const allTargets = new Set<string>();
    this.blocks().forEach(b => {
      b.selectedTargets.forEach(t => allTargets.add(t));
    });
    return allTargets.size;
  });
  
  hasCriticalMissing = computed(() => this.batches().some(b => b.status === 'missing_stock'));
  planValidationIssues = computed<BatchPlanValidationIssue[]>(() =>
    this.batches().flatMap(batch => validateCalculatedItems(batch.resourceImpact, Number(batch.safetyMargin)))
  );
  hasInvalidPlanResources = computed(() => this.planValidationIssues().length > 0);
  
  totalStockSummary = computed(() => { 
      const summary = new Map<string, any>(); 
      const ledger: Record<string, number> = {}; 
      Object.values(this.state.inventoryMap()).forEach((i: InventoryItem) => ledger[i.id] = i.stock); 
      for (const batch of this.batches()) { 
          for (const item of batch.resourceImpact) { 
              if (item.isComposite) { 
                  for (const sub of item.breakdown) { 
                      const current = ledger[sub.name] || 0; 
                      const remaining = current - sub.totalNeed; 
                      ledger[sub.name] = remaining; 
                      const invItem = this.state.inventoryMap()[sub.name];
                      if (!summary.has(sub.name)) { summary.set(sub.name, { id: sub.name, name: sub.displayName || sub.name, unit: sub.stockUnit, needed: 0, missing: 0, currentStock: current, ghsWarnings: invItem?.ghsWarnings || [] }); } 
                      summary.get(sub.name).needed += sub.totalNeed;
                  } 
              } else { 
                  const current = ledger[item.name] || 0; 
                  const remaining = current - item.stockNeed; 
                  ledger[item.name] = remaining; 
                  const invItem = this.state.inventoryMap()[item.name];
                  if (!summary.has(item.name)) { summary.set(item.name, { id: item.name, name: item.displayName || item.name, unit: item.stockUnit, needed: 0, missing: 0, currentStock: current, ghsWarnings: invItem?.ghsWarnings || [] }); } 
                  summary.get(item.name).needed += item.stockNeed;
              } 
          } 
      } 
      const result: any[] = []; 
      summary.forEach((val, key) => { 
          const finalBalance = ledger[key]; 
          if (finalBalance < 0) { 
              val.missing = Math.abs(finalBalance); 
              val.isMissing = true;
          } else {
              val.isMissing = false;
          }
          result.push(val); 
      }); 
      return result.sort((a,b) => {
          if (a.isMissing && !b.isMissing) return -1;
          if (!a.isMissing && b.isMissing) return 1;
          return a.name.localeCompare(b.name);
      }); 
  });

  aggregateGHSWarnings = computed(() => {
     const summary = this.totalStockSummary();
     const warnings = new Set<string>();
     summary.forEach(item => {
         if (item.ghsWarnings) {
             item.ghsWarnings.forEach((w: string) => warnings.add(w));
         }
     });
     return Array.from(warnings).sort();
  });

  // --- COMPUTED: COVERAGE STATUS BAR (Global Safety Net) ---
  coverageMetrics = computed(() => {
      // 1. Calculate Needs from Blocks (Input)
      const neededTasks = new Set<string>(); // "Sample|TargetID"
      const sampleNames: Record<string, string> = {}; // Helper for displaying names if sample ID is obscure (not used here but good practice)
      
      this.blocks().forEach(block => {
          const samples = this.getBlockSamples(block);
          samples.forEach(s => {
              block.selectedTargets.forEach(tId => {
                  const key = buildAnalysisTaskKey(s, tId);
                  if (!this.excludedTaskKeys().has(key)) neededTasks.add(key);
              });
          });
      });

      // 2. Calculate Coverage from Batches (Output)
      const coveredTasks = new Set<string>();
      const duplicateTasks = new Set<string>();
      let dupCount = 0;

      this.batches().forEach(batch => {
          // Use tasks directly if available (Task-Based)
           if (batch.tasks && batch.tasks.length > 0) {
               batch.tasks.forEach(t => {
                  if (!t.covered) return;
                  const key = buildAnalysisTaskKey(t.sample, t.targetId);
                  if (coveredTasks.has(key)) {
                      duplicateTasks.add(key);
                      dupCount++;
                  }
                  coveredTasks.add(key);
              });
          } else {
              // Fallback for legacy structure (should not happen with new logic)
               const targetIds = batch.targets.map(t => t.id);
               batch.samples.forEach(s => {
                   targetIds.forEach(tId => {
                      const key = buildAnalysisTaskKey(s, tId);
                      if (coveredTasks.has(key)) {
                          duplicateTasks.add(key);
                          dupCount++;
                      }
                      coveredTasks.add(key);
                  });
              });
          }
      });

      // 3. Diff
      const missingTasks: string[] = [];
      const missingSamples = new Set<string>();
      neededTasks.forEach(key => {
          if (!coveredTasks.has(key)) {
              missingTasks.push(key);
              const s = key.split('|')[0];
              missingSamples.add(s);
          }
      });

      // 4. Return Report
      return {
          isFullyCovered: missingTasks.length === 0,
          missingCount: missingTasks.length,
          duplicateCount: dupCount,
          missingSampleNames: Array.from(missingSamples).slice(0, 3).join(', ') + (missingSamples.size > 3 ? '...' : '')
      };
  });

  // --- METHODS ---

  getFullSampleString(samples: Set<string>): string {
      return Array.from(samples).sort().join(', ');
  }

  getBatchDescriptionText(batch: ProposedBatch): string {
      return formatSampleDescriptions(batch.samples, batch.sampleDescriptionMap);
  }

  getBlockSamples(block: JobBlock): string[] {
      const cached = this.blockSamplesCache.get(block.id);
      if (cached && cached.rawSamples === block.rawSamples) return cached.samples;

      const samples = parseUniqueSampleCodes(block.rawSamples);
      this.blockSamplesCache.set(block.id, { rawSamples: block.rawSamples, samples });
      return samples;
  }

  getBlockSampleDescription(block: JobBlock, sampleCode: string): string {
      return getSampleDescriptionSnapshot(block.sampleDescriptionMap, sampleCode)?.nameSnapshot || '';
  }

  getBlockDescriptionCount(block: JobBlock): number {
      const cached = this.blockDescriptionCountCache.get(block.id);
      if (
          cached
          && cached.rawSamples === block.rawSamples
          && cached.sampleDescriptionMap === block.sampleDescriptionMap
      ) {
          return cached.count;
      }

      const count = this.getBlockSamples(block)
          .filter(sample => Boolean(getSampleDescriptionSnapshot(block.sampleDescriptionMap, sample)))
          .length;
      this.blockDescriptionCountCache.set(block.id, {
          rawSamples: block.rawSamples,
          sampleDescriptionMap: block.sampleDescriptionMap,
          count
      });
      return count;
  }

  updateBlockSampleDescription(index: number, sampleCode: string, value: string): void {
      const snapshot = this.resolveDescriptionSnapshot(value);
      this.blocks.update(blocks => {
          const next = [...blocks];
          const block = next[index];
          next[index] = {
              ...block,
              sampleDescriptionMap: setSampleDescriptionSnapshot(block.sampleDescriptionMap, sampleCode, snapshot)
          };
          return next;
      });
  }

  applyDescriptionToAll(index: number, sourceSampleCode: string): void {
      this.blocks.update(blocks => {
          const next = [...blocks];
          const block = next[index];
          const snapshot = getSampleDescriptionSnapshot(block.sampleDescriptionMap, sourceSampleCode);
          let newMap = block.sampleDescriptionMap;
          
          for (const sample of this.getBlockSamples(block)) {
              if (sample !== sourceSampleCode) {
                  newMap = setSampleDescriptionSnapshot(newMap, sample, snapshot);
              }
          }
          
          next[index] = {
              ...block,
              sampleDescriptionMap: newMap
          };
          return next;
      });
  }

  updateSingleSampleDescription(value: string): void {
      this.singleSampleDescription.set(this.resolveDescriptionSnapshot(value));
  }

  singleSampleDescriptionName(): string {
      return this.singleSampleDescription()?.nameSnapshot || '';
  }

  private createEmptyBlock(name = 'Nhóm mẫu 1', matrixType?: string): JobBlock {
      return {
          id: Date.now(),
          name,
          rawSamples: '',
          selectedTargets: new Set<string>(),
          targetSearch: '',
          isCollapsed: false,
          forcedSopId: undefined,
          matrixType,
          sampleDescriptionMap: {}
      };
  }

  private resolveDescriptionSnapshot(value: string): SampleDescriptionSnapshot | undefined {
      const name = String(value || '').trim();
      if (!name) return undefined;
      const normalized = normalizeDescription(name);
      const master = this.availableSampleDescriptions().find(item =>
          normalizeDescription(item.name) === normalized
          || (item.aliases || []).some(alias => normalizeDescription(alias) === normalized)
      );
      return master
          ? { masterId: master.id, nameSnapshot: master.name }
          : { nameSnapshot: name };
  }

  private buildDescriptionMapForSamples(samples: Iterable<string>): SampleDescriptionMap {
      const result: SampleDescriptionMap = {};
      Array.from(samples).forEach(sample => {
          for (const block of this.blocks()) {
              const snapshot = getSampleDescriptionSnapshot(block.sampleDescriptionMap, sample);
              if (snapshot) {
                  result[sample] = snapshot;
                  break;
              }
          }
      });
      return result;
  }

  private findDescriptionConflict(): string | null {
      const descriptions = new Map<string, { sample: string; names: Set<string> }>();
      this.blocks().forEach(block => this.getBlockSamples(block).forEach(sample => {
          const snapshot = getSampleDescriptionSnapshot(block.sampleDescriptionMap, sample);
          if (!snapshot) return;
          const key = normalizeSampleCode(sample);
          const current = descriptions.get(key) || { sample, names: new Set<string>() };
          current.names.add(normalizeDescription(snapshot.nameSnapshot));
          descriptions.set(key, current);
      }));
      const conflict = Array.from(descriptions.values()).find(item => item.names.size > 1);
      return conflict?.sample || null;
  }

  // ... Block management helpers ...
  addBlock() {
      this.blocks.update(b => [...b, this.createEmptyBlock(`Nhóm mẫu #${b.length + 1}`)]);
  }
  removeBlock(index: number) { this.blocks.update(b => b.filter((_, i) => i !== index)); }
  duplicateBlock(index: number) {
      const src = this.blocks()[index];
      const newBlock = {
          ...src,
          id: Date.now(),
          name: src.name + ' (bản sao)',
          selectedTargets: new Set(src.selectedTargets),
          sampleDescriptionMap: { ...src.sampleDescriptionMap }
      };
      this.blocks.update(b => { const n = [...b]; n.splice(index + 1, 0, newBlock); return n; });
  }
  toggleBlockCollapse(index: number) { 
      this.blocks.update(b => { const n = [...b]; n[index] = { ...n[index], isCollapsed: !n[index].isCollapsed }; return n; }); 
  }
  updateBlockName(index: number, val: string) { this.blocks.update(b => { const n = [...b]; n[index] = { ...n[index], name: val }; return n; }); }
  updateBlockSamples(index: number, val: string) {
      this.blocks.update(blocks => {
          const next = [...blocks];
          next[index] = {
              ...next[index],
              rawSamples: val,
              sampleDescriptionMap: subsetSampleDescriptionMap(next[index].sampleDescriptionMap, val.split('\n').map(sample => sample.trim()).filter(Boolean))
          };
          return next;
      });
  }
  updateBlockSearch(index: number, val: string) { this.blocks.update(b => { const n = [...b]; n[index] = { ...n[index], targetSearch: val }; return n; }); }
  updateBlockForcedSop(index: number, sopId: string | undefined) {
      this.blocks.update(b => {
          const n = [...b]; 
          n[index] = { ...n[index], forcedSopId: sopId };
          return n;
      });
  }
  updateBlockMatrix(index: number, val: string | undefined) {
      this.blocks.update(b => {
          const n = [...b];
          n[index] = { ...n[index], matrixType: val || undefined };
          return n;
      });
  }

  getMatrixLabel(id?: string): string {
      if (!id) return '';
      return this.matrixById().get(id)?.name || id;
  }

  getMatrixColor(id?: string): string {
      if (!id) return '#94a3b8';
      return this.matrixById().get(id)?.color || '#94a3b8';
  }

  // --- PREVIEW PANEL METHODS ---
  openSopPreview(blockIndex: number, suggestion: SopSuggestion) {
      this.previewSop.set({blockIndex, suggestion});
  }

  closeSopPreview() {
      this.previewSop.set(null);
  }

   assignSopFromPreview() {
       const data = this.previewSop();
       if (data) {
           if (data.blockIndex === -1) {
               this.singleForcedSopId.set(data.suggestion.sop.id);
           } else {
               this.updateBlockForcedSop(data.blockIndex, data.suggestion.sop.id);
           }
           this.closeSopPreview();
       }
   }
  
  countSamples(raw: string): number { return parseUniqueSampleCodes(raw).length; }
  
  // getFilteredTargets method removed as it's replaced by filteredTargetsMap

  
  toggleBlockTarget(index: number, targetId: string) {
      this.blocks.update(b => {
          const n = [...b]; const set = new Set(n[index].selectedTargets);
          if (set.has(targetId)) set.delete(targetId); else set.add(targetId);
          n[index] = { ...n[index], selectedTargets: set, forcedSopId: undefined, sourceGroupId: undefined, sourceGroupModified: true }; // Reset provenance on manual change
          return n;
      });
  }
  selectAllTargets(index: number) {
      this.blocks.update(b => {
          const n = [...b]; const filtered = this.filteredTargetsMap().get(n[index].id) || [];
          const set = new Set(n[index].selectedTargets);
          filtered.forEach(t => set.add(t.uniqueKey));
          n[index] = { ...n[index], selectedTargets: set, forcedSopId: undefined, sourceGroupId: undefined, sourceGroupModified: true }; return n;
      });
  }
  deselectAllTargets(index: number) {
      this.blocks.update(b => { const n = [...b]; n[index] = { ...n[index], selectedTargets: new Set(), forcedSopId: undefined, sourceGroupId: undefined, sourceGroupModified: true }; return n; });
  }

  // getFilteredSingleTargets method removed as it's replaced by singleFilteredTargets signal
  
  toggleSingleTarget(targetId: string) {
      this.singleSourceGroupId.set(null);
      this.singleSelectedTargets.update(set => {
          const next = new Set(set);
          if (next.has(targetId)) next.delete(targetId); else next.add(targetId);
          return next;
      });
  }

  selectAllSingleTargets() {
      this.singleSourceGroupId.set(null);
      const filtered = this.singleFilteredTargets();
      this.singleSelectedTargets.update(set => {
          const next = new Set(set);
          filtered.forEach(t => next.add(t.uniqueKey));
          return next;
      });
  }

  deselectAllSingleTargets() {
      this.singleSelectedTargets.set(new Set());
      this.singleSourceGroupId.set(null);
  }

  openSingleTargetGroupModal() {
      this.currentBlockIndexForGroupImport.set(-2); // Special value for single sample mode
      if (this.availableGroups().length === 0) {
          this.targetService.getAllGroups().then(groups => this.availableGroups.set(groups));
      }
      this.showGroupModal.set(true);
  }

  selectMode(mode: 'multiple' | 'single') {
      this.smartBatchMode.set(mode);
      this.step.set(1);
      void this.ensureSetupDataLoaded();
  }

  openSopCalculator() {
      this.router.navigate(['/calculator']);
  }

  goBackToStep0() {
      this.step.set(0);
  }

  private ensureSetupDataLoaded(): Promise<void> {
      if (this.setupDataLoadPromise) return this.setupDataLoadPromise;

      this.setupDataLoadPromise = Promise.all([
          this.matrixTypeService.getAll().then(m => {
              this.availableMatrices.set(m);
          }),
          this.masterDeviceService.getAll().then(d => this.availableDevices.set(d)),
          this.sampleDescriptionMasterService.getActive()
            .then(items => this.availableSampleDescriptions.set(items))
            .catch(() => this.toast.show('Không thể tải gợi ý mô tả mẫu; vẫn có thể nhập tự do.', 'info'))
      ]).then(() => undefined);

      return this.setupDataLoadPromise;
  }

  // --- GROUP MODAL ---
  async openGroupModal(blockIndex: number) {
      this.currentBlockIndexForGroupImport.set(blockIndex);
      if (this.availableGroups().length === 0) {
          try { const groups = await this.targetService.getAllGroups(); this.availableGroups.set(groups); } catch(e) {}
      }
      this.showGroupModal.set(true);
  }
  importGroup(g: TargetGroup) {
      const idx = this.currentBlockIndexForGroupImport();
      const groupTargetIds = g.targets
        .map(target => getCanonicalId(target.name || target.id))
        .filter(Boolean);
      if (idx === -2) {
          this.singleSelectedTargets.update(set => {
              const hadTargets = set.size > 0;
              const next = new Set(Array.from(set, getCanonicalId).filter(Boolean));
              groupTargetIds.forEach(targetId => next.add(targetId));
              this.singleSourceGroupId.set(!hadTargets
                && computeTargetSignature([...next]) === computeTargetSignature(groupTargetIds)
                  ? g.id
                  : null);
              return next;
          });
          this.toast.show(`Đã thêm ${g.targets.length} chỉ tiêu cho mẫu.`, 'success');
      } else if (idx >= 0) {
          this.blocks.update(b => {
              const n = [...b];
              const hadTargets = n[idx].selectedTargets.size > 0;
              const set = new Set(Array.from(n[idx].selectedTargets, getCanonicalId).filter(Boolean));
              groupTargetIds.forEach(targetId => set.add(targetId));
              const exactGroup = !hadTargets
                && computeTargetSignature([...set]) === computeTargetSignature(groupTargetIds);
              n[idx] = {
                ...n[idx],
                selectedTargets: set,
                forcedSopId: undefined,
                sourceGroupId: exactGroup ? g.id : undefined,
                sourceGroupModified: hadTargets
              };
              return n;
          });
          this.toast.show(`Đã thêm ${g.targets.length} chỉ tiêu.`, 'success');
      }
      this.showGroupModal.set(false);
  }

  // --- REWRITTEN: TARGET-CENTRIC GREEDY ALGORITHM (WEIGHTED) ---
  async analyzePlan() {
      if (this.smartBatchMode() === 'single') {
          const sample = this.singleSampleCode().trim();
          if (!sample) {
              this.toast.show('Vui lòng nhập Mã mẫu duy nhất.', 'error');
              return;
          }
          if (this.singleSelectedTargets().size === 0) {
              this.toast.show('Vui lòng chọn ít nhất 1 chỉ tiêu kiểm nghiệm.', 'error');
              return;
          }
          // Construct single mock block
          const mockBlock: JobBlock = {
              id: Date.now(),
              name: `Mẫu ${sample}`,
              rawSamples: sample,
              selectedTargets: new Set(this.singleSelectedTargets()),
              targetSearch: '',
              isCollapsed: false,
              forcedSopId: this.singleForcedSopId(),
              matrixType: this.singleMatrixType(),
              sourceGroupId: this.singleSourceGroupId() || undefined,
              sampleDescriptionMap: this.singleSampleDescription()
                  ? { [sample]: this.singleSampleDescription()! }
                  : {}
          };
          this.blocks.set([mockBlock]);
      }

      const descriptionConflict = this.findDescriptionConflict();
      if (descriptionConflict) {
          this.toast.show(`Mã mẫu “${descriptionConflict}” đang có mô tả không thống nhất giữa các nhóm mẫu.`, 'error');
          return;
      }

      this.excludedTaskKeys.set(new Set());
      this.isProcessing.set(true);
      try {
          // 1. Prefetch Data
          const [inv, recipes] = await Promise.all([
              this.invService.getAllInventory(),
              this.recipeService.getAllRecipes()
          ]);
          this.inventoryCache = {}; inv.forEach(i => this.inventoryCache[i.id] = i);
          this.recipeCache = {}; recipes.forEach(r => this.recipeCache[r.id] = r);

          const batches: ProposedBatch[] = [];
          const sops = this.state.sops().filter(s => !s.isArchived);

          // 2. Flatten and de-duplicate the request before planning.
          const pendingTasks = new Map<string, AnalysisTask>();
          const forcedAssignments = new Map<string, string>();
          const taskMatrices = new Map<string, string>();
          const planningLedger: Record<string, number> = {};
          inv.forEach(item => planningLedger[item.id] = item.stock);

          const registerMatrix = (key: string, matrixType?: string) => {
              const matrixKey = matrixType || '';
              const existing = taskMatrices.get(key);
              if (existing && matrixKey && existing !== matrixKey) {
                  throw new Error(`Cùng một mẫu/chỉ tiêu đang được khai báo với hai nền mẫu khác nhau (${existing} và ${matrixKey}).`);
              }
              if (!existing || matrixKey) taskMatrices.set(key, matrixKey);
          };

          for (const block of this.blocks()) {
              const samples = this.getBlockSamples(block);
              if (samples.length === 0 || block.selectedTargets.size === 0) continue;

              const forcedSop = block.forcedSopId
                  ? sops.find(sop => sop.id === block.forcedSopId)
                  : undefined;
              if (forcedSop && !isSopMatrixCompatible(forcedSop, block.matrixType)) {
                  throw new Error(`SOP “${forcedSop.name}” không tương thích với nền mẫu “${this.getMatrixLabel(block.matrixType)}”.`);
              }

              const supportedForcedTasks: AnalysisTask[] = [];
              for (const sample of samples) {
                  for (const rawTargetId of block.selectedTargets) {
                      const targetId = getCanonicalId(rawTargetId);
                      const foundTarget = resolveTargetMasterInfo(targetId, this.allAvailableTargets());
                      const task: AnalysisTask = {
                          sample,
                          targetId,
                          targetName: foundTarget?.name || rawTargetId,
                          covered: false,
                          matrixType: block.matrixType,
                          sourceGroupId: block.sourceGroupId
                      };
                      const key = buildAnalysisTaskKey(sample, targetId);
                      registerMatrix(key, block.matrixType);

                      if (forcedSop && forcedSop.targets?.some(target => getSopTargetKey(target) === targetId)) {
                          const existingForcedSop = forcedAssignments.get(key);
                          if (existingForcedSop && existingForcedSop !== forcedSop.id) {
                              throw new Error(`Mẫu “${sample}” / chỉ tiêu “${task.targetName}” bị chỉ định cho nhiều SOP khác nhau.`);
                          }
                          if (!existingForcedSop) {
                              forcedAssignments.set(key, forcedSop.id);
                              pendingTasks.delete(key);
                              supportedForcedTasks.push({ ...task, covered: true });
                          }
                      } else if (!forcedAssignments.has(key)) {
                          const existingTask = pendingTasks.get(key);
                          if (!existingTask) {
                              pendingTasks.set(key, task);
                          } else if (!existingTask.matrixType && task.matrixType) {
                              pendingTasks.set(key, { ...existingTask, matrixType: task.matrixType });
                          }
                      }
                  }
              }

              if (forcedSop && supportedForcedTasks.length > 0) {
                  const blockSamples = new Set(supportedForcedTasks.map(task => task.sample));
                  const blockTargetIds = new Set(supportedForcedTasks.map(task => task.targetId));
                  const batchTargets = (forcedSop.targets || []).filter(target => blockTargetIds.has(getSopTargetKey(target)));
                  const inputs = this.buildDefaultBatchInputs(forcedSop, blockSamples.size);
                  const needs = this.calculator.calculateSopNeeds(
                      forcedSop, inputs, -1, this.inventoryCache, this.recipeCache, this.state.safetyConfig()
                  );
                  applyNeedsToStockLedger(needs, planningLedger);

                  const tags = ['Forced-SOP'];
                  if (block.matrixType) tags.push(this.getMatrixLabel(block.matrixType));
                  batches.push({
                      id: `batch_${Date.now()}_${batches.length}`,
                      name: forcedSop.name + ' (Chỉ định)',
                      sop: forcedSop,
                      targets: batchTargets,
                      samples: blockSamples,
                      sampleCount: blockSamples.size,
                      tasks: supportedForcedTasks,
                      inputValues: inputs,
                      safetyMargin: -1,
                      resourceImpact: needs,
                      status: 'ready',
                      tags,
                      isExpanded: false,
                      sampleDescriptionMap: this.buildDescriptionMapForSamples(blockSamples)
                  });
              }
          }

          // 3. Greedy loop with deterministic scoring and quantity-aware stock penalty.
          let remainingTasks = Array.from(pendingTasks.values());
          let iterationCount = 0;
          const sopsForAuto = sops.filter(sop => !sop.isManualOnly);
          const maxIterations = Math.max(1, Math.min(remainingTasks.length, sopsForAuto.length + 1));

          while (remainingTasks.length > 0 && iterationCount < maxIterations) {
              iterationCount++;
              const candidates = sopsForAuto.map(sop => {
                  if (!sop.targets || sop.targets.length === 0) return null;
                  const sopTargetIds = new Set(sop.targets.map(getSopTargetKey));
                  const coverableTasks = remainingTasks.filter(task =>
                      sopTargetIds.has(task.targetId) && isSopMatrixCompatible(sop, task.matrixType)
                  );
                  if (coverableTasks.length === 0) return null;

                  let score = coverableTasks.length * 10;
                  const involvedSamples = new Set(coverableTasks.map(task => normalizeSampleCode(task.sample)));
                  involvedSamples.forEach(sampleKey => {
                      const tasksForSample = remainingTasks.filter(task => normalizeSampleCode(task.sample) === sampleKey);
                      const coveredForSample = coverableTasks.filter(task => normalizeSampleCode(task.sample) === sampleKey);
                      if (tasksForSample.length === coveredForSample.length) score += 5;
                  });

                  const uniqueCovered = new Set(coverableTasks.map(task => task.targetId)).size;
                  score += (uniqueCovered / sop.targets.length) * 30;
                  score -= (sop.targets.length - uniqueCovered);

                  const sampleCount = new Set(coverableTasks.map(task => normalizeSampleCode(task.sample))).size;
                  const inputs = this.buildDefaultBatchInputs(sop, sampleCount);
                  const needs = this.calculator.calculateSopNeeds(
                      sop, inputs, -1, this.inventoryCache, this.recipeCache, this.state.safetyConfig()
                  );
                  const unavailableCount = countUnavailableStockItems(needs, planningLedger);
                  const validationCount = validateCalculatedItems(needs, -1).length;
                  score -= unavailableCount * 100;
                  score -= validationCount * 1000;

                  return { sop, coverableTasks, score, inputs, needs };
              }).filter((candidate): candidate is NonNullable<typeof candidate> => candidate !== null);

              if (candidates.length === 0) break;
              candidates.sort((a, b) =>
                  b.score - a.score
                  || a.sop.name.localeCompare(b.sop.name)
                  || a.sop.id.localeCompare(b.sop.id)
              );
              const bestFit = candidates[0];
              const coveredTasks = bestFit.coverableTasks.map(task => ({ ...task, covered: true }));
              const batchSamples = new Set(coveredTasks.map(task => task.sample));
              const batchTargetIds = new Set(coveredTasks.map(task => task.targetId));
              const batchTargets = (bestFit.sop.targets || []).filter(target => batchTargetIds.has(getSopTargetKey(target)));
              applyNeedsToStockLedger(bestFit.needs, planningLedger);

              const tags = ['Đã tối ưu tự động'];
              const matrixTypes = new Set(coveredTasks.map(task => task.matrixType).filter((matrix): matrix is string => Boolean(matrix)));
              matrixTypes.forEach(matrix => tags.push(this.getMatrixLabel(matrix)));

              batches.push({
                  id: `batch_${Date.now()}_${batches.length}`,
                  name: bestFit.sop.name,
                  sop: bestFit.sop,
                  targets: batchTargets,
                  samples: batchSamples,
                  sampleCount: batchSamples.size,
                  tasks: coveredTasks,
                  inputValues: bestFit.inputs,
                  safetyMargin: -1,
                  resourceImpact: bestFit.needs,
                  status: 'ready',
                  tags,
                  isExpanded: false,
                  sampleDescriptionMap: this.buildDescriptionMapForSamples(batchSamples)
              });

              const coveredKeys = new Set(coveredTasks.map(task => buildAnalysisTaskKey(task.sample, task.targetId)));
              remainingTasks = remainingTasks.filter(task => !coveredKeys.has(buildAnalysisTaskKey(task.sample, task.targetId)));
          }

          this.batches.set(batches);
          this.unmappedTasks.set(remainingTasks);
          
          this.validateGlobalStock();
          this.step.set(2);

      } catch (e: any) {
          this.toast.show('Lỗi phân tích: ' + e.message, 'error');
          console.error(e);
      } finally {
          this.isProcessing.set(false);
      }
  }

  matchesSearch(batch: ProposedBatch): boolean {
      if (!this.sampleSearchTerm()) return false;
      const term = this.sampleSearchTerm().toLowerCase();
      for (const s of Array.from(batch.samples)) {
          if (s.toLowerCase().includes(term)) return true;
      }
      return false;
  }

  // --- BATCH MODIFICATION ---
  setBatchMarginManual(index: number) { this.updateBatchMargin(index, 10); }
  
  updateBatchMargin(index: number, val: number) {
      this.batches.update(current => {
          const next = [...current];
          let finalVal = Number(val);
          if (isNaN(finalVal)) finalVal = 0;
          const batch = { ...next[index], safetyMargin: finalVal };
          batch.resourceImpact = this.calculator.calculateSopNeeds(
              batch.sop, batch.inputValues, batch.safetyMargin, this.inventoryCache, this.recipeCache, this.state.safetyConfig()
          );
          next[index] = batch;
          return next;
      });
      this.validateGlobalStock();
  }

  updateBatchInput(index: number, key: string, val: any) {
      this.batches.update(current => {
          const next = [...current];
          const batch = { ...next[index] };
          batch.inputValues = { ...batch.inputValues, [key]: val };
          batch.resourceImpact = this.calculator.calculateSopNeeds(
              batch.sop, batch.inputValues, batch.safetyMargin, this.inventoryCache, this.recipeCache, this.state.safetyConfig()
          );
          next[index] = batch;
          return next;
      });
      this.validateGlobalStock();
  }

  private getLocalTodayDate(): string {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
  }

  private buildDefaultBatchInputs(sop: Sop, sampleCount: number): Record<string, any> {
      const inputs: Record<string, any> = { analysisDate: this.getLocalTodayDate() };
      sop.inputs.forEach(input => inputs[input.var] = input.default);
      inputs['analysisDate'] ||= this.getLocalTodayDate();
      inputs['n_sample'] = sampleCount;
      if (sop.device) inputs['device'] = sop.device;
      return inputs;
  }

  private isValidAnalysisDate(value: unknown): value is string {
      if (typeof value !== 'string') return false;
      const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
      if (!match) return false;
      const year = Number(match[1]);
      const month = Number(match[2]);
      const day = Number(match[3]);
      const candidate = new Date(year, month - 1, day);
      return candidate.getFullYear() === year
          && candidate.getMonth() === month - 1
          && candidate.getDate() === day;
  }

  hasInvalidAnalysisDates(): boolean {
      return this.batches().some(batch => !this.isValidAnalysisDate(batch.inputValues['analysisDate']));
  }

  toggleBatchDetails(index: number) {
      this.batches.update(current => {
          const next = [...current];
          next[index] = { ...next[index], isExpanded: !next[index].isExpanded };
          return next;
      });
  }

  // Helpers for summary view
  getMissingCount(batch: ProposedBatch): number {
      let count = 0;
      batch.resourceImpact.forEach(item => {
          if (item.isComposite) {
              item.breakdown.forEach(sub => { if (sub.isMissing) count++; });
          } else {
              if (item.isMissing) count++;
          }
      });
      return count;
  }

  countTotalItems(batch: ProposedBatch): number {
      let count = 0;
      batch.resourceImpact.forEach(item => {
          if (item.isComposite) count += item.breakdown.length;
          else count++;
      });
      return count;
  }

  private validateGlobalStock() {
      const ledger: Record<string, number> = {};
      Object.entries(this.inventoryCache).forEach(([k, v]) => ledger[k] = v.stock);
      
      this.batches.update(current => {
          return current.map(batch => {
              const needs = batch.resourceImpact;
              let isMissing = false;
              
              // We need to map over needs and update isMissing flags on a deep copy or in place if mutable
              // Since signals update is immutable, we map and return new structure if changes
              const updatedNeeds = needs.map(item => {
                  const newItem = { ...item };
                  
                  if (newItem.isComposite) {
                      const newBreakdown = newItem.breakdown.map(sub => {
                          const available = ledger[sub.name] || 0;
                          const subMissing = available < sub.totalNeed;
                          if (subMissing) isMissing = true;
                          if (ledger[sub.name] !== undefined) ledger[sub.name] -= sub.totalNeed;
                          return { ...sub, isMissing: subMissing };
                      });
                      newItem.breakdown = newBreakdown;
                  } else {
                      const available = ledger[newItem.name] || 0;
                      const itemMissing = available < newItem.stockNeed;
                      if (itemMissing) isMissing = true;
                      if (ledger[newItem.name] !== undefined) ledger[newItem.name] -= newItem.stockNeed;
                      newItem.isMissing = itemMissing;
                  }
                  return newItem;
              });
              
              // Auto-expand if critical error, otherwise respect user choice or default
              const newStatus = isMissing ? 'missing_stock' : 'ready';
              const shouldExpand = isMissing ? true : (batch.isExpanded || false);

              return { ...batch, resourceImpact: updatedNeeds, status: newStatus, isExpanded: shouldExpand };
          });
      });
  }

  // --- SPLIT WIZARD LOGIC ---
  
  openSplitModal(batchIndex: number) {
      const batch = this.batches()[batchIndex];
      this.splitState.set({
          ...this.splitState(),
          sourceBatchIndex: batchIndex,
          sourceBatchName: batch.name,
      });
      this.showSplitModal.set(true);
  }

  executeSplitFromWizard(event: {samples: Set<string>, targets: Set<string>, sopId: string}) {
      this.splitState.update(s => ({
          ...s,
          selectedSamples: event.samples,
          selectedTargets: event.targets,
          selectedSopId: event.sopId
      }));
      this.executeSplit();
  }

  // Helper to re-generate batch metadata from a list of tasks
  private recalculateBatchMetadata(tasks: AnalysisTask[], sop: Sop, originalBatch: ProposedBatch): Partial<ProposedBatch> {
      const uniqueSamples = new Set(tasks.map(t => t.sample));
      const uniqueTargetIds = new Set(tasks.map(t => t.targetId));
      
      // Use originalBatch.targets instead of sop.targets so manually removed targets don't come back
      const batchTargets = (originalBatch.targets || []).filter(t => uniqueTargetIds.has(getCanonicalId(t.name)));
      
      const newInputs = { ...originalBatch.inputValues };
      // Try to reset n_sample based on new size, but keep other manual inputs
      newInputs['n_sample'] = uniqueSamples.size;

      // Recalculate resource impact using calculator service
      // Note: We need inventory/recipe cache which should be available
      const needs = this.calculator.calculateSopNeeds(
          sop, newInputs, originalBatch.safetyMargin, this.inventoryCache, this.recipeCache, this.state.safetyConfig()
      );

      return {
          samples: uniqueSamples,
          sampleCount: uniqueSamples.size,
          targets: batchTargets,
          tasks: tasks,
          inputValues: newInputs,
          resourceImpact: needs,
          sampleDescriptionMap: subsetSampleDescriptionMap(originalBatch.sampleDescriptionMap, uniqueSamples)
      };
  }

  // Execute
  async executeSplit() {
      const state = this.splitState();
      if (!state.selectedSopId) return;

      const sourceBatch = this.batches()[state.sourceBatchIndex];
      const targetSop = this.activeSops().find(s => s.id === state.selectedSopId);
      
      if (!targetSop) return;

      // 1. Identify TASKS to Move (Intersection of Selected Samples & Selected Targets)
      // Logic: Move specific AnalysisTasks. If Sample L01 is selected, and Target A is selected, move (L01, A).
      // Keep (L01, B) in old batch if B wasn't selected.
      
      const tasksToMove: AnalysisTask[] = [];
      const tasksToKeep: AnalysisTask[] = [];

      const selectedCanonicalIds = new Set(Array.from(state.selectedTargets).map(getCanonicalId));

      if (sourceBatch.tasks) {
          sourceBatch.tasks.forEach(t => {
              if (state.selectedSamples.has(t.sample) && selectedCanonicalIds.has(t.targetId)) {
                  tasksToMove.push(t);
              } else {
                  tasksToKeep.push(t);
              }
          });
      } else {
          // Fallback: Artificial task creation if source lacks them
          state.selectedSamples.forEach(s => {
              state.selectedTargets.forEach(tid => {
                  const tName = state.availableTargets.find(t => t.id === tid)?.name || tid;
                  tasksToMove.push({ sample: s, targetId: tid, targetName: tName, covered: true });
              });
          });
          // For legacy, we just clear the source if all samples moved, hard to reconstruct exact 'keep' without original tasks
          // Assuming source is valid Task-Based from now on.
      }

      if (tasksToMove.length === 0) return;
      if (tasksToMove.some(task => !isSopMatrixCompatible(targetSop, task.matrixType))) {
          this.toast.show('SOP đích không tương thích với nền mẫu của các task đã chọn.', 'error');
          return;
      }

      // 2. Create New Batch
      // Metadata calculation for new batch
      const uniqueSamplesNew = new Set(tasksToMove.map(t => t.sample));
      const uniqueTargetIdsNew = new Set(tasksToMove.map(t => t.targetId));
      const newBatchTargets = (targetSop.targets || []).filter(target => uniqueTargetIdsNew.has(getSopTargetKey(target)));
      if (newBatchTargets.length !== uniqueTargetIdsNew.size) {
          this.toast.show('SOP đích không phủ đầy đủ các chỉ tiêu đã chọn.', 'error');
          return;
      }
      
      const newInputs: Record<string, any> = {};
      targetSop.inputs.forEach(i => newInputs[i.var] = i.default);
      Object.keys(newInputs).forEach(k => {
          if (sourceBatch.inputValues[k] !== undefined) newInputs[k] = sourceBatch.inputValues[k];
      });
      newInputs['n_sample'] = uniqueSamplesNew.size;
      if (targetSop.device && !newInputs['device']) {
          newInputs['device'] = targetSop.device;
      }

      const newNeeds = this.calculator.calculateSopNeeds(targetSop, newInputs, sourceBatch.safetyMargin, this.inventoryCache, this.recipeCache, this.state.safetyConfig());

      const newBatch: ProposedBatch = {
          id: `batch_split_${Date.now()}_${Math.floor(Math.random()*1000)}`,
          name: targetSop.name + ' (Tách)',
          sop: targetSop,
          targets: newBatchTargets,
          samples: uniqueSamplesNew,
          sampleCount: uniqueSamplesNew.size,
          tasks: tasksToMove.map(task => ({ ...task, covered: true })),
          inputValues: newInputs,
          safetyMargin: sourceBatch.safetyMargin,
          resourceImpact: newNeeds,
          status: 'ready',
          isExpanded: false,
          sampleDescriptionMap: subsetSampleDescriptionMap(sourceBatch.sampleDescriptionMap, uniqueSamplesNew)
      };

      // 3. Update Source Batch
      this.batches.update(current => {
          const next = [...current];
          
          if (tasksToKeep.length === 0) {
              // Source completely drained
              next.splice(state.sourceBatchIndex, 1);
          } else {
              // Recalculate source based on remaining tasks
              const updatedMeta = this.recalculateBatchMetadata(tasksToKeep, sourceBatch.sop, sourceBatch);
              
              next[state.sourceBatchIndex] = {
                  ...sourceBatch,
                  ...updatedMeta
              };
          }
          next.push(newBatch);
          return next;
      });

      this.validateGlobalStock();
      this.showSplitModal.set(false);
      this.toast.show('Đã tách mẻ thành công.', 'success');
  }

  // --- NEW: Remove Target From Batch directly ---
  removeTargetFromBatch(batchIndex: number, targetId: string) {
      const currentBatch = this.batches()[batchIndex];
      if (!currentBatch) return;
      const target = currentBatch.targets.find(item => item.id === targetId);
      const canonicalTargetId = target ? getSopTargetKey(target) : getCanonicalId(targetId);
      const removedTasks = currentBatch.tasks.filter(task => task.targetId === canonicalTargetId);
      this.excludedTaskKeys.update(current => {
          const next = new Set(current);
          removedTasks.forEach(task => next.add(buildAnalysisTaskKey(task.sample, task.targetId)));
          return next;
      });

      this.batches.update(current => {
          const next = [...current];
          const batch = next[batchIndex];
          if (!batch) return next;

          const tasksToKeep = batch.tasks.filter(task => task.targetId !== canonicalTargetId);

          if (tasksToKeep.length === 0) {
              next.splice(batchIndex, 1);
          } else {
              const updatedMeta = this.recalculateBatchMetadata(tasksToKeep, batch.sop, batch);
              next[batchIndex] = {
                  ...batch,
                  ...updatedMeta
              };
          }
          return next;
      });
      this.validateGlobalStock();
      this.toast.show(`Đã loại “${removedTasks[0]?.targetName || targetId}” khỏi kế hoạch hiện tại.`, 'info');
  }

  // --- QUICK IMPORT LOGIC ---
  async openQuickImport(item: CalculatedItem | any) {
      if (!this.auth.canEditInventory()) {
          this.toast.show('Bạn không có quyền sửa kho.', 'error');
          return;
      }
      
      this.isProcessing.set(true);
      try {
          // FIX: Determine correct Inventory ID
          // Summary Item: id=InventoryID, name=DisplayName
          // CalculatedItem: name=InventoryID, displayName=DisplayName
          // We use the ID if available, otherwise name.
          const targetId = item.id || item.name;

          // FETCH FRESH DATA directly from Firestore to ensure accuracy
          const freshItems = await this.invService.getItemsByIds([targetId]);
          const freshStock = freshItems.length > 0 ? freshItems[0].stock : 0;
          
          // Update the local cache with this fresh value immediately
          if (freshItems.length > 0) {
              this.inventoryCache[targetId] = freshItems[0];
          }

          // Calculate missing based on FRESH stock
          // If item comes from summary (has .missing), we can try to use it as a hint, 
          // or re-calculate total need.
          let missingAmount = 0;
          
          if (item.missing !== undefined) {
              // Re-calculate Total Need for this specific Item across all batches to be accurate against fresh stock
              let totalNeed = 0;
              for (const b of this.batches()) {
                  b.resourceImpact.forEach(ri => {
                      if (ri.isComposite) {
                          ri.breakdown.forEach(sub => { if(sub.name === targetId) totalNeed += sub.totalNeed; });
                      } else {
                          if (ri.name === targetId) totalNeed += ri.stockNeed;
                      }
                  });
              }
              missingAmount = Math.max(0, totalNeed - freshStock);
          } else {
              // Single item context
              const needed = item.totalNeed || item.stockNeed || 0;
              missingAmount = Math.max(0, needed - freshStock);
          }

          this.quickImportState.set({
              id: targetId,
              name: item.displayName || item.name, // Display Name
              unit: item.stockUnit || item.unit,
              currentStock: freshStock,
              missingAmount: missingAmount
          });
          this.quickImportInput = 0;
          this.showQuickImport.set(true);
      } catch (e: any) {
          this.toast.show('Lỗi tải dữ liệu kho: ' + e.message, 'error');
      } finally {
          this.isProcessing.set(false);
      }
  }

  async submitQuickImport() {
      if (this.isProcessing()) return;
      const state = this.quickImportState();
      const amount = this.quickImportInput;
      
      if (amount <= 0) return;

      this.isProcessing.set(true);
      try {
          // Use Base Unit directly as per requirement
          await this.invService.updateStock(state.id, state.currentStock, amount, 'Điều chỉnh tồn kho khi lập mẻ');

          const updatedItem = (await this.invService.getItemsByIds([state.id]))[0];

          if (updatedItem) {
              this.inventoryCache[state.id] = updatedItem;
              this.state.inventory.update(items => {
                  const index = items.findIndex(item => item.id === state.id);
                  if (index < 0) return [...items, updatedItem];

                  const next = [...items];
                  next[index] = updatedItem;
                  return next;
              });
          }

          this.toast.show(`Đã nhập +${formatNum(amount)} ${state.unit}`, 'success');
          this.showQuickImport.set(false);
          
          // Re-validate Batches
          this.validateGlobalStock();

      } catch (e: any) {
          this.toast.show('Lỗi nhập kho: ' + e.message, 'error');
      } finally {
          this.isProcessing.set(false);
      }
  }

  // --- Auto-Fix Logic (Modal) ---
  private canonicalTargetSet(targetIds: Iterable<string>): Set<string> {
      const canonical = new Set<string>();
      for (const targetId of targetIds) {
          const canonicalId = getCanonicalId(targetId);
          if (canonicalId) canonical.add(canonicalId);
      }
      return canonical;
  }

  private selectedTargetSetHas(targetIds: Iterable<string>, targetId: string): boolean {
      return this.canonicalTargetSet(targetIds).has(getCanonicalId(targetId));
  }

  private selectedTargetSetWithout(targetIds: Iterable<string>, targetId: string): Set<string> {
      const canonical = this.canonicalTargetSet(targetIds);
      canonical.delete(getCanonicalId(targetId));
      return canonical;
  }

  fixCoverage() {
      const unmapped = this.unmappedTasks();
      if (unmapped.length === 0) return;

      const allSops = this.activeSops();
      const normalSops = allSops.filter(s => !s.isManualOnly);
      const manualSops = allSops.filter(s => s.isManualOnly);

      const group1: DiagGroup1Item[] = [];
      const group2: DiagGroup2Item[] = [];
      const group3: DiagGroup3Item[] = [];

      // --- Gom theo (targetId, blockId, matrixType) ---
      const keyMap = new Map<string, { targetId: string, targetName: string, blockId: number, matrixType?: string, samples: string[] }>();
      
      for (const task of unmapped) {
        const block = this.blocks().find(b => {
          const samples = b.rawSamples.split('\n').map(s => s.trim()).filter(Boolean);
          // check if sample is in this block and target is selected
          return samples.includes(task.sample) && this.selectedTargetSetHas(b.selectedTargets, task.targetId);
        });
        
        const blockId = block?.id ?? -1;
        const key = `${task.targetId}__${blockId}`;
        
        if (!keyMap.has(key)) {
          keyMap.set(key, { targetId: task.targetId, targetName: task.targetName, blockId, matrixType: task.matrixType, samples: [] });
        }
        keyMap.get(key)!.samples.push(task.sample);
      }

      // --- Phân loại từng nhóm ---
      for (const [, item] of keyMap) {
        const { targetId, targetName, blockId, matrixType, samples } = item;

        const normalSopsWithTarget = normalSops.filter(s =>
          s.targets?.some(t => getCanonicalId(t.name) === targetId)
        );

        const manualSopsWithTarget = manualSops.filter(s =>
          s.targets?.some(t => getCanonicalId(t.name) === targetId)
        );
        const compatibleNormalSops = normalSopsWithTarget.filter(sop => isSopMatrixCompatible(sop, matrixType));
        const compatibleManualSops = manualSopsWithTarget.filter(sop => isSopMatrixCompatible(sop, matrixType));

        if (normalSopsWithTarget.length === 0 && manualSopsWithTarget.length === 0) {
          // --- NHÓM 3: Không có SOP nào ---
          group3.push({ targetId, targetName, affectedSamples: samples, blockId, action: 'remove' });

        } else if (compatibleNormalSops.length === 0 && compatibleManualSops.length > 0) {
          // --- NHÓM 1: Chỉ có SOP Đặc thù ---
          const autoChosen = compatibleManualSops.length === 1 ? compatibleManualSops[0].id : null;
          group1.push({
            targetId, targetName, affectedSamples: samples, blockId,
            candidateSops: compatibleManualSops,
            chosenSopId: autoChosen
          });

        } else {
          // --- NHÓM 2: Sai Matrix ---
          const compatibleSops = [...normalSopsWithTarget, ...manualSopsWithTarget].map(sop => ({
            sop,
            matrices: sop.matrixTags || []
          }));
          group2.push({
            targetId, targetName, affectedSamples: samples, blockId,
            currentMatrix: matrixType,
            compatibleSops,
            action: 'ignore_matrix'
          });
        }
      }

      this.fixCoverageState.set({
        isOpen: true,
        isProcessing: false,
        group1, group2, group3
      });
  }

  updateFixGroup1Sop(idx: number, sopId: string | null) {
      this.fixCoverageState.update(s => {
          const g1 = [...s.group1];
          g1[idx] = { ...g1[idx], chosenSopId: sopId };
          return { ...s, group1: g1 };
      });
  }

  updateFixGroup2Action(idx: number, action: 'remove' | 'ignore_matrix') {
      this.fixCoverageState.update(s => {
          const g2 = [...s.group2];
          g2[idx] = { ...g2[idx], action };
          return { ...s, group2: g2 };
      });
  }

  updateFixGroup3Action(idx: number, action: 'remove' | 'keep_unmapped') {
      this.fixCoverageState.update(s => {
          const g3 = [...s.group3];
          g3[idx] = { ...g3[idx], action };
          return { ...s, group3: g3 };
      });
  }

  private removeTargetFromSourceBlock(blockId: number, targetId: string): void {
      this.blocks.update(blocks => blocks
          .map(block => {
              if (block.id !== blockId) return block;
              const selectedTargets = this.selectedTargetSetWithout(block.selectedTargets, targetId);
              return {
                  ...block,
                  selectedTargets,
                  forcedSopId: selectedTargets.size === 0 ? undefined : block.forcedSopId,
                  sourceGroupId: undefined,
                  sourceGroupModified: true
              };
          })
          .filter(block => block.selectedTargets.size > 0 || parseUniqueSampleCodes(block.rawSamples).length === 0)
      );
  }

  private moveTargetToDedicatedBlock(
      blockId: number,
      targetId: string,
      targetName: string,
      affectedSamples: string[],
      options: { forcedSopId?: string; clearMatrix?: boolean }
  ): void {
      this.blocks.update(blocks => {
          const sourceIndex = blocks.findIndex(block => block.id === blockId);
          if (sourceIndex < 0) return blocks;
          const source = blocks[sourceIndex];
          const canonicalTargetId = getCanonicalId(targetId);
          const canonicalSourceTargets = this.canonicalTargetSet(source.selectedTargets);

          if (canonicalSourceTargets.size === 1 && canonicalSourceTargets.has(canonicalTargetId)) {
              const next = [...blocks];
              next[sourceIndex] = {
                  ...source,
                  selectedTargets: canonicalSourceTargets,
                  forcedSopId: options.forcedSopId,
                  matrixType: options.clearMatrix ? undefined : source.matrixType,
                  sourceGroupId: undefined,
                  sourceGroupModified: true
              };
              return next;
          }

          const remainingTargets = this.selectedTargetSetWithout(canonicalSourceTargets, canonicalTargetId);
          const dedicatedSamples = parseUniqueSampleCodes(affectedSamples.join('\n'));
          const dedicated: JobBlock = {
              ...this.createEmptyBlock(`${source.name} — ${targetName}`, options.clearMatrix ? undefined : source.matrixType),
              id: Date.now() + blocks.length + Math.floor(Math.random() * 1000),
              rawSamples: dedicatedSamples.join('\n'),
              selectedTargets: new Set([canonicalTargetId]),
              forcedSopId: options.forcedSopId,
              sourceGroupModified: true,
              sampleDescriptionMap: subsetSampleDescriptionMap(source.sampleDescriptionMap, dedicatedSamples)
          };
          const next = [...blocks];
          next[sourceIndex] = {
              ...source,
              selectedTargets: remainingTargets,
              sourceGroupId: undefined,
              sourceGroupModified: true
          };
          next.splice(sourceIndex + 1, 0, dedicated);
          return next;
      });
  }

  applyFixCoverage() {
      const state = this.fixCoverageState();
      this.fixCoverageState.update(s => ({ ...s, isProcessing: true }));

      // Process Group 1
      for (const item of state.group1) {
          if (item.chosenSopId === null) {
              this.removeTargetFromSourceBlock(item.blockId, item.targetId);
          } else {
              this.moveTargetToDedicatedBlock(
                  item.blockId,
                  item.targetId,
                  item.targetName,
                  item.affectedSamples,
                  { forcedSopId: item.chosenSopId }
              );
          }
      }

      // Process Group 2
      for (const item of state.group2) {
          const blockIdx = this.blocks().findIndex(b => b.id === item.blockId);
          if (blockIdx === -1) continue;

          if (item.action === 'remove') {
              this.removeTargetFromSourceBlock(item.blockId, item.targetId);
          } else {
              this.moveTargetToDedicatedBlock(
                  item.blockId,
                  item.targetId,
                  item.targetName,
                  item.affectedSamples,
                  { clearMatrix: true }
              );
          }
      }

      // Process Group 3
      for (const item of state.group3) {
          if (item.action === 'remove') {
              this.removeTargetFromSourceBlock(item.blockId, item.targetId);
          }
      }

      this.fixCoverageState.update(s => ({ ...s, isOpen: false, isProcessing: false }));
      this.analyzePlan();
  }

  closeFixCoverageModal() {
      this.fixCoverageState.update(s => ({ ...s, isOpen: false }));
  }

  getCompatibleMatricesLabel(item: DiagGroup2Item): string {
      if (!item.compatibleSops || item.compatibleSops.length === 0) return '';
      const matrices = item.compatibleSops[0].matrices;
      const labels = matrices.map(m => this.getMatrixLabel(m) || 'Dùng chung');
      return labels.join(', ');
  }

  reset() {
      this.step.set(0);
      this.batches.set([]);
      this.unmappedTasks.set([]);
      this.excludedTaskKeys.set(new Set());
      this.blocks.set([this.createEmptyBlock()]);
      this.singleSampleCode.set('');
      this.singleSampleDescription.set(undefined);
      this.singleSelectedTargets.set(new Set());
      this.singleSourceGroupId.set(null);
      this.singleMatrixType.set(undefined);
      this.singleTargetSearch.set('');
      this.singleForcedSopId.set(undefined);
  }

  goBackFromStep2() {
      if (this.smartBatchMode() === 'single' && this.blocks().length > 0) {
          const mockBlock = this.blocks()[0];
          this.singleSampleCode.set(mockBlock.rawSamples.trim());
          this.singleSampleDescription.set(getSampleDescriptionSnapshot(mockBlock.sampleDescriptionMap, mockBlock.rawSamples.trim()));
          this.singleSelectedTargets.set(new Set(mockBlock.selectedTargets));
          this.singleSourceGroupId.set(mockBlock.sourceGroupId || null);
          this.singleMatrixType.set(mockBlock.matrixType);
          this.singleForcedSopId.set(mockBlock.forcedSopId);
      }
      this.batches.set([]);
      this.unmappedTasks.set([]);
      this.excludedTaskKeys.set(new Set());
      this.step.set(1);
  }

  async executeAll() {
      if (this.isProcessing()) return;
      if (!this.auth.canRunBatch()) {
          this.toast.show('Bạn không có quyền lập và vận hành mẻ.', 'error');
          return;
      }
      if (this.batches().length === 0) {
          this.toast.show('Kế hoạch chưa có mẻ nào để duyệt.', 'error');
          return;
      }
      if (this.hasInvalidAnalysisDates()) {
          this.toast.show('Vui lòng chọn ngày kiểm nghiệm hợp lệ cho tất cả các mẻ.', 'error');
          return;
      }
      if (this.hasInvalidPlanResources()) {
          this.toast.show('Kế hoạch có lỗi công thức, đơn vị hoặc lượng tiêu hao không hợp lệ.', 'error');
          return;
      }
      const coverage = this.coverageMetrics();
      if (!coverage.isFullyCovered || coverage.duplicateCount > 0) {
          this.toast.show('Kế hoạch phải phủ đủ và không được trùng task trước khi duyệt.', 'error');
          return;
      }
      this.validateGlobalStock();
      if (this.hasCriticalMissing()) {
          this.toast.show('Kho không đủ đáp ứng. Vui lòng kiểm tra lại.', 'error');
          return;
      }
      
      if (await this.confirmation.confirm({ message: `Xác nhận tạo nguyên tử ${this.batches().length} phiếu yêu cầu, trừ kho và đưa toàn bộ vào hàng đợi in? Nếu một mẻ lỗi, toàn bộ kế hoạch sẽ không được ghi.`, confirmText: 'Duyệt Toàn Bộ' })) {
          this.isProcessing.set(true);
          const inventoryMap = this.state.inventoryMap();
          
          try {
              const planItems = this.batches().map(batch => {
                   const sampleTargetMap: Record<string, string[]> = {};
                   if (batch.tasks && batch.tasks.length > 0) {
                       batch.tasks.forEach(t => {
                          if (!sampleTargetMap[t.sample]) {
                              sampleTargetMap[t.sample] = [];
                          }
                          if (!sampleTargetMap[t.sample].includes(t.targetId)) {
                              sampleTargetMap[t.sample].push(t.targetId);
                          }
                      });
                  } else {
                      const allTargetIds = batch.targets.map(t => t.id);
                      Array.from(batch.samples).forEach(s => {
                          sampleTargetMap[s] = allTargetIds;
                      });
                  }

                  const finalInputs = { 
                      ...batch.inputValues, 
                      safetyMargin: Number(batch.safetyMargin), 
                      sampleList: Array.from(batch.samples),
                      targetIds: batch.targets.map(t => t.id),
                      sampleTargetMap,
                      sampleDescriptionMap: batch.sampleDescriptionMap,
                      analysisDate: batch.inputValues['analysisDate'],
                       explicitGroupId: batch.tasks.length > 0
                         && batch.tasks.every(task => task.sourceGroupId && task.sourceGroupId === batch.tasks[0].sourceGroupId)
                         ? batch.tasks[0].sourceGroupId
                         : undefined
                   };

                   return {
                       sop: batch.sop,
                       calculatedItems: batch.resourceImpact,
                       formInputs: finalInputs
                   };
              });

              const result = await this.state.directApproveBatchPlan(planItems, inventoryMap);
              if (result && result.length === planItems.length) {
                  this.toast.show(`Hoàn tất! Đã duyệt nguyên tử ${result.length} mẻ và đưa phiếu vào hàng đợi in.`, 'success');
                  this.reset();
              }
          } catch (e: any) {
              this.toast.show('Lỗi xử lý: ' + e.message, 'error');
          } finally {
              this.isProcessing.set(false);
          }
      }
  }

  // --- QUICK GENERATE MODAL HANDLERS ---
  openQuickGenerateModal(index: number) {
      this.activeBlockIndexForGenerate.set(index);
      this.quickGenerateModalOpen.set(true);
  }

  closeQuickGenerateModal() {
      this.quickGenerateModalOpen.set(false);
      this.activeBlockIndexForGenerate.set(null);
  }

  handleGeneratedSamples(samples: string[]) {
      const index = this.activeBlockIndexForGenerate();
      if (index !== null && index >= 0 && index < this.blocks().length) {
          const currentSamples = this.blocks()[index].rawSamples;
          const newSamplesStr = samples.join('\n');
          
          const updatedSamples = currentSamples 
              ? `${currentSamples.trim()}\n${newSamplesStr}` 
              : newSamplesStr;
              
          this.updateBlockSamples(index, updatedSamples);
          this.toast.show(`Đã thêm ${samples.length} mẫu vào danh sách.`, 'success');
      }
      this.closeQuickGenerateModal();
  }
}

function normalizeDescription(value: string): string {
    return String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}
