# Kế hoạch công cụ xem và menu chuột phải cho Excel viewer

Trạng thái: `Đã triển khai; đã xử lý Escape của dialog lồng và kiểm tra lại mobile 320/360/390px`

Cập nhật: `2026-08-24`

Tài liệu liên quan: [Excel preservation contract](excel-preservation-contract.md)

## 1. Mục tiêu

Nâng Excel viewer tại `/documents` thành một bề mặt xem dữ liệu thuận tiện như Excel nhưng vẫn giữ ranh giới an toàn:

- người dùng được chọn, tìm kiếm, sao chép, lọc, sắp xếp và điều chỉnh cách hiển thị;
- mọi thay đổi chỉ tồn tại trong bản xem trước của phiên hiện tại;
- không ghi ngược vào workbook hoặc Google Drive;
- không cho phép nhập, cắt, dán, xóa hoặc thay đổi giá trị/công thức của ô;
- các công cụ thường dùng dễ thấy nhưng không làm giảm chiều cao vùng bảng;
- menu chuột phải chỉ hiển thị các lệnh được cho phép theo đúng ngữ cảnh ô, hàng, cột hoặc sheet.

## 2. Trạng thái nền hiện tại

Các khả năng đã có và được xem là baseline của kế hoạch:

- [x] Viewer dùng Univer và hiển thị nhiều sheet, giá trị, công thức, style, merge và kích thước hàng/cột.
- [x] Formula bar, toolbar chỉnh sửa mặc định và context menu mặc định của Univer đã tắt.
- [x] Workbook/worksheet được đặt readonly; lớp chặn DOM ngăn double-click, nhập phím, paste, cut, drop và composition vào ô.
- [x] `Ctrl+F` và nút `Tìm kiếm` mở công cụ tìm kiếm.
- [x] `Ctrl+A` và nút `Chọn vùng` chọn vùng dữ liệu đang dùng của sheet.
- [x] `Ctrl+Shift+L` và nút `Filter` tạo/mở Filter tạm trên vùng đang chọn hoặc vùng dữ liệu của sheet.
- [x] AutoFilter nguồn hợp lệ được giữ; AutoFilter nguồn một hàng được bỏ qua an toàn khi tải file.
- [x] Có công cụ căn giữa, Wrap text, Autofit và Sort A→Z/Z→A cho bản xem trước.
- [x] Có zoom, chuyển sheet và thanh thống kê của Univer.
- [x] Regression test tài liệu đang pass `73/73`, typecheck và development build pass sau triển khai.

## 3. Nguyên tắc sản phẩm và an toàn

### 3.1. Phân loại thao tác

| Nhóm | Được phép | Ghi chú |
|---|---|---|
| Điều hướng | Chọn ô/vùng, chuyển sheet, đi tới ô, zoom, vừa chiều rộng | Không thay đổi dữ liệu |
| Tra cứu | Tìm kiếm, xem giá trị/công thức/format/note/hyperlink | Chỉ đọc |
| Clipboard | Sao chép giá trị hiển thị, giá trị gốc, công thức hoặc TSV | Không có Cut/Paste |
| Hiển thị tạm | Wrap, căn lề, Autofit, gridlines, headings, freeze, ẩn/hiện tạm | Phải có Reset view |
| Dữ liệu tạm | Filter và Sort trong instance preview | Phải có chỉ báo trạng thái |
| Thay đổi workbook | Nhập, xóa, dán, chèn, merge, đổi tên sheet, lưu | Không được phép |

### 3.2. Quy tắc bắt buộc

- Không bật `contextMenu: true` của Univer nếu chưa có cơ chế loại bỏ chắc chắn toàn bộ lệnh chỉnh sửa.
- Xây context menu riêng theo whitelist; mục không nằm trong danh sách cho phép không được render.
- Filter/Sort/ẩn hàng-cột phải có chỉ báo rõ vì chúng có thể làm người xem hiểu rằng dữ liệu bị mất hoặc bị thay đổi.
- Luôn có lệnh `Đặt lại cách xem` ở vị trí dễ tìm.
- Đóng modal hoặc mở lại file phải hủy toàn bộ view state tạm.
- Không tự mở rộng AutoFilter nguồn khi tải file. Chỉ tạo Filter theo vùng dữ liệu khi người dùng chủ động yêu cầu.
- Một lỗi menu hoặc view utility không được làm workbook trắng hoặc phát `failed` cho toàn bộ viewer.
- Menu và panel phải dùng được bằng chuột, bàn phím và màn hình cảm ứng.

