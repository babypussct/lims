import { Component, input, output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReferenceStandard, PurchaseRequest } from '../../../core/models/standard.model';
import { StandardService } from '../standard.service';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { AppModalShellComponent } from '../../../shared/components/ui/modal-shell/modal-shell.component';

@Component({
  selector: 'app-standards-purchase-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AppModalShellComponent],
  template: `
      <!-- PURCHASE REQUEST MODAL -->
      @if (isOpen()) {
         <app-modal-shell
           title="Đề nghị mua sắm"
           description="Tạo yêu cầu cấp mới cho chất chuẩn đã chọn."
           size="sm"
           (closed)="onClose()"
         >
               <form id="standards-purchase-form" modalBody [formGroup]="purchaseForm" (ngSubmit)="submitPurchaseRequest()" class="flex flex-col gap-4">
                   <div class="text-sm border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-r text-amber-800 dark:text-amber-200">
                       Xin cấp mới: <span class="font-black truncate max-w-full block" [title]="selectedStd()?.name">{{selectedStd()?.name}}</span>
                       Code: <span class="font-mono font-bold">{{selectedStd()?.product_code || 'N/A'}}</span>
                   </div>
                   
                   <div><label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Mức độ ưu tiên *</label><select formControlName="priority" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 dark:text-white"><option value="NORMAL">Bình thường</option><option value="HIGH">Khẩn cấp</option></select></div>
                   
                   <div><label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Số lượng dự kiến cần *</label><input type="text" formControlName="expectedAmount" placeholder="VD: 2 chai 10mg" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 dark:text-white"></div>
                   
                   <div><label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Hãng cần mua</label><input type="text" formControlName="preferred_manufacturer" placeholder="VD: Sigma Aldrich" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 dark:text-white"></div>
                   
                   <div><label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Cấp độ chuẩn (VD: ISO 17034)</label><input type="text" formControlName="required_level" placeholder="ISO 17034 / CRM / SRM..." class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 dark:text-white"></div>
                   
                   <div><label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Độ tinh khiết yêu cầu</label><input type="text" formControlName="required_purity" placeholder="VD: >= 99%" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 dark:text-white"></div>
                   
                   <div><label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Ghi chú / Lý do mua</label><textarea formControlName="notes" rows="2" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 dark:text-white" placeholder="Mục đích sử dụng..."></textarea></div>
               </form>

               <div modalFooter class="flex flex-wrap justify-end gap-3">
                   <button type="button" (click)="onClose()" class="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700">Hủy</button>
                   <button type="submit" form="standards-purchase-form" [disabled]="purchaseForm.invalid || isProcessing()" class="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 text-sm font-bold text-white shadow-sm transition-colors hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-amber-600 dark:hover:bg-amber-500">
                        @if(isProcessing()) { <i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> } @else { <i class="fa-solid fa-paper-plane text-xs" aria-hidden="true"></i> Gửi yêu cầu }
                   </button>
               </div>
         </app-modal-shell>
      }
  `
})
export class StandardsPurchaseModalComponent {
  isOpen = input<boolean>(false);
  selectedStd = input<ReferenceStandard | null>(null);
  
  closeModal = output<void>();

  private fb = inject(FormBuilder);
  private stdService = inject(StandardService);
  private toast = inject(ToastService);
  private auth = inject(AuthService);

  isProcessing = signal(false);

  purchaseForm: FormGroup = this.fb.group({
    priority: ['NORMAL'],
    notes: [''],
    expectedAmount: ['', Validators.required],
    preferred_manufacturer: [''],
    required_level: [''],
    required_purity: ['']
  });

  onClose() {
    this.closeModal.emit();
    this.purchaseForm.reset({ priority: 'NORMAL' });
  }

  async submitPurchaseRequest() {
    if (this.purchaseForm.invalid || !this.selectedStd() || this.isProcessing()) return;
    try {
        this.isProcessing.set(true);
        const user = this.auth.currentUser();
        const std = this.selectedStd()!;
        
        const req: Omit<PurchaseRequest, 'id'> = {
            standardId: std.id,
            standardName: std.name,
            requestedBy: user?.uid || 'unknown',
            requestedByName: user?.displayName || user?.email || 'Người dùng không xác định',
            priority: this.purchaseForm.value.priority,
            notes: this.purchaseForm.value.notes,
            status: 'PENDING',
            requestDate: Date.now(),
            expectedAmount: this.purchaseForm.value.expectedAmount,
            preferred_manufacturer: this.purchaseForm.value.preferred_manufacturer,
            required_level: this.purchaseForm.value.required_level,
            required_purity: this.purchaseForm.value.required_purity,
            product_code: std.product_code || ''
        };

        await this.stdService.createPurchaseRequest(req);
        this.toast.show('Đã gửi yêu cầu mua sắm', 'success');
        this.onClose();
    } catch (e: any) {
        this.toast.show('Lỗi gửi yêu cầu: ' + e.message, 'error');
    } finally {
        this.isProcessing.set(false);
    }
  }
}
