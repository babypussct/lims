import re

with open('src/app/features/standards/standard.service.ts', 'r') as f:
    content = f.read()

# Replace hard-delete with soft-delete in deleteUsageLog
content = content.replace(
    'transaction.delete(globalLogRef);',
    'if (globalLogDoc.exists()) {\n              transaction.update(globalLogRef, { _isDeleted: true, lastUpdated: serverTimestamp() });\n          }'
)

# Same for deleteRequest
content = content.replace(
    'transaction.delete(globalLogRef);\n                      transaction.delete(logRef);',
    'transaction.update(globalLogRef, { _isDeleted: true, lastUpdated: serverTimestamp() });\n                      transaction.delete(logRef);'
)

# Fix where log is set
def repl(m):
    return 'log.lastUpdated = serverTimestamp();\n' + m.group(0)

content = re.sub(r'(\s*)(transaction|batch)\.set\(\s*globalLogRef,\s*log\s*\);', repl, content)

with open('src/app/features/standards/standard.service.ts', 'w') as f:
    f.write(content)

