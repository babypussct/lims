import '@angular/compiler';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import { computed, signal, untracked } from '@angular/core';

const componentPath = resolve(
  process.cwd(),
  'src/app/features/standards/components/standards-internal-id-sync-modal.component.ts',
);
const source = readFileSync(componentPath, 'utf8');
const constructorEffect = source.slice(source.indexOf('constructor()'), source.indexOf('async scan():'));

test('auto-scan keeps busy signals out of the open-state effect dependencies', () => {
  assert.match(source, /signal, untracked \} from '@angular\/core';/);
  assert.match(
    constructorEffect,
    /const open = this\.isOpen\(\);[\s\S]*?if \(open\) \{[\s\S]*?untracked\(\(\) => \{\s*void this\.scan\(\);\s*\}\);/,
  );
  assert.doesNotMatch(
    constructorEffect,
    /if \(this\.isOpen\(\)\) \{\s*void this\.scan\(\);/,
  );
});

test('untracked prevents a busy-signal change from scheduling another scan', () => {
  const open = signal(true);
  const isScanning = signal(false);
  let scanCalls = 0;
  const autoScan = computed(() => {
    if (!open()) return scanCalls;
    untracked(() => {
      isScanning();
      scanCalls += 1;
    });
    return scanCalls;
  });

  assert.equal(autoScan(), 1);
  isScanning.set(true);
  assert.equal(autoScan(), 1);
  open.set(false);
  assert.equal(autoScan(), 1);
  open.set(true);
  assert.equal(autoScan(), 2);
});

test('sync modal exposes selectable groups and searchable warning details', () => {
  assert.match(source, /type SyncFilter = 'all' \| 'manual' \| 'safe' \| 'duplicate' \| 'registry' \| 'reference'/);
  assert.match(source, /readonly filterOptions/);
  assert.match(source, /setFilter\(filter: SyncFilter\)/);
  assert.match(source, /setSearchQuery\(value: string\)/);
  assert.match(source, /filteredManualIssues/);
  assert.match(source, /filteredSafeChanges/);
  assert.match(source, /filteredConflicts/);
  assert.match(source, /issue\.detail/);
  assert.match(source, /issue\.suggestion/);
  assert.match(source, /nonManualConflicts = computed/);
  assert.match(source, /selectedSafeChangeKeys = signal/);
  assert.match(source, /toggleSafeDocument\(documentKey: string, selected: boolean\)/);
  assert.match(source, /toggleAllSafeChanges\(selected: boolean\)/);
  assert.match(source, /selectQuickBatch\(\)/);
  assert.match(source, /quickBatchTarget = computed/);
  assert.match(source, /Chọn nhanh batch/);
  assert.match(source, /Chọn tất cả/);
  assert.match(source, /dưới 250 thay đổi/);
});

test('sync modal includes MISSING_REFERENCE and PARENT_REFERENCE_MISMATCH under reference filter', () => {
  assert.match(source, /MISSING_REFERENCE/);
  assert.match(source, /PARENT_REFERENCE_MISMATCH/);
  assert.match(source, /REGISTRY_KEY_MISMATCH/);
});

test('sync modal exposes inline validation, duplicate target detection, apply summary, export and accessibility contract', () => {
  assert.match(source, /targetCodeCounts = computed/);
  assert.match(source, /correctionValidations = computed/);
  assert.match(source, /hasInvalidCorrections = computed/);
  assert.match(source, /applySummary = computed/);
  assert.match(source, /getCorrectionValidation\(documentId: string\)/);
  assert.match(source, /copyTechnicalId\(id: string\)/);
  assert.match(source, /aria-invalid/);
  assert.match(source, /aria-describedby/);
  assert.match(source, /manual-validation-/);
  assert.match(source, /role="status"/);
  assert.match(source, /aria-live="polite"/);
  assert.match(source, /manual-input-/);
  assert.match(source, /activeView = signal/);
  assert.match(source, /historyBatches = signal/);
  assert.match(source, /exportJson\(\)/);
  assert.match(source, /exportCsv\(\)/);
  assert.match(source, /aria-expanded/);
  assert.match(source, /aria-controls/);
  assert.match(source, /role="group"/);
  assert.match(source, /aria-pressed/);
});

test('behavioral: validateInternalIdCorrections flags format errors and duplicate targets in batch', () => {
  const { validateInternalIdCorrections } = require('../../../shared/utils/standard-internal-id');

  // Format error
  const res1 = validateInternalIdCorrections({ 'std-1': 'invalid_code' }, null);
  assert.equal(res1.get('std-1')?.level, 'invalid_format');
  assert.equal(res1.get('std-1')?.valid, false);

  // Duplicate in batch: both are flagged
  const res2 = validateInternalIdCorrections({ 'std-1': 'AA01', 'std-2': ' aa01 ' }, null);
  assert.equal(res2.get('std-1')?.level, 'duplicate_in_batch');
  assert.equal(res2.get('std-1')?.valid, false);
  assert.equal(res2.get('std-2')?.level, 'duplicate_in_batch');
  assert.equal(res2.get('std-2')?.valid, false);

  // Valid distinct codes
  const res3 = validateInternalIdCorrections({ 'std-1': 'AA01', 'std-2': 'BA02' }, null);
  assert.equal(res3.get('std-1')?.level, 'valid');
  assert.equal(res3.get('std-1')?.valid, true);
  assert.equal(res3.get('std-2')?.level, 'valid');
  assert.equal(res3.get('std-2')?.valid, true);
});

test('behavioral: calculateInternalIdApplySummary accounts for active vs released standards and audit batch write', () => {
  const { calculateInternalIdApplySummary } = require('../../../shared/utils/standard-internal-id');

  const report = {
    generatedAt: Date.now(),
    standardsCount: 2,
    requestsCount: 1,
    usageCount: 0,
    registryCount: 1,
    issues: [
      { id: 'iss-1', kind: 'MISSING', severity: 'ERROR', collection: 'reference_standards', documentId: 'std-active', isCurrentLifecycle: true, autoFixable: false, message: 'm1' },
      { id: 'iss-2', kind: 'MISSING', severity: 'ERROR', collection: 'reference_standards', documentId: 'std-released', isCurrentLifecycle: false, autoFixable: false, message: 'm2' },
    ],
    safeChanges: [
      { collection: 'standard_requests', documentId: 'req-1', field: 'internalId', before: 'aa01', after: 'AA01', reason: 'snap' },
    ],
    conflicts: [],
  };

  const corrections = {
    'std-active': 'AA01',
    'std-released': 'BA02',
  };

  const summary = calculateInternalIdApplySummary(report, corrections);

  // std-active (active): 2 changes on reference_standards + 1 change on registry = 3 changes, 2 documents (std-active, registry/AA01)
  // std-released (released): 2 changes on reference_standards (NO registry change) = 2 changes, 1 document (std-released)
  // safe change: 1 change on req-1 = 1 document (req-1)
  // Total changes = 1 (safe) + 3 (active) + 2 (released) = 6 changes
  assert.equal(summary.totalChanges, 6);
  // Total business documents = 4 (req-1, std-active, AA01, std-released)
  assert.equal(summary.totalDocuments, 4);
  // Actual writes = 4 business docs + 1 audit batch write = 5
  assert.equal(summary.actualWrites, 5);
  assert.equal(summary.estimatedBatches, 1);
  assert.equal(summary.manualCount, 2);
  assert.equal(summary.safeCount, 1);
  assert.equal(summary.physicalStandardsCount, 2);
  // Registry count: only std-active created a registry sync
  assert.equal(summary.registryCount, 1);
  assert.equal(summary.requestsCount, 1);
  assert.equal(summary.byChangeType.manualCorrection, 2);
  assert.equal(summary.byChangeType.registrySync, 1);
  assert.equal(summary.byChangeType.snapshotUpdate, 1);
});

test('behavioral: apply summary plans 2053 changes as nine sub-250 batches', () => {
  const { calculateInternalIdApplySummary } = require('../../../shared/utils/standard-internal-id');
  const report = {
    generatedAt: Date.now(),
    standardsCount: 2053,
    requestsCount: 0,
    usageCount: 0,
    registryCount: 0,
    issues: [],
    safeChanges: Array.from({ length: 2053 }, (_, index) => ({
      collection: 'reference_standards', documentId: `std-${index}`, field: 'search_key',
      before: 'old', after: 'new', reason: 'test',
    })),
    conflicts: [],
  };

  assert.equal(calculateInternalIdApplySummary(report, {}).estimatedBatches, 9);
});

test('behavioral: quick batch selection chooses the first valid 249-change planner chunk', () => {
  const { StandardsInternalIdSyncModalComponent } = require('./standards-internal-id-sync-modal.component');
  const { planInternalIdBatches } = require('../../../shared/utils/standard-internal-id');
  const changes = Array.from({ length: 251 }, (_, index) => ({
    collection: 'reference_standards', documentId: `std-${index}`, field: 'search_key',
    before: 'old', after: 'new', reason: 'test',
  }));
  const modal = Object.create(StandardsInternalIdSyncModalComponent.prototype);

  modal.safeChanges = signal(changes);
  modal.selectedSafeChangeKeys = signal(new Set(changes.map((change: any) => `${change.collection}/${change.documentId}`)));
  modal.isBusy = () => false;
  modal.toast = { show: () => {} };
  modal.safeDocumentKey = StandardsInternalIdSyncModalComponent.prototype['safeDocumentKey'].bind(modal);
  modal.selectedSafeChangeCount = computed(() => {
    const selected = modal.selectedSafeChangeKeys();
    return modal.safeChanges().filter((change: any) => selected.has(modal.safeDocumentKey(change))).length;
  });
  modal.allSafeChangesSelected = computed(() => modal.selectedSafeChangeCount() === modal.safeChanges().length);
  modal.quickBatchPlan = computed(() => planInternalIdBatches(modal.safeChanges(), 249));
  modal.quickBatchTarget = computed(() => {
    const chunks = modal.quickBatchPlan().chunks;
    if (modal.allSafeChangesSelected()) return chunks[0] || null;
    const selected = modal.selectedSafeChangeKeys();
    return chunks.find((chunk: any) => chunk.changes.some((change: any) => !selected.has(modal.safeDocumentKey(change)))) || null;
  });
  modal.selectQuickBatch = StandardsInternalIdSyncModalComponent.prototype.selectQuickBatch.bind(modal);

  const firstBatchCount = modal.quickBatchTarget().changeCount;
  modal.selectQuickBatch();

  assert.equal(firstBatchCount, 249);
  assert.equal(modal.selectedSafeChangeKeys().size, 249);
  assert.equal(modal.quickBatchTarget().changeCount, 2);
});

test('behavioral: StandardsInternalIdSyncModalComponent integrates validation and summary signals', () => {
  const { StandardsInternalIdSyncModalComponent } = require('./standards-internal-id-sync-modal.component');

  // Create component instance
  const modal = Object.create(StandardsInternalIdSyncModalComponent.prototype);
  modal.report = signal(null);
  modal.corrections = signal({});
  modal.isScanning = signal(false);
  modal.isApplying = signal(false);

  // Wire computeds as declared in component
  const { countTargetCodes, validateInternalIdCorrections, calculateInternalIdApplySummary } = require('../../../shared/utils/standard-internal-id');
  modal.targetCodeCounts = computed(() => countTargetCodes(modal.corrections()));
  modal.correctionValidations = computed(() => validateInternalIdCorrections(modal.corrections(), modal.report()));
  modal.hasInvalidCorrections = computed(() => {
    for (const result of modal.correctionValidations().values()) {
      if (!result.valid) return true;
    }
    return false;
  });
  modal.applySummary = computed(() => calculateInternalIdApplySummary(modal.report(), modal.corrections()));
  modal.getCorrectionValidation = (docId: string) => modal.correctionValidations().get(docId) || { level: 'empty', message: '', valid: true };
  modal.canApply = StandardsInternalIdSyncModalComponent.prototype.canApply.bind(modal);

  assert.equal(modal.canApply(), false);

  // Set report with 1 safe change
  modal.report.set({
    generatedAt: Date.now(),
    standardsCount: 1,
    requestsCount: 0,
    usageCount: 0,
    registryCount: 0,
    issues: [],
    safeChanges: [{ collection: 'reference_standards', documentId: 's1', field: 'internal_id', before: 'aa01', after: 'AA01', reason: 'c' }],
    conflicts: [],
  });

  assert.equal(modal.canApply(), true);
  assert.equal(modal.applySummary().safeCount, 1);
  assert.equal(modal.applySummary().actualWrites, 2); // 1 std doc + 1 audit batch doc

  // Add invalid correction
  modal.corrections.set({ 'std-x': 'WRONG' });
  assert.equal(modal.hasInvalidCorrections(), true);
  assert.equal(modal.canApply(), false); // disabled when invalid correction present

  // Fix correction
  modal.corrections.set({ 'std-x': 'AA01' });
  assert.equal(modal.hasInvalidCorrections(), false);
  assert.equal(modal.canApply(), true);
});

test('serializers: exportReportJson formats structured JSON with full metrics and scan metadata', () => {
  const { exportReportJson } = require('../../../shared/utils/standard-internal-id');

  const report = {
    scanId: 'scan-2026-08-15',
    generatedAt: 1771100000000,
    standardsCount: 5,
    requestsCount: 3,
    purchaseRequestsCount: 2,
    usageCount: 4,
    nestedUsageCount: 1,
    registryCount: 5,
    issues: [
      { id: 'iss-1', kind: 'MISSING', severity: 'ERROR', collection: 'reference_standards', documentId: 'std-1', message: 'Mã trống' },
    ],
    safeChanges: [
      { collection: 'reference_standards', documentId: 'std-2', field: 'internal_id', before: 'aa01', after: 'AA01', reason: 'case' },
    ],
    conflicts: [],
    blockingIssues: [],
  };

  const jsonString = exportReportJson(report, null);
  const parsed = JSON.parse(jsonString);

  assert.equal(parsed.scanId, 'scan-2026-08-15');
  assert.equal(parsed.metrics.standardsCount, 5);
  assert.equal(parsed.metrics.requestsCount, 3);
  assert.equal(parsed.metrics.purchaseRequestsCount, 2);
  assert.equal(parsed.metrics.usageCount, 4);
  assert.equal(parsed.metrics.nestedUsageCount, 1);
  assert.equal(parsed.metrics.registryCount, 5);
  assert.equal(parsed.issues.length, 1);
  assert.equal(parsed.safeChanges.length, 1);
  assert.equal(parsed.issues[0].documentId, 'std-1');
});

test('serializers: exportReportCsv generates 18-column CSV with UTF-8 BOM and proper escaping', () => {
  const { exportReportCsv, escapeCsvCell } = require('../../../shared/utils/standard-internal-id');

  // Test cell escaping
  assert.equal(escapeCsvCell('plain text'), 'plain text');
  assert.equal(escapeCsvCell('text, with comma'), '"text, with comma"');
  assert.equal(escapeCsvCell('text "with" quotes'), '"text ""with"" quotes"');
  assert.equal(escapeCsvCell('multi\nline'), '"multi\nline"');
  assert.equal(escapeCsvCell({ a: 1 }), '"{""a"":1}"');

  const report = {
    generatedAt: 1771100000000,
    standardsCount: 1,
    requestsCount: 0,
    usageCount: 0,
    registryCount: 0,
    issues: [
      {
        id: 'iss-1',
        kind: 'MISSING',
        severity: 'ERROR',
        collection: 'reference_standards',
        documentId: 'std-1',
        message: 'Thiếu mã nội bộ, cần đối chiếu',
        detail: 'Hồ sơ có tên "Chuẩn A", lô "L01"',
        suggestion: 'Kiểm tra sổ gốc',
      },
    ],
    safeChanges: [
      {
        collection: 'reference_standards',
        documentId: 'std-2',
        field: 'internal_id',
        before: 'aa01',
        after: 'AA01',
        reason: 'Chuẩn hóa chữ hoa',
      },
    ],
    conflicts: [
      {
        id: 'c-1',
        kind: 'DUPLICATE_ACTIVE',
        severity: 'ERROR',
        collection: 'reference_standards',
        documentId: 'std-3',
        internalId: 'AA01',
        message: 'Trùng mã hoạt động',
        blocking: true,
      },
    ],
  };

  const csv = exportReportCsv(report, null);

  // Starts with UTF-8 BOM
  assert.equal(csv.startsWith('\uFEFF'), true);

  // Verify headers
  const lines = csv.slice(1).split('\r\n');
  assert.equal(
    lines[0],
    'category,collection,documentId,field,kind,severity,blocking,standardId,parentStandardId,referencedStandardId,internalId,suggestedInternalId,before,after,message,detail,suggestion,reason'
  );

  // 3 data rows: 1 issue, 1 safe change, 1 conflict
  assert.equal(lines.length, 4);

  // Line 1: ISSUE
  assert.match(lines[1], /^ISSUE,reference_standards,std-1,,MISSING,ERROR,false,,,,,,,,"Thiếu mã nội bộ, cần đối chiếu","Hồ sơ có tên ""Chuẩn A"", lô ""L01""",Kiểm tra sổ gốc,$/);

  // Line 2: SAFE_CHANGE
  assert.match(lines[2], /^SAFE_CHANGE,reference_standards,std-2,internal_id,,,false,,,,,,aa01,AA01,,,,Chuẩn hóa chữ hoa$/);

  // Line 3: CONFLICT
  assert.match(lines[3], /^CONFLICT,reference_standards,std-3,,DUPLICATE_ACTIVE,ERROR,true,,,,AA01,,,,Trùng mã hoạt động,,,$/);
});

test('behavioral: audit history state transitions, async batch loading and expand/collapse contract', async () => {
  const { StandardsInternalIdSyncModalComponent } = require('./standards-internal-id-sync-modal.component');

  const modal = Object.create(StandardsInternalIdSyncModalComponent.prototype);
  modal.activeView = signal('scan');
  modal.historyBatches = signal([]);
  modal.isLoadingHistory = signal(false);
  modal.expandedBatchId = signal(null);
  modal.errorMessage = signal('');

  let loadHistoryCalls = 0;
  modal.stdService = {
    getRecentBatches: async () => {
      loadHistoryCalls += 1;
      return [
        {
          id: 'batch-001',
          status: 'APPLIED',
          generatedAt: 1771100000000,
          createdByName: 'KTV Nguyen',
          recordCount: 3,
          changes: [
            { collection: 'reference_standards', documentId: 'std-1', field: 'internal_id', before: 'aa01', after: 'AA01', reason: 'case' },
          ],
        },
        {
          id: 'batch-002',
          status: 'UNDONE',
          generatedAt: 1771000000000,
          createdByName: 'Admin',
          recordCount: 1,
          changes: [],
        },
      ];
    },
  };

  modal.setView = StandardsInternalIdSyncModalComponent.prototype.setView.bind(modal);
  modal.loadHistory = StandardsInternalIdSyncModalComponent.prototype.loadHistory.bind(modal);
  modal.toggleBatch = StandardsInternalIdSyncModalComponent.prototype.toggleBatch.bind(modal);
  modal.formatTimestamp = StandardsInternalIdSyncModalComponent.prototype.formatTimestamp.bind(modal);

  assert.equal(modal.activeView(), 'scan');
  assert.equal(modal.historyBatches().length, 0);

  // Switch to history view
  modal.setView('history');
  assert.equal(modal.activeView(), 'history');

  // Await async loadHistory completion
  await modal.loadHistory();
  assert.equal(loadHistoryCalls, 1);
  assert.equal(modal.isLoadingHistory(), false);
  assert.equal(modal.historyBatches().length, 2);
  assert.equal(modal.historyBatches()[0].id, 'batch-001');
  assert.equal(modal.historyBatches()[0].status, 'APPLIED');
  assert.equal(modal.historyBatches()[1].status, 'UNDONE');

  // Toggle expand/collapse
  assert.equal(modal.expandedBatchId(), null);
  modal.toggleBatch('batch-001');
  assert.equal(modal.expandedBatchId(), 'batch-001');
  modal.toggleBatch('batch-001');
  assert.equal(modal.expandedBatchId(), null);
  modal.toggleBatch('batch-002');
  assert.equal(modal.expandedBatchId(), 'batch-002');

  // Verify formatTimestamp handles numbers and date objects
  const formatted = modal.formatTimestamp(1771100000000);
  assert.match(formatted, /\d{2}\/\d{2}\/\d{4}/);
});

test('behavioral: modal component handles real-time progress and partial failure recovery', async () => {
  const { StandardsInternalIdSyncModalComponent } = require('./standards-internal-id-sync-modal.component');
  const { StandardSyncPartialFailureError } = require('../../../shared/utils/standard-internal-id');

  const modal = Object.create(StandardsInternalIdSyncModalComponent.prototype);
  modal.report = signal({
    generatedAt: Date.now(),
    standardsCount: 1,
    requestsCount: 0,
    usageCount: 0,
    registryCount: 0,
    issues: [],
    safeChanges: [
      { collection: 'reference_standards', documentId: 'std-1', field: 'internal_id', before: 'aa01', after: 'AA01', reason: 'norm' },
    ],
    conflicts: [],
  });
  modal.corrections = signal({});
  modal.selectedSafeChangeKeys = signal(null);
  modal.isBusy = () => false;
  modal.canApply = () => true;
  modal.isApplying = signal(false);
  modal.applyProgress = signal(null);
  modal.partialFailure = signal(null);
  modal.applySummary = () => ({
    estimatedBatches: 2,
    totalChanges: 2,
    totalDocuments: 1,
    actualWrites: 2,
    physicalStandardsCount: 1,
    manualCount: 0,
    registryCount: 0,
    requestsCount: 0,
    usageCount: 0,
    blockingIssuesCount: 0,
    byChangeType: { codeNormalization: 1, searchKeyUpdate: 0, manualCorrection: 0, registrySync: 0, snapshotUpdate: 0, referenceRepair: 0 },
  });
  modal.errorMessage = signal('');
  modal.confirmation = { confirm: async () => true };
  modal.toast = { show: () => {} };

  let scanCount = 0;
  modal.scan = async () => { scanCount += 1; };

  // Simulate apply with partial failure
  modal.stdService = {
    applyInternalIdSync: async (_report: any, _corr: any, _keys: any, onProgress: any) => {
      onProgress({ currentBatch: 1, totalBatches: 2, completedChanges: 1, totalChanges: 2, percent: 50, phase: 'BATCH_COMPLETED' });
      throw new StandardSyncPartialFailureError(
        'Đã áp dụng thành công 1/2 batch (1 thay đổi). Batch 2 bị gián đoạn: Lỗi mạng.',
        ['batch-001'],
        1,
        2,
        2,
        new Error('Network error'),
      );
    },
    scanInternalIdSync: async () => modal.report(),
  };

  modal.apply = StandardsInternalIdSyncModalComponent.prototype.apply.bind(modal);
  modal.retryRemainingAfterPartialFailure = StandardsInternalIdSyncModalComponent.prototype.retryRemainingAfterPartialFailure.bind(modal);

  await modal.apply();

  // Verify partial failure is captured in state
  assert.ok(modal.partialFailure());
  assert.equal(modal.partialFailure().completedBatchIds.length, 1);
  assert.equal(modal.partialFailure().failedBatchIndex, 2);
  assert.equal(modal.isApplying(), false);
  assert.match(modal.errorMessage(), /1\/2 batch/);

  // Test 1-click retry action
  await modal.retryRemainingAfterPartialFailure();
  assert.equal(modal.partialFailure(), null);
  assert.equal(modal.errorMessage(), '');
  assert.equal(scanCount, 1);
});
