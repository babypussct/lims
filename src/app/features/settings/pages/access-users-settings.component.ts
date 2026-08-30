import { Component } from '@angular/core';
import { ConfigUsersComponent } from '../../config/components/config-users.component';

@Component({
  selector: 'app-access-users-settings',
  standalone: true,
  imports: [ConfigUsersComponent],
  template: `
    <div class="space-y-4 fade-in">
      <header>
        <h1 class="text-xl font-black tracking-tight text-slate-800 dark:text-slate-100">Người dùng & phân quyền</h1>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Duyệt tài khoản, gán vai trò, lọc người dùng và quản lý quyền cá nhân.</p>
      </header>
      <app-config-users />
    </div>
  `,
})
export class AccessUsersSettingsComponent {}
