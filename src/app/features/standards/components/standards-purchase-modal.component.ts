import { Component, input, output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReferenceStandard, PurchaseRequest } from '../../../core/models/standard.model';
import { StandardService } from '../standard.service';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-standards-purchase-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
      <!-- PURCHASE REQUEST MODAL -->
      @if (isOpen()) {
         <div class="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm fade-in">
            <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up border border-amber-100 dark:border-amber-900/40">
               <div class="px-6 py-4 border-b border-amber-100 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-900/10 flex justify-between items-center">
                   <h3 class="font-black text-amber-800 dark:text-amber-500 text-lg flex items-center gap-2"><i class="fa-solid fa-cart-plus"></i> Đề nghị mua sắm</h3>
                   <button (click)="onClose()" class="text-slate-400 hover:text-red-500 rounded-full w-8 h-8 flex items-center justify-center border border-slate-200 dark:border-slate-700 transition"><i class="fa-solid fa-times"></i></button>
               </div>
               <form [formGroup]="purchaseForm" (ngSubmit)="submitPurchaseRequest()" class="p-6 flex flex-col gap-4">
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
                   
                   <div class="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                       <button type="button" (click)="onClose()" class="px-5 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl font-bold text-sm transition">Hủy</button>
                       <button type="submit" [disabled]="purchaseForm.invalid || isProcessing()" class="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500 text-white rounded-xl font-bold text-sm shadow-md dark:shadow-none transition disabled:opacity-50 flex items-center gap-2">
                            @if(isProcessing()) { <i class="fa-solid fa-spinner fa-spin"></i> } @else { <i class="fa-solid fa-paper-plane text-xs"></i> Gửi yêu cầu }
                       </button>
                   </div>
               </form>
            </div>
         </div>
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
            requestedByName: user?.displayName || user?.email || 'Unknown User',
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
