
import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StateService } from '../../core/services/state.service';
import { AuthService } from '../../core/services/auth.service';
import { PrintService, PrintJob } from '../../core/services/print.service';
import { Log } from '../../core/models/log.model';
import { formatDate } from '../../shared/utils/utils';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { FirebaseService } from '../../core/services/firebase.service';
import { getDocs, collection, query, where, documentId } from 'firebase/firestore';
import { ToastService } from '../../core/services/toast.service';
import { PrintQueueService } from '../../core/services/print-queue.service';
import { loadOrderedPrintJobs } from './print-queue.utils';
import { AppButtonComponent } from '../../shared/components/ui/button/button.component';
import { AppPageHeaderComponent } from '../../shared/components/ui/page-header/page-header.component';

@Component({
  selector: 'app-print-queue',
  standalone: true,
  imports: [CommonModule, SkeletonComponent, AppButtonComponent, AppPageHeaderComponent],
  template: `
    <div class="w-full space-y-6 pb-20 fade-in h-full flex flex-col">
        <app-page-header title="Hàng đợi in" icon="fa-print" subtitle="Chọn phiếu để xem trước và in theo thứ tự trong danh sách.">
            <div pageHeaderActions class="flex flex-wrap gap-2">
               @if(state.isAdmin()) {
                 <button (click)="deleteSelected()" [disabled]="selectedLogIds().size === 0"
                    class="px-4 py-2 bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-600 text-white rounded-lg font-bold shadow-sm dark:shadow-none transition text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    <i class="fa-solid fa-trash-can"></i> <span class="hidden md:inline">Xóa</span>
                 </button>
               }
               
               <app-button variant="secondary" (click)="printSelected()" [loading]="isPrinting()"
                  [disabled]="selectedLogIds().size === 0 || isLoading() || !!queue.error()">
                  <i class="fa-solid fa-print" aria-hidden="true"></i> Xem và in
               </app-button>
            </div>
        </app-page-header>

        @if (queue.error() || printError()) {
          <div role="alert" class="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">
            {{queue.error() || printError()}}
          </div>
        }

        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex-1 flex flex-col overflow-hidden">
            <div class="flex-1 overflow-y-auto p-2 md:hidden">
                @if(isLoading()) {
                    <div class="space-y-2" aria-label="Đang tải hàng đợi in">
                        @for(i of [1,2,3]; track i) {
                            <div class="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                                <div class="flex items-start gap-3">
                                    <app-skeleton shape="rect" width="40px" height="40px"></app-skeleton>
                                    <div class="min-w-0 flex-1 space-y-2">
                                        <app-skeleton width="80%" height="14px"></app-skeleton>
                                        <app-skeleton width="55%" height="11px"></app-skeleton>
                                        <app-skeleton width="70%" height="11px"></app-skeleton>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                } @else {
                    <div class="space-y-2">
                        @for (log of filteredLogs(); track log.id) {
                            <article class="rounded-xl border border-slate-200 p-3 transition dark:border-slate-700"
                                     [ngClass]="{'bg-blue-50 dark:bg-blue-900/20': selectedLogIds().has(log.id)}">
                                <div class="flex items-start gap-2.5">
                                    <label class="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900/60">
                                        <input type="checkbox"
                                               [checked]="selectedLogIds().has(log.id)"
                                               (change)="toggleSelection(log.id)"
                                               [attr.aria-label]="'Chọn phiếu in ' + (log.sopBasicInfo?.name || log.printData?.sop?.name || 'chưa có tên SOP')"
                                               class="h-5 w-5 cursor-pointer accent-blue-600 dark:accent-blue-500">
                                    </label>
                                    <div class="min-w-0 flex-1">
                                        <div class="break-words text-sm font-bold text-slate-800 dark:text-slate-100">
                                            {{ log.sopBasicInfo?.name || log.printData?.sop?.name || '---' }}
                                        </div>
                                        <div class="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                                            {{ log.sopBasicInfo?.category || log.printData?.sop?.category || '---' }}
                                        </div>
                                    </div>
                                </div>

                                <dl class="mt-3 grid grid-cols-1 gap-1.5 rounded-xl bg-slate-50 px-3 py-2 text-xs dark:bg-slate-900/50">
                                    <div class="flex min-w-0 items-start justify-between gap-3">
                                        <dt class="shrink-0 text-slate-400">Người duyệt</dt>
                                        <dd class="min-w-0 break-words text-right font-semibold text-slate-700 dark:text-slate-200">{{log.user}}</dd>
                                    </div>
                                    <div class="flex min-w-0 items-start justify-between gap-3">
                                        <dt class="shrink-0 text-slate-400">Thời gian</dt>
                                        <dd class="min-w-0 text-right text-slate-600 dark:text-slate-300">{{formatDate(log.timestamp)}}</dd>
                                    </div>
                                </dl>

                                <div class="mt-3 flex items-center justify-end gap-2 border-t border-slate-100 pt-2 dark:border-slate-700/70">
                                    <button type="button" (click)="printSingle(log)" [disabled]="isPrinting() || isLoading() || !!queue.error()" class="flex h-10 w-10 items-center justify-center rounded-xl text-indigo-600 transition hover:bg-indigo-50 disabled:opacity-50 dark:text-indigo-400 dark:hover:bg-indigo-950/30" aria-label="Xem và in phiếu này" title="Xem và in phiếu này">
                                        <i class="fa-solid fa-print" aria-hidden="true"></i>
                                    </button>
                                    @if (state.isAdmin()) {
                                        <button (click)="editBatch(log)" class="flex h-10 w-10 items-center justify-center rounded-xl text-emerald-600 transition hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30" aria-label="Sửa mẻ trước khi in" title="Sửa mẻ trước khi in">
                                            <i class="fa-solid fa-pen" aria-hidden="true"></i>
                                        </button>
                                        <button (click)="deleteSingle(log)" class="flex h-10 w-10 items-center justify-center rounded-xl text-red-500 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30" aria-label="Xóa phiếu này" title="Xóa phiếu này">
                                            <i class="fa-solid fa-trash" aria-hidden="true"></i>
                                        </button>
                                    }
                                </div>
                            </article>
                        } @empty {
                            <div class="py-16 text-center text-slate-400 dark:text-slate-500">
                                <i class="fa-solid fa-box-open mb-3 text-4xl text-slate-300 dark:text-slate-600" aria-hidden="true"></i>
                                <p>Không có phiếu in nào trong hàng đợi.</p>
                            </div>
                        }
                    </div>
                }
            </div>

            <div class="hidden flex-1 overflow-y-auto md:block">
                <table class="w-full text-sm text-left">
                    <thead class="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/50 sticky top-0 shadow-sm dark:shadow-none border-b border-slate-200 dark:border-slate-700">
                        <tr>
                            <th class="px-3 py-3 w-12 text-center">
                               <input type="checkbox" [checked]="areAllSelected()" (change)="toggleSelectAll()" class="w-4 h-4 accent-blue-600 dark:accent-blue-500 cursor-pointer">
                            </th>
                            <th class="px-4 py-3">Quy trình (SOP)</th>
                            <th class="px-4 py-3">Người duyệt</th>
                            <th class="px-4 py-3">Thời gian duyệt</th>
                            <th class="px-4 py-3 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50">
                        @if(isLoading()) {
                            @for(i of [1,2,3,4,5]; track i) {
                                <tr>
                                    <td class="px-3 py-3 text-center"><app-skeleton shape="rect" width="16px" height="16px" class="mx-auto"></app-skeleton></td>
                                    <td class="px-4 py-3">
                                        <app-skeleton width="150px" height="14px" class="mb-1"></app-skeleton>
                                        <app-skeleton width="80px" height="10px"></app-skeleton>
                                    </td>
                                    <td class="px-4 py-3"><app-skeleton width="100px" height="12px"></app-skeleton></td>
                                    <td class="px-4 py-3"><app-skeleton width="120px" height="12px"></app-skeleton></td>
                                    <td class="px-4 py-3 text-center flex justify-center gap-2">
                                        <app-skeleton shape="rect" width="30px" height="30px"></app-skeleton>
                                        <app-skeleton shape="rect" width="30px" height="30px"></app-skeleton>
                                    </td>
                                </tr>
                            }
                        } @else {
                            @for (log of filteredLogs(); track log.id) {
                                <tr class="transition hover:bg-slate-50 dark:hover:bg-slate-700/50" [ngClass]="{'bg-blue-50 dark:bg-blue-900/20': selectedLogIds().has(log.id)}">
                                    <td class="px-3 py-2 text-center">
                                    <input type="checkbox" [checked]="selectedLogIds().has(log.id)" (change)="toggleSelection(log.id)" class="w-4 h-4 accent-blue-600 dark:accent-blue-500 cursor-pointer">
                                    </td>
                                    <td class="px-4 py-2">
                                        <div class="font-bold text-slate-700 dark:text-slate-200">
                                            {{ log.sopBasicInfo?.name || log.printData?.sop?.name || '---' }}
                                        </div>
                                        <div class="text-xs text-slate-400 dark:text-slate-500">
                                            {{ log.sopBasicInfo?.category || log.printData?.sop?.category || '---' }}
                                        </div>
                                    </td>
                                    <td class="px-4 py-2 text-slate-600 dark:text-slate-300 font-medium">{{log.user}}</td>
                                    <td class="px-4 py-2 text-slate-500 dark:text-slate-400 text-xs">{{formatDate(log.timestamp)}}</td>
                                    <td class="px-4 py-2 text-center">
                                        <button type="button" (click)="printSingle(log)" [disabled]="isPrinting() || isLoading() || !!queue.error()" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 disabled:opacity-50 p-2 rounded-xl transition" aria-label="Xem và in phiếu này" title="Xem và in phiếu này">
                                            <i class="fa-solid fa-print"></i>
                                        </button>
                                        @if (state.isAdmin()) {
                                            <button (click)="editBatch(log)" class="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 p-2 rounded-md transition" title="Sửa mẻ trước khi in">
                                                <i class="fa-solid fa-pen"></i>
                                            </button>
                                            <button (click)="deleteSingle(log)" class="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-2 rounded-md transition" title="Xóa phiếu này">
                                                <i class="fa-solid fa-trash"></i>
                                            </button>
                                        }
                                    </td>
                                </tr>
                            } @empty {
                                <tr>
                                    <td colspan="5" class="text-center py-20 text-slate-400 dark:text-slate-500">
                                        <i class="fa-solid fa-box-open text-4xl mb-3 text-slate-300 dark:text-slate-600"></i>
                                        <p>Không có phiếu in nào trong hàng đợi.</p>
                                    </td>
                                </tr>
                            }
                        }
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  `
})
export class PrintQueueComponent implements OnInit {
  state = inject(StateService);
  auth = inject(AuthService); 
  printService = inject(PrintService);
  fb = inject(FirebaseService);
  toast = inject(ToastService);
  router = inject(Router);
  queue = inject(PrintQueueService);
  
