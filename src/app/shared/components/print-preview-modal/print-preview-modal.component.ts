import { Component, inject, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PrintService, PrintOptions } from '../../../core/services/print.service';
import { PrintLayoutComponent } from '../print-layout/print-layout.component';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-print-preview-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, PrintLayoutComponent],
  template: `
    <!-- Chế Độ 1: Xem trước & In ấn Phiếu chạy A4 Cục bộ -->
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
                    <div class="flex-1 bg-slate-200 overflow-auto flex justify-center p-8 relative custom-scrollbar print-scale-reset">
                        <div id="print-area" class="origin-top transition-transform duration-200 ease-out shadow-2xl bg-white print-scale-reset"
                             [style.transform]="'scale(' + (zoomLevel()/100) + ')'">
                             <app-print-layout [jobs]="printService.previewJobs()" [options]="options"></app-print-layout>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }

    <!-- Chế Độ 2: Trình Quản Lý & Xem Báo Cáo PDF Drive (Cloud PDF Viewer) -->
    @if (printService.isPreviewPdfOpen()) {
        <div class="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-[150] p-4 fade-in" (click)="closePdfModal()">
            <div class="relative bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col border border-slate-200/50 dark:border-slate-800 transition-all duration-300 ease-out"
                [class.w-full]="isFullscreen()" [class.h-full]="isFullscreen()" [class.max-w-none]="isFullscreen()" [class.rounded-none]="isFullscreen()"
                [class.max-w-6xl]="!isFullscreen()" [class.w-full]="!isFullscreen()" [class.h-[90vh]]="!isFullscreen()" [class.rounded-2xl]="!isFullscreen()"
                (click)="$event.stopPropagation()">
                
                <!-- Modal Header -->
                <div class="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-6 py-4 flex flex-col shrink-0 border-b border-indigo-500/20 shadow-md">
                    <div class="flex justify-between items-center w-full gap-4 flex-wrap sm:flex-nowrap">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20 shrink-0">
                                <i class="fa-solid fa-file-pdf text-lg text-red-400"></i>
                            </div>
                            <div>
                                <span class="text-[10px] font-bold uppercase text-indigo-300 tracking-widest block mb-0.5">
                                    {{ printService.pdfVersion() === 0 ? 'Chứng chỉ chất lượng (CoA)' : 'LIMS Báo cáo Kết quả' }}
                                </span>
                                <h4 class="text-sm sm:text-base font-extrabold m-0 tracking-tight text-white">{{ printService.pdfTitle() }}</h4>
                            </div>
                        </div>
                        
                        <!-- Right Side Actions -->
                        <div class="flex items-center gap-2 flex-wrap">
                            <!-- Google Docs Button -->
                            @if (printService.docsUrl()) {
                                <a [href]="printService.docsUrl()" target="_blank" rel="noopener noreferrer"
                                   class="px-3.5 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all duration-150 flex items-center gap-1.5 no-underline active:scale-95 shadow-sm cursor-pointer border border-slate-700">
                                    <i class="fa-solid fa-file-word text-blue-400"></i>
                                    <span>GOOGLE DOCS</span>
                                </a>
                            }



                            <!-- Print Button -->
                            <button (click)="printPdf()" [disabled]="printService.isPrinting()"
                                    class="px-3.5 py-2 text-xs font-bold text-slate-200 bg-white/10 hover:bg-white/20 disabled:opacity-55 rounded-xl transition-all duration-150 flex items-center gap-1.5 active:scale-95 border-none cursor-pointer">
                                @if (printService.isPrinting()) {
                                    <i class="fa-solid fa-circle-notch fa-spin text-indigo-400"></i>
                                    <span>ĐANG CHUẨN BỊ...</span>
                                } @else {
                                    <i class="fa-solid fa-print"></i>
                                    <span>IN NHANH</span>
                                }
                            </button>



                            <!-- Copy Link Button -->
                            <button (click)="copyPdfLink()" 
                                    class="px-3.5 py-2 text-xs font-bold text-slate-200 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-150 flex items-center gap-1.5 active:scale-95 border-none cursor-pointer">
                                <i class="fa-solid" [class.fa-copy]="!isCopying()" [class.fa-check]="isCopying()"></i>
                                <span>{{ isCopying() ? 'ĐÃ SAO CHÉP' : 'SAO CHÉP LINK' }}</span>
                            </button>



                            <div class="h-6 w-[1px] bg-white/20 mx-1 hidden sm:block"></div>

                            <!-- Maximize Toggle Button -->
                            <button (click)="toggleFullscreen()" 
                                    class="w-9 h-9 rounded-xl hover:bg-white/10 text-white/80 hover:text-white flex items-center justify-center transition active:scale-95 border-none cursor-pointer">
                                <i class="fa-solid" [class.fa-expand]="!isFullscreen()" [class.fa-compress]="isFullscreen()"></i>
                            </button>

                            <!-- Close Button -->
                            <button (click)="closePdfModal()" 
                                    class="w-9 h-9 rounded-xl hover:bg-white/10 text-white/80 hover:text-white flex items-center justify-center transition active:scale-95 border border-white/10 cursor-pointer">
                                <i class="fa-solid fa-xmark text-lg"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Sub-header: Metadata badge row -->
                    @if (printService.pdfVersion() > 0) {
                        <div class="flex items-center gap-4 mt-3 pt-3 border-t border-white/10 text-xs text-slate-300">
                            <span class="flex items-center gap-1.5">
                                <i class="fa-solid fa-code-branch text-fuchsia-400"></i>
                                <span>Phiên bản:</span>
                                <strong class="text-white bg-fuchsia-600/60 px-2 py-0.5 rounded-lg font-extrabold text-[11px]">v{{ printService.pdfVersion() }}</strong>
                            </span>
                            <span class="flex items-center gap-1.5">
                                <i class="fa-solid fa-user text-indigo-400"></i>
                                <span>Phân tích viên:</span>
                                <strong class="text-white font-bold">{{ printService.pdfAnalyst() }}</strong>
                            </span>
                            @if (printService.pdfPublishDate()) {
                                <span class="flex items-center gap-1.5">
                                    <i class="fa-solid fa-clock text-blue-400"></i>
                                    <span>In lúc:</span>
                                    <strong class="text-white font-bold">{{ formatPublishDate(printService.pdfPublishDate()) }}</strong>
                                </span>
                            }
                        </div>
                    }
                </div>
                
                <!-- Modal Body -->
                <div class="flex-1 bg-slate-100 dark:bg-slate-950 relative">
                    <!-- Inline loading overlay when recreating a report from inside the modal -->
                    @if (isPublishing()) {
                        <div class="absolute inset-0 bg-slate-900/70 backdrop-blur-sm flex flex-col items-center justify-center text-white gap-3 z-50 animate-in fade-in duration-200">
                            <i class="fa-solid fa-arrows-rotate fa-spin text-4xl text-indigo-400"></i>
                            <span class="text-xs font-bold uppercase tracking-widest text-indigo-200">Đang tạo lại bản báo cáo v{{ printService.pdfVersion() + 1 }}...</span>
                            <span class="text-[10px] text-slate-400">Vui lòng đợi trong giây lát, bảng xem trước sẽ tự cập nhật.</span>
                        </div>
                    }

                    @if (pdfModalSafeUrl()) {
                        @if (printService.pdfPreviewType() === 'image') {
                            <div class="w-full h-full flex items-center justify-center overflow-auto bg-slate-950 p-4">
                                <img [src]="rawPdfUrl()" class="max-w-full max-h-full object-contain shadow-2xl rounded-lg animate-in zoom-in-95 duration-200">
                            </div>
                        } @else {
                            <iframe [src]="pdfModalSafeUrl()" class="w-full h-full border-none rounded-b-2xl bg-white"></iframe>
                        }
                    } @else {
                        <div class="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-3 p-4">
                            <i class="fa-solid fa-spinner fa-spin text-4xl text-indigo-500"></i>
                            <span class="text-sm font-bold uppercase tracking-wider text-slate-650 dark:text-slate-355">Đang tải tài liệu...</span>
                            <p class="text-xs text-slate-500 text-center max-w-md leading-relaxed">
                                Nếu tài liệu không hiển thị, vui lòng nhấn nút
                                <strong class="text-indigo-500">GOOGLE DOCS</strong> ở góc trên để xem trực tiếp.
                            </p>
                        </div>
                    }
                </div>
            </div>
        </div>
    }
  `
})
export class PrintPreviewModalComponent {
  printService = inject(PrintService);
  toast = inject(ToastService);
  private sanitizer = inject(DomSanitizer);
  
