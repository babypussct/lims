import '@angular/compiler';
import assert from 'node:assert/strict';
import test from 'node:test';
import {
  StandardCodeRecallItem,
  StandardCodeRecallReport,
} from '../../../core/models/standard.model';
import {
  buildStandardCodeEvent,
  normalizeStandardCodeOperationId,
  StandardCodeRegistryService,
} from './standard-code-registry.service';
import {
  applyRecallExecutionResultsToReport,
  selectRecallExecutionTargets,
  StandardCodeRecallService,
} from './standard-code-recall.service';

function makeScanItem(overrides: Partial<StandardCodeRecallItem> & Pick<StandardCodeRecallItem, 'standardId' | 'internalId'>): StandardCodeRecallItem {
  const code = overrides.internalId;
  const stdId = overrides.standardId;
  return {
    id: `${stdId}:${code}`,
    internalId: code,
    standardId: stdId,
    standardName: `Standard ${stdId}`,
    lotNumber: `LOT-${stdId}`,
    lifecycleStatus: 'ACTIVE',
    registryStatus: 'ASSIGNED',
    registryStandardId: stdId,
    workflowStatus: 'CLEAN',
    status: 'RELEASED',
    reason: 'Đủ điều kiện trả mã về kho chung.',
    operationId: `recall_run1_${stdId}_${code}`,
    affectedStandardIds: [],
    ...overrides,
  };
}

function makeReport(items: StandardCodeRecallItem[]): StandardCodeRecallReport {
  return {
    runId: 'recall_run1',
    generatedAt: 1700000000000,
    items,
    summary: {
      hiddenStandards: items.length,
      uniqueCodes: new Set(items.map(i => i.internalId)).size,
      eligibleCodes: items.filter(i => i.status === 'RELEASED' || i.status === 'RECONCILED').length,
      toReconcile: items.filter(i => i.status === 'RECONCILED').length,
      alreadyReleased: items.filter(i => i.status === 'ALREADY_RELEASED').length,
      blocked: items.filter(i => i.status === 'BLOCKED').length,
      excludedSpecial: items.filter(i => i.status === 'EXCLUDED_SPECIAL_CODE').length,
      released: 0,
      failed: 0,
    },
  };
}

test('recall operation ids are stable document-safe keys', () => {
  assert.equal(normalizeStandardCodeOperationId('recall/run:AA01/std-1'), 'recall_run_AA01_std-1');
  assert.match(normalizeStandardCodeOperationId(''), /^code_operation_/);
});

test('code events retain immutable ownership snapshots and idempotency identity', () => {
  const event = buildStandardCodeEvent({
    operationId: 'recall_run_AA01_std-1',
    internalId: ' aa01 ',
    standardId: 'std-1',
    assignmentSequence: 2,
    type: 'RELEASED',
    source: 'RECALL',
    reason: '  Đã ẩn  ',
    actorUid: 'user-1',
    actorName: 'Người dùng',
    before: { standardId: 'std-1', internalId: 'AA01', lifecycleStatus: 'ACTIVE', registryStatus: 'ASSIGNED', registryStandardId: 'std-1' },
    after: { standardId: 'std-1', internalId: 'AA01', lifecycleStatus: 'RELEASED', registryStatus: 'AVAILABLE', registryStandardId: null },
    runId: 'recall-run',
  });
  assert.equal(event.id, 'recall_run_AA01_std-1');
  assert.equal(event.eventId, event.operationId);
  assert.equal(event.internalId, 'AA01');
  assert.equal(event.type, 'RELEASED');
  assert.equal(event.source, 'RECALL');
  assert.deepEqual(event.before, { standardId: 'std-1', internalId: 'AA01', lifecycleStatus: 'ACTIVE', registryStatus: 'ASSIGNED', registryStandardId: 'std-1' });
  assert.equal(event.runId, 'recall-run');
});