## 4. Kiến trúc giao diện đề xuất

### 4.1. Thanh công cụ chính

Giữ một hàng thấp, không tăng chiều cao hiện tại:

```text
Tìm kiếm | Chọn vùng | Filter | Vừa chiều rộng | Đặt lại cách xem | Xem thêm
```

`Xem thêm` chứa các lệnh ít dùng hơn:

```text
Đi tới ô
Căn trái / giữa / phải
Wrap text
Autofit
Sort
Freeze
Gridlines
Tiêu đề hàng/cột
Thông tin vùng chọn
```

Trên màn hình rộng có thể giữ một số nút đang có ở thanh chính. Trên màn hình hẹp, ưu tiên sáu mục cốt lõi và cho phép cuộn ngang hoặc mở `Xem thêm`.

### 4.2. Chỉ báo view state

Chỉ render khi có trạng thái tương ứng:

```text
Filter: 1 cột
Sort: A→Z theo cột C
Ẩn: 5 hàng, 2 cột
Freeze: hàng 1, cột A
```

Mỗi chỉ báo có thể bấm để xem chi tiết hoặc xóa riêng trạng thái đó. Không dùng banner cao chiếm diện tích.

### 4.3. Context menu theo target

Context menu phải xác định target trước khi render:

- ô hoặc vùng ô;
- tiêu đề cột;
- tiêu đề hàng;
- tab sheet;
- vùng trống ngoài dữ liệu.

Nếu không xác định được target an toàn, chỉ hiện các mục chung như `Sao chép`, `Tìm kiếm`, `Đi tới ô` và `Đặt lại cách xem`.

## 5. Cấu trúc menu chuột phải

### 5.1. Menu của ô hoặc vùng ô

```text
Sao chép
  Sao chép giá trị hiển thị                 Ctrl+C
  Sao chép giá trị gốc
  Sao chép công thức
  Sao chép vùng dạng TSV

Tìm kiếm và lọc
  Tìm giá trị này
  Chỉ hiển thị giá trị này
  Loại trừ giá trị này
  Mở Filter của cột
  Xóa điều kiện lọc của cột

Sắp xếp
  Tăng dần theo cột này
  Giảm dần theo cột này

Hiển thị
  Căn trái
  Căn giữa
  Căn phải
  Bật/tắt Wrap text
  Autofit cột này
  Autofit hàng này
  Vừa vùng chọn
  Cố định tới ô này

Thông tin
  Xem chi tiết ô
  Mở liên kết
  Sao chép địa chỉ ô

Đặt lại cách xem
```

Quy tắc hiển thị:

- `Sao chép công thức` chỉ hiện khi ô hoặc vùng có công thức.
- `Mở liên kết` chỉ hiện khi ô có hyperlink hợp lệ.
- `Chỉ hiển thị giá trị này` và `Loại trừ giá trị này` chỉ hiện khi target nằm trong vùng dữ liệu có ít nhất hai hàng.
- Với vùng nhiều cột, Sort dùng cột chứa active cell và phải nói rõ tên/địa chỉ cột.
- Các lệnh format chỉ tác động preview và phải phục hồi khi Reset/đóng file.

### 5.2. Menu của tiêu đề cột

```text
Sao chép cột
Tìm trong cột này

Filter
  Mở Filter
  Chỉ hiển thị ô không trống
  Chỉ hiển thị ô trống
  Xóa điều kiện lọc của cột

Sắp xếp
  A → Z / Nhỏ → Lớn / Cũ → Mới
  Z → A / Lớn → Nhỏ / Mới → Cũ

Hiển thị
  Autofit cột
  Đặt chiều rộng tạm thời
  Wrap text toàn cột
  Căn trái
  Căn giữa
  Căn phải
  Cố định tới cột này
  Ẩn cột tạm thời
  Hiện tất cả cột đang ẩn

Sao chép tên cột
Đặt lại cách xem của cột
```

Nhãn Sort thay đổi theo kiểu dữ liệu được suy luận:

- văn bản: `A → Z`, `Z → A`;
- số: `Nhỏ → Lớn`, `Lớn → Nhỏ`;
- ngày/giờ: `Cũ → Mới`, `Mới → Cũ`;
- kiểu hỗn hợp hoặc không xác định: dùng `Tăng dần`, `Giảm dần`.

### 5.3. Menu của tiêu đề hàng

```text
Sao chép hàng
Tìm trong hàng này
Autofit chiều cao hàng
Bật/tắt Wrap text cho hàng
Cố định tới hàng này
Ẩn hàng tạm thời
Hiện tất cả hàng đang ẩn
Sao chép số hàng
Đặt lại cách xem của hàng
```

Không hiển thị chèn/xóa hàng hoặc xóa nội dung.

### 5.4. Menu của tab sheet

```text
Đi tới sheet này
Sheet trước
Sheet tiếp theo
Sao chép tên sheet
Vừa chiều rộng
Đặt lại cách xem của sheet
Hiện danh sách tất cả sheet
```

Không hiển thị đổi tên, xóa, nhân bản, thêm, đổi màu hoặc ghi trạng thái ẩn vào workbook.

## 6. Tính năng bổ sung ngoài context menu

### 6.1. Đi tới ô — `Ctrl+G`

- Nhập địa chỉ `A25`, `D100` hoặc `Sheet 2!B7`.
- Validate địa chỉ trước khi điều hướng.
- Cho phép chọn sheet từ danh sách.
- Giữ lịch sử tối đa 10 địa chỉ trong phiên preview.
- Không cho phép nhập công thức hoặc nội dung ô trong hộp này.

### 6.2. Vừa chiều rộng và vừa vùng chọn

- `Vừa chiều rộng`: tính zoom để vùng dữ liệu vừa viewport ngang.
- `Vừa vùng chọn`: tính zoom và scroll để selection hiện đầy đủ.
- Có nút trở về `100%`.
- Giới hạn zoom trong khoảng an toàn của Univer để tránh canvas quá lớn hoặc quá nhỏ.

### 6.3. Thông tin vùng chọn

Hiển thị ở status bar hoặc popover:

- số ô có dữ liệu;
- số giá trị số;
- tổng;
- trung bình;
- nhỏ nhất;
- lớn nhất;
- số hàng đang bị lọc/ẩn trong vùng.

Không tính lại toàn workbook nếu selection lớn; cần giới hạn hoặc chạy theo từng chunk để không chặn UI.

### 6.4. Panel thông tin ô chỉ đọc

Hiển thị:

- sheet và địa chỉ ô;
- giá trị hiển thị;
- giá trị gốc;
- công thức;
- định dạng số/ngày;
- căn lề và Wrap text;
- hyperlink;
- note/comment;
- trạng thái merge;
- trạng thái hàng bị lọc hoặc ẩn.

Panel không có input chỉnh sửa, nút xác nhận công thức hoặc nút ghi dữ liệu.

### 6.5. Đánh dấu hàng và cột hiện tại

- Làm nổi nhẹ row/column của active cell.
- Không che màu nền nghiệp vụ của workbook.
- Có thể bật/tắt trong `Xem thêm`.
- Mặc định tắt nếu sheet có conditional formatting hoặc màu nghiệp vụ cần giữ nguyên.

## 7. Kế hoạch triển khai theo giai đoạn

### Giai đoạn 0 — Đồng bộ contract và baseline

- Rà lại contract tài liệu trước khi thêm hành vi mới.
- Khóa danh sách lệnh được phép và bị cấm.
- Thêm model view state độc lập với workbook gốc.
- Xác định API reset và cleanup dùng chung.

### Giai đoạn 1 — Nền context menu tùy biến

- Bắt `contextmenu` trên vùng Univer mà không bật menu chỉnh sửa mặc định.
- Xác định target và selection an toàn.
- Tạo component menu dùng chung, có submenu, separator và trạng thái disabled.
- Quản lý vị trí, tràn viewport, scroll và safe area trên mobile.
- Đóng menu khi click ngoài, Escape, đổi sheet, đóng modal hoặc mở menu khác.

### Giai đoạn 2 — Menu ô và clipboard

