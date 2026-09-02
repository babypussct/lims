import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  standalone: true,
  host: {
    class: 'soft-ui-page-header-host block',
  },
  template: `
    <header
      class="soft-ui-page-header px-1 py-2 sm:px-2"
      [class.sticky]="sticky()"
      [class.top-0]="sticky()"
      [class.z-30]="sticky()"
      [class.backdrop-blur]="sticky()"
    >
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex min-w-0 items-start gap-3">
          @if (icon()) {
            <div class="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-soft text-white shadow-soft-md">
              <i class="fa-solid" [class]="'fa-solid ' + icon()" aria-hidden="true"></i>
            </div>
          }
          <div class="min-w-0">
            <h1 class="font-display text-xl font-bold tracking-tight text-gray-700 dark:text-slate-100 md:text-2xl">
              {{ title() }}
            </h1>
            @if (subtitle()) {
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ subtitle() }}</p>
            }
          </div>
        </div>

        <div class="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
          <ng-content select="[pageHeaderActions]" />
        </div>
      </div>
    </header>
  `,
})
export class AppPageHeaderComponent {
  title = input('');
  subtitle = input('');
  icon = input('');
  sticky = input(false);
}
