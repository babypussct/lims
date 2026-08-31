import { Component } from '@angular/core';
import { ConfigGeneralComponent } from '../../config/components/config-general.component';

@Component({
  selector: 'app-backup-settings',
  standalone: true,
  imports: [ConfigGeneralComponent],
  template: `
    <div class="fade-in">
      <app-config-general view="backup" />
    </div>
  `,
})
export class BackupSettingsComponent {}
