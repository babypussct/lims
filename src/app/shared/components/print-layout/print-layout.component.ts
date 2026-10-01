
import { Component, Input, Output, EventEmitter, AfterViewInit, OnChanges, OnDestroy, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintJob, PrintOptions } from '../../../core/services/print.service';
import { StateService } from '../../../core/services/state.service';
import { formatDate, formatNum, formatSampleList } from '../../utils/utils';
import { formatSampleDescriptions } from '../../utils/sample-description.utils';
import { loadQrCode } from '../../utils/qr-code';
import { waitForPrintAssets } from '../../utils/print-dom';
import { paginatePrintSlips } from '../../utils/print-pagination';

export interface PrintLayoutState { ready: boolean; pageCount: number; error: string | null; }

@Component({
  selector: 'app-print-layout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #source class="print-root print-source" aria-hidden="true">
            @for (job of jobs; track $index) {
                <div class="print-slip">
                    
                    <!-- 1. HEADER -->
                    @if (options.showHeader) {
                        <div class="header-section">
                            <!-- Left: Main Info -->
                            <div class="header-left">
                                <div class="header-top-row">
                                    <span class="badge-cat">{{job.sop?.category}}</span>
                                    @if(job.sop?.ref) {
                                        <span class="ref-id">Ref: {{job.sop?.ref}}</span>
                                        <span class="sep">|</span>
                                    }
                                    <span class="date-val">Ngày: {{ getDisplayDate(job) }}</span>
                                </div>
                                
                                <h1 class="sop-name">{{job.sop?.name}}</h1>
                                <div class="batch-code">Mã mẻ: {{getBatchCode(job)}}</div>
                                
                                @if (getTargetNames(job).length > 0) {
                                    <div class="targets-list">
                                        <span class="target-label">Chỉ tiêu:</span>
                                        @for(t of getTargetNames(job); track $index) {
                                            <span class="target-tag">{{t}}</span>
                                        }
                                    </div>
                                }
                            </div>

                            <!-- Right: QR & ID (Aligned Correctly) -->
                            <div class="header-right">
                                <div class="id-container">
                                    <div class="id-label">MÃ TRUY XUẤT</div>
                                    <div class="id-text">{{job.requestId || '---'}}</div>
                                </div>
                                <div class="qr-wrapper">
                                    <canvas #qrCanvas [attr.data-qr]="job.requestId || job.sop?.id"></canvas>
                                </div>
                            </div>
                        </div>
                        
                        <div class="header-divider"></div>
                    }

                    <!-- 2. PARAMETERS -->
                    <div class="params-section">
                        <div class="params-grid">
                            @for (inp of (job.sop?.inputs || []); track inp.var) {
                                 @if (inp.type !== 'checkbox' || job.inputs[inp.var]) {
                                    <div class="param-item">
                                        <span class="p-label">{{inp.label}}:</span>
                                        <span class="p-value">
                                            @if (inp.type === 'select' && inp.options) {
                                                {{ getSelectLabel(inp, job.inputs[inp.var]) }}
                                            } @else if (inp.type === 'checkbox') {
                                                <span>(Yes)</span>
                                            } @else {
                                                {{ job.inputs[inp.var] }}
                                            }
                                        </span>
                                    </div>
                                 }
                            }
                            <!-- Margin Display Logic -->
                            <div class="param-item margin-item">
                                <span class="p-label">Hao hụt:</span>
                                <span class="p-value margin-val" [class.text-blue-600]="isAutoMargin(job)">{{getMarginDisplay(job)}}</span>
                            </div>
                        </div>
                    </div>

                    <!-- 3. SAMPLES LIST -->
                    <div class="record-fields">Thiết bị thực dùng: ____________________________________</div>
                    @if (job.inputs['sampleList'] && job.inputs['sampleList'].length > 0) {
                        <div class="samples-box">
                            <div class="box-label">Danh sách mẫu ({{job.inputs['sampleList'].length}})</div>
                            <div class="box-content">{{ formatSampleList(job.inputs['sampleList']) }}</div>
                            @if (formatSampleDescriptionList(job)) {
                                <div class="box-content" style="margin-top: 3px; color: #86198f; font-size: 9px;"><strong>Mô tả:</strong> {{formatSampleDescriptionList(job)}}</div>
                            }
                        </div>
                    }

                    <!-- 4. DATA TABLE -->
                    <div class="data-section">
                        <table class="main-table">
                            <thead>
                                <tr>
                                    <th class="th-name">Hóa chất và vật tư</th>
                                    <th class="th-amount">Lượng</th>
                                    <th class="th-unit">ĐV</th>
                                    <th class="th-note">Ghi chú</th>
                                </tr>
                            </thead>
                            <tbody>
                                @for (item of job.items; track item.name) {
                                    <tr>
                                        <td class="td-name">
                                            <div class="item-title">{{ item.displayName || item.name }}</div>
                                            @if(item.displayWarning) { <div class="item-warn">{{item.displayWarning}}</div> }
                                        </td>
                                        <td class="td-amount">{{formatNum(item.totalQty)}}</td>
                                        <td class="td-unit">{{stdUnit(item.unit)}}</td>
                                        <td class="td-note">{{item.base_note}}<div>Lô/HSD thực dùng: __________</div></td>
                                    </tr>

                                    @if(item.isComposite) {
                                        @for (sub of item.breakdown; track sub.name) {
                                            <tr class="sub-row">
                                                <td class="td-name sub-name">• {{ sub.displayName || sub.name }}</td>
                                                <td class="td-amount sub-amount">{{formatNum(sub.displayAmount)}}</td>
                                                <td class="td-unit sub-unit">{{stdUnit(sub.unit)}}</td>
                                                <td class="td-note"></td>
                                            </tr>
                                        }
                                    }
                                }
                            </tbody>
                        </table>
                    </div>

                    <!-- 5. FOOTER -->
                    @if (options.showFooter) {
                        <div class="footer-section">
                            <div class="footer-divider"></div>
                            <div class="footer-content">
                                <div class="footer-info">
                                    <div class="disclaimer">{{ getFooterText() }}</div>
                                    <div class="meta-print">Chuẩn bị in: {{ getCurrentTime() }} | Người duyệt: {{ job.user || 'Chưa duyệt' }}</div>
                                </div>
                                
                                @if (options.showSignature) {
                                    <div class="signature-box">
                                        <div class="sig-icon">✔</div>
                                        <div class="sig-text">
                                            <div class="sig-label">NGƯỜI DUYỆT TRÊN HỆ THỐNG</div>
                                            <div class="sig-name">{{ job.user }}</div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    }

                </div>
            }
    </div>
    <div #prepared></div>
  `,
  styles: [`
    /* GLOBAL RESET FOR PRINT */
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    
    .print-root {
        width: 210mm; /* A4 Width */
        background: white;
        margin: 0; /* Align top-left for print. Preview modal handles centering. */
        color: #000;
        font-family: 'Open Sans', sans-serif;
    }

    .print-page {
        width: 210mm;
        height: 297mm;
        background: white;
        display: flex;
        flex-direction: column;
        overflow: visible;
        page-break-after: always;
        position: relative;
    }
    .print-page:last-child { page-break-after: auto; }

    .print-slip {
        flex: none;
        padding: 10mm 15mm; /* Safe margins */
        display: flex;
        flex-direction: column;
        position: relative;
        width: 210mm;
        overflow-wrap: anywhere;
    }
    .print-source { position: absolute; left: -100000px; top: 0; }
    .print-page { margin-bottom: 16px; }
    .print-page.print-cut-line::after { content: '✂'; position: absolute; top: 148.5mm; left: 0; right: 0; border-top: 1px dashed #94a3b8; color: #64748b; font-size: 10px; text-align: center; }
    .batch-code { font: 700 10px 'Open Sans', sans-serif; margin-bottom: 5px; }
    .record-fields { font-size: 9px; margin-bottom: 8px; }
    @media print { .print-page { margin-bottom: 0; break-after: page; } .print-page:last-child { break-after: auto; } }

    /* --- HEADER --- */
    .header-section { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px; }
    
    .header-left { flex: 1; padding-right: 10px; }
    .header-top-row { display: flex; align-items: center; gap: 8px; font-size: 9px; color: #555; margin-bottom: 2px; }
    .badge-cat { background: #eef2ff; color: #3730a3; padding: 1px 4px; border-radius: 3px; font-weight: 800; text-transform: uppercase; font-size: 8px; border: 1px solid #c7d2fe; }
    .ref-id { font-weight: 600; color: #444; }
    .sep { color: #ccc; }
    
    .sop-name { font-size: 16px; font-weight: 800; text-transform: uppercase; margin: 4px 0 6px 0; color: #111; line-height: 1.1; letter-spacing: -0.3px; }
    
    .targets-list { font-size: 9px; display: flex; flex-wrap: wrap; gap: 4px; align-items: center; }
    .target-label { font-weight: 700; color: #555; margin-right: 2px; }
    .target-tag { border: 1px solid #ddd; padding: 0 4px; border-radius: 3px; font-weight: 600; color: #333; background: #f9f9f9; }

    .header-right { display: flex; align-items: center; gap: 10px; }
    .id-container { text-align: right; }
    .id-label { font-size: 7px; font-weight: 800; color: #888; letter-spacing: 0.5px; margin-bottom: 1px; }
    .id-text { font-family: 'Roboto Mono', monospace; font-size: 12px; font-weight: 700; color: #000; letter-spacing: -0.5px; line-height: 1; }
    
    .qr-wrapper canvas { width: 70px; height: 70px; display: block; }

    .header-divider { height: 2px; background: #000; margin-bottom: 8px; width: 100%; }

    /* --- PARAMETERS --- */
    .params-section { margin-bottom: 8px; }
    .params-grid { display: flex; flex-wrap: wrap; gap: 10px 15px; font-size: 9px; line-height: 1.3; }
    .param-item { display: flex; align-items: center; gap: 4px; }
    .p-label { color: #666; font-weight: 600; text-transform: uppercase; font-size: 8px; }
    .p-value { color: #000; font-weight: 700; font-family: 'Roboto Mono', monospace; }
    .margin-item { margin-left: auto; }
    .margin-val { color: #d97706; }

    /* --- SAMPLES --- */
    .samples-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 4px 6px; margin-bottom: 8px; }
    .box-label { font-size: 8px; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 2px; }
    .box-content { font-family: 'Roboto Mono', monospace; font-size: 9px; font-weight: 600; color: #334155; line-height: 1.3; text-align: justify; }

    /* --- TABLE --- */
    .data-section { flex: 1; min-height: 50px; }
    .main-table { width: 100%; border-collapse: collapse; font-size: 9px; }
    
    .main-table th { text-align: left; border-bottom: 1px solid #999; padding: 3px 0; font-weight: 800; color: #333; text-transform: uppercase; font-size: 8px; }
    .th-amount { text-align: right; }
    .th-unit { text-align: center; }
    .th-note { text-align: right; }

    .main-table td { border-bottom: 1px solid #f1f5f9; padding: 4px 0; vertical-align: top; color: #1e293b; }
    .td-name { width: 55%; padding-right: 5px; }
    .item-title { font-weight: 700; font-size: 10px; color: #000; }
    .item-warn { font-size: 7px; color: #dc2626; font-weight: 600; margin-top: 1px; }
    
    .td-amount { width: 15%; text-align: right; font-family: 'Roboto Mono', monospace; font-weight: 700; font-size: 10px; color: #000; }
    .td-unit { width: 10%; text-align: center; font-weight: 600; font-size: 8px; color: #666; }
    .td-note { width: 20%; text-align: right; font-style: italic; color: #64748b; font-size: 8px; }

    .sub-row td { color: #475569; padding-top: 2px; padding-bottom: 2px; border-bottom: none; }
    .sub-name { padding-left: 8px; font-size: 9px; font-weight: 500; }
    .sub-amount { font-size: 9px; font-weight: 500; color: #475569; }

    /* --- FOOTER --- */
    .footer-section { margin-top: auto; padding-top: 6px; }
    .footer-divider { height: 1px; background: #000; margin-bottom: 4px; width: 100%; opacity: 0.2; }
    .footer-content { display: flex; justify-content: space-between; align-items: flex-end; }
    
    .footer-info { flex: 1; }
    .disclaimer { font-size: 8px; color: #666; font-style: italic; margin-bottom: 2px; }
    .meta-print { font-size: 7px; color: #999; font-family: 'Roboto Mono', monospace; }

    .signature-box { border: 1px solid #94a3b8; border-radius: 4px; padding: 5px 8px; display: flex; align-items: center; gap: 6px; background: #fff; }
    .sig-icon { font-size: 12px; color: #059669; }
    .sig-label { font-size: 7px; font-weight: 800; color: #64748b; line-height: 1.4; }
    .sig-name { font-size: 9px; font-weight: 700; color: #0f172a; text-transform: uppercase; margin-top: 2px; line-height: 1.4; }

    /* --- CUT LINE --- */
    .cut-line { position: absolute; bottom: -6px; left: 0; width: 100%; display: flex; align-items: center; justify-content: center; height: 12px; }
    .cut-icon { font-size: 12px; color: #94a3b8; background: white; padding: 0 5px; position: relative; z-index: 1; }
    .dashed-line { position: absolute; left: 0; right: 0; top: 50%; border-top: 1px dashed #cbd5e1; }
  `]
})
export class PrintLayoutComponent implements AfterViewInit, OnChanges, OnDestroy {
  state = inject(StateService);
  formatNum = formatNum;
  formatDate = formatDate;
  formatSampleList = formatSampleList;

  formatSampleDescriptionList(job: PrintJob): string {
    return formatSampleDescriptions(job.inputs?.sampleList || [], job.inputs?.sampleDescriptionMap || {});
  }

  @Input() jobs: PrintJob[] = [];
  @Input() options: PrintOptions = { showHeader: true, showFooter: true, showSignature: true, showCutLine: true };
  @Input() preparedAt = new Date();
  @Output() layoutState = new EventEmitter<PrintLayoutState>();
  @ViewChild('source') source!: ElementRef<HTMLElement>;
  @ViewChild('prepared') prepared!: ElementRef<HTMLElement>;
  private revision = 0;
  private ready = false;

  ngAfterViewInit() { this.scheduleLayout(); }
  ngOnChanges() { if (this.source) this.scheduleLayout(); }
  ngOnDestroy() { this.revision++; }
  retryLayout() { this.scheduleLayout(); }

  private scheduleLayout(): void {
    const revision = ++this.revision;
    this.ready = false;
    this.layoutState.emit({ ready: false, pageCount: 0, error: null });
    // Angular finishes applying input/options bindings before measuring.
    queueMicrotask(() => void this.prepareLayout(revision));
  }

  private async prepareLayout(revision: number): Promise<void> {
    try {
      const source = this.source.nativeElement;
      await waitForPrintAssets(source);
      const canvases = Array.from(source.querySelectorAll<HTMLCanvasElement>('canvas'));
      if (canvases.length) {
        const qr = await loadQrCode();
        const baseUrl = window.location.origin + window.location.pathname + '#/traceability/';
        await Promise.all(canvases.map(canvas => qr.toCanvas(canvas, baseUrl + (canvas.dataset['qr'] || 'LIMS'), {
          width: 200, errorCorrectionLevel: 'M',
        })));
        canvases.forEach(canvas => { canvas.style.width = '70px'; canvas.style.height = '70px'; });
      }
      if (revision !== this.revision) return;
      const pages = paginatePrintSlips(source, this.options.showCutLine);
      pages.classList.remove('print-source');
      pages.removeAttribute('aria-hidden');
      this.prepared.nativeElement.replaceChildren(pages);
      this.ready = true;
      this.layoutState.emit({ ready: true, pageCount: pages.children.length, error: null });
    } catch (error) {
      if (revision !== this.revision) return;
      this.prepared.nativeElement.replaceChildren();
      this.layoutState.emit({ ready: false, pageCount: 0, error: error instanceof Error ? error.message : 'Không chuẩn bị được bản in.' });
    }
  }

  getPreparedContent(): HTMLElement {
    const content = this.prepared.nativeElement.firstElementChild as HTMLElement | null;
    if (!this.ready || !content) throw new Error('Bản in chưa sẵn sàng. Vui lòng đợi hoặc thử lại.');
    return content;
  }

  stdUnit(unit: string): string {
      const u = unit?.toLowerCase().trim() || '';
      if (u === 'gram' || u === 'grams') return 'g';
      if (u === 'milliliter' || u === 'ml') return 'mL';
      if (u === 'microliter' || u === 'ul') return 'µL';
      return unit;
  }

  getDisplayDate(job: PrintJob): string {
      if (job.analysisDate) {
          const parts = job.analysisDate.split('-');
          if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      const d = new Date(job.date);
      if (!Number.isFinite(d.getTime())) return 'Chưa rõ';
      return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()}`;
  }

  getBatchCode(job: PrintJob): string {
      const code = job.batchCode ?? job.inputs?.['batchCode'] ?? job.requestId;
      return code || (job.requestId ? 'Chưa có mã mẻ' : 'Bản nháp');
  }

  getCurrentTime(): string {
      const now = this.preparedAt;
      return `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()}`;
  }

  getTargetNames(job: PrintJob): string[] {
      const selectedIds = job.inputs['targetIds'] || [];
      const allTargets = job.sop?.targets || [];
      return selectedIds.map((id: any) => {
          const t = allTargets.find((x: any) => x.id === id);
          return t ? t.name : id;
      });
  }

  getFooterText(): string { return this.state.printConfig()?.footerText || 'Cam kết sử dụng đúng mục đích. Phiếu được quản lý trên hệ thống LIMS.'; }
  getSelectLabel(inp: any, value: any): string { return inp.options?.find((o: any) => o.value == value)?.label || value; }

  // New Helper for Margin Display
  isAutoMargin(job: PrintJob): boolean {
      const val = job.margin !== undefined ? job.margin : (job.inputs['safetyMargin'] || 0);
      return val < 0;
  }

  getMarginDisplay(job: PrintJob): string {
      const val = job.margin !== undefined ? job.margin : (job.inputs['safetyMargin'] || 0);
      if (val < 0) return 'Theo cấu hình (tự động)';
      return `+${this.formatNum(val)}%`;
  }
}
