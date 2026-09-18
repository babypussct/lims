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

test('duty staffing does not expose or depend on employee codes', () => {
  const model = read('src/app/features/duty-stats/duty-schedule.model.ts');
  const utils = read('src/app/features/duty-stats/duty-schedule.utils.ts');
  const service = read('src/app/features/duty-stats/duty-schedule.service.ts');
  const component = read('src/app/features/duty-stats/duty-stats.component.ts');
  const template = read('src/app/features/duty-stats/duty-stats.component.html');
  const dashboard = read('src/app/features/duty-stats/duty-dashboard.component.html');

  for (const source of [model, utils, service, component, template, dashboard]) {
    assert.doesNotMatch(source, /employeeCode|normalizeDutyStaffCode|Chưa khai báo mã nhân viên|Mã NV:|Mã nhân viên/);
  }
});

test('duty schedule includes fast assignment and period navigation controls', () => {
  const component = read('src/app/features/duty-stats/duty-stats.component.ts');
  const template = read('src/app/features/duty-stats/duty-stats.component.html');
  const assignmentTemplate = read('src/app/features/duty-stats/duty-assignment-modal.component.html');

  assert.match(component, /scheduleStaffSearch/);
  assert.match(component, /normalize\('NFD'\)/);
  assert.match(component, /prevPeriod\(\)/);
  assert.match(component, /nextPeriod\(\)/);
  assert.match(component, /goToCurrentMonth\(\)/);
  assert.match(assignmentTemplate, /Tìm nhanh nhân viên/);
  assert.match(template, /Đang tải lịch trực/);
  assert.match(template, /Tháng này/);
  assert.match(assignmentTemplate, /addStaff\(person\.id\)/);
  assert.match(template, /Đã gán cho/);
  assert.match(assignmentTemplate, /Cần chọn ít nhất 1 nhân viên hoặc thêm vị trí chưa xác định/);
  assert.match(assignmentTemplate, /Vị trí chưa xác định/);
  assert.match(assignmentTemplate, /Cần xác minh/);
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
  assert.match(component, /this\.state\.ensureUserInfoCacheListener\(\)/);
  assert.match(component, /getUserAvatarOptionsByUid\(linkedUserUid, displayName\)/);
  assert.match(component, /getAvatarUrl\(options\.displayName \|\| displayName, options\.style, options\.photoURL\)/);

  assert.match(template, /Lịch tháng/);
  assert.match(component, /readonly calendarWeekdays = \['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'\]/);
  assert.match(template, /grid-cols-7/);
  assert.match(template, /@for \(cell of calendarCells\(\); track \$index\)/);
  assert.match(template, /Thống kê theo người/);
  assert.match(template, /Tóm tắt vận hành lịch trực/);
  assert.match(template, /ca tháng/);
  assert.match(template, /lượt trực/);
  assert.match(template, /Mở lịch trực/);
  assert.match(template, /Xem thống kê đầy đủ/);
  assert.match(template, /@for \(stat of personStats\(\); track stat\.staffId/);
  assert.match(template, /avatarFor\(stat\.displayName, stat\.linkedUserUid\)/);
  assert.match(component, /assignmentDeviationBadgeClass\(total: number\)/);
  assert.doesNotMatch(template, /initialsFor\(stat\.displayName\)/);
  assert.doesNotMatch(template, /Chưa khai báo mã nhân viên|Mã NV:|Mã nhân viên/);
  assert.doesNotMatch(template, /startTime|18:00/);
  assert.match(template, /grid items-stretch gap-4/);
  assert.match(template, /2xl:h-\[460px\]/);
  assert.match(template, /max-h-\[300px\]/);
  assert.match(template, /xl:max-h-none/);
  assert.match(template, /so bình quân/);
  assert.doesNotMatch(template, /Ca sắp tới/);
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
  assert.doesNotMatch(template, /Chưa khai báo mã nhân viên|Mã NV:|Mã nhân viên/);
});

test('M4 statistics chart stacks weekday and weekend counts while keeping lead count separate', () => {
  const model = read('src/app/features/duty-stats/duty-schedule.model.ts');
  const utils = read('src/app/features/duty-stats/duty-schedule.utils.ts');
  const chart = read('src/app/features/duty-stats/duty-stats-chart.component.ts');
  const chartTemplate = read('src/app/features/duty-stats/duty-stats-chart.component.html');
  const template = read('src/app/features/duty-stats/duty-stats.component.html');

  assert.match(model, /weekdayCount: number/);
  assert.match(utils, /else current\.weekdayCount \+= 1/);
  assert.match(chart, /import\('chart\.js\/auto'\)/);
  assert.match(chart, /data: stats\.map\(item => item\.weekdayCount\)/);
  assert.match(chart, /data: stats\.map\(item => item\.weekendCount\)/);
  assert.match(chart, /borderDash: \[6, 5\]/);
  assert.match(chart, /★ Chủ trì/);
  assert.match(chartTemplate, /Ngày thường \+ cuối tuần = tổng lượt/);
  assert.match(template, /<app-duty-stats-chart/);
});

test('M5 schedule image export uses a dedicated offscreen template with clipboard fallback', () => {
  const component = read('src/app/features/duty-stats/duty-schedule-image-export.component.ts');
  const template = read('src/app/features/duty-stats/duty-schedule-image-export.component.html');
  const dutyTemplate = read('src/app/features/duty-stats/duty-stats.component.html');

  assert.match(component, /import\('html2canvas'\)/);
  assert.match(component, /new ClipboardItem\(\{ 'image\/png': blob \}\)/);
  assert.match(component, /this\.downloadBlob\(blob\)/);
  assert.match(template, /position: fixed; left: -100000px/);
  assert.match(template, /LỊCH TRỰC ĐÊM PHÒNG KIỂM NGHIỆM/);
  assert.match(template, /★ Người đầu tiên là người chủ trì/);
  assert.match(template, /Sao chép ảnh/);
  assert.match(template, /Tải PNG/);
  assert.match(dutyTemplate, /<app-duty-schedule-image-export/);
});

test('M6 shift swap backend keeps snapshot concurrency, exact-index replacement, expiry and server-resolved notifications', () => {
  const model = read('src/app/features/duty-stats/duty-shift-swap.model.ts');
  const service = read('src/app/features/duty-stats/duty-shift-swap.service.ts');
  const utils = read('src/app/features/duty-stats/duty-shift-swap.utils.ts');
  const rules = read('firestore.rules');
  const notifications = read('api/notifications.ts');

  assert.match(model, /type DutySwapRequestType = 'SWAP' \| 'COVER'/);
  assert.match(model, /'PENDING_TARGET'/);
  assert.match(model, /'PENDING_MANAGER'/);
  assert.match(model, /unresolvedAssignees: string\[\]/);
  assert.match(model, /needsVerification: boolean/);
  assert.match(service, /dutyShiftSnapshotMatches\(current\.sourceSnapshot, sourceSchedule\)/);
  assert.match(service, /replaceDutyStaffAtExactIndex/);
  assert.match(service, /Timestamp\.fromMillis\(nowMs \+ DUTY_SWAP_TTL_MS\)/);
  assert.match(service, /transaction\.set\(auditRef/);
  assert.match(utils, /next\[index\] = incomingStaffId/);
  assert.match(rules, /function validDutySwapUpdate\(appId\)/);
  assert.match(rules, /request\.time >= resource\.data\.expiresAt/);
  assert.match(rules, /match \/artifacts\/\{appId\}\/duty_swap_requests\/\{requestId\}/);
  assert.match(notifications, /action === 'dutySwap'/);
  assert.match(notifications, /duty_staff\/\$\{targetStaffId\}/);
  assert.match(notifications, /const expectedStatus = swapEvent === 'MANAGER_APPROVED' \? 'APPROVED' : 'REJECTED_MANAGER'/);
  assert.match(notifications, /status !== expectedStatus/);
});

test('M7 shift swap UI exposes requester, target, manager and dashboard workflows without bloating duty stats', () => {
  const requestComponent = read('src/app/features/duty-stats/duty-shift-swap-request.component.ts');
  const requestTemplate = read('src/app/features/duty-stats/duty-shift-swap-request.component.html');
  const panel = read('src/app/features/duty-stats/duty-shift-swap-panel.component.html');
  const week = read('src/app/features/duty-stats/duty-week-view.component.html');
  const dutyTemplate = read('src/app/features/duty-stats/duty-stats.component.html');
  const dashboard = read('src/app/features/duty-stats/duty-dashboard.component.html');

  assert.match(requestComponent, /this\.swap\.createRequest/);
  assert.match(requestTemplate, /Đổi ca 2 chiều/);
  assert.match(requestTemplate, /Nhờ trực hộ/);
  assert.match(panel, /Đồng ý/);
  assert.match(panel, /Duyệt & cập nhật lịch/);
  assert.match(panel, /Đổi trực tiếp/);
  assert.match(week, /Xin đổi ca/);
  assert.match(dutyTemplate, /<app-duty-shift-swap-panel/);
  assert.match(dutyTemplate, /<app-duty-shift-swap-request/);
  assert.match(dashboard, /pendingSwapCount\(\)/);
});

test('Gemini import prompt exposes a prominent copy action beside the prompt', () => {
  const component = read('src/app/features/duty-stats/duty-tsv-import.component.ts');
  const template = read('src/app/features/duty-stats/duty-tsv-import.component.html');

  assert.match(component, /readonly promptCopied = signal\(false\)/);
  assert.match(component, /navigator\.clipboard\.writeText\(this\.prompt\(\)\)/);
  assert.match(component, /this\.promptCopied\.set\(true\)/);
  assert.match(template, /Xem nội dung prompt/);
  assert.match(template, /Sao chép nội dung/);
  assert.match(template, /Đã sao chép/);
  assert.match(template, /fa-copy/);
});

test('Gemini month import uses a three-step recognition, diff and verification wizard', () => {
  const component = read('src/app/features/duty-stats/duty-tsv-import.component.ts');
  const template = read('src/app/features/duty-stats/duty-tsv-import.component.html');

  assert.match(component, /readonly step = signal<1 \| 2 \| 3>\(1\)/);
  assert.match(component, /this\.step\.set\(2\)/);
  assert.match(component, /continueToVerification\(\): void/);
  assert.match(component, /this\.step\.set\(3\)/);
  assert.match(template, /Bước 1 — Nhận diện ảnh lịch/);
  assert.match(template, /Bước 2 — Kiểm tra thay đổi trước khi nhập/);
  assert.match(template, /Bước 3 — Xác minh độc lập & nhập vào LIMS/);
  assert.match(template, /Tạo mới/);
  assert.match(template, /Thay thế/);
  assert.match(template, /Giữ nguyên/);
  assert.match(template, /Vị trí \?/);
  assert.match(template, /Trước/);
  assert.match(template, /Sau/);
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
  assert.match(template, /Bước 3 — Xác minh độc lập & nhập vào LIMS/);
  assert.match(template, /Bắt buộc dùng một cuộc trò chuyện Gemini mới/);
  assert.match(template, /Sao chép nội dung xác minh/);
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
  const assignment = read('src/app/features/duty-stats/duty-assignment-modal.component.ts');
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
  assert.match(assignment, /addUnresolvedAssignee/);
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
  const assignment = read('src/app/features/duty-stats/duty-assignment-modal.component.ts');
  const assignmentTemplate = read('src/app/features/duty-stats/duty-assignment-modal.component.html');
  const service = read('src/app/features/duty-stats/duty-schedule.service.ts');
  const rules = read('firestore.rules');

  assert.match(component, /readonly myShiftsOnly = signal\(false\)/);
  assert.match(component, /toggleMyShifts\(\)/);
  assert.match(template, /Chỉ ca của tôi/);

  assert.match(component, /handlePrintShortcut\(event: KeyboardEvent\)/);
  assert.match(component, /printSchedule\(\)/);
  assert.match(component, /@page \{ size: A4 landscape/);
  assert.match(template, /In lịch trực/);

  assert.match(component, /readonly scheduleLayout = signal<DutyScheduleLayout>\([\s\S]*window\.innerWidth < 768 \? 'list' : 'calendar'/);
  assert.match(component, /this\.scheduleLayout\.set\(this\.selectedMonth\(\) === null \|\| this\.isMobileViewport\(\) \? 'list' : 'calendar'\)/);
  assert.match(component, /dutyMonthCalendarDateKeys/);
  assert.match(template, /Lưới lịch/);
  assert.match(template, /grid-cols-7/);
  assert.match(template, /@for \(name of namesFor\(cell\.schedule\); track \$index\)/);
  assert.doesNotMatch(template, /\+\{\{ namesFor\(cell\.schedule\)\.length - 1 \}\} phối hợp/);

  assert.match(assignment, /dutyAdjacentAssignment/);
  assert.match(assignment, /conflictWarningForStaff\(staffId: string\)/);
  assert.match(assignment, /2 ca liền kề/);
  assert.match(assignmentTemplate, /cảnh báo mềm/);

  assert.match(component, /openBatchMonth\(\)/);
  assert.match(service, /createMonthSkeleton\(/);
  assert.match(service, /staffIds: \[\]/);
  assert.match(service, /source: 'batch'/);
  assert.match(template, /Tạo khung tháng/);
  assert.match(template, /Tất cả ngày trống/);
  assert.match(rules, /data\.staffIds\.size\(\) > 0 \|\| data\.get\('unresolvedAssignees', \[\]\)\.size\(\) > 0 \|\| data\.source == 'batch'/);
  assert.match(rules, /\['manual', 'import', 'batch'\]/);
});

test('mobile-first duty roster adds compact calendar, bottom sheets, staff distribution cards and simplified dashboard', () => {
  const component = read('src/app/features/duty-stats/duty-stats.component.ts');
  const template = read('src/app/features/duty-stats/duty-stats.component.html');
  const dashboardComponent = read('src/app/features/duty-stats/duty-dashboard.component.ts');
  const dashboardTemplate = read('src/app/features/duty-stats/duty-dashboard.component.html');

  assert.match(component, /readonly mobileMenuOpen = signal\(false\)/);
  assert.match(component, /readonly selectedDayCell = signal<DutyCalendarCell \| null>\(null\)/);
  assert.match(component, /readonly mobilePeriodMode = signal<DutyMobilePeriodMode>\('month'\)/);
  assert.match(component, /distributionPercent\(total: number\): number/);
  assert.match(component, /openMobileDay\(cell: DutyCalendarCell\)/);
  assert.match(template, /aria-label="Lịch tháng dạng thu gọn"/);
  assert.match(template, /•/);
  assert.match(template, /Chi tiết ngày trực/);
  assert.match(template, /Công cụ lịch trực trên mobile/);
  assert.match(template, /Phạm vi thống kê mobile/);
  assert.match(template, /Thống kê nhân viên dạng thẻ/);
  assert.match(template, />Ít<\/span><span>Nhiều</);
  assert.match(template, /sticky top-0 z-20/);
  assert.match(template, /hidden min-h-0 flex-1 overflow-hidden p-2 md:flex md:flex-col/);
  assert.match(template, /hidden h-full min-h-0 overflow-auto custom-scrollbar md:block/);

  assert.match(dashboardComponent, /readonly nextSevenDaysSchedules = computed/);
  assert.match(dashboardComponent, /shiftDutyDateKey\(this\.todayKey, 6\)/);
  assert.match(dashboardTemplate, /Ca của bạn sắp tới/);
  assert.match(dashboardTemplate, /Trực hôm nay/);
  assert.match(dashboardTemplate, /7 ngày tới/);
  assert.match(dashboardTemplate, /Xem toàn bộ lịch tháng/);
  assert.match(dashboardTemplate, /class="space-y-3 p-3 md:hidden"/);
  assert.match(dashboardTemplate, /class="hidden space-y-4 p-4 md:block"/);
});

test('fit-to-screen month calendars use compact cells and a non-flow shift-swap drawer', () => {
  const component = read('src/app/features/duty-stats/duty-stats.component.ts');
  const template = read('src/app/features/duty-stats/duty-stats.component.html');
  const dashboardComponent = read('src/app/features/duty-stats/duty-dashboard.component.ts');
  const dashboardTemplate = read('src/app/features/duty-stats/duty-dashboard.component.html');

  assert.match(component, /readonly swapDrawerOpen = signal\(false\)/);
  assert.match(component, /readonly calendarWeekCount = computed/);
  assert.match(component, /readonly pendingSwapCount = computed/);
  assert.match(component, /openSwapDrawer\(\): void/);
  assert.match(component, /toggleVerificationFilter\(\): void/);
  assert.match(template, /aria-label="Tóm tắt lịch trực"/);
  assert.match(template, /Cần xác minh/);
  assert.match(template, /Có \{\{ pendingSwapCount\(\) \}\} yêu cầu đổi ca cần xử lý/);
  assert.match(template, /role="dialog"/);
  assert.match(template, /<app-duty-shift-swap-panel><\/app-duty-shift-swap-panel>/);
  assert.match(template, /grid-template-rows/);
  assert.match(template, /minmax\(54px, 1fr\)/);
  assert.match(template, /calendarCellLabel\(cell\)/);
  assert.match(template, /calendarAdditionalPeopleCount\(cell\.schedule\)/);
  assert.match(template, /border-dashed/);
  assert.match(template, /group-focus-visible:opacity-100/);

  assert.match(dashboardComponent, /readonly calendarWeekCount = computed/);
  assert.match(dashboardComponent, /calendarVisibleNames\(schedule: DutyScheduleEntry\)/);
  assert.match(dashboardTemplate, /grid-template-rows/);
  assert.match(dashboardTemplate, /calendarVisibleNames\(schedule\)/);
  assert.match(dashboardTemplate, /calendarAdditionalPeopleCount\(schedule\)/);
  assert.doesNotMatch(dashboardTemplate, /min-h-20|overflow-auto p-3 custom-scrollbar/);
});

test('phase 1 fairness adds weekend and lead statistics plus rolling recommendation cues', () => {
  const model = read('src/app/features/duty-stats/duty-schedule.model.ts');
  const utils = read('src/app/features/duty-stats/duty-schedule.utils.ts');
  const service = read('src/app/features/duty-stats/duty-schedule.service.ts');
  const component = read('src/app/features/duty-stats/duty-stats.component.ts');
  const template = read('src/app/features/duty-stats/duty-stats.component.html');
  const assignment = read('src/app/features/duty-stats/duty-assignment-modal.component.ts');
  const dashboardTemplate = read('src/app/features/duty-stats/duty-dashboard.component.html');

  assert.match(model, /weekendCount: number/);
  assert.match(model, /leadCount: number/);
  assert.match(model, /DutyRecommendationTier/);
  assert.match(utils, /dutyRolling90Range/);
  assert.match(utils, /computeDutyStaffRecommendations/);
  assert.match(service, /loadScheduleRange\(start: string, end: string\)/);
  assert.match(component, /readonly rollingSchedules = signal<DutyScheduleEntry\[]>\(\[]\)/);
  assert.match(component, /readonly staffRecommendations = computed/);
  assert.match(assignment, /return 'Nên xếp'/);
  assert.match(assignment, /return 'Cân bằng'/);
  assert.match(assignment, /return 'Cân nhắc'/);
  assert.match(assignment, /return 'Đang nhiều'/);
  assert.match(template, /toggleSort\('weekendCount'\)/);
  assert.match(template, /toggleSort\('leadCount'\)/);
  assert.match(template, /Cuối tuần/);
  assert.match(template, /★ Chủ trì/);
  assert.doesNotMatch(dashboardTemplate, /Cuối tuần:/);
  assert.doesNotMatch(dashboardTemplate, /★ Chủ trì:/);
});

test('M1 week view keeps an independent anchor, seven-day component and week range listener', () => {
  const component = read('src/app/features/duty-stats/duty-stats.component.ts');
  const template = read('src/app/features/duty-stats/duty-stats.component.html');
  const weekComponent = read('src/app/features/duty-stats/duty-week-view.component.ts');
  const weekTemplate = read('src/app/features/duty-stats/duty-week-view.component.html');
  const utils = read('src/app/features/duty-stats/duty-schedule.utils.ts');

  assert.match(utils, /export function dutyIsoWeekDays\(anchorDate: string\)/);
  assert.match(utils, /export function dutyIsoWeekInfo\(anchorDate: string\)/);
  assert.match(component, /type DutyScheduleLayout = 'list' \| 'calendar' \| 'week'/);
  assert.match(component, /readonly weekAnchorDate = signal\(currentDutyDateKey\(\)\)/);
  assert.match(component, /readonly weekInfo = computed\(\(\) => dutyIsoWeekInfo\(this\.weekAnchorDate\(\)\)\)/);
  assert.match(component, /this\.weekAnchorDate\.update\(date => shiftDutyDateKey\(date, -7\)\)/);
  assert.match(component, /this\.weekAnchorDate\.update\(date => shiftDutyDateKey\(date, 7\)\)/);
  assert.match(component, /this\.duty\.watchRange\(week\.start, week\.end\)/);
  assert.match(template, /setScheduleLayout\('week'\)/);
  assert.match(template, /<app-duty-week-view/);
  assert.match(template, /\[dates\]="weekInfo\(\)\.dates"/);
  assert.match(weekComponent, /selector: 'app-duty-week-view'/);
  assert.match(weekTemplate, /hidden min-w-\[1050px\] grid-cols-7 gap-2 lg:grid/);
  assert.match(weekTemplate, /space-y-3 lg:hidden/);
  assert.match(weekTemplate, /Hôm nay/);
  assert.match(weekTemplate, /★ Trưởng ca/);
});

test('duty action buttons follow soft-ui hierarchy, row icons, touch targets and action cards', () => {
  const template = read('src/app/features/duty-stats/duty-stats.component.html');
  const assignmentTemplate = read('src/app/features/duty-stats/duty-assignment-modal.component.html');

  // Navigation chevrons
  assert.match(template, /fa-chevron-left/);
  assert.match(template, /fa-chevron-right/);

  // Soft-UI Segmented Control preserving sticky top-0 z-20
  assert.match(template, /sticky top-0 z-20/);
  assert.match(template, /border border-slate-200\/80 bg-white text-blue-600/);

  // Desktop Row action icons
  assert.match(template, /fa-pen-to-square[\s\S]*?Sửa/);
  assert.match(template, /fa-ban[\s\S]*?Hủy ca/);
  assert.match(template, /fa-user-slash/);
  assert.match(template, /fa-user-check/);
  assert.match(template, /Ngừng dùng/);
  assert.match(template, /Kích hoạt/);

  // Mobile touch target h-10 on cards and drawer
  assert.match(template, /inline-flex h-10 items-center justify-center gap-1\.5 rounded-xl border border-blue-200/);
  assert.match(template, /inline-flex h-10 items-center justify-center gap-1\.5 rounded-xl border border-rose-200/);

  // Mobile Action Sheet Cards with icons & subtitles
  assert.match(template, /Xem bản in hoặc xuất PDF/);
  assert.match(template, /Tải tệp bảng tính ca trực/);
  assert.match(template, /Dán kết quả Gemini từ ảnh/);
  assert.match(template, /Khởi tạo ngày trực chưa xếp/);

  // Schedule modal lead promotion and unresolved position button
  assert.match(assignmentTemplate, /Đặt làm Trưởng ca/);
  assert.match(assignmentTemplate, /border-dashed border-amber-300 bg-amber-50\/80/);
});

test('M2 assignment modal uses 40/60 layout, one-click cards and preserves staffIds[0] lead semantics', () => {
  const component = read('src/app/features/duty-stats/duty-assignment-modal.component.ts');
  const template = read('src/app/features/duty-stats/duty-assignment-modal.component.html');
  const parent = read('src/app/features/duty-stats/duty-stats.component.html');

  assert.match(parent, /<app-duty-assignment-modal/);
  assert.match(template, /size="xl"/);
  assert.match(template, /lg:grid-cols-\[minmax\(0,2fr\)_minmax\(0,3fr\)\]/);
  assert.doesNotMatch(template, /\[checked\]="isStaffSelected/);
  assert.match(template, /\(click\)="addStaff\(person\.id\)"/);
  assert.match(template, /✓ Đã thêm/);
  assert.match(template, /★ Trưởng ca · Người chủ trì/);
  assert.match(component, /current\.unshift\(staffId\)/);
  assert.match(component, /recommended[\s\S]*balanced[\s\S]*consider[\s\S]*high/);
  assert.match(template, /cảnh báo ca liền kề hiển thị riêng/);
  assert.match(template, /dateWithWeekday\(draft\.date\)/);
});
