
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
    status: 'expired' | 'warning' | 'safe';
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

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SkeletonComponent, FormsModule, DateRangeFilterComponent], 
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
  lowStockItems = signal<InventoryItem[]>([]); 
  priorityStandard = signal<PriorityStandard | null>(null);
  userPhotoMap = signal<Record<string, string>>({});
  
  // Date Filters
  startDate = signal<string>(this.getThisWeekStart());
  endDate = signal<string>(this.getToday());

  // Custom SOP distribution list for charts legend
  sopDistribution = signal<{ name: string, count: number, percent: number, color: string }[]>([]);

  // Modal State
  selectedSopDetails = signal<KanbanColumn | null>(null);

  // Active SOP Filter
  selectedSopFilter = signal<string | null>(null);

  // LIVE DATA COMPUTED
  // Phân nhánh logic đếm theo từng quyền cụ thể:
  // - canApprove (SOP): đếm SOP requests đang pending
  // - canApproveStandards: đếm Standard requests cần action (PENDING_APPROVAL + PENDING_RETURN)
  // - User thường: chỉ đếm request CỦA CHÍNH MÌNH đang ở trạng thái PENDING_APPROVAL
  totalPendingRequests = computed(() => {
      const uid = this.auth.currentUser()?.uid;
      const canApproveSop = this.auth.canApprove();
      const canApproveStd = this.auth.canApproveStandards();

      // Approver — tính từng phần theo quyền tương ứng
      if (canApproveSop || canApproveStd) {
          let count = 0;

          // SOP: state.requests() đã được Firestore query chỉ lấy status='pending'
          // => toàn bộ đều cần duyệt, không cần filter thêm
          if (canApproveSop) {
              count += this.state.requests().length;
          }

          // Standard: phân biệt 2 loại cần hành động
          // - PENDING_APPROVAL: Manager cần phê duyệt cho mượn
          // - PENDING_RETURN: Manager cần xác nhận nhận lại chuẩn
          if (canApproveStd) {
              count += this.state.standardRequests()
                  .filter(r => r.status === 'PENDING_APPROVAL' || r.status === 'PENDING_RETURN').length;
          }

          return count;
      }

      if (!uid) return 0;

      // User thường: chỉ đếm request CỦA CHÍNH MÌNH đang chờ duyệt (PENDING_APPROVAL)
      // state.requests() chứa TẤT CẢ pending SOP của mọi người → phải filter theo tên
      const myPendingSopReqs = this.state.requests()
          .filter(r => r.user === this.auth.currentUser()?.displayName).length;
      // state.standardRequests() đã được filter theo requestedBy=uid ở Firestore
      // nhưng bao gồm IN_PROGRESS + PENDING_RETURN → chỉ lấy PENDING_APPROVAL
      const myPendingStdReqs = this.state.standardRequests()
          .filter(r => r.status === 'PENDING_APPROVAL').length;
      return myPendingSopReqs + myPendingStdReqs;
  });
  recentLogs = computed(() => this.state.logs().slice(0, 12)); 
  todayActivityCount = computed(() => {
      const todayStr = new Date().toISOString().split('T')[0];
      return this.state.logs().filter(l => {
          const d = l.timestamp?.toDate ? l.timestamp.toDate() : new Date(l.timestamp);
          return d.toISOString().split('T')[0] === todayStr;
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

  // TREND INDICATOR (Dynamic Comparison based on Date Filter)
  trendInfo = computed(() => {
      let history = this.state.approvedRequests().filter(r => !r.isVirtualMaster);
      const filter = this.selectedSopFilter();
      if (filter) {
          history = history.filter(r => r.sopName === filter);
      }
      
      const currentStart = new Date(this.startDate()); currentStart.setHours(0,0,0,0);
      const currentEnd = new Date(this.endDate()); currentEnd.setHours(23,59,59,999);
      
      const diffTime = Math.abs(currentEnd.getTime() - currentStart.getTime());
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;

      // Calculate current total
      let currentTotal = 0;
      const tCurrStart = currentStart.getTime();
      const tCurrEnd = currentEnd.getTime();

      history.forEach(req => {
          const timestamp = this.parseRequestDate(req).getTime();
          if (timestamp >= tCurrStart && timestamp <= tCurrEnd) {
              let count = 1;
              if (req.sampleList && req.sampleList.length > 0) count = req.sampleList.length;
              else if (req.inputs?.['n_sample']) count = Number(req.inputs['n_sample']);
              currentTotal += count;
          }
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
          const timestamp = this.parseRequestDate(req).getTime();
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
      const approvedReqs = this.state.approvedRequests().filter(r => !r.isVirtualMaster);
      const groups = new Map<string, KanbanColumn>();
      
      const start = new Date(this.startDate()); start.setHours(0,0,0,0);
      const end = new Date(this.endDate()); end.setHours(23,59,59,999);

      approvedReqs.forEach(req => {
          const d = this.parseRequestDate(req);
          
          if (d < start || d > end) return;

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
      const start = new Date(this.startDate()); start.setHours(0,0,0,0);
      const end = new Date(this.endDate()); end.setHours(23,59,59,999);
      let history = this.state.approvedRequests().filter(r => !r.isVirtualMaster);
      
      const filter = this.selectedSopFilter();
      if (filter) {
          history = history.filter(req => req.sopName === filter);
      }
      
      let totalSamples = 0;
      let totalBatches = 0;

      history.forEach(req => {
          const d = this.parseRequestDate(req);
          
          if (d >= start && d <= end) {
              totalBatches++;
              let samples = 0;
              if (req.sampleList && req.sampleList.length > 0) samples = req.sampleList.length;
              else if (req.inputs?.['n_sample']) samples = Number(req.inputs['n_sample']);
              else samples = 1;
              totalSamples += samples;
          }
      });

      const avgSamplesPerBatch = totalBatches > 0 ? (totalSamples / totalBatches).toFixed(1) : '0';
      
      return { totalSamples, totalBatches, avgSamplesPerBatch };
  });

  today = new Date();
  chartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('activityChart');
  doughnutChartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('doughnutChart');
  chartInstance: any = null;
  doughnutChartInstance: any = null;

  constructor() {
      effect(() => {
          const reqs = this.state.approvedRequests();
          const start = this.startDate();
          const end = this.endDate();
          const filter = this.selectedSopFilter();
          const isDark = this.state.darkMode();
          if (reqs.length >= 0 && !this.isLoading()) {
              setTimeout(() => this.initChart(), 300);
          }
      });
  }

  async ngOnInit() {
      this.isLoading.set(true);
      
      // 1. Tải danh sách tồn kho thấp
      try {
          if (this.auth.hasPermission('inventory_view')) {
              const lowStock = await this.invService.getLowStockItems(5);
              this.lowStockItems.set(lowStock);
          }
      } catch (e) {
          console.warn("Dashboard: Lỗi khi tải danh sách tồn kho thấp:", e);
      }

      // 2. Tải thông tin chuẩn sắp hết hạn
      try {
          const nearestStd = await this.stdService.getNearestExpiry();
          this.processPriorityStandard(nearestStd);
      } catch (e) {
          console.warn("Dashboard: Lỗi khi tải thông tin chất chuẩn sắp hết hạn:", e);
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
      let photoUrl = name ? this.userPhotoMap()[name] : undefined;
      if (name === this.auth.currentUser()?.displayName && this.auth.currentUser()?.photoURL) {
          photoUrl = this.auth.currentUser()?.photoURL;
      }
      return this.getAvatarUrl(name, this.state.avatarStyle(), photoUrl);
  }

  ngOnDestroy(): void {
      if (this.chartInstance) {
          this.chartInstance.destroy();
          this.chartInstance = null;
      }
      if (this.doughnutChartInstance) {
          this.doughnutChartInstance.destroy();
          this.doughnutChartInstance = null;
      }
  }

  private getToday(): string { return new Date().toISOString().split('T')[0]; }
  private getFirstDayOfMonth(): string { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0]; }
  private getThisWeekStart(): string {
      const today = new Date();
      const day = today.getDay();
      const diffToMon = today.getDate() - day + (day === 0 ? -6 : 1);
      const start = new Date(today);
      start.setDate(diffToMon);
      return start.toISOString().split('T')[0];
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

      const existingChart = Chart.getChart(canvas);
      if (existingChart) existingChart.destroy();
      const existingDChart = Chart.getChart(dCanvas);
      if (existingDChart) existingDChart.destroy();

      if (this.chartInstance) { this.chartInstance.destroy(); this.chartInstance = null; }
      if (this.doughnutChartInstance) { this.doughnutChartInstance.destroy(); this.doughnutChartInstance = null; }

      const ctx = canvas.getContext('2d');
      const dCtx = dCanvas.getContext('2d');
      if (!ctx || !dCtx) return;

      // Dark Mode adaptation colors
      const isDark = this.state.darkMode();
      const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : '#f1f5f9';
      const tooltipBg = isDark ? '#1e293b' : '#fff';
      const tooltipTitleColor = isDark ? '#f1f5f9' : '#1e293b';
      const tooltipBodyColor = isDark ? '#cbd5e1' : '#1e293b';
      const tooltipBorderColor = isDark ? '#334155' : '#e2e8f0';
      const barBg = isDark ? '#3b82f6' : '#3a416f';

      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, 'rgba(203, 12, 159, 0.2)'); 
      gradient.addColorStop(1, 'rgba(203, 12, 159, 0)');

      const start = new Date(this.startDate()); start.setHours(0,0,0,0);
      const end = new Date(this.endDate()); end.setHours(23,59,59,999);
      
      const origStart = new Date(start);
      const origEnd = new Date(end);

      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
      
      let chartStart = new Date(start);
      let chartEnd = new Date(end);
      let chartDays = diffDays;

      // If selected range is <= 7 days, force chart to show Monday-Sunday of that week
      if (diffDays <= 7) {
          const dayOfWeek = start.getDay(); // 0 is Sunday, 1 is Monday
          const diffToMonday = start.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
          chartStart = new Date(start.setDate(diffToMonday));
          chartStart.setHours(0,0,0,0);
          
          chartEnd = new Date(chartStart);
          chartEnd.setDate(chartStart.getDate() + 6);
          chartEnd.setHours(23,59,59,999);
          
          chartDays = 7;
      }
      
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
          const key = diffDays <= 7 ? `${dayName} ${d.getDate()}/${d.getMonth() + 1}` : `${d.getDate()}/${d.getMonth() + 1}`;
          
          labels.push(key); 
          // Use a consistent key for mapping data
          const mapKey = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
          dateMap.set(mapKey, i);
      }

      const sopCounts = new Map<string, number>();

      const history = this.state.approvedRequests().filter(r => !r.isVirtualMaster);
      const filter = this.selectedSopFilter();

      history.forEach(req => {
          const d = this.parseRequestDate(req);
          
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
      this.chartInstance = new Chart(ctx, {
          type: 'line',
          data: {
              labels: labels,
              datasets: [
                  { 
                      label: 'Số mẫu', data: sampleData, backgroundColor: gradient, borderColor: '#cb0c9f', borderWidth: 3, 
                      pointRadius: 4, pointBackgroundColor: '#cb0c9f', pointBorderColor: '#fff', pointHoverRadius: 6, fill: true, tension: 0.4, yAxisID: 'y'
                  },
                  { 
                      label: 'Số mẻ', data: runData, type: 'bar', backgroundColor: barBg, borderRadius: 4, barThickness: 10, order: 1, yAxisID: 'y1' 
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
                      padding: 10, 
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

      // Doughnut Chart & Custom Legend calculation
      const sopLabels = Array.from(sopCounts.keys());
      const sopData = Array.from(sopCounts.values());
      const bgColors = ['#cb0c9f', '#3a416f', '#17c1e8', '#82d616', '#ea0606', '#ff9800', '#9c27b0', '#00bcd4'];

      const totalSopSamples = sopData.reduce((a, b) => a + b, 0);
      const dist = sopLabels.map((name, i) => {
          const count = sopData[i];
          const percent = totalSopSamples > 0 ? Math.round((count / totalSopSamples) * 100) : 0;
          const color = bgColors[i % bgColors.length];
          return { name, count, percent, color };
      });
      dist.sort((a, b) => b.count - a.count);
      this.sopDistribution.set(dist);

      this.doughnutChartInstance = new Chart(dCtx, {
          type: 'doughnut',
          data: {
              labels: sopLabels,
              datasets: [{
                  data: sopData,
                  backgroundColor: bgColors.slice(0, sopLabels.length),
                  borderWidth: 0,
                  hoverOffset: 4
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
                      padding: 6, 
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
      
      const pendingSop = this.state.requests().length;
      const pendingStandard = this.state.standardRequests().length;

      if (pendingSop === 0 && pendingStandard > 0 && this.auth.canViewStandards()) {
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
      if (action === 'CREATE_VIRTUAL_MASTER') return 'đã tạo mẻ master ảo';
      if (action === 'SAVE_RESULT_DRAFT') return 'đã lưu nháp kết quả';
      if (action === 'PUBLISH_RESULT_REPORT') return 'đã xuất bản báo cáo';
      if (action === 'REVERT_RESULT_DRAFT') return 'đã hủy xuất bản báo cáo';
      if (action === 'RESET_RESULT_DATA') return 'đã reset số liệu kết quả';
      if (action === 'RESTORE_RESULT_BACKUP') return 'đã khôi phục số liệu lưu trữ';
      if (action === 'RESTORE_RESULT_VERSION') return 'đã khôi phục phiên bản cũ';
      if (action === 'DIRECT_APPROVE') return 'đã duyệt trực tiếp SOP';
      if (action === 'EDIT_REQUEST') return 'đã chỉnh sửa phiếu yêu cầu';

      if (action === 'REQUEST_STANDARD' || action === 'CREATE_STANDARD_REQUEST') return 'đã yêu cầu mượn chuẩn';
      if (action === 'APPROVE_STANDARD_REQUEST') return 'đã duyệt mượn chuẩn';
      if (action === 'REJECT_STANDARD_REQUEST') return 'đã từ chối mượn chuẩn';
      if (action === 'REPORT_RETURN_STANDARD') return 'đã báo cáo trả chuẩn';
      if (action === 'RETURN_STANDARD') return 'đã nhận lại chuẩn';
      if (action === 'ASSIGN_STANDARD') return 'đã gán chuẩn cho mượn';
      
      if (action.includes('APPROVE')) return 'đã duyệt yêu cầu'; 
      if (action.includes('STOCK_IN')) return 'đã nhập kho';
      if (action.includes('STOCK_OUT')) return 'đã xuất kho'; 
      if (action.includes('CREATE')) return 'đã tạo mới';
      if (action.includes('DELETE')) return 'đã xóa'; 
      return 'đã cập nhật';
  }
}
