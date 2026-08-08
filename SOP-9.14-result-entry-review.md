# Rà soát luồng nhập kết quả SOP 9.14

Đã kiểm tra toàn bộ luồng nhập kết quả cho **“Xác định dư lượng TBVTV – GC-MS/MS (USDA)” – SOP 9.14**.

## Kết luận

**Form đầy đủ có nền tảng tương đối ổn, nhưng form rút gọn hiện chưa an toàn để xuất báo cáo**, vì có 2 lỗi nghiêm trọng có thể chặn xuất hoặc đưa sai mẫu vào PDF.

> Ghi chú của lần rà soát ban đầu: tại thời điểm phát hiện các vấn đề bên dưới chưa có file nào được thay đổi. Phần triển khai hiện được theo dõi bằng checklist dưới đây.

## Checklist triển khai

- [x] 1. Sửa preflight Form Rút Gọn để kiểm tra đúng các cột `kq*` và đúng chỉ tiêu được giao.
- [x] 2. Lọc đúng mẫu được chọn / `activeFilter` / chunk khi `buildFipronilPdfPayload()` sinh PDF.
- [x] 3. Form Đầy Đủ chỉ cho publish khi **tất cả** chỉ tiêu được giao đã có kết quả hoặc trạng thái ND hợp lệ.
- [x] 4. Giữ nguyên quy tắc khởi tạo kết quả mặc định ND của SOP 9.14; không coi đây là lỗi cần sửa.
- [x] 5. Đồng bộ key QC giữa UI và cấu hình/GAS (`qcNhanDang`, `qcThemChuan`, `qcThuHoi`) và migrate draft cũ.
- [x] 6. Tự đồng bộ `checkTatCaND` / `checkCoMauPhatHien` sau mọi thay đổi kết quả.
- [x] 7. Sửa số lọ mặc định SOP 9.14 thành `1.10`, `1.11`... thay vì bị base class giữ `9`, `10`...
- [x] 8. Dùng chung template ID trung tâm để Đầy Đủ = `1a...`, Rút Gọn = `1b...`.
- [x] 9. Bổ sung validation kết quả SOP 9.14: số, `ND`/`KPH`, `<LOQ`; chặn chuỗi tùy ý.
- [x] 10. Bổ sung regression test cho các lỗi đã sửa và chạy typecheck.
- [ ] 11. Xác nhận nghiệp vụ `kqClpMeDes → chlorpyrifos_methyl_desmethyl` có thuộc SOP 9.14 hay không trước khi giữ/bỏ cột này.

### Xác minh triển khai

- Targeted regression tests: **19/19 pass**.
- `npm test`: **pass** toàn bộ bộ kiểm thử bắt buộc của repository.
- `npx tsc -p tsconfig.app.json --noEmit`: **pass**.
- `npm run typecheck:api`: **pass**.
- `npm run build`: **pass** với release **v26.08.08-b05**.
- `git diff --check`: **pass**.
- Còn mở duy nhất mục 11 vì cần xác nhận nghiệp vụ trước khi thay đổi danh mục chỉ tiêu.

## Các vấn đề phát hiện

### 1. [Critical] Preflight của form rút gọn luôn kiểm tra sai cấu trúc dữ liệu

UI rút gọn lưu các cột `kqFip`, `kqFipDesl`, `kqClp`…, nhưng preflight lại kiểm tra 67 key hoạt chất của form đầy đủ như `fipronil`, `chlorpyrifos`… tại `result-preflight.ts`, trong khi config đầy đủ được truyền tại `result-entry.component.ts`.

Đã tái hiện trực tiếp: mẫu `A001` có `kqFip = "ND"` vẫn bị chặn với thông báo:

> “Có 1 mẫu chưa có kết quả hoặc ND: A001”

### 2. [Critical] Form rút gọn không tôn trọng mẫu được chọn / chunk khi sinh PDF

`buildFipronilPdfPayload()` lặp toàn bộ `currentRun.sampleList` tại `result-pdf-helper.ts` mà không kiểm tra `selected=false` hoặc `activeFilter`.

Đã tái hiện: `A002` được bỏ chọn nhưng payload vẫn chứa `A002`.

Vì vậy, khi bỏ chọn mẫu hoặc tách thành nhiều phiếu, PDF rút gọn có thể vẫn chứa mẫu ngoài phạm vi cần in.

### 3. [High] Preflight form đầy đủ chỉ yêu cầu “có ít nhất một hoạt chất có kết quả”

Điều kiện hiện dùng `.some(...)` tại `result-preflight.ts`, thay vì kiểm tra toàn bộ chỉ tiêu được giao.

Đã thử mẫu có:

- Fipronil = `1.2`
- Chlorpyrifos để trống

Preflight vẫn không có blocker.

Với LIMS, điều này cho phép xuất một phiếu còn thiếu kết quả.

