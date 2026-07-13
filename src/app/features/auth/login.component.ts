
import { Component, inject, signal, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { Unsubscribe } from 'firebase/firestore';
import { PwaInstallPromptComponent } from '../../shared/components/pwa-install-prompt.component';
import { StateService } from '../../core/services/state.service';
import { LogoComponent } from '../../shared/components/logo.component';

declare let QRious: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, PwaInstallPromptComponent, LogoComponent],
  template: `
    @if (!auth.currentUser()) {
      <div class="min-h-screen w-full flex items-center justify-center overflow-hidden relative font-sans selection:bg-fuchsia-500 selection:text-white bg-[#f8fafc] dark:bg-slate-950">
        
        <!-- Animated Light Gradient Background (Fluid Shapes) -->
        <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div class="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-fuchsia-400/30 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob"></div>
            <div class="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-pink-400/30 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob animation-delay-2000"></div>
            <div class="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] bg-purple-400/30 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob animation-delay-4000"></div>
            <div class="absolute bottom-[30%] right-[10%] w-[35vw] h-[35vw] bg-blue-400/20 rounded-full mix-blend-multiply filter blur-[80px] opacity-60 animate-blob animation-delay-6000"></div>
            <!-- Subtle Grid Pattern Overlay for a "Lab" feel -->
            <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wNCkiLz48L3N2Zz4=')] opacity-60 dark:opacity-20"></div>
        </div>

        <!-- Centered Glass Card -->
        <div class="relative z-10 w-full max-w-[420px] mx-4 sm:mx-auto">
            
            <div class="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/60 dark:border-slate-800/60 shadow-[0_20px_27px_0_rgba(0,0,0,0.05)] rounded-[2.5rem] p-8 sm:p-10 relative overflow-hidden">
                
                <!-- Subtle inner shine -->
                <div class="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none"></div>

                <div class="text-center mb-8 relative z-10">
                    <div class="inline-flex items-center justify-center w-24 h-24 rounded-[2rem] overflow-hidden shadow-lg shadow-indigo-500/10 mb-6 transform hover:scale-105 transition-transform duration-300">
                        <app-logo size="96px"></app-logo>
                    </div>
                    <h1 class="text-2xl font-black text-gray-700 dark:text-slate-200 tracking-tight">LIMS <span class="font-light text-gray-500">NAFIQPM6</span></h1>
                    <p class="text-gray-500 dark:text-slate-400 text-[13px] mt-2 font-medium">Hệ thống Quản trị Dữ liệu Phòng thí nghiệm</p>
                </div>

                <!-- LOGOUT REASON NOTIFICATION -->
                @if (logoutReason()) {
                  <div class="relative z-10 mb-6 p-4 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 backdrop-blur-sm border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-[13px] font-medium animate-fade-in-up flex gap-3 shadow-[0_4px_12px_rgba(217,119,6,0.08)]">
                    <div class="shrink-0 text-amber-500 text-base mt-0.5">
                      <i class="fa-solid fa-circle-exclamation"></i>
                    </div>
                    <div class="flex-1 text-left">
                      <div class="font-bold text-amber-900 dark:text-amber-200 mb-0.5">Thông báo hệ thống</div>
                      <div>
                        @if (logoutReason() === 'idle') {
                          Phiên đăng nhập đã hết hạn do hệ thống không hoạt động trong 30 phút. Vui lòng đăng nhập lại.
                        } @else if (logoutReason() === 'permission-denied') {
                          Tài khoản của bạn đã bị từ chối truy cập bởi hệ thống. Vui lòng liên hệ Admin.
                        } @else {
                          Bạn đã được đăng xuất khỏi hệ thống.
                        }
                      </div>
                    </div>
                    <button (click)="logoutReason.set(null)" class="text-amber-400 hover:text-amber-600 transition shrink-0 self-start active:scale-90 p-0.5">
                      <i class="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                }

                <!-- TAB SWITCHER: PILL SEGMENTED CONTROL -->
                <div class="relative z-10 bg-gray-100/80 dark:bg-slate-800/80 backdrop-blur-sm p-1 rounded-2xl flex items-center mb-6 border border-gray-200/30 dark:border-slate-700/30 shadow-inner relative h-10 select-none">
                    <!-- Sliding highlight indicator -->
                    <div class="absolute top-1 bottom-1 rounded-xl bg-white dark:bg-slate-700 shadow-sm transition-all duration-300 ease-out pointer-events-none"
                         [style.width.%]="31"
                         [style.left.%]="mode() === 'google' ? 1.5 : (mode() === 'qr' ? 34.5 : 67.5)">
                    </div>
                    
                    <button (click)="switchMode('google')" class="flex-1 py-1.5 text-center text-xs font-bold transition-all relative z-10 cursor-pointer select-none rounded-xl"
                            [class.text-fuchsia-600]="mode() === 'google'"
                            [class.dark:text-fuchsia-400]="mode() === 'google'"
                            [class.text-gray-500]="mode() !== 'google'">
                        <i class="fa-brands fa-google mr-1"></i> Google
                    </button>
                    <button (click)="switchMode('qr')" class="flex-1 py-1.5 text-center text-xs font-bold transition-all relative z-10 cursor-pointer select-none rounded-xl"
                            [class.text-fuchsia-600]="mode() === 'qr'"
                            [class.dark:text-fuchsia-400]="mode() === 'qr'"
                            [class.text-gray-500]="mode() !== 'qr'">
                        <i class="fa-solid fa-qrcode mr-1"></i> Mã QR
                    </button>
                    <button (click)="switchMode('password')" class="flex-1 py-1.5 text-center text-xs font-bold transition-all relative z-10 cursor-pointer select-none rounded-xl"
                            [class.text-fuchsia-600]="mode() === 'password'"
                            [class.dark:text-fuchsia-400]="mode() === 'password'"
                            [class.text-gray-500]="mode() !== 'password'">
                        <i class="fa-solid fa-shield-halved mr-1"></i> Tài khoản
                    </button>
                </div>

                <!-- LOGIN MODE: GOOGLE (PRIMARY) -->
                @if (mode() === 'google') {
                    <div class="animate-fade-in-up relative z-10 text-center">
                        <button (click)="loginGoogle()" [disabled]="isLoading()"
                                class="w-full py-4 mt-2 bg-white dark:bg-slate-800 backdrop-blur-md border border-white dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-750 text-gray-700 dark:text-slate-200 rounded-2xl font-bold text-sm shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all flex items-center justify-center gap-3 active:scale-[0.98] group relative overflow-hidden">
                            <!-- Subtle pink hover glow -->
                            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-pink-50/50 to-transparent dark:via-pink-950/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            
                            @if (isGoogleLoading()) { <i class="fa-solid fa-spinner fa-spin text-gray-400"></i> } 
                            @else { 
                                <div class="w-8 h-8 rounded-full bg-red-50 dark:bg-red-950/50 flex items-center justify-center group-hover:bg-red-100 dark:group-hover:bg-red-900/50 transition-colors">
                                    <i class="fa-brands fa-google text-red-500 text-[16px] group-hover:scale-110 transition-transform"></i> 
                                </div>
                            }
                            <span class="text-[15px]">Đăng nhập với Google</span>
                        </button>

                        <!-- Shared Device & Remember Session Checkboxes (Horizontal Row) -->
                        <div class="mt-4 flex items-center justify-between gap-2 text-left relative">
                            <!-- Checkbox 1: Remember session -->
                            <label class="flex items-center gap-2 cursor-pointer group select-none bg-white/40 dark:bg-slate-850/40 px-2.5 py-1.5 rounded-xl border border-white/60 dark:border-slate-700/60 shadow-sm hover:bg-white/60 dark:hover:bg-slate-800/65 transition-all flex-1 min-w-0"
                                   [class.opacity-40]="isSharedDevice()"
                                   [class.pointer-events-none]="isSharedDevice()">
                                <div class="relative flex items-center justify-center w-4 h-4 rounded border border-gray-300 dark:border-slate-650 group-hover:border-fuchsia-400 transition-colors shrink-0 duration-200" 
                                     [ngClass]="rememberSession() ? 'bg-fuchsia-50 border-fuchsia-500 dark:bg-fuchsia-950/50' : 'border-gray-300 dark:border-slate-650'">
                                    <input type="checkbox" [checked]="rememberSession()" (change)="toggleRememberSession()" class="opacity-0 absolute inset-0 cursor-pointer" [disabled]="isSharedDevice()">
                                    @if (rememberSession()) {
                                        <i class="fa-solid fa-check text-[9px] text-fuchsia-600 dark:text-fuchsia-450 animate-fade-in"></i>
                                    }
                                </div>
                                <span class="text-[11px] font-bold text-gray-500 dark:text-slate-400 group-hover:text-gray-755 dark:group-hover:text-slate-300 transition-colors truncate">Duy trì đăng nhập</span>
                            </label>

                            <!-- Checkbox 2: Shared Device -->
                            <label class="flex items-center gap-2 cursor-pointer group select-none bg-white/40 dark:bg-slate-850/40 px-2.5 py-1.5 rounded-xl border border-white/60 dark:border-slate-700/60 shadow-sm hover:bg-white/60 dark:hover:bg-slate-800/65 transition-all flex-1 min-w-0"
                                   [class.opacity-40]="rememberSession()"
                                   [class.pointer-events-none]="rememberSession()">
                                <div class="relative flex items-center justify-center w-4 h-4 rounded border border-gray-300 dark:border-slate-650 group-hover:border-fuchsia-400 transition-colors shrink-0 duration-200" 
                                     [ngClass]="isSharedDevice() ? 'bg-fuchsia-50 border-fuchsia-500 dark:bg-fuchsia-950/50' : 'border-gray-300 dark:border-slate-650'">
                                    <input type="checkbox" [checked]="isSharedDevice()" (change)="toggleSharedDevice()" class="opacity-0 absolute inset-0 cursor-pointer" [disabled]="rememberSession()">
                                    @if (isSharedDevice()) {
                                        <i class="fa-solid fa-check text-[9px] text-fuchsia-600 dark:text-fuchsia-450 animate-fade-in"></i>
                                    }
                                </div>
                                <span class="text-[11px] font-bold text-gray-500 dark:text-slate-400 group-hover:text-gray-755 dark:group-hover:text-slate-300 transition-colors truncate">Máy dùng chung</span>
                            </label>

                            <!-- Tooltip Help Info -->
                            <div class="relative group/tooltip shrink-0">
                                <button type="button" class="w-7 h-7 rounded-full bg-white/40 dark:bg-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-700/60 text-gray-400 dark:text-slate-500 hover:text-fuchsia-600 dark:hover:text-fuchsia-450 flex items-center justify-center text-xs transition-colors cursor-help border border-white/50 dark:border-slate-700/50 shadow-sm">
                                    <i class="fa-regular fa-circle-question text-[13px]"></i>
                                </button>
                                <!-- Tooltip content -->
                                <div class="absolute bottom-full right-0 mb-2 w-64 bg-slate-900/95 dark:bg-slate-950/95 text-white text-[11px] p-3.5 rounded-2xl shadow-xl border border-slate-700/50 backdrop-blur-md opacity-0 scale-95 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100 transition-all duration-200 z-50 origin-bottom-right leading-relaxed">
                                    <div class="font-bold text-fuchsia-400 mb-1.5 flex items-center gap-1.5">
                                        <i class="fa-solid fa-shield-halved"></i> Hướng dẫn bảo mật phiên
                                    </div>
                                    <div class="space-y-1.5 text-slate-300">
                                        <div><strong>• Duy trì đăng nhập:</strong> Tắt tự động đăng xuất sau 30 phút không hoạt động và giữ phiên đăng nhập qua ngày (dành cho máy cá nhân).</div>
                                        <div><strong>• Máy dùng chung:</strong> Kích hoạt tự thoát 30 phút và tự động đăng xuất tài khoản Google khi nhấn Logout để bảo mật.</div>
                                    </div>
                                </div>
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
                                           class="w-full pl-11 pr-24 py-3.5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/40 dark:border-slate-700/40 rounded-2xl text-sm font-semibold text-gray-700 dark:text-slate-200 outline-none focus:bg-white focus:border-fuchsia-400 dark:focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-400/10 transition-all shadow-sm placeholder:font-normal placeholder:text-gray-400 dark:placeholder:text-gray-500" 
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
                                           class="w-full pl-11 pr-4 py-3.5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/40 dark:border-slate-700/40 rounded-2xl text-sm font-semibold text-gray-700 dark:text-slate-200 outline-none focus:bg-white focus:border-fuchsia-400 dark:focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-400/10 transition-all shadow-sm placeholder:font-normal placeholder:text-gray-400 dark:placeholder:text-gray-500" 
                                           [class.border-red-400]="errorMsg()"
                                           [class.bg-red-50]="errorMsg()"
                                           placeholder="••••••••"
                                           [disabled]="isLoading()">
                                </div>
                            </div>

                            <!-- Shared Device & Remember Session Checkboxes (Horizontal Row) -->
                            <div class="mt-4 flex items-center justify-between gap-2 text-left relative">
                                <!-- Checkbox 1: Remember session -->
                                <label class="flex items-center gap-2 cursor-pointer group select-none bg-white/40 dark:bg-slate-850/40 px-2.5 py-1.5 rounded-xl border border-white/60 dark:border-slate-700/60 shadow-sm hover:bg-white/60 dark:hover:bg-slate-800/65 transition-all flex-1 min-w-0"
                                       [class.opacity-40]="isSharedDevice()"
                                       [class.pointer-events-none]="isSharedDevice()">
                                    <div class="relative flex items-center justify-center w-4 h-4 rounded border border-gray-300 dark:border-slate-650 group-hover:border-fuchsia-400 transition-colors shrink-0 duration-200" 
                                         [ngClass]="rememberSession() ? 'bg-fuchsia-50 border-fuchsia-500 dark:bg-fuchsia-950/50' : 'border-gray-300 dark:border-slate-650'">
                                        <input type="checkbox" [checked]="rememberSession()" (change)="toggleRememberSession()" class="opacity-0 absolute inset-0 cursor-pointer" [disabled]="isSharedDevice()">
                                        @if (rememberSession()) {
                                            <i class="fa-solid fa-check text-[9px] text-fuchsia-600 dark:text-fuchsia-450 animate-fade-in"></i>
                                        }
                                    </div>
                                    <span class="text-[11px] font-bold text-gray-500 dark:text-slate-400 group-hover:text-gray-755 dark:group-hover:text-slate-300 transition-colors truncate">Duy trì đăng nhập</span>
                                </label>

                                <!-- Checkbox 2: Shared Device -->
                                <label class="flex items-center gap-2 cursor-pointer group select-none bg-white/40 dark:bg-slate-850/40 px-2.5 py-1.5 rounded-xl border border-white/60 dark:border-slate-700/60 shadow-sm hover:bg-white/60 dark:hover:bg-slate-800/65 transition-all flex-1 min-w-0"
                                       [class.opacity-40]="rememberSession()"
                                       [class.pointer-events-none]="rememberSession()">
                                    <div class="relative flex items-center justify-center w-4 h-4 rounded border border-gray-300 dark:border-slate-650 group-hover:border-fuchsia-400 transition-colors shrink-0 duration-200" 
                                         [ngClass]="isSharedDevice() ? 'bg-fuchsia-50 border-fuchsia-500 dark:bg-fuchsia-950/50' : 'border-gray-300 dark:border-slate-650'">
                                        <input type="checkbox" [checked]="isSharedDevice()" (change)="toggleSharedDevice()" class="opacity-0 absolute inset-0 cursor-pointer" [disabled]="rememberSession()">
                                        @if (isSharedDevice()) {
                                            <i class="fa-solid fa-check text-[9px] text-fuchsia-600 dark:text-fuchsia-450 animate-fade-in"></i>
                                        }
                                    </div>
                                    <span class="text-[11px] font-bold text-gray-500 dark:text-slate-400 group-hover:text-gray-755 dark:group-hover:text-slate-300 transition-colors truncate">Máy dùng chung</span>
                                </label>

                                <!-- Tooltip Help Info -->
                                <div class="relative group/tooltip shrink-0">
                                    <button type="button" class="w-7 h-7 rounded-full bg-white/40 dark:bg-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-700/60 text-gray-400 dark:text-slate-500 hover:text-fuchsia-600 dark:hover:text-fuchsia-450 flex items-center justify-center text-xs transition-colors cursor-help border border-white/50 dark:border-slate-700/50 shadow-sm">
                                        <i class="fa-regular fa-circle-question text-[13px]"></i>
                                    </button>
                                    <!-- Tooltip content -->
                                    <div class="absolute bottom-full right-0 mb-2 w-64 bg-slate-900/95 dark:bg-slate-950/95 text-white text-[11px] p-3.5 rounded-2xl shadow-xl border border-slate-700/50 backdrop-blur-md opacity-0 scale-95 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100 transition-all duration-200 z-50 origin-bottom-right leading-relaxed">
                                        <div class="font-bold text-fuchsia-400 mb-1.5 flex items-center gap-1.5">
                                            <i class="fa-solid fa-shield-halved"></i> Hướng dẫn bảo mật phiên
                                        </div>
                                        <div class="space-y-1.5 text-slate-300">
                                            <div><strong>• Duy trì đăng nhập:</strong> Tắt tự động đăng xuất sau 30 phút không hoạt động và giữ phiên đăng nhập qua ngày (dành cho máy cá nhân).</div>
                                            <div><strong>• Máy dùng chung:</strong> Kích hoạt tự thoát 30 phút và tự động đăng xuất tài khoản Google khi nhấn Logout để bảo mật.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            @if (errorMsg()) {
                                <div class="px-4 py-3 rounded-2xl bg-red-50/80 backdrop-blur-sm border border-red-100 text-red-600 text-[13px] font-medium flex items-center gap-2 animate-shake">
                                    <i class="fa-solid fa-circle-exclamation text-red-500"></i> {{ errorMsg() }}
                                </div>
                            }

                            <button (click)="login()" [disabled]="isLoading()"
                                    class="w-full py-4 mt-2 bg-[linear-gradient(310deg,#7928ca,#ff0080)] hover:opacity-90 text-white rounded-2xl font-bold text-sm shadow-[0_4px_6px_-1px_rgba(203,12,159,0.2)] hover:shadow-[0_8px_15px_-6px_rgba(203,12,159,0.4)] hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 relative overflow-hidden group">
                                <div class="absolute inset-0 w-1/2 h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:animate-shimmer"></div>
                                @if (isLoading() && !isGoogleLoading()) { <i class="fa-solid fa-circle-notch fa-spin"></i> }
                                @else { <i class="fa-solid fa-shield-halved text-xs"></i> <span>Đăng Nhập Quản Trị</span> }
                            </button>
                        </div>
                    </div>
                }

                <!-- LOGIN MODE: QR SHOW -->
                @if (mode() === 'qr') {
                    <div class="animate-fade-in-up relative z-10 flex flex-col items-center text-center">
                        <h2 class="text-xl font-bold text-gray-700 dark:text-slate-200 mb-2">Đăng nhập nhanh</h2>
                        <p class="text-gray-500 dark:text-slate-400 text-[13px] mb-8 px-4">Sử dụng ứng dụng LIMS trên điện thoại để quét mã này.</p>

                        <div class="bg-white dark:bg-slate-800 p-3 rounded-[2rem] shadow-sm border border-gray-100 dark:border-slate-700 relative group w-64 h-64 mx-auto flex items-center justify-center overflow-hidden">
                            <canvas #qrCanvas class="w-56 h-56 relative z-10"></canvas>
                            
                            <!-- Scanner Line Overlay (Laser Pulse) -->
                            @if (qrStatus() === 'waiting' || qrStatus() === 'scanned') {
                                <div class="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent shadow-[0_0_8px_#d946ef] z-20 animate-laser"></div>
                            }
                            
                            <!-- Overlay status -->
                            @if (qrStatus() === 'approved') {
                                <div class="absolute inset-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm flex flex-col items-center justify-center rounded-[2rem] animate-fade-in z-30">
                                    <div class="w-16 h-16 bg-green-50 dark:bg-green-950/50 text-green-500 rounded-full flex items-center justify-center text-3xl mb-3 shadow-inner"><i class="fa-solid fa-check"></i></div>
                                    <span class="font-bold text-green-700 dark:text-green-400 text-lg">Thành công!</span>
                                    <span class="text-[13px] text-green-600/80 dark:text-green-550/80 font-medium mt-1">Đang chuyển hướng...</span>
                                </div>
                            }
                            @if (qrStatus() === 'expired') {
                                <div class="absolute inset-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm flex flex-col items-center justify-center rounded-[2rem] animate-fade-in cursor-pointer group-hover:bg-gray-50 dark:group-hover:bg-slate-700/60 transition-colors z-30" (click)="generateSession()">
                                    <div class="w-16 h-16 bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-slate-500 rounded-full flex items-center justify-center text-3xl mb-3 shadow-inner group-hover:scale-110 transition-transform"><i class="fa-solid fa-rotate-right"></i></div>
                                    <span class="font-bold text-gray-700 dark:text-slate-300">Mã hết hạn</span>
                                    <span class="text-[13px] text-fuchsia-600 dark:text-fuchsia-400 font-bold mt-1">Nhấn để tải lại</span>
                                </div>
                            }
                            @if (errorMsg() && mode() === 'qr') {
                                <div class="absolute inset-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm flex flex-col items-center justify-center rounded-[2rem] animate-fade-in p-6 text-center z-30">
                                    <div class="w-12 h-12 bg-red-50 dark:bg-red-950/50 text-red-500 rounded-full flex items-center justify-center text-2xl mb-3"><i class="fa-solid fa-triangle-exclamation"></i></div>
                                    <span class="font-bold text-red-700 dark:text-red-400 text-sm">Lỗi kết nối</span>
                                    <span class="text-[11px] text-red-500/80 mt-1 mb-4">{{ errorMsg() }}</span>
                                    <button (click)="generateSession()" class="px-4 py-2 bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/50 rounded-xl text-xs font-bold hover:bg-red-100 dark:hover:bg-red-900 transition-colors">Thử lại</button>
                                </div>
                            }
                        </div>

                        <!-- Shared Device & Remember Session Checkboxes (Horizontal Row) -->
                        <div class="mt-6 flex items-center justify-between gap-2 text-left relative w-full">
                            <!-- Checkbox 1: Remember session -->
                            <label class="flex items-center gap-2 cursor-pointer group select-none bg-white/40 dark:bg-slate-850/40 px-2.5 py-1.5 rounded-xl border border-white/60 dark:border-slate-700/60 shadow-sm hover:bg-white/60 dark:hover:bg-slate-800/65 transition-all flex-1 min-w-0"
                                   [class.opacity-40]="isSharedDevice()"
                                   [class.pointer-events-none]="isSharedDevice()">
                                <div class="relative flex items-center justify-center w-4 h-4 rounded border border-gray-300 dark:border-slate-650 group-hover:border-fuchsia-400 transition-colors shrink-0 duration-200" 
                                     [ngClass]="rememberSession() ? 'bg-fuchsia-50 border-fuchsia-500 dark:bg-fuchsia-950/50' : 'border-gray-300 dark:border-slate-650'">
                                    <input type="checkbox" [checked]="rememberSession()" (change)="toggleRememberSession()" class="opacity-0 absolute inset-0 cursor-pointer" [disabled]="isSharedDevice()">
                                    @if (rememberSession()) {
                                        <i class="fa-solid fa-check text-[9px] text-fuchsia-600 dark:text-fuchsia-450 animate-fade-in"></i>
                                    }
                                </div>
                                <span class="text-[11px] font-bold text-gray-500 dark:text-slate-400 group-hover:text-gray-755 dark:group-hover:text-slate-300 transition-colors truncate">Duy trì đăng nhập</span>
                            </label>

                            <!-- Checkbox 2: Shared Device -->
                            <label class="flex items-center gap-2 cursor-pointer group select-none bg-white/40 dark:bg-slate-850/40 px-2.5 py-1.5 rounded-xl border border-white/60 dark:border-slate-700/60 shadow-sm hover:bg-white/60 dark:hover:bg-slate-800/65 transition-all flex-1 min-w-0"
                                   [class.opacity-40]="rememberSession()"
                                   [class.pointer-events-none]="rememberSession()">
                                <div class="relative flex items-center justify-center w-4 h-4 rounded border border-gray-300 dark:border-slate-650 group-hover:border-fuchsia-400 transition-colors shrink-0 duration-200" 
                                     [ngClass]="isSharedDevice() ? 'bg-fuchsia-50 border-fuchsia-500 dark:bg-fuchsia-950/50' : 'border-gray-300 dark:border-slate-650'">
                                    <input type="checkbox" [checked]="isSharedDevice()" (change)="toggleSharedDevice()" class="opacity-0 absolute inset-0 cursor-pointer" [disabled]="rememberSession()">
                                    @if (isSharedDevice()) {
                                        <i class="fa-solid fa-check text-[9px] text-fuchsia-600 dark:text-fuchsia-450 animate-fade-in"></i>
                                    }
                                </div>
                                <span class="text-[11px] font-bold text-gray-500 dark:text-slate-400 group-hover:text-gray-755 dark:group-hover:text-slate-300 transition-colors truncate">Máy dùng chung</span>
                            </label>

                            <!-- Tooltip Help Info -->
                            <div class="relative group/tooltip shrink-0">
                                <button type="button" class="w-7 h-7 rounded-full bg-white/40 dark:bg-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-700/60 text-gray-400 dark:text-slate-500 hover:text-fuchsia-600 dark:hover:text-fuchsia-450 flex items-center justify-center text-xs transition-colors cursor-help border border-white/50 dark:border-slate-700/50 shadow-sm">
                                    <i class="fa-regular fa-circle-question text-[13px]"></i>
                                </button>
                                <!-- Tooltip content -->
                                <div class="absolute bottom-full right-0 mb-2 w-64 bg-slate-900/95 dark:bg-slate-950/95 text-white text-[11px] p-3.5 rounded-2xl shadow-xl border border-slate-700/50 backdrop-blur-md opacity-0 scale-95 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100 transition-all duration-200 z-50 origin-bottom-right leading-relaxed">
                                    <div class="font-bold text-fuchsia-400 mb-1.5 flex items-center gap-1.5">
                                        <i class="fa-solid fa-shield-halved"></i> Hướng dẫn bảo mật phiên
                                    </div>
                                    <div class="space-y-1.5 text-slate-300">
                                        <div><strong>• Duy trì đăng nhập:</strong> Tắt tự động đăng xuất sau 30 phút không hoạt động và giữ phiên đăng nhập qua ngày (dành cho máy cá nhân).</div>
                                        <div><strong>• Máy dùng chung:</strong> Kích hoạt tự thoát 30 phút và tự động đăng xuất tài khoản Google khi nhấn Logout để bảo mật.</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="mt-6 flex flex-col gap-4 w-full">
                            <div class="flex items-center gap-2 justify-center text-[13px] font-semibold text-gray-500 dark:text-slate-400 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm py-2 px-4 rounded-xl border border-white/60 dark:border-slate-700/60 shadow-sm">
                                <div class="w-2 h-2 rounded-full" [class.bg-fuchsia-500]="qrStatus() === 'waiting'" [class.animate-pulse]="qrStatus() === 'waiting'" [class.bg-gray-300]="qrStatus() !== 'waiting'"></div>
                                {{ qrStatus() === 'waiting' ? 'Đang chờ quét mã...' : (qrStatus() === 'scanned' ? 'Đã quét! Vui lòng xác nhận.' : 'Trạng thái: ' + qrStatus()) }}
                            </div>
                        </div>
                    </div>
                }

            </div>
            
            <!-- Footer -->
            <div class="text-center mt-6 text-[11px] font-medium text-gray-400 mb-8 select-none">
                &copy; {{year}} Angular Portal &bull; Thiết kế & Phát triển bởi Otada &bull; Sử dụng nội bộ<br>
                <span class="text-gray-400/80 dark:text-gray-500">NAFIQPM6 Laboratory Information Management System Cloud &bull; {{state.systemVersion()}}</span>
            </div>

            <!-- Install App Button & Prompt -->
            <app-pwa-install-prompt></app-pwa-install-prompt>

        </div>
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
    .animation-delay-6000 { animation-delay: 6s; }

    @keyframes laser {
      0% { top: 4%; }
      50% { top: 96%; }
      100% { top: 4%; }
    }
    .animate-laser { animation: laser 3s infinite ease-in-out; }

    @keyframes shimmer {
      0% { transform: skewX(-12deg) translateX(-100%); }
      100% { transform: skewX(-12deg) translateX(250%); }
    }
    .group:hover .group-hover\:animate-shimmer {
      animation: shimmer 1s ease-in-out forwards;
    }
  `]
})
export class LoginComponent implements OnInit, OnDestroy {
  auth = inject(AuthService);
  toast = inject(ToastService);
  state = inject(StateService);
  
