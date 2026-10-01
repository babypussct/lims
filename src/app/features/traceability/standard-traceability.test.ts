import '@angular/compiler';
import assert from 'node:assert/strict';
import test from 'node:test';
import { Injector, runInInjectionContext, signal } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { TraceabilityComponent } from './traceability.component';
import { isStandardActivity, standardAuditFilters, StandardTraceRecord } from './traceability-data.service';
import { buildStandardTraceTimeline, mergeStandardUsages, standardTraceSummary, standardTraceTitle } from './standard-traceability.utils';
import { buildStandardUsageTimelineItem } from '../../shared/utils/standard-usage-timeline';
import { UsageLog } from '../../core/models/standard.model';
import { Log } from '../../core/models/log.model';
import { AppUiTimelineComponent } from '../../shared/components/ui/timeline/timeline.component';

const avatarCalls: (string | undefined)[] = [];
const avatar = (uid: string | undefined, name: string) => {
  avatarCalls.push(uid);
  return { displayName: name, style: 'google', photoURL: uid ? `https://example.test/${uid}.png` : null };
};
const usage: UsageLog = { id: 'use-1', date: '2026-08-15T08:30:00+07:00', timestamp: 1786757400000,
  user: 'Nguyễn Văn An', userId: 'actual-user', amount_used: 2.5, unit: 'mL', purpose: 'Phân tích mẫu', requestId: 'borrow-1' };
const record: StandardTraceRecord = { id: 'borrow-1', recordType: 'STANDARD_REQUEST', standard: null, usage: null,
  request: { id: 'borrow-1', standardId: 'std-1', standardName: 'Chuẩn A', requestedBy: 'actual-user',
    requestedByName: usage.user, requestDate: 1700000000000, status: 'IN_PROGRESS', purpose: usage.purpose,
    totalAmountUsed: 2.5, usageLogs: [] } };

test('usage timeline resolves the actual user by UID, links the request and renders generic actions with separate pills', () => {
  avatarCalls.length = 0;
  const item = buildStandardUsageTimelineItem({ ...usage, isDepleted: true }, 0, null, avatar);
  assert.deepEqual(avatarCalls, ['actual-user']);
  assert.equal(item.actorName, usage.user);
  assert.equal(item.actorAvatarUrl, 'https://example.test/actual-user.png');
  assert.equal(item.title, 'Ghi nhận sử dụng');
  assert.match(item.pills![0].label, /2[.,]50 mL/);
  assert.equal(item.pills![1].label, 'Hết chuẩn');
  assert.deepEqual(item.metadata!.find(meta => meta.label === 'Phiếu')!.routerLink, ['/traceability', 'borrow-1']);
  const historical = buildStandardUsageTimelineItem(usage, 0, { status: 'DEPLETED' }, avatar);
  assert.equal(historical.pills!.length, 1);
});

test('backfill keeps the business date and distinguishes the entrant from the actual user', () => {
  const backfill = { ...usage, isBackfill: true, timestamp: 1800000000000, backfilledAt: 1800000000000,
    backfilledByUid: 'entrant', backfilledByName: 'Trần Bình' };
  const item = buildStandardUsageTimelineItem(backfill, 0, null, avatar);
  assert.equal(item.timestamp, usage.date);
  assert.equal(item.actorName, usage.user);
  assert.match(item.actorSubtext!, /Nhập bù bởi Trần Bình vào/);
  assert.equal(item.icon, 'fa-clock-rotate-left');
});

test('unknown original units never get replaced with normalized units or current stock units', () => {
  const item = buildStandardUsageTimelineItem({ ...usage, unit: undefined, normalized_unit: 'mg', normalized_amount: 2500 }, 0, { unit: 'g' }, avatar);
  assert.match(item.pills![0].label, /chưa rõ đơn vị/);
  assert.doesNotMatch(item.pills![0].label, /mg| g/);
  const missing = buildStandardUsageTimelineItem({ ...usage, amount_used: NaN }, 0, null, avatar);
  assert.equal(missing.pills![0].label, 'Chưa ghi nhận');
});

test('avatar failures fall back to initials and retry a different photo URL', () => {
  const component = runInInjectionContext(Injector.create({ providers: [] }), () => new AppUiTimelineComponent());
  const item = buildStandardUsageTimelineItem(usage, 0, null, avatar);
  component.avatarFailed(item.actorAvatarUrl!);
  assert.equal(component.failedAvatars().has(item.actorAvatarUrl!), true);
  assert.equal(component.initials(item), 'VA');
  assert.equal(component.failedAvatars().has('https://example.test/new-photo.png'), false);
});

