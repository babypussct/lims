# Firestore Standard Request Security - Implementation Plan

## Mục tiêu

Khóa các invariant bảo mật ngay tại Firestore boundary cho luồng Yêu Cầu Chất Chuẩn, thay vì chỉ dựa vào Angular UI/service.

Sau khi hoàn tất, requester dùng Firestore SDK trực tiếp, bỏ qua toàn bộ Angular service, vẫn không thể tạo request sai schema, giả metadata, sửa aggregate tiêu hao, giả usage history, hoặc thay đổi tồn kho nếu thiếu accounting và journal tương ứng trong cùng atomic operation.

## Baseline hiện tại

- `firestore.rules` đang cho holder giảm trực tiếp `current_amount`.
- `validRequesterStandardRequestUpdate()` đang cho requester sửa `usageLogs` và `totalAmountUsed`.
- requester create chưa enforce schema chặt và vẫn chấp nhận `finalSopTags`.
- `standard-usage.service.ts` đã có transaction đồng thời ghi log, giảm kho và cập nhật request.
- `standard-request.service.ts::returnStandard()` đang dùng `usageLogs` làm input security-sensitive.

Worktree hiện có thay đổi chưa commit trong `firestore.rules` và ba file rule tests. Khi triển khai phải giữ nguyên các thay đổi này, không reset hoặc ghi đè ngoài phạm vi task.

## Trạng thái triển khai — 2026-08-08

Các hạng mục hardening phía code/rules đã được triển khai theo protocol V2:

- requester stock deduction chỉ đi qua secure atomic protocol: stock + `totalAmountUsed` + `lastUsageLogId` + journal subcollection + journal global;
- journal requester bắt buộc khớp `requestId`, `standardId`, `userId`, `normalized_amount` và correlation ID;
- requester lifecycle dùng `reportedAmountUsed`, `reportedUnit`, `reportedDepleted`; không còn quyền sửa `usageLogs` hoặc `totalAmountUsed` trong return/resume flow;
- `returnStandard()` dùng `totalAmountUsed` làm trusted aggregate và không dùng `usageLogs` để quyết định stock reconciliation;
- requester create có required/allowed key lists, bind identity/tên chuẩn/lô với dữ liệu tin cậy và loại admin-only fields;
- UI request list có fallback an toàn cho metadata legacy còn thiếu;
- static rules tests đã chuyển sang structural security guards thay cho permissive direct-stock guard;
- emulator regression suite có happy path atomic và negative matrix cho direct stock/accounting writes, journal mismatch/missing companion writes, forged identity/ownership/status, immutable history, strict create schema và admin-only fields.

Trong quá trình chạy emulator, secure happy path ban đầu vượt giới hạn 1000 biểu thức của Firestore Rules do cùng full protocol helper và permission graph bị đánh giá lặp trên cả bốn write. Rules đã được tách để standard mutation là full protocol gate, còn journal/request companion writes chỉ chứng minh phần correlation cần thiết. Happy path hiện chạy thành công trong emulator.

Phase 5 đã có công cụ audit **read-only** tại `scripts/audit-standard-request-security.ts`. Công cụ này không reconcile hay ghi Firestore; nó chỉ lập report cho request active và đối chiếu aggregate/journal/holder/current request/current stock cùng metadata schema còn thiếu. Audit hiện còn kiểm tra correlation của journal V2: `standardId`, `userId`, bản sao journal trong `reference_standards/{standardId}/logs`, `lastUsageLogId`, và tách riêng `aggregateMatchesJournal` (khớp số học) khỏi `journalsStructurallyTrusted` (độ tin cậy cấu trúc) để không đánh đồng dữ liệu legacy thiếu metadata với sai aggregate.

Verification checkpoint 2026-08-08: `npm run test:smart-batch` xanh toàn bộ với `33/33` unit/static tests và `17/17` Firestore emulator tests. Bốn test mới khóa logic audit cho journal pair hợp lệ, metadata ownership bị giả, counterpart thiếu/mismatch, stock/schema/`lastUsageLogId` bất thường. Targeted TypeScript compile cho audit script/utils/tests cũng xanh. Trên Windows, `firebase emulators:exec` có thể exit `0` nhưng vẫn để lại Java Firestore emulator giữ cổng `8080`; `scripts/run-firestore-rules-tests.js` hiện bọc command này để chỉ dọn process có command line khớp đúng project test `demo-lims-smart-batch-rules`, cleanup stale emulator trước run và cleanup lại sau run. Sau full suite, cổng `8080` đã được xác nhận free.

