import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppModalShellComponent } from '../../../shared/components/ui/modal-shell/modal-shell.component';
import { AppButtonComponent } from '../../../shared/components/ui/button/button.component';
import { MergeRunsValidation, validateMergeRuns } from '../services/merge-runs-compatibility';
import { ResultEditCapability } from '../services/result-write-guard';

@Component({
  selector: 'app-merge-runs-modal',
  standalone: true,
  imports: [CommonModule, AppModalShellComponent, AppButtonComponent],
  template: `
    @if (isOpen) {
      <app-modal-shell
        size="md"
        title="Cấu hình gộp mẻ chạy"
        description="Hợp nhất các mẫu cùng SOP từ nhiều mẻ chạy vào một phiếu kết quả tổng hợp."
        (closed)="closeModal()">

        <div modalBody class="space-y-4 text-xs">
          @let activeValidation = resolvedValidation();

          @if (activeValidation.blockers.length > 0) {
            <div class="rounded-2xl border border-red-200 dark:border-red-900/40 bg-red-50/80 dark:bg-red-950/20 p-3.5 space-y-1">
              <div class="flex items-center gap-2 font-bold text-red-700 dark:text-red-400">
                <i class="fa-solid fa-circle-exclamation"></i>
                <span>Không thể gộp mẻ hiện tại</span>
              </div>
              @for (blocker of activeValidation.blockers; track blocker) {
                <p class="text-[11px] text-red-600 dark:text-red-300 pl-5">{{ blocker }}</p>
              }
            </div>
          }

          @if (activeValidation.warnings.length > 0) {
            <div class="rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/80 dark:bg-amber-950/20 p-3.5 space-y-1">
              <div class="flex items-center gap-2 font-bold text-amber-700 dark:text-amber-300">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <span>Lưu ý trước khi gộp</span>
              </div>
              @for (warning of activeValidation.warnings; track warning) {
                <p class="text-[11px] text-amber-700/90 dark:text-amber-300/90 pl-5">{{ warning }}</p>
              }
            </div>
          }

          @if (activeValidation.mergedSamples.length > 0) {
            <div class="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-3.5 space-y-2">
              <div class="flex items-center justify-between gap-2">
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Xem trước danh sách mẫu hợp nhất
                </span>
                <span class="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold text-[10px]">
                  {{ activeValidation.mergedSamples.length }} mẫu
                </span>
              </div>
              <div class="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto custom-scrollbar">
                @for (sample of activeValidation.mergedSamples; track sample) {
                  @let isDup = duplicateSet(activeValidation).has(sample);
                  <span class="px-2 py-0.5 rounded-lg font-mono text-[10px] font-bold border"
                        [class]="isDup
                          ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800/50'
                          : 'bg-white text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700'">
                    {{ sample }}@if (isDup) { <span class="ml-1 text-[9px]">(trùng)</span> }
                  </span>
                }
              </div>
            </div>
          }

          @if (activeValidation.duplicateSamples.length > 0) {
            <div class="rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-950/20 p-3.5 space-y-2.5">
              <div class="flex items-center justify-between gap-2">
                <span class="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  Chọn nguồn kết quả cho các mã mẫu trùng
                </span>
                <span class="text-[10px] font-bold text-amber-700 dark:text-amber-300">
                  Còn {{ activeValidation.unresolvedDuplicateSamples.length }}/{{ activeValidation.duplicateSamples.length }} mẫu chưa chọn
                </span>
              </div>
              <div class="space-y-2 max-h-44 overflow-y-auto custom-scrollbar pr-1">
                @for (dupSample of activeValidation.duplicateSamples; track dupSample) {
                  @let chosenRunId = duplicateSampleSources[dupSample] || '';
                  <div class="rounded-xl border bg-white dark:bg-slate-900 p-2.5 space-y-1.5"
                       [class]="chosenRunId
                         ? 'border-indigo-200 dark:border-indigo-800'
                         : 'border-amber-300 dark:border-amber-800'">
                    <div class="font-mono text-[11px] font-bold text-slate-800 dark:text-slate-100">
                      Mẫu {{ dupSample }}
                    </div>
                    <div class="flex flex-wrap gap-2">
                      @for (cand of activeValidation.duplicateSourceCandidates[dupSample] || []; track cand.runId) {
                        <label class="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] cursor-pointer transition"
                               [class]="chosenRunId === cand.runId
                                 ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 font-bold'
                                 : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300 font-semibold'">
                          <input type="radio"
                                 [name]="'dup-source-' + dupSample"
                                 [value]="cand.runId"
                                 [checked]="chosenRunId === cand.runId"
                                 (change)="onDuplicateSourceSelected(dupSample, cand.runId)"
                                 class="text-indigo-600 focus:ring-indigo-500 cursor-pointer">
                          <span class="font-mono">{{ cand.batchCode }}</span>
                          <span class="text-[10px] opacity-75">
                            ({{ cand.status === 'completed' ? 'Hoàn thành' : cand.status === 'draft' ? 'Nháp' : 'Chờ nhập' }})
                          </span>
                        </label>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>
          }

          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Mẻ lấy đường chuẩn chính</label>
            <div class="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
              @for (run of selectedRuns; track run.id) {
                <label class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950/40 border rounded-xl cursor-pointer hover:bg-slate-100/60 dark:hover:bg-slate-800/40 transition"
                       [class.border-indigo-500]="masterCurveRunId === run.id"
                       [class.bg-indigo-50/40]="masterCurveRunId === run.id"
                       [class.border-slate-200]="masterCurveRunId !== run.id"
                       [class.dark:border-slate-800]="masterCurveRunId !== run.id">
                  <input type="radio" name="masterCurve" [value]="run.id"
                         [checked]="masterCurveRunId === run.id"
                         (change)="onMasterCurveChange(run.id)"
                         class="text-indigo-600 focus:ring-indigo-500 cursor-pointer">
                  <div class="flex flex-col min-w-0">
                    <span class="font-bold text-slate-800 dark:text-slate-200 truncate">{{ run.sopName }}</span>
                    <span class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      <span class="font-mono font-bold">{{ run.inputs?.['batchCode'] || run.id || 'Chưa có mã mẻ' }}</span> · {{ run.user || 'Chưa rõ' }}
                    </span>
                  </div>
                </label>
              }
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ngày phân tích hiển thị trên phiếu</label>
            <input type="text" [value]="unifiedDateString" (input)="onUnifiedDateStringChange($event)"
                   placeholder="Ví dụ: 22/05/2026 - 23/05/2026"
                   class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-slate-100 font-semibold text-xs">
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Mã mẻ tổng hợp (tùy chỉnh)</label>
            <input type="text" [value]="customMasterId" (input)="onCustomMasterIdChange($event)"
                   class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-slate-100 font-mono font-bold uppercase text-xs">
          </div>
        </div>

        <div modalFooter class="flex items-center justify-end gap-2.5 w-full">
          <app-button variant="secondary" size="sm" (click)="closeModal()">
            Hủy
          </app-button>
          <button type="button"
                  (click)="executeMerge()"
                  [disabled]="!activeValidation.canMerge"
                  class="inline-flex h-9 items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 text-xs font-bold text-white shadow-sm transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
            <i class="fa-solid fa-check text-[11px]" aria-hidden="true"></i>
            <span>Tạo mẻ gộp</span>
          </button>
        </div>
      </app-modal-shell>
    }
  `
})
export class MergeRunsModalComponent {
  @Input() isOpen = false;
  @Input() selectedRuns: any[] = [];
  @Input() masterCurveRunId = '';
  @Input() unifiedDateString = '';
  @Input() customMasterId = '';
  @Input() validation: MergeRunsValidation | null = null;
  @Input() capability: ResultEditCapability = {};
  @Input() userEmail: string | null = null;
  @Input() sops: readonly any[] = [];
  @Input() duplicateSampleSources: Record<string, string> = {};

  @Output() close = new EventEmitter<void>();
  @Output() masterCurveRunIdChange = new EventEmitter<string>();
  @Output() unifiedDateStringChange = new EventEmitter<string>();
  @Output() customMasterIdChange = new EventEmitter<string>();
  @Output() duplicateSampleSourcesChange = new EventEmitter<Record<string, string>>();
  @Output() merge = new EventEmitter<void>();

  resolvedValidation(): MergeRunsValidation {
    if (this.validation) return this.validation;
    return validateMergeRuns({
      selectedRuns: this.selectedRuns || [],
      capability: this.capability || { canRunBatch: true },
      userEmail: this.userEmail,
      sops: this.sops || [],
      duplicateSampleSources: this.duplicateSampleSources || {}
    });
  }

  onDuplicateSourceSelected(sampleCode: string, runId: string) {
    this.duplicateSampleSourcesChange.emit({
      ...(this.duplicateSampleSources || {}),
      [sampleCode]: runId
    });
  }

  duplicateSet(val: MergeRunsValidation): Set<string> {
    return new Set(val.duplicateSamples || []);
  }

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
    if (!this.resolvedValidation().canMerge) return;
    this.merge.emit();
  }
}
