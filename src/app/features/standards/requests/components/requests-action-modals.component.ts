import { Component, Input, Output, EventEmitter, signal, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StandardRequest, ReferenceStandard } from '../../../../core/models/standard.model';
import { AppButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { AppModalShellComponent } from '../../../../shared/components/ui/modal-shell/modal-shell.component';
import { formatNum } from '../../../../shared/utils/utils';
import { StandardTagCatalogService } from '../../services/standard-tag-catalog.service';
import { MAX_RETURN_TAGS, formatMethodOptionLabel, sanitizeLegacyTagKeys } from '../../services/standard-tag.utils';

export type ActionModalMode = 'approve' | 'reject' | 'return' | 'logUsage' | 'adminReceive' | null;

@Component({
  selector: 'app-requests-action-modals',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, AppButtonComponent, AppModalShellComponent],
  template: `
    <!-- APPROVE MODAL -->
    @if (activeModal === 'approve' && request) {
      <app-modal-shell
        title="Duyệt & giao chuẩn"
        description="Kiểm tra thông tin chuẩn và xác nhận mục đích bàn giao."
        size="lg"
        (closed)="onClose()"
      >
        <div modalBody class="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <section class="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/50">
            <div class="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-xl text-emerald-600 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-emerald-400">
              <i class="fa-solid fa-vial" aria-hidden="true"></i>
            </div>
            <h3 class="mb-1 line-clamp-2 text-lg font-black leading-tight text-slate-800 dark:text-slate-100">{{request.standardName}}</h3>
            <div class="mb-5 text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Thông tin chuẩn bàn giao</div>

            <div class="space-y-4">
              <div class="flex flex-col">
                <span class="text-xs font-bold uppercase text-slate-400">Số lô / Lot</span>
                <span class="text-base font-bold text-slate-700 dark:text-slate-200">{{request.lotNumber || 'N/A'}}</span>
              </div>
              @if(request.standardDetails?.expiry_date) {
                <div class="flex flex-col">
                  <span class="text-xs font-bold uppercase text-slate-400">Hạn dùng</span>
                  <span class="text-base font-bold text-slate-700 dark:text-slate-200">{{request.standardDetails?.expiry_date | date:'dd/MM/yyyy'}}</span>
                </div>
              }
              <div class="flex flex-col">
                <span class="text-xs font-bold uppercase text-slate-400">Tồn kho hiện tại</span>
                <span class="text-base font-bold text-emerald-600">{{formatNum(request.standardDetails?.current_amount ?? 0)}} {{request.standardDetails?.unit}}</span>
              </div>
              @if(request.standardDetails?.internal_id) {
                <div class="flex flex-col">
                  <span class="text-xs font-bold uppercase text-slate-400">Mã quản lý</span>
                  <span class="text-lg font-black uppercase tracking-wide text-indigo-600 dark:text-indigo-400">{{request.standardDetails?.internal_id}}</span>
                </div>
              }
            </div>

            <div class="mt-6 border-t border-slate-200 pt-5 dark:border-slate-700">
              <div class="rounded-xl border border-blue-100 bg-blue-50 p-3 dark:border-blue-800/30 dark:bg-blue-900/20">
                <p class="text-xs font-medium leading-relaxed text-blue-700 dark:text-blue-400">
                  <i class="fa-solid fa-user-check mr-1" aria-hidden="true"></i>
                  Người mượn: <strong>{{request.requestedByName}}</strong>
                </p>
              </div>
            </div>
          </section>

          <section class="space-y-5">
            <div>
              <label class="mb-2 block text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Lượng dự kiến dùng</label>
              <div class="relative">
                <input type="number" min="0" step="any" [ngModel]="approveExpectedAmount()" (ngModelChange)="approveExpectedAmount.set($event)" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-bold text-slate-700 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200" placeholder="VD: 5">
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">{{request.standardDetails?.unit}}</span>
              </div>
            </div>

            <div>
              <label class="mb-2 block text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Mục đích sử dụng <span class="text-red-500">*</span></label>
              <textarea [ngModel]="approvePurpose()" (ngModelChange)="approvePurpose.set($event)" rows="4" class="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-bold text-slate-700 outline-none transition-all placeholder-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200" placeholder="Nhập mục đích bàn giao..."></textarea>
            </div>
          </section>
        </div>

        <div modalFooter class="flex flex-wrap justify-end gap-3">
          <app-button variant="secondary" (click)="onClose()">Hủy bỏ</app-button>
          <app-button (click)="onApprove()" [disabled]="!approvePurpose() || isProcessing" [loading]="isProcessing">
            @if(!isProcessing) { <i class="fa-solid fa-check-circle text-sm" aria-hidden="true"></i> }
            Xác nhận & giao
          </app-button>
        </div>
      </app-modal-shell>
    }

    <!-- REJECT MODAL -->
    @if (activeModal === 'reject' && request) {
      <app-modal-shell
        title="Từ chối yêu cầu"
        description="Yêu cầu lý do trước khi từ chối để người gửi có thể theo dõi."
        size="sm"
        (closed)="onClose()"
      >
        <div modalBody class="space-y-5">
          <p class="text-base font-medium text-slate-600 dark:text-slate-300">
            Bạn đang từ chối yêu cầu của <strong>{{request.requestedByName}}</strong> cho chuẩn <strong>{{request.standardName}}</strong>.
          </p>
          <div>
            <label class="mb-2 block text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Lý do từ chối <span class="text-red-500">*</span></label>
            <textarea [ngModel]="rejectReason()" (ngModelChange)="rejectReason.set($event)" rows="3" class="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-bold text-slate-700 outline-none transition-all focus:border-red-500 focus:ring-4 focus:ring-red-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200" placeholder="Nhập lý do cụ thể..."></textarea>
          </div>
        </div>

        <div modalFooter class="flex flex-wrap justify-end gap-3">
          <app-button variant="secondary" (click)="onClose()">Hủy</app-button>
          <app-button variant="danger" (click)="onReject()" [disabled]="!rejectReason().toString().trim() || isProcessing" [loading]="isProcessing">
            Xác nhận từ chối
          </app-button>
        </div>
      </app-modal-shell>
    }

    <!-- RETURN MODAL -->
    @if (activeModal === 'return' && request) {
      <app-modal-shell
        [title]="isForceReturn ? 'Thu hồi chuẩn' : 'Hoàn trả chuẩn'"
        description="Đối chiếu lượng đã dùng và thông tin phương pháp trước khi xác nhận trả."
        size="md"
        (closed)="onClose()"
      >
        <div modalBody class="space-y-6">
                  <div class="bg-indigo-50/50 dark:bg-indigo-900/10 p-4 rounded-2xl border border-indigo-100/50 dark:border-indigo-800/30">
                      <h4 class="font-black text-slate-800 dark:text-slate-100 leading-tight mb-2">{{request.standardName}}</h4>
                      <div class="flex justify-between items-center">
                          <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Tồn kho hiện tại</span>
                          <span class="font-black text-indigo-600">{{formatNum(standard?.current_amount || request.standardDetails?.current_amount || 0)}} {{standard?.unit || request.standardDetails?.unit || 'mg'}}</span>
                      </div>
                  </div>

                  @if ((request.totalAmountUsed || 0) > 0) {
                      <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-200 dark:border-blue-800/40 space-y-2">
                          <div class="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-black text-base">
                              <i class="fa-solid fa-circle-info"></i>
                              Tổng đã ghi nhận: <span class="text-blue-800 dark:text-blue-200">{{request.totalAmountUsed || 0}} {{standard?.unit || request.standardDetails?.unit || 'mg'}}</span>
                          </div>
                          @if (isForceReturn) {
                              <p class="text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-xl border border-amber-200 dark:border-amber-800/40">
                                  <i class="fa-solid fa-triangle-exclamation mr-1"></i>
                                  Kho đã được trừ theo từng đợt. Nếu số xác nhận lớn hơn tổng đã ghi, phần chênh lệch sẽ được trừ kho và tạo nhật ký điều chỉnh.
                              </p>
                          } @else {
                              <p class="text-sm text-blue-600 dark:text-blue-400">
                                  Kho đã được trừ theo từng đợt. Số báo cáo bên dưới chỉ để admin xác nhận.
                              </p>
                          }
                      </div>

                      <div>
                          <label class="block text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Số lượng báo cáo (ghi sổ)</label>
                          <div class="relative">
                              <input type="number" [min]="minimumLoggedAmount()" step="any" [ngModel]="returnAmount()" (ngModelChange)="returnAmount.set($event)" class="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-base font-bold text-slate-700 dark:text-slate-200 focus:border-indigo-500 outline-none pr-12" placeholder="Số lượng...">
                              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">{{standard?.unit || request.standardDetails?.unit || 'mg'}}</span>
                          </div>
                      </div>
                  } @else {
                      <div>
                          <label class="block text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Lượng thực tế đã dùng <span class="text-red-500">*</span></label>
                          <div class="relative">
                              <input type="number" min="0" step="any" [ngModel]="returnAmount()" (ngModelChange)="returnAmount.set($event)" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-base font-bold text-slate-700 dark:text-slate-200 focus:border-indigo-500 outline-none pr-12" placeholder="Nhập số lượng...">
                              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">{{standard?.unit || request.standardDetails?.unit || 'mg'}}</span>
                          </div>
                          @if (returnAmount() !== null && returnAmount()! > (standard?.current_amount || request.standardDetails?.current_amount || 0)) {
                              <p class="text-red-500 text-xs font-bold mt-2 flex items-center gap-1"><i class="fa-solid fa-triangle-exclamation"></i> Vượt quá tồn kho hiện hành ({{formatNum(standard?.current_amount || request.standardDetails?.current_amount || 0)}})</p>
                          }
                      </div>
                  }
                  
                  <div class="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-800/20">
                      <input type="checkbox" id="isDepleted" [ngModel]="returnIsDepleted()" (ngModelChange)="returnIsDepleted.set($event)" class="w-5 h-5 accent-amber-600 rounded-lg">
                      <label for="isDepleted" class="text-sm font-bold text-amber-700 dark:amber-400 cursor-pointer">Đánh dấu chuẩn đã dùng hết (Depleted)</label>
                  </div>

                  <div class="space-y-2 rounded-2xl border border-indigo-100 dark:border-indigo-800/30 bg-indigo-50/40 dark:bg-indigo-900/10 p-4">
                      <div class="flex items-center justify-between">
                           <label class="text-sm font-black text-indigo-700 dark:text-indigo-300">Nhãn phương pháp thử <span class="font-medium text-indigo-500">(chọn nhiều, {{returnSopTags().length}}/{{maxReturnTags}})</span></label>
                          <button type="button" (click)="returnSopTags.set([])" class="text-xs font-bold text-slate-500 hover:text-red-600">Xóa nhãn</button>
                      </div>
                       <p class="text-[11px] text-indigo-600/80 dark:text-indigo-300/80">Một báo cáo có thể gắn nhiều phương pháp hóa học cùng lúc.</p>
                       <div class="flex gap-2">
                          <select [ngModel]="returnTagToAdd()" (ngModelChange)="returnTagToAdd.set($event)" class="min-w-0 flex-1 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-bold">
                              <option value="">Chọn nhãn trong danh mục...</option>
                               @for (option of tagOptions(); track option.key) { <option [value]="option.key">{{formatTagLabel(option)}}</option> }
                          </select>
                          <button type="button" (click)="addReturnTag()" [disabled]="!returnTagToAdd() || returnSopTags().length >= maxReturnTags" class="rounded-xl bg-indigo-600 px-3 py-2 text-white font-bold disabled:opacity-40">Thêm</button>
                      </div>
                      <div class="flex flex-wrap gap-1.5">
                          @for (key of returnSopTags(); track key) {
                               <span class="inline-flex items-center gap-1 rounded-full bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-700 px-2.5 py-1 text-xs font-bold text-indigo-700 dark:text-indigo-300" [title]="formatTagLabel(tagCatalog.resolveTag(key))">{{formatTagLabel(tagCatalog.resolveTag(key))}}<button type="button" (click)="removeReturnTag(key)" class="text-indigo-400 hover:text-red-500">×</button></span>
                          }
                      </div>
                  </div>
        </div>

        <div modalFooter class="flex flex-wrap justify-end gap-3">
          <app-button variant="secondary" (click)="onClose()">Hủy</app-button>
          <app-button (click)="onReturn()" [disabled]="returnAmount() === null || returnAmount()! < minimumLoggedAmount() || isProcessing" [loading]="isProcessing">
            Xác nhận trả
          </app-button>
        </div>
      </app-modal-shell>
    }

    <!-- LOG USAGE MODAL -->
    @if (activeModal === 'logUsage' && request) {
      <app-modal-shell
        title="Ghi nhận đợt dùng"
        description="Ghi lượng sử dụng của đợt hiện tại và cập nhật nhật ký chuẩn."
        size="sm"
        (closed)="onClose()"
      >
        <div modalBody class="space-y-6">
                  <div>
                      <label class="block text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Khối lượng đợt này <span class="text-red-500">*</span></label>
                      <div class="relative">
                          <input type="number" min="0" step="any" [ngModel]="logUsageAmount()" (ngModelChange)="logUsageAmount.set($event)" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-base font-bold text-slate-700 dark:text-slate-200 focus:border-teal-500 outline-none pr-12" placeholder="VD: 5.25">
                          <span class="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">{{request.standardDetails?.unit}}</span>
                      </div>
                      @if (logUsageAmount() !== null && logUsageAmount()! > (standard?.current_amount || request.standardDetails?.current_amount || 0)) {
                          <p class="text-red-500 text-xs font-bold mt-2 flex items-center gap-1"><i class="fa-solid fa-triangle-exclamation"></i> Vượt quá tồn kho hiện hành ({{formatNum(standard?.current_amount || request.standardDetails?.current_amount || 0)}})</p>
                      }
                  </div>

                  <div>
                      <label class="block text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Ghi chú đợt dùng</label>
                      <textarea [ngModel]="logUsagePurpose()" (ngModelChange)="logUsagePurpose.set($event)" rows="2" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-base font-bold text-slate-700 dark:text-slate-200 focus:border-teal-500 transition-all outline-none resize-none" placeholder="VD: Dùng cho mẫu phân tích lô X..."></textarea>
                  </div>
        </div>

        <div modalFooter class="flex flex-wrap justify-end gap-3">
          <app-button variant="secondary" (click)="onClose()">Hủy</app-button>
          <app-button (click)="onLogUsage()" [disabled]="logUsageAmount() === null || logUsageAmount()! <= 0 || isProcessing || (logUsageAmount()! > (standard?.current_amount || request.standardDetails?.current_amount || 0))" [loading]="isProcessing">
            Lưu nhật ký dùng
          </app-button>
        </div>
      </app-modal-shell>
    }

    <!-- ADMIN RECEIVE RETURN MODAL -->
    @if (activeModal === 'adminReceive' && request) {
      <app-modal-shell
        title="Xác nhận nhập kho trả"
        description="Đối chiếu lượng thực tế, trạng thái chuẩn và phương pháp trước khi hoàn tất tiếp nhận."
        size="md"
        (closed)="onClose()"
      >
        <div modalBody class="space-y-6">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-inner">
                      <div class="flex flex-col">
                          <span class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">NV báo cáo dùng</span>
                          <span class="text-xl font-black text-indigo-600">{{request.totalAmountUsed}} {{request.standardDetails?.unit}}</span>
                      </div>
                      <div class="flex flex-col">
                          <span class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Trạng thái</span>
                          <span class="text-base font-bold" [class]="request.reportedDepleted ? 'text-red-500' : 'text-emerald-500'">
                              {{ request.reportedDepleted ? 'Báo cáo đã hết' : 'Vẫn còn chuẩn' }}
                          </span>
                      </div>
                  </div>

                  <div>
                      <label class="block text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Lượng thực tế trừ kho <span class="text-red-500">*</span></label>
                      <div class="relative">
                          <input type="number" [min]="minimumLoggedAmount()" step="any" [ngModel]="adminReceiveAmount()" (ngModelChange)="adminReceiveAmount.set($event)" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-base font-bold text-slate-700 dark:text-slate-200 focus:border-indigo-500 outline-none pr-12" placeholder="Xác nhận số lượng thực tế...">
                          <span class="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">{{request.standardDetails?.unit}}</span>
                      </div>
                  </div>
                  
                  <div class="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-800/20">
                      <input type="checkbox" id="adminIsDepleted" [ngModel]="adminReceiveIsDepleted()" (ngModelChange)="adminReceiveIsDepleted.set($event)" class="w-5 h-5 accent-amber-600 rounded-lg">
                      <label for="adminIsDepleted" class="text-sm font-bold text-amber-700 dark:amber-400 cursor-pointer">Xác nhận chuẩn đã dùng hết (Hủy chuẩn)</label>
                  </div>

                  @if(adminReceiveIsDepleted()) {
                      <div class="fade-in">
                          <label class="block text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Lý do hủy chuẩn <span class="text-red-500">*</span></label>
                          <textarea [ngModel]="adminReceiveDisposalReason()" (ngModelChange)="adminReceiveDisposalReason.set($event)" rows="2" class="w-full bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/30 rounded-2xl text-base font-bold text-slate-700 dark:text-slate-200 focus:border-red-500 outline-none resize-none" placeholder="Nhập lý do như: Hết hạn, hỏng, hoặc dùng hết..."></textarea>
                      </div>
                  }

                  <div class="space-y-2 rounded-2xl border border-indigo-100 dark:border-indigo-800/30 bg-indigo-50/40 dark:bg-indigo-900/10 p-4">
                      <div class="flex items-center justify-between">
                           <label class="text-sm font-black text-indigo-700 dark:text-indigo-300">Phương pháp quyết định cuối của Admin <span class="font-medium text-indigo-500">(chọn nhiều, {{adminFinalSopTags().length}}/{{maxReturnTags}})</span></label>
                          <button type="button" (click)="adminFinalSopTags.set([])" class="text-xs font-bold text-slate-500 hover:text-red-600">Xóa nhãn</button>
                      </div>
                       <p class="text-[11px] text-indigo-600/80 dark:text-indigo-300/80">Có thể xác nhận nhiều phương pháp áp dụng cho cùng một chuẩn.</p>
                       <div class="flex gap-2">
                          <select [ngModel]="adminTagToAdd()" (ngModelChange)="adminTagToAdd.set($event)" class="min-w-0 flex-1 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-bold">
                              <option value="">Chọn nhãn trong danh mục...</option>
                               @for (option of tagOptions(); track option.key) { <option [value]="option.key">{{formatTagLabel(option)}}</option> }
                          </select>
                          <button type="button" (click)="addAdminTag()" [disabled]="!adminTagToAdd() || adminFinalSopTags().length >= maxReturnTags" class="rounded-xl bg-indigo-600 px-3 py-2 text-white font-bold disabled:opacity-40">Thêm</button>
                      </div>
                      <div class="flex flex-wrap gap-1.5">
                          @for (key of adminFinalSopTags(); track key) {
                               <span class="inline-flex items-center gap-1 rounded-full bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-700 px-2.5 py-1 text-xs font-bold text-indigo-700 dark:text-indigo-300" [title]="formatTagLabel(tagCatalog.resolveTag(key))">{{formatTagLabel(tagCatalog.resolveTag(key))}}<button type="button" (click)="removeAdminTag(key)" class="text-indigo-400 hover:text-red-500">×</button></span>
                          }
                      </div>
                  </div>
        </div>

        <div modalFooter class="flex flex-wrap justify-end gap-3">
          <app-button variant="secondary" (click)="onClose()">Hủy</app-button>
          <app-button (click)="onAdminReceive()" [disabled]="adminReceiveAmount() === null || adminReceiveAmount()! < minimumLoggedAmount() || (adminReceiveIsDepleted() && !adminReceiveDisposalReason()) || isProcessing" [loading]="isProcessing">
            Hoàn tất tiếp nhận
          </app-button>
        </div>
      </app-modal-shell>
    }
  `
})
export class RequestsActionModalsComponent implements OnChanges {
  readonly tagCatalog = inject(StandardTagCatalogService);
  @Input() activeModal: ActionModalMode = null;
  @Input() request: StandardRequest | null = null;
  @Input() standard: ReferenceStandard | null = null;
  @Input() isForceReturn = false;
  @Input() isProcessing = false;

