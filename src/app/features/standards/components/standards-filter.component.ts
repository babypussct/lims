import { Component, computed, HostListener, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StandardDeviceCode, StandardDeviceOption, StandardTagOption } from '../../../core/models/standard.model';
import { formatMethodOptionLabel, formatMethodOptionLabelCompact, formatStockSummary, StockSummaryResult } from '../services/standard-tag.utils';

@Component({
  selector: 'app-standards-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-2 border-b border-slate-50 dark:border-slate-700 flex flex-col gap-2 bg-slate-50/30 dark:bg-slate-800/50">
       <div class="flex flex-col md:flex-row gap-2">
           <div class="relative flex-1 group">
              <i class="fa-solid fa-search absolute left-2.5 top-2 text-slate-400 dark:text-slate-500 text-xs group-focus-within:text-fuchsia-500 dark:group-focus-within:text-fuchsia-400 transition-colors"></i>
              <input type="text" [ngModel]="searchTerm()" (ngModelChange)="onSearchInput($event)" 
                     class="w-full pl-7 pr-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:border-fuchsia-500 dark:focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/10 dark:focus:ring-fuchsia-500/20 transition shadow-sm dark:shadow-none placeholder-slate-400 dark:placeholder-slate-500"
                     placeholder="Tìm kiếm chuẩn, mã số, số lô... (Real-time)">
           </div>
           
           <!-- FILTER DROPDOWN -->
           <div class="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 shadow-sm dark:shadow-none h-[30px]">
               <span class="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase whitespace-nowrap"><i class="fa-solid fa-filter mr-1"></i> Lọc:</span>
               <select [ngModel]="activeWidgetFilter()" (ngModelChange)="onWidgetFilterChange($event)" 
                       class="bg-transparent text-[11px] font-bold text-slate-700 dark:text-slate-300 outline-none cursor-pointer border-none py-1 pr-1">
                   <option value="all" class="dark:bg-slate-800">Tất cả ({{stats().total}})</option>
                   <option value="expired" class="dark:bg-slate-800">Đã hết hạn ({{stats().expired}})</option>
                   <option value="expiring_soon" class="dark:bg-slate-800">Sắp hết hạn 30 ngày ({{stats().expiringSoon}})</option>
                   <option value="expiring_3months" class="dark:bg-slate-800">Sắp hết hạn 3 tháng tới ({{stats().expiring3Months}})</option>
                   <option value="low_stock" class="dark:bg-slate-800">Sắp hết hàng ({{stats().lowStock}})</option>
               </select>
           </div>
           
           <!-- SORT DROPDOWN -->
           <div class="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 shadow-sm dark:shadow-none h-[30px]">
               <span class="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase whitespace-nowrap"><i class="fa-solid fa-arrow-down-short-wide mr-1"></i> Sắp xếp:</span>
               <select [ngModel]="sortOption()" (ngModelChange)="onSortChange($event)" 
                       class="bg-transparent text-[11px] font-bold text-slate-700 dark:text-slate-300 outline-none cursor-pointer border-none py-1 pr-1">
                   <option value="received_desc" class="dark:bg-slate-800">Ngày nhận (Mới nhất)</option>
                   <option value="updated_desc" class="dark:bg-slate-800">Mới cập nhật</option>
                   <option value="name_asc" class="dark:bg-slate-800">Tên (A-Z)</option>
                   <option value="name_desc" class="dark:bg-slate-800">Tên (Z-A)</option>
                   <option value="expiry_asc" class="dark:bg-slate-800">Hạn dùng (Gần nhất)</option>
                   <option value="expiry_desc" class="dark:bg-slate-800">Hạn dùng (Xa nhất)</option>
               </select>
           </div>

           <div class="flex bg-slate-200/50 dark:bg-slate-700/50 p-0.5 rounded-lg shrink-0 h-[30px] self-start md:self-auto">
              <button (click)="onViewModeChange('list')" [class]="viewMode() === 'list' ? 'bg-white dark:bg-slate-800 text-fuchsia-600 dark:text-fuchsia-400 shadow-sm dark:shadow-none' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'" class="w-7 h-full flex items-center justify-center rounded transition" title="Dạng Danh sách">
                  <i class="fa-solid fa-list text-[11px]"></i>
              </button>
              <button (click)="onViewModeChange('grid')" [class]="viewMode() === 'grid' ? 'bg-white dark:bg-slate-800 text-fuchsia-600 dark:text-fuchsia-400 shadow-sm dark:shadow-none' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'" class="w-7 h-full flex items-center justify-center rounded transition" title="Dạng Lưới (Thẻ)">
                  <i class="fa-solid fa-border-all text-[11px]"></i>
              </button>
           </div>
       </div>

       <!-- METHOD FILTER: device is a facet used to navigate the method catalog, not a parallel data field. -->
       <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
           <div data-method-picker class="relative min-w-0 sm:w-[340px] md:w-[420px]">
               <button
                   type="button"
                   (click)="toggleMethodPicker($event)"
                   [attr.aria-expanded]="methodPickerOpen()"
                   aria-haspopup="dialog"
                   class="flex h-[34px] w-full min-w-0 items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 text-left shadow-sm dark:shadow-none transition hover:border-fuchsia-300 dark:hover:border-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20"
               >
                   <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-fuchsia-50 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400">
                       <i class="fa-solid fa-flask-vial text-[10px]"></i>
                   </span>
                   <span class="min-w-0 flex-1">
                       <span class="block text-[8px] font-black uppercase tracking-wide text-slate-400 dark:text-slate-500">Phương pháp phân tích</span>
                       <span class="block truncate text-[11px] font-black text-slate-700 dark:text-slate-200" [title]="selectedMethodTitle()">{{methodTriggerText()}}</span>
                   </span>
                   <span class="shrink-0 text-[9px] font-bold text-slate-400">{{filteredMethodOptions().length}}/{{tagOptions().length}}</span>
                   <i class="fa-solid fa-chevron-down shrink-0 text-[9px] text-slate-400 transition-transform" [class.rotate-180]="methodPickerOpen()"></i>
               </button>

               @if (methodPickerOpen()) {
                   <div
                       role="dialog"
                       aria-label="Chọn phương pháp phân tích"
                       class="absolute left-0 top-full z-50 mt-1.5 w-[min(720px,calc(100vw-24px))] overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl"
                       (click)="$event.stopPropagation()"
                   >
                       <div class="border-b border-slate-100 dark:border-slate-800 px-3 py-2.5">
                           <div class="flex items-start justify-between gap-3">
                               <div>
                                   <div class="text-xs font-black text-slate-800 dark:text-slate-100">Phương pháp phân tích</div>
                                   <div class="mt-0.5 text-[10px] font-medium text-slate-400 dark:text-slate-500">Kỹ thuật chỉ dùng để thu hẹp danh mục phương pháp; chuẩn vẫn được lọc theo phương pháp đã gắn.</div>
                               </div>
                               <button type="button" (click)="closeMethodPicker()" class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200" aria-label="Đóng">
                                   <i class="fa-solid fa-xmark text-xs"></i>
                               </button>
                           </div>
                       </div>

                       <div class="border-b border-slate-100 dark:border-slate-800 px-3 py-2.5">
                           <div class="mb-1.5 flex items-center justify-between gap-2">
                               <span class="text-[9px] font-black uppercase tracking-wide text-slate-400 dark:text-slate-500">Kỹ thuật / nhóm phương pháp</span>
                               @if (deviceFilter() !== 'all') {
                                   <span class="text-[9px] font-bold text-fuchsia-500 dark:text-fuchsia-400">{{filteredMethodOptions().length}} phương pháp phù hợp</span>
                               }
                           </div>
                           <div class="flex gap-1.5 overflow-x-auto pb-1 custom-scrollbar sm:flex-wrap sm:overflow-visible sm:pb-0">
                               <button
                                   type="button"
                                   (click)="selectDeviceFacet('all')"
                                   [ngClass]="deviceFilter() === 'all' ? 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700 dark:border-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-300' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-slate-600'"
                                   class="shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-black transition"
                               >Tất cả <span class="ml-1 opacity-60">{{tagOptions().length}}</span></button>
                               @for (device of visibleDeviceOptions(); track device.code) {
                                   <button
                                       type="button"
                                       (click)="selectDeviceFacet(device.code)"
                                       [ngClass]="deviceFilter() === device.code ? 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700 dark:border-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-300' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-slate-600'"
                                       class="shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-black transition"
                                   >{{device.label}} <span class="ml-1 opacity-60">{{deviceMethodCount(device.code)}}</span></button>
                               }
                           </div>
                       </div>

                       <div class="border-b border-slate-100 dark:border-slate-800 p-2.5">
                           <div class="relative">
                               <i class="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400"></i>
                               <input
                                   type="text"
                                   [ngModel]="methodSearch()"
                                   (ngModelChange)="methodSearch.set($event)"
                                   class="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-2 pl-8 pr-3 text-xs font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-500/20"
                                   placeholder="Tìm mã, tên phương pháp hoặc kỹ thuật..."
                               >
                           </div>
                       </div>

                       <div class="max-h-72 overflow-y-auto p-1.5 custom-scrollbar">
                           @for (option of filteredMethodOptions(); track option.key) {
                               <button
                                   type="button"
                                   (click)="selectMethod(option.key)"
                                   [ngClass]="methodTagFilter() === option.key ? 'bg-fuchsia-50 dark:bg-fuchsia-900/25' : ''"
                                   class="flex w-full min-w-0 items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/70"
                               >
                                   <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-slate-200 dark:border-slate-700 text-[9px] text-slate-400">
                                       @if (methodTagFilter() === option.key) { <i class="fa-solid fa-check text-fuchsia-500"></i> }
                                       @else { <i class="fa-solid fa-flask text-[8px]"></i> }
                                   </span>
                                   <span class="min-w-0 flex-1">
                                       <span class="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                                           <span class="text-[11px] font-black text-slate-800 dark:text-slate-100">{{methodCode(option)}}</span>
                                           @if (methodDeviceText(option)) {
                                               <span class="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[8px] font-black text-slate-500 dark:text-slate-400">{{methodDeviceText(option)}}</span>
                                           }
                                       </span>
                                       @if (methodName(option)) {
                                           <span class="mt-0.5 block text-[10px] font-medium leading-snug text-slate-500 dark:text-slate-400">{{methodName(option)}}</span>
                                       }
                                   </span>
                               </button>
                           } @empty {
                               <div class="px-3 py-8 text-center">
                                   <i class="fa-solid fa-filter-circle-xmark mb-2 text-lg text-slate-300 dark:text-slate-600"></i>
                                   <div class="text-xs font-bold text-slate-500 dark:text-slate-400">Không có phương pháp phù hợp.</div>
                                   <button type="button" (click)="resetMethodDiscovery()" class="mt-2 text-[10px] font-black text-fuchsia-600 dark:text-fuchsia-400 hover:underline">Xóa tìm kiếm và kỹ thuật</button>
                               </div>
                           }
                       </div>
                   </div>
               }
           </div>

           @if (methodTagFilter()) {
               <span class="inline-flex min-w-0 max-w-full items-center gap-1.5 self-start rounded-full border border-fuchsia-100 dark:border-fuchsia-800 bg-fuchsia-50 dark:bg-fuchsia-900/25 px-2.5 py-1 text-[10px] font-black text-fuchsia-700 dark:text-fuchsia-300 sm:self-auto" [title]="selectedMethodTitle()">
                   <i class="fa-solid fa-flask-vial text-[9px]"></i>
                   <span class="max-w-[320px] truncate">{{selectedMethodChipText()}}</span>
                   <button type="button" (click)="clearMethodFilter()" class="ml-0.5 text-fuchsia-400 hover:text-rose-500" aria-label="Bỏ lọc phương pháp"><i class="fa-solid fa-xmark"></i></button>
               </span>
           } @else if (deviceFilter() !== 'all') {
               <span class="inline-flex items-center gap-1.5 self-start rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100/80 dark:bg-slate-800 px-2.5 py-1 text-[10px] font-black text-slate-600 dark:text-slate-300 sm:self-auto">
                   <i class="fa-solid fa-layer-group text-[9px]"></i>
                   {{selectedDeviceLabel()}} · {{filteredMethodOptions().length}} phương pháp
                   <button type="button" (click)="selectDeviceFacet('all')" class="ml-0.5 text-slate-400 hover:text-rose-500" aria-label="Bỏ lọc kỹ thuật"><i class="fa-solid fa-xmark"></i></button>
               </span>
           }

           @if (hasTagFilters()) {
               <button type="button" (click)="clearTagFilters()" class="self-start px-1.5 py-1 text-[10px] font-black text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 sm:self-auto">
                   Xóa bộ lọc
               </button>
           }
       </div>
       
       <!-- Search Stats -->
       <div class="flex justify-between items-center px-1">
           <span class="text-[9px] font-bold text-slate-400 dark:text-slate-500">
               Hiển thị: {{visibleCount()}} / {{filteredCount()}} kết quả 
               @if(searchTerm()) { <span class="text-fuchsia-500 dark:text-fuchsia-400">(Lọc theo "{{searchTerm()}}")</span> }
           </span>
           <span class="text-[10px] font-black text-fuchsia-600 dark:text-fuchsia-300 text-right" title="Tồn kho được cộng riêng theo từng đơn vị, không quy đổi chéo">
               Tồn: {{stockSummaryText()}}
           </span>
           @if(isLoading()) { <span class="text-[9px] text-blue-500 dark:text-blue-400 flex items-center gap-1"><i class="fa-solid fa-sync fa-spin"></i> Đang đồng bộ...</span> }
       </div>
    </div>
  `
})
export class StandardsFilterComponent {
  searchTerm = input<string>('');
  activeWidgetFilter = input<'all' | 'expired' | 'expiring_soon' | 'expiring_3months' | 'low_stock'>('all');
  sortOption = input<string>('received_desc');
  viewMode = input<'list' | 'grid'>('list');
  stats = input<{total: number, expired: number, expiringSoon: number, expiring3Months: number, lowStock: number}>({total: 0, expired: 0, expiringSoon: 0, expiring3Months: 0, lowStock: 0});
  visibleCount = input<number>(0);
  filteredCount = input<number>(0);
  isLoading = input<boolean>(false);
  tagOptions = input<StandardTagOption[]>([]);
  methodTagFilter = input<string | null>(null);
  deviceOptions = input<readonly StandardDeviceOption[]>([]);
  deviceFilter = input<StandardDeviceCode | 'all'>('all');
  stockSummary = input<StockSummaryResult>({ totalContainers: 0, byUnit: [] });
  stockSummaryText = computed(() => formatStockSummary(this.stockSummary()));
  hasTagFilters = computed(() => !!this.methodTagFilter() || this.deviceFilter() !== 'all');
  methodPickerOpen = signal(false);
  methodSearch = signal('');

  deviceMethodCounts = computed(() => {
    const counts = new Map<StandardDeviceCode, number>();
    for (const option of this.tagOptions()) {
      for (const code of new Set(option.deviceCodes || [])) {
        counts.set(code, (counts.get(code) || 0) + 1);
      }
    }
    return counts;
  });

  visibleDeviceOptions = computed(() => this.deviceOptions().filter(option => this.deviceMethodCount(option.code) > 0));

  filteredMethodOptions = computed(() => {
    const device = this.deviceFilter();
    const query = this.normalizeSearch(this.methodSearch());
    return this.tagOptions().filter(option => {
      if (device !== 'all' && !(option.deviceCodes || []).includes(device)) return false;
      if (!query) return true;
      const haystack = this.normalizeSearch([
        option.methodCode,
        option.label,
        option.methodName,
        option.description,
        ...(option.deviceCodes || []),
      ].filter(Boolean).join(' '));
      return haystack.includes(query);
    });
  });

  selectedMethod = computed(() => this.tagOptions().find(option => option.key === this.methodTagFilter()) || null);
  selectedDevice = computed(() => this.deviceOptions().find(option => option.code === this.deviceFilter()) || null);

  searchTermChange = output<string>();
  activeWidgetFilterChange = output<'all' | 'expired' | 'expiring_soon' | 'expiring_3months' | 'low_stock'>();
  sortOptionChange = output<string>();
  viewModeChange = output<'list' | 'grid'>();
  methodTagFilterChange = output<string | null>();
  deviceFilterChange = output<StandardDeviceCode | 'all'>();

  selectedMethodTitle(): string {
    const selected = this.selectedMethod();
    return selected ? formatMethodOptionLabel(selected) : 'Tất cả phương pháp';
  }

  methodTriggerText(): string {
    const selected = this.selectedMethod();
    if (selected) return formatMethodOptionLabelCompact(selected);
    const device = this.selectedDevice();
    return device ? `${device.label} · ${this.filteredMethodOptions().length} phương pháp` : 'Tất cả phương pháp';
  }

  selectedMethodChipText(): string {
    const selected = this.selectedMethod();
    return selected ? formatMethodOptionLabelCompact(selected) : 'Phương pháp';
  }

  selectedDeviceLabel(): string {
    return this.selectedDevice()?.label || 'Tất cả kỹ thuật';
  }

  methodCode(option: StandardTagOption): string {
    return option.methodCode?.trim() || option.label;
  }

  methodName(option: StandardTagOption): string {
    return option.methodName?.trim() || option.description?.trim() || '';
  }

  methodDeviceText(option: StandardTagOption): string {
    return [...new Set(option.deviceCodes || [])]
      .map(code => this.deviceOptions().find(device => device.code === code)?.label || code)
      .join(', ');
  }

  deviceMethodCount(code: StandardDeviceCode): number {
    return this.deviceMethodCounts().get(code) || 0;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as Element | null;
    if (this.methodPickerOpen() && !target?.closest('[data-method-picker]')) {
      this.closeMethodPicker();
    }
  }

  toggleMethodPicker(event: MouseEvent): void {
    event.stopPropagation();
    this.methodPickerOpen.update(open => !open);
    if (!this.methodPickerOpen()) this.methodSearch.set('');
  }

  closeMethodPicker(): void {
    this.methodPickerOpen.set(false);
    this.methodSearch.set('');
  }

  selectDeviceFacet(device: StandardDeviceCode | 'all'): void {
    // Changing the discovery facet invalidates an exact method selection.
    if (this.methodTagFilter()) this.methodTagFilterChange.emit(null);
    this.deviceFilterChange.emit(device);
    this.methodSearch.set('');
  }

  selectMethod(key: string): void {
    this.methodTagFilterChange.emit(key);
    this.closeMethodPicker();
  }

  clearMethodFilter(): void {
    this.methodTagFilterChange.emit(null);
  }

  resetMethodDiscovery(): void {
    this.methodSearch.set('');
    if (this.methodTagFilter()) this.methodTagFilterChange.emit(null);
    this.deviceFilterChange.emit('all');
  }

  clearTagFilters(): void {
    this.methodTagFilterChange.emit(null);
    this.deviceFilterChange.emit('all');
    this.methodSearch.set('');
  }

  private normalizeSearch(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  onSearchInput(val: string) {
    this.searchTermChange.emit(val);
  }

  onWidgetFilterChange(val: string) {
    this.activeWidgetFilterChange.emit(val as 'all' | 'expired' | 'expiring_soon' | 'expiring_3months' | 'low_stock');
  }

  onSortChange(val: string) {
    this.sortOptionChange.emit(val);
  }

  onViewModeChange(val: 'list' | 'grid') {
    this.viewModeChange.emit(val);
  }
}
