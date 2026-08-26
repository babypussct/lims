# Kế hoạch khắc phục toàn diện chức năng Báo Cáo

Trạng thái: `Kế hoạch triển khai`

Cập nhật: `2026-08-26`

Phạm vi chính: `Báo Cáo / Statistics`, dữ liệu lịch sử, xuất Excel, quyền `report_view`, Firestore Rules và các loader phục vụ báo cáo.

## 1. Mục tiêu

Khắc phục chức năng **Báo Cáo** theo bốn tiêu chí bắt buộc:

- người chỉ có quyền `report_view` phải xem và xuất được đầy đủ mọi báo cáo mà không cần mượn quyền vận hành của Kho, SOP hoặc Chất chuẩn;
- dữ liệu báo cáo phải đầy đủ theo khoảng thời gian đã chọn, không âm thầm mất dữ liệu vì listener gần nhất, cache, giới hạn `limit(...)` hoặc soft-delete;
- `report_view` chỉ được mở các quyền **đọc** thật sự cần cho báo cáo, tuyệt đối không mở quyền tạo/sửa/xóa dữ liệu nghiệp vụ;
- kết quả trên màn hình và file Excel phải dùng cùng nguồn dữ liệu/cùng quy tắc ngày giờ để không lệch số liệu.

## 2. Nguyên tắc kiến trúc và bảo mật

### 2.1. Least privilege

- `report_view` là quyền báo cáo, không phải quyền vận hành.
- Không ánh xạ `report_view` thành `inventory_edit`, `sop_view`, `sop_edit`, `standard_edit`, `standard_approve`, `standard_request`, `batch_run` hoặc các quyền xóa log.
- Chỉ bổ sung `report_view` vào các rule `read/get/list` thực sự cần cho báo cáo.
- Giữ nguyên toàn bộ rule `create/update/delete` hiện tại trừ khi một test bảo mật chứng minh có lỗi độc lập với Báo Cáo.
- Không dùng quyền rộng hơn để “chữa” lỗi `PERMISSION_DENIED` ở UI.

### 2.2. Dữ liệu báo cáo phải có đường đọc riêng

- Ưu tiên loader theo khoảng thời gian hoặc snapshot báo cáo thay vì bật các realtime listener nghiệp vụ chỉ để lấy dữ liệu cho Báo Cáo.
- Loader báo cáo phải trả trạng thái `complete/incomplete` khi có khả năng thiếu trang, thiếu khoảng thời gian hoặc lỗi quyền; không được nuốt lỗi rồi trả mảng rỗng như thể báo cáo thật sự không có dữ liệu.
- Cache chỉ là tối ưu. Cache không được làm thay đổi tính đầy đủ của báo cáo.
- Các bản ghi soft-delete cần cho tái dựng lịch sử phải được giữ trong đường đọc báo cáo nếu phép tính lịch sử phụ thuộc vào chúng.

### 2.3. Một nguồn sự thật cho UI và Excel

- Mỗi nhóm dữ liệu báo cáo chỉ có một loader/canonical dataset.
- Tab trên UI và sheet Excel tương ứng phải lấy dữ liệu từ cùng dataset đã chuẩn hóa.
- Không để UI đọc từ realtime state còn Excel lại tự query một nguồn khác với logic lọc ngày khác.

## 3. Baseline đã xác minh

