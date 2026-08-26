import '@angular/compiler';
import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ReferenceStandard,
  StandardInternalIdSyncChange,
  StandardInternalIdSyncIssue,
  StandardRequest,
} from '../../../core/models/standard.model';
import { StandardInternalIdSyncService } from './standard-internal-id-sync.service';

function createService(): {
  service: any;
  issues: StandardInternalIdSyncIssue[];
  safeChanges: StandardInternalIdSyncChange[];
  addIssue: (issue: Omit<StandardInternalIdSyncIssue, 'id'>) => StandardInternalIdSyncIssue;
  addChange: (change: StandardInternalIdSyncChange) => void;
} {
  // Use Object.create to avoid Angular DI during isolated unit testing of private inspection algorithms
  const service = Object.create(StandardInternalIdSyncService.prototype);
  const issues: StandardInternalIdSyncIssue[] = [];
  const safeChanges: StandardInternalIdSyncChange[] = [];
  let seq = 0;

  const addIssue = (issue: Omit<StandardInternalIdSyncIssue, 'id'>) => {
    const item = { ...issue, id: `test-issue-${++seq}` } as StandardInternalIdSyncIssue;
    issues.push(item);
    return item;
  };
  const addChange = (change: StandardInternalIdSyncChange) => {
    safeChanges.push(change);
  };

  return { service, issues, safeChanges, addIssue, addChange };
}

test('bounded concurrency helper limits simultaneous work and preserves input order', async () => {
  const service = Object.create(StandardInternalIdSyncService.prototype) as any;
  let active = 0;
  let maxActive = 0;
  const items = Array.from({ length: 12 }, (_, index) => index);

  const results = await service.mapWithConcurrency(items, 3, async (item: number) => {
    active += 1;
    maxActive = Math.max(maxActive, active);
    await new Promise(resolve => setTimeout(resolve, item % 2 === 0 ? 4 : 1));
    active -= 1;
    return item * 10;
  });

  assert.equal(maxActive, 3);
  assert.deepEqual(results, items.map(item => item * 10));
});

test('apply aborts a stalled fresh scan before any write phase begins', async () => {
  const service = Object.create(StandardInternalIdSyncService.prototype) as any;
  service.auth = { canEditStandards: () => true };
  service.PRE_APPLY_SCAN_TIMEOUT_MS = 5;
  service.scan = () => new Promise(() => {});

  await assert.rejects(
    service.apply({
      generatedAt: Date.now(), standardsCount: 0, requestsCount: 0, usageCount: 0,
      registryCount: 0, issues: [], safeChanges: [], conflicts: [],
    }),
    /Chưa có thay đổi nào được ghi/,
  );
});

test('detects MISSING_REFERENCE as a blocking error when top-level request lacks standardId', () => {
  const { service, issues, safeChanges, addIssue, addChange } = createService();
  const byId = new Map<string, ReferenceStandard>();
  const byCode = new Map<string, ReferenceStandard[]>();

  service.inspectReferenceSnapshot(
    'standard_requests',
    'req-1',
    { id: 'req-1', internalId: 'AA01' },
    byId,
    byCode,
    addIssue,
    addChange,
    'internalId',
  );

  assert.equal(issues.length, 1);
  assert.equal(safeChanges.length, 0);
  assert.equal(issues[0].kind, 'MISSING_REFERENCE');
  assert.equal(issues[0].severity, 'ERROR');
  assert.equal(issues[0].blocking, true);
  assert.equal(issues[0].autoFixable, false);
  assert.match(issues[0].message, /thiếu trường standardId/);
});

