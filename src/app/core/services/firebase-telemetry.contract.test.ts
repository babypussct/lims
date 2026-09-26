import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const source = readFileSync(resolve(process.cwd(), 'src/app/core/services/firebase.service.ts'), 'utf8');

test('health and count telemetry use the real monthly_stats projection', () => {
  const healthStart = source.indexOf('checkSystemHealth()');
  const estimateStart = source.indexOf('getFirestoreDataEstimate()');
  assert.ok(healthStart > 0 && estimateStart > healthStart);
  assert.match(source.slice(healthStart, estimateStart), /'monthly_stats'/);
  assert.doesNotMatch(source.slice(healthStart, estimateStart), /'stats'/);
  assert.match(source.slice(estimateStart), /'monthly_stats'/);
});

test('failed count telemetry is explicitly unknown instead of reporting a false zero', () => {
  const estimateStart = source.indexOf('getFirestoreDataEstimate()');
  const estimateSource = source.slice(estimateStart);
  assert.match(estimateSource, /count:\s*null/);
  assert.match(estimateSource, /sizeKB:\s*null/);
  assert.match(estimateSource, /error:/);
  assert.doesNotMatch(estimateSource, /catch\s*\([^)]*\)\s*\{[\s\S]{0,160}count:\s*0/);
});
