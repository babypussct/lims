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
  @Input() hasAnyReports = false;
  /** Báo cáo chung (tất cả mẫu) */
  @Input() generalReport: any | null = null;
  /** Danh sách prefix phát hiện được */
  @Input() prefixes: string[] = [];
  /** Danh sách toàn bộ mẫu của mẻ chạy (dùng hiển thị cho báo cáo chung) */
  @Input() sampleList: string[] = [];
  /** Hàm lấy tất cả report theo prefix (trả về array, hỗ trợ chunking) */
  @Input() getAllReportsForPrefixFn!: (prefix: string) => any[];
  /** Trạng thái draft */
  @Input() draftStatus = 'draft';
  /** Tiến độ xuất báo cáo */
  @Input() progress: ReportProgress = { total: 0, published: 0, percent: 0, unpublishedSamples: [] };

  @Output() openPdf = new EventEmitter<OpenPdfEvent>();

  /** Định dạng danh sách mẫu thành dãy rút gọn trực quan, vd: A01, A02, A03 -> A01 ⭢ A03 */
  formatSampleRange(samples: string[] | undefined | null): string {
    if (!samples || samples.length === 0) return 'Không có mẫu';
    
    const parseSample = (s: string) => {
      const match = s.match(/^([A-Za-z]+)(\d+)(.*)$/);
      if (!match) return null;
      return { prefix: match[1], num: parseInt(match[2], 10), suffix: match[3] };
    };

    const isSequential = (s1: string, s2: string) => {
      const p1 = parseSample(s1);
      const p2 = parseSample(s2);
      if (!p1 || !p2) return false;
      if (p1.prefix !== p2.prefix) return false;
      if (p1.suffix !== p2.suffix) return false;
      return p1.num + 1 === p2.num;
    };

    const result: string[] = [];
    let i = 0;
    while (i < samples.length) {
      const start = samples[i];
      let j = i;
      while (j + 1 < samples.length && isSequential(samples[j], samples[j+1])) {
        j++;
      }
      if (j > i) {
        result.push(`${start} ⭢ ${samples[j]}`);
      } else {
        result.push(start);
      }
      i = j + 1;
    }
    return result.join(', ');
  }

  /** Wrapper để gọi hàm từ @Input trong template */
  getPrefixReports(prefix: string): any[] {
    return this.getAllReportsForPrefixFn ? this.getAllReportsForPrefixFn(prefix) : [];
  }

  /** Trả về URL Google Docs ở chế độ xem trước */
  getDocsPreviewUrl(url: string): string {
    if (!url) return '';
    return url.replace(/\/edit.*$/, '/preview');
  }

}
