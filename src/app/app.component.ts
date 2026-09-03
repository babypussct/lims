import { ChangeDetectionStrategy, Component, inject, computed, effect, signal, HostListener, NgZone, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RouterOutlet,
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';

import { AppShellComponent } from './core/layout/app-shell.component';
import { LogoComponent } from './shared/components/logo.component';
import { ConfirmationModalComponent } from './shared/components/confirmation-modal/confirmation-modal.component';
import { PrintPreviewModalComponent } from './shared/components/print-preview-modal/print-preview-modal.component';
import { GlobalScannerComponent } from './shared/components/global-scanner/global-scanner.component'; 
import { Gs1InfoModalComponent } from './shared/components/gs1-info-modal/gs1-info-modal.component';
import { LoginComponent } from './features/auth/login.component';
import { PasswordSetupComponent } from './features/auth/password-setup.component';
import { NotificationPanelComponent } from './shared/components/notification-panel/notification-panel.component';
import { ProgressOverlayComponent } from './shared/components/progress-overlay/progress-overlay.component';
import { ToastHostComponent } from './shared/components/toast-host/toast-host.component';
import { ChangelogModalComponent } from './shared/components/changelog-modal/changelog-modal.component';
import { ForgotPasswordModalComponent } from './features/auth/forgot-password-modal.component';


import { StateService } from './core/services/state.service';
import { AuthService } from './core/services/auth.service';
import { ToastService } from './core/services/toast.service';
import { PrintService } from './core/services/print.service';
import { IdleTimeoutService } from './core/services/idle-timeout.service';
import { NotificationService } from './core/services/notification.service';
import { NotificationCenterService } from './core/services/notification-center.service';
import { ConfirmationService } from './core/services/confirmation.service';
import { NotificationPanelService } from './core/services/notification-panel.service';
import { ProgressService } from './core/services/progress.service';
import { QrGlobalService } from './core/services/qr-global.service';
import { ChangelogService } from './core/services/changelog.service';
import { ReleaseService } from './core/services/release.service';
import { ReloadSafetyService } from './core/services/reload-safety.service';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { claimServiceWorkerRecoveryReload } from './core/utils/service-worker-recovery';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterOutlet,
    AppShellComponent,
    ConfirmationModalComponent,
    PrintPreviewModalComponent,
    GlobalScannerComponent, 
    Gs1InfoModalComponent,
    LoginComponent,
    PasswordSetupComponent,
    NotificationPanelComponent,
    ProgressOverlayComponent,
    ToastHostComponent,
    LogoComponent,
    ChangelogModalComponent,
    ForgotPasswordModalComponent
  ],
  template: `
    @if (isPrintMode()) {
       <router-outlet></router-outlet>
    } 
    @else {
      <!-- Global route feedback: instant progress, skeleton only for genuinely slow lazy chunks. -->
      @if (isNavigating()) {
        <div class="route-progress" role="progressbar" aria-label="Đang chuyển trang">
          <span></span>
        </div>
      }

      @if (showNavigationSkeleton()) {
        <div class="route-loading-layer no-print" aria-live="polite" aria-busy="true">
          <div class="route-loading-shell">
            <div class="route-loading-heading">
              <span class="route-loading-icon"><i class="fa-solid fa-flask-vial"></i></span>
              <div class="route-loading-title">
                <span></span>
                <span></span>
              </div>
              <span class="route-loading-dots" aria-hidden="true"><i></i><i></i><i></i></span>
            </div>
            <div class="route-loading-grid" aria-hidden="true">
              <span></span><span></span><span></span>
            </div>
            <div class="route-loading-lines" aria-hidden="true">
              <span></span><span></span><span></span>
            </div>
            <span class="sr-only">Đang mở nội dung, vui lòng chờ.</span>
          </div>
        </div>
      }

      <!-- Pull to Refresh Spinner -->
      @if (isPulling()) {
        <div class="fixed top-10 left-1/2 -translate-x-1/2 z-[300] bg-white rounded-full shadow-lg w-10 h-10 flex items-center justify-center animate-bounce">
            <i class="fa-solid fa-rotate fa-spin text-blue-500 text-xl"></i>
        </div>
      }

      <!-- Yellow Countdown Banner -->
      @if (maintenanceCountdownText() && !isMaintenanceActive()) {
        <div class="fixed top-4 left-1/2 -translate-x-1/2 z-[105] bg-amber-500 text-white font-bold py-3 px-6 rounded-2xl shadow-2xl flex items-center gap-3 border border-amber-400 animate-slide-down no-print max-w-md w-[calc(100%-2rem)]">
            <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center animate-pulse"><i class="fa-solid fa-hourglass-half text-sm"></i></div>
            <div class="flex-1">
                <div class="text-[9px] uppercase tracking-wider opacity-85">Thông báo bảo trì</div>
                <div class="text-xs leading-snug">Hệ thống sẽ tự động khóa để bảo trì sau <span class="font-mono text-sm underline text-white">{{ maintenanceCountdownText() }}</span>. Vui lòng lưu dữ liệu!</div>
            </div>
        </div>
      }

      <app-toast-host></app-toast-host>
      @if (auth.isPasswordSetupOpen()) {
        <app-password-setup></app-password-setup>
      }
      <app-forgot-password-modal></app-forgot-password-modal>
      @defer (when changelogService.isOpen()) {
        <app-changelog-modal></app-changelog-modal>
      }

      <!-- Loaders & Modals -->
      @if (printService.isProcessing()) { <div class="fixed inset-0 z-[120] flex items-center justify-center bg-gray-900/20 backdrop-blur-sm no-print"><i class="fa-solid fa-spinner fa-spin text-3xl text-white"></i></div> }
      
      @defer (when confirmationService.state().isVisible) {
        <app-confirmation-modal></app-confirmation-modal>
      }
      @defer (when printService.isPreviewOpen() || printService.isPreviewPdfOpen()) {
        <app-print-preview-modal></app-print-preview-modal>
      }
      @defer (when qrService.isScanning()) {
        <app-global-scanner></app-global-scanner>
      }
      @defer (when !!qrService.scannedGs1Data()) {
        <app-gs1-info-modal></app-gs1-info-modal>
      }
      <!-- Notification Panel: rendered at root to bypass sidebar stacking context -->
      @defer (when notificationPanel.isOpen()) {
        <app-notification-panel></app-notification-panel>
      }
      @defer (when progressService.isVisible()) {
        <app-progress-overlay></app-progress-overlay>
      }

      @if (hasNewVersion() && !isUpdateModalDismissed()) {
        <div class="fixed inset-0 z-layer-system-lock flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm no-print p-4 md:p-6">
           <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 md:p-8 max-w-md w-full border border-slate-200 dark:border-slate-800 animate-fade-in">
              
              <div class="relative w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 md:mb-8">
                <!-- SVG Circular Progress -->
                <svg class="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="47" class="fill-slate-50 dark:fill-slate-800/50 stroke-slate-200 dark:stroke-slate-700/50" stroke-width="2"></circle>
                  <circle cx="50" cy="50" r="47" class="fill-none transition-all duration-1000 ease-linear" stroke-width="3" stroke-linecap="round"
                          [class]="isUpdateWaitingForSafety() ? 'stroke-amber-400' : 'stroke-blue-600'"
                          [style.stroke-dasharray]="'296'" 
                          [style.stroke-dashoffset]="296 - (updateCountdown() / 30) * 296"></circle>
                </svg>
                <!-- Icon inside -->
                <div class="absolute inset-0 flex flex-col items-center justify-center text-slate-700 dark:text-slate-300 z-10">
                  @if (isUpdateWaitingForSafety()) {
                    <i class="fa-solid fa-shield-halved text-2xl md:text-3xl text-amber-400"></i>
                    <span class="text-[9px] md:text-[10px] font-mono mt-1 md:mt-2 text-amber-400">SAFE</span>
                  } @else {
                    <i class="fa-solid fa-cloud-arrow-down text-2xl md:text-3xl"></i>
                    <span class="text-[9px] md:text-[10px] font-mono mt-1 md:mt-2 opacity-60">{{ updateCountdown() }}s</span>
                  }
                </div>
              </div>

              <h2 class="text-lg md:text-xl font-bold text-slate-800 dark:text-white mb-2 text-center tracking-tight leading-snug">
                 @if (updateVersion()) { Cập nhật phiên bản {{ updateVersion() }} }
                 @else { Có bản cập nhật hệ thống mới }
              </h2>
              
              @if (updateTitle()) {
                 <p class="text-slate-500 dark:text-slate-400 text-xs md:text-sm text-center font-medium mb-5 md:mb-6 px-2">{{ updateTitle() }}</p>
              }

              @if (updateFeatures().length > 0) {
                 <div class="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 md:p-5 mb-6 md:mb-8 text-left border border-slate-100 dark:border-slate-700/50">
                    <h3 class="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 md:mb-3">Nội Dung Nâng Cấp</h3>
                    <ul class="space-y-2.5 md:space-y-3 max-h-36 md:max-h-40 overflow-y-auto custom-scrollbar pr-1 md:pr-2">
                       @for (feature of updateFeatures(); track feature) {
                          <li class="flex gap-2.5 md:gap-3 text-xs md:text-sm text-slate-600 dark:text-slate-300 items-start">
                             <div class="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 md:mt-1.5 shrink-0 opacity-80"></div>
                             <span class="leading-relaxed">{{ feature }}</span>
                          </li>
                       }
                    </ul>
                 </div>
              } @else {
                 <p class="text-slate-500 dark:text-slate-400 mb-6 md:mb-8 text-xs md:text-sm leading-relaxed text-center px-2">
                   Hệ thống LIMS vừa được nâng cấp. Vui lòng áp dụng ngay để đảm bảo tính đồng bộ dữ liệu.
                 </p>
              }
              
              <!-- Primary CTA -->
              <button (click)="requestUpdateApply()" class="w-full py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                <i class="fa-solid fa-arrows-rotate"></i>
                {{ isUpdateWaitingForSafety() ? 'Cập nhật ngay khi lưu xong' : 'Áp Dụng Cập Nhật' }}
              </button>

              <!-- Secondary: Dismiss -->
              <button (click)="dismissUpdate()" class="w-full mt-2.5 py-2.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 rounded-xl text-xs font-medium transition-colors">
                Để sau
              </button>

              <div class="mt-3 text-center">
                 @if (isUpdateWaitingForSafety()) {
                   <span class="text-[11px] text-amber-500 dark:text-amber-400 font-medium flex items-center justify-center gap-2">
                     <i class="fa-solid fa-floppy-disk fa-beat-fade opacity-80"></i>
                     {{ updateSafetyReason() }}
                   </span>
                 } @else {
                   <span class="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center justify-center gap-2">
                     <i class="fa-solid fa-circle-notch fa-spin opacity-70"></i>
                     Tự động áp dụng sau {{ updateCountdown() }} giây
                   </span>
                 }
              </div>
           </div>
        </div>
      }

      <!-- Banner nhắc nhở khi user đã bấm "Để sau" -->
      @if (hasNewVersion() && isUpdateModalDismissed()) {
        <div class="fixed bottom-20 md:bottom-4 left-1/2 -translate-x-1/2 z-[200] no-print animate-slide-up">
          <div class="flex items-center gap-3 bg-slate-800 dark:bg-slate-700 text-white text-xs font-medium px-4 py-3 rounded-2xl shadow-xl border border-slate-600 max-w-sm w-[calc(100vw-2rem)]">
            <div class="w-7 h-7 shrink-0 bg-blue-500/20 rounded-full flex items-center justify-center">
              <i class="fa-solid fa-cloud-arrow-down text-blue-400 text-sm"></i>
            </div>
            <span class="flex-1 leading-snug text-slate-200">Có phiên bản mới đang chờ được cài đặt</span>
            <button (click)="requestUpdateApply()" class="shrink-0 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
              Cập nhật
            </button>
          </div>
        </div>
      }

      @if (isMaintenanceActive() && auth.currentUser() && !state.isAdmin() && !auth.hasPermission('bypass_maintenance')) {
        <div class="fixed inset-0 z-layer-system-lock flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-md no-print p-4">
           <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-rose-500/30 animate-bounce-in">
              <div class="w-20 h-20 bg-rose-100 dark:bg-rose-900/50 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500 animate-pulse">
                <i class="fa-solid fa-person-digging text-4xl"></i>
              </div>
              <h2 class="text-2xl font-black text-slate-800 dark:text-white mb-2">Hệ Thống Đang Bảo Trì</h2>
              <p class="text-slate-500 dark:text-slate-400 mb-8 text-sm leading-relaxed whitespace-pre-wrap">{{ state.maintenanceMessage() }}</p>
              
              <div class="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-relaxed select-none">
                 &copy; {{year}} Angular Portal &bull; Thiết kế & Phát triển bởi Otada &bull; Sử dụng nội bộ<br>
                 <span>NAFIQPM6 Laboratory Information Management System Cloud &bull; {{state.systemVersion()}}</span>
              </div>
           </div>
        </div>
      }

      @if (isMaintenanceActive() && state.isAdmin()) {
        <div class="fixed bottom-20 right-4 z-layer-system-lock no-print animate-bounce-in pointer-events-none">
            <div class="pointer-events-auto bg-rose-600 text-white px-4 py-3 rounded-2xl shadow-xl shadow-rose-500/30 flex items-center gap-3 border-2 border-white dark:border-slate-800 max-w-[280px]">
                <div class="w-10 h-10 shrink-0 bg-white/20 rounded-full flex items-center justify-center animate-pulse"><i class="fa-solid fa-person-digging text-lg"></i></div>
                <div class="flex-1">
                    <div class="text-[10px] font-black uppercase tracking-wider text-rose-200">Đang Bật Bảo Trì</div>
                    <div class="text-xs font-bold leading-tight mt-0.5">Hệ thống đang chặn tất cả người dùng. Đừng quên tắt khi xong!</div>
                </div>
            </div>
        </div>
      }

      @if (!auth.isAuthReady()) {
         <div class="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-slate-900">
            <div class="rounded-2xl overflow-hidden shadow-lg shadow-fuchsia-500/10 mb-4 animate-pulse">
               <app-logo size="180px"></app-logo>
            </div>
            <div class="text-white font-bold tracking-widest animate-pulse mt-4">NAFIQPM6 | LIMS CLOUD</div>
         </div>
      } @else if (auth.isProcessingRedirect()) {
        <!-- Overlay khi đang xử lý token từ Google redirect — không cho tương tác trang login -->
        <div class="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-slate-900">
           <i class="fa-brands fa-google text-5xl text-white animate-pulse mb-6"></i>
           <div class="text-white font-bold tracking-widest animate-pulse mb-2">ĐANG XÁC THỰC TÀI KHOẢN...</div>
           <div class="text-slate-400 text-sm">Vui lòng chờ trong giây lát</div>
        </div>
      } @else {
        @if (state.currentUser(); as user) {
          @if (user.role === 'pending') {
             <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-50 p-4">
                <div class="bg-white rounded-2xl shadow-soft-xl p-8 max-w-md w-full text-center border border-slate-100">
                   <div class="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-500 animate-pulse"><i class="fa-solid fa-hourglass-half text-3xl"></i></div>
                   <h2 class="text-2xl font-black text-slate-800 mb-2">Đang Chờ Phê Duyệt</h2>
                   <p class="text-slate-500 mb-6 text-sm leading-relaxed">Xin chào <b>{{user.displayName}}</b>,<br>Tài khoản của bạn đã được tạo nhưng cần quản trị viên cấp quyền truy cập vào hệ thống.</p>
                   <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 text-left">
                      <div class="text-[10px] font-bold text-slate-400 uppercase mb-1">UID của bạn (Gửi cho Admin):</div>
                      <div class="flex gap-2 items-center"><code class="text-sm font-mono font-bold text-slate-700 bg-white px-2 py-1 rounded border border-slate-200 flex-1 truncate select-all">{{user.uid}}</code></div>
                   </div>
                   <button (click)="auth.logout()" class="w-full py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition active:scale-95"><i class="fa-solid fa-arrow-right-from-bracket mr-2"></i> Đăng Xuất</button>
                </div>
             </div>
          } 
          @else {
             <app-shell></app-shell>
          }
        } 
        @else {
          @if (isPublicRoute()) {
            <div data-public-scroll-owner class="min-h-screen h-[100dvh] bg-slate-50 overflow-y-auto">
              <router-outlet></router-outlet>
            </div>
          } @else {
            @defer (when auth.isAuthReady() && !state.currentUser() && !isPublicRoute()) {
              <app-login class="no-print"></app-login>
            } @placeholder {
              <div class="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center">
                <app-logo size="140px"></app-logo>
                <div class="text-slate-300 text-xs font-bold tracking-widest mt-5">ĐANG TẢI ĐĂNG NHẬP...</div>
              </div>
            }
          }
        }
      }
    }
  `
})
export class AppComponent implements OnDestroy {
  auth = inject(AuthService);
  state = inject(StateService);
  toast = inject(ToastService);
  printService = inject(PrintService);
  router = inject(Router);
  idleService = inject(IdleTimeoutService);
  notificationService = inject(NotificationService);
  notificationCenter = inject(NotificationCenterService);
  confirmationService = inject(ConfirmationService);
  notificationPanel = inject(NotificationPanelService);
  progressService = inject(ProgressService);
  qrService = inject(QrGlobalService);
  changelogService = inject(ChangelogService);
  private releaseService = inject(ReleaseService);
  reloadSafety = inject(ReloadSafetyService);
  swUpdate = inject(SwUpdate);
  private ngZone = inject(NgZone);

