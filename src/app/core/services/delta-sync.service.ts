import { Injectable, inject } from '@angular/core';
import { Firestore, collection, query, onSnapshot, where, orderBy, getDocs, limit, QueryDocumentSnapshot, QueryConstraint } from 'firebase/firestore';

export interface DeltaSyncConfig {
  cacheKey: string;
  cursorKey: string;
  collectionPath: string;
  maxCacheSize?: number;
  orderByField?: string;
  orderDirection?: 'asc' | 'desc';
  queryConstraints?: QueryConstraint[];
}

import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class DeltaSyncService {
  private firebaseService = inject(FirebaseService);
  private fb = this.firebaseService.db;

  /**
   * Initializes a delta sync listener.
   * @param config Configuration for the sync.
   * @param onData Callback that fires with the updated cache array whenever data changes.
   * @returns An unsubscribe function.
   */
  public startListener<T extends { id?: string, lastUpdated?: any, _isDeleted?: boolean, [key: string]: any }>(
    config: DeltaSyncConfig,
    onData: (data: T[]) => void
  ): () => void {
    const maxCacheSize = config.maxCacheSize || 1000;
    const sortField = config.orderByField || 'timestamp';
    const sortDir = config.orderDirection || 'desc';

    // 1. Load existing cache
    let cachedItems: T[] = this.loadFromCache(config.cacheKey);
    let cursor = this.loadCursor(config.cursorKey);

    // If cache is empty, we don't have a cursor. We need to fetch the initial batch.
    if (cachedItems.length === 0) {
      this.fetchInitialBatch<T>(config).then(items => {
        cachedItems = items;
        cursor = this.updateCacheAndCursor(cachedItems, config, sortField, sortDir, maxCacheSize);
        onData([...cachedItems]); // Initial emit
        
        // Start listener after initial fetch
        this._setupSnapshotListener(config, cursor, cachedItems, sortField, sortDir, maxCacheSize, onData);
      });
      return () => {}; // Temporary unsub before listener starts (edge case, usually fine)
    } else {
      // Emit cached data immediately
      onData([...cachedItems]);
      // Start listener immediately
      return this._setupSnapshotListener(config, cursor, cachedItems, sortField, sortDir, maxCacheSize, onData);
    }
  }

  private _setupSnapshotListener<T extends { id?: string, lastUpdated?: any, _isDeleted?: boolean, [key: string]: any }>(
    config: DeltaSyncConfig,
    cursor: number,
    cachedItems: T[],
    sortField: string,
    sortDir: 'asc' | 'desc',
    maxCacheSize: number,
    onData: (data: T[]) => void
  ): () => void {
    const colRef = collection(this.fb, config.collectionPath);
    let q;
    
    const constraints = config.queryConstraints || [];
    if (cursor > 0) {
       q = query(colRef, ...constraints, where('lastUpdated', '>', new Date(cursor * 1000)), orderBy('lastUpdated', 'asc'));
    } else {
       q = query(colRef, ...constraints, orderBy('lastUpdated', 'asc'), limit(100));
    }

    return onSnapshot(q, (snapshot) => {
      if (snapshot.empty) return;

      let hasChanges = false;
      snapshot.docChanges().forEach(change => {
        const docData = change.doc.data() as T;
        docData.id = change.doc.id;

        // Ensure we parse firestore timestamps to numbers for local caching
        if (docData.lastUpdated && typeof docData.lastUpdated.toMillis === 'function') {
          docData.lastUpdated = { seconds: Math.floor(docData.lastUpdated.toMillis() / 1000) };
        }
        
        if ((docData as any)[sortField] && typeof (docData as any)[sortField].toMillis === 'function') {
           (docData as any)[sortField] = (docData as any)[sortField].toMillis();
        }

        if (docData._isDeleted) {
          // Remove from cache
          const idx = cachedItems.findIndex(i => i.id === docData.id);
          if (idx !== -1) {
            cachedItems.splice(idx, 1);
            hasChanges = true;
          }
        } else {
          // Add or Update
          const idx = cachedItems.findIndex(i => i.id === docData.id);
          if (idx !== -1) {
            cachedItems[idx] = docData;
          } else {
            cachedItems.push(docData);
          }
          hasChanges = true;
        }
      });

      if (hasChanges) {
        this.updateCacheAndCursor(cachedItems, config, sortField, sortDir, maxCacheSize);
        onData([...cachedItems]);
      }
    }, (error) => {
      console.warn(`[DeltaSync] Listener error for ${config.collectionPath}:`, error.message);
    });
  }

  private async fetchInitialBatch<T>(config: DeltaSyncConfig): Promise<T[]> {
    const colRef = collection(this.fb, config.collectionPath);
    const sortField = config.orderByField || 'timestamp';
    const sortDir = config.orderDirection || 'desc';
    const maxCacheSize = config.maxCacheSize || 1000;
    
    // We only want docs that are NOT soft deleted. But soft deleted docs might not have _isDeleted field if they are old.
    // So we just fetch the latest docs. If some are soft deleted, they will be filtered out next.
    const constraints = config.queryConstraints || [];
    const q = query(colRef, ...constraints, orderBy(sortField, sortDir), limit(maxCacheSize));
    const snapshot = await getDocs(q);
    
    const items: T[] = [];
    snapshot.forEach(doc => {
      const data = doc.data() as T;
      (data as any).id = doc.id;
      
      // Convert timestamps
      if ((data as any).lastUpdated && typeof (data as any).lastUpdated.toMillis === 'function') {
        (data as any).lastUpdated = { seconds: Math.floor((data as any).lastUpdated.toMillis() / 1000) };
      }
      if ((data as any)[sortField] && typeof (data as any)[sortField].toMillis === 'function') {
        (data as any)[sortField] = (data as any)[sortField].toMillis();
      }

      if (!(data as any)._isDeleted) {
        items.push(data);
      }
    });
    
    return items;
  }

  private updateCacheAndCursor<T extends { lastUpdated?: any }>(
    items: T[], 
    config: DeltaSyncConfig, 
    sortField: string, 
    sortDir: 'asc' | 'desc',
    maxCacheSize: number
  ): number {
    // Sort array
    items.sort((a: any, b: any) => {
      const valA = a[sortField] || 0;
      const valB = b[sortField] || 0;
      return sortDir === 'asc' ? valA - valB : valB - valA;
    });

    // Slice array to max size
    if (items.length > maxCacheSize) {
      items.splice(maxCacheSize);
    }

    // Find max lastUpdated
    let maxSeconds = 0;
    for (const item of items) {
      if (item.lastUpdated && item.lastUpdated.seconds) {
        if (item.lastUpdated.seconds > maxSeconds) {
          maxSeconds = item.lastUpdated.seconds;
        }
      }
    }

    // Save to local storage
    try {
      localStorage.setItem(config.cacheKey, JSON.stringify(items));
      if (maxSeconds > 0) {
        localStorage.setItem(config.cursorKey, maxSeconds.toString());
      }
    } catch (e) {
      console.warn('Could not save delta sync cache to localStorage', e);
    }

    return maxSeconds;
  }

  public getCache<T>(key: string): T[] {
    return this.loadFromCache<T>(key);
  }

  private loadFromCache<T>(key: string): T[] {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  private loadCursor(key: string): number {
    try {
      const data = localStorage.getItem(key);
      return data ? parseInt(data, 10) : 0;
    } catch (e) {
      return 0;
    }
  }
}
