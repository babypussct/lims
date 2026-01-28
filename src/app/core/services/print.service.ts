
import { Injectable, inject, ApplicationRef, EnvironmentInjector, createComponent, ComponentRef, signal, EmbeddedViewRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CalculatorService } from './calculator.service';
import { BatchItem } from './batch.service';
import { CalculatedItem } from '../models/sop.model';
import { ToastService } from './toast.service';
import { PrintLayoutComponent } from '../../shared/components/print-layout/print-layout.component';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export interface PrintJob {
  sop: any; 
  inputs: any;
  margin: number;
  items: CalculatedItem[];
  date: Date | string; 
  user?: string; 
  analysisDate?: string;
  requestId?: string; 
}

export interface PrintOptions {
    showHeader: boolean;
    showFooter: boolean;
    showSignature: boolean;
    showCutLine: boolean;
}

@Injectable({ providedIn: 'root' })
export class PrintService {
  private calc = inject(CalculatorService);
  private toast = inject(ToastService);
  private appRef = inject(ApplicationRef);
  private injector = inject(EnvironmentInjector);
  private document = inject(DOCUMENT) as Document;
  
  // Loading state
  isProcessing = signal<boolean>(false);

  // PREVIEW STATE
  isPreviewOpen = signal<boolean>(false);
  previewJobs = signal<PrintJob[]>([]);
  
  // Default Options
  defaultOptions: PrintOptions = {
      showHeader: true,
      showFooter: true,
      showSignature: true,
      showCutLine: true
  };

  // CONSTANTS
  private readonly MAX_ROWS_PER_SLIP = 10;
  private readonly DESKTOP_MIN_WIDTH = 1024;

  // --- 1. ENTRY POINT: OPEN PREVIEW ---
  openPreview(jobs: PrintJob[]) {
      if (!jobs || jobs.length === 0) {
          this.toast.show('Không có dữ liệu để in.', 'error');
          return;
      }
      // Chunk jobs immediately for preview accuracy
      const processed = this.splitLongJobs(jobs);
      this.previewJobs.set(processed);
      this.isPreviewOpen.set(true);
  }

  closePreview() {
      this.isPreviewOpen.set(false);
      this.previewJobs.set([]);
  }

