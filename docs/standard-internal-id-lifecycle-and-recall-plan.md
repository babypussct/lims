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

- [x] Review diff và các đường ghi liên quan.
- [x] Test/rules/typecheck/build đạt trên môi trường kiểm thử cục bộ và Firestore Emulator.
- [x] Xác định rõ thứ tự cập nhật rules và frontend.
- [x] Có báo cáo đối soát ban đầu; kiểm chứng trên fixture/emulator trước.
- [x] Tính năng có cách tắt điểm vào thu hồi khi phát hiện lỗi.
- [ ] Release notes và gate phát hành (`release:prepare` / `release:verify`) thực hiện khi chuẩn bị phát hành.

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

- [x] Có nút đúng vị trí, đúng quyền; quét toàn bộ chuẩn đã ẩn.
- [x] Người dùng xem trước số mã duy nhất và lý do các mục bị chặn.
- [x] Thu hồi thành công làm hồ sơ và sổ mã nhất quán, có audit nguyên tử.
- [x] Ẩn hồ sơ không tự giải phóng mã qua bất kỳ luồng đồng bộ/import nào.
- [x] Không trả nhầm mã đã cấp cho chuẩn khác.
- [x] Request mở được bảo vệ cả khi dữ liệu cũ lệch cờ và khi thao tác đồng thời.
- [x] Chạy lại, mất mạng sau commit và retry không tạo lịch sử trùng.
- [x] Khôi phục sau trả mã luôn qua kiểm tra/cấp lại hợp lệ.
- [x] QR, request, usage và lịch sử vẫn trỏ đúng hồ sơ vật lý.
- [x] Quy tắc được kiểm chứng bằng emulator, bao gồm giao dịch đồng thời qua service.
- [x] Có báo cáo phần hoàn tất/phần còn chặn; không báo thành công toàn bộ hoặc `PERSISTED` khi còn projection chưa ghi hoặc mục chưa xác định.
- [x] Checklist/tài liệu được cập nhật theo hành vi cuối cùng.

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

## 20. Đặc tả triển khai Đợt 1 (Giảm chi phí đọc của thu hồi hàng loạt, dừng an toàn khi chạm giới hạn tài nguyên và bảo vệ DeltaSync)

### 20.1. Phạm vi và giới hạn của Đợt 1

1. **Loại bỏ quét toàn bộ `reference_standards` cho từng mục trong thu hồi hàng loạt (`StandardCodeRecallService` → `StandardCodeRegistryService.releaseStandardCode`)**: tận dụng danh sách ứng viên cùng mã đã thu được ở bước quét đầu đợt, kết hợp truy vấn điểm `where('internal_id', 'in', [code, code.toLowerCase()])` và đọc lại `standard_code_registry/{code}` trong `runTransaction`.
2. **Dừng đợt xử lý ngay (fail-fast) khi gặp giới hạn tài nguyên Firestore (`resource-exhausted`) ở mọi bước**: bảo toàn các kết quả đã xác nhận, giữ nguyên `operationId` cho mục chưa xác định để đối soát idempotent.
3. **Ngăn `DeltaSyncService` tự tạo lại yêu cầu đọc khi đang tạm dừng do giới hạn tài nguyên**: chặn việc tự khởi động lại do timer retry, subscriber mới, chuyển trang (destroy/recreate) hoặc yêu cầu `getDocs()` đang chạy dở hoàn tất muộn trong cùng chu kỳ tạm dừng.
4. **Giới hạn phạm vi rõ ràng**: Đợt 1 giữ nguyên đường kiểm tra bảo thủ (quét toàn bảng) cho thao tác trả mã đơn lẻ ngoài recall (`scannedCandidates === undefined`), thêm mới (`reserveForNewStandard`) và khôi phục (`restoreStandard`). Bản sửa này giảm mạnh chi phí đọc của thu hồi hàng loạt nhưng chưa loại bỏ mọi lượt quét toàn bảng trong ứng dụng; backfill `internal_id_normalized`, IndexedDB hoặc Google Drive Pack thuộc các đợt tiếp theo.

### 20.2. Giữ nguyên trạng thái thực thi từng mục (Không gộp sang `ALREADY_RELEASED`)

