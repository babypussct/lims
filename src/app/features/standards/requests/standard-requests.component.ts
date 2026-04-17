import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StateService } from '../../../core/services/state.service';
import { StandardService } from '../standard.service';
import { StandardRequest, StandardRequestStatus, ReferenceStandard, PurchaseRequest } from '../../../core/models/standard.model';
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { AuthService } from '../../../core/services/auth.service';
import { Unsubscribe } from 'firebase/firestore';

function removeAccents(str: string): string {
    if (!str) return '';
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

@Component({
  selector: 'app-standard-requests',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="flex flex-col space-y-4 fade-in h-full relative p-1 pb-6 custom-scrollbar overflow-y-auto overflow-x-hidden">
      <!-- Header Area -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 px-2 mt-2">
        <div>
            <h1 class="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-3">
                <div class="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none transition-transform hover:scale-110">
                    <i class="fa-solid fa-clipboard-list text-lg"></i>
                </div>
                Quản lý Yêu cầu Chuẩn
            </h1>
            <p class="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1 ml-1">Theo dõi, cấp phát và thu hồi chuẩn đối chiếu</p>
        </div>
        
        <div class="flex gap-3 items-center">
             @if (auth.canApproveStandards() && pendingPurchaseRequestsCount() > 0) {
                 <button (click)="openAdminPurchaseRequests()" class="group relative px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl shadow-lg shadow-amber-200 dark:shadow-none transition-all font-black text-xs flex items-center gap-2 active:scale-95">
                     <i class="fa-solid fa-cart-shopping animate-bounce"></i> Yêu cầu Mua sắm
                     <div class="absolute -top-2 -right-2 px-2 py-0.5 min-w-[24px] h-6 flex items-center justify-center bg-red-600 text-white rounded-full text-[10px] font-black border-2 border-white dark:border-slate-900 shadow-md">{{pendingPurchaseRequestsCount()}}</div>
                 </button>
             }
             <button (click)="openRequestModal()" class="group px-5 py-2.5 bg-slate-900 dark:bg-indigo-600 text-white hover:bg-slate-800 dark:hover:bg-indigo-500 rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none transition-all font-black text-xs flex items-center gap-2 active:scale-95">
                <i class="fa-solid fa-plus-circle text-sm group-hover:rotate-90 transition-transform"></i> Tạo Yêu cầu Mới
             </button>
        </div>
      </div>


      <!-- Main Section: List & Filter -->
      <div class="flex flex-col bg-white dark:bg-slate-800 mx-2 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-700 overflow-hidden min-h-[500px]">
          
          <!-- Modern Tab Filters & Search -->
          <div class="p-4 border-b border-slate-50 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md sticky top-0 z-40">
              <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <!-- Segmented Tabs -->
                  <div class="flex items-center gap-1 p-1 bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar max-w-full">
                      <button (click)="statusFilter.set('ALL')" 
                              [class]="statusFilter() === 'ALL' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:bg-white/50 dark:hover:bg-slate-800/50'"
                              class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap">
                          Tất cả <span class="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded-md text-[10px] opacity-70">{{statusCounts().ALL}}</span>
                      </button>
                      <button (click)="statusFilter.set('PENDING_APPROVAL')" 
                              [class]="statusFilter() === 'PENDING_APPROVAL' ? 'bg-white dark:bg-slate-800 shadow-sm text-amber-600 dark:text-amber-400' : 'text-slate-500 hover:bg-white/50 dark:hover:bg-slate-800/50'"
                              class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap">
                          Chờ duyệt <span class="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 rounded-md text-[10px] opacity-70 text-amber-600">{{statusCounts().PENDING_APPROVAL}}</span>
                      </button>
                      <button (click)="statusFilter.set('IN_PROGRESS')" 
                              [class]="statusFilter() === 'IN_PROGRESS' ? 'bg-white dark:bg-slate-800 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-500 hover:bg-white/50 dark:hover:bg-slate-800/50'"
                              class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap">
                          Đang dùng <span class="px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-md text-[10px] opacity-70 text-emerald-600">{{statusCounts().IN_PROGRESS}}</span>
                      </button>
                      <button (click)="statusFilter.set('PENDING_RETURN')" 
                              [class]="statusFilter() === 'PENDING_RETURN' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:bg-white/50 dark:hover:bg-slate-800/50'"
                              class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap">
                          Chờ trả <span class="px-1.5 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-md text-[10px] opacity-70 text-indigo-600">{{statusCounts().PENDING_RETURN}}</span>
                      </button>
                      <button (click)="statusFilter.set('COMPLETED')" 
                              [class]="statusFilter() === 'COMPLETED' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-600 dark:text-slate-300' : 'text-slate-500 hover:bg-white/50 dark:hover:bg-slate-800/50'"
                              class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap">
                          Hoàn thành <span class="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded-md text-[10px] opacity-70">{{statusCounts().COMPLETED}}</span>
                      </button>
                  </div>

                  <!-- Search -->
                  <div class="relative min-w-[300px]">
                      <i class="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                      <input type="text" [ngModel]="searchTerm()" (ngModelChange)="searchTerm.set($event)" 
                             class="w-full pl-11 pr-4 py-2.5 bg-slate-100/50 dark:bg-slate-900/50 border border-transparent rounded-2xl text-[13px] font-bold text-slate-800 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder-slate-400"
                             placeholder="Tìm tên chuẩn, người mượn, số lô...">
                  </div>
              </div>
          </div>

          <!-- Table Container -->
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
                      @if (isLoading()) {
                          @for(i of [1,2,3,4,5]; track i) {
                              <tr class="animate-pulse">
                                  <td colspan="6" class="px-6 py-4"><div class="h-12 bg-slate-50 dark:bg-slate-800/50 rounded-2xl w-full"></div></td>
                              </tr>
                          }
                      } @else {
                          @for (req of filteredRequests(); track req.id) {
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
                                                     [class]="isOverdue(req.standardDetails?.expiry_date) ? 'bg-rose-50/50 border-rose-100 dark:bg-rose-900/20 dark:border-rose-800/30' : 'bg-slate-50/50 border-slate-100 dark:bg-slate-900/30 dark:border-slate-800/50'">
                                                    <span class="text-[8px] font-black uppercase tracking-widest" [class.text-rose-500]="isOverdue(req.standardDetails?.expiry_date)" [class.text-slate-400]="!isOverdue(req.standardDetails?.expiry_date)">Hạn dùng (EXP)</span>
                                                    <span class="text-[11px] font-black" [class.text-rose-600]="isOverdue(req.standardDetails?.expiry_date)" [class.text-slate-700]="!isOverdue(req.standardDetails?.expiry_date)">{{req.standardDetails?.expiry_date | date:'dd/MM/yyyy'}}</span>
                                                </div>
                                                <div class="px-2.5 py-1.5 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800/50 flex flex-col gap-0.5">
                                                    <span class="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Tồn kho / Vị trí</span>
                                                    <div class="flex items-center gap-1.5">
                                                        <span class="text-[11px] font-black text-slate-700 dark:text-slate-300">{{req.standardDetails?.current_amount}}{{req.standardDetails?.unit}}</span>
                                                        <span class="text-[11px] text-slate-400">•</span>
                                                        <span class="text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate max-w-[60px]">{{req.standardDetails?.location || '?'}}</span>
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
                                                      <div class="flex-1 h-1 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden w-24">
                                                          <div class="h-full bg-indigo-500 rounded-full" [style.width.%]="(req.totalAmountUsed / (req.expectedAmount || 1)) * 100"></div>
                                                      </div>
                                                      <span class="text-[9px] font-black text-indigo-600 dark:text-indigo-400 whitespace-nowrap">Đã dùng: {{req.totalAmountUsed}}</span>
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
                                                  <span class="font-bold whitespace-nowrap" [class.text-rose-500]="req.status === 'IN_PROGRESS' && req.expectedReturnDate < Date.now()">
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
                                              <button (click)="approveRequest(req)" 
                                                      class="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-500/20 active:scale-90" 
                                                      title="Duyệt & Giao"><i class="fa-solid fa-check"></i></button>
                                              <button (click)="openRejectModal(req)" 
                                                      class="p-2 bg-rose-100 text-rose-600 rounded-xl hover:bg-rose-200 transition active:scale-90" 
                                                      title="Từ chối"><i class="fa-solid fa-times"></i></button>
                                          }
                                          @if(req.status === 'IN_PROGRESS') {
                                              @if(req.requestedBy === auth.currentUser()?.uid) {
                                                  <button (click)="openLogUsageModal(req)" 
                                                          class="p-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition shadow-lg shadow-teal-500/20 active:scale-90" 
                                                          title="Ghi nhận dùng"><i class="fa-solid fa-pen-nib"></i></button>
                                                  <button (click)="openReturnModal(req, false)" 
                                                          class="p-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition shadow-lg shadow-amber-500/20 active:scale-90 ml-1" 
                                                          title="Báo cáo trả"><i class="fa-solid fa-reply"></i></button>
                                              }
                                              @if(auth.canApproveStandards()) {
                                                  <button (click)="openReturnModal(req, true)" 
                                                          class="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition active:scale-90 ml-1" 
                                                          title="Thu hồi trực tiếp"><i class="fa-solid fa-hand-holding-hand"></i></button>
                                              }
                                          }
                                          @if(req.status === 'PENDING_RETURN' && auth.canApproveStandards()) {
                                              <button (click)="openAdminReceiveModal(req)" 
                                                      class="px-3 py-1.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/20 active:scale-90 text-[10px] font-black" 
                                                      title="Tiếp nhận trả"><i class="fa-solid fa-check-to-slot mr-1"></i>NHẬN TRẢ</button>
                                          }
                                          @if(req.status === 'COMPLETED' || req.status === 'REJECTED') {
                                              <button class="p-2 text-slate-300 dark:text-slate-600 bg-slate-50 dark:bg-slate-900/50 rounded-xl cursor-default" title="Đã khóa"><i class="fa-solid fa-lock"></i></button>
                                          }
                                          @if(auth.canDeleteStandardLogs()) {
                                              <button (click)="hardDeleteHistory(req)" 
                                                      class="p-2 text-rose-300 hover:text-rose-600 bg-rose-50/50 dark:bg-rose-900/20 rounded-xl transition active:scale-90 ml-1" 
                                                      title="Xóa yêu cầu & Hoàn tác tồn kho"><i class="fa-solid fa-trash-can"></i></button>
                                          }
                                      </div>
                                  </td>
                              </tr>
                          } 
                          @if (filteredRequests().length === 0) { 
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
      </div>

      <!-- REQUEST MODAL (Tạo yêu cầu mới) -->
      @if (showModal()) {
         <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm fade-in">
            <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-5xl flex overflow-hidden animate-bounce-in border border-slate-100 dark:border-slate-800 h-[85vh]">
                
                <!-- Left Column: Standards Selection -->
                <div class="w-1/2 flex flex-col bg-slate-50 dark:bg-slate-800/30 border-r border-slate-100 dark:border-slate-800">
                    <div class="p-6 border-b border-slate-100 dark:border-slate-800">
                        <h3 class="font-black text-slate-800 dark:text-slate-100 text-lg flex items-center gap-2 mb-4">
                            <i class="fa-solid fa-flask-vial text-indigo-600"></i>
                            Chọn chuẩn đối chiếu
                        </h3>
                        
                        <!-- Search Input -->
                        <div class="relative">
                            <i class="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                            <input type="text" [ngModel]="standardSearchTerm()" (ngModelChange)="standardSearchTerm.set($event)" 
                                   placeholder="Tìm theo tên, lot, cas, mã..." 
                                   class="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-700 dark:text-slate-200 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all">
                        </div>
                    </div>

                    <div class="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        @if (standardSearchTerm().length > 0) {
                            <div class="space-y-2">
                                @for(std of filteredAvailableStandards(); track std.id) {
                                    <div class="p-5 border rounded-[2rem] transition-all duration-300 flex items-start gap-4 group relative overflow-hidden"
                                         [ngClass]="{
                                            'bg-indigo-50/50 dark:bg-indigo-900/20 border-indigo-400 dark:border-indigo-500 shadow-[0_0_0_2px_rgba(99,102,241,0.2)] dark:shadow-[0_0_0_2px_rgba(99,102,241,0.3)] z-10 cursor-pointer': selectedStandardIds().has(std.id) && !isDepleted(std),
                                            'border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 hover:shadow-xl hover:shadow-indigo-100/30 dark:hover:shadow-none cursor-pointer bg-white dark:bg-slate-900': !selectedStandardIds().has(std.id) && !isDepleted(std),
                                            'opacity-40 grayscale cursor-not-allowed border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50': isDepleted(std)
                                         }"
                                         (click)="!isDepleted(std) && toggleStandardSelection(std.id)">

                                        <!-- Selection Indicator Overlay -->
                                        @if(selectedStandardIds().has(std.id)) {
                                            <div class="absolute top-4 right-4 w-6 h-6 flex items-center justify-center bg-indigo-600 text-white rounded-full shadow-md animate-bounce-in z-20">
                                                <i class="fa-solid fa-check text-[10px] font-black"></i>
                                            </div>
                                        }

                                        <!-- Standard Icon/Letter -->
                                        <div class="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-all duration-300 relative z-10"
                                             [ngClass]="selectedStandardIds().has(std.id) ? 'bg-indigo-600 text-white border-none shadow-md shadow-indigo-200 dark:shadow-indigo-900/50 rotate-12 scale-110' : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-indigo-600 group-hover:scale-110'">
                                            <i class="fa-solid fa-flask-vial text-lg"></i>
                                        </div>

                                        <div class="flex-1 min-w-0 relative z-10">
                                            <div class="flex items-center justify-between gap-2 mb-1 pr-6">
                                                <div class="font-black text-sm truncate transition-colors text-slate-800 dark:text-slate-100 group-hover:text-indigo-600" 
                                                     [title]="std.name">{{std.name}}</div>
                                                @if(std.internal_id) {
                                                    <span class="shrink-0 px-2 py-0.5 text-[9px] font-black rounded uppercase border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 shadow-sm">
                                                        {{std.internal_id}}
                                                    </span>
                                                }
                                            </div>

                                            <!-- Detail Grid -->
                                            <div class="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
                                                <div class="flex items-center gap-1.5">
                                                    <i class="fa-solid fa-barcode text-[10px] w-3 text-slate-400"></i>
                                                    <span class="text-[10px] font-bold truncate text-slate-500 dark:text-slate-400">Mã: {{std.product_code || 'N/A'}}</span>
                                                </div>
                                                <div class="flex items-center gap-1.5">
                                                    <i class="fa-solid fa-hashtag text-[10px] w-3 text-slate-400"></i>
                                                    <span class="text-[10px] font-bold truncate text-slate-500 dark:text-slate-400">Lot: {{std.lot_number || 'N/A'}}</span>
                                                </div>
                                                <div class="flex items-center gap-1.5">
                                                    <i class="fa-solid fa-flask text-[10px] w-3 text-slate-400"></i>
                                                    <span class="text-[10px] font-bold truncate text-slate-500 dark:text-slate-400">CAS: {{std.cas_number || 'N/A'}}</span>
                                                </div>
                                                <div class="flex items-center gap-1.5">
                                                    <i class="fa-solid fa-industry text-[10px] w-3 text-slate-400"></i>
                                                    <span class="text-[10px] font-bold truncate text-slate-500 dark:text-slate-400">Hãng: {{std.manufacturer || 'N/A'}}</span>
                                                </div>
                                            </div>

                                            <div class="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                                                <div class="flex items-center gap-2">
                                                    @if(isDepleted(std)) {
                                                        <div class="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black rounded flex items-center gap-1 border border-slate-200 dark:border-slate-700">
                                                            <i class="fa-solid fa-ban text-red-400"></i> Sử dụng hết
                                                        </div>
                                                    } @else {
                                                        <div class="px-2 py-0.5 text-[10px] font-black rounded flex items-center gap-1 border border-emerald-100 dark:border-emerald-800/30 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                                                            <i class="fa-solid fa-cube"></i> {{std.current_amount}} {{std.unit}}
                                                        </div>
                                                    }
                                                </div>
                                                @if(std.expiry_date) {
                                                    <div class="text-[10px] font-bold flex items-center gap-1" 
                                                         [ngClass]="isExpired(std.expiry_date) ? 'text-red-500 font-black' : 'text-slate-400'">
                                                        <i class="fa-regular fa-calendar-xmark"></i>
                                                        {{std.expiry_date | date:'dd/MM/yyyy'}}
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                }
                                @if(filteredAvailableStandards().length === 0) {
                                    <div class="py-12 text-center">
                                        <div class="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                            <i class="fa-solid fa-layer-group text-2xl"></i>
                                        </div>
                                        <p class="text-slate-500 dark:text-slate-400 font-medium">Không tìm thấy chuẩn nào phù hợp</p>
                                    </div>
                                }
                            </div>
                        } @else {
                            <div class="py-20 text-center flex flex-col items-center justify-center">
                                <div class="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-[2.5rem] flex items-center justify-center mb-6 text-indigo-300 dark:text-indigo-700 animate-pulse">
                                    <i class="fa-solid fa-search text-4xl"></i>
                                </div>
                                <h4 class="text-slate-800 dark:text-slate-100 font-black text-lg mb-2">Tìm kiếm chất chuẩn</h4>
                                <p class="text-slate-500 dark:text-slate-400 text-sm max-w-[250px] mx-auto font-medium">Nhập tên, số lô hoặc mã CAS để bắt đầu chọn chuẩn mượn.</p>
                            </div>
                        }
                    </div>
                </div>

                <!-- Right Column: Form & Confirmation -->
                <div class="flex-1 flex flex-col bg-white dark:bg-slate-900">
                    <div class="p-6 flex justify-between items-center border-b border-slate-100 dark:border-slate-800">
                        <div>
                            <h3 class="font-black text-slate-800 dark:text-slate-100 text-lg">Hoàn tất yêu cầu</h3>
                            <p class="text-xs text-slate-500 font-medium">Vui lòng cung cấp mục đích và thời gian dự kiến</p>
                        </div>
                        <button (click)="closeModal()" class="w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 transition"><i class="fa-solid fa-times"></i></button>
                    </div>

                    <div class="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        <form [formGroup]="form" (ngSubmit)="submitRequest()" class="space-y-6">
                            <!-- Selected Counter -->
                            <div class="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-800/30 flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-indigo-600 shadow-sm">
                                        <i class="fa-solid fa-check-double"></i>
                                    </div>
                                    <div>
                                        <div class="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Đã chọn</div>
                                        <div class="text-lg font-black text-indigo-700 dark:text-indigo-300">{{selectedStandardIds().size}} chất chuẩn</div>
                                    </div>
                                </div>
                                <button type="button" (click)="clearSelection()" [disabled]="selectedStandardIds().size === 0" class="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 uppercase underline decoration-2 underline-offset-4 disabled:opacity-30">Xóa tất cả</button>
                            </div>

                            <!-- Selected Standards Chip List -->
                            <div class="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 overflow-hidden">
                                @if (selectedStandardsList().length === 0) {
                                    <div class="py-4 px-4 flex items-center gap-2 text-slate-400 dark:text-slate-600">
                                        <i class="fa-regular fa-hand-pointer text-xs"></i>
                                        <span class="text-[11px] font-medium italic">Tìm kiếm và chọn chuẩn ở cột bên trái để thêm vào yêu cầu.</span>
                                    </div>
                                } @else {
                                    <div class="p-3 max-h-[160px] overflow-y-auto custom-scrollbar flex flex-wrap gap-2">
                                        @for (std of selectedStandardsList(); track std.id) {
                                            <div class="animate-bounce-in flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-700/50 shadow-sm group/chip max-w-full">
                                                <div class="flex flex-col min-w-0">
                                                    <span class="text-[11px] font-black text-indigo-700 dark:text-indigo-300 truncate max-w-[160px]" [title]="std.name">{{std.name}}</span>
                                                    @if (std.internal_id || std.lot_number) {
                                                        <span class="text-[9px] font-bold text-slate-400 dark:text-slate-500 truncate">
                                                            {{std.internal_id || ''}}{{std.internal_id && std.lot_number ? ' · ' : ''}}{{std.lot_number ? 'Lot ' + std.lot_number : ''}}
                                                        </span>
                                                    }
                                                </div>
                                                <button type="button" (click)="toggleStandardSelection(std.id)"
                                                        class="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition ml-1"
                                                        title="Bỏ chọn">
                                                    <i class="fa-solid fa-times text-[9px]"></i>
                                                </button>
                                            </div>
                                        }
                                    </div>
                                }
                            </div>

                            <div class="space-y-4">
                                 <div>
                                     <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Mục đích sử dụng <span class="text-red-500">*</span></label>
                                     <textarea formControlName="purpose" rows="3" 
                                               class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none resize-none placeholder-slate-300" 
                                               placeholder="VD: Pha chuẩn cho máy HPLC-MS/MS..."></textarea>
                                     <div class="flex flex-wrap gap-2 mt-2">
                                         <button type="button" (click)="form.patchValue({purpose: 'Pha chuẩn máy'})" class="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 rounded-lg transition border border-transparent hover:border-indigo-200"># Pha chuẩn máy</button>
                                         <button type="button" (click)="form.patchValue({purpose: 'Kiểm tra định kỳ'})" class="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 rounded-lg transition border border-transparent hover:border-indigo-200"># Kiểm tra định kỳ</button>
                                         <button type="button" (click)="form.patchValue({purpose: 'Ngoại kiểm'})" class="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 rounded-lg transition border border-transparent hover:border-indigo-200"># Ngoại kiểm</button>
                                         <button type="button" (click)="form.patchValue({purpose: 'Nghiên cứu phát triển'})" class="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 rounded-lg transition border border-transparent hover:border-indigo-200"># Nghiên cứu phát triển</button>
                                         <button type="button" (click)="form.patchValue({purpose: 'Kiểm nghiệm mẫu'})" class="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 rounded-lg transition border border-transparent hover:border-indigo-200"># Kiểm nghiệm mẫu</button>
                                     </div>
                                 </div>

                                <div>
                                    <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Ngày dự kiến trả</label>
                                    <div class="relative group">
                                        <i class="fa-regular fa-calendar absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"></i>
                                        <input type="date" formControlName="expectedReturnDate" 
                                               class="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-indigo-500 outline-none [color-scheme:light] dark:[color-scheme:dark]">
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div class="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                        <div class="flex justify-end gap-3">
                            <button (click)="closeModal()" class="px-6 py-3 text-slate-500 dark:text-slate-400 font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl transition">Hủy bỏ</button>
                            <button (click)="submitRequest()" [disabled]="selectedStandardIds().size === 0 || isProcessing()" 
                                    class="px-8 py-3 bg-indigo-600 dark:bg-indigo-500 text-white font-bold text-sm rounded-2xl hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-xl shadow-indigo-200 dark:shadow-none transition disabled:opacity-50 flex items-center gap-2 active:scale-95">
                                @if(isProcessing()) { <i class="fa-solid fa-spinner fa-spin"></i> Đang xử lý... } 
                                @else { <i class="fa-solid fa-paper-plane text-xs"></i> Gửi yêu cầu }
                            </button>
                        </div>
                    </div>
                </div>
            </div>
         </div>
      }


      <!-- APPROVE MODAL (Duyệt & Giao) -->
      @if (showApproveModal() && selectedRequest()) {
          <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm fade-in">
              <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-3xl flex overflow-hidden animate-bounce-in border border-slate-100 dark:border-slate-800">
                  <!-- Left: Standard Info Summary -->
                  <div class="hidden md:flex w-2/5 bg-slate-50 dark:bg-slate-800/50 p-8 flex-col border-r border-slate-100 dark:border-slate-800">
                      <div class="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl shadow-sm border border-slate-100 dark:border-slate-700 mb-6">
                          <i class="fa-solid fa-vial"></i>
                      </div>
                      
                      <h3 class="text-xl font-black text-slate-800 dark:text-slate-100 leading-tight mb-2 line-clamp-2">{{selectedRequest()?.standardName}}</h3>
                      <div class="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-6">Thông tin chuẩn bàn giao</div>
  
                      <div class="space-y-4">
                          <div class="flex flex-col">
                              <span class="text-[10px] font-bold text-slate-400 uppercase">Số Lô / Lot</span>
                              <span class="text-sm font-bold text-slate-700 dark:text-slate-200">{{selectedRequest()?.lotNumber || 'N/A'}}</span>
                          </div>
                          @if(selectedRequest()?.standardDetails?.expiry_date) {
                              <div class="flex flex-col">
                                  <span class="text-[10px] font-bold text-slate-400 uppercase">Hạn dùng</span>
                                  <span class="text-sm font-bold text-slate-700 dark:text-slate-200">{{selectedRequest()?.standardDetails?.expiry_date | date:'dd/MM/yyyy'}}</span>
                              </div>
                          }
                          <div class="flex flex-col">
                              <span class="text-[10px] font-bold text-slate-400 uppercase">Tồn kho hiện tại</span>
                              <span class="text-sm font-bold text-emerald-600">{{selectedRequest()?.standardDetails?.current_amount}} {{selectedRequest()?.standardDetails?.unit}}</span>
                          </div>
                          @if(selectedRequest()?.standardDetails?.internal_id) {
                              <div class="flex flex-col">
                                  <span class="text-[10px] font-bold text-slate-400 uppercase">Mã quản lý</span>
                                  <span class="text-sm font-bold text-slate-500">{{selectedRequest()?.standardDetails?.internal_id}}</span>
                              </div>
                          }
                      </div>
  
                      <div class="mt-auto pt-6 border-t border-slate-200 dark:border-slate-700">
                          <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-2xl border border-blue-100 dark:border-blue-800/30">
                              <p class="text-[10px] text-blue-700 dark:text-blue-400 leading-relaxed font-medium">
                                  <i class="fa-solid fa-user-check mr-1"></i>
                                  Người mượn: <strong>{{selectedRequest()?.requestedByName}}</strong>
                              </p>
                          </div>
                      </div>
                  </div>
  
                  <!-- Right: Approve Form -->
                  <div class="flex-1 p-8 flex flex-col bg-white dark:bg-slate-900">
                      <div class="flex justify-between items-center mb-6">
                          <h3 class="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Duyệt & Giao chuẩn</h3>
                          <button (click)="showApproveModal.set(false)" class="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 transition"><i class="fa-solid fa-times"></i></button>
                      </div>
  
                      <div class="flex-1 space-y-5">
                          <div class="grid grid-cols-2 gap-4">
                              <div>
                                  <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Ngày dự kiến trả</label>
                                  <input type="date" [ngModel]="approveExpectedDate()" (ngModelChange)="approveExpectedDate.set($event)" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-indigo-500 outline-none [color-scheme:light] dark:[color-scheme:dark]">
                              </div>
                              <div>
                                  <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Lượng dự kiến dùng</label>
                                  <div class="relative">
                                      <input type="number" [ngModel]="approveExpectedAmount()" (ngModelChange)="approveExpectedAmount.set($event)" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-indigo-500 outline-none" placeholder="VD: 5">
                                      <span class="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">{{selectedRequest()?.standardDetails?.unit}}</span>
                                  </div>
                              </div>
                          </div>
  
                          <div>
                              <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Mục đích sử dụng <span class="text-red-500">*</span></label>
                              <textarea [ngModel]="approvePurpose()" (ngModelChange)="approvePurpose.set($event)" rows="3" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none resize-none placeholder-slate-300" placeholder="Nhập mục đích bàn giao..."></textarea>
                          </div>
                      </div>
  
                      <div class="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
                          <button (click)="showApproveModal.set(false)" class="px-6 py-3 text-slate-500 dark:text-slate-400 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition">Hủy bỏ</button>
                          <button (click)="confirmApprove()" [disabled]="!approvePurpose() || isProcessing()" class="px-8 py-3 bg-indigo-600 dark:bg-indigo-500 text-white font-bold text-sm rounded-2xl hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-xl shadow-indigo-200 dark:shadow-none transition disabled:opacity-50 flex items-center gap-2 active:scale-95">
                              @if(isProcessing()) { <i class="fa-solid fa-spinner fa-spin"></i> } 
                              @else { <i class="fa-solid fa-check-circle text-xs"></i> Xác nhận & Giao }
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      }

      <!-- REJECT MODAL -->
      @if (showRejectModal()) {
         <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm fade-in">
            <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-bounce-in border border-slate-100 dark:border-slate-800">
                <div class="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-red-50/50 dark:bg-red-900/10">
                    <h3 class="font-black text-red-600 dark:text-red-400 text-xl flex items-center gap-2">
                        <i class="fa-solid fa-ban"></i> Từ chối yêu cầu
                    </h3>
                    <button (click)="closeRejectModal()" class="w-8 h-8 rounded-full hover:bg-white dark:hover:bg-slate-800 flex items-center justify-center text-red-400 transition"><i class="fa-solid fa-times"></i></button>
                </div>

                <div class="p-8 bg-white dark:bg-slate-900">
                    <div class="mb-6">
                        <p class="text-sm font-medium text-slate-600 dark:text-slate-300">
                            Bạn đang từ chối yêu cầu của <strong>{{selectedRequest()?.requestedByName}}</strong> cho chuẩn <strong>{{selectedRequest()?.standardName}}</strong>.
                        </p>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Lý do từ chối <span class="text-red-500">*</span></label>
                        <textarea [ngModel]="rejectReason()" (ngModelChange)="rejectReason.set($event)" rows="3" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none resize-none" placeholder="Nhập lý do cụ thể..."></textarea>
                    </div>

                    <div class="flex justify-end gap-3 mt-8">
                        <button (click)="closeRejectModal()" class="px-6 py-3 text-slate-500 dark:text-slate-400 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition">Hủy</button>
                        <button (click)="confirmReject()" [disabled]="!rejectReason().toString().trim() || isProcessing()" class="px-8 py-3 bg-red-600 text-white font-bold text-sm rounded-2xl hover:bg-red-700 shadow-xl shadow-red-200 dark:shadow-none transition disabled:opacity-50">
                            Xác nhận từ chối
                        </button>
                    </div>
                </div>
            </div>
         </div>
      }

      <!-- RETURN MODAL -->
      @if (showReturnModal()) {
         <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm fade-in">
            <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-bounce-in border border-slate-100 dark:border-slate-800">
                <div class="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-indigo-50/50 dark:bg-indigo-900/10">
                    <h3 class="font-black text-indigo-600 dark:text-indigo-400 text-xl flex items-center gap-2">
                        <i class="fa-solid fa-rotate-left"></i>
                        {{ isForceReturn() ? 'Thu hồi chuẩn' : 'Hoàn trả chuẩn' }}
                    </h3>
                    <button (click)="closeReturnModal()" class="w-8 h-8 rounded-full hover:bg-white dark:hover:bg-slate-800 flex items-center justify-center text-indigo-400 transition"><i class="fa-solid fa-times"></i></button>
                </div>

                <div class="p-8 space-y-6 bg-white dark:bg-slate-900">
                    <div class="bg-indigo-50/50 dark:bg-indigo-900/10 p-4 rounded-2xl border border-indigo-100/50 dark:border-indigo-800/30">
                        <h4 class="font-black text-slate-800 dark:text-slate-100 leading-tight mb-2">{{returnRequest()?.standardName}}</h4>
                        <div class="flex justify-between items-center">
                            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tồn kho hiện tại</span>
                            <span class="font-black text-indigo-600">{{currentStandard()?.current_amount || returnRequest()?.standardDetails?.current_amount || 0}} {{currentStandard()?.unit || returnRequest()?.standardDetails?.unit || 'mg'}}</span>
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Lượng thực tế đã dùng <span class="text-red-500">*</span></label>
                        <div class="relative">
                            <input type="number" [ngModel]="returnAmount()" (ngModelChange)="returnAmount.set($event)" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-indigo-500 outline-none pr-12" placeholder="Nhập số lượng...">
                            <span class="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">{{currentStandard()?.unit || returnRequest()?.standardDetails?.unit || 'mg'}}</span>
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-800/20">
                        <input type="checkbox" id="isDepleted" [ngModel]="returnIsDepleted()" (ngModelChange)="returnIsDepleted.set($event)" class="w-5 h-5 accent-amber-600 rounded-lg">
                        <label for="isDepleted" class="text-xs font-bold text-amber-700 dark:amber-400 cursor-pointer">Đánh dấu chuẩn đã dùng hết (Depleted)</label>
                    </div>

                    <div class="flex justify-end gap-3 mt-4 pt-4">
                        <button (click)="closeReturnModal()" class="px-6 py-3 text-slate-500 dark:text-slate-400 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition">Hủy</button>
                        <button (click)="confirmReturn()" [disabled]="returnAmount() === null || isProcessing()" class="px-8 py-3 bg-indigo-600 text-white font-bold text-sm rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 dark:shadow-none transition disabled:opacity-50">
                            Xác nhận trả
                        </button>
                    </div>
                </div>
            </div>
         </div>
      }

      <!-- LOG USAGE MODAL -->
      @if (showLogUsageModal()) {
         <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm fade-in">
            <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-bounce-in border border-slate-100 dark:border-slate-800">
                <div class="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-teal-50/50 dark:bg-teal-900/10">
                    <h3 class="font-black text-teal-600 dark:text-teal-400 text-xl flex items-center gap-2">
                        <i class="fa-solid fa-vial-circle-check"></i> Ghi nhận đợt dùng
                    </h3>
                    <button (click)="closeLogUsageModal()" class="w-8 h-8 rounded-full hover:bg-white dark:hover:bg-slate-800 flex items-center justify-center text-teal-400 transition"><i class="fa-solid fa-times"></i></button>
                </div>

                <div class="p-8 space-y-6 bg-white dark:bg-slate-900">
                    <div>
                        <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Khối lượng đợt này <span class="text-red-500">*</span></label>
                        <div class="relative">
                            <input type="number" [ngModel]="logUsageAmount()" (ngModelChange)="logUsageAmount.set($event)" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-teal-500 outline-none pr-12" placeholder="VD: 5.25">
                            <span class="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">{{selectedRequest()?.standardDetails?.unit}}</span>
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Ghi chú đợt dùng</label>
                        <textarea [ngModel]="logUsagePurpose()" (ngModelChange)="logUsagePurpose.set($event)" rows="2" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-teal-500 transition-all outline-none resize-none" placeholder="VD: Dùng cho mẫu phân tích lô X..."></textarea>
                    </div>

                    <div class="flex justify-end gap-3 mt-4">
                        <button (click)="closeLogUsageModal()" class="px-6 py-3 text-slate-500 dark:text-slate-400 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition">Hủy</button>
                        <button (click)="confirmLogUsage()" [disabled]="!logUsageAmount() || isProcessing()" class="px-8 py-3 bg-teal-600 text-white font-bold text-sm rounded-2xl hover:bg-teal-700 shadow-xl shadow-teal-200 dark:shadow-none transition disabled:opacity-50">
                            Lưu nhật ký dùng
                        </button>
                    </div>
                </div>
            </div>
         </div>
      }
      <!-- ADMIN RECEIVE RETURN MODAL -->
      @if (showAdminReceiveModal()) {
         <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm fade-in">
            <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-bounce-in border border-slate-100 dark:border-slate-800">
                <div class="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-indigo-50/50 dark:bg-indigo-900/10">
                    <h3 class="font-black text-indigo-700 dark:text-indigo-400 text-xl flex items-center gap-2">
                        <i class="fa-solid fa-clipboard-check"></i> Xác nhận nhập kho trả
                    </h3>
                    <button (click)="closeAdminReceiveModal()" class="w-8 h-8 rounded-full hover:bg-white dark:hover:bg-slate-800 flex items-center justify-center text-indigo-400 transition"><i class="fa-solid fa-times"></i></button>
                </div>

                <div class="p-8 space-y-6 bg-white dark:bg-slate-900">
                    <div class="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-inner">
                        <div class="flex flex-col">
                            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">NV báo cáo dùng</span>
                            <span class="text-xl font-black text-indigo-600">{{adminReceiveRequest()?.totalAmountUsed}} {{adminReceiveRequest()?.standardDetails?.unit}}</span>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Trạng thái</span>
                            <span class="text-sm font-bold" [class]="adminReceiveRequest()?.reportedDepleted ? 'text-red-500' : 'text-emerald-500'">
                                {{ adminReceiveRequest()?.reportedDepleted ? 'Báo cáo đã hết' : 'Vẫn còn chuẩn' }}
                            </span>
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Lượng thực tế trừ kho <span class="text-red-500">*</span></label>
                        <div class="relative">
                            <input type="number" [ngModel]="adminReceiveAmount()" (ngModelChange)="adminReceiveAmount.set($event)" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-indigo-500 outline-none pr-12" placeholder="Xác nhận số lượng thực tế...">
                            <span class="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">{{adminReceiveRequest()?.standardDetails?.unit}}</span>
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
                        <button (click)="closeAdminReceiveModal()" class="px-6 py-3 text-slate-500 dark:text-slate-400 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition">Hủy</button>
                        <button (click)="confirmAdminReceive()" [disabled]="adminReceiveAmount() === null || (adminReceiveIsDepleted() && !adminReceiveDisposalReason()) || isProcessing()" class="px-8 py-3 bg-indigo-600 text-white font-bold text-sm rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 dark:shadow-none transition disabled:opacity-50">
                            Hoàn tất tiếp nhận
                        </button>
                    </div>
                </div>
            </div>
         </div>
      }

      <!-- ADMIN PURCHASE REQUESTS MODAL -->
      @if (showPurchaseRequestsAdminModal()) {
         <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm fade-in">
             <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
                 <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 flex justify-between items-center shrink-0">
                     <h3 class="font-black text-slate-800 dark:text-slate-100 text-lg flex items-center gap-2">
                         <div class="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                             <i class="fa-solid fa-cart-shopping"></i>
                         </div>
                         Duyệt Yêu cầu Mua sắm (Hết chuẩn)
                     </h3>
                     <button (click)="closeAdminPurchaseRequests()" class="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-red-500 transition active:scale-95"><i class="fa-solid fa-times"></i></button>
                 </div>
                 <div class="flex-1 overflow-auto p-6 bg-slate-50 dark:bg-slate-900">
                     @if(loadingAdminRequests()) {
                         <div class="py-12 flex justify-center"><i class="fa-solid fa-spinner fa-spin text-2xl text-indigo-500"></i></div>
                     } @else {
                         @if(adminPurchaseRequests().length === 0) {
                             <div class="py-12 text-center text-slate-500 dark:text-slate-400 font-medium">Không có yêu cầu mua sắm nào chờ xử lý.</div>
                         } @else {
                             <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                                 <table class="w-full text-left text-sm whitespace-nowrap">
                                     <thead class="bg-slate-50 dark:bg-slate-800/80 text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                                         <tr>
                                             <th class="px-4 py-3">Chuẩn đối chiếu</th>
                                             <th class="px-4 py-3">Phân loại & Mục đích</th>
                                             <th class="px-4 py-3">Yêu cầu mua sắm</th>
                                             <th class="px-4 py-3">Người đề nghị</th>
                                             <th class="px-4 py-3 text-center">Tác vụ</th>
                                         </tr>
                                     </thead>
                                     <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
                                         @for(r of adminPurchaseRequests(); track r.id) {
                                             <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                                                 <td class="px-4 py-3 align-top">
                                                     <div class="font-bold text-slate-800 dark:text-slate-200 whitespace-normal line-clamp-2 max-w-[200px]" [title]="r.standardName">{{r.standardName}}</div>
                                                     <div class="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 mt-1"><i class="fa-solid fa-barcode mr-1"></i> {{r.product_code}}</div>
                                                 </td>
                                                 <td class="px-4 py-3 align-top">
                                                     <div class="flex flex-col gap-1.5 text-[11px]">
                                                         @if(r.required_level) {
                                                            <div class="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded w-max">
                                                                <i class="fa-solid fa-shield-halved"></i> {{r.required_level}}
                                                            </div>
                                                         }
                                                         @if(r.required_purity) {
                                                            <div class="flex items-center gap-1.5 font-bold text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/30 px-2 py-0.5 rounded w-max">
                                                                <i class="fa-solid fa-droplet"></i> ĐTK: {{r.required_purity}}
                                                            </div>
                                                         }
                                                         @if(r.notes) {
                                                            <div class="text-slate-600 dark:text-slate-400 mt-1 max-w-[250px] whitespace-normal italic bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded" [title]="r.notes">
                                                                <i class="fa-regular fa-comment text-slate-400"></i> {{r.notes}}
                                                            </div>
                                                         }
                                                     </div>
                                                 </td>
                                                 <td class="px-4 py-3 align-top">
                                                     <div class="flex flex-col gap-1 text-[11px] text-slate-600 dark:text-slate-300">
                                                         @if(r.preferred_manufacturer) { 
                                                            <div class="flex gap-2">
                                                                <span class="w-16 text-slate-400 font-medium">Hãng CC:</span>
                                                                <span class="font-black text-slate-800 dark:text-slate-100 uppercase">{{r.preferred_manufacturer}}</span>
                                                            </div> 
                                                         }
                                                         @if(r.expectedAmount) { 
                                                            <div class="flex gap-2">
                                                                <span class="w-16 text-slate-400 font-medium">Lượng cần:</span>
                                                                <span class="font-bold text-indigo-600 dark:text-indigo-400">{{r.expectedAmount}}</span>
                                                            </div>
                                                         }
                                                     </div>
                                                 </td>
                                                 <td class="px-4 py-3 align-top">
                                                     <div class="flex flex-col gap-1">
                                                         <div class="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                                             <div class="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] text-slate-500"><i class="fa-solid fa-user"></i></div>
                                                             {{r.requestedByName}}
                                                         </div>
                                                         <div class="text-[11px] text-slate-500 ml-6"><i class="fa-regular fa-clock mr-1"></i> {{r.requestDate | date:'dd/MM/yyyy HH:mm'}}</div>
                                                         @if(r.priority === 'HIGH') {
                                                             <div class="ml-6 mt-1">
                                                                 <span class="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-600 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50 uppercase tracking-widest"><i class="fa-solid fa-bolt mr-1"></i> GẤP</span>
                                                             </div>
                                                         }
                                                     </div>
                                                 </td>
                                                 <td class="px-4 py-3 text-center align-top">
                                                     <button (click)="markPurchaseRequestCompleted(r)" [disabled]="isProcessing()" class="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-sm shadow-emerald-200 dark:shadow-none transition disabled:opacity-50 active:scale-95 flex items-center gap-1.5 mx-auto">
                                                         <i class="fa-solid fa-check"></i> Đã nhận hàng
                                                     </button>
                                                 </td>
                                             </tr>
                                         }
                                     </tbody>
                                 </table>
                             </div>
                         }
                     }
                 </div>
             </div>
         </div>
      }

    </div>
  `
})
export class StandardRequestsComponent implements OnInit, OnDestroy {
  stdService = inject(StandardService);
  state = inject(StateService);
  toast = inject(ToastService);
  confirmationService = inject(ConfirmationService);
  auth = inject(AuthService);
  fb = inject(FormBuilder);

  requests = signal<StandardRequest[]>([]);
  availableStandards = signal<ReferenceStandard[]>([]);
  allStandards = signal<ReferenceStandard[]>([]);
  
  searchTerm = signal('');
  statusFilter = signal<string>('ALL');
  
  isLoading = signal(true);
  isProcessing = signal(false);
  showModal = signal(false);
  
  showRejectModal = signal(false);
  rejectReason = signal<string>('');
  selectedRequest = signal<StandardRequest | null>(null);
  
  // Approve Modal (Duyệt & Giao)
  showApproveModal = signal(false);
  approveExpectedDate = signal<string>('');
  approveExpectedAmount = signal<number | null>(null);
  approvePurpose = signal<string>('');
  
  // Return Modal
  showReturnModal = signal(false);
  returnAmount = signal<number | null>(null);
  returnRequest = signal<StandardRequest | null>(null);
  isForceReturn = signal(false);
  returnIsDepleted = signal(false);

  // Log Usage Modal (Dùng dần)
  showLogUsageModal = signal(false);
  logUsageAmount = signal<number | null>(null);
  logUsagePurpose = signal('');

  // Admin Receive Return Modal
  showAdminReceiveModal = signal(false);
  adminReceiveRequest = signal<StandardRequest | null>(null);
  adminReceiveAmount = signal<number | null>(null);
  adminReceiveIsDepleted = signal(false);
  adminReceiveDisposalReason = signal('');
  
  currentStandard = computed(() => {
      const req = this.returnRequest();
      if (!req) return null;
      return this.allStandards().find(s => s.id === req.standardId) || null;
  });

  // Multi-select state
  selectedStandardIds = signal<Set<string>>(new Set());
  standardSearchTerm = signal('');

  clearSelection() {
      this.selectedStandardIds.set(new Set());
  }

  // Computed: full details of selected standards for chip display
  selectedStandardsList = computed(() => {
      const ids = this.selectedStandardIds();
      if (ids.size === 0) return [];
      // Search in both availableStandards and allStandards to cover all cases
      const allMap = new Map([
          ...this.availableStandards().map(s => [s.id, s] as [string, ReferenceStandard]),
          ...this.allStandards().map(s => [s.id, s] as [string, ReferenceStandard])
      ]);
      return Array.from(ids)
          .map(id => allMap.get(id))
          .filter((s): s is ReferenceStandard => !!s);
  });

  // Admin Purchase Requests
  showPurchaseRequestsAdminModal = signal(false);
  loadingAdminRequests = signal(false);
  adminPurchaseRequests = signal<PurchaseRequest[]>([]);
  pendingPurchaseRequestsCount = signal(0);
  private purchaseReqUnsub?: Unsubscribe;
  
  private unsubRequests: Unsubscribe | null = null;
  private unsubStandards: Unsubscribe | null = null;

  form: FormGroup = this.fb.group({
    purpose: [''],
    expectedReturnDate: ['']
  });

  isDepleted(std: ReferenceStandard): boolean {
      return std.status === 'DEPLETED' || (std.current_amount ?? 0) <= 0;
  }

  filteredAvailableStandards = computed(() => {
      const rawTerm = this.standardSearchTerm();
      let stds = this.availableStandards();
      
      if (rawTerm) {
          const searchTerms = rawTerm.split('+').map(t => removeAccents(t.trim().toLowerCase())).filter(t => t.length > 0);
          
          stds = stds.filter(s => {
              const searchStr = Object.values(s)
                  .filter(val => val !== null && val !== undefined && typeof val !== 'object')
                  .map(val => {
                      let str = String(val);
                      if (typeof val === 'string' && val.match(/^\d{4}-\d{2}-\d{2}/)) {
                          const parts = val.split('T')[0].split('-');
                          if (parts.length === 3) str += ` ${parts[2]}/${parts[1]}/${parts[0]}`;
                      }
                      return removeAccents(str.toLowerCase());
                  })
                  .join(' ');
              
              return searchTerms.every(t => searchStr.includes(t));
          });
      }
      // Sort: available first, depleted at bottom
      return stds.sort((a, b) => {
          const aD = a.status === 'DEPLETED' || (a.current_amount ?? 0) <= 0 ? 1 : 0;
          const bD = b.status === 'DEPLETED' || (b.current_amount ?? 0) <= 0 ? 1 : 0;
          return aD - bD;
      });
  });

  filteredRequests = computed(() => {
    let reqs = this.requests();
    const term = removeAccents(this.searchTerm().toLowerCase());
    const status = this.statusFilter();
    const stdsMap = new Map(this.allStandards().map(s => [s.id, s]));
    const currentUser = this.auth.currentUser();
    const isAdmin = this.auth.canApproveStandards();

    // Filter for non-admins to only see their own requests (for the main list)
    let displayReqs = [...reqs];
    if (!isAdmin && currentUser) {
        displayReqs = displayReqs.filter(r => r.requestedBy === currentUser.uid);
    }

    if (status !== 'ALL') {
        displayReqs = displayReqs.filter(r => r.status === status);
    }

    if (term) {
        displayReqs = displayReqs.filter(r => 
            removeAccents(r.standardName.toLowerCase()).includes(term) || 
            removeAccents(r.requestedByName.toLowerCase()).includes(term) ||
            (r.lotNumber && removeAccents(r.lotNumber.toLowerCase()).includes(term))
        );
    }
    
    return displayReqs.map(r => ({
        ...r,
        standardDetails: stdsMap.get(r.standardId)
    }));
  });

  // Dashboard Stats
  pendingApprovalCount = computed(() => this.requests().filter(r => r.status === 'PENDING_APPROVAL').length);
  inProgressCount = computed(() => this.requests().filter(r => r.status === 'IN_PROGRESS').length);
  overdueCount = computed(() => {
      const now = Date.now();
      return this.requests().filter(r => 
          r.status === 'IN_PROGRESS' && 
          r.expectedReturnDate && 
          r.expectedReturnDate < now
      ).length;
  });

  // Status Counts for Tabs (Admin views all, Users view theirs)
  statusCounts = computed(() => {
      const reqs = this.requests();
      const currentUser = this.auth.currentUser();
      const isAdmin = this.auth.canApproveStandards();
      
      const filtered = isAdmin ? reqs : reqs.filter(r => r.requestedBy === currentUser?.uid);
      
      return {
          ALL: filtered.length,
          PENDING_APPROVAL: filtered.filter(r => r.status === 'PENDING_APPROVAL').length,
          IN_PROGRESS: filtered.filter(r => r.status === 'IN_PROGRESS').length,
          PENDING_RETURN: filtered.filter(r => r.status === 'PENDING_RETURN').length,
          COMPLETED: filtered.filter(r => r.status === 'COMPLETED').length,
          REJECTED: filtered.filter(r => r.status === 'REJECTED').length
      };
  });

  getStatusClass(status: StandardRequestStatus): string {
      switch (status) {
          case 'PENDING_APPROVAL': return 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800';
          case 'IN_PROGRESS': return 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
          case 'PENDING_RETURN': return 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800';
          case 'COMPLETED': return 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800';
          case 'REJECTED': return 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800';
          default: return 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
      }
  }

  getStatusIcon(status: StandardRequestStatus): string {
      switch (status) {
          case 'PENDING_APPROVAL': return 'fa-solid fa-hourglass-start';
          case 'IN_PROGRESS': return 'fa-solid fa-flask-vial';
          case 'PENDING_RETURN': return 'fa-solid fa-reply-all';
          case 'COMPLETED': return 'fa-solid fa-check-double';
          case 'REJECTED': return 'fa-solid fa-circle-xmark';
          default: return 'fa-solid fa-circle-question';
      }
  }

  // Helper for template
  protected readonly Date = Date;

  ngOnInit() {
    this.unsubRequests = this.stdService.listenToRequests((reqs) => {
        this.requests.set(reqs);
        this.isLoading.set(false);
    });
    
    // Listen to all standards for the dropdown and details mapping
    this.unsubStandards = this.stdService.listenToAllStandards((stds: ReferenceStandard[]) => {
        this.allStandards.set(stds);
        // Only show standards that are available for new requests
        // Show all non-IN_USE standards; depleted ones are shown with visual indicator
        this.availableStandards.set(stds.filter(s => s.status !== 'IN_USE'));
    });
    
    // Listen to purchase requests for Admin
    if (this.auth.canApproveStandards()) {
        this.purchaseReqUnsub = this.stdService.listenToPendingPurchaseRequests((reqs) => {
            this.adminPurchaseRequests.set(reqs);
            this.pendingPurchaseRequestsCount.set(reqs.length);
            this.loadingAdminRequests.set(false);
        });
    }
  }

  ngOnDestroy() {
    if (this.unsubRequests) this.unsubRequests();
    if (this.unsubStandards) this.unsubStandards();
    if (this.purchaseReqUnsub) this.purchaseReqUnsub();
  }

  // --- Purchase Requests Logic (Admin) ---
  openAdminPurchaseRequests() {
      if (!this.auth.canApproveStandards()) return;
      this.loadingAdminRequests.set(true);
      this.showPurchaseRequestsAdminModal.set(true);
      setTimeout(() => this.loadingAdminRequests.set(false), 300);
  }

  closeAdminPurchaseRequests() {
      this.showPurchaseRequestsAdminModal.set(false);
  }

  async markPurchaseRequestCompleted(req: PurchaseRequest) {
      if (!req.id) return;
      this.confirmationService.confirm({
          message: `Xác nhận bạn đã MUA và NHẬN ĐƯỢC chuẩn "${req.standardName}"? Cần cập nhật số lượng tồn kho theo số liệu thực tế sau khi nhận.`,
          confirmText: 'Đã nhận',
          cancelText: 'Hủy'
      }).then(async (confirmed) => {
          if (confirmed) {
              this.isProcessing.set(true);
              try {
                  const uid = this.auth.currentUser()?.uid || '';
                  const uname = this.auth.currentUser()?.displayName || this.auth.currentUser()?.email || 'Admin';
                  const reqId = req.id as string;
                  await this.stdService.completePurchaseRequest(reqId, req.standardId, uid, uname);
                  this.toast.show('Đã hoàn thành yêu cầu mua sắm. Vui lòng cập nhật số lượng tồn kho của chuẩn!', 'success');
              } catch (e: any) {
                  this.toast.show('Lỗi: ' + e.message, 'error');
              } finally {
                  this.isProcessing.set(false);
              }
          }
      });
  }

  openRequestModal() {
      this.form.reset();
      this.selectedStandardIds.set(new Set());
      this.standardSearchTerm.set('');
      this.showModal.set(true);
  }

  closeModal() {
      this.showModal.set(false);
  }

  toggleStandardSelection(stdId: string) {
      const current = new Set(this.selectedStandardIds());
      if (current.has(stdId)) {
          current.delete(stdId);
      } else {
          current.add(stdId);
      }
      this.selectedStandardIds.set(current);
  }

  isExpired(expiryDate: string | undefined): boolean {
      if (!expiryDate) return false;
      const date = new Date(expiryDate);
      if (isNaN(date.getTime())) return false;
      return date.getTime() < Date.now();
  }

  isOverdue(expiryDate: string | undefined): boolean {
      return this.isExpired(expiryDate);
  }

  async submitRequest() {
      if (this.selectedStandardIds().size === 0 || this.isProcessing()) return;
      
      const user = this.auth.currentUser();
      if (!user) {
          this.toast.show('Bạn cần đăng nhập để thực hiện', 'error');
          return;
      }

      const val = this.form.value;
      const purpose = val.purpose?.trim() || 'Pha chuẩn mới';
      let expectedReturnDate: number | undefined;
      if (val.expectedReturnDate) {
          expectedReturnDate = new Date(val.expectedReturnDate).getTime();
      }
      
      this.isProcessing.set(true);
      try {
          const selectedIds = Array.from(this.selectedStandardIds());
          
          for (const stdId of selectedIds) {
              const std = this.availableStandards().find(s => s.id === stdId);
              if (!std) continue;
              
              const req: StandardRequest = {
                  standardId: std.id,
                  standardName: std.name,
                  lotNumber: std.lot_number,
                  requestedBy: user.uid,
                  requestedByName: user.displayName || user.email || 'Unknown',
                  requestDate: Date.now(),
                  purpose: purpose,
                  status: 'PENDING_APPROVAL',
                  totalAmountUsed: 0
              };
              
              req.expectedReturnDate = expectedReturnDate ?? null;
              
              await this.stdService.createRequest(req);
          }
          
          this.toast.show(`Đã gửi ${selectedIds.length} yêu cầu thành công`, 'success');
          this.closeModal();
      } catch (e: any) {
          this.toast.show('Lỗi: ' + (e.message || e), 'error');
      } finally {
          this.isProcessing.set(false);
      }
  }

  async hardDeleteHistory(req: StandardRequest) {
      this.confirmationService.confirm({
          message: `XÓA YÊU CẦU: Thao tác này sẽ dọn dẹp các bản ghi nhật ký tự động và HOÀN TÁC dư lượng của chuẩn "${req.standardName}". Dữ liệu bị xóa không thể khôi phục!`,
          confirmText: 'Đồng ý xóa & Fallback',
          cancelText: 'Hủy',
          isDangerous: true
      }).then(async (confirmed) => {
          if (confirmed) {
              this.isProcessing.set(true);
              try {
                  await this.stdService.hardDeleteRequest(req);
                  this.toast.show('Đã xóa vĩnh viễn lịch sử và hoàn tác dữ liệu thành công', 'success');
              } catch (e: any) {
                  this.toast.show('Lỗi khi xóa: ' + (e.message || e), 'error');
              } finally {
                  this.isProcessing.set(false);
              }
          }
      });
  }

  async approveRequest(req: StandardRequest) {
      if (!req.id) return;
      this.selectedRequest.set(req);
      
      // Pre-fill from request
      this.approvePurpose.set(req.purpose || '');
      this.approveExpectedAmount.set(req.expectedAmount || null);
      if (req.expectedReturnDate) {
          const date = new Date(req.expectedReturnDate);
          this.approveExpectedDate.set(date.toISOString().split('T')[0]);
      } else {
          this.approveExpectedDate.set('');
      }
      
      this.showApproveModal.set(true);
  }

  async confirmApprove() {
      const req = this.selectedRequest();
      if (!req || !req.id) return;
      const user = this.auth.currentUser();
      if (!user) return;

      this.isProcessing.set(true);
      try {
          // Update expected date if changed
          let updatedExpectedDate = req.expectedReturnDate;
          if (this.approveExpectedDate()) {
              updatedExpectedDate = new Date(this.approveExpectedDate()).getTime();
          } else if (this.approveExpectedDate() === '') {
              updatedExpectedDate = undefined;
          }

          // Dispense
          await this.stdService.dispenseStandard(req.id, req.standardId, user.uid, user.displayName || user.email || 'Unknown');
          
          // If purpose or date changed, update it too
          if (this.approvePurpose() !== req.purpose || updatedExpectedDate !== req.expectedReturnDate || this.approveExpectedAmount() !== req.expectedAmount) {
              const updates: any = {
                  purpose: this.approvePurpose(),
                  expectedReturnDate: updatedExpectedDate ?? null,
                  expectedAmount: this.approveExpectedAmount() ?? null
              };
              
              await this.stdService.updateRequestStatus(req.id, 'IN_PROGRESS', updates);
          }

          this.toast.show('Đã duyệt và giao chuẩn thành công', 'success');
          this.showApproveModal.set(false);
          this.selectedRequest.set(null);
      } catch (e: any) {
          this.toast.show('Lỗi: ' + e.message, 'error');
      } finally {
          this.isProcessing.set(false);
      }
  }

  openRejectModal(req: StandardRequest) {
      this.selectedRequest.set(req);
      this.rejectReason.set('');
      this.showRejectModal.set(true);
  }

  closeRejectModal() {
      this.showRejectModal.set(false);
      this.selectedRequest.set(null);
      this.rejectReason.set('');
  }

  async confirmReject() {
      const req = this.selectedRequest();
      const reason = this.rejectReason().trim();
      
      if (!req || !req.id) return;
      if (!reason) {
          this.toast.show('Vui lòng nhập lý do từ chối', 'info');
          return;
      }

      this.isProcessing.set(true);
      try {
          await this.stdService.updateRequestStatus(req.id, 'REJECTED', { rejectionReason: reason });
          this.toast.show('Đã từ chối yêu cầu', 'success');
          this.closeRejectModal();
      } catch (e: any) {
          this.toast.show('Lỗi: ' + e.message, 'error');
      } finally {
          this.isProcessing.set(false);
      }
  }

  openReturnModal(req: StandardRequest, isForce: boolean) {
      this.returnRequest.set(req);
      this.isForceReturn.set(isForce);
      // Mặc định lấy tổng đã dùng nếu có
      this.returnAmount.set(req.totalAmountUsed || null);
      this.returnIsDepleted.set(false);
      this.showReturnModal.set(true);
  }

  closeReturnModal() {
      this.showReturnModal.set(false);
      this.returnRequest.set(null);
      this.returnAmount.set(null);
      this.returnIsDepleted.set(false);
  }

  openLogUsageModal(req: StandardRequest) {
      this.selectedRequest.set(req);
      this.logUsageAmount.set(null);
      this.logUsagePurpose.set('');
      this.showLogUsageModal.set(true);
  }

  closeLogUsageModal() {
      this.showLogUsageModal.set(false);
      this.selectedRequest.set(null);
      this.logUsageAmount.set(null);
      this.logUsagePurpose.set('');
  }

  async confirmLogUsage() {
      const req = this.selectedRequest();
      const amount = this.logUsageAmount();
      if (!req || !req.id || amount === null || amount <= 0) return;

      this.isProcessing.set(true);
      try {
          const user = this.auth.currentUser();
          await this.stdService.logUsageForRequest(req.id, req.standardId, amount, req.standardDetails?.unit || 'mg', this.logUsagePurpose().trim(), user?.uid || '', user?.displayName || user?.email || 'Unknown');
          this.toast.show('Đã ghi nhận sử dụng (Dùng dần) thành công', 'success');
          this.closeLogUsageModal();
      } catch (error: any) {
          this.toast.show('Lỗi: ' + error.message, 'error');
      } finally {
          this.isProcessing.set(false);
      }
  }

  async confirmReturn() {
      const req = this.returnRequest();
      const amount = this.returnAmount();
      if (!req || !req.id || amount === null || amount < 0) return;

      this.isProcessing.set(true);
      try {
          if (this.isForceReturn()) {
              // Admin force return
              const user = this.auth.currentUser();
              await this.stdService.returnStandard(req.id, req.standardId, user?.uid || '', user?.displayName || user?.email || 'Unknown', this.returnIsDepleted(), amount, req.standardDetails?.unit || 'mg');
              this.toast.show('Đã thu hồi chuẩn thành công', 'success');
          } else {
              // Employee report return
              await this.stdService.updateRequestStatus(req.id, 'PENDING_RETURN', { 
                  totalAmountUsed: amount,
                  reportedDepleted: this.returnIsDepleted()
              });
              this.toast.show('Đã báo cáo trả chuẩn', 'success');
          }
          this.closeReturnModal();
      } catch (error: any) {
          this.toast.show('Lỗi: ' + error.message, 'error');
      } finally {
          this.isProcessing.set(false);
      }
  }

  openAdminReceiveModal(req: StandardRequest) {
      if (!req.id) return;
      this.adminReceiveRequest.set(req);
      this.adminReceiveAmount.set(req.totalAmountUsed || 0);
      this.adminReceiveIsDepleted.set(req.reportedDepleted || false);
      this.adminReceiveDisposalReason.set(req.disposalReason || '');
      this.showAdminReceiveModal.set(true);
  }

  closeAdminReceiveModal() {
      this.showAdminReceiveModal.set(false);
      this.adminReceiveRequest.set(null);
      this.adminReceiveAmount.set(null);
      this.adminReceiveIsDepleted.set(false);
      this.adminReceiveDisposalReason.set('');
  }

  async confirmAdminReceive() {
      const req = this.adminReceiveRequest();
      if (!req || !req.id) return;
      const user = this.auth.currentUser();
      if (!user) return;
      
      const amount = this.adminReceiveAmount() || 0;
      const isDepleted = this.adminReceiveIsDepleted();
      const reason = this.adminReceiveDisposalReason().trim();

      if (isDepleted && !reason) {
          this.toast.show('Vui lòng nhập lý do hủy chuẩn (disposal reason)', 'error');
          return;
      }

      this.isProcessing.set(true);
      try {
          if (isDepleted) {
              await this.stdService.updateRequestStatus(req.id, 'COMPLETED', { disposalReason: reason });
          }
          await this.stdService.returnStandard(req.id, req.standardId, user.uid, user.displayName || user.email || 'Unknown', isDepleted, amount, req.standardDetails?.unit || 'mg');
          this.toast.show('Đã nhận lại chuẩn thành công', 'success');
          this.closeAdminReceiveModal();
      } catch (e: any) {
          this.toast.show('Lỗi: ' + e.message, 'error');
      } finally {
          this.isProcessing.set(false);
      }
  }

  getStatusLabel(status: StandardRequestStatus): string {
      switch(status) {
          case 'PENDING_APPROVAL': return 'Chờ duyệt';
          case 'IN_PROGRESS': return 'Đang sử dụng';
          case 'PENDING_RETURN': return 'Chờ trả';
          case 'COMPLETED': return 'Hoàn thành';
          case 'REJECTED': return 'Từ chối';
          default: return status;
      }
  }
}
