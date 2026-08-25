import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  levelForNotificationType,
  isDuplicateNotificationEvent,
  resolveMetadataSyncToast,
  selectActivityNotificationProjectionMode,
  selectForegroundSurface
} from './notification-policy';

describe('notification routing policy', () => {
  it('uses exactly one foreground surface', () => {
    assert.equal(selectForegroundSurface('visible', 'granted'), 'toast');
    assert.equal(selectForegroundSurface('hidden', 'granted'), 'browser');
    assert.equal(selectForegroundSurface('hidden', 'denied'), 'none');
  });

  it('keeps legacy publishers flag-off and selects canonical event dispatch flag-on', () => {
    assert.equal(selectActivityNotificationProjectionMode(false), 'legacy');
    assert.equal(selectActivityNotificationProjectionMode(true), 'canonical');
  });

  it('deduplicates foreground push/toast by eventId within the bounded window', () => {
    const seen = new Map<string, number>();
    assert.equal(isDuplicateNotificationEvent(seen, 'event-a', 1_000), false);
    assert.equal(isDuplicateNotificationEvent(seen, 'event-a', 2_000), true);
    assert.equal(isDuplicateNotificationEvent(seen, 'event-b', 2_000), false);
    assert.equal(isDuplicateNotificationEvent(seen, 'event-a', 400_001, 300_000), false);
  });

  it('maps workflow types to consistent levels', () => {
    assert.equal(levelForNotificationType('REQUEST_APPROVED'), 'success');
    assert.equal(levelForNotificationType('REQUEST_REJECTED'), 'error');
    assert.equal(levelForNotificationType('STOCK_LOW_ALERT'), 'warning');
    assert.equal(levelForNotificationType('SYSTEM_INFO'), 'info');
  });

  it('does not reuse a stale activity description for a newer metadata version', () => {
    const result = resolveMetadataSyncToast(
      'standards',
      200,
      { id: 'old-propoxur-event', version: 100, actorUid: 'other-user', message: 'Cập nhật chuẩn: Propoxur' },
      'current-user',
      'Danh sách chuẩn đối chiếu vừa được cập nhật.'
    );

    assert.deepEqual(result, {
      message: 'Danh sách chuẩn đối chiếu vừa được cập nhật.',
      dedupeKey: 'standards-sync-200'
    });
  });

  it('suppresses the metadata echo for the user who initiated an import', () => {
    const result = resolveMetadataSyncToast(
      'standards',
      200,
      { id: 'standards-import-200', version: 200, actorUid: 'current-user', message: 'Import chuẩn: 44 mới, 1 cập nhật' },
      'current-user',
      'Danh sách chuẩn đối chiếu vừa được cập nhật.'
    );

    assert.equal(result, null);
  });

  it('shows the exact synchronized event to another user', () => {
    const result = resolveMetadataSyncToast(
      'standards',
      200,
      { id: 'standards-import-200', version: 200, actorUid: 'importer', message: 'Import chuẩn: 44 mới, 1 cập nhật' },
      'viewer',
      'Danh sách chuẩn đối chiếu vừa được cập nhật.'
    );

    assert.deepEqual(result, {
      message: 'Import chuẩn: 44 mới, 1 cập nhật',
      dedupeKey: 'standards-import-200'
    });
  });
});
