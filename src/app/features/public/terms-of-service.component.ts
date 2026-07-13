import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-terms-of-service',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div class="max-w-4xl mx-auto">
        <!-- Back Button & Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <i class="fa-solid fa-file-contract text-2xl"></i>
            </div>
            <div>
              <h1 class="text-2xl font-black text-slate-800 dark:text-white tracking-tight">LIMS Cloud</h1>
              <p class="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Cổng Thông Tin Công Khai</p>
            </div>
          </div>
          <button (click)="goBack()" 
                  class="self-start sm:self-auto px-5 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold transition flex items-center gap-2 shadow-sm active:scale-95">
            <i class="fa-solid fa-arrow-left"></i> Quay lại
          </button>
        </div>

        <!-- Terms Card -->
        <div class="bg-white dark:bg-slate-800 shadow-soft-xl border border-slate-100 dark:border-slate-700/50 rounded-3xl p-6 sm:p-10 transition-all duration-300">
          <div class="border-b border-slate-100 dark:border-slate-700/80 pb-6 mb-8">
            <h2 class="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Điều Khoản Dịch Vụ Sử Dụng</h2>
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
            <div>
              <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <i class="fa-solid fa-check text-blue-500"></i> 1. Chấp thuận điều khoản
              </h3>
              <p>
                Việc truy cập, đăng ký tài khoản hoặc sử dụng bất kỳ tính năng nào của hệ thống LIMS Cloud đồng nghĩa với việc bạn đồng ý với các điều khoản này. Nếu bạn không đồng ý với bất kỳ phần nào, vui lòng ngừng sử dụng dịch vụ và ngắt kết nối tài khoản của mình.
              </p>
            </div>

            <!-- Section 2 -->
            <div>
              <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <i class="fa-solid fa-user-shield text-blue-500"></i> 2. Đăng nhập và Bảo mật tài khoản
              </h3>
              <ul class="list-disc pl-5 space-y-2">
                <li>Người dùng có thể đăng nhập thông qua cơ chế xác thực an toàn bằng tài khoản Google (OAuth 2.0).</li>
                <li>Bạn chịu trách nhiệm bảo mật thông tin đăng nhập tài khoản Google của mình và không cho phép bên thứ ba truy cập trái phép vào tài khoản của bạn để thao tác trên hệ thống LIMS.</li>
                <li>Mọi hoạt động được thực hiện dưới tài khoản đã đăng nhập của bạn sẽ được ghi nhận là hoạt động hợp pháp của chính bạn.</li>
              </ul>
            </div>

            <!-- Section 3 -->
            <div>
              <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <i class="fa-solid fa-cloud-arrow-up text-blue-500"></i> 3. Sử dụng dịch vụ liên kết Google Drive
              </h3>
              <p>
                Khi bạn kích hoạt tính năng tích hợp Google Drive:
              </p>
              <ul class="list-disc pl-5 mt-2 space-y-2">
                <li>Ứng dụng sẽ được cấp quyền truy cập hạn chế (chỉ đối với các tệp tin do ứng dụng tạo ra).</li>
                <li>Bạn đồng ý rằng các tệp báo cáo phân tích, tài liệu nội bộ sẽ được lưu trữ trực tiếp trên tài khoản Google Drive cá nhân của bạn.</li>
                <li>Bạn có toàn quyền xóa, di chuyển hoặc thu hồi quyền truy cập này bất cứ lúc nào thông qua trang quản lý tài khoản Google.</li>
              </ul>
            </div>

            <!-- Section 4 -->
            <div>
              <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <i class="fa-solid fa-ban text-blue-500"></i> 4. Các hành vi bị cấm
              </h3>
              <p>Khi sử dụng hệ thống LIMS Cloud, bạn cam kết KHÔNG thực hiện các hành vi sau:</p>
              <ul class="list-disc pl-5 mt-2 space-y-2">
                <li>Tải lên hệ thống hoặc liên kết Drive các tệp tin chứa virus, mã độc hoặc phần mềm độc hại gây ảnh hưởng đến hệ thống.</li>
                <li>Cố gắng truy cập trái phép hoặc phá hoại cơ sở dữ liệu của phòng thí nghiệm hoặc của người dùng khác.</li>
                <li>Sử dụng thông tin và biểu mẫu của hệ thống vào các mục đích phi pháp hoặc trái với quy định bảo mật của phòng thí nghiệm.</li>
              </ul>
            </div>

            <!-- Section 5 -->
            <div>
              <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <i class="fa-solid fa-triangle-exclamation text-blue-500"></i> 5. Giới hạn trách nhiệm pháp lý
              </h3>
              <p>
                Ứng dụng cung cấp công cụ lưu trữ dữ liệu thông qua bên thứ ba (Google Drive API). Chúng tôi không chịu trách nhiệm trong trường hợp:
              </p>
              <ul class="list-disc pl-5 mt-2 space-y-2">
                <li>Người dùng tự ý xóa hoặc thay đổi tệp tin trên Google Drive dẫn đến mất mát hoặc hỏng dữ liệu trong hệ thống LIMS.</li>
                <li>Sự cố kết nối hoặc gián đoạn dịch vụ từ phía nhà cung cấp dịch vụ máy chủ đám mây của Google nằm ngoài tầm kiểm soát của chúng tôi.</li>
              </ul>
            </div>

            <!-- Section 6 -->
            <div class="border-t border-slate-100 dark:border-slate-700/80 pt-6 mt-8">
              <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <i class="fa-solid fa-envelope-open-text text-blue-500"></i> 6. Thay đổi điều khoản và Liên hệ
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