- Sao chép giá trị hiển thị, giá trị gốc, công thức và TSV.
- Tìm giá trị của active cell.
- Mở hyperlink an toàn.
- Panel thông tin ô chỉ đọc.
- Filter by value, exclude value và clear filter column.

### Giai đoạn 3 — Menu cột và hàng

- Target tiêu đề cột/hàng.
- Sort có nhãn theo kiểu dữ liệu.
- Autofit, Wrap và căn lề tạm.
- Freeze tới hàng/cột.
- Ẩn/hiện hàng-cột tạm kèm chỉ báo.

### Giai đoạn 4 — Menu tab sheet và điều hướng

- Menu tab sheet chỉ đọc.
- `Ctrl+G` đi tới ô/sheet.
- Danh sách sheet, sheet trước/sau.
- Vừa chiều rộng và vừa vùng chọn.

### Giai đoạn 5 — View state và Reset

- Theo dõi Filter, Sort, hidden rows/columns, freeze, zoom, wrap/alignment/autofit tạm.
- Hiển thị chip trạng thái gọn.
- Reset riêng từng nhóm và Reset toàn bộ.
- Tự reset khi đóng/mở lại file hoặc đổi blob.

### Giai đoạn 6 — Accessibility, mobile và hiệu năng

- Keyboard navigation và focus management cho menu/submenu.
- Screen-reader labels và thông báo trạng thái.
- Long-press trên touch để mở context menu.
- Đảm bảo menu không che hoàn toàn active cell trên màn hình nhỏ.
- Giới hạn tính toán selection lớn và kiểm tra workbook gần cell budget.

### Giai đoạn 7 — Kiểm thử và release gate

- Unit test helper/model.
- Contract test bảo đảm lệnh chỉnh sửa không xuất hiện.
- Browser test trên file thật và workbook fixture.
- Kiểm tra lifecycle, nhiều sheet, dark mode, mobile và keyboard-only.

## 8. Checklist triển khai

Quy tắc: chỉ tick một mục sau khi code tương ứng và kiểm tra mục tiêu đều pass.

### 8.1. Contract và data safety

- [x] Cập nhật `docs/excel-preservation-contract.md` cho đúng trạng thái formula bar/name box hiện tại.
- [x] Ghi rõ các thao tác format/filter/sort là preview-only và không được serialize về file.
- [x] Tạo danh sách whitelist command/menu item được phép.
- [x] Tạo danh sách denylist gồm Cut, Paste, Delete, Insert, Edit, Merge, Rename, Add/Delete sheet và Save.
- [x] Có test bảo đảm các nhãn/lệnh denylist không xuất hiện trong custom context menu.
- [x] Xác nhận không có API upload/save được gọi từ Excel viewer.
- [x] Mọi view action có error boundary riêng, không phát `failed` cho toàn viewer.

### 8.2. View-state model

- [x] Tạo model trạng thái có `kind`, `sheetName`, `label` và ID ổn định theo sheet/nhóm.
- [x] Theo dõi filter range và filter criteria đang áp dụng.
- [x] Theo dõi chiều Sort tạm theo sheet.
- [x] Theo dõi nhóm hàng/cột ẩn tạm theo sheet.
- [x] Theo dõi Freeze tạm theo sheet.
- [x] Theo dõi zoom/fit mode.
- [x] Theo dõi nhóm wrap/alignment/autofit/kích thước tạm để Reset từ snapshot.
- [x] Reset view state khi đóng modal.
- [x] Reset view state khi đổi file/blob.
- [x] Không lưu view state vào workbook, Drive hoặc local storage nếu chưa có yêu cầu riêng.

### 8.3. Context menu foundation

- [x] Giữ `contextMenu: false` cho menu mặc định của Univer.
- [x] Bắt sự kiện chuột phải trong host viewer.
- [x] Không chặn menu ngoài phạm vi Excel viewer.
- [x] Xác định target là cell/range, column header, row header hoặc sheet tab.
- [x] Context menu bám đúng vị trí pointer nhưng không tràn viewport.
- [x] Context menu hỗ trợ submenu.
- [x] Context menu hỗ trợ mục disabled kèm lý do cụ thể bằng tooltip và `aria-description`.
- [x] Click ngoài đóng menu.
- [x] Escape đóng menu trước khi đóng modal.
- [x] Đổi sheet hoặc mở panel Filter đóng menu đang mở.
- [x] Cleanup toàn bộ listener/overlay khi dispose Univer.

