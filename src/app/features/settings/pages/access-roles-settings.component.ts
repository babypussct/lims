import { Component } from '@angular/core';
import { ConfigRolesComponent } from '../../config/components/config-roles.component';

@Component({
  selector: 'app-access-roles-settings',
  standalone: true,
  imports: [ConfigRolesComponent],
  template: `
    <div class="space-y-4 fade-in">
      <header>
        <h1 class="text-xl font-black tracking-tight text-slate-800 dark:text-slate-100">Vai trò & ma trận quyền</h1>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Thiết kế nhóm vai trò nghiệp vụ và tổ hợp quyền kế thừa cho người dùng.</p>
      </header>
      <app-config-roles />
    </div>
  `,
})
export class AccessRolesSettingsComponent {}
