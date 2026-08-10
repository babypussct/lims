# Review checklist — Kho Hóa Chất (LIMS)

**Ngày review:** 2026-08-10
**Phạm vi:** snapshot working tree hiện tại của repo `lims` trên nhánh `main`. Review này bảo toàn các thay đổi có sẵn; change log bên dưới ghi rõ phần code được cập nhật trong lần xử lý này.

## Kết luận điều hành

**Kho Hóa Chất chưa đạt mức release-ready.** Route, permission, UI cơ bản, chuẩn hóa đơn vị và đường điều chỉnh tồn kho nhanh đã có nền tảng tốt; build và các test hiện hữu đều chạy được. Nghiệp vụ hạn sử dụng đã được loại bỏ khỏi boundary Kho Hóa Chất trong thay đổi này; các blocker còn lại nằm ở trust boundary và tính toàn vẹn sổ kho:

1. Firestore cho `inventory_edit` quyền `create/delete/update` gần như không giới hạn, đồng thời cho phép ghi tùy ý vào `inventory/{id}/history`. Quyền này đang được cấp cho role kiểm nghiệm viên, nên kiểm soát ở UI không đủ bảo vệ dữ liệu.
2. Nhiều luồng trừ/hoàn kho trong SOP và Smart Batch cập nhật `inventory.stock` nhưng không ghi stock card theo item. `revokeApproval()` còn bỏ qua item bị mất rồi vẫn chuyển trạng thái request; luồng sửa request có thể tạo lại document inventory thiếu metadata.
3. Nghiệp vụ expiry của hóa chất đã được loại bỏ khỏi model/form/GS1-to-inventory flow; theo xác nhận dữ liệu Firestore hiện tại, chưa có document nào chứa `expiryDate`, nên không phát sinh migration dọn field. Vấn đề soft-delete ở các direct read path vẫn còn và được theo dõi riêng ở P2-INV-005.
4. Tạo mới dùng `set(..., { merge: true })` mà không kiểm tra document đã tồn tại; slug trùng có thể biến thao tác “tạo” thành ghi đè record cũ. Edit cũng không đọc snapshot mới trong transaction nên `oldStock` có thể stale.

Không phát hiện P0 unauthenticated write trong static review này, nhưng các P1 trên đủ để chặn release cho đến khi có rules hardening và regression test trực tiếp bằng SDK/emulator.

## Change log

- **2026-08-10:** Loại bỏ nghiệp vụ hạn sử dụng khỏi Kho Hóa Chất:
  - bỏ `expiryDate` khỏi `InventoryItem` và form Kho Hóa Chất;
  - GS1 scanner vẫn giữ GTIN/lot nhưng không đưa expiry vào inventory route hoặc GS1 info modal;
  - GS1 parser bỏ việc expose AI 17 và hybrid generator không phát sinh AI 17;
  - giữ nguyên `reference_standards.expiry_date`, FEFO và toàn bộ nghiệp vụ hạn dùng của Chất Chuẩn Đối Chiếu;
  - theo xác nhận trạng thái dữ liệu hiện tại, chưa có document Firestore nào chứa field `expiryDate`; normal inventory normalization vẫn strip field này trước khi persist để ngăn payload legacy lọt trở lại.

## Ranh giới hệ thống đã review

### Trong phạm vi chính

- Route `/inventory`, menu “Kho Hóa Chất”, permission `inventory_view`/`inventory_edit`.
- `InventoryItem`, `StockHistoryItem`, `InventoryComponent`, `InventoryService`.
- Collection `artifacts/{appId}/inventory` và subcollection `history`.
- Các mutation có thể thay đổi tồn kho: tạo/sửa/điều chỉnh nhanh/xóa/khôi phục, duyệt SOP, direct approve, Smart Batch, thu hồi duyệt, sửa request, backup/restore, recycle bin.
- Consumer của inventory: recipe search, SOP calculator/capacity, GS1 lookup, label printing, dashboard/low-stock helper.
- Firestore rules và test/build/lint hiện có.

### Ngoài phạm vi chính nhưng đã kiểm tra boundary

`reference_standards` là một stock domain riêng, không gộp vào tồn kho hóa chất. Các review trước/current test của standards được dùng để nhận diện integration boundary; review này không tuyên bố đã audit toàn bộ module Chất Chuẩn Đối Chiếu.

## Checklist coverage

