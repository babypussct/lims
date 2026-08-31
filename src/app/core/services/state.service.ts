import { Injectable, signal, computed, inject, effect, OnDestroy, Injector } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { AuthService } from './auth.service';
import {
  collection, onSnapshot, doc, getDoc, runTransaction,
  addDoc, updateDoc, query, orderBy, limit, where,
  serverTimestamp, increment, setDoc, getDocs, deleteDoc, deleteField,
  Unsubscribe, DocumentReference, writeBatch, QueryDocumentSnapshot,
  Query, QueryConstraint, QuerySnapshot, startAfter, documentId
} from 'firebase/firestore';
import { ToastService } from './toast.service';
import { ConfirmationService } from './confirmation.service';
import { CalculatorService } from './calculator.service';
import { buildScopedDeltaKey, DeltaSyncService, DeltaSyncConfig } from './delta-sync.service';
import { StatsService } from './stats.service';
import { FirestoreReadMonitor } from './firestore-read-monitor.service';
import { DailyChecklistMaterializerService } from './daily-checklist-materializer.service';

// Import Models
import { InventoryItem, StockHistoryItem } from '../models/inventory.model';
import { Sop, CalculatedItem, TargetGroup } from '../models/sop.model';
import { Request, RequestItem } from '../models/request.model';
import { Log, PrintData } from '../models/log.model';
import { PrintConfig, SafetyConfig, CategoryItem } from '../models/config.model';
import { ReferenceStandard, StandardRequest } from '../models/standard.model';
import { sanitizeForFirebase } from '../../shared/utils/utils';
import { timestampToMillis } from '../../shared/utils/timestamp';
import { TargetService } from '../../features/targets/target.service';
import { buildTargetScopeSnapshots } from '../../features/targets/target-scope-classifier';
import { getCanonicalId } from '../../features/results/shared/compound-id-resolver';
import { resolveMetadataSyncToast } from './notification-policy';
import { ActivityEventService } from './activity-event.service';
import { NotificationService } from './notification.service';
import { isFeatureEnabledForUser, normalizeFeatureCanaryUids } from './feature-rollout';

export interface DirectBatchPlanItem {
  sop: Sop;
  calculatedItems: CalculatedItem[];
  formInputs: any;
}

export interface DirectBatchPlanResult {
  requestId: string;
  printJobId: string;
  logId: string;
}

export interface ApprovedRequestsHistoryLoadResult {
  complete: boolean;
  loaded: number;
  reads: number;
}

export interface ReportCollectionLoadResult {
  complete: boolean;
  loaded: number;
  reads: number;
}

