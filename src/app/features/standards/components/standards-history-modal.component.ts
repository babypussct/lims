import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReferenceStandard, UsageLog } from '../../../core/models/standard.model';
import { StateService } from '../../../core/services/state.service';
import { formatNum } from '../../../shared/utils/utils';

@Component({
  selector: 'app-standards-history-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
      @if (historyStd()) {
         <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm fade-in">
            <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[85vh]">
               <div class="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center shrink-0">
                  <div><h3 class="font-bold text-slate-800 dark:text-slate-200 text-lg">Lịch sử sử dụng</h3><p class="text-xs text-slate-500 dark:text-slate-400 font-mono">{{historyStd()?.name}}</p></div>
                  <button (click)="onClose()" class="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition"><i class="fa-solid fa-times text-xl"></i></button>
               </div>
               <div class="flex-1 overflow-y-auto p-0 custom-scrollbar">
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
                                    <td class="px-6 py-4"><div class="font-bold text-slate-700 dark:text-slate-300 text-xs">{{ log.user }}</div></td>
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
            </div>
         </div>
      }
  `
})
export class StandardsHistoryModalComponent {
  state = inject(StateService);

  historyStd = input<ReferenceStandard | null>(null);
  historyLogs = input<UsageLog[]>([]);
  loadingHistory = input<boolean>(false);
  isProcessing = input<boolean>(false);

  closeModal = output<void>();
  deleteLogEvent = output<UsageLog>();

  formatNum = formatNum;

  onClose() {
    this.closeModal.emit();
  }

  onDeleteLog(log: UsageLog) {
    this.deleteLogEvent.emit(log);
  }
}
