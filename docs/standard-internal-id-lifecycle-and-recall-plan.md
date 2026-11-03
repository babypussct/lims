# Kế hoạch hoàn thiện vòng đời mã nội bộ và thu hồi mã chuẩn đã ẩn

- Ngày lập: 03/11/2026, múi giờ Việt Nam.
- Trạng thái: kế hoạch đề xuất để triển khai; chưa thay đổi nghiệp vụ hoặc dữ liệu vận hành.
- Phạm vi: Quản lý chất chuẩn đối chiếu, kho mã nội bộ, ẩn/khôi phục, cấp–trả–tái cấp mã, đồng bộ, nhập dữ liệu, truy xuất và phân quyền.
- Yêu cầu gốc: bổ sung nút thu hồi toàn bộ mã nhận diện của những chuẩn đã ẩn khỏi danh mục, trả về kho mã chung để có thể cấp lại.
- Cơ sở: đọc mã nguồn trong workspace ngày lập tài liệu; chưa chạy các luồng trên dữ liệu thật và chưa thống kê số mã cần thu hồi.

## 1. Kết quả cần đạt

1. Người có quyền chỉnh sửa chất chuẩn có thể quét, xem trước và thu hồi toàn bộ mã đủ điều kiện của chuẩn đã ẩn.
2. Mỗi mã thông thường chỉ có một hồ sơ sở hữu tại một thời điểm.
3. Ẩn hồ sơ, trả mã và khôi phục có ý nghĩa riêng, được xử lý thống nhất ở mọi đường ghi.
4. Hồ sơ cũ giữ nguyên mã, nhật ký, yêu cầu và QR để truy xuất sau khi mã được cấp lại.
5. Hồ sơ và sổ mã được cập nhật cùng giao dịch, có lịch sử cấp–trả đối chiếu được.
6. Đồng bộ dữ liệu không tự suy ra quyền cấp lại chỉ từ việc hồ sơ đã ẩn.
7. Đợt thu hồi có thể tiếp tục sau lỗi hoặc mất kết nối mà không trả mã trùng, không thu hồi nhầm mã đã cấp cho chuẩn mới.

Trong tài liệu này, “kho chung” là kho mã nhận diện có thể tái cấp. Trả mã không đồng nghĩa với trả lọ chuẩn vật lý về vị trí lưu kho.

## 2. Hiện trạng đã xác minh từ mã nguồn

Các đường dẫn dưới đây tính từ thư mục gốc repository.

| Thành phần | Hiện trạng quan sát được | Ý nghĩa đối với kế hoạch |
|---|---|---|
| `src/app/features/standards/services/standard-crud.service.ts` — `deleteSelectedStandards()` | Kiểm tra quyền, chặn các dấu hiệu mượn/giữ mở, đặt `_isDeleted: true`, `status: DELETED`; tối đa 200 hồ sơ/lần | Ẩn chưa ghi nhận trả mã và chưa cập nhật registry |
| `src/app/features/standards/services/standard-code-registry.service.ts` — `releaseStandardCode()` | Có trả mã riêng lẻ; cập nhật vòng đời và registry trong transaction | Tái sử dụng nền tảng nhưng cần bổ sung ngữ cảnh thu hồi hàng loạt |
| `standard-crud.service.ts` — `releaseInternalId()` | Ghi activity, cập nhật metadata và làm mới hồ sơ sau giao dịch trả mã | Cần phân biệt lỗi ghi nghiệp vụ với lỗi cập nhật phụ sau khi đã commit |
| `src/app/shared/utils/standard-internal-id.ts` — `isCurrentStandardLifecycle()` | Trả về false nếu hồ sơ đã ẩn hoặc có vòng đời `RELEASED`/`CLOSED` | Đang gộp trạng thái hiển thị với vòng đời giữ mã |
| `src/app/features/standards/services/standard-internal-id-sync.service.ts` — `scan()` | Đọc đầy đủ collection; có thể đề xuất registry `AVAILABLE` khi không còn hồ sơ được coi là hiện tại | Có khả năng đưa mã của hồ sơ đã ẩn về kho mà chưa ghi trả mã tương ứng trên hồ sơ |
| `standard-code-registry.service.ts` — `reserveForNewStandard()` | Khóa mã bằng registry; có tái cấp tự động khi chủ cũ đủ điều kiện hết hạn | Phải giữ tính nguyên tử và thống nhất điều kiện với import |
| `src/app/features/standards/services/standard-import.service.ts` | Có logic đọc registry và kiểm tra chủ cũ riêng cho nhập dữ liệu | Cần hội tụ quy tắc để tránh các đường cấp mã khác nhau |
| `standard-crud.service.ts` — `restoreStandard()` | Kiểm tra hồ sơ khác cùng mã, bỏ ẩn, đặt lại trạng thái tồn; chưa giao dịch cấp lại registry và chưa xử lý vòng đời đã trả | Phải sửa cùng chức năng thu hồi |
| `src/app/features/standards/services/standard-cache.service.ts` — `fetchAllAndCache()` | Đọc collection nhưng lọc bỏ hồ sơ đã ẩn trước khi trả về | Không dùng hàm này làm nguồn quét chuẩn đã ẩn |
| `src/app/features/standards/components/standards-toolbar.component.ts` | Có menu Chức năng, mục Đồng bộ mã nội bộ, quyền `standard_edit` | Vị trí bổ sung nút phù hợp |
| `src/app/shared/utils/standard-qr.ts` | QR chứa đường dẫn `/#/standards/{standardId}` | Đã định danh hồ sơ vật lý; giữ thiết kế này và kiểm thử hồi quy |
| `src/app/core/models/standard.model.ts` | Có `internal_id`, vòng đời, thời điểm/lý do trả, số thứ tự cấp; registry có trạng thái và bộ đếm | Có thể mở rộng trên mô hình hiện tại |
| `firestore.rules` | Có nhánh trả mã và bảo vệ registry; quyền ghi dựa trên `standard_edit` | Cần bổ sung kiểm thử và siết các chuyển trạng thái mới ở rules |