  isLoading = computed(() => this.queue.loading());
  isPrinting = signal(false);
  printError = signal<string | null>(null);
  selectedLogIds = signal<Set<string>>(new Set());
  formatDate = formatDate;

  ngOnInit() {
      this.queue.ensureListener();
  }

  filteredLogs = computed(() => {
      return this.queue.printableLogs();
  });

  areAllSelected = computed(() => {
    const visibleLogs = this.filteredLogs();
    return visibleLogs.length > 0 && visibleLogs.every(log => this.selectedLogIds().has(log.id));
  });

  toggleSelection(logId: string) {
    this.selectedLogIds.update(currentSet => {
      const newSet = new Set(currentSet);
      if (newSet.has(logId)) newSet.delete(logId);
      else newSet.add(logId);
      return newSet;
    });
  }

  toggleSelectAll() {
    const visibleIds = this.filteredLogs().map(log => log.id);
    if (this.areAllSelected()) {
      this.selectedLogIds.set(new Set());
    } else {
      this.selectedLogIds.set(new Set(visibleIds));
    }
  }

  async fetchPrintData(logs: Log[]): Promise<PrintJob[]> {
    return loadOrderedPrintJobs(logs, async ids => {
      const q = query(collection(this.fb.db, `artifacts/${this.fb.APP_ID}/print_jobs`), where(documentId(), 'in', [...ids]));
      const snapshot = await getDocs(q);
      return new Map(snapshot.docs.map(document => [document.id, document.data()]));
    });
  }

