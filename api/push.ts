import { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * @deprecated
 * Endpoint này KHÔNG còn được sử dụng kể từ khi luồng push notification được
 * gộp vào /api/notifications (action='publish', sendPush=true).
 *
 * Lý do: /api/push yêu cầu caller phải có role='manager', không phù hợp cho
 * các nghiệp vụ thông thường (COA_REQUEST, BORROW_REQUEST, v.v.).
 *
 * Thay thế: Dùng NotificationCenterService.publish({ channels: ['inbox', 'push'], ... })
 *           hoặc gọi POST /api/notifications trực tiếp.
 *
 * File giữ lại để tránh 404 nếu có request cũ còn cached. Có thể xóa an toàn
 * sau khi xác nhận không còn traffic vào /api/push.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const authorization = req.headers.authorization || '';
    const idToken = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
    if (!idToken) return res.status(401).json({ error: 'Unauthorized' });

    const { recipientUids, title, body, url, appId } = req.body;

    if (!recipientUids || !Array.isArray(recipientUids) || recipientUids.length === 0 || !title || !body) {
      console.warn('[WebPush API] Missing fields');
      return res.status(400).json({ error: 'Missing or invalid required fields (recipientUids, title, body)' });
    }

    // Dynamically import firebase-admin to catch any loading errors on Vercel
    console.log('[WebPush API] Loading firebase-admin...');
    const admin = await import('firebase-admin');
    console.log('[WebPush API] firebase-admin loaded.');

    // Initialize Firebase Admin if not already initialized
    if (!admin.apps.length) {
      console.log('[WebPush API] Initializing Firebase Admin...');
      const serviceAccountJson = process.env['FIREBASE_SERVICE_ACCOUNT'];
      if (!serviceAccountJson) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is not set on Vercel.');
      }
      const serviceAccount = JSON.parse(serviceAccountJson);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('[WebPush API] Firebase Admin initialized.');
    }

    console.log(`[WebPush API] Querying Firestore for ${recipientUids.length} users...`);
    const db = admin.firestore();
    const decoded = await admin.auth().verifyIdToken(idToken);
    const resolvedAppId = appId || 'lims-cloud-fixed';
    const callerProfile = await db.doc(`artifacts/${resolvedAppId}/users/${decoded.uid}`).get();
    if (!callerProfile.exists || callerProfile.data()?.['role'] !== 'manager') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    let allTokens: string[] = [];

    // Fetch tokens for each recipient UID
    // Batch query user documents
    const userDocs = await Promise.all(
      recipientUids.map((uid: string) =>
        db.doc(`artifacts/${resolvedAppId}/users/${uid}`).get()
      )
    );

    for (const doc of userDocs) {
      if (doc.exists) {
        const data = doc.data();
        if (data && data['fcmTokens'] && Array.isArray(data['fcmTokens'])) {
          allTokens.push(...data['fcmTokens']);
        }
      }
    }

    console.log(`[WebPush API] Found ${allTokens.length} raw tokens.`);

    // Remove duplicates just in case
    allTokens = [...new Set(allTokens)];

    if (allTokens.length === 0) {
      return res.status(200).json({ success: true, message: 'No devices found for recipients', sentCount: 0 });
    }

    // Send the push notification
    const message = {
      notification: {
        title: title,
        body: body,
      },
      webpush: {
        fcmOptions: {
          link: url || '/'
        }
      },
      tokens: allTokens,
    };

    console.log('[WebPush API] Sending multicast message...');
    const response = await admin.messaging().sendEachForMulticast(message);

    console.log(`[WebPush API] Successfully sent ${response.successCount} messages. Failed: ${response.failureCount}`);

    return res.status(200).json({
      success: true,
      sentCount: response.successCount,
      failureCount: response.failureCount
    });

  } catch (error: any) {
    console.error('[WebPush API] Error sending push notification:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
