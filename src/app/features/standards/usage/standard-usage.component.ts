import { Component, inject, signal, computed, OnInit, OnDestroy, effect, Signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExportModalComponent } from '../../../shared/components/export-modal/export-modal.component';
import { StandardService } from '../standard.service';
import { UsageLog, ReferenceStandard } from '../../../core/models/standard.model';
import { Unsubscribe, QueryDocumentSnapshot } from 'firebase/firestore';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-standard-usage',
  standalone: true,
  imports: [CommonModule, FormsModule, ExportModalComponent],
  providers: [DatePipe, DecimalPipe],
  templateUrl: './standard-usage.component.html'
})
export class StandardUsageComponent implements OnInit, OnDestroy {
  stdService = inject(StandardService);
  datePipe = inject(DatePipe);
  decimalPipe = inject(DecimalPipe);
  auth = inject(AuthService);
  toast = inject(ToastService);
  confirmService = inject(ConfirmationService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  logs = signal<UsageLog[]>([]);
  isLoading = signal(true);
  isLoadingMore = signal(false);
  
  // Filters
  searchTerm = signal('');
  fromDate = signal('');
  toDate = signal('');
  userFilter = signal('');
  actionFilter = signal<'' | 'usage' | 'return' | 'import'>('');
  
  // Sort
  sortColumn = signal<'timestamp' | 'standardName' | 'amount_used' | 'user'>('timestamp');
  sortDirection = signal<'desc' | 'asc'>('desc');
  
  // Pagination & Server Query Mode
  dateQueryMode = signal(false);
  lastDoc = signal<QueryDocumentSnapshot | null>(null);
  hasMore = signal(false);
  displayLimit = signal(50); // Virtual limit if we have data locally
  showExportModal = signal(false);
  exportType = signal<'raw' | 'standard' | 'user'>('raw');
  isExporting = signal(false);
  exportCompleted = signal(false);

  allStandards = signal<ReferenceStandard[]>([]);
  private unregisterLiveListener?: () => void;
  private sub!: Unsubscribe;
  searchSubject = new Subject<string>();

  uniqueUsers = computed(() => {
      const users = new Set(this.logs().map(l => l.user).filter(Boolean));
      return [...users].sort();
  });

  filteredLogs = computed(() => {
     let result = this.logs();
     
     // Ẩn các log do HỆ THỐNG tự sinh ra (ví dụ: tự động trừ kho)
     result = result.filter(l => l.user !== 'HỆ THỐNG');
     
     const search = this.searchTerm().trim().toLowerCase();
     const user = this.userFilter();
     const action = this.actionFilter();
     // If dateQueryMode is false, we filter dates locally (for the 100 limit stream)
     const isLocalDateFilter = !this.dateQueryMode(); 

     if (search) {
         result = result.filter(l => 
             (l.standardName && l.standardName.toLowerCase().includes(search)) ||
             (l.user && l.user.toLowerCase().includes(search)) ||
             (l.lotNumber && l.lotNumber.toLowerCase().includes(search)) ||
             (l.purpose && l.purpose.toLowerCase().includes(search)) ||
             (l.internalId && l.internalId.toLowerCase().includes(search)) ||
             (l.manufacturer && l.manufacturer.toLowerCase().includes(search)) ||
             (l.cas_number && l.cas_number.toLowerCase().includes(search))
         );
     }

     if (user) {
         result = result.filter(l => l.user === user);
     }

     if (action) {
         if (action === 'usage') {
             result = result.filter(l => !l.purpose?.toLowerCase().includes('hoàn trả') && !l.purpose?.toLowerCase().includes('kiểm kho') && !l.purpose?.toLowerCase().includes('import'));
         } else if (action === 'return') {
             result = result.filter(l => l.purpose?.toLowerCase().includes('hoàn trả') || l.purpose?.toLowerCase().includes('kiểm kho'));
         } else if (action === 'import') {
             result = result.filter(l => l.purpose?.toLowerCase().includes('import'));
         }
     }

     if (isLocalDateFilter) {
         const from = this.fromDate();
         const to = this.toDate();
         if (from) {
             const fromTime = new Date(from).getTime();
             result = result.filter(l => (l.timestamp || 0) >= fromTime);
         }
         if (to) {
             const toTime = new Date(to).setHours(23, 59, 59, 999);
             result = result.filter(l => (l.timestamp || 0) <= toTime);
         }
     }

     // Sort
     const col = this.sortColumn();
     const dir = this.sortDirection() === 'asc' ? 1 : -1;
     
     result = [...result].sort((a, b) => {
         if (col === 'timestamp' || col === 'amount_used') {
             const valA = a[col] || 0;
             const valB = b[col] || 0;
             return (valA - valB) * dir;
         } else {
             const valA = (a[col] || '').toString().toLowerCase();
             const valB = (b[col] || '').toString().toLowerCase();
             return valA.localeCompare(valB) * dir;
         }
     });

     return result;
  });

  visibleLogs = computed(() => {
      return this.filteredLogs().slice(0, this.displayLimit());
  });

  summaryStats = computed(() => {
      const data = this.filteredLogs();
      const totals = new Map<string, number>();
      data.forEach(log => {
          const unit = log.normalized_unit || log.unit || 'không rõ';
          const amount = log.normalized_amount ?? log.amount_used ?? 0;
          totals.set(unit, (totals.get(unit) || 0) + amount);
      });
      return {
          totalLogs: data.length,
          totalAmountDisplay: [...totals.entries()]
            .sort(([unitA], [unitB]) => unitA.localeCompare(unitB))
            .map(([unit, amount]) => `${this.decimalPipe.transform(amount, '1.0-6')} ${unit}`)
            .join(' · ') || '0',
          uniqueUsers: new Set(data.map(l => l.user).filter(Boolean)).size,
          uniqueStandards: new Set(data.map(l => l.standardId).filter(Boolean)).size
      };
  });

  constructor() {
      // Setup Debounce Search
      this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()).subscribe(term => {
          this.searchTerm.set(term);
          this.displayLimit.set(50); // Reset pagination on search
      });

      // Effect: Server-side Date Query
      effect(() => {
          const from = this.fromDate();
          const to = this.toDate();

          if (from && to) {
              // Server-side query mode
              this.dateQueryMode.set(true);
              this.fetchByDateRange(from, to);
          } else if (!from && !to) {
              // Switch back to real-time stream if it was in dateQueryMode
              if (this.dateQueryMode()) {
                  this.dateQueryMode.set(false);
                  this.startRealTimeStream();
              }
          }
      }, { allowSignalWrites: true });

      // Effect: Sync state to URL Query Params
      effect(() => {
          const params: any = {};
          if (this.searchTerm()) params.q = this.searchTerm();
          if (this.fromDate()) params.from = this.fromDate();
          if (this.toDate()) params.to = this.toDate();
          if (this.userFilter()) params.user = this.userFilter();
          if (this.actionFilter()) params.action = this.actionFilter();

          this.router.navigate([], {
              relativeTo: this.route,
              queryParams: params,
              queryParamsHandling: 'merge',
              replaceUrl: true
          });
      });
  }

