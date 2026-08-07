# Hướng dẫn triển khai

Tài liệu này áp dụng cho bản Angular/Vercel hiện tại và thay đổi materialized daily checklist trong Firestore.

## Trạng thái trước triển khai

- Chưa chạy backfill Firestore; chưa có ghi dữ liệu production từ script `backfill-daily-checklists.ts`.
- TypeScript application và API đã type-check thành công trong môi trường kiểm tra.
- Các test hiện có đã đạt, bao gồm 4 test daily checklist.
- Angular production build chưa thể xác nhận trong sandbox vì Angular compiler bị chặn khi đọc đường dẫn ngoài workspace. Bắt buộc chạy lại build trên máy phát hành hoặc CI trước khi deploy.

## 1. Chuẩn bị

Yêu cầu:

- Node.js và npm theo phiên bản đang dùng trong CI/Vercel.
- Quyền deploy Firebase project `lims-cloud-by-otada`.
- Quyền deploy Vercel project của ứng dụng.
- Firebase service account được lưu ở vị trí bảo mật và không commit vào Git.

Tại thư mục repository:

```powershell
npm ci
```

Nếu PowerShell chặn `npm.ps1`, dùng `npm.cmd` thay cho `npm` trong các lệnh bên dưới.

## 2. Kiểm tra bắt buộc trước deploy

```powershell
npm test
npx tsc -p tsconfig.app.json --noEmit
npm run typecheck:api
npm run build
```

Chỉ tiếp tục khi tất cả lệnh trả về exit code `0`. Output Angular production phải nằm tại:

```text
dist/lims-cloud-pro/browser
```

Không dùng kết quả build trong sandbox làm bằng chứng phát hành nếu log có lỗi `Cannot read directory "../../..": Access is denied`.

## 3. Đăng nhập công cụ triển khai

Firebase:

```powershell
npx firebase-tools login
npx firebase-tools use lims-cloud-by-otada
```

Vercel:

```powershell
npx vercel whoami
```

Nếu chưa đăng nhập:

```powershell
npx vercel login
```

## 4. Deploy Firestore rules

Review thay đổi trong `firestore.rules`, đặc biệt collection:

```text
artifacts/{appId}/daily_checklists/{analysisDate}
```

Deploy rules:

```powershell
npx firebase-tools deploy --only firestore:rules --project lims-cloud-by-otada
```

Xác nhận lệnh hoàn tất thành công trước khi deploy frontend.

## 5. Chuẩn bị credential cho backfill

Script hỗ trợ một trong hai cơ chế:

1. Biến môi trường `FIREBASE_SERVICE_ACCOUNT` chứa toàn bộ JSON service account.
2. Application Default Credentials của Google.

Ví dụ dùng service account trong PowerShell:

```powershell
$env:FIREBASE_SERVICE_ACCOUNT = Get-Content 'C:\secure\lims-service-account.json' -Raw
$env:LIMS_APP_ID = 'lims-cloud-fixed'
```

Không in biến `FIREBASE_SERVICE_ACCOUNT` ra terminal, log CI hoặc artifact build.

## 6. Dry-run backfill

Dry-run đọc dữ liệu production và báo số request/ngày dự kiến, nhưng không ghi Firestore:

```powershell
npm run backfill:daily-checklists -- --dry-run --app-id=lims-cloud-fixed
```

Kiểm tra output:

- App ID là `lims-cloud-fixed`.
- Số request và số ngày materialized hợp lý.
- Không có lỗi credential hoặc project.
- Có thông báo `Dry run: no Firestore writes were made.`

## 7. Chạy backfill production

Lệnh này ghi hoặc ghi đè các document theo ngày tại `artifacts/lims-cloud-fixed/daily_checklists` và tự reconciliation sau khi ghi:

```powershell
npm run backfill:daily-checklists -- --app-id=lims-cloud-fixed
```

Script chia batch tối đa 250 ngày/lần. Nếu một document gần giới hạn Firestore, script cảnh báo; nếu vượt ngưỡng an toàn, script dừng để tránh ghi document quá lớn.

## 8. Xác minh độc lập sau backfill

```powershell
npm run verify:daily-checklists -- --app-id=lims-cloud-fixed
```

Kết quả đạt phải có dạng:

```text
[Daily checklist] Reconciliation passed for <N> dates.
```

Nếu có mismatch, không deploy frontend. Sửa nguyên nhân và chạy lại backfill; thao tác backfill là idempotent theo từng ngày vì dùng `batch.set` trên document ngày.

## 9. Deploy Vercel production

```powershell
npx vercel --prod
```

Vercel sử dụng:

- Build command: `npx ng build --configuration=production --no-progress`
- Output directory: `dist/lims-cloud-pro/browser`

Chỉ chấp nhận deployment khi Angular build hoàn tất không lỗi.

## 10. Smoke test production

1. Đăng nhập bằng tài khoản hợp lệ.
2. Mở Daily Checklist tại một ngày có dữ liệu lịch sử.
3. Xác nhận danh sách mẫu và chỉ tiêu hiển thị đúng.
4. Tạo hoặc cập nhật một request thử nghiệm có `analysisDate`, rồi reload Daily Checklist của ngày đó.
5. Xác nhận người dùng không có quyền `batch_run` không thể ghi trái phép vào `daily_checklists`.
6. Kiểm tra console trình duyệt và log Vercel không có lỗi mới.

## 11. Dọn credential

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
