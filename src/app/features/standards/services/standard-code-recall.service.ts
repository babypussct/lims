import { Injectable, inject } from '@angular/core';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  serverTimestamp,
  setDoc,
  query,
  where,
} from 'firebase/firestore';
import { FirebaseService } from '../../../core/services/firebase.service';
import { AuthService } from '../../../core/services/auth.service';
import { FirestoreReadMonitor } from '../../../core/services/firestore-read-monitor.service';
import { isDeltaResourceExhaustedError } from '../../../core/services/delta-sync.service';
import {
  ReferenceStandard,
  StandardCodeRecallBatchOutcome,
  StandardCodeRecallExecutionResult,
  StandardCodeRecallItem,
  StandardCodeRecallReport,
  StandardCodeRecallRun,
  StandardCodeRecallRunStatus,
  StandardCodeRecallServerState,
  StandardCodeRecallStopReason,
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
  /**
   * Results from an earlier execution of the same in-memory scan report.
   * Confirmed items (`RELEASED`, `RECONCILED`, `ALREADY_RELEASED`, `BLOCKED`,
   * `CHANGED_SINCE_SCAN`) keep their exact status and are not re-executed;
   * `UNCONFIRMED` items are reconciled using their original `operationId`.
   */
  priorResults?: readonly StandardCodeRecallExecutionResult[];
}

export interface RecallProjectionWriteOutcome {
  persisted: boolean;
  resourceExhausted: boolean;
  error?: unknown;
}

function extractRecallErrorCode(error: unknown): string | undefined {
  if (!error || typeof error !== 'object') return undefined;
  const record = error as { code?: unknown; status?: unknown; statusCode?: unknown };
  if (typeof record.code === 'string' && record.code.trim()) return record.code.trim();
  if (typeof record.code === 'number') return String(record.code);
  if (typeof record.status === 'number') return `http-${record.status}`;
  if (typeof record.statusCode === 'number') return `http-${record.statusCode}`;
  return undefined;
}

