const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function extractFirstParagraphs(extractedDir, name) {
    const xmlPath = path.join(extractedDir, 'word', 'document.xml');
    if (!fs.existsSync(xmlPath)) {
        return "Not extracted";
    }
    const xml = fs.readFileSync(xmlPath, 'utf8');
    const matches = xml.match(/<w:t[^>]*>([^<]*)<\/w:t>/g) || [];
    const textList = matches.map(m => {
        const match = m.match(/<w:t[^>]*>([^<]*)<\/w:t>/);
        return match ? match[1] : "";
    });
    
    // Find all titles in document
    const fullText = textList.join(" ");
    const matchesForm = fullText.match(/BIỂU MẪU GHI CHÉP KẾT QUẢ PHÂN TÍCH[\s\S]*?(XÁC ĐỊNH DƯ LƯỢNG [^.]+)/i) ||
                        fullText.match(/(XÁC ĐỊNH DƯ LƯỢNG [^.]+)/i);
    
    const formTitle = matchesForm ? matchesForm[1] : "Title not found";
    return formTitle;
}

const rawDirs = [
    { dir: 'filebieumau_extracted', file: 'filebieumau.docx' },
    { dir: 'filebieumau2_extracted', file: 'filebieumau2.docx' },
    { dir: 'filebieumau3_extracted', file: 'filebieumau3.docx' },
    { dir: 'filebieumau4_extracted', file: 'filebieumau4.docx' },
    { dir: 'filebieumau5_extracted', file: 'filebieumau5.docx' }
];

rawDirs.forEach(item => {
    const dirPath = path.join(__dirname, '..', item.dir);
    if (fs.existsSync(dirPath)) {
        const title = extractFirstParagraphs(dirPath, item.file);
        console.log(`${item.file}: "${title.substring(0, 150)}"`);
    } else {
        console.log(`${item.file}: (Extracted dir not found)`);
    }
});