test('detects MISSING_REFERENCE as a blocking error when global usage log lacks standardId', () => {
  const { service, issues, safeChanges, addIssue, addChange } = createService();
  const byId = new Map<string, ReferenceStandard>();
  const byCode = new Map<string, ReferenceStandard[]>();

  service.inspectReferenceSnapshot(
    'standard_usages',
    'usage-1',
    { id: 'usage-1', internalId: 'AA01' },
    byId,
    byCode,
    addIssue,
    addChange,
    'internalId',
  );

  assert.equal(issues.length, 1);
  assert.equal(safeChanges.length, 0);
  assert.equal(issues[0].kind, 'MISSING_REFERENCE');
  assert.equal(issues[0].severity, 'ERROR');
  assert.equal(issues[0].blocking, true);
});

test('backfills missing standardId in nested logs from parent path as an explicit safeChange', () => {
  const { service, issues, safeChanges, addIssue, addChange } = createService();
  const standard: ReferenceStandard = {
    id: 'std-parent-1',
    name: 'Standard A',
    internal_id: 'AA01',
    status: 'AVAILABLE',
  } as ReferenceStandard;
  const byId = new Map([['std-parent-1', standard]]);
  const byCode = new Map([['AA01', [standard]]]);

  // Nested log without standardId field
  service.inspectReferenceSnapshot(
    'reference_standard_logs',
    'std-parent-1::log-1',
    { id: 'log-1', internalId: 'AA01' },
    byId,
    byCode,
    addIssue,
    addChange,
    'internalId',
    'std-parent-1',
  );

  assert.equal(issues.length, 0);
  assert.equal(safeChanges.length, 1);
  assert.equal(safeChanges[0].collection, 'reference_standard_logs');
  assert.equal(safeChanges[0].field, 'standardId');
  assert.equal(safeChanges[0].before, null);
  assert.equal(safeChanges[0].after, 'std-parent-1');
  assert.match(safeChanges[0].reason, /Bổ sung trường standardId còn thiếu cho nhật ký lồng/);
});

test('does not mark a nested standardId repair safe when the parent code is invalid', () => {
  const { service, issues, safeChanges, addIssue, addChange } = createService();
  const standard: ReferenceStandard = {
    id: 'std-invalid-parent',
    name: 'Standard with invalid code',
    internal_id: 'SD HẾT',
    status: 'AVAILABLE',
  } as ReferenceStandard;
  const byId = new Map([[standard.id, standard]]);
  const byCode = new Map<string, ReferenceStandard[]>();

  service.inspectReferenceSnapshot(
    'reference_standard_logs',
    'std-invalid-parent::log-1',
    { id: 'log-1' },
    byId,
    byCode,
    addIssue,
    addChange,
    'internalId',
    standard.id,
  );

  assert.equal(safeChanges.length, 0);
  assert.equal(issues.length, 1);
  assert.equal(issues[0].kind, 'USAGE_REFERENCE');
  assert.equal(issues[0].severity, 'ERROR');
  assert.equal(issues[0].blocking, true);
  assert.match(issues[0].detail, /SD HẾT/);
});

test('flags PARENT_REFERENCE_MISMATCH when nested log standardId points to a different standard', () => {
  const { service, issues, safeChanges, addIssue, addChange } = createService();
  const parentStandard: ReferenceStandard = {
    id: 'std-parent-1',
    name: 'Standard A',
    internal_id: 'AA01',
    status: 'AVAILABLE',
  } as ReferenceStandard;
  const otherStandard: ReferenceStandard = {
    id: 'std-other-2',
    name: 'Standard B',
    internal_id: 'BA02',
    status: 'AVAILABLE',
  } as ReferenceStandard;

  const byId = new Map([
    ['std-parent-1', parentStandard],
    ['std-other-2', otherStandard],
  ]);
  const byCode = new Map([
    ['AA01', [parentStandard]],
    ['BA02', [otherStandard]],
  ]);

  // Nested log placed under std-parent-1 but standardId contains std-other-2
  service.inspectReferenceSnapshot(
    'reference_standard_logs',
    'std-parent-1::log-mismatch',
    { id: 'log-mismatch', standardId: 'std-other-2', internalId: 'BA02' },
    byId,
    byCode,
    addIssue,
    addChange,
    'internalId',
    'std-parent-1',
  );

  assert.equal(issues.length, 1);
  assert.equal(safeChanges.length, 0);
  assert.equal(issues[0].kind, 'PARENT_REFERENCE_MISMATCH');
  assert.equal(issues[0].severity, 'ERROR');
  assert.equal(issues[0].blocking, true);
  assert.equal(issues[0].autoFixable, false);
  assert.equal(issues[0].parentStandardId, 'std-parent-1');
  assert.equal(issues[0].referencedStandardId, 'std-other-2');
  assert.match(issues[0].message, /Nhật ký nằm trong chuẩn std-parent-1 nhưng trường standardId lại ghi nhận std-other-2/);
});

