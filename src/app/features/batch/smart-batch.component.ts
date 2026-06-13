
import { Component, inject, signal, computed, effect } from '@angular/core';
import { getCanonicalId } from '../results/shared/compound-id-resolver';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '../../core/services/state.service';
import { AuthService } from '../../core/services/auth.service';
import { CalculatorService } from '../../core/services/calculator.service';
import { RecipeService } from '../recipes/recipe.service';
import { TargetService } from '../targets/target.service'; 
import { InventoryService } from '../inventory/inventory.service';
import { Sop, SopTarget, CalculatedItem, TargetGroup } from '../../core/models/sop.model';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { PrintService, PrintJob } from '../../core/services/print.service';
import { formatNum, generateSlug, formatSampleList } from '../../shared/utils/utils';
import { InventoryItem } from '../../core/models/inventory.model';
import { Recipe } from '../../core/models/recipe.model';
import { GHS_DICTIONARY } from '../../core/services/pubchem.service';

// --- DATA MODELS ---

interface JobBlock {
    id: number;
    name: string;
    rawSamples: string;
    selectedTargets: Set<string>;
    targetSearch: string;
    isCollapsed: boolean;
    forcedSopId?: string;
}

interface AnalysisTask {
    sample: string;
    targetId: string;
    targetName: string;
    covered: boolean;
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

import { QuickGenerateSampleModalComponent } from '../../shared/components/quick-generate-sample-modal/quick-generate-sample-modal.component';
import { BatchSplitWizardComponent } from './components/batch-split-wizard.component';

@Component({
  selector: 'app-smart-batch',
  standalone: true,
  imports: [CommonModule, FormsModule, QuickGenerateSampleModalComponent, BatchSplitWizardComponent],
  templateUrl: './smart-batch.component.html'
})
export class SmartBatchComponent {
  state = inject(StateService);
  auth = inject(AuthService);
  calculator = inject(CalculatorService);
  recipeService = inject(RecipeService);
  targetService = inject(TargetService); 
  invService = inject(InventoryService);
  toast = inject(ToastService);
  confirmation = inject(ConfirmationService);
  printService = inject(PrintService);
  formatNum = formatNum;
  formatSampleList = formatSampleList;

  get GHS_DICT() { return GHS_DICTIONARY; }
  step = signal<number>(1);
  blocks = signal<JobBlock[]>([ { id: Date.now(), name: 'Nhóm Mẫu #1', rawSamples: '', selectedTargets: new Set<string>(), targetSearch: '', isCollapsed: false, forcedSopId: undefined } ]);
  batches = signal<ProposedBatch[]>([]);
  unmappedTasks = signal<AnalysisTask[]>([]);
  isProcessing = signal(false);
  isEditingName = signal<number | null>(null);
  
  // Quick Generate Modal State
  quickGenerateModalOpen = signal(false);
  activeBlockIndexForGenerate = signal<number | null>(null);
  
  private inventoryCache: Record<string, InventoryItem> = {};
  private recipeCache: Record<string, Recipe> = {};
  
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

  // --- QUICK IMPORT STATE ---
  showQuickImport = signal(false);
  quickImportState = signal<{id: string, name: string, unit: string, currentStock: number, missingAmount: number}>({
      id: '', name: '', unit: '', currentStock: 0, missingAmount: 0
  });
  quickImportInput = 0;

  // --- COMPUTED: GENERAL ---
  activeSops = computed(() => this.state.sops().filter(s => !s.isArchived));
  allAvailableTargets = computed(() => { const targets = new Map<string, {id: string, name: string, uniqueKey: string}>(); this.state.sops().forEach(sop => { if (sop.targets) { sop.targets.forEach(t => { if (t.name) { const canonical = getCanonicalId(t.name); if (!targets.has(canonical)) targets.set(canonical, { id: canonical, name: t.name, uniqueKey: canonical }); } }); } }); return Array.from(targets.values()).sort((a,b) => a.name.localeCompare(b.name)); });

  // COMPUTED MAPS: Thay thế getFilteredTargets() và getEligibleSops() method calls trong template
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

  eligibleSopsMap = computed(() => {
    const map = new Map<number, Sop[]>();
    const active = this.activeSops();
    for (const block of this.blocks()) {
      if (block.selectedTargets.size === 0) { map.set(block.id, []); continue; }
      const reqTargets = Array.from(block.selectedTargets);
      map.set(block.id, active.filter(sop => {
        if (!sop.targets) return false;
        const ids = new Set(sop.targets.map(t => getCanonicalId(t.name)));
        return reqTargets.every(id => ids.has(id));
      }));
    }
    return map;
  });

