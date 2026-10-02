# Bằng chứng phát hành v26.10.02-b01

Ngày phát hành: **02/10/2026**, theo giờ Việt Nam. Tiêu đề: **In phiếu phân tích trực tiếp và đơn giản hóa Trạm Pha Chế**.

**Frontend và Firestore Rules đã triển khai thành công trên production.** Frontend được xác minh qua public runtime; Rules được đọc lại qua API và đối chiếu nội dung với mã nguồn release.

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

## Firestore Rules production

Lần đầu deploy dừng ở lỗi xác thực Firebase. Sau khi đăng nhập bằng `npx.cmd --yes --package firebase-tools@14.27.0 firebase login`, đã chạy lại `npm.cmd run deploy:rules` từ `85f8f786d63c3bbeeff8fb2eac6028748e713f67`. Đây là commit tài liệu sau release; nội dung `firestore.rules` không thay đổi so với `ff0b9aa3`. `release:predeploy` xác nhận `main`, working tree sạch và `HEAD` trùng SHA remote.

| Bằng chứng Rules | Kết quả |
| --- | --- |
| Project | `lims-cloud-by-otada` |
| Firebase CLI | Exit code **0**; `rules file firestore.rules compiled successfully`, `released rules firestore.rules to cloud.firestore`, `Deploy complete!` |
| Release production | `projects/lims-cloud-by-otada/releases/cloud.firestore` |
| Ruleset | `projects/lims-cloud-by-otada/rulesets/8fd50ee1-908b-40b7-a7e9-e6b3e37a81b2` |
| Thời gian cập nhật | **13:52:10 ngày 02/10/2026** (`2026-10-02T06:52:10.051785Z`) |
| Đối chiếu Rules API | Nội dung production khớp `main` và commit frontend release; chỉ chuẩn hóa CRLF/LF và khoảng trắng cuối file trước khi so sánh |
| SHA-256 nội dung đã chuẩn hóa | `baa8083d98509e22b22a6df19b6b0c0caeafe5f1996acc5f4ff308a254a8404a` |

Đối chiếu Rules production hoàn tất lúc **13:53:06 ngày 02/10/2026**. Log CLI được lưu tại `.codex-tmp/release-2026-10-02/firebase-deploy-authenticated.log`; metadata và checksum tại `firebase-rules-evidence.json` trong cùng thư mục, không chứa token. Không deploy index hoặc migration dữ liệu vì release không có thay đổi tương ứng. Kiểm tra bằng tài khoản nghiệp vụ production và máy in thực tế vẫn thuộc nghiệm thu vận hành.
