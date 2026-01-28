
import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrintService, PrintOptions } from '../../../core/services/print.service';
import { PrintLayoutComponent } from '../print-layout/print-layout.component';

@Component({
  selector: 'app-print-preview-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, PrintLayoutComponent],
  template: `
    @if (printService.isPreviewOpen()) {
        <div class="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4 fade-in" (click)="close()">
            <div class="bg-white w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-bounce-in relative" (click)="$event.stopPropagation()">
                
                <!-- HEADER -->
                <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white shrink-0 z-10">
                    <h3 class="font-black text-slate-800 text-lg flex items-center gap-2">
                        <i class="fa-solid fa-print text-indigo-600"></i> Xem trước khi in (A4 Preview)
                    </h3>
                    <div class="flex gap-2">
                        <div class="flex items-center gap-1 bg-slate-100 rounded-lg p-1 border border-slate-200">
                            <button (click)="zoomOut()" class="w-8 h-8 flex items-center justify-center rounded hover:bg-white transition text-slate-600"><i class="fa-solid fa-minus"></i></button>
                            <span class="text-xs font-bold w-10 text-center">{{zoomLevel()}}%</span>
                            <button (click)="zoomIn()" class="w-8 h-8 flex items-center justify-center rounded hover:bg-white transition text-slate-600"><i class="fa-solid fa-plus"></i></button>
                        </div>
                        <button (click)="close()" class="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-red-500 transition"><i class="fa-solid fa-times text-xl"></i></button>
                    </div>
                </div>

                <!-- BODY (Split Layout) -->
                <div class="flex-1 flex overflow-hidden">
                    
                    <!-- LEFT: Config Panel -->
                    <div class="w-72 bg-slate-50 border-r border-slate-200 p-5 flex flex-col gap-6 overflow-y-auto shrink-0">
                        
                        <!-- Toggle Options -->
                        <div class="space-y-3">
                            <h4 class="text-xs font-bold text-slate-400 uppercase tracking-widest">Tùy chọn hiển thị</h4>
                            
                            <label class="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-indigo-300 transition">
                                <span class="text-sm font-bold text-slate-700">Tiêu đề (Header)</span>
                                <input type="checkbox" [(ngModel)]="options.showHeader" class="w-5 h-5 accent-indigo-600 rounded">
                            </label>

                            <label class="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-indigo-300 transition">
                                <span class="text-sm font-bold text-slate-700">Chân trang (Footer)</span>
                                <input type="checkbox" [(ngModel)]="options.showFooter" class="w-5 h-5 accent-indigo-600 rounded">
                            </label>

                            <label class="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-indigo-300 transition">
                                <span class="text-sm font-bold text-slate-700">Ký tên điện tử</span>
                                <input type="checkbox" [(ngModel)]="options.showSignature" class="w-5 h-5 accent-indigo-600 rounded">
                            </label>

                            <label class="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-indigo-300 transition">
                                <span class="text-sm font-bold text-slate-700">Đường cắt (Cut line)</span>
                                <input type="checkbox" [(ngModel)]="options.showCutLine" class="w-5 h-5 accent-indigo-600 rounded">
                            </label>
                        </div>

                        <div class="mt-auto pt-6 border-t border-slate-200 flex flex-col gap-3">
                            <button (click)="doPrint()" [disabled]="printService.isProcessing()"
                                    class="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                @if(printService.isProcessing()) { <i class="fa-solid fa-spinner fa-spin"></i> }
                                @else { <i class="fa-solid fa-print text-lg"></i> }
                                <span>IN NGAY</span>
                            </button>
                            
                            <button (click)="doPdf()" [disabled]="printService.isProcessing()"
                                    class="w-full py-3 bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 rounded-xl font-bold transition flex items-center justify-center gap-2 disabled:opacity-50">
                                @if(printService.isProcessing()) { <i class="fa-solid fa-spinner fa-spin"></i> }
                                @else { <i class="fa-solid fa-file-pdf"></i> }
                                <span>Tải PDF</span>
                            </button>
                        </div>
                    </div>

                    <!-- RIGHT: Preview Canvas -->
                    <div class="flex-1 bg-slate-200 overflow-auto flex justify-center p-8 relative custom-scrollbar">
                        <div class="origin-top transition-transform duration-200 ease-out shadow-2xl bg-white"
                             [style.transform]="'scale(' + (zoomLevel()/100) + ')'">
                             <!-- Using PrintLayout inside the modal -->
                             <app-print-layout [jobs]="printService.previewJobs()" [options]="options"></app-print-layout>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
  `
})
export class PrintPreviewModalComponent {
  printService = inject(PrintService);
  
  zoomLevel = signal(75); // %
  
  // Local options state
  options: PrintOptions = { ...this.printService.defaultOptions };

  constructor() {
      // Reset options when opened
      effect(() => {
          if (this.printService.isPreviewOpen()) {
              this.options = { ...this.printService.defaultOptions };
              this.zoomLevel.set(75);
          }
      });
  }

  close() {
      this.printService.closePreview();
  }

  zoomIn() {
      this.zoomLevel.update(v => Math.min(v + 10, 150));
  }

  zoomOut() {
      this.zoomLevel.update(v => Math.max(v - 10, 25));
  }

  doPrint() {
      this.printService.printDocument(this.printService.previewJobs(), this.options);
  }

  doPdf() {
      this.printService.downloadPdf(this.printService.previewJobs(), this.options);
  }
}
