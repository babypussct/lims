# Kế hoạch review bằng code — Luồng xem file Phiếu giao nhận mẫu trên Mobile/PWA

> Phạm vi tài liệu này là **static/code review**. Không kiểm thử trên thiết bị thật, không cài PWA thực tế, không đo FPS/memory, không xác nhận gesture bằng tay và không dùng runtime browser để nghiệm thu UX.
>
> Mục tiêu là đọc implementation hiện tại, xác định đầy đủ luồng xem file, các nhánh responsive/PWA, khả năng viewer theo loại file, lỗi tiềm ẩn và khoảng trống test tự động; sau đó lập danh sách phát hiện theo mức P0/P1/P2 để triển khai sửa hoặc bổ sung test.

## 1. Mục tiêu

- [ ] Review toàn bộ luồng `Phiếu giao nhận mẫu` từ duyệt thư mục đến mở/đóng file.
- [ ] Xác nhận logic mobile/responsive từ template, CSS và TypeScript.
- [ ] Xác nhận hành vi PWA có thể suy ra từ Service Worker, network gating và code viewer.
- [ ] Review đầy đủ các loại file được preview: PDF, Excel/CSV/Google Sheet, ảnh, video, audio, text và fallback Google Drive.
- [ ] Review các chức năng trong PDF viewer và Excel viewer.
- [ ] Review loading/error/offline/race-condition/lifecycle cleanup.
- [ ] Xác nhận các giới hạn kỹ thuật của viewer, đặc biệt Excel lớn.
- [ ] Đánh giá coverage test hiện tại và chỉ ra test tự động còn thiếu.
- [ ] Không đưa ra kết luận vượt quá những gì code chứng minh được.

## 2. Ngoài phạm vi

Không thực hiện các hạng mục sau:

- [ ] Test iPhone/Android thật.
- [ ] Add to Home Screen / cài PWA thực tế.
- [ ] Kiểm tra notch, Dynamic Island hoặc home indicator trên thiết bị thật.
- [ ] Test swipe, long-press, pinch, scroll bằng tay.
- [ ] Test Android Back/System gesture thực tế.
- [ ] Test bàn phím ảo thực tế.
- [ ] Xoay portrait/landscape trên thiết bị thật.
- [ ] Chuyển Wi-Fi/4G thực tế.
- [ ] Background/resume/lock-screen PWA thực tế.
- [ ] Đo memory, FPS hoặc profiling hiệu năng trên điện thoại.
- [ ] Kiểm thử WebView/browser version thật.
- [ ] Xác minh browser popup/download/print/fullscreen bằng runtime.

Các vấn đề thuộc nhóm trên chỉ được đánh giá ở mức **logic/code có chuẩn bị để xử lý hay không**. Nếu code không đủ để kết luận, ghi rõ `Không thể xác minh bằng static review`.

## 3. Kết luận nền tảng cần giữ khi review

### 3.1 PWA không đồng nghĩa với xem tài liệu offline

Implementation hiện tại có các đặc điểm:

- `ngsw-config.json` cache app shell, feature chunks, asset và PDF.js worker.
- Không có `dataGroups` cache Google Drive API/file content.
- `DocumentsComponent` lưu trạng thái mạng bằng `navigator.onLine`.
- `loadFolder()` dừng ngay khi offline.
- `onItemClick()` không mở file khi offline.
- `downloadItem()` cũng dừng khi offline.

Do đó tiêu chí review phải là:

> PWA có thể cache phần ứng dụng, nhưng nội dung tài liệu Google Drive hiện vẫn yêu cầu online. Không đặt yêu cầu “PDF/Excel phải xem được offline”.

### 3.2 Excel viewer có giới hạn preview chủ động

Trong `excel-document-viewer.component.ts`:

- `maxColumns = 200`.
- `maxCells = 500_000`.
- `rowLimit = min(50_000, floor(maxCells / số cột đang hiển thị))`.

Khi dữ liệu bị cắt, viewer có trạng thái/cảnh báo `Giới hạn xem`.

Review phải coi đây là behavior hợp lệ nếu:

- dữ liệu trong giới hạn vẫn render;
- code xác định đúng việc bị truncate;
- cảnh báo được hiển thị;
- không có nhánh làm người dùng hiểu nhầm rằng toàn bộ workbook đã được tải.

### 3.3 PDF text layer là enhancement

PDF viewer dùng canvas làm lớp hiển thị chính. Text layer/selectable text có thể thất bại trên môi trường cũ mà vẫn không được làm hỏng khả năng đọc PDF.

Acceptance khi review:

- canvas render là đường chính;
- lỗi text layer không được làm fail toàn viewer;
- search/select text chỉ được kết luận là khả dụng nếu code đã có đường xử lý tương ứng.

## 4. File bắt buộc phải review

### 4.1 Luồng Documents

- `src/app/features/documents/documents.component.ts`
- `src/app/core/services/google-drive.service.ts`

### 4.2 Preview chung

- `src/app/features/documents/document-preview-modal.component.ts`

### 4.3 Viewer riêng

- `src/app/features/documents/pdf-document-viewer.component.ts`
- `src/app/features/documents/excel-document-viewer.component.ts`

### 4.4 PWA / Service Worker

- `ngsw-config.json`
- `angular.json`
- các utility/service liên quan Service Worker được tham chiếu từ app.

