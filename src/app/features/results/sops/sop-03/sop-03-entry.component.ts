import { Component, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalysisResultDraft } from '../../../../core/models/analysis-result.model';
import { calculateSop03Recovery } from './sop-03-engine';

@Component({
  selector: 'app-sop-03-entry',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">

      <!-- 1. Metadata Form & Checkboxes -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/80 p-5 space-y-4">
        <h4 class="text-xs font-black text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-805 pb-2.5 uppercase tracking-wider flex items-center">
          <i class="fa-solid fa-file-invoice mr-2 text-fuchsia-500 text-sm"></i> Thông tin chung & Đánh giá (SOP-03)
        </h4>

        <!-- Signature Dates -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest">Ngày ký Người phân tích</label>
            <input type="date" 
                   [(ngModel)]="draft.page1Data['ngayNguoiPhanTich']" 
                   (ngModelChange)="onDataChanged()"
                   class="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition outline-none">
          </div>
          <div>
            <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest">Ngày ký Người thẩm tra</label>
            <input type="date" 
                   [(ngModel)]="draft.page1Data['ngayNguoiThamTra']" 
                   (ngModelChange)="onDataChanged()"
                   class="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition outline-none">
          </div>
        </div>

        <!-- Checkbox & QC evaluation grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          @for (checkbox of checkboxList; track checkbox.key) {
            <label class="flex items-start gap-3 p-3.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 border border-slate-100 dark:border-slate-800/60 cursor-pointer select-none transition bg-slate-50/20 dark:bg-slate-900/10">
              <input type="checkbox" 
                     [(ngModel)]="draft.page1Data[checkbox.key]" 
                     (ngModelChange)="onCheckboxChange(checkbox.key)"
                     class="mt-0.5 w-4 h-4 rounded text-fuchsia-600 border-slate-300 focus:ring-fuchsia-500 focus:ring-2 dark:bg-slate-800 dark:border-slate-700">
              <div>
                <span class="text-xs font-bold text-slate-700 dark:text-slate-300 leading-tight block">{{ checkbox.label }}</span>
              </div>
            </label>
          }
        </div>
      </div>

      <!-- 1.5. Section 6 Đường chuẩn & QC -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/80 p-5 space-y-4 animate-fade-in">
        <h4 class="text-xs font-black text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2.5 uppercase tracking-wider flex items-center">
          <i class="fa-solid fa-chart-line mr-2 text-fuchsia-500 text-sm"></i> Section 6. Khai báo Đường chuẩn & QC
        </h4>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Left Side: QC configuration & R^2 -->
          <div class="lg:col-span-4 space-y-4">
            <div>
              <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest">Tên mẫu Trắng (Blank)</label>
              <input type="text" 
                     [(ngModel)]="draft.page1Data['blankName']" 
                     (ngModelChange)="onDataChanged()"
                     (focus)="$any($event.target).select()"
                     placeholder="BLANK"
                     class="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition outline-none">
            </div>
            
            <div>
              <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest">Tên mẫu Thêm chuẩn (Spike)</label>
              <input type="text" 
                     [(ngModel)]="draft.page1Data['spikeName']" 
                     (ngModelChange)="onDataChanged()"
                     (focus)="$any($event.target).select()"
                     placeholder="SPIKE"
                     class="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition outline-none">
            </div>

            <div>
              <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest">Hệ số xác định R²</label>
              <input type="text" 
                     [(ngModel)]="draft.page1Data['r2']" 
                     (ngModelChange)="onDataChanged()"
                     (focus)="$any($event.target).select()"
                     placeholder="Ví dụ: 0.9992..."
                     class="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs font-extrabold text-indigo-600 dark:text-indigo-400 focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition outline-none">
            </div>
          </div>

          <!-- Calibration Points Grid (Horizontal Card Layout) -->
          <div class="lg:col-span-8">
            <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-3 uppercase tracking-widest">6 Điểm Đường chuẩn (Calibration Curve Points)</label>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              @for (pt of draft.page1Data['calibPoints']; track $index) {
                <div class="bg-slate-50/40 dark:bg-slate-955/40 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-3 flex flex-col gap-2 hover:shadow-xs hover:border-fuchsia-400/50 dark:hover:border-fuchsia-500/40 transition duration-200 group">
                  <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
                    <span class="text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 group-hover:text-fuchsia-500 transition duration-200">Điểm {{ $index + 1 }}</span>
                    <span class="w-1.5 h-1.5 rounded-full" [ngClass]="{
                      'bg-indigo-400': $index === 0,
                      'bg-sky-400': $index === 1,
                      'bg-emerald-400': $index === 2,
                      'bg-amber-400': $index === 3,
                      'bg-orange-400': $index === 4,
                      'bg-fuchsia-400': $index === 5
                    }"></span>
                  </div>
                  <div>
                    <label class="block text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Vial No.</label>
                    <input type="text" 
                           [(ngModel)]="pt['loSo']" 
                           (ngModelChange)="onDataChanged()"
                           (focus)="$any($event.target).select()"
                           placeholder="..."
                           class="w-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 rounded-lg px-2 py-0.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 outline-none text-center transition">
                  </div>
                  <div>
                    <label class="block text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Hàm lượng</label>
                    <input type="text" 
                           [(ngModel)]="pt['hamLuong']" 
                           (ngModelChange)="onDataChanged()"
                           (focus)="$any($event.target).select()"
                           placeholder="..."
                           class="w-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 rounded-lg px-2 py-0.5 text-xs text-slate-800 dark:text-slate-200 font-semibold focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 outline-none text-center transition">
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Grid Sample Spreadsheet & Bulk Actions -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/80 p-5 space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
          <h4 class="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center">
            <i class="fa-solid fa-table-cells mr-2 text-fuchsia-500 text-sm"></i> Lưới nhập kết quả (SOP-03 Spreadsheet)
          </h4>

          <div class="flex flex-wrap items-center gap-2">
            <span class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mr-1">Thao tác nhanh:</span>
            
            <button (click)="bulkFillND()" 
                    class="px-3 py-1.5 bg-slate-50 dark:bg-slate-955 hover:bg-amber-50 dark:hover:bg-amber-955/20 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 border border-slate-200/60 dark:border-slate-800 hover:border-amber-200 rounded-lg text-xs font-bold transition flex items-center gap-1.5 active:scale-95 shadow-xs"
                    title="Đặt toàn bộ các ô kết quả chưa điền là ND">
              <i class="fa-solid fa-pen-clip"></i>
              <span>Điền ND ô trống</span>
            </button>

            <button (click)="bulkClearAll()" 
                    class="px-3 py-1.5 bg-slate-50 dark:bg-slate-955 hover:bg-red-50 dark:hover:bg-red-955/20 text-slate-655 dark:text-slate-455 hover:text-red-655 dark:hover:text-red-400 border border-slate-200/60 dark:border-slate-800 hover:border-red-200 rounded-lg text-xs font-bold transition flex items-center gap-1.5 active:scale-95 shadow-xs"
                    title="Xóa toàn bộ các ô kết quả của bảng">
              <i class="fa-solid fa-trash-can"></i>
              <span>Xóa hết bảng</span>
            </button>

            <!-- Quick Vial Input -->
            <div class="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-955 border border-slate-200/60 dark:border-slate-800/80 rounded-lg px-2.5 py-1 text-xs">
              <span class="font-bold text-slate-500 dark:text-slate-400">Lọ số:</span>
              <input type="number" 
                     [(ngModel)]="bulkVialStart" 
                     (ngModelChange)="onBulkVialStartChange()"
                     placeholder="Bắt đầu" 
                     class="w-14 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-center text-slate-800 dark:text-slate-200 font-bold focus:ring-1 focus:ring-fuchsia-500 outline-none">
              <span class="text-slate-400">-</span>
              <input type="number" 
                     [(ngModel)]="bulkVialEnd" 
                     placeholder="Kết thúc" 
                     class="w-14 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-center text-slate-800 dark:text-slate-200 font-bold focus:ring-1 focus:ring-fuchsia-500 outline-none">
              <button (click)="applyBulkVials()" 
                      class="px-2.5 py-1 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded font-bold transition flex items-center gap-1 active:scale-95 shadow-sm">
                <i class="fa-solid fa-check"></i>
                <span>Áp dụng</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Prefix Tabs Filter has been moved to ResultEntryComponent (Global) -->

        <!-- Spreadsheet Table Grid -->
        <div class="overflow-x-auto custom-scrollbar border border-slate-200/60 dark:border-slate-800 rounded-xl max-h-[500px]">
          <table class="w-full text-sm border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-800 sticky top-0 z-20">
                <th class="py-3 px-3 text-center w-12 bg-slate-50 dark:bg-slate-900">
                  <input type="checkbox"
                         [checked]="isAllSelected()"
                         (change)="toggleSelectAll($event)"
                         class="w-4 h-4 rounded text-fuchsia-600 border-slate-350 focus:ring-fuchsia-500">
                </th>
                <th class="py-3 px-4 text-left font-black text-slate-450 dark:text-slate-500 text-xs w-24 bg-slate-50 dark:bg-slate-900 uppercase tracking-wider">Lọ số</th>
                <th class="py-3 px-4 text-left font-black text-slate-450 dark:text-slate-500 text-xs min-w-[140px] bg-slate-50 dark:bg-slate-900 uppercase tracking-wider">Mẫu thử</th>
                
                @for (col of activeColumns; track col) {
                  <th class="py-3 px-4 text-left font-black text-slate-450 dark:text-slate-500 text-xs min-w-[130px] bg-slate-50 dark:bg-slate-900 uppercase tracking-wider">
                    {{ formatColumnName(col) }} (µg/kg)
                  </th>
                }
                
                <th class="py-3 px-4 text-left font-black text-slate-450 dark:text-slate-500 text-xs min-w-[180px] bg-slate-50 dark:bg-slate-900 uppercase tracking-wider">Ghi chú (Recovery %)</th>
                <th class="py-3 px-4 text-center font-black text-slate-450 dark:text-slate-500 text-xs w-28 bg-slate-50 dark:bg-slate-900 uppercase tracking-wider">Tác vụ</th>
              </tr>
            </thead>
            
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
              @for (row of getDisplayRowsForPrefix(activeFilter); track row.key; let rowIdx = $index) {
                @if (row.type === 'QC_BLANK') {
                  <tr class="bg-indigo-50/15 dark:bg-indigo-950/5 hover:bg-indigo-50/25 dark:hover:bg-indigo-950/10 transition-colors focus-within:bg-indigo-50/30 dark:focus-within:bg-indigo-950/20 border-l-4 border-l-indigo-500/60 transition-all duration-150">
                    <td class="py-2.5 px-3 text-center">
                      <input type="checkbox" checked disabled class="w-4 h-4 rounded border-slate-350 text-indigo-650 focus:ring-indigo-500">
                    </td>
                    <td class="py-1.5 px-2 w-24">
                      <input type="text"
                             [(ngModel)]="draft.resultData['QC_BLANK']['loSo']"
                             (ngModelChange)="onDataChanged()"
                             (focus)="$any($event.target).select()"
                             class="w-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-center transition">
                    </td>
                    <td class="py-2.5 px-4">
                      <span class="font-mono font-bold text-xs text-indigo-650 dark:text-indigo-455 select-all">{{ draft.page1Data['blankName'] || 'Blank' }}</span>
                    </td>
                    <td class="py-1.5 px-2">
                      <input type="text"
                             [(ngModel)]="draft.resultData['QC_BLANK']['kqTrifluralin']"
                             (ngModelChange)="onCellChanged('QC_BLANK')"
                             [id]="'cell-' + rowIdx + '-kqTrifluralin'"
                             (keydown)="handleGridNavigation($event, rowIdx, 'kqTrifluralin', 1)"
                             (focus)="$any($event.target).select()"
                             placeholder="..."
                             class="w-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-extrabold focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-center transition">
                    </td>
                    <td class="py-1.5 px-2">
                      <input type="text"
                             [(ngModel)]="draft.resultData['QC_BLANK']['ghiChu']"
                             (ngModelChange)="onDataChanged()"
                             (focus)="$any($event.target).select()"
                             placeholder="Ghi chú..."
                             class="w-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition">
                    </td>
                    <td class="py-1.5 px-4 text-center">
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black tracking-widest bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400 uppercase shadow-xs border border-indigo-200/30">BLANK</span>
                    </td>
                  </tr>
                } @else if (row.type === 'QC_SPIKE') {
                  <tr class="bg-indigo-50/15 dark:bg-indigo-950/5 hover:bg-indigo-50/25 dark:hover:bg-indigo-950/10 transition-colors focus-within:bg-indigo-50/30 dark:focus-within:bg-indigo-950/20 border-l-4 border-l-indigo-500/60 transition-all duration-150">
                    <td class="py-2.5 px-3 text-center">
                      <input type="checkbox" checked disabled class="w-4 h-4 rounded border-slate-355 text-indigo-655 focus:ring-indigo-505">
                    </td>
                    <td class="py-1.5 px-2 w-24">
                      <input type="text"
                             [(ngModel)]="draft.resultData['QC_SPIKE']['loSo']"
                             (ngModelChange)="onDataChanged()"
                             (focus)="$any($event.target).select()"
                             class="w-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-center transition">
                    </td>
                    <td class="py-2.5 px-4">
                      <span class="font-mono font-bold text-xs text-indigo-655 dark:text-indigo-455 select-all">{{ draft.page1Data['spikeName'] || 'Spike' }}</span>
                    </td>
                    <td class="py-1.5 px-2">
                      <input type="text"
                             [(ngModel)]="draft.resultData['QC_SPIKE']['kqTrifluralin']"
                             (ngModelChange)="onCellChanged('QC_SPIKE')"
                             [id]="'cell-' + rowIdx + '-kqTrifluralin'"
                             (keydown)="handleGridNavigation($event, rowIdx, 'kqTrifluralin', 1)"
                             (focus)="$any($event.target).select()"
                             placeholder="..."
                             class="w-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-extrabold focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-center transition">
                    </td>
                    <td class="py-1.5 px-2">
                      <input type="text"
                             [(ngModel)]="draft.resultData['QC_SPIKE']['ghiChu']"
                             (ngModelChange)="onDataChanged()"
                             (focus)="$any($event.target).select()"
                             placeholder="Tự động tính recovery..."
                             class="w-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-bold focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition">
                    </td>
                    <td class="py-1.5 px-4 text-center">
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black tracking-widest bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400 uppercase shadow-xs border border-indigo-200/30">SPIKE</span>
                    </td>
                  </tr>
                } @else if (row.type === 'QC_SPIKE_N' || row.type === 'QC_FINAL') {
                  <tr class="bg-violet-50/10 dark:bg-violet-950/5 hover:bg-violet-50/20 dark:hover:bg-violet-950/10 transition-colors focus-within:bg-violet-50/25 dark:focus-within:bg-violet-950/15 border-l-4 border-l-violet-500/60 transition-all duration-150">
                    <td class="py-2.5 px-3 text-center">
                      <input type="checkbox" checked disabled class="w-4 h-4 rounded border-slate-355 text-violet-650 focus:ring-violet-500">
                    </td>
                    <td class="py-1.5 px-2 w-24">
                      <input type="text"
                             [value]="draft.resultData['QC_SPIKE'] ? draft.resultData['QC_SPIKE']['loSo'] : '2'"
                             disabled
                             class="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200/40 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-455 font-bold outline-none text-center">
                    </td>
                    <td class="py-2.5 px-4 font-mono font-bold text-xs text-violet-650 dark:text-violet-405 select-all">
                      {{ row.label }}
                    </td>
                    <td class="py-1.5 px-2">
                      <input type="text"
                             [(ngModel)]="draft.resultData[row.key]['kqTrifluralin']"
                             (ngModelChange)="onCellChanged(row.key)"
                             [id]="'cell-' + rowIdx + '-kqTrifluralin'"
                             (keydown)="handleGridNavigation($event, rowIdx, 'kqTrifluralin', 1)"
                             (focus)="$any($event.target).select()"
                             placeholder="..."
                             class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-semibold focus:ring-1 focus:ring-fuchsia-500 outline-none text-center">
                    </td>
                    <td class="py-1.5 px-2">
                      <input type="text"
                             [(ngModel)]="draft.resultData[row.key]['ghiChu']"
                             (ngModelChange)="onDataChanged()"
                             (focus)="$any($event.target).select()"
                             placeholder="Ghi chú..."
                             class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-fuchsia-500 outline-none">
                    </td>
                    <td class="py-1.5 px-4 text-center">
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black tracking-widest bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400 uppercase shadow-xs border border-indigo-200/30">QC {{ row.label }}</span>
                    </td>
                  </tr>
                } @else if (row.type === 'REGULAR') {
                  <tr class="hover:bg-slate-50/40 dark:hover:bg-slate-850/30 transition-colors focus-within:bg-fuchsia-50/10 dark:focus-within:bg-fuchsia-500/5 border-l-4 border-l-transparent focus-within:border-l-fuchsia-500 transition-all duration-150" [class.opacity-60]="draft.resultData[row.key]['selected'] === false">
                    <td class="py-2.5 px-3 text-center">
                      <input type="checkbox"
                             [(ngModel)]="draft.resultData[row.key]['selected']"
                             (ngModelChange)="onDataChanged()"
                             class="w-4 h-4 rounded text-fuchsia-600 border-slate-350 focus:ring-fuchsia-500">
                    </td>
                    <td class="py-1.5 px-2 w-24">
                      <input type="text"
                             [(ngModel)]="draft.resultData[row.key]['loSo']"
                             (ngModelChange)="onDataChanged()"
                             [id]="'cell-' + rowIdx + '-loSo'"
                             (keydown)="handleGridNavigation($event, rowIdx, 'loSo', 0)"
                             (focus)="$any($event.target).select()"
                             class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 outline-none text-center transition">
                    </td>
                    <td class="py-2.5 px-4 font-mono font-black text-xs text-slate-700 dark:text-slate-300 break-all select-all">{{ row.key }}</td>
                    
                    <td class="py-1.5 px-2">
                      <input type="text"
                             [(ngModel)]="draft.resultData[row.key]['kqTrifluralin']"
                             (ngModelChange)="onCellChanged(row.key)"
                             [id]="'cell-' + rowIdx + '-kqTrifluralin'"
                             (keydown)="handleGridNavigation($event, rowIdx, 'kqTrifluralin', 1)"
                             (focus)="$any($event.target).select()"
                             placeholder="..."
                             class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 outline-none text-center transition">
                    </td>
                    
                    <td class="py-1.5 px-2">
                      <input type="text"
                             [(ngModel)]="draft.resultData[row.key]['ghiChu']"
                             (ngModelChange)="onDataChanged()"
                             [id]="'cell-' + rowIdx + '-ghiChu'"
                             (keydown)="handleGridNavigation($event, rowIdx, 'ghiChu', 2)"
                             (focus)="$any($event.target).select()"
                             placeholder="Ghi chú..."
                             class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-350 focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 outline-none transition">
                    </td>
                    <td class="py-1.5 px-4 text-center">
                      <button (click)="copyRowToAll(row.key)" 
                              class="w-7 h-7 inline-flex items-center justify-center bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-lg text-xs font-black transition active:scale-95 duration-100 shadow-xs"
                              title="Sao chép kết quả của dòng này cho tất cả các dòng còn lại">
                        <i class="fa-solid fa-copy"></i>
                      </button>
                    </td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class Sop03EntryComponent implements OnInit {
  @Input() run!: any;
  @Input() draft!: AnalysisResultDraft;
  @Input() config!: any;
  @Input() activeFilter: string = 'ALL';

  @Output() draftChanged = new EventEmitter<AnalysisResultDraft>();

  activeColumns: string[] = [];
  checkboxList: { key: string; label: string }[] = [];

  // Bulk vial properties
  bulkVialStart = 1;
  bulkVialEnd = 1;

  getStats() {
    const regularSamples = this.getVisibleRegularSamples();
    const totalCount = regularSamples.length;
    const selectedCount = regularSamples.filter(s => this.draft.resultData[s]?.['selected'] !== false).length;
    
    // Fill progress (leaving blank means ND, which is a completed result)
    let filledCount = 0;
    regularSamples.forEach(s => {
      const row = this.draft.resultData[s];
      if (row && row['selected'] !== false) {
        filledCount++;
      }
    });
    const progressPct = selectedCount > 0 ? Math.round((filledCount / selectedCount) * 100) : 0;
    
    // Spike Recovery
    const spikeRow = this.draft.resultData['QC_SPIKE'];
    let spikeRecovery = 'Chưa có';
    let spikeRecoveryVal = 0;
    if (spikeRow && spikeRow['kqTrifluralin']) {
      const val = parseFloat(spikeRow['kqTrifluralin']);
      if (!isNaN(val)) {
        spikeRecoveryVal = val * 100;
        spikeRecovery = `${spikeRecoveryVal % 1 === 0 ? spikeRecoveryVal.toFixed(0) : spikeRecoveryVal.toFixed(1)}%`;
      }
    }
    
    // R2 Linearity
    const r2Val = this.draft.page1Data['r2'] || '';
    const r2Float = parseFloat(r2Val);
    const r2Status = !isNaN(r2Float) ? (r2Float >= 0.995 ? 'VALID' : 'WARNING') : 'NOT_SET';

    return {
      totalCount,
      selectedCount,
      filledCount,
      progressPct,
      spikeRecovery,
      spikeRecoveryVal,
      r2Val,
      r2Status
    };
  }

  ngOnInit() {
    const cols = Object.keys(this.config.columns || {});
    this.activeColumns = cols.filter(c => c !== 'loSo' && c !== 'maSoMau' && c !== 'ghiChu');

    if (this.config.checkboxLines) {
      this.checkboxList = Object.entries(this.config.checkboxLines).map(([label, key]) => ({
        key: key as string,
        label
      }));
    }

    // Đảm bảo các trường dữ liệu cần thiết của Trifluralin luôn được khởi tạo
    if (!this.draft.page1Data) this.draft.page1Data = {};
    if (!this.draft.page1Data['calibPoints'] || this.draft.page1Data['calibPoints'].length === 0) {
      this.draft.page1Data['calibPoints'] = [
        { loSo: '41', hamLuong: '0' },
        { loSo: '42', hamLuong: '0.5' },
        { loSo: '43', hamLuong: '1.0' },
        { loSo: '44', hamLuong: '5.0' },
        { loSo: '45', hamLuong: '10.0' },
        { loSo: '46', hamLuong: '30.0' }
      ];
    }
    if (this.draft.page1Data['r2'] === undefined || this.draft.page1Data['r2'] === '') {
      this.draft.page1Data['r2'] = '0.999';
    }
    if (this.draft.page1Data['blankName'] === undefined) {
      this.draft.page1Data['blankName'] = '';
    }
    if (this.draft.page1Data['spikeName'] === undefined) {
      this.draft.page1Data['spikeName'] = '';
    }

    if (!this.draft.resultData) this.draft.resultData = {};
    if (!this.draft.resultData['QC_BLANK']) {
      this.draft.resultData['QC_BLANK'] = { loSo: '47', kqTrifluralin: 'ND', ghiChu: '', selected: true };
    } else {
      if (!this.draft.resultData['QC_BLANK']['loSo']) this.draft.resultData['QC_BLANK']['loSo'] = '47';
      if (!this.draft.resultData['QC_BLANK']['kqTrifluralin']) this.draft.resultData['QC_BLANK']['kqTrifluralin'] = 'ND';
    }
    if (!this.draft.resultData['QC_SPIKE']) {
      this.draft.resultData['QC_SPIKE'] = { loSo: '48', kqTrifluralin: '', ghiChu: '', selected: true };
    } else {
      if (!this.draft.resultData['QC_SPIKE']['loSo']) this.draft.resultData['QC_SPIKE']['loSo'] = '48';
    }

    this.onBulkVialStartChange();
  }

  onBulkVialStartChange() {
    const start = parseInt(String(this.bulkVialStart), 10);
    if (!isNaN(start)) {
      const count = this.getVisibleRegularSamples().length;
      this.bulkVialEnd = start + Math.max(0, count - 1);
    }
  }

  getVisibleRegularSamples(): string[] {
    // The run object is already filtered by ResultEntryComponent based on activeFilter
    return this.run.sampleList || [];
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

  formatColumnName(colKey: string): string {
    const customNames: Record<string, string> = {
      'kqTrifluralin': 'Trifluralin'
    };
    return customNames[colKey] || colKey;
  }

  onDataChanged() {
    this.syncQcValues();
    this.draftChanged.emit(this.draft);
  }

  syncQcValues() {
    if (!this.draft || !this.draft.resultData) return;
    const allFinalKey = `QC_FINAL_QC_`;
    const sourceFinal = this.draft.resultData[allFinalKey];
    if (sourceFinal) {
      // Find all target prefix keys that exist in resultData
      Object.keys(this.draft.resultData).forEach(key => {
        if (key.startsWith('QC_FINAL_QC_') && key !== allFinalKey) {
          this.draft.resultData[key]['loSo'] = sourceFinal['loSo'] || '';
          this.draft.resultData[key]['kqTrifluralin'] = sourceFinal['kqTrifluralin'] || '';
          this.draft.resultData[key]['ghiChu'] = sourceFinal['ghiChu'] || '';
          this.draft.resultData[key]['selected'] = sourceFinal['selected'] !== false;
        }
      });
    }
  }

  onCheckboxChange(changedKey: string) {
    if (changedKey === 'checkTatCaND' && this.draft.page1Data['checkTatCaND']) {
      this.draft.page1Data['checkCoMauPhatHien'] = false;
    } else if (changedKey === 'checkCoMauPhatHien' && this.draft.page1Data['checkCoMauPhatHien']) {
      this.draft.page1Data['checkTatCaND'] = false;
    }
    this.onDataChanged();
  }

  onCellChanged(sampleCode: string) {
    this.updateRecovery(sampleCode);
    this.onDataChanged();
  }

  updateRecovery(sampleCode: string) {
    const row = this.draft.resultData[sampleCode];
    if (!row) return;

    const spikeName = this.draft.page1Data['spikeName'] || 'Spike';
    row['ghiChu'] = calculateSop03Recovery(row, sampleCode, spikeName);
  }

  getSpikeNKey(n: number, prefix: string): string {
    const p = prefix === 'ALL' ? '' : prefix;
    return `QC_SPIKE_${n}_QC_${p}`;
  }

  getFinalKey(prefix: string): string {
    const p = prefix === 'ALL' ? '' : prefix;
    return `QC_FINAL_QC_${p}`;
  }

  getDisplayRowsForPrefix(prefix: string): any[] {
    const samples = this.getVisibleRegularSamples();
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
          const totalSelected = samples.filter((s: string) => this.draft.resultData[s]?.['selected'] !== false).length;
          const isLastSelected = selectedCount === totalSelected;
          if (!isLastSelected) {
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

  bulkFillND() {
    const visible = this.run.sampleList || [];
    visible.forEach((sampleCode: string) => {
      const row = this.draft.resultData[sampleCode];
      if (row) {
        this.activeColumns.forEach(col => {
          if (!row[col] || row[col]?.trim() === '') {
            row[col] = 'ND';
          }
        });
      }
    });

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

    this.draft.page1Data['checkTatCaND'] = true;
    this.draft.page1Data['checkCoMauPhatHien'] = false;
    this.onDataChanged();
  }

  bulkClearAll() {
    const visible = this.run.sampleList || [];
    visible.forEach((sampleCode: string) => {
      const row = this.draft.resultData[sampleCode];
      if (row) {
        this.activeColumns.forEach(col => {
          row[col] = '';
        });
        row['ghiChu'] = '';
      }
    });

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

    this.onDataChanged();
  }

  copyRowToAll(sourceKey: string) {
    const source = this.draft.resultData[sourceKey];
    if (!source) return;

    const visible = this.run.sampleList || [];
    visible.forEach((targetKey: string) => {
      if (targetKey !== sourceKey) {
        if (!this.draft.resultData[targetKey]) {
          this.draft.resultData[targetKey] = { selected: true };
        }
        this.activeColumns.forEach(col => {
          this.draft.resultData[targetKey][col] = source[col];
        });
        this.updateRecovery(targetKey);
      }
    });

    this.onDataChanged();
  }

  handleGridNavigation(event: KeyboardEvent, rowIdx: number, colName: string, colIdx: number) {
    const key = event.key;
    let targetRowIdx = rowIdx;
    let targetColIdx = colIdx;

    const rows = this.getDisplayRowsForPrefix(this.activeFilter);
    const colsCount = this.activeColumns.length + 3; // checkbox + loSo + active cols + ghiChu

    if (key === 'ArrowUp') {
      targetRowIdx = Math.max(0, rowIdx - 1);
      event.preventDefault();
    } else if (key === 'ArrowDown') {
      targetRowIdx = Math.min(rows.length - 1, rowIdx + 1);
      event.preventDefault();
    } else if (key === 'ArrowLeft') {
      targetColIdx = Math.max(1, colIdx - 1); // skip checkbox col focus
    } else if (key === 'ArrowRight') {
      targetColIdx = Math.min(colsCount - 1, colIdx + 1);
    } else {
      return;
    }

    const targetColName = targetColIdx === 1 ? 'loSo' : (targetColIdx === colsCount - 1 ? 'ghiChu' : this.activeColumns[targetColIdx - 2]);
    setTimeout(() => {
      const el = document.getElementById(`cell-${targetRowIdx}-${targetColName}`);
      if (el) {
        el.focus();
        if (el instanceof HTMLInputElement) {
          el.select();
        }
      }
    }, 10);
  }
}
