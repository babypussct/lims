
import { Injectable, inject } from '@angular/core';
import { doc, deleteDoc, runTransaction, serverTimestamp, collection, getDocs, writeBatch } from 'firebase/firestore';
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

        // 3. Save new data as Active
        sop.lastModified = serverTimestamp();
        transaction.set(sopRef, sop);
      });
    } catch (e) {
      // Changed to warn to avoid 'Error' noise in console when handled by UI
      console.warn("SOP Save Transaction Failed (handled in UI):", e);
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

  /**
   * MIGRATION UTILITY: Fixes legacy data structure
   * 1. Adds missing 'type' (simple/composite)
   * 2. Sanitizes 'composite' IDs (replaces spaces/slashes with slugs)
   * 3. Adds missing 'version'
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

          // 1. Fix missing Version
          if (!sop.version) {
              sop.version = 1;
              changed = true;
          }

          // 2. Fix missing Variables
          if (!sop.variables) {
              sop.variables = {};
              changed = true;
          }

          // 3. Fix Consumables Structure
          const newConsumables: Consumable[] = (sop.consumables || []).map(c => {
              let itemChanged = false;
              
              // Rule A: Detect Type if missing
              if (!c.type) {
                  if (c.ingredients && c.ingredients.length > 0) {
                      c.type = 'composite';
                  } else {
                      c.type = 'simple';
                  }
                  itemChanged = true;
              }

              // Rule B: Sanitize ID for Composites
              // If it's a composite, the 'name' is just an internal reference ID.
              // It should NOT contain spaces or special chars that break Firestore queries or IDs.
              if (c.type === 'composite') {
                  const safeId = 'mix_' + generateSlug(c.name);
                  
                  // Only change if the current name is NOT already a safe slug
                  // AND it contains bad characters (spaces, slashes) or doesn't start with mix_
                  if (c.name !== safeId && (!c.name.startsWith('mix_') || c.name.match(/[\s\/]/))) {
                      const oldName = c.name;
                      c.name = safeId;
                      // Move readable name to base_note for reference if not present
                      if (!c.base_note || !c.base_note.includes(oldName)) {
                          c.base_note = (c.base_note ? c.base_note + ' ' : '') + `(${oldName})`;
                      }
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

      if (updatedCount > 0) {
          await batch.commit();
      }
      return updatedCount;
  }
}
