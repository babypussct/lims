
import { Component, inject, input, output, effect, signal, computed, OnDestroy, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router'; 
import { StateService } from '../../../core/services/state.service';
import { AuthService } from '../../../core/services/auth.service';
import { InventoryService } from '../../inventory/inventory.service';
import { RecipeService } from '../../recipes/recipe.service';
import { SopService } from '../services/sop.service'; 
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { PrintService, PrintJob } from '../../../core/services/print.service';
import { Sop, CalculatedItem, CalculatedIngredient, TargetGroup } from '../../../core/models/sop.model';
import { InventoryItem } from '../../../core/models/inventory.model';
import { Recipe } from '../../../core/models/recipe.model';
import { Request } from '../../../core/models/request.model';
import { CalculatorService } from '../../../core/services/calculator.service';
import { formatNum, cleanName, generateSlug, formatDate, naturalCompare } from '../../../shared/utils/utils';
import { startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { RecipeManagerComponent } from '../../recipes/recipe-manager.component';
import { QuickGenerateSampleModalComponent } from '../../../shared/components/quick-generate-sample-modal/quick-generate-sample-modal.component';
import { GHS_DICTIONARY } from '../../../core/services/pubchem.service';
import { HasPermissionDirective } from '../../../shared/directives/has-permission.directive';
import { TargetService } from '../../targets/target.service';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RecipeManagerComponent, QuickGenerateSampleModalComponent, HasPermissionDirective],
  templateUrl: './calculator.component.html'
})
export class CalculatorComponent implements OnDestroy {
  sopInput = input<Sop | null>(null, { alias: 'sop' }); 
  get GHS_DICT() { return GHS_DICTIONARY; }
  
  canViewRecipes() { return this.auth.canViewRecipes(); }
  canEditSop() { return this.auth.canEditSop(); }
  private fb: FormBuilder = inject(FormBuilder);
  public state = inject(StateService);
  private auth = inject(AuthService);
  private invService = inject(InventoryService); 
  private recipeService = inject(RecipeService);
  private calcService = inject(CalculatorService);
  private sopService = inject(SopService);
  private targetService = inject(TargetService);
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private toast = inject(ToastService);
  private confirmation = inject(ConfirmationService);
  private printService = inject(PrintService);
  
  activeSop = computed(() => this.sopInput() || this.state.selectedSop());
  libraryTab = signal<'sops' | 'recipes'>('sops');
  searchTerm = signal('');
  activeMenuSopId = signal<string | null>(null);
  isProcessing = signal(false);
  private currentFormSopId: string | null = null;
  localInventoryMap = signal<Record<string, InventoryItem>>({});
  localRecipeMap = signal<Record<string, Recipe>>({});
  isLoadingInventory = signal(false);
  sampleListText = signal('');
  sampleCount = signal(0);
  selectedTargets = signal<Set<string>>(new Set());
  targetsOpen = signal(false);
  targetSearchTerm = signal('');
  targetGroups = signal<TargetGroup[]>([]);
  selectedTargetGroupId = signal<string | null>(null);
  targetSelectionModified = signal(false);
  
  // Custom Visual Selection Matrix State
  customSampleTargetMap = signal<Record<string, Set<string>>>({});
  isMatrixCustomized = signal<boolean>(false);
  matrixOpen = signal<boolean>(false);
  
  // Quick Generate Modal State
  quickGenerateModalOpen = signal(false);
  
  // Edit Request State
  editingRequest = signal<Request | null>(null);
  
  // SAFETY MARGIN MODE: 'auto' means use Config (-1), 'manual' uses explicit number
  marginMode = signal<'auto' | 'manual'>('auto');

  filteredSops = computed(() => {
      const term = this.searchTerm().toLowerCase();
      const allSops = this.state.sops().filter(s => !s.isArchived);
      const filtered = allSops.filter(s => s.name.toLowerCase().includes(term) || s.category.toLowerCase().includes(term));
      return filtered.sort((a, b) => {
          const catCompare = naturalCompare((a.category || '').toLowerCase(), (b.category || '').toLowerCase());
          if (catCompare !== 0) return catCompare;
          return naturalCompare(a.name, b.name);
      });
  });

  filteredTargets = computed(() => {
      const sop = this.activeSop();
      if (!sop || !sop.targets) return [];
      const term = this.targetSearchTerm().toLowerCase();
      if (!term) return sop.targets;
      return sop.targets.filter(t => t.name.toLowerCase().includes(term) || t.id.toLowerCase().includes(term));
  });

