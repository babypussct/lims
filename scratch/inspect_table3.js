const fs = require('fs');
const path = require('path');

const srcXmlPath = path.join(__dirname, '..', 'FILEBIEUMAUGOC', 'filebieumau4_extracted', 'word', 'document.xml');

if (!fs.existsSync(srcXmlPath)) {
    console.error("Source XML file not found at " + srcXmlPath);
    process.exit(1);
}

const xml = fs.readFileSync(srcXmlPath, 'utf8');

const tblMatches = [...xml.matchAll(/<w:tbl[\s\S]*?<\/w:tbl>/g)];
if (tblMatches.length > 3) {
    const tblXml = tblMatches[3][0]; // Table 3 (index 3 in 0-indexed matches)
    const trMatches = [...tblXml.matchAll(/<w:tr[\s\S]*?<\/w:tr>/g)];
    console.log("Table 3 rows count:", trMatches.length);
    
    for (let r = 0; r < trMatches.length; r++) {
        const trXml = trMatches[r][0];
        const tcMatches = [...trXml.matchAll(/<w:tc[\s\S]*?<\/w:tc>/g)];
        const cells = tcMatches.map(tc => {
            const tMatches = [...tc[0].matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)];
            return tMatches.map(t => t[1]).join("").trim();
        });
        console.log(`Row ${r}:`, cells);
    }
} else {
    console.error("Table 3 not found!");
}
