import { STANDARD_GRID_PRESETS, STANDARD_ROLL_PRESETS, GridPreset, labelSheetError } from '../../../shared/utils/label-paper-catalog';
import { clonePrintContent, printWithCleanup, waitForPrintAssets } from '../../../shared/utils/print-dom';
import { AppButtonComponent } from '../../../shared/components/ui/button/button.component';
import { Component, input, output, signal, computed, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReferenceStandard } from '../../../core/models/standard.model';
import { AppModalShellComponent } from '../../../shared/components/ui/modal-shell/modal-shell.component';
import { StandardQrSrcDirective } from '../../../shared/directives/standard-qr-src.directive';


@Component({
  selector: 'app-standards-print-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, AppModalShellComponent, StandardQrSrcDirective, AppButtonComponent],
  template: `
      @if (isOpen()) {
          <app-modal-shell
              [title]="printModalTitle()"
              [description]="printModalDescription()"
              size="xl"
              [closeOnBackdrop]="false"
              [closeDisabled]="printBusy()"
              (closed)="onClose()"
          >
             <div modalBody class="-mx-6 -my-5 flex min-h-[500px] flex-col lg:h-[calc(100vh-12rem)] lg:flex-row">
                 <!-- Left: Settings -->
                 <div class="custom-scrollbar flex w-full flex-col justify-between overflow-y-auto border-b border-slate-100 p-6 dark:border-slate-800 lg:w-1/2 lg:border-b-0 lg:border-r lg:p-8">
                     <div>
                         <!-- Segmented Control for Layout Mode -->
                         <div class="flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl mb-6 border border-slate-200/40 dark:border-slate-700/30">
                             <button (click)="printLayoutMode.set('roll')"
                                     [class.bg-white]="printLayoutMode() === 'roll'"
                                     [class.dark:bg-slate-700]="printLayoutMode() === 'roll'"
                                     [class.shadow-sm]="printLayoutMode() === 'roll'"
                                     [class.text-fuchsia-650]="printLayoutMode() === 'roll'"
                                     [class.dark:text-fuchsia-400]="printLayoutMode() === 'roll'"
                                     class="flex-1 py-2 text-center text-xs font-black rounded-xl transition-all duration-300 text-slate-600 dark:text-slate-400 hover:text-slate-800">
                                 <i class="fa-solid fa-scroll mr-1.5"></i> In Cuộn (Brother QL)
                             </button>
                             <button (click)="printLayoutMode.set('grid')"
                                     [class.bg-white]="printLayoutMode() === 'grid'"
                                     [class.dark:bg-slate-700]="printLayoutMode() === 'grid'"
                                     [class.shadow-sm]="printLayoutMode() === 'grid'"
                                     [class.text-fuchsia-650]="printLayoutMode() === 'grid'"
                                     [class.dark:text-fuchsia-400]="printLayoutMode() === 'grid'"
                                     class="flex-1 py-2 text-center text-xs font-black rounded-xl transition-all duration-300 text-slate-600 dark:text-slate-400 hover:text-slate-800">
                                 <i class="fa-solid fa-grip mr-1.5"></i> In Tấm A4 Decal
                             </button>
                         </div>

                         <div class="space-y-5">
                             <!-- Template Selection -->
                             <div>
                                 <label class="block text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Mẫu hiển thị</label>
                                 <div class="grid grid-cols-3 gap-2">
                                     <button (click)="onTemplateChange('standard')" [ngClass]="{'ring-2 ring-fuchsia-500 bg-fuchsia-50 dark:bg-fuchsia-950/40 text-fuchsia-600 dark:text-fuchsia-400 border-transparent': printTemplate() === 'standard', 'border-slate-200 dark:border-slate-800': printTemplate() !== 'standard'}" class="p-3 border rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition duration-200">
                                         <div class="font-extrabold text-xs text-slate-700 dark:text-slate-200 mb-0.5">Tiêu Chuẩn</div>
                                         <div class="text-[9px] text-slate-400 dark:text-slate-500 leading-tight">Thông Tin Cơ Bản</div>
                                     </button>
                                     <button (click)="onTemplateChange('detailed')" [ngClass]="{'ring-2 ring-fuchsia-500 bg-fuchsia-50 dark:bg-fuchsia-950/40 text-fuchsia-600 dark:text-fuchsia-400 border-transparent': printTemplate() === 'detailed', 'border-slate-200 dark:border-slate-800': printTemplate() !== 'detailed'}" class="p-3 border rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition duration-200">
                                         <div class="font-extrabold text-xs text-slate-700 dark:text-slate-200 mb-0.5">Chi Tiết</div>
                                         <div class="text-[9px] text-slate-400 dark:text-slate-500 leading-tight">Đầy Đủ Thông Tin</div>
                                     </button>
                                     <button (click)="onTemplateChange('qr')" [ngClass]="{'ring-2 ring-fuchsia-500 bg-fuchsia-50 dark:bg-fuchsia-950/40 text-fuchsia-600 dark:text-fuchsia-400 border-transparent': printTemplate() === 'qr', 'border-slate-200 dark:border-slate-800': printTemplate() !== 'qr'}" class="p-3 border rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition duration-200">
                                         <div class="font-extrabold text-xs text-slate-700 dark:text-slate-200 mb-0.5">Kèm Mã QR</div>
                                         <div class="text-[9px] text-slate-400 dark:text-slate-500 leading-tight">Quét Truy Xuất Nhanh</div>
                                     </button>
                                 </div>
                             </div>

                             <!-- Dimensions Selection based on Mode -->
                             <div>
                                 <label class="block text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Kích thước nhãn</label>

                                 @if (printLayoutMode() === 'roll') {
                                     <select [ngModel]="printPaperSize()" (ngModelChange)="onPaperSizeChange($event)" class="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-fuchsia-500/50 transition mb-3">
                                         <option value="62x29_ql800">Brother QL-800 DK-22205 (62 x 29 mm - Khuyên dùng)</option>
                                         <option value="90x29_ql800">Brother QL-800 DK-11201 (90 x 29 mm dọc)</option>
                                         <option value="62x62_ql800">Brother QL-800 DK-11209 (62 x 62 mm vuông)</option>
                                         <option value="35x22">Tem chuẩn dán nắp (35 x 22 mm)</option>
                                         <option value="22x12">Tem nhỏ mini (22 x 12 mm)</option>
                                         <option value="50x30">Tem trung (50 x 30 mm)</option>
                                         <option value="70x50">Tem lớn (70 x 50 mm)</option>
                                         <option value="custom">Tùy chỉnh kích thước...</option>
                                     </select>

                                     @if (printPaperSize() === 'custom') {
                                         <div class="grid grid-cols-3 gap-3 animate-fade-in">
                                             <div>
                                                 <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Rộng (mm)</label>
                                                 <input type="number" [ngModel]="printWidth()" (ngModelChange)="printWidth.set($event)" class="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-fuchsia-500/50">
                                             </div>
                                             <div>
                                                 <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Cao (mm)</label>
                                                 <input type="number" [ngModel]="printHeight()" (ngModelChange)="printHeight.set($event)" class="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-fuchsia-500/50">
                                             </div>
                                             <div>
                                                 <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Font (pt)</label>
                                                 <input type="number" [ngModel]="printFontSize()" (ngModelChange)="printFontSize.set($event)" class="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-fuchsia-500/50">
                                             </div>
                                         </div>
                                     }
                                 } @else {
                                     <!-- A4 Paper Type selector -->
                                     <div class="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-3 border border-slate-200/50 dark:border-slate-700/50">
                                         <button (click)="a4PaperType.set('fullsheet')"
                                                 [class.bg-white]="a4PaperType() === 'fullsheet'"
                                                 [class.dark:bg-slate-700]="a4PaperType() === 'fullsheet'"
                                                 [class.shadow-sm]="a4PaperType() === 'fullsheet'"
                                                 [class.text-fuchsia-600]="a4PaperType() === 'fullsheet'"
                                                 [class.dark:text-fuchsia-400]="a4PaperType() === 'fullsheet'"
                                                 class="flex-1 py-1.5 text-center text-[10px] font-extrabold rounded-lg transition-all duration-200 text-slate-500 hover:text-slate-800">
                                             Nguyên Tấm Tự Cắt (Khuyên Dùng)
                                         </button>
                                         <button (click)="a4PaperType.set('precut')"
                                                 [class.bg-white]="a4PaperType() === 'precut'"
                                                 [class.dark:bg-slate-700]="a4PaperType() === 'precut'"
                                                 [class.shadow-sm]="a4PaperType() === 'precut'"
                                                 [class.text-fuchsia-600]="a4PaperType() === 'precut'"
                                                 [class.dark:text-fuchsia-400]="a4PaperType() === 'precut'"
                                                 class="flex-1 py-1.5 text-center text-[10px] font-extrabold rounded-lg transition-all duration-200 text-slate-500 hover:text-slate-800">
                                             Chia Ô Sẵn (Tomy)
                                         </button>
                                     </div>

                                     @if (a4PaperType() === 'fullsheet') {
                                         <!-- Full sheet configurations -->
                                         <select [ngModel]="fullSheetPreset()" (ngModelChange)="onFullSheetPresetChange($event)" class="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-fuchsia-500/50 transition mb-3">
                                             <option value="medium">Lưới thông dụng 4x8 (32 nhãn - ~46x33 mm)</option>
                                             <option value="large">Lưới nhãn lớn 3x6 (18 nhãn - ~62x45 mm)</option>
                                             <option value="small">Lưới nhãn phụ 5x12 (60 nhãn - ~36x21 mm)</option>
                                             <option value="custom">Tự cấu hình hàng & cột...</option>
                                         </select>

                                         @if (fullSheetPreset() === 'custom') {
                                             <div class="grid grid-cols-2 gap-3 mb-3 animate-fade-in">
                                                 <div>
                                                     <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Số cột (Cols)</label>
                                                     <input type="number" [ngModel]="fullSheetCols()" (ngModelChange)="fullSheetCols.set($event)" class="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-fuchsia-500/50">
                                                 </div>
                                                 <div>
                                                     <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Số dòng (Rows)</label>
                                                     <input type="number" [ngModel]="fullSheetRows()" (ngModelChange)="fullSheetRows.set($event)" class="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-fuchsia-500/50">
                                                 </div>
                                             </div>
                                         }

                                         <!-- Crop mark checkbox -->
                                         <label class="flex items-center gap-2 cursor-pointer group mb-3">
                                             <input type="checkbox" [ngModel]="printShowCropMarks()" (ngModelChange)="printShowCropMarks.set($event)" class="w-4 h-4 text-fuchsia-600 rounded border-slate-350 dark:border-slate-700 focus:ring-fuchsia-500 bg-white dark:bg-slate-800">
                                             <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400 transition">Hiển thị đường viền hướng dẫn cắt (Crop Marks)</span>
                                         </label>
                                     } @else {
                                         <select [ngModel]="gridPreset()" (ngModelChange)="onGridPresetChange($event)" class="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-fuchsia-500/50 transition">
                                             <option value="tomy_145">Tomy 145 (65 nhãn - 5x13 | 38.1 x 21.2 mm - Phổ biến)</option>
                                             <option value="tomy_138">Tomy 138 (100 nhãn - 5x20 | 40 x 14 mm)</option>
                                             <option value="tomy_135">Tomy 135 (24 nhãn - 3x8 | 47 x 22 mm)</option>
                                             <option value="tomy_146">Tomy 146 (18 nhãn - 3x6 | 62 x 42 mm)</option>
                                         </select>
                                     }

                                     <!-- A4 Offset Info -->
                                     <div class="mt-3 grid grid-cols-2 gap-3">
                                         <div>
                                             <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Bắt đầu từ ô nhãn số</label>
                                             <div class="flex items-center gap-1.5">
                                                 <button type="button" (click)="gridStartIndex.set(Math.max(1, gridStartIndex() - 1))" aria-label="Giảm vị trí ô bắt đầu" class="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs"><i class="fa-solid fa-minus"></i></button>
                                                 <input type="number" [ngModel]="gridStartIndex()" (ngModelChange)="onStartIndexInputChange($event)" min="1" [max]="getGridPreset().rows * getGridPreset().cols" class="w-12 text-center bg-transparent border-none font-bold text-xs p-0 text-slate-800 dark:text-slate-100 focus:ring-0">
                                                 <button type="button" (click)="gridStartIndex.set(Math.min(getGridPreset().rows * getGridPreset().cols, gridStartIndex() + 1))" aria-label="Tăng vị trí ô bắt đầu" class="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 text-slate-655 dark:text-slate-300 flex items-center justify-center text-xs"><i class="fa-solid fa-plus"></i></button>
                                             </div>
                                         </div>

                                         <!-- Estimated A4 sheets info badge -->
                                         <div class="p-3 bg-fuchsia-50/50 dark:bg-fuchsia-950/20 rounded-xl border border-fuchsia-100/50 dark:border-fuchsia-900/30 text-[10px] text-fuchsia-700 dark:text-fuchsia-300 flex flex-col justify-center animate-fade-in">
                                             <div class="flex justify-between mb-0.5">
                                                 <span>Vị trí bắt đầu:</span>
                                                 <span class="font-extrabold text-fuchsia-650 dark:text-fuchsia-400">Ô số {{ gridStartIndex() }}</span>
                                             </div>
                                             <div class="flex justify-between border-t border-fuchsia-100/55 dark:border-fuchsia-900/30 pt-1 font-bold">
                                                 <span>Dự kiến cần dùng:</span>
                                                 <span>{{ getRequiredA4Sheets() }} trang A4</span>
                                             </div>
                                         </div>
                                     </div>
                                 }
                             </div>

                             <!-- Fields to Include -->
                             <div>
                                 <label class="block text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5">Thông tin hiển thị trên nhãn</label>
                                 <div class="grid grid-cols-2 gap-y-2.5 gap-x-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-850/50 border border-slate-100 dark:border-slate-800/80">
                                     <label class="flex items-center gap-2 cursor-pointer group">
                                         <input type="checkbox" [ngModel]="printIncludeName()" (ngModelChange)="printIncludeName.set($event)" class="w-4 h-4 text-fuchsia-600 rounded border-slate-350 dark:border-slate-700 focus:ring-fuchsia-500 bg-white dark:bg-slate-800">
                                         <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400 transition">Tên chuẩn</span>
                                     </label>
                                     <label class="flex items-center gap-2 cursor-pointer group">
                                         <input type="checkbox" [ngModel]="printIncludeLot()" (ngModelChange)="printIncludeLot.set($event)" class="w-4 h-4 text-fuchsia-600 rounded border-slate-350 dark:border-slate-700 focus:ring-fuchsia-500 bg-white dark:bg-slate-800">
                                         <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400 transition">Số lô</span>
                                     </label>
                                     <label class="flex items-center gap-2 cursor-pointer group">
                                         <input type="checkbox" [ngModel]="printIncludePurity()" (ngModelChange)="printIncludePurity.set($event)" class="w-4 h-4 text-fuchsia-600 rounded border-slate-350 dark:border-slate-700 focus:ring-fuchsia-500 bg-white dark:bg-slate-800">
                                         <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400 transition">Độ tinh khiết</span>
                                     </label>
                                     <label class="flex items-center gap-2 cursor-pointer group">
                                         <input type="checkbox" [ngModel]="printIncludeOpened()" (ngModelChange)="printIncludeOpened.set($event)" class="w-4 h-4 text-fuchsia-600 rounded border-slate-350 dark:border-slate-700 focus:ring-fuchsia-500 bg-white dark:bg-slate-800">
                                         <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400 transition">Ngày mở nắp</span>
                                     </label>
                                     <label class="flex items-center gap-2 cursor-pointer group">
                                         <input type="checkbox" [ngModel]="printIncludeExpiry()" (ngModelChange)="printIncludeExpiry.set($event)" class="w-4 h-4 text-fuchsia-600 rounded border-slate-350 dark:border-slate-700 focus:ring-fuchsia-500 bg-white dark:bg-slate-800">
                                         <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400 transition">Hạn sử dụng</span>
                                     </label>
                                     <label class="flex items-center gap-2 cursor-pointer group">
                                         <input type="checkbox" [ngModel]="printIncludeStorage()" (ngModelChange)="printIncludeStorage.set($event)" class="w-4 h-4 text-fuchsia-600 rounded border-slate-350 dark:border-slate-700 focus:ring-fuchsia-500 bg-white dark:bg-slate-800">
                                         <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400 transition">Đk bảo quản</span>
                                     </label>
                                     <label class="flex items-center gap-2 cursor-pointer group">
                                         <input type="checkbox" [ngModel]="printIncludeManufacturer()" (ngModelChange)="printIncludeManufacturer.set($event)" class="w-4 h-4 text-fuchsia-600 rounded border-slate-350 dark:border-slate-700 focus:ring-fuchsia-500 bg-white dark:bg-slate-800">
                                         <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400 transition">Hãng sản xuất</span>
                                     </label>
                                     <label class="flex items-center gap-2 cursor-pointer group">
                                         <input type="checkbox" [ngModel]="printIncludeCas()" (ngModelChange)="printIncludeCas.set($event)" class="w-4 h-4 text-fuchsia-600 rounded border-slate-350 dark:border-slate-700 focus:ring-fuchsia-500 bg-white dark:bg-slate-800">
                                         <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400 transition">Chỉ số CAS</span>
                                     </label>
                                 </div>

                                 <!-- Overflow Warning for Small Labels -->
                                 @if (showOverflowWarning()) {
                                     <div class="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-900/40 text-[11px] text-amber-700 dark:text-amber-400 mt-2.5 flex gap-2">
                                         <i class="fa-solid fa-triangle-exclamation mt-0.5 flex-shrink-0 animate-bounce"></i>
                                         <span><strong>Lưu ý:</strong> Cỡ nhãn nhỏ dán nhiều thông tin có thể bị tràn hoặc đè chữ. Bạn nên tắt bớt trường không quá quan trọng.</span>
                                     </div>
                                 }
                             </div>

                             <!-- Copies -->
                             <div class="flex items-center justify-between">
                                 <div>
                                     <label class="block text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Số bản in mỗi loại</label>
                                     <span class="text-[10px] text-slate-400 leading-none">Tổng cộng: {{ standardsToPrint().length * printCopies() }} nhãn chuẩn</span>
                                 </div>
                                 <div class="flex items-center gap-1.5 p-1 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl">
                                     <button (click)="printCopies.set(Math.max(1, printCopies() - 1))" class="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center transition shadow-sm border border-slate-250/20"><i class="fa-solid fa-minus text-xs"></i></button>
                                     <input type="number" [ngModel]="printCopies()" (ngModelChange)="printCopies.set(Math.max(1, $event))" min="1" class="w-12 text-center border-none bg-transparent font-black text-slate-800 dark:text-slate-200 focus:ring-0 p-0 text-sm">
                                     <button (click)="printCopies.set(printCopies() + 1)" class="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center transition shadow-sm border border-slate-250/20"><i class="fa-solid fa-plus text-xs"></i></button>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>

                 <!-- Right: Preview -->
                 <div class="relative flex min-h-[500px] w-full flex-col items-center justify-center bg-slate-50 p-6 dark:bg-slate-900/50 lg:w-1/2 lg:p-8" id="print-preview-container">
                     <div class="absolute top-4 left-4 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-2">
                         <i class="fa-solid fa-eye animate-pulse text-fuchsia-500"></i> Bản Xem Trước Trực Quan
                     </div>

                     @if (printLayoutMode() === 'roll') {
                         <!-- Single Label Preview (Roll) -->
                         <div class="bg-white shadow-xl border border-slate-300/60 dark:border-slate-700/30 flex flex-col justify-center text-black overflow-hidden relative print-content"
                              [style.width.mm]="printWidth()"
                              [style.height.mm]="printHeight()"
                              [style.transform]="'scale(' + getPreviewScale() + ')'"
                              style="transform-origin: center center; transition: all 0.3s ease;">
                              <ng-container *ngTemplateOutlet="labelTemplate; context: { std: standardsToPrint()[0], fontSize: printFontSize(), width: printWidth(), height: printHeight(), isPrint: false }"></ng-container>
                         </div>
                     } @else {
                         <!-- Grid Mode Preview -->
                         <div class="w-full flex flex-col items-center gap-2 animate-fade-in">
                             <!-- Single Label Zoomed (so user can read the text) -->
                             <div class="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider self-start flex items-center gap-1.5">
                                 <i class="fa-solid fa-magnifying-glass-plus text-fuchsia-500"></i> Độ nét thực tế nhãn đơn mẫu
                             </div>

                             <div class="bg-white shadow-xl border border-slate-350 overflow-hidden relative"
                                  [style.width.mm]="getGridPreset().width"
                                  [style.height.mm]="getGridPreset().height"
                                  [style.transform]="'scale(' + (getGridPreset().width <= 40 ? 2.5 : 1.9) + ')'"
                                  style="transform-origin: center center; margin: 15px 0;">
                                  <ng-container *ngTemplateOutlet="labelTemplate; context: { std: standardsToPrint()[0], fontSize: getGridPreset().fontSize, width: getGridPreset().width, height: getGridPreset().height, isPrint: false }"></ng-container>
                             </div>

                             <!-- A4 Layout Sheet -->
                             <div class="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider self-start flex items-center gap-1.5 mt-3 w-full justify-between">
                                 <span class="flex items-center gap-1.5"><i class="fa-solid fa-file-lines text-fuchsia-500"></i> Mô phỏng tấm A4 Decal</span>
                                 <span class="text-fuchsia-500 dark:text-fuchsia-400 font-bold normal-case text-[9px] cursor-pointer hover:underline">(Nhấp để đổi điểm bắt đầu)</span>
                             </div>

                             <!-- Scaled A4 preview container -->
                             <div class="flex items-center justify-center overflow-hidden w-full" style="height: 310px; border-radius: 16px; background: rgba(0,0,0,0.02); border: 1px dashed rgba(0,0,0,0.08); padding: 5px;">
                                 <div class="bg-white shadow-lg border border-slate-200 overflow-hidden flex-shrink-0"
                                      [style.width.mm]="210"
                                      [style.height.mm]="297"
                                      style="transform: scale(0.24); transform-origin: center top; margin-bottom: -225mm;">

                                      <!-- A4 Grid -->
                                      <div [style.padding-top.mm]="getGridPreset().topMargin"
                                           [style.padding-left.mm]="getGridPreset().leftMargin"
                                           style="display: grid; width: 100%; height: 100%; box-sizing: border-box;"
                                           [style.grid-template-columns]="'repeat(' + getGridPreset().cols + ', ' + getGridPreset().width + 'mm)'"
                                           [style.grid-auto-rows]="getGridPreset().height + 'mm'"
                                           [style.row-gap.mm]="getGridPreset().rowGap"
                                           [style.column-gap.mm]="getGridPreset().colGap">

                                           @for (slotIndex of getGridSlots(); track slotIndex) {
                                               @if (slotIndex < gridStartIndex()) {
                                                   <!-- Skipped cell -->
                                                   <button type="button" (click)="gridStartIndex.set(slotIndex)" [attr.aria-label]="'Chọn ô ' + slotIndex + ' làm ô bắt đầu'"
                                                        title="Nhấp để chọn làm ô bắt đầu"
                                                        class="border border-dashed border-slate-250 bg-slate-100 flex items-center justify-center text-[10px] text-slate-355 cursor-pointer hover:bg-fuchsia-50/50 hover:border-fuchsia-300 transition-all"
                                                        style="box-sizing: border-box;">
                                                        {{ slotIndex }}
                                                   </button>
                                               } @else if (slotIndex >= gridStartIndex() && slotIndex < gridStartIndex() + (standardsToPrint().length * printCopies())) {
                                                   <!-- Printed label cell -->
                                                   <button type="button" (click)="gridStartIndex.set(slotIndex)" [attr.aria-label]="'Chọn ô ' + slotIndex + ' làm ô bắt đầu'"
                                                        title="Đang chọn in ở đây"
                                                        class="bg-fuchsia-50 border border-fuchsia-300 text-fuchsia-700 font-semibold cursor-pointer hover:bg-fuchsia-100 transition-all relative flex flex-col justify-between overflow-hidden"
                                                        style="box-sizing: border-box; padding: 1mm; line-height: 1.15;">
                                                        <div style="font-size: 7.5px; font-weight: 800; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #1e1b4b;">
                                                            {{ getStandardForSlot(slotIndex)?.name }}
                                                        </div>
                                                        <div style="font-size: 5px; color: #3730a3; display: flex; justify-content: space-between;">
                                                            <span>L: {{ getStandardForSlot(slotIndex)?.lot_number || 'N/A' }}</span>
                                                            <span>E: {{ getStandardForSlot(slotIndex)?.expiry_date ? (getStandardForSlot(slotIndex)?.expiry_date | date:'dd/MM/yy') : 'N/A' }}</span>
                                                        </div>
                                                        <div class="absolute right-0.5 bottom-0.5 bg-fuchsia-650 text-white rounded-[2px] text-[5px] font-bold px-0.5 flex items-center justify-center" style="transform: scale(0.85);">
                                                            {{ slotIndex }}
                                                        </div>
                                                   </button>
                                               } @else {
                                                   <!-- Unused label cell -->
                                                   <button type="button" (click)="gridStartIndex.set(slotIndex)" [attr.aria-label]="'Chọn ô ' + slotIndex + ' làm ô bắt đầu'"
                                                        title="Nhấp để chọn làm ô bắt đầu"
                                                        class="border border-dashed border-slate-200 bg-white flex items-center justify-center text-[10px] text-slate-355 cursor-pointer hover:bg-fuchsia-50 hover:border-fuchsia-300 hover:text-fuchsia-600 transition-all"
                                                        style="box-sizing: border-box;">
                                                        {{ slotIndex }}
                                                   </button>
                                               }
                                           }
                                      </div>
                                 </div>
                             </div>
                         </div>
                     }

                     <div class="mt-4 text-[10px] text-slate-400 dark:text-slate-500 text-center max-w-[280px]">
                         Xem trước mang tính tương đối. Chất lượng và vị trí in thực tế phụ thuộc cấu hình khổ máy in của bạn.
                     </div>
                 </div>
             </div>
             <div modalFooter class="print-workspace flex w-full flex-wrap items-center justify-between gap-3">
                 @if (printError()) { <p role="alert" class="w-full text-sm text-rose-700 dark:text-rose-300">{{printError()}}</p> }
                 <app-button variant="secondary" [disabled]="printBusy()" (click)="onClose()">Đóng</app-button>
                 <app-button class="print-primary" [loading]="printBusy()" (click)="printLabel()"><i class="fa-solid fa-print" aria-hidden="true"></i> In nhãn ({{standardsToPrint().length * printCopies()}})</app-button>
             </div>
          </app-modal-shell>
      }

      <!-- Reusable HTML Label Template -->
      <ng-template #labelTemplate let-std="std" let-fontSize="fontSize" let-width="width" let-height="height" let-isPrint="isPrint">
          <div class="bg-white text-black overflow-hidden relative flex flex-col justify-between"
               [style.width.mm]="width"
               [style.height.mm]="height"
               [style.padding.mm]="1.5"
               [style.font-size.pt]="fontSize"
               style="line-height: 1.15; box-sizing: border-box; font-family: 'Segoe UI', Roboto, Arial, sans-serif;">

               @if (printTemplate() === 'qr') {
                   <div style="display: flex; height: 100%; gap: 1.2mm; align-items: center; overflow: hidden; box-sizing: border-box; width: 100%;">
                       <!-- Left Text Column -->
                       <div style="flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: center; height: 100%; overflow: hidden;">
                           @if (printIncludeName()) {
                               <div style="font-weight: 800; margin-bottom: 0.4mm; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
                                    [style.font-size.pt]="fontSize + 1.2">
                                   {{ std?.name }}
                               </div>
                           }
                           <div style="font-weight:700;overflow-wrap:anywhere;margin-bottom:0.1mm">Mã: {{std?.internal_id || 'Chưa có mã'}}</div>
                           @if (printIncludeLot()) { <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 0.1mm;">Lô: <span style="font-weight: bold;">{{ std?.lot_number || 'N/A' }}</span></div> }
                           @if (printIncludePurity()) { <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 0.1mm;">Pur: <span style="font-weight: bold;">{{ std?.purity || 'N/A' }}</span></div> }
                           @if (printIncludeOpened()) { <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 0.1mm;">Opn: <span style="font-weight: bold;">{{ std?.date_opened ? (std?.date_opened | date:'dd/MM/yy') : '__/__/__' }}</span></div> }
                           @if (printIncludeExpiry()) { <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 0.1mm;">Exp: <span style="font-weight: bold;">{{ std?.expiry_date ? (std?.expiry_date | date:'dd/MM/yy') : 'N/A' }}</span></div> }
                           @if (printIncludeStorage()) { <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Store: <span style="font-weight: bold;">{{ std?.storage_condition || 'N/A' }}</span></div> }
                       </div>
                       <!-- Right QR Code Column (Dynamic width based on label height) -->
                       <div [style.width.mm]="height - 3.5" [style.height.mm]="height - 3.5" style="display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                           <img [appStandardQr]="std?.id || ''" [standardQrSize]="150" style="width: 100%; height: 100%; object-fit: contain;" />
                       </div>
                   </div>
               } @else {
                   <!-- Standard or Detailed layout -->
                   <div style="display: flex; flex-direction: column; justify-content: center; height: 100%; overflow: hidden; box-sizing: border-box; width: 100%;">
                       <div style="font-weight:700;overflow-wrap:anywhere;margin-bottom:0.4mm">Mã: {{std?.internal_id || 'Chưa có mã'}}</div>
                       @if (printIncludeName()) {
                           <div style="font-weight: 800; margin-bottom: 0.4mm; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
                                [style.font-size.pt]="fontSize + 1.2">
                               {{ std?.name }}
                           </div>
                       }

                       @if (printTemplate() === 'detailed') {
                           @if (printIncludeCas() || printIncludeManufacturer()) {
                               <div style="display: flex; justify-content: space-between; margin-bottom: 0.1mm; overflow: hidden; white-space: nowrap; width: 100%;">
                                   @if (printIncludeCas()) { <span style="text-overflow: ellipsis; overflow: hidden; flex: 1;">CAS: <span style="font-weight: bold;">{{ std?.cas_number || 'N/A' }}</span></span> }
                                   @if (printIncludeManufacturer()) { <span style="text-overflow: ellipsis; overflow: hidden; flex-shrink: 0; margin-left: 1mm;">Mfr: <span style="font-weight: bold;">{{ std?.manufacturer || 'N/A' }}</span></span> }
                               </div>
                           }
                       }

                       @if (printIncludeLot() || printIncludePurity()) {
                           <div style="display: flex; justify-content: space-between; margin-bottom: 0.1mm; overflow: hidden; white-space: nowrap; width: 100%;">
                               @if (printIncludeLot()) { <span style="text-overflow: ellipsis; overflow: hidden; flex: 1;">Lô: <span style="font-weight: bold;">{{ std?.lot_number || 'N/A' }}</span></span> }
                               @if (printIncludePurity()) { <span style="text-overflow: ellipsis; overflow: hidden; flex-shrink: 0; margin-left: 1mm;">Pur: <span style="font-weight: bold;">{{ std?.purity || 'N/A' }}</span></span> }
                           </div>
                       }

                       @if (printIncludeOpened() || printIncludeExpiry()) {
                           <div style="display: flex; justify-content: space-between; margin-bottom: 0.1mm; overflow: hidden; white-space: nowrap; width: 100%;">
                               @if (printIncludeOpened()) { <span style="text-overflow: ellipsis; overflow: hidden; flex: 1;">Opn: <span style="font-weight: bold;">{{ std?.date_opened ? (std?.date_opened | date:'dd/MM/yy') : '__/__/__' }}</span></span> }
                               @if (printIncludeExpiry()) { <span style="text-overflow: ellipsis; overflow: hidden; flex-shrink: 0; margin-left: 1mm;">Exp: <span style="font-weight: bold;">{{ std?.expiry_date ? (std?.expiry_date | date:'dd/MM/yy') : 'N/A' }}</span></span> }
                           </div>
                       }

                       @if (printIncludeStorage()) {
                           <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%;">
                               Store: <span style="font-weight: bold;">{{ std?.storage_condition || 'N/A' }}</span>
                           </div>
                       }
                   </div>
               }
          </div>
      </ng-template>

      <!-- Hidden DOM for Print Reference (Supports multi-standard cloning) -->
      <div id="print-reference-container" style="display: none;">
          @for (stdItem of standardsToPrint(); track stdItem.id) {
              <div [attr.id]="'print-ref-' + stdItem.id">
                  <ng-container *ngTemplateOutlet="labelTemplate; context: { std: stdItem, fontSize: printLayoutMode() === 'roll' ? printFontSize() : getGridPreset().fontSize, width: printLayoutMode() === 'roll' ? printWidth() : getGridPreset().width, height: printLayoutMode() === 'roll' ? printHeight() : getGridPreset().height, isPrint: true }"></ng-container>
              </div>
          }
      </div>
  `,
  styles: [`
    @media print {
        @page {
            margin: 0 !important;
            padding: 0 !important;
        }
        body, html {
            margin: 0 !important;
            padding: 0 !important;
            background-color: white !important;
            width: 100% !important;
            height: 100% !important;
            overflow: hidden !important;
        }
        body > *:not(#print-area) { display: none !important; }
        #print-area { display: block !important; }
    }
  `]
})
export class StandardsPrintModalComponent implements OnDestroy {
  private destroyed = false;
  private controller?: AbortController;
  ngOnDestroy(): void { this.destroyed = true; this.controller?.abort(); }
  std = input<ReferenceStandard | null>(null);
  standards = input<ReferenceStandard[]>([]);
  isOpen = input<boolean>(false);
  closeModal = output<void>();

