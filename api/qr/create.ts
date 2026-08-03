/**
 * POST /api/qr/create
 *
 * Tạo QR session bằng Firebase Admin SDK.
 * Desktop gọi endpoint này để lấy sessionId + nonce để hiển thị mã QR.
 *
 * Body: { appId: string }
 * Response: { sessionId: string, nonce: string, expiresAt: number }
 */
import { VercelRequest, VercelResponse } from '@vercel/node';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { randomBytes } from 'node:crypto';

function initAdmin() {
  if (getApps().length > 0) return;
  const serviceAccountJson = process.env['FIREBASE_SERVICE_ACCOUNT'];
  if (!serviceAccountJson) throw new Error('FIREBASE_SERVICE_ACCOUNT is not configured.');
  let serviceAccount: any;
  try {
    serviceAccount = JSON.parse(serviceAccountJson);
  } catch (e: any) {
    throw new Error(`FIREBASE_SERVICE_ACCOUNT JSON parse error: ${e.message}`);
  }
  if (serviceAccount?.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
  }
  initializeApp({ credential: cert(serviceAccount) });
}

const SESSION_TTL_MS = 5 * 60 * 1000; // 5 phút
const APP_ID = process.env['VITE_APP_ID'] || process.env['APP_ID'] || 'lims-cloud-fixed';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS: cho phép tất cả origins vì create là public endpoint,
  // bảo mật thực sự là nonce một lần dùng bên trong.
  const origin = req.headers['origin'] as string | undefined;
  res.setHeader('Access-Control-Allow-Origin', origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    initAdmin();
    const db = getFirestore();

    const sessionId = 'qr_' + randomBytes(16).toString('hex');
    const nonce = randomBytes(24).toString('base64url');
    const expiresAt = Date.now() + SESSION_TTL_MS;

    await db
      .collection(`artifacts/${APP_ID}/auth_sessions`)
      .doc(sessionId)
      .set({
        status: 'waiting',
        nonce,
        expiresAt,
        createdAt: FieldValue.serverTimestamp(),
        uid: null,
      });

    return res.status(200).json({ sessionId, nonce, expiresAt });
  } catch (err: any) {
    console.error('[QR Create] Error:', err);
    return res.status(500).json({ error: 'Failed to create QR session' });
  }
}
