
import { Component, inject, signal, computed, effect, ElementRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '../../core/services/state.service';
import { AuthService } from '../../core/services/auth.service';
import { InventoryService } from '../../features/inventory/inventory.service';
import { formatDate, formatNum, cleanName, getAvatarUrl } from '../../shared/utils/utils';
import { Log } from '../../core/models/log.model';
import { DateRangeFilterComponent } from '../../shared/components/date-range-filter/date-range-filter.component';
import { ExportModalComponent } from '../../shared/components/export-modal/export-modal.component';
import Chart from 'chart.js/auto'; // STANDARD IMPORT

interface NxtReportItem {
  id: string;
  name: string;
  unit: string;
  category: string;
  startStock: number;
  importQty: number;
  exportQty: number;
  endStock: number;
}

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, FormsModule, DateRangeFilterComponent, ExportModalComponent],
  templateUrl: './statistics.component.html'
})
export class StatisticsComponent {
  state = inject(StateService);
  auth = inject(AuthService); 
  invService = inject(InventoryService);
  formatDate = formatDate;
  formatNum = formatNum;
  cleanName = cleanName;
  getAvatarUrl = getAvatarUrl;
  
  getLogActionText(action: string): string {
      if (action === 'SAVE_RESULT_DRAFT') return 'Lưu nháp kết quả';
      if (action === 'PUBLISH_RESULT_REPORT') return 'Xuất bản báo cáo';
      if (action === 'REVERT_RESULT_DRAFT') return 'Hủy xuất bản báo cáo';
      if (action === 'RESET_RESULT_DATA') return 'Reset số liệu mẻ';
      if (action === 'RESTORE_RESULT_BACKUP') return 'Khôi phục từ bản backup';
      if (action === 'RESTORE_RESULT_VERSION') return 'Rollback phiên bản cũ';
      if (action === 'DIRECT_APPROVE') return 'Duyệt trực tiếp SOP';

      if (action === 'REQUEST_STANDARD' || action === 'CREATE_STANDARD_REQUEST') return 'Yêu cầu mượn chuẩn';
      if (action === 'APPROVE_STANDARD_REQUEST') return 'Duyệt mượn chuẩn';
      if (action === 'REJECT_STANDARD_REQUEST') return 'Từ chối mượn chuẩn';
      if (action === 'REPORT_RETURN_STANDARD') return 'Báo cáo trả chuẩn';
      if (action === 'RETURN_STANDARD') return 'Nhận lại chuẩn';
      if (action === 'ASSIGN_STANDARD') return 'Gán chuẩn cho mượn';
      
      if (action.includes('APPROVE')) return 'Duyệt yêu cầu'; 
      if (action.includes('STOCK_IN')) return 'Nhập kho';
      if (action.includes('STOCK_OUT')) return 'Xuất kho'; 
      if (action.includes('CREATE')) return 'Tạo mới';
      if (action.includes('DELETE')) return 'Xóa'; 
      return 'Cập nhật';
  }

  activeTab = signal<'logs' | 'consumption' | 'sops' | 'nxt' | 'standards'>('logs');
  
  startDate = signal<string>(this.getFirstDayOfMonth());
  endDate = signal<string>(this.getToday());
  selectedSopId = signal<string>('all'); 

  barChartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('barChartCanvas');
  pieChartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('pieChartCanvas');
  lineChartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('lineChartCanvas');
  private barChart: any = null;
  private pieChart: any = null;
  private lineChart: any = null;

  isLoading = signal(false);
  hasGenerated = signal(false);
  nxtData = signal<NxtReportItem[]>([]);

  showGlobalExportModal = signal(false);
  exportInventory = signal(true);
  exportConsumption = signal(true);
  exportSop = signal(true);
  exportLogs = signal(false);
  exportStandards = signal(false);
  exportPerSop = signal(false);
  showConsumptionOptions = signal(true);
  isExporting = signal(false);
  activePreset = signal<string | null>(null);
  exportProgress = signal<{nxt: string, consumption: string, sop: string, logs: string, standards: string, cover: string}>({
    nxt: 'pending', consumption: 'pending', sop: 'pending', logs: 'pending', standards: 'pending', cover: 'pending'
  });

  toggleConsumption() {
      if (this.exportConsumption()) {
          // If already on and options showing, toggle off
          if (this.showConsumptionOptions()) {
              this.exportConsumption.set(false);
              this.showConsumptionOptions.set(true);
          } else {
              this.showConsumptionOptions.set(true);
          }
      } else {
          this.exportConsumption.set(true);
          this.showConsumptionOptions.set(true);
      }
      this.activePreset.set(null);
  }

  getSelectedSheetsCount(): number {
      let count = 0;
      if (this.exportInventory()) count++;
      if (this.exportConsumption()) count++;
      if (this.exportSop()) count++;
      if (this.exportLogs()) count++;
      if (this.exportStandards()) count++;
      count++; // Cover sheet always included
      return count;
  }

  applyPreset(preset: string) {
      this.activePreset.set(preset);
      switch(preset) {
          case 'monthly':
              this.exportInventory.set(true);
              this.exportConsumption.set(true);
              this.exportSop.set(true);
              this.exportLogs.set(false);
              this.exportStandards.set(false);
              this.exportPerSop.set(false);
              this.exportType.set('summary');
              this.excludeMargin.set(false);
              break;
          case 'detailed':
              this.exportInventory.set(true);
              this.exportConsumption.set(true);
              this.exportSop.set(true);
              this.exportLogs.set(true);
              this.exportStandards.set(true);
              this.exportPerSop.set(false);
              this.exportType.set('daily');
              this.excludeMargin.set(false);
              break;
          case 'accounting':
              this.exportInventory.set(false);
              this.exportConsumption.set(true);
              this.exportSop.set(false);
              this.exportLogs.set(false);
              this.exportStandards.set(false);
              this.exportPerSop.set(false);
              this.exportType.set('summary');
              this.excludeMargin.set(true);
              break;
          case 'all':
              this.exportInventory.set(true);
              this.exportConsumption.set(true);
              this.exportSop.set(true);
              this.exportLogs.set(true);
              this.exportStandards.set(true);
              this.exportPerSop.set(true);
              this.exportType.set('daily');
              this.excludeMargin.set(false);
              break;
      }
  }

