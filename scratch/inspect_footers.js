const fs = require('fs');
const path = require('path');

const srcFolder = path.join(__dirname, '..', 'FILEBIEUMAUGOC', 'filebieumau4_extracted', 'word');

function inspectFooter(filename) {
    const filePath = path.join(srcFolder, filename);
    if (!fs.existsSync(filePath)) {
        console.log(`${filename}: not found`);
        return;
    }
    const xml = fs.readFileSync(filePath, 'utf8');
    const text = [...xml.matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)].map(m => m[1]).join("").trim();
    console.log(`\n=== ${filename} ===`);
    console.log(`Text content: "${text}"`);
    console.log(`Raw XML snippet:`, xml.substring(0, 300));
}

inspectFooter("footer1.xml");
inspectFooter("footer2.xml");
inspectFooter("footer3.xml");
