import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';
import * as feedUtils from './activity-feed.utils';
import { getActivityActionDefinition } from './activity-event-registry';

function harness() {
  let profile = { uid: 'user-1', role: 'staff' };
  let permissions = ['sop_view'];
  const timers = new Map<number, { fn: () => void; ms: number }>();
  let timerId = 0;
  const listeners: { next: (snapshot: any) => void; error: (error: any) => void; stopped: boolean; options: any }[] = [];
  const reads: { resolve: (snapshot: any) => void; reject: (error: any) => void; args: unknown[] }[] = [];
  const signal = (value: any) => { const read = () => value; read.set = (next: any) => { value = next; }; return read; };
  const fakeFirebase = { app: { name: 'test-app' }, db: {}, APP_ID: 'test-app-id' };
  const angular = {
    Injectable: () => (value: any) => value, signal, computed: (fn: any) => fn, effect: () => {},
    inject: (type: any) => type.name === 'FirebaseService' ? fakeFirebase
      : type.name === 'AuthService' ? { currentUser: () => profile, userPermissions: () => permissions }
      : { record: () => {} },
  };
  const firestore = {
    collection: (...args: any[]) => args, query: (...args: any[]) => args,
    where: (...args: any[]) => args, orderBy: (...args: any[]) => args, limit: (value: number) => value,
    onSnapshot: (_query: unknown, options: unknown, next: any, error: any) => {
      const listener = { next, error, stopped: false, options }; listeners.push(listener);
      return () => { listener.stopped = true; };
    },
  };
  const exports: any = {};
  const source = readFileSync('src/app/core/services/activity-feed.service.ts', 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, experimentalDecorators: true,
  } }).outputText;
  vm.runInNewContext(code, {
    exports, console: { warn: () => {} },
    setTimeout: (fn: () => void, ms: number) => { timers.set(++timerId, { fn, ms }); return timerId; },
    clearTimeout: (id: number) => timers.delete(id),
    require: (id: string) => {
      if (id === '@angular/core') return angular;
      if (id === 'firebase/firestore') return firestore;
      if (id.endsWith('activity-feed.utils')) return feedUtils;
      if (id.endsWith('activity-feed-http')) return {
        readActivityFeedFromHttp: (...args: unknown[]) => new Promise((resolve, reject) => reads.push({ resolve, reject, args })),
      };
      if (id.endsWith('auth.service')) return { AuthService: class AuthService {} };
      if (id.endsWith('firebase.service')) return { FirebaseService: class FirebaseService {} };
      if (id.endsWith('firestore-read-monitor.service')) return { FirestoreReadMonitor: class FirestoreReadMonitor {} };
      throw new Error(`Unexpected dependency ${id}`);
    },
  });
  const service = new exports.ActivityFeedService();
  const start = () => { service.setEnabled(true); service.reconcileScope(true, profile.uid, profile.role, permissions); };
  start();
  return { service, listeners, timers, reads, start,
    changeIdentity: (uid: string, role = 'staff', perms = ['sop_view']) => {
      profile = { uid, role }; permissions = perms; start();
    },
    fire: (ms: number) => {
      for (const [id, timer] of [...timers]) if (timer.ms === ms) { timers.delete(id); timer.fn(); }
    },
  };
}
function snapshot(fromCache: boolean, ids: string[] = []) {
  const definition = getActivityActionDefinition('PUBLISH_RESULT_REPORT');
  return { size: ids.length, metadata: { fromCache }, docChanges: () => ids.map(() => ({ type: 'added' })),
    docs: ids.map(id => ({ id, data: () => ({ ...definition, schemaVersion: 2, eventId: id,
      actorUid: 'user-1', actorName: 'Test user', details: 'Published test report', timestamp: { seconds: 100 } }) })),
  };
}
const flush = async () => { await Promise.resolve(); await Promise.resolve(); };

test('empty or populated cache does not finish bootstrap or cancel HTTP fallback', () => {
  for (const ids of [[], ['cached']]) {
    const h = harness();
    assert.equal(h.listeners[0].options.includeMetadataChanges, true);
    h.listeners[0].next(snapshot(true, ids));
    assert.equal(h.service.status(), 'loading');
    h.fire(8_000);
    assert.equal(h.reads.length, 1);
    assert.equal(h.reads[0].args[1], 'artifacts/test-app-id/logs');
    assert.equal(h.reads[0].args[2], 'RESULT_VIEW');
    assert.equal(h.reads[0].args[3], 75);
  }
});

