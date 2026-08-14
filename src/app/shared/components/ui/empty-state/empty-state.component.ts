import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="flex flex-col items-center justify-center px-6 py-12 text-center">
      <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
        <i class="fa-solid" [class]="'fa-solid ' + icon()" aria-hidden="true"></i>
      </div>
      <h3 class="mt-4 text-base font-bold text-slate-800 dark:text-slate-100">{{ title() }}</h3>
      @if (message()) {
        <p class="mt-1 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">{{ message() }}</p>
      }
      <div class="mt-5 flex flex-wrap justify-center gap-2">
        <ng-content select="[emptyStateActions]" />
      </div>
    </div>
  `,
})
export class AppEmptyStateComponent {
  icon = input('fa-inbox');
  title = input('Chưa có dữ liệu');
  message = input('');
}
