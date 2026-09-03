import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PERMISSIONS, PERMISSION_NAMES } from '../../../core/services/auth.service';

@Component({
  selector: 'app-manager-settings',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="space-y-6 fade-in">
      <section class="rounded-2xl bg-white p-5 shadow-soft-xl dark:bg-slate-900 sm:p-6">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div class="max-w-3xl">
            <div class="flex items-center gap-3">
              <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-soft text-white shadow-soft-md">
                <i class="fa-solid fa-screwdriver-wrench" aria-hidden="true"></i>
              </span>
              <div>
                <h2 class="text-base font-black text-slate-800 dark:text-slate-100">Trung tâm quản trị</h2>
                <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Tổng hợp đầy đủ các khu vực quản trị của LIMS. Thanh điều hướng phía trên luôn giữ nguyên khi mở từng chức năng chuyên sâu.</p>
              </div>
            </div>
          </div>
          <div class="flex flex-wrap gap-2">
            <span class="inline-flex w-fit items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
              <i class="fa-solid fa-circle-check text-[10px]" aria-hidden="true"></i>Quyền quản trị đang hiệu lực
            </span>
            <span class="inline-flex w-fit items-center gap-1.5 rounded-lg bg-gray-50 px-2.5 py-1 text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
              <i class="fa-solid fa-layer-group text-[10px] text-fuchsia-500" aria-hidden="true"></i>{{ adminAreaCount }} chức năng
            </span>
          </div>
        </div>

        <div class="mt-5 flex flex-wrap gap-2">
          @for (permission of managerPermissions; track permission) {
            <span class="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <i class="fa-solid fa-shield-halved text-[9px] text-fuchsia-500" aria-hidden="true"></i>{{ permissionLabel(permission) }}
            </span>
          }
        </div>
      </section>

      @for (group of adminGroups; track group.title) {
        <section class="space-y-3">
          <div class="flex items-end justify-between gap-4 px-1">
            <div>
              <h3 class="text-sm font-black text-slate-700 dark:text-slate-200">{{ group.title }}</h3>
              <p class="mt-0.5 text-[11px] text-slate-400">{{ group.description }}</p>
            </div>
            <span class="shrink-0 text-[10px] font-bold uppercase tracking-wider text-slate-400">{{ group.items.length }} mục</span>
          </div>

          <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            @for (area of group.items; track area.path) {
              <a
                [routerLink]="area.path"
                class="group flex min-h-40 flex-col rounded-2xl bg-white p-5 shadow-soft-xl transition hover:-translate-y-0.5 dark:bg-slate-900">
                <div class="flex items-start justify-between gap-3">
                  <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-fuchsia-500 shadow-soft-sm transition group-hover:bg-gradient-soft group-hover:text-white dark:bg-slate-800">
                    <i class="fa-solid" [class]="area.icon" aria-hidden="true"></i>
                  </span>
                  <i class="fa-solid fa-arrow-up-right-from-square text-[10px] text-slate-300 transition group-hover:text-fuchsia-500" aria-hidden="true"></i>
                </div>
                <h4 class="mt-4 text-sm font-black text-slate-800 dark:text-slate-100">{{ area.title }}</h4>
                <p class="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{{ area.description }}</p>
                <span class="mt-auto inline-flex items-center gap-2 pt-4 text-xs font-bold text-fuchsia-600 dark:text-fuchsia-300">
                  Mở chức năng <i class="fa-solid fa-arrow-right text-[10px] transition group-hover:translate-x-0.5" aria-hidden="true"></i>
                </span>
              </a>
            }
          </div>
        </section>
      }

      <section class="rounded-2xl bg-gray-50 p-4 dark:bg-slate-900/70">
        <div class="flex items-start gap-3">
          <i class="fa-solid fa-circle-info mt-0.5 text-fuchsia-500" aria-hidden="true"></i>
          <p class="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            Mọi trang quản trị dùng chung một hệ điều hướng trên cùng; không còn sidebar riêng khi đi sâu vào Người dùng, Vai trò, Backup hay Dữ liệu nền. Guard của từng route vẫn được giữ nguyên.
          </p>
        </div>
      </section>
    </div>
  `,
})
export class ManagerSettingsComponent {
  readonly managerPermissions = [
    PERMISSIONS.USER_MANAGE,
    PERMISSIONS.BYPASS_MAINTENANCE,
    PERMISSIONS.BACKUP_CREATE,
    PERMISSIONS.BACKUP_VERIFY,
    PERMISSIONS.BACKUP_RESTORE,
  ];

  readonly adminGroups = [
    {
      title: 'Hệ thống',
      description: 'Cấu hình nền và dữ liệu dùng chung của ứng dụng.',
      items: [
        {
          title: 'Cấu hình chung',
          description: 'Giao diện, in ấn, thông báo, bảo trì và các tham số hệ thống.',
          icon: 'fa-sliders',
          path: '/settings/system',
        },
        {
          title: 'Dữ liệu nền',
          description: 'Quản lý chỉ tiêu, nền mẫu, thiết bị, phân loại và dữ liệu danh mục.',
          icon: 'fa-layer-group',
          path: '/settings/data/master',
        },
      ],
    },
    {
      title: 'Dữ liệu & phục hồi',
      description: 'Bảo vệ dữ liệu, phục hồi sự cố và kiểm soát vòng đời dữ liệu.',
      items: [
        {
          title: 'Backup & phục hồi',
          description: 'Tạo backup, kiểm tra tính toàn vẹn, restore, lưu trữ dữ liệu cũ và quản lý bản sao lưu.',
          icon: 'fa-cloud-arrow-up',
          path: '/settings/data/backups',
        },
      ],
    },
    {
      title: 'Người dùng & truy cập',
      description: 'Quản trị tài khoản, vai trò và phạm vi quyền trong hệ thống.',
      items: [
        {
          title: 'Người dùng',
          description: 'Duyệt tài khoản, gán vai trò và quản lý quyền riêng của từng người dùng.',
          icon: 'fa-users-gear',
          path: '/settings/access/users',
        },
        {
          title: 'Vai trò',
          description: 'Quản lý nhóm vai trò và ma trận quyền dùng để phân quyền hàng loạt.',
          icon: 'fa-user-shield',
          path: '/settings/access/roles',
        },
      ],
    },
    {
      title: 'Quy tắc vận hành',
      description: 'Các chính sách nghiệp vụ ảnh hưởng trực tiếp tới vận hành phòng kiểm nghiệm.',
      items: [
        {
          title: 'Định mức & tiêu hao',
          description: 'Thiết lập ngưỡng cảnh báo và quy tắc tính hao hụt trong các luồng nghiệp vụ.',
          icon: 'fa-gauge-high',
          path: '/settings/policies/consumption',
        },
      ],
    },
  ];

  readonly adminAreaCount = this.adminGroups.reduce((total, group) => total + group.items.length, 0);

  permissionLabel(permission: string): string {
    return PERMISSION_NAMES[permission] || permission;
  }
}
