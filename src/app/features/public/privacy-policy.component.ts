import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div class="max-w-4xl mx-auto">
        <!-- Back Button & Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <i class="fa-solid fa-shield-halved text-2xl"></i>
            </div>
            <div>
              <h1 class="text-2xl font-black text-slate-800 dark:text-white tracking-tight">LIMS Cloud</h1>
              <p class="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Cổng Thông Tin Công Khai</p>
            </div>
          </div>
          <button (click)="goBack()" 
                  class="self-start sm:self-auto px-5 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold transition flex items-center gap-2 shadow-sm active:scale-95">
            <i class="fa-solid fa-arrow-left"></i> Quay Lại
          </button>
        </div>

        <!-- Privacy Card -->
        <div class="bg-white dark:bg-slate-800 shadow-soft-xl border border-slate-100 dark:border-slate-700/50 rounded-3xl p-6 sm:p-10 transition-all duration-300">
          <div class="border-b border-slate-100 dark:border-slate-700/80 pb-6 mb-8">
            <h2 class="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Chính Sách Bảo Mật & Quyền Riêng Tư</h2>
            <div class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-semibold">
              <i class="fa-regular fa-clock"></i>
              <span>Cập nhật lần cuối: 13/07/2026</span>
            </div>
          </div>

          <div class="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 space-y-6 text-sm sm:text-base leading-relaxed">
            <p>
              Chào mừng bạn đến với <strong>NAFIQPM6 LIMS Cloud</strong> (Hệ thống quản lý thông tin phòng thí nghiệm).
              Chúng tôi cam kết bảo vệ thông tin cá nhân và dữ liệu riêng tư của bạn. Chính sách bảo mật này giải thích cách ứng dụng của chúng tôi thu thập, sử dụng và bảo vệ thông tin khi bạn sử dụng các tính năng liên quan đến tài khoản và tích hợp API Google.
            </p>

            <!-- Section 1 -->
            <div class="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 my-8">
              <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <i class="fa-solid fa-folder-open text-blue-500"></i> 1. Thu Thập Dữ Liệu và Truy Cập Google API
              </h3>
              <p class="mb-3">
                Hệ thống của chúng tôi tích hợp với dịch vụ Google Drive để cung cấp tính năng lưu trữ và đồng bộ báo cáo phòng thí nghiệm. Cụ thể:
              </p>
              <ul class="list-disc pl-5 space-y-2">
                <li>
                  <strong>Phạm vi truy cập (Scopes):</strong> Ứng dụng yêu cầu quyền <code>https://www.googleapis.com/auth/drive.file</code>. 
                  Quyền này chỉ cho phép ứng dụng đọc, ghi, chỉnh sửa và xóa các tệp tin hoặc thư mục được tạo ra bởi chính ứng dụng này trên Google Drive của bạn.
                </li>
                <li>
                  <strong>Tệp tin truy cập:</strong> Ứng dụng chỉ tương tác với các tệp tin báo cáo, chứng chỉ chất lượng hoặc các tài liệu chuẩn hóa dạng Excel/PDF do người dùng tải lên hoặc được tạo tự động bởi tính năng in ấn của hệ thống.
                </li>
              </ul>
            </div>

            <!-- Section 2 -->
            <div>
              <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <i class="fa-solid fa-gears text-blue-500"></i> 2. Cách Chúng Tôi Sử Dụng Dữ Liệu của Bạn
              </h3>
              <p>
                Dữ liệu truy cập thông qua tài khoản Google của bạn chỉ được sử dụng cho các mục đích chức năng cốt lõi sau:
              </p>
              <ul class="list-disc pl-5 mt-2 space-y-2">
                <li>Tải các biểu mẫu báo cáo tiêu chuẩn từ Google Drive xuống hệ thống để xử lý dữ liệu.</li>
                <li>Lưu trữ tạm thời hoặc lâu dài các kết quả phân tích phòng thí nghiệm dưới dạng tệp Excel hoặc PDF trên Google Drive cá nhân của bạn để phục vụ mục đích in ấn hoặc chia sẻ.</li>
                <li>Đọc cấu hình tiêu chuẩn dạng JSON được lưu giữ trên Drive để đồng bộ hóa quy trình phân tích.</li>
              </ul>
            </div>

            <!-- Section 3 -->
            <div>
              <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <i class="fa-solid fa-lock text-blue-500"></i> 3. Lưu Trữ và Bảo Mật Dữ Liệu
              </h3>
              <p class="mb-3">
                Chúng tôi áp dụng các tiêu chuẩn an ninh cao nhất để bảo vệ thông tin xác thực của bạn:
              </p>
              <ul class="list-disc pl-5 space-y-2">
                <li>
                  <strong>Mã thông báo truy cập (Access Token):</strong> Mã truy cập Google OAuth được xử lý trực tiếp trong trình duyệt của người dùng (Client-Side). Chúng tôi <strong>KHÔNG</strong> truyền, lưu trữ hay chia sẻ mã này trên bất kỳ máy chủ trung gian nào của chúng tôi hoặc bên thứ ba.
                </li>
                <li>
                  <strong>Dữ liệu tệp tin:</strong> Toàn bộ tài liệu báo cáo của bạn được lưu trực tiếp trên tài khoản Google Drive cá nhân của bạn. Ứng dụng không sao lưu dữ liệu này ở các máy chủ khác ngoại trừ các cơ sở dữ liệu nội bộ được bảo mật phục vụ vận hành.
                </li>
              </ul>
            </div>

            <!-- Section 4 -->
            <div>
              <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <i class="fa-solid fa-share-nodes text-blue-500"></i> 4. Chia Sẻ Thông Tin với Bên Thứ Ba
              </h3>
              <p>
                Chúng tôi tuyệt đối <strong>KHÔNG</strong> chia sẻ, bán, trao đổi hoặc chuyển giao thông tin cá nhân hay dữ liệu từ Google Drive của bạn cho bất kỳ bên thứ ba nào. Dữ liệu này chỉ thuộc sở hữu của bạn và chỉ phục vụ việc vận hành chức năng ứng dụng theo hành động thực tế của bạn.
              </p>
            </div>

            <!-- Section 5 -->
            <div>
              <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <i class="fa-solid fa-user-xmark text-blue-500"></i> 5. Quyền Kiểm Soát và Thu Hồi Quyền Truy Cập
              </h3>
              <p>
                Bạn hoàn toàn có quyền kiểm soát tài khoản của mình. Bạn có thể thu hồi quyền truy cập Google Drive bất kỳ lúc nào bằng cách:
              </p>
              <ol class="list-decimal pl-5 mt-2 space-y-2">
                <li>Truy cập trang cài đặt bảo mật tài khoản Google của bạn tại: <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener" class="text-blue-600 hover:underline">My Account Permissions</a>.</li>
                <li>Chọn ứng dụng <strong>NAFIQPM6 LIMS Cloud</strong>.</li>
                <li>Nhấn nút <strong>Xóa quyền truy cập (Remove Access)</strong>.</li>
              </ol>
            </div>

            <!-- Section 6 -->
            <div class="border-t border-slate-100 dark:border-slate-700/80 pt-6 mt-8">
              <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <i class="fa-solid fa-envelope-open-text text-blue-500"></i> 6. Liên Hệ Hỗ Trợ
              </h3>
              <p>
                Nếu bạn có bất kỳ câu hỏi nào liên quan đến Chính sách Bảo mật này hoặc các vấn đề kỹ thuật khác, vui lòng liên hệ quản trị viên:
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
export class PrivacyPolicyComponent {
  router = inject(Router);
  year = new Date().getFullYear();

  goBack() {
    this.router.navigate(['/']);
  }
}
