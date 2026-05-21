const fs = require('fs');
const path = require('path');

const srcXmlPath = path.join(__dirname, '..', 'filebieumau_extracted', 'word', 'document.xml');
const destXmlPath = path.join(__dirname, '..', 'filebieumau_FORM_CLEAN_extracted', 'word', 'document.xml');

if (!fs.existsSync(srcXmlPath)) {
    console.error("Source XML file not found at " + srcXmlPath);
    process.exit(1);
}

// Ensure destination directory exists
const destDir = path.dirname(destXmlPath);
if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
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

// Stack-based parser to correctly handle nested tags (e.g. <w:p> inside <w:txbxContent>)
// The old regex approach was WRONG: /<w:p[\s\S]*?<\/w:p>/g would stop at the first </w:p>
// inside any nested <w:txbxContent>, breaking floating text box elements.
function getBodyChildren(bodyContent) {
    const children = [];
    let i = 0;
    const len = bodyContent.length;

    while (i < len) {
        // Skip to next '<'
        const nextTag = bodyContent.indexOf('<', i);
        if (nextTag === -1) break;
        i = nextTag;

        const sub = bodyContent.substring(i);

        // Check for self-closing top-level element: <w:p .../>, <w:tbl .../>, <w:sectPr .../>
        const selfClose = sub.match(/^<(w:p|w:tbl|w:sectPr)(\b[^>]*)?\s*\/>/);
        if (selfClose) {
            children.push({ tag: selfClose[1], xml: selfClose[0], index: children.length });
            i += selfClose[0].length;
            continue;
        }

        // Check for opening top-level element: <w:p ...>, <w:tbl ...>, <w:sectPr ...>
        const openTag = sub.match(/^<(w:p|w:tbl|w:sectPr)(\b[^>]*)?>/);
        if (openTag) {
            const tagName = openTag[1];
            const startIdx = i;
            i += openTag[0].length;

            // Track nesting depth - count matching open/close tags
            let depth = 1;
            while (i < len && depth > 0) {
                const lt = bodyContent.indexOf('<', i);
                if (lt === -1) break;
                i = lt;

                const rest = bodyContent.substring(i);

                // Self-closing tag: does not change depth
                const scMatch = rest.match(new RegExp(`^<${tagName}(\\b[^>]*)?\\s*\\/>`));
                if (scMatch) {
                    i += scMatch[0].length;
                    continue;
                }

                // Closing tag
                const closeMatch = rest.match(new RegExp(`^<\\/${tagName}>`));
                if (closeMatch) {
                    depth--;
                    i += closeMatch[0].length;
                    continue;
                }

                // Opening tag (nested)
                const openMatch = rest.match(new RegExp(`^<${tagName}(\\b[^>]*)?>`));
                if (openMatch) {
                    depth++;
                    i += openMatch[0].length;
                    continue;
                }

                i++; // move past '<' and continue
            }

            children.push({ tag: tagName, xml: bodyContent.substring(startIdx, i), index: children.length });
        } else {
            // Not a top-level element we care about — skip this tag
            const gt = bodyContent.indexOf('>', i);
            i = gt === -1 ? len : gt + 1;
        }
    }

    return children;
}

const children = getBodyChildren(bodyContent);

console.log("Total child elements in body:", children.length);

// Structure (with stack-based parser indices):
// Idx 152: "XÁC ĐỊNH DƯ LƯỢNG..."  ← start of portrait form page 1
// Idx 171: [INLINE-SECT:PORTRAIT]  ← section break ending portrait page 1 (KEEP AS-IS)
// Idx 172-181: content of landscape page 2
// Idx 182: [INLINE-SECT:LANDSCAPE] ← landscape sectPr definition (use as body-level sectPr)
// Idx 183+: PHỤ LỤC                ← stop here

const KEEP_START = 152;  // "XÁC ĐỊNH DƯ LƯỢNG..."
const KEEP_END   = 181;  // last element before landscape sectPr paragraph

// Keep elements 152-181, but fix element 171's inline sectPr:
// Its header/footer refs are type="first" but w:titlePg is not set → Word ignores them → no header on page 1.
// Fix: change type="first" → type="default" so they apply to all pages of the portrait section.
const keptChildren = children
    .filter(c => c.index >= KEEP_START && c.index <= KEEP_END)
    .map(c => {
        if (c.index === 171 && c.xml.includes('<w:sectPr')) {
            return { ...c, xml: c.xml.replace(/w:type="first"/g, 'w:type="default"') };
        }
        return c;
    });

console.log(`Keeping ${keptChildren.length} elements (indices ${KEEP_START} to ${KEEP_END})`);

// Use element 182's landscape sectPr as body-level sectPr:
// Idx 182 [INLINE-SECT:LANDSCAPE]: pgSz landscape (16838x11906), 2 cols, header rId20, footer rId21
const sectPrBody =
    `<w:sectPr>` +
    `<w:headerReference w:type="default" r:id="rId20"/>` +
    `<w:footerReference w:type="default" r:id="rId21"/>` +
    `<w:pgSz w:w="16838" w:h="11906" w:orient="landscape" w:code="9"/>` +
    `<w:pgMar w:top="1418" w:right="1134" w:bottom="851" w:left="1134" w:header="567" w:footer="567" w:gutter="0"/>` +
    `<w:cols w:num="2" w:space="720"/>` +
    `<w:docGrid w:linePitch="360"/>` +
    `</w:sectPr>`;

const newBodyContent = keptChildren.map(c => c.xml).join('\n') + '\n' + sectPrBody;
const newXml = beforeBody + newBodyContent + afterBody;

fs.writeFileSync(destXmlPath, newXml, 'utf8');
console.log("Successfully wrote clean document XML to " + destXmlPath);

