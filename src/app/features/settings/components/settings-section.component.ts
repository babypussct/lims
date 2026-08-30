import { Component, input } from '@angular/core';

@Component({
  selector: 'app-settings-section',
  standalone: true,
  template: `
    <section class="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:shadow-none">
      <div class="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-700/70 sm:flex-row sm:items-start sm:justify-between">
        <div class="flex min-w-0 items-start gap-3">
          @if (icon()) {
            <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
              <i class="fa-solid" [class]="'fa-solid ' + icon()" aria-hidden="true"></i>
            </span>
          }
          <div class="min-w-0">
            <h2 class="text-base font-black text-slate-800 dark:text-slate-100">{{ title() }}</h2>
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
}
