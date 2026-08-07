import assert from 'node:assert/strict';
import test from 'node:test';
import {
  filterDashboardActivityLogs,
  getDashboardActivityDataScope,
  isStandardActivityAction,
  matchesDashboardActivityCategory
} from './dashboard-activity';
import {
  timestampToDate,
  timestampToLocalDateKey,
  timestampToMillis
} from './timestamp';

test('classifies backfill and usage rollback as standard activity', () => {
  assert.equal(isStandardActivityAction('BACKFILL_USAGE_LOG'), true);
  assert.equal(isStandardActivityAction('DELETE_USAGE_LOG'), true);
  assert.equal(matchesDashboardActivityCategory('BACKFILL_USAGE_LOG', 'SYSTEM'), false);
});

test('users without report permission are restricted to the personal activity scope', () => {
  assert.equal(getDashboardActivityDataScope(false), 'personal');
  assert.equal(getDashboardActivityDataScope(true), 'global');
});

test('filters before applying the dashboard display limit', () => {
  const sopLogs = Array.from({ length: 60 }, (_, index) => ({
    action: 'PUBLISH_RESULT_REPORT',
    user: 'SOP user',
    details: `SOP ${index}`
  }));
  const standardLog = {
    action: 'BACKFILL_USAGE_LOG',
    user: 'Manager',
    details: 'Nhập bù Propoxur'
  };

  const result = filterDashboardActivityLogs(
    [...sopLogs, standardLog],
    '',
    'STANDARD',
    action => action,
    50
  );

  assert.deepEqual(result, [standardLog]);
});

test('parses Firestore and DeltaSync cached timestamp shapes without Invalid Date', () => {
  assert.equal(timestampToMillis({ seconds: 10, nanoseconds: 250_000_000 }), 10250);
  assert.equal(timestampToMillis({ _seconds: 10, _nanoseconds: 250_000_000 }), 10250);
  assert.equal(timestampToMillis({ milliseconds: 1234 }), 1234);
  assert.equal(timestampToMillis({ toMillis: () => 5678 }), 5678);
  assert.equal(timestampToMillis({ toDate: () => new Date(9012) }), 9012);
  assert.equal(timestampToMillis({ seconds: 'bad' }), null);
  assert.equal(timestampToDate({ invalid: true }), null);
});

test('creates a local date key and safely rejects malformed dashboard timestamps', () => {
  const localDate = new Date(2026, 6, 29, 23, 59, 59);
  assert.equal(timestampToLocalDateKey(localDate), '2026-07-29');
  assert.equal(timestampToLocalDateKey('not-a-date'), null);
  assert.doesNotThrow(() => timestampToLocalDateKey({ milliseconds: Number.NaN }));
});
