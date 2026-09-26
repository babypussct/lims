export async function ensureQrious(): Promise<any> {
  const QRCode = await import('qrcode');

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