### 4.5 Test hiện tại

- `src/app/features/documents/documents-ui-primitives.contract.test.ts`
- `src/app/core/services/google-drive.service.test.ts`
- `package.json`

Khi review phát hiện helper/service khác được gọi trực tiếp từ các file trên, bổ sung helper đó vào phạm vi nhưng không mở rộng sang module không liên quan.

## 5. Chuẩn phân loại phát hiện

| Mức | Ý nghĩa | Ví dụ |
| --- | --- | --- |
| P0 | Có thể làm mất khả năng mở/xem file hoặc phá luồng chính | File không mở, preview blank, lỗi loại file, loading vô hạn, crash viewer |
| P1 | Chức năng hoạt động nhưng mobile/PWA/responsive hoặc lifecycle có rủi ro lớn | toolbar overflow, cleanup thiếu, stale state, fallback không rõ |
| P2 | Robustness, maintainability, accessibility hoặc coverage | thiếu aria, test chưa khóa behavior, code lặp, warning chưa đủ rõ |
| OK | Implementation đã có xử lý hợp lý và có thể chứng minh bằng code | `stopPropagation()` download, safe-area CSS, abort request |
| Không thể xác minh bằng code | Cần runtime/thực tế mới kết luận được | cảm giác gesture, browser print UX, iOS fullscreen behavior |

## 6. Cấu trúc đầu ra review

Mỗi phát hiện phải có đủ:

```md
### [P1] Tiêu đề ngắn

- Khu vực: PDF / Excel / Documents / Preview / PWA / Test
- File: `path/to/file.ts`
- Evidence: mô tả điều kiện/code liên quan
- Rủi ro: tác động đến người dùng/luồng
- Đề xuất: hướng sửa cụ thể
- Test nên bổ sung: unit/contract/browser-level nếu phù hợp
- Trạng thái: Open / Fixed / Accepted
```

Không ghi issue chỉ dựa trên phỏng đoán. Nếu thiếu evidence, ghi vào mục `Cần xác minh thêm`, không xếp P0/P1/P2.

## 7. Thứ tự triển khai review

Thực hiện theo thứ tự dưới đây để tránh đọc viewer rời rạc mà chưa hiểu luồng gọi.

1. `documents.component.ts` — xác định entry point và state.
2. `document-preview-modal.component.ts` — xác định phân loại file và lifecycle preview.
3. `pdf-document-viewer.component.ts` — review PDF.
4. `excel-document-viewer.component.ts` — review Excel.
5. `google-drive.service.ts` — xác định request/export/download/cache.
6. `ngsw-config.json` + Service Worker utility — xác định PWA/offline.
7. Test files + `package.json` — lập coverage gap.
8. Tổng hợp P0/P1/P2/OK.

---

# PHẦN A — REVIEW LUỒNG DOCUMENTS

## 8. Root và điều hướng thư mục

### DOC-001 — Root Phiếu giao nhận mẫu

- [ ] Xác nhận `ROOT_FOLDER_NAME = 'Phiếu giao nhận mẫu'`.
- [ ] Xác nhận root folder ID được dùng nhất quán cho initial state.
- [ ] Xác nhận `folderStack` khởi tạo đúng root.
- [ ] Xác nhận restore navigation state không thể tạo stack rỗng/sai root.
- [ ] Xác nhận destroy/reset không làm state lệch khi component được mở lại.

### DOC-002 — Click folder

Review `onItemClick()`:

- [ ] Folder được phân biệt bằng MIME type đúng.
- [ ] Khi click folder, stack được append trước khi gọi `loadFolder()`.
- [ ] Navigation state được save đúng thời điểm.
- [ ] Nếu `loadFolder()` fail, review xem stack có thể hiển thị current folder nhưng data vẫn folder cũ hay không.
- [ ] Xác nhận race handling khi click folder nhanh liên tục.

### DOC-003 — Breadcrumb

- [ ] `goToBreadcrumb()` cắt stack đúng index.
- [ ] Không cho click current breadcrumb tạo request thừa.
- [ ] Logic collapsed breadcrumb giữ đúng `originalIndex`.
- [ ] Tên folder dài có truncate/max-width hợp lý trong template.
- [ ] Không có key tracking gây reuse sai item.

## 9. Loading, cache, error và race condition

### DOC-010 — Folder request lifecycle

Review `loadFolder()`:

- [ ] Có request ID/version để response cũ không ghi đè response mới.
- [ ] Có `AbortController` và abort request cũ khi phù hợp.
- [ ] `loading` được reset trong mọi nhánh success/error/finally.
- [ ] `folderError` được reset đúng khi bắt đầu request mới.
- [ ] Request lỗi không xóa dữ liệu cache đang hiển thị nếu UX chủ đích giữ dữ liệu gần nhất.
- [ ] Không có nhánh throw làm bỏ qua cleanup.

### DOC-011 — Cache folder

Review `GoogleDriveService.getCachedFolder()` và caller:

- [ ] Cache key theo folder ID.
- [ ] Cache không bị dùng nhầm giữa folder.
- [ ] Xác định cache chỉ là memory/session hay persistent.
- [ ] Không suy diễn cache này thành offline document support.
- [ ] Force refresh có clear đúng folder cache.

### DOC-012 — Offline state

