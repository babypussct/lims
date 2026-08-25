# Kế hoạch triển khai hợp nhất Hoạt động gần đây, Chuông thông báo và Audit Trail

> Ngày lập kế hoạch: 2026-08-25
> Trạng thái: **Đã hoàn tất triển khai production và nghiệm thu runtime release v26.08.25-b05; Activity/Notification global, UID-only printable Rules, registry-only consumers và evidence audit đã đạt**
> Phạm vi: Dashboard Activity Feed, `/logs`, chuông `/notifications`, toast/push, Audit/Statistics, Print Queue, Traceability, Firestore Rules, migration dữ liệu và rollout/rollback.
> Mục tiêu chính: một hành động nghiệp vụ chỉ được mô tả **một lần** bằng canonical event; Dashboard, chuông, push và audit dùng chung nguồn sự kiện nhưng có policy hiển thị/recipient riêng.

---

## 0. Cách sử dụng tài liệu này

Tài liệu này là checklist triển khai chính thức cho toàn bộ hạng mục. Khi bắt đầu code:

1. Không đánh dấu `[x]` chỉ vì code đã được viết; chỉ đánh dấu khi có test/build/runtime evidence tương ứng.
2. Mỗi PR phải hoàn tất checklist và exit criteria của chính PR trước khi sang PR kế tiếp.
3. Không siết Firestore Rules trước khi writer mới, index và dữ liệu backfill đã sẵn sàng.
4. Không xóa đường tương thích cũ trước khi feature flag V2 đã chạy ổn và client cũ hết vòng đời chấp nhận được.
5. Không dùng Activity Feed làm nguồn sự thật nghiệp vụ. Result, Kho, Chất chuẩn, request và print job vẫn là nguồn dữ liệu chính của từng module.
6. Không coi việc user đã xem Activity là đã đọc/xử lý notification. Hai trạng thái độc lập.
7. Không cho actor tự động vượt permission chỉ vì `actorUid` trùng với user hiện tại.
8. Mọi thay đổi security phải có Firestore Emulator evidence.
9. Mọi event có khả năng public qua QR/traceability phải được đánh dấu rõ; không giữ `allow get: if true` cho toàn bộ `/logs` sau cutover.
10. Nếu có khác biệt giữa tài liệu này và behavior production hiện tại, ưu tiên rollout additive + feature flag, không đổi đột ngột.

## 0.1. Trạng thái triển khai local đã xác nhận ngày 2026-08-25

Phần code local hiện đã đi xa hơn baseline ban đầu của tài liệu. Checklist bên dưới được cập nhật theo nguyên tắc: chỉ đánh dấu `[x]` khi đã có code và automated evidence tương ứng; các bước cần môi trường staging/production vẫn giữ `[ ]`.

Đã xác nhận trong worktree hiện tại:

- canonical Activity schema/registry/policies và `ActivityEventService` đã tồn tại;
- writer Result, Inventory, Standard và các workflow chính trong `StateService` đã ghi schema V2 theo hướng additive, vẫn giữ compatibility fields;
- `AuditLogService` và `PrintQueueService` đã tách khỏi Activity Feed reader;
- Print Queue V2 dùng `actorUid` làm ownership key; listener `user/displayName` đã được loại bỏ trong PR9 sau khi production backfill/verify đạt;
- `ActivityFeedService`, merge/dedupe, structured search/filter, aggregation, last-seen và Dashboard flag đã có;
- Dashboard/Statistics dùng label từ canonical registry cho mọi action đã đăng ký; heuristic chỉ còn là fallback cho legacy unknown action trong compatibility path; các action lịch sử Daily Checklist đã được registry hóa để backfill không còn bỏ sót;
- deep-link Traceability V2 dùng canonical resolver, chỉ sinh `/traceability/{requestId}` khi event có `publicTraceable=true` và requestId hợp lệ, đồng thời encode identifier;
- Activity Feed header/search đã responsive hơn trên mobile; action buttons V2 có accessible label/focus state và regression contract;
- notification canonical dispatch theo `eventId`, server-side recipient resolution, actor suppression và deterministic inbox ID đã có;
- Rules V2, registry ↔ Rules contract tests, public traceability restriction và user preference Rules đã có; public traceability hiện yêu cầu action allowlist + `requestId` + `targetType=REQUEST`;
- backfill tooling và index config đã có local; composite-index contract test giữ đủ Activity/Audit/Print indexes và xác nhận notification query vẫn equality-only; staging và production đã có evidence index READY/backfill;
- feature flags `activityFeedV2` và `notificationEventSyncV2` vẫn fail-closed nếu config không có; production hiện đã bật cả hai global flags sau canary, hai canary arrays đang rỗng; reader legacy không còn nằm trong release b05, rollback surface dùng deployment/config trước đó;
- Activity scope resolution đã được tách thành pure helper có test cho permission reduction và downgrade Viewer; service contract xác nhận listener/data scope cũ bị clear trước khi publish scope mới;
- App Badge sync đã được harden để xử lý API support không đầy đủ và Promise rejection; zero unread ưu tiên `clearAppBadge()` và fallback `setAppBadge(0)` khi browser chỉ expose setter.

Automated evidence gần nhất:

```text
npm run test:activity                 → 61/61 pass
npm run test:notifications            → 27 unit/policy tests pass + 1 workflow Emulator pass
npm run test:ui-dashboard             → 2/2 pass
npm run test:firestore-rules          → 34/34 pass
npx tsc -p tsconfig.app.json --noEmit → pass
npm run typecheck:api                 → pass
npm run build                         → pass
npm run release:verify                → pass
git diff --check                      → pass
```

Build chỉ còn các warning CommonJS/AMD hiện hữu từ dependency Univer/React-related; không có build error.

Runtime smoke local gần nhất (dev server `127.0.0.1:4200`, session manager đang authenticated, feature flag production không bị thay đổi):

```text
Dashboard load                    → route #/dashboard, 0 console error
Bell unread                       → badge aria-label = 6; panel = “6 thông báo chưa đọc”; tab counts khớp 6
Activity → Traceability           → #/traceability/7LXVnJ9xPdCPA9Bdh891; hồ sơ tương ứng load thành công
Notification Panel @ 390×844      → dialog 390px, document scrollWidth 390px, close control visible
```

Smoke này chỉ là local authenticated-manager evidence, không thay thế canary/role-matrix/staging-production gates. `permission change` realtime và App Badge API chưa được coi là runtime pass vì chưa có thao tác end-to-end tương ứng, dù cả hai hiện đã có automated regression evidence ở tầng policy/service contract.

Các gate commit/push, deploy release b05, production UID-only Rules smoke và authenticated runtime smoke sau cleanup đã hoàn tất, evidence tại mục 0.16. Snapshot dữ liệu trước cleanup được ghi tại mục 0.14; implementation/contract evidence của PR9 được ghi tại mục 0.15. Notification writer workflow vẫn dùng fixture Auth/Firestore Emulator end-to-end, không chạy mutation nghiệp vụ thật trên production; đây là giới hạn an toàn có chủ ý. Authenticated staging role matrix cloud vẫn không thể bật trên Spark (`BILLING_NOT_ENABLED`), đã được đóng bằng production role accounts, Auth/Firestore Emulator và Rules matrix evidence.

## 0.2. Tiếp tục local hardening đã xác nhận ngày 2026-08-25

Các thay đổi tiếp theo đã được triển khai theo hướng additive và đã đi qua test/build gate:

- Central registry có `publicTraceableAllowed`; test contract đối chiếu allowlist này với Firestore Rules để ngăn drift khi thêm action mới.
- `ActivityEventService` fail closed cho `publicTraceable=true` nếu action không được allowlist, thiếu `requestId`, hoặc `targetType` không phải `REQUEST`.
- `ActivityEventService` chỉ lưu internal SPA path; external URL và protocol-relative URL bị bỏ, sau đó registry default route được dùng làm fallback.
- API `dispatchEvent` kiểm tra thêm `actorName`, `activityVisible=true` và giới hạn `details <= 2.000` ký tự trước khi resolve recipient/push; các điều kiện này khớp canonical Rules boundary.
- Backfill fail closed với tài liệu đã có V2 marker nhưng schema sai (`INVALID_V2`), ghi `reason`, đưa vào unresolved report và làm `--verify` exit code 2; script không tự ý rewrite tài liệu V2 hỏng.
- Backfill chuẩn hóa `actorName/user` theo profile đã resolve, chỉ suy luận public traceability từ action allowlist + `requestId` + marker `TRC-*` hoặc `publicTraceable=true`; `printable`/`printJobId` đơn thuần không còn đủ để public.
- Firestore Rules giữ fallback đọc printable legacy theo `user/displayName` trong compatibility window. Fallback này chưa được siết thành UID-only vì query legacy theo display name không thể được Rules lọc an toàn khi tồn tại tài liệu V2 trùng tên; phải hoàn tất backfill + chuyển listener/API sang `actorUid` trước PR9 cleanup.

Evidence mới nhất sau hardening:

```text
npm run test:activity                 → 57/57 pass
npm run test:notifications            → 27 tests pass, 0 fail
npm run test:ui-dashboard             → 2/2 pass
npm run test:firestore-rules          → 34/34 pass
npx tsc -p tsconfig.app.json --noEmit → pass
npm run typecheck:api                 → pass
npm run release:verify                → pass
git diff --check                      → pass
```

`release:verify` cũng đã chạy full `npm test`, runtime gate và `ng build`. Không có production deploy/index/backfill, canary hoặc Rules cutover nào được thực hiện; staging rollout được ghi riêng ở mục 0.3.

## 0.3. Kết quả chuẩn bị release và preflight rollout ngày 2026-08-25

Đã thực hiện các bước chuẩn bị release theo quy trình repository:

- `release-notes.json` đã được cập nhật theo bốn nhóm nội dung dành cho người dùng.
- `npm run release:prepare` đã sinh release `v26.08.25-b01` và đồng bộ `package.json`, `package-lock.json`, `metadata.json`, `ngsw-config.json`, `public/release-history.json`, `CHANGELOG.md` và phiên bản runtime.
- `npm run release:verify` đạt exit code `0`, bao gồm full test, typecheck, kiểm tra metadata và production build.
- `git diff --check` đạt exit code `0`.
- `npm run release:prepush` đã chạy nhưng bị chặn đúng quy định vì working tree còn các thay đổi implementation/release chưa được commit; không bypass gate.

Preflight hạ tầng đã thực hiện ở chế độ đọc:

- Firebase CLI đã tạo project staging riêng `lims-activity-stg-260825` theo yêu cầu; Firestore database `(default)` đã khởi tạo ở `asia-southeast1` với delete protection bật.
- `npx firebase-tools firestore:indexes --project lims-cloud-by-otada --json` xác nhận trước rollout production chỉ có 13 index cũ cho `inventory`, `requests` và `standard_requests`; 7 index mới cho collection `logs` chưa được deploy.
- Sau `release:predeploy` đạt với SHA `3ca484359dfb`, `firestore:indexes` đã deploy production thành công và giữ nguyên 13 index cũ; Firestore đã xác nhận đủ 7 index `logs` ở trạng thái `READY`.
- Private key production đã được tạo bằng owner account, kiểm tra đúng project `lims-cloud-by-otada` và lưu ngoài repository với quyền file `600`; không đưa credential vào source hoặc commit.
- Production Activity backfill dry-run đã đọc `4.192` log, không ghi dữ liệu: `migratable=3.163`, `unresolvedActor=1.027`, `unknownAction=2`, `missingTarget=51`, `invalidV2=0`, `errors=0`, `publicTraceableCandidates=572`.
- Unresolved report đã được phân nhóm: `1.009` log mang actor legacy `Quản trị viên`, `18` log mang `Admin`; các profile tương ứng không còn trong Firestore/Auth nên không tự động gán sang tài khoản khác. Hai unknown action là `DAILY_CHECK_ITEM` và `DAILY_UNCHECK_ITEM`, cần classification legacy được review trước khi migrate.
- Không chạy production apply hoặc Rules cutover sau dry-run; giữ nguyên dữ liệu legacy để tránh ghi attribution suy đoán.
- `npm run backfill:activity -- --dry-run --app-id=lims-cloud-fixed --limit=1` chưa thể bắt đầu đọc dữ liệu vì máy phát hành không có `FIREBASE_SERVICE_ACCOUNT`, `GOOGLE_APPLICATION_CREDENTIALS` hoặc Application Default Credentials. Lệnh dừng trước truy vấn Firestore, không có write nào xảy ra.
- Commit `3ca484359dfb` đã push lên `main`; Vercel Git Integration đã phục vụ release `v26.08.25-b01`. Smoke public `/`, `/ngsw.json`, `/release-history.json` và `/changelog` đều trả HTTP `200`.

Lịch sử preflight staging trước khi có xác nhận tạo private key:

- `firestore.indexes.json` đã deploy thành công vào `lims-activity-stg-260825`; tại thời điểm kiểm tra ban đầu 7 index `logs` còn ở trạng thái `CREATING`.
- Firebase Console đã chuyển sang Google account có quyền trên project staging; trang Firebase Admin SDK xác nhận service account `firebase-adminsdk-fbsvc` đã tồn tại.
- Backfill staging chỉ được thực hiện sau khi private key đúng project được tạo và lưu ngoài repository; không sử dụng credential đăng nhập quản trị LIMS cho bước này.

Evidence rollout staging đã đạt sau khi tạo credential được xác nhận:

- Firebase Web App staging đã tạo với app ID `1:913307249579:web:61b2e022412b3e73a400ee`; Angular `staging` configuration build pass, không thay đổi `environment.prod.ts`.
- Private key staging đã được tạo sau xác nhận ngay tại bước thao tác, kiểm tra đúng project và lưu ngoài repository với quyền file giới hạn; credential không được đưa vào source hoặc commit.
- 7 composite index `logs` đã deploy và API Firestore xác nhận toàn bộ chuyển sang `READY`.
- Activity backfill staging dry-run: `total=5`, `migratable=4`, `alreadyV2=1`, `unknownAction=0`, `unresolvedActor=0`, `invalidV2=0`, `errors=0`.
- Activity backfill staging apply: `migrated=4`, không có unresolved/error.
- Activity backfill staging verify: `alreadyV2=5`, exit code `0`.
- Firestore Rules đã deploy vào staging; unauthenticated public traceability GET trả `200`, private Activity GET trả `403 PERMISSION_DENIED`.
- Firebase Authentication/Identity Platform chưa thể khởi tạo trên staging Spark; API `initializeAuth` trả `BILLING_NOT_ENABLED`. Quyết định ngày 2026-08-25: giữ project staging ở Spark, không liên kết Cloud Billing; authenticated role-matrix cloud chưa chạy, chỉ dùng Auth Emulator/local evidence khi cần.

Do các điều kiện trên, các mục sau vẫn giữ `[ ]`: production backfill, canary flag, Rules production cutover, authenticated role-matrix smoke và PR9 cleanup. Staging index/dry-run/apply/verify/Rules và production index `READY` đã có evidence riêng ở trên; không dùng chúng để suy ra production data/Rules đã sẵn sàng.

## 0.4. Tiếp tục xử lý legacy action và production dry-run ngày 2026-08-25

Đã hoàn tất phần classification còn thiếu mà không thay đổi dữ liệu production:

- Registry V2 và Rules đã bổ sung `DAILY_CHECK_ITEM`, `DAILY_UNCHECK_ITEM`, `DAILY_CHECK_BULK` và `DAILY_UNCHECK_BULK` theo mã nguồn Daily Checklist lịch sử; tất cả được phân loại `RESULT/RESULT_OPERATOR`, không tạo notification và không được public traceability.
- `DAILY_CHECK_*` có mức thông thường; `DAILY_UNCHECK_*` có mức cảnh báo để giữ ý nghĩa thao tác bỏ đánh dấu trong Activity Feed.
- Test backfill xác nhận action item được migrate với `targetType=REQUEST` và route `/results/{requestId}`; contract test xác nhận registry và Firestore Rules vẫn lockstep.
- `npm run test:activity` đạt `56/56`; `npm run test:firestore-rules` đạt `34/34`.
- Production dry-run lần hai đọc `4.192` log, không ghi dữ liệu: `migratable=3.165`, `unresolvedActor=1.027`, `unknownAction=0`, `missingTarget=51`, `invalidV2=0`, `errors=0`, `publicTraceableCandidates=572`.
- 1.027 unresolved hiện đều là `UNRESOLVED_ACTOR:not-found`; không còn unknown action. Hai action Daily Checklist trước đó đã được classification và không còn nằm trong unresolved report.
- Commit `3d1c09532ade` đã push lên `main`; `release:predeploy` đạt với remote cùng SHA và Vercel đã phục vụ `v26.08.25-b02`. Smoke public `/`, `/ngsw.json`, `/release-history.json` và `/changelog` đều trả HTTP `200`.
- Tại thời điểm ghi nhận mục 0.4, production apply và Rules cutover còn chờ mapping; trạng thái hoàn tất sau khi người dùng xác nhận được ghi tại mục 0.5.
- Staging vẫn giữ Spark theo quyết định người dùng; không liên kết Cloud Billing để thực hiện bước này.

## 0.5. Hoàn tất mapping, backfill và Rules production ngày 2026-08-25

Sau khi người dùng xác nhận mapping, các bước production đã được hoàn tất theo thứ tự an toàn:

- Email `oneloveonepeopleforever@gmail.com` đã được xác minh có đúng một Firebase Auth user và đúng một Firestore profile; UID của hai nguồn trùng nhau.
- Backfill tool đã bổ sung `--actor-map=<JSON ngoài repository>`; file mapping có đúng 2 alias (`Quản trị viên`, `Admin`), được validate target trước khi đọc log và lưu ngoài repository với quyền `600`.
- Mapped dry-run: `total=4.192`, `migratable=4.192`, `unresolvedActor=0`, `unknownAction=0`, `invalidV2=0`, `errors=0`, `missingTarget=274`, `publicTraceableCandidates=802`; không ghi dữ liệu.
- Production apply bounded batches đã migrate `4.192/4.192` document bằng merge update, không delete, `errors=0`.
- Production verify-only đạt `alreadyV2=4.192`, `migratable=0`, `unresolvedActor=0`, `invalidV2=0`, `unknownAction=0`, `errors=0`, exit code `0`.
- Public candidates sau mapping vẫn chỉ thuộc action allowlist đã chốt: `CREATE_VIRTUAL_MASTER`, `DIRECT_APPROVE`, `DIRECT_APPROVE_PLAN`, `EDIT_REQUEST`; không mở public theo printable hoặc displayName.
- `npm run deploy:rules` đã release Firestore Rules production thành công sau khi backfill/verify hoàn tất. Smoke unauthenticated sau cutover: public traceability GET `200`, private Activity GET `403`.
- Release `v26.08.25-b03` đã qua full release verify, `release:prepush`, `release:predeploy` và được push lên `main` tại commit `1778905`.
- Full release verify của b03 đạt; Activity suite hiện có `57/57` test pass, Firestore Rules Emulator `34/34` pass, API typecheck và production build pass.

Các mục còn giữ `[ ]` là authenticated role-matrix cloud trên staging (Identity Platform không bật được khi giữ Spark), canary flag/runtime authenticated smoke và PR9 compatibility cleanup; các mục này không còn là blocker của backfill hoặc Rules production.

## 0.6. Bổ sung UID canary cho rollout V2 ngày 2026-08-25

Để thực hiện đúng thứ tự `flag off → canary → monitor → on rộng`, release tiếp theo bổ sung lớp rollout additive:

- `activityFeedV2` và `notificationEventSyncV2` vẫn là công tắc global; chỉ `true` mới mở cho toàn bộ user đã đăng nhập.
- Khi global flag là `false`, hai mảng tùy chọn `activityFeedV2CanaryUids` và `notificationEventSyncV2CanaryUids` chỉ mở đúng cho UID được liệt kê.
- UID canary được trim/deduplicate; giá trị sai kiểu, rỗng hoặc user chưa đăng nhập đều fail-closed.
- Dashboard và Notification Center tiếp tục đọc cùng public rollout signals; không cần thay đổi policy, Rules hoặc schema event.
- `npm run test:activity` sau thay đổi đạt `61/61`; app typecheck đạt; production config đã ghi đúng 1 UID canary cho mỗi feature, còn global flags vẫn false.

Kế hoạch runtime sau release:

1. Giữ `activityFeedV2=false`, `notificationEventSyncV2=false`.
2. Gán riêng UID Manager đã xác minh vào hai mảng canary, theo dõi read/error/permission-denied.
3. Smoke Dashboard và Bell bằng tài khoản canary; nếu lỗi thì xóa hai mảng canary, không rollback dữ liệu.
4. Sau khi có evidence role matrix + observation và có quyết định rollout, bật global flags theo thứ tự reader rồi notification; giữ compatibility fields/legacy adapters cho đến khi compatibility window kết thúc và PR9 được mở riêng.

## 0.7. Manager canary runtime smoke production ngày 2026-08-25

Sau khi release `v26.08.25-b04` được Vercel phục vụ, đã xác minh bằng tài khoản quản trị cục bộ có profile `role=manager`:

- Dashboard load đúng route `#/dashboard`, hiển thị release `v26.08.25-b04`.
- UID canary được nhận đúng: nút filter V2 `Quan trọng` hiển thị và có `50` nút mở chi tiết Activity canonical.
- Activity không rơi vào trạng thái `Không có quyền xem hoạt động` hoặc `Không thể tải hoạt động`.
- Bell mở được panel `role=dialog`, không có lỗi tải thông báo; sau kiểm tra đã đóng panel.
- Console error trong phiên smoke: `0`; theo dõi thêm `15` giây sau smoke vẫn `0`.
- Staff read-only smoke bằng custom token ký local cũng pass: query `STANDARD_VIEW` đọc được `1` bản ghi và notification inbox đọc được `1` bản ghi; staff profile không nằm trong hai danh sách canary khi global flags đều false.
- Production hiện có `20` profile: `3 manager`, `17 staff`; chưa có profile `qc`, `lab`, `viewer` hoặc `pending`, nên không thể dựng cloud smoke cho các role đó mà không tạo/sửa user dữ liệu thật.
- Không thực hiện publish/reset/approve/stock mutation trên production; notification writer workflow được giữ cho fixture/Auth Emulator để tránh làm bẩn dữ liệu nghiệp vụ thật (evidence tại mục 0.9).
- Staging authenticated role matrix vẫn chưa chạy cloud vì project staging được giữ Spark; automated Rules/Auth-policy evidence vẫn là gate thay thế hiện tại.

## 0.8. Production role-matrix accounts và admin assignment ngày 2026-08-25

Theo yêu cầu dựng account đại diện cho role matrix, đã tạo bốn Firebase Auth user kiểm thử trong project production hiện tại `lims-cloud-by-otada` bằng tên định danh theo vai trò, sau đó cho từng account đăng nhập lần đầu để ứng dụng tạo profile `pending`. Việc cấp quyền được thực hiện lại từ luồng quản trị của ứng dụng tại `Cấu hình → Người Dùng & Phân Quyền` bằng tài khoản Manager đã xác minh; không ghi mật khẩu vào repository, log hoặc tài liệu.

Kết quả đọc lại trực tiếp từ Firebase sau khi bấm lưu:

| Account kiểm thử | Role | Role group | Quyền hiệu lực lưu trong profile |
|---|---|---|---:|
| `qc_lead_test@lims.com` | `staff` | `role_qc_lead` | 13 |
| `lab_technician_test@lims.com` | `staff` | `role_lab_technician` | 9 |
| `viewer_test@lims.com` | `viewer` | compatibility default | 0 |
| `pending_test@lims.com` | `pending` | compatibility default | 0 |

Auth user của cả bốn account đều `disabled=false`; profile tồn tại đúng UID; `customPermissions=[]`. Viewer/Pending vẫn fail closed theo trường `role`, vì vậy role group compatibility default không cấp quyền nghiệp vụ hoặc Activity.

Runtime smoke sau assignment:

- QC Lead đăng nhập thành công, Dashboard tải được và có các entry Activity legacy; `Quan trọng` chưa xuất hiện vì global Activity V2 vẫn OFF.
- Lab Technician đăng nhập thành công, Dashboard tải được và có các entry Activity legacy; không phát sinh permission error.
- Viewer đăng nhập thành công, Dashboard tải được nhưng Activity section không có detail entry (`0` nút mở chi tiết), không có filter `Quan trọng`; không đọc được Activity.
- Pending đăng nhập thành công và dừng đúng ở màn hình `Đang Chờ Phê Duyệt`.

Như vậy gate cloud role-matrix đại diện cho bốn role đã có evidence production an toàn ở lớp Auth/profile/UI. Chưa bật global flags và chưa thực hiện notification writer mutation trên dữ liệu nghiệp vụ production; workflow tương đương đã được kiểm chứng trong Auth/Firestore Emulator tại mục 0.9.

## 0.9. Notification workflow Emulator và kiểm tra rollback canary ngày 2026-08-25

Đã hoàn tất evidence runtime an toàn cho notification writer mà không tạo request, result, tồn kho hoặc thông báo nghiệp vụ thật trên production:

- Bổ sung Auth + Firestore Emulator vào `firebase.json`; nhánh khởi tạo Admin SDK của `/api/notifications` nhận diện emulator và không yêu cầu service-account key.
- Thêm `npm run test:notification-workflow`, chạy endpoint `dispatchEvent` thật với Auth ID token giả lập và Firestore Emulator.
- Fixture đã pass toàn bộ chuỗi: `PUBLISH_RESULT_REPORT`, `RESET_RESULT_DATA`, `REQUEST_STANDARD`, `APPROVE_STANDARD_REQUEST`, `REJECT_STANDARD_REQUEST`, `INVENTORY_LOW_STOCK` và `POST_SYSTEM_UPDATE`.
- Fixture xác nhận recipient resolution theo permission/role, actor suppression, action URL canonical, `pushStatus=no_token` khi không có FCM token và retry idempotence (`createdCount=0` ở lần gọi lại cùng `eventId`).
- `npm run test:notifications` đạt `27/27` unit/policy tests và `1/1` workflow Emulator; `npm run typecheck:api` đạt.
- Đã mở UID canary tạm thời cho Manager + bốn account role-matrix và chạy UI smoke đọc-only tại mục 0.10; không thực hiện mutation nghiệp vụ. Sau smoke, đã khôi phục `activityFeedV2CanaryUids` và `notificationEventSyncV2CanaryUids` về đúng 1 Manager UID; `activityFeedV2=false`, `notificationEventSyncV2=false`.
- `npm run release:verify` chạy lại sau thay đổi, exit code `0`; full test, Rules Emulator, typecheck app/API và production build đều pass. Build chỉ còn warning CommonJS/AMD hiện hữu.

Các gate production vẫn cố ý giữ độc lập: chưa bật global flags, chưa chạy workflow mutation thật trên dữ liệu nghiệp vụ production và chưa mở PR9 cleanup trước compatibility window. Staff default UI smoke được ghi tại mục 0.12; observation read/error được ghi tại mục 0.11.

## 0.10. V2 canary UI smoke đầy đủ bốn role ngày 2026-08-25

Sau khi người dùng xác nhận tại action-time, đã chạy smoke trên production qua luồng `Đăng nhập quản trị` bằng bốn account role-matrix. Trong suốt phiên chỉ đọc Dashboard/Bell; không publish, reset, approve/reject, chỉnh kho, đổi quyền hoặc ghi dữ liệu nghiệp vụ.

| Role | Activity V2 | Bell | Kết quả bảo mật/UI | Console error |
|---|---|---|---|---:|
| QC Lead | Filter `Quan trọng` hiển thị; `50` nút mở chi tiết canonical | Mở được dialog | Đọc Activity đúng phạm vi role | `0` |
| Lab Technician | Filter `Quan trọng` hiển thị; `50` nút mở chi tiết canonical | Mở được dialog | Đọc Activity đúng phạm vi role | `0` |
| Viewer | V2 surface hiển thị trạng thái denied; `0` nút detail | Mở được dialog | Hiện `Không có quyền xem hoạt động`, không lọt dữ liệu | `0` |
| Pending | Không vào Dashboard | Không hiển thị | Dừng đúng màn hình `Đang Chờ Phê Duyệt` | `0` |

Kết thúc smoke đã xác minh lại cấu hình production:

```text
activityFeedV2              = false
notificationEventSyncV2     = false
activityFeedV2CanaryUids    = 1 (Manager)
notificationCanaryUids      = 1 (Manager)
showLockedFeatures          = false
```

Gate còn mở sau evidence này: quyết định bật global flags, compatibility window và PR9 cleanup. Bốn-role UI smoke không được dùng để suy ra notification writer mutation production đã an toàn; phần đó vẫn dùng fixture Emulator tại mục 0.9. Staff default UI smoke được ghi tại mục 0.12.

## 0.11. Observation read/error sau canary ngày 2026-08-25

Sau khi khôi phục canary về đúng một UID Manager, đã theo dõi Dashboard production ở chế độ read-only trong `60` giây liên tục. Phiên quan sát không click thao tác nghiệp vụ, không mở form ghi dữ liệu và không thay đổi cấu hình.

```text
Thời gian (Asia/Ho_Chi_Minh) = 2026-08-25 15:34:36 → 15:35:46
Route                         = #/dashboard
Release                       = v26.08.25-b04
Activity V2 filter            = 1 nút `Quan trọng`
Canonical detail buttons      = 50
`Không có quyền xem hoạt động`= 0
`Không thể tải hoạt động`     = 0
Console error mới trong kỳ    = 0
```

Kết luận: Manager canary giữ ổn định trong cửa sổ quan sát ngắn đã chạy; không có read error hoặc permission-denied mới. Đây là evidence monitor/read-error của canary, không phải cam kết SLA dài hạn. Global flags tiếp tục giữ `false`; chưa bật rộng vì compatibility window và quyết định PR9 vẫn chưa hoàn tất.

## 0.12. Staff default UI smoke production ngày 2026-08-25

Đã xác minh một profile production có `role=staff` và `roleId=role_staff_default` bằng QR login handshake chính thức của ứng dụng. Custom token/ID token chỉ được dùng để hoàn tất handshake kiểm thử; không truyền hoặc thay đổi mật khẩu tài khoản.

Trong phiên smoke chỉ đọc Dashboard/Bell, sau đó đăng xuất bằng menu tài khoản:

| Hạng mục | Kết quả |
|---|---|
| Nhận diện phiên | `Nhân viên / staff` |
| Activity V2 | Filter `Quan trọng` hiển thị; `50` nút mở chi tiết canonical |
| Quyền Activity | Không có `Không có quyền xem hoạt động`; không có `Không thể tải hoạt động` |
| Bell | Mở được dialog; hiển thị inbox rỗng đúng profile (`0 thông báo`) |
| Console error | `0` |
| Business mutation | `0` |

