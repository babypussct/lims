const fs = require('fs');
const filePath = 'src/app/features/preparation/smart-prep.component.ts';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/hover:bg-red-50 dark:bg-red-900\/20 dark:hover:bg-red-900\/30/g, 'hover:bg-red-50 dark:hover:bg-red-900/30');
content = content.replace(/hover:bg-red-50 dark:bg-red-900\/20/g, 'hover:bg-red-50 dark:hover:bg-red-900/30');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed red hover');
