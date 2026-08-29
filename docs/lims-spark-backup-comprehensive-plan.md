# Kế hoạch backup toàn diện LIMS trên Firebase Spark

**Trạng thái:** Đã triển khai production; backup toàn diện đang tiếp tục theo checkpoint, chỉ chứng nhận hoàn tất sau khi manifest và integrity verify đạt

**Ngày rà soát:** 2026-08-29

**Phạm vi:** LIMS Cloud hiện tại, Firebase project `lims-cloud-by-otada`, namespace nghiệp vụ production `artifacts/lims-cloud-fixed`, Firebase Authentication, Google Drive và Google Apps Script.

**Mục tiêu chi phí:** Giữ Firebase ở gói Spark, không sử dụng Firestore managed export/import, Cloud Storage, Cloud Functions hoặc dịch vụ Firebase yêu cầu bật billing.

**Phương án được chọn:**

> Firebase Spark + backend tùy chỉnh trên Vercel + backup Firestore/Auth/Drive mã hóa lên Google Drive + checksum + dry-run + restore có checkpoint/resume + theo dõi quota.

### Trạng thái triển khai thực tế

Đã có trong mã nguồn hiện tại:

- Catalog explicit cho 32 collection Firestore, `releases` và 4 nhóm subcollection; có collection-group scan để bắt document con mồ côi và fail-closed khi có collection chưa được review.
- Serializer giữ kiểu `Timestamp`, `GeoPoint`, `DocumentReference`, `Bytes`, `Date`, `bigint`, array/map; payload được gzip rồi mã hóa AES-256-GCM và có SHA-256 plaintext/ciphertext.
- Backup Firebase Auth theo trang, đối chiếu UID với hồ sơ `users`, scrub token/FCM/session; restore Auth có policy hash và giới hạn an toàn.
- Quét Drive theo folder nguồn, mọi liên kết Drive trong Firestore, CoA folder và catalog template; export Docs/Sheets, download PDF/Excel, copy native Workspace và kiểm tra ACL toàn bộ cây backup.
- Snapshot mã nguồn `gas/*.gs`, `gas/appsscript.json`, `.clasp.json`, đồng thời gọi Apps Script API read-only để lưu project content và danh sách deployment live khi có `scriptId`.
- Verify đọc lại toàn bộ part/asset, checksum, count, ACL trước khi đánh dấu backup hoàn tất; restore có dry-run, recover missing, selected, full replace có preflight, checkpoint Drive mã hóa và resume idempotent cho `RECOVER_MISSING`.
- Giao diện Manager có status, coverage, danh sách backup, verify, dry-run, recover và tiếp tục restore dở dang; mọi thao tác có permission riêng và audit log.

Chưa được phép tuyên bố `BACKUP_COMPLETE` chỉ bằng kiểm thử mã nguồn. Cần chạy backup production với credential thật, kiểm tra manifest, rồi diễn tập restore ở môi trường kiểm thử; các bước này không thể giả lập trung thực trong repository.

### Nhật ký thực thi production ngày 2026-08-29

- Backup ID đang được tiếp tục: `bkp_20260828092036_01711f019e`.
- Checkpoint đã xác nhận trước khi tiếp tục: Firestore `12.889` document trong `124` encrypted part; Firebase Auth `165` user; Drive plan `2.737` asset.
- Sau khi cấp lại quyền Google Drive bằng Chrome, checkpoint Drive đã chạy tiếp từ `406` lên `1.156/2.737` asset; log production gần nhất vẫn ở pha `DRIVE_ASSETS`, chưa phát hiện lỗi mới.
- Đã thử tăng đồng thời lên 10 để rút ngắn thời gian nhưng quan sát thấy Google Drive throttling làm lô kéo dài hơn; cấu hình đã được gỡ và hệ thống trở về mức mặc định 5 ổn định. Checkpoint dữ liệu không bị ảnh hưởng.
- Production canonical đang chạy tại `https://nafiqpm6.vercel.app`; deployment tối ưu resumable đã ở trạng thái Ready.
- Backup Drive được xử lý theo các lượt tối đa 25 asset, với concurrency giới hạn 5 bên trong mỗi lượt; mỗi lượt ghi checkpoint sau khi hoàn tất và có Firestore lock chống request trùng.
- `npm run typecheck:api`, `npm run test:backup` (11/11 test), `npm run build` và `git diff --check` đã đạt tại local.
- Chưa ghi `COMPLETED` vào tài liệu cho đến khi Drive asset count đạt plan, manifest được mã hóa upload, verify đọc/checksum toàn bộ part và asset đạt `PASSED`, sau đó mới chạy dry-run đối chiếu restore.

---

## 1. Tóm tắt điều hành

### 1.1 Kết luận hiện tại

Hệ thống hiện **chưa đủ điều kiện để khẳng định đã backup toàn diện**.

Lý do chính:

- Chức năng `Backup & Restore` hiện tại chỉ xuất `sops` và `inventory`.
- Có 32 nhóm collection cấp cao nhất trong namespace nghiệp vụ, cộng với collection gốc `releases`.
- Có ít nhất 4 loại subcollection lịch sử/nghiệp vụ chưa được chức năng backup cũ xử lý.
- Firestore chỉ lưu URL/file ID của CoA, PDF, Google Docs và Excel; nội dung file nằm trên Google Drive.
- Firebase Authentication nằm ngoài collection Firestore `users`.
- Backup JSON hiện tại không mã hóa, không có checksum, không có manifest coverage và không có kiểm tra restore độc lập.
- Restore cũ có lỗi thiết kế khi tổng số bản ghi vượt quá giới hạn một batch.
- Chưa có luồng Drive-to-Drive backup riêng cho các file nghiệp vụ, template và trạng thái triển khai Apps Script.

### 1.2 Điều chỉnh theo thực tế hiện tại

Các nhóm file sau **đã tồn tại trên Google Drive hiện tại** và không cần tạo lại:

- Tệp CoA/chứng chỉ chất chuẩn.
- PDF báo cáo.
- Google Docs báo cáo.
- Excel gốc được upload cho mẻ chạy.
- Google Docs mẫu tạo báo cáo.
- Cây thư mục báo cáo và lưu trữ.
- Project Apps Script và/hoặc các cấu hình liên quan đã được lưu trên Drive/Apps Script.

