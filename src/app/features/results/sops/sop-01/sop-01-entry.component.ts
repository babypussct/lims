import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalysisResultDraft } from '../../../../core/models/analysis-result.model';
import { calculateSop01Recovery } from './sop-01-engine';

@Component({
  selector: 'app-sop-01-entry',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      
      <!-- 1. Metadata Form & Checkboxes -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 space-y-4">
        <h4 class="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 pb-2">
          <i class="fa-solid fa-file-invoice mr-2 text-indigo-500"></i> Thông tin chung & Đánh giá (SOP-01)
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

        <!-- Fipronil specific inputs (Mã hồ sơ, Hệ số pha loãng, Loại mẫu, Tình trạng mẫu) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-indigo-50/20 dark:bg-indigo-950/10 border border-indigo-100/50 dark:border-indigo-950/30">
          <!-- Mã hồ sơ -->
          <div>
            <label class="block text-[10px] font-black text-indigo-600 dark:text-indigo-400 mb-1.5 uppercase tracking-wider">1. Mã hồ sơ</label>
            <input type="text" 
                   [(ngModel)]="draft.page1Data['maHoSo']" 
                   (ngModelChange)="onDataChanged()"
                   placeholder="Nhập mã hồ sơ..."
                   class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition outline-none shadow-sm">
          </div>

          <!-- Hệ số pha loãng -->
          <div>
            <label class="block text-[10px] font-black text-indigo-600 dark:text-indigo-400 mb-1.5 uppercase tracking-wider">3. Hệ số pha loãng (f)</label>
            <div class="flex items-center gap-1.5">
              <button type="button"
                      (click)="draft.page1Data['heSoPhaLoang'] = '1'; onDataChanged()"
                      [class]="draft.page1Data['heSoPhaLoang'] === '1' 
                        ? 'px-3 py-2 text-xs font-bold rounded-xl bg-indigo-600 text-white shadow-sm border border-indigo-600 transition-all shrink-0' 
                        : 'px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shrink-0'"
                      title="Chọn f=1">
                f=1
              </button>
              <input type="text" 
                     [(ngModel)]="draft.page1Data['heSoPhaLoang']" 
                     (ngModelChange)="onDataChanged()"
                     placeholder="Hệ số f..."
                     class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition outline-none shadow-sm">
            </div>
          </div>

          <!-- Loại mẫu -->
          <div>
            <label class="block text-[10px] font-black text-indigo-600 dark:text-indigo-400 mb-1.5 uppercase tracking-wider">4. Loại mẫu</label>
            <div class="flex items-center gap-1.5">
              <button type="button"
                      (click)="draft.page1Data['loaiMau'] = 'Thủy sản'; onDataChanged()"
                      [class]="draft.page1Data['loaiMau'] === 'Thủy sản' || draft.page1Data['loaiMau'] === 'Thuỷ sản'
                        ? 'px-3 py-2 text-xs font-bold rounded-xl bg-indigo-600 text-white shadow-sm border border-indigo-600 transition-all shrink-0' 
                        : 'px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shrink-0'"
                      title="Chọn Thủy sản">
                Thủy sản
              </button>
              <input type="text" 
                     [(ngModel)]="draft.page1Data['loaiMau']" 
                     (ngModelChange)="onDataChanged()"
                     placeholder="Loại mẫu..."
                     class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition outline-none shadow-sm">
            </div>
          </div>

          <!-- Tình trạng mẫu -->
          <div>
            <label class="block text-[10px] font-black text-indigo-600 dark:text-indigo-400 mb-1.5 uppercase tracking-wider">5. Tình trạng mẫu</label>
            <div class="flex items-center gap-1.5">
              <button type="button"
                      (click)="draft.page1Data['tinhTrangMau'] = 'Bình thường'; onDataChanged()"
                      [class]="draft.page1Data['tinhTrangMau'] === 'Bình thường'
                        ? 'px-3 py-2 text-xs font-bold rounded-xl bg-indigo-600 text-white shadow-sm border border-indigo-600 transition-all shrink-0' 
                        : 'px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shrink-0'"
                      title="Chọn Bình thường">
                Bình thường
              </button>
              <input type="text" 
                     [(ngModel)]="draft.page1Data['tinhTrangMau']" 
                     (ngModelChange)="onDataChanged()"
                     placeholder="Tình trạng..."
                     class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition outline-none shadow-sm">
            </div>
          </div>
        </div>

        <!-- Checkbox & QC evaluation grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          @for (checkbox of checkboxList; track checkbox.key) {
            @if (isGeneralObservation(checkbox.key)) {
              <label class="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 border border-slate-100 dark:border-slate-700/30 cursor-pointer select-none transition bg-slate-50/20 dark:bg-slate-900/10">
                <input type="checkbox" 
                       [(ngModel)]="draft.page1Data[checkbox.key]" 
                       (ngModelChange)="onCheckboxChange(checkbox.key)"
                       class="mt-1 w-4 h-4 rounded text-indigo-650 border-slate-300 focus:ring-indigo-500 focus:ring-2 dark:bg-slate-900 dark:border-slate-700">
                <div>
                  <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-tight block">{{ checkbox.label }}</span>
                </div>
              </label>
            } @else {
              <div class="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/80 transition hover:border-slate-300 dark:hover:border-slate-700">
                <div class="flex-1 min-w-0 pr-1">
                  <span class="text-[11px] font-bold text-slate-700 dark:text-slate-200 leading-snug block break-words">
                    {{ checkbox.label }}
                  </span>
                </div>
                
                <div class="flex items-center bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg border border-slate-250/30 dark:border-slate-800 shrink-0">
                  <button type="button"
                          (click)="setQcStatus(checkbox.key, true)"
                          [class]="draft.page1Data[checkbox.key] === true 
                            ? 'px-2.5 py-1 text-[11px] font-bold rounded-md bg-emerald-500 text-white shadow-sm transition-all duration-200' 
                            : 'px-2.5 py-1 text-[11px] font-semibold rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors'"
                          title="Đạt tiêu chí">
                    Đạt
                  </button>
                  
                  <button type="button"
                          (click)="setQcStatus(checkbox.key, false)"
                          [class]="draft.page1Data[checkbox.key] === false 
                            ? 'px-2.5 py-1 text-[11px] font-bold rounded-md bg-rose-500 text-white shadow-sm transition-all duration-200' 
                            : 'px-2.5 py-1 text-[11px] font-semibold rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors'"
                          title="Không đạt tiêu chí">
                    K.Đạt
                  </button>

                  <button type="button"
                          (click)="setQcStatus(checkbox.key, undefined)"
                          [class]="draft.page1Data[checkbox.key] === undefined || draft.page1Data[checkbox.key] === null
                            ? 'px-2 py-1 text-[10px] font-extrabold rounded-md bg-slate-300 dark:bg-slate-700 text-slate-750 dark:text-slate-250 shadow-sm transition-all duration-200' 
                            : 'px-2 py-1 text-[10px] font-semibold rounded-md text-slate-400 dark:text-slate-500 hover:text-slate-600 transition-colors'"
                          title="Chưa đánh giá">
                    N/A
                  </button>
                </div>
              </div>
            }
          }
        </div>
      </div>

      <!-- 1.5. Section 7 Đường chuẩn -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 space-y-4 animate-fade-in">
        <h4 class="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 pb-2">
          <i class="fa-solid fa-chart-line mr-2 text-indigo-500"></i> 7. Khai báo Đường chuẩn
        </h4>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div class="lg:col-span-5 space-y-3">
            <div class="p-3.5 bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-900/50 rounded-xl space-y-2.5 shadow-sm">
              <h5 class="text-xs font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-wide flex items-center gap-1.5">
                <i class="fa-solid fa-flask-vial"></i> Cấu hình mẫu QC & Tên tuỳ chỉnh
              </h5>
              
              <label class="flex items-center gap-2 cursor-pointer py-1.5 px-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition">
                <input type="checkbox" 
                       [(ngModel)]="draft.page1Data['hasCheckSample']" 
                       (ngModelChange)="onDataChanged()"
                       class="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500">
                <span class="text-xs font-bold text-slate-700 dark:text-slate-200">Áp dụng mẫu CHECK_SAMPLE</span>
              </label>

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1">Tên Blank</label>
                  <input type="text" 
                         [(ngModel)]="draft.page1Data['blankName']" 
                         (ngModelChange)="onDataChanged()"
                         placeholder="BLANK"
                         class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-indigo-500 outline-none">
                </div>
                <div>
                  <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1">Tên Spike</label>
                  <input type="text" 
                         [(ngModel)]="draft.page1Data['spikeName']" 
                         (ngModelChange)="onDataChanged()"
                         placeholder="SPIKE"
                         class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-indigo-500 outline-none">
                </div>
              </div>

              @if (draft.page1Data['hasCheckSample']) {
                <div class="animate-fade-in">
                  <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1">Tên Check Sample</label>
                  <input type="text" 
                         [(ngModel)]="draft.page1Data['checkSampleName']" 
                         (ngModelChange)="onDataChanged()"
                         placeholder="CHECK_SAMPLE"
                         class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-indigo-500 outline-none">
                </div>
              }
            </div>
          </div>

          <!-- Calibration Points Grid: Compact horizontal row layout -->
          <div class="lg:col-span-7 flex flex-col justify-between">
            <div>
              <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2.5 uppercase">5 Điểm Đường chuẩn (Calibration Curve Points)</label>
              <div class="grid grid-cols-5 gap-2">
                @for (pt of draft.page1Data['calibPoints']; track $index) {
                  <div class="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 rounded-xl p-2.5 text-center shadow-sm">
                    <div class="text-[10px] font-black text-indigo-650 dark:text-indigo-400 uppercase">C{{ $index }}</div>
                    <div class="text-[11px] font-extrabold text-slate-850 dark:text-slate-200 my-0.5">
                      {{ $index === 0 ? '0 ppb' : ($index === 1 ? '5 ppb' : ($index === 2 ? '10 ppb' : ($index === 3 ? '20 ppb' : '50 ppb'))) }}
                    </div>
                    <div class="text-[9px] text-slate-400 dark:text-slate-500 mb-1.5 font-bold">IS: 20 ppb</div>
                    <input type="text" 
                           [(ngModel)]="pt['loSo']" 
                           (ngModelChange)="onDataChanged()"
                           placeholder="Vial..."
                           class="w-full text-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-1 px-1.5 text-xs text-slate-800 dark:text-slate-100 font-bold focus:ring-1 focus:ring-indigo-500 outline-none">
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Grid Sample Spreadsheet & Bulk Actions -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-3">
          <h4 class="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <i class="fa-solid fa-table-cells mr-1 text-indigo-500"></i> Lưới nhập kết quả (SOP-01 Spreadsheet)
          </h4>

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

            <!-- Quick Vial Rack Input for Fipronil -->
            <div class="flex items-center gap-1.5 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-900/50 rounded-xl px-3 py-1.5 text-xs shadow-sm">
              <span class="font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">Nhập Vial nhanh:</span>
              <div class="flex items-center gap-1">
                <span class="text-slate-500 dark:text-slate-400">Khay (Rack):</span>
                <input type="number" 
                       [(ngModel)]="bulkRackStart" 
                       title="Khay chạy máy (Rack)"
                       placeholder="Rack" 
                       class="w-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-center font-bold text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-indigo-500 outline-none shadow-sm">
              </div>
              <div class="flex items-center gap-1">
                <span class="text-slate-500 dark:text-slate-400">Vial đầu:</span>
                <input type="number" 
                       [(ngModel)]="bulkVialStartFip" 
                       title="Vial bắt đầu"
                       placeholder="Vial" 
                       class="w-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-center font-bold text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-indigo-500 outline-none shadow-sm">
              </div>
              <div class="flex items-center gap-1">
                <span class="text-slate-500 dark:text-slate-400">Size khay:</span>
                <input type="number" 
                       [(ngModel)]="bulkVialsPerRack" 
                       title="Số ống vial tối đa trên một khay (Rack)"
                       placeholder="Tối đa" 
                       class="w-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-center font-bold text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-indigo-500 outline-none shadow-sm">
              </div>
              <button (click)="applyBulkVials()" 
                      class="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition shadow-sm flex items-center gap-1"
                      title="Điền tự động số khay và vial cho toàn bộ danh sách mẫu">
                <i class="fa-solid fa-check"></i>
                <span>Điền nhanh</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Spreadsheet Table Grid -->
        <div class="overflow-x-auto custom-scrollbar border border-slate-200 dark:border-slate-700 rounded-xl">
          <table class="w-full text-sm border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                <th class="py-3 px-4 text-left font-bold text-slate-500 dark:text-slate-400 text-xs w-24">Vial No.</th>
                <th class="py-3 px-4 text-left font-bold text-slate-500 dark:text-slate-400 text-xs min-w-[120px]">Mẫu thử</th>
                
                <!-- Dynamic active columns -->
                @for (col of activeColumns; track col) {
                  <th class="py-3 px-4 text-left font-bold text-slate-500 dark:text-slate-400 text-xs min-w-[110px] uppercase">
                    {{ formatColumnName(col) }} (µg/kg)
                  </th>
                }
                
                <th class="py-3 px-4 text-center font-bold text-slate-500 dark:text-slate-400 text-xs w-28">Hàng</th>
              </tr>
            </thead>
            
            <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50">
              @for (row of getDisplayRowsForFipronil(); track row.key; let rowIdx = $index) {
                @if (draft.resultData[row.key]) {
                  <tr [class]="row.isQC 
                        ? 'hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition bg-indigo-50/20 dark:bg-indigo-950/10' 
                        : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition'">
                    <td class="py-1 px-2 w-24">
                      <input type="text"
                             [(ngModel)]="draft.resultData[row.key]['loSo']"
                             (ngModelChange)="onDataChanged()"
                             [id]="'cell-' + rowIdx + '-loSo'"
                             (keydown)="handleGridNavigation($event, rowIdx, 'loSo', 0)"
                             placeholder="..."
                             class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-1 focus:ring-fuchsia-500 outline-none text-center">
                    </td>
                    <td class="py-2.5 px-4 font-mono font-bold text-xs text-slate-700 dark:text-slate-300 break-all">{{ row.label }}</td>
                    
                    <!-- Dynamic active columns inputs -->
                    @for (col of activeColumns; track col; let colIdx = $index) {
                      <td class="py-1 px-2">
                        <input type="text"
                               [(ngModel)]="draft.resultData[row.key][col]"
                               (ngModelChange)="onCellChanged(row.key)"
                               [id]="'cell-' + rowIdx + '-' + col"
                               (keydown)="handleGridNavigation($event, rowIdx, col, colIdx + 1)"
                               placeholder="..."
                               class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-semibold focus:ring-1 focus:ring-indigo-500 outline-none text-center">
                      </td>
                    }
                    
                    <td class="py-1 px-4 text-center">
                      @if (row.isQC) {
                        <span class="text-[10px] font-extrabold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">QC {{ row.label }}</span>
                      } @else {
                        <button (click)="copyRowToAll(row.key)" 
                                class="px-2 py-1 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-lg text-[10px] font-black transition-colors"
                                title="Sao chép kết quả của dòng này cho tất cả các dòng còn lại">
                          <i class="fa-solid fa-copy"></i>
                        </button>
                      }
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
export class Sop01EntryComponent implements OnInit {
  @Input() run!: any;
  @Input() draft!: AnalysisResultDraft;
  @Input() config!: any;

  @Output() draftChanged = new EventEmitter<AnalysisResultDraft>();

  activeColumns: string[] = [];
  checkboxList: { key: string; label: string }[] = [];

  // Bulk rack properties
  bulkRackStart = 1;
  bulkVialStartFip = 10;
  bulkVialsPerRack = 54;

  ngOnInit() {
    // Trích lọc các hoạt chất thực sự
    const cols = Object.keys(this.config.columns || {});
    this.activeColumns = cols.filter(c => c !== 'loSo' && c !== 'maSoMau' && c !== 'ghiChu');

    // Nạp danh sách checkbox
    if (this.config.checkboxLines) {
      this.checkboxList = Object.entries(this.config.checkboxLines).map(([label, key]) => ({
        key: key as string,
        label
      }));
    }

    // Khởi tạo các trường dữ liệu Fipronil nếu chưa có
    if (!this.draft.page1Data) {
      this.draft.page1Data = {};
    }
    if (!this.draft.page1Data['calibPoints'] || this.draft.page1Data['calibPoints'].length !== 5) {
      this.draft.page1Data['calibPoints'] = [
        { loSo: '1.1', vialNo: '1.1' },
        { loSo: '1.2', vialNo: '1.2' },
        { loSo: '1.3', vialNo: '1.3' },
        { loSo: '1.4', vialNo: '1.4' },
        { loSo: '1.5', vialNo: '1.5' }
      ];
    }
    if (this.draft.page1Data['maHoSo'] === undefined) this.draft.page1Data['maHoSo'] = '';
    if (this.draft.page1Data['heSoPhaLoang'] === undefined) this.draft.page1Data['heSoPhaLoang'] = '1';
    if (this.draft.page1Data['loaiMau'] === undefined) this.draft.page1Data['loaiMau'] = 'Thủy sản';
    if (this.draft.page1Data['tinhTrangMau'] === undefined) this.draft.page1Data['tinhTrangMau'] = 'Bình thường';
    if (this.draft.page1Data['hasCheckSample'] === undefined) this.draft.page1Data['hasCheckSample'] = false;

    // Khởi tạo tên tuỳ chỉnh cho các mẫu QC
    if (this.draft.page1Data['blankName'] === undefined) this.draft.page1Data['blankName'] = 'BLANK';
    if (this.draft.page1Data['spikeName'] === undefined) this.draft.page1Data['spikeName'] = 'SPIKE';
    if (this.draft.page1Data['checkSampleName'] === undefined) this.draft.page1Data['checkSampleName'] = 'CHECK_SAMPLE';

    // Khởi tạo đánh giá chất lượng (QC checklist) mặc định Đạt (true), ngoại trừ qcNhanDang là undefined (N/A)
    const qcKeys = [
      'qcKiemTraNoiBo',
      'qcR2',
      'qcThoiGianLuu',
      'qcThemChuan',
      'qcThuHoi',
      'qcDanhGiaChung'
    ];
    qcKeys.forEach(k => {
      if (this.draft.page1Data[k] === undefined) {
        this.draft.page1Data[k] = true;
      }
    });
    if (this.draft.page1Data['qcNhanDang'] === undefined) {
      this.draft.page1Data['qcNhanDang'] = null;
    }

    if (!this.draft.resultData) {
      this.draft.resultData = {};
    }

    // Mặc định điền Vial bắt đầu từ 1.10
    (this.run.sampleList || []).forEach((sample: string, idx: number) => {
      if (!this.draft.resultData[sample]) {
        this.draft.resultData[sample] = {};
      }
      if (this.draft.resultData[sample]['loSo'] === undefined || this.draft.resultData[sample]['loSo'] === '') {
        const currentVial = 10 + idx;
        const rack = 1 + Math.floor((currentVial - 1) / 54);
        const vial = ((currentVial - 1) % 54) + 1;
        this.draft.resultData[sample]['loSo'] = `${rack}.${vial}`;
      }
    });

    this.onDataChanged();
  }

  isGeneralObservation(key: string): boolean {
    return key === 'checkTatCaND' || key === 'checkCoMauPhatHien';
  }

  setQcStatus(key: string, value: boolean | undefined) {
    this.draft.page1Data[key] = value === undefined ? null : value;
    this.onDataChanged();
  }

  onCheckboxChange(changedKey: string) {
    if (changedKey === 'checkTatCaND' && this.draft.page1Data['checkTatCaND']) {
      this.draft.page1Data['checkCoMauPhatHien'] = false;
      this.draft.page1Data['qcNhanDang'] = null; // Reset to N/A
    } else if (changedKey === 'checkCoMauPhatHien' && this.draft.page1Data['checkCoMauPhatHien']) {
      this.draft.page1Data['checkTatCaND'] = false;
      this.draft.page1Data['qcNhanDang'] = true; // Auto check "Đạt"
    }
    this.onDataChanged();
  }

  applyBulkVials() {
    const rackStart = parseInt(String(this.bulkRackStart), 10);
    const vialStart = parseInt(String(this.bulkVialStartFip), 10);
    const perRack = parseInt(String(this.bulkVialsPerRack), 10);

    if (isNaN(rackStart) || isNaN(vialStart) || isNaN(perRack) || perRack <= 0) {
      return;
    }

    const visible = this.run.sampleList || [];
    let currentRack = rackStart;
    let currentVial = vialStart;

    visible.forEach((sample: string) => {
      if (currentVial > perRack) {
        currentRack += 1;
        currentVial = 1;
      }

      if (!this.draft.resultData[sample]) {
        this.draft.resultData[sample] = {
          loSo: '',
          selected: true
        };
      }
      this.draft.resultData[sample]['loSo'] = `${currentRack}.${currentVial}`;
      currentVial += 1;
    });

    this.onDataChanged();
  }

  formatColumnName(colKey: string): string {
    const customNames: Record<string, string> = {
      'kqFip': 'Fipronil',
      'kqFipDesl': 'Fipronil desulfinyl',
      'kqFipSulf': 'Fipronil sulfide',
      'kqFipSulf2': 'Fipronil sulfone',
      'kqClp': 'Chlorpyrifos',
      'kqClpMe': 'Chlorpyrifos methyl',
      'kqClpMeDes': 'Chlorpyriphos-methyl-desmethyl'
    };
    return customNames[colKey] || colKey;
  }

  onDataChanged() {
    this.draftChanged.emit(this.draft);
  }

  onCellChanged(sampleCode: string) {
    this.updateRecovery(sampleCode);
    this.onDataChanged();
  }

  updateRecovery(sampleCode: string) {
    const row = this.draft.resultData[sampleCode];
    if (!row) return;

    // Delegate to Fipronil pure calculation engine
    row['ghiChu'] = calculateSop01Recovery(row, sampleCode);
  }

  getSpikeNKey(n: number): string {
    return `QC_SPIKE_${n}`;
  }

  getDisplayRowsForFipronil(): any[] {
    const list: any[] = [];
    const blankName = this.draft.page1Data['blankName'] || 'BLANK';
    const spikeName = this.draft.page1Data['spikeName'] || 'SPIKE';
    const checkSampleName = this.draft.page1Data['checkSampleName'] || 'CHECK_SAMPLE';
    
    const ensureKey = (key: string, defaultVial: string) => {
      if (!this.draft.resultData[key]) {
        this.draft.resultData[key] = {
          loSo: defaultVial,
          selected: true
        };
      }
    };

    // 1. BLANK (vial 1.7)
    ensureKey('QC_BLANK', '1.7');
    if (this.draft.resultData['QC_BLANK']['kqFip'] === undefined || this.draft.resultData['QC_BLANK']['kqFip'] === '') {
      this.draft.resultData['QC_BLANK']['kqFip'] = 'ND';
    }
    if (this.draft.resultData['QC_BLANK']['kqFipDesl'] === undefined || this.draft.resultData['QC_BLANK']['kqFipDesl'] === '') {
      this.draft.resultData['QC_BLANK']['kqFipDesl'] = 'ND';
    }
    if (this.draft.resultData['QC_BLANK']['kqFipSulf'] === undefined || this.draft.resultData['QC_BLANK']['kqFipSulf'] === '') {
      this.draft.resultData['QC_BLANK']['kqFipSulf'] = 'ND';
    }

    list.push({
      key: 'QC_BLANK',
      type: 'QC_BLANK',
      label: blankName,
      isQC: true
    });

    // 2. SPIKE (vial 1.8)
    ensureKey('QC_SPIKE', '1.8');
    list.push({
      key: 'QC_SPIKE',
      type: 'QC_SPIKE',
      label: spikeName,
      isQC: true
    });

    // 3. CHECK_SAMPLE (vial 1.9, optional)
    if (this.draft.page1Data['hasCheckSample']) {
      ensureKey('QC_CHECK_SAMPLE', '1.9');
      list.push({
        key: 'QC_CHECK_SAMPLE',
        type: 'QC_CHECK_SAMPLE',
        label: checkSampleName,
        isQC: true
      });
    }

    // 4. REGULAR samples (vials start at 1.10) with dynamic SP_N every 10 samples
    let regularCount = 0;
    (this.run.sampleList || []).forEach((sampleCode: string) => {
      if (!this.draft.resultData[sampleCode]) {
        this.draft.resultData[sampleCode] = {
          loSo: '',
          selected: true
        };
      }
      list.push({
        key: sampleCode,
        type: 'REGULAR',
        label: sampleCode,
        isQC: false
      });

      regularCount++;
      if (regularCount % 10 === 0) {
        const n = regularCount / 10;
        const spikeNKey = this.getSpikeNKey(n);
        const spikeVial = this.draft.resultData['QC_SPIKE']?.['loSo'] || '1.8';
        if (!this.draft.resultData[spikeNKey]) {
          this.draft.resultData[spikeNKey] = {
            loSo: spikeVial,
            selected: true
          };
        } else {
          this.draft.resultData[spikeNKey]['loSo'] = spikeVial;
        }
        list.push({
          key: spikeNKey,
          type: 'QC_SPIKE_N',
          label: `SP_${n}`,
          isQC: true,
          n: n
        });
      }
    });

    // 5. FINAL (vial 1.8)
    ensureKey('QC_FINAL', '1.8');
    list.push({
      key: 'QC_FINAL',
      type: 'QC_FINAL',
      label: 'FINAL',
      isQC: true
    });

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

    // Fill QCs
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

    const rows = this.getDisplayRowsForFipronil();
    const colsCount = this.activeColumns.length + 1; // loSo + active cols

    if (key === 'ArrowUp') {
      targetRowIdx = Math.max(0, rowIdx - 1);
      event.preventDefault();
    } else if (key === 'ArrowDown') {
      targetRowIdx = Math.min(rows.length - 1, rowIdx + 1);
      event.preventDefault();
    } else if (key === 'ArrowLeft') {
      targetColIdx = Math.max(0, colIdx - 1);
    } else if (key === 'ArrowRight') {
      targetColIdx = Math.min(colsCount - 1, colIdx + 1);
    } else {
      return;
    }

    const targetColName = targetColIdx === 0 ? 'loSo' : this.activeColumns[targetColIdx - 1];
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
