import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StandardRequest } from '../../../../core/models/standard.model';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-requests-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex-1 overflow-x-auto custom-scrollbar">
        <table class="w-full text-left border-separate border-spacing-0">
            <thead class="bg-white dark:bg-slate-800 sticky top-0 z-30">
                <tr>
                    <th class="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-50 dark:border-slate-700">Thông tin chuẩn đối chiếu</th>
                    <th class="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-50 dark:border-slate-700">Người mượn & Hoạt động</th>
                    <th class="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-50 dark:border-slate-700">Mốc thời gian</th>
                    <th class="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-50 dark:border-slate-700 text-center">Trạng thái</th>
                    <th class="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-50 dark:border-slate-700 text-center">Xác nhận</th>
                    <th class="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-50 dark:border-slate-700 text-center">Thao tác</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
                @if (isLoading) {
                    @for(i of [1,2,3,4,5]; track i) {
                        <tr class="animate-pulse">
                            <td colspan="6" class="px-6 py-4"><div class="h-12 bg-slate-50 dark:bg-slate-800/50 rounded-2xl w-full"></div></td>
                        </tr>
                    }
                } @else {
                    @for (req of requests; track req.id) {
                        <tr class="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                            <td class="px-6 py-5">
                                    <div class="flex flex-col gap-3">
                                        <div class="flex items-start gap-3">
                                            <div class="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-800 shadow-sm">
                                                <i class="fa-solid fa-vial-circle-check text-sm font-bold"></i>
                                            </div>
                                            <div>
                                                <div class="font-black text-slate-800 dark:text-slate-100 text-[14px] leading-tight mb-1">{{req.standardName}}</div>
                                                <div class="flex items-center gap-2">
                                                    <span class="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black rounded-lg border border-indigo-100/50 dark:border-indigo-800/30">
                                                        {{req.standardDetails?.internal_id}}
                                                    </span>
                                                    <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 line-clamp-1 italic max-w-[150px]">
                                                        {{req.standardDetails?.manufacturer}}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <!-- Standard Meta Grid (Rich Identity) -->
                                        <div class="grid grid-cols-2 gap-2 mt-1">
                                            <div class="px-2.5 py-1.5 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800/50 flex flex-col gap-0.5">
                                                <span class="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Số Lô (LOT)</span>
                                                <span class="text-[11px] font-black text-blue-600 dark:text-blue-400 truncate">{{req.lotNumber || 'N/A'}}</span>
                                            </div>
                                            <div class="px-2.5 py-1.5 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800/50 flex flex-col gap-0.5">
                                                <span class="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">CAS Number</span>
                                                <span class="text-[11px] font-black text-teal-600 dark:text-teal-400 truncate">{{req.standardDetails?.cas_number || 'N/A'}}</span>
                                            </div>
                                            <div class="px-2.5 py-1.5 rounded-xl border flex flex-col gap-0.5" 
                                                    [class]="isExpOverdue(req.standardDetails?.expiry_date) ? 'bg-rose-50/50 border-rose-100 dark:bg-rose-900/20 dark:border-rose-800/30' : 'bg-slate-50/50 border-slate-100 dark:bg-slate-900/30 dark:border-slate-800/50'">
                                                <span class="text-[8px] font-black uppercase tracking-widest" [class.text-rose-500]="isExpOverdue(req.standardDetails?.expiry_date)" [class.text-slate-400]="!isExpOverdue(req.standardDetails?.expiry_date)">Hạn dùng (EXP)</span>
                                                <span class="text-[11px] font-black" [class.text-rose-600]="isExpOverdue(req.standardDetails?.expiry_date)" [class.text-slate-700]="!isExpOverdue(req.standardDetails?.expiry_date)">{{req.standardDetails?.expiry_date | date:'dd/MM/yyyy'}}</span>
                                            </div>
                                            <div class="px-2.5 py-1.5 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800/50 flex flex-col gap-1">
                                                <span class="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Tồn kho / Vị trí</span>
                                                <div class="text-[11px] leading-snug">
                                                    <span class="font-black text-slate-700 dark:text-slate-300">{{req.standardDetails?.current_amount}}{{req.standardDetails?.unit}}</span>
                                                    <span class="text-slate-400 mx-1">•</span>
                                                    <span class="font-bold text-slate-600 dark:text-slate-400 break-words">{{req.standardDetails?.location || '?'}}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            <td class="px-6 py-5">
                                <div class="flex items-start gap-3">
                                    <div class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 uppercase font-black text-[10px] shrink-0 border border-placeholder">
                                        {{req.requestedByName.charAt(0)}}
                                    </div>
                                    <div>
                                        <div class="font-black text-slate-700 dark:text-slate-300 text-xs mb-0.5">{{req.requestedByName}}</div>
                                        <div class="text-[11px] text-slate-500 dark:text-slate-400 font-medium italic line-clamp-1 max-w-[200px]" [title]="req.purpose">{{req.purpose}}</div>
                                        @if(req.totalAmountUsed) {
                                            <div class="mt-2 flex items-center gap-2">
                                                <div class="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden w-24">
                                                    <div class="h-full bg-rose-500 rounded-full" [style.width.%]="(req.totalAmountUsed / (req.expectedAmount || 1)) * 100"></div>
                                                </div>
                                                <span class="text-[11px] font-black text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30 px-2 py-0.5 rounded-lg border border-rose-100 dark:border-rose-900/30 whitespace-nowrap shadow-sm">Đã dùng: {{req.totalAmountUsed}} {{req.standardDetails?.unit || ''}}</span>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-5">
                                <div class="space-y-1.5">
                                    <div class="flex items-center gap-2 text-[10px]">
                                        <span class="w-12 text-slate-400 dark:text-slate-500 font-black uppercase">Yêu cầu:</span>
                                        <span class="text-slate-700 dark:text-slate-300 font-bold whitespace-nowrap">{{req.requestDate | date:'dd/MM/yyyy HH:mm'}}</span>
                                    </div>
                                    @if(req.expectedReturnDate) {
                                        <div class="flex items-center gap-2 text-[10px]">
                                            <span class="w-12 text-slate-400 dark:text-slate-500 font-black uppercase">Dự kiến:</span>
                                            <span class="font-bold whitespace-nowrap" [class.text-rose-500]="isOverdue(req)">
                                                {{req.expectedReturnDate | date:'dd/MM/yyyy'}}
                                            </span>
                                        </div>
                                    }
                                </div>
                            </td>
                            <td class="px-6 py-5 text-center">
                                <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-[9px] font-black uppercase tracking-widest border shadow-sm" [ngClass]="getStatusClass(req.status)">
                                    <i [class]="getStatusIcon(req.status)"></i>
                                    {{getStatusLabel(req.status)}}
                                </div>
                            </td>
                            <td class="px-6 py-5 text-center">
                                <div class="flex flex-col gap-1 items-center">
                                    @if(req.approvedByName) {
                                        <div class="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[9px] font-black rounded-lg border border-emerald-100/50 dark:border-emerald-800/30 whitespace-nowrap">
                                            <i class="fa-solid fa-stamp mr-1"></i>Duyệt: {{req.approvedByName}}
                                        </div>
                                    }
                                    @if(req.receivedByName) {
                                        <div class="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[9px] font-black rounded-lg border border-blue-100/50 dark:border-blue-800/30 whitespace-nowrap">
                                            <i class="fa-solid fa-check-double mr-1"></i>Nhận: {{req.receivedByName}}
                                        </div>
                                    }
                                    @if(!req.approvedByName && !req.receivedByName) {
                                        <span class="text-[10px] text-slate-300 dark:text-slate-600 font-black italic">Trống</span>
                                    }
                                </div>
                            </td>
                            <td class="px-6 py-5 text-center">
                                <!-- Quick Actions -->
                                <div class="flex items-center justify-center gap-1">
                                    @if(req.status === 'PENDING_APPROVAL' && auth.canApproveStandards()) {
                                        <button (click)="actionApprove.emit(req)" 
                                                class="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-500/20 active:scale-90" 
                                                title="Duyệt & Giao"><i class="fa-solid fa-check"></i></button>
                                        <button (click)="actionReject.emit(req)" 
                                                class="p-2 bg-rose-100 text-rose-600 rounded-xl hover:bg-rose-200 transition active:scale-90" 
                                                title="Từ chối"><i class="fa-solid fa-times"></i></button>
                                    }
                                    @if(req.status === 'IN_PROGRESS') {
                                        @if(req.requestedBy === auth.currentUser()?.uid) {
                                            <button (click)="actionLogUsage.emit(req)" 
                                                    class="p-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition shadow-lg shadow-teal-500/20 active:scale-90" 
                                                    title="Ghi nhận dùng"><i class="fa-solid fa-pen-nib"></i></button>
                                            <button (click)="actionReturn.emit({req, isForce: false})" 
                                                    class="p-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition shadow-lg shadow-amber-500/20 active:scale-90 ml-1" 
                                                    title="Báo cáo trả"><i class="fa-solid fa-reply"></i></button>
                                        }
                                        @if(auth.canApproveStandards() && req.requestedBy !== auth.currentUser()?.uid) {
                                            <button (click)="actionReturn.emit({req, isForce: true})" 
                                                    class="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition active:scale-90 ml-1" 
                                                    title="Thu hồi trực tiếp"><i class="fa-solid fa-hand-holding-hand"></i></button>
                                        }
                                    }
                                    @if(req.status === 'PENDING_RETURN' && auth.canApproveStandards()) {
                                        <button (click)="actionAdminReceive.emit(req)" 
                                                class="px-3 py-1.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/20 active:scale-90 text-[10px] font-black" 
                                                title="Tiếp nhận trả"><i class="fa-solid fa-check-to-slot mr-1"></i>NHẬN TRẢ</button>
                                    }
                                    @if(req.status === 'COMPLETED' || req.status === 'REJECTED') {
                                        <button class="p-2 text-slate-300 dark:text-slate-600 bg-slate-50 dark:bg-slate-900/50 rounded-xl cursor-default" title="Đã khóa"><i class="fa-solid fa-lock"></i></button>
                                    }
                                    @if(auth.canDeleteStandardLogs()) {
                                        <button (click)="actionDelete.emit(req)" 
                                                class="p-2 text-rose-300 hover:text-rose-600 bg-rose-50/50 dark:bg-rose-900/20 rounded-xl transition active:scale-90 ml-1" 
                                                title="Xóa yêu cầu & Hoàn tác tồn kho"><i class="fa-solid fa-trash-can"></i></button>
                                    }
                                </div>
                            </td>
                        </tr>
                    } 
                    @if (requests.length === 0) { 
                        <tr>
                            <td colspan="6" class="px-6 py-24 text-center">
                                <div class="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto mb-4 text-slate-200 dark:text-slate-800 border-2 border-dashed border-slate-100 dark:border-slate-800">
                                    <i class="fa-solid fa-box-open text-3xl"></i>
                                </div>
                                <p class="text-slate-400 dark:text-slate-500 font-black uppercase text-[11px] tracking-[0.2em]">Không tìm thấy yêu cầu nào</p>
                            </td>
                        </tr> 
                    }
                }
            </tbody>
        </table>
    </div>
  `
})
export class RequestsTableComponent {
  auth = inject(AuthService);

  @Input() requests: StandardRequest[] = [];
  @Input() isLoading: boolean = false;

  @Output() actionApprove = new EventEmitter<StandardRequest>();
  @Output() actionReject = new EventEmitter<StandardRequest>();
  @Output() actionLogUsage = new EventEmitter<StandardRequest>();
  @Output() actionReturn = new EventEmitter<{req: StandardRequest, isForce: boolean}>();
  @Output() actionAdminReceive = new EventEmitter<StandardRequest>();
  @Output() actionDelete = new EventEmitter<StandardRequest>();

  Date = Date;

  isOverdue(req: StandardRequest): boolean {
    return req.status === 'IN_PROGRESS' && !!req.expectedReturnDate && req.expectedReturnDate < Date.now();
  }

  isExpOverdue(expiryDate?: string | null): boolean {
    if (!expiryDate) return false;
    return new Date(expiryDate).getTime() < Date.now();
  }

  getStatusClass(status: string): string {
    switch (status) {
        case 'PENDING_APPROVAL': return 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/30';
        case 'IN_PROGRESS': return 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800/30';
        case 'PENDING_RETURN': return 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800/30';
        case 'COMPLETED': return 'bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300';
        case 'REJECTED': return 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-900/20 dark:border-rose-800/30';
        default: return 'bg-slate-100 text-slate-600';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
        case 'PENDING_APPROVAL': return 'fa-solid fa-hourglass-half';
        case 'IN_PROGRESS': return 'fa-solid fa-flask';
        case 'PENDING_RETURN': return 'fa-solid fa-box-open';
        case 'COMPLETED': return 'fa-solid fa-check-circle';
        case 'REJECTED': return 'fa-solid fa-ban';
        default: return 'fa-solid fa-circle';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
        case 'PENDING_APPROVAL': return 'Chờ duyệt';
        case 'IN_PROGRESS': return 'Đang dùng';
        case 'PENDING_RETURN': return 'Chờ trả';
        case 'COMPLETED': return 'Hoàn thành';
        case 'REJECTED': return 'Đã từ chối';
        default: return status;
    }
  }
}
