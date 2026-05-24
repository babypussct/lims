const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function inspectCleanDocx(filename) {
    const docxPath = path.join(__dirname, '..', filename);
    const tempDir = path.join(__dirname, '..', filename + '_temp_extracted');
    if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
    }
    fs.mkdirSync(tempDir);

    try {
        const psCommand = `Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::ExtractToDirectory('${docxPath}', '${tempDir}')`;
        execSync(`powershell -Command "${psCommand}"`, { stdio: 'ignore' });
        
        const xmlPath = path.join(tempDir, 'word', 'document.xml');
        if (fs.existsSync(xmlPath)) {
            const xml = fs.readFileSync(xmlPath, 'utf8');
            const matches = xml.match(/<w:t[^>]*>([^<]*)<\/w:t>/g) || [];
            const textList = matches.map(m => {
                const match = m.match(/<w:t[^>]*>([^<]*)<\/w:t>/);
                return match ? match[1] : "";
            });
            const fullText = textList.join(" ");
            const matchesTitle = fullText.match(/(XÁC ĐỊNH DƯ LƯỢNG [^.]+)/i);
            const title = matchesTitle ? matchesTitle[1] : "Title not found";
            console.log(`${filename}: "${title.substring(0, 150)}"`);
        }
    } catch (e) {
        console.log(`Error reading ${filename}: ${e.message}`);
    } finally {
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    }
}

const files = [
    'filebieumau_FORM_CLEAN4.docx',
    'filebieumau_FORM_CLEAN5.docx',
    'filebieumau_FORM_CLEAN6.docx'
];

files.forEach(f => {
    inspectCleanDocx(f);
});
