const fs = require('fs');
const path = require('path');

const workspace = path.join(__dirname, '..');
const srcExtracted = path.join(workspace, 'FILEBIEUMAUGOC', 'filebieumau4_extracted');
const destExtractedClean = path.join(workspace, 'FILEBIEUMAUGOC', 'filebieumau4_FORM_CLEAN_extracted');
const destExtractedTrang = path.join(workspace, 'FILEBIEUMAUGOC', 'filebieumau4_FORM_TRANG_extracted');

const srcXmlPath = path.join(srcExtracted, 'word', 'document.xml');

if (!fs.existsSync(srcXmlPath)) {
    console.error("Source XML not found: " + srcXmlPath);
    process.exit(1);
}

const xml = fs.readFileSync(srcXmlPath, 'utf8');

function processXml(isTemplate, destXmlPath) {
    // 1. Parse body elements using a stack-based parser
    const bodyStart = xml.indexOf('<w:body>');
    const bodyEnd = xml.indexOf('</w:body>');

    if (bodyStart === -1 || bodyEnd === -1) {
        console.error("Could not find w:body tags");
        process.exit(1);
    }

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

    // 2. Identify indices to keep
    let startIdx = -1;
    let endIdx = -1;

    for (let idx = 0; idx < elements.length; idx++) {
        const content = elements[idx].content;
        if (content.includes("BIỂU MẪU GHI CHÉP KẾT QUẢ PHÂN TÍCH")) {
            startIdx = idx;
        }
        if (content.includes("PHỤ LỤC")) {
            endIdx = idx;
        }
    }

    if (startIdx === -1 || endIdx === -1) {
        console.error("Could not find start/end elements");
        process.exit(1);
    }

    const keptElements = elements.slice(startIdx, endIdx);

    // 3. Process Table 4 in kept elements (Only if isTemplate is true)
    if (isTemplate) {
        let table4Idx = -1;
        for (let idx = 0; idx < keptElements.length; idx++) {
            if (keptElements[idx].tag === 'w:tbl' && keptElements[idx].content.includes("Aldrin")) {
                table4Idx = idx;
                break;
            }
        }

        if (table4Idx === -1) {
            console.error("Could not find Table 4 inside kept elements");
            process.exit(1);
        }

        let tableXml = keptElements[table4Idx].content;
        const compounds = [
            'Aldrin', 'BHCa', 'BHCb', 'BHCd', 'BHCe', 'BHCg',
            'Chlordane_cis', 'Chlordane_oxy', 'Chlordane_trans',
            'DDD_op', 'DDD_pp', 'DDE_op', 'DDE_pp', 'DDT_op', 'DDT_pp',
            'Dieldrin', 'Endosulfan1', 'Endosulfan2', 'EndosulfanS', 'Endrin',
            'Heptachlor', 'HeptachlorA', 'HeptachlorB', 'HCB', 'Isodrin',
            'Methoxychlor', 'Mirex', 'Pendimethalin'
        ];

        // Extract tr tags
        const trs = [];
        let trIdx = 0;
        while (trIdx < tableXml.length) {
            const trRest = tableXml.substring(trIdx);
            const trMatch = trRest.match(/<w:tr[\s\S]*?<\/w:tr>/);
            if (trMatch) {
                trs.push({ xml: trMatch[0], indexInTable: trs.length });
                trIdx += trMatch.index + trMatch[0].length;
            } else {
                break;
            }
        }

        // Process rows from 2 to 29
        for (let r = 2; r <= 29; r++) {
            const compoundKey = compounds[r - 2];
            let rowXml = trs[r].xml;
            
            const tcs = [];
            let tcIdx = 0;
            while (tcIdx < rowXml.length) {
                const tcRest = rowXml.substring(tcIdx);
                const tcMatch = tcRest.match(/<w:tc[\s\S]*?<\/w:tc>/);
                if (tcMatch) {
                    tcs.push(tcMatch[0]);
                    tcIdx += tcMatch.index + tcMatch[0].length;
                } else {
                    break;
                }
            }
            
            const newCell1 = `<w:tc><w:tcPr><w:tcW w:w="1379" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="auto"/><w:vAlign w:val="center"/></w:tcPr>` +
                `<w:p><w:pPr><w:jc w:val="center"/><w:rPr><w:color w:val="000000"/><w:sz w:val="20"/></w:rPr></w:pPr>` +
                `<w:r><w:rPr><w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr><w:t>{{KQ_${compoundKey}}}</w:t></w:r>` +
                `<w:r><w:rPr><w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr><w:t xml:space="preserve">    </w:t></w:r>` +
                `<w:r><w:rPr><w:sz w:val="20"/></w:rPr><w:t>{{ND_${compoundKey}}}</w:t></w:r>` +
                `<w:r><w:rPr><w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr><w:t xml:space="preserve"> ND</w:t></w:r>` +
                `</w:p></w:tc>`;
            
            const newCellQC = (colIdx) => {
                const wVal = colIdx === 2 ? "1701" : colIdx === 3 ? "1843" : "1843";
                const placeholderDat = `{{QC${colIdx - 1}_${compoundKey}}}`;
                const placeholderKd = `{{QC${colIdx - 1}_KD_${compoundKey}}}`;
                return `<w:tc><w:tcPr><w:tcW w:w="${wVal}" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="auto"/><w:vAlign w:val="center"/></w:tcPr>` +
                    `<w:p><w:pPr><w:jc w:val="center"/><w:rPr><w:color w:val="000000"/><w:sz w:val="20"/></w:rPr></w:pPr>` +
                    `<w:r><w:rPr><w:sz w:val="20"/></w:rPr><w:t>${placeholderDat}</w:t></w:r>` +
                    `<w:r><w:rPr><w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr><w:t xml:space="preserve"> Đ           </w:t></w:r>` +
                    `<w:r><w:rPr><w:sz w:val="20"/></w:rPr><w:t>${placeholderKd}</w:t></w:r>` +
                    `<w:r><w:rPr><w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr><w:t xml:space="preserve"> KĐ</w:t></w:r>` +
                    `</w:p></w:tc>`;
            };
            
            const newCell2 = newCellQC(2);
            const newCell3 = newCellQC(3);
            const newCell4 = newCellQC(4);
            
            const startTcIdx = rowXml.indexOf('<w:tc>');
            const tcPrSection = rowXml.substring(0, startTcIdx);
            
            const newRowXml = tcPrSection + tcs[0] + newCell1 + newCell2 + newCell3 + newCell4 + '</w:tr>';
            tableXml = tableXml.replace(trs[r].xml, newRowXml);
        }

        keptElements[table4Idx].content = tableXml;
    }

    // 4. Section break cleanups:
    // Remove nested sectPr from Element 163 (keptElements[1]) to prevent extra section break at start
    const el163Content = keptElements[1].content;
    if (el163Content.includes('<w:sectPr')) {
        console.log("Removing inline sectPr from element 163...");
        keptElements[1].content = el163Content.replace(/<w:sectPr[\s\S]*?<\/w:sectPr>/g, '');
    }

    // Inject explicit header & footer into Element 184 (keptElements[22]) sectPr to preserve layouts
    const el184Content = keptElements[22].content;
    if (el184Content.includes('<w:sectPr')) {
        console.log("Injecting header and footer references into Element 184...");
        const modifiedSectPr = el184Content.replace(
            '<w:sectPr',
            '<w:sectPr><w:headerReference w:type="default" r:id="rId17"/><w:footerReference w:type="default" r:id="rId10"/>'
        );
        keptElements[22].content = modifiedSectPr;
    }

    // Extract and remove nested sectPr from Element 187 (keptElements[25])
    const el187Content = keptElements[25].content;
    let sectPr = '';
    if (el187Content.includes('<w:sectPr')) {
        console.log("Extracting and removing inline sectPr from element 187...");
        const match = el187Content.match(/<w:sectPr[\s\S]*?<\/w:sectPr>/);
        if (match) {
            sectPr = match[0];
        }
        keptElements[25].content = el187Content.replace(/<w:sectPr[\s\S]*?<\/w:sectPr>/g, '');
    }

    // Inject explicit header & footer references into final sectPr
    if (sectPr) {
        console.log("Injecting header and footer references into final sectPr...");
        sectPr = sectPr.replace(
            '<w:sectPr',
            '<w:sectPr><w:headerReference w:type="default" r:id="rId17"/><w:footerReference w:type="default" r:id="rId10"/>'
        );
    }

    // 5. Assemble new XML content
    const header = xml.substring(0, bodyStart + 8);
    const newBodyContent = keptElements.map(el => el.content).join("") + sectPr;
    const footer = xml.substring(bodyEnd);

    const newXml = header + newBodyContent + footer;

    const destDir = path.dirname(destXmlPath);
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    fs.writeFileSync(destXmlPath, newXml, 'utf8');
    console.log(`Successfully saved processed XML (isTemplate=${isTemplate}) to ${destXmlPath}`);
}

// Generate Mode 1: LIMS dynamic template (with placeholders)
const cleanXmlPath = path.join(destExtractedClean, 'word', 'document.xml');
processXml(true, cleanXmlPath);

// Generate Mode 2: Blank print-ready form (WITHOUT placeholders)
const trangXmlPath = path.join(destExtractedTrang, 'word', 'document.xml');
processXml(false, trangXmlPath);
