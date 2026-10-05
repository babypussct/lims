import assert from 'node:assert/strict';
import test from 'node:test';
import { crc32, deflateRawSync } from 'node:zlib';
import * as XLSX from 'xlsx';
import {
  readWithStrippedFallback,
  shouldStripXlsxEntry,
  stripXlsxMedia
} from './xlsx-media-stripper';

interface ZipEntry { name: string; data: Uint8Array }
interface ZipOptions { compress?: boolean; descriptor?: boolean; descriptorSignature?: boolean; }

/** Minimal ZIP writer so tests control compression and data descriptors explicitly. */
function buildZip(entries: ZipEntry[], opts: ZipOptions = {}): ArrayBuffer {
  const chunks: Buffer[] = [];
  const central: Buffer[] = [];
  let offset = 0;
  for (const entry of entries) {
    const name = Buffer.from(entry.name, 'utf8');
    const raw = Buffer.from(entry.data);
    const data = opts.compress ? deflateRawSync(raw) : raw;
    const method = opts.compress ? 8 : 0;
    const crc = crc32(raw) >>> 0;
    const flags = opts.descriptor ? 0x08 : 0;

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(flags, 6);
    local.writeUInt16LE(method, 8);
    local.writeUInt32LE(opts.descriptor ? 0 : crc, 14);
    local.writeUInt32LE(opts.descriptor ? 0 : data.length, 18);
    local.writeUInt32LE(opts.descriptor ? 0 : raw.length, 22);
    local.writeUInt16LE(name.length, 26);
    const parts = [local, name, data];
    if (opts.descriptor) {
      const sig = opts.descriptorSignature !== false;
      const desc = Buffer.alloc(sig ? 16 : 12);
      let o = 0;
      if (sig) { desc.writeUInt32LE(0x08074b50, 0); o = 4; }
      desc.writeUInt32LE(crc, o);
      desc.writeUInt32LE(data.length, o + 4);
      desc.writeUInt32LE(raw.length, o + 8);
      parts.push(desc);
    }
    const record = Buffer.concat(parts);

    const cd = Buffer.alloc(46);
    cd.writeUInt32LE(0x02014b50, 0);
    cd.writeUInt16LE(20, 4);
    cd.writeUInt16LE(20, 6);
    cd.writeUInt16LE(flags, 8);
    cd.writeUInt16LE(method, 10);
    cd.writeUInt32LE(crc, 16);
    cd.writeUInt32LE(data.length, 20);
    cd.writeUInt32LE(raw.length, 24);
    cd.writeUInt16LE(name.length, 28);
    cd.writeUInt32LE(offset, 42);
    central.push(Buffer.concat([cd, name]));

    chunks.push(record);
    offset += record.length;
  }
  const cdBuf = Buffer.concat(central);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(cdBuf.length, 12);
  eocd.writeUInt32LE(offset, 16);
  const out = Buffer.concat([...chunks, cdBuf, eocd]);
  return out.buffer.slice(out.byteOffset, out.byteOffset + out.byteLength) as ArrayBuffer;
}

