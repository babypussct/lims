const fs = require('fs');
const filePath = 'src/app/features/preparation/smart-prep.component.ts';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/shadow-blue-200 transition/g, 'shadow-blue-200 dark:shadow-none transition');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed shadow-blue-200');
