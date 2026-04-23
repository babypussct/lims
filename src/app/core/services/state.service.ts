
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

// Import Models
import { InventoryItem, StockHistoryItem } from '../models/inventory.model';
import { Sop, CalculatedItem } from '../models/sop.model';
import { Request, RequestItem } from '../models/request.model';
import { Log, PrintData } from '../models/log.model';
import { PrintConfig, SafetyConfig, CategoryItem } from '../models/config.model';
import { sanitizeForFirebase } from '../../shared/utils/utils';

@Injectable({ providedIn: 'root' })
export class StateService implements OnDestroy {
  private fb = inject(FirebaseService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private confirmationService = inject(ConfirmationService);
  private injector = inject(Injector);

  private listeners: Unsubscribe[] = [];

  // --- DATA SIGNALS ---
  inventory = signal<InventoryItem[]>([]);
  inventoryMap = computed(() => {
      const map: Record<string, InventoryItem> = {};
      this.inventory().forEach(i => map[i.id] = i);
      return map;
  });

  sops = signal<Sop[]>([]); 
  requests = signal<Request[]>([]); 
  standards = signal<any[]>([]);
  standardRequests = signal<any[]>([]); 
  allStandardRequests = signal<any[]>([]);
  approvedRequests = signal<Request[]>([]);
  logs = signal<Log[]>([]); 
  printableLogs = signal<Log[]>([]); 
  
  stats = signal<any>({ totalSopsRun: 0, totalItemsUsed: 0 });
  
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

  // NEW: Avatar Style Preference (Default: Initials for professional look)
  avatarStyle = signal<string>('initials');

  systemVersion = signal<string>('V1.0 FINAL');

  selectedSop = signal<Sop | null>(null);
  editingSop = signal<Sop | null>(null);
  
  cachedCalculatorState = signal<{ sopId: string, formValues: any } | null>(null);

  currentUser = this.auth.currentUser;
  isAdmin = computed(() => this.auth.currentUser()?.role === 'manager');
  
  isSystemHealthy = signal<boolean>(true);
  permissionError = signal<boolean>(false);
  
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
      if (user) {
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
    this.sops.set([]);
    this.inventory.set([]);
    this.standards.set([]);
    this.requests.set([]); this.approvedRequests.set([]); this.standardRequests.set([]); this.allStandardRequests.set([]);
    this.logs.set([]);
    this.printableLogs.set([]);
  }

  ngOnDestroy() { this.cleanupListeners(); }

  async initData() {
    this.cleanupListeners();
    this.permissionError.set(false);

    const handleError = (source: string) => (error: any) => {
      console.warn(`${source} listener error:`, error.message);
      if (error.code === 'permission-denied') this.permissionError.set(true);
    };

    // 1. Inventory Listener
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

    // 2. SOPs Listener
    const sopSub = onSnapshot(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'sops'), (s) => {
      const items: Sop[] = []; s.forEach(d => items.push({ id: d.id, ...d.data() } as Sop));
      this.sops.set(items.sort((a, b) => a.name.localeCompare(b.name)));
    }, handleError('SOPs'));
    this.listeners.push(sopSub);

    // 3. Requests Listeners
    const reqSub = onSnapshot(query(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests'), where('status', '==', 'pending'), orderBy('timestamp', 'desc')), 
        (s) => { const items: Request[] = []; s.forEach(d => items.push({ id: d.id, ...d.data() } as Request)); this.requests.set(items); }, handleError('Requests'));
    this.listeners.push(reqSub);

    // OPTIMIZED: standards listener removed (legacy collection, no writes exist)
    // statistics.component.ts uses loadAllStandardRequests() on-demand instead

    const stdReqSub = onSnapshot(query(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'standard_requests'), where('status', 'in', ['PENDING_APPROVAL', 'PENDING_RETURN']), orderBy('requestDate', 'desc')), 
        (s) => { const items: any[] = []; s.forEach(d => items.push({ id: d.id, ...d.data() })); this.standardRequests.set(items); }, handleError('Standard Requests'));
    this.listeners.push(stdReqSub);

    // OPTIMIZED: allStandardRequests is now loaded on-demand via loadAllStandardRequests()
    // Call it from statistics.component.ts / standard-requests page as needed

    const approvedQuery = query(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests'), where('status', '==', 'approved'), orderBy('approvedAt', 'desc'));
    const appSub = onSnapshot(approvedQuery, (s) => { 
        const items: Request[] = []; s.forEach(d => items.push({ id: d.id, ...d.data() } as Request)); this.approvedRequests.set(items); 
    }, handleError('Approved Requests'));
    this.listeners.push(appSub);

    // 4. Logs Listener — OPTIMIZED: limit 500 → 50
    const logQuery = query(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'logs'), orderBy('timestamp', 'desc'), limit(50));
    const logSub = onSnapshot(logQuery, (s) => {
        const items: Log[] = []; s.forEach(d => items.push({ id: d.id, ...d.data() } as Log));
        this.logs.set(items);
        this.printableLogs.set(items.filter(l => l.printable === true));
    }, handleError('Logs'));
    this.listeners.push(logSub);

    // 5. Stats — OPTIMIZED: replaced onSnapshot with single getDoc
    try {
        const statSnap = await getDoc(doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'stats', 'master'));
        if (statSnap.exists()) this.stats.set(statSnap.data());
    } catch (e) { console.warn('Stats load error:', e); }

