/**
 * DeltaIndexedDbStorage — Persistent storage adapter for DeltaSyncService.
 *
 * Provides a resilient L2 IndexedDB cache layer for large collections
 * (e.g., thousands of reference standards or logs) that would exceed
 * browser localStorage quota (typically 5MB).
 *
 * Degrades gracefully to a no-op when IndexedDB is unavailable
 * (e.g., SSR, Node.js test runners, restricted private browsing).
 */

export interface DeltaIndexedDbEntry<T = unknown> {
  key: string;
  items: T[];
  updatedAt: number;
  cursorMillis?: number;
}

export class DeltaIndexedDbStorage {
  private static instance: DeltaIndexedDbStorage | null = null;
  private dbPromise: Promise<IDBDatabase | null> | null = null;
  private mockDb: any = null;
  private unavailable = false;

  readonly DB_NAME = 'lims_delta_sync_v1';
  readonly STORE_NAME = 'cache_entries';

  static getInstance(): DeltaIndexedDbStorage {
    if (!this.instance) {
      this.instance = new DeltaIndexedDbStorage();
    }
    return this.instance;
  }

  isAvailable(): boolean {
    if (this.mockDb) return true;
    return !this.unavailable && typeof window !== 'undefined' && typeof window.indexedDB !== 'undefined';
  }

  setMockForTest(mock: any): void {
    this.mockDb = mock;
    this.dbPromise = null;
    this.unavailable = false;
  }

  resetForTest(): void {
    this.mockDb = null;
    this.dbPromise = null;
    this.unavailable = false;
  }

  private async getDb(): Promise<IDBDatabase | null> {
    if (this.mockDb) return this.mockDb as IDBDatabase;
    if (!this.isAvailable()) return null;
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise(resolve => {
      try {
        const idb = window.indexedDB;
        const request = idb.open(this.DB_NAME, 1);
        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains(this.STORE_NAME)) {
            db.createObjectStore(this.STORE_NAME, { keyPath: 'key' });
          }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => {
          this.unavailable = true;
          console.warn('[DeltaIndexedDbStorage] Failed to open IndexedDB:', request.error);
          resolve(null);
        };
      } catch (err) {
        this.unavailable = true;
        console.warn('[DeltaIndexedDbStorage] Exception opening IndexedDB:', err);
        resolve(null);
      }
    });

    return this.dbPromise;
  }

  async get<T>(key: string): Promise<T[] | null> {
    return (await this.getEntry<T>(key))?.items ?? null;
  }

  async getEntry<T>(key: string): Promise<DeltaIndexedDbEntry<T> | null> {
    try {
      const db = await this.getDb();
      if (!db) return null;

      return new Promise(resolve => {
        try {
          const tx = db.transaction(this.STORE_NAME, 'readonly');
          const store = tx.objectStore(this.STORE_NAME);
          const req = store.get(key);
          req.onsuccess = () => {
            const entry = req.result as DeltaIndexedDbEntry<T> | undefined;
            if (entry && Array.isArray(entry.items)) {
              resolve(entry);
            } else {
              resolve(null);
            }
          };
          req.onerror = () => resolve(null);
        } catch {
          resolve(null);
        }
      });
    } catch {
      return null;
    }
  }

  async set<T>(key: string, items: readonly T[], cursorMillis = 0): Promise<boolean> {
    try {
      const db = await this.getDb();
      if (!db) return false;

      return new Promise(resolve => {
        try {
          const tx = db.transaction(this.STORE_NAME, 'readwrite');
          const store = tx.objectStore(this.STORE_NAME);
          const entry: DeltaIndexedDbEntry<T> = {
            key,
            items: [...items],
            updatedAt: Date.now(),
            cursorMillis,
          };
          store.put(entry);
          tx.oncomplete = () => resolve(true);
          tx.onerror = () => resolve(false);
          tx.onabort = () => resolve(false);
        } catch {
          resolve(false);
        }
      });
    } catch { return false; }
  }

  async remove(key: string): Promise<void> {
    try {
      const db = await this.getDb();
      if (!db) return;

      return new Promise(resolve => {
        try {
          const tx = db.transaction(this.STORE_NAME, 'readwrite');
          const store = tx.objectStore(this.STORE_NAME);
          store.delete(key);
          tx.oncomplete = () => resolve();
          tx.onerror = () => resolve();
          tx.onabort = () => resolve();
        } catch {
          resolve();
        }
      });
    } catch {}
  }

  async clear(): Promise<void> {
    try {
      const db = await this.getDb();
      if (!db) return;

      return new Promise(resolve => {
        try {
          const tx = db.transaction(this.STORE_NAME, 'readwrite');
          const store = tx.objectStore(this.STORE_NAME);
          store.clear();
          tx.oncomplete = () => resolve();
          tx.onerror = () => resolve();
          tx.onabort = () => resolve();
        } catch {
          resolve();
        }
      });
    } catch {}
  }

  async clearByScope(scopeId: string): Promise<void> {
    try {
      const db = await this.getDb();
      if (!db || !scopeId) return;

      return new Promise(resolve => {
        try {
          const tx = db.transaction(this.STORE_NAME, 'readwrite');
          const store = tx.objectStore(this.STORE_NAME);
          const cursorReq = store.openCursor();
          cursorReq.onsuccess = () => {
            const cursor = cursorReq.result;
            if (cursor) {
              const key = String(cursor.key);
              if (key.includes(scopeId)) {
                cursor.delete();
              }
              cursor.continue();
            } else {
              resolve();
            }
          };
          cursorReq.onerror = () => resolve();
          tx.oncomplete = () => resolve();
          tx.onerror = () => resolve();
        } catch {
          resolve();
        }
      });
    } catch {}
  }
}
