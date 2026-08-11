# Đặc tả nghiệp vụ Trạm Pha Chế cho kiểm nghiệm viên

> Route: `prep`
> Trạng thái: đặc tả nghiệp vụ đã được xác nhận ở mức định hướng; đã có triển khai cục bộ theo checklist, chưa phải nghiệm thu KNV
> Ngày xác nhận: 2026-08-11
> Tài liệu nguồn: trao đổi trực tiếp với người phụ trách nghiệp vụ
> Quan hệ tài liệu: tài liệu này thay thế mô hình sáu mode và các giả định công thức trong `PREP_STATION_REDESIGN_CHECKLIST.md`; ranh giới loại bỏ Kho và mọi giao dịch tồn vẫn được giữ nguyên.

## 1. Mục tiêu nghiệp vụ

Trạm Pha Chế là công cụ tính toán tại chỗ cho kiểm nghiệm viên (KNV), được tổ chức theo câu hỏi thực tế trong quá trình pha chuẩn, pha dung dịch, thêm chuẩn và chuẩn bị dãy hiệu chuẩn.

Trạm phải giúp KNV trả lời được tối thiểu các câu hỏi sau:

1. Dung dịch vừa pha thực tế đạt nồng độ bao nhiêu ppm, mg/L, mg/mL, \(C_M\), mM, µM hoặc phần trăm?
2. Cần cân bao nhiêu chất hoặc hút bao nhiêu dung dịch nguồn để pha dung dịch đích?
3. Cần hút bao nhiêu dung dịch chuẩn để thêm vào mẫu rắn hoặc mẫu lỏng ở mức spike yêu cầu?
4. Cần pha các dung dịch trung gian và từng điểm chuẩn theo thứ tự nào?
5. Cần thêm bao nhiêu nội chuẩn hoặc surrogate vào từng chuẩn, mẫu trắng, QC và mẫu thử?
6. Sau các bước chiết, lấy aliquot, cô, hoàn nguyên và pha loãng, kết quả máy được quy đổi về mẫu ban đầu như thế nào?

Kết quả không chỉ là một con số. Trạm phải cung cấp:

- Đại lượng cần lấy bằng đơn vị thao tác phù hợp, ví dụ µL, mL, mg hoặc g.
- Nồng độ đích hoặc nồng độ thực tế đạt được, kèm cơ sở nồng độ.
- Công thức, phép thế số và giả định đã sử dụng.
- Hướng dẫn thao tác ngắn gọn theo ngôn ngữ phòng kiểm nghiệm.
- Cảnh báo khi kế hoạch pha không khả thi hoặc có rủi ro nhầm đơn vị.

## 2. Các quyết định nghiệp vụ đã chốt

- [x] Hỗ trợ cả mẫu rắn theo khối lượng và mẫu lỏng theo thể tích.
- [x] Hỗ trợ nhiều chiến lược pha dãy chuẩn.
- [x] Trường hợp thường gặp là pha điểm chuẩn từ nhiều dung dịch chuẩn trung gian, không mặc định mọi điểm đều lấy từ một stock duy nhất.
- [x] Hỗ trợ nội chuẩn và surrogate.
- [x] Thông tin chất, chuẩn, độ tinh khiết, potency, phân tử lượng, khối lượng riêng và nồng độ nguồn được KNV nhập tay.
- [x] Không phụ thuộc dữ liệu độ tinh khiết trong danh mục Chất chuẩn vì dữ liệu hiện tại chưa đầy đủ.
- [x] Tiếp tục loại bỏ toàn bộ nghiệp vụ Kho khỏi Trạm Pha Chế.
- [x] Không khôi phục nguyên trạng phiên bản cũ vì phiên bản đó có liên kết Kho và một số giả định công thức không đủ an toàn.
- [x] Không coi sáu mode kỹ thuật hiện tại là đặc tả nghiệp vụ đã được chấp nhận.
- [x] Danh mục pipet hiện có: 2–20, 10–100, 20–200, 100–1.000, 500–5.000 và 1.000–10.000 µL.
- [x] Danh mục bình định mức hiện có: 2, 5, 10, 20, 50, 100 và 1.000 mL.
- [x] Cân có độ đọc 0,01 mg (`0.00 mg`). Độ đọc này chưa được xem là khối lượng cân tối thiểu cho đến khi có tiêu chí SOP/độ không đảm bảo tương ứng.

## 3. Ranh giới hệ thống bắt buộc

### 3.1. Được phép

- KNV nhập tay toàn bộ thông tin nguồn và thông số phép pha.
- Tính toán trực tiếp trong phiên làm việc hiện tại.
- Thêm, sửa, xóa các dung dịch nguồn, dung dịch trung gian, điểm chuẩn, nội chuẩn và surrogate trong bản nháp cục bộ.
- Sao chép hoặc dán bảng dữ liệu do KNV tự chuẩn bị.
- Hiển thị công thức, phép thế số, kết quả trung gian, cảnh báo và hướng dẫn thao tác.
- Sao chép, in hoặc xuất phiếu tính cục bộ nếu không tạo giao dịch nghiệp vụ.
- Cho phép KNV nhập thể tích hoặc khối lượng thực tế đã thao tác để tính lại nồng độ thực tế.

### 3.2. Không được phép

