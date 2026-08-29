# Hướng dẫn triển khai

Tài liệu này áp dụng cho bản Angular/Vercel hiện tại và thay đổi materialized daily checklist trong Firestore.

## Quy ước phát hành phiên bản mới và changelog

Mọi release mới phải đi qua cùng một nguồn nội dung là `release-notes.json`. Không sửa trực tiếp `CHANGELOG.md` hoặc `public/release-history.json` vì hai file này được sinh lại bởi pipeline đồng bộ phiên bản.

`release-notes.json` bắt buộc có đủ bốn nhóm sau, kể cả khi một nhóm không có nội dung mới thì vẫn giữ mảng rỗng `[]`:

```json
{
  "title": "Tiêu đề ngắn mô tả trọng tâm bản phát hành",
  "highlights": [],
  "features": [],
  "improvements": [],
  "fixes": []
}
```

Quy ước hiển thị thống nhất trên toàn hệ thống:

- `highlights` → **Điểm Nổi Bật Bản Này**
- `features` → **Tính Năng Mới**
- `improvements` → **Cải Tiến & Tối Ưu**
- `fixes` → **Sửa Lỗi Hệ Thống**

Các bản lịch sử cũng phải có đủ bốn nhóm. Nhóm không có thay đổi sẽ hiển thị thông báo `Không có thay đổi trong nhóm này.` thay vì bị ẩn, để mọi phiên bản có cùng một template.

Trình tự release chuẩn:

1. Tổng hợp thay đổi kể từ release gần nhất và cập nhật `release-notes.json` theo đúng bốn nhóm trên.
2. Chạy `npm run release:prepare`. Lệnh này chỉ phát sinh **một** version mới khi `release-notes.json` thực sự đại diện cho release mới; nếu chạy lại trong cùng release thì giữ nguyên version. Lệnh đồng bộ `package.json`, `package-lock.json`, metadata, bảo toàn `public/release-history.json` cũ và tái tạo `CHANGELOG.md`.
3. Chạy `npm run release:verify`. Gate này kiểm tra Node/npm đúng chính sách repository, chạy toàn bộ test, typecheck application/API, kiểm tra release metadata và production build.
4. Review `git status`, `git diff --check` và diff thực tế. Chỉ stage đúng phạm vi release cần phát hành.
5. Commit release. Sau commit, chạy `npm run release:prepush`; gate sẽ chặn khi working tree còn dirty, có conflict, branch local đang behind remote hoặc tracking ref đã stale.
6. Push commit. `main` và pull request vào `main` được GitHub Release Gate chạy `release:discipline` và `release:verify`; Node lấy từ `.nvmrc`, còn npm được đọc trực tiếp từ `package.json.packageManager` để không tồn tại bản version thứ hai trong CI.
7. Sau khi push `main`, Vercel Git Integration tạo production deployment nhưng **không gán domain production ngay**. Deployment Check bắt buộc `Vercel - nafiqpm6: release-verify` chỉ được cập nhật thành công sau khi toàn bộ GitHub Release Gate đạt; khi gate fail/cancel/không chạy, alias tiếp tục phục vụ deployment ổn định trước đó. Không chạy `npm run release:predeploy`, `npm run deploy:prod`, `npx vercel --prod` hoặc Force Promote trong quy trình frontend chuẩn.
8. Nếu release có thay đổi Firestore Rules, chạy `npm run deploy:rules` sau khi commit đã được push và lưu bằng chứng CLI thành công. Lệnh này tự chạy `release:predeploy` để xác nhận SHA local/remote trước khi deploy Rules.
9. Theo dõi deployment Vercel gắn với đúng Git SHA và xác nhận Deployment Check đã đạt trước khi alias chuyển; sau đó smoke test `/`, `/ngsw.json`, `/release-history.json`, trang `/changelog` và modal Nhật Ký Cập Nhật.

Không deploy production trực tiếp từ working tree chưa commit hoặc commit chưa push. Quy tắc này bảo đảm mỗi deployment luôn truy ngược được về đúng một Git SHA, giúp audit và rollback không phụ thuộc trạng thái máy phát hành.

Project Vercel duy nhất của ứng dụng là `nafiqpm6`, dùng Git Integration để build `main` và Deployment Checks để chặn promotion trước CI. `npm run deploy:prod` được giữ lại như lệnh fallback/manual khi có yêu cầu break-glass rõ ràng; thao tác này vẫn phải qua `release:predeploy`, kiểm tra release metadata của commit cuối và phải được ghi nhận bằng SHA/deployment ID.

