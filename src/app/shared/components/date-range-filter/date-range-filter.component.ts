
import { Component, signal, output, input, effect, ElementRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type DateRangePreset = 'today' | 'yesterday' | 'this_week' | 'last_week' | 'this_month' | 'last_month' | 'this_quarter' | 'this_year' | 'custom';

@Component({
  selector: 'app-date-range-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col sm:flex-row gap-2 items-start sm:items-center bg-white p-1 rounded-xl border border-slate-200 shadow-sm relative group/filter">
        
        <!-- Preset Dropdown -->
        <div class="relative">
            <button (click)="toggleDropdown($event)" 
                    class="flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold transition border border-slate-200 min-w-[140px] justify-between active:scale-95">
                <span class="flex items-center gap-2">
                    <i class="fa-solid fa-calendar-day text-blue-500"></i>
                    {{ currentLabel() }}
                </span>
                <i class="fa-solid fa-chevron-down text-[10px] text-slate-400 transition-transform duration-200" [class.rotate-180]="isOpen()"></i>
            </button>

            <!-- Dropdown Menu -->
            @if (isOpen()) {
                <div class="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50 animate-fade-in overflow-hidden">
                    <div class="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-50">Chọn nhanh</div>
                    
                    <button (click)="selectPreset('today')" class="w-full text-left px-4 py-2 text-xs font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition flex justify-between items-center group">
                        <span>Hôm nay</span>
                        @if(activePreset() === 'today') { <i class="fa-solid fa-check text-blue-600"></i> }
                    </button>
                    <button (click)="selectPreset('yesterday')" class="w-full text-left px-4 py-2 text-xs font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition flex justify-between items-center">
                        <span>Hôm qua</span>
                        @if(activePreset() === 'yesterday') { <i class="fa-solid fa-check text-blue-600"></i> }
                    </button>
                    
                    <div class="h-px bg-slate-100 my-1 mx-2"></div>
                    
                    <button (click)="selectPreset('this_week')" class="w-full text-left px-4 py-2 text-xs font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition flex justify-between items-center">
                        <span>Tuần này</span>
                        @if(activePreset() === 'this_week') { <i class="fa-solid fa-check text-blue-600"></i> }
                    </button>
                    <button (click)="selectPreset('last_week')" class="w-full text-left px-4 py-2 text-xs font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition flex justify-between items-center">
                        <span>Tuần trước</span>
                        @if(activePreset() === 'last_week') { <i class="fa-solid fa-check text-blue-600"></i> }
                    </button>
                    
                    <div class="h-px bg-slate-100 my-1 mx-2"></div>

                    <button (click)="selectPreset('this_month')" class="w-full text-left px-4 py-2 text-xs font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition flex justify-between items-center">
                        <span>Tháng này</span>
                        @if(activePreset() === 'this_month') { <i class="fa-solid fa-check text-blue-600"></i> }
                    </button>
                    <button (click)="selectPreset('last_month')" class="w-full text-left px-4 py-2 text-xs font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition flex justify-between items-center">
                        <span>Tháng trước</span>
                        @if(activePreset() === 'last_month') { <i class="fa-solid fa-check text-blue-600"></i> }
                    </button>
                    
                    <div class="h-px bg-slate-100 my-1 mx-2"></div>

                    <button (click)="selectPreset('this_quarter')" class="w-full text-left px-4 py-2 text-xs font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition flex justify-between items-center">
                        <span>Quý này</span>
                        @if(activePreset() === 'this_quarter') { <i class="fa-solid fa-check text-blue-600"></i> }
                    </button>
                    <button (click)="selectPreset('this_year')" class="w-full text-left px-4 py-2 text-xs font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition flex justify-between items-center">
                        <span>Năm nay</span>
                        @if(activePreset() === 'this_year') { <i class="fa-solid fa-check text-blue-600"></i> }
                    </button>
                </div>
                
                <!-- Overlay to close dropdown -->
                <div class="fixed inset-0 z-40 bg-transparent" (click)="isOpen.set(false)"></div>
            }
        </div>

        <!-- Date Inputs -->
        <div class="flex items-center gap-2 bg-slate-50 rounded-lg px-2 py-1 border border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <div class="flex flex-col">
                <label class="text-[8px] font-bold text-slate-400 uppercase leading-none">Từ ngày</label>
                <input type="date" [ngModel]="startDate()" (ngModelChange)="onManualDateChange('start', $event)" 
                       class="bg-transparent border-none p-0 text-xs font-bold text-slate-700 outline-none w-24 h-5 cursor-pointer">
            </div>
            <div class="text-slate-300"><i class="fa-solid fa-arrow-right text-[10px]"></i></div>
            <div class="flex flex-col">
                <label class="text-[8px] font-bold text-slate-400 uppercase leading-none">Đến ngày</label>
                <input type="date" [ngModel]="endDate()" (ngModelChange)="onManualDateChange('end', $event)"
                       class="bg-transparent border-none p-0 text-xs font-bold text-slate-700 outline-none w-24 h-5 cursor-pointer">
            </div>
        </div>
    </div>
  `
})
export class DateRangeFilterComponent {
  // Inputs/Outputs
  initStart = input<string>(''); 
  initEnd = input<string>('');
  dateChange = output<{ start: string, end: string, label: string }>();

  // State - Changed default to 'today'
  startDate = signal('');
  endDate = signal('');
  activePreset = signal<DateRangePreset>('today');
  currentLabel = signal('Hôm nay');
  isOpen = signal(false);

  constructor() {
      // Init from inputs if provided
      effect(() => {
          if(this.initStart()) this.startDate.set(this.initStart());
          if(this.initEnd()) this.endDate.set(this.initEnd());
      }, { allowSignalWrites: true });
  }

  toggleDropdown(e: Event) {
      e.stopPropagation();
      this.isOpen.update(v => !v);
  }

  onManualDateChange(type: 'start' | 'end', value: string) {
      if (type === 'start') this.startDate.set(value);
      else this.endDate.set(value);
      
      this.activePreset.set('custom');
      this.currentLabel.set('Tùy chỉnh');
      this.emitChange();
  }

  selectPreset(preset: DateRangePreset) {
      this.activePreset.set(preset);
      this.isOpen.set(false);
      
      const today = new Date();
      let start = new Date();
      let end = new Date();
      let label = '';

      // Helper: To Local YYYY-MM-DD string
      const toStr = (d: Date) => {
          const offset = d.getTimezoneOffset();
          const local = new Date(d.getTime() - (offset * 60 * 1000));
          return local.toISOString().split('T')[0];
      };

      switch (preset) {
          case 'today':
              label = 'Hôm nay';
              // start/end already now
              break;
          
          case 'yesterday':
              label = 'Hôm qua';
              start.setDate(today.getDate() - 1);
              end.setDate(today.getDate() - 1);
              break;

          case 'this_week':
              label = 'Tuần này';
              // Monday is 1, Sunday is 0. 
              const day = today.getDay(); 
              const diffToMon = today.getDate() - day + (day === 0 ? -6 : 1);
              start.setDate(diffToMon);
              // End is today
              break;

          case 'last_week':
              label = 'Tuần trước';
              const currentDay = today.getDay();
              const diffToLastMon = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1) - 7;
              start.setDate(diffToLastMon);
              end = new Date(start);
              end.setDate(start.getDate() + 6);
              break;

          case 'this_month':
              label = 'Tháng này';
              start = new Date(today.getFullYear(), today.getMonth(), 1);
              break;

          case 'last_month':
              label = 'Tháng trước';
              start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
              end = new Date(today.getFullYear(), today.getMonth(), 0); 
              break;
          
          case 'this_quarter':
              label = 'Quý này';
              const q = Math.floor((today.getMonth() + 3) / 3);
              start = new Date(today.getFullYear(), (q - 1) * 3, 1);
              break;

          case 'this_year':
              label = 'Năm nay';
              start = new Date(today.getFullYear(), 0, 1);
              break;
      }

      this.currentLabel.set(label);
      this.startDate.set(toStr(start));
      this.endDate.set(toStr(end));
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
