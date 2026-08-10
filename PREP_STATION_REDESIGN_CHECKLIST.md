# Kế hoạch redesign Trạm Pha Chế thành helper mô phỏng

> Route: prep
> Trạng thái: đã triển khai core implementation; runtime authenticated smoke còn chờ tài khoản KNV.
> Quyết định nghiệp vụ: Trạm Pha Chế không thuộc nghiệp vụ kho hóa chất hoặc chất chuẩn; chỉ giúp KNV mô phỏng quá trình pha chế và tính toán.

## 1. Boundary bắt buộc

### Được phép

- Nhập thông số thủ công và tính toán live.
- Mô phỏng pha dung dịch, pha loãng, thêm chuẩn, dãy chuẩn, pha hỗn hợp và xử lý mẫu.
- Hiển thị công thức, giá trị chuẩn hóa đơn vị, kết quả trung gian và cảnh báo.
- Thêm/xóa dòng mô phỏng trong một phiên làm việc.
- Dán dữ liệu bảng từ clipboard nếu dữ liệu do KNV cung cấp.
- Sao chép, in hoặc tải xuống phiếu kết quả mô phỏng ở phía trình duyệt.
- Reset draft cục bộ.

### Tuyệt đối không được làm

- Không đọc collection inventory.
- Không tìm hoặc chọn hóa chất từ inventory.
- Không đọc, chọn, mượn, tiêu hao hoặc cập nhật chất chuẩn/reference standard.
- Không kiểm tra tồn kho, không hiển thị stock status, không tạo stock impact.
- Không có mode Dùng tồn kho thực.
- Không có nút Xác nhận & Trừ kho, Hoàn trả kho hoặc tương đương.
- Không gọi InventoryService, FirebaseService, updateStock(), getInventoryPage() hoặc standard services.
- Không ghi inventory history, usage log, request, global audit log hoặc Firestore document.
- Không yêu cầu inventory_edit, batch_run hoặc standard_* để tính.
- Không dùng Recipe Library/standard library làm nguồn input ẩn.
- Không map tên chất mô phỏng sang inventory id hoặc reference-standard id.

Route vẫn nằm trong auth shell chung của ứng dụng nếu ứng dụng yêu cầu đăng nhập, nhưng quyền dùng helper không được suy ra từ quyền kho/chất chuẩn. KNV đăng nhập được phép mô phỏng; không có nhánh execution ghi dữ liệu.

## 2. Flow sản phẩm mới

1. Chọn mục tiêu mô phỏng.
2. Nhập bối cảnh và thông số bằng tay.
3. Tính live bằng calculation engine thuần.
4. Review kết quả, trace và warnings.
5. Copy, print hoặc export local.

Không có bước chọn nguồn kho, review tồn, confirm transaction, commit hay post-commit.

### Desktop

- Task rail: nhóm helper và mô tả ngắn.
- Work area: chỉ hiện input liên quan tới helper đang chọn.
- Result rail: kết quả chính, formula trace, warnings và action local.
- Header phải có badge: Helper mô phỏng — không kết nối kho.
- Bỏ hoàn toàn toggle sandbox/real.

### Mobile

- Stepper: 1 Tác vụ → 2 Thông số → 3 Kết quả.
- Result/action bar chỉ có copy, print, export, reset.
- Dãy chuẩn và hỗn hợp dùng card hoặc horizontal scroll có label đầy đủ.
- Không dùng hover-only tooltip.

## 3. Sáu flow và công thức

### A. Pha dung dịch từ chất rắn

Input: tên chất mô phỏng, khối lượng + unit, purity, thể tích định mức + unit, MW tùy chọn.

    mass_active_g = mass_g × purity / 100
    mass_concentration_g_per_L = mass_active_g / volume_L
    amount_mol = mass_active_g / MW
    molar_concentration_M = amount_mol / volume_L

Nếu thiếu MW, chỉ trả mass concentration; không gắn nhãn M và không suy đoán MW từ tên chất.

### B. Pha loãng

Input: stock concentration, target concentration, basis/unit, final volume và tên mô phỏng.

    V_stock = C_target × V_final / C_stock
    V_solvent = V_final - V_stock

Engine tính toàn bộ volume bằng canonical mL. Presenter mới được đổi 0.1 mL thành 100 µL.

