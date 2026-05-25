const fs = require('fs');
const path = require('path');

const srcXmlPath = path.join(__dirname, '..', 'FILEBIEUMAUGOC', 'filebieumau4_extracted', 'word', 'document.xml');

if (!fs.existsSync(srcXmlPath)) {
    console.error("Source XML file not found at " + srcXmlPath);
    process.exit(1);
}

const xml = fs.readFileSync(srcXmlPath, 'utf8');

const tblMatches = [...xml.matchAll(/<w:tbl[\s\S]*?<\/w:tbl>/g)];
if (tblMatches.length > 4) {
    const tblXml = tblMatches[4][0];
    const trMatches = [...tblXml.matchAll(/<w:tr[\s\S]*?<\/w:tr>/g)];
    if (trMatches.length > 2) {
        const trXml = trMatches[2][0]; // Row 2 (Aldrin)
        const tcMatches = [...trXml.matchAll(/<w:tc[\s\S]*?<\/w:tc>/g)];
        console.log("=== CELL 1 (Result) XML ===");
        console.log(tcMatches[1][0]);
        console.log("\n=== CELL 2 (QC1) XML ===");
        console.log(tcMatches[2][0]);
    }
}
