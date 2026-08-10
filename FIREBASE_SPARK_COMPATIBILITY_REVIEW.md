# Đánh giá khả năng chạy LIMS trên Firebase Spark

**Ngày đánh giá:** 2026-08-10
**Commit nền được kiểm tra:** e66d0f5 (main, đồng bộ origin/main) + working-tree remediation ngày 2026-08-10
**Phiên bản ứng dụng:** 26.08.10-b01
**Phạm vi:** Angular client, Firestore rules/read paths, Firebase Auth/FCM, Vercel API dùng Firebase Admin SDK, Firebase Storage, Firebase Hosting/Functions, GAS/Google Drive và lần tối ưu Firestore read trước đó.

**Trạng thái remediation:** Đã xoá Firebase Storage flow khỏi source/runtime trong working tree; Google Drive flow được giữ nguyên. Người dùng xác nhận trực tiếp ngày 2026-08-10 rằng hệ thống hoàn toàn không có URL Firebase Storage và không cần migration sang Google Drive/storage khác.

## Kết luận điều hành

### Kết luận sau remediation: đã xoá toàn bộ Firebase Storage flow khỏi source/runtime

Các thay đổi đã thực hiện:

- Xoá `FirebaseStorage` type, state và `FirebaseService.uploadFile()`.
- Xoá nút/input Firebase Upload, handler `uploadCoaFile()` và injection Firebase service khỏi standards form.
- Giữ nguyên nút và handler Google Drive.
- Xoá `storageBucket` khỏi environment files, Firebase init manifest và messaging service worker.
- Xoá import map `firebase/storage` khỏi `index.html`.
- Source/config scan không còn `firebase/storage`, `getStorage`, `uploadBytes`, `getDownloadURL`, `storageBucket`, `FirebaseStorage`, `uploadCoaFile` hoặc `firebaseService.uploadFile`.
- Production build không còn Storage API/bucket reference; chuỗi `@firebase/storage` còn trong Firebase core provider registry của SDK là metadata transitive, không phải Storage implementation hay network call.

`getFirestoreDataEstimate()` trong `firebase.service.ts` chỉ dùng Firestore `getCountFromServer()` để ước lượng số document; đây không phải Firebase Cloud Storage và không phải một Storage flow.

Kết luận hiện tại: **LIMS đã chuyển sang Drive-only ở source/runtime và không còn bị buộc phải dùng Firebase Storage.** Theo xác nhận business hiện tại, không có URL Firebase Storage trong dữ liệu cần giữ; migration bucket/`certificate_ref` vì vậy là **không áp dụng**, không mở thêm một luồng storage khác.