  getSelectedTargetsList = computed(() => {
      const sop = this.activeSop();
      if (!sop || !sop.targets) return [];
      const selected = this.selectedTargets();
      return sop.targets.filter(t => selected.has(t.id));
  });

  samplesList = computed(() => {
      const val = this.sampleListText();
      return val.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  });

  isTargetCheckedForSample(sample: string, targetId: string): boolean {
      const map = this.customSampleTargetMap();
      return map[sample]?.has(targetId) || false;
  }

  toggleMatrixCell(sample: string, targetId: string) {
      this.isMatrixCustomized.set(true);
      this.targetSelectionModified.set(true);
      this.customSampleTargetMap.update(map => {
          const next = { ...map };
          const set = next[sample] ? new Set(next[sample]) : new Set<string>();
          if (set.has(targetId)) {
              set.delete(targetId);
          } else {
              set.add(targetId);
          }
          next[sample] = set;
          return next;
      });
      // Re-run calculations
      this.runCalculation(this.activeSop()!, this.form().value);
  }

  resetMatrix() {
      this.isMatrixCustomized.set(false);
      this.syncMatrixWithGlobals();
  }

  syncMatrixWithGlobals() {
      const samples = this.samplesList();
      const globalTargets = this.selectedTargets();
      const map: Record<string, Set<string>> = {};
      samples.forEach(sample => {
          map[sample] = new Set(globalTargets);
      });
      this.customSampleTargetMap.set(map);
      // Re-run calculations
      if (this.activeSop()) {
          this.runCalculation(this.activeSop()!, this.form().value);
      }
  }

  form = signal<FormGroup>(this.fb.group({
    safetyMargin: [10],
    analysisDate: [this.getTodayDate(), Validators.required]
  }));
  private formValueSub?: Subscription;
  calculatedItems = signal<CalculatedItem[]>([]);
  aggregateGHSWarnings = computed(() => {
     const items = this.calculatedItems();
     const warnings = new Set<string>();
     
     const addWarnings = (item: any) => {
         if (item.ghsWarnings) {
             item.ghsWarnings.forEach((w: string) => warnings.add(w));
         }
     };

     for (const item of items) {
         if (item.isComposite && item.breakdown) {
             item.breakdown.forEach((sub: any) => addWarnings(sub));
         } else {
             addWarnings(item);
         }
     }
     return Array.from(warnings).sort();
  });
  safetyMargin = signal<number>(10);
  formatNum = formatNum;
  formatDate = formatDate;

  editRequestIdSignal = signal<string | null>(null);

