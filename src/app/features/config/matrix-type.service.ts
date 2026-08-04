import { Injectable, inject } from '@angular/core';
import { FirebaseService } from '../../core/services/firebase.service';
import { collection, doc, getDocs, setDoc, deleteDoc, writeBatch,
         query, orderBy, serverTimestamp } from 'firebase/firestore';
import { MatrixType } from '../../core/models/sop.model';

@Injectable({ providedIn: 'root' })
export class MatrixTypeService {
  private fb = inject(FirebaseService);
  private readonly cacheTtlMs = 5 * 60 * 1000;
  private cachedAll: MatrixType[] | null = null;
  private cachedAt = 0;
  private inFlight?: Promise<MatrixType[]>;

  private get colRef() {
    return collection(this.fb.db, `artifacts/${this.fb.APP_ID}/matrix_types`);
  }

  async getAll(forceRefresh = false): Promise<MatrixType[]> {
    if (!forceRefresh && this.cachedAll && Date.now() - this.cachedAt < this.cacheTtlMs) {
      return this.cachedAll;
    }
    if (this.inFlight) return this.inFlight;

    const load = (async () => {
      const q = query(this.colRef, orderBy('name'));
      const snap = await getDocs(q);
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as MatrixType));
      this.cachedAll = items;
      this.cachedAt = Date.now();
      return items;
    })();
    this.inFlight = load;
    try {
      return await load;
    } finally {
      if (this.inFlight === load) this.inFlight = undefined;
    }
  }

  private invalidateCache() {
    this.cachedAll = null;
    this.cachedAt = 0;
  }

  async save(matrix: MatrixType): Promise<void> {
    const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/matrix_types/${matrix.id}`);
    await setDoc(ref, { ...matrix, lastUpdated: serverTimestamp() });
    this.invalidateCache();
  }

  async delete(id: string): Promise<void> {
    const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/matrix_types/${id}`);
    await deleteDoc(ref);
    this.invalidateCache();
  }

  async toggleDefault(item: MatrixType): Promise<void> {
    const all = await this.getAll();
    const batch = writeBatch(this.fb.db);
    const willBeDefault = !item.isDefault; // Toggle

    for (const m of all) {
      const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/matrix_types/${m.id}`);
      if (m.id === item.id) {
        batch.update(ref, { isDefault: willBeDefault, lastUpdated: serverTimestamp() });
      } else if (m.isDefault) {
        batch.update(ref, { isDefault: false, lastUpdated: serverTimestamp() });
      }
    }
    await batch.commit();
    this.invalidateCache();
  }

  async seedDefaults(): Promise<void> {
    const existing = await this.getAll();
    if (existing.length > 0) return;
    await this.save({ id: 'water',  name: 'Nước',       color: '#3b82f6' });
    await this.save({ id: 'food',   name: 'Thực Phẩm',  color: '#22c55e' });
  }
}
