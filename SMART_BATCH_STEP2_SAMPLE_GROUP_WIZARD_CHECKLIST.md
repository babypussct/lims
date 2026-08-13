# SmartBatch Step 2 — Checklist wizard nhóm mẻ

Ngày rà soát: 2026-08-13
Phạm vi: `src/app/features/batch`
Mục tiêu: Step 2 là một workspace duy nhất để khai báo nhiều nhóm mẻ. Mỗi nhóm mẻ được hoàn chỉnh độc lập bằng wizard tuần tự, nhưng người dùng không phải chuyển sang trang khác để tạo nhóm tiếp theo.

## Semantics đã chốt

- Step 1 chỉ có một trách nhiệm: **Chọn Cách Lập Mẻ** (một mẫu hoặc ghép nhiều mẫu). Step 1 không hỏi lại các trường của nhóm và không phải nơi nhập SOP.
- Step 2 hiển thị danh sách các nhóm mẻ trên cùng một trang. Chỉ có một nút `Thêm nhóm mới` ở cuối danh sách để tạo thêm bản nháp nhóm ngay trong workspace hiện tại; người dùng mở nhóm bằng cách bấm trực tiếp vào thẻ nhóm.
- Mỗi nhóm có một wizard riêng được rút gọn thành hai bước:
  1. **Thông tin mẫu:** mã số mẫu, nền mẫu mặc định `Bất kỳ (không lọc SOP)` và bảng mô tả từng mẫu hiển thị đồng thời.
  2. **Chỉ tiêu & SOP:** chọn từng chỉ tiêu hoặc Nhóm Chỉ Tiêu, xem tối đa 5 SOP gợi ý; click trực tiếp vào thẻ SOP đủ điều kiện để chỉ định và dùng một vùng `SOP hiện tại` duy nhất cho lựa chọn tự phân phối/SOP thủ công.
- Khung Step 2 dùng toàn bộ vùng làm việc còn lại theo viewport; danh sách nhóm và nội dung wizard dùng vùng cuộn nội bộ. `Chạy SmartBatch optimizer` và `Duyệt & Xếp Hàng In` cùng nằm trong action dock sticky của SmartBatch, không phụ thuộc footer nội bộ của wizard.
- `Chạy SmartBatch optimizer` và `Duyệt & Xếp Hàng In` dùng chung style `smartbatch-primary-action`: cùng kích thước, màu, icon container, shadow, hover/active/focus, disabled và hành vi full-width trên mobile.
- Một nhóm đại diện cho **cùng một bộ chỉ tiêu**. Người dùng không chọn chỉ tiêu khác nhau cho từng mẫu trong cùng nhóm.
- SmartBatch vẫn được tự do gom hoặc tách thành các batch vật lý theo SOP, nền mẫu, tồn kho và các ràng buộc của optimizer.
- SOP chỉ định phải tương thích nền mẫu và phủ đủ toàn bộ chỉ tiêu của nhóm; SOP chỉ phủ một phần bị chặn.
- Không thêm trường `Thảo luận chi tiết`, `discussion`, `targetNames` mới hoặc contract persistence mới. Wizard chỉ là lớp nhập/chuẩn hóa trước khi handoff vào `JobBlock` hiện có.

## Các trường hiện hữu được dùng lại

| Câu hỏi trong wizard | Trường hiện hữu sau handoff |
|---|---|
| Mã số mẫu | `rawSamples` / `sampleList` |
| Nền mẫu | `matrixType` |
| Mô tả từng mẫu | `sampleDescriptionMap` |
| Chỉ tiêu của nhóm | `selectedTargets` / `targetIds` |
| SOP chỉ định hoặc tự phân phối | `forcedSopId` (rỗng nghĩa là SmartBatch tự phân phối) |

`id` và `name` chỉ là định danh/tên hiển thị nhóm. `targetSearch`, `isCollapsed`, `sourceGroupId` và `sourceGroupModified` vẫn là thuộc tính vận hành hiện có, không phải câu hỏi nhập thêm.