    // 6. Config — OPTIMIZED: 4 onSnapshot listeners → single loadConfig() call
    await this.loadConfig();

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

            let shouldNotify = false;
            let syncMessage = 'Hệ thống vừa có cập nhật mới.';

            if (data['standards'] > (lastSyncTimes['standards'] || 0)) {
                lastSyncTimes['standards'] = data['standards'];
                shouldNotify = true;
                syncMessage = 'Danh sách chuẩn đối chiếu vừa được cập nhật.';
            }

            if (data['inventory'] > (lastSyncTimes['inventory'] || 0)) {
                lastSyncTimes['inventory'] = data['inventory'];
                shouldNotify = true;
                syncMessage = 'Kho hóa chất vừa có thay đổi.';
            }
            
            if (data['config'] > (lastSyncTimes['config'] || 0)) {
                lastSyncTimes['config'] = data['config'];
                shouldNotify = true;
                syncMessage = 'Cấu hình hệ thống thay đổi. Tải lại trang để áp dụng.';
            }

            if (shouldNotify) {
                this.toast.show(syncMessage, 'info');
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

      if (printSnap.exists())  this.printConfig.set(printSnap.data() as PrintConfig);
      if (safetySnap.exists()) this.safetyConfig.set(safetySnap.data() as SafetyConfig);
      if (catSnap.exists() && catSnap.data()?.['items']) {
        this.categories.set(catSnap.data()!['items'] as CategoryItem[]);
      }
      if (sysSnap.exists()) {
        const d = sysSnap.data()!;
        if (d['version'])     this.systemVersion.set(d['version']);
        if (d['avatarStyle']) this.avatarStyle.set(d['avatarStyle']);
      }

      // Lưu lại vào trình duyệt cho lần sau
      const cache = {
        print:      printSnap.exists()  ? printSnap.data()  : null,
        safety:     safetySnap.exists() ? safetySnap.data() : null,
        categories: catSnap.exists()    ? catSnap.data()    : null,
        system:     sysSnap.exists()    ? sysSnap.data()    : null,
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
      if (cache.print)                this.printConfig.set(cache.print as PrintConfig);
      if (cache.safety)               this.safetyConfig.set(cache.safety as SafetyConfig);
      if (cache.categories?.['items']) this.categories.set(cache.categories['items'] as CategoryItem[]);
      if (cache.system?.['version'])   this.systemVersion.set(cache.system['version']);
      if (cache.system?.['avatarStyle']) this.avatarStyle.set(cache.system['avatarStyle']);
      return true;
    } catch (_) { return false; /* ignore stale/corrupt cache */ }
  }

  // ─── allStandardRequests: Load on-demand (not realtime) ──────────────────────
  async loadAllStandardRequests(): Promise<void> {
    try {
      const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'standard_requests');
      const q = query(colRef, orderBy('requestDate', 'desc'), limit(300));
      const snap = await getDocs(q);
      this.allStandardRequests.set(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { console.warn('loadAllStandardRequests error:', e); }
  }

  // ─── standards (reference_standards): Load on-demand for Statistics ───────────
  // Replaces the removed realtime listener on the legacy 'standards' collection.
  // Populates state.standards() signal so statistics.component.ts works unchanged.
  async loadReferenceStandards(): Promise<void> {
    try {
      const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'reference_standards');
      const q = query(colRef, orderBy('received_date', 'desc'), limit(300));
      const snap = await getDocs(q);
      this.standards.set(snap.docs.map(d => ({ id: d.id, ...d.data() })));
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
      await setDoc(ref, config, {merge: true});
      await this.updateConfigMetadata();
      await this.loadConfig();
  }

  async saveSafetyConfig(config: SafetyConfig) {
      const ref = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'config', 'safety');
      await setDoc(ref, config, {merge: true});
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
      await setDoc(ref, { version }, {merge: true});
      await this.updateConfigMetadata();
      await this.loadConfig();
  }

