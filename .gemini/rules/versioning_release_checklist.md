# Rule: Controlled Versioning (CalVer Build-Index) & Release Checklist

1. **Định dạng Phiên bản Tự động (Format: `vYY.MM.DD-bXX`):**
   - Phiên bản được tạo tự động theo ngày hiện tại và số lượt build trong ngày.
   - Ví dụ: `v26.07.21-b01` (Lần build 1), `v26.07.21-b02` (Lần build 2). Sang ngày mới sẽ tự động reset về `v26.07.22-b01`.

2. **BẮT BUỘC Đồng bộ Đủ 5 Tệp Phiên Bản (Mandatory 5-File Synchronization):**
   Mọi thao tác liên quan đến tạo phiên bản mới, gộp phiên bản hay cập nhật release note PHẢI đồng thời cập nhật đủ 5 tệp sau (tuyệt đối không chỉ cập nhật duy nhất `CHANGELOG.md`):
   - `package.json` (`version`)
   - `ngsw-config.json` (`appData.version` và `appData.features`)
   - `src/app/core/services/state.service.ts` (`systemVersion` signal)
   - `metadata.json` (`name`)
   - `CHANGELOG.md` (Nhật ký phát hành)

3. **Quy trình 5 bước trước khi Commit & Push:**
   - **Bước 1:** Chạy lệnh build/sync cục bộ tại máy dev (`npm run sync-version` hoặc `npm run build`). Script sẽ tự động sinh mã version mới.
   - **Bước 2:** Cập nhật các dòng gạch đầu dòng tính năng mới trong `ngsw-config.json` (`appData.features`).
   - **Bước 3:** Rà soát `git diff` để kiểm tra lại số version và nội dung changelog trong cả 5 tệp.
   - **Bước 4:** Chạy thử ứng dụng cục bộ (Local Test) để xác nhận con số version trên Login page / Header hiển thị đúng ý.
   - **Bước 5:** Thực hiện `git commit` và `git push`.

4. **Tự động Nhắc nhở:**
   - Mỗi khi người dùng hỏi hoặc yêu cầu các tác vụ liên quan đến Build, Release, Deploy hoặc Push code, Agent PHẢI chủ động nhắc lại quy trình kiểm soát phiên bản này.
