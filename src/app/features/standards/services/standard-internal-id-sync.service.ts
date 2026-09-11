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
  INTERNAL_ID_SYNC_MAX_CHANGES_PER_BATCH,
  INTERNAL_ID_SYNC_MAX_RULE_ACCESS_COST,
  isCurrentStandardLifecycle,
  isSpecialInternalId,
  isValidInternalId,
  normalizeInternalId,
  planInternalIdBatches,
  StandardSyncPartialFailureError,
  SyncBatchProgress,
} from '../../../shared/utils/standard-internal-id';
import { sanitizeForFirebase } from '../../../shared/utils/utils';

type AnyRecord = Record<string, any>;

interface RegistryEntry {
  rawDocumentId: string;
  canonicalCode: string;
  registry: StandardCodeRegistry;
}

interface RegistryInspectionResult {
  registries: Map<string, StandardCodeRegistry>;
  blockedCodes: Set<string>;
}

/**
 * Read-only first, explicit apply second. This service repairs only
 * deterministic legacy inconsistencies and leaves ambiguous code ownership
 * for a manager to resolve.
 */
@Injectable({ providedIn: 'root' })
export class StandardInternalIdSyncService {
  private fb = inject(FirebaseService);
  private auth = inject(AuthService);

  /** 249 is only the logical change ceiling; rule-access cost is capped separately. */
  private readonly MAX_APPLY_CHANGES = INTERNAL_ID_SYNC_MAX_CHANGES_PER_BATCH;
  private readonly MAX_RULE_ACCESS_COST = INTERNAL_ID_SYNC_MAX_RULE_ACCESS_COST;
  private readonly NESTED_LOG_READ_CONCURRENCY = 8;
  private readonly PRE_APPLY_SCAN_TIMEOUT_MS = 120_000;

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
    const registryEntries: RegistryEntry[] = registrySnapshot.docs.map(snapshot => ({
      rawDocumentId: snapshot.id,
      canonicalCode: normalizeInternalId(snapshot.id),
      registry: { id: snapshot.id, ...snapshot.data() } as StandardCodeRegistry,
    }));
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
          internalId: '',
          message: `${standard.name} chưa có Mã quản lý nội bộ.`,
          detail: 'Mã quản lý nội bộ đang để trống nên hồ sơ chưa thể được đối chiếu với mã duy nhất của phòng.',
          suggestion: 'Đối chiếu nhãn, hồ sơ hoặc vị trí kho rồi nhập mã 4 ký tự bắt đầu A/B/C; riêng nghiệp vụ SDHET nhập đúng SDHET. Không đoán theo tên hoặc số lô.',
          autoFixable: false,
          isCurrentLifecycle: isCurrentStandardLifecycle(standard),
        });
        continue;
      }
      if (assessment.kind === 'INVALID_FORMAT') {
        addIssue({
          kind: 'INVALID_FORMAT', severity: 'ERROR', collection: 'reference_standards', documentId: standard.id,
          internalId: assessment.raw,
          message: `${standard.name}: ${assessment.reason}`,
          detail: `Giá trị đang lưu là “${assessment.raw}”, không khớp quy tắc mã chuẩn sau khi chuẩn hóa thành “${assessment.normalized}”.`,
          suggestion: 'Sửa về mã 4 ký tự bắt đầu A/B/C; nếu đây là nghiệp vụ riêng thì dùng chính xác SDHET. Cần đối chiếu hồ sơ vật lý trước khi nhập.',
          autoFixable: false,
          isCurrentLifecycle: isCurrentStandardLifecycle(standard),
        });
        continue;
      }

      const code = assessment.normalized;
      byCode.set(code, [...(byCode.get(code) || []), standard]);
      if (assessment.kind === 'NORMALIZABLE' && !isSpecialInternalId(code)) {
        addChange({
          collection: 'reference_standards', documentId: standard.id, field: 'internal_id',
          before: assessment.raw, after: code, reason: 'Chuẩn hóa chữ hoa và khoảng trắng của mã hợp lệ.',
        });
        addChange({
          collection: 'reference_standards', documentId: standard.id, field: 'search_key',
          before: standard.search_key ?? null, after: buildSearchKey(standard, code), reason: 'Cập nhật thông tin tìm kiếm sau khi chuẩn hóa mã.',
        });
      }
    }

    const { registries, blockedCodes: blockedRegistryCodes } = this.inspectRegistryEntries(
      registryEntries,
      byId,
      byCode,
      addIssue,
      addChange,
    );

    for (const [code, records] of byCode.entries()) {
      // SDHET is a business marker rather than an exclusive physical-code
      // slot. Keep it in byCode for legacy reference resolution, but do not
      // produce duplicate-owner or registry warnings for it.
      if (isSpecialInternalId(code)) continue;
      const currentRecords = records.filter(isCurrentStandardLifecycle);
      const registry = registries.get(code);
      if (currentRecords.length > 1) {
        currentRecords.forEach(record => addIssue({
          kind: 'DUPLICATE_ACTIVE', severity: 'ERROR', collection: 'reference_standards', documentId: record.id,
          standardId: record.id, internalId: code,
          message: `Mã ${code} đang được dùng đồng thời cho nhiều chuẩn vật lý; không tự động chọn bản ghi nào là hiện tại.`,
          detail: `Có ${currentRecords.length} hồ sơ còn trong vòng đời hiện tại cùng mang mã ${code}; sổ mã không thể xác định một hồ sơ đang giữ mã duy nhất.`,
          suggestion: 'Đối chiếu từng hồ sơ/lô, đóng vòng đời bản ghi cũ nếu phù hợp hoặc sửa mã của bản ghi nhập nhầm; sau đó quét lại trước khi đồng bộ.',
          autoFixable: false,
        }));
        continue;
      }

      if (blockedRegistryCodes.has(code)) continue;

      if (currentRecords.length === 1) {
        const current = currentRecords[0];
        if (registry?.status === 'CONFLICT') {
          addIssue({
            kind: 'REGISTRY_MISMATCH', severity: 'ERROR', collection: 'standard_code_registry', documentId: code,
            standardId: current.id, internalId: code,
            message: `Sổ mã ${code} đang ở trạng thái xung đột.`,
            detail: 'Mục tương ứng trong sổ mã đang xung đột nên chưa thể xác định hồ sơ đang giữ mã.',
            suggestion: 'Mở nhóm Sổ mã, đối chiếu lịch sử cấp/trả mã và xử lý xung đột nghiệp vụ trước khi đồng bộ lại.',
            autoFixable: false,
          });
        } else if (registry?.status === 'ASSIGNED' && registry.currentStandardId && registry.currentStandardId !== current.id) {
          const registryOwner = byId.get(registry.currentStandardId);
          addIssue({
            kind: 'REGISTRY_MISMATCH', severity: 'ERROR', collection: 'standard_code_registry', documentId: code,
            standardId: current.id, internalId: code,
            message: registryOwner && isCurrentStandardLifecycle(registryOwner)
              ? `Sổ mã ${code} đang liên kết với một hồ sơ hiện tại khác (mã tham chiếu ${registryOwner.id}); cần đối chiếu trước khi thay đổi.`
              : `Sổ mã ${code} đang liên kết với hồ sơ có mã tham chiếu ${registry.currentStandardId} chưa được đối chiếu; cần kiểm tra trước khi thay đổi.`,
            detail: registryOwner && isCurrentStandardLifecycle(registryOwner)
              ? `Hồ sơ đang kiểm tra có mã tham chiếu ${current.id}, trong khi sổ mã đang ghi nhận hồ sơ ${registryOwner.id}.`
              : `Sổ mã đang ghi nhận hồ sơ ${registry.currentStandardId}, nhưng hồ sơ đó chưa được xác nhận là vòng đời hiện tại của mã ${code}.`,
            suggestion: 'Đối chiếu hồ sơ vật lý và trạng thái vòng đời của cả hai bản ghi; chỉ để một chủ sở hữu hiện tại rồi quét lại.',
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
            internalId: code,
            message: `Sổ mã ${code} đang ở trạng thái xung đột.`,
            detail: 'Mã có hồ sơ lịch sử nhưng sổ mã chưa thể chuyển về trạng thái sẵn sàng cấp lại một cách an toàn.',
            suggestion: 'Kiểm tra các vòng đời đã đóng và lịch sử cấp mã; chỉ cập nhật sổ mã sau khi xác nhận không còn hồ sơ hiện tại đang giữ mã.',
            autoFixable: false,
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
              ? `Sổ mã ${code} đang liên kết với một hồ sơ hiện tại khác với dữ liệu mã; cần xử lý xung đột.`
              : `Sổ mã ${code} vẫn đang ghi nhận một hồ sơ hiện tại nhưng không tìm thấy vòng đời đang mở.`,
            detail: registryOwner && isCurrentStandardLifecycle(registryOwner)
              ? `Các hồ sơ cùng mã ${code} không khớp với hồ sơ đang giữ mã được sổ mã ghi nhận.`
              : `Sổ mã vẫn ghi nhận mã ${code} là đã cấp nhưng không có hồ sơ hiện tại tương ứng.`,
            suggestion: 'Đối chiếu sổ mã với từng hồ sơ; chưa cấp lại mã cho hồ sơ mới cho đến khi xung đột được xử lý.',
            autoFixable: false,
          });
        }
      }
    }

    // Also report structurally valid registry rows that have no physical-code
    // record at all. Invalid/mismatched rows were already classified above.
    for (const [code, registry] of registries.entries()) {
      if (isSpecialInternalId(code)) continue;
      if (blockedRegistryCodes.has(code) || registry.status !== 'ASSIGNED' || byCode.has(code)) continue;
      const owner = registry.currentStandardId ? byId.get(registry.currentStandardId) : undefined;
      addIssue({
        kind: 'REGISTRY_MISMATCH', severity: 'ERROR', collection: 'standard_code_registry', documentId: code,
        standardId: registry.currentStandardId, internalId: code,
        message: owner
          ? `Sổ mã ${code} liên kết với hồ sơ ${owner.id} nhưng hồ sơ này không có mã hợp lệ tương ứng.`
          : `Sổ mã ${code} liên kết với hồ sơ không tồn tại trong danh mục chuẩn.`,
        detail: owner
          ? `Sổ mã đang giữ mã ${code}, nhưng mã trên hồ sơ ${owner.id} không hợp lệ hoặc không khớp.`
          : `Sổ mã đang liên kết với hồ sơ ${registry.currentStandardId || '(không xác định)'}, nhưng không tìm thấy hồ sơ tương ứng.`,
        suggestion: 'Đối chiếu hồ sơ được sổ mã liên kết và lịch sử cấp mã; cập nhật theo quy trình nghiệp vụ phù hợp và giữ nguyên lịch sử truy vết.',
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
    // Read several parents at once to avoid serial latency, but keep a hard
    // concurrency ceiling so a large inventory does not burst Firestore.
    const nestedLogSnapshots = await this.mapWithConcurrency(
      standards,
      this.NESTED_LOG_READ_CONCURRENCY,
      async standard => ({
        standard,
        logsSnapshot: await getDocs(collection(this.fb.db, `${base}/reference_standards/${standard.id}/logs`)),
      }),
    );
    for (const { standard, logsSnapshot } of nestedLogSnapshots) {
      nestedUsageCount += logsSnapshot.size;
      for (const logSnapshot of logsSnapshot.docs) {
        const rawLogData = logSnapshot.data() as AnyRecord;
        const log = { id: logSnapshot.id, ...rawLogData };
        this.inspectReferenceSnapshot(
          'reference_standard_logs', `${standard.id}::${logSnapshot.id}`, log, byId, byCode, addIssue, addChange, 'internalId', standard.id
        );
      }
    }

    const blockingIssues = issues.filter(issue => issue.blocking || (!issue.autoFixable && issue.severity === 'ERROR'));
    const byCollection: Record<string, number> = {};
    const byKind: Record<string, number> = {};
    for (const issue of issues) {
      byCollection[issue.collection] = (byCollection[issue.collection] || 0) + 1;
      byKind[issue.kind] = (byKind[issue.kind] || 0) + 1;
    }
    const manualIssuesCount = issues.filter(issue =>
      issue.collection === 'reference_standards' && (issue.kind === 'MISSING' || issue.kind === 'INVALID_FORMAT')
    ).length;

    const summary = {
      totalIssues: issues.length,
      blockingIssuesCount: blockingIssues.length,
      safeChangesCount: safeChanges.length,
      manualIssuesCount,
      byCollection,
      byKind,
    };

    return {
      scanId: `scan-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      generatedAt: Date.now(),
      standardsCount: standards.length,
      requestsCount: requests.length,
      purchaseRequestsCount: purchaseRequests.length,
      usageCount: globalUsages.length,
      nestedUsageCount,
      registryCount: registryEntries.length,
      issues,
      safeChanges,
      conflicts: issues.filter(issue => !issue.autoFixable || issue.severity === 'ERROR'),
      blockingIssues,
      summary,
    };
  }

  async apply(
    report: StandardInternalIdSyncReport,
    corrections: Record<string, string> = {},
    selectedChangeKeys?: readonly string[],
    onProgress?: (progress: SyncBatchProgress) => void,
  ): Promise<string[]> {
    if (!this.auth.canEditStandards()) throw new Error('Bạn không có quyền áp dụng đồng bộ Mã quản lý nội bộ.');

    onProgress?.({
      currentBatch: 0,
      totalBatches: 0,
      completedChanges: 0,
      totalChanges: 0,
      percent: 0,
      phase: 'PREPARING',
      message: 'Đang kiểm tra tính hợp lệ của các mã sửa...',
    });

    // Preflight check: validate corrections dictionary format and duplicate target codes within this batch
    const targetToStandards = new Map<string, string[]>();
    for (const [standardId, rawCode] of Object.entries(corrections)) {
      const trimmed = String(rawCode || '').trim();
      if (!trimmed) continue;
      const targetCode = normalizeInternalId(trimmed);
      if (!isValidInternalId(targetCode)) {
        throw new Error(`Mã sửa “${rawCode}” cho hồ sơ ${standardId} không đúng định dạng (4 ký tự bắt đầu A/B/C hoặc SDHET).`);
      }
      const list = targetToStandards.get(targetCode) || [];
      list.push(standardId);
      targetToStandards.set(targetCode, list);
    }

    for (const [targetCode, stdIds] of targetToStandards.entries()) {
      if (!isSpecialInternalId(targetCode) && stdIds.length > 1) {
        throw new Error(`Mã ${targetCode} bị nhập trùng cho ${stdIds.length} hồ sơ (${stdIds.join(', ')}); mỗi hồ sơ phải có một mã duy nhất.`);
      }
    }

    onProgress?.({
      currentBatch: 0,
      totalBatches: 0,
      completedChanges: 0,
      totalChanges: 0,
      percent: 5,
      phase: 'RE_SCANNING',
      message: 'Đang quét tươi lại toàn bộ dữ liệu trước khi ghi...',
    });

    // Re-scan immediately before writing so a stale preview cannot overwrite a
    // newly assigned code or a newly created request.
    const freshReport = await this.withTimeout(
      this.scan(),
      this.PRE_APPLY_SCAN_TIMEOUT_MS,
      'Quét tươi dữ liệu trước khi đồng bộ mất quá lâu. Chưa có thay đổi nào được ghi; hãy kiểm tra kết nối rồi thử lại.',
    );
    const selectedKeys = selectedChangeKeys ? new Set(selectedChangeKeys) : null;
    const changes = freshReport.safeChanges.filter(change =>
      !selectedKeys || selectedKeys.has(this.safeChangeKey(change))
    );
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
      if (!isSpecialInternalId(targetCode) && freshReport.conflicts.some(issue =>
        issue.kind === 'DUPLICATE_ACTIVE' && normalizeInternalId(issue.internalId) === targetCode
      )) {
        throw new Error(`Mã ${targetCode} đang có nhiều chủ sở hữu hiện tại; không thể gán thủ công cho đến khi xử lý xung đột.`);
      }

      // The correction path repairs legacy values, so an equality query on
      // the canonical code could miss a lower-case/whitespace owner. This is
      // intentionally a full read only for an explicit manual correction.
      if (!isSpecialInternalId(targetCode)) {
        const duplicateSnapshot = await getDocs(standardsCollection);
        const duplicateCurrent = duplicateSnapshot.docs
          .map(snapshot => ({ id: snapshot.id, ...snapshot.data() } as ReferenceStandard))
          .filter(candidate => candidate.id !== standardId && isCurrentStandardLifecycle(candidate))
          .filter(candidate => normalizeInternalId(candidate.internal_id) === targetCode);
        if (duplicateCurrent.length > 0) {
          throw new Error(`Mã ${targetCode} đã có chuẩn hiện tại khác; không thể gán tự động.`);
        }
      }

      changes.push({
        collection: 'reference_standards', documentId: standardId, field: 'internal_id',
        before: standard.internal_id ?? null, after: targetCode, reason: 'Mã sửa thủ công sau khi người quản lý đối chiếu hồ sơ.',
      });
      changes.push({
        collection: 'reference_standards', documentId: standardId, field: 'search_key',
        before: standard.search_key ?? null, after: this.buildSearchKey(standard, targetCode), reason: 'Cập nhật khóa tìm kiếm theo mã sửa thủ công.',
      });
      if (isCurrentStandardLifecycle(standard) && !isSpecialInternalId(targetCode)) {
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

    // Plan atomic clusters and batch chunks using the shared batch planner
    const batchPlan = planInternalIdBatches(
      mergedChanges,
      this.MAX_APPLY_CHANGES,
      this.MAX_RULE_ACCESS_COST,
    );
    const currentUser = this.auth.currentUser();
    const batchIds: string[] = [];
    const totalBatches = batchPlan.totalBatches;
    const totalChanges = batchPlan.totalChanges;
    let completedChanges = 0;
    let currentBatchIndex = 0;

    try {
      for (let i = 0; i < batchPlan.chunks.length; i++) {
        currentBatchIndex = i;
        const chunkPlan = batchPlan.chunks[i];
        const chunk = chunkPlan.changes;

        // Progress: Preflight validation for this chunk
        onProgress?.({
          currentBatch: i + 1,
          totalBatches,
          completedChanges,
          totalChanges,
          percent: Math.round((completedChanges / totalChanges) * 100),
          phase: 'PREFLIGHT_CHECK',
          currentBatchChangeCount: chunkPlan.changeCount,
          message: `Đang kiểm tra an toàn dữ liệu đợt ${i + 1}/${totalBatches}...`,
        });

        // Preflight Chunk Validation: verify physical standards in this chunk
        // have not been concurrently edited since the re-scan.
        const standardChangesInChunk = chunk.filter(c => c.collection === 'reference_standards' && c.field === 'internal_id');
        if (standardChangesInChunk.length > 0) {
          const preflightChecks = await Promise.all(
            standardChangesInChunk.map(async sc => {
              const snap = await getDoc(doc(this.fb.db, `${base}/reference_standards/${sc.documentId}`));
              return { sc, snap };
            })
          );
          for (const { sc, snap } of preflightChecks) {
            if (!snap.exists()) {
              throw new Error(`Hồ sơ chuẩn ${sc.documentId} không còn tồn tại khi chuẩn bị xử lý đợt ${i + 1}.`);
            }
            const data = snap.data() as ReferenceStandard;
            const currentInternalId = data.internal_id ?? null;
            if (currentInternalId !== sc.before && normalizeInternalId(currentInternalId) !== normalizeInternalId(sc.before)) {
              throw new Error(`Hồ sơ chuẩn ${sc.documentId} đã bị thay đổi đồng thời (mã hiện tại: ${currentInternalId || '(trống)'}, dự kiến: ${sc.before || '(trống)'}).`);
            }
          }
        }

        // Progress: Committing batch
        onProgress?.({
          currentBatch: i + 1,
          totalBatches,
          completedChanges,
          totalChanges,
          percent: Math.round((completedChanges / totalChanges) * 100),
          phase: 'COMMITTING_BATCH',
          currentBatchChangeCount: chunkPlan.changeCount,
          message: `Đang áp dụng đợt ${i + 1}/${totalBatches} (${chunkPlan.changeCount} thay đổi)...`,
        });

        const batchRef = doc(collection(this.fb.db, `${base}/standard_code_sync_batches`));
        const batch = writeBatch(this.fb.db);
        const updates = new Map<string, { ref: any; fields: AnyRecord; registryDocument?: AnyRecord; registryMigration?: AnyRecord }>();

        for (const change of chunk) {
          const key = `${change.collection}/${change.documentId}`;
          const entry = updates.get(key) || { ref: null, fields: {} };
          if (change.collection === 'standard_code_registry') {
            entry.ref = doc(this.fb.db, `${base}/standard_code_registry/${change.documentId}`);
            if (change.field === '__migration__') {
              entry.registryMigration = {
                ...(change.after as AnyRecord),
                migratedAt: serverTimestamp(),
                lastUpdated: serverTimestamp(),
              };
            } else {
              entry.registryDocument = { ...(change.after as AnyRecord), lastUpdated: serverTimestamp() };
            }
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
          if (entry.registryMigration) {
            batch.set(entry.ref, entry.registryMigration, { merge: true });
          } else if (entry.registryDocument) {
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
          recordCount: chunk.length,
          changes: [...chunk],
        };
        batch.set(batchRef, sanitizeForFirebase({
          ...auditBatch,
          createdAt: serverTimestamp(),
          createdBy: currentUser?.uid || '',
          createdByName: currentUser?.displayName || currentUser?.email || 'Người dùng',
        }));

        await batch.commit();
        batchIds.push(batchRef.id);
        completedChanges += chunkPlan.changeCount;

        // Progress: Batch completed
        onProgress?.({
          currentBatch: i + 1,
          totalBatches,
          completedChanges,
          totalChanges,
          percent: Math.round((completedChanges / totalChanges) * 100),
          phase: 'BATCH_COMPLETED',
          currentBatchId: batchRef.id,
          currentBatchChangeCount: chunkPlan.changeCount,
          message: `Đã hoàn thành đợt ${i + 1}/${totalBatches}.`,
        });
      }
    } catch (err: unknown) {
      if (batchIds.length > 0) {
        throw new StandardSyncPartialFailureError(
          `Đã áp dụng thành công ${batchIds.length}/${totalBatches} đợt xử lý (${completedChanges}/${totalChanges} thay đổi). Đợt ${currentBatchIndex + 1} bị gián đoạn: ${(err as any)?.message || 'Lỗi mạng hoặc dữ liệu'}.`,
          batchIds,
          completedChanges,
          currentBatchIndex + 1,
          totalBatches,
          err,
        );
      }
      throw err;
    }

    onProgress?.({
      currentBatch: totalBatches,
      totalBatches,
      completedChanges: totalChanges,
      totalChanges,
      percent: 100,
      phase: 'ALL_COMPLETED',
      message: `Đã đồng bộ thành công toàn bộ ${totalBatches} đợt xử lý (${totalChanges} thay đổi).`,
    });

    return batchIds;
  }

  private async mapWithConcurrency<T, R>(
    items: readonly T[],
    concurrency: number,
    task: (item: T, index: number) => Promise<R>,
  ): Promise<R[]> {
    if (items.length === 0) return [];
    const workerCount = Math.max(1, Math.min(Math.floor(concurrency) || 1, items.length));
    const results = new Array<R>(items.length);
    let nextIndex = 0;

    const worker = async (): Promise<void> => {
      while (true) {
        const index = nextIndex++;
        if (index >= items.length) return;
        results[index] = await task(items[index], index);
      }
    };

    await Promise.all(Array.from({ length: workerCount }, () => worker()));
    return results;
  }

  private async withTimeout<T>(operation: Promise<T>, timeoutMs: number, message: string): Promise<T> {
    if (!timeoutMs || timeoutMs <= 0) return operation;
    let timeoutHandle: ReturnType<typeof setTimeout> | null = null;
    try {
      return await Promise.race([
        operation,
        new Promise<never>((_, reject) => {
          timeoutHandle = setTimeout(() => reject(new Error(message)), timeoutMs);
        }),
      ]);
    } finally {
      if (timeoutHandle) clearTimeout(timeoutHandle);
    }
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
    parentStandardId?: string,
  ): void {
    const rawStandardId = data['standardId'] !== undefined && data['standardId'] !== null
      ? String(data['standardId']).trim()
      : '';

    let standard: ReferenceStandard | undefined;
    let standardIdRepair: {
      before: string | null;
      after: string;
      reason: string;
    } | null = null;

    if (parentStandardId) {
      // Nested log under reference_standards/{parentStandardId}/logs/{logId}
      const parentStandard = byId.get(parentStandardId);
      if (!rawStandardId) {
        // Field is genuinely missing in the nested document data.
        // Auto-repair is permitted since parent path is the Source of Truth,
        // but it MUST be explicitly recorded as a safeChange / audit.
        standardIdRepair = {
          before: null,
          after: parentStandardId,
          reason: 'Bổ sung liên kết hồ sơ chất chuẩn còn thiếu cho nhật ký thuộc hồ sơ cha.',
        };
        standard = parentStandard;
      } else {
        // Field is present in nested document data
        if (rawStandardId === parentStandardId) {
          standard = parentStandard;
        } else {
          // Check if rawStandardId is the legacy internal code of parent standard and resolves uniquely to parentStandardId
          const codeMatches = byCode.get(normalizeInternalId(rawStandardId)) || [];
          const nonDeleted = codeMatches.filter(c => !c._isDeleted && c.status !== 'DELETED');
          if (nonDeleted.length === 1 && nonDeleted[0].id === parentStandardId) {
            standard = nonDeleted[0];
            standardIdRepair = {
              before: rawStandardId,
              after: parentStandardId,
              reason: 'Sửa liên kết cũ trong nhật ký về đúng hồ sơ chất chuẩn duy nhất đã đối chiếu.',
            };
          } else {
            if (isSpecialInternalId(rawStandardId)) return;
            // StandardId inside nested document differs from parent standard!
            addIssue({
              kind: 'PARENT_REFERENCE_MISMATCH',
              severity: 'ERROR',
              blocking: true,
              collection: collectionName,
              documentId,
              parentStandardId,
              referencedStandardId: rawStandardId,
              message: `Nhật ký thuộc hồ sơ ${parentStandardId} nhưng đang liên kết với hồ sơ ${rawStandardId}.`,
              detail: `Vị trí lưu của nhật ký cho thấy nhật ký thuộc hồ sơ ${parentStandardId}, trong khi nội dung đang tham chiếu tới ${rawStandardId}.`,
              suggestion: 'Đối chiếu nội dung nhật ký để xác định nhật ký thuộc về chuẩn nào; không tự động sửa để tránh gán sai lịch sử sử dụng.',
              autoFixable: false,
            });
            return;
          }
        }
      }
    } else {
      // Top-level reference without parent fallback (standard_requests, purchase_requests, standard_usages)
      if (!rawStandardId) {
        // A shared SDHET marker cannot identify one physical standard. Do not
        // turn that business marker into a missing-reference warning; normal
        // A/B/C references still use the strict link check below.
        if (isSpecialInternalId(data[internalField])) return;
        addIssue({
          kind: 'MISSING_REFERENCE',
          severity: 'ERROR',
          blocking: true,
          collection: collectionName,
          documentId,
          message: `${this.collectionLabel(collectionName)} ${documentId} chưa liên kết tới hồ sơ chất chuẩn.`,
          detail: 'Chưa thể xác định hồ sơ chất chuẩn nào đang được sử dụng hoặc yêu cầu từ thông tin hiện có.',
          suggestion: 'Đối chiếu mã quản lý nội bộ, tên chuẩn hoặc số lô trên phiếu nghiệp vụ để bổ sung liên kết chính xác; hệ thống không tự đoán.',
          autoFixable: false,
        });
        return;
      }

      standard = byId.get(rawStandardId);
      if (!standard) {
        const codeMatches = byCode.get(normalizeInternalId(rawStandardId)) || [];
        const nonDeleted = codeMatches.filter(candidate => !candidate._isDeleted && candidate.status !== 'DELETED');
        if (nonDeleted.length === 1) {
          standard = nonDeleted[0];
          standardIdRepair = {
            before: rawStandardId,
            after: standard.id,
            reason: 'Sửa liên kết cũ về đúng hồ sơ chất chuẩn; chỉ áp dụng khi đối chiếu được duy nhất một hồ sơ.',
          };
        } else {
          if (isSpecialInternalId(rawStandardId)) return;
          addIssue({
            kind: 'REQUEST_REFERENCE',
            severity: 'ERROR',
            blocking: true,
            collection: collectionName,
            documentId,
            internalId: rawStandardId,
            message: nonDeleted.length > 1
              ? `Tham chiếu ${rawStandardId} trùng nhiều vòng đời; không được tự đoán.`
              : `Không tìm thấy chuẩn vật lý cho tham chiếu ${rawStandardId}.`,
            detail: nonDeleted.length > 1
              ? `Mã/tham chiếu ${rawStandardId} khớp ${nonDeleted.length} hồ sơ không thể phân biệt bằng khóa hiện tại.`
              : `Mã tham chiếu “${rawStandardId}” không khớp hồ sơ hoặc Mã quản lý nội bộ nào trong danh mục.`,
            suggestion: 'Đối chiếu yêu cầu hoặc nhật ký sử dụng với hồ sơ chất chuẩn bằng mã tham chiếu, Mã quản lý nội bộ, tên và số lô; chỉ sửa khi xác định được đúng một hồ sơ.',
            autoFixable: false,
          });
          return;
        }
      }
    }

    if (!standard) return;

    const expectedCode = normalizeInternalId(standard.internal_id);
    if (!isValidInternalId(expectedCode)) {
      addIssue({
        kind: collectionName === 'standard_usages' || collectionName === 'reference_standard_logs' ? 'USAGE_REFERENCE' : 'REQUEST_REFERENCE',
        severity: 'ERROR',
        blocking: true,
        collection: collectionName,
        documentId,
        standardId: standard.id,
        message: `Chuẩn được tham chiếu (${standard.id}) chưa có Mã quản lý nội bộ hợp lệ.`,
        detail: `Hồ sơ ${standard.id} đang có giá trị “${standard.internal_id || '(trống)'}”, nên mã đã lưu ở các dữ liệu liên quan chưa thể được đồng bộ an toàn.`,
        suggestion: 'Sửa mã trên hồ sơ trước theo quy tắc 4 ký tự A/B/C hoặc ngoại lệ SDHET, sau đó quét lại các yêu cầu và nhật ký.',
        autoFixable: false,
      });
      return;
    }

    if (standardIdRepair) {
      addChange({
        collection: collectionName,
        documentId,
        field: 'standardId',
        ...standardIdRepair,
      });
    }

    const currentValue = data[internalField];
    const assessment = assessInternalId(currentValue);
    if (assessment.kind === 'MISSING') {
      addChange({
        collection: collectionName,
        documentId,
        field: internalField,
        before: null,
        after: expectedCode,
        reason: 'Bổ sung Mã quản lý nội bộ đã lưu từ hồ sơ chất chuẩn được tham chiếu.',
      });
    } else if ((assessment.kind === 'VALID' || assessment.kind === 'NORMALIZABLE') && assessment.normalized === expectedCode) {
      if (assessment.kind === 'NORMALIZABLE') {
        addChange({
          collection: collectionName,
          documentId,
          field: internalField,
          before: assessment.raw,
          after: expectedCode,
          reason: 'Chuẩn hóa Mã quản lý nội bộ đã lưu.',
        });
      }
    } else {
      // SDHET is intentionally not a historical ownership/snapshot key. A
      // stale snapshot may carry another code (or vice versa) without making
      // the SDHET business record actionable, so do not surface a warning.
      if (isSpecialInternalId(expectedCode) || isSpecialInternalId(assessment.normalized)) return;
      addIssue({
        kind: collectionName === 'standard_usages' || collectionName === 'reference_standard_logs' ? 'USAGE_REFERENCE' : 'REQUEST_REFERENCE',
        severity: 'WARNING',
        blocking: false,
        collection: collectionName,
        documentId,
        standardId: standard.id,
        internalId: String(currentValue || ''),
        suggestedInternalId: expectedCode,
        message: `Mã đã lưu “${String(currentValue || '(trống)')}” khác mã của hồ sơ chất chuẩn đang được tham chiếu; cần đối chiếu thủ công.`,
        detail: `Giá trị đang lưu là “${String(currentValue || '(trống)')}”, còn Mã quản lý nội bộ hiện tại của hồ sơ ${standard.id} là “${expectedCode}”.`,
        suggestion: `Nếu giá trị đã lưu bị ghi sai, sửa về ${expectedCode}; nếu đó là mã lịch sử đúng tại thời điểm phát sinh, giữ nguyên và ghi chú nghiệp vụ thay vì tự đổi.`,
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
    if (!standard && request['standardId']) {
      const codeMatches = byCode.get(normalizeInternalId(request['standardId'])) || [];
      if (codeMatches.length === 1) standard = codeMatches[0];
    }
    const expectedCode = standard ? normalizeInternalId(standard.internal_id) : '';
    if (!standard || !isValidInternalId(expectedCode)) return;

    let changed = false;
    const before = request.usageLogs;
    const after = before.map((log: any, index: number) => {
      if (log.standardId && log.standardId !== standard!.id) {
        const embeddedMatch = byId.get(log.standardId);
        const isMismatch = !embeddedMatch || embeddedMatch.id !== standard!.id;
        if (isMismatch) {
          if (isSpecialInternalId(log.standardId)) return log;
          addIssue({
            kind: 'PARENT_REFERENCE_MISMATCH',
            severity: 'ERROR',
            blocking: true,
            collection: 'standard_requests',
            documentId: request.id || '',
            parentStandardId: standard!.id,
            referencedStandardId: log.standardId,
            message: `Nhật ký thứ ${index + 1} trong yêu cầu ${request.id} đang liên kết với hồ sơ ${log.standardId}, khác hồ sơ ${standard!.id} của yêu cầu.`,
            detail: `Liên kết hồ sơ trong nhật ký không khớp với hồ sơ chất chuẩn được ghi nhận trên yêu cầu ${request.id}.`,
            suggestion: 'Đối chiếu nhật ký mượn và sửa lại liên kết hồ sơ cho đồng nhất.',
            autoFixable: false,
          });
          return log;
        }
      }

      const assessment = assessInternalId(log.internalId);
      if (assessment.kind === 'MISSING' || (assessment.kind === 'NORMALIZABLE' && assessment.normalized === expectedCode)) {
        changed = true;
        return { ...log, internalId: expectedCode };
      }
      if (assessment.kind === 'VALID' || assessment.kind === 'NORMALIZABLE') {
        if (assessment.normalized !== expectedCode) {
          if (isSpecialInternalId(expectedCode) || isSpecialInternalId(assessment.normalized)) return log;
          addIssue({
            kind: 'USAGE_REFERENCE',
            severity: 'WARNING',
            blocking: false,
            collection: 'standard_requests',
            documentId: request.id || '',
            standardId: standard!.id,
            internalId: assessment.normalized,
            suggestedInternalId: expectedCode,
            message: `Mã đã lưu trong nhật ký của yêu cầu khác mã của hồ sơ chất chuẩn; cần đối chiếu thủ công.`,
            detail: `Giá trị trong nhật ký là “${assessment.normalized}”, nhưng hồ sơ ${standard!.id} đang có mã “${expectedCode}”.`,
            suggestion: `Nếu nhật ký bị ghi sai, sửa về ${expectedCode}; nếu đây là giá trị lịch sử có chủ đích, giữ nguyên và xác nhận với nghiệp vụ trước khi thay đổi.`,
            autoFixable: false,
          });
        }
      }
      return log;
    });
    if (changed) {
      addChange({
        collection: 'standard_requests',
        documentId: request.id || '',
        field: 'usageLogs',
        before,
        after,
        reason: 'Đồng bộ Mã quản lý nội bộ đã lưu trong nhật ký của yêu cầu.',
      });
    }
  }

  private inspectRegistryEntries(
    entries: RegistryEntry[],
    byId: Map<string, ReferenceStandard>,
    byCode: Map<string, ReferenceStandard[]>,
    addIssue: (issue: Omit<StandardInternalIdSyncIssue, 'id'>) => StandardInternalIdSyncIssue,
    addChange: (change: StandardInternalIdSyncChange) => void,
  ): RegistryInspectionResult {
    const groups = new Map<string, RegistryEntry[]>();
    const registries = new Map<string, StandardCodeRegistry>();
    const blockedCodes = new Set<string>();

    for (const entry of entries) {
      groups.set(entry.canonicalCode, [...(groups.get(entry.canonicalCode) || []), entry]);
    }

    for (const [canonicalCode, group] of groups.entries()) {
      // There may be legacy ledger rows for SDHET from before it became a
      // non-exclusive business marker. Leave those rows untouched and silent;
      // SDHET must not create registry migration or ownership warnings.
      if (isSpecialInternalId(canonicalCode)) continue;
      const migratedAliases = group.filter(entry => this.isMigratedRegistryAlias(entry, canonicalCode));
      const activeEntries = group.filter(entry => !this.isMigratedRegistryAlias(entry, canonicalCode));

      for (const alias of migratedAliases) {
        const canonicalExists = activeEntries.some(entry => entry.rawDocumentId === canonicalCode);
        addIssue({
          kind: 'REGISTRY_KEY_MISMATCH',
          severity: canonicalExists ? 'INFO' : 'ERROR',
          blocking: !canonicalExists,
          collection: 'standard_code_registry',
          documentId: alias.rawDocumentId,
          internalId: canonicalCode,
          rawDocumentId: alias.rawDocumentId,
          canonicalDocumentId: canonicalCode,
          message: canonicalExists
            ? `Mục dữ liệu cũ ${alias.rawDocumentId} được giữ lại để tham chiếu tới mã ${canonicalCode}.`
            : `Mục dữ liệu cũ ${alias.rawDocumentId} đã được đánh dấu chuyển sang mã ${canonicalCode}, nhưng chưa có bản ghi chuẩn tương ứng.`,
          detail: canonicalExists
            ? 'Dữ liệu nguồn vẫn được giữ lại để bảo toàn lịch sử và không còn tham gia xác định hồ sơ đang giữ mã.'
            : 'Bản ghi tham chiếu đã chuyển đổi chưa có bản ghi chuẩn tương ứng nên sổ mã chưa nhất quán.',
          suggestion: canonicalExists
            ? 'Không cần thao tác; giữ mục dữ liệu cũ để phục vụ truy vết.'
            : `Khôi phục hoặc tạo bản ghi chuẩn cho mã ${canonicalCode} sau khi xác minh hồ sơ đang giữ mã; giữ nguyên dữ liệu nguồn.`,
          autoFixable: false,
        });
        if (!canonicalExists) blockedCodes.add(canonicalCode);
      }

      if (activeEntries.length > 1) {
        blockedCodes.add(canonicalCode);
        for (const entry of activeEntries) {
          addIssue({
            kind: 'REGISTRY_KEY_MISMATCH',
            severity: 'ERROR',
            blocking: true,
            collection: 'standard_code_registry',
            documentId: entry.rawDocumentId,
            internalId: canonicalCode,
            rawDocumentId: entry.rawDocumentId,
            canonicalDocumentId: canonicalCode,
            message: `Có nhiều mục trong sổ mã cùng quy về mã ${canonicalCode}; hệ thống chưa thể tự chọn bản ghi chính.`,
            detail: `Các mục cần đối chiếu: ${activeEntries.map(item => item.rawDocumentId).join(', ')}.`,
            suggestion: 'Đối chiếu lịch sử sổ mã và hồ sơ thực tế đang giữ mã; sau khi xác định bản ghi chính mới chuyển các mục còn lại thành bản ghi tham chiếu lịch sử.',
            autoFixable: false,
          });
        }
        continue;
      }

      if (activeEntries.length === 0) continue;
      const entry = activeEntries[0];
      const registry = entry.registry;
      const normalizedInternalId = normalizeInternalId(registry.internal_id);

      if (!isValidInternalId(canonicalCode)) {
        blockedCodes.add(canonicalCode);
        addIssue({
          kind: 'REGISTRY_KEY_MISMATCH', severity: 'ERROR', blocking: true,
          collection: 'standard_code_registry', documentId: entry.rawDocumentId,
          internalId: canonicalCode, rawDocumentId: entry.rawDocumentId, canonicalDocumentId: canonicalCode,
          message: `Mục ${entry.rawDocumentId} trong sổ mã không thể quy về Mã quản lý nội bộ hợp lệ.`,
          detail: `Giá trị sau khi chuẩn hóa là “${canonicalCode || '(trống)'}”, không khớp quy tắc mã hiện hành.`,
          suggestion: 'Đối chiếu lịch sử tạo sổ mã và hồ sơ liên quan để xác định mã đúng trước khi sửa.',
          autoFixable: false,
        });
        continue;
      }

      if (normalizedInternalId !== canonicalCode) {
        blockedCodes.add(canonicalCode);
        addIssue({
          kind: 'REGISTRY_KEY_MISMATCH', severity: 'ERROR', blocking: true,
          collection: 'standard_code_registry', documentId: entry.rawDocumentId,
          internalId: String(registry.internal_id || ''), rawDocumentId: entry.rawDocumentId, canonicalDocumentId: canonicalCode,
          message: `Mã của mục sổ mã ${entry.rawDocumentId} không khớp với Mã quản lý nội bộ được lưu bên trong.`,
          detail: `Mã của mục quy về ${canonicalCode}, trong khi Mã quản lý nội bộ bên trong quy về ${normalizedInternalId || '(trống)'}.`,
          suggestion: 'Đối chiếu lịch sử truy vết và hồ sơ chất chuẩn để xác định giá trị đúng trước khi sửa.',
          autoFixable: false,
        });
        continue;
      }

      const state = this.validateRegistryState(entry, canonicalCode, byId, byCode, addIssue);
      if (state.blocked) {
        blockedCodes.add(canonicalCode);
        continue;
      }

      if (entry.rawDocumentId !== canonicalCode) {
        const canonicalAfter = this.canonicalRegistryAfter(registry, canonicalCode, byId, byCode);
        if (!canonicalAfter) {
          blockedCodes.add(canonicalCode);
          addIssue({
            kind: 'REGISTRY_KEY_MISMATCH', severity: 'ERROR', blocking: true,
            collection: 'standard_code_registry', documentId: entry.rawDocumentId,
            internalId: canonicalCode, rawDocumentId: entry.rawDocumentId, canonicalDocumentId: canonicalCode,
            message: `Mục sổ mã ${entry.rawDocumentId} cần chuyển về mã chuẩn ${canonicalCode}, nhưng trạng thái hiện tại chưa cho phép chuyển an toàn.`,
            detail: 'Chưa thể tạo bản ghi chuẩn mà vẫn bảo đảm đúng hồ sơ đang giữ mã và trạng thái vòng đời hiện tại.',
            suggestion: 'Đối chiếu hồ sơ đang giữ mã và trạng thái vòng đời trước; giữ nguyên dữ liệu nguồn cho đến khi có thể chuyển đổi an toàn.',
            autoFixable: false,
          });
          continue;
        }

        addIssue({
          kind: 'REGISTRY_KEY_MISMATCH', severity: 'WARNING', blocking: false,
          collection: 'standard_code_registry', documentId: entry.rawDocumentId,
          internalId: canonicalCode, rawDocumentId: entry.rawDocumentId, canonicalDocumentId: canonicalCode,
          message: `Mục sổ mã cũ ${entry.rawDocumentId} sẽ được chuyển về mã chuẩn ${canonicalCode} và vẫn giữ dữ liệu nguồn.`,
          detail: 'Bản ghi chuẩn sẽ được tạo hoặc cập nhật trong cùng đợt xử lý; mục dữ liệu cũ được giữ lại để bảo toàn lịch sử truy vết.',
          suggestion: 'Có thể áp dụng chuyển đổi sau khi kiểm tra phần xem trước; dữ liệu nguồn vẫn được giữ nguyên.',
          autoFixable: true,
        });
        addChange({
          collection: 'standard_code_registry', documentId: canonicalCode, field: '__document__',
          before: null, after: canonicalAfter,
          reason: `Tạo bản ghi chuẩn cho mã ${canonicalCode} từ mục dữ liệu nguồn ${entry.rawDocumentId}; giữ nguyên lịch sử nguồn.`,
        });
        addChange({
          collection: 'standard_code_registry', documentId: entry.rawDocumentId, field: '__migration__',
          before: { migrationStatus: registry.migrationStatus ?? null, migratedTo: registry.migratedTo ?? null },
          after: { migrationStatus: 'MIGRATED', migratedTo: canonicalCode },
          reason: `Đánh dấu mục dữ liệu cũ ${entry.rawDocumentId} là bản ghi tham chiếu đã chuyển sang ${canonicalCode}; giữ nguyên dữ liệu nguồn.`,
        });
        registries.set(canonicalCode, { ...registry, id: canonicalCode, internal_id: canonicalCode, ...canonicalAfter } as StandardCodeRegistry);
        continue;
      }

      if (registry.internal_id !== canonicalCode) {
        addIssue({
          kind: 'REGISTRY_KEY_MISMATCH', severity: 'WARNING', blocking: false,
          collection: 'standard_code_registry', documentId: entry.rawDocumentId,
          internalId: canonicalCode, rawDocumentId: entry.rawDocumentId, canonicalDocumentId: canonicalCode,
          message: `Mã quản lý nội bộ của mục ${canonicalCode} chỉ khác chữ hoa/thường hoặc khoảng trắng và có thể chuẩn hóa an toàn.`,
          detail: `Giá trị hiện tại “${String(registry.internal_id)}” chuẩn hóa thành ${canonicalCode}.`,
          suggestion: 'Có thể áp dụng thay đổi đề xuất để đồng nhất Mã quản lý nội bộ với mã chuẩn của mục này.',
          autoFixable: true,
        });
        addChange({
          collection: 'standard_code_registry', documentId: canonicalCode, field: '__document__',
          before: this.registrySnapshot(registry),
          after: { ...this.registrySnapshot(registry), id: canonicalCode, internal_id: canonicalCode },
          reason: 'Chuẩn hóa Mã quản lý nội bộ trong sổ mã theo mã chuẩn của mục dữ liệu.',
        });
      }

      if (registry.status === 'AVAILABLE' && registry.currentStandardId) {
        addChange({
          collection: 'standard_code_registry', documentId: canonicalCode, field: '__document__',
          before: this.registrySnapshot(registry),
          after: { ...this.registrySnapshot(registry), id: canonicalCode, internal_id: canonicalCode, currentStandardId: null },
          reason: 'Gỡ liên kết hồ sơ dư thừa khỏi mục sổ mã đang ở trạng thái sẵn sàng cấp lại.',
        });
      }

      registries.set(canonicalCode, { ...registry, id: canonicalCode, internal_id: canonicalCode });
    }

    return { registries, blockedCodes };
  }

  private validateRegistryState(
    entry: RegistryEntry,
    canonicalCode: string,
    byId: Map<string, ReferenceStandard>,
    byCode: Map<string, ReferenceStandard[]>,
    addIssue: (issue: Omit<StandardInternalIdSyncIssue, 'id'>) => StandardInternalIdSyncIssue,
  ): { blocked: boolean } {
    const registry = entry.registry;
    const status = String(registry.status || '');
    if (!['ASSIGNED', 'AVAILABLE', 'CONFLICT'].includes(status)) {
      addIssue({
        kind: 'REGISTRY_MISMATCH', severity: 'ERROR', blocking: true,
        collection: 'standard_code_registry', documentId: entry.rawDocumentId,
        internalId: canonicalCode, rawDocumentId: entry.rawDocumentId, canonicalDocumentId: canonicalCode,
        message: `Mục ${entry.rawDocumentId} trong sổ mã có trạng thái không hợp lệ.`,
        detail: 'Trạng thái hiện tại không thuộc các trạng thái nghiệp vụ được hệ thống hỗ trợ.',
        suggestion: 'Đối chiếu lịch sử truy vết để xác định trạng thái đúng trước khi sửa.',
        autoFixable: false,
      });
      return { blocked: true };
    }

    if (status === 'CONFLICT') {
      const currentOwners = (byCode.get(canonicalCode) || []).filter(isCurrentStandardLifecycle);
      addIssue({
        kind: 'REGISTRY_MISMATCH', severity: 'ERROR', blocking: true,
        collection: 'standard_code_registry', documentId: entry.rawDocumentId,
        standardId: registry.currentStandardId, internalId: canonicalCode,
        rawDocumentId: entry.rawDocumentId, canonicalDocumentId: canonicalCode,
        message: currentOwners.length === 0
          ? `Sổ mã ${canonicalCode} đang ở trạng thái xung đột nhưng không có hồ sơ hiện tại đang giữ mã.`
          : `Sổ mã ${canonicalCode} đang ở trạng thái xung đột và cần xử lý thủ công.`,
        detail: currentOwners.length === 0
          ? 'Không có hồ sơ vòng đời hiện tại nào giải thích trạng thái xung đột.'
          : `Có ${currentOwners.length} hồ sơ hiện tại mang mã ${canonicalCode}; hệ thống không tự chọn hồ sơ đang giữ mã.`,
        suggestion: 'Đối chiếu lịch sử cấp/trả mã và xử lý xung đột nghiệp vụ trước khi áp dụng các thay đổi khác cho mã này.',
        autoFixable: false,
      });
      return { blocked: true };
    }

    if (status === 'AVAILABLE') return { blocked: false };

    if (!registry.currentStandardId) {
      addIssue({
        kind: 'REGISTRY_MISMATCH', severity: 'ERROR', blocking: true,
        collection: 'standard_code_registry', documentId: entry.rawDocumentId,
        internalId: canonicalCode, rawDocumentId: entry.rawDocumentId, canonicalDocumentId: canonicalCode,
        message: `Sổ mã ${canonicalCode} đang ghi nhận mã đã cấp nhưng chưa liên kết với hồ sơ đang giữ mã.`,
        detail: 'Chưa thể xác định hồ sơ hiện tại đang giữ mã này.',
        suggestion: 'Đối chiếu hồ sơ chất chuẩn và lịch sử truy vết; chỉ bổ sung liên kết khi xác định được duy nhất một hồ sơ.',
        autoFixable: false,
      });
      return { blocked: true };
    }

    const owner = byId.get(registry.currentStandardId);
    if (!owner) {
      addIssue({
        kind: 'REGISTRY_MISMATCH', severity: 'ERROR', blocking: true,
        collection: 'standard_code_registry', documentId: entry.rawDocumentId,
        standardId: registry.currentStandardId, internalId: canonicalCode,
        rawDocumentId: entry.rawDocumentId, canonicalDocumentId: canonicalCode,
        message: `Sổ mã ${canonicalCode} đang liên kết với hồ sơ ${registry.currentStandardId} nhưng hồ sơ này không còn tồn tại.`,
        detail: 'Không tìm thấy hồ sơ chất chuẩn tương ứng với liên kết đang được sổ mã ghi nhận.',
        suggestion: 'Đối chiếu lịch sử truy vết và dữ liệu đã lưu trữ trước khi thay đổi liên kết hoặc trạng thái sổ mã.',
        autoFixable: false,
      });
      return { blocked: true };
    }

    if (normalizeInternalId(owner.internal_id) !== canonicalCode) {
      addIssue({
        kind: 'REGISTRY_MISMATCH', severity: 'ERROR', blocking: true,
        collection: 'standard_code_registry', documentId: entry.rawDocumentId,
        standardId: owner.id, internalId: canonicalCode,
        rawDocumentId: entry.rawDocumentId, canonicalDocumentId: canonicalCode,
        message: `Sổ mã ${canonicalCode} đang liên kết với hồ sơ ${owner.id}, nhưng hồ sơ này đang mang mã khác.`,
        detail: `Mã quản lý nội bộ trên hồ sơ sau khi chuẩn hóa là ${normalizeInternalId(owner.internal_id) || '(trống)'}.`,
        suggestion: 'Đối chiếu hồ sơ chất chuẩn và lịch sử sổ mã trước khi thay đổi liên kết hoặc mã.',
        autoFixable: false,
      });
      return { blocked: true };
    }

    return { blocked: false };
  }

  private canonicalRegistryAfter(
    registry: StandardCodeRegistry,
    canonicalCode: string,
    byId: Map<string, ReferenceStandard>,
    byCode: Map<string, ReferenceStandard[]>,
  ): AnyRecord | null {
    if (registry.status === 'AVAILABLE') {
      return {
        id: canonicalCode,
        internal_id: canonicalCode,
        status: 'AVAILABLE',
        currentStandardId: null,
        assignmentCount: Math.max(0, Number(registry.assignmentCount || 0)),
      };
    }
    if (registry.status !== 'ASSIGNED' || !registry.currentStandardId) return null;
    const owner = byId.get(registry.currentStandardId);
    if (!owner || !isCurrentStandardLifecycle(owner) || normalizeInternalId(owner.internal_id) !== canonicalCode) {
      const currentOwners = (byCode.get(canonicalCode) || []).filter(isCurrentStandardLifecycle);
      if (currentOwners.length !== 0) return null;
      return {
        id: canonicalCode,
        internal_id: canonicalCode,
        status: 'AVAILABLE',
        currentStandardId: null,
        assignmentCount: Math.max(0, Number(registry.assignmentCount || 0)),
      };
    }
    return {
      id: canonicalCode,
      internal_id: canonicalCode,
      status: 'ASSIGNED',
      currentStandardId: owner.id,
      assignmentCount: Math.max(1, Number(registry.assignmentCount || 0)),
    };
  }

  private isMigratedRegistryAlias(entry: RegistryEntry, canonicalCode: string): boolean {
    return entry.rawDocumentId !== canonicalCode &&
      entry.registry.migrationStatus === 'MIGRATED' &&
      normalizeInternalId(entry.registry.migratedTo) === canonicalCode;
  }

  private collectionLabel(collectionName: string): string {
    switch (collectionName) {
      case 'standard_requests': return 'Yêu cầu mượn';
      case 'purchase_requests': return 'Yêu cầu mua';
      case 'standard_usages': return 'Nhật ký sử dụng';
      case 'reference_standard_logs': return 'Nhật ký lồng';
      case 'reference_standards': return 'Hồ sơ chuẩn';
      case 'standard_code_registry': return 'Sổ mã';
      default: return collectionName;
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
      ...(registry.migrationStatus ? { migrationStatus: registry.migrationStatus } : {}),
      ...(registry.migratedTo ? { migratedTo: registry.migratedTo } : {}),
    };
  }

  private buildSearchKey(standard: ReferenceStandard, internalId = standard.internal_id): string {
    return [standard.name, standard.canonical_name, standard.original_name, standard.chemical_name, internalId,
      standard.cas_number, standard.product_code, standard.lot_number, standard.manufacturer, standard.id]
      .filter(value => value !== null && value !== undefined && String(value).trim() !== '')
      .join(' ').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim();
  }

  /** Stable key shared by the UI selection and the fresh preflight scan. */
  private safeChangeKey(change: StandardInternalIdSyncChange): string {
    return `${change.collection}/${change.documentId}`;
  }

  /**
   * Split by atomic cluster, never by an individual field change or separating
   * standard/registry pairs.
   */
  private chunkChanges(
    changes: StandardInternalIdSyncChange[],
    maxChanges: number,
  ): StandardInternalIdSyncChange[][] {
    const plan = planInternalIdBatches(changes, maxChanges);
    return plan.chunks.map(chunk => [...chunk.changes]);
  }

  private mergeChanges(changes: StandardInternalIdSyncChange[]): StandardInternalIdSyncChange[] {
    const merged = new Map<string, StandardInternalIdSyncChange>();
    for (const change of changes) {
      const key = `${change.collection}/${change.documentId}/${change.field}`;
      const previous = merged.get(key);
      if (!previous) {
        merged.set(key, change);
        continue;
      }

      const mergeRegistryDocument = change.collection === 'standard_code_registry' &&
        change.field === '__document__' &&
        previous.after && typeof previous.after === 'object' &&
        change.after && typeof change.after === 'object';

      merged.set(key, {
        ...change,
        before: previous.before,
        after: mergeRegistryDocument
          ? { ...(previous.after as AnyRecord), ...(change.after as AnyRecord) }
          : change.after,
        reason: previous.reason === change.reason
          ? change.reason
          : `${previous.reason} ${change.reason}`,
      });
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
