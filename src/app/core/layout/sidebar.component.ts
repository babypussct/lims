
import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StateService } from '../services/state.service';
import { AuthService } from '../services/auth.service';
import { QrGlobalService } from '../services/qr-global.service'; // Import
import { getAvatarUrl } from '../../shared/utils/utils';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <aside class="fixed inset-y-0 left-0 bg-white border-r border-slate-200 shadow-soft-xl z-50 flex flex-col transition-all duration-300 ease-in-out"
           [class.w-64]="!state.sidebarCollapsed()"
           [class.w-20]="state.sidebarCollapsed()"
           [class.-translate-x-full]="!state.sidebarOpen()"
           [class.md:translate-x-0]="true"
           [class.translate-x-0]="state.sidebarOpen()">
      
      <!-- 1. Brand -->
      <div class="h-16 flex items-center px-6 shrink-0 relative cursor-pointer group"
           [class.justify-center]="state.sidebarCollapsed()"
           (click)="state.toggleSidebarCollapse()"
           title="Nhấn để Thu gọn / Mở rộng">
         <div class="w-8 h-8 rounded-lg bg-gradient-soft flex items-center justify-center shadow-soft-md shrink-0 transition-transform group-hover:scale-110">
             <i class="fa-solid fa-flask text-white text-xs"></i>
         </div>
         @if (!state.sidebarCollapsed()) {
            <span class="font-bold text-gray-700 text-sm tracking-wide ml-3 fade-in group-hover:text-fuchsia-600 transition-colors">
                LIMS Cloud <span class="font-light text-gray-400">Pro</span>
            </span>
         }
         <button (click)="state.closeSidebar(); $event.stopPropagation()" class="md:hidden ml-auto w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 active:bg-gray-200">
             <i class="fa-solid fa-times"></i>
         </button>
      </div>

      <!-- 2. GLOBAL ACTION: SCAN -->
      <div class="px-4 mt-2 mb-2">
          <button (click)="qrService.startScan()" 
                  class="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-black text-white p-3 rounded-xl shadow-md shadow-slate-300 transition-all active:scale-95 group overflow-hidden relative">
              <i class="fa-solid fa-qrcode text-lg relative z-10 group-hover:scale-110 transition-transform"></i>
              @if (!state.sidebarCollapsed()) {
                  <span class="font-bold text-xs uppercase tracking-wider relative z-10 fade-in">Quét Mã</span>
              }
              <!-- Hover Effect -->
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>
      </div>

      <hr class="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent border-none mx-4 mb-2" />

      <!-- 3. Modules Menu -->
      <div class="px-3 py-2 shrink-0 space-y-1 flex-1 overflow-y-auto custom-scrollbar">
         
         <!-- Dashboard -->
         <div (click)="navigateTo('dashboard')" 
              class="group flex items-center px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 ease-in-out active:scale-95 border border-transparent"
              [class]="isActive('/dashboard') ? 'bg-slate-50 border-slate-100 shadow-sm' : 'hover:bg-gray-50'"
              [title]="state.sidebarCollapsed() ? 'Trang chủ' : ''">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center transition-all shrink-0"
                 [class.mx-auto]="state.sidebarCollapsed()"
                 [class]="isActive('/dashboard') ? 'bg-white text-fuchsia-600 shadow-sm' : 'bg-gray-50 text-gray-500 group-hover:bg-white group-hover:text-fuchsia-600'">
               <i class="fa-solid fa-house text-xs"></i>
            </div>
            @if (!state.sidebarCollapsed()) {
                <span class="text-sm font-bold ml-3 fade-in" [class]="isActive('/dashboard') ? 'text-slate-800' : 'text-slate-500'">Trang chủ</span>
            }
         </div>

         <!-- Smart Batch -->
         @if(auth.canViewSop()) {
             <div (click)="navigateTo('smart-batch')" 
                  class="group flex items-center px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 ease-in-out active:scale-95 border border-transparent"
                  [class]="isActive('/smart-batch') ? 'bg-teal-50 border-teal-100 shadow-sm' : 'hover:bg-gray-50'"
                  [title]="state.sidebarCollapsed() ? 'Chạy Mẻ (Smart)' : ''">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center transition-all shrink-0"
                     [class.mx-auto]="state.sidebarCollapsed()"
                     [class]="isActive('/smart-batch') ? 'bg-white text-teal-600 shadow-sm' : 'bg-gray-50 text-gray-500 group-hover:bg-white group-hover:text-teal-600'">
                   <i class="fa-solid fa-wand-magic-sparkles text-xs"></i>
                </div>
                @if (!state.sidebarCollapsed()) {
                    <span class="text-sm font-bold ml-3 fade-in" [class]="isActive('/smart-batch') ? 'text-teal-800' : 'text-slate-500'">Chạy Mẻ (Smart)</span>
                }
             </div>
         }

         <!-- SOP (Vận hành) -->
         @if(auth.canViewSop()) {
             <div (click)="navigateTo('calculator')" 
                  class="group flex items-center px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 ease-in-out active:scale-95 border border-transparent"
                  [class]="isActive('/calculator') || isActive('/editor') || isActive('/recipes') ? 'bg-slate-50 border-slate-100 shadow-sm' : 'hover:bg-gray-50'"
                  [title]="state.sidebarCollapsed() ? 'Vận hành (SOP)' : ''">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center transition-all shrink-0"
                     [class.mx-auto]="state.sidebarCollapsed()"
                     [class]="isActive('/calculator') || isActive('/editor') || isActive('/recipes') ? 'bg-white text-fuchsia-600 shadow-sm' : 'bg-gray-50 text-gray-500 group-hover:bg-white group-hover:text-fuchsia-600'">
                   <i class="fa-solid fa-play text-xs pl-0.5"></i>
                </div>
                @if (!state.sidebarCollapsed()) {
                    <span class="text-sm font-bold ml-3 fade-in" [class]="isActive('/calculator') || isActive('/editor') || isActive('/recipes') ? 'text-slate-800' : 'text-slate-500'">Vận hành (SOP)</span>
                }
             </div>
         }

         <!-- Smart Prep Station -->
         @if(auth.canViewInventory()) {
             <div (click)="navigateTo('prep')" 
                  class="group flex items-center px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 ease-in-out active:scale-95 border border-transparent"
                  [class]="isActive('/prep') ? 'bg-slate-50 border-slate-100 shadow-sm' : 'hover:bg-gray-50'"
                  [title]="state.sidebarCollapsed() ? 'Trạm Pha Chế' : ''">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center transition-all shrink-0"
                     [class.mx-auto]="state.sidebarCollapsed()"
                     [class]="isActive('/prep') ? 'bg-white text-fuchsia-600 shadow-sm' : 'bg-gray-50 text-gray-500 group-hover:bg-white group-hover:text-fuchsia-600'">
                   <i class="fa-solid fa-flask-vial text-xs"></i>
                </div>
                @if (!state.sidebarCollapsed()) {
                    <span class="text-sm font-bold ml-3 fade-in" [class]="isActive('/prep') ? 'text-slate-800' : 'text-slate-500'">Trạm Pha Chế</span>
                }
             </div>
         }

         <!-- Inventory -->
         @if(auth.canViewInventory()) {
             <div (click)="navigateTo('inventory')" 
                  class="group flex items-center px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 ease-in-out active:scale-95 border border-transparent"
                  [class]="isActive('/inventory') || isActive('/labels') ? 'bg-slate-50 border-slate-100 shadow-sm' : 'hover:bg-gray-50'"
                  [title]="state.sidebarCollapsed() ? 'Kho Hóa chất' : ''">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center transition-all shrink-0"
                     [class.mx-auto]="state.sidebarCollapsed()"
                     [class]="isActive('/inventory') || isActive('/labels') ? 'bg-white text-fuchsia-600 shadow-sm' : 'bg-gray-50 text-gray-500 group-hover:bg-white group-hover:text-fuchsia-600'">
                   <i class="fa-solid fa-boxes-stacked text-xs"></i>
                </div>
                @if (!state.sidebarCollapsed()) {
                    <span class="text-sm font-bold ml-3 fade-in" [class]="isActive('/inventory') || isActive('/labels') ? 'text-slate-800' : 'text-slate-500'">Kho Hóa chất</span>
                }
             </div>
         }

         <!-- Standards -->
         @if(auth.canViewStandards()) {
             <div (click)="navigateTo('standards')" 
                  class="group flex items-center px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 ease-in-out active:scale-95 border border-transparent"
                  [class]="isActive('/standards') ? 'bg-slate-50 border-slate-100 shadow-sm' : 'hover:bg-gray-50'"
                  [title]="state.sidebarCollapsed() ? 'Chuẩn Đối chiếu' : ''">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center transition-all shrink-0"
                     [class.mx-auto]="state.sidebarCollapsed()"
                     [class]="isActive('/standards') ? 'bg-white text-fuchsia-600 shadow-sm' : 'bg-gray-50 text-gray-500 group-hover:bg-white group-hover:text-fuchsia-600'">
                   <i class="fa-solid fa-vial-circle-check text-xs"></i>
                </div>
                @if (!state.sidebarCollapsed()) {
                    <span class="text-sm font-bold ml-3 fade-in" [class]="isActive('/standards') ? 'text-slate-800' : 'text-slate-500'">Chuẩn Đối chiếu</span>
                }
             </div>
         }

         <!-- Requests -->
         @if(auth.canViewSop()) {
             <div (click)="navigateTo('requests')" 
                  class="group flex items-center px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 ease-in-out active:scale-95 border border-transparent"
                  [class]="isActive('/requests') || isActive('/printing') ? 'bg-slate-50 border-slate-100 shadow-sm' : 'hover:bg-gray-50'"
                  [title]="state.sidebarCollapsed() ? 'Yêu cầu & In phiếu' : ''">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center transition-all shrink-0 relative"
                     [class.mx-auto]="state.sidebarCollapsed()"
                     [class]="isActive('/requests') || isActive('/printing') ? 'bg-white text-fuchsia-600 shadow-sm' : 'bg-gray-50 text-gray-500 group-hover:bg-white group-hover:text-fuchsia-600'">
                   <i class="fa-solid fa-clipboard-list text-xs"></i>
                   @if(state.sidebarCollapsed() && state.requests().length > 0) {
                       <span class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                   }
                </div>
                @if (!state.sidebarCollapsed()) {
                    <div class="flex-1 flex justify-between items-center ml-3 fade-in">
                        <span class="text-sm font-bold" [class]="isActive('/requests') || isActive('/printing') ? 'text-slate-800' : 'text-slate-500'">Quản lý Yêu cầu</span>
                        @if(state.requests().length > 0) {
                            <span class="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">{{state.requests().length}}</span>
                        }
                    </div>
                }
             </div>
         }

         <!-- Reports -->
         @if(auth.canViewReports()) {
             <div (click)="navigateTo('stats')" 
                  class="group flex items-center px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 ease-in-out active:scale-95 border border-transparent"
                  [class]="isActive('/stats') ? 'bg-slate-50 border-slate-100 shadow-sm' : 'hover:bg-gray-50'"
                  [title]="state.sidebarCollapsed() ? 'Báo cáo' : ''">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center transition-all shrink-0"
                     [class.mx-auto]="state.sidebarCollapsed()"
                     [class]="isActive('/stats') ? 'bg-white text-fuchsia-600 shadow-sm' : 'bg-gray-50 text-gray-500 group-hover:bg-white group-hover:text-fuchsia-600'">
                   <i class="fa-solid fa-chart-pie text-xs"></i>
                </div>
                @if (!state.sidebarCollapsed()) {
                    <span class="text-sm font-bold ml-3 fade-in" [class]="isActive('/stats') ? 'text-slate-800' : 'text-slate-500'">Báo cáo</span>
                }
             </div>
         }
      </div>

      <!-- 3. Footer -->
      <div class="px-4 py-4 mt-auto border-t border-slate-100 bg-slate-50/50">
          @if(!state.sidebarCollapsed()) {
              <div class="flex items-center justify-between fade-in">
                  <div class="text-[10px] font-bold text-gray-400">
                      Version <span class="text-gray-600">{{state.systemVersion()}}</span>
                  </div>
                  @if(isOnline()) {
                      <div class="flex items-center gap-1.5 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                          <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                          <span class="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">Online</span>
                      </div>
                  } @else {
                      <div class="flex items-center gap-1.5 bg-red-50 px-2 py-1 rounded-full border border-red-100">
                          <div class="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                          <span class="text-[9px] font-bold text-red-600 uppercase tracking-wider">Offline</span>
                      </div>
                  }
              </div>
          } @else {
              <div class="flex justify-center" [title]="isOnline() ? 'Online' : 'Offline'">
                  <div class="w-2 h-2 rounded-full" [class]="isOnline() ? 'bg-emerald-500' : 'bg-red-500'"></div>
              </div>
          }
      </div>
    </aside>
  `
})
export class SidebarComponent implements OnInit, OnDestroy {
  state = inject(StateService);
  auth = inject(AuthService);
  router: Router = inject(Router);
  qrService = inject(QrGlobalService); // Inject service
  getAvatarUrl = getAvatarUrl;

  isOnline = signal(navigator.onLine);

  private onlineListener: any;
  private offlineListener: any;

  ngOnInit() {
      this.onlineListener = () => this.isOnline.set(true);
      this.offlineListener = () => this.isOnline.set(false);
      window.addEventListener('online', this.onlineListener);
      window.addEventListener('offline', this.offlineListener);
  }

  ngOnDestroy() {
      window.removeEventListener('online', this.onlineListener);
      window.removeEventListener('offline', this.offlineListener);
  }

  navigateTo(path: string) {
      this.router.navigate(['/' + path]);
      this.state.closeSidebar();
      
      if (path !== 'calculator' && path !== 'editor') {
          this.state.selectedSop.set(null);
      }
  }

  isActive(path: string): boolean { return this.router.url.includes(path); }
}
