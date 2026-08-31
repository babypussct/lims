import { Component } from '@angular/core';
import { ConfigGeneralComponent } from '../../config/components/config-general.component';

@Component({
  selector: 'app-system-settings',
  standalone: true,
  imports: [ConfigGeneralComponent],
  template: `
    <div class="fade-in">
      <app-config-general view="system" />
    </div>
  `,
})
export class SystemSettingsComponent {}