Khi cập nhật báo cáo trong bộ nhớ hoặc tiếp tục đợt thu hồi trong cùng phiên, hệ thống giữ nguyên trạng thái thực thi của từng mục và tính riêng danh sách mục cần xử lý tiếp theo qua `selectRecallExecutionTargets`:

| Kết quả thực thi | Cách xử lý khi tiếp tục đợt trong phiên |
|---|---|
| `RELEASED` (`CONFIRMED`) | Đã xác nhận trả mã; giữ nguyên `RELEASED`, không thực hiện lại và không đổi thành `ALREADY_RELEASED` |
| `RECONCILED` (`CONFIRMED`) | Đã xác nhận đối soát; giữ nguyên `RECONCILED`, không thực hiện lại và không đổi thành `ALREADY_RELEASED` |
| `ALREADY_RELEASED` (`CONFIRMED`) | Đã xác nhận xử lý trước đó; không thực hiện lại |
| `BLOCKED` (`CONFIRMED`) | Giữ nguyên trạng thái `BLOCKED` và lý do bị chặn; không hiển thị thành công và không thực hiện lại |
| `CHANGED_SINCE_SCAN` (`CONFIRMED`) | Giữ nguyên `CHANGED_SINCE_SCAN`; yêu cầu quét hoặc đánh giá lại (chỉ chạy lại nếu bật `includeFailed`) |
| `FAILED` (`CONFIRMED`) | Lỗi nghiệp vụ xác định; giữ nguyên kết quả, chỉ thử lại khi `includeFailed = true` |
| `FAILED` (`UNCONFIRMED`) | Chưa xác định kết quả do giới hạn tài nguyên/mạng; tự động chọn lại để đối soát bằng cùng `operationId` |
| Chưa bắt đầu | Giữ nguyên trạng thái quét ban đầu (`RELEASED` / `RECONCILED`) và khả năng xử lý |

### 20.3. Ràng buộc ứng viên từ bước quét với `expectedInternalId`

`StandardCodeReleaseOptions` nhận tùy chọn có cấu trúc:

```ts
scannedCandidates?: {
  expectedInternalId: string;
  standardIds: readonly string[];
};
```

Quy tắc an toàn trong `releaseStandardCode()`:

1. Đọc lại hồ sơ mục tiêu và chuẩn hóa `currentCode = normalizeInternalId(standard.internal_id)`.
2. Nếu `source === 'RECALL'` và hồ sơ không còn ở trạng thái ẩn (`_isDeleted !== true && status !== 'DELETED'`), dừng mục đó với lỗi dữ liệu thay đổi sau lần quét (`CHANGED_SINCE_SCAN`).
3. Nếu `scannedCandidates` được truyền mà `normalizeInternalId(scannedCandidates.expectedInternalId) !== currentCode`, dừng mục đó với `CHANGED_SINCE_SCAN` trước khi dùng `scannedCandidates.standardIds`.
4. Phân biệt rõ hai trường hợp:
   - `scannedCandidates === undefined` (trả mã đơn lẻ ngoài recall): dùng đường bảo thủ quét toàn bảng `scanAllSameCodeStandardIds(currentCode)`.
   - `scannedCandidates !== undefined` (thu hồi hàng loạt đã qua bước quét, kể cả khi `standardIds` là mảng rỗng `[]`): dùng đường tối ưu `Set(scannedCandidates.standardIds) ∪ querySameCodeStandardIds(currentCode)` và không rơi về quét toàn bảng.
5. Trong `runTransaction`: đọc `standard_code_events/{operationId}`, đọc lại hồ sơ mục tiêu, kiểm tra lại trạng thái ẩn và `currentCode === initialCode`, đọc `standard_code_registry/{code}`, hợp nhất tập ứng viên với `registry?.currentStandardId` từ snapshot thực tế trong transaction, rồi `transaction.get()` toàn bộ ứng viên trước khi thực hiện bất kỳ lệnh ghi nào.

### 20.4. Phối hợp trên `standard_code_registry/{code}` và các đường ghi liên quan