Blocking: C_stock, C_target, V_final dương; target không lớn hơn stock; V_stock không lớn hơn V_final; solvent âm là invalid, không clamp về 0.

### C. Thêm chuẩn

Giai đoạn đầu dùng semantic rõ ràng: nồng độ thêm vào trên nền mẫu theo thể tích.

    V_spike = C_added × V_sample / C_stock

Nếu nền mẫu nhập theo mass, bắt buộc density. Cấm giả định 1 g = 1 mL. Nếu sau này cần semantic nồng độ cuối, phải tạo flow/option riêng với C_initial và C_final.

### D. Dãy chuẩn

Mặc định mỗi điểm hút độc lập từ stock gốc:

    V_stock_i = C_i × V_point / C_stock
    V_solvent_i = V_point - V_stock_i
    total_stock = sum(V_stock_i)

Tất cả giá trị nội bộ là mL; không cộng các số đã format lẫn mL và µL. Target không âm và không vượt stock. Carry-forward phải là flow riêng.

### E. Pha hỗn hợp

Mỗi row chỉ là dữ liệu mô phỏng local: tên thành phần, stock concentration + unit/basis, target concentration + unit/basis, MW/density nếu cần.

    V_i = C_target_i × V_final / C_stock_i
    V_solvent = V_final - sum(V_i)

Không hard-code stock là ppm. Tổng thành phần lớn hơn final volume là invalid. Row thiếu input là incomplete/invalid. Clipboard chỉ tạo row local, không lookup inventory.

### F. Xử lý mẫu

Stage model:

| Stage | Ký hiệu | Unit chuẩn |
|---|---|---|
| Mẫu ban đầu | m | g |
| Dịch chiết | V_extract | mL |
| Aliquot | V_aliquot | mL |
| Định mức cuối | V_final | mL |
| Hiệu suất | recovery | % |
| Kết quả máy | C_instrument | basis/unit do KNV chọn |

Formula đề xuất:

    factor = (V_extract × V_final) / (m × V_aliquot)
    C_sample = C_instrument × factor × (100 / recovery)

V2/cleanupAliquot hiện chỉ làm guard:

    0 < V_aliquot <= V2 <= V_extract

Không đưa V2 thêm lần nữa vào factor nếu chưa có method-specific rule. Recovery mặc định trong (0, 100].

## 4. Calculation engine

### File dự kiến

- src/app/features/preparation/prep-domain.types.ts
- src/app/features/preparation/prep-calculation.engine.ts
- src/app/features/preparation/prep-calculation.engine.test.ts

Unit catalog hiện được giữ private trong calculation engine vì chỉ route prep sử dụng.

Không tạo prep-inventory.service và không mở rộng InventoryService cho route này.

SmartPrepComponent chỉ giữ draft signals, chọn mode, gọi engine và thực hiện clipboard/print local. Không inject InventoryService, FirebaseService, AuthService cho quyền kho, ConfirmationService hoặc standard services.

### Domain contract

    type QuantityDimension = 'mass' | 'volume' | 'amount' | 'count';
    type ConcentrationBasis =
      | 'molar'
      | 'mass_per_volume'
      | 'mass_fraction'
      | 'mass_per_mass';

    interface Quantity {
      value: number;
      unit: string;
      dimension: QuantityDimension;
    }

    interface Concentration {
      value: number;
      unit: string;
      basis: ConcentrationBasis;
      molecularWeight?: number;
      density?: number;
    }

    interface CalculationIssue {
      code: string;
      severity: 'error' | 'warning';
      path: string;
      message: string;
    }

    interface PrepCalculationResult<TOutput> {
      status: 'incomplete' | 'invalid' | 'valid';
      output: TOutput | null;
      issues: CalculationIssue[];
      normalizedInputs: Record<string, Quantity | Concentration | number>;
      trace: CalculationTraceStep[];
    }

Result contract không có consumptionLines, inventoryItemId, stockAfter hay transaction metadata.

### Unit rules

