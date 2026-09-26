import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const source = readFileSync(resolve(process.cwd(), 'src/app/features/traceability/traceability.component.ts'), 'utf8');

test('anonymous request-id traceability resolves through exact-get public projection before private collections', () => {
  const anonymousGuard = source.indexOf('if (!this.auth.currentUser())');
  const projectionLookup = source.indexOf('/public_traceability/${id}');
  const printLookup = source.indexOf('/print_jobs/${id}');
  const requestLookup = source.indexOf('/requests/${id}');
  assert.ok(projectionLookup > 0);
  assert.ok(anonymousGuard > projectionLookup);
  assert.ok(anonymousGuard > 0);
  assert.ok(printLookup > anonymousGuard);
  assert.ok(requestLookup > printLookup);
});

test('anonymous hydration never reads private request or print-job payloads', () => {
  assert.match(source, /const canHydratePrivateData = !!this\.auth\.currentUser\(\)/);
  assert.match(source, /canHydratePrivateData && log\.requestId && !log\.status/);
  assert.match(source, /canHydratePrivateData && log\.printJobId && !log\.printData/);
});

test('permission denied is treated as non-public/not-found instead of a network failure', () => {
  assert.match(source, /getTraceabilityDoc/);
  assert.match(source, /permission-denied[\s\S]*return null/);
  assert.match(source, /Không tìm thấy dữ liệu công khai/);
});
