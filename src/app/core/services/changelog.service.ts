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
