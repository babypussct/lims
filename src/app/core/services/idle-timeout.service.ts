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

  private shouldDisableTimeout(): boolean {
    const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isMobileWidth = window.innerWidth <= 768;
    
    // Tắt timeout nếu là thiết bị di động (áp dụng chung cho cả Trình duyệt trên Mobile và PWA trên Mobile).
    // Desktop (kể cả PWA trên Desktop) vẫn sẽ bị tự động đăng xuất.
    return isMobileUserAgent || isMobileWidth;
  }

  startWatching() {
    if (this.shouldDisableTimeout()) {
      return; // Không theo dõi idle timeout trên thiết bị di động hoặc PWA
    }

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
        localStorage.setItem('lims_logout_reason', 'idle');
        this.auth.logout();
    }
  }
}
