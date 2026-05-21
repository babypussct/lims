// Check EVERY element in document for drawing inside txbxContent (the actual source of the error)
const fs = require('fs');
const path = require('path');

const xmlPath = path.join(__dirname, '..', 'filebieumau_extracted', 'word', 'document.xml');
const xml = fs.readFileSync(xmlPath, 'utf8');

const OUT = path.join(__dirname, 'find_drawing_in_txbx.txt');
let out = [];

// Strategy: find all <w:txbxContent>...</w:txbxContent> and check for nested <w:drawing> or <v:shape>
const txbxRegex = /<w:txbxContent[\s\S]*?<\/w:txbxContent>/g;
let txbxMatch;
let txbxIdx = 0;
while ((txbxMatch = txbxRegex.exec(xml)) !== null) {
    const content = txbxMatch[0];
    if (content.includes('<w:drawing') || content.includes('<v:shape') || content.includes('<v:rect')) {
        out.push(`txbxContent #${txbxIdx} at char ${txbxMatch.index} CONTAINS DRAWING!`);
        out.push(content.substring(0, 2000));
    }
    txbxIdx++;
}

if (out.length === 0) {
    out.push('No txbxContent contains nested drawings. The error must be elsewhere.');
}

// Also check: does any footnote/endnote/comment have drawing?
const footnoteXml = fs.readFileSync(path.join(__dirname, '..', 'filebieumau_extracted', 'word', 'footnotes.xml'), 'utf8');
const endnoteXml = fs.readFileSync(path.join(__dirname, '..', 'filebieumau_extracted', 'word', 'endnotes.xml'), 'utf8');
out.push(`\nfootnotes.xml has drawing: ${footnoteXml.includes('<w:drawing')}`);
out.push(`endnotes.xml has drawing: ${endnoteXml.includes('<w:drawing')}`);

// Check for image reference rId15 (media/image1.wmf) - this is the OLE object from element 134
out.push(`\nOriginal doc has OLE object (oleObject1.bin rId16): ${xml.includes('rId16')}`);
out.push(`Original doc has image (image1.wmf rId15): ${xml.includes('rId15')}`);

// Check how many times rId15 and rId16 appear in our target range (147-194)
const bodyMatch = xml.match(/<w:body>([\s\S]*?)<\/w:body>/);
const bodyContent = bodyMatch[1];
const childRegex = /<(w:p|w:tbl|w:sectPr)\b[\s\S]*?<\/\1>|<(w:p|w:tbl|w:sectPr)\b[\s\S]*?\/>/g;
let children = [];
let m;
while ((m = childRegex.exec(bodyContent)) !== null) {
    children.push({ tag: m[1] || m[2], xml: m[0], index: children.length });
}

const rangeXml = children.filter(c => c.index >= 147 && c.index <= 194).map(c => c.xml).join('');
out.push(`\nIn range 147-194:`);
out.push(`  rId15 (image.wmf) references: ${(rangeXml.match(/rId15/g) || []).length}`);
out.push(`  rId16 (oleObject) references: ${(rangeXml.match(/rId16/g) || []).length}`);

// Count all rId references in range to check broken relationships
const rIdRefs = rangeXml.match(/r:id="(rId\d+)"/g) || [];
const uniqueRIds = [...new Set(rIdRefs.map(r => r.match(/"(rId\d+)"/)[1]))];
out.push(`  All rId references in range: ${uniqueRIds.join(', ')}`);

fs.writeFileSync(OUT, out.join('\n'), 'utf8');
console.log('Written to ' + OUT);
