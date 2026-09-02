import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';

export type SettingsSectionVariant = 'default' | 'danger' | 'warning' | 'info';

@Component({
  selector: 'app-settings-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section [class]="sectionClasses()">
      <div class="flex flex-col gap-3 px-5 pb-3 pt-5 sm:flex-row sm:items-start sm:justify-between">
        <div class="flex min-w-0 items-start gap-3">
          @if (icon()) {
            <span [class]="iconWrapperClasses()">
              <i class="fa-solid" [class]="'fa-solid ' + icon()" aria-hidden="true"></i>
            </span>
          }
          <div class="min-w-0">
            <h2 [class]="titleClasses()">{{ title() }}</h2>
            @if (description()) {
              <p class="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{{ description() }}</p>
            }
          </div>
        </div>
        <div class="flex shrink-0 items-center gap-2">
          <ng-content select="[settingsSectionActions]" />
        </div>
      </div>
      <div class="px-5 pb-5 pt-1">
        <ng-content />
      </div>
    </section>
  `,
})
export class SettingsSectionComponent {
  title = input.required<string>();
  description = input('');
  icon = input('');
  variant = input<SettingsSectionVariant>('default');

  protected readonly sectionClasses = computed(() => {
    switch (this.variant()) {
      case 'danger':
        return 'rounded-2xl border-0 bg-red-50/50 shadow-soft-xl dark:bg-red-950/20';
      case 'warning':
        return 'rounded-2xl border-0 bg-amber-50/50 shadow-soft-xl dark:bg-amber-950/20';
      case 'info':
        return 'rounded-2xl border-0 bg-fuchsia-50/50 shadow-soft-xl dark:bg-fuchsia-950/20';
      default:
        return 'rounded-2xl border-0 bg-white shadow-soft-xl dark:bg-slate-900';
    }
  });

  protected readonly iconWrapperClasses = computed(() => {
    switch (this.variant()) {
      case 'danger':
        return 'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300';
      case 'warning':
        return 'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300';
      case 'info':
        return 'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return 'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-fuchsia-500 shadow-soft-md dark:bg-slate-800 dark:text-fuchsia-300';
    }
  });

  protected readonly titleClasses = computed(() => {
    switch (this.variant()) {
      case 'danger':
        return 'text-base font-black text-red-700 dark:text-red-300';
      case 'warning':
        return 'text-base font-black text-amber-800 dark:text-amber-300';
      default:
        return 'text-base font-black text-slate-800 dark:text-slate-100';
    }
  });
}
