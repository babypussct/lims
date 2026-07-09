import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-result-prefix-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './result-prefix-tabs.component.html'
})
export class ResultPrefixTabsComponent {
  /** Danh sách tiền tố phát hiện được trong mẻ (không bao gồm 'ALL') */
  @Input() prefixes: string[] = [];
  /** Bộ lọc đang hoạt động: 'ALL' hoặc một tiền tố cụ thể */
  @Input() activeFilter: string = 'ALL';

  /** Phát ra giá trị bộ lọc mới khi người dùng click tab */
  @Output() filterChange = new EventEmitter<string>();
}
