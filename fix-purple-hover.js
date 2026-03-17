const fs = require('fs');
const filePath = 'src/app/features/preparation/smart-prep.component.ts';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/hover:bg-purple-50 dark:bg-purple-900\/20 dark:hover:bg-purple-900\/30/g, 'hover:bg-purple-50 dark:hover:bg-purple-900/30');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed purple');
