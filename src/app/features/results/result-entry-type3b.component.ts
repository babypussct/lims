import { Component, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalysisResultDraft } from '../../core/models/analysis-result.model';

@Component({
  selector: 'app-result-entry-type3b',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fade-in">
      
      <!-- 1. Metadata Form & Checkboxes -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 space-y-4">
        <h4 class="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 pb-2">
          <i class="fa-solid fa-file-invoice mr-2 text-indigo-500"></i> Thông tin chung & Đánh giá (Dạng 3B)
        </h4>

        <!-- Signature Dates -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase">Ngày ký Người phân tích</label>
            <input type="date" 
                   [(ngModel)]="draft.page1Data.ngayNguoiPhanTich" 
                   (ngModelChange)="onDataChanged()"
                   class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition outline-none">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase">Ngày ký Người thẩm tra</label>
            <input type="date" 
                   [(ngModel)]="draft.page1Data.ngayNguoiThamTra" 
                   (ngModelChange)="onDataChanged()"
                   class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition outline-none">
          </div>
        </div>

        <!-- Checkbox & QC segment controls grid (Dynamic from SOP metadata configuration) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          @for (checkbox of checkboxList; track checkbox.key) {
            @if (isGeneralObservation(checkbox.key)) {
              <!-- Standard observation checkbox -->
              <label class="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 border border-slate-100 dark:border-slate-700/30 cursor-pointer select-none transition bg-slate-50/20 dark:bg-slate-900/10">
                <input type="checkbox" 
                       [(ngModel)]="draft.page1Data[checkbox.key]" 
                       (ngModelChange)="onCheckboxChange(checkbox.key)"
                       class="mt-1 w-4 h-4 rounded text-fuchsia-600 border-slate-300 focus:ring-fuchsia-500 focus:ring-2 dark:bg-slate-900 dark:border-slate-700">
                <div>
                  <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-tight block">{{ checkbox.label }}</span>
                </div>
              </label>
            } @else {
              <!-- QC evaluation with Đạt / Không đạt Segment Control -->
              <div class="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/80 transition hover:border-slate-300 dark:hover:border-slate-700">
                <div class="flex-1 min-w-0 pr-1">
                  <span class="text-[11px] font-bold text-slate-700 dark:text-slate-200 leading-snug block break-words">
                    {{ checkbox.label }}
                  </span>
                </div>
                
                <!-- Pass / Fail selector -->
                <div class="flex items-center bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg border border-slate-250/30 dark:border-slate-800 shrink-0">
                  <!-- Button 'Đạt' (true) -->
                  <button type="button"
                          (click)="setQcStatus(checkbox.key, true)"
                          [class]="draft.page1Data[checkbox.key] === true 
                            ? 'px-2.5 py-1 text-[11px] font-bold rounded-md bg-emerald-500 text-white shadow-sm transition-all duration-200' 
                            : 'px-2.5 py-1 text-[11px] font-semibold rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors'"
                          title="Đạt tiêu chí">
                    Đạt
                  </button>
                  
                  <!-- Button 'Không đạt' (false) -->
                  <button type="button"
                          (click)="setQcStatus(checkbox.key, false)"
                          [class]="draft.page1Data[checkbox.key] === false 
                            ? 'px-2.5 py-1 text-[11px] font-bold rounded-md bg-rose-500 text-white shadow-sm transition-all duration-200' 
                            : 'px-2.5 py-1 text-[11px] font-semibold rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors'"
                          title="Không đạt tiêu chí">
                    K.Đạt
                  </button>

                  <!-- Button 'N/A' (undefined) -->
                  <button type="button"
                          (click)="setQcStatus(checkbox.key, undefined)"
                          [class]="draft.page1Data[checkbox.key] === undefined || draft.page1Data[checkbox.key] === null
                            ? 'px-2 py-1 text-[10px] font-extrabold rounded-md bg-slate-300 dark:bg-slate-700 text-slate-750 dark:text-slate-250 shadow-sm transition-all duration-200' 
                            : 'px-2 py-1 text-[10px] font-semibold rounded-md text-slate-400 dark:text-slate-500 hover:text-slate-600 transition-colors'"
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
      <div class="flex items-center gap-2 overflow-x-auto custom-scrollbar py-2 shrink-0">
        @for (sampleCode of run.sampleList; track sampleCode; let idx = $index) {
          <button (click)="selectSample(sampleCode)"
                  [class]="activeSampleCode() === sampleCode 
                    ? 'bg-fuchsia-600 dark:bg-fuchsia-500 text-white font-bold shadow-md shadow-fuchsia-200 dark:shadow-none' 
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'"
                  class="px-5 py-3 rounded-xl text-xs transition flex items-center gap-2 font-semibold shrink-0">
            <span class="w-4 h-4 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center text-[10px]">{{ idx + 1 }}</span>
            <span class="font-mono">{{ sampleCode }}</span>
          </button>
        }
      </div>

      <!-- 3. Compound Checklist & QCs -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 space-y-4">
        <!-- Panel Header -->
        <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-3">
          <div>
            <h4 class="text-sm font-bold text-slate-800 dark:text-slate-200">
              <i class="fa-solid fa-flask-vial mr-2 text-fuchsia-500"></i>
              Bảng kết quả mẫu: <span class="font-mono text-fuchsia-600 dark:text-fuchsia-400 font-bold ml-1">{{ activeSampleCode() }}</span>
            </h4>
            <p class="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
              Tổng cộng {{ config.compounds?.length || 0 }} hoạt chất cần kiểm nghiệm.
            </p>
          </div>

          <!-- Bulk Actions for the Selected Sample -->
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mr-1">Mẫu này:</span>
            
            <button (click)="sampleBulkFillND()" 
                    class="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/30 rounded-lg text-xs font-bold transition flex items-center gap-1.5">
              <i class="fa-solid fa-pen-nib"></i>
              <span>Đặt tất cả KPH</span>
            </button>

            <button (click)="sampleBulkQC()" 
                    class="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/30 rounded-lg text-xs font-bold transition flex items-center gap-1.5">
              <i class="fa-solid fa-circle-check"></i>
              <span>Tất cả QC Đạt</span>
            </button>

            <button (click)="copyActiveSampleToAll()" 
                    class="px-3 py-1.5 bg-gradient-to-r from-fuchsia-500 to-indigo-500 hover:from-fuchsia-600 hover:to-indigo-600 text-white rounded-lg text-xs font-black shadow-sm transition flex items-center gap-1.5"
                    title="Sao chép toàn bộ kết quả của mẫu đang hiển thị cho tất cả các mẫu khác trong mẻ chạy này">
              <i class="fa-solid fa-copy"></i>
              <span>Sao chép mẫu cho cả mẻ</span>
            </button>
          </div>
        </div>

        <!-- Compound List Table -->
        <div class="overflow-x-auto custom-scrollbar border border-slate-200 dark:border-slate-700 rounded-xl">
          <table class="w-full text-sm border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                <th class="py-3 px-4 text-left font-bold text-slate-500 dark:text-slate-400 text-xs w-12 text-center">STT</th>
                <th class="py-3 px-4 text-left font-bold text-slate-500 dark:text-slate-400 text-xs min-w-[150px]">Hoạt chất</th>
                <th class="py-3 px-4 text-center font-bold text-slate-500 dark:text-slate-400 text-xs w-28">KPH / ND</th>
                <th class="py-3 px-4 text-left font-bold text-slate-500 dark:text-slate-400 text-xs min-w-[120px]">Kết quả (µg/kg)</th>
                
                <!-- 3 QC Columns -->
                <th class="py-3 px-4 text-center font-bold text-slate-500 dark:text-slate-400 text-xs w-28">QC1 (Đường chuẩn)</th>
                <th class="py-3 px-4 text-center font-bold text-slate-500 dark:text-slate-400 text-xs w-28">QC2 (Độ thu hồi IS)</th>
                <th class="py-3 px-4 text-center font-bold text-slate-500 dark:text-slate-400 text-xs w-28">QC3 (Độ lệch RT)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50">
              @for (compound of config.compounds; track compound; let idx = $index) {
                <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                  <td class="py-2.5 px-4 font-mono text-xs text-slate-400 font-bold text-center">{{ idx + 1 }}</td>
                  <td class="py-2.5 px-4 text-slate-700 dark:text-slate-200 font-bold text-xs">{{ compound }}</td>
                  
                  <!-- ND Checkbox -->
                  <td class="py-2.5 px-4 text-center">
                    <input type="checkbox"
                           [(ngModel)]="draft.resultData[activeSampleCode()][compound + '_nd']"
                           (ngModelChange)="onNdCheckboxChanged(compound)"
                           class="w-4 h-4 rounded text-fuchsia-600 border-slate-300 focus:ring-fuchsia-500 dark:bg-slate-900 dark:border-slate-700">
                  </td>

                  <!-- Result Input -->
                  <td class="py-1 px-2">
                    <input type="text"
                           [(ngModel)]="draft.resultData[activeSampleCode()][compound]"
                           (ngModelChange)="onResultInputChanged(compound)"
                           placeholder="ND / Số lượng..."
                           class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-semibold focus:ring-1 focus:ring-fuchsia-500 focus:border-fuchsia-500 outline-none">
                  </td>

                  <!-- QC1 Dropdown -->
                  <td class="py-1 px-2">
                    <select [(ngModel)]="draft.resultData[activeSampleCode()][compound + '_qc1']"
                            (ngModelChange)="onDataChanged()"
                            class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-1 focus:ring-fuchsia-500 focus:border-fuchsia-500 outline-none">
                      <option value="Đạt">Đạt</option>
                      <option value="Không đạt">Không đạt</option>
                    </select>
                  </td>

                  <!-- QC2 Dropdown -->
                  <td class="py-1 px-2">
                    <select [(ngModel)]="draft.resultData[activeSampleCode()][compound + '_qc2']"
                            (ngModelChange)="onDataChanged()"
                            class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-1 focus:ring-fuchsia-500 focus:border-fuchsia-500 outline-none">
                      <option value="Đạt">Đạt</option>
                      <option value="Không đạt">Không đạt</option>
                    </select>
                  </td>

                  <!-- QC3 Dropdown -->
                  <td class="py-1 px-2">
                    <select [(ngModel)]="draft.resultData[activeSampleCode()][compound + '_qc3']"
                            (ngModelChange)="onDataChanged()"
                            class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-1 focus:ring-fuchsia-500 focus:border-fuchsia-500 outline-none">
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

  checkboxList: { key: string; label: string }[] = [];
  activeSampleCode = signal<string>('');

  ngOnInit() {
    if (this.run.sampleList && this.run.sampleList.length > 0) {
      this.activeSampleCode.set(this.run.sampleList[0]);
    }

    if (this.config.checkboxLines) {
      this.checkboxList = Object.entries(this.config.checkboxLines).map(([label, key]) => ({
        key: key as string,
        label
      }));
    }
  }

  selectSample(sampleCode: string) {
    this.activeSampleCode.set(sampleCode);
  }

  onDataChanged() {
    this.draftChanged.emit(this.draft);
  }

  onCheckboxChange(changedKey: string) {
    if (changedKey === 'checkTatCaND' && this.draft.page1Data.checkTatCaND) {
      this.draft.page1Data.checkCoMauPhatHien = false;
    } else if (changedKey === 'checkCoMauPhatHien' && this.draft.page1Data.checkCoMauPhatHien) {
      this.draft.page1Data.checkTatCaND = false;
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
        row[c] = 'KPH';
        row[`${c}_nd`] = true;
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
        row[`${c}_qc1`] = 'Đạt';
        row[`${c}_qc2`] = 'Đạt';
        row[`${c}_qc3`] = 'Đạt';
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
          // Sao chép từng hoạt chất kết quả và cờ QC, ND
          this.config.compounds.forEach((c: string) => {
            destRow[c] = sourceData[c] || 'KPH';
            destRow[`${c}_nd`] = sourceData[`${c}_nd`] !== false;
            destRow[`${c}_qc1`] = sourceData[`${c}_qc1`] || 'Đạt';
            destRow[`${c}_qc2`] = sourceData[`${c}_qc2`] || 'Đạt';
            destRow[`${c}_qc3`] = sourceData[`${c}_qc3`] || 'Đạt';
          });
        }
      }
    });
    this.onDataChanged();
  }

  isGeneralObservation(key: string): boolean {
    return key === 'checkTatCaND' || key === 'checkCoMauPhatHien';
  }

  setQcStatus(key: string, value: boolean | undefined) {
    this.draft.page1Data[key] = value;
    this.onDataChanged();
  }
}
