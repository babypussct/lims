# Kế hoạch triển khai: Đồng bộ mã nội bộ trong Quản lý chất chuẩn đối chiếu

> Phạm vi: hoàn thiện flow Đồng bộ mã nội bộ từ scan, review, correction, apply, audit đến rollout production.
>
> Tài liệu này dựa trên audit hiện trạng của flow tại commit hiện tại. Mục tiêu là xử lý các lỗ hổng về toàn vẹn dữ liệu, khả năng truy vết, validation UI, hiệu năng và kiểm thử trước khi sử dụng rộng trên dữ liệu thật.

---

## 1. Mục tiêu triển khai

### 1.1. Mục tiêu nghiệp vụ

Sau khi hoàn tất, công cụ phải bảo đảm:

1. Mọi hồ sơ chất chuẩn đều được phân loại rõ:
   - Mã hợp lệ và canonical.
   - Có thể chuẩn hóa an toàn.
   - Thiếu mã.
   - Sai format.
   - Trùng owner.
   - Lệch registry.
   - Mất hoặc sai tham chiếu.

2. Không có request, purchase request, global usage hoặc nested usage log bị bỏ qua chỉ vì thiếu standardId.

3. Không có nested log được xem là hợp lệ khi standardId trong log khác với standard ID của parent path.

4. Registry giữ được document ID gốc để phát hiện:
   - Document ID lowercase.
   - Document ID có khoảng trắng.
   - Hai registry documents khác raw ID nhưng cùng canonical code.
   - Trường internal_id lệch với document ID canonical.

5. Mã sửa thủ công được validate ngay trên UI trước confirmation.

6. Không thể submit một batch có hai hồ sơ cùng được nhập một target code.

7. Người vận hành biết chính xác batch sắp ghi:
   - Bao nhiêu hồ sơ physical.
   - Bao nhiêu registry record.
   - Bao nhiêu request snapshot.
   - Bao nhiêu usage snapshot.
   - Bao nhiêu mã sửa thủ công.

8. Mọi batch đã apply có thể được xem lại trong lịch sử audit.

9. Scan/apply hoạt động ổn định với dữ liệu lớn, có progress và giới hạn batch rõ ràng.

### 1.2. Mục tiêu kỹ thuật

- Giữ nguyên nguyên tắc read-only scan → user review → re-scan → atomic apply.
- Không cho phép thay đổi mã hợp lệ đang có owner chỉ bằng công cụ sync.
- Không tự đoán owner khi không xác định duy nhất.
- Không xóa physical record, request, usage log hoặc registry history.
- Duy trì tương thích với Firestore Rules hoặc cập nhật Rules đồng thời với client.
- Mọi thay đổi repair phải có before, after, lý do, người thực hiện và thời điểm.

---

## 2. Phạm vi và ngoài phạm vi

### 2.1. Trong phạm vi

- reference_standards.
- standard_code_registry.
- standard_requests.
- purchase_requests.
- standard_usages.
- reference_standards/{standardId}/logs.
- Modal review và correction.
- Firestore Rules cho repair path.
- Audit batch và màn hình lịch sử.
- Unit test, contract test, emulator test, build/lint.
- Rollout theo môi trường và dry-run.

### 2.2. Ngoài phạm vi

- Thay đổi quy tắc mã A/B/C hoặc ngoại lệ SDHET.
- Thay đổi quy tắc FEFO.
- Tự động quyết định hồ sơ nào thắng khi duplicate active owner.
- Tự động đổi mã hợp lệ của hồ sơ đang có vòng đời hiện tại.
- Xóa dữ liệu lịch sử.
- Viết migration production trước khi có dry-run và phê duyệt.

---

## 3. Source chính cần theo dõi

| Khu vực | File |
|---|---|
| Toolbar entry point | src/app/features/standards/components/standards-toolbar.component.ts |
| Parent page | src/app/features/standards/standards.component.ts và standards.component.html |
| Sync modal | src/app/features/standards/components/standards-internal-id-sync-modal.component.ts |
| Sync service | src/app/features/standards/services/standard-internal-id-sync.service.ts |
| Facade | src/app/features/standards/standard.service.ts |
| Code normalization | src/app/shared/utils/standard-internal-id.ts |
| Registry service | src/app/features/standards/services/standard-code-registry.service.ts |
| Standard CRUD | src/app/features/standards/services/standard-crud.service.ts |
| Models | src/app/core/models/standard.model.ts |
| Firestore Rules | firestore.rules |
| Existing modal test | src/app/features/standards/components/standards-internal-id-sync-modal.component.test.ts |
| UI contract test | src/app/features/standards/standards-ui-primitives.contract.test.ts |
| Standard Rules test | src/app/shared/utils/standard-rules.test.ts |
| Emulator Rules test | src/app/core/services/smart-batch-firestore-rules.emulator.test.ts |

---

## 4. Nguyên tắc triển khai bắt buộc

### 4.1. Không sửa production trước khi có dry-run

