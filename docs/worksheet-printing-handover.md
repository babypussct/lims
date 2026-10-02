# Bàn giao bỏ Hàng đợi in và tích hợp phiếu phân tích

Ngày thực hiện: **02/10/2026**. Thay đổi đã được gom vào release **`26.10.02-b01`** cùng Smart Prep và nền in. **Frontend đã phát hành và xác minh production** từ commit `ff0b9aa335393b47281d90b2dc44ff880a0e2074`. **Firestore Rules chưa deploy được do Firebase CLI chưa đăng nhập**; không coi bước này là hoàn tất. Xem [bằng chứng phát hành](release-26.10.02-b01.md).

## Phạm vi nghiệp vụ

In phiếu là một thao tác trên mẻ đã được duyệt. Người dùng có thể xem, in, tải PDF hoặc in lại nhiều lần. Hệ thống không lưu trạng thái đã in/chưa in, số lần in, người in hay sự kiện in vào timeline. Nhật ký duyệt, sửa thông số và chuyển SOP tiếp tục phản ánh thay đổi nghiệp vụ.

| Module | Thao tác mới / vai trò thay thế |
| --- | --- |
| Yêu cầu → Chờ duyệt | `Duyệt` hoặc `Duyệt & xem phiếu`. Preview chỉ mở sau giao dịch duyệt thành công. |
| Yêu cầu → Đã duyệt | `Phiếu phân tích` trên từng mẻ; `In nhiều phiếu` cho các mẻ trong danh sách đang lọc; mở Truy xuất; sửa thông số theo quyền và trạng thái. Người có quyền duyệt có thể xem các mẻ đã duyệt; tài khoản vận hành khác giữ phạm vi yêu cầu của mình ở module này. |
| SmartBatch | Sau khi tạo thành công, hiển thị các mã mẻ vừa tạo, mở chi tiết và `Xem & in phiếu các mẻ vừa tạo`. Danh sách này chỉ tồn tại trong phiên trang. |
| Calculator | Duyệt trực tiếp và xem phiếu; sửa mẻ hợp lệ tạo snapshot mới rồi mở phiếu. Mẻ cũ được tải bằng ID, không phụ thuộc việc có nằm trong 100 mẻ gần đây. |
| Kết quả | In một phiếu hoặc chọn nhiều phiếu trên danh sách đang lọc; giữ chức năng nhập/xem kết quả và PDF báo cáo. |
| Nhập kết quả / Chi tiết mẻ | Nút `Phiếu phân tích` mở worksheet của mẻ. Phiếu phân tích và PDF kết quả vẫn có mục đích riêng. |
| Truy xuất | In worksheet hiện hành khi tra cứu mã mẻ; in worksheet lịch sử khi mở đúng mã nhật ký hoặc snapshot; giữ `Xem & In hồ sơ` cho biên bản truy xuất; sửa thông số mẻ khi được phép. |

Tab/menu/component/service Hàng đợi in đã bị loại bỏ. URL cũ `/printing` chuyển đến `/results`. Không còn nút xóa khỏi hàng đợi, badge đếm phiếu hay listener riêng phục vụ hàng đợi.

## Cách sử dụng

1. Sau duyệt, chọn `Duyệt & xem phiếu` nếu cần xem ngay. Trên SmartBatch, dùng nhóm mẻ vừa tạo.
2. Để in theo đợt, vào **Yêu cầu → Đã duyệt** hoặc **Kết quả**, chọn ngày/bộ lọc, bấm **In nhiều phiếu**, đánh dấu các mẻ rồi chọn **Xem & in phiếu đã chọn**. Thứ tự phiếu theo thứ tự danh sách, không theo thứ tự nhấp checkbox.
3. Nếu cần mẻ cũ, dùng **Tải thêm mẻ** hoặc tra cứu trực tiếp mã mẻ. Bộ lọc/tìm kiếm trong danh sách chỉ áp dụng trên dữ liệu đã tải; nút Tải thêm không tự chạy vòng lặp đọc hết lịch sử.
4. Để in lại đúng phiên bản trước khi sửa mẻ, mở mã nhật ký hoặc snapshot của phiên bản đó ở Truy xuất. Để in phiên bản hiện hành, mở bằng mã mẻ.
5. Đợi **Bản in đã sẵn sàng**, kiểm tra trang rồi In/Tải PDF. Hủy hộp thoại không làm thay đổi dữ liệu nghiệp vụ.

