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
    <div class="flex flex-col space-y-2 md:space-y-3 fade-in h-full relative">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-2 shrink-0 bg-white dark:bg-slate-800 p-2 px-3 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm dark:shadow-none">
        <div>
            <h2 class="text-base font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-800/50 shadow-sm dark:shadow-none">
                    <i class="fa-solid fa-clipboard-list text-xs"></i>
                </div>
                Quản lý Yêu cầu Chuẩn
            </h2>
        </div>
        
        <div class="flex gap-2 items-center">
             @if (auth.canApproveStandards() && pendingPurchaseRequestsCount() > 0) {
                 <button (click)="openAdminPurchaseRequests()" class="relative px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg shadow-sm shadow-amber-200 dark:shadow-none transition font-bold text-[11px] flex items-center gap-1.5 active:scale-95">
                     <i class="fa-solid fa-bell animate-pulse"></i> Yêu cầu Mua sắm
                     <span class="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-red-500 text-white rounded-full text-[10px] shadow-sm">{{pendingPurchaseRequestsCount()}}</span>
                 </button>
             }
             <button (click)="openRequestModal()" class="px-3 py-1.5 bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 rounded-lg shadow-sm shadow-indigo-200 dark:shadow-none transition font-bold text-[11px] flex items-center gap-1.5">
                <i class="fa-solid fa-plus"></i> Tạo Yêu cầu Mới
             </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1 min-h-0 overflow-hidden bg-white dark:bg-slate-800 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-700 flex flex-col relative">
          
          <!-- Filters -->
          <div class="p-2 border-b border-slate-50 dark:border-slate-700 flex flex-col gap-2 bg-slate-50/30 dark:bg-slate-800/50">
             <div class="flex flex-col md:flex-row gap-2">
                 <div class="relative flex-1 group">
                    <i class="fa-solid fa-search absolute left-2.5 top-2 text-slate-400 dark:text-slate-500 text-xs group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors"></i>
                    <input type="text" [ngModel]="searchTerm()" (ngModelChange)="searchTerm.set($event)" 
                           class="w-full pl-7 pr-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 transition shadow-sm dark:shadow-none placeholder-slate-400 dark:placeholder-slate-500"
                           placeholder="Tìm kiếm yêu cầu...">
                 </div>
                 
                 <div class="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 shadow-sm dark:shadow-none h-[30px]">
                     <span class="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase whitespace-nowrap"><i class="fa-solid fa-filter mr-1"></i> Trạng thái:</span>
                     <select [ngModel]="statusFilter()" (ngModelChange)="statusFilter.set($event)" 
                             class="bg-transparent text-[11px] font-bold text-slate-700 dark:text-slate-300 outline-none cursor-pointer border-none py-1 pr-1">
                         <option value="ALL" class="dark:bg-slate-800">Tất cả</option>
                         <option value="PENDING_APPROVAL" class="dark:bg-slate-800">Chờ duyệt</option>
                         <option value="IN_PROGRESS" class="dark:bg-slate-800">Đang sử dụng</option>
                         <option value="PENDING_RETURN" class="dark:bg-slate-800">Chờ trả</option>
                         <option value="COMPLETED" class="dark:bg-slate-800">Đã hoàn thành</option>
                         <option value="REJECTED" class="dark:bg-slate-800">Đã từ chối</option>
                     </select>
                 </div>
             </div>
          </div>

          <!-- Content Body -->
          <div class="flex-1 min-h-0 overflow-auto custom-scrollbar relative bg-slate-50/30 dark:bg-slate-900/50">
              <div class="min-w-[1000px]"> 
                  <table class="w-full text-sm text-left relative border-collapse">
                     <thead class="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase bg-slate-50 dark:bg-slate-800/80 sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-none h-12 tracking-wide">
                        <tr>
                           <th class="px-4 py-3 w-[20%]">Chuẩn đối chiếu</th>
                           <th class="px-4 py-3 w-[20%]">Người yêu cầu & Mục đích</th>
                           <th class="px-4 py-3 w-[15%]">Thời gian</th>
                           <th class="px-4 py-3 w-[15%] text-center">Trạng thái</th>
                           <th class="px-4 py-3 w-[20%] text-center">Người duyệt/nhận</th>
                           <th class="px-4 py-3 w-[10%] text-center">Tác vụ</th>
                        </tr>
                     </thead>
                     <tbody class="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
                        @if (isLoading()) {
                             <tr><td colspan="6" class="p-8 text-center"><i class="fa-solid fa-spinner fa-spin text-indigo-500 text-2xl"></i></td></tr>
                        } @else {
                            @for (req of filteredRequests(); track req.id) {
                               <tr class="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/20 transition group">
                                  <td class="px-4 py-3 align-top">
                                     <div class="font-bold text-slate-800 dark:text-slate-200 text-sm mb-1">{{req.standardName}}</div>
                                     <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex flex-col gap-1">
                                         @if(req.standardDetails?.internal_id) {
                                             <span title="Mã nội bộ"><i class="fa-solid fa-barcode w-3"></i> {{req.standardDetails?.internal_id}}</span>
                                         }
                                         <span title="Lot Number"><i class="fa-solid fa-hashtag w-3"></i> {{req.lotNumber || 'N/A'}}</span>
                                         @if(req.standardDetails?.cas_number) {
                                             <span title="CAS"><i class="fa-solid fa-flask w-3"></i> {{req.standardDetails?.cas_number}}</span>
                                         }
                                         @if(req.standardDetails?.manufacturer) {
                                             <span title="Hãng sản xuất"><i class="fa-solid fa-industry w-3"></i> {{req.standardDetails?.manufacturer}}</span>
                                         }
                                         @if(req.standardDetails?.expiry_date) {
                                             <span title="Hạn sử dụng" [class.text-red-500]="isExpired(req.standardDetails?.expiry_date)"><i class="fa-regular fa-calendar-xmark w-3"></i> {{req.standardDetails?.expiry_date | date:'dd/MM/yyyy'}}</span>
                                         }
                                         @if(req.standardDetails?.current_amount !== undefined) {
                                             <span title="Tồn kho" class="font-bold text-indigo-600 dark:text-indigo-400"><i class="fa-solid fa-box w-3"></i> {{req.standardDetails?.current_amount}} {{req.standardDetails?.unit}}</span>
                                         }
                                         @if(req.standardDetails?.location) {
                                             <span title="Vị trí"><i class="fa-solid fa-location-dot w-3"></i> {{req.standardDetails?.location}}</span>
                                         }
                                     </div>
                                  </td>
                                  <td class="px-4 py-3 align-top border-l border-slate-50 dark:border-slate-800">
                                     <div class="font-bold text-slate-700 dark:text-slate-300 text-sm mb-1">{{req.requestedByName}}</div>
                                     <div class="text-xs text-slate-500 dark:text-slate-400 italic">{{req.purpose}}</div>
                                     @if(req.totalAmountUsed !== undefined && req.totalAmountUsed !== null) {
                                         <div class="mt-1 text-xs text-indigo-600 dark:text-indigo-400 font-bold">Đã dùng: {{req.totalAmountUsed}} {{req.standardDetails?.unit || 'mg'}}</div>
                                     }
                                     @if(req.reportedDepleted) {
                                         <div class="mt-1 text-[10px] font-bold text-orange-600 bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800/50 px-1.5 py-0.5 rounded inline-block">
                                             <i class="fa-solid fa-triangle-exclamation"></i> Báo cáo đã hết
                                         </div>
                                     }
                                  </td>
                                  <td class="px-4 py-3 align-top border-l border-slate-50 dark:border-slate-800">
                                     <div class="text-xs text-slate-600 dark:text-slate-400 mb-1"><span class="font-bold">Yêu cầu:</span> {{req.requestDate | date:'dd/MM/yyyy HH:mm'}}</div>
                                     @if(req.expectedReturnDate) {
                                        <div class="text-xs text-slate-600 dark:text-slate-400"><span class="font-bold">Dự kiến trả:</span> {{req.expectedReturnDate | date:'dd/MM/yyyy'}}</div>
                                     }
                                  </td>
                                  <td class="px-4 py-3 align-top text-center border-l border-slate-50 dark:border-slate-800">
                                      <span class="inline-block px-2 py-1 rounded-md text-[10px] font-bold uppercase border tracking-wide whitespace-nowrap" [ngClass]="getStatusClass(req.status)">{{getStatusLabel(req.status)}}</span>
                                  </td>
                                  <td class="px-4 py-3 align-top text-center border-l border-slate-50 dark:border-slate-800">
                                     @if(req.approvedByName) {
                                        <div class="text-xs text-emerald-600 dark:text-emerald-400 mb-1"><span class="font-bold">Duyệt:</span> {{req.approvedByName}}</div>
                                     }
                                     @if(req.receivedByName) {
                                        <div class="text-xs text-blue-600 dark:text-blue-400"><span class="font-bold">Nhận:</span> {{req.receivedByName}}</div>
                                     }
                                  </td>
                                  <td class="px-4 py-3 align-top text-center border-l border-slate-50 dark:border-slate-800">
                                     <div class="flex flex-col items-center gap-2">
                                        @if(req.status === 'PENDING_APPROVAL' && auth.canApproveStandards()) {
                                            <button (click)="approveRequest(req)" class="w-full px-2 py-1 rounded bg-emerald-600 text-white text-[10px] font-bold hover:bg-emerald-700 transition">Duyệt & Giao</button>
                                            <button (click)="openRejectModal(req)" class="w-full px-2 py-1 rounded bg-red-100 text-red-600 text-[10px] font-bold hover:bg-red-200 transition">Từ chối</button>
                                        }
                                        @if(req.status === 'IN_PROGRESS') {
                                            @if(req.requestedBy === auth.currentUser()?.uid) {
                                                <button (click)="openLogUsageModal(req)" class="w-full px-2 py-1 rounded bg-teal-600 text-white text-[10px] font-bold hover:bg-teal-700 transition mb-1"><i class="fa-solid fa-pen-to-square mr-1"></i> Ghi nhận dùng</button>
                                                <button (click)="openReturnModal(req, false)" class="w-full px-2 py-1 rounded bg-blue-600 text-white text-[10px] font-bold hover:bg-blue-700 transition">Báo cáo trả</button>
                                            }
                                            @if(auth.canApproveStandards()) {
                                                <button (click)="openReturnModal(req, true)" class="w-full px-2 py-1 rounded bg-rose-600 text-white text-[10px] font-bold hover:bg-rose-700 transition mt-1">Thu hồi trực tiếp</button>
                                            }
                                        }
                                        @if(req.status === 'PENDING_RETURN' && auth.canApproveStandards()) {
                                            <button (click)="openAdminReceiveModal(req)" class="w-full px-2 py-1.5 rounded bg-indigo-600 text-white text-[10px] font-bold hover:bg-indigo-700 transition"><i class="fa-solid fa-check-to-slot mr-1"></i> Tiếp nhận trả</button>
                                        }
                                     </div>
                                  </td>
                               </tr>
                            } 
                            @if (filteredRequests().length === 0) { <tr><td colspan="6" class="p-16 text-center text-slate-400 dark:text-slate-500 italic">Không có yêu cầu nào.</td></tr> }
                        }
                     </tbody>
                  </table>
              </div>
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
                        <div class="space-y-2">
                            @for(std of filteredAvailableStandards(); track std.id) {
                                <div class="p-4 bg-white dark:bg-slate-900/50 border rounded-2xl transition-all cursor-pointer flex items-start gap-4 group"
                                     [ngClass]="{
                                        'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20': selectedStandardIds().has(std.id),
                                        'border-slate-100 dark:border-slate-800': !selectedStandardIds().has(std.id)
                                     }"
                                     (click)="toggleStandardSelection(std.id)">
                                    
                                    <div class="mt-1">
                                        <div class="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all"
                                             [ngClass]="{
                                                'bg-indigo-600 border-indigo-600': selectedStandardIds().has(std.id),
                                                'border-slate-300': !selectedStandardIds().has(std.id)
                                             }">
                                            @if(selectedStandardIds().has(std.id)) {
                                                <i class="fa-solid fa-check text-[10px] text-white"></i>
                                            }
                                        </div>
                                    </div>

                                    <div class="flex-1 min-w-0">
                                        <div class="font-bold text-sm text-slate-800 dark:text-slate-100 truncate group-hover:text-indigo-600 transition-colors">{{std.name}}</div>
                                        <div class="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                                            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider"><i class="fa-solid fa-hashtag mr-1"></i> {{std.lot_number || 'N/A'}}</span>
                                            <span class="text-[10px] font-bold text-emerald-600"><i class="fa-solid fa-box mr-1"></i> {{std.current_amount}} {{std.unit}}</span>
                                            @if(std.internal_id) {
                                                <span class="text-[10px] font-bold text-indigo-500"><i class="fa-solid fa-barcode mr-1"></i> {{std.internal_id}}</span>
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

                            <div class="space-y-4">
                                <div>
                                    <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Mục đích sử dụng <span class="text-red-500">*</span></label>
                                    <textarea formControlName="purpose" rows="3" 
                                              class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none resize-none placeholder-slate-300" 
                                              placeholder="VD: Pha chuẩn cho máy HPLC-MS/MS..."></textarea>
                                    <div class="flex flex-wrap gap-2 mt-2">
                                        <button type="button" (click)="form.patchValue({purpose: 'Pha chuẩn định kỳ'})" class="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 rounded-lg transition border border-transparent hover:border-indigo-200"># Pha chuẩn định kỳ</button>
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
                        <label for="isDepleted" class="text-xs font-bold text-amber-700 dark:text-amber-400 cursor-pointer">Đánh dấu chuẩn đã dùng hết (Depleted)</label>
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
                        <label for="adminIsDepleted" class="text-xs font-bold text-amber-700 dark:text-amber-400 cursor-pointer">Xác nhận chuẩn đã dùng hết (Hủy chuẩn)</label>
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

  filteredAvailableStandards = computed(() => {
      const term = removeAccents(this.standardSearchTerm().toLowerCase());
      let stds = this.availableStandards();
      
      if (!term) {
          return stds.filter(s => this.selectedStandardIds().has(s.id));
      }

      if (term) {
          stds = stds.filter(s => 
              removeAccents(s.name.toLowerCase()).includes(term) || 
              (s.lot_number && removeAccents(s.lot_number.toLowerCase()).includes(term)) ||
              (s.cas_number && removeAccents(s.cas_number.toLowerCase()).includes(term)) ||
              (s.internal_id && removeAccents(s.internal_id.toLowerCase()).includes(term)) ||
              (s.manufacturer && removeAccents(s.manufacturer.toLowerCase()).includes(term))
          );
      }
      return stds;
  });

  filteredRequests = computed(() => {
    let reqs = this.requests();
    const term = removeAccents(this.searchTerm().toLowerCase());
    const status = this.statusFilter();
    const stdsMap = new Map(this.allStandards().map(s => [s.id, s]));
    const currentUser = this.auth.currentUser();
    const isAdmin = this.auth.canApproveStandards();

    // Filter for non-admins to only see their own requests
    if (!isAdmin && currentUser) {
        reqs = reqs.filter(r => r.requestedBy === currentUser.uid);
    }

    if (status !== 'ALL') {
        reqs = reqs.filter(r => r.status === status);
    }

    if (term) {
        reqs = reqs.filter(r => 
            removeAccents(r.standardName.toLowerCase()).includes(term) || 
            removeAccents(r.requestedByName.toLowerCase()).includes(term) ||
            (r.lotNumber && removeAccents(r.lotNumber.toLowerCase()).includes(term))
        );
    }
    
    return reqs.map(r => ({
        ...r,
        standardDetails: stdsMap.get(r.standardId)
    }));
  });

  ngOnInit() {
    this.unsubRequests = this.stdService.listenToRequests((reqs) => {
        this.requests.set(reqs);
        this.isLoading.set(false);
    });
    
    // Listen to all standards for the dropdown and details mapping
    this.unsubStandards = this.stdService.listenToAllStandards((stds: ReferenceStandard[]) => {
        this.allStandards.set(stds);
        // Only show standards that are available for new requests
        this.availableStandards.set(stds.filter(s => s.status !== 'IN_USE' && s.status !== 'DEPLETED' && s.current_amount > 0));
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
                  totalAmountUsed: 0,
                  expectedReturnDate: expectedReturnDate
              };
              
              await this.stdService.createRequest(req);
          }
          
          this.toast.show(`Đã gửi ${selectedIds.length} yêu cầu thành công`, 'success');
          this.closeModal();
      } catch (e: any) {
          this.toast.show('Lỗi: ' + e.message, 'error');
      } finally {
          this.isProcessing.set(false);
      }
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
          }

          // Dispense
          await this.stdService.dispenseStandard(req.id, req.standardId, user.uid, user.displayName || user.email || 'Unknown');
          
          // If purpose or date changed, update it too
          if (this.approvePurpose() !== req.purpose || updatedExpectedDate !== req.expectedReturnDate || this.approveExpectedAmount() !== req.expectedAmount) {
              await this.stdService.updateRequestStatus(req.id, 'IN_PROGRESS', {
                  purpose: this.approvePurpose(),
                  expectedReturnDate: updatedExpectedDate,
                  expectedAmount: this.approveExpectedAmount() || undefined
              });
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
          case 'PENDING_DEPLETION': return 'Chờ hủy';
          case 'COMPLETED': return 'Hoàn thành';
          case 'REJECTED': return 'Từ chối';
          default: return status;
      }
  }

  getStatusClass(status: StandardRequestStatus): string {
      switch(status) {
          case 'PENDING_APPROVAL': return 'bg-amber-50 text-amber-600 border-amber-200';
          case 'IN_PROGRESS': return 'bg-blue-50 text-blue-600 border-blue-200';
          case 'PENDING_RETURN': return 'bg-purple-50 text-purple-600 border-purple-200';
          case 'PENDING_DEPLETION': return 'bg-orange-50 text-orange-600 border-orange-200';
          case 'COMPLETED': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
          case 'REJECTED': return 'bg-red-50 text-red-600 border-red-200';
          default: return 'bg-slate-50 text-slate-600 border-slate-200';
      }
  }
}
