
import { Component, inject, input, output, effect, signal, computed, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { StateService } from '../services/state.service';
import { Sop, CalculatedItem } from '../models/sop.model';
import { CalculatorService } from '../services/calculator.service';
import { PrintService } from '../services/print.service';
import { formatNum, cleanName } from '../utils/utils';
import { startWith } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-7xl mx-auto pb-20 fade-in h-full flex flex-col no-print">
      @if (sop(); as currentSop) {
        <div class="flex items-center justify-between mb-4 shrink-0">
           <div>
              <div class="flex items-center gap-2 mb-1">
                 <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700">{{currentSop.category}}</span>
                 <span class="text-xs text-slate-500 italic">{{currentSop.ref}}</span>
              </div>
              <h2 class="text-2xl font-bold text-slate-800">{{currentSop.name}}</h2>
           </div>
           
           <div class="flex gap-2">
              @if(state.isAdmin()) {
                <button (click)="onEditSop()" title="Sửa SOP này"
                        class="px-5 py-2 bg-white border border-slate-300 text-slate-600 font-bold rounded-lg hover:bg-slate-50 transition text-sm shadow-sm flex items-center gap-2">
                    <i class="fa-solid fa-pen-to-square"></i> <span>Sửa</span>
                </button>
              }
           </div>
        </div>

        <div class="flex flex-col lg:flex-row gap-6 items-start h-full overflow-hidden">
            
            <div class="w-full lg:w-1/3 bg-white rounded-xl shadow-sm border border-slate-200 p-5 overflow-y-auto max-h-full">
               <div class="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                  <div class="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <i class="fa-solid fa-sliders"></i>
                  </div>
                  <h3 class="font-bold text-slate-700">Tham số đầu vào</h3>
               </div>

               <form [formGroup]="form" class="space-y-4">
                  @for (inp of currentSop.inputs; track inp.var) {
                    <div>
                       <label class="block text-sm font-bold text-slate-700 mb-1">{{inp.label}}</label>
                       @if (inp.type === 'checkbox') {
                          <div class="flex items-center gap-2">
                            <input type="checkbox" [formControlName]="inp.var" class="w-5 h-5 accent-blue-600">
                            <span class="text-sm text-slate-500">Kích hoạt</span>
                          </div>
                       } @else {
                          <div class="relative">
                            <input type="number" [formControlName]="inp.var" [step]="inp.step || 1"
                                   class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-lg font-bold text-blue-700 focus:bg-white focus:ring-2 focus:ring-blue-500 transition outline-none pr-10">
                            @if(inp.unitLabel) {
                                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">{{inp.unitLabel}}</span>
                            }
                          </div>
                       }
                    </div>
                  }

                  <div class="pt-4 mt-6 border-t border-slate-100">
                     <div class="flex justify-between items-center mb-2">
                        <label class="text-sm font-bold text-slate-600">Hao hụt an toàn</label>
                        <span class="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded">+{{safetyMargin()}}%</span>
                     </div>
                     <input type="range" min="0" max="50" step="5" 
                            [formControlName]="'safetyMargin'"
                            class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600">
                  </div>
               </form>

               <div class="mt-8 space-y-2">
                  <button (click)="sendRequest(currentSop)" 
                          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-200 transition flex items-center justify-center gap-2 group">
                      <i class="fa-regular fa-paper-plane group-hover:translate-x-1 transition"></i> Gửi Yêu Cầu Duyệt
                  </button>
                  @if(state.isAdmin()) {
                     <button (click)="approveAndCreatePrintJob(currentSop)"
                             class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-emerald-200 transition flex items-center justify-center gap-2 group">
                         <i class="fa-solid fa-check-double group-hover:scale-110 transition"></i> Duyệt & Tạo Phiếu In
                     </button>
                  }
               </div>
            </div>

            <div class="w-full lg:w-2/3 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col max-h-full">
                <div class="bg-slate-50/50 px-5 py-3 border-b border-slate-200">
                  <h3 class="font-bold text-slate-700 flex items-center gap-2">
                    <i class="fa-solid fa-table-list text-purple-500"></i> Bảng dự trù hóa chất
                  </h3>
                </div>
                
                <div class="overflow-y-auto flex-1 p-0">
                   <table class="w-full text-sm text-left">
                     <thead class="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 shadow-sm">
                        <tr>
                          <th class="px-6 py-3 font-semibold">Hóa chất / Vật tư</th>
                          <th class="px-6 py-3 font-semibold text-right">Định mức</th>
                          <th class="px-6 py-3 font-semibold text-center w-32">Tổng Cần</th>
                          <th class="px-6 py-3 font-semibold text-center w-20">Đơn vị</th>
                        </tr>
                     </thead>
                     <tbody class="divide-y divide-slate-100">
                        @for (item of calculatedItems(); track item.name) {
                              <tr class="group hover:bg-slate-50 transition">
                                <td class="px-6 py-3">
                                  <div class="font-bold text-slate-700">{{resolveName(item.name)}}</div>
                                  @if (item.displayWarning) {
                                    <div class="text-[10px] text-orange-600 font-bold mt-0.5 flex items-center gap-1">
                                      <i class="fa-solid fa-triangle-exclamation"></i> {{item.displayWarning}}
                                    </div>
                                  }
                                  @if (item.validationError) {
                                     <div class="text-[10px] text-red-600 font-bold mt-0.5">{{item.validationError}}</div>
                                  }
                                </td>
                                <td class="px-6 py-3 text-right text-slate-500 text-xs font-medium font-mono">
                                  {{item.base_note || item.formula}}
                                </td>
                                <td class="px-6 py-3 text-right">
                                  <span class="font-bold text-blue-700 text-base bg-blue-50 px-2 py-1 rounded">
                                    {{formatNum(item.totalQty)}}
                                  </span>
                                </td>
                                <td class="px-6 py-3 text-center text-xs font-bold text-slate-500">
                                  {{item.unit}}
                                </td>
                              </tr>
                              
                              @if (item.isComposite) {
                                 @for (sub of item.breakdown; track sub.name) {
                                   <tr class="bg-slate-50/50 border-b border-slate-50">
                                      <td class="px-6 py-2 pl-12 relative">
                                        <div class="absolute left-6 top-0 bottom-0 w-px bg-slate-200"></div>
                                        <div class="absolute left-6 top-1/2 w-4 h-px bg-slate-200"></div>
                                        <span class="text-xs font-medium text-slate-600">{{resolveName(sub.name)}}</span>
                                      </td>
                                      <td class="px-6 py-2 text-right text-xs text-slate-400 italic">
                                         ({{sub.amountPerUnit}} / {{item.unit}})
                                      </td>
                                      <td class="px-6 py-2 text-right font-semibold text-slate-700 text-sm">
                                         {{formatNum(sub.displayAmount)}}
                                      </td>
                                      <td class="px-6 py-2 text-center text-xs text-slate-400">
                                         {{sub.unit}}
                                      </td>
                                   </tr>
                                 }
                              }
                        }
                     </tbody>
                   </table>
                </div>
            </div>
        </div>
      }
    </div>
  `
})
export class CalculatorComponent implements OnDestroy {
  sop = input<Sop | null>(null);
  editSop = output<Sop>();
  
  private fb: FormBuilder = inject(FormBuilder);
  public state = inject(StateService);
  private calcService = inject(CalculatorService);
  
  form: FormGroup = this.fb.group({ safetyMargin: [10] });
  private formValueSub?: Subscription;

  calculatedItems = signal<CalculatedItem[]>([]);
  safetyMargin = signal<number>(10);
  
  cleanName = cleanName;
  formatNum = formatNum;

  constructor() {
    effect((onCleanup) => {
      const s = this.sop();
      this.formValueSub?.unsubscribe();

      if (s) {
        const initialValues: Record<string, any> = { safetyMargin: 10 };
        s.inputs.forEach(i => initialValues[i.var] = i.default);
        
        const controls: Record<string, any> = { safetyMargin: [initialValues['safetyMargin']] };
        s.inputs.forEach(i => controls[i.var] = [initialValues[i.var]]);
        this.form = this.fb.group(controls);
        
        this.formValueSub = this.form.valueChanges.pipe(
          startWith(this.form.value)
        ).subscribe(vals => {
             this.runCalculation(s, vals);
             this.safetyMargin.set(vals.safetyMargin || 0);
        });
        
        onCleanup(() => this.formValueSub?.unsubscribe());
      }
    });
  }
  
  ngOnDestroy(): void {
    this.formValueSub?.unsubscribe();
  }

  onEditSop() {
    const s = this.sop();
    if (s) this.editSop.emit(s);
  }

  resolveName(id: string): string {
    const item = this.state.inventoryMap()[id];
    return item ? (item.name || item.id) : id;
  }

  runCalculation(sop: Sop, values: any) {
     const results = this.calcService.calculateSopNeeds(sop, values, values.safetyMargin || 0);
     this.calculatedItems.set(results);
  }

  sendRequest(sop: Sop) {
    this.state.submitRequest(sop, this.calculatedItems(), this.form.value);
  }
  
  async approveAndCreatePrintJob(sop: Sop) {
    if (!this.state.isAdmin()) return;
    await this.state.directApproveAndPrint(sop, this.calculatedItems(), this.form.value);
  }
}