  // ---- DUAL MODE PRINT SETTINGS ----
  printLayoutMode = signal<'roll' | 'grid'>('roll');
  printPaperSize = signal('62x29_ql800');
  printWidth = signal(62);
  printHeight = signal(29);
  printTemplate = signal('detailed');
  printCopies = signal(1);
  printFontSize = signal(7);
  Math = Math;

  // A4 Grid settings
  a4PaperType = signal<'fullsheet' | 'precut'>('fullsheet'); // Default to A4 full sticker sheets
  gridPreset = signal<string>('tomy_145');
  gridStartIndex = signal<number>(1);

  // Fullsheet specific settings
  fullSheetPreset = signal<'large' | 'medium' | 'small' | 'custom'>('medium');
  fullSheetCols = signal<number>(4);
  fullSheetRows = signal<number>(8);
  printShowCropMarks = signal<boolean>(true); // Cutting guide lines

  // Toggleable Print Fields
  readonly printBusy = signal(false);
  readonly printError = signal<string | null>(null);
  printIncludeName = signal(true);
  printIncludeLot = signal(true);
  printIncludePurity = signal(true);
  printIncludeOpened = signal(true);
  printIncludeExpiry = signal(true);
  printIncludeStorage = signal(true);
  printIncludeManufacturer = signal(true);
  printIncludeCas = signal(true);