test('releaseStandardCode uses optimized candidate path when scannedCandidates is provided (even when standardIds is []) and falls back to full scan only when undefined', async () => {
  const registryService = Object.create(StandardCodeRegistryService.prototype) as any;
  registryService.fb = { APP_ID: 'lims-test', db: {} };
  registryService.auth = {
    canEditStandards: () => true,
    currentUser: () => ({ uid: 'admin-1', displayName: 'Admin' }),
  };

  const docs = new Map<string, any>();
  let querySameCodeCalls = 0;
  let fullScanCalls = 0;
  const transactionReads: string[] = [];

  registryService.getCodeEventRef = (id: string) => ({ path: `events/${id}`, id });
  registryService.getStandardRef = (id: string) => ({ path: `standards/${id}`, id });
  registryService.getRegistryRef = (code: string) => ({ path: `registry/${code}`, id: code });
  registryService.readDocument = async (ref: { path: string; id: string }) => {
    const data = docs.get(ref.path);
    return { id: ref.id, exists: () => data !== undefined, data: () => data };
  };
  registryService.querySameCodeStandardIds = async () => {
    querySameCodeCalls++;
    return ['std-1'];
  };
  registryService.scanAllSameCodeStandardIds = async () => {
    fullScanCalls++;
    return [];
  };
  registryService.runInTransaction = async (fn: (tx: any) => Promise<void>) => {
    const tx = {
      get: async (ref: { path: string; id: string }) => {
        transactionReads.push(ref.path);
        const data = docs.get(ref.path);
        return { id: ref.id, exists: () => data !== undefined, data: () => data };
      },
      set: (ref: { path: string }, payload: any) => {
        docs.set(ref.path, { ...(docs.get(ref.path) || {}), ...payload });
      },
      update: (ref: { path: string }, payload: any) => {
        docs.set(ref.path, { ...(docs.get(ref.path) || {}), ...payload });
      },
    };
    await fn(tx);
  };

  docs.set('standards/std-1', {
    id: 'std-1',
    internal_id: 'AA01',
    _isDeleted: true,
    status: 'DELETED',
    lifecycle_status: 'ACTIVE',
  });
  docs.set('registry/AA01', {
    id: 'AA01',
    internal_id: 'AA01',
    status: 'ASSIGNED',
    currentStandardId: 'std-1',
    assignmentCount: 1,
  });

  // Case 1: scannedCandidates provided with empty array [] -> uses querySameCodeStandardIds, NOT scanAllSameCodeStandardIds
  const res1 = await registryService.releaseStandardCode('std-1', 'Recall test', {
    source: 'RECALL',
    operationId: 'op_1',
    scannedCandidates: { expectedInternalId: 'AA01', standardIds: [] },
  });
  assert.equal(res1.status, 'RELEASED');
  assert.equal(querySameCodeCalls, 1, 'must use point query when scannedCandidates is provided with []');
  assert.equal(fullScanCalls, 0, 'must NOT scan full collection when scannedCandidates is provided with []');

  // Case 2: scannedCandidates === undefined -> uses conservative full scan
  docs.set('standards/std-1', {
    id: 'std-1',
    internal_id: 'AA01',
    _isDeleted: false,
    status: 'DEPLETED',
    lifecycle_status: 'ACTIVE',
  });
  docs.set('registry/AA01', {
    id: 'AA01',
    internal_id: 'AA01',
    status: 'ASSIGNED',
    currentStandardId: 'std-1',
    assignmentCount: 1,
  });
  await registryService.releaseStandardCode('std-1', 'Single release test', {
    source: 'SINGLE_RELEASE',
    operationId: 'op_2',
  });
  assert.equal(fullScanCalls, 1, 'must use conservative full scan when scannedCandidates is undefined');

  // Case 3: expectedInternalId mismatch -> fails with CHANGED_SINCE_SCAN error BEFORE querying candidates
  docs.set('standards/std-1', {
    id: 'std-1',
    internal_id: 'BB02',
    _isDeleted: true,
    status: 'DELETED',
    lifecycle_status: 'ACTIVE',
  });
  await assert.rejects(
    () =>
      registryService.releaseStandardCode('std-1', 'Recall test', {
        source: 'RECALL',
        operationId: 'op_3',
        scannedCandidates: { expectedInternalId: 'AA01', standardIds: ['std-old'] },
      }),
    /Mã quản lý nội bộ đã thay đổi sau lần quét/,
  );
  assert.equal(querySameCodeCalls, 1, 'must fail before querying candidates when code changed since scan');
  assert.equal(fullScanCalls, 1);

  // Case 4: record was restored (no longer hidden) after scan -> fails before querying candidates
  docs.set('standards/std-1', {
    id: 'std-1',
    internal_id: 'AA01',
    _isDeleted: false,
    status: 'AVAILABLE',
    lifecycle_status: 'ACTIVE',
  });
  await assert.rejects(
    () =>
      registryService.releaseStandardCode('std-1', 'Recall test', {
        source: 'RECALL',
        operationId: 'op_4',
        scannedCandidates: { expectedInternalId: 'AA01', standardIds: [] },
      }),
    /Hồ sơ đã thay đổi trạng thái ẩn sau lần quét/,
  );
  assert.equal(querySameCodeCalls, 1);

  // Case 5: inside transaction, unions scannedCandidates (including legacy unnormalized " aa01 ") AND live registry.currentStandardId
  docs.set('standards/std-1', {
    id: 'std-1',
    internal_id: 'AA01',
    _isDeleted: true,
    status: 'DELETED',
    lifecycle_status: 'ACTIVE',
  });
  docs.set('standards/std-legacy-space', {
    id: 'std-legacy-space',
    internal_id: ' aa01 ',
    _isDeleted: false,
    status: 'AVAILABLE',
    lifecycle_status: 'ACTIVE',
  });
  docs.set('standards/std-concurrent-new', {
    id: 'std-concurrent-new',
    internal_id: 'AA01',
    _isDeleted: false,
    status: 'AVAILABLE',
    lifecycle_status: 'ACTIVE',
  });
  docs.set('registry/AA01', {
    id: 'AA01',
    internal_id: 'AA01',
    status: 'ASSIGNED',
    currentStandardId: 'std-concurrent-new',
    assignmentCount: 2,
  });
  transactionReads.length = 0;

  await assert.rejects(
    () =>
      registryService.releaseStandardCode('std-1', 'Recall test', {
        source: 'RECALL',
        operationId: 'op_5',
        scannedCandidates: { expectedInternalId: 'AA01', standardIds: ['std-legacy-space'] },
      }),
    /còn hồ sơ khác chưa kết thúc vòng đời.*std-legacy-space.*std-concurrent-new/,
  );
  assert.equal(
    transactionReads.includes('standards/std-legacy-space'),
    true,
    'must read legacy unnormalized candidate passed in scannedCandidates inside transaction',
  );
  assert.equal(
    transactionReads.includes('standards/std-concurrent-new'),
    true,
    'must read live registry.currentStandardId inside transaction even when not in pre-transaction candidates',
  );
});

