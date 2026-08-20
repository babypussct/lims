# Kế hoạch sắp xếp mã số mẫu tại Theo Dõi Mẫu & Kết Quả Ngày

## 1. Mục tiêu

Điều chỉnh cách hiển thị danh sách mẫu trong khu vực **Theo Dõi Mẫu & Kết Quả Ngày** trên Dashboard để thứ tự luôn đi theo mã số mẫu, đồng thời vẫn **gom/rút gọn mô tả lặp lại** để tránh chuỗi hiển thị quá dài.

Kết quả mong muốn phải dễ đọc, không làm các mã mẫu bị đổi vị trí chỉ vì chúng có cùng mô tả, nhưng cũng không lặp cùng một mô tả hàng chục lần. Phần cần tra cứu nhanh là **mã số mẫu** vẫn được nhấn mạnh.

Ví dụ dữ liệu:

- `L2319` — Lươn sống
- `L2419` — Ốc hương
- `L2519` — Lươn sống
- `L2619` — Tôm hùm

Thứ tự bắt buộc:

`L2319` → `L2419` → `L2519` → `L2619`

Cách hiển thị bắt buộc với ví dụ có mô tả xen kẽ:

**L2319** (Lươn sống); **L2419** (Ốc hương); **L2519** (Lươn sống); **L2619** (Tôm hùm)

Ví dụ một dãy dài cùng mô tả:

`U0119`, `U0219`, `U0319`, ... , `U4319` đều có mô tả `Cá tra`.

Không được hiển thị lặp lại 43 lần theo dạng:

`U0119 (Cá tra); U0219 (Cá tra); ...; U4319 (Cá tra)`

Mà phải gom/rút gọn thành dạng tương đương:

**U0119 -> U4319** (Cá tra)

---

## 2. Ba nguyên tắc đã chốt

### Nguyên tắc 1 — Sắp xếp theo từng mã số mẫu tăng dần

- Mã số mẫu là khóa quyết định thứ tự hiển thị.
- Không được **gom toàn cục theo mô tả** nếu việc đó làm thay đổi thứ tự mã mẫu.
- Không sort theo tên/mô tả mẫu.
- Sau khi danh sách mẫu đã được sort, bước gom/rút gọn mô tả tuyệt đối không được thay đổi thứ tự đó.
- Với ví dụ trên, hai mẫu cùng mô tả `Lươn sống` là `L2319` và `L2519` vẫn phải nằm đúng vị trí theo mã mẫu; không được biến thành một cụm `L2319; L2519 (Lươn sống)` rồi mới đến các mô tả khác.
- Việc gom mẫu theo **bộ chỉ tiêu được gán** hiện tại vẫn giữ nguyên. Thay đổi này chỉ kiểm soát thứ tự mẫu bên trong từng nhóm phân công, không thay đổi nghiệp vụ phân nhóm chỉ tiêu/SOP.

### Nguyên tắc 2 — Gom mô tả theo các đoạn liên tiếp sau khi đã sort

- Sau khi `group.samples` đã sort theo mã mẫu, quét tuyến tính từ đầu đến cuối để tạo các **display run**.
- Các sample **liền kề nhau trong thứ tự đã sort** và có cùng mô tả chuẩn hóa được phép gom vào cùng một run.
- Không tìm tất cả sample có cùng mô tả trên toàn danh sách rồi kéo chúng lại gần nhau.
- Mỗi run giữ nguyên các mã theo thứ tự đã sort, sau đó dùng `formatSampleList()` để nén dãy mã liên tiếp khi có thể.
- Ví dụ `U0119` → `U4319` cùng `Cá tra` phải hiển thị gọn thành `U0119 -> U4319 (Cá tra)` thay vì lặp `Cá tra` 43 lần.
- Với `L2319 (Lươn sống); L2419 (Ốc hương); L2519 (Lươn sống)`, hai `Lươn sống` không liền nhau nên phải tạo hai run riêng; không được gom thành `L2319; L2519 (Lươn sống)`.
- Sample không có mô tả có thể gom/rút gọn với các sample không mô tả liền kề nếu vẫn giữ nguyên thứ tự.
- Sample có `descriptionAlternatives`/xung đột mô tả không được âm thầm gom chung với run bình thường; phải giữ đủ thông tin cảnh báo/traceability.