- [ ] `navigator.onLine` được khởi tạo đúng.
- [ ] Có listener `online`/`offline`.
- [ ] Listener được remove khi destroy.
- [ ] Khi offline, UI hiển thị empty state rõ ràng.
- [ ] `loadFolder()` không phát request mới.
- [ ] `onItemClick()` không mở preview.
- [ ] `downloadItem()` không mở link download.
- [ ] Review xem các nhánh `return` im lặng khi offline có cần toast/message bổ sung hay trạng thái toàn màn hình đã đủ.
- [ ] Khi online trở lại, xác định code có trigger load/refresh tự động hay chỉ cập nhật trạng thái.

## 10. Search, sort, view mode và state

### DOC-020 — Search

- [ ] Search input dùng signal riêng với `searchTerm`.
- [ ] Debounce hiện tại được áp dụng đúng.
- [ ] Normalization loại dấu tiếng Việt hoạt động trước so sánh.
- [ ] Search không đổi folder ID hoặc navigation stack.
- [ ] `clearSearch()` reset cả input signal và term.
- [ ] Không có stale term khi chuyển folder.

### DOC-021 — Sort

- [ ] Sort column whitelist hợp lệ.
- [ ] Sort direction chỉ `asc`/`desc`.
- [ ] Preference đọc từ storage có fallback an toàn.
- [ ] Sort folder/file có đúng behavior nghiệp vụ hiện tại.
- [ ] Sort không mutate source array ngoài ý muốn.

### DOC-022 — List/Grid mobile path

- [ ] Mobile list row có `(click)="onItemClick(item)"`.
- [ ] Grid card có `(click)="onItemClick(item)"`.
- [ ] Nút download trong row/card có `stopPropagation()` qua `downloadItem()`.
- [ ] Review các action khác bên trong clickable parent có stop propagation khi cần.
- [ ] Review responsive class làm ẩn/hiện control List/Grid/density.
- [ ] Nếu preference desktop tồn tại khi vào mobile, xác định layout vẫn có đường hiển thị hợp lệ.

### DOC-023 — Scroll state

- [ ] Scroll position key có phân biệt folder.
- [ ] Save/restore scroll không dùng offset của folder khác.
- [ ] Với AG Grid desktop, restore dùng đúng row height/index.
- [ ] Với mobile list/grid, restore dùng đúng scroll container.
- [ ] Đóng preview không vô tình reset danh sách.

---

# PHẦN B — REVIEW PREVIEW MODAL

## 11. Boundary và lifecycle

### PREVIEW-001 — Fullscreen modal boundary

- [ ] Overlay dùng `fixed inset-0` và z-index đủ cao.
- [ ] Dialog dùng `w-full h-full min-h-0` để viewer con có thể flex/scroll.
- [ ] Có `role="dialog"`, `aria-modal="true"`, `aria-labelledby`.
- [ ] Không dùng shared modal shell nếu viewer cần boundary fullscreen riêng.
- [ ] Click/mousedown trong dialog không bubble làm đóng ngoài ý muốn.

### PREVIEW-002 — Focus và keyboard

- [ ] Lưu element đang focus trước khi mở.
- [ ] Focus được chuyển vào dialog/nút đóng.
- [ ] Tab trap có cả chiều thuận và Shift+Tab.
- [ ] Escape xử lý đúng thứ tự:
  - Excel sub-mode có quyền consume Escape trước.
  - mobile action menu đóng trước.
  - fullscreen thoát trước.
  - cuối cùng mới đóng preview.
- [ ] Khi destroy/close, focus được restore an toàn.

### PREVIEW-003 — Cleanup

- [ ] Abort request preview đang tải khi item thay đổi/destroy.
- [ ] Object URL được revoke nếu component tạo URL.
- [ ] Event listener fullscreen được Angular cleanup qua HostListener.
- [ ] Blob/text/safe URL cũ được reset trước load file mới.
- [ ] Không giữ reference viewer cũ sau đóng modal.

## 12. Responsive header và action menu

### PREVIEW-010 — Desktop/mobile action split

- [ ] `sm` trở lên hiển thị action group desktop.
- [ ] dưới `sm` hiển thị download + menu `...` + close.
- [ ] Mobile menu có Print PDF chỉ khi kind là PDF.
- [ ] Mobile menu luôn có Open Drive/Fullscreen.
- [ ] Download vẫn là action trực tiếp trên mobile.
- [ ] Nút close luôn nằm ngoài menu và luôn truy cập được.

### PREVIEW-011 — Safe area

- [ ] Overlay/dialog có padding dùng `env(safe-area-inset-top)` và `env(safe-area-inset-bottom)` khi cần.
- [ ] Không có padding cố định làm mất vùng usable trên desktop.
- [ ] Excel bottom controls có safe-area riêng.
- [ ] Ghi `Không thể xác minh bằng static review` cho việc notch/home indicator thực tế có che UI hay không.

### PREVIEW-012 — Overflow

- [ ] Header dùng `min-w-0` cho vùng tên file.
- [ ] Tên file `truncate`.
- [ ] Metadata có `overflow-hidden`/responsive hiding.
- [ ] Action group `shrink-0`.
- [ ] Main content `flex-1 min-h-0`.
- [ ] Không có element con đặt width cứng lớn hơn viewport mà không scroll/clip.

## 13. Phân loại file

