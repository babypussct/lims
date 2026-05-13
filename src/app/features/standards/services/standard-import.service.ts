import { Injectable, inject } from '@angular/core';
import { FirebaseService } from '../../../core/services/firebase.service';
import {
  doc, collection, getDocs, setDoc, updateDoc, writeBatch,
  serverTimestamp, increment
} from 'firebase/firestore';
import { ReferenceStandard, UsageLog, ImportPreviewItem, ImportUsageLogPreviewItem } from '../../../core/models/standard.model';
import { generateSlug, parseQuantityInput, getStandardizedAmount } from '../../../shared/utils/utils';
import { StandardCacheService } from './standard-cache.service';
import { StandardCrudService } from './standard-crud.service';

/**
 * StandardImportService — Import dữ liệu từ Excel.
 *
 * Bao gồm: parse file Excel chuẩn và nhật ký sử dụng,
 * preview trước khi lưu, batch-save vào Firestore.
 */
@Injectable({ providedIn: 'root' })
export class StandardImportService {
  private fb = inject(FirebaseService);
  private cache = inject(StandardCacheService);
  private crud = inject(StandardCrudService);

  // ─── Excel Date Parser ────────────────────────────────────────────────────────
  parseExcelDate(val: unknown): string {
    if (val === null || val === undefined) return '';
    const strVal = String(val).trim();
    if (['-', '/', 'na', 'n/a', 'unknown', ''].includes(strVal.toLowerCase())) return '';

    let serial = NaN;
    if (typeof val === 'number') serial = val;
    else if (/^\d+(\.\d+)?$/.test(strVal)) serial = parseFloat(strVal);

    if (!isNaN(serial) && serial > 10000) {
      const dateInfo = new Date(Math.round((serial - 25569) * 86400 * 1000));
      return dateInfo.toISOString().split('T')[0];
    }

    const parts = strVal.split(/[\/\-\.]/);
    if (parts.length >= 3) {
      let day, month, year;
      if (parts[0].length === 4) {
        year = parts[0]; month = parts[1].padStart(2, '0'); day = parts[2].padStart(2, '0');
      } else {
        day = parts[0].padStart(2, '0'); month = parts[1].padStart(2, '0'); year = parts[2];
        if (year.length === 2) year = '20' + year;
      }
      const nDay = Number(day); const nMonth = Number(month);
      if (nDay > 31 || nMonth > 12 || nDay === 0 || nMonth === 0) return '';
      return `${year}-${month}-${day}`;
    }
    return '';
  }

  // ─── Log Content Parser ───────────────────────────────────────────────────────
  private parseLogContent(val: unknown, defaultDate: string): UsageLog | null {
    if (!val) return null;
    const str = String(val).trim();
    if (!str) return null;

    const dateRegex = /(?:ng[àa]y|date)?\s*(?:pha\s*ch[ếe])?[:\-\s]*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i;
    const userRegex = /(?:ng[ưươ][ờoi]i|user)(?:\s*pha\s*ch[ếe])?\s*[:\-\s]*([^\d\n\r;]+)/i;
    const amountRegex = /(?:lượng|kl|amount)(?:\s*(?:d[ùu]ng|c[âa]n|used))?[:\s-]*([\d\.,]+)/i;
    const isNumberOnly = /^[0-9.,]+$/.test(str);

    if (!isNumberOnly && str.length > 5) {
      const amountMatch = str.match(amountRegex);
      const dateMatch = str.match(dateRegex);
      const userMatch = str.match(userRegex);

      let logAmount = 0;
      if (amountMatch) {
        logAmount = parseFloat(amountMatch[1].replace(',', '.'));
      } else {
        const words = str.split(/\s+/);
        for (const p of words.reverse()) {
          const n = parseFloat(p.replace(',', '.'));
          if (!isNaN(n)) { logAmount = n; break; }
        }
      }

      if (logAmount > 0) {
        let logDate = defaultDate;
        let logUser = 'Import Data';
        if (dateMatch) {
          const rawDate = dateMatch[1];
          const dp = rawDate.split(/[\/\-\.]/);
          if (dp.length >= 3) {
            const d = dp[0].padStart(2, '0'); const m = dp[1].padStart(2, '0');
            let y = dp[2]; if (y.length === 2) y = '20' + y;
            logDate = `${y}-${m}-${d}`;
          }
        }
        if (userMatch) {
          logUser = userMatch[1].trim();
          const splitKeywords = ['lượng', 'kl', 'amount', 'ngày', 'date'];
          const lowerUser = logUser.toLowerCase();
          for (const k of splitKeywords) {
            const idx = lowerUser.indexOf(k);
            if (idx > 0) { logUser = logUser.substring(0, idx).trim(); break; }
          }
          logUser = logUser.replace(/[:\-]+$/, '').trim();
        }
        return { date: logDate, user: logUser, amount_used: logAmount, purpose: 'Import Log' };
      }
    }

    const cleanNum = parseFloat(str.replace(',', '.'));
    if (!isNaN(cleanNum) && cleanNum > 0) {
      return { date: defaultDate, user: 'Import Data', amount_used: cleanNum, purpose: 'Import Log' };
    }
    return null;
  }

