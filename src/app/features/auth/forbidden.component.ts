import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <div class="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl shadow-soft-xl p-8 text-center border border-slate-100 dark:border-slate-700">
        <div class="w-24 h-24 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <i class="fa-solid fa-lock text-4xl"></i>
        </div>
        <h1 class="text-3xl font-black text-slate-800 dark:text-slate-100 mb-2">403</h1>
        <h2 class="text-xl font-bold text-slate-700 dark:text-slate-200 mb-4">Không có quyền truy cập</h2>
        <p class="text-slate-500 dark:text-slate-400 mb-8 text-sm leading-relaxed">
          Bạn không có đủ quyền hạn để xem nội dung hoặc thực hiện thao tác trên trang này. Vui lòng liên hệ Quản trị viên nếu bạn cho rằng đây là sự nhầm lẫn.
        </p>
        <a routerLink="/dashboard" class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 dark:bg-slate-700 text-white font-bold rounded-xl hover:bg-black dark:hover:bg-slate-600 transition-all active:scale-95">
          <i class="fa-solid fa-arrow-left"></i> Về Trang chủ
        </a>
      </div>
    </div>
  `
})
export class ForbiddenComponent {}
