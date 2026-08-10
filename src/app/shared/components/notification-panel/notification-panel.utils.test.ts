import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { formatNotificationFilterCount } from './notification-panel.utils';

describe('notification filter count formatting', () => {
  it('keeps normal counts readable', () => {
    assert.equal(formatNotificationFilterCount(0), '0');
    assert.equal(formatNotificationFilterCount(9), '9');
    assert.equal(formatNotificationFilterCount(99), '99');
  });

  it('caps large counts so mobile filter tabs do not grow with the number', () => {
    assert.equal(formatNotificationFilterCount(100), '99+');
    assert.equal(formatNotificationFilterCount(1000), '99+');
  });

  it('normalizes invalid or fractional values safely', () => {
    assert.equal(formatNotificationFilterCount(4.9), '4');
    assert.equal(formatNotificationFilterCount(Number.NaN), '0');
    assert.equal(formatNotificationFilterCount(Number.POSITIVE_INFINITY), '0');
    assert.equal(formatNotificationFilterCount(-2), '0');
  });
});
