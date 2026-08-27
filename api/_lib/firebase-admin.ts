import { cert, getApps, initializeApp } from 'firebase-admin/app';

/**
 * Initialise Firebase Admin once for both authenticated API handlers and
 * trusted scheduled jobs. The emulator path deliberately avoids requiring a
 * service-account key so local workflow tests remain self-contained.
 */
export function initializeFirebaseAdminIfNeeded(): void {
  if (getApps().length) return;

  if (process.env['FIRESTORE_EMULATOR_HOST'] || process.env['FIREBASE_AUTH_EMULATOR_HOST']) {
    initializeApp({
      projectId: process.env['GCLOUD_PROJECT'] || 'demo-lims-notification'
    });
    return;
  }

  const serviceAccountJson = process.env['FIREBASE_SERVICE_ACCOUNT'];
  if (!serviceAccountJson) throw new Error('FIREBASE_SERVICE_ACCOUNT is not configured.');

  let serviceAccount: any;
  try {
    serviceAccount = typeof serviceAccountJson === 'string'
      ? JSON.parse(serviceAccountJson)
      : serviceAccountJson;
  } catch (e: any) {
    throw new Error(`FIREBASE_SERVICE_ACCOUNT JSON parse error: ${e.message}`);
  }

  if (serviceAccount && typeof serviceAccount.private_key === 'string') {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
  }

  initializeApp({ credential: cert(serviceAccount) });
}
