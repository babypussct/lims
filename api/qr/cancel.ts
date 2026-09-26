import type { VercelRequest, VercelResponse } from '../_lib/vercel-types.js';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeFirebaseAdminIfNeeded } from '../_lib/firebase-admin.js';
import { enforceQrRateLimit, isValidQrSessionId, QrRateLimitError } from '../_lib/qr-rate-limit.js';
import { readQrPollTokenHeader, verifyQrPollTokenHash } from '../_lib/qr-session-auth.js';

const APP_ID = process.env['VITE_APP_ID'] || process.env['APP_ID'] || 'lims-cloud-fixed';
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const CANCEL_RATE_LIMIT = 60;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' });

  const { sessionId } = req.query;
  if (!isValidQrSessionId(sessionId)) return res.status(400).json({ error: 'Invalid sessionId' });

  const pollToken = readQrPollTokenHeader(req.headers);
  if (!pollToken) return res.status(401).json({ error: 'Missing or invalid QR poll capability' });

  try {
    initializeFirebaseAdminIfNeeded();
    const db = getFirestore();
    await enforceQrRateLimit({
      db,
      appId: APP_ID,
      scope: 'cancel',
      headers: req.headers,
      limit: CANCEL_RATE_LIMIT,
      windowMs: RATE_LIMIT_WINDOW_MS,
    });

    const sessionRef = db.collection(`artifacts/${APP_ID}/auth_sessions`).doc(sessionId);
    const result = await db.runTransaction(async txn => {
      const snap = await txn.get(sessionRef);
      if (!snap.exists) return 'missing' as const;
      if (!verifyQrPollTokenHash(pollToken, snap.data()?.['pollTokenHash'])) return 'forbidden' as const;
      txn.delete(sessionRef);
      return 'deleted' as const;
    });

    if (result === 'forbidden') return res.status(403).json({ error: 'Invalid QR poll capability' });
    return res.status(204).end();
  } catch (err: any) {
    if (err instanceof QrRateLimitError) {
      res.setHeader('Retry-After', String(err.retryAfterSeconds));
      return res.status(429).json({ error: 'Too many QR cancellation requests. Please retry later.' });
    }
    console.error('[QR Cancel] Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
