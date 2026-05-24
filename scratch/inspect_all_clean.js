const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Helper to read text from extracted zip (if possible) or docx using adm-zip if installed
// Since we have adm-zip or can use it, let's write a simple function that unzips word/document.xml in memory
function getDocxText(docxPath) {
    const tempDir = path.join(__dirname, '..', 'temp_extract');
    if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
    }
    fs.mkdirSync(tempDir);

    try {
        // Use powershell to extract since we are on Windows
        const psCommand = `Expand-Archive -Path "${docxPath}" -DestinationPath "${tempDir}" -Force`;
        execSync(`powershell -Command "${psCommand}"`, { stdio: 'ignore' });
        
        const xmlPath = path.join(tempDir, 'word', 'document.xml');
        if (fs.existsSync(xmlPath)) {
            const xml = fs.readFileSync(xmlPath, 'utf8');
            const matches = xml.match(/<w:t[^>]*>([^<]*)<\/w:t>/g) || [];
            const text = matches.map(m => {
                const match = m.match(/<w:t[^>]*>([^<]*)<\/w:t>/);
                return match ? match[1] : "";
            }).join(" ");
            
            // Count tables
            const tableCount = (xml.match(/<w:tbl\b/g) || []).length;
            
            return {
                exists: true,
                textLength: text.length,
                sampleText: text.substring(0, 300),
                tableCount: tableCount
            };
        }
    } catch (e) {
        return { exists: false, error: e.message };
    } finally {
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    }
    return { exists: false };
}

const files = [
    'filebieumau2.docx',
    'filebieumau2_FORM_CLEAN.docx',
    'filebieumau3.docx',
    'filebieumau_FORM_CLEAN3.docx',
    'filebieumau_FORM_CLEAN4.docx',
    'filebieumau_FORM_CLEAN5.docx',
    'filebieumau_FORM_CLEAN6.docx'
];

files.forEach(f => {
    const filePath = path.join(__dirname, '..', f);
    if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        const info = getDocxText(filePath);
        console.log(`\n=== File: ${f} (${stats.size} bytes) ===`);
        if (info.exists) {
            console.log(`  Tables: ${info.tableCount}`);
            console.log(`  Text length: ${info.textLength} chars`);
            console.log(`  Sample: "${info.sampleText.substring(0, 150)}..."`);
        } else {
            console.log(`  Error extracting or parsing: ${info.error}`);
        }
    } else {
        console.log(`\n=== File: ${f} (DOES NOT EXIST) ===`);
    }
});
