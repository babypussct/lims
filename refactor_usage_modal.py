import re

with open('src/app/features/standards/usage/standard-usage.component.ts', 'r') as f:
    content = f.read()

# Add ExportModalComponent to imports
if 'ExportModalComponent' not in content:
    content = content.replace(
        "import { FormsModule } from '@angular/forms';",
        "import { FormsModule } from '@angular/forms';\nimport { ExportModalComponent } from '../../../shared/components/export-modal/export-modal.component';"
    )
    content = content.replace(
        "imports: [CommonModule, FormsModule],",
        "imports: [CommonModule, FormsModule, ExportModalComponent],"
    )

# Add signals to the class
signals_str = """  displayLimit = signal(50);
  dateQueryMode = signal(false);"""
new_signals_str = """  displayLimit = signal(50);
  dateQueryMode = signal(false);
  
  showExportModal = signal(false);
  exportType = signal<'raw' | 'standard' | 'user'>('raw');
  isExporting = signal(false);
  exportCompleted = signal(false);"""
content = content.replace(signals_str, new_signals_str)

# Modify the exportExcel button to toggle the modal
old_button = """<button (click)="exportExcel()" class="group px-5 py-2.5 bg-green-600 text-white hover:bg-green-700 rounded-2xl shadow-xl shadow-green-100 dark:shadow-none transition-all font-black text-xs flex items-center gap-2 active:scale-95">"""
new_button = """<button (click)="showExportModal.set(true); exportCompleted.set(false);" class="group px-5 py-2.5 bg-green-600 text-white hover:bg-green-700 rounded-2xl shadow-xl shadow-green-100 dark:shadow-none transition-all font-black text-xs flex items-center gap-2 active:scale-95">"""
content = content.replace(old_button, new_button)

# Add the Export Modal HTML at the bottom of the template (before  `)
html_to_add = """
      <!-- EXPORT MODAL -->
      @if (showExportModal()) {
          <app-export-modal
              title="Xuất Nhật ký dùng chuẩn"
              [dateRangeText]="(fromDate() ? (fromDate() | date:'dd/MM/yyyy') : '') + (fromDate() || toDate() ? ' → ' : '') + (toDate() ? (toDate() | date:'dd/MM/yyyy') : '')"
              [isExporting]="isExporting()"
              [isCompleted]="exportCompleted()"
              (close)="showExportModal.set(false)"
              (execute)="runExport()">
              
              <div class="px-5 pb-5 space-y-2 mt-4">
                  <!-- 1. Raw Data -->
                  <div class="border rounded-2xl overflow-hidden transition-all" 
                       [class]="exportType() === 'raw' ? 'border-indigo-200 bg-indigo-50/30 dark:border-indigo-800 dark:bg-indigo-900/20' : 'border-slate-100 dark:border-slate-700'">
                      <button (click)="!isExporting() && exportType.set('raw'); exportCompleted.set(false)" [disabled]="isExporting()"
                              class="w-full flex items-center gap-3.5 p-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition">
                          <div class="w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 shadow-sm"
                               [class]="exportType() === 'raw' ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'">
                              <i class="fa-solid fa-list"></i>
                          </div>
                          <div class="flex-1 text-left">
                              <div class="text-sm font-black dark:text-slate-200" [class.text-indigo-700]="exportType() === 'raw'">1. Nhật ký chi tiết (Raw Data)</div>
                              <div class="text-[11px] text-slate-500">Toàn bộ lịch sử thao tác theo dòng thời gian</div>
                          </div>
                      </button>
                  </div>
                  
                  <!-- 2. By Standard -->
                  <div class="border rounded-2xl overflow-hidden transition-all" 
                       [class]="exportType() === 'standard' ? 'border-emerald-200 bg-emerald-50/30 dark:border-emerald-800 dark:bg-emerald-900/20' : 'border-slate-100 dark:border-slate-700'">
                      <button (click)="!isExporting() && exportType.set('standard'); exportCompleted.set(false)" [disabled]="isExporting()"
                              class="w-full flex items-center gap-3.5 p-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition">
                          <div class="w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 shadow-sm"
                               [class]="exportType() === 'standard' ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'">
                              <i class="fa-solid fa-flask"></i>
                          </div>
                          <div class="flex-1 text-left">
                              <div class="text-sm font-black dark:text-slate-200" [class.text-emerald-700]="exportType() === 'standard'">2. Tổng hợp theo Hóa chất</div>
                              <div class="text-[11px] text-slate-500">Tổng lượng dùng của từng mã hóa chất</div>
                          </div>
                      </button>
                  </div>

                  <!-- 3. By User -->
                  <div class="border rounded-2xl overflow-hidden transition-all" 
                       [class]="exportType() === 'user' ? 'border-orange-200 bg-orange-50/30 dark:border-orange-800 dark:bg-orange-900/20' : 'border-slate-100 dark:border-slate-700'">
                      <button (click)="!isExporting() && exportType.set('user'); exportCompleted.set(false)" [disabled]="isExporting()"
                              class="w-full flex items-center gap-3.5 p-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition">
                          <div class="w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 shadow-sm"
                               [class]="exportType() === 'user' ? 'bg-orange-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'">
                              <i class="fa-solid fa-users"></i>
                          </div>
                          <div class="flex-1 text-left">
                              <div class="text-sm font-black dark:text-slate-200" [class.text-orange-700]="exportType() === 'user'">3. Tổng hợp theo Nhân viên</div>
                              <div class="text-[11px] text-slate-500">Tần suất và tổng lượng dùng theo từng nhân viên</div>
                          </div>
                      </button>
                  </div>
              </div>
          </app-export-modal>
      }
"""
content = content.replace("    </div>\n  `", html_to_add + "    </div>\n  `")

