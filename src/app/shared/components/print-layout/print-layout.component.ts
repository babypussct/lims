
import { Component, inject, computed, OnInit, signal, ViewEncapsulation, AfterViewInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PrintService, PrintJob } from '../../../core/services/print.service';
import { StateService } from '../../../core/services/state.service';
import { formatDate, formatNum, cleanName } from '../../utils/utils';

@Component({
  selector: 'app-print-layout',
  standalone: true,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None, // Allow global styles for body/html in print mode
  template: `
    <!-- Container -->
    <div class="print-root">
       <!-- Loading Indicator (only shows if waiting) -->
       @if (isLoading()) {
         <div class="loading-overlay">
            <div>Đang tải dữ liệu in...</div>
         </div>
       }

       @for (group of groupedJobs(); track $index) {
         <!-- A4 Page Container -->
         <div class="print-page">
            
            <!-- Stack 2 slips vertically. Each slip is strictly 50% of A4 height -->
            @for (job of group; track job.sop.id; let i = $index) {
                <div class="print-slip" [class.separator]="i === 0">
                    
                    <!-- 1. Header -->
                    <table class="header-table">
                        <tr>
                            <!-- Left: Title & Meta -->
                            <td class="header-left">
                                <div class="meta-row">
                                    <span class="badge">{{job.sop.category}}</span>
                                    
                                    @if(job.sop.ref) {
                                        <span class="ref-text">Ref: {{job.sop.ref}}</span>
                                        <span class="divider">|</span>
                                    }

                                    <span class="date-text">
                                        Ngày phân tích: {{ getDisplayDate(job) }}
                                    </span>
                                </div>
                                <h1 class="sop-title">
                                    {{job.sop.name}}
                                </h1>
                            </td>
                            <!-- Right: Performer -->
                            <td class="header-right">
                                <div class="performer-box">
                                    <div class="performer-label">Người thực hiện</div>
                                    <div class="performer-name">{{job.user}}</div>
                                </div>
                            </td>
                        </tr>
                    </table>

                    <!-- 2. Inputs Bar -->
                    <div class="inputs-bar">
                        @for (inp of job.sop.inputs; track inp.var) {
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
                        <!-- Margin Info -->
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
                                        <b>Lưu ý:</b> {{ footerText() }}
                                    </div>
                                </td>
                                <td class="footer-right">
                                    <div class="signature-box">
                                        <div class="sig-title">Người pha chế</div>
                                        <div class="sig-line"></div>
                                        <div class="sig-note">(Ký & ghi rõ họ tên)</div>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </div>

                    <!-- Cut Icon -->
                    @if (i === 0) { 
                        <div class="cut-line">
                            <span class="scissor">✂</span>
                        </div> 
                    }
                </div>
            }
         </div>
       }
    </div>
  `,
  styles: [`
    /* 
      CRITICAL: These styles replace Tailwind for offline safety.
      They are encapsulated strictly to the print layout logic.
    */
    
    /* Reset & Base */
    .print-root {
        font-family: 'Open Sans', 'Roboto', sans-serif;
        color: #000;
        background-color: #f1f5f9; /* Gray-100 for screen preview */
        min-height: 100vh;
        padding: 20px 0;
        box-sizing: border-box;
    }

    .loading-overlay {
        position: fixed; inset: 0; background: white; 
        display: flex; align-items: center; justify-content: center; 
        z-index: 9999; font-weight: bold;
    }

    /* Page Definition */
    .print-page {
        width: 210mm;
        height: 296mm; /* A4 */
        background: white;
        margin: 0 auto 20px auto;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        position: relative;
    }

    .print-slip {
        height: 50%; /* Half page */
        position: relative;
        display: flex;
        flex-direction: column;
        padding: 15px 25px;
        box-sizing: border-box;
        border-bottom: 1px solid transparent;
    }

    .print-slip.separator {
        border-bottom: 1px dashed #000;
    }

    /* Header */
    .header-table { width: 100%; border-collapse: collapse; margin-bottom: 8px; border-bottom: 2px solid #000; }
    .header-left { vertical-align: bottom; padding-bottom: 8px; text-align: left; }
    .header-right { vertical-align: bottom; width: 140px; padding-bottom: 8px; }

    .meta-row { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; font-size: 10px; }
    .badge { border: 1px solid #000; padding: 1px 4px; border-radius: 2px; font-weight: 700; text-transform: uppercase; }
    .ref-text { font-weight: 700; color: #333; }
    .divider { color: #ccc; }
    .date-text { font-style: italic; font-weight: 500; }
    
    .sop-title { font-size: 18px; font-weight: 900; text-transform: uppercase; margin: 0; line-height: 1.1; }

    .performer-box { display: flex; flex-direction: column; align-items: center; justify-content: flex-end; width: 100%; }
    .performer-label { font-size: 9px; font-weight: 700; text-transform: uppercase; margin-bottom: 2px; color: #555; }
    .performer-name { font-size: 13px; font-weight: 700; border-bottom: 1px dotted #000; text-align: center; width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    /* Inputs Bar */
    .inputs-bar {
        display: flex; align-items: center; gap: 12px; margin-bottom: 8px;
        font-size: 10px; padding: 4px 8px; border: 1px solid #e2e8f0; border-radius: 4px;
        background-color: #f8fafc;
        overflow: hidden;
    }
    .input-item { display: flex; align-items: center; gap: 4px; white-space: nowrap; }
    .input-label { font-weight: 700; text-transform: uppercase; color: #555; font-size: 9px; }
    .input-value { font-weight: 700; border-bottom: 1px solid #cbd5e1; padding: 0 2px; min-width: 15px; text-align: center; }
    .margin-info { margin-left: auto; padding-left: 10px; border-left: 1px solid #ccc; }

    /* Main Table */
    .table-container { flex: 1; position: relative; }
    .data-table { width: 100%; font-size: 11px; border-collapse: collapse; table-layout: fixed; }
    .data-table th { border-bottom: 2px solid #000; text-align: left; padding: 4px 0; font-weight: 800; text-transform: uppercase; font-size: 9px; }
    .data-table td { border-bottom: 1px solid #e2e8f0; vertical-align: top; padding: 6px 2px; }
    
    .col-name { width: 45%; }
    .col-amount { width: 15%; text-align: right; }
    .col-unit { width: 10%; text-align: center; }
    .col-note { width: 30%; padding-left: 10px !important; }

    .item-name { font-weight: 700; display: block; text-transform: uppercase; word-break: break-word; }
    .warning-badge { font-size: 9px; font-weight: 700; border: 1px solid #000; display: inline-block; padding: 0 3px; border-radius: 2px; margin-top: 2px; }
    .cell-amount { text-align: right; font-weight: 700; font-size: 13px; }
    .cell-unit { text-align: center; font-weight: 700; font-size: 10px; padding-top: 2px !important; }
    .cell-note { font-style: italic; color: #444; padding-left: 10px !important; }

    /* Composite Sub-table */
    .composite-row td { padding: 4px 0 4px 15px !important; border-bottom: none !important; }
    .sub-table-container { border-left: 3px solid #94a3b8; padding-left: 8px; margin: 2px 0; }
    .sub-table { width: 100%; font-size: 10px; border-collapse: collapse; }
    .sub-table td { padding: 2px 0; border: none; }
    .sub-name { width: 45%; color: #333; }
    .sub-amount { width: 15%; text-align: right; font-family: monospace; font-weight: 700; }
    .sub-unit { width: 10%; text-align: center; font-size: 9px; }
    .sub-note { width: 30%; padding-left: 10px; font-style: italic; color: #666; font-size: 9px; }

    /* Footer */
    .footer-section { margin-top: auto; padding-top: 8px; border-top: 2px solid #000; }
    .footer-table { width: 100%; border-collapse: collapse; }
    .footer-left { vertical-align: top; padding-right: 15px; padding-top: 4px; }
    .footer-right { vertical-align: bottom; width: 140px; padding-top: 2px; }

    .disclaimer { font-size: 10px; font-style: italic; color: #444; line-height: 1.2; }
    
    .signature-box { display: flex; flex-direction: column; align-items: center; width: 100%; }
    .sig-title { font-size: 10px; font-weight: 700; text-transform: uppercase; margin-bottom: 30px; text-align: center; }
    .sig-line { height: 1px; width: 100%; background-color: #000; }
    .sig-note { font-size: 9px; font-style: italic; color: #555; margin-top: 2px; text-align: center; }

    /* Cut Line */
    .cut-line { position: absolute; bottom: -8px; left: -5px; z-index: 10; background: white; padding: 0 2px; transform: rotate(90deg); font-size: 12px; }

    /* PRINT MEDIA QUERY - THE MOST IMPORTANT PART */
    @media print {
        @page { size: A4 portrait; margin: 0; }
        
        body, html { margin: 0; padding: 0; background-color: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        
        /* Hide everything else */
        app-root > *:not(app-print-layout) { display: none !important; }
        
        .print-root { background-color: white; padding: 0; min-height: auto; }
        .print-page { margin: 0; box-shadow: none; page-break-after: always; border: none; }
        .print-page:last-child { page-break-after: auto; }
        
        .inputs-bar { border: none; padding: 0; background-color: transparent; }
        .input-value { border-bottom-color: #000; }
        .warning-badge { border-color: #000; }
        
        /* Ensure pure black text */
        * { color: #000 !important; }
        .divider, .input-label, .performer-label { color: #000 !important; }
    }
  `]
})
export class PrintLayoutComponent implements OnInit, AfterViewInit {
  printService = inject(PrintService);
  state = inject(StateService); 
  router = inject(Router);
  
