import { Injectable, inject } from '@angular/core';
import {
  collection,
  deleteField,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  runTransaction,
  serverTimestamp,
  Transaction,
} from 'firebase/firestore';
import { FirebaseService } from '../../../core/services/firebase.service';
import { AuthService } from '../../../core/services/auth.service';
import {
  ReferenceStandard,
  StandardCodeRegistry,
  StandardLifecycleStatus,
} from '../../../core/models/standard.model';
import {
  isCurrentStandardLifecycle,
  isValidInternalId,
  normalizeInternalId,
} from '../../../shared/utils/standard-internal-id';
import { canAutoReleaseExpiredStandard } from '../../../shared/utils/standard-fefo';

/**
 * Protects ownership of the laboratory's single reusable internal_id code.
 * The registry document is a technical lock/ledger, not a second business ID.
 */
@Injectable({ providedIn: 'root' })
export class StandardCodeRegistryService {
  private fb = inject(FirebaseService);
  private auth = inject(AuthService);

  getRegistryRef(internalId: string): DocumentReference {
    const code = normalizeInternalId(internalId);
    return doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_code_registry/${code}`);
  }

  /**
   * Validates the reusable code and reserves it in the same transaction that
   * creates the physical standard record.
   */
  async reserveForNewStandard(
    transaction: Transaction,
    standardRef: DocumentReference,
    standard: ReferenceStandard,
    legacyOwnerIds: readonly string[] = []
  ): Promise<Partial<ReferenceStandard>> {
    if (!this.auth.canEditStandards()) throw new Error('Bạn không có quyền cấp Mã quản lý nội bộ.');
    const code = normalizeInternalId(standard.internal_id);
    if (!isValidInternalId(code)) {
      throw new Error('Mã quản lý nội bộ phải có 4 ký tự bắt đầu bằng A, B hoặc C; riêng mã nghiệp vụ SDHET được chấp nhận.');
    }

    const registryRef = this.getRegistryRef(code);
    const registrySnapshot = await transaction.get(registryRef);
    const currentRegistry = registrySnapshot.exists()
      ? ({ id: registrySnapshot.id, ...registrySnapshot.data() } as StandardCodeRegistry)
      : null;

    let expiredOwnerRef: DocumentReference | null = null;
    if (currentRegistry?.status === 'ASSIGNED' && currentRegistry.currentStandardId !== standardRef.id) {
      const ownerId = currentRegistry.currentStandardId;
      if (!ownerId) throw new Error(`Mã ${code} đang ở trạng thái không hợp lệ; hãy chạy công cụ Đồng bộ.`);
      const ownerRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${ownerId}`);
      const ownerSnapshot = await transaction.get(ownerRef);
      if (!ownerSnapshot.exists()) {
        throw new Error(`Mã ${code} trỏ vào hồ sơ ${ownerId} không còn tồn tại. Hãy chạy công cụ Đồng bộ.`);
      }
      const owner = { id: ownerSnapshot.id, ...ownerSnapshot.data() } as ReferenceStandard;
      if (normalizeInternalId(owner.internal_id) !== code) {
        throw new Error(`Ngân hàng mã ${code} không khớp Mã quản lý nội bộ của hồ sơ ${ownerId}. Hãy chạy công cụ Đồng bộ.`);
      }
      if (!canAutoReleaseExpiredStandard(owner)) {
        throw new Error(`Mã ${code} đang được cấp cho chuẩn khác chưa đủ điều kiện tự động trả. Hãy đóng vòng đời cũ hoặc chạy công cụ Đồng bộ.`);
      }
      expiredOwnerRef = ownerRef;
    }
    if (currentRegistry?.status === 'CONFLICT') {
      throw new Error(`Mã ${code} đang có dữ liệu xung đột. Hãy chạy công cụ Đồng bộ mã nội bộ trước.`);
    }

    // The caller performs a collection preflight when the registry is missing.
    // Passing the result into this transaction keeps the write atomic while
    // avoiding an unsupported query read inside the Web SDK transaction API.
    if ((!currentRegistry || currentRegistry.status === 'AVAILABLE') && legacyOwnerIds.length > 0) {
      throw new Error(`Mã ${code} đang còn ${legacyOwnerIds.length} hồ sơ chưa được đóng vòng đời. Hãy chạy công cụ Đồng bộ mã nội bộ.`);
    }

    if (expiredOwnerRef) {
      transaction.update(expiredOwnerRef, {
        lifecycle_status: 'RELEASED',
        internal_id_released_at: serverTimestamp(),
        internal_id_release_reason: 'AUTO_EXPIRED_REUSE',
        lastUpdated: serverTimestamp(),
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
      ...(expiredOwnerRef ? {
        lastReleasedAt: serverTimestamp(),
        lastReleasedStandardId: currentRegistry?.currentStandardId,
      } : {}),
      lastUpdated: serverTimestamp(),
    }, { merge: true });

    return {
      internal_id: code,
      lifecycle_status: 'ACTIVE' as StandardLifecycleStatus,
      internal_id_assigned_at: serverTimestamp(),
      internal_id_assignment_sequence: assignmentSequence,
    };
  }

  async releaseStandardCode(standardId: string, reason: string): Promise<void> {
    const currentUser = this.auth.currentUser();
    if (!currentUser || !this.auth.canEditStandards()) {
      throw new Error('Bạn không có quyền trả Mã quản lý nội bộ về ngân hàng.');
    }
    const normalizedReason = reason.trim();
    if (!normalizedReason) throw new Error('Cần ghi rõ lý do trả mã về ngân hàng.');

    const standardRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${standardId}`);
    const initialSnapshot = await getDoc(standardRef);
    if (!initialSnapshot.exists()) throw new Error('Không tìm thấy chất chuẩn.');
    const initialStandard = { id: initialSnapshot.id, ...initialSnapshot.data() } as ReferenceStandard;
    const initialCode = normalizeInternalId(initialStandard.internal_id);
    if (!isValidInternalId(initialCode)) throw new Error('Hồ sơ chưa có Mã quản lý nội bộ hợp lệ để trả.');
    const initialRegistryRef = this.getRegistryRef(initialCode);
    const initialRegistrySnapshot = await getDoc(initialRegistryRef);
    const registryOwnsTarget = initialRegistrySnapshot.exists() &&
      initialRegistrySnapshot.data()?.['status'] === 'ASSIGNED' &&
      initialRegistrySnapshot.data()?.['currentStandardId'] === standardId;
    if (!registryOwnsTarget) {
      // If the ledger is absent or inconsistent, include legacy lower-case /
      // whitespace variants before returning the code. Releasing one record
      // must never hide another current physical owner.
      const standardsRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards`);
      const matches = await getDocs(standardsRef);
      const otherOwners = matches.docs
        .filter(snapshot => snapshot.id !== standardId)
        .map(snapshot => ({ id: snapshot.id, ...snapshot.data() } as ReferenceStandard))
        .filter(candidate => normalizeInternalId(candidate.internal_id) === initialCode)
        .filter(candidate => !candidate._isDeleted && candidate.status !== 'DELETED')
        .filter(candidate => isCurrentStandardLifecycle(candidate));
      if (otherOwners.length > 0) {
        throw new Error(`Mã ${initialCode} có hồ sơ khác chưa rõ vòng đời; hãy chạy công cụ Đồng bộ mã nội bộ.`);
      }
    }

    await runTransaction(this.fb.db, async transaction => {
      const standardSnapshot = await transaction.get(standardRef);
      if (!standardSnapshot.exists()) throw new Error('Không tìm thấy chất chuẩn.');
      const standard = { id: standardSnapshot.id, ...standardSnapshot.data() } as ReferenceStandard;
      const code = normalizeInternalId(standard.internal_id);
      if (!isValidInternalId(code)) throw new Error('Hồ sơ chưa có Mã quản lý nội bộ hợp lệ để trả.');
      if (standard.lifecycle_status === 'RELEASED' || standard.lifecycle_status === 'CLOSED') {
        throw new Error(`Mã ${code} đã được trả về ngân hàng trước đó.`);
      }
      if (standard.status === 'IN_USE' || standard.current_holder || standard.current_holder_uid || standard.current_request_id || standard.has_pending_request) {
        throw new Error('Không thể trả mã khi chất chuẩn còn người giữ, yêu cầu mượn hoặc quy trình đang mở.');
      }

      const registryRef = this.getRegistryRef(code);
      const registrySnapshot = await transaction.get(registryRef);
      if (registrySnapshot.exists()) {
        const registry = registrySnapshot.data() as StandardCodeRegistry;
        if (registry.status === 'ASSIGNED' && registry.currentStandardId !== standardId) {
          throw new Error(`Mã ${code} đang được registry ghi nhận cho một chuẩn khác.`);
        }
        if (registry.status === 'CONFLICT') {
          throw new Error(`Mã ${code} đang xung đột; hãy xử lý trong công cụ Đồng bộ mã nội bộ.`);
        }
      }

      transaction.update(standardRef, {
        lifecycle_status: 'RELEASED',
        internal_id_released_at: serverTimestamp(),
        internal_id_release_reason: normalizedReason,
        lastUpdated: serverTimestamp(),
      });
      transaction.set(registryRef, {
        id: code,
        internal_id: code,
        status: 'AVAILABLE',
        currentStandardId: deleteField(),
        lastReleasedAt: serverTimestamp(),
        lastReleasedStandardId: standardId,
        lastUpdated: serverTimestamp(),
      }, { merge: true });
    });
  }
}
