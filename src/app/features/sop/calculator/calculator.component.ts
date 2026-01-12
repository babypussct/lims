
import { Component, inject, input, output, effect, signal, computed, OnDestroy, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router'; 
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
import { CalculatorService } from '../../../core/services/calculator.service';
import { formatNum, cleanName, generateSlug, formatDate, naturalCompare } from '../../../shared/utils/utils';
import { startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { RecipeManagerComponent } from '../../recipes/recipe-manager.component';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RecipeManagerComponent],
  template: `
    <div class="max-w-8xl mx-auto pb-24 fade-in lg:h-full h-auto flex flex-col no-print px-4 md:px-6">
      
      @if (activeSop(); as currentSop) {
        <!-- VIEW: CALCULATOR FORM -->
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 shrink-0 gap-4 pt-4">
           <div>
              <div class="flex items-center gap-2 mb-1.5">
                 <button (click)="clearSelection()" class="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1 transition bg-white border border-slate-200 px-2 py-1 rounded-md shadow-sm active:scale-95">
                    <i class="fa-solid fa-arrow-left"></i> Thư viện
                 </button>
                 <span class="px-2.5 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-700 shadow-sm border border-indigo-200">
                    {{currentSop.category}}
                 </span>
              </div>
              <h2 class="text-2xl md:text-3xl font-black text-slate-800 tracking-tight leading-tight">{{currentSop.name}}</h2>
           </div>
        </div>

        <!-- Main Layout -->
        <div class="flex flex-col lg:flex-row gap-6 lg:gap-8 lg:items-stretch lg:h-full lg:overflow-hidden h-auto">
            
            <!-- LEFT PANEL: INPUTS -->
            <div class="w-full lg:w-[380px] shrink-0 bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden flex flex-col lg:h-full h-auto">
               <div class="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3 shrink-0">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-blue-200 shadow-md">
                    <i class="fa-solid fa-sliders"></i>
                  </div>
                  <div><h3 class="font-bold text-slate-800 text-sm">Thông số Mẻ mẫu</h3></div>
               </div>

               <div class="p-5 lg:overflow-y-auto lg:flex-1 lg:min-h-0 custom-scrollbar">
                   @if (form()) {
                       <form [formGroup]="form()" class="space-y-5">
                          @for (inp of currentSop.inputs; track inp.var) {
                            <div class="group">
                               <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">{{inp.label}}</label>
                               @if (inp.type === 'checkbox') {
                                  <label class="flex items-center justify-between p-3 border border-slate-200 rounded-xl cursor-pointer bg-white hover:border-blue-300 transition">
                                    <span class="text-sm font-bold text-slate-700">Kích hoạt</span>
                                    <input type="checkbox" [formControlName]="inp.var" class="w-5 h-5 accent-blue-600 rounded cursor-pointer">
                                  </label>
                               } @else {
                                  <div class="relative">
                                    <input type="number" [formControlName]="inp.var" [step]="inp.step || 1"
                                           class="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-slate-800 focus:bg-white focus:border-blue-500 outline-none transition shadow-sm">
                                    @if(inp.unitLabel) { <span class="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">{{inp.unitLabel}}</span> }
                                  </div>
                               }
                            </div>
                          }
                          
                          <div class="pt-6 mt-2 border-t border-slate-100">
                             <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2 block ml-1">Hệ số hao hụt (An toàn)</label>
                             <div class="relative group">
                                <input type="number" formControlName="safetyMargin" min="0" step="1"
                                       class="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-orange-600 focus:bg-white focus:border-orange-500 outline-none transition shadow-sm">
                                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">%</span>
                             </div>
                          </div>
                       </form>
                   }
               </div>

               <div class="p-5 border-t border-slate-100 bg-slate-50 space-y-3 shrink-0">
                  <button (click)="onPrintDraft(currentSop)" class="w-full bg-slate-200 border border-slate-300 text-slate-700 font-bold py-3.5 rounded-xl shadow-sm transition hover:bg-slate-300">In Bản Nháp</button>
                  <button (click)="sendRequest(currentSop)" class="w-full bg-white border border-slate-300 text-slate-700 hover:text-blue-600 hover:border-blue-300 font-bold py-3.5 rounded-xl shadow-sm transition">Gửi Yêu Cầu Duyệt</button>
                  @if(auth.canApprove()) {
                     <button (click)="approveAndCreatePrintJob(currentSop)" class="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-3.5 rounded-xl shadow-lg transition hover:from-emerald-600 hover:to-teal-700">Duyệt & In Phiếu Ngay</button>
                  }
               </div>
            </div>

            <!-- RIGHT PANEL: RESULTS -->
            <div class="flex-1 bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden flex flex-col lg:h-full h-auto min-h-[500px]">
                <div class="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
                  <h3 class="font-black text-slate-800 text-base flex items-center gap-3">
                    <i class="fa-solid fa-flask-vial text-purple-600"></i> Bảng Dự Trù Hóa Chất
                  </h3>
                  @if(isLoadingInventory()) {
                      <div class="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 animate-pulse">
                          <i class="fa-solid fa-circle-notch fa-spin text-blue-500 text-xs"></i>
                          <span class="text-xs text-blue-600 font-bold">Đang kiểm tra kho...</span>
                      </div>
                  } @else {
                      <span class="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded-full border border-green-100"><i class="fa-solid fa-check mr-1"></i>Đã đồng bộ kho</span>
                  }
                </div>
                
                <div class="lg:overflow-y-auto lg:flex-1 p-0 custom-scrollbar">
                   <table class="w-full text-sm text-left border-collapse">
                     <thead class="text-[10px] text-slate-400 font-bold uppercase bg-slate-50 sticky top-0 shadow-sm z-10">
                        <tr>
                          <th class="px-6 py-3 tracking-wider w-1/3">Hóa chất / Vật tư</th>
                          <th class="px-6 py-3 tracking-wider text-right hidden sm:table-cell">Định mức gốc</th>
                          <th class="px-6 py-3 tracking-wider text-right w-32">Tổng Cần</th>
                          <th class="px-6 py-3 tracking-wider text-center w-20">Đơn vị</th>
                        </tr>
                     </thead>
                     <tbody class="divide-y divide-slate-50">
                        @for (item of calculatedItems(); track item.name) {
                              <tr class="group hover:bg-slate-50/80 transition duration-150" [class.bg-red-50]="item.isMissing">
                                <td class="px-6 py-4 align-top">
                                  <div class="flex flex-col">
                                      <span class="font-bold text-slate-700 text-sm group-hover:text-blue-700 transition-colors">
                                          {{resolveName(item)}}
                                      </span>
                                      <!-- Warnings -->
                                      <div class="flex flex-wrap gap-1 mt-1">
                                          @if(item.isMissing) { 
                                              <span class="text-[10px] font-bold text-red-600 bg-white px-2 py-0.5 rounded border border-red-200"><i class="fa-solid fa-circle-xmark"></i> Không có trong kho ({{item.name}})</span> 
                                          }
                                          @if (item.displayWarning) { 
                                              <span class="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100"><i class="fa-solid fa-triangle-exclamation"></i> {{item.displayWarning}}</span> 
                                          }
                                      </div>
                                  </div>
                                </td>
                                <td class="px-6 py-4 text-right align-top hidden sm:table-cell">
                                  <code class="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-mono">{{item.formula}}</code>
                                </td>
                                <td class="px-6 py-4 text-right align-top">
                                  <span class="font-black text-blue-600 text-lg tabular-nums">{{formatNum(item.totalQty)}}</span>
                                </td>
                                <td class="px-6 py-4 text-center align-top"><span class="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{{item.unit}}</span></td>
                              </tr>
                              
                              @if (item.isComposite) {
                                 <tr class="bg-slate-50/50">
                                    <td colspan="4" class="px-6 py-2 pb-4">
                                        <div class="bg-white border border-slate-200 rounded-lg p-3 shadow-sm ml-4">
                                            <div class="text-[10px] font-bold text-slate-400 uppercase mb-2">Thành phần</div>
                                            <div class="grid gap-2">
                                                @for (sub of item.breakdown; track sub.name) {
                                                    <div class="flex justify-between items-center text-xs border-b border-slate-50 last:border-0 pb-1" [class.text-red-500]="sub.isMissing">
                                                        <div class="flex items-center gap-2">
                                                            <span class="font-medium" [class.text-slate-600]="!sub.isMissing">{{resolveName(sub)}}</span>
                                                            @if(sub.isMissing) { <i class="fa-solid fa-circle-exclamation text-[10px]" title="Không tìm thấy trong kho"></i> }
                                                            <span class="text-[10px] text-slate-400 italic">({{sub.amountPerUnit}} / {{item.unit}})</span>
                                                        </div>
                                                        <div class="flex items-center gap-1"><span class="font-bold text-slate-700 font-mono">{{formatNum(sub.displayAmount)}}</span><span class="text-[10px] text-slate-500">{{sub.unit}}</span></div>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </td>
                                 </tr>
                              }
                        } @empty {
                            <tr>
                                <td colspan="4" class="p-10 text-center text-slate-400 italic">
                                    Chưa có dữ liệu tính toán.
                                </td>
                            </tr>
                        }
                     </tbody>
                   </table>
                </div>
            </div>
        </div>
      } 
      @else {
        <!-- LIBRARY VIEW (Search & List) -->
        <div class="flex flex-col h-full animate-fade-in">
            
            <!-- TABS SWITCHER -->
            <div class="flex justify-between items-end border-b border-slate-200 mb-6 shrink-0 pt-4 px-1">
                <div class="flex gap-6">
                    <button (click)="libraryTab.set('sops')" 
                            class="pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 uppercase tracking-wide px-2"
                            [class]="libraryTab() === 'sops' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-400 hover:text-slate-600'">
                        <i class="fa-solid fa-file-lines"></i> Quy trình (SOPs)
                    </button>
                    @if(auth.canViewRecipes()) {
                        <button (click)="libraryTab.set('recipes')" 
                                class="pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 uppercase tracking-wide px-2"
                                [class]="libraryTab() === 'recipes' ? 'border-purple-600 text-purple-700' : 'border-transparent text-slate-400 hover:text-slate-600'">
                            <i class="fa-solid fa-flask"></i> Công thức (Recipes)
                        </button>
                    }
                </div>
            </div>

            <!-- TAB CONTENT: SOP LIST -->
            @if (libraryTab() === 'sops') {
                <div class="flex flex-col h-full animate-slide-up">
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shrink-0">
                        <div class="flex flex-col md:flex-row gap-3 w-full md:w-auto ml-auto">
                            <div class="relative flex-1 md:w-72">
                                <i class="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                                <input type="text" [ngModel]="searchTerm()" (ngModelChange)="searchTerm.set($event)" 
                                       class="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 shadow-sm" 
                                       placeholder="Tìm kiếm SOP...">
                            </div>
                            @if(auth.canEditSop()) {
                                <button (click)="importFileInput.click()" class="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 px-4 py-2 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 shrink-0 active:scale-95" title="Import SOP từ file JSON">
                                    <i class="fa-solid fa-file-import"></i> <span class="hidden md:inline">Import</span>
                                </button>
                                <input #importFileInput type="file" class="hidden" accept=".json" (change)="importSop($event)">

                                <button (click)="createNew()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 shrink-0 active:scale-95">
                                    <i class="fa-solid fa-plus"></i> <span class="hidden md:inline">Tạo mới</span>
                                </button>
                            }
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pb-10 custom-scrollbar p-1">
                        @for (sop of filteredSops(); track sop.id) {
                            <div (click)="selectSop(sop)" class="bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-400 hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col h-full min-h-[180px] relative overflow-hidden">
                                <div class="flex items-center justify-between mb-3">
                                    <span class="bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md border border-slate-200">{{sop.category}}</span>
                                    @if(sop.version) { <span class="text-[10px] font-mono text-slate-400">v{{sop.version}}</span> }
                                </div>
                                <h3 class="font-bold text-slate-700 text-lg leading-snug mb-2 group-hover:text-blue-700 transition-colors line-clamp-2 pr-6">{{sop.name}}</h3>
                                <div class="mt-auto border-t border-slate-50 pt-3 flex justify-between items-center text-xs text-slate-400 font-medium">
                                    <span>{{sop.consumables.length}} thành phần</span>
                                    <span>{{formatDate(sop.lastModified)}}</span>
                                </div>

                                <!-- Quick Actions (Hover) -->
                                <div class="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                    <button (click)="exportSop(sop, $event)" class="w-8 h-8 bg-white border border-slate-200 rounded-full text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 shadow-sm flex items-center justify-center transition active:scale-90" title="Export JSON">
                                        <i class="fa-solid fa-download text-xs"></i>
                                    </button>
                                    @if(auth.canEditSop()) {
                                        <button (click)="duplicateSop(sop, $event)" class="w-8 h-8 bg-white border border-slate-200 rounded-full text-purple-600 hover:bg-purple-50 hover:border-purple-300 shadow-sm flex items-center justify-center transition active:scale-90" title="Nhân bản (Duplicate)">
                                            <i class="fa-solid fa-copy text-xs"></i>
                                        </button>
                                        <button (click)="editDirect(sop, $event)" class="w-8 h-8 bg-white border border-slate-200 rounded-full text-blue-600 hover:bg-blue-50 hover:border-blue-300 shadow-sm flex items-center justify-center transition active:scale-90" title="Chỉnh sửa">
                                            <i class="fa-solid fa-pen text-xs"></i>
                                        </button>
                                        <button (click)="deleteSop(sop, $event)" class="w-8 h-8 bg-white border border-slate-200 rounded-full text-red-500 hover:bg-red-50 hover:border-red-300 shadow-sm flex items-center justify-center transition active:scale-90" title="Xóa">
                                            <i class="fa-solid fa-trash text-xs"></i>
                                        </button>
                                    }
                                </div>
                            </div>
                        } @empty {
                            <div class="col-span-full py-20 text-center text-slate-400 italic flex flex-col items-center">
                                <i class="fa-solid fa-folder-open text-4xl mb-3 text-slate-300"></i>
                                <p>Chưa có quy trình nào phù hợp.</p>
                            </div>
                        }
                    </div>
                </div>
            }

            <!-- TAB CONTENT: RECIPES -->
            @if (libraryTab() === 'recipes') {
                <div class="h-full animate-slide-up">
                    <app-recipe-manager></app-recipe-manager>
                </div>
            }
        </div>
      }
    </div>
  `
})
export class CalculatorComponent implements OnDestroy {
  sopInput = input<Sop | null>(null, { alias: 'sop' }); 
  editSop = output<Sop>(); 
  
