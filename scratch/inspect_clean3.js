const fs = require('fs');
const path = require('path');

const srcXmlPath = path.join(__dirname, '..', 'filebieumau_FORM_CLEAN3_extracted', 'word', 'document.xml');

if (!fs.existsSync(srcXmlPath)) {
    console.error("Source XML file not found at " + srcXmlPath);
    process.exit(1);
}

const xml = fs.readFileSync(srcXmlPath, 'utf8');

const bodyMatch = xml.match(/<w:body>([\s\S]*?)<\/w:body>/);
if (!bodyMatch) {
    console.error("Could not find w:body in XML");
    process.exit(1);
}

const bodyContent = bodyMatch[1];

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
                if (scMatch) {
                    i += scMatch[0].length;
                    continue;
                }

                const closeMatch = rest.match(new RegExp(`^<\\/${tagName}>`));
                if (closeMatch) {
                    depth--;
                    i += closeMatch[0].length;
                    continue;
                }

                const openMatch = rest.match(new RegExp(`^<${tagName}(\\b[^>]*)?>`));
                if (openMatch) {
                    depth++;
                    i += openMatch[0].length;
                    continue;
                }

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
console.log("Total child elements in body:", children.length);

function extractText(xmlStr) {
    const textMatches = xmlStr.match(/<w:t[^>]*>([^<]*)<\/w:t>/g);
    if (!textMatches) return "";
    return textMatches.map(m => {
        const match = m.match(/<w:t[^>]*>([^<]*)<\/w:t>/);
        return match ? match[1] : "";
    }).join("");
}

children.forEach((c) => {
    const text = extractText(c.xml).trim();
    if (c.tag === 'w:p') {
        if (text) {
            console.log(`[P] Idx ${c.index}: "${text.substring(0, 150)}"`);
        } else if (c.xml.includes('<w:sectPr')) {
            console.log(`[P-SECT] Idx ${c.index}: Section break inside paragraph!`);
        }
    } else if (c.tag === 'w:tbl') {
        console.log(`[TBL] Idx ${c.index}: Table element (Length: ${c.xml.length} chars). First text: "${text.substring(0, 80)}"`);
    } else if (c.tag === 'w:sectPr') {
        console.log(`[SECT] Idx ${c.index}: Body-level Section properties!`);
    }
});