Phiếu mới chứa mã nhật ký nghiệp vụ `traceLogId` và QR tới hồ sơ đó. Nhật ký trỏ tới snapshot bất biến nên có thể in lại đúng phiên bản. Đường truy xuất công khai vẫn chịu điều kiện `publicTraceable` hiện có; snapshot riêng chỉ được tải cho tài khoản có quyền. Phiếu cũ tiếp tục dùng mã mẻ khi không có liên kết nhật ký trong snapshot. Scanner nhận biết liên kết `/traceability/...` trước khi phân loại ID Firestore thành mã mẻ kết quả.

## Mô hình dữ liệu và tương thích

- `Request.currentPrintJobId?: string`: liên kết snapshot worksheet hiện hành, được ghi cùng giao dịch duyệt/sửa/chuyển SOP. Đây là con trỏ tài liệu, không phải trạng thái in.
- `PrintData.traceLogId?: string`: mã nhật ký duyệt/sửa/chuyển SOP gắn với snapshot. Thêm trường này không tạo thêm tài liệu hoặc sự kiện in.
- `artifacts/{APP_ID}/print_jobs/{id}`: giữ snapshot đầy đủ SOP, inputs, items, margin và metadata tạo phiếu. Snapshot vẫn bất biến; client không được cập nhật hoặc xóa.
- `Log.printJobId`: giữ liên kết lịch sử. Các cờ `printable` và metadata hàng đợi cũ không bị backfill hoặc xóa hàng loạt. Không có writer mới đặt `printable: true` để lập hàng đợi.

Không cần migration dữ liệu bắt buộc hoặc composite index mới. Mẻ cũ chưa có con trỏ được tìm snapshot theo `requestId`, chọn phiên bản mới nhất theo `createdAt`, rồi dùng public projection/nhật ký gốc nếu chỉ còn payload nhúng. Nếu payload không đầy đủ hoặc snapshot được chỉ định không tồn tại, toàn bộ nhóm chọn bị chặn và hiển thị lỗi. Hệ thống không tự dựng lại phiếu lịch sử từ SOP hiện tại hoặc âm thầm đổi sang phiên bản khác.

Trường hợp rất cũ chỉ có payload nhúng ở một nhật ký khác với public projection hiện hành: tra cứu chính mã nhật ký chứa phiếu gốc. Không có dữ liệu gốc thì không thể bảo đảm bản in lịch sử; tác vụ này không tạo dữ liệu thay thế bằng suy đoán.

## Tối ưu Firebase Spark

| Thay đổi | Tác động cụ thể |
| --- | --- |
| Gỡ `PrintQueueService` | Không còn query realtime `printable == true` hoặc đọc badge hàng đợi khi mở Requests. Các listener nghiệp vụ khác vẫn hoạt động theo thiết kế hiện có. |
| Dùng chung `BatchWorksheetService` | Chỉ đọc snapshot khi người dùng mở phiếu; truy vấn ID theo nhóm tối đa 30. Chọn N snapshot mới vẫn là N document reads, không phải một read vì gom query. |
| Cache snapshot | Tối đa 100 snapshot trong bộ nhớ của service, dùng lại giữa các module; gộp lượt đọc đồng thời; đổi tài khoản/quyền/phạm vi sẽ xóa cache và preview đã mở bởi service. Không bổ sung lưu worksheet vào localStorage. |
| Tương thích mẻ cũ | Cache ánh xạ request → snapshot trong 30 giây để hạn chế đọc lặp; query legacy có thể đọc nhiều revision của một mẻ. Mẻ mới có con trỏ nên không cần query lịch sử này. |
| Recent feed dùng chung | Giới hạn cold-start mẻ gần đây từ 300 xuống 100, giữ DeltaSync hiện có. Đây là giới hạn dữ liệu/cold-start của feed, không phải cam kết tổng reads mỗi ngày. |
| Lịch sử tải từng phần | Mỗi thao tác đọc tối đa 24 tài liệu cho mỗi dạng ngày `analysisDate`, `approvedAt`, `timestamp`: tối đa 72 tài liệu trả về. Vẫn có thể đọc trùng tài liệu giữa các dạng ngày; kết quả hiển thị được khử trùng. |
| Cache khoảng ngày | Dùng chung giữa Requests/Results, tối đa 8 khoảng trong 5 phút; quay lại một khoảng còn mới dùng cache. `Tải lại danh sách` bắt đầu lại từ trang đầu; `Tải thêm` nối tiếp cursor. |
| Duyệt/sửa/chuyển SOP | Ghi con trỏ trong tài liệu request sẵn có. Không đọc/cập nhật hàng loạt log hàng đợi cũ để đánh dấu superseded. |
| In/xuất PDF/hủy | Không ghi `isPrinted`, `printCount`, `printAudit`, trạng thái hàng đợi hay nhật ký in vào Firestore. |

