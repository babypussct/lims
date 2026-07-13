
import { Injectable, inject, signal } from '@angular/core';
import { CalculatorService } from './calculator.service';
import { CalculatedItem } from '../models/sop.model';
import { ToastService } from './toast.service';
import { StateService } from './state.service';
import { GoogleDriveService } from './google-drive.service';

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
  private googleDriveService = inject(GoogleDriveService);

  // Operations state
  isPrinting = signal<boolean>(false);
  isDownloading = signal<boolean>(false);
  
  // Loading state
  isProcessing = signal<boolean>(false);

  constructor() {
      // Preload Google Drive SDK to make it ready for quick print/download
      this.googleDriveService.ensureInitialized().catch(e => console.warn('PrintService: GIS preload deferred:', e));
  }

  // PREVIEW STATE (Used by Modal)
  isPreviewOpen = signal<boolean>(false);
  previewJobs = signal<PrintJob[]>([]);
  
  // NEW PDF VIEWING STATE
  isPreviewPdfOpen = signal<boolean>(false);
  pdfUrl = signal<string | null>(null);
  docsUrl = signal<string | null>(null);
  pdfTitle = signal<string>('');
  pdfVersion = signal<number>(1);
  pdfAnalyst = signal<string>('Chưa rõ');
  pdfPublishDate = signal<any>(null);
  pdfPreviewType = signal<'iframe' | 'image'>('iframe');
  onRepublishCallback = signal<(() => Promise<void>) | null>(null);

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

  // --- 2. ENTRY POINT: OPEN PDF CLOUD PREVIEW ---
  openPdfPreview(url: string, title: string, version: number, analyst: string, publishDate: any, onRepublish?: () => Promise<void>, previewType: 'iframe' | 'image' = 'iframe', docsUrl?: string) {
      this.pdfUrl.set(url);
      this.docsUrl.set(docsUrl || null);
      this.pdfTitle.set(title);
      this.pdfVersion.set(version);
      this.pdfAnalyst.set(analyst);
      this.pdfPublishDate.set(publishDate);
      this.pdfPreviewType.set(previewType);
      if (onRepublish) {
          this.onRepublishCallback.set(onRepublish);
      } else {
          this.onRepublishCallback.set(null);
      }
      this.isPreviewPdfOpen.set(true);
  }

  // --- 3. ENTRY POINT: OPEN COA PREVIEW ---
  openCoaPreview(url: string, title: string = 'Certificate of Analysis') {
      if (!url) return;
      const cleanUrl = url.split('?')[0].toLowerCase();
      const isImage = /\.(jpeg|jpg|gif|png|webp|bmp|svg)$/.test(cleanUrl);
      this.openPdfPreview(
          url,
          title,
          0,
          'Hệ thống',
          null,
          undefined,
          isImage ? 'image' : 'iframe'
      );
  }

  closePdfPreview() {
      this.isPreviewPdfOpen.set(false);
      this.pdfUrl.set(null);
      this.docsUrl.set(null);
      this.onRepublishCallback.set(null);
  }

  // --- 4. QUICK PRINT (No modal required) ---
  private getFileId(url: string | null): string | null {
      if (!url) return null;
      const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
      return match ? match[1] : null;
  }

  async quickPrint(pdfUrl: string): Promise<void> {
      const id = this.getFileId(pdfUrl);
      if (!id) {
          window.open(pdfUrl, '_blank');
          return;
      }

      // Khởi tạo xác thực đồng bộ trước khi vào luồng async để tránh bị trình duyệt chặn popup
      if (!this.googleDriveService.hasValidToken) {
          try {
              if (!this.googleDriveService.canAuthSync) {
                  this.toast.show('Đang chuẩn bị dịch vụ Google Drive...', 'info');
                  await this.googleDriveService.ensureInitialized();
              }
              await new Promise<void>((resolve, reject) => {
                  this.googleDriveService.authenticateSync(
                      () => resolve(),
                      (err) => reject(new Error(err))
                  );
              });
          } catch (authErr: any) {
              window.open(`https://drive.google.com/file/d/${id}/preview`, '_blank');
              this.toast.show('Đang mở trang xem trước. Nhấn biểu tượng Máy in để in.', 'info');
              return;
          }
      }

      try {
          this.isPrinting.set(true);
          this.toast.show('Đang chuẩn bị dữ liệu in...', 'info');
          await this.googleDriveService.ensureAuthenticated();
          const rawBlob = await this.googleDriveService.downloadFile(id);
          // Ép kiểu Blob thành application/pdf để trình duyệt hiển thị trong iframe thay vì tải xuống
          const blob = new Blob([rawBlob], { type: 'application/pdf' });
          const blobUrl = URL.createObjectURL(blob);

          const iframe = document.createElement('iframe');
          iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
          iframe.src = blobUrl;
          document.body.appendChild(iframe);

          iframe.onload = () => {
              iframe.contentWindow?.focus();
              iframe.contentWindow?.print();
              setTimeout(() => {
                  if (document.body.contains(iframe)) document.body.removeChild(iframe);
                  URL.revokeObjectURL(blobUrl);
              }, 60000);
          };
      } catch (err: any) {
          window.open(`https://drive.google.com/file/d/${id}/preview`, '_blank');
          this.toast.show('Đang mở trang xem trước. Nhấn biểu tượng Máy in để in.', 'info');
      } finally {
          this.isPrinting.set(false);
      }
  }

  // --- 5. QUICK DOWNLOAD (Silent background download) ---
  async quickDownload(pdfUrl: string, fileName: string = 'document.pdf'): Promise<void> {
      const id = this.getFileId(pdfUrl);
      if (!id) {
          window.open(pdfUrl, '_blank');
          return;
      }

      // Khởi tạo xác thực đồng bộ trước khi vào luồng async để tránh bị trình duyệt chặn popup
      if (!this.googleDriveService.hasValidToken) {
          try {
              if (!this.googleDriveService.canAuthSync) {
                  this.toast.show('Đang chuẩn bị dịch vụ Google Drive...', 'info');
                  await this.googleDriveService.ensureInitialized();
              }
              await new Promise<void>((resolve, reject) => {
                  this.googleDriveService.authenticateSync(
                      () => resolve(),
                      (err) => reject(new Error(err))
                  );
              });
          } catch (authErr: any) {
              console.error('[Download] Auth failed, falling back to direct download link:', authErr);
              this.toast.show('Tải thất bại, chuyển sang tab mới...', 'warning');
              window.open(`https://drive.google.com/uc?export=download&id=${id}`, '_blank');
              return;
          }
      }

      try {
          this.isDownloading.set(true);
          this.toast.show('Đang tải dữ liệu, vui lòng đợi...', 'info');
          
          await this.googleDriveService.ensureAuthenticated();
          const blob = await this.googleDriveService.downloadFile(id);
          const blobUrl = URL.createObjectURL(blob);
          
          // Tạo thẻ <a> ảo để trigger download
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = blobUrl;
          a.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
          
          document.body.appendChild(a);
          a.click();
          
          // Cleanup
          setTimeout(() => {
              if (document.body.contains(a)) document.body.removeChild(a);
              URL.revokeObjectURL(blobUrl);
          }, 1000);
          
      } catch (err: any) {
          console.error('[Download] Failed to download silently:', err);
          this.toast.show('Tải thất bại, chuyển sang tab mới...', 'warning');
          window.open(`https://drive.google.com/uc?export=download&id=${id}`, '_blank');
      } finally {
          this.isDownloading.set(false);
      }
  }

  // NOTE: Actual printing/PDF generation logic is now handled by
  // PrintPreviewModalComponent using native window.print() (Direct DOM)
  // and html2canvas + jsPDF (High-Fidelity PDF Export).
  // This service now strictly manages the Preview State.
}