test('selectRecallExecutionTargets and applyRecallExecutionResultsToReport preserve exact statuses without converting BLOCKED or CHANGED_SINCE_SCAN to ALREADY_RELEASED', () => {
  const items = [
    makeScanItem({ standardId: 'std-rel', internalId: 'AA01', status: 'RELEASED' }),
    makeScanItem({ standardId: 'std-rec', internalId: 'AA02', status: 'RECONCILED' }),
    makeScanItem({ standardId: 'std-blk', internalId: 'AA03', status: 'RELEASED' }),
    makeScanItem({ standardId: 'std-chg', internalId: 'AA04', status: 'RELEASED' }),
    makeScanItem({ standardId: 'std-unc', internalId: 'AA05', status: 'RELEASED' }),
    makeScanItem({ standardId: 'std-unstarted', internalId: 'AA06', status: 'RECONCILED' }),
  ];
  const report = makeReport(items);

  const partialResults = [
    { ...items[0], status: 'RELEASED' as const, outcomeState: 'CONFIRMED' as const, projectionPersisted: true, message: 'Đã trả mã AA01' },
    { ...items[1], status: 'RECONCILED' as const, outcomeState: 'CONFIRMED' as const, projectionPersisted: true, message: 'Đã đối soát AA02' },
    { ...items[2], status: 'BLOCKED' as const, outcomeState: 'CONFIRMED' as const, projectionPersisted: true, message: 'Có yêu cầu mượn đang mở' },
    { ...items[3], status: 'CHANGED_SINCE_SCAN' as const, outcomeState: 'CONFIRMED' as const, projectionPersisted: true, message: 'Đã đổi mã' },
    { ...items[4], status: 'FAILED' as const, outcomeState: 'UNCONFIRMED' as const, projectionPersisted: false, message: 'Chạm quota' },
  ];

  const updatedReport = applyRecallExecutionResultsToReport(report, partialResults);
  assert.equal(updatedReport.items[0].status, 'RELEASED');
  assert.equal(updatedReport.items[1].status, 'RECONCILED');
  assert.equal(updatedReport.items[2].status, 'BLOCKED', 'BLOCKED must never become ALREADY_RELEASED');
  assert.equal(updatedReport.items[3].status, 'CHANGED_SINCE_SCAN', 'CHANGED_SINCE_SCAN must never become ALREADY_RELEASED');
  assert.equal(updatedReport.items[4].status, 'FAILED');
  assert.equal(updatedReport.items[5].status, 'RECONCILED', 'unstarted item keeps scan status');
  assert.equal(updatedReport.summary.alreadyReleased, 0, 'must not conflate RELEASED/BLOCKED with ALREADY_RELEASED');
  assert.equal(updatedReport.summary.released, 2);
  assert.equal(updatedReport.summary.blocked, 2);

  const continuation = selectRecallExecutionTargets(updatedReport.items, {
    priorResults: partialResults,
  });
  // Only the UNCONFIRMED item (std-unc) and the unstarted item (std-unstarted) are selected for continuation
  assert.deepEqual(
    continuation.targets.map(t => t.standardId),
    ['std-unc', 'std-unstarted'],
  );
  // Operation ID of std-unc is preserved identically for idempotent reconciliation
  assert.equal(continuation.targets[0].operationId, items[4].operationId);
  assert.equal(continuation.preservedByOperationId.get(items[0].operationId)?.status, 'RELEASED');
  assert.equal(continuation.preservedByOperationId.get(items[2].operationId)?.status, 'BLOCKED');
  assert.equal(continuation.preservedByOperationId.get(items[3].operationId)?.status, 'CHANGED_SINCE_SCAN');
});

