import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalysisResultDraft } from '../../../../core/models/analysis-result.model';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { isCompoundAssigned } from '../../shared/compound-id-resolver';
import {
  applyPasteTransaction,
  normalizePastedResultValue,
  parseSpreadsheetPasteText,
  PasteTransactionPlan,
  PasteUndoStack,
  planSpreadsheetPaste,
  WriteGuardContext,
} from './sop-paste-undo';

export interface SampleProgressSummary {
  sampleCode: string;
  assignedTotal: number;
  assignedDone: number;
  numericCount: number;
  isAllNd: boolean;
  isPublished: boolean;
}

@Component({
  selector: 'app-sop-master-detail-compound-grid',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    <div class="space-y-4 animate-fade-in" (keydown)="onHostKeyDown($event)">
      <!-- Sticky Mobile Sample Switcher Bar (< lg screens) -->
      @if (sampleList().length > 0) {
        <div class="lg:hidden sticky top-1 z-20 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-2.5 shadow-sm space-y-2">
          <div class="flex items-center gap-2">
            <button type="button"
                    (click)="stepSample(-1)"
                    [disabled]="activeSampleIndex() <= 0"
                    aria-label="Mẫu trước"
                    title="Mẫu trước"
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-40 transition active:scale-95">
              <i class="fa-solid fa-chevron-left text-xs" aria-hidden="true"></i>
            </button>

            <div class="flex-1 min-w-0">
              <select [ngModel]="activeSampleCode"
                      (ngModelChange)="selectSample($event)"
                      aria-label="Chọn mẫu đang nhập"
                      class="h-10 w-full rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/40 px-3 text-xs font-mono font-bold text-indigo-800 dark:text-indigo-200 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                @for (s of sampleList(); track s) {
                  @let st = getSampleStats(s);
                  <option [value]="s">
                    {{ s }} ({{ st.assignedDone }}/{{ st.assignedTotal }}){{ st.numericCount > 0 ? ' · ' + st.numericCount + ' số' : '' }}{{ st.isPublished ? ' · PDF ✓' : '' }}
                  </option>
                }
              </select>
            </div>

            <button type="button"
                    (click)="stepSample(1)"
                    [disabled]="activeSampleIndex() < 0 || activeSampleIndex() >= sampleList().length - 1"
                    aria-label="Mẫu sau"
                    title="Mẫu sau"
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-40 transition active:scale-95">
              <i class="fa-solid fa-chevron-right text-xs" aria-hidden="true"></i>
            </button>

            @if (showSelectionControls && activeSampleCode) {
              <label class="flex h-10 shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 text-[11px] font-bold text-slate-600 dark:text-slate-300"
                     title="Bao gồm mẫu này trong báo cáo PDF">
                <input type="checkbox"
                       [disabled]="isReadOnly"
                       [ngModel]="draft.resultData[activeSampleCode]?.['selected'] !== false"
                       (ngModelChange)="onToggleSampleSelected(activeSampleCode, $event)"
                       class="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50" />
                <span>In</span>
              </label>
            }
          </div>
        </div>
      }

      <!-- Main Master-Detail Split Grid -->
      <div class="flex flex-col lg:flex-row gap-4 items-start">
        <!-- LEFT STICKY MASTER LIST (270px on desktop) -->
        <aside class="hidden lg:flex lg:w-[270px] shrink-0 flex-col rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden lg:sticky lg:top-2 lg:max-h-[calc(100vh-140px)]">
          <div class="px-3.5 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/30 space-y-2">
            <div class="flex items-center justify-between gap-2">
              <span class="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Mẫu phân tích ({{ sampleList().length }})
              </span>
              @if (showSelectionControls) {
                <button type="button"
                        (click)="onToggleSelectAll()"
                        [disabled]="isReadOnly"
                        class="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-[10px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                  {{ isAllSelected() ? 'Bỏ chọn' : 'Chọn hết' }}
                </button>
              }
            </div>

            @if (showSelectionControls && showGopInChung) {
              <div class="flex items-center justify-between gap-2 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/60 px-2.5 py-1.5 text-[10px]">
                <span class="font-bold text-slate-600 dark:text-slate-300">Gộp in chung</span>
                <span class="rounded-full px-2 py-0.5 font-bold"
                      [class]="selectedCount() > 1
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'">
                  {{ selectedCount() > 1 ? 'Bật (' + selectedCount() + ' mẫu)' : '1 mẫu' }}
                </span>
              </div>
            }
          </div>

          <!-- Sample List Items -->
          <div class="flex-1 overflow-y-auto custom-scrollbar divide-y divide-slate-100 dark:divide-slate-800/70 p-1.5 space-y-1">
            @for (sampleCode of sampleList(); track sampleCode; let idx = $index) {
              @let st = getSampleStats(sampleCode);
              @let isSelectedForPrint = draft.resultData[sampleCode]?.['selected'] !== false;
              @let isActive = activeSampleCode === sampleCode;
              <div [attr.data-sample-code]="sampleCode"
                   [class]="isActive
                     ? 'bg-indigo-600 text-white shadow-sm'
                     : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-200'"
                   [class.opacity-60]="showSelectionControls && !isSelectedForPrint && !isActive"
                   class="group flex items-center gap-2 rounded-xl px-2 py-2 transition-colors">
                @if (showSelectionControls) {
                  <input type="checkbox"
                         [disabled]="isReadOnly"
                         [ngModel]="isSelectedForPrint"
                         (ngModelChange)="onToggleSampleSelected(sampleCode, $event)"
                         aria-label="Bao gồm mẫu {{ sampleCode }} khi in PDF"
                         title="Bao gồm mẫu này khi in PDF"
                         class="h-4 w-4 shrink-0 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" />
                }

                <button type="button"
                        (click)="selectSample(sampleCode)"
                        class="min-w-0 flex-1 text-left flex flex-col gap-1">
                  <div class="flex items-center justify-between gap-1.5">
                    <div class="flex items-center gap-1.5 min-w-0">
                      <span class="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                            [class]="isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'">
                        {{ idx + 1 }}
                      </span>
                      <span class="font-mono text-xs font-bold truncate">{{ sampleCode }}</span>
                    </div>

                    <!-- Signal 4: PDF Published Check -->
                    @if (st.isPublished) {
                      <span class="inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold shrink-0"
                            [class]="isActive
                              ? 'bg-emerald-400/25 text-white'
                              : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'"
                            title="Mẫu đã xuất bản PDF">
                        <i class="fa-solid fa-circle-check text-[9px]" aria-hidden="true"></i>
                        <span>PDF</span>
                      </span>
                    }
                  </div>

                  <!-- Signals 1, 2, 3: Progress count + Numeric Value badge + All-ND/Pending -->
                  <div class="flex items-center justify-between gap-1.5 text-[10px] pl-6">
                    <span class="font-mono tabular-nums"
                          [class]="isActive ? 'text-indigo-100' : 'text-slate-400 dark:text-slate-500'">
                      {{ st.assignedDone }}/{{ st.assignedTotal }} chỉ tiêu
                    </span>
                    <div class="flex items-center gap-1">
                      @if (st.numericCount > 0) {
                        <span class="rounded-md px-1.5 py-0.5 text-[9px] font-bold"
                              [class]="isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300'"
                              title="Số hoạt chất đang có giá trị số">
                          {{ st.numericCount }} số
                        </span>
                      } @else if (st.isAllNd) {
                        <span class="rounded-md px-1.5 py-0.5 text-[9px] font-bold"
                              [class]="isActive
                                ? 'bg-white/15 text-indigo-100'
                                : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'">
                          ND
                        </span>
                      } @else if (st.assignedDone < st.assignedTotal) {
                        <span class="h-1.5 w-1.5 rounded-full bg-amber-400" title="Còn hoạt chất chưa nhập"></span>
                      }
                    </div>
                  </div>
                </button>
              </div>
            }
          </div>
        </aside>

        <!-- RIGHT DETAIL COMPOUND TABLE -->
        <div class="flex-1 min-w-0 w-full rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-4 sm:p-5 space-y-4">
          <!-- Detail Header: Sample badge, Mass input, Bulk Actions -->
          <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3.5">
            <div class="flex flex-wrap items-center gap-3 min-w-0">
              <div class="flex items-center gap-2">
                <i class="fa-solid fa-flask-vial text-indigo-600 dark:text-indigo-400 text-sm" aria-hidden="true"></i>
                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100 m-0">
                  Mẫu:
                </h4>
                <span class="rounded-lg border border-indigo-200/80 dark:border-indigo-900/50 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 font-mono text-xs font-bold text-indigo-700 dark:text-indigo-300">
                  {{ activeSampleCode }}
                </span>
              </div>

              @if (showMassControl && activeSampleCode && draft.resultData[activeSampleCode]) {
                <div class="inline-flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 overflow-hidden shadow-xs">
                  <span class="px-2 py-1 text-[11px] font-bold text-slate-500 border-r border-slate-200 dark:border-slate-800">
                    {{ massLabel }} =
                  </span>
                  <input type="text"
                         [readOnly]="isReadOnly"
                         [(ngModel)]="draft.resultData[activeSampleCode]['khoiLuong']"
                         (ngModelChange)="sampleMassChanged.emit()"
                         aria-label="Khối lượng hoặc thể tích mẫu"
                         class="w-16 px-2 py-1 text-xs font-bold font-mono text-center bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 outline-none focus:bg-indigo-50/40" />
                  <span class="px-2 py-1 text-[11px] font-bold text-slate-400 border-l border-slate-200 dark:border-slate-800">
                    {{ massUnit }}
                  </span>
                </div>
              }

              <span class="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                {{ visibleCompounds().length }}/{{ (config?.compounds || []).length }} hoạt chất hiển thị
              </span>
            </div>

            <!-- Action Controls -->
            @if (!isReadOnly) {
              <div class="flex flex-wrap items-center gap-2">
                @if (undoStack.size > 0) {
                  <button type="button"
                          (click)="undoLastPaste()"
                          [attr.aria-label]="'Hoàn tác dán: ' + (undoStack.peek()?.summary || '')"
                          [title]="'Hoàn tác: ' + (undoStack.peek()?.summary || '')"
                          class="inline-flex h-8 items-center gap-1.5 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/30 px-2.5 text-xs font-bold text-amber-700 dark:text-amber-300 hover:bg-amber-100 transition active:scale-95">
                    <i class="fa-solid fa-rotate-left text-[11px]" aria-hidden="true"></i>
                    <span>Hoàn tác</span>
                  </button>
                }

                <button type="button"
                        (click)="bulkFillNd.emit()"
                        class="inline-flex h-8 items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 dark:hover:bg-amber-950/30 transition active:scale-95">
                  <i class="fa-solid fa-pen-nib text-[11px] text-amber-500" aria-hidden="true"></i>
                  <span>Đặt Tất Cả ND</span>
                </button>

                @if (showQcColumns && showBulkQcButton) {
                  <button type="button"
                          (click)="bulkQcPass.emit()"
                          class="inline-flex h-8 items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 dark:hover:bg-emerald-950/30 transition active:scale-95">
                    <i class="fa-solid fa-circle-check text-[11px] text-emerald-500" aria-hidden="true"></i>
                    <span>Tất Cả QC Đạt</span>
                  </button>
                }

                @if (sampleList().length > 1) {
                  <button type="button"
                          (click)="copySampleToAll.emit()"
                          title="Sao chép toàn bộ kết quả của mẫu đang hiển thị cho tất cả các mẫu khác trong mẻ chạy này"
                          class="inline-flex h-8 items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-3 text-xs font-bold text-white shadow-xs transition active:scale-95">
                    <i class="fa-solid fa-copy text-[11px]" aria-hidden="true"></i>
                    <span>Sao Chép Cho Cả Mẻ</span>
                  </button>
                }
              </div>
            }
          </div>

          <!-- Search + Assigned Filter Scope Strip -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div class="relative flex-1 sm:max-w-xs">
              <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" aria-hidden="true"></i>
              <input type="text"
                     [ngModel]="searchQuery()"
                     (ngModelChange)="searchQuery.set($event)"
                     aria-label="Tìm hoạt chất trong bảng"
                     placeholder="Tìm hoạt chất..."
                     class="h-9 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 pl-9 pr-3 text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
            </div>

            <div class="flex items-center justify-between sm:justify-end gap-2">
              @if (hasValidTargetMapping()) {
                <div class="inline-flex items-center rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-0.5 text-[11px]">
                  <button type="button"
                          (click)="targetScope.set('assigned')"
                          [class]="targetScope() === 'assigned'
                            ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-xs font-bold'
                            : 'text-slate-600 dark:text-slate-400 font-semibold'"
                          class="rounded-lg px-2.5 py-1 transition">
                    Chỉ chất chỉ định ({{ assignedCompoundsForActive().length }})
                  </button>
                  <button type="button"
                          (click)="targetScope.set('all')"
                          [class]="targetScope() === 'all'
                            ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-xs font-bold'
                            : 'text-slate-600 dark:text-slate-400 font-semibold'"
                          class="rounded-lg px-2.5 py-1 transition">
                    Tất cả ({{ (config?.compounds || []).length }})
                  </button>
                </div>
              }
              <span class="hidden xl:inline text-[10px] text-slate-400 dark:text-slate-500">
                <kbd class="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">↑↓</kbd> đổi chất ·
                <kbd class="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">Alt+↑↓</kbd> đổi mẫu
              </span>
            </div>
          </div>

          <!-- Inline Pending Paste Confirmation Banner (when overwrites/warnings detected) -->
          @if (pendingPastePlan(); as plan) {
            <div class="rounded-2xl border border-amber-300/80 dark:border-amber-800 bg-amber-50/80 dark:bg-amber-950/30 p-3.5 text-xs space-y-2">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <span class="font-bold text-amber-800 dark:text-amber-300">
                  Xem trước dán {{ plan.diffs.length }} giá trị từ clipboard
                  @if (plan.overwriteCount > 0) { (ghi đè {{ plan.overwriteCount }} ô đã có dữ liệu) }
                </span>
                <div class="flex items-center gap-2">
                  <button type="button"
                          (click)="cancelPendingPaste()"
                          class="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1 font-bold text-slate-600 dark:text-slate-300">
                    Hủy
                  </button>
                  <button type="button"
                          [disabled]="plan.diffs.length === 0 || plan.invalidCells.length > 0"
                          (click)="confirmPendingPaste()"
                          class="rounded-lg bg-indigo-600 hover:bg-indigo-700 px-3 py-1 font-bold text-white disabled:opacity-50">
                    Áp dụng ({{ plan.diffs.length }})
                  </button>
                </div>
              </div>
              @if (plan.invalidCells.length > 0) {
                <div class="text-rose-700 dark:text-rose-300 font-semibold">
                  Có {{ plan.invalidCells.length }} ô không hợp lệ (ví dụ: {{ plan.invalidCells[0].colLabel }}: "{{ plan.invalidCells[0].rawValue }}").
                </div>
              }
              @if (plan.skippedUnassigned.length > 0) {
                <div class="text-amber-700 dark:text-amber-400">
                  Bỏ qua {{ plan.skippedUnassigned.length }} chỉ tiêu không chỉ định cho mẫu này.
                </div>
              }
            </div>
          }

          <!-- Compound Result Table -->
          <div class="overflow-x-auto custom-scrollbar border border-slate-200/80 dark:border-slate-800 rounded-2xl max-h-[560px] overflow-y-auto">
            <table class="w-full text-sm border-collapse">
              <thead>
                <tr class="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 shadow-xs">
                  <th class="py-2.5 px-3 text-center font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider w-12">STT</th>
                  <th class="py-2.5 px-3 text-left font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider min-w-[160px]">Hoạt chất</th>
                  <th class="py-2.5 px-3 text-left font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider min-w-[200px]">
                    Kết quả ({{ resultUnit }}) &amp; ND
                  </th>
                  @if (showQcColumns) {
                    <th class="py-2.5 px-2 text-center font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider w-28">{{ qc1Header }}</th>
                    <th class="py-2.5 px-2 text-center font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider w-28">{{ qc2Header }}</th>
                    <th class="py-2.5 px-2 text-center font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider w-28">{{ qc3Header }}</th>
                  }
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800/80">
                @for (compound of visibleCompounds(); track compound; let idx = $index) {
                  @let assigned = isTargetAssigned(activeSampleCode, compound);
                  @let rowData = draft.resultData[activeSampleCode];
                  @let isNd = !!(rowData?.[compound + '_nd']);
                  @let rawVal = rowData?.[compound] ?? '';
                  @let trimmedVal = ('' + rawVal).trim();
                  @let isNumeric = assigned && !isNd && trimmedVal !== '' && isNumericLike(trimmedVal);
                  @let hasValidationError = assigned && !isNd && trimmedVal !== '' && !isValidResultText(trimmedVal);
                  <tr [class]="assigned
                        ? 'hover:bg-slate-50/60 dark:hover:bg-slate-800/25 focus-within:bg-indigo-50/20 dark:focus-within:bg-indigo-950/20 border-l-4 border-l-transparent focus-within:border-l-indigo-500 transition-colors'
                        : 'bg-slate-50/50 dark:bg-slate-950/30 opacity-60 text-slate-400 border-l-4 border-l-slate-200 dark:border-l-slate-800'">
                    <td class="py-2 px-3 font-mono text-xs text-slate-400 font-bold text-center">{{ idx + 1 }}</td>
                    <td class="py-2 px-3 text-xs font-bold">
                      @if (!assigned) {
                        <span class="inline-flex items-center gap-1.5 text-slate-400 dark:text-slate-500 line-through">
                          <i class="fa-solid fa-lock text-[10px]" title="Không thuộc chỉ tiêu kiểm nghiệm của mẫu này" aria-hidden="true"></i>
                          <span>{{ compoundDisplayNames[compound] || compound }}</span>
                        </span>
                      } @else {
                        <span class="text-slate-700 dark:text-slate-200">{{ compoundDisplayNames[compound] || compound }}</span>
                      }
                    </td>

                    <!-- Composite Result Cell: Input + Inline ND Toggle -->
                    <td class="py-1.5 px-2.5">
                      @if (rowData) {
                        <div class="flex items-center gap-1.5">
                          <input type="text"
                                 [id]="'md-result-' + idx"
                                 [disabled]="!assigned"
                                 [readOnly]="isReadOnly"
                                 [(ngModel)]="rowData[compound]"
                                 (ngModelChange)="onCellResultInput(compound)"
                                 (keydown)="onResultInputKeyDown($event, idx)"
                                 (paste)="onResultCellPaste($event, idx)"
                                 [attr.aria-label]="'Kết quả ' + (compoundDisplayNames[compound] || compound) + ' cho mẫu ' + activeSampleCode + ' (' + resultUnit + ')'"
                                 [attr.aria-describedby]="hasValidationError ? 'md-err-' + idx : null"
                                 [attr.aria-invalid]="hasValidationError"
                                 [placeholder]="!assigned ? 'N/A' : (isNd ? 'ND (KPH)' : 'Số / <LOQ')"
                                 [class]="hasValidationError
                                   ? 'border-rose-400 bg-rose-50/40 text-rose-800 dark:border-rose-700 dark:bg-rose-950/30 dark:text-rose-200'
                                   : (isNumeric
                                     ? 'bg-indigo-50/40 dark:bg-indigo-950/30 border-indigo-400 dark:border-indigo-700 text-indigo-950 dark:text-indigo-200 font-bold'
                                     : (isNd
                                       ? 'bg-slate-50 dark:bg-slate-900/60 text-slate-400 dark:text-slate-500 border-slate-200/80 dark:border-slate-800'
                                       : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'))"
                                 class="flex-1 min-w-[110px] h-8 rounded-xl border px-2.5 text-xs text-center outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-100/60 dark:disabled:bg-slate-900/40 disabled:text-slate-400 disabled:cursor-not-allowed" />

                          <button type="button"
                                  [disabled]="!assigned || isReadOnly"
                                  (click)="toggleNdForCompound(compound)"
                                  [attr.aria-pressed]="isNd"
                                  [attr.aria-label]="'Đánh dấu Không phát hiện cho ' + (compoundDisplayNames[compound] || compound)"
                                  title="Bật/tắt Không phát hiện (ND)"
                                  [class]="isNd
                                    ? 'border-indigo-500 bg-indigo-600 text-white'
                                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:border-indigo-300 hover:text-indigo-600'"
                                  class="h-8 px-2.5 rounded-xl border text-[11px] font-bold transition shrink-0 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed">
                            ND
                          </button>
                        </div>
                        @if (hasValidationError) {
                          <p [id]="'md-err-' + idx" class="mt-1 text-[10px] font-semibold text-rose-600 dark:text-rose-400">
                            Nhập số hợp lệ, ND, KPH hoặc &lt;LOQ
                          </p>
                        }
                      }
                    </td>

                    <!-- QC1..QC3 Toggle Groups -->
                    @if (showQcColumns && rowData) {
                      @for (qcKey of qcKeys; track qcKey) {
                        <td class="py-1.5 px-1.5 text-center">
                          <div class="inline-flex items-center rounded-lg border border-slate-200/70 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-0.5 select-none"
                               [class.opacity-40]="!assigned || isReadOnly"
                               [class.pointer-events-none]="!assigned || isReadOnly">
                            <button type="button"
                                    [disabled]="!assigned || isReadOnly"
                                    (click)="setQc(compound, qcKey, 'Đạt')"
                                    [class]="rowData[compound + '_' + qcKey] === 'Đạt'
                                      ? 'bg-emerald-600 text-white shadow-xs font-bold'
                                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 font-semibold'"
                                    class="min-w-[30px] rounded px-1.5 py-1 text-[10px] transition active:scale-95">
                              Đạt
                            </button>
                            <button type="button"
                                    [disabled]="!assigned || isReadOnly"
                                    (click)="setQc(compound, qcKey, 'Không đạt')"
                                    [class]="rowData[compound + '_' + qcKey] === 'Không đạt'
                                      ? 'bg-rose-600 text-white shadow-xs font-bold'
                                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 font-semibold'"
                                    class="min-w-[28px] rounded px-1.5 py-1 text-[10px] transition active:scale-95">
                              KĐ
                            </button>
                            @if (allowQcNa) {
                              <button type="button"
                                      [disabled]="!assigned || isReadOnly"
                                      (click)="setQc(compound, qcKey, 'N/A')"
                                      [class]="!rowData[compound + '_' + qcKey] || rowData[compound + '_' + qcKey] === 'N/A'
                                        ? 'bg-slate-300 dark:bg-slate-600 text-slate-800 dark:text-slate-100 shadow-xs font-bold'
                                        : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 font-semibold'"
                                      class="min-w-[24px] rounded px-1 py-1 text-[9px] transition active:scale-95">
                                N/A
                              </button>
                            }
                          </div>
                        </td>
                      }
                    }
                  </tr>
                } @empty {
                  <tr>
                    <td [attr.colspan]="showQcColumns ? 6 : 3" class="py-8 text-center text-xs text-slate-400">
                      Không có hoạt chất nào khớp bộ lọc hiện tại.
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SopMasterDetailCompoundGridComponent implements OnChanges {
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  @Input() run: any = null;
  @Input() draft!: AnalysisResultDraft;
  @Input() config: any = null;
  @Input() compoundDisplayNames: Record<string, string> = {};
  @Input() activeSampleCode = '';
  @Input() publishedSampleSet: Set<string> | null = null;
  @Input() isReadOnly = false;
  @Input() showSelectionControls = true;
  @Input() showGopInChung = true;
  @Input() showMassControl = true;
  @Input() showBulkQcButton = true;
  @Input() showQcColumns = true;
  @Input() allowQcNa = true;
  @Input() massLabel = 'm';
  @Input() massUnit = 'g';
  @Input() resultUnit = 'µg/kg';
  @Input() qc1Header = 'QC1 (Độ thu hồi R%)';
  @Input() qc2Header = 'QC2 (Hệ số tuyến tính R²)';
  @Input() qc3Header = 'QC3 (Kết luận)';

  @Output() activeSampleChange = new EventEmitter<string>();
  @Output() toggleSampleSelected = new EventEmitter<{ sampleCode: string; checked: boolean }>();
  @Output() toggleSelectAll = new EventEmitter<void>();
  @Output() bulkFillNd = new EventEmitter<void>();
  @Output() bulkQcPass = new EventEmitter<void>();
  @Output() copySampleToAll = new EventEmitter<void>();
  @Output() ndChanged = new EventEmitter<string>();
  @Output() resultChanged = new EventEmitter<string>();
  @Output() qcChanged = new EventEmitter<{ compound: string; qcKey: 'qc1' | 'qc2' | 'qc3'; status: 'Đạt' | 'Không đạt' | 'N/A' }>();
  @Output() sampleMassChanged = new EventEmitter<void>();

  readonly qcKeys: readonly ('qc1' | 'qc2' | 'qc3')[] = ['qc1', 'qc2', 'qc3'];

  searchQuery = signal('');
  targetScope = signal<'assigned' | 'all'>('all');
  pendingPastePlan = signal<PasteTransactionPlan | null>(null);

  undoStack = new PasteUndoStack();
  private mutationRevision = 0;
  private initializedRunId: string | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    const currentRunId = this.run?.id || null;
    if (changes['run'] && currentRunId !== this.initializedRunId) {
      this.initializedRunId = currentRunId;
      this.targetScope.set(this.hasValidTargetMapping() ? 'assigned' : 'all');
      this.undoStack.clear();
      this.pendingPastePlan.set(null);
    }
  }

  @HostListener('window:lims-preflight-select-sample', ['$event'])
  onPreflightSelectSample(event: Event): void {
    const code = (event as CustomEvent<{ sampleCode?: string }>).detail?.sampleCode;
    if (code && this.sampleList().includes(code) && code !== this.activeSampleCode) {
      this.selectSample(code);
    }
  }

  sampleList(): string[] {
    return Array.isArray(this.run?.sampleList) ? this.run.sampleList : [];
  }

  activeSampleIndex(): number {
    return this.sampleList().indexOf(this.activeSampleCode);
  }

  selectedCount(): number {
    return this.sampleList().filter(s => this.draft?.resultData?.[s]?.['selected'] !== false).length;
  }

  isAllSelected(): boolean {
    const samples = this.sampleList();
    return samples.length > 0 && samples.every(s => this.draft?.resultData?.[s]?.['selected'] !== false);
  }

  hasValidTargetMapping(): boolean {
    const samples = this.sampleList();
    const targetMap = this.run?.sampleTargetMap ?? this.run?.inputs?.sampleTargetMap;
    if (!targetMap || typeof targetMap !== 'object' || samples.length === 0) return false;
    return samples.some(s => Array.isArray(targetMap[s]) && targetMap[s].length > 0);
  }

  isTargetAssigned(sampleCode: string, compound: string): boolean {
    if (!this.run || !sampleCode) return true;
    const targetMap = this.run.sampleTargetMap ?? this.run.inputs?.sampleTargetMap;
    if (!targetMap) return true;
    return isCompoundAssigned(targetMap[sampleCode], compound);
  }

  assignedCompoundsForActive(): string[] {
    const compounds: string[] = this.config?.compounds || [];
    return compounds.filter(c => this.isTargetAssigned(this.activeSampleCode, c));
  }

  visibleCompounds(): string[] {
    const compounds: string[] = this.config?.compounds || [];
    const scoped =
      this.targetScope() === 'assigned' && this.hasValidTargetMapping()
        ? compounds.filter(c => this.isTargetAssigned(this.activeSampleCode, c))
        : compounds;

    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return scoped;
    return scoped.filter(c => {
      const display = (this.compoundDisplayNames[c] || c).toLowerCase();
      return c.toLowerCase().includes(q) || display.includes(q);
    });
  }

  getSampleStats(sampleCode: string): SampleProgressSummary {
    const compounds: string[] = this.config?.compounds || [];
    const row = this.draft?.resultData?.[sampleCode] || {};
    let assignedTotal = 0;
    let assignedDone = 0;
    let numericCount = 0;

    for (const c of compounds) {
      if (!this.isTargetAssigned(sampleCode, c)) continue;
      assignedTotal++;
      const isNd = row[`${c}_nd`] === true;
      const raw = row[c] !== undefined && row[c] !== null ? String(row[c]).trim() : '';
      if (isNd) {
        assignedDone++;
      } else if (raw !== '' && raw !== 'N/A') {
        assignedDone++;
        if (this.isNumericLike(raw)) {
          numericCount++;
        }
      }
    }

    return {
      sampleCode,
      assignedTotal,
      assignedDone,
      numericCount,
      isAllNd: assignedTotal > 0 && assignedDone === assignedTotal && numericCount === 0,
      isPublished: Boolean(this.publishedSampleSet?.has(sampleCode)),
    };
  }

  isNumericLike(raw: string): boolean {
    const parsed = normalizePastedResultValue(raw);
    return parsed.kind === 'numeric' || parsed.kind === 'loq';
  }

  isValidResultText(raw: string): boolean {
    const parsed = normalizePastedResultValue(raw);
    return parsed.kind !== 'invalid';
  }

  selectSample(sampleCode: string): void {
    this.activeSampleChange.emit(sampleCode);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('lims-active-sample-changed', { detail: { sampleCode } }));
    }
  }

  stepSample(delta: number): void {
    const samples = this.sampleList();
    if (samples.length === 0) return;
    const nextIdx = Math.max(0, Math.min(samples.length - 1, this.activeSampleIndex() + delta));
    const next = samples[nextIdx];
    if (next && next !== this.activeSampleCode) {
      this.selectSample(next);
    }
  }

  onHostKeyDown(event: KeyboardEvent): void {
    if (event.altKey && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
      event.preventDefault();
      this.stepSample(event.key === 'ArrowUp' ? -1 : 1);
    }
  }

  onResultInputKeyDown(event: KeyboardEvent, idx: number): void {
    if (event.altKey) return;
    if (event.key === 'Escape') {
      (event.target as HTMLElement)?.blur();
      return;
    }

    let step = 0;
    if (event.key === 'ArrowDown' || event.key === 'Enter') {
      step = 1;
    } else if (event.key === 'ArrowUp') {
      step = -1;
    } else {
      return;
    }

    event.preventDefault();
    const list = this.visibleCompounds();
    let cursor = idx + step;
    while (cursor >= 0 && cursor < list.length) {
      if (this.isTargetAssigned(this.activeSampleCode, list[cursor])) {
        const nextEl = document.getElementById(`md-result-${cursor}`) as HTMLInputElement | null;
        if (nextEl && !nextEl.disabled) {
          nextEl.focus();
          nextEl.select();
          return;
        }
      }
      cursor += step;
    }
  }

  onToggleSampleSelected(sampleCode: string, checked: boolean): void {
    if (this.isReadOnly) return;
    this.mutationRevision++;
    this.toggleSampleSelected.emit({ sampleCode, checked });
  }

  onToggleSelectAll(): void {
    if (this.isReadOnly) return;
    this.mutationRevision++;
    this.toggleSelectAll.emit();
  }

  toggleNdForCompound(compound: string): void {
    if (this.isReadOnly || !this.isTargetAssigned(this.activeSampleCode, compound)) return;
    const row = this.draft?.resultData?.[this.activeSampleCode];
    if (!row) return;
    row[`${compound}_nd`] = !row[`${compound}_nd`];
    this.mutationRevision++;
    this.ndChanged.emit(compound);
  }

  onCellResultInput(compound: string): void {
    if (this.isReadOnly) return;
    this.mutationRevision++;
    this.resultChanged.emit(compound);
  }

  setQc(compound: string, qcKey: 'qc1' | 'qc2' | 'qc3', status: 'Đạt' | 'Không đạt' | 'N/A'): void {
    if (this.isReadOnly) return;
    this.mutationRevision++;
    this.qcChanged.emit({ compound, qcKey, status });
  }

  private getWriteGuardContext(): WriteGuardContext {
    const canEdit = this.auth.isManager() || this.auth.canRunBatch() || this.auth.canApprove();
    return {
      canEdit,
      isReadOnly: this.isReadOnly,
      isLockedByOthers: false,
      isCompleted: this.draft?.status === 'completed',
    };
  }

  onResultCellPaste(event: ClipboardEvent, startRowIdx: number): void {
    if (this.isReadOnly) {
      event.preventDefault();
      return;
    }
    const text = event.clipboardData?.getData('text/plain') || '';
    const matrix = parseSpreadsheetPasteText(text);
    // Single scalar without newlines or tabs can use normal native input paste
    if (matrix.length <= 1 && (matrix[0]?.length || 0) <= 1) {
      return;
    }
    event.preventDefault();
    const sample = this.activeSampleCode;
    const visible = this.visibleCompounds();
    const grid = {
      rows: visible.map(comp => ({
        rowKey: comp,
        rowLabel: this.compoundDisplayNames[comp] || comp,
      })),
      columns: [{ colKey: 'result', colLabel: `Kết quả (${this.resultUnit})` }],
      startRowIndex: startRowIdx,
      startColIndex: 0,
      minNumericValue: 0,
      getCellSpec: (comp: string) => ({
        rowKey: comp,
        rowLabel: this.compoundDisplayNames[comp] || comp,
        colKey: 'result',
        colLabel: 'Kết quả',
        editable: !this.isReadOnly,
        assigned: this.isTargetAssigned(sample, comp),
        isNdMode: true,
      }),
      readCell: (comp: string) => {
        const row = this.draft?.resultData?.[sample] || {};
        return {
          value: String(row[comp] ?? ''),
          nd: Boolean(row[`${comp}_nd`]),
        };
      },
    };

    const plan = planSpreadsheetPaste(matrix, grid, this.getWriteGuardContext());
    if (!plan.allowed) {
      this.toast.show(plan.blockedReason || 'Không thể dán dữ liệu.', 'error');
      return;
    }

    if (plan.invalidCells.length > 0 || plan.overwriteCount > 0 || plan.skippedUnassigned.length > 0) {
      this.pendingPastePlan.set(plan);
      return;
    }

    this.executePastePlan(plan);
  }

  cancelPendingPaste(): void {
    this.pendingPastePlan.set(null);
  }

  confirmPendingPaste(): void {
    const plan = this.pendingPastePlan();
    if (!plan) return;
    this.pendingPastePlan.set(null);
    this.executePastePlan(plan);
  }

  private executePastePlan(plan: PasteTransactionPlan): void {
    const sample = this.activeSampleCode;
    const row = this.draft?.resultData?.[sample];
    if (!row) return;

    const changedCompounds: string[] = [];
    const res = applyPasteTransaction(
      plan,
      this.getWriteGuardContext(),
      this.mutationRevision,
      (comp, _col, value, nd) => {
        row[comp] = value;
        row[`${comp}_nd`] = Boolean(nd);
        if (nd) {
          row[`${comp}_qc1`] = 'Đạt';
          row[`${comp}_qc2`] = 'Đạt';
          row[`${comp}_qc3`] = 'Đạt';
        }
        changedCompounds.push(comp);
      },
      `Dán ${plan.diffs.length} hoạt chất cho mẫu ${sample}`
    );

    if (!res.applied || !res.transaction) {
      this.toast.show(res.reason || 'Không thể dán dữ liệu.', 'error');
      return;
    }

    this.mutationRevision = res.nextRevision;
    this.undoStack.push(res.transaction);
    if (changedCompounds.length > 0) {
      this.resultChanged.emit(changedCompounds[0]);
    }
    this.toast.show(`Đã dán ${res.appliedCount} kết quả cho mẫu ${sample}.`, 'success');
  }

  undoLastPaste(): void {
    if (this.isReadOnly) return;
    const sample = this.activeSampleCode;
    const row = this.draft?.resultData?.[sample];
    if (!row) return;

    let restoredFirstComp: string | null = null;
    const res = this.undoStack.undoLast(
      this.getWriteGuardContext(),
      this.mutationRevision,
      comp => ({
        value: String(row[comp] ?? ''),
        nd: Boolean(row[`${comp}_nd`]),
      }),
      (comp, _col, value, nd) => {
        row[comp] = value;
        row[`${comp}_nd`] = Boolean(nd);
        if (!restoredFirstComp) restoredFirstComp = comp;
      }
    );

    if (!res.undone) {
      this.toast.show(res.reason || 'Không thể hoàn tác.', 'warning');
      return;
    }

    this.mutationRevision = res.nextRevision;
    if (restoredFirstComp) {
      this.resultChanged.emit(restoredFirstComp);
    }
    this.toast.show(`Đã hoàn tác ${res.restoredCount} giá trị vừa dán.`, 'success');
  }
}
