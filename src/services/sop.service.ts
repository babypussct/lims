
import { Injectable, inject } from '@angular/core';
import { doc, setDoc, deleteDoc, runTransaction, serverTimestamp, collection } from 'firebase/firestore';
import { Sop } from '../models/sop.model';
import { FirebaseService } from './firebase.service';

@Injectable({ providedIn: 'root' })
export class SopService {
  private firebaseService = inject(FirebaseService);

  async saveSop(sop: Sop): Promise<void> {
    const appId = this.firebaseService.APP_ID;
    const sopRef = doc(this.firebaseService.db, `artifacts/${appId}/sops/${sop.id}`);
    const historyRef = doc(collection(this.firebaseService.db, `artifacts/${appId}/sops/${sop.id}/history`));

    try {
      await runTransaction(this.firebaseService.db, async (transaction) => {
        const sfDoc = await transaction.get(sopRef);
        
        if (sfDoc.exists()) {
          // UPDATE: Backup old version and increment
          const currentData = sfDoc.data() as Sop;
          
          // 1. Archive current version to history
          transaction.set(historyRef, {
            ...currentData,
            archivedAt: serverTimestamp()
          });

          // 2. Increment version for new save
          sop.version = (currentData.version || 1) + 1;
        } else {
          // CREATE: Start at version 1
          sop.version = 1;
        }

        // 3. Save new data as Active
        sop.lastModified = serverTimestamp();
        transaction.set(sopRef, sop);
      });
    } catch (e) {
      console.error("Transaction failed: ", e);
      throw e;
    }
  }

  async deleteSop(id: string): Promise<void> {
    const path = `artifacts/${this.firebaseService.APP_ID}/sops/${id}`;
    // Note: This only deletes the active doc. History subcollection remains (which is good for audit).
    // To delete subcollections, cloud functions are usually required.
    await deleteDoc(doc(this.firebaseService.db, path));
  }
}
