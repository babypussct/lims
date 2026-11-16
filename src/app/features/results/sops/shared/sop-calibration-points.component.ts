import { Component, Input, Output, EventEmitter } from '@angular/core';

import { FormsModule } from '@angular/forms';

/**
 * Quy tắc thống nhất cho tất cả SOP:
 *   Cột 1 – Tên điểm chuẩn : pt['loSo']   (VD: C0, C1, C2 … — KHÔNG thay đổi bằng bulk)
 *   Cột 2 – Số lọ          : pt['vialNo'] (NƠI THAO TÁC BULK "Vial chuẩn")
 *   Cột 3 – Nồng độ         : pt['hamLuong'] (VD: 0, 2, 5, 10, 20, 50)
 *
 * pointLabels[] — nếu có, hiển thị nhãn nồng độ tĩnh trên thẻ thay vì ô hamLuong
 * (dùng cho SOP Chloroform & SOP-03 vì nồng độ cố định không cần sửa).
 */
@Component({
  selector: 'app-sop-calibration-points',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="space-y-2.5">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <label class="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">{{ title }}</label>
        @if (isSuffixVisible && suffixText) {
          <span class="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold border border-slate-200/70 dark:border-slate-700">
            {{ suffixText }}
          </span>
        }
      </div>

      <!-- Compact Horizontal Strip / Grid for Calibration Points -->
      <div [class]="'grid gap-2.5 ' + gridCols">
        @for (pt of (calibPoints || []); track $index) {
          <div class="bg-slate-50/70 dark:bg-slate-950/30 border border-slate-200/80 dark:border-slate-800 rounded-xl p-2.5 transition-colors hover:border-indigo-200 dark:hover:border-indigo-800/60">
            <!-- Header: Point Name + Static Label -->
            <div class="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-1.5 mb-2 gap-1.5">
              <span class="inline-flex items-center justify-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-900/40">
                {{ pt['loSo'] || (pointPrefix + $index) }}
              </span>
              @if ((pointLabels || []).length > $index) {
                <span class="text-[11px] font-bold text-slate-700 dark:text-slate-200">
                  {{ (pointLabels || [])[$index] }}
                </span>
              }
            </div>

            <!-- Fields: Tên điểm | Số lọ | Nồng độ -->
            <div [class]="'grid gap-1.5 ' + ((pointLabels || []).length > 0 ? 'grid-cols-1' : 'grid-cols-3')">
              @if ((pointLabels || []).length === 0) {
                <div>
                  <label class="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Điểm</label>
                  <input type="text"
                         [(ngModel)]="pt['loSo']"
                         (ngModelChange)="onPointsChanged()"
                         (focus)="$any($event.target).select()"
                         placeholder="C0…"
                         [disabled]="isReadOnly"
                         [class]="inputClass">
                </div>
              }

              <div>
                <label class="block text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-0.5">Số lọ</label>
                <input type="text"
                       [(ngModel)]="pt['vialNo']"
                       (ngModelChange)="onPointsChanged()"
                       (focus)="$any($event.target).select()"
                       placeholder="Lọ…"
                       [disabled]="isReadOnly"
                       [class]="vialInputClass">
              </div>

              @if ((pointLabels || []).length === 0) {
                <div>
                  <label class="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">{{ valLabel }}</label>
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
  @Input() title = 'Các Điểm Đường chuẩn';
  @Input() calibPoints: any[] = [];
  /** Nhãn nồng độ tĩnh (VD: ['0 ppb','2 ppb'…]). Nếu có → ẩn cột Tên điểm và nồng độ, chỉ edit Số lọ. */
  @Input() pointLabels: string[] = [];
  @Input() pointPrefix = 'C';
  @Input() suffixText = 'IS: 20 ppb';
  @Input() isSuffixVisible = true;
  @Input() valLabel = 'Nồng độ';
  @Input() isReadOnly = false;

  @Output() pointsChanged = new EventEmitter<any[]>();

  get gridCols(): string {
    const n = (this.calibPoints || []).length;
    if (n <= 3) return 'grid-cols-1 sm:grid-cols-3';
    if (n === 5) return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5';
    return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6';
  }

  readonly inputClass = `w-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/70
            rounded-lg px-2 py-1 text-xs text-slate-800 dark:text-slate-100 font-semibold
            focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-center transition disabled:opacity-60`;

  readonly vialInputClass = `w-full bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800/70
            rounded-lg px-2 py-1 text-xs text-indigo-700 dark:text-indigo-300 font-bold font-mono
            focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-center transition disabled:opacity-60`;

  onPointsChanged() {
    this.pointsChanged.emit(this.calibPoints);
  }
}