  totalUniqueSamples = computed(() => { const allSamples = new Set<string>(); this.blocks().forEach(b => { const samples = b.rawSamples.split('\n').map(s => s.trim()).filter(s => s); samples.forEach(s => allSamples.add(s)); }); return allSamples.size; });
  

  totalUniqueTargets = computed(() => { const allTargets = new Set<string>(); this.blocks().forEach(b => { b.selectedTargets.forEach(t => allTargets.add(t)); }); return allTargets.size; });
  
  hasCriticalMissing = computed(() => this.batches().some(b => b.status === 'missing_stock'));
  
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
          const samples = block.rawSamples.split('\n').map(s => s.trim()).filter(s => s);
          samples.forEach(s => {
              block.selectedTargets.forEach(tId => {
                  neededTasks.add(`${s}|${tId}`);
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
                  const key = `${t.sample}|${t.targetId}`;
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
                      const key = `${s}|${tId}`;
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

  // --- COMPUTED: SPLIT WIZARD LOGIC ---
  filteredSopsForSplit = computed(() => {
      const s = this.splitState();
      // Only active in Step 3
      if (s.step !== 3) return [];

      const allSops = this.state.sops().filter(sop => !sop.isArchived);
      const reqTargets = s.selectedTargets;

      if (reqTargets.size === 0) return []; // Should not happen due to validation

      // Filter Logic: SOP must cover ALL selected targets (100% match of requirement)
      // Note: SOP can do *more* targets, but must cover *at least* the requested ones.
      return allSops.filter(sop => {
          if (!sop.targets) return false;
          const sopTargetIds = new Set(sop.targets.map(t => getCanonicalId(t.name)));
          
          for (const reqId of Array.from(reqTargets)) {
              if (!sopTargetIds.has(reqId)) return false; // Missing one -> Invalid
          }
          return true;
      });
  });

  // --- METHODS ---

  getFullSampleString(samples: Set<string>): string {
      return Array.from(samples).sort().join(', ');
  }

  // ... Block management helpers ...
  addBlock() {
      this.blocks.update(b => [...b, { id: Date.now(), name: `Nhóm Mẫu #${b.length + 1}`, rawSamples: '', selectedTargets: new Set<string>(), targetSearch: '', isCollapsed: false, forcedSopId: undefined }]);
  }
  removeBlock(index: number) { this.blocks.update(b => b.filter((_, i) => i !== index)); }
  duplicateBlock(index: number) {
      const src = this.blocks()[index];
      const newBlock = { ...src, id: Date.now(), name: src.name + ' (Copy)', selectedTargets: new Set(src.selectedTargets) };
      this.blocks.update(b => { const n = [...b]; n.splice(index + 1, 0, newBlock); return n; });
  }
  toggleBlockCollapse(index: number) { 
      this.blocks.update(b => { const n = [...b]; n[index] = { ...n[index], isCollapsed: !n[index].isCollapsed }; return n; }); 
  }
  updateBlockName(index: number, val: string) { this.blocks.update(b => { const n = [...b]; n[index] = { ...n[index], name: val }; return n; }); }
  updateBlockSamples(index: number, val: string) { this.blocks.update(b => { const n = [...b]; n[index] = { ...n[index], rawSamples: val }; return n; }); }
  updateBlockSearch(index: number, val: string) { this.blocks.update(b => { const n = [...b]; n[index] = { ...n[index], targetSearch: val }; return n; }); }
  updateBlockForcedSop(index: number, sopId: string | undefined) {
      this.blocks.update(b => {
          const n = [...b]; 
          n[index] = { ...n[index], forcedSopId: sopId };
          return n;
      });
  }

  getEligibleSops(block: JobBlock): Sop[] {
      if (block.selectedTargets.size === 0) return [];
      const requiredTargets = Array.from(block.selectedTargets);
      return this.activeSops().filter(sop => {
          if (!sop.targets) return false;
          const sopTargetIds = new Set(sop.targets.map(t => getCanonicalId(t.name)));
          return requiredTargets.every(reqId => sopTargetIds.has(reqId));
      });
  }
  
  countSamples(raw: string): number { return raw.split('\n').filter(s => s.trim()).length; }
  
  getFilteredTargets(block: JobBlock) {
      const term = block.targetSearch.toLowerCase().trim();
      const all = this.allAvailableTargets();
      if (!term) return all;
      return all.filter(t => t.name.toLowerCase().includes(term) || t.id.toLowerCase().includes(term));
  }
  
  toggleBlockTarget(index: number, targetId: string) {
      this.blocks.update(b => {
          const n = [...b]; const set = new Set(n[index].selectedTargets);
          if (set.has(targetId)) set.delete(targetId); else set.add(targetId);
          n[index] = { ...n[index], selectedTargets: set, forcedSopId: undefined }; // Reset forced SOP on change
          return n;
      });
  }
  selectAllTargets(index: number) {
      this.blocks.update(b => {
          const n = [...b]; const filtered = this.getFilteredTargets(n[index]);
          const set = new Set(n[index].selectedTargets);
          filtered.forEach(t => set.add(t.uniqueKey));
          n[index] = { ...n[index], selectedTargets: set, forcedSopId: undefined }; return n;
      });
  }
  deselectAllTargets(index: number) {
      this.blocks.update(b => { const n = [...b]; n[index] = { ...n[index], selectedTargets: new Set(), forcedSopId: undefined }; return n; });
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
      if (idx >= 0) {
          this.blocks.update(b => {
              const n = [...b]; const set = new Set(n[idx].selectedTargets);
              g.targets.forEach(t => set.add(t.id));
              n[idx] = { ...n[idx], selectedTargets: set, forcedSopId: undefined }; return n;
          });
          this.toast.show(`Đã thêm ${g.targets.length} chỉ tiêu.`, 'success');
      }
      this.showGroupModal.set(false);
  }

  // --- REWRITTEN: TARGET-CENTRIC GREEDY ALGORITHM (WEIGHTED) ---
  async analyzePlan() {
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

          // 2. Flatten User Request & Handle Forced SOPs
          const allTasks: AnalysisTask[] = [];
          
          for (const block of this.blocks()) {
              const samples = block.rawSamples.split('\n').map(s => s.trim()).filter(s => s);
              if (samples.length === 0 || block.selectedTargets.size === 0) continue;
              
              if (block.forcedSopId) {
                  const forcedSop = sops.find(s => s.id === block.forcedSopId);
                  if (forcedSop) {
                      const blockSamples = new Set(samples);
                      const blockTargetIds = new Set(block.selectedTargets);
                      const batchTargets = (forcedSop.targets || []).filter(t => blockTargetIds.has(getCanonicalId(t.name)));
                      const validSopTargets = new Set(batchTargets.map(t => getCanonicalId(t.name)));
                      
                      const blockTasks: AnalysisTask[] = [];
                      for (const sample of samples) {
                          for (const targetId of block.selectedTargets) {
                              const tName = this.allAvailableTargets().find(t => t.id === targetId)?.name || targetId;
                              // Only mark 'covered: true' if the SOP ACTUALLY supports it
                              const isCovered = validSopTargets.has(targetId);
                              blockTasks.push({ sample, targetId, targetName: tName, covered: isCovered });
                              // If not covered, we still add it to allTasks so greedy algorithm can handle it
                              if (!isCovered) {
                                  allTasks.push({ sample, targetId, targetName: tName, covered: false });
                              }
                          }
                      }
                      
                      const inputs: Record<string, any> = {};
                      forcedSop.inputs.forEach(i => inputs[i.var] = i.default);
                      inputs['n_sample'] = blockSamples.size;

                      const needs = this.calculator.calculateSopNeeds(
                          forcedSop, inputs, -1, this.inventoryCache, this.recipeCache, this.state.safetyConfig()
                      );

                      const batchId = `batch_${Date.now()}_${batches.length}`;
                      batches.push({
                          id: batchId,
                          name: forcedSop.name + ' (Chỉ định)',
                          sop: forcedSop,
                          targets: batchTargets,
                          samples: blockSamples,
                          sampleCount: blockSamples.size,
                          tasks: blockTasks,
                          inputValues: inputs,
                          safetyMargin: -1,
                          resourceImpact: needs,
                          status: 'ready',
                          tags: ['Forced-SOP'],
                          isExpanded: false
                      });
                      
                      continue; // Skip adding to allTasks for greedy
                  }
              }
              
              for (const sample of samples) {
                  for (const targetId of block.selectedTargets) {
                      const tName = this.allAvailableTargets().find(t => t.id === targetId)?.name || targetId;
                      allTasks.push({
                          sample,
                          targetId,
                          targetName: tName,
                          covered: false
                      });
                  }
              }
          }

          // 3. Greedy Loop with Weighted Scoring (Only on unforced tasks)
          let remainingTasks = allTasks.filter(t => !t.covered);
          let iterationLimit = 0;
          const MAX_ITERATIONS = 50;

          while (remainingTasks.length > 0 && iterationLimit < MAX_ITERATIONS) {
              iterationLimit++;

              const candidates = sops.map(sop => {
                  if (!sop.targets || sop.targets.length === 0) return null;
                  const sopTargetIds = new Set(sop.targets.map(t => getCanonicalId(t.name)));
                  
                  // Filter tasks that this SOP can cover
                  const coverableTasks = remainingTasks.filter(t => sopTargetIds.has(t.targetId));
                  if (coverableTasks.length === 0) return null;

                  // --- WEIGHTED SCORING SYSTEM ---
                  let score = 0;

                  // 1. Coverage Score (+10 per task)
                  score += coverableTasks.length * 10;

                  // 2. Completeness Bonus (+5 per sample fully covered)
                  // Reward if this SOP clears ALL remaining targets for a specific sample
                  const involvedSamples = new Set(coverableTasks.map(t => t.sample));
                  involvedSamples.forEach(s => {
                      const tasksForSample = remainingTasks.filter(t => t.sample === s);
                      const coveredForSample = coverableTasks.filter(t => t.sample === s);
                      if (tasksForSample.length === coveredForSample.length) {
                          score += 5; 
                      }
                  });

                  // 3. Stock Penalty (-20 per missing item)
                  let missingStockCount = 0;
                  sop.consumables.forEach(c => {
                      if (c.type === 'simple' && !this.inventoryCache[c.name]) missingStockCount++;
                  });
                  score -= (missingStockCount * 20);

                  // 4. Efficiency Penalty (-1 per extraneous capability)
                  // If SOP covers 50 targets but we only need 1, it's wasteful (maybe)
                  const extraneous = sop.targets.length - new Set(coverableTasks.map(t => t.targetId)).size;
                  score -= (extraneous * 1);

                  return { sop, coverableTasks, score };
              }).filter(c => c !== null);

              if (candidates.length === 0) break;

              // Pick Winner
              candidates.sort((a, b) => b!.score - a!.score);
              const bestFit = candidates[0]!;

              // Construct Batch
              const batchSamples = new Set(bestFit.coverableTasks.map(t => t.sample));
              const batchTargetIds = new Set(bestFit.coverableTasks.map(t => t.targetId));
              // Only include targets relevant to the tasks being covered
              const batchTargets = (bestFit.sop.targets || []).filter(t => batchTargetIds.has(getCanonicalId(t.name)));

              // Calculate Resources
              const inputs: Record<string, any> = {};
              bestFit.sop.inputs.forEach(i => inputs[i.var] = i.default);
              inputs['n_sample'] = batchSamples.size;

              const needs = this.calculator.calculateSopNeeds(
                  bestFit.sop, inputs, -1, this.inventoryCache, this.recipeCache, this.state.safetyConfig()
              );

              const batchId = `batch_${Date.now()}_${batches.length}`;
              
              batches.push({
                  id: batchId,
                  name: bestFit.sop.name,
                  sop: bestFit.sop,
                  targets: batchTargets,
                  samples: batchSamples,
                  sampleCount: batchSamples.size,
                  tasks: bestFit.coverableTasks, // Save granular task info for future splits
                  inputValues: inputs,
                  safetyMargin: -1, // Auto
                  resourceImpact: needs,
                  status: 'ready',
                  tags: ['Auto-Optimized'],
                  isExpanded: false // Collapsed by default
              });

              // Mark tasks as covered
              const coveredSet = new Set(bestFit.coverableTasks); 
              remainingTasks = remainingTasks.filter(t => !coveredSet.has(t));
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
          resourceImpact: needs
      };
  }

  // Execute
  async executeSplit() {
      const state = this.splitState();
      if (!state.selectedSopId) return;

      const sourceBatch = this.batches()[state.sourceBatchIndex];
      const targetSop = this.state.sops().find(s => s.id === state.selectedSopId);
      
      if (!targetSop) return;

      // 1. Identify TASKS to Move (Intersection of Selected Samples & Selected Targets)
      // Logic: Move specific AnalysisTasks. If Sample L01 is selected, and Target A is selected, move (L01, A).
      // Keep (L01, B) in old batch if B wasn't selected.
      
      const tasksToMove: AnalysisTask[] = [];
      const tasksToKeep: AnalysisTask[] = [];

      // Convert selectedTargets (which are SopTarget.id) to canonical IDs for matching with tasks
      const selectedCanonicalIds = new Set(
          Array.from(state.selectedTargets).map(id => {
              const t = sourceBatch.targets.find(x => x.id === id);
              return t ? getCanonicalId(t.name) : id;
          })
      );

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

      // 2. Create New Batch
      // Metadata calculation for new batch
      const uniqueSamplesNew = new Set(tasksToMove.map(t => t.sample));
      const uniqueTargetIdsNew = new Set(tasksToMove.map(t => t.targetId));
      const newBatchTargets = (targetSop.targets || []).filter(t => uniqueTargetIdsNew.has(t.id));
      
      const newInputs: Record<string, any> = {};
      targetSop.inputs.forEach(i => newInputs[i.var] = i.default);
      Object.keys(newInputs).forEach(k => {
          if (sourceBatch.inputValues[k] !== undefined) newInputs[k] = sourceBatch.inputValues[k];
      });
      newInputs['n_sample'] = uniqueSamplesNew.size;

      const newNeeds = this.calculator.calculateSopNeeds(targetSop, newInputs, sourceBatch.safetyMargin, this.inventoryCache, this.recipeCache, this.state.safetyConfig());

      const newBatch: ProposedBatch = {
          id: `batch_split_${Date.now()}_${Math.floor(Math.random()*1000)}`,
          name: targetSop.name + ' (Tách)',
          sop: targetSop,
          targets: newBatchTargets,
          samples: uniqueSamplesNew,
          sampleCount: uniqueSamplesNew.size,
          tasks: tasksToMove,
          inputValues: newInputs,
          safetyMargin: sourceBatch.safetyMargin,
          resourceImpact: newNeeds,
          status: 'ready',
          isExpanded: false
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
      this.batches.update(current => {
          const next = [...current];
          const batch = next[batchIndex];
          if (!batch) return next;

          const tasksToKeep = batch.tasks.filter(t => t.targetId !== targetId);

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
          await this.invService.updateStock(state.id, state.currentStock, amount, 'Bù hàng (Smart Batch)');
          
          // Update Local Cache to reflect new stock immediately
          const newItem = { ...this.inventoryCache[state.id] };
          if (!newItem.id) {
              // Handle case where item didn't exist in cache (phantom item) - Reload
              const freshItem = (await this.invService.getItemsByIds([state.id]))[0];
              if (freshItem) this.inventoryCache[state.id] = freshItem;
          } else {
              newItem.stock += amount;
              this.inventoryCache[state.id] = newItem;
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

  // --- Auto-Fix Logic (Simple Re-run) ---
  fixCoverage() {
      // In a complex system, this would identify exactly what is missing and run a targeted greedy search.
      // For now, we will simply reset and let the user re-analyze, as the greedy algorithm is deterministic and fast.
      // OR better: Just show a toast guiding them.
      this.toast.show('Đang tính toán lại để phủ kín các mẫu còn thiếu...', 'info');
      // To implement true "Partial Re-run", we would need to pass `missingTasks` to analyzePlan. 
      // Current implementation clears existing batches on analyzePlan. 
      // We will leave the "Fix" button as a visual cue or trigger a Reset -> Re-Analyze flow for now.
      this.step.set(1); // Go back to config to let them add/adjust blocks.
  }

  reset() { this.step.set(1); this.batches.set([]); this.unmappedTasks.set([]); }

  async executeAll() {
      if (!this.auth.canApprove()) {
          this.toast.show('Bạn không có quyền duyệt.', 'error');
          return;
      }
      this.validateGlobalStock();
      if (this.hasCriticalMissing()) {
          this.toast.show('Kho không đủ đáp ứng. Vui lòng kiểm tra lại.', 'error');
          return;
      }
      
      if (await this.confirmation.confirm({ message: `Xác nhận tạo ${this.batches().length} phiếu yêu cầu và trừ kho ngay lập tức?`, confirmText: 'Duyệt & Xem Phiếu' })) {
          this.isProcessing.set(true);
          const inventoryMap = this.state.inventoryMap();
          const jobs: PrintJob[] = [];
          
          try {
              for (const batch of this.batches()) {
                  const todayStr = new Date().toISOString().split('T')[0];
                  
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
                      analysisDate: batch.inputValues['analysisDate'] || todayStr
                  };
                  const res = await this.state.directApproveAndPrint(batch.sop, batch.resourceImpact, finalInputs, inventoryMap);
                  if (res) {
                      jobs.push({
                          sop: batch.sop, inputs: finalInputs, margin: batch.safetyMargin, items: batch.resourceImpact,
                          date: new Date(), user: this.state.getCurrentUserName(), requestId: res.logId
                      });
                  }
              }
              
                  if (jobs.length > 0) {
                  this.printService.openPreview(jobs);
                  this.toast.show('Hoàn tất! Đang mở xem trước.', 'success');
                  this.reset();
                  this.blocks.set([{ id: Date.now(), name: 'Nhóm Mẫu #1', rawSamples: '', selectedTargets: new Set<string>(), targetSearch: '', isCollapsed: false, forcedSopId: undefined }]);
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