## Backup toàn diện LIMS trên Spark

Backup/restore toàn diện được triển khai bằng API serverless của Vercel và Google Drive API. Thiết kế này **không dùng Firestore managed export/import, Cloud Storage hoặc Cloud Functions**, vì vậy không cần chuyển Firebase sang Blaze chỉ để chạy backup. Tất cả payload được nén và mã hóa AES-256-GCM trước khi upload Drive.

### Biến môi trường bắt buộc

Thiết lập ở Vercel Production, Preview (nếu cần kiểm thử) và môi trường chạy API; không đặt trong Angular `environment.*`, không commit và không đưa vào changelog:

| Biến | Mục đích |
|---|---|
| `FIREBASE_SERVICE_ACCOUNT` | Service account cho Firebase Admin SDK; giữ nguyên cơ chế hiện tại. |
| `APP_ID` hoặc `LIMS_APP_ID` | Phải là `lims-cloud-fixed`, khớp namespace `artifacts/lims-cloud-fixed`. |
| `LIMS_BACKUP_ENCRYPTION_KEY` | Khóa 32 byte, biểu diễn bằng 64 ký tự hex hoặc base64. Mất khóa đồng nghĩa không thể giải mã backup. |
| `LIMS_BACKUP_ENCRYPTION_KEY_ID` | Tên phiên bản khóa, ví dụ `primary-2026`; phải được giữ nguyên để verify/restore. |
| `LIMS_BACKUP_DRIVE_FOLDER_ID` | Thư mục Drive private dùng làm parent của toàn bộ thư mục `LIMS_BACKUP_*`. |
| `GOOGLE_OAUTH_CLIENT_ID` | OAuth client ID của server-side authorization-code flow. |
| `GOOGLE_OAUTH_CLIENT_SECRET` | OAuth client secret; chỉ lưu trong Vercel secret. |
| `OAUTH_COOKIE_SECRET` | Secret hiện có để mã hóa cookie OAuth server-side. |

### Quyền Drive dùng cho backup

Luồng upload báo cáo thông thường tiếp tục dùng scope hạn chế `drive.file`. Backup toàn diện dùng `/api/oauth/google/start?mode=backup`, yêu cầu quản trị viên cấp `https://www.googleapis.com/auth/drive` để có thể đọc **cả tệp đã tồn tại trên Drive**, bao gồm CoA, PDF, Docs mẫu và Excel/Sheets do Apps Script hoặc người dùng tạo trước đó. Luồng này đồng thời yêu cầu hai scope chỉ đọc của Apps Script là `https://www.googleapis.com/auth/script.projects.readonly` và `https://www.googleapis.com/auth/script.deployments.readonly` để chụp nội dung project/deployment đang chạy, không chỉ bản `.gs` trong source bundle. Nếu không muốn giữ refresh token trong cookie quản trị, có thể cấu hình:

| Biến | Mục đích |
|---|---|
| `LIMS_BACKUP_DRIVE_REFRESH_TOKEN` | Refresh token của một tài khoản backup riêng đã cấp full Drive scope; đây là phương án phù hợp cho restore khi không có browser session. |
| `LIMS_DRIVE_SOURCE_FOLDER_IDS` | Danh sách folder ID nguồn, phân tách bằng dấu phẩy. Nên cấu hình rõ cả thư mục báo cáo và thư mục CoA. |
| `LIMS_DRIVE_COA_FOLDER_ID` | Folder CoA riêng; mặc định dùng folder CoA hiện tại đã kiểm kê. Engine luôn đưa folder này vào coverage để tránh cấu hình root bị thiếu CoA. |
| `LIMS_DRIVE_ROOT_FOLDER_ID` hoặc `GOOGLE_DRIVE_FOLDER_ID` | Fallback một folder nguồn khi không dùng danh sách ở trên. |
| `LIMS_DRIVE_TEMPLATE_IDS` | Danh sách ID các Google Docs/Sheets mẫu; nếu bỏ trống, engine dùng catalog hiện đang có trong `gas/SOP_Configs.gs`. |
| `LIMS_BACKUP_DRIVE_RESTORE_FOLDER_ID` | Folder đích an toàn để tạo lại file/folder bị xóa khi restore. Bắt buộc nếu muốn phục hồi object đã mất khỏi Drive Trash. |
| `LIMS_APPS_SCRIPT_ID`, `LIMS_APPS_SCRIPT_DEPLOYMENT_ID`, `LIMS_APPS_SCRIPT_WEB_APP_URL` | Metadata deployment Apps Script; `LIMS_APPS_SCRIPT_ID` ưu tiên hơn `scriptId` trong `.clasp.json`. Source `.gs`, `appsscript.json`, `.clasp.json`, nội dung project live và danh sách deployment live đều được snapshot mã hóa vào backup. |
| `LIMS_BACKUP_MIN_DRIVE_FREE_BYTES` | Tùy chọn; nếu Drive trả về storage limit, backup dừng trước khi tạo folder khi dung lượng trống thấp hơn ngưỡng này. Không đặt giá trị nếu tài khoản/Shared Drive không có quota hữu hạn. |