Tuy nhiên, “đã có trên Drive chính” chưa đồng nghĩa với “đã có bản backup độc lập đã kiểm tra”. Phạm vi cần xây là:

1. Kiểm kê các file thực tế.
2. Đối chiếu file với các URL/file ID đang lưu trong Firestore.
3. Copy hoặc export sang vùng backup private.
4. Ghi checksum và mapping ID.
5. Kiểm tra khả năng đọc lại.
6. Kiểm thử restore và cập nhật lại liên kết nếu file ID thay đổi.

### 1.3 Quyết định triển khai

| Hạng mục | Quyết định |
|---|---|
| Giữ Firebase Spark | Có |
| Dùng Firestore managed export/import | Không; tính năng này yêu cầu billing/Blaze |
| Backup Firestore tùy chỉnh | Có |
| Backup Firebase Authentication | Có |
| Backup file Drive | Có |
| Backup Google Docs template | Có |
| Backup source Apps Script | Có nội dung source/config trong encrypted deployment part; source chính vẫn quản lý trong Git |
| Backup deployment/config Apps Script | Có bằng local bundle + live project content + live deployment manifest; redeploy vẫn là thao tác có kiểm soát |
| Backup access token/session | Không |
| Backup FCM token để restore | Không; thiết bị đăng ký lại |
| Backup vào cùng tài khoản Drive | Có thể dùng làm lớp đầu tiên |
| Bản sao độc lập ngoài tài khoản Drive chính | Khuyến nghị bắt buộc cho mức DR cao |

---

## 2. Bằng chứng từ hệ thống hiện tại

### 2.1 Chức năng backup cũ

Chức năng hiện tại nằm tại:

- `src/app/core/services/firebase.service.ts`
- `src/app/features/config/components/config-general.component.ts`

Luồng hiện tại:

1. Đọc toàn bộ document trực tiếp trong `sops`.
2. Đọc toàn bộ document trực tiếp trong `inventory`.
3. Tạo JSON bằng `JSON.stringify()`.
4. Tải JSON về máy người dùng.
5. Restore lại hai nhóm trên bằng `writeBatch`.

Chức năng này không đọc:

- `inventory/{itemId}/history`.
- `sops/{sopId}/history`.
- Bất kỳ collection nào khác.
- Firebase Authentication.
- Google Drive.

### 2.2 Lỗi bảo toàn kiểu dữ liệu

Nhiều document Firestore có các trường Timestamp như:

- `createdAt`.
- `updatedAt`.
- `lastUpdated`.
- `approvedAt`.
- `publishedAt`.
- `archivedAt`.
- `lockedAt`.

JSON thuần không bảo toàn đầy đủ kiểu Firestore. Sau khi `JSON.parse()`, Timestamp có thể trở thành object thường. Restore phải sử dụng serializer có tag kiểu, ví dụ:

```json
{
  "__limsType": "timestamp",
  "seconds": 1720000000,
  "nanoseconds": 123000000
}
```

Serializer cũng phải hỗ trợ `DocumentReference`, `GeoPoint`, `Bytes`, array và map lồng nhau.

### 2.3 Lỗi restore batch cũ

Restore cũ dùng một `writeBatch` rồi commit khi đủ 450 thao tác nhưng không tạo batch mới trong hàm import. Khi số document lớn, restore có thể dừng giữa chừng sau khi đã ghi một phần dữ liệu.

Mọi restore mới phải tạo batch mới sau mỗi commit, lưu checkpoint và có thể chạy lại an toàn.

### 2.4 Ước tính dung lượng hiện tại chưa đủ phạm vi

Màn hình ước tính Firestore hiện chỉ kiểm tra một phần collection, không thể dùng kết quả này để chứng minh coverage backup. Công cụ ước tính phải được thay bằng hoặc bổ sung một inventory job dùng cùng catalog với backup thực tế.

---

## 3. Phạm vi dữ liệu phải bảo vệ

## 3.1 Firestore: 32 collection cấp cao nhất

Namespace chuẩn production:

```text
artifacts/lims-cloud-fixed/{collection}
```

### Nhóm tài khoản và cấu hình

| Collection | Vai trò | Backup | Restore |
|---|---|---:|---:|
| `users` | Hồ sơ LIMS, role, permission, trạng thái người dùng | Có | Có; không restore token |
| `user_preferences` | Tùy chọn người dùng và activity cursor | Có | Có chọn lọc |
| `roles_config` | Cấu hình role/quyền | Có | Có |
| `system` | Cờ và trạng thái hệ thống | Có | Có |
| `config` | Cấu hình nghiệp vụ | Có | Có |
| `sample_description_master` | Danh mục mô tả mẫu | Có | Có |
| `system_updates` | Thông báo/cập nhật hệ thống | Có | Có |

### Nhóm nghiệp vụ

| Collection | Vai trò | Backup | Restore |
|---|---|---:|---:|
| `inventory` | Tồn kho hiện tại | Có | Có |
| `reference_standards` | Hồ sơ chất chuẩn | Có | Có |
| `standard_cleanup_batches` | Phiên chuẩn hóa danh pháp | Có | Có; giữ audit |
| `standard_code_registry` | Ngân hàng mã nội bộ | Có | Có |
| `standard_code_sync_batches` | Nhật ký đồng bộ mã | Có | Có |
| `standard_requests` | Yêu cầu chất chuẩn | Có | Có |
| `standard_tags` | Nhãn phương pháp/chất chuẩn | Có | Có |
| `purchase_requests` | Yêu cầu mua hàng | Có | Có |
| `standard_usages` | Nhật ký sử dụng chất chuẩn toàn cục | Có | Có |
| `sops` | Quy trình SOP | Có | Có |
| `recipes` | Công thức | Có | Có |
| `requests` | Mẻ/yêu cầu kiểm nghiệm | Có | Có |
| `daily_checklists` | Bảng kiểm theo ngày | Có | Có; reconciliation |
| `results_details` | Chi tiết kết quả | Có | Có |
| `print_jobs` | Snapshot yêu cầu in | Có | Có |
| `target_groups` | Nhóm chỉ tiêu | Có | Có |
| `master_targets` | Danh mục target | Có | Có |
| `master_analytes` | Danh mục analyte | Có | Có |
| `matrix_types` | Loại nền mẫu | Có | Có |
| `master_devices` | Danh mục thiết bị | Có | Có |

