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

      <!-- REQUEST MODAL -->
      @if (showModal()) {
         <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm fade-in">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
                
                <div class="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
                    <h3 class="font-black text-slate-800 text-lg flex items-center gap-2">
                        <i class="fa-solid fa-clipboard-list text-indigo-600"></i>
                        Tạo Yêu cầu Chuẩn
                    </h3>
                    <button (click)="closeModal()" class="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 transition active:scale-95"><i class="fa-solid fa-times"></i></button>
                </div>

                <div class="flex-1 overflow-y-auto p-6 custom-scrollbar bg-white dark:bg-slate-900">
                    <form [formGroup]="form" class="space-y-4">
                        <div>
                            <label class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1">Chọn Chuẩn (Có thể chọn nhiều) <span class="text-red-500">*</span></label>
                            
                            <!-- Search Input -->
                            <div class="relative mb-2">
                                <i class="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                                <input type="text" [ngModel]="standardSearchTerm()" (ngModelChange)="standardSearchTerm.set($event)" [ngModelOptions]="{standalone: true}" placeholder="Tìm theo tên, lot, cas, mã..." class="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500">
                            </div>

                            <!-- Selected Count -->
                            @if(selectedStandardIds().size > 0) {
                                <div class="mb-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                                    Đã chọn: {{selectedStandardIds().size}} chuẩn
                                </div>
                            }

                            <!-- Standards List -->
                            <div class="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden max-h-60 overflow-y-auto custom-scrollbar">
                                @for(std of filteredAvailableStandards(); track std.id) {
                                    <div class="p-3 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer flex items-start gap-3" (click)="toggleStandardSelection(std.id)">
                                        <input type="checkbox" [checked]="selectedStandardIds().has(std.id)" class="mt-1 w-4 h-4 accent-indigo-600">
                                        <div class="flex-1 min-w-0">
                                            <div class="font-bold text-sm text-slate-800 dark:text-slate-200 truncate">{{std.name}}</div>
                                            <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex flex-wrap gap-x-3 gap-y-1">
                                                @if(std.internal_id) {
                                                    <span title="Mã nội bộ"><i class="fa-solid fa-barcode w-3"></i> {{std.internal_id}}</span>
                                                }
                                                <span title="Lot Number"><i class="fa-solid fa-hashtag w-3"></i> {{std.lot_number || 'N/A'}}</span>
                                                <span title="CAS"><i class="fa-solid fa-flask w-3"></i> {{std.cas_number || 'N/A'}}</span>
                                                @if(std.manufacturer) {
                                                    <span title="Hãng sản xuất"><i class="fa-solid fa-industry w-3"></i> {{std.manufacturer}}</span>
                                                }
                                                @if(std.expiry_date) {
                                                    <span title="Hạn sử dụng" [class.text-red-500]="isExpired(std.expiry_date)"><i class="fa-regular fa-calendar-xmark w-3"></i> {{std.expiry_date | date:'dd/MM/yyyy'}}</span>
                                                }
                                                <span title="Tồn kho" class="font-bold text-indigo-600 dark:text-indigo-400"><i class="fa-solid fa-box w-3"></i> {{std.current_amount}} {{std.unit}}</span>
                                                @if(std.location) {
                                                    <span title="Vị trí"><i class="fa-solid fa-location-dot w-3"></i> {{std.location}}</span>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                }
                                @if(filteredAvailableStandards().length === 0) {
                                    <div class="p-4 text-center text-sm text-slate-500 italic">
                                        @if(!standardSearchTerm()) {
                                            Vui lòng nhập từ khóa để tìm kiếm chuẩn.
                                        } @else {
                                            Không tìm thấy chuẩn phù hợp.
                                        }
                                    </div>
                                }
                            </div>
                        </div>
                        
                        <div>
                            <label class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1">Mục đích sử dụng</label>
                            <textarea formControlName="purpose" rows="2" class="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="VD: Pha chuẩn mới (Mặc định nếu để trống)"></textarea>
                        </div>
                        
                        <div>
                            <label class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1">Ngày dự kiến trả (Không bắt buộc)</label>
                            <input type="date" formControlName="expectedReturnDate" class="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500">
                        </div>
                    </form>
                </div>

                <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3 shrink-0">
                    <button (click)="closeModal()" class="px-5 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-bold text-sm transition">Hủy bỏ</button>
                    <button (click)="submitRequest()" [disabled]="selectedStandardIds().size === 0 || isProcessing()" class="px-6 py-2.5 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-md dark:shadow-none transition disabled:opacity-50">
                        @if(isProcessing()) { <i class="fa-solid fa-spinner fa-spin"></i> Đang gửi... } 
                        @else { Gửi Yêu cầu }
                    </button>
                </div>
            </div>
         </div>
      }

      <!-- REJECT MODAL -->
      @if (showRejectModal()) {
         <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm fade-in">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
                
                <div class="px-6 py-4 border-b border-slate-100 bg-red-50 flex justify-between items-center shrink-0">
                    <h3 class="font-black text-red-600 text-lg flex items-center gap-2">
                        <i class="fa-solid fa-ban"></i>
                        Từ chối Yêu cầu
                    </h3>
                    <button (click)="closeRejectModal()" class="w-8 h-8 rounded-full bg-white border border-red-200 flex items-center justify-center text-red-400 hover:text-red-600 transition active:scale-95"><i class="fa-solid fa-times"></i></button>
                </div>

                <div class="flex-1 overflow-y-auto p-6 custom-scrollbar bg-white dark:bg-slate-900">
                    <div class="space-y-4">
                        <p class="text-sm text-slate-600 dark:text-slate-400">Bạn đang từ chối yêu cầu chuẩn <strong>{{selectedRequest()?.standardName}}</strong> của <strong>{{selectedRequest()?.requestedByName}}</strong>.</p>
                        <div>
                            <label class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1">Lý do từ chối <span class="text-red-500">*</span></label>
                            <textarea [ngModel]="rejectReason()" (ngModelChange)="rejectReason.set($event)" rows="3" class="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-red-500" placeholder="Nhập lý do..."></textarea>
                        </div>
                    </div>
                </div>

                <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3 shrink-0">
                    <button (click)="closeRejectModal()" class="px-5 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-bold text-sm transition">Hủy</button>
                    <button (click)="confirmReject()" [disabled]="!rejectReason().trim() || isProcessing()" class="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm shadow-md transition disabled:opacity-50">
                        @if(isProcessing()) { <i class="fa-solid fa-spinner fa-spin"></i> Đang xử lý... } 
                        @else { Xác nhận Từ chối }
                    </button>
                </div>
            </div>
         </div>
      }

      <!-- RETURN MODAL -->
      @if (showReturnModal()) {
         <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm fade-in">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
                
                <div class="px-6 py-4 border-b border-slate-100 bg-indigo-50 flex justify-between items-center shrink-0">
                    <h3 class="font-black text-indigo-600 text-lg flex items-center gap-2">
                        <i class="fa-solid fa-undo"></i>
                        {{ isForceReturn() ? 'Thu hồi trực tiếp' : 'Báo cáo trả chuẩn' }}
                    </h3>
                    <button (click)="closeReturnModal()" class="w-8 h-8 rounded-full bg-white border border-indigo-200 flex items-center justify-center text-indigo-400 hover:text-indigo-600 transition active:scale-95"><i class="fa-solid fa-times"></i></button>
                </div>

                <div class="flex-1 overflow-y-auto p-6 custom-scrollbar bg-white dark:bg-slate-900">
                    <div class="space-y-5">
                        <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                            <h4 class="font-bold text-slate-800 dark:text-slate-200 text-base mb-2">{{returnRequest()?.standardName}}</h4>
                            <div class="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <span class="text-slate-500 dark:text-slate-400 block text-xs">Số lô (Lot)</span>
                                    <span class="font-medium text-slate-700 dark:text-slate-300">{{currentStandard()?.lot_number || returnRequest()?.standardDetails?.lot_number || 'N/A'}}</span>
                                </div>
                                <div>
                                    <span class="text-slate-500 dark:text-slate-400 block text-xs">Lượng tồn hiện tại</span>
                                    <span class="font-bold text-indigo-600 dark:text-indigo-400">{{currentStandard()?.current_amount || returnRequest()?.standardDetails?.current_amount || 0}} {{currentStandard()?.unit || returnRequest()?.standardDetails?.unit || 'mg'}}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1">Lượng đã sử dụng <span class="text-red-500">*</span></label>
                            <div class="relative">
                                <input type="number" min="0" step="any" [ngModel]="returnAmount()" (ngModelChange)="returnAmount.set($event)" class="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 pr-12" placeholder="Nhập số lượng..."
                                [class.border-red-500]="returnAmount() !== null && returnAmount()! > (currentStandard()?.current_amount || returnRequest()?.standardDetails?.current_amount || 0)">
                                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <span class="text-slate-500 dark:text-slate-400 text-sm font-bold">{{ currentStandard()?.unit || returnRequest()?.standardDetails?.unit || 'mg' }}</span>
                                </div>
                            </div>
                            @if(returnAmount() !== null && returnAmount()! > (currentStandard()?.current_amount || returnRequest()?.standardDetails?.current_amount || 0)) {
                                <p class="text-xs text-red-500 mt-1 font-medium"><i class="fa-solid fa-triangle-exclamation"></i> Lượng sử dụng không được lớn hơn lượng tồn kho hiện tại.</p>
                            } @else {
                                <p class="text-xs text-slate-500 mt-2 italic">Hệ thống sẽ tự động trừ lượng tồn kho của chuẩn này.</p>
                            }
                        </div>
                        
                        <div class="flex items-center gap-2 mt-4 bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-100 dark:border-orange-800/30">
                            <input type="checkbox" id="isDepleted" [ngModel]="returnIsDepleted()" (ngModelChange)="returnIsDepleted.set($event)" class="w-4 h-4 text-orange-600 bg-white border-orange-300 rounded focus:ring-orange-500">
                            <label for="isDepleted" class="text-sm font-bold text-orange-800 dark:text-orange-400 cursor-pointer">Đánh dấu chuẩn đã hết (Depleted)</label>
                        </div>
                    </div>
                </div>

                <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3 shrink-0">
                    <button (click)="closeReturnModal()" class="px-5 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-bold text-sm transition">Hủy</button>
                    <button (click)="confirmReturn()" [disabled]="returnAmount() === null || returnAmount()! < 0 || returnAmount()! > (currentStandard()?.current_amount || returnRequest()?.standardDetails?.current_amount || 0) || isProcessing()" class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md transition disabled:opacity-50">
                        @if(isProcessing()) { <i class="fa-solid fa-spinner fa-spin"></i> Đang xử lý... } 
                        @else { Xác nhận }
                    </button>
                </div>
            </div>
         </div>
      }

      <!-- LOG USAGE MODAL -->
      @if (showLogUsageModal()) {
         <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm fade-in">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
                
                <div class="px-6 py-4 border-b border-slate-100 bg-teal-50 flex justify-between items-center shrink-0">
                    <h3 class="font-black text-teal-600 text-lg flex items-center gap-2">
                        <i class="fa-solid fa-pen-to-square"></i>
                        Ghi nhận lượng dùng
                    </h3>
                    <button (click)="closeLogUsageModal()" class="w-8 h-8 rounded-full bg-white border border-teal-200 flex items-center justify-center text-teal-400 hover:text-teal-600 transition active:scale-95"><i class="fa-solid fa-times"></i></button>
                </div>

                <div class="flex-1 overflow-y-auto p-6 custom-scrollbar bg-white dark:bg-slate-900">
                    <div class="space-y-5">
                        <p class="text-sm text-slate-600 dark:text-slate-400">Bạn đang ghi nhận lưu lượng chuẩn <strong>{{selectedRequest()?.standardName}}</strong> đã sử dụng cho đợt pha này.</p>
                        
                        <div>
                            <label class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1">Lượng đã sử dụng đợt này <span class="text-red-500">*</span></label>
                            <div class="relative">
                                <input type="number" min="0" step="any" [ngModel]="logUsageAmount()" (ngModelChange)="logUsageAmount.set($event)" class="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-teal-500 pr-12" placeholder="Nhập số lượng...">
                                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <span class="text-slate-500 dark:text-slate-400 text-sm font-bold">{{ selectedRequest()?.standardDetails?.unit || 'mg' }}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1">Mục đích phụ (Tùy chọn)</label>
                            <textarea [ngModel]="logUsagePurpose()" (ngModelChange)="logUsagePurpose.set($event)" rows="2" class="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-teal-500" placeholder="VD: Dùng cho mẫu ABC..."></textarea>
                        </div>
                    </div>
                </div>

                <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3 shrink-0">
                    <button (click)="closeLogUsageModal()" class="px-5 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-bold text-sm transition">Hủy</button>
                    <button (click)="confirmLogUsage()" [disabled]="logUsageAmount() === null || logUsageAmount()! <= 0 || isProcessing()" class="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-sm shadow-md transition disabled:opacity-50">
                        @if(isProcessing()) { <i class="fa-solid fa-spinner fa-spin"></i> Đang xử lý... } 
                        @else { Ghi nhận }
                    </button>
                </div>
            </div>
         </div>
      }
      <!-- ADMIN RECEIVE RETURN MODAL -->
      @if (showAdminReceiveModal()) {
         <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm fade-in">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
                
                <div class="px-6 py-4 border-b border-slate-100 bg-indigo-50 flex justify-between items-center shrink-0">
                    <h3 class="font-black text-indigo-700 text-lg flex items-center gap-2">
                        <i class="fa-solid fa-check-to-slot"></i>
                        Xác nhận tiếp nhận chuẩn
                    </h3>
                    <button (click)="closeAdminReceiveModal()" class="w-8 h-8 rounded-full bg-white border border-indigo-200 flex items-center justify-center text-indigo-400 hover:text-indigo-600 transition active:scale-95"><i class="fa-solid fa-times"></i></button>
                </div>

                <div class="flex-1 overflow-y-auto p-6 custom-scrollbar bg-white dark:bg-slate-900">
                    <div class="space-y-5">
                        <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                            <h4 class="font-bold text-slate-800 dark:text-slate-200 text-base mb-2">{{adminReceiveRequest()?.standardName}}</h4>
                            <div class="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <span class="text-slate-500 dark:text-slate-400 block text-xs">Người mượn báo cáo đã dùng</span>
                                    <span class="font-bold text-indigo-600 dark:text-indigo-400">{{adminReceiveRequest()?.totalAmountUsed || 0}} {{adminReceiveRequest()?.standardDetails?.unit || 'mg'}}</span>
                                </div>
                                <div>
                                    <span class="text-slate-500 dark:text-slate-400 block text-xs">Báo cáo tình trạng</span>
                                    @if(adminReceiveRequest()?.reportedDepleted) {
                                        <span class="font-bold text-orange-600">Đã hết chuẩn</span>
                                    } @else {
                                        <span class="font-bold text-emerald-600">Vẫn còn sử dụng được</span>
                                    }
                                </div>
                            </div>
                        </div>

                        <div>
                            <label class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1">Khối lượng thực tế trừ kho <span class="text-red-500">*</span></label>
                            <div class="relative">
                                <input type="number" min="0" step="any" [ngModel]="adminReceiveAmount()" (ngModelChange)="adminReceiveAmount.set($event)" class="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 pr-12" placeholder="Nhập số lượng thực tế...">
                                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <span class="text-slate-500 dark:text-slate-400 text-sm font-bold">{{ adminReceiveRequest()?.standardDetails?.unit || 'mg' }}</span>
                                </div>
                            </div>
                            <p class="text-[11px] text-slate-500 mt-1 italic">Bạn có thể điều chỉnh lại con số này nếu kiểm tra khối lượng thực tế khác với báo cáo.</p>
                        </div>
                        
                        <div class="flex items-center gap-2 mt-4 bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-100 dark:border-orange-800/30">
                            <input type="checkbox" id="adminIsDepleted" [ngModel]="adminReceiveIsDepleted()" (ngModelChange)="adminReceiveIsDepleted.set($event)" class="w-4 h-4 text-orange-600 bg-white border-orange-300 rounded focus:ring-orange-500">
                            <label for="adminIsDepleted" class="text-sm font-bold text-orange-800 dark:text-orange-400 cursor-pointer">Xác nhận chuẩn ĐÃ HẾT (Depleted)</label>
                        </div>

                        @if(adminReceiveIsDepleted()) {
                            <div class="fade-in">
                                <label class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1">Lý do hủy chuẩn <span class="text-red-500">*</span></label>
                                <textarea [ngModel]="adminReceiveDisposalReason()" (ngModelChange)="adminReceiveDisposalReason.set($event)" rows="2" class="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-orange-500" placeholder="Biên bản hủy, lý do..."></textarea>
                            </div>
                        }
                    </div>
                </div>

                <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3 shrink-0">
                    <button (click)="closeAdminReceiveModal()" class="px-5 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-bold text-sm transition">Hủy</button>
                    <button (click)="confirmAdminReceive()" [disabled]="adminReceiveAmount() === null || adminReceiveAmount()! < 0 || isProcessing()" class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md transition disabled:opacity-50">
                        @if(isProcessing()) { <i class="fa-solid fa-spinner fa-spin"></i> Đang xử lý... } 
                        @else { Hoàn tất tiếp nhận }
                    </button>
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
  rejectReason = signal('');
  selectedRequest = signal<StandardRequest | null>(null);
  
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
      const user = this.auth.currentUser();
      if (!user) return;

      if (await this.confirmationService.confirm({ message: `Duyệt và giao chuẩn ${req.standardName} cho ${req.requestedByName}?`, confirmText: 'Duyệt & Giao' })) {
          this.isProcessing.set(true);
          try {
              await this.stdService.dispenseStandard(req.id, req.standardId, user.uid, user.displayName || user.email || 'Unknown');
              this.toast.show('Đã duyệt và giao chuẩn', 'success');
          } catch (e: any) {
              this.toast.show('Lỗi: ' + e.message, 'error');
          } finally {
              this.isProcessing.set(false);
          }
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