Refresh token backup phải thuộc đúng tài khoản có quyền đọc folder nguồn và ghi folder backup. Không dán token vào Firestore, Google Docs, issue, log hoặc giao diện. Nếu source folder nằm trong Shared Drive, tài khoản phải được cấp quyền tương ứng và API cần được kiểm tra trên chính Shared Drive đó.

### Giới hạn function trên Vercel Hobby

Vercel Hobby giới hạn số Serverless Functions trong một deployment. Để không phát sinh billing, các thao tác `create`, `list`, `inspect`, `verify`, `restore` và `status` được định tuyến qua một function chung `api/backup.ts`; các URL `/api/backup/<operation>` cũ vẫn được giữ bằng rewrite. Luồng OAuth backup dùng chung function `/api/oauth/google/start` với `mode=backup`, còn `/api/oauth/google/status` được giữ bằng rewrite tương thích. Không xóa hoặc đổi các rewrite này nếu chưa kiểm tra lại tổng số function production.

### Giới hạn quota và Auth restore

Để không để một lần chạy ăn hết quota Spark, engine mặc định dừng nếu một backup vượt 40.000 document reads. Có thể điều chỉnh có kiểm soát bằng:

```text
LIMS_BACKUP_MAX_FIRESTORE_READS=40000
LIMS_BACKUP_MAX_FIRESTORE_WRITES=18000
```

Không đặt hai giá trị này sát trần nếu ứng dụng vẫn đang phục vụ người dùng. Manifest lưu lại số reads/writes và số byte/API request Drive; cần theo dõi sau mỗi lần chạy.

Firebase Auth được backup riêng theo trang 1.000 user. Nếu `UserRecord` có password hash, restore Auth cần thêm `LIMS_BACKUP_AUTH_HASH_ALGORITHM` cùng các tham số hash tương ứng (`LIMS_BACKUP_AUTH_HASH_KEY`, `LIMS_BACKUP_AUTH_SALT_SEPARATOR`, `LIMS_BACKUP_AUTH_HASH_ROUNDS`, `LIMS_BACKUP_AUTH_HASH_MEMORY_COST`, `LIMS_BACKUP_AUTH_HASH_PARALLELIZATION`, `LIMS_BACKUP_AUTH_HASH_BLOCK_SIZE`, `LIMS_BACKUP_AUTH_HASH_DERIVED_KEY_LENGTH` khi thuật toán yêu cầu). Thiếu hash configuration sẽ làm restore dừng trước khi import phần Auth để không tạo tài khoản không đăng nhập được.

Mặc định `LIMS_BACKUP_ALLOW_UNKNOWN_COLLECTIONS` không bật. Catalog schema active hiện có 32 collection; `daily_checks`, `public` và `stats_aggregates` được giữ riêng trong retained legacy catalog để bảo toàn dữ liệu lịch sử/audit nhưng không được coi là schema active. Audit production ngày 29/08/2026 xác nhận `public` và `stats_aggregates` chỉ còn dữ liệu legacy không có consumer trong source hiện tại. Nếu audit phát hiện collection Firestore khác ngoài active + retained legacy catalog, backup sẽ được tạo với trạng thái thất bại để không tuyên bố coverage toàn diện giả. Chỉ bật biến này sau khi đã review schema và cập nhật catalog.

### Vận hành bắt buộc

