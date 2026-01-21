
import { Injectable, inject } from '@angular/core';
import { FirebaseService } from '../../core/services/firebase.service';
import { 
  collection, doc, getDocs, setDoc, deleteDoc, 
  query, orderBy, serverTimestamp, getDoc
} from 'firebase/firestore';
import { TargetGroup } from '../../core/models/sop.model';

@Injectable({ providedIn: 'root' })
export class TargetService {
  private fb = inject(FirebaseService);

  private get collectionRef() {
    return collection(this.fb.db, `artifacts/${this.fb.APP_ID}/target_groups`);
  }

  async getAllGroups(): Promise<TargetGroup[]> {
    const q = query(this.collectionRef, orderBy('name'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as TargetGroup));
  }

  async getGroupById(id: string): Promise<TargetGroup | undefined> {
    const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/target_groups/${id}`);
    const snap = await getDoc(ref);
    return snap.exists() ? ({ id: snap.id, ...snap.data() } as TargetGroup) : undefined;
  }

  async saveGroup(group: TargetGroup): Promise<void> {
    const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/target_groups/${group.id}`);
    await setDoc(ref, { ...group, lastUpdated: serverTimestamp() });
  }

  async deleteGroup(id: string): Promise<void> {
    const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/target_groups/${id}`);
    await deleteDoc(ref);
  }
}
