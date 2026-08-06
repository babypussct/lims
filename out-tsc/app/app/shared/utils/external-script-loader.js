const scriptPromises = new Map();
function loadExternalScript(id, src) {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
        return Promise.resolve();
    }
    const existingGlobalPromise = scriptPromises.get(id);
    if (existingGlobalPromise)
        return existingGlobalPromise;
    const existingScript = document.getElementById(id);
    if (existingScript?.dataset['loaded'] === 'true') {
        return Promise.resolve();
    }
    const promise = new Promise((resolve, reject) => {
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
export async function ensureQrious() {
    if (window.QRious)
        return window.QRious;
    await loadExternalScript('lims-qrious-script', 'https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js');
    return window.QRious;
}
export async function ensureHtml5Qrcode() {
    // Dùng dynamic import từ npm (version pinned 2.3.8) thay vì CDN không ổn định
    const mod = await import('html5-qrcode');
    return {
        Html5Qrcode: mod.Html5Qrcode,
        Html5QrcodeSupportedFormats: mod.Html5QrcodeSupportedFormats
    };
}
//# sourceMappingURL=external-script-loader.js.map