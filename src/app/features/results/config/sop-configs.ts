// Bảng alias: Firestore SOP document ID → config key nội bộ
// File form gốc tương ứng ghi chú để tham chiếu khi upload lên Google Drive
export const SOP_ID_MAP: Record<string, string> = {
  'SOP-01': 'fipronil-chlorpyrifos',  // FORM_GOC_FIP_CHLORFOS_9_21.docx
  'SOP-03': 'trifluralin-gcms',       // FORM_GOC_TRIFLURALIN_9_3.docx
  'sop_1767857760184': 'dichlorvos-gcms', // Dichlorvos/Dipterex(Trichlorfon) (GC-MS & GC-MS/MS)
  // 'SOP-02': 'dichlorvos-gcms',     // (chưa cấu hình)
  // 'SOP-04': 'chlor-huu-co',        // (chưa cấu hình)
  // 'SOP-05': 'lan-huu-co',          // (chưa cấu hình)
};

// ── Bảng fuzzy match: từ khóa trong sopName → config key ────────────────────
export const SOP_NAME_MAP: { keywords: string[]; configKey: string }[] = [
  { keywords: ['trifluralin'],                              configKey: 'trifluralin-gcms' },
  { keywords: ['fipronil', 'chlorpyrifos'],                 configKey: 'fipronil-chlorpyrifos' },
  { keywords: ['dichlorvos'],                               configKey: 'dichlorvos-gcms' },
  { keywords: ['chlor hữu cơ', 'clo hữu cơ', 'chlor hc'], configKey: 'chlor-huu-co' },
  { keywords: ['lân hữu cơ', 'lan hữu cơ', 'lan hc'],     configKey: 'lan-huu-co' },
];