- Không đọc tồn kho hóa chất.
- Không tìm kiếm hoặc chọn nguồn từ Kho.
- Không kiểm tra đủ hoặc thiếu tồn.
- Không trừ kho, hoàn kho hoặc điều chỉnh tồn.
- Không tạo lịch sử kho, phiếu sử dụng, yêu cầu cấp chuẩn hoặc giao dịch chất chuẩn.
- Không tự đọc độ tinh khiết, potency, nồng độ hay thông tin chứng nhận từ danh mục Chất chuẩn.
- Không tự suy đoán thông số hóa học từ tên chất.
- Không ghi Firestore hoặc tạo audit log nghiệp vụ từ thao tác tính toán.
- Không yêu cầu quyền `inventory_edit`, `standard_*` hoặc quyền nghiệp vụ kho để sử dụng Trạm.

## 4. Nguyên tắc thiết kế nghiệp vụ

### 4.1. Tổ chức theo mục tiêu của KNV

Màn hình đầu tiên phải hỏi “Bạn cần tính gì?”, không yêu cầu KNV tự chọn công thức toán học.

Năm nhóm nghiệp vụ cấp cao:

1. **Tính nồng độ dung dịch đã pha**.
2. **Tính lượng cần lấy để pha dung dịch đích**.
3. **Tính thể tích chuẩn cần thêm vào mẫu**.
4. **Lập dãy chuẩn, QC và hỗn hợp chuẩn**.
5. **Quy đổi kết quả qua các bước xử lý mẫu**.

### 4.2. Đại lượng cần tìm phải được công bố

Trong cùng một quan hệ pha loãng, KNV có thể cần tìm các đại lượng khác nhau. Form phải cho biết rõ đại lượng nào là input và đại lượng nào là kết quả.

Ví dụ với \(C_1V_1=C_2V_2\):

- Biết \(C_1, C_2, V_2\), tìm \(V_1\).
- Biết \(C_1, V_1, V_2\), tìm nồng độ thực tế \(C_2\).
- Biết \(C_1, V_1, C_2\), tìm thể tích định mức \(V_2\).
- Biết nồng độ trước và sau, tính hệ số pha loãng.

### 4.3. Phân biệt kế hoạch và số liệu thực tế

Mỗi phép pha nên có hai lớp số liệu:

- **Kế hoạch**: lượng dự kiến cần cân hoặc hút.
- **Thực tế**: lượng KNV thực sự đã cân hoặc hút.

Khi có số liệu thực tế, Trạm phải tính nồng độ thực tế đạt được và chỉ rõ độ lệch so với mục tiêu. Không được tiếp tục hiển thị nồng độ kế hoạch như thể đó là kết quả thực tế.

### 4.4. Kết quả phải chuyển thành chỉ dẫn thao tác

Ví dụ đúng:

> Hút 100 µL dung dịch chuẩn trung gian 1.000 ppm vào bình định mức 10 mL; thêm dung môi và định mức đến vạch. Nồng độ kế hoạch: 10,0 ppm.

Không mặc định ghi:

> Thêm 9,9 mL dung môi.

Trong phép pha bằng bình định mức, “định mức đến vạch” là hướng dẫn đúng hơn phép trừ thể tích thuần túy.

## 5. Nghiệp vụ A — Tính nồng độ dung dịch đã pha

### 5.1. Câu hỏi nghiệp vụ

> Từ lượng chất hoặc dung dịch đã lấy thực tế và thể tích định mức, dung dịch thu được có nồng độ bao nhiêu?

### 5.2. Loại nguồn

- Chất rắn hoặc chất chuẩn rắn.
- Dung dịch chuẩn gốc hoặc dung dịch trung gian.
- Hóa chất lỏng đậm đặc có nồng độ phần trăm.
- Chất lỏng tinh khiết cần dùng khối lượng riêng.

### 5.3. Pha từ chất rắn

Input bắt buộc:

- Tên chất do KNV nhập.
- Khối lượng cân thực tế và đơn vị.
- Potency/độ tinh khiết theo phần trăm; mặc định hiển thị 100% nhưng KNV phải nhìn thấy và có thể sửa.
- Thể tích định mức và đơn vị.

Input điều kiện:

- Phân tử lượng nếu cần kết quả \(C_M\), mM hoặc µM.
- Hệ số quy đổi dạng muối, hydrate hoặc quy đổi về hoạt chất nếu phương pháp yêu cầu.

Công thức cơ sở:

```text
m_active = m_weighed × potency / 100 × conversion_factor
C_mass_per_volume = m_active / V_final
C_M = (m_active / molecular_weight) / V_final_L
```

Output:

- Khối lượng hoạt chất thực tế.
- g/L, mg/mL, mg/L và ppm theo cơ sở khối lượng/thể tích.
- `% w/v` nếu KNV yêu cầu.
- \(C_M\), mM và µM khi có phân tử lượng.
- Sai lệch so với nồng độ mục tiêu nếu KNV đã nhập mục tiêu.

### 5.4. Pha từ chất lỏng hoặc hóa chất đậm đặc

Phải chọn rõ cơ sở nồng độ nguồn:

- `% w/w`.
- `% w/v`.
- `% v/v`.
- mol/L.
- g/L, mg/mL hoặc mg/L.

Yêu cầu thêm khối lượng riêng khi phép đổi đơn vị đi qua quan hệ khối lượng ↔ thể tích. Không mặc định khối lượng riêng bằng 1 g/mL.

### 5.5. Ví dụ chuẩn nghiệm thu

Input:

- Khối lượng cân: 10,2 mg.
- Potency: 98,5%.
- Thể tích định mức: 10 mL.

Kết quả mong đợi:

```text
m_active = 10.047 mg
C = 1004.7 mg/L
C = 1.0047 mg/mL
C = 0.10047 % w/v
```

Không xuất kết quả molar nếu chưa nhập phân tử lượng.

## 6. Nghiệp vụ B — Tính lượng cần lấy để pha dung dịch đích

### 6.1. Các biến thể

#### B1. Từ chất rắn

> Cần cân bao nhiêu chất để pha thể tích và nồng độ đích đã chọn?

```text
m_active = C_target × V_final
m_weighed = m_active / (potency / 100 × conversion_factor)
```

Nếu nồng độ đích là mol/L:

```text
m_active = C_M × molecular_weight × V_final_L
```

#### B2. Từ dung dịch nguồn

> Cần hút bao nhiêu dung dịch nguồn để pha dung dịch đích?

```text
C_source × V_source = C_target × V_final
V_source = C_target × V_final / C_source
```

Kết quả thao tác:

- Thể tích cần hút bằng µL hoặc mL.
- Dụng cụ phù hợp nếu đã cấu hình dải pipet/bình định mức.
- Hướng dẫn “định mức đến” thể tích cuối.
- Nồng độ thực tế nếu KNV nhập lại thể tích đã hút.

#### B3. Từ hóa chất đậm đặc

Phải xét đúng `% w/w`, `% w/v` hoặc `% v/v`, khối lượng riêng và phân tử lượng khi cần. Không dùng một hệ số chung cho phần trăm, molar và ppm.

### 6.2. Ví dụ chuẩn nghiệm thu

Input:

- Dung dịch nguồn: 1.000 ppm.
- Dung dịch đích: 10 ppm.
- Thể tích định mức: 10 mL.

Kết quả:

```text
V_source = 0.100 mL = 100 µL
```

Hướng dẫn:

> Hút 100 µL dung dịch nguồn vào bình định mức 10 mL; thêm dung môi và định mức đến vạch.

Nếu thể tích thực tế là 98 µL, nồng độ thực tế phải được tính lại:

```text
C_actual = 1000 × 0.098 / 10 = 9.8 ppm
```

## 7. Nghiệp vụ C — Tính thể tích chuẩn cần thêm vào mẫu

### 7.1. Câu hỏi nghiệp vụ

> Với lượng mẫu đã lấy và mức spike yêu cầu, cần hút bao nhiêu dung dịch chuẩn?

Trạm phải bắt buộc chọn vị trí thêm chuẩn:

- Mẫu ban đầu trước xử lý.
- Dịch chiết.
- Sau làm sạch.
- Vial hoặc dung dịch cuối.

Trạm phải bắt buộc chọn nền tính:

- Mẫu rắn theo khối lượng.
- Mẫu lỏng theo thể tích.
- Dung dịch/dịch chiết theo thể tích cuối.

### 7.2. Spike vào mẫu rắn

Input:

- Khối lượng mẫu và đơn vị.
- Mức spike, ví dụ mg/kg hoặc µg/kg.
- Nồng độ dung dịch chuẩn, ví dụ mg/L, µg/mL hoặc ppm theo cơ sở đã công bố.
- Nồng độ nền hiện có, nếu mục tiêu là nồng độ tổng sau spike.

Công thức khi mức nhập là lượng tăng thêm trên mẫu ban đầu:

```text
m_added = C_spike_target × m_sample
V_spike = m_added / C_standard
```

Ví dụ:

- Mẫu: 5 g.
- Mức spike: 0,05 mg/kg.
- Chuẩn: 10 mg/L.

```text
m_added = 0.05 mg/kg × 0.005 kg = 0.00025 mg
C_standard = 0.01 mg/mL
V_spike = 0.00025 / 0.01 = 0.025 mL = 25 µL
```

Hướng dẫn:

> Hút 25 µL dung dịch chuẩn 10 mg/L, thêm vào 5,000 g mẫu để tạo mức thêm 0,050 mg/kg.

### 7.3. Spike vào mẫu lỏng

Phải cho KNV chọn cách hiểu nồng độ đích.

#### Cách 1 — Mức thêm tính trên thể tích mẫu ban đầu

```text
V_spike = C_added × V_sample / C_standard
```

#### Cách 2 — Nồng độ đích tính trên thể tích cuối sau khi thêm chuẩn

Nếu bỏ qua nồng độ nền:

```text
C_standard × V_spike = C_target × (V_sample + V_spike)
V_spike = C_target × V_sample / (C_standard - C_target)
```

Nếu có nồng độ nền:

```text
C_initial × V_sample + C_standard × V_spike
  = C_final × (V_sample + V_spike)
```

Không được âm thầm chọn một trong hai cách hiểu.

### 7.4. Spike vào dịch chiết hoặc vial cuối

Form phải dùng thể tích tại đúng công đoạn làm cơ sở. Kết quả phải nêu rõ spike được thêm trước hay sau chiết vì hai thao tác phục vụ mục đích QC khác nhau.

### 7.5. Nội chuẩn và surrogate

Phải hỗ trợ:

- Một hoặc nhiều nội chuẩn.
- Một hoặc nhiều surrogate.
- Mức thêm cố định theo thể tích hoặc theo nồng độ cuối.
- Áp dụng cho toàn bộ điểm chuẩn, blank, QC và mẫu thử hoặc chỉ các nhóm được chọn.
- Ngoại lệ cho solvent blank, reagent blank hoặc mẫu không thêm nội chuẩn nếu phương pháp quy định.

