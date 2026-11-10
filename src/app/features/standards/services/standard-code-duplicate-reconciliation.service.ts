import { Injectable, inject } from '@angular/core';
import { collection, getDocsFromServer } from 'firebase/firestore';
import { AuthService } from '../../../core/services/auth.service';
import { FirebaseService } from '../../../core/services/firebase.service';
import { FirestoreReadMonitor } from '../../../core/services/firestore-read-monitor.service';
import { ReferenceStandard, StandardCodeRegistry, StandardCodeReleaseResult, StandardRequest } from '../../../core/models/standard.model';
import { isActiveStandardRequestStatus } from '../../../shared/utils/standard-workflow';
import { StandardCodeRegistryService } from './standard-code-registry.service';
import { HiddenDuplicateCodeCase, listHiddenDuplicateCodeCases } from './standard-code-duplicate-reconciliation.utils';

export interface HiddenDuplicateScanReport {
  generatedAt: number;
  cases: HiddenDuplicateCodeCase[];
  readyCount: number;
  blockedCount: number;
}

@Injectable({ providedIn: 'root' })
export class StandardCodeDuplicateReconciliationService {
  private fb = inject(FirebaseService);
  private auth = inject(AuthService);
  private registry = inject(StandardCodeRegistryService);
  private readMonitor = inject(FirestoreReadMonitor);

  async scan(): Promise<HiddenDuplicateScanReport> {
    if (!this.auth.currentUser() || !this.auth.canEditStandards()) {
      throw new Error('Bạn không có quyền quét và đối soát mã chất chuẩn.');
    }
    const path = `artifacts/${this.fb.APP_ID}`;
    const [standardDocs, registryDocs, requestDocs] = await Promise.all([
      getDocsFromServer(collection(this.fb.db, `${path}/reference_standards`)),
      getDocsFromServer(collection(this.fb.db, `${path}/standard_code_registry`)),
      getDocsFromServer(collection(this.fb.db, `${path}/standard_requests`)),
    ]);
    this.readMonitor?.record?.('getDocs', `${path}/reference_standards`, standardDocs.size, { phase: 'batch' });
    this.readMonitor?.record?.('getDocs', `${path}/standard_code_registry`, registryDocs.size, { phase: 'batch' });
    this.readMonitor?.record?.('getDocs', `${path}/standard_requests`, requestDocs.size, { phase: 'batch' });
    const standards = standardDocs.docs.map(item => ({ id: item.id, ...item.data() } as ReferenceStandard));
    const registries = registryDocs.docs.map(item => ({ ...item.data(), id: item.id } as StandardCodeRegistry));
    const openRequests = new Set(requestDocs.docs
      .map(item => item.data() as StandardRequest)
      .filter(item => (item as StandardRequest & { _isDeleted?: boolean })._isDeleted !== true &&
        isActiveStandardRequestStatus(item.status))
      .map(item => item.standardId).filter(Boolean));
    const cases = listHiddenDuplicateCodeCases(standards, registries, openRequests);
    return {
      generatedAt: Date.now(), cases,
      readyCount: cases.filter(item => item.status === 'READY').length,
      blockedCount: cases.filter(item => item.status === 'BLOCKED').length,
    };
  }

  async reconcile(
    item: HiddenDuplicateCodeCase,
    reason: string,
    operationId: string,
  ): Promise<StandardCodeReleaseResult> {
    if (item.status !== 'READY' || !item.oldStandard || !item.newStandard) {
      throw new Error('Chỉ được đối soát cặp hồ sơ đã được xác định đủ điều kiện.');
    }
    return this.registry.reconcileHiddenDuplicateCode(
      item.oldStandard.id, item.newStandard.id, item.internalId, reason, operationId,
    );
  }
}