### 2.1. Tài liệu liên quan

- `STANDARD_INTERNAL_ID_LIFECYCLE_CHECKLIST.md`: checklist vòng đời trước đây; trạng thái đã đánh dấu không thay thế kiểm thử mới.
- `INTERNAL_ID_SYNC_IMPLEMENTATION_PLAN.md`: kế hoạch công cụ đồng bộ; kế hoạch này bổ sung và điều chỉnh phần quyền sở hữu/thu hồi.
- `FIRESTORE_STANDARD_REQUEST_SECURITY_IMPLEMENTATION.md`: tham chiếu khi thay đổi điều kiện request và rules.
- `RELEASE_DEPLOY_CHECKLIST.md`: tham chiếu ở giai đoạn phát hành.

Nếu phát hiện mâu thuẫn giữa tài liệu cũ và mã nguồn, ghi rõ trong PR; dùng kiểm thử và quy tắc nghiệp vụ trong kế hoạch này làm tiêu chí triển khai sau khi thống nhất phạm vi.

### 2.2. Các điểm chưa được xác minh

- Số lượng hồ sơ đã ẩn, registry lệch, request treo và mã bị trùng trong dữ liệu vận hành.
- Tất cả đường ghi request/usage có cùng cập nhật khóa trên hồ sơ hay chưa.
- Toàn bộ chỗ dùng `isCurrentStandardLifecycle()` và ảnh hưởng khi tách predicate.
- Khả năng còn client cũ hoạt động trong lúc chuyển đổi.
- Chi phí đọc và thời gian xử lý thực tế trên quy mô dữ liệu phòng.

Không chuyển các giả định này thành số liệu hoặc kết luận đã kiểm chứng.

## 3. Quy tắc nghiệp vụ đề xuất

### 3.1. Mã và hồ sơ

- `internal_id` tiếp tục là mã nghiệp vụ duy nhất hiển thị cho người dùng.
- ID hồ sơ là khóa kỹ thuật của một hồ sơ vật lý; không tạo thêm mã nghiệp vụ để thay thế.
- Mã thông thường được chuẩn hóa NFKC, trim, uppercase; đúng 4 ký tự bắt đầu A/B/C theo validator hiện có.
- `SDHET` tiếp tục là mã nghiệp vụ đặc biệt, không chiếm slot độc quyền và không tính vào số mã thu hồi về kho chung.
- Không ghi đè hồ sơ cũ để biểu diễn một lọ hoặc lô mới được cấp lại mã.
- Không xóa `internal_id` trên hồ sơ đã trả mã.

### 3.2. Tách ba khái niệm

| Khái niệm | Nguồn biểu diễn | Quy tắc |
|---|---|---|
| Hiển thị/vận hành | `_isDeleted`, `status` | Quyết định hồ sơ có xuất hiện trong danh mục và có tham gia thao tác kho không |
| Vòng đời hồ sơ đối với mã | `lifecycle_status` | Xác định hồ sơ còn giữ quyền mã hay đã kết thúc |
| Quyền sở hữu hiện tại | `standard_code_registry` | Ghi nhận duy nhất hồ sơ đang được cấp mã hoặc mã sẵn sàng |

Đề xuất tách hàm thuần có tên rõ nghĩa:

- `isStandardVisibleInCatalogue()` cho hiển thị.
- `hasUnreleasedCodeLifecycle()` cho vòng đời chưa trả; dữ liệu cũ thiếu trường được phân loại rõ.
- `isOperationalStandard()` cho mượn/cấp/sử dụng, kết hợp hiển thị, vòng đời và trạng thái nghiệp vụ.
- `assessCodeOwnership()` cho đối chiếu hồ sơ với registry và phát hiện lệch.

Tên cuối cùng có thể điều chỉnh theo quy ước repository. Không thay toàn cục predicate cũ trước khi rà soát từng nơi gọi.

### 3.3. Các bất biến phải bảo vệ

1. Registry `ASSIGNED` phải trỏ đúng hồ sơ có cùng mã, vòng đời còn hiệu lực. Hồ sơ đó có thể đang ẩn nếu chưa trả mã.
2. Registry `AVAILABLE` không có `currentStandardId` và không còn hồ sơ chưa trả mã được xác nhận đang giữ mã đó.
3. Ẩn một hồ sơ không tự giải phóng mã.
4. Trả mã của hồ sơ A không được giải phóng quyền mã của hồ sơ B.
5. Đổi chủ một mã đang `ASSIGNED` phải kết thúc quyền giữ mã của chủ trước trong cùng giao dịch hợp lệ.
6. Không thu hồi khi còn holder hoặc request đang mở; trạng thái chưa rõ phải được phân loại cần đối chiếu.
7. Một sự kiện cấp/trả chỉ được ghi một lần cho cùng thao tác đã commit.
8. Thất bại khi làm mới cache hoặc metadata sau commit không biến kết quả thành “chưa trả mã”.
9. Các kiểm tra quan trọng phải có bảo vệ ở rules/đường ghi đáng tin cậy, không chỉ ở UI.

## 4. Ma trận chuyển trạng thái

