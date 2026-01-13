
import { Injectable, inject } from '@angular/core';
import { FirebaseService } from '../../core/services/firebase.service';
import { 
  doc, collection, writeBatch, serverTimestamp, 
  updateDoc, setDoc, getDocs, deleteDoc, 
  query, orderBy, runTransaction, increment, limit, startAfter, where, QueryDocumentSnapshot, QueryConstraint
} from 'firebase/firestore';
import { ReferenceStandard, UsageLog } from '../../core/models/standard.model';
import { ToastService } from '../../core/services/toast.service';
import { generateSlug, getStandardizedAmount } from '../../shared/utils/utils';

export interface StandardsPage {
  items: ReferenceStandard[];
  lastDoc: QueryDocumentSnapshot | null;
  hasMore: boolean;
}

@Injectable({ providedIn: 'root' })
export class StandardService {
  private fb = inject(FirebaseService);
  private toast = inject(ToastService);

  // --- OPTIMIZED READ FOR DASHBOARD ---
  async getNearestExpiry(): Promise<ReferenceStandard | null> {
      try {
          const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'reference_standards');
          const q = query(colRef, 
              where('expiry_date', '!=', ''), 
              orderBy('expiry_date', 'asc'), 
              limit(1)
          );
          
          const snapshot = await getDocs(q);
          if (snapshot.empty) return null;
          
          const doc = snapshot.docs[0];
          return { id: doc.id, ...doc.data() } as ReferenceStandard;
      } catch (e) {
          console.warn("Nearest expiry fetch failed:", e);
          return null;
      }
  }

  // --- PAGINATION READ ---
  async getStandardsPage(
    pageSize: number, 
    lastDoc: QueryDocumentSnapshot | null, 
    searchTerm: string
  ): Promise<StandardsPage> {
    const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'reference_standards');
    let constraints: QueryConstraint[] = [];

    // Search Logic
    if (searchTerm) {
      const term = searchTerm.trim().toLowerCase(); // Normalize search term
      // Tìm kiếm theo ID (slug) - tương đương tìm theo tên
      constraints.push(where('id', '>=', term));
      constraints.push(where('id', '<=', term + '\uf8ff'));
      constraints.push(orderBy('id'));
    } else {
      // Default: Newest updated first
      constraints.push(orderBy('lastUpdated', 'desc'));
    }

    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }
    
    constraints.push(limit(pageSize));

    const q = query(colRef, ...constraints);
    const snapshot = await getDocs(q);
    
    const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ReferenceStandard));
    
    return {
      items,
      lastDoc: snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null,
      hasMore: snapshot.docs.length === pageSize
    };
  }

  // --- CRUD Operations (Parent) ---
  
  async addStandard(std: ReferenceStandard) {
      const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${std.id}`);
      await setDoc(ref, { ...std, lastUpdated: serverTimestamp() });
  }

  async updateStandard(std: ReferenceStandard) {
      const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${std.id}`);
      await updateDoc(ref, { ...std, lastUpdated: serverTimestamp() });
  }

  async deleteStandard(id: string) {
      await deleteDoc(doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${id}`));
  }

  async deleteAllStandards() {
    const ref = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards`);
    const snapshot = await getDocs(ref);
    const batch = writeBatch(this.fb.db);
    if (snapshot.empty) return;
    snapshot.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
  }

  // --- LOGS Operations (Sub-collection) with UNIT CONVERSION ---

  async getUsageHistory(stdId: string): Promise<UsageLog[]> {
      const logsRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${stdId}/logs`);
      const q = query(logsRef, orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as UsageLog));
  }

  async recordUsage(stdId: string, log: UsageLog) {
      const stdRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${stdId}`);
      const logsRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${stdId}/logs`);
      const newLogRef = doc(logsRef); // Auto ID

      await runTransaction(this.fb.db, async (transaction) => {
          const stdDoc = await transaction.get(stdRef);
          if (!stdDoc.exists()) throw new Error("Standard does not exist!");

          const stdData = stdDoc.data();
          const currentAmount = stdData['current_amount'] || 0;
          const stockUnit = stdData['unit'] || 'mg';
          const usageUnit = log.unit || stockUnit;

          // CONVERSION LOGIC
          const amountToDeduct = getStandardizedAmount(log.amount_used, usageUnit, stockUnit);
          
          if (amountToDeduct === null) {
              throw new Error(`Không thể quy đổi từ ${usageUnit} sang ${stockUnit}`);
          }

          const newAmount = currentAmount - amountToDeduct;

          if (newAmount < 0) throw new Error(`Không đủ lượng tồn kho! (Cần: ${amountToDeduct} ${stockUnit}, Tồn: ${currentAmount} ${stockUnit})`);

          // 1. Update Parent
          transaction.update(stdRef, { 
              current_amount: newAmount,
              lastUpdated: serverTimestamp() 
          });

          // 2. Add to Sub-collection
          transaction.set(newLogRef, log);
      });
  }

  // UPDATE Usage Log: Re-calculate stock based on difference
  async updateUsageLog(stdId: string, logId: string, newLogData: UsageLog) {
      const stdRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${stdId}`);
      const logRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${stdId}/logs/${logId}`);

      await runTransaction(this.fb.db, async (transaction) => {
          const stdDoc = await transaction.get(stdRef);
          const logDoc = await transaction.get(logRef);

          if (!stdDoc.exists()) throw new Error("Standard not found");
          if (!logDoc.exists()) throw new Error("Log entry not found");

          const stdData = stdDoc.data();
          const stockUnit = stdData['unit'];
          const currentStock = stdData['current_amount'] || 0;

          // Old Data
          const oldLogData = logDoc.data();
          const oldAmount = oldLogData['amount_used'] || 0;
          const oldUnit = oldLogData['unit'] || stockUnit;
          
          // New Data
          const newAmount = newLogData.amount_used;
          const newUnit = newLogData.unit || stockUnit;

          // Convert both to Stock Unit
          const oldDeduct = getStandardizedAmount(oldAmount, oldUnit, stockUnit);
          const newDeduct = getStandardizedAmount(newAmount, newUnit, stockUnit);

          if (oldDeduct === null || newDeduct === null) throw new Error("Lỗi quy đổi đơn vị");

          // Calculate correction: Revert old, apply new
          // NewStock = Current + OldDeduct - NewDeduct
          const newStock = currentStock + oldDeduct - newDeduct;

          if (newStock < 0) throw new Error("Correction exceeds current stock!");

          // 1. Update Log
          transaction.update(logRef, {
              ...newLogData,
              timestamp: oldLogData['timestamp'] // Keep original timestamp
          });

          // 2. Update Stock
          transaction.update(stdRef, {
              current_amount: newStock,
              lastUpdated: serverTimestamp()
          });
      });
  }

  // DELETE Usage Log: Restore stock
  async deleteUsageLog(stdId: string, logId: string) {
      const stdRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${stdId}`);
      const logRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${stdId}/logs/${logId}`);

      await runTransaction(this.fb.db, async (transaction) => {
          const stdDoc = await transaction.get(stdRef);
          const logDoc = await transaction.get(logRef);

          if (!stdDoc.exists() || !logDoc.exists()) throw new Error("Document not found");

          const stdData = stdDoc.data();
          const logData = logDoc.data();
          
          const stockUnit = stdData['unit'];
          const amountUsed = logData['amount_used'] || 0;
          const unitUsed = logData['unit'] || stockUnit;
          const currentStock = stdData['current_amount'] || 0;

          // Convert to Stock Unit for restoration
          const amountToRestore = getStandardizedAmount(amountUsed, unitUsed, stockUnit);
          if (amountToRestore === null) throw new Error("Lỗi quy đổi đơn vị khi hoàn kho");

          // 1. Delete Log
          transaction.delete(logRef);

          // 2. Restore Stock
          transaction.update(stdRef, {
              current_amount: currentStock + amountToRestore,
              lastUpdated: serverTimestamp()
          });
      });
  }

  // --- Smart Import Logic ---
  async importFromExcel(file: File) {
    const XLSX = await import('xlsx');

    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e: any) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          
          const rawRows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
          if (!rawRows || rawRows.length === 0) throw new Error('File rỗng');

          const batch = writeBatch(this.fb.db);
          let count = 0;

          const normalizeKey = (key: string) => key.toString().replace(/[\r\n]+/g, ' ').trim().toLowerCase();

          const parseDate = (val: any): string => {
             if (!val || ['-', '/', 'na', 'cas inside'].includes(val.toString().toLowerCase())) return '';
             if (typeof val === 'number') {
                 const date = new Date(Math.round((val - 25569)*86400*1000));
                 return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
             }
             if (typeof val === 'string') {
                 const parts = val.trim().split('/'); 
                 if (parts.length === 3) return `${parts[2]}-${parts[1].padStart(2,'0')}-${parts[0].padStart(2,'0')}`;
             }
             return '';
          };

          const detectUnit = (packSize: string): string => {
              if (!packSize) return 'mg';
              const lower = packSize.toString().toLowerCase();
              if (lower.includes('ml')) return 'ml';
              if (lower.includes('mg')) return 'mg';
              if (lower.includes('g') && !lower.includes('mg')) return 'g';
              return 'mg'; 
          };

          for (const rawRow of rawRows) {
             const row: Record<string, any> = {};
             Object.keys(rawRow).forEach(k => row[normalizeKey(k)] = rawRow[k]);

             const name = row['tên chuẩn'];
             if (!name) continue;

             const lot = row['số lô lot'] || row['lot'] || '';
             const id = generateSlug(name + '_' + (lot || Math.random().toString().substr(2, 5)));
             
             // Import logs logic omitted for brevity, keeping simple migration
             const initial = Number(row['khối lượng chai'] || 0);
             let current = Number(row['lượng còn lại']);
             if (isNaN(current)) current = initial;

             const standard: ReferenceStandard = {
                 id, name: name.trim(),
                 internal_id: (row['số nhận diện'] || '').toString().trim(), 
                 contract_ref: (row['hợp đồng dự toán'] || row['hợp đồng'] || '').toString().trim(),
                 received_date: parseDate(row['ngày nhận'] || row['ngày nhận ngày/tháng/năm (-: không thông tin)']),
                 expiry_date: parseDate(row['hạn sử dụng'] || row['hạn sử dụng ngày/tháng/năm (/: không hsd -: không thông tin)']),
                 initial_amount: isNaN(initial) ? 0 : initial,
                 current_amount: current,
                 pack_size: row['quy cách'] || '',
                 unit: detectUnit(row['quy cách']),
                 product_code: (row['mã số sản phẩm product code'] || row['product code'] || '').toString().trim(),
                 lot_number: (lot || '').toString().trim(),
                 manufacturer: (row['hãng'] || '').toString().trim(),
                 cas_number: (row['cas number'] || '').toString().trim(),
                 storage_condition: row['điều kiện bảo quản ft (tủ a) ct(tủ b) rt (tủ c) d: trong tối'] || '',
                 storage_status: 'Sẵn sàng',
                 purity: '', 
                 location: '',
                 lastUpdated: serverTimestamp()
             };

             const stdRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${id}`);
             batch.set(stdRef, standard);
             count++;
          }

          await batch.commit();
          this.toast.show(`Đã import ${count} chuẩn thành công!`, 'success');
          resolve();

        } catch (err: any) {
          console.error(err);
          this.toast.show('Lỗi đọc file Excel: ' + err.message, 'error');
          reject(err);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }
}
