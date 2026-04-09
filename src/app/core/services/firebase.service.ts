import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, Firestore, collection, getDocs, query, limit, 
  doc, writeBatch, deleteDoc, setDoc, initializeFirestore, 
  persistentLocalCache, persistentMultipleTabManager, updateDoc,
  getCountFromServer, where, orderBy, writeBatch as batchWrite,
  Timestamp
} from 'firebase/firestore';
import { 
  getStorage, FirebaseStorage, ref, uploadBytes, getDownloadURL 
} from 'firebase/storage';
import { Observable, forkJoin, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HealthCheckItem } from '../models/config.model';
import type { UserProfile } from './auth.service'; 
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  public app: FirebaseApp;
  public db: Firestore;
  public storage: FirebaseStorage;
  public APP_ID: string;

  private readonly APP_ID_KEY = 'lims_app_id';

  constructor() {
    this.app = initializeApp(environment.firebase);
    
    this.db = initializeFirestore(this.app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
      })
    });

    this.storage = getStorage(this.app);
    
    this.APP_ID = localStorage.getItem(this.APP_ID_KEY) || 'lims-cloud-fixed';
  }

  setAppId(id: string) {
    localStorage.setItem(this.APP_ID_KEY, id);
    window.location.reload(); 
  }

  // --- Storage ---
  async uploadFile(folder: string, file: File): Promise<string> {
    const timestamp = Date.now();
    // Sanitize filename
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const path = `artifacts/${this.APP_ID}/${folder}/${timestamp}_${safeName}`;
    
    const storageRef = ref(this.storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
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
  async getAllUsers(): Promise<UserProfile[]> {
    try {
        const colRef = collection(this.db, `artifacts/${this.APP_ID}/users`);
        const snapshot = await getDocs(colRef);
        return snapshot.docs.map(d => {
            const data = d.data();
            return {
                uid: d.id,
                email: data['email'] || '',
                displayName: data['displayName'] || 'User',
                role: data['role'] || 'staff',
                permissions: data['permissions'] || []
            };
        });
    } catch (e: any) {
        console.warn("Could not fetch users (likely permission issue):", e.code);
        throw e;
    }
  }

  async updateUserPermissions(uid: string, role: string, permissions: string[]) {
      const ref = doc(this.db, `artifacts/${this.APP_ID}/users`, uid);
      await updateDoc(ref, { role, permissions });
  }

  // --- Storage Estimation --- OPTIMIZED: uses getCountFromServer (1 read/collection)
  async getStorageEstimate(): Promise<{ totalDocs: number, estimatedSizeKB: number, details: any }> {
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
    const invSnap = await getDocs(collection(this.db, `artifacts/${this.APP_ID}/inventory`));

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
}