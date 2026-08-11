# Checklist triển khai Trạm Pha Chế theo business requirements

> Ngày triển khai: 2026-08-11
> Tài liệu nguồn: [`PREP_STATION_BUSINESS_REQUIREMENTS.md`](./PREP_STATION_BUSINESS_REQUIREMENTS.md)
> Phạm vi: route `prep`, draft và calculation engine chạy cục bộ trong trình duyệt
> Nguyên tắc: chỉ đánh dấu khi có code/test/build evidence; các mục phụ thuộc KNV hoặc runtime thật được giữ mở.

## 1. Boundary và thiết kế domain

- [x] Route `prep` tiếp tục dùng `SmartPrepComponent` nhưng không còn rail sáu mode kỹ thuật.
- [x] Màn hình đầu tiên hỏi năm câu hỏi nghiệp vụ: nồng độ đã pha, lượng cần lấy, spike, dãy chuẩn/QC và quy đổi xử lý mẫu.
- [x] Domain tách `ConcentrationBasis` khỏi `ConcentrationDraft.unit`; `ppm (mg/L)` và `ppm (mg/kg)` là hai lựa chọn khác nhau.
- [x] Domain có `ManualSubstance`, `ConcentrationTaskDraft`, `TargetTaskDraft`, `SpikeTaskDraft`, `SeriesTaskDraft` và `ResultConversionTaskDraft`.
- [x] Domain phân biệt `plannedQuantity` với `actualQuantity` cho phép pha đơn và điểm dãy chuẩn.
- [x] Domain có cây nguồn thủ công, source trực tiếp từng điểm, nội chuẩn/surrogate theo scope và stage xử lý mẫu.
- [x] Không có field `inventoryId`, `standardId`, stock balance hoặc transaction metadata trong domain mới.
- [x] Tất cả thay đổi draft chỉ nằm trong signal của component; không có service persistence.

Evidence:

- `src/app/features/preparation/prep-domain.types.ts`
- `src/app/features/preparation/smart-prep.component.ts`
- `src/app/features/preparation/smart-prep.component.html`

## 2. Calculation engine — nghiệp vụ A/B

- [x] Tính nồng độ sau pha từ chất rắn với potency và conversion factor.
- [x] Tính nồng độ sau pha từ dung dịch nguồn; actual quantity thay thế planned quantity khi KNV nhập số thực tế.
- [x] Xuất g/L, mg/mL, mg/L, `% w/v`; chỉ xuất M/mM/µM khi có MW.
- [x] Hỗ trợ mục tiêu từ chất rắn hoặc dung dịch nguồn; không cho target lớn hơn source.
- [x] Hỗ trợ `% w/w`, `% w/v`, `% v/v`, molar, mass/volume và mass/mass theo basis riêng.
- [x] Không suy đoán density hoặc MW khi thiếu; engine trả issue yêu cầu bổ sung.
- [x] Chọn pipet trong đúng sáu dải và ưu tiên max nhỏ nhất tại điểm chồng dải.
- [x] Cảnh báo thể tích dưới 2 µL, trên 10.000 µL, bình định mức ngoài danh mục và khối lượng hiển thị 0,00 mg.
- [x] Giữ canonical value trong engine; chỉ tạo `QuantityResult.displayValue` ở lớp presenter/output.
- [x] Hướng dẫn thao tác dùng “định mức đến” thay vì mặc định trừ dung môi.

Evidence:

- `src/app/features/preparation/prep-calculation.engine.ts`
- Tests `A`/`B` và catalog dụng cụ trong `prep-calculation.engine.test.ts`

## 3. Calculation engine — nghiệp vụ C/D

