
import { Injectable, signal } from '@angular/core';

export interface ConfirmationOptions {
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
}

interface ConfirmationState extends ConfirmationOptions {
  isVisible: boolean;
}

@Injectable({ providedIn: 'root' })
export class ConfirmationService {
  private defaultState: ConfirmationState = {
    isVisible: false, message: '', confirmText: 'Xác nhận', cancelText: 'Hủy', isDangerous: false,
  };

  state = signal<ConfirmationState>(this.defaultState);
  private resolver?: (value: boolean) => void;

  confirm(options: ConfirmationOptions | string): Promise<boolean> {
    const opts: ConfirmationOptions = typeof options === 'string' ? { message: options } : options;
    return new Promise<boolean>((resolve) => {
      this.resolver = resolve;
      this.state.set({
        isVisible: true, message: opts.message, confirmText: opts.confirmText || 'Xác nhận',
        cancelText: opts.cancelText || 'Hủy', isDangerous: opts.isDangerous || false,
      });
    });
  }

  onConfirm() { if (this.resolver) this.resolver(true); this.close(); }
  onCancel() { if (this.resolver) this.resolver(false); this.close(); }
  private close() { this.state.set({ ...this.defaultState }); this.resolver = undefined; }
}