import re

# Fix standard.service.ts
with open('src/app/features/standards/standard.service.ts', 'r') as f:
    content = f.read()

bad_logic = """                      const globalLogRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_usages/${log.id}`);
                      if (globalLogDoc.exists()) {
              transaction.update(globalLogRef, { _isDeleted: true, lastUpdated: serverTimestamp() });
          }"""

good_logic = """                      const globalLogRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_usages/${log.id}`);
                      transaction.set(globalLogRef, { _isDeleted: true, lastUpdated: serverTimestamp() }, { merge: true });"""

content = content.replace(bad_logic, good_logic)

with open('src/app/features/standards/standard.service.ts', 'w') as f:
    f.write(content)

# Fix standard-usage.component.ts
with open('src/app/features/standards/usage/standard-usage.component.ts', 'r') as f:
    content = f.read()

content = content.replace(
    "this.toast.show('Không có dữ liệu để xuất.', 'warning');",
    "this.toast.show('Không có dữ liệu để xuất.', 'info');"
)

with open('src/app/features/standards/usage/standard-usage.component.ts', 'w') as f:
    f.write(content)

