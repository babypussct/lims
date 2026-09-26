import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const source = readFileSync(resolve(process.cwd(), 'src/app/shared/utils/external-script-loader.ts'), 'utf8');

test('QR rendering is bundled from npm and does not inject a CDN script', () => {
  assert.match(source, /import\('qrcode'\)/);
  assert.match(source, /QRCode\.toCanvas/);
  assert.doesNotMatch(source, /cdnjs|createElement\('script'\)|appendChild\(script\)/);
});
