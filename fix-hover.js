const fs = require('fs');
const filePath = 'src/app/features/preparation/smart-prep.component.ts';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/hover:bg-slate-200 dark:bg-slate-700/g, 'hover:bg-slate-200 dark:hover:bg-slate-700');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed hover:bg-slate-200');
