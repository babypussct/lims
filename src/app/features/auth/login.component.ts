
import { Component, inject, signal, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { Unsubscribe } from 'firebase/firestore';

declare var QRious: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (!auth.currentUser()) {
      <div class="min-h-screen w-full flex bg-white overflow-hidden relative">
        
        <!-- LEFT SIDE: Atmosphere -->
        <div class="hidden lg:flex lg:w-3/5 relative bg-slate-900 overflow-hidden">
            <div class="absolute inset-0 bg-cover bg-center opacity-60 scale-105" 
                 style="background-image: url('https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=2070&auto=format&fit=crop');">
            </div>
            <div class="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-blue-900/80 to-slate-900/90"></div>
            <div class="relative z-10 w-full h-full flex flex-col justify-between p-12 text-white">
                <div>
                    <div class="flex items-center gap-3 mb-6">
                        <div class="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                            <i class="fa-solid fa-flask text-xl"></i>
                        </div>
                        <span class="text-lg font-bold tracking-wide text-white/90">LIMS Cloud Pro</span>
                    </div>
                    <h1 class="text-5xl font-black leading-tight max-w-xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
                        Precision in <br>Every Drop.
                    </h1>
                    <p class="text-blue-100 text-lg max-w-md leading-relaxed font-light">
                        Hệ thống quản lý phòng thí nghiệm hiện đại, tuân thủ tiêu chuẩn ISO/IEC 17025.
                    </p>
                </div>
                <div class="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 max-w-lg">
                    <div class="flex items-center gap-1 text-yellow-400 mb-2 text-xs">
                        <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                    </div>
                    <p class="text-sm text-slate-200 italic mb-4">"Nền tảng giúp chúng tôi tối ưu hóa quy trình kiểm nghiệm và truy xuất nguồn gốc một cách tuyệt vời."</p>
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-xs">L</div>
                        <div>
                            <div class="text-xs font-bold">Lab Manager</div>
                            <div class="text-[10px] text-slate-400">Quality Control Dept.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- RIGHT SIDE: Interaction -->
        <div class="w-full lg:w-2/5 flex flex-col relative bg-white">
            
            <div class="lg:hidden p-6 flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                    <i class="fa-solid fa-flask text-sm"></i>
                </div>
                <span class="font-bold text-slate-700">LIMS Cloud</span>
            </div>

            <div class="flex-1 flex flex-col justify-center px-8 md:px-16 py-8 relative">
                
                <!-- LOGIN MODE: PASSWORD -->
                @if (mode() === 'password') {
                    <div class="animate-fade-in-up w-full max-w-sm mx-auto">
                        <div class="mb-10">
                            <h2 class="text-3xl font-black text-slate-800 mb-2">Xin chào trở lại!</h2>
                            <p class="text-slate-500 text-sm">Đăng nhập để tiếp tục phiên làm việc.</p>
                        </div>

                        <div class="space-y-5">
                            <div class="group">
                                <label class="block text-xs font-bold text-slate-600 uppercase mb-2 ml-1">Email</label>
                                <div class="relative">
                                    <i class="fa-regular fa-envelope absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors"></i>
                                    <input type="email" [(ngModel)]="email" (keyup.enter)="login()"
                                           class="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition shadow-sm placeholder:font-normal" 
                                           [class.border-red-500]="errorMsg()"
                                           placeholder="name@example.com"
                                           [disabled]="isLoading()">
                                </div>
                            </div>

                            <div class="group">
                                <div class="flex justify-between items-center mb-2 ml-1">
                                    <label class="block text-xs font-bold text-slate-600 uppercase">Mật khẩu</label>
                                    <a href="#" class="text-xs font-bold text-indigo-600 hover:text-indigo-800">Quên mật khẩu?</a>
                                </div>
                                <div class="relative">
                                    <i class="fa-solid fa-lock absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors"></i>
                                    <input type="password" [(ngModel)]="password" (keyup.enter)="login()"
                                           class="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition shadow-sm placeholder:font-normal" 
                                           [class.border-red-500]="errorMsg()"
                                           placeholder="••••••••"
                                           [disabled]="isLoading()">
                                </div>
                            </div>

                            @if (errorMsg()) {
                                <div class="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold flex items-center gap-2 animate-shake">
                                    <i class="fa-solid fa-circle-exclamation"></i> {{ errorMsg() }}
                                </div>
                            }

                            <button (click)="login()" [disabled]="isLoading()"
                                    class="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                @if (isLoading() && !isGoogleLoading()) { <i class="fa-solid fa-circle-notch fa-spin"></i> }
                                @else { <span>Đăng nhập</span> <i class="fa-solid fa-arrow-right"></i> }
                            </button>

                            <div class="relative my-6 text-center">
                                <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-slate-100"></div></div>
                                <span class="relative bg-white px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hoặc</span>
                            </div>

                            <button (click)="loginGoogle()" [disabled]="isLoading()"
                                    class="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl font-bold text-sm transition flex items-center justify-center gap-3 active:scale-95 group">
                                @if (isGoogleLoading()) { <i class="fa-solid fa-spinner fa-spin text-slate-400"></i> } 
                                @else { <i class="fa-brands fa-google text-indigo-500 text-lg group-hover:scale-110 transition-transform"></i> }
                                <span>Google Workspace</span>
                            </button>
                        </div>

                        <div class="mt-8 text-center">
                            <button (click)="switchMode('qr')" class="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-xs transition px-4 py-2 rounded-full hover:bg-indigo-50 border border-transparent hover:border-indigo-100">
                                <i class="fa-solid fa-qrcode text-lg"></i>
                                <span>Đăng nhập bằng QR Code (Mobile)</span>
                            </button>
                        </div>
                    </div>
                }

                <!-- LOGIN MODE: QR SHOW (HANDSHAKE) -->
                @if (mode() === 'qr') {
                    <div class="animate-fade-in-up w-full max-w-sm mx-auto flex flex-col items-center text-center">
                        <h2 class="text-2xl font-black text-slate-800 mb-2">Quét mã để đăng nhập</h2>
                        <p class="text-slate-500 text-sm mb-8">Sử dụng ứng dụng LIMS trên điện thoại để quét mã này.</p>

                        <div class="bg-white p-4 rounded-3xl shadow-xl border border-slate-100 relative group">
                            <canvas #qrCanvas class="w-64 h-64"></canvas>
                            
                            <!-- Overlay status -->
                            @if (qrStatus() === 'approved') {
                                <div class="absolute inset-0 bg-white/90 flex flex-col items-center justify-center rounded-2xl animate-fade-in">
                                    <div class="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mb-2"><i class="fa-solid fa-check"></i></div>
                                    <span class="font-bold text-green-700">Thành công!</span>
                                    <span class="text-xs text-green-600">Đang đăng nhập...</span>
                                </div>
                            }
                            @if (qrStatus() === 'expired') {
                                <div class="absolute inset-0 bg-white/90 flex flex-col items-center justify-center rounded-2xl animate-fade-in cursor-pointer" (click)="generateSession()">
                                    <div class="w-16 h-16 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center text-3xl mb-2"><i class="fa-solid fa-rotate-right"></i></div>
                                    <span class="font-bold text-slate-700">Mã hết hạn</span>
                                    <span class="text-xs text-blue-600 font-bold">Nhấn để tải lại</span>
                                </div>
                            }
                            <!-- Error Overlay (New) -->
                            @if (errorMsg() && mode() === 'qr') {
                                <div class="absolute inset-0 bg-white/95 flex flex-col items-center justify-center rounded-2xl animate-fade-in p-4 text-center">
                                    <div class="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-2xl mb-2"><i class="fa-solid fa-triangle-exclamation"></i></div>
                                    <span class="font-bold text-red-700 text-sm">Lỗi kết nối</span>
                                    <span class="text-[10px] text-red-500 mt-1 mb-2">{{ errorMsg() }}</span>
                                    <button (click)="generateSession()" class="px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-bold hover:bg-red-100 transition">Thử lại</button>
                                </div>
                            }
                        </div>

                        <div class="mt-8 flex flex-col gap-2">
                            <div class="flex items-center gap-2 justify-center text-xs font-bold text-slate-400">
                                <div class="w-2 h-2 rounded-full" [class.bg-emerald-500]="qrStatus() === 'waiting'" [class.animate-pulse]="qrStatus() === 'waiting'" [class.bg-slate-300]="qrStatus() !== 'waiting'"></div>
                                {{ qrStatus() === 'waiting' ? 'Đang chờ điện thoại quét...' : (qrStatus() === 'scanned' ? 'Đã quét! Vui lòng xác nhận trên điện thoại.' : 'Trạng thái: ' + qrStatus()) }}
                            </div>
                            <button (click)="switchMode('password')" class="text-indigo-600 hover:text-indigo-800 font-bold text-sm transition mt-4">
                                <i class="fa-solid fa-arrow-left mr-1"></i> Quay lại Mật khẩu
                            </button>
                        </div>
                    </div>
                }

            </div>
            
            <div class="p-6 text-center text-[10px] text-slate-400 border-t border-slate-50">
                &copy; {{year}} Otada Technology. All rights reserved.<br>
                <span class="font-medium text-slate-500">LIMS Cloud Pro v1.0</span>
            </div>
        </div>
      </div>
    }
  `,
  styles: [`
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
    
    @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
    .animate-shake { animation: shake 0.3s ease-in-out; }
  `]
})
export class LoginComponent implements OnDestroy {
  auth = inject(AuthService);
  toast = inject(ToastService);
  
  mode = signal<'password' | 'qr'>('password');
  
  email = '';
  password = '';
  errorMsg = signal('');
  isLoading = signal(false);
  isGoogleLoading = signal(false);
  year = new Date().getFullYear();

  // QR Handshake State
  @ViewChild('qrCanvas') qrCanvas!: ElementRef;
  qrStatus = signal<'waiting' | 'scanned' | 'approved' | 'expired'>('waiting');
  currentSessionId: string | null = null;
  currentSecretKey: string | null = null;
  private sessionSub?: Unsubscribe;
  private expiryTimer: any;

  ngOnDestroy() {
      this.cleanupSession();
  }

  switchMode(m: 'password' | 'qr') {
      this.mode.set(m);
      this.errorMsg.set('');
      if (m === 'qr') {
          setTimeout(() => this.generateSession(), 100);
      } else {
          this.cleanupSession();
      }
  }

  async generateSession() {
      this.cleanupSession();
      this.errorMsg.set('');
      
      // 1. Generate ID and Secret Key
      this.currentSessionId = 'sess_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
      this.currentSecretKey = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      this.qrStatus.set('waiting');

      // 2. Display QR: ID|Key
      if (typeof QRious !== 'undefined') {
          const qrData = `${this.currentSessionId}|${this.currentSecretKey}`;
          new QRious({
              element: this.qrCanvas.nativeElement,
              value: qrData,
              size: 256,
              level: 'M'
          });
      }

      // 3. Create Session in Firestore (Handshake)
      // IMPORTANT: If Firestore Rules are strict, this step will FAIL for unauthenticated users (PC).
      // We must catch this error.
      try {
          await this.auth.createAuthSession(this.currentSessionId);
      } catch (e: any) {
          console.error("QR Session Init Error:", e);
          if (e.code === 'permission-denied') {
              this.errorMsg.set('Lỗi quyền truy cập! Vui lòng cập nhật Firestore Rules (xem Config).');
          } else {
              this.errorMsg.set('Không thể tạo phiên kết nối. Vui lòng thử lại.');
          }
          return;
      }

      // 4. Listen for Approval
      try {
          this.sessionSub = this.auth.listenToAuthSession(this.currentSessionId, (session) => {
              if (session.status === 'approved' && session.encryptedCreds) {
                  this.handleApproval(session.encryptedCreds);
              }
          });
      } catch (e) {
          console.error("Listener Error:", e);
      }

      // 5. Expiry Timer (2 mins)
      this.expiryTimer = setTimeout(() => {
          this.qrStatus.set('expired');
          this.cleanupSession(false); // Keep ID for display but stop listening
      }, 120000);
  }

  cleanupSession(clearId = true) {
      if (this.sessionSub) { this.sessionSub(); this.sessionSub = undefined; }
      if (this.expiryTimer) { clearTimeout(this.expiryTimer); this.expiryTimer = null; }
      if (this.currentSessionId && clearId) {
          // Attempt cleanup, but ignore errors if permission/network fails
          this.auth.deleteAuthSession(this.currentSessionId).catch(() => {});
          this.currentSessionId = null;
      }
  }

  async handleApproval(encryptedData: string) {
      this.qrStatus.set('approved');
      
      // 1. Decrypt: Simple XOR with Secret Key (Symmetric)
      // Note: This relies on the Secret Key never leaving this client except via the QR visual
      try {
          const [userEmail, cipherText] = encryptedData.split('|');
          if (!this.currentSecretKey) throw new Error("Missing key");
          
          const decryptedPass = this.xorDecrypt(cipherText, this.currentSecretKey);
          
          if (userEmail && decryptedPass) {
              // 2. Perform Login
              await this.auth.login(userEmail, decryptedPass);
              this.toast.show('Đăng nhập qua QR thành công!', 'success');
          }
      } catch (e) {
          console.error(e);
          this.toast.show('Lỗi giải mã phiên đăng nhập.', 'error');
          this.generateSession(); // Retry
      } finally {
          this.cleanupSession();
      }
  }

  // Simple XOR Cipher for Demo (Client-side Handshake)
  // In production, use Web Crypto API or a library like 'crypto-js' for AES
  xorDecrypt(input: string, key: string): string {
      try {
          const decoded = atob(input); // Base64 decode
          let result = '';
          for (let i = 0; i < decoded.length; i++) {
              result += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
          }
          return result;
      } catch(e) { return ''; }
  }

  async login() {
    if (!this.email || !this.password) { this.errorMsg.set('Vui lòng nhập đầy đủ thông tin.'); return; }
    this.isLoading.set(true); this.isGoogleLoading.set(false); this.errorMsg.set('');
    try { 
        await this.auth.login(this.email, this.password); 
    } catch (e: any) { 
        this.handleError(e, false); 
    } finally { 
        this.isLoading.set(false); 
    }
  }

  async loginGoogle() {
    this.isLoading.set(true); this.isGoogleLoading.set(true); this.errorMsg.set('');
    try { 
        await this.auth.loginWithGoogle(); 
    } catch (e: any) { 
        if (e.code !== 'auth/popup-closed-by-user') this.handleError(e, true); 
    } finally { 
        this.isLoading.set(false); this.isGoogleLoading.set(false); 
    }
  }

  private handleError(e: any, isGoogle: boolean) {
      const code = e.code || '';
      const msg = e.message || '';

      if (code === 'auth/invalid-credential' || msg.includes('invalid-credential')) {
          this.errorMsg.set('Thông tin đăng nhập không chính xác.');
      } else if (code === 'auth/user-not-found' || code === 'auth/wrong-password') {
          this.errorMsg.set('Email hoặc mật khẩu không đúng.');
          this.password = '';
      } else if (code === 'auth/too-many-requests') {
          this.errorMsg.set('Tạm khóa do đăng nhập sai nhiều lần. Thử lại sau.');
      } else if (code === 'auth/network-request-failed') {
          this.errorMsg.set('Lỗi kết nối mạng.');
      } else if (code === 'auth/popup-blocked') {
          this.errorMsg.set('Trình duyệt đã chặn cửa sổ Popup.');
      } else {
          this.errorMsg.set('Lỗi: ' + (code || 'Không xác định'));
      }
  }
}
