import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const GOOGLE_SESSION_COOKIE = 'lims_google_oauth';
export const GOOGLE_STATE_COOKIE = 'lims_google_oauth_state';
export const DRIVE_SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.readonly'
].join(' ');

export interface GoogleSession {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
  scope?: string;
}

export interface OAuthState {
  nonce: string;
  verifier: string;
  returnTo: string;
  createdAt: number;
}

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

export function oauthClientId(): string {
  const configured = process.env['GOOGLE_OAUTH_CLIENT_ID'] ||
    '659051444640-bcal7vcjb9dd5m9aim5to7su4nk9kdtg.apps.googleusercontent.com';
  const clientId = configured.trim().replace(/^https?:\/\//i, '').replace(/\/+$/, '');
  if (!/^[a-z0-9-]+\.apps\.googleusercontent\.com$/i.test(clientId)) {
    throw new Error('GOOGLE_OAUTH_CLIENT_ID is invalid');
  }
  return clientId;
}

export function oauthClientSecret(): string {
  return requiredEnv('GOOGLE_OAUTH_CLIENT_SECRET');
}

function encryptionKey(): Buffer {
  return createHash('sha256').update(requiredEnv('OAUTH_COOKIE_SECRET')).digest();
}

export function encryptCookie(value: unknown): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', encryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(value), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString('base64url');
}

export function decryptCookie<T>(value?: string): T | null {
  if (!value) return null;
  try {
    const packed = Buffer.from(value, 'base64url');
    if (packed.length < 29) return null;
    const iv = packed.subarray(0, 12);
    const tag = packed.subarray(12, 28);
    const encrypted = packed.subarray(28);
    const decipher = createDecipheriv('aes-256-gcm', encryptionKey(), iv);
    decipher.setAuthTag(tag);
    return JSON.parse(Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8')) as T;
  } catch {
    return null;
  }
}

export function readCookie(req: VercelRequest, name: string): string | undefined {
  const header = req.headers.cookie || '';
  for (const part of header.split(';')) {
    const index = part.indexOf('=');
    if (index < 0) continue;
    if (part.slice(0, index).trim() === name) return decodeURIComponent(part.slice(index + 1).trim());
  }
  return undefined;
}

export function cookieHeader(name: string, value: string, maxAge: number): string {
  return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}

export function clearCookieHeader(name: string): string {
  return `${name}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

export function requestOrigin(req: VercelRequest): string {
  const configured = process.env['APP_ORIGIN'];
  if (configured) return configured.replace(/\/$/, '');
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const proto = req.headers['x-forwarded-proto'] || 'https';
  if (!host) throw new Error('Cannot determine application origin');
  return `${proto}://${host}`;
}

export function callbackUrl(req: VercelRequest): string {
  return process.env['GOOGLE_OAUTH_REDIRECT_URI'] || `${requestOrigin(req)}/api/oauth/google/callback`;
}

export function safeReturnTo(value: unknown): string {
  const candidate = typeof value === 'string' ? value : '/';
  return candidate.startsWith('/') && !candidate.startsWith('//') && candidate.length <= 1500 ? candidate : '/';
}

export function codeChallenge(verifier: string): string {
  return createHash('sha256').update(verifier).digest('base64url');
}

export function setGoogleSession(res: VercelResponse, session: GoogleSession): void {
  res.setHeader('Set-Cookie', cookieHeader(GOOGLE_SESSION_COOKIE, encryptCookie(session), 30 * 24 * 60 * 60));
}

export function readGoogleSession(req: VercelRequest): GoogleSession | null {
  return decryptCookie<GoogleSession>(readCookie(req, GOOGLE_SESSION_COOKIE));
}

export async function getValidGoogleSession(
  req: VercelRequest,
  res: VercelResponse
): Promise<GoogleSession | null> {
  const session = readGoogleSession(req);
  if (!session) return null;
  if (session.expiresAt > Date.now() + 60_000) return session;
  if (!session.refreshToken) return null;

  const body = new URLSearchParams({
    client_id: oauthClientId(),
    client_secret: oauthClientSecret(),
    refresh_token: session.refreshToken,
    grant_type: 'refresh_token'
  });
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });
  if (!response.ok) return null;
  const token = await response.json() as { access_token: string; expires_in?: number; scope?: string };
  const refreshed: GoogleSession = {
    accessToken: token.access_token,
    refreshToken: session.refreshToken,
    expiresAt: Date.now() + (token.expires_in || 3600) * 1000,
    scope: token.scope || session.scope
  };
  setGoogleSession(res, refreshed);
  return refreshed;
}
