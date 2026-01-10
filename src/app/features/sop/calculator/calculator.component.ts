
import { Component, inject, input, output, effect, signal, computed, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router'; 
import { StateService } from '../../../core/services/state.service';
import { SopService } from '../services/sop.service'; 
import { ToastService } from '../../../core/services/toast.service';
import { PrintService, PrintJob } from '../../../core/services/print.service'; // Added PrintService
import { Sop, CalculatedItem } from '../../../core/models/sop.model';
import { CalculatorService } from '../../../core/services/calculator.service';
import { formatNum, cleanName, generateSlug } from '../../../shared/utils/utils';
import { startWith } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="max-w-8xl mx-auto pb-24 fade-in lg:h-full h-auto flex flex-col no-print px-4 md:px-6">
      
      @if (activeSop(); as currentSop) {
        <!-- VIEW: CALCULATOR FORM -->
        
        <!-- Header Section -->
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 shrink-0 gap-4 pt-4">
           <div>
              <div class="flex items-center gap-2 mb-1.5">
                 <button (click)="clearSelection()" class="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1 transition bg-white border border-slate-200 px-2 py-1 rounded-md shadow-sm active:scale-95">
                    <i class="fa-solid fa-arrow-left"></i> Thư viện
                 </button>
                 <span class="px-2.5 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-700 shadow-sm border border-indigo-200">
                    {{currentSop.category}}
                 </span>
                 @if(currentSop.ref) {
                    <span class="text-xs font-bold text-slate-400 flex items-center gap-1">
                        <i class="fa-solid fa-book-open text-[10px]"></i> {{currentSop.ref}}
                    </span>
                 }
              </div>
              <h2 class="text-2xl md:text-3xl font-black text-slate-800 tracking-tight leading-tight">{{currentSop.name}}</h2>
           </div>
           
           <div class="flex gap-2">
              @if(state.isAdmin()) {
                <button (click)="onEditSop(currentSop)" title="Chỉnh sửa cấu trúc SOP này"
                        class="px-4 py-2 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition text-xs shadow-sm flex items-center gap-2 active:scale-95">
                    <i class="fa-solid fa-pen-to-square"></i> <span>Sửa SOP</span>
                </button>
              }
           </div>
        </div>

        <!-- Main Layout: Inputs (Left) & Results (Right) -->
        <!-- Desktop: Fixed height, Internal Scroll. Mobile: Auto height, Window Scroll. -->
        <div class="flex flex-col lg:flex-row gap-6 lg:gap-8 lg:items-stretch lg:h-full lg:overflow-hidden h-auto">
            
            <!-- LEFT PANEL: INPUTS -->
            <div class="w-full lg:w-[380px] shrink-0 bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden flex flex-col lg:h-full h-auto">
               
               <div class="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3 shrink-0">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-blue-200 shadow-md">
                    <i class="fa-solid fa-sliders"></i>
                  </div>
                  <div>
                      <h3 class="font-bold text-slate-800 text-sm">Thông số Mẻ mẫu</h3>
                      <p class="text-[11px] text-slate-500 font-medium">Nhập số liệu để tính toán</p>
                  </div>
               </div>

               <!-- Content Area: Scrollable on Desktop -->
               <div class="p-5 lg:overflow-y-auto lg:flex-1 lg:min-h-0 custom-scrollbar">
                   <!-- Bind to form() signal -->
                   <form [formGroup]="form()" class="space-y-5">
                      <!-- Dynamic Inputs -->
                      @for (inp of currentSop.inputs; track inp.var) {
                        <div class="group">
                           <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1 transition-colors group-focus-within:text-blue-600">
                               {{inp.label}}
                           </label>
                           
                           @if (inp.type === 'checkbox') {
                              <label class="flex items-center justify-between p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition active:bg-slate-100 select-none bg-white">
                                <span class="text-sm font-bold text-slate-700">Kích hoạt</span>
                                <input type="checkbox" [formControlName]="inp.var" class="w-5 h-5 accent-blue-600 rounded cursor-pointer">
                              </label>
                           } @else {
                              <div class="relative">
                                <input type="number" [formControlName]="inp.var" [step]="inp.step || 1"
                                       class="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition outline-none shadow-inner placeholder-slate-300">
                                @if(inp.unitLabel) {
                                    <span class="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 bg-transparent pointer-events-none uppercase">{{inp.unitLabel}}</span>
                                }
                              </div>
                           }
                        </div>
                      }

                      <!-- Safety Margin (Changed to Number Input) -->
                      <div class="pt-6 mt-2 border-t border-slate-100">
                         <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2 block ml-1">Hệ số hao hụt (An toàn)</label>
                         <div class="relative group">
                            <input type="number" formControlName="safetyMargin" min="0" step="1"
                                   class="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-orange-600 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition outline-none shadow-inner placeholder-slate-300">
                            <span class="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 bg-transparent pointer-events-none uppercase">%</span>
                         </div>
                         <p class="text-[10px] text-slate-400 mt-2 italic flex items-center gap-1 ml-1">
                            <i class="fa-solid fa-circle-info"></i> Tự động cộng thêm % vào tổng lượng cần.
                         </p>
                      </div>
                   </form>
               </div>

               <!-- Actions Footer -->
               <div class="p-5 border-t border-slate-100 bg-slate-50 space-y-3 shrink-0">
                  <!-- Draft Print Button -->
                  <button (click)="onPrintDraft(currentSop)"
                          class="w-full bg-slate-200 border border-slate-300 text-slate-700 hover:bg-slate-300 hover:text-slate-900 font-bold py-3.5 rounded-xl shadow-sm transition flex items-center justify-center gap-2 group active:scale-95">
                      <i class="fa-solid fa-print text-slate-500 group-hover:text-slate-800 transition-colors"></i> 
                      <span>In Bản Nháp (Preview)</span>
                  </button>

                  <button (click)="sendRequest(currentSop)" 
                          class="w-full bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-300 font-bold py-3.5 rounded-xl shadow-sm transition flex items-center justify-center gap-2 group active:scale-95">
                      <i class="fa-regular fa-paper-plane text-slate-400 group-hover:text-blue-500 transition-colors"></i> 
                      <span>Gửi Yêu Cầu Duyệt</span>
                  </button>
                  
                  @if(state.isAdmin()) {
                     <button (click)="approveAndCreatePrintJob(currentSop)"
                             class="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-200 transition flex items-center justify-center gap-2 group active:scale-95">
                         <i class="fa-solid fa-check-double text-white/80 group-hover:text-white group-hover:scale-110 transition-transform"></i> 
                         <span>Duyệt & In Phiếu Ngay</span>
                     </button>
                  }
               </div>
            </div>

            <!-- RIGHT PANEL: RESULTS -->
            <div class="flex-1 bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden flex flex-col lg:h-full h-auto min-h-[500px]">
                <div class="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
                  <h3 class="font-black text-slate-800 text-base flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                        <i class="fa-solid fa-flask-vial"></i>
                    </div>
                    Bảng Dự Trù Hóa Chất
                  </h3>
                  <div class="text-xs font-bold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                      {{calculatedItems().length}} mục
                  </div>
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
                              <tr class="group hover:bg-slate-50/80 transition duration-150">
                                <td class="px-6 py-4 align-top">
                                  <div class="flex flex-col">
                                      <span class="font-bold text-slate-700 text-sm group-hover:text-blue-700 transition-colors">
                                          {{resolveName(item.name)}}
                                      </span>
                                      
                                      <!-- Warnings -->
                                      @if (item.displayWarning) {
                                        <span class="inline-flex items-center gap-1 text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded mt-1 w-fit border border-orange-100">
                                          <i class="fa-solid fa-triangle-exclamation"></i> {{item.displayWarning}}
                                        </span>
                                      }
                                      @if (item.validationError) {
                                         <span class="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded mt-1 w-fit border border-red-100">
                                            <i class="fa-solid fa-circle-xmark"></i> {{item.validationError}}
                                         </span>
                                      }
                                  </div>
                                </td>
                                
                                <td class="px-6 py-4 text-right align-top hidden sm:table-cell">
                                  <div class="flex flex-col items-end gap-1">
                                      @if(item.base_note) {
                                          <span class="text-xs font-medium text-slate-500 italic">{{item.base_note}}</span>
                                      }
                                      <code class="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-mono">{{item.formula}}</code>
                                  </div>
                                </td>

                                <td class="px-6 py-4 text-right align-top">
                                  <span class="font-black text-blue-600 text-lg tabular-nums tracking-tight">
                                    {{formatNum(item.totalQty)}}
                                  </span>
                                </td>
                                
                                <td class="px-6 py-4 text-center align-top">
                                  <span class="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">{{item.unit}}</span>
                                </td>
                              </tr>
                              
                              <!-- Composite Breakdown Row -->
                              @if (item.isComposite) {
                                 <tr class="bg-slate-50/50">
                                    <td colspan="4" class="px-6 py-2 pb-4">
                                        <div class="bg-white border border-slate-200 rounded-lg p-3 shadow-sm ml-4 relative">
                                            <!-- Connection Line -->
                                            <div class="absolute -left-4 top-1/2 w-4 h-px bg-slate-300"></div>
                                            <div class="absolute -left-4 top-0 bottom-1/2 w-px bg-slate-300"></div>

                                            <div class="text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
                                                <i class="fa-solid fa-layer-group"></i> Thành phần pha chế ({{item.name}})
                                            </div>
                                            
                                            <div class="grid gap-2">
                                                @for (sub of item.breakdown; track sub.name) {
                                                    <div class="flex justify-between items-center text-xs border-b border-slate-50 last:border-0 pb-1 last:pb-0">
                                                        <div class="flex items-center gap-2">
                                                            <span class="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                                            <span class="font-medium text-slate-600">{{resolveName(sub.name)}}</span>
                                                            <span class="text-[10px] text-slate-400 italic">({{sub.amountPerUnit}} / {{item.unit}})</span>
                                                        </div>
                                                        <div class="flex items-center gap-1">
                                                            <span class="font-bold text-slate-700 font-mono">{{formatNum(sub.displayAmount)}}</span>
                                                            <span class="text-[10px] text-slate-500">{{sub.unit}}</span>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </td>
                                 </tr>
                              }
                        }
                     </tbody>
                   </table>
                </div>
            </div>
        </div>
      } 
      @else {
        <!-- VIEW: SELECTION LIST (LIBRARY) -->
        <div class="flex flex-col h-full animate-fade-in">
            <!-- Header -->
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shrink-0 pt-4">
                <div>
                    <h2 class="text-2xl font-black text-slate-800">Thư viện Quy trình (SOP)</h2>
                    <p class="text-sm text-slate-500 mt-1">Chọn quy trình để bắt đầu tính toán hoặc quản lý.</p>
                </div>
                
                <div class="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                    <!-- Search -->
                    <div class="relative w-full md:w-64 group">
                        <i class="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"></i>
                        <input type="text" [ngModel]="searchTerm()" (ngModelChange)="searchTerm.set($event)" 
                               class="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 shadow-sm transition-all"
                               placeholder="Tìm kiếm SOP...">
                    </div>
                    
                    <!-- Import Button -->
                    @if(state.isAdmin()) {
                        <button (click)="fileInput.click()" class="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 active:scale-95 shadow-sm">
                            <i class="fa-solid fa-file-import"></i> Nhập File JSON
                        </button>
                        <input #fileInput type="file" class="hidden" accept=".json" (change)="onImport($event)">
                    }
                </div>
            </div>

            <!-- List Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pb-10 custom-scrollbar">
                @for (sop of filteredSops(); track sop.id) {
                    <div class="bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-50 transition-all duration-300 group flex flex-col justify-between h-full min-h-[180px] relative">
                        
                        <!-- Main Click Area -->
                        <div (click)="selectSop(sop)" class="cursor-pointer flex-1">
                            <div class="flex items-center justify-between mb-3">
                                <span class="bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md border border-slate-200 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-colors">
                                    {{sop.category}}
                                </span>
                                @if(sop.version) {
                                    <span class="text-[10px] font-mono text-slate-400">v{{sop.version}}</span>
                                }
                            </div>
                            <h3 class="font-bold text-slate-700 text-lg leading-snug mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
                                {{sop.name}}
                            </h3>
                            @if(sop.ref) {
                                <p class="text-xs text-slate-400 italic flex items-center gap-1 mb-2">
                                    <i class="fa-solid fa-book-bookmark text-[10px]"></i> {{sop.ref}}
                                </p>
                            }
                        </div>

                        <!-- Footer Actions -->
                        <div class="pt-4 mt-auto border-t border-slate-50 flex items-center justify-between gap-2">
                            <div class="text-xs text-slate-400">{{sop.consumables.length}} thành phần</div>
                            
                            <!-- Action Buttons -->
                            <div class="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                @if(state.isAdmin()) {
                                    <button (click)="duplicateSop(sop)" class="w-7 h-7 rounded flex items-center justify-center text-slate-500 hover:bg-purple-50 hover:text-purple-600 transition" title="Sao chép (Duplicate)">
                                        <i class="fa-regular fa-copy"></i>
                                    </button>
                                }
                                <button (click)="exportSop(sop)" class="w-7 h-7 rounded flex items-center justify-center text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition" title="Xuất file (Export)">
                                    <i class="fa-solid fa-download"></i>
                                </button>
                                <button (click)="selectSop(sop)" class="w-7 h-7 rounded flex items-center justify-center text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white transition shadow-sm ml-1" title="Chọn">
                                    <i class="fa-solid fa-arrow-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                } @empty {
                    <div class="col-span-full py-20 text-center text-slate-400">
                        <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl text-slate-300">
                            <i class="fa-solid fa-folder-open"></i>
                        </div>
                        <p class="font-bold">Không tìm thấy quy trình nào.</p>
                        <p class="text-xs mt-1">Thử tìm kiếm với từ khóa khác.</p>
                    </div>
                }
            </div>
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
  private calcService = inject(CalculatorService);
  private sopService = inject(SopService);
  private router: Router = inject(Router);
  private toast = inject(ToastService);
  private printService = inject(PrintService); // Inject PrintService
  
  // Logic: Use Input if present (from direct binding), otherwise use State (from internal nav)
  activeSop = computed(() => this.sopInput() || this.state.selectedSop());
  
  // Search logic for list view
  searchTerm = signal('');
  
  filteredSops = computed(() => {
      const term = this.searchTerm().toLowerCase();
      // 1. Filter
      const list = this.state.sops().filter(s => 
          s.name.toLowerCase().includes(term) || 
          s.category.toLowerCase().includes(term)
      );
      
      // 2. Natural Sort by Category (Numeric Aware)
      return list.sort((a, b) => {
          const catCompare = a.category.localeCompare(b.category, 'en', { numeric: true, sensitivity: 'base' });
          if (catCompare !== 0) return catCompare;
          return a.name.localeCompare(b.name, 'en', { numeric: true });
      });
  });

  // Use a Signal for the Form Group to ensure view updates when form instance changes
  form = signal<FormGroup>(this.fb.group({ safetyMargin: [10] }));
  private formValueSub?: Subscription;

  calculatedItems = signal<CalculatedItem[]>([]);
  safetyMargin = signal<number>(10);
  
  cleanName = cleanName;
  formatNum = formatNum;

  constructor() {
    effect((onCleanup) => {
      const s = this.activeSop();
      
      // Clean up previous subscription
      this.formValueSub?.unsubscribe();

      if (s) {
        // 1. Prepare Controls based on SOP
        const controls: Record<string, any> = { safetyMargin: [10] };
        s.inputs.forEach(i => {
            // Check for name collision with safetyMargin
            if (i.var !== 'safetyMargin') {
                controls[i.var] = [i.default !== undefined ? i.default : 0];
            }
        });
        
        // 2. Create NEW Form Instance
        const newForm = this.fb.group(controls);
        
        // 3. Update Signal (Triggers Template Update)
        this.form.set(newForm);
        
        // 4. Subscribe to NEW Form Changes
        this.formValueSub = newForm.valueChanges.pipe(
          startWith(newForm.value)
        ).subscribe(vals => {
             this.runCalculation(s, vals);
             // Ensure it handles string inputs from UI gracefully
             const margin = Number(vals.safetyMargin);
             this.safetyMargin.set(isNaN(margin) ? 0 : margin);
        });
        
      } else {
         this.calculatedItems.set([]);
      }

      onCleanup(() => this.formValueSub?.unsubscribe());
    });
  }
  
  ngOnDestroy(): void {
    this.formValueSub?.unsubscribe();
  }

  selectSop(s: Sop) {
      this.state.selectedSop.set(s);
  }

  clearSelection() {
      this.state.selectedSop.set(null);
  }

  onEditSop(s: Sop) {
    if (s) this.editSop.emit(s);
  }

  // --- ACTIONS ---

  duplicateSop(sop: Sop) {
      // Create copy
      const copy: Sop = {
          ...sop,
          id: '', // Clear ID to force new creation
          name: `${sop.name} (Copy)`,
          version: 1
      };
      // Set as editing SOP in state
      this.state.editingSop.set(copy);
      // Navigate to editor
      this.router.navigate(['/editor']);
  }

  exportSop(sop: Sop) {
      const dataStr = JSON.stringify(sop, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SOP_${sop.category}_${generateSlug(sop.name)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      this.toast.show('Đã xuất file SOP thành công!');
  }

  onImport(event: any) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (e: any) => {
          try {
              const json = JSON.parse(e.target.result);
              // Basic validation
              if (!json.name || !json.category || !json.consumables) {
                  throw new Error('Cấu trúc file không hợp lệ');
              }
              
              await this.sopService.saveSop(json);
              this.toast.show('Nhập SOP thành công!', 'success');
              event.target.value = ''; // Reset input
          } catch (err) {
              console.error(err);
              this.toast.show('Lỗi nhập file: ' + (err as any).message, 'error');
          }
      };
      reader.readAsText(file);
  }

  // --- CALCULATOR LOGIC ---

  resolveName(id: string): string {
    const item = this.state.inventoryMap()[id];
    return item ? (item.name || item.id) : id;
  }

  runCalculation(sop: Sop, values: any) {
     const safeValues = (values || {}) as Record<string, any>;
     const margin = Number(safeValues['safetyMargin'] || 0);
     
     const results = this.calcService.calculateSopNeeds(
       sop, 
       safeValues, 
       isNaN(margin) ? 0 : margin
     );
     this.calculatedItems.set(results);
  }

  onPrintDraft(sop: Sop) {
    const job: PrintJob = {
      sop: sop,
      inputs: this.form().value,
      margin: this.safetyMargin(),
      items: this.calculatedItems(),
      date: new Date(),
      user: (this.state.currentUser()?.displayName || 'Guest') + ' (Bản nháp)',
    };

    this.printService.prepareSinglePrint(job);
    this.router.navigate(['/batch-print']);
  }

  sendRequest(sop: Sop) {
    this.state.submitRequest(sop, this.calculatedItems(), this.form().value);
  }
  
  async approveAndCreatePrintJob(sop: Sop) {
    if (!this.state.isAdmin()) return;
    await this.state.directApproveAndPrint(sop, this.calculatedItems(), this.form().value);
  }
}