  private fb: FormBuilder = inject(FormBuilder);
  public state = inject(StateService);
  public auth = inject(AuthService);
  private invService = inject(InventoryService); 
  private recipeService = inject(RecipeService);
  private calcService = inject(CalculatorService);
  private sopService = inject(SopService);
  private router: Router = inject(Router);
  private toast = inject(ToastService);
  private confirmation = inject(ConfirmationService);
  private printService = inject(PrintService);
  
  activeSop = computed(() => this.sopInput() || this.state.selectedSop());
  
  // Library View State
  libraryTab = signal<'sops' | 'recipes'>('sops');
  searchTerm = signal('');
  
  // Track current SOP ID to prevent form resetting loop
  private currentFormSopId: string | null = null;
  
  localInventoryMap = signal<Record<string, InventoryItem>>({});
  localRecipeMap = signal<Record<string, Recipe>>({});
  isLoadingInventory = signal(false);

  filteredSops = computed(() => {
      const term = this.searchTerm().toLowerCase();
      const list = this.state.sops().filter(s => s.name.toLowerCase().includes(term) || s.category.toLowerCase().includes(term));
      return list.sort((a, b) => {
          const catCompare = naturalCompare(a.category, b.category);
          if (catCompare !== 0) return catCompare;
          return naturalCompare(a.name, b.name);
      });
  });

