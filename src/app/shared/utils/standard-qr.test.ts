import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { resolve, join, dirname, basename } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import { PNG } from 'pngjs';
import test from 'node:test';
import { buildStandardQrPayload } from './standard-qr';
import { loadQrCode, resolveQrCodeModule } from './qr-code';

test('QR loader resolves namespace, default and mixed CommonJS export shapes', async () => {
  const api = await loadQrCode();
  assert.equal(typeof api.toDataURL, 'function');
  assert.equal(resolveQrCodeModule(api), api);
  assert.equal(resolveQrCodeModule({ default: api }), api);
  assert.equal(resolveQrCodeModule({ toDataURL: undefined, default: api }), api);
  assert.equal(resolveQrCodeModule({ toCanvas() {}, default: api }), api);
  for (const invalid of [undefined, null, {}, { default: {} }, { toDataURL() {} }]) {
    assert.throws(() => resolveQrCodeModule(invalid), /required renderers/);
  }
});

test('minified browser chunks render QR PNGs through the real standard data URL and canvas paths', async () => {
  const output = mkdtempSync(join(tmpdir(), 'lims-qr-browser-'));
  const originalDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
  const createCanvas = () => {
    let pixels: Uint8ClampedArray;
    return {
      width: 0, height: 0, style: {},
      getContext: () => ({
        createImageData: (width: number, height: number) => ({ data: new Uint8ClampedArray(width * height * 4) }),
        clearRect() {},
        putImageData: (image: { data: Uint8ClampedArray }) => { pixels = image.data; },
      }),
      toDataURL() {
        return 'data:image/png;base64,' + PNG.sync.write({ width: this.width, height: this.height, data: Buffer.from(pixels) }).toString('base64');
      },
    };
  };
  try {
    await build({
      entryPoints: {
        standard: resolve('src/app/shared/utils/standard-qr.ts'),
        canvas: resolve('src/app/shared/utils/external-script-loader.ts'),
        library: resolve('src/app/shared/utils/qr-code.ts'),
      },
      outdir: output, outExtension: { '.js': '.mjs' }, bundle: true, splitting: true,
      platform: 'browser', format: 'esm', minify: true, logLevel: 'silent',
    });
    Object.defineProperty(globalThis, 'document', { configurable: true, value: {
      createElement: (tag: string) => { assert.equal(tag, 'canvas'); return createCanvas(); },
    } });
    const standard = await import(pathToFileURL(join(output, 'standard.mjs')).href);
    for (const width of [120, 150, 320]) {
      const dataUrl = await standard.createStandardQrDataUrl('https://lims.example/', 'STD / 01', width);
      assert.match(dataUrl, /^data:image\/png;base64,/);
      const png = PNG.sync.read(Buffer.from(dataUrl.split(',')[1], 'base64'));
      assert.equal(png.width, width);
      assert.equal(png.height, width);
      assert.ok(png.data.some((value: number, index: number) => index % 4 === 0 && value === 0), 'QR contains dark modules');
      assert.ok(png.data.some((value: number, index: number) => index % 4 === 0 && value === 255), 'QR contains light modules');
    }
    const canvasModule = await import(pathToFileURL(join(output, 'canvas.mjs')).href);
    const QRious = await canvasModule.ensureQrious();
    const canvas = createCanvas();
    new QRious({ element: canvas, value: 'https://lims.example/#/standards/STD-01', size: 200 });
    await Promise.resolve();
    assert.equal(canvas.width, 200);
    assert.equal(PNG.sync.read(Buffer.from(canvas.toDataURL().split(',')[1], 'base64')).height, 200);
    const library = await import(pathToFileURL(join(output, 'library.mjs')).href);
    assert.ok((await library.loadQrCode()).create('LABEL-01').modules.size > 0, 'Label QR API is also callable');
  } finally {
    if (originalDocument) Object.defineProperty(globalThis, 'document', originalDocument);
    else Reflect.deleteProperty(globalThis, 'document');
    const cleanupPath = resolve(output);
    assert.equal(dirname(cleanupPath), resolve(tmpdir()));
    assert.ok(basename(cleanupPath).startsWith('lims-qr-browser-'));
    rmSync(cleanupPath, { recursive: true, force: true });
  }
});

test('standard QR payload always uses the canonical hash route and encodes ids', () => {
  assert.equal(
    buildStandardQrPayload('https://lims.example/', 'STD / 01'),
    'https://lims.example/#/standards/STD%20%2F%2001'
  );
  assert.equal(buildStandardQrPayload('https://lims.example', ' STD-01 '), 'https://lims.example/#/standards/%20STD-01%20');
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