Production audit chưa được chạy trong checkpoint này vì runtime local không có `FIREBASE_SERVICE_ACCOUNT`, `GOOGLE_APPLICATION_CREDENTIALS` hoặc well-known Application Default Credentials. Đây là blocker credential cho bước đọc production, không phải blocker code. Không tạo credential tạm, không dùng Firebase CLI session thay thế và không ghi/reconcile production ngoài quy trình Admin đã nêu ở Phase 5.

Ví dụ chạy audit production sau khi đã cấu hình Firebase Admin credential:

```bash
npm run audit:standard-request-security -- --app-id=lims-cloud-fixed --output=standard-request-security-audit.json
```

Production closeout vẫn cần Admin đọc report, xác minh các mismatch và reconcile thủ công trước khi cân nhắc full persisted-schema validation cho historical updates. Không được suy diễn phía nào là số thực chỉ từ dữ liệu legacy bị lệch.

## Source of truth mới

| Dữ liệu | Owner | Vai trò |
| --- | --- | --- |
| `reference_standards.current_amount` | System qua secure mutation | Tồn kho thực |
| Usage journal/event | Immutable ledger | Audit tiêu hao |
| `standard_requests.totalAmountUsed` | System aggregate | Tổng lượng đã accounting |
| `standard_requests.usageLogs` | Legacy/denormalized | UI/audit compatibility, không dùng làm trust source |
| `reportedAmountUsed` | Requester | Lượng người dùng khai báo khi trả |
| `reportedUnit` | Requester | Đơn vị khai báo |
| `reportedDepleted` | Requester | Khai báo đã dùng hết |
| `confirmedAmountUsed`, `confirmedUnit` | Admin/system | Giá trị xác nhận cuối |
| `finalSopTags`, `approval*`, `receivedBy*`, `tagMerge*` | Admin/system | Lifecycle metadata |

Nguyên tắc cốt lõi: loại `usageLogs` khỏi trust boundary. Không vá `returnStandard()` bằng cách validate `usageLogs` kỹ hơn.

## Sáu security invariant bắt buộc

1. Không stock mutation nếu thiếu journal event tương ứng.
2. Không journal event nếu thiếu stock/request mutation tương ứng.
3. Requester không tự sửa `totalAmountUsed` ngoài secure usage transaction.
4. Requester không sửa/xóa historical usage logs.
5. Requester không tạo hoặc cập nhật admin-only fields.
6. Request malformed hoặc metadata spoofed không thể lọt vào `standard_requests`.

## Secure usage transaction

Loại bỏ nhánh `updateHeldStandard` hiện tại trong `canRequesterUpdateReferenceStandard()` và thay bằng helper `validRequesterUsageTransaction(appId, stdId)`.

Requester chỉ được giảm stock khi toàn bộ điều kiện sau đúng:

- standard đang được chính `request.auth.uid` giữ;
- `current_request_id` tồn tại và trỏ tới request của cùng UID/cùng standard;
- request đang ở `IN_PROGRESS`;
- `stockDelta = old.current_amount - new.current_amount` và `stockDelta > 0`;
- không có đường requester tự tăng stock;
- status chỉ giữ `IN_USE`, hoặc chuyển `DEPLETED` khi amount về `0`;
- `getAfter()` chứng minh request trong cùng atomic write tăng `totalAmountUsed` đúng bằng `stockDelta`;
- `getAfter()` chứng minh journal event tương ứng được tạo trong cùng atomic write.

### Correlation ID cho journal

`logUsageForRequest()` đã tạo `newLogRef.id` trước transaction. Dùng ID này làm correlation key và bổ sung:

- `standard_requests.lastUsageLogId` hoặc `lastUsageEventId`;
- `UsageLog.userId`.

