# Rà soát và kế hoạch nâng cấp chức năng in LIMS

Ngày rà soát: **01/10/2026**. Mã nguồn đối chiếu: **`dc6e1e5e`**.

Trạng thái cập nhật: **Đã triển khai đợt 1–2, phần mềm của đợt 3 và các biểu mẫu đợt 4 dựa trên dữ liệu hiện có; đã phát hành và xác minh production `26.10.01-b06`.** Kết quả cuối, hướng dẫn vận hành và bằng chứng triển khai được tập hợp ở [tài liệu bàn giao](printing-handover.md).

Tài liệu này hiệu chỉnh bản phân tích ban đầu và xác định thứ tự nâng cấp, ranh giới nghiệp vụ, các phụ thuộc và tiêu chí nghiệm thu. Mục 1 và 2 ghi nhận hiện trạng tại commit `dc6e1e5e`, trước thay đổi. Các bảng đợt 1 và Smart Prep là kết quả tại thời điểm kiểm tra từng đợt; số test phát hành cuối được ghi ở tài liệu bàn giao. Kiểm tra trình duyệt dùng component Angular thực tế với dữ liệu giả lập; chưa kiểm tra phiên đăng nhập LIMS, PDF thật trên Drive hoặc bản in vật lý.

## Kết quả bổ sung — Lịch trực, Checklist, nhãn và biểu mẫu mới

- Lịch trực mở preview A4 ngang trước khi in, giữ bộ lọc cá nhân/toàn bộ, loại ca hủy, cảnh báo ca cần xác minh và hai vùng ký tay. Không tự gán phiên bản hay ngày duyệt lịch.
- Checklist dùng lại planner và renderer hiện có, mở preview trang giấy sau cấu hình, giữ cả hai hướng giấy/dạng danh sách hoặc gọn; thêm vùng người giao/nhận việc. Nội dung được đo và phân trang, lặp đầu bảng, giữ thứ tự nhóm mẫu. Số trang preview là số trang thực đã đo.
- Nhãn dùng catalog chung với hai bộ hiệu chỉnh cũ được giữ riêng. Mã nội bộ hiện rõ trên nhãn chất chuẩn. Chờ QR/ảnh sẵn sàng và dọn vùng in sau `afterprint` hoặc hủy/lỗi; chặn cấu hình vượt khổ A4.
- Kho có thẻ kho tải đủ lịch sử theo trang và đối soát với tồn hiện tại, phiếu kiểm kê toàn bộ danh sách đang lọc, nhãn sang chiết A4 tự cắt với thông tin nguồn và ô ghi nhận thủ công.
- Requests có mẫu bàn giao để điền thông tin giao/nhận, số lượng/tình trạng thực tế và ký tay. Đây chưa phải workflow tiếp nhận lưu trên hệ thống.
- Calculator có bản in thông số/vật tư/công thức của phiên bản SOP hiện tại. Mô hình SOP chưa chứa các bước thao tác được kiểm soát nên output ghi rõ phạm vi, không thay thế tài liệu SOP đã ban hành.
- Traceability xuất phần tóm tắt/timeline đã được phép tải, ghi rõ lịch sử còn thiếu/chưa tải. Preview bị xóa khi đổi hồ sơ, đăng xuất hoặc thay đổi quyền; không mở thêm quyền đọc để in.
- Documents đổi nhãn nút thành “Mở để in”, đúng với hành vi mở tài liệu ở tab mới. Viewer báo cáo giữ metadata của phiên bản đang chọn.

Fixture cuối: SOP 84 dòng/7 trang; lịch trực 39 dòng/4 trang và cá nhân 20 dòng/2 trang; Checklist 24 phương pháp/48 mẫu ở bốn cấu hình; 6 nhãn QR qua 2 tờ; kiểm kê 60 vật tư/6 trang, thẻ kho 60 sự kiện/4 trang, bàn giao 60 mẫu/3 trang, SOP 30 vật tư/2 trang, truy xuất 60 sự kiện/4 trang và nhãn sang chiết/1 trang. Smart Prep hỗ trợ 5 chế độ, 4 chiến lược dãy; fixture 40 điểm có 135 dòng/9 trang. Cả native và PDF tải xuống cùng số trang. Đã render/xem PDF, kiểm tra mobile, dark mode, Escape, trạng thái lỗi và cleanup.

Phụ thuộc còn lại: nghiệm thu giấy/máy in thật; workflow lưu hồ sơ dung dịch/sang chiết hoặc tiếp nhận mẫu; nội dung SOP được kiểm soát; chính sách sửa đổi báo cáo và tích hợp chữ ký mật mã. Các mục này cần dữ liệu/chính sách riêng và không được mô tả là đã hoàn thành trong bản phát hành này.

