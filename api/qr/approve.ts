/**
 * POST /api/qr/approve
 *
 * Mobile gọi endpoint này sau khi đã quét QR.
 * Server verify Firebase ID Token, kiểm tra nonce, và đánh dấu session là approved.
 * KHÔNG có password nào được truyền giữa các thiết bị.
 *
 * Body: { sessionId: string, nonce: string, idToken: string }
 * Response: { ok: true }
 */
import { VercelRequest, VercelResponse } from '@vercel/node';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

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

const APP_ID = process.env['VITE_APP_ID'] || process.env['APP_ID'] || 'lims-cloud-fixed';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS — Mobile PWA gọi endpoint này
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

  const { sessionId, nonce, idToken } = req.body || {};

  // Validate input
  if (
    typeof sessionId !== 'string' || !sessionId.startsWith('qr_') ||
    typeof nonce !== 'string' || nonce.length < 16 ||
    typeof idToken !== 'string' || idToken.length < 100
  ) {
    return res.status(400).json({ error: 'Invalid request parameters' });
  }

  try {
    initAdmin();
    const auth = getAuth();
    const db = getFirestore();

    // 1. Verify Firebase ID Token — xác nhận danh tính mobile user
    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(idToken);
    } catch {
      return res.status(401).json({ error: 'Invalid or expired ID token' });
    }

    const uid = decodedToken.uid;

    // 2. Đọc session document
    const sessionRef = db.collection(`artifacts/${APP_ID}/auth_sessions`).doc(sessionId);
    const sessionSnap = await sessionRef.get();

    if (!sessionSnap.exists) {
      return res.status(404).json({ error: 'Session not found or already used' });
    }

    const sessionData = sessionSnap.data()!;

    // 3. Kiểm tra session còn hợp lệ
    if (sessionData['status'] !== 'waiting') {
      return res.status(409).json({ error: 'Session already approved or expired' });
    }

    if (sessionData['expiresAt'] < Date.now()) {
      await sessionRef.delete(); // Cleanup
      return res.status(410).json({ error: 'QR code has expired. Please scan a new one.' });
    }

    // 4. Kiểm tra nonce khớp (chống replay attack)
    if (sessionData['nonce'] !== nonce) {
      return res.status(403).json({ error: 'Nonce mismatch — possible replay attack' });
    }

    // 5. Đánh dấu session approved với uid của mobile user
    // Desktop sẽ poll /api/qr/status và nhận customToken để đăng nhập
    await sessionRef.update({
      status: 'approved',
      uid,
      approvedAt: FieldValue.serverTimestamp(),
      // Xóa nonce sau khi dùng (one-time use)
      nonce: FieldValue.delete(),
    });

    return res.status(200).json({ ok: true });
  } catch (err: any) {
    console.error('[QR Approve] Unexpected error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
