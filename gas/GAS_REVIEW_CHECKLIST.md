# Review Google Apps Script (GAS) - LIMS

Ngày review: 2026-08-08
Cập nhật bổ sung: 2026-08-09
Checkpoint xác minh hiện tại: 2026-08-09

Phạm vi: toàn bộ thư mục `gas/` và các điểm gọi GAS trực tiếp từ frontend để kiểm chứng contract đầu vào/đầu ra.

## 1. Kết luận nhanh

Review ban đầu phát hiện các lỗi cần ưu tiên trước khi coi luồng tạo báo cáo là an toàn cho production. Đến checkpoint 2026-08-09, hai rủi ro P0 về Web App mutation không có authentication/authorization và archive file ngoài phạm vi LIMS đã được remediated trong source + regression. Các remediation source-level còn lại trong checklist cũng đã được triển khai phần lớn; các blocker chưa thể đóng hiện tập trung ở semantics nghiệp vụ của `missing` và bằng chứng runtime trên Google Docs/Drive sandbox.

Các finding integrity ban đầu gồm parse sai ngày ở Trifluralin, tự mặc định QC thiếu dữ liệu thành `Đạt`, heuristic tự kết luận "Phát hiện" dựa trên metadata sample, phân trang có thể bỏ sample, helper sắc ký có thể mutate nhầm bảng, numeric `0` bị mất do truthy/falsy và template drift ghi nhầm cột. Các đường code tương ứng hiện đã có remediation/checklist regression; riêng tiêu chí end-to-end vẫn chưa được đóng khi cần phân biệt `missing` với `ND` theo policy nghiệp vụ hoặc cần render bằng template thật.

Nguyên tắc integrity cần áp dụng xuyên suốt frontend → GAS → Google Doc → PDF: **Missing ≠ 0 ≠ ND ≠ N/A ≠ empty string**, ngoại trừ các field đã được nghiệp vụ quy định rõ giá trị khởi tạo mặc định. Không dùng truthy/falsy để suy diễn ý nghĩa dữ liệu nghiệp vụ ngoài các rule mặc định đã được xác nhận.

### Checkpoint xác minh source-level hiện tại

- [x] `npm run test:gas`: **64/64** regression pass, gồm auth/authorization, ownership của archive, upload guard/idempotency, generate idempotency, template routing/preflight, pagination, rollback và value-state checks.
- [x] `npm test`: exit 0; các nhóm frontend/API/Firestore emulator/GAS đều pass. Sau test, port emulator `8080` đã được xác nhận không còn listener.
- [x] `npx tsc -p tsconfig.app.json --noEmit --pretty false`, `npm run typecheck:api`, `npm run build` và `git diff --check`: đều exit 0. Build cũng xác nhận release notes đồng bộ với `v26.08.08-b05`.
- [x] Số finding vẫn là **23** (`P0=2, P1=9, P2=10, P3=2`); không phát sinh finding mới từ checkpoint này.
- [ ] Runtime evidence trên Google Docs/Drive production-like chưa có: các mục phụ thuộc template thật, deployed Web App và Drive sandbox không được tự động đánh dấu chỉ từ test in-memory/source-level.

### Mức ưu tiên

| Mức | Ý nghĩa | Số finding |
| --- | --- | ---: |
| P0 / Critical | Có thể bị lạm dụng từ bên ngoài hoặc gây thay đổi Drive với quyền admin | 2 |
| P1 / High | Có thể làm sai dữ liệu/báo cáo hoặc tạo file không đầy đủ | 9 |
| P2 / Medium | Độ ổn định, maintainability, vận hành và khả năng audit | 10 |
| P3 / Low | Cleanup/refactor, giảm drift | 2 |

## 2. Checklist phạm vi đã review

- [x] `gas/LIMS_ReportGenerator.gs` - controller, web endpoint, Drive, export PDF, archive, upload, helper chung.
- [x] `gas/SOP_Configs.gs` - template IDs, root folder, canonical mapping, cấu hình SOP.
- [x] `gas/Report_Type2_3A.gs` - text replacement, sample table, pagination, auto-cut, QC.
- [x] `gas/Report_Type3B.gs` - Form Check/Form Đơn, compound mapping, QC, chromatogram, calibration/result tables.
- [x] `gas/Report_Trifluralin.gs` - custom report Trifluralin.
- [x] `gas/Report_FipronilChlorpyrifos.gs` - custom report Fipronil/Chlorpyrifos và bản rút gọn.
- [x] `gas/Report_Dichlorvos.gs` - custom report Dichlorvos.
- [x] `gas/Report_Chloroform.gs` - custom report Chloroform.
- [x] `gas/append.js` - đã review là script phụ/legacy chứa bản sao logic Form Đơn; đã loại khỏi source ngày 2026-08-09.
- [x] `gas/update_frontend.js` - đã review là helper/migration cũ; đã loại khỏi source ngày 2026-08-09 vì lỗi cú pháp, hardcode path máy cũ và không còn live reference.
- [x] Cross-check `src/app/core/services/report.service.ts` để xác nhận cách frontend gọi GAS.
- [x] Cross-check `src/app/features/results/result-pdf-helper.ts` và `config/sop-configs.ts` để xác nhận payload/canonical ID.
- [x] Parse/syntax check: review ban đầu có 10 file trong `gas/`, trong đó `update_frontend.js` lỗi cú pháp; sau cleanup ngày 2026-08-09, toàn bộ 8 file GAS/JS còn lại parse thành công bằng `vm.Script` trên UTF-8 source bytes.
- [x] Kiểm tra parity `compounds` / `resultColumns` / `COMPOUND_TO_CANONICAL` bằng script đọc config.
- [x] Kiểm tra deployment/config metadata: từ 2026-08-09 repo đã có `gas/appsscript.json` để version-control timezone, V8 runtime, exception logging, OAuth scopes, URL fetch allowlist và Web App execution/access policy; chưa thêm `.clasp.json`/script ID vì repo không có giá trị môi trường đã được xác nhận để commit an toàn.
- [ ] Chạy smoke test thật trên từng Google Docs template và Drive sandbox. Đây là bước runtime, không thể chứng minh chỉ bằng static review source trong repo. (2026-08-09: source-level preflight/regression đã tiếp tục được siết; task hiện tại không có Drive connector/runtime để mở template thật nên không tự đánh dấu hoàn thành.)

## 3. Findings chi tiết

### P0 / Critical

#### GAS-001 - Web App public chạy quyền admin nhưng `doPost` không có authentication/authorization — Remediated 2026-08-09

Evidence:

- `LIMS_ReportGenerator.gs:72-75` ghi deploy `Execute as: Me (lab admin)` và `Who has access: Anyone`.
- `LIMS_ReportGenerator.gs:91-109` nhận JSON và route thẳng tới `generate_pdf`, `archive_reports`, `upload_excel`.
- Không có token, HMAC/signature, session validation, allowlist user hoặc kiểm tra role trong thư mục `gas/`.
- `src/app/core/services/report.service.ts:69-74`, `97-100`, `156-159` POST trực tiếp tới URL GAS bằng `text/plain`, không gửi credential ứng dụng hay chữ ký request.

Impact: nếu deployment production đang đúng như cấu hình được ghi trong source, bất kỳ ai biết URL Web App có thể gọi các thao tác chạy bằng quyền Drive của tài khoản triển khai. Đây là trust-boundary sai ở cấp kiến trúc.

Remediation: mọi mutation `generate_pdf`, `archive_reports`, `upload_excel` hiện bắt buộc gửi Firebase `idToken` + `appId`. GAS verify ID token qua Firebase Identity Toolkit, đọc profile/role/permissions từ Firestore và reject user inactive/pending/viewer hoặc staff thiếu quyền trước khi dispatch mutation. Namespace LIMS được pin server-side bằng `CONFIG.FIREBASE_AUTH.APP_ID = 'lims-cloud-fixed'`; client không thể đổi local `appId` sang namespace hợp lệ khác để vượt authorization. `doGet` vẫn chỉ là health endpoint. Regression xác nhận thiếu auth bị reject cho cả 3 action, token sai bị reject, profile/permission sai bị reject, staff hợp lệ được phép, app ID hợp lệ về cú pháp nhưng khác namespace bị reject trước network fetch, và raw ID token không bị ghi log. Static validation sau remediation: GAS 35/35, `npx tsc -p tsconfig.app.json --noEmit`, `npm run build`, `git diff --check` đều exit 0.

