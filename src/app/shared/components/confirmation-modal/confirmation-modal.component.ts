
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { ModalA11yDirective } from '../../directives/modal-a11y.directive';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalA11yDirective],
  template: `
    @if (confirmationService.state().isVisible) {
      <div
        class="fixed inset-0 z-layer-confirmation flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm fade-in no-print"
        appModalA11y
        modalLabelledBy="confirmation-modal-title"
        modalDescribedBy="confirmation-modal-message"
        (modalEscape)="confirmationService.onCancel()">
        <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[85vh] animate-scale-up">
          <div class="p-5 sm:p-6 overflow-y-auto custom-scrollbar flex-1 min-h-0">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                   [class]="confirmationService.state().isDangerous ? 'bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400' : 'bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'">
                <i class="fa-solid text-lg" [class]="confirmationService.state().isDangerous ? 'fa-triangle-exclamation' : 'fa-circle-question'" aria-hidden="true"></i>
              </div>
              <div class="min-w-0 flex-1">
                <h3 id="confirmation-modal-title" class="font-black text-slate-800 dark:text-slate-100 text-base mb-1.5">{{ confirmationService.state().title || 'Xác nhận hành động' }}</h3>
                <p id="confirmation-modal-message" class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{{ confirmationService.state().message }}</p>
                @if (confirmationService.state().requiredText; as requiredText) {
                  <div class="mt-4 rounded-xl border border-red-200 bg-red-50/70 p-3 dark:border-red-900/50 dark:bg-red-950/20">
                    <label for="confirmation-required-text" class="block text-[11px] font-bold text-red-700 dark:text-red-300">
                      Nhập chính xác <code class="rounded bg-white px-1.5 py-0.5 font-mono dark:bg-slate-900">{{ requiredText }}</code> để xác nhận
                    </label>
                    <input id="confirmation-required-text" type="text" [ngModel]="confirmationService.typedText()" (ngModelChange)="confirmationService.typedText.set($event)" autocomplete="off" class="mt-2 w-full rounded-xl border border-red-200 bg-white px-3 py-2 text-sm font-bold text-slate-800 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/15 dark:border-red-900/60 dark:bg-slate-900 dark:text-slate-100">
                  </div>
                }
              </div>
            </div>
          </div>
          <div class="bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 p-4 flex justify-end gap-2.5 shrink-0">
            <button type="button" (click)="confirmationService.onCancel()" class="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 rounded-xl font-bold text-xs sm:text-sm transition-colors">
              {{ confirmationService.state().cancelText }}
            </button>
            <button type="button" (click)="confirmationService.onConfirm()" [disabled]="!confirmationService.canConfirm()" class="px-4 py-2 text-white rounded-xl font-black text-xs sm:text-sm shadow-md transition-all disabled:cursor-not-allowed disabled:opacity-40"
                    [class]="confirmationService.state().isDangerous ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'">
              {{ confirmationService.state().confirmText }}
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class ConfirmationModalComponent {
  confirmationService = inject(ConfirmationService);
}
