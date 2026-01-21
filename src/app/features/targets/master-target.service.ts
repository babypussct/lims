
import { Injectable, inject } from '@angular/core';
import { FirebaseService } from '../../core/services/firebase.service';
import { 
  collection, doc, getDocs, setDoc, deleteDoc, 
  query, orderBy, serverTimestamp, getDoc, writeBatch
} from 'firebase/firestore';
import { MasterAnalyte } from '../../core/models/sop.model';

@Injectable({ providedIn: 'root' })
export class MasterTargetService {
  private fb = inject(FirebaseService);

  private get collectionRef() {
    return collection(this.fb.db, `artifacts/${this.fb.APP_ID}/master_analytes`);
  }

  async getAll(): Promise<MasterAnalyte[]> {
    const q = query(this.collectionRef, orderBy('name'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as MasterAnalyte));
  }

  async getById(id: string): Promise<MasterAnalyte | undefined> {
    const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/master_analytes/${id}`);
    const snap = await getDoc(ref);
    return snap.exists() ? ({ id: snap.id, ...snap.data() } as MasterAnalyte) : undefined;
  }

  async save(item: MasterAnalyte): Promise<void> {
    const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/master_analytes/${item.id}`);
    await setDoc(ref, { ...item, lastUpdated: serverTimestamp() });
  }

  // NEW: Batch Save for Import
  async saveBatch(items: MasterAnalyte[]): Promise<void> {
    const batch = writeBatch(this.fb.db);
    const MAX_BATCH_SIZE = 450; // Firestore limit is 500
    
    let opCount = 0;
    let currentBatch = batch;

    for (const item of items) {
        const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/master_analytes/${item.id}`);
        currentBatch.set(ref, { ...item, lastUpdated: serverTimestamp() });
        opCount++;

        // Commit and start new batch if limit reached
        if (opCount >= MAX_BATCH_SIZE) {
            await currentBatch.commit();
            currentBatch = writeBatch(this.fb.db);
            opCount = 0;
        }
    }

    if (opCount > 0) {
        await currentBatch.commit();
    }
  }

  async delete(id: string): Promise<void> {
    const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/master_analytes/${id}`);
    await deleteDoc(ref);
  }
}