| Tình huống | Hành vi đề xuất | Kết quả |
|---|---|---|
| Ẩn chuẩn còn giữ mã, không có quy trình mở | Cho phép ẩn, giữ ownership | Hồ sơ ẩn; mã vẫn `ASSIGNED` |
| Thu hồi chuẩn đã ẩn, đúng chủ và sạch workflow | Trả mã và ghi lịch sử cùng giao dịch | Hồ sơ `RELEASED`; registry `AVAILABLE` |
| Sổ mã đã `AVAILABLE`, hồ sơ cũ chưa ghi trả | Kiểm tra các chủ khác rồi hoàn tất hồ sơ cũ bằng sự kiện đối soát | Không tăng số lần cấp; không tạo lịch sử giả |
| Hồ sơ đã trả, registry cũng sẵn sàng | Bỏ qua | `ALREADY_RELEASED` |
| Hồ sơ cũ đã trả, mã đã cấp cho chủ mới | Bỏ qua đối với mã | Không tác động chủ mới |
| Hồ sơ cũ chưa trả, mã đã cấp chủ mới | Chặn thu hồi thông thường; đưa sang đối soát có bằng chứng | Không đổi registry của chủ mới |
| Thiếu/sai mã hoặc registry xung đột | Hiển thị lý do và hướng xử lý | `BLOCKED` |
| Khôi phục hồ sơ chưa trả, registry vẫn thuộc hồ sơ | Kiểm tra và bỏ ẩn trong transaction | Tiếp tục cùng lượt cấp |
| Khôi phục hồ sơ đã trả, mã sẵn sàng | Cấp lại mã và bỏ ẩn trong cùng transaction | `ACTIVE`, registry `ASSIGNED`, tăng lượt cấp |
| Khôi phục hồ sơ đã trả, mã thuộc chủ khác | Chặn khôi phục vào vận hành | Giữ hồ sơ lịch sử |
| Khôi phục gặp dữ liệu thiếu hoặc lệch registry | Chuyển đối soát | Không đoán chủ |
| Tái cấp tự động cho chuẩn mới khi chủ cũ hết hạn | Chỉ thực hiện nếu đạt bộ điều kiện chung | Kết thúc chủ cũ và cấp chủ mới nguyên tử |

Không bổ sung đổi mã hợp lệ của hồ sơ lịch sử trong đợt đầu. Nếu cần thay mã cho một hồ sơ vật lý còn sử dụng, thiết kế nghiệp vụ riêng với lịch sử trước/sau.

## 5. Luồng người dùng: thu hồi toàn bộ mã chuẩn đã ẩn

### 5.1. Điểm vào

- Vị trí: `Quản lý chất chuẩn đối chiếu → Chức năng → Thu hồi mã chuẩn đã ẩn`.
- Dùng quyền `standard_edit`, phù hợp quyền hiện có; chưa thêm vai trò mới.
- Phạm vi quét là toàn bộ chuẩn đã ẩn, độc lập với bộ lọc và số hàng đang chọn trên trang.
- Mô tả ngắn: “Rà soát và trả mã của chuẩn đã ẩn về kho mã chung để cấp lại.”

### 5.2. Các bước

1. Mở cửa sổ, quét dữ liệu theo yêu cầu; tránh effect tự khởi chạy lại khi trạng thái bận thay đổi.
2. Đọc đủ hồ sơ, registry và yêu cầu cần đối chiếu từ nguồn riêng cho audit.
3. Chuẩn hóa mã để nhóm đối chiếu, nhưng chưa ghi dữ liệu trong bước quét.
4. Hiển thị tổng quan và bảng chi tiết.
5. Người dùng xem phạm vi, nhập/xác nhận lý do và bấm `Thu hồi toàn bộ mã đủ điều kiện`.
6. Kiểm tra lại dữ liệu trong giao dịch trước khi xử lý từng mã.
7. Cập nhật tiến độ; lỗi của một mã không hủy những mã khác đã thành công.
8. Hiển thị kết quả và cho phép xuất báo cáo/chạy lại phần chưa hoàn tất.

### 5.3. Nội dung xem trước

Chỉ số tách biệt:

- Số hồ sơ đã ẩn.
- Số mã hợp lệ duy nhất đủ điều kiện trả.
- Số hồ sơ cần hoàn tất ghi nhận trả mã.
- Số hồ sơ đã xử lý trước đó.
- Số mã/hồ sơ bị chặn.
- Số hồ sơ `SDHET` được loại khỏi phạm vi kho mã tái cấp.

Bảng chi tiết gồm mã nội bộ, tên chuẩn, số lô, vòng đời, trạng thái sổ mã, tình trạng request, kết quả dự kiến và lý do.

Nếu nhiều hồ sơ lịch sử cùng một mã, nhóm theo mã nhưng vẫn cho mở từng hồ sơ. Không cộng số hồ sơ thành số mã thu hồi.

### 5.4. Kết quả và lỗi

Mã kết quả đề xuất: `RELEASED`, `RECONCILED`, `ALREADY_RELEASED`, `BLOCKED`, `CHANGED_SINCE_SCAN`, `FAILED`, `EXCLUDED_SPECIAL_CODE`.

- `RELEASED`: giao dịch trả mã thành công.
- `RECONCILED`: hoàn tất sai lệch có đủ bằng chứng, không giả lập lần trả mới.
- `CHANGED_SINCE_SCAN`: dữ liệu thay đổi; giải thích và yêu cầu quét lại mục đó.
- `FAILED`: chưa xác định thành công; đọc lại trạng thái hoặc nhận diện operation trước khi thử lại.
- Lỗi phụ sau commit hiển thị “Đã thu hồi; cần tải lại danh sách”, không báo trả mã thất bại.
- Hủy khi đang xử lý chỉ dừng phần chưa bắt đầu; các giao dịch đã commit vẫn giữ hiệu lực.

## 6. Thiết kế dịch vụ và tính đồng thời

### 6.1. Hội tụ logic

Giữ `StandardService` làm facade; tập trung quyết định quyền sở hữu vào dịch vụ quản lý mã và các hàm thuần dùng chung.

Các năng lực cần có, tên API chỉ là đề xuất:

