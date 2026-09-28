const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync, readdirSync } = require('node:fs');
const { join } = require('node:path');

const vercelConfig = JSON.parse(readFileSync(join(__dirname, '..', 'vercel.json'), 'utf8'));

function appSecurityHeaders() {
  const route = vercelConfig.headers.find(item => item.source === '/((?!__/auth/|__/firebase/).*)');
  assert.ok(route, 'the app security-header route must exist');
  return Object.fromEntries(route.headers.map(header => [header.key, header.value]));
}

function collectRuntimeSourceFiles(directory) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const absolutePath = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectRuntimeSourceFiles(absolutePath));
      continue;
    }

    if (!/\.(?:ts|html|css|js)$/.test(entry.name)) continue;
    if (/\.(?:test|spec)\.ts$/.test(entry.name)) continue;
    files.push(absolutePath);
  }
  return files;
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
  assert.match(csp, /img-src 'self' data: blob:/);
  assert.match(csp, /media-src 'self' blob:/);
  assert.match(csp, /frame-src 'self' blob:/);
  assert.match(csp, /worker-src 'self' blob:/);
  assert.doesNotMatch(csp, /'unsafe-eval'/);
  assert.doesNotMatch(csp, /script-src[^;]*'unsafe-inline'/);
  assert.doesNotMatch(csp, /fonts\.googleapis\.com|fonts\.gstatic\.com|cdnjs\.cloudflare\.com|api\.dicebear\.com/);
});

test('runtime source does not reintroduce remote font, icon, or avatar dependencies removed for CSP', () => {
  const root = join(__dirname, '..');
  const runtimeSource = [join(root, 'src'), join(root, 'public')]
    .flatMap(collectRuntimeSourceFiles)
    .map(file => readFileSync(file, 'utf8'))
    .join('\n');

  assert.doesNotMatch(
    runtimeSource,
    /fonts\.googleapis\.com|fonts\.gstatic\.com|cdnjs\.cloudflare\.com|api\.dicebear\.com/
  );
});
