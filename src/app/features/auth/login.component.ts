import { Component, inject, signal, OnInit, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';


import { PwaInstallPromptComponent } from '../../shared/components/pwa-install-prompt.component';
import { StateService } from '../../core/services/state.service';
import { ChangelogService } from '../../core/services/changelog.service';
import { LogoComponent } from '../../shared/components/logo.component';
import { ensureQrious } from '../../shared/utils/external-script-loader';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, PwaInstallPromptComponent, LogoComponent, RouterLink],
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
                    <p class="text-gray-500 dark:text-slate-400 text-[13px] mt-2 font-medium">Hệ thống quản lý thông tin phòng thí nghiệm</p>
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
                        <i class="fa-solid fa-shield-halved mr-1"></i> Tài Khoản
                    </button>
                </div>

                <!-- LOGIN MODE: GOOGLE (PRIMARY) -->
                @if (mode() === 'google') {
                    <div class="animate-fade-in-up relative z-10 text-center">
                        <button type="button" (click)="loginGoogle()" [disabled]="isLoading()"
                                class="w-full py-4 mt-2 bg-white dark:bg-slate-800 backdrop-blur-md border border-white dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-750 text-gray-700 dark:text-slate-200 rounded-2xl font-bold text-sm shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all flex items-center justify-center gap-3 active:scale-[0.98] group relative overflow-hidden">
                            <!-- Subtle pink hover glow -->
                            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-pink-50/50 to-transparent dark:via-pink-950/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            
                            @if (isGoogleLoading()) { <i class="fa-solid fa-spinner fa-spin text-gray-400"></i> }
                            @else { 
                                <div class="w-8 h-8 rounded-full bg-red-50 dark:bg-red-950/50 flex items-center justify-center group-hover:bg-red-100 dark:group-hover:bg-red-900/50 transition-colors">
                                    <i class="fa-brands fa-google text-red-500 text-[16px] group-hover:scale-110 transition-transform"></i> 
                                </div>
                            }
                            <span class="text-[15px]">
                              Đăng nhập với Google
                            </span>
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
                                <span class="text-[10px] sm:text-[11px] font-bold text-gray-500 dark:text-slate-400 group-hover:text-gray-755 dark:group-hover:text-slate-300 transition-colors leading-tight whitespace-normal">Duy trì đăng nhập</span>
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
                                <span class="text-[10px] sm:text-[11px] font-bold text-gray-500 dark:text-slate-400 group-hover:text-gray-755 dark:group-hover:text-slate-300 transition-colors leading-tight whitespace-normal">Máy dùng chung</span>
                            </label>

                            <!-- Tooltip Help Info -->
                            <div class="relative group/tooltip shrink-0">
                                <button type="button" aria-label="Mở hướng dẫn bảo mật phiên" aria-controls="session-help" [attr.aria-expanded]="showSessionHelp()" (click)="showSessionHelp.set(!showSessionHelp())" class="w-7 h-7 rounded-full bg-white/40 dark:bg-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-700/60 text-gray-400 dark:text-slate-500 hover:text-fuchsia-600 dark:hover:text-fuchsia-450 flex items-center justify-center text-xs transition-colors cursor-help border border-white/50 dark:border-slate-700/50 shadow-sm">
                                    <i class="fa-regular fa-circle-question text-[13px]" aria-hidden="true"></i>
                                </button>
                                <!-- Tooltip content -->
                                <div id="session-help" role="note" [class.opacity-100]="showSessionHelp()" [class.scale-100]="showSessionHelp()" [class.pointer-events-auto]="showSessionHelp()" class="absolute bottom-full right-0 mb-2 w-64 bg-slate-900/95 dark:bg-slate-950/95 text-white text-[11px] p-3.5 rounded-2xl shadow-xl border border-slate-700/50 backdrop-blur-md opacity-0 scale-95 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100 transition-all duration-200 z-50 origin-bottom-right leading-relaxed">
                                    <div class="font-bold text-fuchsia-400 mb-1.5 flex items-center gap-1.5">
                                        <i class="fa-solid fa-shield-halved"></i> Hướng dẫn bảo mật phiên
                                    </div>
                                    <div class="space-y-1.5 text-slate-300">
                                        <div><strong>• Duy trì đăng nhập:</strong> Tắt tự động đăng xuất sau 30 phút không hoạt động và giữ phiên đăng nhập qua ngày (dành cho máy cá nhân).</div>
                                        <div><strong>• Máy dùng chung:</strong> Kích hoạt tự thoát 30 phút và tự động đăng xuất tài khoản Google khi nhấn đăng xuất để bảo mật.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        @if (errorMsg() || auth.googleRedirectError()) {
                            <div role="alert" aria-live="polite" class="mt-4 px-4 py-3 rounded-2xl bg-red-50/80 backdrop-blur-sm border border-red-100 text-red-600 text-[13px] font-medium flex items-center justify-center gap-2 animate-shake">
                                <i class="fa-solid fa-circle-exclamation text-red-500"></i> {{ errorMsg() || auth.googleRedirectError() }}
                            </div>
                        }

                        @if (auth.pendingGoogleLinkEmail()) {
                            <div class="mt-4 p-4 rounded-2xl bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-left">
                                <div class="text-xs font-bold text-amber-800 dark:text-amber-200 mb-1">Liên kết tài khoản hiện có</div>
                                <p class="text-[11px] text-amber-700 dark:text-amber-300 leading-relaxed mb-3">
                                    Email Google này đã có tài khoản LIMS. Nhập mật khẩu hiện tại để dùng chung một tài khoản.
                                </p>
                                <input type="password" [(ngModel)]="pendingLinkPassword" (keyup.enter)="linkGoogleAccount()"
                                       class="w-full px-3 py-2.5 rounded-xl border border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-slate-900/60 text-sm outline-none focus:border-amber-500"
                                       placeholder="Mật khẩu LIMS hiện tại" [disabled]="isLinkLoading()" autocomplete="current-password">
                                <button type="button" (click)="linkGoogleAccount()" [disabled]="isLinkLoading()"
                                        class="w-full mt-2.5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white text-xs font-bold transition flex items-center justify-center gap-2">
                                    @if (isLinkLoading()) { <i class="fa-solid fa-circle-notch fa-spin"></i> Đang liên kết... }
                                    @else { <i class="fa-solid fa-link"></i> Xác thực và liên kết Google }
                                </button>
                            </div>
                        }
                    </div>
                }

                <!-- LOGIN MODE: PASSWORD -->
                @if (mode() === 'password') {
                    <div class="animate-fade-in-up relative z-10">
                        <div class="space-y-4">
                            <div class="group">
                                <label for="login-email" class="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Gmail / Email hoặc username</label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <i class="fa-regular fa-user text-gray-400 group-focus-within:text-fuchsia-500 transition-colors"></i>
                                    </div>
                                    <input id="login-email" name="email" type="text" [(ngModel)]="email" (keyup.enter)="login()"
                                           autocomplete="username"
                                           class="w-full pl-11 pr-24 py-3.5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/40 dark:border-slate-700/40 rounded-2xl text-sm font-semibold text-gray-700 dark:text-slate-200 outline-none focus:bg-white focus:border-fuchsia-400 dark:focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-400/10 transition-all shadow-sm placeholder:font-normal placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                           [class.border-red-400]="errorMsg()"
                                           [class.bg-red-50]="errorMsg()"
                                           placeholder="Nhập Gmail hoặc username..."
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
                                    <label for="login-password" class="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">Mật khẩu</label>
                                </div>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <i class="fa-solid fa-lock text-gray-400 group-focus-within:text-fuchsia-500 transition-colors"></i>
                                    </div>
                                    <input id="login-password" name="password" [type]="showPassword() ? 'text' : 'password'" [(ngModel)]="password" (keyup.enter)="login()"
                                           autocomplete="current-password"
                                           class="w-full pl-11 pr-12 py-3.5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/40 dark:border-slate-700/40 rounded-2xl text-sm font-semibold text-gray-700 dark:text-slate-200 outline-none focus:bg-white focus:border-fuchsia-400 dark:focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-400/10 transition-all shadow-sm placeholder:font-normal placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                           [class.border-red-400]="errorMsg()"
                                           [class.bg-red-50]="errorMsg()"
                                           placeholder="••••••••"
                                           [disabled]="isLoading()">
                                    <button type="button" (click)="showPassword.set(!showPassword())" tabindex="-1" aria-label="Hiện hoặc ẩn mật khẩu"
                                            class="absolute inset-y-0 right-0 px-4 flex items-center text-gray-400 hover:text-fuchsia-600 transition-colors">
                                        <i class="fa-solid" [class.fa-eye]="!showPassword()" [class.fa-eye-slash]="showPassword()"></i>
                                    </button>
                                </div>
                            </div>

                            <!-- Shared Device & Remember Session iOS Toggles -->
                            <div class="mt-4 flex items-center justify-between gap-2 text-left relative">
                                <label class="flex items-center gap-2 cursor-pointer group select-none bg-white/40 dark:bg-slate-850/40 px-2.5 py-1.5 rounded-xl border border-white/60 dark:border-slate-700/60 shadow-sm hover:bg-white/60 dark:hover:bg-slate-800/65 transition-all flex-1 min-w-0"
                                       [class.opacity-40]="isSharedDevice()"
                                       [class.pointer-events-none]="isSharedDevice()">
                                    <span class="relative inline-flex h-5 w-9 shrink-0">
                                        <input type="checkbox" [checked]="rememberSession()" (change)="toggleRememberSession()" class="peer sr-only" [disabled]="isSharedDevice()" aria-label="Duy trì đăng nhập">
                                        <span class="absolute inset-0 rounded-full bg-slate-300 dark:bg-slate-600 transition-colors peer-checked:bg-fuchsia-500"></span>
                                        <span class="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-4"></span>
                                    </span>
                                    <span class="text-[10px] sm:text-[11px] font-bold text-gray-500 dark:text-slate-400 group-hover:text-gray-755 dark:group-hover:text-slate-300 transition-colors leading-tight whitespace-normal">Duy trì đăng nhập</span>
                                </label>

                                <label class="flex items-center gap-2 cursor-pointer group select-none bg-white/40 dark:bg-slate-850/40 px-2.5 py-1.5 rounded-xl border border-white/60 dark:border-slate-700/60 shadow-sm hover:bg-white/60 dark:hover:bg-slate-800/65 transition-all flex-1 min-w-0"
                                       [class.opacity-40]="rememberSession()"
                                       [class.pointer-events-none]="rememberSession()">
                                    <span class="relative inline-flex h-5 w-9 shrink-0">
                                        <input type="checkbox" [checked]="isSharedDevice()" (change)="toggleSharedDevice()" class="peer sr-only" [disabled]="rememberSession()" aria-label="Máy dùng chung">
                                        <span class="absolute inset-0 rounded-full bg-slate-300 dark:bg-slate-600 transition-colors peer-checked:bg-fuchsia-500"></span>
                                        <span class="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-4"></span>
                                    </span>
                                    <span class="text-[10px] sm:text-[11px] font-bold text-gray-500 dark:text-slate-400 group-hover:text-gray-755 dark:group-hover:text-slate-300 transition-colors leading-tight whitespace-normal">Máy dùng chung</span>
                                </label>

                                <!-- Tooltip Help Info -->
                                <div class="relative group/tooltip shrink-0">
                                    <button type="button" aria-label="Mở hướng dẫn bảo mật phiên" aria-controls="session-help" [attr.aria-expanded]="showSessionHelp()" (click)="showSessionHelp.set(!showSessionHelp())" class="w-7 h-7 rounded-full bg-white/40 dark:bg-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-700/60 text-gray-400 dark:text-slate-500 hover:text-fuchsia-600 dark:hover:text-fuchsia-450 flex items-center justify-center text-xs transition-colors cursor-help border border-white/50 dark:border-slate-700/50 shadow-sm">
                                        <i class="fa-regular fa-circle-question text-[13px]" aria-hidden="true"></i>
                                    </button>
                                    <div id="session-help" role="note" [class.opacity-100]="showSessionHelp()" [class.scale-100]="showSessionHelp()" [class.pointer-events-auto]="showSessionHelp()" class="absolute bottom-full right-0 mb-2 w-64 bg-slate-900/95 dark:bg-slate-950/95 text-white text-[11px] p-3.5 rounded-2xl shadow-xl border border-slate-700/50 backdrop-blur-md opacity-0 scale-95 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100 transition-all duration-200 z-50 origin-bottom-right leading-relaxed">
                                        <div class="font-bold text-fuchsia-400 mb-1.5 flex items-center gap-1.5">
                                            <i class="fa-solid fa-shield-halved"></i> Hướng dẫn bảo mật phiên
                                        </div>
                                        <div class="space-y-1.5 text-slate-300">
                                            <div><strong>• Duy trì đăng nhập:</strong> Giữ phiên đăng nhập trên máy cá nhân.</div>
                                            <div><strong>• Máy dùng chung:</strong> Tự thoát phiên sau thời gian không hoạt động.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            @if (errorMsg()) {
                                <div class="px-4 py-3 rounded-2xl bg-red-50/80 backdrop-blur-sm border border-red-100 text-red-600 text-[13px] font-medium flex items-center gap-2 animate-shake">
                                    <i class="fa-solid fa-circle-exclamation text-red-500"></i> {{ errorMsg() }}
                                </div>
                            }

                            <div class="text-right -mt-1">
                                <button type="button" (click)="auth.openForgotPassword()"
                                        class="text-[11px] font-bold text-fuchsia-600 dark:text-fuchsia-400 hover:underline">
                                    Quên mật khẩu?
                                </button>
                            </div>

                            <button (click)="login()" [disabled]="isLoading()"
                                    class="w-full py-4 mt-2 bg-[linear-gradient(310deg,#7928ca,#ff0080)] hover:opacity-90 text-white rounded-2xl font-bold text-sm shadow-[0_4px_6px_-1px_rgba(203,12,159,0.2)] hover:shadow-[0_8px_15px_-6px_rgba(203,12,159,0.4)] hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 relative overflow-hidden group">
                                <div class="absolute inset-0 w-1/2 h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:animate-shimmer"></div>
                                @if (isLoading() && !isGoogleLoading()) { <i class="fa-solid fa-circle-notch fa-spin"></i> }
                                @else { <i class="fa-solid fa-shield-halved text-xs"></i> <span>Đăng nhập LIMS</span> }
                            </button>
                        </div>
                    </div>
                }

                <!-- LOGIN MODE: QR SHOW -->
                @if (mode() === 'qr') {
                    <div class="animate-fade-in-up relative z-10 flex flex-col items-center text-center">
                        <h2 class="text-xl font-bold text-gray-700 dark:text-slate-200 mb-2">Đăng Nhập Nhanh</h2>
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
                                <button type="button" aria-label="Tạo lại mã QR đăng nhập" class="absolute inset-0 w-full bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm flex flex-col items-center justify-center rounded-[2rem] animate-fade-in cursor-pointer group-hover:bg-gray-50 dark:group-hover:bg-slate-700/60 transition-colors z-30" (click)="generateSession()">
                                    <div class="w-16 h-16 bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-slate-500 rounded-full flex items-center justify-center text-3xl mb-3 shadow-inner group-hover:scale-110 transition-transform"><i class="fa-solid fa-rotate-right" aria-hidden="true"></i></div>
                                    <span class="font-bold text-gray-700 dark:text-slate-300">Mã hết hạn</span>
                                    <span class="text-[13px] text-fuchsia-600 dark:text-fuchsia-400 font-bold mt-1">Nhấn để tải lại</span>
                                </button>
                            }
                            @if (errorMsg() && mode() === 'qr') {
                                <div class="absolute inset-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm flex flex-col items-center justify-center rounded-[2rem] animate-fade-in p-6 text-center z-30">
                                    <div class="w-12 h-12 bg-red-50 dark:bg-red-950/50 text-red-500 rounded-full flex items-center justify-center text-2xl mb-3"><i class="fa-solid fa-triangle-exclamation"></i></div>
                                    <span class="font-bold text-red-700 dark:text-red-400 text-sm">Lỗi kết nối</span>
                                    <span class="text-[11px] text-red-500/80 mt-1 mb-4">{{ errorMsg() }}</span>
                                    <button type="button" aria-label="Thử lại tạo mã QR" (click)="generateSession()" class="px-4 py-2 bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/50 rounded-xl text-xs font-bold hover:bg-red-100 dark:hover:bg-red-900 transition-colors">Thử Lại</button>
                                </div>
                            }
                        </div>

                        <!-- Shared Device & Remember Session iOS Toggles -->
                        <div class="mt-6 flex items-center justify-between gap-2 text-left relative w-full">
                            <label class="flex items-center gap-2 cursor-pointer group select-none bg-white/40 dark:bg-slate-850/40 px-2.5 py-1.5 rounded-xl border border-white/60 dark:border-slate-700/60 shadow-sm hover:bg-white/60 dark:hover:bg-slate-800/65 transition-all flex-1 min-w-0"
                                   [class.opacity-40]="isSharedDevice()"
                                   [class.pointer-events-none]="isSharedDevice()">
                                <span class="relative inline-flex h-5 w-9 shrink-0">
                                    <input type="checkbox" [checked]="rememberSession()" (change)="toggleRememberSession()" class="peer sr-only" [disabled]="isSharedDevice()" aria-label="Duy trì đăng nhập">
                                    <span class="absolute inset-0 rounded-full bg-slate-300 dark:bg-slate-600 transition-colors peer-checked:bg-fuchsia-500"></span>
                                    <span class="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-4"></span>
                                </span>
                                <span class="text-[10px] sm:text-[11px] font-bold text-gray-500 dark:text-slate-400 group-hover:text-gray-755 dark:group-hover:text-slate-300 transition-colors leading-tight whitespace-normal">Duy trì đăng nhập</span>
                            </label>

                            <label class="flex items-center gap-2 cursor-pointer group select-none bg-white/40 dark:bg-slate-850/40 px-2.5 py-1.5 rounded-xl border border-white/60 dark:border-slate-700/60 shadow-sm hover:bg-white/60 dark:hover:bg-slate-800/65 transition-all flex-1 min-w-0"
                                   [class.opacity-40]="rememberSession()"
                                   [class.pointer-events-none]="rememberSession()">
                                <span class="relative inline-flex h-5 w-9 shrink-0">
                                    <input type="checkbox" [checked]="isSharedDevice()" (change)="toggleSharedDevice()" class="peer sr-only" [disabled]="rememberSession()" aria-label="Máy dùng chung">
                                    <span class="absolute inset-0 rounded-full bg-slate-300 dark:bg-slate-600 transition-colors peer-checked:bg-fuchsia-500"></span>
                                    <span class="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-4"></span>
                                </span>
                                <span class="text-[10px] sm:text-[11px] font-bold text-gray-500 dark:text-slate-400 group-hover:text-gray-755 dark:group-hover:text-slate-300 transition-colors leading-tight whitespace-normal">Máy dùng chung</span>
                            </label>

                            <!-- Tooltip Help Info -->
                            <div class="relative group/tooltip shrink-0">
                                <button type="button" aria-label="Mở hướng dẫn bảo mật phiên" aria-controls="session-help" [attr.aria-expanded]="showSessionHelp()" (click)="showSessionHelp.set(!showSessionHelp())" class="w-7 h-7 rounded-full bg-white/40 dark:bg-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-700/60 text-gray-400 dark:text-slate-500 hover:text-fuchsia-600 dark:hover:text-fuchsia-450 flex items-center justify-center text-xs transition-colors cursor-help border border-white/50 dark:border-slate-700/50 shadow-sm">
                                    <i class="fa-regular fa-circle-question text-[13px]" aria-hidden="true"></i>
                                </button>
                                <!-- Tooltip content -->
                                <div id="session-help" role="note" [class.opacity-100]="showSessionHelp()" [class.scale-100]="showSessionHelp()" [class.pointer-events-auto]="showSessionHelp()" class="absolute bottom-full right-0 mb-2 w-64 bg-slate-900/95 dark:bg-slate-950/95 text-white text-[11px] p-3.5 rounded-2xl shadow-xl border border-slate-700/50 backdrop-blur-md opacity-0 scale-95 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100 transition-all duration-200 z-50 origin-bottom-right leading-relaxed">
                                    <div class="font-bold text-fuchsia-400 mb-1.5 flex items-center gap-1.5">
                                        <i class="fa-solid fa-shield-halved"></i> Hướng dẫn bảo mật phiên
                                    </div>
                                    <div class="space-y-1.5 text-slate-300">
                                            <div><strong>• Duy trì đăng nhập:</strong> Tắt tự động đăng xuất sau 30 phút không hoạt động và giữ phiên đăng nhập qua ngày (dành cho máy cá nhân).</div>
                                        <div><strong>• Máy dùng chung:</strong> Kích hoạt tự thoát 30 phút và tự động đăng xuất tài khoản Google khi nhấn đăng xuất để bảo mật.</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="mt-6 flex flex-col gap-4 w-full">
                            <div role="status" aria-live="polite" class="flex items-center gap-2 justify-center text-[13px] font-semibold text-gray-500 dark:text-slate-400 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm py-2 px-4 rounded-xl border border-white/60 dark:border-slate-700/60 shadow-sm">
                                <div class="w-2 h-2 rounded-full" [class.bg-fuchsia-500]="qrStatus() === 'waiting'" [class.animate-pulse]="qrStatus() === 'waiting'" [class.bg-gray-300]="qrStatus() !== 'waiting'"></div>
                                {{ qrStatus() === 'waiting' ? 'Đang chờ quét mã...' : (qrStatus() === 'scanned' ? 'Đã quét! Vui lòng xác nhận.' : 'Trạng thái: ' + qrStatus()) }}
                            </div>
                        </div>
                    </div>
                }

            </div>
            
            <!-- Footer -->
            <div class="text-center mt-4 sm:mt-6 text-[11px] font-medium text-gray-400 mb-4 sm:mb-8 px-2 leading-relaxed select-none">
                <div class="mb-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 no-print text-center">
                    <a routerLink="/privacy-policy" class="hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition-colors cursor-pointer font-bold">Chính sách bảo mật</a>
                    <span class="text-gray-300 dark:text-slate-700">&bull;</span>
                    <a routerLink="/terms-of-service" class="hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition-colors cursor-pointer font-bold">Điều khoản sử dụng</a>
                    <span class="text-gray-300 dark:text-slate-700">&bull;</span>
                    <button type="button" (click)="changelogService.open()" class="hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition-colors cursor-pointer font-bold flex items-center gap-1 inline-flex">
                        <i class="fa-solid fa-scroll text-blue-500"></i> Nhật ký cập nhật
                    </button>
                </div>
                <div class="break-words">&copy; {{year}} Angular Portal &bull; Thiết kế & Phát triển bởi Otada &bull; Sử dụng nội bộ</div>
                <div class="text-gray-400/80 dark:text-gray-500 break-words">NAFIQPM6 Laboratory Information Management System Cloud &bull; {{state.systemVersion()}}</div>
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
  changelogService = inject(ChangelogService);
  
  mode = signal<'google' | 'password' | 'qr'>('google');
  logoutReason = signal<string | null>(null);
  isSharedDevice = signal(false);
  rememberSession = signal(false);
  showSessionHelp = signal(false);

  @HostListener('document:keydown.escape')
  closeSessionHelp(): void {
    if (this.showSessionHelp()) this.showSessionHelp.set(false);
  }
  
  email = '';
  password = '';
  showPassword = signal(false);
  pendingLinkPassword = '';
  errorMsg = signal('');
  isPWA = signal<boolean>(false);
  
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

    if (window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone) {
      this.isPWA.set(true);
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
  isLinkLoading = signal(false);
  isResetLoading = signal(false);
  year = new Date().getFullYear();


  // QR Handshake State (Secure Redesign)
  // Desktop t\u1ea1o session qua /api/qr/create, Mobile approve qua /api/qr/approve,
  // Desktop nh\u1eadn customToken t\u1eeb /api/qr/status v\u00e0 signInWithCustomToken().
  @ViewChild('qrCanvas') qrCanvas!: ElementRef;
  qrStatus = signal<'waiting' | 'scanned' | 'approved' | 'expired'>('waiting');
  currentSessionId: string | null = null;
  private pollInterval: any = null;
  private expiryTimer: any;

  ngOnDestroy() {
      this.cleanupSession();
  }

  switchMode(m: 'google' | 'password' | 'qr') {
      this.mode.set(m);
      this.errorMsg.set('');
      this.auth.clearGoogleRedirectError();
      if (m === 'qr') {
          setTimeout(() => this.generateSession(), 100);
      } else {
          this.cleanupSession();
      }
  }

  async generateSession() {
      this.cleanupSession();
      this.errorMsg.set('');
      this.qrStatus.set('waiting');

      try {
          // 1. Tạo session bằng Admin SDK qua Vercel serverless function
          const createRes = await fetch('/api/qr/create', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({})
          });

          if (!createRes.ok) {
              throw new Error(`Server error: ${createRes.status}`);
          }

          const { sessionId, nonce, expiresAt } = await createRes.json();
          this.currentSessionId = sessionId;

          // 2. Hiển thị QR với format mới: LIMS_QR|sessionId|nonce
          // Mobile đọc QR này và gửi lên /api/qr/approve kèm Firebase ID Token
          try {
              const QRious = await ensureQrious();
              const qrData = `LIMS_QR|${sessionId}|${nonce}`;
              new QRious({
                  element: this.qrCanvas.nativeElement,
                  value: qrData,
                  size: 256,
                  level: 'M'
              });
          } catch (e) {
              console.error('QR library load error:', e);
              this.errorMsg.set('Không thể tải thư viện tạo mã QR. Vui lòng kiểm tra kết nối mạng.');
              return;
          }

          // 3. Poll /api/qr/status mỗi 3 giây để chờ Mobile approve
          this.pollInterval = setInterval(async () => {
              if (!this.currentSessionId) return;
              try {
                  const statusRes = await fetch(`/api/qr/status?sessionId=${encodeURIComponent(this.currentSessionId)}`);
                  if (!statusRes.ok) return;

                  const statusData = await statusRes.json();

                  if (statusData.status === 'approved' && statusData.customToken) {
                      this.qrStatus.set('approved');
                      this.cleanupSession(false);
                      await this.handleApproval(statusData.customToken);
                  } else if (statusData.status === 'expired') {
                      this.qrStatus.set('expired');
                      this.cleanupSession(false);
                  }
              } catch {
                  // Lỗi mạng tạm thời — tiếp tục poll
              }
          }, 3000);

          // 4. Bộ đếm hết hạn dựa trên expiresAt từ server
          const remainingMs = Math.max((expiresAt - Date.now()), 0);
          this.expiryTimer = setTimeout(() => {
              this.qrStatus.set('expired');
              this.cleanupSession(false);
          }, remainingMs);

      } catch (e: any) {
          console.error('[QR generateSession] Error:', e);
          this.errorMsg.set('Không thể tạo phiên kết nối. Vui lòng thử lại.');
      }
  }

  cleanupSession(clearId = true) {
      if (this.pollInterval) { clearInterval(this.pollInterval); this.pollInterval = null; }
      if (this.expiryTimer) { clearTimeout(this.expiryTimer); this.expiryTimer = null; }
      if (this.currentSessionId && clearId) {
          this.auth.deleteAuthSession(this.currentSessionId).catch(() => {});
          this.currentSessionId = null;
      }
  }

  async handleApproval(customToken: string) {
      // Desktop nhận customToken từ /api/qr/status, dùng signInWithCustomToken() để đăng nhập.
      // Không có password nào được truyền trong quá trình này.
      try {
          const { getAuth, signInWithCustomToken } = await import('firebase/auth');
          const auth = getAuth();
          await signInWithCustomToken(auth, customToken);
          this.toast.show('Đăng nhập qua QR thành công!', 'success');
      } catch (e) {
          console.error('[QR handleApproval] Error:', e);
          this.toast.show('Lỗi xác thực phiên đăng nhập.', 'error');
          this.generateSession(); // Thử lại
      }
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

  loginGoogle() {
    this.errorMsg.set('');
    this.auth.clearGoogleRedirectError();
    this.isLoading.set(true);
    this.isGoogleLoading.set(true);

    // Redirect navigates away from this document on success. Only reset the
    // button state when Firebase reports that the redirect could not start.
    void this.auth.loginWithGoogle().catch((e: any) => {
        if (e) {
            this.errorMsg.set(this.auth.googleRedirectError() || 'Không thể bắt đầu đăng nhập Google.');
        }
        this.isLoading.set(false);
        this.isGoogleLoading.set(false);
    });
  }

  async linkGoogleAccount(): Promise<void> {
    if (!this.pendingLinkPassword) {
      this.errorMsg.set('Vui lòng nhập mật khẩu LIMS hiện tại.');
      return;
    }
    this.errorMsg.set('');
    this.isLinkLoading.set(true);
    try {
      await this.auth.linkPendingGoogleAccount(this.pendingLinkPassword);
      this.pendingLinkPassword = '';
      this.toast.show('Đã liên kết Google với tài khoản LIMS.', 'success');
    } catch (error: any) {
      this.handleError(error, false);
    } finally {
      this.isLinkLoading.set(false);
    }
  }

  async sendPasswordReset(): Promise<void> {
    if (!this.email.trim()) {
      this.errorMsg.set('Vui lòng nhập Gmail hoặc email trước.');
      return;
    }
    this.errorMsg.set('');
    this.isResetLoading.set(true);
    try {
      await this.auth.sendPasswordReset(this.email);
      this.toast.show('Đã gửi email khôi phục mật khẩu. Hãy kiểm tra hộp thư.', 'success');
    } catch (error: any) {
      this.handleError(error, false);
    } finally {
      this.isResetLoading.set(false);
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
      } else if (code === 'auth/weak-password') {
          this.errorMsg.set(msg || 'Mật khẩu chưa đủ mạnh.');
      } else if (code === 'auth/requires-recent-login') {
          this.errorMsg.set('Phiên đăng nhập đã cũ. Vui lòng đăng nhập lại rồi thử lại.');
      } else {
          this.errorMsg.set('Không thể hoàn tất đăng nhập. Vui lòng kiểm tra thông tin và thử lại.');
      }
  }
}