| Năng lực | Đầu vào chính | Trách nhiệm |
|---|---|---|
| `scanHiddenStandardCodes()` | Ngữ cảnh người dùng | Báo cáo chỉ đọc, nhóm theo mã, lý do phân loại |
| `assessRecallEligibility()` | Hồ sơ, registry, ứng viên cùng mã, request | Hàm thuần xác định đủ điều kiện |
| `releaseCode()` | Hồ sơ, lý do, operation ID, nguồn thao tác | Đọc lại, trả mã và ghi sự kiện nguyên tử |
| `restoreWithCode()` | Hồ sơ, operation ID | Kiểm tra quyền mã và khôi phục nguyên tử |
| `reserveCode()` | Hồ sơ mới, mã, operation ID | Dùng chung cho thêm thủ công/import |
| `reconcileCodeOwnership()` | Sai lệch và bằng chứng | Đối soát riêng, không suy diễn hoặc chiếm mã |

Đường ghi thêm mới, import, trả riêng lẻ, thu hồi hàng loạt, tái cấp hết hạn và khôi phục phải dùng cùng bộ điều kiện.

### 6.2. Đọc trước và giao dịch

- Kết quả scan chỉ là bản xem trước, không phải bằng chứng đủ để ghi sau vài phút.
- Transaction đọc lại hồ sơ, registry và các tài liệu khóa liên quan trước khi ghi.
- Kiểm tra hồ sơ vẫn ẩn nếu nguồn thao tác là thu hồi chuẩn đã ẩn.
- Giữ kiểm tra không có chủ khác, kể cả biến thể chữ thường/khoảng trắng trong dữ liệu cũ.
- Không dùng query ngoài transaction như bảo đảm duy nhất chống request mới hoặc chủ mới phát sinh.
- Rà soát tất cả đường mở request: phải cùng chạm tài liệu khóa/hồ sơ mà giao dịch trả mã đọc, và chặn khi hồ sơ đã ẩn hoặc đã trả mã.
- Với dữ liệu request cũ lệch cờ, scan phát hiện và chặn trước; nếu chưa chứng minh được giao thức khóa chung thì chưa bật thu hồi cho nhóm đó.
- Web SDK không hỗ trợ tùy ý query collection trong transaction; thiết kế dùng đọc trước để phát hiện, kết hợp khóa được bảo vệ ở mọi đường ghi. Chỉ đề xuất endpoint backend nếu không thể bảo đảm bằng kiến trúc hiện có; chưa mặc định thêm hạ tầng.

### 6.3. Idempotency và thử lại

- Sinh operation ID trước khi gọi transaction; không tạo ID ngẫu nhiên mới trong callback có thể retry.
- Kiểm tra sự kiện đã tồn tại để trả lại kết quả lần trước.
- Cùng mã, cùng lượt cấp và cùng thao tác không tạo hai sự kiện trả.
- Khi mất kết nối sau commit, đọc lại sự kiện/trạng thái trước khi kết luận thất bại.
- Không tự retry lỗi quyền, xung đột ownership hoặc workflow chưa đóng.
- Với timeout, gián đoạn mạng hoặc transaction contention, retry có giới hạn và giữ nguyên operation ID.

## 7. Mô hình dữ liệu đề xuất

### 7.1. Giữ cấu trúc hiện tại

- `reference_standards`: giữ mã cũ, vòng đời và các trường cấp/trả đã có.
- `standard_code_registry`: tiếp tục là sổ quyền sở hữu hiện tại; không phải mã thứ hai.
- `assignmentCount` của registry chỉ tăng khi cấp mã thành công.
- `internal_id_assignment_sequence` phải khớp lượt cấp được ghi nhận trên hồ sơ.
- Quy định rõ ý nghĩa lượt cấp lại cho cùng hồ sơ khi khôi phục: một lượt cấp mới sau lần đã trả.
- Không thêm trường vào registry trước khi cập nhật allowlist của Firestore Rules.

### 7.2. Lịch sử mã bất biến

Đề xuất collection `standard_code_events/{eventId}`; tên và vị trí chốt khi triển khai.

| Trường | Ý nghĩa |
|---|---|
| `eventId`, `operationId` | Nhận diện sự kiện và yêu cầu để chống lặp |
| `internalId` | Mã chuẩn hóa |
| `standardId` | Hồ sơ vật lý liên quan |
| `assignmentSequence` | Lượt cấp, hoặc null nếu lịch sử cũ không đủ bằng chứng |
| `type` | `ASSIGNED`, `RELEASED`, `REASSIGNED`, `RECONCILED`; mở rộng có kiểm soát |
| `source` | Thêm mới, import, trả riêng lẻ, thu hồi, khôi phục, đối soát |
| `reason` | Lý do nghiệp vụ |
| `actorUid`, `createdAt` | Người thực hiện và thời gian máy chủ |
| `before`, `after` | Snapshot tối thiểu quyền sở hữu/vòng đời, không sao chép toàn bộ hồ sơ |
| `runId` | Liên kết đợt thu hồi nếu có |

Ghi sự kiện cùng transaction với hồ sơ và registry. Không cho client sửa/xóa sự kiện đã tạo. Không dựng ngày cấp/trả cũ nếu thiếu bằng chứng; dùng sự kiện đối soát tại thời điểm xác nhận.

### 7.3. Đợt thu hồi

Nếu cần lịch sử đợt và tiếp tục qua phiên, đề xuất `standard_code_recall_runs/{runId}` kèm các kết quả nhỏ theo mã; không gom toàn bộ danh sách vào một document lớn.

- Metadata: người tạo, thời điểm, lý do, trạng thái và tổng kết.
- Kết quả từng mã gắn operation ID và event ID.
- Tổng đếm là projection có thể dựng lại từ kết quả; không dùng tổng đếm làm căn cứ quyền sở hữu.
- Trạng thái giao diện: đang quét, sẵn sàng, đang xử lý, đã dừng, hoàn tất, hoàn tất có mục cần xử lý.
- Nếu chưa cần tiếp tục qua phiên trong bản đầu, vẫn bảo đảm nhận diện lại các thao tác đã commit bằng event ID; ghi rõ giới hạn này trên UI.

## 8. Đồng bộ dữ liệu, import và khôi phục