  mode = signal<'google' | 'password' | 'qr'>('google');
  logoutReason = signal<string | null>(null);
  isSharedDevice = signal(false);
  rememberSession = signal(false);
  
  email = '';
  password = '';
  errorMsg = signal('');

  ngOnInit() {
    const reason = localStorage.getItem('lims_logout_reason');
    if (reason) {
      this.logoutReason.set(reason);
      localStorage.removeItem('lims_logout_reason');
    }
    const sharedPref = localStorage.getItem('lims_shared_device');
    if (sharedPref === 'true') {
      this.isSharedDevice.set(true);
    }
    const rememberPref = localStorage.getItem('lims_remember_session');
    if (rememberPref === 'true') {
      this.rememberSession.set(true);
    }
  }

  toggleSharedDevice() {
    this.isSharedDevice.set(!this.isSharedDevice());
    localStorage.setItem('lims_shared_device', this.isSharedDevice() ? 'true' : 'false');
    if (this.isSharedDevice()) {
      this.rememberSession.set(false);
      localStorage.setItem('lims_remember_session', 'false');
    }
    this.auth.updatePersistence(this.rememberSession());
  }

  toggleRememberSession() {
    this.rememberSession.set(!this.rememberSession());
    localStorage.setItem('lims_remember_session', this.rememberSession() ? 'true' : 'false');
    if (this.rememberSession()) {
      this.isSharedDevice.set(false);
      localStorage.setItem('lims_shared_device', 'false');
    }
    this.auth.updatePersistence(this.rememberSession());
  }

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
          this.sessionSub = this.auth.listenToAuthSession(this.currentSessionId, (session: any) => {
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
      
      const sessionIdToClose = this.currentSessionId;
      
      // Stop listener and timer immediately to avoid duplicate triggers
      if (this.sessionSub) { this.sessionSub(); this.sessionSub = undefined; }
      if (this.expiryTimer) { clearTimeout(this.expiryTimer); this.expiryTimer = null; }
      
      try {
          const [userEmail, cipherText] = encryptedData.split('|');
          if (!this.currentSecretKey) throw new Error("Missing key");
          
          const decryptedPass = this.xorDecrypt(cipherText, this.currentSecretKey);
          
          if (!decryptedPass) {
              throw new Error("Không thể giải mã thông tin mật khẩu.");
          }
          
          if (userEmail && decryptedPass) {
              await this.auth.login(userEmail, decryptedPass);
              this.toast.show('Đăng nhập qua QR thành công!', 'success');
              
              if (sessionIdToClose) {
                  this.auth.deleteAuthSession(sessionIdToClose).catch(() => {});
              }
              if (this.currentSessionId === sessionIdToClose) {
                  this.currentSessionId = null;
              }
          }
      } catch (e) {
          console.error(e);
          this.toast.show('Lỗi xác thực phiên đăng nhập.', 'error');
          
          if (sessionIdToClose) {
              this.auth.deleteAuthSession(sessionIdToClose).catch(() => {});
          }
          if (this.currentSessionId === sessionIdToClose) {
              this.currentSessionId = null;
          }
          
          this.generateSession(); // Retry safely
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
        // auth/popup-blocked: Hiện thông báo yêu cầu cho phép popup (KHÔNG redirect nữa)
        if (e.code === 'auth/popup-blocked') {
            this.errorMsg.set('Trình duyệt chặn popup. Nhấn biểu tượng 🔒 trên thanh địa chỉ → "Always allow popups" rồi thử lại.');
        } else if (e.code === 'auth/popup-closed-by-user') {
            this.errorMsg.set('Đã hủy đăng nhập Google.');
            // Let the finally block reset the loading spinners
        } else {
            this.handleError(e, true);
        }
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
