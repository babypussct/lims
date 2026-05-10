
import { Component, inject, signal, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { Unsubscribe } from 'firebase/firestore';

declare let QRious: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (!auth.currentUser()) {
      <div class="min-h-screen w-full flex items-center justify-center overflow-hidden relative font-sans selection:bg-fuchsia-500 selection:text-white bg-[#f8fafc]">
        
        <!-- Animated Light Gradient Background (Fluid Shapes) -->
        <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div class="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-fuchsia-400/30 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob"></div>
            <div class="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-pink-400/30 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob animation-delay-2000"></div>
            <div class="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] bg-purple-400/30 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob animation-delay-4000"></div>
            <!-- Subtle Grid Pattern Overlay for a "Lab" feel -->
            <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wNCkiLz48L3N2Zz4=')] opacity-60"></div>
        </div>

        <!-- Centered Glass Card -->
        <div class="relative z-10 w-full max-w-[420px] mx-4 sm:mx-auto">
            
            <div class="bg-white/60 backdrop-blur-2xl border border-white/60 shadow-[0_20px_27px_0_rgba(0,0,0,0.05)] rounded-[2.5rem] p-8 sm:p-10 relative overflow-hidden">
                
                <!-- Subtle inner shine -->
                <div class="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none"></div>

                <div class="text-center mb-8 relative z-10">
                    <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[linear-gradient(310deg,#7928ca,#ff0080)] shadow-lg shadow-pink-500/30 text-white mb-6 transform hover:scale-105 transition-transform duration-300">
                        <i class="fa-solid fa-microscope text-3xl"></i>
                    </div>
                    <h1 class="text-2xl font-black text-gray-700 tracking-tight">LIMS <span class="font-light text-gray-500">NAFIQPM6</span></h1>
                    <p class="text-gray-500 text-[13px] mt-2 font-medium">Hệ thống Quản trị Dữ liệu Phòng thí nghiệm</p>
                </div>

                <!-- LOGIN MODE: GOOGLE (PRIMARY) -->
                @if (mode() === 'google') {
                    <div class="animate-fade-in-up relative z-10 text-center">
                        <button (click)="loginGoogle()" [disabled]="isLoading()"
                                class="w-full py-4 mt-2 bg-white backdrop-blur-md border border-white hover:bg-gray-50 text-gray-700 rounded-2xl font-bold text-sm shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all flex items-center justify-center gap-3 active:scale-[0.98] group relative overflow-hidden">
                            <!-- Subtle pink hover glow -->
                            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-pink-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            
                            @if (isGoogleLoading()) { <i class="fa-solid fa-spinner fa-spin text-gray-400"></i> } 
                            @else { 
                                <div class="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                                    <i class="fa-brands fa-google text-red-500 text-[16px] group-hover:scale-110 transition-transform"></i> 
                                </div>
                            }
                            <span class="text-[15px]">Đăng nhập với Google</span>
                        </button>

                        <div class="mt-8 flex flex-col gap-4">
                            <button (click)="switchMode('qr')" class="inline-flex items-center justify-center gap-2 text-fuchsia-600 hover:text-fuchsia-700 font-bold text-[13px] transition px-4 py-2.5 rounded-xl hover:bg-fuchsia-50/50 border border-transparent hover:border-fuchsia-100/50">
                                <i class="fa-solid fa-qrcode text-[15px]"></i>
                                <span>Đăng nhập qua mã QR</span>
                            </button>
                            
                            <!-- Admin Link hidden nicely -->
                            <div class="pt-4 border-t border-gray-200/50">
                                <button (click)="switchMode('password')" class="text-gray-400 hover:text-gray-600 font-medium text-[11px] uppercase tracking-wider transition hover:underline decoration-gray-300 underline-offset-4">
                                    <i class="fa-solid fa-shield-halved mr-1"></i> Đăng nhập bằng tài khoản được cấp
                                </button>
                            </div>
                        </div>
                        
                        @if (errorMsg()) {
                            <div class="mt-4 px-4 py-3 rounded-2xl bg-red-50/80 backdrop-blur-sm border border-red-100 text-red-600 text-[13px] font-medium flex items-center justify-center gap-2 animate-shake">
                                <i class="fa-solid fa-circle-exclamation text-red-500"></i> {{ errorMsg() }}
                            </div>
                        }
                    </div>
                }

                <!-- LOGIN MODE: PASSWORD (ADMIN ONLY) -->
                @if (mode() === 'password') {
                    <div class="animate-fade-in-up relative z-10">
                        <div class="space-y-4">
                            <div class="group">
                                <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Tên đăng nhập / Email</label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <i class="fa-regular fa-user text-gray-400 group-focus-within:text-fuchsia-500 transition-colors"></i>
                                    </div>
                                    <input type="text" [(ngModel)]="email" (keyup.enter)="login()"
                                           class="w-full pl-11 pr-24 py-3.5 bg-white/50 backdrop-blur-sm border border-white/40 rounded-2xl text-sm font-semibold text-gray-700 outline-none focus:bg-white focus:border-fuchsia-400 focus:ring-4 focus:ring-fuchsia-400/10 transition-all shadow-sm placeholder:font-normal placeholder:text-gray-400" 
                                           [class.border-red-400]="errorMsg()"
                                           [class.bg-red-50]="errorMsg()"
                                           placeholder="Nhập username..."
                                           [disabled]="isLoading()">
                                    
                                    @if (!email.includes('@')) {
                                        <span class="absolute right-4 top-3.5 text-gray-400 font-medium text-sm pointer-events-none select-none tracking-tight animate-fade-in">
                                            &#64;lims.com
                                        </span>
                                    }
                                </div>
                            </div>

                            <div class="group">
                                <div class="flex justify-between items-center mb-1.5 ml-1">
                                    <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">Mật khẩu</label>
                                </div>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <i class="fa-solid fa-lock text-gray-400 group-focus-within:text-fuchsia-500 transition-colors"></i>
                                    </div>
                                    <input type="password" [(ngModel)]="password" (keyup.enter)="login()"
                                           class="w-full pl-11 pr-4 py-3.5 bg-white/50 backdrop-blur-sm border border-white/40 rounded-2xl text-sm font-semibold text-gray-700 outline-none focus:bg-white focus:border-fuchsia-400 focus:ring-4 focus:ring-fuchsia-400/10 transition-all shadow-sm placeholder:font-normal placeholder:text-gray-400" 
                                           [class.border-red-400]="errorMsg()"
                                           [class.bg-red-50]="errorMsg()"
                                           placeholder="••••••••"
                                           [disabled]="isLoading()">
                                </div>
                            </div>

                            @if (errorMsg()) {
                                <div class="px-4 py-3 rounded-2xl bg-red-50/80 backdrop-blur-sm border border-red-100 text-red-600 text-[13px] font-medium flex items-center gap-2 animate-shake">
                                    <i class="fa-solid fa-circle-exclamation text-red-500"></i> {{ errorMsg() }}
                                </div>
                            }

                            <button (click)="login()" [disabled]="isLoading()"
                                    class="w-full py-4 mt-2 bg-[linear-gradient(310deg,#7928ca,#ff0080)] hover:opacity-90 text-white rounded-2xl font-bold text-sm shadow-[0_4px_6px_-1px_rgba(203,12,159,0.2)] hover:shadow-[0_8px_15px_-6px_rgba(203,12,159,0.4)] hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2">
                                @if (isLoading() && !isGoogleLoading()) { <i class="fa-solid fa-circle-notch fa-spin"></i> }
                                @else { <i class="fa-solid fa-shield-halved text-xs"></i> <span>Đăng Nhập Quản Trị</span> }
                            </button>

                            <div class="mt-6 text-center pt-4 border-t border-gray-200/50">
                                <button (click)="switchMode('google')" class="text-gray-500 hover:text-fuchsia-600 font-bold text-[13px] transition flex items-center justify-center gap-2 mx-auto">
                                    <i class="fa-solid fa-arrow-left"></i> Trở về đăng nhập chính
                                </button>
                            </div>
                        </div>
                    </div>
                }

                <!-- LOGIN MODE: QR SHOW -->
                @if (mode() === 'qr') {
                    <div class="animate-fade-in-up relative z-10 flex flex-col items-center text-center">
                        <h2 class="text-xl font-bold text-gray-700 mb-2">Đăng nhập nhanh</h2>
                        <p class="text-gray-500 text-[13px] mb-8 px-4">Sử dụng ứng dụng LIMS trên điện thoại để quét mã này.</p>

                        <div class="bg-white p-3 rounded-[2rem] shadow-sm border border-gray-100 relative group w-64 h-64 mx-auto flex items-center justify-center overflow-hidden">
                            <canvas #qrCanvas class="w-56 h-56"></canvas>
                            
                            <!-- Overlay status -->
                            @if (qrStatus() === 'approved') {
                                <div class="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center rounded-[2rem] animate-fade-in">
                                    <div class="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center text-3xl mb-3 shadow-inner"><i class="fa-solid fa-check"></i></div>
                                    <span class="font-bold text-green-700 text-lg">Thành công!</span>
                                    <span class="text-[13px] text-green-600/80 font-medium mt-1">Đang chuyển hướng...</span>
                                </div>
                            }
                            @if (qrStatus() === 'expired') {
                                <div class="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center rounded-[2rem] animate-fade-in cursor-pointer group-hover:bg-gray-50 transition-colors" (click)="generateSession()">
                                    <div class="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center text-3xl mb-3 shadow-inner group-hover:scale-110 transition-transform"><i class="fa-solid fa-rotate-right"></i></div>
                                    <span class="font-bold text-gray-700">Mã hết hạn</span>
                                    <span class="text-[13px] text-fuchsia-600 font-bold mt-1">Nhấn để tải lại</span>
                                </div>
                            }
                            @if (errorMsg() && mode() === 'qr') {
                                <div class="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center rounded-[2rem] animate-fade-in p-6 text-center">
                                    <div class="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-2xl mb-3"><i class="fa-solid fa-triangle-exclamation"></i></div>
                                    <span class="font-bold text-red-700 text-sm">Lỗi kết nối</span>
                                    <span class="text-[11px] text-red-500/80 mt-1 mb-4">{{ errorMsg() }}</span>
                                    <button (click)="generateSession()" class="px-4 py-2 bg-red-50 text-red-700 border border-red-100 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors">Thử lại</button>
                                </div>
                            }
                        </div>

                        <div class="mt-8 flex flex-col gap-4 w-full">
                            <div class="flex items-center gap-2 justify-center text-[13px] font-semibold text-gray-500 bg-white/50 backdrop-blur-sm py-2 px-4 rounded-xl border border-white/60 shadow-sm">
                                <div class="w-2 h-2 rounded-full" [class.bg-fuchsia-500]="qrStatus() === 'waiting'" [class.animate-pulse]="qrStatus() === 'waiting'" [class.bg-gray-300]="qrStatus() !== 'waiting'"></div>
                                {{ qrStatus() === 'waiting' ? 'Đang chờ quét mã...' : (qrStatus() === 'scanned' ? 'Đã quét! Vui lòng xác nhận.' : 'Trạng thái: ' + qrStatus()) }}
                            </div>
                            <button (click)="switchMode('google')" class="text-gray-500 hover:text-fuchsia-600 font-bold text-[13px] transition flex items-center justify-center gap-2 mx-auto">
                                <i class="fa-solid fa-arrow-left"></i> Trở về
                            </button>
                        </div>
                    </div>
                }

            </div>
            
            <!-- Footer -->
            <div class="text-center mt-6 text-[11px] font-medium text-gray-400 mb-8">
                &copy; {{year}} Laboratory Information Management System.<br>
                <span class="text-gray-500">NAFIQPM6 LIMS Cloud v1.0</span>
            </div>

            <!-- Install App Button -->
            <div class="text-center">
                <button (click)="showInstallGuide.set(true)" class="inline-flex items-center gap-2 px-4 py-2 bg-white/40 hover:bg-white/60 backdrop-blur-md rounded-full text-fuchsia-600 font-semibold text-[12px] transition-colors shadow-sm border border-white/50">
                    <i class="fa-solid fa-mobile-screen-button"></i> Hướng dẫn Cài đặt Ứng dụng
                </button>
            </div>

        </div>

        <!-- PWA Install Guide Modal -->
        @if (showInstallGuide()) {
            <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
                <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative">
                    <button (click)="showInstallGuide.set(false)" class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors z-10">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                    
                    <div class="bg-[linear-gradient(310deg,#7928ca,#ff0080)] p-6 text-center text-white">
                        <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md border border-white/30">
                            <i class="fa-solid fa-mobile-screen-button text-3xl"></i>
                        </div>
                        <h3 class="text-xl font-bold">Cài đặt Ứng dụng</h3>
                        <p class="text-white/80 text-sm mt-1">Truy cập nhanh hơn trực tiếp từ màn hình chính</p>
                    </div>

                    <div class="p-6">
                        <div class="flex flex-col gap-6">
                            <!-- iOS Safari -->
                            <div class="flex items-start gap-4">
                                <div class="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0 mt-1">
                                    <i class="fa-brands fa-safari text-xl"></i>
                                </div>
                                <div>
                                    <h4 class="font-bold text-gray-700 text-[15px]">iPhone / iPad (Safari)</h4>
                                    <p class="text-gray-500 text-[13px] mt-1 leading-relaxed">
                                        1. Nhấn biểu tượng <span class="inline-block mx-1 w-6 h-6 bg-gray-100 text-center rounded"><i class="fa-solid fa-arrow-up-from-bracket text-[10px]"></i></span> (Chia sẻ) dưới cùng màn hình.<br>
                                        2. Kéo lên và chọn <strong>"Thêm vào MH chính"</strong> <span class="text-gray-400 text-[11px]">(Add to Home Screen)</span>.
                                    </p>
                                </div>
                            </div>

                            <div class="w-full h-[1px] bg-gray-100"></div>

                            <!-- Android Chrome -->
                            <div class="flex items-start gap-4">
                                <div class="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                                    <i class="fa-brands fa-chrome text-xl"></i>
                                </div>
                                <div>
                                    <h4 class="font-bold text-gray-700 text-[15px]">Android (Chrome)</h4>
                                    <p class="text-gray-500 text-[13px] mt-1 leading-relaxed">
                                        1. Nhấn biểu tượng <span class="inline-block mx-1 w-6 h-6 bg-gray-100 text-center rounded"><i class="fa-solid fa-ellipsis-vertical text-[10px]"></i></span> (Menu) ở góc trên bên phải.<br>
                                        2. Chọn <strong>"Cài đặt ứng dụng"</strong> <span class="text-gray-400 text-[11px]">(Install App)</span>.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="mt-8">
                            <button (click)="showInstallGuide.set(false)" class="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">
                                Đã hiểu
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        }
      </div>
    }
  `,
  styles: [
    `
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fade-in-up { animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    
    @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
    .animate-shake { animation: shake 0.3s ease-in-out; }

    @keyframes blob {
      0% { transform: translate(0px, 0px) scale(1); }
      33% { transform: translate(30px, -50px) scale(1.1); }
      66% { transform: translate(-20px, 20px) scale(0.9); }
      100% { transform: translate(0px, 0px) scale(1); }
    }
    .animate-blob { animation: blob 10s infinite; }
    .animation-delay-2000 { animation-delay: 2s; }
    .animation-delay-4000 { animation-delay: 4s; }
  `]
})
export class LoginComponent implements OnDestroy {
  auth = inject(AuthService);
  toast = inject(ToastService);
  
  mode = signal<'google' | 'password' | 'qr'>('google');
  showInstallGuide = signal(false);
  
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

  switchMode(m: 'google' | 'password' | 'qr') {
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
    this.errorMsg.set('');

    try {
        // Trigger the popup immediately (in user gesture context)
        const loginPromise = this.auth.loginWithGoogle();
        
        // Set loading AFTER popup is triggered (not before — breaks gesture context)
        this.isLoading.set(true); 
        this.isGoogleLoading.set(true); 
        
        await loginPromise;
    } catch (e: any) {
        // auth/popup-blocked or COOP issues: AuthService already called signInWithRedirect,
        // page is navigating away — just show a brief message, don't treat as error
        if (e.code === 'auth/popup-blocked' || e.code === 'auth/popup-closed-by-user') {
            this.errorMsg.set('Đang chuyển hướng đến Google đăng nhập...');
            return; // Page navigating away, no need to reset loading
        }
        this.handleError(e, true);
    } finally { 
        this.isLoading.set(false); 
        this.isGoogleLoading.set(false); 
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
      } else if (code === 'permission-denied') {
          this.errorMsg.set('Tài khoản không có quyền truy cập hệ thống.');
      } else {
          this.errorMsg.set('Lỗi: ' + (code || msg || 'Không xác định'));
      }
  }
}