Mọi thay đổi phải đi qua:

~~~
Code change
  → unit/contract test
  → emulator test
  → staging dry-run
  → review report
  → staging apply dataset nhỏ
  → production dry-run
  → phê duyệt batch
  → production apply theo batch nhỏ
~~~

### 4.2. Không dùng technical document ID thay cho business code

- internal_id vẫn là mã nghiệp vụ duy nhất.
- Firestore document ID chỉ dùng để định danh kỹ thuật.
- UI phải hiển thị cả mã nội bộ, tên, lô và technical ID khi cần đối chiếu.

### 4.3. Không tự suy đoán khi thiếu thông tin

Nếu thiếu standardId, hệ thống phải tạo issue. Chỉ được auto-repair nếu mapping duy nhất và có đủ điều kiện bảo mật.

### 4.4. Batch phải fail closed

Nếu có một conflict blocking:

- Không ghi một phần.
- Không tự bỏ qua record lỗi nếu hành vi đó gây hiểu nhầm.
- Hiển thị rõ batch bị chặn vì lý do nào.

### 4.5. Audit là một phần của transaction

Audit batch phải được ghi trong cùng Firestore batch với các update dữ liệu. Nếu audit không ghi được thì toàn bộ apply phải fail.

---

# 5. Kế hoạch triển khai theo giai đoạn

## Phase 0 — Chuẩn bị, baseline và khóa phạm vi

### Task 0.1 — Chốt acceptance criteria với nghiệp vụ

**Mục tiêu:** tránh triển khai logic kỹ thuật khác kỳ vọng vận hành.

**Thực hiện:**

1. Xác nhận danh sách mã hợp lệ:
   - Pattern [ABC][A-Z0-9]{3}.
   - Ngoại lệ SDHET.
2. Xác nhận lifecycle nào được xem là current:
   - ACTIVE.
   - Legacy thiếu lifecycle_status có được coi là current hay không.
3. Xác nhận cách xử lý hồ sơ _isDeleted hoặc status = DELETED.
4. Xác nhận snapshot lịch sử:
   - Có được normalize chữ hoa/khoảng trắng hay không.
   - Snapshot khác mã canonical là lỗi hay historical snapshot hợp lệ.
5. Xác nhận có yêu cầu undo batch hay chỉ cần audit immutable.
6. Xác nhận quyền:
   - Ai được scan.
   - Ai được apply.
   - Ai được xem audit.
   - Ai được undo, nếu có.
7. Xác nhận quy mô dữ liệu production:
   - Số physical standards.
   - Số requests.
   - Số purchase requests.
   - Số global usage logs.
   - Số nested logs.

**Deliverable:** biên bản acceptance criteria được nghiệp vụ xác nhận.

**Điều kiện hoàn tất:** không còn câu hỏi mở về lifecycle, snapshot và undo.

---

### Task 0.2 — Chụp baseline dữ liệu read-only

**Mục tiêu:** biết chính xác dữ liệu trước khi sửa code.

**Thực hiện:** tạo script hoặc admin-only report chỉ đọc, không ghi dữ liệu, thống kê:

~~~
reference_standards:
- total
- missing internal_id
- invalid internal_id
- normalizable internal_id
- duplicate active code
- released records by code

standard_code_registry:
- total
- raw IDs not equal canonical IDs
- internal_id not equal canonical ID
- ASSIGNED without currentStandardId
- ASSIGNED owner missing
- ASSIGNED owner code mismatch
- AVAILABLE with currentStandardId
- CONFLICT records

standard_requests:
- missing standardId
- unknown standardId
- standardId contains internal code instead of technical ID
- missing internalId snapshot
- mismatched internalId snapshot
- embedded usage log mismatch

purchase_requests:
- missing/unknown standardId
- missing/mismatched internalId

standard_usages:
- missing/unknown standardId
- missing/mismatched internalId

nested logs:
- missing standardId
- standardId != parent path ID
- missing/mismatched internalId
~~~

**Deliverable:** baseline JSON/CSV/Markdown report. Không ghi dữ liệu production.

**Điều kiện hoàn tất:** report được lưu ngoài database và có người review số lượng.

---

### Task 0.3 — Thiết lập feature flag và chế độ dry-run

**Mục tiêu:** tránh cho phép apply khi chưa sẵn sàng.

**Thực hiện:**

1. Thêm các cấu hình:
   - internalIdSyncEnabled.
   - internalIdSyncApplyEnabled.
   - internalIdSyncHistoryEnabled.
2. Production ban đầu:
   - Cho phép scan.
   - Tắt apply.
   - Cho phép export report nếu cần.
3. Chỉ mở apply sau khi staging test và production dry-run pass.

**Điều kiện hoàn tất:** có thể deploy UI ở chế độ scan-only.

---

## Phase 1 — Củng cố model và report schema

### Task 1.1 — Mở rộng issue kind cho lỗi tham chiếu

**Mục tiêu:** phân biệt missing reference, unknown reference và parent mismatch.

