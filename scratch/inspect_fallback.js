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

const OUT = path.join(__dirname, 'inspect_fallback.txt');
let out = [];

// Dump FULL xml of elements with DRAWING+TXBX (157, 159, 178, 193)
const PROBLEMATIC = [157, 159, 178, 193];
for (const idx of PROBLEMATIC) {
    const c = children[idx];
    out.push(`\n=== FULL XML Index ${idx} [${c.tag}] (${c.xml.length} chars) ===`);
    // Find mc:Fallback blocks
    const fallbackMatches = c.xml.match(/<mc:Fallback[\s\S]*?<\/mc:Fallback>/g) || [];
    if (fallbackMatches.length > 0) {
        out.push(`FOUND ${fallbackMatches.length} mc:Fallback block(s):`);
        fallbackMatches.forEach((fb, i) => {
            out.push(`--- Fallback ${i+1} (first 2000 chars) ---`);
            out.push(fb.substring(0, 2000));
            // Check for nested drawings inside fallback
            if (fb.includes('<w:drawing') || fb.includes('<v:shape') || fb.includes('<w:txbxContent')) {
                out.push(`  >> Fallback has nested drawing/shape/txbxContent!`);
                // Check: drawing inside txbxContent in fallback?
                if (fb.includes('<w:txbxContent')) {
                    const txbxMatch = fb.match(/<w:txbxContent[\s\S]*?<\/w:txbxContent>/g) || [];
                    txbxMatch.forEach((t, ti) => {
                        if (t.includes('<w:drawing') || t.includes('<v:shape') || t.includes('<v:rect')) {
                            out.push(`  !! txbxContent[${ti}] CONTAINS A DRAWING/SHAPE - THIS IS THE BUG!`);
                            out.push(t.substring(0, 1000));
                        }
                    });
                }
            }
        });
    } else {
        out.push('No mc:Fallback found.');
    }
}

// Also check header7.xml and footer5.xml
const wordDir = path.join(__dirname, '..', 'filebieumau_extracted', 'word');
const headersToCheck = ['header7.xml', 'footer5.xml', 'header5.xml', 'header6.xml', 'footer4.xml'];
for (const hf of headersToCheck) {
    const hfPath = path.join(wordDir, hf);
    if (!fs.existsSync(hfPath)) {
        out.push(`\n=== ${hf}: NOT FOUND ===`);
        continue;
    }
    const hfXml = fs.readFileSync(hfPath, 'utf8');
    const hasDrawing = hfXml.includes('<w:drawing') || hfXml.includes('<v:shape');
    const hasTxbx = hfXml.includes('<w:txbxContent');
    out.push(`\n=== ${hf}: drawing=${hasDrawing} txbxContent=${hasTxbx} (${hfXml.length} chars) ===`);
    if (hasDrawing && hasTxbx) {
        out.push('!! This header/footer has BOTH drawing AND txbxContent - possible issue!');
        out.push(hfXml.substring(0, 1500));
    }
}

fs.writeFileSync(OUT, out.join('\n'), 'utf8');
console.log('Written to ' + OUT);
