const fs = require('fs');
const filePath = 'src/app/features/preparation/smart-prep.component.ts';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/hover:bg-emerald-100(?!\s+dark:hover:bg-)/g, 'hover:bg-emerald-100 dark:hover:bg-emerald-900/40');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed hover:bg-emerald-100');
