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
- chọn ô, dùng formula bar và name box;
- tìm kiếm;
- zoom;
- xem và tương tác với filter ở mức view-only;
- mở hyperlink và xem note.

Viewer phải ẩn hoặc vô hiệu hóa các nhóm thao tác chỉnh sửa như font, alignment, format, insert, data validation, table, drawing và context menu chỉnh sửa. `setEditable(false)` và quyền workbook readonly phải cùng được bật.

## Release evidence tối thiểu

Merge gate cần có unit/contract test cho từng metadata được preserve và regression test date/time ở UTC cùng `Asia/Ho_Chi_Minh`.

Release gate cần chạy qua `/documents` với ít nhất một workbook thật `.xlsx` có nhiều sheet; ưu tiên workbook có merge, formula, date/date-time, freeze pane, hyperlink, note, autofilter và conditional formatting nếu nghiệp vụ sử dụng. Phải kiểm tra chuyển sheet, chọn ô/name box, formula bar, zoom, cảnh báo unsupported metadata và xác nhận không có thay đổi nào được ghi về file gốc.
