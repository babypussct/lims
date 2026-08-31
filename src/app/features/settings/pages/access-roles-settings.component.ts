import { Component } from '@angular/core';
import { ConfigRolesComponent } from '../../config/components/config-roles.component';

@Component({
  selector: 'app-access-roles-settings',
  standalone: true,
  imports: [ConfigRolesComponent],
  template: `
    <div class="fade-in">
      <app-config-roles />
    </div>
  `,
})
export class AccessRolesSettingsComponent {}
