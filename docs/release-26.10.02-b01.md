# Bằng chứng phát hành v26.10.02-b01

Ngày phát hành: **02/10/2026**, theo giờ Việt Nam. Tiêu đề: **In phiếu phân tích trực tiếp và đơn giản hóa Trạm Pha Chế**.

**Frontend đã phát hành và xác minh trên production. Firestore Rules chưa triển khai được do thiếu xác thực Firebase CLI.**

## Phạm vi và nguồn phát hành

- Baseline trước release: `e87a197e483f815fa7ca94fc9a1176097f402306`.
- [Commit release](https://github.com/babypussct/lims/commit/ff0b9aa335393b47281d90b2dc44ff880a0e2074): `ff0b9aa335393b47281d90b2dc44ff880a0e2074`, đã push lên `main`.
- Toàn bộ 75 file thay đổi trong checkout đã được đưa vào release; 53 file production có release metadata hợp lệ khi đối chiếu trực tiếp baseline.
- Nội dung gồm worksheet trực tiếp/multi-select, lịch sử tải từng phần, QR truy xuất đúng phiên bản, điều kiện sửa mẻ, Smart Prep với thư viện/công thức hóa học, viewer báo cáo và bố cục bảng theo dõi mẫu.
- Version, changelog và lịch sử được sinh bằng `release:prepare` từ `release-notes.json`; không phát sinh version thứ hai cho tài liệu bằng chứng.

## Kiểm chứng local

| Kiểm tra | Kết quả |
| --- | --- |
| `npm run release:verify` | Exit code 0; runtime, lint, toàn bộ test/emulator, UI zero-jump, typecheck application/API và production build đạt |
| Tổng các nhóm Node test | 1.195 test đạt; 0 thất bại, bỏ qua hoặc hủy |
| `prep-bench-smoke.js` | 5 chế độ, picker offline, thông số nguồn nhập tay, copy, desktop/mobile/dark và privacy đạt |
| `worksheet-workflow-smoke.js` | Lịch sử giới hạn theo trang, cache phạm vi/phiên, chọn nhiều theo thứ tự, thiếu snapshot, đổi tài khoản và mobile/Escape đạt |
| `print-preview-smoke.js` | Phiếu SOP 84 dòng/7 trang và 160 dòng/9 trang; PDF, checklist, lịch trực, nhãn và 6 biểu mẫu nghiệp vụ đạt |
| Review và Git gates | `git diff --check`, kiểm tra secret pattern, `release:prepush` và đồng bộ SHA local/remote đạt |

Fixture trình duyệt dùng dữ liệu giả lập; không ghi dữ liệu production. Log local, ảnh và JSON bằng chứng được lưu tại `.codex-tmp/release-2026-10-02/` và không nằm trong Git.

## Frontend production

| Bằng chứng | Kết quả |
| --- | --- |
| [GitHub Release Gate #36974098631](https://github.com/babypussct/lims/actions/runs/36974098631) | `completed / success` cho đúng commit release |
| `Vercel - nafiqpm6: release-verify` | `success`, liên kết đúng job verify của release |
| [Vercel deployment](https://vercel.com/babypusscts-projects/nafiqpm6/EM9V1UiJLrNcxkcMf9gZK2B8zEK4) | `success / Deployment has completed`; GitHub deployment `6802816281`, environment `Production`, đúng SHA release |
| [URL deployment](https://nafiqpm6-6nxt5y1fd-babypusscts-projects.vercel.app) / [domain production](https://nafiqpm6.vercel.app) | Domain chính phục vụ `v26.10.02-b01`; không chạy deploy CLI thủ công |
| HTTP | `/`, `/ngsw.json`, `/release-history.json`, `/changelog`, `/index.html`, main JS và CSS trả 200 |
| Nội dung release | Manifest và release history cùng version/title mới |
| Service worker manifest | SHA-1 của index HTML, main JS và CSS đang phục vụ khớp `hashTable` |
| Public runtime | Trang đăng nhập, modal Nhật Ký Cập Nhật và `/#/changelog` hiển thị bản mới ở 1366×900 và 390×844; không `pageerror`, không tràn ngang |

Kiểm tra public runtime bắt đầu lúc **13:39:45 ngày 02/10/2026** (`2026-10-02T06:39:45.621Z`). Ảnh desktop/mobile đã được xem lại. Chưa kiểm tra nghiệp vụ với tài khoản production hoặc máy in vật lý.

## Firestore Rules còn chờ

Đã chạy `npm run deploy:rules` từ commit release sau push. `release:predeploy` xác nhận `main`, working tree sạch và `HEAD` trùng SHA remote. Firebase deploy trả exit code **1** với lỗi **`Failed to authenticate, have you run firebase login?`**. `firebase login:list` xác nhận chưa có tài khoản được ủy quyền. Rules production chưa được cập nhật bởi tác vụ này.

Sau khi đăng nhập tài khoản có quyền với project `lims-cloud-by-otada`, chạy lại `npm run deploy:rules`, lưu output CLI thành công và cập nhật bằng chứng. Không cần deploy index hoặc migration dữ liệu cho release này. Đặc biệt cần hoàn tất Rules để áp dụng kiểm soát sửa worksheet tại database; kết quả emulator không chứng minh Rules production đã thay đổi.
