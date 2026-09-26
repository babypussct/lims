import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppUiProgressComponent } from '../../../shared/components/ui/progress/progress.component';
import { AppUiTimelineComponent } from '../../../shared/components/ui/timeline/timeline.component';
import { TimelineItem } from '../../../shared/components/ui/timeline/timeline.model';
import { getSafeGoogleUrl } from '../../../shared/utils/report-url';

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
  imports: [CommonModule, AppUiProgressComponent, AppUiTimelineComponent],
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
  /** Lịch sử các bản in đã publish/archive */
  @Input() historyList: any[] = [];

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
    return getSafeGoogleUrl(url, 'doc');
  }

  getRecentHistory(): any[] {
    return this.getVisibleHistory().slice(0, 5);
  }

  getActiveReportCount(): number {
    let count = this.generalReport ? 1 : 0;
    for (const prefix of this.prefixes || []) {
      count += this.getPrefixReports(prefix).length;
    }
    return count;
  }

  getVisibleHistory(): any[] {
    const activeUrls = new Set<string>();
    const activeVersionScopes = new Set<string>();

    const registerActive = (report: any, scope: string) => {
      if (!report) return;
      [report.pdfViewUrl, report.pdfUrl, report.docsUrl]
        .filter((url): url is string => typeof url === 'string' && url.length > 0)
        .forEach(url => activeUrls.add(url));

      if (report.version !== undefined && report.version !== null) {
        activeVersionScopes.add(`${report.version}|${scope}`);
      }
    };

    registerActive(this.generalReport, 'ALL');
    for (const prefix of this.prefixes || []) {
      const scope = prefix === '' ? '_NO_PREFIX_' : prefix;
      this.getPrefixReports(prefix).forEach(report => registerActive(report, scope));
    }

    return (this.historyList || []).filter(hist => {
      const historyUrls = [hist?.pdfViewUrl, hist?.pdfUrl, hist?.docsUrl]
        .filter((url): url is string => typeof url === 'string' && url.length > 0);
      if (historyUrls.some(url => activeUrls.has(url))) return false;

      const scope = !hist?.prefix || hist.prefix === 'ALL' ? 'ALL' : hist.prefix;
      if (hist?.version !== undefined && hist?.version !== null) {
        return !activeVersionScopes.has(`${hist.version}|${scope}`);
      }
      return true;
    });
  }

  getHistoryScopeLabel(hist: any): string {
    const prefix = hist?.prefix;
    if (!prefix || prefix === 'ALL') return 'Báo cáo chung';
    if (prefix === '_NO_PREFIX_') return 'Không tiền tố';
    return `Nhóm ${prefix}`;
  }

  getHistoryTimelineItems(): TimelineItem[] {
    return this.getRecentHistory().map((hist, index) => {
      const pdfUrl = hist?.pdfViewUrl || hist?.pdfUrl;
      const docsUrl = hist?.docsUrl ? this.getDocsPreviewUrl(hist.docsUrl) : '';
      const includedSamples = Array.isArray(hist?.includedSamples) ? hist.includedSamples : [];
      const metadata = [
        { label: 'Phạm vi', value: this.getHistoryScopeLabel(hist) },
        includedSamples.length > 0 ? { label: 'Mẫu', value: this.formatSampleRange(includedSamples) } : null,
        hist?.isFromMaster ? { label: 'Nguồn', value: 'Mẻ tổng hợp' } : null,
        hist?.status === 'archived' ? { label: 'Trạng thái', value: 'Lưu trữ' } : null,
      ].filter((item): item is { label: string; value: string } => item !== null);

      return {
        id: hist?._id || `${hist?.version || 'unknown'}-${hist?.reportId || hist?.prefix || index}`,
        title: `Phát hành báo cáo v${hist?.version || '—'}`,
        description: includedSamples.length > 0
          ? `Báo cáo gồm ${includedSamples.length} mẫu trong phạm vi đã chọn.`
          : 'Phiên bản báo cáo đã được lưu vào lịch sử.',
        timestamp: hist?.publishedAt,
        actorName: hist?.publishedBy,
        actorRole: hist?.isFromMaster ? 'Mẻ tổng hợp' : 'Báo cáo kết quả',
        icon: hist?.status === 'archived' ? 'fa-box-archive' : 'fa-file-circle-check',
        status: hist?.status === 'archived' ? 'warning' : 'success',
        metadata,
        action: pdfUrl ? {
          label: 'Mở PDF',
          icon: 'fa-file-pdf',
          callback: () => this.openPdf.emit({ pdfUrl, docsUrl: hist?.docsUrl }),
        } : docsUrl ? {
          label: 'Mở Google Docs',
          icon: 'fa-arrow-up-right-from-square',
          href: docsUrl,
        } : undefined,
        isCurrent: false,
      } satisfies TimelineItem;
    });
  }

}
