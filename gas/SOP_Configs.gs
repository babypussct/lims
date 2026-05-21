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
    'dichlorvos-gcms':        'PASTE_GOOGLE_DOC_ID_HERE',   // (chưa có file form)
    'chlor-huu-co':           'PASTE_GOOGLE_DOC_ID_HERE',   // (chưa có file form)
    'lan-huu-co':             'PASTE_GOOGLE_DOC_ID_HERE',   // (chưa có file form)
  },

  // Cấu hình định dạng biểu mẫu cho từng SOP (đọc/ghi dữ liệu bảng)
  SOP_CONFIG: {
    'trifluralin-gcms': {
      folderName: 'Trifluralin (GC-MS)',
      formType: 'type2',
      sampleTableIndex: 2,   // table index trong Google Doc (0-based)
      columns: {
        loSo:          0,    // col index "Lọ số"
        maSoMau:       1,    // col index "Mẫu thử"
        kqTrifluralin: 2,    // col index "KQ Trifluralin (µg/kg)"
        ghiChu:        3,    // col index "Ghi chú"
      },
      maSoMauChunkSize: 7,   // Tự động ngắt dòng cột mã số mẫu sau mỗi 7 ký tự (chỉ áp dụng cho Trifluralin)
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
      sampleTableIndex: 2,
      columns: {
        loSo:          0, // Lọ số / Vial
        maSoMau:       1, // Mẫu thử
        kqFip:         2, // Fipronil
        kqFipDesl:     3, // Fipronil desulfinyl
        kqFipSulf:     4, // Fipronil sulfide
        kqFipSulf2:    5, // Fipronil sulfone
        kqClp:         6, // Chlorpyrifos
        kqClpMe:       7, // Chlorpyrifos methyl
        kqClpMeDes:    8, // Chlorpyriphos-methyl-desmethyl
        ghiChu:        9  // Ghi chú
      },
      headerRows: 2,         // Row 0: merged header; Row 1: compound sub-headers
      textReplacements: {},
      checkboxLines: {
        // Khớp đúng text trong form (trang 2, section 9)
        'Tất cả mẫu thử đều không phát hiện':                          'checkTatCaND',
        'Có mẫu thử phát hiện':                                         'checkCoMauPhatHien',
        // Khớp đúng text trong bảng QC (section 8) — col 0 của từng hàng
        'Mẫu kiểm tra nội bộ':                                          'qcKiemTraNoiBo',
        'R2 \u2265 0.99':                                               'qcR2',          // ≥ (U+2265)
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
      sampleTableIndex: 2,
      columns: {
        maSoMau:       0, // Mã số mẫu
        khoiLuong:     1, // Khối lượng (g)
        heSoPhaLoang:  2, // Hệ số pha loãng F
        soVial:        3, // Số vial
        kqDichlorvos:  4  // Kết quả (ng/g)
      },
      headerRows: 1,
      textReplacements: {},
      checkboxLines: {
        'Các mẫu thử không phát hiện Dichlorvos': 'checkTatCaND',
        'Có mẫu thử phát hiện Dichlorvos':        'checkCoMauPhatHien',
      },
      signaturePlaceholders: {
        'date1': 'ngayNguoiPhanTich',
        'date2': 'ngayNguoiThamTra',
      }
    },
    'chlor-huu-co': {
      folderName: 'Chlor hữu cơ (Type 3B)',
      formType: 'type3b',
      columns: {}, // Sử dụng text replacements động cho Dạng 3B
      checkboxLines: {
        'Mẫu kiểm tra nội bộ':                                       'qcKiemTraNoiBo',
        'Độ thu hồi R%':                                             'qcThuHoiR',
        'Hệ số tuyến tính R2':                                       'qcR2',
        'Độ lệch thời gian lưu':                                     'qcThoiGianLuu',
        'S/N':                                                       'qcSN',
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
      ]
    },
    'lan-huu-co': {
      folderName: 'Lân hữu cơ (Type 3B)',
      formType: 'type3b',
      columns: {}, // Sử dụng text replacements động cho Dạng 3B
      checkboxLines: {
        'Mẫu kiểm tra nội bộ':                                       'qcKiemTraNoiBo',
        'Độ thu hồi R%':                                             'qcThuHoiR',
        'Hệ số tuyến tính R2':                                       'qcR2',
        'Độ lệch thời gian lưu':                                     'qcThoiGianLuu',
        'S/N':                                                       'qcSN',
      },
      signaturePlaceholders: {
        'date1': 'ngayNguoiPhanTich',
        'date2': 'ngayNguoiThamTra',
      },
      resultColumns: [
        { key: 'Acephate' }, { key: 'AzinphosMethyl' }, { key: 'Cadusafos' }, { key: 'Chlorpyrifos' },
        { key: 'ChlorpyrifosMethyl' }, { key: 'Diazinon' }, { key: 'Dimethoate' }, { key: 'Edifenphos' },
        { key: 'Ethion' }, { key: 'Ethoprophos' }, { key: 'Fenitrothion' }, { key: 'Fenthion' },
        { key: 'Fipronil' }, { key: 'FipronilSulfide' }, { key: 'FipronilSulfone' }, { key: 'FipronilDesulfinyl' },
        { key: 'Iprobenfos' }, { key: 'Malathion' }, { key: 'Mefenoxam' }, { key: 'Metalaxyl' },
        { key: 'Methacrifos' }, { key: 'Methidathion' }, { key: 'Monocrotophos' }, { key: 'Omethoate' },
        { key: 'Parathion' }, { key: 'ParathionMethyl' }, { key: 'Phenthoate' }, { key: 'Phorate' },
        { key: 'Phosmet' }, { key: 'Phosphamidon' }, { key: 'PirimiphosMethyl' }, { key: 'Profenofos' },
        { key: 'Quinalphos' }, { key: 'Ronnel' }, { key: 'Triazophos' }, { key: 'Vamidothion' },
        { key: 'Chlorfenvinphos' }, { key: 'IsofenphosMethyl' }
      ]
    }
  }
};
