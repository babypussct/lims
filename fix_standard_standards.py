import re

with open('src/app/features/standards/standard.service.ts', 'r') as f:
    content = f.read()

# Fields to remove
old_fields = """  private _memStandards?: ReferenceStandard[];
  private _liveUnsub?: Unsubscribe;
  private _liveCallbacks: Array<() => void> = [];"""
content = content.replace(old_fields, "")

# Remove getAllStandards, startRealtimeDeltaListener, _mergeAndSave
start_idx = content.find("  async getAllStandards(): Promise<ReferenceStandard[]> {")
end_idx = content.find("  // --- EXCEL PARSER ---")

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + content[end_idx:]

# Add listenToStandards
new_methods = """  // --- Reference Standards (Delta Sync) ---
  listenToStandards(callback: (standards: ReferenceStandard[]) => void): Unsubscribe {
      return this.deltaSync.startListener<ReferenceStandard>({
          cacheKey: 'lims_reference_standards_cache_' + this.fb.APP_ID,
          cursorKey: 'lims_reference_standards_sync_seconds_' + this.fb.APP_ID,
          collectionPath: `artifacts/${this.fb.APP_ID}/reference_standards`,
          maxCacheSize: 3000,
          orderByField: 'received_date',
          orderDirection: 'desc'
      }, callback);
  }

"""
content = content.replace("  // --- EXCEL PARSER ---", new_methods + "  // --- EXCEL PARSER ---")

# Replace listenToRequests with Delta Sync
old_listen_req = """  listenToRequests(callback: (requests: StandardRequest[]) => void) {
      const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'standard_requests');
      // [WARN-2] Thêm limit(300) để tránh đọc không giới hạn khi collection lớn dần
      const q = query(colRef, orderBy('createdAt', 'desc'), limit(300));
      return onSnapshot(q, (snapshot) => {
          callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as StandardRequest)));
      });
  }"""
new_listen_req = """  listenToRequests(callback: (requests: StandardRequest[]) => void): Unsubscribe {
      return this.deltaSync.startListener<StandardRequest>({
          cacheKey: 'lims_all_standard_requests_cache_' + this.fb.APP_ID,
          cursorKey: 'lims_all_standard_requests_sync_seconds_' + this.fb.APP_ID,
          collectionPath: `artifacts/${this.fb.APP_ID}/standard_requests`,
          maxCacheSize: 1000,
          orderByField: 'createdAt',
          orderDirection: 'desc'
      }, callback);
  }"""
content = content.replace(old_listen_req, new_listen_req)

with open('src/app/features/standards/standard.service.ts', 'w') as f:
    f.write(content)