- [x] `stats/master` chỉ đọc khi có `report_view`; ghi stats vẫn do quyền cập nhật nghiệp vụ kiểm soát.
- [x] `monthly_stats` cho phép `report_view` đọc và không mở quyền ghi tương ứng.
- [x] `InventoryService.getAllInventoryForReports()` có đường đọc toàn collection phục vụ N-X-T và giữ cả bản ghi soft-delete để tái dựng lịch sử.
- [x] Firestore `inventory` hiện cho `inventory_view || report_view` đọc; `report_view` không có quyền tạo/xóa và không vượt qua rule update.
- [x] `AuditLogService.getLogsByDateRange()` yêu cầu `canViewReports()` và đọc log lớp `BUSINESS` theo khoảng ngày.
- [x] Firestore audit phân tách `BUSINESS -> report_view` và `SYSTEM -> user_manage`.
- [x] `print_jobs` đã cho `report_view` đọc để hỗ trợ snapshot/in dữ liệu lịch sử, trong khi create/update/delete vẫn bị giới hạn riêng.
- [x] `StateService.loadApprovedRequestsForDateRange()` đã có ý định hỗ trợ `canViewReports()` và tải lịch sử theo khoảng ngày thay vì chỉ dựa vào feed gần nhất.
- [x] Statistics đã lazy-load standards/standard requests theo tab thay vì luôn mở tất cả khi vào trang.
- [x] Bộ Firestore emulator hiện chạy `35` test, `34` pass, `1` fail.

Lỗi test đang còn:

```text
report_view can read inventory for NXT reporting without inventory write access
```

Phần kiểm tra write của `customReportOnly` đã bị từ chối đúng. Test fail ở assertion cuối vì dùng user `viewer` làm đối chứng không có quyền đọc kho, trong khi role `viewer` của hệ thống có effective permission `inventory_view`.

## 4. Các lỗ hổng cần khắc phục

### P0 — Test permission đang mô tả sai effective permission

`smart-batch-firestore-rules.emulator.test.ts` dùng `viewer` cho negative inventory read dù role này thực tế có `inventory_view`.

Hậu quả:

- test đỏ dù rule kho đang làm đúng;
- dễ dẫn tới sửa nhầm rule bảo mật để làm test xanh;
- các test permission khác có thể lặp lại lỗi “permissions array rỗng = không có quyền” trong khi role/default mapping vẫn cấp quyền.

### P0 — `requests` client cho Báo Cáo đọc nhưng Firestore Rules chưa đồng bộ

`StateService.loadApprovedRequestsForDateRange()` cho phép `canViewReports()`, nhưng Firestore rule hiện là:

```text
requests/{reqId}
  get  -> public
  list -> canUseSopWorkspace() -> sop_view
```

Do đó tài khoản chỉ có `report_view` có thể đi vào đường loader báo cáo nhưng bị chặn khi query collection.

Đây là dependency quan trọng vì lịch sử phiếu đã duyệt được dùng cho:

- tiêu hao;
- tần suất SOP / chi tiết SOP;
- một phần dữ liệu tổng hợp và Excel.

### P0 — `standard_requests` chưa cho report-only đọc toàn bộ lịch sử

Firestore hiện chỉ cho đọc nếu có quyền vận hành/log chuẩn hoặc là chính người tạo request.

Trong `StateService.loadAllStandardRequests()`, biến `canReadAll` cũng chưa tính `canViewReports()`. Vì vậy report-only hiện có thể rơi vào query `requestedBy == currentUser.uid`, dẫn đến tab sức khỏe/truy xuất chuẩn hiển thị thiếu lịch sử toàn hệ thống.

### P0 — `reference_standards` chưa cho `report_view` đọc

Rule hiện yêu cầu `standard_view`. Trong khi tab `consumption`, tab `standards` và export chuẩn gọi `loadReferenceStandards()`.

Hậu quả là user report-only có thể vào Báo Cáo nhưng tab liên quan chuẩn bị rỗng hoặc ghi lỗi quyền trong console.

### P0 — state Kho không được load cho report-only nhưng báo cáo Tiêu hao vẫn dùng `state.inventory()`

Realtime inventory listener chỉ chạy khi có `inventory_view`. Điều này là đúng cho module Kho, nhưng Statistics hiện vẫn dùng `state.inventory()` để:

- ánh xạ category;
- áp dụng safety margin khi xuất tiêu hao;
- phân loại dữ liệu trên một số biểu đồ/tổng hợp.

Vì thế report-only dù đã được Firestore cho đọc inventory vẫn có thể có số liệu/nhãn thiếu ở tab Tiêu hao.

