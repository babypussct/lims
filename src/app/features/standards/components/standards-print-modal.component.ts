import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReferenceStandard } from '../../../core/models/standard.model';

interface GridPreset {
  id: string;
  name: string;
  rows: number;
  cols: number;
  width: number;       // width of label in mm
  height: number;      // height of label in mm
  topMargin: number;   // top margin of sheet in mm
  leftMargin: number;  // left margin of sheet in mm
  rowGap: number;      // vertical space between labels in mm
  colGap: number;      // horizontal space between labels in mm
  fontSize: number;    // default font size in pt
}

interface RollPreset {
  id: string;
  name: string;
  width: number;
  height: number;
  fontSize: number;
}

@Component({
  selector: 'app-standards-print-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
      @if (isOpen()) {
          <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm fade-in">
             <div class="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-5xl flex overflow-hidden animate-bounce-in max-h-[95vh] border border-slate-100 dark:border-slate-800">
                 <!-- Left: Settings -->
                 <div class="w-1/2 p-8 border-r border-slate-100 dark:border-slate-800 overflow-y-auto custom-scrollbar flex flex-col justify-between">
                     <div>
                         <div class="flex items-center gap-3 mb-6">
                             <div class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-inner">
                                 <i class="fa-solid fa-print text-lg animate-pulse"></i>
                             </div>
                             <div>
                                 <h3 class="font-black text-xl text-slate-800 dark:text-slate-100 leading-tight">Cài Đặt In Nhãn</h3>
                                 <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 break-words max-w-[340px]" [title]="std()?.name">{{std()?.name}}</p>
                             </div>
                         </div>

                         <!-- Segmented Control for Layout Mode -->
                         <div class="flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl mb-6 border border-slate-200/40 dark:border-slate-700/30">
                             <button (click)="printLayoutMode.set('roll')" 
                                     [class.bg-white]="printLayoutMode() === 'roll'" 
                                     [class.dark:bg-slate-700]="printLayoutMode() === 'roll'" 
                                     [class.shadow-sm]="printLayoutMode() === 'roll'" 
                                     [class.text-indigo-650]="printLayoutMode() === 'roll'"
                                     [class.dark:text-indigo-400]="printLayoutMode() === 'roll'"
                                     class="flex-1 py-2 text-center text-xs font-black rounded-xl transition-all duration-300 text-slate-600 dark:text-slate-400 hover:text-slate-800">
                                 <i class="fa-solid fa-scroll mr-1.5"></i> In Cuộn (Brother QL)
                             </button>
                             <button (click)="printLayoutMode.set('grid')" 
                                     [class.bg-white]="printLayoutMode() === 'grid'" 
                                     [class.dark:bg-slate-700]="printLayoutMode() === 'grid'" 
                                     [class.shadow-sm]="printLayoutMode() === 'grid'" 
                                     [class.text-indigo-650]="printLayoutMode() === 'grid'"
                                     [class.dark:text-indigo-400]="printLayoutMode() === 'grid'"
                                     class="flex-1 py-2 text-center text-xs font-black rounded-xl transition-all duration-300 text-slate-600 dark:text-slate-400 hover:text-slate-800">
                                 <i class="fa-solid fa-grip mr-1.5"></i> In Tấm A4 Decal
                             </button>
                         </div>
                         
                         <div class="space-y-5">
                             <!-- Template Selection -->
                             <div>
                                 <label class="block text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Mẫu hiển thị</label>
                                 <div class="grid grid-cols-3 gap-2">
                                     <button (click)="onTemplateChange('standard')" [ngClass]="{'ring-2 ring-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-transparent': printTemplate() === 'standard', 'border-slate-200 dark:border-slate-800': printTemplate() !== 'standard'}" class="p-3 border rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition duration-200">
                                         <div class="font-extrabold text-xs text-slate-700 dark:text-slate-200 mb-0.5">Tiêu chuẩn</div>
                                         <div class="text-[9px] text-slate-400 dark:text-slate-500 leading-tight">Thông tin cơ bản</div>
                                     </button>
                                     <button (click)="onTemplateChange('detailed')" [ngClass]="{'ring-2 ring-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-transparent': printTemplate() === 'detailed', 'border-slate-200 dark:border-slate-800': printTemplate() !== 'detailed'}" class="p-3 border rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition duration-200">
                                         <div class="font-extrabold text-xs text-slate-700 dark:text-slate-200 mb-0.5">Chi tiết</div>
                                         <div class="text-[9px] text-slate-400 dark:text-slate-500 leading-tight">Đầy đủ thông tin</div>
                                     </button>
                                     <button (click)="onTemplateChange('qr')" [ngClass]="{'ring-2 ring-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-transparent': printTemplate() === 'qr', 'border-slate-200 dark:border-slate-800': printTemplate() !== 'qr'}" class="p-3 border rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition duration-200">
                                         <div class="font-extrabold text-xs text-slate-700 dark:text-slate-200 mb-0.5">Kèm mã QR</div>
                                         <div class="text-[9px] text-slate-400 dark:text-slate-500 leading-tight">Quét truy xuất nhanh</div>
                                     </button>
                                 </div>
                             </div>

                             <!-- Dimensions Selection based on Mode -->
                             <div>
                                 <label class="block text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Kích thước nhãn</label>
                                 
                                 @if (printLayoutMode() === 'roll') {
                                     <select [ngModel]="printPaperSize()" (ngModelChange)="onPaperSizeChange($event)" class="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/50 transition mb-3">
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
                                                 <input type="number" [ngModel]="printWidth()" (ngModelChange)="printWidth.set($event)" class="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/50">
                                             </div>
                                             <div>
                                                 <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Cao (mm)</label>
                                                 <input type="number" [ngModel]="printHeight()" (ngModelChange)="printHeight.set($event)" class="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/50">
                                             </div>
                                             <div>
                                                 <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Font (pt)</label>
                                                 <input type="number" [ngModel]="printFontSize()" (ngModelChange)="printFontSize.set($event)" class="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/50">
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
                                                 [class.text-indigo-600]="a4PaperType() === 'fullsheet'"
                                                 [class.dark:text-indigo-400]="a4PaperType() === 'fullsheet'"
                                                 class="flex-1 py-1.5 text-center text-[10px] font-extrabold rounded-lg transition-all duration-200 text-slate-500 hover:text-slate-800">
                                             Nguyên tấm tự cắt (Khuyên dùng)
                                         </button>
                                         <button (click)="a4PaperType.set('precut')"
                                                 [class.bg-white]="a4PaperType() === 'precut'"
                                                 [class.dark:bg-slate-700]="a4PaperType() === 'precut'"
                                                 [class.shadow-sm]="a4PaperType() === 'precut'"
                                                 [class.text-indigo-600]="a4PaperType() === 'precut'"
                                                 [class.dark:text-indigo-400]="a4PaperType() === 'precut'"
                                                 class="flex-1 py-1.5 text-center text-[10px] font-extrabold rounded-lg transition-all duration-200 text-slate-500 hover:text-slate-800">
                                             Chia ô sẵn (Tomy)
                                         </button>
                                     </div>
                                     
                                     @if (a4PaperType() === 'fullsheet') {
                                         <!-- Full sheet configurations -->
                                         <select [ngModel]="fullSheetPreset()" (ngModelChange)="onFullSheetPresetChange($event)" class="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/50 transition mb-3">
                                             <option value="medium">Lưới thông dụng 4x8 (32 nhãn - ~46x33 mm)</option>
                                             <option value="large">Lưới nhãn lớn 3x6 (18 nhãn - ~62x45 mm)</option>
                                             <option value="small">Lưới nhãn phụ 5x12 (60 nhãn - ~36x21 mm)</option>
                                             <option value="custom">Tự cấu hình hàng & cột...</option>
                                         </select>
                                         
                                         @if (fullSheetPreset() === 'custom') {
                                             <div class="grid grid-cols-2 gap-3 mb-3 animate-fade-in">
                                                 <div>
                                                     <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Số cột (Cols)</label>
                                                     <input type="number" [ngModel]="fullSheetCols()" (ngModelChange)="fullSheetCols.set($event)" class="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/50">
                                                 </div>
                                                 <div>
                                                     <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Số dòng (Rows)</label>
                                                     <input type="number" [ngModel]="fullSheetRows()" (ngModelChange)="fullSheetRows.set($event)" class="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/50">
                                                 </div>
                                             </div>
                                         }
                                         
                                         <!-- Crop mark checkbox -->
                                         <label class="flex items-center gap-2 cursor-pointer group mb-3">
                                             <input type="checkbox" [ngModel]="printShowCropMarks()" (ngModelChange)="printShowCropMarks.set($event)" class="w-4 h-4 text-indigo-600 rounded border-slate-350 dark:border-slate-700 focus:ring-indigo-500 bg-white dark:bg-slate-800">
                                             <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">Hiển thị đường viền hướng dẫn cắt (Crop Marks)</span>
                                         </label>
                                     } @else {
                                         <select [ngModel]="gridPreset()" (ngModelChange)="onGridPresetChange($event)" class="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/50 transition">
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
                                                 <button (click)="gridStartIndex.set(Math.max(1, gridStartIndex() - 1))" class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs"><i class="fa-solid fa-minus"></i></button>
                                                 <input type="number" [ngModel]="gridStartIndex()" (ngModelChange)="onStartIndexInputChange($event)" min="1" [max]="getGridPreset().rows * getGridPreset().cols" class="w-12 text-center bg-transparent border-none font-bold text-xs p-0 text-slate-800 dark:text-slate-100 focus:ring-0">
                                                 <button (click)="gridStartIndex.set(Math.min(getGridPreset().rows * getGridPreset().cols, gridStartIndex() + 1))" class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 text-slate-650 dark:text-slate-300 flex items-center justify-center text-xs"><i class="fa-solid fa-plus"></i></button>
                                             </div>
                                         </div>
                                         
                                         <!-- Estimated A4 sheets info badge -->
                                         <div class="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100/50 dark:border-indigo-900/30 text-[10px] text-indigo-700 dark:text-indigo-300 flex flex-col justify-center animate-fade-in">
                                             <div class="flex justify-between mb-0.5">
                                                 <span>Vị trí bắt đầu:</span>
                                                 <span class="font-extrabold text-indigo-650 dark:text-indigo-400">Ô số {{ gridStartIndex() }}</span>
                                             </div>
                                             <div class="flex justify-between border-t border-indigo-100/55 dark:border-indigo-900/30 pt-1 font-bold">
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
                                         <input type="checkbox" [ngModel]="printIncludeName()" (ngModelChange)="printIncludeName.set($event)" class="w-4 h-4 text-indigo-600 rounded border-slate-350 dark:border-slate-700 focus:ring-indigo-500 bg-white dark:bg-slate-800">
                                         <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">Tên chuẩn</span>
                                     </label>
                                     <label class="flex items-center gap-2 cursor-pointer group">
                                         <input type="checkbox" [ngModel]="printIncludeLot()" (ngModelChange)="printIncludeLot.set($event)" class="w-4 h-4 text-indigo-600 rounded border-slate-350 dark:border-slate-700 focus:ring-indigo-500 bg-white dark:bg-slate-800">
                                         <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">Số Lot</span>
                                     </label>
                                     <label class="flex items-center gap-2 cursor-pointer group">
                                         <input type="checkbox" [ngModel]="printIncludePurity()" (ngModelChange)="printIncludePurity.set($event)" class="w-4 h-4 text-indigo-600 rounded border-slate-350 dark:border-slate-700 focus:ring-indigo-500 bg-white dark:bg-slate-800">
                                         <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">Độ tinh khiết</span>
                                     </label>
                                     <label class="flex items-center gap-2 cursor-pointer group">
                                         <input type="checkbox" [ngModel]="printIncludeOpened()" (ngModelChange)="printIncludeOpened.set($event)" class="w-4 h-4 text-indigo-600 rounded border-slate-350 dark:border-slate-700 focus:ring-indigo-500 bg-white dark:bg-slate-800">
                                         <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">Ngày mở nắp</span>
                                     </label>
                                     <label class="flex items-center gap-2 cursor-pointer group">
                                         <input type="checkbox" [ngModel]="printIncludeExpiry()" (ngModelChange)="printIncludeExpiry.set($event)" class="w-4 h-4 text-indigo-600 rounded border-slate-350 dark:border-slate-700 focus:ring-indigo-500 bg-white dark:bg-slate-800">
                                         <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">Hạn sử dụng</span>
                                     </label>
                                     <label class="flex items-center gap-2 cursor-pointer group">
                                         <input type="checkbox" [ngModel]="printIncludeStorage()" (ngModelChange)="printIncludeStorage.set($event)" class="w-4 h-4 text-indigo-600 rounded border-slate-350 dark:border-slate-700 focus:ring-indigo-500 bg-white dark:bg-slate-800">
                                         <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">Đk bảo quản</span>
                                     </label>
                                     <label class="flex items-center gap-2 cursor-pointer group">
                                         <input type="checkbox" [ngModel]="printIncludeManufacturer()" (ngModelChange)="printIncludeManufacturer.set($event)" class="w-4 h-4 text-indigo-600 rounded border-slate-350 dark:border-slate-700 focus:ring-indigo-500 bg-white dark:bg-slate-800">
                                         <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">Hãng sản xuất</span>
                                     </label>
                                     <label class="flex items-center gap-2 cursor-pointer group">
                                         <input type="checkbox" [ngModel]="printIncludeCas()" (ngModelChange)="printIncludeCas.set($event)" class="w-4 h-4 text-indigo-600 rounded border-slate-350 dark:border-slate-700 focus:ring-indigo-500 bg-white dark:bg-slate-800">
                                         <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">Chỉ số CAS</span>
                                     </label>
                                 </div>
                                 
                                 <!-- Overflow Warning for Small Labels -->
                                 @if (showOverflowWarning()) {
                                     <div class="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-250 dark:border-amber-900/40 text-[11px] text-amber-700 dark:text-amber-400 mt-2.5 flex gap-2">
                                         <i class="fa-solid fa-triangle-exclamation mt-0.5 flex-shrink-0 animate-bounce"></i>
                                         <span><strong>Lưu ý:</strong> Cỡ nhãn nhỏ dán nhiều thông tin có thể bị tràn hoặc đè chữ. Bạn nên tắt bớt trường không quá quan trọng.</span>
                                     </div>
                                 }
                             </div>

                             <!-- Copies -->
                             <div class="flex items-center justify-between">
                                 <div>
                                     <label class="block text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Số bản in nhãn</label>
                                     <span class="text-[10px] text-slate-400 leading-none">Tổng cộng: {{ printCopies() }} nhãn chuẩn</span>
                                 </div>
                                 <div class="flex items-center gap-1.5 p-1 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl">
                                     <button (click)="printCopies.set(Math.max(1, printCopies() - 1))" class="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center transition shadow-sm border border-slate-250/20"><i class="fa-solid fa-minus text-xs"></i></button>
                                     <input type="number" [ngModel]="printCopies()" (ngModelChange)="printCopies.set(Math.max(1, $event))" min="1" class="w-12 text-center border-none bg-transparent font-black text-slate-800 dark:text-slate-200 focus:ring-0 p-0 text-sm">
                                     <button (click)="printCopies.set(printCopies() + 1)" class="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center transition shadow-sm border border-slate-250/20"><i class="fa-solid fa-plus text-xs"></i></button>
                                 </div>
                             </div>
                         </div>
                     </div>
                     
                     <div class="flex justify-between items-center mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                         <button (click)="onClose()" class="px-5 py-2.5 text-slate-500 dark:text-slate-400 font-extrabold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition">Hủy bỏ</button>
                         <button (click)="printLabel()" class="px-8 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-500 dark:to-violet-500 text-white font-extrabold text-xs rounded-xl hover:shadow-lg hover:opacity-95 shadow-md shadow-indigo-150 dark:shadow-none transition flex items-center gap-2">
                             <i class="fa-solid fa-print"></i> Tiến Hành In Nhãn ({{printCopies()}})
                         </button>
                     </div>
                 </div>

                 <!-- Right: Preview -->
                 <div class="w-1/2 bg-slate-50 dark:bg-slate-900/50 p-8 flex flex-col items-center justify-center relative min-h-[500px]" id="print-preview-container">
                     <div class="absolute top-4 left-4 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-2">
                         <i class="fa-solid fa-eye animate-pulse text-indigo-500"></i> Bản Xem Trước Trực Quan
                     </div>
                     
                     @if (printLayoutMode() === 'roll') {
                         <!-- Single Label Preview (Roll) -->
                         <div class="bg-white shadow-xl border border-slate-300/60 dark:border-slate-700/30 flex flex-col justify-center text-black overflow-hidden relative print-content"
                              [style.width.mm]="printWidth()"
                              [style.height.mm]="printHeight()"
                              [style.transform]="'scale(' + getPreviewScale() + ')'"
                              style="transform-origin: center center; transition: all 0.3s ease;">
                              <ng-container *ngTemplateOutlet="labelTemplate; context: { fontSize: printFontSize(), width: printWidth(), height: printHeight(), isPrint: false }"></ng-container>
                         </div>
                     } @else {
                         <!-- Grid Mode Preview -->
                         <div class="w-full flex flex-col items-center gap-2 animate-fade-in">
                             <!-- Single Label Zoomed (so user can read the text) -->
                             <div class="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider self-start flex items-center gap-1.5">
                                 <i class="fa-solid fa-magnifying-glass-plus text-indigo-500"></i> Độ nét thực tế nhãn đơn
                             </div>
                             
                             <div class="bg-white shadow-xl border border-slate-350 overflow-hidden relative"
                                  [style.width.mm]="getGridPreset().width"
                                  [style.height.mm]="getGridPreset().height"
                                  [style.transform]="'scale(' + (getGridPreset().width <= 40 ? 2.5 : 1.9) + ')'"
                                  style="transform-origin: center center; margin: 15px 0;">
                                  <ng-container *ngTemplateOutlet="labelTemplate; context: { fontSize: getGridPreset().fontSize, width: getGridPreset().width, height: getGridPreset().height, isPrint: false }"></ng-container>
                             </div>
                             
                             <!-- A4 Layout Sheet -->
                             <div class="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider self-start flex items-center gap-1.5 mt-3 w-full justify-between">
                                 <span class="flex items-center gap-1.5"><i class="fa-solid fa-file-lines text-indigo-500"></i> Mô phỏng tấm A4 Decal</span>
                                 <span class="text-indigo-500 dark:text-indigo-400 font-bold normal-case text-[9px] cursor-pointer hover:underline">(Click để đổi điểm bắt đầu)</span>
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
                                                   <div (click)="gridStartIndex.set(slotIndex)"
                                                        title="Click để chọn làm ô bắt đầu"
                                                        class="border border-dashed border-slate-250 bg-slate-100 flex items-center justify-center text-[10px] text-slate-350 cursor-pointer hover:bg-indigo-50/50 hover:border-indigo-300 transition-all"
                                                        style="box-sizing: border-box;">
                                                        {{ slotIndex }}
                                                   </div>
                                               } @else if (slotIndex >= gridStartIndex() && slotIndex < gridStartIndex() + printCopies()) {
                                                   <!-- Printed label cell -->
                                                   <div (click)="gridStartIndex.set(slotIndex)"
                                                        title="Đang chọn in ở đây"
                                                        class="bg-indigo-50 border border-indigo-305 text-indigo-700 font-semibold cursor-pointer hover:bg-indigo-100 transition-all relative flex flex-col justify-between overflow-hidden"
                                                        style="box-sizing: border-box; padding: 1mm; line-height: 1.15;">
                                                        <div style="font-size: 7.5px; font-weight: 800; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #1e1b4b;">
                                                            {{ std()?.name }}
                                                        </div>
                                                        <div style="font-size: 5px; color: #3730a3; display: flex; justify-content: space-between;">
                                                            <span>L: {{ std()?.lot_number || 'N/A' }}</span>
                                                            <span>E: {{ std()?.expiry_date ? (std()?.expiry_date | date:'dd/MM/yy') : 'N/A' }}</span>
                                                        </div>
                                                        <div class="absolute right-0.5 bottom-0.5 bg-indigo-650 text-white rounded-[2px] text-[5px] font-bold px-0.5 flex items-center justify-center" style="transform: scale(0.85);">
                                                            {{ slotIndex }}
                                                        </div>
                                                   </div>
                                               } @else {
                                                   <!-- Unused label cell -->
                                                   <div (click)="gridStartIndex.set(slotIndex)"
                                                        title="Click để chọn làm ô bắt đầu"
                                                        class="border border-dashed border-slate-205 bg-white flex items-center justify-center text-[10px] text-slate-350 cursor-pointer hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 transition-all"
                                                        style="box-sizing: border-box;">
                                                        {{ slotIndex }}
                                                   </div>
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
          </div>
      }

      <!-- Reusable HTML Label Template -->
      <ng-template #labelTemplate let-fontSize="fontSize" let-width="width" let-height="height" let-isPrint="isPrint">
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
                                   {{ std()?.name }}
                               </div> 
                           }
                           @if (printIncludeLot()) { <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 0.1mm;">Lot: <span style="font-weight: bold;">{{ std()?.lot_number || 'N/A' }}</span></div> }
                           @if (printIncludePurity()) { <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 0.1mm;">Pur: <span style="font-weight: bold;">{{ std()?.purity || 'N/A' }}</span></div> }
                           @if (printIncludeOpened()) { <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 0.1mm;">Opn: <span style="font-weight: bold;">{{ std()?.date_opened ? (std()?.date_opened | date:'dd/MM/yy') : '__/__/__' }}</span></div> }
                           @if (printIncludeExpiry()) { <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 0.1mm;">Exp: <span style="font-weight: bold;">{{ std()?.expiry_date ? (std()?.expiry_date | date:'dd/MM/yy') : 'N/A' }}</span></div> }
                           @if (printIncludeStorage()) { <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Store: <span style="font-weight: bold;">{{ std()?.storage_condition || 'N/A' }}</span></div> }
                       </div>
                       <!-- Right QR Code Column (Dynamic width based on label height) -->
                       <div [style.width.mm]="height - 3.5" [style.height.mm]="height - 3.5" style="display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                           <img [src]="getQrCodeUrl()" style="width: 100%; height: 100%; object-fit: contain;" />
                       </div>
                   </div>
               } @else {
                   <!-- Standard or Detailed layout -->
                   <div style="display: flex; flex-direction: column; justify-content: center; height: 100%; overflow: hidden; box-sizing: border-box; width: 100%;">
                       @if (printIncludeName()) { 
                           <div style="font-weight: 800; margin-bottom: 0.4mm; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" 
                                [style.font-size.pt]="fontSize + 1.2">
                               {{ std()?.name }}
                           </div> 
                       }
                       
                       @if (printTemplate() === 'detailed') {
                           @if (printIncludeCas() || printIncludeManufacturer()) {
                               <div style="display: flex; justify-content: space-between; margin-bottom: 0.1mm; overflow: hidden; white-space: nowrap; width: 100%;">
                                   @if (printIncludeCas()) { <span style="text-overflow: ellipsis; overflow: hidden; flex: 1;">CAS: <span style="font-weight: bold;">{{ std()?.cas_number || 'N/A' }}</span></span> }
                                   @if (printIncludeManufacturer()) { <span style="text-overflow: ellipsis; overflow: hidden; flex-shrink: 0; margin-left: 1mm;">Mfr: <span style="font-weight: bold;">{{ std()?.manufacturer || 'N/A' }}</span></span> }
                               </div>
                           }
                       }

                       @if (printIncludeLot() || printIncludePurity()) {
                           <div style="display: flex; justify-content: space-between; margin-bottom: 0.1mm; overflow: hidden; white-space: nowrap; width: 100%;">
                               @if (printIncludeLot()) { <span style="text-overflow: ellipsis; overflow: hidden; flex: 1;">Lot: <span style="font-weight: bold;">{{ std()?.lot_number || 'N/A' }}</span></span> }
                               @if (printIncludePurity()) { <span style="text-overflow: ellipsis; overflow: hidden; flex-shrink: 0; margin-left: 1mm;">Pur: <span style="font-weight: bold;">{{ std()?.purity || 'N/A' }}</span></span> }
                           </div>
                       }
                       
                       @if (printIncludeOpened() || printIncludeExpiry()) {
                           <div style="display: flex; justify-content: space-between; margin-bottom: 0.1mm; overflow: hidden; white-space: nowrap; width: 100%;">
                               @if (printIncludeOpened()) { <span style="text-overflow: ellipsis; overflow: hidden; flex: 1;">Opn: <span style="font-weight: bold;">{{ std()?.date_opened ? (std()?.date_opened | date:'dd/MM/yy') : '__/__/__' }}</span></span> }
                               @if (printIncludeExpiry()) { <span style="text-overflow: ellipsis; overflow: hidden; flex-shrink: 0; margin-left: 1mm;">Exp: <span style="font-weight: bold;">{{ std()?.expiry_date ? (std()?.expiry_date | date:'dd/MM/yy') : 'N/A' }}</span></span> }
                           </div>
                       }

                       @if (printIncludeStorage()) {
                           <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%;">
                               Store: <span style="font-weight: bold;">{{ std()?.storage_condition || 'N/A' }}</span>
                           </div>
                       }
                   </div>
               }
          </div>
      </ng-template>

      <!-- Hidden DOM for Print Cloning -->
      <div id="print-reference-container" style="display: none;">
          <div class="single-print-ref">
              <ng-container *ngTemplateOutlet="labelTemplate; context: { fontSize: printLayoutMode() === 'roll' ? printFontSize() : getGridPreset().fontSize, width: printLayoutMode() === 'roll' ? printWidth() : getGridPreset().width, height: printLayoutMode() === 'roll' ? printHeight() : getGridPreset().height, isPrint: true }"></ng-container>
          </div>
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
        }
        body > *:not(#print-area) { display: none !important; }
        #print-area { display: block !important; }
    }
  `]
})
export class StandardsPrintModalComponent {
  std = input<ReferenceStandard | null>(null);
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
  a4PaperType = signal<'fullsheet' | 'precut'>('fullsheet'); // Default to full sheet stickers
  gridPreset = signal<string>('tomy_145');
  gridStartIndex = signal<number>(1);
  
  // Fullsheet specific settings
  fullSheetPreset = signal<'large' | 'medium' | 'small' | 'custom'>('medium');
  fullSheetCols = signal<number>(4);
  fullSheetRows = signal<number>(8);
  printShowCropMarks = signal<boolean>(true); // Guide borders

  // Toggleable Print Fields
  printIncludeName = signal(true);
  printIncludeLot = signal(true);
  printIncludePurity = signal(true);
  printIncludeOpened = signal(true);
  printIncludeExpiry = signal(true);
  printIncludeStorage = signal(true);
  printIncludeManufacturer = signal(true);
  printIncludeCas = signal(true);

  // Pre-cut Presets mapping (Tomy)
  GRID_PRESETS: Record<string, GridPreset> = {
    tomy_145: {
      id: 'tomy_145',
      name: 'Tomy 145 (65 nhãn - 5x13)',
      rows: 13,
      cols: 5,
      width: 38.1,
      height: 21.2,
      topMargin: 10.5,
      leftMargin: 9.5,
      rowGap: 0,
      colGap: 2.5,
      fontSize: 5.5
    },
    tomy_138: {
      id: 'tomy_138',
      name: 'Tomy 138 (100 nhãn - 5x20)',
      rows: 20,
      cols: 5,
      width: 40.0,
      height: 14.0,
      topMargin: 8.5,
      leftMargin: 5.0,
      rowGap: 0.5,
      colGap: 2.5,
      fontSize: 4.5
    },
    tomy_135: {
      id: 'tomy_135',
      name: 'Tomy 135 (24 nhãn - 3x8)',
      rows: 8,
      cols: 3,
      width: 47.0,
      height: 22.0,
      topMargin: 20.0,
      leftMargin: 34.5,
      rowGap: 0,
      colGap: 2.0,
      fontSize: 6.5
    },
    tomy_146: {
      id: 'tomy_146',
      name: 'Tomy 146 (18 nhãn - 3x6)',
      rows: 6,
      cols: 3,
      width: 62.0,
      height: 42.0,
      topMargin: 22.0,
      leftMargin: 12.0,
      rowGap: 0,
      colGap: 2.0,
      fontSize: 8.0
    }
  };

  ROLL_PRESETS: Record<string, RollPreset> = {
    '62x29_ql800': { id: '62x29_ql800', name: 'Brother QL-800 DK-22205 (62 x 29 mm)', width: 62, height: 29, fontSize: 7 },
    '90x29_ql800': { id: '90x29_ql800', name: 'Brother QL-800 DK-11201 (90 x 29 mm)', width: 90, height: 29, fontSize: 7 },
    '62x62_ql800': { id: '62x62_ql800', name: 'Brother QL-800 DK-11209 (62 x 62 mm)', width: 62, height: 62, fontSize: 9 },
    '35x22': { id: '35x22', name: 'Tem chuẩn (35 x 22 mm)', width: 35, height: 22, fontSize: 6 },
    '22x12': { id: '22x12', name: 'Tem nhỏ (22 x 12 mm)', width: 22, height: 12, fontSize: 4.5 },
    '50x30': { id: '50x30', name: 'Tem trung (50 x 30 mm)', width: 50, height: 30, fontSize: 8 },
    '70x50': { id: '70x50', name: 'Tem lớn (70 x 50 mm)', width: 70, height: 50, fontSize: 10 }
  };

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

      const margin = 10; // 10mm margins for printer safe zone
      const gap = 1.5;   // 1.5mm gap between cutting lines
      
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
    const totalSlots = (this.gridStartIndex() - 1) + this.printCopies();
    const labelsPerPage = preset.rows * preset.cols;
    return Math.ceil(totalSlots / labelsPerPage);
  }

  getQrCodeUrl(): string {
    const stdData = this.std();
    if (!stdData) return '';
    const originUrl = window.location.origin;
    const url = `${originUrl}/#/standards/${stdData.id}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}`;
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

  printLabel() {
    const singleRef = document.querySelector('.single-print-ref > div');
    if (!singleRef) return;

    const copies = this.printCopies();
    
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
        printArea.style.display = 'flex';
        printArea.style.flexDirection = 'column';
        printArea.style.alignItems = 'flex-start';
        
        for (let i = 0; i < copies; i++) {
            const clonedNode = singleRef.cloneNode(true) as HTMLElement;
            clonedNode.style.boxShadow = 'none';
            clonedNode.style.border = 'none';
            clonedNode.style.transform = 'none';
            clonedNode.style.pageBreakAfter = 'always';
            clonedNode.style.breakAfter = 'page';
            printArea.appendChild(clonedNode);
        }
    } else {
        // A4 decal sheets
        const preset = this.getGridPreset();
        const labelsPerPage = preset.rows * preset.cols;
        const startIndex = this.gridStartIndex();
        const totalSlots = (startIndex - 1) + copies;
        const totalPages = Math.ceil(totalSlots / labelsPerPage);

        for (let p = 0; p < totalPages; p++) {
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
            pageEl.style.pageBreakAfter = 'always';
            pageEl.style.breakAfter = 'page';
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
                const firstPageLabels = Math.min(copies, labelsPerPage - (startIndex - 1));
                for (let c = 0; c < firstPageLabels; c++) {
                    const clone = singleRef.cloneNode(true) as HTMLElement;
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
                // Subsequent pages: no offset
                const printedSoFar = (labelsPerPage - (startIndex - 1)) + (p - 1) * labelsPerPage;
                const remaining = copies - printedSoFar;
                const pageKLabels = Math.min(remaining, labelsPerPage);
                
                for (let c = 0; c < pageKLabels; c++) {
                    const clone = singleRef.cloneNode(true) as HTMLElement;
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
            
            printArea.appendChild(pageEl);
        }
    }

    document.body.appendChild(printArea);

    const style = document.createElement('style');
    style.id = 'print-style';
    
    if (this.printLayoutMode() === 'roll') {
        style.textContent = `
            @page { size: ${this.printWidth()}mm ${this.printHeight()}mm; margin: 0; }
            #print-area { display: block !important; }
        `;
    } else {
        style.textContent = `
            @page { size: A4 portrait; margin: 0; }
            #print-area { display: block !important; }
        `;
    }
    document.head.appendChild(style);

    setTimeout(() => {
        window.print();
        setTimeout(() => {
            document.body.removeChild(printArea);
            document.head.removeChild(style);
        }, 800);
    }, 150);
  }
}
