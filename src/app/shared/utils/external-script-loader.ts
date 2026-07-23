const scriptPromises = new Map<string, Promise<void>>();

function loadExternalScript(id: string, src: string): Promise<void> {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return Promise.resolve();
  }

  const existingGlobalPromise = scriptPromises.get(id);
  if (existingGlobalPromise) return existingGlobalPromise;

  const existingScript = document.getElementById(id) as HTMLScriptElement | null;
  if (existingScript?.dataset['loaded'] === 'true') {
    return Promise.resolve();
  }

  const promise = new Promise<void>((resolve, reject) => {
    const script = existingScript || document.createElement('script');

    script.id = id;
    script.src = src;
    script.async = true;
    script.crossOrigin = 'anonymous';

    script.addEventListener('load', () => {
      script.dataset['loaded'] = 'true';
      resolve();
    }, { once: true });

    script.addEventListener('error', () => {
      scriptPromises.delete(id);
      reject(new Error(`Unable to load ${src}`));
    }, { once: true });

    if (!existingScript) {
      document.head.appendChild(script);
    }
  });

  scriptPromises.set(id, promise);
  return promise;
}

export async function ensureQrious(): Promise<any> {
  if ((window as any).QRious) return (window as any).QRious;
  await loadExternalScript('lims-qrious-script', 'https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js');
  return (window as any).QRious;
}

export async function ensureHtml5Qrcode(): Promise<{ Html5Qrcode: any; Html5QrcodeSupportedFormats: any }> {
  if ((window as any).Html5Qrcode) {
    return {
      Html5Qrcode: (window as any).Html5Qrcode,
      Html5QrcodeSupportedFormats: (window as any).Html5QrcodeSupportedFormats
    };
  }

  await loadExternalScript('lims-html5-qrcode-script', 'https://unpkg.com/html5-qrcode');
  return {
    Html5Qrcode: (window as any).Html5Qrcode,
    Html5QrcodeSupportedFormats: (window as any).Html5QrcodeSupportedFormats
  };
}
