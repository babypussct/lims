import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ReportProgress {
  total: number;
  published: number;
  percent: number;
  unpublishedSamples: string[];
}

export interface OpenPdfEvent {
  pdfUrl: string;
  docsUrl?: string;
}

@Component({
  selector: 'app-result-active-reports-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './result-active-reports-panel.component.html'
})
export class ResultActiveReportsPanelComponent {
  /** Có ít nhất 1 báo cáo active không */
  @Input() hasAnyReports: boolean = false;
  /** Báo cáo chung (tất cả mẫu) */
  @Input() generalReport: any | null = null;
  /** Danh sách prefix phát hiện được */
  @Input() prefixes: string[] = [];
  /** Hàm lấy tất cả report theo prefix (trả về array, hỗ trợ chunking) */
  @Input() getAllReportsForPrefixFn!: (prefix: string) => any[];
  /** Trạng thái draft */
  @Input() draftStatus: string = 'draft';
  /** Tiến độ xuất báo cáo */
  @Input() progress: ReportProgress = { total: 0, published: 0, percent: 0, unpublishedSamples: [] };

  @Output() openPdf = new EventEmitter<OpenPdfEvent>();

  /** Wrapper để gọi hàm từ @Input trong template */
  getPrefixReports(prefix: string): any[] {
    return this.getAllReportsForPrefixFn ? this.getAllReportsForPrefixFn(prefix) : [];
  }
}
