import { Injectable, inject } from '@angular/core';
import { collection, query, onSnapshot, where, orderBy, getDocs, limit, QueryConstraint } from 'firebase/firestore';
import { FirebaseService } from './firebase.service';

export interface DeltaSyncConfig {
  cacheKey: string;
  cursorKey: string;
  collectionPath: string;
  maxCacheSize?: number;
  orderByField?: string;
  orderDirection?: 'asc' | 'desc';
  queryConstraints?: QueryConstraint[];
  /**
   * Hàm kiểm tra doc đã bị xóa hay chưa.
   * Mặc định: (doc) => doc._isDeleted === true
   * Override cho collection dùng status='DELETED':
   *   (doc) => doc._isDeleted === true || doc.status === 'DELETED'
   */
  isDeletedFn?: (doc: any) => boolean;
}

/** Entry nội bộ cho mỗi singleton */
interface SingletonEntry<T = any> {
  unsub: () => void;
  callbacks: Array<(data: T[]) => void>;
  memCache: T[];
  config: DeltaSyncConfig;
}

/**
 * DeltaSyncService v2 — Quản lý đồng bộ delta tập trung.
 *
 * 2 chế độ:
 *  - **Singleton** (`startSingletonListener`): 1 listener / cacheKey, sống suốt phiên.
 *    Components chỉ subscribe/unsubscribe callback. Navigate giữa các tab = 0 reads.
 *  - **Classic** (`startListener`): Listener tạo/hủy theo caller lifecycle.
 *    Phù hợp cho component có mode-switch (VD: realtime ↔ date-range query).
 *
 * Cả 2 chế độ đều:
 *  - Persist cache + cursor vào localStorage
 *  - Dùng cursor-based startTime (không mất data giữa sessions)
 *  - Xử lý soft delete (_isDeleted hoặc custom fn)
 */
@Injectable({ providedIn: 'root' })
export class DeltaSyncService {
  private firebaseService = inject(FirebaseService);
  private fb = this.firebaseService.db;

  /** Map<cacheKey, SingletonEntry> */
  private _singletons = new Map<string, SingletonEntry>();

