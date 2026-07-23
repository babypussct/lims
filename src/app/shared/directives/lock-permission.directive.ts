import { Directive, Input, ElementRef, Renderer2, inject, effect, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { StateService } from '../../core/services/state.service';
import { ToastService } from '../../core/services/toast.service';

@Directive({
  selector: '[appLockPermission]',
  standalone: true
})
export class LockPermissionDirective implements OnInit, OnDestroy {
  @Input('appLockPermission') permission!: string;

  private auth = inject(AuthService);
  private state = inject(StateService);
  private toast = inject(ToastService);
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  private removeClickListener?: () => void;
  private removeKeydownListener?: () => void;
  private originalTitle: string | null = null;
  private hasCapturedTitle = false;

  constructor() {
    effect(() => {
      // Reactivity triggers when user or showLockedFeatures changes
      this.auth.currentUser();
      this.state.showLockedFeatures();
      this.applyState();
    });
  }

  ngOnInit() {
    const nativeEl: HTMLElement = this.el.nativeElement;
    if (nativeEl.hasAttribute('title')) {
      this.originalTitle = nativeEl.getAttribute('title');
      this.hasCapturedTitle = true;
    }
    this.setupCaptureListeners();
    this.applyState();
  }

  ngOnDestroy() {
    if (this.removeClickListener) this.removeClickListener();
    if (this.removeKeydownListener) this.removeKeydownListener();
  }

  private setupCaptureListeners() {
    const nativeEl: HTMLElement = this.el.nativeElement;

    // Register in capture phase so parent intercept catches child button clicks before they fire
    const captureHandler = (event: Event) => {
      if (!this.permission) return;
      const hasPerm = this.auth.hasPermission(this.permission);
      const showLocked = this.state.showLockedFeatures();

      if (!hasPerm && showLocked) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        this.toast.show(`Cần quyền "${this.permission}" · Liên hệ Admin để được cấp`, 'warning');
      }
    };

    nativeEl.addEventListener('click', captureHandler, true);
    const keydownHandler = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        captureHandler(event);
      }
    };
    nativeEl.addEventListener('keydown', keydownHandler, true);

    this.removeClickListener = () => nativeEl.removeEventListener('click', captureHandler, true);
    this.removeKeydownListener = () => nativeEl.removeEventListener('keydown', keydownHandler, true);
  }

  private applyState() {
    if (!this.permission) return;

    const hasPerm = this.auth.hasPermission(this.permission);
    const showLocked = this.state.showLockedFeatures();
    const nativeEl: HTMLElement = this.el.nativeElement;

    if (hasPerm) {
      if (this.hasCapturedTitle && this.originalTitle !== null) {
        this.renderer.setAttribute(nativeEl, 'title', this.originalTitle);
      } else {
        this.renderer.removeAttribute(nativeEl, 'title');
      }
      this.renderer.removeAttribute(nativeEl, 'aria-disabled');
      this.renderer.removeAttribute(nativeEl, 'disabled');
      this.renderer.removeClass(nativeEl, 'opacity-50');
      this.renderer.removeClass(nativeEl, 'cursor-not-allowed');
      this.renderer.setStyle(nativeEl, 'display', '');
      this.renderer.setStyle(nativeEl, 'pointer-events', '');
    } else if (showLocked) {
      // Capture original title before overriding if not already captured
      if (!this.hasCapturedTitle && nativeEl.hasAttribute('title')) {
        this.originalTitle = nativeEl.getAttribute('title');
        this.hasCapturedTitle = true;
      }
      // Do NOT set native `disabled` so standard browsers allow click event to be caught by capture listener
      this.renderer.removeAttribute(nativeEl, 'disabled');
      this.renderer.setAttribute(nativeEl, 'aria-disabled', 'true');
      this.renderer.addClass(nativeEl, 'opacity-50');
      this.renderer.addClass(nativeEl, 'cursor-not-allowed');
      this.renderer.setStyle(nativeEl, 'pointer-events', 'auto');
      this.renderer.setAttribute(nativeEl, 'title', `Cần quyền "${this.permission}" · Liên hệ Admin để được cấp`);
      this.renderer.setStyle(nativeEl, 'display', '');
    } else {
      this.renderer.setStyle(nativeEl, 'display', 'none');
    }
  }
}
