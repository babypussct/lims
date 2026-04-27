with open('src/app/features/standards/standard.service.ts', 'r') as f:
    content = f.read()

# Add DeltaSyncService import
if 'DeltaSyncService' not in content:
    content = content.replace(
        "import { Injectable, inject } from '@angular/core';",
        "import { Injectable, inject } from '@angular/core';\nimport { DeltaSyncService } from '../../core/services/delta-sync.service';"
    )

# Inject DeltaSyncService
if 'deltaSync = inject(DeltaSyncService);' not in content:
    content = content.replace(
        'fb = inject(FirebaseService);',
        'fb = inject(FirebaseService);\n  deltaSync = inject(DeltaSyncService);'
    )

# Replace listenToGlobalUsageLogs
old_listen = """  listenToGlobalUsageLogs(callback: (logs: UsageLog[]) => void): Unsubscribe {
      const colRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_usages`);
      // OPTIMIZED: added limit(100) to prevent unbounded snapshot reads
      const q = query(colRef, orderBy('timestamp', 'desc'), limit(100)); 
      
      return onSnapshot(q, (snapshot) => {
          const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as UsageLog));
          callback(items);
      }, (error) => {
          console.error("Error listening to global usage logs:", error);
      });
  }"""

new_listen = """  listenToGlobalUsageLogs(callback: (logs: UsageLog[]) => void): Unsubscribe {
      return this.deltaSync.startListener<UsageLog>({
          cacheKey: 'lims_usage_cache_' + this.fb.APP_ID,
          cursorKey: 'lims_usage_sync_seconds_' + this.fb.APP_ID,
          collectionPath: `artifacts/${this.fb.APP_ID}/standard_usages`,
          maxCacheSize: 1000,
          orderByField: 'timestamp',
          orderDirection: 'desc'
      }, callback);
  }"""

content = content.replace(old_listen, new_listen)

with open('src/app/features/standards/standard.service.ts', 'w') as f:
    f.write(content)
