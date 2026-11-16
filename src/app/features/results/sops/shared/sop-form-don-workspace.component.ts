import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalysisResultDraft } from '../../../../core/models/analysis-result.model';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { SopCalibrationPointsComponent } from './sop-calibration-points.component';
import { SopSpreadsheetToolbarComponent } from './sop-spreadsheet-toolbar.component';
import { ChromatographyRow } from './abstract-sop-entry';
import { isCompoundAssigned } from '../../shared/compound-id-resolver';
import {
  applyPasteTransaction,
  parseSpreadsheetPasteText,
  PasteTransactionPlan,
  PasteUndoStack,
  planSpreadsheetPaste,
  WriteGuardContext,
} from './sop-paste-undo';

@Component({
  selector: 'app-sop-form-don-workspace',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SopCalibrationPointsComponent,
    SopSpreadsheetToolbarComponent,
  ],
  template: `
    <div class="space-y-5 animate-fade-in">
      <!-- 1. Calibration Curve Parameters & QC Setup -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 p-5 space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <h4 class="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2 m-0">
            <i class="fa-solid fa-chart-line text-indigo-600 dark:text-indigo-400 text-sm" aria-hidden="true"></i>
            <span>Khai Báo Đường Chuẩn &amp; QC Sắc Ký</span>
          </h4>

          <!-- Quick Vial input for Calibration -->
          <div class="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-xl px-2.5 py-1 text-xs">
            <span class="font-bold text-slate-500 dark:text-slate-400">Lọ chuẩn:</span>
            <input type="number"
                   [disabled]="isReadOnly"
                   [ngModel]="bulkCalibVialStart"
                   (ngModelChange)="bulkCalibVialStartChange.emit($event)"
                   placeholder="Bắt đầu"
                   aria-label="Số lọ chuẩn bắt đầu"
                   class="w-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-1.5 py-0.5 text-center text-slate-800 dark:text-slate-200 font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-50" />
            <span class="text-slate-400">-</span>
            <input type="number"
                   [ngModel]="bulkCalibVialEnd"
                   readonly
                   aria-label="Số lọ chuẩn kết thúc"
                   class="w-14 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-1.5 py-0.5 text-center text-slate-500 font-bold outline-none cursor-not-allowed" />
            <button type="button"
                    [disabled]="isReadOnly"
                    (click)="applyCalibVials.emit()"
                    class="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition flex items-center gap-1 active:scale-95 shadow-xs disabled:opacity-50">
              <i class="fa-solid fa-check text-[10px]" aria-hidden="true"></i>
              <span>Áp dụng</span>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div class="lg:col-span-4 space-y-3.5">
            <div>
              <label class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Tên mẫu trắng (Blank)</label>
              <input type="text"
                     [readOnly]="isReadOnly"
                     [(ngModel)]="draft.page1Data['blankName']"
                     (ngModelChange)="emitDataChanged()"
                     (focus)="$any($event.target).select()"
                     placeholder="BLANK"
                     class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition" />
            </div>

            <div>
              <label class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Tên mẫu thêm chuẩn (Spike)</label>
              <input type="text"
                     [readOnly]="isReadOnly"
                     [(ngModel)]="draft.page1Data['spikeName']"
                     (ngModelChange)="emitDataChanged()"
                     (focus)="$any($event.target).select()"
                     placeholder="SPIKE"
                     class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition" />
            </div>

            <div data-preflight-target="r2">
              <label class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                Hệ số xác định R²
                @if (draft.page1Data['activeCompound']) {
                  <span class="font-normal text-indigo-600 dark:text-indigo-400">({{ compoundDisplayNames[draft.page1Data['activeCompound']] || draft.page1Data['activeCompound'] }})</span>
                }
              </label>
              @if (draft.page1Data['r2ByCompound']) {
                <input type="text"
                       [readOnly]="isReadOnly"
                       [(ngModel)]="draft.page1Data['r2ByCompound'][draft.page1Data['activeCompound']]"
                       (ngModelChange)="emitDataChanged()"
                       (focus)="$any($event.target).select()"
                       placeholder="0.999..."
                       class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-bold font-mono text-indigo-700 dark:text-indigo-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition" />
              }
            </div>

            <div>
              <label class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Mẫu QC cuối mẻ</label>
              <label class="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 select-none transition hover:bg-slate-50 dark:hover:bg-slate-800"
                     [class.cursor-pointer]="!isReadOnly">
                <input type="checkbox"
                       [disabled]="isReadOnly"
                       [(ngModel)]="draft.page1Data['hasFinal']"
                       (ngModelChange)="onFinalCheckboxToggled()"
                       class="w-4 h-4 rounded text-indigo-600 border-slate-300 dark:border-slate-700 focus:ring-indigo-500 disabled:opacity-50" />
                <span class="text-xs font-bold text-slate-700 dark:text-slate-200">Thêm mẫu kiểm tra cuối mẻ</span>
              </label>
            </div>
          </div>

          <div class="lg:col-span-8">
            <app-sop-calibration-points
              title="Các Điểm Đường Chuẩn (Calibration Curve Points)"
              [calibPoints]="draft.page1Data['calibPoints']"
              [pointLabels]="[]"
              pointPrefix="Chuẩn C"
              [isSuffixVisible]="false"
              [isReadOnly]="isReadOnly"
              (pointsChanged)="onCalibPointsUpdated()">
            </app-sop-calibration-points>
          </div>
        </div>
      </div>

      <!-- 2. Sample Spreadsheet & Parameters -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 p-5 space-y-4">
        <app-sop-spreadsheet-toolbar
          title="Bảng Thông Số Chạy Mẫu &amp; Kết Quả"
          [isReadOnly]="isReadOnly"
          [canUndo]="undoStack.size > 0"
          [undoSummary]="undoStack.peek()?.summary || ''"
          [showMobileCardToggle]="true"
          [mobileViewMode]="mobileViewMode()"
          (mobileViewModeChange)="mobileViewMode.set($event)"
          (pasteRequested)="openClipboardPrompt()"
          (undoRequested)="undoLastPaste()"
          (fillNdRequested)="bulkFillNd.emit()">
          <div toolbar-extra class="flex flex-wrap items-center gap-2">
            <div class="flex items-center gap-1.5">
              <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Hoạt chất:</span>
              <select [(ngModel)]="draft.page1Data['activeCompound']"
                      (ngModelChange)="activeCompoundChanged.emit()"
                      aria-label="Chọn hoạt chất đang nhập cho Form Đơn"
                      class="h-8 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition cursor-pointer max-w-[210px]">
                @for (c of assignedCompounds; track c) {
                  <option [value]="c">{{ compoundDisplayNames[c] || c }}</option>
                }
              </select>
            </div>

            <!-- Bulk Vial Input for samples -->
            @if (!isReadOnly) {
              <div class="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-xl px-2 py-0.5 text-xs">
                <span class="font-bold text-slate-500 dark:text-slate-400 text-[11px]">Lọ:</span>
                <input type="number"
                       [ngModel]="bulkVialStart"
                       (ngModelChange)="bulkVialStartChange.emit($event)"
                       placeholder="Từ"
                       aria-label="Số lọ mẫu bắt đầu"
                       class="w-12 h-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-1 text-center text-slate-800 dark:text-slate-200 font-bold outline-none focus:ring-1 focus:ring-indigo-500" />
                <span class="text-slate-400">-</span>
                <input type="number"
                       [ngModel]="bulkVialEnd"
                       readonly
                       aria-label="Số lọ mẫu kết thúc"
                       class="w-12 h-7 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-1 text-center text-slate-500 font-bold outline-none cursor-not-allowed" />
                <button type="button"
                        (click)="applyBulkVials.emit()"
                        class="h-7 px-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition flex items-center gap-1 active:scale-95 shadow-xs text-[11px]">
                  <i class="fa-solid fa-check text-[10px]" aria-hidden="true"></i>
                  <span>Áp dụng</span>
                </button>
              </div>
            }
          </div>
        </app-sop-spreadsheet-toolbar>

        <!-- Paste Preview Diff Banner -->
        @if (pendingPastePlan(); as plan) {
          <div class="rounded-2xl border border-amber-300/80 dark:border-amber-800 bg-amber-50/80 dark:bg-amber-950/30 p-3.5 text-xs space-y-2">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <span class="font-bold text-amber-800 dark:text-amber-300">
                Xem trước dán {{ plan.diffs.length }} giá trị
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
                Có {{ plan.invalidCells.length }} ô không hợp lệ ({{ plan.invalidCells[0].rowLabel }} · {{ plan.invalidCells[0].colLabel }}: "{{ plan.invalidCells[0].rawValue }}").
              </div>
            }
            @if (plan.skippedUnassigned.length > 0) {
              <div class="text-amber-700 dark:text-amber-400">
                Đã bỏ qua {{ plan.skippedUnassigned.length }} ô không được phép hoặc chưa chỉ định.
              </div>
            }
          </div>
        }

        <!-- MOBILE SAMPLE CARDS VIEW (< md screens when toggled to 'cards') -->
        @if (mobileViewMode() === 'cards') {
          <div class="md:hidden space-y-3">
            @for (row of chromatographyRows; track row.key; let idx = $index) {
              @let rowData = draft.resultData[row.key];
              @let activeComp = draft.page1Data['activeCompound'];
              @let assigned = row.type === 'QC' || isTargetAssigned(row.key, activeComp);
              <div class="rounded-2xl border p-3.5 space-y-3"
                   [class]="row.type === 'QC'
                     ? 'border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/40 dark:bg-indigo-950/20'
                     : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'">
                <div class="flex items-center justify-between gap-2">
                  <label class="flex items-center gap-2 font-mono text-xs font-bold text-slate-800 dark:text-slate-100">
                    <input type="checkbox"
                           [disabled]="isReadOnly"
                           [(ngModel)]="rowData['selected']"
                           (ngModelChange)="emitDataChanged()"
                           class="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                    <span>{{ row.label }}</span>
                    @if (row.type === 'QC') {
                      <span class="rounded-full bg-indigo-100 dark:bg-indigo-950/60 px-2 py-0.5 text-[10px] text-indigo-700 dark:text-indigo-300">QC</span>
                    }
                  </label>
                  <span class="font-mono text-[11px] text-slate-400">Lọ {{ rowData['loSo'] || '—' }}</span>
                </div>

                <div class="grid grid-cols-2 gap-2.5 text-xs">
                  <label class="block">
                    <span class="text-[10px] font-bold text-slate-400 uppercase block mb-1">{{ massColumnLabel }}</span>
                    <input type="text"
                           [readOnly]="isReadOnly || row.key === 'QC_FINAL'"
                           [(ngModel)]="rowData['khoiLuong']"
                           (ngModelChange)="emitDataChanged()"
                           class="h-9 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-2.5 text-center font-bold outline-none focus:border-indigo-500" />
                  </label>
                  <label class="block">
                    <span class="text-[10px] font-bold text-slate-400 uppercase block mb-1">HS pha loãng F</span>
                    <input type="text"
                           [readOnly]="isReadOnly || row.key === 'QC_FINAL'"
                           [(ngModel)]="rowData['heSoPhaLoang']"
                           (ngModelChange)="syncDilution.emit(row.key)"
                           class="h-9 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-2.5 text-center font-bold outline-none focus:border-indigo-500" />
                  </label>
                  <label class="block col-span-2">
                    <span class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Kết quả ({{ resultUnit }})</span>
                    <input type="text"
                           [disabled]="!assigned"
                           [readOnly]="isReadOnly"
                           [(ngModel)]="rowData[activeComp]"
                           (ngModelChange)="chromResultChanged.emit(row.key)"
                           placeholder="ND / Kết quả"
                           class="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 text-center font-bold outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50" />
                  </label>
                  <label class="block col-span-2">
                    <span class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Ghi chú</span>
                    <input type="text"
                           [readOnly]="isReadOnly"
                           [(ngModel)]="rowData[activeComp + '_ghiChu']"
                           (ngModelChange)="emitDataChanged()"
                           placeholder="Ghi chú..."
                           class="h-9 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-2.5 outline-none focus:border-indigo-500" />
                  </label>
                </div>
              </div>
            }
          </div>
        }

        <!-- DESKTOP & TABLE VIEW -->
        <div [class.hidden]="mobileViewMode() === 'cards'" class="md:!block overflow-x-auto custom-scrollbar border border-slate-200/80 dark:border-slate-800 rounded-2xl">
          <table class="w-full text-xs border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                <th class="py-2.5 px-2.5 text-center font-bold text-slate-500 dark:text-slate-400 w-10">STT</th>
                <th class="py-2.5 px-3 text-left font-bold text-slate-500 dark:text-slate-400 min-w-[140px] sticky left-0 z-10 bg-slate-50 dark:bg-slate-950 border-r border-slate-200/70 dark:border-slate-800">Mã số mẫu</th>
                <th class="py-2.5 px-2.5 text-center font-bold text-slate-500 dark:text-slate-400 w-28">{{ massColumnLabel }}</th>
                <th class="py-2.5 px-2.5 text-center font-bold text-slate-500 dark:text-slate-400 w-28">HS pha loãng F</th>
                <th class="py-2.5 px-2.5 text-center font-bold text-slate-500 dark:text-slate-400 w-24">Số lọ</th>
                <th class="py-2.5 px-2.5 text-center font-bold text-slate-500 dark:text-slate-400 w-32">Kết quả ({{ resultUnit }})</th>
                <th class="py-2.5 px-3 text-left font-bold text-slate-500 dark:text-slate-400 min-w-[150px]">Ghi chú</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              @for (row of chromatographyRows; track row.key; let idx = $index) {
                @let rowData = draft.resultData[row.key];
                @let activeComp = draft.page1Data['activeCompound'];
                @let assigned = row.type === 'QC' || isTargetAssigned(row.key, activeComp);
                <tr class="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors"
                    [class.opacity-60]="rowData['selected'] === false"
                    [ngClass]="row.type === 'QC'
                      ? 'bg-indigo-50/40 dark:bg-indigo-950/20 border-l-4 border-l-indigo-500'
                      : 'bg-white dark:bg-slate-900'">
                  <td class="py-2 px-2.5 font-mono text-slate-400 text-center font-bold">{{ idx + 1 }}</td>
                  <td class="py-2 px-3 font-bold text-slate-700 dark:text-slate-200 font-mono sticky left-0 bg-inherit z-10 border-r border-slate-100 dark:border-slate-800">
                    <div class="flex items-center gap-1.5">
                      <input type="checkbox"
                             [disabled]="isReadOnly"
                             [(ngModel)]="rowData['selected']"
                             (ngModelChange)="emitDataChanged()"
                             aria-label="Bao gồm dòng {{ row.label }}"
                             class="w-3.5 h-3.5 rounded text-indigo-600 border-slate-300 dark:border-slate-700 focus:ring-indigo-500" />
                      <span class="truncate">{{ row.label }}</span>
                    </div>
                  </td>
                  <td class="py-1 px-1.5">
                    <input type="text"
                           [readOnly]="isReadOnly || row.key === 'QC_FINAL'"
                           [(ngModel)]="rowData['khoiLuong']"
                           (ngModelChange)="emitDataChanged()"
                           (paste)="onTableCellPaste($event, idx, 0)"
                           (focus)="$any($event.target).select()"
                           class="w-full h-8 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-2 text-center font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition read-only:opacity-80" />
                  </td>
                  <td class="py-1 px-1.5">
                    <input type="text"
                           [readOnly]="isReadOnly || row.key === 'QC_FINAL'"
                           [(ngModel)]="rowData['heSoPhaLoang']"
                           (ngModelChange)="onDilutionChanged(row.key)"
                           (paste)="onTableCellPaste($event, idx, 1)"
                           (focus)="$any($event.target).select()"
                           class="w-full h-8 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-2 text-center font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition read-only:opacity-80" />
                  </td>
                  <td class="py-1 px-1.5">
                    <input type="text"
                           [readOnly]="isReadOnly || row.key === 'QC_FINAL'"
                           [(ngModel)]="rowData['loSo']"
                           (ngModelChange)="emitDataChanged()"
                           (paste)="onTableCellPaste($event, idx, 2)"
                           (focus)="$any($event.target).select()"
                           class="w-full h-8 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-2 text-center font-mono font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition read-only:opacity-80" />
                  </td>
                  <td class="py-1 px-1.5">
                    <input type="text"
                           [disabled]="!assigned"
                           [readOnly]="isReadOnly"
                           [(ngModel)]="rowData[activeComp]"
                           (ngModelChange)="onChromInput(row.key)"
                           (paste)="onTableCellPaste($event, idx, 3)"
                           (focus)="$any($event.target).select()"
                           placeholder="ND / Kết quả"
                           class="w-full h-8 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-2 text-center font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition disabled:bg-slate-100/60 dark:disabled:bg-slate-900/40 disabled:text-slate-400 disabled:cursor-not-allowed" />
                  </td>
                  <td class="py-1 px-1.5">
                    <input type="text"
                           [readOnly]="isReadOnly"
                           [(ngModel)]="rowData[activeComp + '_ghiChu']"
                           (ngModelChange)="emitDataChanged()"
                           (paste)="onTableCellPaste($event, idx, 4)"
                           (focus)="$any($event.target).select()"
                           placeholder="Ghi chú..."
                           class="w-full h-8 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-2 text-left text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition" />
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class SopFormDonWorkspaceComponent {
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  @Input() run: any = null;
  @Input() draft!: AnalysisResultDraft;
  @Input() chromatographyRows: ChromatographyRow[] = [];
  @Input() assignedCompounds: string[] = [];
  @Input() compoundDisplayNames: Record<string, string> = {};
  @Input() bulkCalibVialStart = 1;
  @Input() bulkCalibVialEnd = 5;
  @Input() bulkVialStart = 9;
  @Input() bulkVialEnd = 9;
  @Input() massColumnLabel = 'Khối lượng (g)';
  @Input() resultUnit = 'ng/g';
  @Input() isReadOnly = false;

  @Output() bulkCalibVialStartChange = new EventEmitter<number>();
  @Output() applyCalibVials = new EventEmitter<void>();
  @Output() calibPointsChanged = new EventEmitter<void>();
  @Output() bulkVialStartChange = new EventEmitter<number>();
  @Output() applyBulkVials = new EventEmitter<void>();
  @Output() activeCompoundChanged = new EventEmitter<void>();
  @Output() bulkFillNd = new EventEmitter<void>();
  @Output() finalToggled = new EventEmitter<void>();
  @Output() syncDilution = new EventEmitter<string>();
  @Output() chromResultChanged = new EventEmitter<string>();
  @Output() dataChanged = new EventEmitter<void>();

  mobileViewMode = signal<'table' | 'cards'>('table');
  pendingPastePlan = signal<PasteTransactionPlan | null>(null);
  undoStack = new PasteUndoStack();
  private mutationRevision = 0;

  isTargetAssigned(sampleCode: string, compound: string): boolean {
    if (!this.run || !compound) return true;
    const targetMap = this.run.sampleTargetMap ?? this.run.inputs?.sampleTargetMap;
    if (!targetMap) return true;
    return isCompoundAssigned(targetMap[sampleCode], compound);
  }

  emitDataChanged(): void {
    if (this.isReadOnly) return;
    this.mutationRevision++;
    this.dataChanged.emit();
  }

  onFinalCheckboxToggled(): void {
    if (this.isReadOnly) return;
    this.mutationRevision++;
    this.finalToggled.emit();
  }

  onCalibPointsUpdated(): void {
    if (this.isReadOnly) return;
    this.mutationRevision++;
    this.calibPointsChanged.emit();
  }

  onDilutionChanged(rowKey: string): void {
    if (this.isReadOnly) return;
    this.mutationRevision++;
    this.syncDilution.emit(rowKey);
  }

  onChromInput(rowKey: string): void {
    if (this.isReadOnly) return;
    this.mutationRevision++;
    this.chromResultChanged.emit(rowKey);
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

  async openClipboardPrompt(): Promise<void> {
    if (this.isReadOnly) return;
    try {
      const text = await navigator.clipboard?.readText?.();
      if (!text) {
        this.toast.show('Clipboard trống. Hãy sao chép vùng dữ liệu từ Excel trước.', 'warning');
        return;
      }
      this.planPasteFromRawText(text, 0, 3);
    } catch {
      this.toast.show('Trình duyệt chặn đọc clipboard trực tiếp. Hãy nhấp vào ô cần dán và nhấn Ctrl+V.', 'info');
    }
  }

  onTableCellPaste(event: ClipboardEvent, rowIdx: number, colIdx: number): void {
    if (this.isReadOnly) {
      event.preventDefault();
      return;
    }
    const text = event.clipboardData?.getData('text/plain') || '';
    const matrix = parseSpreadsheetPasteText(text);
    if (matrix.length <= 1 && (matrix[0]?.length || 0) <= 1) return;
    event.preventDefault();
    this.planPasteFromRawText(text, rowIdx, colIdx);
  }

  private planPasteFromRawText(text: string, startRowIdx: number, startColIdx: number): void {
    const matrix = parseSpreadsheetPasteText(text);
    const activeComp = this.draft?.page1Data?.['activeCompound'] || '';
    const cols = [
      { colKey: 'khoiLuong', colLabel: this.massColumnLabel },
      { colKey: 'heSoPhaLoang', colLabel: 'HS pha loãng F' },
      { colKey: 'loSo', colLabel: 'Số lọ' },
      { colKey: activeComp, colLabel: `Kết quả (${this.resultUnit})` },
      { colKey: `${activeComp}_ghiChu`, colLabel: 'Ghi chú' },
    ];

    const grid = {
      rows: this.chromatographyRows.map(r => ({ rowKey: r.key, rowLabel: r.label })),
      columns: cols,
      startRowIndex: startRowIdx,
      startColIndex: startColIdx,
      minNumericValue: 0,
      allowTextNotesForCol: (colKey: string) => colKey === 'loSo' || colKey.endsWith('_ghiChu'),
      getCellSpec: (rowKey: string, colKey: string) => {
        const isQcFinalLocked = rowKey === 'QC_FINAL' && (colKey === 'khoiLuong' || colKey === 'heSoPhaLoang' || colKey === 'loSo');
        const isRegular = !rowKey.startsWith('QC_');
        const assigned = colKey === activeComp && isRegular ? this.isTargetAssigned(rowKey, activeComp) : true;
        return {
          rowKey,
          rowLabel: rowKey,
          colKey,
          colLabel: cols.find(c => c.colKey === colKey)?.colLabel || colKey,
          editable: !this.isReadOnly && !isQcFinalLocked,
          assigned,
        };
      },
      readCell: (rowKey: string, colKey: string) => ({
        value: String(this.draft?.resultData?.[rowKey]?.[colKey] ?? ''),
      }),
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
    const activeComp = this.draft?.page1Data?.['activeCompound'] || '';
    const touchedChromRows = new Set<string>();

    const res = applyPasteTransaction(
      plan,
      this.getWriteGuardContext(),
      this.mutationRevision,
      (rowKey, colKey, value) => {
        if (!this.draft.resultData[rowKey]) this.draft.resultData[rowKey] = {};
        this.draft.resultData[rowKey][colKey] = value;
        if (colKey === 'heSoPhaLoang') {
          this.draft.resultData[rowKey]['hSoPhaLoang'] = value;
        }
        if (colKey === activeComp) {
          touchedChromRows.add(rowKey);
        }
      },
      `Dán ${plan.diffs.length} ô bảng sắc ký`
    );

    if (!res.applied || !res.transaction) {
      this.toast.show(res.reason || 'Không thể dán dữ liệu.', 'error');
      return;
    }

    this.mutationRevision = res.nextRevision;
    this.undoStack.push(res.transaction);
    if (touchedChromRows.size > 0) {
      const firstRow = Array.from(touchedChromRows)[0];
      this.chromResultChanged.emit(firstRow);
    } else {
      this.dataChanged.emit();
    }
    this.toast.show(`Đã dán ${res.appliedCount} ô dữ liệu thành công.`, 'success');
  }

  undoLastPaste(): void {
    if (this.isReadOnly) return;
    const activeComp = this.draft?.page1Data?.['activeCompound'] || '';
    let firstTouchedRow: string | null = null;

    const res = this.undoStack.undoLast(
      this.getWriteGuardContext(),
      this.mutationRevision,
      (rowKey, colKey) => ({
        value: String(this.draft?.resultData?.[rowKey]?.[colKey] ?? ''),
      }),
      (rowKey, colKey, value) => {
        if (!this.draft.resultData[rowKey]) this.draft.resultData[rowKey] = {};
        this.draft.resultData[rowKey][colKey] = value;
        if (colKey === 'heSoPhaLoang') {
          this.draft.resultData[rowKey]['hSoPhaLoang'] = value;
        }
        if (colKey === activeComp && !firstTouchedRow) {
          firstTouchedRow = rowKey;
        }
      }
    );

    if (!res.undone) {
      this.toast.show(res.reason || 'Không thể hoàn tác.', 'warning');
      return;
    }

    this.mutationRevision = res.nextRevision;
    if (firstTouchedRow) {
      this.chromResultChanged.emit(firstTouchedRow);
    } else {
      this.dataChanged.emit();
    }
    this.toast.show(`Đã hoàn tác ${res.restoredCount} giá trị vừa dán.`, 'success');
  }
}