**Đề xuất:** thêm issue kind nếu cần:

~~~
MISSING_REFERENCE
PARENT_REFERENCE_MISMATCH
REGISTRY_KEY_MISMATCH
~~~

Nếu không muốn mở rộng enum, dùng REQUEST_REFERENCE/USAGE_REFERENCE kèm subKind.

**Metadata nên bổ sung:**

~~~
rawDocumentId
canonicalDocumentId
parentStandardId
referencedStandardId
blocking
~~~

**Điều kiện hoàn tất:** report thể hiện được raw key, canonical key, parent ID và referenced ID khi liên quan.

---

### Task 1.2 — Tách rõ issues, safeChanges, conflicts và blockingIssues

**Mục tiêu:** tránh UI phải suy luận conflict từ autoFixable và severity.

**Đề xuất report bổ sung:**

~~~
scanId
blockingIssues
summary
~~~

summary nên có số lượng theo collection và issue kind để dùng trực tiếp trên UI.

**Điều kiện hoàn tất:** UI không phải tự ghép nhiều computed để ra số liệu tổng.

---

## Phase 2 — Sửa logic scan tham chiếu

### Task 2.1 — Báo lỗi khi standardId bị thiếu

**File chính:** standard-internal-id-sync.service.ts, standard.model.ts.

**Thực hiện:**

1. Đọc raw standardId.
2. Nếu rỗng và không có fallbackStandardId:
   - Tạo issue blocking.
   - Không tự sửa.
3. Message theo collection:
   - Request không có standardId.
   - Purchase request không có standardId.
   - Usage log không có standardId.
4. UI có filter Mất liên kết.

**Acceptance criteria:**

- Request thiếu standardId luôn xuất hiện trong report.
- Purchase request thiếu standardId luôn xuất hiện trong report.
- Global usage thiếu standardId luôn xuất hiện trong report.
- Report không thể báo “không có cảnh báo” nếu còn missing reference.
- Apply không ghi record missing reference.

**Test cần thêm:**

- Request thiếu standardId.
- Purchase request thiếu standardId.
- Global usage thiếu standardId.
- Nested log có parent fallback hợp lệ.

---

### Task 2.2 — Phân biệt technical ID và internal code

**Mục tiêu:** repair legacy nhưng không đoán sai.

**Thực hiện:**

1. Nếu raw reference khớp byId, coi là technical ID.
2. Nếu không khớp byId, thử canonical code.
3. Nếu canonical code khớp đúng một non-deleted standard:
   - Sinh safe change standardId: rawCode → technicalId.
4. Nếu khớp nhiều standard:
   - Sinh blocking conflict.
5. Nếu không khớp:
   - Sinh unknown reference issue.
6. Nếu raw reference rỗng:
   - Không được return im lặng.

**Acceptance criteria:**

- Legacy standardId = AA01 chỉ được repair khi có một owner duy nhất.
- Legacy standardId = AA01 có nhiều lifecycle không được repair.
- standardId rỗng luôn được báo lỗi.

---

### Task 2.3 — Kiểm tra parent-child consistency của nested logs

**Mục tiêu:** bảo đảm log nằm dưới standard nào thì metadata cũng trỏ đúng standard đó.

**Thực hiện:**

1. Truyền parentStandardId vào hàm inspect nested log.
2. Resolve data.standardId thành technical ID nếu có.
3. Resolve fallback parent ID.
4. So sánh:

~~~
resolvedReferencedStandardId === parentStandardId
~~~

5. Nếu không khớp:
   - Sinh PARENT_REFERENCE_MISMATCH.
   - Không sửa internalId.
   - Không sửa standardId tự động.
6. Nếu standardId thiếu:
   - Chỉ bổ sung theo policy đã được nghiệp vụ xác nhận.
   - Nếu chưa chắc, chỉ báo issue.

**Acceptance criteria:**

- Log dưới std-A trỏ std-B luôn xuất hiện blocking issue.
- Không có batch tự sửa mã log trong tình huống parent mismatch.
- Log thiếu standardId được xử lý theo policy rõ ràng.

---

### Task 2.4 — Kiểm tra embedded usageLogs trong request

**Thực hiện:**

1. Kiểm tra log.standardId nếu có.
2. Nếu khác request.standardId, tạo conflict.
3. Nếu log.internalId missing, có thể tạo safe change.
4. Nếu log.internalId invalid format, tạo issue thay vì bỏ qua.
5. Nếu log không có internalId nhưng request standard canonical hợp lệ, normalize về expected code.

**Acceptance criteria:**

- Embedded log invalid không bị bỏ qua.
- Embedded log sai standard không được tự sửa.
- Safe change chỉ tạo khi reference duy nhất.

---

## Phase 3 — Củng cố registry scan và repair

### Task 3.1 — Bảo toàn raw registry document ID

**Mục tiêu:** không làm mất thông tin khi normalize registry key.

**Thực hiện:** thay Map một record bằng nhóm các raw entries:

~~~
RegistryEntry:
- rawDocumentId
- canonicalCode
- registry
~~~

Mỗi registry document phải giữ:

- snapshot.id nguyên gốc.
- normalizeInternalId(snapshot.id).
- data.internal_id nguyên gốc.
- status.
- current owner.

**Acceptance criteria:**

- Registry aa01 không bị biến mất khỏi report.
- UI hiển thị rõ aa01 → AA01.
- Hai raw IDs cùng canonical code bị đánh conflict.

---

### Task 3.2 — Phát hiện registry key/internal_id mismatch

**Sinh issue khi:**

~~~
rawDocumentId !== canonicalCode
~~~

hoặc:

~~~
normalizeInternalId(registry.internal_id) !== canonicalCode
~~~

**Policy:**

- Nếu chỉ sai casing/whitespace và không có duplicate raw document:
  - Có thể tạo safe migration nếu Rules cho phép create canonical record.
  - Không delete raw record nếu chưa có migration policy.
- Nếu có hai raw documents cùng canonical code:
  - Blocking conflict.
  - Không tự chọn record thắng.

**Acceptance criteria:** registry mismatch xuất hiện trong filter Registry và không còn false-clean.

---

### Task 3.3 — Kiểm tra orphan registry đầy đủ

Phải kiểm tra:

- AVAILABLE có currentStandardId.
- CONFLICT không có physical owner.
- Status không thuộc enum.
- ASSIGNED thiếu owner.
- Owner không tồn tại.
- Owner tồn tại nhưng lifecycle không current.
- Owner có mã khác registry code.

**Acceptance criteria:** mọi registry record đều là valid, safe repair hoặc blocking conflict.

---

## Phase 4 — Củng cố manual correction flow

### Task 4.1 — Tạo helper validation dùng chung UI và service

**Mục tiêu:** UI và backend không dùng hai logic khác nhau.

**Đề xuất kết quả validation:**

~~~
value
validFormat
duplicateInInput
alreadyOwnedByOtherCurrentStandard
blockedByRegistry
valid
message
~~~

Backend vẫn phải validate lại. UI dùng helper để phản hồi sớm.

**Acceptance criteria:** mọi rule format và duplicate đều được backend kiểm lại, không tin client.

---

### Task 4.2 — Hiển thị inline error cho từng correction

**Thực hiện:**

1. Input có ID ổn định theo standard ID.
2. Thêm aria-invalid.
3. Thêm message lỗi ngay dưới input.
4. Hiển thị:
   - Hợp lệ.
   - Sai format.
   - Trùng mã trong batch.
   - Owner khác đang sử dụng.
   - Registry đang conflict.
5. Nút Apply chỉ enable khi tất cả correction hiện có hợp lệ.

**Acceptance criteria:**

- Nhập A 01 báo lỗi ngay.
- Nhập SDHET1 báo lỗi ngay.
- Nhập cùng mã ở hai dòng báo lỗi ở cả hai dòng.
- Không cần bấm Apply mới biết input sai.

---

### Task 4.3 — Chặn duplicate target code trong cùng batch

**Thực hiện:**

1. Lấy toàn bộ correction khác rỗng.
2. Normalize.
3. Group theo target code.
4. Nếu một code có nhiều standard ID:
   - Không cho apply.
   - Hiển thị danh sách hồ sơ bị trùng.
5. Backend apply kiểm tra lại sau re-scan.

**Acceptance criteria:**

- Duplicate trong input bị chặn ở client.
- Duplicate phát sinh do concurrent data bị chặn ở backend.
- Error message chỉ rõ mã và standard IDs liên quan.

---

### Task 4.4 — Hiển thị thông tin hồ sơ đầy đủ hơn

Với mỗi manual issue, hiển thị:

- Tên chuẩn.
- Mã hiện tại.
- CAS.
- Lô.
- Nhà sản xuất.
- Technical document ID.
- Link mở detail.
- Nút copy ID.

**Acceptance criteria:** người quản lý có thể đối chiếu nhãn/lô mà không phải tìm lại thủ công ở màn hình khác.

---

## Phase 5 — Củng cố apply và batch planning

### Task 5.1 — Tạo apply preview summary

**Mục tiêu:** người dùng biết chính xác những gì sắp ghi.

**Summary đề xuất:**

~~~
totalChanges
totalDocuments
manualCorrections
byCollection
byChangeType
blockingIssues
estimatedBatches
~~~

UI phải hiển thị:

- Số physical changes.
- Số registry changes.
- Số request changes.
- Số purchase request changes.
- Số global usage changes.
- Số nested log changes.
- Số manual corrections.

**Acceptance criteria:** confirmation có số liệu cụ thể, không chỉ có câu “Áp dụng đồng bộ”.

---

### Task 5.2 — Chốt policy khi filter đang active

Có hai lựa chọn:

#### Phương án A — Filter chỉ để xem

- Giữ logic hiện tại.
- Hiển thị rõ:

~~~
Bộ lọc chỉ thay đổi nội dung hiển thị.
Khi áp dụng, hệ thống sẽ ghi toàn bộ safe changes hợp lệ.
~~~

#### Phương án B — Filter quyết định phạm vi apply

- Phải tạo apply plan mới theo filter.
- Phải bảo đảm không tách physical khỏi registry.
- Phải giải quyết dependency giữa request và standard.

**Khuyến nghị:** dùng Phương án A trong phase đầu. Nếu cần apply chọn lọc, triển khai thành phase riêng với dependency planner.

---

### Task 5.3 — Thiết kế batch chunking

**Mục tiêu:** tránh batch lớn bị giới hạn bởi Firestore write hoặc Rules evaluation.

**Thực hiện:**

1. Tách changes thành logical unit:
   - Physical standard + registry liên quan.
   - Request snapshot.
   - Purchase request snapshot.
   - Global usage snapshot.
   - Nested usage snapshot.
2. Không tách physical update khỏi registry update nếu Rules yêu cầu getAfter owner.
3. Tính số write thực tế sau khi group theo document.
4. Chia thành chunk nhỏ, bắt đầu bằng giới hạn bảo thủ.
5. Mỗi chunk có audit batch con hoặc parent operation ID.
6. Nếu chunk fail:
   - Dừng các chunk tiếp theo nếu policy fail-closed.
   - Ghi trạng thái operation rõ ràng.
   - Không báo thành công toàn bộ nếu mới apply một phần.

**Acceptance criteria:**

- Batch nhỏ pass emulator.
- Batch lớn được chia ổn định.
- Không có UI báo thành công toàn bộ khi chỉ apply một phần.

---

### Task 5.4 — Xử lý correction và snapshot cascade

**Phương án an toàn:**

1. Scan đầu xác định correction manual.
2. Tạo overlay map standardId → proposedInternalId.
3. Scan reference snapshot dựa trên overlay.
4. Chỉ tạo safe change khi:
   - Technical reference xác định duy nhất.
   - Proposed code hợp lệ.
   - Không có historical snapshot conflict.
5. Apply physical, registry và snapshot trong cùng batch nếu Rules cho phép.

**Phương án tối thiểu nếu chưa triển khai overlay:**

- Sau apply correction, hiển thị số snapshot mới phát hiện.
- Tự động chuyển focus sang filter Safe.
- Hiển thị message yêu cầu apply tiếp.

---

## Phase 6 — Audit history và hậu kiểm

### Task 6.1 — Xây dựng màn hình lịch sử sync batch

**UI đề xuất:**

- Danh sách 20 batch gần nhất.
- Filter theo khoảng thời gian.
- Filter theo người thực hiện.
- Filter theo status.
- Filter theo standard ID/mã nội bộ.
- Filter theo collection.
- Batch ID.
- Generated at.
- Created at.
- Người thực hiện.
- Số record.
- Status.

Detail modal/drawer:

- Before/after.
- Reason.
- Collection/document/field.
- Link mở record.
- Copy batch ID.

**Acceptance criteria:**

- Người dùng có quyền xem lại batch sau khi đóng modal.
- Audit immutable không thể chỉnh sửa/xóa.
- Batch ID có thể copy.

---

### Task 6.2 — Chốt có hỗ trợ undo hay không

#### Nếu có undo

Phải:

1. Đọc batch gốc.
2. Kiểm tra record hiện tại vẫn bằng after của batch.
3. Nếu record đã thay đổi sau batch, không undo tự động.
4. Tạo undo batch riêng.
5. Đánh dấu batch gốc UNDONE.
6. Ghi before/after đảo chiều.
7. Không xóa audit gốc.

#### Nếu chưa hỗ trợ undo

- Không hiển thị nút undo.
- Bỏ status UNDONE khỏi contract hoặc ghi rõ reserved for future use.
- Dùng repair batch mới có phê duyệt nếu cần đảo chiều.

**Khuyến nghị:** chưa bật undo trong phase đầu nếu chưa có compare-and-set chặt chẽ.

---

## Phase 7 — UI/UX và accessibility

### Task 7.1 — Cải thiện trạng thái scan

**Thực hiện:**

- Khi mở modal: hiển thị progress state.
- Khi re-scan: thêm overlay/banner Đang cập nhật.
- Hiển thị generatedAt.
- Hiển thị số collection đã quét.
- Nếu scan lỗi, giữ report cũ nhưng đánh dấu stale.

**Acceptance criteria:** user phân biệt được report mới, report cũ và scan lỗi.

---

### Task 7.2 — Cải thiện filter semantics

Nếu dùng tab pattern:

- Thêm aria-controls.
- Quản lý tabindex.
- ArrowLeft/ArrowRight.
- Home/End.
- role=tabpanel.

Nếu đây chỉ là bộ lọc:

- Dùng role=group.
- Dùng aria-pressed cho button.

