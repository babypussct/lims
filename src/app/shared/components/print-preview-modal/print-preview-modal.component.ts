
import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrintService, PrintOptions } from '../../../core/services/print.service';
import { PrintLayoutComponent } from '../print-layout/print-layout.component';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-print-preview-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, PrintLayoutComponent],
  template: `
    @if (printService.isPreviewOpen()) {
        <div class="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/95 backdrop-blur-md p-4 fade-in print-modal-overlay" (click)="close()">
            <div class="bg-white w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-bounce-in relative print-modal-content" (click)="$event.stopPropagation()">
                
                <!-- HEADER (Hidden when printing) -->
                <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white shrink-0 z-10 print-hidden-ui">
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
                    
                    <!-- LEFT: Config Panel (Hidden when printing) -->
                    <div class="w-72 bg-slate-50 border-r border-slate-200 p-5 flex flex-col gap-6 overflow-y-auto shrink-0 print-hidden-ui">
                        
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
                            <button (click)="doPrint()" 
                                    class="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2">
                                <i class="fa-solid fa-print text-lg"></i>
                                <span>IN NGAY (Direct)</span>
                            </button>
                            
                            <button (click)="doPdf()" [disabled]="isGeneratingPdf()"
                                    class="w-full py-3 bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 rounded-xl font-bold transition flex items-center justify-center gap-2 disabled:opacity-50">
                                @if(isGeneratingPdf()) { <i class="fa-solid fa-spinner fa-spin"></i> } 
                                @else { <i class="fa-solid fa-file-pdf"></i> }
                                <span>Tải PDF (High-Res)</span>
                            </button>
                        </div>
                    </div>

                    <!-- RIGHT: Preview Canvas -->
                    <!-- 'id="print-area"' is used for PDF generation -->
                    <div class="flex-1 bg-slate-200 overflow-auto flex justify-center p-8 relative custom-scrollbar print-scale-reset">
                        <div id="print-area" class="origin-top transition-transform duration-200 ease-out shadow-2xl bg-white print-scale-reset"
                             [style.transform]="'scale(' + (zoomLevel()/100) + ')'">
                             <!-- This Component is what gets printed -->
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
  toast = inject(ToastService);
  
  zoomLevel = signal(75); // %
  isGeneratingPdf = signal(false);
  
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

  close() { this.printService.closePreview(); }
  zoomIn() { this.zoomLevel.update(v => Math.min(v + 10, 150)); }
  zoomOut() { this.zoomLevel.update(v => Math.max(v - 10, 25)); }

  // --- 1. DIRECT BROWSER PRINT (WYSIWYG) ---
  doPrint() {
      // Logic handled by CSS @media print in index.html
      // It simply hides everything EXCEPT app-print-preview-modal content
      window.print();
  }

  // --- 2. HIGH-RES PDF EXPORT (Image-based) ---
  async doPdf() {
      this.isGeneratingPdf.set(true);
      this.toast.show('Đang tạo PDF chất lượng cao...', 'info');
      
      // Wait for UI to update
      await new Promise(resolve => setTimeout(resolve, 100));

      try {
          const { jsPDF } = await import('jspdf');
          const html2canvas = (await import('html2canvas')).default;

          const element = document.getElementById('print-area');
          if (!element) throw new Error('Print area not found');

          // Capture at 2x scale for clarity
          const canvas = await html2canvas(element, {
              scale: 2, 
              useCORS: true,
              logging: false,
              backgroundColor: '#ffffff'
          });

          const imgData = canvas.toDataURL('image/jpeg', 0.95);
          
          // A4 dimensions in mm
          const pdfWidth = 210;
          const pdfHeight = 297;
          
          const doc = new jsPDF('p', 'mm', 'a4');

          // Calculate height proportional to A4 width
          const imgProps = (doc as any).getImageProperties(imgData);
          const pdfImgHeight = (imgProps.height * pdfWidth) / imgProps.width;

          // Handle multi-page (simple height check)
          let heightLeft = pdfImgHeight;
          let position = 0;

          doc.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfImgHeight);
          heightLeft -= pdfHeight;

          while (heightLeft > 0) {
            position = heightLeft - pdfImgHeight;
            doc.addPage();
            doc.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfImgHeight);
            heightLeft -= pdfHeight;
          }

          const fileName = `LIMS_Phieu_${new Date().toISOString().slice(0,10)}.pdf`;
          doc.save(fileName);
          this.toast.show('Tải PDF thành công!', 'success');

      } catch (e: any) {
          console.error(e);
          this.toast.show('Lỗi tạo PDF: ' + e.message, 'error');
      } finally {
          this.isGeneratingPdf.set(false);
      }
  }
}
