import { Component, Input, Output, EventEmitter, signal, effect, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StandardRequest, ReferenceStandard } from '../../../../core/models/standard.model';

export type ActionModalMode = 'approve' | 'reject' | 'return' | 'logUsage' | 'adminReceive' | null;

@Component({
  selector: 'app-requests-action-modals',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  template: `
    <!-- APPROVE MODAL -->
    @if (activeModal === 'approve' && request) {
       <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm fade-in">
           <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-3xl flex flex-col md:flex-row overflow-hidden animate-bounce-in border border-slate-100 dark:border-slate-800 max-h-[90vh]">
               <!-- Left: Standard Info Summary -->
               <div class="flex w-full md:w-2/5 bg-slate-50 dark:bg-slate-800/50 p-6 md:p-8 flex-col border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 shrink-0 overflow-y-auto">
                   <div class="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl shadow-sm border border-slate-100 dark:border-slate-700 mb-6">
                       <i class="fa-solid fa-vial"></i>
                   </div>
                   
                   <h3 class="text-xl font-black text-slate-800 dark:text-slate-100 leading-tight mb-2 line-clamp-2">{{request.standardName}}</h3>
                   <div class="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-6">Thông tin chuẩn bàn giao</div>

                   <div class="space-y-4">
                       <div class="flex flex-col">
                           <span class="text-[10px] font-bold text-slate-400 uppercase">Số Lô / Lot</span>
                           <span class="text-sm font-bold text-slate-700 dark:text-slate-200">{{request.lotNumber || 'N/A'}}</span>
                       </div>
                       @if(request.standardDetails?.expiry_date) {
                           <div class="flex flex-col">
                               <span class="text-[10px] font-bold text-slate-400 uppercase">Hạn dùng</span>
                               <span class="text-sm font-bold text-slate-700 dark:text-slate-200">{{request.standardDetails?.expiry_date | date:'dd/MM/yyyy'}}</span>
                           </div>
                       }
                       <div class="flex flex-col">
                           <span class="text-[10px] font-bold text-slate-400 uppercase">Tồn kho hiện tại</span>
                           <span class="text-sm font-bold text-emerald-600">{{request.standardDetails?.current_amount}} {{request.standardDetails?.unit}}</span>
                       </div>
                       @if(request.standardDetails?.internal_id) {
                           <div class="flex flex-col">
                               <span class="text-[10px] font-bold text-slate-400 uppercase">Mã quản lý</span>
                               <span class="text-sm font-bold text-slate-500">{{request.standardDetails?.internal_id}}</span>
                           </div>
                       }
                   </div>

                   <div class="mt-auto pt-6 border-t border-slate-200 dark:border-slate-700">
                       <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-2xl border border-blue-100 dark:border-blue-800/30">
                           <p class="text-[10px] text-blue-700 dark:text-blue-400 leading-relaxed font-medium">
                               <i class="fa-solid fa-user-check mr-1"></i>
                               Người mượn: <strong>{{request.requestedByName}}</strong>
                           </p>
                       </div>
                   </div>
               </div>

               <!-- Right: Approve Form -->
               <div class="flex-1 p-6 md:p-8 flex flex-col bg-white dark:bg-slate-900 overflow-y-auto">
                   <div class="flex justify-between items-center mb-6">
                       <h3 class="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Duyệt & Giao chuẩn</h3>
                       <button (click)="onClose()" class="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 transition"><i class="fa-solid fa-times"></i></button>
                   </div>

                   <div class="flex-1 space-y-5">
                       <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
                           <div>
                               <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Lượng dự kiến dùng</label>
                               <div class="relative">
                                   <input type="number" [ngModel]="approveExpectedAmount()" (ngModelChange)="approveExpectedAmount.set($event)" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-indigo-500 outline-none" placeholder="VD: 5">
                                   <span class="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">{{request.standardDetails?.unit}}</span>
                               </div>
                           </div>
                       </div>

                       <div>
                           <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Mục đích sử dụng <span class="text-red-500">*</span></label>
                           <textarea [ngModel]="approvePurpose()" (ngModelChange)="approvePurpose.set($event)" rows="3" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none resize-none placeholder-slate-300" placeholder="Nhập mục đích bàn giao..."></textarea>
                       </div>
                   </div>

                   <div class="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
                       <button (click)="onClose()" class="px-6 py-3 text-slate-500 dark:text-slate-400 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition">Hủy bỏ</button>
                       <button (click)="onApprove()" [disabled]="!approvePurpose() || isProcessing" class="px-8 py-3 bg-indigo-600 dark:bg-indigo-500 text-white font-bold text-sm rounded-2xl hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-xl shadow-indigo-200 dark:shadow-none transition disabled:opacity-50 flex items-center gap-2 active:scale-95">
                           @if(isProcessing) { <i class="fa-solid fa-spinner fa-spin"></i> } 
                           @else { <i class="fa-solid fa-check-circle text-xs"></i> Xác nhận & Giao }
                       </button>
                   </div>
               </div>
           </div>
       </div>
    }

    <!-- REJECT MODAL -->
    @if (activeModal === 'reject' && request) {
       <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm fade-in">
          <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-bounce-in border border-slate-100 dark:border-slate-800">
              <div class="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-red-50/50 dark:bg-red-900/10">
                  <h3 class="font-black text-red-600 dark:text-red-400 text-xl flex items-center gap-2">
                      <i class="fa-solid fa-ban"></i> Từ chối yêu cầu
                  </h3>
                  <button (click)="onClose()" class="w-8 h-8 rounded-full hover:bg-white dark:hover:bg-slate-800 flex items-center justify-center text-red-400 transition"><i class="fa-solid fa-times"></i></button>
              </div>

              <div class="p-8 bg-white dark:bg-slate-900">
                  <div class="mb-6">
                      <p class="text-sm font-medium text-slate-600 dark:text-slate-300">
                          Bạn đang từ chối yêu cầu của <strong>{{request.requestedByName}}</strong> cho chuẩn <strong>{{request.standardName}}</strong>.
                      </p>
                  </div>
                  <div>
                      <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Lý do từ chối <span class="text-red-500">*</span></label>
                      <textarea [ngModel]="rejectReason()" (ngModelChange)="rejectReason.set($event)" rows="3" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none resize-none" placeholder="Nhập lý do cụ thể..."></textarea>
                  </div>

                  <div class="flex justify-end gap-3 mt-8">
                      <button (click)="onClose()" class="px-6 py-3 text-slate-500 dark:text-slate-400 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition">Hủy</button>
                      <button (click)="onReject()" [disabled]="!rejectReason().toString().trim() || isProcessing" class="px-8 py-3 bg-red-600 text-white font-bold text-sm rounded-2xl hover:bg-red-700 shadow-xl shadow-red-200 dark:shadow-none transition disabled:opacity-50">
                          Xác nhận từ chối
                      </button>
                  </div>
              </div>
          </div>
       </div>
    }

    <!-- RETURN MODAL -->
    @if (activeModal === 'return' && request) {
       <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm fade-in">
          <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-bounce-in border border-slate-100 dark:border-slate-800">
              <div class="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-indigo-50/50 dark:bg-indigo-900/10">
                  <h3 class="font-black text-indigo-600 dark:text-indigo-400 text-xl flex items-center gap-2">
                      <i class="fa-solid fa-rotate-left"></i>
                      {{ isForceReturn ? 'Thu hồi chuẩn' : 'Hoàn trả chuẩn' }}
                  </h3>
                  <button (click)="onClose()" class="w-8 h-8 rounded-full hover:bg-white dark:hover:bg-slate-800 flex items-center justify-center text-indigo-400 transition"><i class="fa-solid fa-times"></i></button>
              </div>

              <div class="p-8 space-y-6 bg-white dark:bg-slate-900">
                  <div class="bg-indigo-50/50 dark:bg-indigo-900/10 p-4 rounded-2xl border border-indigo-100/50 dark:border-indigo-800/30">
                      <h4 class="font-black text-slate-800 dark:text-slate-100 leading-tight mb-2">{{request.standardName}}</h4>
                      <div class="flex justify-between items-center">
                          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tồn kho hiện tại</span>
                          <span class="font-black text-indigo-600">{{standard?.current_amount || request.standardDetails?.current_amount || 0}} {{standard?.unit || request.standardDetails?.unit || 'mg'}}</span>
                      </div>
                  </div>

                  @if ((request.usageLogs || []).length > 0) {
                      <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-200 dark:border-blue-800/40 space-y-2">
                          <div class="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-black text-sm">
                              <i class="fa-solid fa-circle-info"></i>
                              Tổng đã ghi nhận: <span class="text-blue-800 dark:text-blue-200">{{request.totalAmountUsed || 0}} {{standard?.unit || request.standardDetails?.unit || 'mg'}}</span>
                              <span class="text-blue-500 font-medium text-xs">({{(request.usageLogs || []).length}} đợt)</span>
                          </div>
                          @if (isForceReturn) {
                              <p class="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-xl border border-amber-200 dark:border-amber-800/40">
                                  <i class="fa-solid fa-triangle-exclamation mr-1"></i>
                                  Kho đã được trừ theo từng đợt. Số lượng nhập bên dưới chỉ để <strong>ghi sổ báo cáo</strong>, không ảnh hưởng thêm vào tồn kho.
                              </p>
                          } @else {
                              <p class="text-xs text-blue-600 dark:text-blue-400">
                                  Kho đã được trừ theo từng đợt. Số báo cáo bên dưới chỉ để admin xác nhận.
                              </p>
                          }
                      </div>

                      <div>
                          <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Số lượng báo cáo (ghi sổ)</label>
                          <div class="relative">
                              <input type="number" [ngModel]="returnAmount()" (ngModelChange)="returnAmount.set($event)" class="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-indigo-500 outline-none pr-12" placeholder="Số lượng...">
                              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">{{standard?.unit || request.standardDetails?.unit || 'mg'}}</span>
                          </div>
                      </div>
                  } @else {
                      <div>
                          <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Lượng thực tế đã dùng <span class="text-red-500">*</span></label>
                          <div class="relative">
                              <input type="number" [ngModel]="returnAmount()" (ngModelChange)="returnAmount.set($event)" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-indigo-500 outline-none pr-12" placeholder="Nhập số lượng...">
                              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">{{standard?.unit || request.standardDetails?.unit || 'mg'}}</span>
                          </div>
                      </div>
                  }
                  
                  <div class="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-800/20">
                      <input type="checkbox" id="isDepleted" [ngModel]="returnIsDepleted()" (ngModelChange)="returnIsDepleted.set($event)" class="w-5 h-5 accent-amber-600 rounded-lg">
                      <label for="isDepleted" class="text-xs font-bold text-amber-700 dark:amber-400 cursor-pointer">Đánh dấu chuẩn đã dùng hết (Depleted)</label>
                  </div>

                  <div class="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-50 dark:border-slate-800">
                      <button (click)="onClose()" class="px-6 py-3 text-slate-500 dark:text-slate-400 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition">Hủy</button>
                      <button (click)="onReturn()" [disabled]="returnAmount() === null || isProcessing" class="px-8 py-3 bg-indigo-600 text-white font-bold text-sm rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 dark:shadow-none transition disabled:opacity-50">
                          Xác nhận trả
                      </button>
                  </div>
              </div>
          </div>
       </div>
    }

    <!-- LOG USAGE MODAL -->
    @if (activeModal === 'logUsage' && request) {
       <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm fade-in">
          <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-bounce-in border border-slate-100 dark:border-slate-800">
              <div class="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-teal-50/50 dark:bg-teal-900/10">
                  <h3 class="font-black text-teal-600 dark:text-teal-400 text-xl flex items-center gap-2">
                      <i class="fa-solid fa-vial-circle-check"></i> Ghi nhận đợt dùng
                  </h3>
                  <button (click)="onClose()" class="w-8 h-8 rounded-full hover:bg-white dark:hover:bg-slate-800 flex items-center justify-center text-teal-400 transition"><i class="fa-solid fa-times"></i></button>
              </div>

              <div class="p-8 space-y-6 bg-white dark:bg-slate-900">
                  <div>
                      <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Khối lượng đợt này <span class="text-red-500">*</span></label>
                      <div class="relative">
                          <input type="number" [ngModel]="logUsageAmount()" (ngModelChange)="logUsageAmount.set($event)" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-teal-500 outline-none pr-12" placeholder="VD: 5.25">
                          <span class="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">{{request.standardDetails?.unit}}</span>
                      </div>
                  </div>

                  <div>
                      <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Ghi chú đợt dùng</label>
                      <textarea [ngModel]="logUsagePurpose()" (ngModelChange)="logUsagePurpose.set($event)" rows="2" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-teal-500 transition-all outline-none resize-none" placeholder="VD: Dùng cho mẫu phân tích lô X..."></textarea>
                  </div>

                  <div class="flex justify-end gap-3 mt-4">
                      <button (click)="onClose()" class="px-6 py-3 text-slate-500 dark:text-slate-400 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition">Hủy</button>
                      <button (click)="onLogUsage()" [disabled]="!logUsageAmount() || isProcessing" class="px-8 py-3 bg-teal-600 text-white font-bold text-sm rounded-2xl hover:bg-teal-700 shadow-xl shadow-teal-200 dark:shadow-none transition disabled:opacity-50">
                          Lưu nhật ký dùng
                      </button>
                  </div>
              </div>
          </div>
       </div>
    }

    <!-- ADMIN RECEIVE RETURN MODAL -->
    @if (activeModal === 'adminReceive' && request) {
       <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm fade-in">
           <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-bounce-in border border-slate-100 dark:border-slate-800 max-h-[90vh] flex flex-col">
              <div class="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-indigo-50/50 dark:bg-indigo-900/10">
                  <h3 class="font-black text-indigo-700 dark:text-indigo-400 text-xl flex items-center gap-2">
                      <i class="fa-solid fa-clipboard-check"></i> Xác nhận nhập kho trả
                  </h3>
                  <button (click)="onClose()" class="w-8 h-8 rounded-full hover:bg-white dark:hover:bg-slate-800 flex items-center justify-center text-indigo-400 transition"><i class="fa-solid fa-times"></i></button>
              </div>

              <div class="p-6 md:p-8 space-y-6 bg-white dark:bg-slate-900 overflow-y-auto">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-inner">
                      <div class="flex flex-col">
                          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">NV báo cáo dùng</span>
                          <span class="text-xl font-black text-indigo-600">{{request.totalAmountUsed}} {{request.standardDetails?.unit}}</span>
                      </div>
                      <div class="flex flex-col">
                          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Trạng thái</span>
                          <span class="text-sm font-bold" [class]="request.reportedDepleted ? 'text-red-500' : 'text-emerald-500'">
                              {{ request.reportedDepleted ? 'Báo cáo đã hết' : 'Vẫn còn chuẩn' }}
                          </span>
                      </div>
                  </div>

                  <div>
                      <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Lượng thực tế trừ kho <span class="text-red-500">*</span></label>
                      <div class="relative">
                          <input type="number" [ngModel]="adminReceiveAmount()" (ngModelChange)="adminReceiveAmount.set($event)" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-indigo-500 outline-none pr-12" placeholder="Xác nhận số lượng thực tế...">
                          <span class="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">{{request.standardDetails?.unit}}</span>
                      </div>
                  </div>
                  
                  <div class="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-800/20">
                      <input type="checkbox" id="adminIsDepleted" [ngModel]="adminReceiveIsDepleted()" (ngModelChange)="adminReceiveIsDepleted.set($event)" class="w-5 h-5 accent-amber-600 rounded-lg">
                      <label for="adminIsDepleted" class="text-xs font-bold text-amber-700 dark:amber-400 cursor-pointer">Xác nhận chuẩn đã dùng hết (Hủy chuẩn)</label>
                  </div>

                  @if(adminReceiveIsDepleted()) {
                      <div class="fade-in">
                          <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Lý do hủy chuẩn <span class="text-red-500">*</span></label>
                          <textarea [ngModel]="adminReceiveDisposalReason()" (ngModelChange)="adminReceiveDisposalReason.set($event)" rows="2" class="w-full bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/30 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-red-500 outline-none resize-none" placeholder="Nhập lý do như: Hết hạn, hỏng, hoặc dùng hết..."></textarea>
                      </div>
                  }

                  <div class="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-50 dark:border-slate-800">
                      <button (click)="onClose()" class="px-6 py-3 text-slate-500 dark:text-slate-400 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition">Hủy</button>
                      <button (click)="onAdminReceive()" [disabled]="adminReceiveAmount() === null || (adminReceiveIsDepleted() && !adminReceiveDisposalReason()) || isProcessing" class="px-8 py-3 bg-indigo-600 text-white font-bold text-sm rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 dark:shadow-none transition disabled:opacity-50">
                          Hoàn tất tiếp nhận
                      </button>
                  </div>
              </div>
          </div>
       </div>
    }
  `
})
export class RequestsActionModalsComponent implements OnChanges {
  @Input() activeModal: ActionModalMode = null;
  @Input() request: StandardRequest | null = null;
  @Input() standard: ReferenceStandard | null = null;
  @Input() isForceReturn = false;
  @Input() isProcessing = false;