## Kết quả đợt 1 ngày 01/10/2026

Đã thực hiện:

- **Hàng đợi:** tải dữ liệu nhúng hoặc snapshot liên kết theo từng lượt, giữ thứ tự phiếu đang hiển thị. Khi phiếu thiếu, dữ liệu sai cấu trúc hoặc một lượt tải thất bại, báo danh sách phiếu liên quan và không mở preview của một tập dữ liệu thiếu. Mỗi log vẫn giữ mã mẻ/người dùng riêng khi dùng chung snapshot.
- **Layout SOP:** đo nội dung ở đúng chiều rộng A4 sau khi font/ảnh/QR sẵn sàng. Ghép đôi phiếu ngắn, dành cả trang cho phiếu vừa và tách bảng dài theo dòng; lặp thông tin nhận diện, QR, đầu bảng và chân phiếu. Một dòng hoặc phần đầu phiếu không thể vừa A4 sẽ báo lỗi và chặn in/PDF, không cắt bỏ nội dung.
- **Nội dung phiếu:** hiển thị mã mẻ riêng với mã truy xuất; thêm vùng ghi thiết bị và lô/HSD thực dùng. Trường chưa có dữ liệu giữ khoảng trống có nhãn. Đổi tên vùng xác nhận thành người duyệt trên hệ thống, không mô tả là chữ ký mật mã.
- **Preview chung:** dùng `app-modal-shell` và `app-button`, nút in indigo, cấu hình thu gọn, zoom vừa chiều rộng, footer thao tác dễ truy cập trên mobile, thông báo đang chuẩn bị/lỗi và thử lại. Viewer PDF giữ metadata phiên bản, người và ngày phát hành của tài liệu đang chọn.
- **Vòng đời in/PDF:** chụp dữ liệu cho phiên preview; sao chép cả bitmap QR; đợi tài nguyên sẵn sàng. Giữ DOM/iframe trong lúc hộp thoại in mở, dọn sau khi kết thúc/hủy/lỗi và khôi phục vùng in cũ. Chặn phản hồi tải PDF cũ ghi đè phiên bản mới, thu hồi blob hết dùng và giữ metadata khi in lỗi.
- **Tải PDF:** xuất từng trang đã phân bố, dùng PNG và bật nén jsPDF. Đây vẫn là PDF raster. Đường native print/Save as PDF của trình duyệt dùng cùng nội dung đã phân trang.

Kết quả kiểm tra:

| Kiểm tra | Kết quả |
| --- | --- |
| `npm run test:printing` | 10 test về đầy đủ/thứ tự dữ liệu và vòng đời in |
| `npm run test:ui-contracts` | 269 test đạt, gồm các test printing và primitives liên quan |
| `npm run test:results` / `npm run test:documents` | 39 / 78 test đạt |
| `npm run test:ui-guardrails` / `npm run test:reachability-audit` | 14 test guardrails đạt; kiểm tra test được tham chiếu đạt |
| Typecheck, lint, production build, `git diff --check` | Đạt |
| Edge headless, component Angular biên dịch AOT, font/CSS thực tế | Phiếu 1/2/3, tập 2/80/2 dòng, phiếu 160 dòng; không thiếu/đảo dòng hoặc tràn chiều cao; QR canvas có nội dung trước xuất |
| PDF tải xuống và PDF native của tập 2/80/2 | Cùng 7 trang A4; PDF tải xuống 1.674.237 byte, native 171.116 byte. Trích xuất text native xác nhận đủ 84 dòng, gồm dòng cuối `HC-1-79` |
| QA hình ảnh PDF | Render và xem tất cả 7 trang của mỗi đường xuất; không thấy cắt chữ, chồng nội dung, mất dòng hoặc lỗi glyph trong fixture |
| Tương tác trình duyệt | Mobile 390×844, light/dark, Escape, thay tùy chọn, khóa xuất khi dòng quá dài, cleanup sau in, tải PDF đua thứ tự và giữ metadata khi in thất bại đều đạt |

Script tái hiện: [scripts/print-preview-smoke.js](../scripts/print-preview-smoke.js). Hướng dẫn chạy: [TESTING_GUIDE.md](../TESTING_GUIDE.md).

Giới hạn nghiệm thu của đợt 1: fixture không gọi Firebase hoặc Drive thật và không ghi dữ liệu nghiệp vụ. Kiểm tra QR xác nhận render/sao chép bitmap, chưa thay thế việc quét mã từ bản in. Nghiệm thu driver, máy in và OAuth/Drive thật là kiểm tra vận hành tại đơn vị. Kết quả gate/phiên bản/deploy cuối được ghi ở tài liệu bàn giao.

