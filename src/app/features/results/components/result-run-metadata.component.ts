import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-result-run-metadata',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './result-run-metadata.component.html'
})
export class ResultRunMetadataComponent {
  @Input() run: any = null;
  @Input() isExpanded: boolean = false;
  @Input() displayDevice: string = '';
  @Input() formatSampleListFn!: (list: string[]) => string;
  @Input() formatAnalysisDateFn!: (date: string) => string;

  @Output() toggleExpand = new EventEmitter<void>();
}
