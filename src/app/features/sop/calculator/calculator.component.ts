
import { Component, inject, input, output, effect, signal, computed, OnDestroy, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router'; 
import { StateService } from '../../../core/services/state.service';
import { AuthService } from '../../../core/services/auth.service';
import { InventoryService } from '../../inventory/inventory.service';
import { RecipeService } from '../../recipes/recipe.service';
import { SopService } from '../services/sop.service'; 
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { PrintService, PrintJob } from '../../../core/services/print.service';
import { Sop, CalculatedItem, CalculatedIngredient } from '../../../core/models/sop.model';
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

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RecipeManagerComponent, QuickGenerateSampleModalComponent],
  templateUrl: './calculator.component.html'
})
export class CalculatorComponent implements OnDestroy {
  sopInput = input<Sop | null>(null, { alias: 'sop' }); 
  get GHS_DICT() { return GHS_DICTIONARY; }
  
  // ... imports and basic setup identical to previous ...
  private fb: FormBuilder = inject(FormBuilder);
  public state = inject(StateService);
  public auth = inject(AuthService);
  private invService = inject(InventoryService); 
  private recipeService = inject(RecipeService);
  private calcService = inject(CalculatorService);
  private sopService = inject(SopService);
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

  form = signal<FormGroup>(this.fb.group({ safetyMargin: [10], analysisDate: [this.getTodayDate()] }));
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
        const controls: Record<string, any> = { safetyMargin: [10], analysisDate: [this.getTodayDate()] };
        s.inputs.forEach(i => { if (i.var !== 'safetyMargin') controls[i.var] = [i.default !== undefined ? i.default : 0]; });
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
        } else {
            if (cached && cached.sopId === s.id) { 
                newForm.patchValue(cached.formValues); 
            }
            this.sampleListText.set('');
            this.sampleCount.set(0);
            this.selectedTargets.set(new Set());
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
  getTodayDate(): string { return new Date().toISOString().split('T')[0]; }

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
  }

  toggleTarget(id: string) {
      this.selectedTargets.update(s => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  }

  isAllSelected(allTargets: any[]): boolean {
      if (!allTargets || allTargets.length === 0) return false;
      return this.selectedTargets().size === allTargets.length;
  }

  toggleAllTargets(allTargets: any[]) {
      if (this.isAllSelected(allTargets)) { this.selectedTargets.set(new Set()); } 
      else { this.selectedTargets.set(new Set(allTargets.map(t => t.id))); }
  }

  getPayloadData() {
      const rawSamples = this.sampleListText();
      const sampleList = rawSamples.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      const values = this.form().value;
      
      // Override margin if Auto
      const finalMargin = this.marginMode() === 'auto' ? -1 : (values.safetyMargin || 0);
      
      const targetIds = Array.from(this.selectedTargets());
      const sampleTargetMap: Record<string, string[]> = {};
      sampleList.forEach(sample => {
          sampleTargetMap[sample] = targetIds;
      });
      
      return { 
          ...values, 
          safetyMargin: finalMargin, 
          sampleList: sampleList, 
          targetIds: targetIds,
          sampleTargetMap: sampleTargetMap
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
  
  async softDeleteSop(sop: Sop, event: Event) { /* ... same as original ... */ }
  async duplicateSop(sop: Sop, event: Event) { /* ... same as original ... */ }
  exportSop(sop: Sop, event: Event) { /* ... same as original ... */ }
  async importSop(event: any) { /* ... same as original ... */ }

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
