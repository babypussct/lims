# Superadmin access control

## Mô hình chuẩn

LIMS không có role `superadmin` riêng. Mô hình chuẩn là:

- **Manager**: `role == "manager"`.
- **Superadmin**: `role == "manager"` và `protectedAdmin == true`.
- `protectedAdmin` là trusted marker. Cờ này đứng một mình không cấp đặc quyền Superadmin.

Client dùng `src/app/core/auth/access-control.ts` làm source of truth. Firestore Security Rules lặp lại cùng invariant tại trust boundary.

## Ranh giới quyền

- Manager có full permission override cho permission catalog thông thường.
- Staff có `user_manage` được quản lý tài khoản không phải Manager nhưng không được cấp, hạ cấp hoặc xóa Manager.
- Profile có `protectedAdmin == true` không thể bị sửa quyền hoặc xóa qua client, kể cả bởi Manager.
- Self-registration luôn tạo `pending`, không có permission và không có `protectedAdmin`.

## Cấp và thu hồi Superadmin

Không sửa `protectedAdmin` bằng UI hoặc SDK client. Dùng script Admin SDK `scripts/manage-superadmin.ts`.

Xem trạng thái:

```bash
npm run admin:superadmin -- --status --project-id=<firebase-project-id>
npm run admin:superadmin -- --status --project-id=<firebase-project-id> --uid=<uid>
```

Cấp Superadmin yêu cầu xác nhận chính xác:

```bash
npm run admin:superadmin -- --grant --project-id=<firebase-project-id> --app-id=lims-cloud-fixed --uid=<uid> --confirm=GRANT:<firebase-project-id>:lims-cloud-fixed:<uid>
```

Thu hồi giữ nguyên role Manager và chỉ bỏ trusted marker. Script từ chối thu hồi Superadmin hợp lệ cuối cùng:

```bash
npm run admin:superadmin -- --revoke --project-id=<firebase-project-id> --app-id=lims-cloud-fixed --uid=<uid> --confirm=REVOKE:<firebase-project-id>:lims-cloud-fixed:<uid>
```

Script dùng Firebase Admin Application Default Credentials. Credential chỉ được cung cấp qua môi trường quản trị tin cậy và không lưu trong repository.

## Bất biến phát triển

1. Không nhận diện Superadmin theo email, tên hoặc UID ở client.
2. Không đưa `protectedAdmin` vào payload cập nhật quyền từ UI.
3. Chức năng Superadmin mới phải có kiểm tra tương ứng ở Firestore Rules hoặc trusted backend.
4. `protectedAdmin == true` với role khác Manager là dữ liệu sai: profile vẫn bị khóa khỏi chỉnh sửa client nhưng không hưởng đặc quyền Superadmin.
5. Không cấp Superadmin qua `user_manage`, `system_manage`, role config hoặc custom permission.
