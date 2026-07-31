/**
 * GET /api/qr/status?sessionId=qr_xxx
 *
 * Desktop poll endpoint này sau khi hiển thị mã QR.
 * Khi session approved, server tạo Firebase Custom Token và trả về cho Desktop.
 * Desktop dùng customToken để signInWithCustomToken().
 * Session bị xóa ngay sau khi customToken được phát.
 *
 * Response (waiting):  { status: 'waiting' }
 * Response (approved): { status: 'approved', customToken: string }
 * Response (expired):  { status: 'expired' }
 */
import { VercelRequest, VercelResponse } from '@vercel/node';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

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

const APP_ID = process.env['VITE_APP_ID'] || process.env['APP_ID'] || 'default';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { sessionId } = req.query;

  if (typeof sessionId !== 'string' || !sessionId.startsWith('qr_')) {
    return res.status(400).json({ error: 'Invalid sessionId' });
  }

  try {
    initAdmin();
    const auth = getAuth();
    const db = getFirestore();

    const sessionRef = db.collection(`artifacts/${APP_ID}/auth_sessions`).doc(sessionId);
    const sessionSnap = await sessionRef.get();

    if (!sessionSnap.exists) {
      // Session đã bị xóa (đã dùng hoặc expired)
      return res.status(200).json({ status: 'expired' });
    }

    const sessionData = sessionSnap.data()!;

    // Kiểm tra TTL
    if (sessionData['expiresAt'] < Date.now()) {
      await sessionRef.delete();
      return res.status(200).json({ status: 'expired' });
    }

    if (sessionData['status'] === 'waiting') {
      return res.status(200).json({ status: 'waiting' });
    }

    if (sessionData['status'] === 'approved' && sessionData['uid']) {
      const uid = sessionData['uid'] as string;

      // Tạo Custom Token cho Desktop — Desktop dùng để signInWithCustomToken()
      const customToken = await auth.createCustomToken(uid);

      // Xóa session ngay lập tức — single-use
      await sessionRef.delete();

      // Không log uid trong production, chỉ log event
      console.log(`[QR Status] Issued custom token for session ${sessionId.substring(0, 12)}...`);

      return res.status(200).json({ status: 'approved', customToken });
    }

    // Trạng thái không xác định
    return res.status(200).json({ status: 'waiting' });
  } catch (err: any) {
    console.error('[QR Status] Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