  async printSingle(log: Log) {
    await this.openPrintPreview([log]);
  }

  async printSelected() {
    const ids = this.selectedLogIds();
    if (ids.size === 0) return;

    const logsToPrint = this.filteredLogs().filter(log => ids.has(log.id));
    if (logsToPrint.length !== ids.size) {
      this.printError.set('Một số phiếu đã chọn không còn trong hàng đợi. Vui lòng chọn lại phiếu cần in.');
      return;
    }
    await this.openPrintPreview(logsToPrint);
  }

  private async openPrintPreview(logs: Log[]): Promise<void> {
    if (this.isPrinting() || this.isLoading() || this.queue.error() || !logs.length) return;
    this.isPrinting.set(true);
    this.printError.set(null);
    try {
      const jobs = await this.fetchPrintData(logs);
      this.printService.openPreview(jobs);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không tải được dữ liệu in. Vui lòng thử lại.';
      this.printError.set(message);
      this.toast.show(message, 'error');
    } finally {
        this.isPrinting.set(false);
    }
  }

  async deleteSingle(log: Log) {
    await this.queue.remove(log);
  }

  editBatch(log: Log) {
    if (!log.requestId) {
      this.toast.show('Phiếu in cũ chưa có mã mẻ liên kết để chỉnh sửa.', 'warning');
      return;
    }
    this.router.navigate(['/calculator'], { queryParams: { editRequestId: log.requestId } });
  }

  async deleteSelected() {
    const ids = this.selectedLogIds();
    const logsToDelete = this.filteredLogs().filter(log => ids.has(log.id));
    
    if (logsToDelete.length > 0) {
        await this.queue.removeMany(logsToDelete);
        this.selectedLogIds.set(new Set());
    }
  }
}
