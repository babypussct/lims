import { createHash } from 'node:crypto';
import type { IncomingHttpHeaders } from 'node:http';
import type { Firestore } from 'firebase-admin/firestore';

export class QrRateLimitError extends Error {
  constructor(public readonly retryAfterSeconds: number) {
    super('QR API rate limit exceeded');
    this.name = 'QrRateLimitError';
  }
}

export function getQrClientFingerprint(headers: IncomingHttpHeaders): string {
  const forwarded = headers['x-forwarded-for'];
  const forwardedValue = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  const firstForwarded = forwardedValue?.split(',')[0]?.trim();
  const realIp = headers['x-real-ip'];
  const realIpValue = Array.isArray(realIp) ? realIp[0] : realIp;
  const clientAddress = firstForwarded || realIpValue?.trim() || 'unknown';
  return createHash('sha256').update(clientAddress).digest('hex').slice(0, 32);
}

export function isValidQrSessionId(value: unknown): value is string {
  return typeof value === 'string' && /^qr_[a-f0-9]{32}$/.test(value);
}

/**
 * Shared fixed-window limiter stored in Firestore so limits apply across Vercel
 * instances. The document contains only a one-way client fingerprint.
 */
export async function enforceQrRateLimit(options: {
  db: Firestore;
  appId: string;
  scope: 'create' | 'status' | 'cancel';
  headers: IncomingHttpHeaders;
  limit: number;
  windowMs: number;
  now?: number;
}): Promise<void> {
  const now = options.now ?? Date.now();
  const windowStart = Math.floor(now / options.windowMs) * options.windowMs;
  const fingerprint = getQrClientFingerprint(options.headers);
  const key = `qr_${options.scope}_${fingerprint}_${windowStart}`;
  const ref = options.db.doc(`artifacts/${options.appId}/security_rate_limits/${key}`);

  await options.db.runTransaction(async txn => {
    const snapshot = await txn.get(ref);
    const current = snapshot.exists ? Number(snapshot.data()?.['count'] || 0) : 0;
    if (current >= options.limit) {
      const retryAfterSeconds = Math.max(1, Math.ceil((windowStart + options.windowMs - now) / 1000));
      throw new QrRateLimitError(retryAfterSeconds);
    }

    txn.set(ref, {
      scope: options.scope,
      clientFingerprint: fingerprint,
      count: current + 1,
      windowStart,
      expiresAt: windowStart + options.windowMs * 2,
      updatedAt: now,
    }, { merge: true });
  });
}