1. Trong Config → Hệ thống & Dữ liệu, cấp quyền Drive backup và bấm **Tạo backup mới**.
2. Chờ trạng thái hoàn tất; manifest phải ghi đủ Firestore, Auth, Drive assets, folder và cả live project/deployment Apps Script. Nếu backup đã có checkpoint nhưng dừng/thất bại do lỗi Drive hoặc live Apps Script tạm thời, chọn đúng backup đó và dùng **Tiếp tục backup dở dang** để retry/repair tại chỗ; deployment part và manifest hiện có được cập nhật in-place thay vì tạo bản trùng. Nếu thiếu Apps Script scope, có asset 404/không hỗ trợ hoặc live API vẫn trả lỗi sau retry, backup phải ở trạng thái thất bại và không được coi là bản backup toàn diện.
3. Bấm **Kiểm tra integrity**; thao tác này tải và giải mã thử từng part và từng encrypted Drive asset, so checksum plaintext/ciphertext và record count.
4. Bấm **Dry-run đối chiếu** trước mỗi restore; dry-run không ghi Firestore, không sửa Auth và không sửa Drive.
5. Restore thông thường dùng **Restore an toàn — chỉ bổ sung phần bị thiếu**. Dữ liệu hiện có không bị ghi đè; file Drive bị Trash được khôi phục giữ nguyên ID, file đã mất hẳn được tạo lại và mapping URL trong Firestore được thay theo ID mới.
6. Full replace chỉ gọi được với confirmation riêng, một backup dự phòng khác đã verify và scope phù hợp. Không dùng cho thao tác thường ngày.
7. Định kỳ ít nhất mỗi tháng phải chạy một dry-run trên bản backup gần nhất và ghi nhận kết quả. Ít nhất mỗi quý phải diễn tập restore vào folder/project kiểm thử nếu có thể.

Không xóa bản backup cũ ngay sau khi tạo bản mới. Giữ tối thiểu ba bản hoàn tất và một bản ngoài tài khoản Drive chính nếu yêu cầu disaster recovery bao gồm mất tài khoản Google.

## Chính sách lưu giữ thông báo

Notification inbox chỉ lưu dữ liệu trong 7 ngày kể từ `createdAt`. Cleanup chính
được thực hiện bởi Vercel Cron gọi `/api/notifications-retention` mỗi ngày lúc
18:15 UTC (01:15 giờ Việt Nam; tài khoản Vercel Hobby có thể chạy trong phạm vi
giờ đã cấu hình). Endpoint xác thực bằng `CRON_SECRET`, lấy app ID từ `APP_ID`
hoặc `LIMS_APP_ID`, rồi xóa theo query `createdAt < cutoff`.

Để cron hoạt động trên production, Vercel project phải có các biến môi trường:

- `FIREBASE_SERVICE_ACCOUNT`: service account hiện đang dùng cho các API Admin.
- `APP_ID`: `lims-cloud-fixed` (đã có trong cấu hình triển khai hiện tại).
- `CRON_SECRET`: chuỗi bí mật riêng, tối thiểu 16 ký tự; không commit vào repo,
  không đưa vào release notes và không ghi vào log.

Cleanup chia batch 400 document và giới hạn 2.000 document mỗi lần chạy để giữ
dư địa cho quota Spark. Nếu response/log trả `quotaCapped: true`, cron sẽ tiếp
tục xử lý phần còn lại ở lần chạy kế tiếp; cần kiểm tra lưu lượng nếu tình trạng
này lặp lại.

Không dùng Firestore TTL hoặc Firebase Cloud Functions cho chính sách này vì đây
là các capability cần cân nhắc ngoài phạm vi Spark. Không áp dụng retention này
cho Activity/audit logs (`artifacts/{appId}/logs`) hoặc
`user_preferences.lastActivitySeenAt`; đó là các dữ liệu có vòng đời độc lập.

`npm run release:discipline` so sánh phạm vi thay đổi với base Git. Nếu code ứng dụng, API, GAS, Firestore hoặc cấu hình production thay đổi mà version/release notes không đổi, gate sẽ fail. Commit chỉ thay đổi docs, workflow hoặc test không cần phát sinh version; `scripts/vercel-ignore-build.js` sẽ bỏ qua Vercel build cho các commit đó.

Nếu chỉ chuẩn hóa template hoặc bảo trì lịch sử cũ mà không phát hành code mới, không phát sinh version mới; dùng `npm run sync-release-history` rồi `node scripts/build-changelog-md.js` để tái tạo dữ liệu và Markdown.

Không chạy `npm version patch/minor/major` để đánh số release CalVer. Các alias `release:patch`, `release:minor`, `release:major` đều đi qua cùng một pipeline `release:prepare` nhằm tránh tăng version hai lần. Chỉ dùng `RELEASE_FORCE_BUMP=1 npm run release:prepare` khi có chủ đích tạo một release mới dù nội dung release notes chưa thay đổi.