Review `detectKind()` theo thứ tự điều kiện, vì thứ tự có ảnh hưởng trực tiếp.

### PREVIEW-020 — PDF

- [ ] `.pdf` và MIME `application/pdf` → `pdf`.

### PREVIEW-021 — Excel/CSV/Google Sheet

- [ ] `.xlsx`, `.xls`, `.xlsm`, `.csv` → `excel`.
- [ ] Google Sheets MIME → `excel`.
- [ ] MIME chứa `spreadsheet`/`excel` → `excel`.
- [ ] `text/csv` → `excel`.
- [ ] Lưu ý CSV được match ở Excel trước nhánh text; ghi rõ đây là behavior chủ đích.

### PREVIEW-022 — Media/text

- [ ] `image/*` và extension ảnh → `image`.
- [ ] `video/*` → `video`.
- [ ] `audio/*` → `audio`.
- [ ] `text/*` và TXT/LOG/MD/JSON/XML → `text`.

### PREVIEW-023 — Drive fallback

- [ ] Các loại còn lại → `drive`.
- [ ] Google Docs/Slides và file Office không được hỗ trợ native có URL fallback hợp lệ.
- [ ] Fallback không cố tải blob nếu chỉ cần iframe Drive preview.
- [ ] Có đường `Open Google Drive` nếu iframe/fallback không hiển thị được.

## 14. Load/download/open/print/fullscreen

### PREVIEW-030 — Load preview blob

- [ ] Google-native file dùng export API đúng MIME mục tiêu.
- [ ] File thường dùng download API đúng ID.
- [ ] AbortSignal được truyền xuống service nếu service hỗ trợ.
- [ ] Success set blob trước khi viewer con render.
- [ ] Text kind gọi `blob.text()` và xử lý error.
- [ ] Error cuối cùng hiển thị message, không để loading vô hạn.

### PREVIEW-031 — Download original

- [ ] Nếu đã có blob, download blob hiện tại.
- [ ] Tên export Google Sheet được thêm `.xlsx` khi cần.
- [ ] Object URL download được revoke sau sử dụng.
- [ ] Không dùng blob của file trước.

### PREVIEW-032 — Open Drive

- [ ] URL lấy từ `webViewLink` nếu có.
- [ ] Có fallback URL dựa trên file ID.
- [ ] Action đóng mobile menu sau khi trigger.
- [ ] Browser/PWA có thật sự mở đúng tab/app: `Không thể xác minh bằng static review`.

### PREVIEW-033 — Print PDF

- [ ] Chỉ xuất hiện cho PDF.
- [ ] Disabled khi loading/error ở desktop path.
- [ ] Mobile menu path cũng cần review điều kiện disabled/error tương đương.
- [ ] Print dùng đúng blob/file hiện tại.
- [ ] Print dialog thực tế: `Không thể xác minh bằng static review`.

### PREVIEW-034 — Fullscreen

- [ ] Kiểm tra `document.fullscreenElement` trước request/exit.
- [ ] Có catch cho browser/managed environment chặn fullscreen.
- [ ] `fullscreenchange` đồng bộ signal.
- [ ] Menu mobile đóng sau thao tác.
- [ ] iOS/PWA support thực tế: `Không thể xác minh bằng static review`.

---

# PHẦN C — REVIEW PDF VIEWER

## 15. Khởi tạo PDF.js

### PDF-001 — Worker và compatibility

- [ ] Dùng `pdfjs-dist/legacy` phù hợp mục tiêu compatibility hiện tại.
- [ ] Worker trỏ tới asset bundled trong app.
- [ ] `ngsw-config.json` prefetch PDF worker.
- [ ] Polyfill/compatibility guard cho `Promise.withResolvers`.
- [ ] Review các polyfill Map/WeakMap `getOrInsert`/`getOrInsertComputed` nếu có.
- [ ] Polyfill không overwrite implementation native nếu đã tồn tại.

### PDF-002 — Load token/race

- [ ] Mỗi lần load tăng token/version.
- [ ] Async response cũ không ghi đè document mới.
- [ ] Document/render task cũ được cancel/destroy khi reload/destroy.
- [ ] Error load reset loading state.

## 16. Render và lazy loading

### PDF-010 — Canvas page render

- [ ] Mỗi page có descriptor width/height.
- [ ] Canvas size dựa trên zoom + rotation.
- [ ] Render task được track để cancel/reuse.
- [ ] Không render lại page nếu signature không đổi.
- [ ] Khi zoom/rotate thay đổi, signature cũ bị invalid đúng.

### PDF-011 — IntersectionObserver

- [ ] Observer chỉ tạo khi API tồn tại.
- [ ] Observe page shells đúng lifecycle.
- [ ] Render các page gần viewport thay vì toàn bộ document.
- [ ] Observer disconnect khi destroy/reload.
- [ ] Nếu `IntersectionObserver` không tồn tại, review fallback có render trang cần thiết hay không.

### PDF-012 — Scroll tracking

- [ ] Current page cập nhật từ scroll/visibility hợp lý.
- [ ] Programmatic `goToPage()` scroll đúng shell.
- [ ] Không tạo loop scroll → set page → scroll lại.

## 17. Toolbar PDF

### PDF-020 — Page navigation

- [ ] Previous không xuống dưới trang 1.
- [ ] Next không vượt `pageCount`.
- [ ] Input page clamp giá trị hợp lệ.
- [ ] Enter/change dùng cùng logic.

