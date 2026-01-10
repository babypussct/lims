
import { Injectable, inject, signal } from '@angular/core';
import { CalculatorService } from './calculator.service';
import { BatchItem } from './batch.service';
import { CalculatedItem } from '../models/sop.model';
import { ToastService } from './toast.service';

declare const html2canvas: any;
declare const jspdf: any;

export interface PrintJob extends BatchItem {
  items: CalculatedItem[];
  date: Date;
  user?: string; 
}

@Injectable({ providedIn: 'root' })
export class PrintService {
  private calc = inject(CalculatorService);
  private toast = inject(ToastService);
  
  jobs = signal<PrintJob[]>([]);
  isProcessing = signal(false);

  prepareSinglePrint(job: PrintJob) {
    this.jobs.set([job]);
  }

  async prepareBatchPrint(requests: BatchItem[], currentUser?: string): Promise<boolean> {
    if (requests.length === 0 || this.isProcessing()) return false;

    this.isProcessing.set(true);
    this.jobs.set([]);

    await new Promise(resolve => setTimeout(resolve, 50)); 

    try {
      const newJobs: PrintJob[] = requests.map(req => ({
        ...req,
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

  triggerBrowserPrint() {
    if (this.jobs().length === 0) {
      this.toast.show('Không có gì để in.', 'info');
      return;
    }

    const originalTitle = document.title;
    const dateStr = new Date().toISOString().slice(0, 10);
    const count = this.jobs().length;
    document.title = `LIMS_PhieuDuTru_${count}SOP_${dateStr}`;

    setTimeout(() => {
      window.print();
      document.title = originalTitle;
    }, 100);
  }

  async exportToPdf() {
    // Scope to app-batch-print to ensure we get the visible elements from the preview screen
    const pages = Array.from(document.querySelectorAll('app-batch-print .print-page'));

    if (pages.length === 0) {
      this.toast.show('Không tìm thấy trang in. Hãy chắc chắn bạn đang ở màn hình Xem trước.', 'info');
      return;
    }

    this.isProcessing.set(true);
    this.toast.show('Đang xử lý hình ảnh...', 'info');
    
    // Slight delay to allow UI to update
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const { jsPDF } = jspdf;
      // Initialize PDF: A4, Portrait, Millimeters
      const doc = new jsPDF('p', 'mm', 'a4'); 
      const pdfWidth = 210;
      const pdfHeight = 297;

      const len = pages.length;
      for (let i = 0; i < len; i++) {
        const element = pages[i] as HTMLElement;

        // Use html2canvas to capture the exact visual representation
        // scale: 2 ensures high quality text (good balance between size and clarity)
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
          allowTaint: true,
          backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95); // High quality JPEG
        
        if (i > 0) doc.addPage();
        
        // Add image to cover the full A4 page
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
