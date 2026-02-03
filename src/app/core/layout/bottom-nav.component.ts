
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { QrGlobalService } from '../services/qr-global.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-[40] md:hidden pb-safe">
      <div class="flex items-center justify-around h-16 px-1">
        
        <!-- 1. Dashboard -->
        <button (click)="navTo('/dashboard')" class="flex flex-col items-center justify-center w-14 gap-1 group">
          <i class="fa-solid fa-house text-lg transition-colors" 
             [class]="isActive('/dashboard') ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'"></i>
          <span class="text-[9px] font-bold" 
                [class]="isActive('/dashboard') ? 'text-blue-600' : 'text-slate-400'">Home</span>
        </button>

        <!-- 2. Inventory -->
        <button (click)="navTo('/inventory')" class="flex flex-col items-center justify-center w-14 gap-1 group">
          <i class="fa-solid fa-boxes-stacked text-lg transition-colors" 
             [class]="isActive('/inventory') ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'"></i>
          <span class="text-[9px] font-bold" 
                [class]="isActive('/inventory') ? 'text-blue-600' : 'text-slate-400'">Kho</span>
        </button>

        <!-- 3. SCAN (Main Action) -->
        <div class="relative -top-5">
            <button (click)="qrService.startScan()" 
                    class="w-14 h-14 rounded-full bg-slate-900 text-white shadow-lg shadow-slate-400 flex items-center justify-center transform active:scale-90 transition-all border-4 border-gray-50">
                <i class="fa-solid fa-qrcode text-xl"></i>
            </button>
        </div>

        <!-- 4. Requests (Duyệt) -->
        <button (click)="navTo('/requests')" class="flex flex-col items-center justify-center w-14 gap-1 group">
          <div class="relative">
             <i class="fa-solid fa-clipboard-list text-lg transition-colors" 
                [class]="isActive('/requests') ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'"></i>
          </div>
          <span class="text-[9px] font-bold" 
                [class]="isActive('/requests') ? 'text-blue-600' : 'text-slate-400'">Duyệt</span>
        </button>

        <!-- 5. Menu / SOP -->
        <button (click)="navTo('/calculator')" class="flex flex-col items-center justify-center w-14 gap-1 group">
          <i class="fa-solid fa-flask text-lg transition-colors" 
             [class]="isActive('/calculator') ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'"></i>
          <span class="text-[9px] font-bold" 
                [class]="isActive('/calculator') ? 'text-blue-600' : 'text-slate-400'">SOP</span>
        </button>

      </div>
    </div>
  `,
  styles: [`
    .pb-safe { padding-bottom: env(safe-area-inset-bottom, 0px); }
  `]
})
export class BottomNavComponent {
  router = inject(Router);
  qrService = inject(QrGlobalService);
  auth = inject(AuthService);

  navTo(path: string) {
    this.router.navigate([path]);
  }

  isActive(path: string): boolean {
    return this.router.url.includes(path);
  }
}