Kết quả phải tạo được danh sách thao tác theo từng đối tượng, không chỉ tính tổng thể tích nội chuẩn.

## 8. Nghiệp vụ D — Lập dãy chuẩn, QC và hỗn hợp chuẩn

### 8.1. Mô hình nguồn nhiều cấp

Một kế hoạch pha có thể có cây nguồn:

```text
Chuẩn gốc đơn
  → Chuẩn trung gian đơn
  → Chuẩn trung gian hỗn hợp
  → Chuẩn làm việc
  → Điểm đường chuẩn / QC / spike
```

Mỗi dung dịch nguồn hoặc trung gian phải có:

- Mã/tên do KNV nhập.
- Nồng độ và cơ sở nồng độ.
- Thể tích dự kiến pha.
- Dung dịch nguồn trực tiếp.
- Thể tích lấy từ nguồn.
- Nội chuẩn/surrogate đi kèm, nếu có.

### 8.2. Các chiến lược phải hỗ trợ

#### D1. Mỗi điểm pha trực tiếp từ một nguồn

Mỗi điểm có thể chọn nguồn khác nhau. Đây là trường hợp quan trọng khi điểm thấp lấy từ chuẩn trung gian thấp và điểm cao lấy từ chuẩn trung gian cao.

#### D2. Nhiều điểm dùng nhiều chuẩn trung gian

Ví dụ:

- 1–5 ppb lấy từ chuẩn trung gian A.
- 10–50 ppb lấy từ chuẩn trung gian B.
- 100 ppb lấy từ chuẩn trung gian C.

Trạm phải cho phép KNV chọn nguồn riêng trên từng dòng hoặc tự đề xuất nguồn phù hợp theo dải hút khả thi.

#### D3. Pha loãng nối tiếp

Điểm sau được pha từ điểm trước. Kết quả phải chỉ rõ thứ tự bắt buộc và nguồn của từng bước. Không được gọi phép pha độc lập từ cùng một stock là “pha loãng nối tiếp”.

#### D4. Hỗn hợp nhiều chất

Mỗi thành phần có nồng độ nguồn và nồng độ đích riêng. Công thức:

```text
V_i = C_target_i × V_final / C_source_i
```

Tổng thể tích các thành phần phải nhỏ hơn thể tích định mức. Hướng dẫn cuối là định mức đến vạch, không mặc định cộng chính xác một thể tích dung môi bằng phép trừ.

### 8.3. Nội chuẩn và surrogate trong dãy

Cho phép hai cách nhập:

- Nhập thể tích cố định cần thêm vào mỗi bình/vial.
- Nhập nồng độ đích và để Trạm tính thể tích từ dung dịch nội chuẩn.

Trạm phải tính:

- Thể tích thêm trên từng điểm.
- Tổng thể tích tối thiểu cần chuẩn bị, có tùy chọn phần dư do KNV nhập.
- Nồng độ thực tế sau khi tính cả thể tích nội chuẩn nếu phương pháp yêu cầu xét thể tích cuối.

### 8.4. Output bắt buộc

- Bảng từng dung dịch trung gian.
- Bảng từng điểm chuẩn/QC.
- Nguồn trực tiếp của từng điểm.
- Thể tích nguồn cần hút.
- Nội chuẩn/surrogate cần thêm.
- Bình/vial và thể tích định mức.
- Thứ tự pha.
- Tổng nhu cầu của từng dung dịch nguồn để KNV chủ động pha đủ; đây chỉ là tổng tính toán, không phải tồn kho.
- Cảnh báo các bước có thể gây tích lũy sai số.

## 9. Nghiệp vụ E — Quy đổi kết quả qua xử lý mẫu

### 9.1. Không dùng một công thức V1–V4 cố định

Mỗi SOP có thể có chuỗi xử lý khác nhau. Trạm phải mô hình hóa các bước thay vì áp một công thức chung.

Các loại bước tối thiểu:

- Cân hoặc lấy thể tích mẫu ban đầu.
- Chiết hoặc định mức thành một thể tích.
- Lấy aliquot.
- Chuyển toàn lượng.
- Pha loãng.
- Cô đặc.
- Hoàn nguyên.
- Chia dòng hoặc chỉ lấy một phần.
- Điều chỉnh theo recovery khi phương pháp cho phép.

### 9.2. Output

- Hệ số quy đổi tổng.
- Hệ số của từng bước.
- Nồng độ tại từng công đoạn.
- Kết quả trên mẫu ban đầu theo mg/kg, µg/kg, mg/L hoặc đơn vị được chọn.
- Công thức truy vết từ kết quả máy về mẫu ban đầu.

### 9.3. Ranh giới triển khai

Nghiệp vụ E chỉ được triển khai sau khi đã có mô hình chuỗi bước và bộ ca kiểm thử đại diện cho các SOP thực tế. Không giữ công thức generic hiện tại chỉ để duy trì đủ số lượng mode.

## 10. Mô hình đơn vị và cơ sở nồng độ

### 10.1. Dimension

- Khối lượng: kg, g, mg, µg, ng.
- Thể tích: L, mL, µL.
- Số mol: mol, mmol, µmol.

### 10.2. Concentration basis

