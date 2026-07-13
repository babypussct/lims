
import { Component, inject, computed, signal, OnInit, viewChild, ElementRef, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { StateService } from '../../core/services/state.service';
import { AuthService } from '../../core/services/auth.service';
import { InventoryService } from '../inventory/inventory.service';
import { StandardService } from '../standards/standard.service'; 
import { InventoryItem } from '../../core/models/inventory.model';
import { ReferenceStandard } from '../../core/models/standard.model';
import { Request } from '../../core/models/request.model';
import { ToastService } from '../../core/services/toast.service';
import { FirebaseService } from '../../core/services/firebase.service';
import { QrGlobalService } from '../../core/services/qr-global.service'; // Import Global Service
import { onSnapshot, query, collection, orderBy, limit } from 'firebase/firestore';
import { formatNum, formatDate, getAvatarUrl, formatSampleList } from '../../shared/utils/utils';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { DateRangeFilterComponent } from '../../shared/components/date-range-filter/date-range-filter.component';
import Chart from 'chart.js/auto'; 

interface PriorityStandard {
    name: string;
    daysLeft: number;
    date: string;
    status: 'expired' | 'warning' | 'safe' | 'error';
}

// Thêm interface để cache _date
interface ParsedRequest extends Request {
    _date: Date;
}

interface BatchHistoryItem {
    id: string; // Request ID / Trace ID
    timestamp: any;
    user: string;
    sampleCount: number;
    sampleList: string[]; // Raw list for this batch
    sampleDisplay: string; // Formatted range for this batch
}

interface KanbanColumn {
    sopName: string;
    sopId: string;
    totalSamples: number;
    sampleList: string[]; // Aggregated list
    sampleDisplay: string; // Formatted aggregated list
    users: Set<string>;
    batchCount: number; 
    lastRun: Date; 
    history: BatchHistoryItem[]; // Detailed history for modal
}

import { DailyChecklistComponent } from '../checklist/daily-checklist.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SkeletonComponent, FormsModule, DateRangeFilterComponent, DailyChecklistComponent], 
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit, OnDestroy {
  state = inject(StateService);
  invService = inject(InventoryService); 
  stdService = inject(StandardService);
  auth = inject(AuthService); 
  router: Router = inject(Router);
  toast = inject(ToastService);
  qrService = inject(QrGlobalService); // Injected Global Service
  fb = inject(FirebaseService);

  formatNum = formatNum;
  getAvatarUrl = getAvatarUrl;
  formatSampleList = formatSampleList;
  
  isLoading = signal(true);
  lowStockItems = computed(() => {
      return this.state.inventory().filter(i => i.stock <= (i.threshold || 5));
  });
  priorityStandard = signal<PriorityStandard | null>(null);
  userPhotoMap = signal<Record<string, string>>({});
  
  // Date Filters — init inline to avoid calling methods before they are available
  private static _getLocalStr(d: Date): string {
      return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  private static _initWeekStart(): string {
      const today = new Date();
      const day = today.getDay();
      const mon = new Date(today);
      mon.setDate(today.getDate() - day + (day === 0 ? -6 : 1));
      return DashboardComponent._getLocalStr(mon);
  }
  startDate = signal<string>(DashboardComponent._initWeekStart());
  endDate = signal<string>(DashboardComponent._getLocalStr(new Date()));

  // Custom SOP distribution list for charts legend
  sopDistribution = signal<{ name: string, count: number, percent: number, color: string }[]>([]);

  // Modal State
  selectedSopDetails = signal<KanbanColumn | null>(null);

  // Active SOP Filter
  selectedSopFilter = signal<string | null>(null);

  showPendingRequestsPopover = signal(false);

  // Computed for separate counts
  pendingCounts = computed(() => {
      const uid = this.auth.currentUser()?.uid;
      let sop = 0; let std = 0;
      
      if (this.auth.canApprove()) { 
          sop = this.state.requests().length; 
      } else if (uid) { 
          sop = this.state.requests().filter(r => r.user === this.auth.currentUser()?.displayName).length; 
      }
      
      if (this.auth.canApproveStandards()) { 
          std = this.state.standardRequests().filter(r => r.status === 'PENDING_APPROVAL' || r.status === 'PENDING_RETURN').length; 
      } else if (uid) { 
          std = this.state.standardRequests().filter(r => r.status === 'PENDING_APPROVAL').length; 
      }
      return { sop, std };
  });

  // LIVE DATA COMPUTED
  // Phân nhánh logic đếm theo từng quyền cụ thể:
  // - canApprove (SOP): đếm SOP requests đang pending
  // - canApproveStandards: đếm Standard requests cần action (PENDING_APPROVAL + PENDING_RETURN)
  // - User thường: chỉ đếm request CỦA CHÍNH MÌNH đang ở trạng thái PENDING_APPROVAL
  totalPendingRequests = computed(() => {
      const counts = this.pendingCounts();
      return counts.sop + counts.std;
  });
  // Activity Feed Filters
  logSearchTerm = signal<string>('');
  logFilterCategory = signal<'ALL' | 'SOP' | 'STOCK' | 'STANDARD' | 'APPROVE' | 'SYSTEM'>('ALL');

  recentLogsGrouped = computed(() => {
      let logs = this.state.logs();
      
      const isManager = this.auth.currentUser()?.role === 'manager';
      if (!isManager) {
          const canViewInv = this.auth.canViewInventory();
          const canViewStd = this.auth.canViewStandards();
          const canViewSop = this.auth.canViewSop() || this.auth.canRunBatch();
          const canViewSystem = this.auth.canManageSystem() || this.auth.canViewReports();

          logs = logs.filter(l => {
              const act = l.action || '';
              if (act.includes('STOCK')) return canViewInv;
              if (act.includes('STANDARD')) return canViewStd;
              if (act.includes('RESULT') || act === 'PUBLISH_RESULT_REPORT' || act === 'CREATE_VIRTUAL_MASTER' || act === 'EDIT_REQUEST' || act === 'DIRECT_APPROVE' || act === 'APPROVE_REQUEST') {
                  return canViewSop;
              }
              if (act.includes('MAINTENANCE') || act.includes('SYSTEM')) return canViewSystem;
              return true;
          });
      }

      logs = logs.slice(0, 50); // Fetch up to 50 logs for filtering after application of permissions filter
      
      const term = this.logSearchTerm().toLowerCase().trim();
      if (term) {
          logs = logs.filter(l => 
              l.user.toLowerCase().includes(term) || 
              (l.details && l.details.toLowerCase().includes(term)) ||
              this.getLogActionText(l.action).toLowerCase().includes(term)
          );
      }

      const category = this.logFilterCategory();
      if (category !== 'ALL') {
          logs = logs.filter(l => {
              if (category === 'APPROVE') return l.action.includes('APPROVE') && !l.action.includes('STANDARD') && !l.action.includes('RESULT');
              if (category === 'STOCK') return l.action.includes('STOCK');
              if (category === 'STANDARD') return l.action.includes('STANDARD');
              if (category === 'SOP') return l.action.includes('RESULT') || l.action === 'PUBLISH_RESULT_REPORT';
              if (category === 'SYSTEM') return !l.action.includes('APPROVE') && !l.action.includes('STOCK') && !l.action.includes('STANDARD') && !l.action.includes('RESULT');
              return true;
          });
      }

      // Group by Date
      const groups = new Map<string, any[]>();
      logs.forEach(l => {
          const d = l.timestamp?.toDate ? l.timestamp.toDate() : new Date(l.timestamp);
          const dateStr = this.formatDateStr(d);
          if (!groups.has(dateStr)) groups.set(dateStr, []);
          groups.get(dateStr)!.push(l);
      });

      return Array.from(groups.entries()).map(([dateStr, logs]) => ({
          dateStr,
          logs
      }));
  });

  formatDateStr(d: Date): string {
      const today = new Date();
      const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
      
      if (d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()) {
          return 'Hôm nay';
      } else if (d.getDate() === yesterday.getDate() && d.getMonth() === yesterday.getMonth() && d.getFullYear() === yesterday.getFullYear()) {
          return 'Hôm qua';
      }
      return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  getLogIcon(action: string): { icon: string, bg: string, text: string } {
      if (action.includes('APPROVE') && !action.includes('STANDARD') && !action.includes('RESULT')) {
          return { icon: 'fa-check-double', bg: 'bg-fuchsia-100 dark:bg-fuchsia-900/30', text: 'text-fuchsia-600 dark:text-fuchsia-400' };
      }
      if (action.includes('STOCK')) {
          return { icon: 'fa-box-open', bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' };
      }
      if (action.includes('STANDARD')) {
          return { icon: 'fa-flask', bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400' };
      }
      if (action === 'PUBLISH_RESULT_REPORT') {
          return { icon: 'fa-file-signature', bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400' };
      }
      if (action.includes('RESULT')) {
          return { icon: 'fa-vial', bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-600 dark:text-cyan-400' };
      }
      return { icon: 'fa-bolt', bg: 'bg-gray-100 dark:bg-slate-700', text: 'text-gray-600 dark:text-gray-300' };
  }

  private readonly _actionTextMap: Record<string, string> = {
      'CREATE_VIRTUAL_MASTER': 'đã tạo mẻ master ảo',
      'SAVE_RESULT_DRAFT': 'đã lưu nháp kết quả',
      'PUBLISH_RESULT_REPORT': 'đã xuất bản báo cáo',
      'REVERT_RESULT_DRAFT': 'đã hủy xuất bản báo cáo',
      'RESET_RESULT_DATA': 'đã reset số liệu kết quả',
      'RESTORE_RESULT_BACKUP': 'đã khôi phục số liệu lưu trữ',
      'RESTORE_RESULT_VERSION': 'đã khôi phục phiên bản cũ',
      'DIRECT_APPROVE': 'đã duyệt trực tiếp SOP',
      'EDIT_REQUEST': 'đã chỉnh sửa phiếu yêu cầu',
      'REQUEST_STANDARD': 'đã yêu cầu mượn chuẩn',
      'CREATE_STANDARD_REQUEST': 'đã yêu cầu mượn chuẩn',
      'APPROVE_STANDARD_REQUEST': 'đã duyệt mượn chuẩn',
      'REJECT_STANDARD_REQUEST': 'đã từ chối mượn chuẩn',
      'REPORT_RETURN_STANDARD': 'đã báo cáo trả chuẩn',
      'RETURN_STANDARD': 'đã nhận lại chuẩn',
      'ASSIGN_STANDARD': 'đã gán chuẩn cho mượn'
  };

  private getLocalYYYYMMDD(d: Date): string {
      return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  private _todayStr = this.getLocalYYYYMMDD(new Date());
  todayActivityCount = computed(() => {
      let logs = this.state.logs();
      const isManager = this.auth.currentUser()?.role === 'manager';
      if (!isManager) {
          const canViewInv = this.auth.canViewInventory();
          const canViewStd = this.auth.canViewStandards();
          const canViewSop = this.auth.canViewSop() || this.auth.canRunBatch();
          const canViewSystem = this.auth.canManageSystem() || this.auth.canViewReports();

          logs = logs.filter(l => {
              const act = l.action || '';
              if (act.includes('STOCK')) return canViewInv;
              if (act.includes('STANDARD')) return canViewStd;
              if (act.includes('RESULT') || act === 'PUBLISH_RESULT_REPORT' || act === 'CREATE_VIRTUAL_MASTER' || act === 'EDIT_REQUEST' || act === 'DIRECT_APPROVE' || act === 'APPROVE_REQUEST') {
                  return canViewSop;
              }
              if (act.includes('MAINTENANCE') || act.includes('SYSTEM')) return canViewSystem;
              return true;
          });
      }

      return logs.filter(l => {
          const d = l.timestamp?.toDate ? l.timestamp.toDate() : new Date(l.timestamp);
          return d.toISOString().split('T')[0] === this._todayStr;
      }).length;
  });

  private parseRequestDate(req: any): Date {
      if (req.analysisDate) {
          const parts = req.analysisDate.split('-');
          if (parts.length === 3) {
              return new Date(parseInt(parts[0]), parseInt(parts[1])-1, parseInt(parts[2]));
          }
      }
      const ts = req.approvedAt || req.timestamp;
      return (ts && typeof ts.toDate === 'function') ? ts.toDate() : new Date(ts);
  }

  // MỚI: Computed trung gian — parse date 1 lần duy nhất, filter isVirtualMaster
  private _parsedRequests = computed<ParsedRequest[]>(() => {
      return this.state.approvedRequests()
          .filter(r => !r.isVirtualMaster)
          .map(r => ({ ...r, _date: this.parseRequestDate(r) }));
  });

  // MỚI: Computed slice theo date range hiện tại — dùng chung cho kanbanBoard, chartKpis, trendInfo(current)
  private _rangeFilteredRequests = computed<ParsedRequest[]>(() => {
      const all = this._parsedRequests();
      let startStr = this.startDate();
      let endStr = this.endDate();
      if (!startStr || !endStr) return all; // Tất cả thời gian
      
      const start = new Date(startStr); start.setHours(0,0,0,0);
      const end = new Date(endStr); end.setHours(23,59,59,999);
      const filter = this.selectedSopFilter();
      
      return all.filter(r => {
          const inRange = r._date >= start && r._date <= end;
          const inSop = !filter || r.sopName === filter;
          return inRange && inSop;
      });
  });

  // TREND INDICATOR (Dynamic Comparison based on Date Filter)
  trendInfo = computed(() => {
      let history = this._parsedRequests();
      const filter = this.selectedSopFilter();
      if (filter) {
          history = history.filter(r => r.sopName === filter);
      }
      
      const startStr = this.startDate();
      const endStr = this.endDate();
      
      let currentStart = new Date(); currentStart.setHours(0,0,0,0);
      let currentEnd = new Date(); currentEnd.setHours(23,59,59,999);
      if (startStr && endStr) {
          currentStart = new Date(startStr); currentStart.setHours(0,0,0,0);
          currentEnd = new Date(endStr); currentEnd.setHours(23,59,59,999);
      }
      
      const diffTime = Math.abs(currentEnd.getTime() - currentStart.getTime());
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;

      // Calculate current total
      let currentTotal = 0;
      const tCurrStart = currentStart.getTime();
      const tCurrEnd = currentEnd.getTime();

      const currentFiltered = this._rangeFilteredRequests();
      currentFiltered.forEach(req => {
          let count = 1;
          if (req.sampleList && req.sampleList.length > 0) count = req.sampleList.length;
          else if (req.inputs?.['n_sample']) count = Number(req.inputs['n_sample']);
          currentTotal += count;
      });

      const currentAvg = diffDays > 0 ? currentTotal / diffDays : currentTotal;

      // Historical period (30 days prior to currentStart)
      const historyDays = 30;
      const historyEnd = new Date(currentStart); historyEnd.setDate(historyEnd.getDate() - 1); historyEnd.setHours(23,59,59,999);
      const historyStart = new Date(historyEnd); historyStart.setDate(historyStart.getDate() - historyDays + 1); historyStart.setHours(0,0,0,0);

      const tHistStart = historyStart.getTime();
      const tHistEnd = historyEnd.getTime();

      // Daily totals for history
      const dailyTotals = new Array(historyDays).fill(0);
      history.forEach(req => {
          const timestamp = req._date.getTime();
          if (timestamp >= tHistStart && timestamp <= tHistEnd) {
              const dayIndex = Math.floor((timestamp - tHistStart) / (1000 * 60 * 60 * 24));
              if (dayIndex >= 0 && dayIndex < historyDays) {
                  let count = 1;
                  if (req.sampleList && req.sampleList.length > 0) count = req.sampleList.length;
                  else if (req.inputs?.['n_sample']) count = Number(req.inputs['n_sample']);
                  dailyTotals[dayIndex] += count;
              }
          }
      });

      // Calculate Mean and StdDev
      const historyMean = dailyTotals.reduce((a, b) => a + b, 0) / historyDays;
      const variance = dailyTotals.reduce((a, b) => a + Math.pow(b - historyMean, 2), 0) / historyDays;
      const historyStdDev = Math.sqrt(variance);

      // Z-Score and Status
      const zScore = historyStdDev > 0 ? (currentAvg - historyMean) / historyStdDev : (currentAvg > historyMean ? 1.1 : (currentAvg < historyMean ? -1.1 : 0));
      
      let status: 'outstanding' | 'underperforming' | 'normal' = 'normal';
      let icon = 'fa-minus';
      let colorClass = 'text-gray-500 dark:text-slate-400';
      let statusText = 'Bình thường';

      if (zScore > 1) {
          status = 'outstanding';
          icon = 'fa-arrow-trend-up';
          colorClass = 'text-emerald-500 dark:text-emerald-400';
          statusText = 'Vượt trội';
      } else if (zScore < -1) {
          status = 'underperforming';
          icon = 'fa-arrow-trend-down';
          colorClass = 'text-red-500 dark:text-red-400';
          statusText = 'Dưới mức';
      }

      // Percentage diff for Moving Average info
      let percent = 0;
      if (historyMean === 0) {
          percent = currentAvg > 0 ? 100 : 0;
      } else {
          percent = Math.round(((currentAvg - historyMean) / historyMean) * 100);
      }
      
      const percentText = percent > 0 ? `+${percent}%` : `${percent}%`;

      return { 
          status, 
          statusText,
          icon, 
          colorClass,
          currentAvg: Math.round(currentAvg * 10) / 10, 
          historyMean: Math.round(historyMean * 10) / 10, 
          percentText,
          historyDays
      };
  });

  // KANBAN COMPUTED
  kanbanBoard = computed<KanbanColumn[]>(() => {
      const currentReqs = this._rangeFilteredRequests();
      const groups = new Map<string, KanbanColumn>();

      currentReqs.forEach(req => {
          const d = req._date;

          const key = req.sopName;
          
          if (!groups.has(key)) {
              groups.set(key, {
                  sopName: req.sopName,
                  sopId: req.sopId,
                  totalSamples: 0,
                  sampleList: [],
                  sampleDisplay: '',
                  users: new Set<string>(), 
                  batchCount: 0,
                  lastRun: d,
                  history: []
              });
          }

          const col = groups.get(key)!;
          col.batchCount++;
          if (req.user) col.users.add(req.user);
          if (d > col.lastRun) col.lastRun = d; 
          
          let currentBatchSamples: string[] = [];
          if (req.sampleList && req.sampleList.length > 0) {
              currentBatchSamples = req.sampleList;
              col.sampleList.push(...req.sampleList);
              col.totalSamples += req.sampleList.length;
          } else {
              const nSample = req.inputs?.['n_sample'] || 1;
              col.totalSamples += Number(nSample);
              currentBatchSamples = [`Batch #${req.id.substring(0,4)}`];
              col.sampleList.push(...currentBatchSamples);
          }

          col.history.push({
              id: req.id,
              timestamp: d,
              user: req.user || 'Unknown',
              sampleCount: currentBatchSamples.length,
              sampleList: currentBatchSamples,
              sampleDisplay: this.formatSampleList(currentBatchSamples)
          });
      });

      const result = Array.from(groups.values()).map(col => {
          col.sampleList.sort((a,b) => a.localeCompare(b, undefined, {numeric: true}));
          col.sampleDisplay = this.formatSampleList(col.sampleList);
          col.history.sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime());
          return col;
      });
      const filter = this.selectedSopFilter();
      const sorted = result.sort((a, b) => b.lastRun.getTime() - a.lastRun.getTime()); 
      if (filter) {
          return sorted.filter(col => col.sopName === filter);
      }
      return sorted;
  });

  chartKpis = computed(() => {
      const currentReqs = this._rangeFilteredRequests();
      let totalSamples = 0;
      let totalBatches = 0;

      currentReqs.forEach(req => {
          totalBatches++;
          let samples = 0;
          if (req.sampleList && req.sampleList.length > 0) samples = req.sampleList.length;
          else if (req.inputs?.['n_sample']) samples = Number(req.inputs['n_sample']);
          else samples = 1;
          totalSamples += samples;
      });

      const avgSamplesPerBatch = totalBatches > 0 ? (totalSamples / totalBatches).toFixed(1) : '0';
      
      return { totalSamples, totalBatches, avgSamplesPerBatch };
  });

  today = new Date();
  chartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('activityChart');
  doughnutChartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('doughnutChart');
  chartInstance: any = null;
  doughnutChartInstance: any = null;
  
  private _chartDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  private _lastDarkMode: boolean | null = null;

  constructor() {
      effect(() => {
          // Read dependencies to track
          this.state.approvedRequests();
          this.startDate();
          this.endDate();
          this.selectedSopFilter();
          this.state.darkMode();
          
          if (!this.isLoading()) {
              if (this._chartDebounceTimer) clearTimeout(this._chartDebounceTimer);
              this._chartDebounceTimer = setTimeout(() => this.initChart(), 300);
          }
      });
  }

  async ngOnInit() {
      this.isLoading.set(true);

      // 2. Tải thông tin chuẩn sắp hết hạn
      try {
          const nearestStd = await this.stdService.getNearestExpiry();
          this.processPriorityStandard(nearestStd);
      } catch (e) {
          console.warn("Dashboard: Lỗi khi tải thông tin chất chuẩn sắp hết hạn:", e);
          this.priorityStandard.set({ name: 'Lỗi kết nối / dữ liệu', daysLeft: 0, date: '', status: 'error' });
      }

      // 3. Tải danh sách người dùng cho bản đồ ảnh đại diện (Graceful fallback nếu chưa có quyền/chưa đăng nhập xong)
      try {
          const users = await this.fb.getAllUsers();
          const map: Record<string, string> = {};
          users.forEach(u => {
              if (u.displayName && u.photoURL) {
                  map[u.displayName] = u.photoURL;
              }
          });
          this.userPhotoMap.set(map);
      } catch (e) {
          console.warn("Dashboard: Không thể tải danh sách người dùng (lỗi phân quyền hoặc kết nối):", e);
      }

      this.isLoading.set(false);
  }



  getAvatar(name: string | undefined | null): string {
      const opts = this.state.getUserAvatarOptions(name);
      let photoUrl = opts.photoURL;
      let style = opts.style;
      
      if (name === this.auth.currentUser()?.displayName) {
          photoUrl = this.auth.currentUser()?.photoURL || photoUrl;
          style = this.auth.currentUser()?.avatarStyle || style;
      }
      return this.getAvatarUrl(name, style, photoUrl);
  }

  ngOnDestroy(): void {
      if (this._chartDebounceTimer) clearTimeout(this._chartDebounceTimer);
      if (this.chartInstance) {
          this.chartInstance.destroy();
          this.chartInstance = null;
      }
      if (this.doughnutChartInstance) {
          this.doughnutChartInstance.destroy();
          this.doughnutChartInstance = null;
      }
  }

  private getToday(): string { return this.getLocalYYYYMMDD(new Date()); }
  private getFirstDayOfMonth(): string { const d = new Date(); return this.getLocalYYYYMMDD(new Date(d.getFullYear(), d.getMonth(), 1)); }
  private getThisWeekStart(): string {
      const today = new Date();
      const day = today.getDay();
      const diffToMon = today.getDate() - day + (day === 0 ? -6 : 1);
      const start = new Date(today);
      start.setDate(diffToMon);
      return this.getLocalYYYYMMDD(start);
  }

  onDateRangeChange(range: { start: string, end: string, label: string }) {
      this.startDate.set(range.start);
      this.endDate.set(range.end);
  }

  toggleSopFilter(sopName: string) {
      if (this.selectedSopFilter() === sopName) {
          this.selectedSopFilter.set(null);
      } else {
          this.selectedSopFilter.set(sopName);
      }
  }

  navTo(path: string) {
      this.router.navigate([`/${path}`]);
  }

  formatDateShort(date: Date): string {
      return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + 
             date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  }

  openSopDetails(col: KanbanColumn) {
      this.selectedSopDetails.set(col);
  }

  createBatchForSop(sopId: string) {
      const sop = this.state.sops().find(s => s.id === sopId);
      if (sop) {
          this.state.selectedSop.set(sop);
          this.router.navigate(['/calculator']);
      } else {
          this.toast.show('Không tìm thấy quy trình gốc.', 'error');
      }
  }

  async initChart() {
      const canvas = this.chartCanvas()?.nativeElement;
      const dCanvas = this.doughnutChartCanvas()?.nativeElement;
      if (!canvas || !dCanvas) return;

      const isDark = this.state.darkMode();
      
      // Force recreate if dark mode changed
      const forceRecreate = this._lastDarkMode !== null && this._lastDarkMode !== isDark;
      this._lastDarkMode = isDark;

      if (forceRecreate) {
          if (this.chartInstance) { this.chartInstance.destroy(); this.chartInstance = null; }
          if (this.doughnutChartInstance) { this.doughnutChartInstance.destroy(); this.doughnutChartInstance = null; }
      }

      if (!this.chartInstance || !this.doughnutChartInstance) {
          const existingChart = Chart.getChart(canvas);
          if (existingChart) existingChart.destroy();
          const existingDChart = Chart.getChart(dCanvas);
          if (existingDChart) existingDChart.destroy();
      }

      const ctx = canvas.getContext('2d');
      const dCtx = dCanvas.getContext('2d');
      if (!ctx || !dCtx) return;

      // Dark Mode adaptation colors
      const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
      const tooltipBg = isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)';
      const tooltipTitleColor = isDark ? '#f8fafc' : '#0f172a';
      const tooltipBodyColor = isDark ? '#cbd5e1' : '#334155';
      const tooltipBorderColor = isDark ? '#334155' : '#e2e8f0';
      
      const barGradient = ctx.createLinearGradient(0, 0, 0, 400);
      barGradient.addColorStop(0, isDark ? '#818cf8' : '#6366f1'); 
      barGradient.addColorStop(1, isDark ? '#4f46e5' : '#4338ca');

      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, isDark ? 'rgba(99, 102, 241, 0.25)' : 'rgba(99, 102, 241, 0.2)'); 
      gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');

      let startStr = this.startDate();
      let endStr = this.endDate();
      if (!startStr || !endStr) {
          const history = this._parsedRequests();
          if (history.length > 0) {
              startStr = this.getLocalYYYYMMDD(history[history.length - 1]._date);
          } else {
              const t = new Date();
              t.setDate(t.getDate() - 30);
              startStr = this.getLocalYYYYMMDD(t);
          }
          endStr = this.getLocalYYYYMMDD(new Date());
          
          const tempStart = new Date(startStr);
          const tempEnd = new Date(endStr);
          const diffDays = Math.round(Math.abs(tempEnd.getTime() - tempStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
          if (diffDays > 90) {
             const t = new Date(tempEnd);
             t.setDate(t.getDate() - 89);
             startStr = this.getLocalYYYYMMDD(t);
          }
      }

      const start = new Date(startStr); start.setHours(0,0,0,0);
      const end = new Date(endStr); end.setHours(23,59,59,999);
      
      const origStart = new Date(start);
      const origEnd = new Date(end);

      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
      
      let chartStart = new Date(start);
      let chartEnd = new Date(end);
      let chartDays = diffDays;
      
      const labels = [];
      const sampleData = new Array(chartDays).fill(0);
      const runData = new Array(chartDays).fill(0);
      const dailyDetails: Record<string, number>[] = new Array(chartDays).fill(null).map(() => ({}));
      const dateMap = new Map<string, number>();
      
      for (let i = 0; i < chartDays; i++) {
          const d = new Date(chartStart); d.setDate(d.getDate() + i);
          
          // Format label: 'T2 15/3'
          const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
          const dayName = days[d.getDay()];
          const key = `${d.getDate()}/${d.getMonth() + 1}`;
          
          labels.push(key); 
          // Use a consistent key for mapping data
          const mapKey = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
          dateMap.set(mapKey, i);
      }

      const sopCounts = new Map<string, number>();

      const history = this._parsedRequests();
      const filter = this.selectedSopFilter();

      history.forEach(req => {
          const d = req._date;
          
          // Only count data within the chart's display range
          if (d >= chartStart && d <= chartEnd) {
              const mapKey = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
              const idx = dateMap.get(mapKey);
              if (idx !== undefined) {
                  // 1. SOP Distribution (always computed globally for the selected range to serve as selector legend)
                  if (d >= origStart && d <= origEnd) {
                      const sopName = req.sopName || 'Unknown';
                      let samples = 0;
                      if (req.sampleList && req.sampleList.length > 0) samples = req.sampleList.length;
                      else if (req.inputs?.['n_sample']) samples = Number(req.inputs['n_sample']);
                      else samples = 1;
                      sopCounts.set(sopName, (sopCounts.get(sopName) || 0) + samples);
                  }

                  // 2. Line/Bar Data (filtered by selectedSopFilter)
                  if (!filter || req.sopName === filter) {
                      runData[idx]++;
                      let samples = 0;
                      if (req.sampleList && req.sampleList.length > 0) samples = req.sampleList.length;
                      else if (req.inputs?.['n_sample']) samples = Number(req.inputs['n_sample']);
                      else samples = 1;
                      sampleData[idx] += samples; 
                      
                      // Daily details
                      const sopName = req.sopName || 'Unknown';
                      dailyDetails[idx][sopName] = (dailyDetails[idx][sopName] || 0) + samples;
                  }
              }
          }
      });

      // Line Chart
      if (this.chartInstance) {
          // Update existing chart
          this.chartInstance.data.labels = labels;
          this.chartInstance.data.datasets[0].data = sampleData;
          this.chartInstance.data.datasets[1].data = runData;
          
          // Update the tooltip callback closure reference
          this.chartInstance.options.plugins.tooltip.callbacks.afterBody = (context: any) => {
              const index = context[0].dataIndex;
              const details = dailyDetails[index];
              if (!details || Object.keys(details).length === 0) return '';
              let text = '\nChi tiết mẫu theo SOP:';
              for (const [sop, count] of Object.entries(details)) {
                  text += `\n- ${sop}: ${count} mẫu`;
              }
              return text;
          };
          this.chartInstance.update('active');
      } else {
          // Initialize chart
          this.chartInstance = new Chart(ctx, {
              type: 'line',
              data: {
                  labels: labels,
                  datasets: [
                      { 
                          label: 'Số mẫu', data: sampleData, backgroundColor: gradient, borderColor: '#6366f1', borderWidth: 3, 
                          pointRadius: 4, pointBackgroundColor: '#6366f1', pointBorderColor: '#fff', pointHoverRadius: 6, fill: true, tension: 0.4, yAxisID: 'y'
                      },
                      { 
                          label: 'Số mẻ', data: runData, type: 'bar', backgroundColor: barGradient, borderRadius: 6, barThickness: 12, borderSkipped: false, order: 1, yAxisID: 'y1' 
                      }
                  ]
              },
              options: { 
                  responsive: true, maintainAspectRatio: false, 
                  layout: {
                      padding: {
                          top: 10,
                          bottom: 15,
                          left: 10,
                          right: 15
                      }
                  },
                  plugins: { 
                      legend: { display: false }, 
                      tooltip: { 
                          backgroundColor: tooltipBg, 
                          titleColor: tooltipTitleColor, 
                          bodyColor: tooltipBodyColor, 
                          borderColor: tooltipBorderColor, 
                          borderWidth: 1, 
                          padding: 12,
                          cornerRadius: 8,
                          titleFont: { size: 13, family: "'Inter', 'Open Sans', sans-serif" },
                          bodyFont: { size: 12, family: "'Inter', 'Open Sans', sans-serif" },
                          displayColors: true, 
                          usePointStyle: true,
                          callbacks: {
                              afterBody: (context: any) => {
                                  const index = context[0].dataIndex;
                                  const details = dailyDetails[index];
                                  if (!details || Object.keys(details).length === 0) return '';
                                  let text = '\nChi tiết mẫu theo SOP:';
                                  for (const [sop, count] of Object.entries(details)) {
                                      text += `\n- ${sop}: ${count} mẫu`;
                                  }
                                  return text;
                              }
                          }
                      } 
                  }, 
                  interaction: { mode: 'index', intersect: false },
                  scales: { 
                      x: { 
                          display: true,
                          grid: { display: false }, 
                          border: { display: false }, 
                          ticks: { 
                              display: true,
                              font: { size: 10, family: "'Open Sans', sans-serif" }, 
                              color: '#94a3b8' 
                          } 
                      }, 
                      y: { type: 'linear', display: true, position: 'left', beginAtZero: true, grid: { tickBorderDash: [5, 5], color: gridColor }, border: { display: false }, ticks: { font: { size: 10, family: "'Open Sans', sans-serif" }, color: '#94a3b8', maxTicksLimit: 5 } }, 
                      y1: { type: 'linear', display: true, position: 'right', beginAtZero: true, grid: { display: false }, border: { display: false }, ticks: { display: false } } 
                  } 
              }
          });
      }

      // Doughnut Chart & Custom Legend calculation
      const sopLabels = Array.from(sopCounts.keys());
      const sopData = Array.from(sopCounts.values());
      // Modern Tailwind color palette
      const bgColors = ['#6366f1', '#3b82f6', '#0ea5e9', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#ec4899'];

      const totalSopSamples = sopData.reduce((a, b) => a + b, 0);
      const dist = sopLabels.map((name, i) => {
          const count = sopData[i];
          const percent = totalSopSamples > 0 ? Math.round((count / totalSopSamples) * 100) : 0;
          const color = bgColors[i % bgColors.length];
          return { name, count, percent, color };
      });
      dist.sort((a, b) => b.count - a.count);
      this.sopDistribution.set(dist);

      if (this.doughnutChartInstance) {
          this.doughnutChartInstance.data.labels = sopLabels;
          this.doughnutChartInstance.data.datasets[0].data = sopData;
          this.doughnutChartInstance.data.datasets[0].backgroundColor = bgColors.slice(0, sopLabels.length);
          this.doughnutChartInstance.update('active');
      } else {
          this.doughnutChartInstance = new Chart(dCtx, {
              type: 'doughnut',
              data: {
                  labels: sopLabels,
                  datasets: [{
                      data: sopData,
                      backgroundColor: bgColors.slice(0, sopLabels.length),
                      borderWidth: 0,
                      hoverOffset: 8
                  }]
              },
              options: {
                  responsive: true, maintainAspectRatio: false,
                  cutout: '70%',
                  onClick: (event, elements, chart) => {
                      if (elements && elements.length > 0) {
                          const index = elements[0].index;
                          const label = chart.data.labels?.[index] as string;
                          this.toggleSopFilter(label);
                      }
                  },
                  plugins: {
                      legend: { display: false },
                      tooltip: { 
                          backgroundColor: tooltipBg, 
                          titleColor: tooltipTitleColor, 
                          bodyColor: tooltipBodyColor, 
                          borderColor: tooltipBorderColor, 
                          borderWidth: 1, 
                          padding: 10, 
                          cornerRadius: 8,
                          titleFont: { size: 13, family: "'Inter', 'Open Sans', sans-serif" },
                          bodyFont: { size: 12, family: "'Inter', 'Open Sans', sans-serif" },
                          displayColors: false, 
                          usePointStyle: true,
                          callbacks: {
                              title: () => '',
                              label: (context: any) => {
                                  const value = context.raw || 0;
                                  const total = context.chart._metasets[context.datasetIndex].total;
                                  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                                  return `${value} mẫu (${percentage}%)`;
                              }
                          }
                      }
                  }
              }
          });
      }
  }

  processPriorityStandard(std: ReferenceStandard | null) {
      if (!std || !std.expiry_date) { this.priorityStandard.set(null); return; }
      const expiry = new Date(std.expiry_date); const today = new Date();
      const diffMs = expiry.getTime() - today.getTime();
      const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      let status: 'expired' | 'warning' | 'safe';
      if (daysLeft < 0) status = 'expired'; else if (daysLeft < 60) status = 'warning'; else status = 'safe';
      this.priorityStandard.set({ name: std.name, daysLeft, date: std.expiry_date, status });
  }


  denyAccess() { this.toast.show('Bạn không có quyền truy cập chức năng này!', 'error'); }

  handlePendingRequestsClick() {
      if (!this.auth.canViewSop() && !this.auth.canViewStandards()) return;
      
      const counts = this.pendingCounts();

      if (counts.sop > 0 && counts.std > 0) {
          this.showPendingRequestsPopover.update(v => !v);
      } else if (counts.sop > 0 && this.auth.canViewSop()) {
          this.navTo('requests');
      } else if (counts.std > 0 && this.auth.canViewStandards()) {
          this.navTo('standard-requests');
      } else if (this.auth.canViewSop()) {
          this.navTo('requests');
      } else if (this.auth.canViewStandards()) {
          this.navTo('standard-requests');
      }
  }

  getTimeDiff(timestamp: any): string {
      if (!timestamp) return '';
      const date = (timestamp as any).toDate ? (timestamp as any).toDate() : new Date(timestamp);
      const now = new Date(); const diffMs = now.getTime() - date.getTime(); const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Vừa xong'; if (diffMins < 60) return `${diffMins} phút trước`;
      const diffHours = Math.floor(diffMins / 60); if (diffHours < 24) return `${diffHours} giờ trước`;
      return `${Math.floor(diffHours / 24)} ngày trước`;
  }
  
  getLogActionText(action: string): string {
      if (this._actionTextMap[action]) return this._actionTextMap[action];
      
      if (action.includes('APPROVE')) return 'đã duyệt yêu cầu'; 
      if (action.includes('STOCK_IN')) return 'đã nhập kho';
      if (action.includes('STOCK_OUT')) return 'đã xuất kho'; 
      if (action.includes('CREATE')) return 'đã tạo mới';
      if (action.includes('DELETE')) return 'đã xóa'; 
      return 'đã cập nhật';
  }
}
