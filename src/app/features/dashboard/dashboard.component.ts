import { AfterViewInit, ChangeDetectionStrategy, Component, inject, computed, signal, OnInit, viewChild, ElementRef, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { StateService } from '../../core/services/state.service';
import { AuthService } from '../../core/services/auth.service';
import { StatsService, MonthlyStatsDoc } from '../../core/services/stats.service';
import { InventoryService } from '../inventory/inventory.service';
import { StandardService } from '../standards/standard.service'; 
import { ReferenceStandard } from '../../core/models/standard.model';
import { QrGlobalService } from '../../core/services/qr-global.service'; // Import Global Service
import { formatNum, getAvatarUrl } from '../../shared/utils/utils';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { DateRangeFilterComponent } from '../../shared/components/date-range-filter/date-range-filter.component';
import { AppButtonComponent, AppEmptyStateComponent, AppPageHeaderComponent, AppToolbarComponent } from '../../shared/components/ui';
import { timestampToDate, timestampToLocalDateKey } from '../../shared/utils/timestamp';
import { ActivityFeedService } from '../../core/services/activity-feed.service';
import {
  filterActivityFeedEvents,
  getActivityActionLabel,
  getActivityAggregationLabel,
  getActivityModuleLabel,
  isActivityEventNewSince,
  resolveActivityTraceabilityUrl,
  type ActivityFeedModuleFilter
} from '../../core/activity/activity-feed.utils';
import { getActivityActionDefinition, isRegisteredActivityAction } from '../../core/activity/activity-event-registry';
import {
  createInclusiveDateRange,
  enumerateInclusiveDates,
  getDateBoundsFromMonthlyStats,
  InclusiveDateRange,
  toLocalDateKey
} from '../../shared/utils/date-range';

interface PriorityStandard {
    name: string;
    daysLeft: number;
    date: string;
    status: 'expired' | 'warning' | 'safe' | 'error';
}

import { DailyChecklistComponent } from '../checklist/daily-checklist.component';
import { ChangelogService } from '../../core/services/changelog.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    SkeletonComponent,
    FormsModule,
    DateRangeFilterComponent,
    DailyChecklistComponent,
    AppButtonComponent,
    AppEmptyStateComponent,
    AppPageHeaderComponent,
    AppToolbarComponent,
  ],
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  state = inject(StateService);
  invService = inject(InventoryService); 
  stdService = inject(StandardService);
  auth = inject(AuthService); 
  router: Router = inject(Router);
  qrService = inject(QrGlobalService);
  changelogService = inject(ChangelogService);
  statsService = inject(StatsService);
  activityFeed = inject(ActivityFeedService);

  statsData = signal<Record<string, MonthlyStatsDoc>>({});

  // Helper function to extract stats for a specific day
  private getDayStats(d: Date): { totalSamples: number, totalBatches: number, totalQcs: number, sops: Record<string, { samples: number, batches: number, qcs: number }> } {
      const y = d.getFullYear();
      const mStr = String(d.getMonth() + 1).padStart(2, '0');
      const dStr = String(d.getDate()).padStart(2, '0');
      const monthKey = `${y}-${mStr}`;
      const dayKey = `${y}-${mStr}-${dStr}`;
      
      const stats = this.statsData()[monthKey];
      if (stats && stats[dayKey]) return stats[dayKey];
      return { totalSamples: 0, totalBatches: 0, totalQcs: 0, sops: {} };
  }

  formatNum = formatNum;
  getAvatarUrl = getAvatarUrl;

  isLoading = signal(true);
  lowStockItems = computed(() => {
      return this.state.inventory().filter(i => i.stock <= (i.threshold || 5));
  });
  priorityStandard = signal<PriorityStandard | null>(null);
  
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
  logFilterCategory = signal<ActivityFeedModuleFilter>('ALL');
  importantActivityOnly = signal(false);
  activityFeedV2Enabled = computed(() => this.state.activityFeedV2());
  activityFeedDenied = computed(() => this.activityFeedV2Enabled() && this.activityFeed.status() === 'denied');
  activityFeedLoading = computed(() => this.activityFeedV2Enabled() && this.activityFeed.status() === 'loading');
  activityFeedError = computed(() => this.activityFeedV2Enabled() && this.activityFeed.status() === 'error');
  activityFilterOptions = computed<ActivityFeedModuleFilter[]>(() => {
      const options: ActivityFeedModuleFilter[] = ['ALL', 'RESULT', 'INVENTORY', 'STANDARD'];
      const canViewSystem = this.activityFeed.allowedAudiences().includes('SYSTEM_ADMIN');
      if (canViewSystem) options.push('SYSTEM');
      return options;
  });

  recentLogsGrouped = computed(() => {
      const logs = filterActivityFeedEvents(
          this.activityFeed.events(),
          this.logSearchTerm(),
          this.logFilterCategory(),
          this.importantActivityOnly(),
          50
      );

      const previousLastSeenAt = this.activityFeed.lastActivitySeenAt();
      let newDividerPlaced = false;
      const displayLogs = logs.map(log => {
          const showNewDivider = !newDividerPlaced
              && previousLastSeenAt !== null
              && isActivityEventNewSince(log as any, previousLastSeenAt);
          if (showNewDivider) newDividerPlaced = true;
          return { ...log, showNewDivider };
      });

      // Group by Date
      const groups = new Map<string, any[]>();
      displayLogs.forEach(l => {
          const d = timestampToDate(l.timestamp);
          const dateStr = d ? this.formatDateStr(d) : 'Không rõ thời gian';
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
      if (!isRegisteredActivityAction(action)) {
          return { icon: 'fa-bolt', bg: 'bg-gray-100 dark:bg-slate-700', text: 'text-gray-600 dark:text-gray-300' };
      }

      const definition = getActivityActionDefinition(action);
      if (definition.importance === 'WARNING') {
          return {
              icon: `fa-${definition.iconKey}`,
              bg: 'bg-amber-100 dark:bg-amber-900/30',
              text: 'text-amber-600 dark:text-amber-400'
          };
      }
      if (definition.importance === 'IMPORTANT') {
          return {
              icon: `fa-${definition.iconKey}`,
              bg: 'bg-fuchsia-100 dark:bg-fuchsia-900/30',
              text: 'text-fuchsia-600 dark:text-fuchsia-400'
          };
      }

      const palette = {
          RESULT: ['bg-cyan-100 dark:bg-cyan-900/30', 'text-cyan-600 dark:text-cyan-400'],
          INVENTORY: ['bg-blue-100 dark:bg-blue-900/30', 'text-blue-600 dark:text-blue-400'],
          STANDARD: ['bg-orange-100 dark:bg-orange-900/30', 'text-orange-600 dark:text-orange-400'],
          SYSTEM: ['bg-violet-100 dark:bg-violet-900/30', 'text-violet-600 dark:text-violet-400']
      } as const;
      const [bg, text] = palette[definition.module];
      return { icon: `fa-${definition.iconKey}`, bg, text };
  }

  private getLocalYYYYMMDD(d: Date): string {
      return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  private _todayStr = signal(this.getLocalYYYYMMDD(new Date()));
  private _todayRolloverTimer: ReturnType<typeof setTimeout> | null = null;

  todayActivityCount = computed(() => {
      const logs = this.activityFeed.events();

      return logs.filter(l => {
          return timestampToLocalDateKey(l.timestamp) === this._todayStr();
      }).length;
  });

  private getStatsDateBounds(): { start: string; end: string } | null {
      return getDateBoundsFromMonthlyStats(this.statsData());
  }

  private getActiveDateRange(): InclusiveDateRange {
      const explicitRange = createInclusiveDateRange(this.startDate(), this.endDate());
      if (explicitRange) return explicitRange;

      const allTimeBounds = this.getStatsDateBounds();
      if (allTimeBounds) {
          const allTimeRange = createInclusiveDateRange(allTimeBounds.start, allTimeBounds.end);
          if (allTimeRange) return allTimeRange;
      }

      const todayKey = toLocalDateKey(new Date());
      return createInclusiveDateRange(todayKey, todayKey)!;
  }

  private scheduleTodayRollover(): void {
      if (this._todayRolloverTimer) clearTimeout(this._todayRolloverTimer);
      const now = new Date();
      const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 50);
      this._todayRolloverTimer = setTimeout(() => {
          this._todayStr.set(this.getLocalYYYYMMDD(new Date()));
          this.scheduleTodayRollover();
      }, Math.max(1000, nextDay.getTime() - now.getTime()));
  }

  // TREND INDICATOR (Dynamic Comparison based on Date Filter)
  trendInfo = computed(() => {
      const filter = this.selectedSopFilter();
      const currentRange = this.getActiveDateRange();
      const currentDates = enumerateInclusiveDates(currentRange);

      // Calculate current total
      let currentTotal = 0;
      for (const d of currentDates) {
          const dayStats = this.getDayStats(d);
          
          if (filter) {
              const sopStats = dayStats.sops[filter];
              if (sopStats) currentTotal += sopStats.samples;
          } else {
              currentTotal += dayStats.totalSamples;
          }
      }

      const currentAvg = currentTotal / currentRange.days;

      // Historical period (Period-over-Period)
      const historyDays = currentRange.days;
      const historyEnd = new Date(currentRange.start); historyEnd.setDate(historyEnd.getDate() - 1); historyEnd.setHours(23,59,59,999);
      const historyStart = new Date(historyEnd); historyStart.setDate(historyStart.getDate() - historyDays + 1); historyStart.setHours(0,0,0,0);

      // Daily totals for history
      const dailyTotals = new Array(historyDays).fill(0);
      for (let i = 0; i < historyDays; i++) {
          const d = new Date(historyStart); d.setDate(d.getDate() + i);
          const dayStats = this.getDayStats(d);
          
          if (filter) {
              const sopStats = dayStats.sops[filter];
              if (sopStats) dailyTotals[i] = sopStats.samples;
          } else {
              dailyTotals[i] = dayStats.totalSamples;
          }
      }

      // Calculate Mean and StdDev
      const historyMean = dailyTotals.reduce((a, b) => a + b, 0) / historyDays;
      const variance = dailyTotals.reduce((a, b) => a + Math.pow(b - historyMean, 2), 0) / historyDays;
      const historyStdDev = Math.sqrt(variance);

      // Z-Score calculation (Applying Central Limit Theorem adjustment if historyDays > 1)
      const standardError = historyDays > 1 ? historyStdDev / Math.sqrt(historyDays) : historyStdDev;
      
      let zScore = 0;
      if (standardError > 0) {
          zScore = (currentAvg - historyMean) / standardError;
      } else {
          zScore = currentAvg > historyMean ? 1.1 : (currentAvg < historyMean ? -1.1 : 0);
      }
      
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

  chartKpis = computed(() => {
      const filter = this.selectedSopFilter();
      const currentRange = this.getActiveDateRange();

      let totalSamples = 0;
      let totalBatches = 0;

      for (const d of enumerateInclusiveDates(currentRange)) {
          const dayStats = this.getDayStats(d);
          
          if (filter) {
              const sopStats = dayStats.sops[filter];
              if (sopStats) {
                  totalSamples += sopStats.samples;
                  totalBatches += sopStats.batches;
              }
          } else {
              totalSamples += dayStats.totalSamples;
              totalBatches += dayStats.totalBatches;
          }
      }

      const avgSamplesPerBatch = totalBatches > 0 ? (totalSamples / totalBatches).toFixed(1) : '0';
      
      return { totalSamples, totalBatches, avgSamplesPerBatch };
  });

  today = new Date();
  chartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('activityChart');
  doughnutChartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('doughnutChart');
  activityFeedPanel = viewChild<ElementRef<HTMLElement>>('activityFeedPanel');
  chartInstance: any = null;
  doughnutChartInstance: any = null;
  
  private _chartDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  private _lastDarkMode: boolean | null = null;
  private chartLoader?: Promise<any>;
  private _allStatsLoaded = false;
  private activityFeedViewVisible = signal(false);
  private activityFeedViewRecorded = false;
  private activityFeedVisibilityObserver?: IntersectionObserver;

  constructor() {
      this.scheduleTodayRollover();

      effect(() => {
          // Read dependencies to track
          this.startDate();
          this.endDate();
          this.selectedSopFilter();
          this.state.darkMode();
          this.statsData();
          
          if (!this.isLoading()) {
              if (this._chartDebounceTimer) clearTimeout(this._chartDebounceTimer);
              this._chartDebounceTimer = setTimeout(() => this.initChart(), 300);
          }
      });

      // Fetch monthly aggregates for the selected inclusive range. All time
      // deliberately uses monthly_stats as the historical source of truth.
      effect(() => {
          const user = this.auth.currentUser();
          const canViewAnalytics = !!user && this.auth.canViewSop();
          const startStr = this.startDate();
          const endStr = this.endDate();

          // The dashboard analytics panel follows SOP operational access.
          // Do not fetch its monthly aggregates just to blur them underneath
          // the lock overlay.
          if (!canViewAnalytics) {
              this.statsData.set({});
              this._allStatsLoaded = false;
              return;
          }

          if (!startStr && !endStr) {
              if (this._allStatsLoaded) return;
              this._allStatsLoaded = true;
              this.statsService.getAllMonthlyStats().then(data => {
                  if (!this.auth.canViewSop()) return;
                  this.statsData.set(data);
              }).catch(e => {
                  this._allStatsLoaded = false;
                  console.error('Error fetching all-time stats:', e);
              });
              return;
          }

          const range = createInclusiveDateRange(startStr, endStr);
          if (!range) return;

          const monthsToFetch = new Set<string>();
          const historyStart = new Date(range.start);
          historyStart.setDate(historyStart.getDate() - range.days);
          historyStart.setDate(1);
          const monthCursor = new Date(historyStart);
          const rangeEnd = new Date(range.end);
          rangeEnd.setHours(0, 0, 0, 0);
          while (monthCursor <= rangeEnd) {
              monthsToFetch.add(`${monthCursor.getFullYear()}-${String(monthCursor.getMonth() + 1).padStart(2, '0')}`);
              monthCursor.setMonth(monthCursor.getMonth() + 1);
          }

          const cachedStats = this.statsData();
          const missingKeys = Array.from(monthsToFetch)
              .filter(key => !Object.prototype.hasOwnProperty.call(cachedStats, key));
          if (missingKeys.length === 0) return;

          this.statsService.getStatsForMonths(missingKeys).then(data => {
              if (!this.auth.canViewSop()) return;
              this.statsData.update(prev => ({ ...prev, ...data }));
          }).catch(e => console.error('Error fetching stats:', e));
      });

      effect(() => {
          const user = this.auth.currentUser();
          if (!user) {
              this.activityFeed.setEnabled(false);
              return;
          }
          this.activityFeed.setEnabled(this.activityFeedV2Enabled());
      });

      effect(() => {
          const options = this.activityFilterOptions();
          const selected = this.logFilterCategory();
          if (!options.includes(selected)) this.logFilterCategory.set('ALL');
      });

      effect(() => {
          const enabled = this.activityFeedV2Enabled();
          if (!enabled) {
              this.activityFeedViewRecorded = false;
              return;
          }
          if (!this.activityFeedViewVisible()
              || this.activityFeed.status() !== 'ready'
              || this.activityFeedViewRecorded) return;
          this.activityFeedViewRecorded = true;
          void this.activityFeed.recordDashboardView();
      });
  }

  async ngOnInit() {
      this.isLoading.set(true);

      // 2. Tải thông tin chuẩn sắp hết hạn
      try {
          if (this.auth.canViewStandards()) {
              const nearestStd = await this.stdService.getNearestExpiry();
              this.processPriorityStandard(nearestStd);
          } else {
              this.priorityStandard.set(null);
          }
      } catch (e) {
          console.warn("Dashboard: Lỗi khi tải thông tin chất chuẩn sắp hết hạn:", e);
          this.priorityStandard.set({ name: 'Lỗi kết nối / dữ liệu', daysLeft: 0, date: '', status: 'error' });
      }

      this.isLoading.set(false);
  }

  ngAfterViewInit(): void {
      const panel = this.activityFeedPanel()?.nativeElement;
      if (!panel || typeof IntersectionObserver !== 'function') {
          // Older embedded browsers do not expose IntersectionObserver. The
          // panel is rendered in the current view, so use the safe fallback.
          this.activityFeedViewVisible.set(true);
          return;
      }

      this.activityFeedVisibilityObserver = new IntersectionObserver(entries => {
          if (!entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= 0.25)) return;
          this.activityFeedViewVisible.set(true);
          this.activityFeedVisibilityObserver?.disconnect();
          this.activityFeedVisibilityObserver = undefined;
      }, { threshold: [0.25] });
      this.activityFeedVisibilityObserver.observe(panel);
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
      this.activityFeedVisibilityObserver?.disconnect();
      this.activityFeedVisibilityObserver = undefined;
      this.activityFeed.setEnabled(false);
      if (this._chartDebounceTimer) clearTimeout(this._chartDebounceTimer);
      if (this._todayRolloverTimer) clearTimeout(this._todayRolloverTimer);
      if (this.chartInstance) {
          this.chartInstance.destroy();
          this.chartInstance = null;
      }
      if (this.doughnutChartInstance) {
          this.doughnutChartInstance.destroy();
          this.doughnutChartInstance = null;
      }
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

  navToUrl(path: string | undefined): void {
      if (!path || !path.startsWith('/') || path.startsWith('//')) return;
      void this.router.navigateByUrl(path);
  }

  toggleImportantActivity(): void {
      this.importantActivityOnly.update(value => !value);
  }

  getActivityActorName(log: { actorName?: string; user?: string }): string {
      return log.actorName || log.user || 'Hệ thống';
  }

  getActivityTargetText(log: { targetName?: string; targetId?: string; requestId?: string }): string {
      return log.targetName || log.targetId || log.requestId || '';
  }

  getActivityAggregationText(log: { aggregationCount?: number }): string {
      return this.activityFeedV2Enabled() ? getActivityAggregationLabel(log as any) : '';
  }

  getActivityModuleText(module: unknown): string {
      return module === 'RESULT' || module === 'INVENTORY' || module === 'STANDARD' || module === 'SYSTEM'
          ? getActivityModuleLabel(module)
          : '';
  }

  getActivityTraceabilityUrl(log: { publicTraceable?: boolean; requestId?: string }): string | undefined {
      return resolveActivityTraceabilityUrl(log);
  }

  getActivityFilterLabel(filter: ActivityFeedModuleFilter): string {
      if (filter === 'ALL') return 'Tất cả';
      return getActivityModuleLabel(filter);
  }

  async initChart() {
      if (!this.auth.canViewSop()) return;
      const canvas = this.chartCanvas()?.nativeElement;
      const dCanvas = this.doughnutChartCanvas()?.nativeElement;
      if (!canvas || !dCanvas) return;
      const Chart = await this.loadChart();

      const isDark = this.state.darkMode();
      
      // Keep the canvas instances alive during theme changes. Recreating both
      // charts here caused a visible main-thread hitch on the dashboard.
      const themeChanged = this._lastDarkMode !== null && this._lastDarkMode !== isDark;
      this._lastDarkMode = isDark;

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

      const chartRange = this.getActiveDateRange();
      const chartDates = enumerateInclusiveDates(chartRange);
      const chartDays = chartRange.days;
      
      const labels = [];
      const sampleData = new Array(chartDays).fill(0);
      const runData = new Array(chartDays).fill(0);
      const dailyDetails: Record<string, number>[] = new Array(chartDays).fill(null).map(() => ({}));
      
      for (let i = 0; i < chartDays; i++) {
          const d = chartDates[i];
          
          // Format label: 'T2 15/3'
          const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
          const dayName = days[d.getDay()];
          const key = `${dayName} ${d.getDate()}/${d.getMonth() + 1}`;
          
          labels.push(key); 
      }

      const filter = this.selectedSopFilter();

      // MỚI: Loop over chart range instead of history array
      for (let i = 0; i < chartDays; i++) {
          const d = chartDates[i];
          const dayStats = this.getDayStats(d);
          
          if (filter) {
              const sopStats = dayStats.sops[filter];
              if (sopStats) {
                  runData[i] = sopStats.batches;
                  sampleData[i] = sopStats.samples;
                  dailyDetails[i][filter] = sopStats.samples;
              }
          } else {
              runData[i] = dayStats.totalBatches;
              sampleData[i] = dayStats.totalSamples;
              for (const [sop, counts] of Object.entries(dayStats.sops)) {
                  dailyDetails[i][sop] = counts.samples;
              }
          }
      }

      // 1. SOP Distribution (always computed globally for the selected range to serve as selector legend)
      const sopCounts = new Map<string, number>();
      for (const d of chartDates) {
          const dayStats = this.getDayStats(d);
          for (const [sop, counts] of Object.entries(dayStats.sops)) {
              sopCounts.set(sop, (sopCounts.get(sop) || 0) + counts.samples);
          }
      }

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
          Object.assign(this.chartInstance.options.plugins.tooltip, {
              backgroundColor: tooltipBg,
              titleColor: tooltipTitleColor,
              bodyColor: tooltipBodyColor,
              borderColor: tooltipBorderColor
          });
          this.chartInstance.options.scales.y.grid.color = gridColor;
          this.chartInstance.data.datasets[0].backgroundColor = gradient;
          this.chartInstance.data.datasets[1].backgroundColor = barGradient;
          this.chartInstance.update(themeChanged ? 'none' : 'active');
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
          Object.assign(this.doughnutChartInstance.options.plugins.tooltip, {
              backgroundColor: tooltipBg,
              titleColor: tooltipTitleColor,
              bodyColor: tooltipBodyColor,
              borderColor: tooltipBorderColor
          });
          this.doughnutChartInstance.update(themeChanged ? 'none' : 'active');
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
                  onClick: (event: any, elements: any[], chart: any) => {
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
      const date = timestampToDate(timestamp);
      if (!date) return '';
      const now = new Date(); const diffMs = now.getTime() - date.getTime(); const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Vừa xong'; if (diffMins < 60) return `${diffMins} phút trước`;
      const diffHours = Math.floor(diffMins / 60); if (diffHours < 24) return `${diffHours} giờ trước`;
      return `${Math.floor(diffHours / 24)} ngày trước`;
  }
  
  getLogActionText(action: string): string {
      return getActivityActionLabel(action);
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
