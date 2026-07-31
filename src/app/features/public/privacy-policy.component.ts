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
              <span>Cập nhật lần cuối: 30/07/2026</span>
            </div>
          </div>

          <div class="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 space-y-6 text-sm sm:text-base leading-relaxed">
            <p>
              Chào mừng bạn đến với <strong>NAFIQPM6 LIMS Cloud</strong> (Hệ thống quản lý thông tin phòng thí nghiệm).
              Chúng tôi cam kết bảo vệ tuyệt đối thông tin cá nhân và dữ liệu riêng tư của bạn. Chính sách bảo mật này giải thích chi tiết và minh bạch cách ứng dụng thu thập, sử dụng và bảo vệ dữ liệu khi bạn sử dụng các tính năng liên quan đến tài khoản và tích hợp Google API.
            </p>

            <!-- HIGHLIGHT SUMMARY BOX FOR USERS & GOOGLE VERIFICATION TEAM -->
            <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-blue-950/40 p-6 rounded-3xl border-2 border-blue-200 dark:border-blue-800/60 shadow-sm my-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shadow-md">
                  <i class="fa-solid fa-circle-check text-xl"></i>
                </div>
                <div>
                  <h3 class="text-base font-extrabold text-blue-950 dark:text-blue-200 m-0">Tóm Tắt Cam Kết Bảo Mật (Google OAuth Summary)</h3>
                  <p class="text-xs text-blue-700 dark:text-blue-300 font-semibold m-0">Dành cho Người Dùng & Đội ngũ Kiểm duyệt Google Cloud</p>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-semibold">
                <div class="bg-white/80 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-blue-100 dark:border-blue-900/50">
                  <span class="text-blue-600 dark:text-blue-400 font-bold block mb-1">🔑 Phạm Vi Truy Cập (Scope)</span>
                  <code class="text-[11px] bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded font-mono font-bold border border-blue-200 dark:border-blue-800">drive.file</code>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1 mb-0 leading-normal">Chỉ thao tác với tệp do chính ứng dụng này tạo ra.</p>
                </div>
                <div class="bg-white/80 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-blue-100 dark:border-blue-900/50">
                  <span class="text-blue-600 dark:text-blue-400 font-bold block mb-1">📂 Nơi Lưu Trữ (Storage)</span>
                  <span class="text-slate-800 dark:text-slate-200 font-bold">Thư mục Phòng Lab</span>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1 mb-0 leading-normal">Lưu trực tiếp vào thư mục dùng chung được cấp quyền.</p>
                </div>
                <div class="bg-white/80 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-blue-100 dark:border-blue-900/50">
                  <span class="text-blue-600 dark:text-blue-400 font-bold block mb-1">🛡️ Chia Sẻ Dữ Liệu</span>
                  <span class="text-emerald-600 dark:text-emerald-400 font-bold">Cam Kết 0% Chia Sẻ</span>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1 mb-0 leading-normal">Không bán, truyền hay lưu trữ dữ liệu sang bên thứ ba.</p>
                </div>
              </div>
            </div>

            <!-- Section 1 -->
            <div class="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 my-6">
              <h3 class="text-lg font-extrabold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <i class="fa-solid fa-folder-open text-blue-600"></i> 1. Thu Thập Dữ Liệu và Phạm Vi Truy Cập Google API
              </h3>
              <p class="mb-3">
                Hệ thống của chúng tôi tích hợp dịch vụ Google Drive API để phục vụ tính năng lưu trữ báo cáo kiểm nghiệm. Cụ thể:
              </p>
              <ul class="list-disc pl-5 space-y-3">
                <li>
                  <strong>Phạm vi truy cập (OAuth Scope):</strong> Ứng dụng chỉ yêu cầu quyền 
                  <code class="bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded font-mono font-bold border border-blue-200 dark:border-blue-800">https://www.googleapis.com/auth/drive.file</code>. 
                  Quyền này <strong>KHÔNG</strong> cho phép ứng dụng đọc hoặc xem toàn bộ Google Drive của bạn, mà <strong>chỉ giới hạn</strong> đọc, ghi và cập nhật các tệp tin được tạo bởi chính ứng dụng này.
                </li>
                <li>
                  <strong>Loại tệp tin tương tác:</strong> Ứng dụng chỉ tạo và làm việc với các tệp tin báo cáo kết quả thí nghiệm, chứng chỉ chất lượng (CoA) hoặc biểu mẫu SOP dưới dạng tệp Excel/PDF do người dùng chọn xuất.
                </li>
              </ul>
            </div>

            <!-- Section 2 -->
            <div class="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 my-6">
              <h3 class="text-lg font-extrabold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <i class="fa-solid fa-gears text-blue-600"></i> 2. Mục Đích Sử Dụng Dữ Liệu
              </h3>
              <p>
                Dữ liệu truy cập thông qua Google OAuth chỉ được sử dụng phục vụ các chức năng nghiệp vụ cốt lõi sau:
              </p>
              <ul class="list-disc pl-5 mt-2 space-y-2">
                <li>Tải các mẫu báo cáo tiêu chuẩn từ Google Drive xuống ứng dụng để xử lý tính toán.</li>
                <li>Lưu trữ các kết quả phân tích phòng thí nghiệm dưới dạng tệp Excel hoặc PDF trực tiếp vào thư mục dùng chung của phòng thí nghiệm được phân quyền để phục vụ mục đích in ấn, tra cứu và lưu trữ hồ sơ.</li>
                <li>Đọc cấu hình tiêu chuẩn dạng JSON trên Drive để đồng bộ quy trình phân tích.</li>
              </ul>
            </div>

            <!-- Section 3 -->
            <div class="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 my-6">
              <h3 class="text-lg font-extrabold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <i class="fa-solid fa-lock text-blue-600"></i> 3. Lưu Trữ và Bảo Mật Dữ Liệu
              </h3>
              <p class="mb-3">
                Chúng tôi áp dụng tiêu chuẩn an ninh cao nhất để bảo vệ thông tin xác thực của bạn:
              </p>
              <ul class="list-disc pl-5 space-y-2">
                <li>
                  <strong>Mã thông báo truy cập (Access Token):</strong> Mã truy cập Google OAuth được xử lý trực tiếp trong trình duyệt của người dùng (Client-Side) hoặc cookie bảo mật mã hóa. Chúng tôi <strong>KHÔNG</strong> truyền, lưu trữ hay chia sẻ mã này trên bất kỳ máy chủ trung gian nào của bên thứ ba.
                </li>
                <li>
                  <strong>Dữ liệu tệp tin:</strong> Toàn bộ tài liệu báo cáo của bạn được lưu trực tiếp vào thư mục lưu trữ dùng chung của phòng thí nghiệm được cấp quyền. Ứng dụng không sao lưu dữ liệu này ở các máy chủ khác ngoại trừ các cơ sở dữ liệu nội bộ được bảo mật phục vụ vận hành.
                </li>
              </ul>
            </div>

            <!-- Section 4 -->
            <div class="bg-emerald-50/50 dark:bg-emerald-950/20 p-6 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 my-6">
              <h3 class="text-lg font-extrabold text-emerald-900 dark:text-emerald-200 mb-3 flex items-center gap-2">
                <i class="fa-solid fa-shield-cat text-emerald-600"></i> 4. Cam Kết Không Chia Sẻ Thông Tin
              </h3>
              <p class="m-0 text-slate-700 dark:text-slate-300">
                Chúng tôi tuyệt đối <strong>KHÔNG</strong> chia sẻ, bán, trao đổi hoặc chuyển giao thông tin cá nhân hay dữ liệu từ Google Drive của bạn cho bất kỳ bên thứ ba nào. Dữ liệu này chỉ thuộc sở hữu của phòng thí nghiệm và chỉ phục vụ việc vận hành chức năng ứng dụng theo hành động thực tế của bạn.
              </p>
            </div>

            <!-- Section 5: Xoa tai khoan -->
            <div class="bg-red-50/50 dark:bg-red-950/20 p-6 rounded-2xl border border-red-200 dark:border-red-900/50 my-6">
              <h3 class="text-lg font-extrabold text-red-900 dark:text-red-200 mb-3 flex items-center gap-2">
                <i class="fa-solid fa-user-slash text-red-600"></i> 5. Quyền Xóa và Ẩn Danh Hoá Tài Khoản
              </h3>
              <p class="mb-3">
                Theo yêu cầu của Apple App Store và chính sách GDPR, bạn có quyền yêu cầu ẩn danh hoá thông tin cá nhân bất kỳ lúc nào.
              </p>
              <ul class="list-disc pl-5 space-y-2 mb-4">
                <li><strong>Thông tin được ẩn danh hoá:</strong> Địa chỉ email và ảnh đại diện.</li>
                <li><strong>Thông tin được giữ lại:</strong> Tên hiển thị và UID được giữ để phục vụ audit trail và tính toàn vẹn dữ liệu kết quả kiểm nghiệm.</li>
                <li><strong>Cách thực hiện:</strong> Vào <strong>Trang cá nhân → Quản lý Tài Khoản</strong> và bấm nút “Ẩn danh hoá thông tin cá nhân”.</li>
                <li><strong>Hiệu lực tức thì:</strong> Sau khi xác nhận, hệ thống sẽ thực hiện trong vòng 60 giây.</li>
              </ul>
              <p class="text-sm text-slate-600 dark:text-slate-300">
                Nếu bạn muốn xóa hoàn toàn tài khoản và toàn bộ dữ liệu liên quan, vui lòng liên hệ trực tiếp quản trị viên qua email bên dưới.
              </p>
            </div>

            <!-- Section 6: Firebase/FCM -->
            <div class="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 my-6">
              <h3 class="text-lg font-extrabold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <i class="fa-solid fa-fire text-orange-500"></i> 6. Dịch Vụ Firebase và Thông Báo Đẩy
              </h3>
              <p class="mb-3">Hệ thống sử dụng các dịch vụ Google Firebase:</p>
              <ul class="list-disc pl-5 space-y-2">
                <li><strong>Firebase Authentication:</strong> Xác thực đăng nhập bằng tên đăng nhập/mật khẩu nội bộ. Dữ liệu lưu trữ: email (hoặc tên đại diện), UID. Không có OAuth Google đối với người dùng thường.</li>
                <li><strong>Cloud Firestore:</strong> Lưu trữ dữ liệu nghiệp vụ (kết quả kiểm nghiệm, số lượng, SOP). Toàn bộ dữ liệu thuộc sở hữu của phòng thí nghiệm NAFIQPM6.</li>
                <li><strong>Firebase Cloud Messaging (FCM):</strong> Gửi thông báo đẩy nội bộ (cảnh báo hết hạn, yêu cầu duyệt). FCM token được lưu trên thiết bị và Firestore, chỉ dùng để gửi thông báo nội bộ, không chia sẻ bên ngoài.</li>
                <li><strong>Vercel (hosting):</strong> Ứng dụng được triển khai trên Vercel. Vercel có thể lưu access log (IP, user agent) trong tối đa 30 ngày theo chính sách riêng của họ.</li>
              </ul>
            </div>

            <!-- Section 7: Quyen kiem soat -->
            <div class="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 my-6">
              <h3 class="text-lg font-extrabold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <i class="fa-solid fa-user-xmark text-blue-600"></i> 7. Quyền Kiểm Soát và Thu Hồi Quyền Truy Cập Google
              </h3>
              <p>
                Bạn có toàn quyền kiểm soát tài khoản của mình. Bạn có thể thu hồi quyền truy cập Google Drive bất kỳ lúc nào bằng cách:
              </p>
              <ol class="list-decimal pl-5 mt-2 space-y-2">
                <li>Truy cập trang cài đặt bảo mật tài khoản Google của bạn tại: <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener" class="text-blue-600 font-bold hover:underline">My Account Permissions</a>.</li>
                <li>Chọn ứng dụng <strong>NAFIQPM6 LIMS Cloud</strong>.</li>
                <li>Nhấn nút <strong>Xóa quyền truy cập (Remove Access)</strong>.</li>
              </ol>
            </div>

            <!-- Section 8: Lien he -->
            <div class="border-t border-slate-200 dark:border-slate-700/80 pt-6 mt-8">
              <h3 class="text-lg font-extrabold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <i class="fa-solid fa-envelope-open-text text-blue-600"></i> 8. Liên Hệ Hỗ Trợ
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