  standardsToPrint = computed(() => {
    const list = this.standards();
    if (list && list.length > 0) return list;
    const single = this.std();
    return single ? [single] : [];
  });

  printModalTitle = computed(() =>
    this.standardsToPrint().length > 1 ? 'In hàng loạt nhãn' : 'Cài đặt in nhãn'
  );

  printModalDescription = computed(() => {
    const standards = this.standardsToPrint();
    if (standards.length > 1) {
      return `Đã chọn ${standards.length} chất chuẩn để in`;
    }
    return standards[0]?.name || 'Chưa chọn chất chuẩn';
  });

  // Pre-cut Presets mapping (Tomy)
  GRID_PRESETS = STANDARD_GRID_PRESETS;
  ROLL_PRESETS = STANDARD_ROLL_PRESETS;

  showOverflowWarning = computed(() => {
    const height = this.printLayoutMode() === 'roll' ? this.printHeight() : this.getGridPreset().height;
    const activeFieldsCount =
      (this.printIncludeName() ? 1 : 0) +
      (this.printIncludeLot() ? 1 : 0) +
      (this.printIncludePurity() ? 1 : 0) +
      (this.printIncludeOpened() ? 1 : 0) +
      (this.printIncludeExpiry() ? 1 : 0) +
      (this.printIncludeStorage() ? 1 : 0) +
      (this.printIncludeManufacturer() ? 1 : 0) +
      (this.printIncludeCas() ? 1 : 0);
    return height < 20 && activeFieldsCount > 4;
  });