| Hạng mục | Trạng thái | Bằng chứng / ghi chú |
|---|---:|---|
| Route và permission | [x] | `/inventory` guard bằng `INVENTORY_VIEW`; menu cũng bảo vệ bằng permission. `app.routes.ts:39-43`, `navigation.config.ts:129-137`. |
| Role matrix | [x] | Staff mặc định chỉ xem; lab technician và QC lead có `INVENTORY_EDIT`. `auth.service.ts:80-126`. |
| UI list/filter/form/GS1/capacity/labels | [x] | Đã đọc `inventory.component.ts` và `.html`; các khoảng trống được ghi ở P2/P3. |
| Model và unit normalization | [x] | `inventory.model.ts`, `normalizeInventoryItem()` và `parseQuantityInput()` đã được trace. |
| Inventory read/write service | [x] | Đã trace count, ID lookup, GTIN, low-stock, pagination, stock card, upsert, soft delete, restore, update stock, bulk zero. |
| SOP/Smart Batch stock mutations | [x] | Đã trace direct approve, batch plan, approve, revoke và update approved request trong `state.service.ts`. |
| Firestore top-level/history rules | [x] | Đã đọc block `inventory` hiện tại và đối chiếu với role mặc định. |
| Backup/restore/recycle | [x] | Đã đọc export/import và recycle bin, gồm hành vi parent delete đối với history subcollection. |
| GS1/label traceability | [x] | Đã trace scan lookup, duplicate behavior và hybrid QR payload. |
| Chemical expiry removal | [x] | `expiryDate` đã bỏ khỏi inventory model/form/GS1 flow; `test:inventory` có regression GTIN/lot và không phát sinh AI 17. |
| Existing tests | [x] | `test:standards` 100/100; `test:smart-batch` 33/33 + emulator 18/18; build pass. |
| Full lint gate | [!] | Fail 4 lỗi ở 2 file ngoài primary inventory scope; targeted lint cho các file inventory/downstream đã pass. |
| Direct SDK inventory exploit test | [ ] | Chưa có test emulator cho inventory editor/history; cần bổ sung trước khi đóng P1-INV-001. |
| Browser/runtime role matrix và dữ liệu thật | [ ] | Chưa chạy phiên đăng nhập thực, dữ liệu production, in nhãn thật hoặc backup lớn. |

## Findings

### P1-INV-001 — Firestore rules cho `inventory_edit` vượt quá trust boundary

**Trạng thái:** Review complete; remediation open.
**Mức độ:** P1 — critical integrity/security for authenticated inventory editors.

**Bằng chứng:**

- `firestore.rules:471-488` cho phép `inventory_edit` tạo và xóa document, cập nhật không giới hạn field; nhánh giới hạn `stock`/`lastUpdated` chỉ áp dụng khi người dùng chỉ có `batch_run`.
- Cùng block cho phép `inventory_edit` `allow write` toàn bộ `inventory/{itemId}/history/{histId}`.
- Role `role_lab_technician` đã có `INVENTORY_EDIT` tại `auth.service.ts:93-105`.
- UI có validation và `canEditInventory()` tại `inventory.component.ts:295-313`, `:361-385`, nhưng UI không phải trust boundary cho Firestore.

**Tác động:** Một SDK client có quyền `inventory_edit` có thể ghi stock âm, đổi tùy ý metadata/ID field/status, hard-delete record, hoặc sửa/xóa/tạo stock-card entry giả. Điều này bypass các guard ở `InventoryComponent` và làm cho audit không còn đáng tin cậy. Luồng ứng dụng vốn soft-delete, nhưng rule vẫn cho phép physical delete.

**Đề xuất và tiêu chí nghiệm thu:**

- Tách rule theo operation: create schema allowlist + identity invariant; metadata update chỉ cho field được phép; stock mutation phải dùng delta/transaction protocol; soft-delete/restore giới hạn role và field; physical delete mặc định deny hoặc manager-only.
- History nên append-only: client chỉ được tạo entry theo protocol đã correlate với parent stock change; deny update/delete. Nếu cần sửa sai, dùng compensating entry có quyền/approval riêng.
- Bắt buộc `request.resource.data.id == itemId` hoặc bỏ field `id` khỏi document và dùng document ID làm canonical identity.
- Viết emulator test direct SDK cho lab technician: negative stock, unknown field, hard delete, history update/delete/forged entry đều phải `assertFails`; test hợp lệ cho `updateStock()` và luồng approval phải `assertSucceeds`.

### P1-INV-002 — Stock card không bao phủ toàn bộ stock mutation và có rollback không đầy đủ

