
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

  // --- HELPER: SEARCH KEY GENERATOR ---
  private generateSearchKey(std: ReferenceStandard): string {
    const parts = [
      std.name,
      std.internal_id,
      std.cas_number,
      std.product_code,
      std.lot_number,
      std.manufacturer,
      std.id
    ];
    
    return parts
      .filter(p => p)
      .join(' ')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // --- HELPER: ROBUST EXCEL DATE PARSER ---
  // Xử lý triệt để Serial Number và Text dd/mm/yyyy
  private parseExcelDate(val: any): string {
      if (val === null || val === undefined) return '';
      
      const strVal = val.toString().trim();
      if (['-', '/', 'na', 'n/a', 'unknown', ''].includes(strVal.toLowerCase())) return '';

      // 1. Trường hợp là số (Excel Serial Date)
      // Excel đếm ngày từ 30/12/1899. 
      // Nếu input là số hoặc chuỗi số (VD: 45817)
      let serial = NaN;
      if (typeof val === 'number') serial = val;
      else if (/^\d+(\.\d+)?$/.test(strVal)) serial = parseFloat(strVal);

      if (!isNaN(serial) && serial > 10000) {
          // Tính toán ngày từ Serial Number
          // 25569 là chênh lệch ngày giữa 1970-01-01 và 1900-01-01
          // * 86400 * 1000 để ra milliseconds
          const utcDays = Math.floor(serial - 25569);
          const utcValue = utcDays * 86400 * 1000;
          const dateInfo = new Date(utcValue);

          // Do lỗi lệch múi giờ khi chuyển đổi, ta cộng thêm 12h để đảm bảo nằm giữa ngày
          // Điều này giúp tránh việc 00:00:00 bị lùi về 23:00:00 ngày hôm trước
          dateInfo.setHours(dateInfo.getHours() + 12);
          
          return dateInfo.toISOString().split('T')[0];
      }

      // 2. Trường hợp Text (dd/mm/yyyy, dd-mm-yyyy, dd.mm.yyyy)
      // Ép kiểu cứng: [0]=Ngày, [1]=Tháng
      const parts = strVal.split(/[\/\-\.]/);
      
      if (parts.length >= 3) {
          const day = parts[0].padStart(2, '0');
          const month = parts[1].padStart(2, '0');
          let year = parts[2];
          
          // Xử lý năm 2 số (25 -> 2025)
          if (year.length === 2) year = '20' + year;
          
          // Validate cơ bản
          const nDay = Number(day);
          const nMonth = Number(month);
          if (nDay > 31 || nMonth > 12 || nDay === 0 || nMonth === 0) return '';

          return `${year}-${month}-${day}`; // Format ISO cho Firestore
      }

      return ''; 
  }

  // --- HELPER: LOG PARSER ---
  private parseUsageLogString(val: any, defaultDate: string): UsageLog | null {
      if (val === null || val === undefined || val === '') return null;
      const str = val.toString().trim();
      if (!str) return null;

      // Case A: Chuỗi đầy đủ (Multi-line text từ phần mềm cũ hoặc ghi chú tay)
      // "Ngày pha chế: 15/10/2025..."
      const dateMatch = str.match(/ng[àa]y\s*pha\s*ch[ếe]:\s*([\d\/\-\.]+)/i);
      const userMatch = str.match(/ng[ưươ][ờoi]i\s*pha\s*ch[ếe]:\s*([^\n\r]+)/i); 
      const amountMatch = str.match(/l[ưượng\s*d[ùu]ng:\s*([\d\.]+)/i);

      if (amountMatch) {
          const amountRaw = parseFloat(amountMatch[1].trim());
          if (!isNaN(amountRaw)) {
              let logDate = defaultDate;
              // Nếu trong log text có ngày cụ thể, ưu tiên dùng nó
              if (dateMatch && dateMatch[1]) {
                  const parsedLogDate = this.parseExcelDate(dateMatch[1].trim());
                  if (parsedLogDate) logDate = parsedLogDate;
              }

              return {
                  date: logDate,
                  user: userMatch ? userMatch[1].trim() : 'Unknown',
                  amount_used: amountRaw,
                  purpose: 'Import Log'
              };
          }
      }

      // Case B: Chỉ là số lượng (VD: "30.75" hoặc "30,75")
      // Loại bỏ các ký tự không phải số và dấu chấm/phẩy
      // Chuyển phẩy thành chấm để parse
      const cleanStr = str.replace(/,/g, '.').replace(/[^\d\.-]/g, '');
      
      if (cleanStr && !isNaN(parseFloat(cleanStr))) { 
          const amount = parseFloat(cleanStr);
          if (amount > 0) { // Chỉ nhận nếu lượng > 0
              return {
                  date: defaultDate, 
                  user: 'Import Data',
                  amount_used: amount,
                  purpose: 'Import Log'
              };
          }
      }

      return null;
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
      const term = searchTerm.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      constraints.push(where('search_key', '>=', term));
      constraints.push(where('search_key', '<=', term + '\uf8ff'));
      constraints.push(orderBy('search_key'));
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
      std.search_key = this.generateSearchKey(std);
      const ref = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${std.id}`);
      await setDoc(ref, { ...std, lastUpdated: serverTimestamp() });
  }

  async updateStandard(std: ReferenceStandard) {
      std.search_key = this.generateSearchKey(std);
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

  // --- SMART IMPORT LOGIC (STRICT DATE & DEDUPLICATION) ---
  async importFromExcel(file: File) {
    const XLSX = await import('xlsx');

    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e: any) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          
          // Sử dụng header: 1 để lấy dòng đầu tiên làm mảng tiêu đề, giúp xử lý chính xác chỉ mục cột
          const rawRows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
          if (!rawRows || rawRows.length === 0) throw new Error('File rỗng');

          let batch = writeBatch(this.fb.db);
          let opCount = 0; 
          const MAX_BATCH_SIZE = 400;

          const normalizeKey = (key: string) => key.toString().replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();

          for (const rawRow of rawRows) {
             const row: Record<string, any> = {};
             // Map key sạch
             Object.keys(rawRow).forEach(k => row[normalizeKey(k)] = rawRow[k]);

             const name = row['tên chuẩn'];
             if (!name) continue;

             const lot = (row['lot'] || row['số lô lot'] || '').toString().trim();
             const packSize = (row['quy cách'] || '').toString().trim();
             const internalId = (row['số nhận diện'] || '').toString().trim();
             
             // --- LOGIC 1: INITIAL AMOUNT ---
             const initial = Number(row['khối lượng chai'] || 0);
             
             // --- LOGIC 2: CURRENT AMOUNT (Source of Truth from Excel) ---
             let current = initial;
             const rawCurrentStr = (row['lượng còn lại'] || '').toString().trim();
             
             if (rawCurrentStr !== '') {
                 const match = rawCurrentStr.match(/[\d\.]+/); 
                 if (match) {
                     const parsed = parseFloat(match[0]);
                     if (!isNaN(parsed)) current = parsed;
                 }
             }

             // --- LOGIC 3: LOCATION ---
             let location = '';
             if (internalId && internalId.length > 0) {
                 const firstChar = internalId.charAt(0).toUpperCase();
                 if (firstChar.match(/[A-Z]/)) location = `Tủ ${firstChar}`;
             }

             const id = generateSlug(name + '_' + (lot || Math.random().toString().substr(2, 5)));
             
             // --- LOGIC 4: UNIT DETECTION ---
             let unit = 'mg';
             const lowerPack = packSize.toLowerCase();
             if (lowerPack.includes('ml')) unit = 'mL';
             else if (lowerPack.includes('g') && !lowerPack.includes('mg')) unit = 'g';
             else if (lowerPack.includes('µg') || lowerPack.includes('ug') || lowerPack.includes('mcg')) unit = 'µg';

             // --- LOGIC 5: STRICT DATE PARSING (NEW) ---
             // Cột ngày nhận, hạn sử dụng
             const receivedDate = this.parseExcelDate(row['ngày nhận']);
             const expiryDate = this.parseExcelDate(row['hạn sử dụng']);

             const standard: ReferenceStandard = {
                 id, name: name.trim(),
                 internal_id: internalId, 
                 location: location,
                 pack_size: packSize, 
                 lot_number: lot,
                 contract_ref: (row['hợp đồng dự toán'] || row['hợp đồng'] || '').toString().trim(),
                 
                 received_date: receivedDate,
                 expiry_date: expiryDate,
                 
                 initial_amount: isNaN(initial) ? 0 : initial,
                 current_amount: current, 
                 unit: unit,
                 
                 product_code: (row['product code'] || '').toString().trim(),
                 manufacturer: (row['hãng'] || '').toString().trim(),
                 cas_number: (row['cas number'] || '').toString().trim(),
                 storage_condition: (row['điều kiện bảo quản'] || '').toString().trim(),
                 storage_status: 'Sẵn sàng',
                 purity: '', 
                 lastUpdated: serverTimestamp()
             };

             standard.search_key = this.generateSearchKey(standard);

             const stdRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${id}`);
             batch.set(stdRef, standard);
             opCount++;

             // --- LOGIC 6: USAGE LOGS DEDUPLICATION (NEW) ---
             // Set để lưu chữ ký (Signature) của các log đã thêm trong dòng này
             const addedLogs = new Set<string>();
             const logDefaultDate = receivedDate || new Date().toISOString().split('T')[0];

             for (let i = 1; i <= 5; i++) {
                 const colName = `lần cân ${i}`;
                 const cellValue = row[colName];
                 
                 if (cellValue) {
                     const logData = this.parseUsageLogString(cellValue, logDefaultDate);
                     
                     if (logData) {
                         // Tạo chữ ký: Ngày + Người + Lượng
                         // Mục đích: Nếu Excel bị copy paste 3 cột giống hệt nhau, chỉ lấy 1.
                         const logSignature = `${logData.date}_${logData.user}_${logData.amount_used}`;
                         
                         if (!addedLogs.has(logSignature)) {
                             addedLogs.add(logSignature); // Đánh dấu đã thêm

                             const logId = `log_${i}_${Date.now()}`; 
                             const logRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${id}/logs/${logId}`);
                             
                             batch.set(logRef, {
                                 ...logData,
                                 unit: unit, 
                                 timestamp: new Date().getTime() + i
                             });
                             opCount++;
                         }
                     }
                 }
             }

             if (opCount >= MAX_BATCH_SIZE) {
                 await batch.commit();
                 batch = writeBatch(this.fb.db);
                 opCount = 0;
             }
          }

          if (opCount > 0) {
              await batch.commit();
          }
          
          this.toast.show(`Đã import dữ liệu thành công!`, 'success');
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
