const fs = require('fs');
const path = require('path');

const relsXmlPath = path.join(__dirname, '..', 'FILEBIEUMAUGOC', 'filebieumau4_extracted', 'word', '_rels', 'document.xml.rels');

if (!fs.existsSync(relsXmlPath)) {
    console.error("Relationships file not found at " + relsXmlPath);
    process.exit(1);
}

const xml = fs.readFileSync(relsXmlPath, 'utf8');
console.log("=== relationship elements ===");

const matches = [...xml.matchAll(/<Relationship[^>]*>/g)];
matches.forEach(m => {
    if (m[0].includes("header") || m[0].includes("footer")) {
        console.log(m[0]);
    }
});