### 4. [Confirmed] Khởi tạo mặc định kết quả ND là đúng nghiệp vụ

Sau khi load danh mục, `prefillUnassignedTargets()` tự đặt:

- `row[c] = ''`
- `${c}_nd = true`
- các QC = `Đạt`

Logic nằm tại `abstract-sop-entry.ts`.

Theo xác nhận nghiệp vụ, việc khởi tạo mặc định kết quả ở trạng thái `ND` là **đúng yêu cầu của SOP 9.14** và không được xem là lỗi/rủi ro cần sửa.

Phần QC mặc định `Đạt` vẫn nên được đánh giá độc lập nếu nghiệp vụ QC có quy tắc xác nhận riêng; kết luận trên chỉ xác nhận trạng thái kết quả mặc định `ND`.

### 5. [High] Checkbox QC của form rút gọn không khớp key backend/GAS dùng để điền PDF

UI dùng các key tại component:

- `qcNhanDangMauNhiem`
- `qcNhanDangSpike`
- `qcThuHoiIS`

Trong khi cấu hình rút gọn tại `sop-configs.ts` dùng:

- `qcNhanDang`
- `qcThemChuan`
- `qcThuHoi`

GAS đọc trực tiếp các key cấu hình này, nên một số đánh giá QC trên UI có thể không được đánh dấu đúng trên báo cáo.

### 6. [High/Medium] Cờ “Tất cả mẫu ND” / “Có mẫu phát hiện” có thể sai sau khi chỉnh kết quả

`checkTatCaND=true` và `checkCoMauPhatHien=false` chỉ được đặt trong thao tác **“Điền ND ô trống”** tại component.

Sau đó nếu nhập một giá trị dương, chưa thấy logic cập nhật ngược hai cờ này. Vì vậy PDF có thể vẫn đánh dấu “tất cả không phát hiện”.

### 7. [Medium] Số lọ mặc định của SOP 9.14 bị base class ghi đè trước khi logic riêng chạy

Base class đặt `9, 10, 11...` tại `abstract-sop-entry.ts`.

Sau đó SOP 9.14 muốn đặt `1.10, 1.11...`, nhưng chỉ làm khi trường còn trống tại component. Với mẫu mới, trường đã được base class điền nên nhánh riêng này không chạy.

### 8. [Medium] ID template Đầy đủ/Rút gọn bị đảo trong component

Component khai báo:

- FULL = `1b...`
- SHORT = `1a...`

Trong khi nguồn cấu hình trung tâm tại `sop-configs.ts` xác định:

- **Đầy đủ = `1a...`**
- **Rút gọn = `1b...`**

GAS cũng đồng ý với cấu hình trung tâm.

Nhánh publish hiện ghi đè lại bằng ID đúng, nên PDF có thể vẫn đúng, nhưng metadata/link lưu trong draft có thể sai.

### 9. [Medium] Chưa có validation nội dung kết quả đủ chặt

Preflight hiện coi mọi chuỗi khác rỗng/`N/A` là kết quả hợp lệ.

Đã thử `fipronil = "abc"` và vẫn không bị blocker.

Nên bổ sung quy tắc cho:

- giá trị số;
- `ND` / `KPH`;
- `<LOQ`;
- các qualifier hợp lệ theo nghiệp vụ;
- từ chối chuỗi tùy ý.

### 10. Danh mục form đầy đủ đã kiểm tra tốt

JSON SOP và config Angular đều có **67 hoạt chất**. Sau chuẩn hóa ID, hai nguồn khớp **67/67**, không thiếu/thừa.

Hai khác biệt tên sau đã được resolver xử lý đúng:

- `1-naphthol ↔ 1_naphthol`
- `mgk-264 ↔ mgk_264`

Tuy nhiên, form rút gọn có thêm:

`kqClpMeDes → chlorpyrifos_methyl_desmethyl`

Chất này **không có trong 67 chỉ tiêu của SOP 9.14**, nên cần xác nhận nghiệp vụ xem cột này có thực sự thuộc phương pháp USDA 9.14 hay không.

## Trạng thái kiểm thử

- Bộ test liên quan hiện tại: **11/11 pass**.
- `tsc --noEmit`: **pass**.
- Test hiện tại **chưa bao phủ hai lỗi Critical** nêu trên.
- Worktree đang sạch tại thời điểm rà soát.

## Thứ tự ưu tiên đề xuất

1. Sửa preflight cho form rút gọn.
2. Lọc đúng mẫu/chunk khi tạo PDF.
3. Kiểm tra đủ tất cả chỉ tiêu được giao trước khi xuất.
4. Đồng bộ key QC và các cờ phát hiện/không phát hiện.
5. Sửa số lọ mặc định và template ID.
6. Bổ sung validation giá trị kết quả.
7. Thêm regression test cho từng lỗi trên.
