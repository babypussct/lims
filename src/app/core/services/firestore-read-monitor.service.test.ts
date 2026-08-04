import assert from 'node:assert/strict';
import test from 'node:test';
import { FirestoreReadMonitor } from './firestore-read-monitor.service';

test('aggregates Firestore reads by operation, phase and path', () => {
  const monitor = new FirestoreReadMonitor();
  monitor.reset();

  monitor.record('getDocs', 'artifacts/app/inventory', 12);
  monitor.record('getDocs', 'artifacts/app/inventory', 3);
  monitor.record('onSnapshot', 'artifacts/app/inventory', 5, { phase: 'initial', fromCache: true });

  const snapshot = monitor.snapshot();
  const queryMetric = snapshot.find(metric =>
    metric.operation === 'getDocs' && metric.path === 'artifacts/app/inventory'
  );
  const listenerMetric = snapshot.find(metric =>
    metric.operation === 'onSnapshot' && metric.phase === 'initial'
  );

  assert.deepEqual(queryMetric && {
    calls: queryMetric.calls,
    documents: queryMetric.documents,
    networkDocuments: queryMetric.networkDocuments,
    cacheDocuments: queryMetric.cacheDocuments
  }, {
    calls: 2,
    documents: 15,
    networkDocuments: 15,
    cacheDocuments: 0
  });
  assert.equal(listenerMetric?.documents, 5);
  assert.equal(listenerMetric?.networkDocuments, 0);
  assert.equal(listenerMetric?.cacheDocuments, 5);
});

test('reset clears accumulated metrics without throwing in a non-browser runtime', () => {
  const monitor = new FirestoreReadMonitor();
  monitor.record('getDoc', 'artifacts/app/stats/master', 1);
  monitor.reset();
  assert.deepEqual(monitor.snapshot(), []);
});