  constructor() {
    this.targetService.getAllGroups().then(groups => this.targetGroups.set(groups));

    this.route.queryParams.subscribe(params => {
        this.editRequestIdSignal.set(params['editRequestId'] || null);
    });

    effect(() => {
        const editId = this.editRequestIdSignal();
        if (editId) {
            const reqs = this.state.approvedRequests();
            if (reqs.length > 0) { // Wait until loaded
                const req = reqs.find(r => r.id === editId);
                if (req) {
                    if (this.editingRequest()?.id !== req.id) {
                        this.editingRequest.set(req);
                        const sop = this.state.sops().find(s => s.id === req.sopId);
                        if (sop) {
                            this.currentFormSopId = null; // Force form re-init
                            this.state.selectedSop.set(sop);
                        } else {
                            this.toast.show('Không tìm thấy SOP của phiếu này.', 'error');
                        }
                    }
                } else {
                    if (this.editingRequest() !== null) {
                        this.editingRequest.set(null);
                        this.toast.show('Không tìm thấy phiếu yêu cầu.', 'error');
                    }
                }
            }
        } else {
            if (this.editingRequest() !== null) {
                this.editingRequest.set(null);
            }
        }
    }, { allowSignalWrites: true });

    effect(() => {
      const s = this.activeSop();
      if (s) {
        if (s.id === this.currentFormSopId) return;
        this.currentFormSopId = s.id;
        this.formValueSub?.unsubscribe();
        const controls: Record<string, any> = {
          safetyMargin: [10],
          analysisDate: [this.getTodayDate(), Validators.required]
        };
        s.inputs.forEach(i => {
          if (i.var !== 'safetyMargin' && i.var !== 'analysisDate') {
            controls[i.var] = [i.default !== undefined ? i.default : 0];
          }
        });
        const newForm = this.fb.group(controls);
        
        const cached = this.state.cachedCalculatorState();
        const editingReq = this.editingRequest();
        
        if (editingReq && editingReq.sopId === s.id) {
            // Patch from request
            const patchData: any = {};
            if (editingReq.inputs) {
                Object.keys(editingReq.inputs).forEach(key => {
                    if (newForm.contains(key)) {
                        patchData[key] = editingReq.inputs[key];
                    }
                });
            }
            if (editingReq.margin !== undefined && editingReq.margin !== -1) {
                this.marginMode.set('manual');
                if (newForm.contains('safetyMargin')) {
                    patchData['safetyMargin'] = editingReq.margin;
                }
            } else {
                this.marginMode.set('auto');
            }
            if (editingReq.analysisDate && newForm.contains('analysisDate')) {
                patchData['analysisDate'] = editingReq.analysisDate;
            }
            newForm.patchValue(patchData);
            
            if (editingReq.sampleList) {
                const samplesStr = editingReq.sampleList.join('\n');
                this.sampleListText.set(samplesStr);
                this.sampleCount.set(editingReq.sampleList.length);
                if (newForm.contains('n_sample') && editingReq.sampleList.length > 0) {
                    newForm.patchValue({ n_sample: editingReq.sampleList.length });
                }
            } else {
                this.sampleListText.set('');
                this.sampleCount.set(0);
            }
            
            if (editingReq.targetIds) {
                this.selectedTargets.set(new Set(editingReq.targetIds));
            } else {
                this.selectedTargets.set(new Set());
            }
            const storedGroup = editingReq.targetScopeSnapshots?.find(scope => scope.kind === 'target-group' && scope.sourceId);
            this.selectedTargetGroupId.set(storedGroup?.sourceId || null);
            this.targetSelectionModified.set(!storedGroup);

            if (editingReq.sampleTargetMap) {
                const map: Record<string, Set<string>> = {};
                Object.entries(editingReq.sampleTargetMap).forEach(([sample, targets]) => {
                    map[sample] = new Set(targets);
                });
                this.customSampleTargetMap.set(map);
                this.isMatrixCustomized.set(true);
            } else {
                // Initialize default map matching globals
                const map: Record<string, Set<string>> = {};
                const tIds = editingReq.targetIds || [];
                (editingReq.sampleList || []).forEach(sample => {
                    map[sample] = new Set(tIds);
                });
                this.customSampleTargetMap.set(map);
                this.isMatrixCustomized.set(false);
            }
        } else {
            if (cached && cached.sopId === s.id) { 
                newForm.patchValue(cached.formValues); 
            }
            this.sampleListText.set('');
            this.sampleCount.set(0);
            this.selectedTargets.set(new Set());
            this.customSampleTargetMap.set({});
            this.isMatrixCustomized.set(false);
            this.selectedTargetGroupId.set(null);
            this.targetSelectionModified.set(false);
            this.marginMode.set('auto');
        }
        
        this.form.set(newForm);
        this.localInventoryMap.set({}); this.localRecipeMap.set({});
        this.targetsOpen.set(false);
        this.targetSearchTerm.set('');
        
        this.runCalculation(s, newForm.value);
        this.fetchData(s);
        this.formValueSub = newForm.valueChanges.pipe(startWith(newForm.value), debounceTime(50)).subscribe(vals => {
             this.runCalculation(s, vals);
             const margin = Number(vals['safetyMargin']);
             this.safetyMargin.set(isNaN(margin) ? 0 : margin);
        });
      } else {
         this.currentFormSopId = null; this.calculatedItems.set([]); this.localInventoryMap.set({});
      }
    }, { allowSignalWrites: true });
  }
  
  ngOnDestroy(): void { this.formValueSub?.unsubscribe(); }
  getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  setMarginMode(mode: 'auto' | 'manual') {
      this.marginMode.set(mode);
      if (mode === 'manual') {
          // If switching to manual, default to 10 if not set
          const current = this.form().get('safetyMargin')?.value;
          if (!current) this.form().patchValue({ safetyMargin: 10 });
      }
      // Re-trigger calc
      this.runCalculation(this.activeSop()!, this.form().value);
  }