test('repairs nested log legacy internal code when it uniquely resolves to parent standard', () => {
  const { service, issues, safeChanges, addIssue, addChange } = createService();
  const parentStandard: ReferenceStandard = {
    id: 'std-parent-1',
    name: 'Standard A',
    internal_id: 'AA01',
    status: 'AVAILABLE',
  } as ReferenceStandard;

  const byId = new Map([['std-parent-1', parentStandard]]);
  const byCode = new Map([['AA01', [parentStandard]]]);

  service.inspectReferenceSnapshot(
    'reference_standard_logs',
    'std-parent-1::log-legacy',
    { id: 'log-legacy', standardId: 'aa01', internalId: 'AA01' },
    byId,
    byCode,
    addIssue,
    addChange,
    'internalId',
    'std-parent-1',
  );

  assert.equal(issues.length, 0);
  assert.equal(safeChanges.length, 1);
  assert.equal(safeChanges[0].field, 'standardId');
  assert.equal(safeChanges[0].before, 'aa01');
  assert.equal(safeChanges[0].after, 'std-parent-1');
});

test('detects PARENT_REFERENCE_MISMATCH inside embedded usageLogs in standard_requests', () => {
  const { service, issues, safeChanges, addIssue, addChange } = createService();
  const parentStandard: ReferenceStandard = {
    id: 'std-1',
    name: 'Standard A',
    internal_id: 'AA01',
    status: 'AVAILABLE',
  } as ReferenceStandard;
  const otherStandard: ReferenceStandard = {
    id: 'std-2',
    name: 'Standard B',
    internal_id: 'BA02',
    status: 'AVAILABLE',
  } as ReferenceStandard;

  const byId = new Map([
    ['std-1', parentStandard],
    ['std-2', otherStandard],
  ]);
  const byCode = new Map([
    ['AA01', [parentStandard]],
    ['BA02', [otherStandard]],
  ]);

  const request: StandardRequest = {
    id: 'req-embed-1',
    standardId: 'std-1',
    usageLogs: [
      { id: 'log-ok', standardId: 'std-1', internalId: 'AA01' } as any,
      { id: 'log-bad', standardId: 'std-2', internalId: 'BA02' } as any,
    ],
  } as StandardRequest;

  service.inspectEmbeddedUsageLogs(request, byId, byCode, addIssue, addChange);

  assert.equal(issues.length, 1);
  assert.equal(issues[0].kind, 'PARENT_REFERENCE_MISMATCH');
  assert.equal(issues[0].severity, 'ERROR');
  assert.equal(issues[0].blocking, true);
  assert.equal(issues[0].parentStandardId, 'std-1');
  assert.equal(issues[0].referencedStandardId, 'std-2');
});

