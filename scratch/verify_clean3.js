const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const docxPath = path.join(__dirname, '..', 'filebieumau3_FORM_CLEAN.docx');
const tempDir = path.join(__dirname, '..', 'filebieumau3_FORM_CLEAN_verify_extracted');

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
        const bodyMatch = xml.match(/<w:body>([\s\S]*?)<\/w:body>/);
        if (bodyMatch) {
            console.log("Validation: Successfully read document body.");
            
            // Extract all paragraphs and tables
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
            console.log(`Total children inside clean body: ${children.length}`);
            
            function extractText(xmlStr) {
                const textMatches = xmlStr.match(/<w:t[^>]*>([^<]*)<\/w:t>/g) || [];
                return textMatches.map(m => {
                    const match = m.match(/<w:t[^>]*>([^<]*)<\/w:t>/);
                    return match ? match[1] : "";
                }).join(" ");
            }
            
            children.forEach(c => {
                const text = extractText(c.xml).trim();
                console.log(`  - [${c.tag.toUpperCase()}] Index ${c.index}: "${text.substring(0, 120)}"`);
                if (c.xml.includes('<w:sectPr')) {
                    console.log(`    -> HAS INLINE SECTPR: ${c.xml.substring(0, 200)}...`);
                }
            });
        }
    } else {
        console.log("document.xml not found inside verified extraction.");
    }
} catch (e) {
    console.log(`Error during validation: ${e.message}`);
} finally {
    if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
    }
}
