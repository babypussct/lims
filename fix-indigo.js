const fs = require('fs');
const filePath = 'src/app/features/preparation/smart-prep.component.ts';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/hover:bg-indigo-100(?!\s+dark:hover:bg-)/g, 'hover:bg-indigo-100 dark:hover:bg-indigo-900/40');
content = content.replace(/hover:bg-indigo-50 dark:bg-indigo-900\/20/g, 'hover:bg-indigo-50 dark:hover:bg-indigo-900/40');
content = content.replace(/hover:bg-indigo-50 dark:hover:bg-indigo-900\/40\/30/g, 'hover:bg-indigo-50 dark:hover:bg-indigo-900/40');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed indigo');
