
import { Injectable, signal } from '@angular/core';

export interface ConfirmationOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  requiredText?: string;
}

interface ConfirmationState extends ConfirmationOptions {
  isVisible: boolean;
}

@Injectable({ providedIn: 'root' })
export class ConfirmationService {
  private defaultState: ConfirmationState = {
    isVisible: false,
    title: 'Xác nhận hành động',
    message: '',
    confirmText: 'Xác nhận',
    cancelText: 'Hủy',
    isDangerous: false,
    requiredText: undefined,
  };

  state = signal<ConfirmationState>(this.defaultState);
  typedText = signal('');
  private resolver?: (value: boolean) => void;

  confirm(options: ConfirmationOptions | string): Promise<boolean> {
    const opts: ConfirmationOptions = typeof options === 'string' ? { message: options } : options;
    return new Promise<boolean>((resolve) => {
      this.resolver = resolve;
      this.state.set({
        isVisible: true,
        title: opts.title || 'Xác nhận hành động',
        message: opts.message,
        confirmText: opts.confirmText || 'Xác nhận',
        cancelText: opts.cancelText || 'Hủy',
        isDangerous: opts.isDangerous || false,
        requiredText: opts.requiredText,
      });
      this.typedText.set('');
    });
  }

  canConfirm(): boolean {
    const requiredText = this.state().requiredText;
    return !requiredText || this.typedText() === requiredText;
  }

  onConfirm() {
    if (!this.canConfirm()) return;
    if (this.resolver) this.resolver(true);
    this.close();
  }
  onCancel() { if (this.resolver) this.resolver(false); this.close(); }
  private close() { this.state.set({ ...this.defaultState }); this.typedText.set(''); this.resolver = undefined; }
}