#### GAS-002 - `archive_reports` cho phép mutation file Drive ngoài phạm vi LIMS — Remediated 2026-08-09

Evidence:

- `LIMS_ReportGenerator.gs:467-508` nhận URL file do caller cung cấp.
- `LIMS_ReportGenerator.gs:510-513` lấy file ID trực tiếp từ URL.
- `LIMS_ReportGenerator.gs:516-539` gọi `DriveApp.getFileById(fileId)`, đổi tên `[HUY]_...` và `moveTo()` mà không kiểm tra ancestor/root folder.

Impact: nếu script owner có quyền trên file, caller có thể yêu cầu GAS di chuyển/đổi tên file không thuộc report LIMS. Kết hợp GAS-001, đây là primitive thay đổi Drive từ public endpoint.

Remediation: `archive_reports` hiện yêu cầu mutation auth/authorization như các action khác, verify từng file nằm dưới `CONFIG.ROOT_FOLDER_ID`, đồng thời `assertArchiveFilesBelongToRequest()` chỉ chấp nhận Drive file đã được Firestore request/history của chính `requestId` tham chiếu. Regression xác nhận file ngoài root bị reject trước rename/move và file không thuộc cùng request/history bị reject; file hợp lệ vẫn archive được.

### P1 / High

#### GAS-003 - Upload Excel thiếu giới hạn kích thước, validate file và idempotency — Remediated 2026-08-09

Evidence ban đầu: luồng `upload_excel` decode Base64 và tạo file trực tiếp; `requestId` bắt buộc nhưng không được dùng làm idempotency key; MIME bị hardcode thành XLSX; không có kiểm tra extension/signature/size/quota/rate.

Impact: spam request có thể làm đầy Drive/quota, tạo file trùng khi retry, hoặc lưu nội dung không phải XLSX dưới MIME XLSX.

Remediation: `validateUploadExcelPayload()` + `prepareUploadExcelFile()` giới hạn `requestId` 200 ký tự, `fileName` 255 ký tự/không có path separator, allowlist SOP, chỉ nhận `.xlsx`/`.xls`, validate Data URL MIME, Base64 syntax, decoded size tối đa 20 MiB và magic bytes của XLSX/XLS. `executeUploadExcelIdempotently()` dùng `requestId` + SHA-256 fingerprint, replay kết quả đã hoàn thành, reject cùng key với payload khác, cleanup claim khi lỗi và rollback file Drive nếu finalization thất bại. `consumeUploadExcelQuota()` giới hạn 30 upload mới/10 phút/script; replay không tiêu quota. MIME blob được chọn đúng theo `.xlsx`/`.xls`. Trust boundary/authentication của mutation endpoint vẫn được theo dõi riêng tại GAS-001 và checklist P0.

Regression evidence: 30/30 GAS tests pass, trong đó có valid XLSX/XLS, extension/path/MIME/signature/Base64/size rejection, idempotent replay, changed-payload rejection, Drive-create failure cleanup, finalization rollback + retry, rate-limit enforcement/window reset và corrupt rate-limit state reset; combined regression 37/37, `tsc --noEmit` và `git diff --check` pass trước khi cập nhật checklist.

#### GAS-004 - Trifluralin parse sai `dd/MM/yyyy / Tên người`

Evidence: `Report_Trifluralin.gs:17-35` dùng `split('/')`. Với input đang được dùng trong repo như `20/05/2026 / Ong Thanh Dat`, kết quả hiện tại là `date = "20"`, `name = "05/2026 / Ong Thanh Dat"`.

Impact: placeholder ngày và người phân tích/thẩm tra có thể sai trên báo cáo chính thức.

Recommendation: tách theo delimiter giữa ngày và tên, ví dụ regex `\s+/\s+`, hoặc truyền ngày/tên thành hai field độc lập; thêm unit test cho `dd/MM/yyyy / name`.

#### GAS-005 - Có template Form Đơn cho TBVTV trong nước nhưng router không chọn nó — Remediated 2026-08-09

Evidence:

- `SOP_Configs.gs:275-276` có cả `tbvtv-trong-nuoc-gcmsms` và `tbvtv-trong-nuoc-gcmsms-don`.
- `LIMS_ReportGenerator.gs:128-140` chỉ switch template Form Đơn cho `lan-huu-co`, `chlor-huu-co`, `nhom-cuc`, `nhom-i`.

Impact: `tbvtv-trong-nuoc-gcmsms` với `printFormType=formDon` vẫn dùng template Form Check gốc rồi route vào engine Form Đơn, dễ tạo layout/nội dung sai.

Recommendation: đưa selection template vào config theo `formCheck/formDon` thay vì chuỗi `if` trong controller; thêm preflight assertion rằng Form Đơn phải có template tương ứng.

Remediation 2026-08-09: template routing đã dùng `CONFIG.TEMPLATE_VARIANTS` làm source of truth cho toàn bộ 5 SOP Type3B có cặp Form Check/Form Đơn (`lan-huu-co`, `chlor-huu-co`, `nhom-cuc`, `nhom-i`, `tbvtv-trong-nuoc-gcmsms`). `assertTemplateVariantConfiguration()` kiểm tra toàn bộ variant map trước khi resolve: cả `formCheck` và `formDon` phải có target key, target phải tồn tại trong `CONFIG.TEMPLATES`, template ID không được rỗng/placeholder. Regression khóa chính xác cả 5 cặp mapping, xác nhận từng form resolve đúng template và fail-fast với missing/dangling/placeholder target. SOP 9.14 (`tbvtv-thuc-pham-gcmsms`) vẫn giữ cơ chế riêng `formDayDu` / `formRutGon`; cả full và compact SOP ID đều được test là không đi qua generic Form Check/Form Đơn variants. `npm run test:gas` 52/52, `npx tsc --noEmit --pretty false` và `git diff --check` pass.

#### GAS-006 - QC thiếu dữ liệu bị tự động coi là `Đạt`

Evidence: `Report_Type3B.gs:403-420`, đặc biệt dòng 405:

```js
const val = allFields[fieldName] !== undefined ? allFields[fieldName] : true;
```

Impact: dữ liệu QC không được nhập có thể biến thành checkbox `Đạt`, tạo false positive trên hồ sơ kiểm nghiệm.

Recommendation: missing phải là `N/A`/unchecked hoặc fail report tùy business rule; tuyệt đối không default pass. Thêm validation bắt buộc cho các field QC trước khi generate.

#### GAS-007 - Auto-detection "Phát hiện" kiểm tra mọi field sample, dễ false positive

Evidence: `LIMS_ReportGenerator.gs:696-716`. Vòng `Object.entries(sample)` coi gần như mọi field non-empty không chứa `_nd` và khác `maSoMau` là "có kết quả". Các field cấu trúc như `loSo`, `khoiLuong`, `heSoPhaLoang`, `ghiChu` cũng thỏa điều kiện.

Impact: sample không có analyte phát hiện vẫn có thể bị đánh dấu `Phát hiện` chỉ vì có metadata mẫu.

Recommendation: chỉ tính trên allowlist result fields (`resultColumns`/canonical compound keys), hoặc nhận `checkCoMauPhatHien` đã được tính ở domain layer; thêm test mẫu chỉ có metadata nhưng không có kết quả.

#### GAS-008 - Phân trang Type 2/3A có thể bỏ mẫu còn lại nhưng vẫn tạo report thành công

Evidence: `Report_Type2_3A.gs:326-333` nếu `currentTableIdx >= tables.length` chỉ `Logger.log()` rồi `break`.

Impact: PDF có thể thiếu sample ở cuối mà caller vẫn nhận response thành công; đây là lỗi integrity nguy hiểm vì output trông hợp lệ.

Recommendation: throw nếu không đủ table/page; sau fill phải assert `sampleIdx === samples.length`; ghi số sample expected/filled vào log/result diagnostic.

#### GAS-009 - Guard nhận diện bảng sắc ký được tính nhưng không được dùng

Evidence: `Report_Type3B.gs:637-643` tính `isChromTable`, nhưng sau đó không có `if (!isChromTable) return;`; vòng xử lý bắt đầu từ dòng 646.

