import re

with open('src/app/features/standards/usage/standard-usage.component.ts', 'r') as f:
    content = f.read()

# Replace hasMore logic in startRealTimeStream
old_start = """  private startRealTimeStream() {
      if (this.sub) this.sub();
      this.isLoading.set(true);
      this.logs.set([]);
      this.sub = this.stdService.listenToGlobalUsageLogs((data) => {
          this.logs.set(data);
          this.isLoading.set(false);
          this.hasMore.set(data.length === 100); // Because limit is 100
          this.lastDoc.set(null); // Snapshot listener doesn't expose last doc easily for us
      });
  }"""

new_start = """  private startRealTimeStream() {
      if (this.sub) this.sub();
      this.isLoading.set(true);
      this.logs.set([]);
      this.sub = this.stdService.listenToGlobalUsageLogs((data) => {
          this.logs.set(data);
          this.isLoading.set(false);
          this.hasMore.set(data.length >= 1000); // Max cache size is 1000
          this.lastDoc.set(null);
      });
  }"""
content = content.replace(old_start, new_start)

# Replace loadMore logic
old_load = """  async loadMore() {
      // 1. If we have data locally but it's hidden by displayLimit, just increase limit
      if (this.filteredLogs().length > this.displayLimit()) {
          this.displayLimit.update(v => v + 50);
          return;
      }
      
      if (this.isLoading() || !this.hasMore()) return;

      this.isLoading.set(true);
      try {
          let res;
          if (this.dateQueryMode()) {
              const fromTs = new Date(this.fromDate()).getTime();
              const toTs = new Date(this.toDate()).setHours(23, 59, 59, 999);
              res = await this.stdService.queryUsageLogsByDateRange(fromTs, toTs, 50, this.lastDoc());
          } else {
              res = await this.stdService.queryUsageLogsPage(50, this.lastDoc());
          }

          this.logs.update(v => [...v, ...res.items]);
          this.lastDoc.set(res.lastDoc);
          this.hasMore.set(res.hasMore);
          this.displayLimit.update(v => v + 50);
      } catch (err: any) {
          this.toast.show('Lỗi tải thêm dữ liệu: ' + err.message, 'error');
      } finally {
          this.isLoading.set(false);
      }
  }"""

new_load = """  async loadMore() {
      if (this.filteredLogs().length > this.displayLimit()) {
          this.displayLimit.update(v => v + 50);
          return;
      }
      
      if (this.isLoading() || !this.hasMore()) return;

      this.isLoading.set(true);
      try {
          let res;
          if (this.dateQueryMode()) {
              const fromTs = new Date(this.fromDate()).getTime();
              const toTs = new Date(this.toDate()).setHours(23, 59, 59, 999);
              res = await this.stdService.queryUsageLogsByDateRange(fromTs, toTs, 50, this.lastDoc());
          } else {
              // Delta sync fallback: fetch older than the oldest cached item
              const currentLogs = this.logs();
              if (currentLogs.length > 0) {
                  const oldestTs = currentLogs[currentLogs.length - 1].timestamp || Date.now();
                  res = await this.stdService.queryUsageLogsByDateRange(0, oldestTs - 1, 50, this.lastDoc());
              } else {
                  res = await this.stdService.queryUsageLogsPage(50, this.lastDoc());
              }
          }

          this.logs.update(v => {
              // Filter out duplicates if any
              const existingIds = new Set(v.map(l => l.id));
              const newItems = res.items.filter(l => !existingIds.has(l.id));
              return [...v, ...newItems];
          });
          this.lastDoc.set(res.lastDoc);
          this.hasMore.set(res.hasMore);
          this.displayLimit.update(v => v + 50);
      } catch (err: any) {
          this.toast.show('Lỗi tải thêm dữ liệu: ' + err.message, 'error');
      } finally {
          this.isLoading.set(false);
      }
  }"""

content = content.replace(old_load, new_load)

with open('src/app/features/standards/usage/standard-usage.component.ts', 'w') as f:
    f.write(content)