test('preserves historical snapshot mismatch as a non-blocking warning without auto-overwrite', () => {
  const { service, issues, safeChanges, addIssue, addChange } = createService();
  const standard: ReferenceStandard = {
    id: 'std-1',
    name: 'Standard A',
    internal_id: 'AA01',
    status: 'AVAILABLE',
  } as ReferenceStandard;
  const byId = new Map([['std-1', standard]]);
  const byCode = new Map([['AA01', [standard]]]);

  service.inspectReferenceSnapshot(
    'standard_usages',
    'usage-hist-1',
    { id: 'usage-hist-1', standardId: 'std-1', internalId: 'BA99' },
    byId,
    byCode,
    addIssue,
    addChange,
    'internalId',
  );

  assert.equal(issues.length, 1);
  assert.equal(safeChanges.length, 0);
  assert.equal(issues[0].kind, 'USAGE_REFERENCE');
  assert.equal(issues[0].severity, 'WARNING');
  assert.equal(issues[0].blocking, false);
  assert.equal(issues[0].autoFixable, false);
  assert.equal(issues[0].internalId, 'BA99');
  assert.equal(issues[0].suggestedInternalId, 'AA01');
});

test('preserves lowercase raw registry ID and plans canonical migration without delete', () => {
  const { service, issues, safeChanges, addIssue, addChange } = createService();
  const owner: ReferenceStandard = {
    id: 'std-1',
    name: 'Standard A',
    internal_id: 'AA01',
    status: 'AVAILABLE',
    lifecycle_status: 'ACTIVE',
  } as ReferenceStandard;
  const byId = new Map([['std-1', owner]]);
  const byCode = new Map([['AA01', [owner]]]);

  const result = service.inspectRegistryEntries(
    [{
      rawDocumentId: 'aa01',
      canonicalCode: 'AA01',
      registry: {
        id: 'aa01',
        internal_id: 'aa01',
        status: 'ASSIGNED',
        currentStandardId: 'std-1',
        assignmentCount: 1,
      },
    }],
    byId,
    byCode,
    addIssue,
    addChange,
  );

  assert.equal(result.blockedCodes.has('AA01'), false);
  assert.equal(result.registries.get('AA01')?.currentStandardId, 'std-1');
  assert.equal(issues.length, 1);
  assert.equal(issues[0].kind, 'REGISTRY_KEY_MISMATCH');
  assert.equal(issues[0].severity, 'WARNING');
  assert.equal(issues[0].blocking, false);
  assert.equal(issues[0].rawDocumentId, 'aa01');
  assert.equal(issues[0].canonicalDocumentId, 'AA01');
  assert.equal(safeChanges.length, 2);
  assert.deepEqual(
    safeChanges.map(change => [change.documentId, change.field]),
    [['AA01', '__document__'], ['aa01', '__migration__']],
  );
  assert.ok(safeChanges.every(change => change.field === '__document__' || change.field === '__migration__'));
});

test('blocks duplicate raw registry IDs that normalize to the same canonical code', () => {
  const { service, issues, safeChanges, addIssue, addChange } = createService();
  const owner: ReferenceStandard = {
    id: 'std-1', name: 'Standard A', internal_id: 'AA01', status: 'AVAILABLE', lifecycle_status: 'ACTIVE',
  } as ReferenceStandard;
  const byId = new Map([['std-1', owner]]);
  const byCode = new Map([['AA01', [owner]]]);

  const result = service.inspectRegistryEntries(
    [
      {
        rawDocumentId: 'AA01', canonicalCode: 'AA01',
        registry: { id: 'AA01', internal_id: 'AA01', status: 'ASSIGNED', currentStandardId: 'std-1', assignmentCount: 1 },
      },
      {
        rawDocumentId: 'aa01', canonicalCode: 'AA01',
        registry: { id: 'aa01', internal_id: 'aa01', status: 'ASSIGNED', currentStandardId: 'std-1', assignmentCount: 1 },
      },
    ],
    byId,
    byCode,
    addIssue,
    addChange,
  );

  assert.equal(result.blockedCodes.has('AA01'), true);
  assert.equal(result.registries.has('AA01'), false);
  assert.equal(issues.length, 2);
  assert.ok(issues.every(issue => issue.kind === 'REGISTRY_KEY_MISMATCH'));
  assert.ok(issues.every(issue => issue.blocking === true));
  assert.equal(safeChanges.length, 0);
});

