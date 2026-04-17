import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '../../../core/services/state.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-config-safety',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in items-start">
        
        <!-- Safety Config Card -->
        <div class="md:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-700 p-6 flex flex-col gap-6">
            <div class="flex justify-between items-center">
                <div>
                    <h3 class="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 text-base">
                        <div class="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 flex items-center justify-center"><i class="fa-solid fa-percent"></i></div>
                        Quy định Hao hụt (Safety Margin)
                    </h3>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Cấu hình tỷ lệ hao hụt tự động dựa trên phân loại hóa chất.</p>
                </div>
                <button (click)="saveSafety()" class="px-4 py-2 bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white rounded-lg text-xs font-bold transition shadow-sm dark:shadow-none flex items-center gap-2">
                    <i class="fa-solid fa-floppy-disk"></i> Lưu Cấu hình
                </button>
            </div>

            <!-- Default Margin -->
            <div class="bg-orange-50/50 dark:bg-orange-900/10 p-4 rounded-xl border border-orange-100 dark:border-orange-900/30 flex items-center justify-between">
                <div>
                    <label class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1">Mức Hao hụt Mặc định</label>
                    <p class="text-[10px] text-slate-500 dark:text-slate-400">Áp dụng cho các loại không có quy tắc riêng.</p>
                </div>
                <div class="relative w-24">
                    <input type="number" [(ngModel)]="safetyConfigLocal.defaultMargin" class="w-full pl-3 pr-8 py-2 border border-orange-200 dark:border-orange-800/50 bg-white dark:bg-slate-800 rounded-lg font-bold text-slate-700 dark:text-slate-200 text-center outline-none focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-800/50 transition">
                    <span class="absolute right-3 top-2 text-xs font-bold text-orange-400 dark:text-orange-500">%</span>
                </div>
            </div>

            <!-- Category Rules Table -->
            <div>
                <div class="flex justify-between items-center mb-3">
                    <h4 class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Quy tắc chi tiết theo Loại (Category)</h4>
                    <button (click)="addSafetyRule()" class="text-[10px] bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-lg font-bold transition">+ Thêm Quy tắc</button>
                </div>
                
                <div class="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                    <table class="w-full text-sm text-left">
                        <thead class="bg-slate-50 dark:bg-slate-900/50 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                            <tr>
                                <th class="px-4 py-3">Loại Hóa chất (Category)</th>
                                <th class="px-4 py-3 w-32 text-center">Mức Hao hụt</th>
                                <th class="px-4 py-3 w-16"></th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50">
                            @for (rule of safetyRulesLocal(); track $index) {
                                <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition group">
                                    <td class="px-4 py-2">
                                        <select [(ngModel)]="rule.category" class="w-full bg-transparent border border-transparent hover:border-slate-200 dark:hover:border-slate-600 focus:border-orange-300 dark:focus:border-orange-500 rounded px-2 py-1 outline-none text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer text-center md:text-left transition">
                                            <option value="" disabled selected>Chọn phân loại</option>
                                            @for(cat of state.categories(); track cat.id) {
                                                <option [value]="cat.id">{{cat.name}} ({{cat.id}})</option>
                                            }
                                        </select>
                                    </td>
                                    <td class="px-4 py-2 text-center">
                                        <div class="relative mx-auto w-20">
                                            <input type="number" [(ngModel)]="rule.margin" class="w-full pl-2 pr-6 py-1 border border-slate-200 dark:border-slate-600 bg-transparent rounded text-center text-xs font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-orange-400 dark:focus:border-orange-500">
                                            <span class="absolute right-2 top-1 text-[10px] font-bold text-slate-400 dark:text-slate-500">%</span>
                                        </div>
                                    </td>
                                    <td class="px-4 py-2 text-center">
                                        <button (click)="removeSafetyRule($index)" class="text-slate-300 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition"><i class="fa-solid fa-trash"></i></button>
                                    </td>
                                </tr>
                            }
                            @if(safetyRulesLocal().length === 0) {
                                <tr><td colspan="3" class="p-6 text-center text-slate-400 dark:text-slate-500 italic text-xs">Chưa có quy tắc riêng. Hệ thống sẽ dùng mức mặc định.</td></tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Helper / Info Panel -->
        <div class="bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 p-6">
            <h4 class="font-bold text-indigo-800 dark:text-indigo-400 text-sm mb-3 flex items-center gap-2">
                <i class="fa-solid fa-circle-info"></i> Hướng dẫn
            </h4>
            <ul class="text-xs text-slate-600 dark:text-slate-400 space-y-3 list-disc pl-4">
                <li>
                    <b class="dark:text-slate-300">Mức mặc định:</b> Được áp dụng cho tất cả các chất không thuộc danh sách quy tắc riêng.
                </li>
                <li>
                    <b class="dark:text-slate-300">Auto Mode:</b> Khi chạy Calculator hoặc Smart Batch, nếu bạn chọn chế độ hao hụt là "Auto" (hoặc để trống), hệ thống sẽ tra cứu bảng này.
                </li>
                <li>
                    <b class="dark:text-slate-300">Gợi ý thiết lập:</b>
                    <ul class="list-circle pl-4 mt-1 space-y-1 text-slate-500 dark:text-slate-500">
                        <li><i class="dark:text-slate-400">Standard (Chất chuẩn):</i> 2% (Vì đắt tiền).</li>
                        <li><i class="dark:text-slate-400">Solvent (Dung môi):</i> 15-20% (Do bay hơi).</li>
                        <li><i class="dark:text-slate-400">Reagent (Hóa chất thường):</i> 10%.</li>
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
  saveSafety() {
      const rulesObj: Record<string, number> = {};
      this.safetyRulesLocal().forEach(item => { if (item.category && item.category.trim()) rulesObj[item.category.trim()] = item.margin; });
      const config = { defaultMargin: this.safetyConfigLocal.defaultMargin, rules: rulesObj };
      this.state.saveSafetyConfig(config);
      this.toast.show('Đã lưu cấu hình định mức.', 'success');
  }
}
