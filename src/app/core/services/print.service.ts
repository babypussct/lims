
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
              
              // 2.1 HEADER (Category | Date | Title | QR)
              if (options.showHeader) {
                  // Targets Badge Logic
                  const selectedIds = job.inputs['targetIds'] || [];
                  const allTargets = job.sop?.targets || [];
                  const targetNames = selectedIds.map((id: string) => {
                      const t = allTargets.find((x:any) => x.id === id);
                      return t ? t.name : id;
                  }).join(', ');

                  // Display Date
                  let displayDate = '';
                  if (job.analysisDate) {
                      const parts = job.analysisDate.split('-');
                      if (parts.length === 3) displayDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
                  } else {
                      const d = new Date(job.date);
                      displayDate = `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()}`;
                  }

                  const headerTable = {
                      table: {
                          widths: ['*', 'auto'],
                          body: [
                              [
                                  {
                                      stack: [
                                          {
                                              text: [
                                                  { text: (job.sop?.category || 'SOP').toUpperCase(), bold: true, fontSize: 8, background: '#f0f0f0' },
                                                  { text: ' | Ref: ' + (job.sop?.ref || 'N/A') + ' | Ngày: ' + displayDate, fontSize: 8, color: '#555555' }
                                              ],
                                              margin: [0, 0, 0, 2]
                                          },
                                          { text: (job.sop?.name || 'PHIẾU PHA CHẾ').toUpperCase(), fontSize: 13, bold: true, margin: [0, 0, 0, 2] },
                                          targetNames ? { text: 'Chỉ tiêu: ' + targetNames, fontSize: 8, italics: true, color: '#444444' } : {}
                                      ]
                                  },
                                  {
                                      stack: [
                                          { qr: job.requestId || 'LIMS', fit: 60, alignment: 'right' },
                                          { text: job.requestId || '', fontSize: 7, font: 'Roboto', alignment: 'right', margin: [0, 2, 0, 0] }
                                      ]
                                  }
                              ]
                          ]
                      },
                      layout: 'noBorders',
                      margin: [0, 0, 0, 5]
                  };
                  content.push(headerTable);
                  content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1.5 }] });
              }

              // 2.2 INPUTS
              const inputTexts = [];
              if (job.sop?.inputs) {
                  job.sop.inputs.forEach((inp: any) => {
                      if (inp.type !== 'checkbox' || job.inputs[inp.var]) {
                          let val = job.inputs[inp.var];
                          // Label Mapping for Select
                          if (inp.type === 'select' && inp.options) {
                              const found = inp.options.find((o:any) => o.value == val);
                              if (found) val = found.label;
                          }
                          if (inp.type === 'checkbox') val = '(Yes)';
                          inputTexts.push({ text: `${inp.label}: ${val}`, fontSize: 9, bold: true, margin: [0, 2, 10, 2] });
                      }
                  });
              }
              // Margin info
              const marginVal = job.margin || job.inputs['safetyMargin'] || 0;
              inputTexts.push({ text: `Hao hụt: +${formatNum(marginVal)}%`, fontSize: 9, bold: true, color: '#d97706', margin: [0, 2, 0, 2] });

              content.push({
                  columns: inputTexts,
                  columnGap: 10,
                  margin: [0, 5, 0, 5]
              });

              // Sample List
              if (job.inputs['sampleList'] && job.inputs['sampleList'].length > 0) {
                  content.push({
                      text: [
                          { text: `Danh sách mẫu (${job.inputs['sampleList'].length}): `, bold: true, fontSize: 8 },
                          { text: formatSampleList(job.inputs['sampleList']), fontSize: 8, font: 'Roboto' } // Font Roboto for mono-like look
                      ],
                      margin: [0, 0, 0, 5],
                      background: '#f9fafb',
                      padding: 2
                  });
              }

              // 2.3 DATA TABLE
              const tableBody = [];
              // Header
              tableBody.push([
                  { text: 'Hóa chất / Vật tư', style: 'tableHeader' },
                  { text: 'Lượng', style: 'tableHeader', alignment: 'right' },
                  { text: 'ĐV', style: 'tableHeader', alignment: 'center' },
                  { text: 'Ghi chú', style: 'tableHeader', alignment: 'right' }
              ]);

              // Rows
              job.items.forEach(item => {
                  // Std Unit Helper
                  const u = (unit: string) => {
                      const l = unit.toLowerCase();
                      if (l === 'ml' || l === 'milliliter') return 'mL';
                      if (l === 'ul' || l === 'microliter') return 'µL';
                      return unit;
                  };

                  tableBody.push([
                      { text: item.displayName || item.name, style: 'tableCell', bold: true },
                      { text: formatNum(item.totalQty), style: 'tableCell', alignment: 'right', bold: true },
                      { text: u(item.unit), style: 'tableCell', alignment: 'center', fontSize: 8 },
                      { text: item.base_note || '', style: 'tableCell', alignment: 'right', italics: true }
                  ]);

                  if (item.isComposite) {
                      item.breakdown.forEach(sub => {
                          tableBody.push([
                              { text: `• ${sub.displayName || sub.name}`, style: 'subTableCell', margin: [10, 0, 0, 0], color: '#555555' },
                              { text: formatNum(sub.displayAmount), style: 'subTableCell', alignment: 'right', color: '#555555' },
                              { text: u(sub.unit), style: 'subTableCell', alignment: 'center', color: '#555555' },
                              { text: '', style: 'subTableCell' }
                          ]);
                      });
                  }
              });

              content.push({
                  table: {
                      headerRows: 1,
                      widths: ['*', 'auto', 30, 'auto'], // Dynamic widths
                      body: tableBody
                  },
                  layout: {
                      hLineWidth: (i:number, node:any) => (i === 0 || i === node.table.body.length) ? 1 : 0.5,
                      vLineWidth: () => 0,
                      hLineColor: () => '#e5e7eb',
                      paddingTop: () => 4,
                      paddingBottom: () => 4
                  },
                  margin: [0, 5, 0, 10]
              });

              // 2.4 FOOTER
              if (options.showFooter) {
                  const now = new Date();
                  const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2,'0')} ${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()}`;
                  
                  const footerCols: any[] = [
                      {
                          stack: [
                              { text: footerText, italics: true, fontSize: 8, color: '#555555' },
                              { text: `In lúc: ${timeStr} | Máy: ${job.user || 'Unknown'}`, fontSize: 7, color: '#888888', margin: [0, 2, 0, 0] }
                          ]
                      }
                  ];

                  if (options.showSignature) {
                      footerCols.push({
                          stack: [
                              { text: 'XÁC NHẬN ĐIỆN TỬ', fontSize: 7, bold: true, alignment: 'right', color: '#666666' },
                              { text: (job.user || '').toUpperCase(), fontSize: 8, bold: true, alignment: 'right' }
                          ],
                          alignment: 'right'
                      });
                  }

                  content.push({
                      canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5 }]
                  });
                  content.push({
                      columns: footerCols,
                      margin: [0, 5, 0, 0]
                  });
              }

              // 2.5 CUT LINE (If first of pair and not last page overall context, but here pairs logic handles page breaks)
              if (jobIdx === 0 && pair.length > 1 && options.showCutLine) {
                  content.push({
                      canvas: [{ type: 'line', x1: 0, y1: 20, x2: 515, y2: 20, dash: { length: 5, space: 5 }, lineColor: '#9ca3af' }],
                      margin: [0, 20, 0, 20]
                  });
              }
          });

          // Page Break after each pair (except last)
          if (pageIdx < pairs.length - 1) {
              content.push({ text: '', pageBreak: 'after' });
          }
      });

      return {
          pageSize: 'A4',
          pageMargins: [30, 30, 30, 30], // 30 units ~ 10mm
          content: content,
          defaultStyle: {
              font: 'Roboto', // Default font
              fontSize: 10
          },
          styles: {
              tableHeader: { fontSize: 8, bold: true, color: 'black', fillColor: '#f3f4f6' },
              tableCell: { fontSize: 9 },
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
