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