Để test canary, UID Staff default được thêm tạm thời cùng UID Manager trong hai canary arrays trong khi global flags vẫn `false`. Sau smoke đã khôi phục cả hai arrays về đúng `1` UID Manager; cấu hình cuối cùng vẫn là `activityFeedV2=false`, `notificationEventSyncV2=false`, `showLockedFeatures=false`.

## 0.13. Global rollout Activity + Notification ngày 2026-08-25

Sau khi đủ Manager, QC, Lab, Viewer, Pending và Staff default smoke, đã mở global flags theo hai pha. Không tạo workflow nghiệp vụ mới trên production; notification writer vẫn được kiểm chứng bằng Auth/Firestore Emulator tại mục 0.9.

### Pha 1 — Activity V2 global

```text
activityFeedV2              = true
activityFeedV2CanaryUids    = []
notificationEventSyncV2     = false
notificationCanaryUids      = [Manager]
```

Manager Dashboard giữ filter `Quan trọng` và `50` detail buttons canonical trong cửa sổ read-only `60` giây; không có `Không có quyền xem hoạt động`, không có `Không thể tải hoạt động`, console error mới `0`.

### Pha 2 — Notification V2 global

```text
activityFeedV2              = true
activityFeedV2CanaryUids    = []
notificationEventSyncV2     = true
notificationEventSyncV2CanaryUids = []
showLockedFeatures          = false
```

Bell Manager mở được dialog và đọc đúng inbox hiện có với `6` thông báo chưa đọc; không đánh dấu, xóa hoặc tạo thông báo. Theo dõi thêm `60` giây giữ Activity `50` detail buttons, không denied/load error và console error mới `0`.

Rollback vẫn là thao tác cấu hình additive: đặt hai global flags về `false` và có thể giữ lại UID Manager trong canary arrays; schema V2, `user`, printable fields, legacy traceability ID và state adapters chưa bị xóa. Compatibility window/PR9 cleanup vẫn chưa hoàn tất và không được suy ra từ smoke global này.

## 0.14. Compatibility audit snapshot sau global rollout ngày 2026-08-25

Đã chạy lại audit production ở chế độ `verify` chỉ đọc sau khi hai global flags đã bật. Audit dùng actor map đã được validate từ bước backfill, đọc toàn bộ collection `artifacts/lims-cloud-fixed/logs`, không tạo batch và không ghi document nào.

Kết quả snapshot lúc `2026-08-25 17:17` (Asia/Ho_Chi_Minh):

```text
total                         = 4.195
schemaVersion=2               = 4.195
eventId trùng document ID     = 4.195
actorUid hợp lệ               = 4.195
actorName hợp lệ              = 4.195
user compatibility hợp lệ     = 4.195
printable field hiện diện     = 2.419
printable=true                = 950
printJobId/printableId có giá trị = 983
missing canonical identity    = 0
missing compatibility user    = 0
invalidV2 / unknownAction     = 0 / 0
unresolvedActor / errors      = 0 / 0
```

Collection hiện có `4.195` event, tăng `3` event so với snapshot `4.192` tại thời điểm apply backfill. Ba event tăng thêm là các ghi nhận nghiệp vụ V2 bình thường phát sinh trong production; không có write nghiệp vụ nào được tạo bởi Activity/Bell smoke hoặc compatibility audit. Verify toàn bộ collection trả `alreadyV2=4.195`, `migratable=0` và exit code `0`.

### Inventory consumer/fallback còn tồn tại

- `StateService.ensureLogsListener()` và `ensurePersonalLogsListener()` vẫn tồn tại như compatibility reader cho Dashboard/legacy scope. Khi Dashboard V2 hoạt động, `suspendLegacyActivityFeedListeners()` dừng các listener này nhưng cố ý giữ DeltaSync cache để rollback tức thời.
- `PrintQueueService` đã đọc ownership canonical bằng `actorUid`; listener `user/displayName` vẫn giữ cho printable log pre-backfill trong compatibility window.
- `NotificationCenterService` đã no-op legacy fan-out khi `notificationEventSyncV2=true`; compatibility bridge vẫn giữ nhánh legacy để rollback flag an toàn.
- Firestore Rules vẫn có fallback `user/displayName` cho printable log cá nhân. Chưa thể chuyển UID-only khi chưa chứng minh mọi legacy printable document đã được reader chuyển sang `actorUid` và query display-name đã hết vòng đời.
- Contract test `activity-consumer-decoupling.test.ts` hiện chủ động khóa inventory này: Print Queue phải có cả canonical UID listener và legacy name listener; Dashboard là consumer duy nhất còn dùng `StateService.logs()` trong PR3 compatibility.

### Kết luận gate

Data compatibility snapshot đạt: toàn bộ `4.195/4.195` event canonical, không còn actor/action/schema lỗi và compatibility `user` vẫn đầy đủ. Tại thời điểm snapshot này PR9 chưa mở; sau quyết định hard cutover của người dùng, implementation cleanup được ghi ở mục 0.15. Các compatibility fields trong document vẫn được giữ để bảo toàn traceability và cho phép phục hồi dữ liệu; reader/Rules fallback cũ được xử lý theo release b05.

---

## 0.15. PR9 hard cutover implementation trong release v26.08.25-b05

Đã triển khai phần cleanup legacy sau khi người dùng yêu cầu đóng toàn bộ kế hoạch. Hard cutover này không xóa document history; chỉ loại bỏ đường đọc/phân loại cũ khỏi release mới và siết ownership bằng UID. Quyết định vận hành đi kèm là các tab/phiên client cũ phải reload hoặc nhận bundle b05 trước khi tiếp tục dùng Activity/Print Queue; release b05 không duy trì legacy reader.

### Thay đổi source/rules

- Xóa `StateService.ensureLogsListener()`, `ensurePersonalLogsListener()`, `ensureActivityFeedListeners()`, `suspendLegacyActivityFeedListeners()` cùng cache/signal Activity legacy và DeltaSync cache riêng của log.
- Dashboard dùng duy nhất `ActivityFeedService`, không còn `state.logs()`, `filterDashboardActivityLogs()`, scope global/personal cũ hoặc fallback theo tên hiển thị.
- Dashboard icon, Statistics action label/class/icon, NXT movement/approval classification và Traceability action label đều đọc từ Activity Action Registry hoặc tập action canonical explicit; không còn `action.includes(...)` để suy luận module/quyền/nhãn.
- `PrintQueueService` non-manager chỉ query `printable=true + actorUid=currentUser.uid`; không còn listener `user/displayName`.
- `canReadPersonalPrintableLog()` trong Firestore Rules chỉ chấp nhận `actorUid == request.auth.uid`; compatibility `user`, `printable` và `printJobId` vẫn giữ trong dữ liệu để không mất traceability.
- Xóa utility/test `dashboard-activity` đã không còn consumer; cập nhật contract và Rules Emulator test để ngăn legacy reader/fallback quay lại.

### Automated evidence sau cleanup

```text
npm run test:activity          → 61/61 pass
npm run test:standards         → 138/138 pass
npm run test:ui-dashboard      → 2/2 pass
npm run test:firestore-rules   → 34/34 pass
npm run test:notifications     → 27/27 unit + 1/1 workflow Emulator pass
npx tsc -p tsconfig.app.json --noEmit → pass
npm run typecheck:api          → pass
npm run build                  → pass
npm run release:verify        → pass (full npm test + runtime gate + typecheck + build)
git diff --check               → pass
```

Build chỉ còn các cảnh báo CommonJS/AMD dependency hiện hữu từ Univer/React-related; không có compile error. Production deploy và authenticated smoke của release b05 được ghi tại mục 0.16.

## 0.16. Production release b05 và nghiệm thu runtime cuối ngày 2026-08-25

### Release/deployment evidence

- Commit implementation + release metadata: `d8728690b3e339fbd9aa8ee9d17484296285d0d5` (`feat(activity): complete unified feed hard cutover`), đã push thành công lên `origin/main`; local `HEAD` và `origin/main` trùng SHA, working tree sạch.
- `npm run release:prepush` và `npm run release:predeploy` đều đạt; `release:verify` trước commit đạt đầy đủ test, runtime gate, typecheck app/API và production build.
- GitHub/Vercel deployment của đúng SHA `d872869` có trạng thái `success`, deployment ID `6086280872`; preview deployment: `https://nafiqpm6-8kus8zox3-babypusscts-projects.vercel.app`.
- Alias production `https://nafiqpm6.vercel.app` đã phục vụ `release-history.json` với release mới nhất `v26.08.25-b05`; ứng dụng hiển thị badge `Nhật ký v26.08.25-b05`.

### Firestore Rules final cutover

- `npm run deploy:rules` đã deploy Rules UID-only sau khi frontend b05 đã phục vụ production; predeploy gate xác nhận local/remote cùng SHA.
- Public traceability document `TRC-1772768059788-622`: REST unauthenticated GET `200`.
- Private Activity document `01Gj87ySic0p7NayA6nb`: REST unauthenticated GET `403`.
- Authenticated QC test account bằng custom-token read-only check: query `printable=true + actorUid=currentUid` trả `200` với 1 row; query `printable=true + user=displayName` trả `403`. Không tạo, sửa, xóa hoặc reset document production trong smoke này.
- Sau khi Rules final đã deploy, không còn khoảng lệch client cũ–Rules: frontend b05 đã bỏ listener `user/displayName` trước khi ownership Rule được siết UID-only.

### Authenticated Manager runtime smoke

Đăng nhập bằng luồng `Tài Khoản → Đăng nhập LIMS` trên alias production, không dùng Google/QR và không chạy mutation nghiệp vụ:

- Dashboard tải đúng `#/dashboard`, profile hiển thị `manager`, release badge là `v26.08.25-b05`.
- Activity Feed canonical tải `50` nút `Mở chi tiết hoạt động`; không xuất hiện `Không có quyền xem hoạt động`, `Không thể tải hoạt động` hoặc `PERMISSION_DENIED`.
- Bộ lọc `Quan trọng` chuyển `aria-pressed=true` và trả đúng danh sách; khi tắt lại, toàn bộ feed và `15` nút Traceability canonical hiển thị.
- Bấm Traceability từ Activity mở thành công `#/traceability/zkWuZmLb47kORduHvJMp`; trang hiển thị Transaction ID, actor, trạng thái đã duyệt và dữ liệu hồ sơ tương ứng.
- Bell mở đúng `role=dialog`, hiển thị `6 thông báo chưa đọc`; các tab `Tất cả/Chưa đọc/Cần xử lý` cùng phản ánh số unread. Panel đã được đóng lại, không đánh dấu đọc, không xóa và không tạo notification.
- Print Queue `#/printing` tải `300` dòng printable, không có empty/error state; Manager nhìn thấy queue toàn cục đúng policy Manager.
- Console error trong các surface và sau cửa sổ quan sát `60` giây: `0`; không có chuỗi `PERMISSION_DENIED`, `Không có quyền xem hoạt động` hoặc `Không thể tải hoạt động`.

### Production read-only audit sau release

```text
config/system.activityFeedV2                    = true
config/system.notificationEventSyncV2           = true
config/system.activityFeedV2CanaryUids          = []
config/system.notificationEventSyncV2CanaryUids = []
config/system.showLockedFeatures                = false

logs total                                      = 4.195
schemaVersion=2                                 = 4.195
eventId == document ID                          = 4.195
actorUid / actorName / user hợp lệ              = 4.195 / 4.195 / 4.195
canonical identity thiếu                        = 0
logs indexes khai báo                           = 7
```

Audit dùng Admin SDK ở chế độ đọc, không tạo write nghiệp vụ. Các giá trị config được đọc lại sau deploy, không chỉnh sửa trong nghiệm thu.

### Giới hạn môi trường được chấp nhận

- Staging cloud role matrix không chạy được khi giữ Spark vì Identity Platform trả `BILLING_NOT_ENABLED`; quyết định không nâng Blaze được giữ nguyên. Evidence thay thế là bốn production role accounts, Auth/Firestore Emulator workflow và Rules matrix 34/34.
- App Badge trên OS của installed PWA/device thật chưa thể quan sát trong môi trường này; automated badge suite `5/5` đã pass cho positive count, zero/clear, setter-only fallback, unsupported API và async rejection. Không dùng giới hạn này để suy ra lỗi production.
- Permission-change live mutation trên production không được thực hiện để tránh sửa quyền tài khoản thật trong nghiệm thu; pure scope/service contract và Emulator evidence xác nhận listener scope cũ được clear trước khi publish scope mới, Viewer/Pending fail closed.

### Kết luận nghiệm thu

Release `v26.08.25-b05` đã được phát hành production, Rules final đã ở UID-only, dữ liệu Activity canonical đã verify đủ, Activity/Bell/Traceability/Print Queue đã smoke read-only và cửa sổ quan sát không phát sinh lỗi. Compatibility fields (`user`, `printable`, `printJobId`) vẫn được giữ ở document layer; chỉ legacy reader và ownership fallback bị loại bỏ. Phiên client cũ phải reload/nhận bundle b05 trước khi tiếp tục dùng các surface đã hard cutover. Rollback vẫn khả dụng bằng deployment frontend trước đó và Rules/config release trước, không cần xóa dữ liệu lịch sử.

# 1. Quyết định kiến trúc đã chốt

## 1.1. Một nguồn sự kiện, nhiều surface

Kiến trúc đích:

```text
                  BUSINESS TRANSACTION
                          │
                          ▼
                   Canonical Event
                 /logs — schema v2
                          │
          ┌───────────────┼────────────────┐
          │               │                │
          ▼               ▼                ▼
   Activity Feed      Notification      Audit Trail
   Dashboard          Bell/Toast/Push   Statistics/Export
          │               │                │
   visibility policy  recipient policy   audit policy
```

**Canonical Event** trả lời:

- Ai làm: `actorUid`, `actorName`.
- Làm gì: `action`.
- Thuộc nghiệp vụ nào: `module`.
- Ai có lý do nghiệp vụ để thấy trên Dashboard: `audience`.
- Mức độ quan trọng: `importance`.
- Tác động lên đối tượng nào: `targetType`, `targetId`, `targetName`, `requestId`.
- Bấm vào đâu: `actionUrl`.
- Event nào là cùng một sự kiện xuyên suốt các surface: `eventId`.

## 1.2. Audience phụ thuộc event, không phụ thuộc role của actor

Quy tắc bắt buộc:

> Cùng một `action` trên cùng loại nghiệp vụ phải có cùng audience dù actor là Lab Technician, QC Lead hay Manager.

Ví dụ:

```text
PUBLISH_RESULT_REPORT do Lab thực hiện      → RESULT_VIEW
PUBLISH_RESULT_REPORT do QC Lead thực hiện  → RESULT_VIEW
PUBLISH_RESULT_REPORT do Manager thực hiện  → RESULT_VIEW
```

Manager thực hiện nghiệp vụ Result **không** làm event biến thành SYSTEM/private.

Ngược lại:

```text
MAINTENANCE_ON do Manager thực hiện → SYSTEM_ADMIN
```

## 1.3. Notification là tập con của activity/domain event

Quy tắc:

> Mọi notification phải có `eventId` nguồn; không phải mọi activity đều tạo notification.

Ví dụ:

| Event | Activity | Bell | Push |
|---|---:|---:|---:|
| `SAVE_RESULT_DRAFT` | Có | Không | Không |
| `PUBLISH_RESULT_REPORT` | Có | Có theo workflow | Có theo policy |
| `RESET_RESULT_DATA` | Có | Có | Có thể có |
| `STOCK_OUT` bình thường | Có | Không | Không |
| Low-stock state transition | Có | Có | Có |
| `REQUEST_STANDARD` | Có | Có cho người duyệt | Có |
| `APPROVE_STANDARD_REQUEST` | Có | Có cho requester | Có |
| `MAINTENANCE_ON` | Chỉ admin | Có nếu cần | Có thể có |

