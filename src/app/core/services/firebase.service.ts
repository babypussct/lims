
import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { 
  getFirestore, Firestore, collection, getDocs, query, limit, 
  doc, writeBatch, deleteDoc, setDoc, initializeFirestore, 
  persistentLocalCache, persistentMultipleTabManager, updateDoc 
} from 'firebase/firestore';
import { 
  getStorage, FirebaseStorage, ref, uploadBytes, getDownloadURL 
} from 'firebase/storage';
import { Observable, forkJoin, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HealthCheckItem } from '../models/config.model';
import { UserProfile } from './auth.service';

const firebaseConfig = {
  apiKey: "AIzaSyDZmI3PE-j1ZhkqUd3mQaYmX1pJpWqtwck",
  authDomain: "lims-cloud-by-otada.firebaseapp.com",
  projectId: "lims-cloud-by-otada",
  storageBucket: "lims-cloud-by-otada.firebasestorage.app",
  messagingSenderId: "498845778988",
  appId: "1:498845778988:web:e20c971a3af3a1ca5bfd89",
  measurementId: "G-M02RLXX5GD"
};

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  public app: firebase.FirebaseApp;
  public db: Firestore;
  public storage: FirebaseStorage;
  public APP_ID: string;

  private readonly APP_ID_KEY = 'lims_app_id';

  constructor() {
    this.app = firebase.initializeApp(firebaseConfig);
    
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
    const collections = ['inventory', 'sops', 'requests', 'logs', 'stats'];
    const checks$ = collections.map(colName => {
      const path = `artifacts/${this.APP_ID}/${colName}`;
      const colRef = collection(this.db, path);
      
      return from(getDocs(query(colRef, limit(1)))).pipe(
        map(() => ({
          collection: colName,
          path: path,
          status: 'Online' as const,
          actionUrl: `https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore/data/${path}`
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
        // Throw so component knows something is wrong, but ensure it's handled there
        throw e;
    }
  }

  async updateUserPermissions(uid: string, role: string, permissions: string[]) {
      const ref = doc(this.db, `artifacts/${this.APP_ID}/users`, uid);
      await updateDoc(ref, { role, permissions });
  }

  // --- Storage Estimation ---
  async getStorageEstimate(): Promise<{ totalDocs: number, estimatedSizeKB: number, details: any }> {
    const collections = ['inventory', 'sops', 'requests', 'logs', 'stats', 'users', 'config', 'reference_standards'];
    let totalDocs = 0;
    let totalSize = 0;
    const details: any = {};

    for (const col of collections) {
      try {
        const colRef = collection(this.db, `artifacts/${this.APP_ID}/${col}`);
        const snapshot = await getDocs(colRef);
        let colSize = 0;
        
        snapshot.forEach(doc => {
           const data = doc.data();
           colSize += JSON.stringify(data).length + doc.id.length;
        });

        details[col] = { count: snapshot.size, sizeKB: parseFloat((colSize / 1024).toFixed(2)) };
        totalDocs += snapshot.size;
        totalSize += colSize;
      } catch(e) {
        // Just mark as 0 if access denied or empty
        details[col] = { count: 0, sizeKB: 0 };
      }
    }

    return {
      totalDocs,
      estimatedSizeKB: parseFloat((totalSize / 1024).toFixed(2)),
      details
    };
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

  // --- Danger Zone ---
  async resetToDefaults() {
    const collections = ['inventory', 'sops', 'requests', 'logs', 'stats', 'reference_standards'];
    
    for (const col of collections) {
        const snapshot = await getDocs(collection(this.db, `artifacts/${this.APP_ID}/${col}`));
        let batch = writeBatch(this.db);
        let count = 0;
        
        for (const d of snapshot.docs) {
            batch.delete(d.ref);
            count++;
            if (count >= 400) {
                await batch.commit();
                batch = writeBatch(this.db);
                count = 0;
            }
        }
        if (count > 0) await batch.commit();
    }
  }

  // --- Sample Data Loader (GC-NAFIQPM 6) ---
  async loadSampleData() {
    // 1. Inventory (Standardized ID & Name)
    const inventory = [
      { id: "acetonitrile", name: "Acetonitrile (HPLC)", stock: 20000, unit: "ml", category: "reagent", threshold: 1000 },
      { id: "acid_acetic", name: "Acid Acetic (Glacial)", stock: 1000, unit: "ml", category: "reagent", threshold: 100 },
      { id: "c18_powder", name: "Bột C18", stock: 1000, unit: "g", category: "reagent", threshold: 100 },
      { id: "carbograph_powder", name: "Bột Carbograph", stock: 100, unit: "g", category: "reagent", threshold: 10 },
      { id: "falcon_15ml", name: "Ống Falcon 15ml", stock: 1000, unit: "pcs", category: "consumable", threshold: 100 },
      { id: "falcon_50ml", name: "Ống Falcon 50ml", stock: 1000, unit: "pcs", category: "consumable", threshold: 100 },
      { id: "filter_022", name: "Màng lọc Syringe Filter 0.22um", stock: 500, unit: "pcs", category: "consumable", threshold: 50 },
      { id: "is_fipronil", name: "Nội chuẩn Fipronil 13C2 15N2 & Chlorpyrifos D10 (10ng/µl)", stock: 10000, unit: "µl", category: "reagent", threshold: 500 },
      { id: "is_trifluralin", name: "Nội chuẩn Trifluralin D14 (1µg/ml)", stock: 10000, unit: "µl", category: "reagent", threshold: 500 },
      { id: "iso_octane", name: "Iso-octane", stock: 5000, unit: "ml", category: "reagent", threshold: 500 },
      { id: "mgso4_anhydrous", name: "MgSO4 (Khan)", stock: 5000, unit: "g", category: "reagent", threshold: 500 },
      { id: "naoac_anhydrous", name: "NaOAc (Sodium Acetate Khan)", stock: 2000, unit: "g", category: "reagent", threshold: 200 },
      { id: "psa_powder", name: "Bột PSA (Primary Secondary Amine)", stock: 1000, unit: "g", category: "reagent", threshold: 100 },
      { id: "toluen", name: "Toluen", stock: 500, unit: "ml", category: "reagent", threshold: 50 }
    ];

    // 2. SOPs (Consumables 'name' MUST match Inventory 'id')
    const sops = [
      {
        "id": "SOP-01",
        "category": "NAFI6 H-9.21",
        "name": "Fipronil & Chlorpyrifos (GC-MS/MS)",
        "ref": "AOAC 2007.01; CLG-PST 5.10",
        "inputs": [ 
          { "label": "Số mẫu", "type": "number", "var": "n_sample", "default": 1 }, 
          { "type": "number", "var": "n_qc", "label": "Số QC", "default": 8 }, 
          { "step": 0.1, "default": 10, "var": "w_sample", "label": "Khối lượng mẫu", "type": "number", "unitLabel": "g" } 
        ],
        "variables": { 
          "total_vol_solvent": "total_n * 10 * (w_sample / 10)", 
          "total_n": "(n_sample + n_qc)" 
        },
        "consumables": [
          { "name": "acetonitrile", "type": "simple", "formula": "total_vol_solvent * 0.99", "unit": "ml", "base_note": "99% trong dung môi" },
          { "name": "acid_acetic", "type": "simple", "formula": "total_vol_solvent * 0.01", "unit": "ml", "base_note": "1% trong dung môi" },
          { 
            "name": "Hỗn hợp làm sạch B (H-9.21)", "type": "composite", "formula": "total_n", "unit": "tube", "base_note": "1 ống/mẫu",
            "ingredients": [ 
              { "name": "mgso4_anhydrous", "amount": 1.2, "unit": "g" }, 
              { "name": "c18_powder", "amount": 0.5, "unit": "g" }, 
              { "name": "psa_powder", "amount": 0.5, "unit": "g" } 
            ]
          },
          { 
            "name": "Hỗn hợp muối A (H-9.21/H-9.2)", "type": "composite", "formula": "total_n", "unit": "tube", "base_note": "1 ống/mẫu",
            "ingredients": [ 
              { "name": "mgso4_anhydrous", "amount": 4.5, "unit": "g" }, 
              { "name": "naoac_anhydrous", "amount": 1, "unit": "g" } 
            ] 
          },
          { "name": "is_fipronil", "type": "simple", "formula": "total_n * 20", "unit": "µl", "base_note": "20 µL/mẫu" },
          { "name": "toluen", "type": "simple", "formula": "total_n * 100", "unit": "µl", "base_note": "100 µL/mẫu" }
        ]
      },
      {
        "id": "SOP-02",
        "category": "NAFI6 H-9.2",
        "name": "Nhóm Lân hữu cơ (GC-MS/MS)",
        "ref": "AOAC 2007.01",
        "inputs": [ 
           { "label": "Số mẫu", "type": "number", "var": "n_sample", "default": 1 }, 
           { "default": 8, "type": "number", "label": "Số QC", "var": "n_qc" }, 
           { "type": "number", "default": 10, "label": "Khối lượng mẫu", "var": "w_sample", "step": 0.1, "unitLabel": "g" }, 
           { "var": "use_b2", "default": false, "type": "checkbox", "label": "Mẫu có màu (Dùng B2)" } 
        ],
        "variables": { 
          "total_vol_solvent": "total_n * 10 * (w_sample / 10)", 
          "total_n": "(n_sample + n_qc)" 
        },
        "consumables": [
          { "name": "acetonitrile", "formula": "total_vol_solvent * 0.99", "unit": "ml", "type": "simple", "base_note": "99% trong dung môi" },
          { "name": "acid_acetic", "formula": "total_vol_solvent * 0.01", "unit": "ml", "type": "simple", "base_note": "1% trong dung môi" },
          { 
             "name": "Hỗn hợp làm sạch B1 (H-9.2)", "type": "composite", "condition": "!use_b2", "formula": "total_n", "unit": "tube", "base_note": "1 ống/mẫu (B1)",
             "ingredients": [ 
                { "name": "mgso4_anhydrous", "amount": 1.2, "unit": "g" }, 
                { "name": "c18_powder", "amount": 0.5, "unit": "g" }, 
                { "name": "psa_powder", "amount": 0.5, "unit": "g" } 
             ]
          },
          { 
             "name": "Hỗn hợp làm sạch B2 (H-9.2)", "type": "composite", "condition": "use_b2", "formula": "total_n", "unit": "tube", "base_note": "1 ống/mẫu (B2-Có màu)",
             "ingredients": [ 
                { "name": "mgso4_anhydrous", "amount": 1.2, "unit": "g" }, 
                { "name": "c18_powder", "amount": 0.5, "unit": "g" }, 
                { "name": "psa_powder", "amount": 0.5, "unit": "g" }, 
                { "name": "carbograph_powder", "amount": 0.02, "unit": "g" } 
             ]
          },
          { 
             "name": "Hỗn hợp muối A (H-9.21/H-9.2)", "type": "composite", "formula": "total_n", "unit": "tube", "base_note": "1 ống/mẫu",
             "ingredients": [ 
                { "name": "mgso4_anhydrous", "amount": 4.5, "unit": "g" }, 
                { "name": "naoac_anhydrous", "amount": 1, "unit": "g" } 
             ]
          },
          { "name": "is_fipronil", "formula": "total_n * 20", "unit": "µl", "type": "simple", "base_note": "20 µL/mẫu" },
          { "name": "toluen", "formula": "total_n * 100", "unit": "µl", "type": "simple", "base_note": "100 µL/mẫu" }
        ]
      }
    ];

    await this.importData({ sops, inventory });
  }
}
