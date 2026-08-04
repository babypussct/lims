import { Injectable, inject } from '@angular/core';
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  writeBatch
} from 'firebase/firestore';
import { SampleDescriptionMaster } from '../../core/models/sample-description.model';
import { FirebaseService } from '../../core/services/firebase.service';

@Injectable({ providedIn: 'root' })
export class SampleDescriptionMasterService {
  private readonly fb = inject(FirebaseService);
  private readonly cacheTtlMs = 5 * 60 * 1000;
  private cachedAll: SampleDescriptionMaster[] | null = null;
  private cachedAt = 0;
  private inFlight?: Promise<SampleDescriptionMaster[]>;

  private get collectionRef() {
    return collection(this.fb.db, `artifacts/${this.fb.APP_ID}/sample_description_master`);
  }

  async getAll(forceRefresh = false): Promise<SampleDescriptionMaster[]> {
    if (!forceRefresh && this.cachedAll && Date.now() - this.cachedAt < this.cacheTtlMs) {
      return this.cachedAll;
    }
    if (this.inFlight) return this.inFlight;

    const load = (async () => {
      const snapshot = await getDocs(query(this.collectionRef, orderBy('name')));
      const items = snapshot.docs.map(item => ({
        id: item.id,
        ...item.data(),
        isActive: item.data()['isActive'] !== false
      } as SampleDescriptionMaster));
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

  async getActive(): Promise<SampleDescriptionMaster[]> {
    return (await this.getAll()).filter(item => item.isActive);
  }

  async save(item: SampleDescriptionMaster, actorName = ''): Promise<void> {
    const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/sample_description_master/${item.id}`);
    await setDoc(ref, {
      ...item,
      aliases: (item.aliases || []).map(alias => alias.trim()).filter(Boolean),
      isActive: item.isActive !== false,
      updatedAt: serverTimestamp(),
      updatedBy: actorName || null
    }, { merge: true });
    this.invalidateCache();
  }

  async saveBatch(items: SampleDescriptionMaster[], actorName = ''): Promise<void> {
    for (let index = 0; index < items.length; index += 400) {
      const batch = writeBatch(this.fb.db);
      items.slice(index, index + 400).forEach(item => {
        const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/sample_description_master/${item.id}`);
        batch.set(ref, {
          ...item,
          aliases: (item.aliases || []).map(alias => alias.trim()).filter(Boolean),
          isActive: item.isActive !== false,
          updatedAt: serverTimestamp(),
          updatedBy: actorName || null
        }, { merge: true });
      });
      await batch.commit();
    }
    this.invalidateCache();
  }

  async setActive(item: SampleDescriptionMaster, isActive: boolean, actorName = ''): Promise<void> {
    await this.save({ ...item, isActive }, actorName);
  }
}