test('stable usage IDs merge snapshots, rollback tombstones win, identical moments remain distinct', () => {
  const merged = mergeStandardUsages([usage, { ...usage, id: 'use-2' }], [{ ...usage, purpose: 'Canonical' }]);
  assert.equal(merged.length, 2);
  assert.equal(merged[0].purpose, 'Canonical');
  assert.deepEqual(mergeStandardUsages([usage], [{ ...usage, _isDeleted: true }]), []);
  assert.equal(mergeStandardUsages([{ ...usage, id: undefined }, { ...usage, id: undefined }], []).length, 2);
});

test('matching usage audit events add provenance without counting a second use, uncorrelated events remain separate', () => {
  const event: Log = { id: 'audit-1', action: 'LOG_USAGE_STANDARD', module: 'STANDARD', details: 'Usage', user: 'Manager',
    timestamp: usage.timestamp, metadata: { usageLogId: usage.id }, requestId: 'borrow-1' };
  const items = buildStandardTraceTimeline(record, [usage, { ...usage, id: 'use-2' }], [event, event], avatar);
  assert.equal(items.filter(item => item.title === 'Ghi nhận sử dụng').length, 2);
  assert.equal(items.filter(item => item.id === 'audit:audit-1').length, 0);
  assert.equal(items.find(item => item.id === 'usage:use-1')!.metadata!.filter(meta => meta.value === 'audit-1').length, 1);
  const unrelated = buildStandardTraceTimeline(record, [usage], [{ ...event, metadata: {} }], avatar);
  assert.ok(unrelated.some(item => item.id === 'audit:audit-1'));
  assert.match(standardTraceSummary(record).find(field => field.label === 'Tổng lượng đã dùng theo phiếu')!.value, /^2[.,]50/);
  assert.match(standardTraceSummary(record).find(field => field.label === 'Lượng đăng ký')!.value, /Chưa ghi nhận/);
  assert.match(standardTraceSummary(record).find(field => field.label === 'Tổng lượng đã dùng theo phiếu')!.value, /chưa rõ đơn vị/);
  assert.equal(standardTraceTitle({ ...record, request: { ...record.request!, standardName: '  ' } }), 'Chất chuẩn đối chiếu');
});

test('backfilled requests do not invent historical borrowing or approval events', () => {
  const items = buildStandardTraceTimeline({ ...record, request: { ...record.request!, isBackfill: true,
    backfilledAt: 1800000000000, approvalDate: 1786757400000, returnDate: 1786757400000 } }, [usage], [], avatar);
  assert.equal(items.filter(item => item.id.startsWith('request:')).length, 1);
  assert.equal(items.find(item => item.id.startsWith('request:'))!.title, 'Nhập hồ sơ sử dụng lịch sử');
});

test('audit queries constrain audience/visibility or BUSINESS audit class and do not broaden staff access', () => {
  assert.equal(isStandardActivity({ action: 'APPROVE_STANDARD_REQUEST' } as Log), true, 'Legacy standard actions need no module field');
  assert.equal(isStandardActivity({ action: 'APPROVE_REQUEST', module: 'RESULT' } as Log), false);
  const viewer = standardAuditFilters('borrow-1', false, permission => permission === 'standard_log_view');
  assert.deepEqual(viewer, [[['requestId', 'borrow-1'], ['module', 'STANDARD'], ['audience', 'STANDARD_VIEW'], ['activityVisible', true]]]);
  assert.deepEqual(standardAuditFilters('borrow-1', false, permission => permission === 'standard_request'), []);
  assert.equal(standardAuditFilters('borrow-1', false, permission => permission === 'standard_edit').length, 2);
  assert.deepEqual(standardAuditFilters('borrow-1', false, permission => permission === 'report_view')[0].at(-1), ['auditClass', 'BUSINESS']);
});