Không nên sửa bằng cách bật inventory realtime listener cho mọi `report_view`. Cần dùng snapshot/loader riêng của Báo Cáo.

### P1 — Bộ chọn SOP đang phụ thuộc `state.sops()` và `sop_view`

SOP listener chỉ chạy khi có `sop_view`, Firestore `sops` cũng chỉ cho `sop_view` đọc.

Không nên mặc định mở toàn bộ SOP document cho `report_view` nếu Báo Cáo chỉ cần `id/name`. SOP document có thể chứa nhiều dữ liệu nghiệp vụ hơn mức cần thiết.

Phương án ưu tiên:

- tạo `reportSopOptions` từ dữ liệu báo cáo vốn đã được phép đọc: monthly stats, approved requests và snapshot audit;
- giữ nhãn SOP lịch sử kể cả khi SOP hiện tại đã archived/deleted;
- chỉ cân nhắc mở `report_view` đọc `sops` nếu contract test chứng minh Báo Cáo thật sự cần trường không thể lấy an toàn từ dữ liệu lịch sử.

### P1 — Loader chuẩn/request đang có giới hạn cứng và có nguy cơ âm thầm thiếu dữ liệu

Hiện có các giới hạn như:

- `standard_requests`: `limit(1000)`;
- `reference_standards`: `limit(10000)`.

Giới hạn có thể hợp lý cho UI nghiệp vụ, nhưng không được dùng như giới hạn “đầy đủ lịch sử” của Báo Cáo nếu không có pagination hoặc trạng thái incomplete.

### P1 — Báo Cáo đang trộn recent listener và range loader

Statistics vẫn gọi các listener gần nhất (`ensureApprovedRequestsListener`, audit listener) đồng thời có loader theo khoảng ngày.

Rủi ro:

- read thừa;
- dữ liệu cũ/mới được merge theo nhiều đường khác nhau;
- report-only phải được mở thêm permission chỉ để listener chạy;
- cache gần nhất có thể che lỗi range loader nếu không test đúng.

## 5. Ma trận dependency của Báo Cáo

| Bề mặt | Dataset cần thiết | Trạng thái quyền hiện tại | Trạng thái đích |
|---|---|---|---|
| Bộ lọc chung / tên SOP | SOP id/name lịch sử | phụ thuộc `sop_view` qua `state.sops()` | derive `reportSopOptions`; không cần mở SOP full-doc nếu không bắt buộc |
| KPI / thống kê tổng hợp | `stats`, `monthly_stats` | `report_view` đọc được | giữ nguyên; test khoảng tháng/all-time |
| Tab 1 — Nhật ký hoạt động | `logs` lớp `BUSINESS`, snapshot print khi cần | đã có report path | giữ `BUSINESS` only; không mở `SYSTEM` |
| Tab 2 — N-X-T | inventory snapshot kể cả soft-delete + business logs + dữ liệu SOP filter liên quan | inventory parent đã đọc được; client path riêng đã có | dùng report inventory snapshot + range logs; không bật inventory listener |
| Tab 3 — Tiêu hao & biểu đồ | approved requests, inventory metadata, safety/categories config, reference standards khi phân loại | requests list/rules lệch; inventory state thiếu; standards bị chặn | loader báo cáo riêng, rules read-only đồng bộ |
| Tab 4 — Tần suất SOP | monthly stats + approved request history + SOP labels | stats OK; requests report-only chưa list được | requests read-only + SOP labels derive từ lịch sử |
| Tab 5 — Sức khỏe & truy xuất chuẩn | `reference_standards`, `standard_requests`, business logs | report-only bị thiếu quyền/read-all | cho report-only read cần thiết, không mở write/nested logs ngoài nhu cầu |
| Xuất Excel tổng hợp | hợp của các dataset theo sheet được chọn | có thể lệch theo loader từng nhánh | preload một report snapshot, sau đó sinh mọi sheet từ snapshot đó |

