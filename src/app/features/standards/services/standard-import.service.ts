import { Injectable, inject } from '@angular/core';
import { FirebaseService } from '../../../core/services/firebase.service';
import { AuthService } from '../../../core/services/auth.service';
import {
  doc, collection, getDocs, getDoc, writeBatch,
  serverTimestamp, runTransaction, query, where
} from 'firebase/firestore';
import { ReferenceStandard, UsageLog, ImportPreviewItem, ImportUsageLogPreviewItem } from '../../../core/models/standard.model';
import { generateSlug } from '../../../shared/utils/utils';
import { parseStandardQuantity } from '../../../shared/utils/standard-amount';
import { canAutoReleaseExpiredStandard, parseStandardDate } from '../../../shared/utils/standard-fefo';
import { ProgressService } from '../../../core/services/progress.service';
import { StandardCacheService } from './standard-cache.service';
import { StandardCrudService } from './standard-crud.service';
import { StandardCodeRegistryService } from './standard-code-registry.service';
import { isValidInternalId, normalizeInternalId } from '../../../shared/utils/standard-internal-id';
import {
  STANDARD_IMPORT_MAX_ATOMIC_WRITES,
  buildSafeImportMetadata,
  computeImportChanges,
  countAtomicStandardImportWrites,
  isActiveStandardIdentity,
  parseExcelDateDetailed,
  parseStandardImportRows,
  validateStandardImportFile
} from './standard-import.utils';

export interface StandardImportSaveResult {
  created: number;
  updated: number;
  restored: number;
  skippedInvalid: number;
  skippedLogs: number;
}

