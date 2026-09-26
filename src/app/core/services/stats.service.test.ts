import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const source = readFileSync(resolve(process.cwd(), 'src/app/core/services/stats.service.ts'), 'utf8');

test('incrementStats uses server transforms for the normal increment path', () => {
  assert.match(source, /if \(!isDecrement\) \{/);
  assert.match(source, /await setDoc\(docRef, \{/);
  assert.match(source, /totalSamples: increment\(sDelta\)/);
  assert.match(source, /totalBatches: increment\(bDelta\)/);
  assert.match(source, /totalQcs: increment\(qDelta\)/);
  assert.match(source, /\[sopKey\]: \{/);
  assert.match(source, /samples: increment\(sDelta\)/);
  assert.match(source, /batches: increment\(bDelta\)/);
  assert.match(source, /qcs: increment\(qDelta\)/);
  assert.match(source, /\}, \{ merge: true \}\);/);
});

test('incrementStats keeps the decrement clamp transaction and rethrows failures', () => {
  const incrementBranchEnd = source.indexOf('return;', source.indexOf('if (!isDecrement)'));
  const transactionStart = source.indexOf('await runTransaction', incrementBranchEnd);
  assert.ok(transactionStart > incrementBranchEnd, 'decrement transaction must be after the increment fast path');
  assert.match(source, /Math\.max\(0, data\[dayKey\]\.totalSamples \+ sDelta\)/);
  assert.match(source, /console\.error\('Failed to update stats: ', e\);\s*throw e;/);
});

test('incrementStats preserves SOP names containing dots as nested map keys', () => {
  assert.match(source, /sops: \{\s*\[sopKey\]: \{/);
  assert.doesNotMatch(source, /`\$\{dayKey\}\.sops\.\$\{sopKey\}/);
});

test('runBackfill clears stale day fields inside the selected range without replacing the whole month', () => {
  assert.match(source, /createInclusiveDateRange\(startDateStr, endDateStr\)/);
  assert.match(source, /for \(const date of enumerateInclusiveDates\(range\)\)/);
  assert.match(source, /patch\[dayKey\] = monthData\[dayKey\] \|\| deleteField\(\)/);
  assert.match(source, /batch\.set\(docRef, patch, \{ merge: true \}\)/);
  assert.doesNotMatch(source, /batch\.set\(docRef, monthData, \{ merge: true \}\)/);
});

test('report stats reads surface Firestore failures instead of silently publishing empty data', () => {
  const rangeLoaderStart = source.indexOf('async getStatsForMonths');
  const allTimeLoaderStart = source.indexOf('async getAllMonthlyStats');
  const backfillStart = source.indexOf('async runBackfill');
  const rangeLoader = source.slice(rangeLoaderStart, allTimeLoaderStart);
  const allTimeLoader = source.slice(allTimeLoaderStart, backfillStart);

  assert.match(rangeLoader, /catch \(e\) \{[\s\S]*throw e;/);
  assert.doesNotMatch(rangeLoader, /catch \(e\) \{[\s\S]*result\[key\] = \{\};/);
  assert.match(allTimeLoader, /catch \(e\) \{[\s\S]*throw e;/);
});

test('monthly aggregate reads are available to dashboard SOP viewers as well as report viewers', () => {
  const rangeLoaderStart = source.indexOf('async getStatsForMonths');
  const allTimeLoaderStart = source.indexOf('async getAllMonthlyStats');
  const rangeLoader = source.slice(rangeLoaderStart, allTimeLoaderStart);

  assert.match(rangeLoader, /!this\.auth\.canViewReports\(\) && !this\.auth\.canViewSop\(\)/);
});

test('backfill uses the canonical request count resolver instead of coupling sample fallback to n_qc', () => {
  assert.match(source, /resolveRequestStatsCounts\(\{/);
  assert.doesNotMatch(source, /if \(req\['inputs'\]\?\.\['n_qc'\]\)[\s\S]{0,120}else if \(req\['sampleList'\]/);
});

test('backfill and reconciliation share the approved/completed counted-status policy', () => {
  assert.match(source, /isRequestCountedInStats\(req\['status'\]\)/);
  assert.doesNotMatch(source, /\['approved', 'completed', 'draft'\]/);
  assert.match(source, /reconcilePendingStats/);
  assert.match(source, /rebuildStatsDays/);
  assert.match(source, /buildStatsProjectionForDays/);
});

test('stats projection failures create a durable reconciliation item', () => {
  assert.match(source, /incrementStatsWithReconciliation/);
  assert.match(source, /stats_reconciliation/);
  assert.match(source, /status: 'pending'/);
  assert.match(source, /createdAt: serverTimestamp\(\)/);
});
