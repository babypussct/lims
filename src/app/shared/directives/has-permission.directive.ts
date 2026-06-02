import { Directive, Input, TemplateRef, ViewContainerRef, inject, effect } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Directive({
  selector: '[appHasPermission]',
  standalone: true
})
export class HasPermissionDirective {
  private auth = inject(AuthService);
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);
  private hasView = false;

  @Input('appHasPermission') permission!: string;

  constructor() {
    effect(() => {
      // Sẽ tự động chạy lại bất cứ khi nào auth.currentUser() thay đổi
      const user = this.auth.currentUser();
      const hasPerm = this.auth.hasPermission(this.permission);

      if (hasPerm && !this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      } else if (!hasPerm && this.hasView) {
        this.viewContainer.clear();
        this.hasView = false;
      }
    });
  }
}