  onClose() {
    if (this.printBusy()) return;
    this.closeModal.emit();
  }

  getGridPreset(): GridPreset {
    if (this.printLayoutMode() === 'grid' && this.a4PaperType() === 'fullsheet') {
      const presetType = this.fullSheetPreset();
      let cols = 4;
      let rows = 8;
      let fontSize = 6.5;

      if (presetType === 'large') {
        cols = 3;
        rows = 6;
        fontSize = 8;
      } else if (presetType === 'small') {
        cols = 5;
        rows = 12;
        fontSize = 5;
      } else if (presetType === 'custom') {
        cols = Math.max(1, this.fullSheetCols() || 4);
        rows = Math.max(1, this.fullSheetRows() || 8);
        const estHeight = (277 - (rows - 1) * 1.5) / rows;
        fontSize = estHeight < 16 ? 4.5 : estHeight < 25 ? 6 : 7.5;
      }

      const margin = 10; // 10mm safe print border
      const gap = 1.5;   // 1.5mm space between stickers

      const width = (210 - (margin * 2) - (cols - 1) * gap) / cols;
      const height = (297 - (margin * 2) - (rows - 1) * gap) / rows;

      return {
        id: `fullsheet_calculated_${cols}x${rows}`,
        name: `Nguyên tấm tự cắt (${cols}x${rows})`,
        rows: rows,
        cols: cols,
        width: Number(width.toFixed(1)),
        height: Number(height.toFixed(1)),
        topMargin: margin,
        leftMargin: margin,
        rowGap: gap,
        colGap: gap,
        fontSize: fontSize
      };
    }

    // Default pre-cut presets (Tomy)
    return this.GRID_PRESETS[this.gridPreset()] || this.GRID_PRESETS['tomy_145'];
  }

