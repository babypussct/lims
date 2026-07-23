import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-merge-runs-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
      <div class="fixed inset-0 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
        <div class="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200/80 dark:border-slate-800 shadow-2xl p-6 space-y-5">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-base font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <span class="w-7 h-7 bg-fuchsia-100 dark:bg-fuchsia-950/40 rounded-lg flex items-center justify-center">
                  <i class="fa-solid fa-code-merge rotate-90 text-fuchsia-600 dark:text-fuchsia-400 text-xs"></i>
                </span>
                Cấu Hình Gộp Mẻ Chạy
              </h3>
              <p class="text-xs text-slate-400 dark:text-slate-500 mt-1 ml-9">Hợp nhất mẫu từ nhiều mẻ chạy vào 1 phiếu duy nhất.</p>
            </div>
            <button (click)="closeModal()" class="w-8 h-8 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 flex items-center justify-center transition active:scale-90 border-0 bg-transparent cursor-pointer">
              <i class="fa-solid fa-xmark text-sm"></i>
            </button>
          </div>

          <div class="space-y-4 text-xs">
            <div class="flex flex-col gap-1.5">
              <label class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Mẻ lấy đường chuẩn chính</label>
              <div class="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                @for (run of selectedRuns; track run.id) {
                  <label class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer hover:bg-slate-100/50 transition">
                    <input type="radio" name="masterCurve" [value]="run.id"
                           [checked]="masterCurveRunId === run.id"
                           (change)="onMasterCurveChange(run.id)"
                           class="text-fuchsia-600 focus:ring-fuchsia-500 cursor-pointer">
                    <div class="flex flex-col">
                      <span class="font-extrabold text-slate-700 dark:text-slate-250">{{ run.sopName }}</span>
                      <span class="text-[10px] text-slate-400 font-semibold mt-0.5">{{ run.inputs?.['batchCode'] || run.id }} — {{ run.user }}</span>
                    </div>
                  </label>
                }
              </div>
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Ngày phân tích hiển thị trên phiếu</label>
              <input type="text" [value]="unifiedDateString" (input)="onUnifiedDateStringChange($event)"
                     placeholder="Ví dụ: 22/05/2026 - 23/05/2026"
                     class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 dark:text-slate-200 font-bold text-xs">
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Mã mẻ tổng hợp (tùy chỉnh)</label>
              <input type="text" [value]="customMasterId" (input)="onCustomMasterIdChange($event)"
                     class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 dark:text-slate-200 font-mono font-bold uppercase text-xs">
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button (click)="closeModal()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-350 rounded-xl text-xs font-black transition active:scale-95 border-0 cursor-pointer">Hủy</button>
            <button (click)="executeMerge()" class="px-5 py-2 bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600 text-white rounded-xl text-xs font-black transition shadow-md shadow-fuchsia-500/10 active:scale-95 flex items-center gap-1.5 border-0 cursor-pointer">
              <i class="fa-solid fa-check text-[10px]"></i> Tạo Mẻ Gộp
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class MergeRunsModalComponent {
  @Input() isOpen = false;
  @Input() selectedRuns: any[] = [];
  @Input() masterCurveRunId = '';
  @Input() unifiedDateString = '';
  @Input() customMasterId = '';

  @Output() close = new EventEmitter<void>();
  @Output() masterCurveRunIdChange = new EventEmitter<string>();
  @Output() unifiedDateStringChange = new EventEmitter<string>();
  @Output() customMasterIdChange = new EventEmitter<string>();
  @Output() merge = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }

  onMasterCurveChange(runId: string) {
    this.masterCurveRunIdChange.emit(runId);
  }

  onUnifiedDateStringChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.unifiedDateStringChange.emit(input.value);
  }

  onCustomMasterIdChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.customMasterIdChange.emit(input.value);
  }

  executeMerge() {
    this.merge.emit();
  }
}
