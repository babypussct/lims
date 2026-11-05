import assert from 'node:assert/strict';
import test from 'node:test';
import { DeltaIndexedDbStorage } from './delta-indexeddb';

test('DeltaIndexedDbStorage degrades gracefully when window/indexedDB is unavailable', async () => {
  const storage = DeltaIndexedDbStorage.getInstance();
  storage.resetForTest();

  // In Node.js environment without window.indexedDB
  assert.equal(storage.isAvailable(), false);
  const items = await storage.get('non_existent_key');
  assert.equal(items, null);

  // set, remove, clear should not throw
  await storage.set('some_key', [{ id: '1' }]);
  await storage.remove('some_key');
  await storage.clear();
  await storage.clearByScope('scope1');
});

test('DeltaIndexedDbStorage operations work with mock IDBDatabase', async () => {
  const storage = DeltaIndexedDbStorage.getInstance();
  const memoryStore = new Map<string, any>();

  const mockDb = {
    transaction: (_storeName: string, _mode: string) => {
      let pendingOps = 0;
      const tx: any = {
        oncomplete: null,
        onerror: null,
        onabort: null,
        objectStore: () => ({
          get: (key: string) => {
            const req: any = { result: memoryStore.get(key) };
            pendingOps++;
            setTimeout(() => {
              req.onsuccess?.();
              checkDone();
            }, 0);
            return req;
          },
          put: (entry: any) => {
            memoryStore.set(entry.key, entry);
          },
          delete: (key: string) => {
            memoryStore.delete(key);
          },
          clear: () => {
            memoryStore.clear();
          },
          openCursor: () => {
            const keys = [...memoryStore.keys()];
            let index = 0;
            const req: any = {};
            pendingOps++;
            const step = () => {
              if (index < keys.length) {
                const k = keys[index];
                req.result = {
                  key: k,
                  value: memoryStore.get(k),
                  delete: () => memoryStore.delete(k),
                  continue: () => {
                    index++;
                    step();
                  }
                };
                req.onsuccess?.();
              } else {
                req.result = null;
                req.onsuccess?.();
                checkDone();
              }
            };
            setTimeout(step, 0);
            return req;
          }
        }),
      };
      const checkDone = () => {
        pendingOps--;
        if (pendingOps <= 0) {
          setTimeout(() => tx.oncomplete?.(), 0);
        }
      };
      setTimeout(() => {
        if (pendingOps === 0) tx.oncomplete?.();
      }, 0);
      return tx;
    }
  };

  storage.setMockForTest(mockDb);
  assert.equal(storage.isAvailable(), true);

  // Set and get items
  await storage.set('test_scope__key1', [{ id: 'item1', name: 'Standard 1' }]);
  const result = await storage.get<{ id: string; name: string }>('test_scope__key1');
  assert.ok(result);
  assert.equal(result.length, 1);
  assert.equal(result[0].name, 'Standard 1');

  // Set another
  await storage.set('test_scope__key2', [{ id: 'item2' }]);
  assert.equal(memoryStore.size, 2);

  // Remove
  await storage.remove('test_scope__key1');
  const removedResult = await storage.get('test_scope__key1');
  assert.equal(removedResult, null);
  assert.equal(memoryStore.size, 1);

  // Clear by scope
  await storage.set('other_scope__key3', [{ id: 'item3' }]);
  await storage.clearByScope('test_scope');
  assert.equal(memoryStore.has('test_scope__key2'), false);
  assert.equal(memoryStore.has('other_scope__key3'), true);

  // Clear all
  await storage.clear();
  assert.equal(memoryStore.size, 0);

  storage.resetForTest();
});
