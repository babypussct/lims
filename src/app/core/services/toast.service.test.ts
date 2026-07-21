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

  it('aggregates toasts by dedupeKey and increments count', () => {
    const service = new ToastService();
    const id1 = service.showEvent({ message: 'Đầu tiên', persistent: true, dedupeKey: 'same-event' });
    const duplicateId = service.showEvent({ message: 'Lặp lại', persistent: true, dedupeKey: 'same-event' });

    assert.equal(duplicateId, id1);
    assert.equal(service.toasts().length, 1);
    assert.equal(service.toasts()[0].count, 2);
  });

  it('aggregates toasts by type and message and increments count', () => {
    const service = new ToastService();
    const id1 = service.showEvent({ message: 'Same message', type: 'info', persistent: true });
    const duplicateId = service.showEvent({ message: 'Same message', type: 'info', persistent: true });
    
    assert.equal(duplicateId, id1);
    assert.equal(service.toasts().length, 1);
    assert.equal(service.toasts()[0].count, 2);
  });

  it('pauses and resumes the dismissal timer', async () => {
    const service = new ToastService();
    const id = service.showEvent({ message: 'Timer', durationMs: 80 });
    await new Promise(resolve => setTimeout(resolve, 10));
    service.pause(id);
    await new Promise(resolve => setTimeout(resolve, 100));
    assert.equal(service.toasts().length, 1);

    service.resume(id);
    await new Promise(resolve => setTimeout(resolve, 100));
    assert.equal(service.toasts().length, 0);
  });

  it('runs the action and removes the toast', () => {
    const service = new ToastService();
    let actionRan = false;
    const id = service.showEvent({ message: 'Action', persistent: true, action: () => { actionRan = true; } });
    const toast = service.toasts().find(item => item.id === id);
    assert.ok(toast);
    service.runAction(toast);
    assert.equal(actionRan, true);
    assert.equal(service.toasts().length, 0);
  });
});
