import { Injectable, inject, effect } from '@angular/core';
import { FirebaseService } from '../../core/services/firebase.service';
import { AuthService } from '../../core/services/auth.service';
import { 
  doc, collection, writeBatch, serverTimestamp, 
  updateDoc, setDoc, getDocs, deleteDoc, getDoc,
  query, orderBy, runTransaction, limit, startAfter, where, QueryDocumentSnapshot, QueryConstraint, onSnapshot, Unsubscribe, deleteField, increment, Timestamp
} from 'firebase/firestore';
import { ReferenceStandard, UsageLog, StandardsPage, ImportPreviewItem, ImportUsageLogPreviewItem, StandardRequest, StandardRequestStatus, PurchaseRequest } from '../../core/models/standard.model';
import { ToastService } from '../../core/services/toast.service';
import { NotificationService } from '../../core/services/notification.service';
import { generateSlug, getStandardizedAmount, parseQuantityInput } from '../../shared/utils/utils';

@Injectable({ providedIn: 'root' })
export class StandardService {
  private fb = inject(FirebaseService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private notificationService = inject(NotificationService);

  // ─── Delta Sync Cache ───────────────────────────────────────────────────────
  // localStorage keys
  private readonly STD_CACHE_KEY       = 'lims_std_list_cache';
  private readonly STD_SYNC_SECONDS_KEY = 'lims_std_sync_seconds';

  // L1: In-memory (0 reads, mất khi F5)
  private _memStandards: ReferenceStandard[] | null = null;

  // Live listener singleton (onSnapshot where lastUpdated > NOW)
  private _liveUnsub?: Unsubscribe;
  private _liveCallbacks: Array<() => void> = [];

  constructor() {
    // Tự động dọn dẹp khi user logout — dừng live listener, xóa in-memory
    effect(() => {
      const user = this.auth.currentUser();
      if (!user) {
        this._cleanupOnLogout();
      }
    });
  }

  // ─── Cleanup khi logout ─────────────────────────────────────────────────────
  private _cleanupOnLogout(): void {
    // 1. Dừng live listener
    if (this._liveUnsub) {
      this._liveUnsub();
      this._liveUnsub = undefined;
    }
    this._liveCallbacks = [];
    // 2. Xóa in-memory cache (force re-validate sau login tiếp theo)
    this._memStandards = null;
    // localStorage GIỮ lại để làm fallback offline / tiết kiệm reads lần login tiếp
  }

  // ─── DELTA SYNC: Load (Pha 1) ──────────────────────────────────────────────
  /**
   * Load standards với chiến lược 3 lớp:
   *   L1: _memStandards (in-memory) → 0 reads, mất khi F5
   *   L2: localStorage              → 0 reads, sống qua F5
   *   L3: getDocs(where lastUpdated > lastSyncTime) → chỉ đọc docs THAY ĐỔI
   *
   * Cold start (localStorage trống): getDocs all → N reads (bắt buộc, 1 lần duy nhất)
   * F5 không đổi: apply L2 + delta empty = 0 reads thêm
   * F5 có K doc đổi: apply L2 + delta K docs = K reads
   * Navigate: L1 hit = 0 reads
   */
  async loadStandardsWithDeltaSync(): Promise<ReferenceStandard[]> {
    // L1: In-memory (navigate đi/về trong session = 0 reads)
    if (this._memStandards !== null) {
      return this._memStandards;
    }

    // L2: localStorage (0 reads, apply ngay để UI hiển thị tức thì)
    const localItems = this._loadStdFromCache();
    const lastSyncSec = Number(localStorage.getItem(this.STD_SYNC_SECONDS_KEY) || 0);

    if (!localItems || lastSyncSec === 0) {
      // COLD START: chưa có cache, fetch toàn bộ
      return await this._fetchAllAndCache();
    }

    // WARM START: apply cache ngay vào memory
    this._memStandards = localItems;

    // Background: delta query — chỉ đọc docs thay đổi sau lần sync cuối
    try {
      const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'reference_standards');
      const deltaSnap = await getDocs(query(
        colRef,
        where('lastUpdated', '>', Timestamp.fromMillis(lastSyncSec * 1000))
      ));

      if (!deltaSnap.empty) {
        // Có K docs thay đổi — chỉ đọc K docs này
        const changed: ReferenceStandard[] = [];
        const deletedIds: string[] = [];

        deltaSnap.docs.forEach(d => {
          const data = d.data();
          if (data['_isDeleted'] === true || data['status'] === 'DELETED') {
            deletedIds.push(d.id);
          } else {
            changed.push({ id: d.id, ...data } as ReferenceStandard);
          }
        });

        this._mergeAndSave(changed, deletedIds);
      }
      // deltaSnap.empty = không có gì thay đổi → 0 reads thêm ✓
    } catch (e) {
      // Lỗi network: dùng L2 cache làm fallback (offline mode)
      console.warn('[StandardService] Delta sync error, using cached data:', e);
    }

    return this._memStandards!;
  }

  // ─── DELTA SYNC: Live Listener Singleton (Pha 2) ───────────────────────────
  /**
   * Singleton live listener dùng onSnapshot(where lastUpdated > NOW).
   * - Lần đầu emit = EMPTY (0 reads, không có doc nào > NOW)
   * - Khi doc thay đổi: fire với chỉ doc đó → 1 read → merge vào cache → notify UI
   * - Singleton: chỉ tạo 1 lần/session, chia sẻ cho mọi component
   *
   * Trả về hàm REMOVE CALLBACK (không phải unsubscribe listener).
   */
  startRealtimeDeltaListener(cb: () => void): () => void {
    this._liveCallbacks.push(cb);

    if (!this._liveUnsub) {
      // Chỉ lắng nghe docs thay đổi TỪ THỜI ĐIỂM NÀY → 0 reads lần đầu
      const startTime = Timestamp.now();
      const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'reference_standards');
      const q = query(colRef, where('lastUpdated', '>', startTime));

      this._liveUnsub = onSnapshot(q, (snapshot) => {
        if (snapshot.empty) return;

        const changed: ReferenceStandard[] = [];
        const deletedIds: string[] = [];

        snapshot.docChanges().forEach(change => {
          const data = change.doc.data();
          if (data['_isDeleted'] === true || data['status'] === 'DELETED') {
            deletedIds.push(change.doc.id);
          } else {
            changed.push({ id: change.doc.id, ...data } as ReferenceStandard);
          }
        });

        this._mergeAndSave(changed, deletedIds);
        // Notify tất cả components đã đăng ký
        this._liveCallbacks.forEach(fn => fn());

      }, (err) => {
        // Lỗi permission (logout hoặc token hết hạn) → tự dọn dẹp
        console.warn('[StandardService] Live listener error:', err.code);
        if (err.code === 'permission-denied' || err.code === 'unauthenticated') {
          if (this._liveUnsub) { this._liveUnsub(); this._liveUnsub = undefined; }
          this._liveCallbacks = [];
        }
      });
    }

