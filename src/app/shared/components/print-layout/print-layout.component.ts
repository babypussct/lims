import { Component, Input, AfterViewInit, ViewChildren, QueryList, ElementRef, inject } from '@angular/core';
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
            
            <!-- Stack 2 slips vertically. Each slip is strictly 50% of A4 height -->
            @for (job of group; track job.requestId || $index; let i = $index) {
                <div class="print-slip" [class.separator]="i === 0">
                    
                    <!-- 1. Header with QR -->
                    <table class="header-table">
                        <tr>
                            <!-- Left: Title & Meta -->
                            <td class="header-left">
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
                            </td>
                            
                            <!-- Middle: Performer -->
                            <td class="header-mid">
                                <div class="performer-box">
                                    <div class="performer-label">Người thực hiện</div>
                                    <div class="performer-name">{{job.user}}</div>
                                </div>
                            </td>

                            <!-- Right: QR Code -->
                            <td class="header-right">
                                <canvas #qrCanvas [attr.data-qr]="job.requestId || job.sop?.id" class="qr-code"></canvas>
                                <div class="qr-text">{{job.requestId || 'N/A'}}</div>
                            </td>
                        </tr>
                    </table>

                    <!-- 2. Inputs Bar -->
                    <div class="inputs-bar">
                        @for (inp of (job.sop?.inputs || []); track inp.var) {
                             @if (inp.type !== 'checkbox' || job.inputs[inp.var]) {
                                <div class="input-item">
                                    <span class="input-label">{{inp.label}}:</span>
                                    <span class="input-value">
                                        {{job.inputs[inp.var]}}
                                        @if(inp.type === 'checkbox') { <span>(Yes)</span> }
                                    </span>
                                </div>
                             }
                        }
                        <div class="input-item margin-info">
                            <span class="input-label">Hao hụt:</span>
                            <span class="input-value">+{{job.margin}}%</span>
                        </div>
                    </div>

                    <!-- 3. Main Data Table -->
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
                                                <div class="warning-badge">{{item.displayWarning}}</div> 
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
                                                                <td class="sub-note">(Thành phần)</td>
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

                    <!-- 4. Footer -->
                    <div class="footer-section">
                        <table class="footer-table">
                            <tr>
                                <td class="footer-left">
                                    <div class="disclaimer">
                                        <b>Cam kết:</b> {{ footerText }}
                                    </div>
                                    <div class="timestamp">In lúc: {{ getCurrentTime() }}</div>
                                </td>
                                
                                <!-- Signature Block (Conditional) -->
                                @if (showSignature) {
                                    <td class="footer-right">
                                        <div class="signature-box">
                                            <div class="sig-title">Xác nhận / Ký tên</div>
                                            <div class="sig-line"></div>
                                        </div>
                                    </td>
                                }
                            </tr>
                        </table>
                    </div>

                    <!-- Cut Icon (Only for the top slip on a page) -->
                    @if (i === 0) { 
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
    .print-root { 
        font-family: 'Open Sans', sans-serif; 
        color: #000; 
        background-color: white; 
        width: 100%; 
        box-sizing: border-box; 
    }
    
    /* A4 Page Setup */
    .print-page {
        width: 210mm; 
        height: 296mm; 
        margin: 0 auto; 
        page-break-after: always;
        display: flex; 
        flex-direction: column; 
        overflow: hidden;
        background: white;
    }
    .print-page:last-child { page-break-after: auto; }

    /* Each Slip takes exactly 50% height */
    .print-slip { 
        height: 50%; 
        display: flex; 
        flex-direction: column; 
        padding: 12mm 15mm; /* Standard margins */
        box-sizing: border-box; 
        position: relative; 
    }
    .print-slip.separator { 
        border-bottom: 1px dashed #999; 
    }

    /* Header */
    .header-table { width: 100%; border-collapse: collapse; margin-bottom: 10px; border-bottom: 2px solid #000; }
    .header-left { vertical-align: top; padding-bottom: 5px; text-align: left; }
    .header-mid { vertical-align: bottom; width: 120px; padding-bottom: 5px; padding-right: 15px; }
    .header-right { vertical-align: middle; width: 60px; padding-bottom: 2px; text-align: center; }

    .qr-code { width: 48px; height: 48px; }
    .qr-text { font-size: 7px; font-family: monospace; margin-top: 1px; letter-spacing: -0.5px; }

    .meta-row { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; font-size: 10px; }
    .badge { border: 1px solid #000; padding: 1px 4px; border-radius: 2px; font-weight: 800; text-transform: uppercase; }
    .sop-title { font-size: 18px; font-weight: 900; text-transform: uppercase; margin: 0; line-height: 1.1; letter-spacing: -0.5px; }

    .performer-box { border: 1px solid #000; padding: 2px 4px; border-radius: 4px; background: #fff; }
    .performer-label { font-size: 7px; font-weight: 700; text-transform: uppercase; color: #000; letter-spacing: 0.5px; }
    .performer-name { font-size: 10px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    /* Inputs */
    .inputs-bar { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; font-size: 10px; padding: 3px 0; border-bottom: 1px solid #ddd; }
    .input-item { display: flex; align-items: center; gap: 4px; }
    .input-label { font-weight: 700; color: #444; font-size: 9px; text-transform: uppercase; }
    .input-value { font-weight: 700; font-family: monospace; font-size: 11px; }
    .margin-info { margin-left: auto; padding-left: 10px; border-left: 1px solid #ccc; }

    /* Table */
    .table-container { flex: 1; overflow: hidden; }
    .data-table { width: 100%; font-size: 11px; border-collapse: collapse; }
    .data-table th { border-bottom: 1px solid #000; text-align: left; padding: 2px 0; font-weight: 800; font-size: 9px; text-transform: uppercase; }
    .data-table td { border-bottom: 1px solid #eee; vertical-align: top; padding: 3px 2px; }
    
    .col-name { width: 50%; }
    .col-amount { width: 15%; text-align: right; }
    .col-unit { width: 10%; text-align: center; }
    
    .item-name { font-weight: 700; color: #000; }
    .warning-badge { font-size: 8px; border: 1px solid #000; display: inline-block; padding: 0 2px; border-radius: 2px; margin-left: 4px; vertical-align: middle; }
    .cell-amount { text-align: right; font-weight: 700; font-family: monospace; font-size: 12px; }
    .cell-unit { text-align: center; font-size: 10px; font-weight: 600; }
    .cell-note { font-style: italic; color: #444; font-size: 9px; padding-left: 5px; }

    /* Sub Table */
    .sub-table { width: 100%; font-size: 9px; margin-left: 10px; border-left: 2px solid #ccc; padding-left: 8px; margin-top: 2px; }
    .sub-table td { border: none; padding: 1px 0; }
    .sub-name { color: #333; }
    .sub-amount { text-align: right; font-weight: 700; font-family: monospace; }

    /* Footer */
    .footer-section { margin-top: auto; padding-top: 8px; border-top: 2px solid #000; }
    .footer-table { width: 100%; }
    .footer-left { vertical-align: top; padding-right: 15px; font-size: 9px; color: #444; }
    .footer-right { vertical-align: bottom; width: 120px; text-align: center; }
    
    .timestamp { font-size: 8px; font-style: italic; margin-top: 3px; color: #666; font-family: monospace; }
    
    .signature-box { border: 1px solid #ccc; height: 50px; position: relative; width: 100%; border-radius: 4px; }
    .sig-title { font-size: 8px; background: white; position: absolute; top: -6px; left: 5px; padding: 0 4px; font-weight: 700; text-transform: uppercase; color: #555; }

    /* Cut Line Visual */
    .cut-line { 
        position: absolute; 
        bottom: -6px; 
        left: 0; 
        width: 100%;
        text-align: center;
        font-size: 10px;
        color: #999;
        pointer-events: none;
    }
    .scissor { font-size: 14px; margin-right: 5px; vertical-align: middle; }
  `]
})
export class PrintLayoutComponent implements AfterViewInit {
  state = inject(StateService);
  formatNum = formatNum;
  formatDate = formatDate;

  @Input() jobs: PrintJob[] = [];
  @Input() isDirectPrint = false;

  @ViewChildren('qrCanvas') qrCanvases!: QueryList<ElementRef<HTMLCanvasElement>>;

  footerText = 'Cam kết sử dụng đúng mục đích.';
  showSignature = true; // Default

  constructor() {
      const conf = this.state.printConfig();
      if (conf) {
          if (conf.footerText) this.footerText = conf.footerText;
          // Respect user config, default true if undefined
          this.showSignature = conf.showSignature !== false;
      }
  }

  get groupedJobs(): PrintJob[][] {
    const groups: PrintJob[][] = [];
    const itemsPerPage = 2; // 2 slips per A4 page
    for (let i = 0; i < this.jobs.length; i += itemsPerPage) {
      groups.push(this.jobs.slice(i, i + itemsPerPage));
    }
    return groups;
  }

  ngAfterViewInit() {
    this.generateQRCodes();
  }

  generateQRCodes() {
    if (typeof QRious === 'undefined') return;

    this.qrCanvases.forEach(canvasRef => {
        const canvas = canvasRef.nativeElement;
        const value = canvas.getAttribute('data-qr') || 'LIMS';
        
        new QRious({
          element: canvas,
          value: value,
          size: 100,
          level: 'L'
        });
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
}