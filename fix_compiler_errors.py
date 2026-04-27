import re

with open('src/app/features/standards/standard.service.ts', 'r') as f:
    content = f.read()

# Fix lastUpdated index signature
content = content.replace(
    "reqUpdateData.lastUpdated = serverTimestamp();",
    "reqUpdateData['lastUpdated'] = serverTimestamp();"
)

# Replace loadStandardsWithDeltaSync usages
content = content.replace(
    "const stds = await this.loadStandardsWithDeltaSync();",
    "const stds = this.getAllStandardsFromCache();"
)
content = content.replace(
    "return await this.loadStandardsWithDeltaSync();",
    "return this.getAllStandardsFromCache();"
)

with open('src/app/features/standards/standard.service.ts', 'w') as f:
    f.write(content)