# Replace exportExcel logic with runExport
old_export = """  async exportExcel() {
      if (this.filteredLogs().length === 0) return;
      
      try {
          const XLSX = await import('xlsx');
          const exportData = this.filteredLogs().map((log, index) => ({
              'STT': index + 1,
              'Ngày sử dụng': this.datePipe.transform(log.timestamp, 'dd/MM/yyyy HH:mm'),
              'Nhân viên': log.user,
              'Tên chất chuẩn': log.standardName || 'N/A',
              'Lot Number': log.lotNumber || '',
              'Mã phòng Lab': log.internalId || '',
              'Số CAS': log.cas_number || '',
              'Hãng sản xuất': log.manufacturer || '',
              'Lượng dùng': log.amount_used,
              'Đơn vị': log.unit || 'mg',
              'Mục đích / Ghi chú': log.purpose || ''
          }));

          const ws = XLSX.utils.json_to_sheet(exportData);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'NhatKySuDung');
          
          XLSX.writeFile(wb, `Nhat_Ky_Chuan_${this.datePipe.transform(Date.now(), 'yyyyMMdd_HHmm')}.xlsx`);
      } catch (err) {
          console.error('Lỗi khi xuất Excel:', err);
          this.toast.show('Lỗi xuất file Excel', 'error');
      }
  }"""

new_export = """  async runExport() {
      if (this.filteredLogs().length === 0) {
          this.toast.show('Không có dữ liệu để xuất.', 'warning');
          return;
      }
      
      this.isExporting.set(true);
      this.exportCompleted.set(false);
      
      try {
          const XLSX = await import('xlsx');
          const wb = XLSX.utils.book_new();
          const logs = this.filteredLogs();

          if (this.exportType() === 'raw') {
              // Background batching for thousands of rows to prevent UI block
              // Actually for now we just process it directly since it's already in memory
              const exportData = logs.map((log, index) => ({
                  'STT': index + 1,
                  'Ngày sử dụng': this.datePipe.transform(log.timestamp, 'dd/MM/yyyy HH:mm'),
                  'Nhân viên': log.user,
                  'Tên chất chuẩn': log.standardName || 'N/A',
                  'Lot Number': log.lotNumber || '',
                  'Mã phòng Lab': log.internalId || '',
                  'Số CAS': log.cas_number || '',
                  'Hãng sản xuất': log.manufacturer || '',
                  'Lượng dùng': log.amount_used,
                  'Đơn vị': log.unit || 'mg',
                  'Mục đích / Ghi chú': log.purpose || ''
              }));
              const ws = XLSX.utils.json_to_sheet(exportData);
              XLSX.utils.book_append_sheet(wb, ws, 'Raw Data');
          } 
          else if (this.exportType() === 'standard') {
              const summary: any = {};
              logs.forEach(log => {
                  const key = log.standardName || 'N/A';
                  if (!summary[key]) summary[key] = { amount: 0, count: 0, unit: log.unit || 'mg' };
                  summary[key].amount += (log.amount_used || 0);
                  summary[key].count += 1;
              });
              const exportData = Object.keys(summary).map((key, index) => ({
                  'STT': index + 1,
                  'Hóa chất / Thuốc thử': key,
                  'Số lượt dùng': summary[key].count,
                  'Tổng Lượng Dùng': summary[key].amount,
                  'Đơn vị': summary[key].unit
              }));
              const ws = XLSX.utils.json_to_sheet(exportData);
              XLSX.utils.book_append_sheet(wb, ws, 'Theo Hoa Chat');
          }
          else if (this.exportType() === 'user') {
              const summary: any = {};
              logs.forEach(log => {
                  const key = log.user || 'N/A';
                  if (!summary[key]) summary[key] = { count: 0 };
                  summary[key].count += 1;
              });
              const exportData = Object.keys(summary).map((key, index) => ({
                  'STT': index + 1,
                  'Nhân viên': key,
                  'Số lượt thực hiện': summary[key].count
              }));
              const ws = XLSX.utils.json_to_sheet(exportData);
              XLSX.utils.book_append_sheet(wb, ws, 'Theo Nhan Vien');
          }
          
          XLSX.writeFile(wb, `NhatKyChuan_${this.exportType()}_${this.datePipe.transform(Date.now(), 'yyyyMMdd_HHmm')}.xlsx`);
          
          this.exportCompleted.set(true);
      } catch (err) {
          console.error('Lỗi khi xuất Excel:', err);
          this.toast.show('Lỗi xuất file Excel', 'error');
      } finally {
          this.isExporting.set(false);
      }
  }"""

content = content.replace(old_export, new_export)

with open('src/app/features/standards/usage/standard-usage.component.ts', 'w') as f:
    f.write(content)

