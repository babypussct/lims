# Bàn giao nâng cấp chức năng in LIMS

Bản phát hành **26.10.01-b06 — Nâng cấp xem trước và in hồ sơ LIMS**, ngày **01/10/2026**, **đã triển khai và xác minh production**. Baseline đối chiếu: `dc6e1e5e454d4ddd8609bea6da3abb99de8de358`. Hệ thống production: [nafiqpm6.vercel.app](https://nafiqpm6.vercel.app).

Phạm vi bàn giao gồm nền in chung, các đường in hiện có và biểu mẫu đọc dữ liệu hiện tại. Các biểu mẫu có chỗ ký/ghi thực tế hỗ trợ ghi nhận thủ công; không tự tạo trạng thái phê duyệt, tiếp nhận hoặc chữ ký mật mã. Xem [bản rà soát và kế hoạch](printing-audit-and-upgrade-plan.md) để đối chiếu yêu cầu ban đầu.

## Chức năng đã triển khai

| Màn hình | Cách sử dụng và kết quả |
| --- | --- |
| SOP Calculator / Hàng đợi | Mở xem trước rồi In/Tải PDF. Hàng đợi tải đủ phiếu, giữ thứ tự; lỗi dữ liệu chặn xuất thay vì in thiếu. Phiếu ngắn ghép đôi, phiếu vừa dùng cả trang, bảng dài tách theo dòng và lặp đầu phiếu/QR. Có mã mẻ và vùng thiết bị/lô/HSD thực dùng. |
| Smart Prep | `Xem & In phiếu` cho cả 5 chế độ tính và 4 cách tạo dãy chuẩn. Có metadata hồ sơ, lượng dự tính/thực tế, công thức, cảnh báo, vùng người thực hiện/kiểm tra và phân trang. Công thức vẫn in đủ khi đang thu gọn trên màn hình. |
| Lịch trực | Mở preview A4 ngang bằng nút in hoặc Ctrl/Cmd+P. Giữ phạm vi cá nhân/toàn bộ và tháng đang chọn, loại ca hủy, cảnh báo ca cần xác minh và vùng người lập/lãnh đạo ký tay. |
| Checklist | Chọn dạng tự động/danh sách/gọn, hướng giấy và thông tin mẫu, rồi `Xem trước`. Xem số trang đã đo, In hoặc Tải PDF. Có vùng người giao/nhận việc ký tay. |
| Standards | Preview chuyên dụng cho cuộn/A4, ô bắt đầu và số bản sao. Mã nội bộ hiện trên các mẫu nhãn. In chờ QR/ảnh sẵn sàng; vùng in được giữ đến khi hộp thoại kết thúc. |
| Labels | Tiếp tục dùng preview trực tiếp; in đủ nhãn ngoài phần preview giới hạn. Catalog giấy và kiểm tra giới hạn A4 dùng chung với Standards; iframe được dọn sau kết thúc/hủy/lỗi. |
| Inventory | `Thẻ kho` trên vật tư tải toàn bộ lịch sử theo trang và đối soát tồn. `Xem & In kiểm kê` dùng toàn bộ danh sách đang lọc, không chỉ 20 dòng đang hiển thị. `Nhãn sang chiết` tạo nhãn A4 tự cắt rộng 90 mm. |
| Requests | Nút in trên yêu cầu có danh sách mẫu tạo phiếu bàn giao: mã mẫu, nền mẫu/chỉ tiêu đang có, ô ghi bên giao/nhận, thời điểm, số lượng/tình trạng thực tế và ký tay. |
| SOP Calculator — thông tin SOP | `In thông tin SOP` xuất mã/phiên bản, thông số, công thức và vật tư trong cấu hình hiện tại. Phiếu ghi rõ cần tham khảo SOP đã ban hành để thực hiện các bước thao tác. |
| Traceability | Người dùng đăng nhập có thể `Xem & In hồ sơ` từ phần tóm tắt/timeline đã tải và được phép xem. Lịch sử còn thiếu được ghi rõ; đổi hồ sơ/đăng xuất/đổi quyền sẽ xóa preview. |
| Results / Documents | Viewer giữ đúng metadata phiên bản đang chọn và không để phản hồi tải cũ ghi đè file mới. Documents dùng nhãn `Mở để in` phản ánh việc mở tài liệu để in trong tab mới. |

## Thao tác và xử lý lỗi

1. Chọn đúng phạm vi trên màn hình nguồn trước khi mở preview. Preview dùng snapshot của phiên xem; nếu dữ liệu thay đổi, đóng và mở lại để cập nhật.
2. Đợi trạng thái **Bản in đã sẵn sàng**, xem các trang, dùng zoom hoặc **Vừa chiều rộng**. Nút In/Tải PDF bị khóa khi chưa sẵn sàng hoặc đang xử lý.
3. Khi in A4, chọn đúng hướng giấy theo preview, tỉ lệ **100%**, tắt header/footer của trình duyệt và kiểm tra lề/khổ theo trang đã tạo. Không dùng Fit to page để căn decal đã chia ô. Preview cuộn dùng kích thước giấy tương ứng trên driver máy in.
4. Nút **In** mở hộp thoại trình duyệt. **Tải PDF** của các phiếu HTML tạo PDF raster từng trang; native **Save as PDF** là một đường xuất khác của trình duyệt. PDF báo cáo chính thức tiếp tục dùng file đã phát hành.
5. Hủy/in xong sẽ khôi phục vùng in trước đó. Nếu nội dung/QR chưa tải được, dùng **Thử lại** hoặc đóng/mở lại; không tiếp tục với nhãn thiếu QR.

| Thông báo / tình huống | Xử lý |
| --- | --- |
| Phiếu hàng đợi thiếu/sai hoặc lượt đọc thất bại | Đối chiếu các mã phiếu trong thông báo, sửa/tải lại dữ liệu nguồn rồi mở preview lại. Không có bản in một phần tự động. |
| Một dòng/nhóm quá dài cho A4 | Rút gọn nội dung hoặc chọn bố cục khác. In/PDF bị chặn để tránh cắt mất nội dung. |
| Thẻ kho thiếu lịch sử, số liệu không nối khớp hoặc tồn cuối lệch | Đối soát lịch sử nhập/xuất/điều chỉnh với tồn hệ thống. Thẻ kho không tự sửa số liệu. |
| Kho vừa thay đổi khi tải thẻ | Thử lại sau khi thao tác kho hoàn tất. Ứng dụng đọc mặt hàng trước/sau lịch sử để phát hiện thay đổi đồng thời. |
| Lịch sử thẻ đạt giới hạn đọc 10.000 dòng | Lần xuất bị chặn rõ ràng. Cần bổ sung phạm vi ngày/đường xuất lớn riêng trước khi dùng cho mặt hàng này; không dùng feed 500 dòng làm thẻ đầy đủ. |
| Preset vượt khổ A4 | Chọn preset/giấy khác phù hợp hoặc hiệu chỉnh thông số ở công cụ có hỗ trợ. Không in cấu hình bị chặn. |

**Preset cần lưu ý:** cấu hình cũ Standards Tomy 138 có tổng chiều rộng 215 mm; cấu hình Labels Tomy 149 có chiều cao 297,5 mm. Hai cấu hình không vừa A4 và bị chặn. Hai bộ hiệu chỉnh Tomy 145 của Standards/Labels được giữ riêng vì khác kích thước/margin/gap; cần đo giấy thực tế trước khi hợp nhất. Nhãn nguồn GHS hiển thị mã và nội dung cảnh báo đang có, chưa phải thiết kế đầy đủ nhãn GHS với mọi biểu tượng.

## Kiểm tra đã hoàn thành trước push

`npm run release:verify` đạt, exit code 0: kiểm tra runtime, lint, toàn bộ `npm test`, UI zero-jump, typecheck ứng dụng/API và production build. Tổng các nhóm Node test là **1.170 test**, không có test thất bại; có kiểm tra Firestore rules và notification workflow trên emulator.

| Nhóm kiểm tra | Kết quả |
| --- | --- |
| UI contracts | 275 test đạt |
| Printing / Inventory / Smart Prep | 16 / 6 / 64 test đạt; đã nằm trong gate đầy đủ |
| Traceability | 24 test đạt, gồm xóa preview khi đổi quyền/đăng xuất |
| Documents / Results | 78 / 39 test đạt |
| UI guardrails | 14 test đạt và audit đạt; baseline overlay legacy giảm còn 32 |
| Browser smoke Edge headless | Component Angular biên dịch AOT, CSS/font thật; service dữ liệu giả lập, không gọi Firebase/Drive hoặc ghi dữ liệu production |
| SOP | 84 dòng trên 7 trang; phiếu dài 160 dòng; đủ thứ tự/nội dung, QR canvas trước in; xử lý PDF tải đua thứ tự và lỗi in |
| Smart Prep | 5 chế độ, 4 chiến lược dãy; 40 điểm/135 dòng/9 trang; giữ công thức/cảnh báo và metadata/đơn vị |
| Lịch / Checklist / Nhãn | Lịch toàn bộ 39 dòng/4 trang, cá nhân 20 dòng/2 trang; Checklist 24 phương pháp/48 mẫu, 4 bố cục; 6 nhãn QR từ ô 64 qua 2 tờ |
| Biểu mẫu mới | Kiểm kê 60 vật tư/6 trang; thẻ kho 60 sự kiện/4 trang; bàn giao 60 mẫu/3 trang; SOP 30 vật tư/2 trang; truy xuất 60 sự kiện/4 trang; nhãn sang chiết/1 trang |
| PDF / tương tác | Số trang native và tải PDF khớp fixture; đã render/xem bố cục các trang. Mobile 390×844, light/dark, Escape, cleanup, khóa xuất dòng quá dài đạt |
| Review | `git diff --check` đạt; script smoke qua `node --check` |

Cách tái hiện: [TESTING_GUIDE.md](../TESTING_GUIDE.md), [script browser smoke](../scripts/print-preview-smoke.js). PDF/PNG fixture là dữ liệu kiểm thử trong thư mục tạm, không phải báo cáo nghiệp vụ để sử dụng.

## Ranh giới và nghiệm thu vận hành

- Thẻ kho hiện dùng toàn bộ lịch sử có đối soát; chưa có bộ lọc khoảng ngày. Lịch sử thiếu/bị xóa/không đủ số liệu sẽ chặn xuất. Khoảng thời gian được ghi theo các sự kiện đã đọc; không tuyên bố dữ liệu ngoài khoảng đó.
- Kiểm kê, nhãn sang chiết và bàn giao là biểu mẫu ghi tay dựa trên dữ liệu có sẵn. Chưa lưu biên nhận, tồn thực tế, dung dịch/lọ sang chiết hoặc phê duyệt mới lên hệ thống. Nồng độ/HSD/người chiết và thông tin giao nhận cần được ghi theo quy trình của đơn vị.
- SOP hiện chỉ có cấu hình tính/vật tư; muốn Quick Guide đầy đủ các bước thao tác cần bổ sung nội dung SOP có kiểm soát và quy trình phiên bản.
- Hồ sơ truy xuất phản ánh phần thông tin đã tải, bao gồm cảnh báo còn lịch sử/chưa được cấp quyền. Không khẳng định đã tổng hợp toàn bộ máy/lô/kết quả/phê duyệt khi các dữ liệu đó không có trong nguồn hiện tại.
- Lý do sửa đổi báo cáo, trạng thái thay thế/hủy hiệu lực và chữ ký mật mã cần chính sách phát hành, template/backend tương ứng cùng nhà cung cấp chữ ký. Vùng ký tay/tên người duyệt không phải chứng thư số; bản phát hành không tuyên bố chứng nhận ISO 17025/GLP.
- Chưa kiểm tra phiên đăng nhập/dữ liệu thực hoặc OAuth/PDF thực trên Drive do môi trường này không có credential kiểm thử cục bộ được hướng dẫn. Chưa in trên máy vật lý. Đơn vị cần nghiệm thu driver, kích thước/ô bắt đầu decal, quét QR, in/hủy/in lại và một báo cáo thực qua Drive.

## Phát hành và khôi phục

Release dùng **Git Integration + Deployment Check** theo [DEPLOYMENT.md](../DEPLOYMENT.md): prepare → verify → commit → prepush → push `main` → chờ CI và deployment check cho đúng SHA → xác nhận Vercel READY/alias production → kiểm tra runtime. Không có thay đổi schema, rules/index Firestore, API hoặc Apps Script cần phát hành riêng.

Đã xác minh bản phát hành từ commit **`8301901ec55368876c0f87381b014f9d56ed5514`**. Commit cập nhật tài liệu bàn giao sau đó chỉ bổ sung bằng chứng, không thay đổi ứng dụng hoặc tăng phiên bản.

| Bằng chứng phát hành | Kết quả |
| --- | --- |
| [Commit nguồn](https://github.com/babypussct/lims/commit/8301901ec55368876c0f87381b014f9d56ed5514) | Đã push `main`; prepush và release gate đạt; release discipline xác minh trực tiếp từ baseline, 46 file production có metadata hợp lệ |
| [GitHub Release Gate #36906750907](https://github.com/babypussct/lims/actions/runs/36906750907) | `completed / success` cho đúng SHA release |
| Vercel — `release-verify` | `success`, liên kết đúng job verify của SHA release |
| [Vercel deployment](https://vercel.com/babypusscts-projects/nafiqpm6/6QimGfHqwxqmb7S8tAMEDWmJpUpZ) | `success / Deployment has completed`; GitHub deployment `6792111419`, environment `Production`, đúng SHA release |
| [URL deployment](https://nafiqpm6-nptur7tnt-babypusscts-projects.vercel.app) / [alias production](https://nafiqpm6.vercel.app) | Deployment hoàn tất; alias phục vụ `v26.10.01-b06` |
| HTTP production | `/`, `/ngsw.json`, `/release-history.json`, `/changelog`, `/index.html`, CSS và main JS trả 200. Manifest/history cùng version/title release |
| Service worker | SHA-1 của `/index.html`, `/styles-VVZUUU5K.css` và `/main-YX2JP4FI.js` khớp `hashTable` của manifest production |
| Trình duyệt production | Trang đăng nhập, modal cập nhật và [nhật ký tại `/#/changelog`](https://nafiqpm6.vercel.app/#/changelog) hiển thị version/title `b06`; desktop/mobile 390×844 đạt; không có `pageerror` |

Thời điểm kiểm tra runtime: **2026-10-01T13:15:50.410Z**. Kiểm tra public runtime là đọc dữ liệu; không đăng nhập, ghi kho, tạo mẫu hoặc phát hành báo cáo. Ứng dụng dùng hash routing (`/#/…`); `/changelog` trực tiếp chỉ trả app shell, nên kiểm tra UI phải dùng `/#/changelog`.

Nếu cần khôi phục, chọn deployment production đã xác minh của `26.10.01-b05` trong Vercel để chuyển alias theo quy trình vận hành; đồng thời chuẩn bị bản sửa/revert có release metadata mới qua gate. Không force-push `main` hoặc ghi đè dữ liệu kho. Vì lần nâng cấp này chỉ bổ sung renderer/thao tác đọc, không có migration dữ liệu để đảo ngược.
