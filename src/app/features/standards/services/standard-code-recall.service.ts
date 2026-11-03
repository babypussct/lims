import { Injectable, inject } from '@angular/core';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { FirebaseService } from '../../../core/services/firebase.service';
import { AuthService } from '../../../core/services/auth.service';
import {
  ReferenceStandard,
  StandardCodeRecallExecutionResult,
  StandardCodeRecallItem,
  StandardCodeRecallReport,
  StandardCodeRecallRun,
  StandardCodeRecallRunStatus,
  StandardCodeRecallSummary,
  StandardCodeRegistry,
  StandardRequest,
} from '../../../core/models/standard.model';
import {
  assessCodeOwnership,
  isSpecialInternalId,
  isValidInternalId,
  normalizeInternalId,
} from '../../../shared/utils/standard-internal-id';
import { isActiveStandardRequestStatus } from '../../../shared/utils/standard-workflow';
import {
  normalizeStandardCodeOperationId,
  StandardCodeRegistryService,
} from './standard-code-registry.service';

export interface StandardCodeRecallProgress {
  current: number;
  total: number;
  percent: number;
  phase: 'SCANNING' | 'READY' | 'RUNNING' | 'STOPPED' | 'COMPLETED';
  message: string;
}

export interface StandardCodeRecallExecutionOptions {
  onProgress?: (progress: StandardCodeRecallProgress) => void;
  shouldStop?: () => boolean;
  includeFailed?: boolean;
}

/**
 * Audit and execution service for the manager-facing "hidden standard code
 * recall" flow. The scan is intentionally independent of the catalogue cache;
 * every write delegates to the transaction-protected registry service.
 */
@Injectable({ providedIn: 'root' })
export class StandardCodeRecallService {
  private fb = inject(FirebaseService);
  private auth = inject(AuthService);
  private registry = inject(StandardCodeRegistryService);

