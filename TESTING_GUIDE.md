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
