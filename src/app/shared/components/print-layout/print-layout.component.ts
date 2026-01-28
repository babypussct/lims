
import { Component, Input, AfterViewInit, OnChanges, SimpleChanges, ViewChildren, QueryList, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintJob } from '../../../core/services/print.service';
import { StateService } from '../../../core/services/state.service';
import { formatDate, formatNum } from '../../utils/utils';

declare var QRious: any;

@Component({
  selector: 'app-print-layout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="print-root">
       @for (group of groupedJobs; track $index) {
         <!-- A4 Page Container -->
         <div class="print-page">
            
            <!-- Stack 2 slips vertically. -->
            @for (job of group; track job.requestId || $index; let i = $index) {
                <!-- FIX: Removed [class.separator] to prevent double line with cut-line -->
                <div class="print-slip">
                    
                    <!-- 1. HEADER (Horizontal) -->
                    @if (options.showHeader) {
                        <div class="header-container">
                            <!-- Left: Info -->
                            <div class="header-info">
                                <div class="meta-row">
                                    <span class="badge">{{job.sop?.category}}</span>
                                    @if(job.sop?.ref) {
                                        <span class="ref-text">Ref: {{job.sop?.ref}}</span>
                                        <span class="divider">|</span>
                                    }
                                    <span class="date-text">
                                        Ngày: {{ getDisplayDate(job) }}
                                    </span>
                                </div>
                                <h1 class="sop-title">
                                    {{job.sop?.name}}
                                </h1>
                                <!-- Chỉ tiêu (Full Wrap) -->
                                @if (getTargetNames(job).length > 0) {
                                    <div class="targets-row">
                                        <span class="target-label">Chỉ tiêu:</span>
                                        @for(t of getTargetNames(job); track $index) {
                                            <span class="target-badge">{{t}}</span>
                                        }
                                    </div>
                                }
                            </div>

                            <!-- Right: ID & QR (Increased Size) -->
                            <div class="header-qr-group">
                                <div class="id-box">
                                    <div class="id-label">Mã truy xuất (ID)</div>
                                    <div class="id-value">{{job.requestId || 'N/A'}}</div>
                                </div>
                                <!-- QR Canvas -->
                                <canvas #qrCanvas [attr.data-qr]="job.requestId || job.sop?.id" class="qr-code"></canvas>
                            </div>
                        </div>
                    }

                    <!-- 2. Inputs & Meta -->
                    <div class="meta-container">
                        <div class="inputs-bar">
                            @for (inp of (job.sop?.inputs || []); track inp.var) {
                                 @if (inp.type !== 'checkbox' || job.inputs[inp.var]) {
                                    <div class="input-item">
                                        <span class="input-label">{{inp.label}}:</span>
                                        <span class="input-value">
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
                            <div class="input-item margin-info">
                                <span class="input-label">Hao hụt:</span>
                                <!-- FIX: Format margin safely with fallback to inputs -->
                                <span class="input-value">+{{formatNum(job.margin || job.inputs['safetyMargin'] || 0)}}%</span>
                            </div>
                        </div>
                    </div>

                    <!-- 3. Samples List (SMART FLOW TEXT) -->
                    @if (job.inputs['sampleList'] && job.inputs['sampleList'].length > 0) {
                        <div class="samples-section">
                            <div class="section-title">
                                Danh sách mẫu ({{job.inputs['sampleList'].length}})
                            </div>
                            <div class="samples-text">
                                {{ formatSamples(job.inputs['sampleList']) }}
                            </div>
                        </div>
                    }

                    <!-- 4. Main Data Table -->
                    <div class="table-container">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th class="col-name">Hóa chất / Vật tư</th>
                                    <th class="col-amount">Lượng</th>
                                    <th class="col-unit">ĐV</th>
                                    <th class="col-note">Ghi chú</th>
                                </tr>
                            </thead>
                            <tbody>
                                @for (item of job.items; track item.name) {
                                    <tr class="item-row">
                                        <td class="cell-name">
                                            <span class="item-name">{{ item.displayName || item.name }}</span>
                                            @if(item.displayWarning) { 
                                                <span class="warning-badge">{{item.displayWarning}}</span> 
                                            }
                                        </td>
                                        <td class="cell-amount">{{formatNum(item.totalQty)}}</td>
                                        <td class="cell-unit">{{stdUnit(item.unit)}}</td>
                                        <td class="cell-note">{{item.base_note}}</td>
                                    </tr>

                                    @if(item.isComposite) {
                                        <tr class="composite-row">
                                            <td colspan="4">
                                                <div class="sub-table-container">
                                                    <table class="sub-table">
                                                        @for (sub of item.breakdown; track sub.name) {
                                                            <tr>
                                                                <td class="sub-name">• {{ sub.displayName || sub.name }}</td>
                                                                <td class="sub-amount">{{formatNum(sub.displayAmount)}}</td>
                                                                <td class="sub-unit">{{stdUnit(sub.unit)}}</td>
                                                                <td class="sub-note"></td>
                                                            </tr>
                                                        }
                                                    </table>
                                                </div>
                                            </td>
                                        </tr>
                                    }
                                }
                            </tbody>
                        </table>
                    </div>

                    <!-- 5. Footer -->
                    @if (options.showFooter) {
                        <div class="footer-section">
                            <div class="footer-row">
                                <!-- Left -->
                                <div class="footer-left">
                                    <div class="footer-text">
                                        {{ getFooterText() }}
                                    </div>
                                    <div class="timestamp">
                                        In lúc: {{ getCurrentTime() }} | Máy: {{ job.user }}
                                    </div>
                                </div>

                                <!-- Right -->
                                <div class="footer-right">
                                    @if (options.showSignature) {
                                        <div class="digital-approval">
                                            <div class="approval-icon">✔</div>
                                            <div class="approval-info">
                                                <div class="approval-label">XÁC NHẬN ĐIỆN TỬ</div>
                                                <div class="approval-user">{{ job.user }}</div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    }

                    <!-- Cut Icon (Only between slips) -->
                    @if (options.showCutLine && i === 0) { 
                        <div class="cut-line">
                            <span class="scissor">✂</span> - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                        </div> 
                    }
                </div>
            }
         </div>
       }
    </div>
  `,
  styles: [`
    .print-root { font-family: 'Open Sans', sans-serif; color: #000; background-color: white; width: 100%; box-sizing: border-box; }
    
    /* A4 Page Setup */
    .print-page { width: 210mm; height: 296mm; margin: 0 auto; page-break-after: always; display: flex; flex-direction: column; overflow: hidden; background: white; }
    .print-page:last-child { page-break-after: auto; }

    /* Each Slip (A5 approx) */
    .print-slip { height: 50%; display: flex; flex-direction: column; padding: 8mm 12mm; box-sizing: border-box; position: relative; }
    
    /* --- NEW HEADER --- */
    .header-container { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #000; padding-bottom: 6px; margin-bottom: 6px; }
    
    .header-info { flex: 1; padding-right: 15px; }
    .meta-row { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; font-size: 9px; }
    .badge { border: 1px solid #000; padding: 0px 3px; border-radius: 2px; font-weight: 800; text-transform: uppercase; font-size: 8px; }
    .divider { color: #999; }
    
    .sop-title { font-size: 15px; font-weight: 900; text-transform: uppercase; margin: 4px 0; line-height: 1.1; letter-spacing: -0.3px; }
    
    /* TARGETS */
    .targets-row { font-size: 9px; margin-top: 4px; display: flex; flex-wrap: wrap; gap: 4px; align-items: center; }
    .target-label { font-weight: 700; color: #444; margin-right: 2px; }
    .target-badge { border: 1px solid #ccc; padding: 0 4px; border-radius: 3px; font-weight: 600; white-space: nowrap; }

    /* QR Group */
    .header-qr-group { display: flex; align-items: center; gap: 10px; }
    .id-box { text-align: right; }
    .id-label { font-size: 7px; text-transform: uppercase; color: #666; font-weight: 700; }
    .id-value { font-size: 11px; font-family: monospace; font-weight: 800; letter-spacing: -0.5px; line-height: 1; }
    .qr-code { width: 80px; height: 80px; border: 1px solid #eee; display: block; }

    /* Inputs Bar */
    .meta-container { margin-bottom: 6px; font-size: 9px; border-bottom: 1px solid #ddd; padding-bottom: 3px; }
    .inputs-bar { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
    .input-item { display: flex; align-items: center; gap: 3px; }
    .input-label { font-weight: 700; color: #555; font-size: 8px; text-transform: uppercase; }
    .input-value { font-weight: 700; font-family: monospace; font-size: 9px; }
    .margin-info { margin-left: auto; padding-left: 8px; border-left: 1px solid #ccc; }

    /* Samples Text Flow */
    .samples-section { margin-bottom: 6px; border: 1px solid #eee; padding: 3px 5px; border-radius: 4px; background-color: #fafafa; }
    .section-title { font-size: 8px; font-weight: 800; text-transform: uppercase; margin-bottom: 1px; color: #666; }
    .samples-text { font-size: 9px; font-family: 'Courier New', Courier, monospace; font-weight: 600; color: #000; line-height: 1.3; text-align: justify; word-break: break-word; }

    /* Table */
    .table-container { flex: 1; overflow: hidden; min-height: 50px; }
    .data-table { width: 100%; font-size: 9px; border-collapse: collapse; }
    .data-table th { border-bottom: 1px solid #000; text-align: left; padding: 2px 0; font-weight: 800; font-size: 8px; text-transform: uppercase; color: #333; }
    .data-table td { border-bottom: 1px solid #eee; vertical-align: top; padding: 2px 0; }
    
    .col-name { width: 55%; }
    .col-amount { width: 15%; text-align: right; }
    .col-unit { width: 10%; text-align: center; }
    .col-note { width: 20%; text-align: right; }
    
    .item-name { font-weight: 700; color: #000; }
    .warning-badge { font-size: 7px; border: 1px solid #000; display: inline-block; padding: 0 2px; border-radius: 2px; margin-left: 3px; vertical-align: middle; font-weight: bold; }
    .cell-amount { text-align: right; font-weight: 700; font-family: monospace; font-size: 10px; }
    .cell-unit { text-align: center; font-size: 8px; font-weight: 600; color: #555; }
    .cell-note { font-style: italic; color: #666; font-size: 8px; text-align: right; }

    /* Sub Table */
    .sub-table { width: 100%; font-size: 8px; margin-left: 8px; border-left: 1px solid #ccc; padding-left: 6px; margin-top: 1px; }
    .sub-table td { border: none; padding: 0; color: #555; }
    .sub-name { }
    .sub-amount { text-align: right; font-weight: 600; font-family: monospace; }

    /* Footer */
    .footer-section { margin-top: auto; padding-top: 4px; border-top: 1px solid #000; }
    .footer-row { display: flex; justify-content: space-between; align-items: flex-end; }
    
    .footer-left { width: 70%; }
    .footer-text { font-size: 8px; font-style: italic; color: #444; margin-bottom: 2px; line-height: 1.2; }
    .timestamp { font-size: 7px; color: #888; font-family: monospace; }

    .footer-right { width: 30%; display: flex; justify-content: flex-end; }
    
    /* Digital Badge */
    .digital-approval { border: 1px solid #000; border-radius: 4px; padding: 2px 6px; display: flex; align-items: center; gap: 4px; background: #fdfdfd; }
    .approval-icon { font-size: 12px; font-weight: bold; }
    .approval-info { display: flex; flex-direction: column; }
    .approval-label { font-size: 6px; font-weight: 800; text-transform: uppercase; color: #666; line-height: 1; }
    .approval-user { font-size: 8px; font-weight: 700; text-transform: uppercase; line-height: 1; margin-top: 1px; }

    .cut-line { position: absolute; bottom: -6px; left: 0; width: 100%; text-align: center; font-size: 10px; color: #999; pointer-events: none; }
    .scissor { font-size: 14px; margin-right: 5px; vertical-align: middle; }
  `]
})
export class PrintLayoutComponent implements AfterViewInit, OnChanges {
  state = inject(StateService);
  formatNum = formatNum;
  formatDate = formatDate;

  @Input() jobs: PrintJob[] = [];
  @Input() isDirectPrint = false;
  // Default options if not provided
  @Input() options: any = { showHeader: true, showFooter: true, showSignature: true, showCutLine: true };

  @ViewChildren('qrCanvas') qrCanvases!: QueryList<ElementRef<HTMLCanvasElement>>;

  constructor() {}

  get groupedJobs(): PrintJob[][] {
    const groups: PrintJob[][] = [];
    const itemsPerPage = 2; // 2 Slips per A4
    for (let i = 0; i < this.jobs.length; i += itemsPerPage) {
      groups.push(this.jobs.slice(i, i + itemsPerPage));
    }
    return groups;
  }

  ngAfterViewInit() {
    setTimeout(() => {
        this.generateQRCodes();
    }, 100);
  }

  // FIX: Redraw QR when options change (e.g. Header toggle re-renders DOM)
  ngOnChanges(changes: SimpleChanges) {
      if (changes['options'] || changes['jobs']) {
          setTimeout(() => {
              this.generateQRCodes();
          }, 100);
      }
  }

  generateQRCodes() {
    if (typeof QRious === 'undefined') return;
    if (!this.qrCanvases || this.qrCanvases.length === 0) return;
    
    // Construct Base URL dynamically
    const baseUrl = window.location.origin + window.location.pathname + '#/traceability/';

    this.qrCanvases.forEach(canvasRef => {
        const canvas = canvasRef.nativeElement;
        // Optional: Check if already drawn to avoid flicker, but redraw is safer for dynamic changes
        // if (canvas.getAttribute('data-drawn') === 'true') return;

        const id = canvas.getAttribute('data-qr') || 'LIMS';
        const fullUrl = baseUrl + id;
        
        // Increase size for better resolution
        new QRious({ element: canvas, value: fullUrl, size: 250, level: 'L' });
        canvas.setAttribute('data-drawn', 'true');
    });
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
      const day = d.getDate().toString().padStart(2, '0');
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
  }

  getCurrentTime(): string {
      const now = new Date();
      return `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()}`;
  }

  getTargetNames(job: PrintJob): string[] {
      const selectedIds = job.inputs['targetIds'] || [];
      if (!Array.isArray(selectedIds) || selectedIds.length === 0) return [];
      
      const allTargets = job.sop?.targets || [];
      return selectedIds.map(id => {
          const t = allTargets.find((t: any) => t.id === id);
          return t ? t.name : id;
      });
  }

  getFooterText(): string {
      const conf = this.state.printConfig();
      return conf?.footerText || 'Cam kết sử dụng đúng mục đích. Phiếu được quản lý trên LIMS Cloud.';
  }

  getSelectLabel(inp: any, value: any): string {
      if (!inp.options) return value;
      const found = inp.options.find((o: any) => o.value == value);
      return found ? found.label : value;
  }

  formatSamples(rawSamples: string[]): string {
    if (!rawSamples || rawSamples.length === 0) return '';
    const sorted = [...rawSamples].sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
    if (sorted.length === 0) return '';

    const result: string[] = [];
    const parse = (s: string) => {
        const match = s.match(/^([^\d]*)(\d+)(.*)$/);
        return match ? { p: match[1] || '', n: parseInt(match[2], 10), s: match[3] || '', full: s } : null;
    };

    let start = sorted[0];
    let prev = sorted[0];
    let startObj = parse(start);
    let prevObj = startObj;

    for (let i = 1; i < sorted.length; i++) {
        const curr = sorted[i];
        const currObj = parse(curr);
        let continuous = false;
        if (prevObj && currObj) {
            if (prevObj.p === currObj.p && prevObj.s === currObj.s) {
                if (currObj.n === prevObj.n + 1) { continuous = true; }
            }
        }
        if (continuous) {
            prev = curr; prevObj = currObj;
        } else {
            if (start === prev) result.push(start);
            else if (prevObj && startObj && prevObj.n - startObj.n === 1) result.push(`${start}, ${prev}`);
            else result.push(`${start} ➝ ${prev}`);
            start = curr; prev = curr; startObj = currObj; prevObj = currObj;
        }
    }
    if (start === prev) result.push(start);
    else if (prevObj && startObj && prevObj.n - startObj.n === 1) result.push(`${start}, ${prev}`);
    else result.push(`${start} ➝ ${prev}`);

    return result.join(', ');
  }
}
