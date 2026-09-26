/**
 * GET /api/qr/status?sessionId=qr_xxx
 *
 * Desktop polls this same-origin endpoint with X-QR-Poll-Token. The poll token
 * is returned only by /api/qr/create and is never embedded in the scannable QR.
 */
import type { VercelRequest, VercelResponse } from '../_lib/vercel-types.js';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeFirebaseAdminIfNeeded } from '../_lib/firebase-admin.js';
import { enforceQrRateLimit, isValidQrSessionId, QrRateLimitError } from '../_lib/qr-rate-limit.js';
import { readQrPollTokenHeader, verifyQrPollTokenHash } from '../_lib/qr-session-auth.js';

const APP_ID = process.env['VITE_APP_ID'] || process.env['APP_ID'] || 'lims-cloud-fixed';
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const STATUS_RATE_LIMIT = 240;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { sessionId } = req.query;
  if (!isValidQrSessionId(sessionId)) {
    return res.status(400).json({ error: 'Invalid sessionId' });
  }

  const pollToken = readQrPollTokenHeader(req.headers);
  if (!pollToken) {
    return res.status(401).json({ error: 'Missing or invalid QR poll capability' });
  }

  try {
    initializeFirebaseAdminIfNeeded();
    const auth = getAuth();
    const db = getFirestore();

    await enforceQrRateLimit({
      db,
      appId: APP_ID,
      scope: 'status',
      headers: req.headers,
      limit: STATUS_RATE_LIMIT,
      windowMs: RATE_LIMIT_WINDOW_MS,
    });

    const sessionRef = db.collection(`artifacts/${APP_ID}/auth_sessions`).doc(sessionId);
    const redemption = await db.runTransaction(async txn => {
      const snap = await txn.get(sessionRef);
      if (!snap.exists) return { kind: 'expired' as const };

      const data = snap.data()!;
      if (!verifyQrPollTokenHash(pollToken, data['pollTokenHash'])) {
        return { kind: 'forbidden' as const };
      }

      if (data['expiresAt'] < Date.now()) {
        txn.delete(sessionRef);
        return { kind: 'expired' as const };
      }

      if (data['status'] === 'approved' && typeof data['uid'] === 'string' && data['uid']) {
        txn.delete(sessionRef);
        return { kind: 'approved' as const, uid: data['uid'] as string };
      }

      return { kind: 'waiting' as const };
    });

    if (redemption.kind === 'forbidden') {
      return res.status(403).json({ error: 'Invalid QR poll capability' });
    }
    if (redemption.kind === 'expired') {
      return res.status(200).json({ status: 'expired' });
    }
    if (redemption.kind === 'waiting') {
      return res.status(200).json({ status: 'waiting' });
    }

    const customToken = await auth.createCustomToken(redemption.uid);
    console.log(`[QR Status] Issued custom token for session ${sessionId.substring(0, 12)}...`);
    return res.status(200).json({ status: 'approved', customToken });
  } catch (err: any) {
    if (err instanceof QrRateLimitError) {
      res.setHeader('Retry-After', String(err.retryAfterSeconds));
      return res.status(429).json({ error: 'Too many QR status checks. Please retry later.' });
    }
    console.error('[QR Status] Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