Nguồn chính sách: [Firebase Storage FAQ về thay đổi Spark/Blaze](https://firebase.google.com/docs/storage/faqs-storage-changes-announced-sept-2024) và [Firebase Storage Web setup](https://firebase.google.com/docs/storage/web/start).

### Phần Firestore/Auth/FCM: có thể chạy Spark theo điều kiện, chưa được chứng nhận

Sau khi tắt Storage flow, phần Firestore/Auth/FCM có nhiều cải tiến tốt và có thể phù hợp Spark. Tuy nhiên, chưa thể kết luận “đủ Spark” cho production vì:

1. Không có production plan/usage/database/bucket state trong bằng chứng local; firebase-tools hiện chưa xác thực (Failed to authenticate, have you run firebase login?).
2. Một số read path vẫn không bị giới hạn hoặc có trần rất lớn.
3. Read monitor hiện chỉ là telemetry phía client, chưa phải số đo đầy đủ của Firestore billing.
4. Rule-dependent reads (get, exists, getAfter) và các read/write từ Vercel API chưa được đưa vào dashboard read hiện tại.

### Đánh giá lần cải tiến read trước đó: đạt mục tiêu giảm read amplification, chưa đạt mức Spark-safe

Chuỗi thay đổi từ f06acd5 đến 0dbf400, cùng các hardening tiếp theo, đã xử lý đúng các vấn đề lớn về đọc lặp, listener trùng, cache scope, retry loop, pagination và tải dữ liệu theo quyền. Đây là cải tiến có hiệu quả về kiến trúc.

Nhưng còn ít nhất hai đường đọc có thể quét toàn bộ lịch sử (approvedRuns và fallback reference standards), cùng các direct read/N+1 và blind spot trong telemetry. Vì vậy kết luận phù hợp nhất là:

> Read optimization: PASS một phần về thiết kế và regression tests; FAIL nếu dùng nó làm bằng chứng đủ để cam kết hệ thống nằm trong quota Spark production.

## Phương án tối ưu được khuyến nghị

### Phương án sau remediation: Drive-only + tiếp tục kiểm soát Firestore reads

Sau khi đã xoá Storage flow, **không cần nâng Blaze chỉ vì Firebase config từng có `storageBucket`**. Google Drive hiện là đường upload CoA còn lại. Cấu hình bucket metadata và import map đã được dọn; source/runtime không còn call Firebase Storage.

Chỉ cần xem xét Blaze nếu sau này business thay đổi và chủ động đưa Cloud Storage trở lại; không có lý do kỹ thuật hiện tại để migrate hoặc đổi link. Firebase xác nhận Cloud Storage hiện yêu cầu Blaze và Spark có thể trả 402/403 cho Storage API tại [Firebase Storage FAQ](https://firebase.google.com/docs/storage/faqs-storage-changes-announced-sept-2024).

Việc bỏ Storage không giải quyết các read path `Infinity`, fallback unbounded, N+1 và notification fan-out; các điểm này vẫn phải được sửa/đo để đánh giá Spark.

Thứ tự thực hiện tối ưu:

1. **Data gate:** đã đóng theo xác nhận business: không có URL Firebase Storage và không có dữ liệu cần migrate; không khôi phục Storage flow.
2. **Drive-only gate:** giữ Google Drive flow, kiểm tra OAuth/Drive quota và test create/edit/view/permission/error path.
3. **Read gate:** đã tách approved history khỏi all-time listener, chặn dashboard reference-standard fallback, batch result details và nạp history theo cursor/date window; các bulk admin/export path vẫn được đánh dấu explicit/high-cost.
4. **Measurement gate:** mở rộng telemetry cho client + Vercel Admin SDK, lấy Firestore usage thực tế, dùng Query Explain cho query/index quan trọng và đặt p95 budget theo route/role.
5. **Canary gate:** rollout theo nhóm nhỏ, theo dõi reads/writes/deletes/egress trong 24–72 giờ, sau đó mới mở rộng.

### Khi nào chọn Spark-only?

Source hiện đã ở trạng thái Drive-only, nên Spark-only không còn là một nhánh rewrite vì Google Drive path đã tồn tại. Các điều kiện còn lại là kiểm soát read quota và xử lý dữ liệu legacy nếu có:

- dùng Google Drive-only hoặc storage ngoài Firebase cho CoA;
- thay approved history và dashboard fallback bằng các query bounded/paginated;
- giới hạn user/traffic và chứng minh p95 reads/day bằng production telemetry;
- không bật các capability tính phí như Cloud Storage, TTL, PITR, backup/restore.

Với bằng chứng sau remediation, **khuyến nghị chính thức là tiếp tục Drive-only và đánh giá Spark theo Firestore read budget**. Không nên chọn Blaze chỉ vì lịch sử source từng có `storageBucket`.

## Giới hạn Spark cần đối chiếu

Các con số dưới đây là giới hạn/free quota chính thức cần dùng làm release gate, không phải cam kết rằng ứng dụng sẽ tự động được giới hạn an toàn:

| Firebase capability | Spark/no-cost limit hoặc trạng thái | Ý nghĩa với LIMS |
|---|---:|---|
| Firestore stored data | 1 GiB | Cần theo dõi kích thước logs, results_details, standard_usages, requests và các subcollection lịch sử. |
| Firestore document reads | 50.000/ngày | Tính theo document được trả về; cold listeners, reconnect, query fallback và rule-dependent reads đều có thể làm tăng chi phí/quota. |
| Firestore document writes | 20.000/ngày | Bao gồm ghi nghiệp vụ, FCM token, notification fan-out, import/backfill và API mutations. |
| Firestore document deletes | 20.000/ngày | Các thao tác dọn dữ liệu/xóa batch cần quota guard; không được giả định rằng một lần bấm admin luôn nhỏ. |
| Firestore network egress | 10 GiB/tháng | Các query lịch sử lớn và tài liệu lớn gây áp lực ngoài số document read. |
| Cloud Storage for Firebase | Không còn truy cập trên Spark từ 2026-02-03 | Blocker trực tiếp cho nút upload CoA hiện tại. |
| Firebase Hosting | 10 GB storage và 10 GB/tháng transfer | Không phải hosting chính của bản này; vercel.json cho thấy app/API đang triển khai qua Vercel. |
| Cloud Functions | Không phải capability Spark đang dùng | Repo không có Firebase Functions; API nằm dưới api/ và chạy qua Vercel. |

Nguồn quota: [Firebase pricing](https://firebase.google.com/pricing), [Firestore quotas](https://firebase.google.com/docs/firestore/quotas) và [Firebase Hosting usage quotas](https://firebase.google.com/docs/hosting/usage-quotas-pricing).

Firestore billing cần lưu ý thêm: [Firestore pricing](https://firebase.google.com/docs/firestore/pricing) tính document read khi listener nhận document mới/thay đổi/bị loại khỏi result set; các get()/exists() phụ thuộc trong security rules cũng có thể bị tính thêm. count() aggregation tính theo index entries, tối thiểu một read và theo batch index entries, nên không thể mặc định mọi count query luôn chỉ là “1 read”.

## Kiểm kê kiến trúc hiện tại

| Thành phần | Bằng chứng trong repo | Đánh giá Spark |
|---|---|---|
| Frontend | Angular 19, build output dist/lims-cloud-pro/browser | Không tiêu quota Firebase Hosting nếu tiếp tục host ở Vercel; vẫn tiêu Firestore/Auth/FCM từ browser. |
| Firestore client | @angular/fire, Firestore persistent local cache, DeltaSync, direct getDoc/getDocs, onSnapshot | Có thể phù hợp nếu dữ liệu và lưu lượng được đo/giới hạn. |
| Security rules | firestore.rules, helper profile/permission, atomic getAfter cho standard usage | Security boundary tốt và có emulator tests; rule reads cần tính vào read budget. |
| Firebase Auth/FCM | Auth profile listener, role config, FCM token/notification listener | Có thể dùng Spark trong giới hạn dịch vụ; token/notification vẫn tạo Firestore reads/writes. |
| Firebase Storage | Đã xoá dynamic import/upload path khỏi source/runtime | Không còn là dependency của LIMS; chỉ cần kiểm tra dữ liệu legacy/bucket cũ. |
| Vercel API | api/notifications.ts, api/qr/*, Firebase Admin SDK | Không phải Firebase Functions; mọi Admin Firestore operation vẫn tác động quota/usage của project Firebase. |
| Google Apps Script/Drive | gas/ và Google Drive upload path | Là đường CoA còn lại trong UI; quota/billing riêng của Google Drive/GAS. |
| Firebase deployment artifacts | firebase.json chỉ khai báo Firestore rules; không có .firebaserc hoặc firestore.indexes.json trong repo | Storage rules không còn cần cho source hiện tại; index/production audit vẫn cần xử lý. |

## Đánh giá lần tối ưu read trước đó

### Chuỗi thay đổi đã kiểm tra

| Commit | Cải tiến đã thực hiện | Kết luận |
|---|---|---|
| f06acd5 | Đưa inventory/SOP/logs vào DeltaSync, thay các onSnapshot không giới hạn bằng cache + delta/cursor | Đúng hướng; giảm đọc lặp trong login và navigation. |
| f9d436a | Chặn read amplification/retry loop | Có giá trị trực tiếp cho quota và tính ổn định. |
| 0444e44 | Thêm FirestoreReadMonitor, chuyển một số thống kê sang getDoc, dùng on-demand cho standard requests/reference standards | Tốt về observability và lazy loading, nhưng monitor chưa phủ toàn hệ thống. |
| 69cc38c | Thêm stale-cache reset, cache TTL/guard, cap notification/pending request/standard request, bỏ timeout gây overlap | Giảm burst và listener overlap; các cap vẫn có nơi chưa áp dụng đồng nhất. |
| 861acfa | Cache users/config/master data, paginate usage history | Tốt; giảm repeated reads và full history reads ở các path đã sửa. |
| d60d967 | Personal logs dùng query có where + limit, sort client-side để tránh composite index | Đúng cho path này; không giải quyết mọi query có equality + orderBy trong hệ thống. |
| 0dbf400 | Dashboard tải theo quyền thay vì luôn tải toàn bộ | Tốt; cần tiếp tục kiểm soát các call phát sinh trong từng quyền. |
| 9df242e | Hardening lifecycle/cache isolation của DeltaSync | Cải thiện độ tin cậy; không thay thế quota budget production. |

### Những phần đã đạt

- DeltaSync singleton/cursor và cache scope giảm khả năng một route tạo nhiều listener cùng collection.
- Inventory/SOP/logs có giới hạn initial load ở các cấu hình chính: lần lượt khoảng 2000, 500 và 200 item.
- Pending requests, notifications, users và một số page query đều có limit.
- Standard request load có TTL/in-flight coalescing và fallback được giới hạn 1000.
- Usage history đã có pagination; inventory history và master-target path cũng có giới hạn.
- Approved request listener đã được giới hạn 300; history range dùng page 100/cursor và merge theo id, bao phủ cả legacy `analysisDate`/`approvedAt`/`timestamp`.
- Statistics không còn nạp reference standards/standard requests bulk ngay khi mở tab activity; các collections này chỉ lazy-load khi tab/export thực sự cần và NXT tự await loader.
- Dashboard nearest-expiry không còn gọi fallback full collection; result merge dùng `documentId IN` batch tối đa 30 id/query và được đưa vào read monitor.
- Retry/catch-up, cache stale và cache isolation đã được test, không chỉ sửa bằng comment.
- Bộ test hiện tại xác nhận các hành vi DeltaSync/read monitor/rules quan trọng không bị regression.

### Những phần chưa đạt hoặc cần kiểm chứng tiếp

#### F-R-01 — P1: approved request history đã được bounded; production quota vẫn cần đo

Trước remediation, `src/app/core/services/state.service.ts:650-663` đặt `approvedRunsConfig.maxCacheSize = Number.POSITIVE_INFINITY`; khi cache trống, DeltaSync có thể lấy toàn bộ collection requests trong một lần khởi tạo.

Đã remediation: listener dùng namespace recent riêng và `maxCacheSize = 300`; các màn hình history/statistics gọi `loadApprovedRequestsForDateRange()` với các query `analysisDate`, `approvedAt`, `timestamp`, mỗi page `limit(100)` và `startAfter` cursor. Khi không chọn khoảng ngày, result list hiển thị rõ “300 mẻ gần nhất”; không còn coi latest N là all-time một cách im lặng.

#### F-R-02 — P1: dashboard FEFO đã loại bỏ fallback reference standards không giới hạn

Trước remediation, `src/app/features/standards/services/standard-cache.service.ts:160-196` gọi `fetchAllAndCache()` khi cache trống; `fetchAllAndCache()` thực hiện `getDocs(colRef)` không có limit. Dashboard gọi `getNearestExpiry()` tại `src/app/features/dashboard/dashboard.component.ts:508`, nên một cold dashboard có thể bypass giới hạn DeltaSync của standards page.

Đã remediation: `getNearestExpiry()` query `expiry_date >= today`, `orderBy(expiry_date asc)`, `limit(50)` và tối đa 10 trang (`500` document reads), lọc FEFO ở client và ghi telemetry phase `earliest`; không còn gọi `fetchAllAndCache()` từ dashboard. `fetchAllAndCache()` vẫn tồn tại cho import/cleanup/admin bulk operation và phải được gọi explicit.

Path khác trong src/app/core/services/state.service.ts:909-936 đã đặt limit(10000), tốt hơn nhưng vẫn là một burst lớn. Hai path cần hợp nhất về một bounded/paginated source.

#### F-R-03 — P1: cap hiện tại vẫn có thể tạo burst lớn và có nguy cơ truncate

Fallback standard requests ở state.service.ts:881-882 tối đa 1000; reference standards ở state.service.ts:936 tối đa 10000. Các limit này chặn unbounded read ở một số path nhưng chưa phải pagination đầy đủ. Nếu collection lớn hơn limit, logic có thể vừa tốn một burst lớn vừa trả về dữ liệu không đầy đủ nếu caller coi kết quả là all-time.

DeltaSync cũng cần đối chiếu queryConstraints với orderBy('lastUpdated') trong standard-request.service.ts; staff path có where('requestedBy', ...) cùng order/cursor. Repo chưa commit firestore.indexes.json, nên cần Query Explain/production test để xác nhận index và chi phí thực tế.

#### F-R-04 — P1: read monitor chưa đủ để làm bằng chứng Spark

src/app/core/services/firestore-read-monitor.service.ts:26-31 tự mô tả là client-only và counts approximate cho realtime listeners. Các direct reads chưa được instrument đồng nhất, ví dụ:

- src/app/features/results/result-list.component.ts:1502-1503 đã đổi từ một getDoc() cho từng SOP result detail sang `documentId IN` batch tối đa 30 id/query; các path traceability/result history khác vẫn cần đo riêng.
- src/app/features/results/services/result.service.ts:122-123,611-625 có child-document/history reads theo từng request.
- src/app/features/traceability/traceability.component.ts:939-949,969,1070-1083 có nhiều point reads khi trace.
- src/app/core/services/stats.service.ts:139 đọc toàn bộ monthly_stats khi gọi chức năng tương ứng.
- src/app/core/services/firebase.service.ts:179,388-390 có full collection/admin export paths.

Ngoài ra, số được ghi trong client monitor có thể là cache hit hoặc “approximate listener size”, trong khi rule-dependent reads và Vercel Admin API không đi qua monitor này. Cần telemetry server-side/Firestore Usage export hoặc số liệu Firebase Console theo cửa sổ traffic đại diện trước khi chốt Spark.

#### F-R-05 — P1/P2: security rule reads có thể làm budget cao hơn số read nhìn thấy ở code

firestore.rules:11-68 dùng profile/role exists()/get(). firestore.rules:210-212 và firestore.rules:245-277 dùng get()/getAfter() để bảo vệ correlated atomic write cho standard usage. Đây là thiết kế bảo mật cần giữ; không phải defect. Nhưng Firestore billing có thể tính dependent document reads thêm vào request/listener, nên read budget phải đo cả lớp rules, không chỉ số document mà client query trả về.

#### F-R-06 — P1/P2: notification fan-out từ Vercel API chưa có quota guard

api/notifications.ts:233-243 có thể đọc toàn bộ users và roles_config để resolve recipient theo role; api/notifications.ts:313-406 tiếp tục transaction/readAll và tạo/cập nhật notification/push status cho từng recipient. Với vài người dùng, path này ổn. Với số recipient lớn hoặc nhiều lần gửi trong ngày, 20.000 writes/day và 50.000 reads/day của Spark có thể bị tiêu nhanh.

Cần giới hạn recipient batch, idempotency/retry budget và audit usage cho route này. Việc chạy API trên Vercel không biến các thao tác Firebase Admin thành quota riêng.

#### F-R-07 — P2: phép ước lượng storage/read trong app chưa đủ chính xác

firebase.service.ts:253-275 dùng nhiều getCountFromServer() để ước lượng. Firestore aggregation được tính theo index entries, tối thiểu một read, không phải luôn luôn một read bất kể collection lớn bao nhiêu. Vì vậy màn hình estimate chỉ nên là chỉ báo vận hành; không dùng làm chứng nhận Spark.

#### F-R-08 — P2: thiếu artifact index/Storage rules để tái lập production

firebase.json hiện chỉ khai báo:

~~~json
{
  "firestore": {
    "rules": "firestore.rules"
  }
}
~~~

Chưa thấy storage.rules hoặc firestore.indexes.json được version-control. Đây không tự động chứng minh production sai, nhưng làm giảm khả năng review/release reproducibility và chưa cho phép xác nhận query plan/index từ repo.

## Ước lượng read theo route: trần từ code, không phải số đo production

Bảng này chỉ cộng các limit/cấu hình nhìn thấy trong code để xác định nơi cần đo. Cache hit, role, query result size, reconnect và rule reads có thể làm số thực tế khác đi.

| Tình huống | Trần/đặc điểm đọc thấy trong code | Nhận xét Spark |
|---|---:|---|
| Cold login của user có quyền report | Inventory ≤2000 + SOP ≤500 + pending ≤100 + standard requests ≤1000 + logs ≤200 + users/notifications/config | Có thể ở khoảng trên 4.000 document reads trước approved history, stats và rule-dependent reads; cần đo theo role thực tế. |
| User không có quyền report | Thường dùng personal logs ≤100, bỏ global report listeners | Tốt hơn nhưng vẫn cần đo notification/config/route-specific reads. |
| Approved request/history | Listener recent ≤300; history page ≤100 với cursor/date window | Không còn cold all-time scan; khoảng ngày explicit có thể đọc nhiều page theo đúng phạm vi người dùng chọn. |
| Dashboard nearest expiry khi cache trống | `limit(50)`/page, tối đa 10 page; cache fallback không đọc | Không còn `getDocs(reference_standards)` full collection trên dashboard; capped ở 500 docs. |
| Reference standards fallback khác | `limit(10000)` trong luồng statistics explicit, chỉ lazy-load khi cần | Vẫn là bulk/high-cost path; chưa gọi lúc mở activity tab và cần production dataset/usage gate. |
| Result list merge | `documentId IN` tối đa 30 id/query | Giảm N point reads thành `ceil(N/30)` queries; cùng tập document và map kết quả theo id. |
| Role notification | Đọc users/roles rồi ghi notification/push status theo recipient | Dùng chung read/write quota Firestore; chưa có quota guard. |

Ví dụ minh họa, không phải kết quả đo: nếu một cold report session thực sự đọc khoảng 4.000 documents thì khoảng 12 session đã tương đương gần 48.000 reads/ngày, chưa tính listener delta, rules, API, retry và các route khác. Vì vậy Spark chỉ có thể chấp nhận khi traffic nhỏ và có số đo production chứng minh, không thể suy ra chỉ từ việc các listener đã có limit.

## Kiểm thử và checklist bằng chứng

### Đã kiểm tra

- [x] Đã kiểm tra git status và bảo toàn các thay đổi concurrent của người dùng (`smart-prep`); phần remediation Spark chỉ chạm các read path nêu trong báo cáo.
- [x] Static inventory các Firebase/Vercel/GAS/Storage paths và deployment config.
- [x] Review lịch sử tối ưu read từ f06acd5 đến các hardening 9df242e, cùng các direct read paths còn lại.
- [x] Đối chiếu giới hạn chính thức Spark/Firestore/Storage bằng tài liệu Firebase current tại ngày đánh giá.
- [x] npm run build — pass sau khi workspace concurrent đã có lại `smart-prep.component.html`; production bundle hoàn tất tại `dist/lims-cloud-pro`.
- [x] `npx tsc -p tsconfig.app.json --noEmit --pretty false` — pass sau các thay đổi read.
- [x] npm run typecheck:api — pass.
- [x] npm run test:standards — 94 pass, 0 fail.
- [x] npm test — exit code 0; trong full suite ghi nhận 17/17 Firestore rules, 11/11 daily-checklist và 65/65 GAS tests pass.
- [x] Sau emulator test, port 8080 — FREE; không thấy emulator còn lắng nghe.
- [x] Kiểm tra startup: constructor chỉ khởi tạo Firebase app/Firestore; không gọi getStorage() khi app boot.
- [x] Kiểm tra call chain sau remediation: không còn Firebase Storage caller; Google Drive là upload path còn lại.
- [x] Source/config scan không còn Firebase Storage API, bucket metadata hoặc Firebase Upload UI.
- [x] Production build scan không còn Storage API/bucket reference; `@firebase/storage` provider name trong Firebase core SDK không phải Storage flow.
- [x] Current read-risk scan không còn `approved_requests_all`/`Infinity` listener, dashboard `fetchAllAndCache()` fallback hoặc result-details point-read N+1 trong các path đã remediation.
- [x] Current bundle scan không còn `uploadBytes`, `getDownloadURL`, `getStorage()`, bucket URL, `storageBucket`, `FirebaseStorage`, `uploadCoaFile` hoặc `getStorageEstimate`; chỉ còn 1 chuỗi provider metadata transitive `@firebase/storage` trong Firebase core registry.
- [x] Full suite sau remediation: `npm test` exit code 0; 94 standards, 13 notifications, 4 Drive, 13 Excel import, 33 SmartBatch/rules static, 17 Firestore emulator rules, 11 daily-checklist và 65 GAS tests pass; port 8080 sau emulator là FREE.

### Còn thiếu — không được tick cho đến khi có bằng chứng production

- [ ] Xác nhận Firebase Console project lims-cloud-by-otada đang ở Spark hay Blaze và lưu snapshot billing/usage read-only.
- [x] Business confirmation ngày 2026-08-10: hoàn toàn không có URL Firebase Storage và không có file/legacy data cần migrate; migration bucket/`certificate_ref` là không áp dụng.
- [x] Source/runtime đã chuyển Drive-only; không còn Firebase Upload UI/call path.
- [ ] Kiểm thử production create/edit/view/permission/error path bằng Google Drive và xác nhận OAuth/Drive quota.
- [x] Không mở phương án migration/Blaze cho Storage; chỉ xem xét lại nếu business tương lai chủ động thay đổi yêu cầu.
- [ ] Lấy Firestore usage theo ngày cho reads/writes/deletes/storage/egress trong ít nhất một chu kỳ traffic đại diện.
- [ ] Đo cold login, dashboard, result list, standards, traceability, approved history và notification fan-out với dataset gần production.
- [ ] Đo cả Vercel API Admin SDK operations; không dùng client monitor làm số liệu duy nhất.
- [ ] Kiểm tra Query Explain/index production cho standard requests (requestedBy + lastUpdated) và các query orderBy tương ứng.
- [ ] Xác nhận Firestore retention/TTL/backups/PITR/restore có đang bật hay không; các capability tính phí không được xem là Spark-compatible nếu đang dùng.
- [ ] Đặt quota alert, per-route budget và runbook xử lý 80%/100% quota trước khi gọi bản phát hành “Spark-ready”.

## Khuyến nghị remediation theo ưu tiên

### R0 — Quyết định sản phẩm/hạ tầng

Trạng thái đã chốt theo yêu cầu hiện tại là Drive-only/Spark; không có nhánh migration Storage.

1. **Drive-only/Spark:** Google Drive là đường CoA chính thức; nút Firebase Upload, `uploadCoaFile()`, bucket metadata và Storage import đã bị xoá khỏi source/runtime. Không có URL Storage nên không migrate.
2. **Không áp dụng Firebase Storage/Blaze:** không giữ nút Firebase Upload, không bổ sung `storage.rules`, không chuyển Blaze vì một capability không được hệ thống sử dụng.

### R1 — Tách approved history khỏi all-time listener — đã triển khai

Đã thay `maxCacheSize: Number.POSITIVE_INFINITY` bằng recent listener giới hạn 300 và loader on-demand theo date window với cursor. Acceptance criteria đã đạt ở source:

- Không có initial listener nào tải toàn bộ requests.
- Mỗi page có `limit(100)` và `startAfter` cursor; ba field ngày legacy được merge theo id.
- Statistics/request list/label/result date filter gọi loader cho đúng khoảng ngày; result list không chọn ngày thì hiển thị rõ recent 300, không gọi đó là all-time.
- TypeScript, standards/read-monitor/delta-sync tests pass; runtime production dataset và reconnect vẫn cần canary.

### R2 — Chặn dashboard fallback unbounded — đã triển khai

`getNearestExpiry()` hiện dùng bounded expiry query và cache fallback; chưa cần materialized document. Acceptance criteria:

- Không còn getDocs(colRef) không có limit trên dashboard path.
- Không còn `fetchAllAndCache()` trên dashboard path; query có `limit(50)` và tối đa 10 page.
- Mỗi page được ghi `FirestoreReadMonitor` phase `earliest`; bulk standards vẫn chỉ chạy khi route/export explicit.

### R3 — Hoàn thiện read accounting

Mở rộng telemetry cho các direct getDoc/getDocs, listener initial/delta, Vercel Admin routes và cache-hit distinction; đồng thời thêm Firestore Console/Usage export vào kiểm tra release. Acceptance criteria:

- Có report theo route/role/day: client reads, Admin reads, writes, deletes.
- Ghi rõ rule-dependent reads là phần ước lượng hoặc lấy từ server usage, không gộp nhầm vào cache hit.
- Có dataset và traffic scenario tái lập được.

### R4 — Đưa query/index/deployment artifact vào release

Version-control firestore.indexes.json nếu production cần composite indexes; thêm storage.rules nếu còn Storage; kiểm thử deploy preview/emulator tương ứng. Acceptance criteria là một người khác có thể từ repo tái lập rules/indexes cần thiết, không phụ thuộc cấu hình console không được ghi nhận.

### R5 — Guard các write/read burst vận hành

Đặt guard cho import/export/backfill/delete, notification fan-out, FCM token sync và batch mutations. Với thao tác có thể vượt daily quota, hiển thị số lượng dự kiến và dừng trước ngưỡng. Acceptance criteria:

- Batch size không đồng nghĩa với quota safety; có giới hạn theo ngày/tenant/route.
- Notification route có recipient cap, retry/idempotency và audit.
- Admin full collection operations được đánh dấu explicit/high-cost và không tự chạy khi vào màn hình thường.

## Release decision

| Phạm vi quyết định | Trạng thái |
|---|---|
| “Core/toàn bộ source hiện tại theo Drive-only chạy trên Firebase Spark” | **CONDITIONAL GO** — Storage gate đã đóng và các read path P1 chính đã bounded; vẫn cần production usage, index và canary evidence trước khi gọi là Spark-certified. |
| “Dữ liệu cũ còn nằm trong Firebase Storage nhưng vẫn giữ Spark” | **NOT APPLICABLE theo business confirmation** — không có URL/file Storage cần truy cập và không có migration scope. |
| “Lần cải tiến read trước đó đã thành công” | **PASS về structural/read-path remediation** — đã xử lý Infinity listener, dashboard fallback, lazy bulk standards và result-details N+1; chưa phải bằng chứng quota production. |
| “Có thể kết luận quota production từ test/emulator local” | **NO** — test chứng minh correctness/security, không chứng minh lưu lượng và billing production. |

Source code đã được thay đổi để xoá Firebase Storage flow; Google Drive flow không bị thay đổi. Artifact này là checkpoint kiểm tra và release gate. Các mục chưa có production evidence vẫn để unchecked có chủ ý; riêng migration đã được business xác nhận là không áp dụng.
