import { Component, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReferenceStandard } from '../../../core/models/standard.model';
import { UserProfile } from '../../../core/services/auth.service';
import { getExpiryClass, formatNum } from '../../../shared/utils/utils';

export interface BackfillData {
  date: string;          // YYYY-MM-DD
  amountUsed: number;
  unit: string;
  purpose: string;
  userId: string;
  userName: string;
  isDepleted: boolean;
}

@Component({
  selector: 'app-standards-backfill-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isOpen() && std()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm fade-in">
        <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-3xl flex overflow-hidden animate-bounce-in border border-slate-100 dark:border-slate-800">

          <!-- Left: Standard Info Summary -->
          <div class="hidden md:flex w-2/5 bg-slate-50 dark:bg-slate-800/50 p-8 flex-col border-r border-slate-100 dark:border-slate-800">
            <div class="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 flex items-center justify-center text-2xl shadow-sm border border-slate-100 dark:border-slate-700 mb-6">
              <i class="fa-solid fa-pen-to-square"></i>
            </div>

            <h3 class="text-xl font-black text-slate-800 dark:text-slate-100 leading-tight mb-2 line-clamp-3">{{std()?.name}}</h3>
            <div class="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest mb-6">Nhập bù nhật ký sử dụng</div>

            <div class="space-y-4">
              <div class="flex flex-col">
                <span class="text-[10px] font-bold text-slate-400 uppercase">Số Lô / Lot</span>
                <span class="text-sm font-bold text-slate-700 dark:text-slate-200">{{std()?.lot_number || 'N/A'}}</span>
              </div>
              @if(std()?.internal_id) {
                <div class="flex flex-col">
                  <span class="text-[10px] font-bold text-slate-400 uppercase">Mã quản lý</span>
                  <span class="text-sm font-bold text-slate-500">{{std()?.internal_id}}</span>
                </div>
              }
              <div class="flex flex-col">
                <span class="text-[10px] font-bold text-slate-400 uppercase">Hạn dùng</span>
                <span class="text-sm font-bold" [class]="getExpiryClass(std()?.expiry_date)">{{std()?.expiry_date || 'N/A'}}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-[10px] font-bold text-slate-400 uppercase">Tồn kho hiện tại</span>
                <span class="text-lg font-black text-emerald-600 dark:text-emerald-400">{{formatNum(std()?.current_amount ?? 0)}} <span class="text-xs font-bold text-slate-400">{{std()?.unit}}</span></span>
              </div>
              @if(std()?.status === 'IN_USE') {
                <div class="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-700/50">
                  <div class="flex items-center gap-1.5 mb-1">
                    <i class="fa-solid fa-triangle-exclamation text-amber-500 text-xs"></i>
                    <span class="text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-wide">Đang được mượn</span>
                  </div>
                  <p class="text-[10px] text-amber-700 dark:text-amber-400 leading-relaxed">
                    Chuẩn đang được <strong>{{std()?.current_holder}}</strong> sử dụng. Nhập bù vẫn được cho phép vì đây là hồi ký lịch sử.
                  </p>
                </div>
              }
            </div>

            <div class="mt-auto pt-6 border-t border-slate-200 dark:border-slate-700">
              <div class="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-2xl border border-purple-100 dark:border-purple-800/30">
                <p class="text-[10px] text-purple-700 dark:text-purple-400 leading-relaxed font-medium">
                  <i class="fa-solid fa-circle-info mr-1"></i>
                  Thao tác sẽ ghi nhật ký và trừ tồn kho tương ứng với ngày được nhập. Dữ liệu có thể rollback từ màn hình Lịch sử.
                </p>
              </div>
            </div>
          </div>

          <!-- Right: Backfill Form -->
          <div class="flex-1 p-8 flex flex-col bg-white dark:bg-slate-900">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
                Nhập bù nhật ký
              </h3>
              <button (click)="closeModal.emit()" class="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 transition">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div class="flex-1 space-y-5 overflow-y-auto pr-2 custom-scrollbar">

              <!-- Người sử dụng -->
              <div>
                <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Người sử dụng <span class="text-red-500">*</span></label>
                <select [ngModel]="userId()" (ngModelChange)="onUserChange($event)"
                  class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none appearance-none">
                  <option value="">-- Chọn người sử dụng --</option>
                  @for (user of userList(); track user.uid) {
                    <option [value]="user.uid">{{user.displayName}} ({{user.email}})</option>
                  }
                </select>
              </div>

              <!-- Ngày sử dụng -->
              <div>
                <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Ngày sử dụng <span class="text-red-500">*</span></label>
                <input type="date"
                  [ngModel]="usageDate()"
                  (ngModelChange)="usageDate.set($event)"
                  [max]="todayStr"
                  class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none">
                <p class="text-[10px] text-slate-400 dark:text-slate-500 mt-1 pl-1">
                  <i class="fa-solid fa-calendar-days mr-1"></i>
                  Ngày có thể nhập ngược (không được sau hôm nay)
                </p>
              </div>

              <!-- Số lượng -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Lượng sử dụng ({{std()?.unit}}) <span class="text-red-500">*</span>
                  </label>
                  @if ((std()?.current_amount ?? 0) > 0) {
                    <button type="button" (click)="fillMaxAmount()"
                      class="px-2.5 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-700/50 hover:bg-amber-100 dark:hover:bg-amber-900/50 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm active:scale-95">
                      <i class="fa-solid fa-angles-up text-[10px]"></i> Tối đa ({{formatNum(std()?.current_amount ?? 0)}} {{std()?.unit}})
                    </button>
                  }
                </div>
                <div class="relative">
                  <input type="number"
                    [ngModel]="amountUsed()"
                    (ngModelChange)="onAmountChange($event)"
                    min="0.001"
                    [max]="std()?.current_amount ?? null"
                    step="any"
                    class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none pr-16"
                    placeholder="VD: 5">
                  <span class="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">{{std()?.unit}}</span>
                </div>
                
                <!-- Checkbox đánh dấu hết chuẩn -->
                <div class="mt-2 flex items-center gap-2 bg-amber-50/50 dark:bg-amber-900/10 p-2.5 rounded-xl border border-amber-200/60 dark:border-amber-800/40">
                  <input type="checkbox" id="backfillIsDepleted" [ngModel]="isDepleted()" (ngModelChange)="onDepletedChange($event)" class="w-4 h-4 accent-amber-600 rounded cursor-pointer">
                  <label for="backfillIsDepleted" class="text-xs font-bold text-amber-900 dark:text-amber-300 cursor-pointer flex items-center gap-1.5 select-none">
                    <i class="fa-solid fa-box-archive text-amber-500 text-[11px]"></i> Đánh dấu chuẩn đã sử dụng hết (Hết hàng)
                  </label>
                </div>

                @if (amountUsed() && std() && amountUsed()! > (std()?.current_amount ?? 0)) {
                  <p class="text-[10px] text-rose-500 mt-1 pl-1 font-bold">
                    <i class="fa-solid fa-triangle-exclamation mr-1"></i>
                    Vượt quá tồn kho (còn {{formatNum(std()?.current_amount ?? 0)}} {{std()?.unit}})
                  </p>
                }
              </div>

              <!-- Mục đích -->
              <div>
                <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Mục đích sử dụng <span class="text-red-500">*</span></label>
                <textarea [ngModel]="purpose()" (ngModelChange)="purpose.set($event)" rows="3"
                  class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none resize-none placeholder-slate-300"
                  placeholder="Nhập mục đích sử dụng..."></textarea>
                <!-- Quick select chips giống modal gán/mượn chuẩn -->
                <div class="flex flex-wrap gap-2 mt-2">
                  <button type="button" (click)="purpose.set('Pha chuẩn mới')" class="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-purple-600 rounded-lg transition border border-transparent hover:border-purple-200"># Pha Chuẩn Mới</button>
                  <button type="button" (click)="purpose.set('Kiểm tra định kỳ')" class="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-purple-600 rounded-lg transition border border-transparent hover:border-purple-200"># Kiểm Tra Định Kỳ</button>
                  <button type="button" (click)="purpose.set('Ngoại kiểm')" class="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-purple-600 rounded-lg transition border border-transparent hover:border-purple-200"># Ngoại Kiểm</button>
                  <button type="button" (click)="purpose.set('Nghiên cứu phát triển')" class="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-purple-600 rounded-lg transition border border-transparent hover:border-purple-200"># Nghiên Cứu Phát Triển</button>
                  <button type="button" (click)="purpose.set('Kiểm nghiệm mẫu')" class="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-purple-600 rounded-lg transition border border-transparent hover:border-purple-200"># Kiểm Nghiệm Mẫu</button>
                </div>
              </div>

            </div>

            <div class="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button (click)="closeModal.emit()" class="px-6 py-3 text-slate-500 dark:text-slate-400 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition">Hủy Bỏ</button>
              <button (click)="onConfirm()"
                [disabled]="!canConfirm() || isProcessing()"
                class="px-8 py-3 bg-purple-600 dark:bg-purple-500 text-white font-bold text-sm rounded-2xl hover:bg-purple-700 dark:hover:bg-purple-600 shadow-xl shadow-purple-200 dark:shadow-none transition disabled:opacity-50 flex items-center gap-2">
                @if(isProcessing()) {
                  <i class="fa-solid fa-spinner fa-spin"></i> Đang lưu...
                } @else {
                  <i class="fa-solid fa-pen-to-square text-xs"></i> Ghi nhật ký
                }
              </button>
            </div>
          </div>

        </div>
      </div>
    }
  `
})
export class StandardsBackfillModalComponent {
  std = input.required<ReferenceStandard | null>();
  isOpen = input.required<boolean>();
  userList = input.required<UserProfile[]>();
  isProcessing = input.required<boolean>();

  closeModal = output<void>();
  confirm = output<BackfillData>();

  userId = signal('');
  userName = signal('');
  usageDate = signal('');
  amountUsed = signal<number | null>(null);
  purpose = signal('');
  isDepleted = signal(false);

  readonly todayStr = new Date().toISOString().split('T')[0];

  getExpiryClass = getExpiryClass;
  formatNum = formatNum;

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        // Reset form khi modal mở
        this.userId.set('');
        this.userName.set('');
        this.usageDate.set(this.todayStr);
        this.amountUsed.set(null);
        this.purpose.set('');
        this.isDepleted.set(false);
      }
    });
  }

  onUserChange(uid: string) {
    this.userId.set(uid);
    const user = this.userList().find(u => u.uid === uid);
    this.userName.set(user ? (user.displayName || user.email || '') : '');
  }

  fillMaxAmount() {
    const max = this.std()?.current_amount ?? 0;
    this.amountUsed.set(max);
    this.isDepleted.set(true);
  }

  onAmountChange(val: number | null) {
    this.amountUsed.set(val);
    const max = this.std()?.current_amount ?? 0;
    if (val !== null && max > 0 && val >= max) {
      this.isDepleted.set(true);
    }
  }

  onDepletedChange(checked: boolean) {
    this.isDepleted.set(checked);
    if (checked) {
      const max = this.std()?.current_amount ?? 0;
      if (max > 0) {
        this.amountUsed.set(max);
      }
    }
  }

  canConfirm(): boolean {
    const amount = this.amountUsed();
    return !!(
      this.userId() &&
      this.usageDate() &&
      amount !== null && amount > 0 &&
      this.purpose().trim()
    );
  }

  onConfirm() {
    const amount = this.amountUsed();
    if (!this.canConfirm() || amount === null) return;
    this.confirm.emit({
      date: this.usageDate(),
      amountUsed: amount,
      unit: this.std()?.unit || 'mg',
      purpose: this.purpose().trim(),
      userId: this.userId(),
      userName: this.userName(),
      isDepleted: this.isDepleted()
    });
  }
}
