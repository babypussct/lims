import type { FirebaseApp } from 'firebase/app';
import type { ActivityAudience } from './activity-event.model';

/** REST-only SDK: independent of the full SDK's WebChannel and IndexedDB.
 * Reuses this Firebase app's authentication and enforces the same Rules/query.
 * Load only when realtime bootstrap needs recovery.
 */
export async function readActivityFeedFromHttp(
  app: FirebaseApp, path: string, audience: ActivityAudience, maxItems: number,
) {
  const { getFirestore, collection, query, where, orderBy, limit, getDocs } = await import('firebase/firestore/lite');
  return getDocs(query(
    collection(getFirestore(app), path),
    where('audience', '==', audience),
    where('activityVisible', '==', true),
    orderBy('timestamp', 'desc'),
    limit(maxItems),
  ));
}
