
import { Injectable, inject, signal } from '@angular/core';
import { CalculatorService } from './calculator.service';
import { CalculatedItem } from '../models/sop.model';
import { ToastService } from './toast.service';
import { StateService } from './state.service';
import { GoogleDriveService } from './google-drive.service';
import { openInNewTab } from '../../shared/utils/browser-navigation';
import { getSafeGooglePreviewUrl } from '../../shared/utils/report-url';
import { printWithCleanup } from '../../shared/utils/print-dom';

export interface PrintJob {
  sop: any; 
  inputs: any;
  margin: number;
  items: CalculatedItem[];
  date: Date | string; 
  user?: string; 
  analysisDate?: string;
  requestId?: string; 
  batchCode?: string;
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
  private state = inject(StateService);

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
  previewPreparedAt = signal(new Date());
  private pdfLoadRevision = 0;
  private pdfPrintController?: AbortController;
  
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

  // Default options resolve from the global print policy at preview-open time.
  get defaultOptions(): PrintOptions {
    return {
      showHeader: true,
      showFooter: true,
      showSignature: this.state.printConfig()?.showSignature ?? true,
      showCutLine: true,
    };
  }

  // --- 1. ENTRY POINT: OPEN PREVIEW ---
  openPreview(jobs: PrintJob[]) {
      if (!jobs || jobs.length === 0) {
          this.toast.show('Không có dữ liệu để in.', 'error');
          return;
      }
      if (this.isPrinting()) return;
      this.closePdfPreview();
      this.previewJobs.set(structuredClone(jobs));
      this.previewPreparedAt.set(new Date());
      this.isPreviewOpen.set(true);
  }

  closePreview() {
      this.isPreviewOpen.set(false);
      this.previewJobs.set([]);
  }

  // --- 2. ENTRY POINT: OPEN PDF CLOUD PREVIEW ---
  openPdfPreview(url: string, title: string, version: number, analyst: string, publishDate: any, onRepublish?: () => Promise<void>, previewType: 'iframe' | 'image' = 'iframe', docsUrl?: string) {
      if (this.isPrinting()) return;
      this.closePreview();
      this.closePdfPreview();
      this.pdfUrl.set(url);
      const docsPreviewUrl = docsUrl ? getSafeGooglePreviewUrl(docsUrl) : null;
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
  openCoaPreview(url: string, title = 'Certificate of Analysis') {
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
      this.pdfLoadRevision++;
      this.pdfPrintController?.abort();
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
      const revision = ++this.pdfLoadRevision;
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
                  if (revision !== this.pdfLoadRevision) return;
                  // Token hết hạn hoặc bị thu hồi → xóa cache, yêu cầu user xác thực lại
                  console.warn('[Preview] 401 — stale token cleared. User must re-authenticate.');
                  this.googleDriveService.clearSession();
                  return; // UI hiện nút "Xác thực & Tải lại"
              }
              throw downloadErr;
          }

          const blob = new Blob([rawBlob!], { type: 'application/pdf' });
          const blobUrl = URL.createObjectURL(blob);

