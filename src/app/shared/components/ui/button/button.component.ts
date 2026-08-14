import { Component, computed, input } from '@angular/core';

export type AppButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type AppButtonSize = 'sm' | 'md';

@Component({
  selector: 'app-button',
  standalone: true,
  host: {
    class: 'inline-flex',
    '[class.w-full]': 'fullWidth()',
  },
  template: `
    <button
      [attr.type]="type()"
      [disabled]="disabled() || loading()"
      [attr.aria-busy]="loading() ? 'true' : null"
      [class]="buttonClasses()"
    >
      @if (loading()) {
        <i class="fa-solid fa-spinner fa-spin text-[0.9em]" aria-hidden="true"></i>
      }
      <ng-content />
    </button>
  `,
})
export class AppButtonComponent {
  variant = input<AppButtonVariant>('primary');
  size = input<AppButtonSize>('md');
  type = input<'button' | 'submit' | 'reset'>('button');
  disabled = input(false);
  loading = input(false);
  fullWidth = input(false);

  protected readonly buttonClasses = computed(() => {
    const base = [
      'inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-colors',
      'disabled:cursor-not-allowed disabled:opacity-50',
      this.fullWidth() ? 'w-full' : '',
      this.size() === 'sm' ? 'h-9 px-3 text-sm' : 'h-10 px-4 text-sm',
    ];

    const variantClasses: Record<AppButtonVariant, string> = {
      primary: 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400',
      secondary: 'border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
      danger: 'bg-red-600 text-white shadow-sm hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400',
      ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
    };

    return [...base, variantClasses[this.variant()]].filter(Boolean).join(' ');
  });
}
