import { Injectable, inject, signal } from '@angular/core';
import { CalculatorService } from './calculator.service';
import { BatchItem } from './batch.service';
import { CalculatedItem, Sop } from '../models/sop.model';

export interface PrintJob extends BatchItem {
  items: CalculatedItem[];
  date: Date;
}

@Injectable({ providedIn: 'root' })
export class PrintService {
  private calc = inject(CalculatorService);
  
  jobs = signal<PrintJob[]>([]);
  isPrinting = signal(false);

  /**
   * Generates calculated results for all requests and triggers print dialog
   */
  print(requests: BatchItem[]) {
    if (requests.length === 0) return;

    // 1. Prepare Jobs
    const newJobs: PrintJob[] = requests.map(req => ({
      ...req,
      date: new Date(),
      items: this.calc.calculateSopNeeds(req.sop, req.inputs, req.margin)
    }));
    
    this.jobs.set(newJobs);
    this.isPrinting.set(true);

    // 2. Temp Change Title for PDF Name
    const originalTitle = document.title;
    const dateStr = new Date().toISOString().slice(0, 10);
    const count = requests.length;
    document.title = `LIMS_PhieuDuTru_${count}SOP_${dateStr}`;

    // 3. Trigger Print
    setTimeout(() => {
      window.print();
      
      // 4. Cleanup
      this.isPrinting.set(false);
      document.title = originalTitle;
    }, 500);
  }
}