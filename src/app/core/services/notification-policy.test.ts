import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { levelForNotificationType, selectForegroundSurface } from './notification-policy';

describe('notification routing policy', () => {
  it('uses exactly one foreground surface', () => {
    assert.equal(selectForegroundSurface('visible', 'granted'), 'toast');
    assert.equal(selectForegroundSurface('hidden', 'granted'), 'browser');
    assert.equal(selectForegroundSurface('hidden', 'denied'), 'none');
  });

  it('maps workflow types to consistent levels', () => {
    assert.equal(levelForNotificationType('REQUEST_APPROVED'), 'success');
    assert.equal(levelForNotificationType('REQUEST_REJECTED'), 'error');
    assert.equal(levelForNotificationType('STOCK_LOW_ALERT'), 'warning');
    assert.equal(levelForNotificationType('SYSTEM_INFO'), 'info');
  });
});