  // Init form as null to prevent template rendering before init
  form = signal<FormGroup>(this.fb.group({ safetyMargin: [10] }));
  private formValueSub?: Subscription;

  calculatedItems = signal<CalculatedItem[]>([]);
  safetyMargin = signal<number>(10);
  formatNum = formatNum;
  formatDate = formatDate;

  constructor() {
    // EFFECT 1: Manage Form Initialization
    effect(() => {
      const s = this.activeSop();
      
      if (s) {
        if (s.id === this.currentFormSopId) return;
        this.currentFormSopId = s.id;
        this.formValueSub?.unsubscribe();

        // 1. Initialize Form
        const controls: Record<string, any> = { safetyMargin: [10] };
        s.inputs.forEach(i => { if (i.var !== 'safetyMargin') controls[i.var] = [i.default !== undefined ? i.default : 0]; });
        const newForm = this.fb.group(controls);
        this.form.set(newForm);

        // 2. Initial Calculation (Empty Inventory first to show something)
        this.localInventoryMap.set({}); 
        this.localRecipeMap.set({});
        this.runCalculation(s, newForm.value);

        // 3. Trigger Async Fetch
        this.fetchData(s);

        // 4. Subscribe to Form Changes
        this.formValueSub = newForm.valueChanges.pipe(
            startWith(newForm.value),
            debounceTime(50) 
        ).subscribe(vals => {
             this.runCalculation(s, vals);
             const margin = Number(vals['safetyMargin']);
             this.safetyMargin.set(isNaN(margin) ? 0 : margin);
        });

      } else {
         this.currentFormSopId = null;
         this.calculatedItems.set([]);
         this.localInventoryMap.set({});
      }
    }, { allowSignalWrites: true });

    // EFFECT 2: Re-calculate when Inventory/Recipes Arrive
    effect(() => {
        const invMap = this.localInventoryMap();
        const recMap = this.localRecipeMap();
        const s = untracked(this.activeSop);
        const currentForm = untracked(this.form);

        if (s && currentForm && (Object.keys(invMap).length > 0 || Object.keys(recMap).length > 0)) {
            this.runCalculation(s, currentForm.value);
        }
    });
  }
  