@Injectable({ providedIn: 'root' })
export class StateService implements OnDestroy {
  private fb = inject(FirebaseService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private confirmationService = inject(ConfirmationService);
  private injector = inject(Injector);
  private deltaSync = inject(DeltaSyncService);
  private targetService = inject(TargetService);
  private statsService = inject(StatsService);
  private readMonitor = inject(FirestoreReadMonitor);
  private dailyChecklistMaterializer = inject(DailyChecklistMaterializerService);
  private activityEvents = inject(ActivityEventService);
  private notificationInbox = inject(NotificationService);

  private listeners: Unsubscribe[] = [];
  private initGeneration = 0;
  private approvedRunsSub?: Unsubscribe;
  private usersInfoSub?: Unsubscribe;
  /** Singleton request listener — unregister callback (không hủy listener) */
  private _unregisterStdReqListener?: () => void;
  private activeInitScope: string | null | undefined;
  private readonly ON_DEMAND_CACHE_TTL_MS = 2 * 60 * 1000;
  private allStandardRequestsLoad?: Promise<ReportCollectionLoadResult>;
  private allStandardRequestsLoadedAt = 0;
  private referenceStandardsLoad?: Promise<ReportCollectionLoadResult>;
  private referenceStandardsLoadedAt = 0;
  private readonly APPROVED_REQUEST_RECENT_LIMIT = 300;
  private readonly APPROVED_REQUEST_HISTORY_PAGE_SIZE = 100;
  private readonly APPROVED_REQUEST_HISTORY_MAX_PAGES = 1000;
  private readonly REPORT_COLLECTION_PAGE_SIZE = 250;
  private readonly MAX_DIRECT_REQUEST_PAYLOAD_BYTES = 900_000;
  private approvedRecentRequests = new Map<string, Request>();
  private approvedHistoryRequests = new Map<string, Request>();
  private approvedHistoryLoads = new Map<string, Promise<ApprovedRequestsHistoryLoadResult>>();

  // --- DATA SIGNALS ---
  inventory = signal<InventoryItem[]>([]);
  inventoryMap = computed(() => {
    const map: Record<string, InventoryItem> = {};
    this.inventory().forEach(i => map[i.id] = i);
    return map;
  });

  sops = signal<Sop[]>([]);
  requests = signal<Request[]>([]);
  standards = signal<ReferenceStandard[]>([]);
  standardRequests = signal<StandardRequest[]>([]);
  allStandardRequests = signal<StandardRequest[]>([]);
  approvedRequests = signal<Request[]>([]);

  stats = signal<{ totalSopsRun: number; totalItemsUsed: number }>({ totalSopsRun: 0, totalItemsUsed: 0 });

  printConfig = signal<PrintConfig>({
    footerText: 'Cam kết sử dụng đúng mục đích.', showSignature: false
  });

  // NEW: Safety Configuration
  safetyConfig = signal<SafetyConfig>({
    defaultMargin: 10,
    rules: {}
  });

  // NEW: Categories
  categories = signal<CategoryItem[]>([
    { id: 'reagent', name: 'Hóa chất thông dụng' },
    { id: 'solvent', name: 'Dung môi (Solvent)' },
    { id: 'standard', name: 'Chất chuẩn (Standard)' },
    { id: 'consumable', name: 'Vật tư (Consumable)' },
    { id: 'kit', name: 'Kit xét nghiệm' }
  ]);

  categoriesMap = computed(() => {
    const map = new Map<string, string>();
    this.categories().forEach(c => map.set(c.id, c.name));
    return map;
  });

  // NEW: Avatar Style Preference (Default: bottts-neutral for modern look)
  avatarStyle = signal<string>('bottts-neutral');

  // NEW: Avatar Style Cache (maps displayName -> {avatarStyle, photoURL})
  usersInfoCache = signal<Map<string, {avatarStyle: string, photoURL: string}>>(new Map());

  systemVersion = signal<string>('v26.08.31-b03');
  maintenanceMode = signal<boolean>(false);
  maintenanceMessage = signal<string>('Hệ thống đang được bảo trì. Vui lòng quay lại sau ít phút.');
  maintenanceScheduledTime = signal<string | null>(null);
  showLockedFeatures = signal<boolean>(false);
  /**
   * Rollout switches for the unified Activity/Bell projections. They are
   * fail-closed for unauthenticated users and support a UID-scoped canary
   * while the global switch remains false.
   */
  private activityFeedV2Configured = signal<boolean>(false);
  private activityFeedV2CanaryUids = signal<string[]>([]);
  private notificationEventSyncV2Configured = signal<boolean>(false);
  private notificationEventSyncV2CanaryUids = signal<string[]>([]);
  activityFeedV2 = computed(() => isFeatureEnabledForUser(
    this.activityFeedV2Configured(),
    this.activityFeedV2CanaryUids(),
    this.auth.currentUserUid(),
  ));
  notificationEventSyncV2 = computed(() => isFeatureEnabledForUser(
    this.notificationEventSyncV2Configured(),
    this.notificationEventSyncV2CanaryUids(),
    this.auth.currentUserUid(),
  ));
  private sysConfigSub?: Unsubscribe;

  selectedSop = signal<Sop | null>(null);
  editingSop = signal<Sop | null>(null);

  cachedCalculatorState = signal<{ sopId: string, formValues: any } | null>(null);

  currentUser = this.auth.currentUser;
  isAdmin = computed(() => this.auth.currentUser()?.role === 'manager');

  isSystemHealthy = signal<boolean>(true);
  permissionError = signal<boolean>(false);

  // Trạng thái kết nối Firestore — hiển thị banner khi listener lỗi
  isOffline = signal<boolean>(false);
  offlineSource = signal<string>('');

  clearOfflineState() {
    this.isOffline.set(false);
    this.offlineSource.set('');
  }

  // UI STATE
  sidebarCollapsed = signal<boolean>(
    localStorage.getItem('sidebar_collapsed') !== 'false' // Mặc định: collapsed (trừ khi user đã mở trước đó)
  );

  // --- FOCUS MODE (New Feature) ---
  focusMode = signal<boolean>(false);

  // --- DARK MODE ---
  darkMode = signal<boolean>(false);
  themeTransitioning = signal<boolean>(false);

  constructor() {
    // Initialize Dark Mode from localStorage
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    this.darkMode.set(savedDarkMode);
    this.applyDarkMode(savedDarkMode);

    effect(() => {
      const userId = this.auth.currentUserUid();
      const perms = this.auth.userPermissions();
      const scope = userId && perms.length > 0
        ? `${userId}|${[...perms].sort().join(',')}`
        : null;

      if (scope) {
        // Profile snapshots (for example an FCM token update) must not restart
        // every Firestore listener when the effective auth scope is unchanged.
        if (this.activeInitScope === scope) return;
        this.activeInitScope = scope;
        void this.initData();
        // checkSystemHealth() removed from auto-call — call manually from Admin panel
      } else if (this.activeInitScope !== null) {
        this.activeInitScope = null;
        this.cleanupListeners();
      }
    });
  }

  toggleSidebarCollapse() {
    this.sidebarCollapsed.update(v => {
      const next = !v;
      localStorage.setItem('sidebar_collapsed', String(next));
      return next;
    });
  }

  // Toggle Focus Mode
  toggleFocusMode() { this.focusMode.update(v => !v); }

  // Toggle Dark Mode
  toggleDarkMode() {
    if (this.themeTransitioning()) return;

    const newVal = !this.darkMode();
    const root = document.documentElement;
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const documentWithTransitions = document as Document & {
      startViewTransition?: (update: () => void) => { finished: Promise<void> };
    };

    this.themeTransitioning.set(true);
    root.classList.add('theme-switching');

    const commitTheme = () => {
      localStorage.setItem('darkMode', String(newVal));
      this.applyDarkMode(newVal);
      this.darkMode.set(newVal);
    };

    const finishTransition = () => {
      requestAnimationFrame(() => {
        root.classList.remove('theme-switching');
        this.themeTransitioning.set(false);
      });
    };

    if (documentWithTransitions.startViewTransition && !prefersReducedMotion && !root.classList.contains('performance-lite')) {
      try {
        documentWithTransitions.startViewTransition(commitTheme).finished.finally(finishTransition);
        return;
      } catch {
        // Fall back to an immediate, transition-free theme swap.
      }
    }

    commitTheme();
    finishTransition();
  }

  private applyDarkMode(isDark: boolean) {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
    document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
      ?.setAttribute('content', isDark ? '#0f172a' : '#f8f9fa');
  }

  private cleanupListeners() {
    this.initGeneration++;
    this.listeners.forEach(unsub => unsub());
    this.listeners = [];
    this.approvedRunsSub = undefined;
    this.usersInfoSub = undefined;
    this.allStandardRequestsLoad = undefined;
    this.allStandardRequestsLoadedAt = 0;
    this.referenceStandardsLoad = undefined;
    this.referenceStandardsLoadedAt = 0;
    this.approvedRecentRequests.clear();
    this.approvedHistoryRequests.clear();
    this.approvedHistoryLoads.clear();
    if (this.sysConfigSub) {
      this.sysConfigSub();
      this.sysConfigSub = undefined;
    }
    if (this._unregisterStdReqListener) {
      this._unregisterStdReqListener();
      this._unregisterStdReqListener = undefined;
    }
    // Giữ singleton còn subscriber ở màn hình khác, nhưng hủy listener mồ côi sau
    // khi quyền/scope thay đổi để tránh tiếp tục tốn reads cho cache không còn dùng.
    this.deltaSync.destroyInactiveSingletons();
    this.sops.set([]);
    this.inventory.set([]);
    this.standards.set([]);
    this.requests.set([]); this.approvedRequests.set([]); this.standardRequests.set([]); this.allStandardRequests.set([]);
    this.usersInfoCache.set(new Map());
  }

  ngOnDestroy() { this.cleanupListeners(); }

  async initData() {
    this.cleanupListeners();
    const initGeneration = this.initGeneration;
    this.permissionError.set(false);

    const isCurrentInit = () => initGeneration === this.initGeneration;
    const addListener = (unsub: Unsubscribe) => {
      if (!isCurrentInit()) {
        unsub();
        return false;
      }
      this.listeners.push(unsub);
      return true;
    };

    const handleError = (source: string) => (error: any) => {
      if (!isCurrentInit()) return;
      console.warn(`${source} listener error:`, error.message);
      if (error.code === 'permission-denied') {
        this.permissionError.set(true);
      } else {
        // Lỗi mạng/quota → hiển thị banner offline cho user
        this.isOffline.set(true);
        this.offlineSource.set(source);
      }
    };

    // 1. Inventory Listener — OPTIMIZED: onSnapshot → DeltaSync singleton (cursor-based)
    // Trước: đọc toàn bộ collection mỗi lần login (~200+ reads)
    // Sau: initial fetch 1 lần, sau đó chỉ delta kể từ cursor (~5-10 reads/lần)
    if (this.auth.hasPermission('inventory_view')) {
      const invCacheKey = buildScopedDeltaKey(
        `lims_inventory_cache_${this.fb.APP_ID}`,
        this.auth.getDeltaCacheScope()
      );
      const invSub = this.deltaSync.startSingletonListener<InventoryItem>({
        cacheKey: invCacheKey,
        cursorKey: buildScopedDeltaKey(
          `lims_inventory_cursor_${this.fb.APP_ID}`,
          this.auth.getDeltaCacheScope()
        ),
        collectionPath: `artifacts/${this.fb.APP_ID}/inventory`,
        maxCacheSize: 2000,
        orderByField: 'lastUpdated',
        orderDirection: 'desc',
        isDeletedFn: (doc) => doc._isDeleted === true
      }, (items) => {
        if (!isCurrentInit()) return;
        this.inventory.set(items);
      });
      addListener(invSub);
    }

    // 2. SOPs Listener — OPTIMIZED: onSnapshot → DeltaSync singleton (cursor-based)
    // Trước: đọc toàn bộ sops mỗi lần login
    // Sau: initial fetch 1 lần, sau đó chỉ delta. isArchived=true bị lọc ra khỏi cache.
    if (this.auth.hasPermission('sop_view')) {
      const sopSub = this.deltaSync.startSingletonListener<Sop>({
        cacheKey: buildScopedDeltaKey(
          `lims_sops_cache_${this.fb.APP_ID}`,
          this.auth.getDeltaCacheScope()
        ),
        cursorKey: buildScopedDeltaKey(
          `lims_sops_cursor_${this.fb.APP_ID}`,
          this.auth.getDeltaCacheScope()
        ),
        collectionPath: `artifacts/${this.fb.APP_ID}/sops`,
        maxCacheSize: 500,
        orderByField: 'lastUpdated',
        orderDirection: 'desc',
        isDeletedFn: (doc) => doc.isArchived === true
      }, (items) => {
        if (!isCurrentInit()) return;
        this.sops.set(items.sort((a, b) => a.name.localeCompare(b.name)));
      });
      addListener(sopSub);
    }


    // 3. Requests Listeners
    if (this.auth.hasPermission('sop_view') || this.auth.hasPermission('batch_run')) {
      const requestsPath = `artifacts/${this.fb.APP_ID}/requests`;
      let isFirstRequestsSnapshot = true;
      const reqSub = onSnapshot(query(
        collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests'),
        where('status', '==', 'pending'),
        orderBy('timestamp', 'desc'),
        // Chỉ cần các yêu cầu đang chờ xử lý gần nhất trên bảng điều hành.
        // Không để lịch sử pending cũ biến listener nền thành truy vấn không giới hạn.
        limit(100)
      ),
        (s) => {
          this.readMonitor.record(
            'onSnapshot',
            requestsPath,
            isFirstRequestsSnapshot
              ? s.size
              : s.docChanges().filter(change => change.type !== 'removed').length,
            { phase: isFirstRequestsSnapshot ? 'initial' : 'delta', fromCache: s.metadata.fromCache }
          );
          isFirstRequestsSnapshot = false;
          const items: Request[] = []; s.forEach(d => items.push({ id: d.id, ...d.data() } as Request)); if (!isCurrentInit()) return; this.requests.set(items); }, handleError('Requests'));
      addListener(reqSub);
    }

    // OPTIMIZED: standards listener removed (legacy collection, no writes exist)
    // statistics.component.ts uses loadAllStandardRequests() on-demand instead

    // standard_requests: chỉ mở listener khi user có thể sử dụng màn hình
    // yêu cầu/mượn chuẩn hoặc cần dữ liệu duyệt/nhật ký chuẩn.
    const canUseStandardRequests = this.auth.canViewStandards()
      || this.auth.hasPermission('standard_request')
      || this.auth.canAssignStandards()
      || this.auth.canViewStandardLogs()
      || this.auth.canDeleteStandardLogs();
    if (canUseStandardRequests) {
      // Subscribe vào singleton của StandardRequestService
      // (tránh tạo listener trùng lặp — tiết kiệm reads)
      const { StandardRequestService } = await import('../../features/standards/services/standard-request.service');
      if (!isCurrentInit()) return;
      const reqService = this.injector.get(StandardRequestService);

      if (this._unregisterStdReqListener) this._unregisterStdReqListener();

      // Lọc theo role ở client-side (singleton đã fetch đúng data theo role)
      const isApprover = this.auth.canApproveStandards();
      const validStatuses = isApprover
        ? ['PENDING_APPROVAL', 'PENDING_RETURN']
        : ['PENDING_APPROVAL', 'IN_PROGRESS', 'PENDING_RETURN'];

      const unregisterStdReqListener = reqService.startRequestsListener((reqs) => {
        if (!isCurrentInit()) return;
        this.standardRequests.set(
          reqs.filter(r => !r._isDeleted && validStatuses.includes(r.status))
        );
      });
      if (isCurrentInit()) {
        this._unregisterStdReqListener = unregisterStdReqListener;
      } else {
        unregisterStdReqListener();
        return;
      }
    }

    // OPTIMIZED: allStandardRequests is now loaded on-demand via loadAllStandardRequests()
    // Call it from statistics.component.ts / standard-requests page as needed

    // Approved/result runs feed — now started on-demand via ensureApprovedRequestsListener().
    // This avoids opening the broad result-history stream for users/routes that do not need it.

    // 4. Activity Feed — owned by ActivityFeedService and started by the
    // Dashboard only when the canonical V2 rollout is enabled.

    // 5. Stats — chỉ tải cho user có quyền Báo cáo
    if (this.auth.canViewReports()) {
      try {
        const statsPath = `artifacts/${this.fb.APP_ID}/stats/master`;
        const statSnap = await getDoc(doc(this.fb.db, statsPath));
        this.readMonitor.record('getDoc', statsPath, 1);
        if (!isCurrentInit()) return;
        if (statSnap.exists()) this.stats.set(statSnap.data() as { totalSopsRun: number; totalItemsUsed: number });
      } catch (e) { console.warn('Stats load error:', e); }
    }

    // 6. Config — OPTIMIZED: 4 onSnapshot listeners → single loadConfig() call
    await this.loadConfig(initGeneration);
    if (!isCurrentInit()) return;

    // 6.5. Users Info Cache — now started on-demand via ensureUserInfoCacheListener()
    // Avatar cache is only needed on log/detail screens.

    // 7. System Force Reload Listener & Delta Sync Architecture
    let isFirstMetaLoad = true;
    let lastSyncTimes: Record<string, number> = {};

    const metadataPath = `artifacts/${this.fb.APP_ID}/system/metadata`;
    let isFirstMetadataSnapshot = true;
    const sysMetaSub = onSnapshot(doc(this.fb.db, metadataPath), (docSnap) => {
      this.readMonitor.record('onSnapshot', metadataPath, 1, {
        phase: isFirstMetadataSnapshot ? 'initial' : 'delta',
        fromCache: docSnap.metadata.fromCache
      });
      isFirstMetadataSnapshot = false;
      if (!isCurrentInit()) return;
      if (docSnap.exists()) {
        const data = docSnap.data();
        const forceTime = data['force_clear_cache_time'] || 0;
        const localTime = Number(localStorage.getItem('lims_cache_purge_time') || 0);

        if (forceTime > localTime) {
          localStorage.setItem('lims_cache_purge_time', forceTime.toString());
          this.toast.show('Quản trị viên vừa dọn dữ liệu hệ thống. Đang kết nối lại sau 2 giây...', 'info');
          setTimeout(() => {
            this.fb.purgeSystemCache();
          }, 2000);
          return;
        }

        // Delta Sync Logic
        if (isFirstMetaLoad) {
          lastSyncTimes = { ...data };
          isFirstMetaLoad = false;
          return;
        }

        // Delta Sync Logic: mỗi field thay đổi hiện 1 toast riêng, độc lập nhau
        if (data['standards'] > (lastSyncTimes['standards'] || 0)) {
          lastSyncTimes['standards'] = data['standards'];
          this.referenceStandardsLoadedAt = 0;
          const syncToast = resolveMetadataSyncToast(
            'standards',
            data['standards'],
            data['standards_event'],
            this.auth.currentUser()?.uid,
            '📊 Danh sách chuẩn đối chiếu vừa được cập nhật.'
          );
          if (syncToast) this.toast.showEvent({ ...syncToast, type: 'info' });
        }

        if (data['inventory'] > (lastSyncTimes['inventory'] || 0)) {
          lastSyncTimes['inventory'] = data['inventory'];
          const syncToast = resolveMetadataSyncToast(
            'inventory',
            data['inventory'],
            data['inventory_event'],
            this.auth.currentUser()?.uid,
            '🧪 Kho hóa chất vừa có thay đổi.'
          );
          if (syncToast) this.toast.showEvent({ ...syncToast, type: 'info' });
        }

        if (data['config'] > (lastSyncTimes['config'] || 0)) {
          lastSyncTimes['config'] = data['config'];
          const wasMaintenance = this.maintenanceMode();
          // Tự động tải lại cấu hình ngầm để nhận trạng thái bảo trì hoặc cấu hình mới nhất
          this.loadConfig(initGeneration).then(() => {
            if (!isCurrentInit()) return;
            if (wasMaintenance === this.maintenanceMode()) {
              this.toast.show('⚙️ Cấu hình hệ thống đã được cập nhật.', 'success');
            }
          });
        }
      }
    }, handleError('System Metadata'));
    addListener(sysMetaSub);
  }

  ensureApprovedRequestsListener(): void {
    if (this.approvedRunsSub || !this.auth.currentUser()) return;
    // This is an operational/recent-feed listener only. Reporting deliberately
    // uses loadApprovedRequestsForDateRange() so a report_view-only account does
    // not keep a background listener alive or mistake a bounded recent cache for
    // complete report history.
    if (!(this.auth.hasPermission('sop_view') || this.auth.hasPermission('batch_run'))) return;

    const initGeneration = this.initGeneration;
    const isCurrentInit = () => initGeneration === this.initGeneration;

    const approvedRunsConfig: DeltaSyncConfig = {
      // The listener is intentionally a recent feed. Older history is loaded
      // explicitly by date below, so a cold start cannot scan requests forever.
      cacheKey: buildScopedDeltaKey(`lims_approved_requests_recent_cache_${this.fb.APP_ID}`, this.auth.getDeltaCacheScope()),
      cursorKey: buildScopedDeltaKey(`lims_approved_requests_recent_cursor_${this.fb.APP_ID}`, this.auth.getDeltaCacheScope()),
      collectionPath: `artifacts/${this.fb.APP_ID}/requests`,
      maxCacheSize: this.APPROVED_REQUEST_RECENT_LIMIT,
      orderByField: 'approvedAt',
      orderDirection: 'desc'
    };

    const appSub = this.deltaSync.startSingletonListener<Request>(approvedRunsConfig, (runs) => {
      if (!isCurrentInit()) return;
      // Lọc client-side để truy vấn cursor chỉ cần single-field index lastUpdated.
      // Bộ lọc status trước đây bao phủ gần như mọi trạng thái và buộc Firestore
      // yêu cầu một composite index không cần thiết.
      this.approvedRecentRequests.clear();
      runs.forEach(run => {
        if (this.isApprovedRequest(run)) {
          this.approvedRecentRequests.set(run.id, run);
        } else if (run.id) {
          // A status transition can arrive through the recent delta feed. Remove
          // its older range-loaded copy so stale approved rows are not displayed.
          this.approvedHistoryRequests.delete(run.id);
        }
      });
      this.publishApprovedRequests();
    });

    this.approvedRunsSub = () => {
      appSub();
      this.approvedRunsSub = undefined;
    };
    this.listeners.push(this.approvedRunsSub);
  }

  /**
   * Load exactly the requested date window in bounded Firestore pages.
   *
   * The UI date semantics are analysisDate -> approvedAt -> timestamp. Three
   * single-field range queries cover all persisted shapes; the result is
   * merged by id and still filtered by the caller's existing date logic.
   * This replaces the old all-time listener without silently treating the
   * latest N requests as complete history.
   */
  async loadApprovedRequestsForDateRange(
    startDate: string,
    endDate: string
  ): Promise<ApprovedRequestsHistoryLoadResult> {
    if (!this.auth.currentUser() || !(
      this.auth.hasPermission('sop_view') ||
      this.auth.hasPermission('batch_run') ||
      this.auth.canViewReports()
    )) {
      return { complete: true, loaded: 0, reads: 0 };
    }

    const range = this.normalizeDateRange(startDate, endDate);
    if (!range) return { complete: true, loaded: 0, reads: 0 };

    const key = `${range.start}:${range.end}`;
    const existing = this.approvedHistoryLoads.get(key);
    if (existing) return existing;

    const initGeneration = this.initGeneration;
    const load = (async (): Promise<ApprovedRequestsHistoryLoadResult> => {
      try {
        const [analysisDateResult, approvedAtResult, timestampResult] = await Promise.all([
          this.fetchApprovedRequestsByRange('analysisDate', range.start, range.end, initGeneration),
          this.fetchApprovedRequestsByRange('approvedAt', range.start, range.end, initGeneration),
          this.fetchApprovedRequestsByRange('timestamp', range.start, range.end, initGeneration)
        ]);

        if (initGeneration !== this.initGeneration) {
          return {
            complete: false,
            loaded: 0,
            reads: analysisDateResult.reads + approvedAtResult.reads + timestampResult.reads
          };
        }

        const merged = new Map<string, Request>();
        [...analysisDateResult.items, ...approvedAtResult.items, ...timestampResult.items].forEach(request => {
          if (this.isApprovedRequest(request)) merged.set(request.id, request);
        });
        merged.forEach((request, id) => this.approvedHistoryRequests.set(id, request));
        this.publishApprovedRequests();

        return {
          complete: analysisDateResult.complete && approvedAtResult.complete && timestampResult.complete,
          loaded: merged.size,
          reads: analysisDateResult.reads + approvedAtResult.reads + timestampResult.reads
        };
      } catch (error) {
        console.warn('[StateService] approved history range load failed:', error);
        return { complete: false, loaded: 0, reads: 0 };
      }
    })();

    this.approvedHistoryLoads.set(key, load);
    try {
      return await load;
    } finally {
      if (this.approvedHistoryLoads.get(key) === load) this.approvedHistoryLoads.delete(key);
    }
  }

  private isApprovedRequest(request: Request): boolean {
    return ['approved', 'draft', 'completed'].includes(request.status);
  }

  private publishApprovedRequests(): void {
    const merged = new Map<string, Request>();
    this.approvedHistoryRequests.forEach((request, id) => merged.set(id, request));
    // The realtime recent feed is authoritative when the same document exists
    // in both maps because it reflects status/summary changes immediately.
    this.approvedRecentRequests.forEach((request, id) => merged.set(id, request));
    this.approvedRequests.set(
      Array.from(merged.values()).sort((a, b) =>
        (timestampToMillis(b.approvedAt ?? b.timestamp ?? b.lastUpdated) ?? 0) -
        (timestampToMillis(a.approvedAt ?? a.timestamp ?? a.lastUpdated) ?? 0)
      )
    );
  }

  private normalizeDateRange(startDate: string, endDate: string): { start: string; end: string } | null {
    const start = startDate?.trim();
    const end = endDate?.trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(start) || !/^\d{4}-\d{2}-\d{2}$/.test(end) || start > end) {
      return null;
    }
    return { start, end };
  }

