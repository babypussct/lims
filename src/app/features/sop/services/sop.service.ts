
import { Injectable, inject } from '@angular/core';
import { doc, deleteDoc, runTransaction, serverTimestamp, collection, getDocs } from 'firebase/firestore';
import { Sop } from '../../../core/models/sop.model';
import { FirebaseService } from '../../../core/services/firebase.service';

@Injectable({ providedIn: 'root' })
export class SopService {
  private firebaseService = inject(FirebaseService);

  async saveSop(sop: Sop): Promise<void> {
    const appId = this.firebaseService.APP_ID;
    const sopRef = doc(this.firebaseService.db, `artifacts/${appId}/sops/${sop.id}`);
    
    // Sub-collection for history inside the SOP document
    const historyCollectionRef = collection(this.firebaseService.db, `artifacts/${appId}/sops/${sop.id}/history`);
    
    // We use a new doc reference for the history item (auto-ID)
    const historyDocRef = doc(historyCollectionRef);

    try {
      await runTransaction(this.firebaseService.db, async (transaction) => {
        const sfDoc = await transaction.get(sopRef);
        
        if (sfDoc.exists()) {
          // UPDATE: Backup old version
          const currentData = sfDoc.data() as Sop;
          
          // 1. Archive current version to history
          transaction.set(historyDocRef, {
            ...currentData,
            archivedAt: serverTimestamp() // Mark when it was moved to history
          });

          // 2. Logic for Versioning
          // If sop.version is null/undefined (new doc), default to 1.
          if (!sop.version) {
             sop.version = (currentData.version || 0) + 1;
          }
        } else {
          // CREATE: Start at version 1 if not specified
          if (!sop.version) sop.version = 1;
        }

        // 3. Save new data as Active
        sop.lastModified = serverTimestamp();
        transaction.set(sopRef, sop);
      });
    } catch (e) {
      console.error("SOP Save Transaction Failed:", e);
      throw e;
    }
  }

  async deleteSop(id: string): Promise<void> {
    const appId = this.firebaseService.APP_ID;
    await deleteDoc(doc(this.firebaseService.db, `artifacts/${appId}/sops/${id}`));
  }

  async getSopHistory(id: string): Promise<Sop[]> {
    const appId = this.firebaseService.APP_ID;
    const historyRef = collection(this.firebaseService.db, `artifacts/${appId}/sops/${id}/history`);
    
    // REMOVED: orderBy('archivedAt', 'desc') to avoid "Missing Index" error in Firestore.
    // We fetch all and sort in memory (safe for history lists which are usually small).
    const snapshot = await getDocs(historyRef);
    
    const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Sop));
    
    // Sort in memory: Newest first
    return items.sort((a, b) => {
        // Handle Firestore Timestamp (seconds) or Date object
        const tA = (a.archivedAt?.seconds || 0);
        const tB = (b.archivedAt?.seconds || 0);
        return tB - tA;
    });
  }
}