## Kết quả đợt 2 — Smart Prep ngày 01/10/2026

Đã thực hiện:

- **Luồng thao tác:** nút `Xem & In phiếu` mở preview A4 trong ứng dụng, có zoom/vừa chiều rộng, trạng thái chuẩn bị, thử lại, In và Tải PDF. Giữ chặn xuất khi phép tính chưa hợp lệ; không gọi in ngay từ nút trên màn hình pha chế.
- **Năm loại phiếu:** pha dung dịch đích, xác định nồng độ, thêm chuẩn, dãy chuẩn/QC và quy đổi kết quả mẫu. Dãy chuẩn hỗ trợ pha trực tiếp, nhiều chuẩn trung gian, pha nối tiếp và hỗn hợp nhiều thành phần. Tên nguồn, điểm chuẩn, mẫu trắng, phần thêm, phạm vi/ngoại lệ, nhu cầu nguồn và phần dư được thể hiện theo dữ liệu tính hiện tại.
- **Hồ sơ và thực hiện:** dùng lại chín trường thông tin hồ sơ sẵn có; in lượng dự tính, lượng thực tế đã nhập hoặc khoảng trống có nhãn, thiết bị tham khảo và vùng người thực hiện/người kiểm tra ký tay. Giữ đơn vị nồng độ đang chọn. Không tự tạo lô, HSD, thiết bị thực dùng hoặc thông tin phê duyệt.
- **Snapshot:** tạo dữ liệu riêng cho phiên preview từ draft/kết quả hiện tại, không tính lại hoặc ghi hồ sơ. In đủ công thức, phép thế số và cảnh báo kể cả khi phần truy vết đang thu gọn trên màn hình. Làm gọn đuôi số dấu phẩy động trong câu thao tác/phép thế số; không đổi giá trị phép tính hoặc metadata hồ sơ.
- **Phân trang:** đo ở chiều rộng A4 sau khi tài nguyên sẵn sàng, chuyển nguyên dòng sang trang tiếp theo, lặp thông tin nhận diện/đầu bảng và đánh số trang. Dòng không thể vừa một trang sẽ báo lỗi, chặn In/Tải PDF để người dùng điều chỉnh nội dung.
- **Xuất A4 dùng chung:** preview SOP và Smart Prep dùng cùng helper native print/PDF, giữ cơ chế khôi phục vùng in. PDF tải xuống chụp từng trang riêng; loại nội dung ứng dụng và các trang khác khỏi DOM sao chép khi chụp, giảm thời gian xuất phiếu nhiều trang. PDF này vẫn là raster.

Kết quả kiểm tra:

| Kiểm tra | Kết quả |
| --- | --- |
| `npm run test:prep` | 64 test đạt; gồm các chế độ pha chế, adapter phiếu, snapshot, đơn vị, phần thêm/ngoại lệ và chặn xuất không hợp lệ |
| `npm run test:printing` / `npm run test:ui-contracts` | 10 / 269 test đạt sau khi dùng chung helper xuất A4 |
| `npm run test:ui-preparation` / `npm run test:ui-guardrails` | 1 / 14 test đạt |
| `npm run test:reachability-audit` | 157 file test được tham chiếu; đạt |
| Typecheck, lint, production build, `git diff --check` | Đạt |
| Smoke trình duyệt đầy đủ | Component Angular AOT/CSS/font thực tế; giữ kiểm tra SOP/PDF đợt 1 và thêm năm chế độ Smart Prep, bốn cách tạo dãy chuẩn; thứ tự/nội dung từng ô trùng snapshot, không tràn vùng trang |
| Fixture Smart Prep cuối | Pha dung dịch, nồng độ, thêm chuẩn và quy đổi: mỗi phiếu 2 trang; nhiều chuẩn trung gian: 3 trang. Dãy trực tiếp 40 điểm: 9 trang, đủ 135 dòng |
| Hai đường xuất của dãy 40 điểm | Cùng 9 trang A4; PDF tải xuống 2.215.223 byte, native 104.082 byte. Thời gian tải PDF khoảng 6,1 giây; các phiếu 2 trang khoảng 1,4–1,8 giây trong môi trường kiểm thử này |
| QA PDF cuối | Render và xem đủ 28 trang của năm PDF tải xuống và hai PDF native; xem thêm trang ở độ phóng lớn. Không thấy cắt chữ, chồng nội dung, mất dòng hoặc lỗi glyph. Text native xác nhận thông tin phương pháp, vùng kiểm tra và điểm chuẩn cuối |
| Tương tác | Mobile 390×844, light/dark, Escape, footer thao tác, khôi phục DOM sau in và chặn xuất khi một dòng quá dài đều đạt |

