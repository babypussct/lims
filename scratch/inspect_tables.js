const fs = require('fs');
const path = require('path');

const xmlPath = path.join(__dirname, '..', 'FORM_GOC_TRIFLURALIN_9_3_extracted', 'word', 'document.xml');
if (!fs.existsSync(xmlPath)) {
  console.log('XML file not found:', xmlPath);
  process.exit(1);
}

const xml = fs.readFileSync(xmlPath, 'utf8');

// A very simple XML parser using RegExp to find tables, rows, and cells
function parseTables(xmlStr) {
  // Find all <w:tbl>...</w:tbl>
  const tblRegex = /<w:tbl[\s\S]*?<\/w:tbl>/g;
  let match;
  let tableIdx = 0;
  
  while ((match = tblRegex.exec(xmlStr)) !== null) {
    const tblXml = match[0];
    // Find rows <w:tr>...</w:tr>
    const trRegex = /<w:tr[\s\S]*?<\/w:tr>/g;
    let rowIdx = 0;
    const rows = [];
    let trMatch;
    
    while ((trMatch = trRegex.exec(tblXml)) !== null) {
      const trXml = trMatch[0];
      // Find cells <w:tc>...</w:tc>
      const tcRegex = /<w:tc[\s\S]*?<\/w:tc>/g;
      const cells = [];
      let tcMatch;
      
      while ((tcMatch = tcRegex.exec(trXml)) !== null) {
        const tcXml = tcMatch[0];
        // Extract text from <w:t>...</w:t> tags
        const tRegex = /<w:t[^>]*>([\s\S]*?)<\/w:t>/g;
        let cellText = '';
        let tMatch;
        while ((tMatch = tRegex.exec(tcXml)) !== null) {
          cellText += tMatch[1];
        }
        cells.push(cellText.trim());
      }
      rows.push(cells);
      rowIdx++;
    }
    
    console.log(`Table ${tableIdx}: ${rows.length} rows`);
    if (rows.length > 0) {
      console.log(`  First row cells (${rows[0].length}): [ ${rows[0].map(c => `'${c}'`).join(' | ')} ]`);
      console.log(`  Last row cells (${rows[rows.length - 1].length}): [ ${rows[rows.length - 1].map(c => `'${c}'`).join(' | ')} ]`);
    }
    tableIdx++;
  }
}

parseTables(xml);