test('server snapshot, including empty server data, finishes bootstrap without HTTP reads', () => {
  for (const ids of [[], ['server']]) {
    const h = harness(); h.listeners[0].next(snapshot(false, ids)); h.fire(8_000);
    assert.equal(h.service.status(), 'ready'); assert.equal(h.service.events().length, ids.length);
    assert.equal(h.timers.size, 0); assert.equal(h.reads.length, 0);
  }
});

test('HTTP result takes over a stalled listener without replaying its initial page', async () => {
  const h = harness(); h.fire(8_000); h.reads[0].resolve(snapshot(false, ['http'])); await flush();
  assert.equal(h.service.status(), 'ready'); assert.equal(h.service.events()[0].id, 'http');
  assert.equal(h.listeners[0].stopped, true);
  h.listeners[0].next(snapshot(true, ['stale-cache']));
  assert.equal(h.service.events()[0].id, 'http');
  h.service.retry();
  h.listeners[1].next(snapshot(false, ['realtime']));
  assert.equal(h.service.events()[0].id, 'realtime'); assert.equal(h.timers.size, 0);
});

test('realtime wins over a late HTTP response', async () => {
  const h = harness(); h.fire(8_000); h.listeners[0].next(snapshot(false, ['realtime']));
  h.reads[0].resolve(snapshot(false, ['older-http'])); await flush();
  assert.equal(h.service.events()[0].id, 'realtime');
});

test('HTTP deadline clears listeners, exits loading, and ignores a late response', async () => {
  const h = harness(); h.fire(8_000); h.fire(12_000);
  assert.equal(h.service.status(), 'error'); assert.equal(h.timers.size, 0);
  assert.equal(h.listeners[0].stopped, true);
  h.reads[0].resolve(snapshot(false, ['late'])); await flush();
  assert.equal(h.service.status(), 'error'); assert.equal(h.service.events().length, 0);
});

test('HTTP and realtime permission errors fail closed', async () => {
  const h = harness(); h.fire(8_000); h.reads[0].reject({ code: 'permission-denied' }); await flush();
  assert.equal(h.service.status(), 'denied'); assert.equal(h.service.events().length, 0);
  const realtime = harness(); realtime.listeners[0].error({ code: 'permission-denied' });
  assert.equal(realtime.service.status(), 'denied'); assert.equal(realtime.timers.size, 0);
});

test('retry creates fresh listeners and can recover after timeout', () => {
  const h = harness(); h.fire(8_000); h.fire(12_000); h.service.retry();
  assert.equal(h.service.status(), 'loading'); assert.equal(h.listeners.length, 2);
  h.listeners[1].next(snapshot(false, ['recovered']));
  assert.equal(h.service.status(), 'ready'); assert.equal(h.service.errorMessage(), null);
});

test('teardown and identity changes invalidate in-flight reads', async () => {
  const h = harness(); h.fire(8_000); h.service.setEnabled(false);
  h.reads[0].resolve(snapshot(false, ['old-user'])); await flush();
  assert.equal(h.service.status(), 'disabled'); assert.equal(h.service.events().length, 0);
  h.service.retry(); assert.equal(h.listeners.length, 1);
  h.changeIdentity('user-2'); h.fire(8_000);
  h.changeIdentity('user-3', 'viewer', []);
  h.reads[1].resolve(snapshot(false, ['old-scope'])); await flush();
  assert.equal(h.service.status(), 'denied'); assert.equal(h.service.events().length, 0);
});

test('all allowed audiences must be server-confirmed before the feed is ready', () => {
  const h = harness(); h.changeIdentity('manager', 'manager', []);
  const active = h.listeners.filter(listener => !listener.stopped);
  assert.equal(active.length, 8);
  active.slice(0, -1).forEach(listener => listener.next(snapshot(false)));
  assert.equal(h.service.status(), 'loading');
  active.at(-1)!.next(snapshot(false)); assert.equal(h.service.status(), 'ready');
});
