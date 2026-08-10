import { Injectable, inject } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, Firestore, collection, getDocs, query, limit, 
  doc, writeBatch, deleteDoc, setDoc, initializeFirestore, 
  persistentLocalCache, persistentMultipleTabManager, updateDoc,
  getCountFromServer, where, orderBy, writeBatch as batchWrite,
  Timestamp, serverTimestamp, clearIndexedDbPersistence, terminate
} from 'firebase/firestore';
import type { Messaging } from 'firebase/messaging';
import { Observable, forkJoin, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HealthCheckItem } from '../models/config.model';
import type { UserProfile } from './auth.service'; 
import { environment } from '../../../environments/environment';
import { getAuth } from 'firebase/auth';
import { FirestoreReadMonitor } from './firestore-read-monitor.service';

export interface MetadataSyncEventInput {
  action?: string;
  message?: string;
  targetId?: string;
  actorUid?: string;
  actorName?: string;
}

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  public app: FirebaseApp;
  public db: Firestore;
  public messaging: Messaging | null = null;
  public APP_ID: string;
  private readMonitor = inject(FirestoreReadMonitor);

  private readonly APP_ID_KEY = 'lims_app_id';

  constructor() {
    this.app = initializeApp(environment.firebase);
    
    this.db = initializeFirestore(this.app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
      }),
      experimentalForceLongPolling: true
    });

    this.APP_ID = localStorage.getItem(this.APP_ID_KEY) || 'lims-cloud-fixed';
  }

  async getMessagingInstance(): Promise<Messaging | null> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
        return null;
    }

    if (this.messaging) return this.messaging;

    try {
        const { getMessaging } = await import('firebase/messaging');
        this.messaging = getMessaging(this.app);
        return this.messaging;
    } catch (e) {
        console.warn('Firebase Messaging not supported:', e);
        return null;
    }
  }

  async requestPushToken(): Promise<string | null> {
    if (!('Notification' in window)) {
        throw new Error('Trình duyệt không hỗ trợ thông báo đẩy. Trên iOS, hãy thêm ứng dụng vào Màn hình chính trước.');
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
        throw new Error(`Quyền bị từ chối (trạng thái: ${permission}). Hãy kiểm tra Cài đặt thiết bị.`);
    }

    const messaging = await this.getMessagingInstance();
    if (!messaging) {
        throw new Error('Thiết bị không hỗ trợ Firebase Messaging.');
    }

    try {
        const { getToken } = await import('firebase/messaging');
        let swReg = await navigator.serviceWorker.getRegistration();
        if (!swReg) {
            console.log('[FirebaseService] Service Worker chưa được đăng ký (có thể do Angular đang đợi app stable). Đăng ký thủ công...');
            swReg = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        }
        if (!swReg) {
            throw new Error('Chưa tìm thấy Service Worker. Hãy tải lại trang web.');
        }

        const token = await getToken(messaging, {
            vapidKey: environment.firebase.vapidKey,
            serviceWorkerRegistration: swReg
        });
        return token;
    } catch (error: any) {
        console.error('Lỗi lấy FCM token:', error);
        throw new Error(error?.message || 'Lỗi không xác định khi đăng ký Token.');
    }
  }

  setAppId(id: string) {
    localStorage.setItem(this.APP_ID_KEY, id);
    window.location.reload(); 
  }

  // --- System Health ---
  checkSystemHealth(): Observable<HealthCheckItem[]> {
    const collections = [
        'inventory', 
        'sops', 
        'requests', 
        'logs', 
        'stats', 
        'users', 
        'config', 
        'recipes', 
        'reference_standards'
    ];

    const checks$ = collections.map(colName => {
      const path = `artifacts/${this.APP_ID}/${colName}`;
      const colRef = collection(this.db, path);
      
      return from(getDocs(query(colRef, limit(1)))).pipe(
        map(() => ({
          collection: colName,
          path: path,
          status: 'Online' as const,
          actionUrl: `https://console.firebase.google.com/project/${environment.firebase.projectId}/firestore/data/${path}`
        })),
        catchError(err => of({
          collection: colName,
          path: path,
          status: 'Error' as const,
          errorMessage: err.message
        }))
      );
    });
    return forkJoin(checks$);
  }

  // --- User Management (New) ---
  private readonly usersCacheTtlMs = 5 * 60 * 1000;
  private usersCache: UserProfile[] | null = null;
  private usersCacheAt = 0;
  private usersLoad?: Promise<UserProfile[]>;

  async getAllUsers(forceRefresh = false): Promise<UserProfile[]> {
    if (!forceRefresh && this.usersCache && Date.now() - this.usersCacheAt < this.usersCacheTtlMs) {
        return this.usersCache;
    }
    if (this.usersLoad) return this.usersLoad;

    const load = (async () => {
    try {
        const colRef = collection(this.db, `artifacts/${this.APP_ID}/users`);
        const snapshot = await getDocs(colRef);
        this.readMonitor.record('getDocs', `artifacts/${this.APP_ID}/users`, snapshot.size);
        const users = snapshot.docs.map(d => {
            const data = d.data();
            return {
                uid: d.id,
                email: data['email'] || '',
                displayName: data['displayName'] || 'User',
                role: data['role'] || 'staff',
                roleId: data['roleId'] || '',
                permissions: data['permissions'] || [],
                customPermissions: data['customPermissions'] || []
            };
        });
        this.usersCache = users;
        this.usersCacheAt = Date.now();
        return users;
    } catch (e: any) {
        console.warn("Could not fetch users (likely permission issue):", e.code);
        throw e;
    }
    })();
    this.usersLoad = load;
    try {
        return await load;
    } finally {
        if (this.usersLoad === load) this.usersLoad = undefined;
    }
  }

  private invalidateUsersCache() {
      this.usersCache = null;
      this.usersCacheAt = 0;
  }

  async updateUserPermissions(uid: string, role: string, permissions: string[], roleId?: string, customPermissions?: string[]) {
      const ref = doc(this.db, `artifacts/${this.APP_ID}/users`, uid);
      const updateData: any = { role, permissions };
      if (roleId !== undefined) {
          updateData.roleId = roleId;
      }
      if (customPermissions !== undefined) {
          updateData.customPermissions = customPermissions;
      }
      await updateDoc(ref, updateData);
      this.invalidateUsersCache();
  }

  async getRolesConfig(): Promise<any[]> {
      try {
          const colRef = collection(this.db, `artifacts/${this.APP_ID}/roles_config`);
          const snapshot = await getDocs(colRef);
          this.readMonitor.record('getDocs', `artifacts/${this.APP_ID}/roles_config`, snapshot.size);
          return snapshot.docs.map(d => ({
              id: d.id,
              ...d.data()
          }));
      } catch (e) {
          console.warn("Could not fetch roles_config:", e);
          return [];
      }
  }

  async saveRoleConfig(roleId: string, roleData: any) {
      const ref = doc(this.db, `artifacts/${this.APP_ID}/roles_config`, roleId);
      await setDoc(ref, roleData, { merge: true });
  }

  async deleteRoleConfig(roleId: string) {
      const ref = doc(this.db, `artifacts/${this.APP_ID}/roles_config`, roleId);
      await deleteDoc(ref);
  }

  // --- Firestore data estimation --- uses getCountFromServer (1 read/collection)
  // This is document-count telemetry, not Firebase Cloud Storage access.
  async getFirestoreDataEstimate(): Promise<{ totalDocs: number, estimatedSizeKB: number, details: any }> {
    const collections = [
        'inventory', 
        'sops', 
        'requests', 
        'logs', 
        'stats', 
        'users', 
        'config', 
        'recipes', 
        'reference_standards'
    ];
    
    let totalDocs = 0;
    const details: any = {};

    for (const col of collections) {
      try {
        const colRef = collection(this.db, `artifacts/${this.APP_ID}/${col}`);
        // getCountFromServer: costs only 1 read regardless of collection size
        const countSnap = await getCountFromServer(colRef);
        this.readMonitor.record('aggregate', `artifacts/${this.APP_ID}/${col}`, 1);
        const count = countSnap.data().count;
        details[col] = { count, sizeKB: parseFloat((count * 1.2).toFixed(2)) }; // ~1.2KB/doc estimate
        totalDocs += count;
      } catch(e) {
        details[col] = { count: 0, sizeKB: 0 };
      }
    }

    return {
      totalDocs,
      estimatedSizeKB: parseFloat((totalDocs * 1.2).toFixed(2)),
      details
    };
  }

  // --- Data Archiver (Logs & Requests) ---
  async fetchOldData(collectionName: 'logs' | 'requests', daysOld: number): Promise<any[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    const cutoff = Timestamp.fromDate(cutoffDate);
    
    const colRef = collection(this.db, `artifacts/${this.APP_ID}/${collectionName}`);
    const q = query(colRef, where('timestamp', '<', cutoff), limit(10000));
    
    const snap = await getDocs(q);
    this.readMonitor.record('getDocs', `artifacts/${this.APP_ID}/${collectionName}`, snap.size);
    
    return snap.docs.map(d => {
        const data = d.data();
        // Convert timestamp to readable string for Export
        if (data['timestamp'] && data['timestamp'].toDate) {
            data['timestamp'] = data['timestamp'].toDate().toISOString();
        }
        return { id: d.id, ...data };
    });
  }

  async deleteDocsInBatch(collectionName: 'logs' | 'requests', docIds: string[]): Promise<number> {
    if (!docIds || docIds.length === 0) return 0;
    
    const colRef = collection(this.db, `artifacts/${this.APP_ID}/${collectionName}`);
    
    // Spark plan: Max 20k writes. We delete in chunks of 400.
    const chunks = [];
    for (let i = 0; i < docIds.length; i += 400) {
      chunks.push(docIds.slice(i, i + 400));
    }
    
    let deletedCount = 0;
    for (const chunk of chunks) {
      const batch = writeBatch(this.db);
      chunk.forEach(id => {
        batch.delete(doc(colRef, id));
      });
      await batch.commit();
      deletedCount += chunk.length;
    }
    
    return deletedCount;
  }

  async restoreArchivedData(collectionName: 'logs' | 'requests', items: any[]): Promise<number> {
    if (!items || items.length === 0) return 0;
    
    const colRef = collection(this.db, `artifacts/${this.APP_ID}/${collectionName}`);
    
    let opCount = 0;
    let totalRestored = 0;
    const MAX_BATCH = 400; 
    let batch = writeBatch(this.db);

    const commitBatch = async () => {
        if (opCount > 0) {
            await batch.commit();
            totalRestored += opCount;
            batch = writeBatch(this.db);
            opCount = 0;
        }
    };

    for (const item of items) {
        const id = item.id;
        let ref;
        if (id) {
            ref = doc(colRef, id);
            delete item.id; 
        } else {
            ref = doc(colRef);
        }
        
        // Reconstruct timestamp
        if (item.timestamp && typeof item.timestamp === 'string') {
            item.timestamp = Timestamp.fromDate(new Date(item.timestamp));
        }
        // Ensure lastUpdated is set for delta sync compatibility
        if (!item.lastUpdated) {
            item.lastUpdated = item.timestamp || serverTimestamp();
        }

        batch.set(ref, item, { merge: true });
        opCount++;
        
        if (opCount >= MAX_BATCH) {
            await commitBatch();
        }
    }

    await commitBatch();
    return totalRestored;
  }

  // --- Backup & Restore ---
  async exportData(): Promise<any> {
    const sopsSnap = await getDocs(collection(this.db, `artifacts/${this.APP_ID}/sops`));
    this.readMonitor.record('getDocs', `artifacts/${this.APP_ID}/sops`, sopsSnap.size);
    const invSnap = await getDocs(collection(this.db, `artifacts/${this.APP_ID}/inventory`));
    this.readMonitor.record('getDocs', `artifacts/${this.APP_ID}/inventory`, invSnap.size);

    const sops = sopsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    const inventory = invSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    return { 
      meta: { appId: this.APP_ID, date: new Date().toISOString() },
      sops, 
      inventory 
    };
  }

  async importData(jsonData: any) {
    if (!jsonData.sops || !jsonData.inventory) throw new Error('Invalid Backup File');

    const batch = writeBatch(this.db);
    let opCount = 0;
    const MAX_BATCH = 450; 

    const checkBatch = async () => {
        opCount++;
        if (opCount >= MAX_BATCH) {
            await batch.commit();
            opCount = 0;
        }
    };

    for (const item of jsonData.inventory) {
        const ref = doc(this.db, `artifacts/${this.APP_ID}/inventory`, item.id);
        batch.set(ref, item);
        await checkBatch();
    }

    for (const item of jsonData.sops) {
        const ref = doc(this.db, `artifacts/${this.APP_ID}/sops`, item.id);
        batch.set(ref, item);
        await checkBatch();
    }

    if (opCount > 0) await batch.commit();
  }

  // --- Sample Data Loader (GC-NAFIQPM 6) ---
  async loadSampleData() {
    const inventory = [
      { id: "acetonitrile", name: "Acetonitrile (HPLC)", stock: 20000, unit: "ml", category: "reagent", threshold: 1000 },
      { id: "methanol", name: "Methanol (HPLC)", stock: 15000, unit: "ml", category: "reagent", threshold: 1000 },
      { id: "formic_acid", name: "Formic Acid 98%", stock: 500, unit: "ml", category: "reagent", threshold: 50 }
    ];
    
    const batch = writeBatch(this.db);
    
    for(const item of inventory) {
        const ref = doc(this.db, `artifacts/${this.APP_ID}/inventory`, item.id);
        batch.set(ref, { ...item, lastUpdated: new Date() });
    }
    
    
    await batch.commit();
  }

  // --- Metadata Caching Strategy ---
  async updateMetadata(moduleKey: string, event?: MetadataSyncEventInput) {
    const metaRef = doc(this.db, `artifacts/${this.APP_ID}/system/metadata`);
    try {
        await setDoc(metaRef, this.buildMetadataUpdate(moduleKey, event), { merge: true });
    } catch (e) {
        console.warn(`Failed to update metadata for ${moduleKey}`, e);
    }
  }

  // Use this for batch operations so they can be merged into a single atomic commit
  getMetadataUpdateOp(moduleKey: string, event?: MetadataSyncEventInput) {
    return {
        ref: doc(this.db, `artifacts/${this.APP_ID}/system/metadata`),
        data: this.buildMetadataUpdate(moduleKey, event)
    };
  }

  private buildMetadataUpdate(moduleKey: string, event?: MetadataSyncEventInput): Record<string, unknown> {
    const version = Date.now();
    const firebaseUser = getAuth(this.app).currentUser;
    const actorUid = event?.actorUid || firebaseUser?.uid || '';
    const actorName = event?.actorName || firebaseUser?.displayName || firebaseUser?.email || 'Hệ thống';
    const syncEvent: Record<string, unknown> = {
      id: `${moduleKey}-${version}-${Math.random().toString(36).slice(2, 9)}`,
      version,
      actorUid,
      actorName
    };
    if (event?.action) syncEvent['action'] = event.action;
    if (event?.message) syncEvent['message'] = event.message;
    if (event?.targetId) syncEvent['targetId'] = event.targetId;
    return {
      [moduleKey]: version,
      [`${moduleKey}_event`]: syncEvent
    };
  }

  // --- ADMIN CACHE PURGING ---
  async adminForceSyncCache() {
      const metaRef = doc(this.db, `artifacts/${this.APP_ID}/system/metadata`);
      try {
          await setDoc(metaRef, { force_clear_cache_time: Date.now() }, { merge: true });
      } catch (e) {
          console.error("Failed to broadcast force sync", e);
      }
  }

  async purgeSystemCache() {
      try {
          if (this.db) {
              await terminate(this.db);
              await clearIndexedDbPersistence(this.db);
          }
          window.location.reload();
      } catch (e) {
          console.error("Failed to purge system cache", e);
          window.location.reload(); 
      }
  }
}
