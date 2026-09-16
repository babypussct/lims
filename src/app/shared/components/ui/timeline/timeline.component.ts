import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
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
          role="listitem"
          [attr.data-current]="item.isCurrent ? 'true' : null"
          [attr.aria-current]="item.isCurrent ? 'step' : null">
          <div class="soft-ui-timeline__rail" aria-hidden="true">
            <span
              class="soft-ui-timeline__node"
              [attr.data-status]="item.status"
              [attr.data-current]="item.isCurrent ? 'true' : null">
              <i class="fa-solid {{ item.icon }}" aria-hidden="true"></i>
            </span>
            @if (!last) {
              <span class="soft-ui-timeline__line"></span>
            }
          </div>

          <article class="min-w-0 pb-6 sm:pb-7">
            <div class="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <div class="min-w-0">
                <h4 class="break-words text-sm font-extrabold leading-snug text-slate-800 dark:text-slate-100">
                  {{ item.title }}
                </h4>
                <div class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <span class="inline-flex items-center gap-1.5">
                    <i class="fa-solid fa-user-shield text-[9px] text-slate-400" aria-hidden="true"></i>
                    {{ actorName(item) }}
                  </span>
                  @if (item.actorRole) {
                    <span class="text-slate-300 dark:text-slate-600" aria-hidden="true">•</span>
                    <span>{{ item.actorRole }}</span>
                  }
                </div>
              </div>

              @if (formatTimestamp(item.timestamp); as formattedTimestamp) {
                <time class="shrink-0 text-[10px] font-bold tabular-nums text-slate-400 dark:text-slate-500">
                  {{ formattedTimestamp }}
                </time>
              }
            </div>

            @if (item.description) {
              <p class="mt-2 break-words text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {{ item.description }}
              </p>
            }

            @if (item.metadata?.length) {
              <div class="mt-2.5 flex min-w-0 flex-wrap gap-1.5" aria-label="Metadata sự kiện">
                @for (meta of item.metadata; track meta.label + meta.value) {
                  <span class="inline-flex max-w-full items-center gap-1 rounded-lg border border-slate-200/80 bg-white/80 px-2 py-1 text-[10px] text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-400">
                    <span class="font-bold text-slate-400 dark:text-slate-500">{{ meta.label }}</span>
                    <span class="min-w-0 break-all font-semibold text-slate-700 dark:text-slate-200">{{ meta.value }}</span>
                  </span>
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
