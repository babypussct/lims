import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildAuditIssues,
  emptyUsageSummary,
  summarizeUsageJournal
} from './standard-request-security-audit.utils';

const request = {
  standardId: 'std-1',
  requestedBy: 'user-1',
  totalAmountUsed: 10
};

const standard = {
  current_holder_uid: 'user-1',
  current_request_id: 'req-1',
  current_amount: 90
};

function journal(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    id: 'log-1',
    requestId: 'req-1',
    standardId: 'std-1',
    userId: 'user-1',
    normalized_amount: 10,
    ...overrides
  };
}

test('audit accepts a structurally correlated journal pair whose aggregate matches', () => {
  const global = journal();
  const usage = summarizeUsageJournal(
    emptyUsageSummary(),
    'log-1',
    global,
    journal(),
    'req-1',
    'std-1',
    'user-1'
  );
  const checks = buildAuditIssues('req-1', request, standard, usage, [], true);

  assert.equal(checks.aggregateMatchesJournal, true);
  assert.equal(checks.journalsStructurallyTrusted, true);
  assert.deepEqual(checks.issues, []);
});

test('audit rejects a numerically matching journal when ownership metadata is forged', () => {
  const global = journal({ standardId: 'std-other', userId: 'attacker' });
  const usage = summarizeUsageJournal(
    emptyUsageSummary(),
    'log-1',
    global,
    journal(),
    'req-1',
    'std-1',
    'user-1'
  );
  const checks = buildAuditIssues('req-1', request, standard, usage, [], true);

  assert.equal(checks.aggregateMatchesJournal, true);
  assert.equal(checks.journalsStructurallyTrusted, false);
  assert.ok(checks.issues.includes('JOURNAL_STANDARD_MISMATCH'));
  assert.ok(checks.issues.includes('JOURNAL_USER_MISMATCH'));
  assert.ok(!checks.issues.includes('AGGREGATE_JOURNAL_MISMATCH'));
});

test('audit reports a missing or mismatched standard journal counterpart', () => {
  const missingUsage = summarizeUsageJournal(
    emptyUsageSummary(),
    'log-1',
    journal(),
    undefined,
    'req-1',
    'std-1',
    'user-1'
  );
  const missingChecks = buildAuditIssues('req-1', request, standard, missingUsage, [], true);
  assert.ok(missingChecks.issues.includes('JOURNAL_COUNTERPART_MISSING'));

  const mismatchedUsage = summarizeUsageJournal(
    emptyUsageSummary(),
    'log-1',
    journal(),
    journal({ normalized_amount: 9 }),
    'req-1',
    'std-1',
    'user-1'
  );
  const mismatchedChecks = buildAuditIssues('req-1', request, standard, mismatchedUsage, [], true);
  assert.ok(mismatchedChecks.issues.includes('JOURNAL_COUNTERPART_MISMATCH'));
});

test('audit flags invalid current stock, missing schema metadata and stale lastUsageLogId', () => {
  const usage = summarizeUsageJournal(
    emptyUsageSummary(),
    'log-1',
    journal(),
    journal(),
    'req-1',
    'std-1',
    'user-1'
  );
  const checks = buildAuditIssues(
    'req-1',
    request,
    { ...standard, current_amount: -1 },
    usage,
    ['purpose'],
    false
  );

  assert.ok(checks.issues.includes('INVALID_CURRENT_AMOUNT'));
  assert.ok(checks.issues.includes('LAST_USAGE_LOG_MISSING'));
  assert.ok(checks.issues.includes('MISSING_SCHEMA_FIELDS'));
});
