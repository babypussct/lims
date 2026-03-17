const fs = require('fs');
const filePath = 'src/app/features/preparation/smart-prep.component.ts';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/border-slate-50(?!\s+dark:border-)/g, 'border-slate-50 dark:border-slate-700/50');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed border-slate-50');