  // HTML A4 Print options & levels
  zoomLevel = signal(75); // %
  isGeneratingPdf = signal(false);
  options: PrintOptions = { ...this.printService.defaultOptions };

  // Cloud PDF reporting panel states
  isFullscreen = signal(false);
  isCopying = signal(false);
  isPublishing = signal(false);
  // isPrinting now delegated to printService.isPrinting()

  // Safe resource computed URL
  pdfModalSafeUrl = computed(() => {
    const url = this.printService.pdfUrl();
    if (!url) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  });

  // Raw raw URL for tab bypass
  rawPdfUrl = computed(() => this.printService.pdfUrl() || '');

  constructor() {
      // Reset options when HTML preview is opened
      effect(() => {
          if (this.printService.isPreviewOpen()) {
              this.options = { ...this.printService.defaultOptions };
              this.zoomLevel.set(75);
          }
      });
  }

  // --- 1. LOCAL A4 PRINT HANDLERS ---
  close() { this.printService.closePreview(); }
  zoomIn() { this.zoomLevel.update(v => Math.min(v + 10, 150)); }
  zoomOut() { this.zoomLevel.update(v => Math.max(v - 10, 25)); }

  private cloneContentToContainer(targetContainer: HTMLElement): void {
      const source = document.querySelector('app-print-layout');
      if (!source) throw new Error('Preview element not found');

      const clone = source.cloneNode(true) as HTMLElement;
      const sourceCanvases = source.querySelectorAll('canvas');
      const cloneCanvases = clone.querySelectorAll('canvas');
      
      sourceCanvases.forEach((sourceCanvas, index) => {
          if (cloneCanvases[index]) {
              const destCanvas = cloneCanvases[index];
              const ctx = destCanvas.getContext('2d');
              if (ctx) ctx.drawImage(sourceCanvas, 0, 0);
          }
      });

      clone.style.width = '210mm'; 
      clone.style.margin = '0';
      clone.style.transform = 'none';
      clone.style.boxShadow = 'none';

      targetContainer.innerHTML = '';
      targetContainer.appendChild(clone);
  }

