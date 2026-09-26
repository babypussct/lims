import { Component, inject, signal, OnInit, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService, type DeviceMode } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';


import { PwaInstallPromptComponent } from '../../shared/components/pwa-install-prompt.component';
import { StateService } from '../../core/services/state.service';
import { ChangelogService } from '../../core/services/changelog.service';
import { LogoComponent } from '../../shared/components/logo.component';
import { ensureQrious } from '../../shared/utils/external-script-loader';
import { AppModalShellComponent } from '../../shared/components/ui/modal-shell/modal-shell.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, PwaInstallPromptComponent, LogoComponent, RouterLink, AppModalShellComponent],
  template: `
    @if (!auth.currentUser()) {
      <div class="min-h-screen w-full flex items-center justify-center overflow-x-hidden overflow-y-auto px-4 py-6 sm:py-8 relative font-sans selection:bg-fuchsia-500 selection:text-white bg-[#f8fafc] dark:bg-slate-950">
        
        <!-- Calm workstation background: Soft UI-inspired, no decorative motion. -->
        <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div class="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-fuchsia-50/80 to-transparent dark:from-fuchsia-950/20"></div>
            <!-- Subtle Grid Pattern Overlay for a "Lab" feel -->
            <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wNCkiLz48L3N2Zz4=')] opacity-60 dark:opacity-20"></div>
        </div>

        <!-- Centered application panel -->
        <div class="relative z-10 w-[calc(100vw-2rem)] sm:w-full min-w-0 max-w-[420px] mx-auto">
            
            <div class="w-full min-w-0 max-w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-2xl p-5 sm:p-8 relative overflow-hidden">

                <div class="text-center mb-8 relative z-10">
                    <div class="inline-flex items-center justify-center w-24 h-24 mb-6">
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
                <div class="relative z-10 w-full min-w-0 overflow-hidden bg-gray-100/80 dark:bg-slate-800/80 backdrop-blur-sm p-1 rounded-2xl flex items-center mb-6 border border-gray-200/30 dark:border-slate-700/30 shadow-inner h-10 select-none">
                    <!-- Sliding highlight indicator -->
                    <div class="absolute top-1 bottom-1 rounded-xl bg-white dark:bg-slate-700 shadow-sm transition-all duration-300 ease-out pointer-events-none"
                         [style.width.%]="31"
                         [style.left.%]="mode() === 'google' ? 1.5 : (mode() === 'qr' ? 34.5 : 67.5)">
                    </div>

                    <button (click)="switchMode('google')" class="flex-1 min-w-0 py-1.5 text-center text-xs font-bold transition-all relative z-10 cursor-pointer select-none rounded-xl"
                            [class.text-fuchsia-600]="mode() === 'google'"
                            [class.dark:text-fuchsia-400]="mode() === 'google'"
                            [class.text-gray-500]="mode() !== 'google'">
                        <i class="fa-brands fa-google mr-1"></i> Google
                    </button>
                    <button (click)="switchMode('qr')" class="flex-1 min-w-0 py-1.5 text-center text-xs font-bold transition-all relative z-10 cursor-pointer select-none rounded-xl"
                            [class.text-fuchsia-600]="mode() === 'qr'"
                            [class.dark:text-fuchsia-400]="mode() === 'qr'"
                            [class.text-gray-500]="mode() !== 'qr'">
                        <i class="fa-solid fa-qrcode mr-1"></i> Mã QR
                    </button>
                    <button (click)="switchMode('password')" class="flex-1 min-w-0 py-1.5 text-center text-xs font-bold transition-all relative z-10 cursor-pointer select-none rounded-xl"
                            [class.text-fuchsia-600]="mode() === 'password'"
                            [class.dark:text-fuchsia-400]="mode() === 'password'"
                            [class.text-gray-500]="mode() !== 'password'">
                        <i class="fa-solid fa-shield-halved mr-1"></i> Tài Khoản
                    </button>
                </div>

                <!-- TEMPLATE: CỤM CHỌN CHẾ ĐỘ THIẾT BỊ (SEGMENTED CONTROL / RADIO GROUP - SOFT UI) -->
                <ng-template #deviceModeSwitch>
                    <div class="relative z-10 select-none">
                        <div class="sr-only" id="device-mode-heading">Chế độ thiết bị</div>

                        <div role="radiogroup"
                             aria-labelledby="device-mode-heading"
                             aria-describedby="device-mode-caption"
                             class="relative w-full min-w-0 overflow-hidden bg-slate-100/90 dark:bg-slate-800/90 p-1 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 inset-soft-well flex items-center backdrop-blur-sm h-11">

                            <!-- Sliding Highlight Thumb -->
                            <div class="absolute top-1 bottom-1 left-1 device-mode-thumb rounded-xl bg-white dark:bg-slate-700 thumb-transition pointer-events-none z-0 border"
                                 [class.pill-thumb-amber]="auth.isSharedDevice()"
                                 [class.border-amber-200/80]="auth.isSharedDevice()"
                                 [class.dark:border-amber-600/50]="auth.isSharedDevice()"
                                 [class.pill-thumb-fuchsia]="auth.rememberSession()"
                                 [class.border-fuchsia-200/80]="auth.rememberSession()"
                                 [class.dark:border-fuchsia-600/50]="auth.rememberSession()"
                                 [style.transform]="auth.isSharedDevice() ? 'translateX(0)' : 'translateX(100%)'"
                                 aria-hidden="true">
                            </div>

                            <!-- Option 1: Máy dùng chung (Default) -->
                            <button type="button"
                                    role="radio"
                                    id="device-mode-shared"
                                    [attr.aria-checked]="auth.isSharedDevice()"
                                    [attr.tabindex]="auth.isSharedDevice() ? 0 : -1"
                                    (click)="selectDeviceMode('shared')"
                                    (keydown)="handleDeviceModeKeyNav($event, 'shared')"
                                    class="device-mode-option flex-1 py-1.5 px-2 sm:px-3 rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 text-xs font-bold transition-colors relative z-10 cursor-pointer min-w-0 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
                                    [class.text-amber-800]="auth.isSharedDevice()"
                                    [class.dark:text-amber-300]="auth.isSharedDevice()"
                                    [class.text-slate-500]="!auth.isSharedDevice()"
                                    [class.dark:text-slate-400]="!auth.isSharedDevice()"
                                    [class.hover:text-slate-700]="!auth.isSharedDevice()"
                                    [class.dark:hover:text-slate-300]="!auth.isSharedDevice()">
                                <div class="device-mode-icon w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors"
                                     [class.bg-amber-100]="auth.isSharedDevice()"
                                     [class.dark:bg-amber-950/70]="auth.isSharedDevice()"
                                     [class.bg-transparent]="!auth.isSharedDevice()">
                                    <i class="fa-solid fa-users text-[13px]"
                                       [class.text-amber-600]="auth.isSharedDevice()"
                                       [class.dark:text-amber-400]="auth.isSharedDevice()"
                                       [class.text-slate-400]="!auth.isSharedDevice()"
                                       [class.dark:text-slate-500]="!auth.isSharedDevice()"
                                       aria-hidden="true"></i>
                                </div>
                                <span class="device-mode-option-label tracking-tight">Máy dùng chung</span>
                            </button>

                            <!-- Option 2: Duy trì đăng nhập -->
                            <button type="button"
                                    role="radio"
                                    id="device-mode-personal"
                                    [attr.aria-checked]="auth.rememberSession()"
                                    [attr.tabindex]="auth.rememberSession() ? 0 : -1"
                                    (click)="selectDeviceMode('personal')"
                                    (keydown)="handleDeviceModeKeyNav($event, 'personal')"
                                    class="device-mode-option flex-1 py-1.5 px-2 sm:px-3 rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 text-xs font-bold transition-colors relative z-10 cursor-pointer min-w-0 focus-visible:ring-2 focus-visible:ring-fuchsia-500 focus-visible:outline-none"
                                    [class.text-fuchsia-700]="auth.rememberSession()"
                                    [class.dark:text-fuchsia-300]="auth.rememberSession()"
                                    [class.text-slate-500]="!auth.rememberSession()"
                                    [class.dark:text-slate-400]="!auth.rememberSession()"
                                    [class.hover:text-slate-700]="!auth.rememberSession()"
                                    [class.dark:hover:text-slate-300]="!auth.rememberSession()">
                                <div class="device-mode-icon w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors"
                                     [class.bg-fuchsia-100]="auth.rememberSession()"
                                     [class.dark:bg-fuchsia-950/70]="auth.rememberSession()"
                                     [class.bg-transparent]="!auth.rememberSession()">
                                    <i class="fa-solid fa-user-lock text-[13px]"
                                       [class.text-fuchsia-600]="auth.rememberSession()"
                                       [class.dark:text-fuchsia-400]="auth.rememberSession()"
                                       [class.text-slate-400]="!auth.rememberSession()"
                                       [class.dark:text-slate-500]="!auth.rememberSession()"
                                       aria-hidden="true"></i>
                                </div>
                                <span class="device-mode-option-label tracking-tight">Duy trì đăng nhập</span>
                            </button>
                        </div>

                        <!-- Dynamic Sub-caption & Help Toggle -->
                        <div class="mt-2 px-1.5 min-w-0 flex items-start justify-between min-h-[34px] text-[11px] leading-relaxed transition-all">
                            <div id="device-mode-caption" class="min-w-0 flex-1 flex items-start gap-1.5" aria-live="polite">
                                @if (auth.isSharedDevice()) {
                                    <div class="w-4 h-4 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center shrink-0 mt-0.5" aria-hidden="true">
                                        <i class="fa-solid fa-clock-rotate-left text-amber-600 dark:text-amber-400 text-[9px]"></i>
                                    </div>
                                    <span class="text-amber-900/90 dark:text-amber-200/90 text-left">
                                        Phiên tạm thời &bull; Tự đăng xuất sau <strong>30 phút</strong> không thao tác trên máy tính &bull; Phù hợp với máy phòng lab.
                                    </span>
                                } @else {
                                    <div class="w-4 h-4 rounded-full bg-fuchsia-50 dark:bg-fuchsia-950/50 border border-fuchsia-200 dark:border-fuchsia-800/60 flex items-center justify-center shrink-0 mt-0.5" aria-hidden="true">
                                        <i class="fa-solid fa-shield-check text-fuchsia-600 dark:text-fuchsia-400 text-[9px]"></i>
                                    </div>
                                    <span class="text-fuchsia-950/90 dark:text-fuchsia-200/90 text-left">
                                        Giữ phiên trên trình duyệt này sau khi mở lại &bull; Chỉ dùng trên máy tính cá nhân.
                                    </span>
                                }
                            </div>

                            <!-- Tooltip Help Info Trigger -->
                            <div class="relative shrink-0 ml-1.5">
                                <button type="button"
                                        aria-label="Mở hướng dẫn bảo mật phiên"
                                        aria-controls="session-help"
                                        [attr.aria-expanded]="showSessionHelp()"
                                        (click)="showSessionHelp.set(true)"
                                        class="w-6 h-6 rounded-full bg-white/40 dark:bg-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-700/60 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 flex items-center justify-center text-xs transition-colors cursor-pointer border border-slate-200/50 dark:border-slate-700/50 shadow-sm focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none">
                                    <i class="fa-regular fa-circle-question text-[12px]" aria-hidden="true"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </ng-template>

                <!-- LOGIN MODE: GOOGLE (PRIMARY) -->
                @if (mode() === 'google') {
                    <div class="animate-fade-in-up relative z-10 text-center">
                        <button type="button" (click)="loginGoogle()" [disabled]="isLoading()"
                                class="w-full py-4 mt-2 bg-white dark:bg-slate-800 backdrop-blur-md border border-white dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-750 text-gray-700 dark:text-slate-200 rounded-2xl font-bold text-sm shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all flex items-center justify-center gap-3 active:scale-[0.98] group relative overflow-hidden">
                            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-fuchsia-50/60 to-transparent dark:via-fuchsia-950/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            
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

                        <div class="mt-4">
                            <ng-container *ngTemplateOutlet="deviceModeSwitch"></ng-container>
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

                            <div class="mt-2">
                                <ng-container *ngTemplateOutlet="deviceModeSwitch"></ng-container>
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
                        <p class="text-gray-500 dark:text-slate-400 text-[13px] mb-6 px-4">Sử dụng ứng dụng LIMS trên điện thoại để quét mã này.</p>

                        <div class="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 relative group w-64 h-64 mx-auto flex items-center justify-center overflow-hidden">
                            <canvas #qrCanvas class="w-56 h-56 relative z-10"></canvas>
                            
                            <!-- Static scanner guide: preserves affordance without continuous motion. -->
                            @if (qrStatus() === 'waiting' || qrStatus() === 'scanned') {
                                <div class="absolute left-4 right-4 top-1/2 h-px bg-gradient-to-r from-transparent via-fuchsia-500/60 to-transparent z-20" aria-hidden="true"></div>
                            }
                            
                            <!-- Overlay status -->
                            @if (qrStatus() === 'approved') {
                                <div class="absolute inset-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl animate-fade-in z-30">
                                    <div class="w-16 h-16 bg-green-50 dark:bg-green-950/50 text-green-500 rounded-full flex items-center justify-center text-3xl mb-3 shadow-inner"><i class="fa-solid fa-check"></i></div>
                                    <span class="font-bold text-green-700 dark:text-green-400 text-lg">Thành công!</span>
                                    <span class="text-[13px] text-green-600/80 dark:text-green-400/80 font-medium mt-1">Đang chuyển hướng...</span>
                                </div>
                            }
                            @if (qrStatus() === 'expired') {
                                <button type="button" aria-label="Tạo lại mã QR đăng nhập" class="absolute inset-0 w-full bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl animate-fade-in cursor-pointer group-hover:bg-gray-50 dark:group-hover:bg-slate-700/60 transition-colors z-30" (click)="generateSession()">
                                    <div class="w-16 h-16 bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-slate-500 rounded-full flex items-center justify-center text-3xl mb-3 shadow-inner group-hover:scale-110 transition-transform"><i class="fa-solid fa-rotate-right" aria-hidden="true"></i></div>
                                    <span class="font-bold text-gray-700 dark:text-slate-300">Mã hết hạn</span>
                                    <span class="text-[13px] text-fuchsia-600 dark:text-fuchsia-400 font-bold mt-1">Nhấn để tải lại</span>
                                </button>
                            }
                            @if (errorMsg() && mode() === 'qr') {
                                <div class="absolute inset-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl animate-fade-in p-6 text-center z-30">
                                    <div class="w-12 h-12 bg-red-50 dark:bg-red-950/50 text-red-500 rounded-full flex items-center justify-center text-2xl mb-3"><i class="fa-solid fa-triangle-exclamation"></i></div>
                                    <span class="font-bold text-red-700 dark:text-red-400 text-sm">Lỗi kết nối</span>
                                    <span class="text-[11px] text-red-500/80 mt-1 mb-4">{{ errorMsg() }}</span>
                                    <button type="button" aria-label="Thử lại tạo mã QR" (click)="generateSession()" class="px-4 py-2 bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/50 rounded-xl text-xs font-bold hover:bg-red-100 dark:hover:bg-red-900 transition-colors">Thử Lại</button>
                                </div>
                            }
                        </div>

                        <div class="mt-5 w-full">
                            <ng-container *ngTemplateOutlet="deviceModeSwitch"></ng-container>
                        </div>

                        <div class="mt-4 flex flex-col gap-4 w-full">
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
                <div class="break-words">&copy; {{year}} NAFIQPM6 LIMS &bull; Thiết kế & Phát triển bởi Otada &bull; Sử dụng nội bộ</div>
                <div class="text-gray-400/80 dark:text-gray-500 break-words">NAFIQPM6 Laboratory Information Management System Cloud &bull; {{state.systemVersion()}}</div>
            </div>

            <!-- Install App Button & Prompt -->
            <app-pwa-install-prompt></app-pwa-install-prompt>

        </div>

        <!-- Device Mode Security Help Modal -->
        @if (showSessionHelp()) {
          <app-modal-shell
            id="session-help"
            [title]="'Hướng dẫn chế độ thiết bị'"
            [description]="'Chính sách lưu phiên đăng nhập và an toàn bảo mật phòng lab'"
            size="md"
            [showFooter]="true"
            (closed)="showSessionHelp.set(false)">
            <div modalBody class="space-y-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              <p id="session-help-description" class="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Lựa chọn chế độ phù hợp với loại thiết bị bạn đang sử dụng để bảo đảm an toàn dữ liệu xét nghiệm và tài khoản cá nhân.
              </p>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <!-- Cột 1: Máy dùng chung -->
                <div class="rounded-2xl border border-amber-200/80 dark:border-amber-800/60 bg-amber-50/40 dark:bg-amber-950/20 p-4 flex flex-col justify-between">
                  <div>
                    <div class="flex items-center gap-2 mb-2">
                      <div class="w-7 h-7 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
                        <i class="fa-solid fa-users text-xs" aria-hidden="true"></i>
                      </div>
                      <h3 class="font-bold text-amber-900 dark:text-amber-200 text-sm">Máy dùng chung</h3>
                    </div>
                    <div class="text-[11px] font-semibold text-amber-800/90 dark:text-amber-300/90 mb-2.5">
                      Khuyến nghị cho máy tính phòng lab, khu vực nhận mẫu hoặc nhiều người cùng thao tác.
                    </div>
                    <ul class="space-y-1.5 text-[11px] text-slate-700 dark:text-slate-300 pl-4 list-disc marker:text-amber-500">
                      <li>Phiên chỉ tồn tại trong tab hoặc phiên trình duyệt hiện tại; khi phiên kết thúc, cần đăng nhập lại.</li>
                      <li>Trên máy tính, hệ thống tự đăng xuất sau <strong>30 phút</strong> không có thao tác chuột hoặc bàn phím.</li>
                      <li>Khi bấm &ldquo;Đăng xuất LIMS&rdquo;, hệ thống cũng đăng xuất tài khoản Google khỏi trình duyệt để giảm nguy cơ người sau truy cập Gmail, Drive hoặc đăng nhập vào tài khoản của người trước.</li>
                      <li>Trên thiết bị di động và màn hình nhỏ, cơ chế tự thoát 30 phút không áp dụng để tránh gián đoạn thao tác.</li>
                    </ul>
                  </div>
                </div>

                <!-- Cột 2: Duy trì đăng nhập -->
                <div class="rounded-2xl border border-fuchsia-200/80 dark:border-fuchsia-800/60 bg-fuchsia-50/40 dark:bg-fuchsia-950/20 p-4 flex flex-col justify-between">
                  <div>
                    <div class="flex items-center gap-2 mb-2">
                      <div class="w-7 h-7 rounded-xl bg-fuchsia-100 dark:bg-fuchsia-900/50 text-fuchsia-700 dark:text-fuchsia-400 flex items-center justify-center shrink-0">
                        <i class="fa-solid fa-user-lock text-xs" aria-hidden="true"></i>
                      </div>
                      <h3 class="font-bold text-fuchsia-900 dark:text-fuchsia-200 text-sm">Duy trì đăng nhập</h3>
                    </div>
                    <div class="text-[11px] font-semibold text-fuchsia-800/90 dark:text-fuchsia-300/90 mb-2.5">
                      Chỉ dùng trên thiết bị cá nhân (laptop cá nhân có mật khẩu bảo vệ).
                    </div>
                    <ul class="space-y-1.5 text-[11px] text-slate-700 dark:text-slate-300 pl-4 list-disc marker:text-fuchsia-500">
                      <li>Giữ phiên đăng nhập trên trình duyệt này sau khi đóng và mở lại trình duyệt.</li>
                      <li>Không tự đăng xuất sau 30 phút không thao tác trên máy tính.</li>
                      <li>Chỉ nên dùng trên thiết bị cá nhân, không dùng trên máy chung của phòng lab.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div modalFooter class="w-full flex items-center justify-end">
              <button type="button"
                      (click)="showSessionHelp.set(false)"
                      class="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer">
                Đã hiểu
              </button>
            </div>
          </app-modal-shell>
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

    @keyframes shimmer {
      0% { transform: skewX(-12deg) translateX(-100%); }
      100% { transform: skewX(-12deg) translateX(250%); }
    }
    .group:hover .group-hover\:animate-shimmer {
      animation: shimmer 1s ease-in-out forwards;
    }

    .inset-soft-well {
      box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05), inset 0 1px 2px 0 rgba(0, 0, 0, 0.04);
    }
    .device-mode-thumb {
      width: calc(50% - 0.5rem);
    }
    .device-mode-option-label {
      white-space: nowrap;
    }
    @media (max-width: 360px) {
      .device-mode-option {
        gap: 0.25rem;
        padding-left: 0.375rem;
        padding-right: 0.375rem;
        font-size: 0.625rem;
      }
      .device-mode-icon {
        width: 1.25rem;
        height: 1.25rem;
      }
      .device-mode-icon i {
        font-size: 0.625rem;
      }
    }
    .pill-thumb-amber {
      box-shadow: 0 4px 14px -2px rgba(217, 119, 6, 0.22), 0 2px 6px -1px rgba(0, 0, 0, 0.06);
    }
    :host-context(.dark) .pill-thumb-amber, .dark .pill-thumb-amber {
      box-shadow: 0 4px 16px -2px rgba(245, 158, 11, 0.28), 0 2px 6px -1px rgba(0, 0, 0, 0.5);
    }
    .pill-thumb-fuchsia {
      box-shadow: 0 4px 14px -2px rgba(203, 12, 159, 0.25), 0 2px 6px -1px rgba(0, 0, 0, 0.06);
    }
    :host-context(.dark) .pill-thumb-fuchsia, .dark .pill-thumb-fuchsia {
      box-shadow: 0 4px 16px -2px rgba(203, 12, 159, 0.35), 0 2px 6px -1px rgba(0, 0, 0, 0.5);
    }
    .thumb-transition {
      transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.32s ease, border-color 0.32s ease;
    }
    @media (prefers-reduced-motion: reduce) {
      .thumb-transition {
        transition: none !important;
      }
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

    if (window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone) {
      this.isPWA.set(true);
    }
  }

  selectDeviceMode(mode: DeviceMode): void {
    this.auth.setDeviceMode(mode);
  }

  handleDeviceModeKeyNav(event: KeyboardEvent, fromMode: DeviceMode): void {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      const nextMode: DeviceMode = fromMode === 'shared' ? 'personal' : 'shared';
      this.selectDeviceMode(nextMode);
      const targetId = nextMode === 'shared' ? 'device-mode-shared' : 'device-mode-personal';
      document.getElementById(targetId)?.focus();
    } else if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this.selectDeviceMode(fromMode);
    }
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
  private currentPollToken: string | null = null;
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
              throw new Error(`Không thể tạo phiên đăng nhập (mã lỗi ${createRes.status}).`);
          }

          const { sessionId, nonce, pollToken, expiresAt } = await createRes.json();
          if (typeof pollToken !== 'string' || !pollToken) {
              throw new Error('Máy chủ không cấp capability cho phiên QR.');
          }
          this.currentSessionId = sessionId;
          this.currentPollToken = pollToken;

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
              if (!this.currentSessionId || !this.currentPollToken) return;
              try {
                  const statusRes = await fetch(`/api/qr/status?sessionId=${encodeURIComponent(this.currentSessionId)}`, {
                      headers: { 'X-QR-Poll-Token': this.currentPollToken }
                  });
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
      const sessionId = this.currentSessionId;
      const pollToken = this.currentPollToken;
      this.currentSessionId = null;
      this.currentPollToken = null;
      if (sessionId && pollToken && clearId) {
          this.auth.deleteAuthSession(sessionId, pollToken).catch(() => {});
      }
  }

  async handleApproval(customToken: string) {
      // Desktop nhận customToken từ /api/qr/status, dùng signInWithCustomToken() để đăng nhập.
      // Không có password nào được truyền trong quá trình này.
      try {
          await this.auth.ensurePersistenceReady();
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