  @Output() close = new EventEmitter<void>();
  
  @Output() approveAction = new EventEmitter<{ expectedAmount: number | null, purpose: string }>();
  @Output() rejectAction = new EventEmitter<{ reason: string }>();
  @Output() logUsageAction = new EventEmitter<{ amount: number, purpose: string }>();
  @Output() returnAction = new EventEmitter<{ amount: number, isDepleted: boolean }>();
  @Output() adminReceiveAction = new EventEmitter<{ amount: number, isDepleted: boolean, disposalReason: string }>();

  // State properties

  approveExpectedAmount = signal<number | null>(null);
  approvePurpose = signal<string>('');

  rejectReason = signal<string>('');

  logUsageAmount = signal<number | null>(null);
  logUsagePurpose = signal<string>('');

  returnAmount = signal<number | null>(null);
  returnIsDepleted = signal<boolean>(false);

  adminReceiveAmount = signal<number | null>(null);
  adminReceiveIsDepleted = signal<boolean>(false);
  adminReceiveDisposalReason = signal<string>('');

  ngOnChanges(changes: SimpleChanges) {
    if (changes['activeModal'] || changes['request']) {
        const mode = this.activeModal;
        const req = this.request;
        if (!mode) {
           this.resetAllStates();
        } else if (mode === 'adminReceive' && req) {
           if (this.adminReceiveAmount() === null && req.totalAmountUsed != null) {
              this.adminReceiveAmount.set(req.totalAmountUsed);
           }
           if (!this.adminReceiveIsDepleted() && req.reportedDepleted) {
              this.adminReceiveIsDepleted.set(req.reportedDepleted);
           }
        } else if (mode === 'approve' && req) {
           if (!this.approvePurpose()) {
              this.approvePurpose.set(req.purpose || '');
           }
        }
    }
  }

