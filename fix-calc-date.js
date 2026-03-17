const fs = require('fs');
const filePath = 'src/app/features/sop/calculator/calculator.component.ts';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/<input type="date" formControlName="analysisDate"/g, '<input type="date" formControlName="analysisDate" class="[color-scheme:light] dark:[color-scheme:dark]"');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed calculator date input');
