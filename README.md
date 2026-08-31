# LIMS Cloud — NAFIQPM6

Ứng dụng quản lý phòng thí nghiệm xây dựng bằng Angular, Firebase và Vercel. Repository bao gồm frontend, API serverless, Firestore Rules, Google Apps Script và các bộ kiểm thử nghiệp vụ.

## Chạy cục bộ

Yêu cầu Node.js và npm phải khớp chính sách trong `.nvmrc` và `package.json`.

```bash
npm ci
npm start
```

Ứng dụng development mặc định chạy tại `http://localhost:4200`.

## Kiểm tra thay đổi

Chạy gate đầy đủ trước khi phát hành:

```bash
npm run release:verify
```

Các lệnh kiểm tra theo từng module được mô tả trong [TESTING_GUIDE.md](TESTING_GUIDE.md).

## Tài liệu chính

- [DEPLOYMENT.md](DEPLOYMENT.md) — quy trình release, deploy, backup và vận hành production.
- [UI_CONVENTIONS.md](UI_CONVENTIONS.md) — quy ước giao diện và shared primitives.
- [NAMING_CONVENTIONS.md](NAMING_CONVENTIONS.md) — quy tắc mã mẫu, prefix và tách báo cáo.
- [DESIGN.md](DESIGN.md) — design system của sản phẩm.

Không commit credential, token, file `.env` hoặc dữ liệu production vào repository.
