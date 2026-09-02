import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { QrScannerComponent } from '../../shared/components/qr-scanner/qr-scanner.component';
import { AppButtonComponent } from '../../shared/components/ui/button/button.component';

// Format mã QR mới (secure): "LIMS_QR|{sessionId}|{nonce}"
// Mobile gửi Firebase ID Token lên /api/qr/approve — KHÔNG truyền password.
interface QrPayload {
  sessionId: string;
  nonce: string;
}

@Component({
  selector: 'app-mobile-qr-login',
  standalone: true,
  imports: [CommonModule, QrScannerComponent, AppButtonComponent],
  template: `
    <div class="h-full flex flex-col bg-black relative">
        <!-- Header -->
        <div class="absolute top-0 left-0 w-full p-4 z-20 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
            <button type="button" (click)="cancel()" aria-label="Quay lại" class="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition">
                <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
            </button>
            <span class="text-white font-bold text-sm">Quét mã đăng nhập</span>
            <div class="w-10"></div>
        </div>

        @if (!scanData()) {
            <!-- SCANNER -->
            <div class="flex-1 relative">
                <app-qr-scanner (scanSuccess)="onScan($event)" (scanError)="onError($event)"></app-qr-scanner>
            </div>
        } @else if (isProcessing()) {
            <!-- PROCESSING STATE -->
            <div class="flex-1 bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6">
                <div class="w-24 h-24 bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-5xl mb-6 shadow-lg shadow-blue-200/50 dark:shadow-blue-950/40">
                    <i class="fa-solid fa-spinner fa-spin"></i>
                </div>
                <h2 class="text-xl font-black text-slate-800 dark:text-slate-100 text-center mb-2">Đang xác thực...</h2>
                <p class="text-sm text-slate-500 dark:text-slate-400 text-center px-4">Đang gửi xác nhận an toàn đến máy tính.</p>
            </div>
        } @else {
            <!-- CONFIRM FORM -->
            <div class="flex-1 bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 animate-slide-up">

                <!-- Success Icon -->
                <div class="w-24 h-24 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center text-5xl mb-6 shadow-lg shadow-emerald-200/50 dark:shadow-emerald-950/40 animate-bounce-in">
                    <i class="fa-solid fa-desktop"></i>
                </div>

                <h2 class="text-xl font-black text-slate-800 dark:text-slate-100 text-center mb-2">Đăng nhập máy tính?</h2>
                <p class="text-sm text-slate-500 dark:text-slate-400 text-center mb-8 px-4">Xác nhận để cấp quyền truy cập an toàn cho thiết bị này.</p>

                <!-- User Info Card -->
                <div class="w-full max-w-sm bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 mb-6 flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                        {{ auth.currentUser()?.displayName?.charAt(0) }}
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{{ auth.currentUser()?.displayName }}</div>
                        <div class="text-xs text-slate-400 dark:text-slate-500 truncate">{{ auth.currentUser()?.email }}</div>
                    </div>
                    <div class="text-emerald-500 text-xl"><i class="fa-solid fa-circle-check"></i></div>
                </div>

                <!-- Security Notice -->
                <div class="w-full max-w-sm bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 rounded-2xl p-4 mb-6 flex items-start gap-3">
                    <i class="fa-solid fa-shield-halved text-emerald-600 dark:text-emerald-400 mt-0.5"></i>
                    <p class="text-xs text-emerald-700 dark:text-emerald-300">
                        Xác thực bằng tài khoản của bạn — không cần nhập mật khẩu.
                        Phiên đăng nhập sẽ hết hạn sau 5 phút nếu không xác nhận.
                    </p>
                </div>

                <div class="w-full max-w-sm flex gap-3 mt-auto mb-6">
                    <app-button class="flex-1" variant="secondary" [fullWidth]="true" (click)="cancel()">Hủy</app-button>

                    <app-button class="flex-[2]" [fullWidth]="true" (click)="approve()" [disabled]="isProcessing()" [loading]="isProcessing()">
                        <i class="fa-solid fa-fingerprint"></i>
                        Đồng ý và đăng nhập
                    </app-button>
                </div>
            </div>
        }
    </div>
  `,
  styles: [`
    @keyframes bounceIn { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
    .animate-bounce-in { animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .animate-slide-up { animation: slideUp 0.3s ease-out; }
  `]
})
export class MobileQrLoginComponent implements OnInit {
  auth = inject(AuthService);
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  toast = inject(ToastService);

  scanData = signal<QrPayload | null>(null);
  isProcessing = signal(false);

  ngOnInit() {
      // Hỗ trợ QR code được pass qua query params (ví dụ từ Global Scanner)
      this.route.queryParams.subscribe(params => {
          if (params['qr']) {
              this.onScan(params['qr']);
          }
      });
  }

  onScan(raw: string) {
      if (this.scanData() || this.isProcessing()) return;

      // Format mới: "LIMS_QR|{sessionId}|{nonce}"
      const parts = raw.split('|');
      if (parts.length === 3 && parts[0] === 'LIMS_QR' && parts[1] && parts[2]) {
          const sessionId = parts[1];
          const nonce = parts[2];
          // Validation cơ bản: nonce phải đủ dài (32+ chars từ crypto.getRandomValues)
          if (nonce.length < 16) {
              this.toast.show('Mã QR không hợp lệ hoặc đã hết hạn.', 'error');
              return;
          }
          this.scanData.set({ sessionId, nonce });
      } else {
          this.toast.show('Mã QR không đúng định dạng. Vui lòng quét mã trên màn hình đăng nhập.', 'error');
      }
  }

  onError(_err: any) {
      // Xử lý lỗi camera một cách yên lặng — user có thể thử lại
  }

  cancel() {
      this.scanData.set(null);
      this.router.navigate(['/dashboard']);
  }

  async approve() {
      const data = this.scanData();
      if (!data || this.isProcessing()) return;

      this.isProcessing.set(true);
      try {
          // Lấy Firebase ID Token của user hiện tại (không truyền password)
          const idToken = await this.auth.getIdToken(false);
          if (!idToken) {
              this.toast.show('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.', 'error');
              this.isProcessing.set(false);
              return;
          }

          // Gửi ID Token lên server để xác thực — server tạo customToken cho Desktop
          const response = await fetch('/api/qr/approve', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  sessionId: data.sessionId,
                  nonce: data.nonce,
                  idToken
              })
          });

          if (!response.ok) {
              const err = await response.json().catch(() => ({ error: 'Lỗi không xác định' }));
              throw new Error(err.error || `HTTP ${response.status}`);
          }

          this.toast.show('Đã xác nhận đăng nhập thành công!', 'success');
          setTimeout(() => this.router.navigate(['/dashboard']), 1200);
      } catch (e: any) {
          console.error('[QR Approve] Error:', e);
          const msg = e?.message?.includes('expired')
              ? 'Mã QR đã hết hạn. Vui lòng quét lại mã mới.'
              : 'Lỗi kết nối. Vui lòng thử lại.';
          this.toast.show(msg, 'error');
          this.scanData.set(null);
          this.isProcessing.set(false);
      }
  }
}
