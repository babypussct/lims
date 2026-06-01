import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

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
  sopId: string;
  metadata: ReportMetadata;
  samples: SampleResult[];
  version?: number;
}


export interface ReportResult {
  success: boolean;
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

  /** URL của GAS Web App — deploy xong paste vào environment.gasReportUrl */
  private readonly GAS_URL = environment.gasReportUrl || '';

  /**
   * Tạo báo cáo PDF từ dữ liệu nhập kết quả.
   * GAS sẽ: copy template → điền data → export PDF → lưu Drive → trả URL
   */
  async generateReport(payload: GenerateReportPayload): Promise<ReportResult> {
    if (!this.GAS_URL) {
      throw new Error(
        'Chưa cấu hình GAS Web App URL. ' +
        'Vui lòng deploy Google Apps Script và paste URL vào environment.gasReportUrl.'
      );
    }


    // GAS Web App không nhận Content-Type: application/json trực tiếp
    // Cần gửi dưới dạng text/plain để tránh CORS preflight
    const result = await firstValueFrom(
      this.http.post<ReportResult>(this.GAS_URL, JSON.stringify(payload), {
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
  async archiveReports(files: { pdfUrl?: string; docsUrl?: string }[]): Promise<any> {
    if (!this.GAS_URL) {
      throw new Error('Chưa cấu hình GAS Web App URL.');
    }
    const payload = {
      action: 'archive_reports',
      files: files.filter(f => f.pdfUrl || f.docsUrl)
    };
    if (payload.files.length === 0) return { success: true };

    const result = await firstValueFrom(
      this.http.post<any>(this.GAS_URL, JSON.stringify(payload), {
        headers: new HttpHeaders({ 'Content-Type': 'text/plain' }),
      })
    );
    return result;
  }


  /**
   * Mở PDF trong tab mới để xem/in.
   */
  openPdf(result: ReportResult): void {
    window.open(result.pdfViewUrl || result.pdfUrl, '_blank');
  }

  /**
   * Build payload chuẩn cho filebieumau2 (Trifluralin GC-MS).
   * Dùng làm reference để xây cho các SOP khác.
   */
  buildTrifluralinPayload(
    batchCode: string,
    metadata: ReportMetadata,
    samples: SampleResult[]
  ): GenerateReportPayload {
    return {
      action: 'generate_pdf',
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
   */
  async uploadExcelToDrive(
    requestId: string,
    fileName: string,
    base64Data: string
  ): Promise<{ success: boolean; fileUrl?: string; fileId?: string; error?: string }> {
    if (!this.GAS_URL) {
      throw new Error('Chưa cấu hình GAS Web App URL.');
    }

    const payload = {
      action: 'upload_excel',
      requestId,
      fileName,
      fileData: base64Data
    };

    const result = await firstValueFrom(
      this.http.post<any>(this.GAS_URL, JSON.stringify(payload), {
        headers: new HttpHeaders({ 'Content-Type': 'text/plain' }),
      })
    );

    return result;
  }
}
