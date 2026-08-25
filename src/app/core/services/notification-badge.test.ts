import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { syncAppBadge, type AppBadgeTarget } from './notification-badge';

describe('installed app badge synchronization', () => {
  it('sets a normalized positive unread count', async () => {
    const calls: number[] = [];
    const target: AppBadgeTarget = {
      setAppBadge: async count => { calls.push(count ?? -1); }
    };

    await syncAppBadge(target, 6.9);
    assert.deepEqual(calls, [6]);
  });

  it('prefers clearAppBadge when unread reaches zero', async () => {
    let cleared = 0;
    const setCalls: number[] = [];
    const target: AppBadgeTarget = {
      setAppBadge: async count => { setCalls.push(count ?? -1); },
      clearAppBadge: async () => { cleared += 1; }
    };

    await syncAppBadge(target, 0);
    assert.equal(cleared, 1);
    assert.deepEqual(setCalls, []);
  });

  it('falls back to setAppBadge(0) when only the setter is available', async () => {
    const calls: number[] = [];
    const target: AppBadgeTarget = {
      setAppBadge: async count => { calls.push(count ?? -1); }
    };

    await syncAppBadge(target, -10);
    assert.deepEqual(calls, [0]);
  });

  it('is a no-op when the Badging API is unsupported', async () => {
    await assert.doesNotReject(syncAppBadge({}, 3));
    await assert.doesNotReject(syncAppBadge(undefined, 0));
  });

  it('surfaces asynchronous browser failures to the service-level diagnostic handler', async () => {
    const expected = new Error('badge permission revoked');
    const target: AppBadgeTarget = {
      setAppBadge: async () => { throw expected; }
    };

    await assert.rejects(syncAppBadge(target, 2), expected);
  });
});