### Nguyên tắc 3 — Chỉ in đậm mã mẫu

- Chỉ phần mã mẫu dùng font đậm.
- Mô tả nằm ngay sau mã mẫu trong dấu ngoặc đơn và dùng font-weight thường.
- Không làm đậm toàn bộ chuỗi `mã mẫu + mô tả`.
- Không tự đổi chữ hoa/chữ thường của nội dung mô tả đã lưu trong `nameSnapshot`; yêu cầu “chữ thường” ở đây là kiểu chữ bình thường, không phải ép dữ liệu về lowercase.
- Dùng cùng một quy tắc cho card thu gọn, card mở rộng và bản in để tránh khác nhau giữa màn hình và PDF/print.

---

## 3. Phạm vi kỹ thuật đã xác định

Dashboard không tự xử lý danh sách mẫu mà nhúng:

`src/app/features/dashboard/dashboard.component.html`

→ `app-daily-checklist`

Logic thực tế nằm trong module:

- `src/app/features/checklist/daily-checklist.utils.ts`
- `src/app/features/checklist/daily-checklist.model.ts`
- `src/app/features/checklist/daily-checklist.component.html`
- `src/app/features/checklist/daily-checklist.component.ts`
- `src/app/features/checklist/daily-checklist.utils.spec.ts`
- `src/app/features/checklist/daily-screen-layout-planner.ts`
- `src/app/features/checklist/daily-print-layout-planner.ts`

Không dự kiến cần sửa `dashboard.component.ts` cho thay đổi này.

---

## 4. Hiện trạng và nguyên nhân

### 4.1. Phần sort mã mẫu hiện tại đã gần đúng

Trong `buildDailyBatchViews()`, `group.samples` đang được sort bằng `compareDailySampleIds()`:

1. Ưu tiên mã có prefix chữ theo quy tắc hiện tại.
2. Sau đó dùng `naturalCompare()` để sort tự nhiên.

Vì vậy với `L2319`, `L2419`, `L2519`, `L2619`, mảng `group.samples` đã có thể giữ đúng thứ tự tăng dần mong muốn.

### 4.2. Hiện trạng mới: đã giữ đúng thứ tự nhưng mất cơ chế gom mô tả

Code hiện tại trong `buildDailyBatchViews()` đã bỏ cách group toàn cục theo description và đang tạo `formattedSampleDetails` bằng `formatDailySampleDetails(samples)` theo đúng thứ tự `group.samples`.

Card thu gọn, print list và print compact khi có mô tả cũng đang lặp trực tiếp qua từng `group.samples` và render từng cặp `MÃ (Mô tả)`.

Điều này đã sửa được lỗi thứ tự, ví dụ `L2319 / L2419 / L2519 / L2619` không còn bị regroup theo `Lươn sống`. Nhưng tác dụng phụ là mô tả bị lặp cho từng sample.

Với `U0119` → `U4319` đều là `Cá tra`, UI hiện tại sẽ sinh chuỗi tương đương 43 lần `MÃ (Cá tra)`, quá dài dù toàn bộ dãy có thể biểu diễn ngắn gọn bằng `U0119 -> U4319 (Cá tra)`.

### 4.3. Hai cực cần tránh

- **Gom toàn cục theo mô tả**: ngắn nhưng có thể phá thứ tự mã mẫu.
- **Không gom mô tả**: giữ đúng thứ tự nhưng tạo chuỗi quá dài, ví dụ 43 sample `Cá tra` bị lặp mô tả 43 lần.

Thiết kế mới phải nằm giữa hai cực này: **sort trước, rồi chỉ gom các đoạn liền kề có cùng mô tả**.

### 4.4. Style mã/mô tả hiện tại đã đúng và phải được giữ

Code hiện tại đã tách style đúng ở các nơi chính:

- mã sample dùng monospace + bold/black;
- mô tả dùng sans-serif + font-weight thường;
- print list và print compact đã có `.cl-print-sample-code`, `.cl-print-sample-description`, `.cl-print-sample-separator` riêng.

Thay đổi mới không được làm regression phần này. Khi chuyển từ từng sample sang display run, vẫn phải render phần `formattedSamples`/range riêng với mô tả, không quay lại một text node đậm toàn bộ.

---

## 5. Thiết kế thay đổi

### 5.1. Chọn `group.samples` làm nguồn sự thật cho thứ tự hiển thị

Thứ tự cuối cùng phải lấy trực tiếp từ `group.samples` sau khi đã chạy `compareDailySampleIds()`.

Không tạo một cấu trúc trung gian có thể sắp xếp lại theo mô tả.

Luồng mong muốn:

`samples thô` → `dedupe` → `sort theo mã mẫu` → `gắn mô tả cho từng sample` → `gom các run liền kề cùng mô tả` → `nén mã trong từng run` → `render tuần tự`

Không dùng luồng:

`samples đã sort` → `group by description` → `render theo từng description group`

### 5.2. Thay group-by-description toàn cục bằng consecutive display runs

Trong `daily-checklist.utils.ts`:

- Không dùng `descMap` kiểu `description -> tất cả sample có description đó` cho presentation vì cách này làm mất vị trí của các mô tả lặp xen kẽ.
- Sau khi `samples` đã sort, tạo helper quét tuyến tính để sinh danh sách run. Một run chỉ được nối thêm sample kế tiếp khi trạng thái mô tả tương thích với run hiện tại.
- Mỗi run nên chứa tối thiểu: `samples/sampleIds`, `description`, trạng thái conflict và `formattedSamples`.
- `formattedSamples` của từng run dùng `formatSampleList(sampleIds, { prefixFirst: true })` để tận dụng logic nén range hiện có.
- Tạo thêm chuỗi presentation gọn từ các run, ví dụ `formattedSampleDisplay`, theo **đúng thứ tự xuất hiện**, không sort lại theo description.
- Giữ `formattedSampleDetails` hiện tại ở dạng đầy đủ từng sample để search theo một mã nằm giữa range vẫn hoạt động. Ví dụ sau khi UI nén thành `U0119 -> U4319`, tìm `U2019` vẫn phải ra đúng card.

Ví dụ xen kẽ mô tả:

`L2319 (Lươn sống); L2419 (Ốc hương); L2519 (Lươn sống); L2619 (Tôm hùm)`

Ví dụ dãy dài cùng mô tả:

`U0119 -> U4319 (Cá tra)`

Mẫu không có mô tả:

`L2319; L2419` hoặc range tương đương nếu `formatSampleList()` xác định được một dãy liên tiếp.

Mẫu có xung đột mô tả vẫn giữ cảnh báo hiện có; không được dùng xung đột để thay đổi thứ tự mẫu hoặc làm mất các alternative.

### 5.3. Tách dữ liệu nguồn và dữ liệu presentation

`group.samples` vẫn là dữ liệu nguồn để đảm bảo thứ tự và traceability. Từ đó dựng thêm cấu trúc presentation, ví dụ `sampleDisplayRuns`, thay vì parse ngược một chuỗi text.

Mỗi sample hiện đã có:

- `sampleId`
- `description`
- `descriptionAlternatives`
- `sourceRequestIds`

Mỗi display run có thể có dạng khái niệm:

- `sampleIds: string[]`
- `formattedSamples: string`
- `description?: ...`
- `descriptionAlternatives?: ...`
- `hasDescriptionConflict: boolean`

Không cần parse ngược một chuỗi đã format để xác định đâu là mã mẫu và đâu là mô tả.

Trong `DailyBatchAssignmentGroup`, ưu tiên **giữ** các field hiện tại và bổ sung presentation field thay vì đổi semantics:

- `samples`: source of truth đầy đủ;
- `formattedSampleDetails`: text đầy đủ từng sample, tiếp tục dùng cho search/fallback traceability;
- `sampleDisplayRuns`: cấu trúc dùng để render compact;
- `formattedSampleDisplay`: text đã gom/rút gọn dùng cho layout estimation và fallback compact.

Template màn hình và template in ưu tiên `sampleDisplayRuns` để vừa giữ thứ tự, vừa gom mô tả lặp, vừa style riêng phần mã/range và mô tả. `group.samples` vẫn là source of truth để dựng các run này.

### 5.4. Quy tắc render trên card thu gọn

Trong `daily-checklist.component.html`:

- Lặp tuần tự qua `sampleDisplayRuns`.
- Mỗi run render theo dạng:
  - mã mẫu hoặc range mã đã nén: `font-mono font-black`;
  - mô tả: `font-sans font-normal`;
  - dấu ngoặc đơn thuộc phần mô tả, không đậm;
  - separator giữa hai run: `; `.
- Không dùng `font-black` trên container chứa toàn bộ dòng.
- Không còn nhánh render nào regroup toàn danh sách theo description.

Kết quả DOM về mặt thị giác phải tương đương:

`<mã/range đậm> (mô tả thường); <mã/range đậm> (mô tả thường); ...`

Ví dụ dài phải thành:

`<U0119 -> U4319 đậm> (Cá tra)`

### 5.5. Quy tắc render trên card mở rộng

Card mở rộng **tiếp tục giữ chi tiết từng sample** để phục vụ traceability. Không cần gom run ở chế độ mở rộng; yêu cầu gom/rút gọn chủ yếu áp dụng cho các vùng hiển thị compact và bản in.

- Giữ mã mẫu đậm.
- Giữ mô tả hiện tại ở font-weight thường.
- Giữ định dạng `MÃ (Mô tả)` hiện tại.
- Cảnh báo `descriptionAlternatives` vẫn có thể dùng màu/độ đậm riêng vì đây là trạng thái cảnh báo, không phải mô tả bình thường.

### 5.6. Quy tắc render bản in

Cả hai layout in phải tuân cùng thứ tự, cơ chế gom run và style:

- Bảng danh sách `.cl-print-samples`.
- Layout compact `.cl-print-compact-samples`.

Giữ các CSS role hiện có:

- `.cl-print-sample-code`: monospace + bold/800.
- `.cl-print-sample-description`: sans-serif + normal/400.
- `.cl-print-sample-separator`: normal/400.

Với tùy chọn `printGroupSamples` hiện có:

- vẫn luôn gom mô tả theo consecutive-run để tránh lặp description;
- khi `printGroupSamples() === true`, phần mã trong run dùng `formatSampleList()` để nén range;
- khi `printGroupSamples() === false`, phần mã trong run liệt kê đầy đủ theo thứ tự nhưng mô tả vẫn chỉ in một lần cho run;
- mô tả giống nhau nhưng bị ngắt bởi mô tả khác không được regroup toàn cục.

### 5.7. Search và layout planner

`boardBatches()` hiện dùng nội dung mô tả đã format để tìm kiếm. Sau thay đổi:

- Search vẫn phải tìm được theo mã mẫu.
- Search vẫn phải tìm được theo mô tả.
- Tiếp tục dùng `group.sampleIds` + `group.formattedSampleDetails` đầy đủ cho search; không thay search bằng chuỗi range đã nén.
- Bắt buộc test tìm một mã nằm giữa range, ví dụ `U2019`, dù UI chỉ hiển thị `U0119 -> U4319`.

`daily-screen-layout-planner.ts` và `daily-print-layout-planner.ts` phải ước lượng theo **chuỗi sau khi đã gom run/rút gọn**, nếu không planner sẽ đánh giá quá dài so với nội dung thực tế.

Sau khi đổi cấu trúc:

- Chuyển planner sang `formattedSampleDisplay` đã gom/rút gọn thay vì `formattedSampleDetails` đầy đủ.
- Đảm bảo planner tính cả độ dài mô tả nhưng không tính lặp lại mô tả đã được gom.
- Không để thay đổi này làm hỏng lựa chọn `compact / standard / wide` hoặc `portrait / landscape` hiện có.

