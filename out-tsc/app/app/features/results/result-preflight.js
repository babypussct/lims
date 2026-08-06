export function buildPublishPreflightSummary(args) {
    const { run, draft, config, configKey, activeFilter, samplesPerReport, unpublishedSamples = [] } = args;
    const includedSamples = (run.sampleList || []).filter((sample) => {
        const resObj = draft.resultData?.[sample] || {};
        const startsWithLetter = /^[a-zA-Z]/.test(sample);
        const prefix = startsWithLetter ? sample.charAt(0).toUpperCase() : '';
        const isSelected = resObj['selected'] !== false;
        const matchesFilter = activeFilter === 'ALL' || prefix === activeFilter;
        return isSelected && matchesFilter && !sample.startsWith('QC_');
    });
    const chunkSize = samplesPerReport || includedSamples.length || 1;
    const chunks = [];
    for (let i = 0; i < includedSamples.length; i += chunkSize) {
        chunks.push(includedSamples.slice(i, i + chunkSize));
    }
    const blockers = [];
    const warnings = [];
    const info = [];
    if (includedSamples.length === 0) {
        blockers.push('Chưa có mẫu nào được chọn trong phạm vi in hiện tại.');
    }
    if (!draft.page1Data?.ngayNguoiPhanTich) {
        blockers.push('Thiếu ngày ký Người phân tích.');
    }
    if (!draft.page1Data?.ngayNguoiThamTra) {
        blockers.push('Thiếu ngày ký Người thẩm tra.');
    }
    const needsR2 = config.formType === 'type3a'
        || config.formType === 'type3b'
        || ['trifluralin-gcms', 'dichlorvos-gcms', 'chloroform-gcms'].includes(configKey || '');
    const printFormType = String(draft.page1Data?.['printFormType'] || '');
    const formExposesR2 = doesPrintFormExposeR2(configKey, printFormType);
    if (formExposesR2 && needsR2 && !String(draft.page1Data?.['r2'] || '').trim()) {
        warnings.push('Chưa nhập hệ số xác định R².');
    }
    const activeColumns = Object.keys(config.columns || {})
        .filter(col => !['loSo', 'maSoMau', 'ghiChu', 'khoiLuong', 'heSoPhaLoang'].includes(col));
    const blankResultsMeanNd = configKey === 'fipronil-chlorpyrifos'
        || configKey === 'trifluralin-gcms'
        || run.sopId === 'SOP-01'
        || run.sopId === 'SOP-03';
    const missingResultSamples = includedSamples.filter((sample) => {
        // Một số SOP dạng type2 quy ước ô kết quả trống là ND hợp lệ.
        // Preflight không tự ghi "ND" vào draft; chỉ không chặn publish.
        if (blankResultsMeanNd)
            return false;
        const row = draft.resultData?.[sample] || {};
        if (config.formType === 'type3b' && Array.isArray(config.compounds)) {
            return !config.compounds.some((compound) => hasReportableValue(row[compound]) || row[`${compound}_nd`] === true);
        }
        return !activeColumns.some(col => hasReportableValue(row[col]));
    });
    if (missingResultSamples.length > 0) {
        blockers.push(`Có ${missingResultSamples.length} mẫu chưa có kết quả hoặc ND: ${missingResultSamples.slice(0, 8).join(', ')}${missingResultSamples.length > 8 ? '...' : ''}`);
    }
    const alreadyPublished = includedSamples.filter((sample) => !unpublishedSamples.includes(sample));
    if (alreadyPublished.length > 0) {
        warnings.push(`${alreadyPublished.length} mẫu trong phạm vi này đã từng có báo cáo. Lần in mới sẽ tạo phiên bản mới/phiếu mới.`);
    }
    if (chunks.length > 1) {
        info.push(`Sẽ tách thành ${chunks.length} phiếu, mỗi phiếu tối đa ${chunkSize} mẫu.`);
    }
    if (activeFilter !== 'ALL') {
        info.push(`Phạm vi in hiện tại: ${activeFilter === '' ? 'Không tiền tố' : 'Nhóm ' + activeFilter}.`);
    }
    if (draft.page1Data?.['printFormType']) {
        info.push(`Kiểu form: ${draft.page1Data['printFormType']}.`);
    }
    return { activeFilter, includedSamples, chunks, blockers, warnings, info };
}
function hasReportableValue(value) {
    return value !== null && value !== undefined && String(value).trim() !== '' && value !== 'N/A';
}
function doesPrintFormExposeR2(configKey, printFormType) {
    if (printFormType === 'formCheck')
        return false;
    // SOP 9.14 dùng tên formDayDu/formRutGon thay cho hệ formCheck/formDon.
    // Cả hai giao diện 9.14 đều không có trường R² nên preflight không được
    // yêu cầu một dữ liệu mà người dùng không thể nhập trên UI.
    if (configKey === 'tbvtv-thuc-pham-gcmsms'
        && (printFormType === 'formDayDu' || printFormType === 'formRutGon')) {
        return false;
    }
    return true;
}
//# sourceMappingURL=result-preflight.js.map