import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AppButtonComponent } from '../../shared/components/ui/button/button.component';
import { AppPageHeaderComponent } from '../../shared/components/ui/page-header/page-header.component';

@Component({
  selector: 'app-terms-of-service',
  standalone: true,
  imports: [CommonModule, AppButtonComponent, AppPageHeaderComponent],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div class="max-w-4xl mx-auto">
        <app-page-header
          class="mb-8 block overflow-hidden rounded-2xl border border-slate-200 shadow-sm dark:border-slate-700"
          title="Điều khoản dịch vụ"
          subtitle="LIMS Cloud · Cổng thông tin công khai"
          icon="fa-file-contract">
          <app-button pageHeaderActions variant="secondary" size="sm" (click)="goBack()">
            <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Quay lại
          </app-button>
        </app-page-header>

        <!-- Terms Card -->
        <div class="bg-white dark:bg-slate-800 shadow-soft-xl border border-slate-100 dark:border-slate-700/50 rounded-2xl p-6 sm:p-10 transition-all duration-300">
          <div class="border-b border-slate-100 dark:border-slate-700/80 pb-6 mb-8">
            <h2 class="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Điều khoản dịch vụ</h2>
            <div class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-semibold">
              <i class="fa-regular fa-clock"></i>
              <span>Cập nhật lần cuối: 13/07/2026</span>
            </div>
          </div>

          <div class="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 space-y-6 text-sm sm:text-base leading-relaxed">
            <p>
              Chào mừng bạn đến sử dụng <strong>NAFIQPM6 LIMS Cloud</strong>. Bằng việc đăng nhập và truy cập vào dịch vụ của chúng tôi, bạn đồng ý tuân thủ các điều khoản dịch vụ dưới đây. Vui lòng đọc kỹ các thông tin này trước khi bắt đầu sử dụng.
            </p>

            <!-- Section 1 -->
            <div class="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 my-6">
              <h3 class="text-lg font-extrabold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <i class="fa-solid fa-check text-blue-600"></i> 1. Chấp Thuận Điều Khoản
              </h3>
              <p class="m-0">
                Việc truy cập, đăng ký tài khoản hoặc sử dụng bất kỳ tính năng nào của hệ thống LIMS Cloud đồng nghĩa với việc bạn đồng ý với các điều khoản này. Nếu bạn không đồng ý với bất kỳ phần nào, vui lòng ngừng sử dụng dịch vụ và ngắt kết nối tài khoản của mình.
              </p>
            </div>

            <!-- Section 2 -->
            <div class="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 my-6">
              <h3 class="text-lg font-extrabold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <i class="fa-solid fa-user-shield text-blue-600"></i> 2. Đăng Nhập và Bảo Mật Tài Khoản
              </h3>
              <ul class="list-disc pl-5 space-y-2 m-0">
                <li>Người dùng có thể đăng nhập bằng Google hoặc Gmail/email và mật khẩu LIMS đã liên kết trong Firebase Authentication.</li>
                <li>Bạn chịu trách nhiệm bảo mật thông tin đăng nhập tài khoản Google của mình và không cho phép bên thứ ba truy cập trái phép vào tài khoản của bạn để thao tác trên hệ thống LIMS.</li>
                <li>Mọi hoạt động được thực hiện dưới tài khoản đã đăng nhập của bạn sẽ được ghi nhận là hoạt động hợp pháp của chính bạn.</li>
              </ul>
            </div>

            <!-- Section 3 -->
            <div class="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 my-6">
              <h3 class="text-lg font-extrabold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <i class="fa-solid fa-cloud-arrow-up text-blue-600"></i> 3. Sử Dụng Dịch Vụ Liên Kết Google Drive
              </h3>
              <p class="mb-2">
                Khi bạn kích hoạt tính năng tích hợp Google Drive:
              </p>
              <ul class="list-disc pl-5 space-y-2 m-0">
                <li>Ứng dụng chỉ được cấp quyền truy cập hạn chế phạm vi <code class="bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded font-mono font-bold border border-blue-200 dark:border-blue-800">drive.file</code> (chỉ đối với các tệp tin do ứng dụng tạo ra).</li>
                <li>Bạn đồng ý rằng các tệp báo cáo phân tích, tài liệu nội bộ sẽ được lưu trữ trực tiếp vào thư mục lưu trữ dùng chung của phòng thí nghiệm được phân quyền.</li>
                <li>Bạn có toàn quyền xóa, di chuyển hoặc thu hồi quyền truy cập này bất cứ lúc nào thông qua trang quản lý tài khoản Google.</li>
              </ul>
            </div>

            <!-- Section 4 -->
            <div class="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 my-6">
              <h3 class="text-lg font-extrabold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <i class="fa-solid fa-ban text-blue-600"></i> 4. Các Hành Vi Bị Cấm
              </h3>
              <p class="mb-2">Khi sử dụng hệ thống LIMS Cloud, bạn cam kết KHÔNG thực hiện các hành vi sau:</p>
              <ul class="list-disc pl-5 space-y-2 m-0">
                <li>Tải lên hệ thống hoặc liên kết Drive các tệp tin chứa virus, mã độc hoặc phần mềm độc hại gây ảnh hưởng đến hệ thống.</li>
                <li>Cố gắng truy cập trái phép hoặc phá hoại cơ sở dữ liệu của phòng thí nghiệm hoặc của người dùng khác.</li>
                <li>Sử dụng thông tin và biểu mẫu của hệ thống vào các mục đích phi pháp hoặc trái với quy định bảo mật của phòng thí nghiệm.</li>
              </ul>
            </div>

            <!-- Section 5 -->
            <div class="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 my-6">
              <h3 class="text-lg font-extrabold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <i class="fa-solid fa-triangle-exclamation text-blue-600"></i> 5. Giới Hạn Trách Nhiệm Pháp Lý
              </h3>
              <p class="mb-2">
                Ứng dụng cung cấp công cụ lưu trữ dữ liệu thông qua bên thứ ba (Google Drive API). Chúng tôi không chịu trách nhiệm trong trường hợp:
              </p>
              <ul class="list-disc pl-5 space-y-2 m-0">
                <li>Người dùng tự ý xóa hoặc thay đổi tệp tin trên Google Drive dẫn đến mất mát hoặc hỏng dữ liệu trong hệ thống LIMS.</li>
                <li>Sự cố kết nối hoặc gián đoạn dịch vụ từ phía nhà cung cấp dịch vụ máy chủ đám mây của Google nằm ngoài tầm kiểm soát của chúng tôi.</li>
              </ul>
            </div>

            <!-- Section 6 -->
            <div class="border-t border-slate-200 dark:border-slate-700/80 pt-6 mt-8">
              <h3 class="text-lg font-extrabold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <i class="fa-solid fa-envelope-open-text text-blue-600"></i> 6. Thay Đổi Điều Khoản và Liên Hệ
              </h3>
              <p>
                Chúng tôi có quyền sửa đổi các điều khoản này vào bất kỳ lúc nào để phù hợp với quy định mới của pháp luật hoặc cập nhật kỹ thuật. Các thay đổi sẽ được công khai tại trang này.
              </p>
              <p class="mt-4">
                Nếu bạn có bất kỳ câu hỏi nào về các điều khoản này, vui lòng liên hệ bộ phận hỗ trợ kỹ thuật:
              </p>
              <div class="mt-4 p-4 bg-blue-50 dark:bg-slate-900 border border-blue-100 dark:border-slate-700/80 rounded-2xl flex items-center gap-3">
                <div class="w-10 h-10 bg-blue-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-blue-600">
                  <i class="fa-solid fa-envelope"></i>
                </div>
                <div>
                  <div class="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase">Email liên hệ</div>
                  <a href="mailto:chuannafi6@gmail.com" class="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">chuannafi6&#64;gmail.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="text-center mt-8 text-xs text-slate-400 dark:text-slate-500 select-none">
          &copy; {{year}} NAFIQPM6 LIMS Cloud. Bảo lưu mọi quyền.
        </div>
      </div>
    </div>
  `
})
export class TermsOfServiceComponent {
  router = inject(Router);
  year = new Date().getFullYear();

  goBack() {
    this.router.navigate(['/']);
  }
}
