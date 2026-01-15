
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

  private printComponentRef: ComponentRef<PrintLayoutComponent> | null = null;

  // --- Dynamic Print (Direct Injection) ---
  async printDocument(jobs: PrintJob[]) {
    if (!jobs || jobs.length === 0) {
      this.toast.show('Không có dữ liệu để in.', 'error');
      return;
    }

    this.isProcessing.set(true);

    try {
      // 1. Locate or Create the Container
      const container = document.getElementById('print-container');
      if (!container) {
        console.error('Print container #print-container not found in index.html');
        this.isProcessing.set(false);
        return;
      }
      
      // Clear previous content
      container.innerHTML = '';

      // 2. Dynamically Create Component
      this.printComponentRef = createComponent(PrintLayoutComponent, {
        environmentInjector: this.injector,
        hostElement: container
      });

      // 3. Pass Data
      this.printComponentRef.instance.jobs = jobs;
      this.printComponentRef.instance.isDirectPrint = true;

      // 4. Trigger Change Detection
      this.appRef.attachView(this.printComponentRef.hostView);
      this.printComponentRef.changeDetectorRef.detectChanges();

      // 5. Wait for Rendering (Images/QR) -> Then Print
      setTimeout(() => {
        window.print();
        
        // 6. Cleanup after a delay to ensure print dialog has captured the content
        setTimeout(() => {
           this.cleanup();
           this.isProcessing.set(false);
        }, 1000); 

      }, 500);

    } catch (e) {
      console.error("Print Error:", e);
      this.toast.show('Lỗi khởi tạo in ấn.', 'error');
      this.cleanup();
      this.isProcessing.set(false);
    }
  }

  private cleanup() {
    if (this.printComponentRef) {
      this.appRef.detachView(this.printComponentRef.hostView);
      this.printComponentRef.destroy();
      this.printComponentRef = null;
    }
    const container = document.getElementById('print-container');
    if (container) container.innerHTML = '';
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