### PDF-021 — Zoom

- [ ] Zoom có min/max rõ ràng.
- [ ] Label phần trăm khớp signal zoom.
- [ ] Custom zoom chuyển `fitMode` phù hợp.
- [ ] Không để NaN/Infinity từ input/calculation.

### PDF-022 — Fit width/page

- [ ] Fit width dùng available viewport width.
- [ ] Mobile padding nhỏ hơn desktop nếu code có breakpoint.
- [ ] Fit page xét cả width và height.
- [ ] Rotation được tính trước khi fit.
- [ ] Scale clamp trong khoảng hợp lệ.

### PDF-023 — Rotate

- [ ] Rotation tăng 90° và modulo 360.
- [ ] Layout được refresh sau rotate.
- [ ] Width/height đổi đúng cho 90/270°.

## 18. Search và text layer

### PDF-030 — Search

- [ ] `Ctrl/Cmd+F` mở search và prevent browser find khi viewer active.
- [ ] Empty query clear kết quả/highlight.
- [ ] Search normalize text/query nhất quán.
- [ ] Kết quả track page/item đủ để next/previous.
- [ ] `activeMatchIndex` clamp/wrap đúng.
- [ ] Scroll tới match đúng page.

### PDF-031 — Highlight

- [ ] Search match và active match dùng class riêng.
- [ ] Reapply highlight sau text layer render muộn.
- [ ] Clear old highlight khi query thay đổi.

### PDF-032 — Selectable text fallback

- [ ] Text layer render lỗi không throw lên làm fail canvas viewer.
- [ ] `hasSelectableText` chỉ true sau khi thực sự có text layer usable.
- [ ] Footer hiển thị `Chỉ đọc` khi không có selectable text.
- [ ] Search trên PDF scan không gây loading vô hạn/crash.

## 19. Touch/swipe logic — chỉ review code

### PDF-040 — Swipe handler

- [ ] Touch start/end lưu đúng coordinate.
- [ ] Có minimum horizontal delta trước khi chuyển trang.
- [ ] Có điều kiện phân biệt horizontal với vertical movement nếu implementation có.
- [ ] Không xử lý swipe khi target là input/control cần tương tác.
- [ ] Không kết luận “gesture mượt” hoặc “không conflict” bằng static review.

## 20. PDF cleanup

- [ ] Cancel render task đang chạy.
- [ ] Destroy PDF document khi component destroy/file đổi.
- [ ] Disconnect `IntersectionObserver`.
- [ ] Clear timer resize/search nếu có.
- [ ] Clear map text layers/render signatures.
- [ ] Không giữ canvas/blob reference cũ ngoài vòng đời cần thiết.

---

# PHẦN D — REVIEW EXCEL/CSV VIEWER

## 21. Parse và workbook lifecycle

### XLS-001 — Load workbook

- [ ] Blob được parse đúng thư viện hiện tại.
- [ ] Error parse kết thúc loading và hiện message.
- [ ] Workbook cũ được reset khi blob mới đến.
- [ ] Sheet đầu tiên được chọn có fallback nếu workbook không có sheet hợp lệ.

### XLS-002 — Sheet state

- [ ] Chuyển sheet reset state chỉ ở mức cần thiết.
- [ ] Search/selection/filter không giữ reference sai sheet.
- [ ] Sheet hidden/visible được xử lý đúng theo thiết kế.
- [ ] Sheet tab current state rõ ràng trong template.

## 22. Giới hạn dữ liệu

### XLS-010 — Cột

- [ ] Lấy danh sách cột visible trước khi slice.
- [ ] Slice tối đa 200 cột.
- [ ] Trạng thái truncate bật khi source visible columns > displayed columns.

### XLS-011 — Cell/row limit

- [ ] `maxCells = 500_000`.
- [ ] `rowLimit` không vượt 50.000.
- [ ] `rowLimit` giảm theo số cột hiển thị.
- [ ] Không chia cho 0 nếu sheet không có visible column.
- [ ] Hidden rows không bị tính sai theo logic preview chủ đích.

### XLS-012 — Warning

- [ ] `Giới hạn xem` chỉ hiện khi thực sự truncate.
- [ ] Warning không biến mất khi đổi state không liên quan.
- [ ] Nội dung warning đủ để người dùng biết đây là giới hạn preview, không phải mất dữ liệu gốc.

## 23. AG Grid behavior

### XLS-020 — Column definitions

- [ ] Header/value mapping giữ đúng index Excel.
- [ ] Dữ liệu row không lệch cột khi có hidden column.
- [ ] Cell formatter không làm mất kiểu dữ liệu quan trọng.
- [ ] Width mặc định không tạo giá trị âm/0.

### XLS-021 — Selection

- [ ] Cell/range selection state được lưu nhất quán.
- [ ] Row/column selection không ghi đè selection khác ngoài ý muốn.
- [ ] Escape clear/thoát mode theo thứ tự rõ ràng.
- [ ] Copy dùng selection hiện tại, không stale selection.

### XLS-022 — Copy

- [ ] TSV/plain text generation giữ tab/newline đúng.
- [ ] Empty cell xử lý ổn định.
- [ ] Clipboard API failure có fallback hoặc error handling phù hợp.
- [ ] Không đưa công thức/nội dung ẩn vào clipboard ngoài ý muốn.

