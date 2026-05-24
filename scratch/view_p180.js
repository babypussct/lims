const fs = require('fs');
const path = require('path');

const srcXmlPath = path.join(__dirname, '..', 'filebieumau3_extracted', 'word', 'document.xml');
const xml = fs.readFileSync(srcXmlPath, 'utf8');
const bodyContent = xml.match(/<w:body>([\s\S]*?)<\/w:body>/)[1];

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
console.log(children[180].xml);
