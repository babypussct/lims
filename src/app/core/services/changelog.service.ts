import { Injectable, signal } from '@angular/core';

export interface ChangelogItem {
  version: string;
  date: string;
  title: string;
  highlights?: string[];
  features?: string[];
  improvements?: string[];
  fixes?: string[];
}

// ─── DÙNG CHO TRANG /changelog (Toàn bộ lịch sử) ──────────────
export const CHANGELOG_DATA: ChangelogItem[] = [
  {
    version: 'v26.08.01-b01',
    date: '01/08/2026',
    title: 'Khắc Phục Lỗi Đăng Nhập Popup & PDF Viewer',
    fixes: [
      'Tự động nhận diện nếu trình duyệt (Safari, Brave) hoặc trình duyệt nhúng (Zalo/Facebook) chặn popup đăng nhập Google. Khi lỗi popup-closed-by-user xảy ra dưới 2.5 giây, hệ thống chủ động chuyển sang luồng Redirect (OIDC).',
      'Xử lý lỗi không tương thích mảng Array Spread của Map.entries() trên các trình duyệt cũ, giúp chức năng xem tài liệu PDF hoạt động ổn định và mượt mà hơn.'
    ]
  },
  {
    version: 'v26.07.31-b01',
    date: '31/07/2026',
    title: 'Tối Ưu Thống Kê Firestore & Khắc Phục So Sánh Xu Hướng',
    highlights: [
      'Toàn bộ phần Hiệu Suất Phân Tích (KPI, biểu đồ, so sánh trendInfo, tần suất SOP) chuyển sang 100% Firestore pre-aggregated.',
      'Đã sửa triệt để lỗi Date Rollover và Off-by-one giúp phép so sánh giữa các tháng luôn chính xác.',
      'Khắc phục lỗi Firestore query Composite Index cho phép Backfill dữ liệu từ 01/01/2026 mượt mà.',
      'Nâng cấp cache Signal statsData.update giúp duy trì dữ liệu các tháng đã tải khi chuyển đổi bộ lọc.'
    ]
  },
  {
    version: 'v26.07.29-b03',
    date: '29/07/2026',
    title: 'Lập Mẻ Tự Động An Toàn & Thông Báo Chính Xác',
    highlights: [
      'Hệ thống nhận đúng mẫu, chỉ tiêu, nền mẫu và SOP phù hợp; các dòng nhập trùng được tự động bỏ qua.',
      'Cảnh báo rõ khi thiếu SOP, sai đơn vị, thiếu hóa chất, nhập số lượng không hợp lệ hoặc một mẫu bị xếp trùng.',
      'Kế hoạch chỉ được duyệt khi tất cả mẻ đều hợp lệ; nếu có lỗi, dữ liệu vẫn được giữ nguyên để sửa và thử lại.',
      'Lượng hóa chất được tính theo toàn bộ kế hoạch và kiểm tra lại ngay lúc duyệt, giúp hạn chế trừ tồn sai.',
      'Người thao tác chỉ nhận một thông báo; những người dùng khác nhận đúng nội dung thay đổi mới nhất.'
    ]
  },
  {
    version: 'v26.07.29-b02',
    date: '29/07/2026',
    title: 'Import Chất Chuẩn An Toàn & Tái Sử Dụng Slot',
    highlights: [
      'Luồng import chất chuẩn đọc toàn bộ workbook, xem trước từng dòng và commit nguyên tử để không còn ghi dở dữ liệu.',
      'Mã quản lý được xem là slot có thể cấp lại sau khi chuẩn cũ bị xóa mềm; chuẩn mới luôn có ID lịch sử riêng.',
      'Book2.xlsx được nhận đủ 45 dòng: 44 chuẩn tạo mới và Bicozamycin/AB47 cập nhật an toàn.'
    ],
    features: [
      'Modal import riêng hiển thị sheet, dòng hợp lệ, cảnh báo, xung đột, chế độ tạo mới/cập nhật và thay đổi metadata.',
      'Web Worker đọc XLSX ngoài luồng giao diện; kiểm tra kích thước, định dạng, header, ngày, đơn vị và tồn kho trước khi ghi.',
      'Restore kiểm tra slot đang được sử dụng và chặn khôi phục nếu mã đã cấp cho chuẩn hoạt động khác.'
    ],
    improvements: [
      'DeltaSync hợp nhất thay đổi tối ưu mà không hủy listener của màn hình hiện tại.',
      'Import lại chuẩn hiện hữu chỉ cập nhật metadata an toàn, không ghi đè tồn kho, workflow hoặc nhập trùng nhật ký.',
      'Toast trùng được gom theo nội dung/sự kiện, giới hạn số thông báo đồng thời và duy trì thời gian hiển thị hợp lý.'
    ],
    fixes: [
      'Khắc phục chỉ thấy Bicozamycin sau khi chọn Book2.xlsx trong phiên ứng dụng cũ.',
      'Khắc phục chuẩn đã xóa mềm bị nhận nhầm thành RESTORE khi mã quản lý được dùng cho chuẩn mới.',
      'Khắc phục Restore có thể làm hai chuẩn hoạt động cùng chiếm một mã quản lý.'
    ]
  },
  {
    version: 'v26.07.29-b01',
    date: '29/07/2026',
    title: 'Import Excel Lớn Không Treo & Ghép Mẫu Sequence',
    highlights: [
      'Import Excel chạy trong Web Worker để file chứa nhiều hình sắc ký không còn khóa giao diện.',
      'Chỉ các sheet hoạt chất thuộc SOP được phân tích; hình, chart, style và dữ liệu phụ được bỏ qua.',
      'Mọi SOP nhận quy tắc tên sequence xxx_ngày_mã-mẫu, ví dụ FIPRONIL_27_U01.D ghép với U0127.'
    ],
    features: [
      'Modal hiển thị tiến trình nạp file, đọc sheet, trích xuất report và ghép mẫu; hỗ trợ hủy an toàn trước khi áp dụng.',
      'Fallback tự động về chế độ tương thích khi Worker không khả dụng hoặc đọc toàn bộ sheet khi chưa nhận diện được tên sheet SOP.',
      'Service Worker lưu cache riêng cho bundle Excel Worker để luồng import tiếp tục dùng được khi kết nối mạng không ổn định.'
    ],
    improvements: [
      'ArrayBuffer được chuyển sang Worker theo cơ chế transfer, tránh sao chép thêm file lớn trong bộ nhớ.',
      'Tắt đọc công thức, rich text, styles, calculation chain, VBA và raw ZIP files nhưng vẫn giữ nguyên text hiển thị của Final-Conc.',
      'SOP-01 nhận đầy đủ BLANK, SPIKE và SPIKE_N động; quy tắc ghép ngày/mã mẫu được mở rộng làm fallback chung cho SOP mới.'
    ],
    fixes: [
      'Khắc phục giao diện có thể treo lâu khi XLSX.read chạy đồng bộ trên main thread với workbook nhiều sắc ký đồ.',
      'Khắc phục U0127 không ghép với FIPRONIL_27_U01.D sau khi hợp nhất các module import.',
      'Khắc phục Pirimiphos methyl bị báo không được phân khi mẻ đang lưu ID Master Analyte lịch sử.'
    ]
  },
  {
    version: 'v26.07.28-b06',
    date: '28/07/2026',
    title: 'Hoàn Thiện Import Excel, Alias & Lưu Tệp Gốc',
    highlights: [
      'Mọi SOP dùng chung một modal Import Excel cho Form Check và Form Đơn, từ xem trước đến chọn và áp dụng dữ liệu.',
      'Alias chỉ tiêu được quản lý tại Master Analyte; hỗ trợ Etofenprox/Ethofenprox và giữ bảng alias cũ làm phương án dự phòng.',
      'Người dùng có thể chọn lưu tệp Excel gốc lên Google Drive với modal tiến trình và liên kết mở lại ngay trên header mẻ.'
    ],
    features: [
      'Checkbox lưu tệp nguồn chỉ mã hóa và upload khi được bật; lựa chọn gần nhất được ghi nhớ theo mẻ.',
      'Master Analyte hỗ trợ nhập, sửa, tìm kiếm, import và export danh sách tên khác.',
      'Liên kết Excel gốc dùng chung cho mọi SOP và vẫn đọc được dữ liệu MassHunter lịch sử.'
    ],
    improvements: [
      'Modal PDF mở thủ công và tự bật sau khi xuất dùng chung metadata phiên bản, người phát hành, thời gian và Google Docs.',
      'Command Palette hỗ trợ tìm kiếm tiếng Việt không dấu và phản hồi ngay khi nhập.',
      'Loại bỏ parser và handler MassHunter riêng bị trùng, giữ một luồng import chung để các SOP mới tự thừa hưởng.'
    ],
    fixes: [
      'Giá trị Final-Conc. bằng 0 được nhập thành ND đúng theo Form Check và Form Đơn.',
      'PDF Form Check một mẫu chỉ in giá trị kết quả, không lặp mã mẫu trước giá trị.',
      'Form Check không còn cảnh báo thiếu R² vì loại form này không có trường R².',
      'Upload lỗi không làm thay đổi kết quả; modal được giữ lại để thử lại hoặc bỏ chọn lưu tệp.'
    ]
  },
  {
    version: 'v26.07.28-b05',
    date: '28/07/2026',
    title: 'Import Kết Quả Excel Theo Mẻ SOP',
    highlights: [
      'Một nút Import Excel dùng chung cho Form Check, Form Đơn và các SOP mới.',
      'Modal xem trước cho phép chọn hoặc bỏ chọn từng thông tin trước khi ghi vào giao diện.',
      'Ghép tên mẫu linh hoạt giữa tiền tố Excel và mã mẫu trong mẻ.'
    ],
    features: [
      'Chỉ nhập Final-Conc. và không đổi đơn vị; mục được chọn ghi đè, mục bỏ chọn giữ nguyên.',
      'ND được đánh dấu checkbox ở Form Check hoặc điền trực tiếp ở Form Đơn.',
      'R² và số điểm đường chuẩn chỉ nhập cho Form Đơn, giữ nguyên nồng độ danh định.',
      'Cho phép giữ nguyên Excel hoặc chọn từ 0 đến 6 chữ số thập phân.'
    ],
    improvements: [
      'Mã mẫu chứa BL/SP vẫn được coi là mẫu thường; QC không tồn tại trên Form Check tự động bị bỏ qua.',
      'Chỉ lưu dữ liệu đã chọn và nhật ký import rút gọn, không giữ toàn bộ workbook trên máy.'
    ]
  },
  {
    version: 'v26.07.28-b04',
    date: '28/07/2026',
    title: 'Excel Tự Dãn Cột/Hàng Vừa Nội Dung',
    highlights: [
      'Tự AutoFit cột và hàng ngay khi mở workbook hoặc chuyển sheet, không còn yêu cầu double-click từng tiêu đề.',
      'Tự tăng chiều cao và wrap nội dung dài trong giới hạn an toàn, có xử lý đúng tổng chiều rộng của ô gộp.'
    ],
    features: [
      'Nút Vừa nội dung cho phép khôi phục AutoFit sau khi người dùng kéo chỉnh kích thước thủ công.'
    ],
    improvements: [
      'Giới hạn chiều rộng riêng cho desktop/mobile để bảng vừa dễ đọc vừa không bị phình bởi một ô bất thường.',
      'Tối ưu hiệu năng bằng cách chỉ đo giá trị đại diện dài nhất của từng cột và lưu đệm kết quả đo.',
      'Toàn bộ AutoFit chạy cục bộ trong trình duyệt, không phát sinh dịch vụ hoặc chi phí mới.'
    ],
    fixes: [
      'Khắc phục cột mặc định 96px và hàng 28px khiến nội dung bị cắt cho đến khi người dùng double-click thủ công.'
    ]
  },
  {
    version: 'v26.07.28-b03',
    date: '28/07/2026',
    title: 'Hotfix Xem PDF Trên Mobile',
    highlights: [
      'Khắc phục lỗi Map.getOrInsertComputed khiến PDF không mở được trên Chrome/Safari mobile.',
      'Chuyển đồng bộ PDF.js viewer và worker sang legacy build chính thức có lớp tương thích Map/WeakMap.'
    ],
    improvements: [
      'Giữ nguyên chế độ cuộn dọc nhiều trang, text layer chọn/copy và tìm kiếm highlight trên desktop lẫn mobile.',
      'Không sửa prototype thủ công, không thêm OCR/cloud và không phát sinh chi phí.'
    ],
    fixes: [
      'Sửa lỗi Không thể xem trước tài liệu do trình duyệt mobile chưa hỗ trợ Map.getOrInsertComputed.'
    ]
  },
  {
    version: 'v26.07.28-b02',
    date: '28/07/2026',
    title: 'Phiếu Giao Nhận Mẫu Premium: PDF Liên Tục & Excel Tương Tác',
    highlights: [
      'PDF hiển thị toàn bộ trang theo chiều dọc, tự đồng bộ số trang và render lười để tài liệu dài vẫn mượt trên desktop/mobile.',
      'Excel giữ cấu trúc workbook, hỗ trợ chọn ô/dòng/cột/vùng, copy dạng bảng, tìm kiếm highlight và chuyển sheet như một bảng tính chỉ đọc.',
      'Bộ lọc/sắp xếp theo đúng tiêu đề nghiệp vụ, chỉ tác động vùng dữ liệu và luôn giữ nguyên tiêu đề cùng phần ký xác nhận.'
    ],
    features: [
      'Lớp văn bản PDF cho phép tô chọn/copy, tìm toàn tài liệu, tô vàng mọi kết quả và tô cam kết quả đang tập trung.',
      'Excel hỗ trợ kéo chọn vùng, chọn cả dòng/cột, Ctrl/⌘ + A, Ctrl/⌘ + C, điều hướng bàn phím và thanh công thức.',
      'Bảng Lọc & sắp xếp riêng với điều kiện Có chứa, Bằng chính xác, Không trống và thứ tự tăng/giảm.',
      'Google Drive công khai tải đủ mọi trang dữ liệu, hỗ trợ hủy yêu cầu cũ và xuất Google Sheets sang XLSX.'
    ],
    improvements: [
      'Modal xem tài liệu dùng tối đa diện tích, đồng bộ thanh công cụ PDF/Excel và tối ưu thao tác cảm ứng trên mobile.',
      'Ghi nhớ thư mục, chế độ xem, mật độ, sắp xếp và vị trí cuộn khi quay lại module Phiếu Giao Nhận Mẫu.',
      'PDF chỉ render các trang gần vùng nhìn; mọi xử lý PDF/Excel chạy cục bộ bằng thư viện mã nguồn mở, không phát sinh phí OCR/cloud.'
    ],
    fixes: [
      'Khắc phục PDF chỉ hiển thị một trang khiến người dùng hiểu nhầm tài liệu đã kết thúc.',
      'Khắc phục Excel không thể chọn/copy vùng, dòng hoặc cột và giao diện khác xa cấu trúc tệp gốc.',
      'Khắc phục filter Excel bị kẹt, hiển thị nội dung vô nghĩa và kéo dòng trống/chữ ký vào vùng sắp xếp.',
      'Khắc phục tìm kiếm chỉ báo kết quả nhưng không làm nổi bật đúng nội dung vừa tìm thấy.'
    ]
  },
  {
    version: 'v26.07.28-b01',
    date: '28/07/2026',
    title: 'Điều Hướng Header Gọn Hơn & Bù Kho Smart Batch Tức Thời',
    highlights: [
      'Loại bỏ Navigation Rail và đưa toàn bộ điều hướng Desktop lên Header, giúp giao diện gọn hơn và trả lại toàn bộ không gian nội dung khi đóng sidebar.',
      'Chuông thông báo có chế độ Header riêng; popover tự neo chính xác ngay dưới nút chuông và vẫn giữ bottom sheet trên mobile.',
      'Smart Batch cập nhật tồn kho tức thời sau khi bù hàng, tự kiểm tra lại mẻ và mở khóa thao tác ở Bước 2 khi đã đủ kho.'
    ],
    features: [
      'Nút Trang Chủ thật trên breadcrumb Header và sidebar 256px nằm gọn dưới thanh điều hướng.',
      'Notification Bell 36px đồng bộ các action Header, hỗ trợ badge, trạng thái active và animation thông báo chưa đọc.'
    ],
    improvements: [
      'Main content và Header dùng chung mốc sidebar 256px, chuyển trạng thái mở/đóng mượt mà và nhất quán.',
      'Notification popover đo vị trí nút chuông bằng bounding rectangle thay vì phụ thuộc chiều rộng navigation cố định.',
      'Đồng bộ cache Smart Batch với state kho ngay sau giao dịch Nhập Kho Nhanh để bảng tổng hợp phản hồi tức thời.'
    ],
    fixes: [
      'Khắc phục nút thao tác Smart Batch ở Bước 2 vẫn bị khóa sau khi người dùng đã bù đủ tồn kho.',
      'Khắc phục cảnh báo thiếu hàng và trạng thái mẻ cập nhật chậm trong thời gian chờ Firestore listener.'
    ]
  },
  {
    version: 'v26.07.27-b04',
    date: '27/07/2026',
    title: 'Thiết Kế Lại App Shell UI/UX Đồng Bộ Hệ Thống',
    highlights: [
      'Thanh điều hướng Desktop mới (App Header): Breadcrumbs động, Tìm kiếm/Quét mã nhanh (Ctrl+K), Badge Online/Offline, Dark Mode toggle và Profile Pill.',
      'Nâng cấp Sidebar Navigation: Xóa nút floating toggle, thêm tooltip hover, active indicator phát sáng và Glassmorphism Rail.',
      'Tối ưu Mobile: Active tab pill rõ ràng hơn và đồng bộ tiêu đề trang với Desktop Header.'
    ],
    features: [
      'Tạo component AppHeaderComponent hoàn toàn mới: Breadcrumbs, Search (⌘K), Online/Offline status, Dark Mode, Notification Bell, Profile dropdown.',
      'Bản đồ ROUTE_TITLES & ROUTE_ICONS dùng chung cho toàn hệ thống (25+ routes).',
      'Nút thu gọn sidebar tích hợp tại header Navigation Panel thay cho nút floating cũ.'
    ],
    improvements: [
      'Tooltip popover cho mỗi shortcut icon khi Rail thu gọn, giúp nhận biết tính năng mà không cần đoán icon.',
      'Active pill indicator với glow effect trên Navigation Rail và Panel.',
      'Nâng cấp nền Rail sang backdrop-blur-xl glassmorphism tạo chiều sâu hiện đại.',
      'Bottom Nav active indicator chuyển từ chấm tròn sang pill ngang (w-4) rõ ràng hơn.'
    ]
  },
  {
    version: 'v26.07.27-b03',
    date: '27/07/2026',
    title: 'Tối Ưu Xem Báo Cáo PDF, Khóa An Toàn Mẻ Hoàn Tất & Chuẩn Hóa Kho Chất Chuẩn',
    highlights: [
      'Xem trực tiếp file PDF báo cáo kết quả phân tích mượt mà trên giao diện, tự động hỗ trợ xác thực lại Google Drive khi hết hạn.',
      'Cập nhật ngay báo cáo tương ứng khi chuyển đổi bộ lọc nhóm mẫu hoặc chọn phiếu báo cáo.',
      'Khóa tự động chế độ Chỉ Xem cho các mẻ phân tích đã hoàn tất để bảo vệ dữ liệu và mở mặc định ở màn hình xem báo cáo.'
    ],
    features: [
      'Xem báo cáo PDF trực tiếp & mượt mà với cơ chế nạp Blob và tự động thu hồi bộ nhớ sau khi đóng panel.',
      'Rà soát tự động trước khi xuất báo cáo (chữ ký, kết quả ND/số liệu, R²) và hỗ trợ xem/khôi phục 5 phiên bản báo cáo.',
      'Hiển thị lượng chất chuẩn với 2 chữ số thập phân chuẩn GLP (12.50 g), hỗ trợ nhập bù nhật ký & nút chọn nhanh Tối đa.'
    ],
    improvements: [
      'Tối ưu bộ nhớ máy tính phòng thí nghiệm bằng cách giải phóng dữ liệu blob PDF khi người dùng chuyển trang hoặc đóng tab.',
      'Mẻ phân tích đã duyệt mở mặc định ở màn hình xem báo cáo PDF, giữ lối chỉnh sửa chủ động qua nút Chỉnh sửa.'
    ],
    fixes: [
      'Khắc phục hiển thị sai nhãn tiền tố report và xử lý triệt để liên kết báo cáo khi xem mẻ phân tích theo từng nhóm mẫu.'
    ]
  },
  {
    version: 'v26.07.27-b02',
    date: '27/07/2026',
    title: 'Nâng Cấp Module Kết Quả Phân Tích & Chuẩn Hóa Changelog',
    highlights: [
      'Thêm bước kiểm tra trước khi tạo báo cáo PDF để phát hiện thiếu mẫu, thiếu ngày ký, thiếu kết quả/ND và cảnh báo mẫu đã từng in.',
      'Lưu lịch sử publish/restore đầy đủ hơn theo report ID, prefix, danh sách mẫu và backup dữ liệu nhập liệu.',
      'Tách mặc định mẻ hoàn tất sang màn xem báo cáo, đồng thời giữ lối chỉnh sửa chủ động bằng edit=1.'
    ],
    features: [
      'Modal preflight hiển thị blockers, warnings, thông tin phạm vi in và các phiếu dự kiến khi chia report.',
      'Timeline phiên bản trong panel Các Báo Cáo với nút mở PDF/Google Docs từng bản.',
      'Module preflight riêng kèm test tự động cho chia phiếu, ND type3b, thiếu dữ liệu và cảnh báo mẫu đã publish.'
    ],
    improvements: [
      'Readonly được truyền sâu xuống các SOP Results và khóa native control cho SOP-01, SOP-03, Chloroform, Default Type2 và Type3B.',
      'Restore version dò theo reportId/prefix/bản chung để tránh nhầm phiếu khi cùng version có nhiều report.',
      'Màn xem chi tiết kết quả hiển thị nhãn report theo prefix thật thay vì key/timestamp kỹ thuật.'
    ],
    fixes: [
      'Chặn các thao tác có side-effect trong SOP-01 khi mẻ readonly hoặc đang xử lý, gồm import MassHunter, điền nhanh, copy dòng và đổi chọn mẫu.',
      'Pending guard cảnh báo cả khi autosave đang saving hoặc lỗi, không chỉ khi modified.',
      'Tiếp tục đồng bộ định dạng 2 chữ số thập phân cho module Chất Chuẩn và Yêu Cầu Chất Chuẩn.'
    ]
  },
  {
    version: 'v26.07.27-b01',
    date: '27/07/2026',
    title: 'Quy Chuẩn Hiển Thị 2 Chữ Số Thập Phân & Đồng Bộ Yêu Cầu Chất Chuẩn',
    highlights: [
      'Quy chuẩn tự động hiển thị các giá trị định lượng chất chuẩn với đúng 2 chữ số thập phân cố định (12.50, 10.00).',
      'Giữ nguyên độ chính xác tính toán tồn kho bằng cách phân tách dữ liệu lưu trữ float gốc và lớp hiển thị.',
      'Đồng bộ hiển thị 2 chữ số thập phân trên toàn bộ module Chất Chuẩn và trang Yêu Cầu Chất Chuẩn (/standard-requests).'
    ],
    features: [
      'Nâng cấp hàm formatNum hỗ trợ quy chuẩn định dạng 2 chữ số thập phân linh hoạt (Phương án A).',
      'Đồng bộ chuẩn hóa hiển thị tồn kho và lượng sử dụng trên Bảng Yêu cầu, Card Kanban, Action Modals và Create Request Drawer.'
    ],
    improvements: [
      'Giao diện gióng hàng các con số đẹp mắt, chuyên nghiệp theo chuẩn GLP.',
      'Loại bỏ hoàn toàn các binding hiển thị số lẻ trực tiếp trên UI.'
    ]
  },
  {
    version: 'v26.07.25-b01',
    date: '25/07/2026',
    title: 'Nhập Bù Nhật Ký Sử Dụng Chuẩn Ngược Ngày & Tự Động Đánh Dấu Hết Hàng',
    highlights: [
      'Cho phép Quản lý nhập bù nhật ký sử dụng chất chuẩn trong quá khứ cho nhân viên.',
      'Bổ sung nút "Tối đa" tự động điền toàn bộ lượng tồn kho còn lại của lọ chuẩn.',
      'Tự động tích chọn và cập nhật trạng thái Hết Hàng khi dùng hết chuẩn.'
    ],
    features: [
      'Nút "Nhập bù nhật ký" dành cho Quản lý trong danh sách chất chuẩn.',
      'Nút "Tối đa" và tùy chọn "Đánh dấu chuẩn đã sử dụng hết" trong cửa sổ nhập bù.'
    ],
    improvements: [
      'Cho phép nhập bù hồi ký ngay cả khi lọ chuẩn đang được mượn.',
      'Thẻ chọn nhanh mục đích sử dụng giúp thao tác nhanh và đồng bộ.'
    ],
    fixes: [
      'Xử lý tương thích định dạng kiểu dữ liệu trong khung nhập số lượng tối đa.'
    ]
  },
  {
    version: 'v26.07.24-b02',
    date: '24/07/2026',
    title: 'Mở Khóa Trạm Pha Chế, Chuẩn Hóa Cảnh Báo & Đếm Ngược Cập Nhật',
    highlights: [
      'Trạm Pha Chế cho phép toàn bộ nhân viên truy cập để sử dụng công cụ tính toán (Sandbox). Chế độ thực vẫn bảo vệ kho.',
      'Đồng bộ tiếng Việt các thông báo phân quyền trên toàn hệ thống.',
      'Bộ đếm ngược tự động thông minh 30s khi có phiên bản mới, tự tạm dừng khi rời máy và tiếp tục khi có tương tác.'
    ],
    features: [
      'Trạm Pha Chế khả dụng cho mọi nhân viên ở chế độ Sandbox.',
      'Bổ sung nút "Nhật ký phiên bản" cố định ở Footer và Dashboard để tra cứu 24/7.'
    ],
    improvements: [
      'Chuẩn hóa thông báo lỗi phân quyền tiếng Việt thân thiện.',
      'Popup cập nhật tự động dừng đếm ngược khi người dùng không di chuột/chạm màn hình.'
    ],
    fixes: [
      'Khắc phục hiển thị sai tên quyền nội bộ trong thông báo toast.',
      'Tối ưu Service Worker caching cho tệp xác minh Google.'
    ]
  },
  {
    version: 'v26.07.24-b25',
    date: '24/07/2026',
    title: 'Daily Checklist Dễ Xem Hơn, Dashboard Tăng Tương Tác',
    highlights: [
      'Sắp xếp mã mẫu thực hiện logic hơn (tiền tố hiển thị trước).',
      'Tải nhật ký hoạt động trên Dashboard đúng phân quyền của người dùng.'
    ],
    features: [
      'Bổ sung bảng Nhật ký hoạt động gần đây phù hợp với từng vai trò.',
      'Tối ưu giao diện Daily Checklist gọn nhẹ trên thiết bị di động.'
    ],
    improvements: [
      'Loại bỏ mã QR không cần thiết trong bản in Daily Checklist để tăng tốc độ in.',
      'Sắp xếp danh sách mẫu có tiền tố rõ ràng.'
    ],
    fixes: [
      'Sửa lỗi trắng dữ liệu nhật ký khi mở Dashboard lần đầu.'
    ]
  },
  {
    version: 'v26.07.23-b24',
    date: '23/07/2026',
    title: 'Sửa Lỗi Lưu Mẻ Sau Khi Chỉnh Sửa & Tối Ưu Firestore Log',
    highlights: [
      'Đảm bảo lưu mẻ phân tích ổn định ngay cả khi thiếu mã tham chiếu phụ.',
      'Tự động làm sạch dữ liệu trước khi gửi ghi log lên Firestore.'
    ],
    features: [
      'Nâng cấp luồng ghi log phê duyệt và sửa mẻ.'
    ],
    fixes: [
      'Sửa lỗi Firestore báo undefined khi SOP thiếu thông tin phụ.',
      'Cập nhật đúng phiếu in sau khi sửa đổi mẻ.'
    ]
  },
  {
    version: 'v26.07.23-b23',
    date: '23/07/2026',
    title: 'SmartBatch Nhanh Hơn & Tối Ưu Tốc Độ Tải App',
    highlights: [
      'Tối ưu lazy-loading cho các thư viện nặng giúp app khởi động nhanh hơn 40%.',
      'Đưa SmartBatch làm luồng lập mẻ phân tích chính.'
    ],
    features: [
      'Thêm nút "Tính nhanh SOP" trực tiếp bên trong màn hình SmartBatch.',
      'Tối ưu hóa các bảng lưu trữ hóa chất, chất chuẩn và báo cáo.'
    ],
    improvements: [
      'Ẩn Calculator khỏi thanh menu chính để đơn giản hóa giao diện navigation.'
    ]
  }
];

// ─── DÙNG CHO MODAL POPUP (Top 3 — Luôn có sẵn siêu nhẹ) ───────────────
export const LATEST_CHANGELOG: ChangelogItem[] = CHANGELOG_DATA.slice(0, 3);

@Injectable({ providedIn: 'root' })
export class ChangelogService {
  isOpen = signal<boolean>(false);
  activeVersion = signal<string | null>(null);

  open(version?: string) {
    if (version) {
      this.activeVersion.set(version);
    } else {
      this.activeVersion.set(null);
    }
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
  }

  toggle() {
    this.isOpen.update(v => !v);
  }
}