  private async fetchApprovedRequestsByRange(
    field: 'analysisDate' | 'approvedAt' | 'timestamp',
    startDate: string,
    endDate: string,
    initGeneration: number
  ): Promise<{ items: Request[]; complete: boolean; reads: number }> {
    const requestsPath = `artifacts/${this.fb.APP_ID}/requests`;
    const colRef = collection(this.fb.db, requestsPath);
    const lowerBound = field === 'analysisDate'
      ? startDate
      : new Date(`${startDate}T00:00:00`);
    const upperBound = field === 'analysisDate'
      ? endDate
      : new Date(`${endDate}T23:59:59.999`);
    const items: Request[] = [];
    let cursor: QueryDocumentSnapshot | null = null;
    let reads = 0;

    for (let page = 0; page < this.APPROVED_REQUEST_HISTORY_MAX_PAGES; page++) {
      if (initGeneration !== this.initGeneration) {
        return { items, complete: false, reads };
      }

      const constraints: QueryConstraint[] = [
        where(field, '>=', lowerBound),
        where(field, '<=', upperBound),
        orderBy(field, 'desc'),
        limit(this.APPROVED_REQUEST_HISTORY_PAGE_SIZE)
      ];
      const pageQuery: Query = cursor
        ? query(colRef, ...constraints.slice(0, 3), startAfter(cursor), constraints[3])
        : query(colRef, ...constraints);
      const snap: QuerySnapshot = await getDocs(pageQuery);
      reads += snap.size;
      this.readMonitor.record('getDocs', requestsPath, snap.size, {
        phase: 'history',
        fromCache: snap.metadata.fromCache
      });
      snap.forEach(document => items.push({ id: document.id, ...document.data() } as Request));

      if (snap.size < this.APPROVED_REQUEST_HISTORY_PAGE_SIZE) {
        return { items, complete: true, reads };
      }
      cursor = snap.docs[snap.docs.length - 1];
    }

    return { items, complete: false, reads };
  }

  ensureUserInfoCacheListener(): void {
    if (this.usersInfoSub || !this.auth.currentUser()) return;
    const initGeneration = this.initGeneration;
    const isCurrentInit = () => initGeneration === this.initGeneration;

    // Avatar rendering only needs a bounded directory. An unbounded listener here
    // re-read every user profile on each reconnect and was a major Spark amplifier.
    const usersPath = `artifacts/${this.fb.APP_ID}/users`;
    let isFirstUsersSnapshot = true;
    const usersSub = onSnapshot(
      query(collection(this.fb.db, `artifacts/${this.fb.APP_ID}/users`), limit(100)),
      (s) => {
        this.readMonitor.record(
          'onSnapshot',
          usersPath,
          isFirstUsersSnapshot
            ? s.size
            : s.docChanges().filter(change => change.type !== 'removed').length,
          { phase: isFirstUsersSnapshot ? 'initial' : 'delta', fromCache: s.metadata.fromCache }
        );
        isFirstUsersSnapshot = false;
        const cacheMap = new Map<string, {avatarStyle: string, photoURL: string}>();
        s.forEach(d => {
            const data = d.data();
            if (data['displayName']) {
                cacheMap.set(data['displayName'], {
                    avatarStyle: data['avatarStyle'] || this.avatarStyle(),
                    photoURL: data['photoURL'] || ''
                });
            }
        });
        if (!isCurrentInit()) return;
        this.usersInfoCache.set(cacheMap);
      }, (error: any) => {
      if (!isCurrentInit()) return;
      console.warn('Users Cache listener error:', error.message);
      if (error.code === 'permission-denied') this.permissionError.set(true);
      }
    );

    this.usersInfoSub = () => {
      usersSub();
      this.usersInfoSub = undefined;
    };
    this.listeners.push(this.usersInfoSub);
  }

  // ─── CONFIG: Version-based Caching (Optimized for Spark Plan) ───────────
  private readonly CONFIG_CACHE_KEY = 'lims_cfg_cache';
  private readonly CONFIG_VERSION_KEY = 'lims_cfg_version';

  private applyFeatureRolloutConfig(config: Record<string, unknown>): void {
    this.activityFeedV2Configured.set(config['activityFeedV2'] === true);
    this.activityFeedV2CanaryUids.set(
      normalizeFeatureCanaryUids(config['activityFeedV2CanaryUids']),
    );
    this.notificationEventSyncV2Configured.set(config['notificationEventSyncV2'] === true);
    this.notificationEventSyncV2CanaryUids.set(
      normalizeFeatureCanaryUids(config['notificationEventSyncV2CanaryUids']),
    );
  }

  async loadConfig(initGeneration?: number): Promise<void> {
    const isLoadActive = () => initGeneration === undefined || initGeneration === this.initGeneration;

    // Instant: apply from localStorage cache first (0 reads)
    const hasCache = this._applyConfigFromCache();
    if (!isLoadActive()) return;

    // Background: fetch only '_metadata' to check if we need to download everything
    try {
      const base = `artifacts/${this.fb.APP_ID}/config`;
      const metadataPath = `${base}/_metadata`;
      const metaSnap = await getDoc(doc(this.fb.db, base, '_metadata'));
      this.readMonitor.record('getDoc', metadataPath, 1);
      if (!isLoadActive()) return;

      const serverVersion = metaSnap.exists() ? metaSnap.data()['lastUpdated'] || 0 : 0;
      const localVersion = Number(localStorage.getItem(this.CONFIG_VERSION_KEY) || 0);

      // Tự động đăng ký listener realtime cho system config (bảo trì, khóa tính năng)
      if (!this.sysConfigSub) {
        this.sysConfigSub = onSnapshot(doc(this.fb.db, base, 'system'), (snap) => {
          if (!isLoadActive()) return;
          if (snap.exists()) {
            const d = snap.data();
            if (d['avatarStyle']) this.avatarStyle.set(d['avatarStyle']);
            if (d['maintenanceMode'] !== undefined) this.maintenanceMode.set(d['maintenanceMode']);
            if (d['maintenanceMessage']) this.maintenanceMessage.set(d['maintenanceMessage']);
            if (d['showLockedFeatures'] !== undefined) this.showLockedFeatures.set(d['showLockedFeatures']);
            this.applyFeatureRolloutConfig(d);
            this.maintenanceScheduledTime.set(d['maintenanceScheduledTime'] || null);
          }
        });
      }

      // Nếu có cache và server chưa cập nhật gì mới => Dừng lại, dùng toàn bộ local cache!
      // (Tiết kiệm 4 lượt Reads mỗi lần bật app)
      if (hasCache && serverVersion > 0 && localVersion >= serverVersion) {
        return;
      }

      // Nếu không có cache, hoặc Server báo có phiên bản cấu hình mới => Tải lại toàn bộ
      const [printSnap, safetySnap, catSnap, sysSnap] = await Promise.all([
        getDoc(doc(this.fb.db, base, 'print')),
        getDoc(doc(this.fb.db, base, 'safety')),
        getDoc(doc(this.fb.db, base, 'categories')),
        getDoc(doc(this.fb.db, base, 'system')),
      ]);
      this.readMonitor.record('getDoc', `${base}/print`, 1);
      this.readMonitor.record('getDoc', `${base}/safety`, 1);
      this.readMonitor.record('getDoc', `${base}/categories`, 1);
      this.readMonitor.record('getDoc', `${base}/system`, 1);
      if (!isLoadActive()) return;

      if (printSnap.exists()) this.printConfig.set(printSnap.data() as PrintConfig);
      if (safetySnap.exists()) this.safetyConfig.set(safetySnap.data() as SafetyConfig);
      if (catSnap.exists() && catSnap.data()?.['items']) {
        this.categories.set(catSnap.data()!['items'] as CategoryItem[]);
      }
      if (sysSnap.exists()) {
        const d = sysSnap.data()!;
        // systemVersion is strictly controlled by package.json build sync
        if (d['avatarStyle']) this.avatarStyle.set(d['avatarStyle']);
        if (d['maintenanceMode'] !== undefined) this.maintenanceMode.set(d['maintenanceMode']);
        if (d['maintenanceMessage']) this.maintenanceMessage.set(d['maintenanceMessage']);
        if (d['showLockedFeatures'] !== undefined) this.showLockedFeatures.set(d['showLockedFeatures']);
        this.applyFeatureRolloutConfig(d);
        this.maintenanceScheduledTime.set(d['maintenanceScheduledTime'] || null);
      }

      // Lưu lại vào trình duyệt cho lần sau
      const cache = {
        print: printSnap.exists() ? printSnap.data() : null,
        safety: safetySnap.exists() ? safetySnap.data() : null,
        categories: catSnap.exists() ? catSnap.data() : null,
        system: sysSnap.exists() ? sysSnap.data() : null,
      };
      localStorage.setItem(this.CONFIG_CACHE_KEY, JSON.stringify(cache));
      localStorage.setItem(this.CONFIG_VERSION_KEY, serverVersion.toString());
    } catch (e) { console.warn('Config load error:', e); }
  }

