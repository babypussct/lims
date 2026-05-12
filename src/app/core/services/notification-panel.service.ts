import { Injectable, signal } from '@angular/core';

/**
 * Service đơn giản quản lý trạng thái mở/đóng của Notification Panel.
 * Được inject ở root → bất kỳ component nào cũng có thể toggle panel
 * mà không cần quan tâm đến vị trí DOM hay stacking context.
 */
@Injectable({ providedIn: 'root' })
export class NotificationPanelService {
  readonly isOpen = signal(false);

  open()   { this.isOpen.set(true);  }
  close()  { this.isOpen.set(false); }
  toggle() { this.isOpen.update(v => !v); }
}