## 6. Kế hoạch triển khai

### Giai đoạn 1 — Chuẩn hóa permission fixtures và khóa regression baseline

- [ ] Sửa assertion inventory âm: dùng `pending` hoặc fixture riêng `customNoAccess` thay cho `viewer`.
- [ ] Thêm helper/test mô tả **effective permission** của từng fixture để không suy luận từ `permissions: []`.
- [ ] Giữ test chứng minh `customReportOnly` đọc được inventory nhưng update inventory bị từ chối.
- [ ] Chạy lại `npm run test:firestore-rules`; baseline phải về `35/35` trước khi mở thêm rule.

Tiêu chí hoàn tất:

- test permission đỏ chỉ khi hành vi hệ thống thật sự sai;
- không sửa rule bảo mật để phù hợp với một fixture mô tả sai quyền.

### Giai đoạn 2 — Đồng bộ Firestore Rules với contract `report_view`

Thay đổi tối thiểu cần đánh giá/triển khai:

- [ ] `requests/{reqId}`: cho `report_view` thực hiện `list` phục vụ lịch sử Báo Cáo; giữ nguyên create/update/delete.
- [ ] `reference_standards/{stdId}`: cho `report_view` đọc document chuẩn cần cho Báo Cáo; không mở nested `logs` nếu UI/export không cần trực tiếp.
- [ ] `standard_requests/{reqId}`: cho `report_view` đọc toàn collection phục vụ sức khỏe/truy xuất; giữ nguyên mọi rule write.
- [ ] Không mở `standard_tags`, SOP history, inventory history hoặc các collection khác cho `report_view` nếu dependency matrix/test không chứng minh cần thiết.
- [ ] Không mở `SYSTEM` audit log cho `report_view`.

Riêng SOP:

- [ ] Ưu tiên loại dependency vào `sops` full-doc bằng `reportSopOptions`.
- [ ] Chỉ thêm `report_view` vào rule SOP nếu sau khi refactor vẫn có trường bắt buộc không thể lấy từ snapshot báo cáo an toàn.

### Giai đoạn 3 — Tạo lớp dữ liệu Báo Cáo rõ ràng

Tách trách nhiệm Báo Cáo khỏi state nghiệp vụ bằng một API thống nhất, ví dụ `ReportDataService` hoặc các report loaders tương đương.

Contract đề xuất:

```ts
interface ReportSnapshot {
  range: { start: Date; end: Date };
  inventory: InventoryItem[];
  approvedRequests: Request[];
  businessLogs: Log[];
  monthlyStats: Record<string, MonthlyStats>;
  referenceStandards: ReferenceStandard[];
  standardRequests: StandardRequest[];
  sopOptions: Array<{ id: string; name: string }>;
  complete: boolean;
  warnings: string[];
}
```

- [ ] Loader chỉ chạy khi `canViewReports()`.
- [ ] Inventory dùng đường report snapshot, không bật realtime inventory listener cho report-only.
- [ ] Approved requests dùng loader theo date range có pagination và trạng thái complete.
- [ ] Audit dùng `BUSINESS` range query.
- [ ] Monthly stats chỉ tải đúng các tháng giao với khoảng báo cáo; all-time tải theo contract riêng.
- [ ] Reference standards chỉ tải khi tab/export cần.
- [ ] Standard requests chỉ tải khi tab/export cần và phải có pagination đến khi hết dữ liệu liên quan.
- [ ] Xây `sopOptions` từ dữ liệu lịch sử/report snapshot, dedupe theo id, ưu tiên tên mới nhất nhưng không làm mất nhãn lịch sử.
- [ ] Mọi lỗi loader phải nổi lên UI/export dưới dạng lỗi hoặc warning; không `catch -> []` rồi tiếp tục như dữ liệu đầy đủ.

### Giai đoạn 4 — Sửa `StateService`/Statistics để không phụ thuộc quyền module khác