test('treats migrated raw registry alias plus canonical row as non-blocking history', () => {
  const { service, issues, safeChanges, addIssue, addChange } = createService();
  const owner: ReferenceStandard = {
    id: 'std-1', name: 'Standard A', internal_id: 'AA01', status: 'AVAILABLE', lifecycle_status: 'ACTIVE',
  } as ReferenceStandard;
  const byId = new Map([['std-1', owner]]);
  const byCode = new Map([['AA01', [owner]]]);

  const result = service.inspectRegistryEntries(
    [
      {
        rawDocumentId: 'AA01', canonicalCode: 'AA01',
        registry: { id: 'AA01', internal_id: 'AA01', status: 'ASSIGNED', currentStandardId: 'std-1', assignmentCount: 1 },
      },
      {
        rawDocumentId: 'aa01', canonicalCode: 'AA01',
        registry: {
          id: 'aa01', internal_id: 'aa01', status: 'ASSIGNED', currentStandardId: 'std-1', assignmentCount: 1,
          migrationStatus: 'MIGRATED', migratedTo: 'AA01',
        },
      },
    ],
    byId,
    byCode,
    addIssue,
    addChange,
  );

  assert.equal(result.blockedCodes.has('AA01'), false);
  assert.equal(result.registries.get('AA01')?.id, 'AA01');
  assert.equal(issues.length, 1);
  assert.equal(issues[0].severity, 'INFO');
  assert.equal(issues[0].blocking, false);
  assert.match(issues[0].message, /alias/);
  assert.equal(safeChanges.length, 0);
});

test('blocks invalid registry status and assigned registry without an owner', () => {
  const { service, issues, safeChanges, addIssue, addChange } = createService();
  const byId = new Map<string, ReferenceStandard>();
  const byCode = new Map<string, ReferenceStandard[]>();

  const result = service.inspectRegistryEntries(
    [
      {
        rawDocumentId: 'AA01', canonicalCode: 'AA01',
        registry: { id: 'AA01', internal_id: 'AA01', status: 'BROKEN', assignmentCount: 0 } as any,
      },
      {
        rawDocumentId: 'BA01', canonicalCode: 'BA01',
        registry: { id: 'BA01', internal_id: 'BA01', status: 'ASSIGNED', assignmentCount: 1 },
      },
    ],
    byId,
    byCode,
    addIssue,
    addChange,
  );

  assert.equal(result.blockedCodes.has('AA01'), true);
  assert.equal(result.blockedCodes.has('BA01'), true);
  assert.equal(issues.length, 2);
  assert.ok(issues.every(issue => issue.kind === 'REGISTRY_MISMATCH'));
  assert.ok(issues.every(issue => issue.blocking === true));
  assert.equal(safeChanges.length, 0);
});

test('repairs AVAILABLE registry that still carries currentStandardId', () => {
  const { service, issues, safeChanges, addIssue, addChange } = createService();
  const byId = new Map<string, ReferenceStandard>();
  const byCode = new Map<string, ReferenceStandard[]>();

  const result = service.inspectRegistryEntries(
    [{
      rawDocumentId: 'CA01', canonicalCode: 'CA01',
      registry: { id: 'CA01', internal_id: 'CA01', status: 'AVAILABLE', currentStandardId: 'stale-owner', assignmentCount: 2 },
    }],
    byId,
    byCode,
    addIssue,
    addChange,
  );

  assert.equal(result.blockedCodes.has('CA01'), false);
  assert.equal(issues.length, 0);
  assert.equal(safeChanges.length, 1);
  assert.equal(safeChanges[0].documentId, 'CA01');
  assert.equal((safeChanges[0].after as any).currentStandardId, null);
});

