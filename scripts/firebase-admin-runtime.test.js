const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

test('Firebase Admin API dependencies load without Node ESM require interop', () => {
  // Vercel currently wraps TypeScript API functions as CommonJS. This flag
  // mirrors the runtime behavior that exposed firebase-admin 14 -> jose 6:
  // a CommonJS require must not depend on Node's optional ESM bridge.
  const result = spawnSync(
    process.execPath,
    [
      '--no-experimental-require-module',
      '-e',
      "require('firebase-admin/auth'); require('firebase-admin/firestore'); require('firebase-admin/messaging');"
    ],
    { encoding: 'utf8' }
  );

  assert.equal(
    result.status,
    0,
    `Firebase Admin imports must be CommonJS-loadable.\n${result.stderr || result.stdout}`
  );
});
