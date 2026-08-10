import { Injectable, inject } from '@angular/core';
import {
  collection,
  deleteField,
  doc,
  getDocs,
  getDoc,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { FirebaseService } from '../../../core/services/firebase.service';
import { AuthService } from '../../../core/services/auth.service';
import {
  ReferenceStandard,
  StandardCodeRegistry,
  StandardInternalIdSyncBatch,
  StandardInternalIdSyncChange,
  StandardInternalIdSyncIssue,
  StandardInternalIdSyncReport,
  PurchaseRequest,
  StandardRequest,
  UsageLog,
} from '../../../core/models/standard.model';
import {
  assessInternalId,
  isCurrentStandardLifecycle,
  isValidInternalId,
  normalizeInternalId,
} from '../../../shared/utils/standard-internal-id';
import { sanitizeForFirebase } from '../../../shared/utils/utils';

type AnyRecord = Record<string, any>;

/**
 * Read-only first, explicit apply second. This service repairs only
 * deterministic legacy inconsistencies and leaves ambiguous code ownership
 * for a manager to resolve.
 */
@Injectable({ providedIn: 'root' })
export class StandardInternalIdSyncService {
  private fb = inject(FirebaseService);
  private auth = inject(AuthService);

  private readonly MAX_APPLY_CHANGES = 250;

  async scan(): Promise<StandardInternalIdSyncReport> {
    if (!this.auth.canEditStandards()) {
      throw new Error('Bạn không có quyền quét và đồng bộ Mã quản lý nội bộ.');
    }

    const base = `artifacts/${this.fb.APP_ID}`;
    const [standardSnapshot, requestSnapshot, purchaseRequestSnapshot, usageSnapshot, registrySnapshot] = await Promise.all([
      getDocs(collection(this.fb.db, `${base}/reference_standards`)),
      getDocs(collection(this.fb.db, `${base}/standard_requests`)),
      getDocs(collection(this.fb.db, `${base}/purchase_requests`)),
      getDocs(collection(this.fb.db, `${base}/standard_usages`)),
      getDocs(collection(this.fb.db, `${base}/standard_code_registry`)),
    ]);

    const standards = standardSnapshot.docs.map(snapshot => ({ id: snapshot.id, ...snapshot.data() } as ReferenceStandard));
    const requests = requestSnapshot.docs.map(snapshot => ({ id: snapshot.id, ...snapshot.data() } as StandardRequest));
    const purchaseRequests = purchaseRequestSnapshot.docs.map(snapshot => ({ id: snapshot.id, ...snapshot.data() } as PurchaseRequest));
    const globalUsages = usageSnapshot.docs.map(snapshot => ({ id: snapshot.id, ...snapshot.data() } as UsageLog));
    const registries = new Map<string, StandardCodeRegistry>(
      registrySnapshot.docs.map(snapshot => [normalizeInternalId(snapshot.id), ({ id: snapshot.id, ...snapshot.data() } as StandardCodeRegistry)])
    );
    const byId = new Map(standards.map(standard => [standard.id, standard]));
    const byCode = new Map<string, ReferenceStandard[]>();
    const issues: StandardInternalIdSyncIssue[] = [];
    const safeChanges: StandardInternalIdSyncChange[] = [];
    let issueSequence = 0;

    const addIssue = (issue: Omit<StandardInternalIdSyncIssue, 'id'>) => {
      const item = { ...issue, id: `internal-id-issue-${++issueSequence}` };
      issues.push(item);
      return item;
    };
    const addChange = (change: StandardInternalIdSyncChange) => safeChanges.push(change);

    const buildSearchKey = (standard: ReferenceStandard, internalId = standard.internal_id): string => [
      standard.name,
      standard.canonical_name,
      standard.original_name,
      standard.chemical_name,
      internalId,
      standard.cas_number,
      standard.product_code,
      standard.lot_number,
      standard.manufacturer,
      standard.id,
    ].filter(value => value !== null && value !== undefined && String(value).trim() !== '')
      .join(' ')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    for (const standard of standards) {
      const assessment = assessInternalId(standard.internal_id);
      if (assessment.kind === 'MISSING') {
        addIssue({
          kind: 'MISSING', severity: 'ERROR', collection: 'reference_standards', documentId: standard.id,
          internalId: '', message: `${standard.name} chưa có Mã quản lý nội bộ.`, autoFixable: false,
        });
        continue;
      }
      if (assessment.kind === 'INVALID_FORMAT') {
        addIssue({
          kind: 'INVALID_FORMAT', severity: 'ERROR', collection: 'reference_standards', documentId: standard.id,
          internalId: assessment.raw, message: `${standard.name}: ${assessment.reason}`, autoFixable: false,
        });
        continue;
      }

      const code = assessment.normalized;
      byCode.set(code, [...(byCode.get(code) || []), standard]);
      if (assessment.kind === 'NORMALIZABLE') {
        addChange({
          collection: 'reference_standards', documentId: standard.id, field: 'internal_id',
          before: assessment.raw, after: code, reason: 'Chuẩn hóa chữ hoa và khoảng trắng của mã hợp lệ.',
        });
        addChange({
          collection: 'reference_standards', documentId: standard.id, field: 'search_key',
          before: standard.search_key ?? null, after: buildSearchKey(standard, code), reason: 'Cập nhật khóa tìm kiếm sau khi chuẩn hóa mã.',
        });
      }
    }

    for (const [code, records] of byCode.entries()) {
      const currentRecords = records.filter(isCurrentStandardLifecycle);
      const registry = registries.get(code);
      if (currentRecords.length > 1) {
        currentRecords.forEach(record => addIssue({
          kind: 'DUPLICATE_ACTIVE', severity: 'ERROR', collection: 'reference_standards', documentId: record.id,
          standardId: record.id, internalId: code,
          message: `Mã ${code} đang được dùng đồng thời cho nhiều chuẩn vật lý; không tự động chọn bản ghi nào là hiện tại.`,
          autoFixable: false,
        }));
        continue;
      }

      if (currentRecords.length === 1) {
        const current = currentRecords[0];
        if (registry?.status === 'CONFLICT') {
          addIssue({
            kind: 'REGISTRY_MISMATCH', severity: 'ERROR', collection: 'standard_code_registry', documentId: code,
            standardId: current.id, internalId: code,
            message: `Ngân hàng mã ${code} đang ở trạng thái xung đột.`, autoFixable: false,
          });
        } else if (registry?.status === 'ASSIGNED' && registry.currentStandardId && registry.currentStandardId !== current.id) {
          const registryOwner = byId.get(registry.currentStandardId);
          addIssue({
            kind: 'REGISTRY_MISMATCH', severity: 'ERROR', collection: 'standard_code_registry', documentId: code,
            standardId: current.id, internalId: code,
            message: registryOwner && isCurrentStandardLifecycle(registryOwner)
              ? `Ngân hàng mã ${code} đang trỏ tới chuẩn hiện tại khác (${registryOwner.id}); không tự động ghi đè quyền sở hữu.`
              : `Ngân hàng mã ${code} đang trỏ tới hồ sơ ${registry.currentStandardId} chưa được đối chiếu; không tự động ghi đè quyền sở hữu.`,
            autoFixable: false,
          });
        } else if (!registry || registry.status !== 'ASSIGNED' || registry.currentStandardId !== current.id) {
          const assignmentCount = Math.max(1, Number(registry?.assignmentCount || 0));
          addChange({
            collection: 'standard_code_registry', documentId: code, field: '__document__',
            before: registry ? this.registrySnapshot(registry) : null,
            after: {
              id: code,
              internal_id: code,
              status: 'ASSIGNED',
              currentStandardId: current.id,
              assignmentCount,
            },
            reason: 'Đồng bộ ngân hàng mã với chuẩn vật lý hiện tại duy nhất.',
          });
        }
      } else if (records.length > 0 && (!registry || registry.status !== 'AVAILABLE')) {
        const allReleased = records.every(record => !isCurrentStandardLifecycle(record));
        const registryOwner = registry?.status === 'ASSIGNED' && registry.currentStandardId
          ? byId.get(registry.currentStandardId)
          : undefined;
        if (registry?.status === 'CONFLICT') {
          addIssue({
            kind: 'REGISTRY_MISMATCH', severity: 'ERROR', collection: 'standard_code_registry', documentId: code,
            internalId: code, message: `Ngân hàng mã ${code} đang ở trạng thái xung đột.`, autoFixable: false,
          });
        } else if (allReleased &&
          (!registryOwner || !isCurrentStandardLifecycle(registryOwner))) {
          addChange({
            collection: 'standard_code_registry', documentId: code, field: '__document__',
            before: registry ? this.registrySnapshot(registry) : null,
            after: {
              id: code,
              internal_id: code,
              status: 'AVAILABLE',
              currentStandardId: null,
              assignmentCount: Math.max(records.length, Number(registry?.assignmentCount || 0)),
            },
            reason: 'Đồng bộ mã đã trả về ngân hàng sau khi mọi vòng đời đã đóng.',
          });
        } else if (registry?.status === 'ASSIGNED') {
          addIssue({
            kind: 'REGISTRY_MISMATCH', severity: 'ERROR', collection: 'standard_code_registry', documentId: code,
            internalId: code, message: registryOwner && isCurrentStandardLifecycle(registryOwner)
              ? `Ngân hàng mã ${code} đang trỏ tới một chuẩn hiện tại khác với dữ liệu mã; cần xử lý xung đột.`
              : `Ngân hàng mã ${code} vẫn đang ghi nhận chuẩn hiện tại nhưng không tìm thấy vòng đời đang mở.`,
            autoFixable: false,
          });
        }
      }
    }

    // Also report registry rows that have no valid physical-code owner in the
    // catalogue. Without this pass, an orphan lock could remain invisible
    // because the scan is driven by reference_standards codes.
    for (const [code, registry] of registries.entries()) {
      if (registry.status !== 'ASSIGNED' || byCode.has(code)) continue;
      const owner = registry.currentStandardId ? byId.get(registry.currentStandardId) : undefined;
      addIssue({
        kind: 'REGISTRY_MISMATCH', severity: 'ERROR', collection: 'standard_code_registry', documentId: code,
        standardId: registry.currentStandardId, internalId: code,
        message: owner
          ? `Ngân hàng mã ${code} trỏ tới hồ sơ ${owner.id} nhưng hồ sơ này không có mã hợp lệ tương ứng.`
          : `Ngân hàng mã ${code} trỏ tới hồ sơ không tồn tại trong danh mục chuẩn.`,
        autoFixable: false,
      });
    }

    for (const request of requests) {
      this.inspectReferenceSnapshot(
        'standard_requests', request.id || '', request as AnyRecord, byId, byCode, addIssue, addChange, 'internalId'
      );
      this.inspectEmbeddedUsageLogs(request, byId, byCode, addIssue, addChange);
    }

    for (const request of purchaseRequests) {
      this.inspectReferenceSnapshot(
        'purchase_requests', request.id || '', request as AnyRecord, byId, byCode, addIssue, addChange, 'internalId'
      );
    }

    for (const usage of globalUsages) {
      this.inspectReferenceSnapshot(
        'standard_usages', usage.id || '', usage as AnyRecord, byId, byCode, addIssue, addChange, 'internalId'
      );
    }

    let nestedUsageCount = 0;
    // The global collection is not assumed to be the only copy. This explicit
    // admin scan also checks each physical standard's nested log collection.
    for (const standard of standards) {
      const logsSnapshot = await getDocs(collection(this.fb.db, `${base}/reference_standards/${standard.id}/logs`));
      nestedUsageCount += logsSnapshot.size;
      for (const logSnapshot of logsSnapshot.docs) {
        const log = { id: logSnapshot.id, ...logSnapshot.data(), standardId: (logSnapshot.data() as AnyRecord)['standardId'] || standard.id } as AnyRecord;
        this.inspectReferenceSnapshot(
          'reference_standard_logs', `${standard.id}::${logSnapshot.id}`, log, byId, byCode, addIssue, addChange, 'internalId', standard.id
        );
      }
    }

    return {
      generatedAt: Date.now(),
      standardsCount: standards.length,
      requestsCount: requests.length,
      purchaseRequestsCount: purchaseRequests.length,
      usageCount: globalUsages.length,
      nestedUsageCount,
      registryCount: registries.size,
      issues,
      safeChanges,
      conflicts: issues.filter(issue => !issue.autoFixable || issue.severity === 'ERROR'),
    };
  }

  async apply(report: StandardInternalIdSyncReport, corrections: Record<string, string> = {}): Promise<string> {
    if (!this.auth.canEditStandards()) throw new Error('Bạn không có quyền áp dụng đồng bộ Mã quản lý nội bộ.');

    // Re-scan immediately before writing so a stale preview cannot overwrite a
    // newly assigned code or a newly created request.
    const freshReport = await this.scan();
    const changes = [...freshReport.safeChanges];
    const base = `artifacts/${this.fb.APP_ID}`;
    const standardsCollection = collection(this.fb.db, `${base}/reference_standards`);
    for (const [standardId, rawCode] of Object.entries(corrections)) {
      const targetCode = normalizeInternalId(rawCode);
      if (!isValidInternalId(targetCode)) {
        throw new Error(`Mã sửa cho hồ sơ ${standardId} không hợp lệ.`);
      }
      const standardSnapshot = await getDoc(doc(this.fb.db, `${base}/reference_standards/${standardId}`));
      if (!standardSnapshot.exists()) throw new Error(`Hồ sơ ${standardId} không còn tồn tại.`);
      const standard = { id: standardSnapshot.id, ...standardSnapshot.data() } as ReferenceStandard;
      const currentCode = normalizeInternalId(standard.internal_id);
      if (isValidInternalId(currentCode) && currentCode !== targetCode) {
        throw new Error(`Hồ sơ ${standardId} đã có mã hợp lệ ${currentCode}; công cụ chỉ tự sửa mã thiếu/sai định dạng để tránh đổi nhầm lịch sử.`);
      }
      if (freshReport.conflicts.some(issue =>
        issue.kind === 'DUPLICATE_ACTIVE' && normalizeInternalId(issue.internalId) === targetCode
      )) {
        throw new Error(`Mã ${targetCode} đang có nhiều chủ sở hữu hiện tại; không thể gán thủ công cho đến khi xử lý xung đột.`);
      }

      // The correction path repairs legacy values, so an equality query on
      // the canonical code could miss a lower-case/whitespace owner. This is
      // intentionally a full read only for an explicit manual correction.
      const duplicateSnapshot = await getDocs(standardsCollection);
      const duplicateCurrent = duplicateSnapshot.docs
        .map(snapshot => ({ id: snapshot.id, ...snapshot.data() } as ReferenceStandard))
        .filter(candidate => candidate.id !== standardId && isCurrentStandardLifecycle(candidate))
        .filter(candidate => normalizeInternalId(candidate.internal_id) === targetCode);
      if (duplicateCurrent.length > 0) {
        throw new Error(`Mã ${targetCode} đã có chuẩn hiện tại khác; không thể gán tự động.`);
      }

      changes.push({
        collection: 'reference_standards', documentId: standardId, field: 'internal_id',
        before: standard.internal_id ?? null, after: targetCode, reason: 'Mã sửa thủ công sau khi người quản lý đối chiếu hồ sơ.',
      });
      changes.push({
        collection: 'reference_standards', documentId: standardId, field: 'search_key',
        before: standard.search_key ?? null, after: this.buildSearchKey(standard, targetCode), reason: 'Cập nhật khóa tìm kiếm theo mã sửa thủ công.',
      });
      if (isCurrentStandardLifecycle(standard)) {
        const registrySnapshot = await getDoc(doc(this.fb.db, `${base}/standard_code_registry/${targetCode}`));
        const registry = registrySnapshot.exists() ? registrySnapshot.data() as StandardCodeRegistry : null;
        if (registry?.status === 'ASSIGNED' && registry.currentStandardId !== standardId) {
          throw new Error(`Mã ${targetCode} đang được cấp cho chuẩn khác.`);
        }
        if (registry?.status === 'CONFLICT') throw new Error(`Mã ${targetCode} đang xung đột.`);
        changes.push({
          collection: 'standard_code_registry', documentId: targetCode, field: '__document__',
          before: registry ? this.registrySnapshot(registry) : null,
          after: {
            id: targetCode,
            internal_id: targetCode,
            status: 'ASSIGNED',
            currentStandardId: standardId,
            assignmentCount: Math.max(1, Number(registry?.assignmentCount || 0)),
          },
          reason: 'Đồng bộ ngân hàng mã sau khi sửa thủ công hồ sơ.',
        });
      }
    }

    const mergedChanges = this.mergeChanges(changes);
    if (mergedChanges.length === 0) throw new Error('Không có thay đổi an toàn hoặc mã sửa nào để áp dụng.');
    if (mergedChanges.length > this.MAX_APPLY_CHANGES) {
      throw new Error(`Có ${mergedChanges.length} thay đổi; hãy chia thành các lần nhỏ hơn ${this.MAX_APPLY_CHANGES} thay đổi để bảo đảm an toàn.`);
    }

    const currentUser = this.auth.currentUser();
    const batchRef = doc(collection(this.fb.db, `${base}/standard_code_sync_batches`));
    const batch = writeBatch(this.fb.db);
    const updates = new Map<string, { ref: any; fields: AnyRecord; registryDocument?: AnyRecord }>();

    for (const change of mergedChanges) {
      const key = `${change.collection}/${change.documentId}`;
      const entry = updates.get(key) || { ref: null, fields: {} };
      if (change.collection === 'standard_code_registry') {
        entry.ref = doc(this.fb.db, `${base}/standard_code_registry/${change.documentId}`);
        entry.registryDocument = { ...(change.after as AnyRecord), lastUpdated: serverTimestamp() };
      } else if (change.collection === 'reference_standard_logs') {
        const [standardId, logId] = change.documentId.split('::');
        entry.ref = doc(this.fb.db, `${base}/reference_standards/${standardId}/logs/${logId}`);
        entry.fields[change.field] = change.after;
      } else {
        entry.ref = doc(this.fb.db, `${base}/${change.collection}/${change.documentId}`);
        entry.fields[change.field] = change.after;
      }
      updates.set(key, entry);
    }

    updates.forEach(entry => {
      if (entry.registryDocument) {
        const registryDocument = { ...entry.registryDocument };
        if (registryDocument['currentStandardId'] === null) registryDocument['currentStandardId'] = deleteField();
        // Do not recursively sanitize this object: deleteField() is a
        // Firestore sentinel and must reach the SDK unchanged.
        batch.set(entry.ref, registryDocument, { merge: true });
      } else {
        batch.update(entry.ref, sanitizeForFirebase({ ...entry.fields, lastUpdated: serverTimestamp() }));
      }
    });

    const auditBatch: StandardInternalIdSyncBatch = {
      id: batchRef.id,
      status: 'APPLIED',
      generatedAt: freshReport.generatedAt,
      recordCount: mergedChanges.length,
      changes: mergedChanges,
    };
    batch.set(batchRef, sanitizeForFirebase({
      ...auditBatch,
      createdAt: serverTimestamp(),
      createdBy: currentUser?.uid || '',
      createdByName: currentUser?.displayName || currentUser?.email || 'Người dùng',
    }));
    await batch.commit();
    return batchRef.id;
  }

  async getRecentBatches(limitCount = 20): Promise<StandardInternalIdSyncBatch[]> {
    if (!this.auth.canEditStandards()) throw new Error('Bạn không có quyền xem lịch sử đồng bộ mã.');
    const snapshot = await getDocs(collection(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_code_sync_batches`));
    return snapshot.docs
      .map(item => ({ id: item.id, ...item.data() } as StandardInternalIdSyncBatch))
      .sort((a, b) => this.timestampValue(b.createdAt || b.generatedAt) - this.timestampValue(a.createdAt || a.generatedAt))
      .slice(0, Math.min(Math.max(limitCount, 1), 50));
  }

  private inspectReferenceSnapshot(
    collectionName: string,
    documentId: string,
    data: AnyRecord,
    byId: Map<string, ReferenceStandard>,
    byCode: Map<string, ReferenceStandard[]>,
    addIssue: (issue: Omit<StandardInternalIdSyncIssue, 'id'>) => StandardInternalIdSyncIssue,
    addChange: (change: StandardInternalIdSyncChange) => void,
    internalField: 'internalId',
    fallbackStandardId?: string,
  ): void {
    const rawReference = String(data['standardId'] || fallbackStandardId || '').trim();
    let standard = rawReference ? byId.get(rawReference) : undefined;
    if (!standard && rawReference) {
      const codeMatches = byCode.get(normalizeInternalId(rawReference)) || [];
      const nonDeleted = codeMatches.filter(candidate => !candidate._isDeleted && candidate.status !== 'DELETED');
      if (nonDeleted.length === 1) {
        standard = nonDeleted[0];
        addChange({
          collection: collectionName, documentId, field: 'standardId', before: rawReference, after: standard.id,
          reason: 'Sửa tham chiếu cũ dùng Mã quản lý nội bộ thay vì khóa bản ghi vật lý; chỉ áp dụng khi đối chiếu duy nhất.',
        });
      } else {
        addIssue({
          kind: 'REQUEST_REFERENCE', severity: 'ERROR', collection: collectionName, documentId,
          internalId: rawReference,
          message: nonDeleted.length > 1
            ? `Tham chiếu ${rawReference} trùng nhiều vòng đời; không được tự đoán.`
            : `Không tìm thấy chuẩn vật lý cho tham chiếu ${rawReference}.`,
          autoFixable: false,
        });
      }
    }
    if (!standard) return;

    const expectedCode = normalizeInternalId(standard.internal_id);
    if (!isValidInternalId(expectedCode)) {
      addIssue({
        kind: collectionName === 'standard_usages' || collectionName === 'reference_standard_logs' ? 'USAGE_REFERENCE' : 'REQUEST_REFERENCE',
        severity: 'ERROR', collection: collectionName, documentId, standardId: standard.id,
        message: `Chuẩn được tham chiếu chưa có Mã quản lý nội bộ hợp lệ.`, autoFixable: false,
      });
      return;
    }

    const currentValue = data[internalField];
    const assessment = assessInternalId(currentValue);
    if (assessment.kind === 'MISSING') {
      addChange({ collection: collectionName, documentId, field: internalField, before: null, after: expectedCode, reason: 'Bổ sung snapshot Mã quản lý nội bộ từ chuẩn vật lý được tham chiếu.' });
    } else if ((assessment.kind === 'VALID' || assessment.kind === 'NORMALIZABLE') && assessment.normalized === expectedCode) {
      if (assessment.kind === 'NORMALIZABLE') {
        addChange({ collection: collectionName, documentId, field: internalField, before: assessment.raw, after: expectedCode, reason: 'Chuẩn hóa snapshot Mã quản lý nội bộ.' });
      }
    } else {
      addIssue({
        kind: collectionName === 'standard_usages' || collectionName === 'reference_standard_logs' ? 'USAGE_REFERENCE' : 'REQUEST_REFERENCE',
        severity: 'WARNING', collection: collectionName, documentId, standardId: standard.id,
        internalId: String(currentValue || ''), suggestedInternalId: expectedCode,
        message: `Snapshot mã ${String(currentValue || '(trống)')} khác mã của chuẩn vật lý tại thời điểm dữ liệu đang trỏ tới; cần đối chiếu thủ công.`,
        autoFixable: false,
      });
    }
  }

  private inspectEmbeddedUsageLogs(
    request: StandardRequest,
    byId: Map<string, ReferenceStandard>,
    byCode: Map<string, ReferenceStandard[]>,
    addIssue: (issue: Omit<StandardInternalIdSyncIssue, 'id'>) => StandardInternalIdSyncIssue,
    addChange: (change: StandardInternalIdSyncChange) => void,
  ): void {
    if (!Array.isArray(request.usageLogs) || request.usageLogs.length === 0) return;
    let standard = byId.get(request['standardId']);
    if (!standard) {
      const codeMatches = byCode.get(normalizeInternalId(request['standardId'])) || [];
      if (codeMatches.length === 1) standard = codeMatches[0];
    }
    const expectedCode = standard ? normalizeInternalId(standard.internal_id) : '';
    if (!standard || !isValidInternalId(expectedCode)) return;
    let changed = false;
    const before = request.usageLogs;
    const after = before.map(log => {
      const assessment = assessInternalId(log.internalId);
      if (assessment.kind === 'MISSING' || (assessment.kind === 'NORMALIZABLE' && assessment.normalized === expectedCode)) {
        changed = true;
        return { ...log, internalId: expectedCode };
      }
      if (assessment.kind === 'VALID' || assessment.kind === 'NORMALIZABLE') {
        addIssue({
          kind: 'USAGE_REFERENCE', severity: 'WARNING', collection: 'standard_requests', documentId: request.id || '',
          standardId: standard.id, internalId: assessment.normalized, suggestedInternalId: expectedCode,
          message: `Snapshot mã trong nhật ký gắn trong yêu cầu khác mã của chuẩn vật lý; cần đối chiếu thủ công.`,
          autoFixable: false,
        });
      }
      return log;
    });
    if (changed) {
      addChange({
        collection: 'standard_requests', documentId: request.id || '', field: 'usageLogs', before,
        after, reason: 'Đồng bộ snapshot Mã quản lý nội bộ trong nhật ký gắn trong yêu cầu.',
      });
    }
  }

  private registrySnapshot(registry: StandardCodeRegistry): AnyRecord {
    return {
      id: registry.id,
      internal_id: registry.internal_id,
      status: registry.status,
      ...(registry.currentStandardId ? { currentStandardId: registry.currentStandardId } : {}),
      assignmentCount: Number(registry.assignmentCount || 0),
      ...(registry.lastReleasedStandardId ? { lastReleasedStandardId: registry.lastReleasedStandardId } : {}),
    };
  }

  private buildSearchKey(standard: ReferenceStandard, internalId = standard.internal_id): string {
    return [standard.name, standard.canonical_name, standard.original_name, standard.chemical_name, internalId,
      standard.cas_number, standard.product_code, standard.lot_number, standard.manufacturer, standard.id]
      .filter(value => value !== null && value !== undefined && String(value).trim() !== '')
      .join(' ').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim();
  }

  private mergeChanges(changes: StandardInternalIdSyncChange[]): StandardInternalIdSyncChange[] {
    const merged = new Map<string, StandardInternalIdSyncChange>();
    for (const change of changes) {
      const key = `${change.collection}/${change.documentId}/${change.field}`;
      const previous = merged.get(key);
      merged.set(key, previous ? { ...change, before: previous.before } : change);
    }
    return [...merged.values()];
  }

  private timestampValue(value: unknown): number {
    if (typeof value === 'number') return value;
    if (value && typeof value === 'object' && 'toMillis' in value && typeof (value as any).toMillis === 'function') {
      return Number((value as any).toMillis()) || 0;
    }
    return Number(value || 0) || 0;
  }
}
