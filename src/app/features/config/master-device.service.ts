import { Injectable, inject } from '@angular/core';
import { FirebaseService } from '../../core/services/firebase.service';
import { collection, doc, getDocs, setDoc, deleteDoc, writeBatch,
         query, orderBy, serverTimestamp } from 'firebase/firestore';
import { MasterDevice } from '../../core/models/sop.model';

@Injectable({ providedIn: 'root' })
export class MasterDeviceService {
  private fb = inject(FirebaseService);

  private get colRef() {
    return collection(this.fb.db, `artifacts/${this.fb.APP_ID}/master_devices`);
  }

  async getAll(): Promise<MasterDevice[]> {
    const q = query(this.colRef, orderBy('name'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as MasterDevice));
  }

  async save(device: MasterDevice): Promise<void> {
    const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/master_devices/${device.id}`);
    await setDoc(ref, { ...device, lastUpdated: serverTimestamp() });
  }

  async delete(id: string): Promise<void> {
    const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/master_devices/${id}`);
    await deleteDoc(ref);
  }

  async toggleDefault(item: MasterDevice): Promise<void> {
    const all = await this.getAll();
    const batch = writeBatch(this.fb.db);
    const willBeDefault = !item.isDefault; // Toggle

    for (const d of all) {
      const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/master_devices/${d.id}`);
      if (d.id === item.id) {
        batch.update(ref, { isDefault: willBeDefault, lastUpdated: serverTimestamp() });
      } else if (d.isDefault) {
        batch.update(ref, { isDefault: false, lastUpdated: serverTimestamp() });
      }
    }
    await batch.commit();
  }

  async seedDefaults(): Promise<void> {
    const existing = await this.getAll();
    if (existing.length > 0) return;
    await this.save({ id: 'gcmsms', name: 'GC-MS/MS' });
    await this.save({ id: 'gcms',   name: 'GC-MS' });
    await this.save({ id: 'lcmsms', name: 'LC-MS/MS' });
  }
}
