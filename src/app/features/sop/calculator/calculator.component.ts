
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
        <!-- VIEW: CALCULATOR FORM (RUNNER) -->
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
            
            <!-- LEFT PANEL: INPUTS (Fixed CSS for content cut-off) -->
            <div class="w-full lg:w-[380px] shrink-0 bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden flex flex-col lg:h-full h-auto min-h-[400px]">
               <div class="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3 shrink-0">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-blue-200 shadow-md">
                    <i class="fa-solid fa-sliders"></i>
                  </div>
                  <div><h3 class="font-bold text-slate-800 text-sm">Thông số Mẻ mẫu</h3></div>
               </div>

               <!-- Make this section scrollable and flex-grow to avoid cut-off -->
               <div class="p-5 flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                   @if (form()) {
                       <form [formGroup]="form()" class="space-y-5">
                          <!-- Date Field -->
                          <div class="group">
                             <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Ngày phân tích</label>
                             <div class="relative">
                                <input type="date" formControlName="analysisDate"
                                       class="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:bg-white focus:border-blue-500 outline-none transition shadow-sm">
                             </div>
                          </div>

                          <div class="h-px bg-slate-100 my-2"></div>

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
        <div class="flex flex-col h-full animate-fade-in relative">
            
            <!-- Backdrop for Menu -->
            @if(activeMenuSopId()) {
                <div class="fixed inset-0 z-10" (click)="closeMenu()"></div>
            }

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
                    
                    <!-- Search & Actions -->
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shrink-0">
                        <div class="relative flex-1 md:max-w-md">
                            <i class="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                            <input type="text" [ngModel]="searchTerm()" (ngModelChange)="searchTerm.set($event)" 
                                   class="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 shadow-sm transition" 
                                   placeholder="Tìm kiếm SOP...">
                        </div>
                        
                        @if(auth.canEditSop()) {
                            <div class="flex gap-2 self-end md:self-auto">
                                <button (click)="importFileInput.click()" class="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 px-4 py-2 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 shrink-0 active:scale-95" title="Import SOP từ file JSON">
                                    <i class="fa-solid fa-file-import"></i> <span class="hidden md:inline">Import</span>
                                </button>
                                <input #importFileInput type="file" class="hidden" accept=".json" (change)="importSop($event)">

                                <button (click)="createNew()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 shrink-0 active:scale-95">
                                    <i class="fa-solid fa-plus"></i> <span class="hidden md:inline">Tạo mới</span>
                                </button>
                            </div>
                        }
                    </div>

                    <!-- SOP LIST (FLAT GRID SORTED BY CATEGORY) -->
                    <div class="overflow-y-auto pb-10 custom-scrollbar p-1 flex-1">
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            @for (sop of filteredSops(); track sop.id) {
                                <div class="bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-400 hover:shadow-lg transition-all duration-300 group relative flex flex-col h-full min-h-[160px]"
                                     (click)="selectSop(sop)">
                                    
                                    <!-- Top Row: Category Badge & Actions -->
                                    <div class="flex justify-between items-start mb-2">
                                        <div class="flex items-center gap-2 flex-wrap">
                                            <span class="text-[10px] font-bold uppercase text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 truncate max-w-[120px]" [title]="sop.category">
                                                {{sop.category}}
                                            </span>
                                            @if(sop.version) { 
                                                <span class="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">v{{sop.version}}</span> 
                                            }
                                        </div>
                                        
                                        <!-- MENU BUTTON -->
                                        <button (click)="toggleMenu(sop.id, $event)" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition relative z-20 -mr-2 -mt-2">
                                            <i class="fa-solid fa-ellipsis-vertical"></i>
                                        </button>

                                        <!-- DROPDOWN MENU -->
                                        @if (activeMenuSopId() === sop.id) {
                                            <div class="absolute top-8 right-2 bg-white rounded-xl shadow-xl border border-slate-100 py-1 w-48 z-30 animate-slide-up overflow-hidden" (click)="$event.stopPropagation()">
                                                <button (click)="exportSop(sop, $event)" class="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition">
                                                    <i class="fa-solid fa-download text-emerald-500 w-4"></i> Export JSON
                                                </button>
                                                @if(auth.canEditSop()) {
                                                    <button (click)="duplicateSop(sop, $event)" class="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition">
                                                        <i class="fa-solid fa-copy text-purple-500 w-4"></i> Nhân bản (Copy)
                                                    </button>
                                                    <button (click)="editDirect(sop, $event)" class="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition">
                                                        <i class="fa-solid fa-pen text-blue-500 w-4"></i> Chỉnh sửa
                                                    </button>
                                                    <div class="h-px bg-slate-100 my-1"></div>
                                                    <button (click)="softDeleteSop(sop, $event)" class="w-full text-left px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 transition">
                                                        <i class="fa-solid fa-box-archive w-4"></i> Lưu trữ (Xóa)
                                                    </button>
                                                }
                                            </div>
                                        }
                                    </div>

                                    <h3 class="font-bold text-slate-700 text-lg leading-snug mb-2 group-hover:text-blue-700 transition-colors pr-2 line-clamp-2">
                                        {{sop.name}}
                                    </h3>
                                    
                                    <div class="mt-auto pt-3 border-t border-slate-50 flex justify-between items-center text-xs text-slate-400 font-medium">
                                        <span>{{sop.consumables.length}} chất</span>
                                        <span>{{formatDate(sop.lastModified)}}</span>
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
  activeMenuSopId = signal<string | null>(null);
  
  // Track current SOP ID to prevent form resetting loop
  private currentFormSopId: string | null = null;
  
  localInventoryMap = signal<Record<string, InventoryItem>>({});
  localRecipeMap = signal<Record<string, Recipe>>({});
  isLoadingInventory = signal(false);

  // Filtered & Sorted SOPs (Flat List)
  filteredSops = computed(() => {
      const term = this.searchTerm().toLowerCase();
      // Filter out archived sops (soft deleted)
      const allSops = this.state.sops().filter(s => !s.isArchived);
      
      const filtered = allSops.filter(s => s.name.toLowerCase().includes(term) || s.category.toLowerCase().includes(term));
      
      // Sort by Category (Natural Sort) then Name (Natural Sort)
      return filtered.sort((a, b) => {
          const catA = (a.category || '').toLowerCase();
          const catB = (b.category || '').toLowerCase();
          
          // Use naturalCompare for Categories to handle H-9.2 vs H-9.10 vs H-9.21 correctly
          const catCompare = naturalCompare(catA, catB);
          if (catCompare !== 0) return catCompare;
          
          return naturalCompare(a.name, b.name);
      });
  });

  // Init form
  form = signal<FormGroup>(this.fb.group({ safetyMargin: [10], analysisDate: [this.getTodayDate()] }));
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

        // 1. Initialize Form with Defaults
        const controls: Record<string, any> = { 
            safetyMargin: [10],
            analysisDate: [this.getTodayDate()] 
        };
        s.inputs.forEach(i => { if (i.var !== 'safetyMargin') controls[i.var] = [i.default !== undefined ? i.default : 0]; });
        const newForm = this.fb.group(controls);

        // 2. CHECK CACHE: Restore if we have saved state for this SOP
        const cached = this.state.cachedCalculatorState();
        if (cached && cached.sopId === s.id) {
            newForm.patchValue(cached.formValues);
        }

        this.form.set(newForm);

        // 3. Initial Calculation
        this.localInventoryMap.set({}); 
        this.localRecipeMap.set({});
        this.runCalculation(s, newForm.value);

        // 4. Trigger Async Fetch
        this.fetchData(s);

        // 5. Subscribe to Form Changes
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

  getTodayDate(): string {
      return new Date().toISOString().split('T')[0];
  }

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

  // --- Menu Interactions ---
  toggleMenu(id: string, event: Event) {
      event.stopPropagation();
      if (this.activeMenuSopId() === id) {
          this.activeMenuSopId.set(null);
      } else {
          this.activeMenuSopId.set(id);
      }
  }

  closeMenu() {
      this.activeMenuSopId.set(null);
  }

  // --- Actions ---
  selectSop(s: Sop) { this.state.selectedSop.set(s); }
  clearSelection() { 
      this.state.selectedSop.set(null); 
      this.state.cachedCalculatorState.set(null); // Clear cache on manual exit
      this.currentFormSopId = null; 
  }

  createNew() {
      this.state.editingSop.set(null);
      this.router.navigate(['/editor']);
  }

  editDirect(sop: Sop, event: Event) {
      event.stopPropagation();
      this.closeMenu();
      this.state.editingSop.set(sop);
      this.router.navigate(['/editor']);
  }

  // Soft Delete Implementation
  async softDeleteSop(sop: Sop, event: Event) {
      event.stopPropagation();
      this.closeMenu();
      if (await this.confirmation.confirm({ 
          message: `Lưu trữ quy trình "${sop.name}"?\nNó sẽ bị ẩn khỏi danh sách chính.`, 
          confirmText: 'Lưu trữ (Xóa)', 
          isDangerous: true 
      })) {
          try {
              await this.sopService.archiveSop(sop.id);
              this.toast.show('Đã lưu trữ SOP.');
          } catch (e: any) {
              this.toast.show('Lỗi: ' + e.message, 'error');
          }
      }
  }

  exportSop(sop: Sop, event: Event) {
      event.stopPropagation();
      this.closeMenu();
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
              data.isArchived = false;

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
      this.closeMenu();
      if(await this.confirmation.confirm(`Nhân bản SOP: "${sop.name}"?`)) {
          try {
              const newSop: Sop = JSON.parse(JSON.stringify(sop));
              newSop.id = generateSlug(sop.name + '_copy_' + Date.now());
              newSop.name = `${sop.name} (Copy)`;
              newSop.version = 1;
              newSop.lastModified = null;
              newSop.archivedAt = null;
              newSop.isArchived = false;
              
              await this.sopService.saveSop(newSop);
              this.toast.show('Đã nhân bản SOP!', 'success');
          } catch(e: any) {
              this.toast.show('Lỗi: ' + e.message, 'error');
          }
      }
  }

  onPrintDraft(sop: Sop) {
    const inputs = this.form().getRawValue();
    
    // Save state before navigating
    this.state.cachedCalculatorState.set({ sopId: sop.id, formValues: inputs });

    const job: PrintJob = {
      sop: sop, inputs: inputs, margin: this.safetyMargin(), items: this.calculatedItems(),
      date: new Date(), user: (this.state.currentUser()?.displayName || 'Guest') + ' (Bản nháp)',
      analysisDate: inputs.analysisDate // Pass explicit date
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
