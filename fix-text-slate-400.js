const fs = require('fs');
const filePath = 'src/app/features/preparation/smart-prep.component.ts';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/text-slate-400 dark:text-slate-400/g, 'text-slate-400');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed text-slate-400');
