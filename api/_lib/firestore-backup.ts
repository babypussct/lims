import {
  DocumentReference,
  FieldPath,
  GeoPoint,
  Timestamp,
  type CollectionReference,
  type Firestore,
} from 'firebase-admin/firestore';
import {
  FIRESTORE_COLLECTION_CATALOG,
  FIRESTORE_ROOT_COLLECTION_CATALOG,
  FIRESTORE_SUBCOLLECTION_CATALOG,
  NEVER_RESTORE_COLLECTIONS,
  NEVER_RESTORE_FIELD_NAMES,
  appPath,
  pathBelongsToApp,
} from './backup-contract.js';

export interface FirestoreBackupRecord {
  path: string;
  collection: string;
  documentId: string;
  parentPath?: string;
  data?: unknown;
  excluded?: boolean;
}

export interface FirestoreBackupStats {
  pathCounts: Map<string, { collection: string; documentCount: number; bytes: number }>;
  excludedCounts: Map<string, number>;
  unknownCollections: Set<string>;
  orphanSubcollectionCount: number;
  scrubbedFieldCount: number;
  firestoreReads: number;
}

export interface FirestoreBackupOptions {
  db: Firestore;
  appId: string;
  onRecord: (record: FirestoreBackupRecord) => Promise<void>;
  onDriveReference: (value: unknown, path: string) => void;
  includeEphemeralRecords?: boolean;
  /** Stop before a single backup can consume the whole daily Spark read quota. */
  maxFirestoreReads?: number;
  /** Reads already committed by earlier resumable chunks. */
  initialFirestoreReads?: number;
}

export interface FirestoreCollectionQueueItem {
  path: string;
  collectionLabel: string;
  cursor?: string;
}

export interface FirestoreBackupQueueState {
  phase: 'COLLECTIONS' | 'GROUPS' | 'COMPLETE';
  queue: FirestoreCollectionQueueItem[];
  groupIndex: number;
  groupCursor?: string;
  seenCollectionPaths: string[];
  unknownCollections: string[];
}

export interface FirestoreBackupChunkOptions extends FirestoreBackupOptions {
  queue: FirestoreBackupQueueState;
  /** Maximum document reads in this invocation, including group-query rows. */
  maxDocumentsPerChunk?: number;
  /** Query page size; keeping it bounded also bounds listCollections work. */
  pageSize?: number;
}

export interface FirestoreBackupChunkResult {
  queue: FirestoreBackupQueueState;
  stats: FirestoreBackupStats;
}

export interface FirestoreRestoreRecord {
  path: string;
  collection: string;
  documentId: string;
  data?: unknown;
  excluded?: boolean;
}

export function serializeFirestoreValue(value: unknown, db?: Firestore): unknown {
  if (value instanceof Timestamp) {
    return {
      __limsType: 'timestamp',
      seconds: value.seconds,
      nanoseconds: value.nanoseconds,
    };
  }
  if (value instanceof GeoPoint) {
    return {
      __limsType: 'geopoint',
      latitude: value.latitude,
      longitude: value.longitude,
    };
  }
  if (value instanceof DocumentReference) {
    return {
      __limsType: 'reference',
      path: value.path,
    };
  }
  if (value instanceof Date) {
    return { __limsType: 'date', value: value.toISOString() };
  }
  if (Buffer.isBuffer(value)) {
    return { __limsType: 'bytes', base64: value.toString('base64') };
  }
  if (value instanceof Uint8Array) {
    return { __limsType: 'bytes', base64: Buffer.from(value).toString('base64') };
  }
  if (typeof value === 'bigint') {
    return { __limsType: 'bigint', value: value.toString() };
  }
  if (typeof value === 'number' && !Number.isFinite(value)) {
    return {
      __limsType: 'number',
      value: Number.isNaN(value) ? 'NaN' : value === Infinity ? 'Infinity' : '-Infinity',
    };
  }
  if (value === undefined) {
    return { __limsType: 'undefined' };
  }
  if (Array.isArray(value)) return value.map(item => serializeFirestoreValue(item, db));
  if (value && typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) {
      result[key] = serializeFirestoreValue(item, db);
    }
    return result;
  }
  return value;
}

