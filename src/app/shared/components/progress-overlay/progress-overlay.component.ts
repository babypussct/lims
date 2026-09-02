import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressService } from '../../../core/services/progress.service';
import { ModalA11yDirective } from '../../directives/modal-a11y.directive';

@Component({
  selector: 'app-progress-overlay',
  standalone: true,
  imports: [CommonModule, ModalA11yDirective],
  template: `
    @if (progressService.isVisible()) {
      <div
        class="fixed inset-0 z-layer-system-lock flex items-center justify-center bg-slate-900/60 backdrop-blur-sm fade-in"
        appModalA11y
        modalLabelledBy="progress-overlay-title"
        modalDescribedBy="progress-overlay-message">
          <div class="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-sm w-full mx-4 animate-bounce-in">
              <div class="w-16 h-16 rounded-full bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-600 dark:text-fuchsia-400 flex items-center justify-center text-3xl mb-4 relative">
                  <i class="fa-solid fa-arrows-rotate fa-spin"></i>
              </div>
              <h3 id="progress-overlay-title" class="text-lg font-black text-slate-800 dark:text-slate-100 mb-2 text-center">{{ progressService.title() }}</h3>
              <p id="progress-overlay-message" class="text-sm text-slate-500 text-center mb-6" aria-live="polite">{{ progressService.message() }}</p>
              
              @if (progressService.total() > 0) {
                <div
                  class="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden relative"
                  role="progressbar"
                  aria-label="Tiến trình thao tác"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  [attr.aria-valuenow]="progressService.progressPercentage()">
                    <div class="absolute top-0 left-0 h-full bg-fuchsia-600 rounded-full transition-all duration-300" [style.width.%]="progressService.progressPercentage()"></div>
                </div>
                <div class="flex justify-between w-full mt-2 text-xs font-bold text-slate-500">
                    <span>{{ progressService.current() }} / {{ progressService.total() }}</span>
                    <span>{{ progressService.progressPercentage().toFixed(0) }}%</span>
                </div>
              } @else {
                <div class="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden relative" role="status" aria-label="Đang xử lý">
                    <div class="absolute top-0 left-0 h-full bg-fuchsia-600 rounded-full w-1/3 animate-[progress-indeterminate_1.5s_infinite_linear]"></div>
                </div>
              }
          </div>
      </div>
    }
  `,
  styles: [`
    @keyframes progress-indeterminate {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(300%); }
    }
  `]
})
export class ProgressOverlayComponent {
  progressService = inject(ProgressService);
}