  private _applyConfigFromCache(): boolean {
    try {
      const raw = localStorage.getItem(this.CONFIG_CACHE_KEY);
      if (!raw) return false;
      const cache = JSON.parse(raw);
      if (cache.print) this.printConfig.set(cache.print as PrintConfig);
      if (cache.safety) this.safetyConfig.set(cache.safety as SafetyConfig);
      if (cache.categories?.['items']) this.categories.set(cache.categories['items'] as CategoryItem[]);
      // systemVersion is strictly controlled by package.json build sync
      if (cache.system?.['avatarStyle']) this.avatarStyle.set(cache.system['avatarStyle']);
      if (cache.system?.['maintenanceMode'] !== undefined) this.maintenanceMode.set(cache.system['maintenanceMode']);
      if (cache.system?.['maintenanceMessage']) this.maintenanceMessage.set(cache.system['maintenanceMessage']);
      if (cache.system?.['showLockedFeatures'] !== undefined) this.showLockedFeatures.set(cache.system['showLockedFeatures']);
      this.applyFeatureRolloutConfig((cache.system ?? {}) as Record<string, unknown>);
      this.maintenanceScheduledTime.set(cache.system?.['maintenanceScheduledTime'] || null);
      return true;
    } catch (_) { return false; /* ignore stale/corrupt cache */ }
  }

  // ─── allStandardRequests: Load on-demand (not realtime) ──────────────────────
  async loadAllStandardRequests(forceRefresh = false): Promise<ReportCollectionLoadResult> {
    if (!forceRefresh && this.allStandardRequestsLoadedAt > 0
      && Date.now() - this.allStandardRequestsLoadedAt < this.ON_DEMAND_CACHE_TTL_MS) {
      return { complete: true, loaded: this.allStandardRequests().length, reads: 0 };
    }
    if (this.allStandardRequestsLoad) return this.allStandardRequestsLoad;

    const initGeneration = this.initGeneration;
    const load = (async (): Promise<ReportCollectionLoadResult> => {
      try {
        const canReadAll = this.auth.canAssignStandards()
          || this.auth.canViewStandardLogs()
          || this.auth.canDeleteStandardLogs()
          || this.auth.canViewReports();
        const currentUser = this.auth.currentUser();
        if (!currentUser) {
          this.allStandardRequests.set([]);
          return { complete: false, loaded: 0, reads: 0 };
        }

        const requestsPath = `artifacts/${this.fb.APP_ID}/standard_requests`;
        const { StandardRequestService } = await import('../../features/standards/services/standard-request.service');
        const requestService = this.injector.get(StandardRequestService);
        // Operational listener caches are bounded/recent-state optimizations.
        // A report_view load must prove completeness from Firestore instead.
        const listenerCached = this.auth.canViewReports()
          ? null
          : await requestService.getRequestsFromListenerCache();
        if (listenerCached) {
          if (initGeneration !== this.initGeneration) return { complete: false, loaded: 0, reads: 0 };
          const items = listenerCached
            .filter(request => !request._isDeleted)
            .sort((a, b) =>
              (timestampToMillis(b.requestDate ?? b.createdAt) ?? 0)
              - (timestampToMillis(a.requestDate ?? a.createdAt) ?? 0)
            );
          this.allStandardRequests.set(items);
          this.allStandardRequestsLoadedAt = Date.now();
          this.readMonitor.record('getDocs', requestsPath, listenerCached.length, { phase: 'cache', fromCache: true });
          return { complete: true, loaded: items.length, reads: 0 };
        }

        const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'standard_requests');
        const items: StandardRequest[] = [];
        let cursor: QueryDocumentSnapshot | null = null;
        let reads = 0;
        while (true) {
          const constraints: QueryConstraint[] = [];
          if (!canReadAll) constraints.push(where('requestedBy', '==', currentUser.uid));
          constraints.push(orderBy(documentId()), limit(this.REPORT_COLLECTION_PAGE_SIZE));
          if (cursor) constraints.splice(constraints.length - 1, 0, startAfter(cursor));
          const snap = await getDocs(query(colRef, ...constraints));
          reads += snap.size;
          this.readMonitor.record('getDocs', requestsPath, snap.size, {
            phase: 'report-page',
            fromCache: snap.metadata.fromCache
          });
          snap.forEach(d => items.push({ id: d.id, ...d.data() } as StandardRequest));
          if (initGeneration !== this.initGeneration) return { complete: false, loaded: 0, reads };
          if (snap.size < this.REPORT_COLLECTION_PAGE_SIZE) break;
          cursor = snap.docs[snap.docs.length - 1];
        }
        const visibleItems = items
          .filter(request => !request._isDeleted)
          .sort((a, b) =>
            (timestampToMillis(b.requestDate ?? b.createdAt) ?? 0)
            - (timestampToMillis(a.requestDate ?? a.createdAt) ?? 0)
          );
        this.allStandardRequests.set(visibleItems);
        this.allStandardRequestsLoadedAt = Date.now();
        return { complete: true, loaded: visibleItems.length, reads };
      } catch (e) {
        console.warn('loadAllStandardRequests error:', e);
        throw e;
      }
    })();

