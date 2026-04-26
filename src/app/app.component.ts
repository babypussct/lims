
import { Component, inject, computed, effect, signal, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';

import { SidebarComponent } from './core/layout/sidebar.component';
import { BottomNavComponent } from './core/layout/bottom-nav.component';
import { ConfirmationModalComponent } from './shared/components/confirmation-modal/confirmation-modal.component';
import { PrintPreviewModalComponent } from './shared/components/print-preview-modal/print-preview-modal.component';
import { GlobalScannerComponent } from './shared/components/global-scanner/global-scanner.component'; 
import { Gs1InfoModalComponent } from './shared/components/gs1-info-modal/gs1-info-modal.component';
import { LoginComponent } from './features/auth/login.component';
import { NotificationBellComponent } from './shared/components/notification-bell/notification-bell.component';

import { StateService } from './core/services/state.service';
import { AuthService } from './core/services/auth.service';
import { ToastService } from './core/services/toast.service';
import { PrintService } from './core/services/print.service';
import { IdleTimeoutService } from './core/services/idle-timeout.service';
import { NotificationService } from './core/services/notification.service';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent,
    BottomNavComponent,
    ConfirmationModalComponent,
    PrintPreviewModalComponent,
    GlobalScannerComponent, 
    Gs1InfoModalComponent,
    LoginComponent,
    NotificationBellComponent
  ],
  template: `
    @if (isPrintMode()) {
       <router-outlet></router-outlet>
    } 
    @else {
      <!-- Pull to Refresh Spinner -->
      @if (isPulling()) {
        <div class="fixed top-10 left-1/2 -translate-x-1/2 z-[300] bg-white rounded-full shadow-lg w-10 h-10 flex items-center justify-center animate-bounce">
            <i class="fa-solid fa-rotate fa-spin text-blue-500 text-xl"></i>
        </div>
      }

      <!-- Notifications -->
      <div class="fixed top-4 left-1/2 -translate-x-1/2 z-[110] flex flex-col items-center gap-3 no-print w-full max-w-sm px-4 pointer-events-none">
        @for (t of toast.toasts(); track t.id) {
          <div class="pointer-events-auto flex flex-col gap-2 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border animate-slide-up min-w-[300px]"
               [class.bg-white]="true" 
               [class.bg-opacity-95]="true"
               [class.border-l-4]="true"
               [class.border-l-emerald-500]="t.type === 'success'" 
               [class.text-emerald-800]="t.type === 'success'"
               [class.border-l-red-500]="t.type === 'error'" 
               [class.text-red-800]="t.type === 'error'"
               [class.border-l-blue-500]="t.type === 'info'" 
               [class.text-blue-800]="t.type === 'info'"
               [class.border-y-white]="true" 
               [class.border-r-white]="true">
               <div class="flex items-center gap-4">
                  <div class="shrink-0 text-xl">
                     @if(t.type === 'success') { <i class="fa-solid fa-circle-check text-emerald-500"></i> }
                     @else if(t.type === 'error') { <i class="fa-solid fa-circle-xmark text-red-500"></i> }
                     @else { <i class="fa-solid fa-circle-info text-blue-500"></i> }
                  </div>
                  <div class="flex-1">
                      <div class="text-xs font-bold uppercase opacity-60 tracking-wider">
                         {{ t.type === 'success' ? 'Thành công' : t.type === 'error' ? 'Lỗi' : 'Thông báo' }}
                      </div>
                      <div class="text-sm font-bold leading-tight">{{t.message}}</div>
                  </div>
                  <div class="h-8 w-[1px] bg-gray-200"></div>
                  <button (click)="toast.remove(t.id)" class="text-gray-400 hover:text-gray-600 transition active:scale-90"><i class="fa-solid fa-xmark"></i></button>
               </div>
               @if (t.persistent) {
                 <button (click)="window_reload()" 
                         class="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 active:scale-95">
                   <i class="fa-solid fa-rotate-right"></i> Tải lại ngay
                 </button>
               }
          </div>
        }
      </div>

      <!-- Loaders & Modals -->
      @if (printService.isProcessing()) { <div class="fixed inset-0 z-[120] flex items-center justify-center bg-gray-900/20 backdrop-blur-sm no-print"><i class="fa-solid fa-spinner fa-spin text-3xl text-white"></i></div> }
      
      <app-confirmation-modal></app-confirmation-modal>
      <app-print-preview-modal></app-print-preview-modal>
      <app-global-scanner></app-global-scanner> 
      <app-gs1-info-modal></app-gs1-info-modal> 

      @if (!auth.isAuthReady()) {
        <div class="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-slate-900">
           <i class="fa-solid fa-flask text-5xl text-blue-500 animate-pulse mb-4"></i>
           <div class="text-white font-bold tracking-widest animate-pulse">NAFIQPM6 | LIMS CLOUD</div>
        </div>
      } @else {
        @if (state.currentUser(); as user) {
          @if (user.role === 'pending') {
             <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-50 p-4">
                <div class="bg-white rounded-3xl shadow-soft-xl p-8 max-w-md w-full text-center border border-slate-100">
                   <div class="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-500 animate-pulse"><i class="fa-solid fa-hourglass-half text-3xl"></i></div>
                   <h2 class="text-2xl font-black text-slate-800 mb-2">Đang chờ phê duyệt</h2>
                   <p class="text-slate-500 mb-6 text-sm leading-relaxed">Xin chào <b>{{user.displayName}}</b>,<br>Tài khoản của bạn đã được tạo nhưng cần Admin cấp quyền truy cập vào hệ thống.</p>
                   <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 text-left">
                      <div class="text-[10px] font-bold text-slate-400 uppercase mb-1">UID của bạn (Gửi cho Admin):</div>
                      <div class="flex gap-2 items-center"><code class="text-sm font-mono font-bold text-slate-700 bg-white px-2 py-1 rounded border border-slate-200 flex-1 truncate select-all">{{user.uid}}</code></div>
                   </div>
                   <button (click)="auth.logout()" class="w-full py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition active:scale-95"><i class="fa-solid fa-arrow-right-from-bracket mr-2"></i> Đăng xuất</button>
                </div>
             </div>
          } 
          @else {
             <div class="min-h-screen h-[100dvh] bg-gray-50 dark:bg-slate-900 flex overflow-hidden relative">
                  
                  <!-- Desktop Sidebar (Hidden on Mobile) -->
                  @if (!state.focusMode()) {
                      <div class="hidden md:block">
                          <app-sidebar></app-sidebar>
                      </div>
                  }
                  
                  <!-- Main Content -->
                  <main class="flex-1 flex flex-col relative h-full transition-all duration-300 ease-in-out overflow-hidden"
                        [class.md:ml-64]="!state.sidebarCollapsed() && !state.focusMode()" 
                        [class.md:ml-20]="state.sidebarCollapsed() && !state.focusMode()"
                        [class.p-0]="state.focusMode()">
                     
                     <!-- Content Viewport -->
                     <!-- Outer wrapper: fills main. Each page component manages its own internal scroll. -->
                     <div class="flex-1 min-h-0 flex flex-col overflow-hidden"
                          [class.px-3]="!state.focusMode()" 
                          [class.pt-4]="!state.focusMode()" 
                          [class.md:p-6]="!state.focusMode()"
                          [class.p-0]="state.focusMode()">
                         
                         @if (state.permissionError()) {
                            <div class="w-full bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-xl p-3 mb-4 flex items-center justify-between animate-bounce-in shadow-sm shrink-0">
                                <div class="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 font-bold"><i class="fa-solid fa-triangle-exclamation"></i><span>Lỗi quyền truy cập (Permission Denied).</span></div>
                            </div>
                         }
  
                         <!-- Wrapper scrolls for simple pages (dashboard, config).
                              Storage pages (standards, inventory) fill 100% and scroll internally. -->
                         <div class="flex-1 min-h-0 overflow-y-auto custom-scrollbar pb-20 md:pb-6">
                             <router-outlet></router-outlet>
                         </div>
                     </div>
                  </main>
  
                  <!-- Mobile Bottom Nav -->
                  @if (!state.focusMode()) {
                      <app-bottom-nav></app-bottom-nav>
                  }
             </div>
          }
        } 
        @else { <app-login class="no-print"></app-login> }
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
  swUpdate = inject(SwUpdate);

  // Reactive URL signal for computed dependencies
  currentUrl = signal<string>('');

  constructor() {
    // Initialize currentUrl
    this.currentUrl.set(this.router.url);

    // Listen to router events to update signal
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl.set(this.router.url);
      }
    });

    // Start idle timeout watcher and notifications when auth state is ready and logged in
    effect(() => {
      if (this.auth.isAuthReady() && this.auth.currentUser()) {
        this.idleService.startWatching();
        this.notificationService.startListener();
      } else {
        this.idleService.stopWatching();
        this.notificationService.stopListener();
      }
    }, { allowSignalWrites: true });

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
        this.hasNewVersion.set(true);
        // Xóa toast deploy cũ trước khi thêm mới (tránh chồng chéo)
        this.toast.removeByMessage('phiên bản mới');
        this.toast.show('🚀 Hệ thống vừa có phiên bản mới. Bấm để cập nhật!', 'info', true);
      });

      // Xử lý lỗi cài đặt bản mới
      this.swUpdate.versionUpdates.pipe(
        filter(e => e.type === 'VERSION_INSTALLATION_FAILED')
      ).subscribe((event: any) => {
        console.error('[LIMS SW] ❌ VERSION_INSTALLATION_FAILED:', event.error);
        this.toast.show('⚠️ Cập nhật phiên bản thất bại. Thử tải lại trang.', 'error', true);
      });

      // Xử lý trạng thái không thể phục hồi (cache corrupt, hash mismatch nghiêm trọng)
      this.swUpdate.unrecoverable.subscribe(event => {
        console.error('[LIMS SW] 💀 UNRECOVERABLE STATE:', event.reason);
        this.toast.show('⚠️ Ứng dụng gặp lỗi nghiêm trọng. Đang tải lại...', 'error');
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

  isPrintMode = computed(() => {
    const url = this.currentUrl();
    return url.includes('/mobile-login') || url.includes('/labels') || url.includes('/traceability');
  });

  pageTitle = computed(() => {
    const url = this.currentUrl().split('/')[1]?.split('?')[0] || 'dashboard';
    const titles: Record<string, string> = {
        'dashboard': 'Trang chủ',
        'inventory': 'Kho Hóa chất',
        'calculator': 'Vận hành SOP',
        'requests': 'Quản lý Yêu cầu',
        'stats': 'Báo cáo',
        'config': 'Cấu hình',
        'standards': 'Chuẩn đối chiếu',
        'recipes': 'Thư viện Công thức',
        'prep': 'Trạm Pha Chế',
        'smart-batch': 'Chạy Mẻ Smart',
        'traceability': 'Truy xuất nguồn gốc'
    };
    return titles[url] || 'LIMS Cloud';
  });

  // --- PULL TO REFRESH LOGIC ---
  private touchStartY = 0;
  isPulling = signal(false);
  hasNewVersion = signal(false);
  private _swCheckInterval: any;

  ngOnDestroy() {
    clearInterval(this._swCheckInterval);
  }

  // Kiểm tra build mới ngay khi user quay lại tab (từ bất kỳ ứng dụng nào khác)
  @HostListener('document:visibilitychange')
  onVisibilityChange() {
    if (document.visibilityState === 'visible' && this.swUpdate.isEnabled) {
      console.log('[LIMS SW] 👀 Tab được focus lại — kiểm tra update...');
      this.swUpdate.checkForUpdate().then(hasUpdate => {
        if (hasUpdate) console.log('[LIMS SW] 🔍 Visibility check: Phát hiện bản mới!');
      }).catch(err => {
        console.warn('[LIMS SW] ⚠️ Visibility check failed:', err);
      });
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

  // Dùng trong template cho nút "Tải lại ngay" trong Toast
  async window_reload() {
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
