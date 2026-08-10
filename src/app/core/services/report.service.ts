import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { openInNewTab } from '../../shared/utils/browser-navigation';
import { AuthService } from './auth.service';
import { FirebaseService } from './firebase.service';

export interface SampleResult {
  loSo: string;
  maSoMau: string;
  kq: string | null;   // null = ND (không phát hiện)
  ghiChu?: string;
  nd?: boolean;        // cho Type3B
  qc1?: string;
  qc2?: string;
  qc3?: string;
}

export interface ReportMetadata {
  batchCode: string;
  ngayNguoiPhanTich: string;
  ngayNguoiThamTra: string;
  checkTatCaND?: boolean;
  checkCoMauPhatHien?: boolean;
  [key: string]: any;
}

export interface GenerateReportPayload {
  action: 'generate_pdf';
  requestId: string;
  sopId: string;
  metadata: ReportMetadata;
  samples: SampleResult[];
  version?: number;
}


export interface ReportResult {
  success: boolean;
  requestId?: string;
  docId: string;
  pdfId: string;
  docsUrl: string;
  pdfUrl: string;
  pdfViewUrl: string;
  fileName: string;
  createdAt: string;
  error?: string;
}

@Injectable({ providedIn: 'root' })
export class ReportService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private fb = inject(FirebaseService);

  /** URL của GAS Web App — deploy xong paste vào environment.gasReportUrl */
  private readonly GAS_URL = environment.gasReportUrl || '';

  private async withMutationAuth<T extends object>(payload: T): Promise<T & { idToken: string; appId: string }> {
    const idToken = await this.auth.getIdToken();
    if (!idToken) {
      throw new Error('Phiên đăng nhập đã hết hạn hoặc chưa sẵn sàng. Vui lòng đăng nhập lại trước khi thao tác báo cáo.');
    }

    const appId = String(this.fb.APP_ID || '').trim();
    if (!appId) {
      throw new Error('Không xác định được LIMS appId cho thao tác báo cáo.');
    }

    return { ...payload, idToken, appId };
  }

  /**
   * Tạo báo cáo PDF từ dữ liệu nhập kết quả.
   * GAS sẽ: copy template → điền data → export PDF → lưu Drive → trả URL
   */
  async generateReport(payload: GenerateReportPayload): Promise<ReportResult> {
    if (!this.GAS_URL) {
      throw new Error(
        'Chưa cấu hình GAS Web App URL. ' +
        'Vui lòng triển khai Google Apps Script và điền URL vào environment.gasReportUrl.'
      );
    }


    // GAS Web App không nhận Content-Type: application/json trực tiếp
    // Cần gửi dưới dạng text/plain để tránh CORS preflight
    const authenticatedPayload = await this.withMutationAuth(payload);
    const result = await firstValueFrom(
      this.http.post<ReportResult>(this.GAS_URL, JSON.stringify(authenticatedPayload), {
        headers: new HttpHeaders({ 'Content-Type': 'text/plain' }),
      })
    );

    if (!result.success) {
      throw new Error(result.error || 'Lỗi không xác định từ GAS');
    }

    return result;
  }

  /**
   * Yêu cầu GAS lưu trữ và dọn dẹp các tệp cũ bị hủy
   */
  async archiveReports(files: { pdfUrl?: string; docsUrl?: string }[], requestId: string): Promise<any> {
    if (!this.GAS_URL) {
      throw new Error('Chưa cấu hình GAS Web App URL.');
    }
    const payload = {
      action: 'archive_reports',
      requestId,
      files: files.filter(f => f.pdfUrl || f.docsUrl)
    };
    if (payload.files.length === 0) return { success: true };

    const authenticatedPayload = await this.withMutationAuth(payload);
    const result = await firstValueFrom(
      this.http.post<any>(this.GAS_URL, JSON.stringify(authenticatedPayload), {
        headers: new HttpHeaders({ 'Content-Type': 'text/plain' }),
      })
    );
    if (!result?.success) {
      throw new Error(result?.error || 'Không thể lưu trữ báo cáo trên GAS.');
    }
    return result;
  }


  /**
   * Mở PDF trong tab mới để xem/in.
   */
  openPdf(result: ReportResult): void {
    openInNewTab(result.pdfViewUrl || result.pdfUrl);
  }

  /**
   * Build payload chuẩn cho filebieumau2 (Trifluralin GC-MS).
   * Dùng làm reference để xây cho các SOP khác.
   */
  buildTrifluralinPayload(
    requestId: string,
    batchCode: string,
    metadata: ReportMetadata,
    samples: SampleResult[]
  ): GenerateReportPayload {
    return {
      action: 'generate_pdf',
      requestId,
      sopId: 'trifluralin-gcms',
      metadata: {
        ...metadata,
        batchCode,
      },
      samples,
    };
  }

  /**
   * Tải tệp Excel gốc lên Google Drive của mẻ chạy qua Apps Script Web App.
   * Callback tiến trình chỉ phản ánh phần dữ liệu đã được trình duyệt gửi đi.
   */
  async uploadExcelToDrive(
    requestId: string,
    fileName: string,
    base64Data: string,
    sopId: string,
    onProgress?: (percent: number) => void
  ): Promise<{ success: boolean; fileUrl?: string; fileId?: string; fileName?: string; error?: string }> {
    if (!this.GAS_URL) {
      throw new Error('Chưa cấu hình GAS Web App URL.');
    }

    const payload = {
      action: 'upload_excel',
      requestId,
      fileName,
      fileData: base64Data,
      sopId
    };

    const authenticatedPayload = await this.withMutationAuth(payload);
    return firstValueFrom(
      this.http.post<any>(this.GAS_URL, JSON.stringify(authenticatedPayload), {
        headers: new HttpHeaders({ 'Content-Type': 'text/plain' }),
        observe: 'events',
        reportProgress: true
      }).pipe(
        tap(event => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            onProgress?.(Math.round((event.loaded / event.total) * 100));
          }
        }),
        filter((event): event is HttpResponse<any> => event.type === HttpEventType.Response),
        map(event => event.body)
      )
    );
  }

}