  doPrint() {
      const printContainer = document.getElementById('print-container');
      if (!printContainer) {
          this.toast.show('Lỗi: Không tìm thấy container in.', 'error');
          return;
      }
      try {
          this.cloneContentToContainer(printContainer);
          setTimeout(() => {
              window.print();
          }, 50);
      } catch (e) {
          console.error(e);
          this.toast.show('Lỗi chuẩn bị in.', 'error');
      }
  }

  async doPdf() {
      this.isGeneratingPdf.set(true);
      this.toast.show('Đang tạo PDF chất lượng cao...', 'info');
      let tempContainer: HTMLElement | null = null;
      try {
          tempContainer = document.createElement('div');
          tempContainer.style.position = 'fixed';
          tempContainer.style.top = '0';
          tempContainer.style.left = '0';
          tempContainer.style.zIndex = '-10000';
          tempContainer.style.width = '210mm';
          tempContainer.style.background = 'white';
          document.body.appendChild(tempContainer);

          this.cloneContentToContainer(tempContainer);
          const elementToCapture = tempContainer.firstChild as HTMLElement;
          await new Promise(r => setTimeout(r, 150));

          const { jsPDF } = await import('jspdf');
          const html2canvas = (await import('html2canvas')).default;

          const canvas = await html2canvas(elementToCapture, {
              scale: 2, 
              useCORS: true,
              logging: false,
              backgroundColor: '#ffffff',
              windowWidth: 1200
          });

          const imgData = canvas.toDataURL('image/jpeg', 0.95);
          const pdfWidth = 210;
          const pdfHeight = 297;
          
          const doc = new jsPDF('p', 'mm', 'a4');
          const imgProps = (doc as any).getImageProperties(imgData);
          const pdfImgHeight = (imgProps.height * pdfWidth) / imgProps.width;

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
          if (tempContainer && document.body.contains(tempContainer)) {
              document.body.removeChild(tempContainer);
          }
          this.isGeneratingPdf.set(false);
      }
  }

  // --- 2. CLOUD PDF REPORTING PANEL HANDLERS ---
  closePdfModal() {
      this.printService.closePdfPreview();
      this.isFullscreen.set(false);
  }

  toggleFullscreen() {
      this.isFullscreen.update(v => !v);
  }

  getFileId(url: string | null): string | null {
      if (!url) return null;
      const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
      return match ? match[1] : null;
  }

  async printPdf() {
      const url = this.printService.pdfUrl();
      if (url) {
          await this.printService.quickPrint(url);
      }
  }

  downloadPdf() {
      const id = this.getFileId(this.printService.pdfUrl());
      if (id) {
          window.open(`https://drive.google.com/uc?export=download&id=${id}`, '_blank');
      } else {
          this.toast.show('Không thể tải: Thiếu File ID', 'error');
      }
  }

  async copyPdfLink() {
      const url = this.printService.pdfUrl();
      if (url) {
          try {
              this.isCopying.set(true);
              await navigator.clipboard.writeText(url);
              this.toast.show('Đã sao chép liên kết báo cáo PDF vào clipboard!', 'success');
              setTimeout(() => this.isCopying.set(false), 1500);
          } catch (err) {
              this.toast.show('Không thể sao chép liên kết', 'error');
          }
      }
  }

  async triggerRepublishFromModal() {
      const callback = this.printService.onRepublishCallback();
      if (callback) {
          this.isPublishing.set(true);
          try {
              await callback();
              this.toast.show('Đã tạo lại bản báo cáo mới thành công!', 'success');
          } catch (err: any) {
              this.toast.show('Lỗi tạo lại báo cáo: ' + (err.message || err), 'error');
          } finally {
              this.isPublishing.set(false);
          }
      } else {
          this.toast.show('Không thể tạo lại: Thiếu callback xử lý', 'error');
      }
  }

  formatPublishDate(timestamp: any): string {
      if (!timestamp) return 'Chưa rõ';
      if (timestamp && typeof timestamp.toDate === 'function') {
          return timestamp.toDate().toLocaleString('vi-VN');
      }
      if (timestamp instanceof Date) {
          return timestamp.toLocaleString('vi-VN');
      }
      if (typeof timestamp === 'number' || typeof timestamp === 'string') {
          return new Date(timestamp).toLocaleString('vi-VN');
      }
      return 'Vừa xong';
  }
}
