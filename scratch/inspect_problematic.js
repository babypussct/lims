const fs = require('fs');
const path = require('path');

const xmlPath = path.join(__dirname, '..', 'filebieumau_extracted', 'word', 'document.xml');
const xml = fs.readFileSync(xmlPath, 'utf8');

const bodyMatch = xml.match(/<w:body>([\s\S]*?)<\/w:body>/);
const bodyContent = bodyMatch[1];

const childRegex = /<(w:p|w:tbl|w:sectPr)\b[\s\S]*?<\/\1>|<(w:p|w:tbl|w:sectPr)\b[\s\S]*?\/>/g;

let children = [];
let match;
while ((match = childRegex.exec(bodyContent)) !== null) {
    children.push({ tag: match[1] || match[2], xml: match[0], index: children.length });
}

const OUT = path.join(__dirname, 'inspect_problematic.txt');
let out = [];

// Dump the raw XML of the problematic DRAWING+TXBX elements within the form
const PROBLEMATIC = [157, 159, 178, 193];
for (const idx of PROBLEMATIC) {
    const c = children[idx];
    out.push(`\n=== Index ${idx} [${c.tag}] === (first 3000 chars)`);
    out.push(c.xml.substring(0, 3000));
}

// Also dump the sectPr at index 211
out.push(`\n=== Index 211 [sectPr] === (first 3000 chars)`);
out.push(children[211].xml.substring(0, 3000));

// Check for inline sectPr in paragraphs within 147-195
out.push(`\n=== Paragraphs with inline <w:sectPr> in range 147-195 ===`);
for (let i = 147; i <= 195; i++) {
    const c = children[i];
    if (c && c.xml.includes('<w:sectPr')) {
        out.push(`Index ${i}: HAS INLINE sectPr`);
        out.push(c.xml.substring(0, 2000));
    }
}

// Check what header/footer refs are in sectPr 211
out.push(`\n=== Header/Footer refs in sectPr 211 ===`);
const sectXml = children[211].xml;
const hrefs = sectXml.match(/<w:headerReference[^/]*\/>/g) || [];
const frefs = sectXml.match(/<w:footerReference[^/]*\/>/g) || [];
hrefs.forEach(h => out.push('  ' + h));
frefs.forEach(f => out.push('  ' + f));

// Also dump document.xml.rels to see all relationship IDs
const relsPath = path.join(__dirname, '..', 'filebieumau_extracted', 'word', '_rels', 'document.xml.rels');
out.push(`\n=== document.xml.rels ===`);
out.push(fs.readFileSync(relsPath, 'utf8'));

fs.writeFileSync(OUT, out.join('\n'), 'utf8');
console.log('Written to ' + OUT);
