const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');

const vercelConfig = JSON.parse(readFileSync(join(__dirname, '..', 'vercel.json'), 'utf8'));

function appSecurityHeaders() {
  const route = vercelConfig.headers.find(item => item.source === '/((?!__/auth/|__/firebase/).*)');
  assert.ok(route, 'the app security-header route must exist');
  return Object.fromEntries(route.headers.map(header => [header.key, header.value]));
}

test('publishes browser security headers without applying them to Firebase auth rewrites', () => {
  const headers = appSecurityHeaders();

  assert.equal(headers['Referrer-Policy'], 'strict-origin-when-cross-origin');
  assert.equal(
    headers['Permissions-Policy'],
    'camera=(self), microphone=(), geolocation=(), payment=(), usb=(), accelerometer=(), gyroscope=(), magnetometer=()'
  );
  assert.equal(headers['Strict-Transport-Security'], 'max-age=63072000; includeSubDomains; preload');
});
