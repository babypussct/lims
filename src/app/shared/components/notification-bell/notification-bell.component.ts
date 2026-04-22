import { Component, inject, signal, computed, HostListener, effect, ElementRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';
import { AppNotification } from '../../../core/models/notification.model';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative inline-block text-left" (click)="$event.stopPropagation()">
      <!-- Bell Button -->
      @if (!asBadge) {
          <button 
            (click)="toggleMenu()"
            class="relative w-10 h-10 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-800 shadow-md border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors active:scale-95 group">
            
            <i class="fa-solid fa-bell text-slate-600 dark:text-slate-300 text-[18px] transition-transform" 
               [class.fa-shake]="unreadCount() > 0 && isOpen()"></i>
            
            <!-- Unread Badge -->
            @if (unreadCount() > 0) {
                <span class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-white text-[9px] font-bold items-center justify-center border-2 border-white dark:border-slate-800">
                    {{unreadCount() > 9 ? '9+' : unreadCount()}}
                  </span>
                </span>
            }
          </button>
      } @else {
          <!-- As Badge on Avatar -->
          <button 
            (click)="toggleMenu()"
            class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white dark:border-slate-900 shadow-sm transition-transform hover:scale-110 active:scale-95 z-10"
            [ngClass]="unreadCount() > 0 ? 'bg-red-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'">
            
            @if (unreadCount() > 0) {
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-full w-full bg-red-500 text-white text-[9px] font-bold items-center justify-center">
                  {{unreadCount() > 9 ? '9+' : unreadCount()}}
                </span>
            } @else {
                <i class="fa-solid fa-bell text-[9px]"></i>
            }
          </button>
      }

      <!-- Dropdown Menu -->
      @if (isOpen()) {
         <div class="absolute right-0 w-80 md:w-96 bg-white dark:bg-slate-800 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 dark:border-slate-700 overflow-hidden origin-bottom-left fade-in-scale z-[100] flex flex-col max-h-[85vh]"
              [ngClass]="asBadge ? 'bottom-full mb-3 left-0 right-auto origin-bottom-left' : 'mt-3 origin-top-right'">
            
            <!-- Header -->
            <div class="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
                <h3 class="font-bold text-slate-800 dark:text-slate-100 text-base">Thông báo</h3>
                @if (unreadCount() > 0) {
                    <button (click)="markAllAsRead($event)" class="text-xs font-semibold text-fuchsia-600 dark:text-fuchsia-400 hover:text-fuchsia-700 dark:hover:text-fuchsia-300 transition-colors">Đánh dấu đã đọc tất cả</button>
                }
            </div>

            <!-- List -->
            <div class="overflow-y-auto custom-scrollbar flex-1 pb-2">
                @if (notifications().length === 0) {
                   <div class="py-10 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 gap-3">
                       <i class="fa-regular fa-bell-slash text-4xl opacity-50"></i>
                       <span class="text-sm font-medium">Không có thông báo nào</span>
                   </div>
                } @else {
                   <div class="flex flex-col">
                       @for (n of notifications(); track n.id) {
                           <div (click)="onNotificationClick(n)" 
                                class="px-4 py-3 border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors relative group"
                                [ngClass]="{'bg-blue-50 dark:bg-blue-900/10': !n.isRead}">
                                
                                <!-- Unread dot -->
                                @if (!n.isRead) {
                                   <div class="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                }

                                <div class="flex gap-3 items-start ml-2">
                                    <div class="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                                         [ngClass]="getIconClass(n.type)">
                                        <i class="fa-solid" [ngClass]="getIcon(n.type)"></i>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <div class="flex justify-between items-start gap-2 mb-1">
                                            <h4 class="font-bold text-sm text-slate-800 dark:text-slate-200 truncate">{{n.title}}</h4>
                                            <span class="text-[10px] whitespace-nowrap text-slate-400 font-medium shrink-0 pt-0.5">{{getTimeAgo(n.createdAt)}}</span>
                                        </div>
                                        <p class="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">{{n.message}}</p>
                                    </div>
                                </div>
                                
                                <!-- Delete Button (Shows on hover) -->
                                <button (click)="deleteNotification(n, $event)" 
                                        class="absolute top-1/2 -translate-y-1/2 right-2 w-8 h-8 rounded-full bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex hover:bg-red-200">
                                        <i class="fa-solid fa-trash-can text-[10px]"></i>
                                </button>
                           </div>
                       }
                   </div>
                }
            </div>

         </div>
      }
    </div>
  `,
  styles: [`
    .fade-in-scale {
        animation: fadeInScale 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes fadeInScale {
        0% { opacity: 0; transform: scale(0.95) translateY(-5px); }
        100% { opacity: 1; transform: scale(1) translateY(0); }
    }
  `]
})
export class NotificationBellComponent {
  @Input() asBadge = false;

  notificationService = inject(NotificationService);
  router = inject(Router);
  elRef = inject(ElementRef);

  isOpen = signal(false);

  notifications = this.notificationService.notifications;
  unreadCount = this.notificationService.unreadCount;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
      if (this.isOpen() && !this.elRef.nativeElement.contains(event.target)) {
          this.isOpen.set(false);
      }
  }

  toggleMenu() {
      this.isOpen.set(!this.isOpen());
  }

  async markAllAsRead(event: Event) {
      event.stopPropagation();
      await this.notificationService.markAllAsRead();
  }

  async deleteNotification(n: AppNotification, event: Event) {
      event.stopPropagation();
      if (n.id) {
          await this.notificationService.deleteNotification(n.id);
      }
  }

  async onNotificationClick(n: AppNotification) {
      if (!n.isRead && n.id) {
          this.notificationService.markAsRead(n.id);
      }
      this.isOpen.set(false);

      if (n.actionUrl) {
          this.router.navigateByUrl(n.actionUrl);
          // If the user is an admin and views a CoA request, we should ideally trigger the quick upload drive modal.
          // Since it's attached to standard-detail, they can do it there.
      }
  }

  getIconClass(type: string): string {
      switch (type) {
          case 'COA_REQUEST': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
          case 'BORROW_REQUEST': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
          case 'REQUEST_APPROVED': return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400';
          case 'REQUEST_REJECTED': return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
          case 'STOCK_LOW_ALERT': return 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400';
          default: return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
      }
  }

  getIcon(type: string): string {
      switch (type) {
          case 'COA_REQUEST': return 'fa-file-signature';
          case 'BORROW_REQUEST': return 'fa-hand-holding-hand';
          case 'REQUEST_APPROVED': return 'fa-circle-check';
          case 'REQUEST_REJECTED': return 'fa-circle-xmark';
          case 'STOCK_LOW_ALERT': return 'fa-triangle-exclamation';
          default: return 'fa-bell';
      }
  }

  getTimeAgo(timestamp: number): string {
      if (!timestamp) return '';
      const min = Math.floor((Date.now() - timestamp) / 60000);
      if (min < 1) return 'Vừa xong';
      if (min < 60) return `${min} phút trước`;
      const hrs = Math.floor(min / 60);
      if (hrs < 24) return `${hrs} giờ trước`;
      const days = Math.floor(hrs / 24);
      return `${days} ngày trước`;
  }
}