Impact: helper `_fillGenericChromatogramTable()` có thể scan/mutate bảng không phải sắc ký nếu bảng đó lọt qua header filter ban đầu và có text giống compound.

Recommendation: return ngay khi `isChromTable === false`; tốt hơn là nhận diện bằng marker/placeholder ổn định thay vì heuristic text.

#### GAS-020 - Giá trị số `0` có thể bị mất do fallback truthy/falsy

Evidence:

- `Report_Type3B.gs:1051` dùng `sample[compoundName] || sample.kq || 'ND'` để lấy kết quả; numeric `0` là falsy nên có thể bị đổi thành `ND`.
- `Report_Type3B.gs:971-972` dùng `(pt.hamLuong || '')` và `(pt.dienTich || pt.area || '')`, nên `0` có thể bị đổi thành chuỗi rỗng.
- `Report_Trifluralin.gs:88`, `Report_Dichlorvos.gs:47`, `Report_Chloroform.gs:46` đều dùng `pt.hamLuong || ''` khi ghi điểm đường chuẩn.
- `Report_Type3B.gs:1061` tiếp tục dùng `(kqVal || '')`, nên một `kqVal = 0` hợp lệ vẫn có thể bị xoá ở bước render.

Impact: kết quả định lượng, nồng độ, diện tích peak hoặc điểm đường chuẩn bằng `0` có thể bị biến thành `ND`/rỗng. Đây là lỗi integrity vì `0` mang ý nghĩa nghiệp vụ khác hoàn toàn với missing hoặc `ND`.

Recommendation: thay fallback `||` trên dữ liệu nghiệp vụ bằng kiểm tra `null`/`undefined` rõ ràng hoặc nullish coalescing ở lớp hỗ trợ phù hợp. Quy ước và test riêng cho `0`, `"0"`, `0.0`, `null`, `undefined`, `""`, `ND`, `N/A`; không tự đồng nhất các trạng thái này.

#### GAS-021 - Template drift có thể làm dữ liệu ghi nhầm cột thay vì fail-fast

Evidence: `Report_Type3B.gs:1015-1030` dò cột theo text header nhưng nếu không tìm thấy thì fallback cứng `maSoMauCol = 0`, `khoiLuongCol = 1`, `fCol = 2`, `loSoCol = 3`, `kqCol = 4`.

Impact: khi template bị đổi tên header, đổi thứ tự cột hoặc thay cấu trúc, code vẫn tiếp tục chạy và có thể ghi dữ liệu vào cột sai. Output vẫn có thể trông hợp lệ nên lỗi khó phát hiện bằng mắt hoặc chỉ qua `success: true`.

Recommendation: các cột bắt buộc phải được detect duy nhất và validate trước khi ghi dữ liệu; nếu thiếu/ambiguous thì throw với lỗi template contract. Không dùng fallback index cứng cho các trường nghiệp vụ bắt buộc.

Remediation 2026-08-09: `_fillFormDonTablesDynamically()` đã bỏ fallback index cứng cho bảng đường chuẩn và bảng kết quả Form Đơn. Các header bắt buộc được normalize + resolve duy nhất; thiếu, duplicate/ambiguous hoặc một cột match nhiều semantic sẽ throw lỗi template contract trước khi ghi dữ liệu. Nhánh calibration legacy/custom 6 dòng cũng đã bỏ fallback `vialCol`/`nongDoCol` theo index và dùng contract riêng đúng semantic thực tế (`Vial/Lọ số` + `Nồng độ` bắt buộc), không ép thêm `Điểm chuẩn` như contract Form Đơn. Detector bảng custom 6 dòng nay chỉ nhận candidate khi đồng thời có semantic `Vial/Lọ số` và `Nồng độ`, tránh chọn nhầm bảng 6 dòng chỉ vì có `Điểm chuẩn`, `Vial` hoặc text giống result table. `Area/Diện tích` và `Ghi chú` vẫn optional. Regression GAS 35/35, full `npm run test`, `tsc --noEmit` và `git diff --check` pass.

### P2 / Medium

#### GAS-010 - Form Đơn có thể in canonical ID nội bộ thay vì display name

Evidence:

- Frontend DATA_VERSION 2 dùng canonical ID (`src/app/features/results/config/sop-configs.ts:107-110`).
- Unified payload giữ canonical ID trong `compoundsToPrint` (`result-pdf-helper.ts:2118-2122`).
- `Report_Type3B.gs:58-79` chèn thẳng `compoundName.toUpperCase()` vào tiêu đề.

Ví dụ: `bhc_alpha_benzene_hexachloride` có thể được in thành `BHC_ALPHA_BENZENE_HEXACHLORIDE` thay vì tên hiển thị của chất.

Recommendation: resolve qua `metadata.targetInfo[canonicalId].displayName` hoặc `COMPOUND_TO_CANONICAL` reverse map có kiểm soát; canonical ID chỉ dùng cho lookup dữ liệu, không dùng làm UI text.

#### GAS-011 - Fallback assignment cho sample gộp quá permissive

Evidence: `Report_Type3B.gs:147-169`. Với mã gộp `A; B`, chỉ cần một sub-code không có mapping hoặc mapping rỗng là hàm `isTargetAssignedForGas()` `return true` ngay, bỏ qua restriction của sub-code còn lại.

Impact: compound không được chỉ định có thể xuất hiện trên phiếu gộp.

Recommendation: gom tất cả mapping explicit của sub-code trước; chỉ fallback "show all" khi không có bất kỳ sub-code nào có assignment data.

Remediation 2026-08-09: đã tách `isType3BTargetAssigned()` thành helper testable. Với mã gộp, missing/empty mapping của một sub-code chỉ bị bỏ qua; nếu bất kỳ sub-code nào có assignment explicit thì compound phải match ít nhất một assignment đó mới được hiển thị. Chỉ fallback "show all" khi không sub-code nào có assignment data. Regression bao phủ mixed explicit+empty, missing+explicit và all-empty; GAS 14/14, combined 21/21, `tsc --noEmit` và `git diff --check` pass.

#### GAS-012 - Drift config TBVTV trong nước: 126 `compounds` nhưng 121 `resultColumns`

Kết quả kiểm tra config cho `tbvtv-trong-nuoc-gcmsms`:

- `compounds.length = 126`
- `resultColumns.length = 121`
- 5 phần tử cuối là alias trùng canonical ID với phần tử đã tồn tại: `Pirimiphos methyl`, `lambda-Cyhalothrin`, `Edifenphos`, `Azinphos-methyl`, `Cypermethrins`.

Evidence: `SOP_Configs.gs:619-672`.

Impact: duplicate target, matching không ổn định, dễ lệch index nếu code khác còn dựa vào vị trí `compounds`/`resultColumns`.

Remediation 2026-08-09: đã loại 5 alias canonical duplicate khỏi cuối `tbvtv-trong-nuoc-gcmsms.compounds`; alias vẫn được giữ trong `COMPOUND_TO_CANONICAL` để tương thích tên hiển thị/đầu vào khác. Regression mới bắt buộc 121 display compounds = 121 `resultColumns`, canonical compounds không trùng, thứ tự canonical khớp `resultColumns` và đồng nhất với `ANGULAR_SOP_CONFIG` frontend. GAS 15/15, combined 22/22, `tsc --noEmit` và `git diff --check` pass.

Recommendation: canonical list phải unique; bỏ 5 alias cuối hoặc tách alias sang mapping display/legacy riêng. Thêm startup/test assertion unique canonical IDs và length parity.

#### GAS-013 - Thiếu schema validation cho payload trước khi chạm Docs/Drive

Evidence: `doPost` chỉ parse JSON và với `generate_pdf` chỉ kiểm tra `sopId` có template (`LIMS_ReportGenerator.gs:91-108`). Không validate `metadata`, `samples`, kiểu dữ liệu, số lượng sample, chiều dài text, `version`, action-specific fields.

Impact: lỗi runtime sâu trong DocumentApp/DriveApp, output partial, payload quá lớn hoặc dữ liệu sai shape khó debug.

Recommendation: viết validator theo action; fail-fast với error code ổn định; giới hạn số sample/compound/chuỗi/base64.

