import { Component, input } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  template: `
    <div
      class="border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900 sm:px-6"
      [class.sticky]="sticky()"
      [class.top-0]="sticky()"
      [class.z-20]="sticky()"
    >
      <div class="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div class="min-w-0 flex-1">
          <ng-content select="[toolbarSearch]" />
        </div>
        <div class="flex min-w-0 flex-wrap items-center gap-2">
          <ng-content select="[toolbarFilters]" />
        </div>
        <div class="flex flex-wrap items-center gap-2 lg:ml-auto lg:justify-end">
          <ng-content select="[toolbarActions]" />
        </div>
      </div>
    </div>
  `,
})
export class AppToolbarComponent {
  sticky = input(false);
}
