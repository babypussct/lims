import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-password-setup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (auth.needsPasswordSetup()) {
      <div class="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-4" role="dialog" aria-modal="true" aria-labelledby="password-setup-title">
        <div class="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl p-6 md:p-8">
          <div class="flex items-start gap-4 mb-6">
            <div class="w-12 h-12 rounded-2xl bg-fuchsia-100 dark:bg-fuchsia-950/50 text-fuchsia-600 dark:text-fuchsia-300 flex items-center justify-center shrink-0">
              <i class="fa-solid fa-key text-xl"></i>
            </div>
            <div>
              <h2 id="password-setup-title" class="text-xl font-black text-slate-800 dark:text-white">Tạo mật khẩu đăng nhập</h2>
              <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Tài khoản Google <strong>{{auth.currentUser()?.email}}</strong> đã đăng nhập thành công.
                Hãy tạo mật khẩu để lần sau có thể đăng nhập bằng Gmail hoặc Google.
              </p>
            </div>
          </div>

          <form (ngSubmit)="save()" class="space-y-4">
            <div>
              <label for="new-login-password" class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">Mật khẩu mới</label>
              <input id="new-login-password" name="newLoginPassword" type="password" [(ngModel)]="password" autocomplete="new-password"
                     class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-500/10"
                     placeholder="Ít nhất 8 ký tự" [disabled]="isSaving()" />
            </div>
            <div>
              <label for="confirm-login-password" class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">Nhập lại mật khẩu</label>
              <input id="confirm-login-password" name="confirmLoginPassword" type="password" [(ngModel)]="confirmation" autocomplete="new-password"
                     class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-500/10"
                     placeholder="Nhập lại chính xác" [disabled]="isSaving()" />
            </div>

            @if (errorMsg()) {
              <div class="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-300 text-xs font-semibold px-4 py-3" aria-live="polite">
                <i class="fa-solid fa-circle-exclamation mr-1"></i>{{errorMsg()}}
              </div>
            }

            <div class="rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 text-blue-700 dark:text-blue-300 text-xs px-4 py-3 leading-relaxed">
              Mật khẩu này chỉ dùng cho LIMS và không thay đổi mật khẩu Google của bạn.
            </div>

            <button type="submit" [disabled]="isSaving()"
                    class="w-full py-3.5 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 disabled:opacity-60 text-white font-bold text-sm transition flex items-center justify-center gap-2">
              @if (isSaving()) { <i class="fa-solid fa-circle-notch fa-spin"></i> Đang lưu... }
              @else { <i class="fa-solid fa-check"></i> Lưu mật khẩu và tiếp tục }
            </button>
          </form>

          <button type="button" (click)="logout()" [disabled]="isSaving()"
                  class="w-full mt-3 py-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition">
            Đăng xuất và thực hiện sau
          </button>
        </div>
      </div>
    }
  `
})
export class PasswordSetupComponent {
  auth = inject(AuthService);
  password = '';
  confirmation = '';
  isSaving = signal(false);
  errorMsg = signal('');

  async save(): Promise<void> {
    this.errorMsg.set('');
    if (this.password !== this.confirmation) {
      this.errorMsg.set('Hai mật khẩu không trùng nhau.');
      return;
    }
    if (this.password.length < 8) {
      this.errorMsg.set('Mật khẩu phải có ít nhất 8 ký tự.');
      return;
    }

    this.isSaving.set(true);
    try {
      await this.auth.setLocalPassword(this.password);
      this.password = '';
      this.confirmation = '';
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

  private errorMessage(error: any): string {
    switch (error?.code) {
      case 'auth/requires-recent-login':
        return 'Phiên Google đã cũ. Vui lòng đăng xuất, đăng nhập Google lại rồi tạo mật khẩu.';
      case 'auth/email-already-in-use':
      case 'auth/credential-already-in-use':
        return 'Email này đã có tài khoản mật khẩu khác. Hãy liên hệ quản trị viên để xử lý liên kết.';
      case 'auth/weak-password':
        return error?.message || 'Mật khẩu chưa đủ mạnh.';
      case 'auth/network-request-failed':
        return 'Không thể kết nối máy chủ. Vui lòng thử lại.';
      default:
        return error?.message || 'Không thể tạo mật khẩu. Vui lòng thử lại.';
    }
  }
}
