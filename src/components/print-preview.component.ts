
import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintService } from '../services/print.service';
import { PrintLayoutComponent } from './print-layout.component';

@Component({
  selector: 'app-batch-print',
  standalone: true,
  imports: [CommonModule, PrintLayoutComponent],
  template: `
    <div class="h-full flex flex-col bg-slate-800 rounded-xl shadow-inner border border-slate-700/50 p-1.5 no-print fade-in">
      <!-- Toolbar -->
      <div class="bg-slate-900/70 backdrop-blur-sm rounded-lg p-2 flex items-center justify-between shrink-0 mb-1.5 z-10 border border-slate-700">
        <div class="flex items-center gap-3">
            <button (click)="closeView.emit()" class="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-md text-sm font-bold flex items-center gap-2 transition">
                <i class="fa-solid fa-chevron-left"></i> Quay lại
            </button>
            <div class="text-sm font-bold text-slate-300">
                Xem trước Bản in ({{printService.jobs().length}} SOPs)
            </div>
            <button (click)="clearJobs()" class="text-xs text-red-400 hover:text-red-300 hover:bg-red-900/20 px-2 py-1 rounded">
              <i class="fa-solid fa-times"></i> Xóa
            </button>
        </div>
        
        <div class="flex items-center gap-2">
            <button (click)="exportPdf()" class="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-sm font-bold flex items-center gap-2 transition shadow-lg shadow-emerald-900/50">
                <i class="fa-solid fa-file-pdf"></i> Xuất PDF
            </button>
            <button (click)="triggerPrint()" class="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-bold flex items-center gap-2 transition shadow-lg shadow-blue-900/50">
                <i class="fa-solid fa-print"></i> In ra giấy
            </button>
        </div>
      </div>

      <!-- Preview Content -->
      <div class="flex-1 overflow-y-auto rounded-lg bg-slate-600 p-6">
        <div class="max-w-[210mm] mx-auto">
          <!-- The class 'preview-mode' forces the print layout to display on screen -->
          <app-print-layout class="preview-mode"></app-print-layout>
        </div>
      </div>
    </div>
  `
})
export class BatchPrintComponent {
  printService = inject(PrintService);
  closeView = output<void>();

  triggerPrint() {
    this.printService.triggerBrowserPrint();
  }

  exportPdf() {
    this.printService.exportToPdf();
  }

  clearJobs() {
    this.printService.jobs.set([]);
    this.closeView.emit();
  }
}
