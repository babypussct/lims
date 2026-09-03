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
