import {
  collection, documentId, getDocsFromServer, limit, orderBy, query, startAfter,
  type Firestore, type QueryConstraint, type QueryDocumentSnapshot,
} from 'firebase/firestore';

/** Accumulate privately: a failed page must never produce a partial download. */
export async function collectExportPages<T, C>(
  read: (cursor: C | null) => Promise<{ items: T[]; cursor: C | null; hasMore: boolean }>,
): Promise<T[]> {
  const items: T[] = [];
  let cursor: C | null = null;
  for (;;) {
    const page = await read(cursor);
    items.push(...page.items);
    if (!page.hasMore) return items;
    if (page.cursor === null || page.cursor === cursor) throw new Error('Không thể đọc đầy đủ lịch sử.');
    cursor = page.cursor;
  }
}

/** ID ordering includes legacy documents without createdAt; server-only reads reject offline cache. */
export async function readExportHistory<T>(
  db: Firestore, path: string, constraints: QueryConstraint[] = [],
  onRead: (size: number) => void = () => {},
): Promise<T[]> {
  return collectExportPages<T, QueryDocumentSnapshot>(async cursor => {
    const snapshot = await getDocsFromServer(query(collection(db, path), ...constraints,
      orderBy(documentId()), limit(500), ...(cursor ? [startAfter(cursor)] : [])));
    onRead(snapshot.size);
    return {
      items: snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as T)),
      cursor: snapshot.docs.at(-1) ?? null,
      hasMore: snapshot.size === 500,
    };
  });
}
