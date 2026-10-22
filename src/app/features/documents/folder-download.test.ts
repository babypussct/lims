import assert from 'node:assert/strict';
import test from 'node:test';
import { unzipSync, strFromU8 } from 'fflate';
import { createFolderZip, folderZipFileName } from './folder-download';
import type { DriveItem } from './document-viewer.models';

const folder = (id: string, name: string): DriveItem => ({ id, name, mimeType: 'application/vnd.google-apps.folder' });
const file = (id: string, name: string, mimeType = 'application/pdf'): DriveItem => ({ id, name, mimeType });

test('downloads nested folders, empty folders and Google files into one ZIP without overwriting duplicate names', async () => {
  const downloads: string[] = [];
  const exports: string[] = [];
  const drive = {
    async getFolderContents(id: string): Promise<DriveItem[]> {
      if (id === 'root') return [folder('child', 'Mẫu/2026'), folder('empty', 'Trống'), file('a', 'Phiếu.pdf'), file('b', 'phiếu.pdf')];
      if (id === 'child') return [file('sheet', 'Kết quả', 'application/vnd.google-apps.spreadsheet')];
      return [];
    },
    async downloadFile(id: string): Promise<Blob> {
      downloads.push(id);
      return new Blob([id]);
    },
    async exportFile(id: string, mimeType: string): Promise<Blob> {
      exports.push(`${id}:${mimeType}`);
      return new Blob(['xlsx']);
    },
  };
  const progress: string[] = [];
  const result = await createFolderZip(folder('root', 'Giao nhận'), drive, new AbortController().signal, message => progress.push(message));
  const entries = unzipSync(new Uint8Array(await result.arrayBuffer()));
  assert.deepEqual(Object.keys(entries).sort(), [
    'Giao nhận/', 'Giao nhận/Mẫu_2026/', 'Giao nhận/Mẫu_2026/Kết quả.xlsx',
    'Giao nhận/Trống/', 'Giao nhận/Phiếu.pdf', 'Giao nhận/phiếu (2).pdf',
  ].sort());
  assert.equal(strFromU8(entries['Giao nhận/Phiếu.pdf']), 'a');
  assert.equal(strFromU8(entries['Giao nhận/phiếu (2).pdf']), 'b');
  assert.equal(strFromU8(entries['Giao nhận/Mẫu_2026/Kết quả.xlsx']), 'xlsx');
  assert.deepEqual(downloads, ['a', 'b']);
  assert.deepEqual(exports, ['sheet:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']);
  assert.match(progress.at(-1) || '', /ZIP/);
  assert.equal(folderZipFileName('../Giao:nhận'), 'Giao_nhận.zip');
});

test('fails instead of silently producing an incomplete archive', async () => {
  const drive = {
    async getFolderContents(): Promise<DriveItem[]> { return [file('bad', 'Lỗi.pdf')]; },
    async downloadFile(): Promise<Blob> { throw new Error('Tải tệp thất bại'); },
    async exportFile(): Promise<Blob> { throw new Error('Unexpected export'); },
  };
  await assert.rejects(
    createFolderZip(folder('root', 'Giao nhận'), drive, new AbortController().signal, () => {}),
    /Không thể tải "Lỗi.pdf": Tải tệp thất bại/,
  );
});

test('cancellation stops before downloading a file', async () => {
  const controller = new AbortController();
  let downloaded = false;
  const drive = {
    async getFolderContents(): Promise<DriveItem[]> {
      controller.abort();
      return [file('a', 'A.pdf')];
    },
    async downloadFile(): Promise<Blob> {
      downloaded = true;
      return new Blob();
    },
    async exportFile(): Promise<Blob> { throw new Error('Unexpected export'); },
  };
  await assert.rejects(createFolderZip(folder('root', 'Giao nhận'), drive, controller.signal, () => {}), /aborted/i);
  assert.equal(downloaded, false);
});