function stripUndefinedFields<T extends Record<string, unknown>>(input: T): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined) {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

/**
 * Pure target selector for initial and continued recall runs.
 *
 * Rules:
 * - Confirmed `RELEASED`, `RECONCILED`, `ALREADY_RELEASED`, `BLOCKED`, and
 *   `EXCLUDED_SPECIAL_CODE` results from `priorResults` are never re-run and
 *   keep their exact status (never converted to `ALREADY_RELEASED`).
 * - Confirmed `CHANGED_SINCE_SCAN` and confirmed `FAILED` results are only
 *   re-run when `options.includeFailed === true`.
 * - `UNCONFIRMED` results (`outcomeState === 'UNCONFIRMED'`) are always
 *   selected so the same `operationId` can be reconciled idempotently.
 * - Unstarted items (not present in `priorResults`) are selected when their
 *   scan status is `RELEASED` or `RECONCILED` (or `FAILED` / `CHANGED_SINCE_SCAN`
 *   when `options.includeFailed === true`).
 */
export function selectRecallExecutionTargets(
  items: readonly StandardCodeRecallItem[],
  options: Pick<StandardCodeRecallExecutionOptions, 'includeFailed' | 'priorResults'> = {},
): {
  targets: StandardCodeRecallItem[];
  preservedByOperationId: Map<string, StandardCodeRecallExecutionResult>;
  unpersistedConfirmedResults: StandardCodeRecallExecutionResult[];
  batchTargetCount: number;
} {
  const priorByOperationId = new Map<string, StandardCodeRecallExecutionResult>();
  for (const prior of options.priorResults || []) {
    if (prior?.operationId) {
      priorByOperationId.set(prior.operationId, prior);
    }
  }

  const targets: StandardCodeRecallItem[] = [];
  const preservedByOperationId = new Map<string, StandardCodeRecallExecutionResult>();
  const unpersistedConfirmedResults: StandardCodeRecallExecutionResult[] = [];

  for (const item of items) {
    const prior = priorByOperationId.get(item.operationId);
    if (prior) {
      if (prior.outcomeState === 'UNCONFIRMED') {
        targets.push(item);
        continue;
      }
      if (
        options.includeFailed &&
        (prior.status === 'FAILED' || prior.status === 'CHANGED_SINCE_SCAN')
      ) {
        targets.push(item);
        continue;
      }
      preservedByOperationId.set(item.operationId, prior);
      if (prior.projectionPersisted === false) {
        unpersistedConfirmedResults.push(prior);
      }
      continue;
    }

    if (
      item.status === 'RELEASED' ||
      item.status === 'RECONCILED' ||
      (options.includeFailed && (item.status === 'FAILED' || item.status === 'CHANGED_SINCE_SCAN'))
    ) {
      targets.push(item);
    }
  }

  return {
    targets,
    preservedByOperationId,
    unpersistedConfirmedResults,
    batchTargetCount: preservedByOperationId.size + targets.length,
  };
}

/**
 * Pure helper that updates an in-memory scan report with execution results
 * without converting `RELEASED`, `RECONCILED`, `BLOCKED`, or
 * `CHANGED_SINCE_SCAN` into `ALREADY_RELEASED`.
 */
export function applyRecallExecutionResultsToReport(
  report: StandardCodeRecallReport,
  results: readonly StandardCodeRecallExecutionResult[],
): StandardCodeRecallReport {
  const resultByOperationId = new Map<string, StandardCodeRecallExecutionResult>();
  for (const result of results) {
    if (result?.operationId) {
      resultByOperationId.set(result.operationId, result);
    }
  }

  const items = report.items.map(item => {
    const executed = resultByOperationId.get(item.operationId);
    if (!executed) return item;
    return {
      ...item,
      status: executed.status,
      reason: executed.reason || item.reason,
      message: executed.message ?? item.message,
      eventId: executed.eventId ?? item.eventId,
      completedAt: executed.completedAt ?? item.completedAt,
    };
  });

  const { targets: remainingTargets } = selectRecallExecutionTargets(items, {
    priorResults: results,
  });
  const uniqueCodes = new Set(items.map(item => item.internalId).filter(Boolean));

  return {
    ...report,
    items,
    summary: {
      hiddenStandards: report.summary.hiddenStandards,
      uniqueCodes: uniqueCodes.size,
      eligibleCodes: new Set(remainingTargets.map(item => item.internalId).filter(Boolean)).size,
      toReconcile: remainingTargets.filter(item => item.status === 'RECONCILED').length,
      alreadyReleased: items.filter(item => item.status === 'ALREADY_RELEASED').length,
      blocked: items.filter(item => item.status === 'BLOCKED' || item.status === 'CHANGED_SINCE_SCAN').length,
      excludedSpecial: items.filter(item => item.status === 'EXCLUDED_SPECIAL_CODE').length,
      released: results.filter(
        result =>
          result.outcomeState !== 'UNCONFIRMED' &&
          (result.status === 'RELEASED' || result.status === 'RECONCILED'),
      ).length,
      failed: results.filter(result => result.status === 'FAILED').length,
    },
  };
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
  private readMonitor = inject(FirestoreReadMonitor);

  async scanHiddenStandardCodes(options: { fullAuditScan?: boolean } = {}): Promise<StandardCodeRecallReport> {
    if (!this.auth.canEditStandards()) throw new Error('Bạn không có quyền thu hồi mã của chuẩn đã ẩn.');
    const base = `artifacts/${this.fb.APP_ID}`;
    const standardsCollection = collection(this.fb.db, `${base}/reference_standards`);
    const registryCollection = collection(this.fb.db, `${base}/standard_code_registry`);
    const requestsCollection = collection(this.fb.db, `${base}/standard_requests`);

    const isCertified = await this.registry.isNormalizationCertified();
    const useFastScan = !options.fullAuditScan && isCertified;

    let standards: ReferenceStandard[] = [];
    let hidden: ReferenceStandard[] = [];
    let registries: StandardCodeRegistry[] = [];
    let openRequests = new Set<string>();

    if (useFastScan) {
      const [deletedSnap1, deletedSnap2] = await Promise.all([
        getDocs(query(standardsCollection, where('_isDeleted', '==', true))),
        getDocs(query(standardsCollection, where('status', '==', 'DELETED'))),
      ]);
      this.readMonitor?.record?.('getDocs', `${base}/reference_standards`, deletedSnap1.docs.length + deletedSnap2.docs.length, { phase: 'batch' });
      const hiddenMap = new Map<string, ReferenceStandard>();
      for (const snap of [...deletedSnap1.docs, ...deletedSnap2.docs]) {
        hiddenMap.set(snap.id, { id: snap.id, ...snap.data() } as ReferenceStandard);
      }
      hidden = [...hiddenMap.values()];

      const targetCodes = [
        ...new Set(
          hidden
            .map(s => normalizeInternalId(s.internal_id))
            .filter(code => isValidInternalId(code) && !isSpecialInternalId(code))
        ),
      ];

      const relatedStandardsMap = new Map<string, ReferenceStandard>(hiddenMap);
      if (targetCodes.length > 0) {
        const chunks: string[][] = [];
        for (let i = 0; i < targetCodes.length; i += 30) {
          chunks.push(targetCodes.slice(i, i + 30));
        }

        const sameCodeSnaps = await Promise.all(
          chunks.map(chunk => getDocs(query(standardsCollection, where('internal_id', 'in', chunk))))
        );
        for (const snap of sameCodeSnaps) {
          this.readMonitor?.record?.('getDocs', `${base}/reference_standards`, snap.docs.length, { phase: 'batch' });
          for (const d of snap.docs) {
            relatedStandardsMap.set(d.id, { id: d.id, ...d.data() } as ReferenceStandard);
          }
        }

        const registrySnaps = await Promise.all(
          targetCodes.map(code => getDoc(doc(this.fb.db, `${base}/standard_code_registry/${code}`)))
        );
        this.readMonitor?.record?.('getDoc', `${base}/standard_code_registry`, registrySnaps.length, { phase: 'single' });
        registries = registrySnaps
          .filter(snap => snap.exists())
          .map(snap => ({ id: snap.id, ...snap.data() } as StandardCodeRegistry));
      }

      standards = [...relatedStandardsMap.values()];

      const hiddenIds = hidden.map(s => s.id);
      if (hiddenIds.length > 0) {
        const idChunks: string[][] = [];
        for (let i = 0; i < hiddenIds.length; i += 30) {
          idChunks.push(hiddenIds.slice(i, i + 30));
        }
        const requestSnaps = await Promise.all(
          idChunks.map(chunk => getDocs(query(requestsCollection, where('standardId', 'in', chunk))))
        );
        for (const snap of requestSnaps) {
          this.readMonitor?.record?.('getDocs', `${base}/standard_requests`, snap.docs.length, { phase: 'batch' });
          for (const d of snap.docs) {
            const req = { id: d.id, ...d.data() } as StandardRequest;
            if (req._isDeleted !== true && isActiveStandardRequestStatus(req.status) && req.standardId) {
              openRequests.add(req.standardId);
            }
          }
        }
      }
    } else {
      const [standardsSnapshot, registriesSnapshot, requestsSnapshot] = await Promise.all([
        getDocs(standardsCollection),
        getDocs(registryCollection),
        getDocs(requestsCollection),
      ]);
      this.readMonitor?.record?.('getDocs', `${base}/reference_standards`, standardsSnapshot.docs.length, { phase: 'batch' });
      this.readMonitor?.record?.('getDocs', `${base}/standard_code_registry`, registriesSnapshot.docs.length, { phase: 'batch' });
      this.readMonitor?.record?.('getDocs', `${base}/standard_requests`, requestsSnapshot.docs.length, { phase: 'batch' });

      standards = standardsSnapshot.docs.map(snapshot => ({ id: snapshot.id, ...snapshot.data() } as ReferenceStandard));
      hidden = standards.filter(standard => standard._isDeleted === true || standard.status === 'DELETED');
      registries = registriesSnapshot.docs.map(snapshot => ({ ...snapshot.data(), id: snapshot.id } as StandardCodeRegistry));
      openRequests = new Set(
        requestsSnapshot.docs
          .map(snapshot => ({ id: snapshot.id, ...snapshot.data() } as StandardRequest))
          .filter(request => request._isDeleted !== true && isActiveStandardRequestStatus(request.status))
          .map(request => request.standardId)
          .filter(Boolean),
      );
    }
    const registryByCode = this.indexRegistries(registries);
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
    const outcome = await this.recallEligibleCodesWithOutcome(report, reason, options);
    return outcome.results;
  }

  async recallEligibleCodesWithOutcome(
    report: StandardCodeRecallReport,
    reason: string,
    options: StandardCodeRecallExecutionOptions = {},
  ): Promise<StandardCodeRecallBatchOutcome> {
    if (!this.auth.canEditStandards()) throw new Error('Bạn không có quyền thu hồi mã của chuẩn đã ẩn.');
    const normalizedReason = reason.trim();
    if (!normalizedReason) throw new Error('Cần ghi rõ lý do thu hồi mã.');

    const {
      targets,
      preservedByOperationId,
      unpersistedConfirmedResults,
      batchTargetCount,
    } = selectRecallExecutionTargets(report.items, options);
    const executedByOperationId = new Map<string, StandardCodeRecallExecutionResult>();
    let stopReason: StandardCodeRecallStopReason = 'NONE';
    let serverState: StandardCodeRecallServerState = 'PERSISTED';
    let attemptedCount = 0;
    let backfilledProjectionCount = 0;

    const startWrite = await this.writeRun({
      id: report.runId,
      status: 'RUNNING',
      reason: normalizedReason,
      totalCount: batchTargetCount,
      updatedAt: serverTimestamp(),
    });
    if (!startWrite.persisted) {
      serverState = 'UNCONFIRMED';
    }
    if (startWrite.resourceExhausted) {
      stopReason = 'RESOURCE_LIMIT';
      const initialOutcome = this.buildBatchOutcome(
        report,
        batchTargetCount,
        targets.length,
        attemptedCount,
        backfilledProjectionCount,
        preservedByOperationId,
        executedByOperationId,
        stopReason,
        serverState,
      );
      options.onProgress?.({
        current: 0,
        total: targets.length,
        percent: 0,
        phase: 'STOPPED',
        message: initialOutcome.message,
      });
      return initialOutcome;
    }

    options.onProgress?.({
      current: 0,
      total: targets.length,
      percent: 0,
      phase: 'RUNNING',
      message: 'Đang chuẩn bị thu hồi mã...',
    });

    // Step 1: Backfill run-item projections for already-confirmed items whose
    // earlier writeRunItem failed, without re-executing releaseStandardCode().
    for (const unpersisted of unpersistedConfirmedResults) {
      if (options.shouldStop?.()) {
        stopReason = 'USER_REQUESTED';
        break;
      }
      const backfillWrite = await this.writeRunItem(report.runId, unpersisted);
      if (backfillWrite.persisted) {
        preservedByOperationId.set(unpersisted.operationId, {
          ...unpersisted,
          projectionPersisted: true,
        });
        backfilledProjectionCount++;
      } else {
        serverState = 'UNCONFIRMED';
      }
      if (backfillWrite.resourceExhausted) {
        stopReason = 'RESOURCE_LIMIT';
        serverState = 'UNCONFIRMED';
        break;
      }
    }

    for (let index = 0; stopReason === 'NONE' && index < targets.length; index++) {
      if (options.shouldStop?.()) {
        stopReason = 'USER_REQUESTED';
        options.onProgress?.({
          current: index,
          total: targets.length,
          percent: targets.length ? Math.round((index / targets.length) * 100) : 100,
          phase: 'STOPPED',
          message: 'Đã dừng phần chưa bắt đầu; các giao dịch đã ghi vẫn giữ nguyên.',
        });
        break;
      }

      const item = targets[index];
      attemptedCount++;
      let result: StandardCodeRecallExecutionResult;
      let hitResourceLimit = false;

      try {
        const release = await this.registry.releaseStandardCode(item.standardId, normalizedReason, {
          operationId: item.operationId,
          source: 'RECALL',
          runId: report.runId,
          scannedCandidates: {
            expectedInternalId: item.internalId,
            standardIds: item.affectedStandardIds ?? [],
          },
        });
        result = {
          ...item,
          status: release.status,
          eventId: release.eventId,
          message: release.message,
          reason: release.message,
          completedAt: serverTimestamp(),
          outcomeState: 'CONFIRMED',
          projectionPersisted: false,
        };
      } catch (error: unknown) {
        if (isDeltaResourceExhaustedError(error)) {
          const rawReason = error instanceof Error ? error.message : String(error || 'Chạm giới hạn tài nguyên Firestore.');
          result = {
            ...item,
            status: 'FAILED',
            message: 'Chưa xác định kết quả do chạm giới hạn tài nguyên Firestore; giữ nguyên operationId để đối soát khi thử lại.',
            reason: rawReason,
            outcomeState: 'UNCONFIRMED',
            projectionPersisted: false,
            errorCode: extractRecallErrorCode(error),
          };
          hitResourceLimit = true;
        } else {
          const classified = await this.classifyExecutionFailure(item, error);
          result = classified.result;
          if (classified.resourceExhausted) {
            hitResourceLimit = true;
          }
        }
      }

      executedByOperationId.set(item.operationId, result);

      if (hitResourceLimit) {
        stopReason = 'RESOURCE_LIMIT';
        serverState = 'UNCONFIRMED';
        options.onProgress?.({
          current: index + 1,
          total: targets.length,
          percent: targets.length ? Math.round(((index + 1) / targets.length) * 100) : 100,
          phase: 'STOPPED',
          message: `${result.internalId || 'Mã chưa xác định'}: ${result.message || result.reason}`,
        });
        break;
      }

      const itemWrite = await this.writeRunItem(report.runId, result);
      if (itemWrite.persisted) {
        result.projectionPersisted = true;
      } else {
        result.projectionPersisted = false;
        serverState = 'UNCONFIRMED';
      }

      if (itemWrite.resourceExhausted) {
        stopReason = 'RESOURCE_LIMIT';
        serverState = 'UNCONFIRMED';
        options.onProgress?.({
          current: index + 1,
          total: targets.length,
          percent: targets.length ? Math.round(((index + 1) / targets.length) * 100) : 100,
          phase: 'STOPPED',
          message: `${result.internalId || 'Mã chưa xác định'}: Đã cam kết giao dịch trả mã nhưng tạm dừng đợt do chạm giới hạn tài nguyên khi ghi nhật ký đợt.`,
        });
        break;
      }

      options.onProgress?.({
        current: index + 1,
        total: targets.length,
        percent: targets.length ? Math.round(((index + 1) / targets.length) * 100) : 100,
        phase: 'RUNNING',
        message: `${result.internalId || 'Mã chưa xác định'}: ${result.message || result.reason}`,
      });
    }

    const preliminaryOutcome = this.buildBatchOutcome(
      report,
      batchTargetCount,
      targets.length,
      attemptedCount,
      backfilledProjectionCount,
      preservedByOperationId,
      executedByOperationId,
      stopReason,
      serverState,
    );

    if (stopReason !== 'RESOURCE_LIMIT') {
      const stopped = stopReason !== 'NONE' || preliminaryOutcome.unstartedCount > 0;
      const status: StandardCodeRecallRunStatus = stopped
        ? 'STOPPED'
        : preliminaryOutcome.results.some(
              result =>
                result.status === 'BLOCKED' ||
                result.status === 'FAILED' ||
                result.status === 'CHANGED_SINCE_SCAN',
            )
          ? 'COMPLETED_WITH_BLOCKS'
          : 'COMPLETED';
      const finalWrite = await this.writeRun({
        id: report.runId,
        status,
        reason: normalizedReason,
        updatedAt: serverTimestamp(),
        releasedCount: preliminaryOutcome.results.filter(result => result.status === 'RELEASED').length,
        reconciledCount: preliminaryOutcome.results.filter(result => result.status === 'RECONCILED').length,
        blockedCount: preliminaryOutcome.results.filter(
          result => result.status === 'BLOCKED' || result.status === 'CHANGED_SINCE_SCAN',
        ).length,
        failedCount: preliminaryOutcome.results.filter(result => result.status === 'FAILED').length,
        totalCount: batchTargetCount,
      });
      if (!finalWrite.persisted) {
        serverState = 'UNCONFIRMED';
      }
      if (finalWrite.resourceExhausted) {
        stopReason = 'RESOURCE_LIMIT';
        serverState = 'UNCONFIRMED';
      }
    }

    const finalOutcome = this.buildBatchOutcome(
      report,
      batchTargetCount,
      targets.length,
      attemptedCount,
      backfilledProjectionCount,
      preservedByOperationId,
      executedByOperationId,
      stopReason,
      serverState,
    );
    const stopped = finalOutcome.stopReason !== 'NONE' || finalOutcome.unstartedCount > 0;
    options.onProgress?.({
      current: attemptedCount,
      total: targets.length,
      percent: targets.length ? Math.round((attemptedCount / targets.length) * 100) : 100,
      phase: stopped ? 'STOPPED' : 'COMPLETED',
      message: finalOutcome.message,
    });
    return finalOutcome;
  }

  private buildBatchOutcome(
    report: StandardCodeRecallReport,
    batchTargetCount: number,
    attemptTargetCount: number,
    attemptedCount: number,
    backfilledProjectionCount: number,
    preservedByOperationId: ReadonlyMap<string, StandardCodeRecallExecutionResult>,
    executedByOperationId: ReadonlyMap<string, StandardCodeRecallExecutionResult>,
    stopReason: StandardCodeRecallStopReason,
    rawServerState: StandardCodeRecallServerState,
  ): StandardCodeRecallBatchOutcome {
    const results: StandardCodeRecallExecutionResult[] = [];
    for (const item of report.items) {
      const executed = executedByOperationId.get(item.operationId);
      if (executed) {
        results.push(executed);
        continue;
      }
      const preserved = preservedByOperationId.get(item.operationId);
      if (preserved) {
        results.push(preserved);
      }
    }

    const confirmedCount = results.filter(result => result.outcomeState !== 'UNCONFIRMED').length;
    const confirmedSuccessCount = results.filter(
      result =>
        result.outcomeState !== 'UNCONFIRMED' &&
        (result.status === 'RELEASED' || result.status === 'RECONCILED' || result.status === 'ALREADY_RELEASED'),
    ).length;
    const confirmedBlockedCount = results.filter(
      result =>
        result.outcomeState !== 'UNCONFIRMED' &&
        (result.status === 'BLOCKED' || result.status === 'CHANGED_SINCE_SCAN'),
    ).length;
    const confirmedFailedCount = results.filter(
      result => result.outcomeState !== 'UNCONFIRMED' && result.status === 'FAILED',
    ).length;
    const unconfirmedCount = results.filter(result => result.outcomeState === 'UNCONFIRMED').length;
    const unpersistedProjectionCount = results.filter(result => result.projectionPersisted !== true).length;
    const unstartedCount = Math.max(0, batchTargetCount - results.length);
    const serverState: StandardCodeRecallServerState =
      rawServerState === 'PERSISTED' && unpersistedProjectionCount === 0 && unconfirmedCount === 0
        ? 'PERSISTED'
        : 'UNCONFIRMED';
    const requiresReconciliation =
      unconfirmedCount > 0 || unpersistedProjectionCount > 0 || serverState === 'UNCONFIRMED';
    const canAutoRescan =
      stopReason === 'NONE' &&
      serverState === 'PERSISTED' &&
      !requiresReconciliation &&
      unpersistedProjectionCount === 0 &&
      unstartedCount === 0;

    let message = 'Đã hoàn tất đợt thu hồi; kiểm tra các mục bị chặn nếu có.';
    if (stopReason === 'RESOURCE_LIMIT') {
      message =
        'Đã dừng đợt thu hồi do chạm giới hạn tài nguyên Firestore. Các giao dịch đã xác nhận vẫn được giữ nguyên; các mục chưa xác định giữ nguyên operationId để đối soát trong phiên màn hình hiện tại.';
    } else if (stopReason === 'USER_REQUESTED') {
      message = 'Đã dừng đợt thu hồi theo yêu cầu; các giao dịch đã xác nhận được giữ nguyên.';
    } else if (serverState === 'UNCONFIRMED') {
      message =
        'Đã thực thi thu hồi mã nhưng trạng thái tổng kết đợt chưa lưu đầy đủ lên máy chủ; giữ phiên hiện tại để xem hoặc xuất báo cáo.';
    }

    return {
      runId: report.runId,
      results,
      stopReason,
      serverState,
      requiresReconciliation,
      canAutoRescan,
      targetCount: batchTargetCount,
      confirmedCount,
      confirmedSuccessCount,
      confirmedBlockedCount,
      confirmedFailedCount,
      unconfirmedCount,
      unpersistedProjectionCount,
      unstartedCount,
      attemptTargetCount,
      attemptedCount,
      backfilledProjectionCount,
      message,
    };
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

  protected getCodeEventRef(operationId: string) {
    return doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_code_events/${operationId}`);
  }

  protected getStandardRef(standardId: string) {
    return doc(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards/${standardId}`);
  }

  protected async readDocument(ref: ReturnType<typeof doc>) {
    return getDoc(ref);
  }

  private async classifyExecutionFailure(
    item: StandardCodeRecallItem,
    error: unknown,
  ): Promise<{ result: StandardCodeRecallExecutionResult; resourceExhausted: boolean }> {
    const message = error instanceof Error ? error.message : String(error || 'Lỗi không xác định.');
    const errorCode = extractRecallErrorCode(error);
    const operationId = normalizeStandardCodeOperationId(item.operationId);

    if (/đã thay đổi trạng thái ẩn sau lần quét|đã thay đổi sau lần quét|đã thay đổi đồng thời/i.test(message)) {
      return {
        result: {
          ...item,
          operationId,
          status: 'CHANGED_SINCE_SCAN',
          message,
          reason: message,
          outcomeState: 'CONFIRMED',
          projectionPersisted: false,
          errorCode,
        },
        resourceExhausted: false,
      };
    }

    let eventReadFailed = false;
    if (operationId) {
      try {
        const eventSnap = await this.readDocument(this.getCodeEventRef(operationId));
        const eventFromCache = Boolean(
          (eventSnap as { metadata?: { fromCache?: boolean } } | null | undefined)?.metadata?.fromCache,
        );
        if (eventSnap?.exists() && !eventFromCache) {
          const eventData = (eventSnap.data() || {}) as Record<string, unknown>;
          const rawType = String(eventData['type'] || '').trim();
          const eventStandardId = String(eventData['standardId'] || '').trim();
          const eventInternalId = normalizeInternalId(String(eventData['internalId'] || ''));
          const expectedInternalId = normalizeInternalId(item.internalId);
          const recordedOpIdRaw = String(
            eventData['operationId'] || eventData['eventId'] || eventData['id'] || '',
          ).trim();
          const recordedOpId = recordedOpIdRaw
            ? normalizeStandardCodeOperationId(recordedOpIdRaw)
            : operationId;
          const isValidRecallEventType = rawType === 'RELEASED' || rawType === 'RECONCILED';
          const matchesStandardId =
            Boolean(eventStandardId) && eventStandardId === String(item.standardId || '').trim();
          const matchesInternalId =
            Boolean(eventInternalId) && eventInternalId === expectedInternalId;
          const matchesOperationId = recordedOpId === operationId;

          if (!isValidRecallEventType || !matchesStandardId || !matchesInternalId || !matchesOperationId) {
            const mismatchMessage =
              `Sự kiện mã ${operationId} trên máy chủ không khớp thao tác cần đối soát ` +
              `(type=${rawType || 'trống'}, standardId=${eventStandardId || 'trống'}, internalId=${eventInternalId || 'trống'}).`;
            return {
              result: {
                ...item,
                operationId,
                status: 'FAILED',
                message: mismatchMessage,
                reason: mismatchMessage,
                outcomeState: 'CONFIRMED',
                projectionPersisted: false,
                errorCode: errorCode || 'event-mismatch',
              },
              resourceExhausted: false,
            };
          }

          const resolvedStatus: 'RELEASED' | 'RECONCILED' = rawType;
          const resolvedEventId =
            String(eventData['eventId'] || eventData['id'] || operationId).trim() || operationId;
          return {
            result: {
              ...item,
              operationId,
              internalId: eventInternalId,
              status: resolvedStatus,
              eventId: resolvedEventId,
              message:
                resolvedStatus === 'RECONCILED'
                  ? 'Đã đối soát theo sự kiện mã trên máy chủ: thao tác đối soát đã hoàn tất.'
                  : 'Đã đối soát theo sự kiện mã trên máy chủ: thao tác trả mã đã hoàn tất.',
              reason: 'Đã hoàn tất trên máy chủ theo operationId.',
              outcomeState: 'CONFIRMED',
              projectionPersisted: false,
            },
            resourceExhausted: false,
          };
        }
        if (eventFromCache) {
          eventReadFailed = true;
        }
      } catch (eventReadError: unknown) {
        if (isDeltaResourceExhaustedError(eventReadError)) {
          return {
            result: {
              ...item,
              operationId,
              status: 'FAILED',
              message: `Không thể đối soát sự kiện mã sau lỗi do chạm giới hạn tài nguyên Firestore: ${message}`,
              reason: message,
              outcomeState: 'UNCONFIRMED',
              projectionPersisted: false,
              errorCode: extractRecallErrorCode(eventReadError) || errorCode,
            },
            resourceExhausted: true,
          };
        }
        eventReadFailed = true;
      }
    }

    let snapshot;
    try {
      snapshot = await this.readDocument(this.getStandardRef(item.standardId));
    } catch (readError: unknown) {
      const readErrorCode = extractRecallErrorCode(readError) || errorCode;
      if (isDeltaResourceExhaustedError(readError)) {
        return {
          result: {
            ...item,
            operationId,
            status: 'FAILED',
            message: `Không thể đối soát hồ sơ sau lỗi do chạm giới hạn tài nguyên Firestore: ${message}`,
            reason: message,
            outcomeState: 'UNCONFIRMED',
            projectionPersisted: false,
            errorCode: readErrorCode,
          },
          resourceExhausted: true,
        };
      }
      return {
        result: {
          ...item,
          operationId,
          status: 'FAILED',
          message: `Chưa đọc lại được hồ sơ để đối soát sau lỗi (${message}); giữ nguyên operationId để đối soát khi tiếp tục.`,
          reason: message,
          outcomeState: 'UNCONFIRMED',
          projectionPersisted: false,
          errorCode: readErrorCode,
        },
        resourceExhausted: false,
      };
    }

    const snapshotFromCache = Boolean(
      (snapshot as { metadata?: { fromCache?: boolean } } | null | undefined)?.metadata?.fromCache,
    );
    if (!snapshot || snapshotFromCache || eventReadFailed) {
      return {
        result: {
          ...item,
          operationId,
          status: 'FAILED',
          message: `Chưa xác nhận được trạng thái máy chủ sau lỗi (${message}); giữ nguyên operationId để đối soát khi tiếp tục.`,
          reason: message,
          outcomeState: 'UNCONFIRMED',
          projectionPersisted: false,
          errorCode,
        },
        resourceExhausted: false,
      };
    }

    if (!snapshot.exists()) {
      return {
        result: {
          ...item,
          operationId,
          status: 'FAILED',
          message: `Đã xác nhận hồ sơ không còn tồn tại trên máy chủ sau lỗi: ${message}`,
          reason: message,
          outcomeState: 'CONFIRMED',
          projectionPersisted: false,
          errorCode,
        },
        resourceExhausted: false,
      };
    }
    const fresh = { id: snapshot.id, ...snapshot.data() } as ReferenceStandard;
    if (fresh._isDeleted !== true && fresh.status !== 'DELETED') {
      return {
        result: {
          ...item,
          operationId,
          status: 'CHANGED_SINCE_SCAN',
          message: 'Hồ sơ đã thay đổi trạng thái sau lần quét; hãy quét lại mục này.',
          reason: message,
          outcomeState: 'CONFIRMED',
          projectionPersisted: false,
          errorCode,
        },
        resourceExhausted: false,
      };
    }
    if (fresh.lifecycle_status === 'RELEASED' || fresh.lifecycle_status === 'CLOSED') {
      return {
        result: {
          ...item,
          operationId,
          status: 'ALREADY_RELEASED',
          message: 'Hồ sơ đã được xử lý bởi thao tác trước đó.',
          reason: message,
          outcomeState: 'CONFIRMED',
          projectionPersisted: false,
          errorCode,
        },
        resourceExhausted: false,
      };
    }
    const blocking = /đang được cấp|đang ghi nhận|xung đột|quy trình|yêu cầu|chưa kết thúc|đối soát|không tìm thấy sổ mã|không còn hồ sơ/i.test(message);
    if (blocking) {
      return {
        result: {
          ...item,
          operationId,
          status: 'BLOCKED',
          message,
          reason: message,
          outcomeState: 'CONFIRMED',
          projectionPersisted: false,
          errorCode,
        },
        resourceExhausted: false,
      };
    }
    const normalizedCode = (errorCode || '').toLowerCase();
    const isTerminalClientError =
      normalizedCode.includes('permission-denied') ||
      normalizedCode.includes('unauthenticated') ||
      normalizedCode.includes('invalid-argument');
    return {
      result: {
        ...item,
        operationId,
        status: 'FAILED',
        message,
        reason: message,
        outcomeState: isTerminalClientError ? 'CONFIRMED' : 'UNCONFIRMED',
        projectionPersisted: false,
        errorCode,
      },
      resourceExhausted: false,
    };
  }

  private async writeRun(
    run: Partial<StandardCodeRecallRun> & Pick<StandardCodeRecallRun, 'id'>,
  ): Promise<RecallProjectionWriteOutcome> {
    try {
      await setDoc(
        doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_code_recall_runs/${run.id}`),
        stripUndefinedFields(run as Record<string, unknown>),
        { merge: true },
      );
      return { persisted: true, resourceExhausted: false };
    } catch (error) {
      // The code event is authoritative. A projection write must not turn a
      // committed release into a reported failure when a client loses access,
      // but resource-exhausted must still stop subsequent operations in the batch.
      console.warn('[StandardCodeRecall] Could not persist run projection', error);
      return {
        persisted: false,
        resourceExhausted: isDeltaResourceExhaustedError(error),
        error,
      };
    }
  }

  private async writeRunItem(
    runId: string,
    result: StandardCodeRecallExecutionResult,
  ): Promise<RecallProjectionWriteOutcome> {
    try {
      const itemId = normalizeStandardCodeOperationId(result.operationId);
      const payload = stripUndefinedFields({
        ...result,
        projectionPersisted: true,
        runId,
        updatedAt: serverTimestamp(),
      });
      await setDoc(
        doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_code_recall_runs/${runId}/items/${itemId}`),
        payload,
        { merge: true },
      );
      return { persisted: true, resourceExhausted: false };
    } catch (error) {
      console.warn('[StandardCodeRecall] Could not persist run item projection', error);
      return {
        persisted: false,
        resourceExhausted: isDeltaResourceExhaustedError(error),
        error,
      };
    }
  }
}
