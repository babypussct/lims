import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '../../../core/services/state.service';
import { ToastService } from '../../../core/services/toast.service';
import { AppButtonComponent } from '../../../shared/components/ui/button/button.component';
import { validateSafetyConfigDraft } from '../../settings/settings-validation.utils';

@Component({
  selector: 'app-config-safety',
  standalone: true,
  imports: [CommonModule, FormsModule, AppButtonComponent],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in items-start">
        
        <!-- Safety Config Card -->
        <div class="md:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-700 p-6 flex flex-col gap-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700/60 pb-4">
                <div>
                    <h3 class="font-black text-slate-800 dark:text-slate-100 flex items-center gap-2.5 text-base tracking-tight">
                        <div class="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 flex items-center justify-center shadow-2xs">
                            <i class="fa-solid fa-percent text-sm"></i>
                        </div>
                        Quy Định Hao Hụt (Safety Margin)
                    </h3>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Cấu hình tỷ lệ hao hụt tự động dựa trên phân loại hóa chất khi tính toán và lập mẻ.</p>
                </div>
                <app-button size="sm" (click)="saveSafety()">
                    <i class="fa-solid fa-floppy-disk" aria-hidden="true"></i> Lưu Cấu Hình
                </app-button>
            </div>

            <!-- Default Margin Card -->
            <div class="bg-orange-50/50 dark:bg-orange-950/20 p-4 rounded-xl border border-orange-200/80 dark:border-orange-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <label class="text-xs font-black text-orange-900 dark:text-orange-300 uppercase tracking-wide block">Mức hao hụt mặc định</label>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Áp dụng cho mọi hóa chất không có quy tắc thiết lập riêng bên dưới.</p>
                </div>
                <div class="relative w-28 shrink-0">
                    <input type="number" min="0" max="100" step="0.1" [(ngModel)]="safetyConfigLocal.defaultMargin" class="w-full pl-3 pr-8 py-2 border border-orange-200 dark:border-orange-800/60 bg-white dark:bg-slate-800 rounded-xl font-black text-slate-800 dark:text-slate-100 text-center outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition text-sm">
                    <span class="absolute right-3 top-2.5 text-xs font-bold text-orange-500">%</span>
                </div>
            </div>

            <!-- Category Rules Table -->
            <div>
                <div class="flex justify-between items-center mb-3">
                    <h4 class="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Quy Tắc Chi Tiết theo Loại (Category)</h4>
                    <app-button variant="secondary" size="sm" (click)="addSafetyRule()">
                        <i class="fa-solid fa-plus text-xs" aria-hidden="true"></i> Thêm Quy Tắc
                    </app-button>
                </div>
                
                <!-- Mobile Stacked Card View (<sm) -->
                <div class="block sm:hidden space-y-3">
                    @for (rule of safetyRulesLocal(); track $index) {
                        <div class="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs space-y-2.5">
                            <div>
                                <label class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                                    Phân loại hóa chất
                                </label>
                                <select [(ngModel)]="rule.category" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 outline-none text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer focus:border-fuchsia-500 focus:bg-white dark:focus:bg-slate-800 transition">
                                    <option value="" disabled selected>-- Chọn phân loại áp dụng --</option>
                                    @for(cat of state.categories(); track cat.id) {
                                        <option [value]="cat.id">{{cat.name}} ({{cat.id}})</option>
                                    }
                                </select>
                            </div>
                            <div class="flex items-center justify-between gap-3 pt-1 border-t border-slate-100 dark:border-slate-750">
                                <div class="flex items-center gap-2">
                                    <span class="text-xs font-bold text-slate-600 dark:text-slate-300">Tỷ lệ hao hụt:</span>
                                    <div class="relative w-24">
                                        <input type="number" min="0" max="100" step="0.1" [(ngModel)]="rule.margin" class="w-full pl-3 pr-7 py-1.5 border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-center text-xs font-black text-slate-800 dark:text-slate-100 outline-none focus:border-fuchsia-500 focus:bg-white dark:focus:bg-slate-800 transition">
                                        <span class="absolute right-2.5 top-2 text-[11px] font-bold text-slate-400 dark:text-slate-500">%</span>
                                    </div>
                                </div>
                                <button (click)="removeSafetyRule($index)" class="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition" title="Xóa quy tắc này">
                                    <i class="fa-solid fa-trash text-xs" aria-hidden="true"></i>
                                </button>
                            </div>
                        </div>
                    }
                    @if(safetyRulesLocal().length === 0) {
                        <div class="p-6 text-center text-slate-400 dark:text-slate-500 italic text-xs bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                            Chưa có quy tắc riêng. Hệ thống sẽ áp dụng mức hao hụt mặc định cho tất cả các loại hóa chất.
                        </div>
                    }
                </div>

                <!-- Desktop Table View (>=sm) -->
                <div class="hidden sm:block border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-2xs">
                    <div class="overflow-x-auto">
                        <table class="w-full min-w-[420px] text-sm text-left">
                            <thead class="bg-slate-50 dark:bg-slate-900/60 text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200/80 dark:border-slate-700">
                                <tr>
                                    <th class="px-4 py-3">Phân loại hóa chất (Category)</th>
                                    <th class="px-4 py-3 w-36 text-center">Tỷ lệ hao hụt</th>
                                    <th class="px-4 py-3 w-16 text-center">Xóa</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 dark:divide-slate-700/60 bg-white dark:bg-slate-800">
                                @for (rule of safetyRulesLocal(); track $index) {
                                    <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition">
                                        <td class="px-4 py-2.5">
                                            <select [(ngModel)]="rule.category" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-1.5 outline-none text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer focus:border-fuchsia-500 focus:bg-white dark:focus:bg-slate-800 transition">
                                                <option value="" disabled selected>-- Chọn phân loại áp dụng --</option>
                                                @for(cat of state.categories(); track cat.id) {
                                                    <option [value]="cat.id">{{cat.name}} ({{cat.id}})</option>
                                                }
                                            </select>
                                        </td>
                                        <td class="px-4 py-2.5 text-center">
                                            <div class="relative mx-auto w-24">
                                                <input type="number" min="0" max="100" step="0.1" [(ngModel)]="rule.margin" class="w-full pl-3 pr-7 py-1.5 border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-center text-xs font-black text-slate-800 dark:text-slate-100 outline-none focus:border-fuchsia-500 focus:bg-white dark:focus:bg-slate-800 transition">
                                                <span class="absolute right-2.5 top-2 text-[11px] font-bold text-slate-400 dark:text-slate-500">%</span>
                                            </div>
                                        </td>
                                        <td class="px-4 py-2.5 text-center">
                                            <button (click)="removeSafetyRule($index)" class="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition" title="Xóa quy tắc này">
                                                <i class="fa-solid fa-trash text-xs" aria-hidden="true"></i>
                                            </button>
                                        </td>
                                    </tr>
                                }
                                @if(safetyRulesLocal().length === 0) {
                                    <tr>
                                        <td colspan="3" class="p-6 text-center text-slate-400 dark:text-slate-500 italic text-xs">
                                            Chưa có quy tắc riêng. Hệ thống sẽ áp dụng mức hao hụt mặc định cho tất cả các loại hóa chất.
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- Helper / Info Panel -->
        <div class="bg-fuchsia-50/60 dark:bg-fuchsia-950/20 rounded-2xl border border-fuchsia-100 dark:border-fuchsia-900/40 p-6">
            <h4 class="font-black text-fuchsia-800 dark:text-fuchsia-300 text-sm mb-3 flex items-center gap-2">
                <i class="fa-solid fa-circle-info" aria-hidden="true"></i> Hướng Dẫn Vận Hành
            </h4>
            <ul class="text-xs leading-relaxed text-slate-600 dark:text-slate-300 space-y-3 list-disc pl-4">
                <li>
                    <b class="dark:text-slate-200">Mức mặc định:</b> Được áp dụng cho tất cả các chất không thuộc danh sách quy tắc riêng.
                </li>
                <li>
                    <b class="dark:text-slate-200">Chế độ tự động:</b> Khi chạy trình tính toán hoặc chức năng lập mẻ, nếu chọn chế độ hao hụt là "Tự động" (hoặc để trống), hệ thống sẽ tự động tra cứu bảng quy tắc này.
                </li>
                <li>
                    <b class="dark:text-slate-200">Gợi ý thiết lập thực tế:</b>
                    <ul class="list-disc pl-4 mt-1.5 space-y-1 text-slate-500 dark:text-slate-400">
                        <li><span class="font-bold text-slate-700 dark:text-slate-300">Chất chuẩn (Standard):</span> 2% (chất chuẩn đối chiếu đắt tiền).</li>
                        <li><span class="font-bold text-slate-700 dark:text-slate-300">Dung môi (Solvent):</span> 15-20% (bù trừ bay hơi khi pha chế).</li>
                        <li><span class="font-bold text-slate-700 dark:text-slate-300">Hóa chất thường (Reagent):</span> 10%.</li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
  `
})
export class ConfigSafetyComponent implements OnInit {
  state = inject(StateService);
  toast = inject(ToastService);
  
  safetyConfigLocal = { defaultMargin: 10, rules: {} as Record<string, number> };
  safetyRulesLocal = signal<{category: string, margin: number}[]>([]);

  ngOnInit() {
    const sVal = this.state.safetyConfig();
    this.safetyConfigLocal = { 
        defaultMargin: sVal.defaultMargin, 
        rules: { ...sVal.rules } 
    };
    this.safetyRulesLocal.set(Object.entries(sVal.rules).map(([category, margin]) => ({ category, margin })));
  }

  addSafetyRule() { this.safetyRulesLocal.update(r => [...r, { category: '', margin: 10 }]); }
  removeSafetyRule(index: number) { this.safetyRulesLocal.update(r => r.filter((_, i) => i !== index)); }
  async saveSafety() {
      const validation = validateSafetyConfigDraft(
        this.safetyConfigLocal.defaultMargin,
        this.safetyRulesLocal(),
      );
      if (!validation.ok) {
        this.toast.show(validation.message, 'error');
        return;
      }

      try {
        await this.state.saveSafetyConfig(validation.value);
        this.safetyConfigLocal = {
          defaultMargin: validation.value.defaultMargin,
          rules: { ...validation.value.rules },
        };
        this.safetyRulesLocal.set(Object.entries(validation.value.rules).map(([category, margin]) => ({ category, margin })));
        this.toast.show('Đã lưu cấu hình định mức.', 'success');
      } catch (e: any) {
        this.toast.show(`Không thể lưu cấu hình định mức: ${e?.message || e}`, 'error');
      }
  }
}