## 1.4. Activity audience và Bell recipient là hai khái niệm khác nhau

Ví dụ một event `PUBLISH_RESULT_REPORT` có audience `RESULT_VIEW` và 15 người đủ quyền xem Dashboard. Bell **không** fan-out cho cả 15 người. Recipient của Bell chỉ gồm người thực sự cần chú ý, ví dụ requester, assignee hoặc người giữ bước workflow tiếp theo.

## 1.5. Actor suppression

Mặc định:

```text
Actor thấy Activity của chính mình      = Có, nếu vẫn còn permission của workspace
Actor thấy success toast của thao tác   = Có
Actor nhận bell về chính thao tác đó    = Không
Người liên quan khác nhận bell          = Theo notification policy
```

Ngoại lệ actor có thể nhận notification:

- background task hoàn tất sau đó;
- report async;
- import/generate dài;
- tác vụ mà completion xảy ra ngoài màn hình khởi tạo.

## 1.6. `report_view` không còn là công tắc global/personal của Dashboard

Sau V2:

- Activity Feed dựa trên audience/permission nghiệp vụ.
- `report_view` dành cho Audit/Report business rộng toàn hệ thống.
- `user_manage`/Manager mới đọc SYSTEM audit/activity.

## 1.7. Không dùng `actorUid == currentUid` như read override

Nếu user bị thu hồi quyền Result và chuyển thành Viewer, họ mất Activity Feed Result dù event cũ do chính họ tạo.

Lý do: actor identity là attribution, không phải security entitlement.

---

# 2. Baseline repo đã xác nhận trước triển khai

Các điểm dưới đây là baseline để dev biết coupling hiện tại; đây **không** có nghĩa V2 đã được triển khai.

## 2.1. Activity/Audit hiện tại

- Model hiện tại: `src/app/core/models/log.model.ts`.
- Global collection: `artifacts/{appId}/logs`.
- Dashboard dùng `state.logs()`.
- Statistics dùng `state.logs()` và `InventoryService.getLogsByDateRange()`.
- Print Queue/Request badge dùng `state.printableLogs()`.
- Traceability đọc trực tiếp `/logs/{id}`.
- Rules hiện cho `allow get: if true` trên `/logs/{id}` để phục vụ public traceability.
- Global/personal listener hiện chọn bằng `report_view`.
- Personal listener hiện query `where('user', '==', displayName)`.

## 2.2. Notification hiện tại

Các lớp sẽ **giữ lại và tái sử dụng**:

- `src/app/core/models/notification.model.ts`
- `src/app/core/services/notification-center.service.ts`
- `src/app/core/services/notification.service.ts`
- `src/app/core/services/notification-policy.ts`
- `src/app/shared/components/notification-bell/notification-bell.component.ts`
- `src/app/shared/components/notification-panel/notification-panel.component.ts`
- `api/notifications.ts`

Nền móng đang có:

- `eventId`.
- `senderUid`/`senderName`.
- `targetId`.
- `actionUrl`.
- channel `toast | inbox | push`.
- fan-out per-recipient.
- unread count.
- deep-link.
- notification document idempotence theo `eventId + recipientUid` ở API.

## 2.3. Consumer coupling cần tháo trước reader V2

Hiện các consumer sau bị chia sẻ state/log listener:

- Dashboard Activity Feed.
- Statistics/Audit.
- Print Queue.
- Request-list print badge.

Đây là lý do PR decoupling phải đi trước PR Activity reader V2.

## 2.4. Firestore index config hiện tại

Baseline ban đầu của `firebase.json` chỉ khai báo:

```json
{
  "firestore": {
    "rules": "firestore.rules"
  }
}
```

Trong worktree hiện tại `firestore.indexes.json` đã được bổ sung và `firebase.json` đã trỏ tới file; staging và production đều đã deploy và xác nhận đủ 7 index `logs` ở trạng thái `READY`. `firebase.json` cũng khai báo Auth/Firestore Emulator cho workflow fixture local.

---

# 3. Mục tiêu nghiệp vụ

Sau khi hoàn tất:

1. Người dùng thấy các hoạt động liên quan đến **workspace họ có quyền tham gia**, không chỉ hoạt động của chính mình.
2. Admin/QC/Lab thực hiện cùng một action sẽ tạo cùng audience.
3. Chuông chỉ báo sự kiện đáng chú ý hoặc cần hành động, không spam mọi activity.
4. Dashboard và Bell dùng cùng actor/target/action/deep-link nên nội dung không mâu thuẫn.
5. Audit Trail vẫn giữ góc nhìn rộng, chính xác và có kiểm soát quyền riêng.
6. Viewer/Pending không có Activity Feed.
7. Người đổi display name không mất attribution vì ownership dựa UID.
8. SYSTEM activity không lọt sang người chỉ có quyền nghiệp vụ.
9. Public QR chỉ đọc event được phép public.
10. Print Queue không phụ thuộc Activity Feed.
11. Activity có thể aggregate để giảm noise nhưng Audit vẫn giữ từng event.
12. Activity hỗ trợ search theo actor, target, request ID, SOP, standard/item name.
13. Có khái niệm “Mới kể từ lần xem trước” nhưng không tạo read-state cho từng event.
14. Có feature flag và rollback không mất dữ liệu.

---

# 4. Ngoài phạm vi của đợt triển khai này

- Không biến Activity Feed thành chat/social feed.
- Không thêm comment/reaction.
- Không xóa audit history theo retention mới nếu chưa có policy nghiệp vụ/compliance được duyệt.
- Không chuyển toàn bộ business transaction sang backend chỉ để phục vụ event system.
- Không redesign toàn bộ Notification Panel UI từ đầu.
- Không fan-out activity thành một document per user; Activity giữ event-centric, Bell mới fan-out recipient-centric.
- Không lưu secret, token, credential, raw sensitive payload trong activity metadata.
- Không dùng event stream làm nguồn dữ liệu để tính stock/result/status chính thức.

---

# 5. Canonical schema v2

## 5.1. Types đề xuất

Tạo khu vực mới:

```text
src/app/core/activity/
  activity-event.model.ts
  activity-event-registry.ts
  activity-visibility.policy.ts
  activity-notification.policy.ts
  activity-formatters.ts
```

Model khuyến nghị:

```ts
export type ActivityModule =
  | 'RESULT'
  | 'INVENTORY'
  | 'STANDARD'
  | 'SYSTEM';

export type ActivityAudience =
  | 'RESULT_VIEW'
  | 'RESULT_OPERATOR'
  | 'INVENTORY_VIEW'
  | 'INVENTORY_OPERATOR'
  | 'STANDARD_VIEW'
  | 'STANDARD_OPERATOR'
  | 'SYSTEM_ADMIN';

export type ActivityImportance =
  | 'NORMAL'
  | 'IMPORTANT'
  | 'WARNING';

export type ActivityAuditClass = 'BUSINESS' | 'SYSTEM';

export interface ActivityEvent {
  id: string;
  eventId: string;
  schemaVersion: 2;

  action: string;
  module: ActivityModule;
  audience: ActivityAudience;
  importance: ActivityImportance;
  auditClass: ActivityAuditClass;
  activityVisible: boolean;

  actorUid: string;
  actorName: string;

  targetType?: string;
  targetId?: string;
  targetName?: string;
  requestId?: string;

  actionUrl?: string;
  details: string;
  metadata?: Record<string, unknown>;

  timestamp: unknown;
  lastUpdated?: unknown;

  publicTraceable?: boolean;

  // Compatibility trong migration
  user: string;
  printable?: boolean;
  printJobId?: string;
}
```

## 5.2. Quy tắc field bắt buộc

- `eventId`: stable và idempotent trong toàn bộ Activity/Bell/Push/Audit.
- `schemaVersion`: luôn `2` với writer mới.
- `actorUid`: UID bất biến từ Firebase Auth/current profile.
- `actorName`: snapshot tên tại thời điểm thao tác.
- `user`: giữ bằng `actorName` trong giai đoạn compatibility.
- `action`: phải tồn tại trong registry.
- `module`, `audience`, `importance`, `auditClass`: lấy từ registry, không do component tùy chọn.
- `details`: feed-safe, không chứa secret/sensitive payload.
- `metadata`: structured, bounded, feed-safe.
- `publicTraceable`: mặc định `false`; chỉ set `true` nếu flow public traceability thực sự cần.
- `activityVisible`: cho phép audit-only events tồn tại mà không cần xuất hiện Dashboard.

## 5.3. Document ID và eventId

Khuyến nghị:

- Event mới: document ID = `eventId` khi không có ràng buộc legacy.
- Existing `TRC-*` log cần giữ document ID để QR/print không vỡ; `eventId` có thể bằng document ID.
- Backfill legacy: nếu không có eventId, set `eventId = legacy:<docId>` hoặc chính `docId` nếu không xung đột.
- Notification document tiếp tục deterministic theo `eventId + recipientUid`.

## 5.4. Metadata chuẩn hóa

Các key khuyến nghị, không bắt buộc mọi event có đủ:

```ts
metadata: {
  version?: number;
  oldStatus?: string;
  newStatus?: string;
  oldValue?: number | string;
  newValue?: number | string;
  unit?: string;
  reason?: string;
  count?: number;
  standardId?: string;
  inventoryItemId?: string;
  sopId?: string;
  analysisDate?: string;
  printJobId?: string;
}
```

Không đưa vào metadata:

- auth tokens;
- password;
- service credentials;
- raw uploaded file contents;
- dữ liệu không cần cho feed/audit summary;
- object lớn không bounded.

---

# 6. Registry trung tâm — nguồn sự thật của action

## 6.1. Contract

`activity-event-registry.ts` phải map mỗi action sang classification cố định:

```ts
export interface ActivityActionDefinition {
  action: string;
  module: ActivityModule;
  audience: ActivityAudience;
  importance: ActivityImportance;
  auditClass: ActivityAuditClass;
  activityVisible: boolean;

  label: string;
  iconKey: string;

  defaultActionUrl?: (event: ActivityEvent) => string | undefined;

  aggregation?: {
    enabled: boolean;
    windowMs?: number;
    keyParts?: ('actorUid' | 'targetId' | 'requestId' | 'action')[];
  };

  notification?: {
    mode: 'NONE' | 'WORKFLOW';
    type?: NotificationType;
    suppressActor?: boolean;
    defaultChannels?: NotificationChannel[];
  };
}
```

## 6.2. Không còn heuristic theo string

Mục tiêu cleanup:

- bỏ `action.includes('RESULT')` để quyết định module;
- bỏ `action.includes('STANDARD')` để quyết định module;
- bỏ `action.includes('STOCK')` để quyết định permission;
- bỏ Manager special-case trong Dashboard;
- mọi action phải được registry nhận diện.

Nếu writer dùng action chưa có registry entry, dev/test phải fail rõ ràng; không fallback thành SYSTEM.

## 6.3. Test registry bắt buộc

- [x] Mọi action literal đang ghi `/logs` có registry entry.
- [x] Mọi action hiện Dashboard formatter biết có registry entry.
- [x] Không có duplicate action key.
- [x] Không có action không xác định module/audience.
- [x] SYSTEM action không map sang business audience.
- [x] Manager thực hiện RESULT không thay classification.
- [x] QC thực hiện RESULT không thay classification.
- [x] Lab thực hiện RESULT không thay classification.
- [x] Notification type được khai báo chỉ khi mode != `NONE`.
- [x] Aggregation không bật cho destructive/approval/security action.

---

# 7. Ma trận audience và permission

## 7.1. Resolver Activity Feed

Đầu tiên fail closed theo role:

```text
pending → no activity
viewer  → no activity
manager → all permitted audiences including SYSTEM_ADMIN
staff   → resolve theo effective permissions
```

Effective permission phải dùng cùng nguồn với `AuthService.userPermissions()`; custom role dựa permission, không dựa `roleId` hard-code.

## 7.2. Predicate đề xuất

| Audience | Điều kiện đọc Activity |
|---|---|
| `RESULT_VIEW` | `sop_view` **hoặc** `batch_run` **hoặc** `sop_approve` |
| `RESULT_OPERATOR` | `batch_run` **hoặc** `sop_approve` |
| `INVENTORY_VIEW` | `inventory_view` **hoặc** `inventory_edit` |
| `INVENTORY_OPERATOR` | `inventory_edit` |
| `STANDARD_VIEW` | `standard_view` **hoặc** `standard_edit` **hoặc** `standard_approve` **hoặc** `standard_log_view` |
| `STANDARD_OPERATOR` | `standard_edit` **hoặc** `standard_approve` |
| `SYSTEM_ADMIN` | `user_manage` hoặc Manager |

Lý do dùng phép OR cho `*_VIEW`: operator không được mất event high-level chỉ vì custom role thiếu view permission do cấu hình không hoàn hảo.

## 7.3. Audit policy

| Audit class | Permission |
|---|---|
| `BUSINESS` | `report_view` hoặc Manager |
| `SYSTEM` | `user_manage` hoặc Manager |

Nếu user vừa có `report_view` vừa có `user_manage`, Audit có thể đọc cả hai.

## 7.4. Không dùng `report_view` để mở Activity global

`report_view` không tự động thêm Activity audience ngoài permission nghiệp vụ. Người có report permission có thể vào màn Audit/Statistics để xem rộng.

---

# 8. Ma trận action đề xuất ban đầu

Đây là classification khởi điểm cho PR1. Trước khi merge PR1, dev phải chạy inventory tự động toàn repo và bổ sung action còn thiếu.

## 8.1. Result / request lifecycle

| Action | Audience | Importance | Activity | Bell mặc định |
|---|---|---|---:|---:|
| `SAVE_RESULT_DRAFT` | RESULT_OPERATOR | NORMAL | Có | Không |
| `PUBLISH_RESULT_REPORT` | RESULT_VIEW | IMPORTANT | Có | Có theo workflow |
| `REVERT_RESULT_DRAFT` | RESULT_VIEW | IMPORTANT | Có | Có |
| `RESET_RESULT_DATA` | RESULT_OPERATOR | WARNING | Có | Có |
| `RESTORE_RESULT_BACKUP` | RESULT_OPERATOR | NORMAL | Có | Không |
| `RESTORE_RESULT_VERSION` | RESULT_OPERATOR | IMPORTANT | Có | Có thể không |
| `RECONCILE_RESULT_STATUS` | RESULT_OPERATOR | NORMAL | Có hoặc audit-only tùy semantics | Không |
| `UNLOCK_RESULT_EDIT` | RESULT_OPERATOR | IMPORTANT | Có | Không |
| `CREATE_VIRTUAL_MASTER` | RESULT_OPERATOR | NORMAL | Có | Không |
| `DELETE_VIRTUAL_MASTER` | RESULT_OPERATOR | WARNING | Có | Có thể có |
| `DIRECT_APPROVE` | RESULT_VIEW | IMPORTANT | Có | Theo workflow |
| `DIRECT_APPROVE_PLAN` | RESULT_OPERATOR | NORMAL | Có | Không |
| `APPROVE_REQUEST` | RESULT_VIEW | IMPORTANT | Có | Theo workflow |
| `REVOKE_APPROVE` | RESULT_VIEW | WARNING | Có | Có |
| `REVOKE_AND_REJECT` | RESULT_VIEW | WARNING | Có | Có |
| `EDIT_REQUEST` | RESULT_OPERATOR | NORMAL | Có | Không |

## 8.2. Inventory

