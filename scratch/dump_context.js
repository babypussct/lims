const fs = require('fs');
const path = require('path');

const cleanXmlPath = path.join(__dirname, '..', 'FILEBIEUMAUGOC', 'filebieumau4_FORM_CLEAN_extracted', 'word', 'document.xml');

if (!fs.existsSync(cleanXmlPath)) {
  console.log(`XML does not exist at ${cleanXmlPath}`);
  process.exit(1);
}

const xml = fs.readFileSync(cleanXmlPath, 'utf8');
const searchStr = '1. Mã số mẫu';
const index = xml.indexOf(searchStr);

if (index === -1) {
  console.log(`Could not find "${searchStr}" in XML`);
  process.exit(1);
}

console.log("=== Surrounding XML (1000 characters) ===");
console.log(xml.substring(index - 100, index + 900));