---

## 6. Tiêu chí chấp nhận

### AC-01 — Không regroup toàn cục theo mô tả

Với:

- `L2319` — Lươn sống
- `L2419` — Ốc hương
- `L2519` — Lươn sống
- `L2619` — Tôm hùm

thứ tự phải luôn là:

`L2319`, `L2419`, `L2519`, `L2619`

Không chấp nhận:

`L2319`, `L2519`, `L2419`, `L2619`

chỉ vì `L2319` và `L2519` cùng mô tả.

### AC-02 — Gom/rút gọn mô tả lặp liền kề

Với dãy `U0119`, `U0219`, `U0319`, ... , `U4319` đều có mô tả `Cá tra`, nội dung hiển thị phải được rút gọn thành dạng tương đương:

**U0119 -> U4319** (Cá tra)

Không chấp nhận lặp `Cá tra` 43 lần.

### AC-03 — Nội dung hiển thị khi mô tả xen kẽ

Card thu gọn phải đọc theo đúng thứ tự:

**L2319** (Lươn sống); **L2419** (Ốc hương); **L2519** (Lươn sống); **L2619** (Tôm hùm)

### AC-04 — Font weight

- Mã mẫu hoặc range mã như `L2319`, `L2419`, `U0119 -> U4319`: đậm.
- `Lươn sống`, `Ốc hương`, `Tôm hùm`: font-weight thường.
- Dấu ngoặc và dấu phân cách không cần đậm.

### AC-05 — Đồng nhất các chế độ

Thứ tự và quan hệ mã/mô tả giống nhau ở:

- card thu gọn;
- card mở rộng;
- bản in dạng list;
- bản in dạng compact.

### AC-06 — Không phá phân nhóm nghiệp vụ

Các mẫu vẫn thuộc đúng `DailyBatchAssignmentGroup` theo bộ chỉ tiêu đã gán. Thay đổi sort/format không được chuyển mẫu sang nhóm chỉ tiêu khác.

### AC-07 — Không phá cảnh báo xung đột mô tả

Nếu một mã mẫu có nhiều `descriptionAlternatives`, cảnh báo hiện tại vẫn xuất hiện và mã mẫu vẫn giữ đúng vị trí theo thứ tự mã.

### AC-08 — Không phá search

Tìm kiếm theo `L2519` hoặc `Lươn sống` vẫn trả về đúng card.

### AC-09 — Không phá dữ liệu thiếu mô tả

Mẫu không có mô tả vẫn hiển thị mã mẫu, không sinh `()`, `undefined`, `Không có mô tả` không cần thiết trên UI chính.

---

## 7. Kịch bản test bắt buộc

### Test 1 — Regression chính: mô tả lặp lại nhưng mã xen kẽ

Input:

| Mã mẫu | Mô tả |
| --- | --- |
| L2519 | Lươn sống |
| L2319 | Lươn sống |
| L2619 | Tôm hùm |
| L2419 | Ốc hương |

Expected sau `buildDailyBatchViews()`:

- `group.samples.map(sample => sample.sampleId)` bằng `['L2319', 'L2419', 'L2519', 'L2619']`.
- Chuỗi text chi tiết nếu có bằng `L2319 (Lươn sống); L2419 (Ốc hương); L2519 (Lươn sống); L2619 (Tôm hùm)`.
- Không xuất hiện chuỗi gom `L2319; L2519 (Lươn sống)`.

### Test 2 — Dãy dài cùng mô tả phải được nén

Input:

`U0119`, `U0219`, `U0319`, ... , `U4319` cùng mô tả `Cá tra`.

Expected:

- `group.samples` vẫn chứa đủ 43 sample theo đúng thứ tự.
- Presentation run chỉ cần một run cho mô tả `Cá tra`.
- `formattedSamples` của run tương đương `U0119 -> U4319`.
- Chuỗi hiển thị/fallback tương đương `U0119 -> U4319 (Cá tra)`.