- Molar: mol/L, mmol/L, µmol/L.
- Khối lượng/thể tích: g/L, mg/mL, mg/L, µg/mL, µg/L.
- Khối lượng/khối lượng: g/kg, mg/kg, µg/kg.
- Thể tích/thể tích: mL/L, µL/mL và `% v/v`.
- Phần khối lượng: `% w/w`.
- Khối lượng/thể tích theo phần trăm: `% w/v`.

### 10.3. Quy tắc cho ppm và ppb

Không dùng `ppm` hoặc `ppb` đơn lẻ trong calculation engine. UI phải lưu cả giá trị hiển thị và cơ sở:

- `ppm (mg/L)`.
- `ppm (mg/kg)`.
- `ppb (µg/L)`.
- `ppb (µg/kg)`.

### 10.4. Điều kiện chuyển đổi

- Molar ↔ mass/volume bắt buộc có phân tử lượng.
- `% w/w` ↔ mass/volume bắt buộc có khối lượng riêng.
- Mass/mass ↔ mass/volume bắt buộc có cơ sở mẫu hoặc khối lượng riêng phù hợp.
- Không mặc định 1 g = 1 mL.
- Không mặc định ppm luôn bằng mg/L.
- Không mặc định `%` là `% w/w` hay `% w/v`.
- Chỉ làm tròn ở lớp hiển thị; engine giữ giá trị canonical chưa làm tròn.

## 11. Cảnh báo khả thi và an toàn thao tác

### 11.1. Danh mục dụng cụ đã xác nhận

#### Pipet

| Mã dải | Dải làm việc |
|---|---:|
| P20 | 2–20 µL |
| P100 | 10–100 µL |
| P200 | 20–200 µL |
| P1000 | 100–1.000 µL |
| P5000 | 500–5.000 µL |
| P10000 | 1.000–10.000 µL |

Quy tắc chọn pipet mặc định:

1. Thể tích phải nằm trong dải công bố của pipet, tính cả hai đầu dải.
2. Khi có nhiều pipet cùng bao phủ một thể tích, ưu tiên pipet có dung tích cực đại nhỏ nhất.
3. Tại điểm chồng dải, ví dụ 20, 100, 1.000 hoặc 5.000 µL, quy tắc trên phải cho kết quả ổn định và giải thích được.
4. Không tự chia một lần hút thành nhiều lần nếu KNV chưa chấp thuận kế hoạch thao tác.
5. Thể tích dưới 2 µL không có pipet phù hợp và phải đề xuất pha dung dịch trung gian.
6. Thể tích trên 10.000 µL không có pipet bao phủ trong danh mục; phải đề xuất đổi quy mô pha, dùng bình định mức phù hợp hoặc để KNV chọn phương án khác.

Ví dụ chọn mặc định:

| Thể tích cần hút | Pipet đề xuất |
|---:|---|
| 2–20 µL | P20 |
| >20–100 µL | P100 |
| >100–200 µL | P200 |
| >200–1.000 µL | P1000 |
| >1.000–5.000 µL | P5000 |
| >5.000–10.000 µL | P10000 |

Đây là quy tắc lựa chọn theo dải danh định. Trạm chưa được tuyên bố độ chính xác hoặc độ chụm của từng pipet khi chưa có thông số hiệu chuẩn/nhà sản xuất.

#### Bình định mức

Các thể tích hiện có:

```text
2 mL, 5 mL, 10 mL, 20 mL, 50 mL, 100 mL, 1.000 mL
```

Quy tắc:

- Nếu thể tích đích trùng một bình hiện có, Trạm đề xuất đúng bình đó.
- Nếu thể tích đích không trùng danh mục, Trạm phải cảnh báo “không có bình định mức đúng dung tích trong danh mục đã khai báo”.
- Trạm có thể đề xuất thay đổi quy mô pha sang bình hiện có nhưng phải giữ nguyên nồng độ đích và cho KNV duyệt.
- Không tự coi cốc đong, ống ly tâm hoặc vial là bình định mức.
- Chưa có danh mục vial; không được tự gán dung tích vial từ danh mục bình định mức.

#### Cân

- Độ đọc đã xác nhận: 0,01 mg.
- Khối lượng hiển thị/nhập thực tế theo cân phải hỗ trợ hai chữ số thập phân ở đơn vị mg.
- Engine giữ giá trị đầy đủ; presenter có thể biểu diễn khối lượng cân đến 0,01 mg.
- Không đồng nhất độ đọc 0,01 mg với khối lượng cân tối thiểu.
- Cảnh báo “dưới khối lượng cân tối thiểu” chỉ được bật sau khi có giá trị minimum weight được phòng xác nhận theo SOP hoặc dữ liệu đánh giá cân.
- Trước khi có minimum weight, Trạm chỉ được cảnh báo khi lượng tính toán không thể biểu diễn phù hợp theo độ đọc 0,01 mg hoặc khi lượng sau làm tròn về 0,00 mg.

### 11.2. Danh sách cảnh báo

Calculation engine phải có khả năng phát sinh ít nhất các cảnh báo sau:

- Thể tích cần hút nhỏ hơn dải làm việc của pipet.
- Thể tích cần hút lớn hơn dung tích pipet hoặc dụng cụ đã chọn.
- Thể tích định mức không có bình phù hợp trong danh mục 2, 5, 10, 20, 50, 100 và 1.000 mL.
- Khối lượng tính toán không biểu diễn phù hợp theo độ đọc 0,01 mg.
- Khối lượng cần cân nhỏ hơn minimum weight sau khi ngưỡng này được phòng xác nhận.
- Nồng độ đích lớn hơn nồng độ nguồn trong phép pha loãng.
- Tổng thể tích thành phần lớn hơn hoặc quá gần thể tích định mức.
- Spike chiếm tỷ lệ lớn so với lượng mẫu lỏng và có thể làm thay đổi nền/thể tích đáng kể.
- Thiếu phân tử lượng, khối lượng riêng, potency hoặc hệ số quy đổi cần thiết.
- Trộn các cơ sở nồng độ không tương thích.
- Pha loãng nối tiếp có quá nhiều bước hoặc hệ số pha loãng một bước quá lớn.
- Thể tích nguồn không đủ để pha toàn bộ dãy sau khi cộng phần dư; chỉ là cảnh báo trên số KNV nhập, không đọc Kho.
- Số chữ số có nghĩa của kết quả vượt khả năng dụng cụ.

Khi thể tích cần hút không khả thi, Trạm nên đề xuất tạo dung dịch trung gian. Đề xuất phải cho KNV duyệt và không tự thay đổi kế hoạch pha.

## 12. Cấu trúc giao diện đề xuất

### 12.1. Bước 1 — Chọn việc cần làm

- Tính nồng độ dung dịch đã pha.
- Tính lượng cần lấy để pha dung dịch đích.
- Tính lượng chuẩn thêm vào mẫu.
- Lập dãy chuẩn/QC/hỗn hợp.
- Quy đổi kết quả qua xử lý mẫu.

### 12.2. Bước 2 — Chọn bối cảnh

Ví dụ đối với thêm chuẩn:

- Mẫu rắn.
- Mẫu lỏng.
- Dịch chiết.
- Vial cuối.

Ví dụ đối với dãy chuẩn:

- Pha trực tiếp từ một nguồn.
- Pha từ nhiều chuẩn trung gian.
- Pha loãng nối tiếp.
- Hỗn hợp nhiều chất.

### 12.3. Bước 3 — Nhập thông số

- Chỉ hiển thị trường liên quan đến bối cảnh đã chọn.
- Mỗi trường có tên nghiệp vụ, đơn vị và mô tả ngắn.
- MW, density, potency và conversion factor xuất hiện ngay tại chất/dung dịch cần chúng, không đặt thành thông số toàn cục khó truy vết.

### 12.4. Bước 4 — Kiểm tra kế hoạch

- Kết quả chính.
- Công thức và phép thế số.
- Cảnh báo khả thi.
- Dụng cụ gợi ý.
- Nguồn của từng bước.
- Nồng độ kế hoạch và nồng độ thực tế nếu có.

### 12.5. Bước 5 — Xuất phiếu tính cục bộ

- Sao chép kết quả.
- In phiếu tính.
- Xuất dữ liệu cục bộ.
- Reset bản nháp.

Không có nút xác nhận giao dịch, trừ kho hoặc ghi sử dụng chuẩn.

## 13. Mô hình dữ liệu tính toán đề xuất

Các khái niệm cốt lõi:

```text
ManualSubstance
  name
  molecularWeight?
  potencyPercent?
  densityGPerMl?
  conversionFactor?

ManualSolution
  id
  name
  concentration
  preparedVolume?
  sourceSolutionId?
  actualTakenQuantity?

Concentration
  value
  displayUnit
  basis
  canonicalValue
  canonicalUnit

PreparationStep
  sourceId
  targetId
  plannedQuantity
  actualQuantity?
  finalVolume?
  formula
  trace

Addition
  type: analyte | internal_standard | surrogate
  applicationScope
  targetLevel?
  fixedVolume?

CalculationIssue
  severity: error | warning | information
  code
  field
  message
  suggestedAction?
```

Mọi object chỉ tồn tại trong bản nháp cục bộ hoặc output local của Trạm. Không chứa inventory ID, standard ID, stock balance hoặc transaction metadata.

## 14. Bộ ca kiểm thử nghiệp vụ tối thiểu

### Nồng độ sau pha

- [ ] 10,2 mg, potency 98,5%, định mức 10 mL → 1004,7 mg/L.
- [ ] Cùng ca trên, có MW → trả thêm \(C_M\), mM và µM.
- [ ] Thiếu MW → không xuất kết quả molar.
- [ ] `% w/w` thiếu density khi đổi sang g/L → yêu cầu bổ sung, không suy đoán.
- [ ] Nhập khối lượng thực tế khác kế hoạch → tính nồng độ thực tế và sai lệch.

### Pha dung dịch đích

- [ ] 1.000 ppm → 10 ppm, định mức 10 mL → 100 µL.
- [ ] Hút thực tế 98 µL → nồng độ thực tế 9,8 ppm.
- [ ] Target lớn hơn source → invalid.
- [ ] Thể tích hút dưới dải pipet → cảnh báo và đề xuất dung dịch trung gian.
- [ ] Pha từ hóa chất `% w/w` có density → tính đúng lượng cần lấy.
- [ ] 20 µL → ưu tiên P20 thay vì P100/P200.
- [ ] 100 µL → ưu tiên P100 thay vì P200/P1000.
- [ ] 1.000 µL → ưu tiên P1000 thay vì P5000/P10000.
- [ ] 5.000 µL → ưu tiên P5000 thay vì P10000.
- [ ] 1,5 µL → không có pipet phù hợp; đề xuất dung dịch trung gian.
- [ ] 12.000 µL → không có pipet bao phủ; yêu cầu đổi quy mô hoặc KNV chọn phương án.
- [ ] Định mức 10 mL → đề xuất bình 10 mL.
- [ ] Định mức 25 mL → cảnh báo không có bình đúng dung tích và đề xuất quy mô khả thi.
- [ ] Khối lượng 10,236 mg → hiển thị thao tác theo độ đọc 0,01 mg nhưng giữ giá trị tính toán đầy đủ trong engine.
- [ ] Khối lượng làm tròn về 0,00 mg → cảnh báo không thể cân trực tiếp theo độ đọc hiện có.