  ngOnInit() {
      // Restore state from URL
      const params = this.route.snapshot.queryParams;
      if (params['q']) { this.searchTerm.set(params['q']); (document.querySelector('input[placeholder]') as HTMLInputElement).value = params['q']; }
      if (params['from']) this.fromDate.set(params['from']);
      if (params['to']) this.toDate.set(params['to']);
      if (params['user']) this.userFilter.set(params['user']);
      if (params['action']) this.actionFilter.set(params['action'] as any);

      // Load reference standards for enriched exports
      const stds = this.stdService.getAllStandardsFromCache();
      if (stds && stds.length > 0) {
          this.allStandards.set(stds);
      }
      this.unregisterLiveListener = this.stdService.listenToStandards((stdsList) => {
          if (stdsList) {
              this.allStandards.set([...stdsList]);
          }
      });

      // Start stream if not in date query mode
      if (!this.fromDate() || !this.toDate()) {
          this.startRealTimeStream();
      }
  }

  ngOnDestroy() {
      if (this.sub) this.sub();
      if (this.unregisterLiveListener) this.unregisterLiveListener();
      this.searchSubject.complete();
  }

  onSearchInput(event: any) {
      this.searchSubject.next(event.target.value);
  }

  toggleSort(col: typeof this.sortColumn extends Signal<infer T> ? T : never) {
      if (this.sortColumn() === col) {
          this.sortDirection.update(d => d === 'asc' ? 'desc' : 'asc');
      } else {
          this.sortColumn.set(col);
          this.sortDirection.set('desc');
      }
      this.displayLimit.set(50); // Reset view limit when sorting
  }

