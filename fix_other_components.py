import re

# Fix standard-requests.component.ts
with open('src/app/features/standards/requests/standard-requests.component.ts', 'r') as f:
    content = f.read()

old_req = """    this.stdService.loadStandardsWithDeltaSync().then((stds: ReferenceStandard[]) => {
      this.standards.set(stds);
      this.standardsMap = new Map(stds.map(s => [s.id, s]));
    });"""
new_req = """    const stds = this.stdService.getAllStandardsFromCache();
    if (stds && stds.length > 0) {
      this.standards.set(stds);
      this.standardsMap = new Map(stds.map(s => [s.id, s]));
    }"""
content = content.replace(old_req, new_req)

with open('src/app/features/standards/requests/standard-requests.component.ts', 'w') as f:
    f.write(content)

# Fix standard-detail.component.ts
with open('src/app/features/standards/standard-detail.component.ts', 'r') as f:
    content = f.read()

old_detail = """      const allStds = await this.stdService.loadStandardsWithDeltaSync();
      const siblings = allStds.filter(s => s.name === std.name && s.lot_number === std.lot_number && s.id !== std.id && !s._isDeleted && s.status !== 'DELETED');"""
new_detail = """      const allStds = this.stdService.getAllStandardsFromCache();
      const siblings = allStds.filter(s => s.name === std.name && s.lot_number === std.lot_number && s.id !== std.id && !s._isDeleted && s.status !== 'DELETED');"""
content = content.replace(old_detail, new_detail)

with open('src/app/features/standards/standard-detail.component.ts', 'w') as f:
    f.write(content)