### Spike mẫu rắn

- [ ] 5 g mẫu, mức thêm 0,05 mg/kg, chuẩn 10 mg/L → 25 µL.
- [ ] Hỗ trợ µg/kg với chuẩn µg/mL.
- [ ] Mục tiêu là nồng độ tổng → trừ đúng nồng độ nền nếu đã nhập.
- [ ] Cơ sở mg/L dùng cho mẫu rắn → chặn hoặc yêu cầu đổi cơ sở.

### Spike mẫu lỏng

- [ ] Mức thêm tính trên thể tích mẫu ban đầu → dùng công thức gần đúng đã công bố.
- [ ] Nồng độ đích trên thể tích cuối → dùng cân bằng khối lượng chính xác.
- [ ] Có nồng độ nền → tính đúng thể tích để đạt nồng độ tổng.
- [ ] Thể tích spike lớn so với mẫu → cảnh báo ảnh hưởng thể tích/nền.

### Dãy chuẩn và chuẩn trung gian

- [ ] Mỗi điểm lấy từ một nguồn chung.
- [ ] Các điểm thấp và cao lấy từ hai chuẩn trung gian khác nhau.
- [ ] Mỗi điểm tự chọn nguồn riêng.
- [ ] Pha loãng nối tiếp ghi đúng nguồn điểm trước.
- [ ] Hỗn hợp nhiều chất có unit/basis khác nhau nhưng chuyển đổi hợp lệ.
- [ ] Tổng thể tích thành phần vượt thể tích định mức → invalid.
- [ ] Tính tổng nhu cầu từng nguồn cộng phần dư do KNV nhập.

### Nội chuẩn và surrogate

- [ ] Thêm cùng một thể tích vào toàn bộ điểm chuẩn.
- [ ] Tính thể tích từ nồng độ đích của nội chuẩn.
- [ ] Áp dụng cho chuẩn, blank, QC và mẫu theo nhóm được chọn.
- [ ] Hỗ trợ ngoại lệ không thêm vào một số loại blank.
- [ ] Nhiều nội chuẩn/surrogate trong cùng kế hoạch.

### Xử lý mẫu

- [ ] Chuỗi chiết → lấy aliquot → cô → hoàn nguyên.
- [ ] Chuyển toàn lượng không tạo hệ số aliquot giả.
- [ ] Pha loãng sau cùng được đưa đúng vào hệ số tổng.
- [ ] Truy vết được kết quả máy về nồng độ mẫu ban đầu.
- [ ] Chuỗi bước thiếu dữ liệu → incomplete, không trả kết quả 0 giả.

## 15. Kế hoạch triển khai và checklist

### Phase 0 — Chốt nghiệp vụ

- [x] Xác nhận giữ ranh giới không Kho.
- [x] Xác nhận hỗ trợ cả mẫu rắn và mẫu lỏng.
- [x] Xác nhận dãy chuẩn có nhiều chiến lược và thường dùng nhiều chuẩn trung gian.
- [x] Xác nhận có nội chuẩn và surrogate.
- [x] Xác nhận toàn bộ thông số nguồn nhập tay.
- [x] Lập tài liệu nghiệp vụ mới thay cho mô hình sáu mode hiện tại.
- [x] Chốt sáu dải pipet từ 2 đến 10.000 µL.
- [x] Chốt các bình định mức 2, 5, 10, 20, 50, 100 và 1.000 mL.
- [x] Chốt độ đọc của cân là 0,01 mg.
- [ ] KNV review ví dụ, thuật ngữ và thứ tự ưu tiên trên tài liệu này.
- [ ] Chốt minimum weight của cân theo SOP/đánh giá độ không đảm bảo; không suy ra từ độ đọc 0,01 mg.
- [ ] Chốt danh mục và dung tích vial thường dùng.
- [ ] Chốt cách nhập phần dư khi tính tổng nhu cầu dung dịch nguồn.

### Phase 1 — Thiết kế domain và calculation engine

- [ ] Tách concentration basis khỏi tên đơn vị hiển thị.
- [ ] Thiết kế manual substance/manual solution không chứa ID Kho hoặc Chất chuẩn.
- [ ] Hỗ trợ solve-for-variable cho các quan hệ pha cơ bản.
- [ ] Hỗ trợ planned quantity và actual quantity.
- [ ] Implement spike mẫu rắn.
- [ ] Implement hai semantic spike mẫu lỏng.
- [ ] Implement cây dung dịch nguồn và nhiều chuẩn trung gian.
- [ ] Implement nội chuẩn/surrogate và application scope.
- [ ] Implement cảnh báo khả thi.
- [ ] Thay công thức xử lý mẫu cố định bằng stage model hoặc tạm ẩn nghiệp vụ E.

### Phase 2 — Kiểm thử engine

