import { encryptBackupPayload, sha256, type BackupKey } from './backup-crypto.js';
import type { BackupPartManifest } from './backup-contract.js';
import { stableJson } from './firestore-backup.js';
import { DriveBackupClient } from './backup-drive.js';

export interface PartWriterOptions {
  client: DriveBackupClient;
  key: BackupKey;
  parentId: string;
  category: BackupPartManifest['category'];
  partPrefix: string;
  maxPlaintextBytes?: number;
  initialPartIndex?: number;
  onPart?: (part: BackupPartManifest) => void;
}
export class EncryptedNdjsonPartWriter {
  private readonly maxPlaintextBytes: number;
  private lines: string[] = [];
  private plaintextBytes = 0;
  private recordCount = 0;
  private partIndex: number;

  constructor(private readonly options: PartWriterOptions) {
    this.maxPlaintextBytes = options.maxPlaintextBytes || 900_000;
    this.partIndex = options.initialPartIndex || 0;
  }

  async append(value: unknown): Promise<void> {
    const line = `${stableJson(value)}\n`;
    const bytes = Buffer.byteLength(line, 'utf8');
    if (this.lines.length > 0 && this.plaintextBytes + bytes > this.maxPlaintextBytes) await this.flush();
    this.lines.push(line);
    this.plaintextBytes += bytes;
    this.recordCount++;
  }

  async flush(): Promise<BackupPartManifest | null> {
    if (this.lines.length === 0) return null;
    const plaintext = Buffer.from(this.lines.join(''), 'utf8');
    const ciphertext = encryptBackupPayload(plaintext, this.options.key);
    const name = `${this.options.partPrefix}-${String(this.partIndex++).padStart(5, '0')}.ndjson.enc`;
    const uploaded = await this.options.client.uploadBytes(name, 'application/octet-stream', this.options.parentId, ciphertext);
    const part: BackupPartManifest = {
      name,
      driveFileId: uploaded.id,
      category: this.options.category,
      recordCount: this.recordCount,
      plaintextBytes: plaintext.byteLength,
      ciphertextBytes: ciphertext.byteLength,
      plaintextSha256: sha256(plaintext),
      ciphertextSha256: sha256(ciphertext),
    };
    this.options.onPart?.(part);
    this.lines = [];
    this.plaintextBytes = 0;
    this.recordCount = 0;
    return part;
  }

  async finish(): Promise<BackupPartManifest[]> {
    const result: BackupPartManifest[] = [];
    const previous = this.options.onPart;
    this.options.onPart = part => {
      result.push(part);
      previous?.(part);
    };
    await this.flush();
    return result;
  }
}