**Khuyến nghị:** dùng role=group + aria-pressed vì đây là filter, không phải các panel độc lập.

---

### Task 7.3 — Cải thiện search và screen reader

**Thực hiện:**

- aria-label cho search.
- Label rõ cho correction input.
- aria-describedby cho validation message.
- aria-live=polite cho summary/filter count.
- Accessible error announcement cho apply failure.

---

### Task 7.4 — Cải thiện layout mobile và scroll

Kiểm tra ở:

- 320×568.
- 375×667.
- 768×1024.
- 1280×800.
- 1440×900.

Kiểm tra:

- Một vùng scroll dọc chính.
- Footer/apply không bị mất trên mobile.
- Input correction không quá hẹp.
- Technical ID không làm vỡ layout.
- Long reason/detail có wrap hoặc expand/collapse.
- Không có horizontal overflow ngoài khu vực filter nếu không chủ ý.

---

## Phase 8 — Test strategy

### Task 8.1 — Unit test normalization/classification

Kiểm tra:

- AA01 valid.
- aa01 có khoảng trắng là normalizable.
- SDHET valid.
- SDHET1 invalid.
- Missing value.
- Unicode/NFKC edge case.
- Lifecycle current/released/closed/deleted.

---

### Task 8.2 — Service-level test cho scan

Tạo fixture builder:

~~~
buildStandard()
buildRegistry()
buildRequest()
buildPurchaseRequest()
buildUsage()
buildNestedLog()
~~~

Test tối thiểu:

1. Missing physical code.
2. Invalid physical code.
3. Normalizable physical code.
4. Duplicate active code.
5. Registry owner mismatch.
6. Orphan registry.
7. Registry lowercase raw ID.
8. Duplicate canonical registry raw IDs.
9. Request missing standardId.
10. Request standardId is internal code.
11. Request unknown standardId.
12. Usage missing standardId.
13. Nested log parent mismatch.
14. Embedded usage log invalid code.
15. Released record reuse.

---

### Task 8.3 — Service-level test cho apply

Test:

1. Apply safe normalization.
2. Apply manual correction.
3. Apply correction + registry assignment.
4. Reject invalid correction.
5. Reject correction to valid current owner.
6. Reject duplicate corrections trong cùng input.
7. Reject stale owner sau re-scan.
8. Apply request snapshot repair.
9. Apply nested log repair.
10. Audit batch được tạo trong cùng commit.
11. Failed commit không ghi một phần.
12. Max batch/chunk boundary.

---

### Task 8.4 — Firestore emulator test

Bổ sung:

- Physical repair + registry getAfter validation.
- Request snapshot repair.
- Global usage snapshot repair.
- Nested usage snapshot repair.
- Parent-child mismatch rejected.
- Registry canonical key mismatch.
- Audit batch immutable.
- Multiple changes trong một batch.
- Batch chunking.
- Permission denied cho user không có standard_edit.

---

### Task 8.5 — UI/component test

Test:

- Auto scan chạy đúng một lần khi mở modal.
- Đóng modal reset state.
- Search/filter count chính xác.
- Inline validation correction.
- Duplicate correction hiển thị lỗi.
- Apply disabled khi correction invalid.
- Confirmation có summary.
- Apply error hiển thị đúng.
- Re-scan sau apply.
- Audit history mở được.

---

### Task 8.6 — Visual/runtime test

Chạy app local hoặc staging với tài khoản có quyền phù hợp và kiểm tra:

- Desktop.
- Tablet.
- Mobile.
- Dark mode.
- Keyboard-only.
- Screen reader semantics cơ bản.
- Dataset ít issue.
- Dataset nhiều issue.
- Dataset có long text.
- Dataset có 100+ safe changes.

Không thao tác apply trên production trong bước visual test.

---

## Phase 9 — Dry-run, staging và rollout production

### Task 9.1 — Staging dry-run

1. Deploy code với applyEnabled = false.
2. Chạy scan staging.
3. Export report.
4. Đối chiếu số lượng với baseline.
5. Phân loại từng conflict.
6. Kiểm tra missing reference không bị bỏ sót.
7. Kiểm tra registry raw IDs.
8. Kiểm tra nested parent-child mismatch.

**Điều kiện pass:**

- Không có nhóm issue bị bỏ sót.
- Không có crash/timeout.
- Summary khớp detail.

---

### Task 9.2 — Staging apply dataset nhỏ

Chọn dữ liệu đại diện:

- 1 normalizable physical standard.
- 1 missing physical standard để manual correction.
- 1 request snapshot missing.
- 1 global usage snapshot missing.
- 1 nested log snapshot missing.
- 1 registry mismatch deterministic.
- 1 blocking conflict không được tự sửa.

Sau apply kiểm tra:

- Physical data.
- Registry.
- Request.
- Global usage.
- Nested log.
- Audit batch.
- Không có record ngoài phạm vi bị thay đổi.

---

### Task 9.3 — Production dry-run

**Bắt buộc: không bật apply.**

