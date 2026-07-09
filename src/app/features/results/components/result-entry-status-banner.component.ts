import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-result-entry-status-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './result-entry-status-banner.component.html'
})
export class ResultEntryStatusBannerComponent {
  /** Mẻ đang bị người khác lock */
  @Input() lockedByOthers: boolean = false;
  @Input() lockerName: string = '';
  @Input() lockedAt: string = '';
  @Input() lastActiveAt: string = '';

  /** Mẻ đã hoàn thành & bị khóa */
  @Input() isCompleted: boolean = false;
  @Input() sampleTotal: number = 0;
  @Input() completedBy: string = '';
  @Input() completedAt: string = '';

  @Output() takeOverLock = new EventEmitter<void>();
  @Output() unlockToEdit = new EventEmitter<void>();
}