          if (revision === this.pdfLoadRevision && this.isPreviewPdfOpen() && this.pdfUrl() === pdfUrl) {
              this.pdfBlobUrl.set(blobUrl);
              sessionStorage.removeItem(this.pendingPreviewKey);
          } else {
              URL.revokeObjectURL(blobUrl);
          }
      } catch (err: any) {
          console.error('[Preview] Failed to load PDF blob:', err);
          // pdfBlobUrl = null → UI hiện nút retry
      } finally {
          if (revision === this.pdfLoadRevision) this.isPdfBlobLoading.set(false);
      }
  }


  // Called by "Xác thực & Tải lại". Authorization happens in the top-level
  // browser window through the server-side OAuth code flow.
  async retryLoadPdfBlob(): Promise<void> {
      const pdfUrl = this.pdfUrl();
      if (!pdfUrl) return;
      const id = this.getFileId(pdfUrl);
      if (!id) return;
      const revision = ++this.pdfLoadRevision;

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

          if (revision === this.pdfLoadRevision && this.isPreviewPdfOpen() && this.pdfUrl() === pdfUrl) {
              const previous = this.pdfBlobUrl();
              if (previous?.startsWith('blob:')) URL.revokeObjectURL(previous);
              this.pdfBlobUrl.set(blobUrl);
              sessionStorage.removeItem(this.pendingPreviewKey);
          } else {
              URL.revokeObjectURL(blobUrl);
          }
      } catch (err: any) {
          this.toast.show('Xác thực thất bại: ' + (err.message || 'Không xác định'), 'error');
      } finally {
          if (revision === this.pdfLoadRevision) this.isPdfBlobLoading.set(false);
      }
  }

  private getFileId(url: string | null): string | null {
      if (!url) return null;
      const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
      return match ? match[1] : null;
  }

  async quickPrint(pdfUrl: string): Promise<void> {
      if (this.isPrinting()) return;
      const id = this.getFileId(pdfUrl);
      if (!id) {
          openInNewTab(pdfUrl);
          return;
      }

      this.isPrinting.set(true);
      try {
          if (this.pdfUrl() === pdfUrl && this.pdfBlobUrl()?.startsWith('blob:')) {
              await this.printBlobUrl(this.pdfBlobUrl()!);
              return;
          }
          if (!await this.googleDriveService.hasServerOAuthSession()) {
              this.persistPendingPdfPreview(pdfUrl);
              this.googleDriveService.beginRedirectAuth();
              return;
          }
          this.toast.show('Đang chuẩn bị dữ liệu in...', 'info');
          const rawBlob = await this.googleDriveService.downloadFile(id);
          const blob = new Blob([rawBlob], { type: 'application/pdf' });
          const blobUrl = URL.createObjectURL(blob);
          await this.printBlobUrl(blobUrl, true);
      } catch (err: any) {
          console.error('[Print] Lỗi khi in nhanh:', err);
          this.toast.show('Không mở được hộp thoại in. Có thể tải PDF để in từ máy.', 'warning');
          // Keep the selected document/version metadata intact when printing fails.
      } finally {
          this.isPrinting.set(false);
      }
  }

  private async printBlobUrl(blobUrl: string, autoRevoke = false): Promise<void> {
      const iframe = document.createElement('iframe');
      iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
      iframe.title = 'Tài liệu chuẩn bị in';
      const controller = new AbortController();
      this.pdfPrintController = controller;
      const cleanup = () => {
          iframe.remove();
          if (autoRevoke) URL.revokeObjectURL(blobUrl);
      };
      let timer: ReturnType<typeof setTimeout> | undefined;
      try {
          await new Promise<void>((resolve, reject) => {
              iframe.onload = () => resolve();
              iframe.onerror = () => reject(new Error('Không tải được PDF vào vùng in.'));
              controller.signal.addEventListener('abort', () => reject(new Error('Đã đóng vùng in.')), { once: true });
              timer = setTimeout(() => reject(new Error('Tải PDF để in quá thời gian.')), 15000);
              iframe.src = blobUrl;
              document.body.appendChild(iframe);
          });
          clearTimeout(timer);
          if (!iframe.contentWindow) throw new Error('Không mở được vùng in PDF.');
          await printWithCleanup(iframe.contentWindow, () => {}, controller.signal, window);
      } finally {
          clearTimeout(timer);
          cleanup();
          if (this.pdfPrintController === controller) this.pdfPrintController = undefined;
      }
  }

  async quickDownload(pdfUrl: string, fileName = 'document.pdf'): Promise<void> {
      const id = this.getFileId(pdfUrl);
      if (!id) {
          openInNewTab(pdfUrl);
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

  private downloadBlobUrl(blobUrl: string, fileName: string, autoRevoke = false) {
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