**Trạng thái:** Review complete; remediation open.
**Mức độ:** P1 — stock/audit reconciliation risk.

**Bằng chứng:**

- Model đã định nghĩa `SOP_DEDUCT` và `SOP_RETURN` tại `src/app/core/models/inventory.model.ts:21-31`, nhưng chỉ thấy service ghi history cho create/edit tại `inventory.service.ts:239-267` và quick adjustment tại `:369-382`.
- Các transaction nghiệp vụ chỉ update `inventory.stock`: direct approve `state.service.ts:1422-1431`, Smart Batch plan `:1591-1613`, approve request `:1723-1732`, revoke `:1840-1845`, edit approved request `:1957-1961`.
- `getStockCard()` chỉ đọc `inventory/{id}/history` tại `inventory.service.ts:221-227`; không có component inventory nào gọi hàm này, nên người dùng không có stock-card UI hoàn chỉnh.
- `revokeApproval()` chỉ đưa các item có snapshot tồn tại vào `existingItems` rồi vẫn update request/log (`state.service.ts:1841-1868`).
- `updateApprovedRequest()` dùng `transaction.set(..., { merge: true })` cho mọi diff (`state.service.ts:1957-1961`), nên positive diff có thể tạo lại doc thiếu `name`, `unit`, `category`, v.v.

**Tác động:** Số tồn kho hiện tại có thể đúng trong transaction nhưng sổ chi tiết theo hóa chất thiếu các lần SOP deduction/return/edit/revoke. Global log cũng không chứa line-item amount/stockAfter đủ để tái lập stock card. Nếu record bị xóa/mất trong lúc revoke, request có thể chuyển trạng thái nhưng kho không hoàn đủ.

**Đề xuất và tiêu chí nghiệm thu:**

- Chuẩn hóa một mutation protocol ghi atomically: parent stock, history entry (`actionType`, signed delta, before/after, request/SOP reference, actor), global audit và request state.
- Không bỏ qua inventory item khi hoàn tác: fail toàn transaction nếu bất kỳ item nào missing/tombstoned/invalid; hoặc có workflow reconciliation explicit có approval.
- Không dùng merge-set để tự tạo lại inventory doc trong request edit; positive diff phải yêu cầu active record tồn tại và đủ schema.
- Thêm regression cho create, quick import/export, SOP approval, direct approval, Smart Batch, revoke, edit, retry/conflict; kiểm tra `stockAfter` và tổng delta khớp parent stock.

### P1-INV-003 — RESOLVED: Đã loại bỏ nghiệp vụ hạn sử dụng khỏi Kho Hóa Chất

**Trạng thái:** [x] Resolved in change 2026-08-10.
**Mức độ:** Đã đóng theo yêu cầu nghiệp vụ; soft-delete read leakage vẫn còn ở P2-INV-005.

**Bằng chứng:**

- `InventoryItem` không còn field `expiryDate`; form và template inventory không còn control/input expiry: `src/app/core/models/inventory.model.ts`, `src/app/features/inventory/inventory.component.ts`, `src/app/features/inventory/inventory.component.html`.
- `normalizeInventoryItem()` xóa field legacy trước khi normal inventory service persist: `src/app/shared/utils/utils.ts:68-94`.
- Theo xác nhận dữ liệu Firestore hiện tại, chưa có document nào chứa `expiryDate`; vì vậy không cần chạy migration xóa field cho dataset hiện tại.
- GS1 flow chỉ giữ GTIN/lot khi đi vào inventory; `Gs1Data` không còn expose expiry, parser bỏ qua AI 17 và generator không phát sinh AI 17: `src/app/shared/utils/gs1-parser.ts`, `src/app/shared/components/gs1-info-modal/gs1-info-modal.component.ts`.
- Regression mới xác nhận GTIN/lot vẫn parse được và `expiryDate`/AI 17 không xuất hiện: `src/app/shared/utils/gs1-parser.test.ts`.
- `reference_standards.expiry_date` và FEFO vẫn giữ nguyên; thay đổi này không xóa nghiệp vụ hạn dùng của standards.

**Tác động sau thay đổi:** Kho Hóa Chất không còn hiển thị, lưu qua form, truyền qua GS1 route hoặc dùng expiry để tính/chặn tiêu thụ. Theo xác nhận hiện tại, dataset Firestore không có `expiryDate`; normal inventory writes tiếp tục strip field này để bảo vệ invariant nếu có payload cũ được đưa vào trong tương lai. Kiểm soát `_isDeleted` vẫn là một vấn đề độc lập.

