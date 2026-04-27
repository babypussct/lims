import re

with open('src/app/core/services/delta-sync.service.ts', 'r') as f:
    content = f.read()

# Add QueryConstraint to imports if not there
if 'QueryConstraint' not in content:
    content = content.replace(
        "import { Firestore, collection, query, onSnapshot, where, orderBy, getDocs, limit, QueryDocumentSnapshot } from 'firebase/firestore';",
        "import { Firestore, collection, query, onSnapshot, where, orderBy, getDocs, limit, QueryDocumentSnapshot, QueryConstraint } from 'firebase/firestore';"
    )

# Add queryConstraints to DeltaSyncConfig
old_config = """export interface DeltaSyncConfig {
  cacheKey: string;
  cursorKey: string;
  collectionPath: string;
  maxCacheSize?: number;
  orderByField?: string;
  orderDirection?: 'asc' | 'desc';
}"""
new_config = """export interface DeltaSyncConfig {
  cacheKey: string;
  cursorKey: string;
  collectionPath: string;
  maxCacheSize?: number;
  orderByField?: string;
  orderDirection?: 'asc' | 'desc';
  queryConstraints?: QueryConstraint[];
}"""
content = content.replace(old_config, new_config)

# Update fetchInitialBatch query construction
old_initial_query = "const q = query(colRef, orderBy(sortField, sortDir), limit(maxCacheSize));"
new_initial_query = """const constraints = config.queryConstraints || [];
    const q = query(colRef, ...constraints, orderBy(sortField, sortDir), limit(maxCacheSize));"""
content = content.replace(old_initial_query, new_initial_query)

# Update _setupSnapshotListener query construction
old_setup_query = """    if (cursor > 0) {
       // Note: Firetore timestamp is an object, but we store cursor as seconds.
       // We need to query by comparing the timestamp field.
       // Wait, if lastUpdated is a serverTimestamp, we need to convert our cursor to a Date or Timestamp object.
       // It's easier to just query where lastUpdated > new Date(cursor * 1000)
       q = query(colRef, where('lastUpdated', '>', new Date(cursor * 1000)), orderBy('lastUpdated', 'asc'));
    } else {
       // Should not happen if initial fetch works, but fallback just in case
       q = query(colRef, orderBy('lastUpdated', 'asc'), limit(100));
    }"""
new_setup_query = """    const constraints = config.queryConstraints || [];
    if (cursor > 0) {
       q = query(colRef, ...constraints, where('lastUpdated', '>', new Date(cursor * 1000)), orderBy('lastUpdated', 'asc'));
    } else {
       q = query(colRef, ...constraints, orderBy('lastUpdated', 'asc'), limit(100));
    }"""
content = content.replace(old_setup_query, new_setup_query)

with open('src/app/core/services/delta-sync.service.ts', 'w') as f:
    f.write(content)

