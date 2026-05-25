const fs = require('fs');
const path = require('path');

const srcXmlPath = path.join(__dirname, '..', 'FILEBIEUMAUGOC', 'filebieumau4_extracted', 'word', 'document.xml');
const xml = fs.readFileSync(srcXmlPath, 'utf8');

const matches = [...xml.matchAll(/<w:sectPr[\s\S]*?<\/w:sectPr>/g)];
console.log(`Found ${matches.length} section properties.`);

matches.forEach((m, idx) => {
    console.log(`\n--- Match ${idx} ---`);
    console.log(m[0]);
});
