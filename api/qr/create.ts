/**
 * POST /api/qr/create
 *
 * Tạo QR session bằng Firebase Admin SDK.
 * Desktop gọi endpoint này để lấy sessionId + nonce để hiển thị mã QR.
 *
 * Body: { appId: string }
 * Response: { sessionId: string, nonce: string, expiresAt: number }
 */
import type { VercelRequest, VercelResponse } from '../_lib/vercel-types.js';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { randomBytes } from 'node:crypto';
import { enforceQrRateLimit, QrRateLimitError } from '../_lib/qr-rate-limit.js';
import { initializeFirebaseAdminIfNeeded } from '../_lib/firebase-admin.js';
import { createQrPollToken, hashQrPollToken } from '../_lib/qr-session-auth.js';

const SESSION_TTL_MS = 5 * 60 * 1000; // 5 phút
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const CREATE_RATE_LIMIT = 30;
const APP_ID = process.env['VITE_APP_ID'] || process.env['APP_ID'] || 'lims-cloud-fixed';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    initializeFirebaseAdminIfNeeded();
    const db = getFirestore();

    await enforceQrRateLimit({
      db,
      appId: APP_ID,
      scope: 'create',
      headers: req.headers,
      limit: CREATE_RATE_LIMIT,
      windowMs: RATE_LIMIT_WINDOW_MS,
    });

    const sessionId = 'qr_' + randomBytes(16).toString('hex');
    const nonce = randomBytes(24).toString('base64url');
    const pollToken = createQrPollToken();
    const expiresAt = Date.now() + SESSION_TTL_MS;

    await db
      .collection(`artifacts/${APP_ID}/auth_sessions`)
      .doc(sessionId)
      .set({
        status: 'waiting',
        nonce,
        pollTokenHash: hashQrPollToken(pollToken),
        expiresAt,
        createdAt: FieldValue.serverTimestamp(),
        uid: null,
      });

    return res.status(200).json({ sessionId, nonce, pollToken, expiresAt });
  } catch (err: any) {
    if (err instanceof QrRateLimitError) {
      res.setHeader('Retry-After', String(err.retryAfterSeconds));
      return res.status(429).json({ error: 'Too many QR session requests. Please retry later.' });
    }
    console.error('[QR Create] Error:', err);
    return res.status(500).json({ error: 'Failed to create QR session' });
  }
}