**Đề xuất và tiêu chí nghiệm thu:**

- [x] Xóa expiry khỏi chemical inventory boundary và giữ nguyên standards expiry.
- [x] Không truyền `exp` từ GS1 info modal vào route `/inventory`.
- [x] Giữ GTIN/lot parsing và kiểm tra không phát sinh AI 17.
- [x] Theo xác nhận dữ liệu Firestore hiện tại, không có document chứa `expiryDate`; không cần migration dọn field cho dữ liệu hiện tại.

### P1-INV-004 — Tạo mới có thể ghi đè record do duplicate ID và edit không chống stale write

**Trạng thái:** Review complete; remediation open.
**Mức độ:** P1 — master-data and stock-history integrity.

**Bằng chứng:**

- UI tự sinh ID từ tên qua `generateSlug()` và cho phép sửa/nhập ID khi tạo: `inventory.component.ts:295-313`, `:346-359`.
- `upsertItem()` không đọc `invRef` trong transaction và luôn `transaction.set(..., { merge: true })`: `inventory.service.ts:231-242`.
- Cờ `isNew` và `oldStock` đến từ caller/UI; history create hoặc delta history được quyết định bởi dữ liệu cũ này, không phải snapshot mới nhất của Firestore: `inventory.component.ts:361-385`, `inventory.service.ts:243-267`.

**Tác động:** Hai hóa chất cùng slug hoặc người dùng nhập ID đã tồn tại có thể biến “Tạo mới” thành merge vào record cũ, ghi log `CREATE_ITEM` và tạo history sai. Hai editor đồng thời có thể mất cập nhật hoặc ghi delta/stockAfter sai vì `oldStock` stale.

**Đề xuất và tiêu chí nghiệm thu:**

- Transaction phải `get(invRef)` trước khi quyết định create/update; create chỉ thành công khi document chưa tồn tại.
- Canonical ID phải immutable; uniqueness/identity phải được bảo vệ ở rules hoặc registry transaction, không chỉ bằng slug UI.
- Edit phải dùng snapshot fresh, tính delta trên fresh stock, hoặc dùng compare-and-set/version. Không cho caller tùy ý khai báo `isNew`/`oldStock` như nguồn sự thật.
- Test duplicate slug, duplicate explicit ID, concurrent edit, concurrent stock adjustment và retry transaction.

### P2-INV-005 — Read path không nhất quán với soft-delete và low-stock/count không phải operational truth

**Trạng thái:** Review complete; remediation open.
**Mức độ:** P2 — stale/incorrect selection and reporting.

**Bằng chứng:**

- `getInventoryCount()` count toàn collection (`inventory.service.ts:48-54`), bao gồm deleted.
- `getLowStockItems()` lấy `limit(limitCount * 4)` rồi mới lọc threshold ở client (`:117-127`), nên record deleted hoặc các threshold phân bố khác nhau có thể chiếm slot và làm thiếu low-stock item.
- `getItemByGtin()` query GTIN/ref_code với `limit(1)` (`:129-150`), không lọc active record và không phát hiện duplicate.
- Recipe manager gọi `getInventoryPage()` (`recipe-manager.component.ts:211-215`), trong khi `getInventoryPage()` không filter deleted và search prefix field `id`, không search display name (`inventory.service.ts:157-201`).

**Tác động:** Recipe có thể chọn chemical đã xóa; GS1 có thể trả về record deleted/không xác định; dashboard/helper count và low-stock có thể lệch UI chính. Việc cache UI có filter không đủ vì consumer gọi service trực tiếp.

**Đề xuất và tiêu chí nghiệm thu:** Định nghĩa `activeInventoryQuery`/repository duy nhất; filter tombstone server-side trên mọi read; dùng count query có điều kiện; phân trang low-stock theo tiêu chí rõ ràng; GTIN phải unique trong active set và query phải trả duplicate conflict thay vì lấy record đầu tiên.

### P2-INV-006 — Backup/restore không bảo toàn stock history và có lỗi batch khi vượt 450 writes

**Trạng thái:** Review complete; remediation open.
**Mức độ:** P2 — recoverability/audit retention risk.

**Bằng chứng:**

