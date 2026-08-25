import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('ActivityFeedService uses bounded audience-scoped listeners and canonical reader validation', () => {
  const source = readFileSync('src/app/core/services/activity-feed.service.ts', 'utf8');
  assert.match(source, /where\('audience', '==', audience\)/);
  assert.match(source, /where\('activityVisible', '==', true\)/);
  assert.match(source, /orderBy\('timestamp', 'desc'\)/);
  assert.match(source, /limit\(this\.perAudienceLimit\)/);
  assert.match(source, /resolveActivityFeedScope\(enabled, uid, role, permissions\)/);
  assert.match(source, /parseActivityFeedEvent\(/);
  assert.match(source, /stopListenersAndClear\(\)/);
  assert.match(source, /user_preferences\/\$\{uid\}/);
  assert.match(source, /lastActivitySeenAt: serverTimestamp\(\)/);
  assert.doesNotMatch(source, /isRead/);
});

test('ActivityFeedService reacts to realtime identity/permission signals and clears before publishing a changed scope', () => {
  const source = readFileSync('src/app/core/services/activity-feed.service.ts', 'utf8');
  assert.match(source, /const profile = this\.auth\.currentUser\(\)/);
  assert.match(source, /const permissions = this\.auth\.userPermissions\(\)/);
  assert.match(source, /this\.reconcileScope\(enabled, profile\?\.uid, profile\?\.role, permissions\)/);

  const stopIndex = source.indexOf('this.stopListenersAndClear();');
  const audiencesIndex = source.indexOf('this.allowedAudiences.set(audiences);');
  const scopeIndex = source.indexOf('this.scopeKey.set(nextScope);');
  assert.ok(stopIndex >= 0 && audiencesIndex > stopIndex && scopeIndex > stopIndex);
});

test('Dashboard V2 uses structured feed service, primary module filters and no displayName visibility heuristic', () => {
  const component = readFileSync('src/app/features/dashboard/dashboard.component.ts', 'utf8');
  const template = readFileSync('src/app/features/dashboard/dashboard.component.html', 'utf8');
  assert.match(component, /ActivityFeedService/);
  assert.match(component, /filterActivityFeedEvents\(/);
  assert.match(component, /activityFeedV2/);
  assert.doesNotMatch(component, /canViewActivityLog\(/);
  assert.doesNotMatch(component, /log\.user === currentName/);
  assert.match(template, /activityFilterOptions\(\)/);
  assert.doesNotMatch(template, /'APPROVE'/);
  assert.match(template, /importantActivityOnly/);
  assert.match(component, /recordDashboardView\(\)/);
  assert.match(component, /isActivityEventNewSince\(/);
  assert.match(template, /Mới kể từ lần truy cập trước/);
  assert.match(template, /getActivityAggregationText\(log\)/);
  assert.match(template, /aria-label="Tìm kiếm hoạt động"/);
  assert.match(template, /aria-pressed/);
});