### 8.1. Điều chỉnh đồng bộ

- Không dùng “không còn xuất hiện trong danh mục” làm bằng chứng đã trả mã.
- Tách chuẩn hóa chuỗi/snapshot khỏi chuyển quyền sở hữu.
- Hồ sơ ẩn nhưng chưa trả: gợi ý mở công cụ thu hồi.
- Hồ sơ đã trả nhưng registry chưa cập nhật: chỉ sửa khi xác định không có chủ hiện tại khác.
- Registry đã cấp chủ mới nhưng hồ sơ cũ chưa kết thúc: báo xung đột/đối soát; không chuyển registry về sẵn sàng.
- Registry alias, sai document ID, thiếu owner và `CONFLICT` tiếp tục có phân loại riêng.
- Cập nhật báo cáo, mô tả thay đổi và kiểm thử của công cụ đồng bộ hiện có.

### 8.2. Import và thêm chuẩn

- Chung validator và điều kiện reserve/release.
- Không để import chiếm mã chỉ vì chủ cũ bị ẩn.
- Tái cấp hết hạn phải kiểm tra workflow, đóng chủ cũ, cấp chủ mới và ghi sự kiện nguyên tử.
- Trong cùng tệp không có hai hồ sơ mới chiếm một mã độc quyền.
- Không ghi đè hồ sơ lịch sử khi người dùng đang tạo chuẩn mới.
- Trả lỗi đủ rõ: mã thuộc chuẩn/lô nào, đang có quy trình gì, cần thu hồi hay cần đối soát.

### 8.3. Khôi phục

- Hồ sơ chưa trả: xác nhận registry vẫn ghi đúng chủ rồi mới bỏ ẩn.
- Hồ sơ đã trả: chỉ khôi phục vào vận hành nếu cấp lại mã thành công trong cùng giao dịch.
- Nếu mã đã thuộc hồ sơ khác: giữ nguyên hồ sơ ẩn, hiển thị chủ hiện tại và cho tra cứu lịch sử.
- Không tự đặt hồ sơ thành `AVAILABLE` nếu vòng đời vẫn là `RELEASED`.
- Tính lại trạng thái tồn theo quy tắc hiện có; việc cấp lại mã không tự tăng lượng tồn.
- Chưa bổ sung quyền “khôi phục chỉ để xem” vì tra cứu lịch sử cần được hỗ trợ trực tiếp, không cần đưa hồ sơ trở lại vận hành.

## 9. QR, lịch sử sử dụng và truy xuất

- Giữ QR trỏ tới `standardId` như mã nguồn hiện tại.
- Không thay QR bằng đường dẫn chỉ chứa mã nội bộ có thể tái sử dụng.
- QR cũ tiếp tục mở đúng hồ sơ cũ sau tái cấp.
- Trang chi tiết thể hiện riêng: hồ sơ đang ẩn, mã đã trả, và mã hiện có chủ mới nếu người xem có quyền tra cứu.
- Request và usage tiếp tục liên kết hồ sơ vật lý; snapshot mã phản ánh thời điểm thực hiện.
- Tra cứu theo mã có thể hiển thị nhiều vòng đời; mặc định làm rõ hồ sơ hiện tại và cho mở lịch sử.
- Kiểm tra mọi điểm in tem, export và nhập nhật ký để không ghép lịch sử chỉ theo `internal_id`.

Đây là bảo toàn thiết kế QR đã có, không phải xây dựng lại cơ chế QR.

## 10. Quyền và Firestore Rules

- Dùng `standard_edit` cho thu hồi; quyền xem lịch sử tuân theo quyền xem/audit hiện có và được xác định rõ khi viết rules.
- Kiểm tra cả UI, dịch vụ và rules; không dựa vào việc nút bị ẩn.
- Release yêu cầu đúng chủ, dữ liệu sau ghi hợp lệ và không có workflow mở theo giao thức khóa chung.
- Event mới phải gắn `actorUid` với người đăng nhập, thời gian máy chủ và chuyển trạng thái liên quan.
- Chặn việc chỉ sửa registry thành `AVAILABLE` mà không có bằng chứng kết thúc ownership hợp lệ; đối soát dùng đường riêng có audit.
- Phân biệt cập nhật metadata thông thường với khôi phục; rules hiện cho chỉnh metadata không nên trở thành lối bỏ qua reserve khi bỏ ẩn.
- Quy định rõ allowlist cho event/run và những trường registry mở rộng.
- Kiểm tra giới hạn access-call của rules theo từng transaction/nhóm ghi; không chỉ dựa vào số document tối đa.
- Chạy emulator để kiểm chứng cả hành động hợp lệ và yêu cầu ghi trực tiếp trái quy tắc.

## 11. Hiệu năng và vận hành

- Bản đầu ưu tiên quét đầy đủ, đúng dữ liệu cũ; đo số lần đọc và thời gian trước khi tối ưu query.
- Nếu dùng hai query `_isDeleted == true` và `status == DELETED`, phải hợp nhất theo ID và không bỏ qua các owner khác cần đối chiếu.
- Có read monitor/progress theo quy ước hiện có; tránh quét lại toàn bộ catalogue cho từng mã.
- Lập map theo mã chuẩn hóa và theo hồ sơ một lần cho bước phân loại.
- Không tải usage và log lồng nếu việc quyết định thu hồi không cần chúng; request đang mở và ownership là dữ liệu trọng tâm.
- Mỗi transaction xử lý một mã/cụm phụ thuộc; bắt đầu tuần tự, chỉ tăng concurrency sau khi đo và kiểm thử contention.
- UI cập nhật tiến độ theo kết quả đã commit; tổng kết phản ánh kết quả thật.
- Không cam kết một đợt lớn là nguyên tử toàn bộ; tính nguyên tử áp dụng theo mã/cụm đã xác định.

## 12. Màn hình Kho mã nội bộ — giai đoạn mở rộng

