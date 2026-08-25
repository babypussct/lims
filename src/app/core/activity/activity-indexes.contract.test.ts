import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

interface FirestoreIndexField {
  fieldPath: string;
  order: 'ASCENDING' | 'DESCENDING';
}

interface FirestoreIndexDefinition {
  collectionGroup: string;
  queryScope: string;
  fields: FirestoreIndexField[];
}

const indexConfig = JSON.parse(readFileSync('firestore.indexes.json', 'utf8')) as {
  indexes: FirestoreIndexDefinition[];
};

function signature(index: FirestoreIndexDefinition): string {
  return `${index.collectionGroup}|${index.fields.map(field => `${field.fieldPath}:${field.order}`).join('|')}`;
}

test('Activity/Audit/Print composite indexes required by V2 remain declared', () => {
  const signatures = new Set(indexConfig.indexes.map(signature));
  const required = [
    'logs|audience:ASCENDING|timestamp:DESCENDING',
    'logs|audience:ASCENDING|activityVisible:ASCENDING|timestamp:DESCENDING',
    'logs|auditClass:ASCENDING|timestamp:DESCENDING',
    'logs|actorUid:ASCENDING|timestamp:DESCENDING',
    'logs|printable:ASCENDING|timestamp:DESCENDING',
    'logs|printable:ASCENDING|actorUid:ASCENDING',
    'logs|printable:ASCENDING|user:ASCENDING|timestamp:DESCENDING'
  ];

  for (const expected of required) assert.ok(signatures.has(expected), `missing index: ${expected}`);
});

test('notification queries remain equality-only and do not acquire a composite-index dependency', () => {
  const client = readFileSync('src/app/core/services/notification.service.ts', 'utf8');
  const api = readFileSync('api/notifications.ts', 'utf8');

  assert.match(client, /where\('recipientUid',\s*'==',\s*user\.uid\)/);
  assert.doesNotMatch(client, /orderBy\(/);
  assert.match(api, /\.where\('groupId',\s*'==',\s*groupId\)\.get\(\)/);
});
