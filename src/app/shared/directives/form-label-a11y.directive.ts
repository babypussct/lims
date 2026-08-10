import { AfterViewInit, Directive, ElementRef, inject } from '@angular/core';

/** Associates reactive-form controls with their visible labels after a dynamic form renders. */
@Directive({
  selector: 'form[appFormLabelA11y]',
  standalone: true,
})
export class FormLabelA11yDirective implements AfterViewInit {
  private readonly elementRef = inject<ElementRef<HTMLFormElement>>(ElementRef);

  ngAfterViewInit(): void {
    const form = this.elementRef.nativeElement;
    const formId = form.id || 'lims-form';
    const controlCounts = new Map<string, number>();

    form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      'input[formControlName], select[formControlName], textarea[formControlName]'
    ).forEach((control) => {
      const controlName = control.getAttribute('formControlName');
      if (!controlName) return;

      const occurrence = controlCounts.get(controlName) ?? 0;
      controlCounts.set(controlName, occurrence + 1);
      const id = control.id || `${formId}-${controlName}${occurrence > 0 ? `-${occurrence + 1}` : ''}`;
      control.id = id;

      const visibleLabel = control.parentElement?.querySelector('label');
      if (visibleLabel) {
        visibleLabel.htmlFor = id;
      } else if (!control.getAttribute('aria-label')) {
        control.setAttribute('aria-label', controlName);
      }
    });
  }
}
