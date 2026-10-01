import { CommonModule } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TimelineItem } from './timeline.model';

@Component({
  selector: 'app-ui-timeline',
  standalone: true,
  imports: [CommonModule, RouterLink],
  host: {
    class: 'block min-w-0',
  },
  template: `
    <ol class="soft-ui-timeline" role="list" [attr.aria-label]="ariaLabel()">
      @for (item of items(); track item.id; let last = $last) {
        <li
          class="soft-ui-timeline__item"
          [class.soft-ui-timeline__item--avatar]="hasAvatar(item)"
          role="listitem"
          [attr.data-current]="item.isCurrent ? 'true' : null"
          [attr.aria-current]="item.isCurrent ? 'step' : null">
          <div class="soft-ui-timeline__rail" aria-hidden="true">
            <span
              class="soft-ui-timeline__node"
              [class.soft-ui-timeline__node--avatar]="hasAvatar(item)"
              [attr.data-status]="item.status"
              [attr.data-current]="item.isCurrent ? 'true' : null">
              @if (hasAvatar(item)) {
                @if (item.actorAvatarUrl && !failedAvatars().has(item.actorAvatarUrl)) {
                  <img [src]="item.actorAvatarUrl" alt="" class="soft-ui-timeline__avatar" (error)="avatarFailed(item.actorAvatarUrl)" />
                } @else {
                  <span class="soft-ui-timeline__initials">{{ initials(item) }}</span>
                }
                <span class="soft-ui-timeline__badge"><i class="fa-solid {{ item.icon }}" aria-hidden="true"></i></span>
              } @else {
                <i class="fa-solid {{ item.icon }}" aria-hidden="true"></i>
              }
            </span>
            @if (!last) {
              <span class="soft-ui-timeline__line"></span>
            }
          </div>

          <article class="min-w-0 pb-6 sm:pb-7">
            <div class="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <div class="min-w-0">
                @if (hasAvatar(item)) {
                  <p class="mb-1 break-words text-sm font-extrabold text-slate-800 dark:text-slate-100">{{ actorName(item) }}</p>
                }
                <h4 class="break-words text-sm font-extrabold leading-snug text-slate-800 dark:text-slate-100">
                  {{ item.title }}
                </h4>
                @if (item.pills?.length) {
                  <div class="mt-1.5 flex flex-wrap gap-1.5">
                    @for (pill of item.pills; track $index) {
                      <span class="soft-ui-timeline__pill" [attr.data-variant]="pill.variant || 'neutral'">
                        @if (pill.prefix) { <span>{{ pill.prefix }}</span> }
                        <span class="font-mono font-bold">{{ pill.label }}</span>
                      </span>
                    }
                  </div>
                }
                <div class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  @if (!hasAvatar(item)) {
                  <span class="inline-flex items-center gap-1.5">
                    <i class="fa-solid fa-user-shield text-[9px] text-slate-400" aria-hidden="true"></i>
                    {{ actorName(item) }}
                  </span>
                  }
                  @if (item.actorRole) {
                    @if (!hasAvatar(item)) {
                    <span class="text-slate-300 dark:text-slate-600" aria-hidden="true">•</span>
                    }
                    <span>{{ item.actorRole }}</span>
                  }
                </div>
              </div>

              @if (formatTimestamp(item.timestamp); as formattedTimestamp) {
                <time class="shrink-0 text-xs font-semibold tabular-nums text-slate-500 dark:text-slate-400">
                  {{ formattedTimestamp }}
                </time>
              }
            </div>

            @if (item.actorSubtext) {
              <p class="mt-1.5 break-words text-xs text-slate-500 dark:text-slate-400">{{ item.actorSubtext }}</p>
            }

            @if (item.description) {
              <p class="mt-2 break-words text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {{ item.description }}
              </p>
            }

            @if (item.metadata?.length) {
              <div class="mt-2.5 flex min-w-0 flex-wrap gap-1.5" aria-label="Metadata sự kiện">
                @for (meta of item.metadata; track meta.label + meta.value) {
                  @if (meta.routerLink) {
                    <a [routerLink]="meta.routerLink" [title]="meta.actionTitle || 'Mở hồ sơ ' + meta.value"
                       class="inline-flex min-h-9 max-w-full items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs text-sky-800 hover:bg-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-200">
                      <span class="font-bold">{{ meta.label }}</span>
                      <span class="min-w-0 break-all font-semibold">{{ meta.value }}</span>
                      <i class="fa-solid fa-arrow-up-right-from-square shrink-0 text-[10px]" aria-hidden="true"></i>
                    </a>
                  } @else {
                  <span class="inline-flex max-w-full items-center gap-1 rounded-lg border border-slate-200/80 bg-white/80 px-2 py-1 text-[10px] text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-400">
                    <span class="font-bold text-slate-400 dark:text-slate-500">{{ meta.label }}</span>
                    <span class="min-w-0 break-all font-semibold text-slate-700 dark:text-slate-200">{{ meta.value }}</span>
                  </span>
                  }
                }
              </div>
            }

            @if (item.action; as action) {
              <div class="mt-3">
                @if (action.routerLink) {
                  <a
                    [routerLink]="action.routerLink"
                    class="inline-flex min-h-8 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-[var(--soft-ui-accent-strong)] transition hover:bg-[var(--soft-ui-nav-item-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/40">
                    @if (action.icon) {
                      <i class="fa-solid {{ action.icon }} text-[10px]" aria-hidden="true"></i>
                    }
                    {{ action.label }}
                  </a>
                } @else if (action.href) {
                  <a
                    [href]="action.href"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex min-h-8 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-[var(--soft-ui-accent-strong)] transition hover:bg-[var(--soft-ui-nav-item-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/40">
                    @if (action.icon) {
                      <i class="fa-solid {{ action.icon }} text-[10px]" aria-hidden="true"></i>
                    }
                    {{ action.label }}
                  </a>
                } @else if (action.callback) {
                  <button
                    type="button"
                    (click)="runAction(item)"
                    class="inline-flex min-h-8 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-[var(--soft-ui-accent-strong)] transition hover:bg-[var(--soft-ui-nav-item-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/40">
                    @if (action.icon) {
                      <i class="fa-solid {{ action.icon }} text-[10px]" aria-hidden="true"></i>
                    }
                    {{ action.label }}
                  </button>
                }
              </div>
            }
          </article>
        </li>
      } @empty {
        <li class="rounded-xl border border-dashed border-slate-200 px-4 py-5 text-center text-xs text-slate-400 dark:border-slate-700 dark:text-slate-500">
          Chưa có sự kiện để hiển thị.
        </li>
      }
    </ol>
  `,
})
export class AppUiTimelineComponent {
  items = input<TimelineItem[]>([]);
  ariaLabel = input('Dòng thời gian sự kiện');
  failedAvatars = signal(new Set<string>());

