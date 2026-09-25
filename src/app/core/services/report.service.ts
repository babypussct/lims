import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
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
    let rawResponse: string;
    try {
      // Đọc response dưới dạng text rồi tự parse. GAS/Google đôi lúc có thể
      // trả HTML, body rỗng hoặc body lỗi không đúng JSON; để HttpClient tự
      // parse JSON sẽ biến các trường hợp đó thành lỗi khó hiểu.
      rawResponse = await firstValueFrom(
        this.http.post(this.GAS_URL, JSON.stringify(authenticatedPayload), {
          headers: new HttpHeaders({ 'Content-Type': 'text/plain' }),
          responseType: 'text'
        })
      );
    } catch (error) {
      throw new Error(this.describeReportTransportError(error));
    }

    const result = this.parseReportResponse(rawResponse);

    if (!result.success) {
      throw new Error(result.error || 'Máy chủ tạo PDF trả trạng thái thất bại nhưng không kèm chi tiết lỗi.');
    }

    return result;
  }

  private parseReportResponse(rawResponse: string): ReportResult {
    const text = String(rawResponse ?? '').trim();
    if (!text) {
      throw new Error('Máy chủ tạo PDF không trả dữ liệu. Hãy thử lại; nếu lỗi lặp lại, kiểm tra Web App GAS.');
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      if (/^\s*<(?:!doctype\s+html|html)\b/i.test(text)) {
        throw new Error(
          'Máy chủ tạo PDF trả về trang HTML thay vì dữ liệu JSON. ' +
          'Có thể Web App GAS đang lỗi quyền truy cập hoặc URL triển khai không còn hợp lệ.'
        );
      }
      throw new Error('Không đọc được phản hồi từ máy chủ tạo PDF vì dữ liệu trả về không đúng định dạng JSON.');
    }

    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Phản hồi từ máy chủ tạo PDF không đúng cấu trúc dữ liệu mong đợi.');
    }

    const result = parsed as Partial<ReportResult>;
    if (typeof result.success !== 'boolean') {
      throw new Error('Phản hồi từ máy chủ tạo PDF thiếu trạng thái success.');
    }

    return result as ReportResult;
  }

  private describeReportTransportError(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const detail = this.extractServerErrorDetail(error.error);
      if (error.status === 0) {
        return detail
          ? `Không kết nối được máy chủ tạo PDF: ${detail}`
          : 'Không kết nối được máy chủ tạo PDF. Hãy kiểm tra kết nối mạng rồi thử lại.';
      }

      const statusLabel = error.statusText && error.statusText !== 'Unknown Error'
        ? ` ${error.statusText}`
        : '';
      return detail
        ? `Máy chủ tạo PDF phản hồi HTTP ${error.status}${statusLabel}: ${detail}`
        : `Máy chủ tạo PDF phản hồi HTTP ${error.status}${statusLabel}. Hãy thử lại.`;
    }

    if (error instanceof Error && error.message) {
      return error.message;
    }
    return 'Không thể gửi yêu cầu tạo PDF đến máy chủ.';
  }

  private extractServerErrorDetail(body: unknown): string {
    const normalize = (value: unknown): string => {
      const text = typeof value === 'string' ? value.trim() : '';
      if (!text) return '';
      if (/^\s*<(?:!doctype\s+html|html)\b/i.test(text)) {
        return 'máy chủ trả về trang HTML thay vì dữ liệu lỗi JSON';
      }
      return text.length > 300 ? `${text.slice(0, 300)}…` : text;
    };

    if (typeof body === 'string') {
      const text = body.trim();
      if (!text) return '';
      try {
        const parsed = JSON.parse(text);
        return this.extractServerErrorDetail(parsed) || normalize(text);
      } catch {
        return normalize(text);
      }
    }

    if (body && typeof body === 'object') {
      const record = body as Record<string, unknown>;
      const direct = normalize(record['error']) || normalize(record['message']);
      if (direct) return direct;

      const nestedError = record['error'];
      if (nestedError && typeof nestedError === 'object') {
        const nested = nestedError as Record<string, unknown>;
        return normalize(nested['message']) || normalize(nested['text']);
      }

      return normalize(record['text']);
    }

    return '';
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
