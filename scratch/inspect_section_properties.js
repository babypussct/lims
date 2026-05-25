const fs = require('fs');
const path = require('path');

const srcXmlPath = path.join(__dirname, '..', 'FILEBIEUMAUGOC', 'filebieumau4_extracted', 'word', 'document.xml');
const destXmlPath = path.join(__dirname, '..', 'FILEBIEUMAUGOC', 'filebieumau4_FORM_CLEAN_extracted', 'word', 'document.xml');

function inspectSectPr(filePath, label) {
    if (!fs.existsSync(filePath)) {
        console.log(`${label}: File not found at ${filePath}`);
        return;
    }
    const xml = fs.readFileSync(filePath, 'utf8');
    console.log(`\n=== INSPECTING ${label} ===`);
    
    // Find all occurrences of <w:sectPr> ... </w:sectPr> or <w:sectPr />
    const matches = [...xml.matchAll(/<w:sectPr[\s\S]*?<\/w:sectPr>/g)];
    console.log(`Total <w:sectPr> tags: ${matches.length}`);
    matches.forEach((m, idx) => {
        console.log(`Match ${idx} length: ${m[0].length}`);
        // print a summary of the tags inside it
        const headerRef = m[0].match(/<w:headerReference[^>]*>/g);
        const footerRef = m[0].match(/<w:footerReference[^>]*>/g);
        console.log(`  Headers: ${headerRef ? headerRef.length : 0}, Footers: ${footerRef ? footerRef.length : 0}`);
    });
}

inspectSectPr(srcXmlPath, "ORIGINAL");
inspectSectPr(destXmlPath, "REBUILT FORM CLEAN");
