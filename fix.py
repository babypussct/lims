import os
import re

sops_dir = r"src\app\features\results\sops"

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf8') as f:
        content = f.read()
    
    # Regex to find the broken syntax
    pattern = r'return isCompoundAssigned\(assigned, compound, this\.masterTargets\(\)\);\n\s*\}\n\n\s*const matchKey = Object\.keys'
    replacement = r'return isCompoundAssigned(assigned, compound, this.masterTargets());\n      });\n    }\n\n    const matchKey = Object.keys'
    
    new_content, count = re.subn(pattern, replacement, content)
    
    if count > 0:
        with open(filepath, 'w', encoding='utf8') as f:
            f.write(new_content)
        print(f"Fixed {filepath}")

for root, dirs, files in os.walk(sops_dir):
    for file in files:
        if file.endswith('-entry.component.ts'):
            fix_file(os.path.join(root, file))

# Fix compound-id-resolver.ts
resolver_path = r"src\app\features\results\shared\compound-id-resolver.ts"
with open(resolver_path, 'r', encoding='utf8') as f:
    r_content = f.read()

r_content = r_content.replace('function getCanonicalId(name: string): string {', 'export function getCanonicalId(name: string): string {')

with open(resolver_path, 'w', encoding='utf8') as f:
    f.write(r_content)
print(f"Fixed {resolver_path}")
