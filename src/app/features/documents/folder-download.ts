import type { DriveItem } from './document-viewer.models';

const FOLDER_MIME = 'application/vnd.google-apps.folder';
const MAX_FILES = 1000;
const MAX_BYTES = 250 * 1024 * 1024;

interface DriveReader {
  getFolderContents(folderId: string, signal?: AbortSignal): Promise<DriveItem[]>;
  downloadFile(fileId: string, signal?: AbortSignal): Promise<Blob>;
  exportFile(fileId: string, mimeType: string, signal?: AbortSignal): Promise<Blob>;
}

interface ArchiveEntry { item: DriveItem; path: string }

function safeName(name: string): string {
  const cleaned = name.replace(/[\\/\u0000-\u001f<>:"|?*]/g, '_').replace(/^[. _]+|[. ]+$/g, '').trim();
  return cleaned && cleaned !== '.' && cleaned !== '..' ? cleaned : 'Không tên';
}

function uniqueName(name: string, used: Set<string>): string {
  const extensionIndex = name.lastIndexOf('.');
  const stem = extensionIndex > 0 ? name.slice(0, extensionIndex) : name;
  const extension = extensionIndex > 0 ? name.slice(extensionIndex) : '';
  let candidate = name;
  let suffix = 2;
  while (used.has(candidate.toLocaleLowerCase())) {
    candidate = `${stem} (${suffix++})${extension}`;
  }
  used.add(candidate.toLocaleLowerCase());
  return candidate;
}

function exportFormat(item: DriveItem): { mimeType: string; extension: string } | null {
  switch (item.mimeType) {
    case 'application/vnd.google-apps.document':
      return { mimeType: 'application/pdf', extension: '.pdf' };
    case 'application/vnd.google-apps.spreadsheet':
      return { mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', extension: '.xlsx' };
    case 'application/vnd.google-apps.presentation':
      return { mimeType: 'application/pdf', extension: '.pdf' };
    default:
      return null;
  }
}

/** Build a complete archive in the browser; any failed file aborts the whole download. */
export async function createFolderZip(
  folder: Pick<DriveItem, 'id' | 'name'>,
  drive: DriveReader,
  signal: AbortSignal,
  onProgress: (message: string) => void,
): Promise<Blob> {
  const folders: string[] = [];
  const files: ArchiveEntry[] = [];
  const root = `${safeName(folder.name)}/`;
  const visited = new Set<string>();

  async function collect(folderId: string, path: string): Promise<void> {
    signal.throwIfAborted();
    if (visited.has(folderId)) throw new Error('Thư mục Google Drive có liên kết lặp.');
    visited.add(folderId);
    folders.push(path);
    onProgress(`Đang đọc thư mục: ${path}`);
    const children = await drive.getFolderContents(folderId, signal);
    const used = new Set<string>();
    for (const child of children) {
      signal.throwIfAborted();
      const format = exportFormat(child);
      if (child.mimeType.startsWith('application/vnd.google-apps.') && child.mimeType !== FOLDER_MIME && !format) {
        throw new Error(`Không hỗ trợ tải tệp Google Drive: ${child.name}`);
      }
      const rawName = safeName(child.name) + (format ? format.extension : '');
      const name = uniqueName(rawName, used);
      if (child.mimeType === FOLDER_MIME) {
        await collect(child.id, `${path}${name}/`);
      } else {
        files.push({ item: child, path: `${path}${name}` });
        if (files.length > MAX_FILES) throw new Error(`Thư mục vượt quá ${MAX_FILES} tệp. Hãy tải từng thư mục con.`);
      }
    }
  }

  await collect(folder.id, root);
  const contents: Record<string, Uint8Array<ArrayBuffer>> = {};
  for (const path of folders) contents[path] = new Uint8Array();
  let bytes = 0;
  for (const [index, { item, path }] of files.entries()) {
    signal.throwIfAborted();
    onProgress(`Đang tải tệp ${index + 1}/${files.length}: ${item.name}`);
    const format = exportFormat(item);
    let blob: Blob;
    try {
      blob = format
        ? await drive.exportFile(item.id, format.mimeType, signal)
        : await drive.downloadFile(item.id, signal);
    } catch (error) {
      if (signal.aborted) throw error;
      const detail = error instanceof Error ? error.message : 'Lỗi không xác định';
      throw new Error(`Không thể tải "${item.name}": ${detail}`);
    }
    bytes += blob.size;
    if (bytes > MAX_BYTES) throw new Error('Thư mục vượt quá 250 MB. Hãy tải từng thư mục con.');
    contents[path] = new Uint8Array(await blob.arrayBuffer());
  }
  signal.throwIfAborted();
  onProgress('Đang tạo tệp ZIP...');
  const { zip } = await import('fflate');
  const archive = await new Promise<Uint8Array<ArrayBuffer>>((resolve, reject) => {
    zip(contents, { level: 0 }, (error, data) => error ? reject(error) : resolve(data));
  });
  signal.throwIfAborted();
  return new Blob([archive], { type: 'application/zip' });
}

export function folderZipFileName(name: string): string {
  return `${safeName(name)}.zip`;
}