Không chấp nhận chuỗi lặp `U0119 (Cá tra); U0219 (Cá tra); ...; U4319 (Cá tra)`.

### Test 3 — Mẫu có và không có mô tả

Input:

- `L2319` — Lươn sống
- `L2419` — không có mô tả
- `L2519` — Ốc hương

Expected:

`L2319 (Lươn sống); L2419; L2519 (Ốc hương)`

### Test 4 — Natural sort

Input không theo thứ tự:

`L1019`, `L919`, `L1119`, `L219`

Expected phải theo `naturalCompare()` hiện hành, không lexicographic đơn thuần.

### Test 5 — Prefix compatibility

Giữ regression hiện tại cho mã có prefix và không prefix để bảo đảm thay đổi format mô tả không làm hỏng `compareDailySampleIds()`.

### Test 6 — Xung đột mô tả

Một sample xuất hiện ở nhiều mẻ với hai snapshot mô tả khác nhau:

- Mã vẫn chỉ xuất hiện một lần trong đúng vị trí sort.
- `hasDescriptionConflict === true`.
- Cảnh báo vẫn hiển thị.
- Không sort theo các giá trị trong `descriptionAlternatives`.

### Test 7 — Template/style contract

Kiểm tra template bảo đảm:

- mã sample có class đậm;
- mô tả bình thường không còn `font-bold`/`font-black`;
- container của cả dòng không ép toàn bộ nội dung thành bold;
- list print và compact print đều dùng cấu trúc tách code/description.

### Test 8 — Layout planner

Chạy lại regression của screen/print planner để bảo đảm thay đổi field text không làm sai:

- compact/standard/wide;
- print compact/list;
- portrait/landscape;
- page allocation.

---

## 8. Checklist triển khai

Trạng thái cập nhật 2026-08-20: phần triển khai code và regression tự động đã hoàn tất; build Angular development pass. Các mục kiểm tra thủ công trên dữ liệu thực/Print Preview ở mục H vẫn để mở để xác nhận bằng mắt trước khi phát hành.

### A. Chốt dữ liệu và formatter

- [x] Thêm regression test với bộ `L2319 / L2419 / L2519 / L2619` trước khi sửa code.
- [x] Thêm regression test với dãy `U0119` → `U4319` cùng mô tả `Cá tra` để khóa yêu cầu rút gọn.
- [x] Xác nhận `group.samples` là nguồn sự thật duy nhất cho thứ tự mã mẫu khi render.
- [x] Giữ `compareDailySampleIds()` + `naturalCompare()` làm comparator cho thứ tự tăng dần hiện tại.
- [x] Không tái sử dụng kiểu `descMap` gom **toàn cục** theo mô tả; code hiện tại đã không còn cơ chế này.
- [x] Tạo helper `buildSampleDisplayRuns()` hoặc tên tương đương: quét `group.samples` theo thứ tự và chỉ gom các sample liền kề có cùng mô tả/trạng thái tương thích.
- [x] Mỗi run dùng `formatSampleList()` để nén mã liên tiếp, đặc biệt dãy `U0119` → `U4319`.
- [x] Bổ sung `sampleDisplayRuns` và `formattedSampleDisplay` (hoặc tên tương đương) cho presentation/layout.
- [x] Giữ `formattedSampleDetails` hiện tại ở dạng đầy đủ từng sample để search không mất mã nằm giữa range.
- [x] Xử lý sample không có mô tả mà không sinh dấu ngoặc rỗng.
- [x] Giữ nguyên logic phát hiện `descriptionAlternatives` và `hasDescriptionConflict`.
- [x] Không gom sample conflict chung với run bình thường nếu việc đó làm mất `descriptionAlternatives`.

### B. Card Dashboard — chế độ thu gọn