  @Output() close = new EventEmitter<void>();
  
  @Output() approveAction = new EventEmitter<{ expectedAmount: number | null, purpose: string }>();
  @Output() rejectAction = new EventEmitter<{ reason: string }>();
  @Output() logUsageAction = new EventEmitter<{ amount: number, purpose: string }>();
  @Output() returnAction = new EventEmitter<{ amount: number, isDepleted: boolean, sopTags: string[] }>();
  @Output() adminReceiveAction = new EventEmitter<{ amount: number, isDepleted: boolean, disposalReason: string, finalSopTags: string[] }>();

  // State properties

  approveExpectedAmount = signal<number | null>(null);
  approvePurpose = signal<string>('');

  rejectReason = signal<string>('');

  logUsageAmount = signal<number | null>(null);
  logUsagePurpose = signal<string>('');

  returnAmount = signal<number | null>(null);
  returnIsDepleted = signal<boolean>(false);
  returnSopTags = signal<string[]>([]);
  returnTagToAdd = signal<string>('');

  adminReceiveAmount = signal<number | null>(null);
  adminReceiveIsDepleted = signal<boolean>(false);
  adminReceiveDisposalReason = signal<string>('');
  adminFinalSopTags = signal<string[]>([]);
  adminTagToAdd = signal<string>('');

