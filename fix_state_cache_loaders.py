import re

with open('src/app/core/services/state.service.ts', 'r') as f:
    content = f.read()

# Replace loadAllStandardRequests
old_load_all = """  async loadAllStandardRequests(): Promise<void> {
    try {
      const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'standard_requests');
      const q = query(colRef, orderBy('requestDate', 'desc'), limit(300));
      const snap = await getDocs(q);
      this.allStandardRequests.set(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { console.warn('loadAllStandardRequests error:', e); }
  }"""
new_load_all = """  async loadAllStandardRequests(): Promise<void> {
    try {
      const cacheKey = 'lims_all_standard_requests_cache_' + this.fb.APP_ID;
      const cached = this.deltaSync.getCache<any>(cacheKey);
      if (cached && cached.length > 0) {
        this.allStandardRequests.set(cached);
        return;
      }
      
      const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'standard_requests');
      const q = query(colRef, orderBy('requestDate', 'desc'), limit(300));
      const snap = await getDocs(q);
      this.allStandardRequests.set(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { console.warn('loadAllStandardRequests error:', e); }
  }"""
content = content.replace(old_load_all, new_load_all)

# Replace loadReferenceStandards
old_load_ref = """  async loadReferenceStandards(): Promise<void> {
    try {
      const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'reference_standards');
      const q = query(colRef, orderBy('received_date', 'desc'), limit(300));
      const snap = await getDocs(q);
      this.standards.set(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { console.warn('loadReferenceStandards error:', e); }
  }"""
new_load_ref = """  async loadReferenceStandards(): Promise<void> {
    try {
      const cacheKey = 'lims_reference_standards_cache_' + this.fb.APP_ID;
      const cached = this.deltaSync.getCache<any>(cacheKey);
      if (cached && cached.length > 0) {
        this.standards.set(cached);
        return;
      }
      
      const colRef = collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'reference_standards');
      const q = query(colRef, orderBy('received_date', 'desc'), limit(300));
      const snap = await getDocs(q);
      this.standards.set(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { console.warn('loadReferenceStandards error:', e); }
  }"""
content = content.replace(old_load_ref, new_load_ref)

with open('src/app/core/services/state.service.ts', 'w') as f:
    f.write(content)

