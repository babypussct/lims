
import { Component, inject, signal, effect, input, output, computed, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SopService } from '../services/sop.service';
import { StateService } from '../../../core/services/state.service';
import { ToastService } from '../../../core/services/toast.service';
import { CalculatorService } from '../../../core/services/calculator.service';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { InventoryService } from '../../inventory/inventory.service';
import { RecipeService } from '../../recipes/recipe.service'; 
import { TargetService } from '../../targets/target.service';
import { Sop, CalculatedItem, SopTarget, TargetGroup, MatrixType, MasterAnalyte } from '../../../core/models/sop.model';
import { FirebaseService } from '../../../core/services/firebase.service';
import { MatrixTypeService } from '../../config/matrix-type.service';
import { collection, getDocs, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { InventoryItem } from '../../../core/models/inventory.model';
import { Recipe } from '../../../core/models/recipe.model';
import { MasterTargetService } from '../../targets/master-target.service';
import { MasterDeviceService } from '../../config/master-device.service';
import { MasterDevice } from '../../../core/models/sop.model';
import { UNIT_OPTIONS, formatNum, formatDate, generateSlug } from '../../../shared/utils/utils';
import { getCanonicalId } from '../../results/shared/compound-id-resolver';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject, of } from 'rxjs';

const STANDARD_VARS = [
    { value: 'total_n', label: 'Biến: Tổng số mẫu (n_sample + n_qc)' },
    { value: 'total_vol_solvent', label: 'Biến: Tổng thể tích dung môi (mL)' },
    { value: 'v_extract', label: 'Biến: Thể tích dịch chiết (mL)' }
];

@Component({
  selector: 'app-sop-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sop-editor.component.html'
})
export class SopEditorComponent implements OnDestroy {
  // Services & State
  state = inject(StateService);
  sopService = inject(SopService);
  invService = inject(InventoryService);
  recipeService = inject(RecipeService);
  targetService = inject(TargetService); 
  masterTargetService = inject(MasterTargetService);
  matrixTypeService = inject(MatrixTypeService);
  toast = inject(ToastService);
  confirmationService = inject(ConfirmationService);
  calcService = inject(CalculatorService);
  fbService = inject(FirebaseService);
  masterDeviceService = inject(MasterDeviceService);
  router: Router = inject(Router);
  fb: FormBuilder = inject(FormBuilder);
  
  // Helpers
  unitOptions = UNIT_OPTIONS;
  formatNum = formatNum;
  standardVars = STANDARD_VARS;
  
  // State Signals
  currentId = signal<string | null>(null);
  currentVersion = signal<number>(1);
  currentTab = signal<'general' | 'logic' | 'consumables' | 'targets'>('general');
  isLoading = signal(false);
  previewResults = signal<CalculatedItem[]>([]);
  availableMatrices = signal<MatrixType[]>([]);
  selectedMatrixTags = signal<string[]>([]);
  availableDevices = signal<MasterDevice[]>([]);
  selectedAllowedDevices = signal<string[]>([]);
  
  // SEARCH STATE
  searchSubject = new Subject<string>();
  searchResults = signal<any[]>([]); // Can be InventoryItem or Recipe
  activeSearch: { index: number, isIngredient: boolean, subIndex?: number } | null = null;

  // Import Group Modal
  showGroupModal = signal(false);
  availableGroups = signal<TargetGroup[]>([]);

  // Master Targets Selection Modal
  masterTargets = signal<MasterAnalyte[]>([]);
  showTargetModal = signal(false);
  targetSearchTerm = signal('');
  selectedMasterTargets = signal<Set<string>>(new Set());
  replacingTargetIndex = signal<number | null>(null);

  filteredMasterTargets = computed(() => {
      const term = this.targetSearchTerm().toLowerCase().trim();
      const all = this.masterTargets();
      if (!term) return all;
      return all.filter(t => t.name.toLowerCase().includes(term) || t.id.includes(term));
  });

