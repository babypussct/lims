const fs = require('fs');
const path = require('path');

const srcXmlPath = path.join(__dirname, '..', 'FILEBIEUMAUGOC', 'filebieumau4_extracted', 'word', 'document.xml');
const xml = fs.readFileSync(srcXmlPath, 'utf8');

// Parse body elements
const bodyStart = xml.indexOf('<w:body>');
const bodyEnd = xml.indexOf('</w:body>');
const bodyContent = xml.substring(bodyStart + 8, bodyEnd);
const elements = [];
let i = 0;

while (i < bodyContent.length) {
    const rest = bodyContent.substring(i);
    const pMatch = rest.match(/^<(w:p|w:tbl|w:sectPr)(\b[^>]*)?\s*\/>/);
    if (pMatch) {
        elements.push({ tag: pMatch[1], content: pMatch[0] });
        i += pMatch[0].length;
        continue;
    }

    const openMatch = rest.match(/^<(w:p|w:tbl|w:sectPr)(\b[^>]*)?>/);
    if (openMatch) {
        const tagName = openMatch[1];
        let depth = 1;
        let j = openMatch[0].length;
        
        while (depth > 0 && j < rest.length) {
            const innerRest = rest.substring(j);
            const scNested = innerRest.match(new RegExp(`^<${tagName}(\\b[^>]*)?\\\s*\\/>`));
            if (scNested) {
                j += scNested[0].length;
                continue;
            }
            const closeNested = innerRest.match(new RegExp(`^<\\/${tagName}>`));
            if (closeNested) {
                depth--;
                j += closeNested[0].length;
                continue;
            }
            const openNested = innerRest.match(new RegExp(`^<${tagName}(\\b[^>]*)?>`));
            if (openNested) {
                depth++;
                j += openNested[0].length;
                continue;
            }
            j++;
        }
        
        const fullElement = rest.substring(0, j);
        elements.push({ tag: tagName, content: fullElement });
        i += j;
    } else {
        i++;
    }
}

console.log("Kept elements from 162 to 187:");
for (let idx = 162; idx < 188; idx++) {
    const el = elements[idx];
    const sectPrMatch = el.content.match(/<w:sectPr[\s\S]*?<\/w:sectPr>/g);
    if (sectPrMatch) {
        console.log(`Element ${idx} [${el.tag}] has sectPr match of length ${sectPrMatch[0].length}`);
    }
}
