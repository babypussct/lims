const fs = require('fs');
const path = require('path');

const xmlPath = path.join(__dirname, '..', 'FILEBIEUMAUGOC', 'filebieumau4_extracted', 'word', 'document.xml');
if (!fs.existsSync(xmlPath)) {
  console.log('XML file not found:', xmlPath);
  process.exit(1);
}

const xml = fs.readFileSync(xmlPath, 'utf8');

// Get all <w:t> texts
const tRegex = /<w:t[^>]*>([\s\S]*?)<\/w:t>/g;
let tMatch;
const allTexts = [];
while ((tMatch = tRegex.exec(xml)) !== null) {
  allTexts.push(tMatch[1]);
}

console.log('=== Title/Header Text ===');
console.log(allTexts.slice(0, 100).join(' ').substring(0, 1000));

// Find placeholders like {{...}}
console.log('\n=== Placeholders ({{...}}) ===');
const placeholderRegex = /\{\{[^}]+\}\}/g;
const fullTextCombined = allTexts.join(' ');
const placeholders = fullTextCombined.match(placeholderRegex) || [];
console.log('Unique placeholders:', [...new Set(placeholders)]);

// Parse tables
console.log('\n=== Tables Details ===');
function parseTables(xmlStr) {
  const tblRegex = /<w:tbl[\s\S]*?<\/w:tbl>/g;
  let match;
  let tableIdx = 0;
  
  while ((match = tblRegex.exec(xmlStr)) !== null) {
    const tblXml = match[0];
    const trRegex = /<w:tr[\s\S]*?<\/w:tr>/g;
    let rowIdx = 0;
    const rows = [];
    let trMatch;
    
    while ((trMatch = trRegex.exec(tblXml)) !== null) {
      const trXml = trMatch[0];
      const tcRegex = /<w:tc[\s\S]*?<\/w:tc>/g;
      const cells = [];
      let tcMatch;
      
      while ((tcMatch = tcRegex.exec(trXml)) !== null) {
        const tcXml = tcMatch[0];
        const tRegexCell = /<w:t[^>]*>([\s\S]*?)<\/w:t>/g;
        let cellText = '';
        let tMatchCell;
        while ((tMatchCell = tRegexCell.exec(tcXml)) !== null) {
          cellText += tMatchCell[1];
        }
        cells.push(cellText.trim());
      }
      rows.push(cells);
      rowIdx++;
    }
    
    console.log(`\nTable ${tableIdx}: ${rows.length} rows`);
    if (rows.length > 0) {
      // Print first 5 rows
      console.log(`  Header rows (first 5):`);
      for (let r = 0; r < Math.min(5, rows.length); r++) {
        console.log(`    Row ${r} (${rows[r].length} cells): [ ${rows[r].map(c => `'${c}'`).join(' | ')} ]`);
      }
      if (rows.length > 5) {
        console.log(`    ...`);
        // Print last row
        const lastIdx = rows.length - 1;
        console.log(`    Row ${lastIdx} (${rows[lastIdx].length} cells): [ ${rows[lastIdx].map(c => `'${c}'`).join(' | ')} ]`);
      }
    }
    tableIdx++;
  }
}

parseTables(xml);