  async scanHiddenStandardCodes(): Promise<StandardCodeRecallReport> {
    if (!this.auth.canEditStandards()) throw new Error('Bạn không có quyền thu hồi mã của chuẩn đã ẩn.');
    const base = `artifacts/${this.fb.APP_ID}`;
    const standardsCollection = collection(this.fb.db, `${base}/reference_standards`);
    const registryCollection = collection(this.fb.db, `${base}/standard_code_registry`);
    const requestsCollection = collection(this.fb.db, `${base}/standard_requests`);
    const [standardsSnapshot, registriesSnapshot, requestsSnapshot] = await Promise.all([
      getDocs(standardsCollection),
      getDocs(registryCollection),
      getDocs(requestsCollection),
    ]);

    const standards = standardsSnapshot.docs.map(snapshot => ({ id: snapshot.id, ...snapshot.data() } as ReferenceStandard));
    const hidden = standards.filter(standard => standard._isDeleted === true || standard.status === 'DELETED');
    const registryByCode = this.indexRegistries(registriesSnapshot.docs.map(snapshot => ({ ...snapshot.data(), id: snapshot.id } as StandardCodeRegistry)));
    const openRequests = new Set(
      requestsSnapshot.docs
        .map(snapshot => ({ id: snapshot.id, ...snapshot.data() } as StandardRequest))
        .filter(request => request._isDeleted !== true && isActiveStandardRequestStatus(request.status))
        .map(request => request.standardId)
        .filter(Boolean),
    );
    const runId = normalizeStandardCodeOperationId(`recall_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);
    const items = hidden.map(standard => this.buildScanItem(standard, standards, registryByCode, openRequests, runId));
    const report: StandardCodeRecallReport = {
      runId,
      generatedAt: Date.now(),
      items,
      summary: this.summarize(items, hidden.length),
    };

    await this.writeRun({
      id: runId,
      status: 'READY',
      reason: '',
      totalCount: items.length,
      blockedCount: report.summary.blocked,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: this.auth.currentUser()?.uid || '',
      createdByName: this.auth.currentUser()?.displayName || this.auth.currentUser()?.email || 'Người dùng',
    });
    return report;
  }

  async recallEligibleCodes(
    report: StandardCodeRecallReport,
    reason: string,
    options: StandardCodeRecallExecutionOptions = {},
  ): Promise<StandardCodeRecallExecutionResult[]> {
    if (!this.auth.canEditStandards()) throw new Error('Bạn không có quyền thu hồi mã của chuẩn đã ẩn.');
    const normalizedReason = reason.trim();
    if (!normalizedReason) throw new Error('Cần ghi rõ lý do thu hồi mã.');

    const targets = report.items.filter(item =>
      item.status === 'RELEASED' || item.status === 'RECONCILED' ||
      (options.includeFailed && (item.status === 'FAILED' || item.status === 'CHANGED_SINCE_SCAN'))
    );
    const results: StandardCodeRecallExecutionResult[] = [];
    await this.writeRun({
      id: report.runId,
      status: 'RUNNING',
      reason: normalizedReason,
      totalCount: targets.length,
      updatedAt: serverTimestamp(),
    });

    options.onProgress?.({ current: 0, total: targets.length, percent: 0, phase: 'RUNNING', message: 'Đang chuẩn bị thu hồi mã...' });
    for (let index = 0; index < targets.length; index++) {
      if (options.shouldStop?.()) {
        await this.writeRun({ id: report.runId, status: 'STOPPED', reason: normalizedReason, updatedAt: serverTimestamp() });
        options.onProgress?.({ current: index, total: targets.length, percent: targets.length ? Math.round(index / targets.length * 100) : 100, phase: 'STOPPED', message: 'Đã dừng phần chưa bắt đầu; các giao dịch đã ghi vẫn giữ nguyên.' });
        break;
      }
      const item = targets[index];
      let result: StandardCodeRecallExecutionResult;
      try {
        const release = await this.registry.releaseStandardCode(item.standardId, normalizedReason, {
          operationId: item.operationId,
          source: 'RECALL',
          runId: report.runId,
        });
        result = {
          ...item,
          status: release.status,
          eventId: release.eventId,
          message: release.message,
          reason: release.message,
          completedAt: serverTimestamp(),
        };
      } catch (error: unknown) {
        result = await this.classifyExecutionFailure(item, error);
      }
      results.push(result);
      await this.writeRunItem(report.runId, result);
      options.onProgress?.({
        current: index + 1,
        total: targets.length,
        percent: targets.length ? Math.round((index + 1) / targets.length * 100) : 100,
        phase: 'RUNNING',
        message: `${result.internalId || 'Mã chưa xác định'}: ${result.message || result.reason}`,
      });
    }

    const stopped = results.length < targets.length;
    const status: StandardCodeRecallRunStatus = stopped
      ? 'STOPPED'
      : results.some(result => result.status === 'BLOCKED' || result.status === 'FAILED' || result.status === 'CHANGED_SINCE_SCAN')
        ? 'COMPLETED_WITH_BLOCKS'
        : 'COMPLETED';
    await this.writeRun({
      id: report.runId,
      status,
      reason: normalizedReason,
      updatedAt: serverTimestamp(),
      releasedCount: results.filter(result => result.status === 'RELEASED').length,
      reconciledCount: results.filter(result => result.status === 'RECONCILED').length,
      blockedCount: results.filter(result => result.status === 'BLOCKED' || result.status === 'CHANGED_SINCE_SCAN').length,
      failedCount: results.filter(result => result.status === 'FAILED').length,
      totalCount: targets.length,
    });
    options.onProgress?.({
      current: results.length,
      total: targets.length,
      percent: targets.length ? Math.round(results.length / targets.length * 100) : 100,
      phase: stopped ? 'STOPPED' : 'COMPLETED',
      message: stopped ? 'Đã dừng đợt thu hồi.' : 'Đã hoàn tất đợt thu hồi; kiểm tra các mục bị chặn nếu có.',
    });
    return results;
  }

  private buildScanItem(
    standard: ReferenceStandard,
    standards: readonly ReferenceStandard[],
    registryByCode: Map<string, StandardCodeRegistry | null>,
    openRequests: ReadonlySet<string>,
    runId: string,
  ): StandardCodeRecallItem {
    const code = normalizeInternalId(standard.internal_id);
    const sameCode = standards.filter(candidate => normalizeInternalId(candidate.internal_id) === code);
    const registry = registryByCode.get(code);
    const assessment = assessCodeOwnership(standard, registry, sameCode, openRequests.has(standard.id));
    return {
      id: `${standard.id}:${code || 'missing'}`,
      internalId: code,
      standardId: standard.id,
      standardName: standard.name || '(Không có tên)',
      lotNumber: standard.lot_number,
      lifecycleStatus: standard.lifecycle_status,
      registryStatus: registry?.status || 'MISSING',
      registryStandardId: registry?.currentStandardId,
      workflowStatus: openRequests.has(standard.id) || standard.status === 'IN_USE' || Boolean(
        standard.current_holder || standard.current_holder_uid || standard.current_request_id || standard.has_pending_request
      ) ? 'OPEN' : 'CLEAN',
      status: assessment.status,
      reason: assessment.reason,
      operationId: normalizeStandardCodeOperationId(`recall_${runId}_${standard.id}_${code || 'missing'}`),
      affectedStandardIds: sameCode.filter(candidate => candidate.id !== standard.id).map(candidate => candidate.id),
    };
  }

  private indexRegistries(registries: readonly StandardCodeRegistry[]): Map<string, StandardCodeRegistry | null> {
    const index = new Map<string, StandardCodeRegistry | null>();
    for (const registry of registries) {
      const code = normalizeInternalId(registry.internal_id || registry.id);
      if (!isValidInternalId(code) || isSpecialInternalId(code)) continue;
      const existing = index.get(code);
      const isCanonicalRow = normalizeInternalId(registry.id) === code && normalizeInternalId(registry.internal_id) === code;
      if (existing || !isCanonicalRow) {
        index.set(code, { ...(existing || registry), id: code, internal_id: code, status: 'CONFLICT' });
      } else {
        index.set(code, { ...registry, id: code, internal_id: code });
      }
    }
    return index;
  }

  private summarize(items: readonly StandardCodeRecallItem[], hiddenStandards: number): StandardCodeRecallSummary {
    const uniqueCodes = new Set(items.map(item => item.internalId).filter(Boolean));
    return {
      hiddenStandards,
      uniqueCodes: uniqueCodes.size,
      eligibleCodes: new Set(items.filter(item => item.status === 'RELEASED' || item.status === 'RECONCILED').map(item => item.internalId)).size,
      toReconcile: items.filter(item => item.status === 'RECONCILED').length,
      alreadyReleased: items.filter(item => item.status === 'ALREADY_RELEASED').length,
      blocked: items.filter(item => item.status === 'BLOCKED').length,
      excludedSpecial: items.filter(item => item.status === 'EXCLUDED_SPECIAL_CODE').length,
      released: 0,
      failed: 0,
    };
  }

  private async classifyExecutionFailure(item: StandardCodeRecallItem, error: unknown): Promise<StandardCodeRecallExecutionResult> {
    const message = error instanceof Error ? error.message : String(error || 'Lỗi không xác định.');
    const snapshot = await getDoc(doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${item.standardId}`)).catch(() => null);
    if (!snapshot?.exists()) {
      return { ...item, status: 'FAILED', message: `Không đọc lại được hồ sơ sau lỗi: ${message}`, reason: message };
    }
    const fresh = { id: snapshot.id, ...snapshot.data() } as ReferenceStandard;
    if (fresh._isDeleted !== true && fresh.status !== 'DELETED') {
      return { ...item, status: 'CHANGED_SINCE_SCAN', message: 'Hồ sơ đã thay đổi trạng thái sau lần quét; hãy quét lại mục này.', reason: message };
    }
    if (fresh.lifecycle_status === 'RELEASED' || fresh.lifecycle_status === 'CLOSED') {
      return { ...item, status: 'ALREADY_RELEASED', message: 'Hồ sơ đã được xử lý bởi thao tác trước đó.', reason: message };
    }
    const blocking = /đang được cấp|đang ghi nhận|xung đột|quy trình|yêu cầu|chưa kết thúc|đối soát|không tìm thấy sổ mã|không còn hồ sơ/i.test(message);
    return { ...item, status: blocking ? 'BLOCKED' : 'FAILED', message, reason: message };
  }

  private async writeRun(run: Partial<StandardCodeRecallRun> & Pick<StandardCodeRecallRun, 'id'>): Promise<void> {
    try {
      await setDoc(doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_code_recall_runs/${run.id}`), run, { merge: true });
    } catch (error) {
      // The code event is authoritative. A projection write must not turn a
      // committed release into a reported failure when a client loses access.
      console.warn('[StandardCodeRecall] Could not persist run projection', error);
    }
  }

  private async writeRunItem(runId: string, result: StandardCodeRecallExecutionResult): Promise<void> {
    try {
      const itemId = normalizeStandardCodeOperationId(result.operationId);
      await setDoc(
        doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_code_recall_runs/${runId}/items/${itemId}`),
        { ...result, runId, updatedAt: serverTimestamp() },
        { merge: true },
      );
    } catch (error) {
      console.warn('[StandardCodeRecall] Could not persist run item projection', error);
    }
  }
}