    this.allStandardRequestsLoad = load;
    try {
      return await load;
    } finally {
      if (this.allStandardRequestsLoad === load) this.allStandardRequestsLoad = undefined;
    }
  }

  // ─── standards (reference_standards): Load on-demand for Statistics ───────────
  // Replaces the removed realtime listener on the legacy 'standards' collection.
  // Populates state.standards() signal so statistics.component.ts works unchanged.
  async loadReferenceStandards(forceRefresh = false): Promise<ReportCollectionLoadResult> {
    if (!forceRefresh && this.referenceStandardsLoadedAt > 0
      && Date.now() - this.referenceStandardsLoadedAt < this.ON_DEMAND_CACHE_TTL_MS) {
      return { complete: true, loaded: this.standards().length, reads: 0 };
    }
    if (this.referenceStandardsLoad) return this.referenceStandardsLoad;

    const initGeneration = this.initGeneration;
    const load = (async (): Promise<ReportCollectionLoadResult> => {
      try {
        if (!this.auth.currentUser() || !(this.auth.hasPermission('standard_view') || this.auth.canViewReports())) {
          return { complete: false, loaded: 0, reads: 0 };
        }
        const cacheKey = buildScopedDeltaKey(
          'lims_reference_standards_cache_' + this.fb.APP_ID,
          this.auth.getDeltaCacheScope()
        );
        const cached = this.deltaSync.getCache<ReferenceStandard>(cacheKey);
        if (!this.auth.canViewReports() && !forceRefresh && cached && cached.length > 0) {
          this.standards.set(cached.filter(standard =>
            !standard._isDeleted && standard.status !== 'DELETED'
          ));
          this.referenceStandardsLoadedAt = Date.now();
          this.readMonitor.record('getDocs', `artifacts/${this.fb.APP_ID}/reference_standards`, cached.length, { phase: 'cache', fromCache: true });
          return { complete: true, loaded: this.standards().length, reads: 0 };
        }

        const standardsPath = `artifacts/${this.fb.APP_ID}/reference_standards`;
        const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'reference_standards');
        const standards: ReferenceStandard[] = [];
        let cursor: QueryDocumentSnapshot | null = null;
        let reads = 0;
        while (true) {
          const constraints: QueryConstraint[] = [orderBy(documentId())];
          if (cursor) constraints.push(startAfter(cursor));
          constraints.push(limit(this.REPORT_COLLECTION_PAGE_SIZE));
          const snap = await getDocs(query(colRef, ...constraints));
          reads += snap.size;
          this.readMonitor.record('getDocs', standardsPath, snap.size, {
            phase: 'report-page',
            fromCache: snap.metadata.fromCache
          });
          snap.forEach(d => standards.push({ id: d.id, ...d.data() } as ReferenceStandard));
          if (initGeneration !== this.initGeneration) return { complete: false, loaded: 0, reads };
          if (snap.size < this.REPORT_COLLECTION_PAGE_SIZE) break;
          cursor = snap.docs[snap.docs.length - 1];
        }
        const visibleStandards = standards
          .filter(standard => !standard._isDeleted && standard.status !== 'DELETED')
          .sort((a, b) => (b.received_date || '').localeCompare(a.received_date || ''));
        this.standards.set(visibleStandards);
        this.referenceStandardsLoadedAt = Date.now();
        return { complete: true, loaded: visibleStandards.length, reads };
      } catch (e) {
        console.warn('loadReferenceStandards error:', e);
        throw e;
      }
    })();

    this.referenceStandardsLoad = load;
    try {
      return await load;
    } finally {
      if (this.referenceStandardsLoad === load) this.referenceStandardsLoad = undefined;
    }
  }

  async checkSystemHealth() { return true; }

  // Config save helpers — each refreshes the local cache after writing
  private async updateConfigMetadata() {
    const ref = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'config', '_metadata');
    await setDoc(ref, { lastUpdated: Date.now() }, { merge: true });
  }

  async savePrintConfig(config: PrintConfig) {
    const ref = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'config', 'print');
    await setDoc(ref, config, { merge: true });
    await this.updateConfigMetadata();
    await this.loadConfig();
  }

  async saveSafetyConfig(config: SafetyConfig) {
    const ref = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'config', 'safety');
    await setDoc(ref, config, { merge: true });
    await this.updateConfigMetadata();
    await this.loadConfig();
  }

  async saveCategoriesConfig(items: CategoryItem[]) {
    const ref = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'config', 'categories');
    await setDoc(ref, { items }, { merge: true });
    await this.updateConfigMetadata();
    await this.loadConfig();
  }

  async saveSystemVersion(version: string) {
    const ref = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'config', 'system');
    await setDoc(ref, { version }, { merge: true });
    await this.updateConfigMetadata();
    await this.loadConfig();
  }

  async saveAvatarStyle(style: string) {
    const ref = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'config', 'system');
    await setDoc(ref, { avatarStyle: style }, { merge: true });
    await this.updateConfigMetadata();
    await this.loadConfig();
  }

  async saveMyAvatarStyle(style: string) {
    const user = this.auth.currentUser();
    if (!user) return;
    const ref = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'users', user.uid);
    await updateDoc(ref, { avatarStyle: style });
    // currentUser signal is updated automatically by AuthService's listener
  }

  getUserAvatarOptions(displayName: string | undefined | null): { style: string, photoURL: string | null } {
    if (!displayName) return { style: this.avatarStyle(), photoURL: null };
    const cache = this.usersInfoCache().get(displayName);
    if (cache) {
        return { style: cache.avatarStyle, photoURL: cache.photoURL || null };
    }
    return { style: this.avatarStyle(), photoURL: null };
  }

  async saveMaintenanceConfig(mode: boolean, message: string, scheduledTime: string | null = null) {
    const ref = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'config', 'system');
    await setDoc(ref, {
      maintenanceMode: mode,
      maintenanceMessage: message,
      maintenanceScheduledTime: scheduledTime
    }, { merge: true });

    // Ghi nhận Audit Log
    let details = mode ? `Bật chế độ bảo trì. Nội dung: "${message}"` : 'Tắt chế độ bảo trì.';
    if (scheduledTime) {
      const formattedTime = new Date(scheduledTime).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
      details += ` (Lịch hẹn bảo trì: ${formattedTime})`;
    }
    await this.logMaintenanceActivity(mode ? 'MAINTENANCE_ON' : 'MAINTENANCE_OFF', details);

    await this.updateConfigMetadata();
    await this.loadConfig();
  }

  async saveShowLockedFeaturesConfig(showLocked: boolean) {
    const ref = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'config', 'system');
    await setDoc(ref, {
      showLockedFeatures: showLocked
    }, { merge: true });

    this.showLockedFeatures.set(showLocked);
    await this.logMaintenanceActivity(showLocked ? 'SHOW_LOCKED_ON' : 'SHOW_LOCKED_OFF', showLocked ? 'Bật hiển thị tính năng khóa toàn hệ thống' : 'Tắt hiển thị tính năng khóa toàn hệ thống');
    await this.updateConfigMetadata();
    await this.loadConfig();
  }

  async postSystemUpdate(content: string, updateType: string, actionUrl: string): Promise<string> {
    const currentUser = this.auth.currentUser();
    if (!currentUser || currentUser.role !== 'manager') {
      throw new Error('Chỉ quản trị viên được đăng thông báo hệ thống.');
    }
    const normalizedContent = content.trim();
    if (!normalizedContent) throw new Error('Nội dung thông báo hệ thống không được để trống.');
    const normalizedActionUrl = actionUrl.trim();
    const safeActionUrl = normalizedActionUrl.startsWith('/') && !normalizedActionUrl.startsWith('//')
      ? normalizedActionUrl
      : '';

    const updateRef = doc(collection(this.fb.db, `artifacts/${this.fb.APP_ID}/system_updates`));
    const activityRef = this.activityEvents.createRef(updateRef.id);
    const batch = writeBatch(this.fb.db);
    batch.set(updateRef, {
      content: normalizedContent,
      type: updateType,
      actionUrl: safeActionUrl,
      timestamp: serverTimestamp()
    });
    const activityEvent = this.activityEvents.build({
      eventId: activityRef.id,
      action: 'POST_SYSTEM_UPDATE',
      details: normalizedContent,
      targetType: 'SYSTEM_UPDATE',
      targetId: updateRef.id,
      targetName: 'Thông báo hệ thống',
      actionUrl: safeActionUrl || '/settings/system',
      metadata: { updateType }
    });
    this.activityEvents.setInBatch(batch, activityRef, activityEvent);
    await batch.commit();

    if (this.notificationEventSyncV2()) {
      await this.dispatchActivityNotificationIfEnabled(activityRef.id);
    } else {
      await this.notificationInbox.notify({
        recipientUid: 'role:all',
        senderUid: currentUser.uid,
        senderName: currentUser.displayName || 'Quản trị viên',
        type: 'SYSTEM_UPDATE',
        level: 'info',
        title: 'Thông báo hệ thống',
        message: normalizedContent,
        actionUrl: safeActionUrl,
        groupId: activityRef.id,
        eventId: activityRef.id
      });
    }
    return updateRef.id;
  }

  async logMaintenanceActivity(action: string, details: string) {
    try {
      const event = this.activityEvents.build({
        action,
        details,
        printable: false
      });
      await this.activityEvents.write(event);
      if (action === 'MAINTENANCE_ON' || action === 'MAINTENANCE_OFF') {
        await this.dispatchActivityNotificationIfEnabled(event.eventId);
      }
    } catch (e) {
      console.warn("Failed to write maintenance audit log:", e);
    }
  }

  private async dispatchActivityNotificationIfEnabled(eventId: string): Promise<void> {
    if (!this.notificationEventSyncV2()) return;
    try {
      await this.notificationInbox.dispatchEvent(eventId);
    } catch (error) {
      console.warn('[StateService] Canonical notification dispatch failed:', error);
      this.toast.showEvent({
        message: 'Tác vụ đã hoàn thành nhưng chưa thể đồng bộ thông báo từ Activity event.',
        type: 'warning',
        dedupeKey: `notification-dispatch-error:${eventId}`
      });
    }
  }

  public getCurrentUserName(): string {
    const user = this.auth.currentUser();
    return user?.displayName || user?.email || user?.uid || 'Người dùng không xác định';
  }

  // ... (Rest of the file remains unchanged: mapToRequestItems, submitRequest, directApproveAndQueuePrint, approveRequest, revokeApproval, etc.)
  // Omitted for brevity as no logic changed there

  private getItemsToDeduct(calculatedItems: CalculatedItem[]) {
    const itemsToDeduct = new Map<string, number>();
    calculatedItems.forEach(item => {
      if (item.isComposite) {
        item.breakdown.forEach(sub => {
          const current = itemsToDeduct.get(sub.name) || 0;
          itemsToDeduct.set(sub.name, current + sub.totalNeed);
        });
      } else {
        const current = itemsToDeduct.get(item.name) || 0;
        itemsToDeduct.set(item.name, current + item.stockNeed);
      }
    });
    return Array.from(itemsToDeduct.entries()).map(([name, amount]) => ({ name, amount }));
  }

  private getRequestItemInventoryDeltas(items: readonly RequestItem[], multiplier: 1 | -1): Record<string, number> {
    const deltas: Record<string, number> = {};
    items.forEach(item => {
      deltas[item.name] = (deltas[item.name] || 0) + (item.amount * multiplier);
    });
    return deltas;
  }

  private mapToRequestItems(calculatedItems: CalculatedItem[], invMap: Record<string, InventoryItem>): RequestItem[] {
    const requestItems: RequestItem[] = [];
    calculatedItems.forEach(item => {
      if (item.isComposite) {
        item.breakdown.forEach(sub => {
          const displayName = invMap[sub.name]?.name || sub.name;
          requestItems.push({
            name: sub.name, displayName,
            amount: sub.totalNeed, displayAmount: sub.displayAmount,
            baseAmount: sub.baseAmount,
            unit: sub.unit, stockUnit: sub.stockUnit
          });
        });
      } else {
        const displayName = invMap[item.name]?.name || item.name;
        requestItems.push({
          name: item.name, displayName,
          amount: item.stockNeed, displayAmount: item.totalQty,
          baseAmount: item.baseAmount,
          unit: item.unit, stockUnit: item.stockUnit
        });
      }
    });
    return requestItems;
  }

  private getStatsDateForRequest(req: any, fallbackDate: Date): Date {
    let date = req.approvedAt ? new Date(req.approvedAt.seconds * 1000) : (req.timestamp ? new Date(req.timestamp.seconds * 1000) : fallbackDate);
    if (req.analysisDate) {
      const parts = req.analysisDate.split('-');
      if (parts.length === 3) {
        date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      }
    }
    return date;
  }

  private buildSopTraceability(sop: Sop): Pick<Request, 'sopVersion' | 'sopRef' | 'targetNames'> {
    return {
      sopVersion: sop.version || 1,
      sopRef: sop.ref || '',
      targetNames: Object.fromEntries((sop.targets || []).map(target => [
        getCanonicalId(target.name || target.id),
        target.name
      ]))
    };
  }

  private async getAvailableTargetGroupsForTraceability(): Promise<TargetGroup[]> {
    try {
      return await this.targetService.getAllGroups();
    } catch {
      // Scope classification can still safely snapshot SOP-all/manual without current groups.
      return [];
    }
  }

  private async buildTargetScopeTraceability(
    sop: Sop,
    formInputs: any,
    cachedAvailableGroups?: TargetGroup[]
  ) {
    const availableGroups = cachedAvailableGroups ?? await this.getAvailableTargetGroupsForTraceability();
    return sanitizeForFirebase(buildTargetScopeSnapshots({
      sampleTargetMap: formInputs.sampleTargetMap,
      fallbackTargetIds: formInputs.targetIds,
      sopId: sop.id,
      sopVersion: sop.version || 1,
      sopTargetSnapshot: this.buildSopTraceability(sop).targetNames,
      availableGroups,
      explicitGroupId: formInputs.explicitGroupId
    }));
  }

  private async buildLegacyTargetScopeTraceability(req: Request, currentSop?: Sop) {
    if (req.targetScopeSnapshots?.length) return req.targetScopeSnapshots;
    const availableGroups = await this.getAvailableTargetGroupsForTraceability();
    return sanitizeForFirebase(buildTargetScopeSnapshots({
      sampleTargetMap: req.sampleTargetMap,
      fallbackTargetIds: req.targetIds,
      sopId: req.sopId,
      sopVersion: req.sopVersion,
      sopTargetSnapshot: req.targetNames || (currentSop
        ? Object.fromEntries((currentSop.targets || []).map(target => [target.id, target.name]))
        : undefined),
      availableGroups
    }));
  }

  private estimateUtf8Bytes(value: unknown): number {
    const json = JSON.stringify(value) || '';
    return typeof TextEncoder === 'undefined'
      ? json.length
      : new TextEncoder().encode(json).byteLength;
  }

  private hasValidAnalysisDate(value: unknown): value is string {
    if (typeof value !== 'string') return false;
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) return false;
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const candidate = new Date(year, month - 1, day);
    return candidate.getFullYear() === year
      && candidate.getMonth() === month - 1
      && candidate.getDate() === day;
  }

  async submitRequest(sop: Sop, calculatedItems: CalculatedItem[], formInputs: any, invMap: Record<string, InventoryItem> = {}) {
    if (!this.hasValidAnalysisDate(formInputs.analysisDate)) {
      this.toast.show('Vui lòng chọn ngày kiểm nghiệm hợp lệ trước khi gửi yêu cầu.', 'error');
      return;
    }
    try {
      const requestItems = this.mapToRequestItems(calculatedItems, invMap);
      const targetScopeSnapshots = await this.buildTargetScopeTraceability(sop, formInputs);

      const reqData: any = {
        sopId: sop.id,
        sopName: sop.name,
        items: requestItems,
        status: 'pending',
        timestamp: serverTimestamp(),
        lastUpdated: serverTimestamp(),
        user: this.getCurrentUserName(),
        createdByUid: this.auth.currentUser()?.uid || '',
        inputs: formInputs,
        margin: formInputs.safetyMargin || 0,
        analysisDate: formInputs.analysisDate,
        ...this.buildSopTraceability(sop)
      };
      reqData.targetScopeSnapshots = targetScopeSnapshots;

      if (formInputs.sampleList) reqData.sampleList = formInputs.sampleList;
      if (formInputs.targetIds) reqData.targetIds = formInputs.targetIds;
      if (formInputs.sampleTargetMap) reqData.sampleTargetMap = formInputs.sampleTargetMap;
      if (formInputs.sampleDescriptionMap) reqData.sampleDescriptionMap = formInputs.sampleDescriptionMap;

      await addDoc(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests'), sanitizeForFirebase(reqData));
      this.toast.show('Đã gửi yêu cầu duyệt!', 'success');
    } catch (e: any) { this.toast.show('Lỗi gửi yêu cầu: ' + e.message, 'error'); }
  }

  async directApproveAndQueuePrint(
    sop: Sop,
    calculatedItems: CalculatedItem[],
    formInputs: any,
    invMap: Record<string, InventoryItem> = {},
    options: { showSuccessToast?: boolean } = {}
  ): Promise<{ logId: string, printJobId: string } | null> {
    if (!this.auth.canApprove()) { this.toast.show('Bạn không có quyền duyệt!', 'error'); return null; }
    if (!this.hasValidAnalysisDate(formInputs.analysisDate)) {
      this.toast.show('Vui lòng chọn ngày kiểm nghiệm hợp lệ trước khi duyệt.', 'error');
      return null;
    }

    const itemsToDeduct = this.getItemsToDeduct(calculatedItems);
    const requestItems = this.mapToRequestItems(calculatedItems, invMap);

    const reqRef = doc(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests'));
    const printJobRef = doc(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'print_jobs'));

    const logId = `TRC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const logRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'logs', logId);
    let dailyProjection: Request | null = null;

    try {
      const targetScopeSnapshots = await this.buildTargetScopeTraceability(sop, formInputs);
      await runTransaction(this.fb.db, async (transaction) => {
        const invRefs = itemsToDeduct.map(item => doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', item.name));
        const invSnaps = await Promise.all(invRefs.map(ref => transaction.get(ref)));

        for (let i = 0; i < itemsToDeduct.length; i++) {
          const item = itemsToDeduct[i];
          const invSnap = invSnaps[i];
          if (!invSnap.exists()) throw new Error(`Hóa chất "${item.name}" không tồn tại!`);
          const currentStock = invSnap.data()['stock'] || 0;
          if (currentStock < item.amount) throw new Error(`Kho không đủ "${item.name}". Tồn: ${currentStock}, Cần: ${item.amount}`);
        }

        for (let i = 0; i < itemsToDeduct.length; i++) {
          transaction.update(invRefs[i], { stock: increment(-itemsToDeduct[i].amount), lastUpdated: serverTimestamp() });
        }

        const reqData: any = {
          sopId: sop.id,
          sopName: sop.name,
          items: requestItems,
          status: 'approved',
          timestamp: serverTimestamp(),
          lastUpdated: serverTimestamp(),
          approvedAt: serverTimestamp(),
          user: this.getCurrentUserName(),
          createdByUid: this.auth.currentUser()?.uid || '',
          inputs: formInputs,
          margin: formInputs.safetyMargin || 0,
          analysisDate: formInputs.analysisDate,
          ...this.buildSopTraceability(sop)
        };
        reqData.targetScopeSnapshots = targetScopeSnapshots;

        if (formInputs.sampleList) reqData.sampleList = formInputs.sampleList;
        if (formInputs.targetIds) reqData.targetIds = formInputs.targetIds;
        if (formInputs.sampleTargetMap) reqData.sampleTargetMap = formInputs.sampleTargetMap;
        if (formInputs.sampleDescriptionMap) reqData.sampleDescriptionMap = formInputs.sampleDescriptionMap;

        transaction.set(reqRef, sanitizeForFirebase(reqData));
        dailyProjection = {
          id: reqRef.id,
          ...reqData
        } as Request;

        const printData: PrintData = {
          sop,
          inputs: formInputs,
          margin: formInputs.safetyMargin || 0,
          items: calculatedItems,
          analysisDate: formInputs.analysisDate,
          requestId: reqRef.id
        };
        transaction.set(printJobRef, {
          ...sanitizeForFirebase(printData),
          createdAt: serverTimestamp(),
          lastUpdated: serverTimestamp(),
          createdBy: this.getCurrentUserName(),
          createdByUid: this.auth.currentUser()?.uid || ''
        });

        const activityEvent = this.activityEvents.build({
          eventId: logRef.id,
          action: 'DIRECT_APPROVE',
          details: `Duyệt trực tiếp và đưa vào hàng đợi in SOP: ${sop.name}`,
          targetType: 'REQUEST',
          targetId: reqRef.id,
          targetName: sop.name,
          requestId: reqRef.id,
          printable: true,
          printJobId: printJobRef.id,
          publicTraceable: true,
          metadata: { sopId: sop.id, analysisDate: formInputs.analysisDate },
          legacyFields: {
            inventoryDeltas: Object.fromEntries(
              itemsToDeduct.map(item => [item.name, -item.amount])
            ),
            sopBasicInfo: {
              name: sop.name,
              category: sop.category,
              ref: sop.ref
            }
          }
        });
        this.activityEvents.setInTransaction(transaction, logRef, activityEvent);
      });
      await this.dispatchActivityNotificationIfEnabled(logRef.id);
      if (dailyProjection) {
        await this.dailyChecklistMaterializer.materializeRequestBestEffort(
          dailyProjection,
          'directApproveAndQueuePrint'
        );
      }
      if (options.showSuccessToast !== false) {
        this.toast.show(`Duyệt thành công và đã đưa vào hàng đợi in: "${sop.name}"`, 'success');
      }

      let samples = 1; let qcs = 0;
      if (formInputs?.['n_sample']) samples = Number(formInputs['n_sample']);
      if (formInputs?.['n_qc']) qcs = Number(formInputs['n_qc']);
      this.statsService.incrementStats(this.getStatsDateForRequest({ analysisDate: formInputs?.analysisDate }, new Date()), sop.id, sop.name, samples, 1, qcs).catch(e => console.error(e));

      return { logId: logRef.id, printJobId: printJobRef.id };

    } catch (e: any) {
      if (e.code === 'resource-exhausted') this.toast.show('Lỗi: Hết hạn mức Quota.', 'error');
      else this.toast.show(e.message, 'error');
      return null;
    }
  }

  async directApproveBatchPlan(
    planItems: DirectBatchPlanItem[],
    invMap: Record<string, InventoryItem> = {}
  ): Promise<DirectBatchPlanResult[] | null> {
    if (!this.auth.canRunBatch()) {
      this.toast.show('Bạn không có quyền lập và vận hành mẻ.', 'error');
      return null;
    }
    if (planItems.length === 0) {
      this.toast.show('Kế hoạch không có mẻ nào để duyệt.', 'error');
      return null;
    }
    if (planItems.some(item => !this.hasValidAnalysisDate(item.formInputs?.analysisDate))) {
      this.toast.show('Vui lòng chọn ngày kiểm nghiệm hợp lệ cho tất cả các mẻ.', 'error');
      return null;
    }

    const deductions = new Map<string, number>();
    const requestItemsByBatch: RequestItem[][] = [];
    for (const item of planItems) {
      const margin = Number(item.formInputs?.safetyMargin);
      const hasInvalidCalculatedItem = item.calculatedItems.some(calculated =>
        Boolean(calculated.validationError)
        || calculated.displayWarning?.includes('Khác ĐV')
        || (calculated.isComposite
          ? calculated.breakdown.some(sub =>
              !Number.isFinite(sub.totalNeed)
              || sub.totalNeed < 0
              || sub.displayWarning?.includes('Khác ĐV')
            )
          : !Number.isFinite(calculated.stockNeed) || calculated.stockNeed < 0)
      );
      if (
        hasInvalidCalculatedItem
        || !Number.isFinite(margin)
        || (margin !== -1 && (margin < 0 || margin > 100))
      ) {
        this.toast.show(`Mẻ “${item.sop.name}” có công thức, đơn vị hoặc hao hụt không hợp lệ.`, 'error');
        return null;
      }
      const batchDeductions = this.getItemsToDeduct(item.calculatedItems);
      if (batchDeductions.some(deduction => !Number.isFinite(deduction.amount) || deduction.amount < 0)) {
        this.toast.show(`Mẻ “${item.sop.name}” có lượng tiêu hao không hợp lệ.`, 'error');
        return null;
      }
      batchDeductions.forEach(deduction =>
        deductions.set(deduction.name, (deductions.get(deduction.name) || 0) + deduction.amount)
      );
      requestItemsByBatch.push(this.mapToRequestItems(item.calculatedItems, invMap));
    }

    const estimatedWrites = deductions.size + planItems.length * 3;
    if (estimatedWrites > 450) {
      this.toast.show('Kế hoạch quá lớn để duyệt nguyên tử. Hãy chia thành các kế hoạch nhỏ hơn.', 'error');
      return null;
    }

    const planTimestamp = Date.now();
    try {
      // Target groups are immutable for this approval attempt; load them once
      // instead of once per physical batch created by SmartBatch.
      const availableTargetGroups = await this.getAvailableTargetGroupsForTraceability();
      const prepared = await Promise.all(planItems.map(async (item, index) => {
        const requestItems = requestItemsByBatch[index];
        const targetScopeSnapshots = await this.buildTargetScopeTraceability(
          item.sop,
          item.formInputs,
          availableTargetGroups
        );
        const requestRef = doc(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests'));
        const printJobRef = doc(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'print_jobs'));
        const logRef = doc(
          this.fb.db,
          'artifacts',
          this.fb.APP_ID,
          'logs',
          `TRC-${planTimestamp}-${index}-${Math.floor(Math.random() * 1000)}`
        );
        const reqData: any = {
          sopId: item.sop.id,
          sopName: item.sop.name,
          items: requestItems,
          status: 'approved',
          timestamp: serverTimestamp(),
          lastUpdated: serverTimestamp(),
          approvedAt: serverTimestamp(),
          user: this.getCurrentUserName(),
          createdByUid: this.auth.currentUser()?.uid || '',
          inputs: item.formInputs,
          margin: item.formInputs.safetyMargin || 0,
          analysisDate: item.formInputs.analysisDate,
          targetScopeSnapshots,
          ...this.buildSopTraceability(item.sop)
        };
        if (item.formInputs.sampleList) reqData.sampleList = item.formInputs.sampleList;
        if (item.formInputs.targetIds) reqData.targetIds = item.formInputs.targetIds;
        if (item.formInputs.sampleTargetMap) reqData.sampleTargetMap = item.formInputs.sampleTargetMap;
        if (item.formInputs.sampleDescriptionMap) reqData.sampleDescriptionMap = item.formInputs.sampleDescriptionMap;

        const payloadBytes = this.estimateUtf8Bytes(sanitizeForFirebase(reqData));
        if (payloadBytes > this.MAX_DIRECT_REQUEST_PAYLOAD_BYTES) {
          throw new Error(
            `Request của SOP “${item.sop.name}” quá lớn (${Math.round(payloadBytes / 1024).toLocaleString('vi-VN')} KB). Hãy chia nhỏ nhóm mẫu trước khi duyệt.`
          );
        }

        return {
          ...item,
          requestItems,
          targetScopeSnapshots,
          reqData,
          requestRef,
          printJobRef,
          logRef
        };
      }));

      let dailyProjections: Request[] = [];
      await runTransaction(this.fb.db, async transaction => {
        dailyProjections = [];
        const deductionEntries = Array.from(deductions.entries());
        const inventoryRefs = deductionEntries.map(([name]) =>
          doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', name)
        );
        const inventorySnapshots = await Promise.all(inventoryRefs.map(ref => transaction.get(ref)));

        deductionEntries.forEach(([name, amount], index) => {
          const snapshot = inventorySnapshots[index];
          if (!snapshot.exists()) throw new Error(`Hóa chất "${name}" không tồn tại!`);
          const currentStock = Number(snapshot.data()['stock'] || 0);
          if (currentStock < amount) {
            throw new Error(`Kho không đủ "${name}". Tồn: ${currentStock}, Cần: ${amount}`);
          }
        });

        deductionEntries.forEach(([, amount], index) => {
          transaction.update(inventoryRefs[index], {
            stock: increment(-amount),
            lastUpdated: serverTimestamp()
          });
        });

        prepared.forEach(item => {
          const reqData = item.reqData;
          transaction.set(item.requestRef, sanitizeForFirebase(reqData));
          dailyProjections.push({ id: item.requestRef.id, ...reqData } as Request);

          const printData: PrintData = {
            sop: item.sop,
            inputs: item.formInputs,
            margin: item.formInputs.safetyMargin || 0,
            items: item.calculatedItems,
            analysisDate: item.formInputs.analysisDate,
            requestId: item.requestRef.id
          };
          transaction.set(item.printJobRef, {
            ...sanitizeForFirebase(printData),
            createdAt: serverTimestamp(),
            lastUpdated: serverTimestamp(),
            createdBy: this.getCurrentUserName(),
            createdByUid: this.auth.currentUser()?.uid || ''
          });

          const activityEvent = this.activityEvents.build({
            eventId: item.logRef.id,
            action: 'DIRECT_APPROVE_PLAN',
            details: `Duyệt kế hoạch SmartBatch, SOP: ${item.sop.name}`,
            targetType: 'REQUEST',
            targetId: item.requestRef.id,
            targetName: item.sop.name,
            requestId: item.requestRef.id,
            printable: true,
            printJobId: item.printJobRef.id,
            publicTraceable: true,
            metadata: {
              sopId: item.sop.id,
              analysisDate: item.formInputs.analysisDate,
              planId: `PLAN-${planTimestamp}`
            },
            legacyFields: {
              planId: `PLAN-${planTimestamp}`,
              inventoryDeltas: Object.fromEntries(
                this.getItemsToDeduct(item.calculatedItems).map(deduction => [deduction.name, -deduction.amount])
              ),
              sopBasicInfo: {
                name: item.sop.name,
                category: item.sop.category,
                ref: item.sop.ref
              }
            }
          });
          this.activityEvents.setInTransaction(transaction, item.logRef, activityEvent);
        });
      });
      await this.dailyChecklistMaterializer.materializeRequestsBestEffort(
        dailyProjections,
        'directApproveBatchPlan'
      );

      prepared.forEach(item => {
        let samples = 1; let qcs = 0;
        if (item.formInputs?.['n_sample']) samples = Number(item.formInputs['n_sample']);
        if (item.formInputs?.['n_qc']) qcs = Number(item.formInputs['n_qc']);
        this.statsService.incrementStats(this.getStatsDateForRequest({ analysisDate: item.formInputs?.analysisDate }, new Date()), item.sop.id, item.sop.name, samples, 1, qcs).catch(e => console.error(e));
      });

      return prepared.map(item => ({
        requestId: item.requestRef.id,
        printJobId: item.printJobRef.id,
        logId: item.logRef.id
      }));
    } catch (e: any) {
      this.toast.show(e?.message || 'Không thể duyệt kế hoạch SmartBatch.', 'error');
      return null;
    }
  }

  async approveRequest(req: Request) {
    if (!this.auth.canApprove()) return;
    if (!this.hasValidAnalysisDate(req.analysisDate)) {
      this.toast.show('Yêu cầu chưa có ngày kiểm nghiệm hợp lệ. Hãy bổ sung trước khi duyệt.', 'error');
      return;
    }
    if (!await this.confirmationService.confirm('Xác nhận duyệt và trừ kho?')) return;
    const currentSop = this.sops().find(sop => sop.id === req.sopId);
    const activityRef = this.activityEvents.createRef(`TRC-${Date.now()}-${Math.floor(Math.random() * 1000)}`);

    try {
      const targetScopeSnapshots = await this.buildLegacyTargetScopeTraceability(req, currentSop);
      const approvedProjection: Request = {
        ...req,
        status: 'approved',
        analysisDate: req.analysisDate,
        inputs: { ...(req.inputs || {}), analysisDate: req.analysisDate },
        approvedAt: serverTimestamp(),
        targetScopeSnapshots,
        ...(currentSop ? {
          sopVersion: req.sopVersion ?? currentSop.version ?? 1,
          sopRef: req.sopRef ?? currentSop.ref ?? '',
          targetNames: req.targetNames ?? this.buildSopTraceability(currentSop).targetNames
        } : {})
      };
      await runTransaction(this.fb.db, async (transaction) => {
        const invRefs = req.items.map(item => doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', item.name));
        const invSnaps = await Promise.all(invRefs.map(ref => transaction.get(ref)));

        for (let i = 0; i < req.items.length; i++) {
          const item = req.items[i];
          const invSnap = invSnaps[i];
          if (!invSnap.exists()) throw new Error(`Hóa chất "${item.name}" không tồn tại!`);
          const currentStock = invSnap.data()['stock'] || 0;
          if (currentStock < item.amount) throw new Error(`Kho không đủ "${item.name}". Hiện có: ${currentStock}, Cần: ${item.amount}`);
        }
        for (let i = 0; i < req.items.length; i++) {
          transaction.update(invRefs[i], { stock: increment(-req.items[i].amount), lastUpdated: serverTimestamp() });
        }

        const reqRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests', req.id);
        transaction.update(reqRef, {
          status: 'approved',
          analysisDate: req.analysisDate,
          inputs: { ...(req.inputs || {}), analysisDate: req.analysisDate },
          approvedAt: serverTimestamp(),
          lastUpdated: serverTimestamp(),
          targetScopeSnapshots,
          ...(currentSop ? {
            sopVersion: req.sopVersion ?? currentSop.version ?? 1,
            sopRef: req.sopRef ?? currentSop.ref ?? '',
            targetNames: req.targetNames ?? this.buildSopTraceability(currentSop).targetNames
          } : {})
        });
        const sop = currentSop;

        if (sop && req.inputs) {
          const calcService = this.injector.get(CalculatorService);

          const calculatedItems = calcService.calculateSopNeeds(
            sop,
            req.inputs,
            req.margin || 0,
            this.inventoryMap(),
            {},
            this.safetyConfig()
          );

          calculatedItems.forEach(ci => {
            const ri = req.items.find(r => r.name === ci.name);
            if (ri && ri.displayName) ci.displayName = ri.displayName;

            if (ci.isComposite) {
              ci.breakdown.forEach(sub => {
                const riSub = req.items.find(r => r.name === sub.name);
                if (riSub && riSub.displayName) sub.displayName = riSub.displayName;
              });
            }
          });

          const extendedInputs = { ...req.inputs };
          if (req.sampleList) extendedInputs.sampleList = req.sampleList;
          if (req.targetIds) extendedInputs.targetIds = req.targetIds;
          if (req.sampleTargetMap) extendedInputs.sampleTargetMap = req.sampleTargetMap;
          if (req.sampleDescriptionMap) extendedInputs.sampleDescriptionMap = req.sampleDescriptionMap;

          const printJobRef = doc(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'print_jobs'));
          const printData: PrintData = {
            sop,
            inputs: extendedInputs,
            margin: req.margin || 0,
            items: calculatedItems,
            analysisDate: req.analysisDate,
            requestId: req.id
          };
          transaction.set(printJobRef, {
            ...sanitizeForFirebase(printData),
            createdAt: serverTimestamp(),
            lastUpdated: serverTimestamp(),
            createdBy: this.getCurrentUserName(),
            createdByUid: this.auth.currentUser()?.uid || ''
          });

          const activityEvent = this.activityEvents.build({
            eventId: activityRef.id,
            action: 'APPROVE_REQUEST',
            details: `Duyệt yêu cầu: ${req.sopName}`,
            targetType: 'REQUEST',
            targetId: req.id,
            targetName: req.sopName,
            requestId: req.id,
            printable: true,
            printJobId: printJobRef.id,
            publicTraceable: true,
            metadata: { sopId: req.sopId, analysisDate: req.analysisDate },
            legacyFields: {
              inventoryDeltas: this.getRequestItemInventoryDeltas(req.items, -1),
              sopBasicInfo: {
                name: sop.name,
                category: sop.category,
                ref: sop.ref
              }
            }
          });
          this.activityEvents.setInTransaction(transaction, activityRef, activityEvent);
        } else {
          const activityEvent = this.activityEvents.build({
            eventId: activityRef.id,
            action: 'APPROVE_REQUEST',
            details: `Duyệt yêu cầu: ${req.sopName}`,
            targetType: 'REQUEST',
            targetId: req.id,
            targetName: req.sopName,
            requestId: req.id,
            printable: false,
            publicTraceable: true,
            metadata: { sopId: req.sopId, analysisDate: req.analysisDate }
          });
          this.activityEvents.setInTransaction(transaction, activityRef, activityEvent);
        }
      });
      await this.dispatchActivityNotificationIfEnabled(activityRef.id);
      await this.dailyChecklistMaterializer.materializeRequestBestEffort(
        approvedProjection,
        'approveRequest'
      );

      let samples = 1; let qcs = 0;
      if (req.sampleList && req.sampleList.length > 0) samples = req.sampleList.length;
      else if (req.inputs?.['n_sample']) samples = Number(req.inputs['n_sample']);
      if (req.inputs?.['n_qc']) qcs = Number(req.inputs['n_qc']);
      this.statsService.incrementStats(this.getStatsDateForRequest(req, new Date()), req.sopId, req.sopName, samples, 1, qcs).catch(e => console.error(e));

      this.toast.show(`Duyệt thành công yêu cầu "${req.sopName}"`, 'success');
    } catch (e: any) { this.toast.show(e.message, 'error'); }
  }

  async revokeApproval(req: Request, targetStatus: 'pending' | 'rejected' = 'pending') {
    if (!this.auth.canApprove()) return;
    const activityRef = this.activityEvents.createRef();

    try {
      await runTransaction(this.fb.db, async (transaction) => {
        const invRefs: DocumentReference[] = []; const existingItems: RequestItem[] = [];
        const readPromises = req.items.map(item => { const ref = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', item.name); return transaction.get(ref); });
        const invSnaps = await Promise.all(readPromises);
        for (let i = 0; i < invSnaps.length; i++) { if (invSnaps[i].exists()) { invRefs.push(invSnaps[i].ref); existingItems.push(req.items[i]); } }
        for (let i = 0; i < existingItems.length; i++) { transaction.update(invRefs[i], { stock: increment(existingItems[i].amount), lastUpdated: serverTimestamp() }); }

        const reqRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests', req.id);

        const updates: any = {
          status: targetStatus,
          approvedAt: deleteField(),
          lastUpdated: serverTimestamp()
        };
        if (targetStatus === 'rejected') {
          updates.rejectedAt = serverTimestamp();
        }
        transaction.update(reqRef, updates);
        const actionText = targetStatus === 'rejected' ? 'Hủy & từ chối trực tiếp' : 'Hoàn tác';
        const activityEvent = this.activityEvents.build({
          eventId: activityRef.id,
          action: targetStatus === 'rejected' ? 'REVOKE_AND_REJECT' : 'REVOKE_APPROVE',
          details: `${actionText}: ${req.sopName}`,
          targetType: 'REQUEST',
          targetId: req.id,
          targetName: req.sopName,
          requestId: req.id,
          printable: false,
          metadata: { sopId: req.sopId, newStatus: targetStatus },
          legacyFields: {
            inventoryDeltas: this.getRequestItemInventoryDeltas(req.items, 1)
          }
        });
        this.activityEvents.setInTransaction(transaction, activityRef, activityEvent);
      });
      await this.dispatchActivityNotificationIfEnabled(activityRef.id);
      await this.dailyChecklistMaterializer.deleteEntryBestEffort(
        req.analysisDate,
        req.id,
        'revokeApproval'
      );

      let samples = 1; let qcs = 0;
      if (req.sampleList && req.sampleList.length > 0) samples = req.sampleList.length;
      else if (req.inputs?.['n_sample']) samples = Number(req.inputs['n_sample']);
      if (req.inputs?.['n_qc']) qcs = Number(req.inputs['n_qc']);
      const reqDate = this.getStatsDateForRequest(req, new Date());
      this.statsService.incrementStats(reqDate, req.sopId, req.sopName, samples, 1, qcs, true).catch(e => console.error(e));

      this.toast.show(targetStatus === 'rejected' ? 'Đã hủy và từ chối yêu cầu thành công!' : 'Đã hoàn tác yêu cầu thành công!', 'success');
    } catch (e: any) { this.toast.show(e.message, 'error'); }
  }

  async updateApprovedRequest(req: Request, sop: Sop, calculatedItems: CalculatedItem[], formInputs: any, invMap: Record<string, InventoryItem> = {}) {
    if (!this.auth.canApprove()) return;
    if (!this.hasValidAnalysisDate(formInputs.analysisDate)) {
      this.toast.show('Vui lòng chọn ngày kiểm nghiệm hợp lệ trước khi cập nhật.', 'error');
      return false;
    }
    if (!await this.confirmationService.confirm('Xác nhận lưu thay đổi và cập nhật kho?')) return;

    try {
      const oldItems = req.items;
      const newItems = this.mapToRequestItems(calculatedItems, invMap);
      const targetScopeSnapshots = await this.buildTargetScopeTraceability(sop, formInputs);
      const previousPrintableLogDocs = (await getDocs(query(
        collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'logs'),
        where('requestId', '==', req.id),
        where('printable', '==', true)
      ))).docs;
      const editDiff = this.buildRequestEditDiff(req, formInputs, newItems);
      const updatedProjection: Request = {
        ...req,
        items: newItems,
        inputs: formInputs,
        margin: formInputs.safetyMargin || 0,
        analysisDate: formInputs.analysisDate,
        sampleList: formInputs.sampleList || [],
        targetIds: formInputs.targetIds || [],
        sampleTargetMap: formInputs.sampleTargetMap || {},
        sampleDescriptionMap: formInputs.sampleDescriptionMap,
        targetScopeSnapshots,
        ...this.buildSopTraceability(sop)
      };

      // Calculate inventory diff
      const inventoryDiff: Record<string, number> = {};

      // Add back old items (positive diff)
      oldItems.forEach(item => {
        inventoryDiff[item.name] = (inventoryDiff[item.name] || 0) + item.amount;
      });

      // Subtract new items (negative diff)
      const itemsToDeduct = this.getItemsToDeduct(calculatedItems);
      itemsToDeduct.forEach(item => {
        inventoryDiff[item.name] = (inventoryDiff[item.name] || 0) - item.amount;
      });

      // Round to avoid floating point issues
      Object.keys(inventoryDiff).forEach(key => {
        inventoryDiff[key] = Math.round(inventoryDiff[key] * 1000000) / 1000000;
      });

      await runTransaction(this.fb.db, async (transaction) => {
        // 1. Check inventory for negative diffs
        const invRefs: Record<string, DocumentReference> = {};
        const invSnaps: Record<string, any> = {};

        for (const itemName of Object.keys(inventoryDiff)) {
          const ref = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', itemName);
          invRefs[itemName] = ref;
          invSnaps[itemName] = await transaction.get(ref);

          if (inventoryDiff[itemName] < 0) {
            if (!invSnaps[itemName].exists()) throw new Error(`Hóa chất "${itemName}" không tồn tại!`);
            const currentStock = invSnaps[itemName].data()['stock'] || 0;
            if (currentStock < Math.abs(inventoryDiff[itemName])) {
              throw new Error(`Kho không đủ "${itemName}" để cập nhật. Hiện có: ${currentStock}, Cần thêm: ${Math.abs(inventoryDiff[itemName])}`);
            }
          }
        }

        // 2. Update inventory
        for (const itemName of Object.keys(inventoryDiff)) {
          if (inventoryDiff[itemName] !== 0) {
            transaction.set(invRefs[itemName], { stock: increment(inventoryDiff[itemName]), lastUpdated: serverTimestamp() }, { merge: true });
          }
        }

        // 3. Update request document
        const reqRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests', req.id);
        const reqData: any = {
          items: newItems,
          inputs: formInputs,
          margin: formInputs.safetyMargin || 0,
          analysisDate: formInputs.analysisDate || null,
          updatedAt: serverTimestamp(),
          lastUpdated: serverTimestamp(),
          ...this.buildSopTraceability(sop)
        };
        reqData.targetScopeSnapshots = targetScopeSnapshots;
        if (formInputs.sampleList) reqData.sampleList = formInputs.sampleList;
        else reqData.sampleList = deleteField();

        if (formInputs.targetIds) reqData.targetIds = formInputs.targetIds;
        else reqData.targetIds = deleteField();

        if (formInputs.sampleTargetMap) reqData.sampleTargetMap = formInputs.sampleTargetMap;
        else reqData.sampleTargetMap = deleteField();

        if (formInputs.sampleDescriptionMap) reqData.sampleDescriptionMap = formInputs.sampleDescriptionMap;
        else if ('sampleDescriptionMap' in formInputs) reqData.sampleDescriptionMap = deleteField();

        transaction.update(reqRef, sanitizeForFirebase(reqData));

        // 4. Create a new log and print job for the update
        const logId = `TRC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const logRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'logs', logId);

        previousPrintableLogDocs.forEach(logDoc => {
          transaction.update(logDoc.ref, {
            printable: false,
            supersededBy: logId,
            lastUpdated: serverTimestamp()
          });
        });

        const printJobRef = doc(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'print_jobs'));
        const printData: PrintData = {
          sop,
          inputs: formInputs,
          margin: formInputs.safetyMargin || 0,
          items: calculatedItems,
          analysisDate: formInputs.analysisDate,
          requestId: req.id
        };
        transaction.set(printJobRef, {
          ...sanitizeForFirebase(printData),
          createdAt: serverTimestamp(),
          lastUpdated: serverTimestamp(),
          createdBy: this.getCurrentUserName(),
          createdByUid: this.auth.currentUser()?.uid || ''
        });

        const activityEvent = this.activityEvents.build({
          eventId: logRef.id,
          action: 'EDIT_REQUEST',
          details: `Chỉnh sửa phiếu: ${req.sopName}`,
          targetType: 'REQUEST',
          targetId: req.id,
          targetName: req.sopName,
          requestId: req.id,
          printable: true,
          printJobId: printJobRef.id,
          publicTraceable: true,
          metadata: { sopId: req.sopId, analysisDate: formInputs.analysisDate },
          legacyFields: {
            diff: editDiff,
            inventoryDeltas: inventoryDiff,
            supersedesLogIds: previousPrintableLogDocs.map(d => d.id),
            sopBasicInfo: {
              name: sop.name,
              category: sop.category,
              ref: sop.ref
            }
          }
        });
        this.activityEvents.setInTransaction(transaction, logRef, activityEvent);
      });
      await this.dailyChecklistMaterializer.syncRequestBestEffort(
        updatedProjection,
        req.analysisDate,
        'updateApprovedRequest'
      );

      let oldSamples = 1; let oldQcs = 0;
      if (req.sampleList && req.sampleList.length > 0) oldSamples = req.sampleList.length;
      else if (req.inputs?.['n_sample']) oldSamples = Number(req.inputs['n_sample']);
      if (req.inputs?.['n_qc']) oldQcs = Number(req.inputs['n_qc']);

      let newSamples = 1; let newQcs = 0;
      if (formInputs.sampleList && formInputs.sampleList.length > 0) newSamples = formInputs.sampleList.length;
      else if (formInputs['n_sample']) newSamples = Number(formInputs['n_sample']);
      if (formInputs['n_qc']) newQcs = Number(formInputs['n_qc']);

      const oldStatsDate = this.getStatsDateForRequest(req, new Date());
      const newStatsDate = this.getStatsDateForRequest({ analysisDate: formInputs.analysisDate }, new Date());
      if (oldStatsDate.toDateString() !== newStatsDate.toDateString()) {
        this.statsService.incrementStats(oldStatsDate, req.sopId, req.sopName, oldSamples, 1, oldQcs, true).catch(e => console.error(e));
        this.statsService.incrementStats(newStatsDate, sop.id, sop.name, newSamples, 1, newQcs).catch(e => console.error(e));
      } else {
        const sampleDelta = newSamples - oldSamples;
        const qcDelta = newQcs - oldQcs;
        if (sampleDelta !== 0) {
          this.statsService.incrementStats(oldStatsDate, sop.id, sop.name, Math.abs(sampleDelta), 0, 0, sampleDelta < 0).catch(e => console.error(e));
        }
        if (qcDelta !== 0) {
          this.statsService.incrementStats(oldStatsDate, sop.id, sop.name, 0, 0, Math.abs(qcDelta), qcDelta < 0).catch(e => console.error(e));
        }
      }

      this.toast.show(`Cập nhật thành công phiếu #${req.id.substring(0, 8)}`, 'success');
      return true;
    } catch (e: any) {
      this.toast.show(e.message, 'error');
      return false;
    }
  }

  private buildRequestEditDiff(req: Request, formInputs: any, newItems: RequestItem[]) {
    const diff: { field: string; oldValue: any; newValue: any }[] = [];
    const add = (field: string, oldValue: any, newValue: any) => {
      if (JSON.stringify(oldValue ?? null) !== JSON.stringify(newValue ?? null)) {
        diff.push({ field, oldValue: oldValue ?? null, newValue: newValue ?? null });
      }
    };

    add('analysisDate', req.analysisDate, formInputs.analysisDate);
    add('sampleList', req.sampleList || [], formInputs.sampleList || []);
    add('targetIds', [...(req.targetIds || [])].sort(), [...(formInputs.targetIds || [])].sort());
    add('sampleTargetMap', req.sampleTargetMap || {}, formInputs.sampleTargetMap || {});
    add('sampleDescriptionMap', req.sampleDescriptionMap || req.inputs?.sampleDescriptionMap || {}, formInputs.sampleDescriptionMap || {});
    add('margin', req.margin ?? req.inputs?.safetyMargin, formInputs.safetyMargin);

    const ignoredInputKeys = new Set(['analysisDate', 'safetyMargin', 'sampleList', 'targetIds', 'sampleTargetMap', 'sampleDescriptionMap', 'explicitGroupId']);
    const oldInputs = req.inputs || {};
    const inputKeys = new Set([...Object.keys(oldInputs), ...Object.keys(formInputs || {})]);
    inputKeys.forEach(key => {
      if (!ignoredInputKeys.has(key)) add(`input.${key}`, oldInputs[key], formInputs[key]);
    });

    const summarizeItems = (items: RequestItem[]) => Object.fromEntries(
      [...items].sort((a, b) => a.name.localeCompare(b.name)).map(item => [
        item.name,
        {
          amount: Math.round(Number(item.amount || 0) * 1000000) / 1000000,
          unit: item.stockUnit || item.unit || ''
        }
      ])
    );
    add('inventoryItems', summarizeItems(req.items || []), summarizeItems(newItems || []));

    return diff;
  }

  async rejectRequest(req: Request) {
    if (!this.auth.canApprove()) return;
    if (!await this.confirmationService.confirm({ message: 'Từ chối yêu cầu này?', confirmText: 'Từ chối', isDangerous: true, })) return;
    try {
      await updateDoc(doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests', req.id), { status: 'rejected', rejectedAt: serverTimestamp(), lastUpdated: serverTimestamp() });
      await this.dailyChecklistMaterializer.deleteEntryBestEffort(
        req.analysisDate,
        req.id,
        'rejectRequest'
      );
      this.toast.show('Đã từ chối', 'info');
    } catch (e) { this.toast.show('Lỗi xử lý', 'error'); }
  }

  async deletePrintLog(logId: string, sopName: string, printJobId?: string) {
    try {
      const batch = writeBatch(this.fb.db);
      const logRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'logs', logId);
      batch.update(logRef, { printable: false, lastUpdated: serverTimestamp() });
      await batch.commit();
      this.toast.show('Đã xóa phiếu in khỏi hàng đợi');
    } catch (e: any) {
      this.toast.show('Lỗi xóa phiếu: ' + e.message, 'error');
    }
  }

  async deleteSelectedPrintLogs(logs: Log[]) {
    try {
      const batch = writeBatch(this.fb.db);
      logs.forEach(log => {
        batch.update(doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'logs', log.id), { printable: false, lastUpdated: serverTimestamp() });
      });
      await batch.commit();
      this.toast.show(`Đã xóa ${logs.length} phiếu khỏi hàng đợi`);
    } catch (e: any) {
      this.toast.show('Lỗi xóa phiếu: ' + e.message, 'error');
    }
  }
}