  async saveAvatarStyle(style: string) {
      const ref = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'config', 'system');
      await setDoc(ref, { avatarStyle: style }, {merge: true});
      await this.updateConfigMetadata();
      await this.loadConfig();
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

  async submitRequest(sop: Sop, calculatedItems: CalculatedItem[], formInputs: any, invMap: Record<string, InventoryItem> = {}) {
    try {
      const requestItems = this.mapToRequestItems(calculatedItems, invMap);
      
      const reqData: any = {
        sopId: sop.id, 
        sopName: sop.name, 
        items: requestItems, 
        status: 'pending', 
        timestamp: serverTimestamp(), 
        user: this.getCurrentUserName(), 
        inputs: formInputs, 
        margin: formInputs.safetyMargin || 0,
        analysisDate: formInputs.analysisDate || null 
      };

      if (formInputs.sampleList) reqData.sampleList = formInputs.sampleList;
      if (formInputs.targetIds) reqData.targetIds = formInputs.targetIds;

      await addDoc(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests'), reqData);
      this.toast.show('Đã gửi yêu cầu duyệt!', 'success');
    } catch (e: any) { this.toast.show('Lỗi gửi yêu cầu: ' + e.message, 'error'); }
  }
  
  async directApproveAndPrint(sop: Sop, calculatedItems: CalculatedItem[], formInputs: any, invMap: Record<string, InventoryItem> = {}): Promise<{logId: string, printJobId: string} | null> {
    if (!this.auth.canApprove()) { this.toast.show('Bạn không có quyền duyệt!', 'error'); return null; }
    
    const itemsToDeduct = this.getItemsToDeduct(calculatedItems);
    const requestItems = this.mapToRequestItems(calculatedItems, invMap);

    const reqRef = doc(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests'));
    const printJobRef = doc(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'print_jobs'));
    
    const logId = `TRC-${Date.now()}-${Math.floor(Math.random()*1000)}`;
    const logRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'logs', logId);

    try {
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
          transaction.update(invRefs[i], { stock: increment(-itemsToDeduct[i].amount) });
        }

        const reqData: any = {
            sopId: sop.id, 
            sopName: sop.name, 
            items: requestItems, 
            status: 'approved', 
            timestamp: serverTimestamp(),
            approvedAt: serverTimestamp(), 
            user: this.getCurrentUserName(), 
            inputs: formInputs, 
            margin: formInputs.safetyMargin || 0,
            analysisDate: formInputs.analysisDate || null
        };
        
        if (formInputs.sampleList) reqData.sampleList = formInputs.sampleList;
        if (formInputs.targetIds) reqData.targetIds = formInputs.targetIds;

        transaction.set(reqRef, reqData);

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
            createdBy: this.getCurrentUserName()
        });

        transaction.set(logRef, {
          action: 'DIRECT_APPROVE', 
          details: `Duyệt trực tiếp SOP: ${sop.name}`, 
          timestamp: serverTimestamp(), 
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
      this.toast.show('Duyệt thành công!', 'success');
      return { logId: logRef.id, printJobId: printJobRef.id };

    } catch (e: any) {
      if (e.code === 'resource-exhausted') this.toast.show('Lỗi: Hết hạn mức Quota.', 'error');
      else this.toast.show(e.message, 'error');
      return null;
    }
  }

  async approveRequest(req: Request) {
    if (!this.auth.canApprove()) return;
    if (!await this.confirmationService.confirm('Xác nhận duyệt và trừ kho?')) return;

    try {
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
           transaction.update(invRefs[i], { stock: increment(-req.items[i].amount) });
        }
        
        const reqRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests', req.id);
        transaction.update(reqRef, { status: 'approved', approvedAt: serverTimestamp() });
        
        const sop = this.sops().find(s => s.id === req.sopId);
        
        const logId = `TRC-${Date.now()}-${Math.floor(Math.random()*1000)}`;
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
                if(ri && ri.displayName) ci.displayName = ri.displayName;
                
                if(ci.isComposite) {
                    ci.breakdown.forEach(sub => {
                        const riSub = req.items.find(r => r.name === sub.name);
                        if(riSub && riSub.displayName) sub.displayName = riSub.displayName;
                    });
                }
            });

            const extendedInputs = { ...req.inputs };
            if(req.sampleList) extendedInputs.sampleList = req.sampleList;
            if(req.targetIds) extendedInputs.targetIds = req.targetIds;

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
                createdBy: this.getCurrentUserName()
            });

            transaction.set(logRef, {
              action: 'APPROVE_REQUEST', 
              details: `Duyệt yêu cầu: ${req.sopName}`, 
              timestamp: serverTimestamp(), 
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
              action: 'APPROVE_REQUEST', details: `Duyệt yêu cầu: ${req.sopName}`, timestamp: serverTimestamp(), user: this.getCurrentUserName(), printable: false, requestId: req.id
            });
        }
      });
      this.toast.show('Duyệt thành công!', 'success');
    } catch (e: any) { this.toast.show(e.message, 'error'); }
  }

  async revokeApproval(req: Request) {
    if (!this.auth.canApprove()) return;
    if (!await this.confirmationService.confirm({ message: `HOÀN TÁC: Trả lại kho và hủy duyệt SOP "${req.sopName}"?`, confirmText: 'Hoàn tác', isDangerous: true })) return;

    try {
      await runTransaction(this.fb.db, async (transaction) => {
        const invRefs: DocumentReference[] = []; const existingItems: RequestItem[] = [];
        const readPromises = req.items.map(item => { const ref = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', item.name); return transaction.get(ref); });
        const invSnaps = await Promise.all(readPromises);
        for (let i = 0; i < invSnaps.length; i++) { if(invSnaps[i].exists()) { invRefs.push(invSnaps[i].ref); existingItems.push(req.items[i]); } }
        for (let i = 0; i < existingItems.length; i++) { transaction.update(invRefs[i], { stock: increment(existingItems[i].amount) }); }
        
        const reqRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests', req.id);
        transaction.update(reqRef, { status: 'pending', approvedAt: deleteField() });
        
        const logRef = doc(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'logs'));
        transaction.set(logRef, { action: 'REVOKE_APPROVE', details: `Hoàn tác: ${req.sopName}`, timestamp: serverTimestamp(), user: this.getCurrentUserName(), printable: false, requestId: req.id });
      });
      this.toast.show('Đã hoàn tác!', 'info');
    } catch (e: any) { this.toast.show(e.message, 'error'); }
  }

  async updateApprovedRequest(req: Request, sop: Sop, calculatedItems: CalculatedItem[], formInputs: any, invMap: Record<string, InventoryItem> = {}) {
    if (!this.auth.canApprove()) return;
    if (!await this.confirmationService.confirm('Xác nhận lưu thay đổi và cập nhật kho?')) return;

    try {
      const oldItems = req.items;
      const newItems = this.mapToRequestItems(calculatedItems, invMap);
      
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
                transaction.set(invRefs[itemName], { stock: increment(inventoryDiff[itemName]) }, { merge: true });
            }
        }
        
        // 3. Update request document
        const reqRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests', req.id);
        const reqData: any = {
            items: newItems,
            inputs: formInputs,
            margin: formInputs.safetyMargin || 0,
            analysisDate: formInputs.analysisDate || null,
            updatedAt: serverTimestamp()
        };
        if (formInputs.sampleList) reqData.sampleList = formInputs.sampleList;
        else reqData.sampleList = deleteField();
        
        if (formInputs.targetIds) reqData.targetIds = formInputs.targetIds;
        else reqData.targetIds = deleteField();
        
        transaction.update(reqRef, reqData);
        
        // 4. Create a new log and print job for the update
        const logId = `TRC-${Date.now()}-${Math.floor(Math.random()*1000)}`;
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
            createdBy: this.getCurrentUserName()
        });

        transaction.set(logRef, {
          action: 'EDIT_REQUEST', 
          details: `Chỉnh sửa phiếu: ${req.sopName}`, 
          timestamp: serverTimestamp(), 
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
      this.toast.show('Cập nhật phiếu thành công!', 'success');
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
      await updateDoc(doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests', req.id), { status: 'rejected', rejectedAt: serverTimestamp() });
      this.toast.show('Đã từ chối', 'info');
    } catch (e) { this.toast.show('Lỗi xử lý', 'error'); }
  }

  async deletePrintLog(logId: string, sopName: string, printJobId?: string) { 
      const batch = writeBatch(this.fb.db);
      const logRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'logs', logId);
      batch.update(logRef, { printable: false });
      if (printJobId) {
          const jobRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'print_jobs', printJobId);
          batch.delete(jobRef);
      }
      await batch.commit();
      this.toast.show('Đã xóa phiếu in khỏi hàng đợi');
  }
  
  async deleteSelectedPrintLogs(logs: Log[]) { 
      const batch = writeBatch(this.fb.db);
      logs.forEach(log => {
          batch.update(doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'logs', log.id), { printable: false });
          if (log.printJobId) {
              batch.delete(doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'print_jobs', log.printJobId));
          }
      });
      await batch.commit();
      this.toast.show(`Đã xóa ${logs.length} phiếu khỏi hàng đợi`);
  }
}
