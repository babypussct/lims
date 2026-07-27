import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { formatSampleList } from '../../../shared/utils/utils';

type ReportKind = 'all' | 'group';

interface ReportCardVm {
  id: string;
  kind: ReportKind;
  prefix: string;
  title: string;
  subtitle: string;
  samples: string[];
  version: number;
  pdfUrl?: string | null;
  pdfViewUrl?: string | null;
  docsUrl?: string | null;
  publishedAt?: any;
  publishedBy?: string;
  status?: string;
}

@Component({
  selector: 'app-report-hub-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen && run) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/70 backdrop-blur-sm animate-fade-in">
        <div class="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">

          <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
            <div class="flex items-start justify-between gap-4">
              <div class="flex items-start gap-3 min-w-0">
                <div class="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 flex items-center justify-center border border-red-100/50 dark:border-red-900/20 shrink-0">
                  <i class="fa-solid fa-file-pdf text-sm"></i>
                </div>
                <div class="min-w-0">
                  <h3 class="text-sm font-black text-slate-850 dark:text-slate-100 uppercase tracking-tight">Trung Tâm Báo Cáo</h3>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5 truncate">
                    {{ run?.sopName }} · {{ run?.inputs?.['batchCode'] || run?.id }}
                  </p>
                  <div class="mt-2 flex flex-wrap items-center gap-2">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/40 text-[10px] font-black uppercase">
                      <i class="fa-solid fa-check-double text-[9px]"></i>
                      {{ coveredSamples().length }}/{{ allSamples().length }} mẫu đã có báo cáo
                    </span>
                    @if (missingSamples().length > 0) {
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/40 text-[10px] font-black uppercase">
                        <i class="fa-solid fa-triangle-exclamation text-[9px]"></i>
                        Còn {{ missingSamples().length }} mẫu thiếu
                      </span>
                    }
                  </div>
                </div>
              </div>

              <button (click)="closeModal()" class="w-8 h-8 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 flex items-center justify-center transition active:scale-90 cursor-pointer border-0 shrink-0">
                <i class="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>
          </div>

          <div class="p-5 overflow-y-auto space-y-5 flex-1 custom-scrollbar bg-slate-50/40 dark:bg-slate-950/10">

            <div class="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-2xl p-4">
              <div>
                <div class="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider">Báo cáo hiện hành</div>
                <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  {{ reportCards().length > 0 ? reportCards().length + ' bản in đang khả dụng' : 'Chưa có bản in nào cho mẻ này' }}
                </div>
              </div>
            </div>

            @if (reportCards().length > 0) {
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                @for (card of reportCards(); track card.id) {
                  <div class="bg-white dark:bg-slate-900 border rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col gap-3"
                       [class.border-indigo-200]="card.kind === 'all'"
                       [class.dark:border-indigo-900]="card.kind === 'all'"
                       [class.border-fuchsia-200]="card.kind === 'group'"
                       [class.dark:border-fuchsia-900]="card.kind === 'group'">
                    <div class="flex items-start justify-between gap-3">
                      <div class="min-w-0">
                        <div class="flex items-center gap-1.5 mb-2">
                          <span class="px-2 py-0.5 rounded-md text-[9px] font-black uppercase border"
                                [class.bg-indigo-50]="card.kind === 'all'"
                                [class.text-indigo-700]="card.kind === 'all'"
                                [class.border-indigo-200]="card.kind === 'all'"
                                [class.dark:bg-indigo-950]="card.kind === 'all'"
                                [class.dark:text-indigo-300]="card.kind === 'all'"
                                [class.dark:border-indigo-900]="card.kind === 'all'"
                                [class.bg-fuchsia-50]="card.kind === 'group'"
                                [class.text-fuchsia-700]="card.kind === 'group'"
                                [class.border-fuchsia-200]="card.kind === 'group'"
                                [class.dark:bg-fuchsia-950]="card.kind === 'group'"
                                [class.dark:text-fuchsia-300]="card.kind === 'group'"
                                [class.dark:border-fuchsia-900]="card.kind === 'group'">
                            {{ card.kind === 'all' ? 'Toàn mẻ' : 'Theo nhóm mẫu' }}
                          </span>
                          <span class="text-[10px] font-black text-slate-400 dark:text-slate-500">v{{ card.version || 1 }}</span>
                        </div>
                        <h4 class="text-sm font-black text-slate-850 dark:text-slate-100 leading-snug break-words" [title]="card.samples.join('; ')">
                          {{ card.title }}
                        </h4>
                        <div class="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-1">
                          {{ card.subtitle }}
                        </div>
                      </div>

                      <div class="flex items-center gap-1.5 shrink-0">
                        @if (card.pdfViewUrl || card.pdfUrl) {
                          <button (click)="triggerPreviewPdf(card.pdfViewUrl || card.pdfUrl || '', card.docsUrl || undefined, card.prefix, card.version, card.publishedBy, card.publishedAt)"
                                  class="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/30 dark:hover:bg-red-900/40 dark:text-red-400 flex items-center justify-center transition active:scale-90 border-0 cursor-pointer"
                                  title="Xem PDF">
                            <i class="fa-solid fa-file-pdf text-xs"></i>
                          </button>
                        }
                        @if (card.docsUrl) {
                          <a [href]="getSafeGoogleUrl(card.docsUrl)" target="_blank" rel="noopener noreferrer"
                             class="w-8 h-8 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-950/30 dark:hover:bg-blue-900/40 dark:text-blue-400 flex items-center justify-center transition active:scale-90 border-0 cursor-pointer"
                             title="Mở Docs">
                            <i class="fa-solid fa-file-word text-xs"></i>
                          </a>
                        }
                      </div>
                    </div>

                    <div class="pt-3 border-t border-slate-100 dark:border-slate-800">
                      <div class="flex flex-wrap gap-1">
                        @let chipKey = 'card_' + card.id;
                        @if (expandedChipKeys()[chipKey]) {
                          @for (sample of card.samples; track sample) {
                            <span class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[9px] font-mono font-bold border border-slate-200/50 dark:border-slate-700/50">{{ sample }}</span>
                          }
                          <button (click)="toggleChipExpand(chipKey)" class="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[9px] font-bold border-0 cursor-pointer">
                            Thu gọn
                          </button>
                        } @else {
                          @let shortSamples = getShortenedSampleChips(card.samples);
                          @for (sample of shortSamples.slice(0, 5); track sample) {
                            <span class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[9px] font-mono font-bold border border-slate-200/50 dark:border-slate-700/50">{{ sample }}</span>
                          }
                          @if (shortSamples.length > 5 || card.samples.length > shortSamples.length) {
                            <button (click)="toggleChipExpand(chipKey)" class="px-1.5 py-0.5 rounded bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[9px] font-bold border border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-100 transition active:scale-95 cursor-pointer">
                              Chi tiết
                            </button>
                          }
                        }
                      </div>
                    </div>

                    <div class="pt-1">
                      <div class="text-[9px] text-slate-400 dark:text-slate-500 font-semibold">
                        {{ card.publishedAt ? (card.publishedAt | date:'HH:mm dd/MM/yy') : 'Chưa rõ ngày tạo' }}
                      </div>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <div class="text-center py-10 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <i class="fa-solid fa-file-circle-xmark text-3xl text-slate-300 dark:text-slate-600 mb-3"></i>
                <div class="text-sm font-bold text-slate-600 dark:text-slate-300">Mẻ này chưa có báo cáo</div>
                <div class="text-xs text-slate-400 dark:text-slate-500 mt-1">Mở màn hình nhập kết quả để tạo bản in đầu tiên.</div>
              </div>
            }

            @if (missingSamples().length > 0) {
              <div class="bg-amber-50/70 dark:bg-amber-950/10 border border-amber-200/60 dark:border-amber-900/40 rounded-2xl p-4">
                <div>
                  <div>
                    <div class="text-xs font-black text-amber-800 dark:text-amber-300 uppercase tracking-wider">Mẫu chưa có báo cáo</div>
                    <div class="text-[11px] text-amber-700/80 dark:text-amber-400/80 mt-1">{{ missingSamples().length }} mẫu chưa được phủ bởi báo cáo hiện hành. Vào màn hình nhập kết quả để chọn chính xác phạm vi xuất bản.</div>
                  </div>
                </div>
                <div class="mt-3 flex flex-wrap gap-1">
                  @for (sample of missingSamples(); track sample) {
                    <span class="px-1.5 py-0.5 rounded bg-white/80 dark:bg-slate-900/70 text-amber-700 dark:text-amber-300 text-[9px] font-mono font-bold border border-amber-200/60 dark:border-amber-900/40">{{ sample }}</span>
                  }
                </div>
              </div>
            }

            <div class="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-2xl overflow-hidden">
              <button (click)="toggleHistory()"
                      class="w-full px-4 py-3 flex items-center justify-between gap-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer border-0 bg-transparent">
                <span class="text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  <i class="fa-solid fa-clock-rotate-left mr-1.5 text-slate-400"></i>Lịch sử bản in
                </span>
                <span class="inline-flex items-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-500">
                  {{ historyList.length }} phiên bản
                  <i class="fa-solid" [class.fa-chevron-down]="!showHistory()" [class.fa-chevron-up]="showHistory()"></i>
                </span>
              </button>

              @if (showHistory()) {
                <div class="border-t border-slate-100 dark:border-slate-800 p-3">
                  @if (isLoadingHistory) {
                    <div class="flex items-center justify-center py-6 gap-2 text-slate-400">
                      <i class="fa-solid fa-spinner fa-spin"></i>
                      <span class="text-xs font-semibold">Đang tải lịch sử...</span>
                    </div>
                  } @else if (historyList.length > 0) {
                    <div class="space-y-2 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                      @for (hist of historyList; track historyTrackKey(hist)) {
                        @let samples = getSampleChipsForReport(hist, hist.prefix || 'ALL');
                        <div class="flex items-start justify-between gap-3 bg-slate-50/70 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-800/60 rounded-xl px-3 py-2.5 text-xs">
                          <div class="min-w-0">
                            <div class="flex items-center gap-1.5 flex-wrap">
                              <span class="font-extrabold text-slate-700 dark:text-slate-300">v{{ hist.version || 1 }}</span>
                              <span class="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-500 text-[8px] font-bold uppercase">
                                {{ getHistoryKindLabel(hist.prefix) }}
                              </span>
                              @if (hist.status === 'archived') {
                                <span class="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-[8px] font-black uppercase">Lưu trữ</span>
                              }
                            </div>
                            <div class="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-bold mt-1 break-words">
                              {{ samples.length > 0 ? formatSamples(samples) : 'Chưa rõ mẫu' }}
                            </div>
                            <div class="text-[9px] text-slate-400 mt-0.5">{{ hist.publishedBy || hist.updatedBy || 'Chưa rõ' }} · {{ hist.publishedAt | date:'HH:mm dd/MM/yy' }}</div>
                          </div>
                          <div class="flex items-center gap-1.5 shrink-0">
                            @if (hist.pdfViewUrl || hist.pdfUrl) {
                              <button (click)="triggerPreviewPdf(hist.pdfViewUrl || hist.pdfUrl, hist.docsUrl, hist.prefix === '_NO_PREFIX_' ? '' : hist.prefix, hist.version, hist.publishedBy, hist.publishedAt)"
                                      class="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/30 dark:hover:bg-red-900/40 dark:text-red-400 flex items-center justify-center transition active:scale-90 border-0 cursor-pointer" title="Mở PDF bản này">
                                <i class="fa-solid fa-file-pdf text-[10px]"></i>
                              </button>
                            }
                            @if (hist.docsUrl) {
                              <a [href]="getSafeGoogleUrl(hist.docsUrl)" target="_blank" rel="noopener noreferrer"
                                 class="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-950/30 dark:hover:bg-blue-900/40 dark:text-blue-400 flex items-center justify-center transition active:scale-90 border-0 cursor-pointer" title="Mở Docs bản này">
                                <i class="fa-solid fa-file-word text-[10px]"></i>
                              </a>
                            }
                          </div>
                        </div>
                      }
                    </div>
                  } @else {
                    <div class="text-center py-5 text-slate-400 dark:text-slate-500 text-[10px] font-semibold uppercase tracking-wider">
                      Không có bản in cũ trong lịch sử.
                    </div>
                  }
                </div>
              }
            </div>
          </div>

          <div class="px-5 py-3.5 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0 bg-slate-50/50 dark:bg-slate-950/20">
            <button (click)="triggerCreateReport(undefined)"
                    class="flex items-center gap-1.5 px-4 py-2 text-xs font-black text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 rounded-xl transition active:scale-95 cursor-pointer border-0 bg-transparent">
              <i class="fa-solid fa-pen-to-square text-[11px]"></i> Mở nhập kết quả
            </button>
            <button (click)="closeModal()"
                    class="px-5 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-250 rounded-xl text-xs font-black transition active:scale-95 cursor-pointer border-0">
              Đóng
            </button>
          </div>

        </div>
      </div>
    }
  `
})
export class ReportHubModalComponent {
  @Input() isOpen = false;
  @Input() run: any = null;
  @Input() historyList: any[] = [];
  @Input() isLoadingHistory = false;
  @Input() runStatus = '';

  @Output() close = new EventEmitter<void>();
  @Output() createReport = new EventEmitter<{requestId: string, prefix?: string}>();
  @Output() previewPdf = new EventEmitter<{pdfUrl: string, docsUrl?: string, prefix: string, version?: number, publishedBy?: string, publishedAt?: string}>();

  private sanitizer = inject(DomSanitizer);
  expandedChipKeys = signal<Record<string, boolean>>({});
  showHistory = signal(false);

  closeModal() {
    this.close.emit();
  }

  triggerCreateReport(prefix?: string) {
    if (this.run) {
      this.createReport.emit({ requestId: this.run.id, prefix });
    }
  }

  triggerPreviewPdf(pdfUrl: string, docsUrl: string | undefined, prefix: string, version?: number, publishedBy?: string, publishedAt?: string) {
    this.previewPdf.emit({ pdfUrl, docsUrl, prefix, version, publishedBy, publishedAt });
  }

  getSafeGoogleUrl(docsUrl: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(docsUrl.replace(/\/edit.*$/, '/preview'));
  }

  toggleChipExpand(key: string) {
    this.expandedChipKeys.update(keys => ({
      ...keys,
      [key]: !keys[key]
    }));
  }

  toggleHistory() {
    this.showHistory.update(value => !value);
  }

  allSamples(): string[] {
    return this.sortSamples(this.run?.sampleList || []);
  }

  reportCards(): ReportCardVm[] {
    const cards: ReportCardVm[] = [];
    const summary = this.run?.analysisResultSummary || {};
    const legacy = this.run?.analysisResult || {};

    const allPdfUrl = summary.pdfUrl || legacy.pdfUrl || null;
    const allPdfViewUrl = summary.pdfViewUrl || legacy.pdfViewUrl || null;
    const allDocsUrl = summary.docsUrl || legacy.docsUrl || null;
    if (allPdfUrl || allPdfViewUrl || allDocsUrl) {
      const allReport = {
        includedSamples: summary.includedSamples || legacy.includedSamples,
        samples: summary.samples || legacy.samples
      };
      const samples = this.getSampleChipsForReport(allReport, 'ALL');
      cards.push({
        id: 'current_all',
        kind: 'all',
        prefix: 'ALL',
        title: this.formatSamples(samples),
        subtitle: `Toàn mẻ · ${samples.length} mẫu`,
        samples,
        version: summary.version || legacy.version || 1,
        pdfUrl: allPdfUrl,
        pdfViewUrl: allPdfViewUrl,
        docsUrl: allDocsUrl,
        publishedAt: summary.pdfCreatedAt || summary.updatedAt || legacy.pdfCreatedAt || this.run?.updatedAt,
        publishedBy: summary.updatedBy || legacy.updatedBy || this.run?.user
      });
    }

    const reports = summary.reports || legacy.reports || {};
    for (const [key, rawReport] of Object.entries(reports)) {
      const report = rawReport as any;
      if (!report || !(report.pdfUrl || report.pdfViewUrl || report.docsUrl)) continue;

      const prefixKey = report.prefix || key;
      const normalizedPrefix = prefixKey === '_NO_PREFIX_' ? '' : prefixKey;
      const samples = this.getSampleChipsForReport(report, prefixKey);
      cards.push({
        id: report.id || key,
        kind: 'group',
        prefix: normalizedPrefix,
        title: this.formatSamples(samples),
        subtitle: `${normalizedPrefix === '' ? 'Không tiền tố' : 'Nhóm ' + normalizedPrefix} · ${samples.length} mẫu`,
        samples,
        version: report.version || 1,
        pdfUrl: report.pdfUrl,
        pdfViewUrl: report.pdfViewUrl,
        docsUrl: report.docsUrl,
        publishedAt: report.pdfCreatedAt || report.publishedAt,
        publishedBy: report.publishedBy,
        status: report.status
      });
    }

    return cards.sort((a, b) => {
      if (a.kind !== b.kind) return a.kind === 'all' ? -1 : 1;
      const aFirst = a.samples[0] || '';
      const bFirst = b.samples[0] || '';
      const sampleOrder = aFirst.localeCompare(bFirst, undefined, { numeric: true, sensitivity: 'base' });
      if (sampleOrder !== 0) return sampleOrder;
      return (b.version || 0) - (a.version || 0);
    });
  }

  coveredSamples(): string[] {
    const covered = new Set<string>();
    for (const card of this.reportCards()) {
      card.samples.forEach(sample => covered.add(sample));
    }
    return this.sortSamples(Array.from(covered));
  }

  missingSamples(): string[] {
    const covered = new Set(this.coveredSamples());
    return this.allSamples().filter(sample => !covered.has(sample));
  }

  getSampleChipsForReport(reportObj: any, prefixKey?: string): string[] {
    if (!reportObj) return [];

    if (Array.isArray(reportObj.includedSamples) && reportObj.includedSamples.length > 0) {
      return this.sortSamples(reportObj.includedSamples);
    }

    if (reportObj.samples && typeof reportObj.samples === 'object') {
      const samples = Object.keys(reportObj.samples).filter(key => reportObj.samples[key]?.included !== false);
      if (samples.length > 0) return this.sortSamples(samples);
    }

    if (!this.run?.sampleList) return [];
    if (!prefixKey || prefixKey === 'ALL') return this.allSamples();

    const normalizedPrefix = prefixKey === '_NO_PREFIX_' ? '' : prefixKey;
    return this.allSamples().filter(sample => this.samplePrefix(sample) === normalizedPrefix);
  }

  getShortenedSampleChips(samples: string[]): string[] {
    if (!samples || samples.length === 0) return [];
    const sorted = this.sortSamples(samples);
    const result: string[] = [];
    let i = 0;
    while (i < sorted.length) {
      const start = sorted[i];
      let j = i;
      while (j + 1 < sorted.length && this.isSequential(sorted[j], sorted[j + 1])) {
        j++;
      }
      if (j > i) {
        result.push(`${start} -> ${sorted[j]}`);
      } else {
        result.push(start);
      }
      i = j + 1;
    }
    return result;
  }

  formatSamples(samples: string[]): string {
    return formatSampleList(samples) || 'Chưa rõ mẫu';
  }

  historyTrackKey(hist: any): string {
    return `${hist.version || 'v'}_${hist.reportId || hist.prefix || 'all'}_${hist.publishedAt || hist.pdfFileName || ''}`;
  }

  getHistoryKindLabel(prefix: string | undefined): string {
    if (!prefix || prefix === 'ALL') return 'Toàn mẻ';
    return prefix === '_NO_PREFIX_' ? 'Không tiền tố' : `Nhóm ${prefix}`;
  }

  private samplePrefix(sample: string): string {
    const startsWithLetter = /^[a-zA-Z]/.test(sample);
    return startsWithLetter ? sample.charAt(0).toUpperCase() : '';
  }

  private sortSamples(samples: string[]): string[] {
    return [...(samples || [])].sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
  }

  private isSequential(s1: string, s2: string): boolean {
    const p1 = this.parseSample(s1);
    const p2 = this.parseSample(s2);
    if (!p1 || !p2) return false;
    if (p1.prefix !== p2.prefix) return false;
    if (p1.suffix !== p2.suffix) return false;
    return p1.num + 1 === p2.num;
  }

  private parseSample(sample: string) {
    const match = sample.match(/^([A-Za-z]*)(\d+)(.*)$/);
    if (!match) return null;
    return {
      prefix: match[1],
      num: parseInt(match[2], 10),
      suffix: match[3]
    };
  }
}
