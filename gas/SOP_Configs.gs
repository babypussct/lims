/**
 * LIMS Report Generator — Google Apps Script Configuration
 * ========================================================
 * Chứa cấu hình toàn cục về thư mục Drive và các chỉ tiêu phân tích (SOP).
 */

const CONFIG = {
  // Root folder ID chứa tất cả báo cáo (thư mục "LIMS_Reports" trên Drive)
  ROOT_FOLDER_ID: '1B8KctFU-KDCPAwxrg8N75Sipk5SlGJkE',

  // Template Google Doc IDs cho từng SOP (cập nhật sau khi upload file form gốc lên Drive)
  // Định dạng: 'config-key': 'GOOGLE_DOC_ID'  // SOP-XX | file gốc: <tên file>
  TEMPLATES: {
    'trifluralin-gcms':       '1FN0onAiYBuSBiQk3DWQQGXTxvhHaI8VSaxD2qgUUAxY',   // SOP-03 | FORM_GOC_TRIFLURALIN_9_3.docx
    'fipronil-chlorpyrifos':  '1LTP7q3pIW9IBIbJPzFmX43Sr3QxGj70MoBLity0HLVw',          // SOP-01 | FORM_GOC_FIP_CHLORFOS_9_21.docx
    'dichlorvos-gcms':        '15Vg_kdrEx1DQ-LyLuZVo8sKnjW7JFV7mQDAEE3xKywY',   // Dichlorvos/Dipterex(Trichlorfon)
    'chlor-huu-co':           '1xQNkNRcPtfmQjwyv5F2qx1E2VbCmeuPbnfCK3_AgAGQ',   // (filebieumau_FORM_TRANG4.docx)
    'lan-huu-co':             '1nSWI-KDXhcnzZK3k0X5o0Wn2rXQ2XeRx87jx8WJAM60',   // SOP-02 | TÊN Nhóm Lân hữu cơ (GC-MS/MS)
    'nhom-cuc':               '1ugk8Xx-LHYD7xrarxE01pG96fIA5Po7OMdjQ8htrys0',   // Nhóm Cúc (GC-MS/MS) - Form Check
    'nhom-cuc-don':           '1rlN0iNEG_beYHBX7VRsoJ6QQsMerKxian8OJni0Ha9A',   // Nhóm Cúc (GC-MS/MS) - Form Đơn
    'nhom-i':                 'PASTE_GOOGLE_DOC_ID_HERE',                       // Nhóm I (GC-MS/MS) - Form Check
    'nhom-i-don':             '14mDxiC6v8Xf_Eq4s-WC1xgxvjBvF2lWHMnNNB_qH-UE',   // Nhóm I (GC-MS/MS) - Form Đơn
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
      resultColumns: [
        { key: 'Aldrin' }, { key: 'BHCa' }, { key: 'BHCb' }, { key: 'BHCd' }, { key: 'BHCe' }, { key: 'BHCg' },
        { key: 'Chlordane_cis' }, { key: 'Chlordane_oxy' }, { key: 'Chlordane_trans' }, { key: 'DDD_op' },
        { key: 'DDD_pp' }, { key: 'DDE_op' }, { key: 'DDE_pp' }, { key: 'DDT_op' }, { key: 'DDT_pp' },
        { key: 'Dieldrin' }, { key: 'Endosulfan1' }, { key: 'Endosulfan2' }, { key: 'EndosulfanS' }, { key: 'Endrin' },
        { key: 'Heptachlor' }, { key: 'HeptachlorA' }, { key: 'HeptachlorB' }, { key: 'HCB' }, { key: 'Isodrin' },
        { key: 'Methoxychlor' }, { key: 'Mirex' }, { key: 'Pendimethalin' }
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
      resultColumns: [
        { key: 'Acephate' }, { key: 'AzinphosMethyl' }, { key: 'Cadusafos' }, { key: 'Chlorpyryfos' },
        { key: 'ChlorpyryfosMethyl' }, { key: 'Diazinon' }, { key: 'Dimethoate' }, { key: 'Edifenphos' },
        { key: 'Ethion' }, { key: 'Ethoprophos' }, { key: 'Fenitrothion' }, { key: 'Fenthion' },
        { key: 'Fipronil' }, { key: 'FipronilSulfide' }, { key: 'FipronilSulfone' }, { key: 'FipronilDesulfinyl' },
        { key: 'Iprobenfos' }, { key: 'Malathion' }, { key: 'Mefenoxam' }, { key: 'Metalaxyl' },
        { key: 'Methacrifos' }, { key: 'Methidathion' }, { key: 'Monocrotophos' }, { key: 'Omethoate' },
        { key: 'Parathion' }, { key: 'ParathionMethyl' }, { key: 'Phenthoate' }, { key: 'Phorate' },
        { key: 'Phosmet' }, { key: 'Phosphamidon' }, { key: 'PirimiphosMethyl' }, { key: 'Profenofos' },
        { key: 'Quinalphos' }, { key: 'Ronnel' }, { key: 'Triazophos' }, { key: 'Vamidothion' },
        { key: 'Chlorfenvinphos' }, { key: 'IsofenphosMethyl' }
      ],
      compounds: [
        'Acephate', 'Azinphos-methyl', 'Cadusafos', 'Chlorpyryfos', 'Chlorpyryfos-methyl',
        'Diazinon', 'Dimethoate', 'Edifenphos', 'Ethion', 'Ethoprophos',
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
      resultColumns: [
        { key: 'Bifenthrin' }, { key: 'CyfluthrinBaythroid' }, { key: 'lamdaCyhalothrin' }, { key: 'Deltamethrin' },
        { key: 'Tralomethrin' }, { key: 'Ethofenprox' }, { key: 'PermethrinCis' }, { key: 'PermethrinTrans' },
        { key: 'Fenpropathrin' }, { key: 'Silafluofen' }, { key: 'Flucythrinate' }, { key: 'Fenvalerate' },
        { key: 'Cypermethrins' }, { key: 'Tefluthrin' }
      ],
      compounds: [
        'Bifenthrin', 'Cyfluthrin (Baythroid)', 'lamda-Cyhalothrin', 'Deltamethrin',
        'Tralomethrin', 'Ethofenprox', 'Permethrin cis', 'Permethrin trans',
        'Fenpropathrin', 'Silafluofen', 'Flucythrinate', 'Fenvalerate',
        'Cypermethrins', 'Tefluthrin'
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
      resultColumns: [
        { key: 'Phosmet' }, { key: 'Phosphamidon' }, { key: 'PirimiphosMethyl' }, { key: 'Profenofos' },
        { key: 'Triazophos' }, { key: 'Vamidothion' }, { key: 'Difenoconazole' }, { key: 'Propiconazole' },
        { key: 'Tetraconazole' }, { key: 'Hexaconazole' }, { key: 'Triadimenol' }, { key: 'Paclobutrazol' },
        { key: 'Flutriafol' }, { key: 'Imazalil' }, { key: 'Uniconazole' }, { key: 'Tricyclazole' },
        { key: 'Flusilazole' }, { key: 'Cyproconazole' }, { key: 'Azoxystrobin' }, { key: 'Fenbuconazole' },
        { key: 'Tebuconazole' }, { key: 'Fipronil' }, { key: 'Bitertanol' }, { key: 'Boscalid' },
        { key: 'Buprofezin' }, { key: 'Butachlor' }, { key: 'Cyprodinil' }, { key: 'Dicloran' },
        { key: 'Fenoxanil' }, { key: 'Fluazifop' }, { key: 'Fludioxonil' }, { key: 'Flufenacet' },
        { key: 'KresoximMethyl' }, { key: 'Mecarbam' }, { key: 'Mefenacet' }, { key: 'Molinate' },
        { key: 'NitrothalIsopropyl' }, { key: 'Alachlor' }, { key: 'PiperonylButoxide' }, { key: 'Propanil' },
        { key: 'Propoxur' }, { key: 'Silafluofen' }, { key: 'Simazine' }, { key: 'Tebufenpyrad' },
        { key: 'Atrazine' }, { key: 'Tebuthiuron' }, { key: 'Thiabendazole' }, { key: 'Chlorfenapyr' },
        { key: 'Vinclozolin' }, { key: 'Trifluralin' }, { key: 'Chlorothalonil' }
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
    }
  }
};
