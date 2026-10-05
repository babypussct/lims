/**
 * Removes heavy attachment parts (chromatogram images, embedded objects,
 * thumbnails, printer settings) from an XLSX package before handing it to SheetJS.
 *
 * SheetJS inflates every ZIP entry eagerly, so MassHunter reports with dozens of
 * chromatogram PNGs spend most of their parse time on images that the result
 * import never uses. Entries are copied as raw compressed bytes (no re-deflate),
 * so the rebuild is a cheap memory copy.
 *
 * The filter only acts on packages that validate as a plain single-disk XLSX
 * ZIP. Anything it does not fully understand (ZIP64, multi-disk, inconsistent
 * headers, XLSB, legacy .xls) is returned untouched. Callers should still use
 * {@link readWithStrippedFallback} so that a SheetJS failure on the rebuilt
 * package retries with the original bytes.
 */

const SIG_LOCAL = 0x04034b50;
const SIG_CENTRAL = 0x02014b50;
const SIG_EOCD = 0x06054b50;
const SIG_DESCRIPTOR = 0x08074b50;

/** Only well-known attachment folders inside an XLSX package are dropped. */
const STRIPPED_ENTRY_PATTERNS: RegExp[] = [
  /^xl\/media\/[^/]+$/i,
  /^xl\/embeddings\/[^/]+$/i,
  /^xl\/printerSettings\/[^/]+$/i,
  /^docProps\/thumbnail\.[a-z0-9]+$/i
];

export interface XlsxStripResult {
  buffer: ArrayBuffer;
  /** Number of attachment parts removed (images, embedded objects, printer settings...). */
  strippedEntries: number;
  strippedBytes: number;
}

export function shouldStripXlsxEntry(name: string): boolean {
  return STRIPPED_ENTRY_PATTERNS.some(pattern => pattern.test(name));
}

export function stripXlsxMedia(source: ArrayBuffer): XlsxStripResult {
  const unchanged: XlsxStripResult = { buffer: source, strippedEntries: 0, strippedBytes: 0 };
  try {
    return stripInternal(source) ?? unchanged;
  } catch {
    return unchanged;
  }
}

/**
 * Runs `read` on the stripped package; if that throws, retries once on the
 * original bytes so an unexpected rebuild problem never blocks the import.
 */
export function readWithStrippedFallback<T>(
  original: ArrayBuffer,
  stripped: XlsxStripResult,
  read: (buffer: ArrayBuffer) => T
): T {
  if (stripped.buffer === original) return read(original);
  try {
    return read(stripped.buffer);
  } catch (error) {
    console.warn('[Excel result import] Reading filtered workbook failed, retrying with original file', error);
    return read(original);
  }
}

export function describeStrippedEntries(count: number): string {
  return `Đã bỏ qua ${count} thành phần đính kèm (hình sắc ký đồ, đối tượng nhúng...)`;
}

interface Entry { cdStart: number; cdLength: number; localStart: number; localLength: number; }

