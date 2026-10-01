import '@angular/compiler';
import { Injector, runInInjectionContext, signal } from '@angular/core';
import { DOCUMENT, Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { Subject } from 'rxjs';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { FormBuilder, Validators } from '@angular/forms';
import { ReferenceStandard, UsageLog } from '../../core/models/standard.model';
import {
  canAssignDetailStandard, canPurchaseDetailStandard, detailStandardStatus, parseStandardAmount,
  standardAmountText, standardDataIssues, standardDateState, standardDateText, standardStockPercentage, standardText, standardTextList,
} from './standard-detail.utils';

function read(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
}

interface ShareNavigator {
  share?: Navigator['share'];
  canShare?: Navigator['canShare'];
  clipboard?: Pick<Clipboard, 'writeText'>;
}

async function createDetailHarness(permissions: string[] = [], audit = false, browserNavigator: ShareNavigator = {}) {
  const [detail, standards, auth, firebase, state, toast, confirmation, print, drive, tags] = await Promise.all([
    import('./standard-detail.component'), import('./standard.service'),
    import('../../core/services/auth.service'), import('../../core/services/firebase.service'),
    import('../../core/services/state.service'), import('../../core/services/toast.service'),
    import('../../core/services/confirmation.service'), import('../../core/services/print.service'),
    import('../../core/services/google-drive.service'), import('./services/standard-tag-catalog.service'),
  ]);
  const auditMode = signal(audit);
  const user = signal({ uid: 'reviewer', displayName: 'Kiểm nghiệm viên', permissions });
  const hasPermission = (key: string) => user().permissions.includes(key);
  const params = new Subject<ReturnType<typeof convertToParamMap>>();
  const navigation: unknown[] = [];
  const confirmations: unknown[] = [];
  const historyCalls: unknown[][] = [];
  const toastMessages: [string, string | undefined][] = [];
  const usersInfo = signal(new Map<string, { displayName: string }>());
  let historyPage = { items: [] as UsageLog[], lastDoc: null, hasMore: false };
  let earliestLog: UsageLog | null = null;
  const earliestCalls: string[] = [];
  let driveCalls = 0;
  const std = {
    id: 'standard-a', name: 'Chuẩn thử nghiệm', current_amount: 5, initial_amount: 10, unit: 'mg',
    status: 'AVAILABLE' as const, internal_id: 'AA01', expiry_date: '2099-12-31', date_opened: '2026-09-01',
  };
  const injector = Injector.create({ providers: [
    { provide: ActivatedRoute, useValue: { paramMap: params } },
    { provide: Router, useValue: { navigate: (path: unknown) => navigation.push(path) } },
    { provide: Location, useValue: {} },
    { provide: DomSanitizer, useValue: {} },
    { provide: DOCUMENT, useValue: { defaultView: { location: { origin: 'https://lims.example' }, navigator: browserNavigator } } },
    { provide: standards.StandardService, useValue: {
      getStandardById: async (id: string) => ({ ...std, id }), getAllStandardsFromCache: () => [],
      listenToStandards: () => () => {},
      getUsageHistoryPage: async (...args: unknown[]) => {
        historyCalls.push(args);
        return historyPage;
      },
      getEarliestUsageLog: async (id: string) => { earliestCalls.push(id); return earliestLog; },
    } },
    { provide: auth.AuthService, useValue: {
      currentUser: user, isStandardAuditMode: auditMode, hasPermission,
      canEditStandards: () => hasPermission('standard_edit'),
      canAssignStandards: () => hasPermission('standard_edit') || hasPermission('standard_approve'),
      canDeleteStandardLogs: () => hasPermission('standard_delete'),
    } },
    { provide: firebase.FirebaseService, useValue: { getAllUsers: async () => [] } },
    { provide: state.StateService, useValue: {
      ensureUserInfoCacheListener() {}, usersInfoByUidCache: usersInfo,
      getUserAvatarOptions: () => ({}),
    } },
    { provide: toast.ToastService, useValue: { show: (message: string, type?: string) => toastMessages.push([message, type]) } },
    { provide: confirmation.ConfirmationService, useValue: { confirm: async (data: unknown) => { confirmations.push(data); return false; } } },
    { provide: print.PrintService, useValue: {} },
    { provide: drive.GoogleDriveService, useValue: { authenticateSync: () => { driveCalls++; } } },
    { provide: tags.StandardTagCatalogService, useFactory: () => {
      assert.equal(auditMode(), false, 'Audit detail must not initialize the method catalog');
      return {};
    } },
  ] });
  const component = runInInjectionContext(injector, () => new detail.StandardDetailComponent());
  component.standard.set(std);
  component.standardId.set(std.id);
  component.isLoading.set(false);
  return {
    component, std, params, auditMode, user, usersInfo, navigation, confirmations, historyCalls, earliestCalls, toastMessages,
    driveCalls: () => driveCalls,
    setHistory: (items: UsageLog[], hasMore = false, earliest: UsageLog | null = null) => {
      historyPage = { items, lastDoc: null, hasMore };
      earliestLog = earliest;
    },
  };
}

describe('standard detail with incomplete records', () => {
  const std = {
    id: 'sparse-standard', name: 'Chuẩn thử nghiệm', internal_id: 'AA01', lot_number: 'LOT-01',
    current_amount: 5, initial_amount: 10, unit: 'mg', expiry_date: '2099-12-31',
    status: 'AVAILABLE', storage_condition: 'CT', location: 'Tủ B',
  } as ReferenceStandard;
  const withField = (field: string, value: unknown) => ({ ...std, [field]: value }) as ReferenceStandard;

  it('distinguishes absent amounts from zero and refuses to invent depletion or a purchase action', () => {
    for (const value of [undefined, null, '', '   ']) {
      const record = withField('current_amount', value);
      assert.equal(parseStandardAmount(value), null);
      assert.equal(standardAmountText(value), 'Chưa ghi nhận');
      assert.equal(detailStandardStatus(record).label, 'Chưa rõ lượng');
      assert.equal(canAssignDetailStandard(record), false);
      assert.equal(canPurchaseDetailStandard(record), false);
      assert.equal(standardStockPercentage(record), null);
    }
    for (const value of [0, '0', ' 0 ']) {
      const record = withField('current_amount', value);
      assert.equal(standardAmountText(value), '0.00');
      assert.equal(detailStandardStatus(record).label, 'Sử dụng hết');
      assert.equal(canPurchaseDetailStandard(record), true);
      assert.equal(canAssignDetailStandard(record), false);
      assert.equal(standardStockPercentage(record), 0);
    }
    for (const value of [-1, 'abc', Infinity, NaN, true]) {
      const record = withField('current_amount', value);
      assert.equal(standardAmountText(value), 'Lượng không hợp lệ');
      assert.equal(detailStandardStatus(record).label, 'Lượng không hợp lệ');
      assert.equal(canAssignDetailStandard(record), false);
      assert.equal(canPurchaseDetailStandard(record), false);
    }
    assert.equal(canPurchaseDetailStandard({ ...std, status: 'DEPLETED', current_amount: undefined! }), true);
    assert.equal(detailStandardStatus({ ...std, status: 'IN_USE', current_amount: undefined! }).label, 'Đang dùng');
    assert.equal(detailStandardStatus({ ...std, has_pending_request: true, current_amount: -1 }).label, 'Chờ duyệt');
  });

  it('hides an unknowable percentage and requires a known unit for borrowing', () => {
    for (const value of [undefined, null, '', ' ', 0, -1, 'abc']) {
      assert.equal(standardStockPercentage(withField('initial_amount', value)), null);
    }
    assert.equal(standardStockPercentage({ ...std, current_amount: 11 }), null);
    assert.equal(standardStockPercentage(std), 50);
    assert.equal(standardStockPercentage({ ...std, initial_amount: '10' as unknown as number }), 50);
    for (const value of [undefined, null, '', '  ']) {
      assert.equal(canAssignDetailStandard(withField('unit', value)), false);
      assert.equal(detailStandardStatus(withField('unit', value)).label, 'Chưa rõ đơn vị');
    }
    assert.equal(canAssignDetailStandard(withField('expiry_date', ' ')), true, 'Preserve the existing unknown-expiry policy');
    assert.equal(canAssignDetailStandard(withField('expiry_date', 'invalid-date')), false);
  });

  it('formats missing, malformed and valid dates without DatePipe exceptions', () => {
    for (const value of [undefined, null, '', '  ']) {
      assert.equal(standardDateState(value).kind, 'missing');
      assert.equal(standardDateText(value), 'Chưa ghi nhận');
    }
    for (const value of ['invalid-date', '2026-02-30', '2026-13-01', 0, true, {}]) {
      assert.equal(standardDateState(value).kind, 'invalid');
      assert.match(standardDateText(value), /Ngày không hợp lệ/);
    }
    assert.equal(standardDateText(' 2026-10-01 '), '01/10/2026');
    assert.equal(standardText('  '), 'Chưa ghi nhận');
    assert.equal(standardText('  LOT-01  '), 'LOT-01');
    assert.equal(standardText(0), '0');
    assert.deepEqual(standardDataIssues(std), []);
    assert.ok(standardDataIssues(withField('received_date', 'bad-date')).includes('Ngày nhận không hợp lệ'));
  });

  it('guards borrowing and purchasing in handlers when amounts or the unit are missing', async () => {
    const { component } = await createDetailHarness(['standard_request']);
    for (const record of [withField('current_amount', null), withField('unit', ' ')]) {
      component.standard.set(record);
      await component.openAssignModal(false);
      component.openPurchaseModal();
      assert.equal(component.showAssignModal(), false);
      assert.equal(component.showPurchaseModal(), false);
    }
    component.standard.set({ ...std, current_amount: 0 });
    component.openPurchaseModal();
    assert.equal(component.showPurchaseModal(), true);
  });

  it('uses a safe name in QR/sharing and resolves the holder by UID without exposing a raw UID', async () => {
    const payloads: ShareData[] = [];
    const { component, usersInfo, auditMode } = await createDetailHarness([], false, {
      share: async data => { payloads.push(data!); },
    });
    component.standard.set({ ...std, name: ' ', internal_id: ' ', lot_number: ' ', current_holder_uid: 'holder-uid' });
    assert.equal(component.standardName(), 'Chưa ghi nhận tên chất chuẩn');
    await component.shareStandard();
    assert.equal(payloads[0].title, 'Chưa ghi nhận tên chất chuẩn (Chất chuẩn)');
    assert.equal(payloads[0].text, 'Chất chuẩn đối chiếu: Chưa ghi nhận tên chất chuẩn - Lô: Chưa ghi nhận');
    assert.equal(component.currentHolderName(), '');
    usersInfo.set(new Map([['holder-uid', { displayName: 'Nguyễn An' }]]));
    assert.equal(component.currentHolderName(), 'Nguyễn An');
    component.standard.set({ ...std, current_holder_uid: 'reviewer' });
    assert.equal(component.currentHolderName(), 'Kiểm nghiệm viên');
    component.standard.set({ ...std, current_holder_uid: 'unknown', current_holder: 'unknown' });
    assert.equal(component.currentHolderName(), '');
    auditMode.set(true);
    assert.deepEqual(component.dataIssues(), []);
    assert.equal(component.currentHolderName(), '');
  });

  it('labels opening dates inferred from history and uses the earliest server log for paginated history', async () => {
    const { component, setHistory, earliestCalls, params } = await createDetailHarness();
    const log = (id: string, date: string) => ({ id, date, amount_used: 1, user: 'Kiểm nghiệm viên' }) as UsageLog;
    component.standard.set({ ...std, date_opened: ' ' });
    component.standardId.set(std.id);
    assert.equal(component.effectiveOpenDate(), null);
    assert.equal(component.openedDateFromHistory(), false);
    setHistory([log('invalid', 'bad-date'), log('newest', '2026-09-20'), log('earlier', '2026-09-10')]);
    await component.loadHistory(std.id);
    assert.equal(component.effectiveOpenDate(), '2026-09-10');
    assert.equal(component.openedDateFromHistory(), true);
    assert.equal(component.standard()?.date_opened, ' ', 'Viewing history must not persist a guessed opening date');
    setHistory([log('newest', '2026-09-20')], true, log('oldest', '2026-08-01'));
    await component.loadHistory(std.id);
    assert.deepEqual(earliestCalls, [std.id]);
    assert.equal(component.effectiveOpenDate(), '2026-08-01');
    component.standard.set({ ...std, date_opened: 'bad-date' });
    assert.equal(component.standardDateText(component.effectiveOpenDate()), 'Ngày không hợp lệ — cần kiểm tra');
    assert.equal(component.openedDateFromHistory(), false);
    component.ngOnInit();
    params.next(convertToParamMap({ id: 'standard-b' }));
    assert.equal(component.historyOpenDate(), null);
    assert.deepEqual(component.usageLogs(), []);
    await Promise.resolve();
    component.ngOnDestroy();
  });

  it('excludes lots with unknown units from FEFO suggestions', async () => {
    const { component } = await createDetailHarness();
    component.standard.set(std);
    component.allStandardsCache.set([{ ...std, id: 'unknown-unit', unit: ' ', expiry_date: '2098-12-31' }]);
    assert.equal(component.fefoWarningSibling(), null);
    assert.equal(component.fefoPriorityStandard()?.id, std.id);
    component.standard.set({ ...std, unit: ' ' });
    assert.equal(component.fefoPriorityStandard(), null);
  });

  it('validates real form saves before writes and preserves confirmed zero amounts', async () => {
    const { StandardsFormModalComponent } = await import('./components/standards-form-modal.component');
    const writes: ReferenceStandard[] = [];
    const form = new FormBuilder().group({
      id: ['standard-a'], name: ['  Chuẩn thử nghiệm  ', Validators.required],
      internal_id: ['AA01', Validators.required], unit: ['mg', Validators.required],
      initial_amount: [10 as number | null, Validators.required], current_amount: [0 as number | null, Validators.required],
      expiry_date: ['2099-12-31'], received_date: [''], date_opened: [''], location: ['  Tủ B  '],
    });
    const host = Object.assign(Object.create(StandardsFormModalComponent.prototype), {
      form, isProcessing: signal(false), std: () => std, allStandards: () => [], standardSopTags: () => [],
      toast: { show() {} }, closeModal: { emit() {} },
      stdService: { updateStandard: async (value: ReferenceStandard) => writes.push(value) },
    }) as InstanceType<typeof StandardsFormModalComponent>;
    form.patchValue({ current_amount: null });
    await host.saveStandard();
    assert.deepEqual(writes, []);
    assert.ok(form.controls.current_amount.hasError('invalidAmount'));
    form.patchValue({ current_amount: 0, expiry_date: '2026-02-30' });
    await host.saveStandard();
    assert.deepEqual(writes, []);
    assert.ok(form.controls.expiry_date.hasError('invalidDate'));
    form.patchValue({ expiry_date: '2099-12-31', name: '   ' });
    await host.saveStandard();
    assert.deepEqual(writes, []);
    assert.ok(form.controls.name.hasError('required'));
    form.patchValue({ name: '  Chuẩn thử nghiệm  ' });
    await host.saveStandard();
    assert.equal(writes.length, 1);
    assert.equal(writes[0].current_amount, 0);
    assert.equal(writes[0].name, 'Chuẩn thử nghiệm');
    assert.equal(writes[0].location, 'Tủ B');
  });

  it('handles empty method arrays and whitespace CoA fields without phantom content or blocked requests', async () => {
    const { component, confirmations } = await createDetailHarness(['standard_request']);
    for (const value of [undefined, null, '', '  ', [], ['  ', null]]) {
      component.standard.set({ ...std, sop_tags: value, derivedDeviceCodes: value, derivedMethodLabels: value } as unknown as ReferenceStandard);
      assert.deepEqual(component.deviceCodes(), []);
      assert.deepEqual(component.methodLabels(), []);
      assert.deepEqual(standardTextList(value), []);
    }
    assert.deepEqual(standardTextList(['  GCMS  ', '', ' HPLC ']), ['GCMS', 'HPLC']);
    component.standard.set({ ...std, certificate_ref: ' ', coa_requested_by: ' ' });
    assert.equal(component.canRequestCoa(), true);
    await component.requestCoa(component.standard()!);
    assert.equal(confirmations.length, 1);
    component.standard.set({ ...std, id: ' STD-01 ' });
    assert.equal(component.standardShareUrl(), 'https://lims.example/#/standards/%20STD-01%20', 'Preserve the physical ID exactly as QR encoding does');
  });
});

describe('standards shared UI primitive integration', () => {
  it('keeps the Audit whitelist inside the existing list, grid and detail surfaces', () => {
    const list = read('./components/standards-list-view.component.ts');
    const grid = read('./components/standards-grid-view.component.ts');
    const filter = read('./components/standards-filter.component.ts');
    const detail = read('./standard-detail.component.ts');
    const detailTemplate = read('./standard-detail.component.html');
    const page = read('./standards.component.html');
    const component = read('./standards.component.ts');
    const routes = read('../../app.routes.ts');
    const catalog = read('../../core/auth/permission-catalog.ts');

    for (const surface of [list, grid, detailTemplate]) {
      assert.match(surface, /isAuditMode\(\)/);
      for (const field of [
        'name',
        'initial_amount',
        'unit',
        'product_code',
        'lot_number',
        'manufacturer',
        'cas_number',
        'expiry_date',
        'storage_condition',
        'internal_id',
      ]) {
        assert.match(surface, new RegExp(`std\\.${field}`));
      }
    }

    assert.match(list, /certificate_ref/);
    assert.match(grid, /certificate_ref/);
    assert.match(list, /openCoaPreview/);
    assert.match(grid, /openCoaPreview/);
    assert.match(detailTemplate, /certificate_ref/);
    assert.match(detailTemplate, /openCoaPreview/);
    assert.match(filter, /isAuditMode = input/);
    assert.match(filter, /@if \(!isAuditMode\(\)\)/);
    assert.match(list, /\[class\.hidden\]="isAuditMode\(\)"/);
    assert.match(list, /!isAuditMode\(\) && std\.chemical_name/);
    assert.match(grid, /@if \(!isAuditMode\(\)\)/);
    assert.match(detailTemplate, /@if \(!isAuditMode\(\)\)/);
    assert.match(component, /isAuditMode\(\)/);
    assert.match(component, /auditFilteredItems/);
    assert.match(page, /\[isAuditMode\]="isAuditMode\(\)"/);
    assert.doesNotMatch(page, /app-standards-audit-view/);
    assert.doesNotMatch(routes, /standards\/audit\/:id/);
    assert.match(routes, /path: 'standards\/:id'/);
    assert.match(routes, /permissionsAny: \[PERMISSIONS\.STANDARD_VIEW, PERMISSIONS\.STANDARD_AUDIT_VIEW\]/);
    assert.match(routes, /PERMISSIONS\.STANDARD_AUDIT_VIEW/);
    assert.match(catalog, /STANDARD_AUDIT_VIEW: 'standard_audit_view'/);
  });

  it('uses the shared page header and buttons while preserving the standards function-menu contract', () => {
    const toolbar = read('./components/standards-toolbar.component.ts');
    const filter = read('./components/standards-filter.component.ts');
    const grid = read('./components/standards-grid-view.component.ts');
    const page = read('./standards.component.html');
    const component = read('./standards.component.ts');

    assert.match(page, /<app-standards-toolbar\b/);
    assert.match(filter, /flex flex-col gap-2 lg:flex-row/);
    assert.match(filter, /relative min-w-0 flex-1 group/);
    assert.match(page, /Vuốt ngang để xem đầy đủ bảng chuẩn/);
    assert.match(component, /window\.matchMedia\('\(max-width: 767px\), \(hover: none\) and \(pointer: coarse\)'\)/);
    assert.match(component, /this\.mobileMediaQuery\.matches \? 'grid' : \(this\.stdService\.listState\.viewMode \|\| 'list'\)/);
    assert.match(toolbar, /AppButtonComponent/);
    assert.match(toolbar, /AppPageHeaderComponent/);
    assert.match(toolbar, /<app-page-header\b/);
    assert.match(toolbar, /pageHeaderActions/);
    assert.match(toolbar, /<app-button\b/);
    assert.match(toolbar, /title="Quản lý chất chuẩn đối chiếu"/);
    assert.match(toolbar, />\s*Chức năng\s*</);
    assert.match(toolbar, />\s*Thêm mới\s*</);
    assert.match(toolbar, /Đồng bộ mã nội bộ/);
    assert.match(toolbar, /Nhập danh mục chuẩn/);
    assert.match(toolbar, /Nhập nhật ký/);
    assert.match(toolbar, /Chuẩn hóa tên chất chuẩn/);
    assert.match(toolbar, /Từ thư mục/);
    assert.match(toolbar, /Chọn tệp/);
    assert.match(toolbar, /aria-haspopup="menu"/);
    assert.match(toolbar, /\[attr\.aria-expanded\]="functionMenuOpen\(\)"/);
    assert.match(toolbar, /class="h-10 px-3[^\"]*md:h-9"/);
    assert.match(toolbar, /class="min-h-10 text-left px-3 py-2[^\"]*md:min-h-0"/);
    assert.match(filter, /fixed inset-x-3 top-1\/2[^\"]*lg:absolute lg:left-0/);
    assert.match(toolbar, /closeMenuOnOutsideClick/);
    assert.match(toolbar, /closeMenuOnEscape/);
    assert.match(toolbar, /this\.functionMenuOpen\.set\(false\);\s*input\.click\(\);/);
    assert.match(grid, /w-10 h-10 rounded-lg[^\"]*sm:w-8 sm:h-8/);
    assert.match(grid, /w-auto px-3 h-10 rounded-lg[^\"]*sm:h-8/);

    // Spatial anchor and borderless page header contract
    assert.match(page, /class="[^"]*p-4 md:p-6[^"]*"/);
    assert.doesNotMatch(toolbar, /<app-page-header[^>]*border/);
    assert.doesNotMatch(toolbar, /<app-page-header[^>]*shadow/);
  });

  it('uses the shared page header, toolbar and buttons for standards requests with sentence-case migrated labels', () => {
    const actionModals = read('./requests/components/requests-action-modals.component.ts');
    const createRequestDrawer = read('./requests/components/create-request-drawer.component.ts');
    const kanban = read('./requests/components/requests-kanban.component.ts');
    const component = read('./requests/standard-requests.component.ts');
    const template = read('./requests/standard-requests.component.html');

    assert.match(actionModals, /AppButtonComponent/);
    assert.match(actionModals, /AppModalShellComponent/);
    assert.match(actionModals, /<app-modal-shell\b/);
    assert.doesNotMatch(actionModals, /requests-modal-layer/);
    assert.match(createRequestDrawer, /AppModalShellComponent/);
    assert.match(createRequestDrawer, /<app-modal-shell\b/);
    assert.match(createRequestDrawer, /title="Tạo yêu cầu chất chuẩn"/);
    assert.match(createRequestDrawer, /size="xl"/);
    assert.match(createRequestDrawer, /\[closeOnBackdrop\]="true"/);
    assert.match(createRequestDrawer, /modalFooter/);
    assert.doesNotMatch(createRequestDrawer, /requests-modal-layer|class="[^"]*fixed inset-0/);
    assert.match(component, /AppButtonComponent/);
    assert.match(component, /AppModalShellComponent/);
    assert.match(component, /AppPageHeaderComponent/);
    assert.match(component, /AppToolbarComponent/);
    assert.match(template, /<app-page-header\b/);
    assert.match(template, /pageHeaderActions/);
    assert.match(template, /<app-toolbar\b/);
    assert.match(template, /toolbarSearch/);
    assert.match(template, /toolbarActions/);
    assert.match(template, /<app-button\b/);
    assert.match(template, /<app-modal-shell\b/);
    assert.match(template, /title="Duyệt yêu cầu mua bổ sung chất chuẩn"/);
    assert.doesNotMatch(template, /requests-modal-layer/);
    assert.match(template, /title="Quản lý yêu cầu chất chuẩn"/);
    assert.match(template, /Yêu cầu mua sắm/);
    assert.match(template, /Tạo yêu cầu mới/);
    assert.match(template, />\s*Tất cả\s*</);
    assert.match(template, />\s*Chờ duyệt\s*</);
    assert.match(template, />\s*Đang dùng\s*</);
    assert.match(template, />\s*Chờ trả\s*</);
    assert.match(template, />\s*Hoàn thành\s*</);
    assert.match(template, /Giao diện thẻ \(Kanban\)/);
    assert.match(template, /Giao diện bảng \(Table\)/);
    assert.match(template, /class="w-10 h-10 rounded-lg[^\"]*sm:w-8 sm:h-8"/);
    assert.match(kanban, /h-10 w-10 bg-emerald-600[^\"]*sm:h-8 sm:w-8/);
    assert.match(kanban, /min-h-10 px-3 py-2 bg-teal-600[^\"]*sm:min-h-0 sm:px-2 sm:py-1/);
    assert.match(component, /showPurchaseRequestsAdminModal\.set\(true\)/);
    assert.match(component, /requestService\.getRequestsForExport\(\)/);
    assert.match(actionModals, /approveExpectedAmount\.set\(req\.expectedAmount \?\? null\)/);
  });

  it('keeps direct assignment atomic instead of creating then dispensing in a second transaction', () => {
    const service = read('./services/standard-request.service.ts');
    const page = read('./standards.component.ts');
    const detail = read('./standard-detail.component.ts');

    assert.match(service, /status: isAssign \? 'IN_PROGRESS' : 'PENDING_APPROVAL'/);
    assert.match(service, /current_request_id: reqRef\.id/);
    assert.match(service, /action: isAssign \? 'ASSIGN_STANDARD' : 'REQUEST_STANDARD'/);
    assert.doesNotMatch(page, /if \(this\.isAssignMode\(\)\)[\s\S]{0,220}dispenseStandard/);
    assert.doesNotMatch(detail, /if \(this\.isAssignMode\(\)\)[\s\S]{0,300}dispenseStandard/);
  });

  it('uses shared header, buttons and empty state on standard detail while preserving specialized tab controls', () => {
    const component = read('./standard-detail.component.ts');
    const template = read('./standard-detail.component.html');

    assert.match(component, /AppButtonComponent/);
    assert.match(component, /AppEmptyStateComponent/);
    assert.match(component, /AppPageHeaderComponent/);
    assert.match(component, /AppUiTimelineComponent/);
    assert.match(component, /AppUiAvatarGroupComponent/);
    assert.match(template, /<app-page-header\b/);
    assert.match(template, /variant="detail"/);
    assert.match(template, /pageHeaderLeading/);
    assert.match(template, /pageHeaderActions/);
    assert.match(template, /pageHeaderMeta/);
    assert.match(template, /<app-button\b/);
    assert.match(template, /<app-empty-state\b/);
    assert.match(template, /title="Chi tiết chất chuẩn đối chiếu"/);
    assert.match(template, />\s*Chỉnh sửa\s*</);
    assert.match(template, />\s*Quay lại danh sách\s*</);
    assert.match(template, />\s*Nhật ký sử dụng\s*</);
    assert.match(template, />\s*Lọ chuẩn cùng tên/);
    assert.match(template, /<app-ui-timeline\b/);
    assert.match(template, /\[items\]="usageTimelineItems\(\)"/);
    assert.match(template, /<app-ui-avatar-group\b/);
    assert.match(component, /usageTimelineItems = computed<TimelineItem\[]>/);
    assert.match(component, /usageActors = computed<AvatarGroupItem\[]>/);
    assert.match(component, /callback: \(\) => \{ void this\.deleteLog\(log, std\.id\); \}/);
    assert.doesNotMatch(template, /<h1[^>]*>\s*\{\{std\.name\}\}/);
  });

  it('blocks detail actions and history in Audit mode even when the account also has edit/request permissions', async () => {
    const { component, navigation, historyCalls, driveCalls } = await createDetailHarness(['standard_edit', 'standard_request', 'standard_delete'], true);
    assert.equal(component.canEditStandard(), false);
    assert.equal(component.canReleaseInternalId(), false);
    assert.equal(component.canReturnStandard(), false);
    assert.equal(component.canAssignStandards(), false);
    assert.equal(component.canRequestStandards(), false);
    assert.equal(component.canDeleteStandardLogs(), false);
    assert.deepEqual(component.deviceCodes(), []);
    assert.deepEqual(component.methodLabels(), []);
    component.openQrModal();
    component.openPrintModal();
    component.openEditModal();
    component.openPurchaseModal();
    await component.openAssignModal();
    component.navigateToRelated('standard-b');
    component.goToReturn();
    component.triggerQuickDriveUpload();
    await component.handleQuickDriveUpload(undefined);
    await component.loadHistory('standard-a');
    assert.equal(component.showQrModal(), false);
    assert.equal(component.showPrintModal(), false);
    assert.equal(component.showEditModal(), false);
    assert.equal(component.showAssignModal(), false);
    assert.equal(component.showPurchaseModal(), false);
    assert.deepEqual(navigation, []);
    assert.deepEqual(historyCalls, []);
    assert.equal(driveCalls(), 0);
  });

  it('enforces requester, pending, lifecycle, holder and restock guards in detail action handlers', async () => {
    const { component, std, navigation, driveCalls } = await createDetailHarness(['standard_request']);
    await component.openAssignModal(true);
    assert.equal(component.showAssignModal(), false);
    await component.openAssignModal(false);
    assert.equal(component.showAssignModal(), true);
    component.showAssignModal.set(false);
    component.standard.set({ ...std, has_pending_request: true });
    await component.openAssignModal(false);
    assert.equal(component.showAssignModal(), false);
    component.standard.set({ ...std, lifecycle_status: 'RELEASED' });
    await component.openAssignModal(false);
    assert.equal(component.showAssignModal(), false);
    component.triggerQuickDriveUpload();
    await component.handleQuickDriveUpload(undefined);
    assert.equal(driveCalls(), 0);
    component.standard.set({ ...std, status: 'IN_USE', current_holder_uid: 'someone-else' });
    component.goToReturn();
    assert.deepEqual(navigation, []);
    component.standard.set({ ...std, status: 'IN_USE', current_holder_uid: 'reviewer' });
    component.goToReturn();
    assert.deepEqual(navigation, [['/standard-requests']]);
    component.standard.set(std);
    component.openPurchaseModal();
    assert.equal(component.showPurchaseModal(), false);
    component.standard.set({ ...std, status: 'DEPLETED', current_amount: 0, restock_requested: true });
    component.openPurchaseModal();
    assert.equal(component.showPurchaseModal(), false);
    component.standard.set({ ...std, status: 'DEPLETED', current_amount: 0 });
    component.openPurchaseModal();
    assert.equal(component.showPurchaseModal(), true);
  });

  it('closes the QR viewer before printing and resets the tab and viewer on related-lot navigation', async () => {
    const { component, params, historyCalls } = await createDetailHarness(['standard_edit']);
    component.openQrModal();
    assert.equal(component.showQrModal(), true);
    component.openPrintModal();
    assert.equal(component.showQrModal(), false);
    assert.equal(component.showPrintModal(), true);
    component.showPrintModal.set(false);
    component.ngOnInit();
    component.activeTab.set('specs');
    component.openQrModal();
    params.next(convertToParamMap({ id: 'standard-b' }));
    assert.equal(component.activeTab(), 'usage');
    assert.equal(component.showQrModal(), false);
    await Promise.resolve();
    assert.equal(component.standard()?.id, 'standard-b');
    assert.deepEqual(historyCalls, [['standard-b', 100]]);
    component.ngOnDestroy();
  });

  it('invokes native sharing immediately with the QR URL and blocks duplicate share/copy operations', async () => {
    const payloads: ShareData[] = [];
    const checked: ShareData[] = [];
    const copied: string[] = [];
    let finishShare!: () => void;
    const { component, std, toastMessages } = await createDetailHarness([], false, {
      canShare: data => { checked.push(data!); return true; },
      share: data => { payloads.push(data!); return new Promise<void>(resolve => { finishShare = resolve; }); },
      clipboard: { writeText: async text => { copied.push(text); } },
    });
    component.standard.set({ ...std, id: 'STD / 01', lot_number: 'LOT-01' });
    const pending = component.shareStandard();
    const expected = {
      title: 'Chuẩn thử nghiệm (AA01)',
      text: 'Chất chuẩn đối chiếu: Chuẩn thử nghiệm - Lô: LOT-01',
      url: 'https://lims.example/#/standards/STD%20%2F%2001',
    };
    assert.deepEqual(payloads, [expected], 'Native share must start in the same click turn');
    assert.deepEqual(checked, [expected]);
    assert.equal(component.standardShareUrl(), expected.url);
    assert.equal(component.isSharing(), true);
    await component.shareStandard();
    await component.copyStandardLink();
    assert.equal(payloads.length, 1);
    assert.deepEqual(copied, []);
    finishShare();
    await pending;
    assert.equal(component.isSharing(), false);
    assert.deepEqual(toastMessages, []);
  });

  it('copies only the canonical URL when native sharing is absent, unsupported or fails', async () => {
    for (const mode of ['absent', 'unsupported', 'failure', 'capability-error']) {
      const copied: string[] = [];
      let shareCalls = 0;
      const browserNavigator: ShareNavigator = { clipboard: { writeText: async text => { copied.push(text); } } };
      if (mode !== 'absent') browserNavigator.share = async () => {
        shareCalls++;
        throw new DOMException('Blocked', 'NotAllowedError');
      };
      if (mode === 'unsupported') browserNavigator.canShare = () => false;
      if (mode === 'capability-error') browserNavigator.canShare = () => { throw new Error('Unavailable'); };
      const { component, toastMessages } = await createDetailHarness([], false, browserNavigator);
      await component.shareStandard();
      assert.deepEqual(copied, ['https://lims.example/#/standards/standard-a'], mode);
      assert.equal(shareCalls, mode === 'failure' ? 1 : 0, mode);
      assert.deepEqual(toastMessages, [['Đã sao chép liên kết chất chuẩn!', 'success']], mode);
      assert.equal(component.isSharing(), false);
    }
  });

  it('keeps native share cancellation quiet without copying or opening a fallback dialog', async () => {
    let copies = 0;
    const { component, toastMessages } = await createDetailHarness([], false, {
      share: async () => { throw new DOMException('Canceled', 'AbortError'); },
      clipboard: { writeText: async () => { copies++; } },
    });
    await component.shareStandard();
    assert.equal(copies, 0);
    assert.equal(component.showQrModal(), false);
    assert.equal(component.isSharing(), false);
    assert.deepEqual(toastMessages, []);
  });

  it('offers manual copying when clipboard access is blocked and supports an explicit copy retry', async () => {
    let blocked = true;
    let shares = 0;
    const copied: string[] = [];
    const { component, toastMessages } = await createDetailHarness([], false, {
      share: async () => { shares++; },
      clipboard: { writeText: async text => {
        if (blocked) throw new DOMException('Blocked', 'NotAllowedError');
        copied.push(text);
      } },
    });
    await component.copyStandardLink();
    assert.equal(shares, 0, 'Explicit copy must bypass native share');
    assert.equal(component.showQrModal(), true);
    assert.equal(component.manualCopyRequired(), true);
    assert.equal(toastMessages[0][1], 'info');
    assert.equal(component.isSharing(), false);
    blocked = false;
    await component.copyStandardLink();
    assert.deepEqual(copied, [component.standardShareUrl()]);
    assert.equal(component.manualCopyRequired(), false);
    assert.equal(toastMessages.at(-1)?.[1], 'success');
    component.closeQrModal();
    assert.equal(component.showQrModal(), false);
  });

  it('opens the selectable link when neither native sharing nor clipboard is available', async () => {
    const { component, params, toastMessages } = await createDetailHarness();
    await component.shareStandard();
    assert.equal(component.showQrModal(), true);
    assert.equal(component.manualCopyRequired(), true);
    assert.equal(toastMessages.length, 1);
    assert.equal(toastMessages[0][1], 'info');
    component.ngOnInit();
    params.next(convertToParamMap({ id: 'standard-b' }));
    assert.equal(component.manualCopyRequired(), false);
    await Promise.resolve();
    assert.equal(component.standardShareUrl(), 'https://lims.example/#/standards/standard-b');
    component.ngOnDestroy();
  });

  it('blocks sharing and copying for audit, missing or loading details', async () => {
    let calls = 0;
    const { component, std, auditMode, toastMessages } = await createDetailHarness([], true, {
      share: async () => { calls++; },
      clipboard: { writeText: async () => { calls++; } },
    });
    assert.equal(component.standardShareUrl(), '');
    await component.shareStandard();
    await component.copyStandardLink();
    auditMode.set(false);
    for (const state of ['loading', 'not-found', 'missing']) {
      component.isLoading.set(state === 'loading');
      component.notFound.set(state === 'not-found');
      component.standard.set(state === 'missing' ? null : std);
      await component.shareStandard();
      await component.copyStandardLink();
    }
    assert.equal(calls, 0);
    assert.equal(component.showQrModal(), false);
    assert.deepEqual(toastMessages, []);
  });

  it('does not copy or reopen a dialog for an old share after navigation, audit activation or teardown', async () => {
    for (const change of ['navigation', 'audit', 'destroy']) {
      let copies = 0;
      let rejectShare!: (error: Error) => void;
      const { component, std, auditMode, toastMessages } = await createDetailHarness([], false, {
        share: () => new Promise<void>((_, reject) => { rejectShare = reject; }),
        clipboard: { writeText: async () => { copies++; } },
      });
      const pending = component.shareStandard();
      if (change === 'navigation') component.standard.set({ ...std, id: 'standard-b' });
      if (change === 'audit') auditMode.set(true);
      if (change === 'destroy') component.ngOnDestroy();
      rejectShare(new DOMException('Unavailable', 'NotAllowedError'));
      await pending;
      assert.equal(copies, 0, change);
      assert.equal(component.showQrModal(), false, change);
      assert.equal(component.isSharing(), false, change);
      assert.deepEqual(toastMessages, [], change);
    }
  });

  it('uses shared header, toolbar, buttons and empty state for usage history with sentence-case labels', () => {
    const component = read('./usage/standard-usage.component.ts');
    const template = read('./usage/standard-usage.component.html');

    assert.match(component, /AppButtonComponent/);
    assert.match(component, /AppEmptyStateComponent/);
    assert.match(component, /AppPageHeaderComponent/);
    assert.match(component, /AppToolbarComponent/);
    assert.match(template, /<app-page-header\b/);
    assert.match(template, /pageHeaderActions/);
    assert.match(template, /<app-toolbar\b/);
    assert.match(template, /toolbarSearch/);
    assert.match(template, /toolbarFilters/);
    assert.match(template, /toolbarFilters class="w-full min-w-0 sm:w-auto sm:min-w-\[280px\]"/);
    assert.match(template, /toolbarActions/);
    assert.match(template, /<app-button\b/);
    assert.match(template, /<app-empty-state\b/);
    assert.match(template, /title="Nhật ký dùng chuẩn"/);
    assert.match(template, /Vuốt ngang để xem đầy đủ nhật ký sử dụng/);
    assert.match(template, /role="region" aria-label="Bảng nhật ký sử dụng chuẩn" tabindex="0"/);
    assert.match(template, />\s*Xóa lọc\s*</);
    assert.match(template, /1\. Nhật ký chi tiết/);
    assert.match(template, /2\. Tổng hợp theo hóa chất/);
    assert.match(template, /3\. Tổng hợp theo nhân viên/);
  });

  it('uses the shared modal shell for migrated standards modals', () => {
    const historyModal = read('./components/standards-history-modal.component.ts');
    const bulkTagModal = read('./components/standards-bulk-tag-modal.component.ts');
    const tagManagerModal = read('./components/standards-tag-manager-modal.component.ts');
    const purchaseModal = read('./components/standards-purchase-modal.component.ts');
    const formModal = read('./components/standards-form-modal.component.ts');
    const assignModal = read('./components/standards-assign-modal.component.ts');
    const backfillModal = read('./components/standards-backfill-modal.component.ts');
    const printModal = read('./components/standards-print-modal.component.ts');
    const internalIdSyncModal = read('./components/standards-internal-id-sync-modal.component.ts');
    const bulkCoaModal = read('./components/standards-bulk-coa-modal.component.ts');
    const importDataModal = read('./components/standards-import-data-modal.component.ts');
    const importPreviewModals = read('./components/standards-import-modal.component.ts');
    const dataCleanupModal = read('./components/standards-data-cleanup-modal.component.ts');

    for (const modal of [historyModal, bulkTagModal, tagManagerModal, purchaseModal, formModal, assignModal, backfillModal, printModal, internalIdSyncModal, bulkCoaModal, importDataModal, importPreviewModals, dataCleanupModal]) {
      assert.match(modal, /AppModalShellComponent/);
      assert.match(modal, /<app-modal-shell\b/);
      assert.doesNotMatch(modal, /class="[^"]*fixed inset-0/);
    }

    assert.match(historyModal, /title="Lịch sử sử dụng"/);
    assert.match(bulkTagModal, /title="Gán nhãn hàng loạt"/);
    assert.match(tagManagerModal, /title="Danh mục nhãn trung tâm"/);
    assert.match(purchaseModal, /title="Đề nghị mua sắm"/);
    assert.match(purchaseModal, /form="standards-purchase-form"/);
    assert.match(formModal, /\[title\]="std\(\) \? 'Cập nhật chất chuẩn' : 'Thêm chất chuẩn mới'"/);
    assert.match(formModal, /\[closeOnBackdrop\]="false"/);
    assert.match(assignModal, /\[title\]="isAssignMode\(\) \? 'Gán cho nhân viên' : 'Mượn chuẩn sử dụng'"/);
    assert.match(assignModal, /\[closeOnBackdrop\]="false"/);
    assert.match(backfillModal, /title="Nhập bù nhật ký"/);
    assert.match(backfillModal, /\[closeOnBackdrop\]="false"/);
    assert.match(printModal, /\[title\]="printModalTitle\(\)"/);
    assert.match(printModal, /size="xl"/);
    assert.match(printModal, /\[closeOnBackdrop\]="false"/);
    assert.match(printModal, /modalFooter/);
    assert.match(internalIdSyncModal, /title="Đồng bộ Mã quản lý nội bộ"/);
    assert.match(internalIdSyncModal, /size="xl"/);
    assert.match(internalIdSyncModal, /\[closeOnBackdrop\]="false"/);
    assert.match(internalIdSyncModal, /\[closeDisabled\]="isBusy\(\)"/);
    assert.match(internalIdSyncModal, /modalFooter/);
    assert.match(bulkCoaModal, /title="Ghép nối CoA hàng loạt"/);
    assert.match(bulkCoaModal, /size="xl"/);
    assert.match(bulkCoaModal, /\[closeOnBackdrop\]="false"/);
    assert.match(bulkCoaModal, /\[closeDisabled\]="isUploading"/);
    assert.match(bulkCoaModal, /modalFooter/);
    assert.match(importDataModal, /title="Xác nhận nhập danh mục chuẩn"/);
    assert.match(importDataModal, /size="2xl"/);
    assert.match(importDataModal, /\[closeOnBackdrop\]="false"/);
    assert.match(importDataModal, /\[closeDisabled\]="isImporting\(\) \|\| isParsing\(\)"/);
    assert.match(importDataModal, /modalFooter/);
    assert.doesNotMatch(importDataModal, /HostListener|dialogPanel/);
    assert.equal((importPreviewModals.match(/<app-modal-shell\b/g) || []).length, 2);
    assert.match(importPreviewModals, /title="Xác nhận nhập dữ liệu"/);
    assert.match(importPreviewModals, /title="Xác nhận nhập nhật ký"/);
    assert.equal((importPreviewModals.match(/size="2xl"/g) || []).length, 2);
    assert.equal((importPreviewModals.match(/\[closeOnBackdrop\]="false"/g) || []).length, 2);
    assert.equal((importPreviewModals.match(/modalFooter/g) || []).length, 2);
    assert.match(dataCleanupModal, /title="Chuẩn hóa danh pháp & CAS chất chuẩn"/);
    assert.match(dataCleanupModal, /size="xl"/);
    assert.match(dataCleanupModal, /\[closeOnBackdrop\]="false"/);
    assert.match(dataCleanupModal, /\[closeDisabled\]="isProcessing\(\) \|\| undoingBatchId\(\) !== null"/);
    assert.match(dataCleanupModal, /modalFooter/);
    assert.match(dataCleanupModal, /Lịch sử chuẩn hóa & hoàn tác/);
  });
});