- `exportData()` chỉ export top-level `sops` và `inventory`, không đọc `inventory/{id}/history`: `firebase.service.ts:368-383`.
- `importData()` tạo một `const batch` duy nhất; `checkBatch()` commit khi đạt 450 nhưng không khởi tạo batch mới trước khi tiếp tục `batch.set()`: `firebase.service.ts:385-413`. Với backup lớn hơn một batch, lần ghi tiếp theo có thể dùng WriteBatch đã commit.
- Soft-delete cố ý giữ history subcollection (`inventory.service.ts:303-308`), nhưng `emptyRecycleBin()` chỉ `batch.delete()` parent document (`config-general.component.ts:508-525`); history orphan không nằm trong backup/restore và không có cleanup verification.

**Tác động:** Restore lớn có thể fail giữa chừng; restore thành công cũng không khôi phục stock card. Dữ liệu lịch sử bị tách khỏi record hoặc bị bỏ khỏi backup mà không có báo cáo rõ ràng.

**Đề xuất và tiêu chí nghiệm thu:** Dùng helper chunk tạo batch mới sau mỗi commit và test 449/450/451 operations; export/import schema version + checksum/count; quyết định export history hay ghi rõ history không thuộc backup; có dry-run, rollback/partial-failure report và post-restore reconciliation.

### P2-INV-007 — GS1/nhãn chưa gắn chặt với chemical record và lot

**Trạng thái:** Review complete; remediation open.
**Mức độ:** P2 — traceability/label correctness.

**Bằng chứng:**

- Scan trên inventory lấy phần tử đầu tiên trong cache có `gtin` hoặc `ref_code` trùng (`inventory.component.ts:173-202`).
- Service query GTIN/ref_code cũng dùng `limit(1)` và không kiểm tra uniqueness/active state (`inventory.service.ts:129-150`).
- Tab Tem nhúng generic `LabelPrintComponent` không truyền inventory item/lot (`inventory.component.html:297-301`).
- Hybrid QR dùng default `gs1Gtin = '08934567890128'` và payload chỉ gắn text qua AI 240 (`label-print.component.ts:131-133`, `:689-696`).

**Tác động:** Duplicate GTIN có thể mở nhầm chemical; nhãn hybrid mặc định có GTIN cố định không phản ánh record đang in và không đủ dữ liệu truy xuất lô.

**Đề xuất và tiêu chí nghiệm thu:** Chọn record/lô từ inventory khi in; validate GTIN/check digit và unique active GTIN; payload phải chứa identity canonical và dữ liệu lô phù hợp. Test duplicate, deleted record, GS1 scan, QR decode và đối chiếu label với record.

### P2-INV-008 — Cache 2.000 item và capacity snapshot tạo sai lệch khi kho lớn/đang thay đổi

**Trạng thái:** Review complete; remediation open.
**Mức độ:** P2 — scale/operational correctness.

**Bằng chứng:**

- Inventory DeltaSync giới hạn `maxCacheSize: 2000` tại `state.service.ts:347-356`.
- DeltaSync initial fetch dùng `limit(maxCacheSize)` và trim array theo giới hạn (`delta-sync.service.ts:762-780`, `:167-189`).
- `InventoryComponent.totalCount` lấy `allItems().length`, còn `isInitialLoading` coi length bằng 0 là loading (`inventory.component.ts:51-58`, `:96-97`).
- Capacity map chỉ load một lần khi map rỗng; `refreshData()` không reload map (`inventory.component.ts:204-231`, `:275-280`).

**Tác động:** Kho trên 2.000 record không có total/list đầy đủ; `totalCount` là cache count chứ không phải database count; kho hợp lệ nhưng rỗng có thể hiện skeleton mãi; capacity có thể dùng stock cũ sau update/import/restore.

**Đề xuất và tiêu chí nghiệm thu:** Dùng server-side pagination + count/summary; tách `loading/loaded` khỏi empty array; capacity đọc snapshot có version/invalidated theo inventory event hoặc query fresh; test empty, 1.999, 2.000, 2.001 records và update sau khi mở capacity.

### P3-INV-009 — Một số integrity/UX gaps còn lại

**Trạng thái:** Review complete; backlog open.
**Mức độ:** P3.

- `threshold` không có `Validators.min(0)` trong `inventory.component.ts:134-145`; giá trị âm làm fallback ngầm sang 5 ở nhiều chỗ và không phản ánh cấu hình người dùng.
- `bulkZeroStock()` không giới hạn batch 500, không đọc stock cũ, ghi `amountChange: 0` dù stock có thể thay đổi và hiện không thấy UI caller (`inventory.service.ts:400-434`).
- `deleteItem()` đọc stock trước rồi mới batch soft-delete/log (`inventory.service.ts:290-325`), nên số “tồn cuối” trong log có thể stale khi có concurrent update; không ghi stock-card entry cho deletion.
- Read-only user click row sẽ gọi `openModal()` rồi nhận lỗi “không có quyền sửa”, không có detail modal riêng; stock card service chưa được nối vào UI.