- [x] Sửa `daily-checklist.component.html` để render tuần tự từ display runs được dựng từ `group.samples`.
- [x] Render mã mẫu/range bằng `font-mono font-black` hoặc style đậm tương đương.
- [x] Render mô tả trong ngoặc đơn bằng `font-sans font-normal`.
- [x] Dùng `; ` làm phân cách trực quan giữa các run.
- [x] Giữ style hiện tại: không để container làm mô tả bị bold theo kế thừa.
- [x] Không có nhánh nào regroup toàn danh sách theo description.
- [x] Xác nhận dãy `U0119` → `U4319` cùng `Cá tra` chỉ hiển thị mô tả một lần.
- [x] Kiểm tra trường hợp chỉ có mã mẫu, không có mô tả.
- [ ] Kiểm tra wrap trên card hẹp/mobile với chuỗi nhiều sample.

### C. Card Dashboard — chế độ mở rộng

- [x] Giữ vòng lặp `group.samples` theo thứ tự đã sort.
- [x] Không gom run ở chế độ mở rộng; giữ từng sample để traceability.
- [x] Giữ mô tả bình thường ở `font-normal` và format `MÃ (Mô tả)` hiện tại.
- [x] Giữ style cảnh báo riêng cho `descriptionAlternatives`.
- [x] Kiểm tra không có style cha làm mô tả bị bold trở lại.

### D. Bản in dạng danh sách

- [x] Render bản in từ cùng display-run model hoặc cùng helper dùng cho màn hình.
- [x] Tái sử dụng các class hiện có `.cl-print-sample-code`, `.cl-print-sample-description`, `.cl-print-sample-separator` để giữ code bold/description normal.
- [x] Bảo đảm thứ tự bản in là `L2319; L2419; L2519; L2619` theo mã, không theo mô tả.
- [x] Bảo đảm dãy `U0119` → `U4319` cùng `Cá tra` được nén range và chỉ in `Cá tra` một lần.

### E. Bản in compact

- [x] Áp dụng cùng renderer/quy tắc thứ tự như bản in list.
- [x] Gom các run cùng mô tả **liền kề** và nén mã bằng `formatSampleList()`.
- [x] Không regroup các mô tả giống nhau nhưng bị ngắt bởi mô tả khác.
- [x] Chỉ mã mẫu in đậm; mô tả thường.
- [x] Kiểm tra ngắt dòng và chiều cao card sau khi áp dụng chuỗi đã rút gọn.
- [x] Với `printGroupSamples=true`, nén range trong từng run; với `false`, liệt kê đủ mã trong run nhưng chỉ in mô tả một lần.

### F. Search và layout planner

- [x] Giữ search dựa trên `group.sampleIds` + `group.formattedSampleDetails`, không dùng riêng `formattedSampleDisplay` đã nén.
- [x] Xác nhận search theo mã mẫu vẫn hoạt động qua `group.sampleIds`.
- [x] Xác nhận search theo mô tả vẫn hoạt động qua `group.formattedSampleDetails`.
- [x] Khóa regression `U2019` bằng dữ liệu chi tiết đầy đủ trong khi presentation là `U0119 -> U4319 (Cá tra)`, đồng thời contract test khóa việc search vẫn đọc `sampleIds`/`formattedSampleDetails`.
- [x] Cập nhật `daily-screen-layout-planner.ts` dùng `formattedSampleDisplay` cho ước lượng presentation.
- [x] Cập nhật `daily-print-layout-planner.ts` dùng `formattedSampleDisplay` cho ước lượng presentation.
- [x] Chạy lại regression layout compact/standard/wide.
- [x] Chạy lại regression print compact/list và portrait/landscape.

### G. Automated tests

