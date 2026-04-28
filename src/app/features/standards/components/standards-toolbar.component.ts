import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-standards-toolbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-2 shrink-0 bg-white dark:bg-slate-800 p-2 px-3 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm dark:shadow-none">
      <div>
          <h2 class="text-base font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <div class="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-800/50 shadow-sm dark:shadow-none">
                  <i class="fa-solid fa-vial-circle-check text-xs"></i>
              </div>
              Quản lý Chuẩn Đối Chiếu
          </h2>
      </div>
      
      <div class="flex gap-2 items-center">
         @if(selectedCount() > 0 && canEditStandards()) {
              <button (click)="deleteSelected.emit()" [disabled]="isProcessing()" class="px-3 py-1.5 bg-red-600 dark:bg-red-500 text-white hover:bg-red-700 dark:hover:bg-red-600 rounded-lg shadow-sm shadow-red-200 dark:shadow-none transition font-bold text-[11px] flex items-center gap-1.5 animate-bounce-in disabled:opacity-50">
                  @if(isProcessing()) { <i class="fa-solid fa-spinner fa-spin"></i> } @else { <i class="fa-solid fa-eye-slash"></i> } Ẩn {{selectedCount()}} mục
              </button>
              <div class="h-5 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
         }

         @if(canEditStandards()) {
           <div class="relative group ml-1">
               <button class="px-3 py-1.5 bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 rounded-lg shadow-sm shadow-indigo-200 dark:shadow-none transition font-bold text-[11px] flex items-center gap-1.5">
                   <i class="fa-solid fa-bars"></i> Chức năng <i class="fa-solid fa-caret-down"></i>
               </button>
               <div class="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden flex flex-col p-1">
                   <button (click)="openAddModal.emit()" class="text-left px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-700 rounded-lg transition flex items-center gap-2">
                       <i class="fa-solid fa-plus text-indigo-500 w-4"></i> Thêm mới
                   </button>
                   <div class="h-px bg-slate-100 dark:bg-slate-700 my-1 mx-2"></div>
                   <button (click)="fileInput.click()" class="text-left px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-slate-700 rounded-lg transition flex items-center gap-2">
                       <i class="fa-solid fa-file-excel text-emerald-500 w-4"></i> Import Chuẩn
                   </button>
                   <button (click)="usageLogFileInput.click()" class="text-left px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-teal-50 hover:text-teal-600 dark:hover:bg-slate-700 rounded-lg transition flex items-center gap-2">
                       <i class="fa-solid fa-book-open text-teal-500 w-4"></i> Import Nhật ký
                   </button>
                   <button (click)="recalculateInventory.emit()" class="text-left px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-slate-700 rounded-lg transition flex items-center gap-2">
                       <i class="fa-solid fa-calculator text-orange-500 w-4"></i> Cân đối lại tồn kho
                   </button>
                   <div class="h-px bg-slate-100 dark:bg-slate-700 my-1 mx-2"></div>
                   <div class="px-3 py-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload CoA Hàng loạt</div>
                   <button (click)="bulkCoaFolderInput.click()" class="text-left px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-700 rounded-lg transition flex items-center gap-2">
                       <i class="fa-solid fa-folder-open text-amber-500 w-4 ml-2"></i> Từ Thư mục
                   </button>
                   <button (click)="bulkCoaFilesInput.click()" class="text-left px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-700 rounded-lg transition flex items-center gap-2">
                       <i class="fa-regular fa-images text-blue-500 w-4 ml-2"></i> Chọn Files
                   </button>
               </div>
               <input #fileInput type="file" class="hidden" accept=".xlsx, .xlsm, .csv" (change)="onFileSelect($event, fileInput, 'standards')">
               <input #usageLogFileInput type="file" class="hidden" accept=".xlsx, .xlsm, .csv" (change)="onFileSelect($event, usageLogFileInput, 'usageLogs')">
               <input #bulkCoaFolderInput type="file" webkitdirectory directory multiple class="hidden" (change)="onBulkCoaSelect($event, bulkCoaFolderInput)">
               <input #bulkCoaFilesInput type="file" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp" class="hidden" (change)="onBulkCoaSelect($event, bulkCoaFilesInput)">
           </div>
         }
      </div>
    </div>
  `
})
export class StandardsToolbarComponent {
  selectedCount = input<number>(0);
  isProcessing = input<boolean>(false);
  canEditStandards = input<boolean>(true);

  deleteSelected = output<void>();
  openAddModal = output<void>();
  importStandardsFile = output<any>();
  importUsageLogFile = output<any>();
  bulkCoaSelect = output<any>();
  recalculateInventory = output<void>();

  onFileSelect(event: any, inputEl: HTMLInputElement, type: 'standards' | 'usageLogs') {
    if (type === 'standards') {
      this.importStandardsFile.emit(event);
    } else {
      this.importUsageLogFile.emit(event);
    }
  }

  onBulkCoaSelect(event: any, inputEl: HTMLInputElement) {
    this.bulkCoaSelect.emit(event);
  }
}
