import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import type { IncomingHttpHeaders } from 'node:http';

const QR_POLL_TOKEN_BYTES = 32;
const QR_POLL_TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;
const SHA256_HEX_PATTERN = /^[a-f0-9]{64}$/;

export function createQrPollToken(): string {
  return randomBytes(QR_POLL_TOKEN_BYTES).toString('base64url');
}

export function hashQrPollToken(token: string): string {
  return createHash('sha256').update(token, 'utf8').digest('hex');
}

export function isValidQrPollToken(value: unknown): value is string {
  return typeof value === 'string' && QR_POLL_TOKEN_PATTERN.test(value);
}

export function readQrPollTokenHeader(headers: IncomingHttpHeaders): string | null {
  const raw = headers['x-qr-poll-token'];
  const value = Array.isArray(raw) ? raw[0] : raw;
  return isValidQrPollToken(value) ? value : null;
}

export function verifyQrPollTokenHash(token: unknown, expectedHash: unknown): boolean {
  if (!isValidQrPollToken(token) || typeof expectedHash !== 'string' || !SHA256_HEX_PATTERN.test(expectedHash)) {
    return false;
  }

  const actual = Buffer.from(hashQrPollToken(token), 'hex');
  const expected = Buffer.from(expectedHash, 'hex');
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