- [ ] `loadAllStandardRequests()`: tính `canViewReports()` là quyền đọc toàn bộ cho report path, không query riêng `requestedBy == uid`.
- [ ] `loadReferenceStandards()`: thêm guard rõ ràng cho `standard_view || report_view`; trả lỗi/complete status thay vì chỉ `console.warn`.
- [ ] Không dùng `state.inventory()` làm nguồn bắt buộc trong report-only flow; chuyển sang report inventory snapshot.
- [ ] Không dùng `state.sops()` làm nguồn duy nhất cho dropdown/tên SOP trong Báo Cáo.
- [ ] Với report-only, không khởi động `ensureApprovedRequestsListener()` nếu range loader đã cung cấp đủ dữ liệu cho trang.
- [ ] Với audit, ưu tiên range loader trong Statistics; listener gần nhất chỉ giữ nếu có giá trị UX rõ ràng và không ảnh hưởng completeness.
- [ ] Khi đổi date range/SOP/tab trong lúc request cũ còn chạy, giữ generation/cancellation guard để response cũ không ghi đè response mới.

### Giai đoạn 5 — Loại bỏ silent truncation

- [ ] Thay `limit(1000)` của report standard requests bằng pagination có `startAfter(...)` đến khi hết trang, hoặc query theo range thích hợp nếu schema cho phép.
- [ ] Reference standards: pagination đến hết active set nếu Báo Cáo yêu cầu toàn bộ; nếu dùng giới hạn bảo vệ thì phải trả `complete=false` và warning rõ ràng.
- [ ] Audit range lớn: phân trang nếu collection có thể tăng lớn, tránh một `getDocs` khổng lồ.
- [ ] Inventory report snapshot: cân nhắc paging khi số lượng lớn; vẫn phải giữ tombstone/soft-delete cần cho lịch sử N-X-T.
- [ ] Thiết lập guard kích thước export để tránh khóa UI, nhưng guard không được âm thầm cắt dòng.

### Giai đoạn 6 — Chuẩn hóa logic thời gian và số liệu

- [ ] Một helper duy nhất xác định inclusive date range cho UI và Excel.
- [ ] Kiểm tra ngày đầu/cuối kỳ theo timezone ứng dụng `Asia/Ho_Chi_Minh`.
- [ ] N-X-T phải tiếp tục tính được tồn cuối kỳ bằng cách tính các movement sau `endDate` khi cần, không chỉ lấy stock hiện tại.
- [ ] Kiểm tra record đúng 00:00:00 và 23:59:59.999 không rơi khỏi kỳ.
- [ ] Kiểm tra all-time mode không phụ thuộc default date range ẩn.
- [ ] Giữ cùng quy tắc làm tròn/đơn vị giữa bảng UI, biểu đồ và Excel.

### Giai đoạn 7 — Đồng nhất UI và Excel theo `ReportSnapshot`

- [ ] Tab `logs` render từ `businessLogs` của snapshot/range loader.
- [ ] Tab `nxt` render từ report inventory + movements đã chuẩn hóa.
- [ ] Tab `consumption` dùng approved requests + report inventory metadata + safety config cùng snapshot.
- [ ] Tab `sops` dùng stats/history và `sopOptions` đã chuẩn hóa.
- [ ] Tab `standards` dùng reference standards + standard requests + business logs đã tải đầy đủ.
- [ ] Export Excel preload tất cả dataset cần cho các checkbox đang chọn trước khi tạo workbook.
- [ ] Nếu bất kỳ dataset bắt buộc nào `complete=false`, dừng export và báo dataset nào thiếu; không xuất file có vẻ hợp lệ nhưng thiếu dòng.
- [ ] Tên SOP trong header/sheet lấy từ `reportSopOptions`, không phụ thuộc module SOP đã được load hay chưa.

## 7. Kế hoạch test bắt buộc

### 7.1. Firestore emulator — quyền đọc

Với `customReportOnly` chỉ có `report_view`:

- [ ] đọc được `stats/master`;
- [ ] đọc/list được `monthly_stats`;
- [ ] đọc/list được inventory parent collection;
- [ ] query được approved request history cần cho Báo Cáo;
- [ ] query được `BUSINESS` audit logs;
- [ ] không query được `SYSTEM` audit logs;
- [ ] đọc được reference standards cần cho report;
- [ ] đọc được toàn bộ standard requests cần cho report;
- [ ] đọc được print jobs khi report enrichment cần;
- [ ] SOP full-doc chỉ đọc được nếu kiến trúc cuối cùng thật sự quyết định cấp quyền đó.

### 7.2. Firestore emulator — quyền ghi phải bị từ chối

Với cùng `customReportOnly`:

- [ ] không create/update/delete inventory;
- [ ] không create/update/delete SOP;
- [ ] không create/update/delete reference standards;
- [ ] không create/update/delete standard requests;
- [ ] không create/update/delete requests/results;
- [ ] không ghi stats/monthly_stats;
- [ ] không tạo hoặc sửa business/system audit logs ngoài các protocol vốn có;
- [ ] không xóa print jobs hoặc log lịch sử.

Negative control dùng `pending` hoặc `customNoAccess`, không dùng `viewer` cho các collection mà viewer mặc định đã có quyền.

### 7.3. Unit/service tests

- [ ] `loadAllStandardRequests()` dùng full read path khi `canViewReports() === true`.
- [ ] report-only không bị rơi vào query `requestedBy == currentUser.uid`.
- [ ] pagination standard requests gom đủ >1000 fixtures.
- [ ] reference standards loader báo incomplete/error thay vì trả rỗng khi Firestore từ chối.
- [ ] approved request history merge/dedupe đúng khi cùng record xuất hiện ở nhiều query date field.
- [ ] report inventory giữ soft-deleted item cần cho lịch sử nhưng không coi tombstone là active stock trong UI hiện tại.
- [ ] `reportSopOptions` giữ được SOP đã archived/deleted nếu kỳ báo cáo có dữ liệu lịch sử.
- [ ] generation guard bỏ response cũ sau khi đổi filter.
- [ ] all-time stats và selected-range stats cho cùng kết quả ở khoảng tương đương.

### 7.4. Component/report utility tests

- [ ] 5 tab render đúng với report-only fixture.
- [ ] chọn SOP lọc đồng nhất N-X-T, tiêu hao, log và export.
- [ ] no-data thật sự khác trạng thái load error/permission error.
- [ ] date boundary đầu/cuối ngày chính xác.
- [ ] Excel N-X-T khớp bảng N-X-T trên UI.
- [ ] Excel Tiêu hao khớp tổng/chi tiết UI với cùng `excludeMargin`.
- [ ] Excel SOP frequency khớp tab SOP.
- [ ] Excel Logs chỉ chứa `BUSINESS` đúng range/filter.
- [ ] Excel Standards khớp health/traceability dataset.

### 7.5. Kiểm thử web đã đăng nhập

Dùng một account/fixture có đúng `report_view` và không có các quyền module khác.

- [ ] vào route Báo Cáo không gặp permission error;
- [ ] dropdown SOP có dữ liệu hợp lệ;
- [ ] mở lần lượt `logs`, `nxt`, `consumption`, `sops`, `standards`;
- [ ] đổi khoảng ngày ngắn, dài và all-time;
- [ ] kiểm tra kỳ không có dữ liệu;
- [ ] kiểm tra kỳ có SOP đã archived/deleted;
- [ ] xuất preset tóm tắt, đầy đủ và từng nhóm sheet;
- [ ] so sánh file Excel report-only với cùng kỳ khi đăng nhập Manager: số dòng/tổng số phải giống nhau cho dữ liệu được phép báo cáo;
- [ ] xác minh report-only không thể thao tác sửa dữ liệu bằng UI hoặc request trực tiếp.

## 8. Hiệu năng và khả năng quan sát