### 8.4. Keyboard và accessibility

- [x] Di chuyển trong menu bằng Arrow Up/Down.
- [x] Mở/đóng submenu bằng Arrow Right/Left.
- [x] Enter/Space kích hoạt mục menu.
- [x] Home/End đi tới mục đầu/cuối.
- [x] Escape đóng submenu rồi menu chính.
- [x] Focus trả về cell/toolbar trước đó sau khi đóng menu.
- [x] Dùng role `menu`, `menuitem`, `menuitemcheckbox` hoặc `menuitemradio` đúng ngữ nghĩa.
- [x] Mỗi icon-only item có accessible name.
- [x] Trạng thái Filter/Sort/Reset được thông báo bằng vùng `aria-live` gọn.
- [x] `Ctrl+A`, `Ctrl+F`, `Ctrl+G`, `Ctrl+C` và `Ctrl+Shift+L` không xung đột với input trong panel tìm kiếm/lọc; đã kiểm tra trực tiếp chọn-all trong Đi tới và Tìm kiếm trên macOS.

### 8.5. Menu ô/range

- [x] Sao chép giá trị hiển thị.
- [x] Sao chép giá trị gốc.
- [x] Sao chép công thức khi có công thức.
- [x] Sao chép vùng dạng TSV.
- [x] Tìm giá trị active cell.
- [x] Filter by selected value.
- [x] Exclude selected value.
- [x] Mở Filter của cột active.
- [x] Clear filter criteria của cột active.
- [x] Sort tăng/giảm theo cột active.
- [x] Căn trái/giữa/phải selection.
- [x] Bật/tắt Wrap text selection.
- [x] Autofit hàng/cột liên quan.
- [x] Vừa vùng chọn.
- [x] Freeze tới active cell.
- [x] Xem thông tin ô.
- [x] Mở hyperlink chỉ khi URL hợp lệ.
- [x] Sao chép địa chỉ ô.

### 8.6. Menu tiêu đề cột

- [x] Sao chép cột.
- [x] Tìm trong cột.
- [x] Mở/clear Filter của cột.
- [x] Filter blank/not blank.
- [x] Suy luận loại dữ liệu cột cho nhãn Sort, có nhận diện number format ngày.
- [x] Sort tăng/giảm.
- [x] Autofit cột.
- [x] Đặt chiều rộng tạm thời.
- [x] Wrap/căn lề toàn cột trong preview.
- [x] Freeze tới cột.
- [x] Ẩn cột tạm thời.
- [x] Hiện tất cả cột đang ẩn.
- [x] Đặt lại view state của cột.

### 8.7. Menu tiêu đề hàng

- [x] Sao chép hàng.
- [x] Tìm trong hàng.
- [x] Autofit chiều cao hàng.
- [x] Wrap hàng.
- [x] Freeze tới hàng.
- [x] Ẩn hàng tạm thời.
- [x] Hiện tất cả hàng đang ẩn.
- [x] Sao chép số hàng.
- [x] Đặt lại view state của hàng.

### 8.8. Menu tab sheet

- [x] Đi tới sheet.
- [x] Sheet trước/sau.
- [x] Sao chép tên sheet.
- [x] Vừa chiều rộng sheet.
- [x] Đặt lại cách xem của sheet.
- [x] Hiện danh sách sheet.
- [x] Không render Rename/Delete/Duplicate/Add/Hide sheet theo kiểu chỉnh sửa workbook.

### 8.9. Toolbar và `Xem thêm`

- [x] Thêm `Ctrl+G — Đi tới ô`.
- [x] Thêm `Vừa chiều rộng`.
- [x] Thêm `Vừa vùng chọn` và `Trở về 100%` trong `Xem thêm`/context menu.
- [x] Thêm `Đặt lại cách xem` ở toolbar chính.
- [x] Thêm menu `Xem thêm` cho alignment, wrap, autofit, sort, freeze và gridlines.
- [x] Giữ toolbar một hàng trên desktop và mobile.
- [x] Không để các nút quan trọng bị đẩy ra ngoài mà không có dấu hiệu cuộn/menu `Xem thêm`.
- [x] Hiển thị phím tắt trong tooltip/menu nhưng không làm nút quá rộng trên mobile.

