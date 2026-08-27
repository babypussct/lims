import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { GeoPoint, Timestamp } from 'firebase-admin/firestore';
import {
  deserializeFirestoreValue,
  extractDriveFileIds,
  sanitizeFirestoreDataForBackup,
  serializeFirestoreValue,
  stableJson,
} from './firestore-backup.js';

const fakeDb = {
  doc(path: string) {
    return { path };
  },
} as any;

describe('Firestore backup serializer', () => {
  it('preserves Firestore special values through tagged JSON', () => {
    const value = {
      createdAt: Timestamp.fromMillis(1720000000123),
      location: new GeoPoint(10.7, 106.6),
      bytes: Buffer.from([1, 2, 3]),
      optional: undefined,
      nested: [{ count: 3n }],
      nonFinite: [Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY],
    };
    const serialised = serializeFirestoreValue(value);
    const restored = deserializeFirestoreValue(serialised, fakeDb) as any;
    assert.equal(restored.createdAt instanceof Timestamp, true);
    assert.equal(restored.createdAt.toMillis(), 1720000000123);
    assert.equal(restored.location instanceof GeoPoint, true);
    assert.deepEqual(restored.bytes, Buffer.from([1, 2, 3]));
    assert.equal(restored.optional, undefined);
    assert.equal(restored.nested[0].count, 3n);
    assert.equal(Number.isNaN(restored.nonFinite[0]), true);
    assert.equal(restored.nonFinite[1], Number.POSITIVE_INFINITY);
    assert.equal(restored.nonFinite[2], Number.NEGATIVE_INFINITY);
  });

  it('scrubs protected fields and finds every Drive ID in nested data', () => {
    const value = {
      fcmTokens: ['must-not-restore'],
      nested: {
        reportUrl: 'https://drive.google.com/file/d/drive-file-1/view',
        sheet: 'https://docs.google.com/spreadsheets/d/sheet-file-2/edit',
        items: [{ url: 'https://drive.google.com/open?id=drive-file-3' }],
        fileId: 'legacy-drive-file-4',
      },
    };
    const scrubbed = sanitizeFirestoreDataForBackup(value) as any;
    assert.equal('fcmTokens' in scrubbed, false);
    assert.deepEqual(extractDriveFileIds(value).map(item => item.fileId).sort(), ['drive-file-1', 'drive-file-3', 'legacy-drive-file-4', 'sheet-file-2']);
    assert.equal(stableJson({ b: 1, a: 2 }), stableJson({ a: 2, b: 1 }));
  });
});
