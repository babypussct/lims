const fs = require('fs');
const path = require('path');

const xmlPath = path.join(__dirname, '..', 'filebieumau_extracted', 'word', 'document.xml');
const xml = fs.readFileSync(xmlPath, 'utf8');
const bodyMatch = xml.match(/<w:body>([\s\S]*?)<\/w:body>/);
const bodyContent = bodyMatch[1];

// CORRECT stack-based parser
function getBodyChildren(bodyContent) {
    const children = [];
    let i = 0;
    const len = bodyContent.length;
    while (i < len) {
        const nextTag = bodyContent.indexOf('<', i);
        if (nextTag === -1) break;
        i = nextTag;
        const sub = bodyContent.substring(i);
        const selfClose = sub.match(/^<(w:p|w:tbl|w:sectPr)(\b[^>]*)?\s*\/>/);
        if (selfClose) {
            children.push({ tag: selfClose[1], xml: selfClose[0], index: children.length });
            i += selfClose[0].length;
            continue;
        }
        const openTag = sub.match(/^<(w:p|w:tbl|w:sectPr)(\b[^>]*)?>/);
        if (openTag) {
            const tagName = openTag[1];
            const startIdx = i;
            i += openTag[0].length;
            let depth = 1;
            while (i < len && depth > 0) {
                const lt = bodyContent.indexOf('<', i);
                if (lt === -1) break;
                i = lt;
                const rest = bodyContent.substring(i);
                const scMatch = rest.match(new RegExp(`^<${tagName}(\\b[^>]*)?\\s*\\/>`));
                if (scMatch) { i += scMatch[0].length; continue; }
                const closeMatch = rest.match(new RegExp(`^<\\/${tagName}>`));
                if (closeMatch) { depth--; i += closeMatch[0].length; continue; }
                const openMatch = rest.match(new RegExp(`^<${tagName}(\\b[^>]*)?>`));
                if (openMatch) { depth++; i += openMatch[0].length; continue; }
                i++;
            }
            children.push({ tag: tagName, xml: bodyContent.substring(startIdx, i), index: children.length });
        } else {
            const gt = bodyContent.indexOf('>', i);
            i = gt === -1 ? len : gt + 1;
        }
    }
    return children;
}

const children = getBodyChildren(bodyContent);
console.log('Total elements with stack parser:', children.length);

const OUT = path.join(__dirname, 'inspect_stack_range.txt');
let out = ['Total elements: ' + children.length];

// Show elements 130 to end with text + flags
for (let idx = 130; idx < children.length; idx++) {
    const c = children[idx];
    const tMatches = c.xml.match(/<w:t\b[^>]*>([\s\S]*?)<\/w:t>/g) || [];
    const text = tMatches.map(t => { const m = t.match(/<w:t\b[^>]*>([\s\S]*?)<\/w:t>/); return m ? m[1] : ''; }).join('').substring(0, 80).trim();
    
    const hasInlineSectPr = c.tag === 'w:p' && c.xml.includes('<w:sectPr');
    const hasDrawing = c.xml.includes('<w:drawing');
    const hasTxbx = c.xml.includes('<w:txbxContent');
    
    let sectInfo = '';
    if (hasInlineSectPr) {
        const orient = c.xml.includes('orient="landscape"') ? 'LANDSCAPE' : 'PORTRAIT';
        sectInfo = ` [INLINE-SECT:${orient}]`;
    }
    
    const flags = [
        hasDrawing ? '[DRW]' : '',
        hasTxbx ? '[TXBX]' : '',
    ].filter(Boolean).join(' ');
    
    out.push(`Idx ${idx} [${c.tag}]${sectInfo}${flags ? ' ' + flags : ''}: "${text}" (${c.xml.length}b)`);
}

fs.writeFileSync(OUT, out.join('\n'), 'utf8');
console.log('Written to ' + OUT);