- `releaseStandardCode`, `reserveForNewStandard`, `restoreStandard` và `StandardImportService.saveImportedData` cùng đọc và cập nhật `standard_code_registry/{code}`.
- Trong `releaseStandardCode`, `registry?.currentStandardId` đọc trong `runTransaction` luôn được hợp nhất vào danh sách hồ sơ cần `transaction.get()` và kiểm tra quyền sở hữu trước khi ghi, bảo đảm phát hiện xung đột khi thao tác cấp mới/import/khôi phục xen kẽ sau thời điểm quét.

### 20.5. Dừng an toàn (Fail-Fast) ở mọi bước của đợt thu hồi khi gặp `resource-exhausted`

Cơ chế nhận diện `isDeltaResourceExhaustedError` được áp dụng cho tất cả các bước chạm Firestore trong `StandardCodeRecallService`:

1. **`writeRun('RUNNING')` đầu đợt**: nếu gặp `resource-exhausted`, dừng ngay trước vòng lặp (`stopReason = 'RESOURCE_LIMIT'`, `serverState = 'UNCONFIRMED'`, `canAutoRescan = false`), giữ toàn bộ mục mục tiêu ở trạng thái chưa bắt đầu.
2. **`releaseStandardCode()`**: nếu gặp `resource-exhausted`, ghi nhận mục hiện tại là `status: 'FAILED'`, `outcomeState: 'UNCONFIRMED'`, giữ nguyên `operationId`, bỏ qua `classifyExecutionFailure()` (`getDoc`), bỏ qua `writeRunItem()`, bỏ qua `writeRun('STOPPED')` và dừng vòng lặp ngay.
3. **`classifyExecutionFailure()`**:
   - Nếu lỗi từ `releaseStandardCode()` đã chỉ rõ hồ sơ thay đổi sau lần quét thì phân loại ngay `CHANGED_SINCE_SCAN` (`CONFIRMED`) mà không đọc phụ.
   - Ưu tiên đọc `standard_code_events/{operationId}` trên máy chủ trước: nếu sự kiện đã tồn tại (`!fromCache`), xác minh chặt `type === 'RELEASED' || type === 'RECONCILED'`, `standardId`, `normalizeInternalId(internalId)` và `operationId`. Khi khớp đầy đủ mới lấy trạng thái trực tiếp từ `eventData.type` (`RELEASED` hoặc `RECONCILED`, `outcomeState: 'CONFIRMED'`); nếu sự kiện không khớp loại hoặc thuộc hồ sơ/mã khác thì báo rõ `FAILED` (`outcomeState: 'CONFIRMED'`, `errorCode: 'event-mismatch'`) chứ không chuyển thành thành công.
   - Khi đọc `standard_code_events/{operationId}` hoặc `reference_standards/{standardId}`: nếu gặp `resource-exhausted` thì trả về `FAILED` (`UNCONFIRMED`, `resourceExhausted: true`) và dừng vòng lặp ngay; nếu gặp bất kỳ lỗi đọc nào khác (`unavailable`, mất mạng/offline, `deadline-exceeded`) hoặc dữ liệu chỉ đọc từ cache cục bộ (`fromCache === true`), giữ nguyên `outcomeState: 'UNCONFIRMED'` và `operationId` để lần tiếp tục đợt tự động đối soát/thử lại.
   - Chỉ đặt `outcomeState: 'CONFIRMED'` khi đã đọc thành công từ máy chủ và xác nhận trạng thái tài liệu (`RELEASED`, `RECONCILED`, `ALREADY_RELEASED`, `BLOCKED`, `CHANGED_SINCE_SCAN`, xác nhận hồ sơ không còn tồn tại trên máy chủ, sự kiện không khớp hoặc lỗi phân quyền/tham số đầu cuối).
4. **`writeRunItem()` sau khi `releaseStandardCode()` đã thành công và backfill khi tiếp tục đợt**:
   - Nếu `releaseStandardCode(X)` đã cam kết nhưng `writeRunItem(X)` gặp `resource-exhausted`, mục `X` vẫn giữ nguyên kết quả đã cam kết (`RELEASED` hoặc `RECONCILED`, `outcomeState: 'CONFIRMED'`, `projectionPersisted: false`), đợt dừng ngay trước mục kế tiếp `Y`, và trạng thái đợt được đánh dấu `serverState = 'UNCONFIRMED'`.
   - Khi tiếp tục đợt trong cùng phiên, các mục đã `CONFIRMED` nhưng có `projectionPersisted === false` được ghi bù `writeRunItem` mà không gọi lại `releaseStandardCode()`.
