
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../services/state.service';
import { cleanName, formatNum, formatDate } from '../utils/utils';

@Component({
  selector: 'app-request-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-5xl mx-auto space-y-6 pb-20 fade-in">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <i class="fa-solid fa-list-check text-blue-500"></i> Quản lý Yêu cầu
            </h2>
            
            <div class="flex bg-slate-200 p-1 rounded-lg self-start">
               <button (click)="currentTab.set('pending')" 
                  class="px-4 py-1.5 text-sm font-bold rounded-md transition flex items-center gap-2"
                  [class]="currentTab() === 'pending' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'">
                  <i class="fa-solid fa-clock"></i> Chờ duyệt ({{state.requests().length}})
               </button>
               <button (click)="currentTab.set('approved')"
                  class="px-4 py-1.5 text-sm font-bold rounded-md transition flex items-center gap-2"
                  [class]="currentTab() === 'approved' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'">
                  <i class="fa-solid fa-check-double"></i> Lịch sử ({{state.approvedRequests().length}})
               </button>
            </div>
        </div>

        <div class="grid gap-4">
            @for (req of displayRequests(); track req.id) {
                <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 transition hover:shadow-md">
                    <div class="flex-1">
                        <div class="flex items-center gap-3 mb-2">
                             @if (req.status === 'pending') {
                                <span class="px-2 py-0.5 rounded bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider">Chờ duyệt</span>
                                <span class="text-xs text-slate-400">{{formatDate(req.timestamp)}}</span>
                             } @else {
                                <span class="px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider">Đã duyệt</span>
                                <span class="text-xs text-slate-400">{{formatDate(req.approvedAt || req.timestamp)}}</span>
                             }
                        </div>
                        <h3 class="font-bold text-slate-800 text-lg mb-1">{{req.sopName}}</h3>
                        <div class="text-sm text-slate-500 mb-3">Người yêu cầu: <span class="font-medium text-slate-700">{{req.user || 'Unknown'}}</span></div>
                        
                        <div class="bg-slate-50 rounded-lg p-3 border border-slate-100">
                             <table class="w-full text-sm">
                                <tr class="text-xs text-slate-400 uppercase text-left">
                                    <th class="pb-1">Hóa chất</th>
                                    <th class="pb-1 text-right">Số lượng</th>
                                </tr>
                                @for (item of req.items; track item.name) {
                                    <tr class="border-t border-slate-100">
                                        <td class="py-1.5 font-medium text-slate-700">{{cleanName(item.name)}}</td>
                                        <td class="py-1.5 text-right font-bold text-slate-600">
                                            {{formatNum(item.displayAmount)}} <span class="text-[10px] text-slate-400 font-normal">{{item.unit}}</span>
                                        </td>
                                    </tr>
                                }
                             </table>
                        </div>
                    </div>
                    
                    <!-- Action Buttons: Only visible to Admins (Managers) -->
                    @if(state.isAdmin()) {
                        <div class="flex flex-row md:flex-col gap-2 shrink-0 md:w-32">
                            @if (currentTab() === 'pending') {
                                <button (click)="state.approveRequest(req)" class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-sm transition text-sm flex items-center justify-center gap-2">
                                    <i class="fa-solid fa-check"></i> Duyệt
                                </button>
                                <button (click)="state.rejectRequest(req)" class="flex-1 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg font-bold transition text-sm flex items-center justify-center gap-2">
                                    <i class="fa-solid fa-xmark"></i> Từ chối
                                </button>
                            } @else {
                                <button (click)="state.revokeApproval(req)" class="flex-1 px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg font-bold shadow-sm transition text-sm flex items-center justify-center gap-2 group">
                                    <i class="fa-solid fa-rotate-left group-hover:-rotate-90 transition"></i> Hoàn tác
                                </button>
                            }
                        </div>
                    } @else {
                        <!-- Status Badge for Staff -->
                        <div class="flex flex-col items-center justify-center w-32 shrink-0 text-slate-400 gap-1 opacity-50">
                            <i class="fa-solid fa-lock text-xl"></i>
                            <span class="text-[10px] uppercase font-bold text-center">Manager<br>Access Only</span>
                        </div>
                    }
                </div>
            } @empty {
                <div class="text-center py-20 bg-white rounded-xl border border-slate-200 border-dashed">
                    <i class="fa-solid fa-clipboard-check text-4xl text-slate-300 mb-3"></i>
                    <p class="text-slate-500">
                        {{ currentTab() === 'pending' ? 'Không có yêu cầu nào đang chờ.' : 'Chưa có lịch sử phê duyệt.' }}
                    </p>
                </div>
            }
        </div>
    </div>
  `
})
export class RequestListComponent {
  state = inject(StateService);
  cleanName = cleanName;
  formatNum = formatNum;
  formatDate = formatDate;

  currentTab = signal<'pending' | 'approved'>('pending');

  displayRequests = computed(() => {
    return this.currentTab() === 'pending' 
        ? this.state.requests() 
        : this.state.approvedRequests();
  });
}