Remediation 2026-08-09: `validateMutationPayload()` đã dispatch validator theo action trước mutation. Riêng `generate_pdf`, `validateGeneratePdfPayload()` nay còn gọi `validateRequiredSignatureMetadata()` để đọc `signaturePlaceholders` của đúng SOP và bắt buộc metadata tương ứng là non-empty string; mapping placeholder rỗng/sai kiểu cũng fail-fast. Regression xác nhận thiếu `ngayNguoiPhanTich` hoặc để trống `ngayNguoiThamTra` bị reject trước mọi `DriveApp`/`DocumentApp`. `npm run test:gas` 50/50, `npx tsc --noEmit`, `npm run typecheck:api` và `git diff --check` pass; aggregate `npm run test` không được ghi nhận là pass vì bridge không thể poll session dài.

#### GAS-014 - Race condition khi tạo folder

Evidence: `LIMS_ReportGenerator.gs:375-404` dùng `getFoldersByName()` rồi `createFolder()` nhưng không có `LockService`.

Impact: hai request đồng thời có thể cùng không thấy folder và tạo folder trùng tên năm/tháng/SOP.

Recommendation: dùng `LockService` quanh đoạn get-or-create hoặc lưu folder ID ổn định trong Script Properties/config sau provisioning.

#### GAS-015 - Không rollback artifact khi generate lỗi giữa chừng

Evidence: controller/custom reporters copy Google Doc trước, sau đó mutate/export. Nếu lỗi ở giữa, không có cleanup transaction/compensation.

Impact: để lại Doc/PDF orphan hoặc report nửa hoàn chỉnh trên Drive.

Recommendation: bọc lifecycle bằng try/finally; chỉ đánh dấu output thành công sau khi validate hoàn tất; nếu fail thì trash/move artifact tạm hoặc ghi trạng thái `FAILED` vào folder staging.

#### GAS-016 - Nhiều `catch(e) {}` nuốt lỗi

Static scan thấy nhiều empty catch trong `Report_Type3B.gs`, `Report_Type2_3A.gs` và helper controller, ví dụ `Report_Type3B.gs:73`, `267`, `539`, `575`, `591`, `768`, `803`, `832`, `973`, `997`, `1063`.

Impact: lỗi format/replace/table mutation biến thành báo cáo "thành công" nhưng thiếu dữ liệu; khó trace root cause.

Recommendation: chỉ suppress lỗi thật sự optional; còn lại log structured context hoặc throw. Thêm post-generation validation các placeholder bắt buộc và số dòng đã điền.

#### GAS-017 - `update_frontend.js` không chạy được và hardcode path máy cũ — đã loại bỏ

Evidence:

- `node --check gas/update_frontend.js` fail tại dòng 12: `SyntaxError: Invalid or unexpected token`.
- `update_frontend.js:3` và `:45` hardcode `C:/Users/GCMS/Documents/GitHub/lims/...`, không khớp workspace hiện tại.

Impact: script maintenance không reproducible, có thể gây hiểu nhầm là tooling còn dùng được.

Remediation (2026-08-09): đã xóa `gas/update_frontend.js`. Search toàn repo không tìm thấy live reference ngoài checklist/review history; file là helper/migration cũ, lỗi cú pháp và hardcode `C:/Users/GCMS/Documents/GitHub/lims/...`. Sau khi xóa, toàn bộ 8 file `.gs`/`.js` còn lại trong `gas/` parse thành công bằng `vm.Script` trực tiếp trên UTF-8 source bytes.

#### GAS-022 - `generate_pdf` chưa có idempotency, retry có thể tạo artifact trùng — Source-level remediated 2026-08-09; runtime pending

Evidence:

- `src/app/core/services/report.service.ts:28-32` định nghĩa payload `generate_pdf` không có `requestId`; trong khi flow `upload_excel` có `requestId` ở `report.service.ts:138-150`.
- `LIMS_ReportGenerator.gs:171-192` mỗi lần gọi fallback engine đều `makeCopy()` template rồi `createFile()` PDF mới, không tra cứu request đã xử lý trước đó.

Impact: double-click, retry do timeout/mạng chập chờn hoặc caller gửi lại cùng nghiệp vụ có thể tạo nhiều Google Docs/PDF cho một report. Điều này làm tăng rác Drive và gây ambiguity khi audit đâu là bản chính thức.

Recommendation: thêm `requestId` cho `generate_pdf`, lưu trạng thái/kết quả theo idempotency key và trả lại artifact cũ khi retry cùng request. Nên áp dụng cùng nguyên tắc cho các mutation action khác như `archive_reports` khi phù hợp.

#### GAS-023 - Chưa có template contract/preflight machine-checkable trước khi mutate/export — Source-level remediated 2026-08-09; production-template runtime pending

Evidence:

- Static scan trong `gas/` không thấy bước preflight tập trung để kiểm tra template trước khi điền dữ liệu.
- Các reporter hiện chủ yếu tìm bảng/placeholder trong lúc mutate; ví dụ `Report_Type3B.gs:1015-1030` còn fallback index khi không dò thấy header bắt buộc.
- `LIMS_ReportGenerator.gs:171-192` copy template, mutate và export PDF trong cùng lifecycle; không có contract gate độc lập trước bước ghi dữ liệu.

Impact: template Google Docs là dependency ngoài repo. Một chỉnh sửa thủ công trên template có thể làm thiếu placeholder, lệch table/header hoặc sai Form Check/Form Đơn mà chỉ phát hiện khi report production đã được tạo, thậm chí có trường hợp không fail rõ ràng.

Recommendation: định nghĩa contract theo từng template và chạy preflight trước mutation/export: marker/placeholder bắt buộc, số lượng bảng tối thiểu/kỳ vọng, header/cột bắt buộc, đúng loại Form Check/Form Đơn, signature placeholders và các invariant layout có thể kiểm tra ổn định. Fail ngay nếu contract không đạt; giữ smoke test sandbox nhưng tự động hoá phần contract có thể kiểm chứng bằng code.

### P3 / Low

#### GAS-018 - `append.js` là bản sao legacy của function đang có trong `Report_Type3B.gs`

Evidence ban đầu: cả hai đều định nghĩa `_fillFormDonTablesDynamically`; `append.js` là phiên bản cũ hơn, khác behavior (`KPH`/`ND`, matching ASCII-only, v.v.). Remediation 2026-08-09 đã xóa `gas/append.js`; repo hiện chỉ còn implementation trong `Report_Type3B.gs`.

Impact: source of truth không rõ; nếu copy/deploy nhầm có thể ghi đè logic mới hoặc tái sinh bug đã sửa.

Recommendation: xóa/chuyển vào legacy với README rõ ràng; không để hai implementation cùng tên cạnh production source.

#### GAS-019 - Deployment/config khó tái lập và có hidden config — Partially remediated 2026-08-09

Evidence:

- `gas/appsscript.json` hiện pin `Asia/Ho_Chi_Minh`, V8 runtime, Stackdriver exception logging, scopes Docs/Drive/external request, allowlist cho Firebase Identity Toolkit + Firestore, và Web App policy `ANYONE_ANONYMOUS` + `USER_DEPLOYING` để runtime/scopes/access policy có thể review bằng Git.
- Regression `Apps Script manifest pins runtime, scopes, URL allowlist, and web-app execution policy` xác nhận manifest và các host external request mà source GAS đang sử dụng.
- Không có `.clasp.json`/script ID trong repo; không tự tạo giá trị deployment/project ID khi chưa có nguồn cấu hình môi trường được xác nhận.
- `SOP_Configs.gs` vẫn chứa root/template Drive IDs của môi trường hiện tại. Template variant routing đã được gom vào `CONFIG.TEMPLATE_VARIANTS`, nhưng environment-specific Drive IDs vẫn chưa tách khỏi source.

Impact còn lại: runtime/scopes/Web App policy nay đã audit được bằng Git, nhưng actual deployed project vẫn có thể drift khỏi manifest nếu quy trình deploy không đồng bộ; root/template Drive IDs vẫn là environment-specific config nằm trong source.

