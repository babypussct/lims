import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReferenceStandard, UsageLog } from '../../../core/models/standard.model';
import { StateService } from '../../../core/services/state.service';
import { AppModalShellComponent } from '../../../shared/components/ui/modal-shell/modal-shell.component';
import { formatNum } from '../../../shared/utils/utils';

@Component({
  selector: 'app-standards-history-modal',
  standalone: true,
  imports: [CommonModule, AppModalShellComponent],
  template: `
      @if (historyStd()) {
         <app-modal-shell
           title="Lịch sử sử dụng"
           [description]="historyStd()?.name || ''"
           size="xl"
           [showFooter]="false"
           (closed)="onClose()"
         >
            <div modalBody class="custom-scrollbar">
                  <!-- Mobile Cards View (< md) -->
                  <div class="md:hidden space-y-2.5">
                    @if (loadingHistory()) {
                      <div class="p-8 text-center text-slate-400 dark:text-slate-500"><i class="fa-solid fa-spinner fa-spin"></i> Đang tải...</div>
                    } @else {
                      @for (log of historyLogs(); track log.id) {
                        <div class="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 p-3.5 space-y-2">
                          <div class="flex items-start justify-between gap-2">
                            <div class="min-w-0">
                              <div class="flex flex-wrap items-center gap-1.5">
                                <span class="font-bold text-slate-800 dark:text-slate-100 text-xs">{{ log.user }}</span>
                                @if(log.isBackfill) {
                                  <span class="px-1.5 py-0.5 rounded bg-fuchsia-100 dark:bg-fuchsia-900/30 text-[9px] font-black uppercase tracking-wider text-fuchsia-600 dark:text-fuchsia-400">Nhập bù</span>
                                }
                              </div>
                              <div class="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">{{ log.date | date:'dd/MM/yyyy' }}</div>
                            </div>
                            <span class="shrink-0 font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2.5 py-1 rounded-lg text-xs">-{{ formatNum(log.amount_used) }} <span class="text-[10px] text-slate-500 dark:text-slate-400">{{log.unit || historyStd()?.unit}}</span></span>
                          </div>
                          <div class="flex items-end justify-between gap-2 pt-1.5 border-t border-slate-100 dark:border-slate-700/60">
                            <p class="text-xs italic text-slate-600 dark:text-slate-400 line-clamp-2 flex-1">{{ log.purpose || 'N/A' }}</p>
                            @if(state.isAdmin()){
                              <button type="button" (click)="onDeleteLog(log)" [disabled]="isProcessing()" aria-label="Xóa nhật ký" class="w-10 h-10 shrink-0 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-500 dark:text-red-400 hover:bg-red-100 transition flex items-center justify-center disabled:opacity-50"><i class="fa-solid fa-trash text-xs"></i></button>
                            }
                          </div>
                        </div>
                      } @empty {
                        <div class="p-8 text-center text-slate-400 dark:text-slate-500 italic text-xs">Chưa có dữ liệu.</div>
                      }
                    }
                  </div>

                  <!-- Desktop Table View (md+) -->
                  <div class="hidden md:block overflow-x-auto">
                  <table class="w-full text-sm text-left">
                    <thead class="bg-slate-50 dark:bg-slate-800/50 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase sticky top-0 border-b border-slate-100 dark:border-slate-800 shadow-sm">
                        <tr>
                            <th class="px-6 py-4 w-32">Thời gian</th>
                            <th class="px-6 py-4">Người thực hiện</th>
                            <th class="px-6 py-4">Mục đích</th>
                            <th class="px-6 py-4 text-right w-32">Lượng dùng</th>
                            @if(state.isAdmin()){<th class="px-6 py-4 text-center w-24">Tác vụ</th>}
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
                        @if (loadingHistory()) { 
                            <tr><td colspan="5" class="p-8 text-center text-slate-400 dark:text-slate-500"><i class="fa-solid fa-spinner fa-spin"></i> Đang tải...</td></tr> 
                        } @else {
                            @for (log of historyLogs(); track log.id) { 
                                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition group"> 
                                    <td class="px-6 py-4 text-slate-600 dark:text-slate-400 font-mono text-xs">{{ log.date | date:'dd/MM/yyyy' }}</td>
                                    <td class="px-6 py-4">
                                        <div class="font-bold text-slate-700 dark:text-slate-300 text-xs">{{ log.user }}</div>
                                        @if(log.isBackfill) {
                                            <div class="mt-1 text-[9px] font-black uppercase tracking-wider text-fuchsia-600 dark:text-fuchsia-400" [title]="'Nhập bởi ' + (log.backfilledByName || 'Quản lý')">
                                                <i class="fa-solid fa-clock-rotate-left mr-1"></i>Nhập bù
                                            </div>
                                        }
                                    </td>
                                    <td class="px-6 py-4"><div class="text-slate-600 dark:text-slate-400 text-xs italic line-clamp-2" [title]="log.purpose || ''">{{ log.purpose || 'N/A' }}</div></td>
                                    <td class="px-6 py-4 text-right"><span class="font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded text-xs">-{{ formatNum(log.amount_used) }} <span class="text-[9px] text-slate-500 dark:text-slate-400">{{log.unit || historyStd()?.unit}}</span></span></td>
                                    @if(state.isAdmin()){
                                        <td class="px-6 py-4 text-center"><button (click)="onDeleteLog(log)" [disabled]="isProcessing()" class="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-2 disabled:opacity-50"><i class="fa-solid fa-trash"></i></button></td>
                                    }
                                </tr> 
                        } @empty {
                                <tr><td colspan="5" class="p-8 text-center text-slate-400 dark:text-slate-500 italic">Chưa có dữ liệu.</td></tr> 
                            }
                        }
                  </tbody></table>
                  </div>
                  @if(hasMoreHistory()) {
                    <div class="p-4 text-center border-t border-slate-100 dark:border-slate-800">
                      <button (click)="loadMoreHistoryEvent.emit()" [disabled]="loadingMoreHistory()" class="min-h-[44px] sm:min-h-0 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-fuchsia-600 hover:border-fuchsia-300 disabled:opacity-50 transition">
                        @if(loadingMoreHistory()) { <i class="fa-solid fa-spinner fa-spin mr-1"></i> Đang tải... } @else { Tải thêm lịch sử }
                      </button>
                    </div>
                  }
            </div>
         </app-modal-shell>
      }
  `
})
export class StandardsHistoryModalComponent {
  state = inject(StateService);

  historyStd = input<ReferenceStandard | null>(null);
  historyLogs = input<UsageLog[]>([]);
  loadingHistory = input<boolean>(false);
  isProcessing = input<boolean>(false);
  hasMoreHistory = input<boolean>(false);
  loadingMoreHistory = input<boolean>(false);

  closeModal = output<void>();
  deleteLogEvent = output<UsageLog>();
  loadMoreHistoryEvent = output<void>();

  formatNum = formatNum;

  onClose() {
    this.closeModal.emit();
  }

  onDeleteLog(log: UsageLog) {
    this.deleteLogEvent.emit(log);
  }
}