  // Reactive URL signal for computed dependencies
  currentUrl = signal<string>('');
  isNavigating = signal(false);
  showNavigationSkeleton = signal(false);
  isPublicRoute = computed(() => {
    const url = this.currentUrl();
    return url.startsWith('/privacy-policy')
      || url.startsWith('/terms-of-service')
      || url.startsWith('/changelog')
      || (!environment.production && url.startsWith('/__ui-primitives'))
      || (!environment.production && url.startsWith('/__excel-demo'));
  });
  year = new Date().getFullYear();
  private _navigationFeedbackTimer: ReturnType<typeof setTimeout> | null = null;
  private releaseBootstrapVersion: string | null = null;

  constructor() {
    this.applyPerformanceProfile();

    // Only run the maintenance clock when a schedule exists. Far from the
    // deadline it wakes once a minute; inside the 30-minute warning window it
    // updates once a second. Timers stay outside Angular to avoid full app-wide
    // change detection on every tick.
    effect((onCleanup) => {
      this.startMaintenanceClock(this.state.maintenanceScheduledTime());
      onCleanup(() => clearTimeout(this._maintenanceTimer));
    });

    // Countdown may reach zero while a feature is still saving. In that case
    // wait on the real save state and apply immediately when the last blocker
    // clears instead of introducing another fixed delay.
    effect(() => {
      if (this.isUpdateWaitingForSafety() && this.reloadSafety.isSafe()) {
        void this.applyPendingUpdateWhenSafe();
      }
    });

    // Initialize currentUrl
    this.currentUrl.set(this.router.url);

    // Keep feedback immediate, but delay the larger skeleton so fast routes do
    // not flash. The current screen stays visible underneath while a lazy chunk
    // is fetched.
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.startNavigationFeedback();
      } else if (event instanceof NavigationEnd) {
        this.currentUrl.set(this.router.url);
        this.finishNavigationFeedback();
      } else if (event instanceof NavigationCancel || event instanceof NavigationError) {
        this.finishNavigationFeedback();
      }
    });

    // Start idle timeout watcher and notifications when auth state is ready and logged in
    effect(() => {
      if (this.auth.isAuthReady() && this.auth.currentUserUid()) {
        this.idleService.startWatching();
        this.notificationService.startListener();
      } else {
        this.idleService.stopWatching();
        this.notificationService.stopListener();
      }
    });

    // Changelog history is published lazily by a Manager after the first login
    // of a new build. The release content is embedded in ngsw.json at build time.
    effect(() => {
      const user = this.auth.currentUser();
      const version = this.state.systemVersion();
      if (this.auth.isAuthReady() && user?.role === 'manager' && this.releaseBootstrapVersion !== version) {
        this.releaseBootstrapVersion = version;
        void this.ensureCurrentRelease(version);
      }
    });

    // Lắng nghe trạng thái bảo trì để thông báo khi kết thúc
    let previousMaintenanceState = false;
    effect(() => {
      const active = this.isMaintenanceActive();
      if (previousMaintenanceState && !active && this.auth.currentUser()) {
        this.toast.show('🎉 Hệ thống đã hoàn tất bảo trì! Bạn có thể tiếp tục làm việc.', 'success');
      }
      previousMaintenanceState = active;
    });

    // --- SERVICE WORKER: Lắng nghe bản build mới ---
    if (this.swUpdate.isEnabled) {
      console.log('[LIMS SW] ✅ Service Worker đang hoạt động. Bắt đầu lắng nghe update...');

      // Lắng nghe TẤT CẢ sự kiện version (để log)
      this.swUpdate.versionUpdates.subscribe(event => {
        console.log(`[LIMS SW] 📡 Event: ${event.type}`, event);
      });

      // Lắng nghe khi có bản mới sẵn sàng
      this.swUpdate.versionUpdates.pipe(
        filter((e): e is VersionReadyEvent => e.type === 'VERSION_READY')
      ).subscribe(event => {
        console.log('[LIMS SW] 🚀 VERSION_READY — Bản mới sẵn sàng!', {
          current: event.currentVersion.hash,
          latest: event.latestVersion.hash
        });

        // Xử lý dữ liệu Changelog từ ngsw-config.json (nếu có)
        const appData = event.latestVersion.appData as any;
        if (appData) {
            if (appData.version) this.updateVersion.set(appData.version);
            if (appData.title) this.updateTitle.set(appData.title);
            if (appData.features && Array.isArray(appData.features)) {
                this.updateFeatures.set(appData.features);
            }
        }

        this.hasNewVersion.set(true);
        this.startUpdateCountdown();
        // Toast can be removed since we have a blocking modal now
        this.toast.removeByMessage('phiên bản mới');
      });

      // Giữ index.html trong hash verification để một phiên bản luôn gồm đúng HTML và chunks.
      // Lỗi cài đặt thường là trạng thái deploy/CDN tạm thời; lần polling kế tiếp sẽ thử lại.
      // Không auto-reload ở đây vì phiên bản hiện tại vẫn hợp lệ và reload có thể tạo vòng lặp.
      this.swUpdate.versionUpdates.pipe(
        filter(e => e.type === 'VERSION_INSTALLATION_FAILED')
      ).subscribe((event: any) => {
        console.error('[LIMS SW] ❌ VERSION_INSTALLATION_FAILED:', event.error);
        this.toast.show('⚠️ Bản cập nhật chưa cài được. Hệ thống sẽ tự động thử lại.', 'info');
      });

      // Xử lý trạng thái không thể phục hồi (cache corrupt, hash mismatch nghiêm trọng)
      this.swUpdate.unrecoverable.subscribe(event => {
        console.error('[LIMS SW] 💀 UNRECOVERABLE STATE:', event.reason);

        try {
          const canAutoReload = claimServiceWorkerRecoveryReload(
            sessionStorage,
            this.state.systemVersion()
          );

          if (!canAutoReload) {
            console.error('[LIMS SW] 🛑 Đã chặn auto-reload lặp lại cho phiên bản hiện tại.');
            this.toast.show(
              '⚠️ Ứng dụng vẫn gặp lỗi bộ nhớ đệm sau lần tải lại tự động. Đã dừng tự tải lại để tránh vòng lặp; hãy đóng tab và mở lại ứng dụng.',
              'error'
            );
            return;
          }
        } catch (storageError) {
          // Nếu không ghi được sessionStorage thì không có cách chứng minh reload kế tiếp
          // sẽ được chặn. Ưu tiên dừng auto-reload để tránh mắc kẹt trong vòng lặp.
          console.warn('[LIMS SW] Không thể lưu recovery guard; chặn auto-reload:', storageError);
          this.toast.show(
            '⚠️ Ứng dụng gặp lỗi bộ nhớ đệm. Đã dừng tự tải lại để tránh vòng lặp; hãy đóng tab và mở lại ứng dụng.',
            'error'
          );
          return;
        }

        this.toast.show('⚠️ Ứng dụng gặp lỗi bộ nhớ đệm. Đang tải lại một lần để phục hồi...', 'error');
        setTimeout(() => window.location.reload(), 2000);
      });

      // Chủ động kiểm tra update ngay khi app load (không đợi SW tự check)
      this.swUpdate.checkForUpdate().then(hasUpdate => {
        console.log(`[LIMS SW] 🔍 Kiểm tra lần đầu: ${hasUpdate ? 'CÓ bản mới!' : 'Đang dùng bản mới nhất.'}`);
      }).catch(err => {
        console.warn('[LIMS SW] ⚠️ Lỗi kiểm tra update lần đầu:', err);
      });

      // Kiểm tra mỗi 5 phút cho user giữ app mở lâu (giảm từ 10 phút)
      this._swCheckInterval = setInterval(() => {
        this.swUpdate.checkForUpdate().then(hasUpdate => {
          if (hasUpdate) console.log('[LIMS SW] 🔍 Polling: Phát hiện bản mới!');
        }).catch(err => {
          console.warn('[LIMS SW] ⚠️ Polling check failed:', err);
        });
      }, 5 * 60 * 1000); // 5 phút
    } else {
      console.warn('[LIMS SW] ⛔ Service Worker KHÔNG hoạt động (dev mode hoặc trình duyệt không hỗ trợ).');
    }
  }

  private async ensureCurrentRelease(version: string): Promise<void> {
    try {
      const releaseData = await this.loadReleaseData(version);
      if (releaseData) {
        await this.releaseService.ensureReleaseExists(version, releaseData);
      }
    } catch (error) {
      // A release record should never prevent a user from opening the app.
      console.warn('[Release] Không thể tự tạo release trên Firestore:', error);
    }
  }

  private async loadReleaseData(version: string): Promise<any | null> {
    if (typeof fetch !== 'function') return null;

    try {
      const response = await fetch('/release-history.json', { cache: 'no-store' });
      if (response.ok) {
        const history = await response.json();
        if (Array.isArray(history)) {
          const normalized = version.startsWith('v') ? version : `v${version}`;
          const match = history.find(item => item?.version === normalized || item?.version === version);
          if (match) return match;
        }
      }
    } catch {
      // Fallback to ngsw.json
    }

    try {
      const response = await fetch('/ngsw.json', { cache: 'no-store' });
      if (!response.ok) return null;
      const manifest = await response.json();
      const appData = manifest?.appData;
      if (appData) {
        return {
          version,
          title: appData.title || this.updateTitle() || 'Cập nhật hệ thống',
          highlights: appData.features || this.updateFeatures(),
          features: [],
          improvements: [],
          fixes: [],
          date: new Intl.DateTimeFormat('vi-VN').format(new Date())
        };
      }
    } catch (error) {
      console.warn('[Release] Không đọc được appData từ ngsw.json:', error);
    }
    return null;
  }

  isPrintMode = computed(() => {
    const url = this.currentUrl();
    return url.includes('/mobile-login') || url.includes('/labels') || url.includes('/traceability');
  });

  // --- PULL TO REFRESH & UPDATE LOGIC ---
  private touchStartY = 0;
  isPulling = signal(false);
  hasNewVersion = signal(false);
  isUpdateModalDismissed = signal(false);
  isUpdateWaitingForSafety = signal(false);
  updateCountdown = signal(30);
  updateVersion = signal<string | null>(null);
  updateTitle = signal<string | null>(null);
  updateFeatures = signal<string[]>([]);
  private _updateTimer: any;
  private _swCheckInterval: any;
  private _maintenanceTimer: ReturnType<typeof setTimeout> | undefined;
  private _updateReloadInFlight = false;

  updateSafetyReason = computed(() =>
    this.reloadSafety.reasons()[0] || 'Đang chờ các tác vụ lưu dữ liệu hoàn tất.'
  );

  currentTime = signal<number>(Date.now());

  isMaintenanceActive = computed(() => {
    const isManual = this.state.maintenanceMode();
    const scheduled = this.state.maintenanceScheduledTime();
    if (isManual) return true;
    if (scheduled) {
      const target = new Date(scheduled).getTime();
      return this.currentTime() >= target;
    }
    return false;
  });

  maintenanceCountdownText = computed(() => {
    const scheduled = this.state.maintenanceScheduledTime();
    if (!scheduled) return null;

    const target = new Date(scheduled).getTime();
    const diff = target - this.currentTime();

    if (diff <= 0) return null;

    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    // Show warning banner if remaining time is under 30 minutes
    if (minutes < 30) {
      const secStr = seconds < 10 ? '0' + seconds : seconds;
      const minStr = minutes < 10 ? '0' + minutes : minutes;
      return `${minStr}:${secStr}`;
    }
    return null;
  });

  ngOnDestroy() {
    clearInterval(this._swCheckInterval);
    clearTimeout(this._maintenanceTimer);
    if (this._navigationFeedbackTimer) clearTimeout(this._navigationFeedbackTimer);
    clearInterval(this._updateTimer);
  }

  private startNavigationFeedback() {
    if (this._navigationFeedbackTimer) clearTimeout(this._navigationFeedbackTimer);
    this.isNavigating.set(true);
    this.showNavigationSkeleton.set(false);
    this._navigationFeedbackTimer = setTimeout(() => {
      if (this.isNavigating()) this.showNavigationSkeleton.set(true);
    }, 160);
  }

  private finishNavigationFeedback() {
    if (this._navigationFeedbackTimer) {
      clearTimeout(this._navigationFeedbackTimer);
      this._navigationFeedbackTimer = null;
    }
    this.showNavigationSkeleton.set(false);
    this.isNavigating.set(false);
  }

  // Kiểm tra build mới ngay khi user quay lại tab (từ bất kỳ ứng dụng nào khác)
  @HostListener('document:visibilitychange')
  onVisibilityChange() {
    this.startMaintenanceClock(this.state.maintenanceScheduledTime());
    if (document.visibilityState === 'visible' && this.swUpdate.isEnabled) {
      console.log('[LIMS SW] 👀 Tab được focus lại — kiểm tra update...');
      this.swUpdate.checkForUpdate().then(hasUpdate => {
        if (hasUpdate) console.log('[LIMS SW] 🔍 Visibility check: Phát hiện bản mới!');
      }).catch(err => {
        console.warn('[LIMS SW] ⚠️ Visibility check failed:', err);
      });
    }
  }

  private startMaintenanceClock(scheduled: string | null) {
    clearTimeout(this._maintenanceTimer);
    if (!scheduled) return;

    const target = new Date(scheduled).getTime();
    if (!Number.isFinite(target)) return;

    const tick = () => {
      const now = Date.now();
      if (document.visibilityState === 'visible') {
        this.ngZone.run(() => this.currentTime.set(now));
      }

      const remaining = target - now;
      if (remaining <= 0) return;

      const warningWindow = 30 * 60 * 1000;
      const delay = document.visibilityState !== 'visible'
        ? 60_000
        : remaining > warningWindow
          ? Math.min(60_000, Math.max(1_000, remaining - warningWindow))
          : 1_000;

      this.ngZone.runOutsideAngular(() => {
        this._maintenanceTimer = setTimeout(tick, delay);
      });
    };

    this.ngZone.runOutsideAngular(tick);
  }

  private applyPerformanceProfile() {
    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean };
    };
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const lowMemory = typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4;
    const lowCpu = typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 4;

    if (prefersReducedMotion || lowMemory || lowCpu || nav.connection?.saveData) {
      document.documentElement.classList.add('performance-lite');
    }
  }

  @HostListener('window:touchstart', ['$event'])
  onTouchStart(e: TouchEvent) {
    // Chỉ kích hoạt nếu chạm từ mép trên cùng của màn hình (header)
    if (e.touches[0].clientY < 60) {
       this.touchStartY = e.touches[0].clientY;
    } else {
       this.touchStartY = 0;
    }
  }

  @HostListener('window:touchmove', ['$event'])
  onTouchMove(e: TouchEvent) {
    if (this.touchStartY === 0) return;
    const currentY = e.touches[0].clientY;
    if (currentY - this.touchStartY > 120) {
      this.isPulling.set(true);
    }
  }

  @HostListener('window:touchend')
  onTouchEnd() {
    if (this.isPulling()) {
      window.location.reload();
    }
    this.touchStartY = 0;
    this.isPulling.set(false);
  }

  startUpdateCountdown() {
    this.updateCountdown.set(30);
    this.isUpdateWaitingForSafety.set(false);
    clearInterval(this._updateTimer);

    this.ngZone.runOutsideAngular(() => {
      this._updateTimer = setInterval(() => {
        this.ngZone.run(() => {
          const current = this.updateCountdown() - 1;
          this.updateCountdown.set(current);

          if (current <= 0) {
            clearInterval(this._updateTimer);
            this.requestUpdateApply();
          }
        });
      }, 1000);
    });
  }

  dismissUpdate() {
    clearInterval(this._updateTimer);
    this.isUpdateWaitingForSafety.set(false);
    this.isUpdateModalDismissed.set(true);
  }

  requestUpdateApply() {
    clearInterval(this._updateTimer);
    this.updateCountdown.set(0);

    if (!this.reloadSafety.isSafe()) {
      this.isUpdateWaitingForSafety.set(true);
      return;
    }

    void this.applyPendingUpdateWhenSafe();
  }

  private async applyPendingUpdateWhenSafe(): Promise<void> {
    if (this._updateReloadInFlight || !this.reloadSafety.isSafe()) return;

    this._updateReloadInFlight = true;
    this.isUpdateWaitingForSafety.set(false);
    await this.window_reload();
  }

  // Dùng trong template cho nút "Tải lại ngay" trong Toast
  async window_reload() {
    clearInterval(this._updateTimer);
    // Kích hoạt bản SW mới trước khi reload (đảm bảo không serve bản cũ từ cache)
    if (this.swUpdate.isEnabled && this.hasNewVersion()) {
      try {
        console.log('[LIMS SW] ⏳ Đang kích hoạt bản mới trước khi reload...');
        await this.swUpdate.activateUpdate();
        console.log('[LIMS SW] ✅ Kích hoạt thành công! Đang reload...');
      } catch (err) {
        console.warn('[LIMS SW] ⚠️ activateUpdate() lỗi, reload bình thường:', err);
      }
    }
    window.location.reload();
  }
}
