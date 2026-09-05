import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const read = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');

test('duty schedule is available to signed-in users and uses dedicated management permission', () => {
  const component = read('src/app/features/duty-stats/duty-stats.component.ts');
  const template = read('src/app/features/duty-stats/duty-stats.component.html');
  const routes = read('src/app/app.routes.ts');
  const navigation = read('src/app/core/layout/navigation.config.ts');
  const permissionCatalog = read('src/app/core/auth/permission-catalog.ts');
  const dashboard = read('src/app/features/dashboard/dashboard.component.html');
  const rules = read('firestore.rules');

  assert.match(component, /AppPageHeaderComponent/);
  assert.match(component, /AppToolbarComponent/);
  assert.match(component, /AppButtonComponent/);
  assert.match(template, /<app-page-header/);
  assert.match(template, /<app-toolbar/);
  assert.match(template, /Xuất CSV/);

  assert.match(routes, /path: 'duty-stats'/);
  assert.match(routes, /duty-stats\.component/);
  assert.doesNotMatch(routes, /path: 'duty-stats'[\s\S]{0,220}permission: PERMISSIONS\.REPORT_VIEW/);

  assert.match(navigation, /'duty-stats': 'Lịch Trực'/);
  assert.match(navigation, /id: 'duty-stats'.*name: 'Lịch Trực'/);
  assert.doesNotMatch(navigation, /id: 'duty-stats'.*access: PERMISSIONS\.REPORT_VIEW/);

  assert.match(permissionCatalog, /DUTY_MANAGE: 'duty_manage'/);
  assert.match(permissionCatalog, /label: 'Quản lý lịch trực'/);
  assert.match(dashboard, /<app-duty-dashboard>/);

  assert.match(rules, /match \/artifacts\/\{appId\}\/duty_staff\/\{staffId\}/);
  assert.match(rules, /match \/artifacts\/\{appId\}\/duty_schedules\/\{scheduleDate\}/);
  assert.match(rules, /hasPermission\(appId, 'duty_manage'\)/);
  assert.match(rules, /allow delete: if false;/);
});

test('duty schedule includes fast assignment and period navigation controls', () => {
  const component = read('src/app/features/duty-stats/duty-stats.component.ts');
  const template = read('src/app/features/duty-stats/duty-stats.component.html');

  assert.match(component, /scheduleStaffSearch/);
  assert.match(component, /normalize\('NFD'\)/);
  assert.match(component, /prevPeriod\(\)/);
  assert.match(component, /nextPeriod\(\)/);
  assert.match(component, /goToCurrentMonth\(\)/);
  assert.match(template, /Tìm nhanh nhân viên/);
  assert.match(template, /Đang tải lịch trực/);
  assert.match(template, /Tháng này/);
  assert.match(template, /toggleScheduleStaff\(staffId, false\)/);
  assert.match(template, /Đã gán cho/);
  assert.match(template, /Cần chọn ít nhất 1 nhân viên hoặc thêm vị trí chưa xác định/);
  assert.match(template, /Vị trí chưa xác định/);
  assert.match(template, /Cần xác minh/);
});