Rules phải dùng `getAfter()` để chứng minh cả journal subcollection và journal global được tạo trong cùng atomic write, với `requestId`, `standardId`, `userId` và `normalized_amount` khớp đúng stock delta.

Kết quả mong muốn: mọi giao dịch giảm stock nhưng thiếu log hoặc accounting đều bị từ chối ở database boundary.

## Request lifecycle rules

Tách `validRequesterStandardRequestUpdate()` thành các helper nghiệp vụ riêng, thay vì một `changed.hasOnly(...)` rộng.

`IN_PROGRESS -> PENDING_RETURN` chỉ được đổi `status`, `reportedAmountUsed`, `reportedUnit`, `reportedDepleted`, `sopTags` và timestamp liên quan submission.

`PENDING_RETURN -> IN_PROGRESS` và flow resume depletion chỉ được reset/chuyển các field report tương ứng. Không có nhánh same-status cho phép requester sửa `usageLogs` hoặc `totalAmountUsed`.

Aggregate chỉ được thay đổi bởi secure usage transaction, Admin reconciliation hoặc rollback có quyền rõ ràng.

## Sửa `returnStandard()`

File chính: `src/app/features/standards/services/standard-request.service.ts`.

- Không dùng `request.usageLogs` để tính lượng đã accounting.
- Dùng `reqData.totalAmountUsed` làm `previouslyAccounted`.
- `confirmedTotal` ưu tiên input Admin, sau đó `reportedAmountUsed`, cuối cùng fallback aggregate tin cậy.
- Refactor `reconcileStandardReturn` nhận `previouslyAccounted: number` thay vì mảng log amounts.
- `usageLogs` chỉ còn vai trò UI/audit legacy, không tham gia phép tính thay đổi stock.

## Requester create schema

Tách requester create khỏi operator/admin create trong `validStandardRequestCreate()` và bắt buộc dùng cả `keys().hasAll(...)` lẫn `keys().hasOnly(...)`.

Required tối thiểu theo payload thực tế cần gồm `id` nếu persist trong body, `standardId`, `standardName`, `requestedBy`, `requestedByName`, `requestDate`, `purpose`, `status`, `totalAmountUsed` và các timestamp/metadata mà service luôn tạo.

Validation bắt buộc:

- ID/name/purpose đúng kiểu và không rỗng;
- `requestedBy == request.auth.uid`;
- `status == PENDING_APPROVAL`;
- `totalAmountUsed == 0`;
- `usageLogs`, nếu tạo cùng document, phải là `[]`;
- `_isDeleted` phải `false` hoặc không tồn tại;
- không chấp nhận field lạ.

Rules phải đọc standard tham chiếu để bind `standardName` và `lotNumber` nếu có. `requestedByName` phải match profile hiện tại qua helper tương tự `isCurrentActorName()`.

## Admin-only fields

Requester create/update allowlist không được chứa `finalSopTags`, `tagMergeStatus`, `tagMergeWarning`, `approvedBy*`, `approvalDate`, `rejectionReason`, `returnDate`, `receivedBy*`, `confirmedAmountUsed`, `confirmedUnit`, rollback/backfill provenance hoặc các system lifecycle fields khác.

Không phụ thuộc vào validator riêng của từng field. Requester đơn giản không được phép gửi các key này.

## TypeScript và service contract

File model chính: `src/app/core/models/standard.model.ts`.

- thêm `reportedAmountUsed`, `reportedUnit`, `reportedDepleted`;
- thêm `lastUsageLogId` hoặc `lastUsageEventId` nếu dùng correlation field;
- thêm `userId` vào `UsageLog` nếu chưa có;
- nếu phù hợp, tách requester-owned input type khỏi persisted system model.

`standard-usage.service.ts` phải tiếp tục dùng transaction làm entry point hợp lệ, đồng thời ghi correlation ID, `userId`, request aggregate, journal global/subcollection và stock mutation trong cùng atomic operation.

`standard-request.service.ts` phải dùng `reported*` cho requester submission và giữ final/confirmed fields cho Admin/system.

## Compatibility cho dữ liệu cũ

