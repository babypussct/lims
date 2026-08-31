import { Component } from '@angular/core';
import { ConfigSafetyComponent } from '../../config/components/config-safety.component';

@Component({
  selector: 'app-consumption-settings',
  standalone: true,
  imports: [ConfigSafetyComponent],
  template: `
    <div class="fade-in">
      <app-config-safety />
    </div>
  `,
})
export class ConsumptionSettingsComponent {}
