import { Component } from '@angular/core';
import { ConfigGeneralComponent } from '../../config/components/config-general.component';

@Component({
  selector: 'app-data-lifecycle-settings',
  standalone: true,
  imports: [ConfigGeneralComponent],
  template: `
    <div class="fade-in">
      <app-config-general view="data" />
    </div>
  `,
})
export class DataLifecycleSettingsComponent {}
