/**
 * POST /api/account/delete-request
 *
 * Ẩn danh hoá thông tin cá nhân của tài khoản (email + avatar).
 * Đây KHÔNG phải xoá hoàn toàn tài khoản Firebase Auth —
 * theo yêu cầu của tổ chức, tài khoản vẫn giữ để audit trail.
 *
 * Thay đổi:
 *   - email → deleted_<uid>@anonymized.lims
 *   - photoURL → null
 *   - avatarStyle → null (về mặc định hệ thống)
 *   - displayName → GIỮ NGUYÊN (cần cho audit log)
 *
 * Auth: Firebase ID Token bắt buộc (Authorization: Bearer <idToken>)
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
  // CORS
  const origin = req.headers['origin'] as string | undefined;
  res.setHeader('Access-Control-Allow-Origin', origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Xác thực người dùng qua Firebase ID Token
  const authorization = req.headers['authorization'] || '';
  const idToken = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
  if (!idToken) return res.status(401).json({ error: 'Thiếu Firebase ID token.' });

  try {
    initAdmin();
    const auth = getAuth();
    const db = getFirestore();

    // Verify token
    let decoded: any;
    try {
      decoded = await auth.verifyIdToken(idToken);
    } catch {
      return res.status(401).json({ error: 'Token không hợp lệ hoặc đã hết hạn.' });
    }

    const uid = decoded.uid;
    const anonymizedEmail = `deleted_${uid}@anonymized.lims`;

    // Cập nhật Firestore user document
    const userRef = db.collection(`artifacts/${APP_ID}/users`).doc(uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return res.status(404).json({ error: 'Không tìm thấy hồ sơ người dùng.' });
    }

    await userRef.update({
      email: anonymizedEmail,
      photoURL: null,
      avatarStyle: null,
      accountAnonymizedAt: new Date().toISOString(),
    });

    // Cập nhật Firebase Auth profile
    try {
      await auth.updateUser(uid, {
        email: anonymizedEmail,
        photoURL: null,
        displayName: userSnap.data()?.['displayName'] || undefined,
      });
    } catch (authErr: any) {
      // Nếu email đã bị dùng hoặc lỗi Auth, vẫn tiếp tục — Firestore đã được cập nhật
      console.warn('[delete-request] Firebase Auth update warning:', authErr.message);
    }

    console.log(`[account/delete-request] Anonymized UID: ${uid}`);
    return res.status(200).json({ success: true, message: 'Thông tin cá nhân đã được ẩn danh hoá.' });

  } catch (err: any) {
    console.error('[account/delete-request] Error:', err);
    return res.status(500).json({ error: 'Lỗi máy chủ. Vui lòng thử lại.' });
  }
}
