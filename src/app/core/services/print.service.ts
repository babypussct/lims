
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

  // --- FETCH BLOB FOR PREVIEW (Bypass CSP) ---
  // NOTE: This runs OUTSIDE a user-gesture context (called automatically when modal opens).
  // GIS requestAccessToken ALWAYS needs a popup — even with prompt:'none' — so we MUST NOT
  // call tryAuthSilent() here. We only proceed if we already have a valid cached token.
  private async loadPdfBlobForPreview(pdfUrl: string) {
      const id = this.getFileId(pdfUrl);
      if (!id) {
          this.pdfBlobUrl.set(pdfUrl);
          return;
      }

      this.isPdfBlobLoading.set(true);
      try {
          // 1. Đảm bảo GIS đã khởi tạo (không mở popup)
          await this.googleDriveService.ensureInitialized();

          // 2. Kiểm tra token trong cache — KHÔNG gọi bất kỳ hàm auth nào ở đây
          //    vì GIS luôn cần popup để trả kết quả, sẽ bị trình duyệt chặn.
          if (!this.googleDriveService.hasValidToken) {
              console.log('[Preview] No cached token — waiting for user to click "Xác thực & Tải lại".');
              this.isPdfBlobLoading.set(false);
              return; // pdfBlobUrl = null → UI hiện nút "Xác thực & Tải lại"
          }

          // 3. Tải file. Nếu 401 (token hết hạn / bị thu hồi) → xóa và hiện nút retry
          let rawBlob: Blob;
          try {
              rawBlob = await this.googleDriveService.downloadFile(id);
          } catch (downloadErr: any) {
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


  // Được gọi trực tiếp từ nút "Xác thực & Tải lại" để GIS giữ user activation.
  async retryLoadPdfBlob(authPopup: WindowProxy | null = null): Promise<void> {
      const pdfUrl = this.pdfUrl();
      if (!pdfUrl) return;
      const id = this.getFileId(pdfUrl);
      if (!id) return;

      try {
          authPopup?.document.write(
              '<html><head><title>Kết nối Google...</title></head>' +
              '<body style="display:flex;align-items:center;justify-content:center;' +
              'height:100vh;margin:0;font-family:system-ui,sans-serif;background:#f8fafc">' +
              '<div style="text-align:center"><p style="font-size:15px;color:#64748b;font-weight:600">Đang xác thực Google Drive...</p></div>' +
              '</body></html>'
          );
      } catch (_) {}

      this.isPdfBlobLoading.set(true);
      try {
          if (!this.googleDriveService.canAuthSync) {
              await this.googleDriveService.ensureInitialized();
          }
          await new Promise<void>((resolve, reject) => {
              this.googleDriveService.authenticateSync(
                  () => resolve(),
                  (err) => reject(new Error(err)),
                  authPopup,
                  false
              );
          });

          const rawBlob = await this.googleDriveService.downloadFile(id);
          const blob = new Blob([rawBlob], { type: 'application/pdf' });
          const blobUrl = URL.createObjectURL(blob);

          if (this.isPreviewPdfOpen() && this.pdfUrl() === pdfUrl) {
              this.pdfBlobUrl.set(blobUrl);
          } else {
              URL.revokeObjectURL(blobUrl);
          }
      } catch (err: any) {
          if (authPopup && !authPopup.closed) {
              try { authPopup.close(); } catch (_) {}
          }
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

  /** True nếu đã có token hợp lệ hoặc URL không phải Drive (không cần popup) */
  hasTokenForUrl(url: string): boolean {
      if (!this.getFileId(url)) return true; // không phải Drive URL → không cần auth
      if (this.pdfUrl() === url && this.pdfBlobUrl()?.startsWith('blob:')) return true; // đã có blob
      return this.googleDriveService.hasValidToken;
  }

  // Called from a user action. GIS opens its own OAuth window when needed.
  async quickPrint(pdfUrl: string, authPopup?: WindowProxy | null): Promise<void> {
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

      if (!this.googleDriveService.hasValidToken) {
          try {
              if (!this.googleDriveService.canAuthSync) {
                  await this.googleDriveService.ensureInitialized();
              }
              await new Promise<void>((resolve, reject) => {
                  this.googleDriveService.authenticateSync(
                      () => resolve(),
                      (err) => reject(new Error(err)),
                      // null = Google Identity Services opens the authorized
                      // OAuth popup itself; do not create a blank placeholder.
                      authPopup ?? null,
                      false
                  );
              });
          } catch (authErr: any) {
              if (authPopup && !authPopup.closed) {
                  try { authPopup.close(); } catch (_) {}
              }
              console.error('[Print] Google authentication failed:', authErr);
              this.toast.show('Không thể xác thực để in: ' + (authErr.message || 'Không xác định'), 'error');
              return;
          }
      }

      try {
          this.isPrinting.set(true);
          this.toast.show('Đang chuẩn bị dữ liệu in...', 'info');
          await this.googleDriveService.ensureAuthenticated();
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

  // authPopup: caller mở trước trong click handler để tránh bị chặn popup
  async quickDownload(pdfUrl: string, fileName: string = 'document.pdf', authPopup?: WindowProxy | null): Promise<void> {
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

      if (!this.googleDriveService.hasValidToken) {
          const popup = authPopup ?? window.open('about:blank', 'gis_auth_popup', 'width=500,height=600,left=200,top=100');
          if (!popup || popup.closed) {
              this.toast.show('Không thể mở popup đăng nhập. Hãy cho phép hiển thị popup từ trang này.', 'error');
              return;
          }

          try {
              popup.document.write(
                  '<html><head><title>Kết nối Google...</title></head>' +
                  '<body style="display:flex;align-items:center;justify-content:center;' +
                  'height:100vh;margin:0;font-family:system-ui,sans-serif;background:#f8fafc">' +
                  '<div style="text-align:center">' +
                  '<p style="font-size:15px;color:#64748b;font-weight:600">Đang chuẩn bị dịch vụ Google Drive...</p>' +
                  '</div></body></html>'
              );
          } catch (_) {}

          try {
              if (!this.googleDriveService.canAuthSync) {
                  await this.googleDriveService.ensureInitialized();
              }
              await new Promise<void>((resolve, reject) => {
                  this.googleDriveService.authenticateSync(
                      () => resolve(),
                      (err) => reject(new Error(err)),
                      popup,
                      false
                  );
              });
          } catch (authErr: any) {
              if (popup && !popup.closed) {
                  try { popup.close(); } catch (_) {}
              }
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
          this.downloadBlobUrl(blobUrl, fileName, true);
      } catch (err: any) {
          console.error('[Download] Failed to download silently:', err);
          this.toast.show('Tải thất bại, chuyển sang tab mới...', 'warning');
          window.open(`https://drive.google.com/uc?export=download&id=${id}`, '_blank');
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
