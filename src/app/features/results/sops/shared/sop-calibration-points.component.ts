import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * Quy tắc thống nhất cho tất cả SOP:
 *   Cột 1 – Tên điểm chuẩn : pt['loSo']   (VD: C0, C1, C2 … — KHÔNG thay đổi bằng bulk)
 *   Cột 2 – Số vial          : pt['vialNo'] (NƠI THAO TÁC BULK "Vial chuẩn")
 *   Cột 3 – Nồng độ         : pt['hamLuong'] (VD: 0, 2, 5, 10, 20, 50)
 *
 * pointLabels[] — nếu có, hiển thị nhãn nồng độ tĩnh trên thẻ thay vì ô hamLuong
 * (dùng cho SOP Chloroform & SOP-03 vì nồng độ cố định không cần sửa).
 */
@Component({
  selector: 'app-sop-calibration-points',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-3">
      <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-3 uppercase tracking-widest">{{ title }}</label>

      <!-- Layout thống nhất: Grid các thẻ điểm chuẩn -->
      <div [class]="'grid gap-3 ' + gridCols">
        @for (pt of (calibPoints || []); track $index) {
          <div [class]="cardClass($index)">

            <!-- Header thẻ: Tên điểm (C0/C1…) + màu dot -->
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5 mb-2">
              <span [class]="badgeClass($index)">
                {{ pt['loSo'] || (pointPrefix + $index) }}
              </span>
              @if ((pointLabels || []).length > $index) {
                <span class="text-[10px] font-extrabold text-slate-600 dark:text-slate-300">
                  {{ (pointLabels || [])[$index] }}
                </span>
              }
              <span [class]="'w-1.5 h-1.5 rounded-full ' + dotColor"></span>
            </div>

            <!-- 3 Cột: Tên điểm | Số vial | Nồng độ -->
            <div [class]="'grid gap-1.5 ' + ((pointLabels || []).length > 0 ? 'grid-cols-1' : 'grid-cols-3')">

              <!-- Cột 1: Tên điểm chuẩn (loSo) — chỉ hiển thị nếu pointLabels rỗng -->
              @if ((pointLabels || []).length === 0) {
                <div>
                  <label class="block text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Tên điểm</label>
                  <input type="text"
                         [(ngModel)]="pt['loSo']"
                         (ngModelChange)="onPointsChanged()"
                         (focus)="$any($event.target).select()"
                         placeholder="C0…"
                         [disabled]="isReadOnly"
                         [class]="inputClass">
                </div>
              }

              <!-- Cột 2: Số vial (vialNo) — LUÔN HIỂN THỊ, đây là nơi bulk điền -->
              <div>
                <label class="block text-[8px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-wider mb-0.5">Số vial</label>
                <input type="text"
                       [(ngModel)]="pt['vialNo']"
                       (ngModelChange)="onPointsChanged()"
                       (focus)="$any($event.target).select()"
                       placeholder="Vial…"
                       [disabled]="isReadOnly"
                       [class]="vialInputClass">
              </div>

              <!-- Cột 3: Nồng độ (hamLuong) — chỉ hiển thị nếu pointLabels rỗng -->
              @if ((pointLabels || []).length === 0) {
                <div>
                  <label class="block text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">{{ valLabel }}</label>
                  <input type="text"
                         [(ngModel)]="pt['hamLuong']"
                         (ngModelChange)="onPointsChanged()"
                         (focus)="$any($event.target).select()"
                         placeholder="0…"
                         [disabled]="isReadOnly"
                         [class]="inputClass">
                </div>
              }
            </div>

          </div>
        }
      </div>
    </div>
  `,
  styles: []
})
export class SopCalibrationPointsComponent {
  @Input() title: string = 'Các Điểm Đường chuẩn';
  @Input() calibPoints: any[] = [];
  /** Nhãn nồng độ tĩnh (VD: ['0 ppb','2 ppb'…]). Nếu có → ẩn cột Tên điểm & Nồng độ, chỉ edit Số vial. */
  @Input() pointLabels: string[] = [];
  @Input() pointPrefix: string = 'C';
  @Input() suffixText: string = 'IS: 20 ppb';
  @Input() isSuffixVisible: boolean = true;
  @Input() valLabel: string = 'Nồng độ';
  @Input() isFuchsiaRing: boolean = true;
  @Input() isReadOnly: boolean = false;

  @Output() pointsChanged = new EventEmitter<any[]>();

  get dotColor(): string {
    return this.isFuchsiaRing ? 'bg-fuchsia-400' : 'bg-violet-400';
  }

  get gridCols(): string {
    const n = (this.calibPoints || []).length;
    if (n <= 3) return 'grid-cols-1 sm:grid-cols-3';
    if (n === 5) return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5';
    // 6 điểm
    return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6';
  }

  get inputClass(): string {
    const ring = this.isFuchsiaRing
      ? 'focus:ring-fuchsia-500/10 focus:border-fuchsia-500'
      : 'focus:ring-violet-500/10 focus:border-violet-500';
    return `w-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60
            rounded-lg px-2 py-1 text-xs text-slate-800 dark:text-slate-200 font-semibold
            focus:ring-2 outline-none text-center transition ${ring}`;
  }

  get vialInputClass(): string {
    const ring = this.isFuchsiaRing
      ? 'focus:ring-fuchsia-500/20 focus:border-fuchsia-500'
      : 'focus:ring-cyan-500/20 focus:border-cyan-500';
    return `w-full bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-800/60
            rounded-lg px-2 py-1 text-xs text-cyan-800 dark:text-cyan-200 font-extrabold
            focus:ring-2 outline-none text-center transition shadow-inner ${ring}`;
  }

  cardClass(idx: number): string {
    const borderColors = [
      'border-t-slate-400/80',
      'border-t-emerald-500',
      'border-t-teal-500',
      'border-t-indigo-500',
      'border-t-purple-500',
      'border-t-fuchsia-500',
    ];
    const color = borderColors[idx] ?? 'border-t-slate-400/80';
    return `bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80
            border-t-4 ${color} rounded-2xl p-3 shadow-sm hover:shadow-md transition duration-200`;
  }

  badgeClass(idx: number): string {
    const configs = [
      'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
      'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400',
      'bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-400',
      'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400',
      'bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400',
      'bg-fuchsia-50 dark:bg-fuchsia-950/30 text-fuchsia-700 dark:text-fuchsia-400',
    ];
    const cls = configs[idx] ?? configs[0];
    return `inline-flex items-center justify-center px-2 py-0.5 rounded text-[9px] font-black uppercase ${cls}`;
  }

  onPointsChanged() {
    this.pointsChanged.emit(this.calibPoints);
  }
}