### Nhóm nhật ký, thống kê và trạng thái tạm

| Collection | Vai trò | Backup | Restore |
|---|---|---:|---:|
| `stats` | Thống kê tổng hợp | Có | Có; phải đối chiếu/tái tính |
| `monthly_stats` | Thống kê theo tháng | Có | Có; phải đối chiếu/tái tính |
| `notifications` | Hộp thư/thông báo | Có chọn lọc | Tùy chính sách |
| `auth_sessions` | Phiên QR/login tạm | Không cần nội dung | Không bao giờ |
| `logs` | Audit trail/activity log | Có | Có; ưu tiên bất biến |

Tổng cộng: **32 collection cấp cao nhất**.

## 3.2 Firestore: subcollection bắt buộc

| Pattern | Nội dung | Yêu cầu |
|---|---|---|
| `inventory/{itemId}/history` | Biến động tồn kho | Backup và restore đầy đủ |
| `reference_standards/{standardId}/logs` | Nhật ký sử dụng chất chuẩn chi tiết | Backup và restore đầy đủ |
| `sops/{sopId}/history` | Lịch sử SOP | Backup và restore đầy đủ |
| `requests/{requestId}/history` | Snapshot phiên bản báo cáo/kết quả | Backup và restore đầy đủ |

### Dữ liệu con mồ côi

Firestore không tự động xóa subcollection khi document cha bị xóa. Vì vậy không được chỉ lặp qua các document cha hiện còn tồn tại.

Backup phải có một trong các cơ chế sau:

- Collection-group query cho từng tên subcollection.
- Admin traversal có khả năng phát hiện document con không phụ thuộc vào việc document cha còn tồn tại.
- Một orphan detector chạy riêng trước khi chốt backup.

Kết quả phải lưu full path, ví dụ:

```text
artifacts/lims-cloud-fixed/requests/REQ-001/history/v3_report
```

Không lưu child chỉ dưới dạng `{parentId, childId}` vì như vậy không đủ để khôi phục nếu có nhiều namespace hoặc nhiều loại parent cùng tên.

## 3.3 Collection gốc `releases`

Collection `releases` nằm ngoài namespace `artifacts/{appId}` và chứa lịch sử release/changelog. Nó phải được backup riêng:

```text
releases/{versionId}
```

Nếu không muốn restore release history vào môi trường mới, vẫn phải lưu nó trong backup manifest để bảo toàn lịch sử vận hành.

## 3.4 Firebase Authentication

Collection `users` không thay thế Firebase Authentication.

Backup Auth cần bao phủ:

- UID.
- Email.
- Email verified.
- Display name.
- Photo URL nếu có.
- Phone number nếu có.
- Disabled.
- Provider data.
- Custom claims.
- Creation time.
- Last sign-in time.
- Password hash/salt nếu được cấp quyền và cần bảo toàn đăng nhập mật khẩu.

Chính sách:

- Backup Auth bằng Firebase Admin SDK ở backend.
- Chia thành part tối đa phù hợp với giới hạn import.
- Restore Auth trước Firestore profile `users/{uid}`.
- Không backup ID token đang hoạt động.
- Không backup session cookie.
- Không backup QR session.
- Không restore FCM token cũ.

Nếu không lấy được password hash/salt, phải ghi rõ trong manifest. Khi đó restore vẫn có thể phục hồi user/provider metadata, nhưng tài khoản password có thể cần reset password.

## 3.5 Google Drive: file nghiệp vụ đã tồn tại

Các file sau đã là dữ liệu hiện có trên Drive và phải được đưa vào phạm vi kiểm kê/backup:

- CoA/chứng chỉ chất chuẩn.
- PDF báo cáo.
- Google Docs báo cáo.
- Excel gốc của mẻ chạy.
- Các file đã archive.
- Google Docs template.
- Các thư mục con báo cáo.
- Thư mục CoA.

Firestore thường chỉ giữ các tham chiếu:

- `certificate_ref`.
- `pdfUrl`.
- `pdfViewUrl`.
- `docsUrl`.

Do đó quy trình phải bắt đầu bằng việc quét Firestore để tạo danh sách Drive file ID/URL được tham chiếu, sau đó kiểm tra file thực tế trên Drive.

### Thông tin phải lưu cho mỗi file Drive

| Trường | Mục đích |
|---|---|
| `sourceFileId` | File ID hiện tại |
| `backupFileId` | File ID bản copy backup |
| `sourceUrl` | Tham chiếu gốc |
| `name` | Đối chiếu nội dung |
| `mimeType` | Quyết định cách copy/export |
| `parents` | Khôi phục cây thư mục |
| `size` | Kiểm tra toàn vẹn |
| `createdTime` | Kiểm tra lịch sử |
| `modifiedTime` | Kiểm tra phiên bản |
| `sha256` | Kiểm tra file nhị phân |
| `referencedBy` | Firestore path đang trỏ đến file |
| `permissionPolicy` | Chính sách ACL sau restore |
| `backupStatus` | Thành công, lỗi, inaccessible |

### File ID thay đổi khi restore

Nếu file được khôi phục bằng bản copy, `backupFileId` sẽ khác `sourceFileId`. Backup phải có bảng mapping:

```text
sourceFileId -> restoredFileId
```

Sau đó cần cập nhật các trường URL trong Firestore. Nếu chỉ restore file bằng Drive Trash/restore nguyên bản và ID giữ nguyên, không cần cập nhật URL; quy trình phải phân biệt hai trường hợp này.

### Google Docs/Sheets

Đối với tài liệu Google Workspace:

- Giữ bản copy Google Workspace nếu cần tiếp tục chỉnh sửa.
- Export thêm PDF/DOCX/XLSX nếu loại tài liệu hỗ trợ.
- Ghi rõ export format và checksum của bản export.
- Kiểm tra sau restore rằng template vẫn mở được và Apps Script có thể dùng được.

## 3.6 Google Docs mẫu tạo báo cáo

Các template hiện đã được khai báo trong `gas/SOP_Configs.gs`. Backup phải:

1. Kiểm kê toàn bộ template ID.
2. Kiểm tra template tồn tại.
3. Kiểm tra MIME type và quyền truy cập.
4. Copy/export sang vùng backup private.
5. Ghi hash/metadata.
6. Kiểm tra mapping SOP → template.
7. Thử tạo một báo cáo mẫu từ bản template backup ở môi trường test.

Template không được xem là đã bảo vệ chỉ vì ID đang nằm trong source code. Source code chỉ chứa tham chiếu; nội dung tài liệu thật nằm trên Drive.

## 3.7 Apps Script source và deployment/config

### Source code

Source hiện có trong repository `gas/`, gồm:

- `LIMS_ReportGenerator.gs`.
- `SOP_Configs.gs`.
- `appsscript.json`.
- Các file reporter theo SOP.

Git là nguồn bảo vệ chính cho source. Backup vẫn phải ghi:

- Commit SHA/release version.
- Hash từng file `.gs`.
- Hash `appsscript.json`.
- Danh sách file đã đóng gói.

API backup hiện cũng lưu `.clasp.json` (không lưu OAuth secret) và gọi Apps
Script API với scope chỉ đọc để lấy `projects.get`, `projects.getContent` và
`projects.deployments.list`. Như vậy manifest không chỉ chứng minh source đã
được commit, mà còn đối chiếu được project/deployment đang chạy tại thời điểm
backup.

### Trạng thái triển khai

Cần kiểm kê riêng các thành phần không nhất thiết nằm trong source:

- Script ID.
- Deployment ID.
- Web App URL.
- Version đang active.
- Tài khoản thực thi.
- Owner/editor.
- Trigger.
- Script Properties.
- OAuth authorization state.
- Root report folder.
- CoA folder.
- Template IDs.
- Firebase project/app ID.

Phân loại restore:

| Thành phần | Backup | Restore |
|---|---:|---:|
| Source `.gs` | Có | Có |
| `appsscript.json` | Có | Có |
| Deployment manifest | Có | Có thủ công/kiểm soát |
| Trigger | Có metadata | Tạo lại có kiểm tra |
| Script Properties idempotency | Có trạng thái chẩn đoán nếu cần | Không restore trạng thái hết hạn |
| Rate-limit state | Không cần | Không |
| OAuth token | Không | Không |
| Root/template file content | Có qua Drive backup | Có |

---

## 4. Dữ liệu không phải backup để restore nguyên trạng

Một số dữ liệu có thể xuất hiện trong hệ thống nhưng không nên phục hồi nguyên trạng vì là trạng thái tạm hoặc có rủi ro bảo mật:

- `auth_sessions`.
- Firebase ID token.
- OAuth access token.
- OAuth refresh token trong browser session.
- Session cookie.
- FCM token cũ.
- Cache trình duyệt.
- IndexedDB cache.
- `localStorage`/`sessionStorage`.
- Blob URL.
- Trạng thái lock đang hoạt động.
- Script idempotency claim đã hết hạn.
- Rate-limit state.

Các mục này phải được ghi rõ trong manifest là `restorePolicy: NEVER`, để việc không restore là chính sách an toàn có chủ đích.

### Bản nháp chưa đồng bộ

Một số bản nháp chưa kịp lưu được giữ trong `localStorage` tại trình duyệt. Chúng không thể được backend backup.

Định nghĩa chính thức:

> Backup toàn diện bảo vệ toàn bộ dữ liệu đã được LIMS ghi chính thức lên server và các file nghiệp vụ đã được đăng ký trên Drive. Nội dung chỉ tồn tại trên một trình duyệt chưa đồng bộ không thuộc phạm vi backup server.

Nếu cần bảo vệ cả bản nháp, phải bổ sung collection `result_drafts` hoặc cơ chế autosave lên Firestore.

---

## 5. Kiến trúc mục tiêu trên Spark

### 5.1 Thành phần

```text
Manager UI
   |
   | Firebase ID token + backup operation
   v
Vercel Backup API
   |\
   | \-- Firebase Admin SDK --> Firestore + Firebase Auth
   |
   \---- Google Drive API/GAS --> Drive source files and backup folder
```

Các endpoint mục tiêu:

| Endpoint | Mục đích |
|---|---|
| `POST /api/backup/create` | Tạo backup đầy đủ |
| `GET /api/backup/list` | Liệt kê backup đã tạo |
| `GET /api/backup/inspect` | Đọc manifest và coverage |
| `POST /api/backup/verify` | Kiểm tra checksum/quyền/file |
| `POST /api/backup/restore` | Dry-run hoặc thực hiện restore |
| `GET /api/backup/status` | Cấu hình coverage, Apps Script scope, checkpoint/quota |

### 5.2 Xác thực và phân quyền

Mỗi request phải:

1. Nhận Firebase ID token.
2. Verify token bằng Firebase Admin SDK.
3. Kiểm tra project ID/app ID hợp lệ.
4. Đọc hồ sơ `users/{uid}`.
5. Kiểm tra `role=manager` hoặc permission riêng như `backup_create`, `backup_verify`, `backup_restore`.
6. Ghi audit log không chứa token.

Không được tin `uid`, `appId`, `projectId` do client gửi mà không kiểm tra server-side.

### 5.3 Không dùng Cloud Functions

Để giữ Spark:

- Dùng API route Vercel hiện có.
- Dùng Firebase Admin SDK trong backend.
- Không triển khai Cloud Functions.
- Không dùng Cloud Storage cho backup.
- Không dùng Firestore managed export/import.
- Có thể dùng Vercel Cron nếu có credential Drive dài hạn an toàn; bản đầu tiên có thể dùng Manager-triggered backup.

### 5.4 Cơ chế credential Drive

OAuth hiện tại của browser dùng scope hạn chế cho các file mà ứng dụng tạo hoặc được cấp quyền. Để backup đầy đủ cả file do Apps Script tạo, phải xác nhận một trong hai mô hình:

#### Mô hình A: Apps Script thực hiện Drive backup

- Script chạy bằng account có quyền trên root folder.
- Script copy file/cây thư mục vào backup folder.
- Backend nhận manifest/checksum/status.

#### Mô hình B: Backend dùng một OAuth account backup riêng

- Account backup có quyền đọc đúng root folder, CoA folder và template.
- Token/refresh token lưu trong Vercel environment secret, không lưu Firestore/Drive/frontend.
- Scope phải đủ để đọc các file được bảo vệ.

