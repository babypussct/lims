import { Directive, ElementRef, Input, OnChanges, inject } from '@angular/core';
import { createStandardQrDataUrl } from '../utils/standard-qr';

@Directive({
  selector: 'img[appStandardQr]',
  standalone: true,
})
export class StandardQrSrcDirective implements OnChanges {
  @Input({ required: true }) appStandardQr = '';
  @Input() standardQrSize = 150;

  private readonly element = inject<ElementRef<HTMLImageElement>>(ElementRef);
  private renderVersion = 0;

  ngOnChanges(): void {
    void this.render();
  }

  private async render(): Promise<void> {
    const version = ++this.renderVersion;
    const id = this.appStandardQr.trim();
    if (!id) {
      this.element.nativeElement.removeAttribute('src');
      return;
    }

    try {
      const src = await createStandardQrDataUrl(window.location.origin, id, this.standardQrSize);
      if (version === this.renderVersion) {
        this.element.nativeElement.src = src;
      }
    } catch (error) {
      if (version === this.renderVersion) {
        this.element.nativeElement.removeAttribute('src');
      }
      console.error('[Standards] Failed to render local QR code:', error);
    }
  }
}
