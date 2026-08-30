import { Component } from '@angular/core';
import { ConfigGeneralComponent } from '../../config/components/config-general.component';

@Component({
  selector: 'app-diagnostics-settings',
  standalone: true,
  imports: [ConfigGeneralComponent],
  template: `
    <div class="space-y-4 fade-in">
      <header>
        <h1 class="text-xl font-black tracking-tight text-slate-800 dark:text-slate-100">Chẩn đoán hệ thống</h1>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Kiểm tra phiên bản và tài nguyên dữ liệu phục vụ vận hành.</p>
      </header>
      <app-config-general view="diagnostics" />
    </div>
  `,
})
export class DiagnosticsSettingsComponent {}
