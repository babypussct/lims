import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-standards-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-2 border-b border-slate-50 dark:border-slate-700 flex flex-col gap-2 bg-slate-50/30 dark:bg-slate-800/50">
       <div class="flex flex-col md:flex-row gap-2">
           <div class="relative flex-1 group">
              <i class="fa-solid fa-search absolute left-2.5 top-2 text-slate-400 dark:text-slate-500 text-xs group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors"></i>
              <input type="text" [ngModel]="searchTerm()" (ngModelChange)="onSearchInput($event)" 
                     class="w-full pl-7 pr-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 transition shadow-sm dark:shadow-none placeholder-slate-400 dark:placeholder-slate-500"
                     placeholder="Tìm kiếm chuẩn, mã số, số lô... (Real-time)">
           </div>
           
           <!-- FILTER DROPDOWN -->
           <div class="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 shadow-sm dark:shadow-none h-[30px]">
               <span class="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase whitespace-nowrap"><i class="fa-solid fa-filter mr-1"></i> Lọc:</span>
               <select [ngModel]="activeWidgetFilter()" (ngModelChange)="onWidgetFilterChange($event)" 
                       class="bg-transparent text-[11px] font-bold text-slate-700 dark:text-slate-300 outline-none cursor-pointer border-none py-1 pr-1">
                   <option value="all" class="dark:bg-slate-800">Tất cả ({{stats().total}})</option>
                   <option value="expired" class="dark:bg-slate-800">Đã hết hạn ({{stats().expired}})</option>
                   <option value="expiring_soon" class="dark:bg-slate-800">Sắp hết hạn ({{stats().expiringSoon}})</option>
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
              <button (click)="onViewModeChange('list')" [class]="viewMode() === 'list' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm dark:shadow-none' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'" class="w-7 h-full flex items-center justify-center rounded transition" title="Dạng Danh sách">
                  <i class="fa-solid fa-list text-[11px]"></i>
              </button>
              <button (click)="onViewModeChange('grid')" [class]="viewMode() === 'grid' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm dark:shadow-none' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'" class="w-7 h-full flex items-center justify-center rounded transition" title="Dạng Lưới (Thẻ)">
                  <i class="fa-solid fa-border-all text-[11px]"></i>
              </button>
           </div>
       </div>
       
       <!-- Search Stats -->
       <div class="flex justify-between items-center px-1">
           <span class="text-[9px] font-bold text-slate-400 dark:text-slate-500">
               Hiển thị: {{visibleCount()}} / {{filteredCount()}} kết quả 
               @if(searchTerm()) { <span class="text-indigo-500 dark:text-indigo-400">(Lọc theo "{{searchTerm()}}")</span> }
           </span>
           @if(isLoading()) { <span class="text-[9px] text-blue-500 dark:text-blue-400 flex items-center gap-1"><i class="fa-solid fa-sync fa-spin"></i> Đang đồng bộ...</span> }
       </div>
    </div>
  `
})
export class StandardsFilterComponent {
  searchTerm = input<string>('');
  activeWidgetFilter = input<'all' | 'expired' | 'expiring_soon' | 'low_stock'>('all');
  sortOption = input<string>('received_desc');
  viewMode = input<'list' | 'grid'>('list');
  stats = input<{total: number, expired: number, expiringSoon: number, lowStock: number}>({total: 0, expired: 0, expiringSoon: 0, lowStock: 0});
  visibleCount = input<number>(0);
  filteredCount = input<number>(0);
  isLoading = input<boolean>(false);

  searchTermChange = output<string>();
  activeWidgetFilterChange = output<'all' | 'expired' | 'expiring_soon' | 'low_stock'>();
  sortOptionChange = output<string>();
  viewModeChange = output<'list' | 'grid'>();

  onSearchInput(val: string) {
    this.searchTermChange.emit(val);
  }

  onWidgetFilterChange(val: string) {
    this.activeWidgetFilterChange.emit(val as 'all' | 'expired' | 'expiring_soon' | 'low_stock');
  }

  onSortChange(val: string) {
    this.sortOptionChange.emit(val);
  }

  onViewModeChange(val: 'list' | 'grid') {
    this.viewModeChange.emit(val);
  }
}
