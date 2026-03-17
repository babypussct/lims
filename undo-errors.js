const fs = require('fs');
const filePath = 'src/app/features/preparation/smart-prep.component.ts';
let content = fs.readFileSync(filePath, 'utf8');

const replacements = [
  { regex: /bg-slate-50 dark:bg-slate-900\/500/g, replacement: 'bg-slate-500' },
  { regex: /bg-slate-100 dark:bg-slate-8000/g, replacement: 'bg-slate-1000' },
  { regex: /bg-slate-200 dark:bg-slate-7000/g, replacement: 'bg-slate-2000' },
  { regex: /border-slate-100 dark:border-slate-7000/g, replacement: 'border-slate-1000' },
  { regex: /border-slate-200 dark:border-slate-7000/g, replacement: 'border-slate-2000' },
  { regex: /text-slate-300 dark:text-slate-5000/g, replacement: 'text-slate-3000' },
  { regex: /text-slate-400 dark:text-slate-5000/g, replacement: 'text-slate-4000' },
  { regex: /text-slate-500 dark:text-slate-4000/g, replacement: 'text-slate-5000' },
  { regex: /text-slate-600 dark:text-slate-3000/g, replacement: 'text-slate-6000' },
  { regex: /text-slate-700 dark:text-slate-2000/g, replacement: 'text-slate-7000' },
  { regex: /text-slate-800 dark:text-slate-1000/g, replacement: 'text-slate-8000' },
  
  { regex: /bg-blue-50 dark:bg-blue-900\/200/g, replacement: 'bg-blue-500' },
  { regex: /text-blue-700 dark:text-blue-4000/g, replacement: 'text-blue-7000' },
  { regex: /border-blue-100 dark:border-blue-800\/300/g, replacement: 'border-blue-1000' },
  { regex: /border-blue-200 dark:border-blue-800\/500/g, replacement: 'border-blue-2000' },
  
  { regex: /bg-orange-50 dark:bg-orange-900\/200/g, replacement: 'bg-orange-500' },
  { regex: /bg-orange-100 dark:bg-orange-900\/400/g, replacement: 'bg-orange-1000' },
  { regex: /text-orange-700 dark:text-orange-4000/g, replacement: 'text-orange-7000' },
  { regex: /border-orange-100 dark:border-orange-800\/300/g, replacement: 'border-orange-1000' },
  { regex: /border-orange-200 dark:border-orange-800\/500/g, replacement: 'border-orange-2000' },
  
  { regex: /bg-emerald-50 dark:bg-emerald-900\/200/g, replacement: 'bg-emerald-500' },
  { regex: /text-emerald-700 dark:text-emerald-4000/g, replacement: 'text-emerald-7000' },
  { regex: /text-emerald-600 dark:text-emerald-4000/g, replacement: 'text-emerald-6000' },
  { regex: /border-emerald-100 dark:border-emerald-800\/300/g, replacement: 'border-emerald-1000' },
  { regex: /border-emerald-200 dark:border-emerald-800\/500/g, replacement: 'border-emerald-2000' },
  
  { regex: /bg-fuchsia-50 dark:bg-fuchsia-900\/200/g, replacement: 'bg-fuchsia-500' },
  { regex: /text-fuchsia-700 dark:text-fuchsia-4000/g, replacement: 'text-fuchsia-7000' },
  { regex: /text-fuchsia-600 dark:text-fuchsia-4000/g, replacement: 'text-fuchsia-6000' },
  { regex: /border-fuchsia-100 dark:border-fuchsia-800\/300/g, replacement: 'border-fuchsia-1000' },
  { regex: /border-fuchsia-200 dark:border-fuchsia-800\/500/g, replacement: 'border-fuchsia-2000' },
  
  { regex: /bg-indigo-50 dark:bg-indigo-900\/200/g, replacement: 'bg-indigo-500' },
  { regex: /text-indigo-700 dark:text-indigo-4000/g, replacement: 'text-indigo-7000' },
  { regex: /text-indigo-600 dark:text-indigo-4000/g, replacement: 'text-indigo-6000' },
  { regex: /border-indigo-100 dark:border-indigo-800\/300/g, replacement: 'border-indigo-1000' },
  { regex: /border-indigo-200 dark:border-indigo-800\/500/g, replacement: 'border-indigo-2000' },
  
  { regex: /bg-teal-50 dark:bg-teal-900\/200/g, replacement: 'bg-teal-500' },
  { regex: /bg-teal-100 dark:bg-teal-900\/400/g, replacement: 'bg-teal-1000' },
  { regex: /text-teal-700 dark:text-teal-4000/g, replacement: 'text-teal-7000' },
  { regex: /border-teal-100 dark:border-teal-800\/300/g, replacement: 'border-teal-1000' },
  { regex: /border-teal-200 dark:border-teal-800\/500/g, replacement: 'border-teal-2000' },
  
  { regex: /bg-cyan-50 dark:bg-cyan-900\/200/g, replacement: 'bg-cyan-500' },
  { regex: /text-cyan-700 dark:text-cyan-4000/g, replacement: 'text-cyan-7000' },
  { regex: /border-cyan-100 dark:border-cyan-800\/300/g, replacement: 'border-cyan-1000' },
  { regex: /border-cyan-200 dark:border-cyan-800\/500/g, replacement: 'border-cyan-2000' },
  
  { regex: /bg-sky-50 dark:bg-sky-900\/200/g, replacement: 'bg-sky-500' },
  { regex: /text-sky-700 dark:text-sky-4000/g, replacement: 'text-sky-7000' },
  { regex: /border-sky-100 dark:border-sky-800\/300/g, replacement: 'border-sky-1000' },
  { regex: /border-sky-200 dark:border-sky-800\/500/g, replacement: 'border-sky-2000' },
  
  { regex: /bg-purple-50 dark:bg-purple-900\/200/g, replacement: 'bg-purple-500' },
  { regex: /text-purple-700 dark:text-purple-4000/g, replacement: 'text-purple-7000' },
  { regex: /text-purple-600 dark:text-purple-4000/g, replacement: 'text-purple-6000' },
  { regex: /border-purple-100 dark:border-purple-800\/300/g, replacement: 'border-purple-1000' },
  { regex: /border-purple-200 dark:border-purple-800\/500/g, replacement: 'border-purple-2000' },
  
  { regex: /bg-red-50 dark:bg-red-900\/200/g, replacement: 'bg-red-500' },
  { regex: /text-red-600 dark:text-red-4000/g, replacement: 'text-red-6000' },
  { regex: /text-red-500 dark:text-red-4000/g, replacement: 'text-red-5000' },
  { regex: /border-red-100 dark:border-red-800\/300/g, replacement: 'border-red-1000' },
  { regex: /border-red-200 dark:border-red-800\/500/g, replacement: 'border-red-2000' },
  
  { regex: /bg-white dark:bg-slate-800\/20/g, replacement: 'bg-white/20' },
  { regex: /bg-white dark:bg-slate-800\/10/g, replacement: 'bg-white/10' },
  { regex: /bg-white dark:bg-slate-800\/50/g, replacement: 'bg-white/50' },
  
  // Undo the bg-white dark:bg-slate-800 that was added to things that already had dark:bg-something
  { regex: /bg-white dark:bg-slate-800 dark:bg-([a-z0-9-]+)/g, replacement: 'bg-white dark:bg-$1' }
];

replacements.forEach(({ regex, replacement }) => {
  content = content.replace(regex, replacement);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done undoing errors in smart-prep.component.ts');