5. **`writeRun()` cuối đợt và `scanAfterExecution()` trong modal**: khi `stopReason === 'RESOURCE_LIMIT'` thì bỏ qua `writeRun()` cuối đợt; nếu `writeRun()` cuối đợt gặp `resource-exhausted` thì đặt `stopReason = 'RESOURCE_LIMIT'`, `serverState = 'UNCONFIRMED'` và `canAutoRescan = false`. `serverState` chỉ đạt `'PERSISTED'` và `canAutoRescan` chỉ đạt `true` khi `unpersistedProjectionCount === 0 && unconfirmedCount === 0` và `writeRun()` cuối đợt thành công.

### 20.6. Nhận diện lỗi giới hạn tài nguyên theo mã có cấu trúc

Hàm `isDeltaResourceExhaustedError(error)` kiểm tra đệ quy qua `error` và `error.cause`:

- Loại trừ lỗi bộ nhớ trình duyệt (`QuotaExceededError` / `NS_ERROR_DOM_QUOTA_REACHED`).
- Ưu tiên `error.code` có cấu trúc: `'resource-exhausted'`, `'firestore/resource-exhausted'`, hậu tố `/resource-exhausted`, hoặc mã số gRPC `8`.
- Kiểm tra trường trạng thái HTTP kiểu số (`error.status === 429` hoặc `error.statusCode === 429`).
- Chỉ dùng biểu thức chính quy chặt trên `message` (`/\bresource[_\s-]?exhausted\b/i` hoặc `/\bquota exceeded\b/i`) làm phương án dự phòng cuối; không khớp chuỗi con `"429"` rời rạc để tránh nhận nhầm mã lô, ID tài liệu hoặc thông báo nghiệp vụ.

### 20.7. Hợp đồng kết quả cấp đợt (`StandardCodeRecallBatchOutcome`) và giới hạn phiên bộ nhớ

`recallEligibleCodesWithOutcome()` trả về `StandardCodeRecallBatchOutcome` gồm:
- Nhóm trạng thái cấp đợt: `runId`, `results`, `stopReason` (`'NONE' | 'USER_REQUESTED' | 'RESOURCE_LIMIT'`), `serverState` (`'PERSISTED' | 'UNCONFIRMED'`), `requiresReconciliation`, `canAutoRescan`, `message`.
- Nhóm bộ đếm toàn đợt (cùng phạm vi toàn bộ mục mục tiêu của báo cáo): `targetCount`, `confirmedCount`, `confirmedSuccessCount`, `confirmedBlockedCount`, `confirmedFailedCount`, `unconfirmedCount`, `unstartedCount`, `unpersistedProjectionCount`.
- Nhóm bộ đếm riêng cho lượt chạy hiện tại: `attemptTargetCount`, `attemptedCount`, `backfilledProjectionCount`.

Giới hạn phiên hiện tại được hiển thị rõ trên giao diện:

> Khi đợt dừng và `serverState = 'UNCONFIRMED'`, việc tiếp tục đợt hoặc đối soát bằng cùng `operationId` chỉ áp dụng trong phiên màn hình hiện tại còn giữ `report()` và `executionResults()` trong bộ nhớ. Nếu đóng hộp thoại hoặc tải lại trang, người dùng phải quét lại trước khi thực hiện đợt mới.

### 20.8. Quản lý trạng thái tạm dừng trong `DeltaSyncService` và nối lên màn hình Danh mục chuẩn (`StandardsComponent`)

1. Mỗi khóa listener (`key`) có bộ đếm thế hệ `generation` và trạng thái tạm dừng trong `_resourceLimitPauses`.
2. Khi phát hiện `resource-exhausted` (ở `getDocs()` khởi tạo hoặc `onSnapshot()`):
   - Tăng `entry.generation`, hủy `unsubscribe` hiện tại, xóa timer retry, đặt `entry.status = 'failed'` và ghi nhận vào `_resourceLimitPauses`.
   - Nếu một `getDocs()` khởi tạo bắt đầu trước khi tạm dừng nhưng hoàn tất sau đó, kiểm tra `!this._entryIsActive(entry, generation) || this.isResourceLimitPaused(entry.key)` sẽ chặn không cho gắn `onSnapshot()` mới.