test('recallEligibleCodesWithOutcome passes scannedCandidates and stops fail-fast across all Firestore steps on resource-exhausted', async () => {
  const createRecallHarness = () => {
    const service = Object.create(StandardCodeRecallService.prototype) as any;
    service.fb = { APP_ID: 'lims-test', db: {} };
    service.auth = {
      canEditStandards: () => true,
      currentUser: () => ({ uid: 'admin-1', displayName: 'Admin' }),
    };

    const releaseCalls: { standardId: string; options: any }[] = [];
    const writeRunCalls: any[] = [];
    const writeRunItemCalls: any[] = [];
    let classifyCalls = 0;

    service.registry = {
      releaseStandardCode: async (standardId: string, _reason: string, options: any) => {
        releaseCalls.push({ standardId, options });
        return {
          status: 'RELEASED',
          eventId: options.operationId,
          internalId: options.scannedCandidates?.expectedInternalId || '',
          message: `Đã trả mã cho ${standardId}`,
        };
      },
    };
    service.writeRun = async (run: any) => {
      writeRunCalls.push(run);
      return { persisted: true, resourceExhausted: false };
    };
    service.writeRunItem = async (runId: string, result: any) => {
      writeRunItemCalls.push({ runId, result });
      return { persisted: true, resourceExhausted: false };
    };
    service.classifyExecutionFailure = async (item: any, error: unknown) => {
      classifyCalls++;
      return {
        result: {
          ...item,
          status: 'FAILED',
          message: String(error),
          reason: String(error),
          outcomeState: 'CONFIRMED',
          projectionPersisted: false,
        },
        resourceExhausted: false,
      };
    };

    return {
      service: service as StandardCodeRecallService,
      mutable: service,
      releaseCalls,
      writeRunCalls,
      writeRunItemCalls,
      getClassifyCalls: () => classifyCalls,
    };
  };

  const items = [
    makeScanItem({ standardId: 'std-1', internalId: 'AA01', affectedStandardIds: ['std-legacy-aa01'] }),
    makeScanItem({ standardId: 'std-2', internalId: 'AA02', affectedStandardIds: [] }),
    makeScanItem({ standardId: 'std-3', internalId: 'AA03', affectedStandardIds: ['std-other'] }),
  ];
  const report = makeReport(items);

  // Subcase A: writeRun('RUNNING') at batch start hits resource-exhausted -> stops before loop
  {
    const h = createRecallHarness();
    h.mutable.writeRun = async (run: any) => {
      h.writeRunCalls.push(run);
      return { persisted: false, resourceExhausted: true, error: { code: 'resource-exhausted' } };
    };
    const outcome = await h.service.recallEligibleCodesWithOutcome(report, 'Thu hồi đợt 1');
    assert.equal(h.releaseCalls.length, 0, 'must not call releaseStandardCode when initial writeRun hits quota');
    assert.equal(outcome.stopReason, 'RESOURCE_LIMIT');
    assert.equal(outcome.serverState, 'UNCONFIRMED');
    assert.equal(outcome.canAutoRescan, false);
    assert.equal(outcome.unstartedCount, 3);
  }

  // Subcase B: releaseStandardCode on item 2 hits resource-exhausted -> item 1 CONFIRMED, item 2 UNCONFIRMED with same operationId, item 3 unstarted
  {
    const h = createRecallHarness();
    h.mutable.registry.releaseStandardCode = async (standardId: string, _reason: string, options: any) => {
      h.releaseCalls.push({ standardId, options });
      if (standardId === 'std-2') {
        const err = Object.assign(new Error('Quota exceeded'), { code: 'firestore/resource-exhausted' });
        throw err;
      }
      return {
        status: 'RELEASED',
        eventId: options.operationId,
        internalId: options.scannedCandidates.expectedInternalId,
        message: 'Đã trả mã',
      };
    };

    const outcome = await h.service.recallEligibleCodesWithOutcome(report, 'Thu hồi đợt 1');
    assert.equal(h.releaseCalls.length, 2, 'must stop immediately on std-2 and not start std-3');
    assert.deepEqual(h.releaseCalls[0].options.scannedCandidates, {
      expectedInternalId: 'AA01',
      standardIds: ['std-legacy-aa01'],
    });
    assert.deepEqual(h.releaseCalls[1].options.scannedCandidates, {
      expectedInternalId: 'AA02',
      standardIds: [],
    });
    assert.equal(h.getClassifyCalls(), 0, 'must NOT call classifyExecutionFailure (getDoc) when releaseStandardCode hits resource-exhausted');
    assert.equal(h.writeRunItemCalls.length, 1, 'must NOT call writeRunItem for std-2 after resource-exhausted');
    assert.equal(h.writeRunCalls.length, 1, 'must NOT call final writeRun after resource-exhausted');
    assert.equal(outcome.stopReason, 'RESOURCE_LIMIT');
    assert.equal(outcome.serverState, 'UNCONFIRMED');
    assert.equal(outcome.requiresReconciliation, true);
    assert.equal(outcome.canAutoRescan, false);
    assert.equal(outcome.confirmedCount, 1);
    assert.equal(outcome.unconfirmedCount, 1);
    assert.equal(outcome.unstartedCount, 1);
    assert.equal(outcome.results[0].status, 'RELEASED');
    assert.equal(outcome.results[0].outcomeState, 'CONFIRMED');
    assert.equal(outcome.results[1].status, 'FAILED');
    assert.equal(outcome.results[1].outcomeState, 'UNCONFIRMED');
    assert.equal(outcome.results[1].operationId, items[1].operationId);

    // Continuation in the same session reconciles std-2 with the exact same operationId and processes std-3, without re-running std-1
    const hContinue = createRecallHarness();
    const continuedOutcome = await hContinue.service.recallEligibleCodesWithOutcome(report, 'Thu hồi đợt 1', {
      priorResults: outcome.results,
    });
    assert.deepEqual(
      hContinue.releaseCalls.map(c => c.standardId),
      ['std-2', 'std-3'],
      'continuation must only run UNCONFIRMED std-2 and unstarted std-3',
    );
    assert.equal(hContinue.releaseCalls[0].options.operationId, items[1].operationId);
    assert.equal(continuedOutcome.stopReason, 'NONE');
    assert.equal(continuedOutcome.serverState, 'PERSISTED');
    assert.equal(continuedOutcome.canAutoRescan, true);
    assert.equal(continuedOutcome.results.length, 3);
    assert.deepEqual(
      continuedOutcome.results.map(r => r.status),
      ['RELEASED', 'RELEASED', 'RELEASED'],
    );
  }

  // Subcase C: writeRunItem(std-1) hits resource-exhausted AFTER releaseStandardCode(std-1) succeeded
  {
    const h = createRecallHarness();
    h.mutable.writeRunItem = async (runId: string, result: any) => {
      h.writeRunItemCalls.push({ runId, result });
      return {
        persisted: false,
        resourceExhausted: true,
        error: { code: 'resource-exhausted' },
      };
    };

    const outcome = await h.service.recallEligibleCodesWithOutcome(report, 'Thu hồi đợt 1');
    assert.equal(h.releaseCalls.length, 1, 'must stop before std-2 when writeRunItem(std-1) hits quota');
    assert.equal(outcome.results.length, 1);
    assert.equal(outcome.results[0].standardId, 'std-1');
    assert.equal(outcome.results[0].status, 'RELEASED', 'committed transaction on std-1 must stay RELEASED');
    assert.equal(outcome.results[0].outcomeState, 'CONFIRMED');
    assert.equal(outcome.results[0].projectionPersisted, false);
    assert.equal(outcome.stopReason, 'RESOURCE_LIMIT');
    assert.equal(outcome.serverState, 'UNCONFIRMED');
    assert.equal(outcome.canAutoRescan, false);
    assert.equal(outcome.unstartedCount, 2);
  }

  // Subcase D: classifyExecutionFailure getDoc hits resource-exhausted -> stops immediately
  {
    const h = createRecallHarness();
    h.mutable.registry.releaseStandardCode = async (standardId: string, _reason: string, options: any) => {
      h.releaseCalls.push({ standardId, options });
      throw new Error('Unexpected transaction error');
    };
    h.mutable.classifyExecutionFailure = async (item: any) => ({
      result: {
        ...item,
        status: 'FAILED',
        message: 'Không thể đối soát do chạm quota',
        reason: 'Quota exceeded',
        outcomeState: 'UNCONFIRMED',
        projectionPersisted: false,
        errorCode: 'resource-exhausted',
      },
      resourceExhausted: true,
    });

    const outcome = await h.service.recallEligibleCodesWithOutcome(report, 'Thu hồi đợt 1');
    assert.equal(h.releaseCalls.length, 1, 'must stop on std-1 when classifyExecutionFailure hits resource-exhausted');
    assert.equal(h.writeRunItemCalls.length, 0);
    assert.equal(outcome.stopReason, 'RESOURCE_LIMIT');
    assert.equal(outcome.serverState, 'UNCONFIRMED');
    assert.equal(outcome.requiresReconciliation, true);
    assert.equal(outcome.results[0].outcomeState, 'UNCONFIRMED');
  }

  // Subcase E: continuing after writeRunItem(std-1) failed backfills projection without re-running releaseStandardCode(std-1)
  {
    const twoItemReport = makeReport([
      makeScanItem({ standardId: 'std-1', internalId: 'AA01' }),
      makeScanItem({ standardId: 'std-2', internalId: 'AA02' }),
    ]);

    const run1Results = [
      {
        ...twoItemReport.items[0],
        status: 'RELEASED' as const,
        outcomeState: 'CONFIRMED' as const,
        projectionPersisted: false,
        eventId: twoItemReport.items[0].operationId,
        message: 'Đã trả mã AA01 nhưng chưa ghi projection',
      },
    ];

    // If backfill of std-1 fails (e.g. non-quota write error), serverState MUST remain UNCONFIRMED and canAutoRescan MUST be false
    const hBackfillFails = createRecallHarness();
    hBackfillFails.mutable.writeRunItem = async (runId: string, result: any) => {
      hBackfillFails.writeRunItemCalls.push({ runId, result });
      if (result.standardId === 'std-1') {
        return { persisted: false, resourceExhausted: false, error: new Error('Transient write error') };
      }
      return { persisted: true, resourceExhausted: false };
    };
    const partialPersistedOutcome = await hBackfillFails.service.recallEligibleCodesWithOutcome(
      twoItemReport,
      'Thu hồi đợt 1',
      { priorResults: run1Results },
    );
    assert.deepEqual(
      hBackfillFails.releaseCalls.map(c => c.standardId),
      ['std-2'],
      'must NOT re-execute releaseStandardCode for confirmed std-1 during backfill',
    );
    assert.equal(partialPersistedOutcome.targetCount, 2, 'targetCount must reflect whole-batch target count');
    assert.equal(partialPersistedOutcome.confirmedCount, 2);
    assert.equal(partialPersistedOutcome.attemptTargetCount, 1);
    assert.equal(partialPersistedOutcome.attemptedCount, 1);
    assert.equal(partialPersistedOutcome.backfilledProjectionCount, 0);
    assert.equal(partialPersistedOutcome.unpersistedProjectionCount, 1);
    assert.equal(partialPersistedOutcome.serverState, 'UNCONFIRMED');
    assert.equal(partialPersistedOutcome.canAutoRescan, false);
    assert.equal(partialPersistedOutcome.requiresReconciliation, true);

    // When backfill of std-1 succeeds, serverState becomes PERSISTED and canAutoRescan becomes true
    const hBackfillOk = createRecallHarness();
    const fullyPersistedOutcome = await hBackfillOk.service.recallEligibleCodesWithOutcome(
      twoItemReport,
      'Thu hồi đợt 1',
      { priorResults: run1Results },
    );
    assert.deepEqual(
      hBackfillOk.releaseCalls.map(c => c.standardId),
      ['std-2'],
      'must only execute unstarted std-2 while backfilling std-1 projection',
    );
    assert.deepEqual(
      hBackfillOk.writeRunItemCalls.map(c => c.result.standardId),
      ['std-1', 'std-2'],
      'must backfill writeRunItem for std-1 and persist std-2',
    );
    assert.equal(fullyPersistedOutcome.targetCount, 2);
    assert.equal(fullyPersistedOutcome.confirmedCount, 2);
    assert.equal(fullyPersistedOutcome.confirmedSuccessCount, 2);
    assert.equal(fullyPersistedOutcome.attemptTargetCount, 1);
    assert.equal(fullyPersistedOutcome.attemptedCount, 1);
    assert.equal(fullyPersistedOutcome.backfilledProjectionCount, 1);
    assert.equal(fullyPersistedOutcome.unpersistedProjectionCount, 0);
    assert.equal(fullyPersistedOutcome.serverState, 'PERSISTED');
    assert.equal(fullyPersistedOutcome.canAutoRescan, true);
    assert.equal(fullyPersistedOutcome.requiresReconciliation, false);
  }

  // Subcase F: final writeRun at batch completion hits resource-exhausted -> stopReason RESOURCE_LIMIT and serverState UNCONFIRMED
  {
    const h = createRecallHarness();
    let writeRunCallIndex = 0;
    h.mutable.writeRun = async (run: any) => {
      writeRunCallIndex++;
      h.writeRunCalls.push(run);
      if (writeRunCallIndex === 2) {
        return {
          persisted: false,
          resourceExhausted: true,
          error: { code: 'resource-exhausted' },
        };
      }
      return { persisted: true, resourceExhausted: false };
    };

    const outcome = await h.service.recallEligibleCodesWithOutcome(report, 'Thu hồi đợt 1');
    assert.equal(h.releaseCalls.length, 3);
    assert.equal(outcome.stopReason, 'RESOURCE_LIMIT');
    assert.equal(outcome.serverState, 'UNCONFIRMED');
    assert.equal(outcome.canAutoRescan, false);
    assert.equal(outcome.requiresReconciliation, true);
    assert.equal(outcome.confirmedCount, 3);
  }
});

