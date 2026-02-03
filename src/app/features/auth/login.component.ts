
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
      <div class="min-h-screen w-full flex bg-white overflow-hidden relative font-sans selection:bg-teal-500 selection:text-white">
        
        <!-- LEFT SIDE: Concept "Digital Lotus" (Sen Số) - GC Lab Context -->
        <div class="hidden lg:flex lg:w-3/5 relative bg-[#020617] overflow-hidden flex-col justify-center items-center">
            
            <!-- 1. Background Atmosphere -->
            <!-- Deep Teal Gradient Base: Water/Chemical feel -->
            <div class="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#0f2027] to-[#115e59] opacity-90"></div>
            
            <!-- The Hidden Drum (Digital Dong Son Pattern) -->
            <!-- Rotating concentric circles simulating the drum surface - Represents Precision & History -->
            <div class="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none overflow-hidden">
                <!-- Outer Ring -->
                <div class="w-[800px] h-[800px] border border-dashed border-teal-200/40 rounded-full animate-spin-super-slow absolute"></div>
                <div class="w-[780px] h-[780px] border border-dotted border-white/20 rounded-full animate-spin-super-slow absolute" style="animation-direction: reverse;"></div>
                
                <!-- Middle Ring -->
                <div class="w-[500px] h-[500px] border-2 border-dashed border-amber-500/20 rounded-full animate-spin-slow absolute"></div>
                
                <!-- Inner Tech Ring -->
                <div class="w-[300px] h-[300px] border border-teal-500/30 rounded-full absolute flex items-center justify-center">
                    <div class="w-[90%] h-[90%] border-t-2 border-b-2 border-transparent border-t-teal-400/50 border-b-teal-400/50 rounded-full animate-spin"></div>
                </div>
            </div>

            <!-- Bottom Red Glow (Subtle Spirit of Vietnam) -->
            <div class="absolute bottom-[-20%] left-0 right-0 h-[400px] bg-gradient-to-t from-rose-900/30 to-transparent blur-3xl pointer-events-none"></div>

            <!-- 2. Main Content Container -->
            <div class="relative z-10 w-full max-w-3xl p-12 flex flex-col items-center text-center">
                
                <!-- The Glass Lotus (Hero Visual) -->
                <div class="relative mb-12 animate-float">
                    <!-- Core Glow (Amber Soul) -->
                    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl animate-pulse-slow"></div>
                    
                    <!-- Glass Structure Container -->
                    <div class="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-4 shadow-2xl ring-1 ring-white/5 group">
                        <!-- Abstract Visual -->
                        <div class="rounded-[1.5rem] overflow-hidden relative w-64 h-64 bg-slate-900 flex items-center justify-center border border-white/5">
                            <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
                                 class="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000 mix-blend-screen"
                                 alt="Digital Lotus Abstract">
                            
                            <!-- Overlay Gradient -->
                            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent"></div>
                            
                            <!-- Floating Tech Elements -->
                            <div class="absolute top-4 right-4 animate-float-delayed">
                                <i class="fa-solid fa-cube text-xl text-teal-300 drop-shadow-[0_0_10px_rgba(94,234,212,0.5)]"></i>
                            </div>
                            <div class="absolute bottom-6 left-6 animate-float-reverse">
                                <i class="fa-solid fa-flask text-2xl text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]"></i>
                            </div>
                        </div>

                        <!-- Orbiting Badges (Internal Context) -->
                        <div class="absolute -right-16 top-8 bg-black/40 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-lg text-white text-[10px] font-bold shadow-lg flex items-center gap-2 animate-float-slow">
                            <i class="fa-solid fa-microscope text-teal-400"></i>
                            <span>Room: GC-01</span>
                        </div>
                        <div class="absolute -left-12 bottom-10 bg-black/40 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-lg text-white text-[10px] font-bold shadow-lg flex items-center gap-2 animate-float-delayed">
                            <i class="fa-solid fa-bolt text-amber-400"></i>
                            <span>Otada System</span>
                        </div>
                        <div class="absolute -right-8 bottom-[-20px] bg-black/40 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-lg text-white text-[10px] font-bold shadow-lg flex items-center gap-2 animate-float">
                            <i class="fa-solid fa-lock text-rose-400"></i>
                            <span>Internal Tool</span>
                        </div>
                    </div>
                </div>

                <!-- Typography: Minimalist & Identity -->
                <div class="space-y-2">
                    <div class="inline-block border border-teal-500/30 bg-teal-900/20 px-3 py-1 rounded-full mb-2 backdrop-blur-sm">
                        <h2 class="text-teal-400 font-bold tracking-[0.2em] text-[10px] uppercase">
                            LƯU HÀNH NỘI BỘ
                        </h2>
                    </div>
                    
                    <h1 class="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
                        PHÒNG SẮC KÝ KHÍ<br>
                        <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 text-3xl md:text-4xl block mt-2">HỆ THỐNG QUẢN TRỊ DỮ LIỆU</span>
                    </h1>
                    
                    <div class="h-px w-24 bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto my-4"></div>
                    
                    <p class="text-slate-400 text-sm font-medium tracking-wide">
                        Kho hóa chất &bull; Quy trình SOP &bull; Truy xuất nguồn gốc
                    </p>
                </div>

                <!-- Footer Brand -->
                <div class="mt-16 opacity-60 hover:opacity-100 transition-opacity">
                    <p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                        Designed & Developed by OTADA
                    </p>
                </div>

            </div>
        </div>

        <!-- RIGHT SIDE: Interaction -->
        <div class="w-full lg:w-2/5 flex flex-col relative bg-white">
            
            <div class="lg:hidden p-6 flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
                    <i class="fa-solid fa-flask text-sm"></i>
                </div>
                <span class="font-bold text-slate-700">LIMS Cloud</span>
            </div>

            <div class="flex-1 flex flex-col justify-center px-8 md:px-16 py-8 relative">
                
                <!-- LOGIN MODE: PASSWORD -->
                @if (mode() === 'password') {
                    <div class="animate-fade-in-up w-full max-w-sm mx-auto">
                        <div class="mb-10">
                            <h2 class="text-3xl font-black text-slate-800 mb-2">Đăng nhập</h2>
                            <p class="text-slate-500 text-sm">Xác thực quyền truy cập hệ thống.</p>
                        </div>

                        <div class="space-y-5">
                            <div class="group">
                                <label class="block text-xs font-bold text-slate-600 uppercase mb-2 ml-1">Tên đăng nhập / Email</label>
                                <div class="relative">
                                    <i class="fa-regular fa-user absolute left-4 top-3.5 text-slate-400 group-focus-within:text-teal-600 transition-colors z-10"></i>
                                    <input type="text" [(ngModel)]="email" (keyup.enter)="login()"
                                           class="w-full pl-11 pr-24 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition shadow-sm placeholder:font-normal" 
                                           [class.border-red-500]="errorMsg()"
                                           placeholder="username"
                                           [disabled]="isLoading()">
                                    
                                    <!-- Smart Domain Suffix (Option A) -->
                                    @if (!email.includes('@')) {
                                        <span class="absolute right-4 top-3.5 text-slate-400 font-bold text-sm pointer-events-none select-none tracking-tight animate-fade-in">
                                            &#64;lims.com
                                        </span>
                                    }
                                </div>
                            </div>

                            <div class="group">
                                <div class="flex justify-between items-center mb-2 ml-1">
                                    <label class="block text-xs font-bold text-slate-600 uppercase">Mật khẩu</label>
                                </div>
                                <div class="relative">
                                    <i class="fa-solid fa-lock absolute left-4 top-3.5 text-slate-400 group-focus-within:text-teal-600 transition-colors"></i>
                                    <input type="password" [(ngModel)]="password" (keyup.enter)="login()"
                                           class="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition shadow-sm placeholder:font-normal" 
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
                                    class="w-full py-3.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold text-sm shadow-lg shadow-teal-200 transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                @if (isLoading() && !isGoogleLoading()) { <i class="fa-solid fa-circle-notch fa-spin"></i> }
                                @else { <span>Vào Ca Làm Việc</span> <i class="fa-solid fa-arrow-right"></i> }
                            </button>

                            <div class="relative my-6 text-center">
                                <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-slate-100"></div></div>
                                <span class="relative bg-white px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hoặc</span>
                            </div>

                            <button (click)="loginGoogle()" [disabled]="isLoading()"
                                    class="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl font-bold text-sm transition flex items-center justify-center gap-3 active:scale-95 group">
                                @if (isGoogleLoading()) { <i class="fa-solid fa-spinner fa-spin text-slate-400"></i> } 
                                @else { <i class="fa-brands fa-google text-red-500 text-lg group-hover:scale-110 transition-transform"></i> }
                                <span>Google Workspace</span>
                            </button>
                        </div>

                        <div class="mt-8 text-center">
                            <button (click)="switchMode('qr')" class="inline-flex items-center gap-2 text-slate-500 hover:text-teal-700 font-bold text-xs transition px-4 py-2 rounded-full hover:bg-teal-50 border border-transparent hover:border-teal-100">
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
                            <button (click)="switchMode('password')" class="text-teal-600 hover:text-teal-800 font-bold text-sm transition mt-4">
                                <i class="fa-solid fa-arrow-left mr-1"></i> Quay lại
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
    .animate-fade-in-up { animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    
    @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
    .animate-shake { animation: shake 0.3s ease-in-out; }

    /* New Animations for Digital Lotus Concept */
    @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
    .animate-float { animation: float 6s ease-in-out infinite; }
    
    @keyframes floatDelayed { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
    .animate-float-delayed { animation: floatDelayed 5s ease-in-out infinite 1s; }

    @keyframes floatReverse { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(10px); } }
    .animate-float-reverse { animation: floatReverse 7s ease-in-out infinite; }

    @keyframes floatSlow { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(15px, 15px); } }
    .animate-float-slow { animation: floatSlow 10s ease-in-out infinite; }

    @keyframes pulseSlow { 0%, 100% { opacity: 0.2; transform: translate(-50%, -50%) scale(1); } 50% { opacity: 0.4; transform: translate(-50%, -50%) scale(1.1); } }
    .animate-pulse-slow { animation: pulseSlow 4s ease-in-out infinite; }

    @keyframes spinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .animate-spin-slow { animation: spinSlow 30s linear infinite; }

    @keyframes spinSuperSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .animate-spin-super-slow { animation: spinSuperSlow 60s linear infinite; }
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
          this.auth.deleteAuthSession(this.currentSessionId).catch(() => {});
          this.currentSessionId = null;
      }
  }

  async handleApproval(encryptedData: string) {
      this.qrStatus.set('approved');
      
      try {
          const [userEmail, cipherText] = encryptedData.split('|');
          if (!this.currentSecretKey) throw new Error("Missing key");
          
          const decryptedPass = this.xorDecrypt(cipherText, this.currentSecretKey);
          
          if (userEmail && decryptedPass) {
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

  xorDecrypt(input: string, key: string): string {
      try {
          const decoded = atob(input);
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
    
    // SMART DOMAIN APPEND LOGIC
    let finalEmail = this.email.trim();
    if (!finalEmail.includes('@')) {
        finalEmail += '@lims.com';
    }

    try { 
        await this.auth.login(finalEmail, this.password); 
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
