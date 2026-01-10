
import { Injectable, inject, signal } from '@angular/core';
import { CalculatorService } from './calculator.service';
import { BatchItem } from './batch.service';
import { CalculatedItem } from '../models/sop.model';
import { ToastService } from './toast.service';

export interface PrintJob extends BatchItem {
  items: CalculatedItem[];
  date: Date;
  user?: string; 
  analysisDate?: string;
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

  /**
   * Opens a new popup window for printing.
   */
  printPopup(htmlContent: string) {
      if (!htmlContent) {
          this.toast.show('Không có nội dung để in.', 'error');
          return;
      }
      
      const printWindow = window.open('', '_blank', 'width=1000,height=800');
      if (!printWindow) {
          this.toast.show('Trình duyệt đã chặn cửa sổ bật lên (Popup). Vui lòng cho phép để in.', 'error');
          return;
      }

      const doc = printWindow.document;
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>LIMS Print Job</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap" rel="stylesheet">
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
          <style>
            body { background-color: #f1f5f9; margin: 0; font-family: 'Roboto', sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .print-wrapper { padding: 40px 0; display: flex; flex-direction: column; align-items: center; gap: 20px; }
            .print-page { 
                width: 210mm; height: 296mm; background: white; margin: 0; 
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden; position: relative;
            }
            .whitespace-nowrap { white-space: nowrap !important; }
            @media print {
                body { background-color: white; margin: 0; }
                .print-wrapper { padding: 0; display: block; }
                .print-page { margin: 0; box-shadow: none; page-break-after: always; border: none; width: 210mm; height: 296mm; }
                .print-page:last-child { page-break-after: auto; }
                .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          <div class="print-wrapper">${htmlContent}</div>
          <script>
            window.onload = () => { setTimeout(() => { window.focus(); window.print(); }, 800); };
          </script>
        </body>
        </html>
      `);
      doc.close();
  }

  async exportToPdf() {
    const pages = Array.from(document.querySelectorAll('app-batch-print .print-page'));

    if (pages.length === 0) {
      this.toast.show('Không tìm thấy trang in. Hãy chắc chắn bạn đang ở màn hình Xem trước.', 'info');
      return;
    }

    this.isProcessing.set(true);
    this.toast.show('Đang tải thư viện PDF...', 'info');
    
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      // DYNAMIC IMPORTS: Updated to use package names instead of CDN URLs
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
