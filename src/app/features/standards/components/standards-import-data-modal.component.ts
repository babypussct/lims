import {
  Component,
  input,
  output,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportPreviewItem } from '../../../core/models/standard.model';
import { AppModalShellComponent } from '../../../shared/components/ui/modal-shell/modal-shell.component';

@Component({
  selector: 'app-standards-import-data-modal',
  standalone: true,
  imports: [CommonModule, AppModalShellComponent],
  template: `
    @if (data().length > 0) {
      <app-modal-shell
        title="Xác nhận import chuẩn"
        description="Kiểm tra khóa nhận diện, số lượng, đơn vị, ngày và các thay đổi metadata trước khi commit."
        size="2xl"
        [closeOnBackdrop]="false"
        [closeDisabled]="isImporting() || isParsing()"
        (closed)="onCancel()"
      >

          <div modalBody class="-mx-6 -my-5 flex-1 overflow-auto custom-scrollbar p-3 sm:p-6">
            <section class="grid grid-cols-1 lg:grid-cols-[minmax(220px,320px)_1fr] gap-3 mb-4">
              <label class="text-xs font-bold text-slate-600 dark:text-slate-300">
                Worksheet
                <select
                  aria-label="Chọn worksheet để import"
                  [value]="selectedSheet()"
                  [disabled]="isParsing() || isImporting() || sheetNames().length <= 1"
                  (change)="onSheetChange($event)"
                  class="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm">
                  @for (sheet of sheetNames(); track sheet) {
                    <option [value]="sheet">{{sheet}}</option>
                  }
                </select>
              </label>

              <div class="flex flex-wrap content-end gap-2 text-xs font-bold">
                <span class="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">Tổng: {{data().length}}</span>
                <span class="px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">Hợp lệ: {{validCount()}}</span>
                <span class="px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">Cập nhật: {{updateCount()}}</span>
                <span class="px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">Khôi phục: {{restoreCount()}}</span>
                @if (warningCount() > 0) {
                  <span class="px-3 py-1.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">Cảnh báo: {{warningCount()}}</span>
                }
                @if (invalidCount() > 0) {
                  <span class="px-3 py-1.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">Lỗi: {{invalidCount()}}</span>
                }
              </div>
            </section>

            @if (blockingCount() > 0) {
              <div role="alert" class="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl p-3 flex gap-3 text-sm text-red-800 dark:text-red-300">
                <i class="fa-solid fa-circle-xmark mt-0.5"></i>
                <div><strong>Đang bị chặn:</strong> Có {{blockingCount()}} dòng xung đột. Nút Import chỉ được mở sau khi sửa dữ liệu nguồn hoặc xử lý bản ghi trùng/đang mượn.</div>
              </div>
            } @else if (skippableInvalidCount() > 0) {
              <div class="mb-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl p-3 text-sm text-amber-800 dark:text-amber-300">
                <label class="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    [checked]="acknowledgeSkippedRows()"
                    (change)="acknowledgeSkippedRows.set($any($event.target).checked)"
                    class="mt-1">
                  <span>Tôi đã xem lỗi và đồng ý bỏ qua <strong>{{skippableInvalidCount()}}</strong> dòng không hợp lệ. Các dòng này sẽ không được ghi.</span>
                </label>
              </div>
            }

            <div class="flex flex-wrap justify-between items-center gap-2 mb-2">
              <p class="text-xs text-slate-500">
                Hiển thị {{visibleRows().length}}/{{data().length}} dòng. Dữ liệu cập nhật không ghi đè trường trống và không thay đổi tồn kho/workflow.
              </p>
              @if (invalidCount() > 0) {
                <button type="button" (click)="downloadErrors()" class="text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 rounded-lg">
                  <i class="fa-solid fa-download mr-1"></i> Tải CSV lỗi
                </button>
              }
            </div>

            <div class="overflow-auto border border-slate-200 dark:border-slate-700 rounded-xl">
              <table class="w-full min-w-[1450px] text-xs text-left border-collapse">
                <thead class="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase sticky top-0 z-10">
                  <tr>
                    <th class="p-2 border-b border-slate-200 dark:border-slate-700 w-14">Dòng</th>
                    <th class="p-2 border-b border-slate-200 dark:border-slate-700 min-w-64">Tên / Số nhận diện</th>
                    <th class="p-2 border-b border-slate-200 dark:border-slate-700 min-w-44">Lô / Mã sản phẩm</th>
                    <th class="p-2 border-b border-slate-200 dark:border-slate-700 min-w-40">Số lượng</th>
                    <th class="p-2 border-b border-slate-200 dark:border-slate-700 min-w-44">Ngày</th>
                    <th class="p-2 border-b border-slate-200 dark:border-slate-700 min-w-56">Hãng / CAS / Vị trí</th>
                    <th class="p-2 border-b border-slate-200 dark:border-slate-700 min-w-64">Thay đổi & cảnh báo</th>
                    <th class="p-2 border-b border-slate-200 dark:border-slate-700 min-w-52">Trạng thái</th>
                  </tr>
                </thead>
                <tbody class="text-slate-700 dark:text-slate-300">
                  @for (item of visibleRows(); track item.rowNumber || $index) {
                    <tr [ngClass]="{'bg-red-50 dark:bg-red-900/10': !item.isValid}" class="align-top hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td class="p-2 border-b border-slate-100 dark:border-slate-800 font-mono">{{item.rowNumber || $index + 2}}</td>
                      <td class="p-2 border-b border-slate-100 dark:border-slate-800">
                        <div class="font-bold break-words">{{item.parsed.name || '—'}}</div>
                        <div class="font-mono text-slate-500 mt-1">{{item.parsed.internal_id || 'Chưa có số nhận diện'}}</div>
                      </td>
                      <td class="p-2 border-b border-slate-100 dark:border-slate-800">
                        <div class="font-mono">{{item.parsed.lot_number || '—'}}</div>
                        <div class="font-mono text-indigo-600 dark:text-indigo-400 mt-1">{{item.parsed.product_code || '—'}}</div>
                      </td>
                      <td class="p-2 border-b border-slate-100 dark:border-slate-800 font-mono">
                        <div>Ban đầu: <strong>{{item.parsed.initial_amount}} {{item.parsed.unit}}</strong></div>
                        <div>Còn lại: <strong>{{item.parsed.current_amount}} {{item.parsed.unit}}</strong></div>
                        <div class="text-slate-500 mt-1">Nhật ký: {{item.logs.length}}</div>
                      </td>
                      <td class="p-2 border-b border-slate-100 dark:border-slate-800 font-mono">
                        <div>Nhận: {{item.parsed.received_date ? (item.parsed.received_date | date:'dd/MM/yyyy') : '—'}}</div>
                        <div>HSD: {{item.parsed.expiry_date ? (item.parsed.expiry_date | date:'dd/MM/yyyy') : '—'}}</div>
                        <div class="text-slate-400 mt-1">Gốc: {{item.raw['Ngày nhận (Gốc)'] || '—'}}</div>
                      </td>
                      <td class="p-2 border-b border-slate-100 dark:border-slate-800">
                        <div>{{item.parsed.manufacturer || '—'}}</div>
                        <div class="font-mono mt-1">{{item.parsed.cas_number || '—'}}</div>
                        <div class="text-slate-500 mt-1">{{item.parsed.location || '—'}} · {{item.parsed.storage_condition || '—'}}</div>
                      </td>
                      <td class="p-2 border-b border-slate-100 dark:border-slate-800">
                        @if ((item.changes?.length || 0) > 0) {
                          @for (change of (item.changes || []).slice(0, 3); track change.field) {
                            <div class="mb-1"><strong>{{change.label}}:</strong> {{displayValue(change.before)}} → {{displayValue(change.after)}}</div>
                          }
                          @if ((item.changes?.length || 0) > 3) {
                            <div class="text-blue-600">+{{(item.changes || []).length - 3}} thay đổi khác</div>
                          }
                        } @else {
                          <div class="text-slate-400">Không đổi metadata</div>
                        }
                        @for (warning of item.warnings || []; track warning) {
                          <div class="text-amber-700 dark:text-amber-400 mt-1"><i class="fa-solid fa-triangle-exclamation mr-1"></i>{{warning}}</div>
                        }
                      </td>
                      <td class="p-2 border-b border-slate-100 dark:border-slate-800">
                        @if (item.mode === 'CONFLICT') {
                          <span class="font-bold text-red-600">Xung đột — bị chặn</span>
                        } @else if (!item.isValid) {
                          <span class="font-bold text-red-600">{{item.errorMessage || 'Dữ liệu không hợp lệ'}}</span>
                        } @else if (item.mode === 'RESTORE') {
                          <span class="font-bold text-amber-600">Khôi phục chuẩn đã ẩn</span>
                        } @else if (item.mode === 'UPDATE_SAFE') {
                          <span class="font-bold text-blue-600 dark:text-blue-400">Cập nhật metadata an toàn</span>
                        } @else {
                          <span class="font-bold text-emerald-600 dark:text-emerald-400">Tạo mới</span>
                        }
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            @if (data().length > rowLimit()) {
              <div class="text-center mt-3">
                <button type="button" (click)="rowLimit.set(data().length)" class="text-xs font-bold text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                  Hiển thị toàn bộ {{data().length}} dòng
                </button>
              </div>
            }
          </div>

          <div modalFooter class="flex w-full flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <button type="button" (click)="onCancel()" [disabled]="isImporting() || isParsing()" class="px-5 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-bold text-sm transition disabled:opacity-50">Hủy bỏ</button>
            <button
              type="button"
              (click)="onConfirm()"
              [disabled]="!canConfirm()"
              class="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              @if (isParsing()) {
                <i class="fa-solid fa-spinner fa-spin"></i> Đang đọc sheet...
              } @else if (isImporting()) {
                <i class="fa-solid fa-spinner fa-spin"></i> Đang commit...
              } @else {
                <i class="fa-solid fa-check"></i> Xác nhận import {{validCount()}} dòng
              }
            </button>
          </div>
      </app-modal-shell>
    }
  `
})
export class StandardsImportDataModalComponent {
  data = input<ImportPreviewItem[]>([]);
  isImporting = input(false);
  isParsing = input(false);
  sheetNames = input<string[]>([]);
  selectedSheet = input('');
  cancel = output<void>();
  confirm = output<void>();
  sheetChange = output<string>();

