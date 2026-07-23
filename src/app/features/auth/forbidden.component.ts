import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <div class="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 text-center border border-slate-100 dark:border-slate-700 animate-fade-in">
        <div class="w-20 h-20 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-amber-200 dark:border-amber-800/50 shadow-inner">
          <i class="fa-solid fa-lock text-3xl"></i>
        </div>
        <h1 class="text-2xl font-black text-slate-800 dark:text-slate-100 mb-1">Chưa có quyền truy cập</h1>

        @if (fromUrl()) {
          <p class="text-xs text-slate-400 dark:text-slate-500 mb-3">
            Trang <code class="bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded font-mono font-bold text-slate-600 dark:text-slate-400">{{fromUrl()}}</code> yêu cầu:
          </p>
        } @else {
          <p class="text-slate-500 dark:text-slate-400 mb-4 text-xs">
            Bạn không có đủ quyền hạn để xem nội dung hoặc thực hiện thao tác trên trang này.
          </p>
        }

        @if (requiredPermission()) {
          <div class="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 px-4 py-2 rounded-xl mb-6 shadow-sm">
            <i class="fa-solid fa-key text-amber-500 text-sm"></i>
            <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">Quyền:</span>
            <code class="font-mono font-extrabold text-xs text-amber-700 dark:text-amber-400">{{requiredPermission()}}</code>
          </div>
        }

        <p class="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
          Vui lòng liên hệ Quản trị viên (Admin) nếu bạn cần cấp bổ sung quyền truy cập cho tính năng này.
        </p>

        <div class="flex flex-col gap-2.5">
          <button (click)="goBack()" class="w-full py-3 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white font-bold text-xs rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2">
            <i class="fa-solid fa-arrow-left"></i> Quay lại trang trước
          </button>
          <a routerLink="/dashboard" class="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2">
            <i class="fa-solid fa-house"></i> Về Trang chủ
          </a>
        </div>
      </div>
    </div>
  `
})
export class ForbiddenComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  requiredPermission = signal<string>('');
  fromUrl = signal<string>('');

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['required']) this.requiredPermission.set(params['required']);
      if (params['from']) this.fromUrl.set(params['from']);
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
