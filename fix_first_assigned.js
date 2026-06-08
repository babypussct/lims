const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src/app/features/results/sops', function(filePath) {
  if (filePath.endsWith('entry.component.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace the firstAssigned if block
    const searchRegex = /const firstAssigned = targetMap\s*\?\s*compounds\.find\(\(c: string\) => sampleList\.some\(\(s: string\) => this\.isTargetAssigned\(s, c\)\)\)\s*:\s*compounds\[0\];\s*if \(firstAssigned\) \{\s*this\.draft\.page1Data\['activeCompound'\] = firstAssigned;\s*\}/g;
    
    const replacement = let firstAssigned = targetMap
        ? compounds.find((c: string) => sampleList.some((s: string) => this.isTargetAssigned(s, c)))
        : compounds[0];
      if (!firstAssigned && compounds && compounds.length > 0) {
        firstAssigned = compounds[0];
      }
      if (firstAssigned) {
        this.draft.page1Data['activeCompound'] = firstAssigned;
      };
      
    if (content.match(searchRegex)) {
        content = content.replace(searchRegex, replacement);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed ' + filePath);
    }
  }
});