  resetAllStates() {

    this.approveExpectedAmount.set(null);
    this.approvePurpose.set('');
    
    this.rejectReason.set('');
    
    this.logUsageAmount.set(null);
    this.logUsagePurpose.set('');
    
    this.returnAmount.set(null);
    this.returnIsDepleted.set(false);
    
    this.adminReceiveAmount.set(null);
    this.adminReceiveIsDepleted.set(false);
    this.adminReceiveDisposalReason.set('');
  }

  onClose() {
    this.close.emit();
  }

  onApprove() {
    if (this.isProcessing) return;
    this.approveAction.emit({
        expectedAmount: this.approveExpectedAmount(),
        purpose: this.approvePurpose()
    });
  }

  onReject() {
    if (this.isProcessing) return;
    this.rejectAction.emit({
        reason: this.rejectReason()
    });
  }

  onLogUsage() {
    const amount = this.logUsageAmount();
    if (this.isProcessing || amount === null) return;
    this.logUsageAction.emit({
        amount,
        purpose: this.logUsagePurpose()
    });
  }

  onReturn() {
    const amount = this.returnAmount();
    if (this.isProcessing || amount === null) return;
    this.returnAction.emit({
        amount,
        isDepleted: this.returnIsDepleted()
    });
  }

  onAdminReceive() {
    const amount = this.adminReceiveAmount();
    if (this.isProcessing || amount === null) return;
    this.adminReceiveAction.emit({
        amount,
        isDepleted: this.adminReceiveIsDepleted(),
        disposalReason: this.adminReceiveDisposalReason()
    });
  }
}
