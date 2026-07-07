/**
 * LIMS Report Generator — Google Apps Script Configuration
 * ========================================================
 * Chứa cấu hình toàn cục về thư mục Drive và các chỉ tiêu phân tích (SOP).
 */

/**
 * Bản đồ: Display string (tên trên biểu mẫu) → Canonical master_analyte.id (Firestore key)
 *
 * Đây là Single Source of Truth cho GAS — mirror của COMPOUND_TO_FIRESTORE_ID trong frontend.
 * Dùng bởi:
 *   - _getPayloadKey(): lấy Firestore key để đọc sample[key]
 *   - isTargetAssignedForGas(): so sánh canonical id trực tiếp với sampleTargetMap values
 *
 * QUAN TRỌNG: compounds[] trong SOP_CONFIG giữ nguyên display strings để khớp với
 * text in trên form template (Google Docs). Chỉ resultColumns[].key mới dùng canonical id.
 */
const COMPOUND_TO_CANONICAL = {
  // ── Chlor hữu cơ ──────────────────────────────────────────────────────────
  'Aldrin':                         'aldrin',
  'BHC-alpha':                      'bhc_alpha_benzene_hexachloride',
  'BHC-alpha (benzene hexachloride)':'bhc_alpha_benzene_hexachloride',
  'BHCa':                           'bhc_alpha_benzene_hexachloride',
  'BHC-beta':                       'bhc_beta',
  'BHCb':                           'bhc_beta',
  'BHC-delta':                      'bhc_delta',
  'BHCd':                           'bhc_delta',
  'BHC-epsilon':                    'bhc_epsilon',
  'BHCe':                           'bhc_epsilon',
  'BHC-gamma':                      'bhc_gamma_lindane_gamma_hch',
  'BHC-gamma (Lindane, gamma HCH)': 'bhc_gamma_lindane_gamma_hch',
  'BHCg':                           'bhc_gamma_lindane_gamma_hch',
  'Chlordane-cis':                  'chlordane_cis_alpha',
  'Chlordane-cis (alpha)':          'chlordane_cis_alpha',
  'Chlordane_cis':                  'chlordane_cis_alpha',
  'Chlordane-oxy':                  'chlordane_oxy',
  'Chlordane_oxy':                  'chlordane_oxy',
  'Chlordane-trans':                'chlordane_trans_gamma',
  'Chlordane-trans (gamma)':        'chlordane_trans_gamma',
  'Chlordane_trans':                'chlordane_trans_gamma',
  "DDD-o,p":                        'ddd_op',
  "DDD-o,p'":                       'ddd_op',
  'DDD_op':                         'ddd_op',
  "DDD-p,p":                        'ddd_pp',
  "DDD-p,p'":                       'ddd_pp',
  'DDD_pp':                         'ddd_pp',
  "DDE-o,p":                        'dde_op',
  "DDE-o,p'":                       'dde_op',
  'DDE_op':                         'dde_op',
  "DDE-p,p":                        'dde_pp',
  "DDE-p,p'":                       'dde_pp',
  'DDE_pp':                         'dde_pp',
  "DDT-o,p":                        'ddt_op',
  "DDT-o,p'":                       'ddt_op',
  'DDT_op':                         'ddt_op',
  "DDT-p,p":                        'ddt_pp',
  "DDT-p,p'":                       'ddt_pp',
  'DDT_pp':                         'ddt_pp',
  'Dieldrin':                       'dieldrin',
  'Endosulfan-I':                   'endosulfan_i_alpha_isomer',
  'Endosulfan I (alpha isomer)':    'endosulfan_i_alpha_isomer',
  'Endosulfan1':                    'endosulfan_i_alpha_isomer',
  'Endosulfan-II':                  'endosulfan_ii_beta_isomer',
  'Endosulfan II (beta isomer)':    'endosulfan_ii_beta_isomer',
  'Endosulfan2':                    'endosulfan_ii_beta_isomer',
  'Endosulfan-sulfate':             'endosulfan_sulfate',
  'Endosulfan sulfate':             'endosulfan_sulfate',
  'EndosulfanS':                    'endosulfan_sulfate',
  'Endrin':                         'endrin',
  'Heptachlor':                     'heptachlor',
  'Heptachlor-epoxide-trans':       'heptachlor_endo_epoxide_isomer_a',
  'Heptachlor endo-epoxide (isomer A)': 'heptachlor_endo_epoxide_isomer_a',
  'HeptachlorA':                    'heptachlor_endo_epoxide_isomer_a',
  'Heptachlor-epoxide-cis':         'heptachlor_exo_epoxide_isomer_b',
  'Heptachlor exo-epoxide (isomer B)': 'heptachlor_exo_epoxide_isomer_b',
  'HeptachlorB':                    'heptachlor_exo_epoxide_isomer_b',
  'Hexachlorobenzene':              'hexachlorobenzene',
  'HCB':                            'hexachlorobenzene',
  'Isodrin':                        'isodrin',
  'Methoxychlor':                   'methoxychlor_pp_',
  "Methoxychlor, p,p'-":            'methoxychlor_pp_',
  'Mirex':                          'mirex',
  'Pendimethalin':                  'pendimethalin',
 
  // ── Lân hữu cơ ────────────────────────────────────────────────────────────
  'Acephate':                       'acephate',
  'Azinphos-methyl':                'azinphos_methyl',
  'Azinphos methyl':                'azinphos_methyl',
  'Azinfos methyl':                 'azinphos_methyl',
  'AzinfosMethyl':                  'azinphos_methyl',
  'AzinphosMethyl':                 'azinphos_methyl',
  'Azinfos-methyl':                 'azinphos_methyl',
  'Cadusafos':                      'cadusafos',
  'Chlorpyrifos':                   'chlorpyrifos',
  'Chlorpyrifos methyl':            'chlorpyrifos_methyl',
  'Chlorpyrofos':                   'chlorpyrifos',
  'Chlorpyrofos-methyl':            'chlorpyrifos_methyl',
  'Chlorpyryfos':                   'chlorpyrifos',
  'Chlorpyryfos-methyl':            'chlorpyrifos_methyl',
  'Chlorpyrifos-methyl':            'chlorpyrifos_methyl',
  'ChlorpyryfosMethyl':             'chlorpyrifos_methyl',
  'ChlorpyrifosMethyl':             'chlorpyrifos_methyl',
  'Diazinon':                       'diazinon',
  'Dimethoate':                     'dimethoate',
  'Edifenfos':                      'edifenphos',
  'Edifenphos':                     'edifenphos',
  'Ethion':                         'ethion',
  'Ethoprophos':                    'ethoprophos_ethoprop',
  'Ethoprofos':                     'ethoprophos_ethoprop',
  'Ethoprophos (Ethoprop)':         'ethoprophos_ethoprop',
  'Ethoprophos_ethoprop':           'ethoprophos_ethoprop',
  'Fenitrothion':                   'fenitrothion',
  'Fenthion':                       'fenthion',
  'Fipronil':                       'fipronil',
  'Fipronil sulfide':               'fipronil_sulfide',
  'Fipronil-sulfide':               'fipronil_sulfide',
  'FipronilSulfide':                'fipronil_sulfide',
  'Fipronil sulfone':               'fipronil_sulfone',
  'Fipronil-sulfone':               'fipronil_sulfone',
  'FipronilSulfone':                'fipronil_sulfone',
  'Fipronil desulfinyl':            'fipronil_desulfinyl',
  'Fipronil-desulfinyl':            'fipronil_desulfinyl',
  'FipronilDesulfinyl':             'fipronil_desulfinyl',
  'Iprobenfos':                     'iprobenfos',
  'Malathion':                      'malathion',
  'Mefenoxam':                      'mefenoxam',
  'Metalaxyl':                      'metalaxyl',
  'Methacrifos':                    'methacrifos',
  'Methidathion':                   'methidathion',
  'Monocrotophos':                  'monocrotophos',
  'Omethoate':                      'omethoate',
  'Parathion':                      'parathion',
  'Parathion-ethyl':                'parathion',
  'Parathion-methyl':               'parathion_methyl',
  'ParathionMethyl':                'parathion_methyl',
  'Phenthoate':                     'phenthoate',
  'Phorate':                        'phorate',
  'Phosmet':                        'phosmet',
  'Phosphamidon':                   'phosphamidon',
  'Pirimiphos-methyl':              'pirimiphos_methyl',
  'Pirimiphos methyl':              'pirimiphos_methyl',  // nhom-i.compounds[] dùng space
  'PirimiphosMethyl':               'pirimiphos_methyl',
  'Pirimifos-methyl':               'pirimiphos_methyl',
  'Profenofos':                     'profenofos',
  'Quinalphos':                     'quinalphos',
  'Ronnel':                         'ronnel_fenchlorphos',
  'Ronnel (Fenchlorphos)':          'ronnel_fenchlorphos',
  'Triazophos':                     'triazophos',
  'Vamidothion':                    'vamidothion',
  'Chlorfenvinphos':                'chlorfenvinphos',
  'Isofenphos-methyl':              'isofenphos_methyl',
  'Isofenphos methyl':               'isofenphos_methyl',
  'IsofenphosMethyl':               'isofenphos_methyl',
  'Isofenfos-methyl':               'isofenphos_methyl',
 
  // ── Nhóm Cúc (Pyrethroid) ─────────────────────────────────────────────────
  'Bifenthrin':                     'bifenthrin',
  'Cyfluthrin (Baythroid)':         'cyfluthrin_baythroid',
  'CyfluthrinBaythroid':            'cyfluthrin_baythroid',
  'lamda-Cyhalothrin':              'lamda_cyhalothrin',
  'lambda-Cyhalothrin':             'lamda_cyhalothrin',
  'lamdaCyhalothrin':               'lamda_cyhalothrin',
  'lambdaCyhalothrin':              'lamda_cyhalothrin',
  'Deltamethrin':                   'deltamethrin',
  'Tralomethrin':                   'tralomethrin',
  'Ethofenprox':                    'ethofenprox',
  'Permethrin cis':                 'permethrin_cis',
  'PermethrinCis':                  'permethrin_cis',
  'Permethrin trans':               'permethrin_trans',
  'PermethrinTrans':                'permethrin_trans',
  'Fenpropathrin':                  'fenpropathrin',
  'Silafluofen':                    'silafluofen',
  'Flucythrinate':                  'flucythrinate',
  'Fenvalerate':                    'fenvalerate',
  'Cypermethrin':                   'cypermethrins',
  'Cypermethrins':                  'cypermethrins',
  'Tefluthrin':                     'tefluthrin',
 
  // ── Nhóm I ────────────────────────────────────────────────────────────────
  'Difenoconazole':                 'difenoconazole',
  'Propiconazole':                  'propiconazole',
  'Tetraconazole':                  'tetraconazole',
  'Hexaconazole':                   'hexaconazole',
  'Triadimenol':                    'triadimenol',
  'Paclobutrazol':                  'paclobutrazol',
  'Flutriafol':                     'flutriafol',
  'Imazalil':                       'imazalil',
  'Uniconazole':                    'uniconazole',
  'Tricyclazole':                   'tricyclazole',
  'Flusilazole':                    'flusilazole',
  'Cyproconazole':                  'cyproconazole',
  'Azoxystrobin':                   'azoxystrobin',
  'Fenbuconazole':                  'fenbuconazole',
  'Tebuconazole':                   'tebuconazole',
  'Bitertanol':                     'bitertanol',
  'Boscalid':                       'boscalid',
  'Buprofezin':                     'buprofezin',
  'Butachlor':                      'butachlor',
  'Cyprodinil':                     'cyprodinil',
  'Dicloran':                       'dicloran',
  'Fenoxanil':                      'fenoxanil',
  'Fluazifop':                      'fluazifop',
  'Fludioxonil':                    'fludioxonil',
  'Flufenacet':                     'flufenacet',
  'Kresoxim methyl':                'kresoxim_methyl',
  'KresoximMethyl':                 'kresoxim_methyl',
  'Mecarbam':                       'mecarbam',
  'Mefenacet':                      'mefenacet',
  'Molinate':                       'molinate',
  'Nitrothal-Isopropyl':            'nitrothal_isopropyl',
  'NitrothalIsopropyl':             'nitrothal_isopropyl',
  'Alachlor':                       'alachlor',
  'Piperonyl butoxide':             'piperonyl_butoxide',
  'PiperonylButoxide':              'piperonyl_butoxide',
  'Propanil':                       'propanil',
  'Propoxur':                       'propoxur',
  'Simazine':                       'simazine',
  'Tebufenpyrad':                   'tebufenpyrad',
  'Atrazine':                       'atrazine',
  'Tebuthiuron':                    'tebuthiuron',
  'Thiabendazole':                  'thiabendazole',
  'Chlorfenapyr':                   'chlorfenapyr',
  'Vinclozolin':                    'vinclozolin',
  'Trifluralin':                    'trifluralin',
  'Chlorothalonil':                 'chlorothalonil',
 
  // ── Fipronil / Chlorpyrifos (SOP-01 — dùng cho context khác nếu cần) ─────
  'Chlorpyrifos-methyl-desmethyl':  'chlorpyrifos_methyl_desmethyl',

  // ── Trifluralin / Dichlorvos ──────────────────────────────────────────────
  'Dichlorvos':                     'dichlorvos',
  'Trichlorfon':                    'trichlorfondipterexdichlorvos',
  'Trichlorfon(Dipterex)/Dichlorvos': 'trichlorfondipterexdichlorvos',

  // ── TBVTV thực phẩm SOP 9.14 ─────────────────────────────────────────────
  '1-Naphthol':                     '1_naphthol',
  '1-naphthol':                     '1_naphthol',
  'Acetamiprid':                    'acetamiprid',
  'Chloroneb':                      'chloroneb',
  'Chlorpropham':                   'chlorpropham',
  'MGK-264':                        'mgk_264',
  'MGK264':                         'mgk_264',
  'Metolachlor':                    'metolachlor',
  'Nonachlor cis':                  'nonachlor_cis',
  'Nonachlor-cis':                  'nonachlor_cis',
  'Nonachlor trans':                'nonachlor_trans',
  'Nonachlor-trans':                'nonachlor_trans',
  'Pentachloroaniline':             'pentachloroaniline',
  'Pentachloroaniline (PCA)':       'pentachloroaniline',
  'PCA':                            'pentachloroaniline',
  'Pentachlorobenzene':             'pentachlorobenzene',
  'Pentachlorobenzene (PCB)':       'pentachlorobenzene',
  'Pronamide':                      'pronamide',
};