export function deserializeFirestoreValue(value: unknown, db: Firestore): unknown {
  if (Array.isArray(value)) return value.map(item => deserializeFirestoreValue(item, db));
  if (!value || typeof value !== 'object') return value;
  const typed = value as Record<string, unknown>;
  switch (typed['__limsType']) {
    case 'timestamp':
      return new Timestamp(Number(typed['seconds']), Number(typed['nanoseconds']));
    case 'geopoint':
      return new GeoPoint(Number(typed['latitude']), Number(typed['longitude']));
    case 'reference': {
      const path = typeof typed['path'] === 'string' ? typed['path'] : '';
      if (!path || path.startsWith('/') || path.includes('//')) throw new Error('Invalid Firestore reference path in backup.');
      return db.doc(path);
    }
    case 'date':
      return new Date(String(typed['value']));
    case 'bytes':
      return Buffer.from(String(typed['base64'] || ''), 'base64');
    case 'bigint':
      return BigInt(String(typed['value']));
    case 'number':
      if (typed['value'] === 'NaN') return Number.NaN;
      if (typed['value'] === 'Infinity') return Number.POSITIVE_INFINITY;
      if (typed['value'] === '-Infinity') return Number.NEGATIVE_INFINITY;
      throw new Error('Invalid non-finite number in backup.');
    case 'undefined':
      return undefined;
    default: {
      const result: Record<string, unknown> = {};
      for (const [key, item] of Object.entries(typed)) {
        result[key] = deserializeFirestoreValue(item, db);
      }
      return result;
    }
  }
}

export function stableJson(value: unknown): string {
  return JSON.stringify(sortForStableJson(value));
}

function sortForStableJson(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortForStableJson);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => [key, sortForStableJson(item)]));
  }
  return value;
}

export function extractDriveFileIds(value: unknown, path = ''): Array<{ fileId: string; fieldPath: string }> {
  const found: Array<{ fileId: string; fieldPath: string }> = [];
  const rawDriveIdKey = /^(?:drive|pdf|docs|coa|certificate|template|spreadsheet)?fileid$|^(?:pdf|docs|coa|certificate|template|spreadsheet)id$/i;
  const likelyDriveId = (candidate: string): boolean => /^[A-Za-z0-9_-]{10,200}$/.test(candidate);
  const visit = (item: unknown, currentPath: string): void => {
    if (typeof item === 'string') {
      const ids = new Set<string>();
      const patterns = [
        /drive\.google\.com\/file\/d\/([A-Za-z0-9_-]+)/gi,
        /docs\.google\.com\/(?:document|spreadsheets|presentation)\/d\/([A-Za-z0-9_-]+)/gi,
        /[?&](?:id|fileId)=([A-Za-z0-9_-]+)/gi,
      ];
      for (const pattern of patterns) {
        let match: RegExpExecArray | null;
        while ((match = pattern.exec(item))) ids.add(match[1]);
      }
      for (const fileId of ids) found.push({ fileId, fieldPath: currentPath });
      return;
    }
    if (Array.isArray(item)) {
      item.forEach((child, index) => visit(child, `${currentPath}[${index}]`));
      return;
    }
    if (item && typeof item === 'object') {
      for (const [key, child] of Object.entries(item as Record<string, unknown>)) {
        // Some legacy records keep the raw Drive ID instead of a URL. Do not
        // treat every `documentId` or business ID as a Drive object; restrict
        // this fallback to unambiguous asset/template field names and the
        // shape accepted by Drive IDs.
        if (rawDriveIdKey.test(key) && typeof child === 'string' && likelyDriveId(child.trim())) {
          found.push({ fileId: child.trim(), fieldPath: currentPath ? `${currentPath}.${key}` : key });
        }
        visit(child, currentPath ? `${currentPath}.${key}` : key);
      }
    }
  };
  visit(value, path);
  return found;
}

function sanitizeForBackup(value: unknown, stats: FirestoreBackupStats): unknown {
  if (Array.isArray(value)) return value.map(item => sanitizeForBackup(item, stats));
  if (!value || typeof value !== 'object' || value instanceof Timestamp || value instanceof GeoPoint || value instanceof DocumentReference || value instanceof Date || Buffer.isBuffer(value) || value instanceof Uint8Array) {
    return value;
  }
  const result: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
    if (NEVER_RESTORE_FIELD_NAMES.has(key)) {
      stats.scrubbedFieldCount++;
      continue;
    }
    result[key] = sanitizeForBackup(item, stats);
  }
  return result;
}

