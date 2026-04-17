
import { Component, inject, computed, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';

import { SidebarComponent } from './core/layout/sidebar.component';
import { BottomNavComponent } from './core/layout/bottom-nav.component';
import { ConfirmationModalComponent } from './shared/components/confirmation-modal/confirmation-modal.component';
import { PrintPreviewModalComponent } from './shared/components/print-preview-modal/print-preview-modal.component';
import { GlobalScannerComponent } from './shared/components/global-scanner/global-scanner.component'; 
import { Gs1InfoModalComponent } from './shared/components/gs1-info-modal/gs1-info-modal.component';
import { LoginComponent } from './features/auth/login.component';

import { StateService } from './core/services/state.service';
import { AuthService } from './core/services/auth.service';
import { ToastService } from './core/services/toast.service';
import { PrintService } from './core/services/print.service';
import { IdleTimeoutService } from './core/services/idle-timeout.service';

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
    LoginComponent
  ],
  template: `
    @if (isPrintMode()) {
       <router-outlet></router-outlet>
    } 
    @else {
      <!-- Notifications -->
      <div class="fixed top-4 left-1/2 -translate-x-1/2 z-[110] flex flex-col items-center gap-3 no-print w-full max-w-sm px-4 pointer-events-none">
        @for (t of toast.toasts(); track t.id) {
          <div class="pointer-events-auto flex items-center gap-4 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border animate-slide-up min-w-[300px]"
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
           <div class="text-white font-bold tracking-widest animate-pulse">LIMS CLOUD PRO</div>
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
                     <!-- Outer wrapper: flex column that fills main area. pb accounts for bottom nav on mobile. -->
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
  
                         <!-- Router outlet fills all remaining height. pb-20 on mobile for bottom nav clearance. -->
                         <div class="flex-1 min-h-0 overflow-y-auto custom-scrollbar pb-20 md:pb-0">
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
export class AppComponent {
  auth = inject(AuthService);
  state = inject(StateService);
  toast = inject(ToastService);
  printService = inject(PrintService);
  router = inject(Router);
  idleService = inject(IdleTimeoutService);

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

    // Start idle timeout watcher when auth state is ready and logged in
    effect(() => {
      if (this.auth.isAuthReady() && this.auth.currentUser()) {
        this.idleService.startWatching();
      } else {
        this.idleService.stopWatching();
      }
    });
  }

  isPrintMode = computed(() => {
    const url = this.currentUrl();
    return url.includes('/mobile-login') || url.includes('/labels');
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
}