- [ ] Chuyển toàn bộ ca ở Mục 14 thành regression tests.
- [ ] Kiểm thử NaN, Infinity, số âm, zero denominator và input thiếu.
- [ ] Kiểm thử không chuyển đổi khác basis khi thiếu MW/density.
- [ ] Kiểm thử rounding chỉ xảy ra ở presenter.
- [ ] Kiểm thử trace và phép thế số khớp output.
- [ ] Kiểm thử không có dependency Angular, Firebase, Kho hoặc Chất chuẩn trong engine.

### Phase 3 — Thiết kế giao diện theo tác vụ

- [ ] Thay rail sáu mode bằng năm câu hỏi nghiệp vụ.
- [ ] Thiết kế luồng mẫu rắn/mẫu lỏng/dịch chiết/vial cuối.
- [ ] Thiết kế bảng cây nguồn và nhiều chuẩn trung gian.
- [ ] Thiết kế bảng nội chuẩn/surrogate.
- [ ] Hiển thị kế hoạch so với thực tế.
- [ ] Hiển thị công thức, thế số, cảnh báo và hướng dẫn thao tác.
- [ ] Kiểm tra desktop, tablet và mobile.
- [ ] Kiểm tra keyboard, focus-visible, dark mode và reduced motion.

### Phase 4 — Boundary và runtime verification

- [ ] Static test không import InventoryService hoặc standard services.
- [ ] Static test không có updateStock, stock status hoặc transaction action.
- [ ] Runtime chứng minh mở Trạm không đọc inventory/standard collections.
- [ ] Runtime chứng minh mọi thao tác chỉ thay đổi draft cục bộ.
- [ ] Print/export chỉ chứa snapshot do KNV nhập và kết quả tính.
- [ ] KNV chạy smoke các ca thực tế đại diện.

### Phase 5 — Release

- [ ] Cập nhật release notes bằng ngôn ngữ nghiệp vụ KNV.
- [ ] Tăng version bằng quy trình repository.
- [ ] Chạy targeted tests, full test, typecheck và production build.
- [ ] Review diff bảo đảm không đi kèm thay đổi Kho/Chất chuẩn ngoài phạm vi.
- [ ] Chỉ commit, push và deploy sau khi nghiệp vụ được KNV chấp thuận.

## 16. Acceptance criteria

- [ ] KNV tìm được tác vụ theo câu hỏi công việc mà không cần biết tên công thức.
- [ ] Tính được nồng độ thực tế sau khi pha từ chất rắn hoặc dung dịch nguồn.
- [ ] Hiển thị đúng ppm theo mg/L hoặc mg/kg tùy cơ sở.
- [ ] Phân biệt rõ `% w/w`, `% w/v` và `% v/v`.
- [ ] Chỉ xuất \(C_M\) khi có đủ phân tử lượng.
- [ ] Tính được lượng cần cân hoặc hút để pha dung dịch đích.
- [ ] Tính được spike cho cả mẫu rắn và mẫu lỏng.
- [ ] Công bố rõ semantic spike trên mẫu ban đầu hay thể tích cuối.
- [ ] Hỗ trợ nhiều chuẩn trung gian và chọn nguồn riêng cho từng điểm.
- [ ] Phân biệt pha độc lập với pha loãng nối tiếp.
- [ ] Hỗ trợ một hoặc nhiều nội chuẩn/surrogate.
- [ ] Tính được tổng nhu cầu từng nguồn mà không đọc hoặc thay đổi Kho.
- [ ] Không có conversion ngầm giữa mass, volume, molar và phần trăm.
- [ ] Kết quả có công thức, phép thế số, hướng dẫn thao tác và cảnh báo khả thi.
- [ ] Kết quả thực tế thay thế kết quả kế hoạch khi KNV nhập lượng thực tế.
- [ ] Gợi ý pipet chỉ chọn trong sáu dải đã xác nhận và xử lý đúng các điểm chồng dải.
- [ ] Gợi ý bình định mức chỉ chọn trong danh mục 2, 5, 10, 20, 50, 100 và 1.000 mL.
- [ ] Khối lượng thao tác hiển thị phù hợp độ đọc 0,01 mg mà không làm tròn sớm giá trị engine.
- [ ] Trạm không đọc/ghi dữ liệu Kho hoặc Chất chuẩn.
- [ ] Không có nút hoặc code path tạo giao dịch nghiệp vụ.

## 17. Các điểm cần KNV review ở vòng tiếp theo

Các điểm dưới đây chưa phải blocker cho việc thiết kế domain, nhưng phải được xác nhận trước khi hoàn thiện cảnh báo và UI:

- Minimum weight của cân theo SOP hoặc đánh giá độ không đảm bảo; độ đọc 0,01 mg đã được xác nhận nhưng không thay thế giá trị này.
- Danh mục và dung tích vial thường dùng; danh mục bình định mức đã được xác nhận.
- Nếu có, thông số độ chính xác/độ chụm hoặc dữ liệu hiệu chuẩn cần dùng để xếp hạng pipet trong vùng chồng dải.
- Phần dư mặc định khi chuẩn bị dung dịch cho nhiều mẫu/điểm chuẩn.
- Quy tắc chữ số có nghĩa và cách làm tròn kết quả.
- Các loại blank/QC đang dùng và quy tắc thêm nội chuẩn cho từng loại.
- Một hoặc hai SOP đại diện để xác nhận stage model của nghiệp vụ Quy đổi kết quả.
