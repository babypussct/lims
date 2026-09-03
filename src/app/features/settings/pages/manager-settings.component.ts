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
                <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Khu vực riêng cho tài khoản quản trị viên; các chức năng bên dưới không hiển thị cho tài khoản thông thường.</p>
              </div>
            </div>
          </div>
          <span class="inline-flex w-fit items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
            <i class="fa-solid fa-circle-check text-[10px]" aria-hidden="true"></i>Quyền quản trị đang hiệu lực
          </span>
        </div>

        <div class="mt-5 flex flex-wrap gap-2">
          @for (permission of managerPermissions; track permission) {
            <span class="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <i class="fa-solid fa-shield-halved text-[9px] text-fuchsia-500" aria-hidden="true"></i>{{ permissionLabel(permission) }}
            </span>
          }
        </div>
      </section>

      <section class="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        @for (area of adminAreas; track area.path) {
          <a
            [routerLink]="area.path"
            class="group flex min-h-52 flex-col rounded-2xl bg-white p-5 shadow-soft-xl transition hover:-translate-y-0.5 dark:bg-slate-900">
            <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-fuchsia-500 shadow-soft-sm transition group-hover:bg-gradient-soft group-hover:text-white dark:bg-slate-800">
              <i class="fa-solid" [class]="area.icon" aria-hidden="true"></i>
            </span>
            <h3 class="mt-4 text-sm font-black text-slate-800 dark:text-slate-100">{{ area.title }}</h3>
            <p class="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{{ area.description }}</p>
            <span class="mt-auto inline-flex items-center gap-2 pt-5 text-xs font-bold text-fuchsia-600 dark:text-fuchsia-300">
              Mở khu vực <i class="fa-solid fa-arrow-right text-[10px] transition group-hover:translate-x-0.5" aria-hidden="true"></i>
            </span>
          </a>
        }
      </section>

      <section class="rounded-2xl bg-gray-50 p-4 dark:bg-slate-900/70">
        <div class="flex items-start gap-3">
          <i class="fa-solid fa-circle-info mt-0.5 text-fuchsia-500" aria-hidden="true"></i>
          <p class="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            Tab Quản trị là điểm vào dành riêng cho quản trị viên. Các màn hình chuyên sâu vẫn giữ kiểm tra quyền riêng để không thay đổi phạm vi phân quyền của hệ thống.
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

  readonly adminAreas = [
    {
      title: 'Người dùng & phân quyền',
      description: 'Duyệt tài khoản, gán vai trò và quản lý quyền truy cập của từng người dùng.',
      icon: 'fa-users-gear',
      path: '/settings/access/users',
    },
    {
      title: 'Cấu hình hệ thống',
      description: 'Điều chỉnh cấu hình chung, dữ liệu nền và các tham số dùng toàn hệ thống.',
      icon: 'fa-sliders',
      path: '/settings/system',
    },
    {
      title: 'Backup & dữ liệu',
      description: 'Tạo, kiểm tra, phục hồi backup và quản lý vòng đời dữ liệu có kiểm soát.',
      icon: 'fa-database',
      path: '/settings/data/backups',
    },
    {
      title: 'Vận hành & chẩn đoán',
      description: 'Kiểm tra trạng thái hệ thống, định mức tiêu hao và các thông tin chẩn đoán.',
      icon: 'fa-stethoscope',
      path: '/settings/diagnostics',
    },
  ];

  permissionLabel(permission: string): string {
    return PERMISSION_NAMES[permission] || permission;
  }
}
