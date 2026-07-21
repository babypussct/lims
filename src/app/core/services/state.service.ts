import { Injectable, signal, computed, inject, effect, OnDestroy, Injector } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { AuthService } from './auth.service';
import {
  collection, onSnapshot, doc, getDoc, runTransaction,
  addDoc, updateDoc, query, orderBy, limit, where,
  serverTimestamp, increment, setDoc, getDocs, deleteDoc, deleteField,
  Unsubscribe, DocumentReference, writeBatch, QueryDocumentSnapshot
} from 'firebase/firestore';
import { ToastService } from './toast.service';
import { ConfirmationService } from './confirmation.service';
import { CalculatorService } from './calculator.service';
import { DeltaSyncService, DeltaSyncConfig } from './delta-sync.service';

// Import Models
import { InventoryItem, StockHistoryItem } from '../models/inventory.model';
import { Sop, CalculatedItem, TargetGroup } from '../models/sop.model';
import { Request, RequestItem } from '../models/request.model';
import { Log, PrintData } from '../models/log.model';
import { PrintConfig, SafetyConfig, CategoryItem } from '../models/config.model';
import { ReferenceStandard, StandardRequest } from '../models/standard.model';
import { sanitizeForFirebase } from '../../shared/utils/utils';
import { TargetService } from '../../features/targets/target.service';
import { buildTargetScopeSnapshots } from '../../features/targets/target-scope-classifier';

@Injectable({ providedIn: 'root' })
export class StateService implements OnDestroy {
  private fb = inject(FirebaseService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private confirmationService = inject(ConfirmationService);
  private injector = inject(Injector);
  private deltaSync = inject(DeltaSyncService);
  private targetService = inject(TargetService);

  private listeners: Unsubscribe[] = [];
  /** Singleton request listener — unregister callback (không hủy listener) */
  private _unregisterStdReqListener?: () => void;

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
  logs = signal<Log[]>([]);
  printableLogs = signal<Log[]>([]);

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
    { id: 'reagent', name: 'Hóa chất (General)' },
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

  systemVersion = signal<string>('v26.07.21-b02');
  maintenanceMode = signal<boolean>(false);
  maintenanceMessage = signal<string>('Hệ thống đang được bảo trì. Vui lòng quay lại sau ít phút.');
  maintenanceScheduledTime = signal<string | null>(null);

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
  sidebarOpen = signal<boolean>(false);
  sidebarCollapsed = signal<boolean>(
    localStorage.getItem('sidebar_collapsed') !== 'false' // Mặc định: collapsed (trừ khi user đã mở trước đó)
  );

  // --- FOCUS MODE (New Feature) ---
  focusMode = signal<boolean>(false);

  // --- DARK MODE ---
  darkMode = signal<boolean>(false);

  constructor() {
    // Initialize Dark Mode from localStorage
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    this.darkMode.set(savedDarkMode);
    this.applyDarkMode(savedDarkMode);

    effect(() => {
      const user = this.auth.currentUser();
      const perms = this.auth.userPermissions();
      if (user && perms.length > 0) {
        this.initData();
        // checkSystemHealth() removed from auto-call — call manually from Admin panel
      } else {
        this.cleanupListeners();
      }
    }, { allowSignalWrites: true });
  }

  toggleSidebar() { this.sidebarOpen.update(v => !v); }
  closeSidebar() { this.sidebarOpen.set(false); }
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
    this.darkMode.update(v => {
      const newVal = !v;
      localStorage.setItem('darkMode', String(newVal));
      this.applyDarkMode(newVal);
      return newVal;
    });
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
  }

  private cleanupListeners() {
    this.listeners.forEach(unsub => unsub());
    this.listeners = [];
    if (this._unregisterStdReqListener) {
      this._unregisterStdReqListener();
      this._unregisterStdReqListener = undefined;
    }
    // Hủy tất cả DeltaSync singletons (reference_standards, standard_requests, ...)
    this.deltaSync.destroyAll();
    this.sops.set([]);
    this.inventory.set([]);
    this.standards.set([]);
    this.requests.set([]); this.approvedRequests.set([]); this.standardRequests.set([]); this.allStandardRequests.set([]);
    this.logs.set([]);
    this.printableLogs.set([]);
    this.usersInfoCache.set(new Map());
  }

