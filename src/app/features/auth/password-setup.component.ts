import { CommonModule } from '@angular/common';
import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-password-setup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (auth.isPasswordSetupOpen()) {
      <div class="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-4 animate-fade-in-up" role="dialog" aria-modal="true" aria-labelledby="password-setup-title">
        <div class="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl p-6 md:p-8 relative overflow-hidden">

          <!-- Decorative Top Glow -->
          <div class="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-fuchsia-500/10 to-transparent pointer-events-none"></div>

          <div class="flex items-start gap-4 mb-6 relative z-10">
            <div class="w-12 h-12 rounded-2xl bg-fuchsia-100 dark:bg-fuchsia-950/50 text-fuchsia-600 dark:text-fuchsia-400 flex items-center justify-center shrink-0 shadow-inner">
              <i class="fa-solid fa-shield-halved text-xl"></i>
            </div>
            <div>
              <h2 id="password-setup-title" class="text-xl font-black text-slate-800 dark:text-white tracking-tight">
                @if (!auth.hasPasswordProvider()) { Cài đặt mật khẩu LIMS } @else { Đổi mật khẩu LIMS }
              </h2>
              <p class="text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed font-medium">
                @if (!auth.hasPasswordProvider()) {
                  Tài khoản <strong>{{auth.currentUser()?.email}}</strong> đã sẵn sàng. Hãy tạo mật khẩu dự phòng.
                } @else {
                  Cập nhật mật khẩu cho <strong>{{auth.currentUser()?.email}}</strong>.
                }
              </p>
            </div>
          </div>

          <!-- Password Purpose -->
          <div class="mb-5 rounded-2xl border border-fuchsia-200 dark:border-fuchsia-900/60 bg-fuchsia-50/80 dark:bg-fuchsia-950/25 p-4 relative z-10">
            <div class="flex items-start gap-3">
              <i class="fa-solid fa-key text-fuchsia-600 dark:text-fuchsia-400 mt-0.5 shrink-0"></i>
              <div class="space-y-1.5">
                <p class="text-sm font-black text-fuchsia-900 dark:text-fuchsia-200">Mật khẩu này dùng để làm gì?</p>
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

          <form (ngSubmit)="save()" class="space-y-4 relative z-10">

            <!-- Current Password (Only when changing password) -->
            @if (auth.requiresCurrentPassword()) {
              <div class="group">
                <label for="current-password" class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Mật khẩu hiện tại</label>
                <div class="relative">
                  <input id="current-password" name="currentPassword" [type]="showCurrentPassword() ? 'text' : 'password'" [(ngModel)]="currentPassword" autocomplete="current-password"
                         class="w-full pl-4 pr-11 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-2xl text-sm font-semibold text-slate-700 dark:text-slate-200 outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-fuchsia-400 dark:focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-400/10 transition-all shadow-sm"
                         placeholder="Nhập mật khẩu cũ để xác thực" [disabled]="isSaving()" />
                  <button type="button" (click)="toggleCurrentPassword()" tabindex="-1" class="absolute inset-y-0 right-0 px-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                    <i class="fa-solid" [class.fa-eye]="!showCurrentPassword()" [class.fa-eye-slash]="showCurrentPassword()"></i>
                  </button>
                </div>
              </div>
            }

            <div class="group">
              <label for="new-login-password" class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Mật khẩu mới</label>
              <div class="relative">
                <input id="new-login-password" name="newLoginPassword" [type]="showNewPassword() ? 'text' : 'password'" [(ngModel)]="password" (ngModelChange)="onPasswordInput()" autocomplete="new-password"
                       class="w-full pl-4 pr-11 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-2xl text-sm font-semibold text-slate-700 dark:text-slate-200 outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-fuchsia-400 dark:focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-400/10 transition-all shadow-sm"
                       placeholder="Ít nhất 8 ký tự" [disabled]="isSaving()" />
                <button type="button" (click)="toggleNewPassword()" tabindex="-1" class="absolute inset-y-0 right-0 px-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                  <i class="fa-solid" [class.fa-eye]="!showNewPassword()" [class.fa-eye-slash]="showNewPassword()"></i>
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
                       class="w-full pl-4 pr-11 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-2xl text-sm font-semibold text-slate-700 dark:text-slate-200 outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-fuchsia-400 dark:focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-400/10 transition-all shadow-sm"
                       placeholder="Nhập lại chính xác" [disabled]="isSaving()" />
                <button type="button" (click)="toggleConfirmPassword()" tabindex="-1" class="absolute inset-y-0 right-0 px-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                  <i class="fa-solid" [class.fa-eye]="!showConfirmPassword()" [class.fa-eye-slash]="showConfirmPassword()"></i>
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
              <div class="px-4 py-3 rounded-2xl bg-red-50/80 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 text-[13px] font-medium flex items-start gap-2 animate-shake">
                <i class="fa-solid fa-circle-exclamation mt-0.5"></i>
                <span>{{errorMsg()}}</span>
              </div>
            }

            <!-- Reassurance Banner -->
            <div class="flex items-start gap-3 px-4 py-3 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 text-blue-700 dark:text-blue-300">
              <i class="fa-solid fa-circle-info mt-0.5 shrink-0"></i>
              <span class="text-xs font-medium leading-relaxed">Mật khẩu này được tạo riêng để dự phòng cho hệ thống LIMS và hoàn toàn <strong>không ảnh hưởng</strong> đến mật khẩu Google hiện tại của bạn.</span>
            </div>

            <button type="submit" [disabled]="isSaving() || !isFormValid()"
                    class="w-full py-3.5 rounded-2xl bg-fuchsia-600 hover:bg-fuchsia-700 disabled:opacity-50 disabled:hover:bg-fuchsia-600 text-white font-bold text-sm shadow-soft-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2">
              @if (isSaving()) {
                <i class="fa-solid fa-circle-notch fa-spin"></i> Đang lưu...
              } @else {
                <i class="fa-solid fa-check"></i> Lưu mật khẩu và tiếp tục
              }
            </button>
          </form>

          @if (auth.needsPasswordSetup()) {
            <button type="button" (click)="logout()" [disabled]="isSaving()"
                    class="w-full mt-4 py-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors">
              Đăng xuất và thực hiện sau
            </button>
          } @else {
            <button type="button" (click)="close()" [disabled]="isSaving()"
                    class="w-full mt-4 py-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors">
              Hủy thao tác
            </button>
          }
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
