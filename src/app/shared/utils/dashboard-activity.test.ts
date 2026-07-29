import assert from 'node:assert/strict';
import test from 'node:test';
import {
  filterDashboardActivityLogs,
  isStandardActivityAction,
  matchesDashboardActivityCategory
} from './dashboard-activity';

test('classifies backfill and usage rollback as standard activity', () => {
  assert.equal(isStandardActivityAction('BACKFILL_USAGE_LOG'), true);
  assert.equal(isStandardActivityAction('DELETE_USAGE_LOG'), true);
  assert.equal(matchesDashboardActivityCategory('BACKFILL_USAGE_LOG', 'SYSTEM'), false);
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
