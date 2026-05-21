const fs = require('fs');
const path = require('path');

const xmlPath = path.join(__dirname, '..', 'filebieumau_extracted', 'word', 'document.xml');
if (!fs.existsSync(xmlPath)) {
    console.error("XML file not found at " + xmlPath);
    process.exit(1);
}

const xml = fs.readFileSync(xmlPath, 'utf8');

const bodyMatch = xml.match(/<w:body>([\s\S]*?)<\/w:body>/);
if (!bodyMatch) {
    console.error("Could not find w:body in XML");
    process.exit(1);
}

const bodyContent = bodyMatch[1];

const childRegex = /<(w:p|w:tbl|w:sectPr)\b[\s\S]*?<\/\1>|<(w:p|w:tbl|w:sectPr)\b[\s\S]*?\/>/g;

let match;
let children = [];
while ((match = childRegex.exec(bodyContent)) !== null) {
    children.push({
        tag: match[1] || match[2],
        xml: match[0],
        index: children.length
    });
}

let output = [];
output.push("Total child elements in body: " + children.length);

children.forEach((child, idx) => {
    if (child.tag === 'w:p') {
        const tMatches = child.xml.match(/<w:t\b[^>]*>([\s\S]*?)<\/w:t>/g) || [];
        const text = tMatches.map(t => {
            const m = t.match(/<w:t\b[^>]*>([\s\S]*?)<\/w:t>/);
            return m ? m[1] : '';
        }).join('').trim();
        if (text) {
            output.push(`Index ${idx} [P]: "${text}"`);
        }
    } else if (child.tag === 'w:tbl') {
        const firstT = child.xml.match(/<w:t\b[^>]*>([\s\S]*?)<\/w:t>/);
        const text = firstT ? firstT[1] : '';
        output.push(`Index ${idx} [Table]: First text: "${text}"`);
    } else {
        output.push(`Index ${idx} [${child.tag}]`);
    }
});

const outputPath = path.join(__dirname, 'inspect_xml_output.txt');
fs.writeFileSync(outputPath, output.join('\n'), 'utf8');
console.log("Saved output to " + outputPath);
