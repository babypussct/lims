import { CommonModule } from '@angular/common';
import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ModalA11yDirective } from '../../shared/directives/modal-a11y.directive';

@Component({
  selector: 'app-password-setup',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalA11yDirective],
  template: `
    @if (auth.isPasswordSetupOpen()) {
      <div class="fixed inset-0 z-[10000] flex justify-center overflow-y-auto overscroll-contain bg-slate-950/75 backdrop-blur-md p-2 sm:p-4 animate-fade-in-up">
        <div
          appModalA11y
          modalLabelledBy="password-setup-title"
          (modalEscape)="!auth.needsPasswordSetup() && close()"
          class="my-auto w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl flex flex-col max-h-[calc(100dvh-1rem)] sm:max-h-[calc(100dvh-2rem)] relative overflow-hidden">

          <!-- Decorative Top Glow -->
          <div class="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-fuchsia-500/10 to-transparent pointer-events-none"></div>

          <div class="flex items-start gap-3 sm:gap-4 px-5 pt-5 pb-3 sm:px-8 sm:pt-7 sm:pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0 relative z-10">
            <div class="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-fuchsia-100 dark:bg-fuchsia-950/50 text-fuchsia-600 dark:text-fuchsia-400 flex items-center justify-center shrink-0 shadow-inner">
              <i class="fa-solid fa-shield-halved text-lg sm:text-xl"></i>
            </div>
            <div class="min-w-0 flex-1">
              <h2 id="password-setup-title" class="text-lg sm:text-xl font-black text-slate-800 dark:text-white tracking-tight">
                @if (!auth.hasPasswordProvider()) { Cài đặt mật khẩu LIMS } @else { Đổi mật khẩu LIMS }
              </h2>
              <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-medium break-words">
                @if (!auth.hasPasswordProvider()) {
                  Tài khoản <strong>{{auth.currentUser()?.email}}</strong> đã sẵn sàng. Hãy tạo mật khẩu dự phòng.
                } @else {
                  Cập nhật mật khẩu cho <strong>{{auth.currentUser()?.email}}</strong>.
                }
              </p>
            </div>
          </div>

          <form (ngSubmit)="save()" class="flex min-h-0 flex-1 flex-col relative z-10">
            <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain custom-scrollbar px-5 py-4 sm:px-8 sm:py-5 space-y-4">
              <!-- Password Purpose -->
              <div class="rounded-2xl border border-fuchsia-200 dark:border-fuchsia-900/60 bg-fuchsia-50/80 dark:bg-fuchsia-950/25 p-3.5 sm:p-4">
                <div class="flex items-start gap-3">
                  <i class="fa-solid fa-key text-fuchsia-600 dark:text-fuchsia-400 mt-0.5 shrink-0"></i>
                  <div class="space-y-1.5 min-w-0">
                    <p class="text-xs sm:text-sm font-black text-fuchsia-900 dark:text-fuchsia-200">Mật khẩu này dùng để làm gì?</p>
                    <p class="text-xs font-medium leading-relaxed text-fuchsia-800/90 dark:text-fuchsia-200/85">
                      Đây là mật khẩu đăng nhập riêng của LIMS. Bạn có thể dùng <strong>Gmail + mật khẩu LIMS</strong> để đăng nhập thay cho nút Google.
                      Mật khẩu này <strong>không phải mật khẩu Gmail</strong> và không làm thay đổi tài khoản Google của bạn.
                    </p>
                    <p class="text-[11px] font-bold leading-relaxed text-fuchsia-700 dark:text-fuchsia-300">
                      Bắt buộc: ít nhất 8 ký tự và hai ô mật khẩu phải trùng nhau. Độ mạnh chỉ là gợi ý.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Current Password (Only when changing password) -->
              @if (auth.requiresCurrentPassword()) {
                <div class="group">
                  <label for="current-password" class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Mật khẩu hiện tại</label>
                  <div class="relative">
                    <input id="current-password" name="currentPassword" [type]="showCurrentPassword() ? 'text' : 'password'" [(ngModel)]="currentPassword" autocomplete="current-password"
                           class="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-2xl text-base sm:text-sm font-semibold text-slate-700 dark:text-slate-200 outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-fuchsia-400 dark:focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-400/10 transition-all shadow-sm"
                           placeholder="Nhập mật khẩu cũ để xác thực" [disabled]="isSaving()" />
                    <button type="button" (click)="toggleCurrentPassword()" [attr.aria-label]="showCurrentPassword() ? 'Ẩn mật khẩu hiện tại' : 'Hiện mật khẩu hiện tại'" class="absolute inset-y-0 right-0 w-11 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                      <i class="fa-solid" [class.fa-eye]="!showCurrentPassword()" [class.fa-eye-slash]="showCurrentPassword()" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>
              }

              <div class="group">
                <label for="new-login-password" class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Mật khẩu mới</label>
                <div class="relative">
                  <input id="new-login-password" name="newLoginPassword" [type]="showNewPassword() ? 'text' : 'password'" [(ngModel)]="password" (ngModelChange)="onPasswordInput()" autocomplete="new-password"
                         class="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-2xl text-base sm:text-sm font-semibold text-slate-700 dark:text-slate-200 outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-fuchsia-400 dark:focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-400/10 transition-all shadow-sm"
                         placeholder="Ít nhất 8 ký tự" [disabled]="isSaving()" />
                  <button type="button" (click)="toggleNewPassword()" [attr.aria-label]="showNewPassword() ? 'Ẩn mật khẩu mới' : 'Hiện mật khẩu mới'" class="absolute inset-y-0 right-0 w-11 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                    <i class="fa-solid" [class.fa-eye]="!showNewPassword()" [class.fa-eye-slash]="showNewPassword()" aria-hidden="true"></i>
                  </button>
                </div>

                <!-- Optional Strength Meter -->
                <div class="mt-3" aria-live="polite">
                  <div class="flex items-center justify-between mb-1.5 px-1">
                    <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Gợi ý độ mạnh <span class="normal-case tracking-normal font-semibold">(không bắt buộc)</span></span>
                    <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400">{{strengthLabel()}}</span>
                  </div>
                  <div class="flex gap-1 h-1.5 w-full rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800" aria-hidden="true">
                    <div class="h-full transition-all duration-300" [ngClass]="strengthColors()[0]"></div>
                    <div class="h-full transition-all duration-300" [ngClass]="strengthColors()[1]"></div>
                    <div class="h-full transition-all duration-300" [ngClass]="strengthColors()[2]"></div>
                    <div class="h-full transition-all duration-300" [ngClass]="strengthColors()[3]"></div>
                  </div>
                </div>
              </div>

              <div class="group">
                <label for="confirm-login-password" class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Nhập lại mật khẩu mới</label>
                <div class="relative">
                  <input id="confirm-login-password" name="confirmLoginPassword" [type]="showConfirmPassword() ? 'text' : 'password'" [(ngModel)]="confirmation" autocomplete="new-password"
                         class="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-2xl text-base sm:text-sm font-semibold text-slate-700 dark:text-slate-200 outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-fuchsia-400 dark:focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-400/10 transition-all shadow-sm"
                         placeholder="Nhập lại chính xác" [disabled]="isSaving()" />
                  <button type="button" (click)="toggleConfirmPassword()" [attr.aria-label]="showConfirmPassword() ? 'Ẩn mật khẩu xác nhận' : 'Hiện mật khẩu xác nhận'" class="absolute inset-y-0 right-0 w-11 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                    <i class="fa-solid" [class.fa-eye]="!showConfirmPassword()" [class.fa-eye-slash]="showConfirmPassword()" aria-hidden="true"></i>
                  </button>
                </div>
              </div>

              <!-- Real-time Checklist -->
              <div class="bg-slate-50/50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-slate-800/50">
                <ul class="text-[12px] space-y-2 font-medium">
                  <li class="flex items-center gap-2 transition-colors" [ngClass]="checkLength() ? 'text-emerald-500' : 'text-slate-400'">
                    <i class="fa-solid" [class.fa-circle-check]="checkLength()" [class.fa-circle]="!checkLength()"></i>
                    <span><strong>Bắt buộc:</strong> ít nhất 8 ký tự</span>
                  </li>
                  <li class="flex items-center gap-2 transition-colors" [ngClass]="checkNoSpaces() ? 'text-blue-500' : 'text-slate-400'">
                    <i class="fa-solid" [class.fa-lightbulb]="checkNoSpaces()" [class.fa-circle]="!checkNoSpaces()"></i>
                    <span><strong>Gợi ý:</strong> không chứa khoảng trắng</span>
                  </li>
                  <li class="flex items-center gap-2 transition-colors" [ngClass]="checkMatch() ? 'text-emerald-500' : 'text-slate-400'">
                    <i class="fa-solid" [class.fa-circle-check]="checkMatch()" [class.fa-circle]="!checkMatch()"></i>
                    <span><strong>Bắt buộc:</strong> xác nhận trùng khớp</span>
                  </li>
                </ul>
              </div>

              @if (errorMsg()) {
                <div role="alert" class="px-4 py-3 rounded-2xl bg-red-50/80 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 text-[13px] font-medium flex items-start gap-2 animate-shake">
                  <i class="fa-solid fa-circle-exclamation mt-0.5"></i>
                  <span>{{errorMsg()}}</span>
                </div>
              }

              <!-- Reassurance Banner -->
              <div class="flex items-start gap-3 px-4 py-3 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 text-blue-700 dark:text-blue-300">
                <i class="fa-solid fa-circle-info mt-0.5 shrink-0"></i>
                <span class="text-xs font-medium leading-relaxed">Mật khẩu này được tạo riêng để dự phòng cho hệ thống LIMS và hoàn toàn <strong>không ảnh hưởng</strong> đến mật khẩu Google hiện tại của bạn.</span>
              </div>
            </div>

            <div class="shrink-0 px-5 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] sm:px-8 sm:py-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/50 space-y-2">
              <button type="submit" [disabled]="isSaving() || !isFormValid()"
                      class="w-full min-h-[44px] py-3 rounded-2xl bg-fuchsia-600 hover:bg-fuchsia-700 disabled:opacity-50 disabled:hover:bg-fuchsia-600 text-white font-bold text-sm shadow-soft-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                @if (isSaving()) {
                  <i class="fa-solid fa-circle-notch fa-spin"></i> Đang lưu...
                } @else {
                  <i class="fa-solid fa-check"></i> Lưu mật khẩu và tiếp tục
                }
              </button>

              @if (auth.needsPasswordSetup()) {
                <button type="button" (click)="logout()" [disabled]="isSaving()"
                        class="w-full min-h-[44px] py-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors">
                  Đăng xuất và thực hiện sau
                </button>
              } @else {
                <button type="button" (click)="close()" [disabled]="isSaving()"
                        class="w-full min-h-[44px] py-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors">
                  Hủy thao tác
                </button>
              }
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
export class PasswordSetupComponent {
  auth = inject(AuthService);

  currentPassword = '';
  password = '';
  confirmation = '';

  showCurrentPassword = signal(false);
  showNewPassword = signal(false);
  showConfirmPassword = signal(false);

  isSaving = signal(false);
  errorMsg = signal('');

  passwordStrength = signal(0); // 0-4

  // These fields are bound with ngModel, so evaluate their checklist state on
  // every change-detection pass instead of caching plain-property values.
  checkLength(): boolean { return this.password.length >= 8; }
  checkNoSpaces(): boolean { return this.password.length > 0 && !/\s/.test(this.password); }
  checkMatch(): boolean { return this.password.length > 0 && this.password === this.confirmation; }

  isFormValid(): boolean {
    return this.checkLength() && this.checkMatch() &&
           (!this.auth.requiresCurrentPassword() || this.currentPassword.length > 0);
  }

  strengthLabel(): string {
    const strength = this.passwordStrength();
    if (!this.password) return 'Chưa nhập';
    if (!this.checkLength()) return 'Cần thêm ký tự';
    return ['Cơ bản', 'Khá', 'Tốt', 'Mạnh'][Math.max(0, strength - 1)] ?? 'Cơ bản';
  }

  strengthColors = computed(() => {
    const s = this.passwordStrength();
    return [
      s >= 1 ? (s === 1 ? 'w-1/4 bg-red-500' : (s === 2 ? 'w-1/4 bg-amber-500' : (s === 3 ? 'w-1/4 bg-yellow-400' : 'w-1/4 bg-emerald-500'))) : 'w-0',
      s >= 2 ? (s === 2 ? 'w-1/4 bg-amber-500' : (s === 3 ? 'w-1/4 bg-yellow-400' : 'w-1/4 bg-emerald-500')) : 'w-0',
      s >= 3 ? (s === 3 ? 'w-1/4 bg-yellow-400' : 'w-1/4 bg-emerald-500') : 'w-0',
      s >= 4 ? 'w-1/4 bg-emerald-500' : 'w-0'
    ];
  });

  toggleCurrentPassword() { this.showCurrentPassword.set(!this.showCurrentPassword()); }
  toggleNewPassword() { this.showNewPassword.set(!this.showNewPassword()); }
  toggleConfirmPassword() { this.showConfirmPassword.set(!this.showConfirmPassword()); }

  onPasswordInput() {
    let strength = 0;
    if (this.password.length >= 8) strength += 1;
    if (this.password.match(/[a-z]+/)) strength += 1;
    if (this.password.match(/[A-Z]+/)) strength += 1;
    if (this.password.match(/[0-9]+/) || this.password.match(/[^a-zA-Z0-9]+/)) strength += 1;
    this.passwordStrength.set(strength);
  }

  async save(): Promise<void> {
    this.errorMsg.set('');
    if (!this.isFormValid()) return;

    this.isSaving.set(true);
    try {
      await this.auth.setLocalPassword(this.password, this.currentPassword || undefined);
      this.resetForm();
    } catch (error: any) {
      this.errorMsg.set(this.errorMessage(error));
    } finally {
      this.isSaving.set(false);
    }
  }

  async logout(): Promise<void> {
    if (this.isSaving()) return;
    await this.auth.logout();
  }

  close(): void {
    if (!this.isSaving()) {
      this.auth.closePasswordSetup();
      this.resetForm();
    }
  }

  private resetForm() {
      this.password = '';
      this.confirmation = '';
      this.currentPassword = '';
      this.passwordStrength.set(0);
      this.errorMsg.set('');
  }

  private errorMessage(error: any): string {
    switch (error?.code) {
      case 'auth/missing-current-password':
        return 'Vui lòng nhập mật khẩu LIMS hiện tại để xác thực.';
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Mật khẩu hiện tại không đúng.';
      case 'auth/requires-recent-login':
        return 'Phiên bảo mật đã cũ. Vui lòng đăng xuất, đăng nhập lại bằng Mật khẩu cũ hoặc Google, sau đó đổi mật khẩu.';
      case 'auth/email-already-in-use':
      case 'auth/credential-already-in-use':
        return 'Email này đã có tài khoản mật khẩu khác. Hãy liên hệ quản trị viên.';
      case 'auth/weak-password':
        return error?.message || 'Mật khẩu chưa đủ mạnh.';
      case 'auth/network-request-failed':
        return 'Không thể kết nối máy chủ. Vui lòng thử lại.';
      default:
        return error?.message || 'Không thể tạo mật khẩu. Vui lòng thử lại.';
    }
  }
}