Không bắt buộc để phát hành nút thu hồi lần đầu.

Các khả năng đề xuất:

- Tìm mã, lọc sẵn sàng/đang cấp/xung đột.
- Xem chuẩn, lô đang giữ và toàn bộ lịch sử cấp–trả.
- Chọn mã sẵn sàng khi thêm chuẩn; kiểm tra lại khi lưu.
- Xem các mã cần đối soát và mở công cụ phù hợp.
- Cân nhắc tạm khóa mã do nhãn trùng, mất nhãn hoặc kiểm kê.

Nếu bổ sung tạm khóa, phải thiết kế chuyển trạng thái, lý do, quyền mở khóa, lịch sử và tương thích client; không chỉ thêm một giá trị enum `BLOCKED` vào registry. Trong giai đoạn đầu, `BLOCKED` chỉ là kết quả rà soát, không phải trạng thái registry mới.

## 13. Danh sách thay đổi theo thành phần

| Thành phần hiện có/đề xuất | Công việc |
|---|---|
| `src/app/core/models/standard.model.ts` | Kiểu báo cáo thu hồi, event, run, kết quả từng mã; giữ tương thích dữ liệu cũ |
| `src/app/shared/utils/standard-internal-id.ts` | Tách predicate hiển thị/vòng đời; classifier ownership; quy tắc mã dùng chung |
| `src/app/shared/utils/standard-fefo.ts` | Rà soát điều kiện tái cấp hết hạn và ứng viên vận hành |
| `src/app/shared/utils/standard-workflow.ts` | Dùng bộ trạng thái request mở thống nhất, kể cả legacy |
| `src/app/features/standards/services/standard-code-registry.service.ts` | Hội tụ reserve/release/restore, idempotency và event nguyên tử |
| Dịch vụ thu hồi đề xuất trong `services/` | Scan, phân loại, điều phối theo mã, báo cáo tiến độ |
| `src/app/features/standards/services/standard-crud.service.ts` | Ẩn giữ ownership; restore có reserve; xử lý hậu commit |
| `src/app/features/standards/services/standard-import.service.ts` | Dùng bộ điều kiện chung; chặn chiếm mã của chuẩn ẩn |
| `src/app/features/standards/services/standard-request.service.ts` | Rà soát tạo/duyệt request và giao thức khóa với release |
| `src/app/features/standards/services/standard-internal-id-sync.service.ts` | Tách sửa dữ liệu khỏi quyết định thu hồi |
| `src/app/features/standards/standard.service.ts` | Facade cho scan/apply/report |
| `src/app/features/standards/components/standards-toolbar.component.ts` | Điểm vào menu và quyền |
| Modal thu hồi mới trong `components/` | Xem trước, lý do, xác nhận, tiến độ, kết quả, xuất báo cáo |
| `src/app/features/standards/standards.component.ts` và `.html` | Nối sự kiện, modal, làm mới dữ liệu |
| `src/app/features/standards/standard-detail.component.ts` và `.html` | Trạng thái mã/lịch sử, kết quả trả mã rõ ràng |
| `src/app/features/config/components/config-general.component.ts` | Khôi phục từ thùng rác và thông báo lỗi cụ thể |
| `firestore.rules`, `firestore.indexes.json` nếu cần | Quyền, tính nguyên tử, event/run; chỉ thêm index có query thực tế |
| Test runner và bộ test liên quan | Bảo đảm test mới thực sự được gọi bởi script hiện hành |

## 14. Kế hoạch triển khai theo giai đoạn

### Giai đoạn 0 — Chốt bản đồ nghiệp vụ và đường ghi

- [ ] Liệt kê mọi nơi dùng predicate vòng đời, registry và restore.
- [ ] Đối chiếu các đường thêm, import, request, usage, đồng bộ, in QR.
- [ ] Chốt bất biến, ma trận trạng thái và trường hợp legacy.
- [ ] Xác định giao thức khóa chống request phát sinh đồng thời.
- [ ] Chốt schema event/idempotency và nhu cầu lưu đợt.

Điều kiện hoàn tất: không còn đường ghi ownership quan trọng nằm ngoài phạm vi đánh giá.

### Giai đoạn 1 — Nền tảng vòng đời, giao dịch và rules

- [ ] Viết classifier và predicate riêng.
- [ ] Hội tụ quy tắc cấp–trả và ghi event nguyên tử.
- [ ] Sửa restore, import và đồng bộ liên quan.
- [ ] Bảo vệ các đường request và ghi trực tiếp bằng rules.
- [ ] Bổ sung test transaction, rules và concurrency.

Điều kiện hoàn tất: các đường ghi không tạo hai chủ, không cấp lại mã chỉ vì hồ sơ đã ẩn.

### Giai đoạn 2 — Nút thu hồi hàng loạt

- [ ] Dịch vụ quét đầy đủ và phân loại theo mã.
- [ ] Menu, modal xem trước, lý do và xác nhận.
- [ ] Điều phối giao dịch, tiến độ, dừng, retry, kết quả.
- [ ] Xuất báo cáo và liên kết hồ sơ cần xử lý.
- [ ] Phân biệt commit thành công với lỗi cập nhật phụ.
- [ ] Kiểm tra UI desktop/mobile và quyền.

Điều kiện hoàn tất: xử lý được các nhóm legacy đã định nghĩa; lỗi riêng lẻ không làm mất kết quả toàn đợt.

### Giai đoạn 3 — Đối soát và triển khai dữ liệu

- [ ] Chạy scan chỉ đọc trong môi trường kiểm chứng có dữ liệu phù hợp.
- [ ] Phân nhóm sai lệch; không đoán ngày trả/chủ sở hữu.
- [ ] Kiểm chứng khối nhỏ và đối chiếu trước/sau.
- [ ] Mở dần chức năng, theo dõi lỗi và số mục bị chặn.
- [ ] Cập nhật tài liệu người dùng và checklist hiện có.

