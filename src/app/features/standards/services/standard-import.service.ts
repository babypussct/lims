import { Injectable, inject } from '@angular/core';
import { FirebaseService } from '../../../core/services/firebase.service';
import { AuthService } from '../../../core/services/auth.service';
import {
  doc, collection, getDocs, getDoc, writeBatch,
  serverTimestamp, runTransaction
} from 'firebase/firestore';
import { ReferenceStandard, UsageLog, ImportPreviewItem, ImportUsageLogPreviewItem } from '../../../core/models/standard.model';
import { generateSlug, UNIT_DATA } from '../../../shared/utils/utils';
import { normalizeStandardUnit, parseStandardQuantity } from '../../../shared/utils/standard-amount';
import { parseStandardDate } from '../../../shared/utils/standard-fefo';
import { ProgressService } from '../../../core/services/progress.service';
import { StandardCacheService } from './standard-cache.service';
import { StandardCrudService } from './standard-crud.service';

/**
 * StandardImportService — Import dữ liệu từ Excel.
 *
 * Bao gồm: parse tệp Excel chuẩn và nhật ký sử dụng,
 * preview trước khi lưu, batch-save vào Firestore.
 */
@Injectable({ providedIn: 'root' })
export class StandardImportService {
  private fb = inject(FirebaseService);
  private auth = inject(AuthService);
  private cache = inject(StandardCacheService);
  private crud = inject(StandardCrudService);
  private progressService = inject(ProgressService);

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
      const result = dateInfo.toISOString().split('T')[0];
      return parseStandardDate(result) === null ? '' : result;
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
      const result = `${year}-${month}-${day}`;
      return parseStandardDate(result) === null ? '' : result;
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
        let logUser = 'Dữ liệu nhập từ tệp';
        if (dateMatch) {
          const rawDate = dateMatch[1];
          const dp = rawDate.split(/[\/\-\.]/);
          if (dp.length >= 3) {
            const d = dp[0].padStart(2, '0'); const m = dp[1].padStart(2, '0');
            let y = dp[2]; if (y.length === 2) y = '20' + y;
            logDate = this.parseExcelDate(`${y}-${m}-${d}`) || defaultDate;
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
        return { date: logDate, user: logUser, amount_used: logAmount, purpose: 'Nhật ký nhập từ tệp' };
      }
    }

