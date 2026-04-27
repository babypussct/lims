import re

with open('src/app/features/standards/standard.service.ts', 'r') as f:
    content = f.read()

# createRequest
content = content.replace(
    "transaction.set(reqRef, reqData);",
    "reqData.lastUpdated = serverTimestamp();\n          transaction.set(reqRef, reqData);"
)

# updateDoc / transaction.update for standard_requests
# Let's just find where standard_requests are updated and ensure lastUpdated is there
replacements = [
    (
        "transaction.update(reqRef, { status: 'IN_PROGRESS',",
        "transaction.update(reqRef, { status: 'IN_PROGRESS', lastUpdated: serverTimestamp(),"
    ),
    (
        "transaction.update(reqRef, { status: 'PENDING_APPROVAL',",
        "transaction.update(reqRef, { status: 'PENDING_APPROVAL', lastUpdated: serverTimestamp(),"
    ),
    (
        "transaction.update(reqRef, { status: 'RETURNED',",
        "transaction.update(reqRef, { status: 'RETURNED', lastUpdated: serverTimestamp(),"
    ),
    (
        "transaction.update(reqRef, { status: 'REJECTED',",
        "transaction.update(reqRef, { status: 'REJECTED', lastUpdated: serverTimestamp(),"
    ),
    (
        "transaction.update(reqRef, { _isDeleted: true });",
        "transaction.update(reqRef, { _isDeleted: true, lastUpdated: serverTimestamp() });"
    ),
    (
        "transaction.update(reqRef, reqUpdateData);",
        "reqUpdateData.lastUpdated = serverTimestamp();\n              transaction.update(reqRef, reqUpdateData);"
    ),
    (
        "transaction.update(reqRef, { usageLogs: newLogs });",
        "transaction.update(reqRef, { usageLogs: newLogs, lastUpdated: serverTimestamp() });"
    ),
    (
        "await updateDoc(reqRef, { usageLogs: newLogs });",
        "await updateDoc(reqRef, { usageLogs: newLogs, lastUpdated: serverTimestamp() });"
    ),
]

for old, new in replacements:
    content = content.replace(old, new)

with open('src/app/features/standards/standard.service.ts', 'w') as f:
    f.write(content)

