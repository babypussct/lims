import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import { buildStandardQrPayload } from './standard-qr';

test('standard QR payload always uses the canonical hash route and encodes ids', () => {
  assert.equal(
    buildStandardQrPayload('https://lims.example/', 'STD / 01'),
    'https://lims.example/#/standards/STD%20%2F%2001'
  );
});

test('standards UI no longer sends QR payloads to api.qrserver.com', () => {
  const files = [
    'src/app/features/standards/standards.component.ts',
    'src/app/features/standards/standard-detail.component.ts',
    'src/app/features/standards/components/standards-print-modal.component.ts',
    'vercel.json',
  ];
  for (const file of files) {
    assert.doesNotMatch(readFileSync(resolve(process.cwd(), file), 'utf8'), /api\.qrserver\.com/);
  }
});
