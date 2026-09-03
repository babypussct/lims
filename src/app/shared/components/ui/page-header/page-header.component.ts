import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AppPageHeaderVariant = 'page' | 'workspace' | 'detail' | 'section';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule],
  host: {
    class: 'soft-ui-page-header-host block',
    '[attr.data-variant]': 'variant()',
    '[class.soft-ui-page-header-host--page]': "variant() === 'page'",
    '[class.soft-ui-page-header-host--workspace]': "variant() === 'workspace'",
    '[class.soft-ui-page-header-host--detail]': "variant() === 'detail'",
    '[class.soft-ui-page-header-host--section]': "variant() === 'section'",
    '[class.sticky]': 'sticky()',
    '[class.top-0]': "sticky() && variant() !== 'workspace'",
    '[class.top-2]': "sticky() && variant() === 'workspace'",
    '[class.z-30]': 'sticky()',
  },
  template: `
    <header
      class="soft-ui-page-header transition-all duration-200"
      [ngClass]="headerContainerClasses()"
      [class.backdrop-blur]="sticky() && variant() !== 'workspace'"
    >
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex min-w-0 items-center gap-3">
          <ng-content select="[pageHeaderLeading]" />

          @if (icon() && variant() === 'page') {
            <div data-page-header-icon class="soft-ui-page-header__icon flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-soft text-white shadow-soft-md">
              <i class="fa-solid" [class]="'fa-solid ' + icon()" aria-hidden="true"></i>
            </div>
          }

          <div class="min-w-0">
            <h1
              data-page-header-title
              class="soft-ui-page-header__title font-display font-bold tracking-tight text-gray-700 dark:text-slate-100 truncate"
              [ngClass]="titleClasses()">
              {{ title() }}
            </h1>
            @if (subtitle()) {
              <p
                data-page-header-subtitle
                class="soft-ui-page-header__subtitle truncate text-slate-500 dark:text-slate-400"
                [ngClass]="subtitleClasses()">
                {{ subtitle() }}
              </p>
            }
          </div>
        </div>

        <div class="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
          <ng-content select="[pageHeaderActions]" />
        </div>
      </div>

      <div class="empty:hidden">
        <ng-content select="[pageHeaderMeta]" />
      </div>
    </header>
  `,
})
export class AppPageHeaderComponent {
  variant = input<AppPageHeaderVariant>('page');
  title = input('');
  subtitle = input('');
  icon = input('');
  sticky = input(false);

  headerContainerClasses = computed(() => {
    switch (this.variant()) {
      case 'workspace':
        return 'rounded-2xl border-0 bg-white/95 dark:bg-slate-900/95 shadow-soft-xl backdrop-blur-xl px-4 py-2.5 sm:px-5';
      case 'detail':
        return 'rounded-2xl border-0 bg-white dark:bg-slate-900 shadow-soft-xl px-4 py-3 sm:px-5';
      case 'section':
        return 'px-2 py-1 bg-transparent';
      default:
        return 'px-1 py-2 sm:px-2 bg-transparent';
    }
  });

  titleClasses = computed(() => {
    switch (this.variant()) {
      case 'workspace':
        return 'text-base sm:text-lg leading-tight';
      case 'section':
        return 'text-sm sm:text-base leading-tight';
      case 'detail':
        return 'text-lg sm:text-xl leading-tight';
      default:
        return 'text-xl md:text-2xl leading-tight';
    }
  });

  subtitleClasses = computed(() => {
    switch (this.variant()) {
      case 'workspace':
        return 'mt-0.5 text-xs font-mono font-semibold';
      case 'detail':
        return 'mt-0.5 text-xs';
      default:
        return 'mt-1 text-sm';
    }
  });
}
