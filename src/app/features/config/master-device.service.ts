import { Injectable, inject } from '@angular/core';
import { FirebaseService } from '../../core/services/firebase.service';
import { collection, doc, getDocs, setDoc, deleteDoc, writeBatch,
         query, orderBy, serverTimestamp } from 'firebase/firestore';
import { MasterDevice } from '../../core/models/sop.model';

@Injectable({ providedIn: 'root' })
export class MasterDeviceService {
  private fb = inject(FirebaseService);
  private readonly cacheTtlMs = 5 * 60 * 1000;
  private cachedAll: MasterDevice[] | null = null;
  private cachedAt = 0;
  private inFlight?: Promise<MasterDevice[]>;

  private get colRef() {
    return collection(this.fb.db, `artifacts/${this.fb.APP_ID}/master_devices`);
  }

  async getAll(forceRefresh = false): Promise<MasterDevice[]> {
    if (!forceRefresh && this.cachedAll && Date.now() - this.cachedAt < this.cacheTtlMs) {
      return this.cachedAll;
    }
    if (this.inFlight) return this.inFlight;

    const load = (async () => {
      const q = query(this.colRef, orderBy('name'));
      const snap = await getDocs(q);
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as MasterDevice));
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

  async save(device: MasterDevice): Promise<void> {
    const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/master_devices/${device.id}`);
    await setDoc(ref, { ...device, lastUpdated: serverTimestamp() });
    this.invalidateCache();
  }

  async delete(id: string): Promise<void> {
    const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/master_devices/${id}`);
    await deleteDoc(ref);
    this.invalidateCache();
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
    this.invalidateCache();
  }

  async seedDefaults(): Promise<void> {
    const existing = await this.getAll();
    if (existing.length > 0) return;
    await this.save({ id: 'gcmsms', name: 'GC-MS/MS' });
    await this.save({ id: 'gcms',   name: 'GC-MS' });
    await this.save({ id: 'lcmsms', name: 'LC-MS/MS' });
  }
}
