import assert from 'node:assert/strict';
import test from 'node:test';
import '@angular/compiler';
import { ActivityEventService, normalizeInternalActivityActionUrl } from './activity-event.service';
import { sanitizeActivityDetails, sanitizeActivityMetadata } from '../activity/activity-event.sanitize';

test('activity details are normalized, bounded, and required', () => {
  assert.equal(sanitizeActivityDetails('  A   B\nC  '), 'A B C');
  assert.equal(sanitizeActivityDetails('x'.repeat(2_500)).length, 2_000);
  assert.throws(() => sanitizeActivityDetails('   '), /required/);
});

test('metadata removes credential-like keys and unsafe values recursively', () => {
  const metadata = sanitizeActivityMetadata({
    version: 2,
    authToken: 'secret-token',
    nested: {
      password: 'secret-password',
      reason: 'safe',
      nan: Number.NaN
    },
    list: ['ok', undefined, 3],
    fn: () => 'nope'
  });

  assert.deepEqual(metadata, {
    version: 2,
    nested: { reason: 'safe' },
    list: ['ok', 3]
  });
});

test('metadata is bounded by key count and string length', () => {
  const source: Record<string, unknown> = {};
  for (let i = 0; i < 60; i++) source[`key${i}`] = 'x'.repeat(1_500);
  const metadata = sanitizeActivityMetadata(source)!;
  assert.equal(Object.keys(metadata).length, 40);
  assert.equal(String(metadata['key0']).length, 1_000);
});

test('activity builder keeps links internal and rejects invalid public traceability', () => {
  assert.equal(normalizeInternalActivityActionUrl(' /requests/REQ-1 '), '/requests/REQ-1');
  assert.equal(normalizeInternalActivityActionUrl('https://example.com/phish'), undefined);
  assert.equal(normalizeInternalActivityActionUrl('//example.com/phish'), undefined);

  const service = Object.create(ActivityEventService.prototype) as any;
  service.auth = { currentUser: () => ({ uid: 'actor-1', displayName: 'Actor' }) };

  const event = service.build({
    eventId: 'evt-public-1',
    action: 'APPROVE_REQUEST',
    details: 'Duyệt yêu cầu',
    targetType: 'REQUEST',
    requestId: 'REQ-1',
    actionUrl: 'https://example.com/phish',
    publicTraceable: true
  });
  assert.equal(event.actionUrl, '/requests');
  assert.equal(event.publicTraceable, true);

  assert.throws(() => service.build({
    eventId: 'evt-public-2',
    action: 'SAVE_RESULT_DRAFT',
    details: 'Lưu nháp',
    targetType: 'REQUEST',
    requestId: 'REQ-1',
    publicTraceable: true
  }), /Public traceability requires/);

  assert.throws(() => service.build({
    eventId: 'evt-public-3',
    action: 'APPROVE_REQUEST',
    details: 'Duyệt yêu cầu',
    targetType: 'STANDARD',
    requestId: 'REQ-1',
    publicTraceable: true
  }), /Public traceability requires/);
});
