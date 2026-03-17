const fs = require('fs');
const filePath = 'src/app/features/preparation/smart-prep.component.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Remove duplicate dark classes
content = content.replace(/dark:text-slate-400 dark:text-slate-500 dark:text-slate-400/g, 'dark:text-slate-400');
content = content.replace(/dark:text-slate-300 dark:text-slate-500 dark:text-slate-400/g, 'dark:text-slate-300');
content = content.replace(/dark:text-slate-200 dark:hover:text-slate-200/g, 'dark:hover:text-slate-200');
content = content.replace(/dark:text-slate-500 dark:text-slate-400/g, 'dark:text-slate-400');
content = content.replace(/dark:bg-slate-800 dark:focus-within:bg-slate-800/g, 'dark:focus-within:bg-slate-800');
content = content.replace(/dark:bg-slate-800 dark:focus:bg-slate-800/g, 'dark:focus:bg-slate-800');
content = content.replace(/dark:text-red-400 rounded-full/g, 'dark:hover:text-red-400 rounded-full');
content = content.replace(/hover:bg-slate-50 dark:bg-slate-900\/50 dark:hover:bg-slate-700/g, 'hover:bg-slate-50 dark:hover:bg-slate-700');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Cleaned up duplicates');
