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
           <button (click)="openAddModal.emit()" class="px-3 py-1.5 bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 rounded-lg shadow-sm shadow-indigo-200 dark:shadow-none transition font-bold text-[11px] flex items-center gap-1.5">
              <i class="fa-solid fa-plus"></i> Thêm mới
           </button>
           <button (click)="autoZeroAllSdhet.emit()" class="px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/40 rounded-lg border border-orange-200 dark:border-orange-800/50 transition font-bold text-[11px] flex items-center gap-1.5" title="Tự động kiểm kho tất cả chuẩn SDHET">
              <i class="fa-solid fa-box-open"></i> Dọn kho SDHET
           </button>
           <button (click)="fileInput.click()" class="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded-lg border border-emerald-200 dark:border-emerald-800/50 transition font-bold text-[11px] flex items-center gap-1.5" title="Import danh sách chuẩn">
              <i class="fa-solid fa-file-excel"></i> Import Chuẩn
           </button>
           <input #fileInput type="file" class="hidden" accept=".xlsx, .xlsm, .csv" (change)="onFileSelect($event, fileInput, 'standards')">
           
           <button (click)="usageLogFileInput.click()" class="px-3 py-1.5 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-900/40 rounded-lg border border-teal-200 dark:border-teal-800/50 transition font-bold text-[11px] flex items-center gap-1.5" title="Import nhật ký sử dụng">
              <i class="fa-solid fa-book-open"></i> Import Nhật ký
           </button>
           <input #usageLogFileInput type="file" class="hidden" accept=".xlsx, .xlsm, .csv" (change)="onFileSelect($event, usageLogFileInput, 'usageLogs')">
           
           <!-- Dropdown or group for Bulk CoA -->
           <div class="relative group ml-1">
               <button class="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg border border-blue-200 dark:border-blue-800/50 transition font-bold text-[11px] flex items-center gap-1.5">
                   <i class="fa-solid fa-cloud-arrow-up"></i> Upload CoA Hàng loạt <i class="fa-solid fa-caret-down"></i>
               </button>
               <div class="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden flex flex-col p-1">
                   <button (click)="bulkCoaFolderInput.click()" class="text-left px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-700 rounded-lg transition flex items-center gap-2">
                       <i class="fa-solid fa-folder-open text-amber-500 w-4"></i> Từ Thư mục (Files/Folders)
                   </button>
                   <button (click)="bulkCoaFilesInput.click()" class="text-left px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-700 rounded-lg transition flex items-center gap-2">
                       <i class="fa-regular fa-images text-blue-500 w-4"></i> Chọn nhiều Files (PDF/IMG)
                   </button>
               </div>
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
  autoZeroAllSdhet = output<void>();
  importStandardsFile = output<any>();
  importUsageLogFile = output<any>();
  bulkCoaSelect = output<any>();

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