  ngOnDestroy() { this.cleanupListeners(); }

  async initData() {
    this.cleanupListeners();
    this.permissionError.set(false);

    const handleError = (source: string) => (error: any) => {
      console.warn(`${source} listener error:`, error.message);
      if (error.code === 'permission-denied') {
        this.permissionError.set(true);
      } else {
        // Lỗi mạng/quota → hiển thị banner offline cho user
        this.isOffline.set(true);
        this.offlineSource.set(source);
      }
    };

    // 1. Inventory Listener
    if (this.auth.hasPermission('inventory_view')) {
      const invSub = onSnapshot(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory'), (s) => {
        const items: InventoryItem[] = [];
        s.forEach(d => {
          const data = d.data();
          // Lọc rác Soft Delete ra khỏi State Memory
          if (data['_isDeleted'] !== true) {
            items.push({ id: d.id, ...data } as InventoryItem);
          }
        });
        this.inventory.set(items);
      }, handleError('Inventory'));
      this.listeners.push(invSub);
    }

    // 2. SOPs Listener
    if (this.auth.hasPermission('sop_view')) {
      const sopSub = onSnapshot(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'sops'), (s) => {
        const items: Sop[] = []; s.forEach(d => items.push({ id: d.id, ...d.data() } as Sop));
        this.sops.set(items.sort((a, b) => a.name.localeCompare(b.name)));
      }, handleError('SOPs'));
      this.listeners.push(sopSub);
    }

    // 3. Requests Listeners
    if (this.auth.hasPermission('sop_view') || this.auth.hasPermission('batch_run')) {
      const reqSub = onSnapshot(query(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests'), where('status', '==', 'pending'), orderBy('timestamp', 'desc')),
        (s) => { const items: Request[] = []; s.forEach(d => items.push({ id: d.id, ...d.data() } as Request)); this.requests.set(items); }, handleError('Requests'));
      this.listeners.push(reqSub);
    }

    // OPTIMIZED: standards listener removed (legacy collection, no writes exist)
    // statistics.component.ts uses loadAllStandardRequests() on-demand instead

    // standard_requests: subscribe vào singleton của StandardRequestService
    // (tránh tạo listener trùng lặp — tiết kiệm ~89% reads)
    {
      const { StandardRequestService } = await import('../../features/standards/services/standard-request.service');
      const reqService = this.injector.get(StandardRequestService);

      if (this._unregisterStdReqListener) this._unregisterStdReqListener();

      // Lọc theo role ở client-side (singleton đã fetch đúng data theo role)
      const isApprover = this.auth.canApproveStandards();
      const validStatuses = isApprover
        ? ['PENDING_APPROVAL', 'PENDING_RETURN']
        : ['PENDING_APPROVAL', 'IN_PROGRESS', 'PENDING_RETURN'];

      this._unregisterStdReqListener = reqService.startRequestsListener((reqs) => {
        this.standardRequests.set(
          reqs.filter(r => !r._isDeleted && validStatuses.includes(r.status))
        );
      });
    }

    // OPTIMIZED: allStandardRequests is now loaded on-demand via loadAllStandardRequests()
    // Call it from statistics.component.ts / standard-requests page as needed

    const approvedRunsConfig: DeltaSyncConfig = {
      cacheKey: `lims_approved_requests_cache_${this.fb.APP_ID}`,
      cursorKey: `lims_approved_requests_cursor_${this.fb.APP_ID}`,
      collectionPath: `artifacts/${this.fb.APP_ID}/requests`,
      maxCacheSize: 100, // Safe limit for localStorage
      orderByField: 'approvedAt',
      orderDirection: 'desc',
      queryConstraints: [where('status', 'in', ['approved', 'draft', 'completed', 'pending', 'rejected'])]
    };

    if (this.auth.hasPermission('sop_view') || this.auth.hasPermission('batch_run') || this.auth.canViewReports()) {
      const appSub = this.deltaSync.startSingletonListener<Request>(approvedRunsConfig, (runs) => {
        this.approvedRequests.set(runs.filter(r => ['approved', 'draft', 'completed'].includes(r.status)));
      });
      this.listeners.push(appSub);
    }

    // 4. Logs Listener — OPTIMIZED: migrated to DeltaSyncService singleton listener (caching 200 logs)
    const logsSyncConfig: DeltaSyncConfig = {
      cacheKey: `lims_logs_cache_${this.fb.APP_ID}`,
      cursorKey: `lims_logs_cursor_${this.fb.APP_ID}`,
      collectionPath: `artifacts/${this.fb.APP_ID}/logs`,
      maxCacheSize: 200,
      orderByField: 'timestamp',
      orderDirection: 'desc'
    };

    const logSub = this.deltaSync.startSingletonListener<Log>(logsSyncConfig, (items) => {
      this.logs.set(items);
      this.printableLogs.set(items.filter(l => l.printable === true));
    });
    this.listeners.push(logSub);

    // 5. Stats — OPTIMIZED: replaced onSnapshot with single getDoc
    try {
      const statSnap = await getDoc(doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'stats', 'master'));
      if (statSnap.exists()) this.stats.set(statSnap.data() as { totalSopsRun: number; totalItemsUsed: number });
    } catch (e) { console.warn('Stats load error:', e); }

    // 6. Config — OPTIMIZED: 4 onSnapshot listeners → single loadConfig() call
    await this.loadConfig();

    // 6.5. Users Info Cache for Avatar Rendering in Logs
    const usersSub = onSnapshot(collection(this.fb.db, `artifacts/${this.fb.APP_ID}/users`), (s) => {
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
        this.usersInfoCache.set(cacheMap);
    }, handleError('Users Cache'));
    this.listeners.push(usersSub);

    // 7. System Force Reload Listener & Delta Sync Architecture
    let isFirstMetaLoad = true;
    let lastSyncTimes: Record<string, number> = {};

    const sysMetaSub = onSnapshot(doc(this.fb.db, `artifacts/${this.fb.APP_ID}/system/metadata`), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const forceTime = data['force_clear_cache_time'] || 0;
        const localTime = Number(localStorage.getItem('lims_cache_purge_time') || 0);

        if (forceTime > localTime) {
          localStorage.setItem('lims_cache_purge_time', forceTime.toString());
          this.toast.show('Quản trị viên vừa làm sạch Hệ thống. Đang kết nối lại sau 2 giây...', 'info');
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
          const stdActions = ['CREATE_STANDARD', 'UPDATE_STANDARD', 'UPDATE_STOCK', 'SOFT_DELETE_BATCH', 'RESTORE_STANDARD'];
          const latestLog = this.logs().find(l => stdActions.includes(l.action));
          const msg = latestLog ? buildStandardsToastMessage(latestLog) : '📊 Danh sách chuẩn đối chiếu vừa được cập nhật.';
          this.toast.showEvent({ message: msg, type: 'info', dedupeKey: `std-sync-${data['standards']}` });
        }

        if (data['inventory'] > (lastSyncTimes['inventory'] || 0)) {
          lastSyncTimes['inventory'] = data['inventory'];
          const invActions = ['CREATE_ITEM', 'UPDATE_INFO', 'STOCK_IN', 'STOCK_OUT', 'SOFT_DELETE_ITEM', 'RESTORE_ITEM', 'BULK_ZERO'];
          const latestLog = this.logs().find(l => invActions.includes(l.action));
          const msg = latestLog ? buildInventoryToastMessage(latestLog) : '🧪 Kho hóa chất vừa có thay đổi.';
          this.toast.showEvent({ message: msg, type: 'info', dedupeKey: `inv-sync-${data['inventory']}` });
        }

        if (data['config'] > (lastSyncTimes['config'] || 0)) {
          lastSyncTimes['config'] = data['config'];
          const wasMaintenance = this.maintenanceMode();
          // Tự động tải lại cấu hình ngầm để nhận trạng thái bảo trì hoặc cấu hình mới nhất
          this.loadConfig().then(() => {
            if (wasMaintenance === this.maintenanceMode()) {
              this.toast.show('⚙️ Cấu hình hệ thống đã được cập nhật.', 'success');
            }
          });
        }
      }
    }, handleError('System Metadata'));
    this.listeners.push(sysMetaSub);
  }

  // ─── CONFIG: Version-based Caching (Optimized for Spark Plan) ───────────
  private readonly CONFIG_CACHE_KEY = 'lims_cfg_cache';
  private readonly CONFIG_VERSION_KEY = 'lims_cfg_version';

  async loadConfig(): Promise<void> {
    // Instant: apply from localStorage cache first (0 reads)
    const hasCache = this._applyConfigFromCache();

    // Background: fetch only '_metadata' to check if we need to download everything
    try {
      const base = `artifacts/${this.fb.APP_ID}/config`;
      const metaSnap = await getDoc(doc(this.fb.db, base, '_metadata'));

      const serverVersion = metaSnap.exists() ? metaSnap.data()['lastUpdated'] || 0 : 0;
      const localVersion = Number(localStorage.getItem(this.CONFIG_VERSION_KEY) || 0);

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
      this.maintenanceScheduledTime.set(cache.system?.['maintenanceScheduledTime'] || null);
      return true;
    } catch (_) { return false; /* ignore stale/corrupt cache */ }
  }

  // ─── allStandardRequests: Load on-demand (not realtime) ──────────────────────
  async loadAllStandardRequests(): Promise<void> {
    try {
      const isApprover = this.auth.canApproveStandards();
      const currentUser = this.auth.currentUser();
      const roleKey = isApprover ? 'admin' : (currentUser?.uid || 'guest');

      const cacheKey = `lims_all_standard_requests_cache_${roleKey}_${this.fb.APP_ID}`;
      const cached = this.deltaSync.getCache<any>(cacheKey);
      if (cached && cached.length > 0) {
        this.allStandardRequests.set(cached.filter((r: any) => !r._isDeleted));
        return;
      }

      const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'standard_requests');
      const constraints: any[] = [orderBy('requestDate', 'desc'), limit(300)];
      if (!isApprover && currentUser) {
        constraints.unshift(where('requestedBy', '==', currentUser.uid));
      }
      const q = query(colRef, ...constraints);
      const snap = await getDocs(q);
      this.allStandardRequests.set(snap.docs.map(d => ({ id: d.id, ...d.data() } as StandardRequest)).filter(r => !r._isDeleted));
    } catch (e) { console.warn('loadAllStandardRequests error:', e); }
  }

  // ─── standards (reference_standards): Load on-demand for Statistics ───────────
  // Replaces the removed realtime listener on the legacy 'standards' collection.
  // Populates state.standards() signal so statistics.component.ts works unchanged.
  async loadReferenceStandards(): Promise<void> {
    try {
      const cacheKey = 'lims_reference_standards_cache_' + this.fb.APP_ID;
      const cached = this.deltaSync.getCache<any>(cacheKey);
      if (cached && cached.length > 0) {
        this.standards.set(cached);
        return;
      }

      const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'reference_standards');
      const q = query(colRef, orderBy('received_date', 'desc'), limit(300));
      const snap = await getDocs(q);
      this.standards.set(snap.docs.map(d => ({ id: d.id, ...d.data() } as ReferenceStandard)));
    } catch (e) { console.warn('loadReferenceStandards error:', e); }
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

  async logMaintenanceActivity(action: string, details: string) {
    try {
      const logRef = doc(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'logs'));
      await setDoc(logRef, {
        action,
        details,
        timestamp: serverTimestamp(),
        lastUpdated: serverTimestamp(),
        user: this.getCurrentUserName(),
        printable: false
      });
    } catch (e) {
      console.warn("Failed to write maintenance audit log:", e);
    }
  }

  public getCurrentUserName(): string { return this.auth.currentUser()?.displayName || 'Unknown User'; }

  // ... (Rest of the file remains unchanged: mapToRequestItems, submitRequest, directApproveAndPrint, approveRequest, revokeApproval, etc.)
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

  private buildSopTraceability(sop: Sop): Pick<Request, 'sopVersion' | 'sopRef' | 'targetNames'> {
    return {
      sopVersion: sop.version || 1,
      sopRef: sop.ref || '',
      targetNames: Object.fromEntries((sop.targets || []).map(target => [target.id, target.name]))
    };
  }

  private async buildTargetScopeTraceability(sop: Sop, formInputs: any) {
    let availableGroups: TargetGroup[] = [];
    try {
      availableGroups = await this.targetService.getAllGroups();
    } catch {
      // Scope classification can still safely snapshot SOP-all/manual without current groups.
    }
    return sanitizeForFirebase(buildTargetScopeSnapshots({
      sampleTargetMap: formInputs.sampleTargetMap,
      fallbackTargetIds: formInputs.targetIds,
      sopId: sop.id,
      sopVersion: sop.version || 1,
      sopTargetSnapshot: Object.fromEntries((sop.targets || []).map(target => [target.id, target.name])),
      availableGroups,
      explicitGroupId: formInputs.explicitGroupId
    }));
  }

  private async buildLegacyTargetScopeTraceability(req: Request, currentSop?: Sop) {
    if (req.targetScopeSnapshots?.length) return req.targetScopeSnapshots;
    let availableGroups: TargetGroup[] = [];
    try {
      availableGroups = await this.targetService.getAllGroups();
    } catch {
      // Historical SOP snapshot remains authoritative when group metadata is unavailable.
    }
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

  async directApproveAndPrint(sop: Sop, calculatedItems: CalculatedItem[], formInputs: any, invMap: Record<string, InventoryItem> = {}): Promise<{ logId: string, printJobId: string } | null> {
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
          createdBy: this.getCurrentUserName()
        });

        transaction.set(logRef, {
          action: 'DIRECT_APPROVE',
          details: `Duyệt trực tiếp SOP: ${sop.name}`,
          timestamp: serverTimestamp(),
          lastUpdated: serverTimestamp(),
          user: this.getCurrentUserName(),
          printable: true,
          printJobId: printJobRef.id,
          requestId: reqRef.id,
          sopBasicInfo: {
            name: sop.name,
            category: sop.category,
            ref: sop.ref
          }
        });
      });
      this.toast.show(`Duyệt thành công yêu cầu "${sop.name}"`, 'success');
      return { logId: logRef.id, printJobId: printJobRef.id };

    } catch (e: any) {
      if (e.code === 'resource-exhausted') this.toast.show('Lỗi: Hết hạn mức Quota.', 'error');
      else this.toast.show(e.message, 'error');
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

    try {
      const targetScopeSnapshots = await this.buildLegacyTargetScopeTraceability(req, currentSop);
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

        const logId = `TRC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const logRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'logs', logId);

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
            createdBy: this.getCurrentUserName()
          });

          transaction.set(logRef, {
            action: 'APPROVE_REQUEST',
            details: `Duyệt yêu cầu: ${req.sopName}`,
            timestamp: serverTimestamp(),
            lastUpdated: serverTimestamp(),
            user: this.getCurrentUserName(),
            printable: true,
            printJobId: printJobRef.id,
            requestId: req.id,
            sopBasicInfo: {
              name: sop.name,
              category: sop.category,
              ref: sop.ref
            }
          });
        } else {
          transaction.set(logRef, {
            action: 'APPROVE_REQUEST', details: `Duyệt yêu cầu: ${req.sopName}`, timestamp: serverTimestamp(), lastUpdated: serverTimestamp(), user: this.getCurrentUserName(), printable: false, requestId: req.id
          });
        }
      });
      this.toast.show(`Duyệt thành công yêu cầu "${req.sopName}"`, 'success');
    } catch (e: any) { this.toast.show(e.message, 'error'); }
  }

  async revokeApproval(req: Request, targetStatus: 'pending' | 'rejected' = 'pending') {
    if (!this.auth.canApprove()) return;

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

        const logRef = doc(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'logs'));
        const actionText = targetStatus === 'rejected' ? 'Hủy & từ chối trực tiếp' : 'Hoàn tác';
        transaction.set(logRef, { 
          action: targetStatus === 'rejected' ? 'REVOKE_AND_REJECT' : 'REVOKE_APPROVE', 
          details: `${actionText}: ${req.sopName}`, 
          timestamp: serverTimestamp(), 
          lastUpdated: serverTimestamp(), 
          user: this.getCurrentUserName(), 
          printable: false, 
          requestId: req.id 
        });
      });
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
          createdBy: this.getCurrentUserName()
        });

        transaction.set(logRef, {
          action: 'EDIT_REQUEST',
          details: `Chỉnh sửa phiếu: ${req.sopName}`,
          timestamp: serverTimestamp(),
          lastUpdated: serverTimestamp(),
          user: this.getCurrentUserName(),
          printable: true,
          printJobId: printJobRef.id,
          requestId: req.id,
          sopBasicInfo: {
            name: sop.name,
            category: sop.category,
            ref: sop.ref
          }
        });
      });
      this.toast.show(`Cập nhật thành công phiếu #${req.id.substring(0, 8)}`, 'success');
      return true;
    } catch (e: any) {
      this.toast.show(e.message, 'error');
      return false;
    }
  }

  async rejectRequest(req: Request) {
    if (!this.auth.canApprove()) return;
    if (!await this.confirmationService.confirm({ message: 'Từ chối yêu cầu này?', confirmText: 'Từ chối', isDangerous: true, })) return;
    try {
      await updateDoc(doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests', req.id), { status: 'rejected', rejectedAt: serverTimestamp(), lastUpdated: serverTimestamp() });
      this.toast.show('Đã từ chối', 'info');
    } catch (e) { this.toast.show('Lỗi xử lý', 'error'); }
  }

  async deletePrintLog(logId: string, sopName: string, printJobId?: string) {
    try {
      const batch = writeBatch(this.fb.db);
      const logRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'logs', logId);
      batch.update(logRef, { printable: false, lastUpdated: serverTimestamp() });
      if (printJobId) {
        const jobRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'print_jobs', printJobId);
        batch.delete(jobRef);
      }
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
        if (log.printJobId) {
          batch.delete(doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'print_jobs', log.printJobId));
        }
      });
      await batch.commit();
      this.toast.show(`Đã xóa ${logs.length} phiếu khỏi hàng đợi`);
    } catch (e: any) {
      this.toast.show('Lỗi xóa phiếu: ' + e.message, 'error');
    }
  }
}

