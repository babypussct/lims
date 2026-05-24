const fs = require('fs');
const path = require('path');

function searchFile(dir, filename) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== '.gemini') {
                results = results.concat(searchFile(fullPath, filename));
            }
        } else if (file === filename) {
            results.push({ path: fullPath, size: stat.size, mtime: stat.mtime });
        }
    });
    return results;
}

const root = path.join(__dirname, '..');
const matches = searchFile(root, 'filebieumau3_FORM_CLEAN.docx');
console.log("Matches found:");
matches.forEach(m => {
    console.log(`- Path: ${m.path}`);
    console.log(`  Size: ${m.size} bytes`);
    console.log(`  Modified: ${m.mtime}`);
});
