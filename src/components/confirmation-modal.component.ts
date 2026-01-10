import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationService } from '../services/confirmation.service';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (confirmationService.state().isVisible) {
      <div class="fixed inset-0 z-[99] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm fade-in no-print">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200">
          <div class="p-6">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                   [class]="confirmationService.state().isDangerous ? 'bg-red-100 text-red-500' : 'bg-blue-100 text-blue-500'">
                <i class="fa-solid text-lg" [class]="confirmationService.state().isDangerous ? 'fa-triangle-exclamation' : 'fa-circle-question'"></i>
              </div>
              <div>
                <h3 class="font-bold text-slate-800 mb-1">Xác nhận hành động</h3>
                <p class="text-sm text-slate-600 whitespace-pre-wrap">{{ confirmationService.state().message }}</p>
              </div>
            </div>
          </div>
          <div class="bg-slate-50 p-4 flex justify-end gap-3">
            <button (click)="confirmationService.onCancel()"
                    class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-bold text-sm transition">
              {{ confirmationService.state().cancelText }}
            </button>
            <button (click)="confirmationService.onConfirm()"
                    class="px-4 py-2 text-white rounded-lg font-bold text-sm shadow-md transition"
                    [class]="confirmationService.state().isDangerous ? 'bg-red-600 hover:bg-red-700 shadow-red-200' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'">
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