3. Trong thời gian khóa đang tạm dừng:
   - Subscriber mới hoặc thao tác chuyển trang (destroy/recreate listener) không tự khởi động lại đồng bộ; chỉ phát dữ liệu nếu khóa đã có cache hợp lệ (`hasUsableCache || entry.memCache.length > 0`), và không phát mảng rỗng `[]` như dữ liệu đầy đủ khi chưa có cache hợp lệ.
   - Chỉ tiếp tục lại khi gọi tường minh `retryResourceLimitedSync(cacheKey)` (bỏ qua các lần bấm lặp liên tiếp khi `entry.status === 'starting'`) hoặc khi đổi phạm vi đăng nhập qua `clearResourceLimitPausesForScope()`.
4. Nối trạng thái lên `StandardCacheService`, `StandardService` và `StandardsComponent`:
   - `StandardCacheService._deltaSyncConfig()` đăng ký cả `onError` và `onReady` để cập nhật `syncDiagnosticError`, `resourceLimitState`, `isRetryingSync` và thông báo cho các subscriber qua `listenToStandards(onData, onError, onReady)`.
   - Khi listener kết nối lại thành công (`onReady`), kể cả khi snapshot không có thay đổi dữ liệu (`hasChanges === false`), `StandardCacheService` và `StandardsComponent` đều nhận tín hiệu sẵn sàng để tắt `isRetryingSync` / `isRetryingDeltaSync`, xóa cảnh báo tạm dừng và khôi phục nút `"Thử đồng bộ lại"`.
   - Khi `DeltaSyncService` tạm dừng mà chưa có cache hợp lệ, `StandardsComponent` tắt `isLoading` (`isLoading.set(false)`), hiển thị thông báo cảnh báo đồng bộ đang tạm dừng do giới hạn tài nguyên và nút `"Thử đồng bộ lại"` (`retryDeltaSync()`).
   - Khi `DeltaSyncService` tạm dừng nhưng đang hiển thị dữ liệu từ cache cục bộ, `StandardsComponent` hiển thị thanh cảnh báo nêu rõ dữ liệu đang lấy từ bộ nhớ đệm cục bộ gần nhất và cung cấp nút `"Thử đồng bộ lại"`.

## 21. Đặc tả triển khai Đợt 2 (Chuẩn hóa `internal_id` có chứng nhận & Loại bỏ toàn bộ quét toàn bảng ở các thao tác đơn lẻ)

### 21.1. Phạm vi và mục tiêu của Đợt 2

1. **Loại bỏ quét toàn bảng `reference_standards` ở tất cả thao tác đơn lẻ**:
   - `StandardCrudService.addStandard()`: thêm mới 1 chuẩn.
   - `StandardCodeRegistryService.restoreStandard()`: khôi phục 1 chuẩn từ thùng rác.
   - `StandardCodeRegistryService.releaseStandardCode()`: trả mã đơn lẻ ngoài quy trình thu hồi hàng loạt (`scannedCandidates === undefined`).
2. **Cơ chế Chứng nhận Chuẩn hóa (`Normalization Certification Marker`)**:
   - Lưu trữ tại tài liệu cấu hình `artifacts/{APP_ID}/config/standard_code_migration`.
   - Cung cấp bằng chứng an toàn chứng minh toàn bộ dữ liệu máy chủ không còn mã chưa chuẩn hóa (`unnormalizedCount === 0`) và không còn xung đột sở hữu (`conflictsCount === 0`).
   - Được cập nhật tự động bởi `StandardInternalIdSyncService` khi quản trị viên thực hiện đối soát (`scan()`) đạt chuẩn hoặc áp dụng đồng bộ (`apply()`) thành công.
   - Được bảo vệ bằng Firestore Rules với quyền `hasAuditedStandardEdit(appId)`.