function stripInternal(source: ArrayBuffer): XlsxStripResult | null {
  const bytes = new Uint8Array(source);
  const view = new DataView(source);
  const size = bytes.length;
  if (size < 22 || view.getUint32(0, true) !== SIG_LOCAL) return null;

  // Locate End Of Central Directory whose comment length ends exactly at EOF.
  let eocd = -1;
  const minPos = Math.max(0, size - 22 - 0xffff);
  for (let i = size - 22; i >= minPos; i--) {
    if (view.getUint32(i, true) === SIG_EOCD && i + 22 + view.getUint16(i + 20, true) === size) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) return null;

  const diskNumber = view.getUint16(eocd + 4, true);
  const cdDisk = view.getUint16(eocd + 6, true);
  const entriesOnDisk = view.getUint16(eocd + 8, true);
  const totalEntries = view.getUint16(eocd + 10, true);
  const cdSize = view.getUint32(eocd + 12, true);
  const cdOffset = view.getUint32(eocd + 16, true);
  if (diskNumber !== 0 || cdDisk !== 0 || entriesOnDisk !== totalEntries) return null; // multi-disk
  if (totalEntries === 0 || totalEntries === 0xffff || cdSize === 0xffffffff || cdOffset === 0xffffffff) return null; // ZIP64
  if (cdOffset + cdSize !== eocd) return null;

  const kept: Entry[] = [];
  const decoder = new TextDecoder();
  const names = new Set<string>();
  let strippedEntries = 0;
  let strippedBytes = 0;
  let prevLocalEnd = 0;
  const localRanges: [number, number][] = [];

  let p = cdOffset;
  for (let n = 0; n < totalEntries; n++) {
    if (p + 46 > eocd || view.getUint32(p, true) !== SIG_CENTRAL) return null;
    const flags = view.getUint16(p + 8, true);
    const method = view.getUint16(p + 10, true);
    const crc = view.getUint32(p + 16, true);
    const compressedSize = view.getUint32(p + 20, true);
    const uncompressedSize = view.getUint32(p + 24, true);
    const nameLen = view.getUint16(p + 28, true);
    const extraLen = view.getUint16(p + 30, true);
    const commentLen = view.getUint16(p + 32, true);
    const startDisk = view.getUint16(p + 34, true);
    const localOffset = view.getUint32(p + 42, true);
    const cdLength = 46 + nameLen + extraLen + commentLen;

    if (flags & 0x01) return null; // encrypted
    if (startDisk !== 0) return null;
    if (compressedSize === 0xffffffff || uncompressedSize === 0xffffffff || localOffset === 0xffffffff) return null;
    if (p + cdLength > eocd) return null;

    const name = decoder.decode(bytes.subarray(p + 46, p + 46 + nameLen));
    if (!name || names.has(name)) return null;
    names.add(name);

    // Validate local header against central directory for every entry.
    if (localOffset + 30 > cdOffset || view.getUint32(localOffset, true) !== SIG_LOCAL) return null;
    const localFlags = view.getUint16(localOffset + 6, true);
    const localMethod = view.getUint16(localOffset + 8, true);
    const localNameLen = view.getUint16(localOffset + 26, true);
    const localExtraLen = view.getUint16(localOffset + 28, true);
    if (localMethod !== method || localNameLen !== nameLen || (localFlags & 0x09) !== (flags & 0x09)) return null;
    const localName = decoder.decode(bytes.subarray(localOffset + 30, localOffset + 30 + localNameLen));
    if (localName !== name) return null;

    let localLength = 30 + localNameLen + localExtraLen + compressedSize;
    if (flags & 0x08) {
      const descPos = localOffset + localLength;
      const hasSig = descPos + 16 <= cdOffset && view.getUint32(descPos, true) === SIG_DESCRIPTOR;
      const base = hasSig ? descPos + 4 : descPos;
      if (base + 12 > cdOffset) return null;
      if (
        view.getUint32(base, true) !== crc ||
        view.getUint32(base + 4, true) !== compressedSize ||
        view.getUint32(base + 8, true) !== uncompressedSize
      ) return null;
      localLength += hasSig ? 16 : 12;
    } else {
      if (
        view.getUint32(localOffset + 14, true) !== crc ||
        view.getUint32(localOffset + 18, true) !== compressedSize ||
        view.getUint32(localOffset + 22, true) !== uncompressedSize
      ) return null;
    }
    if (localOffset + localLength > cdOffset) return null;
    localRanges.push([localOffset, localOffset + localLength]);

    if (shouldStripXlsxEntry(name)) {
      strippedEntries++;
      strippedBytes += compressedSize;
    } else {
      kept.push({ cdStart: p, cdLength, localStart: localOffset, localLength });
    }
    p += cdLength;
  }
  if (p !== eocd) return null;

  // Local records must not overlap.
  localRanges.sort((a, b) => a[0] - b[0]);
  for (const [start, end] of localRanges) {
    if (start < prevLocalEnd) return null;
    prevLocalEnd = end;
  }

  // Only filter genuine XLSX packages (not XLSB / other OOXML).
  if (!names.has('[Content_Types].xml') || !names.has('xl/workbook.xml')) return null;
  if (strippedEntries === 0) return null;

  const localTotal = kept.reduce((sum, e) => sum + e.localLength, 0);
  const cdTotal = kept.reduce((sum, e) => sum + e.cdLength, 0);
  const out = new Uint8Array(localTotal + cdTotal + 22);
  const outView = new DataView(out.buffer);

  const newOffsets: number[] = [];
  let w = 0;
  for (const e of kept) {
    newOffsets.push(w);
    out.set(bytes.subarray(e.localStart, e.localStart + e.localLength), w);
    w += e.localLength;
  }
  const newCdOffset = w;
  kept.forEach((e, i) => {
    out.set(bytes.subarray(e.cdStart, e.cdStart + e.cdLength), w);
    outView.setUint32(w + 42, newOffsets[i], true);
    w += e.cdLength;
  });

  outView.setUint32(w, SIG_EOCD, true);
  outView.setUint16(w + 4, 0, true);
  outView.setUint16(w + 6, 0, true);
  outView.setUint16(w + 8, kept.length, true);
  outView.setUint16(w + 10, kept.length, true);
  outView.setUint32(w + 12, cdTotal, true);
  outView.setUint32(w + 16, newCdOffset, true);
  outView.setUint16(w + 20, 0, true);

  return { buffer: out.buffer, strippedEntries, strippedBytes };
}
