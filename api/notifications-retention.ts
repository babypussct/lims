import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeFirebaseAdminIfNeeded } from './_lib/firebase-admin.js';
import {
  NOTIFICATION_CLEANUP_BATCH_SIZE,
  NOTIFICATION_CLEANUP_MAX_DOCS_PER_RUN,
  NOTIFICATION_RETENTION_DAYS,
  notificationRetentionCutoff
} from './_lib/notification-retention.js';

const DEFAULT_APP_ID = 'lims-cloud-fixed';

function configuredAppId(): string {
  const appId = process.env['LIMS_APP_ID'] || process.env['APP_ID'] || DEFAULT_APP_ID;
  if (!/^[A-Za-z0-9_-]+$/.test(appId)) {
    throw new Error('LIMS_APP_ID/APP_ID contains unsupported characters.');
  }
  return appId;
}

function hasValidCronSecret(req: VercelRequest): boolean {
  const cronSecret = process.env['CRON_SECRET'];
  const authorization = req.headers?.authorization || '';
  return Boolean(cronSecret) && authorization === `Bearer ${cronSecret}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Allow', 'GET');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });
  if (!hasValidCronSecret(req)) return res.status(401).json({ error: 'Unauthorized' });

  try {
    initializeFirebaseAdminIfNeeded();

    const appId = configuredAppId();
    const cutoff = notificationRetentionCutoff();
    const db = getFirestore();
    const notifications = db.collection(`artifacts/${appId}/notifications`);
    let deletedCount = 0;
    let batchCount = 0;

    while (deletedCount < NOTIFICATION_CLEANUP_MAX_DOCS_PER_RUN) {
      const remaining = NOTIFICATION_CLEANUP_MAX_DOCS_PER_RUN - deletedCount;
      const snapshot = await notifications
        .where('createdAt', '<', cutoff)
        .limit(Math.min(NOTIFICATION_CLEANUP_BATCH_SIZE, remaining))
        .get();

      if (snapshot.empty) break;

      const batch = db.batch();
      snapshot.docs.forEach(item => batch.delete(item.ref));
      await batch.commit();

      deletedCount += snapshot.size;
      batchCount++;

      if (snapshot.size < Math.min(NOTIFICATION_CLEANUP_BATCH_SIZE, remaining)) break;
    }

    return res.status(200).json({
      success: true,
      appId,
      retentionDays: NOTIFICATION_RETENTION_DAYS,
      cutoffAt: new Date(cutoff).toISOString(),
      deletedCount,
      batchCount,
      quotaCapped: deletedCount >= NOTIFICATION_CLEANUP_MAX_DOCS_PER_RUN
    });
  } catch (error: any) {
    console.error('[NotificationRetention] Cleanup failed:', error?.message || error);
    return res.status(500).json({ error: 'Notification retention cleanup failed.' });
  }
}