## Luồng thao tác mục tiêu

1. Người dùng mở module SmartBatch và thấy Step 1: **Chọn Cách Lập Mẻ**.
2. Người dùng chọn một mode. Hệ thống chuyển thẳng đến Step 2 workspace, không mở một màn hình SOP riêng.
3. Nhóm đầu tiên được tạo và mở wizard tại bước 1. Mã, nền và mô tả cùng hiển thị để người dùng thấy ngay mô tả nhận từ dữ liệu TAB.
4. Khi Step 2 của nhóm có đủ mã mẫu, mô tả, chỉ tiêu và SOP hợp lệ (hoặc tự phân phối), hệ thống tự đánh dấu nhóm `Đã hoàn tất`. Không cần nút `Hoàn tất nhóm mẻ`; danh sách nhóm vẫn ở bên trái và người dùng chỉ cần bấm vào vùng thẻ nhóm để mở lại.
5. Người dùng bấm `+ Thêm nhóm mới`; nhóm mới xuất hiện ngay trong danh sách và có wizard độc lập.
6. Có thể mở lại bất kỳ nhóm nào để kiểm tra/sửa. Chỉ khi tất cả nhóm đã hoàn chỉnh thì nút `Chạy SmartBatch optimizer` mới được bật.
7. Optimizer nhận các `JobBlock` đã hoàn chỉnh, tiếp tục quyết định gom/tách batch vật lý và sinh các cặp mẫu–chỉ tiêu cần thiết theo bộ chỉ tiêu chung của từng nhóm.

### Hành vi nhập mã và mô tả

- Mỗi dòng có thể là một mã mẫu.
- Có thể dán dạng `mã mẫu[TAB]mô tả`; mô tả được gán cho đúng mã trên cùng dòng.
- Ví dụ:

  ```text
  0311    Cá tra
  0411    Cá tra
  ```

  Kết quả là hai mã `0311` và `0411`, cả hai có mô tả `Cá tra`. Hai mã khác nhau không bị gộp chỉ vì mô tả giống nhau; chỉ mã trùng lặp mới bị loại theo chính mã đó.

## Checklist triển khai

### P0 — UI và wizard Step 2

- [x] Step 1 hiển thị đúng nhiệm vụ `Chọn Cách Lập Mẻ`.
- [x] Sau khi chọn mode, parent chuyển trực tiếp vào Step 2 wizard workspace.
- [x] Step 2 có danh sách nhiều nhóm trên cùng một trang.
- [x] Chỉ còn một nút `Thêm nhóm mới` tạo nhóm tại chỗ, không điều hướng sang trang mới.
- [x] Mỗi nhóm có trạng thái wizard độc lập và có thể mở lại bất kỳ nhóm nào.
- [x] Không còn luồng pager tuần tự bắt buộc người dùng chuyển qua `Nhóm 1/2`, `Nhóm 2/2`.
- [x] Wizard có đúng hai bước: `Thông tin mẫu` → `Chỉ tiêu & SOP`.
- [x] Khung wizard có chiều cao cố định theo viewport; danh sách nhóm, mô tả, target và nội dung nhóm cuộn nội bộ; runtime đo được khung 678px trên viewport 720px, nội dung dùng `overflow-y: auto`.
- [x] Bước 1 hiển thị cùng lúc mã mẫu, nền mẫu mặc định `Bất kỳ (không lọc SOP)` và bảng mô tả từng mẫu.
- [x] Vùng `Mô tả từng mẫu` có nút `Copy tất cả` theo từng dòng và nút `Thu gọn/Mở rộng`; browser đã xác nhận copy `Cá tra` từ 0311 sang 0411 và thu gọn bảng.
- [x] Bước 2 khôi phục `Chọn Nhóm Chỉ Tiêu`, `Gợi ý Quy trình (SOP)` và một vùng `SOP hiện tại` duy nhất có cả lựa chọn thủ công hợp lệ.
- [x] Danh sách gợi ý SOP giới hạn tối đa 5 và hiển thị coverage, nền mẫu, trạng thái kho.
- [x] Không có bước/trường `Thảo luận chi tiết` hoặc trường nhóm mới.
- [x] Bước chỉ tiêu là lựa chọn ở cấp nhóm; toàn bộ mã mẫu trong nhóm dùng cùng bộ chỉ tiêu.
- [x] Khi nhóm chưa đủ dữ liệu hoặc SOP chỉ định không hợp lệ, không cho hoàn tất nhóm.
- [x] Khi còn nhóm chưa hoàn tất, nút optimizer bị khóa.
- [x] Sau khi mọi nhóm hoàn tất, nút optimizer sticky được mở và không làm mất các nhóm đã khai báo.
- [x] Phần mô tả trong card kế hoạch sau optimizer chỉ hiển thị khi card được mở rộng.