Nguồn thay đổi: [Smart Prep](../src/app/features/preparation/smart-prep.component.ts), [adapter phiếu](../src/app/features/preparation/prep-print-document.ts), [preview A4](../src/app/shared/components/a4-document-preview/a4-document-preview.component.ts), [phân trang](../src/app/shared/utils/a4-document-pagination.ts), [helper xuất](../src/app/shared/utils/a4-output.ts). Script và cách chạy được ghi tại [TESTING_GUIDE.md](../TESTING_GUIDE.md).

Giới hạn: các kết quả trên dùng fixture, chưa nghiệm thu phiên đăng nhập, dữ liệu thật/Drive hoặc máy in vật lý. Vùng chữ ký là ô ghi nhận thủ công; phiếu hỗ trợ tính toán chưa phải hồ sơ được phê duyệt hay xác nhận tuân thủ ISO/GLP. Preview lịch trực và Checklist sau đó đã được triển khai, như phần cập nhật ở đầu tài liệu.

## 1. Hiện trạng đã đối chiếu

| Phạm vi | Hành vi hiện tại | Bước trước hộp thoại in | Khoảng thiếu chính |
| --- | --- | --- | --- |
| SOP Calculator | `onPrintDraft()` mở `PrintService.openPreview()`; duyệt đưa phiếu vào hàng đợi | Có preview A4 | Preview còn UI legacy; phiếu cố định hai nửa trang; chưa có vùng mã mẻ/thiết bị/lô chuyên biệt |
| Hàng đợi in | Đọc dữ liệu nhúng hoặc `print_jobs`, mở cùng preview A4 | Có preview A4 | UI chưa dùng đầy đủ primitives; tải nhiều phiếu có thể trả một phần dữ liệu khi một lượt đọc lỗi |
| Smart Batch | Gọi `directApproveBatchPlan()` để tạo yêu cầu, log và `print_jobs` | Xem/in sau qua hàng đợi | Giữ hành vi duyệt và ghi dữ liệu riêng với thao tác in |
| Smart Prep | In HTML có tiêu đề và một khối text qua iframe; có chặn xuất khi tính toán chưa hợp lệ | Chưa có preview trong ứng dụng | Thiếu bố cục bảng và phân trang; cần dùng lại thông tin hồ sơ đã có |
| Standards | Modal dùng `app-modal-shell`, preview nhãn cuộn/A4, chọn ô bắt đầu, bản sao và trường nội dung | Có preview chuyên dụng | Còn control/màu legacy; chưa thấy mã quản lý nội bộ hiển thị thành trường riêng trên nhãn |
| Labels | Preview trực tiếp, Brother, Tomy A4 và A4 thường; hỗ trợ text/barcode/QR, hiệu chỉnh vị trí | Có preview ngay trên trang | Đồng bộ preset và kiểm tra khớp preview/output; preview đang giới hạn số trang/ô |
| Inventory | Đã có tab `labels` nhúng `app-label-print` | Dùng preview của Labels | Chưa thấy mẫu thẻ kho, kiểm kê hoặc biểu mẫu nhãn sang chiết chuyên biệt |
| Daily Checklist | Modal cấu hình tự động/gọn/danh sách, hướng giấy và mô tả mẫu; sau đó clone DOM và `window.print()` | Có cấu hình, chưa có preview trang giấy | Bổ sung preview dùng cùng renderer và planner hiện tại |
| Duty Stats | Sinh lịch A4 ngang, ký tay người lập/lãnh đạo; in từ menu công cụ/mobile hoặc Ctrl/Cmd+P | Chưa có preview trong ứng dụng | Preview phạm vi dữ liệu, phân trang; chưa có trường phiên bản/ngày duyệt trong output hiện tại |
| Results / Results View | Tạo và lưu các phiên bản báo cáo, preview PDF/CoA qua Drive proxy/blob, in/tải PDF | Có preview PDF | Tách metadata trên viewer khỏi nội dung thật của PDF; rà soát nghiệp vụ sửa đổi báo cáo |
| Documents | Viewer có nút In/In PDF; `printDocument()` mở blob hoặc tài liệu gốc ở tab mới | Có viewer tài liệu; in tiếp tại tab được mở | Nhãn nút cần phản ánh hành vi mở tài liệu để in; cân nhắc dùng đường in blob chung khi phù hợp |
| SOP library/editor | Chưa thấy mẫu in Quick Guide riêng | Chưa có | Cần thiết kế nội dung rút gọn và quản lý phiên bản SOP |
| Traceability | Có dữ liệu truy xuất và hướng dẫn tìm mã trên phiếu | Chưa thấy thao tác in dossier riêng | Thiết kế hồ sơ từ dữ liệu được phép đọc; không suy ra toàn bộ thiết bị/lô từ các trường chưa có |