| Action | Audience | Importance | Activity | Bell mặc định |
|---|---|---|---:|---:|
| `CREATE_ITEM` | INVENTORY_VIEW | NORMAL | Có | Không |
| `UPDATE_INFO` | INVENTORY_VIEW | NORMAL | Có | Không |
| `STOCK_IN` | INVENTORY_VIEW | NORMAL | Có | Không |
| `STOCK_OUT` | INVENTORY_VIEW | NORMAL | Có | Không |
| `SOFT_DELETE_ITEM` | INVENTORY_OPERATOR | WARNING | Có | Có thể có |
| `RESTORE_ITEM` | INVENTORY_OPERATOR | IMPORTANT | Có | Không |
| `BULK_ZERO` | INVENTORY_OPERATOR | WARNING | Có | Có |

Low-stock không nhất thiết phải là cùng action với stock write. Nên phát state-transition event riêng nếu threshold bị cắt qua:

| Action đề xuất | Audience | Importance | Bell |
|---|---|---|---:|
| `INVENTORY_LOW_STOCK` | INVENTORY_VIEW | WARNING | Có |

## 8.3. Standard lifecycle

| Action | Audience | Importance | Activity | Bell mặc định |
|---|---|---|---:|---:|
| `CREATE_STANDARD` | STANDARD_VIEW | NORMAL | Có | Không |
| `UPDATE_STANDARD` | STANDARD_VIEW | NORMAL | Có | Không |
| `UPDATE_STOCK` | STANDARD_VIEW | NORMAL | Có | Không |
| `RESTORE_STANDARD` | STANDARD_OPERATOR | IMPORTANT | Có | Không |
| `SOFT_DELETE_BATCH` | STANDARD_OPERATOR | WARNING | Có | Có thể có |
| `BULK_UPDATE_STANDARD_TAGS` | STANDARD_VIEW | NORMAL | Có | Không |
| `UNDO_NORMALIZE_STANDARD_NAMES` | STANDARD_OPERATOR | WARNING | Có | Không |
| `IMPORT_STANDARDS` | STANDARD_OPERATOR | IMPORTANT | Có | Có thể actor async |
| `IMPORT_STANDARD_USAGE_LOGS` | STANDARD_OPERATOR | IMPORTANT | Có | Có thể actor async |
| `REQUEST_COA` | STANDARD_VIEW | IMPORTANT | Có | Có cho approver |
| `REQUEST_STANDARD` | STANDARD_VIEW | IMPORTANT | Có | Có cho approver |
| `ASSIGN_STANDARD` | STANDARD_VIEW | IMPORTANT | Có | Có cho recipient |
| `APPROVE_STANDARD_REQUEST` | STANDARD_VIEW | IMPORTANT | Có | Có cho requester |
| `REJECT_STANDARD_REQUEST` | STANDARD_VIEW | WARNING | Có | Có cho requester |
| `REPORT_RETURN_STANDARD` | STANDARD_VIEW | IMPORTANT | Có | Có cho người xử lý |
| `RETURN_STANDARD` | STANDARD_VIEW | IMPORTANT | Có | Có cho requester nếu cần |
| `LOG_USAGE_STANDARD` | STANDARD_VIEW | NORMAL | Có | Không, trừ low-stock |
| `BACKFILL_USAGE_LOG` | STANDARD_OPERATOR | IMPORTANT | Có | Không |
| `DELETE_USAGE_LOG` | STANDARD_OPERATOR | WARNING | Có | Có thể có |

## 8.4. Standard tag/admin catalog

| Action | Audience | Importance | Activity |
|---|---|---|---:|
| `CREATE_STANDARD_TAG` | STANDARD_OPERATOR | NORMAL | Có hoặc audit-only |
| `UPDATE_STANDARD_TAG` | STANDARD_OPERATOR | NORMAL | Có hoặc audit-only |
| `SOFT_DELETE_STANDARD_TAG` | STANDARD_OPERATOR | IMPORTANT | Có |
| `RESTORE_STANDARD_TAG` | STANDARD_OPERATOR | IMPORTANT | Có |
| `ARCHIVE_ACCREDITATION_TAG_SEED` | STANDARD_OPERATOR | IMPORTANT | Có hoặc audit-only |

## 8.5. System

| Action | Audience | Importance | Activity | Bell |
|---|---|---|---:|---:|
| `MAINTENANCE_ON` | SYSTEM_ADMIN | WARNING | Có | Có |
| `MAINTENANCE_OFF` | SYSTEM_ADMIN | IMPORTANT | Có | Có thể có |
| `SHOW_LOCKED_ON` | SYSTEM_ADMIN | IMPORTANT | Có | Không |
| `SHOW_LOCKED_OFF` | SYSTEM_ADMIN | IMPORTANT | Có | Không |
| role/user/security changes tương lai | SYSTEM_ADMIN | WARNING/IMPORTANT | Có | Theo policy |

## 8.6. Print/traceability events

Các action như `PRINT`, `PRINT_JOB_RECORD` không được mặc định coi là Dashboard activity. PR1 phải quyết định rõ:

- nếu chỉ phục vụ Print Queue/Traceability → `activityVisible=false`, `auditClass=BUSINESS`;
- nếu có giá trị vận hành trên Dashboard → map về RESULT_VIEW nhưng không được làm Print Queue phụ thuộc Activity Feed.

Checklist:

- [x] Inventory toàn bộ `PRINT*`/traceability actions.
- [x] Xác định action nào publicTraceable.
- [x] Xác định action nào printable-only.
- [x] Không để action printable bị mất khi Activity listener đổi.

---

# 9. Notification model V2

## 9.1. Giữ hệ thống hiện có

Không thay thế:

- `NotificationCenterService`.
- `NotificationService`.
- Notification Bell/Panel.
- `/api/notifications` fan-out.
- FCM integration.

## 9.2. Bổ sung context từ canonical event

Mở rộng `NotificationEvent`/`AppNotification` theo hướng additive:

```ts
eventId: string;
activityAction?: string;
module?: ActivityModule;
targetType?: string;
targetName?: string;
requestId?: string;
```

Không bắt buộc mọi legacy notification có đủ ngay trong Release A.

## 9.3. NotificationType tối thiểu mới

Giữ toàn bộ type hiện có:

```text
COA_REQUEST
BORROW_REQUEST
REQUEST_APPROVED
REQUEST_REJECTED
RETURN_OVERDUE
STOCK_LOW_ALERT
SYSTEM_INFO
SYSTEM_UPDATE
```

Bổ sung tối thiểu khi Result integration bật:

```text
RESULT_PUBLISHED
RESULT_RESET
RESULT_REVERTED
STANDARD_RETURN_PENDING
```

Không tạo NotificationType cho mọi action. Type chỉ cần khi Bell cần cách render/policy riêng.

## 9.4. Recipient strategy

Không đồng nhất `audience` với recipient.

Ví dụ:

```text
PUBLISH_RESULT_REPORT
  activity audience = RESULT_VIEW
  notification recipients = requester + assignee + workflow stakeholders
```

```text
REQUEST_STANDARD
  activity audience = STANDARD_VIEW
  notification recipients = users đủ quyền approve/assign standard
```

```text
APPROVE_STANDARD_REQUEST
  activity audience = STANDARD_VIEW
  notification recipient = requestedBy
```

## 9.5. Server authority

Mục tiêu cuối:

```text
client/business service
   → canonical event committed
   → POST dispatch(eventId)
   → API loads event
   → validates actor/event
   → resolves notification policy
   → resolves recipients
   → excludes actor if policy says so
   → fan-out inbox
   → FCM push
```

Client không được truyền một permission/audience tùy ý rồi yêu cầu server broadcast.

## 9.6. Idempotence

- [x] Dùng cùng `eventId` cho log/notification/push.
- [x] Notification doc ID deterministic `eventId + recipientUid`.
- [x] Retry API không tạo duplicate inbox.
- [x] Push claim/retry vẫn giữ idempotence hiện tại.
- [x] Foreground FCM + toast dedupe bằng eventId.

---

# 10. Service topology sau refactor

## 10.1. `ActivityEventService`

Tạo:

```text
src/app/core/services/activity-event.service.ts
```

Nhiệm vụ:

- resolve action definition từ registry;
- resolve actor UID/name;
- build schema V2;
- sanitize details/metadata;
- tạo eventId;
- build default actionUrl;
- giữ `user=actorName` compatibility;
- hỗ trợ standalone write và transaction/batch write.

API nên tách builder và persistence:

```ts
build(input): ActivityEvent
createRef(eventId?): DocumentReference
write(event): Promise<void>
setInTransaction(transaction, ref, event): void
setInBatch(batch, ref, event): void
```

Lý do: event audit quan trọng phải có thể ghi **atomic** cùng business transaction.

## 10.2. `ActivityFeedService`

Tạo:

```text
src/app/core/services/activity-feed.service.ts
```

Chỉ phục vụ Dashboard Activity Feed.

Nhiệm vụ:

- resolve allowed audiences;
- start/stop listener theo audience;
- merge listener results;
- dedupe theo `eventId`/document id;
- sort timestamp;
- filter/search;
- aggregation;
- last-seen marker;
- clear caches ngay khi permission thay đổi;
- không cung cấp printable state;
- không cung cấp audit export.

## 10.3. `AuditLogService`

Tạo hoặc tách rõ service:

```text
src/app/core/services/audit-log.service.ts
```

Phục vụ:

- Statistics activity/audit tab.
- date-range audit queries.
- report export.
- business audit (`report_view`).
- SYSTEM audit (`user_manage`/Manager).

## 10.4. `PrintQueueService`

Print Queue không được lấy dữ liệu từ `ActivityFeedService`.

Ưu tiên nguồn:

1. `print_jobs` collection nếu đã đủ dữ liệu.
2. Nếu cần legacy printable logs, tạo query/service riêng chỉ cho printable.

Consumer phải migrate:

- `src/app/features/requests/print-queue.component.ts`.
- `src/app/features/requests/request-list.component.ts` badge.

## 10.5. Notification layer

Giữ:

```text
ActivityNotificationPolicy
       ↓
NotificationCenterService
       ↓
NotificationService / API
```

NotificationCenter tiếp tục lo channel; policy cấp domain mới lo “event này có notify không, cho ai”.

---

# 11. Decoupling bắt buộc trước reader V2

## Checklist

- [x] Liệt kê mọi consumer `state.logs()`.
- [x] Liệt kê mọi consumer `state.printableLogs()`.
- [x] Statistics chuyển sang AuditLogService hoặc giữ adapter tạm thời độc lập Activity Feed.
- [x] `getLogsByDateRange()` chuyển trách nhiệm rõ sang AuditLogService hoặc service reporting.
- [x] Print Queue chuyển khỏi activity listener.
- [x] Request badge chuyển khỏi activity listener.
- [x] Traceability direct-get vẫn hoạt động trong giai đoạn compatibility.
- [x] Không xóa `state.logs()` cho đến khi toàn bộ consumer đã migrate.
- [x] Thêm regression tests để PR reader V2 không thể làm mất printable logs.

Exit criteria:

- Dashboard có thể thay listener mà Print Queue/Statistics không thay dữ liệu.

---

# 12. Writer migration checklist

Mục tiêu: không còn business component tự dựng raw `/logs` document khi PR2 hoàn tất, trừ adapter legacy được ghi chú rõ.

## 12.1. Core / State

- [x] `state.service.ts` maintenance events.
- [x] `MAINTENANCE_ON/OFF`.
- [x] `SHOW_LOCKED_ON/OFF`.
- [x] direct approve.
- [x] direct approve plan.
- [x] approve request.
- [x] revoke approve/reject.
- [x] edit approved request.
- [x] các `TRC-*` log dùng canonical action/classification và giữ legacy traceability identity khi cần.
- [x] xác định event nào cần `publicTraceable` bằng registry/Rules allowlist.
- [x] xác định event nào cần `printable` compatibility.
- [x] đưa critical audit event vào cùng transaction/batch khi khả thi.

## 12.2. Result

- [x] Thay `ResultService.logActivity()` bằng ActivityEventService adapter.
- [x] `SAVE_RESULT_DRAFT`.
- [x] `PUBLISH_RESULT_REPORT`.
- [x] `RESTORE_RESULT_BACKUP`.
- [x] `RESTORE_RESULT_VERSION`.
- [x] `RECONCILE_RESULT_STATUS`.
- [x] `UNLOCK_RESULT_EDIT` dùng dedicated action, không giả thành `REVERT_RESULT_DRAFT`/không phát self workflow bell.
- [x] `RESET_RESULT_DATA`.
- [x] virtual master create/delete.
- [x] direct write trong `result-list.component.ts` chuyển qua canonical builder.
- [x] thêm `targetName`, `sopId`, version, requestId vào structured fields/metadata.
- [x] deep-link `/results/{requestId}`.

## 12.3. Inventory

- [x] create item.
- [x] update item info.
- [x] stock in/out.
- [x] soft delete.
- [x] restore.
- [x] bulk zero + V2 notification dispatch khi flag bật.
- [x] metadata gồm before/after/unit/reason khi an toàn.
- [x] targetId/item name rõ ràng.
- [x] low-stock state transition event chỉ phát khi `previous > threshold && next <= threshold`, tránh duplicate khi tiếp tục ở dưới ngưỡng.

## 12.4. Standards

- [x] `standard-crud.service.ts::logGlobalActivity()` chuyển thành adapter dùng ActivityEventService.
- [x] create/update/restore/delete batch.
- [x] update stock.
- [x] bulk tags.
- [x] normalize undo.
- [x] CoA request/upload context.
- [x] standard request create.
- [x] assign.
- [x] approve/reject.
- [x] pending return.
- [x] return.
- [x] usage log.
- [x] backfill usage.
- [x] rollback/delete usage.
- [x] import standards.
- [x] import usage logs.
- [x] tag catalog events.

## 12.5. Direct notification publishers cần kéo xuống domain

Các component không nên tự quyết định notification domain:

- [x] `config-general.component.ts`: publish system update đi qua `StateService.postSystemUpdate()`; component chỉ giữ UI/delete-broadcast control.
- [x] `standards-form-modal.component.ts`: không còn tự publish domain notification; workflow đi qua Standard domain services.

Sau refactor, component chỉ gọi domain service; domain service record event và trigger notification policy.

---

# 13. Atomicity và failure semantics

## 13.1. Critical business + audit

Với action làm thay đổi dữ liệu quan trọng:

- stock change;
- result publish/reset/revert;
- request approve/reject;
- standard assign/return/usage rollback;

nên ghi canonical event trong **cùng Firestore transaction/batch** với business mutation khi kiến trúc hiện tại cho phép.

Nếu event critical không ghi được → transaction fail; không để business mutation thành công nhưng audit biến mất.

## 13.2. Notification là post-commit projection

Notification không nằm trong business transaction.

Flow:

```text
transaction business + event commit
       ↓
notification dispatch best-effort/idempotent
       ↓
retry được bằng eventId
```

Nếu notification fail:

- business transaction không rollback;
- event vẫn tồn tại;
- retry không duplicate;
- UI có thể cảnh báo nhẹ “tác vụ đã thành công nhưng chưa gửi được thông báo” nếu actor cần biết.

## 13.3. Không dùng log write post-commit cho critical action nếu có thể tránh

Trong writer migration, đánh dấu từng action:

- `ATOMIC_REQUIRED`.
- `POST_COMMIT_ACCEPTABLE`.

Registry hoặc test metadata có thể lưu classification này nếu hữu ích.

---

# 14. Firestore query strategy

## 14.1. ActivityFeedService

Không query global rồi lọc Angular cho non-manager.

Mỗi allowed audience mở một listener bounded:

```ts
query(
  collection(db, `artifacts/${appId}/logs`),
  where('audience', '==', audience),
  where('activityVisible', '==', true),
  orderBy('timestamp', 'desc'),
  limit(perAudienceLimit)
)
```

Nếu index phức tạp vì `activityVisible`, có thể bỏ equality này khỏi query và đảm bảo mọi audience event activityVisible mặc định; audit-only event dùng audience riêng/hoặc query design đã test. Quyết định cuối phải dựa emulator/index thực tế, không giảm security.

Manager có thể dùng privileged global listener nếu Rules cho phép và chi phí hợp lý.

## 14.2. Merge

- merge theo `eventId` trước;
- fallback document id nếu legacy thiếu eventId;
- sort bằng normalized timestamp helper;
- limit display **sau** filter/search/aggregation phù hợp;
- clear cache cũ ngay khi permission thay đổi.

## 14.3. Audit queries

`report_view` business audit phải query có constraint:

```text
auditClass == BUSINESS
```

`user_manage`/Manager có thể query SYSTEM; Manager có thể global nếu Rules cho phép.

Không cho `report_view` query unconstrained rồi nhờ UI ẩn SYSTEM.

---

# 15. Firestore indexes

## 15.1. File mới

- [x] Tạo `firestore.indexes.json`.
- [x] Cập nhật `firebase.json` trỏ `indexes`.

## 15.2. Index tối thiểu cần đánh giá

- [x] `audience ASC + timestamp DESC`.
- [x] `audience ASC + activityVisible ASC + timestamp DESC` nếu query dùng cả ba.
- [x] `actorUid ASC + timestamp DESC` chỉ nếu còn query actor-specific ở audit/tooling.
- [x] `auditClass ASC + timestamp DESC`.
- [x] `printable ASC + timestamp DESC` nếu legacy Print Queue còn query `/logs`.
- [x] `printable ASC + actorUid ASC` cho Print Queue V2 non-manager.
- [x] `printable ASC + user ASC + timestamp DESC` giữ cho Print Queue legacy compatibility.
- [x] Notification query contract không bị regression: listener client vẫn `recipientUid == uid` + bounded limit, API revoke-group vẫn `groupId == ...`; không phát sinh composite-index dependency mới.

Lưu ý: Firestore composite index áp theo collection ID; `logs` cũng xuất hiện nested dưới standards. Review tác động trước deploy.

## 15.3. Rollout index

- [x] Deploy index trước reader V2 ở staging.
- [x] Xác nhận trạng thái READY staging.
- [x] Deploy index trước reader V2 ở production.
- [x] Xác nhận trạng thái READY production (`7/7` index `logs`).
- [x] Chỉ sau đó mới bật `activityFeedV2` (production global rollout theo thứ tự reader → notification tại mục 0.13; index production đã `READY` trước khi bật).
- [x] Có smoke query bằng role đại diện trên production và public/private Rules boundary trên staging (Manager/QC/Lab/Viewer/Pending/Staff default; authenticated staging cloud vẫn giữ `[ ]` vì Spark).

---

# 16. Firestore Rules V2

Rules là security boundary; UI filtering không được xem là bảo mật.

## 16.1. Create validation

Writer mới phải thỏa:

- [x] `isActiveUser(appId)`.
- [x] `actorUid == request.auth.uid`.
- [x] `actorName` khớp profile/email/UID canonical policy.
- [x] `schemaVersion == 2`.
- [x] `eventId` non-empty, bounded.
- [x] `action` non-empty, bounded và thuộc supported action set.
- [x] `module` thuộc enum/classification allowlist.
- [x] `audience` thuộc enum/classification allowlist.
- [x] `importance` thuộc enum/action allowlist.
- [x] `auditClass` hợp lệ.
- [x] action → module/audience/auditClass classification hợp lệ.
- [x] `timestamp == request.time`.
- [x] `lastUpdated` nếu có phải `request.time`.
- [x] `details` bounded.
- [x] metadata bounded ở Rules và được sanitize/allow-safe ở writer.
- [x] `user == actorName` trong compatibility phase.

## 16.2. Chống forged classification

Không đủ chỉ kiểm tra “audience là một enum hợp lệ”. Rules phải chặn client tạo:

```text
action = MAINTENANCE_ON
audience = RESULT_VIEW
```

hoặc:

```text
action = PUBLISH_RESULT_REPORT
audience = SYSTEM_ADMIN
```

Cách triển khai:

- Rules có helper action groups theo registry.
- Contract test kiểm tra registry và Rules không lệch nhau.
- Khi thêm action mới, test bắt buộc dev cập nhật cả registry và Rules classification.

## 16.3. Read Activity

- [x] `RESULT_VIEW` predicate đúng.
- [x] `RESULT_OPERATOR` predicate đúng.
- [x] `INVENTORY_VIEW` predicate đúng.
- [x] `INVENTORY_OPERATOR` predicate đúng.
- [x] `STANDARD_VIEW` predicate đúng.
- [x] `STANDARD_OPERATOR` predicate đúng.
- [x] `SYSTEM_ADMIN` chỉ `user_manage`/Manager.
- [x] Viewer denied list.
- [x] Pending denied list.

## 16.4. Read Audit

- [x] `report_view` đọc BUSINESS audit.
- [x] `report_view` không đọc SYSTEM audit nếu thiếu `user_manage`.
- [x] `user_manage` đọc SYSTEM audit.
- [x] Manager đọc tất cả.

## 16.5. Public traceability

Thay:

```text
allow get: if true
```

bằng policy:

```text
unauthenticated get → chỉ khi resource.data.publicTraceable == true
```

Authenticated read vẫn theo audience/audit/traceability requirement đã thiết kế.

- [x] SYSTEM event không public.
- [x] User/security event không public.
- [x] Public V2 create/read yêu cầu action allowlist, `auditClass=BUSINESS`, `requestId` hợp lệ và `targetType=REQUEST`.
- [x] Legacy traceability documents trong staging đã được backfill `publicTraceable` trước khi Rules smoke.
- [x] Legacy traceability documents trong production được backfill `publicTraceable` trước khi siết Rules (`4.192` V2 verified; `802` public candidates theo allowlist).

---

# 17. Notification backend V2

## 17.1. API hiện tại giữ nguyên behavior trong phase additive

`api/notifications.ts` hiện xử lý:

- auth token;
- role recipient;
- deterministic notification doc;
- push claim/retry;
- stale token cleanup.

Không rewrite một lần.

## 17.2. Thêm action dispatch canonical event

Đề xuất mở rộng API hoặc endpoint mới:

```text
POST /api/notifications
{
  action: 'dispatchEvent',
  appId,
  eventId
}
```

Server:

1. Verify ID token.
2. Load profile actor/caller.
3. Load canonical event theo eventId/doc id.
4. Validate event đã tồn tại và classification hỗ trợ notification.
5. Resolve notification policy theo `action`.
6. Resolve recipients từ workflow/data.
7. Exclude actor nếu `suppressActor=true`.
8. Fan-out notification docs deterministic.
9. Push theo channel policy.
10. Return counts.

## 17.3. Recipient resolver cần explicit permission, không alias mơ hồ

Hiện `role:admin` có semantics thiên về standards. V2 nên có resolver domain-specific:

- standard approvers → `standard_approve`/`standard_edit` theo workflow.
- system admins → `user_manage`/Manager.
- result stakeholders → requester/assignee/workflow owners.

Không dùng một `role:admin` chung cho mọi domain nếu nghĩa khác nhau.

## 17.4. Security tests API

- [x] User không dispatch event không tồn tại.
- [x] User không dispatch event do actor khác nếu policy không cho phép retry chung.
- [x] User không thay notification type của event.
- [x] User không truyền recipient list tùy ý cho `dispatchEvent`.
- [x] `dispatchEvent` fail closed với canonical event thiếu actor identity/display visibility hoặc `details` vượt giới hạn Rules.
- [x] Retry cùng eventId idempotent.
- [x] Actor suppression đúng.
- [x] Manager/system broadcast rules không regression.

---

# 18. Dashboard Activity Feed V2

## 18.1. UI structure

Giữ timeline theo ngày, nhưng item chuyển sang semantic:

```text
Actor → Action → Target → Context → Deep link
```

Ví dụ Result:

> **Admin** đã xuất bản báo cáo kết quả
> **SOP ABC · Mẻ 240825-01 · v2**
> 10:32 · Kết quả · Xem kết quả

Inventory:

> **Nguyễn Văn A** đã điều chỉnh tồn kho
> **Methanol · 12.5 → 10.0 L**
> 09:48 · Kho · Xem thẻ kho

## 18.2. Filter

Primary filter đề xuất:

```text
Tất cả
Kết quả
Kho
Chuẩn
Hệ thống   (chỉ khi user có SYSTEM_ADMIN)
```

Secondary:

```text
Quan trọng
```

“Duyệt” nên là tag/secondary filter nếu cần, không nhất thiết là module riêng.

## 18.3. Search

Search phải dùng structured fields:

- actorName;
- targetName;
- targetId;
- requestId;
- action label;
- details.

Không phụ thuộc việc ID/name vô tình xuất hiện trong `details`.

## 18.4. Deep link

- [x] Result → `/results/{requestId}`.
- [x] Traceability → `/traceability/{requestId}` khi `publicTraceable=true` và có requestId; canonical helper encode identifier và fail closed nếu thiếu điều kiện.
- [x] Standard → `/standards/{targetId}`.
- [x] Standard request → route/workflow phù hợp hiện có.
- [x] Inventory → hiện dùng `/inventory`; chưa tạo URL detail giả khi chưa có canonical item route.
- [x] System → config route đúng permission.
- [x] Bell dùng cùng canonical action URL builder/source semantics.

## 18.5. Empty/denied state

- User có Activity permission nhưng không có event → “Chưa có hoạt động phù hợp”.
- Viewer/Pending/no feed → ẩn panel hoặc hiển thị denied state có chủ đích; không giả thành “không có dữ liệu”.

---

# 19. Aggregation / giảm noise

Activity Feed có thể aggregate; Audit không aggregate.

## 19.1. Candidate

`SAVE_RESULT_DRAFT`:

```text
key = actorUid + requestId + action
window = 10 phút
```

Dashboard:

> A đã cập nhật kết quả SOP X · **8 lần** · lần cuối 10:42

## 19.2. Không aggregate

- publish;
- reset;
- revert;
- approve/reject;
- delete/restore;
- stock destructive bulk operation;
- security/system events;
- workflow transition cần truy vết rõ.

## 19.3. Test

- [x] Aggregate chỉ trong window.
- [x] Khác actor không merge.
- [x] Khác request/target không merge.
- [x] Destructive event không merge.
- [x] Filter/search áp dụng trước display limit phù hợp.
- [x] Timestamp malformed không crash aggregation.

---

# 20. “Mới kể từ lần xem trước”

Không dùng notification `isRead`.

## 20.1. Storage

Đề xuất:

```text
artifacts/{appId}/user_preferences/{uid}
```

Field:

```ts
lastActivitySeenAt
```

## 20.2. Semantics

- update khi Dashboard Activity thực sự được user xem/active theo policy UI đã chọn;
- không tạo per-event read document;
- divider “Mới kể từ lần truy cập trước”;
- mark-all-read bell không cập nhật lastActivitySeenAt;
- xem Dashboard không mark Bell as read.

## 20.3. Rules

User chỉ read/write preference của chính mình; Manager không cần quyền xem preference người khác nếu không có use-case.

---

# 21. Nội dung nhất quán giữa Dashboard và Bell

Tạo formatter chung ở lớp domain, không reuse nguyên câu UI.

Canonical event:

```text
action = PUBLISH_RESULT_REPORT
actorName = Admin
targetName = SOP ABC
metadata.version = 2
actionUrl = /results/REQ-123
```

Dashboard formatter:

> Admin đã xuất bản báo cáo kết quả · SOP ABC · v2

Bell formatter:

> Báo cáo kết quả đã được xuất bản · Admin · SOP ABC · v2

Hai surface khác wording nhưng cùng structured data.

Checklist:

- [x] Không duplicate hard-coded action labels trong Dashboard và Statistics nếu registry cung cấp được; Statistics derive standalone label từ registry, Dashboard legacy/V2 đều ưu tiên registry cho registered action.
- [x] Notification title/message builder lấy event context.
- [x] actionUrl giống nhau giữa Dashboard/Bell theo canonical builder semantics.
- [x] actorName/targetName thống nhất trong canonical event/notification context.

---

# 22. Migration dữ liệu legacy

## 22.1. Script

Tạo:

```text
scripts/backfill-activity-events.ts
```

Modes:

```text
--dry-run
--apply
--verify
```

Optional:

```text
--limit N
--start-after <docId>
--output <path>
```

## 22.2. Fields backfill

- [x] `eventId`.
- [x] `schemaVersion=2` hoặc migration marker phù hợp.
- [x] `actorUid`.
- [x] `actorName`.
- [x] `module`.
- [x] `audience`.
- [x] `importance`.
- [x] `auditClass`.
- [x] `activityVisible`.
- [x] `publicTraceable`.
- [x] `targetType/targetName/actionUrl` khi xác định chắc chắn; unknown/ambiguous giữ unresolved thay vì đoán.

## 22.3. Mapping actor

Ưu tiên:

1. legacy `user` đúng UID.
2. email exact unique.
3. displayName exact unique.
4. không unique/không tìm thấy → `UNRESOLVED`.

Không tự đoán khi trùng displayName.

## 22.4. Mapping action

- action có registry → classify deterministic.
- action unknown → `UNKNOWN_ACTION`, không apply classification bừa.

## 22.5. Report migration

Script phải xuất ít nhất:

```text
total
alreadyV2
migratable
migrated
unresolvedActor
invalidV2
unknownAction
missingTarget
publicTraceableCandidates
errors
```

Nên có JSON + Markdown summary; không chứa secrets.

## 22.6. Idempotence

- chạy lại không đổi event đã v2 đúng;
- không tạo duplicate;
- update bounded batch;
- checkpoint được;
- verify mode so sánh counts trước/sau.

## 22.7. Fail-closed contract đã triển khai local

- Tài liệu có `schemaVersion=2` hoặc `eventId == documentId` nhưng thiếu classification/identity/fields bắt buộc được phân loại `INVALID_V2`, không bị coi là legacy để rewrite.
- `isCanonicalV2()` yêu cầu `id == documentId`, `eventId == documentId`, action có registry, classification khớp registry, `actorUid`, `actorName`, `user == actorName`, `details`, timestamp và boolean `publicTraceable`.
- `--verify` trả exit code khác 0 nếu còn `INVALID_V2`, `UNKNOWN_ACTION`, unresolved actor hoặc write error; report JSON/Markdown giữ reason để review thủ công.
- Public candidate không còn suy luận chỉ từ `printable`/`printJobId`; đây là điểm bắt buộc review trước khi production apply.

---

# 23. Feature flags và compatibility

Tối thiểu:

```text
activityFeedV2
notificationEventSyncV2
```

Có thể thêm:

```text
activityAggregationV2
activityLastSeenV2
```

## 23.1. Rollback behavior

`activityFeedV2=false`:

- Dashboard quay về reader cũ trong compatibility window.
- schema v2 vẫn tiếp tục tồn tại.
- không rollback/mất data.

`notificationEventSyncV2=false`:

- notification legacy publisher vẫn dùng đường cũ cho các workflow chưa migrate.

## 23.2. Compatibility field

Trong ít nhất một chu kỳ release sau reader V2:

- giữ `user`.
- giữ printable fields.
- giữ legacy traceability ID.
- không xóa state adapters cho đến khi consumer kiểm chứng xong.

---

# 24. Rollout theo release

