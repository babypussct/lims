import { Injectable, inject, NgZone, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class IdleTimeoutService {
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private ngZone = inject(NgZone);

  // Time is set in minutes. Defaults to 30 mins.
  private readonly TIMEOUT_MINUTES = 30;
  private readonly TIMEOUT_MILLISECONDS = this.TIMEOUT_MINUTES * 60 * 1000;
  
  private timeoutId: any;
  private isListening = false;

  // The event listener is bounded so it can be un-registered easily
  private resetFn = () => this.resetTimer();

  startWatching() {
    if (this.isListening) return;

    // Run outside Angular zone to avoid triggering change detection on every mouse move
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('mousemove', this.resetFn);
      window.addEventListener('keydown', this.resetFn);
      window.addEventListener('mousedown', this.resetFn);
      window.addEventListener('touchstart', this.resetFn);
    });

    this.isListening = true;
    this.resetTimer();
  }

  stopWatching() {
    if (!this.isListening) return;

    window.removeEventListener('mousemove', this.resetFn);
    window.removeEventListener('keydown', this.resetFn);
    window.removeEventListener('mousedown', this.resetFn);
    window.removeEventListener('touchstart', this.resetFn);

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    this.isListening = false;
  }

  private resetTimer() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    // Set new timeout outside Angular
    this.ngZone.runOutsideAngular(() => {
      this.timeoutId = setTimeout(() => {
        // Run back inside Angular zone to update UI state and navigate
        this.ngZone.run(() => {
          this.handleTimeout();
        });
      }, this.TIMEOUT_MILLISECONDS);
    });
  }

  private handleTimeout() {
    // Check if user is actually somewhat logged in before showing message
    if (this.auth.currentUser()) {
        this.auth.logout().then(() => {
            this.toast.show('Phiên đăng nhập đã hết hạn do hệ thống bị bỏ trống', 'error');
        });
    }
  }
}