### XLS-023 — Search

- [ ] `Ctrl/Cmd+F` mở search nội bộ.
- [ ] Search normalize/stringify cell value nhất quán.
- [ ] Next/previous result wrap/clamp đúng.
- [ ] Chuyển sheet khi match ở sheet khác chỉ xảy ra nếu feature thực sự hỗ trợ workbook-level search.

### XLS-024 — Sort/filter

- [ ] Sort/filter được cấu hình ở đúng grid API.
- [ ] Không mutate workbook source ngoài viewer state.
- [ ] Clear filter/sort trả đúng dataset hiển thị.
- [ ] Search result không tham chiếu row index cũ sau sort/filter nếu code có phụ thuộc index.

### XLS-025 — Auto-fit

- [ ] Auto-fit chỉ chạy khi grid API đã ready.
- [ ] Không auto-size toàn bộ 200 cột liên tục trong effect/resize loop.
- [ ] Có min/max width nếu cần tránh cột quá rộng.

## 24. Mobile/responsive logic Excel

### XLS-030 — Grid focus mode

- [ ] Có signal `gridFocusMode`.
- [ ] Small viewport có đường tự bật mode nếu implementation chủ đích.
- [ ] Khi bật, toolbar/phần phụ được ẩn đúng.
- [ ] Có UI/keyboard path để thoát mode.
- [ ] Escape được preview modal nhường cho Excel xử lý trước.

### XLS-031 — Sheet tabs

- [ ] Tab strip có horizontal overflow/scroll.
- [ ] CSS `touch-action` không chặn hoàn toàn pan ngang.
- [ ] Button sheet dùng `touch-action: manipulation` hoặc tương đương nếu có.
- [ ] Bottom area có `safe-area-inset-bottom`.
- [ ] Không kết luận accessibility touch thực tế chỉ từ CSS.

### XLS-032 — Nested scrolling

- [ ] Viewer root dùng `min-h-0`/flex đúng để AG Grid có height hữu hạn.
- [ ] Horizontal scroll nằm trong grid/tab strip, không đẩy toàn modal rộng hơn viewport.
- [ ] Không có fixed width gây body-level horizontal overflow rõ ràng từ CSS.

## 25. Excel cleanup

- [ ] Grid event subscription được cleanup.
- [ ] Timer/debounce được clear.
- [ ] Workbook/large arrays không được giữ sau destroy nếu không cần.
- [ ] Resize listener/observer được cleanup.
- [ ] State search/selection reset khi blob mới.

---

# PHẦN E — REVIEW FILE KHÁC VÀ FALLBACK

## 26. Image

- [ ] Blob URL/safe URL được tạo đúng.
- [ ] Image dùng containment (`max-width`, `max-height`, `object-contain`) phù hợp.
- [ ] Error image không làm modal blank vô hạn.
- [ ] URL được revoke khi không dùng.

## 27. Text

- [ ] Blob được đọc bằng `text()`.
- [ ] UI dùng `whitespace-pre-wrap`/`break-words` hoặc strategy phù hợp.
- [ ] Text lớn không được nhầm là Excel nếu MIME/extension rơi vào CSV.
- [ ] Encoding ngoài UTF-8: nếu không có xử lý thì ghi `Known limitation`, không giả định tự hỗ trợ.

## 28. Video/Audio

- [ ] Source lấy từ blob/object URL đúng.
- [ ] Native controls được bật nếu dựa vào browser controls.
- [ ] URL cleanup đúng.
- [ ] Background playback/fullscreen media thực tế: `Không thể xác minh bằng static review`.

## 29. Google Drive iframe fallback

- [ ] Google Workspace dùng `webViewLink`/Drive preview URL hợp lệ.
- [ ] File thường fallback `/file/d/{id}/preview`.
- [ ] URL được sanitize đúng vị trí.
- [ ] Không sanitize input tùy ý ngoài domain/path dự kiến nếu có cách siết chặt hơn.
- [ ] Xác định iframe có sandbox/referrer policy hay không và ghi nhận nếu cần hardening.
- [ ] Cross-origin preview thực tế có hiển thị: `Không thể xác minh bằng static review`.

---

# PHẦN F — REVIEW GOOGLE DRIVE SERVICE

## 30. List folder

- [ ] Request list xử lý pagination nếu API trả `nextPageToken`.
- [ ] Fields request đủ cho viewer: id, name, mimeType, size, modifiedTime, thumbnail/web links.
- [ ] Encode folder ID/query đúng.
- [ ] AbortSignal truyền qua fetch/client.
- [ ] Error 401/403/404 không bị nuốt thành empty folder.

## 31. Download/export

- [ ] File thường dùng download endpoint đúng.
- [ ] Google-native file dùng export endpoint đúng MIME.
- [ ] Google Sheet export `.xlsx` khớp viewer Excel.
- [ ] HTTP non-2xx được throw với message hữu ích.
- [ ] Abort không bị report như lỗi server nếu caller đóng modal.

## 32. Cache

- [ ] Cache folder có TTL/invalidation rõ ràng nếu implementation có.
- [ ] `clearCache(folderId)` không clear quá rộng ngoài ý muốn.
- [ ] Cache không chứa blob document lớn lâu dài nếu không cần.

---

# PHẦN G — REVIEW PWA/SERVICE WORKER

