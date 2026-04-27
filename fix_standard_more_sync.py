import re

with open('src/app/features/standards/standard.service.ts', 'r') as f:
    content = f.read()

# Remove loadStandardsWithDeltaSync completely
start_idx = content.find("  async loadStandardsWithDeltaSync(): Promise<ReferenceStandard[]> {")
if start_idx != -1:
    end_idx = content.find("  // ─── DELTA SYNC: Live Listener Singleton", start_idx)
    if end_idx != -1:
        content = content[:start_idx] + content[end_idx:]

# Remove startRealtimeDeltaListener completely
start_idx = content.find("  // ─── DELTA SYNC: Live Listener Singleton")
if start_idx != -1:
    end_idx = content.find("  // ─── Cache Management ───", start_idx)
    if end_idx != -1:
        content = content[:start_idx] + content[end_idx:]

# Remove Cache Management (_mergeAndSave, _loadStdFromCache, _saveStdToCache)
start_idx = content.find("  // ─── Cache Management ───")
if start_idx != -1:
    end_idx = content.find("  // --- Legacy in-memory cache", start_idx)
    if end_idx != -1:
        content = content[:start_idx] + content[end_idx:]

# Remove _memStandards usage
start_idx = content.find("  // --- Legacy in-memory cache")
if start_idx != -1:
    end_idx = content.find("  // --- MIGRATION: Add Date Fields ---", start_idx)
    if end_idx != -1:
        content = content[:start_idx] + content[end_idx:]

# Update getNearestExpiry
old_getNearest = """  async getNearestExpiry(): Promise<ReferenceStandard | null> {
      try {
          const stds = await this.loadStandardsWithDeltaSync();
          const active = stds.filter(s => s.expiry_date && s.expiry_date !== '' && !s._isDeleted);
          if (active.length > 0) {
              return active.sort((a, b) => new Date(a.expiry_date!).getTime() - new Date(b.expiry_date!).getTime())[0];
          }
          return null;
      } catch (e: any) { return null; }
  }"""
new_getNearest = """  async getNearestExpiry(): Promise<ReferenceStandard | null> {
      try {
          const stds = this.deltaSync.getCache<ReferenceStandard>('lims_reference_standards_cache_' + this.fb.APP_ID);
          const active = stds.filter(s => s.expiry_date && s.expiry_date !== '' && !s._isDeleted);
          if (active.length > 0) {
              return active.sort((a, b) => new Date(a.expiry_date!).getTime() - new Date(b.expiry_date!).getTime())[0];
          }
          return null;
      } catch (e: any) { return null; }
  }"""
content = content.replace(old_getNearest, new_getNearest)

# Update getStandardById
old_getById = """  async getStandardById(stdId: string): Promise<ReferenceStandard | null> {
    // L1: In-memory cache
    if (this._memStandards) {
      const found = this._memStandards.find(s => s.id === stdId);
      if (found) return found;
    }
    // L2: localStorage cache
    const cached = this._loadStdFromCache();
    if (cached) {
      const found = cached.find(s => s.id === stdId);
      if (found) return found;
    }
    // L3: Firestore single doc read (1 read)
    try {
      const ref = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'reference_standards', stdId);
      const snap = await getDoc(ref);
      if (!snap.exists()) return null;
      const data = snap.data();
      if (data['_isDeleted'] === true || data['status'] === 'DELETED') return null;
      return { id: snap.id, ...data } as ReferenceStandard;
    } catch (e) {
      console.error('[StandardService] getStandardById error:', e);
      return null;
    }
  }"""
new_getById = """  async getStandardById(stdId: string): Promise<ReferenceStandard | null> {
    // L1: localStorage cache via DeltaSyncService
    const cached = this.deltaSync.getCache<ReferenceStandard>('lims_reference_standards_cache_' + this.fb.APP_ID);
    if (cached) {
      const found = cached.find(s => s.id === stdId);
      if (found) return found;
    }
    // L2: Firestore single doc read (1 read)
    try {
      const ref = doc(this.fb.db, 'artifacts', this.fb.APP_ID, 'reference_standards', stdId);
      const snap = await getDoc(ref);
      if (!snap.exists()) return null;
      const data = snap.data();
      if (data['_isDeleted'] === true || data['status'] === 'DELETED') return null;
      return { id: snap.id, ...data } as ReferenceStandard;
    } catch (e) {
      console.error('[StandardService] getStandardById error:', e);
      return null;
    }
  }"""
content = content.replace(old_getById, new_getById)

# Update getAllStandardsFromCache
old_getAllFromCache = """  getAllStandardsFromCache(): ReferenceStandard[] {
    if (this._memStandards) return this._memStandards;
    return this._loadStdFromCache() ?? [];
  }"""
new_getAllFromCache = """  getAllStandardsFromCache(): ReferenceStandard[] {
    return this.deltaSync.getCache<ReferenceStandard>('lims_reference_standards_cache_' + this.fb.APP_ID) ?? [];
  }"""
content = content.replace(old_getAllFromCache, new_getAllFromCache)

with open('src/app/features/standards/standard.service.ts', 'w') as f:
    f.write(content)

