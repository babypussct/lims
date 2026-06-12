import os
import re

sops_dir = r"src\app\features\results\sops"

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf8') as f:
        content = f.read()
    
    # Regex to find missing closing bracket for isTargetAssigned
    pattern = r'return isCompoundAssigned\(assigned, compound, this\.masterTargets\(\)\);\n\n\s*prefillUnassignedTargets\(\) \{'
    replacement = r'return isCompoundAssigned(assigned, compound, this.masterTargets());\n  }\n\n  prefillUnassignedTargets() {'
    
    new_content, count = re.subn(pattern, replacement, content)
    
    if count > 0:
        with open(filepath, 'w', encoding='utf8') as f:
            f.write(new_content)
        print(f"Fixed {filepath}")

for root, dirs, files in os.walk(sops_dir):
    for file in files:
        if file.endswith('-entry.component.ts'):
            fix_file(os.path.join(root, file))