Create mới phải strict ngay. Update document cũ trong giai đoạn đầu chỉ khóa mutation invariant, chưa bắt buộc mọi historical document phải có ngay đầy đủ schema mới.

Sau audit/backfill mới cân nhắc áp full persisted schema validation cho update.

UI cần defensive fallback cho document lịch sử thiếu `standardName`, `requestedByName`, `purpose`, đặc biệt các chỗ gọi trực tiếp `.toLowerCase()` trong `standard-requests.component.ts`.

## Emulator security regression suite

Happy path bắt buộc phải chạy một secure usage transaction hoàn chỉnh: đúng owner/request/standard, stock giảm, aggregate tăng đúng delta, journal global và subcollection được tạo, correlation ID khớp và transaction succeed.

Negative matrix cho stock/journal phải fail khi requester:

- giảm stock trực tiếp;
- tăng aggregate mà không giảm stock;
- sửa `usageLogs` khi status giữ nguyên;
- append fake log rồi submit `PENDING_RETURN`;
- tạo journal thiếu companion stock/request mutation;
- giảm stock + tăng aggregate nhưng thiếu journal;
- journal amount không khớp stock delta;
- sửa/xóa historical log;
- dùng request của người khác;
- dùng standard không phải current holder/current request;
- dùng request không ở `IN_PROGRESS`.

Negative matrix cho requester create phải fail từng case:

- thiếu `standardName`;
- thiếu `requestedByName`;
- thiếu hoặc để rỗng `purpose`;
- spoof `requestedBy`;
- spoof `requestedByName`;
- spoof `standardName`;
- thêm `finalSopTags`;
- thêm `confirmedAmountUsed`;
- thêm `receivedBy` hoặc field `receivedBy*`;
- `_isDeleted: true`;
- thêm field lạ.

Phải có positive create đầy đủ. Sau create, requester thêm `finalSopTags` bằng update phải fail, còn Admin return ghi final tags phải succeed.

## Static rules tests

Trong `src/app/shared/utils/standard-rules.test.ts`, bỏ guard kiểm tra permissive syntax kiểu `current_amount <= resource.data.current_amount`.

Thay bằng structural guards cho các security property:

- có secure usage transaction helper;
- requester create có explicit allowlist;
- `finalSopTags` không nằm trong requester allowlist;
- requester lifecycle không chứa `usageLogs`/`totalAmountUsed` ngoài secure usage path;
- direct requester stock mutation branch đã bị loại bỏ.

Static tests chỉ chống accidental refactor; emulator tests mới là nguồn chứng minh hành vi bảo mật.

## Audit và backfill legacy data

Trước khi coi production data là safe, lập report cho mọi request active: `IN_PROGRESS`, `PENDING_RETURN`, `PENDING_DEPLETION`.

Report tối thiểu phải so sánh:

- `request.totalAmountUsed`;
- tổng journal theo `requestId`;
- holder hiện tại của standard;
- `current_request_id`;
- `reference_standard.current_amount`;
- các field schema còn thiếu như `standardName`, `requestedByName`, `purpose`.

Không tự động sửa tồn kho khi phát hiện lệch. Nếu dữ liệu từng bị direct-write thì không thể biết chắc phía nào là số thực; chỉ xuất report để Admin xác nhận/reconcile.

## Rollout nhiều bước

### Phase 0 — Baseline và regression tests

- bảo toàn thay đổi chưa commit hiện có;
- đảo các test đang phản ánh contract permissive;
- thêm failing regression cases cho các invariant mục tiêu.

### Phase 1 — Thêm protocol V2

- thêm secure usage helper/rule branch;
- thêm model fields mới;
- chưa loại bỏ flow cũ nếu cần compatibility với PWA/client đang cache.

### Phase 2 — Deploy client/service V2

- `logUsageForRequest()` gửi journal correlation + `userId`;
- return submission dùng `reported*`;
- `returnStandard()` bỏ `usageLogs` khỏi trust boundary;
- UI xử lý `permission-denied` bằng thông báo refresh/update phù hợp.

### Phase 3 — Xác minh V2

- emulator happy path xanh;
- toàn bộ security negative matrix xanh;
- xác nhận client mới không còn dùng mutation cũ;
- kiểm tra telemetry/log thực tế nếu hệ thống có sẵn.