  acknowledgeSkippedRows = signal(false);
  rowLimit = signal(50);

  validCount() {
    return this.data().filter(item => item.isValid && item.mode !== 'CONFLICT').length;
  }

  invalidCount() {
    return this.data().length - this.validCount();
  }

  blockingCount() {
    return this.data().filter(item => item.mode === 'CONFLICT').length;
  }

  skippableInvalidCount() {
    return this.data().filter(item => !item.isValid && item.mode !== 'CONFLICT').length;
  }

  updateCount() {
    return this.data().filter(item => item.isValid && item.mode === 'UPDATE_SAFE').length;
  }

  restoreCount() {
    return this.data().filter(item => item.isValid && item.mode === 'RESTORE').length;
  }

  warningCount() {
    return this.data().reduce((count, item) => count + (item.warnings?.length || 0), 0);
  }

  visibleRows() {
    return [...this.data()]
      .sort((a, b) => {
        const priority = (item: ImportPreviewItem) => item.mode === 'CONFLICT' ? 0 : (!item.isValid ? 1 : 2);
        return priority(a) - priority(b) || (a.rowNumber || 0) - (b.rowNumber || 0);
      })
      .slice(0, this.rowLimit());
  }

  canConfirm() {
    return !this.isImporting() &&
      !this.isParsing() &&
      this.validCount() > 0 &&
      this.blockingCount() === 0 &&
      (this.skippableInvalidCount() === 0 || this.acknowledgeSkippedRows());
  }

  onSheetChange(event: Event) {
    this.acknowledgeSkippedRows.set(false);
    this.rowLimit.set(50);
    this.sheetChange.emit((event.target as HTMLSelectElement).value);
  }

  onCancel() {
    if (!this.isImporting() && !this.isParsing()) this.cancel.emit();
  }

  onConfirm() {
    if (this.canConfirm()) this.confirm.emit();
  }

  displayValue(value: unknown) {
    const text = String(value ?? '').trim();
    return text || '—';
  }

  downloadErrors() {
    const rows = this.data()
      .filter(item => !item.isValid || item.mode === 'CONFLICT')
      .map(item => [
        item.sourceSheet || this.selectedSheet(),
        item.rowNumber || '',
        item.parsed.name || '',
        item.parsed.internal_id || '',
        item.parsed.lot_number || '',
        item.errorMessage || 'Xung đột'
      ]);
    const escape = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const csv = [
      ['Sheet', 'Dòng', 'Tên chuẩn', 'Số nhận diện', 'Số lô', 'Lỗi'],
      ...rows
    ].map(row => row.map(escape).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `standard-import-errors-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

}