Đây là giới hạn đường đọc trong mã nguồn và kết quả fixture, không phải số đo quota của project production. Firestore có thể tính lượt đọc tối thiểu của query rỗng, document reads do Security Rules và các thành phần khác theo [tài liệu tính phí Firestore](https://firebase.google.com/docs/firestore/pricing). Quota Spark áp dụng cho toàn project; tham khảo [Firestore quotas](https://firebase.google.com/docs/firestore/quotas). Giữ việc đọc đầy đủ của báo cáo/nhãn nghiệp vụ để không đổi độ chính xác của báo cáo lấy ít reads hơn.

## Quyền và bảo toàn dữ liệu

Sửa thông số chỉ áp dụng cho mẻ `approved`, chưa có kết quả/summary/detail, không phải master ảo hoặc mẻ con, và không bị người khác khóa. Cần quyền duyệt. Kiểm tra được thực hiện ở UI, giao dịch service và Firestore Rules. Giao dịch đọc lại request, khóa và phiên bản cập nhật trước khi ghi để tránh sửa trên dữ liệu đã thay đổi. Chuyển SOP vẫn dùng protocol riêng, tạo snapshot mới và giữ snapshot trước đó.

Mở phiếu cần tài khoản có quyền SOP, vận hành mẻ, duyệt hoặc báo cáo; chế độ audit chất chuẩn không được mở worksheet. Đọc hoàn tất sau khi đổi phạm vi không được mở preview. Việc thay đổi này không cấp quyền công khai cho `print_jobs`.

## Xác minh và bàn giao

- `npm run release:verify`: runtime, lint, toàn bộ test trong repository (gồm emulator), UI zero-jump, typecheck application/API và production build.
- `npm run test:printing`: loader/cursor/cache, refresh lịch sử, QR, quyền sửa, thứ tự phiếu, lỗi thiếu dữ liệu và helper in. Bộ mới có 30 test ở thời điểm bàn giao.
- Firestore Emulator: quyền đọc snapshot, immutable snapshot, con trỏ lúc duyệt, chặn sửa khi đã nhập kết quả/khóa, chuyển SOP giữ snapshot cũ; bộ Rules hiện có cùng test mới đều qua.
- `node scripts/worksheet-workflow-smoke.js`: AOT + Edge headless, adapter Firestore giả lập; header projection, đọc từng phần, cache khoảng ngày/cache phiên, chọn nhiều, lỗi thiếu phiếu, đổi tài khoản, mobile/Escape.
- `node scripts/print-preview-smoke.js`: renderer/PDF thực tế; phiếu 84 dòng qua 7 trang và bảng 160 dòng, đủ QR/dòng, native PDF, tải PDF, cleanup, mobile và các biểu mẫu dùng chung.

Script trình duyệt dùng `PLAYWRIGHT_MODULE` nếu Playwright nằm ngoài `node_modules`. Trên môi trường này module ở runtime Codex đã có sẵn; không thêm dependency mới vào ứng dụng. Artifacts/ảnh/PDF nằm ở thư mục tạm được script in ra. Log nghiệm thu của tác vụ nằm trong `.codex-tmp/worksheet-handover/` (Git ignored).

Chưa xác minh bằng tài khoản production, dữ liệu production hoặc máy in giấy tại phòng lab. Trước vận hành, kiểm tra một mẻ duyệt mới, một mẻ legacy, một phiếu trước/sau sửa hoặc chuyển SOP, và một nhóm nhiều phiếu trên máy in thực tế. Fixture không thay thế việc đo khổ/lề và quét QR trên bản giấy.

## Phát hành

Thực hiện theo `DEPLOYMENT.md`: cập nhật `release-notes.json`, chạy `release:prepare`, `release:verify`, review đúng diff, commit và kiểm tra `release:prepush`, rồi push qua Git Integration/Deployment Checks. Triển khai Firestore Rules mới từ commit đã push và kiểm tra chặn sửa/đổi SOP trước nghiệm thu. Không cần deploy composite index cho thay đổi này.

Tác vụ phát triển ban đầu giữ lại các thay đổi Smart Prep và nền in trong checkout. Theo yêu cầu phát hành toàn bộ thay đổi trên `main`, đã gom đủ 75 file vào commit release `ff0b9aa3`, chạy gate, push và phát hành frontend qua Git Integration. GitHub Release Gate, Vercel Deployment Check và kiểm tra public runtime đã đạt cho đúng SHA release. Bộ Rules mới đã qua emulator nhưng deploy production dừng ở lỗi xác thực Firebase; cần hoàn tất bước này và kiểm tra bằng tài khoản production trước nghiệm thu nghiệp vụ.