Điều kiện hoàn tất: dữ liệu sau xử lý thỏa bất biến; báo cáo đợt khớp sự kiện và registry.

### Giai đoạn 4 — Tra cứu kho mã và tiện ích mở rộng

- [ ] Màn hình kho mã, bộ chọn mã sẵn sàng, lịch sử theo mã.
- [ ] Cân nhắc khóa mã và kiểm kê nếu có nhu cầu thực tế.
- [ ] Tối ưu query, phân trang và concurrency dựa trên số đo.

Giai đoạn này không làm chậm phần sửa toàn vẹn dữ liệu và nút thu hồi.

## 15. Ma trận kiểm thử bắt buộc khi triển khai

| Nhóm | Tình huống | Kỳ vọng |
|---|---|---|
| Mã | Lowercase/khoảng trắng/NFKC | Nhóm đúng mã chuẩn hóa, không bỏ sót owner |
| Mã | Thiếu/sai định dạng | Chặn và nêu lý do |
| Ngoại lệ | Nhiều hồ sơ `SDHET` | Không cảnh báo trùng owner độc quyền; không cộng mã thu hồi |
| Ẩn | Chuẩn sạch workflow | Ẩn thành công, ownership còn nguyên |
| Thu hồi | Hồ sơ ẩn, đúng owner | Hồ sơ và registry đổi cùng nhau; một event |
| Thu hồi | Chuẩn đã khôi phục sau scan | Không thu hồi qua chức năng chuẩn đã ẩn |
| Workflow | Holder hoặc request mở | Chặn |
| Legacy request | Request mở nhưng cờ hồ sơ thiếu | Phát hiện/chặn, không trả mã |
| Đồng thời | Request mới cạnh tranh release | Chỉ một luồng hợp lệ thành công, không mất khóa |
| Đồng thời | Hai người thu hồi cùng mã | Một lần trả, kết quả còn lại nhận diện đã xử lý |
| Đồng thời | Cấp mới cạnh tranh thu hồi | Không hai chủ; không giải phóng mã của chủ mới |
| Idempotency | Mất phản hồi sau commit rồi retry | Không thêm event hoặc lần trả trùng |
| Hậu commit | Metadata/cache lỗi | Báo đã trả mã và cần làm mới |
| Legacy registry | `AVAILABLE`, hồ sơ chưa trả | Đối soát có bằng chứng; không giả lập lịch sử |
| Legacy registry | Mã đã cấp chủ mới, hồ sơ cũ chưa trả | Không động vào chủ mới; yêu cầu đối soát |
| Legacy registry | Alias, `CONFLICT`, owner thiếu | Chặn và hướng dẫn đúng công cụ |
| Nhóm mã | Nhiều hồ sơ cùng mã | Đếm mã duy nhất, không chọn chủ tùy ý |
| Khôi phục | Chưa trả và vẫn giữ mã | Bỏ ẩn, giữ lượt cấp |
| Khôi phục | Đã trả và mã rảnh | Reserve + bỏ ẩn nguyên tử, tăng lượt cấp |
| Khôi phục | Mã thuộc chuẩn khác | Chặn, hồ sơ lịch sử nguyên vẹn |
| Import | Hai dòng tạo mới cùng mã | Chặn trước ghi |
| Import | Chủ cũ đã ẩn nhưng chưa trả | Không chiếm mã |
| Hết hạn | Tái cấp đủ điều kiện | Đóng chủ cũ/cấp chủ mới/event nguyên tử |
| QR | Quét tem cũ sau tái cấp | Mở đúng hồ sơ cũ |
| Lịch sử | Request/usage cũ sau tái cấp | Không trộn với hồ sơ mới |
| Rules | Người không có quyền ghi trực tiếp | Bị từ chối |
| Rules | Chỉ đổi registry, giả actor, sửa/xóa event | Bị từ chối |
| Rules | Bỏ ẩn hồ sơ đã trả mà không reserve | Bị từ chối |
| UI | Đóng/mở modal, đổi trạng thái bận | Không tự quét lặp |
| UI | Đợt có thành công và lỗi xen kẽ | Tiến độ, tổng kết và retry đúng |
| Quy mô | Đợt lớn, giới hạn rules, mất mạng | Không vượt nhóm phụ thuộc; chạy lại an toàn |

### 15.1. Cách kiểm chứng

- Unit test cho classifier và predicate; tập trung quy tắc và ca biên.
- Integration/emulator test cho giao dịch và rules; kiểm tra cả trạng thái sau ghi và bất biến.
- Test cạnh tranh bằng các thao tác thực sự chạy đồng thời; không chỉ mock kết quả.
- Kiểm thử UI ở desktop/mobile với quyền được và không được phép.
- Gắn file test mới vào script hiện hành. Runner `scripts/run-firestore-rules-tests.js` hiện liệt kê cụ thể file test, nên thêm file không tự bảo đảm được chạy.
- Lệnh tham chiếu trên Windows: `npm.cmd run test:standards`, `npm.cmd run test:firestore-rules`, `npx.cmd tsc -p tsconfig.app.json --noEmit`.
- Trước release thực thi gate repository hiện hành qua `npm.cmd run release:verify` và quy trình phát hành tương ứng.

Các lệnh trên là kế hoạch xác minh cho thay đổi phần mềm; việc tạo tài liệu này không đồng nghĩa các kiểm thử đã được chạy hoặc đã đạt.

## 16. Chuyển đổi dữ liệu và tương thích client

