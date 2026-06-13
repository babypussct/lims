// Bảng alias: Firestore SOP document ID → config key nội bộ
// File form gốc tương ứng ghi chú để tham chiếu khi upload lên Google Drive
export const SOP_ID_MAP: Record<string, string> = {
  'SOP-01': 'fipronil-chlorpyrifos',  // FORM_GOC_FIP_CHLORFOS_9_21.docx
  'SOP-03': 'trifluralin-gcms',       // FORM_GOC_TRIFLURALIN_9_3.docx
  'sop_1767857760184': 'dichlorvos-gcms', // Dichlorvos/Dipterex(Trichlorfon) (GC-MS & GC-MS/MS)
  'nhom_lan_huu_co_gc-msms_copy_1768036876719': 'chlor-huu-co', // Nhóm Chlor hữu cơ (GC-MS/MS) (filebieumau_FORM_TRANG4.docx)
  'SOP-02': 'lan-huu-co',             // Nhóm Lân hữu cơ (GC-MS/MS)
  'sop_1767856825928': 'nhom-cuc',    // Nhóm Cúc (GC-MS/MS)
  'sop_1767857642144': 'nhom-i',      // Nhóm I (GC-MS/MS)
  'tbvtv_trong_nuoc_-_gc-msms_1781168317030': 'tbvtv-trong-nuoc-gcmsms',
};

