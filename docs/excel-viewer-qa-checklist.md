# Excel Viewer QA Checklist

Ngày kiểm tra: 2026-08-24\
Môi trường baseline: production `https://nafiqpm6.vercel.app/#/documents`\
Môi trường xác nhận sau sửa: local `http://127.0.0.1:4200/#/__excel-demo`\
Phiên bản workspace: `26.08.24-b05`\
Trình duyệt chính: Chrome trên macOS\
File tái hiện: `Chuyen_mau_hoa__22-08_2026.xlsx` — 120.0 KB

> Các mục A–G ghi nhận hiện trạng production trước khi sửa. Mục H là kết quả xác nhận sau sửa trên cùng boundary viewer bằng workbook demo có dữ liệu thật; production cần smoke test lại sau khi deploy.

## A. Chuẩn bị và bằng chứng

- [x] PASS — Xác định file, route, môi trường và phiên bản kiểm tra.
- [x] PASS — Chụp ảnh hiện trạng trước khi thao tác.
- [x] PASS — Ghi nhận số sheet và tên sheet hiển thị trong DOM.
- [x] PASS — Chạy bộ test tự động của Documents/Excel Viewer: `73/73`.

## B. Smoke test P0 — hiển thị workbook

- [x] PASS — Mở file tái hiện từ mục Tài liệu.
- [x] PASS — Chờ viewer kết thúc loading.
- [x] FAIL — Vùng bảng không có hàng, cột hoặc ô nhìn thấy; canvas có chiều cao `0`.
- [x] FAIL — Với workbook 7 sheet, tab bị xếp dọc; mỗi tab rộng toàn viewport `1896px`.
- [x] PASS — Đóng và mở lại cùng file; lỗi vẫn tái hiện.
- [ ] BLOCKED — Chưa hoàn tất resize viewport thủ công; lần thử viewport override làm tab kiểm tra mất kết nối, đã khôi phục bằng tab mới.
- [x] FAIL — Workbook một sheet `DL08-2026(92)-2.xlsx` cũng trắng; lỗi không chỉ do file nhiều sheet.
- [ ] BLOCKED — Chưa mở thêm workbook nhiều sheet thứ hai ngoài file tái hiện.

## C. Thanh sheet và layout

- [x] PASS — Có đủ 7 sheet trong DOM: `C`, `EU`, `K`, `U`, `H`, `HL thuy san`, `HL nước`.
- [x] PASS — Sheet đang chọn được đánh dấu trong DOM.
- [x] PASS/PARTIAL — Chuyển được `C` → `EU` → `HL nước` → `C` theo trạng thái tab; dữ liệu vẫn không nhìn thấy.
- [ ] BLOCKED — Chưa kiểm tra sheet tab sau resize.
- [ ] BLOCKED — Chưa kiểm tra trực tiếp viewport mobile 390/360/320 px.
- [ ] BLOCKED — Chưa đánh giá cuộn trên vùng bảng vì canvas không có chiều cao.
- [x] PASS/PARTIAL — `Vừa chiều rộng` đổi zoom từ `100%` xuống `63%`; Reset trả lại `100%`. Canvas vẫn trắng.

## D. Công cụ tra cứu và view-only

- [x] PASS/PARTIAL — Chọn nhanh vùng dữ liệu cập nhật nhãn thành `A1:Z87` và `A2:CB27`; dữ liệu đã được nạp vào model.
- [x] PASS/PARTIAL — Nút tương đương `Ctrl+A` hoạt động; chưa kiểm tra riêng phím tắt do canvas trắng.
- [x] PASS/PARTIAL — `Ctrl+F`/nút tìm kiếm mở được dialog; không thể xác nhận highlight kết quả trên canvas trắng.
- [x] PASS — `Ctrl+G`/nút đi tới ô mở dialog và điều hướng được vùng mặc định.
- [x] FAIL — Sao chép vùng cho clipboard rỗng sau khi click vùng bảng; cần kiểm tra lại sau khi canvas render.
- [x] PASS/PARTIAL — Filter tạm được bật và hiển thị trạng thái `Filter · 1 cột`; Sort không phát lỗi; chưa xác nhận kết quả hiển thị.
- [x] PASS/PARTIAL — Wrap text, căn giữa, Autofit, vừa chiều rộng và Reset đã được bấm; Reset xóa trạng thái Filter/Zoom tạm.
- [x] PASS — Vùng viewer không có `contenteditable="true"` hoặc input/textarea; menu mặc định của Univer không xuất hiện.
- [x] PASS — Menu `Thêm công cụ xem` chỉ hiển thị các lệnh tra cứu/layout/copy/reset; không có Cut/Paste/Delete/Insert/Rename/Save.

