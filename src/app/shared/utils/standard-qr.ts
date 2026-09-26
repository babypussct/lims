export function buildStandardQrPayload(origin: string, standardId: string): string {
  const normalizedOrigin = origin.replace(/\/+$/, '');
  return `${normalizedOrigin}/#/standards/${encodeURIComponent(standardId)}`;
}

export async function createStandardQrDataUrl(
  origin: string,
  standardId: string,
  size = 150
): Promise<string> {
  const QRCode = await import('qrcode');
  return QRCode.toDataURL(buildStandardQrPayload(origin, standardId), {
    width: size,
    margin: 1,
    errorCorrectionLevel: 'M',
  });
}