Mô hình A đơn giản hơn nếu toàn bộ dữ liệu Drive thuộc account thực thi Apps Script. Mô hình B phù hợp hơn nếu muốn kiểm soát backup tập trung từ Vercel.

---

## 6. Định dạng backup

### 6.1 Cấu trúc logic

```text
LIMS_BACKUP_<backupId>/
  manifest.json.enc
  firestore/
    part-00001.ndjson.gz.enc
    part-00002.ndjson.gz.enc
  auth/
    users-00001.ndjson.gz.enc
  drive/
    file-manifest.ndjson.gz.enc
    assets-00001.bin.enc
  deployment/
    apps-script-manifest.json.enc
  verification/
    coverage.json.enc
    checksums.json.enc
    integrity-report.json.enc
```

### 6.2 Firestore record format

Mỗi record phải có full path và dữ liệu đã serialize:

```json
{
  "path": "artifacts/lims-cloud-fixed/requests/REQ-001/history/v3",
  "collection": "requests/history",
  "documentId": "v3",
  "parentPath": "artifacts/lims-cloud-fixed/requests/REQ-001",
  "data": {
    "version": 3,
    "publishedAt": {
      "__limsType": "timestamp",
      "seconds": 1720000000,
      "nanoseconds": 0
    }
  }
}
```

### 6.3 Manifest bắt buộc

Manifest phải có:

- `backupId`.
- `formatVersion`.
- `schemaVersion`.
- `serializerVersion`.
- `projectId`.
- `appId`.
- `releaseVersion`.
- `startedAt`.
- `completedAt`.
- `status`.
- `actorUid`.
- `firestorePaths`.
- `documentCountByPath`.
- `totalFirestoreDocuments`.
- `totalFirestoreBytes`.
- `authUserCount`.
- `driveFileCount`.
- `driveFileCountUnreadable`.
- `partChecksums`.
- `totalCiphertextBytes`.
- `unknownCollections`.
- `orphanSubcollectionCount`.
- `quotaUsage`.
- `restorePolicies`.
- `keyId`.

Backup chỉ được gắn `COMPLETED` khi:

- Không còn collection bắt buộc chưa đọc.
- Không còn unknown collection chưa được phê duyệt.
- Không còn part thiếu checksum.
- Drive file bắt buộc đều đọc/copy thành công.
- Manifest đã được xác minh sau upload.

### 6.4 Mã hóa

Quy trình đề xuất:

1. Serialize.
2. NDJSON.
3. Gzip.
4. AES-256-GCM.
5. SHA-256 ciphertext.
6. Upload Drive private.

Khóa mã hóa:

- 32 byte.
- Có `keyId`.
- Lưu trong secret manager/environment secret.
- Có một bản escrow offline.
- Có quy trình xoay khóa.
- Không để trong repository.
- Không để trong Firestore.
- Không để cùng thư mục backup Drive.
- Không in vào log.

---

## 7. Quy trình tạo backup

### Bước 0: Preflight

Kiểm tra:

- Firebase project/app ID.
- Người thực hiện và quyền.
- Maintenance/busy state.
- Không có migration/import/backfill/bulk cleanup đang chạy.
- Quota Spark còn đủ.
- Drive root folder và backup folder truy cập được.
- Khóa mã hóa tồn tại.
- Không có backup job khác đang chạy.

### Bước 1: Tạo snapshot boundary

Vì Spark không cung cấp managed export snapshot, backup tùy chỉnh phải có write fence:

- Bật trạng thái `backup_in_progress` hoặc maintenance ngắn.
- Hiển thị thông báo cho người dùng.
- Chặn các bulk mutation trong thời gian chụp dữ liệu.
- Ghi thời điểm bắt đầu và kết thúc.

Nếu không thể dừng toàn bộ ghi, manifest phải ghi rõ đây là `logical_consistent_read`, không phải transaction snapshot.

### Bước 2: Đọc Firestore

- Duyệt đủ 32 collection.
- Đọc mọi document kể cả document đánh dấu `_isDeleted`.
- Duyệt bốn nhóm subcollection.
- Dò orphan subcollection.
- Backup `releases`.
- Lưu full path.
- Đếm document theo path.
- Serialize đúng kiểu.
- Chia part theo kích thước an toàn.

Không được tự động bỏ qua:

- Document cũ.
- Document archived.
- Document `_isDeleted` nếu chính sách retention chưa cho phép loại bỏ.
- Document không có `lastUpdated`.
- Document có field legacy.

### Bước 3: Backup Firebase Auth

- Liệt kê theo trang.
- Lưu UID/provider/claims/metadata.
- Lưu password hash/salt chỉ khi đủ quyền và chính sách cho phép.
- Không ghi token.
- So sánh Auth UID với Firestore profile UID.

### Bước 4: Kiểm kê và backup Drive

- Trích xuất toàn bộ file ID từ Firestore.
- Thêm template ID từ deployment manifest.
- Thêm file trong root report/CoA folder theo chính sách.
- Kiểm tra file tồn tại.
- Copy/export.
- Tính checksum.
- Lưu cây thư mục và mapping.
- Kiểm tra ACL không có quyền `anyone` trên backup.

### Bước 5: Chốt manifest

- Tính tổng count/bytes.
- Tính checksum từng part.
- Ghi warnings/errors.
- Upload manifest cuối cùng.
- Đọc lại manifest và một phần part để xác minh.
- Chỉ đặt `COMPLETED` sau khi verify đạt.

### Bước 6: Kết thúc

- Tắt maintenance/write fence.
- Ghi audit log.
- Hiển thị backup ID, thời điểm, count và warning.
- Nếu thất bại, hiển thị `FAILED`, không hiển thị thành công một phần.

---

## 8. Quy trình restore

### 8.1 Chế độ restore

| Chế độ | Mục đích | Mặc định |
|---|---|---:|
| `DRY_RUN` | Chỉ tính diff, không ghi | Có |
| `RECOVER_MISSING` | Chỉ tạo lại dữ liệu bị thiếu | Có sau dry-run |
| `RESTORE_SELECTED` | Khôi phục phạm vi đã chọn | Không |
| `FULL_REPLACE` | Thay toàn bộ phạm vi | Chỉ break-glass |