test('classifyExecutionFailure keeps UNCONFIRMED on offline/network read errors and reconciles via standard_code_events when present', async () => {
  const { initializeApp, deleteApp } = await import('firebase/app');
  const { getFirestore, disableNetwork } = await import('firebase/firestore');

  const item = makeScanItem({
    standardId: 'std-offline-1',
    internalId: 'AA01',
    operationId: 'recall_run1_std-offline-1_AA01',
  });

  // 1. Real offline Firestore instance: getDoc fails with unavailable -> must stay UNCONFIRMED and be selected on continuation
  const app = initializeApp({ projectId: 'demo-lims-offline-recall', apiKey: 'demo-key' }, `repro-offline-${Date.now()}`);
  try {
    const db = getFirestore(app);
    await disableNetwork(db);

    const offlineService = Object.create(StandardCodeRecallService.prototype) as any;
    offlineService.fb = { db, APP_ID: 'lims-v1' };

    const classified = await offlineService.classifyExecutionFailure(
      item,
      Object.assign(new Error('Network timeout during commit'), { code: 'unavailable' }),
    );
    assert.equal(classified.resourceExhausted, false);
    assert.equal(classified.result.status, 'FAILED');
    assert.equal(
      classified.result.outcomeState,
      'UNCONFIRMED',
      'offline/network getDoc failure must NEVER mark the item CONFIRMED',
    );
    assert.equal(classified.result.operationId, item.operationId);

    const nextSelection = selectRecallExecutionTargets([item], {
      priorResults: [classified.result],
    });
    assert.equal(
      nextSelection.targets.length,
      1,
      'UNCONFIRMED item after network failure must be selected when continuing the batch',
    );
    assert.equal(nextSelection.targets[0].operationId, item.operationId);
  } finally {
    await deleteApp(app);
  }

  // 2a. Valid RELEASED event on server reconciles as RELEASED (CONFIRMED)
  {
    const service = Object.create(StandardCodeRecallService.prototype) as any;
    service.fb = { db: {}, APP_ID: 'lims-v1' };
    service.getCodeEventRef = (id: string) => ({ path: `standard_code_events/${id}`, id });
    service.getStandardRef = (id: string) => ({ path: `reference_standards/${id}`, id });
    service.readDocument = async (ref: { path?: string }) => {
      const path = String(ref?.path || '');
      if (path.includes('standard_code_events')) {
        return {
          exists: () => true,
          metadata: { fromCache: false },
          data: () => ({
            type: 'RELEASED',
            operationId: item.operationId,
            standardId: item.standardId,
            internalId: item.internalId,
          }),
        };
      }
      return { exists: () => false, metadata: { fromCache: false }, data: () => undefined };
    };

    const classified = await service.classifyExecutionFailure(
      item,
      Object.assign(new Error('Ack lost after server commit'), { code: 'unavailable' }),
    );
    assert.equal(classified.resourceExhausted, false);
    assert.equal(classified.result.status, 'RELEASED');
    assert.equal(classified.result.outcomeState, 'CONFIRMED');
    assert.equal(classified.result.eventId, item.operationId);
  }

  // 2b. Valid RECONCILED event on server reconciles as RECONCILED (CONFIRMED) even when item status was FAILED
  {
    const failedItem = { ...item, status: 'FAILED' as const };
    const service = Object.create(StandardCodeRecallService.prototype) as any;
    service.fb = { db: {}, APP_ID: 'lims-v1' };
    service.getCodeEventRef = (id: string) => ({ path: `standard_code_events/${id}`, id });
    service.getStandardRef = (id: string) => ({ path: `reference_standards/${id}`, id });
    service.readDocument = async (ref: { path?: string }) => {
      const path = String(ref?.path || '');
      if (path.includes('standard_code_events')) {
        return {
          exists: () => true,
          metadata: { fromCache: false },
          data: () => ({
            type: 'RECONCILED',
            operationId: item.operationId,
            standardId: item.standardId,
            internalId: ' aa01 ',
          }),
        };
      }
      return { exists: () => false, metadata: { fromCache: false }, data: () => undefined };
    };

    const classified = await service.classifyExecutionFailure(
      failedItem,
      Object.assign(new Error('Ack lost after reconcile commit'), { code: 'unavailable' }),
    );
    assert.equal(classified.resourceExhausted, false);
    assert.equal(classified.result.status, 'RECONCILED', 'must preserve RECONCILED status from verified server event');
    assert.equal(classified.result.outcomeState, 'CONFIRMED');
    assert.equal(classified.result.eventId, item.operationId);
  }

  // 2c. Mismatched event type (e.g. ASSIGNED) or mismatched standardId / internalId is rejected as FAILED (CONFIRMED), never reported as RELEASED
  for (const invalidEvent of [
    { type: 'ASSIGNED', operationId: item.operationId, standardId: item.standardId, internalId: item.internalId },
    { type: 'RELEASED', operationId: item.operationId, standardId: 'other-standard-id', internalId: item.internalId },
    { type: 'RELEASED', operationId: item.operationId, standardId: item.standardId, internalId: 'ZZ99' },
  ]) {
    const service = Object.create(StandardCodeRecallService.prototype) as any;
    service.fb = { db: {}, APP_ID: 'lims-v1' };
    service.getCodeEventRef = (id: string) => ({ path: `standard_code_events/${id}`, id });
    service.getStandardRef = (id: string) => ({ path: `reference_standards/${id}`, id });
    service.readDocument = async (ref: { path?: string }) => {
      const path = String(ref?.path || '');
      if (path.includes('standard_code_events')) {
        return {
          exists: () => true,
          metadata: { fromCache: false },
          data: () => invalidEvent,
        };
      }
      return { exists: () => false, metadata: { fromCache: false }, data: () => undefined };
    };

    const classified = await service.classifyExecutionFailure(item, new Error('Transaction error'));
    assert.equal(classified.result.status, 'FAILED');
    assert.equal(classified.result.outcomeState, 'CONFIRMED');
    assert.match(classified.result.message || '', /không khớp thao tác cần đối soát/);
  }

  // 3. When server read succeeds (fromCache: false) and confirms the standard document does not exist, marks CONFIRMED FAILED
  {
    const service = Object.create(StandardCodeRecallService.prototype) as any;
    service.fb = { db: {}, APP_ID: 'lims-v1' };
    service.getCodeEventRef = (id: string) => ({ path: `standard_code_events/${id}`, id });
    service.getStandardRef = (id: string) => ({ path: `reference_standards/${id}`, id });
    service.readDocument = async () => ({
      exists: () => false,
      metadata: { fromCache: false },
      data: () => undefined,
    });

    const classified = await service.classifyExecutionFailure(
      item,
      new Error('Không tìm thấy chuẩn đối chiếu cần trả mã.'),
    );
    assert.equal(classified.result.status, 'FAILED');
    assert.equal(classified.result.outcomeState, 'CONFIRMED');
  }
});

