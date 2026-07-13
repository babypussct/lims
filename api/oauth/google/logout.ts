import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  clearCookieHeader, GOOGLE_SESSION_COOKIE, readGoogleSession
} from '../../_lib/google-oauth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  const session = readGoogleSession(req);
  const token = session?.refreshToken || session?.accessToken;
  if (token) {
    try {
      await fetch(`https://oauth2.googleapis.com/revoke?token=${encodeURIComponent(token)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
    } catch (error) {
      console.warn('[OAuth] Google token revocation failed:', error);
    }
  }
  res.setHeader('Set-Cookie', clearCookieHeader(GOOGLE_SESSION_COOKIE));
  res.setHeader('Cache-Control', 'no-store');
  return res.status(204).end();
}