  onSampleListChange(val: string) {
      this.sampleListText.set(val);
      const lines = val.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      this.sampleCount.set(lines.length);
      if (this.form().contains('n_sample') && lines.length > 0) {
          this.form().patchValue({ n_sample: lines.length });
      }

      // Sync customSampleTargetMap
      if (!this.isMatrixCustomized()) {
          this.syncMatrixWithGlobals();
      } else {
          // Matrix has customizations: keep existing ones, add new ones with globals, remove old ones
          this.customSampleTargetMap.update(map => {
              const next: Record<string, Set<string>> = {};
              const globalTargets = this.selectedTargets();
              lines.forEach(sample => {
                  if (map[sample]) {
                      next[sample] = map[sample];
                  } else {
                      next[sample] = new Set(globalTargets);
                  }
              });
              return next;
          });
          // Re-run calculations since custom targets affect chemical needs
          this.runCalculation(this.activeSop()!, this.form().value);
      }
  }

  toggleTarget(id: string) {
      this.targetSelectionModified.set(true);
      this.selectedTargets.update(s => { 
          const n = new Set(s); 
          if (n.has(id)) {
              n.delete(id); 
              // Delete from all samples' sets in the matrix
              this.customSampleTargetMap.update(map => {
                  const next = { ...map };
                  Object.keys(next).forEach(sample => {
                      const set = new Set(next[sample]);
                      set.delete(id);
                      next[sample] = set;
                  });
                  return next;
              });
          } else {
              n.add(id); 
              // Add to all samples' sets in the matrix
              this.customSampleTargetMap.update(map => {
                  const next = { ...map };
                  Object.keys(next).forEach(sample => {
                      const set = new Set(next[sample]);
                      set.add(id);
                      next[sample] = set;
                  });
                  return next;
              });
          }
          return n; 
      });
  }

  isAllSelected(allTargets: any[]): boolean {
      if (!allTargets || allTargets.length === 0) return false;
      return this.selectedTargets().size === allTargets.length;
  }

  toggleAllTargets(allTargets: any[]) {
      this.targetSelectionModified.set(true);
      if (this.isAllSelected(allTargets)) { 
          this.selectedTargets.set(new Set()); 
          // Clear all targets from all samples in matrix
          this.customSampleTargetMap.update(map => {
              const next = { ...map };
              Object.keys(next).forEach(sample => {
                  next[sample] = new Set<string>();
              });
              return next;
          });
      } else { 
          const allIds = allTargets.map(t => t.id);
          this.selectedTargets.set(new Set(allIds)); 
          // Set all targets for all samples in matrix
          this.customSampleTargetMap.update(map => {
              const next = { ...map };
              Object.keys(next).forEach(sample => {
                  next[sample] = new Set<string>(allIds);
              });
              return next;
          });
      }
  }

  applyTargetGroup(groupId: string) {
      if (!groupId) return;
      const group = this.targetGroups().find(g => g.id === groupId);
      if (!group) return;
      
      const sop = this.activeSop();
      if (!sop || !sop.targets) return;

      const groupTargetIds = new Set(group.targets.map(t => t.id));
      const validIdsToSelect = sop.targets.filter(t => groupTargetIds.has(t.id)).map(t => t.id);
      
      this.selectedTargets.set(new Set(validIdsToSelect));
      this.selectedTargetGroupId.set(group.id);
      this.targetSelectionModified.set(false);
      
      this.customSampleTargetMap.update(map => {
          const next = { ...map };
          Object.keys(next).forEach(sample => {
              next[sample] = new Set<string>(validIdsToSelect);
          });
          return next;
      });
  }

  getPayloadData() {
      const rawSamples = this.sampleListText();
      const sampleList = rawSamples.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      const values = this.form().value;
      
      // Override margin if Auto
      const finalMargin = this.marginMode() === 'auto' ? -1 : (values.safetyMargin || 0);
      
      const targetIds = Array.from(this.selectedTargets());
      const sampleTargetMap: Record<string, string[]> = {};
      const currentMap = this.customSampleTargetMap();
      sampleList.forEach(sample => {
          sampleTargetMap[sample] = currentMap[sample] ? Array.from(currentMap[sample]) : targetIds;
      });
      
      return { 
          ...values, 
          safetyMargin: finalMargin, 
          sampleList: sampleList, 
          targetIds: targetIds,
          sampleTargetMap: sampleTargetMap,
          explicitGroupId: this.targetSelectionModified() ? undefined : this.selectedTargetGroupId() || undefined
      };
  }

