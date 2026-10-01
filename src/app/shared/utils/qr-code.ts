export type QrCodeApi = Pick<typeof import('qrcode'), 'create' | 'toCanvas' | 'toDataURL'>;

/** Normalize the CommonJS namespace emitted by both Node and browser bundlers. */
export function resolveQrCodeModule(module: unknown): QrCodeApi {
  const namespace = module as (Partial<QrCodeApi> & { default?: Partial<QrCodeApi> }) | null;
  for (const api of [namespace, namespace?.default]) {
    if (api && typeof api.create === 'function' && typeof api.toCanvas === 'function' && typeof api.toDataURL === 'function') {
      return api as QrCodeApi;
    }
  }
  throw new TypeError('QR library does not expose the required renderers.');
}

export async function loadQrCode(): Promise<QrCodeApi> {
  return resolveQrCodeModule(await import('qrcode'));
}