/**
 * Apply the same secret/ephemeral-field scrub used by the backup collector.
 * Restore verification uses this against the live document so fields that are
 * intentionally never restored (for example FCM tokens) do not create false
 * differences.
 */
export function sanitizeFirestoreDataForBackup(value: unknown): unknown {
  return sanitizeForBackup(value, {
    pathCounts: new Map(),
    excludedCounts: new Map(),
    unknownCollections: new Set(),
    orphanSubcollectionCount: 0,
    scrubbedFieldCount: 0,
    firestoreReads: 0,
  });
}

function pathCollection(path: string): string {
  const segments = path.split('/');
  if (segments.length >= 3 && segments[0] === 'artifacts') return segments.slice(2, -1).filter(Boolean).join('/');
  return segments.length >= 2 ? segments.slice(0, -1).join('/') : segments[0] || '';
}

function parentPath(path: string): string | undefined {
  const segments = path.split('/');
  return segments.length >= 2 ? segments.slice(0, -1).join('/') : undefined;
}

function incrementPathStats(stats: FirestoreBackupStats, path: string, bytes: number): void {
  const collection = pathCollection(path);
  const current = stats.pathCounts.get(collection) || { collection, documentCount: 0, bytes: 0 };
  current.documentCount++;
  current.bytes += bytes;
  stats.pathCounts.set(collection, current);
}

function incrementExcludedStats(stats: FirestoreBackupStats, collection: string): void {
  stats.excludedCounts.set(collection, (stats.excludedCounts.get(collection) || 0) + 1);
}

function registerFirestoreReads(
  options: FirestoreBackupOptions,
  stats: FirestoreBackupStats,
  count: number,
): void {
  stats.firestoreReads += count;
  const initialReads = options.initialFirestoreReads || 0;
  if (options.maxFirestoreReads !== undefined && initialReads + stats.firestoreReads > options.maxFirestoreReads) {
    throw new Error(`Firestore backup vượt ngưỡng ${options.maxFirestoreReads} document reads; dừng để bảo vệ quota Spark.`);
  }
}

async function emitDocument(
  document: FirebaseFirestore.QueryDocumentSnapshot,
  options: FirestoreBackupOptions,
  stats: FirestoreBackupStats,
  collectionLabel: string,
  isEphemeral: boolean,
): Promise<void> {
  const path = document.ref.path;
  const rawData = document.data();
  options.onDriveReference(rawData, path);
  if (isEphemeral && !options.includeEphemeralRecords) {
    incrementExcludedStats(stats, collectionLabel);
    await options.onRecord({ path, collection: collectionLabel, documentId: document.id, parentPath: parentPath(path), excluded: true });
    return;
  }
  const sanitized = sanitizeForBackup(rawData, stats);
  const serialized = serializeFirestoreValue(sanitized, options.db);
  const bytes = Buffer.byteLength(JSON.stringify(serialized));
  incrementPathStats(stats, path, bytes);
  await options.onRecord({
    path,
    collection: collectionLabel,
    documentId: document.id,
    parentPath: parentPath(path),
    data: serialized,
  });
}

async function walkCollection(
  collectionRef: CollectionReference,
  options: FirestoreBackupOptions,
  stats: FirestoreBackupStats,
  visitedPaths: Set<string>,
): Promise<void> {
  const snapshot = await collectionRef.get();
  registerFirestoreReads(options, stats, snapshot.size);
  const collectionLabel = collectionRef.path.startsWith('artifacts/')
    ? collectionRef.path.split('/').slice(2).join('/')
    : collectionRef.path;
  const isEphemeral = collectionRef.id === 'auth_sessions';
  for (const document of snapshot.docs) {
    if (visitedPaths.has(document.ref.path)) continue;
    visitedPaths.add(document.ref.path);
    await emitDocument(document, options, stats, collectionLabel, isEphemeral);
    const children = await document.ref.listCollections();
    for (const child of children) {
      const childPath = child.path;
      const expected = FIRESTORE_SUBCOLLECTION_CATALOG.some(item => child.id === item.collection && collectionRef.id === item.parentCollection);
      if (!expected) stats.unknownCollections.add(childPath);
      await walkCollection(child, options, stats, visitedPaths);
    }
  }
}