- [x] Giữ các assertion hiện có của `formattedSampleDetails` để khóa thứ tự đầy đủ từng sample và phục vụ search/traceability.
- [x] Bổ sung assertion riêng cho `sampleDisplayRuns` / `formattedSampleDisplay`; không đổi `formattedSampleDetails` thành chuỗi range.
- [x] Thêm test mô tả lặp lại xen kẽ mã mẫu: `L2319/L2419/L2519/L2619`.
- [x] Thêm test dãy `U0119` → `U4319` cùng `Cá tra` được nén thành một run/range.
- [x] Thêm test hai đoạn cùng mô tả nhưng bị ngắt bởi mô tả khác phải giữ thành hai run riêng.
- [x] Thêm test sample có mô tả xen sample thiếu mô tả.
- [x] Giữ test xung đột description snapshot và bổ sung test conflict không nhập vào run bình thường.
- [x] Giữ test prefix-first hiện có.
- [x] Giữ test natural sort/range hiện có và bổ sung regression `L1019/L919/L1119/L219`.
- [x] Thêm hoặc cập nhật contract test cho template để khóa yêu cầu “code bold, description normal”.
- [x] Chạy trực tiếp `src/app/features/checklist/daily-checklist.utils.spec.ts` và UI contract của Daily Checklist sau thay đổi; không chỉ dựa vào script tổng nếu script đó chưa bao gồm spec này.

### H. Kiểm tra thủ công

- [ ] Mở Dashboard → **Theo Dõi Mẫu & Kết Quả Ngày** với dữ liệu có ít nhất hai mẫu cùng mô tả nhưng mã không liền nhau theo nhóm mô tả.
- [ ] Xác nhận card thu gọn hiển thị `L2319 (Lươn sống); L2419 (Ốc hương); L2519 (Lươn sống); L2619 (Tôm hùm)` theo đúng thứ tự.
- [ ] Kiểm tra dãy `U0119` → `U4319` cùng `Cá tra` và xác nhận UI hiển thị tương đương `U0119 -> U4319 (Cá tra)` thay vì lặp 43 lần.
- [ ] Xác nhận bằng mắt chỉ mã mẫu đậm.
- [ ] Mở rộng card và đối chiếu cùng thứ tự.
- [ ] Tìm theo `L2519` và xác nhận card vẫn được lọc đúng.
- [ ] Tìm theo `Lươn sống` và xác nhận card vẫn được lọc đúng.
- [ ] Mở Print Preview dạng list và kiểm tra thứ tự/style.
- [ ] Mở Print Preview dạng compact và kiểm tra thứ tự/style.
- [ ] Kiểm tra dark mode để mô tả vẫn đủ tương phản dù không bold.
- [ ] Kiểm tra mobile/card hẹp để separator và dấu ngoặc wrap dễ đọc.

### I. Hoàn tất

- [x] Không còn code presentation nào **group toàn cục** theo description và làm thay đổi thứ tự sample.
- [x] Có cơ chế consecutive-run để gom/rút gọn mô tả lặp liền kề.
- [x] Không còn style bình thường nào làm mô tả sample bị bold.
- [x] Tất cả test tự động liên quan đã chạy đều pass và Angular development build thành công.
- [x] Regression tự động cho phân nhóm chỉ tiêu, số lượng mẫu, số mẻ vật lý và traceability vẫn pass.
- [ ] Cập nhật changelog/release note nếu thay đổi này được đưa vào bản phát hành.

---

## 9. Definition of Done

Hạng mục được xem là hoàn tất khi đồng thời đạt đủ các điều kiện:

1. Thứ tự sample trong **Theo Dõi Mẫu & Kết Quả Ngày** luôn xuất phát từ comparator mã mẫu, không từ description.
2. Hai sample có cùng mô tả không còn bị kéo lại gần nhau nếu điều đó phá thứ tự mã.
3. Các sample liền kề có cùng mô tả được gom thành display run; dãy mã liên tiếp được nén bằng `formatSampleList()` để tránh lặp mô tả quá dài.
4. Dãy `U0119` → `U4319` cùng `Cá tra` hiển thị tương đương `U0119 -> U4319 (Cá tra)`, không lặp `Cá tra` 43 lần.
5. Màn hình thu gọn, màn hình mở rộng, print list và print compact cho cùng một thứ tự/nguyên tắc presentation phù hợp.
6. Chỉ mã mẫu/range được in đậm; mô tả bình thường.
7. Search, cảnh báo conflict, target assignment grouping và traceability không bị thay đổi nghiệp vụ.
8. Regression test với `L2319 → L2419 → L2519 → L2619` và `U0119 → U4319 (Cá tra)` đều pass.
