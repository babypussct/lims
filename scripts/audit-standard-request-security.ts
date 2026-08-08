import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app';
import { DocumentData, getFirestore } from 'firebase-admin/firestore';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  buildAuditIssues,
  emptyUsageSummary,
  finiteAuditNumber,
  summarizeUsageJournal,
  UsageSummary
} from './standard-request-security-audit.utils';

const ACTIVE_STATUSES = ['IN_PROGRESS', 'PENDING_RETURN', 'PENDING_DEPLETION'] as const;
const appId = readArgument('--app-id=') || process.env['LIMS_APP_ID'] || 'lims-cloud-fixed';
const outputPath = readArgument('--output=');

interface UsageJournal {
  id: string;
  data: DocumentData;
}

interface AuditRow {
  requestId: string;
  status: string;
  standardId: string;
  requestedBy: string;
  requestTotalAmountUsed: number | null;
  journalNormalizedTotal: number;
  journalCount: number;
  journalMissingNormalizedAmount: number;
  journalStandardIdMismatch: number;
  journalMissingUserId: number;
  journalUserIdMismatch: number;
  journalCounterpartMissing: number;
  journalCounterpartMismatch: number;
  lastUsageLogId: string | null;
  lastUsageLogExists: boolean | null;
  standardExists: boolean;
  currentHolderUid: string | null;
  currentRequestId: string | null;
  currentAmount: number | null;
  holderMatchesRequester: boolean;
  currentRequestMatches: boolean;
  aggregateMatchesJournal: boolean;
  journalsStructurallyTrusted: boolean;
  missingFields: string[];
  issues: string[];
}

function readArgument(prefix: string): string | undefined {
  return process.argv.find(argument => argument.startsWith(prefix))?.slice(prefix.length).trim() || undefined;
}

function initializeAdmin(): void {
  if (getApps().length > 0) return;
  const serviceAccountJson = process.env['FIREBASE_SERVICE_ACCOUNT'];
  if (serviceAccountJson) {
    const serviceAccount = JSON.parse(serviceAccountJson);
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }
    initializeApp({ credential: cert(serviceAccount) });
    return;
  }
  initializeApp({ credential: applicationDefault() });
}

function chunks<T>(items: readonly T[], size: number): T[][] {
  const result: T[][] = [];
  for (let offset = 0; offset < items.length; offset += size) {
    result.push(items.slice(offset, offset + size) as T[]);
  }
  return result;
}

function usageJournalKey(requestId: string, journalId: string): string {
  return `${requestId}\u0000${journalId}`;
}

async function loadUsageJournals(requestIds: string[]): Promise<Map<string, UsageJournal[]>> {
  const db = getFirestore();
  const journals = new Map<string, UsageJournal[]>();
  for (const requestIdChunk of chunks(requestIds, 30)) {
    const snapshot = await db
      .collection(`artifacts/${appId}/standard_usages`)
      .where('requestId', 'in', requestIdChunk)
      .get();
    snapshot.docs.forEach(document => {
      const data = document.data();
      const requestId = typeof data['requestId'] === 'string' ? data['requestId'] : '';
      if (!requestId) return;
      const current = journals.get(requestId) || [];
      current.push({ id: document.id, data });
      journals.set(requestId, current);
    });
  }
  return journals;
}

async function loadUsageCounterparts(
  requests: Array<{ id: string; data: () => DocumentData }>,
  journals: Map<string, UsageJournal[]>
): Promise<Map<string, DocumentData>> {
  const db = getFirestore();
  const targets = requests.flatMap(document => {
    const request = document.data();
    const standardId = typeof request['standardId'] === 'string' ? request['standardId'] : '';
    if (!standardId) return [];
    return (journals.get(document.id) || []).map(journal => ({
      key: usageJournalKey(document.id, journal.id),
      ref: db.doc(`artifacts/${appId}/reference_standards/${standardId}/logs/${journal.id}`)
    }));
  });
  const counterparts = new Map<string, DocumentData>();

  for (const targetChunk of chunks(targets, 100)) {
    const snapshots = await db.getAll(...targetChunk.map(target => target.ref));
    snapshots.forEach((snapshot, index) => {
      if (snapshot.exists) counterparts.set(targetChunk[index].key, snapshot.data()!);
    });
  }
  return counterparts;
}

function summarizeRequestUsage(
  requestId: string,
  request: DocumentData,
  journals: UsageJournal[],
  counterparts: Map<string, DocumentData>
): UsageSummary {
  const standardId = typeof request['standardId'] === 'string' ? request['standardId'] : '';
  const requestedBy = typeof request['requestedBy'] === 'string' ? request['requestedBy'] : '';
  return journals.reduce((summary, journal) => summarizeUsageJournal(
    summary,
    journal.id,
    journal.data,
    counterparts.get(usageJournalKey(requestId, journal.id)),
    requestId,
    standardId,
    requestedBy
  ), emptyUsageSummary());
}

