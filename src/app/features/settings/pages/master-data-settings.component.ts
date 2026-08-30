import { Component } from '@angular/core';
import { ConfigGeneralComponent } from '../../config/components/config-general.component';

@Component({
  selector: 'app-master-data-settings',
  standalone: true,
  imports: [ConfigGeneralComponent],
  template: `
    <div class="space-y-4 fade-in">
      <header>
        <h1 class="text-xl font-black tracking-tight text-slate-800 dark:text-slate-100">Dữ liệu nền</h1>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Quản lý danh mục gốc dùng xuyên suốt quy trình phân tích.</p>
      </header>
      <app-config-general view="master" />
    </div>
  `,
})
export class MasterDataSettingsComponent {}
