
import { Injectable, inject } from '@angular/core';
import { doc, deleteDoc, runTransaction, serverTimestamp, collection, getDocs, writeBatch, updateDoc } from 'firebase/firestore';
import { Sop, Consumable } from '../../../core/models/sop.model';
import { FirebaseService } from '../../../core/services/firebase.service';
import { generateSlug } from '../../../shared/utils/utils';

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

        // 3. Save new data as Active and un-archive if previously archived
        sop.lastModified = serverTimestamp();
        sop.isArchived = false; 
        transaction.set(sopRef, sop);
      });
    } catch (e) {
      console.warn("SOP Save Transaction Failed (handled in UI):", e);
      throw e;
    }
  }

  // Soft Delete (Preferred)
  async archiveSop(id: string): Promise<void> {
      const appId = this.firebaseService.APP_ID;
      const ref = doc(this.firebaseService.db, `artifacts/${appId}/sops/${id}`);
      await updateDoc(ref, { 
          isArchived: true,
          archivedAt: serverTimestamp()
      });
  }

  // Hard Delete (Admin only)
  async deleteSop(id: string): Promise<void> {
    const appId = this.firebaseService.APP_ID;
    await deleteDoc(doc(this.firebaseService.db, `artifacts/${appId}/sops/${id}`));
  }

  async getSopHistory(id: string): Promise<Sop[]> {
    const appId = this.firebaseService.APP_ID;
    const historyRef = collection(this.firebaseService.db, `artifacts/${appId}/sops/${id}/history`);
    const snapshot = await getDocs(historyRef);
    const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Sop));
    
    // Sort in memory: Newest first
    return items.sort((a, b) => {
        const tA = (a.archivedAt?.seconds || 0);
        const tB = (b.archivedAt?.seconds || 0);
        return tB - tA;
    });
  }

  /**
   * MIGRATION UTILITY
   */
  async normalizeOldData(): Promise<number> {
      const appId = this.firebaseService.APP_ID;
      const colRef = collection(this.firebaseService.db, `artifacts/${appId}/sops`);
      const snapshot = await getDocs(colRef);
      
      const batch = writeBatch(this.firebaseService.db);
      let updatedCount = 0;

      snapshot.forEach(docSnap => {
          const sop = docSnap.data() as Sop;
          let changed = false;

          if (!sop.version) { sop.version = 1; changed = true; }
          if (!sop.variables) { sop.variables = {}; changed = true; }

          const newConsumables: Consumable[] = (sop.consumables || []).map(c => {
              let itemChanged = false;
              if (!c.type) {
                  if (c.ingredients && c.ingredients.length > 0) c.type = 'composite';
                  else c.type = 'simple';
                  itemChanged = true;
              }
              if (c.type === 'composite') {
                  const safeId = 'mix_' + generateSlug(c.name);
                  if (c.name !== safeId && (!c.name.startsWith('mix_') || c.name.match(/[\s\/]/))) {
                      c.name = safeId;
                      itemChanged = true;
                  }
              }
              if (itemChanged) changed = true;
              return c;
          });

          if (changed) {
              batch.update(docSnap.ref, { 
                  version: sop.version,
                  variables: sop.variables,
                  consumables: newConsumables 
              });
              updatedCount++;
          }
      });

      if (updatedCount > 0) await batch.commit();
      return updatedCount;
  }
}
