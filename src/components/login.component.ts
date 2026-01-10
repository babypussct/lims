
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (!auth.currentUser()) {
      <div class="fixed inset-0 z-50 bg-slate-900 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center">
            <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600 text-3xl">
              <i class="fa-solid fa-shield-halved"></i>
            </div>
            <h2 class="text-2xl font-bold text-slate-800 mb-1">LIMS Cloud V4.0</h2>
            <p class="text-slate-500 mb-6 text-sm">Hệ thống Quản lý Phòng thí nghiệm</p>
            
            <div class="space-y-4 text-left">
                <div>
                    <label class="block text-xs font-bold text-slate-600 uppercase mb-1">Email</label>
                    <input type="email" [(ngModel)]="email" (keyup.enter)="login()"
                           class="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" 
                           placeholder="nhanvien@lims.com"
                           [disabled]="isLoading()">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-600 uppercase mb-1">Mật khẩu</label>
                    <input type="password" [(ngModel)]="password" (keyup.enter)="login()"
                           class="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" 
                           placeholder="••••••••"
                           [disabled]="isLoading()">
                </div>

                @if (errorMsg()) {
                  <div class="text-red-500 text-sm font-bold text-center bg-red-50 p-2 rounded border border-red-100 animate-pulse">
                    <i class="fa-solid fa-circle-exclamation mr-1"></i> {{ errorMsg() }}
                  </div>
                }

                <button (click)="login()" 
                        [disabled]="isLoading()"
                        class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-200 transition flex justify-center gap-2 items-center">
                  @if (isLoading() && !isGoogleLoading()) { 
                    <i class="fa-solid fa-spinner fa-spin"></i> Đang xử lý...
                  } @else {
                    <span>Đăng nhập</span>
                  }
                </button>

                <!-- Separator -->
                <div class="relative my-4">
                    <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-slate-200"></div>
                    </div>
                    <div class="relative flex justify-center text-xs uppercase">
                        <span class="bg-white px-2 text-slate-400 font-semibold">Hoặc</span>
                    </div>
                </div>

                <!-- Google Login Button -->
                <button (click)="loginGoogle()" 
                        [disabled]="isLoading()"
                        class="w-full bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-lg transition flex justify-center gap-3 items-center group relative overflow-hidden">
                    @if (isGoogleLoading()) {
                       <i class="fa-solid fa-spinner fa-spin text-slate-500"></i>
                    } @else {
                       <i class="fa-brands fa-google text-red-500 text-lg group-hover:scale-110 transition"></i>
                    }
                    <span>Tiếp tục với Google</span>
                </button>
                
                <div class="text-center mt-4">
                   <p class="text-xs text-slate-400">Chưa có tài khoản? Vui lòng liên hệ Quản lý.</p>
                </div>
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
    if (!this.email || !this.password) {
        this.errorMsg.set('Vui lòng nhập đầy đủ thông tin');
        return;
    }

    this.isLoading.set(true);
    this.isGoogleLoading.set(false);
    this.errorMsg.set('');

    try {
      await this.auth.login(this.email, this.password);
    } catch (e: any) {
      console.error("Login Error:", e);
      this.handleError(e, false);
    } finally {
      this.isLoading.set(false);
    }
  }

  async loginGoogle() {
    this.isLoading.set(true);
    this.isGoogleLoading.set(true);
    this.errorMsg.set('');

    try {
      await this.auth.loginWithGoogle();
    } catch (e: any) {
      console.error("Google Login Error:", e);
      if (e.code === 'auth/popup-closed-by-user') {
        // User closed popup, just stop loading
      } else {
        this.handleError(e, true);
      }
    } finally {
      this.isLoading.set(false);
      this.isGoogleLoading.set(false);
    }
  }

  private handleError(e: any, isGoogle: boolean) {
      if (e.code === 'auth/invalid-credential') {
          if (isGoogle) {
             this.errorMsg.set('Lỗi cấu hình: Google Provider chưa được bật trong Firebase Console.');
          } else {
             this.errorMsg.set('Email hoặc mật khẩu không chính xác.');
          }
      } else if (e.code === 'auth/user-not-found' || e.code === 'auth/wrong-password') {
          this.errorMsg.set('Tài khoản hoặc mật khẩu không đúng!');
          this.password = '';
      } else if (e.code === 'auth/too-many-requests') {
          this.errorMsg.set('Quá nhiều lần thử sai. Vui lòng đợi.');
      } else if (e.code === 'auth/network-request-failed') {
          this.errorMsg.set('Lỗi kết nối mạng. Kiểm tra internet.');
      } else if (e.code === 'auth/popup-blocked') {
          this.errorMsg.set('Trình duyệt đã chặn cửa sổ bật lên (Popup).');
      } else {
          this.errorMsg.set('Lỗi: ' + (e.message || e.code));
      }
  }
}
