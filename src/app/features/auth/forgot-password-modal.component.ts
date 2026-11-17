import { Component, inject, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ModalA11yDirective } from '../../shared/directives/modal-a11y.directive';

@Component({
  selector: 'app-forgot-password-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalA11yDirective],
  template: `
    @if (auth.forgotPasswordRequested()) {
      <div class="fixed inset-0 z-[10000] flex justify-center overflow-y-auto overscroll-contain bg-slate-950/75 backdrop-blur-md p-2 sm:p-4 animate-fade-in-up" role="dialog" aria-modal="true" aria-labelledby="forgot-pwd-title" appModalA11y modalLabelledBy="forgot-pwd-title" (modalEscape)="close()">
        <div class="my-auto w-full max-w-md max-h-[calc(100dvh-1rem)] sm:max-h-[calc(100dvh-2rem)] flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl relative overflow-hidden">
          <!-- Decorative Top Glow -->
          <div class="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none"></div>

          <div class="flex items-start justify-between gap-3 px-5 pt-5 pb-3 sm:px-7 sm:pt-7 sm:pb-4 relative z-10 shrink-0">
            <div class="flex items-start gap-3.5 sm:gap-4 min-w-0">
              <div class="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-inner">
                <i class="fa-solid fa-key text-lg sm:text-xl" aria-hidden="true"></i>
              </div>
              <div class="min-w-0">
                <h2 id="forgot-pwd-title" class="text-lg sm:text-xl font-black text-slate-800 dark:text-white tracking-tight">Khôi phục mật khẩu</h2>
                <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 sm:mt-1.5 leading-relaxed font-medium">
                  Nhập email của bạn để nhận liên kết đặt lại mật khẩu LIMS.
                </p>
              </div>
            </div>

            <button type="button" (click)="close()" aria-label="Đóng khôi phục mật khẩu" class="w-11 h-11 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
              <i class="fa-solid fa-xmark" aria-hidden="true"></i>
            </button>
          </div>

          <form (ngSubmit)="sendResetLink()" class="flex flex-col min-h-0 flex-1 relative z-10">
            <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-2 sm:px-7 space-y-4">
              <div class="group">
                <label for="reset-email" class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Email đăng nhập</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i class="fa-regular fa-envelope text-slate-400 group-focus-within:text-blue-500 transition-colors" aria-hidden="true"></i>
                  </div>
                  <input id="reset-email" name="resetEmail" type="email" [(ngModel)]="email" autocomplete="username"
                         class="w-full min-h-[44px] pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-2xl text-base sm:text-sm font-semibold text-slate-700 dark:text-slate-200 outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-blue-400 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-400/10 transition-all shadow-sm placeholder:font-normal placeholder:text-slate-400"
                         placeholder="Nhập email của bạn..." [disabled]="isLoading() || countdown() > 0" />
                </div>
              </div>

              @if (errorMsg()) {
                <div class="px-4 py-3 rounded-2xl bg-red-50/80 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 text-[13px] font-medium flex items-start gap-2 animate-shake">
                  <i class="fa-solid fa-circle-exclamation mt-0.5"></i>
                  <span>{{errorMsg()}}</span>
                </div>
              }

              @if (successMsg()) {
                <div class="px-4 py-3 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-[13px] font-medium flex items-start gap-2">
                  <i class="fa-solid fa-paper-plane mt-0.5"></i>
                  <span>{{successMsg()}}</span>
                </div>
              }
            </div>

            <div class="px-5 pt-3 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] sm:px-7 sm:pb-7 shrink-0">
              <button type="submit" [disabled]="isLoading() || countdown() > 0 || !email"
                      class="w-full min-h-[44px] py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm shadow-soft-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                @if (isLoading()) {
                  <i class="fa-solid fa-circle-notch fa-spin"></i> Đang gửi...
                } @else if (countdown() > 0) {
                  <i class="fa-solid fa-clock"></i> Thử lại sau {{countdown()}}s
                } @else {
                  <i class="fa-solid fa-paper-plane"></i> Gửi liên kết đặt lại
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
  styles: [`
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
    .animate-fade-in-up { animation: fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

    @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
    .animate-shake { animation: shake 0.3s ease-in-out; }
  `]
})
export class ForgotPasswordModalComponent implements OnDestroy {
  auth = inject(AuthService);

  email = '';
  isLoading = signal(false);
  errorMsg = signal('');
  successMsg = signal('');
  countdown = signal(0);
  private timer: any = null;

  ngOnDestroy() {
    this.clearTimer();
  }

  async sendResetLink(): Promise<void> {
    if (!this.email || this.countdown() > 0 || this.isLoading()) return;

    this.errorMsg.set('');
    this.successMsg.set('');
    this.isLoading.set(true);

    try {
      await this.auth.sendPasswordReset(this.email);
      this.successMsg.set('Đã gửi email khôi phục. Vui lòng kiểm tra hộp thư đến (hoặc thư mục Spam).');
      this.startCooldown();
    } catch (error: any) {
      if (error.code === 'auth/invalid-email') {
        this.errorMsg.set('Địa chỉ email không hợp lệ.');
      } else if (error.code === 'auth/user-not-found') {
        // Do not reveal whether an email exists in Firebase Authentication.
        this.successMsg.set('Nếu email hợp lệ, liên kết khôi phục đã được gửi. Hãy kiểm tra hộp thư đến hoặc thư mục Spam.');
        this.startCooldown();
      } else {
        console.error('[ForgotPassword] Không thể gửi email khôi phục:', error);
        this.errorMsg.set('Không thể gửi email. Vui lòng thử lại sau.');
      }
    } finally {
      this.isLoading.set(false);
    }
  }

  close(): void {
    if (!this.isLoading()) {
      this.auth.closeForgotPassword();
      this.email = '';
      this.errorMsg.set('');
      this.successMsg.set('');
    }
  }

  private startCooldown() {
    this.countdown.set(60);
    this.clearTimer();
    this.timer = setInterval(() => {
      if (this.countdown() > 0) {
        this.countdown.set(this.countdown() - 1);
      } else {
        this.clearTimer();
      }
    }, 1000);
  }

  private clearTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
