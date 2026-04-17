import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CacheService {
  private dbName = 'LimsSystemCache';
  private storeName = 'metadata_cache';
  private dbVersion = 1;

  private dbPromise: Promise<IDBDatabase>;

  constructor() {
    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = (event: any) => {
        console.error('IndexedDB error:', event.target.error);
        reject(event.target.error);
      };

      request.onsuccess = (event: any) => {
        resolve(event.target.result);
      };

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
    });
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(value, key);

      request.onsuccess = () => resolve();
      request.onerror = (e: any) => reject(e.target.error);
    });
  }

  async getItem<T>(key: string): Promise<T | null> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(key);

      request.onsuccess = () => {
        resolve(request.result !== undefined ? request.result : null);
      };
      request.onerror = (e: any) => reject(e.target.error);
    });
  }

  async removeItem(key: string): Promise<void> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = (e: any) => reject(e.target.error);
    });
  }

  async clear(): Promise<void> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = (e: any) => reject(e.target.error);
    });
  }
}
