import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SampleDescriptionMaster } from '../../../core/models/sample-description.model';
import { AppModalShellComponent } from '../ui/modal-shell/modal-shell.component';
import { AppButtonComponent } from '../ui/button/button.component';

@Component({
  selector: 'app-quick-generate-sample-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, AppModalShellComponent, AppButtonComponent],
  template: `
    <app-modal-shell
      title="Tạo nhanh mã mẫu"
      description="Tự động sinh danh sách mã mẫu theo quy tắc."
      size="sm"
      (closed)="close.emit()">
      <div modalBody class="space-y-4">
        <div>
          <label for="quick-gen-prefix" class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Tiền tố</label>
          <input id="quick-gen-prefix" type="text" [ngModel]="prefix()" (ngModelChange)="prefix.set($event)"
                 class="w-full min-h-[44px] px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl text-base sm:text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition"
                 placeholder="VD: U">
        </div>

        <div class="grid grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label for="quick-gen-from" class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Từ số (Bắt đầu)</label>
            <input id="quick-gen-from" type="text" inputmode="numeric" [ngModel]="fromStr()" (ngModelChange)="fromStr.set($event)"
                   class="w-full min-h-[44px] px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl text-base sm:text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition"
                   placeholder="VD: 01">
            <p class="text-[10px] text-slate-400 dark:text-slate-500 mt-1 italic">Sẽ giữ nguyên số 0 ở đầu</p>
          </div>
          <div>
            <label for="quick-gen-to" class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Đến số (Kết thúc)</label>
            <input id="quick-gen-to" type="text" inputmode="numeric" [ngModel]="toStr()" (ngModelChange)="toStr.set($event)"
                   class="w-full min-h-[44px] px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl text-base sm:text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition"
                   placeholder="VD: 03">
          </div>
        </div>

        <div>
          <div class="flex flex-wrap items-center justify-between gap-2 mb-1.5">
            <label for="quick-gen-suffix" class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Hậu tố</label>
            <label class="flex items-center gap-2 min-h-[36px] cursor-pointer group">
              <input type="checkbox" [ngModel]="autoSuffix()" (ngModelChange)="autoSuffix.set($event)"
                     class="w-5 h-5 sm:w-4 sm:h-4 text-indigo-600 rounded border-slate-300 dark:border-slate-600 focus:ring-indigo-500 transition cursor-pointer">
              <span class="text-xs sm:text-[11px] font-bold text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">Tự động lấy ngày (dd-1)</span>
            </label>
          </div>
          <input id="quick-gen-suffix" type="text" [ngModel]="autoSuffix() ? currentDaySuffix : suffix()" (ngModelChange)="!autoSuffix() && suffix.set($event)" [disabled]="autoSuffix()"
                 class="w-full min-h-[44px] px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl text-base sm:text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition disabled:bg-slate-50 dark:disabled:bg-slate-800/50 disabled:text-slate-500 dark:disabled:text-slate-400 disabled:border-slate-100 dark:disabled:border-slate-800"
                 placeholder="VD: 24">
        </div>

        @if (includeDescription) {
          <div>
            <label for="quick-gen-desc" class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Mô tả mẫu</label>
            <input id="quick-gen-desc" type="text"
                   [attr.list]="descriptionListId"
                   [ngModel]="description()"
                   (ngModelChange)="description.set($event)"
                   class="w-full min-h-[44px] px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl text-base sm:text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition"
                   placeholder="VD: Cá tra nguyên con">
            <p class="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Áp dụng cho toàn bộ mã được tạo; có thể sửa riêng từng mẫu sau khi chèn.</p>
            <datalist [id]="descriptionListId">
              @for (item of availableSampleDescriptions; track item.id) {
                <option [value]="item.name">{{item.description || item.aliases?.join(', ') || ''}}</option>
              }
            </datalist>
          </div>
        }

        <div class="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700">
          <div class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Xem trước kết quả</div>
          <div class="text-sm font-mono text-indigo-700 dark:text-indigo-300 break-words max-h-24 overflow-y-auto custom-scrollbar">
            {{ previewResult() || 'Chưa có dữ liệu' }}
          </div>
        </div>
      </div>

      <div modalFooter class="flex w-full gap-2 sm:gap-3">
        <app-button variant="secondary" [fullWidth]="true" class="flex-1" (click)="close.emit()">Hủy</app-button>
        <app-button [fullWidth]="true" class="flex-1" [disabled]="!canGenerate()" (click)="generate()">
          <i class="fa-solid fa-wand-magic-sparkles" aria-hidden="true"></i> Chèn vào danh sách
        </app-button>
      </div>
    </app-modal-shell>
  `
})
export class QuickGenerateSampleModalComponent {
  @Input() includeDescription = false;
  @Input() availableSampleDescriptions: SampleDescriptionMaster[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() generated = new EventEmitter<string[]>();

  prefix = signal('');
  fromStr = signal('');
  toStr = signal('');
  suffix = signal('');
  autoSuffix = signal(true);
  description = signal('');
  readonly descriptionListId = `quick-sample-description-${Math.random().toString(36).slice(2)}`;

  get currentDaySuffix(): string {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      return String(d.getDate()).padStart(2, '0');
  }

  get effectiveSuffix(): string {
      return this.autoSuffix() ? this.currentDaySuffix : this.suffix();
  }

  canGenerate(): boolean {
      const from = parseInt(this.fromStr(), 10);
      const to = parseInt(this.toStr(), 10);
      
      if (this.fromStr() && !isNaN(from)) {
          if (this.toStr() && !isNaN(to)) {
              return from <= to;
          }
          return true; // Only 'From' is provided
      }
      return false;
  }

  generateList(): string[] {
      if (!this.canGenerate()) return [];
      
      const from = parseInt(this.fromStr(), 10);
      const to = parseInt(this.toStr(), 10);
      const padding = this.fromStr().length;
      
      const results: string[] = [];
      const end = !isNaN(to) ? to : from;
      const currentSuffix = this.effectiveSuffix;
      const description = this.includeDescription ? this.description().trim() : '';
      
      for (let i = from; i <= end; i++) {
          const numStr = i.toString().padStart(padding, '0');
          const code = `${this.prefix()}${numStr}${currentSuffix}`;
          results.push(description ? `${code}\t${description}` : code);
      }
      
      return results;
  }

  previewResult(): string {
      const list = this.generateList();
      if (list.length === 0) return '';
      const preview = list.map(item => item.replace(/\t/g, ' · '));
      if (list.length > 5) {
          return preview.slice(0, 5).join(', ') + ` ... (và ${list.length - 5} mẫu khác)`;
      }
      return preview.join(', ');
  }

  generate() {
      const list = this.generateList();
      if (list.length > 0) {
          this.generated.emit(list);
      }
  }
}
