import { Component } from '@angular/core';
import { ConfigGeneralComponent } from '../../config/components/config-general.component';

@Component({
  selector: 'app-backup-settings',
  standalone: true,
  imports: [ConfigGeneralComponent],
  template: `
    <div class="space-y-4 fade-in">
      <header>
        <h1 class="text-xl font-black tracking-tight text-slate-800 dark:text-slate-100">Backup & phục hồi</h1>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Tạo, xác minh và phục hồi backup toàn diện; quản lý dữ liệu soft-delete.</p>
      </header>
      <app-config-general view="backup" />
    </div>
  `,
})
export class BackupSettingsComponent {}
