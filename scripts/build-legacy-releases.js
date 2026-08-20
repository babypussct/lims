/**
 * build-legacy-releases.js
 * Tạo scripts/legacy-releases.json từ dữ liệu thô và dữ liệu tự viết lại,
 * loại bỏ hoàn toàn jargon kỹ thuật, tuân theo AGENTS.md changelog rules.
 */
const fs = require('fs');
const path = require('path');

const recoveredPath = path.join(__dirname, 'recovered-releases.json');
const recoveredReleases = fs.existsSync(recoveredPath)
  ? JSON.parse(fs.readFileSync(recoveredPath, 'utf8'))
  : [];

// ===========================================================================
// PHẦN 1: Các phiên bản gần nhất đã được biên tập thủ công.
// Viết tay hoàn toàn, không có jargon.
// ===========================================================================
const recentReleases = [
  {
    version: 'v26.08.07-b02',
    date: '07/08/2026',
    title: 'Sửa Lỗi Che Khuất Tài Liệu & Cải Thiện Nhật Ký Cập Nhật',
    improvements: [
      'Tự động điều chỉnh khoảng cách, kích thước chữ và ô tìm kiếm của Nhật Ký Cập Nhật để hiển thị rõ ràng hơn trên các cỡ màn hình khác nhau.',
      'Các cửa sổ chức năng và lớp phủ mở lên mượt mà và hoạt động ổn định hơn sau khi chuyển trang.'
    ],
    fixes: [
      'Khắc phục lỗi màn hình xem tài liệu bị thanh điều hướng và menu che mất một phần nội dung.',
      'Sửa lỗi biểu tượng và đường thời gian trong Nhật Ký Cập Nhật không thẳng hàng với nội dung.',
      'Khắc phục sự cố khiến hệ thống không thể tự động phát hành phiên bản mới.'
    ]
  },
  {
    version: 'v26.08.06-b03',
    date: '06/08/2026',
    title: 'Tối Ưu Nhãn Phương Pháp Hóa Học',
    highlights: [
      'Tên phương pháp và nhãn được hiển thị rõ ràng, đầy đủ và đồng bộ hơn trên toàn hệ thống.',
      'Chỉ hiển thị các mã phương pháp hóa học đã được duyệt; loại bỏ các nhóm hoặc chỉ tiêu không phù hợp khỏi bộ chọn.'
    ],
    features: [
      'Mỗi mã phương pháp có mô tả tiếng Việt rõ ràng trong danh mục, bộ lọc và xuất file.',
      'Hệ thống cho phép gắn và lưu nhiều nhãn phương pháp cùng lúc cho một chất chuẩn hoặc báo cáo.'
    ],
    improvements: [
      'Thẻ nhãn đã chọn và bộ lọc hiển thị gọn hơn bằng cách kết hợp mã phương pháp và kỹ thuật phân tích, thay vì hiển thị tên quá dài.',
      'Vẫn có thể xem tên phép thử đầy đủ bằng cách rê chuột vào thẻ hoặc bộ lọc.',
      'Thẻ nhãn được tối ưu hiển thị trên màn hình nhỏ, tự động xuống dòng và không làm tràn khu vực nhập liệu.'
    ],
    fixes: [
      'Đảm bảo cửa sổ xem trước tài liệu luôn hiển thị nổi lên toàn màn hình, không bị các thanh công cụ che khuất.',
      'Loại bỏ các thiết bị bị trùng lặp khi tạo nhãn rút gọn và sử dụng cơ chế an toàn để dự phòng.',
      'Bổ sung các bước kiểm tra tự động để đảm bảo nhãn luôn hiển thị ngắn gọn nhưng giữ đúng mã thiết bị.'
    ]
  },
  {
    version: 'v26.08.06-b01',
    date: '06/08/2026',
    title: 'Cập Nhật Danh Mục Phương Pháp Hóa Học',
    highlights: [
      'Bổ sung 119 phương pháp hóa học mới: chỉ hiển thị các mã đã được duyệt, loại bỏ mục không hợp lệ khỏi bộ chọn.',
      'Gắn mô tả tiếng Việt chi tiết cho từng mã trong danh mục, bộ lọc và khi xuất báo cáo.'
    ],
    features: [
      'Cho phép một chất chuẩn và một báo cáo được gắn cùng lúc nhiều phương pháp.'
    ],
    improvements: [
      'Sắp xếp các mã phương pháp theo thứ tự tự nhiên (ví dụ: H-1.2, H-1.3, H-1.10) để dễ tra cứu.',
      'Hỗ trợ danh mục tĩnh dự phòng để hiển thị phương pháp trước khi người quản trị cập nhật dữ liệu chính thức.',
      'Giữ lại dữ liệu phương pháp cũ để đọc, nhưng chỉ cho phép gắn mới phương pháp hóa học.'
    ],
    fixes: [
      'Tăng cường kiểm tra và bảo mật tên phương pháp trên hệ thống để đảm bảo tính toàn vẹn dữ liệu.',
      'Bổ sung tự động kiểm tra cho toàn bộ mã phương pháp, tính năng sắp xếp và lựa chọn nhiều nhãn.'
    ]
  },
  {
    version: 'v26.08.05-b03',
    date: '05/08/2026',
    title: 'Quản Lý Nhãn Phương Pháp & Nhãn Thiết Bị',
    highlights: [
      'Bổ sung 119 mã phương pháp từ danh mục VILAS 2025; chỉ bao gồm các phương pháp thử hóa học.',
      'Hiển thị và lọc thiết bị theo máy phân tích (GCMS, LCMSMS...) mà không làm nặng hệ thống lưu trữ.',
      'Hỗ trợ thao tác thêm, xóa và thay thế nhãn hàng loạt với cơ chế xác nhận an toàn.'
    ],
    improvements: [
      'Đồng bộ quy trình báo trả chất chuẩn: nhân viên có thể thêm hoặc làm mới nhãn, quản lý quyết định nhãn cuối cùng.',
      'Quản lý tồn kho theo đơn vị: phân loại rõ (mg, ml, lọ...) và hiển thị tổng số lọ để tránh nhầm lẫn.',
      'Tối ưu danh mục nhãn: hỗ trợ nhãn tự tạo, giữ nguyên chữ viết hoa/thường và tương thích ngược với nhãn cũ.'
    ],
    fixes: [
      'Cảnh báo rõ ràng và ngăn chặn mất dữ liệu âm thầm khi thao tác vượt giới hạn số lượng nhãn cho phép.',
      'Tăng cường bảo mật và kiểm tra định dạng nhãn, ngăn chặn xóa nhãn sai quy định.',
      'Đảm bảo dữ liệu không bị ghi đè nhầm khi nhiều người cùng thao tác cập nhật nhãn hàng loạt.'
    ]
  },
  {
    version: 'v26.08.04-b10',
    date: '04/08/2026',
    title: 'Nâng Cấp Khả Năng Xem Tài Liệu',
    improvements: [
      'Cải thiện giao diện Giao Nhận Mẫu để cửa sổ xem tài liệu không bị thanh bên cạnh hoặc thanh công cụ che khuất.',
      'Khu vực chuyển trang bảng tính trên điện thoại được tối ưu: luôn hiển thị rõ, có cuộn ngang và không bị che ở mép dưới.',
      'Tăng cường khả năng xem PDF trên thiết bị di động; tài liệu vẫn hiển thị ngay cả khi công cụ sao chép chữ gặp sự cố.',
      'Lưu tạm trình xem tài liệu để mở file nhanh và ổn định hơn ngay cả khi mạng yếu hoặc bị ngắt kết nối.'
    ]
  },
  {
    version: 'v26.08.04-b09',
    date: '04/08/2026',
    title: 'Làm Gọn Màn Hình Yêu Cầu Chất Chuẩn',
    improvements: [
      'Bỏ 4 thẻ số liệu tổng quan không cần thiết ở đầu trang Yêu Cầu Chất Chuẩn để giao diện gọn hơn.',
      'Đưa trọng tâm về danh sách yêu cầu; các bộ lọc trạng thái vẫn hiển thị ngay phía trên để dễ thao tác.',
      'Giữ nguyên các cải tiến về tìm kiếm, tải thêm dữ liệu và cửa sổ thao tác nổi cho danh sách dài.'
    ]
  },
  {
    version: 'v26.08.04-b08',
    date: '04/08/2026',
    title: 'Cải Thiện Trải Nghiệm Màn Hình Nhỏ',
    improvements: [
      'Cửa sổ thao tác luôn hiển thị nổi bật ở giữa màn hình, kể cả khi đang cuộn xem danh sách rất dài.',
      'Bảng yêu cầu luôn hiển thị số lượng mục đang xem và nút tải thêm dữ liệu ngay tại khu vực thao tác.',
      'Giao diện tạo yêu cầu mới được chia thành các phần nhỏ giúp dễ theo dõi và chọn chất chuẩn hơn.',
      'Thanh tìm kiếm, bộ lọc và cách hiển thị danh sách được sắp xếp gọn hơn trên điện thoại.'
    ],
    fixes: [
      'Sửa lỗi cửa sổ xác nhận đôi khi bị lệch vị trí, bị che khuất hoặc gây khó hiểu khi thao tác từ danh sách dài.'
    ]
  },
  {
    version: 'v26.08.04-b07',
    date: '04/08/2026',
    title: 'Tối Ưu Tốc Độ Tải Nhật Ký Hoạt Động',
    improvements: [
      'Tối ưu tải nhật ký cá nhân: hệ thống chỉ tải phần dữ liệu mới nhất, giúp giao diện phản hồi tức thì và cập nhật trực tiếp.',
      'Giới hạn số lượng hoạt động tải về ban đầu để tiết kiệm dung lượng mạng và tăng tốc ứng dụng.'
    ],
    fixes: [
      'Khắc phục sự cố không tải được nhật ký do thiếu chỉ mục tìm kiếm trong cơ sở dữ liệu.'
    ]
  },
  {
    version: 'v26.08.04-b06',
    date: '04/08/2026',
    title: 'Tăng Tốc Tải Lịch Sử Sử Dụng Chuẩn',
    improvements: [
      'Lịch sử sử dụng chuẩn được phân trang, có nút tải thêm và vẫn giữ tính năng tìm bản ghi cũ nhất tự động.',
      'Lưu tạm dữ liệu danh mục phụ trợ trong 5 phút để chuyển qua lại các trang nhanh hơn, không phải tải lại.',
      'Thống kê lượng dữ liệu ứng dụng tải về để làm cơ sở tối ưu hóa lâu dài.'
    ]
  },
  {
    version: 'v26.08.04-b05',
    date: '04/08/2026',
    title: 'Giảm Thiểu Dữ Liệu Tải Không Cần Thiết',
    improvements: [
      'Giới hạn số lượng yêu cầu chờ và thông báo để ngăn ứng dụng tải một lượng lớn lịch sử không cần thiết.',
      'Tối ưu đồng bộ và khôi phục dữ liệu chuẩn giới hạn trong vòng 14 ngày khi thiết bị mất mạng lâu.',
      'Lưu tạm công thức phân tích để không phải tải lại mỗi khi mở lại màn hình.'
    ]
  },
  {
    version: 'v26.08.04-b04',
    date: '04/08/2026',
    title: 'Kiểm Soát Và Tối Ưu Lượng Dữ Liệu Hệ Thống',
    improvements: [
      'Bổ sung đo lường lượng dữ liệu ứng dụng tải về theo từng hạng mục để tối ưu lâu dài.',
      'Tránh tải lại những dữ liệu thống kê hoặc danh sách chuẩn đã có sẵn khi làm việc liên tục.',
      'Hạn chế dữ liệu tự động tải từ lịch sử thông báo hệ thống và yêu cầu mua hàng.',
      'Theo dõi hoạt động tải dữ liệu của quá trình đồng bộ hóa, tồn kho và thao tác của người quản trị.'
    ]
  }
];