test('merges multiple planned registry document changes without dropping earlier fields', () => {
  const { service } = createService();
  const changes: StandardInternalIdSyncChange[] = [
    {
      collection: 'standard_code_registry',
      documentId: 'CA01',
      field: '__document__',
      before: { internal_id: ' ca01 ', status: 'AVAILABLE', currentStandardId: 'stale-owner' },
      after: { internal_id: 'CA01' },
      reason: 'Chuẩn hóa internal_id.',
    },
    {
      collection: 'standard_code_registry',
      documentId: 'CA01',
      field: '__document__',
      before: { internal_id: ' ca01 ', status: 'AVAILABLE', currentStandardId: 'stale-owner' },
      after: { currentStandardId: null },
      reason: 'Xóa owner dư thừa.',
    },
  ];

  const merged = service.mergeChanges(changes);

  assert.equal(merged.length, 1);
  assert.deepEqual(merged[0].before, changes[0].before);
  assert.deepEqual(merged[0].after, { internal_id: 'CA01', currentStandardId: null });
  assert.match(merged[0].reason, /Chuẩn hóa internal_id/);
  assert.match(merged[0].reason, /Xóa owner dư thừa/);
});

test('chunks 2053 changes below both the logical-change and Security Rules budgets', () => {
  const { planInternalIdBatches, INTERNAL_ID_SYNC_MAX_RULE_ACCESS_COST } = require('../../../shared/utils/standard-internal-id');
  const changes: StandardInternalIdSyncChange[] = Array.from({ length: 2053 }, (_, index) => ({
    collection: 'reference_standards',
    documentId: `std-${index}`,
    field: 'internal_id',
    before: `AA${String(index).padStart(2, '0')}`,
    after: `BA${String(index).padStart(2, '0')}`,
    reason: 'test',
  }));

  const plan = planInternalIdBatches(changes, 249);
  const chunks = plan.chunks.map((chunk: any) => chunk.changes);

  assert.ok(chunks.length > 9, 'Security Rules access budget should split the old 9 logical chunks further');
  assert.equal(chunks.flat().length, 2053);
  assert.ok(chunks.every(chunk => chunk.length < 250));
  assert.ok(plan.chunks.every((chunk: any) => chunk.estimatedRuleAccessCost <= INTERNAL_ID_SYNC_MAX_RULE_ACCESS_COST));
  assert.equal(new Set(chunks.flat().map(change => change.documentId)).size, 2053);
});

test('blocks assigned registry when owner is missing or carries a different code', () => {
  const { service, issues, safeChanges, addIssue, addChange } = createService();
  const wrongOwner: ReferenceStandard = {
    id: 'std-wrong', name: 'Standard B', internal_id: 'BA02', status: 'AVAILABLE', lifecycle_status: 'ACTIVE',
  } as ReferenceStandard;
  const byId = new Map([['std-wrong', wrongOwner]]);
  const byCode = new Map([['BA02', [wrongOwner]]]);

  const result = service.inspectRegistryEntries(
    [
      {
        rawDocumentId: 'AA01', canonicalCode: 'AA01',
        registry: { id: 'AA01', internal_id: 'AA01', status: 'ASSIGNED', currentStandardId: 'missing-owner', assignmentCount: 1 },
      },
      {
        rawDocumentId: 'CA01', canonicalCode: 'CA01',
        registry: { id: 'CA01', internal_id: 'CA01', status: 'ASSIGNED', currentStandardId: 'std-wrong', assignmentCount: 1 },
      },
    ],
    byId,
    byCode,
    addIssue,
    addChange,
  );

  assert.equal(result.blockedCodes.has('AA01'), true);
  assert.equal(result.blockedCodes.has('CA01'), true);
  assert.equal(issues.length, 2);
  assert.match(issues[0].message, /không tồn tại/);
  assert.match(issues[1].message, /mã khác/);
  assert.equal(safeChanges.length, 0);
});

test('apply() fails closed during preflight if corrections contains invalid format code', async () => {
  const service = Object.create(StandardInternalIdSyncService.prototype);
  (service as any).auth = { canEditStandards: () => true };

  await assert.rejects(
    async () => {
      await service.apply(
        { generatedAt: Date.now(), standardsCount: 0, requestsCount: 0, usageCount: 0, registryCount: 0, issues: [], safeChanges: [], conflicts: [] },
        { 'std-1': 'INVALID_CODE_123' },
      );
    },
    /không đúng định dạng/,
  );
});

