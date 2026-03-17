const fs = require('fs');
const filePath = 'src/app/features/preparation/smart-prep.component.ts';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/dark:text-purple-400 dark:group-hover:text-purple-400/g, 'dark:group-hover:text-purple-400');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed text-purple-400');