  // ─── Parse Standards Excel ────────────────────────────────────────────────────
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
          const getVal = (row: any, aliases: string[]) => {
            const keys = Object.keys(row);
            const found = keys.find(k => aliases.some(a => k === a || k.includes(a)));
            return found ? row[found] : undefined;
          };
          const results: ImportPreviewItem[] = [];
          const seenIds = new Map<string, number>();

          for (const rawRow of rawRows) {
            const row: Record<string, any> = {};
            Object.keys(rawRow).forEach(k => row[normalizeKey(k)] = rawRow[k]);

            const rawName = getVal(row, ['tên chuẩn', 'tên hóa học']) || '';
            const nameParts = rawName.toString().split(/[\n\r]+/);
            const name = nameParts[0]?.trim();
            if (!name) continue;

            const chemicalName = nameParts.length > 1 ? nameParts.slice(1).join(' ').trim() : (getVal(row, ['tên khác', 'tên hóa học']) || '').toString().trim();
            const lot = (getVal(row, ['lot', 'số lô lot', 'lô']) || '').toString().trim();
            const rawPackText = (getVal(row, ['quy cách', 'đóng gói']) || '').toString().trim();
            const rawAmount = getVal(row, ['khối lượng chai', 'kl chai', 'khối lượng', 'lượng']);

            let initial = 0; let unit = 'mg';
            if (rawAmount !== undefined && rawAmount !== null && rawAmount !== '') {
              const parsed = parseQuantityInput(rawAmount.toString(), 'mg');
              if (parsed !== null) initial = parsed;
              const unitMatch = rawAmount.toString().match(/[a-zA-Zµ]+/);
              if (unitMatch) unit = unitMatch[0];
            }

            const lowerPack = rawPackText.toLowerCase();
            if (lowerPack.includes('ml') || lowerPack.includes('lít')) unit = 'mL';
            else if (lowerPack.includes('µg') || lowerPack.includes('ug') || lowerPack.includes('mcg')) unit = 'µg';
            else if (lowerPack.includes('kg')) unit = 'kg';
            else if (lowerPack.includes('g') && !lowerPack.includes('mg') && !lowerPack.includes('kg')) unit = 'g';

            if (initial === 0) {
              const fallback = parseFloat((getVal(row, ['khối lượng chai', 'kl chai']) || '').toString().replace(',', '.'));
              if (!isNaN(fallback)) initial = fallback;
            }

            let packSize = rawPackText;
            if (!/^[\d.,]+/.test(rawPackText) && initial > 0 && packSize) packSize = `${initial} ${packSize}`;
            if (!packSize) packSize = `${initial} ${unit}`;

            const internalId = (getVal(row, ['số nhận diện', 'mã chuẩn', 'mã nhận diện']) || '').toString().trim();
            let current = initial;
            const rawCurrentStr = (getVal(row, ['lượng còn lại', 'tồn kho', 'hiện tại']) || '').toString().trim();
            if (rawCurrentStr !== '') {
              const m = rawCurrentStr.match(/[\d\.]+/);
              if (m && !isNaN(parseFloat(m[0]))) current = parseFloat(m[0]);
            }

            let location = (getVal(row, ['vị trí', 'nơi để']) || '').toString().trim();
            const storageCondition = (getVal(row, ['điều kiện bảo quản', 'bảo quản']) || '').toString().trim();
            if (!location && storageCondition) {
              const lower = storageCondition.toLowerCase();
              if (lower.includes('ft') || lower.includes('đông') || lower.includes('-20')) location = 'Tủ A';
              else if (lower.includes('ct') || lower.includes('mát') || lower.includes('2-8')) location = 'Tủ B';
              else if (lower.includes('rt') || lower.includes('thường')) location = 'Tủ C';
            }

            let idStr = name;
            if (lot) idStr += '_' + lot;
            if (internalId) idStr += '_' + internalId;
            if (!lot && !internalId) idStr += '_' + Math.random().toString().substr(2, 5);
            let id = generateSlug(idStr);
            if (seenIds.has(id)) { const cnt = seenIds.get(id)! + 1; seenIds.set(id, cnt); id = `${id}_${cnt}`; }
            else seenIds.set(id, 1);

            const receivedDate = this.parseExcelDate(getVal(row, ['ngày nhận', 'ngày nhập']));
            const expiryDate = this.parseExcelDate(getVal(row, ['hạn sử dụng', 'hạn dùng']));

            const standard: ReferenceStandard = {
              id, name, chemical_name: chemicalName, internal_id: internalId, location,
              pack_size: packSize, lot_number: lot,
              contract_ref: (getVal(row, ['hợp đồng dự toán', 'hợp đồng', 'dự toán']) || '').toString().trim(),
              received_date: receivedDate, expiry_date: expiryDate,
              initial_amount: isNaN(initial) ? 0 : initial, current_amount: current, unit,
              product_code: (getVal(row, ['product code', 'mã sản phẩm']) || '').toString().trim(),
              manufacturer: (getVal(row, ['hãng', 'nhà sản xuất']) || '').toString().trim(),
              cas_number: (getVal(row, ['cas number', 'số cas']) || '').toString().trim(),
              storage_condition: storageCondition, storage_status: 'Sẵn sàng', purity: '',
              status: current <= 0 ? 'DEPLETED' : 'AVAILABLE', lastUpdated: null
            };
            standard.search_key = this.crud.generateSearchKey(standard);

            const logs: any[] = [];
            const addedLogs = new Set<string>();
            const logDefaultDate = receivedDate || new Date().toISOString().split('T')[0];
            const keys = Object.keys(row);
            for (let i = 1; i <= 20; i++) {
              const logKey = keys.find(k => k.includes(`lần`) && k.includes(`${i}`));
              if (logKey && row[logKey]) {
                const logData = this.parseLogContent(row[logKey], logDefaultDate);
                if (logData) {
                  const sig = `${logData.date}_${logData.user}_${logData.amount_used}`;
                  if (!addedLogs.has(sig)) {
                    addedLogs.add(sig);
                    logs.push({ ...logData, unit, timestamp: Date.now() + i });
                  }
                }
              }
            }
            results.push({ raw: {}, parsed: standard, logs, isValid: true });
          }
          resolve(results);
        } catch (err: any) { reject(err); }
      };
      reader.readAsArrayBuffer(file);
    });
  }

  async saveImportedData(data: ImportPreviewItem[]): Promise<void> {
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
          const logId = `log_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
          const logRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${item.parsed.id}/logs/${logId}`);
          log.id = logId; log.standardId = item.parsed.id; log.standardName = item.parsed.name;
          log.lotNumber = item.parsed.lot_number; log.cas_number = item.parsed.cas_number;
          log.internalId = item.parsed.internal_id; log.manufacturer = item.parsed.manufacturer;
          batch.set(logRef, log);
          const globalLogRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_usages/${logId}`);
          batch.set(globalLogRef, { ...log, lastUpdated: serverTimestamp() });
          opCount += 2;
        }
      }
      if (opCount >= MAX_BATCH_SIZE) { await batch.commit(); batch = writeBatch(this.fb.db); opCount = 0; }
    }
    if (opCount > 0) await batch.commit();
    await this.fb.updateMetadata('standards');
    this.cache.invalidateLocalStandardsCache();
  }

  // ─── Parse Usage Log Excel ────────────────────────────────────────────────────
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
          const getVal = (row: any, aliases: string[]) => {
            const keys = Object.keys(row);
            const found = keys.find(k => aliases.some(a => k === a || k.includes(a)));
            return found ? row[found] : undefined;
          };

          const existingStandards = this.cache._memStandards !== null && this.cache._memStandards.length > 0
            ? this.cache._memStandards
            : this.cache.getAllStandardsFromCache();
          const logsCache = new Map<string, UsageLog[]>();
          const results: ImportUsageLogPreviewItem[] = [];

          for (const rawRow of rawRows) {
            const row: Record<string, any> = {};
            Object.keys(rawRow).forEach(k => row[normalizeKey(k)] = rawRow[k]);

            const rawName = getVal(row, ['tên chuẩn', 'tên chất', 'chuẩn']) || '';
            const nameParts = rawName.toString().split(/[\n\r]+/);
            const name = nameParts[0]?.trim();
            if (!name) continue;

            const lot = (getVal(row, ['lot', 'số lô lot', 'lô']) || '').toString().trim();
            const internalId = (getVal(row, ['số nhận diện', 'mã chuẩn', 'mã nhận diện']) || '').toString().trim();

            let matchedStandard: ReferenceStandard | null = null;
            if (internalId) matchedStandard = existingStandards.find(s => s.internal_id === internalId) || null;
            if (!matchedStandard && name && lot) {
              matchedStandard = existingStandards.find(s => s.name.toLowerCase() === name.toLowerCase() && s.lot_number === lot) || null;
            }

            const prepDateRaw = getVal(row, ['ngày pha chế', 'ngày sử dụng', 'ngày pha', 'date', 'ngày']);
            const preparer = (getVal(row, ['người pha chế', 'người sử dụng', 'người pha', 'nhân viên', 'user', 'người']) || '').toString().trim();
            const amountUsedRaw = getVal(row, ['lượng dùng', 'khối lượng dùng', 'lượng', 'khối lượng', 'kl dùng', 'lượng cân']);
            const unitRaw = getVal(row, ['đơn vị', 'unit']) || '';

            const prepDate = this.parseExcelDate(prepDateRaw);
            let amountUsed = 0;
            let usageUnit = matchedStandard ? matchedStandard.unit : 'mg';

            if (amountUsedRaw !== undefined && amountUsedRaw !== null && amountUsedRaw !== '') {
              const targetUnit = matchedStandard ? matchedStandard.unit : 'mg';
              const parsed = parseQuantityInput(amountUsedRaw.toString(), targetUnit);
              if (parsed !== null) {
                amountUsed = parsed;
                const unitMatch = amountUsedRaw.toString().match(/[a-zA-Zµ]+/);
                if (unitMatch) usageUnit = unitMatch[0];
              } else {
                const val = parseFloat(amountUsedRaw.toString().replace(',', '.'));
                if (!isNaN(val)) amountUsed = val;
              }
            }
            if (unitRaw) usageUnit = unitRaw.toString().trim();

            let isValid = true; let errorMessage = '';
            if (!matchedStandard) { isValid = false; errorMessage = 'Không tìm thấy chất chuẩn tương ứng trong hệ thống.'; }
            else if (!prepDate) { isValid = false; errorMessage = 'Ngày pha chế không hợp lệ.'; }
            else if (!preparer) { isValid = false; errorMessage = 'Thiếu người pha chế.'; }
            else if (amountUsed <= 0) { isValid = false; errorMessage = 'Lượng dùng không hợp lệ.'; }

            const log: UsageLog = {
              date: prepDate || new Date().toISOString().split('T')[0],
              user: preparer, amount_used: amountUsed, unit: usageUnit, purpose: 'Import Log',
              timestamp: Date.now(),
              standardId: matchedStandard?.id, standardName: matchedStandard?.name,
              lotNumber: matchedStandard?.lot_number, cas_number: matchedStandard?.cas_number,
              internalId: matchedStandard?.internal_id, manufacturer: matchedStandard?.manufacturer
            };

            let isDuplicate = false;
            if (matchedStandard && isValid) {
              if (!logsCache.has(matchedStandard.id!)) {
                const logsRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${matchedStandard.id}/logs`);
                const snap = await getDocs(logsRef);
                logsCache.set(matchedStandard.id!, snap.docs.map(d => d.data() as UsageLog));
              }
              const existingLogs = logsCache.get(matchedStandard.id!) || [];
              const duplicate = existingLogs.find(l => l.date === log.date && l.user === log.user && l.amount_used === log.amount_used);
              if (duplicate) { isDuplicate = true; isValid = false; errorMessage = 'Nhật ký đã tồn tại.'; }
              else { existingLogs.push(log); logsCache.set(matchedStandard.id!, existingLogs); }
            }
            results.push({ raw: { 'Tên': name, 'Lô': lot }, standard: matchedStandard, log, isDuplicate, isValid, errorMessage });
          }
          resolve(results);
        } catch (err: any) { reject(err); }
      };
      reader.readAsArrayBuffer(file);
    });
  }

  async saveImportedUsageLogs(data: ImportUsageLogPreviewItem[]): Promise<void> {
    if (!data || data.length === 0) return;
    const validItems = data.filter(item => item.isValid && !item.isDuplicate && item.standard);
    if (validItems.length === 0) return;

    let batch = writeBatch(this.fb.db);
    let opCount = 0;
    const MAX_BATCH_SIZE = 400;
    const logsByStandard = new Map<string, { standard: ReferenceStandard; logs: UsageLog[] }>();
    for (const item of validItems) {
      const stdId = item.standard!.id;
      if (!logsByStandard.has(stdId)) logsByStandard.set(stdId, { standard: item.standard!, logs: [] });
      logsByStandard.get(stdId)!.logs.push(item.log);
    }

    for (const [stdId, { standard, logs }] of logsByStandard.entries()) {
      const stdRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${stdId}`);
      let totalAmountDeducted = 0;
      for (const log of logs) {
        const logsCollRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${stdId}/logs`);
        const logRef = doc(logsCollRef);
        log.id = logRef.id;
        batch.set(logRef, log);
        const globalLogRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_usages/${logRef.id}`);
        batch.set(globalLogRef, { ...log, lastUpdated: serverTimestamp() });
        opCount += 2;
        const deduction = getStandardizedAmount(log.amount_used, log.unit || 'mg', standard.unit);
        if (deduction !== null) totalAmountDeducted += deduction;
      }
      batch.update(stdRef, { current_amount: increment(-totalAmountDeducted), lastUpdated: serverTimestamp() });
      opCount++;
      if (opCount >= MAX_BATCH_SIZE) { await batch.commit(); batch = writeBatch(this.fb.db); opCount = 0; }
    }
    if (opCount > 0) await batch.commit();
  }
}