### 8.10. View-state indicators và Reset

- [x] Chip Filter hiển thị số cột/điều kiện đang lọc.
- [x] Chip Sort hiển thị cột và chiều sort.
- [x] Chip hidden hiển thị số hàng/cột đang ẩn.
- [x] Chip Freeze hiển thị hàng/cột freeze tạm.
- [x] Cho phép xóa từng trạng thái từ chip: đã xóa riêng Zoom/Filter/Freeze/Gridlines; Sort/hidden/dimensions/format dùng Reset snapshot toàn bộ để tránh khôi phục sai.
- [x] Reset Filter hiển thị lại tất cả hàng mà không làm mất workbook.
- [x] Reset Sort khôi phục thứ tự snapshot ban đầu.
- [x] Reset hidden khôi phục hàng/cột theo trạng thái gốc của workbook.
- [x] Reset dimensions khôi phục width/height gốc.
- [x] Reset alignment/wrap khôi phục style snapshot gốc.
- [x] Reset toàn bộ không đọc lại file: dựng lại workbook từ snapshot nguồn đã giữ trong bộ nhớ.
- [x] Khi dựng lại snapshot, giữ modal và sheet đang xem ổn định.

### 8.11. Mobile và touch

- [x] Long-press mở context menu mà không kích hoạt edit cell.
- [x] Chạm ngoài đóng menu.
- [x] Menu dùng bottom sheet nếu viewport không đủ chỗ.
- [x] Item có vùng chạm tối thiểu phù hợp.
- [x] Safe-area inset được áp dụng.
- [x] Submenu không tạo thao tác hover-only trên touch.
- [x] Toolbar vẫn xem được bảng ở 320/360/390px.

### 8.12. Hiệu năng và độ bền

- [x] Không quét toàn bộ 500.000 ô cho mỗi lần mở context menu.
- [x] Cache nhẹ thông tin kiểu dữ liệu cột và hủy cache khi đổi workbook.
- [x] Tính thống kê selection với giới hạn 50.000 ô và thông báo khi bị cắt mẫu.
- [x] Không tạo nhiều popup portal/listener sau mỗi lần đóng mở file.
- [x] Không rò body class, event listener hoặc MutationObserver sau dispose.
- [x] Context menu/filter panel không làm canvas mất kích thước hoặc workbook trắng.
- [x] Một hyperlink/note/filter lỗi chỉ degrade mục đó.

### 8.13. Automated tests

- [x] Unit test target classification cho cell/row/column/sheet tab.
- [x] Unit test menu whitelist theo từng target.
- [x] Unit test copy displayed/raw/formula/TSV.
- [x] Unit test cấu trúc criteria cho Filter by value, exclude, blank và not blank; contract test khóa lệnh clear criteria.
- [x] Unit test suy luận nhãn Sort theo text/number/date/mixed và number format ngày.
- [x] Unit test view-state reducer (upsert/thay thế/giới hạn/xóa); contract và browser test khóa Reset từ snapshot.
- [x] Unit test cleanup lifecycle.
- [x] Contract test không có Cut/Paste/Delete/Insert/Edit/Rename/Save.
- [x] Contract test readonly guard vẫn chặn nhập/paste/drop sau mọi view action.
- [x] Regression test AutoFilter nguồn một hàng không crash viewer.
- [x] Regression test user-triggered Filter fallback dùng data range.
- [x] Regression test Escape trong dialog Tìm kiếm của Univer không đóng nhầm preview modal.
- [x] Regression test helper text-entry và browser test xác nhận phím chọn-all không bị chiếm khi focus ở input Đi tới/Tìm kiếm.
- [x] `npm run test:documents` pass với toàn bộ test mới (`73/73`).
- [x] Angular development build pass.
- [x] `git diff --check` pass.

### 8.14. Browser verification trên `/documents`