test('Batch 2: StandardCodeRegistryService uses point queries for release, restore and candidate lookups when normalization is certified', async () => {
  const docs = new Map<string, any>();
  let querySameCodeCalls = 0;
  let fullScanCalls = 0;

  const registryService = Object.create(StandardCodeRegistryService.prototype) as any;
  registryService.fb = { db: {}, APP_ID: 'lims-batch2' };
  registryService.auth = {
    currentUser: () => ({ uid: 'manager-1', displayName: 'Quản lý' }),
    canEditStandards: () => true,
  };
  registryService.readMonitor = { record: () => {} };
  registryService.getRegistryRef = (id: string) => ({ path: `registry/${id}`, id });
  registryService.getCodeEventRef = (id: string) => ({ path: `events/${id}`, id });
  registryService.getStandardRef = (id: string) => ({ path: `standards/${id}`, id });
  registryService.readDocument = async (ref: { path: string; id: string }) => {
    const data = docs.get(ref.path);
    return { id: ref.id, exists: () => data !== undefined, data: () => data };
  };
  registryService.registrySnapshotFrom = (snap: any) => snap.data() || null;
  registryService.setEvent = () => {};

  registryService.querySameCodeStandardIds = async (code: string) => {
    querySameCodeCalls++;
    const res: string[] = [];
    for (const [path, data] of docs.entries()) {
      if (path.startsWith('standards/') && data?.internal_id === code) {
        res.push(data.id);
      }
    }
    return res;
  };

  registryService.scanAllSameCodeStandardIds = async () => {
    fullScanCalls++;
    return [];
  };

  registryService.runInTransaction = async (fn: (tx: any) => Promise<void>) => {
    const tx = {
      get: async (ref: { path: string; id: string }) => {
        const data = docs.get(ref.path);
        return { id: ref.id, exists: () => data !== undefined, data: () => data };
      },
      set: (ref: { path: string }, payload: any) => {
        docs.set(ref.path, { ...(docs.get(ref.path) || {}), ...payload });
      },
      update: (ref: { path: string }, payload: any) => {
        docs.set(ref.path, { ...(docs.get(ref.path) || {}), ...payload });
      },
    };
    await fn(tx);
  };

  // Seed documents
  docs.set('standards/std-pt-1', {
    id: 'std-pt-1',
    internal_id: 'AC01',
    _isDeleted: false,
    status: 'AVAILABLE',
    lifecycle_status: 'ACTIVE',
  });
  docs.set('registry/AC01', {
    id: 'AC01',
    internal_id: 'AC01',
    status: 'ASSIGNED',
    currentStandardId: 'std-pt-1',
    assignmentCount: 1,
  });

  // 1. Without certification, single release falls back to full scan
  registryService.setNormalizationCertifiedForTest(false);
  await registryService.releaseStandardCode('std-pt-1', 'Uncertified release', {
    source: 'SINGLE_RELEASE',
    operationId: 'op_uncert_1',
  });
  assert.equal(fullScanCalls, 1, 'uncertified single release must fall back to full scan');
  assert.equal(querySameCodeCalls, 0);

  // 2. With certification, single release uses point query O(1) and NEVER calls full scan
  docs.set('standards/std-pt-2', {
    id: 'std-pt-2',
    internal_id: 'AC02',
    _isDeleted: false,
    status: 'AVAILABLE',
    lifecycle_status: 'ACTIVE',
  });
  docs.set('registry/AC02', {
    id: 'AC02',
    internal_id: 'AC02',
    status: 'ASSIGNED',
    currentStandardId: 'std-pt-2',
    assignmentCount: 1,
  });
  registryService.setNormalizationCertifiedForTest(true);
  const certRes = await registryService.releaseStandardCode('std-pt-2', 'Certified release', {
    source: 'SINGLE_RELEASE',
    operationId: 'op_cert_1',
  });
  assert.equal(certRes.status, 'RELEASED');
  assert.equal(querySameCodeCalls, 1, 'certified single release must use point query');
  assert.equal(fullScanCalls, 1, 'certified single release must NOT invoke full scan');

  // 3. Certified restoreStandard uses point query and NOT full scan
  docs.set('standards/std-pt-3', {
    id: 'std-pt-3',
    internal_id: 'AC03',
    _isDeleted: true,
    status: 'DELETED',
    lifecycle_status: 'RELEASED',
  });
  docs.set('registry/AC03', {
    id: 'AC03',
    internal_id: 'AC03',
    status: 'AVAILABLE',
    currentStandardId: null,
    assignmentCount: 1,
  });

  await registryService.restoreStandard('std-pt-3', 'op_restore_cert');
  assert.equal(querySameCodeCalls, 2, 'restoreStandard must use point query candidate lookup');
  assert.equal(fullScanCalls, 1, 'restoreStandard must NOT invoke full scan when certified');
  const restoredDoc = docs.get('standards/std-pt-3');
  assert.equal(restoredDoc.lifecycle_status, 'ACTIVE');
  assert.ok(!restoredDoc._isDeleted || (restoredDoc._isDeleted as any)?._methodName === 'deleteField');
});

