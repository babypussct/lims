const fs = require('fs');
const path = require('path');

const wordDir = path.join(__dirname, '..', 'filebieumau3_extracted', 'word');

function extractText(xmlStr) {
    const textMatches = xmlStr.match(/<w:t[^>]*>([^<]*)<\/w:t>/g) || [];
    return textMatches.map(m => {
        const match = m.match(/<w:t[^>]*>([^<]*)<\/w:t>/);
        return match ? match[1] : "";
    }).join(" ");
}

const files = fs.readdirSync(wordDir);
files.forEach(f => {
    if (f.startsWith('header') || f.startsWith('footer')) {
        const content = fs.readFileSync(path.join(wordDir, f), 'utf8');
        const text = extractText(content).trim();
        console.log(`${f}: "${text}"`);
    }
});
