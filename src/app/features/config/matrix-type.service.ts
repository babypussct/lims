import { Injectable, inject } from '@angular/core';
import { FirebaseService } from '../../core/services/firebase.service';
import { collection, doc, getDocs, setDoc, deleteDoc, writeBatch,
         query, orderBy, serverTimestamp } from 'firebase/firestore';
import { MatrixType } from '../../core/models/sop.model';

@Injectable({ providedIn: 'root' })
export class MatrixTypeService {
  private fb = inject(FirebaseService);

  private get colRef() {
    return collection(this.fb.db, `artifacts/${this.fb.APP_ID}/matrix_types`);
  }

  async getAll(): Promise<MatrixType[]> {
    const q = query(this.colRef, orderBy('name'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as MatrixType));
  }

  async save(matrix: MatrixType): Promise<void> {
    const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/matrix_types/${matrix.id}`);
    await setDoc(ref, { ...matrix, lastUpdated: serverTimestamp() });
  }

  async delete(id: string): Promise<void> {
    const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/matrix_types/${id}`);
    await deleteDoc(ref);
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
  }

  async seedDefaults(): Promise<void> {
    const existing = await this.getAll();
    if (existing.length > 0) return;
    await this.save({ id: 'water',  name: 'Nước',       color: '#3b82f6' });
    await this.save({ id: 'food',   name: 'Thực Phẩm',  color: '#22c55e' });
  }
}