Nguồn chính:

- [PrintService](../src/app/core/services/print.service.ts), [preview chung](../src/app/shared/components/print-preview-modal/print-preview-modal.component.ts), [layout phiếu SOP](../src/app/shared/components/print-layout/print-layout.component.ts).
- [Calculator](../src/app/features/sop/calculator/calculator.component.ts), [hàng đợi](../src/app/features/requests/print-queue.component.ts), [StateService](../src/app/core/services/state.service.ts).
- [Smart Prep](../src/app/features/preparation/smart-prep.component.ts), [Standards print](../src/app/features/standards/components/standards-print-modal.component.ts), [Labels](../src/app/features/labels/label-print.component.ts).
- [Inventory](../src/app/features/inventory/inventory.component.html), [Checklist](../src/app/features/checklist/daily-checklist.component.ts), [Duty Stats](../src/app/features/duty-stats/duty-stats.component.ts).
- [Documents viewer](../src/app/features/documents/document-preview-modal.component.ts), [mô hình báo cáo](../src/app/core/models/analysis-result.model.ts), [Requests](../src/app/features/requests/request-list.component.ts).

## 2. Những nhận định cần hiệu chỉnh

1. **Màu chuẩn hiện tại là indigo.** [UI_CONVENTIONS.md](../UI_CONVENTIONS.md) quy định primary indigo; [DESIGN.md](../DESIGN.md) không dùng fuchsia/pink làm CTA chính cho UI mới. Nhiều module đã chuyển sang `app-button`; phần chưa đồng bộ tập trung ở preview chung, hàng đợi và control chuyên biệt còn legacy.
2. **PDF từ `doPdf()` hiện là ảnh raster.** Code dùng html2canvas, chuyển canvas thành JPEG rồi `jsPDF.addImage()`. Không mô tả là PDF vector. Việc xuất nguyên nội dung thành một canvas và cắt theo chiều cao PDF cũng chưa chứng minh phân trang đúng theo từng `.print-page`.
3. **“In nhanh” vẫn gọi hộp thoại in trình duyệt.** Iframe/blob giúp chuẩn bị dữ liệu và hạn chế phụ thuộc popup, nhưng code vẫn gọi `contentWindow.print()`; không có cơ chế tự chọn máy in hoặc silent printing.
4. **“Xác nhận điện tử” trên phiếu SOP hiện là dấu kiểm và tên `job.user`.** Chưa có bằng chứng trong đường in này về chữ ký mật mã hay chứng thư số. Không dùng nhãn UI làm bằng chứng chữ ký số hoặc tuân thủ tiêu chuẩn.
5. **Smart Prep đã có thông tin hồ sơ.** `sheetFields()` gồm SOP/phiên bản, nguồn/lô/chứng chỉ, dung môi, mã thiết bị, người/ngày pha, hạn dùng, bảo quản và ghi chú. Phép tính đã hỗ trợ lượng thực tế. Output hiện có CSS cơ bản; nâng cấp chủ yếu là renderer, preview và cấu trúc biểu mẫu.
6. **Standards đã có ngày mở nắp, HSD, bảo quản và QR truy xuất.** Các trường này là tùy chọn và có thể bị ẩn ở mẫu nhỏ. Cần thống nhất trường cốt lõi theo loại nhãn và cách xử lý thiếu dữ liệu/tràn nội dung, thay vì thêm lại toàn bộ trường.
7. **Inventory đã truy cập được chức năng nhãn dùng chung.** Cần phân biệt công cụ in mã/nhãn hiện có với mẫu nhãn sang chiết hóa chất có dữ liệu nghiệp vụ riêng.
8. **Requests chưa phải bằng chứng về workflow tiếp nhận mẫu khách hàng.** Mô hình hiện gắn SOP, vật tư, trạng thái duyệt và danh sách mẫu. Phiếu bàn giao cần làm rõ thêm bên giao/nhận, tình trạng, số lượng, thời điểm và hồ sơ tiếp nhận.
9. **Quản lý phiên bản báo cáo đã tồn tại.** Mô hình có lịch sử PDF và snapshot dữ liệu phát hành. Chưa thấy trường chuyên biệt cho lý do sửa đổi/thay thế trong mô hình đã đọc; cần rà soát tiếp backend và template Docs trước khi xác định thay đổi. `stale` của báo cáo ALL và supersede khi chuyển SOP không mặc nhiên là quy trình thay thế báo cáo đã phát hành.
10. **Checklist có cấu hình in, chưa phải preview giấy.** Documents là một đường in bổ sung đã bị bỏ sót trong ma trận ban đầu.

