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
  updatedAt: any;
  updatedBy: string;
}
