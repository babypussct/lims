import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app';
import { FieldPath, getFirestore, type DocumentData, type QueryDocumentSnapshot } from 'firebase-admin/firestore';
import {
  buildActorIndex,
  classifyLegacyActivity,
  type ActivityBackfillResult,
  type LegacyUserProfile
} from './activity-backfill-utils';

type Mode = 'dry-run' | 'apply' | 'verify';

interface MigrationReport {
  appId: string;
  mode: Mode;
  startedAt: string;
  completedAt?: string;
  startAfter?: string;
  lastDocumentId?: string;
  limit?: number;
  total: number;
  alreadyV2: number;
  migratable: number;
  migrated: number;
  unresolvedActor: number;
  invalidV2: number;
  unknownAction: number;
  missingTarget: number;
  publicTraceableCandidates: number;
  errors: number;
  unresolved: Array<{ id: string; action?: string; user?: string; reason: string }>;
}

const argv = process.argv.slice(2);
const mode = resolveMode(argv);
const appId = readArgument('--app-id=') || process.env['LIMS_APP_ID'] || 'lims-cloud-fixed';
const maxDocuments = parsePositiveInteger(readArgument('--limit='));
const startAfterId = readArgument('--start-after=');
const outputPath = readArgument('--output=');
const pageSize = Math.min(300, maxDocuments || 300);

function resolveMode(args: readonly string[]): Mode {
  const modes: Array<[string, Mode]> = [
    ['--dry-run', 'dry-run'],
    ['--apply', 'apply'],
    ['--verify', 'verify']
  ];
  const selected = modes.filter(([flag]) => args.includes(flag));
  if (selected.length !== 1) {
    throw new Error('Chọn đúng một mode: --dry-run, --apply hoặc --verify.');
  }
  return selected[0][1];
}

function readArgument(prefix: string): string | undefined {
  return argv.find(argument => argument.startsWith(prefix))?.slice(prefix.length).trim() || undefined;
}

function parsePositiveInteger(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed <= 0) throw new Error(`Giá trị số không hợp lệ: ${value}`);
  return parsed;
}

function initializeAdmin(): void {
  if (getApps().length > 0) return;
  const serviceAccountJson = process.env['FIREBASE_SERVICE_ACCOUNT'];
  if (serviceAccountJson) {
    const serviceAccount = JSON.parse(serviceAccountJson);
    if (serviceAccount.private_key) serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    initializeApp({ credential: cert(serviceAccount) });
    return;
  }
  initializeApp({ credential: applicationDefault() });
}

async function loadActorIndex(): Promise<ReturnType<typeof buildActorIndex>> {
  const snapshot = await getFirestore().collection(`artifacts/${appId}/users`).get();
  const users: LegacyUserProfile[] = snapshot.docs.map(document => ({
    uid: document.id,
    displayName: asString(document.data()['displayName']),
    email: asString(document.data()['email'])
  }));
  return buildActorIndex(users);
}

async function processPage(
  documents: readonly QueryDocumentSnapshot<DocumentData>[],
  actorIndex: ReturnType<typeof buildActorIndex>,
  report: MigrationReport
): Promise<void> {
  const db = getFirestore();
  const batch = mode === 'apply' ? db.batch() : null;
  let writes = 0;

  for (const document of documents) {
    report.total += 1;
    report.lastDocumentId = document.id;
    try {
      const data = document.data() as Record<string, unknown>;
      const result = classifyLegacyActivity(document.id, data, actorIndex);
      accumulateReport(report, document.id, data, result);

      if (mode === 'apply' && result.status === 'MIGRATABLE' && result.patch) {
        batch!.set(document.ref, result.patch, { merge: true });
        writes += 1;
      }
    } catch (error) {
      report.errors += 1;
      report.unresolved.push({
        id: document.id,
        action: asString(document.data()['action']),
        user: asString(document.data()['user']),
        reason: error instanceof Error ? error.message : String(error)
      });
    }
  }

  if (batch && writes > 0) {
    await batch.commit();
    report.migrated += writes;
  }
}