  getGridSlots(): number[] {
    const preset = this.getGridPreset();
    const totalSlots = preset.rows * preset.cols;
    const slots: number[] = [];
    for (let i = 1; i <= totalSlots; i++) {
      slots.push(i);
    }
    return slots;
  }

  getRequiredA4Sheets(): number {
    const preset = this.getGridPreset();
    const totalSlots = (this.gridStartIndex() - 1) + (this.standardsToPrint().length * this.printCopies());
    const labelsPerPage = preset.rows * preset.cols;
    return Math.ceil(totalSlots / labelsPerPage);
  }

  getStandardForSlot(slotIndex: number): ReferenceStandard | null {
    const startIndex = this.gridStartIndex();
    const copies = this.printCopies();
    const list = this.standardsToPrint();

    if (slotIndex < startIndex || slotIndex >= startIndex + (list.length * copies)) {
      return null;
    }
    const relativeIndex = slotIndex - startIndex;
    const stdIndex = Math.floor(relativeIndex / copies);
    return list[stdIndex] || null;
  }

  onPaperSizeChange(size: string) {
    this.printPaperSize.set(size);
    if (size === 'custom') return;
    const preset = this.ROLL_PRESETS[size];
    if (preset) {
        this.printWidth.set(preset.width);
        this.printHeight.set(preset.height);
        this.printFontSize.set(preset.fontSize);
    }
  }

