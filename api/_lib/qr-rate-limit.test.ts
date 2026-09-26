import assert from 'node:assert/strict';
import test from 'node:test';
import { getQrClientFingerprint, isValidQrSessionId } from './qr-rate-limit.js';

test('QR session ids use the exact server-generated shape', () => {
  assert.equal(isValidQrSessionId('qr_0123456789abcdef0123456789abcdef'), true);
  assert.equal(isValidQrSessionId('qr_short'), false);
  assert.equal(isValidQrSessionId('qr_0123456789ABCDEF0123456789ABCDEF'), false);
  assert.equal(isValidQrSessionId('xx_0123456789abcdef0123456789abcdef'), false);
});

test('client fingerprint uses first forwarded address and never exposes raw address', () => {
  const first = getQrClientFingerprint({ 'x-forwarded-for': '203.0.113.8, 10.0.0.1' });
  const same = getQrClientFingerprint({ 'x-real-ip': '203.0.113.8' });
  assert.equal(first, same);
  assert.match(first, /^[a-f0-9]{32}$/);
  assert.doesNotMatch(first, /203\.0\.113\.8/);
});
