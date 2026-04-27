import re

# Fix standards.component.ts
with open('src/app/features/standards/standards.component.ts', 'r') as f:
    content = f.read()

# Replace loadStandardsWithDeltaSync
old_load_delta = """      this.stdService.loadStandardsWithDeltaSync().then((items) => {
          this.allStandards.set(items);
          this.isSyncing.set(false);
          this.updateStandardsList();
      }).catch((e) => {
          this.isSyncing.set(false);
          // Nếu lỗi network, hiện fallback
          if(this.allStandards().length === 0) {
              this.allStandards.set([...this.stdService.getAllStandardsFromCache()]);
              this.updateStandardsList();
          }
      });"""
new_load_delta = """      const cached = this.stdService.getAllStandardsFromCache();
      if (cached && cached.length > 0) {
          this.allStandards.set(cached);
          this.updateStandardsList();
      }
      this.isSyncing.set(false);"""
content = content.replace(old_load_delta, new_load_delta)

# Replace startRealtimeDeltaListener
old_realtime = """      this.unsub = this.stdService.startRealtimeDeltaListener(() => {
          this.allStandards.set([...this.stdService.getAllStandardsFromCache()]);
          this.updateStandardsList();
      });"""
new_realtime = """      this.unsub = this.stdService.listenToStandards((items) => {
          this.allStandards.set([...items]);
          this.updateStandardsList();
      });"""
content = content.replace(old_realtime, new_realtime)

with open('src/app/features/standards/standards.component.ts', 'w') as f:
    f.write(content)


# Fix dashboard.component.ts
with open('src/app/features/dashboard/dashboard.component.ts', 'r') as f:
    content = f.read()

old_dash_realtime = """      this.stdService.startRealtimeDeltaListener(() => {
          // Lắng nghe để cập nhật ngày hết hạn sớm nhất khi kho chuẩn có thay đổi
          this.stdService.getNearestExpiry().then(std => this.nearestExpiry.set(std));
      });"""
new_dash_realtime = """      this.stdService.listenToStandards(() => {
          // Lắng nghe để cập nhật ngày hết hạn sớm nhất khi kho chuẩn có thay đổi
          this.stdService.getNearestExpiry().then(std => this.nearestExpiry.set(std));
      });"""
content = content.replace(old_dash_realtime, new_dash_realtime)

with open('src/app/features/dashboard/dashboard.component.ts', 'w') as f:
    f.write(content)

