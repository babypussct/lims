import { Component, signal } from '@angular/core';
import { AppButtonComponent } from './button/button.component';
import { AppEmptyStateComponent } from './empty-state/empty-state.component';
import { AppModalShellComponent } from './modal-shell/modal-shell.component';
import { AppPageHeaderComponent } from './page-header/page-header.component';
import { AppToolbarComponent } from './toolbar/toolbar.component';
import { AppUiTimelineComponent } from './timeline/timeline.component';
import { TimelineItem } from './timeline/timeline.model';
import { AppUiProgressComponent } from './progress/progress.component';
import { AppUiAvatarGroupComponent } from './avatar-group/avatar-group.component';
import { AvatarGroupItem } from './avatar-group/avatar-group.model';
import { AppDatePickerComponent } from './date-picker/date-picker.component';

@Component({
  selector: 'app-ui-primitives-demo',
  standalone: true,
  imports: [
    AppButtonComponent,
    AppEmptyStateComponent,
    AppModalShellComponent,
    AppPageHeaderComponent,
    AppToolbarComponent,
    AppUiTimelineComponent,
    AppUiProgressComponent,
    AppUiAvatarGroupComponent,
    AppDatePickerComponent,
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
            <h2 class="text-base font-black text-slate-800 dark:text-slate-100">Các kiểu nút</h2>
            <div class="mt-4 flex flex-wrap items-center gap-3">
              <app-button>Chính</app-button>
              <app-button variant="secondary">Phụ</app-button>
              <app-button variant="danger">Nguy hiểm</app-button>
              <app-button variant="ghost">Trong suốt</app-button>
              <app-button [loading]="true">Đang lưu</app-button>
              <app-button [disabled]="true">Đã vô hiệu hóa</app-button>
            </div>
          </section>

          <section class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <app-empty-state
              icon="fa-flask"
              title="Chưa có mẫu thử"
              message="Trạng thái trống dùng chung giữ biểu tượng, khoảng cách và kiểu chữ nhất quán."
            >
              <div emptyStateActions>
                <app-button size="sm">Tạo mẫu thử</app-button>
              </div>
            </app-empty-state>
          </section>

          <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
            <h2 class="text-base font-black text-slate-800 dark:text-slate-100">Soft UI Timeline</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Dòng thời gian dùng chung cho traceability và audit trail.</p>
            <div class="mt-5 max-w-3xl">
              <app-ui-timeline [items]="timelinePreview" ariaLabel="Timeline mẫu phòng kiểm nghiệm" />
            </div>
          </section>

          <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 class="text-base font-black text-slate-800 dark:text-slate-100">Thin Gradient Progress</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Thanh tiến độ 4px dùng cho mẻ, checklist và báo cáo.</p>
            <div class="mt-5 space-y-5">
              <app-ui-progress [value]="68" label="Tiến độ mẻ phân tích" ariaLabel="Tiến độ mẻ phân tích" [showValue]="true" />
              <app-ui-progress [value]="100" status="success" label="Checklist ngày" ariaLabel="Tiến độ checklist ngày" [showValue]="true" />
            </div>
          </section>

          <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 class="text-base font-black text-slate-800 dark:text-slate-100">Avatar Group</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Facepile dùng cho nhóm kỹ thuật viên cùng thao tác.</p>
            <div class="mt-5">
              <app-ui-avatar-group [items]="avatarPreview" [maxVisible]="4" size="md" ariaLabel="Kỹ thuật viên mẫu" />
            </div>
          </section>

          <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
            <h2 class="text-base font-black text-slate-800 dark:text-slate-100">Date Picker Primitives</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Chọn ngày Soft UI với định dạng cố định DD/MM/YYYY, lưu trữ ISO YYYY-MM-DD và hỗ trợ các nhóm preset nghiệp vụ.
            </p>
            <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <app-date-picker
                  label="Preset Standard"
                  presets="standard"
                  [(value)]="demoDateStandard"
                ></app-date-picker>
                <span class="text-[10px] text-slate-400 mt-1 block">ISO: {{ demoDateStandard() || 'rỗng' }}</span>
              </div>
              <div>
                <app-date-picker
                  label="Preset Prep"
                  presets="prep"
                  [(value)]="demoDatePrep"
                ></app-date-picker>
                <span class="text-[10px] text-slate-400 mt-1 block">ISO: {{ demoDatePrep() || 'rỗng' }}</span>
              </div>
              <div>
                <app-date-picker
                  label="Kích thước nhỏ (sm)"
                  size="sm"
                  presets="simple"
                  [(value)]="demoDateSmall"
                ></app-date-picker>
                <span class="text-[10px] text-slate-400 mt-1 block">ISO: {{ demoDateSmall() || 'rỗng' }}</span>
              </div>
              <div>
                <app-date-picker
                  label="Vô hiệu hóa"
                  [disabled]="true"
                  value="2026-09-17"
                ></app-date-picker>
                <span class="text-[10px] text-slate-400 mt-1 block">Đã khóa</span>
              </div>
            </div>
          </section>

          <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
            <h2 class="text-base font-black text-slate-800 dark:text-slate-100">Khung hộp thoại</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Kiểm tra vùng lấy nét, phím Escape, nền phủ, chân trang và chế độ sáng/tối.</p>
            <div class="mt-4">
              <app-button (click)="modalOpen.set(true)">Mở hộp thoại mẫu</app-button>
            </div>
          </section>
        </main>

        @if (modalOpen()) {
          <app-modal-shell
            title="Xác nhận cập nhật"
            description="Hộp thoại mẫu dùng khung và quy tắc trợ năng chung."
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
  readonly demoDateStandard = signal('2026-09-17');
  readonly demoDatePrep = signal('');
  readonly demoDateSmall = signal('2026-09-17');
  readonly timelinePreview: TimelineItem[] = [
    {
      id: 'received',
      title: 'Tiếp nhận mẫu kiểm nghiệm',
      description: 'Hồ sơ được ghi nhận và chuyển sang quy trình phân tích.',
      timestamp: new Date('2026-09-16T08:15:00+07:00'),
      actorName: 'Nguyễn Văn A',
      actorRole: 'Kỹ thuật viên',
      icon: 'fa-clipboard-check',
      status: 'info',
      metadata: [{ label: 'Mã mẫu', value: 'LAB-260916-01' }],
    },
    {
      id: 'approved',
      title: 'Phê duyệt kế hoạch phân tích',
      description: 'Mẻ phân tích đã sẵn sàng cho bước chuẩn bị và chạy thiết bị.',
      timestamp: new Date('2026-09-16T09:05:00+07:00'),
      actorName: 'Quản lý QC',
      actorRole: 'Người phê duyệt',
      icon: 'fa-circle-check',
      status: 'success',
      metadata: [{ label: 'SOP', value: 'GC-MS/MS' }],
      isCurrent: true,
    },
  ];
  readonly avatarPreview: AvatarGroupItem[] = [
    { id: 'an', name: 'Nguyễn Văn An', subtitle: 'Kỹ thuật viên' },
    { id: 'binh', name: 'Trần Gia Bình', subtitle: 'QC' },
    { id: 'chi', name: 'Lê Minh Chi', subtitle: 'Kiểm nghiệm viên' },
    { id: 'dung', name: 'Phạm Hoàng Dũng', subtitle: 'Quản lý ca' },
    { id: 'ha', name: 'Võ Thu Hà', subtitle: 'Kỹ thuật viên' },
  ];

  toggleDarkPreview(): void {
    this.darkPreview.update((value) => !value);
  }
}
