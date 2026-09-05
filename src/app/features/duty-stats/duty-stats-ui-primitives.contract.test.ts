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
  assert.match(template, /Cần chọn ít nhất 1 nhân viên trực/);
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
  assert.match(rules, /data\.staffIds\.size\(\) > 0 \|\| data\.source == 'batch'/);
  assert.match(rules, /\['manual', 'import', 'batch'\]/);
});
