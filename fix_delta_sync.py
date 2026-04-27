import re

with open('src/app/core/services/delta-sync.service.ts', 'r') as f:
    content = f.read()

# Fix fetchInitialBatch
content = content.replace(
    'this.fetchInitialBatch(config).then(items => {',
    'this.fetchInitialBatch<T>(config).then(items => {'
)

# Fix indexing
content = content.replace(
    'docData[sortField] = docData[sortField].toMillis() as any;',
    '(docData as any)[sortField] = (docData as any)[sortField].toMillis();'
)

# Fix the condition indexing as well
content = content.replace(
    'if (docData[sortField] && typeof docData[sortField].toMillis === \'function\') {',
    'if ((docData as any)[sortField] && typeof (docData as any)[sortField].toMillis === \'function\') {'
)

with open('src/app/core/services/delta-sync.service.ts', 'w') as f:
    f.write(content)

