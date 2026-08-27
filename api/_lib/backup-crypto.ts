import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import { gzipSync, gunzipSync } from 'node:zlib';

const MAGIC = Buffer.from('LIMSBKP1', 'ascii');
const IV_BYTES = 12;
const TAG_BYTES = 16;

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value || !value.trim()) throw new Error(`${name} is not configured.`);
  return value.trim();
}
export interface BackupKey {
  keyId: string;
  key: Buffer;
}

export function backupEncryptionKey(): BackupKey {
  const raw = requiredEnv('LIMS_BACKUP_ENCRYPTION_KEY');
  const keyId = process.env['LIMS_BACKUP_ENCRYPTION_KEY_ID']?.trim() || 'primary';
  let key: Buffer;
  if (/^[0-9a-f]{64}$/i.test(raw)) {
    key = Buffer.from(raw, 'hex');
  } else {
    key = Buffer.from(raw, 'base64');
  }
  if (key.length !== 32) {
    throw new Error('LIMS_BACKUP_ENCRYPTION_KEY must contain exactly 32 bytes as hex or base64.');
  }
  return { keyId, key };
}

export function sha256(value: Uint8Array): string {
  return createHash('sha256').update(value).digest('hex');
}

export function encryptBackupPayload(plaintext: Uint8Array, key: BackupKey, compress = true): Buffer {
  const source = compress ? gzipSync(plaintext) : Buffer.from(plaintext);
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv('aes-256-gcm', key.key, iv);
  const ciphertext = Buffer.concat([cipher.update(source), cipher.final()]);
  const tag = cipher.getAuthTag();
  const flags = Buffer.from([compress ? 1 : 0]);
  return Buffer.concat([MAGIC, flags, iv, tag, ciphertext]);
}

export function decryptBackupPayload(payload: Uint8Array, key: BackupKey): Buffer {
  const packed = Buffer.from(payload);
  const headerBytes = MAGIC.length + 1 + IV_BYTES + TAG_BYTES;
  if (packed.length < headerBytes || !packed.subarray(0, MAGIC.length).equals(MAGIC)) {
    throw new Error('Invalid LIMS backup payload header.');
  }
  const compressed = packed[MAGIC.length] === 1;
  const ivStart = MAGIC.length + 1;
  const tagStart = ivStart + IV_BYTES;
  const ciphertextStart = tagStart + TAG_BYTES;
  const iv = packed.subarray(ivStart, tagStart);
  const tag = packed.subarray(tagStart, ciphertextStart);
  const ciphertext = packed.subarray(ciphertextStart);
  const decipher = createDecipheriv('aes-256-gcm', key.key, iv);
  decipher.setAuthTag(tag);
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return compressed ? gunzipSync(plaintext) : plaintext;
}
