import { randomBytes } from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  BACKUP_OAUTH_SCOPES,
  callbackUrl,
  codeChallenge,
  cookieHeader,
  encryptCookie,
  GOOGLE_STATE_COOKIE,
  oauthClientId,
  safeReturnTo,
  type OAuthState,
} from '../../_lib/google-oauth.js';

/** Start the administrator-only OAuth grant required to enumerate all Drive sources. */
export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });
  try {
    const state: OAuthState = {
      nonce: randomBytes(24).toString('base64url'),
      verifier: randomBytes(48).toString('base64url'),
      returnTo: safeReturnTo(req.query['returnTo']),
      createdAt: Date.now(),
    };
    res.setHeader('Set-Cookie', cookieHeader(GOOGLE_STATE_COOKIE, encryptCookie(state), 10 * 60));
    res.setHeader('Cache-Control', 'no-store');
    const params = new URLSearchParams({
      client_id: oauthClientId(),
      redirect_uri: callbackUrl(req),
      response_type: 'code',
      scope: BACKUP_OAUTH_SCOPES,
      state: state.nonce,
      code_challenge: codeChallenge(state.verifier),
      code_challenge_method: 'S256',
      access_type: 'offline',
      include_granted_scopes: 'true',
      prompt: 'consent select_account',
    });
    return res.redirect(302, `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
  } catch (error) {
    console.error('[OAuth] Cannot start backup Drive authorization:', error);
    return res.status(500).json({ error: 'Google backup OAuth is not configured on the server.' });
  }
}