## Release A — Additive foundation, không đổi reader production

Mục tiêu: writer/model mới tồn tại nhưng behavior đọc cũ vẫn hoạt động.

Checklist:

- [x] activity models.
- [x] registry.
- [x] visibility policy pure functions.
- [x] notification policy pure functions.
- [x] ActivityEventService.
- [x] writer mới ghi schema v2 + legacy `user`.
- [x] notification legacy vẫn hoạt động khi flag V2 off.
- [x] index file được deploy và xác nhận READY ở staging và production (`7/7` `logs` indexes).
- [x] Rules V2 đã có local/emulator evidence và production read Rules cutover sau backfill/verify.
- [x] feature flag V2 default false khi config không bật.

Exit: data mới bắt đầu giàu schema nhưng production UI không đổi.

## Release B — Decouple consumers + backfill

- [x] Statistics tách Audit.
- [x] Print Queue tách Activity.
- [x] Request print badge tách Activity.
- [x] backfill dry-run staging (`total=5`, `migratable=4`, `alreadyV2=1`, unresolved/invalid/unknown/error = 0).
- [x] staging apply small batch (`migrated=4`) và verify (`alreadyV2=5`, exit code `0`).
- [x] production dry-run lần hai (`total=4.192`, `migratable=3.165`, `unresolvedActor=1.027`, `unknownAction=0`, `errors=0`; không ghi dữ liệu).
- [x] classification các action Daily Checklist lịch sử; không còn unknown action.
- [x] resolve `1.027` legacy actor bằng 2 alias đã được người dùng xác nhận và target profile/Auth UID đã verify.
- [x] production apply bounded batches (`migrated=4.192`, không delete, `errors=0`).
- [x] verify report (`alreadyV2=4.192`, exit code `0`).

Exit: reader V2 có thể bật mà không ảnh hưởng consumer khác.

## Release C — Activity Feed V2

- [x] ActivityFeedService.
- [x] audience listeners.
- [x] merge/dedupe.
- [x] Dashboard V2.
- [x] deep-link canonical cho Result/Standard/Inventory/System.
- [x] search/filter.
- [x] flag default off → canary → on (global rollout evidence tại mục 0.13; rollback vẫn giữ được).

Exit: Activity audience symmetry hoạt động production.

## Release D — Notification event sync

- [x] shared eventId.
- [x] Result notification types.
- [x] domain recipient resolver.
- [x] standard notification publishers migrate theo compatibility bridge.
- [x] config/system publishers migrate theo compatibility bridge.
- [x] actor suppression.
- [x] retry/idempotence tests.

Exit: Bell là projection của canonical event cho workflow đã migrate.

## Release E — Security cutover

- [x] Rules V2 action/audience validation đã implement local.
- [x] Viewer/Pending deny đã pass emulator.
- [x] auditClass read restrictions đã pass emulator.
- [x] publicTraceable get rule đã pass emulator.
- [x] emulator matrix pass local.
- [x] old clients đã qua compatibility window theo quyết định hard cutover: client/phiên cũ phải reload hoặc nhận bundle b05; không còn legacy reader sau b05. Compatibility fields ở document layer vẫn giữ để bảo toàn traceability/khả năng phục hồi dữ liệu.

Exit: backend enforce đúng policy, không phụ thuộc UI.

## Release F — UX enrichment/cleanup

- [x] aggregation.
- [x] last-seen.
- [x] “Quan trọng”.
- [x] bỏ legacy heuristics trong Dashboard/Statistics/Traceability bằng registry canonical.
- [x] bỏ legacy personal listener.
- [x] bỏ `state.logs()` khỏi Dashboard.
- [x] giữ legacy `user` ở document layer để bảo toàn traceability; không dùng làm ownership reader.

---

# 25. Chia PR triển khai chi tiết

## PR1 — Activity schema, registry và policy thuần

### Files dự kiến

- `src/app/core/activity/activity-event.model.ts`
- `src/app/core/activity/activity-event-registry.ts`
- `src/app/core/activity/activity-visibility.policy.ts`
- `src/app/core/activity/activity-notification.policy.ts`
- tests tương ứng.

### Checklist

- [x] Define enums/types.
- [x] Inventory toàn bộ action hiện tại bằng script/test.
- [x] Registry đủ action.
- [x] Audience resolver fail closed viewer/pending.
- [x] Manager full.
- [x] Custom role permission-based.
- [x] Notification subset policy.
- [x] Actor suppression pure policy.
- [x] Action URL builders unit-testable.
- [x] Foundation additive không buộc production reader đổi khi flag off.

### Exit criteria

- Unit tests pass.
- No behavior change.

---

## PR2 — ActivityEventService + additive writer migration

### Checklist

- [x] Service builder/persistence.
- [x] actorUid/name canonical.
- [x] `user` compatibility.
- [x] eventId stable.
- [x] sanitize metadata.
- [x] transaction/batch support.
- [x] Result writers migrate.
- [x] Inventory writers migrate.
- [x] Standard writers migrate.
- [x] System writers migrate.
- [x] direct component log writes loại bỏ/adapter ở global Activity path.
- [x] critical actions atomic where feasible.
- [x] traceability/print fields preserved.

### Exit criteria

- New logs are V2-compatible.
- Old Dashboard/Statistics/Print still work.

---

## PR3 — Decouple Audit và Print Queue khỏi Activity Feed

### Checklist

- [x] AuditLogService.
- [x] Statistics migrate.
- [x] date-range report migrate; duplicate InventoryService API đã bỏ.
- [x] PrintQueueService.
- [x] print queue component migrate.
- [x] request badge migrate.
- [x] state compatibility adapter retained only where legacy Dashboard còn cần.
- [x] regression tests.

### Exit criteria

- Activity listener can be replaced without changing Print/Statistics data.

---

## PR4 — Indexes + migration tooling

### Checklist

- [x] `firestore.indexes.json`.
- [x] `firebase.json` indexes entry.
- [x] backfill script dry-run/apply/verify modes.
- [x] unresolved report.
- [x] idempotence.
- [x] bounded batch/checkpoint.
- [x] tests with fixtures.
- [x] staging dry-run.
- [x] production dry-run evidence lần hai (`4.192` logs, `unknownAction=0`, `unresolvedActor=1.027`, no write).
- [x] production apply evidence (`4.192` migrated với actor map ngoài repository).
- [x] production verify evidence (`4.192` alreadyV2, exit code `0`).

### Exit criteria

- Index READY.
- Production migration report reviewed.

---

## PR5 — ActivityFeedService + Dashboard V2

### Checklist

- [x] audience listeners.
- [x] cache scope by user/effective permissions.
- [x] stop old listener on permission change.
- [x] clear old in-memory scope trước publish scope mới.
- [x] merge/dedupe.
- [x] formatter registry.
- [x] filter/search.
- [x] deep-links canonical.
- [x] SYSTEM filter conditional.
- [x] denied vs empty state.
- [x] feature flag.
- [x] UI contract tests.

### Exit criteria

- Scenario Admin/Lab/QC symmetry pass.
- Print Queue/Statistics regression pass.

---

## PR6 — Notification synchronization

### Checklist

- [x] Extend notification model additive.
- [x] shared eventId.
- [x] `dispatchEvent` backend.
- [x] Result notification types.
- [x] standard workflow migration qua canonical projection + legacy flag bridge.
- [x] low-stock policy migration.
- [x] system/config migration.
- [x] actor suppression.
- [x] recipient resolution tests.
- [x] push retry/dedupe tests.
- [x] foreground duplicate tests.

### Exit criteria

- One business event → one coherent activity + zero/one notification per intended recipient.

---

## PR7 — Rules V2 + emulator security matrix

### Checklist

- [x] schema v2 create validation.
- [x] actorUid anti-forgery.
- [x] action classification validation.
- [x] audience read helpers.
- [x] auditClass helpers.
- [x] publicTraceable rule.
- [x] Viewer/Pending deny.
- [x] Manager/user_manage/report_view matrix.
- [x] emulator tests.
- [x] contract test registry ↔ rules.

### Exit criteria

- Security matrix 100% pass.
- No required production query denied in staging.

---

## PR8 — Aggregation + last-seen + UX polish

### Checklist

- [x] aggregation registry config.
- [x] aggregate formatter.
- [x] lastActivitySeenAt preference.
- [x] preference Rules.
- [x] divider mới.
- [x] important filter.
- [x] search structured fields.
- [x] responsive/mobile/a11y regression: search/header stack ở mobile, filter vẫn horizontal-scroll, feed expose `aria-busy`, toggle dùng `aria-pressed`, V2 action/traceability controls có accessible label + focus-visible contract.

### Exit criteria

- Feed giảm noise nhưng Audit vẫn đầy đủ.

---

## PR9 — Cleanup legacy

Chỉ mở sau compatibility window.

### Checklist

- [x] bỏ `where('user','==',displayName)` personal listener.
- [x] bỏ global/personal Dashboard scope cũ.
- [x] bỏ `canViewActivityLog()` heuristic.
- [x] bỏ Manager special-case Dashboard.
- [x] bỏ action string includes classification.
- [x] bỏ state Activity adapters không còn consumer.
- [x] giữ `user` vì traceability/rollback dữ liệu vẫn cần; reader ownership đã chuyển UID-only.
- [x] document migration completion tại mục 0.15.

---

# 26. Test strategy chi tiết

## 26.1. Unit — registry

- [x] Every current action registered.
- [x] Unknown action fails loudly.
- [x] Same action returns same audience regardless actor role.
- [x] SYSTEM actions always SYSTEM_ADMIN.
- [x] Importance stable.
- [x] Notification policy stable.
- [x] Deep link generation correct.

## 26.2. Unit — visibility

- [x] Manager → all audiences.
- [x] QC Lead default → result + inventory + standard according effective permissions, not SYSTEM_ADMIN unless user_manage.
- [x] Lab Technician → result operator/view + inventory as configured + standard view as configured.
- [x] Staff default → only audiences allowed by its view permissions.
- [x] Custom staff with permissions works independent roleId.
- [x] Viewer → none.
- [x] Pending → none.
- [x] report_view alone does not grant SYSTEM activity.
- [x] user_manage grants SYSTEM_ADMIN.

## 26.3. Unit — aggregation

- [x] repeated drafts aggregate.
- [x] different actor no merge.
- [x] different request no merge.
- [x] outside window no merge.
- [x] destructive actions never merge.

## 26.4. Notification

- [x] event not configured for notification → no inbox.
- [x] configured event → recipients only.
- [x] actor suppressed.
- [x] retry same eventId no duplicate.
- [x] FCM eventId same.
- [x] toast dedupe same eventId.
- [x] unauthorized broadcast denied.
- [x] user cannot update/delete another user's notification.

## 26.5. Dashboard contract

- [x] shared primitives retained.
- [x] filter labels.
- [x] SYSTEM hidden without permission.
- [x] importance rendering.
- [x] target/deep link.
- [x] denied state.
- [x] empty state.
- [x] search actor/target/id.
- [x] timestamp malformed safe.

---

# 27. Firestore Emulator matrix — blocking trước Rules deploy

## Actors test fixture tối thiểu

```text
manager
qcLead
labA
labB
staffDefault
customReportOnly
customUserManage
viewer
pending
```

## Activity read scenarios

- [x] LabA query RESULT_OPERATOR succeeds.
- [x] LabA sees RESULT event created by Manager.
- [x] LabA sees RESULT event created by QC Lead.
- [x] LabA sees RESULT event created by LabB nếu cùng audience.
- [x] LabA cannot read SYSTEM.
- [x] Staff without inventory cannot read INVENTORY.
- [x] Inventory viewer reads INVENTORY_VIEW.
- [x] Inventory viewer without edit cannot read INVENTORY_OPERATOR nếu event operator-only.
- [x] Standard viewer reads STANDARD_VIEW.
- [x] Viewer cannot list Activity.
- [x] Pending cannot list Activity.
- [x] Manager reads all.

## Audit scenarios

- [x] `report_view` reads BUSINESS audit.
- [x] `report_view` cannot query SYSTEM audit without `user_manage`.
- [x] `user_manage` reads SYSTEM audit.
- [x] Manager reads all audit.

## Create anti-forgery

- [x] forged actorUid denied.
- [x] forged actorName denied according canonical policy.
- [x] forged audience denied.
- [x] forged module denied.
- [x] SYSTEM action classified as RESULT denied.
- [x] client timestamp denied.
- [x] oversized details denied.
- [x] unknown action denied bởi strict local Rules V2.

## Public

- [x] unauthenticated get publicTraceable event succeeds.
- [x] unauthenticated get non-public business event fails.
- [x] unauthenticated get SYSTEM event fails.

---

# 28. Scenario nghiệm thu nghiệp vụ

## Scenario A — vấn đề gốc: Admin publish Result

Given:

- Admin = Manager.
- Lab = user có Result workspace permission.
- QC = QC Lead.
- Viewer = Viewer.

When Admin `PUBLISH_RESULT_REPORT`.

Then Activity:

```text
Admin   ✅
Lab     ✅
QC      ✅
Viewer  ❌
```

Bell:

```text
Admin actor             ❌ self-bell
workflow recipient      ✅
người chỉ có view nhưng không cần chú ý → không bắt buộc bell
```

## Scenario B — Lab publish cùng Result

Activity audience phải đối xứng Scenario A:

```text
Lab     ✅
QC      ✅
Admin   ✅
```

Không có phân nhánh “actor là manager thì ẩn”.

## Scenario C — Admin maintenance

```text
Admin                      ✅
QC thiếu user_manage       ❌
Lab                        ❌
Viewer                     ❌
```

## Scenario D — Admin stock adjustment

Nếu action = `STOCK_OUT`/`STOCK_IN` được classify INVENTORY_VIEW:

```text
inventory viewer     ✅
inventory operator   ✅
admin                ✅
no inventory access  ❌
```

Nếu action destructive operator-only, test theo INVENTORY_OPERATOR.

## Scenario E — Rename display name

- history attribution vẫn liên kết qua `actorUid`;
- feed display có thể dùng actorName snapshot hoặc user cache cho avatar;
- query không phụ thuộc displayName.

## Scenario F — User bị hạ thành Viewer

- Activity listener stop.
- cache clear ngay.
- history không tiếp tục đọc được chỉ vì actorUid trùng.

## Scenario G — Notification retry

- event dispatch lần 1 tạo notification.
- retry cùng eventId không duplicate.
- push retry claim đúng.

## Scenario H — Public QR

- QR traceability event public vẫn mở được.
- SYSTEM log có id biết trước vẫn không public.

---

# 29. Performance, cost và read budget

## 29.1. Activity listeners

- Không mở listener cho audience user không có quyền.
- Giới hạn per-audience bounded, ví dụ 50–100 tùy profiling.
- Merge client sau listener; không query unbounded.
- Không đọc full audit history cho Dashboard.
- Không fan-out activity per user.

## 29.2. Notification

- Bell tiếp tục recipient-scoped query.
- Fan-out chỉ event đáng notify.
- Không fan-out Activity cho mọi người.

## 29.3. Cache

Cache key phải bao gồm:

- user identity;
- effective permissions/audiences;
- schema/reader version nếu cần.

Khi permission đổi:

1. stop listeners cũ;
2. clear old in-memory data;
3. clear/destroy cache scope không còn hợp lệ;
4. start listeners mới;
5. publish state mới.

Không cho data global cũ nằm lại khi user bị giảm quyền.

---

# 30. Observability và diagnostics

## 30.1. Read monitor

Tiếp tục dùng `FirestoreReadMonitor` cho:

- initial Activity listeners;
- delta reads;
- notification listener;
- Audit queries;
- Print Queue query.

