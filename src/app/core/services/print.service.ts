
import { Injectable, inject, ApplicationRef, EnvironmentInjector, createComponent, ComponentRef, signal } from '@angular/core';
import { CalculatorService } from './calculator.service';
import { BatchItem } from './batch.service';
import { CalculatedItem } from '../models/sop.model';
import { ToastService } from './toast.service';
import { PrintLayoutComponent } from '../../shared/components/print-layout/print-layout.component';

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

@Injectable({ providedIn: 'root' })
export class PrintService {
  private calc = inject(CalculatorService);
  private toast = inject(ToastService);
  private appRef = inject(ApplicationRef);
  private injector = inject(EnvironmentInjector);
  
  // Loading state for UI feedback
  isProcessing = signal<boolean>(false);

  // CONSTANTS
  private readonly MAX_ROWS_PER_SLIP = 10; // Max rows per A5 slip to prevent overflow
  private readonly DESKTOP_MIN_WIDTH = 1024; // Min width to allow printing

  private printComponentRef: ComponentRef<PrintLayoutComponent> | null = null;

  // --- Dynamic Print (Direct Injection) ---
  async printDocument(jobs: PrintJob[]) {
    // 1. Mobile Guard (Security & UX)
    if (window.innerWidth < this.DESKTOP_MIN_WIDTH) {
        this.toast.show('Vui lòng sử dụng MÁY TÍNH để in phiếu (Khổ A4).', 'error');
        return;
    }

    // Null safety check for jobs
    if (!jobs || jobs.length === 0) {
      this.toast.show('Không có dữ liệu để in.', 'error');
      return;
    }

    // Sanitize jobs (Prevent NULL Access Error)
    const validJobs = jobs.filter(j => j && j.sop && j.items);
    if (validJobs.length === 0) {
        this.toast.show('Dữ liệu in bị lỗi hoặc thiếu thông tin.', 'error');
        return;
    }

    // CRITICAL FIX: Always cleanup previous artifacts BEFORE starting a new one.
    // This prevents the "zombie component" issue where the second print fails to attach.
    this.cleanup();

    this.isProcessing.set(true);

    // 2. Dynamic Pagination (Chunking)
    const processedJobs = this.splitLongJobs(validJobs);

    // SAFETY WATCHDOG: Force unlock UI after 5 seconds max if something hangs.
    const watchdog = setTimeout(() => {
        if (this.isProcessing()) {
            console.warn("Print Service: Watchdog triggered - Forcing UI unlock.");
            this.isProcessing.set(false);
            this.cleanup();
        }
    }, 5000);

    try {
      // 3. Locate or Create the Container
      const container = document.getElementById('print-container');
      if (!container) {
        console.error('Print container #print-container not found in index.html');
        clearTimeout(watchdog);
        this.isProcessing.set(false);
        return;
      }
      
      // Double check clear
      container.innerHTML = '';

      // 4. Dynamically Create Component
      this.printComponentRef = createComponent(PrintLayoutComponent, {
        environmentInjector: this.injector,
        hostElement: container
      });

      // 5. Pass Data
      this.printComponentRef.instance.jobs = processedJobs;
      this.printComponentRef.instance.isDirectPrint = true;

      // 6. Trigger Change Detection
      this.appRef.attachView(this.printComponentRef.hostView);
      this.printComponentRef.changeDetectorRef.detectChanges();

      // 7. Robust Print Trigger
      setTimeout(() => {
          // Clear the safety watchdog, we are taking control.
          clearTimeout(watchdog);

          // Unlock the UI *immediately* before opening the dialog so users don't feel stuck.
          this.isProcessing.set(false);

          // Setup Cleanup Listener (Modern Browsers)
          // This ensures we clean up AFTER the user clicks Print or Cancel
          const cleanupListener = () => {
              this.cleanup();
              window.removeEventListener('afterprint', cleanupListener);
          };
          window.addEventListener('afterprint', cleanupListener);

          // Execute Print
          window.print();

          // Fallback Cleanup: For browsers that might not fire 'afterprint' reliably or if scripts are blocked
          // We clear the DOM after a delay anyway to be safe for the NEXT print.
          setTimeout(() => {
              this.cleanup();
              window.removeEventListener('afterprint', cleanupListener);
          }, 2000); 

      }, 500); // 500ms delay to ensure DOM paint

    } catch (e) {
      console.error("Print Error:", e);
      clearTimeout(watchdog);
      this.toast.show('Lỗi khởi tạo in ấn.', 'error');
      this.cleanup();
      this.isProcessing.set(false);
    }
  }

  private splitLongJobs(originalJobs: PrintJob[]): PrintJob[] {
      const result: PrintJob[] = [];

      for (const job of originalJobs) {
          // If items fit within one slip, keep as is
          if (job.items.length <= this.MAX_ROWS_PER_SLIP) {
              result.push(job);
              continue;
          }

          // If items exceed limit, chunk them
          const chunks = [];
          for (let i = 0; i < job.items.length; i += this.MAX_ROWS_PER_SLIP) {
              chunks.push(job.items.slice(i, i + this.MAX_ROWS_PER_SLIP));
          }

          chunks.forEach((chunkItems, index) => {
              const isFirst = index === 0;
              const pageNum = index + 1;
              const totalPages = chunks.length;

              // Create a shallow copy for the new job part
              const newJob: PrintJob = {
                  ...job,
                  items: chunkItems,
                  // Append pagination info to SOP Name for clear identification on paper
                  sop: {
                      ...job.sop,
                      name: isFirst ? job.sop.name : `${job.sop.name} (Tiếp theo - ${pageNum}/${totalPages})`
                  }
              };
              result.push(newJob);
          });
      }
      return result;
  }

  private cleanup() {
    try {
        if (this.printComponentRef) {
          this.appRef.detachView(this.printComponentRef.hostView);
          this.printComponentRef.destroy();
          this.printComponentRef = null;
        }
        const container = document.getElementById('print-container');
        if (container) {
            container.innerHTML = '';
        }
    } catch (e) {
        console.warn("Print cleanup warning:", e);
    }
  }

  // Helper for Batch Requests
  async printBatch(requests: BatchItem[], currentUser?: string) {
    try {
      const jobs: PrintJob[] = requests.map(req => ({
        sop: req.sop,
        inputs: req.inputs,
        margin: req.margin,
        date: new Date(),
        user: currentUser || 'Unknown',
        items: this.calc.calculateSopNeeds(req.sop, req.inputs, req.margin),
        requestId: `REQ-${Date.now()}-${Math.floor(Math.random()*1000)}`
      }));
      
      await this.printDocument(jobs);
    } catch (e) {
      this.toast.show('Lỗi chuẩn bị dữ liệu in.', 'error');
    }
  }
}
