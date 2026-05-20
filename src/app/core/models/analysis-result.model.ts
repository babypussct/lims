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
  resultData: {
    [sampleCode: string]: {
      [key: string]: any; // Lưu giữ kết quả (string/null), cờ ND (boolean) và trạng thái QC (string)
    };
  };
  publishedBackup?: {
    page1Data: any;
    resultData: any;
    publishedAt: any;
    publishedBy: string;
  };
  // Phiên bản hiện tại và lịch sử các bản in báo cáo PDF
  version?: number;
  pdfHistory?: AnalysisResultVersion[];
  
  // URLs PDF đã tạo — lưu để xem lại bất cứ lúc nào
  pdfUrl?: string;      // Google Drive viewer URL
  pdfViewUrl?: string;  // Direct download URL
  docsUrl?: string;     // Google Docs editor URL
  pdfFileName?: string; // Tên file PDF đã lưu
  pdfCreatedAt?: string;
  updatedAt: any;
  updatedBy: string;
}


