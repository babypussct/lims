import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';

export type SettingsSectionVariant = 'default' | 'danger' | 'warning' | 'info';

@Component({
  selector: 'app-settings-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section [class]="sectionClasses()">
      <div class="flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-start sm:justify-between" [class]="headerBorderClass()">
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
      <div class="p-5">
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
        return 'rounded-2xl border border-red-200 bg-red-50/40 shadow-sm dark:border-red-900/50 dark:bg-red-950/20 dark:shadow-none';
      case 'warning':
        return 'rounded-2xl border border-amber-200 bg-amber-50/40 shadow-sm dark:border-amber-900/50 dark:bg-amber-950/20 dark:shadow-none';
      case 'info':
        return 'rounded-2xl border border-indigo-200 bg-indigo-50/40 shadow-sm dark:border-indigo-900/50 dark:bg-indigo-950/20 dark:shadow-none';
      default:
        return 'rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:shadow-none';
    }
  });

  protected readonly headerBorderClass = computed(() => {
    switch (this.variant()) {
      case 'danger':
        return 'border-red-100 dark:border-red-900/40';
      case 'warning':
        return 'border-amber-100 dark:border-amber-900/40';
      case 'info':
        return 'border-indigo-100 dark:border-indigo-900/40';
      default:
        return 'border-slate-100 dark:border-slate-700/70';
    }
  });

  protected readonly iconWrapperClasses = computed(() => {
    switch (this.variant()) {
      case 'danger':
        return 'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300';
      case 'warning':
        return 'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300';
      case 'info':
        return 'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return 'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300';
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