- Mass/volume dùng dimension catalog chung với UNIT_DATA/getStandardizedAmount().
- Khác dimension phải trả conversion error.
- Molar ↔ molar dùng M/mM/µM.
- Mass/volume ↔ mass/volume dùng g/L, mg/mL, mg/L; ppm/ppb chỉ dùng khi basis đã công bố.
- Molar ↔ mass/volume bắt buộc MW.
- Mass fraction/% ↔ mass/volume bắt buộc density và phải hiển thị assumption.
- Không dùng một factor chung cho M, %, ppm và mg/mL.
- Không fallback g → mL, kg → L hoặc quantity → mass.
- Rounding chỉ ở presenter; engine giữ canonical value.
- Input thiếu, NaN, Infinity, số âm hoặc zero denominator trả incomplete/invalid, không trả valid zero.

## 5. Những gì phải loại khỏi code hiện tại

### smart-prep.component.ts

- [x] Xóa InventoryService, AuthService dùng cho quyền kho và ConfirmationService.
- [x] Xóa systemMode sandbox/real.
- [x] Xóa searchTerm, searchSubject, searchResults, isSearching.
- [x] Xóa selectedItem, activeMixSearchIndex, invItem trong MixRow.
- [x] Xóa chemical search, selectGlobalItem, clearSelection, onSearch, onSearchMix, selectMixItem.
- [x] Xóa normalizeToStockUnit riêng của prep.
- [x] Xóa stockPercentage, mixStockStatus, canFulfill.
- [x] Xóa confirmTransaction và mọi updateStock.
- [x] Giữ clipboard import nếu chỉ tạo local rows.
- [x] Giữ print/copy nếu chỉ xuất snapshot mô phỏng.

### smart-prep.component.html

- [x] Xóa toggle Tính thử / Dùng tồn kho.
- [x] Xóa chemical selector và inventory dropdown.
- [x] Xóa stock status/progress/Đủ hàng/Thiếu hàng.
- [x] Xóa footer Xác nhận & Trừ kho.
- [x] Đổi In Nhãn thành In phiếu mô phỏng hoặc Xuất kết quả.
- [x] Không dùng text tồn kho, trừ kho, chất chuẩn đang dùng.
- [x] Tách rõ input mass và volume.
- [x] Hiển thị badge Helper mô phỏng — không kết nối kho.

### File liên quan

- [x] Cập nhật comment trong auth.service.ts nếu còn mô tả Trạm Pha Chế là thao tác tiêu hao kho; batch_run chỉ còn mô tả đúng Smart Batch.
- [x] Giữ route prep không gắn inventory/standard permission guard.
- [x] Không thêm collection hoặc rule Firestore cho prep.
- [x] Không sửa inventory rules để phục vụ prep.
- [x] Không nối prep vào standard usage/request, recipe library hoặc stock history.

## 6. Verification và test

### Engine unit tests

- [x] 10 mg NaCl, MW 58.44, 10 mL, purity 100% → khoảng 0.01711 M.
- [x] Molar thiếu MW → mass concentration, không gắn nhãn M.
- [x] 1000 ppm → 10 ppm, final 10 mL → 100 µL stock và 9.9 mL solvent.
- [x] Target dilution > stock → invalid.
- [x] Serial [1, 10, 100] ppm từ 1000 ppm, 10 mL/điểm → total 1.11 mL.
- [ ] Serial mixed display units → total canonical vẫn đúng.
- [x] Mix stock unit khác ppm → dùng đúng unit.
- [x] Mix tổng component > final → invalid.
- [ ] Mass ↔ volume thiếu density → conversion error.
- [x] Spiking hiện nhận sample volume rõ ràng; không có fallback ngầm từ mass sang volume.
- [x] Sample prep kiểm tra V2/V3 và recovery 80%.
- [ ] NaN, Infinity, negative, zero denominator, empty list → incomplete/invalid (NaN/Infinity chưa có golden assertion riêng).

### Boundary tests

- [x] Static test đảm bảo component không import InventoryService, FirebaseService hoặc standard services.
- [x] Không còn updateStock, getInventoryPage, canEditInventory, inventoryItemId, stockAfter, confirmTransaction.
- [x] Template không còn Dùng tồn kho, Trừ kho, tồn kho, Đủ hàng, Thiếu hàng.
- [ ] Component test chứng minh input chỉ cập nhật local draft/result.
- [ ] Clipboard/print test chứng minh không tạo Firebase call.
- [ ] Không cần Firestore emulator test cho calculation; inventory/security tests hiện hữu vẫn chạy độc lập cho module khác.

### Runtime acceptance