Không đưa credential, token, dữ liệu production hoặc mô tả kỹ thuật nội bộ không cần thiết vào changelog dành cho người dùng.

## Trạng thái trước triển khai

Không lưu trạng thái pass/fail của một release cụ thể trong tài liệu quy trình này vì thông tin đó nhanh chóng lỗi thời. Bằng chứng phát hành phải lấy từ output của `release:discipline`, `release:verify`, GitHub Release Gate, Vercel Deployment Check và trạng thái deployment gắn với chính Git SHA đang phát hành; với Firestore Rules thì dùng output CLI của lệnh deploy Rules.

## 1. Chuẩn bị

Yêu cầu:

- Node.js theo `.nvmrc`/`package.json` và npm theo `packageManager` trong `package.json`. `npm run verify:runtime` sẽ chặn release nếu ba nguồn này lệch nhau hoặc runtime máy phát hành không đúng policy.
- Quyền deploy Firebase project `lims-cloud-by-otada`.
- Quyền xem project/deployment Vercel để xác nhận trạng thái và smoke test; không cần Vercel CLI để deploy frontend theo quy trình chuẩn.
- Firebase service account được lưu ở vị trí bảo mật và không commit vào Git.

Tại thư mục repository:

```powershell
npm ci
```

Nếu PowerShell chặn `npm.ps1`, dùng `npm.cmd` thay cho `npm` trong các lệnh bên dưới.

## 2. Kiểm tra bắt buộc trước deploy

```powershell
npm run release:verify
```

`release:discipline` chặn code production không có release metadata mới. `release:verify` bắt đầu bằng runtime gate, sau đó chạy `npm test`, TypeScript application/API typecheck, `validate:release-notes` và Angular production build. Chỉ tiếp tục khi cả hai lệnh trả về exit code `0`. Output Angular production phải nằm tại:

```text
dist/lims-cloud-pro/browser
```

Sau commit và trước push:

```powershell
npm run release:prepush
git push
```

Sau push, Vercel Git Integration build từ GitHub nhưng chỉ gán production alias sau khi check `Vercel - nafiqpm6: release-verify` thành công. Không cần chạy thêm gate `release:predeploy` cho frontend. Gate này chỉ còn được dùng bởi các lệnh triển khai hạ tầng/manual có yêu cầu xác nhận SHA local/remote, ví dụ `npm run deploy:rules`.

## 3. Đăng nhập công cụ triển khai

Firebase:

```powershell
npx firebase-tools login
npx firebase-tools use lims-cloud-by-otada
```

Không cần đăng nhập Vercel CLI cho frontend release chuẩn vì deployment được kích hoạt từ GitHub. Chỉ cần đăng nhập Vercel CLI khi thực hiện một thao tác manual/fallback được yêu cầu riêng.

## 4. Deploy Firestore rules

Review thay đổi trong `firestore.rules`, đặc biệt collection:

```text
artifacts/{appId}/daily_checklists/{analysisDate}
```

Deploy rules sau khi commit đã được push:

```powershell
npm run deploy:rules
```

Xác nhận lệnh hoàn tất thành công và deployment Vercel của cùng release đã sẵn sàng trước khi thực hiện các bước backfill hoặc xác minh production phụ thuộc Rules mới.

## 5. Xác nhận Vercel auto-deploy trước khi backfill

Sau khi commit release được push lên `main`, chờ GitHub Release Gate và Vercel Deployment Check của đúng Git SHA hoàn tất. Chỉ chấp nhận production khi alias trỏ đúng deployment đã qua check. Không chạy thêm `npm run deploy:prod` cho cùng commit.

Vercel Git Integration sử dụng:

- Build command: `npx ng build --configuration=production --no-progress`
- Output directory: `dist/lims-cloud-pro/browser`

Chỉ chấp nhận deployment khi Angular build hoàn tất không lỗi và deployment gắn đúng commit release. Hotfix này phải lên trước backfill để document Daily Checklist bị thiếu vẫn fallback về `requests` thay vì biến thành ngày rỗng.

## 6. Smoke test hotfix trước khi ghi production data

