import { Component } from '@angular/core';
import { ConfigGeneralComponent } from '../../config/components/config-general.component';

@Component({
  selector: 'app-data-lifecycle-settings',
  standalone: true,
  imports: [ConfigGeneralComponent],
  template: `
    <div class="space-y-4 fade-in">
      <header>
        <h1 class="text-xl font-black tracking-tight text-slate-800 dark:text-slate-100">Vòng đời dữ liệu</h1>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Archive dữ liệu cũ, nạp lại dữ liệu và chạy migration hệ thống có kiểm soát.</p>
      </header>
      <app-config-general view="data" />
    </div>
  `,
})
export class DataLifecycleSettingsComponent {}
