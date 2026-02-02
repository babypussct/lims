
import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { QrScannerComponent } from '../../shared/components/qr-scanner/qr-scanner.component';

@Component({
  selector: 'app-mobile-qr-login',
  standalone: true,
  imports: [CommonModule, FormsModule, QrScannerComponent],
  template: `
    <div class="h-full flex flex-col bg-black relative">
        <!-- Header -->
        <div class="absolute top-0 left-0 w-full p-4 z-20 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
            <button (click)="cancel()" class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition">
                <i class="fa-solid fa-arrow-left"></i>
            </button>
            <span class="text-white font-bold text-sm">Quét mã đăng nhập</span>
            <div class="w-10"></div>
        </div>

        @if (!scanData()) {
            <!-- SCANNER -->
            <div class="flex-1 relative">
                <app-qr-scanner (scanSuccess)="onScan($event)" (scanError)="onError($event)"></app-qr-scanner>
            </div>
        } @else {
            <!-- CONFIRM FORM -->
            <div class="flex-1 bg-slate-50 flex flex-col items-center justify-center p-6 animate-slide-up">
                
                <!-- Success Icon -->
                <div class="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-5xl mb-6 shadow-lg shadow-green-200 animate-bounce-in">
                    <i class="fa-solid fa-desktop"></i>
                </div>
                
                <h2 class="text-xl font-black text-slate-800 text-center mb-2">Đăng nhập Máy tính?</h2>
                <p class="text-sm text-slate-500 text-center mb-8 px-4">Xác nhận cấp quyền truy cập cho thiết bị mới.</p>

                <!-- User Info Card -->
                <div class="w-full max-w-sm bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {{ auth.currentUser()?.displayName?.charAt(0) }}
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="text-sm font-bold text-slate-800 truncate">{{ auth.currentUser()?.displayName }}</div>
                        <div class="text-xs text-slate-400 truncate">{{ auth.currentUser()?.email }}</div>
                    </div>
                    <div class="text-green-500 text-xl"><i class="fa-solid fa-circle-check"></i></div>
                </div>

                <!-- Input is hidden if credentials found -->
                @if (!hasCachedCreds()) {
                    <div class="w-full max-w-sm bg-white p-5 rounded-2xl shadow-sm border border-slate-200 mb-6">
                        <label class="text-xs font-bold text-slate-500 uppercase block mb-2">Nhập mật khẩu để xác nhận</label>
                        <div class="relative">
                            <input type="password" [(ngModel)]="confirmPassword" placeholder="Mật khẩu..." 
                                   class="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-blue-500 transition">
                            <i class="fa-solid fa-lock absolute right-4 top-3.5 text-slate-400"></i>
                        </div>
                    </div>
                }

                <div class="w-full max-w-sm flex gap-3 mt-auto mb-6">
                    <button (click)="cancel()" class="flex-1 py-4 rounded-xl border border-slate-200 font-bold text-slate-600 bg-white hover:bg-slate-50 transition">Hủy</button>
                    
                    <button (click)="approve()" [disabled]="(!confirmPassword && !hasCachedCreds()) || isProcessing()" 
                            class="flex-[2] py-4 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2 text-base">
                        @if(isProcessing()) { <i class="fa-solid fa-spinner fa-spin"></i> } 
                        @else { <i class="fa-solid fa-fingerprint"></i> }
                        Đồng ý & Đăng nhập
                    </button>
                </div>
            </div>
        }
    </div>
  `,
  styles: [`
    @keyframes bounceIn { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
    .animate-bounce-in { animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
  `]
})
export class MobileQrLoginComponent {
  auth = inject(AuthService);
  router = inject(Router);
  toast = inject(ToastService);

  scanData = signal<{sessionId: string, key: string} | null>(null);
  confirmPassword = '';
  isProcessing = signal(false);
  hasCachedCreds = signal(false);

  constructor() {
      // Check for cached credentials immediately
      const creds = this.auth.getLocalCredentials();
      if (creds && creds.pass) {
          this.hasCachedCreds.set(true);
          this.confirmPassword = creds.pass; // Pre-fill internally
      }
  }

  onScan(raw: string) {
      if (this.scanData()) return;
      
      console.log("Scanned:", raw);
      const parts = raw.split('|');
      
      if (parts.length === 2 && parts[0].startsWith('sess_')) {
          this.scanData.set({ sessionId: parts[0], key: parts[1] });
      } else {
          this.toast.show('Mã QR không hợp lệ. Vui lòng quét mã trên màn hình đăng nhập.', 'error');
      }
  }

  onError(err: any) {
      // Handle camera errors silently mostly
  }

  cancel() {
      this.scanData.set(null);
      // Reset password if it wasn't cached
      if (!this.hasCachedCreds()) this.confirmPassword = '';
      this.router.navigate(['/dashboard']);
  }

  async approve() {
      if (!this.confirmPassword) return;
      
      const data = this.scanData();
      const currentUser = this.auth.currentUser();
      
      if (!data || !currentUser) return;

      this.isProcessing.set(true);
      try {
          // Encrypt Password using the Key from QR (XOR for client-side demo)
          // Note: The key comes from the Desktop's QR code.
          const encrypted = this.xorEncrypt(this.confirmPassword, data.key);
          
          await this.auth.approveAuthSession(
              data.sessionId, 
              currentUser.email, 
              encrypted, 
              navigator.userAgent
          );
          
          this.toast.show('Đã gửi xác nhận đăng nhập!', 'success');
          // If using cached creds, maybe update them? No need if login worked.
          
          setTimeout(() => this.router.navigate(['/dashboard']), 1000);
      } catch (e) {
          this.toast.show('Lỗi kết nối. Thử lại.', 'error');
          this.isProcessing.set(false);
      }
  }

  // Simple XOR Cipher (Matches Login Component Logic)
  xorEncrypt(input: string, key: string): string {
      let result = '';
      for (let i = 0; i < input.length; i++) {
          result += String.fromCharCode(input.charCodeAt(i) ^ key.charCodeAt(i % key.length));
      }
      return btoa(result); // Base64 encode
  }
}