/** Real SheetJS workbook parts plus a drawing + relationships + images like a MassHunter report. */
function reportEntries(withImages = true): ZipEntry[] {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([['Sample', 'Final Conc.'], ['S1', 0.123]]), 'Bifenthrin');
  const raw = new Uint8Array(XLSX.write(wb, { type: 'array', bookType: 'xlsx' }) as ArrayBuffer);
  const cfb = XLSX.CFB.read(raw, { type: 'array' });
  const entries: ZipEntry[] = [];
  cfb.FileIndex.forEach((file, i) => {
    if (file.type !== 2 || !file.content) return;
    const name = cfb.FullPaths[i].replace(/^[^/]*\//, '');
    let data = Uint8Array.from(file.content as ArrayLike<number>);
    if (withImages && name === '[Content_Types].xml') {
      data = new TextEncoder().encode(new TextDecoder().decode(data).replace(
        '<Default ',
        '<Default Extension="png" ContentType="image/png"/><Override PartName="/xl/drawings/drawing1.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/><Default '
      ));
    }
    if (withImages && name === 'xl/worksheets/sheet1.xml') {
      let xml = new TextDecoder().decode(data);
      if (!/xmlns:r=/.test(xml)) {
        xml = xml.replace('<worksheet ', '<worksheet xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" ');
      }
      xml = xml.replace('</worksheet>', '<drawing r:id="rId1"/></worksheet>');
      data = new TextEncoder().encode(xml);
    }
    entries.push({ name, data });
  });
  if (!withImages) return entries;

  const enc = new TextEncoder();
  const image = new Uint8Array(200_000).map((_, i) => (i * 7919) % 251);
  entries.push(
    { name: 'xl/worksheets/_rels/sheet1.xml.rels', data: enc.encode('<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing" Target="../drawings/drawing1.xml"/></Relationships>') },
    { name: 'xl/drawings/drawing1.xml', data: enc.encode('<?xml version="1.0"?><xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><xdr:oneCellAnchor><xdr:from><xdr:col>3</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>1</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:from><xdr:ext cx="100" cy="100"/><xdr:pic><xdr:nvPicPr><xdr:cNvPr id="2" name="Chromatogram"/><xdr:cNvPicPr/></xdr:nvPicPr><xdr:blipFill><a:blip r:embed="rId1"/></xdr:blipFill><xdr:spPr/></xdr:pic><xdr:clientData/></xdr:oneCellAnchor></xdr:wsDr>') },
    { name: 'xl/drawings/_rels/drawing1.xml.rels', data: enc.encode('<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/image1.png"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/image2.png"/></Relationships>') },
    { name: 'xl/media/image1.png', data: image },
    { name: 'xl/media/image2.png', data: image },
    { name: 'xl/printerSettings/printerSettings1.bin', data: new Uint8Array(1000) }
  );
  return entries;
}

function assertReadable(buffer: ArrayBuffer): void {
  const wb = XLSX.read(buffer, { type: 'array' });
  assert.deepEqual(wb.SheetNames, ['Bifenthrin']);
  assert.equal(wb.Sheets['Bifenthrin']['A2'].v, 'S1');
  assert.equal(wb.Sheets['Bifenthrin']['B2'].v, 0.123);
}