3. **Thao tác đơn lẻ chuyển sang truy vấn điểm O(1)**:
   - Khi hệ thống đã có chứng nhận (`isNormalizationCertified() === true`), các thao tác đơn lẻ truy vấn điểm chính xác qua `where('internal_id', '==', code)` kết hợp đọc `standard_code_registry/{code}` trong transaction.
   - Khi chưa được chứng nhận (`isNormalizationCertified() === false`), dịch vụ tự động fallback an toàn về quét toàn bảng để bảo đảm không bỏ sót biến thể mã lịch sử.
4. **Tối ưu hóa quét ẩn trong thu hồi hàng loạt (Fast Scan)**:
   - `StandardCodeRecallService.scanHiddenStandardCodes()` chuyển sang Fast Scan khi hệ thống đã chứng nhận: chỉ đọc hồ sơ bị ẩn qua hai truy vấn có điều kiện `where('_isDeleted', '==', true)` và `where('status', '==', 'DELETED')`, sau đó truy vấn theo lô `where('internal_id', 'in', chunk)` cho các mã phát hiện được, đọc sổ mã và yêu cầu tương ứng. Không còn quét toàn bộ tập `reference_standards`.
5. **Tối ưu thùng rác cấu hình (`ConfigGeneralComponent.openRecycleBin`)**:
   - Truy vấn có điều kiện `where('_isDeleted', '==', true)` và `where('status', '==', 'DELETED')` thay vì quét toàn bộ danh mục chuẩn; loại trùng theo `id` và ghi nhận telemetry đọc vào `FirestoreReadMonitor`.

## 22. Đặc tả triển khai Đợt 3 (IndexedDB L2 Persistent Cache & Single Source of Truth cho Danh mục chuẩn)

### 22.1. Bộ đệm bền vững L2 qua IndexedDB (`DeltaIndexedDbStorage`)

1. **Kiến trúc hai tầng bộ đệm (Tiered Cache Architecture)**:
   - **Tầng L1 (In-Memory)**: Lưu trữ mảng đối tượng `memCache` trong bộ nhớ ứng dụng để các component đọc và phản hồi tức thì với độ trễ 0ms.
   - **Tầng L2 (IndexedDB Persistence)**: Ưu tiên IndexedDB khi khả dụng; chỉ dùng cơ chế `localStorage` cũ làm fallback (vốn bị giới hạn dung lượng nghiêm ngặt 5MB và gây nghẽn UI thread qua I/O đồng bộ).
   - Cơ sở dữ liệu IndexedDB `lims_delta_sync_v1` (phiên bản 1) với Object Store `cache_entries`, dùng khóa tổng hợp `cacheKey` (được cách ly chặt chẽ theo `authScope: [uid, role, permissions]`).
2. **Khả năng tự suy thoái mềm dẻo (Graceful Degradation)**:
   - Khi môi trường không hỗ trợ `indexedDB` (như SSR, Node.js unit tests hoặc trình duyệt chặn lưu trữ cục bộ), adapter tự động chuyển sang fallback localStorage/L1 có kiểm soát mà không phát sinh ngoại lệ.
3. **Chống phân mảnh và giải phóng bộ nhớ cũ**:
   - Khi đăng xuất hoặc chuyển đổi tài khoản, các bản ghi bộ đệm của phiên người dùng trước được thu dọn theo scope để tránh chiếm dụng tài nguyên máy khách.

### 22.2. Điểm chân lý duy nhất cho Danh mục chuẩn (`getCompleteCatalogue()`)

1. **Loại bỏ phân mảnh đọc toàn bảng trong `StandardCacheService`**:
   - Khởi tạo hàm trung tâm `getCompleteCatalogue(forceFresh = false): Promise<ReferenceStandard[]>`.
   - Nếu `StandardCacheService` đã có `completeCatalogue` hợp lệ trong bộ nhớ và không yêu cầu `forceFresh`, trả về ngay lập tức với **0 lượt đọc Firestore**.
   - Nếu chưa có sẵn, kích hoạt tải nền phân trang, đưa kết quả vào bộ nhớ đệm L1 & L2 và chia sẻ cùng một `Promise` cho tất cả các caller gọi đồng thời.
