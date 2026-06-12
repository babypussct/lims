const fs = require('fs');
const path = require('path');

const sopsDir = path.join(__dirname, 'src/app/features/results/sops');

function findAndFixSops(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      findAndFixSops(fullPath);
    } else if (file.endsWith('-entry.component.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const regex = /return isCompoundAssigned\(assigned, compound, this\.masterTargets\(\)\);\n    }\n\n    const matchKey/g;
      
      if (regex.test(content)) {
        content = content.replace(regex, 'return isCompoundAssigned(assigned, compound, this.masterTargets());\n      });\n    }\n\n    const matchKey');
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Fixed', fullPath);
      }
    }
  }
}

findAndFixSops(sopsDir);

// Fix compound-id-resolver.ts
const resolverPath = path.join(__dirname, 'src/app/features/results/shared/compound-id-resolver.ts');
let resolverContent = fs.readFileSync(resolverPath, 'utf8');
resolverContent = resolverContent.replace('function getCanonicalId(name: string): string {', 'export function getCanonicalId(name: string): string {');
fs.writeFileSync(resolverPath, resolverContent, 'utf8');
console.log('Fixed getCanonicalId in compound-id-resolver.ts');
