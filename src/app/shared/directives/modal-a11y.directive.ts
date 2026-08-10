import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  inject,
  OnDestroy,
  Output,
} from '@angular/core';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/** Shared keyboard/focus contract for modal and bottom-sheet surfaces. */
@Directive({
  selector: '[appModalA11y]',
  standalone: true,
})
export class ModalA11yDirective implements AfterViewInit, OnDestroy {
  @Input() modalLabelledBy?: string;
  @Input() modalDescribedBy?: string;
  @Output() modalEscape = new EventEmitter<void>();

  private previouslyFocused: HTMLElement | null = null;

  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  ngAfterViewInit(): void {
    const host = this.elementRef.nativeElement;
    this.previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

    host.setAttribute('role', 'dialog');
    host.setAttribute('aria-modal', 'true');
    host.setAttribute('tabindex', '-1');

    if (this.modalLabelledBy) host.setAttribute('aria-labelledby', this.modalLabelledBy);
    if (this.modalDescribedBy) host.setAttribute('aria-describedby', this.modalDescribedBy);

    queueMicrotask(() => {
      const firstFocusable = this.getFocusableElements()[0];
      (firstFocusable || host).focus({ preventScroll: true });
    });
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.modalEscape.emit();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusable = this.getFocusableElements();
    if (focusable.length === 0) {
      event.preventDefault();
      this.elementRef.nativeElement.focus({ preventScroll: true });
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus({ preventScroll: true });
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus({ preventScroll: true });
    }
  }

  ngOnDestroy(): void {
    if (this.previouslyFocused?.isConnected) {
      this.previouslyFocused.focus({ preventScroll: true });
    }
  }

  private getFocusableElements(): HTMLElement[] {
    return Array.from(this.elementRef.nativeElement.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
      .filter((element) => {
        const style = window.getComputedStyle(element);
        return style.display !== 'none' && style.visibility !== 'hidden';
      });
  }
}