### 8.2 Pre-restore bắt buộc

1. Xác thực Manager/backup permission.
2. Chọn backup ID.
3. Xác minh app ID/project ID.
4. Giải mã và kiểm tra authentication tag.
5. Xác minh SHA-256 toàn bộ part.
6. Đọc manifest.
7. Kiểm tra schema/serializer version.
8. Chạy dry-run.
9. Tạo backup `PRE_RESTORE`.
10. Bật maintenance/write fence.

### 8.3 Thứ tự restore

1. Khôi phục/copy file Drive.
2. Tạo mapping file ID.
3. Khôi phục Firebase Authentication.
4. Khôi phục cấu hình và roles.
5. Khôi phục Firestore document cha.
6. Khôi phục subcollection.
7. Cập nhật URL Drive.
8. Không restore token/session/lock.
9. Tái tính hoặc đối chiếu dữ liệu dẫn xuất.
10. Chạy integrity checks.
11. Ghi checkpoint hoàn tất.
12. Tắt maintenance.

### 8.4 Checkpoint và idempotency

Checkpoint hiện được lưu ngoài dữ liệu đang restore trong chính backup folder
dưới dạng `restore-checkpoint-<restoreId>.json.enc`, gồm:

- `restoreId`.
- `backupId`.
- Part hiện tại.
- Record cuối cùng.
- Collection path.
- Số writes thành công.
- Lỗi gần nhất.
- Thời gian cập nhật.

Sau mỗi batch Firestore, nhóm Drive hoặc batch Auth, checkpoint được cập nhật
sau khi thao tác đã commit. Nếu request bị timeout, Manager có thể chọn
checkpoint `RECOVER_MISSING` còn dang dở trong giao diện để chạy lại bằng
`restoreId`; phần đã hoàn tất được nhận diện theo ID và không tạo bản sao
trùng. `RESTORE_SELECTED` và `FULL_REPLACE` vẫn cần operator truyền lại phạm
vi/xác nhận tương ứng, không tự động resume từ UI nhanh.

Restore phải an toàn khi chạy lại. Không được tạo thêm audit log giả hoặc làm tăng dữ liệu lịch sử chỉ vì retry.

### 8.5 Full replace

`FULL_REPLACE` phải:

- Có hai lần xác nhận.
- Bắt buộc backup trước restore.
- Có danh sách collection cụ thể.
- Không xóa ngoài phạm vi.
- Có rollback plan.
- Chỉ Manager cấp cao được phép.

Không dùng `FULL_REPLACE` cho sự cố mất một vài document. Mặc định luôn dùng `RECOVER_MISSING`.

---

## 9. Kiểm tra toàn vẹn sau restore

### 9.1 Coverage

- 32/32 collection có trong manifest.
- `releases` có trong manifest.
- 4 loại subcollection có trong manifest.
- Unknown collections bằng 0 hoặc đã được phê duyệt.
- Orphan subcollection đã được kiểm kê.
- Count trước/sau khớp theo phạm vi restore.

### 9.2 Kiểu dữ liệu

- Timestamp vẫn là Timestamp.
- Array/map giữ cấu trúc.
- Document ID giữ nguyên.
- Reference giữ đúng path.
- Bytes giữ đúng nội dung.
- Không mất field `null`.
- Không xuất hiện `undefined`.

### 9.3 Liên kết nghiệp vụ

- `inventory/history` trỏ đúng item.
- `reference_standards/logs` trỏ đúng standard.
- `standard_usages` khớp journal chi tiết.
- `standard_code_registry.currentStandardId` trỏ document còn tồn tại.
- `standard_requests.standardId` trỏ standard còn tồn tại.
- `results_details.requestId` trỏ request còn tồn tại.
- `requests/history` vẫn đọc được phiên bản báo cáo.
- `print_jobs.requestId` trỏ request hợp lệ.
- `daily_checklists` reconciliation được với `requests`.
- `stats/monthly_stats` không mâu thuẫn với dữ liệu nguồn.

### 9.4 Liên kết Drive

- Mọi `certificate_ref` hợp lệ.
- Mọi `pdfUrl`/`pdfViewUrl` mở được hoặc được đánh dấu missing có lý do.
- Mọi `docsUrl` mở được.
- File ID mới được cập nhật đúng nếu cần.
- PDF/Excel/CoA checksum khớp.
- Template mở được.
- Apps Script test tạo report được.

### 9.5 Authentication

- Auth UID và Firestore profile UID khớp.
- Role/permission hợp lệ.
- User disabled giữ đúng trạng thái.
- Provider giữ đúng.
- Không có session token cũ được restore.
- FCM token được đăng ký lại khi thiết bị hoạt động.

---

## 10. Quản lý quota và dung lượng

### 10.1 Firestore Spark

Backup tùy chỉnh dùng Admin SDK vẫn tạo reads; restore tạo writes. Admin SDK không biến các thao tác này thành miễn phí ngoài hạn mức.

Phải theo dõi:

- Reads theo backup job.
- Writes theo restore job.
- Deletes nếu có `FULL_REPLACE`.
- Reads theo collection.
- Writes theo collection.
- Quota còn lại trong ngày.
- Drive API request, bytes đã upload và storage quota trước/sau backup.
- Thời gian xử lý.

### 10.2 Guard đề xuất ban đầu

Cho đến khi có số liệu production:

- Không chạy backup nếu ước tính vượt ngân sách read an toàn.
- Không restore nếu ước tính vượt ngân sách write an toàn.
- Giữ reserve quota cho hoạt động bình thường.
- Giới hạn số batch đồng thời ở mức 1.
- Retry có backoff giới hạn.
- Không retry vô hạn.
- Nếu quota gần cạn, dừng tại checkpoint.

Các ngưỡng cụ thể phải được cấu hình sau khi đo backup thực tế, không hardcode dựa trên ước tính dung lượng đơn giản.

### 10.3 Drive

Theo dõi:

- Dung lượng Drive.
- Số file backup.
- Số part.
- Lỗi `403`.
- Lỗi `429`.
- Lỗi hết storage.
- File inaccessible.
- Thời gian copy/export.

---

## 11. Retention và tổ chức thư mục Drive

### 11.1 Cấu trúc thư mục

