import { Component, computed, input } from '@angular/core';
import { ProgressStatus } from './progress.model';

@Component({
  selector: 'app-ui-progress',
  standalone: true,
  host: {
    class: 'block min-w-0',
  },
  template: `
    <div class="min-w-0">
      @if (label() || showValue()) {
        <div class="mb-1.5 flex items-center justify-between gap-3 text-[10px] font-bold text-slate-500 dark:text-slate-400">
          <span class="min-w-0 truncate">{{ label() }}</span>
          @if (showValue()) {
            <span class="shrink-0 tabular-nums">{{ percentage() }}%</span>
          }
        </div>
      }
      <div
        class="soft-ui-progress__track"
        role="progressbar"
        [attr.aria-label]="ariaLabel()"
        [attr.aria-valuemin]="0"
        [attr.aria-valuemax]="normalizedMax()"
        [attr.aria-valuenow]="normalizedValue()">
        <span
          class="soft-ui-progress__bar"
          [attr.data-status]="status()"
          [style.width.%]="percentage()">
        </span>
      </div>
    </div>
  `,
})
export class AppUiProgressComponent {
  value = input(0);
  max = input(100);
  status = input<ProgressStatus>('primary');
  label = input('');
  ariaLabel = input('Tiến độ');
  showValue = input(false);

  normalizedMax = computed(() => {
    const max = Number(this.max());
    return Number.isFinite(max) && max > 0 ? max : 1;
  });

  normalizedValue = computed(() => {
    const value = Number(this.value());
    if (!Number.isFinite(value)) return 0;
    return Math.min(this.normalizedMax(), Math.max(0, value));
  });

  percentage = computed(() => Math.round((this.normalizedValue() / this.normalizedMax()) * 100));
}