test('canonical standard activity hydrates its standard request and retains the selected audit record identity', async () => {
  const { c, reads } = harness();
  const event = { id: 'approval-event', action: 'APPROVE_STANDARD_REQUEST', requestId: 'borrow-1', details: 'Duyệt chuẩn', user: 'Quản lý', timestamp: 1700000000000 };
  let lookupId = '';
  c.data.readDocument = async (ref: { path: string }) => {
    reads.push(ref.path);
    return ref.path.endsWith('/logs/approval-event') ? { id: event.id, exists: () => true, data: () => event } : null;
  };
  c.data.findStandardRecord = async (id: string) => { lookupId = id; return record; };
  await c.loadData('approval-event');
  assert.equal(lookupId, 'borrow-1');
  assert.equal(c.recordType(), 'ACTIVITY_LOG');
  assert.equal(c.logData().id, 'approval-event');
  assert.equal(reads.some(path => /\/(requests|print_jobs)\//.test(path)), false);
});

const fixtureApp = initializeApp({ projectId: 'demo-trace-unit', apiKey: 'fixture', appId: 'fixture' }, 'trace-unit');
function deferred<T>() { let resolve!: (value: T) => void; const promise = new Promise<T>(done => { resolve = done; }); return { promise, resolve }; }
function harness() {
  // Exercise the real asynchronous component methods without rendering its unrelated SOP UI.
  const c = Object.create(TraceabilityComponent.prototype) as any;
  const user = signal<{ uid: string } | null>({ uid: 'actual-user' });
  const audit = signal(false);
  c.auth = { currentUser: user, isStandardAuditMode: audit, isManager: () => false, hasPermission: () => false };
  c.fb = { db: getFirestore(fixtureApp), APP_ID: 'fixture' };
  c.state = { getUserAvatarOptionsByUid: avatar };
  c.lookupRequest = 0; c.currentScope = c.viewerScope();
  for (const key of ['isLoading', 'isVerifying', 'standardHistoryLoading', 'standardHistoryHasMore']) c[key] = signal(false);
  for (const key of ['logData', 'standardRecord', 'recordType']) c[key] = signal(null);
  for (const key of ['timelineItems', 'standardHistoryNotes', 'standardUsages']) c[key] = signal([]);
  c.verifyStep = signal(-1); c.errorMsg = signal('');
  const reads: string[] = [];
  c.data = { readDocument: async (ref: { path: string }) => { reads.push(ref.path); return null; },
    findStandardRecord: async () => record, historySources: () => [],
    loadHistory: async () => ({ usages: [], events: [], sources: [], notes: [] }) };
  return { c, user, audit, reads };
}

test('direct requests and direct usages resolve their own record types without SOP hydration', async () => {
  const { c, reads } = harness();
  await c.loadData('borrow-1');
  assert.equal(c.recordType(), 'STANDARD_REQUEST');
  assert.equal(reads.some(path => /\/(requests|print_jobs)\//.test(path)), false);
  c.data.findStandardRecord = async () => ({ ...record, id: usage.id, recordType: 'STANDARD_USAGE', usage });
  await c.loadData('use-1');
  assert.equal(c.recordType(), 'STANDARD_USAGE');
});

test('anonymous and Audit lookups never read private standard records', async () => {
  for (const mode of ['anonymous', 'audit']) {
    const { c, user, audit } = harness();
    if (mode === 'anonymous') user.set(null); else audit.set(true);
    let calls = 0; c.data.findStandardRecord = async () => { calls++; return record; };
    await c.loadData('borrow-1');
    assert.equal(calls, 0);
    assert.equal(c.standardRecord(), null);
  }
});

test('a slower lookup, logout, Audit activation or teardown cannot replace the current record', async () => {
  for (const scenario of ['navigation', 'logout', 'audit', 'destroy']) {
    const { c, user, audit } = harness();
    const pending = deferred<StandardTraceRecord | null>();
    c.data.findStandardRecord = (id: string) => id === 'old' ? pending.promise : Promise.resolve({ ...record, id: 'new' });
    const first = c.loadData('old');
    // Public exact reads settle before the private lookup starts.
    await new Promise(resolve => setTimeout(resolve, 0));
    if (scenario === 'navigation') await c.loadData('new');
    if (scenario === 'logout') user.set(null);
    if (scenario === 'audit') audit.set(true);
    if (scenario === 'destroy') c.ngOnDestroy();
    pending.resolve({ ...record, id: 'old' });
    await first;
    assert.equal(c.standardRecord()?.id || null, scenario === 'navigation' ? 'new' : null);
  }
});

test('denied/empty history retains the authorized summary and does not claim zero usage', async () => {
  const { c } = harness();
  c.data.loadHistory = async () => ({ usages: [], events: [], sources: [], notes: ['Một phần lịch sử không được cấp quyền xem.'] });
  await c.loadData('borrow-1');
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.equal(c.standardRecord()?.request.totalAmountUsed, 2.5);
  assert.ok(c.standardHistoryNotes().some((note: string) => note.includes('chưa tải được nhật ký từng lần')));
  assert.equal(c.errorMsg(), '');
});

test('an older history page cannot contaminate a newly selected record', async () => {
  const { c } = harness();
  const page = deferred<any>();
  c.data.loadHistory = () => page.promise;
  await c.loadData('borrow-1');
  c.data.loadHistory = async () => ({ usages: [], events: [], sources: [], notes: [] });
  c.data.findStandardRecord = async () => ({ ...record, id: 'new' });
  await c.loadData('new');
  page.resolve({ usages: [usage], events: [], sources: [], notes: [] });
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.equal(c.standardRecord().id, 'new');
  assert.deepEqual(c.standardUsages(), []);
});