function accumulateReport(
  report: MigrationReport,
  id: string,
  data: Record<string, unknown>,
  result: ActivityBackfillResult
): void {
  if (result.status === 'ALREADY_V2') report.alreadyV2 += 1;
  if (result.status === 'MIGRATABLE') {
    report.migratable += 1;
    if (result.missingTarget) report.missingTarget += 1;
    if (result.publicTraceableCandidate) report.publicTraceableCandidates += 1;
  }
  if (result.status === 'UNKNOWN_ACTION') {
    report.unknownAction += 1;
    report.unresolved.push({ id, action: result.action, user: asString(data['user']), reason: 'UNKNOWN_ACTION' });
  }
  if (result.status === 'INVALID_V2') {
    report.invalidV2 += 1;
    report.unresolved.push({
      id,
      action: result.action,
      user: asString(data['user']),
      reason: `INVALID_V2:${result.reason || 'unknown'}`
    });
  }
  if (result.status === 'UNRESOLVED_ACTOR') {
    report.unresolvedActor += 1;
    report.unresolved.push({
      id,
      action: result.action,
      user: asString(data['user']),
      reason: `UNRESOLVED_ACTOR:${result.actor?.status === 'UNRESOLVED' ? result.actor.reason : 'unknown'}`
    });
  }
}

async function run(): Promise<void> {
  initializeAdmin();
  const db = getFirestore();
  db.settings({ ignoreUndefinedProperties: true });
  const actorIndex = await loadActorIndex();
  const report: MigrationReport = {
    appId,
    mode,
    startedAt: new Date().toISOString(),
    startAfter: startAfterId,
    limit: maxDocuments,
    total: 0,
    alreadyV2: 0,
    migratable: 0,
    migrated: 0,
    unresolvedActor: 0,
    invalidV2: 0,
    unknownAction: 0,
    missingTarget: 0,
    publicTraceableCandidates: 0,
    errors: 0,
    unresolved: []
  };

  let cursor = startAfterId;
  while (!maxDocuments || report.total < maxDocuments) {
    const remaining = maxDocuments ? maxDocuments - report.total : pageSize;
    let query = db.collection(`artifacts/${appId}/logs`)
      .orderBy(FieldPath.documentId())
      .limit(Math.min(pageSize, remaining));
    if (cursor) query = query.startAfter(cursor);
    const snapshot = await query.get();
    if (snapshot.empty) break;
    await processPage(snapshot.docs, actorIndex, report);
    cursor = snapshot.docs[snapshot.docs.length - 1].id;
    console.log(`[Activity backfill] ${mode}: processed=${report.total}, cursor=${cursor}`);
    if (snapshot.size < Math.min(pageSize, remaining)) break;
  }

  report.completedAt = new Date().toISOString();
  const json = JSON.stringify(report, null, 2);
  console.log(json);
  if (outputPath) writeReport(outputPath, report);

  if (mode === 'verify' && (report.unknownAction > 0 || report.unresolvedActor > 0
    || report.invalidV2 > 0 || report.errors > 0)) {
    process.exitCode = 2;
  }
}

function writeReport(path: string, report: MigrationReport): void {
  const absolute = resolve(path);
  mkdirSync(dirname(absolute), { recursive: true });
  writeFileSync(absolute, JSON.stringify(report, null, 2) + '\n', 'utf8');
  const markdownPath = absolute.endsWith('.json') ? absolute.slice(0, -5) + '.md' : `${absolute}.md`;
  writeFileSync(markdownPath, renderMarkdown(report), 'utf8');
  console.log(`[Activity backfill] Reports: ${absolute} ; ${markdownPath}`);
}

function renderMarkdown(report: MigrationReport): string {
  return [
    '# Activity Event Backfill Report',
    '',
    `- App: \`${report.appId}\``,
    `- Mode: \`${report.mode}\``,
    `- Started: ${report.startedAt}`,
    `- Completed: ${report.completedAt || ''}`,
    `- Last document: ${report.lastDocumentId ? `\`${report.lastDocumentId}\`` : 'n/a'}`,
    '',
    '| Metric | Count |',
    '|---|---:|',
    `| total | ${report.total} |`,
    `| alreadyV2 | ${report.alreadyV2} |`,
    `| migratable | ${report.migratable} |`,
    `| migrated | ${report.migrated} |`,
    `| unresolvedActor | ${report.unresolvedActor} |`,
    `| invalidV2 | ${report.invalidV2} |`,
    `| unknownAction | ${report.unknownAction} |`,
    `| missingTarget | ${report.missingTarget} |`,
    `| publicTraceableCandidates | ${report.publicTraceableCandidates} |`,
    `| errors | ${report.errors} |`,
    '',
    '## Unresolved',
    '',
    ...(report.unresolved.length
      ? report.unresolved.map(item => `- \`${item.id}\` — ${item.reason} — action=${item.action || 'n/a'} — user=${item.user || 'n/a'}`)
      : ['- None']),
    ''
  ].join('\n');
}

function asString(value: unknown): string | undefined {
  if (value === null || value === undefined) return undefined;
  const normalized = String(value).trim();
  return normalized || undefined;
}

run().catch(error => {
  console.error(`[Activity backfill] ${error instanceof Error ? error.stack || error.message : String(error)}`);
  process.exitCode = 1;
});