- [ ] KNV đăng nhập mở route prep không cần inventory_edit hoặc standard permission.
- [ ] Mở route không phát sinh inventory/standard read.
- [ ] Sáu helper không tạo side effect.
- [ ] Không xuất hiện stock/status/permission UI.
- [ ] Desktop 1280px, tablet 768px, mobile 390px/360px/320px.
- [ ] Light/dark, keyboard-only, focus-visible, reduced-motion.
- [ ] Copy/print chỉ chứa input/result snapshot của phiên mô phỏng.

## 7. Phases

### Phase 0 — Formula contract

- [x] Boundary loại bỏ hoàn toàn inventory/standard business đã được xác nhận.
- [x] Chốt semantic spiking; mặc định là nồng độ thêm vào trên nền thể tích mẫu.
- [x] Chốt basis của %, ppm, ppb trong UI: % w/w, ppm mg/L, ppb µg/L; mg/kg là w/w.
- [x] Chốt V2 trong sample prep là guard; V3/V4 mới đi vào factor hiện tại.
- [x] Chốt serial mặc định độc lập từ stock gốc.
- [x] Chốt recovery mặc định dùng 100 / recovery.

### Phase 1 — Pure engine

- [x] Tạo domain types/unit catalog.
- [x] Implement sáu calculator thuần.
- [x] Trả status/issues/output/trace, không có stock/transaction fields.
- [x] Viết golden cases và edge cases.
- [x] Không gọi Angular/Firebase/Toast/Router trong engine.

### Phase 2 — Component adapter

- [x] Loại bỏ dependency inventory/standard khỏi component.
- [x] Chuyển state thành typed local draft.
- [x] Tách input theo dimension/basis.
- [x] Thêm incomplete/invalid state.
- [x] Giữ clipboard import local.

### Phase 3 — UI

- [x] Dựng task rail, stepper và result rail.
- [x] Dựng input cards theo từng helper.
- [x] Dựng calculation trace và warnings.
- [x] Dựng copy/print/export local.
- [x] Bổ sung responsive/a11y/dark mode.

### Phase 4 — Release

- [x] Chạy targeted engine tests, boundary tests, Angular typecheck và production build.
- [x] Chạy lint, ghi rõ lỗi có sẵn nếu có (targeted prep/auth lint pass; full lint còn 4 lỗi ngoài scope ở smart-batch-firestore-rules.emulator.test.ts và standards-form-modal.component.ts).
- [ ] Runtime authenticated smoke route prep (local route hiện dừng ở login shell, chưa có credential KNV trong phiên).
- [ ] Kiểm tra read monitor/network không có inventory/standard read.
- [x] Ghi release note: đây là helper mô phỏng, không phải nghiệp vụ kho.

## 8. Acceptance criteria

- [x] Trạm Pha Chế chỉ có một mode: helper mô phỏng.
- [x] Không có code path đọc/ghi inventory hoặc standard.
- [x] Không có dependency InventoryService/FirebaseService/standard service trong route prep.
- [x] Không có quyền inventory_edit, batch_run hoặc standard_* trong flow prep.
- [x] Không có transaction, stock history, usage log, audit log hoặc print job nghiệp vụ từ prep.
- [x] Sáu flow dùng calculation engine typed và pure.
- [x] Không có conversion fallback khác dimension.
- [x] Không có kết quả 0 giả cho input incomplete/invalid.
- [x] Dãy chuẩn tính tổng bằng canonical volume.
- [x] Pha hỗn hợp yêu cầu stock unit/basis rõ ràng nhưng chỉ là input mô phỏng.
- [x] Spiking không giả định 1 g = 1 mL.
- [x] Sample prep hiển thị rõ factor, unit, recovery và cảnh báo stage.
- [x] Copy/print/export chỉ là output local.
- [ ] Runtime chứng minh không có inventory/standard read/write.

## 9. Working tree

- [x] Đã kiểm tra git status trước khi lập plan.
- [x] Đã dừng và khôi phục bản template/code redesign UI dang dở.
- [x] Khi implementation bắt đầu, chỉ sửa route prep, engine thuần, tests và tài liệu liên quan.
- [x] Không reset/ghi đè các thay đổi Firebase, standards, dashboard, labels, requests hoặc results đang có.
- [x] Sau mỗi phase: chạy targeted verification rồi mới check mục tương ứng.
