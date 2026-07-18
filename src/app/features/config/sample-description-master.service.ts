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

  private get collectionRef() {
    return collection(this.fb.db, `artifacts/${this.fb.APP_ID}/sample_description_master`);
  }

  async getAll(): Promise<SampleDescriptionMaster[]> {
    const snapshot = await getDocs(query(this.collectionRef, orderBy('name')));
    return snapshot.docs.map(item => ({
      id: item.id,
      ...item.data(),
      isActive: item.data()['isActive'] !== false
    } as SampleDescriptionMaster));
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
  }

  async setActive(item: SampleDescriptionMaster, isActive: boolean, actorName = ''): Promise<void> {
    await this.save({ ...item, isActive }, actorName);
  }
}