  formatDate = formatDate;
  formatNum = formatNum;
  cleanName = cleanName;

  isStandalone = signal(false);
  localJobs = signal<PrintJob[]>([]);
  isLoading = signal(true);
  footerText = signal('Cam kết sử dụng đúng mục đích.');

  groupedJobs = computed(() => {
    // Prefer local jobs if standalone, otherwise Service jobs (for preview)
    const jobs = this.isStandalone() ? this.localJobs() : this.printService.jobs();
    const groups: PrintJob[][] = [];
    const itemsPerPage = 2; 
    
    for (let i = 0; i < jobs.length; i += itemsPerPage) {
      groups.push(jobs.slice(i, i + itemsPerPage));
    }
    return groups;
  });

  constructor() {
    effect(() => {
        const conf = this.state.printConfig();
        if (conf && conf.footerText) this.footerText.set(conf.footerText);
    });
  }

  ngOnInit() {
      // Check if we are in the standalone print route
      if (this.router.url.includes('print-job')) {
          this.isStandalone.set(true);
          
          // 1. Load Data from LocalStorage
          const storedData = localStorage.getItem('lims_print_queue');
          if (storedData) {
              try {
                  const jobs = JSON.parse(storedData);
                  this.localJobs.set(jobs);
                  // Clean up to prevent stale data later
                  localStorage.removeItem('lims_print_queue');
              } catch (e) {
                  console.error("Failed to parse print job", e);
              }
          }

          // 2. Load Config from LS or Default (Since we are offline/detached, we rely on passed data or defaults)
          // Ideally, pass config in LS too. For now, hardcode or fetch if possible.
          // Note: StateService might re-init in new window, fetching from Firebase if online.
          // Let's rely on StateService's effect to update footerText if online.
          // Effect in constructor handles updates.
      } else {
          // Preview Mode
          this.isLoading.set(false);
          // Effect in constructor handles initial value if available.
      }
  }

  ngAfterViewInit() {
      if (this.isStandalone()) {
          // Wait for rendering then print
          this.isLoading.set(false);
          setTimeout(() => {
              window.print();
              // Optional: Close after print
              // window.close(); 
          }, 800); // 800ms delay to ensure fonts/layout settle
      }
  }

  stdUnit(unit: string): string {
      if (!unit) return '';
      const u = unit.toLowerCase().trim();
      if (u === 'gram' || u === 'grams') return 'g';
      if (u === 'milliliter' || u === 'milliliters' || u === 'ml') return 'mL';
      if (u === 'microliter' || u === 'ul' || u === 'µl') return 'µL';
      if (u === 'pcs' || u === 'piece') return 'cái';
      return unit;
  }

  getDisplayDate(job: PrintJob): string {
      if (job.analysisDate) {
          const parts = job.analysisDate.split('-');
          if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      // Handle both Date object and string ISO
      const d = new Date(job.date);
      const day = d.getDate().toString().padStart(2, '0');
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
  }
}
