import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StateService } from '../services/state.service';
import { AppHeaderComponent } from './app-header.component';
import { BottomNavComponent } from './bottom-nav.component';
import { NavigationPanelComponent } from './navigation-panel.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterOutlet,
    AppHeaderComponent,
    NavigationPanelComponent,
    BottomNavComponent
  ],
  template: `
    <div class="soft-ui-app-shell min-h-screen h-[100dvh] flex overflow-hidden relative">

      @if (!state.focusMode()) {
        <div class="hidden md:block">
          @defer (when !!state.currentUser()) {
            <app-navigation-panel></app-navigation-panel>
          }
        </div>
      }

      <!-- Soft UI-style application header (desktop + mobile) -->
      @if (!state.focusMode()) {
        @defer (when !!state.currentUser()) {
          <app-header></app-header>
        }
      }

      <main
        class="flex-1 flex flex-col relative h-full transition-all duration-300 ease-in-out overflow-hidden"
        [class.md:ml-[17rem]]="!state.sidebarCollapsed() && !state.focusMode()"
        [class.md:ml-16]="state.sidebarCollapsed() && !state.focusMode()"
        [class.pt-16]="!state.focusMode()"
        [class.p-0]="state.focusMode()">

        <div
          class="flex-1 min-h-0 flex flex-col overflow-hidden"
          [class.px-3]="!state.focusMode()"
          [class.pt-2]="!state.focusMode()"
          [class.md:px-6]="!state.focusMode()"
          [class.md:pt-5]="!state.focusMode()"
          [class.xl:px-8]="!state.focusMode()"
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
                title="Đóng"
                aria-label="Đóng thông báo mất kết nối">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          }

          <div class="app-content-scroll flex-1 min-h-0 overflow-y-auto custom-scrollbar">
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
  `,
  styles: [`
    .app-content-scroll {
      padding-bottom: calc(5rem + env(safe-area-inset-bottom, 0px));
    }

    @media (min-width: 768px) {
      .app-content-scroll {
        padding-bottom: 1.5rem;
      }
    }
  `]
})
export class AppShellComponent {
  state = inject(StateService);
}
