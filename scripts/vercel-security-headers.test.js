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
  const csp = headers['Content-Security-Policy'];
  assert.ok(csp, 'Content-Security-Policy must be configured');
  assert.match(csp, /default-src 'self'/);
  assert.match(csp, /object-src 'none'/);
  assert.match(csp, /frame-ancestors 'none'/);
  assert.match(csp, /script-src 'self' https:\/\/accounts\.google\.com/);
  assert.match(csp, /worker-src 'self' blob:/);
  assert.doesNotMatch(csp, /'unsafe-eval'/);
  assert.doesNotMatch(csp, /script-src[^;]*'unsafe-inline'/);
  assert.doesNotMatch(csp, /fonts\.googleapis\.com|fonts\.gstatic\.com|cdnjs\.cloudflare\.com|api\.dicebear\.com/);
});
