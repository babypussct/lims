import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-export-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" (click)="onBackdropClick($event)">
        <div class="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in border border-slate-200 dark:border-slate-700 max-h-[90vh] flex flex-col">
            
            <!-- Header -->
            <div class="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/10 dark:to-purple-900/10 shrink-0">
                <div>
                    <h3 class="font-black text-slate-800 dark:text-slate-100 flex items-center gap-2.5 text-lg">
                        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-300/30">
                            <i [class]="iconClass + ' text-sm'"></i>
                        </div>
                        {{ title }}
                    </h3>
                    @if (subtitle || dateRangeText) {
                        <div class="flex items-center gap-2 mt-1 ml-[46px]">
                            @if (dateRangeText) {
                                <span class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{{ dateRangeText }}</span>
                            }
                            @if (subtitle) {
                                <span class="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold">{{ subtitle }}</span>
                            }
                        </div>
                    }
                </div>
                <button (click)="onClose()" [disabled]="isExporting" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition disabled:opacity-50">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>
            
            <!-- Scrollable Content -->
            <div class="flex-1 overflow-y-auto custom-scrollbar">
                <ng-content></ng-content>
                
                <!-- Progress complete -->
                @if (isCompleted) {
                    <div class="m-5 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-lg shadow-lg shadow-emerald-200">
                            <i class="fa-solid fa-check-double"></i>
                        </div>
                        <div>
                            <div class="text-sm font-black text-emerald-700 dark:text-emerald-400">Hoàn tất! File đã được tải xuống.</div>
                            <div class="text-[11px] text-emerald-600 dark:text-emerald-500">Kiểm tra thư mục Downloads của bạn.</div>
                        </div>
                    </div>
                }
            </div>

            <!-- Footer -->
            <div class="p-5 border-t border-slate-100 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/50 flex gap-3 justify-between items-center shrink-0">
                <div class="text-[10px] text-slate-400 font-medium">
                    @if (footerText && !isExporting) {
                        {{ footerText }}
                    }
                </div>
                <div class="flex gap-3">
                    <button (click)="onClose()" [disabled]="isExporting" class="px-5 py-2.5 rounded-2xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition disabled:opacity-50">Đóng</button>
                    @if (!isExporting || isCompleted) {
                        <button (click)="onExecute()" 
                                [disabled]="isExporting || isSubmitDisabled"
                                class="px-8 py-2.5 rounded-2xl font-black text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl shadow-indigo-200/50 dark:shadow-none transition flex items-center gap-2 disabled:opacity-50 active:scale-95">
                            <i class="fa-solid fa-cloud-arrow-down"></i>
                            {{ isCompleted ? 'Xuất lại' : submitButtonText }}
                        </button>
                    } @else {
                        <button disabled
                                class="px-8 py-2.5 rounded-2xl font-black text-white bg-slate-400 dark:bg-slate-600 transition flex items-center gap-2 opacity-70 cursor-not-allowed">
                            <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            Đang xử lý...
                        </button>
                    }
                </div>
            </div>
        </div>
    </div>
  `
})
export class ExportModalComponent {
  @Input() title: string = 'Xuất Báo cáo';
  @Input() subtitle: string = '';
  @Input() dateRangeText: string = '';
  @Input() iconClass: string = 'fa-solid fa-file-export';
  @Input() footerText: string = '';
  @Input() submitButtonText: string = 'Bắt đầu Xuất File';
  @Input() isExporting: boolean = false;
  @Input() isCompleted: boolean = false;
  @Input() isSubmitDisabled: boolean = false;

  @Output() close = new EventEmitter<void>();
  @Output() execute = new EventEmitter<void>();

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget && !this.isExporting) {
      this.close.emit();
    }
  }

  onClose() {
    this.close.emit();
  }

  onExecute() {
    this.execute.emit();
  }
}