  async fetchData(sop: Sop) {
      this.isLoadingInventory.set(true);
      const neededInvIds = new Set<string>(); const neededRecipeIds = new Set<string>();
      sop.consumables.forEach(c => {
          if (c.type === 'shared_recipe' && c.recipeId) neededRecipeIds.add(c.recipeId);
          else if (c.type === 'simple' && c.name) neededInvIds.add(c.name);
          else if (c.type === 'composite' && c.ingredients) c.ingredients.forEach(i => neededInvIds.add(i.name));
      });
      try {
          const recipes = await this.recipeService.getRecipesByIds(Array.from(neededRecipeIds));
          const recMap: Record<string, Recipe> = {};
          recipes.forEach(r => { recMap[r.id] = r; r.ingredients.forEach(i => neededInvIds.add(i.name)); });
          const items = await this.invService.getItemsByIds(Array.from(neededInvIds));
          const invMap: Record<string, InventoryItem> = {};
          items.forEach(i => invMap[i.id] = i);
          if (this.activeSop()?.id !== sop.id) return;
          this.localRecipeMap.set(recMap);
          this.localInventoryMap.set(invMap); 
          this.runCalculation(sop, this.form().value);
      } catch(e) { console.warn("Fetch warning:", e); } finally { this.isLoadingInventory.set(false); }
  }

  resolveName(item: CalculatedItem | CalculatedIngredient): string { return item.displayName || item.name; }

  runCalculation(sop: Sop, values: any) {
     try {
         const safeValues = (values || {}) as Record<string, any>;
         
         // DETERMINE MARGIN
         let margin = 0;
         if (this.marginMode() === 'auto') {
             margin = -1; // Flag for Auto
         } else {
             margin = Number(safeValues['safetyMargin'] || 0);
             if (isNaN(margin)) margin = 0;
         }

         const results = this.calcService.calculateSopNeeds(
             sop, 
             safeValues, 
             margin, 
             this.localInventoryMap(), 
             this.localRecipeMap(),
             this.state.safetyConfig() // Pass config
         );
         this.calculatedItems.set(results);
     } catch(e) { console.error("Calculation Error", e); }
  }

  // ... (Other standard methods: toggleMenu, selectSop, createNew, editDirect, softDeleteSop, duplicateSop, exportSop, importSop) ...
  // Methods to reduce boilerplate in XML are omitted but assumed present as in original file, only changed methods shown below.
  
  toggleMenu(id: string, event: Event) { event.stopPropagation(); if (this.activeMenuSopId() === id) this.activeMenuSopId.set(null); else this.activeMenuSopId.set(id); }
  closeMenu() { this.activeMenuSopId.set(null); }
  selectSop(s: Sop) { this.state.selectedSop.set(s); }
  clearSelection() { 
      this.state.selectedSop.set(null); 
      this.state.cachedCalculatorState.set(null); 
      this.currentFormSopId = null; 
      if (this.editingRequest()) {
          this.router.navigate(['/calculator']);
      }
  }
  createNew() { this.state.editingSop.set(null); this.router.navigate(['/editor']); }
  editDirect(sop: Sop, event: Event) { event.stopPropagation(); this.closeMenu(); this.state.editingSop.set(sop); this.router.navigate(['/editor']); }
  
  async softDeleteSop(sop: Sop, event: Event) {
      event.stopPropagation();
      if (await this.confirmation.confirm({ 
          message: `Xóa quy trình "${sop.name}"?\nHành động này không thể hoàn tác.`, 
          confirmText: 'Xóa vĩnh viễn', 
          isDangerous: true 
      })) {
          try {
              await this.sopService.deleteSop(sop.id);
              this.toast.show('Đã xóa SOP');
          } catch (e: any) {
              this.toast.show('Lỗi xóa: ' + e.message, 'error');
          }
      }
  }

  async duplicateSop(sop: Sop, event: Event) {
      event.stopPropagation();
      if(await this.confirmation.confirm({ message: `Nhân bản SOP: "${sop.name}"?`, confirmText: 'Nhân bản' })) {
          try {
              const newSop: Sop = JSON.parse(JSON.stringify(sop));
              newSop.id = generateSlug(sop.name + '_copy_' + Date.now());
              newSop.name = `${sop.name} (Copy)`;
              newSop.version = 1;
              newSop.lastModified = null;
              newSop.archivedAt = null;
              
              await this.sopService.saveSop(newSop);
              this.toast.show('Đã nhân bản SOP!', 'success');
          } catch(e: any) {
              this.toast.show('Lỗi: ' + e.message, 'error');
          }
      }
  }

