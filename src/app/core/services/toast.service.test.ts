import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { ToastService } from './toast.service';

describe('ToastService queue', () => {
  it('shows at most three toasts and activates the next queued item', () => {
    const service = new ToastService();
    const ids = ['Một', 'Hai', 'Ba', 'Bốn'].map(message =>
      service.showEvent({ message, persistent: true })
    );

    assert.equal(service.toasts().length, 3);
    assert.deepEqual(service.toasts().map(toast => toast.message), ['Một', 'Hai', 'Ba']);

    service.remove(ids[0]);
    assert.deepEqual(service.toasts().map(toast => toast.message), ['Hai', 'Ba', 'Bốn']);
  });

  it('deduplicates active and queued toasts', () => {
    const service = new ToastService();
    service.showEvent({ message: 'Đầu tiên', persistent: true, dedupeKey: 'same-event' });
    const duplicateId = service.showEvent({ message: 'Lặp lại', persistent: true, dedupeKey: 'same-event' });

    assert.equal(duplicateId, '');
    assert.equal(service.toasts().length, 1);
  });
});