1. Scan chỉ đọc để thống kê từng nhóm; lưu báo cáo thời điểm và phạm vi.
2. Giữ nguyên mã gốc và các tham chiếu lịch sử.
3. Không đổi hàng loạt `DELETED` thành `RELEASED` chỉ dựa trên trạng thái ẩn.
4. Đối chiếu request, owner và registry trước mỗi nhóm sửa.
5. Ghi sự kiện `RECONCILED` với bằng chứng/lý do; trường lịch sử không rõ để null hoặc đánh dấu chưa xác minh.
6. Kiểm tra lại invariant sau từng nhóm; các ca thiếu bằng chứng ở lại danh sách chặn.
7. Đánh giá phiên client cũ còn hoạt động; thiết kế thứ tự rules/client tương thích và cơ chế buộc cập nhật nếu cần theo cơ chế app hiện có.
8. Chưa bật thu hồi rộng khi client cũ vẫn có thể thực hiện đường ghi phá invariant.

Nếu rules mới làm client cũ mất khả năng thao tác an toàn, dùng giai đoạn chuyển tiếp có kiểm soát; không nới rules chỉ để giữ đường ghi sai. Phương án cụ thể phải được kiểm chứng trước phát hành.

## 17. Phát hành, theo dõi và khôi phục khi có lỗi

### 17.1. Trước phát hành

- [ ] Review diff và các đường ghi liên quan.
- [ ] Test/rules/typecheck/build và gate phát hành đạt.
- [ ] Xác định rõ thứ tự cập nhật rules và frontend.
- [ ] Có báo cáo đối soát ban đầu; kiểm chứng trên fixture/emulator trước.
- [ ] Tính năng có cách tắt điểm vào thu hồi khi phát hiện lỗi.
- [ ] Release notes viết bằng ngôn ngữ người dùng, tập trung thao tác và lợi ích.

### 17.2. Theo dõi sau phát hành

- Số mã thu hồi thành công, đã xử lý, bị chặn, thay đổi sau scan và lỗi chưa xác định.
- Sai lệch giữa event, registry và vòng đời hồ sơ.
- Thời gian quét, thời gian theo mã, chi phí đọc, lỗi rules/transaction.
- Kiểm tra thêm mới, import, khôi phục, mượn/trả và QR sau đợt thu hồi nhỏ.
- Không suy ra thành công từ số đếm UI nếu registry/event không khớp.

### 17.3. Nguyên tắc xử lý lỗi

- Có thể tắt UI hoặc dừng nhận đợt mới; không tự đảo các giao dịch đã commit.
- Không khôi phục snapshot cũ đè lên registry nếu mã đã cấp lại cho chuẩn khác.
- Nếu cần sửa, dùng giao dịch bù có kiểm tra owner hiện tại và sự kiện đối soát.
- Không xóa event để làm mất dấu thao tác lỗi.
- Backup phục vụ đối chiếu và phục hồi có chọn lọc, không mặc định restore toàn bộ kho mã.

Tài liệu này không tự thực hiện deploy, commit, thu hồi dữ liệu hoặc thay đổi rules.

## 18. Tiêu chí nghiệm thu

- [ ] Có nút đúng vị trí, đúng quyền; quét toàn bộ chuẩn đã ẩn.
- [ ] Người dùng xem trước số mã duy nhất và lý do các mục bị chặn.
- [ ] Thu hồi thành công làm hồ sơ và sổ mã nhất quán, có audit nguyên tử.
- [ ] Ẩn hồ sơ không tự giải phóng mã qua bất kỳ luồng đồng bộ/import nào.
- [ ] Không trả nhầm mã đã cấp cho chuẩn khác.
- [ ] Request mở được bảo vệ cả khi dữ liệu cũ lệch cờ và khi thao tác đồng thời.
- [ ] Chạy lại, mất mạng sau commit và retry không tạo lịch sử trùng.
- [ ] Khôi phục sau trả mã luôn qua kiểm tra/cấp lại hợp lệ.
- [ ] QR, request, usage và lịch sử vẫn trỏ đúng hồ sơ vật lý.
- [ ] Quy tắc được kiểm chứng bằng emulator, không chỉ bằng UI.
- [ ] Có báo cáo phần hoàn tất/phần còn chặn; không báo thành công toàn bộ khi chưa đủ.
- [ ] Checklist/tài liệu cũ được cập nhật theo hành vi cuối cùng.

## 19. Các quyết định cần chốt trong bước thiết kế triển khai

Các điểm dưới đây có mặc định đề xuất để không làm gián đoạn việc chuẩn bị kỹ thuật:

| Quyết định | Mặc định đề xuất | Khi cần xem lại |
|---|---|---|
| Ẩn có trả mã ngay không? | Ẩn giữ mã; thu hồi qua nút riêng | Nếu phòng yêu cầu thao tác “Ẩn và trả mã” có xem trước riêng |
| Ai được thu hồi? | Người có `standard_edit` | Nếu cần phân quyền chuyên biệt theo tổ chức |
| Thu hồi có đòi hỏi hết hạn/hết lượng không? | Không bắt buộc; yêu cầu hồ sơ đã ẩn, sạch workflow, đúng owner và lý do | Nếu phòng quy định chỉ được tái cấp sau hủy/tiêu hao vật lý |
| Khôi phục khi mã đã bị cấp lại? | Chặn khôi phục vào vận hành; cho xem lịch sử | Nếu xây dựng nghiệp vụ đổi mã có audit riêng |
| Ca chủ mới đã tồn tại nhưng hồ sơ cũ chưa trả? | Đối soát riêng, không thu hồi tự động | Khi có bằng chứng nghiệp vụ đủ để hoàn tất hồ sơ cũ |
| Có màn hình kho mã ngay bản đầu? | Giai đoạn mở rộng | Nếu thao tác chọn mã đang là trở ngại lớn |
| Có tạm khóa mã ngay bản đầu? | Chưa thêm trạng thái registry mới | Khi có nhu cầu kiểm kê/nhãn trùng cụ thể |
| Có thêm backend không? | Ưu tiên kiến trúc hiện có với khóa và rules đúng | Nếu không bảo đảm được kiểm tra request/ownership nguyên tử |

Các mặc định trên là phương án triển khai đề xuất, không phải mô tả hành vi đã có trong sản phẩm.
