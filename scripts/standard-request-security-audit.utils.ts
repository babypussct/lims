export interface AuditData {
  [key: string]: unknown;
}

export interface UsageSummary {
  count: number;
  normalizedTotal: number;
  missingNormalizedAmount: number;
  standardIdMismatch: number;
  missingUserId: number;
  userIdMismatch: number;
  counterpartMissing: number;
  counterpartMismatch: number;
  journalIds: string[];
}

export interface AuditIssueChecks {
  holderMatchesRequester: boolean;
  currentRequestMatches: boolean;
  aggregateMatchesJournal: boolean;
  journalsStructurallyTrusted: boolean;
  issues: string[];
}

export const STANDARD_REQUEST_AUDIT_EPSILON = 1e-9;

export function finiteAuditNumber(value: unknown): number | null {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

export function emptyUsageSummary(): UsageSummary {
  return {
    count: 0,
    normalizedTotal: 0,
    missingNormalizedAmount: 0,
    standardIdMismatch: 0,
    missingUserId: 0,
    userIdMismatch: 0,
    counterpartMissing: 0,
    counterpartMismatch: 0,
    journalIds: []
  };
}

function stringField(data: AuditData | undefined, field: string): string {
  const value = data?.[field];
  return typeof value === 'string' ? value : '';
}

function journalCounterpartMatches(
  journalId: string,
  globalData: AuditData,
  counterpartData: AuditData,
  expectedRequestId: string,
  expectedStandardId: string,
  expectedUserId: string
): boolean {
  const globalNormalized = finiteAuditNumber(globalData['normalized_amount']);
  const counterpartNormalized = finiteAuditNumber(counterpartData['normalized_amount']);
  return stringField(globalData, 'requestId') === expectedRequestId &&
    stringField(globalData, 'standardId') === expectedStandardId &&
    stringField(counterpartData, 'id') === journalId &&
    stringField(counterpartData, 'requestId') === expectedRequestId &&
    stringField(counterpartData, 'standardId') === expectedStandardId &&
    stringField(counterpartData, 'userId') === stringField(globalData, 'userId') &&
    globalNormalized !== null && counterpartNormalized !== null &&
    Math.abs(globalNormalized - counterpartNormalized) <= STANDARD_REQUEST_AUDIT_EPSILON;
}

export function summarizeUsageJournal(
  current: UsageSummary,
  journalId: string,
  globalData: AuditData,
  counterpartData: AuditData | undefined,
  expectedRequestId: string,
  expectedStandardId: string,
  expectedUserId: string
): UsageSummary {
  const normalized = finiteAuditNumber(globalData['normalized_amount']);
  const normalizedIsValid = normalized !== null && normalized >= 0;
  const journalStandardId = stringField(globalData, 'standardId');
  const journalUserId = stringField(globalData, 'userId');

  return {
    count: current.count + 1,
    normalizedTotal: current.normalizedTotal + (normalizedIsValid ? normalized : 0),
    missingNormalizedAmount: current.missingNormalizedAmount + (normalizedIsValid ? 0 : 1),
    standardIdMismatch: current.standardIdMismatch + (journalStandardId === expectedStandardId ? 0 : 1),
    missingUserId: current.missingUserId + (journalUserId ? 0 : 1),
    userIdMismatch: current.userIdMismatch + (journalUserId && journalUserId !== expectedUserId ? 1 : 0),
    counterpartMissing: current.counterpartMissing + (counterpartData ? 0 : 1),
    counterpartMismatch: current.counterpartMismatch + (
      counterpartData && !journalCounterpartMatches(
        journalId,
        globalData,
        counterpartData,
        expectedRequestId,
        expectedStandardId,
        expectedUserId
      ) ? 1 : 0
    ),
    journalIds: [...current.journalIds, journalId]
  };
}

export function buildAuditIssues(
  requestId: string,
  request: AuditData,
  standard: AuditData | undefined,
  usage: UsageSummary,
  missingFields: string[],
  lastUsageLogExists: boolean | null
): AuditIssueChecks {
  const issues: string[] = [];
  const standardId = stringField(request, 'standardId');
  const requestedBy = stringField(request, 'requestedBy');
  const totalAmountUsed = finiteAuditNumber(request['totalAmountUsed']);
  const currentAmount = standard ? finiteAuditNumber(standard['current_amount']) : null;
  const holderMatchesRequester = Boolean(standard) && stringField(standard, 'current_holder_uid') === requestedBy;
  const currentRequestMatches = Boolean(standard) && stringField(standard, 'current_request_id') === requestId;
  const journalsStructurallyTrusted = usage.missingNormalizedAmount === 0 &&
    usage.standardIdMismatch === 0 &&
    usage.missingUserId === 0 &&
    usage.userIdMismatch === 0 &&
    usage.counterpartMissing === 0 &&
    usage.counterpartMismatch === 0;
  const aggregateMatchesJournal = totalAmountUsed !== null && totalAmountUsed >= 0 &&
    usage.missingNormalizedAmount === 0 &&
    Math.abs(totalAmountUsed - usage.normalizedTotal) <= STANDARD_REQUEST_AUDIT_EPSILON;

  if (!standardId) issues.push('INVALID_STANDARD_ID');
  if (!requestedBy) issues.push('INVALID_REQUESTED_BY');
  if (!standard) issues.push('STANDARD_MISSING');
  if (standard && !holderMatchesRequester) issues.push('HOLDER_MISMATCH');
  if (standard && !currentRequestMatches) issues.push('CURRENT_REQUEST_MISMATCH');
  if (standard && (currentAmount === null || currentAmount < 0)) issues.push('INVALID_CURRENT_AMOUNT');
  if (totalAmountUsed === null || totalAmountUsed < 0) issues.push('INVALID_REQUEST_TOTAL');
  if (usage.missingNormalizedAmount > 0) issues.push('JOURNAL_MISSING_NORMALIZED_AMOUNT');
  if (usage.standardIdMismatch > 0) issues.push('JOURNAL_STANDARD_MISMATCH');
  if (usage.missingUserId > 0) issues.push('JOURNAL_USER_ID_MISSING');
  if (usage.userIdMismatch > 0) issues.push('JOURNAL_USER_MISMATCH');
  if (usage.counterpartMissing > 0) issues.push('JOURNAL_COUNTERPART_MISSING');
  if (usage.counterpartMismatch > 0) issues.push('JOURNAL_COUNTERPART_MISMATCH');
  if (lastUsageLogExists === false) issues.push('LAST_USAGE_LOG_MISSING');
  if (!aggregateMatchesJournal) issues.push('AGGREGATE_JOURNAL_MISMATCH');
  if (missingFields.length > 0) issues.push('MISSING_SCHEMA_FIELDS');

  return {
    holderMatchesRequester,
    currentRequestMatches,
    aggregateMatchesJournal,
    journalsStructurallyTrusted,
    issues
  };
}
