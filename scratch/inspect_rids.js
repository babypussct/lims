// Check what rId17, rId18, rId19 are, and dump the FULL xml of element 148 and 183 before and after stripping
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'inspect_rids.txt');
let out = [];

// Read rels file
const relsXml = fs.readFileSync(
    path.join(__dirname, '..', 'filebieumau_extracted', 'word', '_rels', 'document.xml.rels'), 'utf8');

// Extract all relationships
const relMatches = relsXml.match(/<Relationship[^/]*\/>/g) || [];
out.push('=== All Relationships ===');
relMatches.forEach(r => out.push(r));

// Identify rId17, rId18, rId19
['rId17', 'rId18', 'rId19'].forEach(rid => {
    const m = relsXml.match(new RegExp(`Id="${rid}"[^/]*/>`));
    out.push(`\n${rid}: ${m ? m[0] : 'NOT FOUND'}`);
});

// Now dump element 148 full xml (the one with inline sectPr referencing rId17)
const xmlPath = path.join(__dirname, '..', 'filebieumau_extracted', 'word', 'document.xml');
const xml = fs.readFileSync(xmlPath, 'utf8');
const bodyMatch = xml.match(/<w:body>([\s\S]*?)<\/w:body>/);
const bodyContent = bodyMatch[1];
const childRegex = /<(w:p|w:tbl|w:sectPr)\b[\s\S]*?<\/\1>|<(w:p|w:tbl|w:sectPr)\b[\s\S]*?\/>/g;
let children = [];
let m;
while ((m = childRegex.exec(bodyContent)) !== null) {
    children.push({ tag: m[1] || m[2], xml: m[0], index: children.length });
}

out.push('\n=== Element 148 FULL XML ===');
out.push(children[148].xml);

out.push('\n=== Element 183 FULL XML ===');
out.push(children[183].xml);

// Also dump the "sectPr from form" extracted from 195
out.push('\n=== Element 195 FULL XML ===');
out.push(children[195].xml);

// Check the CLEAN_EXTRACTED document.xml to verify our stripping worked
const cleanXmlPath = path.join(__dirname, '..', 'filebieumau_FORM_CLEAN_extracted', 'word', 'document.xml');
if (fs.existsSync(cleanXmlPath)) {
    const cleanXml = fs.readFileSync(cleanXmlPath, 'utf8');
    out.push('\n=== Clean document rId references ===');
    const rIdRefs = cleanXml.match(/r:id="(rId\d+)"/g) || [];
    const uniqueRIds = [...new Set(rIdRefs.map(r => r.match(/"(rId\d+)"/)[1]))];
    out.push('All r:id in clean document: ' + uniqueRIds.join(', '));
    out.push('sectPr portion of clean doc:');
    const sectPrMatch = cleanXml.match(/<w:sectPr[\s\S]*?<\/w:sectPr>/);
    if (sectPrMatch) out.push(sectPrMatch[0]);
    else out.push('No sectPr found!');
    
    // Check if rId17/18/19 still appear
    ['rId17', 'rId18', 'rId19'].forEach(rid => {
        const count = (cleanXml.match(new RegExp(rid, 'g')) || []).length;
        out.push(`${rid} occurrences in clean doc: ${count}`);
    });
}

fs.writeFileSync(OUT, out.join('\n'), 'utf8');
console.log('Written to ' + OUT);