## 3. Các quyết định thiết kế đề xuất

- Nút mở preview ở toolbar dùng `app-button variant="secondary"`, icon `fa-solid fa-print`, nhãn rõ theo tài liệu. Nút `In` trong workspace xem trước dùng primary indigo. Thao tác duyệt mẻ tiếp tục có nhãn thể hiện việc duyệt và xếp hàng.
- Mọi đường in có bước xem trước phù hợp. Preview trực tiếp của Labels đã đáp ứng bước này; không mở thêm modal lặp lại. Với PDF chính thức, hiển thị chính file đã phát hành.
- Thống nhất phần khung: tên tài liệu, phạm vi dữ liệu, giấy, số trang/nhãn, tải/xuất khi được hỗ trợ, trạng thái xử lý, thông báo thiếu dữ liệu, đóng và quản lý focus.
- Giữ renderer riêng cho phiếu SOP, phiếu pha chế, lịch/checklist, nhãn và PDF. Không ép các tài liệu mới vào `PrintJob` hiện tại vốn phụ thuộc `sop/inputs/items`.
- HTML preview và HTML print dùng cùng component và dữ liệu đã chụp cho phiên xem trước. Có chế độ style preview rõ ràng để thấy được bố cục trang mà không phụ thuộc riêng `@media print`.
- Các trường nhận diện và truy xuất cốt lõi được quyết định theo từng mẫu. Khi thiếu dữ liệu, hiển thị rõ trạng thái hoặc khoảng trống có nhãn; không tự suy ra lô, HSD hay thiết bị thực tế.
- Mobile dùng thanh tác vụ dễ truy cập, panel cấu hình có thể thu gọn và zoom vừa chiều rộng. Giấy preview vẫn nền trắng; chrome hỗ trợ light/dark, bàn phím, Escape và focus.
- Chưa đổi preset Brother/Tomy theo suy đoán. Máy in, driver, kích thước decal thực tế và hiệu chỉnh vị trí được xác nhận khi nghiệm thu thiết bị.

## 4. Thứ tự triển khai

### Đợt 1 — Độ tin cậy dữ liệu in và nền preview chung (đã triển khai)

Phạm vi: preview A4/PDF chung, print queue, layout phiếu SOP và vòng đời vùng in.

Phạm vi đã triển khai từ hiện trạng ban đầu:

1. Tái hiện bằng fixture các trường hợp phiếu dài, số phiếu lẻ/chẵn, nhiều trang, chuỗi dài và QR chưa render xong. Layout hiện dùng `.print-page` cao 296 mm với `overflow:hidden`, mỗi phiếu `max-height:148mm`; CSS toàn cục trong `src/index.html` cố định trang/container A4. Xác minh nguy cơ cắt nội dung và tương tác giữa các đường in trước khi chỉnh.
2. Tải hàng đợi phải trả trạng thái đầy đủ hoặc lỗi có danh sách phiếu thiếu. `fetchPrintData()` hiện bắt lỗi từng lượt tải rồi vẫn trả mảng đã có; không cho bấm in một tập thiếu như thể đã đủ.
3. Ổn định thứ tự phiếu theo lựa chọn/thứ tự đã hiển thị, kể cả khi dữ liệu được đọc thành nhiều lượt.
4. Thay chờ thời gian cố định bằng điều kiện sẵn sàng cho font/ảnh/QR khi cần. Dọn iframe, DOM in và style sau khi hoàn tất/hủy/đóng và khi lỗi; khôi phục trạng thái giao diện trước đó.
5. Di trú chrome preview/hàng đợi sang shared primitives và token hiện hành. Nếu dùng `app-modal-shell`, hạ baseline overlay guardrail tương ứng trong cùng thay đổi.
6. Xác định rõ hai đường xuất: native print/Save as PDF của trình duyệt và tải PDF do ứng dụng tạo. Nếu giữ html2canvas/jsPDF, chụp/xuất theo từng trang đã phân bố; đặt tên chức năng đúng với kết quả raster. Chỉ cam kết PDF vector khi có renderer phù hợp và kiểm tra được output.
7. Bổ sung vùng mã mẻ hiển thị riêng, phân biệt với mã log/truy xuất. Thêm thiết bị/lô/HSD khi có nguồn dữ liệu; nếu chưa có, dùng ô ghi nhận thủ công có nhãn theo mẫu được thống nhất.

