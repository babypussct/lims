
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

// Interface cho dữ liệu xem trước
export interface ImportPreviewItem {
    raw: any; // Dữ liệu thô từ Excel để debug
    parsed: ReferenceStandard; // Dữ liệu đã xử lý
    logs: any[]; // Logs đi kèm
    isValid: boolean;
}

@Injectable({ providedIn: 'root' })
export class StandardService {
  private fb = inject(FirebaseService);
  private toast = inject(ToastService);

  // --- HELPER: SEARCH KEY GENERATOR ---
  private generateSearchKey(std: ReferenceStandard): string {
    const parts = [
      std.name,
      std.chemical_name, // Index chemical name too
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
  private parseExcelDate(val: any): string {
      if (val === null || val === undefined) return '';
      
      const strVal = val.toString().trim();
      if (['-', '/', 'na', 'n/a', 'unknown', ''].includes(strVal.toLowerCase())) return '';

      // 1. Trường hợp là số (Excel Serial Date)
      let serial = NaN;
      if (typeof val === 'number') serial = val;
      else if (/^\d+(\.\d+)?$/.test(strVal)) serial = parseFloat(strVal);

      if (!isNaN(serial) && serial > 10000) {
          const utcDays = Math.floor(serial - 25569);
          const utcValue = utcDays * 86400 * 1000;
          const dateInfo = new Date(utcValue);
          dateInfo.setHours(dateInfo.getHours() + 12);
          return dateInfo.toISOString().split('T')[0];
      }

      // 2. Trường hợp Text (dd/mm/yyyy) - ÉP KIỂU VIỆT NAM
      const parts = strVal.split(/[\/\-\.]/);
      
      if (parts.length >= 3) {
          const p1 = parts[0];
          const p2 = parts[1];
          const p3 = parts[2];

          // Logic cứng: Số đầu tiên luôn là NGÀY
          const day = p1.padStart(2, '0');
          const month = p2.padStart(2, '0');
          let year = p3;
          
          if (year.length === 2) year = '20' + year;
          
          const nDay = Number(day);
          const nMonth = Number(month);
          if (nDay > 31 || nMonth > 12 || nDay === 0 || nMonth === 0) return '';

          return `${year}-${month}-${day}`; 
      }

      return ''; 
  }

  // --- HELPER: LOG PARSER (SMART IMPORT LOGIC) ---
  private parseLogContent(val: any, defaultDate: string): UsageLog | null {
      if (!val) return null;
      const str = val.toString().trim();
      if (!str) return null;

      // Regex Patterns
      // Capture 1: Date string (DD/MM/YY or DD-MM-YYYY)
      const dateRegex = /(?:ng[àa]y|date)?\s*(?:pha\s*ch[ếe])?[:\-\s]*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i;
      // Capture 1: User name
      const userRegex = /(?:ng[ưươ][ờoi]i|user)(?:\s*pha\s*ch[ếe])?\s*[:\-\s]*([^\d\n\r;]+)/i;
      // Capture 1: Amount number (Corrected Regex)
      const amountRegex = /(?:lượng|kl|amount)(?:\s*(?:d[ùu]ng|c[âa]n|used))?[:\s-]*([\d\.,]+)/i;

      // Check if it's a pure number (Shortcut case)
      const isNumberOnly = /^[0-9.,]+$/.test(str);

      // CASE A: Detailed Text (Has specific keywords or structure)
      if (!isNumberOnly && str.length > 5) {
          const amountMatch = str.match(amountRegex);
          const dateMatch = str.match(dateRegex);
          const userMatch = str.match(userRegex);

          let logAmount = 0;
          if (amountMatch) {
              logAmount = parseFloat(amountMatch[1].replace(',', '.'));
          } else {
              // Fallback: Try finding standalone number at end of string if regex failed
              const parts = str.split(/\s+/);
              for (const p of parts.reverse()) {
                  const n = parseFloat(p.replace(',', '.'));
                  if (!isNaN(n)) {
                      logAmount = n;
                      break;
                  }
              }
          }

          if (logAmount > 0) {
              let logDate = defaultDate;
              let logUser = 'Import Data';

              if (dateMatch) {
                  const rawDate = dateMatch[1];
                  const parts = rawDate.split(/[\/\-\.]/);
                  if (parts.length >= 3) {
                      const d = parts[0].padStart(2, '0');
                      const m = parts[1].padStart(2, '0');
                      let y = parts[2];
                      // Logic: 2-digit year "25" -> "2025"
                      if (y.length === 2) y = '20' + y;
                      logDate = `${y}-${m}-${d}`;
                  }
              }

              if (userMatch) {
                  logUser = userMatch[1].trim();
                  // Clean up user string (remove trailing keywords if regex grabbed too much)
                  const splitKeywords = ['lượng', 'kl', 'amount', 'ngày', 'date'];
                  const lowerUser = logUser.toLowerCase();
                  for(const k of splitKeywords) {
                      const idx = lowerUser.indexOf(k);
                      if (idx > 0) {
                          logUser = logUser.substring(0, idx).trim();
                          break; 
                      }
                  }
                  logUser = logUser.replace(/[:\-]+$/, '').trim();
              }

              return {
                  date: logDate,
                  user: logUser,
                  amount_used: logAmount,
                  purpose: 'Import Log'
              };
          }
      }

      // CASE B: Number Only (Data Shortcut)
      // Logic: If only "10", assume Amount=10, Date=ReceivedDate, User=Import
      const cleanNum = parseFloat(str.replace(',', '.'));
      if (!isNaN(cleanNum) && cleanNum > 0) {
           return {
                date: defaultDate, // Fallback to Received Date as requested
                user: 'Import Data',
                amount_used: cleanNum,
                purpose: 'Import Log'
            };
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

  /**
   * Updated to support advanced server-side sorting
   * @param sortOption: 'updated_desc' | 'name_asc' | 'name_desc' | 'received_desc' | 'expiry_asc' | 'expiry_desc'
   */
  async getStandardsPage(
      pageSize: number, 
      lastDoc: QueryDocumentSnapshot | null, 
      searchTerm: string,
      sortOption: string = 'updated_desc'
  ): Promise<StandardsPage> {
    const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'reference_standards');
    let constraints: QueryConstraint[] = [];

    // Prioritize Search if present (requires specific indexes or simple filtering)
    // Note: Firestore limitation - cannot range filter on 'search_key' AND sort by another field easily without Composite Indexes.
    // To keep it simple and cost-effective, if searching, we prioritize search relevance (alphabetical by search_key).
    if (searchTerm) {
      const term = searchTerm.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      constraints.push(where('search_key', '>=', term));
      constraints.push(where('search_key', '<=', term + '\uf8ff'));
      constraints.push(orderBy('search_key'));
    } else {
      // Apply Sort Options (Only when not searching)
      switch (sortOption) {
          case 'name_asc':
              constraints.push(orderBy('name', 'asc'));
              break;
          case 'name_desc':
              constraints.push(orderBy('name', 'desc'));
              break;
          case 'received_desc':
              constraints.push(orderBy('received_date', 'desc'));
              break;
          case 'expiry_asc': // Critical for risk management
              // Filter out empty expiry dates to ensure sorting works correctly
              constraints.push(where('expiry_date', '!=', ''));
              constraints.push(orderBy('expiry_date', 'asc'));
              break;
          case 'expiry_desc':
              constraints.push(orderBy('expiry_date', 'desc'));
              break;
          case 'updated_desc':
          default:
              constraints.push(orderBy('lastUpdated', 'desc'));
              break;
      }
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

  // Deep Delete: Deletes standards AND their sub-collections (logs)
  async deleteAllStandards() {
    const parentColRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards`);
    const parentSnapshot = await getDocs(parentColRef);
    
    let batch = writeBatch(this.fb.db);
    let opCount = 0;
    const MAX_BATCH_SIZE = 400; // Safe limit below 500

    // Loop through each standard
    for (const stdDoc of parentSnapshot.docs) {
        
        // 1. Get Logs Sub-collection
        const logsRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${stdDoc.id}/logs`);
        const logsSnapshot = await getDocs(logsRef);

        // 2. Queue Log Deletions
        for (const logDoc of logsSnapshot.docs) {
            batch.delete(logDoc.ref);
            opCount++;
            
            if (opCount >= MAX_BATCH_SIZE) {
                await batch.commit();
                batch = writeBatch(this.fb.db);
                opCount = 0;
            }
        }

        // 3. Queue Parent Deletion
        batch.delete(stdDoc.ref);
        opCount++;

        if (opCount >= MAX_BATCH_SIZE) {
            await batch.commit();
            batch = writeBatch(this.fb.db);
            opCount = 0;
        }
    }

    // Commit any remaining operations
    if (opCount > 0) {
        await batch.commit();
    }
  }

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

  // --- STEP 1: PARSE EXCEL DATA (NO SAVE) ---
  async parseExcelData(file: File): Promise<ImportPreviewItem[]> {
    const XLSX = await import('xlsx');

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const data = new Uint8Array(e.target.result);
          // CRITICAL: cellDates: false prevents auto-conversion to prevent Timezone issues
          const workbook = XLSX.read(data, { type: 'array', cellDates: false }); 
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          
          // Using { raw: false } ensures we get "25/07/25" text instead of Excel Serial Number if formatted as text
          const rawRows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '', raw: false });
          if (!rawRows || rawRows.length === 0) throw new Error('File rỗng');

          const normalizeKey = (key: string) => key.toString().replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
          const results: ImportPreviewItem[] = [];

          for (const rawRow of rawRows) {
             const row: Record<string, any> = {};
             Object.keys(rawRow).forEach(k => row[normalizeKey(k)] = rawRow[k]);

             // 1. NAME PARSING: Split primary and chemical/other names
             const rawName = row['tên chuẩn'] || '';
             const nameParts = rawName.split(/[\n\r]+/);
             const name = nameParts[0]?.trim();
             const chemicalName = nameParts.length > 1 ? nameParts.slice(1).join(' ').trim() : (row['tên khác'] || row['tên hóa học'] || '').toString().trim();

             if (!name) continue;

             const lot = (row['lot'] || row['số lô lot'] || '').toString().trim();
             
             // 2. PACK SIZE COMBINATION (Columns C & D)
             const rawPackText = (row['quy cách'] || '').toString().trim(); // Column D
             const rawAmount = row['khối lượng chai']; // Column C (can be number or string)
             
             let initial = 0;
             if (rawAmount !== undefined && rawAmount !== null && rawAmount !== '') {
                 // Try parsing C as a number, handle comma decimal
                 const val = parseFloat(rawAmount.toString().replace(',', '.'));
                 if (!isNaN(val)) initial = val;
             } else {
                 // Fallback: Try parsing from Pack Text
                 initial = Number(row['khối lượng chai'] || 0);
             }

             // 3. UNIT DETECTION (Priority: mL > µg > kg > g > mg)
             let unit = 'mg';
             const lowerPack = rawPackText.toLowerCase();
             
             if (lowerPack.includes('ml') || lowerPack.includes('milliliter') || lowerPack.includes('lít')) unit = 'mL';
             else if (lowerPack.includes('µg') || lowerPack.includes('ug') || lowerPack.includes('mcg')) unit = 'µg';
             else if (lowerPack.includes('kg')) unit = 'kg';
             else if (lowerPack.includes('g') && !lowerPack.includes('mg') && !lowerPack.includes('kg')) unit = 'g';
             else unit = 'mg'; // Default

             // Construct final pack size string
             let packSize = rawPackText;
             const packHasNumber = /^[\d.,]+/.test(rawPackText);
             // If Column D (Pack) doesn't start with number, prepend Column C (Amount)
             if (!packHasNumber && initial > 0 && packSize) {
                 packSize = `${initial} ${packSize}`;
             }
             // If Pack is empty, construct from Amount + Unit
             if (!packSize) {
                 packSize = `${initial} ${unit}`;
             }

             const internalId = (row['số nhận diện'] || '').toString().trim();
             
             let current = initial;
             const rawCurrentStr = (row['lượng còn lại'] || '').toString().trim();
             if (rawCurrentStr !== '') {
                 const match = rawCurrentStr.match(/[\d\.]+/); 
                 if (match && !isNaN(parseFloat(match[0]))) current = parseFloat(match[0]);
             }

             let location = '';
             if (internalId && internalId.length > 0) {
                 const firstChar = internalId.charAt(0).toUpperCase();
                 if (firstChar.match(/[A-Z]/)) location = `Tủ ${firstChar}`;
             }

             const id = generateSlug(name + '_' + (lot || Math.random().toString().substr(2, 5)));
             
             // Parse Main Dates
             const receivedDate = this.parseExcelDate(row['ngày nhận']);
             const expiryDate = this.parseExcelDate(row['hạn sử dụng']);

             const standard: ReferenceStandard = {
                 id, name, chemical_name: chemicalName,
                 internal_id: internalId, location: location,
                 pack_size: packSize, lot_number: lot,
                 contract_ref: (row['hợp đồng dự toán'] || row['hợp đồng'] || '').toString().trim(),
                 received_date: receivedDate, expiry_date: expiryDate,
                 initial_amount: isNaN(initial) ? 0 : initial,
                 current_amount: current, unit: unit,
                 product_code: (row['product code'] || '').toString().trim(),
                 manufacturer: (row['hãng'] || '').toString().trim(),
                 cas_number: (row['cas number'] || '').toString().trim(),
                 storage_condition: (row['điều kiện bảo quản'] || '').toString().trim(),
                 storage_status: 'Sẵn sàng', purity: '', 
                 lastUpdated: null // Will set on save
             };
             standard.search_key = this.generateSearchKey(standard);

             // Log Parsing Logic (M-Q)
             const logs: any[] = [];
             const addedLogs = new Set<string>();
             // Default Date Logic: Fallback to Received Date if missing in log
             const logDefaultDate = receivedDate || new Date().toISOString().split('T')[0];

             // Try to find columns "Lần 1", "Lần 2"... or just search keys
             const keys = Object.keys(row);
             
             for (let i = 1; i <= 10; i++) { // Check up to 10 logs
                 // Find key that contains "lần" and the number i
                 const logKey = keys.find(k => k.includes(`lần`) && k.includes(`${i}`));
                 
                 if (logKey && row[logKey]) {
                     const logData = this.parseLogContent(row[logKey], logDefaultDate);
                     if (logData) {
                         const logSignature = `${logData.date}_${logData.user}_${logData.amount_used}`;
                         if (!addedLogs.has(logSignature)) {
                             addedLogs.add(logSignature);
                             logs.push({ ...logData, unit: unit, timestamp: new Date().getTime() + i });
                         }
                     }
                 }
             }

             results.push({
                 raw: { 'Ngày nhận (Gốc)': row['ngày nhận'], 'Hạn dùng (Gốc)': row['hạn sử dụng'] },
                 parsed: standard,
                 logs: logs,
                 isValid: true
             });
          }
          resolve(results);
        } catch (err: any) {
          reject(err);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }

  // --- STEP 2: SAVE IMPORTED DATA ---
  async saveImportedData(data: ImportPreviewItem[]) {
      if (!data || data.length === 0) return;
      
      let batch = writeBatch(this.fb.db);
      let opCount = 0; 
      const MAX_BATCH_SIZE = 400;

      for (const item of data) {
          const stdRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${item.parsed.id}`);
          batch.set(stdRef, { ...item.parsed, lastUpdated: serverTimestamp() });
          opCount++;

          if (item.logs && item.logs.length > 0) {
              for (const log of item.logs) {
                  const logId = `log_${Date.now()}_${Math.floor(Math.random()*1000)}`;
                  const logRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${item.parsed.id}/logs/${logId}`);
                  batch.set(logRef, log);
                  opCount++;
              }
          }

          if (opCount >= MAX_BATCH_SIZE) {
              await batch.commit();
              batch = writeBatch(this.fb.db);
              opCount = 0;
          }
      }

      if (opCount > 0) await batch.commit();
  }
}