  exportSop(sop: Sop, event: Event) {
      event.stopPropagation();
      try {
          const json = JSON.stringify(sop, null, 2);
          const blob = new Blob([json], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `SOP_${generateSlug(sop.name)}_${sop.version}.json`;
          a.click();
          URL.revokeObjectURL(url);
          this.toast.show('Đã tải xuống SOP.');
      } catch (e) {
          this.toast.show('Lỗi export JSON', 'error');
      }
  }

  async importSop(event: any) {
      const file = event.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = async (e: any) => {
          try {
              const data = JSON.parse(e.target.result);
              if (!data.name || !data.consumables) throw new Error("File JSON không hợp lệ (thiếu name/consumables)");
              
              data.id = generateSlug(data.name + '_' + Date.now());
              data.version = 1;
              data.lastModified = null;
              data.archivedAt = null;

              if(await this.confirmation.confirm({ message: `Import SOP: "${data.name}"?`, confirmText: 'Import' })) {
                  await this.sopService.saveSop(data);
                  this.toast.show('Import thành công!', 'success');
              }
          } catch(err: any) {
              this.toast.show('Lỗi Import: ' + err.message, 'error');
          } finally {
              event.target.value = '';
          }
      };
      reader.readAsText(file);
  }

  // --- UPDATED: PDF SUPPORT WITH PREVIEW ---
  onPrintDraft(sop: Sop) {
    if (this.isProcessing()) return;
    this.isProcessing.set(true); 
    
    try {
        const payload = this.getPayloadData();
        this.state.cachedCalculatorState.set({ sopId: sop.id, formValues: this.form().value });

        const job: PrintJob = {
          sop: sop, inputs: payload, margin: payload.safetyMargin, items: this.calculatedItems(),
          date: new Date(), user: (this.state.currentUser()?.displayName || 'Guest') + ' (Bản nháp)',
          analysisDate: payload.analysisDate, requestId: `DRAFT-${Date.now()}`
        };
        
        // OPEN PREVIEW INSTEAD OF DIRECT PRINT
        this.printService.openPreview([job]);

    } finally {
        this.isProcessing.set(false);
    }
  }

  async approveAndCreatePrintJob(sop: Sop) {
    if (!this.auth.canApprove()) return;
    if (this.isProcessing()) return;
    this.isProcessing.set(true);
    try {
        const payload = this.getPayloadData();
        const result = await this.state.directApproveAndPrint(sop, this.calculatedItems(), payload, this.localInventoryMap());
        if (result) {
            const job: PrintJob = {
              sop: sop, inputs: payload, margin: payload.safetyMargin, items: this.calculatedItems(),
              date: new Date(), user: this.state.currentUser()?.displayName, analysisDate: payload.analysisDate,
              requestId: result.logId 
            };
            this.printService.openPreview([job]); // UPDATED: Use Preview
        }
    } catch (e: any) { } finally {
        this.isProcessing.set(false);
    }
  }

  async sendRequest(sop: Sop) {
    if (this.isProcessing()) return;
    this.isProcessing.set(true);
    try {
        const payload = this.getPayloadData();
        await this.state.submitRequest(sop, this.calculatedItems(), payload, this.localInventoryMap());
    } finally {
        this.isProcessing.set(false);
    }
  }

  async saveEditedRequest(sop: Sop) {
      const req = this.editingRequest();
      if (!req) return;
      if (this.isProcessing()) return;
      this.isProcessing.set(true);
      try {
          const payload = this.getPayloadData();
          const success = await this.state.updateApprovedRequest(req, sop, this.calculatedItems(), payload, this.localInventoryMap());
          if (success) {
              this.router.navigate(['/requests']);
          }
      } finally {
          this.isProcessing.set(false);
      }
  }

  cancelEdit() {
      this.router.navigate(['/requests']);
  }

  goToResultsEntry() {
      const req = this.editingRequest();
      if (req) {
          this.router.navigate(['/results', req.id]);
      }
  }

  // --- QUICK GENERATE MODAL HANDLERS ---
  openQuickGenerateModal() {
      this.quickGenerateModalOpen.set(true);
  }

  closeQuickGenerateModal() {
      this.quickGenerateModalOpen.set(false);
  }

  handleGeneratedSamples(samples: string[]) {
      const currentSamples = this.sampleListText();
      const newSamplesStr = samples.join('\n');
      const updatedSamples = currentSamples 
          ? `${currentSamples.trim()}\n${newSamplesStr}` 
          : newSamplesStr;
          
      this.onSampleListChange(updatedSamples);
      this.toast.show(`Đã thêm ${samples.length} mẫu vào danh sách.`, 'success');
      this.closeQuickGenerateModal();
  }
}
