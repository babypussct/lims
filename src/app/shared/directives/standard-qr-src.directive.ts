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
    const id = this.appStandardQr;
    this.element.nativeElement.dataset['printAsset'] = 'pending';
    if (!id.trim()) {
      this.element.nativeElement.removeAttribute('src');
      this.element.nativeElement.dataset['printAsset'] = 'failed';
      this.element.nativeElement.dispatchEvent(new Event('print-asset-ready'));
      return;
    }

    try {
      const src = await createStandardQrDataUrl(window.location.origin, id, this.standardQrSize);
      if (version === this.renderVersion) {
        this.element.nativeElement.src = src;
        this.element.nativeElement.dataset['printAsset'] = 'ready';
        this.element.nativeElement.dispatchEvent(new Event('print-asset-ready'));
      }
    } catch (error) {
      if (version === this.renderVersion) {
        this.element.nativeElement.removeAttribute('src');
        this.element.nativeElement.dataset['printAsset'] = 'failed';
        this.element.nativeElement.dispatchEvent(new Event('print-asset-ready'));
      }
      console.error('[Standards] Failed to render local QR code:', error);
    }
  }
}
