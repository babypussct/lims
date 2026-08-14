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