- [ ] Không mở toàn bộ listener Kho/SOP/Chuẩn chỉ vì người dùng có `report_view`.
- [ ] Ghi read-monitor theo dataset và phase (`cache`, `range`, `page`) để thấy chi phí thật.
- [ ] Date range load phải có cache key gồm user scope + range + dataset version/cursor cần thiết.
- [ ] Không dùng cache của user trước sau khi đổi tài khoản/permission.
- [ ] Log lỗi phải chỉ rõ dataset và range, không chỉ ghi `Error fetching report` chung chung.
- [ ] UI hiển thị trạng thái tải theo dataset khi export để biết sheet nào đang chờ/thất bại.

## 9. Thứ tự triển khai đề xuất

1. Sửa test fixture inventory và đưa Firestore baseline về xanh.
2. Thêm emulator test đỏ cho `customReportOnly` trên `requests`, `reference_standards`, `standard_requests` và toàn bộ negative writes.
3. Sửa Firestore Rules tối thiểu để các test đọc cần thiết xanh, giữ write tests đỏ theo kỳ vọng.
4. Sửa report loaders/client guards để `report_view` thực sự dùng full report dataset.
5. Tách inventory/SOP dependencies khỏi realtime operational state.
6. Thêm pagination/completeness cho các collection có nguy cơ cắt dữ liệu.
7. Chuẩn hóa `ReportSnapshot` và cho UI/Excel dùng chung.
8. Chạy unit + Firestore emulator + typecheck/build.
9. Kiểm thử web bằng tài khoản report-only và đối chiếu kết quả với Manager.

## 10. Lệnh kiểm tra trước khi đóng hạng mục

Tối thiểu:

```bash
npm run test:firestore-rules
npm test
npm run build
```

Nếu full suite quá lớn để chạy mỗi vòng phát triển, phải chạy các suite liên quan Báo Cáo sau mỗi phase và chạy full suite trước khi kết luận hoàn tất.

## 11. Definition of Done

Chức năng Báo Cáo chỉ được coi là **khắc phục hoàn toàn** khi đồng thời đạt tất cả điều kiện sau:

- [ ] user chỉ có `report_view` mở được và sử dụng đầy đủ 5 tab Báo Cáo;
- [ ] mọi preset/checkbox xuất Excel hoạt động với report-only;
- [ ] dữ liệu UI và Excel khớp nhau cho cùng range/SOP/options;
- [ ] không có `PERMISSION_DENIED` hợp lệ nào trong report flow;
- [ ] không phải cấp thêm quyền vận hành cho report-only;
- [ ] `report_view` không ghi được bất kỳ dữ liệu Kho/SOP/Chuẩn/Request/Stats nghiệp vụ nào;
- [ ] dữ liệu lịch sử không bị mất vì soft-delete, recent-listener cap hoặc `limit(...)` cứng;
- [ ] all-time và date-range có contract completeness rõ ràng;
- [ ] Firestore emulator xanh toàn bộ;
- [ ] unit/component tests Báo Cáo xanh;
- [ ] typecheck/build xanh;
- [ ] kiểm thử web report-only qua đủ 5 tab và Excel xanh;
- [ ] không làm tăng listener nền cho người dùng chỉ có `report_view` ngoài các loader Báo Cáo cần thiết.

## 12. Các điểm không được đánh đổi

- Không sửa lỗi bằng cách biến `report_view` thành quyền admin/read-all toàn ứng dụng.
- Không mở write để “cho export chạy”.
- Không dùng `viewer` làm negative permission fixture khi role viewer mặc định đã có quyền đọc module đó.
- Không coi mảng rỗng sau `catch` là báo cáo hoàn chỉnh.
- Không cắt lịch sử ở 1000/10000 dòng mà không pagination hoặc cảnh báo incomplete.
- Không bỏ dữ liệu soft-delete nếu cần tái dựng N-X-T lịch sử.
- Không cho log `SYSTEM` lọt vào Báo Cáo nghiệp vụ chỉ vì cùng nằm trong collection `logs`.