## 33. Service Worker asset coverage

Review `ngsw-config.json`:

- [ ] `main-*.js`, `styles-*.css`, manifest/favicon thuộc app shell.
- [ ] `chunk-*.js`, `worker-*.js` thuộc feature chunks.
- [ ] `/assets/pdfjs/pdf.worker.min.mjs` được prefetch.
- [ ] Asset image/font có strategy phù hợp.
- [ ] Không có `dataGroups` cho Google Drive content.

Kết luận phải ghi rõ:

> Service Worker hiện cache code/assets của ứng dụng, không cache tài liệu Drive để xem offline.

## 34. Online/offline behavior

- [ ] App có listener network.
- [ ] Offline state ở Documents rõ ràng.
- [ ] Không có request preview mới khi offline.
- [ ] Reconnect path được đọc và mô tả chính xác: tự load lại hay cần refresh.
- [ ] Không khẳng định behavior khi OS báo `navigator.onLine=true` nhưng Internet thực tế mất nếu không có probe riêng.

## 35. Update/recovery

Nếu app có utility xử lý Service Worker update:

- [ ] Review `VERSION_READY`/update available path.
- [ ] Review reload/recovery guard tránh loop.
- [ ] Review stale chunk/load error recovery.
- [ ] Xác định viewer lazy chunks có nằm trong asset group phù hợp.

Không mở rộng review update mechanism nếu không liên quan trực tiếp đến khả năng vào/open Documents.

---

# PHẦN H — REVIEW TEST COVERAGE

## 36. Coverage hiện tại

`package.json` hiện có:

- `test:ui-documents` → `documents-ui-primitives.contract.test.ts`.
- `test:documents` → `google-drive.service.test.ts`.

Contract test hiện khóa một số điều kiện như:

- Documents dùng shared page/toolbar/button/empty-state/skeleton primitives.
- Preview là fullscreen dialog riêng.
- Có Escape/Tab handling.
- Có Fullscreen API state.
- Có restore focus.

Điều này **chưa đủ** để khóa toàn bộ behavior viewer.

## 37. Test nên bổ sung — ưu tiên P0

### TEST-001 — Offline gating

- [ ] `onItemClick(file)` khi offline không set `previewItem`.
- [ ] `loadFolder()` khi offline không gọi Drive service.
- [ ] `downloadItem()` khi offline không mở tab.
- [ ] online listener đưa state về online đúng.

### TEST-002 — detectKind

Table-driven test cho:

- [ ] PDF extension/MIME.
- [ ] XLS/XLSX/XLSM.
- [ ] CSV extension và `text/csv`.
- [ ] Google Sheet.
- [ ] image/video/audio/text.
- [ ] Google Docs/Slides/unknown → drive.

Nếu `detectKind()` đang private và khó test, cân nhắc tách pure helper thay vì test bằng regex source.

### TEST-003 — Excel limit helper

Nên tách phần tính visible rows/columns/truncation thành pure function để test:

- [ ] 201 cột → 200 cột + truncated.
- [ ] 1 cột × 50.001 rows → 50.000 rows.
- [ ] 200 cột → row limit 2.500 để không vượt 500.000 cells.
- [ ] empty sheet.
- [ ] hidden rows/columns.

### TEST-004 — PDF compatibility helper

- [ ] Polyfill chỉ được install khi API thiếu.
- [ ] Existing native implementation không bị overwrite.
- [ ] Fallback path khi `IntersectionObserver` không có.

### TEST-005 — Preview lifecycle

- [ ] Load file A rồi file B trước khi A hoàn tất → A không overwrite B.
- [ ] Destroy/close → abort request.
- [ ] Download dùng blob/file hiện tại.
- [ ] Error reset loading.

## 38. Test nên bổ sung — ưu tiên P1/P2

- [ ] Contract test cho mobile action menu có Download/Open Drive/Fullscreen/Print PDF condition.
- [ ] Contract test safe-area CSS của preview và Excel tabs.
- [ ] Contract test `gridFocusMode` và Escape order.
- [ ] Contract test PDF toolbar actions tồn tại.
- [ ] Pure tests cho search normalization.
- [ ] Pure tests cho copy TSV từ Excel selection.
- [ ] Test Drive export URL/MIME mapping.
- [ ] Test pagination folder list.

## 39. Không dùng contract test để thay thế logic test

Không nên chỉ thêm regex dạng:

```ts
assert.match(source, /maxColumns = 200/);
```

nếu behavior có thể được tách thành pure function và test output. Contract/source test chỉ phù hợp khi cần khóa cấu trúc UI hoặc boundary kiến trúc.

---

# PHẦN I — CHECKLIST THỰC THI REVIEW

## 40. Pass 1 — Luồng chính

- [ ] Đọc toàn bộ `documents.component.ts`.
- [ ] Vẽ lại state flow: root → folder → file → preview → close.
- [ ] Liệt kê signal/state ảnh hưởng viewer.
- [ ] Liệt kê tất cả network/cache branch.
- [ ] Ghi P0/P1 ngay khi có evidence rõ.

## 41. Pass 2 — Preview router

- [ ] Đọc toàn bộ `document-preview-modal.component.ts`.
- [ ] Lập bảng MIME/extension → kind.
- [ ] Lập bảng kind → load strategy → renderer → actions.
- [ ] Review lifecycle/abort/cleanup.
- [ ] Review responsive/action menu/safe-area.

