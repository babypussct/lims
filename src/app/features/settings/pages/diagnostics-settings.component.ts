import { Component } from '@angular/core';
import { ConfigGeneralComponent } from '../../config/components/config-general.component';

@Component({
  selector: 'app-diagnostics-settings',
  standalone: true,
  imports: [ConfigGeneralComponent],
  template: `
    <div class="fade-in">
      <app-config-general view="diagnostics" />
    </div>
  `,
})
export class DiagnosticsSettingsComponent {}
