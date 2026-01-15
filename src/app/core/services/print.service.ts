
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CalculatorService } from './calculator.service';
import { BatchItem } from './batch.service';
import { CalculatedItem } from '../models/sop.model';
import { ToastService } from './toast.service';

export interface PrintJob {
  sop: any; // Using any to decouple strictly for storage
  inputs: any;
  margin: number;
  items: CalculatedItem[];
  date: Date | string; // Allow string for serialization
  user?: string; 
  analysisDate?: string;
}

@Injectable({ providedIn: 'root' })
export class PrintService {
  private calc = inject(CalculatorService);
  private toast = inject(ToastService);
  private router = inject(Router);
  
  // State for the Preview Screen
  jobs = signal<PrintJob[]>([]);
  isProcessing = signal(false);

  prepareSinglePrint(job: PrintJob) {
    this.jobs.set([job]);
  }

  async prepareBatchPrint(requests: BatchItem[], currentUser?: string): Promise<boolean> {
    if (requests.length === 0 || this.isProcessing()) return false;

    this.isProcessing.set(true);
    this.jobs.set([]);

    // Small delay to allow UI to show spinner
    await new Promise(resolve => setTimeout(resolve, 50)); 

    try {
      const newJobs: PrintJob[] = requests.map(req => ({
        sop: req.sop,
        inputs: req.inputs,
        margin: req.margin,
        date: new Date(),
        user: currentUser || 'Unknown',
        items: this.calc.calculateSopNeeds(req.sop, req.inputs, req.margin)
      }));
      
      this.jobs.set(newJobs);
      return true;

    } catch (e) {
      console.error("Error during print preparation:", e);
      this.toast.show('Lỗi khi chuẩn bị bản in.', 'error');
      return false;
    } finally {
       this.isProcessing.set(false);
    }
  }

  /**
   * NEW METHOD: Opens the print route in a new tab/window.
   * Uses LocalStorage to transfer data since Signals don't share across tabs.
   */
  openPrintWindow() {
      const jobsData = this.jobs();
      
      if (!jobsData || jobsData.length === 0) {
          this.toast.show('Không có dữ liệu để in.', 'error');
          return;
      }

      try {
          // 1. Serialize data
          const serializedData = JSON.stringify(jobsData);
          localStorage.setItem('lims_print_queue', serializedData);

          // 2. Construct URL manually for Hash Strategy correctness
          // window.location.href usually includes the hash if we are in the app.
          // We want base url + #/print-job
          const baseUrl = window.location.href.split('#')[0];
          const targetUrl = `${baseUrl}#/print-job`;
          
          // Open in new window with specific specs to look like a popup dialog
          const printWindow = window.open(targetUrl, '_blank', 'width=1000,height=800,menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes');

          if (!printWindow) {
              this.toast.show('Trình duyệt đã chặn cửa sổ bật lên (Popup). Vui lòng cho phép để in.', 'error');
          }
      } catch (e) {
          console.error("Print Error:", e);
          this.toast.show('Lỗi khởi tạo in ấn.', 'error');
      }
  }

  async exportToPdf() {
    // Note: PDF generation usually happens in the Preview component context, 
    // referencing the DOM elements there.
    const pages = Array.from(document.querySelectorAll('app-batch-print .print-page'));

    if (pages.length === 0) {
      this.toast.show('Không tìm thấy trang in. Hãy chắc chắn bạn đang ở màn hình Xem trước.', 'info');
      return;
    }

    this.isProcessing.set(true);
    this.toast.show('Đang tải thư viện PDF...', 'info');
    
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const doc = new jsPDF('p', 'mm', 'a4'); 
      const pdfWidth = 210;
      const pdfHeight = 297;

      const len = pages.length;
      for (let i = 0; i < len; i++) {
        const element = pages[i] as HTMLElement;

        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
          allowTaint: true,
          backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        if (i > 0) doc.addPage();
        doc.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      }
      
      const dateStr = new Date().toISOString().slice(0, 10);
      doc.save(`LIMS_PhieuDuTru_Batch_${dateStr}.pdf`);
      this.toast.show('Xuất PDF thành công!', 'success');

    } catch(e: any) {
      console.error(e);
      this.toast.show('Lỗi khi xuất PDF: ' + e.message, 'error');
    } finally {
      this.isProcessing.set(false);
    }
  }
}
