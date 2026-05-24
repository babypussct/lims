const fs = require('fs');
const path = require('path');

const srcXmlPath = path.join(__dirname, '..', 'filebieumau3_FORM_CLEAN_extracted', 'word', 'document.xml');

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

const beforeBody = xml.substring(0, xml.indexOf('<w:body>') + 8);
const afterBody = xml.substring(xml.indexOf('</w:body>'));
const bodyContent = bodyMatch[1];

// Stack-based parser to correctly extract all top-level children inside <w:body>
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

const KEEP_START_1 = 167; // BIỂU MẪU GHI CHÉP KẾT QUẢ PHÂN TÍCH
const KEEP_START_2 = 169; // XÁC ĐỊNH DƯ LƯỢNG...
const KEEP_END     = 180; // Trang: / (footer paragraph containing the inline sectPr)

// Filter children: keep 167 and 169-180
const keptChildren = children
    .filter(c => c.index === KEEP_START_1 || (c.index >= KEEP_START_2 && c.index <= KEEP_END))
    .map(c => {
        // Clean paragraph 180 by removing its inline section properties break
        if (c.index === KEEP_END && c.xml.includes('<w:sectPr')) {
            console.log("Removing inline sectPr from footer paragraph index 180...");
            const cleanedXml = c.xml.replace(/<w:sectPr[\s\S]*?<\/w:sectPr>/g, '');
            return { ...c, xml: cleanedXml };
        }
        return c;
    });

console.log(`Keeping ${keptChildren.length} elements (indices ${KEEP_START_1} and ${KEEP_START_2} to ${KEEP_END})`);

// Define body-level section properties for the clean single-section portrait document
const sectPrBody =
    `<w:sectPr w:rsidR="00EC0CC5" w:rsidSect="00CF403A">` +
    `<w:headerReference w:type="default" r:id="rId17"/>` +
    `<w:footerReference w:type="default" r:id="rId14"/>` +
    `<w:pgSz w:w="11909" w:h="16834" w:code="9"/>` +
    `<w:pgMar w:top="851" w:right="851" w:bottom="851" w:left="1134" w:header="720" w:footer="720" w:gutter="0"/>` +
    `<w:cols w:space="708"/>` +
    `<w:docGrid w:linePitch="360"/>` +
    `</w:sectPr>`;

const newBodyContent = keptChildren.map(c => c.xml).join('\n') + '\n' + sectPrBody;
const newXml = beforeBody + newBodyContent + afterBody;

fs.writeFileSync(srcXmlPath, newXml, 'utf8');
console.log("Successfully wrote clean document XML to " + srcXmlPath);