  // --- 2. EXECUTE PRINT (Sandboxed Iframe) ---
  async printDocument(jobs: PrintJob[], options: PrintOptions = this.defaultOptions) {
    if (window.innerWidth < this.DESKTOP_MIN_WIDTH) {
        this.toast.show('Vui lòng sử dụng MÁY TÍNH để in phiếu (Khổ A4).', 'error');
        return;
    }

    this.isProcessing.set(true);

    try {
        // 1. Create Sandbox Iframe
        const iframe = this.document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.top = '0';
        iframe.style.left = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = 'none';
        iframe.style.visibility = 'hidden';
        
        this.document.body.appendChild(iframe);
        const doc = iframe.contentWindow?.document;
        const win = iframe.contentWindow;

        if (!doc || !win) {
            throw new Error('Cannot access iframe document');
        }

        // 2. Inject Styles
        doc.open();
        doc.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>LIMS Print Job</title>
                <meta charset="UTF-8">
                <script src="https://cdn.tailwindcss.com"></script>
                <script>
                    tailwind.config = { theme: { extend: { colors: { gray: { 50: '#f8f9fa' } } } } }
                </script>
                <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
                <script src="https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js"></script>
                <style>
                    body { background: white; margin: 0; padding: 0; font-family: 'Open Sans', sans-serif; }
                    @media print {
                        @page { size: A4 portrait; margin: 0; }
                        body { -webkit-print-color-adjust: exact; }
                    }
                </style>
            </head>
            <body>
                <div id="app-print-root"></div>
            </body>
            </html>
        `);
        doc.close();

        // 3. Angular Component Injection
        const componentRef = createComponent(PrintLayoutComponent, {
            environmentInjector: this.injector,
            hostElement: doc.getElementById('app-print-root')!
        });

        // Pass Data & Options (Cast to specific component type)
        const instance = componentRef.instance as PrintLayoutComponent;
        instance.jobs = jobs; 
        instance.isDirectPrint = true;
        instance.options = options;

        this.appRef.attachView(componentRef.hostView);
        componentRef.changeDetectorRef.detectChanges();

        // 4. Wait & Print
        setTimeout(() => {
            this.isProcessing.set(false);
            try {
                win.focus();
                win.print();
            } catch (e) {
                console.warn('Print blocked:', e);
            }

            // Cleanup
            setTimeout(() => {
                this.appRef.detachView(componentRef.hostView);
                componentRef.destroy();
                if (this.document.body.contains(iframe)) {
                    this.document.body.removeChild(iframe);
                }
            }, 2000);

        }, 1000); 

    } catch (e) {
        console.error("Iframe Print Error:", e);
        this.toast.show('Lỗi khởi tạo in ấn.', 'error');
        this.isProcessing.set(false);
    }
  }

  // --- 3. EXECUTE PDF DOWNLOAD ---
  async downloadPdf(jobs: PrintJob[], options: PrintOptions = this.defaultOptions) {
      if (!jobs || jobs.length === 0) return;
      this.isProcessing.set(true);
      
      const container = this.document.createElement('div');
      container.style.position = 'fixed';
      container.style.top = '-10000px';
      container.style.left = '-10000px';
      container.style.width = '210mm'; // A4 Width
      container.style.background = '#ffffff';
      container.style.zIndex = '-100';
      this.document.body.appendChild(container);

      try {
          const componentRef = createComponent(PrintLayoutComponent, {
              environmentInjector: this.injector,
              hostElement: container
          });
          
          // Cast instance
          const instance = componentRef.instance as PrintLayoutComponent;
          instance.jobs = jobs;
          instance.isDirectPrint = true;
          instance.options = options;

          this.appRef.attachView(componentRef.hostView);
          componentRef.changeDetectorRef.detectChanges();

          await new Promise(resolve => setTimeout(resolve, 800));

          const pages = container.querySelectorAll('.print-page');
          if (pages.length === 0) throw new Error('No pages rendered');

          const pdf = new jsPDF('p', 'mm', 'a4');
          const pdfWidth = 210;
          const pdfHeight = 297;

          for (let i = 0; i < pages.length; i++) {
              const pageEl = pages[i] as HTMLElement;
              const canvas = await html2canvas(pageEl, {
                  scale: 2,
                  useCORS: true,
                  logging: false,
                  backgroundColor: '#ffffff'
              });
              const imgData = canvas.toDataURL('image/jpeg', 0.95);
              if (i > 0) pdf.addPage();
              pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
          }

          const fileName = `LIMS_Phieu_${new Date().toISOString().slice(0,10)}.pdf`;
          pdf.save(fileName);
          this.toast.show('Đã tải PDF thành công!', 'success');

          this.appRef.detachView(componentRef.hostView);
          componentRef.destroy();

      } catch (e: any) {
          console.error("PDF Generation Error:", e);
          this.toast.show('Lỗi tạo PDF: ' + e.message, 'error');
      } finally {
          if (this.document.body.contains(container)) {
              this.document.body.removeChild(container);
          }
          this.isProcessing.set(false);
      }
  }

  private splitLongJobs(originalJobs: PrintJob[]): PrintJob[] {
      const result: PrintJob[] = [];
      for (const job of originalJobs) {
          if (job.items.length <= this.MAX_ROWS_PER_SLIP) {
              result.push(job);
              continue;
          }
          const chunks = [];
          for (let i = 0; i < job.items.length; i += this.MAX_ROWS_PER_SLIP) {
              chunks.push(job.items.slice(i, i + this.MAX_ROWS_PER_SLIP));
          }
          chunks.forEach((chunkItems, index) => {
              const newJob: PrintJob = {
                  ...job,
                  items: chunkItems,
                  sop: {
                      ...job.sop,
                      name: index === 0 ? job.sop.name : `${job.sop.name} (Tiếp theo - ${index + 1}/${chunks.length})`
                  }
              };
              result.push(newJob);
          });
      }
      return result;
  }
}
