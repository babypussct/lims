const fs = require('fs');
const filePath = 'src/app/features/preparation/smart-prep.component.ts';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/hover:bg-fuchsia-100(?!\s+dark:hover:bg-)/g, 'hover:bg-fuchsia-100 dark:hover:bg-fuchsia-900/40');
content = content.replace(/hover:bg-fuchsia-50 dark:bg-fuchsia-900\/20\/30/g, 'hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/40');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed fuchsia');
