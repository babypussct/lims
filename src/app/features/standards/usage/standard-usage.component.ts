import { Component, inject, signal, computed, OnInit, OnDestroy, effect, Signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExportModalComponent } from '../../../shared/components/export-modal/export-modal.component';
import { StandardService } from '../standard.service';
import { UsageLog } from '../../../core/models/standard.model';
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
  template: `
    <div class="flex flex-col space-y-4 fade-in h-full relative p-1 pb-6 custom-scrollbar overflow-y-auto overflow-x-hidden">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 px-2 mt-2">
        <div>
            <h1 class="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-3">
                <div class="w-10 h-10 rounded-2xl bg-fuchsia-600 text-white flex items-center justify-center shadow-lg shadow-fuchsia-200 dark:shadow-none transition-transform hover:scale-110">
                    <i class="fa-solid fa-clock-rotate-left text-lg"></i>
                </div>
                Nhật ký dùng chuẩn
            </h1>
            <p class="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1 ml-1">Lịch sử tiêu thụ và sử dụng hóa chất chuẩn toàn hệ thống</p>
        </div>
        <div class="flex gap-3 items-center">
             <button (click)="showExportModal.set(true); exportCompleted.set(false);" class="group px-5 py-2.5 bg-green-600 text-white hover:bg-green-700 rounded-2xl shadow-xl shadow-green-100 dark:shadow-none transition-all font-black text-xs flex items-center gap-2 active:scale-95">
                <i class="fa-solid fa-file-excel text-sm transition-transform"></i> Xuất Excel
             </button>
        </div>
      </div>

      <!-- Filters Row -->
      <div class="bg-white dark:bg-slate-800 mx-2 p-4 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 flex flex-wrap gap-4 items-end">
          <div class="flex-1 min-w-[200px]">
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Tìm kiếm</label>
              <div class="relative">
                  <i class="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                  <!-- Sử dụng (input) thay vì ngModelChange để debounce -->
                  <input type="text" [ngModel]="searchTerm()" (input)="onSearchInput($event)"
                         class="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-fuchsia-500 outline-none"
                         placeholder="Tên, lô, người dùng, ID...">
              </div>
          </div>
          
          <div class="w-40 min-w-[150px]">
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Nhân viên</label>
              <select [ngModel]="userFilter()" (ngModelChange)="userFilter.set($event)"
                      class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-fuchsia-500 outline-none">
                  <option value="">Tất cả</option>
                  @for (u of uniqueUsers(); track u) {
                      <option [value]="u">{{u}}</option>
                  }
              </select>
          </div>

          <div class="w-40 min-w-[150px]">
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Hành động</label>
              <select [ngModel]="actionFilter()" (ngModelChange)="actionFilter.set($event)"
                      class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-fuchsia-500 outline-none">
                  <option value="">Tất cả</option>
                  <option value="usage">Sử dụng</option>
                  <option value="return">Hoàn trả / Trừ kho</option>
                  <option value="import">Import Data</option>
              </select>
          </div>

          <div class="w-40 min-w-[150px]">
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Từ ngày</label>
              <input type="date" [ngModel]="fromDate()" (ngModelChange)="fromDate.set($event)"
                     class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-fuchsia-500 outline-none [color-scheme:light] dark:[color-scheme:dark]">
          </div>

          <div class="w-40 min-w-[150px]">
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Đến ngày</label>
              <input type="date" [ngModel]="toDate()" (ngModelChange)="toDate.set($event)"
                     class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-fuchsia-500 outline-none [color-scheme:light] dark:[color-scheme:dark]">
          </div>
          
          <button (click)="clearFilters()" *ngIf="searchTerm() || fromDate() || toDate() || userFilter() || actionFilter()" class="px-4 py-2.5 text-slate-400 hover:text-red-500 font-bold text-sm transition-colors rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20">
              Xóa lọc
          </button>
      </div>

      <!-- Filter Chips -->
      @if (searchTerm() || fromDate() || toDate() || userFilter() || actionFilter()) {
        <div class="flex flex-wrap gap-2 mx-2 -mt-1">
          @if (searchTerm()) {
            <div class="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-lg flex items-center gap-2 border border-indigo-100 dark:border-indigo-800/50">
                <i class="fa-solid fa-search text-[10px]"></i> "{{searchTerm()}}"
                <button (click)="searchTerm.set('')" class="hover:text-indigo-800 dark:hover:text-indigo-200 ml-1"><i class="fa-solid fa-xmark"></i></button>
            </div>
          }
          @if (userFilter()) {
            <div class="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-lg flex items-center gap-2 border border-blue-100 dark:border-blue-800/50">
                <i class="fa-solid fa-user text-[10px]"></i> {{userFilter()}}
                <button (click)="userFilter.set('')" class="hover:text-blue-800 dark:hover:text-blue-200 ml-1"><i class="fa-solid fa-xmark"></i></button>
            </div>
          }
          @if (actionFilter()) {
            <div class="px-3 py-1 bg-fuchsia-50 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400 text-xs font-bold rounded-lg flex items-center gap-2 border border-fuchsia-100 dark:border-fuchsia-800/50">
                <i class="fa-solid fa-tag text-[10px]"></i> {{actionFilter() === 'usage' ? 'Sử dụng' : actionFilter() === 'return' ? 'Hoàn trả / Trừ kho' : 'Import'}}
                <button (click)="actionFilter.set('')" class="hover:text-fuchsia-800 dark:hover:text-fuchsia-200 ml-1"><i class="fa-solid fa-xmark"></i></button>
            </div>
          }
          @if (fromDate() || toDate()) {
            <div class="px-3 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-lg flex items-center gap-2 border border-amber-100 dark:border-amber-800/50">
                <i class="fa-regular fa-calendar text-[10px]"></i> 
                {{fromDate() ? (fromDate() | date:'dd/MM/yyyy') : '...'}} <i class="fa-solid fa-arrow-right text-[10px] mx-1"></i> {{toDate() ? (toDate() | date:'dd/MM/yyyy') : '...'}}
                <button (click)="fromDate.set(''); toDate.set('')" class="hover:text-amber-800 dark:hover:text-amber-200 ml-1"><i class="fa-solid fa-xmark"></i></button>
            </div>
          }
        </div>
      }

      <!-- Summary Stats Bar -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mx-2">
          <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 flex items-center justify-center text-xl">
                  <i class="fa-solid fa-list"></i>
              </div>
              <div>
                  <div class="text-2xl font-black text-slate-800 dark:text-slate-100">{{summaryStats().totalLogs}}</div>
                  <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lượt sử dụng</div>
              </div>
          </div>
          <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-500 flex items-center justify-center text-xl">
                  <i class="fa-solid fa-droplet"></i>
              </div>
              <div>
                  <div class="text-2xl font-black text-slate-800 dark:text-slate-100">{{summaryStats().totalAmountUsed | number:'1.1-2'}}</div>
                  <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tổng tiêu hao</div>
              </div>
          </div>
          <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center text-xl">
                  <i class="fa-solid fa-users"></i>
              </div>
              <div>
                  <div class="text-2xl font-black text-slate-800 dark:text-slate-100">{{summaryStats().uniqueUsers}}</div>
                  <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nhân viên</div>
              </div>
          </div>
          <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 flex items-center justify-center text-xl">
                  <i class="fa-solid fa-vial"></i>
              </div>
              <div>
                  <div class="text-2xl font-black text-slate-800 dark:text-slate-100">{{summaryStats().uniqueStandards}}</div>
                  <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Chất chuẩn</div>
              </div>
          </div>
      </div>

      <!-- Cảnh báo chế độ Server-side Query -->
      @if (dateQueryMode()) {
          <div class="mx-2 px-5 py-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40 rounded-2xl flex items-center gap-3 text-blue-700 dark:text-blue-400 text-xs font-bold shrink-0">
              <i class="fa-solid fa-server text-sm"></i>
              <span>Đang truy xuất dữ liệu từ máy chủ theo khoảng ngày. (Giới hạn tối đa 500 kết quả). Xóa bộ lọc ngày để xem dữ liệu theo thời gian thực mới nhất.</span>
          </div>
      }

      <!-- Data Table -->
      <div class="flex flex-col bg-white dark:bg-slate-800 mx-2 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-700 overflow-hidden flex-1">
          <div class="flex-1 overflow-x-auto custom-scrollbar">
              <table class="w-full text-left border-separate border-spacing-0">
                  <thead class="bg-slate-50/50 dark:bg-slate-800/80 sticky top-0 z-30">
                      <tr>
                          <th (click)="toggleSort('timestamp')" class="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-700 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                              Ngày lưu / NV dùng
                              @if (sortColumn() === 'timestamp') { <i class="fa-solid ml-1" [class.fa-sort-up]="sortDirection() === 'asc'" [class.fa-sort-down]="sortDirection() === 'desc'"></i> }
                              @else { <i class="fa-solid fa-sort ml-1 opacity-30"></i> }
                          </th>
                          <th (click)="toggleSort('standardName')" class="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-700 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                              Thông tin chuẩn
                              @if (sortColumn() === 'standardName') { <i class="fa-solid ml-1" [class.fa-sort-up]="sortDirection() === 'asc'" [class.fa-sort-down]="sortDirection() === 'desc'"></i> }
                              @else { <i class="fa-solid fa-sort ml-1 opacity-30"></i> }
                          </th>
                          <th (click)="toggleSort('amount_used')" class="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-700 text-right cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                              Lượng tiêu hao
                              @if (sortColumn() === 'amount_used') { <i class="fa-solid ml-1" [class.fa-sort-up]="sortDirection() === 'asc'" [class.fa-sort-down]="sortDirection() === 'desc'"></i> }
                              @else { <i class="fa-solid fa-sort ml-1 opacity-30"></i> }
                          </th>
                          <th class="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-700">Mục đích</th>
                          <th class="px-6 py-4 text-center w-16 border-b border-slate-100 dark:border-slate-700"></th>
                      </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100/50 dark:divide-slate-800/50">
                      @if (isLoading() && visibleLogs().length === 0) {
                          @for(i of [1,2,3,4,5,6]; track i) {
                              <tr class="animate-pulse">
                                  <td colspan="5" class="px-6 py-4"><div class="h-10 bg-slate-100/50 dark:bg-slate-800/50 rounded-xl w-full"></div></td>
                              </tr>
                          }
                      } @else {
                          @for (log of visibleLogs(); track log.id) {
                              <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group">
                                  <td class="px-6 py-4">
                                      <div class="flex items-center gap-3">
                                          <div class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 flex items-center justify-center font-black text-xs border border-indigo-100/50 dark:border-indigo-800/30">
                                              {{(log.user || '?').charAt(0).toUpperCase()}}
                                          </div>
                                          <div>
                                              <div class="text-[13px] font-black text-slate-800 dark:text-slate-200">{{log.user || 'N/A'}}</div>
                                              <div class="text-[10px] font-bold text-slate-400">{{log.timestamp | date:'dd/MM/yyyy HH:mm'}}</div>
                                          </div>
                                      </div>
                                  </td>
                                  <td class="px-6 py-4">
                                      <div class="flex flex-col gap-0.5 max-w-[300px]">
                                          <span class="text-sm font-black text-slate-700 dark:text-slate-300 truncate transition" [ngClass]="log.standardId ? 'cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline' : ''" [title]="log.standardName || 'Không có tên'" (click)="log.standardId && router.navigate(['/standards', log.standardId])">
                                              {{log.standardName || '(Nhật ký cũ)'}}
                                          </span>
                                          <div class="flex flex-wrap gap-1.5 mt-1">
                                              @if(log.lotNumber) {
                                                  <span class="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[9px] font-bold text-slate-500">Lot: {{log.lotNumber}}</span>
                                              }
                                              @if(log.internalId) {
                                                  <span class="px-1.5 py-0.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded text-[9px] font-bold text-blue-600 dark:text-blue-400">{{log.internalId}}</span>
                                              }
                                              @if(log.manufacturer) {
                                                  <span class="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[9px] font-bold text-slate-500 truncate max-w-[80px]">{{log.manufacturer}}</span>
                                              }
                                          </div>
                                      </div>
                                  </td>
                                  <td class="px-6 py-4 text-right">
                                      <div class="text-sm font-black text-fuchsia-600 dark:text-fuchsia-400 flex flex-col items-end">
                                        -{{log.amount_used}} {{log.unit || 'mg'}}
                                      </div>
                                  </td>
                                  <td class="px-6 py-4">
                                      <span class="text-xs font-medium text-slate-600 dark:text-slate-400 italic line-clamp-2 max-w-[250px]" [title]="log.purpose || ''">
                                          {{log.purpose || 'Không ghi chú'}}
                                      </span>
                                  </td>
                                  <td class="px-6 py-4 text-center">
                                      @if (auth.canDeleteStandardLogs()) {
                                          <button (click)="deleteUsage(log)" class="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-500 dark:hover:text-rose-400 transition" title="Xóa & Hoàn trả Thể tích">
                                              <i class="fa-solid fa-trash text-[10px]"></i>
                                          </button>
                                      }
                                  </td>
                              </tr>
                          }
                          @if (visibleLogs().length === 0) {
                              <tr>
                                  <td colspan="5" class="px-6 py-16 text-center">
                                      <div class="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300 dark:text-slate-600">
                                          <i class="fa-solid fa-clock-rotate-left text-2xl"></i>
                                      </div>
                                      <div class="text-sm font-bold text-slate-400">Không có dữ liệu sử dụng nào phù hợp</div>
                                  </td>
                              </tr>
                          }
                      }
                  </tbody>
              </table>

              <!-- Load More -->
              @if ((hasMore() || filteredLogs().length > displayLimit()) && !isLoading()) {
                  <div class="p-6 text-center">
                      <button (click)="loadMore()" [disabled]="isLoadingMore()" class="px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2 mx-auto">
                          @if (isLoadingMore()) {
                              <i class="fa-solid fa-spinner fa-spin"></i> Đang tải...
                          } @else {
                              <i class="fa-solid fa-chevron-down"></i> Tải thêm dữ liệu
                          }
                      </button>
                  </div>
              }
          </div>
      </div>

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
    </div>
  `
})
export class StandardUsageComponent implements OnInit, OnDestroy {
  stdService = inject(StandardService);
  datePipe = inject(DatePipe);
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
      return {
          totalLogs: data.length,
          totalAmountUsed: data.reduce((sum, l) => sum + (l.amount_used || 0), 0),
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

      // Start stream if not in date query mode
      if (!this.fromDate() || !this.toDate()) {
          this.startRealTimeStream();
      }
  }

  ngOnDestroy() {
      if (this.sub) this.sub();
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
              res = await this.stdService.queryUsageLogsPage(50, this.lastDoc());
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
  }
}