```text
LIMS_Backups/
  production/
    daily/
    weekly/
    monthly/
    pre-restore/
    failed/
  verification/
  deployment-manifests/
```

Thư mục backup phải private. Không dùng quyền `anyone with the link`.

### 11.2 Retention ban đầu

Đề xuất:

- 14 bản daily.
- 8 bản weekly.
- 6 bản monthly.
- Giữ tất cả bản `PRE_RESTORE` trong thời gian dài hơn.
- Giữ bản trước mỗi migration/bulk cleanup quan trọng.

Retention chỉ được tự động xóa khi:

- Bản mới đã verify thành công.
- Có ít nhất một bản khác còn tồn tại.
- Không phải bản duy nhất của một khoảng thời gian.
- Không phải `PRE_RESTORE` đang được tham chiếu bởi incident.

---

## 12. Mô hình rủi ro Drive

### Lớp bảo vệ 1: Drive source

Bảo vệ hoạt động bình thường và khả năng khôi phục file đơn lẻ.

### Lớp bảo vệ 2: Backup folder private

Bảo vệ khỏi xóa nhầm file/cây thư mục nguồn nếu backup folder có quyền kiểm soát riêng.

### Lớp bảo vệ 3: Account hoặc bản sao độc lập

Bảo vệ khỏi:

- Mất toàn bộ tài khoản Google.
- Bị khóa account.
- Người có quyền xóa cả source và backup.
- Xóa vĩnh viễn khỏi Trash.
- Sự cố quyền sở hữu.

Nếu chỉ được dùng Drive hiện tại, cần hiểu đây là bảo vệ khôi phục vận hành, chưa phải disaster recovery độc lập hoàn toàn. Nên có thêm một tài khoản sở hữu backup hoặc một bản offline mã hóa định kỳ.

---

## 13. Lộ trình triển khai

### R0 — Bảo vệ ngay lập tức

- Tạm dừng archive/delete hàng loạt cho đến khi có backup mới.
- Không coi JSON cũ là backup đầy đủ.
- Rà soát 15 snapshot lịch sử đang được dashboard cảnh báo thiếu.
- Ghi baseline count cho 32 collection và Drive reference.
- Xác nhận Firebase vẫn ở Spark.

**Đầu ra:** baseline report và danh sách dữ liệu cần bảo vệ.

### R1 — Backup contract

- Tạo catalog 32 collection.
- Tạo catalog 4 subcollection.
- Tạo catalog `releases`.
- Tạo Auth policy.
- Tạo Drive asset policy.
- Tạo restore policy theo collection.
- Tạo schema/serializer version.

**Đầu ra:** backup contract được review.

### R2 — Firestore backup engine

- Recursive/document full-path export.
- Collection-group/orphan detection.
- Tagged serializer.
- NDJSON/chunking.
- Gzip.
- AES-256-GCM.
- SHA-256.
- Manifest.

**Đầu ra:** tạo được backup Firestore hoàn chỉnh trong môi trường test.

### R3 — Auth backup engine

- List users theo page.
- Export provider/claims/metadata.
- Kiểm soát password hash/salt.
- UID/profile reconciliation.

**Đầu ra:** Auth backup được mã hóa và có import test.

### R4 — Drive asset backup engine

- Trích xuất file ID từ Firestore.
- Kiểm kê template.
- Kiểm kê root/CoA/report folders.
- Copy/export.
- Checksum.
- Mapping source/backup ID.
- ACL verification.

**Đầu ra:** backup CoA/PDF/Docs/Excel/template có manifest.

### R5 — Restore engine

- Dry-run.
- Recover missing.
- Restore selected.
- Full replace có bảo vệ.
- Checkpoint.
- Resume.
- Idempotency.
- Integrity checks.

**Đầu ra:** restore chạy được trên emulator và project Spark test.

### R6 — UI Manager

- Trạng thái backup.
- Coverage summary.
- Dung lượng/reads/writes.
- Danh sách backup.
- Verify.
- Dry-run diff.
- Restore confirmation.
- Audit history.

**Đầu ra:** Manager có thể vận hành mà không cần terminal.

### R7 — Production canary

- Tạo backup production.
- Verify toàn bộ manifest.
- Restore một phạm vi nhỏ vào môi trường test.
- Xóa có kiểm soát một document test.
- Recover missing.
- Kiểm tra Drive file và report template.

**Đầu ra:** biên bản canary pass.

### R8 — Đưa vào vận hành chính thức

- Thiết lập lịch backup.
- Thiết lập retention.
- Thiết lập cảnh báo thất bại.
- Thiết lập lịch restore drill.
- Phân công người giữ khóa mã hóa.
- Phân công người phê duyệt restore.
- Cập nhật runbook incident.

**Đầu ra:** trạng thái backup toàn diện được công nhận.

---

## 14. Tiêu chí nghiệm thu bắt buộc

Không được đánh dấu hệ thống “đã backup toàn diện” nếu thiếu bất kỳ nhóm nào dưới đây.

### Coverage

- [ ] 32/32 Firestore collection.
- [ ] `releases`.
- [ ] 4 nhóm subcollection.
- [ ] Orphan subcollection detection.
- [ ] Unknown collection detection.
- [ ] Auth users.
- [ ] Drive CoA.
- [ ] Drive PDF.
- [ ] Drive Google Docs.
- [ ] Drive Excel.
- [ ] Report templates.
- [ ] Apps Script deployment/config manifest.

### Security

- [ ] Backup encrypted.
- [ ] Key không nằm trong backup.
- [ ] Drive backup private.
- [ ] Không có permission `anyone`.
- [ ] Endpoint yêu cầu Manager/permission riêng.
- [ ] Token không xuất hiện trong log.
- [ ] Password hash được bảo vệ riêng.

### Integrity

- [ ] SHA-256 từng part.
- [ ] Manifest checksum.
- [ ] Restore từ file bị sửa bị từ chối.
- [ ] Restore từ file thiếu part bị từ chối.
- [ ] Timestamp giữ đúng kiểu.
- [ ] Document ID/full path giữ nguyên.
- [ ] Drive file checksum đúng.
- [ ] Mapping file ID đầy đủ.

### Restore

- [ ] Dry-run.
- [ ] Recover missing.
- [ ] Restore selected.
- [ ] Full replace được bảo vệ.
- [ ] Checkpoint.
- [ ] Resume.
- [ ] Idempotency.
- [ ] Pre-restore backup.
- [ ] Post-restore integrity check.

