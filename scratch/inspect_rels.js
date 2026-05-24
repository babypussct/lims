const fs = require('fs');
const path = require('path');

const relsPath = path.join(__dirname, '..', 'filebieumau3_extracted', 'word', '_rels', 'document.xml.rels');

if (fs.existsSync(relsPath)) {
    const relsXml = fs.readFileSync(relsPath, 'utf8');
    console.log("--- Relationships in document.xml.rels ---");
    const matches = relsXml.match(/<Relationship[^>]*>/g) || [];
    matches.forEach(m => {
        if (m.includes('header') || m.includes('footer') || m.includes('rId17') || m.includes('rId18') || m.includes('rId19')) {
            console.log(m);
        }
    });
} else {
    console.log("document.xml.rels not found");
}

// Also check what header/footer files exist in word/
const wordDir = path.join(__dirname, '..', 'filebieumau3_extracted', 'word');
if (fs.existsSync(wordDir)) {
    const files = fs.readdirSync(wordDir);
    console.log("\n--- Header and Footer files in word/ ---");
    files.forEach(f => {
        if (f.startsWith('header') || f.startsWith('footer')) {
            const stats = fs.statSync(path.join(wordDir, f));
            console.log(`  ${f} (${stats.size} bytes)`);
        }
    });
}