Recommendation còn lại: giữ `appsscript.json` là source of truth cho manifest; khi có project/deployment identity đã được xác nhận thì bổ sung deployment tooling phù hợp thay vì suy đoán ID. Cân nhắc chuyển root/template IDs sang Script Properties hoặc một config theo môi trường có validation/preflight rõ ràng, và kiểm tra deployed manifest/access thực tế trong smoke test sandbox.

## 4. Checklist remediation

### P0 - Chặn rủi ro bảo mật trước

- [x] Không cho browser gọi trực tiếp mutation endpoint `Anyone + Execute as Me` mà không có server-side authentication/authorization. (2026-08-09: GAS bắt buộc Firebase ID token, verify account + Firestore profile/role/permissions trước dispatch; pin server-side namespace `lims-cloud-fixed`, reject app ID khác trước network fetch. GAS 35/35, `tsc --noEmit`, build và `git diff --check` pass.)
- [x] N/A — chống replay kiểu `timestamp` + `nonce` chỉ áp dụng nếu dùng request signing. Luồng mutation hiện không dùng chữ ký request: frontend lấy Firebase ID token bằng `AuthService.getIdToken()`, gửi `idToken` + `appId`, và GAS xác thực token/account/profile/permission server-side trước dispatch. Replay của các mutation tạo artifact được kiểm soát riêng bằng `requestId` + idempotency storage/fingerprint ở `generate_pdf` và `upload_excel`, nên không thêm một cơ chế signing/nonce không được sử dụng.
- [x] Tách/giới hạn action public; `doGet` health có thể public, mutation không nên public tương đương. (2026-08-09: `doGet` chỉ health; cả 3 mutation route đều đi qua `authenticateAndAuthorizeMutation()` trước mutation handler.)
- [x] `archive_reports`: verify file thuộc cây `CONFIG.ROOT_FOLDER_ID` trước khi rename/move. (2026-08-09: đã thêm kiểm tra ancestry về LIMS root trước mọi rename/move; regression GAS 27/27 pass.)
- [x] `archive_reports`: verify report/batch ownership/authorization, không nhận arbitrary Drive URL như authority. (2026-08-09: yêu cầu auth/permission và `assertArchiveFilesBelongToRequest()` đối chiếu file với Firestore request/history cùng `requestId`; regression ownership guard pass.)
- [x] `upload_excel`: max size, extension/MIME validation, SOP allowlist, rate/quota guard. (2026-08-09: max decoded 20 MiB; `.xlsx`/`.xls` allowlist + MIME + magic-byte validation; filename/path validation; SOP validation trước Drive mutation; rate limit 30 upload mới/10 phút/script, idempotent replay không tiêu quota. GAS regression 30/30, combined 37/37, `tsc --noEmit` và `git diff --check` pass trước checklist edit.)
- [x] `upload_excel`: dùng `requestId` làm idempotency key và trả lại kết quả cũ khi retry. (2026-08-09: Script Properties + ScriptLock lưu claim/result theo SHA-256 fingerprint của SOP + filename + file content; retry cùng payload replay file cũ, cùng key khác payload bị reject; lỗi Drive/finalization cleanup claim và rollback file để retry sạch. GAS regression 30/30, combined 37/37, `tsc --noEmit` và `git diff --check` pass trước checklist edit.)
- [x] Viết security regression test: request không auth phải bị reject cho cả 3 mutation action. (2026-08-09: regression bao phủ missing auth cho `generate_pdf`, `archive_reports`, `upload_excel`; thêm invalid token, inactive/underprivileged profile, authorized staff, namespace mismatch và log không lộ raw token. GAS 35/35.)

### P1 - Bảo toàn tính đúng của báo cáo

- [x] Sửa parser Trifluralin để giữ nguyên `dd/MM/yyyy` và tách đúng tên người.
- [x] Thêm test cho `20/05/2026 / Ong Thanh Dat` và tên có dấu `/`/khoảng trắng edge case nếu nghiệp vụ cho phép.
- [x] Router phải chọn `tbvtv-trong-nuoc-gcmsms-don` khi `printFormType=formDon`. (2026-08-09: regression khóa đủ 5 cặp Form Check/Form Đơn và xác nhận resolver chọn đúng template ID cho từng form; GAS 52/52.)
- [x] Chuyển template routing sang config `{ formCheck, formDon }`, bỏ hardcoded fallback rải rác. (2026-08-09: `CONFIG.TEMPLATE_VARIANTS` là source of truth; validator fail-fast khi thiếu key, dangling target hoặc template ID rỗng/placeholder; SOP 9.14 được regression bảo vệ khỏi generic variant routing.)
- [x] Router custom SOP phải gọi đúng reporter chuyên biệt và không được silently fallback sang generic renderer. (2026-08-09: regression chạy `generateReportCore()` cho đủ 5 custom SOP: `trifluralin-gcms` → `generateCustomReport_trifluralin_gcms`, `fipronil-chlorpyrifos` → `generateCustomReport_fipronil_chlorpyrifos`, `tbvtv-thuc-pham-gcmsms-rut-gon` → `generateCustomReport_tbvtv_thuc_pham_gcmsms_rut_gon`, `dichlorvos-gcms` → `generateCustomReport_dichlorvos_gcms`, `chloroform-gcms` → `generateCustomReport_chloroform_gcms`; generic `generateReportFromTemplate()` được stub để throw nếu bị gọi và regression xác nhận fallback = 0. Checkpoint hiện tại: `npm run test:gas` 64/64 và full `npm test` exit 0.)
- [x] QC missing không được default `true`; chọn rõ policy `N/A`, unchecked hoặc fail validation.
- [x] Sửa auto-detection chỉ đọc result fields/analyte fields, không đọc metadata sample.
- [x] `_fillGenericChromatogramTable`: thêm `if (!isChromTable) return;` và test bảng QC/result không bị mutate.
- [x] `fillSampleTable`: throw khi không đủ page/table; assert `sampleIdx === samples.length` trước khi export.
- [x] Form Đơn: render `displayName`, không render canonical ID có `_` lên report.
- [x] Thay các fallback `||` trên dữ liệu nghiệp vụ bằng kiểm tra `null`/`undefined` có chủ đích; numeric `0` không được biến thành `ND`/rỗng. (2026-08-09: đã audit và sửa các result/calibration/R2/LOD/LOQ path ở frontend + GAS; regression combined 17/17 và `tsc --noEmit` pass. Các default nghiệp vụ đã xác nhận như khối lượng `10.0` và hệ số pha loãng `1` giữ nguyên.)
- [ ] Thêm regression test chứng minh `0`, `"0"`, `0.0`, missing, `ND`, `N/A` và empty string được giữ phân biệt xuyên suốt payload → GAS → Doc/PDF.
  - 2026-08-09: regression hiện khóa `0`, `"0"`, `0.0`, `ND`, `N/A` và explicit empty string ở Form Đơn, đồng thời khóa `normalizeCellText()` để numeric zero không thành blank. Checkpoint baseline đã chốt ở `npm run test:gas` 59/59; suite hiện là 64/64 sau khi bổ sung các contract test custom template. Item vẫn mở vì `resolveFormDonResultValue()` hiện coi trường hợp không có giá trị ở mọi nguồn là fallback `ND`; như vậy `missing` chưa có semantics riêng biệt với `ND`, và chưa có Drive/Docs smoke test thật để chứng minh toàn tuyến payload → rendered Doc/PDF.
- [x] Type3B phải fail nếu không dò được duy nhất các header/cột bắt buộc; không fallback sang index cứng. (2026-08-09: đã thêm header contract cho calibration/result Form Đơn và calibration legacy/custom; thiếu hoặc duplicate/ambiguous header bắt buộc sẽ throw. Contract legacy/custom chỉ yêu cầu `Vial/Lọ số` + `Nồng độ`; detector bảng 6 dòng cũng yêu cầu đủ hai semantic này trước khi chọn candidate để tránh false-positive. `Area/Diện tích` và `Ghi chú` của Form Đơn giữ optional. GAS regression 35/35, full `npm run test`, `tsc --noEmit` và `git diff --check` pass.)
- [x] Thêm post-generation validation: không còn placeholder bắt buộc, đủ số sample, đủ compound được chỉ định. (2026-08-09: `assertPostGenerationReportComplete()` kiểm tra Type2/3A đủ sample và đúng logical page theo `samplesPerLogicalPage`; Type3B Form Check đủ page theo sample; Form Đơn khớp đúng thứ tự/số compound, mỗi compound có đúng 1 result table và đủ result row. Placeholder validation chỉ áp dụng allowlist `requiredPlaceholders` + `signaturePlaceholders`, không quét nhầm placeholder optional. Bốn custom Type2 reporter đều validate sau render nhưng trước `saveAndClose()`/PDF export để lỗi còn rollback được. Full `npm run test` pass, GAS 42/42, `npx tsc --noEmit` và `git diff --check` pass.)

