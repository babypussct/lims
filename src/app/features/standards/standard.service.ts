
import { Injectable, inject } from '@angular/core';
import { FirebaseService } from '../../core/services/firebase.service';
import { 
  doc, collection, writeBatch, serverTimestamp, 
  updateDoc, setDoc, getDocs, deleteDoc, 
  query, orderBy, runTransaction, increment, limit, startAfter, where, QueryDocumentSnapshot, QueryConstraint
} from 'firebase/firestore';
import { ReferenceStandard, UsageLog } from '../../core/models/standard.model';
import { ToastService } from '../../core/services/toast.service';
import { generateSlug } from '../../shared/utils/utils';

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
          // Query: Get 1 item with expiry date, ordered by oldest first.
          // This efficiently finds the most critical item (expired or soonest to expire)
          // without reading the whole collection.
          const q = query(colRef, 
              where('expiry_date', '!=', ''), // Filter out missing dates
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

    // Search Logic (Simple Prefix Search on Name or ID)
    if (searchTerm) {
      const term = searchTerm.trim();
      // Searching by name/id prefix
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

  // --- LOGS Operations (Sub-collection) ---

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

          const currentAmount = stdDoc.data()['current_amount'] || 0;
          const newAmount = currentAmount - log.amount_used;

          if (newAmount < 0) throw new Error("Không đủ lượng tồn kho!");

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

          const currentStock = stdDoc.data()['current_amount'] || 0;
          const oldAmountUsed = logDoc.data()['amount_used'] || 0;
          const newAmountUsed = newLogData.amount_used;

          // Calculate difference: 
          // If used MORE (5 -> 10), stock decreases (-5). 
          // If used LESS (10 -> 5), stock increases (+5).
          // NewStock = Current + OldUsed - NewUsed
          const newStock = currentStock + oldAmountUsed - newAmountUsed;

          if (newStock < 0) throw new Error("Correction exceeds current stock!");

          // 1. Update Log
          transaction.update(logRef, {
              ...newLogData,
              timestamp: logDoc.data()['timestamp'] // Keep original timestamp for sorting
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

          const amountToRestore = logDoc.data()['amount_used'] || 0;
          const currentStock = stdDoc.data()['current_amount'] || 0;

          // 1. Delete Log
          transaction.delete(logRef);

          // 2. Restore Stock
          transaction.update(stdRef, {
              current_amount: currentStock + amountToRestore,
              lastUpdated: serverTimestamp()
          });
      });
  }

  // --- Smart Import Logic (Lazy Loaded) ---
  async importFromExcel(file: File) {
    // Dynamic Import of XLSX
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

          const parseUsageLog = (val: any, index: number): UsageLog | null => {
              if (!val) return null;
              // Case 1: Just a number
              if (typeof val === 'number' || (typeof val === 'string' && !isNaN(parseFloat(val)) && val.length < 10)) {
                  const num = Number(val); 
                  if (num <= 0) return null;
                  return {
                      date: new Date().toISOString().split('T')[0],
                      user: 'Imported',
                      amount_used: num,
                      purpose: `Lần cân ${index}`,
                      timestamp: Date.now() - (10 - index) * 1000
                  };
              }
              // Case 2: Complex string like "Ngày: ... / Người: ... / Lượng: ..."
              if (typeof val === 'string') {
                  const dateMatch = val.match(/(?:Ngày|Date).*?[:]\s*([\d\/\-]+)/i);
                  const userMatch = val.match(/(?:Người|User|By).*?[:]\s*([^\/\|\(\)\n\r]+)/i); 
                  const amountMatch = val.match(/(?:Lượng|Amount).*?[:]\s*([\d\.]+)/i);

                  if (amountMatch) {
                      let dateStr = new Date().toISOString().split('T')[0];
                      if (dateMatch) {
                          const dParts = dateMatch[1].trim().split(/[\-\/]/);
                          if (dParts.length === 3) {
                              let year = parseInt(dParts[2]);
                              if (year < 100) year += 2000;
                              dateStr = `${year}-${dParts[1].padStart(2,'0')}-${dParts[0].padStart(2,'0')}`;
                          }
                      }
                      
                      let userClean = 'Unknown';
                      if (userMatch) {
                          userClean = userMatch[1].trim();
                          userClean = userClean.replace(/lượng.*/i, '').trim(); 
                      }

                      return {
                          date: dateStr,
                          user: userClean,
                          amount_used: parseFloat(amountMatch[1]),
                          purpose: `Import`,
                          timestamp: Date.now() - (10 - index) * 1000
                      };
                  }
              }
              return null;
          };

          for (const rawRow of rawRows) {
             const row: Record<string, any> = {};
             Object.keys(rawRow).forEach(k => row[normalizeKey(k)] = rawRow[k]);

             const name = row['tên chuẩn'];
             if (!name) continue;

             const lot = row['số lô lot'] || row['lot'] || '';
             const id = generateSlug(name + '_' + (lot || Math.random().toString().substr(2, 5)));

             // Parse Logs
             const logs: UsageLog[] = [];
             for (let i = 1; i <= 10; i++) {
                 const key = Object.keys(row).find(k => k.includes(`lần cân ${i}`));
                 if (key) {
                     const log = parseUsageLog(row[key], i);
                     if (log) logs.push(log);
                 }
             }

             const initial = Number(row['khối lượng chai'] || 0);
             let current = Number(row['lượng còn lại']);
             
             if (isNaN(current)) {
                 const totalUsed = logs.reduce((sum, l) => sum + l.amount_used, 0);
                 current = isNaN(initial) ? 0 : (initial - totalUsed);
             }

             const standard: ReferenceStandard = {
                 id, name: name.trim(),
                 internal_id: (row['số nhận diện'] || '').toString().trim(), 
                 contract_ref: (row['hợp đồng dự toán'] || row['hợp đồng'] || '').toString().trim(),
                 received_date: parseDate(row['ngày nhận'] || row['ngày nhận ngày/tháng/năm (-: không thông tin)']),
                 expiry_date: parseDate(row['hạn sử dụng'] || row['hạn sử dụng ngày/tháng/năm (/: không hsd -: không thông tin)']),
                 initial_amount: isNaN(initial) ? 0 : initial,
                 current_amount: current,
                 pack_size: row['quy cách'] || '',
                 unit: this.detectUnit(row['quy cách']),
                 product_code: (row['mã số sản phẩm product code'] || row['product code'] || '').toString().trim(),
                 lot_number: (lot || '').toString().trim(),
                 manufacturer: (row['hãng'] || '').toString().trim(),
                 cas_number: (row['cas number'] || '').toString().trim(),
                 storage_condition: row['điều kiện bảo quản ft (tủ a) ct(tủ b) rt (tủ c) d: trong tối'] || '',
                 storage_status: row['tình trạng lưu trữ sẵn sàng để sử dụng chờ cập nhật thông tin liên hệ người quản lý sử dụng hết'] || 'Sẵn sàng',
                 // Extra fields
                 purity: '', 
                 location: '',
                 lastUpdated: serverTimestamp()
             };

             const stdRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${id}`);
             batch.set(stdRef, standard);

             logs.forEach(log => {
                 const logRef = doc(collection(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${id}/logs`));
                 batch.set(logRef, log);
             });

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

  private detectUnit(packSize: string): string {
      if (!packSize) return 'mg';
      const lower = packSize.toString().toLowerCase();
      if (lower.includes('ml')) return 'ml';
      if (lower.includes('mg')) return 'mg';
      if (lower.includes('g') && !lower.includes('mg')) return 'g';
      return 'mg'; 
  }
}
