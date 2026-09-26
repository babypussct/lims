/**
 * POST /api/qr/approve
 *
 * Mobile verifies its Firebase identity and consumes the QR nonce exactly once.
 * The desktop-only poll capability never crosses this endpoint.
 */
import type { VercelRequest, VercelResponse } from '../_lib/vercel-types.js';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { initializeFirebaseAdminIfNeeded } from '../_lib/firebase-admin.js';
import { isValidQrSessionId } from '../_lib/qr-rate-limit.js';

const APP_ID = process.env['VITE_APP_ID'] || process.env['APP_ID'] || 'lims-cloud-fixed';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { sessionId, nonce, idToken } = req.body || {};
  if (
    !isValidQrSessionId(sessionId) ||
    typeof nonce !== 'string' || nonce.length < 16 ||
    typeof idToken !== 'string' || idToken.length < 100
  ) {
    return res.status(400).json({ error: 'Invalid request parameters' });
  }

  try {
    initializeFirebaseAdminIfNeeded();
    const auth = getAuth();
    const db = getFirestore();

    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(idToken);
    } catch {
      return res.status(401).json({ error: 'Invalid or expired ID token' });
    }

    const sessionRef = db.collection(`artifacts/${APP_ID}/auth_sessions`).doc(sessionId);
    const outcome = await db.runTransaction(async txn => {
      const sessionSnap = await txn.get(sessionRef);
      if (!sessionSnap.exists) return 'not-found' as const;

      const sessionData = sessionSnap.data()!;
      if (sessionData['expiresAt'] < Date.now()) {
        txn.delete(sessionRef);
        return 'expired' as const;
      }
      if (sessionData['status'] !== 'waiting') return 'conflict' as const;
      if (sessionData['nonce'] !== nonce) return 'nonce-mismatch' as const;

      txn.update(sessionRef, {
        status: 'approved',
        uid: decodedToken.uid,
        approvedAt: FieldValue.serverTimestamp(),
        nonce: FieldValue.delete(),
      });
      return 'approved' as const;
    });

    if (outcome === 'not-found') return res.status(404).json({ error: 'Session not found or already used' });
    if (outcome === 'expired') return res.status(410).json({ error: 'QR code has expired. Please scan a new one.' });
    if (outcome === 'conflict') return res.status(409).json({ error: 'Session already approved or expired' });
    if (outcome === 'nonce-mismatch') return res.status(403).json({ error: 'Nonce mismatch — possible replay attack' });
    return res.status(200).json({ ok: true });
  } catch (err: any) {
    console.error('[QR Approve] Unexpected error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