  readonly tagOptions = this.tagCatalog.selectableOptions;
  readonly maxReturnTags = MAX_RETURN_TAGS;

  formatTagLabel(option: { label: string; methodName?: string }): string {
    return formatMethodOptionLabel(option);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['activeModal'] || changes['request']) {
        const mode = this.activeModal;
        const req = this.request;
        if (!mode) {
           this.resetAllStates();
        } else if (mode === 'adminReceive' && req) {
           if (this.adminReceiveAmount() === null) {
              this.adminReceiveAmount.set(req.reportedAmountUsed ?? req.totalAmountUsed ?? 0);
           }
           if (!this.adminReceiveIsDepleted() && req.reportedDepleted) {
              this.adminReceiveIsDepleted.set(req.reportedDepleted);
           }
           if (this.adminFinalSopTags().length === 0 && req.sopTags?.length) {
              this.adminFinalSopTags.set(sanitizeLegacyTagKeys(req.sopTags));
           }
        } else if (mode === 'return' && req) {
           if (this.returnAmount() === null) {
              this.returnAmount.set(req.reportedAmountUsed ?? req.totalAmountUsed ?? 0);
           }
           if (this.returnSopTags().length === 0 && req.sopTags?.length) {
              this.returnSopTags.set(sanitizeLegacyTagKeys(req.sopTags));
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
    this.returnSopTags.set([]);
    this.returnTagToAdd.set('');
    
    this.adminReceiveAmount.set(null);
    this.adminReceiveIsDepleted.set(false);
    this.adminReceiveDisposalReason.set('');
    this.adminFinalSopTags.set([]);
    this.adminTagToAdd.set('');
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
    if (this.isProcessing || amount === null || !Number.isFinite(amount) || amount <= 0) return;
    this.logUsageAction.emit({
        amount,
        purpose: this.logUsagePurpose()
    });
  }

  onReturn() {
    const amount = this.returnAmount();
    if (this.isProcessing || amount === null || !Number.isFinite(amount) || amount < this.minimumLoggedAmount()) return;
    this.returnAction.emit({
        amount,
        isDepleted: this.returnIsDepleted(),
        sopTags: this.returnSopTags()
    });
  }

  onAdminReceive() {
    const amount = this.adminReceiveAmount();
    if (this.isProcessing || amount === null || !Number.isFinite(amount) || amount < this.minimumLoggedAmount()) return;
    this.adminReceiveAction.emit({
        amount,
        isDepleted: this.adminReceiveIsDepleted(),
      disposalReason: this.adminReceiveDisposalReason(),
      finalSopTags: this.adminFinalSopTags()
    });
  }

  addReturnTag(): void {
    const key = this.returnTagToAdd();
    if (!key || this.returnSopTags().includes(key) || this.returnSopTags().length >= MAX_RETURN_TAGS) return;
    this.returnSopTags.update(tags => [...tags, key]);
    this.returnTagToAdd.set('');
  }

  removeReturnTag(key: string): void {
    this.returnSopTags.update(tags => tags.filter(item => item !== key));
  }

  addAdminTag(): void {
    const key = this.adminTagToAdd();
    if (!key || this.adminFinalSopTags().includes(key) || this.adminFinalSopTags().length >= MAX_RETURN_TAGS) return;
    this.adminFinalSopTags.update(tags => [...tags, key]);
    this.adminTagToAdd.set('');
  }

  removeAdminTag(key: string): void {
    this.adminFinalSopTags.update(tags => tags.filter(item => item !== key));
  }

  formatNum = formatNum;

  minimumLoggedAmount(): number {
    return Math.max(0, Number(this.request?.totalAmountUsed || 0));
  }
}