## 42. Pass 3 — PDF

- [ ] Đọc toàn bộ PDF viewer từ state → lifecycle → template → handlers → helpers.
- [ ] Kiểm tra load/render race.
- [ ] Kiểm tra observer cleanup.
- [ ] Kiểm tra zoom/fit/rotate.
- [ ] Kiểm tra search/text-layer fallback.
- [ ] Kiểm tra touch handler ở mức logic.

## 43. Pass 4 — Excel

- [ ] Đọc toàn bộ Excel viewer.
- [ ] Xác nhận parse/workbook/sheet lifecycle.
- [ ] Xác nhận row/column/cell limits.
- [ ] Xác nhận warning truncate.
- [ ] Review selection/copy/search/filter/sort/autofit.
- [ ] Review grid focus mode và responsive CSS.
- [ ] Review cleanup.

## 44. Pass 5 — Service/PWA

- [ ] Đọc Drive service methods được Documents/Preview gọi.
- [ ] Review pagination, download, export, cache, abort/error.
- [ ] Đọc `ngsw-config.json`.
- [ ] Đọc SW recovery/update helper nếu được dùng trên entry path.
- [ ] Chốt chính xác online/offline support.

## 45. Pass 6 — Tests

- [ ] Chạy/đọc `test:ui-documents`.
- [ ] Chạy/đọc `test:documents`.
- [ ] Lập bảng behavior → test hiện có → test thiếu.
- [ ] Đề xuất ưu tiên test P0 trước.

## 46. Pass 7 — Tổng hợp

- [ ] Không còn issue nào thiếu evidence/file reference.
- [ ] P0 được đặt lên đầu báo cáo.
- [ ] P1 theo sau, nhóm theo component.
- [ ] P2/coverage cuối cùng.
- [ ] Có mục `OK` để ghi nhận logic đã xử lý tốt và tránh sửa thừa.
- [ ] Có mục `Không thể xác minh bằng static review` nhưng không biến chúng thành task test thiết bị.

---

# PHẦN J — MẪU BÁO CÁO SAU REVIEW

## 47. Summary

```md
# Code Review Report — Phiếu giao nhận mẫu Mobile/PWA

## Tổng quan

- P0: N
- P1: N
- P2: N
- OK: N
- Không thể xác minh bằng static review: N

## Release blockers

1. ...

## Rủi ro đáng chú ý

1. ...

## Điểm implementation đang tốt

1. ...

## Test coverage cần bổ sung

1. ...
```

## 48. Mẫu issue

```md
### [P1] Mobile menu cho phép Print khi preview đang lỗi

- Khu vực: Preview
- File: `src/app/features/documents/document-preview-modal.component.ts`
- Evidence: mobile menu render nút Print theo `kind() === 'pdf'` nhưng không có cùng điều kiện disabled như desktop action.
- Rủi ro: người dùng có thể trigger print khi blob chưa sẵn sàng hoặc preview đang lỗi.
- Đề xuất: dùng cùng guard/disabled state cho desktop và mobile path.
- Test nên bổ sung: contract/component test cho action availability theo loading/error state.
- Trạng thái: Open
```

Ví dụ trên chỉ được giữ trong báo cáo thật nếu sau khi đọc đầy đủ implementation xác nhận đúng evidence; không copy máy móc từ kế hoạch.

---

# PHẦN K — DEFINITION OF DONE

Review được coi là hoàn tất khi:

- [ ] Toàn bộ file ở mục 4 đã được đọc đầy đủ.
- [ ] Luồng Documents → Preview → Viewer đã được trace end-to-end.
- [ ] Mọi loại file trong `detectKind()` đã có đánh giá.
- [ ] PDF viewer đã được review đủ render/navigation/zoom/fit/rotate/search/text/cleanup.
- [ ] Excel viewer đã được review đủ parse/sheet/selection/copy/search/filter/sort/limits/responsive/cleanup.
- [ ] PWA/offline conclusion dựa trên `ngsw-config.json` + network gating, không suy diễn.
- [ ] Drive service download/export/cache/error path đã được review.
- [ ] Test coverage hiện tại đã được đối chiếu với behavior quan trọng.
- [ ] Mọi finding có P0/P1/P2 + evidence + đề xuất + test recommendation.
- [ ] Không có mục nào yêu cầu test thiết bị thật để hoàn tất phạm vi này.
- [ ] Các vấn đề chỉ xác minh được bằng runtime được ghi riêng và không dùng để chặn hoàn tất static review.

## 49. Thứ tự ưu tiên khi chuyển từ review sang triển khai sửa

Nếu review phát hiện nhiều vấn đề, xử lý theo thứ tự:

1. P0 làm file không mở/preview lỗi/loading vô hạn/data sai.
2. P0/P1 liên quan race, abort và stale file state.
3. P1 responsive/mobile/PWA layout có evidence rõ trong code.
4. P1 Excel/PDF lifecycle và cleanup.
5. Test tự động cho behavior vừa sửa.
6. P2 accessibility/maintainability/coverage còn lại.

Không sửa code chỉ để đáp ứng một giả thuyết UX không thể chứng minh bằng static review. Trường hợp đó phải được ghi riêng để quyết định sau nếu phạm vi mở rộng sang runtime testing.
