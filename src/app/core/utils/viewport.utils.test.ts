import assert from 'node:assert/strict';
import test from 'node:test';

import {
  MOBILE_VIEWPORT_MAX_WIDTH,
  isCoarsePointerDevice,
  isMobileViewport,
} from './viewport.utils';

test('isMobileViewport returns false safely when window is unavailable', () => {
  assert.equal(MOBILE_VIEWPORT_MAX_WIDTH, 767);
  assert.equal(isMobileViewport(), false);
  assert.equal(isCoarsePointerDevice(), false);
});

test('isMobileViewport evaluates matchMedia against MOBILE_VIEWPORT_MAX_WIDTH and custom widths', () => {
  const originalWindow = (globalThis as { window?: unknown }).window;
  const queries: string[] = [];

  try {
    (globalThis as { window: unknown }).window = {
      innerWidth: 390,
      matchMedia: (query: string) => {
        queries.push(query);
        return { matches: query.includes('767px') || query.includes('600px') };
      },
    };

    assert.equal(isMobileViewport(), true);
    assert.equal(isMobileViewport(600), true);
    assert.equal(isMobileViewport(320), false);
    assert.deepEqual(queries, [
      '(max-width: 767px)',
      '(max-width: 600px)',
      '(max-width: 320px)',
    ]);
  } finally {
    if (originalWindow === undefined) {
      delete (globalThis as { window?: unknown }).window;
    } else {
      (globalThis as { window: unknown }).window = originalWindow;
    }
  }
});

test('isMobileViewport falls back to innerWidth when matchMedia is missing and isCoarsePointerDevice checks pointer media query', () => {
  const originalWindow = (globalThis as { window?: unknown }).window;

  try {
    (globalThis as { window: unknown }).window = {
      innerWidth: 767,
    };
    assert.equal(isMobileViewport(), true);

    (globalThis as { window: unknown }).window = {
      innerWidth: 768,
    };
    assert.equal(isMobileViewport(), false);

    (globalThis as { window: unknown }).window = {
      matchMedia: (query: string) => ({
        matches: query === '(hover: none) and (pointer: coarse)',
      }),
    };
    assert.equal(isCoarsePointerDevice(), true);
  } finally {
    if (originalWindow === undefined) {
      delete (globalThis as { window?: unknown }).window;
    } else {
      (globalThis as { window: unknown }).window = originalWindow;
    }
  }
});
