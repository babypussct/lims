import { Component, Input, Output, EventEmitter, HostListener, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AppDatePickerComponent } from '../../../../shared/components/ui';
import { AnalysisResultDraft } from '../../../../core/models/analysis-result.model';

@Component({
  selector: 'app-sop-header-metadata',
  standalone: true,
  imports: [FormsModule, AppDatePickerComponent],
  template: `
    <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden">
      <!-- Collapsible Setup Summary Header -->
      <button type="button"
              (click)="toggleExpanded()"
              [attr.aria-expanded]="expanded()"
              class="w-full px-5 py-3.5 bg-slate-50/70 dark:bg-slate-950/30 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 flex flex-wrap items-center justify-between gap-3 text-left transition-colors border-b"
              [class.border-slate-100]="expanded()"
              [class.dark:border-slate-800]="expanded()"
              [class.border-transparent]="!expanded()">
        <div class="flex items-center gap-2.5 min-w-0">
          <i class="fa-solid fa-file-invoice text-indigo-600 dark:text-indigo-400 text-sm shrink-0" aria-hidden="true"></i>
          <h4 class="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider truncate m-0">{{ title }}</h4>
        </div>

        <div class="flex flex-wrap items-center gap-2 text-[11px]">
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border font-semibold"
                [class]="draft.page1Data['ngayNguoiPhanTich']
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900/40'
                  : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900/40'">
            PT: {{ draft.page1Data['ngayNguoiPhanTich'] || 'Chưa chọn' }}
          </span>
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border font-semibold"
                [class]="draft.page1Data['ngayNguoiThamTra']
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900/40'
                  : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900/40'">
            TT: {{ draft.page1Data['ngayNguoiThamTra'] || 'Chưa chọn' }}
          </span>
          @if (draft.page1Data['r2']) {
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-300 dark:border-indigo-900/40 font-mono font-bold">
              R²: {{ draft.page1Data['r2'] }}
            </span>
          }
          <span class="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-400">
            <i class="fa-solid fa-chevron-down text-[10px] transition-transform duration-200" [class.rotate-180]="expanded()" aria-hidden="true"></i>
          </span>
        </div>
      </button>

      @if (expanded()) {
        <fieldset [disabled]="isReadOnly" class="p-5 space-y-4">
          <!-- Signature Dates -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div data-preflight-target="date_analyst">
              <label class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Ngày ký / Người phân tích</label>
              <app-date-picker
                [(ngModel)]="draft.page1Data['ngayNguoiPhanTich']"
                (ngModelChange)="onDataChanged()"
                presets="simple"
                [disabled]="isReadOnly">
              </app-date-picker>
            </div>
            <div data-preflight-target="date_reviewer">
              <label class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Ngày ký / Người thẩm tra</label>
              <app-date-picker
                [(ngModel)]="draft.page1Data['ngayNguoiThamTra']"
                (ngModelChange)="onDataChanged()"
                presets="simple"
                [disabled]="isReadOnly">
              </app-date-picker>
            </div>
          </div>

          <!-- Custom metadata inputs projected from parent -->
          <div class="empty:hidden">
            <ng-content select="[sop-metadata-extra]"></ng-content>
          </div>

          <!-- Checkbox & QC evaluation grid -->
          @if (checkboxList.length > 0) {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
              @for (checkbox of checkboxList; track checkbox.key) {
                @if (!isQcField(checkbox.key)) {
                  <label class="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 select-none transition bg-slate-50/40 dark:bg-slate-900/20"
                    [class.cursor-pointer]="!isReadOnly"
                    [class.cursor-not-allowed]="isReadOnly">
                    <input type="checkbox"
                      [(ngModel)]="draft.page1Data[checkbox.key]"
                      (ngModelChange)="onCheckboxChange(checkbox.key)"
                      [disabled]="isReadOnly"
                      class="mt-0.5 w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 focus:ring-2 dark:bg-slate-800 dark:border-slate-700 disabled:opacity-75">
                    <div>
                      <span class="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-tight block">{{ checkbox.label }}</span>
                    </div>
                  </label>
                } @else {
                  <div class="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50/50 dark:bg-slate-950/30 border border-slate-200/70 dark:border-slate-800 transition hover:border-slate-300 dark:hover:border-slate-700">
                    <div class="flex-1 min-w-0 pr-1">
                      <span class="text-[11px] font-bold text-slate-700 dark:text-slate-200 leading-snug block break-words">
                        {{ checkbox.label }}
                      </span>
                    </div>
                    <div class="flex items-center bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200/70 dark:border-slate-800 shrink-0 select-none">
                      <button type="button"
                        (click)="setQcStatus(checkbox.key, true)"
                        [disabled]="isReadOnly"
                        [class]="draft.page1Data[checkbox.key] === true
                          ? 'px-2.5 py-1 text-[10px] font-bold rounded bg-emerald-600 text-white shadow-xs transition duration-150 disabled:opacity-75 disabled:cursor-not-allowed'
                          : 'px-2.5 py-1 text-[10px] font-semibold rounded text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed'"
                        title="Đạt tiêu chí">
                        Đạt
                      </button>
                      <button type="button"
                        (click)="setQcStatus(checkbox.key, false)"
                        [disabled]="isReadOnly"
                        [class]="draft.page1Data[checkbox.key] === false
                          ? 'px-2.5 py-1 text-[10px] font-bold rounded bg-rose-600 text-white shadow-xs transition duration-150 disabled:opacity-75 disabled:cursor-not-allowed'
                          : 'px-2.5 py-1 text-[10px] font-semibold rounded text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed'"
                        title="Không đạt tiêu chí">
                        K.Đạt
                      </button>
                      <button type="button"
                        (click)="setQcStatus(checkbox.key, null)"
                        [disabled]="isReadOnly"
                        [class]="draft.page1Data[checkbox.key] === undefined || draft.page1Data[checkbox.key] === null
                          ? 'px-2 py-1 text-[9px] font-bold rounded bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-xs transition duration-150 disabled:opacity-75 disabled:cursor-not-allowed'
                          : 'px-2 py-1 text-[9px] font-semibold rounded text-slate-400 dark:text-slate-500 hover:text-slate-600 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed'"
                        title="Chưa đánh giá">
                        N/A
                      </button>
                    </div>
                  </div>
                }
              }
            </div>
          }
        </fieldset>
      }
    </div>
  `
})
export class SopHeaderMetadataComponent {
  @Input() title = 'Thông tin chung & Đánh giá';
  @Input() draft!: AnalysisResultDraft;
  @Input() checkboxList: { key: string; label: string }[] = [];
  @Input() isReadOnly = false;
  @Output() draftChanged = new EventEmitter<AnalysisResultDraft>();

