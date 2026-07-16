
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
  private groupsPromise?: Promise<TargetGroup[]>;

  private get collectionRef() {
    return collection(this.fb.db, `artifacts/${this.fb.APP_ID}/target_groups`);
  }

  getAllGroups(forceRefresh = false): Promise<TargetGroup[]> {
    if (!this.groupsPromise || forceRefresh) {
      const q = query(this.collectionRef, orderBy('name'));
      this.groupsPromise = getDocs(q)
        .then(snapshot => snapshot.docs.map(d => ({ id: d.id, ...d.data() } as TargetGroup)))
        .catch(error => {
          this.groupsPromise = undefined;
          throw error;
        });
    }
    return this.groupsPromise;
  }

  async getGroupById(id: string): Promise<TargetGroup | undefined> {
    const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/target_groups/${id}`);
    const snap = await getDoc(ref);
    return snap.exists() ? ({ id: snap.id, ...snap.data() } as TargetGroup) : undefined;
  }

  async saveGroup(group: TargetGroup): Promise<void> {
    const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/target_groups/${group.id}`);
    await setDoc(ref, { ...group, lastUpdated: serverTimestamp() });
    this.groupsPromise = undefined;
  }

  async deleteGroup(id: string): Promise<void> {
    const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/target_groups/${id}`);
    await deleteDoc(ref);
    this.groupsPromise = undefined;
  }
}
