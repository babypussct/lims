import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import {
  createQrPollToken,
  hashQrPollToken,
  isValidQrPollToken,
  verifyQrPollTokenHash,
} from './qr-session-auth.js';

test('QR poll token validation rejects missing and malformed capabilities', () => {
  assert.equal(verifyQrPollTokenHash(undefined, undefined), false);
  assert.equal(verifyQrPollTokenHash('', ''), false);
  assert.equal(isValidQrPollToken('not-a-real-token'), false);
});

test('QR poll token verification rejects the wrong desktop capability', () => {
  const expected = createQrPollToken();
  const wrong = createQrPollToken();
  assert.equal(verifyQrPollTokenHash(wrong, hashQrPollToken(expected)), false);
});

test('QR poll token verification accepts the exact desktop capability', () => {
  const token = createQrPollToken();
  assert.equal(isValidQrPollToken(token), true);
  assert.equal(verifyQrPollTokenHash(token, hashQrPollToken(token)), true);
});

test('desktop-only poll token never enters the scannable QR payload', () => {
  const source = readFileSync(resolve(process.cwd(), 'src/app/features/auth/login.component.ts'), 'utf8');
  assert.match(source, /const qrData = \`LIMS_QR\|\$\{sessionId\}\|\$\{nonce\}\`/);
  const qrDataLine = source.split(/\r?\n/).find(line => line.includes('const qrData =')) || '';
  assert.doesNotMatch(qrDataLine, /pollToken/);
  assert.match(source, /'X-QR-Poll-Token': this\.currentPollToken/);
});