### P2 - Ổn định vận hành và cấu hình

- [x] Sửa `isTargetAssignedForGas()` cho mã sample gộp, không `return true` chỉ vì một sub-code thiếu mapping. (2026-08-09: `isType3BTargetAssigned()` chỉ fallback show-all khi không sub-code nào có assignment explicit; GAS 14/14, combined 21/21, `tsc --noEmit` và `git diff --check` pass.)
- [x] Loại 5 canonical duplicate cuối của `tbvtv-trong-nuoc-gcmsms.compounds` hoặc đưa alias sang map riêng. (2026-08-09: đã loại khỏi `compounds`; alias vẫn nằm trong `COMPOUND_TO_CANONICAL`.)
- [x] Thêm test/assertion: `resultColumns.length === uniqueCanonicalCompounds.length` cho SOP dùng cả hai list. (2026-08-09: regression còn kiểm tra thứ tự canonical khớp `resultColumns` và frontend; GAS 15/15, combined 22/22.)
- [x] Thêm validator payload theo action trước mọi gọi Drive/Docs. (2026-08-09: `validateMutationPayload()` dispatch validator riêng cho `generate_pdf`, `archive_reports`, `upload_excel`; kiểm tra SOP đã cấu hình, kiểu `metadata`/`samples`, `version` dương nếu có, URL archive resolve được Drive ID, và các field upload bắt buộc. `generate_pdf` còn validate các metadata bắt buộc được cấu hình qua `signaturePlaceholders`; thiếu/trống ngày người phân tích hoặc người thẩm tra bị reject trước `DriveApp`/`DocumentApp`, không hardcode tên field ở validator generic. Các action entry-point trực tiếp cũng validate lại trước khi chạm Drive/Docs; helper diagnostic `runAndLog()` đã truyền tiếp `payload.version`. GAS regression 50/50, `npx tsc --noEmit`, `npm run typecheck:api` và `git diff --check` pass.)
- [x] Bọc get-or-create folder bằng `LockService` hoặc dùng folder IDs provision sẵn. (2026-08-09: thêm `withScriptLock()` dùng `LockService.getScriptLock().waitLock(30000)` + `finally releaseLock()`; khóa toàn bộ chuỗi year/month/SOP trong `getOrCreateFolder()` và cả `Bản_Hủy_Archived`, nhưng không giữ lock trong lúc mutate/export report hoặc rename/move file. Regression kiểm tra lookup/create chỉ chạy khi đang giữ lock, không tạo lại folder đã có, và lock luôn release khi Drive lookup throw. GAS regression 18/18, combined regression 25/25, `tsc --noEmit` và `git diff --check` pass.)
- [x] Có cơ chế cleanup/rollback Doc/PDF khi generate thất bại. (2026-08-09: `generateReport()` nay chạy trong `withGeneratedArtifactRollback()`; mọi Doc copy/PDF của fallback engine và 4 custom reporter đều được register ngay khi tạo, rollback `setTrashed(true)` theo thứ tự ngược nếu mutate/export/naming throw, và lỗi cleanup không che mất lỗi generation gốc. `upload_excel` không nằm trong transaction này. Regression bao phủ success/no-cleanup, rollback Doc+PDF, lỗi `setName()` sau create, và cleanup failure. GAS regression 21/21, combined regression 28/28, `tsc --noEmit` và `git diff --check` pass.)
- [x] Thay empty catch bằng structured logging/throw theo mức criticality. (2026-08-09: đã audit catch trong `LIMS_ReportGenerator.gs`, `Report_Type2_3A.gs`, `Report_Type3B.gs`; mutation bắt buộc như checkbox/header/metadata/calibration/result/QC log marker `required-*` rồi throw để kích hoạt rollback, còn format/pagination/cleanup/normalize optional log marker `optional-*` và tiếp tục. Empty-catch scan toàn bộ `gas/*.gs` không còn match. Regression mới chứng minh lỗi mutation Type3B bắt buộc propagate vào `withGeneratedArtifactRollback()` và cleanup optional không abort. GAS regression 23/23, combined regression 30/30, `tsc --noEmit` và `git diff --check` pass.)
- [x] Log có `requestId`, `action`, `sopId`, batch/report ID để trace một request xuyên suốt. (2026-08-09: thêm request trace context dạng JSON cho `doPost` và các stage generate/upload/archive; giữ `requestId` caller nếu có, nếu chưa có thì tạo UUID server-side chỉ để correlation, log cùng `action`/`sopId`/`batchId` và bổ sung `reportId`/artifact ID khi tạo xong. Response success/error trả lại `requestId` để đối chiếu log. Regression chứng minh cùng ID đi qua received/validated/dispatch/success/error và giữ client request ID ở error path. GAS regression 24/24, combined regression 31/31, `tsc --noEmit` và `git diff --check` pass.)
- [x] Thêm `requestId` + idempotency storage cho `generate_pdf`; retry cùng request phải reuse/trả lại cùng artifact thay vì tạo Doc/PDF mới. (2026-08-09: `GenerateReportPayload` bắt buộc có `requestId`; `publishReport()` tạo key ổn định theo batch request + version + report scope. GAS dùng Script Properties + ScriptLock để claim request, SHA-256 fingerprint payload, chặn duplicate đang chạy, reject cùng key với payload khác, lưu kết quả hoàn tất trong retention 7 ngày và replay đúng `docId`/`pdfId` mà không chạy generator lần hai. Claim được xóa khi generation fail để retry hợp lệ; idempotency finalization nằm trong rollback scope nên lỗi lưu state vẫn rollback artifact mới. GAS regression 25/25, combined regression 32/32, `tsc --noEmit` và `git diff --check` pass.)
- [ ] Định nghĩa template contract machine-checkable cho từng Google Docs template và chạy preflight trước mutation/export.
  - 2026-08-09: đã có `preflightReportTemplateContract()` chạy ngay sau resolve template và trước `getOrCreateFolder()`/`makeCopy()`/PDF export. Preflight kiểm tra required/signature placeholders; Type2/3A kiểm tra `sampleTableIndex`, `headerRows`, configured column indexes và table width; Type3B Form Đơn yêu cầu đúng 1 calibration table + đúng 1 result table và resolve semantic headers bắt buộc. Type3B Form Check còn bắt buộc từng compound có đúng segment chứa một ô kết quả mà renderer thực sự mutate được: checkbox ND mutable và placeholder số dạng dấu chấm/ellipsis phải nằm trong cùng ô mục tiêu. Custom Type2 contract nay khóa thêm các invariant mà reporter thực sự dựa vào: Trifluralin phải có đúng 1 bảng calibration writable với marker `R2`/`R²`; Fipronil/Chlorpyrifos và bản rút gọn phải có đúng 1 bảng calibration 6 dòng đúng marker, đúng 1 bảng QC, đủ từng QC row đã cấu hình và ô đánh giá phải còn đủ marker checkbox `Đạt`/`Không đạt`/`N/A`. Regression chặn missing/ambiguous calibration, thiếu QC table/row và marker checkbox không còn writable trước khi tạo folder hoặc chạm Drive mutation. Baseline trước nhóm test này là 59/59; sau 5 custom preflight regression mới, `npm run test:gas` pass 64/64. Item vẫn mở vì toàn bộ template production thật chưa được chạy qua Drive sandbox để chứng minh contract trên tài liệu thực tế.
