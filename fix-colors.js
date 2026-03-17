const fs = require('fs');

const filePath = 'src/app/features/preparation/smart-prep.component.ts';
let content = fs.readFileSync(filePath, 'utf8');

const replacements = [
  { regex: /bg-slate-50(?!\s+dark:bg-)/g, replacement: 'bg-slate-50 dark:bg-slate-900/50' },
  { regex: /bg-slate-100(?!\s+dark:bg-)/g, replacement: 'bg-slate-100 dark:bg-slate-800' },
  { regex: /bg-slate-200(?!\s+dark:bg-)/g, replacement: 'bg-slate-200 dark:bg-slate-700' },
  { regex: /border-slate-100(?!\s+dark:border-)/g, replacement: 'border-slate-100 dark:border-slate-700' },
  { regex: /border-slate-200(?!\s+dark:border-)/g, replacement: 'border-slate-200 dark:border-slate-700' },
  { regex: /text-slate-300(?!\s+dark:text-)/g, replacement: 'text-slate-300 dark:text-slate-500' },
  { regex: /text-slate-400(?!\s+dark:text-)/g, replacement: 'text-slate-400 dark:text-slate-500' },
  { regex: /text-slate-500(?!\s+dark:text-)/g, replacement: 'text-slate-500 dark:text-slate-400' },
  { regex: /text-slate-600(?!\s+dark:text-)/g, replacement: 'text-slate-600 dark:text-slate-300' },
  { regex: /text-slate-700(?!\s+dark:text-)/g, replacement: 'text-slate-700 dark:text-slate-200' },
  { regex: /text-slate-800(?!\s+dark:text-)/g, replacement: 'text-slate-800 dark:text-slate-100' },
  
  { regex: /bg-blue-50(?!\s+dark:bg-)/g, replacement: 'bg-blue-50 dark:bg-blue-900/20' },
  { regex: /text-blue-700(?!\s+dark:text-)/g, replacement: 'text-blue-700 dark:text-blue-400' },
  { regex: /border-blue-100(?!\s+dark:border-)/g, replacement: 'border-blue-100 dark:border-blue-800/30' },
  { regex: /border-blue-200(?!\s+dark:border-)/g, replacement: 'border-blue-200 dark:border-blue-800/50' },
  
  { regex: /bg-orange-50(?!\s+dark:bg-)/g, replacement: 'bg-orange-50 dark:bg-orange-900/20' },
  { regex: /bg-orange-100(?!\s+dark:bg-)/g, replacement: 'bg-orange-100 dark:bg-orange-900/40' },
  { regex: /text-orange-700(?!\s+dark:text-)/g, replacement: 'text-orange-700 dark:text-orange-400' },
  { regex: /border-orange-100(?!\s+dark:border-)/g, replacement: 'border-orange-100 dark:border-orange-800/30' },
  { regex: /border-orange-200(?!\s+dark:border-)/g, replacement: 'border-orange-200 dark:border-orange-800/50' },
  
  { regex: /bg-emerald-50(?!\s+dark:bg-)/g, replacement: 'bg-emerald-50 dark:bg-emerald-900/20' },
  { regex: /text-emerald-700(?!\s+dark:text-)/g, replacement: 'text-emerald-700 dark:text-emerald-400' },
  { regex: /text-emerald-600(?!\s+dark:text-)/g, replacement: 'text-emerald-600 dark:text-emerald-400' },
  { regex: /border-emerald-100(?!\s+dark:border-)/g, replacement: 'border-emerald-100 dark:border-emerald-800/30' },
  { regex: /border-emerald-200(?!\s+dark:border-)/g, replacement: 'border-emerald-200 dark:border-emerald-800/50' },
  
  { regex: /bg-fuchsia-50(?!\s+dark:bg-)/g, replacement: 'bg-fuchsia-50 dark:bg-fuchsia-900/20' },
  { regex: /text-fuchsia-700(?!\s+dark:text-)/g, replacement: 'text-fuchsia-700 dark:text-fuchsia-400' },
  { regex: /text-fuchsia-600(?!\s+dark:text-)/g, replacement: 'text-fuchsia-600 dark:text-fuchsia-400' },
  { regex: /border-fuchsia-100(?!\s+dark:border-)/g, replacement: 'border-fuchsia-100 dark:border-fuchsia-800/30' },
  { regex: /border-fuchsia-200(?!\s+dark:border-)/g, replacement: 'border-fuchsia-200 dark:border-fuchsia-800/50' },
  
  { regex: /bg-indigo-50(?!\s+dark:bg-)/g, replacement: 'bg-indigo-50 dark:bg-indigo-900/20' },
  { regex: /text-indigo-700(?!\s+dark:text-)/g, replacement: 'text-indigo-700 dark:text-indigo-400' },
  { regex: /text-indigo-600(?!\s+dark:text-)/g, replacement: 'text-indigo-600 dark:text-indigo-400' },
  { regex: /border-indigo-100(?!\s+dark:border-)/g, replacement: 'border-indigo-100 dark:border-indigo-800/30' },
  { regex: /border-indigo-200(?!\s+dark:border-)/g, replacement: 'border-indigo-200 dark:border-indigo-800/50' },
  
  { regex: /bg-teal-50(?!\s+dark:bg-)/g, replacement: 'bg-teal-50 dark:bg-teal-900/20' },
  { regex: /bg-teal-100(?!\s+dark:bg-)/g, replacement: 'bg-teal-100 dark:bg-teal-900/40' },
  { regex: /text-teal-700(?!\s+dark:text-)/g, replacement: 'text-teal-700 dark:text-teal-400' },
  { regex: /border-teal-100(?!\s+dark:border-)/g, replacement: 'border-teal-100 dark:border-teal-800/30' },
  { regex: /border-teal-200(?!\s+dark:border-)/g, replacement: 'border-teal-200 dark:border-teal-800/50' },
  
  { regex: /bg-cyan-50(?!\s+dark:bg-)/g, replacement: 'bg-cyan-50 dark:bg-cyan-900/20' },
  { regex: /text-cyan-700(?!\s+dark:text-)/g, replacement: 'text-cyan-700 dark:text-cyan-400' },
  { regex: /border-cyan-100(?!\s+dark:border-)/g, replacement: 'border-cyan-100 dark:border-cyan-800/30' },
  { regex: /border-cyan-200(?!\s+dark:border-)/g, replacement: 'border-cyan-200 dark:border-cyan-800/50' },
  
  { regex: /bg-sky-50(?!\s+dark:bg-)/g, replacement: 'bg-sky-50 dark:bg-sky-900/20' },
  { regex: /text-sky-700(?!\s+dark:text-)/g, replacement: 'text-sky-700 dark:text-sky-400' },
  { regex: /border-sky-100(?!\s+dark:border-)/g, replacement: 'border-sky-100 dark:border-sky-800/30' },
  { regex: /border-sky-200(?!\s+dark:border-)/g, replacement: 'border-sky-200 dark:border-sky-800/50' },
  
  { regex: /bg-purple-50(?!\s+dark:bg-)/g, replacement: 'bg-purple-50 dark:bg-purple-900/20' },
  { regex: /text-purple-700(?!\s+dark:text-)/g, replacement: 'text-purple-700 dark:text-purple-400' },
  { regex: /text-purple-600(?!\s+dark:text-)/g, replacement: 'text-purple-600 dark:text-purple-400' },
  { regex: /border-purple-100(?!\s+dark:border-)/g, replacement: 'border-purple-100 dark:border-purple-800/30' },
  { regex: /border-purple-200(?!\s+dark:border-)/g, replacement: 'border-purple-200 dark:border-purple-800/50' },
  
  { regex: /bg-red-50(?!\s+dark:bg-)/g, replacement: 'bg-red-50 dark:bg-red-900/20' },
  { regex: /text-red-600(?!\s+dark:text-)/g, replacement: 'text-red-600 dark:text-red-400' },
  { regex: /text-red-500(?!\s+dark:text-)/g, replacement: 'text-red-500 dark:text-red-400' },
  { regex: /border-red-100(?!\s+dark:border-)/g, replacement: 'border-red-100 dark:border-red-800/30' },
  { regex: /border-red-200(?!\s+dark:border-)/g, replacement: 'border-red-200 dark:border-red-800/50' },
  
  { regex: /bg-white(?!\s+dark:bg-)/g, replacement: 'bg-white dark:bg-slate-800' }
];

replacements.forEach(({ regex, replacement }) => {
  content = content.replace(regex, replacement);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done replacing colors in smart-prep.component.ts');
