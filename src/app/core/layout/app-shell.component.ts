import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StateService } from '../services/state.service';
import { AppHeaderComponent } from './app-header.component';
import { BottomNavComponent } from './bottom-nav.component';
import { NavigationPanelComponent } from './navigation-panel.component';
import { NavigationRailComponent } from './navigation-rail.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterOutlet,
    AppHeaderComponent,
    NavigationRailComponent,
    NavigationPanelComponent,
    BottomNavComponent
  ],
  template: `
    <div class="min-h-screen h-[100dvh] bg-gray-50 dark:bg-slate-900 flex overflow-hidden relative">

      @if (!state.focusMode()) {
        <div class="hidden md:block">
          @defer (when !!state.currentUser()) {
            <app-navigation-rail></app-navigation-rail>
            @if (!state.sidebarCollapsed()) {
              <app-navigation-panel></app-navigation-panel>
            }
          }
        </div>
      }

      <!-- Desktop Top Header -->
      @if (!state.focusMode()) {
        @defer (when !!state.currentUser()) {
          <app-header></app-header>
        }
      }

      <main
        class="flex-1 flex flex-col relative h-full transition-all duration-300 ease-in-out overflow-hidden"
        [class.md:ml-72]="!state.sidebarCollapsed() && !state.focusMode()"
        [class.md:ml-16]="state.sidebarCollapsed() && !state.focusMode()"
        [class.md:pt-14]="!state.focusMode()"
        [class.p-0]="state.focusMode()">

        <div
          class="flex-1 min-h-0 flex flex-col overflow-hidden"
          [class.px-3]="!state.focusMode()"
          [class.pt-4]="!state.focusMode()"
          [class.md:p-6]="!state.focusMode()"
          [class.p-0]="state.focusMode()">

          @if (state.permissionError()) {
            <div class="w-full bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-xl p-3 mb-4 flex items-center justify-between animate-bounce-in shadow-sm shrink-0">
              <div class="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 font-bold">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <span>Bạn không có quyền truy cập nội dung này.</span>
              </div>
            </div>
          }

          @if (state.isOffline()) {
            <div class="w-full bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/30 rounded-xl p-3 mb-4 flex items-center justify-between animate-bounce-in shadow-sm shrink-0">
              <div class="flex items-center gap-2 text-sm text-orange-700 dark:text-orange-400 font-bold">
                <i class="fa-solid fa-plug-circle-xmark"></i>
                <span>Mất kết nối dữ liệu ({{ state.offlineSource() }}). Dữ liệu có thể chưa được cập nhật.</span>
              </div>
              <button
                type="button"
                (click)="state.clearOfflineState()"
                class="text-orange-500 hover:text-orange-700 dark:hover:text-orange-300 transition ml-3 shrink-0"
                title="Đóng">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          }

          <div class="flex-1 min-h-0 overflow-y-auto custom-scrollbar pb-20 md:pb-6">
            <router-outlet></router-outlet>
          </div>
        </div>
      </main>

      @if (!state.focusMode()) {
        @defer (when !!state.currentUser()) {
          <app-bottom-nav></app-bottom-nav>
        }
      }
    </div>
  `
})
export class AppShellComponent {
  state = inject(StateService);
}