### Phase 4 — Đóng legacy flow

- xóa nhánh requester direct stock mutation cũ;
- requester aggregate/log mutation cũ phải fail;
- PWA/client cũ sau thời điểm này fail an toàn với `permission-denied`.

Chỉ sau Phase 4 mới coi P1 đã được đóng ở database boundary.

### Phase 5 — Audit/backfill và schema tightening

- chạy report legacy;
- Admin reconcile dữ liệu lệch;
- backfill metadata thiếu;
- cân nhắc bật full schema validation cho update khi dữ liệu đã sạch.

## File map dự kiến

| File | Thay đổi chính |
| --- | --- |
| `firestore.rules` | Secure usage transaction, requester create schema, lifecycle allowlists, immutable journals |
| `src/app/core/models/standard.model.ts` | `reported*`, correlation ID, `UsageLog.userId`, ownership contract |
| `src/app/features/standards/services/standard-usage.service.ts` | Atomic usage V2 + journal payload |
| `src/app/features/standards/services/standard-request.service.ts` | Return/report split, trusted reconciliation |
| `src/app/features/standards/requests/standard-requests.component.ts` | Legacy null-safe fallback và refresh/update UX |
| `src/app/core/services/smart-batch-firestore-rules.emulator.test.ts` | Emulator regression cases |
| `src/app/core/services/smart-batch-security-rules.test.ts` | Security contract cases |
| `src/app/shared/utils/standard-rules.test.ts` | Static structural guards |
| `scripts/run-firestore-rules-tests.js` | Windows-safe emulator lifecycle cleanup cho `test:firestore-rules` |
| `scripts/audit-standard-request-security.ts` | Read-only Phase 5 audit cho active requests, aggregate, stock, holder/current request và journal correlation |
| `scripts/standard-request-security-audit.utils.ts` | Pure audit checks để tách numeric consistency khỏi structural journal trust |
| `scripts/standard-request-security-audit.test.ts` | Unit regression cho logic audit, chạy trong `test:smart-batch` |

## Implementation order đề xuất

1. Viết/đảo emulator tests để các exploit P1 fail theo contract mới.
2. Chốt model fields: `reported*`, correlation ID, `UsageLog.userId`.
3. Implement secure usage transaction rules helper.
4. Update `standard-usage.service.ts` để thỏa protocol mới.
5. Tách requester lifecycle mutation helpers trong rules.
6. Update return submission và `returnStandard()`.
7. Khóa requester create schema, metadata binding và admin-only fields.
8. Thêm UI legacy fallback.
9. Hoàn thiện negative matrix và static guards.
10. Chạy audit report trên dữ liệu legacy trước production closeout.
11. Deploy theo phases và cuối cùng loại bỏ legacy permissive branch.

## Verification gate

Trước khi merge/deploy, bắt buộc chạy và đạt:

```bash
npm run test:firestore-rules
npm run test:standards
npm run test:smart-batch
npm test
```

Đồng thời chạy build/typecheck phù hợp với repo và:

```bash
git diff --check
```

Quan trọng hơn số lượng test: emulator phải chứng minh đủ 6 security invariant ở đầu tài liệu.

## Definition of done

Hệ thống chỉ được coi là an toàn khi requester dùng Firestore SDK trực tiếp, bỏ qua Angular service, vẫn không thể tạo document sai schema, giả metadata, ghi admin-only fields, giả usage history hoặc tự sửa `totalAmountUsed`.

Mọi thay đổi `current_amount` của requester phải có usage journal và request accounting tương ứng trong cùng atomic operation. `returnStandard()` không được phụ thuộc `usageLogs` requester-controlled để quyết định tồn kho.

## Không làm trong đợt hardening này

- Không tự động reconcile dữ liệu production bị lệch khi chưa có Admin xác nhận.
- Không reset hoặc ghi đè thay đổi chưa commit đang có trong worktree.
- Không coi sửa UI/service là security boundary.
- Không giữ backward compatibility vô thời hạn cho client cũ sau khi Phase 4 đóng legacy rules.
