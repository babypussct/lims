import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { decryptBackupPayload, encryptBackupPayload, sha256, type BackupKey } from './backup-crypto.js';

const key: BackupKey = { keyId: 'test-key', key: Buffer.alloc(32, 7) };

describe('LIMS backup crypto', () => {
  it('round-trips compressed and uncompressed payloads', () => {
    const source = Buffer.from('LIMS backup payload có Timestamp và dữ liệu Drive.', 'utf8');
    const compressed = encryptBackupPayload(source, key, true);
    const plain = encryptBackupPayload(source, key, false);
    assert.deepEqual(decryptBackupPayload(compressed, key), source);
    assert.deepEqual(decryptBackupPayload(plain, key), source);
    assert.equal(sha256(decryptBackupPayload(compressed, key)), sha256(source));
  });

  it('rejects tampered ciphertext and the wrong key', () => {
    const encrypted = encryptBackupPayload(Buffer.from('integrity'), key);
    const tampered = Buffer.from(encrypted);
    tampered[tampered.length - 1] ^= 0xff;
    assert.throws(() => decryptBackupPayload(tampered, key));
    assert.throws(() => decryptBackupPayload(encrypted, { keyId: 'other', key: Buffer.alloc(32, 8) }));
  });
});
