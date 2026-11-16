import { Component, Input, Output, EventEmitter, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppDatePickerComponent } from '../../shared/components/ui';
import { AnalysisResultDraft } from '../../core/models/analysis-result.model';
import { MasterTargetService } from '../targets/master-target.service';
import { getAssignedTargetsForSample, resolveCompoundDisplayName, isCompoundAssigned } from './shared/compound-id-resolver';
import { SopMasterDetailCompoundGridComponent } from './sops/shared/sop-master-detail-compound-grid.component';

@Component({
  selector: 'app-result-entry-type3b',
  standalone: true,
  imports: [CommonModule, FormsModule, AppDatePickerComponent, SopMasterDetailCompoundGridComponent],
  template: `
    <div class="space-y-5 animate-fade-in">
      
      <!-- 1. Metadata Form & Checkboxes -->
      <fieldset [disabled]="isReadOnly" class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 p-5 space-y-4">
        <h4 class="text-xs font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2.5 uppercase tracking-wider flex items-center">
          <i class="fa-solid fa-file-invoice mr-2 text-indigo-600 dark:text-indigo-400 text-sm"></i> Thông Tin Chung & Đánh Giá (Dạng 3B)
        </h4>

        <!-- Signature Dates -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div data-preflight-target="date_analyst">
            <label class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Ngày ký Người phân tích</label>
            <app-date-picker
                   [(ngModel)]="draft.page1Data['ngayNguoiPhanTich']"
                   (ngModelChange)="onDataChanged()"
                   presets="simple"
                   [disabled]="isReadOnly">
            </app-date-picker>
          </div>
          <div data-preflight-target="date_reviewer">
            <label class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Ngày ký Người thẩm tra</label>
            <app-date-picker
                   [(ngModel)]="draft.page1Data['ngayNguoiThamTra']"
                   (ngModelChange)="onDataChanged()"
                   presets="simple"
                   [disabled]="isReadOnly">
            </app-date-picker>
          </div>
        </div>

        <!-- Device & Discussion -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Thiết bị phân tích</label>
            <input type="text" 
                   [(ngModel)]="draft.page1Data['device']" 
                   (ngModelChange)="onDataChanged()"
                   placeholder="Ví dụ: GC-MS/MS / LC-MS/MS"
                   class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition outline-none">
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Thảo luận / Nhận xét</label>
            <input type="text" 
                   [(ngModel)]="draft.page1Data['thaoLuan']" 
                   (ngModelChange)="onDataChanged()"
                   placeholder="Ý kiến thảo luận hoặc ghi chú kết quả..."
                   class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition outline-none">
          </div>
        </div>

        <!-- Checkbox & QC segment controls grid (Dynamic from SOP metadata configuration) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
          @for (checkbox of checkboxList; track checkbox.key) {
            @if (isGeneralObservation(checkbox.key)) {
              <!-- Standard observation checkbox -->
              <label class="flex items-start gap-3 p-3.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-800 cursor-pointer select-none transition bg-slate-50/40 dark:bg-slate-950/30">
                <input type="checkbox" 
                       [(ngModel)]="draft.page1Data[checkbox.key]" 
                       (ngModelChange)="onCheckboxChange(checkbox.key)"
                       class="mt-0.5 w-4 h-4 rounded text-indigo-600 border-slate-300 dark:border-slate-700 focus:ring-indigo-500 focus:ring-2 dark:bg-slate-800">
                <div>
                  <span class="text-xs font-bold text-slate-700 dark:text-slate-200 leading-tight block">{{ checkbox.label }}</span>
                </div>
              </label>
            } @else {
              <!-- QC evaluation with Đạt / Không đạt Segment Control -->
              <div class="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50/50 dark:bg-slate-950/30 border border-slate-200/70 dark:border-slate-800 transition hover:border-slate-300 dark:hover:border-slate-700">
                <div class="flex-1 min-w-0 pr-1">
                  <span class="text-[11px] font-bold text-slate-700 dark:text-slate-200 leading-snug block break-words">
                    {{ checkbox.label }}
                  </span>
                </div>
                
                <!-- Pass / Fail selector -->
                <div class="flex items-center bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200/70 dark:border-slate-800 shrink-0 select-none">
                  <!-- Button 'Đạt' (true) -->
                  <button type="button"
                          (click)="setQcStatus(checkbox.key, true)"
                          [class]="draft.page1Data[checkbox.key] === true
                            ? 'px-2.5 py-1 text-[10px] font-bold rounded bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition duration-150 active:scale-95'
                            : 'px-2.5 py-1 text-[10px] font-semibold rounded text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition duration-150 active:scale-95'"
                          title="Đạt tiêu chí">
                    Đạt
                  </button>

                  <!-- Button 'Không đạt' (false) -->
                  <button type="button"
                          (click)="setQcStatus(checkbox.key, false)"
                          [class]="draft.page1Data[checkbox.key] === false
                            ? 'px-2.5 py-1 text-[10px] font-bold rounded bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition duration-150 active:scale-95'
                            : 'px-2.5 py-1 text-[10px] font-semibold rounded text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition duration-150 active:scale-95'"
                          title="Không đạt tiêu chí">
                    K.Đạt
                  </button>

                  <!-- Button 'N/A' (null) -->
                  <button type="button"
                          (click)="setQcStatus(checkbox.key, null)"
                          [class]="draft.page1Data[checkbox.key] === undefined || draft.page1Data[checkbox.key] === null
                            ? 'px-2 py-1 text-[9px] font-bold rounded bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200 shadow-xs transition duration-150 active:scale-95'
                            : 'px-2 py-1 text-[9px] font-semibold rounded text-slate-400 dark:text-slate-500 hover:text-slate-600 transition duration-150 active:scale-95'"
                          title="Chưa đánh giá">
                    N/A
                  </button>
                </div>
              </div>
            }
          }
        </div>
      </fieldset>

      <!-- 2 & 3. Master-Detail Sample List + Composite Compound Grid -->
      <app-sop-master-detail-compound-grid
        [run]="run"
        [draft]="draft"
        [config]="config"
        [compoundDisplayNames]="compoundDisplayNames()"
        [activeSampleCode]="activeSampleCode()"
        [publishedSampleSet]="publishedSampleSet"
        [isReadOnly]="isReadOnly"
        [showSelectionControls]="false"
        [showMassControl]="false"
        [allowQcNa]="false"
        (activeSampleChange)="selectSample($event)"
        (bulkFillNd)="sampleBulkFillND()"
        (bulkQcPass)="sampleBulkQC()"
        (copySampleToAll)="copyActiveSampleToAll()"
        (ndChanged)="onNdCheckboxChanged($event)"
        (resultChanged)="onResultInputChanged($event)"
        (qcChanged)="setCompoundQc($event.compound, $event.qcKey, $event.status)" />
    </div>
  `
})
export class ResultEntryType3bComponent implements OnInit {
  @Input() run!: any;
  @Input() draft!: AnalysisResultDraft;
  @Input() config!: any;
  @Input() isReadOnly = false;
  @Input() publishedSampleSet: Set<string> | null = null;

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
    if (!this.isReadOnly) {
      this.prefillUnassignedTargets();
    }
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
    return resolveCompoundDisplayName(compound, this.masterTargets(), this.config?.id || this.run?.sopId);
  }

  isTargetAssigned(sampleCode: string, compound: string): boolean {
    // QC samples luôn cần hiển thị tất cả compounds
    if (sampleCode.startsWith('QC_')) return true;
    if (!this.run) return true;
    const targetMap = this.run.sampleTargetMap || (this.run.inputs && this.run.inputs.sampleTargetMap);
    if (!targetMap) return true;
    const assigned = getAssignedTargetsForSample(sampleCode, targetMap);
    if (!assigned || assigned.length === 0) return true;

    // Fast path: canonical id direct match (DATA_VERSION 2)
    if (assigned.includes(compound)) return true;
    // Fallback: shim cho data v1 chưa migrate
    return isCompoundAssigned(assigned, compound, this.masterTargets());
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
    if (this.isReadOnly) return;
    this.draftChanged.emit(this.draft);
  }

  onCheckboxChange(changedKey: string) {
    if (this.isReadOnly) return;
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
    if (this.isReadOnly) return;
    const active = this.activeSampleCode();
    const row = this.draft.resultData[active];
    if (row) {
      if (row[`${compound}_nd`]) {
        row[compound] = 'ND';
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
    if (this.isReadOnly) return;
    const active = this.activeSampleCode();
    const row = this.draft.resultData[active];
    if (row) {
      const val = String(row[compound] || '').trim().toUpperCase();
      if (val === 'KPH' || val === 'ND' || val === '') {
        row[`${compound}_nd`] = true;
        if (val === 'KPH') row[compound] = 'ND';
      } else {
        row[`${compound}_nd`] = false;
      }
    }
    this.onDataChanged();
  }

  /**
   * Bulk Action: Đặt tất cả hoạt chất của mẫu đang mở là KPH (Không phát hiện)
   */
  sampleBulkFillND() {
    if (this.isReadOnly) return;
    const active = this.activeSampleCode();
    const row = this.draft.resultData[active];
    if (row && this.config.compounds) {
      this.config.compounds.forEach((c: string) => {
        if (this.isTargetAssigned(active, c)) {
          row[c] = 'ND';
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
    if (this.isReadOnly) return;
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
    if (this.isReadOnly) return;
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
              destRow[c] = sourceData[c] || 'ND';
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
    if (this.isReadOnly) return;
    this.draft.page1Data[key] = value;
    this.onDataChanged();
  }

  setCompoundQc(compound: string, qcKey: 'qc1' | 'qc2' | 'qc3', status: 'Đạt' | 'Không đạt' | 'N/A') {
    if (this.isReadOnly) return;
    const active = this.activeSampleCode();
    const row = this.draft.resultData[active];
    if (row && this.isTargetAssigned(active, compound)) {
      row[`${compound}_${qcKey}`] = status;
      this.onDataChanged();
    }
  }
}
