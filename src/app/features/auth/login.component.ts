
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (!auth.currentUser()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-50 overflow-hidden">
        
        <!-- Abstract Background -->
        <div class="absolute top-0 left-0 w-full h-96 bg-gradient-soft transform -skew-y-6 origin-top-left z-0"></div>
        <div class="absolute bottom-0 right-0 w-64 h-64 bg-fuchsia-200 rounded-full blur-3xl opacity-50 z-0"></div>

        <div class="bg-white rounded-2xl shadow-soft-xl p-8 w-full max-w-sm z-10 relative backdrop-blur-xl border border-white/40">
            <div class="text-center mb-8">
                <h3 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-soft mb-1">LIMS Cloud Pro</h3>
                <p class="text-gray-400 text-sm">Nhập thông tin để đăng nhập</p>
            </div>
            
            <div class="space-y-5 text-left">
                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Email</label>
                    <input type="email" [(ngModel)]="email" (keyup.enter)="login()"
                           class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-100 outline-none transition shadow-soft-md placeholder:text-gray-300" 
                           placeholder="yourname@lims.com"
                           [disabled]="isLoading()">
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Mật khẩu</label>
                    <input type="password" [(ngModel)]="password" (keyup.enter)="login()"
                           class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-100 outline-none transition shadow-soft-md placeholder:text-gray-300" 
                           placeholder="••••••••"
                           [disabled]="isLoading()">
                </div>

                @if (errorMsg()) {
                  <div class="text-red-500 text-xs font-bold text-center bg-red-50 p-3 rounded-xl border border-red-100 animate-bounce-in">
                    <i class="fa-solid fa-circle-exclamation mr-1"></i> {{ errorMsg() }}
                  </div>
                }

                <div class="flex items-center justify-between">
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" class="w-4 h-4 rounded border-gray-300 text-fuchsia-500 focus:ring-fuchsia-500">
                        <span class="text-xs text-gray-500 font-semibold">Ghi nhớ</span>
                    </label>
                </div>

                <button (click)="login()" [disabled]="isLoading()"
                        class="w-full bg-gradient-soft text-white font-bold py-3.5 rounded-xl shadow-soft-md hover:shadow-soft-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed text-xs uppercase tracking-wider">
                  @if (isLoading() && !isGoogleLoading()) { <i class="fa-solid fa-spinner fa-spin"></i> Đang xác thực... } @else { <span>Đăng nhập</span> }
                </button>

                <div class="relative my-6 text-center">
                    <span class="text-[10px] text-gray-400 uppercase bg-white px-2 relative z-10">Hoặc</span>
                    <div class="absolute top-1/2 left-0 w-full border-t border-gray-100 -z-0"></div>
                </div>

                <button (click)="loginGoogle()" [disabled]="isLoading()"
                        class="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold py-3 rounded-xl transition-all flex justify-center gap-3 items-center group shadow-soft-sm">
                    @if (isGoogleLoading()) { <i class="fa-solid fa-spinner fa-spin text-gray-400"></i> } @else { <i class="fa-brands fa-google text-fuchsia-500 text-lg"></i> }
                    <span class="text-xs">Google Workspace</span>
                </button>
            </div>
            
            <div class="mt-8 text-center">
               <p class="text-[10px] text-gray-400">Thiết kế bởi Otada & Creative Tim Design.</p>
            </div>
        </div>
      </div>
    }
  `
})
export class LoginComponent {
  auth = inject(AuthService);
  email = '';
  password = '';
  errorMsg = signal('');
  isLoading = signal(false);
  isGoogleLoading = signal(false);

  async login() {
    if (!this.email || !this.password) { this.errorMsg.set('Nhập email và mật khẩu.'); return; }
    this.isLoading.set(true); this.isGoogleLoading.set(false); this.errorMsg.set('');
    try { await this.auth.login(this.email, this.password); } catch (e: any) { this.handleError(e, false); } finally { this.isLoading.set(false); }
  }

  async loginGoogle() {
    this.isLoading.set(true); this.isGoogleLoading.set(true); this.errorMsg.set('');
    try { await this.auth.loginWithGoogle(); } catch (e: any) { if (e.code !== 'auth/popup-closed-by-user') this.handleError(e, true); } finally { this.isLoading.set(false); this.isGoogleLoading.set(false); }
  }

  private handleError(e: any, isGoogle: boolean) {
      console.error("Auth Error:", e);
      if (e.code === 'auth/invalid-credential') {
          if (isGoogle) {
             this.errorMsg.set('Lỗi Domain (Netlify): Vui lòng thêm domain này vào "Authorized Domains" trong Firebase Authentication.');
          } else {
             this.errorMsg.set('Email hoặc mật khẩu không chính xác.');
          }
      } else if (e.code === 'auth/user-not-found' || e.code === 'auth/wrong-password') {
          this.errorMsg.set('Tài khoản hoặc mật khẩu không đúng.');
          this.password = '';
      } else if (e.code === 'auth/too-many-requests') {
          this.errorMsg.set('Quá nhiều lần thử sai. Vui lòng đợi.');
      } else if (e.code === 'auth/network-request-failed') {
          this.errorMsg.set('Lỗi kết nối mạng. Kiểm tra internet.');
      } else if (e.code === 'auth/popup-blocked') {
          this.errorMsg.set('Trình duyệt đã chặn cửa sổ bật lên (Popup).');
      } else if (e.code === 'auth/operation-not-allowed') {
          this.errorMsg.set('Lỗi cấu hình: Google Login chưa được bật.');
      } else {
          this.errorMsg.set('Lỗi: ' + (e.message || e.code));
      }
  }
}