function entryNames(buffer: ArrayBuffer): string[] {
  const cfb = XLSX.CFB.read(new Uint8Array(buffer), { type: 'array' });
  return cfb.FileIndex.map((f, i) => (f.type === 2 ? cfb.FullPaths[i].replace(/^[^/]*\//, '') : '')).filter(Boolean);
}

test('shouldStripXlsxEntry targets only known attachment folders', () => {
  assert.equal(shouldStripXlsxEntry('xl/media/image1.png'), true);
  assert.equal(shouldStripXlsxEntry('xl/embeddings/oleObject1.bin'), true);
  assert.equal(shouldStripXlsxEntry('xl/printerSettings/printerSettings1.bin'), true);
  assert.equal(shouldStripXlsxEntry('docProps/thumbnail.jpeg'), true);
  assert.equal(shouldStripXlsxEntry('xl/worksheets/sheet1.xml'), false);
  assert.equal(shouldStripXlsxEntry('xl/worksheets/sheet1.bin'), false);
  assert.equal(shouldStripXlsxEntry('xl/workbook.bin'), false);
  assert.equal(shouldStripXlsxEntry('xl/vbaProject.bin'), false);
  assert.equal(shouldStripXlsxEntry('xl/drawings/drawing1.xml'), false);
  assert.equal(shouldStripXlsxEntry('[Content_Types].xml'), false);
});

for (const [label, opts] of [
  ['stored', {}],
  ['deflated', { compress: true }],
  ['deflated + data descriptor with signature', { compress: true, descriptor: true }],
  ['deflated + data descriptor without signature', { compress: true, descriptor: true, descriptorSignature: false }]
] as [string, ZipOptions][]) {
  test(`report with drawing/relationships (${label}): images removed, results intact`, () => {
    const source = buildZip(reportEntries(), opts);
    assertReadable(source); // fixture sanity
    const result = stripXlsxMedia(source);
    assert.equal(result.strippedEntries, 3);
    assert.ok(result.buffer.byteLength < source.byteLength - 100_000 || opts.compress);
    assert.notEqual(result.buffer, source);
    assertReadable(result.buffer);
    const names = entryNames(result.buffer);
    assert.ok(names.includes('xl/drawings/drawing1.xml'));
    assert.ok(names.includes('xl/worksheets/_rels/sheet1.xml.rels'));
    assert.ok(!names.some(n => n.startsWith('xl/media/') || n.startsWith('xl/printerSettings/')));
    for (const buffer of [source, result.buffer]) {
      const cfb = XLSX.CFB.read(new Uint8Array(buffer), { type: 'array' });
      const idx = cfb.FullPaths.findIndex(p => p.replace(/^[^/]*\//, '') === 'xl/worksheets/sheet1.xml');
      assert.ok(idx >= 0, 'sheet1.xml present');
      const xml = new TextDecoder().decode(Uint8Array.from(cfb.FileIndex[idx].content as ArrayLike<number>));
      assert.match(xml, /xmlns:r="http:\/\/schemas\.openxmlformats\.org\/officeDocument\/2006\/relationships"/);
      assert.match(xml, /<drawing r:id="rId1"\/>/);
    }
  });
}

test('workbook without attachments is returned untouched', () => {
  const source = buildZip(reportEntries(false), { compress: true });
  const result = stripXlsxMedia(source);
  assert.equal(result.buffer, source);
  assert.equal(result.strippedEntries, 0);
});

test('non-XLSX package (XLSB-like) is returned untouched', () => {
  const entries = reportEntries().map(e => e.name === 'xl/workbook.xml' ? { ...e, name: 'xl/workbook.bin' } : e);
  const source = buildZip(entries);
  assert.equal(stripXlsxMedia(source).buffer, source);
});

test('legacy .xls / non-zip input is returned untouched', () => {
  const buffer = new Uint8Array([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1, 1, 2, 3]).buffer;
  assert.equal(stripXlsxMedia(buffer).buffer, buffer);
});

function mutate(source: ArrayBuffer, fn: (view: DataView, bytes: Uint8Array) => void): ArrayBuffer {
  const copy = source.slice(0);
  fn(new DataView(copy), new Uint8Array(copy));
  return copy;
}

function eocdOffset(view: DataView): number {
  for (let i = view.byteLength - 22; i >= 0; i--) if (view.getUint32(i, true) === 0x06054b50) return i;
  throw new Error('no eocd');
}

test('malformed / unsupported archives fall back to original buffer', () => {
  const source = buildZip(reportEntries(), { compress: true });
  const cases: Record<string, ArrayBuffer> = {
    zip64Marker: mutate(source, v => { const e = eocdOffset(v); v.setUint16(e + 8, 0xffff, true); v.setUint16(e + 10, 0xffff, true); }),
    multiDisk: mutate(source, v => v.setUint16(eocdOffset(v) + 4, 1, true)),
    commentLengthMismatch: mutate(source, v => v.setUint16(eocdOffset(v) + 20, 5, true)),
    cdOffsetWrong: mutate(source, v => { const e = eocdOffset(v); v.setUint32(e + 16, v.getUint32(e + 16, true) + 1, true); }),
    localNameMismatch: mutate(source, (_v, b) => { b[30] ^= 0x01; }),
    localSizeMismatch: mutate(source, v => v.setUint32(18, v.getUint32(18, true) + 1, true)),
    localUncompressedSizeMismatch: mutate(source, v => v.setUint32(22, v.getUint32(22, true) + 1, true)),
    descriptorUncompressedSizeMismatch: mutate(buildZip(reportEntries(), { compress: true, descriptor: true }), v => {
      let pos = 30;
      while (v.getUint32(pos, true) !== 0x08074b50) pos++;
      v.setUint32(pos + 12, v.getUint32(pos + 12, true) + 1, true);
    }),
    encryptedFlag: mutate(source, v => { v.setUint16(6, 1, true); }),
    truncated: source.slice(0, source.byteLength - 10)
  };
  for (const [name, buffer] of Object.entries(cases)) {
    const result = stripXlsxMedia(buffer);
    assert.equal(result.buffer, buffer, `${name} should be untouched`);
    assert.equal(result.strippedEntries, 0, name);
  }
});

test('readWithStrippedFallback retries with original when filtered read throws', () => {
  const original = new ArrayBuffer(4);
  const filtered = new ArrayBuffer(2);
  const seen: ArrayBuffer[] = [];
  const out = readWithStrippedFallback(original, { buffer: filtered, strippedEntries: 1, strippedBytes: 1 }, buf => {
    seen.push(buf);
    if (buf === filtered) throw new Error('boom');
    return 'ok';
  });
  assert.equal(out, 'ok');
  assert.deepEqual(seen, [filtered, original]);
});

test('readWithStrippedFallback propagates error from original read', () => {
  const original = new ArrayBuffer(4);
  assert.throws(() => readWithStrippedFallback(original, { buffer: original, strippedEntries: 0, strippedBytes: 0 }, () => {
    throw new Error('bad file');
  }), /bad file/);
});