## E. Độ trung thực workbook và metadata

- [x] FAIL/PARTIAL — Không thể đối chiếu trực quan ô neo, công thức, số và text; vùng chọn chứng minh dữ liệu đã nạp nhưng canvas trắng.
- [ ] BLOCKED — Chưa kiểm tra ngày và date-time trực tiếp trên viewer.
- [ ] BLOCKED — Chưa kiểm tra merge cell, font, màu, căn lề và kích thước hàng/cột trực quan.
- [ ] BLOCKED — Chưa kiểm tra freeze pane trực quan.
- [ ] BLOCKED — Chưa kiểm tra hyperlink và note/comment trực quan.
- [x] PASS/PARTIAL — File tái hiện hiển thị cảnh báo AutoFilter nguồn không đủ hàng; Filter tạm vẫn tạo được.
- [ ] BLOCKED — Chưa kiểm tra đủ cảnh báo conditional formatting/data validation/table/drawing.
- [ ] BLOCKED — Chưa mở thêm `.xls`, `.xlsm`, `.csv` hoặc workbook Google Sheets export.

## F. Lỗi, mạng và hiệu năng

- [x] PASS — Đóng/mở lại viewer vẫn tải được model và tái hiện cùng lỗi.
- [ ] BLOCKED — Chưa mô phỏng lỗi mạng/file không tải được.
- [ ] BLOCKED — Chưa kiểm tra workbook lớn và cảnh báo truncation.
- [ ] BLOCKED — Chưa chuyển sheet trong lúc loading.
- [x] FAIL — Dù không có console error, lỗi layout/canvas đã làm toàn workbook trắng; cần sửa trước khi đánh giá error boundary của tiện ích.

## G. Kết luận

- [x] FAIL — Lỗi P0 candidate đã được tái hiện và có ảnh/DOM metrics.
- [x] PASS/PARTIAL — Đã xác định lỗi xảy ra ít nhất ở workbook nhiều sheet và workbook một sheet; chưa kiểm tra mọi định dạng file.
- [x] PASS — Defect được ghi nhận trong checklist này với bước tái hiện và bằng chứng kỹ thuật.
- [x] PASS — Đã có bản sửa và đã chạy smoke test sau sửa trên môi trường local.
- [x] PASS — Test tự động đạt `73/73` và build đạt; kiểm tra trình duyệt sau sửa render canvas bình thường trên local.

## Bằng chứng hiện tại

- Ảnh chụp hiện trạng: vùng bảng trắng; sheet tab bị dồn dọc ở mép trái.
- DOM: viewer có `region "Bảng tính Excel chỉ đọc"`, 7 tab sheet và tab `C` đang selected.
- Test tự động: `73/73` pass.
- Build: `npm run build` pass; chỉ có cảnh báo CommonJS dependency của Univer.
- Kết quả baseline: lỗi render/layout P0 candidate; chưa kết luận file nguồn bị hỏng.

## H. Xác nhận sau sửa