function buildInventoryToastMessage(log: Log): string {
  const who = log.user || 'Ai đó';
  switch (log.action) {
    case 'CREATE_ITEM':  return `🧪 [${who}] Thêm mới hóa chất vào kho: ${log.details.replace('Tạo mới: ', '')}`;
    case 'STOCK_IN':     return `🧪 [${who}] Nhập kho: ${log.details.replace('Điều chỉnh kho ', '').replace(': +', ' (+') + ')'}`;
    case 'STOCK_OUT':    return `🧪 [${who}] Xuất kho: ${log.details}`;
    case 'UPDATE_INFO':  return `🧪 [${who}] Cập nhật hóa chất: ${log.targetId || ''}`;
    case 'SOFT_DELETE_ITEM': return `🧪 [${who}] Xóa hóa chất: ${log.details.replace('Đưa vào Thùng rác: ', '')}`;
    default: return `🧪 [${who}] Kho hóa chất vừa có thay đổi.`;
  }
}

function buildStandardsToastMessage(log: Log): string {
  const who = log.user || 'Ai đó';
  switch (log.action) {
    case 'CREATE_STANDARD':   return `📊 [${who}] Thêm chuẩn mới: ${log.details.replace('Thêm chuẩn mới: ', '')}`;
    case 'UPDATE_STANDARD':   return `📊 [${who}] Cập nhật chuẩn: ${log.details.replace('Cập nhật chuẩn: ', '')}`;
    case 'UPDATE_STOCK':      return `📊 [${who}] Điều chỉnh tồn kho chuẩn: ${log.details}`;
    case 'SOFT_DELETE_BATCH': return `📊 [${who}] Xóa chuẩn: ${log.details}`;
    case 'RESTORE_STANDARD':  return `📊 [${who}] Khôi phục chuẩn: ${log.details.replace('Khôi phục chuẩn đối chiếu: ', '')}`;
    default: return `📊 [${who}] Danh sách chuẩn đối chiếu vừa được cập nhật.`;
  }
}
