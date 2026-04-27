import re

with open('src/app/core/services/state.service.ts', 'r') as f:
    content = f.read()

# 1. Inject DeltaSyncService
if 'import { DeltaSyncService }' not in content:
    content = content.replace(
        "import { CalculatorService } from './calculator.service';",
        "import { CalculatorService } from './calculator.service';\nimport { DeltaSyncService } from './delta-sync.service';"
    )

if 'private deltaSync = inject(DeltaSyncService);' not in content:
    content = content.replace(
        "private injector = inject(Injector);",
        "private injector = inject(Injector);\n  private deltaSync = inject(DeltaSyncService);"
    )

# 2. Update standard_requests listener
old_listener = """    // standard_requests listener: phân nhánh theo quyền để khớp với Firestore Rules.
    // Manager: query tất cả pending (cần để duyệt)
    // Nhân viên thường: query chỉ request của chính mình (tránh permission-denied)
    const currentUser = this.auth.currentUser();
    const isApprover = this.auth.canApprove() || this.auth.canApproveStandards();
    const uid = currentUser?.uid;

    let stdReqQuery;
    if (isApprover) {
        // Manager/Admin: thấy tất cả pending + pending_return để duyệt
        stdReqQuery = query(
            collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'standard_requests'),
            where('status', 'in', ['PENDING_APPROVAL', 'PENDING_RETURN']),
            orderBy('requestDate', 'desc')
        );
    } else if (uid) {
        // Nhân viên thường: chỉ thấy request của mình (khớp rule Firestore)
        stdReqQuery = query(
            collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'standard_requests'),
            where('requestedBy', '==', uid),
            where('status', 'in', ['PENDING_APPROVAL', 'IN_PROGRESS', 'PENDING_RETURN']),
            orderBy('requestDate', 'desc')
        );
    } else {
        stdReqQuery = null;
    }

    if (stdReqQuery) {
        const stdReqSub = onSnapshot(stdReqQuery,
            (s) => { const items: any[] = []; s.forEach(d => items.push({ id: d.id, ...d.data() })); this.standardRequests.set(items); },
            handleError('Standard Requests')
        );
        this.listeners.push(stdReqSub);
    }"""

new_listener = """    // standard_requests listener: DeltaSync phân nhánh theo quyền
    const currentUser = this.auth.currentUser();
    const isApprover = this.auth.canApprove() || this.auth.canApproveStandards();
    const uid = currentUser?.uid;

    let constraints = null;
    let cacheKey = '';
    if (isApprover) {
        constraints = [where('status', 'in', ['PENDING_APPROVAL', 'PENDING_RETURN'])];
        cacheKey = 'lims_std_req_approver_' + this.fb.APP_ID;
    } else if (uid) {
        constraints = [
            where('requestedBy', '==', uid),
            where('status', 'in', ['PENDING_APPROVAL', 'IN_PROGRESS', 'PENDING_RETURN'])
        ];
        cacheKey = 'lims_std_req_user_' + uid + '_' + this.fb.APP_ID;
    }

    if (constraints && cacheKey) {
        const stdReqSub = this.deltaSync.startListener({
            cacheKey: cacheKey,
            cursorKey: cacheKey + '_cursor',
            collectionPath: `artifacts/${this.fb.APP_ID}/standard_requests`,
            maxCacheSize: 300,
            orderByField: 'requestDate',
            orderDirection: 'desc',
            queryConstraints: constraints
        }, (data) => {
            this.standardRequests.set(data);
        });
        this.listeners.push(stdReqSub);
    }"""
content = content.replace(old_listener, new_listener)

with open('src/app/core/services/state.service.ts', 'w') as f:
    f.write(content)