export interface StandardImportWorkbookPreview {
  sheetNames: string[];
  selectedSheet: string;
  items: ImportPreviewItem[];
}

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
  private codeRegistry = inject(StandardCodeRegistryService);
  private progressService = inject(ProgressService);

  // ─── Excel Date Parser ────────────────────────────────────────────────────────
  parseExcelDate(val: unknown): string {
    return parseExcelDateDetailed(val).value;
  }

  // ─── Parse Standards Excel ────────────────────────────────────────────────────
  async parseExcelWorkbook(file: File, sheetName?: string): Promise<StandardImportWorkbookPreview> {
    validateStandardImportFile(file);
    const buffer = await this.readFileAsArrayBuffer(file);
    const workbookData = await this.readWorkbookInWorker(buffer, sheetName);
    let existingStandards = this.cache._memStandards?.length
      ? this.cache._memStandards
      : this.cache.getAllStandardsFromCache();
    if (!existingStandards.length) existingStandards = await this.cache.fetchAllAndCache();
    const items = parseStandardImportRows(workbookData.rows, {
      sourceSheet: workbookData.selectedSheet,
      existingStandards,
      generateSearchKey: standard => this.crud.generateSearchKey(standard)
    });
    return {
      sheetNames: workbookData.sheetNames,
      selectedSheet: workbookData.selectedSheet,
      items
    };
  }

  async parseExcelData(file: File, sheetName?: string): Promise<ImportPreviewItem[]> {
    return (await this.parseExcelWorkbook(file, sheetName)).items;
  }

  private readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = () => reject(new Error('Không thể đọc tệp từ thiết bị.'));
      reader.onabort = () => reject(new Error('Việc đọc tệp đã bị hủy.'));
      reader.readAsArrayBuffer(file);
    });
  }

  private async readWorkbookInWorker(
    buffer: ArrayBuffer,
    sheetName?: string
  ): Promise<{ sheetNames: string[]; selectedSheet: string; rows: Record<string, unknown>[] }> {
    if (typeof Worker === 'undefined') {
      const XLSX = await import('xlsx');
      const workbook = XLSX.read(buffer, { type: 'array', cellDates: false });
      const sheetNames = workbook.SheetNames.filter(name => Boolean(workbook.Sheets[name]?.['!ref']));
      if (!sheetNames.length) throw new Error('Workbook không có sheet dữ liệu.');
      const selectedSheet = sheetName && sheetNames.includes(sheetName) ? sheetName : sheetNames[0];
      return {
        sheetNames,
        selectedSheet,
        rows: XLSX.utils.sheet_to_json<Record<string, unknown>>(workbook.Sheets[selectedSheet], {
          defval: '',
          raw: false
        })
      };
    }

    return new Promise((resolve, reject) => {
      const worker = new Worker(new URL('./standard-import.worker', import.meta.url), { type: 'module' });
      worker.onmessage = ({ data }) => {
        worker.terminate();
        if (data?.error) reject(new Error(data.error));
        else resolve(data);
      };
      worker.onerror = event => {
        worker.terminate();
        reject(new Error(event.message || 'Web Worker không thể đọc workbook.'));
      };
      worker.postMessage({ buffer, sheetName }, [buffer]);
    });
  }

  async saveImportedData(data: ImportPreviewItem[]): Promise<StandardImportSaveResult> {
    if ((data || []).some(item => item.mode === 'CONFLICT')) {
      throw new Error('Còn dòng xung đột. Hãy xử lý các dòng màu đỏ trước khi import.');
    }
    const validItems = (data || []).filter(item => item.isValid);
    const skippedInvalid = (data || []).length - validItems.length;
    if (validItems.length === 0) {
      throw new Error('Không có dòng hợp lệ để nhập. Vui lòng kiểm tra lỗi trong bảng xem trước.');
    }
    if (!this.auth.canEditStandards()) throw new Error('Bạn không có quyền nhập danh mục chuẩn.');

    // Preflight every deterministic id and strong internal identity before the first write.
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

    const standardsCollection = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards`);
    const internalIds = [...new Set(
      validItems
        .map(item => normalizeInternalId(item.parsed.internal_id))
        .filter((value): value is string => Boolean(value))
    )];
    const activeByInternalId = new Map<string, ReferenceStandard[]>();
    for (let offset = 0; offset < internalIds.length; offset += 10) {
      const snapshot = await getDocs(query(
        standardsCollection,
        where('internal_id', 'in', internalIds.slice(offset, offset + 10))
      ));
      snapshot.docs.forEach(document => {
        const standard = { id: document.id, ...document.data() } as ReferenceStandard;
        if (!isActiveStandardIdentity(standard)) return;
        const key = normalizeInternalId(standard.internal_id);
        activeByInternalId.set(key, [...(activeByInternalId.get(key) || []), standard]);
      });
    }

    // Firestore cannot query legacy whitespace/lower-case variants by the
    // canonical code. Merge the materialized catalogue into the preflight so
    // an old malformed value cannot create a second active owner.
    const knownStandards = this.cache._memStandards?.length
      ? this.cache._memStandards
      : await this.cache.fetchAllAndCache();
    knownStandards.forEach(standard => {
      if (!isActiveStandardIdentity(standard) || !standard.internal_id) return;
      const key = normalizeInternalId(standard.internal_id);
      const bucket = activeByInternalId.get(key) || [];
      if (!bucket.some(candidate => candidate.id === standard.id)) {
        activeByInternalId.set(key, [...bucket, standard]);
      }
    });

    const identityConflicts: ImportPreviewItem[] = [];
    validItems.forEach(item => {
      const internalKey = normalizeInternalId(item.parsed.internal_id);
      const matches = internalKey ? activeByInternalId.get(internalKey) || [] : [];
      if (matches.length > 1) {
        item.mode = 'CONFLICT';
        item.isValid = false;
        item.errorMessage = 'Có nhiều chuẩn đang hoạt động cùng Số nhận diện; cần giải phóng hoặc hợp nhất slot trước khi import.';
        identityConflicts.push(item);
        return;
      }
      if (matches.length === 1) {
        const matched = matches[0];
        item.parsed.id = matched.id;
        item.mode = 'UPDATE_SAFE';
        item.changes = computeImportChanges(matched, item.parsed, item.presentFields || []);
        existing.set(matched.id, matched);
      }
    });
    if (identityConflicts.length) {
      throw new Error(`Có ${identityConflicts.length} dòng dùng slot đang bị nhiều chuẩn hoạt động cùng chiếm. Không có dữ liệu nào được ghi.`);
    }

    // Import is not a code-reassignment tool. A valid existing physical
    // record keeps its current internal_id; missing/invalid legacy records
    // must be repaired through the audited sync tool first.
    const codeChanges = validItems.filter(item => {
      const current = existing.get(item.parsed.id);
      if (!current) return false;
      return normalizeInternalId(current.internal_id) !== normalizeInternalId(item.parsed.internal_id);
    });
    if (codeChanges.length) {
      codeChanges.forEach(item => {
        item.mode = 'CONFLICT';
        item.isValid = false;
        item.errorMessage = 'Mã trong hồ sơ đã tồn tại khác với tệp nhập. Hãy dùng công cụ Đồng bộ mã nội bộ để đối chiếu/sửa có audit trước khi import.';
      });
      throw new Error(`Có ${codeChanges.length} dòng đang cố đổi Mã quản lý nội bộ của hồ sơ vật lý đã tồn tại. Không có dữ liệu nào được ghi.`);
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
        item.isValid = false;
        item.errorMessage = 'Lô đang có quy trình mượn và trả nên không thể nhập dữ liệu, nhằm bảo toàn số lượng tồn.';
      });
      throw new Error(`Có ${conflicts.length} lô đang được mượn hoặc chờ duyệt. Không có dữ liệu nào được ghi.`);
    }

    const registrySnapshots = new Map<string, any>();
    const autoReleaseOwners = new Map<string, ReferenceStandard>();
    const registryCodes = [...new Set(
      validItems
        .filter(item => item.mode === 'CREATE')
        .map(item => normalizeInternalId(item.parsed.internal_id))
        .filter(code => isValidInternalId(code))
    )];
    for (const code of registryCodes) {
      const registrySnapshot = await getDoc(this.codeRegistry.getRegistryRef(code));
      registrySnapshots.set(code, registrySnapshot.exists() ? registrySnapshot.data() : null);
      const registry = registrySnapshot.exists() ? registrySnapshot.data() : null;
      if (registry?.['status'] === 'CONFLICT') {
        throw new Error(`Mã ${code} đang ở trạng thái xung đột trong ngân hàng mã. Hãy xử lý trước khi import.`);
      }
      if (registry?.['status'] === 'ASSIGNED') {
        const ownerId = String(registry['currentStandardId'] || '').trim();
        if (!ownerId) {
          throw new Error(`Mã ${code} đang ở trạng thái cấp không hợp lệ. Hãy chạy công cụ Đồng bộ trước khi import.`);
        }
        const ownerSnapshot = await getDoc(doc(
          this.fb.db,
          `artifacts/${this.fb.APP_ID}/reference_standards/${ownerId}`
        ));
        if (!ownerSnapshot.exists()) {
          throw new Error(`Mã ${code} đang trỏ tới hồ sơ ${ownerId} không còn tồn tại. Hãy chạy công cụ Đồng bộ trước khi import.`);
        }
        const owner = { id: ownerSnapshot.id, ...ownerSnapshot.data() } as ReferenceStandard;
        if (normalizeInternalId(owner.internal_id) !== code) {
          throw new Error(`Registry của mã ${code} không khớp hồ sơ ${ownerId}. Hãy chạy công cụ Đồng bộ trước khi import.`);
        }
        if (!canAutoReleaseExpiredStandard(owner)) {
          throw new Error(
            `Mã ${code} đang được cấp cho chuẩn khác chưa đủ điều kiện tái cấp tự động ` +
            '(chưa hết HSD hoặc còn quy trình mở). Hãy đóng vòng đời cũ hoặc đồng bộ dữ liệu trước khi import.'
          );
        }
        autoReleaseOwners.set(code, owner);
      }
    }

    const newItemsCount = validItems.filter(item => item.mode === 'CREATE').length;
    const plannedWrites = countAtomicStandardImportWrites(validItems, new Set(existing.keys())) +
      newItemsCount + autoReleaseOwners.size;
    if (plannedWrites > STANDARD_IMPORT_MAX_ATOMIC_WRITES) {
      throw new Error(
        `Import cần ${plannedWrites} thao tác, vượt giới hạn an toàn ${STANDARD_IMPORT_MAX_ATOMIC_WRITES}. ` +
        'Vui lòng chia file thành các phần nhỏ hơn; chưa có dữ liệu nào được ghi.'
      );
    }

    this.progressService.start(
      'Đang lưu chất chuẩn đối chiếu',
      'Toàn bộ dữ liệu sẽ được commit trong một giao dịch batch',
      validItems.length + 1
    );
    const batch = writeBatch(this.fb.db);
    let processed = 0;
    let created = 0;
    let updated = 0;
    const restored = 0;
    let skippedLogs = 0;
    const optimisticChanges: ReferenceStandard[] = [];

    try {
      for (const item of validItems) {
        processed++;
        this.progressService.update(processed, `Đang xử lý dòng ${processed}/${validItems.length}`);
        const stdRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${item.parsed.id}`);
        const current = existing.get(item.parsed.id);

        if (current) {
          item.mode = 'UPDATE_SAFE';
          const safeMetadata = buildSafeImportMetadata(item.parsed, item.presentFields || []);
          const merged = { ...current, ...safeMetadata } as ReferenceStandard;
          safeMetadata.search_key = this.crud.generateSearchKey(merged);
          batch.set(
            stdRef,
            { ...safeMetadata, lastUpdated: serverTimestamp() },
            { merge: true }
          );
          optimisticChanges.push(merged);
          updated++;
          skippedLogs += item.logs?.length || 0;
          continue;
        }

        item.mode = 'CREATE';
        const code = normalizeInternalId(item.parsed.internal_id);
        const registry = registrySnapshots.get(code);
        const expiredOwner = autoReleaseOwners.get(code);
        const assignmentSequence = Math.max(0, Number(registry?.assignmentCount || 0)) + 1;
        const lifecycleFields = {
          internal_id: code,
          lifecycle_status: 'ACTIVE' as const,
          internal_id_assigned_at: serverTimestamp(),
          internal_id_assignment_sequence: assignmentSequence,
        };
        if (expiredOwner) {
          batch.update(
            doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${expiredOwner.id}`),
            {
              lifecycle_status: 'RELEASED',
              internal_id_released_at: serverTimestamp(),
              internal_id_release_reason: 'AUTO_EXPIRED_REUSE',
              lastUpdated: serverTimestamp(),
            }
          );
          optimisticChanges.push({
            ...expiredOwner,
            lifecycle_status: 'RELEASED',
            internal_id_release_reason: 'AUTO_EXPIRED_REUSE',
          });
        }
        batch.set(stdRef, { ...item.parsed, ...lifecycleFields, _isDeleted: false, lastUpdated: serverTimestamp() });
        batch.set(this.codeRegistry.getRegistryRef(code), {
          id: code,
          internal_id: code,
          status: 'ASSIGNED',
          currentStandardId: item.parsed.id,
          assignmentCount: assignmentSequence,
          lastAssignedAt: serverTimestamp(),
          ...(expiredOwner ? {
            lastReleasedAt: serverTimestamp(),
            lastReleasedStandardId: expiredOwner.id,
          } : {}),
          lastUpdated: serverTimestamp(),
        }, { merge: true });
        optimisticChanges.push({ ...item.parsed, ...lifecycleFields, _isDeleted: false });
        created++;
        for (const [logIndex, rawLog] of (item.logs || []).entries()) {
          const amountToken = String(rawLog.normalized_amount ?? rawLog.amount_used)
            .replace('-', 'neg_')
            .replace('.', '_decimal_');
          const signature = generateSlug(
            `${item.parsed.id}_${rawLog.date}_${rawLog.user}_${amountToken}_${rawLog.normalized_unit || item.parsed.unit}_${logIndex}`
          ).slice(0, 180);
          const logId = `import_${signature}`;
          const logRef = doc(
            this.fb.db,
            `artifacts/${this.fb.APP_ID}/reference_standards/${item.parsed.id}/logs/${logId}`
          );
          const log: UsageLog = {
            ...rawLog,
            id: logId,
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
            doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_usages/${logId}`),
            { ...log, lastUpdated: serverTimestamp() }
          );
        }
      }
      const importer = this.auth.currentUser();
      const resultSummary = [
        created > 0 ? `${created} chuẩn mới` : '',
        updated > 0 ? `${updated} chuẩn cập nhật` : ''
      ].filter(Boolean).join(', ');
      const metadataUpdate = this.fb.getMetadataUpdateOp('standards', {
        action: 'IMPORT_STANDARDS',
        message: `📊 [${importer?.displayName || 'Người dùng'}] Import chuẩn: ${resultSummary}.`,
        actorUid: importer?.uid,
        actorName: importer?.displayName
      });
      batch.set(metadataUpdate.ref, metadataUpdate.data, { merge: true });
      this.progressService.update(validItems.length, 'Đang commit toàn bộ batch lên Firestore...');
      await batch.commit();
      this.progressService.update(validItems.length + 1, 'Đã commit thành công.');
      // Publish ngay vào singleton đang hoạt động. Không hủy listener DeltaSync:
      // hủy ở đây khiến subscription của màn hình hiện tại bị "mồ côi".
      this.cache._mergeAndSave(optimisticChanges, []);
      this.progressService.complete();
      return { created, updated, restored, skippedInvalid, skippedLogs };
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
      const importer = this.auth.currentUser();
      await this.fb.updateMetadata('standards', {
        action: 'IMPORT_STANDARD_USAGE_LOGS',
        message: `📊 [${importer?.displayName || 'Người dùng'}] Import ${validItems.length} nhật ký sử dụng chuẩn.`,
        actorUid: importer?.uid,
        actorName: importer?.displayName
      });
      this.cache.invalidateLocalStandardsCache();
      this.progressService.complete();
    } catch (err) {
      this.progressService.stop();
      throw err;
    }
  }
}
