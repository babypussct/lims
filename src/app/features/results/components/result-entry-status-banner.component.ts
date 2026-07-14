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
  @Input() lockedByOthers = false;
  @Input() lockerName = '';
  @Input() lockedAt = '';
  @Input() lastActiveAt = '';

  /** Mẻ đã hoàn thành & bị khóa */
  @Input() isCompleted = false;
  @Input() sampleTotal = 0;
  @Input() completedBy = '';
  @Input() completedAt = '';

  @Output() takeOverLock = new EventEmitter<void>();
  @Output() unlockToEdit = new EventEmitter<void>();
}
