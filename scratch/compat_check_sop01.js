// Inspect SOP-01 form tables and key text to check GAS script compatibility
const fs = require('fs');
const path = require('path');

const xmlPath = path.join(__dirname, '..', 'filebieumau_FORM_CLEAN_extracted', 'word', 'document.xml');
if (!fs.existsSync(xmlPath)) {
    console.error('Run build_docx first to populate FORM_CLEAN_extracted');
    process.exit(1);
}
const xml = fs.readFileSync(xmlPath, 'utf8');

const OUT = path.join(__dirname, 'compat_check_sop01.txt');
let out = [];

// Extract all text from the document preserving order
function extractAllText(xmlStr) {
    const results = [];
    const paraRegex = /<w:p\b[^>]*>([\s\S]*?)<\/w:p>/g;
    let pm;
    let pIdx = 0;
    while ((pm = paraRegex.exec(xmlStr)) !== null) {
        const tMatches = pm[1].match(/<w:t\b[^>]*>([\s\S]*?)<\/w:t>/g) || [];
        const text = tMatches.map(t => { const m = t.match(/<w:t[^>]*>([\s\S]*?)<\/w:t>/); return m ? m[1] : ''; }).join('').trim();
        if (text) results.push({ pIdx, text });
        pIdx++;
    }
    return results;
}

const allText = extractAllText(xml);
out.push('=== ALL TEXT IN CLEAN FORM (SOP-01) ===');
allText.forEach(({ pIdx, text }) => out.push(`  P${pIdx}: "${text}"`));

// Check tables
const tableRegex = /<w:tbl\b[\s\S]*?<\/w:tbl>/g;
let tMatch;
let tIdx = 0;
out.push('\n=== TABLES IN CLEAN FORM ===');
while ((tMatch = tableRegex.exec(xml)) !== null) {
    const rows = tMatch[0].match(/<w:tr\b[\s\S]*?<\/w:tr>/g) || [];
    const numRows = rows.length;
    // Get all text from first row
    const firstRowText = rows.length > 0 ? (rows[0].match(/<w:t\b[^>]*>([\s\S]*?)<\/w:t>/g) || [])
        .map(t => { const m = t.match(/<w:t[^>]*>([\s\S]*?)<\/w:t>/); return m ? m[1] : ''; }).join(' | ').substring(0, 200) : '';
    // Count cols in first row
    const colCount = (rows.length > 0) ? (rows[0].match(/<w:tc\b/g) || []).length : 0;
    out.push(`Table ${tIdx}: ${numRows} rows × ${colCount} cols`);
    out.push(`  Header: "${firstRowText}"`);
    tIdx++;
}

// GAS config expects checkboxLines:
const checkboxKeys = [
    'Các mẫu thử không phát hiện nhóm Fipronil và Chlorpyrifos',
    'Có mẫu thử phát hiện nhóm Fipronil và Chlorpyrifos',
    'Mẫu kiểm tra nội bộ',
    'R2 >= 0.99',
    'Độ lệch thời gian lưu',
    'Nhận dạng mẫu nhiễm',
    'Nhận dạng mẫu thêm chuẩn',
    'Độ thu hồi IS',
    'Đánh giá chung'
];
out.push('\n=== CHECKBOX LINE COMPATIBILITY CHECK ===');
checkboxKeys.forEach(key => {
    const found = xml.includes(key);
    out.push(`  ${found ? '✅' : '❌'} "${key}"`);
});

// signaturePlaceholders: date1, date2
out.push('\n=== SIGNATURE PLACEHOLDER CHECK ===');
['date1', 'date2', 'ngayNguoiPhanTich', 'ngayNguoiThamTra',
 'Ngày/ Người phân tích', 'Ngày/ Người thẩm tra',
 '{{NgayPhanTich}}', '{{NguoiPhanTich}}'].forEach(ph => {
    out.push(`  ${xml.includes(ph) ? '✅' : '❌'} "${ph}" present in form`);
});

// Table header detection: 'Lọ số', 'Mẫu thử', 'Mã số mẫu'
out.push('\n=== SAMPLE TABLE DETECTION CHECK ===');
['Lọ số', 'Mẫu thử', 'Mã số mẫu', 'Vial No'].forEach(kw => {
    out.push(`  ${xml.includes(kw) ? '✅' : '❌'} keyword "${kw}" present`);
});

fs.writeFileSync(OUT, out.join('\n'), 'utf8');
console.log('Written to ' + OUT);