## Điều đã kiểm chứng

| Lệnh | Kết quả |
|---|---|
| `npm.cmd run test:standards` | **PASS — 100/100**. Bao gồm FEFO, định lượng, static rules và các test standards; không có test `InventoryService`/`InventoryComponent`. |
| `npm.cmd run test:inventory` | **PASS — 2/2** — regression GS1 GTIN/lot và không expose expiry/AI 17. |
| `npm.cmd run test:smart-batch` | **PASS — 33/33 unit + 18/18 emulator**. Emulator được dọn sau test và port 8080 được release. Đây là coverage Smart Batch/standards, không phải inventory editor/history. |
| `npm.cmd run build` | **PASS** — release notes đồng bộ `v26.08.10-b01`, Angular bundle hoàn tất. |
| `npx.cmd eslint` trên các file inventory/downstream chính | **PASS** — `inventory.component.ts`, `inventory.service.ts`, `firebase.service.ts`, `state.service.ts`, recipe manager, calculator và label printer. |
| `npm.cmd run lint` | **FAIL — 4 lỗi ngoài primary inventory scope**: `smart-batch-firestore-rules.emulator.test.ts:505` dùng `Array<T>`; `standards-form-modal.component.ts:91,93` có irregular whitespace. Full lint gate vì vậy chưa xanh. |
| Search test inventory | **Khoảng trống** — chỉ thấy model/component/service; không có `inventory.service.test.ts`, `inventory.component.spec.ts` hoặc inventory rules emulator test. `getStockCard()` chỉ có implementation, không có caller trong app. |

## Release gate / checklist tiếp theo

### Bắt buộc trước khi đóng review P1

- [ ] Hardening `firestore.rules` cho top-level inventory và history.
- [ ] Emulator direct-SDK tests cho negative stock, arbitrary fields, hard delete, forged history và các đường hợp lệ.
- [ ] Centralize stock mutation + history + audit; sửa revoke/update request để không bỏ qua/mạo tạo inventory record.
- [ ] Enforce canonical ID/GTIN uniqueness và optimistic concurrency.
- [ ] Thêm regression test inventory tối thiểu cho các case P1.

### Nên hoàn tất trước production sign-off

- [ ] Sửa backup/import chunking và quyết định phạm vi backup của stock history.
- [ ] Loại `_isDeleted` khỏi mọi active read/recipe/GS1/low-stock/count path.
- [ ] Thiết kế lại cache/pagination/capacity invalidation cho >2.000 records.
- [ ] Nối stock-card UI và read-only detail view.
- [ ] Kiểm tra label/QR thực tế bằng record+lô thật và decode kết quả in.
- [ ] Full lint xanh; phân loại 4 lỗi lint hiện tại trước khi merge/release.

### Cần chạy thật / phụ thuộc dữ liệu-nghiệp vụ

- [ ] Role matrix: staff view-only, lab technician edit, QC lead approval, pending/no permission.
- [ ] Empty inventory, duplicate ID/GTIN, deleted record, multi-lot cùng chemical; xác nhận legacy expiry field không xuất hiện trong UI/GS1 flow.
- [ ] Backup/restore với 451 inventory/SOP writes và kiểm tra history sau restore.
- [ ] Capacity sau quick import, SOP approval, revoke và reload tab.
- [ ] GS1 scan có GTIN/ref_code/lot hợp lệ, sai và trùng.

## Phụ lục đường dẫn chính

- `src/app/app.routes.ts:39-43` — route inventory và permission guard.
- `src/app/core/layout/navigation.config.ts:129-137` — menu Kho Hóa Chất/Tem.
- `src/app/features/inventory/inventory.component.ts` — UI state, form, scan, capacity và actions.
- `src/app/features/inventory/inventory.service.ts` — read/write/stock-card/soft-delete.
- `src/app/core/services/state.service.ts:337-360`, `:1417-1961` — listener và downstream stock mutations.
- `src/app/core/services/calculator.service.ts:163-398` — consumption/capacity dựa trên stock, không có expiry business.
- `src/app/core/services/firebase.service.ts:368-413` — backup/restore.
- `firestore.rules:471-488` — inventory top-level/history authorization.