async function main(): Promise<void> {
  initializeAdmin();
  const db = getFirestore();
  db.settings({ ignoreUndefinedProperties: true });

  const requestSnapshot = await db
    .collection(`artifacts/${appId}/standard_requests`)
    .where('status', 'in', [...ACTIVE_STATUSES])
    .get();
  const requestIds = requestSnapshot.docs.map(document => document.id);
  const standardIds = Array.from(new Set(
    requestSnapshot.docs
      .map(document => document.data()['standardId'])
      .filter((value): value is string => typeof value === 'string' && value.length > 0)
  ));

  const [usageJournals, standardSnapshots] = await Promise.all([
    loadUsageJournals(requestIds),
    Promise.all(standardIds.map(standardId => db.doc(`artifacts/${appId}/reference_standards/${standardId}`).get()))
  ]);
  const standards = new Map(
    standardSnapshots.filter(snapshot => snapshot.exists).map(snapshot => [snapshot.id, snapshot.data()!])
  );
  const usageCounterparts = await loadUsageCounterparts(requestSnapshot.docs, usageJournals);

  const rows: AuditRow[] = requestSnapshot.docs.map(document => {
    const request = document.data();
    const standardId = typeof request['standardId'] === 'string' ? request['standardId'] : '';
    const standard = standards.get(standardId);
    const usage = summarizeRequestUsage(
      document.id,
      request,
      usageJournals.get(document.id) || [],
      usageCounterparts
    );
    const missingFields = ['standardName', 'requestedByName', 'purpose'].filter(field => {
      const value = request[field];
      return typeof value !== 'string' || value.trim().length === 0;
    });
    const rawLastUsageLogId = request['lastUsageLogId'];
    const lastUsageLogId = typeof rawLastUsageLogId === 'string' && rawLastUsageLogId.trim().length > 0
      ? rawLastUsageLogId
      : null;
    const lastUsageLogExists = lastUsageLogId === null
      ? null
      : usage.journalIds.includes(lastUsageLogId) && usageCounterparts.has(usageJournalKey(document.id, lastUsageLogId));
    const checks = buildAuditIssues(document.id, request, standard, usage, missingFields, lastUsageLogExists);
    return {
      requestId: document.id,
      status: String(request['status'] || ''),
      standardId,
      requestedBy: String(request['requestedBy'] || ''),
      requestTotalAmountUsed: finiteAuditNumber(request['totalAmountUsed']),
      journalNormalizedTotal: usage.normalizedTotal,
      journalCount: usage.count,
      journalMissingNormalizedAmount: usage.missingNormalizedAmount,
      journalStandardIdMismatch: usage.standardIdMismatch,
      journalMissingUserId: usage.missingUserId,
      journalUserIdMismatch: usage.userIdMismatch,
      journalCounterpartMissing: usage.counterpartMissing,
      journalCounterpartMismatch: usage.counterpartMismatch,
      lastUsageLogId,
      lastUsageLogExists,
      standardExists: Boolean(standard),
      currentHolderUid: standard && typeof standard['current_holder_uid'] === 'string' ? standard['current_holder_uid'] : null,
      currentRequestId: standard && typeof standard['current_request_id'] === 'string' ? standard['current_request_id'] : null,
      currentAmount: standard ? finiteAuditNumber(standard['current_amount']) : null,
      ...checks,
      missingFields
    };
  }).sort((a, b) => a.status.localeCompare(b.status) || a.requestId.localeCompare(b.requestId));

  const issueCounts = Object.fromEntries(
    Array.from(rows.reduce((counts, row) => {
      row.issues.forEach(issue => counts.set(issue, (counts.get(issue) || 0) + 1));
      return counts;
    }, new Map<string, number>()).entries()).sort(([a], [b]) => a.localeCompare(b))
  );

  const report = {
    generatedAt: new Date().toISOString(),
    appId,
    activeStatuses: ACTIVE_STATUSES,
    activeRequestCount: rows.length,
    issueRequestCount: rows.filter(row => row.issues.length > 0).length,
    issueCounts,
    rows
  };

  console.log(`[Standard security audit] ${rows.length} active requests; ${report.issueRequestCount} require review.`);
  if (outputPath) {
    const absoluteOutputPath = resolve(outputPath);
    writeFileSync(absoluteOutputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(`[Standard security audit] Wrote read-only report to ${absoluteOutputPath}.`);
  } else {
    console.log(JSON.stringify(report, null, 2));
  }
}

main().catch(error => {
  console.error(`[Standard security audit] ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