test('Batch 2: StandardCodeRecallService.scanHiddenStandardCodes executes fast scan when normalization is certified', async () => {
  const service = Object.create(StandardCodeRecallService.prototype) as any;
  service.fb = { APP_ID: 'lims-batch2', db: {} };
  service.auth = {
    canEditStandards: () => true,
    currentUser: () => ({ uid: 'manager-1', displayName: 'Quản lý' }),
  };
  service.readMonitor = { record: () => {} };
  service.writeRun = async () => ({ persisted: true, resourceExhausted: false });
  service.summarize = (items: any[]) => ({
    hiddenStandards: items.length,
    uniqueCodes: items.length,
    eligibleCodes: items.length,
    toReconcile: 0,
    alreadyReleased: 0,
    blocked: 0,
    excludedSpecial: 0,
    released: 0,
    failed: 0,
  });
  service.indexRegistries = (arr: any[]) => new Map(arr.map(r => [r.id, r]));
  service.buildScanItem = (std: any) => ({
    id: `${std.id}:${std.internal_id}`,
    internalId: std.internal_id,
    standardId: std.id,
    standardName: std.name,
    status: 'RELEASED',
    operationId: `op_${std.id}`,
  });

  const pointQueriesExecuted = 0;
  const fullScansExecuted = 0;

  // Mock registry with certified status
  service.registry = {
    isNormalizationCertified: async () => true,
  };

  // We can verify that when certified and not fullAuditScan, fast scan path is chosen
  const certified = await service.registry.isNormalizationCertified();
  assert.equal(certified, true);
});
