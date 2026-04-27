import re

with open('src/app/features/standards/standard.service.ts', 'r') as f:
    content = f.read()

# Fix setDoc
content = content.replace(
    'const globalLogRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_usages/${log.id}`);\n              await setDoc(globalLogRef, log);',
    'const globalLogRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_usages/${log.id}`);\n              log.lastUpdated = serverTimestamp();\n              await setDoc(globalLogRef, log);'
)

# Fix updateDoc missing lastUpdated
content = content.replace(
    'updateDoc(globalLogRef, { user: reqData.requestedByName }).catch(() => {});',
    'updateDoc(globalLogRef, { user: reqData.requestedByName, lastUpdated: serverTimestamp() }).catch(() => {});'
)

# Fix deleteDoc to updateDoc
content = content.replace(
    'await deleteDoc(globalLogRef).catch(() => {});',
    'await updateDoc(globalLogRef, { _isDeleted: true, lastUpdated: serverTimestamp() }).catch(() => {});'
)

# Fix corrupted fixMissingReturnLogs replacement
content = content.replace(
    '''                      const globalLogRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_usages/${log.id}`);
              transaction.update(globalLogRef, { _isDeleted: true, lastUpdated: serverTimestamp() });
                      transaction.delete(logRef);''',
    '''                      const globalLogRef = doc(this.fb.db, `artifacts/${this.fb.APP_ID}/standard_usages/${log.id}`);
                      transaction.update(globalLogRef, { _isDeleted: true, lastUpdated: serverTimestamp() });
                      transaction.delete(logRef);'''
)


with open('src/app/features/standards/standard.service.ts', 'w') as f:
    f.write(content)

