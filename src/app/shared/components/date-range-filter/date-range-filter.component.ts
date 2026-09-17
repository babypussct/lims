
import { Component, signal, output, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { normalizeManualDateRange } from '../../utils/date-range';
import { addCalendarDate, getDaysInMonth, getTodayIso, getWeekday, parseIsoDateParts } from '../../utils/date-only';
import { AppDatePickerComponent } from '../ui/date-picker/date-picker.component';

export type DateRangePreset = 'all' | 'today' | 'yesterday' | 'this_week' | 'last_week' | 'this_month' | 'last_month' | 'this_quarter' | 'this_year' | 'custom';

function getCurrentWeekStart(todayIso: string): string {
    const parts = parseIsoDateParts(todayIso);
    if (!parts) return todayIso;

    const sundayFirstDay = getWeekday(parts.year, parts.month, parts.day);
    const daysSinceMonday = (sundayFirstDay + 6) % 7;
    return addCalendarDate(todayIso, -daysSinceMonday, 'day');
}

@Component({
  selector: 'app-date-range-filter',
  standalone: true,
  imports: [CommonModule, AppDatePickerComponent],
  template: `
    <div [class]="'flex w-full sm:w-auto min-w-0 flex-col sm:flex-row gap-2 items-start sm:items-center rounded-xl relative group/filter ' + containerClass()">
        
        <!-- Preset Dropdown -->
        <div class="relative">
            <button (click)="toggleDropdown($event)" 
                    class="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition border border-slate-200 dark:border-slate-700 min-w-[140px] justify-between active:scale-95">
                <span class="flex items-center gap-2">
                    <i class="fa-solid fa-calendar-day text-fuchsia-500"></i>
                    {{ currentLabel() }}
                </span>
                <i class="fa-solid fa-chevron-down text-[10px] text-slate-400 transition-transform duration-200" [class.rotate-180]="isOpen()"></i>
            </button>

            <!-- Dropdown Menu -->
            @if (isOpen()) {
                <div class="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 py-1 z-50 animate-fade-in overflow-hidden">
                    <div class="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-900/50 border-b border-slate-50 dark:border-slate-700">Chọn nhanh</div>
                    
                    <button (click)="selectPreset('all')" class="w-full text-left px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/30 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition flex justify-between items-center group">
                        <span>Tất Cả Thời Gian</span>
                        @if(activePreset() === 'all') { <i class="fa-solid fa-check text-fuchsia-600 dark:text-fuchsia-400"></i> }
                    </button>
                    
                    <div class="h-px bg-slate-100 dark:bg-slate-700 my-1 mx-2"></div>
                    
                    <button (click)="selectPreset('today')" class="w-full text-left px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/30 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition flex justify-between items-center group">
                        <span>Hôm Nay</span>
                        @if(activePreset() === 'today') { <i class="fa-solid fa-check text-fuchsia-600 dark:text-fuchsia-400"></i> }
                    </button>
                    <button (click)="selectPreset('yesterday')" class="w-full text-left px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/30 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition flex justify-between items-center">
                        <span>Hôm qua</span>
                        @if(activePreset() === 'yesterday') { <i class="fa-solid fa-check text-fuchsia-600 dark:text-fuchsia-400"></i> }
                    </button>
                    
                    <div class="h-px bg-slate-100 dark:bg-slate-700 my-1 mx-2"></div>
                    
                    <button (click)="selectPreset('this_week')" class="w-full text-left px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/30 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition flex justify-between items-center">
                        <span>Tuần Này</span>
                        @if(activePreset() === 'this_week') { <i class="fa-solid fa-check text-fuchsia-600 dark:text-fuchsia-400"></i> }
                    </button>
                    <button (click)="selectPreset('last_week')" class="w-full text-left px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/30 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition flex justify-between items-center">
                        <span>Tuần Trước</span>
                        @if(activePreset() === 'last_week') { <i class="fa-solid fa-check text-fuchsia-600 dark:text-fuchsia-400"></i> }
                    </button>
                    
                    <div class="h-px bg-slate-100 dark:bg-slate-700 my-1 mx-2"></div>
 
                    <button (click)="selectPreset('this_month')" class="w-full text-left px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/30 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition flex justify-between items-center">
                        <span>Tháng Này</span>
                        @if(activePreset() === 'this_month') { <i class="fa-solid fa-check text-fuchsia-600 dark:text-fuchsia-400"></i> }
                    </button>
                    <button (click)="selectPreset('last_month')" class="w-full text-left px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/30 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition flex justify-between items-center">
                        <span>Tháng Trước</span>
                        @if(activePreset() === 'last_month') { <i class="fa-solid fa-check text-fuchsia-600 dark:text-fuchsia-400"></i> }
                    </button>
                    
                    <div class="h-px bg-slate-100 dark:bg-slate-700 my-1 mx-2"></div>
 
                    <button (click)="selectPreset('this_quarter')" class="w-full text-left px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/30 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition flex justify-between items-center">
                        <span>Quý Này</span>
                        @if(activePreset() === 'this_quarter') { <i class="fa-solid fa-check text-fuchsia-600 dark:text-fuchsia-400"></i> }
                    </button>
                    <button (click)="selectPreset('this_year')" class="w-full text-left px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/30 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition flex justify-between items-center">
                        <span>Năm Nay</span>
                        @if(activePreset() === 'this_year') { <i class="fa-solid fa-check text-fuchsia-600 dark:text-fuchsia-400"></i> }
                    </button>
                </div>
                
                <!-- Overlay to close dropdown -->
                <div class="fixed inset-0 z-40 bg-transparent" (click)="isOpen.set(false)"></div>
            }
        </div>
 
        <!-- Date Inputs using AppDatePickerComponent -->
        <div class="flex w-full sm:w-auto min-w-0 flex-col sm:flex-row items-stretch sm:items-center gap-1.5 bg-slate-50 dark:bg-slate-900/50 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
            <div class="w-full min-w-0 sm:min-w-[136px] sm:flex-1 sm:flex-none sm:w-36">
                <app-date-picker
                    size="sm"
                    align="left"
                    placeholder="Từ ngày"
                    ariaLabel="Từ ngày"
                    [value]="startDate()"
                    (valueChange)="onManualDateChange('start', $event)"
                />
            </div>
            <div class="shrink-0 self-center py-0.5 text-slate-300 dark:text-slate-600 rotate-90 sm:rotate-0"><i class="fa-solid fa-arrow-right text-[10px]"></i></div>
            <div class="w-full min-w-0 sm:min-w-[136px] sm:flex-1 sm:flex-none sm:w-36">
                <app-date-picker
                    size="sm"
                    align="right"
                    placeholder="Đến ngày"
                    ariaLabel="Đến ngày"
                    [value]="endDate()"
                    (valueChange)="onManualDateChange('end', $event)"
                />
            </div>
        </div>
    </div>
  `
})
export class DateRangeFilterComponent {
  // Inputs/Outputs
  initStart = input<string>(''); 
  initEnd = input<string>('');
  containerClass = input<string>('bg-white dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 shadow-sm');
  dateChange = output<{ start: string, end: string, label: string }>();

  // State
  startDate = signal('');
  endDate = signal('');
  activePreset = signal<DateRangePreset>('all');
  currentLabel = signal('Tất cả thời gian');
  isOpen = signal(false);

  private hasEmittedInit = false;

  constructor() {
      // On first run: set dates from inputs, detect which preset they match,
      // then emit immediately so the parent is always in sync from the start.
      effect(() => {
          const s = this.initStart();
          const e = this.initEnd();

          this.startDate.set(s);
          this.endDate.set(e);

          // Detect preset from supplied dates so the label is accurate
          const detectedPreset = this.detectPreset(s, e);
          this.activePreset.set(detectedPreset.preset);
          this.currentLabel.set(detectedPreset.label);

          // Emit once so the parent's signals are immediately correct
          if (!this.hasEmittedInit) {
              this.hasEmittedInit = true;
              // Use setTimeout to emit AFTER Angular has finished the current change-detection cycle
              setTimeout(() => this.emitChange(), 0);
          }
      });
  }

  /** Inspect a start/end date pair and return the matching preset + label */
  private detectPreset(start: string, end: string): { preset: DateRangePreset, label: string } {
      if (!start && !end) return { preset: 'all', label: 'Tất cả thời gian' };

      const todayStr = getTodayIso();
      const yesterdayStr = addCalendarDate(todayStr, -1, 'day');
      const todayParts = parseIsoDateParts(todayStr)!;

      const monthStart = `${todayParts.year}-${String(todayParts.month).padStart(2, '0')}-01`;
      const prevMonthParts = todayParts.month === 1
        ? { year: todayParts.year - 1, month: 12 }
        : { year: todayParts.year, month: todayParts.month - 1 };
      const lastMonthStart = `${prevMonthParts.year}-${String(prevMonthParts.month).padStart(2, '0')}-01`;
      const lastMonthEnd = `${prevMonthParts.year}-${String(prevMonthParts.month).padStart(2, '0')}-${String(getDaysInMonth(prevMonthParts.year, prevMonthParts.month)).padStart(2, '0')}`;
      const yearStart = `${todayParts.year}-01-01`;

      const weekStartStr = getCurrentWeekStart(todayStr);
      const weekEndStr = todayStr;

      if (start === todayStr && end === todayStr) return { preset: 'today', label: 'Hôm nay' };
      if (start === yesterdayStr && end === yesterdayStr) return { preset: 'yesterday', label: 'Hôm qua' };
      if (start === weekStartStr && end === weekEndStr) return { preset: 'this_week', label: 'Tuần này' };
      if (start === monthStart && end === todayStr) return { preset: 'this_month', label: 'Tháng này' };
      if (start === lastMonthStart && end === lastMonthEnd) return { preset: 'last_month', label: 'Tháng trước' };
      if (start === yearStart && end === todayStr) return { preset: 'this_year', label: 'Năm nay' };
      return { preset: 'custom', label: 'Tùy chỉnh' };
  }

  toggleDropdown(e: Event) {
      e.stopPropagation();
      this.isOpen.update(v => !v);
  }

  onManualDateChange(type: 'start' | 'end', value: string) {
      const normalized = normalizeManualDateRange(
          type,
          value,
          this.startDate(),
          this.endDate()
      );
      this.startDate.set(normalized.start);
      this.endDate.set(normalized.end);
      
      this.activePreset.set('custom');
      this.currentLabel.set('Tùy chỉnh');
      this.emitChange();
  }

  selectPreset(preset: DateRangePreset) {
      this.activePreset.set(preset);
      this.isOpen.set(false);
      
      if (preset === 'all') {
          this.currentLabel.set('Tất cả thời gian');
          this.startDate.set('');
          this.endDate.set('');
          this.emitChange();
          return;
      }
      
      const todayStr = getTodayIso();
      const todayParts = parseIsoDateParts(todayStr)!;
      let start = todayStr;
      let end = todayStr;
      let label = '';

      switch (preset) {
          case 'today':
              label = 'Hôm nay';
              start = todayStr;
              end = todayStr;
              break;
          
          case 'yesterday':
              label = 'Hôm qua';
              start = addCalendarDate(todayStr, -1, 'day');
              end = start;
              break;

          case 'this_week': {
              label = 'Tuần này';
              start = getCurrentWeekStart(todayStr);
              end = todayStr;
              break;
          }

          case 'last_week': {
              label = 'Tuần trước';
              start = addCalendarDate(getCurrentWeekStart(todayStr), -7, 'day');
              end = addCalendarDate(start, 6, 'day');
              break;
          }

          case 'this_month':
              label = 'Tháng này';
              start = `${todayParts.year}-${String(todayParts.month).padStart(2, '0')}-01`;
              end = todayStr;
              break;

          case 'last_month': {
              label = 'Tháng trước';
              const prevMonthParts = todayParts.month === 1
                ? { year: todayParts.year - 1, month: 12 }
                : { year: todayParts.year, month: todayParts.month - 1 };
              start = `${prevMonthParts.year}-${String(prevMonthParts.month).padStart(2, '0')}-01`;
              end = `${prevMonthParts.year}-${String(prevMonthParts.month).padStart(2, '0')}-${String(getDaysInMonth(prevMonthParts.year, prevMonthParts.month)).padStart(2, '0')}`;
              break;
          }
          
          case 'this_quarter': {
              label = 'Quý này';
              const q = Math.floor((todayParts.month + 2) / 3);
              const quarterStartMonth = (q - 1) * 3 + 1;
              start = `${todayParts.year}-${String(quarterStartMonth).padStart(2, '0')}-01`;
              end = todayStr;
              break;
          }

          case 'this_year':
              label = 'Năm nay';
              start = `${todayParts.year}-01-01`;
              end = todayStr;
              break;
      }

      this.currentLabel.set(label);
      this.startDate.set(start);
      this.endDate.set(end);
      this.emitChange();
  }

  private emitChange() {
      this.dateChange.emit({
          start: this.startDate(),
          end: this.endDate(),
          label: this.currentLabel()
      });
  }
}