  hasAvatar(item: TimelineItem): boolean {
    return !!(item.actorAvatarUrl || item.actorFallbackInitials);
  }

  initials(item: TimelineItem): string {
    return item.actorFallbackInitials || this.actorName(item).split(/\s+/).slice(-2).map(part => part[0]).join('').toLocaleUpperCase('vi-VN');
  }

  avatarFailed(url: string): void {
    this.failedAvatars.update(failed => new Set([...failed, url]));
  }

  actorName(item: TimelineItem): string {
    const actor = item.actorName?.trim();
    return actor && !/^unknown$/i.test(actor) && !/^system$/i.test(actor) ? actor : 'Hệ thống LIMS';
  }

  formatTimestamp(value: TimelineItem['timestamp']): string {
    const date = this.toDate(value);
    if (!date) return '';
    return new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour12: false,
    }).format(date);
  }

  runAction(item: TimelineItem): void {
    item.action?.callback?.();
  }

  private toDate(value: TimelineItem['timestamp']): Date | null {
    if (value === null || value === undefined || value === '') return null;
    if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
    if (typeof value === 'object' && typeof value.toDate === 'function') {
      const date = value.toDate();
      return date instanceof Date && !Number.isNaN(date.getTime()) ? date : null;
    }
    const date = new Date(value as string | number);
    return Number.isNaN(date.getTime()) ? null : date;
  }
}
