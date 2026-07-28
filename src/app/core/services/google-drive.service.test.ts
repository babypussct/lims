import assert from 'node:assert/strict';
import test from 'node:test';
import { GoogleDriveService } from './google-drive.service';

function createSessionStorageMock(): Storage {
  const values = new Map<string, string>();
  return {
    get length() { return values.size; },
    clear: () => values.clear(),
    getItem: key => values.get(key) ?? null,
    key: index => Array.from(values.keys())[index] ?? null,
    removeItem: key => { values.delete(key); },
    setItem: (key, value) => values.set(key, value),
  };
}

test('loads every Google Drive page before returning folder contents', async () => {
  const originalFetch = globalThis.fetch;
  const originalSessionStorage = globalThis.sessionStorage;
  const requestedUrls: string[] = [];
  let callCount = 0;

  Object.defineProperty(globalThis, 'sessionStorage', {
    configurable: true,
    value: createSessionStorageMock(),
  });

  globalThis.fetch = (async (input: string | URL | Request) => {
    requestedUrls.push(String(input));
    callCount++;
    if (callCount === 1) {
      return new Response(JSON.stringify({
        files: [{ id: 'file-a', name: 'A' }],
        nextPageToken: 'page-2',
      }), { status: 200 });
    }
    return new Response(JSON.stringify({
      files: [{ id: 'file-b', name: 'B' }],
    }), { status: 200 });
  }) as typeof fetch;

  try {
    const items = await new GoogleDriveService().getFolderContents('folder-id');
    assert.deepEqual(items.map(item => item.id), ['file-a', 'file-b']);
    assert.equal(requestedUrls.length, 2);
    assert.match(requestedUrls[0], /pageSize=1000/);
    assert.match(requestedUrls[1], /pageToken=page-2/);
    assert.match(decodeURIComponent(requestedUrls[0]), /nextPageToken,files/);
  } finally {
    globalThis.fetch = originalFetch;
    Object.defineProperty(globalThis, 'sessionStorage', {
      configurable: true,
      value: originalSessionStorage,
    });
  }
});

test('rejects a repeated Drive page token instead of looping forever', async () => {
  const originalFetch = globalThis.fetch;
  const originalSessionStorage = globalThis.sessionStorage;

  Object.defineProperty(globalThis, 'sessionStorage', {
    configurable: true,
    value: createSessionStorageMock(),
  });

  globalThis.fetch = (async () => new Response(JSON.stringify({
    files: [],
    nextPageToken: 'same-token',
  }), { status: 200 })) as typeof fetch;

  try {
    await assert.rejects(
      () => new GoogleDriveService().getFolderContents('folder-id'),
      /mã phân trang lặp lại/
    );
  } finally {
    globalThis.fetch = originalFetch;
    Object.defineProperty(globalThis, 'sessionStorage', {
      configurable: true,
      value: originalSessionStorage,
    });
  }
});

test('forwards AbortSignal so obsolete folder requests can be cancelled', async () => {
  const originalFetch = globalThis.fetch;
  const originalSessionStorage = globalThis.sessionStorage;
  const controller = new AbortController();

  Object.defineProperty(globalThis, 'sessionStorage', {
    configurable: true,
    value: createSessionStorageMock(),
  });

  globalThis.fetch = ((_: string | URL | Request, init?: RequestInit) => new Promise<Response>((_, reject) => {
    init?.signal?.addEventListener('abort', () => {
      reject(new DOMException('Aborted', 'AbortError'));
    }, { once: true });
  })) as typeof fetch;

  try {
    const request = new GoogleDriveService().getFolderContents('folder-id', controller.signal);
    controller.abort();
    await assert.rejects(request, error => error instanceof DOMException && error.name === 'AbortError');
  } finally {
    globalThis.fetch = originalFetch;
    Object.defineProperty(globalThis, 'sessionStorage', {
      configurable: true,
      value: originalSessionStorage,
    });
  }
});

test('exports a public Google Sheet as XLSX with the configured API key', async () => {
  const originalFetch = globalThis.fetch;
  const originalSessionStorage = globalThis.sessionStorage;
  let requestedUrl = '';
  let requestedSignal: AbortSignal | null | undefined;
  const controller = new AbortController();

  Object.defineProperty(globalThis, 'sessionStorage', {
    configurable: true,
    value: createSessionStorageMock(),
  });

  globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    requestedUrl = String(input);
    requestedSignal = init?.signal;
    return new Response(new Uint8Array([1, 2, 3]), {
      status: 200,
      headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
    });
  }) as typeof fetch;

  try {
    const blob = await new GoogleDriveService().exportPublicFile(
      'sheet/id',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      controller.signal
    );
    assert.equal(blob.size, 3);
    assert.match(requestedUrl, /files\/sheet%2Fid\/export\?/);
    assert.match(decodeURIComponent(requestedUrl), /mimeType=application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet/);
    assert.equal(requestedSignal, controller.signal);
  } finally {
    globalThis.fetch = originalFetch;
    Object.defineProperty(globalThis, 'sessionStorage', {
      configurable: true,
      value: originalSessionStorage,
    });
  }
});
