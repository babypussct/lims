
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
  private async loadPdfBlobForPreview(pdfUrl: string) {
      const id = this.getFileId(pdfUrl);
      if (!id) {
          this.pdfBlobUrl.set(pdfUrl);
          return;
      }

      this.isPdfBlobLoading.set(true);
      try {
          // 1. Đảm bảo GIS đã khởi tạo
          await this.googleDriveService.ensureInitialized();

          // 2. Đảm bảo có token hợp lệ (silent — không cần popup)
          //    Luôn thử silent auth trước để làm mới token (tránh token cũ từ redirect bị thu hồi)
          try {
              console.log('[Preview] Refreshing Drive token (silent)...');
              await this.googleDriveService.tryAuthSilent();
              console.log('[Preview] Drive token OK.');
          } catch (silentErr: any) {
              if (!this.googleDriveService.hasValidToken) {
                  // Không có token nào cả → cần user tương tác
                  console.warn('[Preview] No valid token, need user interaction:', silentErr.message);
                  this.isPdfBlobLoading.set(false);
                  return; // pdfBlobUrl = null → UI hiện nút "Xác thực & Tải lại"
              }
              // Có token trong cache nhưng silent refresh lỗi → thử với token hiện tại trước
              console.warn('[Preview] Silent refresh failed, trying with cached token...');
          }

          // 3. Tải file, xử lý 401 bằng cách xóa token cũ và thử lại
          let rawBlob: Blob;
          try {
              rawBlob = await this.googleDriveService.downloadFile(id);
          } catch (downloadErr: any) {
              const is401 = downloadErr.message?.includes('401') ||
                            downloadErr.message?.toLowerCase().includes('invalid authentication') ||
                            downloadErr.message?.toLowerCase().includes('invalid credential');
              
              if (is401) {
                  // Token cũ không hợp lệ (có thể do thiếu Drive scopes từ redirect)
                  console.warn('[Preview] 401 from Drive — clearing stale token, retrying silent auth...');
                  this.googleDriveService.clearSession();
                  
                  try {
                      await this.googleDriveService.tryAuthSilent();
                      rawBlob = await this.googleDriveService.downloadFile(id);
                  } catch (retryErr: any) {
                      // Cả retry cũng thất bại → hiện nút "Xác thực & Tải lại"
                      console.error('[Preview] Retry after 401 also failed:', retryErr.message);
                      this.isPdfBlobLoading.set(false);
                      return;
                  }
              } else {
                  throw downloadErr;
              }
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

  // Được gọi từ nút "Thử lại" trong modal — phải nằm trong user gesture context
  async retryLoadPdfBlob(): Promise<void> {
      const pdfUrl = this.pdfUrl();
      if (!pdfUrl) return;
      const id = this.getFileId(pdfUrl);
      if (!id) return;

      // Mở popup đồng bộ ngay trong click event để không bị chặn
      const authPopup = window.open('about:blank', 'gis_auth_popup', 'width=500,height=600,left=200,top=100');
      if (!authPopup || authPopup.closed) {
          this.toast.show('Popup bị chặn. Vui lòng cho phép popup từ trang này rồi thử lại.', 'error');
          return;
      }

      try {
          authPopup.document.write(
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
      
      // If we already loaded the blob for preview, reuse it!
      if (this.pdfUrl() === pdfUrl && this.pdfBlobUrl()?.startsWith('blob:')) {
          this.printBlobUrl(this.pdfBlobUrl()!);
          return;
      }

      // Khởi tạo xác thực đồng bộ trước khi vào luồng async để tránh bị trình duyệt chặn popup
      if (!this.googleDriveService.hasValidToken) {
          // Mở popup ngay lập tức khi vẫn còn user gesture context để không bị chặn
          const authPopup = window.open('about:blank', 'gis_auth_popup', 'width=500,height=600,left=200,top=100');
          if (!authPopup || authPopup.closed) {
              this.toast.show('Không thể mở popup đăng nhập. Hãy cho phép hiển thị popup từ trang này.', 'error');
              return;
          }

          try {
              authPopup.document.write(
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
                      authPopup,
                      false // disable redirect fallback
                  );
              });
          } catch (authErr: any) {
              if (authPopup && !authPopup.closed) {
                  try { authPopup.close(); } catch (_) {}
              }
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

          this.printBlobUrl(blobUrl, true);
      } catch (err: any) {
          window.open(`https://drive.google.com/file/d/${id}/preview`, '_blank');
          this.toast.show('Đang mở trang xem trước. Nhấn biểu tượng Máy in để in.', 'info');
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

  // --- 5. QUICK DOWNLOAD (Silent background download) ---
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

      // Khởi tạo xác thực đồng bộ trước khi vào luồng async để tránh bị trình duyệt chặn popup
      if (!this.googleDriveService.hasValidToken) {
          // Mở popup ngay lập tức khi vẫn còn user gesture context để không bị chặn
          const authPopup = window.open('about:blank', 'gis_auth_popup', 'width=500,height=600,left=200,top=100');
          if (!authPopup || authPopup.closed) {
              this.toast.show('Không thể mở popup đăng nhập. Hãy cho phép hiển thị popup từ trang này.', 'error');
              return;
          }

          try {
              authPopup.document.write(
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
                      authPopup,
                      false // disable redirect fallback
                  );
              });
          } catch (authErr: any) {
              if (authPopup && !authPopup.closed) {
                  try { authPopup.close(); } catch (_) {}
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
