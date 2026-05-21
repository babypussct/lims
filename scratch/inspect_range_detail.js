const fs = require('fs');
const path = require('path');

const xmlPath = path.join(__dirname, '..', 'filebieumau_extracted', 'word', 'document.xml');
const xml = fs.readFileSync(xmlPath, 'utf8');

const bodyMatch = xml.match(/<w:body>([\s\S]*?)<\/w:body>/);
const bodyContent = bodyMatch[1];

const childRegex = /<(w:p|w:tbl|w:sectPr)\b[\s\S]*?<\/\1>|<(w:p|w:tbl|w:sectPr)\b[\s\S]*?\/>/g;

let match;
let children = [];
while ((match = childRegex.exec(bodyContent)) !== null) {
    children.push({ tag: match[1] || match[2], xml: match[0], index: children.length });
}

const KEEP_START = 120;
const KEEP_END = 195;

let output = [];
for (let i = KEEP_START; i <= KEEP_END; i++) {
    const c = children[i];
    if (!c) continue;

    // Check for drawings / textboxes / inline images
    const hasDrawing = c.xml.includes('<w:drawing');
    const hasTxbx = c.xml.includes('<w:txbxContent');
    const hasPict = c.xml.includes('<w:pict');
    const hasAlternateContent = c.xml.includes('<mc:AlternateContent');
    const hasObject = c.xml.includes('<w:object');
    const hasVShape = c.xml.includes('<v:shape');
    const hasVRect = c.xml.includes('<v:rect');

    // Extract visible text
    const tMatches = c.xml.match(/<w:t\b[^>]*>([\s\S]*?)<\/w:t>/g) || [];
    const text = tMatches.map(t => { const m = t.match(/<w:t\b[^>]*>([\s\S]*?)<\/w:t>/); return m ? m[1] : ''; }).join('').substring(0, 60).trim();

    const flags = [
        hasDrawing ? '[DRAWING]' : '',
        hasTxbx ? '[TXBX]' : '',
        hasPict ? '[PICT]' : '',
        hasAlternateContent ? '[ALTCONTENT]' : '',
        hasObject ? '[OBJECT]' : '',
        hasVShape ? '[VSHAPE]' : '',
        hasVRect ? '[VRECT]' : '',
    ].filter(Boolean).join(' ');

    output.push(`Index ${i} [${c.tag}]${flags ? ' ' + flags : ''}: "${text}"`);
}

const outputPath = path.join(__dirname, 'inspect_range_detail.txt');
fs.writeFileSync(outputPath, output.join('\n'), 'utf8');
console.log('Written to ' + outputPath);
