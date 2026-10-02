import { Component, computed, input, output } from '@angular/core';
import { ModalA11yDirective } from '../../../directives/modal-a11y.directive';

export type AppModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

let nextModalShellId = 0;

@Component({
  selector: 'app-modal-shell',
  standalone: true,
  imports: [ModalA11yDirective],
  template: `
    <div
      class="fixed inset-0 z-layer-modal flex items-center justify-center bg-slate-900/35 p-4 backdrop-blur-sm"
      (click)="onBackdropClick($event)"
    >
      <section
        appModalA11y
        [modalLabelledBy]="titleId"
        [modalDescribedBy]="description() ? descriptionId : undefined"
        (modalEscape)="requestClose()"
        class="ui-modal-enter flex max-h-[calc(100vh-2rem)] w-full flex-col overflow-hidden rounded-2xl border border-white/70 bg-white shadow-soft-xl dark:border-slate-700/70 dark:bg-slate-900"
        [class]="panelClasses()"
      >
        <header
          class="flex shrink-0 border-b border-slate-100 dark:border-slate-800"
          [class]="variant() === 'viewer' ? 'flex flex-wrap shrink-0 items-center gap-x-3 gap-y-2 border-b border-slate-100 px-3 py-2 dark:border-slate-800' : 'flex shrink-0 items-start gap-4 border-b border-slate-100 px-6 py-4 dark:border-slate-800'"
        >
          <div class="min-w-0 flex-1">
            <h2 [id]="titleId" class="font-bold tracking-tight text-gray-700 dark:text-slate-100"
              [class.text-lg]="variant() === 'default'" [class.text-sm]="variant() === 'viewer'"
              [class.truncate]="variant() === 'viewer'" [attr.title]="variant() === 'viewer' ? title() : null">
              {{ title() }}
            </h2>
            @if (description()) {
              <p [id]="descriptionId" class="mt-1 text-slate-500 dark:text-slate-400"
                [class.text-sm]="variant() === 'default'" [class.text-xs]="variant() === 'viewer'"
                [class.truncate]="variant() === 'viewer'" [attr.title]="variant() === 'viewer' ? description() : null">
                {{ description() }}
              </p>
            }
            <ng-content select="[modalHeader]" />
          </div>
          <ng-content select="[modalHeaderActions]" />
          <button
            type="button"
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label="Đóng"
            [disabled]="closeDisabled()"
            (click)="requestClose()"
          >
            <i class="fa-solid fa-xmark" aria-hidden="true"></i>
          </button>
        </header>

        <div class="min-h-0 flex-1"
          [class]="variant() === 'viewer' ? 'flex min-h-0 flex-1 flex-col overflow-hidden p-2' : 'min-h-0 flex-1 overflow-y-auto px-6 py-5'">
          <ng-content select="[modalBody]" />
        </div>

        @if (showFooter()) {
          <footer class="flex flex-wrap justify-end gap-3 border-t border-slate-100 bg-gray-50/70 px-6 py-4 dark:border-slate-800 dark:bg-slate-950/40">
            <ng-content select="[modalFooter]" />
          </footer>
        }
      </section>
    </div>
  `,
  styles: `
    @keyframes ui-modal-enter {
      from {
        opacity: 0;
        transform: translateY(8px) scale(0.985);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .ui-modal-enter {
      animation: ui-modal-enter 160ms cubic-bezier(0.22, 1, 0.36, 1) both;
    }

    @media (prefers-reduced-motion: reduce) {
      .ui-modal-enter {
        animation: none;
      }
    }
  `,
})
export class AppModalShellComponent {
  title = input('Hộp thoại');
  description = input('');
  size = input<AppModalSize>('md');
  variant = input<'default' | 'viewer'>('default');
  showFooter = input(true);
  closeOnBackdrop = input(true);
  closeDisabled = input(false);
  closed = output<void>();

  readonly titleId = `app-modal-shell-title-${++nextModalShellId}`;
  readonly descriptionId = `${this.titleId}-description`;

  protected readonly panelClasses = computed(() => {
    const sizeClasses: Record<AppModalSize, string> = {
      sm: 'max-w-md',
      md: 'max-w-2xl',
      lg: 'max-w-4xl',
      xl: 'max-w-6xl',
      '2xl': 'max-w-[96rem]',
    };
    const heightClass = this.variant() === 'viewer' ? 'h-[calc(100dvh-2rem)]' : '';
    return `ui-modal-enter flex max-h-[calc(100vh-2rem)] w-full flex-col overflow-hidden rounded-2xl border border-white/70 bg-white shadow-soft-xl dark:border-slate-700/70 dark:bg-slate-900 ${sizeClasses[this.size()]} ${heightClass}`;
  });

  protected onBackdropClick(event: MouseEvent): void {
    if (this.closeOnBackdrop() && event.target === event.currentTarget) {
      this.requestClose();
    }
  }

  protected requestClose(): void {
    if (!this.closeDisabled()) {
      this.closed.emit();
    }
  }
}