    // Trả về hàm remove callback (KHÔNG hủy listener)
    return () => {
      this._liveCallbacks = this._liveCallbacks.filter(fn => fn !== cb);
    };
  }

  // ─── INVALIDATE CACHE ───────────────────────────────────────────────────────
  /**
   * Gọi sau mọi write operation.
   * Xóa L1 in-memory + xóa STD_SYNC_SECONDS_KEY để buộc delta re-fetch.
   * GIỮ lại localStorage data để fallback offline.
   */
  invalidateLocalStandardsCache(): void {
    this._memStandards = null;
    localStorage.removeItem(this.STD_SYNC_SECONDS_KEY);
  }

  /** @deprecated Dùng invalidateLocalStandardsCache() */
  invalidateStandardsCache(): void {
    this.invalidateLocalStandardsCache();
  }

  // ─── GET SINGLE STANDARD BY ID (3-tier fallback) ────────────────────────────
  /**
   * Lấy 1 chuẩn theo ID với chiến lược 3 lớp:
   *   L1: _memStandards (in-memory)  → 0 reads, instant
   *   L2: localStorage cache          → 0 reads, ~5ms
   *   L3: Firestore getDoc()          → 1 read, slow but always correct
   *
   * Dùng cho trang StandardDetailComponent khi deep-link trực tiếp.
   */
  async getStandardById(stdId: string): Promise<ReferenceStandard | null> {
    // L1: In-memory cache
    if (this._memStandards) {
      const found = this._memStandards.find(s => s.id === stdId);
      if (found) return found;
    }
    // L2: localStorage cache
    const cached = this._loadStdFromCache();
    if (cached) {
      const found = cached.find(s => s.id === stdId);
      if (found) return found;
    }
    // L3: Firestore single doc read (1 read)
    try {
      const ref = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'reference_standards', stdId);
      const snap = await getDoc(ref);
      if (!snap.exists()) return null;
      const data = snap.data();
      if (data['_isDeleted'] === true || data['status'] === 'DELETED') return null;
      return { id: snap.id, ...data } as ReferenceStandard;
    } catch (e) {
      console.error('[StandardService] getStandardById error:', e);
      return null;
    }
  }

  /** Lấy tất cả chuẩn từ bộ nhớ/cache (không gây thêm reads nếu đã warm) */
  getAllStandardsFromCache(): ReferenceStandard[] {
    if (this._memStandards) return this._memStandards;
    return this._loadStdFromCache() ?? [];
  }

  // ─── Private Helpers ────────────────────────────────────────────────────────
  /** Merge K changed docs + deleted ids vào _memStandards và lưu vào localStorage */
  private _mergeAndSave(changed: ReferenceStandard[], deletedIds: string[]): void {
    if (!this._memStandards) return;

    // Xóa các doc bị soft-delete
    let items = this._memStandards.filter(i => !deletedIds.includes(i.id));

    // Thêm/cập nhật các doc thay đổi
    changed.forEach(newDoc => {
      const idx = items.findIndex(i => i.id === newDoc.id);
      if (idx >= 0) {
        items[idx] = newDoc;   // Update existing
      } else {
        items.unshift(newDoc); // Add new (đầu danh sách — mới nhất)
      }
    });

    this._memStandards = items;
    this._saveStdToCache(items);
  }

  /** Fetch toàn bộ collection (chỉ chạy lần đầu tiên — cold start) */
  private async _fetchAllAndCache(): Promise<ReferenceStandard[]> {
    const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'reference_standards');
    const snap = await getDocs(query(colRef, orderBy('received_date', 'desc')));
    const items: ReferenceStandard[] = snap.docs
      .filter(d => d.data()['_isDeleted'] !== true && d.data()['status'] !== 'DELETED')
      .map(d => ({ id: d.id, ...d.data() } as ReferenceStandard));
    this._saveStdToCache(items);
    this._memStandards = items;
    return items;
  }

  /** Load từ localStorage (0 Firebase reads) */
  private _loadStdFromCache(): ReferenceStandard[] | null {
    try {
      const raw = localStorage.getItem(this.STD_CACHE_KEY);
      return raw ? (JSON.parse(raw) as ReferenceStandard[]) : null;
    } catch {
      return null;
    }
  }

  /**
   * Lưu vào localStorage.
   * lastSyncSeconds = max(lastUpdated.seconds) của tất cả items trong cache.
   * Nếu localStorage đầy (QuotaExceededError) → im lặng, không crash.
   */
  private _saveStdToCache(items: ReferenceStandard[]): void {
    try {
      localStorage.setItem(this.STD_CACHE_KEY, JSON.stringify(items));
      // Tính max lastUpdated.seconds làm cursor cho delta query lần sau
      const maxSec = items.reduce((max, i) => {
        const sec = (i.lastUpdated as any)?.seconds ?? 0;
        return sec > max ? sec : max;
      }, 0);
      if (maxSec > 0) {
        localStorage.setItem(this.STD_SYNC_SECONDS_KEY, maxSec.toString());
      }
    } catch (e: any) {
      // localStorage đầy hoặc private browsing — graceful degrade
      console.warn('[StandardService] Cache write failed:', e?.name);
      try { localStorage.removeItem(this.STD_CACHE_KEY); } catch {}
    }
  }

  // ─── Legacy in-memory cache (dùng cho getAllStandardsForMatching) ────────────
  // Không cần nữa — dùng _memStandards thay thế

  // --- HELPER: SEARCH KEY GENERATOR ---
  private generateSearchKey(std: ReferenceStandard): string {
    const parts = [
      std.name,
      std.chemical_name,
      std.internal_id,
      std.cas_number,
      std.product_code,
      std.lot_number,
      std.manufacturer,
      std.id
    ];
    
    return parts
      .filter(p => p)
      .join(' ')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // --- HELPER: ROBUST EXCEL DATE PARSER ---
  private parseExcelDate(val: any): string {
      if (val === null || val === undefined) return '';
      
      const strVal = val.toString().trim();
      if (['-', '/', 'na', 'n/a', 'unknown', ''].includes(strVal.toLowerCase())) return '';

      // 1. Case Number (Excel Serial Date)
      let serial = NaN;
      if (typeof val === 'number') serial = val;
      else if (/^\d+(\.\d+)?$/.test(strVal)) serial = parseFloat(strVal);

      if (!isNaN(serial) && serial > 10000) {
          // Excel serial date to JS Date
          // 25569 is the offset between Excel (Dec 30, 1899) and Unix Epoch (Jan 1, 1970)
          // We use UTC to avoid local timezone shifts during conversion
          const dateInfo = new Date(Math.round((serial - 25569) * 86400 * 1000));
          return dateInfo.toISOString().split('T')[0];
      }

      // 2. Case Text (dd/mm/yyyy)
      const parts = strVal.split(/[\/\-\.]/);
      
      if (parts.length >= 3) {
          let day, month, year;
          
          if (parts[0].length === 4) {
              // yyyy-mm-dd
              year = parts[0];
              month = parts[1].padStart(2, '0');
              day = parts[2].padStart(2, '0');
          } else {
              // dd-mm-yyyy (default for VN)
              day = parts[0].padStart(2, '0');
              month = parts[1].padStart(2, '0');
              year = parts[2];
              if (year.length === 2) year = '20' + year;
          }
          
          const nDay = Number(day);
          const nMonth = Number(month);
          if (nDay > 31 || nMonth > 12 || nDay === 0 || nMonth === 0) return '';

          return `${year}-${month}-${day}`; 
      }

      return ''; 
  }

  // --- HELPER: LOG PARSER ---
  private parseLogContent(val: any, defaultDate: string): UsageLog | null {
      if (!val) return null;
      const str = val.toString().trim();
      if (!str) return null;

      const dateRegex = /(?:ng[àa]y|date)?\s*(?:pha\s*ch[ếe])?[:\-\s]*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i;
      const userRegex = /(?:ng[ưươ][ờoi]i|user)(?:\s*pha\s*ch[ếe])?\s*[:\-\s]*([^\d\n\r;]+)/i;
      const amountRegex = /(?:lượng|kl|amount)(?:\s*(?:d[ùu]ng|c[âa]n|used))?[:\s-]*([\d\.,]+)/i;

      const isNumberOnly = /^[0-9.,]+$/.test(str);

      // CASE A: Detailed Text
      if (!isNumberOnly && str.length > 5) {
          const amountMatch = str.match(amountRegex);
          const dateMatch = str.match(dateRegex);
          const userMatch = str.match(userRegex);

          let logAmount = 0;
          if (amountMatch) {
              logAmount = parseFloat(amountMatch[1].replace(',', '.'));
          } else {
              const parts = str.split(/\s+/);
              for (const p of parts.reverse()) {
                  const n = parseFloat(p.replace(',', '.'));
                  if (!isNaN(n)) {
                      logAmount = n;
                      break;
                  }
              }
          }

          if (logAmount > 0) {
              let logDate = defaultDate;
              let logUser = 'Import Data';

              if (dateMatch) {
                  const rawDate = dateMatch[1];
                  const parts = rawDate.split(/[\/\-\.]/);
                  if (parts.length >= 3) {
                      const d = parts[0].padStart(2, '0');
                      const m = parts[1].padStart(2, '0');
                      let y = parts[2];
                      if (y.length === 2) y = '20' + y;
                      logDate = `${y}-${m}-${d}`;
                  }
              }

              if (userMatch) {
                  logUser = userMatch[1].trim();
                  const splitKeywords = ['lượng', 'kl', 'amount', 'ngày', 'date'];
                  const lowerUser = logUser.toLowerCase();
                  for(const k of splitKeywords) {
                      const idx = lowerUser.indexOf(k);
                      if (idx > 0) {
                          logUser = logUser.substring(0, idx).trim();
                          break; 
                      }
                  }
                  logUser = logUser.replace(/[:\-]+$/, '').trim();
              }

              return {
                  date: logDate,
                  user: logUser,
                  amount_used: logAmount,
                  purpose: 'Import Log'
              };
          }
      }

      // CASE B: Number Only
      const cleanNum = parseFloat(str.replace(',', '.'));
      if (!isNaN(cleanNum) && cleanNum > 0) {
           return {
                date: defaultDate,
                user: 'Import Data',
                amount_used: cleanNum,
                purpose: 'Import Log'
            };
      }

      return null;
  }

  // --- READ Operations ---
  
  listenToAllStandards(callback: (items: ReferenceStandard[]) => void): Unsubscribe {
      const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'reference_standards');
      // NOTE: NO limit() here — standards.component.ts needs ALL standards for client-side search.
      // reference_standards is bounded by lab size (typically < 500), so unbounded listen is safe.
      const q = query(colRef, orderBy('received_date', 'desc')); 
      
      return onSnapshot(q, (snapshot) => {
          const items: ReferenceStandard[] = [];
          snapshot.docs.forEach(d => {
              const data = d.data();
              if (data['_isDeleted'] !== true) {
                  items.push({ id: d.id, ...data } as ReferenceStandard);
              }
          });
          callback(items);
      }, (error) => {
          console.error("Error listening to standards:", error);
          this.toast.show('Lỗi kết nối dữ liệu chuẩn.', 'error');
      });
  }

  async getNearestExpiry(): Promise<ReferenceStandard | null> {
      try {
          const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'reference_standards');
          const q = query(colRef, where('expiry_date', '!=', ''), orderBy('expiry_date', 'asc'), limit(1));
          const snapshot = await getDocs(q);
          return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as ReferenceStandard;
      } catch (e: any) { return null; }
  }

  async getStandardsPage(
      pageSize: number, 
      lastDoc: QueryDocumentSnapshot | null, 
      searchTerm: string,
      sortOption = 'received_desc'
  ): Promise<StandardsPage> {
    const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'reference_standards');
    const constraints: QueryConstraint[] = [];

    if (searchTerm) {
      const term = searchTerm.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      constraints.push(where('search_key', '>=', term));
      constraints.push(where('search_key', '<=', term + '\uf8ff'));
      constraints.push(orderBy('search_key'));
    } else {
      switch (sortOption) {
          case 'name_asc': constraints.push(orderBy('name', 'asc')); break;
          case 'name_desc': constraints.push(orderBy('name', 'desc')); break;
          case 'received_desc': constraints.push(orderBy('received_date', 'desc')); break;
          case 'expiry_asc': 
              constraints.push(where('expiry_date', '!=', ''));
              constraints.push(orderBy('expiry_date', 'asc')); 
              break;
          case 'expiry_desc':
              constraints.push(where('expiry_date', '!=', ''));
              constraints.push(orderBy('expiry_date', 'desc'));
              break;
          case 'updated_desc': constraints.push(orderBy('lastUpdated', 'desc')); break;
          default: constraints.push(orderBy('received_date', 'desc')); break;
      }
    }

    if (lastDoc) constraints.push(startAfter(lastDoc));
    constraints.push(limit(pageSize));

    const q = query(colRef, ...constraints);
    const snapshot = await getDocs(q);
    
    return {
      items: snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ReferenceStandard)),
      lastDoc: snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null,
      hasMore: snapshot.docs.length === pageSize
    };
  }

  // --- WRITE Operations ---
  async addStandard(std: ReferenceStandard) {
      std.search_key = this.generateSearchKey(std);
      const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${std.id}`);
      await setDoc(ref, { ...std, lastUpdated: serverTimestamp() });
      await this.logGlobalActivity('CREATE_STANDARD', `Thêm chuẩn mới: ${std.name} (Lô: ${std.lot_number})`, std.id);
      await this.fb.updateMetadata('standards');
      this.invalidateLocalStandardsCache(); // Live listener sẽ tự merge doc mới
  }

  async updateStandard(std: ReferenceStandard) {
      std.search_key = this.generateSearchKey(std);
      const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${std.id}`);
      await updateDoc(ref, { ...std, lastUpdated: serverTimestamp() });
      await this.logGlobalActivity('UPDATE_STANDARD', `Cập nhật chuẩn: ${std.name} (ID: ${std.id})`, std.id);
      await this.fb.updateMetadata('standards');
      this.invalidateLocalStandardsCache();
  }

  async quickUpdateField(stdId: string, fields: Record<string, any>) {
      const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${stdId}`);
      await updateDoc(ref, { ...fields, lastUpdated: serverTimestamp() });
      await this.fb.updateMetadata('standards');
      this.invalidateLocalStandardsCache();
  }

  async updateStandardStock(stdId: string, newAmount: number, reason: string) {
      const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${stdId}`);
      const updateData: any = {
          current_amount: newAmount,
          lastUpdated: serverTimestamp()
      };
      if (newAmount <= 0) {
          updateData.status = 'DEPLETED';
      }
      await updateDoc(ref, updateData);
      await this.logGlobalActivity('UPDATE_STOCK', `Cập nhật tồn kho: ${newAmount} (${reason})`, stdId);
      await this.fb.updateMetadata('standards');
      this.invalidateLocalStandardsCache();
  }

  async deleteStandard(id: string, name: string = '') {
      const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${id}`);
      await updateDoc(ref, {
          _isDeleted: true,
          status: 'DELETED',
          lastUpdated: serverTimestamp()
      });
      await this.logGlobalActivity('SOFT_DELETE_STANDARD', `Đưa chuẩn vào thùng rác: ${name || id}`, id);
      this.invalidateLocalStandardsCache();
  }

  async deleteSelectedStandards(ids: string[]) {
      const BATCH_SIZE = 400;
      let batch = writeBatch(this.fb.db);
      let opCount = 0;

      for (const id of ids) {
          const stdRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${id}`);
          batch.update(stdRef, {
              _isDeleted: true,
              status: 'DELETED',
              lastUpdated: serverTimestamp()
          });
          opCount++;
          if (opCount >= BATCH_SIZE) { await batch.commit(); batch = writeBatch(this.fb.db); opCount = 0; }
      }

      if (opCount > 0) await batch.commit();
      await this.logGlobalActivity('SOFT_DELETE_BATCH', `Đã xóa lô ${ids.length} chuẩn đối chiếu.`);
      this.invalidateLocalStandardsCache();
  }

  async restoreStandard(id: string, name: string = '') {
      const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${id}`);
      await updateDoc(ref, {
          _isDeleted: deleteField(),
          status: 'ACTIVE',
          lastUpdated: serverTimestamp()
      });
      await this.logGlobalActivity('RESTORE_STANDARD', `Khôi phục chuẩn đối chiếu: ${name || id}`, id);
      this.invalidateLocalStandardsCache();
  }

  async getUsageHistory(stdId: string): Promise<UsageLog[]> {
      const logsRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${stdId}/logs`);
      const q = query(logsRef, orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as UsageLog));
  }

  // --- NEW: Global Usage Logs ---
  listenToGlobalUsageLogs(callback: (logs: UsageLog[]) => void): Unsubscribe {
      const colRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_usages`);
      // OPTIMIZED: added limit(100) to prevent unbounded snapshot reads
      const q = query(colRef, orderBy('timestamp', 'desc'), limit(100)); 
      
      return onSnapshot(q, (snapshot) => {
          const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as UsageLog));
          callback(items);
      }, (error) => {
          console.error("Error listening to global usage logs:", error);
      });
  }

  async recordUsage(stdId: string, log: UsageLog) {
      const stdRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${stdId}`);
      const logsRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${stdId}/logs`);
      const newLogRef = doc(logsRef); 

      await runTransaction(this.fb.db, async (transaction) => {
          const stdDoc = await transaction.get(stdRef);
          if (!stdDoc.exists()) throw new Error("Standard does not exist!");

          const stdData = stdDoc.data() as ReferenceStandard;

          // [NEW-6] Nếu chuẩn đang được mượn theo yêu cầu, không cho ghi thẳng.
          // Buộc người dùng ghi qua màn hình Yêu cầu để tránh double-deduction.
          if (stdData.status === 'IN_USE') {
              throw new Error(
                  `Chuẩn "${stdData.name}" đang được ${stdData.current_holder || 'nhân viên khác'} mượn theo yêu cầu. ` +
                  `Vui lòng ghi nhận sử dụng qua màn hình Quản lý Yêu cầu.`
              );
          }

          const currentAmount = stdData.current_amount || 0;
          const stockUnit = stdData.unit || 'mg';
          const usageUnit = log.unit || stockUnit;

          const amountToDeduct = getStandardizedAmount(log.amount_used, usageUnit, stockUnit);
          if (amountToDeduct === null) throw new Error(`Không thể quy đổi từ ${usageUnit} sang ${stockUnit}`);

          const newAmount = currentAmount - amountToDeduct;
          if (newAmount < 0) throw new Error(`Không đủ lượng tồn kho!`);

          const updateData: any = { current_amount: newAmount, lastUpdated: serverTimestamp() };
          if (newAmount <= 0) {
              updateData.status = 'DEPLETED';
          }

          log.id = newLogRef.id;
          if (!log.timestamp) log.timestamp = Date.now();
          if (!log.date) log.date = new Date().toISOString();
          
          log.standardId = stdData.id;
          log.standardName = stdData.name;
          log.lotNumber = stdData.lot_number;
          log.cas_number = stdData.cas_number;
          log.internalId = stdData.internal_id;
          log.manufacturer = stdData.manufacturer;
          // Không gán requestId ở đây vì đây là ghi thẳng (không qua request)

          transaction.update(stdRef, updateData);
          transaction.set(newLogRef, log);
          
          const globalLogRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_usages/${log.id}`);
          transaction.set(globalLogRef, log);
      });
  }

  async deleteUsageLog(stdId: string, logId: string, requestId?: string) {
      const stdRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${stdId}`);
      const logRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${stdId}/logs/${logId}`);
      const globalLogRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_usages/${logId}`);

      await runTransaction(this.fb.db, async (transaction) => {
          const stdDoc = await transaction.get(stdRef);
          const logDoc = await transaction.get(logRef);
          const globalLogDoc = await transaction.get(globalLogRef);
          
          if (!logDoc.exists() && !globalLogDoc.exists()) {
              throw new Error("Không tìm thấy dữ liệu nhật ký trên hệ thống.");
          }

          const logData = logDoc.exists() ? logDoc.data() : globalLogDoc.data();
          
          if (stdDoc.exists()) {
              const stdData = stdDoc.data();
              const stockUnit = stdData['unit'] || 'mg';
              const amountUsed = logData?.['amount_used'] || 0;
              const unitUsed = logData?.['unit'] || stockUnit;
              const currentStock = stdData['current_amount'] || 0;

              const amountToRestore = getStandardizedAmount(amountUsed, unitUsed, stockUnit);
              if (amountToRestore !== null) {
                  const newStock = currentStock + amountToRestore;
                  const updateData: any = { current_amount: newStock, lastUpdated: serverTimestamp() };
                  // [NEW-3] Khôi phục status đúng: kiểm tra current_request_id thay vì set cứng IN_USE
                  if (stdData['status'] === 'DEPLETED' && newStock > 0) {
                      updateData.status = stdData['current_request_id'] ? 'IN_USE' : 'AVAILABLE';
                  }
                  transaction.update(stdRef, updateData);
              }

              // [NEW-4] Ưu tiên requestId được truyền vào, sau đó thử từ logData.requestId,
              // cuối cùng mới dùng current_request_id (chỉ có khi chuẩn đang IN_USE)
              const effectiveRequestId = requestId
                  || logData?.['requestId']
                  || stdData['current_request_id'];

              if (effectiveRequestId) {
                  const reqRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_requests/${effectiveRequestId}`);
                  const reqDoc = await transaction.get(reqRef);
                  if (reqDoc.exists()) {
                      const reqData = reqDoc.data() as StandardRequest;
                      const currentLogs = reqData.usageLogs || [];
                      const updatedLogs = currentLogs.filter(l => l.id !== logId);
                      transaction.update(reqRef, {
                          usageLogs: updatedLogs,
                          totalAmountUsed: Math.max(0, (reqData.totalAmountUsed || 0) - (amountToRestore || 0)),
                          updatedAt: Date.now()
                      });
                  }
              }
          }

          transaction.delete(logRef);
          transaction.delete(globalLogRef);
      });
      
      await this.logGlobalActivity('DELETE_USAGE_LOG', `Xóa dòng nhật ký và hoàn trả tồn kho chuẩn: ${stdId}`, logId);
  }

  // --- GLOBAL LOGGING ---
  public async logGlobalActivity(action: string, details: string, targetId?: string) {
      const logRef = doc(collection(this.fb.db, `artifacts/${this.fb.APP_ID}/logs`));
      await setDoc(logRef, {
          id: logRef.id,
          action,
          details,
          timestamp: serverTimestamp(),
          user: this.auth.currentUser()?.displayName || 'Hệ thống',
          targetId
      });
  }

  async requestCoa(std: ReferenceStandard) {
      const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${std.id}`);
      const snap = await getDoc(ref);
      if (snap.exists() && snap.data()['coa_requested']) {
          throw new Error('Yêu cầu CoA cho chuẩn này đã được gửi trước đó.');
      }

      await this.quickUpdateField(std.id, { coa_requested: true });
      await this.logGlobalActivity('REQUEST_COA', `Yêu cầu bổ sung CoA cho chuẩn: ${std.name} (Lô: ${std.lot_number || 'N/A'})`, std.id);
      
      const user = this.auth.currentUser();
      await this.notificationService.notify({
          recipientUid: 'role:admin', // Push to all admins
          senderUid: user?.uid,
          senderName: user?.displayName || 'Người dùng',
          type: 'COA_REQUEST',
          title: 'Yêu cầu bổ sung CoA',
          message: `${user?.displayName || 'Ai đó'} vừa yêu cầu cập nhật file CoA cho lô chuẩn ${std.name} (Lô: ${std.lot_number || 'N/A'}).`,
          targetId: std.id,
          actionUrl: `/standards/${std.id}`
      });
  }

  // --- REQUEST WORKFLOW ---
  async createRequest(request: StandardRequest, isAssign: boolean = false) {
      const reqRef = doc(collection(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_requests`));
      request.id = reqRef.id;
      request.createdAt = Date.now();
      request.updatedAt = Date.now();
      await setDoc(reqRef, request);
      
      if (isAssign) {
          await this.logGlobalActivity('ASSIGN_STANDARD', `Gán chuẩn: ${request.standardName} cho ${request.requestedByName}`, request.id);
      } else {
          await this.logGlobalActivity('REQUEST_STANDARD', `Yêu cầu chuẩn: ${request.standardName}`, request.id);
          
          const currentUser = this.auth.currentUser();
          await this.notificationService.notify({
              recipientUid: 'role:admin',
              senderUid: currentUser?.uid,
              senderName: currentUser?.displayName || 'Người dùng',
              type: 'BORROW_REQUEST',
              title: 'Yêu cầu mượn chuẩn',
              message: `${currentUser?.displayName || 'Ai đó'} vừa đăng ký mượn lô chuẩn ${request.standardName}.`,
              targetId: request.standardId,
              actionUrl: `/standards/${request.standardId}`
          });
      }
  }

  async updateRequestStatus(requestId: string, status: StandardRequestStatus, updates: Partial<StandardRequest> = {}) {
      const reqRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_requests/${requestId}`);
      await updateDoc(reqRef, { status, ...updates, updatedAt: Date.now() });
      
      const reqDoc = await getDoc(reqRef);
      if (reqDoc.exists()) {
          const reqData = reqDoc.data() as StandardRequest;
          let action = 'UPDATE_STANDARD_REQUEST';
          let details = `Cập nhật yêu cầu: ${reqData.standardName} -> ${status}`;
          if (status === 'REJECTED') {
              action = 'REJECT_STANDARD_REQUEST';
              details = `Từ chối yêu cầu: ${reqData.standardName}`;
              
              const currentUser = this.auth.currentUser();
              await this.notificationService.notify({
                  recipientUid: reqData.requestedBy,
                  senderUid: currentUser?.uid,
                  senderName: currentUser?.displayName || 'Hệ thống',
                  type: 'REQUEST_REJECTED',
                  title: 'Yêu cầu bị từ chối',
                  message: `Yêu cầu mượn lô chuẩn ${reqData.standardName} của bạn không được phê duyệt.`,
                  targetId: reqData.standardId,
                  actionUrl: `/standards/${reqData.standardId}`
              });
          } else if (status === 'PENDING_RETURN') {
              action = 'REPORT_RETURN_STANDARD';
              details = `Báo cáo trả chuẩn: ${reqData.standardName}`;
          }
          await this.logGlobalActivity(action, details, requestId);
      }
  }

  async dispenseStandard(requestId: string, standardId: string, approverId: string, approverName: string, isAssign: boolean = false) {
      const stdRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${standardId}`);
      const reqRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_requests/${requestId}`);
      let reqData: StandardRequest | null = null;

      await runTransaction(this.fb.db, async (transaction) => {
          const stdDoc = await transaction.get(stdRef);
          const reqDoc = await transaction.get(reqRef);
          
          if (!stdDoc.exists()) throw new Error("Chuẩn không tồn tại!");
          if (!reqDoc.exists()) throw new Error("Yêu cầu không tồn tại!");
          
          const stdData = stdDoc.data();
          if (stdData['status'] === 'IN_USE' || stdData['status'] === 'DEPLETED') {
              throw new Error("Chuẩn đang được sử dụng hoặc đã hết!");
          }

          reqData = reqDoc.data() as StandardRequest;

          transaction.update(stdRef, { 
              status: 'IN_USE', 
              current_holder: reqData.requestedByName,
              current_holder_uid: reqData.requestedBy,
              current_request_id: requestId,
              lastUpdated: serverTimestamp() 
          });

          transaction.update(reqRef, { 
              status: 'IN_PROGRESS',
              approvedBy: approverId,
              approvedByName: approverName,
              approvalDate: Date.now(),
              updatedAt: Date.now()
          });
      });

      if (reqData && !isAssign) {
          await this.logGlobalActivity('APPROVE_STANDARD_REQUEST', `Duyệt cấp chuẩn: ${(reqData as StandardRequest).standardName}`, requestId);
          
          const currentUser = this.auth.currentUser();
          await this.notificationService.notify({
              recipientUid: (reqData as StandardRequest).requestedBy,
              senderUid: currentUser?.uid,
              senderName: currentUser?.displayName || 'Quản trị viên',
              type: 'REQUEST_APPROVED',
              title: 'Yêu cầu được duyệt',
              message: `Yêu cầu mượn lô chuẩn ${(reqData as StandardRequest).standardName} đã được phê duyệt. Xin hãy bảo quản cẩn thận!`,
              targetId: standardId,
              actionUrl: `/standards/${standardId}`
          });
      }
      // lastUpdated được serverTimestamp() trong transaction → live listener tự bắt
      this.invalidateLocalStandardsCache();
  }

  async returnStandard(
      requestId: string,
      standardId: string,
      receiverId: string,
      receiverName: string,
      isDepleted = false,
      amountUsed?: number,
      unit?: string,
      disposalReason?: string  // [BUG-1] Tham số mới: lý do hủy chuẩn từ Admin Receive modal
  ) {
      const stdRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${standardId}`);
      const reqRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_requests/${requestId}`);
      let reqData: StandardRequest | null = null;

      await runTransaction(this.fb.db, async (transaction) => {
          const stdDoc = await transaction.get(stdRef);
          const reqDoc = await transaction.get(reqRef);
          
          if (!stdDoc.exists()) throw new Error("Chuẩn không tồn tại!");
          if (!reqDoc.exists()) throw new Error("Yêu cầu không tồn tại!");

          const stdData = stdDoc.data() as ReferenceStandard;
          reqData = reqDoc.data() as StandardRequest;

          // [BUG-2] Xác định xem kho đã được trừ từng đợt chưa (qua logUsageForRequest)
          // Nếu đã có prior logs → KHÔNG trừ kho lần nữa để tránh double-deduction
          const hasPreviousLogs = (reqData.usageLogs || []).length > 0;

          let newAmount = stdData.current_amount || 0;
          const finalUnit = unit || stdData.unit || 'mg';
          // Xác định lượng cho mục đích ghi sổ (không nhất thiết phải trừ kho)
          const finalAmountUsed = amountUsed !== undefined
              ? amountUsed
              : (hasPreviousLogs ? (reqData.totalAmountUsed || 0) : 0);

          // [BUG-2] Chỉ trừ kho nếu CHƯA có prior incremental logs
          if (!hasPreviousLogs && finalAmountUsed > 0) {
              const stockUnit = stdData.unit || 'mg';
              const amountToDeduct = getStandardizedAmount(finalAmountUsed, finalUnit, stockUnit);
              if (amountToDeduct === null) throw new Error(`Không thể quy đổi từ ${finalUnit} sang ${stockUnit}`);
              newAmount -= amountToDeduct;
              if (newAmount < 0) throw new Error(`Không đủ lượng tồn kho!`);
          }

          // [WARN-6] Dùng deleteField() thay null để xóa thực sự field khỏi Firestore document
          transaction.update(stdRef, { 
              status: isDepleted ? 'DEPLETED' : 'AVAILABLE', 
              current_amount: newAmount,
              current_holder: deleteField(),
              current_holder_uid: deleteField(),
              current_request_id: deleteField(),
              lastUpdated: serverTimestamp() 
          });

          // Build request update
          const currentLogs = reqData.usageLogs || [];
          const reqUpdateData: Record<string, any> = {
              status: 'COMPLETED',
              returnDate: Date.now(),
              receivedBy: receiverId,
              receivedByName: receiverName,
              updatedAt: Date.now()
          };

          // [BUG-1] Lưu disposalReason nếu được truyền vào (từ Admin Receive modal)
          if (disposalReason) {
              reqUpdateData['disposalReason'] = disposalReason;
          }

          if (!hasPreviousLogs && finalAmountUsed > 0) {
              // Whole-return flow: tạo log tổng hợp và cập nhật tổng
              const logsRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${standardId}/logs`);
              const newLogRef = doc(logsRef);
              const log: UsageLog = {
                  id: newLogRef.id,
                  timestamp: Date.now(),
                  date: new Date().toISOString(),
                  user: receiverName,
                  amount_used: finalAmountUsed,
                  unit: finalUnit,
                  purpose: disposalReason || reqData.disposalReason || reqData.purpose || 'Sử dụng theo yêu cầu',
                  standardId: stdData.id,
                  standardName: stdData.name,
                  lotNumber: stdData.lot_number,
                  cas_number: stdData.cas_number,
                  internalId: stdData.internal_id,
                  manufacturer: stdData.manufacturer
              };
              reqUpdateData['totalAmountUsed'] = finalAmountUsed;
              reqUpdateData['usageLogs'] = [...currentLogs, log];
              transaction.set(newLogRef, log);
              const globalLogRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_usages/${log.id}`);
              transaction.set(globalLogRef, log);
          } else {
              // [BUG-2] Giữ nguyên totalAmountUsed đã tích lũy từ các đợt dùng dần
              reqUpdateData['totalAmountUsed'] = reqData.totalAmountUsed || 0;
          }

          transaction.update(reqRef, reqUpdateData);
      });

      if (reqData) {
          await this.logGlobalActivity('RETURN_STANDARD', `Nhận lại chuẩn: ${(reqData as StandardRequest).standardName}`, requestId);
      }
      // lastUpdated được serverTimestamp() trong transaction → live listener tự bắt
      this.invalidateLocalStandardsCache();
  }

  async logUsageForRequest(requestId: string, standardId: string, amount: number, unit: string, purpose: string, userId: string, userName: string) {
      const stdRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${standardId}`);
      const reqRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_requests/${requestId}`);
      const logsRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${standardId}/logs`);
      const newLogRef = doc(logsRef);
      
      await runTransaction(this.fb.db, async (transaction) => {
          const stdDoc = await transaction.get(stdRef);
          const reqDoc = await transaction.get(reqRef);
          if (!stdDoc.exists()) throw new Error("Chuẩn không tồn tại!");
          if (!reqDoc.exists()) throw new Error("Yêu cầu không tồn tại!");
          
          const stdData = stdDoc.data() as ReferenceStandard;
          const reqData = reqDoc.data() as StandardRequest;

          // [NEW-2] Guard 1: Kiểm tra trạng thái request — chỉ ghi nhận khi đang IN_PROGRESS
          if (reqData.status !== 'IN_PROGRESS') {
              throw new Error(`Không thể ghi nhận: yêu cầu đang ở trạng thái "${reqData.status}". Chỉ được ghi khi đang sử dụng.`);
          }

          // [NEW-2] Guard 2: Kiểm tra quyền — chỉ người mượn mới được ghi nhận
          if (userId && reqData.requestedBy && reqData.requestedBy !== userId) {
              throw new Error('Bạn không có quyền ghi nhận sử dụng cho yêu cầu của người khác.');
          }
          
          const stockUnit = stdData.unit || 'mg';
          const amountToDeduct = getStandardizedAmount(amount, unit, stockUnit);
          if (amountToDeduct === null) throw new Error(`Không thể quy đổi đơn vị`);
          
          const newAmount = (stdData.current_amount || 0) - amountToDeduct;
          if (newAmount < 0) throw new Error(`Không đủ lượng tồn kho!`);

          const log: UsageLog = {
              id: newLogRef.id,
              timestamp: Date.now(),
              date: new Date().toISOString(),
              user: userName,
              amount_used: amount,
              unit: unit,
              purpose: purpose || 'Báo cáo sử dụng',
              standardId: stdData.id,
              standardName: stdData.name,
              lotNumber: stdData.lot_number,
              cas_number: stdData.cas_number,
              internalId: stdData.internal_id,
              manufacturer: stdData.manufacturer,
              requestId: requestId  // [NEW-4] Lưu requestId vào log để deleteUsageLog tìm lại được
          };

          transaction.set(newLogRef, log);
          const globalLogRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_usages/${log.id}`);
          transaction.set(globalLogRef, log);
          
          transaction.update(stdRef, {
              current_amount: newAmount,
              status: newAmount <= 0 ? 'DEPLETED' : stdData.status,
              lastUpdated: serverTimestamp()
          });

          const currentLogs = reqData.usageLogs || [];
          transaction.update(reqRef, {
              totalAmountUsed: (reqData.totalAmountUsed || 0) + amountToDeduct,
              usageLogs: [...currentLogs, log],
              updatedAt: Date.now()
          });
      });
      
      await this.logGlobalActivity('LOG_USAGE_STANDARD', `Khai báo sử dụng ${amount}${unit} chuẩn: ${standardId}`, requestId);
      
      // Stock Low Alert Logic! Limit fetched outside transaction for speed, assuming typical behavior.
      const stdRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${standardId}`);
      const afterSnap = await getDoc(stdRef);
      if (afterSnap.exists()) {
          const s = afterSnap.data() as ReferenceStandard;
          const initial = s.initial_amount || 0;
          const current = s.current_amount || 0;
          const threshold = initial * 0.2; // 20%
          
          if (current > 0 && current <= threshold) {
              await this.notificationService.notify({
                  recipientUid: 'role:admin',
                  senderUid: 'system',
                  senderName: 'Hệ thống LIMS',
                  type: 'STOCK_LOW_ALERT',
                  title: 'Cảnh báo tồn kho thấp',
                  message: `Lô chuẩn ${s.name} chỉ còn ${formatNum(current)} ${s.unit} (dưới 20%). Vui lòng cân nhắc đặt mua thêm.`,
                  targetId: standardId,
                  actionUrl: `/standards/${standardId}`
              });
          }
      }
  }

  async hardDeleteRequest(request: StandardRequest) {
      const reqRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_requests/${request.id}`);
      const stdRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${request.standardId}`);
      
      await runTransaction(this.fb.db, async (transaction) => {
          const stdDoc = await transaction.get(stdRef);
          
          if (stdDoc.exists()) {
              const stdData = stdDoc.data() as ReferenceStandard;
              const stockUnit = stdData.unit || 'mg';
              
              let newAmount = stdData.current_amount || 0;
              let updates: any = { lastUpdated: serverTimestamp() };

              // 1. Revert quantity
              if (request.totalAmountUsed > 0) {
                  let amountToRestore = 0;
                  (request.usageLogs || []).forEach(log => {
                      const standardized = getStandardizedAmount(log.amount_used, log.unit || stockUnit, stockUnit);
                      if (standardized !== null) amountToRestore += standardized;
                  });

                  if (amountToRestore > 0) {
                      newAmount += amountToRestore;
                      updates.current_amount = newAmount;
                      if (stdData.status === 'DEPLETED' && newAmount > 0) {
                          updates.status = 'AVAILABLE';
                      }
                  }
              }

              // 2. Revert status if it was active
              if (stdData.current_request_id === request.id) {
                  updates.status = 'AVAILABLE';
                  updates.current_holder = null;
                  updates.current_holder_uid = null;
                  updates.current_request_id = null;
              }

              transaction.update(stdRef, updates);

              // 3. Delete usage logs from subcollection and global collection
              (request.usageLogs || []).forEach(log => {
                  if (log.id) {
                      const logRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${request.standardId}/logs/${log.id}`);
                      transaction.delete(logRef);
                      
                      const globalLogRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_usages/${log.id}`);
                      transaction.delete(globalLogRef);
                  }
              });
          }

          // 4. Delete the request
          transaction.delete(reqRef);
      });

      await this.logGlobalActivity('HARD_DELETE_REQUEST', `Xóa hoàn toàn lịch sử yêu cầu: ${request.standardName} (Người yêu cầu: ${request.requestedByName})`, request.id);
  }



  listenToRequests(callback: (requests: StandardRequest[]) => void) {
      const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'standard_requests');
      // [WARN-2] Thêm limit(300) để tránh đọc không giới hạn khi collection lớn dần
      const q = query(colRef, orderBy('createdAt', 'desc'), limit(300));
      return onSnapshot(q, (snapshot) => {
          callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as StandardRequest)));
      });
  }

  // --- EXCEL PARSER ---
  async parseExcelData(file: File): Promise<ImportPreviewItem[]> {
    const XLSX = await import('xlsx');
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array', cellDates: false }); 
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const rawRows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '', raw: false });
          if (!rawRows || rawRows.length === 0) throw new Error('File rỗng');

          const normalizeKey = (key: string) => key.toString().replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
          const getValueByAlias = (row: any, aliases: string[]) => {
            const keys = Object.keys(row);
            const foundKey = keys.find(k => aliases.some(alias => k === alias || k.includes(alias)));
            return foundKey ? row[foundKey] : undefined;
          };
          const results: ImportPreviewItem[] = [];
          const seenIds = new Map<string, number>();

          for (const rawRow of rawRows) {
             const row: Record<string, any> = {};
             Object.keys(rawRow).forEach(k => row[normalizeKey(k)] = rawRow[k]);

             const rawName = getValueByAlias(row, ['tên chuẩn', 'tên hóa học']) || '';
             const nameParts = rawName.toString().split(/[\n\r]+/);
             const name = nameParts[0]?.trim();
             
             if (!name) continue;

             const chemicalName = nameParts.length > 1 ? nameParts.slice(1).join(' ').trim() : (getValueByAlias(row, ['tên khác', 'tên hóa học']) || '').toString().trim();
             const lot = (getValueByAlias(row, ['lot', 'số lô lot', 'lô']) || '').toString().trim();

             const rawPackText = (getValueByAlias(row, ['quy cách', 'đóng gói']) || '').toString().trim(); 
             const rawAmount = getValueByAlias(row, ['khối lượng chai', 'kl chai', 'khối lượng', 'lượng']);
             
             let initial = 0;
             let unit = 'mg';

             if (rawAmount !== undefined && rawAmount !== null && rawAmount !== '') {
                 const parsed = parseQuantityInput(rawAmount.toString(), 'mg'); 
                 if (parsed !== null) initial = parsed;
                 
                 // Try to detect unit from the string itself
                 const unitMatch = rawAmount.toString().match(/[a-zA-Zµ]+/);
                 if (unitMatch) unit = unitMatch[0];
             }

             const lowerPack = rawPackText.toLowerCase();
             if (lowerPack.includes('ml') || lowerPack.includes('milliliter') || lowerPack.includes('lít')) unit = 'mL';
             else if (lowerPack.includes('µg') || lowerPack.includes('ug') || lowerPack.includes('mcg')) unit = 'µg';
             else if (lowerPack.includes('kg')) unit = 'kg';
             else if (lowerPack.includes('g') && !lowerPack.includes('mg') && !lowerPack.includes('kg')) unit = 'g';
             
             // Fallback for numeric amounts if initial is still 0
             if (initial === 0) {
                 const fallbackVal = parseFloat((getValueByAlias(row, ['khối lượng chai', 'kl chai']) || '').toString().replace(',', '.'));
                 if (!isNaN(fallbackVal)) initial = fallbackVal;
             }

             let packSize = rawPackText;
             const packHasNumber = /^[\d.,]+/.test(rawPackText);
             if (!packHasNumber && initial > 0 && packSize) { packSize = `${initial} ${packSize}`; }
             if (!packSize) { packSize = `${initial} ${unit}`; }

             const internalId = (getValueByAlias(row, ['số nhận diện', 'mã chuẩn', 'mã nhận diện']) || '').toString().trim();
             let current = initial;
             const rawCurrentStr = (getValueByAlias(row, ['lượng còn lại', 'tồn kho', 'hiện tại']) || '').toString().trim();
             if (rawCurrentStr !== '') {
                 const match = rawCurrentStr.match(/[\d\.]+/); 
                 if (match && !isNaN(parseFloat(match[0]))) current = parseFloat(match[0]);
             }

             let location = (getValueByAlias(row, ['vị trí', 'nơi để']) || '').toString().trim();
             const storageCondition = (getValueByAlias(row, ['điều kiện bảo quản', 'bảo quản']) || '').toString().trim();
             
             if (!location && storageCondition) {
                 const lower = storageCondition.toLowerCase();
                 if (lower.includes('ft') || lower.includes('đông') || lower.includes('-20')) location = 'Tủ A';
                 else if (lower.includes('ct') || lower.includes('mát') || lower.includes('2-8')) location = 'Tủ B';
                 else if (lower.includes('rt') || lower.includes('thường')) location = 'Tủ C';
             }

             let idStr = name;
             if (lot) idStr += '_' + lot;
             if (internalId) idStr += '_' + internalId;
             if (!lot && !internalId) idStr += '_' + Math.random().toString().substr(2, 5);
             let id = generateSlug(idStr);
             
             if (seenIds.has(id)) {
                 const count = seenIds.get(id)! + 1;
                 seenIds.set(id, count);
                 id = `${id}_${count}`;
             } else {
                 seenIds.set(id, 1);
             }
             
             const receivedDate = this.parseExcelDate(getValueByAlias(row, ['ngày nhận', 'ngày nhập']));
             const expiryDate = this.parseExcelDate(getValueByAlias(row, ['hạn sử dụng', 'hạn dùng']));

             const standard: ReferenceStandard = {
                 id, name, chemical_name: chemicalName,
                 internal_id: internalId, location: location,
                 pack_size: packSize, lot_number: lot,
                 contract_ref: (getValueByAlias(row, ['hợp đồng dự toán', 'hợp đồng', 'dự toán']) || '').toString().trim(),
                 received_date: receivedDate, expiry_date: expiryDate,
                 initial_amount: isNaN(initial) ? 0 : initial,
                 current_amount: current, unit: unit,
                 product_code: (getValueByAlias(row, ['product code', 'mã sản phẩm']) || '').toString().trim(),
                 manufacturer: (getValueByAlias(row, ['hãng', 'nhà sản xuất']) || '').toString().trim(),
                 cas_number: (getValueByAlias(row, ['cas number', 'số cas']) || '').toString().trim(),
                 storage_condition: storageCondition,
                 storage_status: 'Sẵn sàng', purity: '', 
                 status: current <= 0 ? 'DEPLETED' : 'AVAILABLE',
                 lastUpdated: null 
             };
             standard.search_key = this.generateSearchKey(standard);

             const logs: any[] = [];
             const addedLogs = new Set<string>();
             const logDefaultDate = receivedDate || new Date().toISOString().split('T')[0];
             const keys = Object.keys(row);
             
             for (let i = 1; i <= 20; i++) { 
                 const logKey = keys.find(k => k.includes(`lần`) && k.includes(`${i}`));
                 if (logKey && row[logKey]) {
                     const logData = this.parseLogContent(row[logKey], logDefaultDate);
                     if (logData) {
                         const logSignature = `${logData.date}_${logData.user}_${logData.amount_used}`;
                         if (!addedLogs.has(logSignature)) {
                             addedLogs.add(logSignature);
                             logs.push({ ...logData, unit: unit, timestamp: new Date().getTime() + i });
                         }
                     }
                 }
             }

             results.push({
                 raw: { 'Ngày nhận (Gốc)': getValueByAlias(row, ['ngày nhận']), 'Hạn dùng (Gốc)': getValueByAlias(row, ['hạn sử dụng']) },
                 parsed: standard, logs: logs, isValid: true
             });
          }
          resolve(results);
        } catch (err: any) { reject(err); }
      };
      reader.readAsArrayBuffer(file);
    });
  }

  async saveImportedData(data: ImportPreviewItem[]) {
      if (!data || data.length === 0) return;
      let batch = writeBatch(this.fb.db);
      let opCount = 0; 
      const MAX_BATCH_SIZE = 400;

      for (const item of data) {
          const stdRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${item.parsed.id}`);
          batch.set(stdRef, { ...item.parsed, lastUpdated: serverTimestamp() });
          opCount++;

          if (item.logs && item.logs.length > 0) {
              for (const log of item.logs) {
                  const logId = `log_${Date.now()}_${Math.floor(Math.random()*1000)}`;
                  const logRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${item.parsed.id}/logs/${logId}`);
                  log.id = logId;
                  log.standardId = item.parsed.id;
                  log.standardName = item.parsed.name;
                  log.lotNumber = item.parsed.lot_number;
                  log.cas_number = item.parsed.cas_number;
                  log.internalId = item.parsed.internal_id;
                  log.manufacturer = item.parsed.manufacturer;
                  
                  batch.set(logRef, log);
                  
                  const globalLogRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_usages/${logId}`);
                  batch.set(globalLogRef, log);
                  
                  opCount += 2;
              }
          }

          if (opCount >= MAX_BATCH_SIZE) { await batch.commit(); batch = writeBatch(this.fb.db); opCount = 0; }
      }
      if (opCount > 0) await batch.commit();
      await this.fb.updateMetadata('standards');
      this.invalidateLocalStandardsCache();
  }

  // --- USAGE LOG EXCEL PARSER ---
  async parseUsageLogExcelData(file: File): Promise<ImportUsageLogPreviewItem[]> {
    const XLSX = await import('xlsx');
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e: any) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array', cellDates: false }); 
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const rawRows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '', raw: false });
          if (!rawRows || rawRows.length === 0) throw new Error('File rỗng');

          const normalizeKey = (key: string) => key.toString().replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
          const getValueByAlias = (row: any, aliases: string[]) => {
            const keys = Object.keys(row);
            const foundKey = keys.find(k => aliases.some(alias => k === alias || k.includes(alias)));
            return foundKey ? row[foundKey] : undefined;
          };
          const results: ImportUsageLogPreviewItem[] = [];
          
          // Fetch all existing standards to match against
          const existingStandards = await this.getAllStandardsForMatching();
          const logsCache = new Map<string, UsageLog[]>(); 

          for (const rawRow of rawRows) {
             const row: Record<string, any> = {};
             Object.keys(rawRow).forEach(k => row[normalizeKey(k)] = rawRow[k]);

             const rawName = getValueByAlias(row, ['tên chuẩn', 'tên chất', 'chuẩn']) || '';
             const nameParts = rawName.toString().split(/[\n\r]+/);
             const name = nameParts[0]?.trim();

             if (!name) continue;

             const lot = (getValueByAlias(row, ['lot', 'số lô lot', 'lô']) || '').toString().trim();
             const internalId = (getValueByAlias(row, ['số nhận diện', 'mã chuẩn', 'mã nhận diện']) || '').toString().trim();
             
             // Match standard
             let matchedStandard: ReferenceStandard | null = null;
             if (internalId) {
                 matchedStandard = existingStandards.find(s => s.internal_id === internalId) || null;
             }
             if (!matchedStandard && name && lot) {
                 matchedStandard = existingStandards.find(s => s.name.toLowerCase() === name.toLowerCase() && s.lot_number === lot) || null;
             }

             // Parse Usage Log Data
             const prepDateRaw = getValueByAlias(row, ['ngày pha chế', 'ngày sử dụng', 'ngày pha', 'date', 'ngày']);
             const preparer = (getValueByAlias(row, ['người pha chế', 'người sử dụng', 'người pha', 'nhân viên', 'user', 'người']) || '').toString().trim();
             const amountUsedRaw = getValueByAlias(row, ['lượng dùng', 'khối lượng dùng', 'lượng', 'khối lượng', 'kl dùng', 'lượng cân']);
             const unitRaw = getValueByAlias(row, ['đơn vị', 'unit']) || '';
             
             const prepDate = this.parseExcelDate(prepDateRaw);
             let amountUsed = 0;
             let usageUnit = matchedStandard ? matchedStandard.unit : 'mg';

             if (amountUsedRaw !== undefined && amountUsedRaw !== null && amountUsedRaw !== '') {
                 const targetUnit = matchedStandard ? matchedStandard.unit : 'mg';
                 const parsed = parseQuantityInput(amountUsedRaw.toString(), targetUnit);
                 if (parsed !== null) {
                     amountUsed = parsed;
                     const unitMatch = amountUsedRaw.toString().match(/[a-zA-Zµ]+/);
                     if (unitMatch) usageUnit = unitMatch[0];
                 } else {
                     const val = parseFloat(amountUsedRaw.toString().replace(',', '.'));
                     if (!isNaN(val)) amountUsed = val;
                 }
             }
             
             if (unitRaw) usageUnit = unitRaw.toString().trim();

             let isValid = true;
             let errorMessage = '';

             if (!matchedStandard) {
                 isValid = false;
                 errorMessage = 'Không tìm thấy chất chuẩn tương ứng trong hệ thống.';
             } else if (!prepDate) {
                 isValid = false;
                 errorMessage = 'Ngày pha chế không hợp lệ.';
             } else if (!preparer) {
                 isValid = false;
                 errorMessage = 'Thiếu người pha chế.';
             } else if (amountUsed <= 0) {
                 isValid = false;
                 errorMessage = 'Lượng dùng không hợp lệ.';
             }

             const log: UsageLog = {
                 date: prepDate || new Date().toISOString().split('T')[0],
                 user: preparer,
                 amount_used: amountUsed,
                 unit: usageUnit,
                 purpose: 'Import Log',
                 timestamp: new Date().getTime(),
                 standardId: matchedStandard ? matchedStandard.id : undefined,
                 standardName: matchedStandard ? matchedStandard.name : undefined,
                 lotNumber: matchedStandard ? matchedStandard.lot_number : undefined,
                 cas_number: matchedStandard ? matchedStandard.cas_number : undefined,
                 internalId: matchedStandard ? matchedStandard.internal_id : undefined,
                 manufacturer: matchedStandard ? matchedStandard.manufacturer : undefined
             };

             let isDuplicate = false;
             if (matchedStandard && isValid) {
                 if (!logsCache.has(matchedStandard.id!)) {
                     const logsRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${matchedStandard.id}/logs`);
                     const snapshot = await getDocs(logsRef);
                     const logs = snapshot.docs.map(doc => doc.data() as UsageLog);
                     logsCache.set(matchedStandard.id!, logs);
                 }
                 
                 const existingLogs = logsCache.get(matchedStandard.id!) || [];
                 const duplicate = existingLogs.find(l => l.date === log.date && l.user === log.user && l.amount_used === log.amount_used);
                 
                 if (duplicate) {
                     isDuplicate = true;
                     isValid = false;
                     errorMessage = 'Nhật ký đã tồn tại.';
                 } else {
                     existingLogs.push(log);
                     logsCache.set(matchedStandard.id!, existingLogs);
                 }
             }

             results.push({
                 raw: { 'Tên': name, 'Lô': lot, 'Ngày': prepDateRaw, 'Người': preparer, 'Lượng': amountUsedRaw },
                 standard: matchedStandard,
                 log: log,
                 isDuplicate: isDuplicate,
                 isValid: isValid,
                 errorMessage: errorMessage
             });
          }
          resolve(results);
        } catch (err: any) { reject(err); }
      };
      reader.readAsArrayBuffer(file);
    });
  }

  private async getAllStandardsForMatching(): Promise<ReferenceStandard[]> {
      // Tận dụng _memStandards nếu đã có (0 reads)
      if (this._memStandards !== null && this._memStandards.length > 0) {
          return this._memStandards;
      }
      // Fallback: gọi delta sync để load (cold start)
      return await this.loadStandardsWithDeltaSync();
  }

  async saveImportedUsageLogs(data: ImportUsageLogPreviewItem[]) {
      if (!data || data.length === 0) return;
      
      const validItems = data.filter(item => item.isValid && !item.isDuplicate && item.standard);
      if (validItems.length === 0) return;

      let batch = writeBatch(this.fb.db);
      let opCount = 0;
      const MAX_BATCH_SIZE = 400;

      // Group logs by standard ID to calculate total amount to deduct
      const logsByStandard = new Map<string, { standard: ReferenceStandard, logs: UsageLog[] }>();

      for (const item of validItems) {
          const stdId = item.standard!.id;
          if (!logsByStandard.has(stdId)) {
              logsByStandard.set(stdId, { standard: item.standard!, logs: [] });
          }
          logsByStandard.get(stdId)!.logs.push(item.log);
      }

      for (const [stdId, { standard, logs }] of logsByStandard.entries()) {
          const stdRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${stdId}`);
          let totalAmountDeducted = 0;

          for (const log of logs) {
              const logsCollRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${stdId}/logs`);
              const logRef = doc(logsCollRef);
              log.id = logRef.id;
              batch.set(logRef, log);
              const globalLogRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_usages/${logRef.id}`);
              batch.set(globalLogRef, log);
              opCount += 2;

              // Calculate deduction based on unit
              const deduction = getStandardizedAmount(log.amount_used, log.unit || 'mg', standard.unit);
              if (deduction !== null) {
                  totalAmountDeducted += deduction;
              }
          }

          // [BUG-6] Dùng increment() để trừ kho nguyên tử, tránh race condition
          // khi nhiều log được lưu đồng thời hoặc cache bị stale
          const updateData: any = {
              current_amount: increment(-totalAmountDeducted),
              lastUpdated: serverTimestamp()
          };
          batch.update(stdRef, updateData);
          opCount++;

          if (opCount >= MAX_BATCH_SIZE) { await batch.commit(); batch = writeBatch(this.fb.db); opCount = 0; }
      }

      if (opCount > 0) await batch.commit();
  }

  // --- PURCHASE REQUESTS ---
  async createPurchaseRequest(req: Partial<PurchaseRequest>) {
      const id = doc(collection(this.fb.db, 'artifacts')).id; // Random ID
      const newReq: PurchaseRequest = {
          ...req,
          id,
          requestDate: Date.now(),
          status: 'PENDING'
      } as PurchaseRequest;

      const reqRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/purchase_requests/${id}`);
      const stdRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${req.standardId}`);

      await runTransaction(this.fb.db, async (transaction) => {
          transaction.set(reqRef, newReq);
          transaction.update(stdRef, { restock_requested: true, lastUpdated: serverTimestamp() });
      });
      return id;
  }

  listenToPendingPurchaseRequests(callback: (reqs: PurchaseRequest[]) => void): Unsubscribe {
      const reqRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/purchase_requests`);
      const q = query(reqRef, where('status', '==', 'PENDING'));
      return onSnapshot(q, (snapshot) => {
          const reqs: PurchaseRequest[] = [];
          snapshot.forEach(doc => {
              reqs.push({ ...doc.data(), id: doc.id } as PurchaseRequest);
          });
          callback(reqs);
      });
  }

  async completePurchaseRequest(reqId: string, stdId: string, processedBy: string, processedByName: string) {
      const batch = writeBatch(this.fb.db);
      
      const reqRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/purchase_requests/${reqId}`);
      batch.update(reqRef, { 
          status: 'COMPLETED',
          processedDate: Date.now(),
          processedBy,
          processedByName
      });

      // Reset restock_requested on standard
      const stdRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${stdId}`);
      batch.update(stdRef, { restock_requested: false, lastUpdated: serverTimestamp() });

      await batch.commit();
  }
}
