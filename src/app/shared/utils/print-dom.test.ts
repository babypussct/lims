import assert from 'node:assert/strict';
import { test } from 'node:test';
import { printWithCleanup, waitForPrintAssets } from './print-dom';

class PrintWindow extends EventTarget {
  media = Object.assign(new EventTarget(), { matches: false });
  print = () => {};
  focus = () => {};
  matchMedia = () => this.media;
}

test('content survives an asynchronous dialog and is cleaned exactly once after cancel/print', async () => {
  const target = new PrintWindow();
  let cleanups = 0;
  const operation = printWithCleanup(target as unknown as Window, () => cleanups++);
  await Promise.resolve();
  assert.equal(cleanups, 0);
  target.dispatchEvent(new Event('afterprint'));
  await operation;
  target.dispatchEvent(new Event('afterprint'));
  assert.equal(cleanups, 1);
});

test('print exceptions reject and clean; unmount cancels pending print sessions', async () => {
  const target = new PrintWindow();
  let cleanups = 0;
  target.print = () => { throw new Error('blocked'); };
  await assert.rejects(printWithCleanup(target as unknown as Window, () => cleanups++), /blocked/);
  assert.equal(cleanups, 1);
  target.print = () => {};
  const controller = new AbortController();
  const pending = printWithCleanup(target as unknown as Window, () => cleanups++, controller.signal);
  controller.abort();
  await pending;
  assert.equal(cleanups, 2);
});

test('owner-window events finish iframe printing without revoking content before printing starts', async () => {
  const target = new PrintWindow();
  const owner = new PrintWindow();
  let cleanups = 0;
  target.focus = () => { owner.dispatchEvent(new Event('focus')); };
  const pending = printWithCleanup(target as unknown as Window, () => cleanups++, undefined, owner as unknown as Window);
  assert.equal(cleanups, 0);
  owner.dispatchEvent(new Event('focus'));
  await pending;
  assert.equal(cleanups, 1);
});

test('returning from print media cleans while focus during print keeps content alive', async () => {
  const target = new PrintWindow();
  const pending = printWithCleanup(target as unknown as Window, () => {});
  target.media.matches = true;
  target.dispatchEvent(new Event('focus'));
  target.media.matches = false;
  target.media.dispatchEvent(Object.assign(new Event('change'), { matches: false }));
  await pending;
});
test('asset preparation waits for locally generated QR before decoding and rejects broken images', async () => {
  const image = Object.assign(new EventTarget(), { dataset: { printAsset: 'pending' }, complete: true, naturalWidth: 150, decode: async () => {} });
  const root = { ownerDocument: { fonts: { ready: Promise.resolve() } }, querySelectorAll: () => [image] } as unknown as HTMLElement;
  let ready = false;
  const operation = waitForPrintAssets(root).then(() => { ready = true; });
  await Promise.resolve();
  assert.equal(ready, false);
  image.dataset.printAsset = 'ready';
  image.dispatchEvent(new Event('print-asset-ready'));
  await operation;
  assert.equal(ready, true);
  image.naturalWidth = 0;
  await assert.rejects(waitForPrintAssets(root), /chưa tải được/);
});
