
import { Injectable, inject, signal } from '@angular/core';
import { CalculatorService } from './calculator.service';
import { CalculatedItem } from '../models/sop.model';
import { ToastService } from './toast.service';
import { StateService } from './state.service';
import { formatNum, formatSampleList } from '../../shared/utils/utils';

// FIX: Use default imports to allow property assignment
// This works because esModuleInterop is true in tsconfig.json
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

// Register fonts
// We need to cast to 'any' because the types might not perfectly match the internal structure of the build artifacts
if ((pdfFonts as any).pdfMake && (pdfFonts as any).pdfMake.vfs) {
    (pdfMake as any).vfs = (pdfFonts as any).pdfMake.vfs;
} else {
    // Fallback for some versions/environments
    (pdfMake as any).vfs = (pdfFonts as any).vfs || {};
    console.warn('PDF Fonts loaded with fallback method.');
}

export interface PrintJob {
  sop: any; 
  inputs: any;
  margin: number;
  items: CalculatedItem[];
  date: Date | string; 
  user?: string; 
  analysisDate?: string;
  requestId?: string; 
}

export interface PrintOptions {
    showHeader: boolean;
    showFooter: boolean;
    showSignature: boolean;
    showCutLine: boolean;
}

@Injectable({ providedIn: 'root' })
export class PrintService {
  private calc = inject(CalculatorService);
  private toast = inject(ToastService);
  private state = inject(StateService);
  
  // Loading state
  isProcessing = signal<boolean>(false);

  // PREVIEW STATE (Used by Modal)
  isPreviewOpen = signal<boolean>(false);
  previewJobs = signal<PrintJob[]>([]);
  
  // Default Options
  defaultOptions: PrintOptions = {
      showHeader: true,
      showFooter: true,
      showSignature: true,
      showCutLine: true
  };

  // --- 1. ENTRY POINT: OPEN PREVIEW ---
  openPreview(jobs: PrintJob[]) {
      if (!jobs || jobs.length === 0) {
          this.toast.show('Không có dữ liệu để in.', 'error');
          return;
      }
      this.previewJobs.set(jobs);
      this.isPreviewOpen.set(true);
  }

  closePreview() {
      this.isPreviewOpen.set(false);
      this.previewJobs.set([]);
  }

