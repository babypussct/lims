import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { Request } from '../src/app/core/models/request.model';
import { DailyChecklistEntry } from '../src/app/core/models/daily-checklist.model';
import {
  DAILY_CHECKLIST_SCHEMA_VERSION,
  buildDailyChecklistEntry
} from '../src/app/core/utils/daily-checklist-projection';

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const verifyOnly = args.has('--verify-only');
const appId = readArgument('--app-id=') || process.env['LIMS_APP_ID'] || 'lims-cloud-fixed';
const warningBytes = 800 * 1024;
const hardLimitBytes = 950 * 1024;

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

async function loadExpectedEntries(): Promise<Map<string, Record<string, DailyChecklistEntry>>> {
  const db = getFirestore();
  const snapshot = await db.collection(`artifacts/${appId}/requests`).get();
  const byDate = new Map<string, Record<string, DailyChecklistEntry>>();

  snapshot.docs.forEach(document => {
    const request = { id: document.id, ...document.data() } as Request;
    const entry = buildDailyChecklistEntry(request);
    if (!entry || !request.analysisDate) return;
    const entries = byDate.get(request.analysisDate) || {};
    entries[request.id] = entry;
    byDate.set(request.analysisDate, entries);
  });

  console.log(`[Daily checklist] Found ${snapshot.size} requests and ${byDate.size} materialized dates for app ${appId}.`);
  return byDate;
}

function validateDocumentSize(analysisDate: string, entries: Record<string, DailyChecklistEntry>): void {
  const bytes = Buffer.byteLength(JSON.stringify({
    schemaVersion: DAILY_CHECKLIST_SCHEMA_VERSION,
    analysisDate,
    entries
  }), 'utf8');
  if (bytes >= warningBytes) {
    console.warn(`[Daily checklist] ${analysisDate} is approximately ${Math.round(bytes / 1024)} KiB.`);
  }
  if (bytes >= hardLimitBytes) {
    throw new Error(`${analysisDate} is too close to the Firestore document limit; shard this date before backfilling.`);
  }
}

async function backfill(expected: Map<string, Record<string, DailyChecklistEntry>>): Promise<void> {
  if (dryRun) {
    console.log('[Daily checklist] Dry run: no Firestore writes were made.');
    return;
  }

  const db = getFirestore();
  const dates = Array.from(expected.keys()).sort();
  const batchSize = 250;
  for (let offset = 0; offset < dates.length; offset += batchSize) {
    const batch = db.batch();
    const chunk = dates.slice(offset, offset + batchSize);
    chunk.forEach(analysisDate => {
      const entries = expected.get(analysisDate)!;
      validateDocumentSize(analysisDate, entries);
      batch.set(db.doc(`artifacts/${appId}/daily_checklists/${analysisDate}`), {
        schemaVersion: DAILY_CHECKLIST_SCHEMA_VERSION,
        analysisDate,
        updatedAt: FieldValue.serverTimestamp(),
        entries
      });
    });
    await batch.commit();
    console.log(`[Daily checklist] Backfilled ${Math.min(offset + chunk.length, dates.length)}/${dates.length} dates.`);
  }
}

async function verify(expected: Map<string, Record<string, DailyChecklistEntry>>): Promise<void> {
  const db = getFirestore();
  const mismatches: string[] = [];
  for (const [analysisDate, expectedEntries] of expected) {
    const snapshot = await db.doc(`artifacts/${appId}/daily_checklists/${analysisDate}`).get();
    if (!snapshot.exists) {
      mismatches.push(`${analysisDate}: missing daily document`);
      continue;
    }
    const actualEntries = (snapshot.data()?.['entries'] || {}) as Record<string, DailyChecklistEntry>;
    const expectedIds = Object.keys(expectedEntries).sort();
    const actualIds = Object.keys(actualEntries).sort();
    if (JSON.stringify(expectedIds) !== JSON.stringify(actualIds)) {
      mismatches.push(`${analysisDate}: expected ${expectedIds.length} entries, found ${actualIds.length}`);
      continue;
    }
    const statusMismatch = expectedIds.find(id => actualEntries[id]?.status !== expectedEntries[id]?.status);
    if (statusMismatch) {
      mismatches.push(`${analysisDate}: status mismatch for ${statusMismatch}`);
    }
  }

  if (mismatches.length > 0) {
    console.error(mismatches.map(item => `- ${item}`).join('\n'));
    throw new Error(`Reconciliation found ${mismatches.length} mismatched dates.`);
  }
  console.log(`[Daily checklist] Reconciliation passed for ${expected.size} dates.`);
}

async function main(): Promise<void> {
  initializeAdmin();
  const db = getFirestore();
  db.settings({ ignoreUndefinedProperties: true });
  const expected = await loadExpectedEntries();
  if (!verifyOnly) await backfill(expected);
  if (!dryRun) await verify(expected);
}

main().catch(error => {
  console.error(`[Daily checklist] ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
