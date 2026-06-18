import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalysisResultDraft } from '../../../../core/models/analysis-result.model';

@Component({
  selector: 'app-sop-header-metadata',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/80 p-5 space-y-4">
      <h4 class="text-xs font-black text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2.5 uppercase tracking-wider flex items-center">
        <i class="fa-solid fa-file-invoice mr-2 text-indigo-500 text-sm"></i> {{ title }}
      </h4>

      <!-- Signature Dates -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest">Ngày ký/ Người phân tích</label>
          <input type="date" 
                 [(ngModel)]="draft.page1Data['ngayNguoiPhanTich']" 
                 (ngModelChange)="onDataChanged()"
                 [disabled]="isReadOnly"
                 class="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200/80 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition outline-none disabled:opacity-75 disabled:cursor-not-allowed">
        </div>
        <div>
          <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest">Ngày ký/ Người thẩm tra</label>
          <input type="date" 
                 [(ngModel)]="draft.page1Data['ngayNguoiThamTra']" 
                 (ngModelChange)="onDataChanged()"
                 [disabled]="isReadOnly"
                 class="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200/80 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition outline-none disabled:opacity-75 disabled:cursor-not-allowed">
        </div>
      </div>

      <!-- Custom metadata inputs projected from parent -->
      <div class="empty:hidden">
        <ng-content select="[sop-metadata-extra]"></ng-content>
      </div>

      <!-- Checkbox & QC evaluation grid -->
      <div *ngIf="checkboxList.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
        @for (checkbox of checkboxList; track checkbox.key) {
          @if (!isQcField(checkbox.key)) {
            <label class="flex items-start gap-3 p-3.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 border border-slate-100 dark:border-slate-800/60 select-none transition bg-slate-50/20 dark:bg-slate-900/10"
                   [class.cursor-pointer]="!isReadOnly"
                   [class.cursor-not-allowed]="isReadOnly">
              <input type="checkbox" 
                     [(ngModel)]="draft.page1Data[checkbox.key]" 
                     (ngModelChange)="onCheckboxChange(checkbox.key)"
                     [disabled]="isReadOnly"
                     class="mt-0.5 w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 focus:ring-2 dark:bg-slate-800 dark:border-slate-700 disabled:opacity-75">
              <div>
                <span class="text-xs font-bold text-slate-700 dark:text-slate-300 leading-tight block">{{ checkbox.label }}</span>
              </div>
            </label>
          } @else {
            <div class="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50/40 dark:bg-slate-955/40 border border-slate-250/25 dark:border-slate-800/60 transition hover:border-slate-350 dark:hover:border-slate-700 shadow-xs">
              <div class="flex-1 min-w-0 pr-1">
                <span class="text-[11px] font-extrabold text-slate-700 dark:text-slate-200 leading-snug block break-words">
                  {{ checkbox.label }}
                </span>
              </div>
              
              <div class="flex items-center bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg border border-slate-250/30 dark:border-slate-800 shrink-0 select-none">
                <button type="button"
                        (click)="setQcStatus(checkbox.key, true)"
                        [disabled]="isReadOnly"
                        [class]="draft.page1Data[checkbox.key] === true 
                          ? 'px-2.5 py-1 text-[10px] font-black rounded bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs transition duration-150 active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed' 
                          : 'px-2.5 py-1 text-[10px] font-bold rounded text-slate-550 dark:text-slate-400 hover:text-slate-750 dark:hover:text-slate-200 transition duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'"
                        title="Đạt tiêu chí">
                  Đạt
                </button>
                
                <button type="button"
                        (click)="setQcStatus(checkbox.key, false)"
                        [disabled]="isReadOnly"
                        [class]="draft.page1Data[checkbox.key] === false 
                          ? 'px-2.5 py-1 text-[10px] font-black rounded bg-rose-500 hover:bg-rose-600 text-white shadow-xs transition duration-150 active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed' 
                          : 'px-2.5 py-1 text-[10px] font-bold rounded text-slate-550 dark:text-slate-400 hover:text-slate-750 dark:hover:text-slate-200 transition duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'"
                        title="Không đạt tiêu chí">
                  K.Đạt
                </button>

                <button type="button"
                        (click)="setQcStatus(checkbox.key, null)"
                        [disabled]="isReadOnly"
                        [class]="draft.page1Data[checkbox.key] === undefined || draft.page1Data[checkbox.key] === null
                          ? 'px-2 py-1 text-[9px] font-black rounded bg-slate-350 dark:bg-slate-700 text-slate-750 dark:text-slate-250 shadow-xs transition duration-150 active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed' 
                          : 'px-2 py-1 text-[9px] font-bold rounded text-slate-455 dark:text-slate-500 hover:text-slate-600 transition duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'"
                        title="Chưa đánh giá">
                  N/A
                </button>
              </div>
            </div>
          }
        }
      </div>
    </div>
  `
})
export class SopHeaderMetadataComponent {
  @Input() title: string = 'Thông tin chung & Đánh giá';
  @Input() draft!: AnalysisResultDraft;
  @Input() checkboxList: { key: string; label: string }[] = [];
  @Input() isReadOnly = false;
  @Output() draftChanged = new EventEmitter<AnalysisResultDraft>();

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