  ngOnDestroy(): void { this.formValueSub?.unsubscribe(); }

  // Decoupled Fetch with Shared Recipe Support
  async fetchData(sop: Sop) {
      this.isLoadingInventory.set(true);
      const neededInvIds = new Set<string>();
      const neededRecipeIds = new Set<string>();

      // 1. Scan for Recipe IDs
      sop.consumables.forEach(c => {
          if (c.type === 'shared_recipe' && c.recipeId) {
              neededRecipeIds.add(c.recipeId);
          } else if (c.type === 'simple' && c.name) {
              neededInvIds.add(c.name);
          } else if (c.type === 'composite' && c.ingredients) {
              c.ingredients.forEach(i => neededInvIds.add(i.name));
          }
      });

      try {
          // 2. Fetch Recipes
          const recipes = await this.recipeService.getRecipesByIds(Array.from(neededRecipeIds));
          const recMap: Record<string, Recipe> = {};
          
          recipes.forEach(r => {
              recMap[r.id] = r;
              // Add recipe ingredients to inventory need list
              r.ingredients.forEach(i => neededInvIds.add(i.name));
          });
          this.localRecipeMap.set(recMap);

          // 3. Fetch Inventory
          const items = await this.invService.getItemsByIds(Array.from(neededInvIds));
          const invMap: Record<string, InventoryItem> = {};
          items.forEach(i => invMap[i.id] = i);
          
          this.localInventoryMap.set(invMap); 

      } catch(e) {
          console.warn("Fetch warning:", e);
      } finally {
          this.isLoadingInventory.set(false);
      }
  }