    const cleanNum = parseFloat(str.replace(',', '.'));
    if (!isNaN(cleanNum) && cleanNum > 0) {
      return { date: defaultDate, user: 'Dữ liệu nhập từ tệp', amount_used: cleanNum, purpose: 'Nhật ký nhập từ tệp' };
    }
    return null;
  }

  // ─── Parse Standards Excel ────────────────────────────────────────────────────
  async parseExcelData(file: File): Promise<ImportPreviewItem[]> {
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
          const results: ImportPreviewItem[] = [];
          const seenIds = new Map<string, number>();
          const cachedStandards = this.cache._memStandards?.length
            ? this.cache._memStandards
            : this.cache.getAllStandardsFromCache();
          const existingIds = new Set(cachedStandards.map(item => item.id));

          for (const [rowIndex, rawRow] of rawRows.entries()) {
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

            const lowerPack = rawPackText.toLowerCase();
            let packUnit = 'mg';
            if (lowerPack.includes('ml') || lowerPack.includes('lít')) packUnit = 'ml';
            else if (lowerPack.includes('µg') || lowerPack.includes('ug') || lowerPack.includes('mcg')) packUnit = 'µg';
            else if (lowerPack.includes('kg')) packUnit = 'kg';
            else if (lowerPack.includes('g') && !lowerPack.includes('mg') && !lowerPack.includes('kg')) packUnit = 'g';

            let initial = 0;
            let unit = packUnit;
            let quantityError = '';
            if (rawAmount !== undefined && rawAmount !== null && rawAmount !== '') {
              const unitMatch = rawAmount.toString().match(/[a-zA-ZµμÀ-ỹ]+/u);
              const detectedUnit = unitMatch ? normalizeStandardUnit(unitMatch[0]) : packUnit;
              const targetUnit = UNIT_DATA[detectedUnit] ? detectedUnit : packUnit;
              const parsed = parseStandardQuantity(rawAmount, targetUnit);
              if (parsed) {
                initial = parsed.normalizedAmount;
                unit = parsed.normalizedUnit;
              } else {
                quantityError = 'Khối lượng ban đầu hoặc đơn vị không hợp lệ.';
              }
            }

            let packSize = rawPackText;
            if (!/^[\d.,]+/.test(rawPackText) && initial > 0 && packSize) packSize = `${initial} ${packSize}`;
            if (!packSize) packSize = `${initial} ${unit}`;

            const internalId = (getVal(row, ['số nhận diện', 'mã chuẩn', 'mã nhận diện']) || '').toString().trim();
            let current = initial;
            const rawCurrentStr = (getVal(row, ['lượng còn lại', 'tồn kho', 'hiện tại']) || '').toString().trim();
            if (rawCurrentStr !== '') {
              const parsedCurrent = parseStandardQuantity(rawCurrentStr, unit);
              if (parsedCurrent) current = parsedCurrent.normalizedAmount;
              else quantityError = quantityError || 'Lượng còn lại hoặc đơn vị không hợp lệ.';
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
            if (!lot && !internalId) idStr += `_row_${rowIndex + 2}`;
            let id = generateSlug(idStr);
            if (!id) id = `standard_row_${rowIndex + 2}`;
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
                    logs.push({
                      ...logData,
                      unit,
                      normalized_amount: logData.amount_used,
                      normalized_unit: unit,
                      timestamp: (parseStandardDate(logData.date) || Date.now()) + i
                    });
                  }
                }
              }
            }
            results.push({
              raw: rawRow,
              parsed: standard,
              logs,
              isValid: !quantityError && Number.isFinite(initial) && initial >= 0 && Number.isFinite(current) && current >= 0,
              errorMessage: quantityError || (
                !Number.isFinite(initial) || initial < 0 || !Number.isFinite(current) || current < 0
                  ? 'Số lượng phải là số không âm.'
                  : undefined
              ),
              mode: existingIds.has(standard.id) ? 'UPDATE_SAFE' : 'CREATE'
            });
          }
          resolve(results);
        } catch (err: any) { reject(err); }
      };
      reader.readAsArrayBuffer(file);
    });
  }

  async saveImportedData(data: ImportPreviewItem[]): Promise<void> {
    const validItems = (data || []).filter(item => item.isValid);
    if (validItems.length === 0) return;
    if (!this.auth.canEditStandards()) throw new Error('Bạn không có quyền nhập danh mục chuẩn.');

    // Preflight every deterministic id before the first write. Re-imports never overwrite stock/workflow.
    const existing = new Map<string, ReferenceStandard>();
    for (let offset = 0; offset < validItems.length; offset += 20) {
      const chunk = validItems.slice(offset, offset + 20);
      const snapshots = await Promise.all(chunk.map(item => getDoc(
        doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${item.parsed.id}`)
      )));
      snapshots.forEach(snapshot => {
        if (snapshot.exists()) existing.set(snapshot.id, { id: snapshot.id, ...snapshot.data() } as ReferenceStandard);
      });
    }

    const conflicts = validItems.filter(item => {
      const current = existing.get(item.parsed.id);
      if (!current) return false;
      return current.status === 'IN_USE' || Boolean(
        current.current_holder || current.current_holder_uid ||
        current.current_request_id || current.has_pending_request
      );
    });
    if (conflicts.length) {
      conflicts.forEach(item => {
        item.mode = 'CONFLICT';
        item.errorMessage = 'Lô đang có quy trình mượn và trả nên không thể nhập dữ liệu, nhằm bảo toàn số lượng tồn.';
      });
      throw new Error(`Có ${conflicts.length} lô đang được mượn hoặc chờ duyệt. Không có dữ liệu nào được ghi.`);
    }

    this.progressService.start('Đang lưu chất chuẩn đối chiếu', 'Vui lòng không đóng trình duyệt', validItems.length);
    let batch = writeBatch(this.fb.db);
    let opCount = 0;
    const MAX_BATCH_SIZE = 400;
    let processed = 0;
    const ensureCapacity = async (needed: number) => {
      if (opCount + needed <= MAX_BATCH_SIZE) return;
      if (opCount > 0) await batch.commit();
      batch = writeBatch(this.fb.db);
      opCount = 0;
    };

    try {
      for (const item of validItems) {
        processed++;
        this.progressService.update(processed, `Đang xử lý dòng ${processed}/${validItems.length}`);
        const stdRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${item.parsed.id}`);
        const current = existing.get(item.parsed.id);
        await ensureCapacity(1);

        if (current) {
          item.mode = 'UPDATE_SAFE';
          const safeMetadata: Partial<ReferenceStandard> = {
            name: item.parsed.name,
            chemical_name: item.parsed.chemical_name,
            internal_id: item.parsed.internal_id,
            cas_number: item.parsed.cas_number,
            product_code: item.parsed.product_code,
            purity: item.parsed.purity,
            manufacturer: item.parsed.manufacturer,
            pack_size: item.parsed.pack_size,
            lot_number: item.parsed.lot_number,
            location: item.parsed.location,
            storage_condition: item.parsed.storage_condition,
            received_date: item.parsed.received_date,
            expiry_date: item.parsed.expiry_date,
            contract_ref: item.parsed.contract_ref,
            search_key: item.parsed.search_key
          };
          batch.set(stdRef, { ...safeMetadata, lastUpdated: serverTimestamp() }, { merge: true });
          opCount++;
          continue;
        }

        item.mode = 'CREATE';
        batch.set(stdRef, { ...item.parsed, _isDeleted: false, lastUpdated: serverTimestamp() });
        opCount++;
        for (const rawLog of item.logs || []) {
          await ensureCapacity(2);
          const logRef = doc(collection(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${item.parsed.id}/logs`));
          const log: UsageLog = {
            ...rawLog,
            id: logRef.id,
            unit: rawLog.unit || item.parsed.unit,
            normalized_amount: rawLog.normalized_amount ?? rawLog.amount_used,
            normalized_unit: rawLog.normalized_unit || item.parsed.unit,
            standardId: item.parsed.id,
            standardName: item.parsed.name,
            lotNumber: item.parsed.lot_number,
            cas_number: item.parsed.cas_number,
            internalId: item.parsed.internal_id,
            manufacturer: item.parsed.manufacturer,
            _isDeleted: false
          };
          batch.set(logRef, log);
          batch.set(
            doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_usages/${logRef.id}`),
            { ...log, lastUpdated: serverTimestamp() }
          );
          opCount += 2;
        }
      }
      if (opCount > 0) await batch.commit();
      await this.fb.updateMetadata('standards');
      this.cache.invalidateLocalStandardsCache();
      this.progressService.complete();
    } catch (err) {
      this.progressService.stop();
      throw err;
    }
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

          let existingStandards = this.cache._memStandards !== null && this.cache._memStandards.length > 0
            ? this.cache._memStandards
            : this.cache.getAllStandardsFromCache();
          if (existingStandards.length === 0) existingStandards = await this.cache.fetchAllAndCache();
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
            let normalizedAmount: number | null = null;

            if (amountUsedRaw !== undefined && amountUsedRaw !== null && amountUsedRaw !== '') {
              const targetUnit = matchedStandard ? matchedStandard.unit : 'mg';
              const rawText = amountUsedRaw.toString().trim();
              const hasInlineUnit = /[a-zA-ZµμÀ-ỹ]/u.test(rawText);
              const quantityText = hasInlineUnit ? rawText : `${rawText} ${unitRaw || targetUnit}`;
              const parsed = parseStandardQuantity(quantityText, targetUnit);
              if (parsed) {
                amountUsed = parsed.amount;
                usageUnit = parsed.unit;
                normalizedAmount = parsed.normalizedAmount;
              }
            }

            let isValid = true; let errorMessage = '';
            if (!matchedStandard) { isValid = false; errorMessage = 'Không tìm thấy chất chuẩn tương ứng trong hệ thống.'; }
            else if (!prepDate) { isValid = false; errorMessage = 'Ngày pha chế không hợp lệ.'; }
            else if (!preparer) { isValid = false; errorMessage = 'Thiếu người pha chế.'; }
            else if (amountUsed <= 0 || normalizedAmount === null) { isValid = false; errorMessage = 'Lượng dùng hoặc đơn vị không hợp lệ.'; }

            const log: UsageLog = {
              date: prepDate || new Date().toISOString().split('T')[0],
              user: preparer,
              amount_used: amountUsed,
              unit: usageUnit,
              normalized_amount: normalizedAmount ?? undefined,
              normalized_unit: matchedStandard?.unit,
              purpose: 'Nhật ký nhập từ tệp',
              timestamp: (parseStandardDate(prepDate) || Date.now()) + results.length,
              standardId: matchedStandard?.id, standardName: matchedStandard?.name,
              lotNumber: matchedStandard?.lot_number, cas_number: matchedStandard?.cas_number,
              internalId: matchedStandard?.internal_id, manufacturer: matchedStandard?.manufacturer
            };

            let isDuplicate = false;
            if (matchedStandard && isValid) {
              if (!logsCache.has(matchedStandard.id!)) {
                const logsRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${matchedStandard.id}/logs`);
                const snap = await getDocs(logsRef);
                logsCache.set(
                  matchedStandard.id!,
                  snap.docs.map(d => d.data() as UsageLog).filter(existingLog => !existingLog._isDeleted)
                );
              }
              const existingLogs = logsCache.get(matchedStandard.id!) || [];
              const duplicate = existingLogs.find(existingLog => {
                const existingNormalized = existingLog.normalized_unit === matchedStandard!.unit && Number.isFinite(existingLog.normalized_amount)
                  ? Number(existingLog.normalized_amount)
                  : parseStandardQuantity(`${existingLog.amount_used} ${existingLog.unit || matchedStandard!.unit}`, matchedStandard!.unit)?.normalizedAmount;
                return existingLog.date === log.date &&
                  existingLog.user.trim().toLowerCase() === log.user.trim().toLowerCase() &&
                  existingNormalized !== undefined && normalizedAmount !== null &&
                  Math.abs(existingNormalized - normalizedAmount) < 1e-9;
              });
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
    if (!this.auth.canEditStandards()) throw new Error('Bạn không có quyền nhập nhật ký sử dụng chuẩn.');
    const validItems = data.filter(item => item.isValid && !item.isDuplicate && item.standard);
    if (validItems.length === 0) return;

    const logsByStandard = new Map<string, { standard: ReferenceStandard; logs: UsageLog[] }>();
    for (const item of validItems) {
      const stdId = item.standard!.id;
      if (!logsByStandard.has(stdId)) logsByStandard.set(stdId, { standard: item.standard!, logs: [] });
      logsByStandard.get(stdId)!.logs.push(item.log);
    }
    
    this.progressService.start('Đang lưu Nhật Ký Sử Dụng', 'Vui lòng không đóng trình duyệt', logsByStandard.size);
    let processed = 0;

    try {
      for (const [stdId, { standard, logs }] of logsByStandard.entries()) {
        processed++;
        this.progressService.update(processed, `Đang xử lý ${logs.length} log của ${standard.name}`);
        const stdRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${stdId}`);
        for (let offset = 0; offset < logs.length; offset += 100) {
          const chunk = logs.slice(offset, offset + 100).map(log => {
            const normalized = log.normalized_unit === standard.unit && Number.isFinite(log.normalized_amount)
              ? Number(log.normalized_amount)
              : parseStandardQuantity(`${log.amount_used} ${log.unit || standard.unit}`, standard.unit)?.normalizedAmount;
            if (normalized === undefined || normalized <= 0) {
              throw new Error(`Nhật ký ngày ${log.date} có lượng hoặc đơn vị không hợp lệ.`);
            }
            const amountToken = String(normalized).replace('-', 'neg_').replace('.', '_decimal_');
            const signature = generateSlug(`${log.date}_${log.user}_${amountToken}_${standard.unit}`).slice(0, 160);
            const id = `import_${signature}`;
            return {
              log: {
                ...log,
                id,
                standardId: stdId,
                standardName: standard.name,
                lotNumber: standard.lot_number,
                cas_number: standard.cas_number,
                internalId: standard.internal_id,
                manufacturer: standard.manufacturer,
                normalized_amount: normalized,
                normalized_unit: standard.unit,
                _isDeleted: false
              } as UsageLog,
              normalized,
              localRef: doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${stdId}/logs/${id}`)
            };
          });

          await runTransaction(this.fb.db, async transaction => {
            const stdDoc = await transaction.get(stdRef);
            if (!stdDoc.exists()) throw new Error(`Chuẩn ${standard.name} không còn tồn tại.`);
            const freshStandard = { id: stdDoc.id, ...stdDoc.data() } as ReferenceStandard;
            if (
              freshStandard.status === 'IN_USE' || freshStandard.current_request_id ||
              freshStandard.current_holder || freshStandard.has_pending_request
            ) {
              throw new Error(`Chất chuẩn ${freshStandard.name} đang có quy trình mượn và trả nên không thể nhập nhật ký.`);
            }

            // Read all deterministic log ids before any write to make retries/re-imports idempotent.
            const existingLogDocs = await Promise.all(chunk.map(entry => transaction.get(entry.localRef)));
            const accepted = chunk.filter((_, index) => !existingLogDocs[index].exists());
            if (accepted.length === 0) return;

            const totalDeducted = accepted.reduce((sum, entry) => sum + entry.normalized, 0);
            const newAmount = (freshStandard.current_amount || 0) - totalDeducted;
            if (newAmount < -1e-9) {
              throw new Error(
                `Không đủ tồn kho cho ${freshStandard.name}: cần ${totalDeducted} ${freshStandard.unit}, ` +
                `chỉ còn ${freshStandard.current_amount || 0} ${freshStandard.unit}.`
              );
            }

            const earliestDate = accepted
              .map(entry => entry.log.date)
              .filter(Boolean)
              .sort()[0];
            const stdUpdates: Record<string, any> = {
              current_amount: Math.max(0, newAmount),
              status: newAmount <= 0 ? 'DEPLETED' : (freshStandard.status || 'AVAILABLE'),
              lastUpdated: serverTimestamp()
            };
            if (earliestDate && (!freshStandard.date_opened || earliestDate < freshStandard.date_opened)) {
              stdUpdates['date_opened'] = earliestDate;
            }
            transaction.update(stdRef, stdUpdates);

            accepted.forEach(entry => {
              transaction.set(entry.localRef, entry.log);
              transaction.set(
                doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_usages/${entry.log.id}`),
                { ...entry.log, lastUpdated: serverTimestamp() }
              );
            });
          });
        }
      }
      await this.fb.updateMetadata('standards');
      this.cache.invalidateLocalStandardsCache();
      this.progressService.complete();
    } catch (err) {
      this.progressService.stop();
      throw err;
    }
  }
}