1. Scan toàn bộ production.
2. Lưu report có timestamp và scan ID.
3. Export summary và detail.
4. Đối chiếu số lượng với nghiệp vụ.
5. Chia conflict theo nhóm:
   - Tự động.
   - Cần nhập mã.
   - Cần xử lý lifecycle.
   - Cần xử lý registry.
   - Cần xử lý tham chiếu.
6. Ký xác nhận report trước khi apply.

---

### Task 9.4 — Production apply theo batch nhỏ

**Thứ tự khuyến nghị:**

1. Apply normalization không đổi ý nghĩa mã.
2. Apply registry repair deterministic.
3. Apply snapshot missing/normalizable.
4. Apply manual corrections đã được đối chiếu.
5. Re-scan.
6. Xử lý issue còn lại.

Sau mỗi batch:

- Ghi batch ID.
- Lưu report trước/sau.
- Kiểm tra số record thay đổi.
- Kiểm tra không phát sinh duplicate active code.
- Kiểm tra registry owner.
- Kiểm tra sample request/usage/log.

---

## Phase 10 — Rollback và xử lý sự cố

### 10.1. Apply fail trước commit

Kỳ vọng:

- Không có dữ liệu thay đổi.
- UI hiển thị lỗi.
- Người dùng có thể scan lại.
- Không tạo audit batch APPLIED.

### 10.2. Phát hiện sai sau commit

1. Xác định batch ID.
2. Mở audit before/after.
3. Kiểm tra record hiện tại có còn bằng after hay đã đổi tiếp.
4. Nếu chưa đổi:
   - Dùng undo batch nếu đã được phê duyệt.
   - Hoặc tạo repair batch đảo chiều có audit.
5. Nếu đã đổi tiếp:
   - Không tự đảo chiều.
   - Tạo conflict để manager xử lý.

### 10.3. Phát hiện duplicate active code

1. Tạm dừng cấp mã mới cho code đó.
2. Đối chiếu physical records, lifecycle, registry và request mở.
3. Chỉ sửa registry/lifecycle sau khi xác định owner đúng.
4. Re-scan.

### 10.4. Scan timeout hoặc quá nhiều reads

1. Không apply.
2. Ghi nhận collection gây bottleneck.
3. Chuyển scan theo chunk.
4. Giảm phạm vi theo collection nếu tooling hỗ trợ.
5. Không tăng giới hạn batch mù quáng.

---

# 6. Checklist nghiệm thu cuối

## 6.1. Nghiệp vụ

- [ ] Mã hợp lệ và SDHET được chấp nhận.
- [ ] Missing/invalid code không tự đoán.
- [ ] Duplicate active owner bị blocking.
- [ ] Released/closed record không là current owner.
- [ ] Request thiếu standardId bị báo.
- [ ] Usage thiếu standardId bị báo.
- [ ] Nested log parent mismatch bị báo.
- [ ] Registry lowercase/whitespace bị phát hiện.
- [ ] Registry duplicate canonical key bị blocking.
- [ ] Manual correction duplicate bị chặn.
- [ ] Snapshot historical mismatch theo đúng policy đã phê duyệt.

## 6.2. UI/UX

- [ ] Scan state rõ ràng.
- [ ] Re-scan state rõ ràng.
- [ ] Hiển thị generated time.
- [ ] Inline validation correction.
- [ ] Summary trước apply.
- [ ] Nêu rõ filter chỉ để xem hoặc có scope apply.
- [ ] Link mở record gốc.
- [ ] Copy technical ID.
- [ ] Không có nested scrollbar gây cản trở.
- [ ] Mobile không mất footer/apply.
- [ ] Dark mode đủ contrast.

## 6.3. Security và data integrity

- [ ] User không có standard_edit không scan/apply.
- [ ] Direct edit internal_id vẫn bị Rules chặn.
- [ ] Registry owner update đi cùng physical lifecycle hợp lệ.
- [ ] Snapshot update chỉ trỏ tới standard tồn tại và mã canonical hợp lệ.
- [ ] Audit batch immutable.
- [ ] Không delete physical/log/registry.
- [ ] Apply fail không ghi một phần ngoài policy.

## 6.4. Kỹ thuật

- [ ] Unit test pass.
- [ ] Service scan test pass.
- [ ] Service apply test pass.
- [ ] Firestore emulator test pass.
- [ ] UI contract test pass.
- [ ] Lint pass.
- [ ] Production build pass.
- [ ] Scan dataset lớn pass.
- [ ] Batch chunking pass.
- [ ] Production dry-run được lưu report.
- [ ] Rollback procedure được thử trên staging.

---

# 7. Definition of Done

Feature chỉ hoàn tất khi đồng thời đạt:

