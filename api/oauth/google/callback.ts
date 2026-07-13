import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  callbackUrl, clearCookieHeader, decryptCookie, GOOGLE_STATE_COOKIE,
  OAuthState, oauthClientId, oauthClientSecret, readCookie, requestOrigin,
  readGoogleSession, safeReturnTo, setGoogleSession
} from '../../_lib/google-oauth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });
  res.setHeader('Cache-Control', 'no-store');
  const state = decryptCookie<OAuthState>(readCookie(req, GOOGLE_STATE_COOKIE));
  const returnedState = typeof req.query['state'] === 'string' ? req.query['state'] : '';
  const code = typeof req.query['code'] === 'string' ? req.query['code'] : '';
  if (!state || Date.now() - state.createdAt > 10 * 60 * 1000 || state.nonce !== returnedState || !code) {
    return res.status(400).send('Invalid or expired OAuth state. Please return to LIMS and try again.');
  }

  try {
    const body = new URLSearchParams({
      code,
      client_id: oauthClientId(),
      client_secret: oauthClientSecret(),
      redirect_uri: callbackUrl(req),
      grant_type: 'authorization_code',
      code_verifier: state.verifier
    });
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body
    });
    const token = await response.json() as {
      access_token?: string; refresh_token?: string; expires_in?: number;
      scope?: string; error_description?: string;
    };
    if (!response.ok || !token.access_token) {
      throw new Error(token.error_description || 'Google token exchange failed');
    }
    setGoogleSession(res, {
      accessToken: token.access_token,
      refreshToken: token.refresh_token || readGoogleSession(req)?.refreshToken,
      expiresAt: Date.now() + (token.expires_in || 3600) * 1000,
      scope: token.scope
    });
    const existing = res.getHeader('Set-Cookie');
    const cookies = Array.isArray(existing) ? existing : existing ? [String(existing)] : [];
    res.setHeader('Set-Cookie', [...cookies, clearCookieHeader(GOOGLE_STATE_COOKIE)]);
    return res.redirect(302, `${requestOrigin(req)}${safeReturnTo(state.returnTo)}`);
  } catch (error) {
    console.error('[OAuth] Google callback failed:', error);
    return res.status(502).send('Google authorization failed. Please return to LIMS and try again.');
  }
}
