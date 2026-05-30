import { Component, Input, Output, EventEmitter, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalysisResultDraft } from '../../core/models/analysis-result.model';
import { MasterTargetService } from '../targets/master-target.service';
import { resolveCompoundDisplayName, isCompoundAssigned } from './shared/compound-id-resolver';

@Component({
  selector: 'app-result-entry-type3b',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fade-in">
      
      <!-- 1. Metadata Form & Checkboxes -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/80 p-5 space-y-4">
        <h4 class="text-xs font-black text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2.5 uppercase tracking-wider flex items-center">
          <i class="fa-solid fa-file-invoice mr-2 text-fuchsia-500 text-sm"></i> Thông tin chung & Đánh giá (Dạng 3B)
        </h4>

        <!-- Signature Dates -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest">Ngày ký Người phân tích</label>
            <input type="date" 
                   [(ngModel)]="draft.page1Data['ngayNguoiPhanTich']" 
                   (ngModelChange)="onDataChanged()"
                   class="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200/80 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition outline-none">
          </div>
          <div>
            <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest">Ngày ký Người thẩm tra</label>
            <input type="date" 
                   [(ngModel)]="draft.page1Data['ngayNguoiThamTra']" 
                   (ngModelChange)="onDataChanged()"
                   class="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200/80 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition outline-none">
          </div>
        </div>

        <!-- Checkbox & QC segment controls grid (Dynamic from SOP metadata configuration) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          @for (checkbox of checkboxList; track checkbox.key) {
            @if (isGeneralObservation(checkbox.key)) {
              <!-- Standard observation checkbox -->
              <label class="flex items-start gap-3 p-3.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 border border-slate-100 dark:border-slate-800/60 cursor-pointer select-none transition bg-slate-50/20 dark:bg-slate-900/10">
                <input type="checkbox" 
                       [(ngModel)]="draft.page1Data[checkbox.key]" 
                       (ngModelChange)="onCheckboxChange(checkbox.key)"
                       class="mt-0.5 w-4 h-4 rounded text-indigo-650 border-slate-350 dark:border-slate-700 focus:ring-indigo-500 focus:ring-2 dark:bg-slate-800 dark:border-slate-700">
                <div>
                  <span class="text-xs font-bold text-slate-700 dark:text-slate-300 leading-tight block">{{ checkbox.label }}</span>
                </div>
              </label>
            } @else {
              <!-- QC evaluation with Đạt / Không đạt Segment Control -->
              <div class="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50/40 dark:bg-slate-955/40 border border-slate-250/25 dark:border-slate-800/60 transition hover:border-slate-350 dark:hover:border-slate-700 shadow-xs">
                <div class="flex-1 min-w-0 pr-1">
                  <span class="text-[11px] font-extrabold text-slate-700 dark:text-slate-200 leading-snug block break-words">
                    {{ checkbox.label }}
                  </span>
                </div>
                
                <!-- Pass / Fail selector -->
                <div class="flex items-center bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg border border-slate-250/30 dark:border-slate-800 shrink-0 select-none">
                  <!-- Button 'Đạt' (true) -->
                  <button type="button"
                          (click)="setQcStatus(checkbox.key, true)"
                          [class]="draft.page1Data[checkbox.key] === true 
                            ? 'px-2.5 py-1 text-[10px] font-black rounded bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs transition duration-150 active:scale-95' 
                            : 'px-2.5 py-1 text-[10px] font-bold rounded text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition duration-150 active:scale-95'"
                          title="Đạt tiêu chí">
                    Đạt
                  </button>
                  
                  <!-- Button 'Không đạt' (false) -->
                  <button type="button"
                          (click)="setQcStatus(checkbox.key, false)"
                          [class]="draft.page1Data[checkbox.key] === false 
                            ? 'px-2.5 py-1 text-[10px] font-black rounded bg-rose-500 hover:bg-rose-600 text-white shadow-xs transition duration-150 active:scale-95' 
                            : 'px-2.5 py-1 text-[10px] font-bold rounded text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition duration-150 active:scale-95'"
                          title="Không đạt tiêu chí">
                    K.Đạt
                  </button>

                  <!-- Button 'N/A' (null) -->
                  <button type="button"
                          (click)="setQcStatus(checkbox.key, null)"
                          [class]="draft.page1Data[checkbox.key] === undefined || draft.page1Data[checkbox.key] === null
                            ? 'px-2 py-1 text-[9px] font-black rounded bg-slate-350 dark:bg-slate-700 text-slate-750 dark:text-slate-250 shadow-xs transition duration-150 active:scale-95' 
                            : 'px-2 py-1 text-[9px] font-bold rounded text-slate-400 dark:text-slate-500 hover:text-slate-600 transition duration-150 active:scale-95'"
                          title="Chưa đánh giá">
                    N/A
                  </button>
                </div>
              </div>
            }
          }
        </div>
      </div>

      <!-- 2. Sample Navigation Tabs -->
      <div class="flex items-center gap-3 overflow-x-auto custom-scrollbar py-2.5 px-3 shrink-0 bg-indigo-50/15 dark:bg-indigo-955/15 border border-indigo-100/40 dark:border-indigo-950/20 rounded-2xl shadow-2xs">
        <span class="text-[10px] font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-widest mr-1">Danh sách mẫu:</span>
        @for (sampleCode of run.sampleList; track sampleCode; let idx = $index) {
          <button (click)="selectSample(sampleCode)"
                  [class]="activeSampleCode() === sampleCode 
                    ? 'bg-fuchsia-600 text-white font-extrabold shadow-sm border border-fuchsia-650 transition shrink-0 active:scale-95' 
                    : 'bg-white dark:bg-slate-900 text-slate-655 dark:text-slate-455 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800/80 transition shrink-0 active:scale-95 shadow-2xs'"
                  class="px-4 py-2.5 rounded-xl text-xs flex items-center gap-2">
            <span [class]="activeSampleCode() === sampleCode
                    ? 'w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black text-white'
                    : 'w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/80'">
              {{ idx + 1 }}
            </span>
            <span class="font-mono font-bold">{{ sampleCode }}</span>
          </button>
        }
      </div>

      <!-- 3. Compound Checklist & QCs -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/80 p-5 space-y-4 animate-fade-in">
        <!-- Panel Header -->
        <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3.5">
          <div>
            <h4 class="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center">
              <i class="fa-solid fa-flask-vial mr-2 text-fuchsia-500 text-sm"></i>
              Bảng kết quả mẫu: <span class="font-mono text-fuchsia-600 dark:text-fuchsia-400 font-extrabold ml-1 bg-fuchsia-50 dark:bg-fuchsia-950/30 px-2 py-0.5 rounded-lg border border-fuchsia-100 dark:border-fuchsia-900/30">{{ activeSampleCode() }}</span>
            </h4>
            <p class="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-1 tracking-wide">
              Tổng cộng {{ config.compounds?.length || 0 }} hoạt chất cần kiểm nghiệm.
            </p>
          </div>

          <!-- Bulk Actions for the Selected Sample -->
          <div class="flex flex-wrap items-center gap-2.5">
            <span class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mr-1">Mẫu này:</span>
            
            <button (click)="sampleBulkFillND()" 
                    class="px-3 py-2 bg-slate-50 dark:bg-slate-850 hover:bg-amber-50 dark:hover:bg-amber-950/20 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 border border-slate-200 dark:border-slate-800 hover:border-amber-200 dark:hover:border-amber-900/30 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 active:scale-95 shadow-2xs">
              <i class="fa-solid fa-pen-nib text-amber-500"></i>
              <span>Đặt tất cả KPH</span>
            </button>

            <button (click)="sampleBulkQC()" 
                    class="px-3 py-2 bg-slate-50 dark:bg-slate-850 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-900/30 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 active:scale-95 shadow-2xs">
              <i class="fa-solid fa-circle-check text-emerald-500"></i>
              <span>Tất cả QC Đạt</span>
            </button>

            <button (click)="copyActiveSampleToAll()" 
                    class="px-3.5 py-2 bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-700 hover:to-indigo-700 text-white rounded-xl text-xs font-black shadow-sm transition flex items-center gap-1.5 active:scale-95"
                    title="Sao chép toàn bộ kết quả của mẫu đang hiển thị cho tất cả các mẫu khác trong mẻ chạy này">
              <i class="fa-solid fa-copy"></i>
              <span>Sao chép mẫu cho cả mẻ</span>
            </button>
          </div>
        </div>

        <!-- Compound List Table -->
        <div class="overflow-x-auto custom-scrollbar border border-slate-200/80 dark:border-slate-800 rounded-2xl max-h-[550px] overflow-y-auto">
          <table class="w-full text-sm border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-955 border-b border-slate-255/80 dark:border-slate-800 sticky top-0 z-20 shadow-2xs">
                <th class="py-3 px-4 text-center font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest w-16">STT</th>
                <th class="py-3 px-4 text-left font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest min-w-[150px]">Hoạt chất</th>
                <th class="py-3 px-4 text-center font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest w-28">KPH / ND</th>
                <th class="py-3 px-4 text-left font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest min-w-[130px]">Kết quả (µg/kg)</th>
                
                <!-- 3 QC Columns -->
                <th class="py-3 px-4 text-center font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest w-32">QC1 (Đường chuẩn)</th>
                <th class="py-3 px-4 text-center font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest w-32">QC2 (Thu hồi IS)</th>
                <th class="py-3 px-4 text-center font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest w-32">QC3 (Độ lệch RT)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800/80">
              @for (compound of config.compounds; track compound; let idx = $index) {
                @let isAssigned = isTargetAssigned(activeSampleCode(), compound);
                <tr [class]="isAssigned 
                      ? 'hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-all focus-within:bg-fuchsia-50/10 dark:focus-within:bg-fuchsia-500/5 border-l-4 border-l-transparent focus-within:border-l-fuchsia-500 duration-150' 
                      : 'bg-slate-50/50 dark:bg-slate-955/20 opacity-60 text-slate-400 select-none border-l-4 border-l-slate-200 dark:border-l-slate-800'"
                    class="transition-all duration-155">
                  <td class="py-2.5 px-4 font-mono text-xs text-slate-400 font-bold text-center">
                    @if (isAssigned) {
                      {{ idx + 1 }}
                    } @else {
                      <i class="fa-solid fa-lock text-[10px] text-slate-450 dark:text-slate-500" title="Chỉ tiêu không được phân tích cho mẫu này"></i>
                    }
                  </td>
                  <td [class.line-through]="!isAssigned" class="py-2.5 px-4 text-slate-700 dark:text-slate-200 font-extrabold text-xs">
                    {{ compoundDisplayNames()[compound] || compound }}
                  </td>
                  
                  <!-- ND Checkbox -->
                  <td class="py-2.5 px-4 text-center">
                    <input type="checkbox"
                           [disabled]="!isAssigned"
                           [(ngModel)]="draft.resultData[activeSampleCode()][compound + '_nd']"
                           (ngModelChange)="onNdCheckboxChanged(compound)"
                           class="w-4 h-4 rounded text-fuchsia-600 border-slate-350 dark:border-slate-700 focus:ring-fuchsia-500 dark:bg-slate-900 disabled:opacity-50">
                  </td>

                  <!-- Result Input -->
                  <td class="py-1.5 px-2">
                    <input type="text"
                           [readonly]="!isAssigned"
                           [(ngModel)]="draft.resultData[activeSampleCode()][compound]"
                           (ngModelChange)="onResultInputChanged(compound)"
                           placeholder="{{ isAssigned ? 'ND / Số lượng...' : 'N/A' }}"
                           class="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-extrabold focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 outline-none text-center shadow-inner transition
                                  {{ isAssigned ? 'bg-white dark:bg-slate-850 text-slate-850 dark:text-slate-200' : 'bg-slate-100/50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-655 cursor-not-allowed border-dashed' }}">
                  </td>

                  <!-- QC1 Dropdown -->
                  <td class="py-1.5 px-2">
                    <select [disabled]="!isAssigned"
                            [(ngModel)]="draft.resultData[activeSampleCode()][compound + '_qc1']"
                            (ngModelChange)="onDataChanged()"
                            class="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-2 py-1.5 text-xs font-extrabold focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 outline-none shadow-2xs transition
                                   {{ isAssigned ? 'bg-white dark:bg-slate-850 text-slate-850 dark:text-slate-200' : 'bg-slate-100/50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-655 cursor-not-allowed border-dashed' }}">
                      <option value="Đạt">Đạt</option>
                      <option value="Không đạt">Không đạt</option>
                    </select>
                  </td>

                  <!-- QC2 Dropdown -->
                  <td class="py-1.5 px-2">
                    <select [disabled]="!isAssigned"
                            [(ngModel)]="draft.resultData[activeSampleCode()][compound + '_qc2']"
                            (ngModelChange)="onDataChanged()"
                            class="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-2 py-1.5 text-xs font-extrabold focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 outline-none shadow-2xs transition
                                   {{ isAssigned ? 'bg-white dark:bg-slate-850 text-slate-850 dark:text-slate-200' : 'bg-slate-100/50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-655 cursor-not-allowed border-dashed' }}">
                      <option value="Đạt">Đạt</option>
                      <option value="Không đạt">Không đạt</option>
                    </select>
                  </td>

                  <!-- QC3 Dropdown -->
                  <td class="py-1.5 px-2">
                    <select [disabled]="!isAssigned"
                            [(ngModel)]="draft.resultData[activeSampleCode()][compound + '_qc3']"
                            (ngModelChange)="onDataChanged()"
                            class="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-2 py-1.5 text-xs font-extrabold focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 outline-none shadow-2xs transition
                                   {{ isAssigned ? 'bg-white dark:bg-slate-850 text-slate-850 dark:text-slate-200' : 'bg-slate-100/50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-655 cursor-not-allowed border-dashed' }}">
                      <option value="Đạt">Đạt</option>
                      <option value="Không đạt">Không đạt</option>
                    </select>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class ResultEntryType3bComponent implements OnInit {
  @Input() run!: any;
  @Input() draft!: AnalysisResultDraft;
  @Input() config!: any;

  @Output() draftChanged = new EventEmitter<AnalysisResultDraft>();

  private masterTargetService = inject(MasterTargetService);
  masterTargets = signal<any[]>([]);
  compoundDisplayNames = signal<Record<string, string>>({});
  checkboxList: { key: string; label: string }[] = [];
  activeSampleCode = signal<string>('');

  async ngOnInit() {
    if (this.run.sampleList && this.run.sampleList.length > 0) {
      this.activeSampleCode.set(this.run.sampleList[0]);
    }

    if (this.config.checkboxLines) {
      this.checkboxList = Object.entries(this.config.checkboxLines).map(([label, key]) => ({
        key: key as string,
        label
      }));
    }

    try {
      const analytes = await this.masterTargetService.getAll();
      this.masterTargets.set(analytes);
      this.buildDisplayNameMap();
    } catch (e) {
      console.warn('Failed to load master analytes', e);
    }

    // Auto-prefill unassigned compounds during grid bootstrap
    this.prefillUnassignedTargets();
  }

  buildDisplayNameMap() {
    if (!this.config.compounds) return;
    const map: Record<string, string> = {};
    for (const compound of this.config.compounds) {
      map[compound] = this.getCompoundDisplayName(compound);
    }
    this.compoundDisplayNames.set(map);
  }

  getCompoundDisplayName(compound: string): string {
    return resolveCompoundDisplayName(compound, this.masterTargets());
  }

  isTargetAssigned(sampleCode: string, compound: string): boolean {
    if (!this.run) return true;
    const targetMap = this.run.sampleTargetMap || (this.run.inputs && this.run.inputs.sampleTargetMap);
    if (!targetMap) return true;
    const assigned = targetMap[sampleCode];
    if (!assigned) return true;
    return isCompoundAssigned(assigned, compound);
  }

  prefillUnassignedTargets() {
    const targetMap = this.run?.sampleTargetMap || (this.run?.inputs && this.run.inputs.sampleTargetMap);
    if (!this.run || !targetMap || !this.config.compounds) return;
    
    const sampleList = this.run.sampleList || [];
    sampleList.forEach((sampleCode: string) => {
      if (!this.draft.resultData[sampleCode]) {
        this.draft.resultData[sampleCode] = { selected: true };
      }
      
      const row = this.draft.resultData[sampleCode];
      this.config.compounds.forEach((c: string) => {
        if (!this.isTargetAssigned(sampleCode, c)) {
          // Pre-fill to prevent validator/checking side effects
          row[c] = 'N/A';
          row[`${c}_nd`] = false;
          row[`${c}_qc1`] = 'Đạt';
          row[`${c}_qc2`] = 'Đạt';
          row[`${c}_qc3`] = 'Đạt';
        }
      });
    });
  }

  selectSample(sampleCode: string) {
    this.activeSampleCode.set(sampleCode);
  }

  onDataChanged() {
    this.draftChanged.emit(this.draft);
  }

  onCheckboxChange(changedKey: string) {
    if (changedKey === 'checkTatCaND' && this.draft.page1Data['checkTatCaND']) {
      this.draft.page1Data['checkCoMauPhatHien'] = false;
    } else if (changedKey === 'checkCoMauPhatHien' && this.draft.page1Data['checkCoMauPhatHien']) {
      this.draft.page1Data['checkTatCaND'] = false;
    }
    this.onDataChanged();
  }

  /**
   * Đồng bộ khi nhấn check KPH/ND: tự điền 'KPH' vào ô kết quả
   */
  onNdCheckboxChanged(compound: string) {
    const active = this.activeSampleCode();
    const row = this.draft.resultData[active];
    if (row) {
      if (row[`${compound}_nd`]) {
        row[compound] = 'KPH';
      } else {
        row[compound] = '';
      }
    }
    this.onDataChanged();
  }

  /**
   * Đồng bộ khi sửa ô kết quả: tự bỏ chọn KPH/ND nếu điền số lượng cụ thể
   */
  onResultInputChanged(compound: string) {
    const active = this.activeSampleCode();
    const row = this.draft.resultData[active];
    if (row) {
      const val = row[compound];
      if (val && val !== 'KPH' && val !== 'ND') {
        row[`${compound}_nd`] = false;
      } else if (!val || val === 'KPH' || val === 'ND') {
        row[`${compound}_nd`] = true;
      }
    }
    this.onDataChanged();
  }

  /**
   * Bulk Action: Đặt tất cả hoạt chất của mẫu đang mở là KPH (Không phát hiện)
   */
  sampleBulkFillND() {
    const active = this.activeSampleCode();
    const row = this.draft.resultData[active];
    if (row && this.config.compounds) {
      this.config.compounds.forEach((c: string) => {
        if (this.isTargetAssigned(active, c)) {
          row[c] = 'KPH';
          row[`${c}_nd`] = true;
        }
      });
    }
    this.onDataChanged();
  }

  /**
   * Bulk Action: Đặt tất cả các QC (QC1, QC2, QC3) của mẫu đang mở là "Đạt"
   */
  sampleBulkQC() {
    const active = this.activeSampleCode();
    const row = this.draft.resultData[active];
    if (row && this.config.compounds) {
      this.config.compounds.forEach((c: string) => {
        if (this.isTargetAssigned(active, c)) {
          row[`${c}_qc1`] = 'Đạt';
          row[`${c}_qc2`] = 'Đạt';
          row[`${c}_qc3`] = 'Đạt';
        }
      });
    }
    this.onDataChanged();
  }

  /**
   * Bulk Action: Sao chép toàn bộ kết quả của mẫu đang mở sang tất cả các mẫu khác trong mẻ chạy
   */
  copyActiveSampleToAll() {
    const sourceSample = this.activeSampleCode();
    const sourceData = this.draft.resultData[sourceSample];
    if (!sourceData || !this.config.compounds) return;

    const sampleList = this.run.sampleList || [];
    sampleList.forEach((sampleCode: string) => {
      if (sampleCode !== sourceSample) {
        const destRow = this.draft.resultData[sampleCode];
        if (destRow) {
          this.config.compounds.forEach((c: string) => {
            // Sao chép chỉ khi hoạt chất đó được gán chung trên cả 2 mẫu nguồn và đích
            if (this.isTargetAssigned(sourceSample, c) && this.isTargetAssigned(sampleCode, c)) {
              destRow[c] = sourceData[c] || 'KPH';
              destRow[`${c}_nd`] = sourceData[`${c}_nd`] !== false;
              destRow[`${c}_qc1`] = sourceData[`${c}_qc1`] || 'Đạt';
              destRow[`${c}_qc2`] = sourceData[`${c}_qc2`] || 'Đạt';
              destRow[`${c}_qc3`] = sourceData[`${c}_qc3`] || 'Đạt';
            }
          });
        }
      }
    });
    this.onDataChanged();
  }

  isGeneralObservation(key: string): boolean {
    return key === 'checkTatCaND' || key === 'checkCoMauPhatHien';
  }

  setQcStatus(key: string, value: boolean | null) {
    this.draft.page1Data[key] = value;
    this.onDataChanged();
  }
}
