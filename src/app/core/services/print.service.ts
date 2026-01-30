
import { Injectable, inject, signal } from '@angular/core';
import { CalculatorService } from './calculator.service';
import { CalculatedItem } from '../models/sop.model';
import { ToastService } from './toast.service';
import { StateService } from './state.service';

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
  private toast = inject(ToastService);
  
  // Loading state
  isProcessing = signal<boolean>(false);

  // PREVIEW STATE (Used by Modal)
  isPreviewOpen = signal<boolean>(false);
  previewJobs = signal<PrintJob[]>([]);
  
  // Default Options
  defaultOptions: PrintOptions = {
      showHeader: true,
      showFooter: true,
      showSignature: true,
      showCutLine: true
  };

  // --- 1. ENTRY POINT: OPEN PREVIEW ---
  openPreview(jobs: PrintJob[]) {
      if (!jobs || jobs.length === 0) {
          this.toast.show('Không có dữ liệu để in.', 'error');
          return;
      }
      this.previewJobs.set(jobs);
      this.isPreviewOpen.set(true);
  }

  closePreview() {
      this.isPreviewOpen.set(false);
      this.previewJobs.set([]);
  }

  // NOTE: Actual printing/PDF generation logic is now handled by 
  // PrintPreviewModalComponent using native window.print() (Direct DOM)
  // and html2canvas + jsPDF (High-Fidelity PDF Export).
  // This service now strictly manages the Preview State.
}
