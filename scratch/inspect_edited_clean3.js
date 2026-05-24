const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const docxPath = path.join(__dirname, '..', 'FILEBIEUMAUGOC', 'filebieumau3_FORM_CLEAN.docx');
const tempDir = path.join(__dirname, '..', 'scratch', 'edited_clean3_extracted');

if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
}
fs.mkdirSync(tempDir);

try {
    const psCommand = `Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::ExtractToDirectory('${docxPath}', '${tempDir}')`;
    execSync(`powershell -Command "${psCommand}"`, { stdio: 'ignore' });
    
    const xmlPath = path.join(tempDir, 'word', 'document.xml');
    if (fs.existsSync(xmlPath)) {
        const xml = fs.readFileSync(xmlPath, 'utf8');
        
        // Find all tables and paragraphs
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
        console.log(`Total children: ${children.length}`);
        
        function extractText(xmlStr) {
            const textMatches = xmlStr.match(/<w:t[^>]*>([^<]*)<\/w:t>/g) || [];
            return textMatches.map(m => {
                const match = m.match(/<w:t[^>]*>([^<]*)<\/w:t>/);
                return match ? match[1] : "";
            }).join(" ");
        }

        children.forEach((c, idx) => {
            if (c.tag === 'w:p') {
                const text = extractText(c.xml).trim();
                console.log(`P[${idx}]: "${text}"`);
            } else if (c.tag === 'w:tbl') {
                console.log(`TBL[${idx}]:`);
                // Parse rows and cells of the table
                const rows = c.xml.match(/<w:tr[^>]*>[\s\S]*?<\/w:tr>/g) || [];
                rows.forEach((row, rowIdx) => {
                    const cells = row.match(/<w:tc[^>]*>[\s\S]*?<\/w:tc>/g) || [];
                    const cellTexts = cells.map(cell => extractText(cell).trim());
                    console.log(`  Row ${rowIdx}: [${cellTexts.join(" | ")}]`);
                });
            }
        });
        
    } else {
        console.log("document.xml not found.");
    }
} catch (e) {
    console.log(`Error during inspection: ${e.message}`);
} finally {
    if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
    }
}
