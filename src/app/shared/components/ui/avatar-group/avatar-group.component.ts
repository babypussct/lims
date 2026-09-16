import { Component, computed, input } from '@angular/core';
import { AvatarGroupItem } from './avatar-group.model';

@Component({
  selector: 'app-ui-avatar-group',
  standalone: true,
  host: {
    class: 'inline-flex min-w-0',
  },
  template: `
    <div class="flex -space-x-2" role="list" [attr.aria-label]="ariaLabel()">
      @for (item of visibleItems(); track item.id) {
        <span
          role="listitem"
          class="soft-ui-avatar-group__item"
          [class.soft-ui-avatar-group__item--md]="size() === 'md'"
          [attr.title]="item.subtitle ? item.name + ' · ' + item.subtitle : item.name"
          [attr.aria-label]="item.subtitle ? item.name + ', ' + item.subtitle : item.name">
          @if (item.imageUrl) {
            <img [src]="item.imageUrl" [alt]="item.name" class="h-full w-full rounded-full object-cover" />
          } @else {
            <span class="text-[9px] font-black uppercase" aria-hidden="true">{{ initials(item.name) }}</span>
          }
        </span>
      }
      @if (hiddenCount() > 0) {
        <span
          role="listitem"
          class="soft-ui-avatar-group__item soft-ui-avatar-group__more"
          [class.soft-ui-avatar-group__item--md]="size() === 'md'"
          [attr.aria-label]="'Còn ' + hiddenCount() + ' người'"
          [title]="'Còn ' + hiddenCount() + ' người'">
          +{{ hiddenCount() }}
        </span>
      }
    </div>
  `,
})
export class AppUiAvatarGroupComponent {
  items = input<AvatarGroupItem[]>([]);
  maxVisible = input(5);
  size = input<'sm' | 'md'>('sm');
  ariaLabel = input('Danh sách người tham gia');

  private visibleLimit = computed(() => Math.max(1, Math.floor(Number(this.maxVisible()) || 1)));
  visibleItems = computed(() => this.items().slice(0, this.visibleLimit()));
  hiddenCount = computed(() => Math.max(0, this.items().length - this.visibleLimit()));

  initials(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
    return parts.slice(-2).map(part => part.charAt(0)).join('').toLocaleUpperCase('vi-VN');
  }
}