  private startRealTimeStream() {
      if (this.sub) this.sub();
      this.isLoading.set(true);
      this.logs.set([]);
      this.sub = this.stdService.listenToGlobalUsageLogs((data) => {
          this.logs.set(data);
          this.isLoading.set(false);
          this.hasMore.set(data.length >= 1000); // Max cache size is 1000
          this.lastDoc.set(null);
      });
  }

  private async fetchByDateRange(from: string, to: string) {
      if (this.sub) { this.sub(); } // Stop real-time listener
      
      this.isLoading.set(true);
      try {
          const fromTs = new Date(from).getTime();
          const toTs = new Date(to).setHours(23, 59, 59, 999);
          const res = await this.stdService.queryUsageLogsByDateRange(fromTs, toTs, 500);
          
          this.logs.set(res.items);
          this.lastDoc.set(res.lastDoc);
          this.hasMore.set(res.hasMore);
      } catch (err: any) {
          this.toast.show('Lỗi tải dữ liệu: ' + err.message, 'error');
      } finally {
          this.isLoading.set(false);
          this.displayLimit.set(50);
      }
  }

  async loadMore() {
      // 1. If we have data locally but it's hidden by displayLimit, just increase limit
      if (this.filteredLogs().length > this.displayLimit()) {
          this.displayLimit.update(v => v + 50);
          return;
      }

      // 2. If we need to fetch more from server
      if (!this.hasMore()) return;

      this.isLoadingMore.set(true);
      try {
          let res;
          if (this.dateQueryMode() && this.fromDate() && this.toDate()) {
              const fromTs = new Date(this.fromDate()).getTime();
              const toTs = new Date(this.toDate()).setHours(23, 59, 59, 999);
              res = await this.stdService.queryUsageLogsByDateRange(fromTs, toTs, 500, this.lastDoc());
          } else {
              const timestamps = this.logs().map(log => log.timestamp || 0).filter(value => value > 0);
              const oldestTimestamp = timestamps.length ? Math.min(...timestamps) : Date.now();
              const older = await this.stdService.queryUsageLogsBeforeTimestamp(oldestTimestamp, 100);
              const knownIds = new Set(this.logs().map(log => log.id).filter(Boolean));
              const uniqueItems = older.items.filter(log => !log.id || !knownIds.has(log.id));
              if (uniqueItems.length > 0) {
                  this.logs.update(previous => [...previous, ...uniqueItems]);
                  this.hasMore.set(older.hasMore);
                  this.displayLimit.update(value => value + 100);
              } else {
                  this.hasMore.set(false);
              }
              return;
          }

          if (res.items.length > 0) {
              this.logs.update(prev => [...prev, ...res.items]);
              this.lastDoc.set(res.lastDoc);
              this.hasMore.set(res.hasMore);
              this.displayLimit.update(v => v + 50);
          } else {
              this.hasMore.set(false);
          }
      } catch(err: any) {
          this.toast.show('Lỗi tải thêm dữ liệu: ' + err.message, 'error');
      } finally {
          this.isLoadingMore.set(false);
      }
  }

