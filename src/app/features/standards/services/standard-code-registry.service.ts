import { Injectable, inject } from '@angular/core';
import {
  collection,
  deleteField,
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  getDocFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  QueryConstraint,
  runTransaction,
  serverTimestamp,
  Transaction,
  where,
} from 'firebase/firestore';
import { FirebaseService } from '../../../core/services/firebase.service';
import { AuthService } from '../../../core/services/auth.service';
import { FirestoreReadMonitor } from '../../../core/services/firestore-read-monitor.service';
import {
  ReferenceStandard,
  StandardCodeEvent,
  StandardCodeEventSource,
  StandardCodeEventType,
  StandardCodeRegistry,
  StandardCodeReleaseResult,
  StandardLifecycleStatus,
} from '../../../core/models/standard.model';
import {
  hasUnreleasedCodeLifecycle,
  isSpecialInternalId,
  isValidInternalId,
  normalizeInternalId,
} from '../../../shared/utils/standard-internal-id';
import { canAutoReleaseExpiredStandard } from '../../../shared/utils/standard-fefo';

export interface StandardCodeReserveOptions {
  operationId?: string;
  source?: Extract<StandardCodeEventSource, 'CREATE' | 'IMPORT' | 'RESTORE' | 'AUTO_REUSE'>;
  reason?: string;
  runId?: string;
  /** Restore must never silently evict another owner, even if expired. */
  allowAutoReleaseExpiredOwner?: boolean;
}

export interface StandardCodeScannedCandidates {
  expectedInternalId: string;
  standardIds: readonly string[];
}

export interface StandardCodeReleaseOptions {
  operationId?: string;
  source?: Extract<StandardCodeEventSource, 'SINGLE_RELEASE' | 'RECALL' | 'RECONCILIATION'>;
  runId?: string;
  /**
   * Candidate same-code standard IDs captured by a full collection scan for
   * `expectedInternalId`. An empty `standardIds` array means the full scan
   * confirmed no other historical records shared that code at scan time;
   * `undefined` means no scan baseline exists and the conservative full scan
   * must be used.
   */
  scannedCandidates?: StandardCodeScannedCandidates;
}

export interface StandardCodeEventWriteOptions {
  operationId: string;
  internalId: string;
  standardId: string;
  assignmentSequence?: number | null;
  type: StandardCodeEventType;
  source: StandardCodeEventSource;
  reason: string;
  actorUid: string;
  actorName: string;
  before: Record<string, unknown>;
  after: Record<string, unknown>;
  runId?: string;
}