- [x] Spike mẫu rắn theo mass/mass; ca 5 g, 0,05 mg/kg, chuẩn 10 mg/L trả 25 µL.
- [x] Spike mẫu lỏng có semantic trên mẫu ban đầu và semantic nồng độ tổng trên thể tích cuối.
- [x] Spike final-total trừ đúng nồng độ nền khi được nhập; không âm thầm chọn semantic.
- [x] Có bối cảnh sample initial, extract, after cleanup và final vial trong draft/output/UI.
- [x] Cảnh báo spike chiếm tỷ lệ đáng kể so với mẫu lỏng.
- [x] Dãy chuẩn hỗ trợ nguồn gốc, nhiều chuẩn trung gian, nguồn riêng từng điểm, pha loãng nối tiếp và hỗn hợp nhiều chất.
- [x] Hỗn hợp chặn tổng thể tích thành phần vượt thể tích định mức.
- [x] Nội chuẩn/surrogate có thể nhập fixed volume hoặc target level, scope theo chuẩn/blank/QC/mẫu và ngoại lệ.
- [x] Output nội chuẩn/surrogate được mở rộng thành thao tác trên từng đối tượng.
- [x] Tổng nhu cầu nguồn chỉ là phép cộng cục bộ, có phần dư do KNV nhập; không đọc dữ liệu nguồn ngoại vi.

Evidence:

- Tests `C`, `D` trong `prep-calculation.engine.test.ts`
- `SeriesOutput.sourceDemand` và `SeriesOutput.additionRows`

## 4. Calculation engine — nghiệp vụ E

- [x] Thay công thức V1–V4 cố định bằng `SampleProcessingStepDraft` và stage model.
- [x] Hỗ trợ extract, aliquot, transfer all, dilution, concentration, reconstitution, split và recovery.
- [x] Transfer all giữ retention factor bằng 1, không tạo aliquot factor giả.
- [x] Trace ghi retention từng bước, retention tích lũy và công thức truy về mẫu ban đầu.
- [x] Chuỗi thiếu bước/thể tích cuối trả `incomplete`, không trả kết quả 0 giả.
- [ ] KNV xác nhận một hoặc hai SOP đại diện để khóa stage semantics và quy tắc recovery.

Evidence:

- `ResultConversionTaskDraft` và `ResultConversionOutput`
- Tests stage chain và transfer-all trong `prep-calculation.engine.test.ts`

## 5. Giao diện và boundary

- [x] Form chỉ hiển thị trường theo tác vụ/bối cảnh đã chọn.
- [x] Có bảng source tree, bảng điểm, bảng component, bảng nội chuẩn/surrogate và bảng stage.
- [x] Có dán bảng điểm từ clipboard, thêm/xóa dòng, reset draft, copy, print và export TXT.
- [x] Hiển thị kế hoạch/thực tế, kết quả trung gian, công thức, phép thế số, cảnh báo và hướng dẫn.
- [x] Các nhóm đơn vị tương đương về giá trị số giữ nhãn SOP và chỉ nhắc qua tooltip: g/L–mg/mL, mg/L–µg/mL–ppm, µg/L–ng/mL–ppb, ng/L–ppt và các nhóm tương ứng theo /kg.
- [x] Tên nguồn do KNV nhập là nhãn hiển thị dùng chung cho dropdown, hướng dẫn, kết quả và phiếu sao chép; mã kỹ thuật chỉ còn ở tooltip hoặc fallback khi chưa có tên.
- [x] Có dark mode theo component styles, focus-visible từ utility classes và layout responsive cho mobile/tablet/desktop.
- [x] Static boundary không import service Kho/Chất chuẩn và không có code path persistence/transaction.
- [x] Static boundary test không thấy token đọc/ghi nghiệp vụ ngoài phạm vi.
- [ ] Runtime browser smoke mở `/prep`, đổi đủ năm tác vụ, copy/print/export trên phiên đăng nhập thật. Đã thử local route ngày 2026-08-11; app chuyển về `/prep#/dashboard` ở màn hình đăng nhập nên chưa có authenticated evidence.
- [ ] UX review bằng KNV trên mobile 360 px, keyboard, reduced-motion và thuật ngữ nghiệp vụ.

