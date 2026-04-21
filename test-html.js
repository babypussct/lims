const fs = require('fs');
const content = fs.readFileSync('src/app/features/standards/standards.component.ts', 'utf8');
const match = content.match(/template:\s*`([\s\S]*?)`\n/);
if (match) {
    console.log(match[1].split('\n').slice(0, 70).join('\n'));
}
