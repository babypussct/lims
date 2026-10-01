export async function ensureQrious(): Promise<any> {
  const QRCodeModule = await import('qrcode');
  // `qrcode` is CommonJS. Depending on Angular/esbuild interop, a production
  // chunk may expose the API directly on the namespace or under `default`.
  // Normalize both shapes before keeping the legacy QRious-compatible wrapper.
  const QRCode: any = typeof (QRCodeModule as any).toCanvas === 'function'
    ? QRCodeModule
    : (QRCodeModule as any).default;

  if (!QRCode || typeof QRCode.toCanvas !== 'function') {
    throw new TypeError('QR library does not expose a toCanvas renderer.');
  }

  // Compatibility wrapper for existing `new QRious({...})` call sites while
  // keeping the implementation bundled by Angular instead of loading code from CDN.
  return class QriousCompat {
    constructor(options: {
      element: HTMLCanvasElement;
      value: string;
      size?: number;
      level?: 'L' | 'M' | 'Q' | 'H';
    }) {
      void QRCode.toCanvas(options.element, options.value, {
        width: options.size || 200,
        errorCorrectionLevel: options.level || 'M'
      }).catch((error: unknown) => {
        console.error('[QR] Failed to render QR code:', error);
      });
    }
  };
}

export async function ensureHtml5Qrcode(): Promise<{ Html5Qrcode: any; Html5QrcodeSupportedFormats: any }> {
  // Dùng dynamic import từ npm (version pinned 2.3.8) thay vì CDN không ổn định
  const mod = await import('html5-qrcode');
  return {
    Html5Qrcode: mod.Html5Qrcode,
    Html5QrcodeSupportedFormats: mod.Html5QrcodeSupportedFormats
  };
}