  async deleteUsage(log: UsageLog) {
      if (!log.standardId || !log.id) {
          this.toast.show('Dữ liệu log không hợp lệ để xóa.', 'error');
          return;
      }
      
      const conf = await this.confirmService.confirm({
          message: `Dữ liệu thể tích "${log.amount_used} ${log.unit || ''}" sẽ được cộng dồn (rollback) trả lại vào kho. Bạn có chắc chắn xóa lịch sử sử dụng này không?`,
          confirmText: 'Đồng ý & Xóa',
          isDangerous: true
      });
      if (!conf) return;
      
      try {
          await this.stdService.deleteUsageLog(log.standardId, log.id, log.requestId);
          this.toast.show('Xóa thành công và hoàn trả thể tích tồn kho!', 'success');
          
          // Remove from local logs if in dateQueryMode (real-time stream will auto-update otherwise)
          if (this.dateQueryMode()) {
              this.logs.update(prev => prev.filter(l => l.id !== log.id));
          }
      } catch (err: any) {
          this.toast.show(`Lỗi: ${err.message}`, 'error');
      }
  }

  clearFilters() {
      this.searchTerm.set('');
      this.fromDate.set('');
      this.toDate.set('');
      this.userFilter.set('');
      this.actionFilter.set('');
      const searchInput = document.querySelector('input[placeholder]') as HTMLInputElement;
      if (searchInput) searchInput.value = '';
  }

  async runExport() {
      if (this.filteredLogs().length === 0) {
          this.toast.show('Không có dữ liệu để xuất.', 'info');
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
              const exportData = logs.map((log, index) => {
                  const std = this.allStandards().find(s => s.id === log.standardId);
                  return {
                      'STT': index + 1,
                      'Ngày sử dụng': this.datePipe.transform(log.timestamp, 'dd/MM/yyyy HH:mm'),
                      'Nhân viên': log.user,
                      'Tên chất chuẩn': log.standardName || 'N/A',
                      'Tên hóa học': std?.chemical_name || '',
                      'Số CAS': log.cas_number || std?.cas_number || '',
                      'Mã quản lý': log.internalId || std?.internal_id || '',
                      'Mã Catalog (Product Code)': std?.product_code || '',
                      'Lot Number': log.lotNumber || std?.lot_number || '',
                      'Độ tinh khiết': std?.purity || '',
                      'Hãng sản xuất': log.manufacturer || std?.manufacturer || '',
                      'Quy cách đóng gói': std?.pack_size || '',
                      'Lượng dùng': log.amount_used,
                      'Đơn vị': log.unit || std?.unit || 'mg',
                      'Lượng chuẩn hóa': log.normalized_amount ?? log.amount_used,
                      'Đơn vị chuẩn hóa': log.normalized_unit || log.unit || std?.unit || 'mg',
                      'Hạn sử dụng': std?.expiry_date || '',
                      'Ngày mở nắp': std?.date_opened || '',
                      'Vị trí lưu trữ': std?.location || '',
                      'Điều kiện bảo quản': std?.storage_condition || '',
                      'Link CoA / Chứng chỉ': std?.certificate_ref || '',
                      'Số hợp đồng': std?.contract_ref || '',
                      'Mục đích / Ghi chú': log.purpose || ''
                  };
              });
              const ws = XLSX.utils.json_to_sheet(exportData);
              // Auto-width columns for dynamic clean look
              const colWidths = Object.keys(exportData[0]).map(key => ({
                  wch: Math.max(key.length, ...exportData.map(row => String((row as any)[key] || '').length)) + 2
              }));
              ws['!cols'] = colWidths;
              XLSX.utils.book_append_sheet(wb, ws, 'Raw Data');
          } 
          else if (this.exportType() === 'standard') {
              const summary: any = {};
              logs.forEach(log => {
                  const unit = log.normalized_unit || log.unit || 'mg';
                  const key = log.standardId || `${log.standardName || 'N/A'}|${log.lotNumber || ''}|${unit}`;
                  if (!summary[key]) {
                      summary[key] = {
                          name: log.standardName || 'N/A',
                          lot: log.lotNumber || '',
                          amount: 0,
                          count: 0,
                          unit
                      };
                  }
                  summary[key].amount += (log.normalized_amount ?? log.amount_used ?? 0);
                  summary[key].count += 1;
              });
              const exportData = Object.keys(summary).map((key, index) => ({
                  'STT': index + 1,
                  'Hóa chất / Thuốc thử': summary[key].name,
                  'Số lô': summary[key].lot,
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
  }
}