Nghiệm thu:

- Preview và output cùng số phiếu, thứ tự, nội dung và ranh giới trang; không âm thầm bỏ phiếu hoặc cắt bảng.
- QR hoạt động khi tải lần đầu và các lần sau; lỗi QR được báo trước khi in nếu QR là trường bắt buộc của mẫu.
- Đóng/hủy/in lặp lại và chuyển giữa A4/nhãn/PDF không để lại style hoặc DOM ảnh hưởng lần sau.
- Viewer hiển thị đúng PDF được chọn và metadata tương ứng; lỗi tải/xác thực có đường thử lại hiện tại.
- UI hoạt động ở desktop, tablet, mobile, light/dark và bàn phím.

### Đợt 2 — Phiếu pha chế, lịch trực và Checklist (đã triển khai)

**Smart Prep — đã triển khai và kiểm tra:** renderer A4 riêng từ draft/result hiện tại; trình bày tên dung dịch, nồng độ/thể tích, nguồn chất, lượng dự tính/thực tế, SOP, dung môi, thiết bị, người/ngày pha, hạn dùng/bảo quản, công thức và cảnh báo. Hiển thị rõ dữ liệu tính toán với phần ghi nhận thực hiện và ô kiểm tra/ký tay. Giữ `canExport()` và các quy tắc tính toán. Hỗ trợ mọi chế độ đang có; cấu trúc bảng cho pha đơn, dãy chuẩn, thêm chuẩn và chuỗi xử lý mẫu phù hợp từng output. Không chuyển một phiếu tính thành hồ sơ đã được duyệt bằng cách chỉ thêm tiêu đề/chữ ký.

**Duty Stats — đã triển khai:** tạo snapshot renderer từ `printSchedule()`, thêm preview A4 ngang. Bảo toàn lọc thời gian/cá nhân/ca đang áp dụng, cảnh báo ca cần xác minh và hai vùng ký tay. Phiên bản/ngày duyệt chỉ đưa vào output sau khi có dữ liệu phát hành lịch tương ứng; không dùng thời gian xuất để giả làm ngày duyệt.

**Checklist — đã triển khai:** dùng lại `printPlan()`, dữ liệu mẻ và renderer hiện có; thêm preview trang giấy, đổi các control cấu hình sang primitives. Bổ sung vùng người giao/nhận việc ký tay.

Nghiệm thu: so sánh output trước/sau với fixture nghiệp vụ; phép tính, phạm vi mẫu/chỉ tiêu và lọc lịch không đổi ngoài những thay đổi đã được thống nhất; nội dung dài phân trang được và không bị ẩn theo state thu gọn của màn hình.

### Đợt 3 — Nhãn và preset giấy (phần mềm đã triển khai, cần nghiệm thu thiết bị)

- Tách một catalog kích thước/preset dùng chung khi đối chiếu xong các preset ở Labels và Standards; vẫn giữ cấu hình nội dung riêng.
- Bổ sung mã quản lý nội bộ trên nhãn chất chuẩn. Giữ các trường hiện có, quy tắc ưu tiên và thông báo trường chưa có dữ liệu.
- Kiểm tra tràn tên/lô/HSD, cỡ QR/barcode và số nhãn/tờ; preview nhiều trang hiện bị giới hạn phải cho biết giới hạn và tổng output dự kiến.
- Dùng QR đường dẫn truy xuất hiện có làm mặc định phù hợp. GS1 chỉ bật với dữ liệu định danh đã xác minh; không mặc nhiên dùng GTIN hard-code hiện có làm định danh chính thức của đơn vị.
- In thử ô bắt đầu khác 1, nhiều bản sao, qua nhiều tờ A4 và khổ cuộn; đối chiếu kích thước bằng thước và quét mã từ bản in.

### Đợt 4 — Biểu mẫu mới và quản lý phát hành (biểu mẫu dữ liệu hiện có đã triển khai)

Các yêu cầu nghiệp vụ ban đầu dưới đây được giữ để theo dõi. Phạm vi đã triển khai và phụ thuộc cụ thể được ghi ở phần cập nhật và tài liệu bàn giao; thẻ kho hiện đọc toàn bộ lịch sử có giới hạn an toàn 10.000 bản ghi, chưa có bộ lọc ngày. Nhãn/bàn giao là mẫu điền thủ công. Quản lý phát hành/chữ ký số cần triển khai riêng:

