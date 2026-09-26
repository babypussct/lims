import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadEnvFile } from 'node:process';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { initializeFirebaseAdminIfNeeded } from '../api/_lib/firebase-admin.js';

const APP_ID = process.env['VITE_APP_ID'] || process.env['APP_ID'] || 'lims-cloud-fixed';
const APPLY = process.argv.includes('--apply');
const VALID_STATUSES = new Set(['approved', 'completed', 'pending', 'rejected', 'draft']);

function timestampMillis(value: any): number {
  if (value && typeof value.toMillis === 'function') return value.toMillis();
  if (value instanceof Date) return value.getTime();
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  return 0;
}

function loadLocalEnvIfPresent(): void {
  const envPath = resolve(process.cwd(), '.env.local');
  if (existsSync(envPath)) {
    loadEnvFile(envPath);
  }
}

async function main(): Promise<void> {
  loadLocalEnvIfPresent();
  initializeFirebaseAdminIfNeeded();
  const db = getFirestore();
  const logs = await db
    .collection(`artifacts/${APP_ID}/logs`)
    .where('publicTraceable', '==', true)
    .get();

  const latestByRequest = new Map<string, { logId: string; timestamp: number }>();
  for (const logDoc of logs.docs) {
    const data = logDoc.data();
    const requestId = typeof data['requestId'] === 'string' ? data['requestId'].trim() : '';
    if (
      !requestId ||
      data['auditClass'] !== 'BUSINESS' ||
      data['targetType'] !== 'REQUEST'
    ) {
      continue;
    }
    const timestamp = timestampMillis(data['lastUpdated'] ?? data['timestamp']);
    const current = latestByRequest.get(requestId);
    if (!current || timestamp >= current.timestamp) {
      latestByRequest.set(requestId, { logId: logDoc.id, timestamp });
    }
  }

  const candidates = Array.from(latestByRequest.entries());
  const rows: Array<{ requestId: string; logId: string; status: string }> = [];
  for (let offset = 0; offset < candidates.length; offset += 250) {
    const chunk = candidates.slice(offset, offset + 250);
    const refs = chunk.map(([requestId]) =>
      db.doc(`artifacts/${APP_ID}/requests/${requestId}`)
    );
    const snapshots = refs.length ? await db.getAll(...refs) : [];
    snapshots.forEach((snapshot, index) => {
      if (!snapshot.exists) return;
      const status = snapshot.data()?.['status'];
      if (typeof status !== 'string' || !VALID_STATUSES.has(status)) return;
      rows.push({
        requestId: chunk[index][0],
        logId: chunk[index][1].logId,
        status,
      });
    });
  }

  console.log(`[Traceability Backfill] public logs=${logs.size}, projections=${rows.length}, mode=${APPLY ? 'apply' : 'dry-run'}`);
  if (!APPLY) return;

  for (let offset = 0; offset < rows.length; offset += 400) {
    const batch = db.batch();
    for (const row of rows.slice(offset, offset + 400)) {
      batch.set(
        db.doc(`artifacts/${APP_ID}/public_traceability/${row.requestId}`),
        {
          requestId: row.requestId,
          logId: row.logId,
          status: row.status,
          updatedAt: FieldValue.serverTimestamp(),
        }
      );
    }
    await batch.commit();
  }

  console.log(`[Traceability Backfill] applied ${rows.length} projections.`);
}

main().catch(error => {
  console.error('[Traceability Backfill] failed:', error);
  process.exitCode = 1;
});