Evidence:

- `src/app/features/preparation/smart-prep.component.html`
- `src/app/features/preparation/smart-prep.boundary.test.ts`

## 6. Verification đã chạy

- [x] `npx.cmd tsx --test src/app/features/preparation/prep-calculation.engine.test.ts src/app/features/preparation/smart-prep.boundary.test.ts` — **22/22 pass**.
- [x] `npx.cmd ng build --configuration development` — **Application bundle generation complete**.
- [x] `npm.cmd run test:prep` — **23/23 pass**.
- [x] `npm.cmd test` — full repository suite pass; các nhóm hiện hữu gồm standards 102, inventory 3, notifications 13, documents 4, excel-import 13, smart-batch 33 + Firestore emulator 18, daily-checklists 11, GAS 65 và prep 23.
- [x] `npm.cmd run build` — `validate:release-notes` pass và **Application bundle generation complete**.
- [x] 2026-08-11: `npm.cmd run test:prep` — **31/31 pass**, bao gồm hồi quy tooltip cho toàn bộ nhóm đơn vị tương đương.
- [x] 2026-08-11: `npm.cmd run build` — `validate:release-notes` pass và **Application bundle generation complete** sau thay đổi tooltip.
- [x] 2026-08-11: `npm.cmd run test:prep` — **32/32 pass**, bao gồm hồi quy nhãn nguồn động và tooltip mã kỹ thuật.
- [x] 2026-08-11: `npm.cmd run test:prep` — **33/33 pass**, bao gồm hồi quy cân đối chiều cao hai panel Bước 2 và Bước 3–4.
- [x] 2026-08-11: `npm.cmd test` — full repository suite pass; **297 tests pass** gồm standards 104, inventory 3, notifications 13, documents 4, excel-import 13, smart-batch 33 + Firestore emulator 19, daily-checklists 11, GAS 65 và prep 32.
- [x] 2026-08-11: `npm.cmd run build` — `validate:release-notes` pass và **Application bundle generation complete** sau khi đồng bộ nhãn nguồn động.
- [x] 2026-08-11: `npm.cmd run build` — `validate:release-notes` pass và **Application bundle generation complete** sau sửa layout hai panel.

## 7. Release boundary còn mở

- [ ] KNV review ví dụ, thuật ngữ, thứ tự ưu tiên và các ca nghiệp vụ trong Mục 14 của business requirements.
- [ ] Chốt minimum weight theo SOP/đánh giá độ không đảm bảo; không suy ra từ độ đọc 0,01 mg.
- [ ] Chốt danh mục và dung tích vial.
- [ ] Chốt dữ liệu hiệu chuẩn/độ chính xác pipet nếu cần xếp hạng trong vùng chồng dải.
- [ ] Chốt phần dư mặc định, chữ số có nghĩa và quy tắc làm tròn.
- [ ] Chốt blank/QC và ngoại lệ nội chuẩn theo SOP.
- [ ] Chạy runtime smoke và nhận KNV acceptance để đóng release nghiệp vụ; việc phát hành kỹ thuật theo yêu cầu trực tiếp không thay thế bước nghiệm thu này.

## 8. Quyết định không thực hiện trong lượt này

- Không khôi phục mô hình sáu mode cũ.
- Không đọc/chọn/kiểm tra/trừ/hoàn/điều chỉnh nguồn tồn.
- Không đọc danh mục Chất chuẩn để lấy potency, purity, MW, density hoặc chứng nhận.
- Không ghi Firestore, audit log nghiệp vụ hoặc transaction từ thao tác tính.
- Theo yêu cầu phát hành trực tiếp, có thể commit/push/deploy bản kỹ thuật `v26.08.11-b02` khi các gate code đã đạt; các mục KNV/runtime vẫn phải giữ mở và không được coi là đã nghiệm thu nghiệp vụ.
