import { Component } from '@angular/core';
import { ConfigGeneralComponent } from '../../config/components/config-general.component';

@Component({
  selector: 'app-system-settings',
  standalone: true,
  imports: [ConfigGeneralComponent],
  template: `
    <div class="space-y-4 fade-in">
      <header>
        <h1 class="text-xl font-black tracking-tight text-slate-800 dark:text-slate-100">Cấu hình hệ thống</h1>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Giao diện mặc định, in ấn, thông báo hệ thống, hiển thị tính năng và chế độ bảo trì.</p>
      </header>
      <app-config-general view="system" />
    </div>
  `,
})
export class SystemSettingsComponent {}
