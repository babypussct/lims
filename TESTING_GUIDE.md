# Hướng dẫn kiểm tra thực tế

Khi kiểm tra ứng dụng và gặp bước đăng nhập, sử dụng luồng **Đăng nhập quản trị** / **Tài khoản**, sau đó đăng nhập bằng mật khẩu LIMS.

Credential kiểm thử không được ghi trong repository. Khi cần authenticated verification, agent phải đọc credential từ secret cục bộ:

- File: `/Users/otada/.codex/secrets/lims-admin.env`
- `LIMS_ADMIN_USERNAME`
- `LIMS_ADMIN_PASSWORD`

Dùng nguyên văn giá trị sau dấu `=`; không tự thêm khoảng trắng, không đưa giá trị vào log, báo cáo, ảnh chụp, fixture, commit hoặc file Git-tracked. Không yêu cầu người dùng nhập lại nếu secret cục bộ còn tồn tại. Nếu trình duyệt đã có phiên đăng nhập hợp lệ thì ưu tiên dùng lại phiên đó.

Sau khi đăng nhập, kiểm tra đúng trang/route yêu cầu. Nếu Firebase từ chối credential thì báo rõ đây là blocker môi trường, không ghi lại credential trong báo cáo.

## Release gate cho Excel

Khi kiểm tra `/documents`, ưu tiên một workbook `.xlsx` thật có nhiều sheet. Kiểm tra tối thiểu:

- chuyển sheet, chọn ô, name box, formula bar và zoom;
- merge, công thức và date/date-time;
- freeze pane, hyperlink, comment/note và autofilter nếu workbook có khai báo;
- cảnh báo rõ ràng khi có conditional formatting, data validation, table hoặc drawing chưa được preserve;
- badge `Chỉ đọc` và xác nhận không có thay đổi nào được ghi về file gốc.

Với `.xls` cũ, chấp nhận cảnh báo `Metadata giới hạn`; không coi freeze pane hoặc metadata nâng cao là đã được preserve nếu chưa có bằng chứng riêng cho định dạng đó. Contract production đầy đủ được ghi tại `docs/excel-preservation-contract.md`.

## Kiểm tra preview và xuất phiếu in

Chạy `npm run test:printing` để kiểm tra tải đủ dữ liệu, thứ tự hàng đợi, tài nguyên QR/ảnh, hình học decal, adapter bàn giao/SOP/truy xuất và dọn vùng in sau khi kết thúc/hủy/lỗi. Bộ test này cũng nằm trong `npm run test:ui-contracts`. Chạy `npm run test:inventory` cho đối soát lịch sử thẻ kho và phạm vi phiếu kiểm kê.

Chạy `npm run test:prep` để kiểm tra các phép tính, luồng Smart Prep và adapter phiếu của cả năm chế độ: pha dung dịch đích, xác định nồng độ, thêm chuẩn, dãy chuẩn/QC và quy đổi kết quả. Các test phiếu kiểm tra snapshot, metadata/đơn vị, lượng dự tính/thực tế, công thức/cảnh báo, phần thêm/phạm vi/ngoại lệ và chặn xuất không hợp lệ.

Chạy fixture trình duyệt bằng `node scripts/print-preview-smoke.js`. Script cần Playwright; nếu module không nằm trong `node_modules` của dự án, đặt biến `PLAYWRIGHT_MODULE` trỏ tới module Playwright đã có trong môi trường. Mặc định dùng Edge headless; có thể chọn kênh khác qua `PRINT_BROWSER_CHANNEL` khi môi trường hỗ trợ.

Fixture biên dịch AOT component thực tế, dùng CSS/font của ứng dụng và giả lập các service dữ liệu. Không cần đăng nhập, không gọi Firebase/Drive thật và không ghi dữ liệu nghiệp vụ. Script kiểm tra phiếu lẻ/chẵn, bảng dài, thứ tự/đầy đủ dòng, QR canvas, số trang PDF tải xuống/native, cleanup, mobile/light/dark/Escape, dòng quá dài, tải PDF đua thứ tự và metadata sau lỗi in. PDF và ảnh QA được lưu vào thư mục tạm được in ra khi chạy; dùng Poppler để render tất cả trang và xem bố cục sau khi sửa renderer.

Mặc định script cũng kiểm tra lịch trực toàn bộ/cá nhân, Checklist dạng danh sách/gọn ở cả hai hướng giấy, nhãn chất chuẩn bắt đầu ở ô cuối và qua nhiều tờ, QR/mã nội bộ, preset không vừa A4 và vòng đời iframe nhãn mẫu. Sáu fixture biểu mẫu mới gồm kiểm kê 60 vật tư, thẻ kho 60 sự kiện, bàn giao 60 mẫu, SOP 30 vật tư, truy xuất 60 sự kiện và nhãn sang chiết; kiểm tra đủ dòng và số trang ở cả hai đường PDF.

Preview Smart Prep được kiểm tra cho cả năm chế độ và bốn cách tạo dãy chuẩn. Fixture dãy trực tiếp 40 điểm kiểm tra từng ô/thứ tự dòng, phân trang, đầu bảng lặp, PDF tải xuống/native; phần công thức phải xuất đủ khi đang thu gọn trên màn hình. Có thể đặt `PRINT_SMOKE_SCOPE=prep` để chỉ chạy phần Smart Prep khi đang chỉnh mẫu này. Chạy lại script mặc định khi sửa helper xuất A4 dùng chung để kiểm tra toàn bộ đường in.

Nghiệm thu vận hành tại đơn vị cần kiểm tra thêm dữ liệu thật trên hàng đợi, xác thực/tải/in PDF Drive và in/hủy/in lại trên máy in thực tế. Fixture xác nhận QR đã render nhưng không thay thế kiểm tra quét mã và kích thước giấy trên bản in vật lý. Preset Standards Tomy 138 và Labels Tomy 149 hiện không vừa giới hạn A4 và bị chặn; không sửa kích thước bằng suy đoán. Hướng dẫn sử dụng, xử lý lỗi và phụ thuộc nghiệp vụ được ghi tại `docs/printing-handover.md`.
