import { Component, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalysisResultDraft } from '../../core/models/analysis-result.model';

@Component({
  selector: 'app-result-entry-type2',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      
      <!-- 1. Metadata Form & Checkboxes -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 space-y-4">
        <h4 class="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 pb-2">
          <i class="fa-solid fa-file-invoice mr-2 text-indigo-500"></i> Thông tin chung & Đánh giá
        </h4>

        <!-- Signature Dates -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase">Ngày ký Người phân tích</label>
            <input type="date" 
                   [(ngModel)]="draft.page1Data['ngayNguoiPhanTich']" 
                   (ngModelChange)="onDataChanged()"
                   class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition outline-none">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase">Ngày ký Người thẩm tra</label>
            <input type="date" 
                   [(ngModel)]="draft.page1Data['ngayNguoiThamTra']" 
                   (ngModelChange)="onDataChanged()"
                   class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition outline-none">
          </div>
        </div>

        <!-- Checkbox grid (Dynamic from SOP metadata configuration) -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          @for (checkbox of checkboxList; track checkbox.key) {
            <label class="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 border border-slate-100 dark:border-slate-700/30 cursor-pointer select-none transition">
              <input type="checkbox" 
                     [(ngModel)]="draft.page1Data[checkbox.key]" 
                     (ngModelChange)="onCheckboxChange(checkbox.key)"
                     class="mt-1 w-4 h-4 rounded text-fuchsia-600 border-slate-300 focus:ring-fuchsia-500 focus:ring-2 dark:bg-slate-900 dark:border-slate-700">
              <div>
                <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-tight block">{{ checkbox.label }}</span>
              </div>
            </label>
          }
        </div>
      </div>

      <!-- 1.5. Section 6 Đường chuẩn (Calibration Curve) - Chỉ dành cho Trifluralin -->
      @if (isTrifluralin) {
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 space-y-4 animate-fade-in">
          <h4 class="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 pb-2">
            <i class="fa-solid fa-chart-line mr-2 text-fuchsia-500"></i> Section 6. Khai báo Đường chuẩn & QC
          </h4>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <!-- Left Side: QC configuration & R^2 -->
            <div class="lg:col-span-4 space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase">Tên mẫu Trắng (Blank)</label>
                <input type="text" 
                       [(ngModel)]="draft.page1Data['blankName']" 
                       (ngModelChange)="onDataChanged()"
                       placeholder="Blank..."
                       class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition outline-none">
              </div>
              
              <div>
                <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase">Tên mẫu Thêm chuẩn (Spike)</label>
                <input type="text" 
                       [(ngModel)]="draft.page1Data['spikeName']" 
                       (ngModelChange)="onDataChanged()"
                       placeholder="Spike..."
                       class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition outline-none">
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase">Hệ số xác định R²</label>
                <input type="text" 
                       [(ngModel)]="draft.page1Data['r2']" 
                       (ngModelChange)="onDataChanged()"
                       placeholder="Ví dụ: 0.9992..."
                       class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition outline-none">
              </div>
            </div>

            <!-- Right Side: 7 Calibration Points Grid -->
            <div class="lg:col-span-8">
              <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase">7 Điểm Đường chuẩn (Calibration Curve Points)</label>
              <div class="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900/50">
                <table class="w-full text-xs text-left border-collapse">
                  <thead class="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th class="py-2.5 px-3 font-bold text-slate-500 dark:text-slate-400 text-center w-20">STT</th>
                      <th class="py-2.5 px-3 font-bold text-slate-500 dark:text-slate-400">Số Lọ (Vial)</th>
                      <th class="py-2.5 px-3 font-bold text-slate-500 dark:text-slate-400">Hàm lượng (µg/L hoặc µg/kg)</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-200 dark:divide-slate-700/50 bg-white dark:bg-slate-800">
                    @for (pt of draft.page1Data['calibPoints']; track $index) {
                      <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-750/30 transition">
                        <td class="py-2 px-3 font-bold text-slate-400 dark:text-slate-500 text-center bg-slate-50/50 dark:bg-slate-900/10">Điểm {{ $index + 1 }}</td>
                        <td class="py-1 px-2">
                          <input type="text" 
                                 [(ngModel)]="pt['loSo']" 
                                 (ngModelChange)="onDataChanged()"
                                 placeholder="Lọ..."
                                 class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-800 dark:text-slate-200 font-semibold focus:ring-1 focus:ring-fuchsia-500 outline-none text-center">
                        </td>
                        <td class="py-1.5 px-2">
                          <input type="text" 
                                 [(ngModel)]="pt['hamLuong']" 
                                 (ngModelChange)="onDataChanged()"
                                 placeholder="Nồng độ..."
                                 class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-800 dark:text-slate-200 font-semibold focus:ring-1 focus:ring-fuchsia-500 outline-none text-center">
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- 2. Grid Sample Spreadsheet & Bulk Actions -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-3">
          <h4 class="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <i class="fa-solid fa-table-cells mr-1 text-fuchsia-500"></i> Lưới nhập kết quả (Grid Spreadsheet)
          </h4>

          <!-- Premium Bulk Actions Panel -->
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mr-1">Thao tác nhanh:</span>
            
            <button (click)="bulkFillND()" 
                    class="px-3 py-1.5 bg-slate-100 dark:bg-slate-900 hover:bg-amber-50 dark:hover:bg-amber-950/20 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 border border-slate-200 dark:border-slate-700 hover:border-amber-200 dark:hover:border-amber-900/30 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                    title="Đặt toàn bộ các ô kết quả chưa điền là ND">
              <i class="fa-solid fa-pen-clip"></i>
              <span>Điền ND ô trống</span>
            </button>

            <button (click)="bulkClearAll()" 
                    class="px-3 py-1.5 bg-slate-100 dark:bg-slate-900 hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 border border-slate-200 dark:border-slate-700 hover:border-red-200 dark:hover:border-red-900/30 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                    title="Xóa toàn bộ các ô kết quả của bảng">
              <i class="fa-solid fa-trash-can"></i>
              <span>Xóa hết bảng</span>
            </button>

            @if (isTrifluralin) {
              <!-- Quick Vial Input (Lọ số nhanh) -->
              <div class="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs">
                <span class="font-bold text-slate-500 dark:text-slate-400">Lọ số:</span>
                <input type="number" 
                       [(ngModel)]="bulkVialStart" 
                       (ngModelChange)="onBulkVialStartChange()"
                       placeholder="Bắt đầu" 
                       class="w-14 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-center text-slate-800 dark:text-slate-200 font-bold focus:ring-1 focus:ring-fuchsia-500 outline-none">
                <span class="text-slate-400">-</span>
                <input type="number" 
                       [(ngModel)]="bulkVialEnd" 
                       placeholder="Kết thúc" 
                       class="w-14 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-center text-slate-800 dark:text-slate-200 font-bold focus:ring-1 focus:ring-fuchsia-500 outline-none">
                <button (click)="applyBulkVials()" 
                        class="px-2.5 py-1 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded font-bold transition flex items-center gap-1">
                  <i class="fa-solid fa-check"></i>
                  <span>Áp dụng</span>
                </button>
              </div>
            }
          </div>
        </div>

        <!-- Prefix Tabs Filter (Trifluralin Only) -->
        @if (isTrifluralin && detectedPrefixes().length > 0) {
          <div class="flex flex-wrap items-center gap-1.5 border-b border-slate-100 dark:border-slate-700 pb-2">
            <span class="text-xs font-bold text-slate-400 dark:text-slate-500 mr-2">Nhóm tiền tố:</span>
            <button (click)="onPrefixFilterChanged('ALL')"
                    [class]="selectedPrefixFilter() === 'ALL' ? 'px-3 py-1.5 text-xs font-bold bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950/40 dark:text-fuchsia-400 rounded-lg transition' : 'px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition'">
              Tất cả mẫu
            </button>
            @for (prefix of detectedPrefixes(); track prefix) {
              <button (click)="onPrefixFilterChanged(prefix)"
                      [class]="selectedPrefixFilter() === prefix ? 'px-3 py-1.5 text-xs font-bold bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950/40 dark:text-fuchsia-400 rounded-lg transition' : 'px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition'">
                {{ prefix === '' ? 'Không tiền tố' : 'Tiền tố ' + prefix }}
              </button>
            }
          </div>
        }

        <!-- Spreadsheet Table Grid -->
        <div class="overflow-x-auto custom-scrollbar border border-slate-200 dark:border-slate-700 rounded-xl">
          <table class="w-full text-sm border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                <!-- Select Checkbox Header (Trifluralin Only) -->
                @if (isTrifluralin) {
                  <th class="py-3 px-3 text-center w-12">
                    <input type="checkbox"
                           [checked]="isAllSelected()"
                           (change)="toggleSelectAll($event)"
                           class="w-4 h-4 rounded text-fuchsia-600 border-slate-300 focus:ring-fuchsia-500">
                  </th>
                }
                
                <th class="py-3 px-4 text-left font-bold text-slate-500 dark:text-slate-400 text-xs w-24">Lọ số</th>
                <th class="py-3 px-4 text-left font-bold text-slate-500 dark:text-slate-400 text-xs min-w-[120px]">Mẫu thử</th>
                
                <!-- Dynamic active columns -->
                @for (col of activeColumns; track col) {
                  <th class="py-3 px-4 text-left font-bold text-slate-500 dark:text-slate-400 text-xs min-w-[110px] uppercase">
                    {{ formatColumnName(col) }} (µg/kg)
                  </th>
                }
                
                <th class="py-3 px-4 text-left font-bold text-slate-500 dark:text-slate-400 text-xs min-w-[150px]">Ghi chú</th>
                <th class="py-3 px-4 text-center font-bold text-slate-500 dark:text-slate-400 text-xs w-28">Hàng</th>
              </tr>
            </thead>
            
            <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50">
              @if (isTrifluralin) {
                @for (row of getDisplayRowsForPrefix(selectedPrefixFilter()); track row.key; let rowIdx = $index) {
                  @if (row.type === 'QC_BLANK') {
                    <tr class="bg-indigo-50/20 dark:bg-indigo-950/10 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                      <td class="py-2.5 px-3 text-center">
                        <input type="checkbox" checked disabled class="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500">
                      </td>
                      <td class="py-1 px-2 w-24">
                        <input type="text"
                               [(ngModel)]="draft.resultData['QC_BLANK']['loSo']"
                               (ngModelChange)="onDataChanged()"
                               class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-1 focus:ring-fuchsia-500 outline-none text-center">
                      </td>
                      <td class="py-2.5 px-4 font-mono font-bold text-xs text-slate-500 dark:text-slate-400">
                        {{ draft.page1Data['blankName'] || 'Blank' }}
                      </td>
                      <td class="py-1 px-2">
                        <input type="text"
                               [(ngModel)]="draft.resultData['QC_BLANK']['kqTrifluralin']"
                               (ngModelChange)="onCellChanged('QC_BLANK')"
                               [id]="'cell-' + rowIdx + '-kqTrifluralin'"
                               (keydown)="handleGridNavigation($event, rowIdx, 'kqTrifluralin', 1)"
                               placeholder="..."
                               class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-semibold focus:ring-1 focus:ring-fuchsia-500 outline-none text-center">
                      </td>
                      <td class="py-1 px-2">
                        <input type="text"
                               [(ngModel)]="draft.resultData['QC_BLANK']['ghiChu']"
                               (ngModelChange)="onDataChanged()"
                               placeholder="Ghi chú..."
                               class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-fuchsia-500 outline-none">
                      </td>
                      <td class="py-1 px-4 text-center">
                        <span class="text-[10px] font-extrabold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">QC BLANK</span>
                      </td>
                    </tr>
                  } @else if (row.type === 'QC_SPIKE') {
                    <tr class="bg-indigo-50/20 dark:bg-indigo-950/10 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                      <td class="py-2.5 px-3 text-center">
                        <input type="checkbox" checked disabled class="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500">
                      </td>
                      <td class="py-1 px-2 w-24">
                        <input type="text"
                               [(ngModel)]="draft.resultData['QC_SPIKE']['loSo']"
                               (ngModelChange)="onDataChanged()"
                               class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-1 focus:ring-fuchsia-500 outline-none text-center">
                      </td>
                      <td class="py-2.5 px-4 font-mono font-bold text-xs text-slate-500 dark:text-slate-400">
                        {{ draft.page1Data['spikeName'] || 'Spike' }}
                      </td>
                      <td class="py-1 px-2">
                        <input type="text"
                               [(ngModel)]="draft.resultData['QC_SPIKE']['kqTrifluralin']"
                               (ngModelChange)="onCellChanged('QC_SPIKE')"
                               [id]="'cell-' + rowIdx + '-kqTrifluralin'"
                               (keydown)="handleGridNavigation($event, rowIdx, 'kqTrifluralin', 1)"
                               placeholder="..."
                               class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-semibold focus:ring-1 focus:ring-fuchsia-500 outline-none text-center">
                      </td>
                      <td class="py-1 px-2">
                        <input type="text"
                               [(ngModel)]="draft.resultData['QC_SPIKE']['ghiChu']"
                               (ngModelChange)="onDataChanged()"
                               placeholder="Ghi chú..."
                               class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-fuchsia-500 outline-none">
                      </td>
                      <td class="py-1 px-4 text-center">
                        <span class="text-[10px] font-extrabold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">QC SPIKE</span>
                      </td>
                    </tr>
                  } @else if (row.type === 'QC_SPIKE_N' || row.type === 'QC_FINAL') {
                    <tr class="bg-indigo-50/10 dark:bg-indigo-950/5 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                      <td class="py-2.5 px-3 text-center">
                        <input type="checkbox" checked disabled class="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500">
                      </td>
                      <td class="py-1 px-2 w-24">
                        <input type="text"
                               [value]="draft.resultData['QC_SPIKE'] ? draft.resultData['QC_SPIKE']['loSo'] : '2'"
                               disabled
                               class="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-400 font-bold outline-none text-center">
                      </td>
                      <td class="py-2.5 px-4 font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400">
                        {{ row.label }}
                      </td>
                      <td class="py-1 px-2">
                        <input type="text"
                               [(ngModel)]="draft.resultData[row.key]['kqTrifluralin']"
                               (ngModelChange)="onCellChanged(row.key)"
                               [id]="'cell-' + rowIdx + '-kqTrifluralin'"
                               (keydown)="handleGridNavigation($event, rowIdx, 'kqTrifluralin', 1)"
                               placeholder="..."
                               class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-semibold focus:ring-1 focus:ring-fuchsia-500 outline-none text-center">
                      </td>
                      <td class="py-1 px-2">
                        <input type="text"
                               [(ngModel)]="draft.resultData[row.key]['ghiChu']"
                               (ngModelChange)="onDataChanged()"
                               placeholder="Ghi chú..."
                               class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-fuchsia-500 outline-none">
                      </td>
                      <td class="py-1 px-4 text-center">
                        <span class="text-[10px] font-extrabold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">QC {{ row.label }}</span>
                      </td>
                    </tr>
                  } @else if (row.type === 'REGULAR') {
                    <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition" [class.opacity-60]="draft.resultData[row.key]['selected'] === false">
                      <td class="py-2.5 px-3 text-center">
                        <input type="checkbox"
                               [(ngModel)]="draft.resultData[row.key]['selected']"
                               (ngModelChange)="onDataChanged()"
                               class="w-4 h-4 rounded text-fuchsia-600 border-slate-300 focus:ring-fuchsia-500">
                      </td>
                      <td class="py-1 px-2 w-24">
                        <input type="text"
                               [(ngModel)]="draft.resultData[row.key]['loSo']"
                               (ngModelChange)="onDataChanged()"
                               [id]="'cell-' + rowIdx + '-loSo'"
                               (keydown)="handleGridNavigation($event, rowIdx, 'loSo', 0)"
                               class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-1 focus:ring-fuchsia-500 outline-none text-center">
                      </td>
                      <td class="py-2.5 px-4 font-mono font-bold text-xs text-slate-700 dark:text-slate-300 break-all">{{ row.key }}</td>
                      
                      <td class="py-1 px-2">
                        <input type="text"
                               [(ngModel)]="draft.resultData[row.key]['kqTrifluralin']"
                               (ngModelChange)="onCellChanged(row.key)"
                               [id]="'cell-' + rowIdx + '-kqTrifluralin'"
                               (keydown)="handleGridNavigation($event, rowIdx, 'kqTrifluralin', 1)"
                               placeholder="..."
                               class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-semibold focus:ring-1 focus:ring-fuchsia-500 outline-none text-center">
                      </td>
                      
                      <td class="py-1 px-2">
                        <input type="text"
                               [(ngModel)]="draft.resultData[row.key]['ghiChu']"
                               (ngModelChange)="onDataChanged()"
                               [id]="'cell-' + rowIdx + '-ghiChu'"
                               (keydown)="handleGridNavigation($event, rowIdx, 'ghiChu', 2)"
                               placeholder="Ghi chú..."
                               class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-fuchsia-500 outline-none">
                      </td>
                      <td class="py-1 px-4 text-center">
                        <button (click)="copyRowToAll(row.key)" 
                                class="px-2 py-1 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-lg text-[10px] font-black transition-colors"
                                title="Sao chép kết quả của dòng này cho tất cả các dòng còn lại">
                          <i class="fa-solid fa-copy"></i>
                        </button>
                      </td>
                    </tr>
                  }
                }
              } @else {
                <!-- Standard list for other Type 2 SOPs -->
                @for (sample of run.sampleList; track sample; let rowIdx = $index) {
                  @if (draft.resultData[sample]) {
                    <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                      <td class="py-2.5 px-4 font-mono text-xs text-slate-400 font-bold">{{ rowIdx + 1 }}</td>
                      <td class="py-2.5 px-4 font-mono font-bold text-xs text-slate-700 dark:text-slate-300 break-all">{{ sample }}</td>
                      
                      <!-- Dynamic active columns inputs -->
                      @for (col of activeColumns; track col; let colIdx = $index) {
                        <td class="py-1 px-2">
                          <input type="text"
                                 [(ngModel)]="draft.resultData[sample][col]"
                                 (ngModelChange)="onDataChanged()"
                                 [id]="'cell-' + rowIdx + '-' + col"
                                 (keydown)="handleGridNavigation($event, rowIdx, col, colIdx)"
                                 placeholder="..."
                                 class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-semibold focus:ring-1 focus:ring-fuchsia-500 focus:border-fuchsia-500 outline-none text-center">
                        </td>
                      }
                      
                      <!-- Ghi chú -->
                      <td class="py-1 px-2">
                        <input type="text"
                               [(ngModel)]="draft.resultData[sample]['ghiChu']"
                               (ngModelChange)="onDataChanged()"
                               [id]="'cell-' + rowIdx + '-ghiChu'"
                               (keydown)="handleGridNavigation($event, rowIdx, 'ghiChu', activeColumns.length)"
                               placeholder="Ghi chú..."
                               class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-fuchsia-500 focus:border-fuchsia-500 outline-none">
                      </td>

                      <td class="py-1 px-4 text-center">
                        <button (click)="copyRowToAll(sample)" 
                                class="px-2 py-1 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-lg text-[10px] font-black transition-colors"
                                title="Sao chép kết quả của dòng này cho tất cả các dòng còn lại">
                          <i class="fa-solid fa-copy"></i>
                        </button>
                      </td>
                    </tr>
                  }
                }
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class ResultEntryType2Component implements OnInit {
  @Input() run!: any;
  @Input() draft!: AnalysisResultDraft;
  @Input() config!: any;

  @Output() draftChanged = new EventEmitter<AnalysisResultDraft>();

  isTrifluralin = false;
  activeColumns: string[] = [];
  checkboxList: { key: string; label: string }[] = [];

  // Prefix filtering state
  selectedPrefixFilter = signal<string>('ALL');
  detectedPrefixes = signal<string[]>([]);

  // Bulk vial properties
  bulkVialStart = 1;
  bulkVialEnd = 1;

  ngOnInit() {
    this.isTrifluralin = this.run.sopId === 'SOP-03' || (this.config.columns && this.config.columns.kqTrifluralin !== undefined);

    // Trích lọc các cột hoạt chất thực sự (loại trừ lọ số, mẫu thử, ghi chú)
    const cols = Object.keys(this.config.columns || {});
    this.activeColumns = cols.filter(c => c !== 'loSo' && c !== 'maSoMau' && c !== 'ghiChu');

    // Chuyển hóa checkbox configuration
    if (this.config.checkboxLines) {
      this.checkboxList = Object.entries(this.config.checkboxLines).map(([label, key]) => ({
        key: key as string,
        label
      }));
    }

    if (this.isTrifluralin) {
      this.detectPrefixes();
      this.onBulkVialStartChange();
    }
  }

  detectPrefixes() {
    const prefixes = new Set<string>();
    (this.run.sampleList || []).forEach((sample: string) => {
      const startsWithLetter = /^[a-zA-Z]/.test(sample);
      const prefix = startsWithLetter ? sample.charAt(0).toUpperCase() : '';
      prefixes.add(prefix);
    });
    this.detectedPrefixes.set(Array.from(prefixes).sort());
  }

  onPrefixFilterChanged(prefix: string) {
    this.selectedPrefixFilter.set(prefix);
    this.onBulkVialStartChange();
  }

  onBulkVialStartChange() {
    const start = parseInt(String(this.bulkVialStart), 10);
    if (!isNaN(start)) {
      const count = this.getVisibleRegularSamples().length;
      this.bulkVialEnd = start + Math.max(0, count - 1);
    }
  }

  applyBulkVials() {
    const start = parseInt(String(this.bulkVialStart), 10);
    const end = parseInt(String(this.bulkVialEnd), 10);
    if (isNaN(start) || isNaN(end) || start > end) {
      return;
    }
    const visible = this.getVisibleRegularSamples();
    visible.forEach((sample: string, idx: number) => {
      const val = start + idx;
      if (val <= end) {
        if (!this.draft.resultData[sample]) {
          this.draft.resultData[sample] = {
            loSo: '',
            kqTrifluralin: '',
            ghiChu: '',
            selected: true
          };
        }
        this.draft.resultData[sample]['loSo'] = String(val);
      }
    });
    this.onDataChanged();
  }

  filteredSamples(): string[] {
    const filter = this.selectedPrefixFilter();
    const samples = this.run.sampleList || [];
    if (filter === 'ALL') {
      return samples;
    }
    return samples.filter((sample: string) => {
      const startsWithLetter = /^[a-zA-Z]/.test(sample);
      const prefix = startsWithLetter ? sample.charAt(0).toUpperCase() : '';
      return prefix === filter;
    });
  }

  getVisibleRegularSamples(): string[] {
    return this.filteredSamples();
  }

  isAllSelected(): boolean {
    const visible = this.getVisibleRegularSamples();
    if (visible.length === 0) return false;
    return visible.every(s => this.draft.resultData[s]?.['selected'] !== false);
  }

  toggleSelectAll(event: any) {
    const checked = event.target.checked;
    const visible = this.getVisibleRegularSamples();
    visible.forEach(s => {
      if (!this.draft.resultData[s]) {
        this.draft.resultData[s] = {};
      }
      this.draft.resultData[s]['selected'] = checked;
    });
    this.onDataChanged();
  }

  formatColumnName(colKey: string): string {
    // Chuyển từ kqTrifluralin -> Trifluralin, kqFip -> Fipronil
    let name = colKey.replace(/^kq/, '');
    // Tách hoa/thường viết hoa từ đầu
    name = name.replace(/([A-Z])/g, ' $1').trim();
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  onDataChanged() {
    this.draftChanged.emit(this.draft);
  }

  onCellChanged(sampleCode: string) {
    if (this.isTrifluralin) {
      this.updateRecovery(sampleCode);
    }
    this.onDataChanged();
  }

  getSpikeNKey(n: number, prefix: string): string {
    return `QC_SPIKE_${n}_QC_${prefix}`;
  }

  getFinalKey(prefix: string): string {
    return `QC_FINAL_QC_${prefix}`;
  }

  getDisplayRowsForPrefix(prefix: string): any[] {
    const samples = (this.run.sampleList || []).filter((sample: string) => {
      if (prefix === 'ALL') return true;
      const startsWithLetter = /^[a-zA-Z]/.test(sample);
      const p = startsWithLetter ? sample.charAt(0).toUpperCase() : '';
      return p === prefix;
    });

    const list: any[] = [];
    
    const ensureKey = (key: string, isSpikeQC: boolean) => {
      if (!this.draft.resultData[key]) {
        this.draft.resultData[key] = {
          loSo: isSpikeQC ? (this.draft.resultData['QC_SPIKE']?.['loSo'] || '2') : '',
          kqTrifluralin: '',
          ghiChu: '',
          selected: true
        };
      } else if (isSpikeQC) {
        this.draft.resultData[key]['loSo'] = this.draft.resultData['QC_SPIKE']?.['loSo'] || '2';
      }
    };

    ensureKey('QC_BLANK', false);
    ensureKey('QC_SPIKE', false);

    list.push({
      key: 'QC_BLANK',
      type: 'QC_BLANK',
      label: this.draft.page1Data['blankName'] || 'Blank',
      isQC: true
    });

    list.push({
      key: 'QC_SPIKE',
      type: 'QC_SPIKE',
      label: this.draft.page1Data['spikeName'] || 'Spike',
      isQC: true
    });

    let selectedCount = 0;
    samples.forEach((sampleCode: string) => {
      ensureKey(sampleCode, false);
      const rowData = this.draft.resultData[sampleCode];
      const isSelected = rowData['selected'] !== false;
      
      list.push({
        key: sampleCode,
        type: 'REGULAR',
        label: sampleCode,
        isQC: false
      });

      if (isSelected) {
        selectedCount++;
        if (selectedCount % 10 === 0) {
          const n = selectedCount / 10;
          const spikeNKey = this.getSpikeNKey(n, prefix);
          ensureKey(spikeNKey, true);
          list.push({
            key: spikeNKey,
            type: 'QC_SPIKE_N',
            label: `SPIKE_${n}`,
            isQC: true,
            n: n
          });
        }
      }
    });

    if (selectedCount > 0) {
      const finalKey = this.getFinalKey(prefix);
      ensureKey(finalKey, true);
      list.push({
        key: finalKey,
        type: 'QC_FINAL',
        label: 'FINAL',
        isQC: true
      });
    }

    return list;
  }

  updateRecovery(sampleCode: string) {
    const row = this.draft.resultData[sampleCode];
    if (!row) return;
    const spikeName = this.draft.page1Data['spikeName'] || 'Spike';
    
    // Check if row matches spike criteria: sample name contains spike/sp, or is spike row, or is SPIKE_N/FINAL QC row
    const isSpike = sampleCode.toLowerCase().includes('spike') || 
                    sampleCode.toLowerCase().includes('sp') ||
                    sampleCode === 'QC_SPIKE' || 
                    sampleCode.includes('_QC_') ||
                    spikeName.toLowerCase().includes('spike') || 
                    spikeName.toLowerCase().includes('sp');

    if (isSpike) {
      const valStr = row['kqTrifluralin'];
      const val = parseFloat(valStr);
      if (!isNaN(val)) {
        // Recovery formula: result value * 100%
        const rec = val * 100;
        const recFormatted = rec % 1 === 0 ? rec.toFixed(0) : rec.toFixed(1);
        row['ghiChu'] = `${recFormatted}%`;
      } else {
        row['ghiChu'] = '';
      }
    }
  }

  /**
   * Thay đổi trạng thái checkbox checkTatCaND và checkCoMauPhatHien (luôn trái ngược nhau)
   */
  onCheckboxChange(changedKey: string) {
    if (changedKey === 'checkTatCaND' && this.draft.page1Data['checkTatCaND']) {
      this.draft.page1Data['checkCoMauPhatHien'] = false;
    } else if (changedKey === 'checkCoMauPhatHien' && this.draft.page1Data['checkCoMauPhatHien']) {
      this.draft.page1Data['checkTatCaND'] = false;
    }
    this.onDataChanged();
  }

  /**
   * Bulk Action: Điền 'ND' (Không phát hiện) cho tất cả các ô trống
   */
  bulkFillND() {
    const sampleList = this.run.sampleList || [];
    sampleList.forEach((sampleCode: string) => {
      const row = this.draft.resultData[sampleCode];
      if (row) {
        this.activeColumns.forEach(col => {
          if (!row[col] || row[col]?.trim() === '') {
            row[col] = 'ND';
          }
        });
      }
    });

    if (this.isTrifluralin) {
      // Also fill blank/spike and any dynamic QC rows if empty
      Object.keys(this.draft.resultData).forEach(key => {
        if (key.startsWith('QC_')) {
          const row = this.draft.resultData[key];
          if (row) {
            this.activeColumns.forEach(col => {
              if (!row[col] || row[col]?.trim() === '') {
                row[col] = 'ND';
              }
            });
            this.updateRecovery(key);
          }
        }
      });
    }

    this.draft.page1Data['checkTatCaND'] = true;
    this.draft.page1Data['checkCoMauPhatHien'] = false;
    this.onDataChanged();
  }

  /**
   * Bulk Action: Xóa sạch toàn bộ bảng để nhập lại
   */
  bulkClearAll() {
    const sampleList = this.run.sampleList || [];
    sampleList.forEach((sampleCode: string) => {
      const row = this.draft.resultData[sampleCode];
      if (row) {
        this.activeColumns.forEach(col => {
          row[col] = '';
        });
        row['ghiChu'] = '';
      }
    });

    if (this.isTrifluralin) {
      Object.keys(this.draft.resultData).forEach(key => {
        if (key.startsWith('QC_')) {
          const row = this.draft.resultData[key];
          if (row) {
            this.activeColumns.forEach(col => {
              row[col] = '';
            });
            row['ghiChu'] = '';
          }
        }
      });
    }

    this.onDataChanged();
  }

  /**
   * Bulk Action: Sao chép toàn bộ hoạt chất của dòng (mẫu) này cho các mẫu khác
   */
  copyRowToAll(sourceSampleCode: string) {
    const sourceData = this.draft.resultData[sourceSampleCode];
    if (!sourceData) return;

    const sampleList = this.run.sampleList || [];
    sampleList.forEach((sampleCode: string) => {
      if (sampleCode !== sourceSampleCode) {
        const destRow = this.draft.resultData[sampleCode];
        if (destRow) {
          // Chỉ sao chép hoạt chất kết quả
          this.activeColumns.forEach(col => {
            destRow[col] = sourceData[col] || '';
          });
          if (this.isTrifluralin) {
            this.updateRecovery(sampleCode);
          }
        }
      }
    });

    if (this.isTrifluralin) {
      Object.keys(this.draft.resultData).forEach(key => {
        if (key.startsWith('QC_') && key !== sourceSampleCode) {
          const destRow = this.draft.resultData[key];
          if (destRow) {
            this.activeColumns.forEach(col => {
              destRow[col] = sourceData[col] || '';
            });
            this.updateRecovery(key);
          }
        }
      });
    }

    this.onDataChanged();
  }

  /**
   * Spreadsheet Inline Cell Keyboard Navigation
   */
  handleGridNavigation(event: KeyboardEvent, rowIdx: number, col: string, colIdx: number) {
    const totalRows = this.isTrifluralin && this.selectedPrefixFilter() !== 'ALL'
      ? this.getDisplayRowsForPrefix(this.selectedPrefixFilter()).length
      : (this.isTrifluralin ? this.filteredSamples().length : this.run.sampleList.length);
    let targetRow = rowIdx;
    let targetCol = col;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      targetRow = Math.min(rowIdx + 1, totalRows - 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      targetRow = Math.max(rowIdx - 1, 0);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      targetRow = Math.min(rowIdx + 1, totalRows - 1);
    } else {
      return;
    }

    const nextCellId = `cell-${targetRow}-${targetCol}`;
    const element = document.getElementById(nextCellId);
    if (element) {
      element.focus();
      (element as HTMLInputElement).select();
    }
  }
}
