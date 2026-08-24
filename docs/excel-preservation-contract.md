# Excel preservation contract

Tài liệu này là contract của viewer Excel readonly trong production. Viewer chỉ hiển thị bản xem trước; không ghi ngược thay đổi vào file gốc.

## Phạm vi được giữ lại

Với workbook `.xlsx` và `.xlsm`, viewer phải giữ được:

- giá trị ô, công thức, kiểu dữ liệu, định dạng số, font, màu, căn lề, đường viền;
- merge cells, kích thước hàng/cột, trạng thái ẩn và giới hạn vùng xem;
- nhiều sheet và chuyển sheet;
- freeze pane;
- autofilter ở vùng đã khai báo;
- hyperlink ngoài workbook và liên kết tới sheet/ô trong cùng workbook;
- comment/note của ô.

SheetJS vẫn là parser chính cho value/formula/style/merge/dimensions. ExcelJS được dùng thêm để đọc metadata mà model SheetJS hiện tại không cung cấp.

## Tính năng chưa quảng bá

Các metadata sau chưa được preserve đầy đủ:

- conditional formatting;
- data validation;
- table Excel;
- drawing, hình ảnh hoặc hình vẽ.

Conditional formatting là blocker của preview vì việc mất màu nghiệp vụ có thể làm người xem hiểu sai kết quả. Data validation, table và drawing hiện là non-goal của viewer readonly; nếu phát hiện, viewer phải hiển thị cảnh báo thay vì âm thầm quảng bá hỗ trợ.

Định dạng `.xls` cũ không đi qua metadata parser ExcelJS. Viewer vẫn có thể hiển thị value/formula/style cơ bản bằng SheetJS nhưng phải hiện cảnh báo `Metadata giới hạn`; không được cam kết freeze pane hoặc metadata nâng cao cho loại file này.

## Surface readonly được giữ lại

Người dùng được phép:

- chuyển sheet;
- chọn ô/vùng, dùng `Ctrl+A`, `Ctrl+G`, tìm kiếm và sao chép dữ liệu;
- zoom, vừa chiều rộng, autofit, wrap, căn lề, freeze, ẩn/hiện hàng-cột và đường lưới;
- vừa vùng chọn, zoom 100%, lịch sử đi tới, danh sách sheet và thống kê vùng chọn có giới hạn;
- tạo hoặc thay đổi Filter/Sort trong instance bản xem trước;
- mở hyperlink hợp lệ, xem note và panel thông tin ô chỉ đọc;
- dùng custom context menu theo whitelist cho ô/vùng, cột, hàng và sheet.

Formula bar/name box, toolbar chỉnh sửa và context menu mặc định của Univer phải tắt hoàn toàn. Viewer chỉ được render các tiện ích hiển thị nằm trong whitelist; không được render Cut, Paste, Delete, Edit, Insert, Merge, Rename/Add/Delete sheet hoặc Save. `setEditable(false)`, quyền workbook/worksheet readonly và lớp chặn DOM phải cùng được bật.

Các thao tác Filter, Sort, alignment, Wrap, Autofit, kích thước, freeze, hide/show, gridlines và zoom là `preview-only`: chỉ thay đổi instance Univer đang mở, không serialize, upload, lưu vào Drive hoặc ghi vào local storage. Viewer theo dõi các thay đổi theo sheet; Zoom, Filter, Freeze và Gridlines có thể xóa riêng, còn Sort/hidden/dimensions/format dùng snapshot nguồn để tránh hoàn tác sai dữ liệu. Nút `Đặt lại cách xem`, thao tác đóng modal và đổi file phải hủy toàn bộ trạng thái tạm bằng cách dựng lại snapshot nguồn. Mỗi tiện ích xem phải có error boundary riêng; lỗi của tiện ích không được phát `failed`, dispose viewer hoặc làm workbook trắng.

## Release evidence tối thiểu

Merge gate cần có unit/contract test cho từng metadata được preserve và regression test date/time ở UTC cùng `Asia/Ho_Chi_Minh`.

Release gate cần chạy qua `/documents` với ít nhất một workbook thật `.xlsx` có nhiều sheet; ưu tiên workbook có merge, formula, date/date-time, freeze pane, hyperlink, note, autofilter và conditional formatting nếu nghiệp vụ sử dụng. Phải kiểm tra chuyển sheet, chọn ô/vùng, tìm kiếm, `Ctrl+G`, copy, zoom/fit width, Filter/Sort, custom context menu, Reset view, cảnh báo unsupported metadata và xác nhận không có bề mặt nhập liệu hoặc thay đổi nào được ghi về file gốc.