1. Không còn silent skip đối với record thiếu standardId.
2. Parent-child nested reference được kiểm tra.
3. Registry raw key và canonical key được bảo toàn.
4. Manual correction có validation UI và backend.
5. Batch summary rõ trước confirmation.
6. Apply có chunking hoặc đã chứng minh giới hạn an toàn trên dataset production.
7. Có audit history UI hoặc công cụ hậu kiểm được nghiệp vụ chấp nhận.
8. Có test cho toàn bộ edge cases P1.
9. Production dry-run đã được review.
10. Có rollback procedure và người chịu trách nhiệm.
11. Không có thay đổi production ngoài batch đã phê duyệt.

---

# 8. Thứ tự thực thi ngắn gọn

~~~
0. Chốt policy và baseline dữ liệu
1. Mở rộng report model
2. Sửa missing standardId detection
3. Sửa nested parent mismatch
4. Sửa registry raw/canonical detection
5. Thêm manual correction validation
6. Thêm duplicate target preflight
7. Thêm apply summary và batch planner
8. Thêm audit history
9. Bổ sung unit/service/emulator/UI tests
10. Staging dry-run
11. Staging apply dataset nhỏ
12. Production dry-run
13. Production apply theo nhóm nhỏ
14. Re-scan, đối chiếu, ký nghiệm thu
~~~

---

# 9. Quyết định chính sách chính thức (Policy Decisions)

Dưới đây là các quyết định chính thức đã được thống nhất trước khi bước vào triển khai mã nguồn:

| # | Vấn đề / Câu hỏi | Quyết định chính thức | Chi tiết kỹ thuật & Ràng buộc |
|---|---|---|---|
| **1** | Hồ sơ thiếu `lifecycle_status` | **Coi là `ACTIVE` (current), kèm cảnh báo (warning)** | Nhất quán với hành vi hiện tại tại `standard-internal-id.ts`. Báo warning trong report để người quản lý nhận biết và rà soát dữ liệu legacy. |
| **2** | Backfill `standardId` của nested log từ parent path khi field thực sự thiếu | **Cho phép auto-repair an toàn, nhưng BẮT BUỘC ghi thành `safeChange` / audit rõ ràng** | Parent path `reference_standards/{standardId}/logs/{logId}` là *Source of Truth*. Không được gán fallback ngầm lúc parse raw document làm mất dấu vết field thiếu. Nếu `standardId` trong log sai khác parent path ID, phải ghi nhận là một conflict riêng (`PARENT_REFERENCE_MISMATCH`, blocking issue), không tự sửa. |
| **3** | Snapshot usage/request khác mã hiện tại | **Chỉ chuẩn hóa format/casing/trimming; giữ nguyên snapshot lịch sử** | Nếu mã khác hoàn toàn do nghiệp vụ đổi mã qua các thời kỳ, đây là historical snapshot hợp lệ: chỉ tạo warning, **không auto-overwrite**, trừ khi có manual confirmation rõ ràng. |
| **4** | Registry document ID lowercase / malformed | **Migrate sang document ID canonical (chữ hoa, trim)** | Tạo document mới với Canonical Key chuẩn trên registry và gắn owner tương ứng. |
| **5** | Xử lý raw registry document cũ | **KHÔNG XÓA (No Delete), giữ lại dưới dạng tombstone/migrated/alias có audit** | Tuyệt đối tuân thủ invariant `Không delete ... registry`. Đánh dấu trạng thái migrated/alias để tránh trùng lặp query nhưng vẫn bảo toàn lịch sử truy vết. |
| **6** | Phạm vi Apply theo Filter | **Filter mặc định chỉ để xem (view-only); Apply theo scope phải có xác nhận rõ ràng** | Giao diện hiển thị rõ tổng số lượng bản ghi của từng loại (physical, registry, request, usage, manual correction) trong modal xác nhận trước khi thực thi apply. |
| **7** | Chính sách Undo | **Ưu tiên Full Audit Trail bất biến (Before/After snapshot); chưa làm 1-click Undo trên UI** | Mỗi batch apply bắt buộc lưu snapshot đầy đủ để phục vụ việc tạo repair script đảo chiều có kiểm soát khi có sự cố, tránh rủi ro từ auto-undo trên UI. |
| **8** | Phân quyền truy cập | **Yêu cầu quyền `standard_edit` hoặc `admin`** | Áp dụng đồng bộ trên UI permission check và Firestore Security Rules cho các thao tác scan, apply và tra cứu audit history. |
| **9** | Xuất báo cáo (Export Report) | **Hỗ trợ Export file JSON / CSV** | Cho phép kiểm nghiệm viên / Quản lý phòng thí nghiệm tải báo cáo chi tiết về máy để đối chiếu, lưu trữ và ký duyệt trước khi bấm Apply. |
| **10** | Kích thước Chunking & Nested Logs Volume | **Mặc định an toàn ban đầu là 250 operations/batch; tinh chỉnh theo dry-run thực tế** | 250 ops/batch bảo đảm an toàn dưới giới hạn 500 writes của Firestore Batch. Kích thước chunk cuối cùng sẽ được chốt sau khi đo lường số lượng nested usage logs và write amplification thực tế qua dry-run trên production. |


