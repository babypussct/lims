const XLSX = require('xlsx');
const path = require('path');

const filePath = path.resolve(__dirname, '../Report_ISTD_PARAMETER_NEW.xlsx');
console.log('Reading file:', filePath);

try {
  const workbook = XLSX.readFile(filePath);
  console.log('Sheet names:', workbook.SheetNames);
  
  // Look at the first sheet
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  
  // Convert sheet to JSON array of arrays
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  console.log(`\n--- First 30 rows of '${firstSheetName}' ---`);
  data.slice(0, 30).forEach((row, i) => {
    console.log(`Row ${i}:`, row);
  });

  // Let's search if there are other sheets or special data structures
} catch (error) {
  console.error('Error reading xlsx:', error);
}