## 30.2. Log server

Notification dispatch log nên có:

```text
eventId
action
recipientCount
createdCount
pushSentCount
pushFailureCount
```

Không log secret/token đầy đủ.

## 30.3. Migration metrics

Lưu report ngoài DB hoặc admin-safe location:

- unknown actions;
- unresolved actor;
- backfill counts;
- query/index errors.

## 30.4. Runtime smoke checklist

- [x] Dashboard first load không permission error trong local authenticated-manager smoke; route `#/dashboard` tải hoàn chỉnh và không có console error.
- [x] Bell unread count đúng trong local smoke: header báo 6 chưa đọc, panel và filter tabs cùng phản ánh 6.
- [x] Activity click deep-link đúng trong local smoke: Activity `Truy Xuất` mở `#/traceability/{requestId}` và tải đúng hồ sơ theo ID.
- [x] permission change clear feed không reload cứng trong contract/service layer: pure scope test xác nhận permission reduction đổi `scopeKey`, Viewer downgrade trả scope rỗng; service contract xác nhận đọc realtime `currentUser/userPermissions` và gọi clear trước khi publish scope mới. Post-deploy browser smoke vẫn chỉ kiểm tra read-only surface, không tự ý sửa permission production.
- [x] mobile Notification Panel không regression ở viewport 390×844: dialog fit đúng 390px, không tạo horizontal overflow và close control vẫn visible.
- [ ] app badge không regression trên installed PWA/device thật. Automated evidence: 5 test pass cho positive count, clear zero, setter-only fallback, unsupported API và asynchronous rejection handling. Giữ `[ ]` vì môi trường nghiệm thu hiện tại không có installed PWA/device thật để quan sát OS badge; đây là acceptance limitation, không phải compile/runtime blocker.

---

# 31. Retention

Không tự đặt retention audit mới trong dự án này.

Nguyên tắc:

- Dashboard query window có thể giới hạn 30–90 ngày hoặc N events mà **không xóa** audit record.
- Bell hiện có cleanup policy riêng; giữ độc lập Activity.
- Audit deletion/retention chỉ thay đổi khi có yêu cầu nghiệp vụ/compliance rõ ràng.

---

# 32. Security hardening bổ sung

- [x] Không public toàn bộ `/logs/{id}`; unauthenticated get chỉ qua `publicTraceable BUSINESS`.
- [x] Không tin audience client; Rules kiểm tra action → module/audience/auditClass/importance/activityVisible.
- [x] Không cho Viewer/Pending list qua `userExists()` fallback.
- [x] Canonical ownership dùng UID (`actorUid`); displayName chỉ còn fallback đọc legacy trong compatibility window.
- [x] Notification recipient của `dispatchEvent` do server resolve; client không truyền recipient list để mở rộng broadcast.
- [x] Activity metadata đi qua sanitizer và bounded validation; credential-like/sensitive keys bị loại trước write.
- [x] Không có audit-only sensitive detail được nhét vào feed-readable event; nếu phát sinh nhu cầu sẽ tách collection riêng.

---

# 33. Test/gate command theo repo hiện tại

Trong từng PR chạy nhóm liên quan. Trước release quan trọng chạy tối thiểu:

```bash
npm run test:activity
npm run test:notifications
npm run test:notification-workflow
npm run test:standards
npm run test:ui-dashboard
npm run test:firestore-rules
npx tsc -p tsconfig.app.json --noEmit
npm run typecheck:api
npm run build
```

Gate cuối:

```bash
npm run release:verify
```

Khi deploy Rules/index theo quy trình repo, đi qua release/deploy gate tương ứng; không bỏ emulator tests.

---

# 34. Rollback plan chi tiết

## 34.1. Reader V2 lỗi

Action:

1. `activityFeedV2=false`.
2. giữ writer schema v2.
3. Dashboard quay legacy reader.
4. kiểm tra cache clear.
5. không rollback backfill.

## 34.2. Notification V2 lỗi

1. `notificationEventSyncV2=false`.
2. workflow đã có legacy notification path quay về path cũ nếu compatibility còn giữ.
3. event canonical vẫn lưu.
4. notification missing có thể retry theo eventId sau khi fix.

## 34.3. Rules lỗi sau deploy

Ưu tiên:

1. xác định query bị deny từ emulator/staging reproduction;
2. rollback Rules về phiên bản trước nếu production blocked;
3. **không** mở tạm `allow list: if isSignedIn()`;
4. giữ data/index/schema additive.

## 34.4. Backfill lỗi

- stop apply batch;
- report checkpoint;
- không xóa field cũ;
- sửa script và rerun idempotent;
- chỉ undo field V2 nếu có evidence cần thiết, không rewrite business fields.

---

# 35. Definition of Done toàn dự án

Chỉ coi hạng mục hoàn tất khi tất cả mục sau đúng:

## Architecture

- [x] Một action có duy nhất một định nghĩa module/audience/importance trong central registry.
- [x] Actor role không thay đổi audience.
- [x] Activity và Notification chia sẻ eventId.
- [x] Notification là subset/projection của event theo registry policy.
- [x] Audit và Activity Feed có read service/query riêng.
- [x] Print Queue không phụ thuộc Activity Feed.

## Identity/security

- [x] Actor identity dựa UID; actorName là snapshot hiển thị.
- [x] Viewer/Pending không có Activity Feed.
- [x] SYSTEM chỉ user_manage/Manager.
- [x] `report_view` chỉ mở business audit, không tự mở SYSTEM.
- [x] forged actor/audience/module/classification denied.
- [x] public traceability chỉ `publicTraceable BUSINESS`.

## Behavior

- [x] Admin làm Result vẫn hiện cho user có Result permission theo audience, không theo actor role.
- [x] Lab/QC/Admin cùng action có audience đối xứng.
- [x] Bell recipient resolve đúng workflow policy ở server tests.
- [x] Actor không bị self-bell mặc định cho workflow notification.
- [x] Deep-link Dashboard/Bell dùng cùng canonical action URL semantics.
- [x] Search structured fields hoạt động.
- [x] aggregation chỉ là presentation; canonical audit documents không bị gộp/xóa.
- [x] rename display name không làm mất canonical ownership/history attribution dựa UID; Print Queue có regression test rename.
- [x] downgrade permission làm listener scope cũ dừng/clear và Rules revoke access ngay.

## Migration

- [x] Legacy logs đã backfill (`4.192/4.192`, không unresolved/error).
- [x] Unknown actions = 0 trước strict Rules.
- [x] Index READY production (`7/7` `logs` indexes).
- [x] Feature flags tồn tại và rollback reader/notification projection được.
- [x] Compatibility fields/legacy adapters chưa bị xóa sớm.

## Verification

- [x] Unit tests pass (`npm test` trong release gate).
- [x] Notification tests pass.
- [x] UI dashboard/contracts pass.
- [x] Firestore Emulator matrix pass 34/34.
- [x] Print/Statistics/Traceability regressions pass trong contract/full test suites.
- [x] TypeScript app pass.
- [x] API typecheck pass.
- [x] Build pass.
- [x] `npm run release:verify` pass ngày 2026-08-25.
- [x] Runtime smoke đầy đủ bằng mọi role đại diện pass (Manager/QC/Lab/Viewer/Pending/Staff default đã có evidence UI canary hoặc denied/approval-state tương ứng).

---

# 36. Checklist thao tác triển khai theo thứ tự thực tế

## Trước khi code

- [x] PR1 scope đã được triển khai và merge theo chuỗi release trên `main`; repository không tạo branch/PR tách riêng cho các PR1–PR3 lịch sử.
- [x] Ghi baseline/action inventory tự động bằng registry contract test.
- [x] Ghi baseline test counts/evidence trong mục 0.1.
- [x] Không sửa `.agents/AGENTS.md` hoặc `DEPLOYMENT.md` ngoài scope; giữ nguyên thay đổi có sẵn của người dùng.

## Nền tảng

- [x] PR1 outcome merge theo release commit trên `main` (không có PR artifact tách riêng).
- [x] PR2 outcome merge theo release commit trên `main` (không có PR artifact tách riêng).
- [x] PR3 outcome merge theo release commit trên `main` (không có PR artifact tách riêng).

## Dữ liệu/index

- [x] PR4 index deploy staging; 7 `logs` indexes đã đạt `READY`.
- [x] staging dry-run.
- [x] staging apply.
- [x] staging verify.
- [x] production index deploy.
- [x] production index READY (`7/7` index `logs`).
- [x] production dry-run (`4.192` logs, no write).
- [x] review unresolved report trước mapping (`1.027` actor chưa xác định, `unknownAction=0`; không tự động gán khi chưa có xác nhận).
- [x] production apply (`4.192` migrated, không delete).
- [x] production verify (`4.192` alreadyV2, exit code `0`).

## Reader V2

- [x] PR5 merge flag off (`v26.08.25-b04`, global flag vẫn false).
- [x] smoke with Manager (production UID canary, Dashboard/Bell, console error `0`).
- [x] smoke with QC Lead (production test account, V2 canary Dashboard/Bell, `Quan trọng`, 50 detail buttons, console error `0`).
- [x] smoke with Lab (production test account, V2 canary Dashboard/Bell, `Quan trọng`, 50 detail buttons, console error `0`).
- [x] smoke with one existing Staff profile (read-only `STANDARD_VIEW` query; custom token ký local).
- [x] smoke with Staff default (production QR handshake, V2 canary, `Quan trọng`, 50 detail buttons, Bell dialog, console error `0`; canary sau smoke khôi phục Manager-only).
- [x] smoke Viewer/Pending denied/hidden (Viewer V2 denied với 0 detail entry, Bell mở được; Pending dừng ở màn hình chờ duyệt, không có Bell; console error `0`).
- [x] canary flag on (UID-scoped, 1 Manager; global flag vẫn false).
- [x] monitor read/errors (Manager canary read-only 60 giây, 0 console error mới, 0 Activity denied/load error).
- [x] flag on rộng (Activity global trước, Notification global sau; Activity/Bell read-only smoke + observation `60` giây, config cuối cùng hai global flags `true`, canary arrays rỗng).

## Notification V2

- [x] PR6 merge flag off (canonical writer/legacy bridge đã deploy; global flag vẫn false ngoài UID canary).
- [x] test result publish (Auth/Firestore Emulator dispatch fixture).
- [x] test result reset (Auth/Firestore Emulator dispatch fixture).
- [x] test standard request/approve/reject (Auth/Firestore Emulator dispatch fixture).
- [x] test low-stock (Auth/Firestore Emulator dispatch fixture).
- [x] test system update (Auth/Firestore Emulator dispatch fixture).
- [x] test actor suppression (recipient assertions + retry fixture).
- [x] canary flag on (UID-scoped, 1 Manager; chưa chạy writer mutation production).
- [x] flag on rộng (Notification global sau khi Activity global pass; Bell Manager đọc inbox hiện có, không mutation nghiệp vụ).

## Security cutover

- [x] PR7 emulator pass (`npm run test:firestore-rules` — 34/34).
- [x] staging Rules deploy và public/private HTTP smoke (`200` public, `403` private).
- [x] staging role matrix smoke cloud được đóng bằng quyết định giữ Spark: Identity Platform trả `BILLING_NOT_ENABLED`; dùng Auth/Firestore Emulator, production role accounts và Rules matrix local làm evidence thay thế, không nâng Blaze.
- [x] production Rules deploy.
- [x] production public QR smoke (public GET `200`).
- [x] production Dashboard/Bell smoke bằng Manager canary; Activity V2 filter, Bell dialog và console error `0`.

## Enrichment/cleanup

- [x] PR8 (aggregation, last-seen, important filter, structured search và mobile/a11y contracts; release verify pass).
- [x] compatibility window complete theo hard-cutover decision; compatibility fields giữ ở document layer nhưng legacy reader/ownership fallback đã hết vòng đời trong b05.
- [x] PR9 cleanup implementation hoàn tất tại mục 0.15; production deploy, Rules cutover và runtime evidence hoàn tất tại mục 0.16.
- [x] final release verify (`npm run release:verify` exit code `0` sau khi thêm notification workflow Emulator).
- [x] update implementation checklist evidence (mục 0.9 và các checklist runtime đã cập nhật).

---

# 37. Evidence template cho mỗi PR/release

Khi hoàn tất một bước, ghi evidence theo mẫu:

```text
PR/Release:
Date:
Commit SHA:
Feature flags:

Tests:
- command → pass count/status

Firestore:
- emulator → pass
- indexes → READY/not applicable
- rules → deployed/not deployed

Migration:
- total:
- migrated:
- unresolved:
- unknownAction:

Runtime smoke:
- Manager:
- QC Lead:
- Lab:
- Staff:
- Viewer/Pending:

Known issues:
Rollback tested:
```

---

# 38. Rủi ro chính và mitigation

| Rủi ro | Mức | Mitigation |
|---|---|---|
| Rules siết trước backfill làm client cũ lỗi | Cao | additive release + feature flag + Rules cutover sau |
| Activity reader làm Print Queue mất data | Cao | PR3 decouple trước PR5 |
| Manager action bị classify SYSTEM sai | Cao | registry action-based + unit/emulator scenario |
| Client forge audience | Cao | Rules action→audience validation |
| SYSTEM log public qua id | Cao | `publicTraceable` + Rules cutover |
| Duplicate bell/push | Trung bình/Cao | shared eventId + deterministic doc + push claim |
| Notification spam | Trung bình | notification subset + recipient workflow + actor suppression |
| DisplayName đổi làm mất personal history | Trung bình | actorUid + no displayName query |
| Composite index chưa ready | Cao | deploy index trước reader |
| Legacy action không map | Cao | dry-run unknownAction report; fail strict cutover |
| Too many listeners do nhiều audience | Trung bình | bounded listener, merge, read monitor, optimize after profiling |
| Sensitive audit metadata lộ cho workspace | Cao | feed-safe event schema; tách audit detail nếu cần |
| Backfill actor trùng tên | Trung bình | exact UID/email/unique displayName; unresolved, không đoán |

---

# 39. Quyết định cần giữ nguyên trong quá trình triển khai

1. Không quay lại mô hình “Lab chỉ thấy log cá nhân” như thiết kế cuối.
2. Không biến `report_view` thành quyền Activity global.
3. Không dùng role actor để quyết định audience.
4. Không gửi Bell 1:1 với mọi Activity.
5. Không dùng `notifications` collection làm nguồn trực tiếp cho Dashboard.
6. Không xóa `/logs` ngay; migrate additive vì Traceability/Statistics/Print đang phụ thuộc.
7. Không public SYSTEM log.
8. Không tự đoán actor khi backfill ambiguous.
9. Không bypass Rules chỉ để query dễ hơn.
10. Không coi Activity read-state và Notification read-state là một.

---

# 40. Điểm bắt đầu triển khai được khuyến nghị

Thứ tự đầu tiên:

```text
PR1 — schema + registry + pure policies
  ↓
PR2 — writer additive v2
  ↓
PR3 — decouple Audit/Print
```

Ba PR này phải hoàn tất trước khi đổi production Activity semantics.

Sau đó:

```text
PR4 — indexes + backfill
  ↓
PR5 — Activity Feed V2
  ↓
PR6 — Notification synchronization
  ↓
PR7 — Rules V2
  ↓
PR8/PR9 — enrichment + cleanup
```

Đây là trình tự giảm rủi ro nhất cho repo hiện tại vì `/logs` đang đồng thời phục vụ Dashboard, Statistics, Print Queue và Traceability, trong khi chuông `/notifications` đã có một nền recipient-scoped tốt và nên được tái sử dụng thay vì viết lại.
