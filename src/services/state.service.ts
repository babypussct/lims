
import { Injectable, signal, computed, inject, effect, OnDestroy } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { AuthService } from './auth.service';
import { 
  collection, onSnapshot, doc, getDoc, runTransaction, 
  addDoc, updateDoc, query, orderBy, limit, where, 
  serverTimestamp, increment, setDoc, getDocs, deleteDoc, deleteField,
  Unsubscribe 
} from 'firebase/firestore';
import { ToastService } from './toast.service';

// Import Models
import { InventoryItem } from '../models/inventory.model';
import { Sop } from '../models/sop.model';
import { Request, RequestItem } from '../models/request.model';
import { Log } from '../models/log.model';

@Injectable({ providedIn: 'root' })
export class StateService implements OnDestroy {
  private fb = inject(FirebaseService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);

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

    // Requests Listener (Approved History - Limit 20)
    const approvedQuery = query(
      collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests'), 
      where('status', '==', 'approved'),
      orderBy('approvedAt', 'desc'),
      limit(20)
    );
    
    const appSub = onSnapshot(approvedQuery, (snapshot) => {
      const items: Request[] = [];
      snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() } as Request));
      this.approvedRequests.set(items);
    }, error => {
      console.warn('Requests (approved) listener:', error.message);
    });
    this.listeners.push(appSub);

    // Logs Listener (Last 50)
    const logQuery = query(
      collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'logs'), 
      orderBy('timestamp', 'desc'), 
      limit(50)
    );

    const logSub = onSnapshot(logQuery, (snapshot) => {
      const items: Log[] = [];
      snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() } as Log));
      this.logs.set(items);
    }, error => {
      console.warn('Logs listener:', error.message);
    });
    this.listeners.push(logSub);

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
      // Simple ping by reading a config doc
      // This might fail if rules deny read to 'config/general'
      await getDoc(doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'config', 'general'));
      this.isSystemHealthy.set(true);
      return true;
    } catch (e: any) {
      if (e.code === 'permission-denied') {
        // If we can't read config due to permissions, we assume system is "Protected" but reachable
        // However, if we are logged in, we should be able to read.
        // If we are NOT logged in (shouldn't happen here due to effect), it would fail.
        console.warn('Health check permission denied (expected if checking restricted doc)');
      } else {
        this.isSystemHealthy.set(false);
      }
      return false;
    }
  }

  // --- BUSINESS LOGIC: REQUESTS & TRANSACTIONS ---

  private getCurrentUserName(): string {
    return this.auth.currentUser()?.displayName || 'Unknown User';
  }

  async submitRequest(sop: Sop, items: any[]) {
    try {
      const requestItems: RequestItem[] = items.map(i => {
        return {
          name: i.name,
          amount: i.totalNeed || i.totalQty, 
          displayAmount: i.totalQty,
          unit: i.unit,
          stockUnit: i.stockUnit || i.unit
        };
      });

      await addDoc(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests'), {
        sopId: sop.id,
        sopName: sop.name,
        items: requestItems,
        status: 'pending',
        timestamp: serverTimestamp(),
        user: this.getCurrentUserName()
      });
      
      this.toast.show('Đã gửi yêu cầu duyệt!', 'success');
    } catch (e) {
      console.error(e);
      this.toast.show('Lỗi khi gửi yêu cầu', 'error');
    }
  }

  async approveRequest(req: Request) {
    if (!this.isAdmin()) {
      this.toast.show('Bạn không có quyền duyệt phiếu!', 'error');
      return;
    }
    if (!confirm('Xác nhận duyệt và trừ kho?')) return;

    try {
      await runTransaction(this.fb.db, async (transaction) => {
        // 1. Check Inventory & Prepare Updates
        for (const item of req.items) {
          const invRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', item.name);
          const invSnap = await transaction.get(invRef);
          
          if (!invSnap.exists()) {
            throw new Error(`Hóa chất "${item.name}" không tồn tại trong kho!`);
          }
          
          const currentStock = invSnap.data()['stock'] || 0;
          if (currentStock < item.amount) {
            throw new Error(`Kho không đủ "${item.name}". Hiện có: ${currentStock}, Cần: ${item.amount}`);
          }

          // 2. Deduct Stock
          transaction.update(invRef, { stock: currentStock - item.amount });
        }

        // 3. Update Request Status
        const reqRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests', req.id);
        transaction.update(reqRef, { status: 'approved', approvedAt: serverTimestamp() });

        // 4. Update Stats Aggregates (Atomic Increment)
        const statsRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'stats', 'master');
        transaction.set(statsRef, {
            totalSopsRun: increment(1),
            totalItemsUsed: increment(req.items.length),
            lastUpdated: serverTimestamp()
        }, { merge: true });

        // 5. Create Log
        const logRef = doc(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'logs'));
        transaction.set(logRef, {
          action: 'APPROVE_REQUEST',
          details: `Duyệt SOP: ${req.sopName}`,
          timestamp: serverTimestamp(),
          user: this.getCurrentUserName()
        });
      });

      this.toast.show('Duyệt thành công!', 'success');
    } catch (e: any) {
      console.error(e);
      this.toast.show(e.message, 'error');
    }
  }

  async revokeApproval(req: Request) {
    if (!this.isAdmin()) return;
    if (!confirm(`HOÀN TÁC: Bạn có chắc muốn trả lại kho và hủy duyệt SOP "${req.sopName}"?`)) return;

    try {
      await runTransaction(this.fb.db, async (transaction) => {
        // 1. Refund Stock (Add back)
        for (const item of req.items) {
          const invRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', item.name);
          const invSnap = await transaction.get(invRef);
          
          if (invSnap.exists()) {
            const currentStock = invSnap.data()['stock'] || 0;
            transaction.update(invRef, { stock: currentStock + item.amount });
          }
        }

        // 2. Revert Request Status
        const reqRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests', req.id);
        transaction.update(reqRef, { 
          status: 'pending', 
          approvedAt: deleteField() 
        });

        // 3. Decrement Stats
        const statsRef = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'stats', 'master');
        transaction.set(statsRef, {
            totalSopsRun: increment(-1),
            totalItemsUsed: increment(-req.items.length),
            lastUpdated: serverTimestamp()
        }, { merge: true });

        // 4. Create Log
        const logRef = doc(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'logs'));
        transaction.set(logRef, {
          action: 'REVOKE_APPROVE',
          details: `Hoàn tác duyệt: ${req.sopName}`,
          timestamp: serverTimestamp(),
          user: this.getCurrentUserName()
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
    if (!confirm('Từ chối yêu cầu này?')) return;
    try {
      await updateDoc(doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests', req.id), {
        status: 'rejected',
        rejectedAt: serverTimestamp()
      });
      this.toast.show('Đã từ chối yêu cầu', 'info');
    } catch (e) {
      this.toast.show('Lỗi xử lý', 'error');
    }
  }

  async rebuildStats() {
    if (!this.isAdmin()) return;
    if (!confirm('Hành động này sẽ quét lại toàn bộ lịch sử để tính toán lại thống kê. Tiếp tục?')) return;
    
    try {
      const q = query(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'requests'), where('status', '==', 'approved'));
      const snapshot = await getDocs(q);
      
      let totalSopsRun = 0;
      let totalItemsUsed = 0;

      snapshot.forEach(doc => {
        totalSopsRun++;
        const data = doc.data();
        if (data['items'] && Array.isArray(data['items'])) {
          totalItemsUsed += data['items'].length;
        }
      });

      await setDoc(doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'stats', 'master'), {
        totalSopsRun,
        totalItemsUsed,
        lastUpdated: serverTimestamp()
      });

      this.toast.show('Đã xây dựng lại thống kê!', 'success');
    } catch (e) {
      console.error(e);
      this.toast.show('Lỗi Rebuild Stats', 'error');
    }
  }
}