async function walkKnownCollectionGroup(
  db: Firestore,
  options: FirestoreBackupOptions,
  stats: FirestoreBackupStats,
  visitedPaths: Set<string>,
  collectionId: string,
): Promise<void> {
  const snapshot = await db.collectionGroup(collectionId).get();
  registerFirestoreReads(options, stats, snapshot.size);
  for (const document of snapshot.docs) {
    if (!pathBelongsToApp(document.ref.path, options.appId)) continue;
    const segments = document.ref.path.split('/');
    if (segments.length < 6 || segments[4] !== collectionId) continue;
    const parentCollection = segments[2];
    const expected = FIRESTORE_SUBCOLLECTION_CATALOG.some(item => item.collection === collectionId && item.parentCollection === parentCollection);
    if (!expected || visitedPaths.has(document.ref.path)) continue;
    const parentDocumentPath = segments.slice(0, 4).join('/');
    if (!visitedPaths.has(parentDocumentPath)) stats.orphanSubcollectionCount++;
    visitedPaths.add(document.ref.path);
    await emitDocument(document, options, stats, `${parentCollection}/${collectionId}`, false);
  }
}

function collectionLabelFromCollectionPath(path: string): string {
  const segments = path.split('/').filter(Boolean);
  return segments[0] === 'artifacts' ? segments.slice(2).join('/') : segments.join('/');
}

function createChunkStats(): FirestoreBackupStats {
  return {
    pathCounts: new Map(),
    excludedCounts: new Map(),
    unknownCollections: new Set(),
    orphanSubcollectionCount: 0,
    scrubbedFieldCount: 0,
    firestoreReads: 0,
  };
}

function addInitialCollection(
  queue: FirestoreCollectionQueueItem[],
  seen: Set<string>,
  path: string,
  unknownCollections: Set<string>,
  isUnknown: boolean,
): void {
  if (isUnknown) unknownCollections.add(path);
  if (seen.has(path)) return;
  seen.add(path);
  queue.push({ path, collectionLabel: collectionLabelFromCollectionPath(path) });
}

/**
 * Discover only collection paths and leave document reads to the resumable
 * chunk worker. The discovery calls enumerate collection metadata, not the
 * documents themselves, so it is safe to repeat after an interrupted request.
 */
export async function createFirestoreBackupQueue(
  db: Firestore,
  appId: string,
): Promise<FirestoreBackupQueueState> {
  const queue: FirestoreCollectionQueueItem[] = [];
  const seen = new Set<string>();
  const unknownCollections = new Set<string>();
  const appRoot = appPath(appId);
  const appCollections = new Map<string, CollectionReference>();
  for (const collection of await db.doc(appRoot).listCollections()) appCollections.set(collection.id, collection);
  for (const collection of FIRESTORE_COLLECTION_CATALOG) {
    const actual = appCollections.get(collection);
    addInitialCollection(
      queue,
      seen,
      actual?.path || `${appRoot}/${collection}`,
      unknownCollections,
      false,
    );
  }
  for (const [name, collection] of appCollections) {
    if (!FIRESTORE_COLLECTION_CATALOG.includes(name as typeof FIRESTORE_COLLECTION_CATALOG[number])) {
      addInitialCollection(queue, seen, collection.path, unknownCollections, true);
    }
  }

  const rootCollections = new Map<string, CollectionReference>();
  for (const collection of await db.listCollections()) rootCollections.set(collection.id, collection);
  for (const collection of FIRESTORE_ROOT_COLLECTION_CATALOG) {
    const actual = rootCollections.get(collection);
    addInitialCollection(queue, seen, actual?.path || collection, unknownCollections, false);
  }
  for (const [name, collection] of rootCollections) {
    if (name === 'artifacts' || FIRESTORE_ROOT_COLLECTION_CATALOG.includes(name as typeof FIRESTORE_ROOT_COLLECTION_CATALOG[number])) continue;
    addInitialCollection(queue, seen, collection.path, unknownCollections, true);
  }
  return {
    phase: 'COLLECTIONS',
    queue,
    groupIndex: 0,
    seenCollectionPaths: [...seen],
    unknownCollections: [...unknownCollections].sort(),
  };
}

