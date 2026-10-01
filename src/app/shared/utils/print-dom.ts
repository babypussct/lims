/** cloneNode does not copy a canvas bitmap (including QR codes). */
export function clonePrintContent<T extends HTMLElement>(source: T): T {
  const clone = source.cloneNode(true) as T;
  const canvases = clone.querySelectorAll('canvas');
  source.querySelectorAll('canvas').forEach((canvas, index) => {
    const target = canvases[index];
    const context = target?.getContext('2d');
    if (!context) throw new Error('Không sao chép được mã QR để in.');
    context.drawImage(canvas, 0, 0);
  });
  return clone;
}

export async function waitForPrintAssets(root: HTMLElement): Promise<void> {
  const fonts = root.ownerDocument.fonts?.ready ?? Promise.resolve();
  const images = Array.from(root.querySelectorAll('img')).map(async image => {
    if (image.dataset?.['printAsset'] === 'pending') {
      await new Promise<void>((resolve, reject) => {
        const finish = () => { clearTimeout(timer); image.removeEventListener('print-asset-ready', finish); resolve(); };
        const timer = setTimeout(() => { image.removeEventListener('print-asset-ready', finish); reject(new Error('Mã QR chưa sẵn sàng. Vui lòng thử lại.')); }, 15000);
        image.addEventListener('print-asset-ready', finish, { once: true });
      });
    }
    if (typeof image.decode === 'function') await image.decode();
    if (!image.complete || image.naturalWidth === 0) throw new Error('Có hình ảnh chưa tải được. Vui lòng thử lại.');
  });
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      Promise.all([fonts, ...images]),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error('Nội dung in chưa tải xong. Vui lòng thử lại.')), 15000);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

/** Keep content alive until the print dialog ends, including cancel/error/unmount. */
export function printWithCleanup(
  printWindow: Window,
  cleanup: () => void,
  signal?: AbortSignal,
  ownerWindow: Window = printWindow,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const media = printWindow.matchMedia('print');
    let finished = false;
    const windows = [...new Set([printWindow, ownerWindow])];
    const finish = (error?: unknown) => {
      if (finished) return;
      finished = true;
      windows.forEach(target => {
        target.removeEventListener('afterprint', afterPrint);
        target.removeEventListener('pagehide', afterPrint);
      });
      ownerWindow.removeEventListener('focus', regainFocus);
      media.removeEventListener('change', mediaChanged);
      signal?.removeEventListener('abort', afterPrint);
      cleanup();
      if (error) reject(error);
      else resolve();
    };
    const afterPrint = () => finish();
    const mediaChanged = (event: MediaQueryListEvent) => { if (!event.matches) finish(); };
    const regainFocus = () => { if (!media.matches) finish(); };
    if (signal?.aborted) { finish(); return; }
    windows.forEach(target => {
      target.addEventListener('afterprint', afterPrint);
      target.addEventListener('pagehide', afterPrint);
    });
    media.addEventListener('change', mediaChanged);
    signal?.addEventListener('abort', afterPrint, { once: true });
    try {
      printWindow.focus();
      // Listen after focus() so preparing the frame does not end the session.
      ownerWindow.addEventListener('focus', regainFocus);
      printWindow.print();
    } catch (error) {
      finish(error);
    }
  });
}