// ── Bảng fuzzy match: từ khóa trong sopName → config key ────────────────────
export const SOP_NAME_MAP: { keywords: string[]; configKey: string }[] = [
  { keywords: ['trifluralin'], configKey: 'trifluralin-gcms' },
  { keywords: ['fipronil', 'chlorpyrifos'], configKey: 'fipronil-chlorpyrifos' },
  { keywords: ['dichlorvos'], configKey: 'dichlorvos-gcms' },
  { keywords: ['chlor hữu cơ', 'clo hữu cơ', 'chlor hc'], configKey: 'chlor-huu-co' },
  { keywords: ['lân hữu cơ', 'lan hữu cơ', 'lan hc'], configKey: 'lan-huu-co' },
  { keywords: ['nhóm cúc', 'cuc', 'pyrethroid'], configKey: 'nhom-cuc' },
  { keywords: ['nhóm i', 'nhom i'], configKey: 'nhom-i' },
  { keywords: ['tbvtv trong nước', 'tbvtv_trong_nuoc', 'tbvtv trong nuoc'], configKey: 'tbvtv-trong-nuoc-gcmsms' },
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
      'Tất cả mẫu thử đều không phát hiện': 'checkTatCaND',
      'Có mẫu thử phát hiện': 'checkCoMauPhatHien',
      'Mẫu kiểm tra nội bộ': 'qcKiemTraNoiBo',
      'Hệ số hồi quy tuyến tính': 'qcR2',
      'Độ lệch thời gian lưu': 'qcThoiGianLuu',
      'Các yêu cầu về nhận dạng khi phát hiện mẫu nhiễm': 'qcNhanDang',
      'Các yêu cầu về nhận dạng của mẫu thêm chuẩn tại 5ppb': 'qcThemChuan',
      'Độ thu hồi IS': 'qcThuHoi',
      'Đánh giá chung': 'qcDanhGiaChung'
    },
    signaturePlaceholders: { 'date1': 'ngayNguoiPhanTich', 'date2': 'ngayNguoiThamTra' }
  },
  'dichlorvos-gcms': {
    formType: 'type3a',
    columns: { maSoMau: 0, khoiLuong: 1, heSoPhaLoang: 2, loSo: 3, kqDichlorvos: 4 },
    signaturePlaceholders: { 'date1': 'ngayNguoiPhanTich', 'date2': 'ngayNguoiThamTra' }
  },
  // ── DATA_VERSION: 2 (compounds[] = canonical master_analyte.id) ──────────────
  // Trước đây: display strings như 'BHC-alpha (benzene hexachloride)'
  // Hiện tại: canonical id như 'bhc-alpha_benzene_hexachloride'
  // Migration: AbstractSopEntry.migrateResultDataKeys() sẽ tự động chuyển key cũ → mới
  // ─────────────────────────────────────────────────────────────────────────────

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
      // Canonical master_analyte.id — lấy trực tiếp từ Firestore, không qua COMPOUND_TO_FIRESTORE_ID
      'aldrin',
      'bhc-alpha_benzene_hexachloride',
      'bhc-beta',
      'bhc-delta',
      'bhc-epsilon',
      'bhc-gamma_lindane_gamma_hch',
      'chlordane-cis_alpha',
      'chlordane-oxy',
      'chlordane-trans_gamma',
      'ddd-op',
      'ddd-pp',
      'dde-op',
      'dde-pp',
      'ddt-op',
      'ddt-pp',
      'dieldrin',
      'endosulfan_i_alpha_isomer',
      'endosulfan_ii_beta_isomer',
      'endosulfan_sulfate',
      'endrin',
      'heptachlor',
      'heptachlor_endo-epoxide_isomer_a',
      'heptachlor_exo-epoxide_isomer_b',
      'hexachlorobenzene',
      'isodrin',
      'methoxychlor_pp-',
      'mirex',
      'pendimethalin'
    ]
  },
  'lan-huu-co': {
    formType: 'type3b',
    columns: {},
    checkboxLines: {},
    signaturePlaceholders: { 'date1': 'ngayNguoiPhanTich', 'date2': 'ngayNguoiThamTra' },
    compounds: [
      // Canonical master_analyte.id
      'acephate',
      'azinfos_methyl',
      'cadusafos',
      'chlorpyrifos',
      'chlorpyrifos-methyl',
      'diazinon',
      'dimethoate',
      'edifenfos',
      'ethion',
      'ethoprophos_ethoprop',
      'fenitrothion',
      'fenthion',
      'fipronil',
      'fipronil-sulfone',
      'fipronil-sulfide',
      'fipronil-desulfinyl',
      'iprobenfos',
      'malathion',
      'mefenoxam',
      'metalaxyl',
      'methacrifos',
      'methidathion',
      'monocrotophos',
      'omethoate',
      'parathion_ethyl',
      'parathion_methyl',
      'phenthoate',
      'phorate',
      'phosmet',
      'phosphamidon',
      'pirimifos_methyl',
      'profenofos',
      'quinalphos',
      'ronnel_fenchlorphos',
      'triazophos',
      'vamidothion',
      'chlorfenvinphos',
      'isofenfos_methyl'
    ]
  },
  'nhom-cuc': {
    formType: 'type3b',
    columns: {},
    checkboxLines: {},
    signaturePlaceholders: { 'date1': 'ngayNguoiPhanTich', 'date2': 'ngayNguoiThamTra' },
    compounds: [
      // Canonical master_analyte.id
      'bifenthrin',
      'cyfluthrin_baythroid',
      'lambda_cyhalothrin',
      'deltamethrin',
      'tralomethrin',
      'ethofenprox',
      'permethrin_cis',
      'permethrin_trans',
      'fenpropathrin',
      'silafluofen',
      'flucythrinate',
      'fenvalerate',
      'cypermethrin',
      'tefluthrin'
    ]
  },
  'nhom-i': {
    formType: 'type3b',
    columns: {},
    checkboxLines: {},
    signaturePlaceholders: { 'date1': 'ngayNguoiPhanTich', 'date2': 'ngayNguoiThamTra' },
    compounds: [
      // Canonical master_analyte.id
      'phosmet',
      'phosphamidon',
      'pirimifos_methyl',
      'profenofos',
      'triazophos',
      'vamidothion',
      'difenoconazole',
      'propiconazole',
      'tetraconazole',
      'hexaconazole',
      'triadimenol',
      'paclobutrazol',
      'flutriafol',
      'imazalil',
      'uniconazole',
      'tricyclazole',
      'flusilazole',
      'cyproconazole',
      'azoxystrobin',
      'fenbuconazole',
      'tebuconazole',
      'fipronil',
      'bitertanol',
      'boscalid',
      'buprofezin',
      'butachlor',
      'cyprodinil',
      'dicloran',
      'fenoxanil',
      'fluazifop',
      'fludioxonil',
      'flufenacet',
      'kresoxim_methyl',
      'mecarbam',
      'mefenacet',
      'molinate',
      'nitrothal-isopropyl',
      'alachlor',
      'piperonyl_butoxide',
      'propanil',
      'propoxur',
      'simazine',
      'tebufenpyrad',
      'atrazine',
      'tebuthiuron',
      'thiabendazole',
      'chlorfenapyr',
      'vinclozolin',
      'trifluralin',
      'chlorothalonil'
    ]
  },
  'tbvtv-trong-nuoc-gcmsms': {
    formType: 'type3b',
    columns: {},
    checkboxLines: {},
    signaturePlaceholders: { 'date1': 'ngayNguoiPhanTich', 'date2': 'ngayNguoiThamTra' },
    compounds: [
      'alachlor', 'atrazine', 'azoxystrobin', 'bitertanol',
      'boscalid', 'buprofezin', 'butachlor', 'chlorfenapyr',
      'chlorothalonil', 'cyproconazole', 'cyprodinil', 'dicloran',
      'difenoconazole', 'fenbuconazole', 'fenoxanil', 'fipronil',
      'fluazifop', 'fludioxonil', 'flufenacet', 'flusilazole',
      'flutriafol', 'hexaconazole', 'imazalil', 'kresoxim_methyl',
      'mecarbam', 'mefenacet', 'molinate', 'nitrothal-isopropyl',
      'paclobutrazol', 'phosmet', 'phosphamidon', 'piperonyl_butoxide',
      'pirimifos_methyl', 'profenofos', 'propanil', 'propiconazole',
      'propoxur', 'silafluofen', 'simazine', 'tebuconazole',
      'tebufenpyrad', 'tebuthiuron', 'tetraconazole', 'thiabendazole',
      'triadimenol', 'triazophos', 'tricyclazole', 'trifluralin',
      'uniconazole', 'vamidothion', 'vinclozolin', 'bifenthrin',
      'cyfluthrin_baythroid', 'lambda_cyhalothrin', 'deltamethrin', 'tralomethrin',
      'ethofenprox', 'permethrin_cis', 'permethrin_trans', 'fenpropathrin',
      'flucythrinate', 'fenvalerate', 'cypermethrin', 'tefluthrin',
      'acephate', 'azinfos_methyl', 'cadusafos', 'chlorpyrifos',
      'chlorpyrifos-methyl', 'diazinon', 'dimethoate', 'edifenfos',
      'ethion', 'ethoprophos_ethoprop', 'fenitrothion', 'fenthion',
      'fipronil-sulfide', 'fipronil-sulfone', 'fipronil-desulfinyl', 'iprobenfos',
      'malathion', 'mefenoxam', 'metalaxyl', 'methacrifos',
      'methidathion', 'monocrotophos', 'omethoate', 'parathion_ethyl',
      'parathion_methyl', 'phenthoate', 'phorate', 'quinalphos',
      'ronnel_fenchlorphos', 'aldrin', 'bhc-alpha_benzene_hexachloride', 'bhc-beta',
      'bhc-delta', 'bhc-epsilon', 'bhc-gamma_lindane_gamma_hch', 'chlordane-cis_alpha',
      'chlordane-oxy', 'chlordane-trans_gamma', 'ddd-op', 'ddd-pp',
      'dde-op', 'dde-pp', 'ddt-op', 'ddt-pp',
      'dieldrin', 'endosulfan_i_alpha_isomer', 'endosulfan_ii_beta_isomer', 'endosulfan_sulfate',
      'endrin', 'heptachlor', 'heptachlor_endo-epoxide_isomer_a', 'heptachlor_exo-epoxide_isomer_b',
      'hexachlorobenzene', 'isodrin', 'methoxychlor_pp-', 'mirex',
      'pendimethalin'
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
