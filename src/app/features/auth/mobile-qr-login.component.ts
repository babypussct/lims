
import { Component, inject, signal } from '@angular/core';
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
                <div class="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-4xl mb-6 shadow-lg shadow-blue-200">
                    <i class="fa-solid fa-desktop"></i>
                </div>
                
                <h2 class="text-xl font-black text-slate-800 text-center mb-2">Đăng nhập Máy tính?</h2>
                <p class="text-sm text-slate-500 text-center mb-8 px-4">Bạn đang cấp quyền truy cập cho phiên làm việc mới trên máy tính.</p>

                <div class="w-full max-w-sm bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                    <label class="text-xs font-bold text-slate-500 uppercase block mb-2">Xác nhận Mật khẩu của bạn</label>
                    <div class="relative">
                        <input type="password" [(ngModel)]="confirmPassword" placeholder="Nhập mật khẩu..." 
                               class="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-blue-500 transition">
                        <i class="fa-solid fa-lock absolute right-4 top-3.5 text-slate-400"></i>
                    </div>
                    <p class="text-[10px] text-slate-400 mt-2 italic">
                        <i class="fa-solid fa-shield-halved mr-1"></i> Mật khẩu sẽ được mã hóa và gửi trực tiếp đến máy tính qua kênh an toàn.
                    </p>
                </div>

                <div class="w-full max-w-sm flex gap-3 mt-6">
                    <button (click)="cancel()" class="flex-1 py-3.5 rounded-xl border border-slate-200 font-bold text-slate-600 bg-white hover:bg-slate-50 transition">Hủy</button>
                    <button (click)="approve()" [disabled]="!confirmPassword || isProcessing()" 
                            class="flex-[2] py-3.5 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2">
                        @if(isProcessing()) { <i class="fa-solid fa-spinner fa-spin"></i> } 
                        @else { <i class="fa-solid fa-paper-plane"></i> }
                        Xác nhận
                    </button>
                </div>
            </div>
        }
    </div>
  `
})
export class MobileQrLoginComponent {
  auth = inject(AuthService);
  router = inject(Router);
  toast = inject(ToastService);

  scanData = signal<{sessionId: string, key: string} | null>(null);
  confirmPassword = '';
  isProcessing = signal(false);

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
      this.confirmPassword = '';
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
          const encrypted = this.xorEncrypt(this.confirmPassword, data.key);
          
          await this.auth.approveAuthSession(
              data.sessionId, 
              currentUser.email, 
              encrypted, 
              navigator.userAgent
          );
          
          this.toast.show('Đã gửi xác nhận đăng nhập!', 'success');
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