1. **Thẻ kho:** nhập/xuất/điều chỉnh, tồn đầu/cuối và lịch sử theo khoảng ngày. Tận dụng `StockHistoryItem`, snapshot/delta hiện có; phải tải đủ lịch sử và có đối soát. Không dựng thẻ kho từ feed gần nhất hoặc tự đổi quyền đọc.
2. **Nhãn sang chiết:** gắn mặt hàng nguồn, lô, nồng độ nếu áp dụng, ngày/người chiết, HSD và cảnh báo đang được quản lý. Cần dữ liệu riêng cho dung dịch/lọ sang chiết; không suy ra HSD từ nhãn cuộn.
3. **Kiểm kê:** danh sách vật tư, tồn hệ thống, tồn thực tế, chênh lệch, phạm vi/ngày kiểm kê và vùng xác nhận.
4. **Biên nhận/bàn giao mẫu:** thiết kế workflow và mô hình tiếp nhận trước khi thêm nút vào Requests. Chưa đủ cơ sở coi đây là việc chỉ bổ sung mẫu HTML.
5. **SOP Quick Guide:** nội dung được chọn từ SOP/phiên bản cụ thể, tiêu đề/mã phiên bản rõ ràng; xử lý quy trình dài theo mẫu được duyệt.
6. **Traceability dossier:** dùng snapshot và các nguồn được phép đọc; thể hiện rõ mắt xích thiếu dữ liệu. Không mở rộng nội dung public chỉ để hỗ trợ in.
7. **Sửa đổi báo cáo và chữ ký số:** rà soát riêng đường phát hành ở Results, backend/Apps Script và template Docs. Lý do sửa đổi, liên kết bản thay thế, trạng thái hiệu lực và chữ ký mật mã là thay đổi nghiệp vụ/tích hợp; metadata trên modal không sửa được nội dung PDF đã phát hành.

## 5. Kiểm tra và cách chia thay đổi

- Mỗi đợt tạo thay đổi đủ nhỏ để review, bắt đầu từ đợt 1. Không đổi logic duyệt, trừ kho hoặc tính toán trong cùng thay đổi chỉ dành cho UI in.
- Kiểm thử tự động tập trung ở logic phân trang, tính đầy đủ/thứ tự phiếu, các adapter dữ liệu và phép đối soát; không thêm test chỉ phản chiếu màu/class.
- Chạy test liên quan của module bị đổi, typecheck/build và UI guardrails theo quy ước dự án. Trước phát hành chạy `npm run release:verify`; xem kết quả lần chạy cuối ở tài liệu bàn giao.
- Runtime QA cần fixture có 1/2/3 và nhiều phiếu, dữ liệu dài/thiếu, PDF thất bại/OAuth, mỗi chế độ pha chế, giấy dọc/ngang, nhiều trang nhãn và chuỗi thao tác in/hủy/lặp lại.
- Ghi riêng kết quả native print, file PDF do ứng dụng tạo và bản in vật lý. Việc build thành công không chứng minh đúng phân trang, đúng kích thước decal hoặc đọc được QR.

## 6. Phụ thuộc cần chốt trước từng phần triển khai

| Thông tin | Cần ở bước nào | Quyết định tạm thời để chuẩn bị |
| --- | --- | --- |
| Máy in/driver, mã giấy và kích thước thực tế | Nghiệm thu đợt 3 | Giữ preset hiện hành, ưu tiên A4 cho phiếu nghiệp vụ |
| Mã biểu mẫu, người kiểm tra và trường cốt lõi | Renderer pha chế và các mẫu mới | Dùng dữ liệu đã có, trường thiếu hiển thị rõ; chưa tự gán biểu mẫu đạt ISO/GLP |
| Nguồn mã thiết bị, lô và HSD thực dùng | Bổ sung truy xuất phiếu SOP/pha chế | Liên kết khi có; cho ghi nhận thủ công nếu mẫu cho phép |
| Workflow tiếp nhận và bàn giao mẫu | Biên nhận mẫu | Thiết kế nghiệp vụ trước khi thêm UI in |
| Chính sách sửa đổi/phát hành và nhà cung cấp chữ ký | Báo cáo chính thức/chữ ký số | Tiếp tục dùng phiên bản và snapshot hiện có; rà soát riêng trước thay đổi |

Phạm vi ưu tiên đề xuất: **đợt 1 → đợt 2 → đợt 3 → các hạng mục đợt 4 theo nhu cầu thực tế**. Mục tiêu đầu tiên là in đủ và đúng dữ liệu, xem trước được bố cục, rồi nâng cấp nội dung và bổ sung biểu mẫu.
