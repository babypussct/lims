import { Component, input, output, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReferenceStandard } from '../../../core/models/standard.model';
import { UserProfile } from '../../../core/services/auth.service';
import { getExpiryClass, canAssign } from '../../../shared/utils/utils';

@Component({
  selector: 'app-standards-assign-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isOpen() && std()) {
       <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm fade-in">
          <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-3xl flex overflow-hidden animate-bounce-in border border-slate-100 dark:border-slate-800">
              <!-- Left: Standard Info Summary -->
              <div class="hidden md:flex w-2/5 bg-slate-50 dark:bg-slate-800/50 p-8 flex-col border-r border-slate-100 dark:border-slate-800">
                  <div class="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl shadow-sm border border-slate-100 dark:border-slate-700 mb-6">
                      <i class="fa-solid fa-vial"></i>
                  </div>
                  
                  <h3 class="text-xl font-black text-slate-800 dark:text-slate-100 leading-tight mb-2 line-clamp-2">{{std()?.name}}</h3>
                  <div class="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-6">Thông tin chuẩn mượn</div>

                  <div class="space-y-4">
                      <div class="flex flex-col">
                          <span class="text-[10px] font-bold text-slate-400 uppercase">Số Lô / Lot</span>
                          <span class="text-sm font-bold text-slate-700 dark:text-slate-200">{{std()?.lot_number || 'N/A'}}</span>
                      </div>
                      <div class="flex flex-col">
                          <span class="text-[10px] font-bold text-slate-400 uppercase">Hạn dùng</span>
                          <span class="text-sm font-bold" [class]="getExpiryClass(std()?.expiry_date)">{{std()?.expiry_date || 'N/A'}}</span>
                      </div>
                      <div class="flex flex-col">
                          <span class="text-[10px] font-bold text-slate-400 uppercase">Lượng tồn kho</span>
                          <span class="text-sm font-bold text-emerald-600">{{std()?.current_amount}} {{std()?.unit}}</span>
                      </div>
                      @if(std()?.internal_id) {
                          <div class="flex flex-col">
                              <span class="text-[10px] font-bold text-slate-400 uppercase">Mã quản lý</span>
                              <span class="text-sm font-bold text-slate-500">{{std()?.internal_id}}</span>
                          </div>
                      }
                  </div>

                  <!-- FEFO Siblings Info -->
                  @if(fefoTopSibling(); as top) {
                      <div class="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-700/50">
                          <div class="flex items-center gap-1.5 mb-1">
                              <i class="fa-solid fa-triangle-exclamation text-amber-500 text-xs"></i>
                              <span class="text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-wide">Gợi ý FEFO</span>
                          </div>
                          <p class="text-[10px] text-amber-700 dark:text-amber-400 leading-relaxed">
                              Lọ <strong>{{top.internal_id || top.lot_number}}</strong>
                              (hạn: {{top.expiry_date || 'N/A'}}) gần hết hạn hơn — nên được cấp trước.
                          </p>
                      </div>
                  }

                  <div class="mt-auto pt-6 border-t border-slate-200 dark:border-slate-700">
                      <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-2xl border border-blue-100 dark:border-blue-800/30">
                          <p class="text-[10px] text-blue-700 dark:text-blue-400 leading-relaxed font-medium">
                              <i class="fa-solid fa-circle-info mr-1"></i>
                              Vui lòng ghi lại nhật ký sử dụng sau khi pha xong để hệ thống trừ kho chính xác.
                          </p>
                      </div>
                  </div>
              </div>

              <!-- Right: Borrow Form -->
              <div class="flex-1 p-8 flex flex-col bg-white dark:bg-slate-900">
                  <div class="flex justify-between items-center mb-6">
                      <h3 class="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
                          {{ isAssignMode() ? 'Gán cho nhân viên' : 'Mượn chuẩn sử dụng' }}
                      </h3>
                      <button (click)="closeModal.emit()" class="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 transition"><i class="fa-solid fa-times"></i></button>
                  </div>

                  <div class="flex-1 space-y-5 overflow-y-auto pr-2 custom-scrollbar">
                      @if(isAssignMode()) {
                          <div>
                              <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Nhân viên tiếp nhận <span class="text-red-500">*</span></label>
                              <select [ngModel]="assignUserId()" (ngModelChange)="onAssignUserChange($event)" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none appearance-none">
                                  <option value="">-- Chọn nhân viên --</option>
                                  @for (user of userList(); track user.uid) {
                                      <option [value]="user.uid">{{user.displayName}} ({{user.email}})</option>
                                  }
                              </select>
                          </div>
                      }

                      <div class="grid grid-cols-2 gap-4">
                          <div>
                              <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Ngày dự kiến trả</label>
                              <input type="date" [ngModel]="assignExpectedDate()" (ngModelChange)="assignExpectedDate.set($event)" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-indigo-500 outline-none [color-scheme:light] dark:[color-scheme:dark]">
                          </div>
                          <div>
                              <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Lượng dự kiến dùng ({{std()?.unit}})</label>
                              <input type="number" [ngModel]="assignExpectedAmount()" (ngModelChange)="assignExpectedAmount.set($event)" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-indigo-500 outline-none" placeholder="VD: 5">
                          </div>
                      </div>

                      <div>
                          <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Mục đích sử dụng <span class="text-red-500">*</span></label>
                          <textarea [ngModel]="assignPurpose()" (ngModelChange)="assignPurpose.set($event)" rows="3" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none resize-none placeholder-slate-300" placeholder="Nhập mục đích sử dụng..."></textarea>
                          
                          <div class="flex flex-wrap gap-2 mt-2">
                              <button (click)="assignPurpose.set('Pha chuẩn máy')" class="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 rounded-lg transition border border-transparent hover:border-indigo-200"># Pha chuẩn máy</button>
                              <button (click)="assignPurpose.set('Kiểm tra định kỳ')" class="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 rounded-lg transition border border-transparent hover:border-indigo-200"># Kiểm tra định kỳ</button>
                              <button (click)="assignPurpose.set('Ngoại kiểm')" class="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 rounded-lg transition border border-transparent hover:border-indigo-200"># Ngoại kiểm</button>
                              <button (click)="assignPurpose.set('Nghiên cứu phát triển')" class="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 rounded-lg transition border border-transparent hover:border-indigo-200"># Nghiên cứu phát triển</button>
                              <button (click)="assignPurpose.set('Kiểm nghiệm mẫu')" class="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 rounded-lg transition border border-transparent hover:border-indigo-200"># Kiểm nghiệm mẫu</button>
                          </div>
                      </div>
                  </div>

                  <div class="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <button (click)="closeModal.emit()" class="px-6 py-3 text-slate-500 dark:text-slate-400 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition">Hủy bỏ</button>
                      <button (click)="onConfirm()" [disabled]="!assignUserId() || !assignPurpose() || isProcessing()" class="px-8 py-3 bg-indigo-600 dark:bg-indigo-500 text-white font-bold text-sm rounded-2xl hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-xl shadow-indigo-200 dark:shadow-none transition disabled:opacity-50 flex items-center gap-2">
                          @if(isProcessing()) { <i class="fa-solid fa-spinner fa-spin"></i> } @else { <i class="fa-solid fa-paper-plane text-xs"></i> Xác nhận mượn }
                      </button>
                  </div>
              </div>
          </div>
       </div>
    }
  `
})
export class StandardsAssignModalComponent {
  std = input.required<ReferenceStandard | null>();
  isOpen = input.required<boolean>();
  isAssignMode = input.required<boolean>();
  userList = input.required<UserProfile[]>();
  isProcessing = input.required<boolean>();
  currentUserUid = input<string>('');
  currentUserName = input<string>('');
  /** Danh sách lọ cùng tên (không gồm lọ hiện tại), đã sắp xếp theo FEFO */
  sameName = input<ReferenceStandard[]>([]);

  closeModal = output<void>();
  confirm = output<{ userId: string, userName: string, purpose: string, expectedDate: string, expectedAmount: number | null }>();

  assignUserId = signal('');
  assignUserName = signal('');
  assignPurpose = signal('');
  assignExpectedDate = signal('');
  assignExpectedAmount = signal<number | null>(null);

  getExpiryClass = getExpiryClass;
  canAssignFn = canAssign;

  /** Lọ ưu tiên FEFO trong các lọ cùng tên mà nên dùng trước lọ hiện tại */
  fefoTopSibling = computed(() => {
    const current = this.std();
    const siblings = this.sameName();
    if (!current || siblings.length === 0) return null;

    const first = siblings.find(s => canAssign(s));
    if (!first) return null;

    const stdExp = current.expiry_date ? new Date(current.expiry_date).getTime() : Infinity;
    const firstExp = first.expiry_date ? new Date(first.expiry_date).getTime() : Infinity;

    if (firstExp < stdExp) return first;
    if (firstExp === stdExp && (first.current_amount || 0) < (current.current_amount || 0)) return first;
    return null;
  });

  constructor() {
    effect(() => {
      // Whenever modal opens, reset form
      if (this.isOpen()) {
        if (this.isAssignMode()) {
            this.assignUserId.set('');
            this.assignUserName.set('');
        } else {
            this.assignUserId.set(this.currentUserUid());
            this.assignUserName.set(this.currentUserName());
        }
        this.assignPurpose.set('');
        this.assignExpectedDate.set('');
        this.assignExpectedAmount.set(null);
      }
    }, { allowSignalWrites: true });
  }

  onAssignUserChange(userId: string) {
      this.assignUserId.set(userId);
      const user = this.userList().find(u => u.uid === userId);
      this.assignUserName.set(user ? user.displayName || '' : '');
  }

  onConfirm() {
      this.confirm.emit({
          userId: this.assignUserId(),
          userName: this.assignUserName(),
          purpose: this.assignPurpose(),
          expectedDate: this.assignExpectedDate(),
          expectedAmount: this.assignExpectedAmount()
      });
  }
}
