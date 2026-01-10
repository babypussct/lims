
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
import { InventoryItem } from '../models/inventory.model';
import { Sop, CalculatedItem } from '../models/sop.model';
import { Request, RequestItem } from '../models/request.model';
import { Log, PrintData } from '../models/log.model';
import { sanitizeForFirebase } from '../utils/utils';

@Injectable({ providedIn: 'root' })
export class StateService implements OnDestroy {
  private fb = inject(FirebaseService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private confirmationService = inject(ConfirmationService);
  private injector = inject(Injector);

  private listeners: Unsubscribe[] = [];

  // Signals
  inventory = signal<InventoryItem[]>([]);
  inventoryMap = computed(() => {
    const map: Record<string, InventoryItem> = {};
    this.inventory().forEach(i => map[i.id] = i);
    return map;
  });
  
  sops = signal<Sop[]>([]);
  requests = signal<Request[]>([]); // Pending requests
  approvedRequests = signal<Request[]>([]); // History
  
  logs = signal<Log[]>([]);
  printableLogs = signal<Log[]>([]);
  stats = signal<any>({ totalSopsRun: 0, totalItemsUsed: 0 });
  
  // RBAC: Computed based on Auth Service
  currentUser = this.auth.currentUser;
  isAdmin = computed(() => this.auth.currentUser()?.role === 'manager');
  
  isSystemHealthy = signal<boolean>(true);
  
  constructor() {
    // Only initialize data when user is authenticated
    effect(() => {
      const user = this.auth.currentUser();
      if (user) {
        this.initData();
        this.checkSystemHealth();
      } else {
        this.cleanupListeners();
      }
    });
  }

  private cleanupListeners() {
    this.listeners.forEach(unsub => unsub());
    this.listeners = [];
    // Reset data
    this.inventory.set([]);
    this.sops.set([]);
    this.requests.set([]);
    this.approvedRequests.set([]);
    this.logs.set([]);
    this.printableLogs.set([]);
  }

  ngOnDestroy() {
    this.cleanupListeners();
  }

  async initData() {
    this.cleanupListeners(); // Ensure no duplicates

    // Inventory Listener
    const invSub = onSnapshot(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory'), (snapshot) => {
      const items: InventoryItem[] = [];
      snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() } as InventoryItem));
      this.inventory.set(items.sort((a, b) => a.id.localeCompare(b.id)));
    }, error => {
      console.warn('Inventory listener:', error.message);
      if (error.code !== 'permission-denied') {
        this.toast.show('Mất kết nối Inventory!', 'error');
        this.isSystemHealthy.set(false);
      }
    });
    this.listeners.push(invSub);

    // SOPs Listener
    const sopSub = onSnapshot(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'sops'), (snapshot) => {
      const items: Sop[] = [];
      snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() } as Sop));
      this.sops.set(items.sort((a, b) => a.name.localeCompare(b.name)));
    }, error => {
      console.warn('SOP listener:', error.message);
    });
    this.listeners.push(sopSub);

    // Requests Listener (Pending)
    const reqQuery = query(
      collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests'), 
      where('status', '==', 'pending'),
      orderBy('timestamp', 'desc')
    );
    
    const reqSub = onSnapshot(reqQuery, (snapshot) => {
      const items: Request[] = [];
      snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() } as Request));
      this.requests.set(items);
    }, error => {
      console.warn('Requests (pending) listener:', error.message);
    });
    this.listeners.push(reqSub);

    // Requests Listener (Approved History - Limit 100 for better stats)
    const approvedQuery = query(
      collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests'), 
      where('status', '==', 'approved'),
      orderBy('approvedAt', 'desc'),
      limit(100) 
    );
    
    const appSub = onSnapshot(approvedQuery, (snapshot) => {
      const items: Request[] = [];
      snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() } as Request));
      this.approvedRequests.set(items);
    }, error => {
      console.warn('Requests (approved) listener:', error.message);
    });
    this.listeners.push(appSub);

    // Unified Logs Listener
    const unifiedLogQuery = query(
      collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'logs'),
      orderBy('timestamp', 'desc'),
      limit(100)
    );

    const unifiedLogSub = onSnapshot(unifiedLogQuery, (snapshot) => {
      const allLogs: Log[] = [];
      snapshot.forEach(doc => allLogs.push({ id: doc.id, ...doc.data() } as Log));

      const printable = allLogs.filter(log => log.printable === true);
      this.printableLogs.set(printable);
      this.logs.set(allLogs);

    }, error => {
      console.warn('Unified Logs listener failed:', error.message);
    });
    this.listeners.push(unifiedLogSub);

    // Stats Listener (Aggregates)
    const statSub = onSnapshot(doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'stats', 'master'), (doc) => {
      if (doc.exists()) {
        this.stats.set(doc.data());
      }
    }, error => {
      console.warn('Stats listener:', error.message);
    });
    this.listeners.push(statSub);
  }

  async checkSystemHealth() {
    try {
      await getDoc(doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'config', 'general'));
      this.isSystemHealthy.set(true);
      return true;
    } catch (e: any) {
      if (e.code === 'permission-denied') {
        console.warn('Health check permission denied (expected if checking restricted doc)');
      } else {
        this.isSystemHealthy.set(false);
      }
      return false;
    }
  }

  private getCurrentUserName(): string {
    return this.auth.currentUser()?.displayName || 'Unknown User';
  }

  private getItemsToDeduct(calculatedItems: CalculatedItem[]): { name: string; amount: number }[] {
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

  // Convert Calculated Items to Request Items Structure
  private mapToRequestItems(calculatedItems: CalculatedItem[]): RequestItem[] {
      const requestItems: RequestItem[] = [];
      calculatedItems.forEach(item => {
        if (item.isComposite) {
          item.breakdown.forEach(sub => {
            requestItems.push({ name: sub.name, amount: sub.totalNeed, displayAmount: sub.displayAmount, unit: sub.unit, stockUnit: sub.stockUnit });
          });
        } else {
          requestItems.push({ name: item.name, amount: item.stockNeed, displayAmount: item.totalQty, unit: item.unit, stockUnit: item.stockUnit });
        }
      });
      return requestItems;
  }

  async submitRequest(sop: Sop, calculatedItems: CalculatedItem[], formInputs: any) {
    try {
      const requestItems = this.mapToRequestItems(calculatedItems);
      await addDoc(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests'), {
        sopId: sop.id, 
        sopName: sop.name, 
        items: requestItems, 
        status: 'pending', 
        timestamp: serverTimestamp(), 
        user: this.getCurrentUserName(),
        inputs: formInputs,
        margin: formInputs.safetyMargin || 0,
      });
      this.toast.show('Đã gửi yêu cầu duyệt!', 'success');
    } catch (e) {
      console.error(e);
      this.toast.show('Lỗi khi gửi yêu cầu', 'error');
    }
  }
  
  async directApproveAndPrint(sop: Sop, calculatedItems: CalculatedItem[], formInputs: any): Promise<void> {
    if (!this.isAdmin()) {
      this.toast.show('Bạn không có quyền duyệt phiếu!', 'error');
      return;
    }
    
    const itemsToDeduct = this.getItemsToDeduct(calculatedItems);
    const requestItems = this.mapToRequestItems(calculatedItems);

    try {
      await runTransaction(this.fb.db, async (transaction) => {
        // 1. Check Inventory & Deduct
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

        // 2. Update Stats
        const statsRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'stats', 'master');
        transaction.set(statsRef, {
            totalSopsRun: increment(1), totalItemsUsed: increment(itemsToDeduct.length), lastUpdated: serverTimestamp()
        }, { merge: true });

        // 3. Create "Approved" Request Record (So it appears in History & Consumption Logic)
        const reqRef = doc(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests'));
        transaction.set(reqRef, {
            sopId: sop.id, 
            sopName: sop.name, 
            items: requestItems, 
            status: 'approved', 
            timestamp: serverTimestamp(),
            approvedAt: serverTimestamp(), 
            user: this.getCurrentUserName(),
            inputs: formInputs,
            margin: formInputs.safetyMargin || 0,
        });

        // 4. Create Print Log
        const printData: PrintData = {
          sop: sop, inputs: formInputs, margin: formInputs.safetyMargin || 0, items: calculatedItems,
        };
        const sanitizedPrintData = sanitizeForFirebase(printData);
        
        const logRef = doc(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'logs'));
        transaction.set(logRef, {
          action: 'DIRECT_APPROVE', details: `Duyệt trực tiếp SOP: ${sop.name}`, timestamp: serverTimestamp(), user: this.getCurrentUserName(),
          printable: true, printData: sanitizedPrintData
        });
      });
      this.toast.show('Duyệt thành công! Phiếu in sẵn sàng.', 'success');
    } catch (e: any) {
      console.error(e);
      this.toast.show(e.message, 'error');
    }
  }

  async approveRequest(req: Request) {
    if (!this.isAdmin()) { this.toast.show('Bạn không có quyền duyệt phiếu!', 'error'); return; }
    const confirmed = await this.confirmationService.confirm('Xác nhận duyệt và trừ kho?');
    if (!confirmed) return;

    try {
      await runTransaction(this.fb.db, async (transaction) => {
        const invRefs = req.items.map(item => doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', item.name));
        const invSnaps = await Promise.all(invRefs.map(ref => transaction.get(ref)));
        for (let i = 0; i < req.items.length; i++) {
          const item = req.items[i];
          const invSnap = invSnaps[i];
          if (!invSnap.exists()) throw new Error(`Hóa chất "${item.name}" không tồn tại trong kho!`);
          const currentStock = invSnap.data()['stock'] || 0;
          if (currentStock < item.amount) throw new Error(`Kho không đủ "${item.name}". Hiện có: ${currentStock}, Cần: ${item.amount}`);
        }
        for (let i = 0; i < req.items.length; i++) {
           transaction.update(invRefs[i], { stock: increment(-req.items[i].amount) });
        }
        
        const reqRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests', req.id);
        transaction.update(reqRef, { status: 'approved', approvedAt: serverTimestamp() });
        
        const statsRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'stats', 'master');
        transaction.set(statsRef, { totalSopsRun: increment(1), totalItemsUsed: increment(req.items.length), lastUpdated: serverTimestamp() }, { merge: true });
        
        const logRef = doc(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'logs'));

        const sop = this.sops().find(s => s.id === req.sopId);
        if (sop && req.inputs) {
            const calcService = this.injector.get(CalculatorService);
            const calculatedItems = calcService.calculateSopNeeds(sop, req.inputs, req.margin || 0);

            const printData: PrintData = {
              sop: sop, inputs: req.inputs, margin: req.margin || 0, items: calculatedItems,
            };
            const sanitizedPrintData = sanitizeForFirebase(printData);

            transaction.set(logRef, {
              action: 'APPROVE_REQUEST', details: `Duyệt yêu cầu SOP: ${req.sopName}`, timestamp: serverTimestamp(), user: this.getCurrentUserName(),
              printable: true, printData: sanitizedPrintData
            });
        } else {
            transaction.set(logRef, {
              action: 'APPROVE_REQUEST', details: `Duyệt SOP: ${req.sopName}`, timestamp: serverTimestamp(), user: this.getCurrentUserName(), printable: false
            });
        }
      });
      this.toast.show('Duyệt thành công! Phiếu in đã được tạo.', 'success');
    } catch (e: any) {
      console.error(e);
      this.toast.show(e.message, 'error');
    }
  }

  async revokeApproval(req: Request) {
    if (!this.isAdmin()) return;
    const confirmed = await this.confirmationService.confirm({ message: `HOÀN TÁC: Bạn có chắc muốn trả lại kho và hủy duyệt SOP "${req.sopName}"?`, confirmText: 'Hoàn tác', isDangerous: true });
    if (!confirmed) return;

    try {
      await runTransaction(this.fb.db, async (transaction) => {
        const invRefs: DocumentReference[] = []; const existingItems: RequestItem[] = [];
        const readPromises = req.items.map(item => { const ref = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', item.name); return transaction.get(ref); });
        const invSnaps = await Promise.all(readPromises);
        for (let i = 0; i < invSnaps.length; i++) { if(invSnaps[i].exists()) { invRefs.push(invSnaps[i].ref); existingItems.push(req.items[i]); } }
        for (let i = 0; i < existingItems.length; i++) { transaction.update(invRefs[i], { stock: increment(existingItems[i].amount) }); }
        const reqRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests', req.id);
        transaction.update(reqRef, { status: 'pending', approvedAt: deleteField() });
        const statsRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'stats', 'master');
        transaction.set(statsRef, { totalSopsRun: increment(-1), totalItemsUsed: increment(-req.items.length), lastUpdated: serverTimestamp() }, { merge: true });
        const logRef = doc(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'logs'));
        transaction.set(logRef, {
          action: 'REVOKE_APPROVE', details: `Hoàn tác duyệt: ${req.sopName}`, timestamp: serverTimestamp(), user: this.getCurrentUserName(), printable: false
        });
      });
      this.toast.show('Đã hoàn tác! Kho được cộng lại.', 'info');
    } catch (e: any) {
      console.error(e);
      this.toast.show('Lỗi hoàn tác: ' + e.message, 'error');
    }
  }

  async rejectRequest(req: Request) {
    if (!this.isAdmin()) return;
    const confirmed = await this.confirmationService.confirm({ message: 'Từ chối yêu cầu này?', confirmText: 'Từ chối', isDangerous: true, });
    if (!confirmed) return;
    try {
      await updateDoc(doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests', req.id), { status: 'rejected', rejectedAt: serverTimestamp() });
      this.toast.show('Đã từ chối yêu cầu', 'info');
    } catch (e) {
      this.toast.show('Lỗi xử lý', 'error');
    }
  }

  async rebuildStats() {
    if (!this.isAdmin()) return;
    const confirmed = await this.confirmationService.confirm('Hành động này sẽ quét lại toàn bộ lịch sử để tính toán lại thống kê. Tiếp tục?');
    if (!confirmed) return;
    try {
      const q = query(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests'), where('status', '==', 'approved'));
      const snapshot = await getDocs(q);
      let totalSopsRun = 0; let totalItemsUsed = 0;
      snapshot.forEach(doc => {
        totalSopsRun++;
        const data = doc.data();
        if (data['items'] && Array.isArray(data['items'])) { totalItemsUsed += data['items'].length; }
      });
      await setDoc(doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'stats', 'master'), { totalSopsRun, totalItemsUsed, lastUpdated: serverTimestamp() });
      this.toast.show('Đã xây dựng lại thống kê!', 'success');
    } catch (e) {
      console.error(e);
      this.toast.show('Lỗi Rebuild Stats', 'error');
    }
  }

  async deletePrintLog(logId: string, sopName: string): Promise<void> {
    if (!this.isAdmin()) { this.toast.show('Bạn không có quyền xóa!', 'error'); return; }
    const confirmed = await this.confirmationService.confirm({
        message: `Bạn có chắc muốn xóa phiếu in cho SOP "${sopName}"? Hành động này không thể hoàn tác.`,
        confirmText: 'Xác nhận Xóa',
        isDangerous: true
    });
    if (!confirmed) return;

    try {
        const logRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'logs', logId);
        await deleteDoc(logRef);
        this.toast.show('Đã xóa phiếu in.', 'success');
    } catch (e: any) {
        console.error(e);
        this.toast.show('Lỗi khi xóa phiếu in: ' + e.message, 'error');
    }
  }

  async deleteSelectedPrintLogs(logIds: string[]): Promise<void> {
      if (!this.isAdmin()) { this.toast.show('Bạn không có quyền xóa!', 'error'); return; }
      if (logIds.length === 0) return;

      const confirmed = await this.confirmationService.confirm({
          message: `Bạn có chắc muốn xóa vĩnh viễn ${logIds.length} phiếu in đã chọn?`,
          confirmText: `Xóa ${logIds.length} mục`,
          isDangerous: true
      });
      if (!confirmed) return;

      try {
          const batch = writeBatch(this.fb.db);
          logIds.forEach(id => {
              const logRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'logs', id);
              batch.delete(logRef);
          });
          await batch.commit();
          this.toast.show(`Đã xóa ${logIds.length} phiếu in.`, 'success');
      } catch (e: any) {
          console.error(e);
          this.toast.show('Lỗi khi xóa hàng loạt: ' + e.message, 'error');
      }
  }

  async clearAllLogs(): Promise<void> {
    if (!this.isAdmin()) return;
    
    // We only clear the visible logs in the state (limited to 100 recent)
    // Firestore delete collection requires Cloud Functions or recursive delete, which is heavy.
    // Here we batch delete the loaded documents.
    const logs = this.logs();
    if (logs.length === 0) return;

    const confirmed = await this.confirmationService.confirm({
        message: `Bạn có chắc muốn xóa ${logs.length} dòng nhật ký hoạt động hiển thị? (Phiếu in vẫn được giữ nếu không chọn xóa)`,
        confirmText: 'Xóa Nhật Ký',
        isDangerous: true
    });
    if (!confirmed) return;

    try {
        const batch = writeBatch(this.fb.db);
        logs.forEach(log => {
           // Skip if it's a critical log if needed, but here we wipe all viewed logs
           const ref = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'logs', log.id);
           batch.delete(ref);
        });
        await batch.commit();
        this.toast.show('Đã dọn dẹp nhật ký hoạt động.', 'success');
    } catch(e: any) {
        console.error(e);
        this.toast.show('Lỗi xóa nhật ký: ' + e.message, 'error');
    }
  }
}
