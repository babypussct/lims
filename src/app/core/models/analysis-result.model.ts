export interface AnalysisResultVersion {
  version: number;
  pdfUrl: string;
  pdfViewUrl?: string;
  docsUrl?: string;
  pdfFileName: string;
  publishedAt: string;
  publishedBy: string;
  // Bản sao lưu số liệu nhập liệu của phiên bản này
  page1DataBackup: any;
  resultDataBackup: any;
}

export interface AnalysisResultDraft {
  id: string; // Trùng với requestId/runId
  requestId: string;
  sopId: string;
  sopName: string;
  status: 'draft' | 'completed';
  page1Data: {
    ngayNguoiPhanTich?: string;
    ngayNguoiThamTra?: string;
    checkTatCaND?: boolean;
    checkCoMauPhatHien?: boolean;
    [key: string]: any; // Dành cho các trường động tùy chỉ tiêu (ví dụ: QC checklist)
  };
  resultData: Record<string, Record<string, any>>;
  publishedBackup?: {
    page1Data: any;
    resultData: any;
    publishedAt: any;
    publishedBy: string;
  };
  // Phiên bản hiện tại và lịch sử các bản in báo cáo PDF
  version?: number;
  pdfHistory?: AnalysisResultVersion[];
  
  // Danh sách báo cáo theo ID. (Cũ: theo tiền tố. Mới: Unique ID)
  reports?: Record<string, {
    id?: string;
    prefix?: string;
    pdfUrl: string | null;
    pdfViewUrl?: string | null;
    docsUrl?: string | null;
    pdfFileName: string | null;
    pdfCreatedAt?: string;
    publishedAt?: string;
    publishedBy?: string;
    version: number;
    status?: string;
    /** Danh sách mã số mẫu (sampleCode LIMS) được include vào bản in này */
    includedSamples?: string[];
    publishedBackup?: {
      page1Data: any;
      resultData: any;
      publishedAt?: string;
      publishedBy?: string;
    };
  }>;
  
  // URLs PDF đã tạo — lưu để xem lại bất cứ lúc nào
  pdfUrl?: string;      // Google Drive viewer URL
  pdfViewUrl?: string;  // Direct download URL
  docsUrl?: string;     // Google Docs editor URL
  pdfFileName?: string; // Tên file PDF đã lưu
  pdfCreatedAt?: string;
  updatedAt: any;
  updatedBy: string;
}


