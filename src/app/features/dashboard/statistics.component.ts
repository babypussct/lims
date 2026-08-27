import { ChangeDetectionStrategy, Component, inject, signal, computed, effect, ElementRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '../../core/services/state.service';
import { AuthService } from '../../core/services/auth.service';
import { StatsService, MonthlyStatsDoc } from '../../core/services/stats.service';
import { InventoryService } from '../../features/inventory/inventory.service';
import { formatDate, formatNum, cleanName, getAvatarUrl } from '../../shared/utils/utils';
import { Log } from '../../core/models/log.model';
import { DateRangeFilterComponent } from '../../shared/components/date-range-filter/date-range-filter.component';
import { ExportModalComponent } from '../../shared/components/export-modal/export-modal.component';
import { AppButtonComponent, AppPageHeaderComponent, AppToolbarComponent } from '../../shared/components/ui';
import { timestampToDate, timestampToMillis } from '../../shared/utils/timestamp';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { AuditLogService } from '../../core/services/audit-log.service';
import type { InventoryItem } from '../../core/models/inventory.model';
import { getActivityAuditActionLabel } from '../../core/activity/activity-feed.utils';
import { getActivityActionDefinition, isRegisteredActivityAction } from '../../core/activity/activity-event-registry';
import { toLocalDateKey, type InclusiveDateRange } from '../../shared/utils/date-range';
import {
  aggregateReportConsumption,
  aggregateNxtMovements,
  aggregateSopFrequency,
  buildReportSopOptions,
  enrichReportLogsWithPrintData,
  findUnresolvedLegacyNxtApprovalLogs,
  filterReportRequests,
  getReportRequestDate,
  getMonthKeysForStatisticsRange,
  matchesReportSop,
  needsLegacyNxtPrintData,
  recoverLegacyNxtApprovalLogsFromRequests,
  resolveStatisticsDateRange,
  type ReportSopOption
} from './statistics-report.utils';

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

interface ReportSnapshot {
  range: InclusiveDateRange;
  inventory: InventoryItem[];
  approvedRequests: ReturnType<StateService['approvedRequests']>;
  businessLogs: Log[];
  monthlyStats: Record<string, MonthlyStatsDoc>;
  referenceStandards: ReturnType<StateService['standards']>;
  standardRequests: ReturnType<StateService['allStandardRequests']>;
  sopOptions: ReportSopOption[];
  complete: boolean;
  warnings: string[];
}

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DateRangeFilterComponent,
    ExportModalComponent,
    AppButtonComponent,
    AppPageHeaderComponent,
    AppToolbarComponent,
  ],
  templateUrl: './statistics.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatisticsComponent {
  state = inject(StateService);
  auth = inject(AuthService); 
  invService = inject(InventoryService);
  statsService = inject(StatsService);
  toast = inject(ToastService);
  confirmation = inject(ConfirmationService);
  audit = inject(AuditLogService);
  formatDate = formatDate;
  formatNum = formatNum;
  cleanName = cleanName;
  getAvatarUrl = getAvatarUrl;
  
  getLogActionText(action: string): string {
      if (isRegisteredActivityAction(action)) return getActivityAuditActionLabel(action);
      return action || 'Cập nhật';
  }

  getLogActionClass(action: string): string {
      if (!isRegisteredActivityAction(action)) {
          return 'bg-slate-50 dark:bg-slate-900/20 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-800';
      }
      const definition = getActivityActionDefinition(action);
      if (definition.importance === 'WARNING') {
          return 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
      }
      if (definition.importance === 'IMPORTANT') {
          return 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      }
      if (definition.module === 'INVENTORY') {
          return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      }
      if (definition.module === 'STANDARD') {
          return 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800';
      }
      if (definition.module === 'SYSTEM') {
          return 'bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800';
      }
      return 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800';
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
  private chartLoader?: Promise<any>;

  isLoading = signal(false);
  hasGenerated = signal(false);
  nxtData = signal<NxtReportItem[]>([]);
  statsData = signal<Record<string, MonthlyStatsDoc>>({});
  reportLogs = signal<Log[]>([]);
  reportInventory = signal<InventoryItem[]>([]);
  private allTimeStatsReady = signal(false);
  private allTimeStatsLoad?: Promise<void>;
  private reportInventoryReady = signal(false);
  private reportInventoryLoad?: Promise<void>;
  private reportStatsReady = signal(false);
  private referenceStandardsReady = signal(false);
  private standardRequestsReady = signal(false);
  private approvedHistoryReady = signal(false);
  private reportLogsReady = signal(false);
  private reportStatsLoadGeneration = 0;
  private reportLogsLoadGeneration = 0;
  private approvedHistoryLoadGeneration = 0;
  private nxtReportGeneration = 0;
  private reportDatasetErrors = signal<Record<string, string>>({});

  reportWarnings = computed(() => {
    const errors = this.reportDatasetErrors();
    const warnings = Object.values(errors);
    const pending = new Set<string>();

    // Stats + approved history underpin the common SOP selector and several
    // report surfaces, so expose their pending state across all report tabs.
    if (!this.reportStatsReady()) pending.add('Thống kê tháng');
    if (!this.approvedHistoryReady()) pending.add('Lịch sử phiếu đã duyệt');

    const active = this.activeTab();
    if (active === 'logs' && !this.reportLogsReady()) pending.add('Nhật ký nghiệp vụ');
    if (active === 'consumption') {
      if (!this.reportInventoryReady()) pending.add('Kho Báo Cáo');
      if (!this.referenceStandardsReady()) pending.add('Chuẩn đối chiếu');
    }
    if (active === 'standards') {
      if (!this.referenceStandardsReady()) pending.add('Chuẩn đối chiếu');
      if (!this.standardRequestsReady()) pending.add('Lịch sử mượn chuẩn');
      if (!this.reportLogsReady()) pending.add('Nhật ký nghiệp vụ');
    }

    for (const dataset of pending) {
      if (!errors[dataset]) warnings.push(`${dataset}: đang tải dữ liệu đầy đủ...`);
    }
    return warnings;
  });

  reportSopOptions = computed(() => this.buildReportSopOptionsForRange(this.getActiveDateRange()));

  reportSnapshot = computed<ReportSnapshot>(() => this.buildReportSnapshot(this.getActiveDateRange()));

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
          await this.ensureAllTimeStatsLoaded();
          const activeRange = this.getActiveDateRange();
          const start = toLocalDateKey(activeRange.start);
          const end = toLocalDateKey(activeRange.end);
          const reportStart = new Date(activeRange.start);
          const reportEnd = new Date(activeRange.end);
          const currentUser = this.auth.currentUser();
          const sopId = this.selectedSopId();
          const exportInventory = this.exportInventory();
          const exportConsumption = this.exportConsumption();
          const exportSop = this.exportSop();
          const exportLogs = this.exportLogs();
          const exportStandards = this.exportStandards();
          const exportPerSop = this.exportPerSop();
          const exportType = this.exportType();
          const specificDay = this.specificDay();
          const excludeMargin = this.excludeMargin();

          const missingStatsMonths = getMonthKeysForStatisticsRange(activeRange)
              .filter(key => !Object.prototype.hasOwnProperty.call(this.statsData(), key));
          const approvedLoad = this.state.loadApprovedRequestsForDateRange(start, end)
              .then(result => {
                  this.approvedHistoryReady.set(result.complete);
                  this.setReportDatasetError(
                      'Lịch sử phiếu đã duyệt',
                      result.complete ? null : new Error('Không thể xác nhận dữ liệu đã tải đầy đủ.')
                  );
                  return result;
              })
              .catch(error => {
                  this.approvedHistoryReady.set(false);
                  this.setReportDatasetError('Lịch sử phiếu đã duyệt', error);
                  throw error;
              });
          const statsLoad = missingStatsMonths.length > 0
              ? this.statsService.getStatsForMonths(missingStatsMonths).then(result => {
                  this.statsData.update(prev => ({ ...prev, ...result }));
                  this.reportStatsReady.set(true);
                  this.setReportDatasetError('Thống kê tháng', null);
              }).catch(error => {
                  this.reportStatsReady.set(false);
                  this.setReportDatasetError('Thống kê tháng', error);
                  throw error;
              })
              : Promise.resolve().then(() => {
                  this.reportStatsReady.set(true);
                  this.setReportDatasetError('Thống kê tháng', null);
              });
          const inventoryLoad = exportInventory || exportConsumption
              ? this.ensureReportInventoryLoaded()
              : Promise.resolve();
          // N-X-T has an additional completeness dependency: it must read
          // BUSINESS movements through today (not only through reportEnd) and
          // resolve every legacy approval print snapshot used for stock
          // reconstruction. Complete this work before creating the workbook so
          // a missing historical snapshot can never yield a plausible partial
          // Excel file.
          const nxtLoad = exportInventory
              ? this.generateNxtReport(true, { range: activeRange, sopId })
              : Promise.resolve<NxtReportItem[]>([]);
          // Trang bìa luôn hiển thị KPI sức khỏe chuẩn, nên đây là dependency
          // bắt buộc của mọi export, không phụ thuộc checkbox sheet Standards.
          const coverStandardsLoad = this.ensureExportCoverStandardsLoaded();
          const reportLogsLoad = exportLogs || exportStandards
              ? this.fetchReportLogs(reportStart, reportEnd)
                  .then(logs => {
                      this.reportLogs.set(logs);
                      this.reportLogsReady.set(true);
                      this.setReportDatasetError('Nhật ký nghiệp vụ', null);
                  })
                  .catch(error => {
                      this.reportLogs.set([]);
                      this.reportLogsReady.set(false);
                      this.setReportDatasetError('Nhật ký nghiệp vụ', error);
                      throw error;
                  })
              : Promise.resolve();
          const [approvedLoadResult, , , exportNxtRows] = await Promise.all([
              approvedLoad,
              statsLoad,
              inventoryLoad,
              nxtLoad,
              coverStandardsLoad,
              reportLogsLoad
          ]);
          if (!approvedLoadResult.complete) {
              throw new Error('Không thể tải đầy đủ lịch sử phiếu đã duyệt cho khoảng thời gian đã chọn.');
          }

          // Freeze one canonical snapshot after every selected-sheet dependency
          // has completed. Everything below must derive from this snapshot and
          // the export settings captured above, never from live report signals.
          const exportSnapshot = this.buildReportSnapshot(activeRange);
          const selectedSopName = this.getSnapshotSopName(exportSnapshot, sopId);
          const exportApprovedRequests = filterReportRequests(
            exportSnapshot.approvedRequests,
            exportSnapshot.range,
            sopId,
            selectedSopName
          );
          const exportConsumptionSummary = aggregateReportConsumption(exportApprovedRequests);
          const exportSopFrequency = aggregateSopFrequency(
            exportSnapshot.monthlyStats,
            exportSnapshot.range,
            sopId,
            selectedSopName
          );
          const exportFilteredLogs = exportSnapshot.businessLogs.filter(log =>
            matchesReportSop(log, sopId, selectedSopName)
          );
          const exportHealthStats = this.calculateHealthStats(exportSnapshot);
          const safetyConfig = this.state.safetyConfig();

          // Chỉ bắt đầu dựng workbook sau khi mọi dependency bắt buộc của các
          // sheet đã chọn và của Trang bìa đã được xác nhận là đầy đủ.
          const XLSX = await import('xlsx');
          const wb = XLSX.utils.book_new();
          
          const exportInfo = [
            ["BÁO CÁO TỔNG HỢP HỆ THỐNG LIMS"],
            [`Thời gian: ${start} đến ${end}`],
            [`Người xuất: ${currentUser?.displayName || currentUser?.email || 'Admin'}`],
            [`Ngày xuất: ${new Date().toLocaleString('vi-VN')}`],
            [`SOP: ${sopId === 'all' ? 'Tất cả quy trình' : selectedSopName}`],
            []
          ];

          const sheetsAdded: string[] = [];

          // ===== 1. NXT =====
          if (exportInventory) {
              this.exportProgress.update(p => ({ ...p, nxt: 'working' }));
              await new Promise(r => setTimeout(r, 50));
              
              const nxtRows = exportNxtRows;
              
              if (sopId === 'all') {
                  const data = nxtRows.map((row: any, index: number) => ({
                    'STT': index + 1, 'Mã định danh': row.id, 'Tên hàng': row.name, 'ĐVT': row.unit, 'Phân loại': row.category,
                    'Tồn đầu kỳ': row.startStock, 'Nhập trong kỳ': row.importQty, 'Xuất trong kỳ': row.exportQty, 'Tồn cuối kỳ': row.endStock
                  }));
                  const ws = XLSX.utils.json_to_sheet([]);
                  XLSX.utils.sheet_add_aoa(ws, [...exportInfo, ["BÁO CÁO NHẬP - XUẤT - TỒN (KHO)"]], { origin: "A1" });
                  XLSX.utils.sheet_add_json(ws, data, { origin: "A8", skipHeader: false });
                  this.formatSheet(ws, XLSX, 8, data.length, [6, 20, 35, 10, 18, 14, 14, 14, 14]);
                  XLSX.utils.book_append_sheet(wb, ws, "NXT");
                  sheetsAdded.push("NXT");
              } else {
                  const data = nxtRows.map((row: any, index: number) => ({
                    'STT': index + 1, 'Mã định danh': row.id, 'Tên hàng': row.name, 'ĐVT': row.unit,
                    'Tổng lượng xuất': row.exportQty
                  }));
                  const ws = XLSX.utils.json_to_sheet([]);
                  XLSX.utils.sheet_add_aoa(ws, [...exportInfo, [`CHI TIẾT XUẤT KHO - ${selectedSopName}`]], { origin: "A1" });
                  XLSX.utils.sheet_add_json(ws, data, { origin: "A8", skipHeader: false });
                  this.formatSheet(ws, XLSX, 8, data.length, [6, 20, 35, 10, 16]);
                  XLSX.utils.book_append_sheet(wb, ws, "Xuất SOP");
                  sheetsAdded.push("Xuất SOP");
              }
              this.exportProgress.update(p => ({ ...p, nxt: 'done' }));
              await new Promise(r => setTimeout(r, 200));
          }

          // ===== 2. CONSUMPTION (Full logic from exportConsumptionExcel) =====
          if (exportConsumption) {
              this.exportProgress.update(p => ({ ...p, consumption: 'working' }));
              await new Promise(r => setTimeout(r, 50));
              
              const history = exportSnapshot.approvedRequests;
              const type = exportType;
              const specDay = specificDay;
              const useBaseAmount = excludeMargin;
              const inventoryMap = new Map(exportSnapshot.inventory.map((i: any) => [i.id, i]));

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

              const filteredHistory = filterReportRequests(
                  history,
                  activeRange,
                  sopId,
                  selectedSopName,
                  type === 'specific_day' ? specDay : undefined
              );

              // Build consumption data based on type
              if (type === 'summary' || type === 'specific_day') {
                  const sortedData = aggregateReportConsumption(filteredHistory, (item, req) => {
                      const reqMargin: number = req.margin !== undefined ? req.margin : (req.inputs?.safetyMargin !== undefined ? req.inputs.safetyMargin : -1);
                      return getCalculatedItemAmount(item, reqMargin);
                  });
                  const data = sortedData.map((row, i) => ({
                      'STT': i + 1, 'Mã hóa chất/vật tư': row.name, 'Tên hóa chất/Vật tư': row.displayName,
                      'Tổng tiêu hao': parseFloat(row.amount.toFixed(3)), 'ĐVT': row.unit
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
                      const d = this.getRequestDate(req);
                      if (!d) return;
                      let colKey = '';
                      if (type === 'daily') {
                          colKey = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
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
                          const [d1, m1, y1] = a.split('/'); const [d2, m2, y2] = b.split('/');
                          if (y1 !== y2) return parseInt(y1) - parseInt(y2);
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
                      const rowObj: any = { 'STT': i + 1, 'Mã': id, 'Tên': val.displayName, 'ĐVT': val.unit, 'Tổng cộng': parseFloat(val.grandTotal.toFixed(3)) };
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
              if (exportPerSop && sopId === 'all') {
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
          if (exportSop) {
              this.exportProgress.update(p => ({ ...p, sop: 'working' }));
              await new Promise(r => setTimeout(r, 50));
              
              const sops = exportSopFrequency;
              const sopRows = sops.map((d: any, index: number) => ({
                'STT': index + 1, 'Quy trình (SOP)': d.name, 'Số lần chạy': d.count, 'Tổng số mẫu': d.samples, 'Tổng QC': d.qcs, 'Tỷ trọng (%)': formatNum(d.percent)
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
          if (exportLogs) {
              this.exportProgress.update(p => ({ ...p, logs: 'working' }));
              await new Promise(r => setTimeout(r, 50));
              
              const logs = exportFilteredLogs;
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
          if (exportStandards) {
              this.exportProgress.update(p => ({ ...p, standards: 'working' }));
              await new Promise(r => setTimeout(r, 50));
              
              const ws = XLSX.utils.json_to_sheet([]);
              XLSX.utils.sheet_add_aoa(ws, [...exportInfo, ["SỨC KHỎE & TRUY XUẤT CHUẨN ĐỐI CHIẾU"]], { origin: "A1" });
              
              // Section A: Summary
              const stats = exportHealthStats;
              XLSX.utils.sheet_add_aoa(ws, [
                  ["TỔNG QUAN"],
                  ["Đang mượn / Sử dụng:", stats.borrowing],
                  ["Chuẩn hết hạn:", stats.expired],
                  ["Tồn kho thấp:", stats.lowStock],
                  []
              ], { origin: "A8" });

              // Section C: All borrowed
              const borrowed = exportSnapshot.standardRequests.filter((r: any) => r.status === 'IN_PROGRESS');
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
              const approvedCount = exportApprovedRequests.length;

              const topSop = exportSopFrequency[0];
              const stats = exportHealthStats;

              XLSX.utils.sheet_add_aoa(coverWs, [
                  ["BÁO CÁO TỔNG HỢP HỆ THỐNG LIMS"],
                  [],
                  ["Đơn vị:", "Phòng thí nghiệm"],
                  ["Khoảng thời gian:", `${start}  đến  ${end}`],
                  ["SOP:", sopId === 'all' ? 'Tất cả quy trình' : selectedSopName],
                  ["Người xuất báo cáo:", currentUser?.displayName || currentUser?.email || 'Admin'],
                  ["Ngày giờ xuất:", new Date().toLocaleString('vi-VN')],
                  [],
                  ["═══════════════════════════════════════════"],
                  ["CHỈ SỐ TỔNG QUAN (KPIs)"],
                  ["═══════════════════════════════════════════"],
                  [],
                  ["Tổng phiếu đã duyệt:", approvedCount],
                  ["Tổng mặt hàng tiêu hao:", exportConsumptionSummary.length],
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
          this.toast.show('Đã xảy ra lỗi trong quá trình cấu trúc Báo cáo Excel. Vui lòng tải lại và kiểm tra Logs.', 'error');
      }
  }

  // Handle native input event for specific day
  onSpecificDayChange(event: Event) {
      const val = parseInt((event.target as HTMLInputElement).value, 10);
      if (!isNaN(val)) this.specificDay.set(val);
  }


  healthStats = computed(() => {
    return this.calculateHealthStats(this.reportSnapshot());
  });



  criticalLogs = computed(() => {
    return this.reportLogs().filter(log =>
        isRegisteredActivityAction(log.action)
        && getActivityActionDefinition(log.action).importance === 'WARNING'
    ).slice(-20).reverse();
  });

  getLogActionIcon(action: string): string {
    if (!isRegisteredActivityAction(action)) return 'fa-solid fa-bolt text-indigo-500';
    const definition = getActivityActionDefinition(action);
    const tone = definition.importance === 'WARNING'
        ? 'text-red-500'
        : definition.importance === 'IMPORTANT'
            ? 'text-blue-500'
            : 'text-indigo-500';
    return `fa-solid fa-${definition.iconKey} ${tone}`;
  }

  exportType = signal<'summary' | 'daily' | 'monthly' | 'specific_day'>('summary');
  specificDay = signal<number>(1);
  excludeMargin = signal<boolean>(false);

  // --- BACKFILL UI STATE ---
  isBackfilling = signal(false);
  backfillProgressText = signal('');

  private getActiveDateRange(): InclusiveDateRange {
    const start = this.startDate();
    const end = this.endDate();
    const allTimeStats = !start && !end && this.allTimeStatsReady()
      ? this.statsData()
      : {};
    return resolveStatisticsDateRange(start, end, allTimeStats, this.getToday());
  }

  private buildReportSopOptionsForRange(range: InclusiveDateRange): ReportSopOption[] {
    const approvedRequests = filterReportRequests(this.state.approvedRequests(), range);
    const businessLogs = this.reportLogs().filter(log => {
      const date = timestampToDate(log.timestamp);
      return !!date && date >= range.start && date <= range.end;
    });
    return buildReportSopOptions(
      this.state.sops().filter(sop => !sop.isArchived),
      approvedRequests,
      businessLogs,
      this.statsData(),
      range
    );
  }

  private buildReportSnapshot(range: InclusiveDateRange): ReportSnapshot {
    const approvedRequests = filterReportRequests(this.state.approvedRequests(), range);
    const businessLogs = this.reportLogs().filter(log => {
      const date = timestampToDate(log.timestamp);
      return !!date && date >= range.start && date <= range.end;
    });
    const warnings = this.reportWarnings();

    return {
      range: { start: new Date(range.start), end: new Date(range.end), days: range.days },
      inventory: [...this.reportInventory()],
      approvedRequests: [...approvedRequests],
      businessLogs: [...businessLogs],
      monthlyStats: { ...this.statsData() },
      referenceStandards: [...this.state.standards()],
      standardRequests: [...this.state.allStandardRequests()],
      sopOptions: buildReportSopOptions(
        this.state.sops().filter(sop => !sop.isArchived),
        approvedRequests,
        businessLogs,
        this.statsData(),
        range
      ),
      complete: warnings.length === 0,
      warnings: [...warnings]
    };
  }

  private getSnapshotSopName(snapshot: ReportSnapshot, sopId: string): string {
    if (sopId === 'all') return 'Tất cả';
    return snapshot.sopOptions.find(sop => sop.id === sopId)?.name || sopId;
  }

  private calculateHealthStats(snapshot: ReportSnapshot, now = Date.now()) {
    return {
      borrowing: snapshot.standardRequests.filter(r => r.status === 'IN_PROGRESS').length,
      expired: snapshot.referenceStandards.filter((s: any) =>
        s.expiry_date && new Date(s.expiry_date).getTime() < now
      ).length,
      lowStock: snapshot.referenceStandards.filter((s: any) => (s.current_amount ?? 0) < 5).length
    };
  }

  private async ensureAllTimeStatsLoaded(): Promise<void> {
    if (this.startDate() || this.endDate() || this.allTimeStatsReady()) return;
    if (this.allTimeStatsLoad) return this.allTimeStatsLoad;

    this.reportStatsReady.set(false);
    this.setReportDatasetError('Thống kê tháng', null);
    const load = this.statsService.getAllMonthlyStats()
      .then(data => {
        this.statsData.set(data);
        this.allTimeStatsReady.set(true);
        this.reportStatsReady.set(true);
        this.setReportDatasetError('Thống kê tháng', null);
      })
      .catch(error => {
        this.allTimeStatsReady.set(false);
        this.reportStatsReady.set(false);
        this.setReportDatasetError('Thống kê tháng', error);
        throw error;
      })
      .finally(() => {
        if (this.allTimeStatsLoad === load) this.allTimeStatsLoad = undefined;
      });
    this.allTimeStatsLoad = load;
    return load;
  }

  private setReportDatasetError(dataset: string, error: unknown | null): void {
    this.reportDatasetErrors.update(current => {
      const next = { ...current };
      if (!error) {
        delete next[dataset];
        return next;
      }
      const message = error instanceof Error ? error.message : String(error);
      next[dataset] = `${dataset}: ${message}`;
      return next;
    });
  }

  /**
   * The Excel cover is always emitted and always contains standards-health
   * KPIs. Therefore these two datasets are unconditional export dependencies,
   * even when the dedicated Standards sheet is not selected.
   */
  private async ensureExportCoverStandardsLoaded(): Promise<void> {
    this.referenceStandardsReady.set(false);
    this.standardRequestsReady.set(false);
    this.setReportDatasetError('Chuẩn đối chiếu', null);
    this.setReportDatasetError('Lịch sử mượn chuẩn', null);

    const [standardsResult, requestsResult] = await Promise.all([
      this.state.loadReferenceStandards()
        .then(result => {
          this.referenceStandardsReady.set(result.complete);
          this.setReportDatasetError(
            'Chuẩn đối chiếu',
            result.complete ? null : new Error('Không thể xác nhận dữ liệu đã tải đầy đủ.')
          );
          return result;
        })
        .catch(error => {
          this.referenceStandardsReady.set(false);
          this.setReportDatasetError('Chuẩn đối chiếu', error);
          throw error;
        }),
      this.state.loadAllStandardRequests()
        .then(result => {
          this.standardRequestsReady.set(result.complete);
          this.setReportDatasetError(
            'Lịch sử mượn chuẩn',
            result.complete ? null : new Error('Không thể xác nhận dữ liệu đã tải đầy đủ.')
          );
          return result;
        })
        .catch(error => {
          this.standardRequestsReady.set(false);
          this.setReportDatasetError('Lịch sử mượn chuẩn', error);
          throw error;
        })
    ]);

    const incomplete: string[] = [];
    if (!standardsResult.complete) incomplete.push('Chuẩn đối chiếu');
    if (!requestsResult.complete) incomplete.push('Lịch sử mượn chuẩn');
    if (incomplete.length > 0) {
      throw new Error(`Không thể tải đầy đủ dữ liệu bắt buộc cho Trang bìa: ${incomplete.join(', ')}.`);
    }
  }

  private async ensureReportInventoryLoaded(forceRefresh = false): Promise<void> {
    if (!forceRefresh && this.reportInventoryReady()) return;
    if (this.reportInventoryLoad) return this.reportInventoryLoad;

    this.reportInventoryReady.set(false);
    this.setReportDatasetError('Kho Báo Cáo', null);
    const load = this.invService.getAllInventoryForReports()
      .then(items => {
        this.reportInventory.set(items);
        this.reportInventoryReady.set(true);
        this.setReportDatasetError('Kho Báo Cáo', null);
      })
      .catch(error => {
        this.reportInventory.set([]);
        this.reportInventoryReady.set(false);
        this.setReportDatasetError('Kho Báo Cáo', error);
        throw error;
      })
      .finally(() => {
        if (this.reportInventoryLoad === load) this.reportInventoryLoad = undefined;
      });
    this.reportInventoryLoad = load;
    return load;
  }

  private async fetchReportLogs(start: Date, end: Date): Promise<Log[]> {
    const logs = await this.audit.getLogsByDateRange(start, end);
    const printDataByLog = await this.audit.getPrintDataForLogs(logs);
    // Missing legacy print snapshots affect stock reconstruction only. Audit
    // rows remain complete business events and must still be shown/exported.
    // generateNxtReport() owns the stricter recovery and completeness check.
    return enrichReportLogsWithPrintData(logs, printDataByLog);
  }

  getDateRangeDisplayText(): string {
    if (!this.startDate() && !this.endDate()) return 'Tất cả thời gian';
    const range = this.getActiveDateRange();
    return `${toLocalDateKey(range.start)} → ${toLocalDateKey(range.end)}`;
  }
  
  async runStatsBackfill() {
    if (this.isBackfilling()) return;
    
    // Check permission (only Manager)
    if (this.auth.currentUser()?.role !== 'manager') {
        this.toast.show('Bạn không có quyền chạy Backfill.', 'error');
        return;
    }

    await this.ensureAllTimeStatsLoaded();

    // Tự động dùng khoảng thời gian từ đầu năm 01/01 để đảm bảo nạp đủ lịch sử các tháng so sánh
    const currentYearStart = `${new Date().getFullYear()}-01-01`;
    const selectedRange = this.getActiveDateRange();
    const selectedStart = toLocalDateKey(selectedRange.start);
    const endStr = toLocalDateKey(selectedRange.end);
    
    // Sử dụng từ đầu năm nếu bộ lọc hiện tại ngắn hơn
    const startStr = selectedStart > currentYearStart ? currentYearStart : selectedStart;

    if (!await this.confirmation.confirm({
        message: `Bạn có chắc chắn muốn tổng hợp lại toàn bộ số liệu thống kê từ ${startStr} đến ${endStr} không?\nQuá trình này sẽ nạp lại đầy đủ dữ liệu các tháng trước để so sánh xu hướng.`,
        confirmText: 'Chạy Backfill',
        isDangerous: true
    })) {
        return;
    }

    this.isBackfilling.set(true);
    this.backfillProgressText.set('Đang khởi tạo...');
    
    try {
        await this.statsService.runBackfill(
            startStr,
            endStr,
            (msg: string) => {
                this.backfillProgressText.set(msg);
            }
        );
        this.backfillProgressText.set('Thành công!');
        setTimeout(() => this.isBackfilling.set(false), 2000);
    } catch (e: any) {
        console.error(e);
        this.toast.show('Lỗi khi chạy backfill: ' + e.message, 'error');
    } finally {
        this.isBackfilling.set(false);
        this.backfillProgressText.set('');
    }
  }

  constructor() {
    // Reference standards are only needed by the health/consumption views or
    // an explicit standards export. Do not pay the cold-start bulk read while
    // the statistics page is opened on the activity tab.
    effect(() => {
      const needsStandards = this.activeTab() === 'standards'
        || this.activeTab() === 'consumption'
        || this.exportStandards();
      if (needsStandards) {
        this.referenceStandardsReady.set(false);
        this.setReportDatasetError('Chuẩn đối chiếu', null);
        void this.state.loadReferenceStandards()
          .then(result => {
            this.referenceStandardsReady.set(result.complete);
            this.setReportDatasetError(
              'Chuẩn đối chiếu',
              result.complete ? null : new Error('Không thể xác nhận dữ liệu đã tải đầy đủ.')
            );
          })
          .catch(error => {
            this.referenceStandardsReady.set(false);
            this.setReportDatasetError('Chuẩn đối chiếu', error);
          });
      }

      const needsStandardRequests = this.activeTab() === 'standards'
        || this.exportStandards();
      if (needsStandardRequests) {
        this.standardRequestsReady.set(false);
        this.setReportDatasetError('Lịch sử mượn chuẩn', null);
        void this.state.loadAllStandardRequests()
          .then(result => {
            this.standardRequestsReady.set(result.complete);
            this.setReportDatasetError(
              'Lịch sử mượn chuẩn',
              result.complete ? null : new Error('Không thể xác nhận dữ liệu đã tải đầy đủ.')
            );
          })
          .catch(error => {
            this.standardRequestsReady.set(false);
            this.setReportDatasetError('Lịch sử mượn chuẩn', error);
          });
      }
    });

    effect(() => {
        const active = this.activeTab();
        const consData = this.consumptionData();
        const inventory = this.reportInventory();

        if (active === 'consumption') {
            if (!this.reportInventoryReady()) {
              void this.ensureReportInventoryLoaded().catch(error => {
                console.error('Error fetching report inventory:', error);
              });
            }
            setTimeout(() => {
                this.createConsumptionBarChart();
                this.createCategoryPieChart();
                this.createConsumptionLineChart();
            }, 100);
        }
    });

    effect(() => {
        const user = this.auth.currentUser();
        if (!user || !this.auth.canViewReports()) return;

        const start = this.startDate();
        const end = this.endDate();
        if (!start && !end) {
            void this.ensureAllTimeStatsLoaded().catch(error => {
                console.error('Error fetching all-time report stats:', error);
            });
            return;
        }

        const range = resolveStatisticsDateRange(start, end, {}, this.getToday());
        const cachedStats = this.statsData();
        const missingKeys = getMonthKeysForStatisticsRange(range)
            .filter(key => !Object.prototype.hasOwnProperty.call(cachedStats, key));
        const generation = ++this.reportStatsLoadGeneration;
        this.reportStatsReady.set(false);
        this.setReportDatasetError('Thống kê tháng', null);
        if (missingKeys.length === 0) {
            this.reportStatsReady.set(true);
            return;
        }

        this.statsService.getStatsForMonths(missingKeys).then(result => {
            if (generation !== this.reportStatsLoadGeneration) return;
            this.statsData.update(prev => ({ ...prev, ...result }));
            this.reportStatsReady.set(true);
            this.setReportDatasetError('Thống kê tháng', null);
        }).catch(error => {
            if (generation !== this.reportStatsLoadGeneration) return;
            this.reportStatsReady.set(false);
            this.setReportDatasetError('Thống kê tháng', error);
            console.error('Error fetching report stats:', error);
        });
    });

    // Approved-result history is loaded by the same inclusive effective range
    // used by every report tab. All-time waits for the full aggregate history
    // so blank filter values never become an accidental no-op query.
    effect(() => {
        const start = this.startDate();
        const end = this.endDate();
        if (!start && !end && !this.allTimeStatsReady()) return;

        const range = this.getActiveDateRange();
        const generation = ++this.approvedHistoryLoadGeneration;
        this.approvedHistoryReady.set(false);
        this.setReportDatasetError('Lịch sử phiếu đã duyệt', null);
        void this.state.loadApprovedRequestsForDateRange(
            toLocalDateKey(range.start),
            toLocalDateKey(range.end)
        ).then(result => {
            if (generation !== this.approvedHistoryLoadGeneration) return;
            this.approvedHistoryReady.set(result.complete);
            this.setReportDatasetError(
              'Lịch sử phiếu đã duyệt',
              result.complete ? null : new Error('Không thể xác nhận dữ liệu đã tải đầy đủ.')
            );
        }).catch(error => {
            if (generation === this.approvedHistoryLoadGeneration) {
              this.approvedHistoryReady.set(false);
              this.setReportDatasetError('Lịch sử phiếu đã duyệt', error);
            }
        });
    });

    // The realtime audit listener is intentionally capped at recent records.
    // The report table needs the complete selected range instead.
    effect(() => {
        const user = this.auth.currentUser();
        const needsLogs = this.activeTab() === 'logs'
          || this.activeTab() === 'nxt'
          || this.activeTab() === 'standards'
          || this.exportLogs();
        if (!user || !this.auth.canViewReports() || !needsLogs) return;

        const start = this.startDate();
        const end = this.endDate();
        if (!start && !end && !this.allTimeStatsReady()) return;

        const range = this.getActiveDateRange();
        const generation = ++this.reportLogsLoadGeneration;
        this.reportLogsReady.set(false);
        this.setReportDatasetError('Nhật ký nghiệp vụ', null);
        this.fetchReportLogs(range.start, range.end).then(logs => {
            if (generation === this.reportLogsLoadGeneration) {
              this.reportLogs.set(logs);
              this.reportLogsReady.set(true);
              this.setReportDatasetError('Nhật ký nghiệp vụ', null);
            }
        }).catch(error => {
            if (generation === this.reportLogsLoadGeneration) {
              this.reportLogs.set([]);
              this.reportLogsReady.set(false);
              this.setReportDatasetError('Nhật ký nghiệp vụ', error);
            }
            console.error('Error fetching report audit logs:', error);
        });
    });
  }

  // --- Actions ---
  onDateRangeChange(range: { start: string, end: string, label: string }) {
      this.invalidateNxtReport();
      this.startDate.set(range.start);
      this.endDate.set(range.end);
  }

  onSopSelectionChange(sopId: string) {
      this.invalidateNxtReport();
      this.selectedSopId.set(sopId);
  }

  private invalidateNxtReport(): void {
      this.nxtReportGeneration++;
      this.isLoading.set(false);
      this.hasGenerated.set(false);
      this.nxtData.set([]);
  }

  private toLocalDateStr(d: Date): string {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
  }
  private getToday(): string { return this.toLocalDateStr(new Date()); }
  private getFirstDayOfMonth(): string { const d = new Date(); return this.toLocalDateStr(new Date(d.getFullYear(), d.getMonth(), 1)); }
  private getRequestDate(request: any): Date | null {
      return getReportRequestDate(request);
  }
  
  getUnitClass(unit: string): string { return (unit.includes('ml') || unit.includes('l')) ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-600 border-slate-200'; }

  getSelectedSopName(): string {
      const id = this.selectedSopId();
      return this.getSnapshotSopName(this.reportSnapshot(), id);
  }


  // --- NXT / EXPORT DETAIL REPORT LOGIC ---
  async generateNxtReport(
    throwOnError = false,
    reportContext?: { range: InclusiveDateRange; sopId: string }
  ): Promise<NxtReportItem[]> {
      const generation = ++this.nxtReportGeneration;
      const filterStart = this.startDate();
      const filterEnd = this.endDate();
      const sopId = reportContext?.sopId ?? this.selectedSopId();
      const fallbackKey = this.getToday();
      this.isLoading.set(true);
      this.nxtData.set([]);
      
      try {
          if (!reportContext && !filterStart && !filterEnd) await this.ensureAllTimeStatsLoaded();
          if (generation !== this.nxtReportGeneration) {
              throw new Error('Bộ lọc Báo Cáo đã thay đổi trong lúc đang tính N-X-T.');
          }

          // Use the filter values captured before the first await. Blank dates
          // resolve against the complete all-time stats loaded just above.
          const range = reportContext?.range ?? resolveStatisticsDateRange(
            filterStart,
            filterEnd,
            !filterStart && !filterEnd ? this.statsData() : {},
            fallbackKey
          );
          const start = new Date(range.start);
          const end = new Date(range.end);
          const startTime = start.getTime();
          const endTime = end.getTime();

          await this.ensureReportInventoryLoaded();
          if (generation !== this.nxtReportGeneration) {
              throw new Error('Bộ lọc Báo Cáo đã thay đổi trong lúc đang tính N-X-T.');
          }
          const inventory = this.reportInventory();

          // Bug Fix: Fetch logs from 'start' up to 'today' (not just 'end') so we can
          // correctly calculate futureNetChange (movements AFTER the period end).
          // We need logs beyond 'end' to subtract from current stock to get end-of-period stock.
          const maxNow = new Date(); maxNow.setHours(23,59,59,999);
          const logs = await this.audit.getLogsByDateRange(start, maxNow);
          if (generation !== this.nxtReportGeneration) {
              throw new Error('Bộ lọc Báo Cáo đã thay đổi trong lúc đang tính N-X-T.');
          }
          const legacyPrintData = await this.audit.getPrintDataForLogs(
              logs.filter(needsLegacyNxtPrintData)
          );
          if (generation !== this.nxtReportGeneration) {
              throw new Error('Bộ lọc Báo Cáo đã thay đổi trong lúc đang tính N-X-T.');
          }
          const unresolvedBeforeRequestFallback = findUnresolvedLegacyNxtApprovalLogs(logs, legacyPrintData);
          const legacyRequests = unresolvedBeforeRequestFallback.length > 0
              ? await this.audit.getRequestsForLogs(unresolvedBeforeRequestFallback)
              : new Map();
          if (generation !== this.nxtReportGeneration) {
              throw new Error('Bộ lọc Báo Cáo đã thay đổi trong lúc đang tính N-X-T.');
          }
          const recoverableLogs = recoverLegacyNxtApprovalLogsFromRequests(
              logs,
              legacyPrintData,
              legacyRequests
          );
          const unresolvedLegacyApprovals = findUnresolvedLegacyNxtApprovalLogs(recoverableLogs, legacyPrintData);
          if (unresolvedLegacyApprovals.length > 0) {
              throw new Error(
                  `N-X-T thiếu ${unresolvedLegacyApprovals.length} snapshot phê duyệt lịch sử cần để tái dựng biến động kho.`
              );
          }
          const movements = aggregateNxtMovements(recoverableLogs, legacyPrintData, startTime, endTime, sopId);
          
          if (sopId === 'all') {
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
              const sortedReport = report.sort((a,b) => a.name.localeCompare(b.name));
              this.nxtData.set(sortedReport);
              this.hasGenerated.set(true);
              this.setReportDatasetError('N-X-T', null);
              return sortedReport;

          } else {
              // --- SOP-specific export detail mode ---
              const report: NxtReportItem[] = [];
              movements.forEach((movement, id) => {
                  const qty = movement.inPeriodExport;
                  if (qty === 0) return;
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
              const sortedReport = report.sort((a,b) => a.name.localeCompare(b.name));
              this.nxtData.set(sortedReport);
              this.hasGenerated.set(true);
              this.setReportDatasetError('N-X-T', null);
              return sortedReport;
          }

      } catch (e) {
          if (generation !== this.nxtReportGeneration) {
              if (throwOnError) throw e;
              return [];
          }
          this.setReportDatasetError('N-X-T', e);
          console.error(e);
          if (throwOnError) throw e;
          return [];
      } finally {
          if (generation === this.nxtReportGeneration) this.isLoading.set(false);
      }
  }


  filteredLogs = computed(() => {
      const sopId = this.selectedSopId();
      const sopName = this.getSelectedSopName();

      return this.reportSnapshot().businessLogs.filter(log => {
          return matchesReportSop(log, sopId, sopName);
      });
  });

  filteredApprovedRequests = computed(() => {
      const snapshot = this.reportSnapshot();
      return filterReportRequests(
        snapshot.approvedRequests,
        snapshot.range,
        this.selectedSopId(),
        this.getSelectedSopName()
      );
  });

  filteredStandardRequests = computed(() => {
      const { start, end } = this.reportSnapshot().range;

      return this.reportSnapshot().standardRequests.filter(req => {
          const d = new Date(req.requestDate);
          return d >= start && d <= end;
      });
  });

  consumptionData = computed(() => {
    return aggregateReportConsumption(this.filteredApprovedRequests());
  });

  sopFrequencyData = computed(() => {
    const snapshot = this.reportSnapshot();
    const sopId = this.selectedSopId();
    return aggregateSopFrequency(
      snapshot.monthlyStats,
      snapshot.range,
      sopId,
      this.getSnapshotSopName(snapshot, sopId)
    );
  });

  async createConsumptionBarChart() {
      const canvas = this.barChartCanvas()?.nativeElement;
      if (!canvas) return;
      const Chart = await this.loadChart();
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
                          callback: function(this: any, value: any): string {
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
      const Chart = await this.loadChart();
      if (this.pieChart) this.pieChart.destroy();
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const data = this.consumptionData();
      const catMap = new Map<string, number>();
      
      // Build lookup maps by both ID and name for robust matching
      // consumptionData uses item.name which is the Firestore document ID (item ID)
      const invByIdMap = new Map(this.reportSnapshot().inventory.map(i => [i.id, i.category]));
      const invByNameMap = new Map(this.reportSnapshot().inventory.map(i => [i.name, i.category]));
      const stdByIdMap = new Map(this.reportSnapshot().referenceStandards.map((s: any) => [s.id, 'Chất chuẩn đối chiếu']));
      const stdByNameMap = new Map(this.reportSnapshot().referenceStandards.map((s: any) => [s.name, 'Chất chuẩn đối chiếu']));
      
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
      const Chart = await this.loadChart();
      if (this.lineChart) this.lineChart.destroy();
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Group consumption by date for trend
      const history = this.filteredApprovedRequests();
      const trendMap = new Map<string, number>();

      history.forEach(req => {
          const d = this.getRequestDate(req);
          if (!d) return;
          const key = toLocalDateKey(d);
          let dayTotal = 0;
          req.items.forEach(i => dayTotal += i.amount);
          trendMap.set(key, (trendMap.get(key) || 0) + dayTotal);
      });

      const sortedKeys = Array.from(trendMap.keys()).sort();

      this.lineChart = new Chart(ctx, {
          type: 'line',
          data: {
              labels: sortedKeys.map(key => {
                  const [year, month, day] = key.split('-');
                  return `${day}/${month}/${year}`;
              }),
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

  private loadChart(): Promise<any> {
      this.chartLoader ??= import('chart.js').then(m => {
          m.Chart.register(
              m.BarController,
              m.LineController,
              m.DoughnutController,
              m.CategoryScale,
              m.LinearScale,
              m.PointElement,
              m.LineElement,
              m.BarElement,
              m.ArcElement,
              m.Filler,
              m.Tooltip,
              m.Legend
          );
          return m.Chart;
      });
      return this.chartLoader;
  }
}
