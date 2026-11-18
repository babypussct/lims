import { ReportBulkPrintComponent } from './report-bulk-print.component';
import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { formatSampleList, getSafeGoogleUrl as sanitizeGoogleUrl } from '../../../shared/utils/utils';
import { AppModalShellComponent } from '../../../shared/components/ui/modal-shell/modal-shell.component';
import { AppButtonComponent } from '../../../shared/components/ui/button/button.component';
import {
  BatchReportsProjection,
  ReportCardProjection,
  buildBatchReportsProjection,
} from '../services/result-reports-projection';
import { timestampToDate } from '../../../shared/utils/timestamp';

@Component({
  selector: 'app-report-hub-modal',
  standalone: true,
  imports: [ReportBulkPrintComponent, CommonModule, AppModalShellComponent, AppButtonComponent],
  template: `
    @if (isOpen && run) {
      @let projection = reportsProjection();
      <app-modal-shell
        size="lg"
        title="Trung tâm báo cáo PDF"
        [description]="modalSubtitle()"
        (closed)="closeModal()">

        <div modalHeader class="mt-2 flex flex-wrap items-center gap-2">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-900/40 text-[11px] font-bold">
            <i class="fa-solid fa-check-double text-[10px]" aria-hidden="true"></i>
            {{ projection.coverage.published }}/{{ projection.coverage.total }} mẫu đã có báo cáo
          </span>
          @if (projection.coverage.unpublishedSamples.length > 0) {
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border border-amber-200/70 dark:border-amber-900/40 text-[11px] font-bold">
              <i class="fa-solid fa-triangle-exclamation text-[10px]" aria-hidden="true"></i>
              Còn {{ projection.coverage.unpublishedSamples.length }} mẫu thiếu
            </span>
          }
          @if (projection.hasStaleReport) {
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100/80 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-300/70 dark:border-amber-800/60 text-[11px] font-bold">
              <i class="fa-solid fa-rotate text-[10px]" aria-hidden="true"></i>
              Số liệu đã đổi sau khi xuất (Stale)
            </span>
          }
        </div>

        <div modalBody class="space-y-4">
          <app-report-bulk-print [cards]="projection.cards" [samples]="run.sampleList || []" />
          @if (projection.hasStaleReport) {
            <div class="rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/70 dark:bg-amber-950/20 px-4 py-3 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2.5">
              <i class="fa-solid fa-circle-info shrink-0" aria-hidden="true"></i>
              <span>Bản PDF đánh dấu <strong>Cần xuất lại</strong> là bản trước khi số liệu được chỉnh sửa. Hãy vào màn hình nhập kết quả để xuất bản mới.</span>
            </div>
          }

          @if (projection.cards.length > 0) {
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              @for (card of projection.cards; track card.id) {
                <div class="bg-white dark:bg-slate-900 border rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col gap-3"
                     [class.border-amber-300]="card.isStale"
                     [class.dark:border-amber-800/70]="card.isStale"
                     [class.border-slate-200]="!card.isStale"
                     [class.dark:border-slate-800]="!card.isStale">
                  <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0">
                      <div class="flex items-center flex-wrap gap-1.5 mb-2">
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold border"
                              [class]="card.kind === 'all'
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900/50'
                                : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'">
                          {{ card.kind === 'all' ? 'Toàn mẻ' : 'Theo nhóm mẫu' }}
                        </span>
                        <span class="text-[11px] font-bold text-slate-500 dark:text-slate-400">v{{ card.version || 1 }}</span>
                        @if (card.isStale) {
                          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50">
                            Cần xuất lại
                          </span>
                        }
                      </div>
                      <h4 class="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug break-words" [title]="card.samples.join('; ')">
                        {{ card.title }}
                      </h4>
                      <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        {{ card.subtitle }}
                      </div>
                    </div>

                    <div class="flex items-center gap-1.5 shrink-0">
                      @if (card.pdfViewUrl || card.pdfUrl) {
                        <button type="button" (click)="triggerPreviewPdf(card.pdfViewUrl || card.pdfUrl || '', card.docsUrl || undefined, card.prefix, card.version, card.publishedBy, formatDateValue(card.publishedAt))"
                                class="w-8 h-8 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/30 dark:hover:bg-rose-900/40 dark:text-rose-400 flex items-center justify-center transition active:scale-90 border border-rose-200/60 dark:border-rose-900/40 cursor-pointer"
                                title="Xem PDF">
                          <i class="fa-solid fa-file-pdf text-xs" aria-hidden="true"></i>
                        </button>
                      }
                      @if (card.docsUrl) {
                        <a [href]="getSafeGoogleUrl(card.docsUrl)" target="_blank" rel="noopener noreferrer"
                           class="w-8 h-8 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-950/30 dark:hover:bg-blue-900/40 dark:text-blue-400 flex items-center justify-center transition active:scale-90 border border-blue-200/60 dark:border-blue-900/40 cursor-pointer"
                           title="Mở Google Docs">
                          <i class="fa-solid fa-file-word text-xs" aria-hidden="true"></i>
                        </a>
                      }
                    </div>
                  </div>

                  <div class="pt-2.5 border-t border-slate-100 dark:border-slate-800">
                    <div class="flex flex-wrap gap-1">
                      @let chipKey = 'card_' + card.id;
                      @if (expandedChipKeys()[chipKey]) {
                        @for (sample of card.samples; track sample) {
                          <span class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-mono font-semibold border border-slate-200/70 dark:border-slate-700/60">{{ sample }}</span>
                        }
                        <button type="button" (click)="toggleChipExpand(chipKey)" class="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-semibold border-0 cursor-pointer">
                          Thu gọn
                        </button>
                      } @else {
                        @let shortSamples = getShortenedSampleChips(card.samples);
                        @for (sample of shortSamples.slice(0, 5); track sample) {
                          <span class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-mono font-semibold border border-slate-200/70 dark:border-slate-700/60">{{ sample }}</span>
                        }
                        @if (shortSamples.length > 5 || card.samples.length > shortSamples.length) {
                          <button type="button" (click)="toggleChipExpand(chipKey)" class="px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800/60 text-indigo-600 dark:text-indigo-400 text-[10px] font-semibold border border-slate-200/70 dark:border-slate-700/60 hover:bg-slate-100 transition cursor-pointer">
                            Chi tiết
                          </button>
                        }
                      }
                    </div>
                  </div>

                  <div class="text-[10px] text-slate-400 dark:text-slate-500 flex items-center justify-between gap-2">
                    <span>{{ toDate(card.publishedAt) ? (toDate(card.publishedAt) | date:'HH:mm dd/MM/yyyy') : 'Chưa rõ ngày tạo' }}</span>
                    @if (card.publishedBy) {
                      <span class="truncate">{{ card.publishedBy }}</span>
                    }
                  </div>
                </div>
              }
            </div>
          } @else {
            <div class="text-center py-10 bg-slate-50/70 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
              <i class="fa-solid fa-file-circle-xmark text-3xl text-slate-300 dark:text-slate-600 mb-3" aria-hidden="true"></i>
              <div class="text-sm font-bold text-slate-700 dark:text-slate-200">Mẻ này chưa có báo cáo PDF</div>
              <div class="text-xs text-slate-500 dark:text-slate-400 mt-1">Mở màn hình nhập kết quả để xuất bản lần đầu.</div>
            </div>
          }

          @if (projection.coverage.unpublishedSamples.length > 0) {
            <div class="bg-amber-50/70 dark:bg-amber-950/15 border border-amber-200/70 dark:border-amber-900/40 rounded-2xl p-4">
              <div class="text-xs font-bold text-amber-800 dark:text-amber-300">Mẫu chưa có báo cáo ({{ projection.coverage.unpublishedSamples.length }})</div>
              <div class="text-[11px] text-amber-700/90 dark:text-amber-400/90 mt-1">
                Vào màn hình nhập kết quả để chọn đúng phạm vi mẫu trước khi xuất bản PDF.
              </div>
              <div class="mt-2.5 flex flex-wrap gap-1.5">
                @for (sample of projection.coverage.unpublishedSamples; track sample) {
                  <span class="px-2 py-0.5 rounded bg-white/90 dark:bg-slate-900/80 text-amber-800 dark:text-amber-300 text-[10px] font-mono font-bold border border-amber-200/70 dark:border-amber-900/40">{{ sample }}</span>
                }
              </div>
            </div>
          }

          <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden">
            <button type="button" (click)="toggleHistory()"
                    class="w-full px-4 py-3 flex items-center justify-between gap-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer border-0 bg-transparent">
              <span class="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <i class="fa-solid fa-clock-rotate-left text-slate-400" aria-hidden="true"></i>
                Lịch sử bản in
              </span>
              <span class="inline-flex items-center gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                {{ historyList.length }} phiên bản
                <i class="fa-solid" [class.fa-chevron-down]="!showHistory()" [class.fa-chevron-up]="showHistory()" aria-hidden="true"></i>
              </span>
            </button>

            @if (showHistory()) {
              <div class="border-t border-slate-100 dark:border-slate-800 p-3">
                @if (isLoadingHistory) {
                  <div class="flex items-center justify-center py-6 gap-2 text-slate-400">
                    <i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
                    <span class="text-xs font-semibold">Đang tải lịch sử...</span>
                  </div>
                } @else if (historyList.length > 0) {
                  <div class="space-y-2 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                    @for (hist of historyList; track historyTrackKey(hist)) {
                      @let samples = getSampleChipsForReport(hist, hist.prefix || 'ALL');
                      <div class="flex items-start justify-between gap-3 bg-slate-50/70 dark:bg-slate-950/30 border border-slate-200/60 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs">
                        <div class="min-w-0">
                          <div class="flex items-center gap-1.5 flex-wrap">
                            <span class="font-bold text-slate-800 dark:text-slate-200">v{{ hist.version || 1 }}</span>
                            <span class="px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold">
                              {{ getHistoryKindLabel(hist.prefix) }}
                            </span>
                            @if (hist.status === 'archived') {
                              <span class="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[10px] font-semibold">Lưu trữ</span>
                            }
                          </div>
                          <div class="text-[11px] text-slate-600 dark:text-slate-300 font-mono font-semibold mt-1 break-words">
                            {{ samples.length > 0 ? formatSamples(samples) : 'Chưa rõ mẫu' }}
                          </div>
                          <div class="text-[10px] text-slate-400 mt-0.5">
                            {{ hist.publishedBy || hist.updatedBy || 'Chưa rõ' }} · {{ toDate(hist.publishedAt) ? (toDate(hist.publishedAt) | date:'HH:mm dd/MM/yy') : '—' }}
                          </div>
                        </div>
                        <div class="flex items-center gap-1.5 shrink-0">
                          @if (hist.pdfViewUrl || hist.pdfUrl) {
                            <button type="button" (click)="triggerPreviewPdf(hist.pdfViewUrl || hist.pdfUrl, hist.docsUrl, hist.prefix === '_NO_PREFIX_' ? '' : hist.prefix, hist.version, hist.publishedBy, formatDateValue(hist.publishedAt))"
                                    class="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/30 dark:hover:bg-rose-900/40 dark:text-rose-400 flex items-center justify-center transition active:scale-90 border border-rose-200/60 dark:border-rose-900/40 cursor-pointer" title="Xem PDF bản này">
                              <i class="fa-solid fa-file-pdf text-[10px]" aria-hidden="true"></i>
                            </button>
                          }
                          @if (hist.docsUrl) {
                            <a [href]="getSafeGoogleUrl(hist.docsUrl)" target="_blank" rel="noopener noreferrer"
                               class="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-950/30 dark:hover:bg-blue-900/40 dark:text-blue-400 flex items-center justify-center transition active:scale-90 border border-blue-200/60 dark:border-blue-900/40 cursor-pointer" title="Mở Docs bản này">
                              <i class="fa-solid fa-file-word text-[10px]" aria-hidden="true"></i>
                            </a>
                          }
                        </div>
                      </div>
                    }
                  </div>
                } @else {
                  <div class="text-center py-5 text-slate-400 dark:text-slate-500 text-xs">
                    Không có bản in cũ trong lịch sử.
                  </div>
                }
              </div>
            }
          </div>
        </div>

        <div modalFooter class="flex items-center justify-between gap-3 w-full">
          <button type="button" (click)="triggerCreateReport(undefined)"
                  class="inline-flex h-9 items-center gap-1.5 px-3.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-xl transition active:scale-95 cursor-pointer border-0 bg-transparent">
            <i class="fa-solid fa-pen-to-square text-[11px]" aria-hidden="true"></i>
            <span>Mở nhập kết quả</span>
          </button>
          <app-button variant="secondary" size="sm" (click)="closeModal()">
            Đóng
          </app-button>
        </div>
      </app-modal-shell>
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

  expandedChipKeys = signal<Record<string, boolean>>({});
  showHistory = signal(false);

  modalSubtitle(): string {
    const batch = this.run?.inputs?.['batchCode'] || this.run?.id || 'Chưa có mã mẻ';
    return `${this.run?.sopName || ''} · ${batch}`;
  }

  reportsProjection(): BatchReportsProjection {
    return buildBatchReportsProjection(this.run);
  }

  toDate(value: any): Date | null {
    if (!value) return null;
    if (value instanceof Date) return value;
    return timestampToDate(value);
  }

  formatDateValue(value: any): string | undefined {
    const d = this.toDate(value);
    return d ? d.toISOString() : (typeof value === 'string' ? value : undefined);
  }

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

  getSafeGoogleUrl(docsUrl: string): string {
    return sanitizeGoogleUrl(docsUrl, 'doc');
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
    return this.reportsProjection().reportableSamples;
  }

  reportCards(): ReportCardProjection[] {
    return this.reportsProjection().cards;
  }

  coveredSamples(): string[] {
    return this.sortSamples(Array.from(this.reportsProjection().coverage.publishedSamples));
  }

  missingSamples(): string[] {
    return this.reportsProjection().coverage.unpublishedSamples;
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