- [ ] Thêm smoke test tối thiểu cho từng SOP với template thật trong Drive sandbox.
- [x] Thêm test max samples/page và test multi-page để phát hiện report bị truncate. (2026-08-09: ngoài regression `buildSamplePaginationPlan()` cho exact-capacity/overflow/multi-page, đã thêm harness in-memory chạy trực tiếp `generateType2_3aReport()`: 11 mẫu với capacity 5 mẫu/trang render thành đúng 3 logical pages, từng mã mẫu xuất hiện đúng 1 lần và đúng thứ tự, nhãn trang đúng `Trang: 1/3`, `Trang: 2/3`, `Trang: 3/3`. Trường hợp template không append được các bảng clone cần thiết phải throw `Số lượng mẫu vượt quá dung lượng tối đa của template`, không trả report bị truncate. Checkpoint hiện tại: `npm run test:gas` 64/64, `npx tsc --noEmit --pretty false`, `git diff --check` và full `npm test` đều pass.)

### P3 - Cleanup kỹ thuật

- [x] Sửa hoặc loại bỏ `gas/update_frontend.js`; không để script syntax error trong thư mục GAS. (2026-08-09: đã xóa helper/migration cũ; không còn live reference; 8/8 file GAS/JS còn lại parse thành công bằng `vm.Script`.)
- [x] Loại bỏ/di chuyển `gas/append.js` legacy để chỉ còn một `_fillFormDonTablesDynamically` source of truth. (2026-08-09: đã xóa file; GAS regression 10/10, combined regression 16/16, `tsc --noEmit` và `git diff --check` đều pass.)
- [x] Refactor `Report_Dichlorvos.gs` và `Report_Chloroform.gs` vì gần như cùng implementation, chỉ khác config/log prefix. (2026-08-09: hai entry-point giữ nguyên nhưng delegate vào `generateCustomSingleAnalyteType2Report()` dùng chung trong `Report_Type2_3A.gs`; regression kiểm tra đúng SOP identity/log prefix và shared path vẫn validate completeness trước save/export. GAS regression 43/43, `tsc --noEmit`, `git diff --check` và syntax scan 8/8 đều pass.)
- [x] Gom boilerplate copy template → save → export PDF → build response vào một helper có error handling thống nhất. (2026-08-09: `generateReportFromTemplate()` trong `LIMS_ReportGenerator.gs` nay là lifecycle chung: copy Doc → render → post-generation validation → `saveAndClose()` → export PDF → đặt tên/build response; Doc/PDF được register vào rollback ngay khi tạo để lỗi render/validation/export/naming đều cleanup artifact mà vẫn giữ lỗi gốc. Trifluralin, Fipronil/Chlorpyrifos và Type2/3A đều delegate vào helper; Dichlorvos/Chloroform đi qua shared Type2 wrapper. Source audit xác nhận `makeCopy()`, `saveAndClose()` và `getAs('application/pdf')` của report chỉ còn trong lifecycle chung. Regression `npm run test:gas` 45/45, `npx tsc --noEmit` và `git diff --check` đều pass.)
- [x] Gom toàn bộ template ID vào một cấu trúc config; không hardcode fallback trong controller.
- [x] Version-control Apps Script manifest/deploy config để audit runtime/scopes/access. (2026-08-09: thêm `gas/appsscript.json` pin timezone, V8 runtime, exception logging, Docs/Drive/external-request scopes, Firebase/Firestore URL allowlist và `webapp.access = ANYONE_ANONYMOUS`, `webapp.executeAs = USER_DEPLOYING`; regression GAS khóa các field này. Không tạo `.clasp.json`/script ID giả khi chưa có environment value được xác nhận.)

## 5. Tiêu chí hoàn thành trước khi đóng checklist

- [x] Tất cả mutation request không hợp lệ/không auth bị reject trước khi chạm Drive/Docs. (2026-08-09: action validators chạy trước Drive/Docs; security regression chứng minh thiếu auth cả 3 mutation bị reject trước handler, invalid token/role/app namespace bị reject trước mutation. `generate_pdf` còn reject metadata chữ ký thiếu/trống theo `signaturePlaceholders` trước mọi Drive/Docs call. GAS 50/50.)
- [x] Không thể archive một file nằm ngoài root LIMS dù biết file ID/URL. (2026-08-09: regression xác nhận file ngoài root bị chặn trước rename/move; file trong root vẫn archive bình thường.)
- [x] Retry upload cùng `requestId` không tạo file thứ hai. (2026-08-09: regression gọi lại cùng request/payload và xác nhận replay file đầu tiên; generator Drive chỉ tạo 1 file, payload khác dưới cùng request ID bị reject.)
- [x] Mọi SOP Form Check/Form Đơn dùng đúng template đã khai báo. (2026-08-09: regression khóa toàn bộ 5 mapping pairs trong `CONFIG.TEMPLATE_VARIANTS`, resolve cả `formCheck`/`formDon` về đúng `CONFIG.TEMPLATES` target và fail-fast nếu cấu hình variant thiếu/dangling/placeholder. SOP 9.14 full/rút gọn được xác nhận nằm ngoài generic variant map. GAS 52/52, `npx tsc --noEmit --pretty false`, `git diff --check` pass.)
- [x] Test chứng minh QC missing không tự thành `Đạt`.
- [x] Test chứng minh sample chỉ có metadata không tự thành `Phát hiện`.
- [x] Test chứng minh report nhiều trang chứa đủ 100% sample input hoặc fail toàn bộ. (2026-08-09: regression không chỉ test pagination-plan helper mà chạy trực tiếp renderer `generateType2_3aReport()` trên mock DocumentApp/body có hành vi table/page thực tế cần cho renderer. Case 11 mẫu/5 mẫu mỗi trang chứng minh đủ 11/11 mẫu, không duplicate, đúng thứ tự trên 3 trang và đúng page labels; case không thể clone/append bảng bắt buộc chứng minh renderer fail toàn bộ bằng lỗi capacity thay vì silently truncate. Checkpoint hiện tại: `npm run test:gas` 64/64 và full `npm test` exit 0. Smoke test trên Google Docs template thật vẫn được theo dõi riêng ở mục Drive sandbox bên dưới.)
- [x] Test chứng minh bảng không phải sắc ký không bị helper chromatogram sửa.
- [x] Test chứng minh kết quả numeric `0` được render là `0`, không bao giờ tự thành `ND` hoặc blank.
- [ ] `0`, missing, `ND`, `N/A` và empty string giữ ý nghĩa riêng biệt end-to-end.
  - 2026-08-09: code/test đã chứng minh `0`, `"0"`, `0.0`, `ND`, `N/A` và explicit empty string không bị truthy/falsy fallback làm mất; riêng `missing` ở Form Đơn hiện vẫn fallback về `ND`. Cần quyết định policy nghiệp vụ cho missing (ví dụ fail, blank riêng, hoặc một trạng thái khác) trước khi có thể check tiêu chí này mà không tự suy diễn nghiệp vụ.
- [x] Template thiếu/đổi tên/đổi thứ tự cột bắt buộc phải làm generation fail, không được silently fallback sang cột theo index. (2026-08-09: regression xác nhận header đảo thứ tự vẫn resolve đúng; thiếu/duplicate bắt buộc fail-fast.)
- [x] Canonical ID chỉ dùng cho lookup; report hiển thị tên chất thân thiện/đúng biểu mẫu.
- [x] Không còn canonical duplicate trong config target list. (2026-08-09: 5 canonical duplicate đã bỏ khỏi `tbvtv-trong-nuoc-gcmsms.compounds`; regression xác nhận canonicalized compounds khớp `resultColumns`.)
- [x] Retry `generate_pdf` với cùng `requestId` không tạo artifact thứ hai và trả/reuse đúng artifact đã tạo trước đó. (2026-08-09: regression gọi cùng request/payload hai lần, generator chỉ chạy 1 lần và lần hai trả lại cùng `docId`/`pdfId` với `idempotentReplay: true`; payload thay đổi dưới cùng request ID bị reject.)
- [ ] Mọi template production pass machine-checkable contract/preflight trước deploy và trước khi generation chạm dữ liệu nghiệp vụ.
  - 2026-08-09: preflight source-level đã bao phủ required/signature placeholders, Type2/3A table shape, Type3B Form Đơn semantic headers, Type3B Form Check per-compound writable result segment và invariant custom-specific của Trifluralin + Fipronil/Chlorpyrifos. Trifluralin yêu cầu duy nhất một bảng calibration writable có marker `R2`/`R²`; Fipronil-style yêu cầu duy nhất một bảng calibration hợp lệ, bảng QC hợp lệ, đủ các QC row cấu hình và đủ marker checkbox writable `Đạt`/`Không đạt`/`N/A`. Form Check contract được khóa theo đúng mutation primitive của renderer, không chỉ theo textual presence của `ND`; regression reject ô không có checkbox mutable hoặc checkbox/result placeholder bị tách ô. `npm run test:gas` hiện pass 64/64. Tiêu chí vẫn mở chỉ vì chưa chạy tất cả template production thật trong Drive sandbox và chưa lưu evidence runtime trước deploy.
