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

const APP_ID = process.env['VITE_APP_ID'] || process.env['APP_ID'] || 'lims-cloud-fixed';

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

    // Đọc hồ sơ trước khi thay đổi để có thể rollback nếu một bên cập nhật thất bại.
    const userRef = db.collection(`artifacts/${APP_ID}/users`).doc(uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return res.status(404).json({ error: 'Không tìm thấy hồ sơ người dùng.' });
    }

    const authUser = await auth.getUser(uid);
    const originalAuthProfile = {
      email: authUser.email,
      photoURL: authUser.photoURL,
      displayName: authUser.displayName,
    };

    // Cập nhật Firebase Auth trước. Nếu bước này thất bại, Firestore vẫn giữ
    // nguyên PII và API không được phép báo thành công.
    try {
      await auth.updateUser(uid, {
        email: anonymizedEmail,
        photoURL: null,
        displayName: originalAuthProfile.displayName || undefined,
      });
    } catch (authErr: any) {
      console.error('[delete-request] Firebase Auth update failed:', authErr?.message || authErr);
      return res.status(502).json({
        error: 'Không thể ẩn danh hóa tài khoản trong Firebase Auth. Dữ liệu chưa được thay đổi.',
        code: 'AUTH_UPDATE_FAILED',
      });
    }

    try {
      await userRef.update({
        email: anonymizedEmail,
        photoURL: null,
        avatarStyle: null,
        accountAnonymizedAt: new Date().toISOString(),
      });
    } catch (firestoreErr: any) {
      // Không để Auth và Firestore lệch nhau nếu bước thứ hai thất bại.
      try {
        await auth.updateUser(uid, {
          ...(originalAuthProfile.email ? { email: originalAuthProfile.email } : {}),
          photoURL: originalAuthProfile.photoURL || null,
          displayName: originalAuthProfile.displayName || undefined,
        });
      } catch (rollbackErr: any) {
        console.error('[delete-request] Auth rollback failed after Firestore error:', rollbackErr?.message || rollbackErr);
        return res.status(500).json({
          error: 'Không thể hoàn tất hoặc hoàn tác thao tác ẩn danh hóa. Vui lòng liên hệ quản trị viên.',
          code: 'ANONYMIZATION_INCONSISTENT',
        });
      }

      console.error('[delete-request] Firestore update failed; Auth was rolled back:', firestoreErr?.message || firestoreErr);
      return res.status(502).json({
        error: 'Không thể cập nhật hồ sơ LIMS. Thao tác đã được hoàn tác, dữ liệu chưa được thay đổi.',
        code: 'FIRESTORE_UPDATE_FAILED',
      });
    }

    console.log(`[account/delete-request] Anonymized UID: ${uid}`);
    return res.status(200).json({ success: true, message: 'Thông tin cá nhân đã được ẩn danh hoá.' });

  } catch (err: any) {
    console.error('[account/delete-request] Error:', err);
    return res.status(500).json({ error: 'Lỗi máy chủ. Vui lòng thử lại.' });
  }
}
