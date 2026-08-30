import { Component } from '@angular/core';
import { ConfigSafetyComponent } from '../../config/components/config-safety.component';

@Component({
  selector: 'app-consumption-settings',
  standalone: true,
  imports: [ConfigSafetyComponent],
  template: `
    <div class="space-y-4 fade-in">
      <header>
        <h1 class="text-xl font-black tracking-tight text-slate-800 dark:text-slate-100">Định mức & tiêu hao</h1>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Thiết lập ngưỡng an toàn và chính sách tiêu hao cho vận hành phòng thí nghiệm.</p>
      </header>
      <app-config-safety />
    </div>
  `,
})
export class ConsumptionSettingsComponent {}
