
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
  private readonly pendingPreviewKey = '__gd_pending_pdf_preview';
  private toast = inject(ToastService);
  private googleDriveService = inject(GoogleDriveService);

  // Operations state
  isPrinting = signal<boolean>(false);
  isDownloading = signal<boolean>(false);
  
  // Loading state
  isProcessing = signal<boolean>(false);

  constructor() {
      this.restorePendingPdfPreview();
  }

  // PREVIEW STATE (Used by Modal)
  isPreviewOpen = signal<boolean>(false);
  previewJobs = signal<PrintJob[]>([]);
  
  // NEW PDF VIEWING STATE
  isPreviewPdfOpen = signal<boolean>(false);
  pdfUrl = signal<string | null>(null);
  pdfBlobUrl = signal<string | null>(null);
  isPdfBlobLoading = signal<boolean>(false);
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
      const docsPreviewUrl = docsUrl ? docsUrl.replace(/\/edit.*$/, '/preview') : null;
      this.docsUrl.set(docsPreviewUrl);
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
      
      // Load Blob URL for iframe to avoid Google Drive CSP frame restrictions
      if (previewType === 'iframe') {
          this.loadPdfBlobForPreview(url);
      } else {
          this.pdfBlobUrl.set(url); // For images, standard URL is usually fine
      }
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
      
      // Cleanup Blob URL
      const currentBlob = this.pdfBlobUrl();
      if (currentBlob && currentBlob.startsWith('blob:')) {
          URL.revokeObjectURL(currentBlob);
      }
      this.pdfBlobUrl.set(null);
      this.isPdfBlobLoading.set(false);
      
      this.docsUrl.set(null);
      this.onRepublishCallback.set(null);
  }

  /** Restores the document after redirect OAuth returns to the application. */
  private restorePendingPdfPreview(): void {
      const raw = sessionStorage.getItem(this.pendingPreviewKey);
      if (!raw) return;
      sessionStorage.removeItem(this.pendingPreviewKey);

      try {
          const pending = JSON.parse(raw);
          if (!pending?.url) return;
          this.openPdfPreview(
              pending.url,
              pending.title || 'Tài liệu',
              pending.version || 1,
              pending.analyst || 'Chưa rõ',
              pending.publishDate ?? null,
              undefined,
              pending.previewType === 'image' ? 'image' : 'iframe',
              pending.docsUrl
          );
      } catch (error) {
          console.warn('[Preview] Cannot restore preview after OAuth redirect:', error);
      }
  }

  private persistPendingPdfPreview(pdfUrl: string): void {
      sessionStorage.setItem(this.pendingPreviewKey, JSON.stringify({
          url: pdfUrl,
          title: this.pdfTitle(),
          version: this.pdfVersion(),
          analyst: this.pdfAnalyst(),
          publishDate: this.pdfPublishDate(),
          previewType: this.pdfPreviewType(),
          docsUrl: this.docsUrl()
      }));
  }

  // --- FETCH BLOB FOR PREVIEW (Bypass Google iframe CSP) ---
  // This runs automatically and only calls the same-origin Drive proxy. If
  // authorization is missing, the modal shows an explicit redirect button.
  private async loadPdfBlobForPreview(pdfUrl: string) {
      const id = this.getFileId(pdfUrl);
      if (!id) {
          this.pdfBlobUrl.set(pdfUrl);
          return;
      }

      this.isPdfBlobLoading.set(true);
      try {
          // Download through the same-origin server proxy. Google access and
          // refresh tokens remain in an encrypted HttpOnly cookie.
          let rawBlob: Blob;
          try {
              rawBlob = await this.googleDriveService.downloadFile(id);
          } catch (downloadErr: any) {
              if (downloadErr?.code === 'oauth_required') {
                  console.log('[Preview] Server OAuth session required.');
                  return;
              }
              const is401 = downloadErr.message?.includes('401') ||
                            downloadErr.message?.toLowerCase().includes('invalid authentication') ||
                            downloadErr.message?.toLowerCase().includes('invalid credential');

              if (is401) {
                  // Token hết hạn hoặc bị thu hồi → xóa cache, yêu cầu user xác thực lại
                  console.warn('[Preview] 401 — stale token cleared. User must re-authenticate.');
                  this.googleDriveService.clearSession();
                  this.isPdfBlobLoading.set(false);
                  return; // UI hiện nút "Xác thực & Tải lại"
              }
              throw downloadErr;
          }

          const blob = new Blob([rawBlob!], { type: 'application/pdf' });
          const blobUrl = URL.createObjectURL(blob);

          if (this.isPreviewPdfOpen() && this.pdfUrl() === pdfUrl) {
              this.pdfBlobUrl.set(blobUrl);
              sessionStorage.removeItem(this.pendingPreviewKey);
          } else {
              URL.revokeObjectURL(blobUrl);
          }
      } catch (err: any) {
          console.error('[Preview] Failed to load PDF blob:', err);
          // pdfBlobUrl = null → UI hiện nút retry
      } finally {
          this.isPdfBlobLoading.set(false);
      }
  }


  // Called by "Xác thực & Tải lại". Authorization happens in the top-level
  // browser window through the server-side OAuth code flow.
  async retryLoadPdfBlob(): Promise<void> {
      const pdfUrl = this.pdfUrl();
      if (!pdfUrl) return;
      const id = this.getFileId(pdfUrl);
      if (!id) return;

      this.persistPendingPdfPreview(pdfUrl);

      this.isPdfBlobLoading.set(true);
      try {
          const hasServerSession = await this.googleDriveService.hasServerOAuthSession();
          if (!hasServerSession) {
              this.googleDriveService.beginRedirectAuth();
              return;
          }

          const rawBlob = await this.googleDriveService.downloadFile(id);
          const blob = new Blob([rawBlob], { type: 'application/pdf' });
          const blobUrl = URL.createObjectURL(blob);

          if (this.isPreviewPdfOpen() && this.pdfUrl() === pdfUrl) {
              this.pdfBlobUrl.set(blobUrl);
              sessionStorage.removeItem(this.pendingPreviewKey);
          } else {
              URL.revokeObjectURL(blobUrl);
          }
      } catch (err: any) {
          this.toast.show('Xác thực thất bại: ' + (err.message || 'Không xác định'), 'error');
      } finally {
          this.isPdfBlobLoading.set(false);
      }
  }

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

      // If we already loaded the blob for preview, reuse it!
      if (this.pdfUrl() === pdfUrl && this.pdfBlobUrl()?.startsWith('blob:')) {
          this.printBlobUrl(this.pdfBlobUrl()!);
          return;
      }

      if (!await this.googleDriveService.hasServerOAuthSession()) {
          this.persistPendingPdfPreview(pdfUrl);
          this.googleDriveService.beginRedirectAuth();
          return;
      }

      try {
          this.isPrinting.set(true);
          this.toast.show('Đang chuẩn bị dữ liệu in...', 'info');
          const rawBlob = await this.googleDriveService.downloadFile(id);
          const blob = new Blob([rawBlob], { type: 'application/pdf' });
          const blobUrl = URL.createObjectURL(blob);
          this.printBlobUrl(blobUrl, true);
      } catch (err: any) {
          console.error('[Print] Lỗi khi in nhanh:', err);
          this.toast.show('Không thể tải PDF để in. Đang mở bản xem trước...', 'warning');
          this.openPdfPreview(pdfUrl, 'Báo cáo (Cần in thủ công)', 1, 'Hệ thống', null, undefined, 'iframe');
      } finally {
          this.isPrinting.set(false);
      }
  }

  private printBlobUrl(blobUrl: string, autoRevoke: boolean = false) {
      const iframe = document.createElement('iframe');
      iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
      iframe.src = blobUrl;
      document.body.appendChild(iframe);

      iframe.onload = () => {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
          setTimeout(() => {
              if (document.body.contains(iframe)) document.body.removeChild(iframe);
              if (autoRevoke) URL.revokeObjectURL(blobUrl);
          }, 60000);
      };
  }

  async quickDownload(pdfUrl: string, fileName: string = 'document.pdf'): Promise<void> {
      const id = this.getFileId(pdfUrl);
      if (!id) {
          window.open(pdfUrl, '_blank');
          return;
      }

      // If we already loaded the blob for preview, reuse it!
      if (this.pdfUrl() === pdfUrl && this.pdfBlobUrl()?.startsWith('blob:')) {
          this.downloadBlobUrl(this.pdfBlobUrl()!, fileName);
          return;
      }

      if (!await this.googleDriveService.hasServerOAuthSession()) {
          this.persistPendingPdfPreview(pdfUrl);
          this.googleDriveService.beginRedirectAuth();
          return;
      }

      try {
          this.isDownloading.set(true);
          this.toast.show('Đang tải dữ liệu, vui lòng đợi...', 'info');
          const blob = await this.googleDriveService.downloadFile(id);
          const blobUrl = URL.createObjectURL(blob);
          this.downloadBlobUrl(blobUrl, fileName, true);
      } catch (err: any) {
          console.error('[Download] Failed to download silently:', err);
          this.toast.show('Không thể tải tài liệu từ Google Drive.', 'error');
      } finally {
          this.isDownloading.set(false);
      }
  }

  private downloadBlobUrl(blobUrl: string, fileName: string, autoRevoke: boolean = false) {
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = blobUrl;
      a.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
      
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
          if (document.body.contains(a)) document.body.removeChild(a);
          if (autoRevoke) URL.revokeObjectURL(blobUrl);
      }, 1000);
  }

  // NOTE: Actual printing/PDF generation logic is now handled by
  // PrintPreviewModalComponent using native window.print() (Direct DOM)
  // and html2canvas + jsPDF (High-Fidelity PDF Export).
  // This service now strictly manages the Preview State.
}