### P0 — Handoff và contract hiện có

- [x] Parent cập nhật các trường hiện hữu `rawSamples`, `matrixType`, `sampleDescriptionMap`, `selectedTargets` và `forcedSopId`.
- [x] Nhiều nhóm được chuyển thành nhiều `JobBlock` hiện hữu; không thêm `sampleGroupDetails`, `sampleGroupId` hoặc field persistence mới.
- [x] `forcedSopId` rỗng giữ nguyên cơ chế SmartBatch tự phân phối.
- [x] SOP chỉ định được kiểm tra đủ coverage toàn bộ `selectedTargets` của nhóm và tương thích `matrixType`.
- [x] Planner/optimizer tiếp tục là nơi quyết định gom hoặc tách batch vật lý; wizard không áp đặt một batch cho mỗi nhóm.
- [x] Các đường đọc/ghi Request, Firestore, Daily Checklist, print job và log tiếp tục dùng contract hiện hữu.

### P1 — Kiểm thử source/local

- [x] Test parser mã mẫu và dữ liệu dạng TAB.
- [x] Test giữ các mã khác nhau dù cùng mô tả; chỉ loại mã trùng theo mã mẫu.
- [x] Test giữ dấu phẩy/chấm phẩy trong mô tả sau TAB.
- [x] Test canonical target và subset mã theo nhóm nguồn.
- [x] Test ma trận 5 mã × 3 chỉ tiêu và `sampleTargetMap` khi planner tách batch vật lý.
- [x] Static contract test kiểm tra wizard hai bước, chiều cao cố định, nghiệp vụ target/SOP, thao tác copy/collapse, mặc định Any và không có field discussion.
- [x] Static contract test khóa rõ kiến trúc workspace nhiều nhóm, wizard độc lập và gate `allGroupsCompleted`.
- [x] `npm.cmd run test:smart-batch` trên checkout hiện tại sau thay đổi wizard hai bước: 46 test tĩnh + 20 test Firestore Emulator PASS.
- [x] `npm.cmd exec -- tsc -p tsconfig.app.json --noEmit`: PASS sau thay đổi component.
- [x] `npm.cmd run build`: PASS sau thay đổi component.
- [x] `git diff --check` sau khi cập nhật checklist/test.

## Tiêu chí nghiệm thu nghiệp vụ

