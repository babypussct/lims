import re

with open('src/app/core/services/delta-sync.service.ts', 'r') as f:
    content = f.read()

content = content.replace(
    "private loadFromCache<T>(key: string): T[] {",
    "public getCache<T>(key: string): T[] {\n    return this.loadFromCache<T>(key);\n  }\n\n  private loadFromCache<T>(key: string): T[] {"
)

with open('src/app/core/services/delta-sync.service.ts', 'w') as f:
    f.write(content)

