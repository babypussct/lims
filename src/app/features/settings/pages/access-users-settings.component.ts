import { Component } from '@angular/core';
import { ConfigUsersComponent } from '../../config/components/config-users.component';

@Component({
  selector: 'app-access-users-settings',
  standalone: true,
  imports: [ConfigUsersComponent],
  template: `
    <div class="fade-in">
      <app-config-users />
    </div>
  `,
})
export class AccessUsersSettingsComponent {}
