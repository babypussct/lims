import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CacheService {
  private dbName = 'LimsSystemCache';
  private storeName = 'metadata_cache';
  private dbVersion = 1;

  private isAvailable = false;
  private dbPromise: Promise<IDBDatabase | null>;

  constructor() {
    this.dbPromise = new Promise((resolve) => {
      try {
        const request = indexedDB.open(this.dbName, this.dbVersion);

        request.onerror = () => {
          console.warn('[CacheService] IndexedDB không khả dụng, chuyển sang chế độ bỏ qua.');
          this.isAvailable = false;
          resolve(null);
        };

        request.onsuccess = (event: any) => {
          this.isAvailable = true;
          resolve(event.target.result);
        };

        request.onupgradeneeded = (event: any) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(this.storeName)) {
            db.createObjectStore(this.storeName);
          }
        };
      } catch {
        console.warn('[CacheService] indexedDB không tồn tại trong môi trường này.');
        this.isAvailable = false;
        resolve(null);
      }
    });
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    if (!this.isAvailable) return;
    try {
      const db = await this.dbPromise;
      if (!db) return;
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.put(value, key);
        request.onsuccess = () => resolve();
        request.onerror = (e: any) => reject(e.target.error);
      });
    } catch {
      // Im lặng — cache là tuỳ chọn, không được làm crash app
    }
  }

  async getItem<T>(key: string): Promise<T | null> {
    if (!this.isAvailable) return null;
    try {
      const db = await this.dbPromise;
      if (!db) return null;
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.storeName], 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.get(key);
        request.onsuccess = () => resolve(request.result !== undefined ? request.result : null);
        request.onerror = (e: any) => reject(e.target.error);
      });
    } catch {
      return null;
    }
  }

  async removeItem(key: string): Promise<void> {
    if (!this.isAvailable) return;
    try {
      const db = await this.dbPromise;
      if (!db) return;
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.delete(key);
        request.onsuccess = () => resolve();
        request.onerror = (e: any) => reject(e.target.error);
      });
    } catch {
      // Im lặng
    }
  }

  async clear(): Promise<void> {
    if (!this.isAvailable) return;
    try {
      const db = await this.dbPromise;
      if (!db) return;
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = (e: any) => reject(e.target.error);
      });
    } catch {
      // Im lặng
    }
  }
}