// ===========================================================================
// PHẦN 2: 29 PHIÊN BẢN CŨ HƠN (từ v26.08.03-b01 trở về trước)
// Đọc từ file raw và làm sạch jargon
// ===========================================================================
const rawLegacy = JSON.parse(fs.readFileSync('scripts/_raw_legacy.json', 'utf8'));

// Bảng thay thế jargon - áp dụng cho mọi chuỗi
const jargonMap = [
  // Firebase / Firestore
  [/\bFirestore\b/g, 'hệ thống'],
  [/\bFirebase\b/g, 'hệ thống'],
  [/\bonSnapshot\b/g, 'đồng bộ dữ liệu'],
  [/\bsnapshot\b/gi, 'bản sao dữ liệu'],
  [/\bfailed-precondition\b/g, 'lỗi truy vấn'],
  [/\bcomposite index\b/gi, 'chỉ mục tìm kiếm'],
  [/\blistener\b/gi, 'kết nối theo dõi'],
  [/\bquery\b/gi, 'truy vấn'],
  [/\bpre-aggregated\b/g, 'tổng hợp sẵn'],
  [/\bbackfill\b/gi, 'bổ sung dữ liệu'],
  [/\bRules\b(?=\s+kiểm)/g, 'Quy tắc bảo mật'],
  [/\bFirestore Rules\b/g, 'Quy tắc bảo mật'],
  // Cache / Signal
  [/\bcache\b/gi, 'bộ nhớ tạm'],
  [/\bSignal\b/g, 'tín hiệu trạng thái'],
  [/\bsignal\b/g, 'trạng thái'],
  [/\boptimistic\b/gi, 'dự đoán trước'],
  [/\brace condition\b/g, 'xung đột dữ liệu đồng thời'],
  // SOP / API / Tech terms
  [/\bSOP\b/g, 'phương pháp'],
  [/\bOIDC\b/g, 'chuyển hướng'],
  [/\bRedirect\b(?!\s+(?:về|lại|sang|đến|mặc|trở))/g, 'chuyển hướng'],
  [/\bUID\b/g, 'định danh người dùng'],
  [/\bprovider\b/gi, 'phương thức đăng nhập'],
  [/\bproviderData\b/g, 'thông tin xác thực'],
  [/\bFirebase UID\b/g, 'định danh người dùng'],
  [/\bonboarding\b/gi, 'thiết lập ban đầu'],
  [/\bendpoint\b/gi, 'đường dẫn kết nối'],
  [/\blint\b/gi, 'kiểm tra mã nguồn'],
  [/\bpopup\b/gi, 'cửa sổ bật lên'],
  [/\bpopup-closed-by-user\b/g, 'người dùng đóng cửa sổ đăng nhập'],
  [/\breadonly\b/gi, 'chỉ đọc'],
  [/\bbatch\b(?=\s+(?:commit|write|set|update))/gi, 'nhóm thao tác'],
  [/\bcommit\b(?!\s+(?:lại|bản|đó|vào|cuối|đầu))/gi, 'lưu đồng bộ'],
  [/\bworkbook\b/gi, 'tệp Excel'],
  [/\bnguyên tử\b/g, 'đồng bộ hoàn toàn'],
  [/\bslot\b/gi, 'mã quản lý'],
  [/\bDeltaSync\b/g, 'đồng bộ gia tăng'],
  [/\bseed\b/gi, 'khởi tạo dữ liệu'],
  [/\bvercel\b/gi, 'môi trường triển khai thực tế'],
  [/\blocalhost\b/gi, 'môi trường thử nghiệm'],
  [/\bproduction\b/gi, 'môi trường thực tế'],
  [/\bAPI\b/g, 'giao tiếp hệ thống'],
  [/\bpayload\b/gi, 'dữ liệu gửi đi'],
  [/\bDrive\b(?=\s+(?:chỉ|được|khi))/g, 'Google Drive'],
  // Date issues
  [/\bDate Rollover\b/g, 'lỗi tính toán thời gian'],
  [/\bOff-by-one\b/g, 'lệch một đơn vị'],
  // Misc
  [/\bimport\b(?=\s+(?:chất|chuẩn|dữ|kết))/gi, 'nhập'],
  [/\bBook2\.xlsx\b/g, 'tệp Excel mẫu'],
  [/\bauto-fill\b/gi, 'tự động điền'],
  [/\bSafari\b/g, 'trình duyệt Safari'],
  [/\bBrave\b/g, 'trình duyệt Brave'],
  [/\bZalo\/Facebook\b/g, 'ứng dụng chat'],
  [/\bArray Spread\b/g, 'tương thích định dạng dữ liệu'],
  [/\bMap\.entries\(\)\b/g, 'dữ liệu danh sách'],
  [/init\.json\b/g, 'đường dẫn kết nối hệ thống'],
  [/\b__\/firebase\//g, ''],
];

function cleanText(text) {
  if (!text || typeof text !== 'string') return text;
  let result = text;
  for (const [pattern, replacement] of jargonMap) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

// Ghi đè tiêu đề cho các bản release từ Git nếu tiêu đề cũ vẫn còn jargon
const titleOverrides = {
  'v26.08.01-b08': 'Hoàn Tất Thiết Lập Mật Khẩu Sau Đăng Nhập Google',
  'v26.08.01-b07': 'Thiết Lập Mật Khẩu Trực Tiếp Từ Hồ Sơ Cá Nhân',
  'v26.08.01-b06': 'Liên Kết Đăng Nhập Google & Mật Khẩu Đơn Giản',
  'v26.08.01-b05': 'Hoàn Tất Kết Nối Đăng Nhập Google',
  'v26.08.01-b04': 'Đăng Nhập Google Ổn Định Trên Môi Trường Thực Tế',
  'v26.08.01-b03': 'Tăng Cường Ổn Định Đăng Nhập Google',
  'v26.08.01-b01': 'Khắc Phục Lỗi Đăng Nhập & Xem Tài Liệu PDF',
  'v26.07.31-b01': 'Tối Ưu Thống Kê & Khắc Phục Lỗi So Sánh Xu Hướng',
  'v26.07.29-b02': 'Nhập Chất Chuẩn Hàng Loạt An Toàn & Tái Sử Dụng Mã Quản Lý',
  'v26.07.29-b01': 'Tải File Excel Lớn Không Treo & Ghép Mẫu Phân Tích',
  'v26.07.28-b06': 'Hoàn Thiện Tải File Excel, Tên Bí Danh & Lưu Tệp Gốc',
  'v26.07.28-b05': 'Cải Thiện Giao Diện Nhập Kết Quả Từ Excel',
  'v26.07.28-b03': 'Sửa Lỗi Xem Tài Liệu Trên Thiết Bị Di Động',
  'v26.07.28-b02': 'Nâng Cấp Xem Tài Liệu Giao Nhận Mẫu',
  'v26.07.28-b01': 'Làm Gọn Công Cụ & Tự Động Cập Nhật Tồn Kho',
  'v26.07.27-b04': 'Làm Mới Toàn Bộ Giao Diện Ứng Dụng',
  'v26.07.27-b03': 'Cải Tiến Xem Báo Cáo, Khóa Mẻ & Chuẩn Hóa Kho',
  'v26.07.27-b02': 'Kiểm Soát Tạo Báo Cáo Phân Tích Chặt Chẽ Hơn',
  'v26.07.27-b01': 'Quy Chuẩn Định Dạng Số Đo Cho Chất Chuẩn',
  'v26.07.25-b01': 'Bù Nhật Ký Cũ & Tính Năng Đánh Dấu Hết Hàng',
  'v26.07.24-b02': 'Mở Khóa Trạm Pha Chế & Cải Tiến Thông Báo Cập Nhật',
  'v26.07.24-b25': 'Tối Ưu Danh Sách Kiểm Tra Công Việc & Bảng Hoạt Động',
  'v26.07.23-b24': 'Ổn Định Cập Nhật Mẻ Phân Tích & Bảo Vệ Lưu Trữ',
  'v26.07.23-b23': 'Mở Rộng Lập Mẻ Nhanh & Đẩy Nhanh Tốc Độ Ứng Dụng'
};

function cleanRelease(rel) {
  return {
    version: rel.version,
    date: rel.date,
    title: titleOverrides[rel.version] || cleanText(rel.title),
    highlights: Array.isArray(rel.highlights) ? rel.highlights.map(cleanText) : [],
    features: Array.isArray(rel.features) ? rel.features.map(cleanText) : [],
    improvements: Array.isArray(rel.improvements) ? rel.improvements.map(cleanText) : [],
    fixes: Array.isArray(rel.fixes) ? rel.fixes.map(cleanText) : []
  };
}

// Làm sạch dữ liệu legacy từ Git và các release được khôi phục từ lịch sử Git.
const cleanedLegacy = rawLegacy.map(cleanRelease);

// Loại trùng với nhóm release gần nhất.
const recentVersions = new Set(recentReleases.map(r => r.version));
const filteredLegacy = cleanedLegacy.filter(r => !recentVersions.has(r.version));

function releaseOrder(version) {
  const match = String(version || '').match(/^v(\d{2})\.(\d{2})\.(\d{2})-b(\d+)$/);
  if (!match) return 0;
  return Number(match[1]) * 1_000_000_000
    + Number(match[2]) * 10_000_000
    + Number(match[3]) * 100_000
    + Number(match[4]);
}

const uniqueReleases = new Map();
for (const release of [...recentReleases, ...recoveredReleases, ...filteredLegacy].map(cleanRelease)) {
  if (!uniqueReleases.has(release.version)) uniqueReleases.set(release.version, release);
}

const allReleases = [...uniqueReleases.values()]
  .sort((a, b) => releaseOrder(b.version) - releaseOrder(a.version));

fs.writeFileSync('scripts/legacy-releases.json', JSON.stringify(allReleases, null, 2));
console.log(`✅ Đã tạo scripts/legacy-releases.json với ${allReleases.length} phiên bản.`);
allReleases.forEach((r, i) => console.log(`  ${i + 1}. ${r.version} — ${r.title}`));