/** Firestore document IDs cannot contain path separators; keep operation IDs stable across retries. */
export function normalizeStandardCodeOperationId(value: string): string {
  const normalized = String(value || '').trim().replace(/[^A-Za-z0-9_-]/g, '_').slice(0, 140);
  return normalized || `code_operation_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Shared event payload builder for transactions and import batches. */
export function buildStandardCodeEvent(options: StandardCodeEventWriteOptions): Record<string, unknown> {
  const operationId = normalizeStandardCodeOperationId(options.operationId);
  return {
    id: operationId,
    eventId: operationId,
    operationId,
    internalId: normalizeInternalId(options.internalId),
    standardId: options.standardId,
    assignmentSequence: options.assignmentSequence ?? null,
    type: options.type,
    source: options.source,
    reason: options.reason.trim().slice(0, 500),
    actorUid: options.actorUid,
    actorName: options.actorName.trim().slice(0, 200),
    createdAt: serverTimestamp(),
    before: options.before,
    after: options.after,
    ...(options.runId ? { runId: options.runId } : {}),
  };
}

/**
 * Protects ownership of the laboratory's reusable A/B/C internal_id codes.
 * SDHET is a business marker and intentionally bypasses this exclusive ledger.
 * The registry document is a technical lock/ledger, not a second business ID.
 */
@Injectable({ providedIn: 'root' })
export class StandardCodeRegistryService {
  private fb = inject(FirebaseService);
  private auth = inject(AuthService);
  private readMonitor = inject(FirestoreReadMonitor);

  private testCertifiedOverride: boolean | null = null;
  private cachedCertification: { verified: boolean; checkedAt: number } | null = null;
  private readonly CERTIFICATION_CACHE_TTL_MS = 60_000;

  clearCertificationCache(): void {
    this.cachedCertification = null;
    this.testCertifiedOverride = null;
  }

  setNormalizationCertifiedForTest(verified: boolean | null): void {
    this.testCertifiedOverride = verified;
  }

  async isNormalizationCertified(): Promise<boolean> {
    if (this.testCertifiedOverride !== null && this.testCertifiedOverride !== undefined) {
      return this.testCertifiedOverride;
    }
    const now = Date.now();
    const ttl = this.CERTIFICATION_CACHE_TTL_MS || 60_000;
    if (this.cachedCertification && (now - this.cachedCertification.checkedAt < ttl)) {
      return this.cachedCertification.verified;
    }
    try {
      const configRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/config/standard_code_migration`);
      const snap = await getDocFromServer(configRef);
      this.readMonitor?.record?.('getDoc', `artifacts/${this.fb.APP_ID}/config/standard_code_migration`, 1, { phase: 'single' });
      const verified = snap.exists() && Boolean(snap.data()?.['normalizedInvariantsVerified']);
      // Only cache negative results. Revocation must be visible to the next
      // ownership operation, rather than trusting a stale positive marker.
      this.cachedCertification = verified ? null : { verified, checkedAt: now };
      return verified;
    } catch {
      return false;
    }
  }

  async getCertificationInfo(): Promise<{ verified: boolean; verifiedAt?: any; verifiedByName?: string; schemaVersion?: number } | null> {
    try {
      const configRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/config/standard_code_migration`);
      const snap = await getDoc(configRef);
      this.readMonitor?.record?.('getDoc', `artifacts/${this.fb.APP_ID}/config/standard_code_migration`, 1, { phase: 'single' });
      if (!snap.exists()) return null;
      const data = snap.data();
      return {
        verified: Boolean(data?.['normalizedInvariantsVerified']),
        verifiedAt: data?.['verifiedAt'],
        verifiedByName: data?.['verifiedByName'],
        schemaVersion: data?.['schemaVersion'],
      };
    } catch {
      return null;
    }
  }

  async getRegistryEntry(internalId: string): Promise<StandardCodeRegistry | null> {
    const snap = await getDoc(this.getRegistryRef(internalId));
    this.readMonitor?.record?.('getDoc', `artifacts/${this.fb.APP_ID}/standard_code_registry/${normalizeInternalId(internalId)}`, 1, { phase: 'single' });
    return this.registrySnapshotFrom(snap);
  }

  async listRegistryEntries(): Promise<StandardCodeRegistry[]> {
    const colRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_code_registry`);
    const snap = await getDocs(colRef);
    this.readMonitor?.record?.('getDocs', `artifacts/${this.fb.APP_ID}/standard_code_registry`, snap.docs.length, { phase: 'single' });
    return snap.docs
      .map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as StandardCodeRegistry))
      .sort((a, b) => a.internal_id.localeCompare(b.internal_id, 'vi', { numeric: true }));
  }

  async listCodeEvents(options?: { internalId?: string; standardId?: string; limitCount?: number }): Promise<StandardCodeEvent[]> {
    const colRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_code_events`);
    const constraints: QueryConstraint[] = [];
    if (options?.internalId) {
      constraints.push(where('internalId', '==', normalizeInternalId(options.internalId)));
    } else if (options?.standardId) {
      constraints.push(where('standardId', '==', options.standardId));
    }
    const maxLimit = Math.min(options?.limitCount || 100, 300);
    constraints.push(orderBy('createdAt', 'desc'), limit(maxLimit));
    const q = query(colRef, ...constraints);
    const snap = await getDocs(q);
    this.readMonitor?.record?.('getDocs', `artifacts/${this.fb.APP_ID}/standard_code_events`, snap.docs.length, { phase: 'single' });
    const events = snap.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    } as StandardCodeEvent));
    return events.sort((a, b) => {
      const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
      const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
      return timeB - timeA;
    });
  }

  async findSameCodeRecords(code: string): Promise<ReferenceStandard[]> {
    const normalizedCode = normalizeInternalId(code);
    if (!isValidInternalId(normalizedCode) || isSpecialInternalId(normalizedCode)) {
      return [];
    }
    const isCertified = await this.isNormalizationCertified();
    if (isCertified) {
      const sameCodeQuery = query(
        collection(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards`),
        where('internal_id', '==', normalizedCode),
      );
      const snapshot = await getDocs(sameCodeQuery);
      this.readMonitor?.record?.('getDocs', `artifacts/${this.fb.APP_ID}/reference_standards`, snapshot.docs.length, { phase: 'single' });
      return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as ReferenceStandard));
    }
    const snapshot = await getDocs(collection(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards`));
    this.readMonitor?.record?.('getDocs', `artifacts/${this.fb.APP_ID}/reference_standards`, snapshot.docs.length, { phase: 'batch' });
    return snapshot.docs
      .map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as ReferenceStandard))
      .filter(candidate => normalizeInternalId(candidate.internal_id) === normalizedCode);
  }

  async findSameCodeCandidateIds(
    normalizedCode: string,
    extraCandidateIds: readonly string[] = [],
    excludeStandardId?: string,
  ): Promise<string[]> {
    const isCertified = await this.isNormalizationCertified();
    let baseIds: string[];
    if (isCertified) {
      const queried = await this.querySameCodeStandardIds(normalizedCode);
      baseIds = excludeStandardId ? queried.filter(id => id !== excludeStandardId) : queried;
    } else {
      baseIds = await this.scanAllSameCodeStandardIds(normalizedCode, excludeStandardId || '');
    }
    const combined = new Set<string>([
      ...baseIds,
      ...extraCandidateIds.map(id => String(id || '').trim()),
    ]);
    if (excludeStandardId) combined.delete(excludeStandardId);
    combined.delete('');
    return [...combined];
  }

  getRegistryRef(internalId: string): DocumentReference {
    const code = normalizeInternalId(internalId);
    return doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_code_registry/${code}`);
  }

  getCodeEventRef(operationId: string): DocumentReference {
    return doc(
      this.fb.db,
      `artifacts/${this.fb.APP_ID}/standard_code_events/${normalizeStandardCodeOperationId(operationId)}`
    );
  }

  private actor(): { uid: string; name: string } {
    const user = this.auth.currentUser();
    return {
      uid: user?.uid || '',
      name: (user?.displayName || user?.email || user?.uid || 'Người dùng').trim(),
    };
  }

  private registrySnapshotFrom(snapshot: { id: string; exists(): boolean; data(): DocumentData | undefined }): StandardCodeRegistry | null {
    return snapshot.exists()
      ? ({ ...snapshot.data(), id: snapshot.id } as StandardCodeRegistry)
      : null;
  }

  private setEvent(
    transaction: Transaction,
    operationId: string,
    options: Omit<StandardCodeEventWriteOptions, 'operationId' | 'actorUid' | 'actorName'> & { runId?: string },
  ): void {
    const actor = this.actor();
    transaction.set(
      this.getCodeEventRef(operationId),
      buildStandardCodeEvent({ ...options, operationId, actorUid: actor.uid, actorName: actor.name }),
      { merge: false },
    );
  }

  /** Validates and reserves a code in the same transaction as a new record. */
  async reserveForNewStandard(
    transaction: Transaction,
    standardRef: DocumentReference,
    standard: ReferenceStandard,
    legacyOwnerIds: readonly string[] = [],
    options: StandardCodeReserveOptions = {},
  ): Promise<Partial<ReferenceStandard>> {
    if (!this.auth.canEditStandards()) throw new Error('Bạn không có quyền cấp Mã quản lý nội bộ.');
    const code = normalizeInternalId(standard.internal_id);
    if (!isValidInternalId(code)) {
      throw new Error('Mã quản lý nội bộ phải có 4 ký tự bắt đầu bằng A, B hoặc C; riêng mã nghiệp vụ SDHET được chấp nhận.');
    }

    const actor = this.actor();
    if (!actor.uid) throw new Error('Phiên đăng nhập không hợp lệ; không thể ghi lịch sử cấp mã.');
    const operationId = normalizeStandardCodeOperationId(options.operationId || `assign_${standardRef.id}_${code}`);
    const source = options.source || 'CREATE';
    const reason = options.reason || 'Cấp Mã quản lý nội bộ cho hồ sơ chất chuẩn.';

    // SDHET is a business marker, not an exclusive physical-code slot.
    if (isSpecialInternalId(code)) {
      this.setEvent(transaction, operationId, {
        internalId: code,
        standardId: standardRef.id,
        assignmentSequence: 1,
        type: 'ASSIGNED',
        source,
        reason,
        before: { standardId: standardRef.id, internalId: code, lifecycleStatus: null, registryStatus: null, registryStandardId: null },
        after: { standardId: standardRef.id, internalId: code, lifecycleStatus: 'ACTIVE', registryStatus: null, registryStandardId: null },
        runId: options.runId,
      });
      return {
        internal_id: code,
        lifecycle_status: 'ACTIVE' as StandardLifecycleStatus,
        internal_id_assigned_at: serverTimestamp(),
        internal_id_assignment_sequence: 1,
      };
    }

    const registryRef = this.getRegistryRef(code);
    const registrySnapshot = await transaction.get(registryRef);
    const currentRegistry = this.registrySnapshotFrom(registrySnapshot);
    let expiredOwnerRef: DocumentReference | null = null;
    let expiredOwner: ReferenceStandard | null = null;

    if (currentRegistry?.status === 'ASSIGNED' && currentRegistry.currentStandardId !== standardRef.id) {
      const ownerId = currentRegistry.currentStandardId;
      if (!ownerId) throw new Error(`Mã ${code} đang ở trạng thái không hợp lệ; hãy chạy công cụ Đồng bộ.`);
      const ownerRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${ownerId}`);
      const ownerSnapshot = await transaction.get(ownerRef);
      if (!ownerSnapshot.exists()) throw new Error(`Mã ${code} trỏ vào hồ sơ ${ownerId} không còn tồn tại. Hãy chạy công cụ Đồng bộ.`);
      expiredOwner = { id: ownerSnapshot.id, ...ownerSnapshot.data() } as ReferenceStandard;
      if (normalizeInternalId(expiredOwner.internal_id) !== code) {
        throw new Error(`Ngân hàng mã ${code} không khớp Mã quản lý nội bộ của hồ sơ ${ownerId}. Hãy chạy công cụ Đồng bộ.`);
      }
      if (!canAutoReleaseExpiredStandard(expiredOwner)) {
        throw new Error(`Mã ${code} đang được cấp cho chuẩn khác chưa đủ điều kiện tự động trả. Hãy đóng vòng đời cũ hoặc chạy công cụ Đồng bộ.`);
      }
      if (options.allowAutoReleaseExpiredOwner === false) {
        throw new Error(`Mã ${code} đang được cấp cho chuẩn khác; không thể tự động thay chủ trong thao tác này.`);
      }
      expiredOwnerRef = ownerRef;
    }
    if (currentRegistry?.status === 'CONFLICT') {
      throw new Error(`Mã ${code} đang có dữ liệu xung đột. Hãy chạy công cụ Đồng bộ mã nội bộ trước.`);
    }
    if (currentRegistry?.status === 'AVAILABLE' && currentRegistry.currentStandardId) {
      throw new Error(`Mã ${code} đang ghi nhận chủ cũ nhưng lại ở trạng thái sẵn sàng; hãy chạy công cụ Đồng bộ mã nội bộ trước.`);
    }
    const legacyConflicts = legacyOwnerIds.filter(ownerId => ownerId !== currentRegistry?.currentStandardId);
    if (legacyConflicts.length > 0) {
      throw new Error(`Mã ${code} đang còn ${legacyConflicts.length} hồ sơ chưa được đóng vòng đời. Hãy chạy công cụ Đồng bộ mã nội bộ.`);
    }

    if (expiredOwnerRef && expiredOwner) {
      transaction.update(expiredOwnerRef, {
        lifecycle_status: 'RELEASED',
        internal_id_released_at: serverTimestamp(),
        internal_id_release_reason: 'AUTO_EXPIRED_REUSE',
        lastUpdated: serverTimestamp(),
      });
      this.setEvent(transaction, `${operationId}_release_${expiredOwner.id}`, {
        internalId: code,
        standardId: expiredOwner.id,
        assignmentSequence: expiredOwner.internal_id_assignment_sequence ?? null,
        type: 'RELEASED',
        source: 'AUTO_REUSE',
        reason: 'AUTO_EXPIRED_REUSE',
        before: { standardId: expiredOwner.id, internalId: code, lifecycleStatus: expiredOwner.lifecycle_status || 'ACTIVE', registryStatus: 'ASSIGNED', registryStandardId: expiredOwner.id },
        after: { standardId: expiredOwner.id, internalId: code, lifecycleStatus: 'RELEASED', registryStatus: 'ASSIGNED', registryStandardId: standardRef.id },
        runId: options.runId,
      });
    }

    const assignmentSequence = Math.max(0, Number(currentRegistry?.assignmentCount || 0)) + 1;
    transaction.set(registryRef, {
      id: code,
      internal_id: code,
      status: 'ASSIGNED',
      currentStandardId: standardRef.id,
      assignmentCount: assignmentSequence,
      lastAssignedAt: serverTimestamp(),
      ...(expiredOwnerRef ? { lastReleasedAt: serverTimestamp(), lastReleasedStandardId: currentRegistry?.currentStandardId } : {}),
      lastUpdated: serverTimestamp(),
    }, { merge: true });
    this.setEvent(transaction, operationId, {
      internalId: code,
      standardId: standardRef.id,
      assignmentSequence,
      type: expiredOwnerRef ? 'REASSIGNED' : 'ASSIGNED',
      source,
      reason,
      before: {
        standardId: currentRegistry?.currentStandardId || null,
        internalId: code,
        lifecycleStatus: expiredOwner?.lifecycle_status || null,
        registryStatus: currentRegistry?.status || null,
        registryStandardId: currentRegistry?.currentStandardId || null,
      },
      after: { standardId: standardRef.id, internalId: code, lifecycleStatus: 'ACTIVE', registryStatus: 'ASSIGNED', registryStandardId: standardRef.id },
      runId: options.runId,
    });

    return {
      internal_id: code,
      lifecycle_status: 'ACTIVE' as StandardLifecycleStatus,
      internal_id_assigned_at: serverTimestamp(),
      internal_id_assignment_sequence: assignmentSequence,
    };
  }

  async releaseStandardCode(
    standardId: string,
    reason: string,
    options: StandardCodeReleaseOptions = {},
  ): Promise<StandardCodeReleaseResult> {
    const currentUser = this.auth.currentUser();
    if (!currentUser || !this.auth.canEditStandards()) throw new Error('Bạn không có quyền trả Mã quản lý nội bộ về ngân hàng.');
    const normalizedReason = reason.trim();
    if (!normalizedReason) throw new Error('Cần ghi rõ lý do trả mã về ngân hàng.');

    const expectedScannedCode = options.scannedCandidates !== undefined
      ? normalizeInternalId(options.scannedCandidates.expectedInternalId)
      : null;
    const operationId = normalizeStandardCodeOperationId(options.operationId || `release_${standardId}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);
    const eventRef = this.getCodeEventRef(operationId);
    const existingEvent = await this.readDocument(eventRef);
    if (existingEvent.exists()) {
      return this.releaseResultFromEvent(existingEvent.data() ?? {}, operationId, standardId, expectedScannedCode);
    }

    const standardRef = this.getStandardRef(standardId);
    const initialSnapshot = await this.readDocument(standardRef);
    if (!initialSnapshot.exists()) throw new Error('Không tìm thấy chất chuẩn.');
    const initialStandard = { id: initialSnapshot.id, ...initialSnapshot.data() } as ReferenceStandard;
    const initialCode = normalizeInternalId(initialStandard.internal_id);
    if (!isValidInternalId(initialCode)) throw new Error('Hồ sơ chưa có Mã quản lý nội bộ hợp lệ để trả.');

    const source = options.source || 'SINGLE_RELEASE';
    if (expectedScannedCode !== null && (!expectedScannedCode || initialCode !== expectedScannedCode)) {
      throw new Error(`Mã quản lý nội bộ đã thay đổi sau lần quét (${expectedScannedCode || 'trống'} -> ${initialCode}); hãy quét lại trước khi trả mã.`);
    }
    const requiresHiddenState = source === 'RECALL' || options.scannedCandidates !== undefined;
    if (requiresHiddenState && initialStandard._isDeleted !== true && initialStandard.status !== 'DELETED') {
      throw new Error('Hồ sơ đã thay đổi trạng thái ẩn sau lần quét; hãy quét lại mục này.');
    }

    const registryRef = isSpecialInternalId(initialCode) ? null : this.getRegistryRef(initialCode);
    let preTransactionCandidateIds: string[];
    if (isSpecialInternalId(initialCode)) {
      preTransactionCandidateIds = [];
    } else if (options.scannedCandidates !== undefined) {
      const queriedIds = await this.querySameCodeStandardIds(initialCode);
      preTransactionCandidateIds = [
        ...new Set([
          ...options.scannedCandidates.standardIds.map(id => String(id || '').trim()),
          ...queriedIds.map(id => String(id || '').trim()),
        ]),
      ].filter(id => Boolean(id) && id !== standardId);
    } else {
      preTransactionCandidateIds = await this.findSameCodeCandidateIds(initialCode, [], standardId);
    }

    let releaseResult: StandardCodeReleaseResult | null = null;

    await this.runInTransaction(async transaction => {
      const eventSnapshot = await transaction.get(eventRef);
      if (eventSnapshot.exists()) {
        releaseResult = this.releaseResultFromEvent(
          eventSnapshot.data() ?? {},
          operationId,
          standardId,
          expectedScannedCode || initialCode,
        );
        return;
      }
      const standardSnapshot = await transaction.get(standardRef);
      if (!standardSnapshot.exists()) throw new Error('Không tìm thấy chất chuẩn.');
      const standard = { id: standardSnapshot.id, ...standardSnapshot.data() } as ReferenceStandard;
      const code = normalizeInternalId(standard.internal_id);
      if (!isValidInternalId(code)) throw new Error('Hồ sơ chưa có Mã quản lý nội bộ hợp lệ để trả.');
      if (expectedScannedCode !== null && code !== expectedScannedCode) {
        throw new Error(`Mã quản lý nội bộ đã thay đổi sau lần quét (${expectedScannedCode} -> ${code}); hãy quét lại trước khi trả mã.`);
      }
      if (code !== initialCode) throw new Error('Mã quản lý nội bộ đã thay đổi đồng thời; hãy quét lại trước khi trả mã.');
      if (requiresHiddenState && standard._isDeleted !== true && standard.status !== 'DELETED') {
        throw new Error('Hồ sơ đã thay đổi trạng thái ẩn sau lần quét; hãy quét lại mục này.');
      }

      const registrySnapshot = registryRef ? await transaction.get(registryRef) : null;
      const registry = registrySnapshot ? this.registrySnapshotFrom(registrySnapshot) : null;

      const candidateIds = new Set<string>(preTransactionCandidateIds);
      const liveRegistryOwnerId = String(registry?.currentStandardId || '').trim();
      if (liveRegistryOwnerId && liveRegistryOwnerId !== standardId) {
        candidateIds.add(liveRegistryOwnerId);
      }
      candidateIds.delete(standardId);
      candidateIds.delete('');
      const otherOwnerRefs = [...candidateIds].map(id => this.getStandardRef(id));
      const ownerSnapshots = await Promise.all(otherOwnerRefs.map(ref => transaction.get(ref)));
      const otherOwners = ownerSnapshots
        .map(snapshot => snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as ReferenceStandard) : null)
        .filter((candidate): candidate is ReferenceStandard => Boolean(candidate))
        .filter(candidate => normalizeInternalId(candidate.internal_id) === code)
        .filter(candidate => hasUnreleasedCodeLifecycle(candidate));

      if (registry?.status === 'AVAILABLE' && registry.currentStandardId) {
        throw new Error(`Sổ mã ${code} đang ghi nhận chủ cũ nhưng ở trạng thái sẵn sàng; hãy đối soát trước khi trả.`);
      }
      if (standard.lifecycle_status === 'RELEASED' || standard.lifecycle_status === 'CLOSED') {
        if (registry?.status === 'ASSIGNED' && registry.currentStandardId === standard.id) {
          throw new Error(`Hồ sơ ${standard.id} đã ghi trả mã nhưng sổ mã ${code} vẫn trỏ về chính hồ sơ này; cần đối soát.`);
        }
        releaseResult = { status: 'ALREADY_RELEASED', operationId, internalId: code, standardId, message: `Mã ${code} đã được trả về sổ mã trước đó.` };
        return;
      }
      if (standard.status === 'IN_USE' || standard.current_holder || standard.current_holder_uid || standard.current_request_id || standard.has_pending_request) {
        throw new Error('Không thể trả mã khi chất chuẩn còn người giữ, yêu cầu mượn hoặc quy trình đang mở.');
      }
      if (otherOwners.length > 0) throw new Error(`Mã ${code} còn hồ sơ khác chưa kết thúc vòng đời: ${otherOwners.map(item => item.id).join(', ')}.`);
      if (registry?.status === 'ASSIGNED' && registry.currentStandardId !== standardId) throw new Error(`Sổ mã đang ghi nhận mã ${code} cho một hồ sơ chất chuẩn khác.`);
      if (registry?.status === 'CONFLICT') throw new Error(`Mã ${code} đang xung đột; hãy xử lý trong mục Đồng bộ mã quản lý.`);

      const wasAssignedToTarget = registry?.status === 'ASSIGNED' && registry.currentStandardId === standardId;
      transaction.update(standardRef, {
        lifecycle_status: 'RELEASED',
        internal_id_released_at: serverTimestamp(),
        internal_id_release_reason: normalizedReason,
        lastUpdated: serverTimestamp(),
      });
      if (registryRef) {
        transaction.set(registryRef, {
          id: code,
          internal_id: code,
          status: 'AVAILABLE',
          currentStandardId: deleteField(),
          lastReleasedAt: serverTimestamp(),
          lastReleasedStandardId: standardId,
          lastUpdated: serverTimestamp(),
        }, { merge: true });
      }
      releaseResult = {
        status: wasAssignedToTarget ? 'RELEASED' : 'RECONCILED',
        operationId,
        internalId: code,
        standardId,
        message: wasAssignedToTarget ? `Đã trả mã ${code} về sổ mã.` : `Đã hoàn tất đối soát và kết thúc vòng đời mã ${code}; không tăng lượt cấp.`,
        eventId: operationId,
      };
      this.setEvent(transaction, operationId, {
        internalId: code,
        standardId,
        assignmentSequence: standard.internal_id_assignment_sequence ?? null,
        type: wasAssignedToTarget ? 'RELEASED' : 'RECONCILED',
        source,
        reason: normalizedReason,
        before: { standardId, internalId: code, lifecycleStatus: standard.lifecycle_status || 'ACTIVE', registryStatus: registry?.status || null, registryStandardId: registry?.currentStandardId || null },
        after: { standardId, internalId: code, lifecycleStatus: 'RELEASED', registryStatus: registryRef ? 'AVAILABLE' : null, registryStandardId: null },
        runId: options.runId,
      });
    });

    if (!releaseResult) throw new Error('Không xác định được kết quả trả mã.');
    return releaseResult;
  }

  protected getStandardRef(standardId: string): DocumentReference<DocumentData> {
    return doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${standardId}`);
  }

  protected async readDocument(ref: DocumentReference<DocumentData>): Promise<{ exists(): boolean; id: string; data(): DocumentData | undefined }> {
    return getDoc(ref);
  }

  protected async querySameCodeStandardIds(normalizedCode: string): Promise<string[]> {
    const sameCodeQuery = query(
      collection(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards`),
      where('internal_id', '==', normalizedCode),
    );
    const snapshot = await getDocs(sameCodeQuery);
    this.readMonitor?.record?.('getDocs', `artifacts/${this.fb.APP_ID}/reference_standards`, snapshot.docs.length, { phase: 'single' });
    return snapshot.docs.map(docSnap => docSnap.id);
  }

  protected async scanAllSameCodeStandardIds(normalizedCode: string, excludeStandardId: string): Promise<string[]> {
    const snapshot = await getDocs(collection(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards`));
    this.readMonitor?.record?.('getDocs', `artifacts/${this.fb.APP_ID}/reference_standards`, snapshot.docs.length, { phase: 'batch' });
    return snapshot.docs
      .filter(docSnap => docSnap.id !== excludeStandardId)
      .filter(docSnap => normalizeInternalId(docSnap.data()?.['internal_id']) === normalizedCode)
      .map(docSnap => docSnap.id);
  }

  protected async runInTransaction<T>(updateFunction: (transaction: Transaction) => Promise<T>): Promise<T> {
    return runTransaction(this.fb.db, updateFunction);
  }

  /** Restores a soft-deleted record; a released record receives a new sequence atomically. */
  async restoreStandard(standardId: string, operationId?: string): Promise<void> {
    if (!this.auth.currentUser() || !this.auth.canEditStandards()) throw new Error('Bạn không có quyền khôi phục chất chuẩn.');
    const normalizedOperationId = normalizeStandardCodeOperationId(operationId || `restore_${standardId}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);
    const eventRef = this.getCodeEventRef(normalizedOperationId);
    const standardRef = this.getStandardRef(standardId);
    const initialSnapshot = await this.readDocument(standardRef);
    if (!initialSnapshot.exists()) throw new Error('Chuẩn cần khôi phục không còn tồn tại.');
    const initial = { id: initialSnapshot.id, ...initialSnapshot.data() } as ReferenceStandard;
    const code = normalizeInternalId(initial.internal_id);
    if (!isValidInternalId(code)) throw new Error('Hồ sơ chưa có mã hợp lệ để khôi phục vào vận hành.');
    const preTransactionCandidateIds = isSpecialInternalId(code)
      ? []
      : await this.findSameCodeCandidateIds(code, [], standardId);
    const registryRef = isSpecialInternalId(code) ? null : this.getRegistryRef(code);

    await this.runRestoreTransaction(standardRef, async transaction => {
      const eventSnapshot = await transaction.get(eventRef);
      const freshSnapshot = await transaction.get(standardRef);
      const registrySnapshot = registryRef ? await transaction.get(registryRef) : null;
      const registry = registrySnapshot ? this.registrySnapshotFrom(registrySnapshot) : null;

      const candidateIds = new Set<string>(preTransactionCandidateIds);
      const liveRegistryOwnerId = String(registry?.currentStandardId || '').trim();
      if (liveRegistryOwnerId && liveRegistryOwnerId !== standardId) {
        candidateIds.add(liveRegistryOwnerId);
      }
      candidateIds.delete(standardId);
      candidateIds.delete('');
      const candidateSnapshots = await Promise.all([...candidateIds].map(id => transaction.get(this.getStandardRef(id))));
      if (!freshSnapshot.exists()) throw new Error('Chuẩn cần khôi phục không còn tồn tại.');
      const fresh = { id: freshSnapshot.id, ...freshSnapshot.data() } as ReferenceStandard;
      if (normalizeInternalId(fresh.internal_id) !== code) throw new Error('Mã quản lý nội bộ đã thay đổi đồng thời; hãy quét lại trước khi khôi phục.');
      if (eventSnapshot.exists()) {
        const existingEvent = eventSnapshot.data() || {};
        if (String(existingEvent['standardId'] || '') !== standardId || String(existingEvent['source'] || '') !== 'RESTORE') {
          throw new Error(`Operation ID ${normalizedOperationId} đã được dùng cho một event khác; hãy tạo thao tác khôi phục mới.`);
        }
        return;
      }
      if (!fresh._isDeleted && fresh.status !== 'DELETED') return;

      const otherOwners = candidateSnapshots
        .map(snapshot => snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as ReferenceStandard) : null)
        .filter((candidate): candidate is ReferenceStandard => Boolean(candidate))
        .filter(candidate => normalizeInternalId(candidate.internal_id) === code)
        .filter(candidate => hasUnreleasedCodeLifecycle(candidate));
      if (otherOwners.length > 0) throw new Error(`Không thể khôi phục vì mã ${code} đang còn hồ sơ khác chưa kết thúc: ${otherOwners.map(item => item.id).join(', ')}.`);

      const restoredStatus = Number(fresh.current_amount || 0) <= 0 ? 'DEPLETED' : 'AVAILABLE';
      const registryOwnsTarget = isSpecialInternalId(code) || (registry?.status === 'ASSIGNED' && registry.currentStandardId === standardId);
      if (hasUnreleasedCodeLifecycle(fresh)) {
        if (!registryOwnsTarget) throw new Error(`Hồ sơ ${standardId} chưa trả mã nhưng sổ mã ${code} không còn trỏ đúng chủ; cần đối soát.`);
        transaction.update(standardRef, { _isDeleted: deleteField(), status: restoredStatus, lastUpdated: serverTimestamp() });
        if (registryRef) {
          transaction.set(registryRef, { lastUpdated: serverTimestamp() }, { merge: true });
        }
        return;
      }
      if (registry?.status === 'ASSIGNED' && registry.currentStandardId !== standardId) throw new Error(`Không thể khôi phục: mã ${code} hiện thuộc hồ sơ ${registry.currentStandardId}. Hồ sơ cũ vẫn được giữ để tra cứu.`);
      if (registry?.status === 'CONFLICT') throw new Error(`Mã ${code} đang xung đột; hãy đối soát trước khi khôi phục.`);
      if (registry?.status === 'AVAILABLE' && registry.currentStandardId) throw new Error(`Không thể khôi phục: sổ mã ${code} đang có chủ cũ nhưng trạng thái lại sẵn sàng; hãy đối soát trước.`);
      if (registry?.status === 'ASSIGNED' && registry.currentStandardId === standardId) throw new Error(`Mã ${code} đang ở trạng thái cấp cho hồ sơ đã trả; cần đối soát trước khi khôi phục.`);

      const assignmentSequence = Math.max(0, Number(registry?.assignmentCount || 0)) + 1;
      transaction.update(standardRef, {
        _isDeleted: deleteField(),
        status: restoredStatus,
        lifecycle_status: 'ACTIVE',
        internal_id_assigned_at: serverTimestamp(),
        internal_id_assignment_sequence: assignmentSequence,
        internal_id_released_at: deleteField(),
        internal_id_release_reason: deleteField(),
        lastUpdated: serverTimestamp(),
      });
      if (registryRef) {
        transaction.set(registryRef, {
          id: code,
          internal_id: code,
          status: 'ASSIGNED',
          currentStandardId: standardId,
          assignmentCount: assignmentSequence,
          lastAssignedAt: serverTimestamp(),
          lastUpdated: serverTimestamp(),
        }, { merge: true });
      }
      this.setEvent(transaction, normalizedOperationId, {
        internalId: code,
        standardId,
        assignmentSequence,
        type: 'ASSIGNED',
        source: 'RESTORE',
        reason: 'Khôi phục hồ sơ đã trả mã và cấp lại mã trong cùng giao dịch.',
        before: { standardId, internalId: code, lifecycleStatus: fresh.lifecycle_status || 'RELEASED', registryStatus: registry?.status || null, registryStandardId: registry?.currentStandardId || null },
        after: { standardId, internalId: code, lifecycleStatus: 'ACTIVE', registryStatus: isSpecialInternalId(code) ? null : 'ASSIGNED', registryStandardId: isSpecialInternalId(code) ? null : standardId },
      });
    });
  }

  private async runRestoreTransaction(
    standardRef: DocumentReference,
    update: (transaction: Transaction) => Promise<void>,
  ): Promise<void> {
    const version = (snapshot: { exists(): boolean; data(): DocumentData | undefined }) => {
      const data = snapshot.data() || {};
      return JSON.stringify([snapshot.exists(), data['lifecycle_status'], data['_isDeleted'],
        data['status'], data['lastUpdated']?.toMillis?.() ?? data['lastUpdated']]);
    };
    for (let attempt = 0; ; attempt++) {
      let observedVersion: string | null = null;
      try {
        await this.runInTransaction(async transaction => {
          observedVersion = version(await transaction.get(standardRef));
          await update(transaction);
        });
        return;
      } catch (error: unknown) {
        const code = (error as { code?: unknown })?.code;
        if (attempt >= 2 || (code !== 'permission-denied' && code !== 7) || observedVersion === null) throw error;
        // Rules can reject a stale restore before the backend reports the
        // version conflict. Retry only with evidence of a changed server row;
        // unchanged permission failures are never retried or bypassed.
        const fresh = await getDocFromServer(standardRef);
        if (version(fresh) === observedVersion) throw error;
      }
    }
  }

  private releaseResultFromEvent(
    data: DocumentData,
    operationId: string,
    fallbackStandardId: string,
    expectedInternalId?: string | null,
  ): StandardCodeReleaseResult {
    const rawType = String(data['type'] || '').trim();
    if (rawType !== 'RELEASED' && rawType !== 'RECONCILED') {
      throw new Error(`Operation ID ${operationId} đã được dùng cho một event ${rawType || 'khác'}; hãy tạo thao tác mới.`);
    }
    const eventStandardId = String(data['standardId'] || '').trim();
    if (!eventStandardId || eventStandardId !== fallbackStandardId) {
      throw new Error(`Operation ID ${operationId} không thuộc hồ sơ ${fallbackStandardId}.`);
    }
    const eventInternalId = normalizeInternalId(data['internalId']);
    const normalizedExpectedCode = expectedInternalId ? normalizeInternalId(expectedInternalId) : '';
    if (!eventInternalId || (normalizedExpectedCode && eventInternalId !== normalizedExpectedCode)) {
      throw new Error(`Operation ID ${operationId} không khớp mã ${normalizedExpectedCode || eventInternalId || 'trống'}.`);
    }
    const recordedOpIdRaw = String(data['operationId'] || data['eventId'] || data['id'] || '').trim();
    if (recordedOpIdRaw && normalizeStandardCodeOperationId(recordedOpIdRaw) !== operationId) {
      throw new Error(`Operation ID ${operationId} không khớp định danh sự kiện ${recordedOpIdRaw}.`);
    }
    const type = rawType as 'RELEASED' | 'RECONCILED';
    return {
      status: type,
      eventId: String(data['eventId'] || data['id'] || operationId),
      operationId: String(data['operationId'] || operationId),
      internalId: eventInternalId,
      standardId: eventStandardId,
      message: type === 'RECONCILED' ? 'Đợt trước đã hoàn tất đối soát mã này.' : 'Đợt trước đã trả mã này thành công.',
    };
  }
}
