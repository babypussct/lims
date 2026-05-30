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

        <!-- Fipronil specific inputs (Mã hồ sơ, Hệ số pha loãng, Loại mẫu, Tình trạng mẫu) -->
        @if (isFipronil) {
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
                <!-- Preset f=1 -->
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
                <!-- Preset Thủy sản -->
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
                <!-- Preset Bình thường -->
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
        }

        <!-- Checkbox & QC segment controls grid (Dynamic from SOP metadata configuration) -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          @for (checkbox of checkboxList; track checkbox.key) {
            @if (isGeneralObservation(checkbox.key)) {
              <!-- Standard observation checkbox -->
              <label class="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 border border-slate-100 dark:border-slate-700/30 cursor-pointer select-none transition bg-slate-50/20 dark:bg-slate-900/10">
                <input type="checkbox" 
                       [(ngModel)]="draft.page1Data[checkbox.key]" 
                       (ngModelChange)="onCheckboxChange(checkbox.key)"
                       class="mt-1 w-4 h-4 rounded text-fuchsia-600 border-slate-300 focus:ring-fuchsia-500 focus:ring-2 dark:bg-slate-900 dark:border-slate-700">
                <div>
                  <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-tight block">{{ checkbox.label }}</span>
                </div>
              </label>
            } @else {
              <!-- QC evaluation with Đạt / Không đạt Segment Control -->
              <div class="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/80 transition hover:border-slate-300 dark:hover:border-slate-700">
                <div class="flex-1 min-w-0 pr-1">
                  <span class="text-[11px] font-bold text-slate-700 dark:text-slate-200 leading-snug block break-words">
                    {{ checkbox.label }}
                  </span>
                </div>
                
                <!-- Pass / Fail selector -->
                <div class="flex items-center bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg border border-slate-250/30 dark:border-slate-800 shrink-0">
                  <!-- Button 'Đạt' (true) -->
                  <button type="button"
                          (click)="setQcStatus(checkbox.key, true)"
                          [class]="draft.page1Data[checkbox.key] === true 
                            ? 'px-2.5 py-1 text-[11px] font-bold rounded-md bg-emerald-500 text-white shadow-sm transition-all duration-200' 
                            : 'px-2.5 py-1 text-[11px] font-semibold rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors'"
                          title="Đạt tiêu chí">
                    Đạt
                  </button>
                  
                  <!-- Button 'Không đạt' (false) -->
                  <button type="button"
                          (click)="setQcStatus(checkbox.key, false)"
                          [class]="draft.page1Data[checkbox.key] === false 
                            ? 'px-2.5 py-1 text-[11px] font-bold rounded-md bg-rose-500 text-white shadow-sm transition-all duration-200' 
                            : 'px-2.5 py-1 text-[11px] font-semibold rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors'"
                          title="Không đạt tiêu chí">
                    K.Đạt
                  </button>

                  <!-- Button 'N/A' (undefined) -->
                  <button type="button"
                          (click)="setQcStatus(checkbox.key, null)"
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

      <!-- 1.5. Section 6 / 7 Đường chuẩn (Calibration Curve) -->
      @if (isTrifluralin || isFipronil) {
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 space-y-4 animate-fade-in">
          <h4 class="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 pb-2">
            <i class="fa-solid fa-chart-line mr-2 text-fuchsia-500"></i> 
            {{ isTrifluralin ? 'Section 6. Khai báo Đường chuẩn & QC' : '7. Khai báo Đường chuẩn' }}
          </h4>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <!-- Left Side: QC configuration & R^2 (Only for Trifluralin) -->
            @if (isTrifluralin) {
              <div class="lg:col-span-4 space-y-4">
                <div>
                  <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase">Tên mẫu Trắng (Blank)</label>
                  <input type="text" 
                         [(ngModel)]="draft.page1Data['blankName']" 
                         (ngModelChange)="onDataChanged()"
                         (focus)="$any($event.target).select()"
                         placeholder="BLANK"
                         class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition outline-none">
                </div>
                
                <div>
                  <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase">Tên mẫu Thêm chuẩn (Spike)</label>
                  <input type="text" 
                         [(ngModel)]="draft.page1Data['spikeName']" 
                         (ngModelChange)="onDataChanged()"
                         (focus)="$any($event.target).select()"
                         placeholder="SPIKE"
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
            }

            <!-- Left Side: QC configuration (Only for Fipronil) -->
            @if (isFipronil) {
              <div class="lg:col-span-4 space-y-4">
                <div class="p-4 bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-900/50 rounded-xl space-y-3 shadow-sm">
                  <h5 class="text-xs font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-wide flex items-center gap-1.5">
                    <i class="fa-solid fa-flask-vial"></i> Cấu hình mẫu QC
                  </h5>
                  
                  <label class="flex items-center gap-2 cursor-pointer py-2 px-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition">
                    <input type="checkbox" 
                           [(ngModel)]="draft.page1Data['hasCheckSample']" 
                           (ngModelChange)="onDataChanged()"
                           class="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500">
                    <span class="text-xs font-bold text-slate-700 dark:text-slate-200">Áp dụng mẫu CHECK_SAMPLE</span>
                  </label>
                  
                  <p class="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed">
                    Mẫu CHECK_SAMPLE thực hiện ở tần suất thấp. Khi được tích chọn, mẫu sẽ tự động xuất hiện tại vị trí Vial 1.9 (ngay sau BLANK & SPIKE) trên lưới nhập liệu và báo cáo xuất bản.
                  </p>
                </div>
              </div>
            }

            <!-- Right Side: Calibration Points Grid -->
            <div [class]="(isTrifluralin || isFipronil) ? 'lg:col-span-8' : 'lg:col-span-12'">
              <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase">
                {{ isTrifluralin ? '6 Điểm Đường chuẩn (Calibration Curve Points)' : '5 Điểm Đường chuẩn (Calibration Curve Points)' }}
              </label>
              <div class="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900/50">
                <table class="w-full text-xs text-left border-collapse">
                  <thead class="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th class="py-2.5 px-3 font-bold text-slate-500 dark:text-slate-400 text-center w-24">Điểm chuẩn</th>
                      @if (isFipronil) {
                        <th class="py-2.5 px-3 font-bold text-slate-500 dark:text-slate-400">Nội chuẩn cần dùng (ng/ml)</th>
                        <th class="py-2.5 px-3 font-bold text-slate-500 dark:text-slate-400">Nồng độ chuẩn (ng/ml)</th>
                      }
                      <th class="py-2.5 px-3 font-bold text-slate-500 dark:text-slate-400 text-center w-36">Vial No.</th>
                      @if (isTrifluralin) {
                        <th class="py-2.5 px-3 font-bold text-slate-500 dark:text-slate-400">Hàm lượng (µg/kg)</th>
                      }
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-200 dark:divide-slate-700/50 bg-white dark:bg-slate-800">
                    @for (pt of draft.page1Data['calibPoints']; track $index) {
                      <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-750/30 transition">
                        <td class="py-2 px-3 font-extrabold text-slate-500 dark:text-slate-400 text-center bg-slate-50/50 dark:bg-slate-900/10">
                          {{ isFipronil ? ('C' + $index) : ('Điểm ' + ($index + 1)) }}
                        </td>
                        @if (isFipronil) {
                          <td class="py-2.5 px-3 font-semibold text-slate-600 dark:text-slate-300">20</td>
                          <td class="py-2.5 px-3 font-bold text-indigo-600 dark:text-indigo-400 select-all">
                            {{ $index === 0 ? '0' : ($index === 1 ? '5' : ($index === 2 ? '10' : ($index === 3 ? '20' : '50'))) }}
                          </td>
                        }
                        <td class="py-1 px-2 text-center">
                          <input type="text" 
                                 [(ngModel)]="pt['loSo']" 
                                 (ngModelChange)="onDataChanged()"
                                 placeholder="Vial..."
                                 class="w-32 mx-auto bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-1 focus:ring-fuchsia-500 outline-none text-center">
                        </td>
                        @if (isTrifluralin) {
                          <td class="py-1.5 px-2">
                            <input type="text" 
                                   [(ngModel)]="pt['hamLuong']" 
                                   (ngModelChange)="onDataChanged()"
                                   placeholder="Nồng độ..."
                                   class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-800 dark:text-slate-200 font-semibold focus:ring-1 focus:ring-fuchsia-500 outline-none text-center">
                          </td>
                        }
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

            @if (isFipronil) {
              <!-- Quick Vial Rack Input for Fipronil (Lọ số nhanh dạng Rack.Vial) -->
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
                
                <th class="py-3 px-4 text-left font-bold text-slate-500 dark:text-slate-400 text-xs w-24">
                  {{ isFipronil ? 'Vial No.' : 'Lọ số' }}
                </th>
                <th class="py-3 px-4 text-left font-bold text-slate-500 dark:text-slate-400 text-xs min-w-[120px]">Mẫu thử</th>
                
                <!-- Dynamic active columns -->
                @for (col of activeColumns; track col) {
                  <th class="py-3 px-4 text-left font-bold text-slate-500 dark:text-slate-400 text-xs min-w-[110px] uppercase">
                    {{ formatColumnName(col) }} (µg/kg)
                  </th>
                }
                
                @if (!isFipronil) {
                  <th class="py-3 px-4 text-left font-bold text-slate-500 dark:text-slate-400 text-xs min-w-[150px]">Ghi chú</th>
                }
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
                <!-- Standard list for Fipronil and other Type 2 SOPs -->
                @for (row of getDisplayRowsForFipronil(); track row.key; let rowIdx = $index) {
                  @if (draft.resultData[row.key]) {
                    <tr [class]="row.isQC 
                          ? 'hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition bg-indigo-50/20 dark:bg-indigo-950/10' 
                          : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition'">
                      <td class="py-1 px-2 w-24">
                        @if (isFipronil) {
                          <input type="text"
                                 [(ngModel)]="draft.resultData[row.key]['loSo']"
                                 (ngModelChange)="onDataChanged()"
                                 [id]="'cell-' + rowIdx + '-loSo'"
                                 (keydown)="handleGridNavigation($event, rowIdx, 'loSo', 0)"
                                 placeholder="..."
                                 class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-1 focus:ring-fuchsia-500 outline-none text-center">
                        } @else {
                          <span class="font-mono text-xs text-slate-400 font-bold px-2">{{ rowIdx + 1 }}</span>
                        }
                      </td>
                      <td class="py-2.5 px-4 font-mono font-bold text-xs text-slate-700 dark:text-slate-300 break-all">{{ row.label }}</td>
                      
                      <!-- Dynamic active columns inputs -->
                      @for (col of activeColumns; track col; let colIdx = $index) {
                        <td class="py-1 px-2">
                          <input type="text"
                                 [(ngModel)]="draft.resultData[row.key][col]"
                                 (ngModelChange)="onCellChanged(row.key)"
                                 [id]="'cell-' + rowIdx + '-' + col"
                                 (keydown)="handleGridNavigation($event, rowIdx, col, isFipronil ? colIdx + 1 : colIdx)"
                                 placeholder="..."
                                 class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-semibold focus:ring-1 focus:ring-fuchsia-500 focus:border-fuchsia-500 outline-none text-center">
                        </td>
                      }
                      
                      <!-- Ghi chú -->
                      @if (!isFipronil) {
                        <td class="py-1 px-2">
                          <input type="text"
                                 [(ngModel)]="draft.resultData[row.key]['ghiChu']"
                                 (ngModelChange)="onDataChanged()"
                                 [id]="'cell-' + rowIdx + '-ghiChu'"
                                 (keydown)="handleGridNavigation($event, rowIdx, 'ghiChu', isFipronil ? activeColumns.length + 1 : activeColumns.length)"
                                 placeholder="Ghi chú..."
                                 class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-fuchsia-500 focus:border-fuchsia-500 outline-none">
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
  isFipronil = false;
  activeColumns: string[] = [];
  checkboxList: { key: string; label: string }[] = [];

  // Prefix filtering state
  selectedPrefixFilter = signal<string>('ALL');
  detectedPrefixes = signal<string[]>([]);

  // Bulk vial properties
  bulkVialStart = 1;
  bulkVialEnd = 1;

  // Fipronil specific bulk rack properties
  bulkRackStart = 1;
  bulkVialStartFip = 10;
  bulkVialsPerRack = 54;

  ngOnInit() {
    this.isTrifluralin = this.run.sopId === 'SOP-03' || (this.config.columns && this.config.columns.kqTrifluralin !== undefined);
    this.isFipronil = this.run.sopId === 'SOP-01' || (this.config.columns && this.config.columns.kqFip !== undefined);

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

    // Khởi tạo các trường metadata và calibPoints riêng cho Fipronil
    if (this.isFipronil) {
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
      if (this.draft.page1Data['maHoSo'] === undefined) {
        this.draft.page1Data['maHoSo'] = '';
      }
      if (this.draft.page1Data['heSoPhaLoang'] === undefined) {
        this.draft.page1Data['heSoPhaLoang'] = '1';
      }
      if (this.draft.page1Data['loaiMau'] === undefined) {
        this.draft.page1Data['loaiMau'] = 'Thủy sản';
      }
      if (this.draft.page1Data['tinhTrangMau'] === undefined) {
        this.draft.page1Data['tinhTrangMau'] = 'Bình thường';
      }
      if (this.draft.page1Data['hasCheckSample'] === undefined) {
        this.draft.page1Data['hasCheckSample'] = false;
      }

      // Khởi tạo loSo (Vial No) cho từng mẫu kết quả nếu chưa có (mặc định bắt đầu từ vial 1.10)
      if (!this.draft.resultData) {
        this.draft.resultData = {};
      }
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
    if (this.isFipronil) {
      const rackStart = parseInt(String(this.bulkRackStart), 10);
      const vialStart = parseInt(String(this.bulkVialStartFip), 10);
      const perRack = parseInt(String(this.bulkVialsPerRack), 10);

      if (isNaN(rackStart) || isNaN(vialStart) || isNaN(perRack) || perRack <= 0) {
        return;
      }

      const visible = this.getVisibleRegularSamples();
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
      return;
    }

    // Default Trifluralin handling
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
    const customNames: Record<string, string> = {
      'kqFip': 'Fipronil',
      'kqFipDesl': 'Fipronil desulfinyl',
      'kqFipSulf': 'Fipronil sulfide',
      'kqFipSulf2': 'Fipronil sulfone',
      'kqClp': 'Chlorpyrifos',
      'kqClpMe': 'Chlorpyrifos methyl',
      'kqClpMeDes': 'Chlorpyriphos-methyl-desmethyl',
      'kqTrifluralin': 'Trifluralin'
    };
    if (customNames[colKey]) {
      return customNames[colKey];
    }
    
    // Fallback
    let name = colKey.replace(/^kq/, '');
    name = name.replace(/([A-Z])/g, ' $1').trim();
    return name.charAt(0).toUpperCase() + name.slice(1);
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
      const prefixes = this.detectedPrefixes() || [];
      prefixes.forEach(p => {
        if (p && p !== 'ALL') {
          const targetKey = `QC_FINAL_QC_${p}`;
          if (!this.draft.resultData[targetKey]) {
            this.draft.resultData[targetKey] = {};
          }
          this.draft.resultData[targetKey]['loSo'] = sourceFinal['loSo'] || '';
          this.activeColumns.forEach(col => {
            this.draft.resultData[targetKey][col] = sourceFinal[col] || '';
          });
          this.draft.resultData[targetKey]['ghiChu'] = sourceFinal['ghiChu'] || '';
          this.draft.resultData[targetKey]['selected'] = sourceFinal['selected'] !== false;
        }
      });
    }
  }

  onCellChanged(sampleCode: string) {
    if (this.isTrifluralin || this.isFipronil) {
      this.updateRecovery(sampleCode);
    }
    this.onDataChanged();
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

  getDisplayRowsForFipronil(): any[] {
    const list: any[] = [];
    
    if (!this.isFipronil) {
      // Fallback for any other non-Trifluralin non-Fipronil Type 2 SOPs
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
      });
      return list;
    }

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
    list.push({
      key: 'QC_BLANK',
      type: 'QC_BLANK',
      label: 'BLANK',
      isQC: true
    });

    // 2. SPIKE (vial 1.8)
    ensureKey('QC_SPIKE', '1.8');
    list.push({
      key: 'QC_SPIKE',
      type: 'QC_SPIKE',
      label: 'SPIKE',
      isQC: true
    });

    // 3. CHECK_SAMPLE (vial 1.9, optional)
    if (this.draft.page1Data['hasCheckSample']) {
      ensureKey('QC_CHECK_SAMPLE', '1.9');
      list.push({
        key: 'QC_CHECK_SAMPLE',
        type: 'QC_CHECK_SAMPLE',
        label: 'CHECK_SAMPLE',
        isQC: true
      });
    }

    // 4. REGULAR samples (vials start at 1.10)
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

  updateRecovery(sampleCode: string) {
    const row = this.draft.resultData[sampleCode];
    if (!row) return;

    if (this.isFipronil) {
      // Fipronil spike recovery calculation (5 ppb spiked concentration)
      const isSpike = sampleCode === 'QC_SPIKE' || sampleCode === 'QC_FINAL' || sampleCode === 'QC_CHECK_SAMPLE' || sampleCode.toLowerCase().includes('spike');
      if (isSpike) {
        const recoveries: string[] = [];
        const compounds = ['kqFip', 'kqFipDesl', 'kqFipSulf', 'kqFipSulf2', 'kqClp', 'kqClpMe', 'kqClpMeDes'];
        compounds.forEach(comp => {
          const valStr = row[comp];
          const val = parseFloat(valStr);
          if (!isNaN(val)) {
            const rec = (val / 5) * 100;
            const recFormatted = rec % 1 === 0 ? rec.toFixed(0) : rec.toFixed(1);
            const cleanName = comp.replace(/^kq/, '');
            recoveries.push(`${cleanName}: ${recFormatted}%`);
          }
        });
        if (recoveries.length > 0) {
          row['ghiChu'] = recoveries.join(', ');
        } else {
          row['ghiChu'] = '';
        }
      }
      return;
    }

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

    if (this.isTrifluralin || this.isFipronil) {
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

    if (this.isTrifluralin || this.isFipronil) {
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

  isGeneralObservation(key: string): boolean {
    return key === 'checkTatCaND' || key === 'checkCoMauPhatHien';
  }

  setQcStatus(key: string, value: boolean | null) {
    this.draft.page1Data[key] = value;
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