test('apply() fails closed during preflight if multiple standards are assigned the same target code', async () => {
  const service = Object.create(StandardInternalIdSyncService.prototype);
  (service as any).auth = { canEditStandards: () => true };

  await assert.rejects(
    async () => {
      await service.apply(
        { generatedAt: Date.now(), standardsCount: 0, requestsCount: 0, usageCount: 0, registryCount: 0, issues: [], safeChanges: [], conflicts: [] },
        {
          'std-1': 'AA01',
          'std-2': ' aa01 ',
        },
      );
    },
    /bị nhập trùng cho 2 hồ sơ/,
  );
});

test('planInternalIdBatches keeps correlated reference_standards and standard_code_registry in the same batch chunk', () => {
  const { planInternalIdBatches } = require('../../../shared/utils/standard-internal-id');

  // Create 124 standards (2 changes each = 248 changes)
  const changes: StandardInternalIdSyncChange[] = [];
  for (let i = 0; i < 124; i++) {
    changes.push({
      collection: 'reference_standards',
      documentId: `std-filler-${i}`,
      field: 'internal_id',
      before: 'AA01',
      after: 'AA01',
      reason: 'filler',
    });
    changes.push({
      collection: 'reference_standards',
      documentId: `std-filler-${i}`,
      field: 'search_key',
      before: 'old',
      after: 'new',
      reason: 'filler',
    });
  }

  // Add 1 standard (2 changes) and its correlated registry document (1 change)
  // Total 248 + 3 = 251 changes.
  // Standard and registry MUST be together in Batch 2 (or Batch 1), never split between Batch 1 and Batch 2!
  changes.push({
    collection: 'reference_standards',
    documentId: 'std-linked-999',
    field: 'internal_id',
    before: 'ba01',
    after: 'BA01',
    reason: 'normalize',
  });
  changes.push({
    collection: 'reference_standards',
    documentId: 'std-linked-999',
    field: 'search_key',
    before: 'old',
    after: 'new',
    reason: 'search_key',
  });
  changes.push({
    collection: 'standard_code_registry',
    documentId: 'BA01',
    field: '__document__',
    before: null,
    after: { currentStandardId: 'std-linked-999' },
    reason: 'registry sync',
  });

  const plan = planInternalIdBatches(changes, 249, Number.MAX_SAFE_INTEGER);
  assert.equal(plan.totalBatches, 2);

  // Find the chunks containing std-linked-999 and registry BA01
  const stdChunkIndex = plan.chunks.findIndex(chunk =>
    chunk.changes.some(c => c.collection === 'reference_standards' && c.documentId === 'std-linked-999')
  );
  const regChunkIndex = plan.chunks.findIndex(chunk =>
    chunk.changes.some(c => c.collection === 'standard_code_registry' && c.documentId === 'BA01')
  );

  assert.ok(stdChunkIndex >= 0);
  assert.ok(regChunkIndex >= 0);
  assert.equal(stdChunkIndex, regChunkIndex, 'Standard and Registry must be in the EXACT same batch chunk');
});

