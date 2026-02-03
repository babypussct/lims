
import { Injectable, signal, computed, inject, effect, OnDestroy, Injector } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { AuthService } from './auth.service';
import { 
  collection, onSnapshot, doc, getDoc, runTransaction, 
  addDoc, updateDoc, query, orderBy, limit, where, 
  serverTimestamp, increment, setDoc, getDocs, deleteDoc, deleteField,
  Unsubscribe, DocumentReference, writeBatch
} from 'firebase/firestore';
import { ToastService } from './toast.service';
import { ConfirmationService } from './confirmation.service';
import { CalculatorService } from './calculator.service';

// Import Models
import { InventoryItem, StockHistoryItem } from '../models/inventory.model';
import { Sop, CalculatedItem } from '../models/sop.model';
import { Request, RequestItem } from '../models/request.model';
import { Log, PrintData } from '../models/log.model';
import { PrintConfig, SafetyConfig } from '../models/config.model';
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
  sidebarCollapsed = signal<boolean>(true);
  
  // --- FOCUS MODE (New Feature) ---
  focusMode = signal<boolean>(false);

  constructor() {
    effect(() => {
      const user = this.auth.currentUser();
      if (user) {
        this.initData();
        this.checkSystemHealth();
      } else {
        this.cleanupListeners();
      }
    }, { allowSignalWrites: true }); 
  }

  toggleSidebar() { this.sidebarOpen.update(v => !v); }
  closeSidebar() { this.sidebarOpen.set(false); }
  toggleSidebarCollapse() { this.sidebarCollapsed.update(v => !v); }
  
  // Toggle Focus Mode
  toggleFocusMode() { this.focusMode.update(v => !v); }

  private cleanupListeners() {
    this.listeners.forEach(unsub => unsub());
    this.listeners = [];
    this.sops.set([]);
    this.inventory.set([]);
    this.requests.set([]); this.approvedRequests.set([]); 
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
      const items: InventoryItem[] = []; s.forEach(d => items.push({ id: d.id, ...d.data() } as InventoryItem));
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

    const approvedQuery = query(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests'), where('status', '==', 'approved'), orderBy('approvedAt', 'desc'), limit(100));
    const appSub = onSnapshot(approvedQuery, (s) => { 
        const items: Request[] = []; s.forEach(d => items.push({ id: d.id, ...d.data() } as Request)); this.approvedRequests.set(items); 
    }, handleError('Approved Requests'));
    this.listeners.push(appSub);

    // 4. Logs Listener
    const logQuery = query(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'logs'), orderBy('timestamp', 'desc'), limit(100));
    const logSub = onSnapshot(logQuery, (s) => {
        const items: Log[] = []; s.forEach(d => items.push({ id: d.id, ...d.data() } as Log));
        this.logs.set(items);
        this.printableLogs.set(items.filter(l => l.printable === true));
    }, handleError('Logs'));
    this.listeners.push(logSub);

    // 5. Configs
    const statSub = onSnapshot(doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'stats', 'master'), (d) => { if (d.exists()) this.stats.set(d.data()); }, handleError('Stats'));
    this.listeners.push(statSub);

    const printConfigSub = onSnapshot(doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'config', 'print'), (d) => { if(d.exists()) this.printConfig.set(d.data() as PrintConfig); }, handleError('Config-Print'));
    this.listeners.push(printConfigSub);

    const safetyConfigSub = onSnapshot(doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'config', 'safety'), (d) => { 
        if(d.exists()) this.safetyConfig.set(d.data() as SafetyConfig); 
    }, handleError('Config-Safety'));
    this.listeners.push(safetyConfigSub);

    const systemSub = onSnapshot(doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'config', 'system'), (d) => { 
        if(d.exists()) {
            const data = d.data();
            if (data['version']) this.systemVersion.set(data['version']);
            if (data['avatarStyle']) this.avatarStyle.set(data['avatarStyle']); // Load Avatar Style
        }
    }, handleError('Config-System'));
    this.listeners.push(systemSub);
  }

  async checkSystemHealth() { return true; }
  
  async savePrintConfig(config: PrintConfig) { 
      const ref = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'config', 'print');
      await setDoc(ref, config, {merge: true});
  }

  async saveSafetyConfig(config: SafetyConfig) {
      const ref = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'config', 'safety');
      await setDoc(ref, config, {merge: true});
  }

  async saveSystemVersion(version: string) {
      const ref = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'config', 'system');
      await setDoc(ref, { version }, {merge: true});
  }

  async saveAvatarStyle(style: string) {
      const ref = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'config', 'system');
      await setDoc(ref, { avatarStyle: style }, {merge: true});
  }
  
  public getCurrentUserName(): string { return this.auth.currentUser()?.displayName || 'Unknown User'; }

  // ... (Rest of the file remains unchanged: mapToRequestItems, submitRequest, directApproveAndPrint, approveRequest, revokeApproval, etc.)
  // Omitted for brevity as no logic changed there
  
  private getItemsToDeduct(calculatedItems: CalculatedItem[]) {
      const itemsToDeduct: Map<string, number> = new Map();
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
                 unit: sub.unit, stockUnit: sub.stockUnit 
             });
          });
        } else {
          const displayName = invMap[item.name]?.name || item.name;
          requestItems.push({ 
              name: item.name, displayName, 
              amount: item.stockNeed, displayAmount: item.totalQty, 
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
            analysisDate: formInputs.analysisDate
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
                analysisDate: req.analysisDate 
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
              sopBasicInfo: { 
                  name: sop.name, 
                  category: sop.category,
                  ref: sop.ref 
              }
            });
        } else {
            transaction.set(logRef, {
              action: 'APPROVE_REQUEST', details: `Duyệt yêu cầu: ${req.sopName}`, timestamp: serverTimestamp(), user: this.getCurrentUserName(), printable: false
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
        transaction.set(logRef, { action: 'REVOKE_APPROVE', details: `Hoàn tác: ${req.sopName}`, timestamp: serverTimestamp(), user: this.getCurrentUserName(), printable: false });
      });
      this.toast.show('Đã hoàn tác!', 'info');
    } catch (e: any) { this.toast.show(e.message, 'error'); }
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
      batch.delete(logRef);
      if (printJobId) {
          const jobRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'print_jobs', printJobId);
          batch.delete(jobRef);
      }
      await batch.commit();
      this.toast.show('Đã xóa phiếu in');
  }
  
  async deleteSelectedPrintLogs(logs: Log[]) { 
      const batch = writeBatch(this.fb.db);
      logs.forEach(log => {
          batch.delete(doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'logs', log.id));
          if (log.printJobId) {
              batch.delete(doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'print_jobs', log.printJobId));
          }
      });
      await batch.commit();
      this.toast.show(`Đã xóa ${logs.length} phiếu`);
  }
  
  async clearAllLogs() { 
      const logs = this.logs();
      if (logs.length === 0) return;
      if (await this.confirmationService.confirm({ message: 'Xóa toàn bộ nhật ký hiển thị?', confirmText: 'Xóa', isDangerous: true })) {
          const batch = writeBatch(this.fb.db);
          logs.forEach(l => {
              batch.delete(doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'logs', l.id));
              if (l.printJobId) {
                  batch.delete(doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'print_jobs', l.printJobId));
              }
          });
          await batch.commit();
          this.toast.show('Đã xóa logs');
      }
  }
}
