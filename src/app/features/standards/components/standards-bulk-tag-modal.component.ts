import { CommonModule } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StandardBulkTagMode, formatMethodOptionLabel } from '../services/standard-tag.utils';
import { StandardTagOption } from '../../../core/models/standard.model';
import { AppModalShellComponent } from '../../../shared/components/ui/modal-shell/modal-shell.component';

@Component({
  selector: 'app-standards-bulk-tag-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, AppModalShellComponent],
  template: `
    @if (isOpen()) {
      <app-modal-shell
        title="Gán nhãn hàng loạt"
        [description]="selectedCount() + ' lọ được chọn · ADD là mặc định an toàn'"
        size="sm"
        (closed)="cancel.emit()"
      >
          <div modalBody class="space-y-5">
            <div>
              <label class="block text-xs font-black text-slate-500 uppercase mb-2">Chế độ</label>
              <select [ngModel]="mode()" (ngModelChange)="mode.set($event)" class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm font-bold">
                <option value="ADD">ADD · Thêm vào nhãn hiện có</option>
                <option value="REMOVE">REMOVE · Gỡ nhãn đã chọn</option>
                <option value="REPLACE">REPLACE · Thay thế toàn bộ</option>
              </select>
            </div>
            @if (mode() === 'REPLACE') { <div class="rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 px-3 py-2 text-xs font-bold text-red-700 dark:text-red-300"><i class="fa-solid fa-triangle-exclamation mr-1"></i>REPLACE sẽ xóa các nhãn cũ khỏi từng lọ. Hãy xác nhận kỹ.</div> }
            <div>
              <label class="block text-xs font-black text-slate-500 uppercase mb-2">Nhãn trong danh mục</label>
              <div class="flex gap-2">
                <select [ngModel]="tagToAdd()" (ngModelChange)="tagToAdd.set($event)" class="min-w-0 flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm font-bold">
                  <option value="">Chọn nhãn...</option>
                  @for (option of tagOptions(); track option.key) { <option [value]="option.key">{{formatTagLabel(option)}}</option> }
                </select>
                <button (click)="addTag()" [disabled]="!tagToAdd()" class="rounded-xl bg-indigo-600 px-4 py-2 text-white font-bold disabled:opacity-40">Thêm</button>
              </div>
            </div>
            <div class="min-h-10 flex flex-wrap gap-2">
              @for (key of tags(); track key) {
                <span class="inline-flex items-center gap-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800 px-3 py-1 text-xs font-bold" [title]="resolveLabel(key)">{{resolveLabel(key)}}<button (click)="removeTag(key)" class="text-indigo-400 hover:text-red-500">×</button></span>
              }
              @if (tags().length === 0) { <span class="text-xs text-slate-400 italic">Chưa chọn nhãn (REPLACE rỗng = xóa toàn bộ).</span> }
            </div>
          </div>
          <div modalFooter class="flex gap-2">
            <button (click)="cancel.emit()" class="px-4 py-2 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">Hủy</button>
            <button (click)="confirmSelection()" [disabled]="isProcessing()" class="px-5 py-2 rounded-xl bg-fuchsia-600 text-white text-sm font-black disabled:opacity-50">{{isProcessing() ? 'Đang lưu...' : 'Xác nhận'}}</button>
          </div>
      </app-modal-shell>
    }
  `,
})
export class StandardsBulkTagModalComponent {
  isOpen = input(false);
  selectedCount = input(0);
  tagOptions = input<StandardTagOption[]>([]);
  isProcessing = input(false);
  cancel = output<void>();
  confirm = output<{ tags: string[]; mode: StandardBulkTagMode }>();

  mode = signal<StandardBulkTagMode>('ADD');
  tags = signal<string[]>([]);
  tagToAdd = signal('');

  formatTagLabel(option: StandardTagOption): string {
    return formatMethodOptionLabel(option);
  }

  addTag(): void {
    const key = this.tagToAdd();
    if (!key || this.tags().includes(key)) return;
    this.tags.update(current => [...current, key]);
    this.tagToAdd.set('');
  }

  removeTag(key: string): void {
    this.tags.update(current => current.filter(item => item !== key));
  }

  resolveLabel(key: string): string {
    const option = this.tagOptions().find(item => item.key === key);
    return option ? formatMethodOptionLabel(option) : key;
  }

  confirmSelection(): void {
    if (this.isProcessing()) return;
    this.confirm.emit({ tags: this.tags(), mode: this.mode() });
  }
}
