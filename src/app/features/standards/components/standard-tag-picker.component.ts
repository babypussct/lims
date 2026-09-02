import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, HostListener, inject, input, output, signal } from '@angular/core';
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
        <span class="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-black text-slate-500 dark:text-slate-400">{{ selectedKeys().length }}/{{ max() }} nhãn</span>
      </div>

      @if (!disabled() && !limitReached()) {
        <div class="rounded-xl border border-fuchsia-200 dark:border-fuchsia-800/70 bg-fuchsia-50/60 dark:bg-fuchsia-900/15 p-2.5">
          <div class="mb-2 flex items-start gap-2 text-[11px] font-bold text-fuchsia-700 dark:text-fuchsia-300">
            <i class="fa-solid fa-layer-group mt-0.5 shrink-0"></i>
            <span>Bạn có thể chọn nhiều nhãn liên tiếp trong cùng một lần mở danh sách.</span>
          </div>

          <div class="relative min-w-0">
            <button
              type="button"
              (click)="toggleDropdown()"
              [attr.aria-expanded]="dropdownOpen()"
              class="flex w-full min-w-0 items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-left text-sm text-slate-700 dark:text-slate-200 shadow-sm outline-none transition hover:border-fuchsia-300 dark:hover:border-fuchsia-700 focus:ring-2 focus:ring-fuchsia-500/30"
            >
              <i class="fa-solid fa-tags shrink-0 text-fuchsia-500"></i>
              <span class="min-w-0 flex-1 font-bold">Chọn nhiều nhãn trong danh mục...</span>
              <span class="shrink-0 text-[10px] font-bold text-slate-400">{{ availableOptions().length }} còn lại</span>
              <i class="fa-solid fa-chevron-down shrink-0 text-[10px] text-slate-400 transition-transform" [class.rotate-180]="dropdownOpen()"></i>
            </button>

            @if (dropdownOpen()) {
              <div class="absolute left-0 right-0 top-full z-40 mt-1.5 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl">
                <div class="border-b border-slate-100 dark:border-slate-800 p-2">
                  <div class="relative">
                    <i class="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400"></i>
                    <input
                      type="text"
                      [ngModel]="searchTerm()"
                      (ngModelChange)="searchTerm.set($event)"
                      (click)="$event.stopPropagation()"
                      class="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-2 pl-8 pr-3 text-xs font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-500/20"
                      placeholder="Tìm nhanh nhãn..."
                    >
                  </div>
                </div>

                <div class="max-h-56 overflow-y-auto p-1.5 custom-scrollbar">
                  @for (option of filteredOptions(); track option.key) {
                    <button
                      type="button"
                      (click)="addTag(option.key)"
                      class="flex w-full min-w-0 items-start gap-2 rounded-lg px-2.5 py-2 text-left hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/25"
                    >
                      <span class="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-fuchsia-200 dark:border-fuchsia-700 bg-fuchsia-50 dark:bg-fuchsia-900/30 text-[9px] text-fuchsia-600 dark:text-fuchsia-300">
                        <i class="fa-solid fa-plus"></i>
                      </span>
                      <span class="min-w-0 flex-1 text-xs font-bold leading-snug text-slate-700 dark:text-slate-200 break-words">{{ formatOptionLabel(option) }}</span>
                    </button>
                  } @empty {
                    <div class="px-3 py-5 text-center text-xs italic text-slate-400">Không còn nhãn phù hợp để thêm.</div>
                  }
                </div>

                <div class="flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 px-3 py-2">
                  <span class="text-[10px] font-bold text-slate-400">Đã chọn {{ selectedKeys().length }} nhãn</span>
                  <button type="button" (click)="closeDropdown()" class="rounded-lg bg-fuchsia-600 px-3 py-1.5 text-[11px] font-black text-white hover:bg-fuchsia-700">Xong</button>
                </div>
              </div>
            }
          </div>
        </div>
      }

      <div class="min-h-8 flex flex-wrap gap-1.5">
        @for (key of selectedKeys(); track key) {
          <span class="inline-flex max-w-full items-start gap-1 rounded-lg bg-fuchsia-50 dark:bg-fuchsia-900/30 text-fuchsia-700 dark:text-fuchsia-300 border border-fuchsia-100 dark:border-fuchsia-800 px-2.5 py-1 text-[11px] font-bold" [title]="resolveLabel(key)">
            <span class="min-w-0 line-clamp-2 break-words">{{ resolveCompactLabel(key) }}</span>
            @if (!disabled()) {
              <button type="button" (click)="removeTag(key)" class="shrink-0 text-fuchsia-400 hover:text-red-500" aria-label="Gỡ nhãn">×</button>
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
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  selectedKeys = input<string[]>([]);
  options = input<readonly StandardTagOption[]>([]);
  max = input(100);
  label = input('Nhãn');
  disabled = input(false);
  allowClear = input(true);

  selectedKeysChange = output<string[]>();
  dropdownOpen = signal(false);
  searchTerm = signal('');

  availableOptions = computed(() => {
    const selected = new Set(this.selectedKeys());
    return this.options().filter(option => option.selectable && !selected.has(option.key));
  });

  filteredOptions = computed(() => {
    const query = this.searchTerm().trim().toLocaleLowerCase('vi');
    if (!query) return this.availableOptions();
    return this.availableOptions().filter(option => formatMethodOptionLabel(option).toLocaleLowerCase('vi').includes(query));
  });

  limitReached = computed(() => this.selectedKeys().length >= this.max());

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.dropdownOpen() && !this.elementRef.nativeElement.contains(event.target as Node)) {
      this.closeDropdown();
    }
  }

  toggleDropdown(): void {
    if (this.disabled() || this.limitReached()) return;
    this.dropdownOpen.update(open => !open);
    if (!this.dropdownOpen()) this.searchTerm.set('');
  }

  closeDropdown(): void {
    this.dropdownOpen.set(false);
    this.searchTerm.set('');
  }

  addTag(key: string): void {
    if (!key || this.disabled() || this.limitReached() || this.selectedKeys().includes(key)) return;
    this.selectedKeysChange.emit([...this.selectedKeys(), key]);
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
