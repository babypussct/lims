import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-host',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed z-[210] flex flex-col-reverse items-stretch gap-2.5 no-print pointer-events-none
                left-1/2 -translate-x-1/2 bottom-[calc(5.75rem+env(safe-area-inset-bottom))] w-full max-w-sm px-4
                md:left-auto md:right-4 md:translate-x-0 md:top-4 md:bottom-auto md:w-[380px] md:px-0"
         aria-live="polite" aria-atomic="false">
      @for (t of toast.toasts(); track t.id) {
        <div class="toast-card pointer-events-auto relative overflow-hidden flex flex-col gap-2.5 px-4 py-3.5 rounded-2xl shadow-xl backdrop-blur-xl border border-l-4 animate-slide-up touch-pan-y"
             [attr.role]="t.type === 'error' ? 'alert' : 'status'"
             [attr.aria-live]="t.type === 'error' ? 'assertive' : 'polite'"
             (mouseenter)="toast.pause(t.id)" (mouseleave)="toast.resume(t.id)"
             (focusin)="toast.pause(t.id)" (focusout)="toast.resume(t.id)"
             (pointerdown)="onPointerDown($event)" (pointerup)="onPointerUp(t.id, $event)"
             [ngClass]="cardClass(t.type)">
          <div class="flex items-center gap-4">
            <div class="shrink-0 text-xl">
              @if (t.type === 'success') { <i class="fa-solid fa-circle-check text-emerald-500"></i> }
              @else if (t.type === 'error') { <i class="fa-solid fa-circle-xmark text-red-500"></i> }
              @else if (t.type === 'warning') { <i class="fa-solid fa-circle-exclamation text-amber-500"></i> }
              @else { <i class="fa-solid fa-circle-info text-blue-500"></i> }
            </div>
            <div class="flex-1 min-w-0 text-slate-800 dark:text-slate-100">
              <div class="text-xs font-bold uppercase opacity-60 tracking-wider flex items-center gap-1.5">
                {{ t.title || defaultTitle(t.type) }}
                @if ((t.count || 1) > 1) {
                  <span class="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full text-[10px] font-extrabold bg-current/15 text-current opacity-100">
                    ×{{ t.count }}
                  </span>
                }
              </div>
              <div class="text-sm font-semibold leading-snug break-words"
                   [class.line-clamp-3]="!isExpanded(t.id)">{{ t.message }}</div>
              @if (t.message.length > 160) {
                <button (click)="toggleExpanded(t.id, $event)" class="mt-1 text-[11px] font-bold opacity-70 hover:opacity-100">
                  {{ isExpanded(t.id) ? 'Thu gọn' : 'Xem thêm' }}
                </button>
              }
            </div>
            <button (click)="toast.remove(t.id)" class="shrink-0 w-10 h-10 -mr-2 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-black/5 dark:hover:text-slate-200 dark:hover:bg-white/10 transition active:scale-90" aria-label="Đóng thông báo">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          @if (t.action) {
            <button (click)="toast.runAction(t)"
                    class="w-full min-h-10 px-4 py-2 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 active:scale-95"
                    [ngClass]="actionClass(t.type)">
              {{ t.actionLabel || 'Xem chi tiết' }}
            </button>
          }
          @if (!t.persistent && t.durationMs) {
            <span class="toast-progress absolute bottom-0 left-0 h-0.5 opacity-60"
                  [ngClass]="progressClass(t.type)"
                  [style.animation-duration.ms]="t.durationMs"
                  [style.animation-play-state]="t.paused ? 'paused' : 'running'"></span>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-card { will-change: transform, opacity; }
    .toast-progress {
      width: 100%;
      transform-origin: left;
      animation-name: toastCountdown;
      animation-timing-function: linear;
      animation-fill-mode: forwards;
    }
    @keyframes toastCountdown {
      from { transform: scaleX(1); }
      to { transform: scaleX(0); }
    }
    @media (prefers-reduced-motion: reduce) {
      .toast-progress { animation: none; }
      .toast-card { animation: none; }
    }
  `]
})
export class ToastHostComponent {
  readonly toast = inject(ToastService);
  private pointerStartX = 0;
  private readonly expandedIds = new Set<string>();

  defaultTitle(type: string): string {
    if (type === 'success') return 'Thành công';
    if (type === 'error') return 'Lỗi';
    if (type === 'warning') return 'Cảnh báo';
    return 'Thông báo';
  }

  cardClass(type: string): string {
    const classes: Record<string, string> = {
      success: 'bg-emerald-50/95 dark:bg-emerald-950/95 border-emerald-200 dark:border-emerald-800 border-l-emerald-500',
      error: 'bg-red-50/95 dark:bg-red-950/95 border-red-200 dark:border-red-800 border-l-red-500',
      warning: 'bg-amber-50/95 dark:bg-amber-950/95 border-amber-200 dark:border-amber-800 border-l-amber-500',
      info: 'bg-blue-50/95 dark:bg-slate-900/95 border-blue-200 dark:border-blue-800 border-l-blue-500'
    };
    return classes[type] || classes['info'];
  }

  actionClass(type: string): string {
    const classes: Record<string, string> = {
      success: 'bg-emerald-600 hover:bg-emerald-700',
      error: 'bg-red-600 hover:bg-red-700',
      warning: 'bg-amber-600 hover:bg-amber-700',
      info: 'bg-blue-600 hover:bg-blue-700'
    };
    return classes[type] || classes['info'];
  }

  progressClass(type: string): string {
    const classes: Record<string, string> = {
      success: 'bg-emerald-500', error: 'bg-red-500', warning: 'bg-amber-500', info: 'bg-blue-500'
    };
    return classes[type] || classes['info'];
  }

  isExpanded(id: string): boolean { return this.expandedIds.has(id); }

  toggleExpanded(id: string, event: Event) {
    event.stopPropagation();
    this.expandedIds.has(id) ? this.expandedIds.delete(id) : this.expandedIds.add(id);
  }

  onPointerDown(event: PointerEvent) { this.pointerStartX = event.clientX; }

  onPointerUp(id: string, event: PointerEvent) {
    if (Math.abs(event.clientX - this.pointerStartX) > 70) this.toast.remove(id);
    this.pointerStartX = 0;
  }
}