- [x] Mở file lần đầu, nội dung hiện đầy đủ.
- [x] Chuột phải vào cell mở đúng menu cell.
- [x] Chuột phải vào column header mở đúng menu cột.
- [x] Chuột phải vào row header mở đúng menu hàng.
- [x] Chuột phải vào sheet tab mở đúng menu sheet.
- [x] Không menu nào chứa lệnh chỉnh sửa workbook.
- [x] Copy từ menu cho kết quả đúng clipboard; serializer có unit test cho displayed/raw/formula/TSV.
- [x] Filter by value và exclude value hoạt động trên file thật.
- [x] Sort hoạt động và chỉ báo trạng thái chính xác.
- [x] Autofit/Wrap/Alignment chỉ thay đổi preview.
- [x] Freeze/ẩn hàng-cột có chỉ báo và Reset được.
- [x] `Ctrl+G` đi đúng địa chỉ (`'EU'!B20` trên file thật).
- [x] Vừa chiều rộng/vùng chọn không tạo canvas trắng (file thật về 26%) và nút 100% phục hồi đúng.
- [x] Mở hyperlink đúng và không chuyển hướng với URL không hợp lệ.
- [x] Escape đóng submenu trước rồi menu chính, sau đó mới tới modal.
- [x] Escape trong dialog lồng bên ngoài preview chỉ đóng lớp dialog đang sở hữu focus.
- [x] Đóng/mở hoặc Reset file xóa mọi view state tạm.
- [x] Mở file khác không mang view state từ file trước.
- [x] Không còn toast AutoFilter một hàng.
- [x] Không thể nhập, paste, cut, drop hoặc sửa công thức; sau Reset có `contenteditable=true` bằng 0.
- [x] Dark mode hiển thị menu/panel rõ ràng; đã kiểm tra trực tiếp menu cell trên file thật.
- [x] Mobile 320/360/390px dùng được toolbar và long-press menu.
- [x] Mobile 320/360/390px sau bản sửa vẫn dùng được toolbar, Filter, menu lồng và Escape.

## 9. Tiêu chí hoàn tất

Hạng mục chỉ được xem là hoàn tất khi:

1. Người dùng có thể truy cập các công cụ xem thường dùng mà vùng Excel không bị giảm thêm chiều cao.
2. Context menu thay đổi đúng theo cell, row, column và sheet tab.
3. Không có lệnh nào cho phép thay đổi value/formula/cấu trúc workbook.
4. Filter, Sort, hidden rows/columns và các view mutation đều có chỉ báo và Reset.
5. Đóng/mở lại file trả về đúng snapshot gốc.
6. Một view utility lỗi không làm workbook trắng hoặc phát lỗi tải file.
7. Keyboard, screen reader, mobile/touch và dark mode đều qua smoke test.
8. Toàn bộ automated test, Angular build và browser verification pass.

## 10. Thứ tự ưu tiên đề xuất

### P0 — Giá trị cao, rủi ro thấp

- custom context menu foundation;
- copy displayed/raw/formula/TSV;
- tìm giá trị active cell;
- Filter by value/exclude/clear;
- menu Sort theo cột active;
- `Ctrl+G`;
- `Vừa chiều rộng`;
- `Đặt lại cách xem`.

### P1 — Tăng khả năng đọc file lớn

- menu column/row;
- Autofit/Wrap/Alignment theo target;
- Freeze tạm;
- hidden rows/columns tạm và indicator;
- thông tin ô/vùng chọn;
- view-state chips.

### P2 — Hoàn thiện trải nghiệm

- menu sheet tab;
- highlight row/column;
- fit selection;
- history của Go To;
- bottom-sheet context menu trên mobile;
- tối ưu selection statistics cho workbook lớn.

## 11. Các file dự kiến tác động

- `src/app/features/documents/excel-document-viewer.component.ts` — toolbar, shortcuts, view actions và tích hợp menu.
- `src/app/features/documents/excel-univer-metadata.ts` — helper liên quan filter/range nếu cần giữ logic thuần.
- `src/app/features/documents/excel-document-demo.component.ts` — fixture và hướng dẫn thao tác.
- `src/app/features/documents/excel-document-demo.component.test.ts` — contract UI/readonly.
- `src/app/features/documents/excel-univer-metadata.test.ts` — regression filter/range.
- `src/styles.css` — overlay/portal rule thật sự cần dùng toàn cục.
- `docs/excel-preservation-contract.md` — contract readonly và preview-only actions.

Ưu tiên tách component/model/helper mới thay vì tiếp tục tăng toàn bộ logic trong một file viewer nếu context menu bắt đầu có nhiều target và submenu.
