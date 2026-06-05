import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sop-calibration-points',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-3">
      <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-3 uppercase tracking-widest">{{ title }}</label>
      
      <!-- Layout 1: Fixed labels and IS concentration (SOP-01 style) -->
      <div *ngIf="pointLabels.length > 0" class="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        @for (pt of calibPoints; track $index) {
          <div [class]="'bg-white dark:bg-slate-900 border-t-4 ' + 
            ($index === 0 ? 'border-t-slate-400/80 border-slate-200 dark:border-slate-800/80' : 
             ($index === 1 ? 'border-t-emerald-500 border-slate-200 dark:border-slate-800/80' : 
              ($index === 2 ? 'border-t-teal-500 border-slate-200 dark:border-slate-800/80' : 
               ($index === 3 ? 'border-t-indigo-500 border-slate-200 dark:border-slate-800/80' : 'border-t-purple-500 border-slate-200 dark:border-slate-800/80')))) + 
            ' rounded-2xl p-3 text-center shadow-sm hover:shadow-md transition duration-200'"
            style="content-visibility: auto;">
            <span [class]="'inline-flex items-center justify-center px-2 py-0.5 rounded text-[9px] font-black mb-1.5 uppercase ' +
              ($index === 0 ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400' : 
               ($index === 1 ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' : 
                ($index === 2 ? 'bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400' : 
                 ($index === 3 ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400' : 'bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400'))))">
              {{ pointPrefix }}{{ $index }}
            </span>
            <div class="text-[12px] font-black text-slate-850 dark:text-slate-100 my-0.5">
              {{ pointLabels[$index] }}
            </div>
            <div *ngIf="isSuffixVisible" class="text-[9px] font-bold text-slate-400 dark:text-slate-500 mb-2">{{ suffixText }}</div>
            <input type="text" 
                   [(ngModel)]="pt['loSo']" 
                   (ngModelChange)="onPointsChanged()"
                   (focus)="$any($event.target).select()"
                   placeholder="Vial..."
                   [class]="'w-full text-center bg-slate-50 dark:bg-slate-955 border border-slate-200/80 dark:border-slate-800 rounded-xl py-1.5 px-2 text-xs text-slate-800 dark:text-slate-100 font-extrabold focus:ring-2 focus:border-fuchsia-500 transition outline-none shadow-inner ' + 
                     (isFuchsiaRing ? 'focus:ring-fuchsia-500/10 focus:border-fuchsia-500' : 'focus:ring-violet-500/10 focus:border-violet-500')">
          </div>
        }
      </div>

      <!-- Layout 2: Dual inputs for loSo and hamLuong (SOP-03 & Lân hữu cơ style) -->
      <div *ngIf="pointLabels.length === 0" [class]="'grid gap-3 grid-cols-2 sm:grid-cols-3 ' + (calibPoints.length === 6 ? 'md:grid-cols-6' : 'md:grid-cols-5')">
        @for (pt of calibPoints; track $index) {
          <div [class]="'bg-slate-50/40 dark:bg-slate-955/40 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-3 flex flex-col gap-2 transition duration-200 group ' + 
            (isFuchsiaRing ? 'hover:border-fuchsia-400/50 dark:hover:border-fuchsia-500/40' : 'hover:border-violet-400/50 dark:hover:border-violet-500/40')">
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
              <span [class]="'text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 transition duration-200 ' + 
                (isFuchsiaRing ? 'group-hover:text-fuchsia-500' : 'group-hover:text-violet-500')">
                {{ pointPrefix }}{{ calibPoints.length === 6 ? $index + 1 : $index }}
              </span>
              <span [class]="'w-1.5 h-1.5 rounded-full ' + (isFuchsiaRing ? 'bg-fuchsia-400' : 'bg-violet-400')"></span>
            </div>
            <div>
              <label class="block text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Số vial</label>
              <input type="text" 
                     [(ngModel)]="pt['loSo']" 
                     (ngModelChange)="onPointsChanged()"
                     (focus)="$any($event.target).select()"
                     placeholder="..."
                     [class]="'w-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 rounded-lg px-2 py-0.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-2 outline-none text-center transition ' +
                       (isFuchsiaRing ? 'focus:ring-fuchsia-500/10 focus:border-fuchsia-500' : 'focus:ring-violet-500/10 focus:border-violet-500')">
            </div>
            <div>
              <label class="block text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">{{ valLabel }}</label>
              <input type="text" 
                     [(ngModel)]="pt['hamLuong']" 
                     (ngModelChange)="onPointsChanged()"
                     (focus)="$any($event.target).select()"
                     placeholder="..."
                     [class]="'w-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 rounded-lg px-2 py-0.5 text-xs text-slate-800 dark:text-slate-200 font-semibold focus:ring-2 outline-none text-center transition ' +
                       (isFuchsiaRing ? 'focus:ring-fuchsia-500/10 focus:border-fuchsia-500' : 'focus:ring-violet-500/10 focus:border-violet-500')">
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class SopCalibrationPointsComponent {
  @Input() title: string = 'Các Điểm Đường chuẩn';
  @Input() calibPoints: any[] = [];
  @Input() pointLabels: string[] = []; // If set, displays Fixed labels. If empty, displays Dual input.
  @Input() pointPrefix: string = 'C';
  @Input() suffixText: string = 'IS: 20 ppb';
  @Input() isSuffixVisible: boolean = true;
  @Input() valLabel: string = 'Hàm lượng';
  @Input() isFuchsiaRing: boolean = true;

  @Output() pointsChanged = new EventEmitter<any[]>();

  onPointsChanged() {
    this.pointsChanged.emit(this.calibPoints);
  }
}