1. Mở Daily Checklist tại một ngày có materialized document và xác nhận dữ liệu hiển thị đúng.
2. Mở một ngày chưa có `daily_checklists/{date}` nhưng có request nguồn và xác nhận UI vẫn hiển thị nhờ fallback.
3. Tạo/cập nhật một request thử nghiệm có `sampleDescriptionMap` chỉ chứa `{ nameSnapshot }`, không có `masterId`, và xác nhận nghiệp vụ nguồn vẫn thành công.
4. Xác nhận lỗi projection giả lập/quan sát được không làm SmartBatch/direct approve thất bại.

Chỉ tiếp tục backfill sau khi smoke test hotfix đạt.

## 7. Chuẩn bị credential cho backfill

Script hỗ trợ một trong hai cơ chế:

1. Biến môi trường `FIREBASE_SERVICE_ACCOUNT` chứa toàn bộ JSON service account.
2. Application Default Credentials của Google.

Ví dụ dùng service account trong PowerShell:

```powershell
$env:FIREBASE_SERVICE_ACCOUNT = Get-Content 'C:\secure\lims-service-account.json' -Raw
$env:LIMS_APP_ID = 'lims-cloud-fixed'
```

Không in biến `FIREBASE_SERVICE_ACCOUNT` ra terminal, log CI hoặc artifact build.

## 8. Dry-run backfill

Dry-run đọc dữ liệu production và báo số request/ngày dự kiến, nhưng không ghi Firestore:

```powershell
npm run backfill:daily-checklists -- --dry-run --app-id=lims-cloud-fixed
```

Kiểm tra output:

- App ID là `lims-cloud-fixed`.
- Số request và số ngày materialized hợp lý.
- Không có lỗi credential hoặc project.
- Có thông báo `Dry run: no Firestore writes were made.`

## 9. Chạy backfill production

Lệnh này ghi hoặc ghi đè các document theo ngày tại `artifacts/lims-cloud-fixed/daily_checklists` và tự reconciliation sau khi ghi:

```powershell
npm run backfill:daily-checklists -- --app-id=lims-cloud-fixed
```

Script chia batch tối đa 250 ngày/lần. Nếu một document gần giới hạn Firestore, script cảnh báo; nếu vượt ngưỡng an toàn, script dừng để tránh ghi document quá lớn.

## 10. Xác minh độc lập sau backfill

```powershell
npm run verify:daily-checklists -- --app-id=lims-cloud-fixed
```

Kết quả đạt phải có dạng:

```text
[Daily checklist] Reconciliation passed for <N> dates.
```

Nếu có mismatch, giữ hotfix fallback đang chạy, sửa nguyên nhân và chạy lại backfill; thao tác backfill là idempotent theo từng ngày vì dùng `batch.set` trên document ngày.

## 11. Smoke test sau backfill và quan sát fallback

1. Đăng nhập bằng tài khoản hợp lệ.
2. Mở Daily Checklist tại một ngày có dữ liệu lịch sử.
3. Xác nhận danh sách mẫu và chỉ tiêu hiển thị đúng.
4. Tạo hoặc cập nhật một request thử nghiệm có `analysisDate`, rồi reload Daily Checklist của ngày đó.
5. Lặp lại với `sampleDescriptionMap` chỉ có `nameSnapshot`, không có `masterId`.
6. Xác nhận người dùng không có quyền `batch_run` không thể ghi trái phép vào `daily_checklists`.
7. Theo dõi metric/log fallback legacy. Không xóa fallback trong cùng release với backfill; giữ ít nhất một chu kỳ release và chỉ bỏ khi verify coverage đầy đủ, không còn fallback bất thường.
8. Kiểm tra console trình duyệt và log Vercel không có lỗi mới.

## 12. Dọn credential

```powershell
Remove-Item Env:FIREBASE_SERVICE_ACCOUNT -ErrorAction SilentlyContinue
Remove-Item Env:LIMS_APP_ID -ErrorAction SilentlyContinue
```

Xóa file service account cục bộ khỏi máy phát hành nếu file chỉ được tạo tạm. Không xóa credential đang được quản lý bởi secret manager.

## Rollback

- Frontend: rollback về deployment Vercel ổn định trước đó.
- Firestore rules: checkout phiên bản `firestore.rules` trước thay đổi và deploy lại rules.
- Dữ liệu `daily_checklists` là dữ liệu dẫn xuất; ứng dụng cũ không phụ thuộc collection này. Không cần xóa ngay khi rollback frontend.
- Nếu cần khôi phục materialized data, sửa nguồn request rồi chạy lại backfill và verify.