  openGlobalExport() {
      this.isExporting.set(false);
      this.exportProgress.set({ nxt: 'pending', consumption: 'pending', sop: 'pending', logs: 'pending', standards: 'pending', cover: 'pending' });
      this.showGlobalExportModal.set(true);
  }

  // --- Professional Excel Formatting Helper ---
  private formatSheet(ws: any, XLSX: any, headerRowIndex: number, dataLength: number, colWidths: number[]) {
      // Set column widths
      ws['!cols'] = colWidths.map(w => ({ wch: w }));
      // Set row heights for header area
      ws['!rows'] = [];
      for (let i = 0; i < headerRowIndex; i++) {
          ws['!rows'].push({ hpx: i === 0 ? 28 : 18 });
      }
      // Merge title cell across columns
      if (!ws['!merges']) ws['!merges'] = [];
      const maxCol = colWidths.length - 1;
      ws['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: Math.min(maxCol, 5) } });
  }

  async runGlobalExport() {
      this.isExporting.set(true);
      this.exportProgress.set({ nxt: 'pending', consumption: 'pending', sop: 'pending', logs: 'pending', standards: 'pending', cover: 'pending' });
      
      // Small delay to let Angular render the initial exporting state
      await new Promise(r => setTimeout(r, 100));
      
      try {
          const XLSX = await import('xlsx');
          const wb = XLSX.utils.book_new();
          const start = this.startDate();
          const end = this.endDate();
          const currentUser = this.auth.currentUser();
          const sopId = this.selectedSopId();
          
          const exportInfo = [
            ["BÁO CÁO TỔNG HỢP HỆ THỐNG LIMS"],
            [`Thời gian: ${start} đến ${end}`],
            [`Người xuất: ${currentUser?.displayName || currentUser?.email || 'Admin'}`],
            [`Ngày xuất: ${new Date().toLocaleString('vi-VN')}`],
            [`SOP: ${sopId === 'all' ? 'Tất cả quy trình' : this.getSelectedSopName()}`],
            []
          ];

          const sheetsAdded: string[] = [];

          // ===== 1. NXT =====
          if (this.exportInventory()) {
              this.exportProgress.update(p => ({ ...p, nxt: 'working' }));
              await new Promise(r => setTimeout(r, 50));
              
              await this.generateNxtReport();
              const nxtRows = this.nxtData();
              
              if (sopId === 'all') {
                  const data = nxtRows.map((row: any, index: number) => ({
                    'STT': index + 1, 'Mã ID': row.id, 'Tên Hàng': row.name, 'ĐVT': row.unit, 'Phân Loại': row.category,
                    'Tồn Đầu': row.startStock, 'Nhập Trong Kỳ': row.importQty, 'Xuất Trong Kỳ': row.exportQty, 'Tồn Cuối': row.endStock
                  }));
                  const ws = XLSX.utils.json_to_sheet([]);
                  XLSX.utils.sheet_add_aoa(ws, [...exportInfo, ["BÁO CÁO NHẬP - XUẤT - TỒN (KHO)"]], { origin: "A1" });
                  XLSX.utils.sheet_add_json(ws, data, { origin: "A8", skipHeader: false });
                  this.formatSheet(ws, XLSX, 8, data.length, [6, 20, 35, 10, 18, 14, 14, 14, 14]);
                  XLSX.utils.book_append_sheet(wb, ws, "NXT");
                  sheetsAdded.push("NXT");
              } else {
                  const data = nxtRows.map((row: any, index: number) => ({
                    'STT': index + 1, 'Mã ID': row.id, 'Tên Hàng': row.name, 'ĐVT': row.unit,
                    'Tổng Lượng Xuất': row.exportQty
                  }));
                  const ws = XLSX.utils.json_to_sheet([]);
                  XLSX.utils.sheet_add_aoa(ws, [...exportInfo, [`CHI TIẾT XUẤT KHO - ${this.getSelectedSopName()}`]], { origin: "A1" });
                  XLSX.utils.sheet_add_json(ws, data, { origin: "A8", skipHeader: false });
                  this.formatSheet(ws, XLSX, 8, data.length, [6, 20, 35, 10, 16]);
                  XLSX.utils.book_append_sheet(wb, ws, "Xuất SOP");
                  sheetsAdded.push("Xuất SOP");
              }
              this.exportProgress.update(p => ({ ...p, nxt: 'done' }));
              await new Promise(r => setTimeout(r, 200));
          }

          // ===== 2. CONSUMPTION (Full logic from exportConsumptionExcel) =====
          if (this.exportConsumption()) {
              this.exportProgress.update(p => ({ ...p, consumption: 'working' }));
              await new Promise(r => setTimeout(r, 50));
              
              const history = this.state.approvedRequests();
              const startD = new Date(start); startD.setHours(0,0,0,0);
              const endD = new Date(end); endD.setHours(23,59,59,999);
              const type = this.exportType();
              const specDay = this.specificDay();
              const useBaseAmount = this.excludeMargin();
              const safetyConfig = this.state.safetyConfig();
              const inventoryMap = new Map(this.state.inventory().map((i: any) => [i.name, i]));

              const getCalculatedItemAmount = (item: any, reqMargin: number) => {
                  if (!useBaseAmount) return item.amount;
                  if (item.baseAmount !== undefined) return item.baseAmount;
                  if (reqMargin > 0) {
                      return item.amount / (1 + reqMargin / 100);
                  } else if (reqMargin < 0) {
                      const invItem: any = inventoryMap.get(item.name);
                      let appliedMargin = 10;
                      if (safetyConfig && invItem && invItem.category && safetyConfig.rules[invItem.category] !== undefined) {
                          appliedMargin = safetyConfig.rules[invItem.category];
                      } else if (safetyConfig && safetyConfig.defaultMargin !== undefined) {
                          appliedMargin = safetyConfig.defaultMargin;
                      }
                      return item.amount / (1 + appliedMargin / 100);
                  }
                  return item.amount;
              };

              // Filter requests
              const filteredHistory = history.filter((req: any) => {
                  let d: Date;
                  if (req.analysisDate) {
                      const parts = req.analysisDate.split('-');
                      d = new Date(parseInt(parts[0]), parseInt(parts[1])-1, parseInt(parts[2]));
                  } else {
                      const ts = req.approvedAt || req.timestamp;
                      d = (ts && typeof ts.toDate === 'function') ? ts.toDate() : new Date(ts);
                  }
                  if (d < startD || d > endD) return false;
                  if (sopId !== 'all' && req.sopId !== sopId) return false;
                  if (type === 'specific_day' && d.getDate() !== specDay) return false;
                  return true;
              });

              // Build consumption data based on type
              if (type === 'summary' || type === 'specific_day') {
                  const map = new Map<string, {amount: number, unit: string, displayName: string}>();
                  filteredHistory.forEach((req: any) => {
                      const reqMargin: number = req.margin !== undefined ? req.margin : (req.inputs?.safetyMargin !== undefined ? req.inputs.safetyMargin : -1);
                      req.items.forEach((item: any) => {
                          const itemAmount = getCalculatedItemAmount(item, reqMargin);
                          const current = map.get(item.name) || { amount: 0, unit: item.stockUnit || item.unit, displayName: item.displayName || item.name };
                          map.set(item.name, { amount: current.amount + itemAmount, unit: current.unit, displayName: item.displayName || current.displayName || item.name });
                      });
                  });
                  const sortedData = Array.from(map.entries())
                      .map(([id, val]) => ({ name: id, displayName: val.displayName, amount: val.amount, unit: val.unit }))
                      .sort((a,b) => b.amount - a.amount);
                  const data = sortedData.map((row, i) => ({
                      'STT': i + 1, 'Mã Hóa chất/Vật tư': row.name, 'Tên Hóa chất/Vật tư': row.displayName,
                      'Tổng Tiêu Hao': parseFloat(row.amount.toFixed(3)), 'ĐVT': row.unit
                  }));
                  const sheetTitle = type === 'specific_day' ? `TIÊU HAO - LỌC NGÀY ${specDay}` : "DỮ LIỆU TIÊU HAO HÓA CHẤT (TỔNG HỢP)";
                  const ws = XLSX.utils.json_to_sheet([]);
                  XLSX.utils.sheet_add_aoa(ws, [...exportInfo, [sheetTitle]], { origin: "A1" });
                  XLSX.utils.sheet_add_json(ws, data, { origin: "A8", skipHeader: false });
                  this.formatSheet(ws, XLSX, 8, data.length, [6, 22, 35, 16, 10]);
                  XLSX.utils.book_append_sheet(wb, ws, type === 'specific_day' ? `Ngay_${specDay}` : "TieuHao_TongHop");
                  sheetsAdded.push("Tiêu hao");

              } else if (type === 'daily' || type === 'monthly') {
                  const pivotMap = new Map<string, { displayName: string, unit: string, totals: Record<string, number>, grandTotal: number }>();
                  const columnsSet = new Set<string>();

                  filteredHistory.forEach((req: any) => {
                      let d: Date;
                      if (req.analysisDate) {
                          const parts = req.analysisDate.split('-');
                          d = new Date(parseInt(parts[0]), parseInt(parts[1])-1, parseInt(parts[2]));
                      } else {
                          const ts = req.approvedAt || req.timestamp;
                          d = (ts && typeof ts.toDate === 'function') ? ts.toDate() : new Date(ts);
                      }
                      let colKey = '';
                      if (type === 'daily') {
                          colKey = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
                      } else {
                          colKey = `T${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
                      }
                      columnsSet.add(colKey);
                      const reqMargin: number = req.margin !== undefined ? req.margin : (req.inputs?.safetyMargin !== undefined ? req.inputs.safetyMargin : -1);
                      req.items.forEach((item: any) => {
                          const itemAmount = getCalculatedItemAmount(item, reqMargin);
                          if (!pivotMap.has(item.name)) {
                              pivotMap.set(item.name, { displayName: item.displayName || item.name, unit: item.stockUnit || item.unit, totals: {}, grandTotal: 0 });
                          }
                          const record = pivotMap.get(item.name)!;
                          record.totals[colKey] = (record.totals[colKey] || 0) + itemAmount;
                          record.grandTotal += itemAmount;
                      });
                  });

                  const sortedColumns = Array.from(columnsSet).sort((a, b) => {
                      if (type === 'daily') {
                          const [d1, m1] = a.split('/'); const [d2, m2] = b.split('/');
                          if (m1 !== m2) return parseInt(m1) - parseInt(m2);
                          return parseInt(d1) - parseInt(d2);
                      } else {
                          const [m1, y1] = a.replace('T', '').split('/'); const [m2, y2] = b.replace('T', '').split('/');
                          if (y1 !== y2) return parseInt(y1) - parseInt(y2);
                          return parseInt(m1) - parseInt(m2);
                      }
                  });

                  const sortedRows = Array.from(pivotMap.entries()).sort((a, b) => b[1].grandTotal - a[1].grandTotal);
                  const data = sortedRows.map(([id, val], i) => {
                      const rowObj: any = { 'STT': i + 1, 'Mã': id, 'Tên': val.displayName, 'ĐVT': val.unit, 'Tổng Cộng': parseFloat(val.grandTotal.toFixed(3)) };
                      sortedColumns.forEach(col => { rowObj[col] = parseFloat((val.totals[col] || 0).toFixed(3)); });
                      return rowObj;
                  });

                  const sheetName = type === 'daily' ? 'TheoNgay' : 'TheoThang';
                  const ws = XLSX.utils.json_to_sheet([]);
                  const title = type === 'daily' ? "TIÊU HAO PHÂN BỔ THEO NGÀY" : "TIÊU HAO PHÂN BỔ THEO THÁNG";
                  XLSX.utils.sheet_add_aoa(ws, [...exportInfo, [title]], { origin: "A1" });
                  XLSX.utils.sheet_add_json(ws, data, { origin: "A8", skipHeader: false });
                  const colWidths = [6, 18, 30, 8, 14, ...sortedColumns.map(() => 12)];
                  this.formatSheet(ws, XLSX, 8, data.length, colWidths);
                  XLSX.utils.book_append_sheet(wb, ws, sheetName);
                  sheetsAdded.push(sheetName);
              }

              // Per-SOP breakdown sheets
              if (this.exportPerSop() && sopId === 'all') {
                  const sopMap = new Map<string, { sopName: string, items: Map<string, {amount: number, unit: string, displayName: string}> }>();
                  filteredHistory.forEach((req: any) => {
                      const sName = req.sopName || req.sopId || 'Unknown';
                      if (!sopMap.has(sName)) sopMap.set(sName, { sopName: sName, items: new Map() });
                      const sopEntry = sopMap.get(sName)!;
                      const reqMargin: number = req.margin !== undefined ? req.margin : (req.inputs?.safetyMargin !== undefined ? req.inputs.safetyMargin : -1);
                      req.items.forEach((item: any) => {
                          const itemAmount = getCalculatedItemAmount(item, reqMargin);
                          const cur = sopEntry.items.get(item.name) || { amount: 0, unit: item.stockUnit || item.unit, displayName: item.displayName || item.name };
                          sopEntry.items.set(item.name, { amount: cur.amount + itemAmount, unit: cur.unit, displayName: item.displayName || cur.displayName });
                      });
                  });

                  sopMap.forEach((sopData, sopName) => {
                      const sorted = Array.from(sopData.items.entries())
                          .map(([id, val]) => ({ name: id, ...val }))
                          .sort((a, b) => b.amount - a.amount);
                      const data = sorted.map((r, i) => ({
                          'STT': i + 1, 'Mã': r.name, 'Tên': r.displayName, 'Lượng dùng': parseFloat(r.amount.toFixed(3)), 'ĐVT': r.unit
                      }));
                      if (data.length > 0) {
                          const ws = XLSX.utils.json_to_sheet([]);
                          XLSX.utils.sheet_add_aoa(ws, [...exportInfo, [`TIÊU HAO - ${sopName}`]], { origin: "A1" });
                          XLSX.utils.sheet_add_json(ws, data, { origin: "A8", skipHeader: false });
                          this.formatSheet(ws, XLSX, 8, data.length, [6, 22, 35, 14, 10]);
                          // Sanitize sheet name (max 31 chars, no special chars)
                          const safeName = sopName.replace(/[\\\/\?\*\[\]]/g, '').substring(0, 28);
                          XLSX.utils.book_append_sheet(wb, ws, `SOP_${safeName}`);
                          sheetsAdded.push(`SOP_${safeName}`);
                      }
                  });
              }

              this.exportProgress.update(p => ({ ...p, consumption: 'done' }));
              await new Promise(r => setTimeout(r, 200));
          }

          // ===== 3. SOP Frequency =====
          if (this.exportSop()) {
              this.exportProgress.update(p => ({ ...p, sop: 'working' }));
              await new Promise(r => setTimeout(r, 50));
              
              const sops = this.sopFrequencyData();
              const sopRows = sops.map((d: any, index: number) => ({
                'STT': index + 1, 'Quy trình (SOP)': d.name, 'Số lần chạy': d.count, 'Tổng Mẫu': d.samples, 'Tổng QC': d.qcs, 'Tỷ trọng (%)': formatNum(d.percent)
              }));
              const ws = XLSX.utils.json_to_sheet([]);
              XLSX.utils.sheet_add_aoa(ws, [...exportInfo, ["BÁO CÁO TẦN SUẤT QUY TRÌNH (SOP)"]], { origin: "A1" });
              XLSX.utils.sheet_add_json(ws, sopRows, { origin: "A8", skipHeader: false });
              this.formatSheet(ws, XLSX, 8, sopRows.length, [6, 35, 14, 12, 12, 14]);
              XLSX.utils.book_append_sheet(wb, ws, "SOP Frequency");
              sheetsAdded.push("SOP Frequency");
              
              this.exportProgress.update(p => ({ ...p, sop: 'done' }));
              await new Promise(r => setTimeout(r, 200));
          }

          // ===== 4. Audit Logs =====
          if (this.exportLogs()) {
              this.exportProgress.update(p => ({ ...p, logs: 'working' }));
              await new Promise(r => setTimeout(r, 50));
              
              const logs = this.filteredLogs();
              const logRows = logs.map((l: any, index: number) => ({
                'STT': index + 1, 'Thời gian': formatDate(l.timestamp), 'Hoạt động': this.getLogActionText(l.action), 'Chi tiết': l.details, 'Người thực hiện': l.user
              }));
              const ws = XLSX.utils.json_to_sheet([]);
              XLSX.utils.sheet_add_aoa(ws, [...exportInfo, ["NHẬT KÝ HOẠT ĐỘNG CHI TIẾT"]], { origin: "A1" });
              XLSX.utils.sheet_add_json(ws, logRows, { origin: "A8", skipHeader: false });
              this.formatSheet(ws, XLSX, 8, logRows.length, [6, 22, 20, 50, 20]);
              XLSX.utils.book_append_sheet(wb, ws, "Audit Logs");
              sheetsAdded.push("Audit Logs");
              
              this.exportProgress.update(p => ({ ...p, logs: 'done' }));
              await new Promise(r => setTimeout(r, 200));
          }

          // ===== 5. Standards Health =====
          if (this.exportStandards()) {
              this.exportProgress.update(p => ({ ...p, standards: 'working' }));
              await new Promise(r => setTimeout(r, 50));
              
              const ws = XLSX.utils.json_to_sheet([]);
              XLSX.utils.sheet_add_aoa(ws, [...exportInfo, ["SỨC KHỎE & TRUY XUẤT CHUẨN ĐỐI CHIẾU"]], { origin: "A1" });
              
              // Section A: Summary
              const stats = this.healthStats();
              XLSX.utils.sheet_add_aoa(ws, [
                  ["TỔNG QUAN"],
                  ["Đang mượn / Sử dụng:", stats.borrowing],
                  ["Chuẩn hết hạn:", stats.expired],
                  ["Tồn kho thấp:", stats.lowStock],
                  []
              ], { origin: "A8" });

              // Section C: All borrowed
              const borrowed = this.state.allStandardRequests().filter((r: any) => r.status === 'IN_PROGRESS');
              if (borrowed.length > 0) {
                  const startRow = 15;
                  XLSX.utils.sheet_add_aoa(ws, [["DANH SÁCH ĐANG MƯỢN"]], { origin: `A${startRow}` });
                  const borrowedData = borrowed.map((r: any, i: number) => ({
                      'STT': i + 1, 'Người mượn': r.requestedByName, 'Tên chuẩn': r.standardName,
                      'LOT': r.lotNumber, 'Ngày mượn': r.requestDate ? new Date(r.requestDate).toLocaleDateString('vi-VN') : ''
                  }));
                  XLSX.utils.sheet_add_json(ws, borrowedData, { origin: `A${startRow + 1}`, skipHeader: false });
              }

              this.formatSheet(ws, XLSX, 8, 20, [6, 22, 30, 18, 16, 16]);
              XLSX.utils.book_append_sheet(wb, ws, "Standards");
              sheetsAdded.push("Standards");
              
              this.exportProgress.update(p => ({ ...p, standards: 'done' }));
              await new Promise(r => setTimeout(r, 200));
          }

          // ===== COVER SHEET (Always first) =====
          {
              const coverWs = XLSX.utils.aoa_to_sheet([]);
              const approvedCount = this.state.approvedRequests().filter((req: any) => {
                  let d: Date;
                  if (req.analysisDate) {
                      const parts = req.analysisDate.split('-');
                      d = new Date(parseInt(parts[0]), parseInt(parts[1])-1, parseInt(parts[2]));
                  } else {
                      const ts = req.approvedAt || req.timestamp;
                      d = (ts && typeof ts.toDate === 'function') ? ts.toDate() : new Date(ts);
                  }
                  const s = new Date(start); s.setHours(0,0,0,0);
                  const e = new Date(end); e.setHours(23,59,59,999);
                  return d >= s && d <= e;
              }).length;

              const topSop = this.sopFrequencyData()[0];
              const stats = this.healthStats();

              XLSX.utils.sheet_add_aoa(coverWs, [
                  ["BÁO CÁO TỔNG HỢP HỆ THỐNG LIMS"],
                  [],
                  ["Đơn vị:", "Phòng thí nghiệm"],
                  ["Khoảng thời gian:", `${start}  đến  ${end}`],
                  ["SOP:", sopId === 'all' ? 'Tất cả quy trình' : this.getSelectedSopName()],
                  ["Người xuất báo cáo:", currentUser?.displayName || currentUser?.email || 'Admin'],
                  ["Ngày giờ xuất:", new Date().toLocaleString('vi-VN')],
                  [],
                  ["═══════════════════════════════════════════"],
                  ["CHỈ SỐ TỔNG QUAN (KPIs)"],
                  ["═══════════════════════════════════════════"],
                  [],
                  ["Tổng phiếu đã duyệt:", approvedCount],
                  ["Tổng mặt hàng tiêu hao:", this.consumptionData().length],
                  ["SOP chạy nhiều nhất:", topSop ? `${topSop.name} (${topSop.count} lần)` : 'N/A'],
                  ["Chuẩn đang mượn:", stats.borrowing],
                  ["Chuẩn hết hạn:", stats.expired],
                  [],
                  ["═══════════════════════════════════════════"],
                  ["MỤC LỤC SHEETS"],
                  ["═══════════════════════════════════════════"],
                  [],
                  ...sheetsAdded.map((name, i) => [`${i + 1}. ${name}`])
              ], { origin: "A1" });

              this.formatSheet(coverWs, XLSX, 1, 25, [28, 40]);
              // Insert cover as first sheet
              XLSX.utils.book_append_sheet(wb, coverWs, "Trang Bìa");
              // Move cover to first position
              const sheetNames = wb.SheetNames;
              const coverIdx = sheetNames.indexOf("Trang Bìa");
              if (coverIdx > 0) {
                  sheetNames.splice(coverIdx, 1);
                  sheetNames.unshift("Trang Bìa");
              }
          }

          this.exportProgress.update(p => ({ ...p, cover: 'done' }));
          await new Promise(r => setTimeout(r, 300));

          XLSX.writeFile(wb, `BaoCao_TongHop_${start}_den_${end}.xlsx`);
          this.isExporting.set(false);

      } catch (e) {
          console.error(e);
          this.isExporting.set(false);
          alert('Đã xảy ra lỗi trong quá trình cấu trúc Báo cáo Excel. Vui lòng F5 và kiểm tra Logs.');
      }
  }

  // Handle native input event for specific day
  onSpecificDayChange(event: Event) {
      const val = parseInt((event.target as HTMLInputElement).value, 10);
      if (!isNaN(val)) this.specificDay.set(val);
  }


  healthStats = computed(() => {
    const reqs = this.state.allStandardRequests();
    const stds = this.state.standards();
    const now = Date.now();
    return {
        borrowing: reqs.filter(r => r.status === 'IN_PROGRESS').length,

        expired: stds.filter((s: any) => s.expiry_date && new Date(s.expiry_date).getTime() < now).length,
        lowStock: stds.filter((s: any) => (s.current_amount ?? 0) < 5).length
    };
  });



  criticalLogs = computed(() => {
    return this.state.logs().filter(l => 
        l.action.includes('DELETE') || 
        l.action.includes('HARD_DELETE') || 
        l.action.includes('REJECT') || 
        l.action.includes('REVOKE')
    ).slice(0, 20);
  });

  getLogActionIcon(action: string): string {
    if (action === 'SAVE_RESULT_DRAFT') return 'fa-solid fa-floppy-disk text-cyan-500';
    if (action === 'PUBLISH_RESULT_REPORT') return 'fa-solid fa-file-pdf text-emerald-500';
    if (action === 'REVERT_RESULT_DRAFT') return 'fa-solid fa-unlock text-amber-500';
    if (action === 'RESET_RESULT_DATA') return 'fa-solid fa-trash-arrow-up text-red-500';
    if (action === 'RESTORE_RESULT_BACKUP' || action === 'RESTORE_RESULT_VERSION') return 'fa-solid fa-clock-rotate-left text-violet-500';

    if (action.includes('DELETE')) return 'fa-solid fa-trash-can text-red-500';
    if (action.includes('REJECT')) return 'fa-solid fa-circle-xmark text-rose-500';
    if (action.includes('REVOKE')) return 'fa-solid fa-hand-holding-hand text-amber-500';
    return 'fa-solid fa-bolt text-indigo-500';
  }

  exportType = signal<'summary' | 'daily' | 'monthly' | 'specific_day'>('summary');
  specificDay = signal<number>(1);
  excludeMargin = signal<boolean>(false);

  constructor() {
    // Load on-demand (listeners removed for Spark Free optimization)
    this.state.loadAllStandardRequests();
    this.state.loadReferenceStandards(); // populates state.standards() for healthStats & pie chart

    effect(() => {
        const active = this.activeTab();
        const consData = this.consumptionData();
        const inv = this.state.inventory();

        if (active === 'consumption') {
            setTimeout(() => {
                this.createConsumptionBarChart();
                this.createCategoryPieChart();
                this.createConsumptionLineChart();
            }, 100);
        }
    });
  }

  // --- Actions ---
  onDateRangeChange(range: { start: string, end: string, label: string }) {
      this.startDate.set(range.start);
      this.endDate.set(range.end);
      this.hasGenerated.set(false); // Force recalculation if date changes
  }

  private toLocalDateStr(d: Date): string {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
  }
  private getToday(): string { return this.toLocalDateStr(new Date()); }
  private getFirstDayOfMonth(): string { const d = new Date(); return this.toLocalDateStr(new Date(d.getFullYear(), d.getMonth(), 1)); }
  
  getUnitClass(unit: string): string { return (unit.includes('ml') || unit.includes('l')) ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-600 border-slate-200'; }

  getSelectedSopName(): string {
      const id = this.selectedSopId();
      if (id === 'all') return 'Tất cả';
      const sop = this.state.sops().find(s => s.id === id);
      return sop ? sop.name : id;
  }

  // --- NXT / EXPORT DETAIL REPORT LOGIC ---
  async generateNxtReport() {
      this.isLoading.set(true);
      this.nxtData.set([]);
      
      // Snapshot all filter values at the start to avoid race conditions
      // if the user changes a filter while the async operation is running.
      const startRaw = this.startDate();
      const endRaw = this.endDate();
      const sopId = this.selectedSopId();

      // Use local timezone perfectly without shifting 
      const start = new Date(startRaw + 'T00:00:00');
      const end = new Date(endRaw + 'T23:59:59.999');
      const startTime = start.getTime();
      const endTime = end.getTime();
      
      try {
          const inventory = await this.invService.getAllInventory();

          // Bug Fix: Fetch logs from 'start' up to 'today' (not just 'end') so we can
          // correctly calculate futureNetChange (movements AFTER the period end).
          // We need logs beyond 'end' to subtract from current stock to get end-of-period stock.
          const maxNow = new Date(); maxNow.setHours(23,59,59,999);
          const logs = await this.invService.getLogsByDateRange(start, maxNow);
          
          if (sopId === 'all') {
              const movements = new Map<string, { inPeriodImport: number, inPeriodExport: number, futureNetChange: number }>();
              inventory.forEach(item => movements.set(item.id, { inPeriodImport: 0, inPeriodExport: 0, futureNetChange: 0 }));

              logs.forEach(log => {
                  const logTime = (log.timestamp as any).toDate ? (log.timestamp as any).toDate().getTime() : new Date(log.timestamp).getTime();
                  
                  const result: { id: string, delta: number }[] = [];
                  const targetId = log.targetId;

                  if (log.action.includes('STOCK')) {
                      const match = log.details.match(/:\s*([+-]?\d+(?:\.\d+)?)/);
                      if (match && targetId) { result.push({ id: targetId, delta: parseFloat(match[1]) }); }
                  }
                  else if (log.action === 'CREATE_ITEM') {
                      const match = log.details.match(/\(([-+]?\d+(?:\.\d+)?)/);
                      if (match && targetId) { result.push({ id: targetId, delta: parseFloat(match[1]) }); }
                  }
                  else if (log.action === 'UPDATE_INFO') {
                      const match = log.details.match(/Tồn kho:\s*([-+]?\d+(?:\.\d+)?)\s*->\s*([-+]?\d+(?:\.\d+)?)/);
                      if (match && targetId) { 
                          const oldStock = parseFloat(match[1]);
                          const newStock = parseFloat(match[2]);
                          result.push({ id: targetId, delta: newStock - oldStock }); 
                      }
                  }
                  else if (log.action === 'DELETE_ITEM' || log.action === 'HARD_DELETE_STANDARD_REQUEST') {
                      // finalStock can be used for absolute accuracy when available
                      if (log.finalStock !== undefined && targetId) {
                          // Stock was reduced to zero by deletion; handled via stock delta if logged
                      }
                  }
                  else if (log.action.includes('APPROVE') && log.printData?.items) {
                      log.printData.items.forEach(item => {
                          if (item.isComposite && item.breakdown) {
                              item.breakdown.forEach(sub => result.push({ id: sub.name, delta: -(sub.totalNeed || 0) }));
                          } else {
                              result.push({ id: item.name, delta: -(item.stockNeed || 0) });
                          }
                      });
                  }

                  result.forEach(change => {
                      if (!movements.has(change.id)) movements.set(change.id, { inPeriodImport: 0, inPeriodExport: 0, futureNetChange: 0 });
                      const entry = movements.get(change.id)!;
                      
                      if (logTime > endTime) {
                          // Movements AFTER the period: used to back-calculate end-of-period stock
                          entry.futureNetChange += change.delta;
                      } else {
                          // Movements WITHIN the period (start <= logTime <= end)
                          if (change.delta > 0) entry.inPeriodImport += change.delta;
                          else entry.inPeriodExport += Math.abs(change.delta);
                      }
                  });
              });

              const report: NxtReportItem[] = [];
              const allIds = new Set([...inventory.map(i => i.id), ...movements.keys()]);
              
              allIds.forEach(id => {
                  const item = inventory.find(i => i.id === id);
                  const m = movements.get(id) || { inPeriodImport: 0, inPeriodExport: 0, futureNetChange: 0 };
                  
                  const currentStock = item ? item.stock : 0;
                  const endStock = currentStock - m.futureNetChange;
                  const startStock = endStock - m.inPeriodImport + m.inPeriodExport;

                  if (startStock !== 0 || m.inPeriodImport !== 0 || m.inPeriodExport !== 0 || endStock !== 0 || item) {
                      report.push({
                          id: id,
                          name: item?.name || id,
                          unit: item?.unit || '?',
                          category: item?.category || 'Unknown',
                          startStock: parseFloat(startStock.toFixed(3)),
                          importQty: parseFloat(m.inPeriodImport.toFixed(3)),
                          exportQty: parseFloat(m.inPeriodExport.toFixed(3)),
                          endStock: parseFloat(endStock.toFixed(3))
                      });
                  }
              });
              this.nxtData.set(report.sort((a,b) => a.name.localeCompare(b.name)));

          } else {
              // --- SOP-specific export detail mode ---
              const consumptionMap = new Map<string, number>();
              logs.forEach(log => {
                  const logTime = (log.timestamp as any).toDate ? (log.timestamp as any).toDate().getTime() : new Date(log.timestamp).getTime();
                  
                  // Bug Fix: filter by BOTH start and end date (was only checking <= end)
                  if (logTime >= startTime && logTime <= endTime) {
                      if (log.action.includes('APPROVE') && log.printData?.sop?.id === sopId && log.printData?.items) {
                          log.printData.items.forEach(item => {
                              if (item.isComposite && item.breakdown) {
                                  item.breakdown.forEach(sub => {
                                      const cur = consumptionMap.get(sub.name) || 0;
                                      consumptionMap.set(sub.name, cur + (sub.totalNeed || 0));
                                  });
                              } else {
                                  const cur = consumptionMap.get(item.name) || 0;
                                  consumptionMap.set(item.name, cur + (item.stockNeed || 0));
                              }
                          });
                      }
                  }
              });

              const report: NxtReportItem[] = [];
              consumptionMap.forEach((qty, id) => {
                  const item = inventory.find(i => i.id === id);
                  report.push({
                      id: id,
                      name: item?.name || id,
                      unit: item?.unit || '?',
                      category: item?.category || 'Unknown',
                      startStock: 0, 
                      importQty: 0, 
                      exportQty: parseFloat(qty.toFixed(3)),
                      endStock: 0 
                  });
              });
              this.nxtData.set(report.sort((a,b) => a.name.localeCompare(b.name)));
          }

          this.hasGenerated.set(true);

      } catch (e) { console.error(e); } finally { this.isLoading.set(false); }
  }


  filteredLogs = computed(() => {
      const start = new Date(this.startDate()); start.setHours(0,0,0,0);
      const end = new Date(this.endDate()); end.setHours(23,59,59,999);
      const sopId = this.selectedSopId();

      return this.state.logs().filter(log => {
          const d = (log.timestamp as any).toDate ? (log.timestamp as any).toDate() : new Date(log.timestamp);
          const inDate = d >= start && d <= end;
          if (!inDate) return false;
          if (sopId === 'all') return true;
          return log.printData?.sop?.id === sopId || (log as any).sopId === sopId;
      });
  });

  filteredStandardRequests = computed(() => {
      const start = new Date(this.startDate()); start.setHours(0,0,0,0);
      const end = new Date(this.endDate()); end.setHours(23,59,59,999);

      return this.state.allStandardRequests().filter(req => {
          const d = new Date(req.requestDate);
          return d >= start && d <= end;
      });
  });

  consumptionData = computed(() => {
    const history = this.state.approvedRequests();
    const map = new Map<string, {amount: number, unit: string, displayName: string}>();
    
    const start = new Date(this.startDate()); start.setHours(0,0,0,0);
    const end = new Date(this.endDate()); end.setHours(23,59,59,999);
    const sopId = this.selectedSopId();

    history.forEach(req => {
        let d: Date;
        if (req.analysisDate) {
            const parts = req.analysisDate.split('-');
            d = new Date(parseInt(parts[0]), parseInt(parts[1])-1, parseInt(parts[2]));
        } else {
            const ts = req.approvedAt || req.timestamp;
            d = (ts && typeof ts.toDate === 'function') ? ts.toDate() : new Date(ts);
        }

        if (d < start || d > end) return;
        if (sopId !== 'all' && req.sopId !== sopId) return;

        req.items.forEach(item => {
            const current = map.get(item.name) || { amount: 0, unit: item.stockUnit || item.unit, displayName: item.displayName || item.name };
            map.set(item.name, { 
                amount: current.amount + item.amount, 
                unit: current.unit,
                displayName: item.displayName || current.displayName || item.name
            });
        });
    });

    return Array.from(map.entries())
        .map(([id, val]) => ({ name: id, displayName: val.displayName, amount: val.amount, unit: val.unit }))
        .sort((a,b) => b.amount - a.amount);
  });

  sopFrequencyData = computed(() => {
    const history = this.state.approvedRequests();
    
    const start = new Date(this.startDate()); start.setHours(0,0,0,0);
    const end = new Date(this.endDate()); end.setHours(23,59,59,999);
    const sopId = this.selectedSopId();

    const filteredHistory = history.filter(req => {
        let d: Date;
        if (req.analysisDate) {
            const parts = req.analysisDate.split('-');
            d = new Date(parseInt(parts[0]), parseInt(parts[1])-1, parseInt(parts[2]));
        } else {
            const ts = req.approvedAt || req.timestamp;
            d = (ts && typeof ts.toDate === 'function') ? ts.toDate() : new Date(ts);
        }

        if (d < start || d > end) return false;
        if (sopId !== 'all' && req.sopId !== sopId) return false;
        return true;
    });

    const total = filteredHistory.length;
    if (total === 0) return [];

    const map = new Map<string, {count: number, samples: number, qcs: number}>();
    filteredHistory.forEach(req => {
        const current = map.get(req.sopName) || { count: 0, samples: 0, qcs: 0 };
        let s = 0; let q = 0;
        if (req.inputs) {
            if(req.inputs['n_sample']) s = Number(req.inputs['n_sample']);
            if(req.inputs['n_qc']) q = Number(req.inputs['n_qc']);
        }
        map.set(req.sopName, { count: current.count + 1, samples: current.samples + s, qcs: current.qcs + q });
    });

    return Array.from(map.entries())
        .map(([name, val]) => ({ name, count: val.count, samples: val.samples, qcs: val.qcs, percent: (val.count/total)*100 }))
        .sort((a,b) => b.count - a.count);
  });

  async createConsumptionBarChart() {
      const canvas = this.barChartCanvas()?.nativeElement;
      if (!canvas) return;
      if (this.barChart) this.barChart.destroy();
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const data = this.consumptionData().slice(0, 15);
      this.barChart = new Chart(ctx, {
          type: 'bar',
          data: {
              labels: data.map(d => d.displayName || d.name),
              datasets: [{ 
                  label: 'Lượng dùng', 
                  data: data.map(d => d.amount), 
                  backgroundColor: 'rgba(79, 70, 229, 0.6)', 
                  borderColor: 'rgba(79, 70, 229, 1)', 
                  borderWidth: 2,
                  borderRadius: 8
              }]
          },
          options: { 
              indexAxis: 'y',
              responsive: true, 
              maintainAspectRatio: false, 
              plugins: { 
                  legend: { display: false },
                  tooltip: {
                      callbacks: {
                          label: (context: any) => `Lượng dùng: ${formatNum(context.raw)}`
                      }
                  }
              },
              layout: { padding: { left: 40, right: 20 } },
              scales: { 
                  x: { grid: { display: false }, beginAtZero: true }, 
                  y: { 
                      grid: { display: false },
                      ticks: {
                          callback: function(value: any) {
                              const label = this.getLabelForValue(value);
                              return (label && label.length > 30) ? label.substring(0, 27) + '...' : label;
                          },
                          font: { size: 10, weight: 'bold' }
                      }
                  } 
              } 
          }
      });
  }

  async createCategoryPieChart() {
      const canvas = this.pieChartCanvas()?.nativeElement;
      if (!canvas) return;
      if (this.pieChart) this.pieChart.destroy();
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const data = this.consumptionData();
      const catMap = new Map<string, number>();
      
      // Build lookup maps by both ID and name for robust matching
      // consumptionData uses item.name which is the Firestore document ID (item ID)
      const invByIdMap = new Map(this.state.inventory().map(i => [i.id, i.category]));
      const invByNameMap = new Map(this.state.inventory().map(i => [i.name, i.category]));
      const stdByIdMap = new Map(this.state.standards().map((s: any) => [s.id, 'Chuẩn đối chiếu']));
      const stdByNameMap = new Map(this.state.standards().map((s: any) => [s.name, 'Chuẩn đối chiếu']));
      
      data.forEach(d => {
          // Priority: lookup by ID first (most reliable), then by display name as fallback
          let cat = invByIdMap.get(d.name) 
                 || invByNameMap.get(d.displayName) 
                 || stdByIdMap.get(d.name) 
                 || stdByNameMap.get(d.displayName) 
                 || 'Chưa phân loại';
          if (this.state.categoriesMap().has(cat)) {
              cat = this.state.categoriesMap().get(cat)!;
          }
          catMap.set(cat, (catMap.get(cat) || 0) + 1);
      });

      this.pieChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
              labels: Array.from(catMap.keys()),
              datasets: [{
                  data: Array.from(catMap.values()),
                  backgroundColor: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'],
                  borderWidth: 0
              }]
          },
          options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10, weight: 'bold' } } } },
              cutout: '70%'
          }
      });
  }

  async createConsumptionLineChart() {
      const canvas = this.lineChartCanvas()?.nativeElement;
      if (!canvas) return;
      if (this.lineChart) this.lineChart.destroy();
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Group consumption by date for trend
      const history = this.state.approvedRequests();
      const trendMap = new Map<string, number>();
      const start = new Date(this.startDate());
      const end = new Date(this.endDate());

      history.forEach(req => {
          const ts = req.approvedAt || req.timestamp;
          const d = (ts && typeof ts.toDate === 'function') ? ts.toDate() : new Date(ts);
          if (d >= start && d <= end) {
              const key = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
              let dayTotal = 0;
              req.items.forEach(i => dayTotal += i.amount);
              trendMap.set(key, (trendMap.get(key) || 0) + dayTotal);
          }
      });

      const sortedKeys = Array.from(trendMap.keys()).sort((a,b) => {
          const [d1, m1] = a.split('/'); const [d2, m2] = b.split('/');
          return new Date(2025, parseInt(m1)-1, parseInt(d1)).getTime() - new Date(2025, parseInt(m2)-1, parseInt(d2)).getTime();
      });

      this.lineChart = new Chart(ctx, {
          type: 'line',
          data: {
              labels: sortedKeys,
              datasets: [{
                  label: 'Tổng lượng dùng',
                  data: sortedKeys.map(k => trendMap.get(k)),
                  borderColor: '#4F46E5',
                  backgroundColor: 'rgba(79, 70, 229, 0.1)',
                  fill: true,
                  tension: 0.4,
                  pointRadius: 4,
                  pointBackgroundColor: '#4F46E5',
                  borderWidth: 3
              }]
          },
          options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: { 
                y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
                x: { grid: { display: false } }
              }
          }
      });
  }
}