- [x] Không còn script syntax error trong `gas/`. (2026-08-09: 8/8 file `.gs`/`.js` còn lại parse thành công bằng `vm.Script` trên UTF-8 source bytes.)
- [x] Không còn empty catch ở các đường ghi dữ liệu quan trọng. (2026-08-09: audit `gas/*.gs` không còn empty catch; required mutation errors log rồi throw để rollback, optional cleanup/format errors log và tiếp tục; regression bao phủ cả hai nhánh.)
- [ ] Có smoke test template sandbox cho từng SOP và lưu kết quả test trước deploy production.

## 6. Đối chiếu nghiệp vụ trước/sau tái cấu trúc (2026-08-09)

Phạm vi đối chiếu: “trước” là source tại `HEAD` trước nhóm thay đổi tái cấu trúc hiện có trong working tree; “sau” là source hiện tại sau tái cấu trúc, đối chiếu thêm payload/config frontend và regression test. Kết luận “không mất” dưới đây chỉ áp dụng cho đường nghiệp vụ đã có bằng chứng source-level/test-level; không suy diễn rằng mọi Google Docs template hoặc deployment đang chạy ngoài repo đều giống source hiện tại.

### Kết luận

- [x] Chưa phát hiện nghiệp vụ hợp lệ nào bị mất ở các luồng đã kiểm chứng: chọn template, route custom reporter, lọc/assignment sample, các giá trị `0`/`ND`/`N/A`/empty đã có, default đã được xác nhận, QC, pagination và lifecycle tạo Doc/PDF.
- [ ] Chưa thể đóng tuyệt đối kết luận “không mất nghiệp vụ” cho runtime production. Còn thiếu smoke test trên Google Docs/Drive thật và golden output cho từng SOP; các mục này vẫn mở ở Section 5.
- [ ] Còn một điểm semantics cần business chốt: khi không có giá trị ở mọi nguồn, Form Đơn hiện fallback `missing → ND` trong `resolveFormDonResultValue()`. Vì nguyên tắc review là `Missing ≠ ND`, đây là rủi ro cần quyết định policy, chưa đủ bằng chứng để gọi là mất nghiệp vụ hay đánh dấu hoàn tất.

| Luồng nghiệp vụ | Trước tái cấu trúc | Sau tái cấu trúc | Đánh giá bảo toàn |
| --- | --- | --- | --- |
| Chọn template theo SOP/Form | Controller dùng nhánh hardcode cho các cặp Form Check/Form Đơn; TBVTV trong nước có nguy cơ dùng nhầm template Form Check. | `CONFIG.TEMPLATE_VARIANTS` là source of truth cho 5 cặp; SOP 9.14 full/rút gọn vẫn đi nhánh riêng. | **Không mất; đã sửa lỗi route.** Regression khóa đủ mapping và variant fail-fast. |
| Custom reporter và lifecycle | Nhiều entry-point lặp copy → render → export; một số reporter có đường xử lý riêng. | Router vẫn giữ đúng 5 custom SOP; Type2 Dichlorvos/Chloroform dùng helper chung; lifecycle chung có preflight, post-validation và rollback. | **Không mất ở source-level.** Tên SOP, log prefix, bảng calibration/QC và các custom path được giữ; cần golden Doc/PDF thật để xác nhận layout cuối. |
| Lọc sample, assignment, chunk/pagination | Có nguy cơ bỏ sample khi thiếu page/table hoặc chọn sai target trong sample gộp. | Giữ selection/filter/chunk ở frontend, assignment-aware ở Type3B, pagination fail-fast và post-generation kiểm đủ sample. | **Không mất; tính toàn vẹn được siết thêm.** Regression renderer nhiều trang xác nhận 11/11 sample và fail toàn bộ khi không clone được page bắt buộc. |
| Giá trị kết quả | Nhiều path dùng truthy/falsy nên `0` có thể thành blank/ND; một số Form Đơn coerce N/A/empty về ND. | Dùng kiểm tra `null`/`undefined` có chủ đích; giữ `0`, `0.0`, chuỗi `"0"`, `ND`, `N/A`, empty ở các path đã test. | **Không mất; semantics được bảo toàn tốt hơn.** Riêng `missing` vẫn fallback `ND`, đang mở policy ở trên. |
| QC thiếu dữ liệu | QC thiếu field có thể bị default thành `Đạt`. | QC thiếu được biểu diễn `N/A`/không pass thay vì tự động pass. | **Không mất nghiệp vụ hợp lệ; loại bỏ false positive.** Đây là thay đổi integrity có chủ đích. |
| Default biểu mẫu | Các default đang dùng trong report flow. | Vẫn giữ `10.0`, `1`, `Thuỷ sản`/`Thủy sản`, `Bình thường` theo business confirmation. | **Không mất.** Không tính các default đã xác nhận là finding. |
| TBVTV trong nước: compound/alias | GAS có 126 tên hiển thị nhưng `resultColumns` có 121; 5 tên cuối là alias/canonical duplicate. | Danh sách hiển thị GAS còn 121 canonical compound; 5 alias vẫn nằm trong `COMPOUND_TO_CANONICAL`; parity với frontend canonical config đã được test. | **Không thấy mất trên current frontend canonical path.** Còn rủi ro có điều kiện nếu template Drive legacy chứa 5 row alias riêng; cần smoke test template thật. |
| Template lỗi/thiếu cấu trúc | Một số helper chỉ log/cut/tiếp tục, có thể trả report thiếu nhưng vẫn thành công. | Preflight semantic contract, required mutation throw, post-validation và rollback trước khi trả thành công. | **Không mất ở template hợp lệ; hành vi với template hỏng đổi thành fail-fast có chủ đích.** Đây là bảo toàn tính đúng, không phải mất output hợp lệ. |
| Frontend → GAS mutation | Payload chưa có đầy đủ auth envelope/idempotency/ownership guard. | Thêm auth/authorization, `requestId`, fingerprint/idempotency và archive ownership guard. | **Không mất contract nghiệp vụ đã gọi; thay đổi là additive security/availability.** Retry hợp lệ được replay thay vì tạo artifact trùng. |

### Các điểm cần giữ nguyên khi tiếp tục chỉnh sửa

- Không đổi `missing` thành `ND` hoặc ngược lại chỉ để làm test pass; cần business policy cho Form Đơn trước.
- Không đưa 5 alias TBVTV trở lại danh sách hiển thị chỉ vì so sánh số lượng với source cũ; trước hết phải xác nhận các row đó còn tồn tại và còn cần xuất trên template thật.
- Không nới lại fallback theo index, nuốt lỗi mutation, hoặc tiếp tục sau khi thiếu page/table bắt buộc; các thay đổi đó từng cho phép report “thành công” nhưng thiếu dữ liệu.
- Khi chỉnh template hoặc reporter custom, phải chạy lại `npm run test:gas`, full `npm test`, typecheck/build và smoke test Drive sandbox tương ứng trước khi check mục nghiệp vụ.

## 7. Ghi chú review

Review này là static review trên source hiện có trong repo và đối chiếu payload frontend. Các giá trị khởi tạo mặc định như `10.0`, `1`, `Thuỷ sản`, `Bình thường` đã được xác nhận là rule nghiệp vụ riêng của hệ thống nên không được tính là finding. Manifest mong muốn cho Apps Script hiện đã được version-control trong `gas/appsscript.json`; tuy vậy project/deployment thực tế vẫn cần được kiểm tra để xác nhận không drift khỏi manifest. Các template Google Docs là dependency bên ngoài repo; vì vậy layout thực tế, merged-cell behavior, placeholder hiện hữu và deployed access/runtime thực tế cần được xác nhận bằng smoke test trên một Drive sandbox trước khi đóng toàn bộ checklist.