export const ANGULAR_SOP_CONFIG: Record<string, {
  formType: 'type2' | 'type3a' | 'type3b';
  columns: Record<string, number>;
  checkboxLines?: Record<string, string>;
  signaturePlaceholders: Record<string, string>;
  maSoMauChunkSize?: number;
  compounds?: string[]; // Dành riêng cho Dạng 3B
}> = {
  'trifluralin-gcms': {
    formType: 'type2',
    columns: { loSo: 0, maSoMau: 1, kqTrifluralin: 2, ghiChu: 3 },
    maSoMauChunkSize: 9,
    checkboxLines: {
      'Các mẫu thử không phát hiện Trifluralin': 'checkTatCaND',
      'Có mẫu thử phát hiện Trifluralin': 'checkCoMauPhatHien'
    },
    signaturePlaceholders: { 'date1': 'ngayNguoiPhanTich', 'date2': 'ngayNguoiThamTra' }
  },
  'fipronil-chlorpyrifos': {
    formType: 'type2',
    columns: {
      maSoMau: 0, loSo: 1, kqFip: 2, kqFipDesl: 3, kqFipSulf: 4,
      kqFipSulf2: 5, kqClp: 6, kqClpMe: 7, kqClpMeDes: 8
    },
    checkboxLines: {
      'Tất cả mẫu thử đều không phát hiện':                           'checkTatCaND',
      'Có mẫu thử phát hiện':                                          'checkCoMauPhatHien',
      'Mẫu kiểm tra nội bộ':                                           'qcKiemTraNoiBo',
      'Hệ số hồi quy tuyến tính':                                      'qcR2',
      'Độ lệch thời gian lưu':                                         'qcThoiGianLuu',
      'Các yêu cầu về nhận dạng khi phát hiện mẫu nhiễm':             'qcNhanDang',
      'Các yêu cầu về nhận dạng của mẫu thêm chuẩn tại 5ppb':        'qcThemChuan',
      'Độ thu hồi IS':                                                 'qcThuHoi',
      'Đánh giá chung':                                                'qcDanhGiaChung'
    },
    signaturePlaceholders: { 'date1': 'ngayNguoiPhanTich', 'date2': 'ngayNguoiThamTra' }
  },
  'dichlorvos-gcms': {
    formType: 'type3a',
    columns: { maSoMau: 0, khoiLuong: 1, heSoPhaLoang: 2, loSo: 3, kqDichlorvos: 4 },
    signaturePlaceholders: { 'date1': 'ngayNguoiPhanTich', 'date2': 'ngayNguoiThamTra' }
  },
  'chlor-huu-co': {
    formType: 'type3b',
    columns: {},
    checkboxLines: {
      'Các mẫu thử không phát hiện': 'checkTatCaND',
      'Có mẫu thử phát hiện': 'checkCoMauPhatHien',
      'Các yêu cầu về nhận dạng khi phát hiện mẫu nhiễm': 'qcNhanDang',
      'Độ thu hồi mẫu kiểm soát': 'qcThuHoiMauKiemSoat',
      'Độ thu hồi IS': 'qcThuHoiIS',
      'Độ lệch thời gian lưu': 'qcThoiGianLuu',
      'Đánh giá xu hướng mẫu kiểm soát': 'qcDanhGiaXuHuong',
      'Đánh giá chung': 'qcDanhGiaChung'
    },
    signaturePlaceholders: { 'date1': 'ngayNguoiPhanTich', 'date2': 'ngayNguoiThamTra' },
    compounds: [
      'Aldrin', 'BHC-alpha', 'BHC-beta', 'BHC-delta', 'BHC-epsilon', 'BHC-gamma',
      'Chlordane-cis', 'Chlordane-oxy', 'Chlordane-trans',
      'DDD-o,p', 'DDD-p,p', 'DDE-o,p', 'DDE-p,p', 'DDT-o,p', 'DDT-p,p',
      'Dieldrin', 'Endosulfan-I', 'Endosulfan-II', 'Endosulfan-sulfate', 'Endrin',
      'Heptachlor', 'Heptachlor-epoxide-trans', 'Heptachlor-epoxide-cis',
      'Hexachlorobenzene', 'Isodrin', 'Methoxychlor', 'Mirex', 'Pendimethalin'
    ]
  },
  'lan-huu-co': {
    formType: 'type3b',
    columns: {},
    checkboxLines: {
      'Các mẫu thử không phát hiện': 'checkTatCaND',
      'Có mẫu thử phát hiện': 'checkCoMauPhatHien'
    },
    signaturePlaceholders: { 'date1': 'ngayNguoiPhanTich', 'date2': 'ngayNguoiThamTra' },
    compounds: [
      'Acephate', 'Anilofos', 'Cadusafos', 'Chlorfenvinphos', 'Chlorfenvinphos-methyl',
      'Chlorpyrifos', 'Chlorpyrifos-methyl', 'Demeton-S-methyl', 'Diazinon',
      'Dichlorvos', 'Dimethoate', 'Disulfoton', 'Edifenphos', 'Ethion',
      'Ethoprophos', 'Etrimfos', 'Fenamiphos', 'Fenitrothion', 'Fenthion',
      'Fenthion-sulfone', 'Fenthion-sulfoxide', 'Fonofos', 'Ipobenfos',
      'Isazofos', 'Malathion', 'Methacrifos', 'Methamidophos', 'Methidathion',
      'Monocrotophos', 'Omethoate', 'Parathion-ethyl', 'Parathion-methyl',
      'Phenthoate', 'Phorate', 'Phosalone', 'Phosphamidon', 'Prothiofos',
      'Quinalphos', 'Sulfotep', 'Terbufos', 'Tetrachlorvinphos', 'Triazophos',
      'Isofenphos-methyl'
    ]
  }
};

/**
 * Tra cứu config key theo 4 ưu tiên:
 * 1. Khớp trực tiếp sopId với ANGULAR_SOP_CONFIG (nếu SOP được đặt tên theo slug)
 * 2. Khớp qua bảng SOP_ID_MAP (alias Firestore document ID → config key)
 * 3. Fuzzy match theo từ khóa trong sopName / sop.category / targets
 * 4. Dùng SOP object thực tế (tên, category, targets) từ StateService — chính xác nhất
 */
export function resolveConfigKey(
  sopId: string,
  sopName: string,
  sopObj?: { name?: string; category?: string; targets?: { name: string }[] } | null
): string | null {
  // 1. Khớp trực tiếp sopId với ANGULAR_SOP_CONFIG
  if (ANGULAR_SOP_CONFIG[sopId]) return sopId;

  // 2. Khớp qua bảng alias
  if (SOP_ID_MAP[sopId]) return SOP_ID_MAP[sopId];

  // Xây dựng chuỗi tìm kiếm kết hợp từ tất cả nguồn thông tin
  const searchTexts = [
    sopName,
    sopObj?.name,
    sopObj?.category,
    ...(sopObj?.targets || []).map(t => t.name)
  ].filter(Boolean).map(s => s!.toLowerCase());

  const combinedText = searchTexts.join(' ');

  // 3+4. Fuzzy match theo từ khóa trong tất cả nguồn
  for (const entry of SOP_NAME_MAP) {
    if (entry.keywords.some(kw => combinedText.includes(kw.toLowerCase()))) {
      return entry.configKey;
    }
  }

  return null;
}
