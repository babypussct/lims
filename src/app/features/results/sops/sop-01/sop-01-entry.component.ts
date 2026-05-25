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
      <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/80 p-5 space-y-4">
        <h4 class="text-xs font-black text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2.5 uppercase tracking-wider flex items-center">
          <i class="fa-solid fa-file-invoice mr-2 text-fuchsia-500 text-sm"></i> Thông tin chung & Đánh giá (SOP-01)
        </h4>

        <!-- Signature Dates -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest">Ngày ký Người phân tích</label>
            <input type="date" 
                   [(ngModel)]="draft.page1Data['ngayNguoiPhanTich']" 
                   (ngModelChange)="onDataChanged()"
                   class="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200/80 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition outline-none">
          </div>
          <div>
            <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest">Ngày ký Người thẩm tra</label>
            <input type="date" 
                   [(ngModel)]="draft.page1Data['ngayNguoiThamTra']" 
                   (ngModelChange)="onDataChanged()"
                   class="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200/80 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition outline-none">
          </div>
        </div>

        <!-- Fipronil specific inputs (Mã hồ sơ, Hệ số pha loãng, Loại mẫu, Tình trạng mẫu) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-indigo-50/15 dark:bg-indigo-955/5 border border-indigo-100/40 dark:border-indigo-950/20">
          <!-- Mã hồ sơ -->
          <div>
            <label class="block text-[10px] font-black text-indigo-650 dark:text-indigo-400 mb-1.5 uppercase tracking-widest">1. Mã hồ sơ</label>
            <input type="text" 
                   [(ngModel)]="draft.page1Data['maHoSo']" 
                   (ngModelChange)="onDataChanged()"
                   placeholder="Nhập mã hồ sơ..."
                   class="w-full bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-700/80 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition outline-none shadow-sm">
          </div>

          <!-- Hệ số pha loãng -->
          <div>
            <label class="block text-[10px] font-black text-indigo-650 dark:text-indigo-400 mb-1.5 uppercase tracking-widest">3. Hệ số pha loãng (f)</label>
            <div class="flex items-center gap-1.5">
              <button type="button"
                      (click)="draft.page1Data['heSoPhaLoang'] = '1'; onDataChanged()"
                      [class]="draft.page1Data['heSoPhaLoang'] === '1' 
                        ? 'px-3 py-2 text-xs font-extrabold rounded-xl bg-indigo-600 text-white shadow-sm border border-indigo-600 transition shrink-0 active:scale-95' 
                        : 'px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition shrink-0 active:scale-95'"
                      title="Chọn f=1">
                f=1
              </button>
              <input type="text" 
                     [(ngModel)]="draft.page1Data['heSoPhaLoang']" 
                     (ngModelChange)="onDataChanged()"
                     placeholder="Hệ số f..."
                     class="w-full bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-700/80 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition outline-none shadow-sm">
            </div>
          </div>

          <!-- Loại mẫu -->
          <div>
            <label class="block text-[10px] font-black text-indigo-650 dark:text-indigo-400 mb-1.5 uppercase tracking-widest">4. Loại mẫu</label>
            <div class="flex items-center gap-1.5">
              <button type="button"
                      (click)="draft.page1Data['loaiMau'] = 'Thủy sản'; onDataChanged()"
                      [class]="draft.page1Data['loaiMau'] === 'Thủy sản' || draft.page1Data['loaiMau'] === 'Thuỷ sản'
                        ? 'px-3 py-2 text-xs font-extrabold rounded-xl bg-indigo-600 text-white shadow-sm border border-indigo-600 transition shrink-0 active:scale-95' 
                        : 'px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition shrink-0 active:scale-95'"
                      title="Chọn Thủy sản">
                Thủy sản
              </button>
              <input type="text" 
                     [(ngModel)]="draft.page1Data['loaiMau']" 
                     (ngModelChange)="onDataChanged()"
                     placeholder="Loại mẫu..."
                     class="w-full bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-700/80 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition outline-none shadow-sm">
            </div>
          </div>

          <!-- Tình trạng mẫu -->
          <div>
            <label class="block text-[10px] font-black text-indigo-650 dark:text-indigo-400 mb-1.5 uppercase tracking-widest">5. Tình trạng mẫu</label>
            <div class="flex items-center gap-1.5">
              <button type="button"
                      (click)="draft.page1Data['tinhTrangMau'] = 'Bình thường'; onDataChanged()"
                      [class]="draft.page1Data['tinhTrangMau'] === 'Bình thường'
                        ? 'px-3 py-2 text-xs font-extrabold rounded-xl bg-indigo-600 text-white shadow-sm border border-indigo-600 transition shrink-0 active:scale-95' 
                        : 'px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition shrink-0 active:scale-95'"
                      title="Chọn Bình thường">
                Bình thường
              </button>
              <input type="text" 
                     [(ngModel)]="draft.page1Data['tinhTrangMau']" 
                     (ngModelChange)="onDataChanged()"
                     placeholder="Tình trạng..."
                     class="w-full bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-700/80 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition outline-none shadow-sm">
            </div>
          </div>
        </div>

        <!-- Checkbox & QC evaluation grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          @for (checkbox of checkboxList; track checkbox.key) {
            @if (isGeneralObservation(checkbox.key)) {
              <label class="flex items-start gap-3 p-3.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 border border-slate-100 dark:border-slate-800/60 cursor-pointer select-none transition bg-slate-50/20 dark:bg-slate-900/10">
                <input type="checkbox" 
                       [(ngModel)]="draft.page1Data[checkbox.key]" 
                       (ngModelChange)="onCheckboxChange(checkbox.key)"
                       class="mt-0.5 w-4 h-4 rounded text-indigo-650 border-slate-300 focus:ring-indigo-500 focus:ring-2 dark:bg-slate-800 dark:border-slate-700">
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
                          [class]="draft.page1Data[checkbox.key] === true 
                            ? 'px-2.5 py-1 text-[10px] font-black rounded bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs transition duration-150 active:scale-95' 
                            : 'px-2.5 py-1 text-[10px] font-bold rounded text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition duration-150 active:scale-95'"
                          title="Đạt tiêu chí">
                    Đạt
                  </button>
                  
                  <button type="button"
                          (click)="setQcStatus(checkbox.key, false)"
                          [class]="draft.page1Data[checkbox.key] === false 
                            ? 'px-2.5 py-1 text-[10px] font-black rounded bg-rose-500 hover:bg-rose-600 text-white shadow-xs transition duration-150 active:scale-95' 
                            : 'px-2.5 py-1 text-[10px] font-bold rounded text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition duration-150 active:scale-95'"
                          title="Không đạt tiêu chí">
                    K.Đạt
                  </button>

                  <button type="button"
                          (click)="setQcStatus(checkbox.key, undefined)"
                          [class]="draft.page1Data[checkbox.key] === undefined || draft.page1Data[checkbox.key] === null
                            ? 'px-2 py-1 text-[9px] font-black rounded bg-slate-350 dark:bg-slate-700 text-slate-750 dark:text-slate-250 shadow-xs transition duration-150 active:scale-95' 
                            : 'px-2 py-1 text-[9px] font-bold rounded text-slate-400 dark:text-slate-500 hover:text-slate-600 transition duration-150 active:scale-95'"
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
      <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/80 p-5 space-y-4 animate-fade-in">
        <h4 class="text-xs font-black text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2.5 uppercase tracking-wider flex items-center">
          <i class="fa-solid fa-chart-line mr-2 text-fuchsia-500 text-sm"></i> 7. Khai báo Đường chuẩn
        </h4>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div class="lg:col-span-5 space-y-3">
            <div class="p-4 bg-indigo-50/15 dark:bg-indigo-950/5 border border-indigo-100/40 dark:border-indigo-950/20 rounded-2xl space-y-3 shadow-xs">
              <h5 class="text-xs font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <i class="fa-solid fa-flask-vial"></i> Cấu hình mẫu QC & Tên tuỳ chỉnh
              </h5>
              
              <label class="flex items-center gap-2 cursor-pointer py-2 px-3 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 transition select-none shadow-2xs">
                <input type="checkbox" 
                       [(ngModel)]="draft.page1Data['hasCheckSample']" 
                       (ngModelChange)="onHasCheckSampleChange()"
                       class="w-4 h-4 rounded text-fuchsia-600 border-slate-350 dark:border-slate-700 focus:ring-fuchsia-500 dark:bg-slate-900">
                <span class="text-xs font-bold text-slate-700 dark:text-slate-200">Áp dụng mẫu CHECK_SAMPLE</span>
              </label>

              <div class="grid grid-cols-2 gap-2.5">
                <div>
                  <label class="block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1.5 tracking-wider">Tên Blank</label>
                  <input type="text" 
                         [(ngModel)]="draft.page1Data['blankName']" 
                         (ngModelChange)="onDataChanged()"
                         placeholder="BLANK"
                         class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition outline-none shadow-xs">
                </div>
                <div>
                  <label class="block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1.5 tracking-wider">Tên Spike</label>
                  <input type="text" 
                         [(ngModel)]="draft.page1Data['spikeName']" 
                         (ngModelChange)="onDataChanged()"
                         placeholder="SPIKE"
                         class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition outline-none shadow-xs">
                </div>
              </div>

              @if (draft.page1Data['hasCheckSample']) {
                <div class="animate-fade-in">
                  <label class="block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1.5 tracking-wider">Tên Check Sample</label>
                  <input type="text" 
                         [(ngModel)]="draft.page1Data['checkSampleName']" 
                         (ngModelChange)="onDataChanged()"
                         placeholder="CHECK_SAMPLE"
                         class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition outline-none shadow-xs">
                </div>
              }
            </div>
          </div>

          <!-- Calibration Points Grid: Premium horizontally-focused row layout -->
          <div class="lg:col-span-7 flex flex-col justify-center">
            <div>
              <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-3 uppercase tracking-widest">5 Điểm Đường chuẩn (Calibration Curve Points)</label>
              <div class="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                @for (pt of draft.page1Data['calibPoints']; track $index) {
                  <div [class]="'bg-white dark:bg-slate-900 border-t-4 ' + 
                    ($index === 0 ? 'border-t-slate-400/80 border-slate-200 dark:border-slate-800/80' : 
                     ($index === 1 ? 'border-t-emerald-500 border-slate-200 dark:border-slate-800/80' : 
                      ($index === 2 ? 'border-t-teal-500 border-slate-200 dark:border-slate-800/80' : 
                       ($index === 3 ? 'border-t-indigo-500 border-slate-200 dark:border-slate-800/80' : 'border-t-purple-500 border-slate-200 dark:border-slate-800/80')))) + 
                    ' rounded-2xl p-3 text-center shadow-sm hover:shadow-md transition duration-200'"
                    style="content-visibility: auto;">
                    <span [class]="'inline-flex items-center justify-center px-2 py-0.5 rounded text-[9px] font-black mb-1.5 uppercase ' +
                      ($index === 0 ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400' : 
                       ($index === 1 ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' : 
                        ($index === 2 ? 'bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400' : 
                         ($index === 3 ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400' : 'bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400'))))">
                      Point C{{ $index }}
                    </span>
                    <div class="text-[12px] font-black text-slate-850 dark:text-slate-100 my-0.5">
                      {{ $index === 0 ? '0 ppb' : ($index === 1 ? '5 ppb' : ($index === 2 ? '10 ppb' : ($index === 3 ? '20 ppb' : '50 ppb'))) }}
                    </div>
                    <div class="text-[9px] font-bold text-slate-400 dark:text-slate-500 mb-2">IS: 20 ppb</div>
                    <input type="text" 
                           [(ngModel)]="pt['loSo']" 
                           (ngModelChange)="onDataChanged()"
                           placeholder="Vial..."
                           class="w-full text-center bg-slate-50 dark:bg-slate-955 border border-slate-200/80 dark:border-slate-800 rounded-xl py-1.5 px-2 text-xs text-slate-800 dark:text-slate-100 font-extrabold focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition outline-none shadow-inner">
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Grid Sample Spreadsheet & Bulk Actions -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/80 p-5 space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3.5">
          <h4 class="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <i class="fa-solid fa-table-cells mr-1 text-fuchsia-500 text-sm"></i> Lưới nhập kết quả (SOP-01 Spreadsheet)
          </h4>

          <div class="flex flex-wrap items-center gap-3">
            <span class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mr-1">Thao tác nhanh:</span>
            
            <button (click)="bulkFillND()" 
                    class="px-3 py-2 bg-slate-50 dark:bg-slate-850 hover:bg-amber-50 dark:hover:bg-amber-950/20 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 border border-slate-200 dark:border-slate-800 hover:border-amber-200 dark:hover:border-amber-900/30 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 active:scale-95 shadow-2xs"
                    title="Đặt toàn bộ các ô kết quả chưa điền là ND">
              <i class="fa-solid fa-pen-clip text-amber-500"></i>
              <span>Điền ND ô trống</span>
            </button>

            <button (click)="bulkClearAll()" 
                    class="px-3 py-2 bg-slate-50 dark:bg-slate-850 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-800 hover:border-rose-200 dark:hover:border-rose-900/30 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 active:scale-95 shadow-2xs"
                    title="Xóa toàn bộ các ô kết quả của bảng">
              <i class="fa-solid fa-trash-can text-rose-500"></i>
              <span>Xóa hết bảng</span>
            </button>

            <!-- Quick Vial Rack Input for Fipronil -->
            <div class="flex items-center gap-2 bg-indigo-50/15 dark:bg-indigo-950/5 border border-indigo-100/40 dark:border-indigo-950/20 rounded-2xl px-3.5 py-1.5 text-xs shadow-2xs">
              <span class="font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-widest">Nhập Vial nhanh:</span>
              <div class="flex items-center gap-1.5">
                <span class="text-slate-450 dark:text-slate-500 font-bold">Rack:</span>
                <input type="number" 
                       [(ngModel)]="bulkRackStart" 
                       title="Khay chạy máy (Rack)"
                       placeholder="Rack" 
                       class="w-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-1.5 py-0.5 text-center font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 outline-none shadow-inner">
              </div>
              <div class="flex items-center gap-1.5">
                <span class="text-slate-450 dark:text-slate-500 font-bold">Vial đầu:</span>
                <input type="number" 
                       [(ngModel)]="bulkVialStartFip" 
                       title="Vial bắt đầu"
                       placeholder="Vial" 
                       class="w-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-1.5 py-0.5 text-center font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 outline-none shadow-inner">
              </div>
              <div class="flex items-center gap-1.5">
                <span class="text-slate-450 dark:text-slate-500 font-bold">Size:</span>
                <input type="number" 
                       [(ngModel)]="bulkVialsPerRack" 
                       title="Số ống vial tối đa trên một khay (Rack)"
                       placeholder="Tối đa" 
                       class="w-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-1.5 py-0.5 text-center font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 outline-none shadow-inner">
              </div>
              <button (click)="applyBulkVials()" 
                      class="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-extrabold transition shadow-sm flex items-center gap-1 active:scale-95"
                      title="Điền tự động số khay và vial cho toàn bộ danh sách mẫu">
                <i class="fa-solid fa-magic text-[10px]"></i>
                <span>Điền nhanh</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Spreadsheet Table Grid -->
        <div class="overflow-x-auto custom-scrollbar border border-slate-200/80 dark:border-slate-800 rounded-2xl max-h-[550px] overflow-y-auto">
          <table class="w-full text-sm border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-955 border-b border-slate-250/80 dark:border-slate-800 sticky top-0 z-20 shadow-2xs">
                <th class="py-3 px-4 text-left font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest w-24">Vial No.</th>
                <th class="py-3 px-4 text-left font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest min-w-[140px]">Mẫu thử</th>
                
                <!-- Dynamic active columns -->
                @for (col of activeColumns; track col) {
                  <th class="py-3 px-4 text-left font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest min-w-[130px]">
                    {{ formatColumnName(col) }} (µg/kg)
                  </th>
                }
                
                <th class="py-3 px-4 text-center font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest w-28">Hành động</th>
              </tr>
            </thead>
            
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800/80">
              @for (row of getDisplayRowsForFipronil(); track row.key; let rowIdx = $index) {
                @if (draft.resultData[row.key]) {
                  <tr [class]="row.isQC 
                        ? 'bg-amber-50/15 dark:bg-amber-950/5 border-l-4 border-l-amber-500/80 hover:bg-amber-50/25 dark:hover:bg-amber-950/10 transition-colors' 
                        : 'hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-all focus-within:bg-fuchsia-50/10 dark:focus-within:bg-fuchsia-500/5 border-l-4 border-l-transparent focus-within:border-l-fuchsia-500 duration-150'">
                    
                    <!-- Vial No input cell -->
                    <td class="py-1.5 px-3 w-24">
                      <input type="text"
                             [(ngModel)]="draft.resultData[row.key]['loSo']"
                             (ngModelChange)="onDataChanged()"
                             [id]="'cell-' + rowIdx + '-loSo'"
                             (keydown)="handleGridNavigation($event, rowIdx, 'loSo', 0)"
                             (focus)="$any($event.target).select()"
                             placeholder="..."
                             class="w-full bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-extrabold focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition outline-none text-center shadow-inner">
                    </td>

                    <!-- Sample/QC Identifier with tag styling -->
                    <td class="py-2.5 px-4 font-mono font-extrabold text-xs text-slate-700 dark:text-slate-300 break-all">
                      @if (row.isQC) {
                        <span class="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                          <i class="fa-solid fa-flask text-[10px]"></i> {{ row.label }}
                        </span>
                      } @else {
                        <span>{{ row.label }}</span>
                      }
                    </td>
                    
                    <!-- Dynamic active columns inputs -->
                    @for (col of activeColumns; track col; let colIdx = $index) {
                      <td class="py-1.5 px-2">
                        <input type="text"
                               [(ngModel)]="draft.resultData[row.key][col]"
                               (ngModelChange)="onCellChanged(row.key)"
                               [id]="'cell-' + rowIdx + '-' + col"
                               (keydown)="handleGridNavigation($event, rowIdx, col, colIdx + 1)"
                               (focus)="$any($event.target).select()"
                               placeholder="..."
                               class="w-full bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-extrabold focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 outline-none text-center shadow-inner">
                      </td>
                    }
                    
                    <!-- Quick Row actions / Badges -->
                    <td class="py-1.5 px-4 text-center">
                      @if (row.isQC) {
                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-500 dark:bg-amber-400/5 dark:text-amber-400 border border-amber-500/20">
                          QC Active
                        </span>
                      } @else {
                        <button (click)="copyRowToAll(row.key)" 
                                class="p-1.5 bg-slate-50 hover:bg-fuchsia-600 dark:bg-slate-850 dark:hover:bg-fuchsia-600 text-slate-500 hover:text-white dark:text-slate-400 rounded-lg text-[10px] font-bold transition border border-slate-200 dark:border-slate-800 active:scale-90"
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
    if (this.draft.page1Data['blankName'] === undefined) this.draft.page1Data['blankName'] = '';
    if (this.draft.page1Data['spikeName'] === undefined) this.draft.page1Data['spikeName'] = '';
    if (this.draft.page1Data['checkSampleName'] === undefined) this.draft.page1Data['checkSampleName'] = 'CHECK_SAMPLE';

    // Khởi tạo đánh giá chất lượng (QC checklist) mặc định Đạt (true), ngoại trừ qcNhanDang là N/A (null)
    const qcKeys = [
      'qcR2',
      'qcThoiGianLuu',
      'qcThemChuan',
      'qcThuHoi',
      'qcDanhGiaChung'
    ];
    qcKeys.forEach(k => {
      if (this.draft.page1Data[k] === undefined || this.draft.page1Data[k] === null || this.draft.page1Data[k] === '') {
        this.draft.page1Data[k] = true;
      }
    });
    if (this.draft.page1Data['qcKiemTraNoiBo'] === undefined || this.draft.page1Data['qcKiemTraNoiBo'] === '') {
      this.draft.page1Data['qcKiemTraNoiBo'] = this.draft.page1Data['hasCheckSample'] ? true : null;
    }
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

  onHasCheckSampleChange() {
    if (this.draft.page1Data['hasCheckSample']) {
      this.draft.page1Data['qcKiemTraNoiBo'] = true;
    } else {
      this.draft.page1Data['qcKiemTraNoiBo'] = null;
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
        const isLastSample = regularCount === (this.run.sampleList || []).length;
        if (!isLastSample) {
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