test('phase 2 provides responsive schedule cards and personal shift cues', () => {
  const component = read('src/app/features/duty-stats/duty-stats.component.ts');
  const template = read('src/app/features/duty-stats/duty-stats.component.html');
  const dashboardComponent = read('src/app/features/duty-stats/duty-dashboard.component.ts');
  const dashboardTemplate = read('src/app/features/duty-stats/duty-dashboard.component.html');

  assert.match(template, /class="hidden md:block"/);
  assert.match(template, /class="space-y-3 p-3 md:hidden"/);
  assert.match(template, /class="shift-card/);
  assert.match(template, /Chưa có lịch trực trong khoảng thời gian này/);

  assert.match(component, /inject\(AuthService\)/);
  assert.match(component, /findLinkedDutyStaff/);
  assert.match(component, /readonly myStaffId = computed/);
  assert.match(component, /isMyShift\(schedule: DutyScheduleEntry\)/);
  assert.match(template, /\[class\.border-l-4\]="isMyShift\(schedule\)"/);
  assert.match(template, /border-blue-300/);
  assert.match(template, /Ca của bạn/);

  assert.match(dashboardComponent, /isMyShift\(schedule: \{ staffIds: string\[\] \}\)/);
  assert.match(dashboardTemplate, /@for \(name of namesFor\(schedule\); track \$index\)/);
  assert.match(dashboardTemplate, /fa-solid fa-star/);
  assert.match(dashboardTemplate, /Ca của bạn/);
});

test('dashboard duty widget exposes the current month calendar and monthly statistics', () => {
  const component = read('src/app/features/duty-stats/duty-dashboard.component.ts');
  const template = read('src/app/features/duty-stats/duty-dashboard.component.html');

  assert.match(component, /dutyMonthCalendarDateKeys/);
  assert.match(component, /readonly calendarCells = computed/);
  assert.match(component, /aggregateDutyRosterById/);
  assert.match(component, /readonly personStats = computed/);
  assert.match(component, /readonly averageAssignments = computed/);

  assert.match(template, /Lịch tháng/);
  assert.match(template, /grid-cols-7/);
  assert.match(template, /@for \(cell of calendarCells\(\); track \$index\)/);
  assert.match(template, /Thống kê theo người/);
  assert.match(template, /Người tham gia/);
  assert.match(template, /Bình quân\/người/);
  assert.match(template, /@for \(stat of personStats\(\); track stat\.staffId/);
  assert.match(template, /Chưa khai báo mã nhân viên/);
  assert.match(template, /so bình quân/);
});

test('duty statistics support selected period, full year and all-time balance comparison', () => {
  const component = read('src/app/features/duty-stats/duty-stats.component.ts');
  const template = read('src/app/features/duty-stats/duty-stats.component.html');

  assert.match(component, /type DutyStatsRangeMode = 'selection' \| 'year' \| 'all'/);
  assert.match(component, /readonly statsRangeMode = signal<DutyStatsRangeMode>\('selection'\)/);
  assert.match(component, /aggregateDutyRosterById/);
  assert.match(component, /assignmentDeviationPercent\(total: number\)/);
  assert.match(component, /start: '2000-01-01', end: '2200-12-31'/);
  assert.match(template, /Phạm vi thống kê/);
  assert.match(template, /Cả năm \{\{ selectedYear\(\) \}\}/);
  assert.match(template, /Toàn bộ/);
  assert.match(template, /So với bình quân/);
  assert.match(template, /Chưa khai báo mã nhân viên/);
});

test('Gemini import prompt exposes a prominent copy action beside the prompt', () => {
  const component = read('src/app/features/duty-stats/duty-tsv-import.component.ts');
  const template = read('src/app/features/duty-stats/duty-tsv-import.component.html');

  assert.match(component, /readonly promptCopied = signal\(false\)/);
  assert.match(component, /navigator\.clipboard\.writeText\(this\.prompt\(\)\)/);
  assert.match(component, /this\.promptCopied\.set\(true\)/);
  assert.match(template, /<details open/);
  assert.match(template, /Copy Prompt/);
  assert.match(template, /Đã sao chép/);
  assert.match(template, /fa-copy/);
});

test('Gemini month import requires a second independent TSV match before LIMS import', () => {
  const component = read('src/app/features/duty-stats/duty-tsv-import.component.ts');
  const template = read('src/app/features/duty-stats/duty-tsv-import.component.html');

  assert.match(component, /compareDutyImportRuns/);
  assert.match(component, /readonly verificationText = signal\(''\)/);
  assert.match(component, /readonly verificationMatched = computed/);
  assert.match(component, /readonly independentRunConfirmed = signal\(false\)/);
  assert.match(component, /this\.previewReady\(\) && this\.verificationMatched\(\) && this\.independentRunConfirmed\(\) && this\.reviewed\(\)/);
  assert.match(component, /buildDutyGeminiVerificationPrompt/);
  assert.match(component, /navigator\.clipboard\.writeText\(this\.verificationPrompt\(\)\)/);
  assert.match(component, /validateVerification\(\): void/);
  assert.match(template, /Cổng xác minh trước khi nhập/);
  assert.match(template, /Bắt buộc dùng một cuộc trò chuyện Gemini mới/);
  assert.match(template, /Copy Prompt xác minh/);
  assert.match(template, /TSV Gemini xác minh lần 2/);
  assert.match(template, /So khớp TSV lần 2/);
  assert.match(template, /Hai lần Gemini không khớp — chưa được nhập/);
  assert.match(template, /Xác nhận Gemini lần 2 chạy trong chat mới/);
  assert.match(template, /\[disabled\]="busy\(\) \|\| !verificationMatched\(\) \|\| !independentRunConfirmed\(\)"/);
});

test('Gemini month import is paste-first and preserves unresolved source information for later correction', () => {
  const component = read('src/app/features/duty-stats/duty-tsv-import.component.ts');
  const template = read('src/app/features/duty-stats/duty-tsv-import.component.html');
  const parser = read('src/app/features/duty-stats/duty-tsv-import.ts');
  const persistence = read('src/app/features/duty-stats/duty-tsv-import.persistence.ts');
  const schedule = read('src/app/features/duty-stats/duty-stats.component.ts');
  const dashboard = read('src/app/features/duty-stats/duty-dashboard.component.html');

  assert.match(template, /Dán TSV Gemini trả về/);
  assert.doesNotMatch(template, /type="file"/);
  assert.doesNotMatch(template, /Tải mẫu TSV/);
  assert.match(template, /Cần xác minh/);
  assert.match(component, /readonly unresolvedAssignments = computed/);
  assert.match(component, /readonly verificationRows = computed/);

  assert.match(parser, /unresolvedAssignees/);
  assert.match(parser, /CHƯA RÕ/);
  assert.match(persistence, /sourceAssignees: row\.names\.join\(' \| '\)/);
  assert.match(persistence, /needsVerification:/);
  assert.match(schedule, /needsVerificationOnly/);
  assert.match(schedule, /addUnresolvedAssignee/);
  assert.match(dashboard, /Cần xác minh/);
});

test('phase 2 statistics table is sortable and exposes accessible sort state', () => {
  const component = read('src/app/features/duty-stats/duty-stats.component.ts');
  const template = read('src/app/features/duty-stats/duty-stats.component.html');

  assert.match(component, /readonly sortColumn = signal<DutyStatsSortColumn>\('total'\)/);
  assert.match(component, /readonly sortDirection = signal<SortDirection>\('desc'\)/);
  assert.match(component, /readonly sortedPersonStats = computed/);
  assert.match(component, /\[\.\.\.this\.personStats\(\)\]\.sort/);
  assert.match(component, /if \(!a\.lastDate\) return 1/);
  assert.match(component, /displayName\.localeCompare\(b\.displayName, 'vi'\)/);
  assert.match(component, /toggleSort\(column: DutyStatsSortColumn\)/);
  assert.match(component, /ariaSortFor\(column: DutyStatsSortColumn\)/);

  assert.match(template, /@for \(stat of sortedPersonStats\(\)/);
  assert.match(template, /\[attr\.aria-sort\]="ariaSortFor\('total'\)"/);
  assert.match(template, /\(click\)="toggleSort\('displayName'\)"/);
  assert.match(template, /fa-sort-up/);
  assert.match(template, /fa-sort-down/);
  assert.match(template, /fa-sort/);
});

test('phase 3 adds personal quick filter, print, calendar grid, fatigue warning and month skeleton tools', () => {
  const component = read('src/app/features/duty-stats/duty-stats.component.ts');
  const template = read('src/app/features/duty-stats/duty-stats.component.html');
  const service = read('src/app/features/duty-stats/duty-schedule.service.ts');
  const rules = read('firestore.rules');

  assert.match(component, /readonly myShiftsOnly = signal\(false\)/);
  assert.match(component, /toggleMyShifts\(\)/);
  assert.match(template, /Chỉ ca của tôi/);

  assert.match(component, /handlePrintShortcut\(event: KeyboardEvent\)/);
  assert.match(component, /printSchedule\(\)/);
  assert.match(component, /@page \{ size: A4 landscape/);
  assert.match(template, /In lịch trực/);

  assert.match(component, /readonly scheduleLayout = signal<DutyScheduleLayout>\('calendar'\)/);
  assert.match(component, /this\.scheduleLayout\.set\(this\.selectedMonth\(\) === null \? 'list' : 'calendar'\)/);
  assert.match(component, /dutyMonthCalendarDateKeys/);
  assert.match(template, /Lưới lịch/);
  assert.match(template, /grid-cols-7/);
  assert.match(template, /@for \(name of namesFor\(cell\.schedule\); track \$index\)/);
  assert.doesNotMatch(template, /\+\{\{ namesFor\(cell\.schedule\)\.length - 1 \}\} phối hợp/);

  assert.match(component, /dutyAdjacentAssignment/);
  assert.match(component, /conflictWarningForStaff\(staffId: string\)/);
  assert.match(component, /2 ca liền kề/);
  assert.match(template, /cảnh báo mềm/);

  assert.match(component, /openBatchMonth\(\)/);
  assert.match(service, /createMonthSkeleton\(/);
  assert.match(service, /staffIds: \[\]/);
  assert.match(service, /source: 'batch'/);
  assert.match(template, /Tạo khung tháng/);
  assert.match(template, /Tất cả ngày trống/);
  assert.match(rules, /data\.staffIds\.size\(\) > 0 \|\| data\.get\('unresolvedAssignees', \[\]\)\.size\(\) > 0 \|\| data\.source == 'batch'/);
  assert.match(rules, /\['manual', 'import', 'batch'\]/);
});