  validTargetMap = computed(() => {
      const masters = this.masterTargets();
      const map = new Map<string, boolean>();
      masters.forEach(m => map.set(m.id, true));
      return map;
  });

  readonly CORE_INPUTS = [{ var: 'n_sample', label: 'Số lượng mẫu', type: 'number', default: 1, step: 1, unitLabel: 'mẫu' }, { var: 'n_qc', label: 'Số lượng QC', type: 'number', default: 8, step: 1, unitLabel: 'mẫu' }, { var: 'w_sample', label: 'Khối lượng mẫu', type: 'number', default: 10, step: 0.1, unitLabel: 'g' }];

  form = this.fb.group({
    id: [''], category: ['', Validators.required], name: ['', Validators.required], ref: [''],
    version: [1, [Validators.required, Validators.min(1)]],
    device: [''],
    inputs: this.fb.array([]), 
    variablesList: this.fb.array([]), 
    consumables: this.fb.array([]),
    targets: this.fb.array([]) // New Targets Array
  });

  constructor() {
    effect((onCleanup) => {
      const sop = this.state.editingSop();
      if (sop) { 
          if (sop.id) this.loadSop(sop); 
          else { 
              this.loadSop(sop); 
              this.currentId.set(null); 
              this.currentVersion.set(1); 
              this.form.patchValue({ id: '', version: 1 }); 
          } 
      } else { 
          this.createNew(); 
      }
      const sub = this.form.valueChanges.pipe(debounceTime(300)).subscribe(val => { this.runPreview(val); });
      onCleanup(() => sub.unsubscribe());
    }, { allowSignalWrites: true });

    // Unified Search Listener
    this.searchSubject.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(term => {
            if (!term || term.trim().length < 1 || !this.activeSearch) return of([]);
            const index = this.activeSearch.index;
            const conType = this.consumables.at(index).get('type')?.value;
            
            // Determine search source based on type
            if (!this.activeSearch.isIngredient && conType === 'shared_recipe') {
                return this.recipeService.getAllRecipes()
                    .then(all => all.filter(r => r.name.toLowerCase().includes(term.toLowerCase())))
                    .catch(e => {
                        console.warn('Recipe search failed:', e);
                        return [];
                    });
            } else {
                return this.invService.getInventoryPage(10, null, 'all', term).then(res => res.items);
            }
        })
    ).subscribe(items => {
        this.searchResults.set(items);
    });
  }

  ngOnDestroy() { this.searchSubject.complete(); }

  // --- Strict Mode Form Logic ---
  onTypeChange(index: number) {
      const con = this.consumables.at(index);
      con.patchValue({ name: '', _displayName: '', recipeId: '' });
  }

  updateCompositeId(index: number) {
      const con = this.consumables.at(index);
      const display = con.get('_displayName')?.value;
      if (display) con.patchValue({ name: 'mix_' + generateSlug(display) });
  }

  onSearchInput(event: any, index: number, isIngredient: boolean, subIndex?: number) {
      this.activeSearch = { index, isIngredient, subIndex };
      this.searchSubject.next(event.target.value);
  }

  onSearchFocus(index: number, isIngredient: boolean, subIndex?: number) {
      this.activeSearch = { index, isIngredient, subIndex };
      const control = isIngredient ? this.getIngredients(index).at(subIndex!).get('_displayName') : this.consumables.at(index).get('_displayName');
      const val = control?.value || '';
      if(val) this.searchSubject.next(val);
  }

  selectItem(item: any, index: number, isIngredient: boolean, subIndex?: number) {
      // Item can be InventoryItem or Recipe
      if (isIngredient) {
          const control = this.getIngredients(index).at(subIndex!);
          control.patchValue({ name: item.id, unit: item.unit, _displayName: item.name }); 
      } else {
          const control = this.consumables.at(index);
          const type = control.get('type')?.value;
          
          if (type === 'shared_recipe') {
              control.patchValue({ 
                  name: item.id, 
                  recipeId: item.id, 
                  unit: item.baseUnit, 
                  _displayName: item.name 
              });
          } else {
              control.patchValue({ name: item.id, unit: item.unit, _displayName: item.name });
          }
      }
      this.closeSearchDropdown();
  }

  closeSearchDropdown() { this.searchResults.set([]); this.activeSearch = null; }

  // --- Getters & Form Manipulation ---
  get inputs() { return this.form.get('inputs') as FormArray; }
  get variablesList() { return this.form.get('variablesList') as FormArray; }
  get consumables() { return this.form.get('consumables') as FormArray; }
  get targets() { return this.form.get('targets') as FormArray; }
  
  getIngredients(conIndex: number): FormArray { return this.consumables.at(conIndex).get('ingredients') as FormArray; }

  createNew() {
    this.currentId.set(null); this.currentVersion.set(1); this.currentTab.set('general');
    this.form.reset({ id: '', category: '', name: '', ref: '', version: 1, device: '' });
    this.selectedAllowedDevices.set([]);
    this.inputs.clear(); this.variablesList.clear(); this.consumables.clear(); this.targets.clear();
    this.CORE_INPUTS.forEach(ci => { this.addInputRaw(ci.var, ci.label, ci.default, ci.type as any, ci.step, ci.unitLabel); });
    this.previewResults.set([]);
  }

  loadSop(sop: Sop) {
    if (sop.id) this.currentId.set(sop.id);
    this.currentVersion.set(sop.version || 1); 
    this.currentTab.set('general');
    this.form.patchValue({ id: sop.id, category: sop.category, name: sop.name, ref: sop.ref, version: sop.version || 1, device: sop.device || '' });
    
    this.selectedAllowedDevices.set(sop.allowedDevices || []);
    
    if (this.availableDevices().length === 0) {
      this.masterDeviceService.getAll().then(d => this.availableDevices.set(d));
    }
    
    this.inputs.clear(); 
    const loadedVars = new Set<string>();
    sop.inputs.forEach(i => { 
        this.addInputRaw(i.var, i.label, i.default, i.type, i.step, i.unitLabel, i.options); 
        loadedVars.add(i.var); 
    });
    this.CORE_INPUTS.forEach(ci => { if (!loadedVars.has(ci.var)) { this.addInputRaw(ci.var, ci.label, ci.default, ci.type as any, ci.step, ci.unitLabel); } });

    this.variablesList.clear();
    if (sop.variables) Object.entries(sop.variables).forEach(([k, v]) => this.variablesList.push(this.fb.group({ key: [k, Validators.required], formula: [v, Validators.required] })));
    
    this.consumables.clear();
    sop.consumables.forEach(c => {
      const g = this.fb.group({ 
          name: [c.name || ''], 
          recipeId: [c.recipeId || ''],
          _displayName: [c._displayName || c.name || ''], 
          base_note: [c.base_note || ''], formula: [c.formula || ''], unit: [c.unit || ''], type: [c.type || 'simple'], condition: [c.condition || ''], ingredients: this.fb.array([]) 
      });
      if (c.ingredients) c.ingredients.forEach(ing => (g.get('ingredients') as FormArray).push(this.fb.group({ name: [ing.name, Validators.required], _displayName: [ing._displayName || ing.name, Validators.required], amount: [ing.amount, Validators.required], unit: [ing.unit, Validators.required] })));
      this.consumables.push(g);
    });

    this.targets.clear();
    if (sop.targets) {
        sop.targets.forEach(t => this.addTargetRaw(t));
    }

    if (this.availableMatrices().length === 0) {
      this.matrixTypeService.getAll().then(m => this.availableMatrices.set(m));
    }
    this.selectedMatrixTags.set(sop.matrixTags || []);

    if (this.masterTargets().length === 0) {
      this.masterTargetService.getAll().then(m => this.masterTargets.set(m));
    }
    
    this.runPreview(this.form.getRawValue());
  }

  toggleMatrixTag(id: string) {
    const current = this.selectedMatrixTags();
    if (current.includes(id)) {
      this.selectedMatrixTags.set(current.filter(x => x !== id));
    } else {
      this.selectedMatrixTags.set([...current, id]);
    }
  }

  clearMatrixTags() {
    this.selectedMatrixTags.set([]);
  }

  toggleAllowedDevice(name: string) {
    const current = this.selectedAllowedDevices();
    let next: string[];
    if (current.includes(name)) {
      next = current.filter(x => x !== name);
    } else {
      next = [...current, name];
    }
    this.selectedAllowedDevices.set(next);
    
    // Nếu thiết bị mặc định hiện tại không nằm trong danh sách mới, reset về rỗng
    const currentDefault = this.form.get('device')?.value;
    if (currentDefault && !next.includes(currentDefault)) {
      this.form.patchValue({ device: '' });
    }
  }

  // --- Preview & Save ---
  runPreview(formVal: any) {
    try {
        const mockInputs: Record<string, any> = {};
        (formVal.inputs || []).forEach((i: any) => { if(i.var) mockInputs[i.var] = i.default; });
        const variables: Record<string, string> = {};
        (formVal.variablesList as any[]).forEach(v => { if (v.key && v.formula) variables[v.key] = v.formula; });
        
        const tempSop: Sop = { 
            id: 'preview', category: 'p', name: 'P', 
            inputs: formVal.inputs, variables: variables, 
            consumables: (formVal.consumables as any[]).map(c => ({ 
                ...c, name: c.name || '', recipeId: c.recipeId, ingredients: c.ingredients || [] 
            }))
        };
        const results = this.calcService.calculateSopNeeds(tempSop, mockInputs, 0); 
        this.previewResults.set(results); 
    } catch (e) { }
  }

  async save() {
    this.isLoading.set(true);
    let formVal = this.form.value;
    if (!formVal.id) { this.form.patchValue({ id: `sop_${Date.now()}` }); formVal = this.form.value; }
    
    if (this.form.invalid) { this.form.markAllAsTouched(); this.toast.show('Kiểm tra các trường bắt buộc!', 'error'); this.isLoading.set(false); return; }
    
    // 1. AUTO-FIX IDs FOR TARGETS BEFORE VALIDATION
    const rawTargets = formVal.targets as any[];
    rawTargets.forEach((t, index) => {
        // If ID is empty but Name exists, generate Canonical ID
        if (!t.id && t.name) {
            const newId = getCanonicalId(t.name);
            this.targets.at(index).patchValue({ id: newId });
            t.id = newId; // Update local ref for next check
        }
    });

    // 2. FILTER & VALIDATE DUPLICATES
    // Filter out rows that have NO ID (likely empty rows user forgot to delete)
    const validTargetIds = rawTargets.map(t => t.id).filter(id => id && id.trim() !== '');
    const uniqueTargetIds = new Set(validTargetIds);
    
    if (validTargetIds.length !== uniqueTargetIds.size) {
        this.toast.show('Lỗi: Có mã ID chỉ tiêu bị trùng lặp (hoặc tên giống nhau).', 'error');
        this.currentTab.set('targets');
        this.isLoading.set(false);
        return;
    }

    const invalidConsumable = (formVal.consumables as any[]).find((c: any) => !c.name || c.name.trim() === '');
    if (invalidConsumable) { this.toast.show('Một số hóa chất chưa chọn ID hợp lệ!', 'error'); this.currentTab.set('consumables'); this.isLoading.set(false); return; }

    const variables: Record<string, string> = {};
    (formVal.variablesList as any[]).forEach(v => { if (v.key && v.formula) variables[v.key] = v.formula; });
    
    // 3. CONSTRUCT FINAL OBJECT
    const sop: Sop = {
      id: formVal.id!, category: formVal.category!, name: formVal.name!, ref: formVal.ref || '',
      inputs: (formVal.inputs as any[]).map(i => {
          const res = {...i};
          // Parse optionsStr if present
          if (res.type === 'select' && res.optionsStr) {
              res.options = this.parseOptions(res.optionsStr);
              delete res.optionsStr;
          }
          return res;
      }), 
      variables: variables,
      consumables: (formVal.consumables as any[]).map((c: any) => {
          return { 
              name: c.name, recipeId: c.recipeId, _displayName: c._displayName, 
              base_note: c.base_note, formula: c.formula, unit: c.unit, type: c.type, 
              condition: c.condition, 
              ingredients: (c.ingredients || []).map((ing: any) => ({ name: ing.name, amount: ing.amount, unit: ing.unit, _displayName: ing._displayName }))
          };
      }),
      targets: (formVal.targets as any[])
          .filter(t => t.id && t.name)
          .map(t => ({ id: t.id, name: t.name, unit: t.unit, lod: t.lod, loq: t.loq })),
      matrixTags: this.selectedMatrixTags().length > 0 ? this.selectedMatrixTags() : null as any,
      device: formVal.device || null as any,
      allowedDevices: this.selectedAllowedDevices().length > 0 ? this.selectedAllowedDevices() : null as any,
      version: formVal.version || this.currentVersion() 
    };
    
    try { 
        await this.sopService.saveSop(sop); 
        this.toast.show('Đã lưu quy trình thành công!'); 
        
        this.state.selectedSop.set(sop); 
        this.state.editingSop.set(null); 
        this.router.navigate(['/calculator']); 
    } catch(e: any) { 
        this.toast.show('Lỗi lưu SOP: ' + (e.message || 'Unknown'), 'error'); 
    } finally { 
        this.isLoading.set(false); 
    }
  }

  goBack() { this.state.editingSop.set(null); this.router.navigate(['/calculator']); }
  
  // Helper methods
  addInput() { this.addInputRaw('', '', 0, 'number', 1, ''); }
  
  private addInputRaw(v: string, l: string, d: any, t: 'number'|'checkbox'|'select', s: any, u: string | undefined, options?: any[]) { 
      const optsStr = options ? options.map(o => `${o.value}:${o.label}`).join(', ') : '';
      this.inputs.push(this.fb.group({ 
          var: [v, Validators.required], 
          label: [l, Validators.required], 
          default: [d], 
          type: [t], 
          step: [s], 
          unitLabel: [u],
          optionsStr: [optsStr] // Add intermediate control string
      })); 
  }
  
  // HELPER: Parse "0:Fish, 1:Milk" -> [{value: 0, label: Fish}, ...]
  private parseOptions(str: string): {label: string, value: string|number}[] {
      if (!str) return [];
      return str.split(',').map(part => {
          const [val, lbl] = part.split(':');
          if (!val || !lbl) return null;
          const cleanVal = val.trim();
          // Check if number
          const numVal = Number(cleanVal);
          return {
              value: isNaN(numVal) ? cleanVal : numVal,
              label: lbl.trim()
          };
      }).filter(x => x !== null) as any;
  }

  addVariable() { this.variablesList.push(this.fb.group({ key: ['', Validators.required], formula: ['', Validators.required] })); }

  addConsumable() { this.consumables.push(this.fb.group({ name: [''], _displayName: [''], recipeId: [''], base_note: [''], formula: [''], unit: ['ml'], type: ['simple'], condition: [''], ingredients: this.fb.array([]) })); }
  addIngredient(conIndex: number) { this.getIngredients(conIndex).push(this.fb.group({ name: ['', Validators.required], _displayName: ['', Validators.required], amount: [0, Validators.required], unit: ['ml', Validators.required] })); }

  // Target Methods
  addTarget() {
      this.addTargetRaw({ id: '', name: '', unit: 'ppb' });
  }

  private addTargetRaw(t: Partial<SopTarget>) {
      this.targets.push(this.fb.group({
          id: [t.id || '', Validators.required],
          name: [t.name || '', Validators.required],
          unit: [t.unit || ''],
          lod: [t.lod || ''],
          loq: [t.loq || '']
      }));
  }

  onTargetNameChange(index: number, event: any) {
      const val = event.target.value;
      const idControl = this.targets.at(index).get('id');
      
      // Fix: Use pristine check. 
      // If the user hasn't manually touched the ID field (pristine=true), auto-generate it.
      // Also update if ID is empty (just in case it was touched but cleared).
      if (idControl && (idControl.pristine || !idControl.value)) {
          idControl.setValue(getCanonicalId(val));
      }
  }

  // --- NEW: IMPORT FROM GROUP ---
  async openGroupImport() {
      this.isLoading.set(true);
      try {
          const groups = await this.targetService.getAllGroups();
          this.availableGroups.set(groups);
          this.showGroupModal.set(true);
      } catch (e) {
          this.toast.show('Lỗi tải danh sách bộ chỉ tiêu.', 'error');
      } finally {
          this.isLoading.set(false);
      }
  }

  importGroup(g: TargetGroup) {
      if (!g.targets || g.targets.length === 0) {
          this.toast.show('Bộ chỉ tiêu này trống.', 'info');
          return;
      }

      const existingIds = new Set(
          (this.targets.value as SopTarget[]).map(t => t.id)
      );

      let addedCount = 0;
      g.targets.forEach(t => {
          if (!existingIds.has(t.id)) {
              this.addTargetRaw(t);
              existingIds.add(t.id); // Prevent dupes if group has dupes itself
              addedCount++;
          }
      });

      if (addedCount > 0) {
          this.toast.show(`Đã thêm ${addedCount} chỉ tiêu từ bộ "${g.name}".`, 'success');
      } else {
          this.toast.show('Tất cả chỉ tiêu trong bộ này đã có sẵn.', 'info');
      }
      this.showGroupModal.set(false);
  }

  openTargetModal(index?: number) {
      if (typeof index === 'number') {
          this.replacingTargetIndex.set(index);
      } else {
          this.replacingTargetIndex.set(null);
      }
      this.targetSearchTerm.set('');
      this.selectedMasterTargets.set(new Set());
      this.showTargetModal.set(true);
  }

  toggleMasterTargetSelection(id: string) {
      const current = this.selectedMasterTargets();
      
      if (this.replacingTargetIndex() !== null) {
          if (current.has(id)) {
              current.delete(id);
          } else {
              current.clear();
              current.add(id);
          }
          this.selectedMasterTargets.set(new Set(current));
          return;
      }

      if (current.has(id)) current.delete(id);
      else current.add(id);
      this.selectedMasterTargets.set(new Set(current));
  }

  confirmTargetSelection() {
      const selectedIds = this.selectedMasterTargets();
      const masters = this.masterTargets();
      
      const replaceIdx = this.replacingTargetIndex();
      if (replaceIdx !== null) {
          if (selectedIds.size === 1) {
              const selectedId = Array.from(selectedIds)[0];
              const m = masters.find(x => x.id === selectedId);
              if (m) {
                  const targetCtrl = this.targets.at(replaceIdx);
                  targetCtrl.patchValue({
                      id: m.id,
                      name: m.name,
                      unit: m.default_unit || 'ppb'
                  });
                  this.toast.show(`Đã cập nhật chỉ tiêu thành: ${m.name}`, 'success');
              }
          }
          this.showTargetModal.set(false);
          return;
      }

      const currentIds = new Set(this.targets.value.map((t: any) => t.id));

      let addedCount = 0;
      selectedIds.forEach(id => {
          if (!currentIds.has(id)) {
              const m = masters.find(x => x.id === id);
              if (m) {
                  this.targets.push(this.fb.group({
                      id: [m.id],
                      name: [m.name],
                      unit: [m.default_unit || 'ppb'],
                      lod: [''],
                      loq: ['']
                  }));
                  addedCount++;
              }
          }
      });
      
      if (addedCount > 0) {
          this.toast.show(`Đã thêm ${addedCount} chỉ tiêu vào danh sách.`, 'success');
      }
      this.showTargetModal.set(false);
  }
}
