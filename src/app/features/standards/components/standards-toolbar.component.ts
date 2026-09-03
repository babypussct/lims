import { Component, ElementRef, HostListener, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LockPermissionDirective } from '../../../shared/directives/lock-permission.directive';
import { StateService } from '../../../core/services/state.service';
import { AppButtonComponent } from '../../../shared/components/ui/button/button.component';
import { AppPageHeaderComponent } from '../../../shared/components/ui/page-header/page-header.component';

@Component({
  selector: 'app-standards-toolbar',
  standalone: true,
  imports: [CommonModule, LockPermissionDirective, AppButtonComponent, AppPageHeaderComponent],
  template: `
    <app-page-header
      title="Quản lý chất chuẩn đối chiếu"
      subtitle="Quản lý danh sách chất chuẩn, in tem và cập nhật thông tin lô sản xuất."
      icon="fa-vial-circle-check">
      <div pageHeaderActions class="flex items-center gap-2 flex-wrap">
         @if(selectedCount() > 0) {
              <app-button class="animate-bounce-in" size="sm" (click)="printSelected.emit()" [disabled]="isProcessing()">
                  <i class="fa-solid fa-print"></i> In {{selectedCount()}} nhãn
              </app-button>
              @if (canEditStandards() || state.showLockedFeatures()) {
                  <app-button class="animate-bounce-in" variant="secondary" size="sm" [appLockPermission]="'standard_edit'" (click)="openBulkTagModal.emit()" [disabled]="isProcessing()">
                      <i class="fa-solid fa-tags text-fuchsia-500"></i> Gán nhãn
                  </app-button>
              }
              @if (canEditStandards() || state.showLockedFeatures()) {
                  <app-button class="animate-bounce-in" variant="danger" size="sm" [appLockPermission]="'standard_edit'" (click)="deleteSelected.emit()" [loading]="isProcessing()">
                      <i class="fa-solid fa-eye-slash"></i> Ẩn {{selectedCount()}} mục
                  </app-button>
              }
              <div class="h-5 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
         }

         @if(canEditStandards() || state.showLockedFeatures()) {
            <div class="relative ml-1">
                <button
                    [appLockPermission]="'standard_edit'"
                    type="button"
                    aria-haspopup="menu"
                    aria-controls="standards-function-menu"
                    [attr.aria-expanded]="functionMenuOpen()"
                    (click)="toggleFunctionMenu($event)"
                    class="h-9 px-3 bg-fuchsia-600 dark:bg-fuchsia-500 text-white hover:bg-fuchsia-700 dark:hover:bg-fuchsia-600 rounded-xl shadow-sm shadow-fuchsia-200 dark:shadow-none transition font-bold text-sm flex items-center gap-2">
                    <i class="fa-solid fa-bars"></i> Chức năng <i class="fa-solid fa-caret-down"></i>
                </button>
                @if (functionMenuOpen()) {
                  <div id="standards-function-menu" role="menu" class="absolute right-0 top-full mt-1 w-56 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 z-30 overflow-hidden flex flex-col p-1 animate-slide-up">
                    <button role="menuitem" [appLockPermission]="'standard_edit'" (click)="runMenuAction(openAddModal)" class="text-left px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-fuchsia-50 hover:text-fuchsia-600 dark:hover:bg-slate-700 rounded-lg transition flex items-center gap-2">
                        <i class="fa-solid fa-plus text-fuchsia-500 w-4"></i> Thêm mới
                    </button>
                    <div class="h-px bg-slate-100 dark:bg-slate-700 my-1 mx-2"></div>
                    <button role="menuitem" [appLockPermission]="'standard_edit'" (click)="runMenuAction(openInternalIdSync)" class="text-left px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-slate-700 rounded-lg transition flex items-center gap-2">
                        <i class="fa-solid fa-arrows-rotate text-amber-500 w-4"></i> Đồng bộ mã nội bộ
                    </button>
                    <button role="menuitem" [appLockPermission]="'standard_edit'" (click)="openFilePicker(fileInput)" class="text-left px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-slate-700 rounded-lg transition flex items-center gap-2">
                        <i class="fa-solid fa-file-excel text-emerald-500 w-4"></i> Import chuẩn
                    </button>
                    <button role="menuitem" [appLockPermission]="'standard_edit'" (click)="openFilePicker(usageLogFileInput)" class="text-left px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-teal-50 hover:text-teal-600 dark:hover:bg-slate-700 rounded-lg transition flex items-center gap-2">
                        <i class="fa-solid fa-book-open text-teal-500 w-4"></i> Import nhật ký
                    </button>
                    <button role="menuitem" [appLockPermission]="'standard_edit'" (click)="runMenuAction(openCleanupModal)" class="text-left px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-fuchsia-50 hover:text-fuchsia-600 dark:hover:bg-slate-700 rounded-lg transition flex items-center gap-2">
                        <i class="fa-solid fa-broom text-fuchsia-500 w-4"></i> Chuẩn hóa tên chất chuẩn
                    </button>
                    <button role="menuitem" [appLockPermission]="'standard_edit'" (click)="runMenuAction(openTagManager)" class="text-left px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-fuchsia-50 hover:text-fuchsia-600 dark:hover:bg-slate-700 rounded-lg transition flex items-center gap-2">
                        <i class="fa-solid fa-tags text-fuchsia-500 w-4"></i> Quản lý danh mục nhãn
                    </button>
                    <div class="h-px bg-slate-100 dark:bg-slate-700 my-1 mx-2"></div>
                    <div class="px-3 py-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tải nhiều CoA lên</div>
                    <button role="menuitem" [appLockPermission]="'standard_edit'" (click)="openFilePicker(bulkCoaFolderInput)" class="text-left px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-700 rounded-lg transition flex items-center gap-2">
                        <i class="fa-solid fa-folder-open text-amber-500 w-4 ml-2"></i> Từ thư mục
                    </button>
                    <button role="menuitem" [appLockPermission]="'standard_edit'" (click)="openFilePicker(bulkCoaFilesInput)" class="text-left px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-700 rounded-lg transition flex items-center gap-2">
                        <i class="fa-regular fa-images text-blue-500 w-4 ml-2"></i> Chọn tệp
                    </button>
                  </div>
                }
                <input #fileInput type="file" class="hidden" accept=".xlsx, .xlsm, .csv" (change)="onFileSelect($event, fileInput, 'standards')">
                <input #usageLogFileInput type="file" class="hidden" accept=".xlsx, .xlsm, .csv" (change)="onFileSelect($event, usageLogFileInput, 'usageLogs')">
                <input #bulkCoaFolderInput type="file" webkitdirectory directory multiple class="hidden" (change)="onBulkCoaSelect($event, bulkCoaFolderInput)">
                <input #bulkCoaFilesInput type="file" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp" class="hidden" (change)="onBulkCoaSelect($event, bulkCoaFilesInput)">
            </div>
         }
         <!-- Xuất Excel — hiển thị cho tất cả user, không cần phân quyền -->
         <app-button variant="secondary" size="sm" (click)="openExportModal.emit()" title="Xuất danh sách đang lọc ra tệp Excel">
             <i class="fa-solid fa-file-excel text-emerald-500"></i> Xuất Excel
         </app-button>
      </div>
    </app-page-header>
  `
})
export class StandardsToolbarComponent {
  state = inject(StateService);
  private elementRef = inject(ElementRef<HTMLElement>);
  functionMenuOpen = signal(false);
  selectedCount = input<number>(0);
  isProcessing = input<boolean>(false);
  canEditStandards = input<boolean>(true);

  deleteSelected = output<void>();
  printSelected = output<void>();
  openAddModal = output<void>();
  importStandardsFile = output<any>();
  importUsageLogFile = output<any>();
  bulkCoaSelect = output<any>();
  openExportModal = output<void>();
  openCleanupModal = output<void>();
  openInternalIdSync = output<void>();
  openBulkTagModal = output<void>();
  openTagManager = output<void>();

  toggleFunctionMenu(event: MouseEvent) {
    event.stopPropagation();
    this.functionMenuOpen.update(value => !value);
  }

  runMenuAction(action: { emit: () => void }) {
    this.functionMenuOpen.set(false);
    action.emit();
  }

  openFilePicker(input: HTMLInputElement) {
    this.functionMenuOpen.set(false);
    input.click();
  }

  @HostListener('document:click', ['$event'])
  closeMenuOnOutsideClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.functionMenuOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  closeMenuOnEscape() {
    this.functionMenuOpen.set(false);
  }

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