/**
 * Process a bounded number of Firestore document reads and persistable
 * collection/group cursors. This keeps the custom Spark-compatible backup
 * independent of a single serverless invocation timeout while retaining the
 * same serializer and coverage rules as the original collector.
 */
export async function collectFirestoreBackupChunk(
  options: FirestoreBackupChunkOptions,
): Promise<FirestoreBackupChunkResult> {
  const state: FirestoreBackupQueueState = {
    phase: options.queue.phase,
    queue: options.queue.queue.map(item => ({ ...item })),
    groupIndex: options.queue.groupIndex,
    groupCursor: options.queue.groupCursor,
    seenCollectionPaths: [...new Set(options.queue.seenCollectionPaths)],
    unknownCollections: [...new Set(options.queue.unknownCollections)],
  };
  const stats = createChunkStats();
  for (const path of state.unknownCollections) stats.unknownCollections.add(path);
  const maxDocuments = options.maxDocumentsPerChunk ?? 100;
  const pageSize = options.pageSize ?? Math.min(100, maxDocuments);
  if (!Number.isSafeInteger(maxDocuments) || maxDocuments < 1 || !Number.isSafeInteger(pageSize) || pageSize < 1) {
    throw new Error('Firestore backup chunk size không hợp lệ.');
  }
  let remaining = maxDocuments;
  const seenCollectionPaths = new Set(state.seenCollectionPaths);

  while (remaining > 0 && state.phase === 'COLLECTIONS') {
    const task = state.queue[0];
    if (!task) {
      state.phase = 'GROUPS';
      continue;
    }
    const limit = Math.min(pageSize, remaining);
    let query = options.db.collection(task.path).orderBy(FieldPath.documentId()).limit(limit);
    if (task.cursor) query = query.startAfter(task.cursor);
    const snapshot = await query.get();
    registerFirestoreReads(options, stats, snapshot.size);
    remaining -= snapshot.size;
    if (snapshot.empty) {
      state.queue.shift();
      continue;
    }
    const isEphemeral = task.path.split('/').filter(Boolean).at(-1) === 'auth_sessions';
    for (const document of snapshot.docs) {
      await emitDocument(
        document,
        options,
        stats,
        task.collectionLabel,
        isEphemeral,
      );
      for (const child of await document.ref.listCollections()) {
        const parentCollectionId = document.ref.parent.id;
        const expected = FIRESTORE_SUBCOLLECTION_CATALOG.some(item =>
          item.collection === child.id && item.parentCollection === parentCollectionId);
        if (!expected) stats.unknownCollections.add(child.path);
        if (!seenCollectionPaths.has(child.path)) {
          seenCollectionPaths.add(child.path);
          state.queue.push({ path: child.path, collectionLabel: collectionLabelFromCollectionPath(child.path) });
        }
      }
    }
    if (snapshot.size < limit) state.queue.shift();
    else task.cursor = snapshot.docs[snapshot.docs.length - 1].id;
  }

  while (remaining > 0 && state.phase === 'GROUPS') {
    if (state.groupIndex >= FIRESTORE_SUBCOLLECTION_CATALOG.length) {
      state.phase = 'COMPLETE';
      break;
    }
    const collectionId = FIRESTORE_SUBCOLLECTION_CATALOG[state.groupIndex].collection;
    const limit = Math.min(pageSize, remaining);
    let query = options.db.collectionGroup(collectionId).orderBy(FieldPath.documentId()).limit(limit);
    if (state.groupCursor) query = query.startAfter(state.groupCursor);
    const snapshot = await query.get();
    registerFirestoreReads(options, stats, snapshot.size);
    remaining -= snapshot.size;
    if (snapshot.empty) {
      state.groupIndex++;
      state.groupCursor = undefined;
      continue;
    }
    for (const document of snapshot.docs) {
      const segments = document.ref.path.split('/');
      if (!pathBelongsToApp(document.ref.path, options.appId) || segments.length < 6 || segments[4] !== collectionId) continue;
      const parentCollection = segments[2];
      const expected = FIRESTORE_SUBCOLLECTION_CATALOG.some(item =>
        item.collection === collectionId && item.parentCollection === parentCollection);
      if (!expected) continue;
      const nestedCollectionPath = segments.slice(0, 5).join('/');
      // Direct collection walking has already emitted every child below a
      // readable parent document. Collection-group scanning is reserved for
      // orphaned nested documents whose parent path was not discoverable.
      if (seenCollectionPaths.has(nestedCollectionPath)) continue;
      stats.orphanSubcollectionCount++;
      await emitDocument(document, options, stats, `${parentCollection}/${collectionId}`, false);
    }
    if (snapshot.size < limit) {
      state.groupIndex++;
      state.groupCursor = undefined;
    } else {
      state.groupCursor = snapshot.docs[snapshot.docs.length - 1].ref.path;
    }
  }

  if (state.phase === 'GROUPS' && state.groupIndex >= FIRESTORE_SUBCOLLECTION_CATALOG.length) state.phase = 'COMPLETE';
  state.seenCollectionPaths = [...seenCollectionPaths];
  state.unknownCollections = [...new Set([...state.unknownCollections, ...stats.unknownCollections])].sort();
  return { queue: state, stats };
}

