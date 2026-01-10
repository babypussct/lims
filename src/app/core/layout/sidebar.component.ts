
import { Component, inject, output, input, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StateService } from '../services/state.service';
import { AuthService } from '../services/auth.service';
import { Sop } from '../../core/models/sop.model';
import { getAvatarUrl } from '../../shared/utils/utils';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <aside class="fixed inset-y-0 left-0 bg-white shadow-soft-xl z-50 flex flex-col transition-all duration-300 ease-in-out md:m-4 md:rounded-2xl"
           [class.w-64]="!state.sidebarCollapsed()"
           [class.w-20]="state.sidebarCollapsed()"
           [class.-translate-x-full]="!state.sidebarOpen()"
           [class.md:translate-x-0]="true"
           [class.translate-x-0]="state.sidebarOpen()">
      
      <!-- 1. Brand -->
      <div class="h-20 flex items-center px-6 shrink-0 relative"
           [class.justify-center]="state.sidebarCollapsed()">
         <div (click)="state.toggleSidebarCollapse()" class="w-8 h-8 rounded-lg bg-gradient-soft flex items-center justify-center shadow-soft-md shrink-0 cursor-pointer hover:scale-105 transition-transform">
             <i class="fa-solid fa-flask text-white text-xs"></i>
         </div>
         @if (!state.sidebarCollapsed()) {
            <span class="font-bold text-gray-700 text-sm tracking-wide ml-3 fade-in">LIMS Cloud <span class="font-light">Pro</span></span>
         }
         
         <!-- Mobile Close -->
         <button (click)="state.closeSidebar()" class="md:hidden ml-auto w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 active:bg-gray-200">
             <i class="fa-solid fa-times"></i>
         </button>
      </div>

      <hr class="h-px mt-0 bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent opacity-25 mx-4" />

      <!-- 2. Modules Menu (Simplified) -->
      <div class="px-4 py-4 shrink-0 space-y-1 flex-1 overflow-y-auto custom-scrollbar">
         
         <!-- Dashboard: Public -->
         <div (click)="navigateTo('dashboard')" 
              class="group flex items-center px-3 py-3.5 rounded-xl cursor-pointer transition-all duration-200 ease-in-out active:scale-95"
              [class]="isActive('/dashboard') ? 'bg-white shadow-soft-md' : 'hover:bg-gray-100'"
              [title]="state.sidebarCollapsed() ? 'Trang chủ' : ''">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center shadow-soft-sm transition-all shrink-0"
                 [class.mx-auto]="state.sidebarCollapsed()"
                 [class]="isActive('/dashboard') ? 'bg-gradient-soft text-white' : 'bg-white text-gray-700 group-hover:text-fuchsia-600'">
               <i class="fa-solid fa-house text-xs"></i>
            </div>
            @if (!state.sidebarCollapsed()) {
                <span class="text-sm font-medium ml-3 fade-in" [class]="isActive('/dashboard') ? 'text-gray-700 font-bold' : 'text-gray-500'">Trang chủ</span>
            }
         </div>

         <!-- SOP (Vận hành): Protected (SOP_VIEW) -->
         <!-- Note: Recipes are now part of this flow -->
         @if(auth.canViewSop()) {
             <div (click)="navigateTo('calculator')" 
                  class="group flex items-center px-3 py-3.5 rounded-xl cursor-pointer transition-all duration-200 ease-in-out active:scale-95"
                  [class]="isActive('/calculator') || isActive('/editor') || isActive('/recipes') ? 'bg-white shadow-soft-md' : 'hover:bg-gray-100'"
                  [title]="state.sidebarCollapsed() ? 'Vận hành (SOP)' : ''">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center shadow-soft-sm transition-all shrink-0"
                     [class.mx-auto]="state.sidebarCollapsed()"
                     [class]="isActive('/calculator') || isActive('/editor') || isActive('/recipes') ? 'bg-gradient-soft text-white' : 'bg-white text-gray-700 group-hover:text-fuchsia-600'">
                   <i class="fa-solid fa-play text-xs pl-0.5"></i>
                </div>
                @if (!state.sidebarCollapsed()) {
                    <span class="text-sm font-medium ml-3 fade-in" [class]="isActive('/calculator') || isActive('/editor') || isActive('/recipes') ? 'text-gray-700 font-bold' : 'text-gray-500'">Vận hành (SOP)</span>
                }
             </div>
         }

         <!-- Inventory (Kho & Tem): Protected (INVENTORY_VIEW) -->
         <!-- Note: Labels are now a tab inside Inventory -->
         @if(auth.canViewInventory()) {
             <div (click)="navigateTo('inventory')" 
                  class="group flex items-center px-3 py-3.5 rounded-xl cursor-pointer transition-all duration-200 ease-in-out active:scale-95"
                  [class]="isActive('/inventory') || isActive('/labels') ? 'bg-white shadow-soft-md' : 'hover:bg-gray-100'"
                  [title]="state.sidebarCollapsed() ? 'Kho Hóa chất' : ''">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center shadow-soft-sm transition-all shrink-0"
                     [class.mx-auto]="state.sidebarCollapsed()"
                     [class]="isActive('/inventory') || isActive('/labels') ? 'bg-gradient-soft text-white' : 'bg-white text-gray-700 group-hover:text-fuchsia-600'">
                   <i class="fa-solid fa-boxes-stacked text-xs"></i>
                </div>
                @if (!state.sidebarCollapsed()) {
                    <span class="text-sm font-medium ml-3 fade-in" [class]="isActive('/inventory') || isActive('/labels') ? 'text-gray-700 font-bold' : 'text-gray-500'">Kho Hóa chất</span>
                }
             </div>
         }

         <!-- Standards: Protected (STANDARD_VIEW) -->
         @if(auth.canViewStandards()) {
             <div (click)="navigateTo('standards')" 
                  class="group flex items-center px-3 py-3.5 rounded-xl cursor-pointer transition-all duration-200 ease-in-out active:scale-95"
                  [class]="isActive('/standards') ? 'bg-white shadow-soft-md' : 'hover:bg-gray-100'"
                  [title]="state.sidebarCollapsed() ? 'Chuẩn Đối chiếu' : ''">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center shadow-soft-sm transition-all shrink-0"
                     [class.mx-auto]="state.sidebarCollapsed()"
                     [class]="isActive('/standards') ? 'bg-gradient-soft text-white' : 'bg-white text-gray-700 group-hover:text-fuchsia-600'">
                   <i class="fa-solid fa-vial-circle-check text-xs"></i>
                </div>
                @if (!state.sidebarCollapsed()) {
                    <span class="text-sm font-medium ml-3 fade-in" [class]="isActive('/standards') ? 'text-gray-700 font-bold' : 'text-gray-500'">Chuẩn Đối chiếu</span>
                }
             </div>
         }

         <!-- Requests (Yêu cầu & In ấn): Protected (SOP_VIEW proxy) -->
         <!-- Note: Printing Queue is now a tab inside Requests -->
         @if(auth.canViewSop()) {
             <div (click)="navigateTo('requests')" 
                  class="group flex items-center px-3 py-3.5 rounded-xl cursor-pointer transition-all duration-200 ease-in-out active:scale-95"
                  [class]="isActive('/requests') || isActive('/printing') ? 'bg-white shadow-soft-md' : 'hover:bg-gray-100'"
                  [title]="state.sidebarCollapsed() ? 'Yêu cầu & In phiếu' : ''">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center shadow-soft-sm transition-all shrink-0 relative"
                     [class.mx-auto]="state.sidebarCollapsed()"
                     [class]="isActive('/requests') || isActive('/printing') ? 'bg-gradient-soft text-white' : 'bg-white text-gray-700 group-hover:text-fuchsia-600'">
                   <i class="fa-solid fa-clipboard-list text-xs"></i>
                   @if(state.sidebarCollapsed() && state.requests().length > 0) {
                       <span class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                   }
                </div>
                @if (!state.sidebarCollapsed()) {
                    <div class="flex-1 flex justify-between items-center ml-3 fade-in">
                        <span class="text-sm font-medium" [class]="isActive('/requests') || isActive('/printing') ? 'text-gray-700 font-bold' : 'text-gray-500'">Quản lý Yêu cầu</span>
                        @if(state.requests().length > 0) {
                            <span class="bg-red-500 text-white text-[10px] font-bold px-1.5 rounded-md shadow-sm">{{state.requests().length}}</span>
                        }
                    </div>
                }
             </div>
         }

         <!-- Reports: Protected (REPORT_VIEW) -->
         @if(auth.canViewReports()) {
             <div (click)="navigateTo('stats')" 
                  class="group flex items-center px-3 py-3.5 rounded-xl cursor-pointer transition-all duration-200 ease-in-out active:scale-95"
                  [class]="isActive('/stats') ? 'bg-white shadow-soft-md' : 'hover:bg-gray-100'"
                  [title]="state.sidebarCollapsed() ? 'Báo cáo' : ''">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center shadow-soft-sm transition-all shrink-0"
                     [class.mx-auto]="state.sidebarCollapsed()"
                     [class]="isActive('/stats') ? 'bg-gradient-soft text-white' : 'bg-white text-gray-700 group-hover:text-fuchsia-600'">
                   <i class="fa-solid fa-chart-pie text-xs"></i>
                </div>
                @if (!state.sidebarCollapsed()) {
                    <span class="text-sm font-medium ml-3 fade-in" [class]="isActive('/stats') ? 'text-gray-700 font-bold' : 'text-gray-500'">Báo cáo</span>
                }
             </div>
         }
      </div>

      <!-- 3. Footer: Version & Status -->
      <div class="px-4 py-4 mt-auto border-t border-gray-100 bg-white rounded-b-2xl">
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
              <!-- Collapsed Indicator -->
              <div class="flex justify-center">
                  <div class="w-2 h-2 rounded-full" [class]="isOnline() ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'"></div>
              </div>
          }
      </div>
      
      <!-- Collapse Toggle Button (Desktop Only) -->
      <button (click)="state.toggleSidebarCollapse()" 
              class="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-gray-200 rounded-full items-center justify-center shadow-md text-gray-500 hover:text-fuchsia-600 z-50 transition hover:scale-110">
          <i class="fa-solid text-[10px]" [class.fa-chevron-left]="!state.sidebarCollapsed()" [class.fa-chevron-right]="state.sidebarCollapsed()"></i>
      </button>

    </aside>
  `
})
export class SidebarComponent implements OnInit, OnDestroy {
  state = inject(StateService);
  auth = inject(AuthService);
  router: Router = inject(Router);
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