2. **Cập nhật các caller về nguồn duy nhất**:
   - **Import Excel (`StandardImportService`)**:
     - Thay thế các lời gọi `fetchAllAndCache()` phân tán bằng `getCompleteCatalogue()`, chỉ tái sử dụng snapshot đã tải đầy đủ từ máy chủ.
   - **Công cụ dọn dẹp dữ liệu (`StandardsDataCleanupModalComponent`)**:
     - Chuyển sang dùng `standardCache.getCompleteCatalogue()`, tránh phát sinh lượt đọc toàn bộ danh mục khi mở modal dọn rác/gộp chuẩn.
   - **Tải danh mục cho Báo cáo / Thống kê (`StateService.loadReferenceStandards()`)**:
     - Chỉ kiểm tra snapshot đầy đủ đã được xác nhận trước khi thực hiện truy vấn Firestore. Giảm triệt để việc đọc lại toàn bộ chuẩn khi người dùng điều hướng giữa Kho, SOP và Báo cáo.

### 22.3. Tối ưu hóa Firestore Rules bảo vệ AST limit khi xử lý giao dịch đồng thời

1. **Short-circuit quyền hạn quản trị (`role == 'manager'`)**:
   - Bỏ việc khởi tạo biến cục bộ `let direct` và `let custom` trong `evaluateUserPermission` khi tài khoản có vai trò Quản lý, giảm mạnh số biểu thức AST tiêu tốn trong mỗi lần đánh giá quy tắc.
2. **Inlined Path Expressions**:
   - Tránh việc tính toán các đường dẫn document rỗng (`$(migratedTo) == ''` hay `$(previousHolderId) == ''`) ở đầu hàm trước khi kiểm tra điều kiện kích hoạt, ngăn chặn hoàn toàn lỗi `evaluation error` trong engine Firestore CEL.
3. **Đồng bộ trạng thái sổ mã khi khôi phục chuẩn chưa trả mã**:
   - Trong `StandardCodeRegistryService.restoreStandard()`, cập nhật `lastUpdated` trên sổ mã khi khôi phục hồ sơ có `lifecycle_status === 'ACTIVE'`, đảm bảo tài liệu sổ mã luôn nằm trong write set của transaction để vượt qua điều kiện kiểm tra `getAfter()` trong Firestore Security Rules.


## 23. Đặc tả triển khai Đợt 4 (Bảng điều khiển Sổ mã & Nhật ký vòng đời sự kiện sở hữu)

### 23.1. Hợp nhất Trung tâm Điều khiển Mã Quản lý (`StandardsInternalIdSyncModalComponent`)

1. **Kiến trúc ba góc nhìn nghiệp vụ (Unified Workspace Views)**:
   - Tích hợp góc nhìn thứ ba **`Sổ mã & Sự kiện`** (`activeView = 'registry'`) vào không gian làm việc của Quản lý phòng thí nghiệm, bên cạnh hai góc nhìn hiện hữu (`Quét & Đối chiếu`, `Lịch sử đồng bộ`).
   - Cung cấp thuộc tính `initialView` cho phép mở trực tiếp chế độ tra cứu từ menu Toolbar hoặc từ các luồng phân tích khác.
2. **Dải trạng thái và Chứng nhận Chuẩn hóa Tối ưu**:
   - Hiển thị trực quan trạng thái chứng nhận toàn cục `certificationInfo.verified` (lấy từ cấu hình hệ thống `artifacts/{APP_ID}/config/standard_code_migration`):
     - **Đã kích hoạt**: Xác nhận toàn bộ kho chuẩn đã chuẩn hóa 100%, các thao tác thêm mới/khôi phục/thu hồi đang chạy ở tốc độ cao $O(1)$ với truy vấn điểm, không cần quét toàn bộ danh mục.
     - **Chưa kích hoạt**: Hướng dẫn quản trị viên chạy đối soát để hệ thống tự động chứng nhận.
   - Thống kê thời gian thực: Tổng số mã quản lý, số lượng đang cấp (`ASSIGNED`), sẵn sàng cấp lại (`AVAILABLE`), xung đột (`CONFLICT`), và bí danh chuyển đổi (`MIGRATED`).
3. **Bộ lọc và Tìm kiếm đa tiêu chí**:
   - Lọc nhanh theo các trạng thái vòng đời: `Tất cả`, `Đang cấp`, `Sẵn sàng`, `Xung đột`, `Chuyển đổi (Alias)`.
   - Tìm kiếm tức thì theo mã quản lý nội bộ, ID hồ sơ chuẩn đang giữ, hoặc ID chuẩn trả gần nhất.
