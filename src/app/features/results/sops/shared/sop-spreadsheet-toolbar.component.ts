import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasteTransactionPlan } from './sop-paste-undo';

@Component({
  selector: 'app-sop-spreadsheet-toolbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2 min-w-0">
          <i class="fa-solid fa-table text-sm text-indigo-600 dark:text-indigo-400 shrink-0" aria-hidden="true"></i>
          <h4 class="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider m-0 truncate">{{ title }}</h4>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <ng-content select="[toolbar-extra]"></ng-content>

          @if (showMobileCardToggle) {
            <div class="inline-flex md:hidden items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200/80 dark:border-slate-700">
              <button type="button"
                      (click)="mobileViewModeChange.emit('cards')"
                      [class]="mobileViewMode === 'cards'
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-300 shadow-xs font-bold'
                        : 'text-slate-500 dark:text-slate-400 font-semibold'"
                      class="h-9 md:h-8 px-3 md:px-2.5 rounded-lg text-xs md:text-[11px] transition inline-flex items-center gap-1">
                <i class="fa-solid fa-id-card text-[10px]" aria-hidden="true"></i>
                <span>Theo mẫu</span>
              </button>
              <button type="button"
                      (click)="mobileViewModeChange.emit('table')"
                      [class]="mobileViewMode === 'table'
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-300 shadow-xs font-bold'
                        : 'text-slate-500 dark:text-slate-400 font-semibold'"
                      class="h-9 md:h-8 px-3 md:px-2.5 rounded-lg text-xs md:text-[11px] transition inline-flex items-center gap-1">
                <i class="fa-solid fa-table-cells text-[10px]" aria-hidden="true"></i>
                <span>Bảng</span>
              </button>
            </div>
          }

          @if (!isReadOnly && showPasteButton) {
            <button type="button"
                    (click)="pasteRequested.emit()"
                    title="Dán vùng dữ liệu nhiều ô từ Excel (Ctrl+V vào ô đang chọn hoặc nhấn nút này)"
                    class="inline-flex min-h-[40px] sm:min-h-0 sm:h-8 items-center gap-1.5 rounded-xl border border-indigo-200/80 dark:border-indigo-900/40 bg-indigo-50/70 dark:bg-indigo-950/30 px-3 sm:px-2.5 text-xs sm:text-[11px] font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition active:scale-95">
              <i class="fa-solid fa-paste text-[10px]" aria-hidden="true"></i>
              <span>Dán Excel</span>
            </button>
          }

          @if (!isReadOnly && canUndo) {
            <button type="button"
                    (click)="undoRequested.emit()"
                    [attr.aria-label]="'Hoàn tác: ' + (undoSummary || 'thao tác dán gần nhất')"
                    [title]="'Hoàn tác: ' + (undoSummary || 'thao tác dán gần nhất')"
                    class="inline-flex min-h-[40px] sm:min-h-0 sm:h-8 items-center gap-1.5 rounded-xl border border-amber-200/80 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/30 px-3 sm:px-2.5 text-xs sm:text-[11px] font-bold text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition active:scale-95">
              <i class="fa-solid fa-rotate-left text-[10px]" aria-hidden="true"></i>
              <span>Hoàn tác</span>
            </button>
          }

          @if (!isReadOnly && showFillNd) {
            <button type="button"
                    (click)="fillNdRequested.emit()"
                    title="Đặt toàn bộ các ô trống chưa điền là ND"
                    class="inline-flex min-h-[40px] sm:min-h-0 sm:h-8 items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 sm:px-2.5 text-xs sm:text-[11px] font-bold text-slate-700 dark:text-slate-200 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 dark:hover:bg-amber-950/30 transition active:scale-95">
              <i class="fa-solid fa-pen-clip text-[10px] text-amber-500" aria-hidden="true"></i>
              <span>Điền ND</span>
            </button>
          }

          @if (!isReadOnly && showClearAll) {
            <button type="button"
                    (click)="clearAllRequested.emit()"
                    title="Xóa dữ liệu đã nhập trên bảng"
                    class="inline-flex min-h-[40px] sm:min-h-0 sm:h-8 items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 sm:px-2.5 text-xs sm:text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 hover:border-rose-200 dark:hover:bg-rose-950/30 transition active:scale-95">
              <i class="fa-solid fa-eraser text-[10px]" aria-hidden="true"></i>
              <span>Xóa bảng</span>
            </button>
          }
        </div>
      </div>

      @if (!isReadOnly && showPasteButton) {
        <div class="hidden md:flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
          <i class="fa-regular fa-lightbulb text-indigo-500 text-[11px]" aria-hidden="true"></i>
          <span>Mẹo: Chọn một ô kết quả rồi nhấn <kbd class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">Ctrl+V</kbd> để dán nhiều dòng/cột từ Excel (ô chưa chỉ định tự bỏ qua).</span>
        </div>
      }

      @if (pendingPlan) {
        <div class="rounded-2xl border border-amber-300/80 dark:border-amber-800 bg-amber-50/80 dark:bg-amber-950/30 p-3.5 text-xs space-y-2">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span class="font-bold text-amber-800 dark:text-amber-300">
              Xem trước dán {{ pendingPlan.diffs.length }} giá trị
              @if (pendingPlan.overwriteCount > 0) { (ghi đè {{ pendingPlan.overwriteCount }} ô đã có dữ liệu) }
            </span>
            <div class="flex items-center gap-2">
              <button type="button"
                      (click)="cancelPaste.emit()"
                      class="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1 font-bold text-slate-600 dark:text-slate-300">
                Hủy
              </button>
              <button type="button"
                      [disabled]="pendingPlan.diffs.length === 0 || pendingPlan.invalidCells.length > 0"
                      (click)="confirmPaste.emit()"
                      class="rounded-lg bg-indigo-600 hover:bg-indigo-700 px-3 py-1 font-bold text-white disabled:opacity-50">
                Áp dụng ({{ pendingPlan.diffs.length }})
              </button>
            </div>
          </div>
          @if (pendingPlan.invalidCells.length > 0) {
            <div class="text-rose-700 dark:text-rose-300 font-semibold">
              Có {{ pendingPlan.invalidCells.length }} ô không hợp lệ ({{ pendingPlan.invalidCells[0].rowLabel }} · {{ pendingPlan.invalidCells[0].colLabel }}: "{{ pendingPlan.invalidCells[0].rawValue }}").
            </div>
          }
          @if (pendingPlan.skippedUnassigned.length > 0) {
            <div class="text-amber-700 dark:text-amber-400">
              Đã bỏ qua {{ pendingPlan.skippedUnassigned.length }} ô chưa chỉ định hoặc đang khóa.
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class SopSpreadsheetToolbarComponent {
  @Input() title = 'Bảng Thông Số & Kết Quả';
  @Input() isReadOnly = false;
  @Input() canUndo = false;
  @Input() undoSummary = '';
  @Input() pendingPlan: PasteTransactionPlan | null = null;
  @Input() showMobileCardToggle = false;
  @Input() mobileViewMode: 'table' | 'cards' = 'table';
  @Input() showClearAll = false;
  @Input() showFillNd = true;
  @Input() showPasteButton = true;

  @Output() pasteRequested = new EventEmitter<void>();
  @Output() undoRequested = new EventEmitter<void>();
  @Output() fillNdRequested = new EventEmitter<void>();
  @Output() clearAllRequested = new EventEmitter<void>();
  @Output() mobileViewModeChange = new EventEmitter<'table' | 'cards'>();
  @Output() confirmPaste = new EventEmitter<void>();
  @Output() cancelPaste = new EventEmitter<void>();
}