const CONFIG = {
  // Root folder ID chứa tất cả báo cáo (thư mục "LIMS_Reports" trên Drive)
  ROOT_FOLDER_ID: '1B8KctFU-KDCPAwxrg8N75Sipk5SlGJkE',

  // Template Google Doc IDs cho từng SOP (cập nhật sau khi upload file form gốc lên Drive)
  // Định dạng: 'config-key': 'GOOGLE_DOC_ID'  // SOP-XX | file gốc: <tên file>
  TEMPLATES: {
    'trifluralin-gcms':       '1FN0onAiYBuSBiQk3DWQQGXTxvhHaI8VSaxD2qgUUAxY',   // SOP-03 | FORM_GOC_TRIFLURALIN_9_3.docx
    'fipronil-chlorpyrifos':  '1LTP7q3pIW9IBIbJPzFmX43Sr3QxGj70MoBLity0HLVw',          // SOP-01 | FORM_GOC_FIP_CHLORFOS_9_21.docx
    'dichlorvos-gcms':        '15Vg_kdrEx1DQ-LyLuZVo8sKnjW7JFV7mQDAEE3xKywY',   // Dichlorvos/Dipterex(Trichlorfon)
    'chloroform-gcms':        '1Qfg1k_Y3GLWhOj9oCoQW6sahMNoVN7GhU6u5NMSYrBo',   // Chloroform (GC-MS/MS)
    'chlor-huu-co':           '1xQNkNRcPtfmQjwyv5F2qx1E2VbCmeuPbnfCK3_AgAGQ',   // (filebieumau_FORM_TRANG4.docx)
    'lan-huu-co':             '1nSWI-KDXhcnzZK3k0X5o0Wn2rXQ2XeRx87jx8WJAM60',   // SOP-02 | TÊN Nhóm Lân hữu cơ (GC-MS/MS)
    'nhom-cuc':               '1ugk8Xx-LHYD7xrarxE01pG96fIA5Po7OMdjQ8htrys0',   // Nhóm Cúc (GC-MS/MS) - Form Check
    'nhom-cuc-don':           '1rlN0iNEG_beYHBX7VRsoJ6QQsMerKxian8OJni0Ha9A',   // Nhóm Cúc (GC-MS/MS) - Form Đơn
    'nhom-i':                 'PASTE_GOOGLE_DOC_ID_HERE',                       // Nhóm I (GC-MS/MS) - Form Check
    'nhom-i-don':             '14mDxiC6v8Xf_Eq4s-WC1xgxvjBvF2lWHMnNNB_qH-UE',   // Nhóm I (GC-MS/MS) - Form Đơn
    'tbvtv-trong-nuoc-gcmsms':      '1IOPpgtydsZegD0RNP246c0Rq5asvdU6RJZ7MJ1c1KCs',
    'tbvtv-trong-nuoc-gcmsms-don':  '1cF4lX-lotjbV2GSDOqpsfwFuQK2TJcxg8w1RsCMMBLE',
    'tbvtv-thuc-pham-gcmsms':       '1b-bv_9mAxnTNWz2ve0n0OeBj4UrhCB5X3DHXsG5EOc4',
    'tbvtv-thuc-pham-gcmsms-rut-gon': '1a-6dDufswdWaOJ2oqtzZD4j6ncj5EEvtbi8xo3019K4',
  },

  // Cấu hình định dạng biểu mẫu cho từng SOP (đọc/ghi dữ liệu bảng)
  SOP_CONFIG: {
    'trifluralin-gcms': {
      folderName: 'Trifluralin (GC-MS)',
      formType: 'type2',
      defaultFontSize: 13,
      sampleTableIndex: 1,   // table index trong Google Doc (0-based)
      tablesPerPage: 2,      // số lượng bảng trên mỗi trang kết quả (bao gồm bảng đường chuẩn & bảng mẫu)
      columns: {
        loSo:          0,    // col index "Lọ số"
        maSoMau:       1,    // col index "Mẫu thử"
        kqTrifluralin: 2,    // col index "KQ Trifluralin (µg/kg)"
        ghiChu:        3,    // col index "Ghi chú"
      },
      maSoMauChunkSize: 9,   // Tự động ngắt dòng cột mã số mẫu sau mỗi 9 ký tự (chỉ áp dụng cho Trifluralin)
      headerRows: 1,         // số hàng header không điền data
      textReplacements: {},
      checkboxLines: {
        'Các mẫu thử không phát hiện Trifluralin': 'checkTatCaND',
        'Có mẫu thử phát hiện Trifluralin':        'checkCoMauPhatHien',
      },
      signaturePlaceholders: {
        'date1': 'ngayNguoiPhanTich',
        'date2': 'ngayNguoiThamTra',
      }
    },
    'fipronil-chlorpyrifos': {
      folderName: 'Fipronil - Chlorpyrifos',
      formType: 'type2',
      defaultFontSize: 9,
      sampleTableIndex: 2,
      columns: {
        maSoMau:       0, // Mã số mẫu
        loSo:          1, // Vial No.
        kqFip:         2, // Fipronil
        kqFipDesl:     3, // Fipronil desulfinyl
        kqFipSulf:     4, // Fipronil sulfide
        kqFipSulf2:    5, // Fipronil sulfone
        kqClp:         6, // Chlorpyrifos
        kqClpMe:       7, // Chlorpyrifos methyl
        kqClpMeDes:    8  // Chlorpyriphos-methyl-desmethyl
      },
      headerRows: 2,         // Row 0: merged header; Row 1: compound sub-headers
      textReplacements: {},
      checkboxLines: {
        // Khớp đúng text trong form (trang 2, section 9)
        'Tất cả mẫu thử đều không phát hiện':                          'checkTatCaND',
        'Có mẫu thử phát hiện':                                         'checkCoMauPhatHien',
        // Khớp đúng text trong bảng QC (section 8) — col 0 của từng hàng
        'Mẫu kiểm tra nội bộ':                                          'qcKiemTraNoiBo',
        'Hệ số hồi quy tuyến tính':                                      'qcR2',
        'Độ lệch thời gian lưu':                                         'qcThoiGianLuu',
        'Các yêu cầu về nhận dạng khi phát hiện mẫu nhiễm':            'qcNhanDang',
        'Các yêu cầu về nhận dạng của mẫu thêm chuẩn tại 5ppb':       'qcThemChuan',
        'Độ thu hồi IS':                                                 'qcThuHoi',
        'Đánh giá chung':                                                'qcDanhGiaChung'
      },
      signaturePlaceholders: {
        'date1': 'ngayNguoiPhanTich',
        'date2': 'ngayNguoiThamTra',
      }
    },
    'dichlorvos-gcms': {
      folderName: 'Dichlorvos (GC-MS)',
      formType: 'type3a',
      defaultFontSize: 13,
      sampleTableIndex: 1,
      columns: {
        maSoMau:       0, // Mã số mẫu
        khoiLuong:     1, // Khối lượng (g)
        heSoPhaLoang:  2, // Hệ số pha loãng F
        loSo:          3, // Số vial / Lọ số
        kqDichlorvos:  4  // Kết quả (ng/g)
      },
      headerRows: 1,
      textReplacements: {},
      checkboxLines: {},
      signaturePlaceholders: {
        'date1': 'ngayNguoiPhanTich',
        'date2': 'ngayNguoiThamTra',
      }
    },
    'chloroform-gcms': {
      folderName: 'Chloroform (GC-MS/MS)',
      formType: 'type3a',
      defaultFontSize: 13,
      sampleTableIndex: 1,
      columns: {
        maSoMau:       0, // Mã số mẫu
        khoiLuong:     1, // Khối lượng (g)
        heSoPhaLoang:  2, // Hệ số pha loãng F
        loSo:          3, // Số vial / Lọ số
        kqChloroform:  4  // Kết quả (ppb)
      },
      headerRows: 1,
      textReplacements: {},
      checkboxLines: {},
      signaturePlaceholders: {
        'date1': 'ngayNguoiPhanTich',
        'date2': 'ngayNguoiThamTra',
      }
    },
    'chlor-huu-co': {
      folderName: 'Chlor hữu cơ (Type 3B)',
      formType: 'type3b',
      defaultFontSize: 13,
      columns: {}, // Sử dụng text replacements động cho Dạng 3B
      checkboxLines: {
        'Các mẫu thử không phát hiện':                               'checkTatCaND',
        'Có mẫu thử phát hiện':                                      'checkCoMauPhatHien',
        'Các yêu cầu về nhận dạng khi phát hiện mẫu nhiễm':          'qcNhanDang',
        'Độ thu hồi mẫu kiểm soát':                                   'qcThuHoiMauKiemSoat',
        'Độ thu hồi IS':                                             'qcThuHoiIS',
        'Độ lệch thời gian lưu':                                     'qcThoiGianLuu',
        'Đánh giá xu hướng mẫu kiểm soát':                            'qcDanhGiaXuHuong',
        'Đánh giá chung':                                            'qcDanhGiaChung'
      },
      signaturePlaceholders: {
        'date1': 'ngayNguoiPhanTich',
        'date2': 'ngayNguoiThamTra',
      },
      // resultColumns[].key = canonical master_analyte.id (DATA_VERSION 2)
      // Khớp với compounds[] trong ANGULAR_SOP_CONFIG['chlor-huu-co']
      resultColumns: [
        { key: 'aldrin' }, { key: 'bhc_alpha_benzene_hexachloride' }, { key: 'bhc_beta' }, { key: 'bhc_delta' }, { key: 'bhc_epsilon' }, { key: 'bhc_gamma_lindane_gamma_hch' },
        { key: 'chlordane_cis_alpha' }, { key: 'chlordane_oxy' }, { key: 'chlordane_trans_gamma' }, { key: 'ddd_op' },
        { key: 'ddd_pp' }, { key: 'dde_op' }, { key: 'dde_pp' }, { key: 'ddt_op' }, { key: 'ddt_pp' },
        { key: 'dieldrin' }, { key: 'endosulfan_i_alpha_isomer' }, { key: 'endosulfan_ii_beta_isomer' }, { key: 'endosulfan_sulfate' }, { key: 'endrin' },
        { key: 'heptachlor' }, { key: 'heptachlor_endo_epoxide_isomer_a' }, { key: 'heptachlor_exo_epoxide_isomer_b' }, { key: 'hexachlorobenzene' }, { key: 'isodrin' },
        { key: 'methoxychlor_pp_' }, { key: 'mirex' }, { key: 'pendimethalin' }
      ],
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
      folderName: 'Lân hữu cơ (Type 3B)',
      formType: 'type3b',
      defaultFontSize: 13,
      columns: {}, // Sử dụng text replacements động cho Dạng 3B
      checkboxLines: {}, // Trống vì Lân hữu cơ không có bảng QC checklist ở trang 1
      signaturePlaceholders: {
        'date1': 'ngayNguoiPhanTich',
        'date2': 'ngayNguoiThamTra',
      },
      // resultColumns[].key = canonical master_analyte.id (DATA_VERSION 2)
      // Khớp với compounds[] trong ANGULAR_SOP_CONFIG['lan-huu-co']
      resultColumns: [
        { key: 'acephate' }, { key: 'azinphos_methyl' }, { key: 'cadusafos' }, { key: 'chlorpyrifos' },
        { key: 'chlorpyrifos_methyl' }, { key: 'diazinon' }, { key: 'dimethoate' }, { key: 'edifenphos' },
        { key: 'ethion' }, { key: 'ethoprophos_ethoprop' }, { key: 'fenitrothion' }, { key: 'fenthion' },
        { key: 'fipronil' }, { key: 'fipronil_sulfide' }, { key: 'fipronil_sulfone' }, { key: 'fipronil_desulfinyl' },
        { key: 'iprobenfos' }, { key: 'malathion' }, { key: 'mefenoxam' }, { key: 'metalaxyl' },
        { key: 'methacrifos' }, { key: 'methidathion' }, { key: 'monocrotophos' }, { key: 'omethoate' },
        { key: 'parathion' }, { key: 'parathion_methyl' }, { key: 'phenthoate' }, { key: 'phorate' },
        { key: 'phosmet' }, { key: 'phosphamidon' }, { key: 'pirimiphos_methyl' }, { key: 'profenofos' },
        { key: 'quinalphos' }, { key: 'ronnel_fenchlorphos' }, { key: 'triazophos' }, { key: 'vamidothion' },
        { key: 'chlorfenvinphos' }, { key: 'isofenphos_methyl' }
      ],
      compounds: [
        'Acephate', 'Azinphos-methyl', 'Cadusafos', 'Chlorpyrifos', 'Chlorpyryfos-methyl',
        'Diazinon', 'Dimethoate', 'Edifenfos', 'Ethion', 'Ethoprophos',
        'Fenitrothion', 'Fenthion', 'Fipronil', 'Fipronil sulfide', 'Fipronil sulfone',
        'Fipronil desulfinyl', 'Iprobenfos', 'Malathion', 'Mefenoxam', 'Metalaxyl',
        'Methacrifos', 'Methidathion', 'Monocrotophos', 'Omethoate', 'Parathion',
        'Parathion-methyl', 'Phenthoate', 'Phorate', 'Phosmet', 'Phosphamidon',
        'Pirimiphos-methyl', 'Profenofos', 'Quinalphos', 'Ronnel', 'Triazophos',
        'Vamidothion', 'Chlorfenvinphos', 'Isofenphos-methyl'
      ]
    },
    'nhom-cuc': {
      folderName: 'Nhóm Cúc (Type 3B)',
      formType: 'type3b',
      defaultFontSize: 13,
      columns: {},
      checkboxLines: {}, // Trống vì Nhóm Cúc không có bảng QC checklist ở trang 1
      signaturePlaceholders: {
        'date1': 'ngayNguoiPhanTich',
        'date2': 'ngayNguoiThamTra',
      },
      // resultColumns[].key = canonical master_analyte.id (DATA_VERSION 2)
      // Khớp với compounds[] trong ANGULAR_SOP_CONFIG['nhom-cuc']
      resultColumns: [
        { key: 'bifenthrin' }, { key: 'cyfluthrin_baythroid' }, { key: 'lamda_cyhalothrin' }, { key: 'deltamethrin' },
        { key: 'tralomethrin' }, { key: 'ethofenprox' }, { key: 'permethrin_cis' }, { key: 'permethrin_trans' },
        { key: 'fenpropathrin' }, { key: 'silafluofen' }, { key: 'flucythrinate' }, { key: 'fenvalerate' },
        { key: 'cypermethrins' }, { key: 'tefluthrin' }
      ],
      compounds: [
        'Bifenthrin', 'Cyfluthrin (Baythroid)', 'lamda-Cyhalothrin', 'Deltamethrin',
        'Tralomethrin', 'Ethofenprox', 'Permethrin cis', 'Permethrin trans',
        'Fenpropathrin', 'Silafluofen', 'Flucythrinate', 'Fenvalerate',
        'Cypermethrin', 'Tefluthrin'
      ]
    },
    'nhom-i': {
      folderName: 'Nhóm I (Type 3B)',
      formType: 'type3b',
      defaultFontSize: 13,
      columns: {},
      checkboxLines: {},
      signaturePlaceholders: {
        'date1': 'ngayNguoiPhanTich',
        'date2': 'ngayNguoiThamTra',
      },
      // resultColumns[].key = canonical master_analyte.id (DATA_VERSION 2)
      // Khớp với compounds[] trong ANGULAR_SOP_CONFIG['nhom-i']
      resultColumns: [
        { key: 'phosmet' }, { key: 'phosphamidon' }, { key: 'pirimiphos_methyl' }, { key: 'profenofos' },
        { key: 'triazophos' }, { key: 'vamidothion' }, { key: 'difenoconazole' }, { key: 'propiconazole' },
        { key: 'tetraconazole' }, { key: 'hexaconazole' }, { key: 'triadimenol' }, { key: 'paclobutrazol' },
        { key: 'flutriafol' }, { key: 'imazalil' }, { key: 'uniconazole' }, { key: 'tricyclazole' },
        { key: 'flusilazole' }, { key: 'cyproconazole' }, { key: 'azoxystrobin' }, { key: 'fenbuconazole' },
        { key: 'tebuconazole' }, { key: 'fipronil' }, { key: 'bitertanol' }, { key: 'boscalid' },
        { key: 'buprofezin' }, { key: 'butachlor' }, { key: 'cyprodinil' }, { key: 'dicloran' },
        { key: 'fenoxanil' }, { key: 'fluazifop' }, { key: 'fludioxonil' }, { key: 'flufenacet' },
        { key: 'kresoxim_methyl' }, { key: 'mecarbam' }, { key: 'mefenacet' }, { key: 'molinate' },
        { key: 'nitrothal_isopropyl' }, { key: 'alachlor' }, { key: 'piperonyl_butoxide' }, { key: 'propanil' },
        { key: 'propoxur' }, { key: 'silafluofen' }, { key: 'simazine' }, { key: 'tebufenpyrad' },
        { key: 'atrazine' }, { key: 'tebuthiuron' }, { key: 'thiabendazole' }, { key: 'chlorfenapyr' },
        { key: 'vinclozolin' }, { key: 'trifluralin' }, { key: 'chlorothalonil' }
      ],
      compounds: [
        'Phosmet', 'Phosphamidon', 'Pirimiphos methyl', 'Profenofos', 'Triazophos', 'Vamidothion',
        'Difenoconazole', 'Propiconazole', 'Tetraconazole', 'Hexaconazole', 'Triadimenol', 'Paclobutrazol',
        'Flutriafol', 'Imazalil', 'Uniconazole', 'Tricyclazole', 'Flusilazole', 'Cyproconazole',
        'Azoxystrobin', 'Fenbuconazole', 'Tebuconazole', 'Fipronil', 'Bitertanol', 'Boscalid',
        'Buprofezin', 'Butachlor', 'Cyprodinil', 'Dicloran', 'Fenoxanil', 'Fluazifop', 'Fludioxonil',
        'Flufenacet', 'Kresoxim methyl', 'Mecarbam', 'Mefenacet', 'Molinate', 'Nitrothal-Isopropyl',
        'Alachlor', 'Piperonyl butoxide', 'Propanil', 'Propoxur', 'Silafluofen', 'Simazine',
        'Tebufenpyrad', 'Atrazine', 'Tebuthiuron', 'Thiabendazole', 'Chlorfenapyr', 'Vinclozolin',
        'Trifluralin', 'Chlorothalonil'
      ]
    },
    'tbvtv-thuc-pham-gcmsms-rut-gon': {
      folderName: 'TBVTV thực phẩm (GC-MS/MS)',
      formType: 'type2',
      defaultFontSize: 9,
      sampleTableIndex: 2,
      columns: {
        maSoMau:       0,
        loSo:          1,
        kqFip:         2,
        kqFipDesl:     3,
        kqFipSulf:     4,
        kqFipSulf2:    5,
        kqClp:         6,
        kqClpMe:       7,
        kqClpMeDes:    8
      },
      headerRows: 2,
      textReplacements: {},
      checkboxLines: {
        'Tất cả mẫu thử đều không phát hiện':                          'checkTatCaND',
        'Có mẫu thử phát hiện':                                         'checkCoMauPhatHien',
        'Mẫu kiểm tra nội bộ':                                          'qcKiemTraNoiBo',
        'Hệ số hồi quy tuyến tính':                                      'qcR2',
        'Độ lệch thời gian lưu':                                         'qcThoiGianLuu',
        'Các yêu cầu về nhận dạng khi phát hiện mẫu nhiễm':            'qcNhanDang',
        'Các yêu cầu về nhận dạng của mẫu thêm chuẩn tại 5ppb':       'qcThemChuan',
        'Độ thu hồi IS':                                                 'qcThuHoi',
        'Đánh giá chung':                                                'qcDanhGiaChung'
      },
      signaturePlaceholders: {
        'date1': 'ngayNguoiPhanTich',
        'date2': 'ngayNguoiThamTra',
      }
    },
    'tbvtv-thuc-pham-gcmsms': {
      folderName: 'TBVTV thực phẩm (GC-MS/MS)',
      formType: 'type3b',
      defaultFontSize: 13,
      columns: {},
      checkboxLines: {},
      signaturePlaceholders: {
        'date1': 'ngayNguoiPhanTich',
        'date2': 'ngayNguoiThamTra',
      },
      resultColumns: [
        { key: '1_naphthol' }, { key: 'acetamiprid' }, { key: 'aldrin' }, { key: 'azinphos_methyl' }, { key: 'azoxystrobin' },
        { key: 'bhc_alpha_benzene_hexachloride' }, { key: 'bhc_beta' }, { key: 'bhc_delta' }, { key: 'bhc_epsilon' },
        { key: 'bhc_gamma_lindane_gamma_hch' }, { key: 'bifenthrin' }, { key: 'chlordane_cis_alpha' }, { key: 'chlordane_oxy' },
        { key: 'chlordane_trans_gamma' }, { key: 'chloroneb' }, { key: 'chlorothalonil' }, { key: 'chlorpropham' },
        { key: 'chlorpyrifos' }, { key: 'chlorpyrifos_methyl' }, { key: 'ddd_op' }, { key: 'ddd_pp' }, { key: 'dde_op' },
        { key: 'dde_pp' }, { key: 'ddt_op' }, { key: 'ddt_pp' }, { key: 'diazinon' }, { key: 'dichlorvos' }, { key: 'dieldrin' },
        { key: 'difenoconazole' }, { key: 'dimethoate' }, { key: 'endosulfan_i_alpha_isomer' }, { key: 'endosulfan_ii_beta_isomer' },
        { key: 'endosulfan_sulfate' }, { key: 'endrin' }, { key: 'ethion' }, { key: 'fenpropathrin' }, { key: 'fipronil' },
        { key: 'fipronil_desulfinyl' }, { key: 'fipronil_sulfide' }, { key: 'fipronil_sulfone' }, { key: 'heptachlor' },
        { key: 'heptachlor_endo_epoxide_isomer_a' }, { key: 'heptachlor_exo_epoxide_isomer_b' }, { key: 'hexachlorobenzene' },
        { key: 'imazalil' }, { key: 'isodrin' }, { key: 'malathion' }, { key: 'metalaxyl' }, { key: 'methoxychlor_pp_' },
        { key: 'mirex' }, { key: 'mgk_264' }, { key: 'metolachlor' }, { key: 'nonachlor_cis' }, { key: 'nonachlor_trans' },
        { key: 'pentachloroaniline' }, { key: 'pentachlorobenzene' }, { key: 'permethrin_cis' }, { key: 'permethrin_trans' },
        { key: 'pronamide' }, { key: 'omethoate' }, { key: 'piperonyl_butoxide' }, { key: 'pirimiphos_methyl' },
        { key: 'profenofos' }, { key: 'propanil' }, { key: 'propiconazole' }, { key: 'simazine' }, { key: 'tefluthrin' },
        { key: 'tetraconazole' }
      ],
      compounds: [
        '1-Naphthol', 'Acetamiprid', 'Aldrin', 'Azinphos-methyl', 'Azoxystrobin',
        'BHC-alpha (benzene hexachloride)', 'BHC-beta', 'BHC-delta', 'BHC-epsilon',
        'BHC-gamma (Lindane, gamma HCH)', 'Bifenthrin', 'Chlordane-cis (alpha)', 'Chlordane-oxy',
        'Chlordane-trans (gamma)', 'Chloroneb', 'Chlorothalonil', 'Chlorpropham',
        'Chlorpyrifos', 'Chlorpyrifos-methyl', 'DDD-o,p\'', 'DDD-p,p\'', 'DDE-o,p\'',
        'DDE-p,p\'', 'DDT-o,p\'', 'DDT-p,p\'', 'Diazinon', 'Dichlorvos', 'Dieldrin',
        'Difenoconazole', 'Dimethoate', 'Endosulfan I (alpha isomer)', 'Endosulfan II (beta isomer)',
        'Endosulfan sulfate', 'Endrin', 'Ethion', 'Fenpropathrin', 'Fipronil',
        'Fipronil-desulfinyl', 'Fipronil-sulfide', 'Fipronil-sulfone', 'Heptachlor',
        'Heptachlor endo-epoxide (isomer A)', 'Heptachlor exo-epoxide (isomer B)', 'Hexachlorobenzene',
        'Imazalil', 'Isodrin', 'Malathion', 'Metalaxyl', 'Methoxychlor, p,p\'-',
        'Mirex', 'MGK-264', 'Metolachlor', 'Nonachlor cis', 'Nonachlor trans',
        'Pentachloroaniline', 'Pentachlorobenzene', 'Permethrin cis', 'Permethrin trans',
        'Pronamide', 'Omethoate', 'Piperonyl butoxide', 'Pirimiphos-methyl',
        'Profenofos', 'Propanil', 'Propiconazole', 'Simazine', 'Tefluthrin',
        'Tetraconazole'
      ]
    },
    'tbvtv-trong-nuoc-gcmsms': {
      folderName: 'TBVTV trong nước (GC-MS/MS)',
      formType: 'type3b',
      defaultFontSize: 13,
      columns: {},
      checkboxLines: {},
      signaturePlaceholders: {
        'date1': 'ngayNguoiPhanTich',
        'date2': 'ngayNguoiThamTra',
      },
      resultColumns: [
        { key: 'alachlor' }, { key: 'atrazine' }, { key: 'azoxystrobin' }, { key: 'bitertanol' }, { key: 'boscalid' },
        { key: 'buprofezin' }, { key: 'butachlor' }, { key: 'chlorfenapyr' }, { key: 'chlorothalonil' }, { key: 'cyproconazole' },
        { key: 'cyprodinil' }, { key: 'dicloran' }, { key: 'difenoconazole' }, { key: 'fenbuconazole' }, { key: 'fenoxanil' },
        { key: 'fipronil' }, { key: 'fluazifop' }, { key: 'fludioxonil' }, { key: 'flufenacet' }, { key: 'flusilazole' },
        { key: 'flutriafol' }, { key: 'hexaconazole' }, { key: 'imazalil' }, { key: 'kresoxim_methyl' }, { key: 'mecarbam' },
        { key: 'mefenacet' }, { key: 'molinate' }, { key: 'nitrothal_isopropyl' }, { key: 'paclobutrazol' }, { key: 'phosmet' },
        { key: 'phosphamidon' }, { key: 'piperonyl_butoxide' }, { key: 'pirimiphos_methyl' }, { key: 'profenofos' }, { key: 'propanil' },
        { key: 'propiconazole' }, { key: 'propoxur' }, { key: 'silafluofen' }, { key: 'simazine' }, { key: 'tebuconazole' },
        { key: 'tebufenpyrad' }, { key: 'tebuthiuron' }, { key: 'tetraconazole' }, { key: 'thiabendazole' }, { key: 'triadimenol' },
        { key: 'triazophos' }, { key: 'tricyclazole' }, { key: 'trifluralin' }, { key: 'uniconazole' }, { key: 'vamidothion' },
        { key: 'vinclozolin' }, { key: 'bifenthrin' }, { key: 'cyfluthrin_baythroid' }, { key: 'lamda_cyhalothrin' }, { key: 'deltamethrin' },
        { key: 'tralomethrin' }, { key: 'ethofenprox' }, { key: 'permethrin_cis' }, { key: 'permethrin_trans' }, { key: 'fenpropathrin' },
        { key: 'flucythrinate' }, { key: 'fenvalerate' }, { key: 'cypermethrins' }, { key: 'tefluthrin' }, { key: 'acephate' },
        { key: 'azinphos_methyl' }, { key: 'cadusafos' }, { key: 'chlorpyrifos' }, { key: 'chlorpyrifos_methyl' }, { key: 'diazinon' },
        { key: 'dimethoate' }, { key: 'edifenphos' }, { key: 'ethion' }, { key: 'ethoprophos_ethoprop' }, { key: 'fenitrothion' },
        { key: 'fenthion' }, { key: 'fipronil_sulfide' }, { key: 'fipronil_sulfone' }, { key: 'fipronil_desulfinyl' }, { key: 'iprobenfos' },
        { key: 'malathion' }, { key: 'mefenoxam' }, { key: 'metalaxyl' }, { key: 'methacrifos' }, { key: 'methidathion' },
        { key: 'monocrotophos' }, { key: 'omethoate' }, { key: 'parathion' }, { key: 'parathion_methyl' }, { key: 'phenthoate' },
        { key: 'phorate' }, { key: 'quinalphos' }, { key: 'ronnel_fenchlorphos' }, { key: 'aldrin' }, { key: 'bhc_alpha_benzene_hexachloride' },
        { key: 'bhc_beta' }, { key: 'bhc_delta' }, { key: 'bhc_epsilon' }, { key: 'bhc_gamma_lindane_gamma_hch' }, { key: 'chlordane_cis_alpha' },
        { key: 'chlordane_oxy' }, { key: 'chlordane_trans_gamma' }, { key: 'ddd_op' }, { key: 'ddd_pp' }, { key: 'dde_op' },
        { key: 'dde_pp' }, { key: 'ddt_op' }, { key: 'ddt_pp' }, { key: 'dieldrin' }, { key: 'endosulfan_i_alpha_isomer' },
        { key: 'endosulfan_ii_beta_isomer' }, { key: 'endosulfan_sulfate' }, { key: 'endrin' }, { key: 'heptachlor' }, { key: 'heptachlor_endo_epoxide_isomer_a' },
        { key: 'heptachlor_exo_epoxide_isomer_b' }, { key: 'hexachlorobenzene' }, { key: 'isodrin' }, { key: 'methoxychlor_pp_' }, { key: 'mirex' },
        { key: 'pendimethalin' }
      ],
      compounds: [
        'Alachlor', 'Atrazine', 'Azoxystrobin', 'Bitertanol', 'Boscalid',
        'Buprofezin', 'Butachlor', 'Chlorfenapyr', 'Chlorothalonil', 'Cyproconazole',
        'Cyprodinil', 'Dicloran', 'Difenoconazole', 'Fenbuconazole', 'Fenoxanil',
        'Fipronil', 'Fluazifop', 'Fludioxonil', 'Flufenacet', 'Flusilazole',
        'Flutriafol', 'Hexaconazole', 'Imazalil', 'Kresoxim methyl', 'Mecarbam',
        'Mefenacet', 'Molinate', 'Nitrothal-Isopropyl', 'Paclobutrazol', 'Phosmet',
        'Phosphamidon', 'Piperonyl butoxide', 'Pirimiphos-methyl', 'Profenofos', 'Propanil',
        'Propiconazole', 'Propoxur', 'Silafluofen', 'Simazine', 'Tebuconazole',
        'Tebufenpyrad', 'Tebuthiuron', 'Tetraconazole', 'Thiabendazole', 'Triadimenol',
        'Triazophos', 'Tricyclazole', 'Trifluralin', 'Uniconazole', 'Vamidothion',
        'Vinclozolin', 'Bifenthrin', 'Cyfluthrin (Baythroid)', 'lamda-Cyhalothrin', 'Deltamethrin',
        'Tralomethrin', 'Ethofenprox', 'Permethrin cis', 'Permethrin trans', 'Fenpropathrin',
        'Flucythrinate', 'Fenvalerate', 'Cypermethrin', 'Tefluthrin', 'Acephate',
        'Azinfos-methyl', 'Cadusafos', 'Chlorpyrifos', 'Chlorpyrifos-methyl', 'Diazinon',
        'Dimethoate', 'Edifenfos', 'Ethion', 'Ethoprophos (Ethoprop)', 'Fenitrothion',
        'Fenthion', 'Fipronil-sulfide', 'Fipronil-sulfone', 'Fipronil-desulfinyl', 'Iprobenfos',
        'Malathion', 'Mefenoxam', 'Metalaxyl', 'Methacrifos', 'Methidathion',
        'Monocrotophos', 'Omethoate', 'Parathion', 'Parathion-methyl', 'Phenthoate',
        'Phorate', 'Quinalphos', 'Ronnel (Fenchlorphos)', 'Aldrin', 'BHC-alpha (benzene hexachloride)',
        'BHC-beta', 'BHC-delta', 'BHC-epsilon', 'BHC-gamma (Lindane, gamma HCH)', 'Chlordane-cis (alpha)',
        'Chlordane-oxy', 'Chlordane-trans (gamma)', 'DDD-o,p\'', 'DDD-p,p\'', 'DDE-o,p\'',
        'DDE-p,p\'', 'DDT-o,p\'', 'DDT-p,p\'', 'Dieldrin', 'Endosulfan I (alpha isomer)',
        'Endosulfan II (beta isomer)', 'Endosulfan sulfate', 'Endrin', 'Heptachlor', 'Heptachlor endo-epoxide (isomer A)',
        'Heptachlor exo-epoxide (isomer B)', 'Hexachlorobenzene', 'Isodrin', 'Methoxychlor, p,p\'-', 'Mirex',
        'Pendimethalin', 'Pirimiphos methyl', 'lambda-Cyhalothrin', 'Edifenphos', 'Azinphos-methyl', 'Cypermethrins'
      ]
    }
  }
};
