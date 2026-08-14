import { Component, signal } from '@angular/core';
import { AppButtonComponent } from './button/button.component';
import { AppEmptyStateComponent } from './empty-state/empty-state.component';
import { AppModalShellComponent } from './modal-shell/modal-shell.component';
import { AppPageHeaderComponent } from './page-header/page-header.component';
import { AppToolbarComponent } from './toolbar/toolbar.component';

@Component({
  selector: 'app-ui-primitives-demo',
  standalone: true,
  imports: [
    AppButtonComponent,
    AppEmptyStateComponent,
    AppModalShellComponent,
    AppPageHeaderComponent,
    AppToolbarComponent,
  ],
  template: `
    <div [class.dark]="darkPreview()" class="min-h-full">
      <div class="min-h-full bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <app-page-header
          title="UI primitives"
          subtitle="Trang kiểm tra nội bộ cho các thành phần giao diện dùng chung."
          icon="fa-shapes"
          [sticky]="true"
        >
          <div pageHeaderActions>
            <app-button variant="ghost" (click)="toggleDarkPreview()">
              <i class="fa-solid" [class.fa-moon]="!darkPreview()" [class.fa-sun]="darkPreview()" aria-hidden="true"></i>
              {{ darkPreview() ? 'Xem sáng' : 'Xem tối' }}
            </app-button>
          </div>
        </app-page-header>

        <app-toolbar>
          <div toolbarSearch class="relative max-w-xl">
            <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400" aria-hidden="true"></i>
            <input
              type="search"
              placeholder="Tìm kiếm mẫu..."
              class="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
          <div toolbarFilters>
            <app-button variant="secondary" size="sm"><i class="fa-solid fa-filter" aria-hidden="true"></i>Lọc</app-button>
          </div>
          <div toolbarActions>
            <app-button size="sm" (click)="modalOpen.set(true)"><i class="fa-solid fa-plus" aria-hidden="true"></i>Tạo mới</app-button>
          </div>
        </app-toolbar>

        <main class="mx-auto grid max-w-6xl gap-6 p-4 sm:p-6 lg:grid-cols-2">
          <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 class="text-base font-black text-slate-800 dark:text-slate-100">Button variants</h2>
            <div class="mt-4 flex flex-wrap items-center gap-3">
              <app-button>Primary</app-button>
              <app-button variant="secondary">Secondary</app-button>
              <app-button variant="danger">Danger</app-button>
              <app-button variant="ghost">Ghost</app-button>
              <app-button [loading]="true">Đang lưu</app-button>
              <app-button [disabled]="true">Disabled</app-button>
            </div>
          </section>

          <section class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <app-empty-state
              icon="fa-flask"
              title="Chưa có mẫu thử"
              message="Empty state dùng chung giữ icon, khoảng cách và typography nhất quán."
            >
              <div emptyStateActions>
                <app-button size="sm">Tạo mẫu thử</app-button>
              </div>
            </app-empty-state>
          </section>

          <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
            <h2 class="text-base font-black text-slate-800 dark:text-slate-100">Modal shell</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Kiểm tra focus, Escape, backdrop, footer và light/dark.</p>
            <div class="mt-4">
              <app-button (click)="modalOpen.set(true)">Mở modal demo</app-button>
            </div>
          </section>
        </main>

        @if (modalOpen()) {
          <app-modal-shell
            title="Xác nhận cập nhật"
            description="Modal demo dùng shell và hợp đồng accessibility chung."
            size="md"
            (closed)="modalOpen.set(false)"
          >
            <div modalBody class="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <p>Nội dung modal có vùng cuộn riêng và giữ panel trong viewport.</p>
              <label class="block font-semibold text-slate-700 dark:text-slate-200" for="ui-demo-note">Ghi chú</label>
              <input
                id="ui-demo-note"
                class="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 dark:border-slate-700 dark:bg-slate-800"
                value="Kiểm tra focus trap"
              />
            </div>
            <div modalFooter class="contents">
              <app-button variant="secondary" (click)="modalOpen.set(false)">Hủy</app-button>
              <app-button (click)="modalOpen.set(false)">Xác nhận</app-button>
            </div>
          </app-modal-shell>
        }
      </div>
    </div>
  `,
})
export class UiPrimitivesDemoComponent {
  readonly darkPreview = signal(false);
  readonly modalOpen = signal(false);

  toggleDarkPreview(): void {
    this.darkPreview.update((value) => !value);
  }
}