- [x] PASS — Chuyển sáu gói CSS của Univer từ import trong component sang global styles của Angular trong `angular.json`.
- [x] PASS — Gỡ import CSS khỏi component để tránh stylesheet bị scope hóa đối với DOM động do Univer tạo ra.
- [x] PASS — Bổ sung regression guard: test buộc CSS Univer phải nằm trong global styles và không được import lại trong component.
- [x] PASS — Local viewer tạo được workbook và hiển thị canvas có kích thước dương: `1590×502px`; host có chiều cao `539px`.
- [x] PASS — Tab sheet hiển thị theo hàng ngang với `display: flex`, `flex-direction: row`; đủ 3 sheet demo: `Kết quả`, `Tóm tắt`, `Hướng dẫn`.
- [x] PASS — Chuyển `Kết quả` → `Tóm tắt`, chọn vùng dữ liệu và dựng lại workbook vẫn giữ canvas hiển thị, không trắng màn hình.
- [x] PASS — Tìm kiếm mở dialog và nhận từ khóa `Caffeine`; đi tới ô `B3` đóng dialog và không tạo alert lỗi.
- [x] PASS — Filter mở được bảng điều kiện `Filter · 1 cột`; Hủy bỏ và Đặt lại cách xem hoạt động.
- [x] PASS — Vừa chiều rộng, Căn giữa, Wrap text, Autofit, Sort A→Z, Sort Z→A và Reset đều thao tác được, canvas vẫn có kích thước dương.
- [x] PASS — Lệnh sao chép vùng qua menu ngữ cảnh báo thành công `Đã sao chép dữ liệu từ bản xem trước.`; công cụ kiểm tra clipboard của Chrome không đọc lại được nội dung clipboard hệ thống nên kết quả nội dung cần xác nhận thêm khi chạy trên máy người dùng.
- [x] PASS — Bề mặt chỉ đọc không có `contenteditable="true"`, input hoặc textarea; menu Univer mặc định không xuất hiện.
- [x] PASS — Không ghi nhận console error của Excel Viewer sau các thao tác; các cảnh báo Firebase cleanup trên local là cảnh báo quyền thông báo không liên quan đến viewer.
- [x] PASS — `npm run test:documents`: `73/73` pass.
- [x] PASS — `npm run build`: pass; chỉ còn cảnh báo CommonJS dependency vốn có của Univer, không có lỗi build.
- [ ] BLOCKED — Chưa deploy production; URL production vẫn cần được kiểm tra lại sau khi bản sửa được phát hành.

## Defect EXCEL-VIEW-001

**Tiêu đề:** Excel Viewer tạo được workbook nhưng canvas có chiều cao `0`, vùng bảng trắng; tab nhiều sheet bị xếp dọc.

**Mức độ:** P0/S1 — chặn khả năng xem dữ liệu Excel.

**Trạng thái:** Đã sửa trong mã nguồn và xác nhận local; production pending deploy.

**Tái hiện:**

1. Mở `/documents` trên production.
2. Mở `Chuyen_mau_hoa__22-08_2026.xlsx`.
3. Chờ loading kết thúc.
4. Quan sát vùng bảng.

**Kết quả thực tế:**

- Workbook 7 sheet tạo đủ tab nhưng tab lần lượt có cùng chiều rộng `1896px`, cao `24px` và xếp theo các dòng dọc.
- Canvas có chiều rộng khoảng `1896px` nhưng chiều cao `0px`.
- Workbook một sheet `DL08-2026(92)-2.xlsx` cũng có canvas cao `0px`, nên lỗi không phụ thuộc riêng vào số sheet hoặc file tái hiện.
- Nút chọn vùng vẫn nhận diện dữ liệu: `A1:Z87` ở file đầu và `A2:CB27` ở file thứ hai.
- Console không ghi nhận error/warning trong phiên kiểm tra.

**Nhận định kỹ thuật trước sửa:**

- Parser/model đã nạp workbook vì vùng dữ liệu, sheet và thống kê được cập nhật.
- Lỗi nằm ở lớp render/layout của Univer hoặc CSS utility của Univer, trước mắt thể hiện qua các ancestor `.univer-grid`, `.univer-flex` và `.univer-h-full` đều có `display: block` thay vì layout grid/flex; section chứa canvas có chiều cao `0px`.
- Đây là bằng chứng baseline trước sửa. Đã kiểm tra CSS bundle và xác nhận các preset CSS của Univer cần được nạp ở cấp global để áp dụng cho DOM động.

**Kết quả xử lý:**

- Đã xác nhận nguyên nhân là CSS utility của Univer không được áp dụng đúng phạm vi cho DOM động, làm `.univer-flex`, `.univer-grid` và `.univer-h-full` mất layout; hậu quả là canvas cao `0px`.
- Đã đưa CSS preset cần thiết vào global bundle của Angular. Sau sửa, canvas có chiều cao `502px`, tab sheet nằm ngang và các công cụ view-only hoạt động trên local.
- Defect được đóng ở cấp mã nguồn/local verification. Chỉ còn bước deploy và smoke test lại production để hoàn tất phát hành.

**Tiêu chí đóng defect:**

- Canvas có chiều rộng và chiều cao dương khi viewer ready.
- Vùng bảng hiển thị hàng/cột/ô dữ liệu trên cả workbook một sheet và nhiều sheet.
- Sheet tab nhiều sheet nằm ngang, không chiếm toàn bộ chiều rộng từng dòng.
- Chọn vùng, tìm kiếm, copy, Filter/Sort và Reset hoạt động sau khi bảng đã render.
- Không hồi quy chế độ chỉ đọc.
