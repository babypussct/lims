
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

// Use the Core Layout Sidebar (Soft UI Design)
import { SidebarComponent } from './core/layout/sidebar.component';
import { PrintLayoutComponent } from './shared/components/print-layout/print-layout.component';
import { ConfirmationModalComponent } from './shared/components/confirmation-modal/confirmation-modal.component';
import { LoginComponent } from './features/auth/login.component';

import { StateService } from './core/services/state.service';
import { AuthService } from './core/services/auth.service';
import { ToastService } from './core/services/toast.service';
import { PrintService } from './core/services/print.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent,
    ConfirmationModalComponent,
    PrintLayoutComponent,
    LoginComponent
  ],
  template: `
    <!-- Notifications (Mobile First Position: Bottom Center) -->
    <div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] flex flex-col items-center gap-3 no-print w-full max-w-sm px-4 pointer-events-none">
      @for (t of toast.toasts(); track t.id) {
        <div class="pointer-events-auto flex items-center gap-4 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border animate-slide-up min-w-[300px]"
             [class.bg-white]="true" 
             [class.bg-opacity-90]="true"
             [class.border-l-4]="true"
             [class.border-l-emerald-500]="t.type === 'success'" 
             [class.text-emerald-800]="t.type === 'success'"
             [class.border-l-red-500]="t.type === 'error'" 
             [class.text-red-800]="t.type === 'error'"
             [class.border-l-blue-500]="t.type === 'info'" 
             [class.text-blue-800]="t.type === 'info'"
             [class.border-y-white]="true" 
             [class.border-r-white]="true">
             
             <!-- Icon -->
             <div class="shrink-0 text-xl">
                @if(t.type === 'success') { 
                    <i class="fa-solid fa-circle-check text-emerald-500"></i> 
                }
                @else if(t.type === 'error') { 
                    <i class="fa-solid fa-circle-xmark text-red-500"></i> 
                }
                @else { 
                    <i class="fa-solid fa-circle-info text-blue-500"></i> 
                }
             </div>

             <!-- Content -->
             <div class="flex-1">
                 <div class="text-xs font-bold uppercase opacity-60 tracking-wider">
                    {{ t.type === 'success' ? 'Thành công' : t.type === 'error' ? 'Lỗi' : 'Thông báo' }}
                 </div>
                 <div class="text-sm font-bold leading-tight">{{t.message}}</div>
             </div>

             <!-- Close -->
             <div class="h-8 w-[1px] bg-gray-200"></div>
             <button (click)="toast.remove(t.id)" class="text-gray-400 hover:text-gray-600 transition active:scale-90">
                 <i class="fa-solid fa-xmark"></i>
             </button>
        </div>
      }
    </div>

    @if (printService.isProcessing()) { <div class="fixed inset-0 z-[120] flex items-center justify-center bg-gray-900/20 backdrop-blur-sm no-print"><i class="fa-solid fa-spinner fa-spin text-3xl text-white"></i></div> }
    <app-confirmation-modal></app-confirmation-modal>

    @if (state.currentUser(); as user) {
      
      <!-- ZERO TRUST GATEKEEPER -->
      @if (user.role === 'pending') {
         <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-50 p-4">
            <div class="bg-white rounded-3xl shadow-soft-xl p-8 max-w-md w-full text-center border border-slate-100">
               <div class="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-500 animate-pulse">
                  <i class="fa-solid fa-hourglass-half text-3xl"></i>
               </div>
               <h2 class="text-2xl font-black text-slate-800 mb-2">Đang chờ phê duyệt</h2>
               <p class="text-slate-500 mb-6 text-sm leading-relaxed">
                  Xin chào <b>{{user.displayName}}</b>,<br>
                  Tài khoản của bạn đã được tạo nhưng cần Admin cấp quyền truy cập vào hệ thống.
               </p>
               <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 text-left">
                  <div class="text-[10px] font-bold text-slate-400 uppercase mb-1">UID của bạn (Gửi cho Admin):</div>
                  <div class="flex gap-2 items-center">
                     <code class="text-sm font-mono font-bold text-slate-700 bg-white px-2 py-1 rounded border border-slate-200 flex-1 truncate select-all">{{user.uid}}</code>
                  </div>
               </div>
               <button (click)="auth.logout()" class="w-full py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition active:scale-95">
                  <i class="fa-solid fa-arrow-right-from-bracket mr-2"></i> Đăng xuất
               </button>
            </div>
         </div>
      } 
      @else {
         <!-- MAIN APP LAYOUT (For Staff/Manager) -->
         <div class="min-h-screen h-[100dvh] bg-gray-50 flex overflow-hidden relative">
              <!-- Overlay for mobile sidebar -->
              @if (state.sidebarOpen()) { <div class="fixed inset-0 bg-black/30 z-40 md:hidden backdrop-blur-sm transition-opacity" (click)="state.closeSidebar()"></div> }
              
              <!-- Sidebar Component (Handles navigation internally) -->
              <app-sidebar></app-sidebar>
              
              <!-- Main Content: Matches Sidebar Width (ml-64 when expanded, ml-20 when collapsed) -->
              <main class="flex-1 flex flex-col relative h-full transition-all duration-300 ease-in-out rounded-xl overflow-hidden"
                    [class.md:ml-64]="!state.sidebarCollapsed()" 
                    [class.md:ml-20]="state.sidebarCollapsed()">
                 
                 <!-- Navbar -->
                 <nav class="relative flex flex-col justify-center px-4 py-2 mx-4 md:mx-6 mt-4 transition-all shadow-none duration-250 ease-in-out backdrop-blur-2xl bg-white/80 rounded-2xl shadow-navbar z-30 shrink-0">
                    @if (state.permissionError()) {
                       <div class="w-full bg-red-50 border border-red-100 rounded-lg p-2 mb-2 flex items-center justify-between animate-bounce-in">
                           <div class="flex items-center gap-2 text-xs text-red-600 font-bold"><i class="fa-solid fa-triangle-exclamation"></i><span>Lỗi quyền truy cập (Permission Denied).</span></div>
                       </div>
                    }
                    <div class="flex items-center justify-between w-full">
                       <div class="flex items-center gap-3">
                          <div class="flex items-center md:hidden"><button (click)="state.toggleSidebar()" class="w-10 h-10 flex items-center justify-center text-sm text-gray-500 hover:bg-gray-100 rounded-lg transition active:scale-95"><i class="fa-solid fa-bars text-lg"></i></button></div>
                          <div><h6 class="mb-0 font-bold capitalize text-gray-800 text-lg md:text-base">{{ pageTitle() }}</h6></div>
                       </div>
                       
                       <!-- Right Action Buttons -->
                       <div class="flex items-center gap-3 ml-auto">
                           <div class="hidden sm:flex items-center px-2 py-2 text-sm font-semibold transition-all ease-nav-brand text-gray-600"><i class="fa fa-user mr-2"></i><span>{{state.currentUser()?.displayName}}</span></div>
                           
                           <!-- Config/Profile Button -->
                           <button (click)="router.navigate(['/config'])" 
                                   class="w-10 h-10 flex items-center justify-center text-sm transition-all ease-nav-brand text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg active:scale-95" 
                                   [title]="auth.canManageSystem() ? 'Cấu hình Hệ thống' : 'Tài khoản cá nhân'">
                               <i class="fa-solid" [class.fa-gears]="auth.canManageSystem()" [class.fa-user-gear]="!auth.canManageSystem()"></i>
                           </button>

                           <!-- Logout Button -->
                           <button (click)="auth.logout()" class="w-10 h-10 flex items-center justify-center text-sm transition-all ease-nav-brand text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg active:scale-95" title="Đăng xuất">
                               <i class="fa-solid fa-power-off text-lg"></i>
                           </button>
                       </div>
                    </div>
                 </nav>

                 <!-- Main Scrollable Content -->
                 <div class="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar flex flex-col">
                     <!-- Router Outlet -->
                     <div class="flex-1">
                         <router-outlet></router-outlet>
                     </div>
                     
                     <!-- Compact Footer -->
                     <footer class="mt-6 pt-4 pb-2 text-center shrink-0 opacity-60 hover:opacity-100 transition-opacity">
                         <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-default select-none">
                             © Otada. Sử dụng nội bộ phòng GC
                         </p>
                     </footer>
                 </div>
              </main>
         </div>
      }
    } 
    @else { <app-login class="no-print"></app-login> }
    <app-print-layout></app-print-layout>
  `,
  styles: [`
    @keyframes slide-up {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .animate-slide-up { animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
  `]
})
export class AppComponent {
  state = inject(StateService);
  auth = inject(AuthService);
  toast = inject(ToastService);
  printService = inject(PrintService);
  router: Router = inject(Router);

  pageTitle = signal('Dashboard');

  constructor() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => { this.updatePageHeader(); });
    this.updatePageHeader();
  }

  private updatePageHeader() {
    const url = this.router.url;
    if (url.includes('/dashboard')) this.pageTitle.set('Dashboard');
    else if (url.includes('/calculator')) this.pageTitle.set('Chạy Quy trình');
    else if (url.includes('/inventory')) this.pageTitle.set('Kho Hóa chất');
    else if (url.includes('/standards')) this.pageTitle.set('Chuẩn Đối chiếu');
    else if (url.includes('/recipes')) this.pageTitle.set('Thư viện Công thức');
    else if (url.includes('/requests')) this.pageTitle.set('Quản lý Yêu cầu');
    else if (url.includes('/stats')) this.pageTitle.set('Báo cáo & Thống kê');
    else if (url.includes('/printing')) this.pageTitle.set('In Phiếu Dự trù');
    else if (url.includes('/labels')) this.pageTitle.set('In Tem Nhãn');
    else if (url.includes('/editor')) this.pageTitle.set('Soạn thảo SOP');
    else if (url.includes('/config')) this.pageTitle.set('Cấu hình Hệ thống');
    else this.pageTitle.set('LIMS Cloud');
  }
}