  resolveName(item: CalculatedItem | CalculatedIngredient): string {
    return item.displayName || item.name;
  }

  runCalculation(sop: Sop, values: any) {
     try {
         const safeValues = (values || {}) as Record<string, any>;
         const margin = Number(safeValues['safetyMargin'] || 0);
         // Pass both maps
         const results = this.calcService.calculateSopNeeds(
             sop, safeValues, isNaN(margin) ? 0 : margin, 
             this.localInventoryMap(), 
             this.localRecipeMap()
         );
         this.calculatedItems.set(results);
     } catch(e) {
         console.error("Calculation Error", e);
     }
  }

  selectSop(s: Sop) { this.state.selectedSop.set(s); }
  clearSelection() { 
      this.state.selectedSop.set(null); 
      this.currentFormSopId = null; // Reset tracker
  }

  createNew() {
      this.state.editingSop.set(null);
      this.router.navigate(['/editor']);
  }

  editDirect(sop: Sop, event: Event) {
      event.stopPropagation();
      this.state.editingSop.set(sop);
      this.router.navigate(['/editor']);
  }

  async deleteSop(sop: Sop, event: Event) {
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

              if(await this.confirmation.confirm(`Import SOP: "${data.name}"?`)) {
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

  async duplicateSop(sop: Sop, event: Event) {
      event.stopPropagation();
      if(await this.confirmation.confirm(`Nhân bản SOP: "${sop.name}"?`)) {
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

  onPrintDraft(sop: Sop) {
    const job: PrintJob = {
      sop: sop, inputs: this.form().value, margin: this.safetyMargin(), items: this.calculatedItems(),
      date: new Date(), user: (this.state.currentUser()?.displayName || 'Guest') + ' (Bản nháp)',
    };
    this.printService.prepareSinglePrint(job);
    this.router.navigate(['/batch-print']);
  }

  sendRequest(sop: Sop) {
    this.state.submitRequest(sop, this.calculatedItems(), this.form().value, this.localInventoryMap());
  }
  
  async approveAndCreatePrintJob(sop: Sop) {
    if (!this.auth.canApprove()) return;
    await this.state.directApproveAndPrint(sop, this.calculatedItems(), this.form().value, this.localInventoryMap());
  }
}