4. **Bảng dữ liệu Sổ mã và Xuất CSV chuẩn hóa**:
   - Hiển thị chi tiết từng mã: Trạng thái sở hữu, hồ sơ đang giữ, số lượt đã cấp trong lịch sử, thời điểm cấp gần nhất, thời điểm trả gần nhất.
   - Xuất dữ liệu bảng mã ra tệp CSV kèm BOM UTF-8 phục vụ báo cáo và kiểm toán độc lập.

### 23.2. Bảng theo dõi Lịch sử Sự kiện Vòng đời Mã (`Standard Code Events`)

1. **Giao diện dòng thời gian (Lifecycle Timeline Overlay)**:
   - Hiển thị theo thứ tự thời gian đảo ngược mọi biến động sở hữu của từng mã quản lý, được ghi nhận bất biến trong tập hợp `standard_code_events`.
2. **Phân loại sự kiện và nguồn gốc thao tác**:
   - **Loại sự kiện (`type`)**: `Cấp mã (ASSIGNED)`, `Thu hồi / Trả mã (RELEASED)`, `Đổi chủ sở hữu (REASSIGNED)`, `Khắc phục đối soát (RECONCILED)`.
   - **Nguồn gốc (`source`)**: `Tạo mới hồ sơ`, `Nhập từ tệp Excel`, `Trả mã đơn lẻ`, `Thu hồi mã chuẩn ẩn`, `Khôi phục từ thùng rác`, `Tự động tái cấp`, `Đồng bộ đối soát`.
3. **Truy vết thay đổi hai chiều (Before/After Snapshots)**:
   - Thể hiện rõ ràng hồ sơ chuẩn sở hữu và trạng thái kỹ thuật trước và sau khi diễn ra sự kiện, cùng với tên người thực hiện (`actorName`) và lý do thao tác (`reason`).


## 24. Hoàn thiện kiểm chứng và phát hành 05/11/2026

- Cache DeltaSync là projection có lọc/giới hạn, không chứng minh danh mục đầy đủ. `getCompleteCatalogue` chỉ tái sử dụng snapshot từ lượt đọc máy chủ hoàn chỉnh, phân trang theo document ID để không bỏ hồ sơ legacy thiếu ngày cập nhật. Các caller đồng thời dùng chung một promise; thay đổi từ listener làm mất hiệu lực snapshot đầy đủ.
- IndexedDB lưu snapshot và cursor trong cùng một transaction. Lỗi quota localStorage không xóa bản IndexedDB hợp lệ. Cache cũ thiếu cursor hoặc quá hạn phải tải lại; đăng xuất và xóa cache vẫn xóa lớp lưu bền vững.
- Quét chuẩn hóa đọc máy chủ, ghi nhận chứng nhận chỉ khi mọi mã hợp lệ/canonical và không còn ownership conflict/registry repair. Apply thu hồi chứng nhận trước khi ghi và quét lại sau commit. Không cache lâu kết quả chứng nhận dương tính.
- Truy vấn sự kiện có orderBy(createdAt, desc) trước limit; index theo internalId/standardId và createdAt được triển khai cùng release. Cửa sổ hiện tại tối đa 100 mặc định, 300 khi yêu cầu; không tuyên bố hiển thị toàn bộ lịch sử vô hạn.
- Khôi phục cạnh tranh: chỉ retry có giới hạn khi lỗi quyền kèm bằng chứng hồ sơ trên máy chủ thay đổi so với phiên bản transaction vừa đọc. Quyền không thay đổi, không bypass Rules. Emulator kiểm tra cả cạnh tranh và hai thứ tự commit tường minh.
- Khi Firestore báo quota, các lượt đếm kế tiếp/gửi thông báo tạm dừng trong một phút để tránh gọi lặp. Xuất báo cáo báo rõ hạn mức; không thay thế kiểm tra phân quyền. API sao lưu làm mới token đúng một lần nếu trả 401.
- Release frontend theo Git Integration + Deployment Check trong DEPLOYMENT.md. Không chạy Google Drive Pack, backfill hoặc thu hồi dữ liệu vận hành trong quá trình phát hành code.