  // --- 2. GENERATE DOCUMENT DEFINITION (CORE LOGIC) ---
  private generateDocDefinition(jobs: PrintJob[], options: PrintOptions): any {
      const content: any[] = [];
      const footerText = this.state.printConfig()?.footerText || 'Cam kết sử dụng đúng mục đích. Phiếu được quản lý trên LIMS Cloud.';

      // Group jobs into pairs (2 slips per A4 page)
      const pairs = [];
      for (let i = 0; i < jobs.length; i += 2) {
          pairs.push(jobs.slice(i, i + 2));
      }

      pairs.forEach((pair, pageIdx) => {
          pair.forEach((job, jobIdx) => {
              
              // 2.1 HEADER (Re-designed using Columns for Flexbox-like look)
              if (options.showHeader) {
                  // Targets
                  const selectedIds = job.inputs['targetIds'] || [];
                  const allTargets = job.sop?.targets || [];
                  const targetNames = selectedIds.map((id: string) => {
                      const t = allTargets.find((x:any) => x.id === id);
                      return t ? t.name : id;
                  });

                  // Display Date
                  let displayDate = '';
                  if (job.analysisDate) {
                      const parts = job.analysisDate.split('-');
                      if (parts.length === 3) displayDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
                  } else {
                      const d = new Date(job.date);
                      displayDate = `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()}`;
                  }

                  // HEADER COLUMNS
                  content.push({
                      columns: [
                          // LEFT: Info
                          {
                              width: '*',
                              stack: [
                                  // Category Badge & Ref (Simulate badge with background)
                                  {
                                      text: [
                                          { text: ' ' + (job.sop?.category || 'SOP').toUpperCase() + ' ', bold: true, fontSize: 8, background: '#e0e7ff', color: '#3730a3' }, // Indigo-100/700
                                          { text: ' ' }, // Spacer
                                          { text: 'Ref: ' + (job.sop?.ref || 'N/A'), fontSize: 8, color: '#6b7280' },
                                          { text: ' | ' },
                                          { text: 'Ngày: ' + displayDate, fontSize: 8, color: '#6b7280' }
                                      ],
                                      margin: [0, 0, 0, 4]
                                  },
                                  // Title
                                  { text: (job.sop?.name || 'PHIẾU PHA CHẾ').toUpperCase(), fontSize: 13, bold: true, margin: [0, 0, 0, 4], color: '#111827' },
                                  // Targets
                                  targetNames.length > 0 ? {
                                      text: [
                                          { text: 'Chỉ tiêu: ', fontSize: 8, bold: true, color: '#374151' },
                                          { text: targetNames.join(', '), fontSize: 8, color: '#4b5563' }
                                      ]
                                  } : {}
                              ]
                          },
                          // RIGHT: QR & ID
                          {
                              width: 'auto',
                              stack: [
                                  { qr: job.requestId || 'LIMS', fit: 65, alignment: 'right' },
                                  { text: job.requestId || '', fontSize: 7, font: 'Roboto', alignment: 'right', margin: [0, 2, 0, 0], bold: true, color: '#374151' }
                              ]
                          }
                      ],
                      columnGap: 10,
                      margin: [0, 0, 0, 10]
                  });
                  
                  // Divider (Black line like Preview)
                  content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1.5, lineColor: '#000000' }] });
              }

              // 2.2 INPUTS (Horizontal Layout)
              const inputTexts = [];
              if (job.sop?.inputs) {
                  job.sop.inputs.forEach((inp: any) => {
                      if (inp.type !== 'checkbox' || job.inputs[inp.var]) {
                          let val = job.inputs[inp.var];
                          if (inp.type === 'select' && inp.options) {
                              const found = inp.options.find((o:any) => o.value == val);
                              if (found) val = found.label;
                          }
                          if (inp.type === 'checkbox') val = '(Yes)';
                          inputTexts.push({ text: [{text: inp.label + ': ', color:'#6b7280'}, {text: val + '', color: '#111827'}], fontSize: 9, bold: true, margin: [0, 2, 10, 2] });
                      }
                  });
              }
              // Margin info
              const marginVal = job.margin || job.inputs['safetyMargin'] || 0;
              inputTexts.push({ text: `Hao hụt: +${formatNum(marginVal)}%`, fontSize: 9, bold: true, color: '#d97706', margin: [0, 2, 0, 2] });

              content.push({
                  columns: inputTexts,
                  columnGap: 10,
                  margin: [0, 8, 0, 8]
              });

              // Sample List (Styled Box)
              if (job.inputs['sampleList'] && job.inputs['sampleList'].length > 0) {
                  content.push({
                      stack: [
                          { text: `Danh sách mẫu (${job.inputs['sampleList'].length})`, bold: true, fontSize: 8, color: '#6b7280', margin: [0,0,0,2] },
                          { text: formatSampleList(job.inputs['sampleList']), fontSize: 9, font: 'Roboto', bold: true, color: '#111827' }
                      ],
                      margin: [0, 0, 0, 10],
                      fillColor: '#f9fafb', // Gray-50
                      padding: 5
                  });
              }

              // 2.3 DATA TABLE (Clean UI - No Vertical Borders)
              const tableBody = [];
              // Header
              tableBody.push([
                  { text: 'Hóa chất / Vật tư', style: 'tableHeader', border: [false, false, false, true] },
                  { text: 'Lượng', style: 'tableHeader', alignment: 'right', border: [false, false, false, true] },
                  { text: 'ĐV', style: 'tableHeader', alignment: 'center', border: [false, false, false, true] },
                  { text: 'Ghi chú', style: 'tableHeader', alignment: 'right', border: [false, false, false, true] }
              ]);

              // Rows
              job.items.forEach(item => {
                  const u = (unit: string) => {
                      const l = unit.toLowerCase();
                      if (l === 'ml' || l === 'milliliter') return 'mL';
                      if (l === 'ul' || l === 'microliter') return 'µL';
                      return unit;
                  };

                  tableBody.push([
                      { text: item.displayName || item.name, style: 'tableCell', bold: true, border: [false, false, false, true] },
                      { text: formatNum(item.totalQty), style: 'tableCell', alignment: 'right', bold: true, font: 'Roboto', border: [false, false, false, true] }, // Roboto for monospace-ish numbers
                      { text: u(item.unit), style: 'tableCell', alignment: 'center', fontSize: 8, color: '#4b5563', border: [false, false, false, true] },
                      { text: item.base_note || '', style: 'tableCell', alignment: 'right', italics: true, color: '#6b7280', border: [false, false, false, true] }
                  ]);

                  if (item.isComposite) {
                      item.breakdown.forEach(sub => {
                          tableBody.push([
                              { text: `• ${sub.displayName || sub.name}`, style: 'subTableCell', margin: [10, 0, 0, 0], color: '#4b5563', border: [false, false, false, true] },
                              { text: formatNum(sub.displayAmount), style: 'subTableCell', alignment: 'right', color: '#4b5563', font: 'Roboto', border: [false, false, false, true] },
                              { text: u(sub.unit), style: 'subTableCell', alignment: 'center', color: '#6b7280', border: [false, false, false, true] },
                              { text: '', style: 'subTableCell', border: [false, false, false, true] }
                          ]);
                      });
                  }
              });

              content.push({
                  table: {
                      headerRows: 1,
                      widths: ['*', 50, 30, 'auto'], // Adjusted widths
                      body: tableBody
                  },
                  layout: {
                      hLineWidth: (i:number, node:any) => 0.5,
                      vLineWidth: () => 0, // No vertical lines
                      hLineColor: () => '#e5e7eb', // Slate-200
                      paddingTop: () => 5,
                      paddingBottom: () => 5,
                      fillColor: (rowIndex: number) => (rowIndex === 0) ? '#f8fafc' : null // Slate-50 Header
                  },
                  margin: [0, 5, 0, 10]
              });

              // 2.4 FOOTER
              if (options.showFooter) {
                  const now = new Date();
                  const timeStr = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')} ${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()}`;
                  
                  const footerCols: any[] = [
                      {
                          width: '*',
                          stack: [
                              { text: footerText, italics: true, fontSize: 8, color: '#6b7280' },
                              { text: `In lúc: ${timeStr} | Máy: ${job.user || 'Unknown'}`, fontSize: 7, color: '#9ca3af', margin: [0, 2, 0, 0] }
                          ]
                      }
                  ];

                  if (options.showSignature) {
                      // Digital Signature Box (Simulated with Table)
                      footerCols.push({
                          width: 'auto',
                          table: {
                              body: [[
                                  {
                                      stack: [
                                          { text: '✔ XÁC NHẬN ĐIỆN TỬ', fontSize: 7, bold: true, alignment: 'center', color: '#4b5563' },
                                          { text: (job.user || '').toUpperCase(), fontSize: 8, bold: true, alignment: 'center', margin: [0,2,0,0] }
                                      ]
                                  }
                              ]]
                          },
                          layout: {
                              hLineWidth: () => 0.5,
                              vLineWidth: () => 0.5,
                              hLineColor: () => '#000000',
                              vLineColor: () => '#000000',
                              paddingLeft: () => 8,
                              paddingRight: () => 8,
                              paddingTop: () => 2,
                              paddingBottom: () => 2
                          }
                      });
                  }

                  content.push({
                      canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: '#000000' }]
                  });
                  content.push({
                      columns: footerCols,
                      margin: [0, 8, 0, 0]
                  });
              }

              // 2.5 CUT LINE
              if (jobIdx === 0 && pair.length > 1 && options.showCutLine) {
                  content.push({
                      canvas: [{ type: 'line', x1: 0, y1: 20, x2: 515, y2: 20, dash: { length: 4, space: 4 }, lineColor: '#9ca3af' }],
                      margin: [0, 20, 0, 20]
                  });
              }
          });

          // Page Break
          if (pageIdx < pairs.length - 1) {
              content.push({ text: '', pageBreak: 'after' });
          }
      });

      return {
          pageSize: 'A4',
          pageMargins: [30, 30, 30, 30],
          content: content,
          defaultStyle: {
              font: 'Roboto',
              fontSize: 10
          },
          styles: {
              tableHeader: { fontSize: 8, bold: true, color: '#1f2937' },
              tableCell: { fontSize: 9, color: '#111827' },
              subTableCell: { fontSize: 8 }
          }
      };
  }

  // --- 3. EXECUTE PRINT ---
  async printDocument(jobs: PrintJob[], options: PrintOptions = this.defaultOptions) {
    this.isProcessing.set(true);
    try {
        const dd = this.generateDocDefinition(jobs, options);
        pdfMake.createPdf(dd).print();
    } catch (e) {
        console.error("Print Error:", e);
        this.toast.show('Lỗi tạo lệnh in.', 'error');
    } finally {
        this.isProcessing.set(false);
    }
  }

  // --- 4. EXECUTE DOWNLOAD ---
  async downloadPdf(jobs: PrintJob[], options: PrintOptions = this.defaultOptions) {
      if (!jobs || jobs.length === 0) return;
      this.isProcessing.set(true);
      
      try {
          const dd = this.generateDocDefinition(jobs, options);
          const fileName = `LIMS_Phieu_${new Date().toISOString().slice(0,10)}.pdf`;
          pdfMake.createPdf(dd).download(fileName);
          this.toast.show('Đã tải PDF thành công!', 'success');
      } catch (e: any) {
          console.error("PDF Generation Error:", e);
          this.toast.show('Lỗi tạo PDF: ' + e.message, 'error');
      } finally {
          this.isProcessing.set(false);
      }
  }
}
