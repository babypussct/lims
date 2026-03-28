import { Injectable, inject } from '@angular/core';
import { FirebaseService } from '../../core/services/firebase.service';
import { AuthService } from '../../core/services/auth.service';
import { 
  doc, collection, writeBatch, serverTimestamp, 
  updateDoc, setDoc, getDocs, deleteDoc, getDoc,
  query, orderBy, runTransaction, limit, startAfter, where, QueryDocumentSnapshot, QueryConstraint, onSnapshot, Unsubscribe
} from 'firebase/firestore';
import { ReferenceStandard, UsageLog, StandardsPage, ImportPreviewItem, ImportUsageLogPreviewItem, StandardRequest, StandardRequestStatus, PurchaseRequest } from '../../core/models/standard.model';
import { ToastService } from '../../core/services/toast.service';
import { generateSlug, getStandardizedAmount } from '../../shared/utils/utils';

@Injectable({ providedIn: 'root' })
export class StandardService {
  private fb = inject(FirebaseService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  // --- HELPER: SEARCH KEY GENERATOR ---
  private generateSearchKey(std: ReferenceStandard): string {
    const parts = [
      std.name,
      std.chemical_name,
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

      // 1. Case Number (Excel Serial Date)
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

      // 2. Case Text (dd/mm/yyyy)
      const parts = strVal.split(/[\/\-\.]/);
      
      if (parts.length >= 3) {
          const p1 = parts[0];
          const p2 = parts[1];
          const p3 = parts[2];

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

  // --- HELPER: LOG PARSER ---
  private parseLogContent(val: any, defaultDate: string): UsageLog | null {
      if (!val) return null;
      const str = val.toString().trim();
      if (!str) return null;

      const dateRegex = /(?:ng[àa]y|date)?\s*(?:pha\s*ch[ếe])?[:\-\s]*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i;
      const userRegex = /(?:ng[ưươ][ờoi]i|user)(?:\s*pha\s*ch[ếe])?\s*[:\-\s]*([^\d\n\r;]+)/i;
      const amountRegex = /(?:lượng|kl|amount)(?:\s*(?:d[ùu]ng|c[âa]n|used))?[:\s-]*([\d\.,]+)/i;

      const isNumberOnly = /^[0-9.,]+$/.test(str);

      // CASE A: Detailed Text
      if (!isNumberOnly && str.length > 5) {
          const amountMatch = str.match(amountRegex);
          const dateMatch = str.match(dateRegex);
          const userMatch = str.match(userRegex);

          let logAmount = 0;
          if (amountMatch) {
              logAmount = parseFloat(amountMatch[1].replace(',', '.'));
          } else {
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
                      if (y.length === 2) y = '20' + y;
                      logDate = `${y}-${m}-${d}`;
                  }
              }

              if (userMatch) {
                  logUser = userMatch[1].trim();
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

      // CASE B: Number Only
      const cleanNum = parseFloat(str.replace(',', '.'));
      if (!isNaN(cleanNum) && cleanNum > 0) {
           return {
                date: defaultDate,
                user: 'Import Data',
                amount_used: cleanNum,
                purpose: 'Import Log'
            };
      }

      return null;
  }

  // --- READ Operations ---
  
  listenToAllStandards(callback: (items: ReferenceStandard[]) => void): Unsubscribe {
      const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'reference_standards');
      const q = query(colRef, orderBy('received_date', 'desc')); 
      
      return onSnapshot(q, (snapshot) => {
          const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ReferenceStandard));
          callback(items);
      }, (error) => {
          console.error("Error listening to standards:", error);
          this.toast.show('Lỗi kết nối dữ liệu chuẩn.', 'error');
      });
  }

  async getNearestExpiry(): Promise<ReferenceStandard | null> {
      try {
          const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'reference_standards');
          const q = query(colRef, where('expiry_date', '!=', ''), orderBy('expiry_date', 'asc'), limit(1));
          const snapshot = await getDocs(q);
          return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as ReferenceStandard;
      } catch (e: any) { return null; }
  }

  async getStandardsPage(
      pageSize: number, 
      lastDoc: QueryDocumentSnapshot | null, 
      searchTerm: string,
      sortOption = 'received_desc'
  ): Promise<StandardsPage> {
    const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'reference_standards');
    const constraints: QueryConstraint[] = [];

    if (searchTerm) {
      const term = searchTerm.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      constraints.push(where('search_key', '>=', term));
      constraints.push(where('search_key', '<=', term + '\uf8ff'));
      constraints.push(orderBy('search_key'));
    } else {
      switch (sortOption) {
          case 'name_asc': constraints.push(orderBy('name', 'asc')); break;
          case 'name_desc': constraints.push(orderBy('name', 'desc')); break;
          case 'received_desc': constraints.push(orderBy('received_date', 'desc')); break;
          case 'expiry_asc': 
              constraints.push(where('expiry_date', '!=', ''));
              constraints.push(orderBy('expiry_date', 'asc')); 
              break;
          case 'expiry_desc':
              constraints.push(where('expiry_date', '!=', ''));
              constraints.push(orderBy('expiry_date', 'desc'));
              break;
          case 'updated_desc': constraints.push(orderBy('lastUpdated', 'desc')); break;
          default: constraints.push(orderBy('received_date', 'desc')); break;
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
      const BATCH_SIZE = 400;
      let batch = writeBatch(this.fb.db);
      let opCount = 0;

      for (const id of ids) {
          const logsRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${id}/logs`);
          const logsSnapshot = await getDocs(logsRef);
          
          for (const logDoc of logsSnapshot.docs) {
              batch.delete(logDoc.ref);
              opCount++;
              if (opCount >= BATCH_SIZE) { await batch.commit(); batch = writeBatch(this.fb.db); opCount = 0; }
          }

          const stdRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${id}`);
          batch.delete(stdRef);
          opCount++;
          if (opCount >= BATCH_SIZE) { await batch.commit(); batch = writeBatch(this.fb.db); opCount = 0; }
      }

      if (opCount > 0) await batch.commit();
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

          const stdData = stdDoc.data() as ReferenceStandard;
          const currentAmount = stdData.current_amount || 0;
          const stockUnit = stdData.unit || 'mg';
          const usageUnit = log.unit || stockUnit;

          const amountToDeduct = getStandardizedAmount(log.amount_used, usageUnit, stockUnit);
          if (amountToDeduct === null) throw new Error(`Không thể quy đổi từ ${usageUnit} sang ${stockUnit}`);

          const newAmount = currentAmount - amountToDeduct;
          if (newAmount < 0) throw new Error(`Không đủ lượng tồn kho!`);

          const updateData: any = { current_amount: newAmount, lastUpdated: serverTimestamp() };
          if (newAmount <= 0) {
              updateData.status = 'DEPLETED';
          }

          transaction.update(stdRef, updateData);
          transaction.set(newLogRef, log);

          // If the standard is currently linked to a request, update the request's usage logs
          if (stdData.current_request_id) {
              const reqRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_requests/${stdData.current_request_id}`);
              const reqDoc = await transaction.get(reqRef);
              if (reqDoc.exists()) {
                  const reqData = reqDoc.data() as StandardRequest;
                  const currentLogs = reqData.usageLogs || [];
                  transaction.update(reqRef, {
                      usageLogs: [...currentLogs, log],
                      totalAmountUsed: (reqData.totalAmountUsed || 0) + amountToDeduct,
                      updatedAt: Date.now()
                  });
              }
          }
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

          const newStock = currentStock + amountToRestore;
          const updateData: any = { current_amount: newStock, lastUpdated: serverTimestamp() };
          if (stdData['status'] === 'DEPLETED' && newStock > 0) {
              updateData.status = 'AVAILABLE';
          }

          transaction.delete(logRef);
          transaction.update(stdRef, updateData);

          if (stdData['current_request_id']) {
              const reqRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_requests/${stdData['current_request_id']}`);
              const reqDoc = await transaction.get(reqRef);
              if (reqDoc.exists()) {
                  const reqData = reqDoc.data() as StandardRequest;
                  const currentLogs = reqData.usageLogs || [];
                  const updatedLogs = currentLogs.filter(l => l.id !== logId);
                  transaction.update(reqRef, {
                      usageLogs: updatedLogs,
                      totalAmountUsed: Math.max(0, (reqData.totalAmountUsed || 0) - amountToRestore),
                      updatedAt: Date.now()
                  });
              }
          }
      });
  }

  // --- GLOBAL LOGGING ---
  private async logGlobalActivity(action: string, details: string, targetId?: string) {
      const logRef = doc(collection(this.fb.db, `artifacts/${this.fb.APP_ID}/logs`));
      await setDoc(logRef, {
          id: logRef.id,
          action,
          details,
          timestamp: serverTimestamp(),
          user: this.auth.currentUser()?.displayName || 'Hệ thống',
          targetId
      });
  }

  // --- REQUEST WORKFLOW ---
  async createRequest(request: StandardRequest, isAssign: boolean = false) {
      const reqRef = doc(collection(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_requests`));
      request.id = reqRef.id;
      request.createdAt = Date.now();
      request.updatedAt = Date.now();
      await setDoc(reqRef, request);
      
      if (isAssign) {
          await this.logGlobalActivity('ASSIGN_STANDARD', `Gán chuẩn: ${request.standardName} cho ${request.requestedByName}`, request.id);
      } else {
          await this.logGlobalActivity('REQUEST_STANDARD', `Yêu cầu chuẩn: ${request.standardName}`, request.id);
      }
  }

  async updateRequestStatus(requestId: string, status: StandardRequestStatus, updates: Partial<StandardRequest> = {}) {
      const reqRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_requests/${requestId}`);
      await updateDoc(reqRef, { status, ...updates, updatedAt: Date.now() });
      
      const reqDoc = await getDoc(reqRef);
      if (reqDoc.exists()) {
          const reqData = reqDoc.data() as StandardRequest;
          let action = 'UPDATE_STANDARD_REQUEST';
          let details = `Cập nhật yêu cầu: ${reqData.standardName} -> ${status}`;
          if (status === 'REJECTED') {
              action = 'REJECT_STANDARD_REQUEST';
              details = `Từ chối yêu cầu: ${reqData.standardName}`;
          } else if (status === 'PENDING_RETURN') {
              action = 'REPORT_RETURN_STANDARD';
              details = `Báo cáo trả chuẩn: ${reqData.standardName}`;
          }
          await this.logGlobalActivity(action, details, requestId);
      }
  }

  async dispenseStandard(requestId: string, standardId: string, approverId: string, approverName: string, isAssign: boolean = false) {
      const stdRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${standardId}`);
      const reqRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_requests/${requestId}`);
      let reqData: StandardRequest | null = null;

      await runTransaction(this.fb.db, async (transaction) => {
          const stdDoc = await transaction.get(stdRef);
          const reqDoc = await transaction.get(reqRef);
          
          if (!stdDoc.exists()) throw new Error("Chuẩn không tồn tại!");
          if (!reqDoc.exists()) throw new Error("Yêu cầu không tồn tại!");
          
          const stdData = stdDoc.data();
          if (stdData['status'] === 'IN_USE' || stdData['status'] === 'DEPLETED') {
              throw new Error("Chuẩn đang được sử dụng hoặc đã hết!");
          }

          reqData = reqDoc.data() as StandardRequest;

          transaction.update(stdRef, { 
              status: 'IN_USE', 
              current_holder: reqData.requestedByName,
              current_holder_uid: reqData.requestedBy,
              current_request_id: requestId,
              lastUpdated: serverTimestamp() 
          });

          transaction.update(reqRef, { 
              status: 'IN_PROGRESS',
              approvedBy: approverId,
              approvedByName: approverName,
              approvalDate: Date.now(),
              updatedAt: Date.now()
          });
      });

      if (reqData && !isAssign) {
          await this.logGlobalActivity('APPROVE_STANDARD_REQUEST', `Duyệt cấp chuẩn: ${(reqData as StandardRequest).standardName}`, requestId);
      }
  }

  async returnStandard(requestId: string, standardId: string, receiverId: string, receiverName: string, isDepleted = false, amountUsed?: number, unit?: string) {
      const stdRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${standardId}`);
      const reqRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_requests/${requestId}`);
      let reqData: StandardRequest | null = null;

      await runTransaction(this.fb.db, async (transaction) => {
          const stdDoc = await transaction.get(stdRef);
          const reqDoc = await transaction.get(reqRef);
          
          if (!stdDoc.exists()) throw new Error("Chuẩn không tồn tại!");
          if (!reqDoc.exists()) throw new Error("Yêu cầu không tồn tại!");

          const stdData = stdDoc.data() as ReferenceStandard;
          reqData = reqDoc.data() as StandardRequest;

          let newAmount = stdData.current_amount || 0;
          const finalAmountUsed = amountUsed !== undefined ? amountUsed : (reqData.totalAmountUsed || 0);
          const finalUnit = unit || stdData.unit || 'mg';

          if (finalAmountUsed > 0) {
              const stockUnit = stdData.unit || 'mg';
              const amountToDeduct = getStandardizedAmount(finalAmountUsed, finalUnit, stockUnit);
              if (amountToDeduct === null) throw new Error(`Không thể quy đổi từ ${finalUnit} sang ${stockUnit}`);
              newAmount -= amountToDeduct;
              if (newAmount < 0) throw new Error(`Không đủ lượng tồn kho!`);
          }

          transaction.update(stdRef, { 
              status: isDepleted ? 'DEPLETED' : 'AVAILABLE', 
              current_amount: newAmount,
              current_holder: null,
              current_holder_uid: null,
              current_request_id: null,
              lastUpdated: serverTimestamp() 
          });

          transaction.update(reqRef, { 
              status: 'COMPLETED',
              totalAmountUsed: finalAmountUsed,
              returnDate: Date.now(),
              receivedBy: receiverId,
              receivedByName: receiverName,
              updatedAt: Date.now()
          });
      });

      if (reqData) {
          await this.logGlobalActivity('RETURN_STANDARD', `Nhận lại chuẩn: ${(reqData as StandardRequest).standardName}`, requestId);
      }

      // Also record the usage log
      const finalAmountUsed = amountUsed !== undefined ? amountUsed : ((await getDoc(reqRef)).data() as StandardRequest).totalAmountUsed || 0;
      const finalUnit = unit || ((await getDoc(stdRef)).data() as ReferenceStandard).unit || 'mg';
      if (finalAmountUsed > 0 && reqData) {
          const req = reqData as StandardRequest;
          const logsRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${standardId}/logs`);
          const newLogRef = doc(logsRef);
          await setDoc(newLogRef, {
              timestamp: Date.now(),
              action: 'USED',
              user_uid: req.requestedBy,
              user_name: req.requestedByName,
              amount_used: finalAmountUsed,
              unit: finalUnit,
              purpose: req.purpose || 'Sử dụng theo yêu cầu'
          });
      }
  }

  listenToRequests(callback: (requests: StandardRequest[]) => void) {
      const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'standard_requests');
      const q = query(colRef, orderBy('createdAt', 'desc'));
      return onSnapshot(q, (snapshot) => {
          callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as StandardRequest)));
      });
  }

  // --- EXCEL PARSER ---
  async parseExcelData(file: File): Promise<ImportPreviewItem[]> {
    const XLSX = await import('xlsx');
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array', cellDates: false }); 
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const rawRows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '', raw: false });
          if (!rawRows || rawRows.length === 0) throw new Error('File rỗng');

          const normalizeKey = (key: string) => key.toString().replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
          const results: ImportPreviewItem[] = [];

          for (const rawRow of rawRows) {
             const row: Record<string, any> = {};
             Object.keys(rawRow).forEach(k => row[normalizeKey(k)] = rawRow[k]);

             const rawName = row['tên chuẩn'] || '';
             const nameParts = rawName.split(/[\n\r]+/);
             const name = nameParts[0]?.trim();
             const chemicalName = nameParts.length > 1 ? nameParts.slice(1).join(' ').trim() : (row['tên khác'] || row['tên hóa học'] || '').toString().trim();

             if (!name) continue;

             const lot = (row['lot'] || row['số lô lot'] || '').toString().trim();
             
             const rawPackText = (row['quy cách'] || '').toString().trim(); 
             const rawAmount = row['khối lượng chai'];
             
             let initial = 0;
             if (rawAmount !== undefined && rawAmount !== null && rawAmount !== '') {
                 const val = parseFloat(rawAmount.toString().replace(',', '.'));
                 if (!isNaN(val)) initial = val;
             } else {
                 initial = Number(row['khối lượng chai'] || 0);
             }

             let unit = 'mg';
             const lowerPack = rawPackText.toLowerCase();
             if (lowerPack.includes('ml') || lowerPack.includes('milliliter') || lowerPack.includes('lít')) unit = 'mL';
             else if (lowerPack.includes('µg') || lowerPack.includes('ug') || lowerPack.includes('mcg')) unit = 'µg';
             else if (lowerPack.includes('kg')) unit = 'kg';
             else if (lowerPack.includes('g') && !lowerPack.includes('mg') && !lowerPack.includes('kg')) unit = 'g';
             else unit = 'mg';

             let packSize = rawPackText;
             const packHasNumber = /^[\d.,]+/.test(rawPackText);
             if (!packHasNumber && initial > 0 && packSize) { packSize = `${initial} ${packSize}`; }
             if (!packSize) { packSize = `${initial} ${unit}`; }

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
                 status: current <= 0 ? 'DEPLETED' : 'AVAILABLE',
                 lastUpdated: null 
             };
             standard.search_key = this.generateSearchKey(standard);

             const logs: any[] = [];
             const addedLogs = new Set<string>();
             const logDefaultDate = receivedDate || new Date().toISOString().split('T')[0];
             const keys = Object.keys(row);
             
             for (let i = 1; i <= 10; i++) { 
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
                 parsed: standard, logs: logs, isValid: true
             });
          }
          resolve(results);
        } catch (err: any) { reject(err); }
      };
      reader.readAsArrayBuffer(file);
    });
  }

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

          if (opCount >= MAX_BATCH_SIZE) { await batch.commit(); batch = writeBatch(this.fb.db); opCount = 0; }
      }
      if (opCount > 0) await batch.commit();
  }

  // --- USAGE LOG EXCEL PARSER ---
  async parseUsageLogExcelData(file: File): Promise<ImportUsageLogPreviewItem[]> {
    const XLSX = await import('xlsx');
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e: any) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array', cellDates: false }); 
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const rawRows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '', raw: false });
          if (!rawRows || rawRows.length === 0) throw new Error('File rỗng');

          const normalizeKey = (key: string) => key.toString().replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
          const results: ImportUsageLogPreviewItem[] = [];
          
          // Fetch all existing standards to match against
          const existingStandards = await this.getAllStandardsForMatching();
          const logsCache = new Map<string, UsageLog[]>(); // Cache logs per standard ID

          for (const rawRow of rawRows) {
             const row: Record<string, any> = {};
             Object.keys(rawRow).forEach(k => row[normalizeKey(k)] = rawRow[k]);

             const rawName = row['tên chuẩn'] || '';
             const nameParts = rawName.split(/[\n\r]+/);
             const name = nameParts[0]?.trim();

             if (!name) continue;

             const lot = (row['lot'] || row['số lô lot'] || '').toString().trim();
             const internalId = (row['số nhận diện'] || '').toString().trim();
             
             // Match standard
             let matchedStandard: ReferenceStandard | null = null;
             if (internalId) {
                 matchedStandard = existingStandards.find(s => s.internal_id === internalId) || null;
             }
             if (!matchedStandard && name && lot) {
                 matchedStandard = existingStandards.find(s => s.name.toLowerCase() === name.toLowerCase() && s.lot_number === lot) || null;
             }

             // Parse Usage Log Data
             const prepDateRaw = row['ngày pha chế'] || row['ngày sử dụng'] || '';
             const preparer = (row['người pha chế'] || row['người sử dụng'] || '').toString().trim();
             const amountUsedRaw = row['lượng dùng'] || row['khối lượng dùng'] || '';
             
             const prepDate = this.parseExcelDate(prepDateRaw);
             let amountUsed = 0;
             if (amountUsedRaw !== undefined && amountUsedRaw !== null && amountUsedRaw !== '') {
                 const val = parseFloat(amountUsedRaw.toString().replace(',', '.'));
                 if (!isNaN(val)) amountUsed = val;
             }

             let isValid = true;
             let errorMessage = '';

             if (!matchedStandard) {
                 isValid = false;
                 errorMessage = 'Không tìm thấy chất chuẩn tương ứng trong hệ thống.';
             } else if (!prepDate) {
                 isValid = false;
                 errorMessage = 'Ngày pha chế không hợp lệ.';
             } else if (!preparer) {
                 isValid = false;
                 errorMessage = 'Thiếu người pha chế.';
             } else if (amountUsed <= 0) {
                 isValid = false;
                 errorMessage = 'Lượng dùng không hợp lệ.';
             }

             const log: UsageLog = {
                 date: prepDate || new Date().toISOString().split('T')[0],
                 user: preparer,
                 amount_used: amountUsed,
                 unit: matchedStandard ? matchedStandard.unit : 'mg', // Default to standard's unit
                 timestamp: new Date().getTime()
             };

             let isDuplicate = false;
             if (matchedStandard && isValid) {
                 // Fetch existing logs for this standard to check for duplicates if not cached
                 if (!logsCache.has(matchedStandard.id!)) {
                     const logsRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${matchedStandard.id}/logs`);
                     const snapshot = await getDocs(logsRef);
                     const logs = snapshot.docs.map(doc => doc.data() as UsageLog);
                     logsCache.set(matchedStandard.id!, logs);
                 }
                 
                 const existingLogs = logsCache.get(matchedStandard.id!) || [];
                 const duplicate = existingLogs.find(l => l.date === log.date && l.user === log.user && l.amount_used === log.amount_used);
                 
                 if (duplicate) {
                     isDuplicate = true;
                     isValid = false;
                     errorMessage = 'Nhật ký đã tồn tại.';
                 } else {
                     // Add to cache to detect duplicates within the same file
                     existingLogs.push(log);
                     logsCache.set(matchedStandard.id!, existingLogs);
                 }
             }

             results.push({
                 raw: { 'Tên': name, 'Lô': lot, 'Ngày': prepDateRaw, 'Người': preparer, 'Lượng': amountUsedRaw },
                 standard: matchedStandard,
                 log: log,
                 isDuplicate: isDuplicate,
                 isValid: isValid,
                 errorMessage: errorMessage
             });
          }
          resolve(results);
        } catch (err: any) { reject(err); }
      };
      reader.readAsArrayBuffer(file);
    });
  }

  private async getAllStandardsForMatching(): Promise<ReferenceStandard[]> {
      const standardsRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards`);
      const snapshot = await getDocs(standardsRef);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ReferenceStandard));
  }

  async saveImportedUsageLogs(data: ImportUsageLogPreviewItem[]) {
      if (!data || data.length === 0) return;
      
      const validItems = data.filter(item => item.isValid && !item.isDuplicate && item.standard);
      if (validItems.length === 0) return;

      let batch = writeBatch(this.fb.db);
      let opCount = 0;
      const MAX_BATCH_SIZE = 400;

      // Group logs by standard ID to calculate total amount to deduct
      const logsByStandard = new Map<string, { standard: ReferenceStandard, logs: UsageLog[] }>();

      for (const item of validItems) {
          const stdId = item.standard!.id;
          if (!logsByStandard.has(stdId)) {
              logsByStandard.set(stdId, { standard: item.standard!, logs: [] });
          }
          logsByStandard.get(stdId)!.logs.push(item.log);
      }

      for (const [stdId, { standard, logs }] of logsByStandard.entries()) {
          const stdRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${stdId}`);
          let totalAmountDeducted = 0;

          for (const log of logs) {
              const logsCollRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${stdId}/logs`);
              const logRef = doc(logsCollRef);
              batch.set(logRef, log);
              opCount++;

              // Calculate deduction based on unit
              const deduction = getStandardizedAmount(log.amount_used, log.unit || 'mg', standard.unit);
              if (deduction !== null) {
                  totalAmountDeducted += deduction;
              }
          }

          // Update standard's current amount
          const newAmount = Math.max(0, standard.current_amount - totalAmountDeducted);
          const updateData: any = { current_amount: newAmount, lastUpdated: serverTimestamp() };
          if (newAmount <= 0) {
              updateData.status = 'DEPLETED';
          }
          batch.update(stdRef, updateData);
          opCount++;

          if (opCount >= MAX_BATCH_SIZE) { await batch.commit(); batch = writeBatch(this.fb.db); opCount = 0; }
      }

      if (opCount > 0) await batch.commit();
  }

  // --- PURCHASE REQUESTS ---
  async createPurchaseRequest(req: Partial<PurchaseRequest>) {
      const id = doc(collection(this.fb.db, 'artifacts')).id; // Random ID
      const newReq: PurchaseRequest = {
          ...req,
          id,
          requestDate: Date.now(),
          status: 'PENDING'
      } as PurchaseRequest;

      const reqRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/purchase_requests/${id}`);
      const stdRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${req.standardId}`);

      await runTransaction(this.fb.db, async (transaction) => {
          transaction.set(reqRef, newReq);
          transaction.update(stdRef, { restock_requested: true, lastUpdated: serverTimestamp() });
      });
      return id;
  }

  listenToPendingPurchaseRequests(callback: (count: number) => void): Unsubscribe {
      const reqRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/purchase_requests`);
      const q = query(reqRef, where('status', '==', 'PENDING'));
      return onSnapshot(q, (snapshot) => {
          callback(snapshot.size);
      });
  }

  async completePurchaseRequest(reqId: string, stdId: string) {
      const batch = writeBatch(this.fb.db);
      
      const reqRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/purchase_requests/${reqId}`);
      batch.update(reqRef, { 
          status: 'COMPLETED',
          processedDate: Date.now()
      });

      // Reset restock_requested on standard
      const stdRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${stdId}`);
      batch.update(stdRef, { restock_requested: false, lastUpdated: serverTimestamp() });

      await batch.commit();
  }
}
