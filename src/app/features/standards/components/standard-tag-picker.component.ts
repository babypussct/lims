import { CommonModule } from '@angular/common';
import { Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StandardTagOption } from '../../../core/models/standard.model';
import { formatMethodOptionLabel, formatMethodOptionLabelCompact } from '../services/standard-tag.utils';

/**
 * Shared picker for persisted standard/request tags.
 *
 * Device labels are intentionally not selectable here: they are derived from
 * the selected method tag and are kept as UI metadata only.
 */
@Component({
  selector: 'app-standard-tag-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-2">
      <div class="flex items-center justify-between gap-2">
        <label class="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wide">{{ label() }}</label>
        <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500">{{ selectedKeys().length }}/{{ max() }}</span>
      </div>

      <div class="flex gap-2">
        <select
          [ngModel]="tagToAdd()"
          (ngModelChange)="tagToAdd.set($event)"
          [disabled]="disabled() || limitReached()"
          class="min-w-0 flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          <option value="">Chọn nhãn trong danh mục...</option>
          @for (option of availableOptions(); track option.key) {
            <option [value]="option.key">{{ formatOptionLabel(option) }}</option>
          }
        </select>
        <button
          type="button"
          (click)="addTag()"
          [disabled]="disabled() || !tagToAdd() || limitReached()"
          class="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 text-xs font-black disabled:opacity-40"
        >Thêm</button>
      </div>

      <div class="min-h-8 flex flex-wrap gap-1.5">
        @for (key of selectedKeys(); track key) {
          <span class="inline-flex max-w-full items-start gap-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800 px-2.5 py-1 text-[11px] font-bold" [title]="resolveLabel(key)">
            <span class="min-w-0 line-clamp-2 break-words">{{ resolveCompactLabel(key) }}</span>
            @if (!disabled()) {
              <button type="button" (click)="removeTag(key)" class="shrink-0 text-indigo-400 hover:text-red-500" aria-label="Gỡ nhãn">×</button>
            }
          </span>
        }
        @if (selectedKeys().length === 0) {
          <span class="text-[11px] text-slate-400 dark:text-slate-500 italic">Chưa gán nhãn.</span>
        }
      </div>

      @if (selectedKeys().length > 0 && !disabled() && allowClear()) {
        <button type="button" (click)="clearTags()" class="text-[11px] font-bold text-red-500 hover:text-red-600">Xóa tất cả nhãn</button>
      }
      @if (limitReached()) {
        <p class="text-[11px] font-bold text-amber-600 dark:text-amber-400">Đã đạt giới hạn {{ max() }} nhãn.</p>
      }
    </div>
  `,
})
export class StandardTagPickerComponent {
  selectedKeys = input<string[]>([]);
  options = input<readonly StandardTagOption[]>([]);
  max = input(100);
  label = input('Nhãn');
  disabled = input(false);
  allowClear = input(true);

  selectedKeysChange = output<string[]>();
  tagToAdd = signal('');

  availableOptions = computed(() => {
    const selected = new Set(this.selectedKeys());
    return this.options().filter(option => option.selectable && !selected.has(option.key));
  });

  limitReached = computed(() => this.selectedKeys().length >= this.max());

  addTag(): void {
    const key = this.tagToAdd();
    if (!key || this.disabled() || this.limitReached() || this.selectedKeys().includes(key)) return;
    this.selectedKeysChange.emit([...this.selectedKeys(), key]);
    this.tagToAdd.set('');
  }

  removeTag(key: string): void {
    if (this.disabled()) return;
    this.selectedKeysChange.emit(this.selectedKeys().filter(item => item !== key));
  }

  clearTags(): void {
    if (this.disabled() || !this.allowClear()) return;
    this.selectedKeysChange.emit([]);
  }

  resolveLabel(key: string): string {
    const option = this.options().find(item => item.key === key);
    return option ? formatMethodOptionLabel(option) : `[Đã lưu trữ] ${key}`;
  }

  resolveCompactLabel(key: string): string {
    const option = this.options().find(item => item.key === key);
    return option ? formatMethodOptionLabelCompact(option) : `[Đã lưu trữ] ${key}`;
  }

  formatOptionLabel(option: StandardTagOption): string {
    return formatMethodOptionLabel(option);
  }
}