  expanded = signal(true);

  @HostListener('window:lims-preflight-expand-metadata')
  onPreflightExpandRequest() {
    this.expanded.set(true);
  }

  toggleExpanded() {
    this.expanded.update(v => !v);
  }

  isQcField(key: string): boolean {
    return key.startsWith('qc');
  }

  setQcStatus(key: string, value: boolean | null) {
    if (this.isReadOnly) return;
    this.draft.page1Data[key] = value;
    this.onDataChanged();
  }

  onCheckboxChange(changedKey: string) {
    if (this.isReadOnly) return;
    if (changedKey === 'checkTatCaND' && this.draft.page1Data['checkTatCaND']) {
      this.draft.page1Data['checkCoMauPhatHien'] = false;
      if (this.draft.page1Data['qcNhanDang'] !== undefined) {
        this.draft.page1Data['qcNhanDang'] = null; // Reset to N/A
      }
    } else if (changedKey === 'checkCoMauPhatHien' && this.draft.page1Data['checkCoMauPhatHien']) {
      this.draft.page1Data['checkTatCaND'] = false;
      if (this.draft.page1Data['qcNhanDang'] !== undefined) {
        this.draft.page1Data['qcNhanDang'] = true; // Auto check "Đạt"
      }
    }
    this.onDataChanged();
  }

  onDataChanged() {
    this.draftChanged.emit(this.draft);
  }
}
