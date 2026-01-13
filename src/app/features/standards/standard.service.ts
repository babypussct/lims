
import { Injectable, inject } from '@angular/core';
import { FirebaseService } from '../../core/services/firebase.service';
import { 
  doc, collection, writeBatch, serverTimestamp, 
  updateDoc, setDoc, getDocs, deleteDoc, 
  query, orderBy, runTransaction, limit, startAfter, where, QueryDocumentSnapshot, QueryConstraint
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

  // --- HELPER: SMART DATE PARSER ---
  // Chuyển đổi mọi định dạng (Excel serial, Eng text, DD/MM/YYYY) thành YYYY-MM-DD
  private parseSmartDate(val: any): string {
      if (!val) return '';
      const strVal = val.toString().trim();
      if (['-', '/', 'na', 'n/a', 'unknown'].includes(strVal.toLowerCase())) return '';

      // 1. Excel Serial Date
      if (typeof val === 'number' || (strVal.match(/^\d+$/) && Number(strVal) > 30000)) {
          const date = new Date(Math.round((Number(val) - 25569) * 86400 * 1000));
          return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
      }

      // 2. Standard ISO (Already Correct)
      if (strVal.match(/^\d{4}-\d{2}-\d{2}$/)) return strVal;

      // 3. DD/MM/YYYY or DD-MM-YYYY
      const dmyMatch = strVal.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{2,4})$/);
      if (dmyMatch) {
          const y = dmyMatch[3].length === 2 ? '20' + dmyMatch[3] : dmyMatch[3];
          return `${y}-${dmyMatch[2].padStart(2, '0')}-${dmyMatch[1].padStart(2, '0')}`;
      }

      // 4. English Text (e.g., "05 Jun 2030", "Jun-2030")
      const months: {[key:string]: string} = {
          'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04', 'may': '05', 'jun': '06',
          'jul': '07', 'aug': '08', 'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12'
      };
      
      // Clean string: remove commas, extra spaces
      const cleanStr = strVal.replace(/,/g, '').replace(/\s+/g, ' ').toLowerCase();
      
      // Check for month names
      for (const [mName, mNum] of Object.entries(months)) {
          if (cleanStr.includes(mName)) {
              // Try to find Year (4 digits)
              const yMatch = cleanStr.match(/\d{4}/);
              const year = yMatch ? yMatch[0] : new Date().getFullYear().toString();
              
              // Try to find Day (1-2 digits, distinct from year)
              const dMatch = cleanStr.match(/\b(\d{1,2})\b/);
              const day = (dMatch && dMatch[0] !== year) ? dMatch[0].padStart(2, '0') : '01'; // Default to 1st if no day

              return `${year}-${mNum}-${day}`;
          }
      }

      return ''; // Fallback
  }

  // --- READ Operations ---
  async getNearestExpiry(): Promise<ReferenceStandard | null> {
      try {
          const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'reference_standards');
          const q = query(colRef, where('expiry_date', '!=', ''), orderBy('expiry_date', 'asc'), limit(1));
          const snapshot = await getDocs(q);
          return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as ReferenceStandard;
      } catch (e) { return null; }
  }

  async getStandardsPage(pageSize: number, lastDoc: QueryDocumentSnapshot | null, searchTerm: string): Promise<StandardsPage> {
    const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'reference_standards');
    let constraints: QueryConstraint[] = [];

    if (searchTerm) {
      const term = searchTerm.trim().toLowerCase();
      constraints.push(where('id', '>=', term));
      constraints.push(where('id', '<=', term + '\uf8ff'));
      constraints.push(orderBy('id'));
    } else {
      constraints.push(orderBy('lastUpdated', 'desc'));
    }

    if (lastDoc) constraints.push(startAfter(lastDoc));
    constraints.push(limit(pageSize));

    const q = query(colRef, ...constraints);
    const snapshot = await getDocs(q);
    
    return {
      items: snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ReferenceStandard)),
      lastDoc: snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null,
      hasMore: snapshot.docs.length === pageSize
    };
  }

  // --- WRITE Operations ---
  
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

  async deleteSelectedStandards(ids: string[]) {
      const batch = writeBatch(this.fb.db);
      ids.forEach(id => {
          const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${id}`);
          batch.delete(ref);
      });
      await batch.commit();
  }

  async deleteAllStandards() {
    const ref = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards`);
    const snapshot = await getDocs(ref);
    const batch = writeBatch(this.fb.db);
    snapshot.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
  }

  // --- LOGS Operations ---

  async getUsageHistory(stdId: string): Promise<UsageLog[]> {
      const logsRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${stdId}/logs`);
      const q = query(logsRef, orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as UsageLog));
  }

  async recordUsage(stdId: string, log: UsageLog) {
      const stdRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${stdId}`);
      const logsRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${stdId}/logs`);
      const newLogRef = doc(logsRef); 

      await runTransaction(this.fb.db, async (transaction) => {
          const stdDoc = await transaction.get(stdRef);
          if (!stdDoc.exists()) throw new Error("Standard does not exist!");

          const stdData = stdDoc.data();
          const currentAmount = stdData['current_amount'] || 0;
          const stockUnit = stdData['unit'] || 'mg';
          const usageUnit = log.unit || stockUnit;

          const amountToDeduct = getStandardizedAmount(log.amount_used, usageUnit, stockUnit);
          if (amountToDeduct === null) throw new Error(`Không thể quy đổi từ ${usageUnit} sang ${stockUnit}`);

          const newAmount = currentAmount - amountToDeduct;
          if (newAmount < 0) throw new Error(`Không đủ lượng tồn kho!`);

          transaction.update(stdRef, { current_amount: newAmount, lastUpdated: serverTimestamp() });
          transaction.set(newLogRef, log);
      });
  }

  async updateUsageLog(stdId: string, logId: string, newLogData: UsageLog) {
      const stdRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${stdId}`);
      const logRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${stdId}/logs/${logId}`);

      await runTransaction(this.fb.db, async (transaction) => {
          const stdDoc = await transaction.get(stdRef);
          const logDoc = await transaction.get(logRef);
          if (!stdDoc.exists() || !logDoc.exists()) throw new Error("Not found");

          const stdData = stdDoc.data();
          const stockUnit = stdData['unit'];
          const currentStock = stdData['current_amount'] || 0;

          const oldLogData = logDoc.data();
          const oldAmount = oldLogData['amount_used'] || 0;
          const oldUnit = oldLogData['unit'] || stockUnit;
          
          const newAmount = newLogData.amount_used;
          const newUnit = newLogData.unit || stockUnit;

          const oldDeduct = getStandardizedAmount(oldAmount, oldUnit, stockUnit);
          const newDeduct = getStandardizedAmount(newAmount, newUnit, stockUnit);

          if (oldDeduct === null || newDeduct === null) throw new Error("Lỗi quy đổi đơn vị");

          const newStock = currentStock + oldDeduct - newDeduct;
          if (newStock < 0) throw new Error("Correction exceeds current stock!");

          transaction.update(logRef, { ...newLogData, timestamp: oldLogData['timestamp'] });
          transaction.update(stdRef, { current_amount: newStock, lastUpdated: serverTimestamp() });
      });
  }

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

          const amountToRestore = getStandardizedAmount(amountUsed, unitUsed, stockUnit);
          if (amountToRestore === null) throw new Error("Lỗi quy đổi đơn vị");

          transaction.delete(logRef);
          transaction.update(stdRef, { current_amount: currentStock + amountToRestore, lastUpdated: serverTimestamp() });
      });
  }

  // --- SMART IMPORT LOGIC ---
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

          for (const rawRow of rawRows) {
             const row: Record<string, any> = {};
             Object.keys(rawRow).forEach(k => row[normalizeKey(k)] = rawRow[k]);

             const name = row['tên chuẩn'];
             if (!name) continue;

             const lot = (row['số lô lot'] || row['lot'] || '').toString().trim();
             const packSize = (row['quy cách'] || '').toString().trim();
             const internalId = (row['số nhận diện'] || '').toString().trim();
             
             // Auto-detect Location: First Letter of Internal ID
             let location = '';
             if (internalId && internalId.length > 0) {
                 const firstChar = internalId.charAt(0).toUpperCase();
                 if (firstChar.match(/[A-Z]/)) location = `Tủ ${firstChar}`;
             }

             const id = generateSlug(name + '_' + (lot || Math.random().toString().substr(2, 5)));
             
             const initial = Number(row['khối lượng chai'] || 0);
             let current = Number(row['lượng còn lại']);
             if (isNaN(current)) current = initial;

             // Unit detection from Pack Size (e.g. "10mg")
             let unit = 'mg';
             const lowerPack = packSize.toLowerCase();
             if (lowerPack.includes('ml')) unit = 'ml';
             else if (lowerPack.includes('g') && !lowerPack.includes('mg')) unit = 'g';

             const standard: ReferenceStandard = {
                 id, name: name.trim(),
                 internal_id: internalId, 
                 location: location,
                 pack_size: packSize,
                 lot_number: lot,
                 contract_ref: (row['hợp đồng dự toán'] || row['hợp đồng'] || '').toString().trim(),
                 
                 // Smart Date Parsing
                 received_date: this.parseSmartDate(row['ngày nhận'] || row['ngày nhận ngày/tháng/năm (-: không thông tin)']),
                 expiry_date: this.parseSmartDate(row['hạn sử dụng'] || row['hạn sử dụng ngày/tháng/năm (/: không hsd -: không thông tin)']),
                 
                 initial_amount: isNaN(initial) ? 0 : initial,
                 current_amount: current,
                 unit: unit,
                 
                 product_code: (row['mã số sản phẩm product code'] || row['product code'] || '').toString().trim(),
                 manufacturer: (row['hãng'] || '').toString().trim(),
                 cas_number: (row['cas number'] || '').toString().trim(),
                 storage_condition: row['điều kiện bảo quản ft (tủ a) ct(tủ b) rt (tủ c) d: trong tối'] || '',
                 storage_status: 'Sẵn sàng',
                 purity: '', 
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
          this.toast.show('Lỗi đọc file Excel: ' + err.message, 'error');
          reject(err);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }
}