export async function collectFirestoreBackup(options: FirestoreBackupOptions): Promise<FirestoreBackupStats> {
  const stats = createChunkStats();
  const visitedPaths = new Set<string>();
  const appDocument = options.db.doc(appPath(options.appId));
  const discovered = new Map<string, CollectionReference>();
  for (const collection of await appDocument.listCollections()) discovered.set(collection.id, collection);
  for (const name of FIRESTORE_COLLECTION_CATALOG) {
    const collection = discovered.get(name) || options.db.collection(`${appPath(options.appId)}/${name}`);
    discovered.set(name, collection);
  }
  for (const [name, collection] of discovered) {
    if (!FIRESTORE_COLLECTION_CATALOG.includes(name as typeof FIRESTORE_COLLECTION_CATALOG[number])) {
      stats.unknownCollections.add(collection.path);
    }
    await walkCollection(collection, options, stats, visitedPaths);
  }

  // Discover every real root collection as well as the known release
  // history. `artifacts` is the namespace envelope handled above; it is not a
  // business collection itself. Unknown roots are still collected so the
  // resulting manifest is useful for review, but the backup engine will fail
  // closed rather than claiming complete coverage until the catalog is
  // updated.
  const rootCollections = new Map<string, CollectionReference>();
  for (const collection of await options.db.listCollections()) rootCollections.set(collection.id, collection);
  for (const rootCollection of FIRESTORE_ROOT_COLLECTION_CATALOG) {
    const collection = rootCollections.get(rootCollection) || options.db.collection(rootCollection);
    rootCollections.set(rootCollection, collection);
  }
  for (const [name, collection] of rootCollections) {
    if (name === 'artifacts') continue;
    if (!FIRESTORE_ROOT_COLLECTION_CATALOG.includes(name as typeof FIRESTORE_ROOT_COLLECTION_CATALOG[number])) {
      stats.unknownCollections.add(collection.path);
    }
    await walkCollection(collection, options, stats, visitedPaths);
  }
  for (const { collection: collectionId } of FIRESTORE_SUBCOLLECTION_CATALOG) {
    await walkKnownCollectionGroup(options.db, options, stats, visitedPaths, collectionId);
  }
  return stats;
}

export function countRestoreableRecords(records: Iterable<FirestoreBackupRecord>): number {
  let count = 0;
  for (const record of records) {
    if (!record.excluded && record.data !== undefined && !NEVER_RESTORE_COLLECTIONS.has(record.collection.split('/')[0])) count++;
  }
  return count;
}

export function isRestoreablePath(path: string, appId: string): boolean {
  const segments = path.split('/');
  if (segments.some(segment => !segment || segment === '.' || segment === '..')) return false;
  if (segments.includes('auth_sessions')) return false;
  if (path.startsWith('releases/')) return segments.length === 2;
  return pathBelongsToApp(path, appId) && segments.length >= 4 && segments.length % 2 === 0;
}