test('planInternalIdBatches keeps a changing parent standard with its nested log repairs', () => {
  const { planInternalIdBatches } = require('../../../shared/utils/standard-internal-id');
  const changes: StandardInternalIdSyncChange[] = [];

  for (let i = 0; i < 248; i++) {
    changes.push({
      collection: 'reference_standard_logs',
      documentId: `filler-${String(i).padStart(3, '0')}::log-1`,
      field: 'internalId',
      before: 'aa01',
      after: 'AA01',
      reason: 'filler',
    });
  }
  changes.push({
    collection: 'reference_standard_logs',
    documentId: 'std-parent::log-child',
    field: 'internalId',
    before: ' ba01 ',
    after: 'BA01',
    reason: 'normalize nested snapshot',
  });
  changes.push({
    collection: 'reference_standards',
    documentId: 'std-parent',
    field: 'internal_id',
    before: ' ba01 ',
    after: 'BA01',
    reason: 'normalize parent',
  });

  const plan = planInternalIdBatches(changes, 249, Number.MAX_SAFE_INTEGER);
  const parentChunkIndex = plan.chunks.findIndex(chunk =>
    chunk.changes.some(c => c.collection === 'reference_standards' && c.documentId === 'std-parent')
  );
  const childChunkIndex = plan.chunks.findIndex(chunk =>
    chunk.changes.some(c => c.collection === 'reference_standard_logs' && c.documentId === 'std-parent::log-child')
  );

  assert.ok(parentChunkIndex >= 0);
  assert.ok(childChunkIndex >= 0);
  assert.equal(parentChunkIndex, childChunkIndex, 'Parent standard and nested log repair must be atomic');
});

test('planInternalIdBatches keeps a legacy registry alias migration with its canonical target across the 249-change boundary', async () => {
  const { planInternalIdBatches } = await import('../../../shared/utils/standard-internal-id');
  const changes: StandardInternalIdSyncChange[] = [];

  // Fill almost one whole chunk. Without correlating __migration__ with its
  // migratedTo target, the lowercase alias sorts before the uppercase
  // canonical document and the planner can split the getAfter dependency.
  for (let i = 0; i < 248; i++) {
    changes.push({
      collection: 'reference_standard_logs',
      documentId: `filler-${String(i).padStart(3, '0')}::log-1`,
      field: 'internalId',
      before: 'aa01',
      after: 'AA01',
      reason: 'filler',
    });
  }
  changes.push({
    collection: 'standard_code_registry',
    documentId: 'ba01',
    field: '__migration__',
    before: { migrationStatus: null, migratedTo: null },
    after: { migrationStatus: 'MIGRATED', migratedTo: 'BA01' },
    reason: 'mark legacy alias migrated',
  });
  changes.push({
    collection: 'standard_code_registry',
    documentId: 'BA01',
    field: '__document__',
    before: null,
    after: { id: 'BA01', internal_id: 'BA01', status: 'AVAILABLE', assignmentCount: 0 },
    reason: 'create canonical registry target',
  });

  const plan = planInternalIdBatches(changes, 249, Number.MAX_SAFE_INTEGER);
  assert.equal(plan.totalBatches, 2);

  const aliasChunkIndex = plan.chunks.findIndex(chunk =>
    chunk.changes.some(c => c.collection === 'standard_code_registry' && c.documentId === 'ba01')
  );
  const canonicalChunkIndex = plan.chunks.findIndex(chunk =>
    chunk.changes.some(c => c.collection === 'standard_code_registry' && c.documentId === 'BA01')
  );

  assert.ok(aliasChunkIndex >= 0);
  assert.ok(canonicalChunkIndex >= 0);
  assert.equal(aliasChunkIndex, canonicalChunkIndex, 'Alias migration and canonical registry target must be atomic');
  assert.equal(plan.chunks[aliasChunkIndex].changeCount, 2);
});

test('StandardSyncPartialFailureError retains completedBatchIds, completedChangesCount and failedBatchIndex', () => {
  const { StandardSyncPartialFailureError } = require('../../../shared/utils/standard-internal-id');

  const err = new StandardSyncPartialFailureError(
    'Đã áp dụng thành công 4/9 batch. Batch 5 bị lỗi mạng.',
    ['batch-1', 'batch-2', 'batch-3', 'batch-4'],
    996,
    5,
    9,
    new Error('Network timeout'),
  );

  assert.equal(err.name, 'StandardSyncPartialFailureError');
  assert.equal(err.completedBatchIds.length, 4);
  assert.equal(err.completedChangesCount, 996);
  assert.equal(err.failedBatchIndex, 5);
  assert.equal(err.totalBatches, 9);
  assert.match(err.message, /4\/9 batch/);
});