### Quota

- [ ] Ước tính reads trước backup.
- [ ] Ước tính writes trước restore.
- [ ] Có reserve quota.
- [ ] Có dừng an toàn khi gần vượt quota.
- [ ] Có backoff và retry giới hạn.
- [ ] Có theo dõi Drive 403/429/storage.

### Diễn tập

- [ ] Restore vào Firebase Emulator.
- [ ] Restore vào project Spark test.
- [ ] Restore một document nghiệp vụ.
- [ ] Restore một subcollection history.
- [ ] Restore một CoA.
- [ ] Restore một PDF.
- [ ] Restore một Google Doc.
- [ ] Restore một Excel.
- [ ] Restore một template.
- [ ] Tạo lại báo cáo sau restore.
- [ ] Đăng nhập bằng user được phục hồi.

---

## 15. RPO/RTO mục tiêu

### Giai đoạn đầu: Manager-triggered backup

- **RPO:** thời điểm của backup thành công gần nhất.
- **RTO:** 30–90 phút tùy số lượng document/file.

### Sau khi có lịch backup tự động

- Backup daily.
- **RPO mục tiêu:** không quá 24 giờ.
- **RTO mục tiêu:** 30–60 phút sau khi benchmark thực tế đạt.

RPO/RTO cuối cùng phải dựa trên:

- Số document thực tế.
- Tổng dung lượng Drive.
- Tốc độ đọc Firestore.
- Tốc độ ghi restore.
- Drive API quota.
- Số lượng file template/report.

---

## 16. Runbook khi phát hiện bị xóa dữ liệu

### 16.1 Mất một document Firestore

1. Dừng thao tác archive/delete.
2. Xác định full path và thời điểm mất.
3. Kiểm tra audit log.
4. Kiểm tra backup gần nhất.
5. Chạy dry-run `RECOVER_MISSING`.
6. Kiểm tra diff.
7. Tạo `PRE_RESTORE` nếu cần.
8. Restore document.
9. Restore subcollection liên quan.
10. Chạy integrity check.
11. Mở lại thao tác nghiệp vụ.

### 16.2 Mất PDF/CoA/Docs/Excel

1. Xác định file ID hoặc URL từ Firestore.
2. Kiểm tra Drive Trash.
3. Kiểm tra backup manifest.
4. Nếu có file bản gốc trong Trash và ID giữ nguyên, restore file gốc.
5. Nếu chỉ có bản copy, phục hồi bản copy.
6. Cập nhật mapping URL trong Firestore.
7. Kiểm tra quyền truy cập.
8. Mở file từ giao diện LIMS.
9. Ghi audit log.

### 16.3 Mất toàn bộ Drive source

1. Chuyển sang account/nguồn backup độc lập.
2. Restore template và folder trước.
3. Restore file nghiệp vụ.
4. Tạo mapping file ID.
5. Cập nhật URL Firestore.
6. Kiểm tra Apps Script deployment/config.
7. Tạo thử báo cáo.
8. Reopen LIMS sau khi nghiệm thu.

---

## 17. Các cảnh báo không được bỏ qua

- Không dùng JSON export hiện tại làm bằng chứng backup toàn diện.
- Không xóa dữ liệu cũ chỉ vì đã export Excel archive.
- Không đánh dấu backup thành công nếu một collection bị lỗi đọc.
- Không bỏ qua orphan subcollection.
- Không lưu khóa mã hóa cùng backup.
- Không đặt quyền public cho backup.
- Không restore token/session cũ.
- Không chạy full replace mà không tạo pre-restore backup.
- Không retry vô hạn khi Spark quota gần cạn.
- Không coi URL Drive là nội dung file.
- Không coi template ID trong source là bản backup của template content.
- Không coi Apps Script source là toàn bộ deployment state.
- Không khẳng định RPO nếu chưa có timestamp backup thành công.
- Không khẳng định RTO nếu chưa restore rehearsal.

---

## 18. Trạng thái hoàn thành cuối cùng

Chỉ được công nhận giải pháp hoàn thành khi có đủ ba bằng chứng:

### Bằng chứng 1 — Coverage report

Manifest xác nhận:

- Đủ 32 collection.
- Đủ subcollection.
- Có `releases`.
- Có Auth.
- Có Drive assets.
- Unknown collection bằng 0 hoặc đã phê duyệt.

### Bằng chứng 2 — Verification report

- Checksum đạt.
- ACL private đạt.
- Không có part thiếu.
- Không có file bắt buộc inaccessible.
- Serializer round-trip đạt.

### Bằng chứng 3 — Restore rehearsal report

- Restore test đạt.
- Data integrity đạt.
- Auth login đạt.
- Drive file mở được.
- Template tạo report được.
- Quota guard hoạt động.
- Checkpoint/resume hoạt động.

Nếu thiếu một trong ba bằng chứng này, trạng thái phải là:

```text
BACKUP_IMPLEMENTED_BUT_NOT_CERTIFIED
```

Không được hiển thị là `BACKUP_COMPLETE`.

---

## 19. Kết luận

Các file CoA, PDF, Google Docs, Excel, Google Docs mẫu và tài nguyên Apps Script **đã tồn tại trên Google Drive hiện tại**. Đây là nguồn dữ liệu hợp lệ và phải được giữ nguyên.

Điểm còn thiếu không phải là “tạo lại các file”, mà là xây một quy trình có thể chứng minh rằng:

1. File được kiểm kê đầy đủ.
2. File được copy/export vào vùng backup private.
3. Nội dung và metadata được kiểm tra.
4. Firestore URL được mapping đúng.
5. Template và deployment có thể hoạt động sau restore.
6. Firebase Auth và Firestore khớp UID.
7. Toàn bộ dữ liệu nghiệp vụ Firestore được backup, gồm lịch sử con.
8. Restore có kiểm soát và đã được diễn tập.
9. Hệ thống vẫn chạy trên Spark và không phát sinh billing.

Phương án tối ưu vẫn là:

> **Spark + backup tùy chỉnh mã hóa lên Drive + backup cả Firestore/Auth/Drive + restore có checksum và checkpoint + theo dõi quota.**