  // ═══════════════════════════════════════════════════════════════════════════
  // SINGLETON MODE — 1 listener / key, N subscribers
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Subscribe vào singleton listener cho collection.
   * - Lần đầu: tạo listener + emit từ cache ngay lập tức
   * - Lần sau: chỉ thêm callback, dùng listener đã chạy
   * @returns Hàm unregister callback (KHÔNG hủy listener singleton)
   */
  public startSingletonListener<T extends { id?: string; lastUpdated?: any; _isDeleted?: boolean; [k: string]: any }>(
    config: DeltaSyncConfig,
    onData: (data: T[]) => void
  ): () => void {
    const key = config.cacheKey;
    const isDeleted = config.isDeletedFn || ((d: any) => d._isDeleted === true);

    // Singleton đã tồn tại → emit memCache ngay + thêm callback
    if (this._singletons.has(key)) {
      const entry = this._singletons.get(key)!;
      entry.callbacks.push(onData as any);
      // Emit data hiện tại ngay lập tức (0 reads)
      if (entry.memCache.length > 0) {
        onData([...entry.memCache] as T[]);
      }
      return () => {
        entry.callbacks = entry.callbacks.filter(cb => cb !== onData);
      };
    }

    // Tạo singleton mới
    const maxCacheSize = config.maxCacheSize || 1000;
    const sortField = config.orderByField || 'timestamp';
    const sortDir = config.orderDirection || 'desc';

    // Phase 1: Load từ localStorage
    let memCache: T[] = this._loadFromCache<T>(key).filter(d => !isDeleted(d));
    const callbacks: Array<(data: T[]) => void> = [onData];

    // Emit cached data ngay
    if (memCache.length > 0) {
      onData([...memCache]);
    }

    // Tạo entry ngay để các call khác có thể attach
    const entry: SingletonEntry<T> = { unsub: () => {}, callbacks, memCache, config };
    this._singletons.set(key, entry);

    // Nếu cache rỗng → fetch initial batch async RỒI MỚI lắng nghe live
    if (memCache.length === 0) {
      this._fetchInitialBatch<T>(config).then(items => {
        const filteredItems = items.filter(d => !isDeleted(d));
        const cursor = this._updateCacheAndCursor(filteredItems, config, sortField, sortDir, maxCacheSize);
        entry.memCache = filteredItems;
        
        entry.callbacks.forEach(cb => cb([...filteredItems]));
        
        entry.unsub = this._setupSnapshotListener(config, cursor, filteredItems, sortField, sortDir, maxCacheSize, (data) => {
          entry.memCache = data;
          entry.callbacks.forEach(cb => cb([...data]));
        }, isDeleted);
      }).catch(err => {
        console.warn(`[DeltaSync] Initial fetch failed for ${config.collectionPath}:`, err.message);
      });
    } else {
      // Phase 2: Live listener
      const cursor = this._loadCursor(config.cursorKey);
      entry.unsub = this._setupSnapshotListener(config, cursor, memCache, sortField, sortDir, maxCacheSize, (data) => {
        entry.memCache = data;
        entry.callbacks.forEach(cb => cb([...data]));
      }, isDeleted);
    }

    // Return unregister function
    return () => {
      const e = this._singletons.get(key);
      if (e) {
        e.callbacks = e.callbacks.filter(cb => cb !== onData);
      }
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CLASSIC MODE — Listener tạo/hủy theo caller lifecycle (backward compat)
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Tạo listener mới mỗi lần gọi. Caller chịu trách nhiệm hủy.
   * FIX v2: Trả về unsub function đúng kể cả khi cache rỗng (fix listener leak).
   */
  public startListener<T extends { id?: string; lastUpdated?: any; _isDeleted?: boolean; [k: string]: any }>(
    config: DeltaSyncConfig,
    onData: (data: T[]) => void
  ): () => void {
    const maxCacheSize = config.maxCacheSize || 1000;
    const sortField = config.orderByField || 'timestamp';
    const sortDir = config.orderDirection || 'desc';
    const isDeleted = config.isDeletedFn || ((d: any) => d._isDeleted === true);

    let cachedItems: T[] = this._loadFromCache<T>(config.cacheKey).filter(d => !isDeleted(d));
    let cursor = this._loadCursor(config.cursorKey);

    // FIX: Lưu unsub reference bên ngoài .then() để caller luôn hủy được
    let listenerUnsub: (() => void) | null = null;
    let destroyed = false;

    const cleanup = () => {
      destroyed = true;
      if (listenerUnsub) { listenerUnsub(); listenerUnsub = null; }
    };

    if (cachedItems.length === 0) {
      // Cache rỗng → fetch initial batch async
      this._fetchInitialBatch<T>(config).then(items => {
        if (destroyed) return; // Caller đã hủy trước khi fetch xong → không leak
        cachedItems = items.filter(d => !isDeleted(d));
        cursor = this._updateCacheAndCursor(cachedItems, config, sortField, sortDir, maxCacheSize);
        onData([...cachedItems]);
        listenerUnsub = this._setupSnapshotListener(config, cursor, cachedItems, sortField, sortDir, maxCacheSize, onData, isDeleted);
      }).catch(err => {
        console.warn(`[DeltaSync] Initial fetch failed:`, err.message);
      });
    } else {
      onData([...cachedItems]);
      listenerUnsub = this._setupSnapshotListener(config, cursor, cachedItems, sortField, sortDir, maxCacheSize, onData, isDeleted);
    }

    return cleanup;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // LIFECYCLE — Cleanup API
  // ═══════════════════════════════════════════════════════════════════════════

  /** Hủy 1 singleton theo cacheKey */
  public destroySingleton(cacheKey: string): void {
    const entry = this._singletons.get(cacheKey);
    if (entry) {
      entry.unsub();
      entry.callbacks = [];
      entry.memCache = [];
      this._singletons.delete(cacheKey);
    }
  }

  /** Hủy TẤT CẢ singletons — gọi khi logout */
  public destroyAll(): void {
    this._singletons.forEach((entry, key) => {
      entry.unsub();
      entry.callbacks = [];
      entry.memCache = [];
    });
    this._singletons.clear();
  }

  /** Xóa localStorage cache + cursor */
  public clearCache(cacheKey: string, cursorKey: string): void {
    try {
      localStorage.removeItem(cacheKey);
      localStorage.removeItem(cursorKey);
    } catch {}
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CACHE READ API
  // ═══════════════════════════════════════════════════════════════════════════

  /** Đọc từ in-memory singleton cache (ưu tiên) hoặc localStorage */
  public getCache<T>(key: string): T[] {
    // Ưu tiên memCache nếu singleton đang chạy
    const entry = this._singletons.get(key);
    if (entry && entry.memCache.length > 0) {
      return [...entry.memCache] as T[];
    }
    return this._loadFromCache<T>(key);
  }

  /** Đọc chỉ từ in-memory (nhanh nhất, null nếu chưa load) */
  public getMemCache<T>(key: string): T[] | null {
    const entry = this._singletons.get(key);
    return entry ? [...entry.memCache] as T[] : null;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PRIVATE HELPERS
  // ═══════════════════════════════════════════════════════════════════════════

  private _setupSnapshotListener<T extends { id?: string; lastUpdated?: any; _isDeleted?: boolean; [k: string]: any }>(
    config: DeltaSyncConfig,
    cursor: number,
    cachedItems: T[],
    sortField: string,
    sortDir: 'asc' | 'desc',
    maxCacheSize: number,
    onData: (data: T[]) => void,
    isDeleted: (doc: any) => boolean
  ): () => void {
    const colRef = collection(this.fb, config.collectionPath);
    const constraints = config.queryConstraints || [];
    let q;

    if (cursor > 0) {
      q = query(colRef, ...constraints, where('lastUpdated', '>', new Date(cursor * 1000)), orderBy('lastUpdated', 'asc'));
    } else {
      q = query(colRef, ...constraints, orderBy('lastUpdated', 'desc'), limit(100));
    }

    return onSnapshot(q, (snapshot) => {
      if (snapshot.empty) return;

      let hasChanges = false;
      snapshot.docChanges().forEach(change => {
        const docData = change.doc.data() as T;
        (docData as any).id = change.doc.id;
        this._normalizeTimestamps(docData, sortField);

        if (change.type === 'removed' || isDeleted(docData)) {
          const idx = cachedItems.findIndex(i => i.id === docData.id);
          if (idx !== -1) { cachedItems.splice(idx, 1); hasChanges = true; }
        } else {
          const idx = cachedItems.findIndex(i => i.id === docData.id);
          if (idx !== -1) { cachedItems[idx] = docData; } else { cachedItems.push(docData); }
          hasChanges = true;
        }
      });

      if (hasChanges) {
        this._updateCacheAndCursor(cachedItems, config, sortField, sortDir, maxCacheSize);
        onData([...cachedItems]);
      }
    }, (error) => {
      console.warn(`[DeltaSync] Listener error for ${config.collectionPath}:`, error.message);
    });
  }

  private async _fetchInitialBatch<T>(config: DeltaSyncConfig): Promise<T[]> {
    const colRef = collection(this.fb, config.collectionPath);
    const sortField = config.orderByField || 'timestamp';
    const sortDir = config.orderDirection || 'desc';
    const maxCacheSize = config.maxCacheSize || 1000;

    const constraints = config.queryConstraints || [];
    const q = query(colRef, ...constraints, orderBy(sortField, sortDir), limit(maxCacheSize));
    const snapshot = await getDocs(q);

    const items: T[] = [];
    snapshot.forEach(doc => {
      const data = doc.data() as T;
      (data as any).id = doc.id;
      this._normalizeTimestamps(data, sortField);
      items.push(data);
    });

    return items;
  }

  /** Chuẩn hóa Firestore Timestamps → plain object { seconds } để JSON.stringify được */
  private _normalizeTimestamps(data: any, sortField: string): void {
    if (data.lastUpdated && typeof data.lastUpdated.toMillis === 'function') {
      data.lastUpdated = { seconds: Math.floor(data.lastUpdated.toMillis() / 1000) };
    }
    if (data[sortField] && typeof data[sortField].toMillis === 'function') {
      data[sortField] = data[sortField].toMillis();
    }
  }

  private _updateCacheAndCursor<T extends { lastUpdated?: any }>(
    items: T[],
    config: DeltaSyncConfig,
    sortField: string,
    sortDir: 'asc' | 'desc',
    maxCacheSize: number
  ): number {
    // Sort
    items.sort((a: any, b: any) => {
      let valA = a[sortField] || 0;
      let valB = b[sortField] || 0;
      if (valA && typeof valA === 'object' && 'seconds' in valA) valA = valA.seconds;
      if (valB && typeof valB === 'object' && 'seconds' in valB) valB = valB.seconds;
      return sortDir === 'asc' ? valA - valB : valB - valA;
    });

    // Trim
    if (items.length > maxCacheSize) {
      items.splice(maxCacheSize);
    }

    // Cursor = max lastUpdated seconds
    let maxSeconds = 0;
    for (const item of items) {
      if (item.lastUpdated && item.lastUpdated.seconds) {
        if (item.lastUpdated.seconds > maxSeconds) maxSeconds = item.lastUpdated.seconds;
      }
    }

    // Persist
    try {
      localStorage.setItem(config.cacheKey, JSON.stringify(items));
      if (maxSeconds > 0) {
        localStorage.setItem(config.cursorKey, maxSeconds.toString());
      }
    } catch (e) {
      console.warn('[DeltaSync] Cache write failed', e);
    }

    return maxSeconds;
  }

  private _loadFromCache<T>(key: string): T[] {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch { return []; }
  }

  private _loadCursor(key: string): number {
    try {
      const data = localStorage.getItem(key);
      return data ? parseInt(data, 10) : 0;
    } catch { return 0; }
  }
}