  onGridPresetChange(presetId: string) {
    this.gridPreset.set(presetId);
    this.gridStartIndex.set(1);
  }

  onFullSheetPresetChange(preset: 'large' | 'medium' | 'small' | 'custom') {
    this.fullSheetPreset.set(preset);
    this.gridStartIndex.set(1);
    if (preset === 'large') {
      this.fullSheetCols.set(3);
      this.fullSheetRows.set(6);
    } else if (preset === 'medium') {
      this.fullSheetCols.set(4);
      this.fullSheetRows.set(8);
    } else if (preset === 'small') {
      this.fullSheetCols.set(5);
      this.fullSheetRows.set(12);
    }
  }

  onStartIndexInputChange(val: number) {
    const maxVal = this.getGridPreset().rows * this.getGridPreset().cols;
    this.gridStartIndex.set(Math.max(1, Math.min(maxVal, val || 1)));
  }

  onTemplateChange(template: string) {
    this.printTemplate.set(template);
    if (template === 'standard') {
        this.printIncludeManufacturer.set(false);
        this.printIncludeCas.set(false);
    } else if (template === 'detailed') {
        this.printIncludeManufacturer.set(true);
        this.printIncludeCas.set(true);
    } else if (template === 'qr') {
        this.printIncludeManufacturer.set(false);
        this.printIncludeCas.set(false);
        const currentH = this.printLayoutMode() === 'roll' ? this.printHeight() : this.getGridPreset().height;
        if (currentH <= 15) {
            this.printIncludeStorage.set(false);
            this.printIncludeOpened.set(false);
        }
    }
  }