- [x] Chọn `Ghép Nhiều Mẫu` hiển thị Step 2 ngay trên localhost.
- [x] Thêm tối thiểu hai nhóm trên cùng một trang.
- [x] Khi Step 2 đủ mã, mô tả, chỉ tiêu và SOP hợp lệ/tự phân phối, nhóm tự chuyển `Đã hoàn tất`; không còn nút `Hoàn tất nhóm mẻ`.
- [x] Dữ liệu `0311[TAB]Cá tra` và `0411[TAB]Cá tra` hiển thị ngay tại bước 1 thành hai mã, mỗi mã giữ mô tả `Cá tra`.
- [x] Có thể chọn một Nhóm Chỉ Tiêu và thấy bộ target được nhập vào nhóm hiện tại.
- [x] Bước 2 hiển thị tối đa 5 SOP gợi ý; click vào toàn bộ thẻ SOP đủ điều kiện sẽ chỉ định trực tiếp, không có nút `Chỉ định` riêng. `SOP hiện tại` chỉ hiển thị một select duy nhất, không lặp vùng `Đang áp dụng`; SOP `isManualOnly` phủ đủ nhóm vẫn là lựa chọn `Thủ công` trong select.
- [x] Khi một nhóm có một chỉ tiêu, tất cả mẫu trong nhóm dùng đúng chỉ tiêu đó; không có UI chọn chỉ tiêu riêng cho từng mẫu.
- [x] Khi tất cả nhóm tự hoàn tất, optimizer sticky tự bật ngay; khi còn nhóm dở dang, optimizer bị khóa. Runtime sau optimizer hiển thị `Đã phủ kín toàn bộ yêu cầu` / `Thiếu 0 chỉ tiêu/mẫu` và chuyển sang `Duyệt & Xếp Hàng In`.
- [x] Nút optimizer và nút duyệt/xếp hàng in dùng chung UI/UX primary action; browser đo cả hai ở desktop là `280x46px`, cùng màu indigo, bo góc 12px và không xuống dòng.
- [ ] Xác nhận bằng authenticated UI smoke với dữ liệu thật, planner thật, direct approve và các consumer checklist/kết quả.
- [ ] Xác nhận production Firestore/deployment; build local không thay thế bằng chứng production.

## Ranh giới bằng chứng

- **Source/local:** đã kiểm tra model `JobBlock`, wizard, optimizer và handoff về block; wizard không tạo persistence field mới.
- **Build/test:** chỉ đánh dấu hoàn tất sau khi chạy lại trên checkout hiện tại; số test lịch sử không thay thế cho lần chạy hiện tại.
- **Runtime local:** đã xác nhận wizard `Bước 1/2`, dữ liệu TAB 2/2 mô tả, default Any, copy/collapse, một nút `Thêm nhóm mới`, click trực tiếp thẻ nhóm, bộ 2 target Fipronil/Chlorpyrifos, click trực tiếp thẻ SOP để chỉ định (button `Chỉ định`: 0), chỉ một vùng SOP hiện tại và không còn `Đang áp dụng`. Nhóm tự hiển thị `2 mã · 2 chỉ tiêu Đã hoàn tất` và optimizer tự enabled trước khi bấm optimizer. Ở viewport `1256x912`, wizard cao `616px`, dock optimizer cao `67px`, action dock nằm trong vùng ứng dụng và không cần cuộn trang để thao tác. Sau optimizer đã thấy `Đã phủ kín toàn bộ yêu cầu`, `Thiếu 0 chỉ tiêu/mẫu`, `Duyệt & Xếp Hàng In`. Cả hai primary action đã được đo cùng `280x46px`, cùng `border-radius: 12px`, `white-space: nowrap`, cùng action dock sticky và cùng responsive contract.
- **Authenticated/production:** chưa suy ra từ smoke local, build hoặc unit test; cần phiên đăng nhập hợp lệ và kiểm tra trực tiếp các đường Request/Firestore/consumer.

## File/điểm kiểm tra chính

| Thành phần | Vai trò |
|---|---|
| `src/app/features/batch/components/sample-group-step2-wizard.component.ts` | Workspace Step 2 và wizard hai bước có chiều cao cố định cho từng nhóm |
| `src/app/features/batch/smart-batch.component.html` | Chuyển mode Step 1 → Step 2 và render wizard chính |
| `src/app/features/batch/smart-batch.component.ts` | Handoff wizard về `JobBlock`, sau đó gọi optimizer hiện tại |
| `src/app/features/batch/sample-group.utils.ts` | Parse mã, chuẩn hóa mô tả, canonical target và clone bản nháp |
| `src/app/core/models/sample-group.model.ts` | Kiểu bản nháp cục bộ của wizard, không phải persistence model |
| `src/app/core/models/request.model.ts` | Contract Request hiện hữu, không thêm field nhóm |
