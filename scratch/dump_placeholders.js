const fs = require('fs');
const path = require('path');

const cleanXmlPath = path.join(__dirname, '..', 'FILEBIEUMAUGOC', 'filebieumau4_FORM_CLEAN_extracted', 'word', 'document.xml');
const trangXmlPath = path.join(__dirname, '..', 'FILEBIEUMAUGOC', 'filebieumau4_FORM_TRANG_extracted', 'word', 'document.xml');

function dumpPlaceholders(filePath, name) {
  if (!fs.existsSync(filePath)) {
    console.log(`${name} XML does not exist at ${filePath}`);
    return;
  }
  const xml = fs.readFileSync(filePath, 'utf8');
  console.log(`\n=== Placeholders in ${name} ===`);
  
  // Find all {{...}} patterns
  const regex = /\{\{[\s\S]*?\}\}/g;
  const matches = xml.match(regex) || [];
  const uniqueMatches = [...new Set(matches)];
  console.log(`Found ${uniqueMatches.length} unique placeholders:`);
  const nonCompound = uniqueMatches.filter(m => !m.startsWith('{{KQ_') && !m.startsWith('{{ND_') && !m.startsWith('{{QC'));
  console.log("Non-compound placeholders:", nonCompound);


  // Search for "Mã số mẫu" or text close to it
  console.log(`\n=== Context search in ${name} ===`);
  const lines = xml.split(/[><]/);
  lines.forEach((line) => {
    if (line.includes('Mã số mẫu') || line.includes('MaSoMau') || line.includes('maSoMau') || line.includes('Mã số') || line.includes('Kết quả')) {
      console.log(`Matched tag/text: ${line.trim()}`);
    }
  });
}

dumpPlaceholders(cleanXmlPath, 'filebieumau4_FORM_CLEAN_extracted');
dumpPlaceholders(trangXmlPath, 'filebieumau4_FORM_TRANG_extracted');