  getPreviewScale(): number {
    const currentW = this.printWidth();
    if (currentW <= 25) return 3.5;
    if (currentW <= 40) return 2.6;
    if (currentW <= 62) return 2.0;
    return 1.4;
  }

  async printLabel() {
    if (this.printBusy()) return;
    this.printError.set(null);
    if (this.printLayoutMode() === 'grid') {
      const preset = this.getGridPreset();
      const error = labelSheetError({width:preset.width,height:preset.height,cols:preset.cols,rows:preset.rows,left:preset.leftMargin,top:preset.topMargin,gapX:preset.colGap,gapY:preset.rowGap});
      if (error) { this.printError.set(error); return; }
    }
    const list = this.standardsToPrint();
    const copies = this.printCopies();
    if (list.length === 0) return;
    if (!Number.isInteger(copies) || copies < 1) { this.printError.set('Số bản sao phải là số nguyên lớn hơn 0.'); return; }
    this.printBusy.set(true);
    try {
      const references = list.map(item => document.getElementById('print-ref-' + item.id));
      if (references.some(ref => !ref)) throw new Error('Thiếu nội dung một nhãn. Vui lòng mở lại preview.');
      await Promise.all(references.map(ref => waitForPrintAssets(ref!)));
    } catch (error) {
      this.printError.set(error instanceof Error ? error.message : 'Nhãn chưa sẵn sàng.');
      this.printBusy.set(false);
      return;
    }
    if (this.destroyed) { this.printBusy.set(false); return; }

    // Create print block wrapper
    const printArea = document.createElement('div');
    printArea.id = 'print-area';
    printArea.style.position = 'fixed';
    printArea.style.top = '0';
    printArea.style.left = '0';
    printArea.style.width = '100%';
    printArea.style.height = '100%';
    printArea.style.zIndex = '9999999';
    printArea.style.backgroundColor = 'white';

    if (this.printLayoutMode() === 'roll') {
        // Roll label printer DK (Brother QL-800, Dymo...)
        printArea.style.display = 'block';

        for (const stdItem of list) {
            const ref = document.getElementById('print-ref-' + stdItem.id)?.firstElementChild;
            if (!ref) { this.printError.set('Thiếu nội dung một nhãn. Vui lòng mở lại preview.'); this.printBusy.set(false); return; }

            for (let i = 0; i < copies; i++) {
                // Wrapper element to isolate flex/grid layout page-breaking issues in Chromium
                const wrapper = document.createElement('div');
                wrapper.style.width = `${this.printWidth()}mm`;
                wrapper.style.height = `${this.printHeight()}mm`;
                wrapper.style.display = 'block';
                wrapper.style.margin = '0';
                wrapper.style.padding = '0';
                wrapper.style.pageBreakAfter = 'always';
                wrapper.style.breakAfter = 'page';
                wrapper.style.pageBreakInside = 'avoid';
                wrapper.style.breakInside = 'avoid';
                wrapper.style.overflow = 'hidden';
                wrapper.style.backgroundColor = 'white';

                const clonedNode = clonePrintContent(ref as HTMLElement);
                clonedNode.style.boxShadow = 'none';
                clonedNode.style.border = 'none';
                clonedNode.style.transform = 'none';
                clonedNode.style.width = '100%';
                clonedNode.style.height = '100%';
                clonedNode.style.margin = '0';

                wrapper.appendChild(clonedNode);
                printArea.appendChild(wrapper);
            }
        }
    } else {
        // A4 decal sheets
        const preset = this.getGridPreset();
        const labelsPerPage = preset.rows * preset.cols;
        const startIndex = this.gridStartIndex();

        // Form sequential label printing queue
        const labelQueue: ReferenceStandard[] = [];
        for (const stdItem of list) {
            for (let c = 0; c < copies; c++) {
                labelQueue.push(stdItem);
            }
        }

        const totalSlots = (startIndex - 1) + labelQueue.length;
        const totalPages = Math.ceil(totalSlots / labelsPerPage);
        let queueIndex = 0;

        for (let p = 0; p < totalPages; p++) {
            // Wrapper to ensure Chromium honors page breaks for grid elements
            const wrapper = document.createElement('div');
            wrapper.style.width = '210mm';
            wrapper.style.height = '297mm';
            wrapper.style.display = 'block';
            wrapper.style.margin = '0';
            wrapper.style.padding = '0';
            wrapper.style.pageBreakAfter = 'always';
            wrapper.style.breakAfter = 'page';
            wrapper.style.pageBreakInside = 'avoid';
            wrapper.style.breakInside = 'avoid';
            wrapper.style.overflow = 'hidden';
            wrapper.style.backgroundColor = 'white';

            const pageEl = document.createElement('div');
            pageEl.style.width = '210mm';
            pageEl.style.height = '297mm';
            pageEl.style.boxSizing = 'border-box';
            pageEl.style.paddingTop = `${preset.topMargin}mm`;
            pageEl.style.paddingLeft = `${preset.leftMargin}mm`;
            pageEl.style.display = 'grid';
            pageEl.style.gridTemplateColumns = `repeat(${preset.cols}, ${preset.width}mm)`;
            pageEl.style.gridAutoRows = `${preset.height}mm`;
            pageEl.style.rowGap = `${preset.rowGap}mm`;
            pageEl.style.columnGap = `${preset.colGap}mm`;
            pageEl.style.backgroundColor = 'white';
            pageEl.style.overflow = 'hidden';

            if (p === 0) {
                // First page: insert empty spaces up to startIndex - 1
                for (let s = 1; s < startIndex; s++) {
                    const spacer = document.createElement('div');
                    spacer.style.width = `${preset.width}mm`;
                    spacer.style.height = `${preset.height}mm`;
                    spacer.style.visibility = 'hidden';
                    pageEl.appendChild(spacer);
                }

                // Add labels for page 1
                const firstPageSlotsAvailable = labelsPerPage - (startIndex - 1);
                const firstPageLabels = Math.min(labelQueue.length, firstPageSlotsAvailable);
                for (let c = 0; c < firstPageLabels; c++) {
                    const stdItem = labelQueue[queueIndex++];
                    const ref = document.getElementById('print-ref-' + stdItem.id)?.firstElementChild;
                    if (!ref) { this.printError.set('Thiếu nội dung một nhãn. Vui lòng mở lại preview.'); this.printBusy.set(false); return; }

                    const clone = clonePrintContent(ref as HTMLElement);
                    clone.style.boxShadow = 'none';
                    clone.style.width = `${preset.width}mm`;
                    clone.style.height = `${preset.height}mm`;

                    // Inject crop borders if fullsheet and crop marks enabled
                    if (this.a4PaperType() === 'fullsheet') {
                        if (this.printShowCropMarks()) {
                            clone.style.border = '0.3mm dashed #cbd5e1';
                        } else {
                            clone.style.border = 'none';
                        }
                    } else {
                        clone.style.border = 'none';
                    }

                    pageEl.appendChild(clone);
                }
            } else {
                // Subsequent pages
                const remaining = labelQueue.length - queueIndex;
                const pageKLabels = Math.min(remaining, labelsPerPage);

                for (let c = 0; c < pageKLabels; c++) {
                    const stdItem = labelQueue[queueIndex++];
                    const ref = document.getElementById('print-ref-' + stdItem.id)?.firstElementChild;
                    if (!ref) { this.printError.set('Thiếu nội dung một nhãn. Vui lòng mở lại preview.'); this.printBusy.set(false); return; }

                    const clone = clonePrintContent(ref as HTMLElement);
                    clone.style.boxShadow = 'none';
                    clone.style.width = `${preset.width}mm`;
                    clone.style.height = `${preset.height}mm`;

                    if (this.a4PaperType() === 'fullsheet') {
                        if (this.printShowCropMarks()) {
                            clone.style.border = '0.3mm dashed #cbd5e1';
                        } else {
                            clone.style.border = 'none';
                        }
                    } else {
                        clone.style.border = 'none';
                    }

                    pageEl.appendChild(clone);
                }
            }

            wrapper.appendChild(pageEl);
            printArea.appendChild(wrapper);
        }
    }

    this.printBusy.set(true);
    printArea.style.height = 'auto';
    document.body.appendChild(printArea);

    const style = document.createElement('style');
    style.id = 'print-style';

    if (this.printLayoutMode() === 'roll') {
        style.textContent = `
            @media print {
                @page { size: ${this.printWidth()}mm ${this.printHeight()}mm; margin: 0; }
                #print-area { display: block !important; }
                body, html {
                    margin: 0 !important;
                    padding: 0 !important;
                    overflow: visible !important;
                    background-color: white !important;
                }
                body > *:not(#print-area) { display: none !important; }
                #print-reference-container, #print-preview-container {
                    display: none !important;
                    visibility: hidden !important;
                    height: 0 !important;
                    overflow: hidden !important;
                }
            }
        `;
    } else {
        style.textContent = `
            @media print {
                @page { size: A4 portrait; margin: 0; }
                #print-area { display: block !important; }
                body, html {
                    margin: 0 !important;
                    padding: 0 !important;
                    overflow: visible !important;
                    background-color: white !important;
                }
                body > *:not(#print-area) { display: none !important; }
                #print-reference-container, #print-preview-container {
                    display: none !important;
                    visibility: hidden !important;
                    height: 0 !important;
                    overflow: hidden !important;
                }
            }
        `;
    }
    style.textContent += '@media print{html,body{width:auto !important;height:auto !important;overflow:visible !important}#print-area{position:relative !important;inset:auto !important;width:auto !important;height:auto !important;overflow:visible !important}#print-area>div:last-child{break-after:auto !important;page-break-after:auto !important}}';
    document.head.appendChild(style);

    try {
      await waitForPrintAssets(printArea);
      this.controller = new AbortController();
      if (this.destroyed) this.controller.abort();
      await printWithCleanup(window, () => { printArea.remove(); style.remove(); }, this.controller.signal);
    } catch (error) {
      this.printError.set(error instanceof Error ? error.message : 'Không mở được bản in.');
    } finally { printArea.remove(); style.remove(); this.controller = undefined; this.printBusy.set(false); }
  }
}
