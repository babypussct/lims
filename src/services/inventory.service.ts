
import { Injectable, inject } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { 
  doc, setDoc, updateDoc, deleteDoc, 
  collection, addDoc, serverTimestamp 
} from 'firebase/firestore';
import { InventoryItem } from '../models/inventory.model';
import { ToastService } from './toast.service';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private fb = inject(FirebaseService);
  private toast = inject(ToastService);

  // --- CRUD Operations ---

  async upsertItem(item: InventoryItem, isNew: boolean = false) {
    const ref = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', item.id);
    const payload = { ...item, lastUpdated: serverTimestamp() };
    
    await setDoc(ref, payload, { merge: true });
    
    if (isNew) {
      await this.logAction('CREATE_ITEM', `Tạo mới hóa chất: ${item.id} (${item.stock} ${item.unit})`);
    } else {
      await this.logAction('UPDATE_INFO', `Cập nhật thông tin: ${item.id}`);
    }
  }

  async deleteItem(id: string) {
    const ref = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', id);
    await deleteDoc(ref);
    await this.logAction('DELETE_ITEM', `Xóa hóa chất: ${id}`);
  }

  async updateStock(id: string, currentStock: number, adjustment: number) {
    const newStock = currentStock + adjustment;
    const ref = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'inventory', id);
    
    await updateDoc(ref, { 
      stock: newStock,
      lastUpdated: serverTimestamp()
    });

    const actionType = adjustment > 0 ? 'STOCK_IN' : 'STOCK_OUT';
    await this.logAction(actionType, `Điều chỉnh kho ${id}: ${adjustment > 0 ? '+' : ''}${adjustment} -> Tồn: ${newStock}`);
  }

  // --- Internal Logging ---
  private async logAction(action: string, details: string) {
    try {
      await addDoc(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'logs'), {
        action,
        details,
        timestamp: serverTimestamp(),
        user: 'Admin' // In a real app, use Auth User
      });
    } catch (e) {
      console.error('Log error', e);
    }
  }
}
