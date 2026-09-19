import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';

function read(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
}

function readProductionTree(relativePath = '.'): string {
  const root = fileURLToPath(new URL(relativePath, import.meta.url));
  const files: string[] = [];

  const walk = (directory: string) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) {
        walk(path);
        continue;
      }

      if (!/\.(?:ts|html|css|scss)$/.test(entry.name)) continue;
      if (/\.(?:contract\.)?test\.ts$/.test(entry.name)) continue;
      files.push(path);
    }
  };

  walk(root);
  return files.map((path) => readFileSync(path, 'utf8')).join('\n');
}

describe('Soft UI application layout contract', () => {
  it('keeps the desktop navigation rail usable in both collapsed and expanded states', () => {
    const shell = read('./app-shell.component.ts');
    const navigation = read('./navigation-panel.component.ts');
    const header = read('./app-header.component.ts');

    assert.match(shell, /<app-navigation-panel><\/app-navigation-panel>/);
    assert.match(shell, /elevated-workspace-canvas/);
    assert.match(shell, /\[style\.--soft-ui-shell-offset\]="state\.sidebarCollapsed\(\) \? '4rem' : '17rem'"/);
    assert.match(shell, /\[style\.--soft-ui-workspace-offset\]="state\.sidebarCollapsed\(\) \? '3rem' : '15\.25rem'"/);
    assert.match(shell, /workspace-focus-mode/);
    assert.match(shell, /@media \(min-width: 1024px\)/);
    assert.match(shell, /margin-left: var\(--soft-ui-workspace-offset\)/);
    assert.match(shell, /border-radius: 1\.125rem 0 0 1\.125rem/);
    assert.doesNotMatch(shell, /margin-(?:top|right|bottom): 0\.625rem/);
    assert.match(shell, /box-shadow: var\(--soft-ui-workspace-shadow\)/);
    assert.ok(shell.indexOf('<app-header') > shell.indexOf('<main'), 'desktop header must live inside the elevated workspace canvas');
    assert.match(navigation, /state\.sidebarCollapsed\(\) \? 'left-1 w-14 lg:left-0 lg:w-16/);
    assert.match(navigation, /: 'left-4 w-64 lg:left-0 lg:w-\[17rem\]'/);
    assert.match(navigation, /z-40[^"]*lg:z-10/);
    assert.match(navigation, /lg:inset-y-0/);
    assert.doesNotMatch(navigation, /lg:bottom-auto/);
    assert.match(navigation, /state\.sidebarCollapsed\(\) \? 'w-12 justify-center px-0' : 'w-full gap-3 px-5'/);
    assert.match(navigation, /state\.sidebarCollapsed\(\) \? 'w-12 px-1' : 'w-full px-2 lg:pl-4 lg:pr-10'/);
    assert.match(navigation, /rounded-2xl[^"]*bg-transparent shadow-none/);
    assert.match(navigation, /dark:bg-transparent/);
    assert.match(navigation, /soft-ui-nav-item/);
    assert.match(navigation, /\[class\.soft-ui-nav-item--active\]="!item\.isLocked && isActive\(item\.activeMatch\)"/);
    assert.match(navigation, /\[class\.soft-ui-nav-item--collapsed\]="state\.sidebarCollapsed\(\)"/);
    assert.match(navigation, /soft-ui-nav-icon/);
    assert.match(navigation, /\[class\.soft-ui-nav-icon--active\]="!item\.isLocked && isActive\(item\.activeMatch\)"/);
    assert.match(navigation, /class="fa-solid \{\{item\.icon\}\}"/);
    assert.match(navigation, /\[ngClass\]="state\.sidebarCollapsed\(\) \? 'text-\[13px\]' : 'text-\[12px\]'"/);
    assert.doesNotMatch(navigation, /class="fa-solid \{\{item\.icon\}\}"[^>]*\[class\]=/);
    assert.doesNotMatch(navigation, /state\.toggleSidebarCollapse\(\)/);
    assert.doesNotMatch(navigation, /state\.systemVersion\(\)/);
    assert.match(header, /state\.toggleSidebarCollapse\(\)/);
    assert.match(header, /Mở rộng sidebar/);
    assert.match(header, /Thu gọn sidebar/);
    assert.match(header, /flex w-\[16px\] flex-col gap-\[3px\]/);
    assert.match(header, /\[class\.translate-x-1\]="!state\.sidebarCollapsed\(\)"/);
    assert.match(header, /\[style\.--soft-ui-header-left\]="state\.sidebarCollapsed\(\) \? '4rem' : '17rem'"/);
    assert.match(header, /\.soft-ui-desktop-header\s*\{\s*left: var\(--soft-ui-header-left\)/);
    assert.match(header, /@media \(min-width: 1024px\)[\s\S]*position: relative/);
    assert.doesNotMatch(header, /\[style\.left\]=/);
    assert.match(header, /absolute left-1\/2 top-1\/2 hidden h-9 w-56 -translate-x-1\/2 -translate-y-1\/2/);
    assert.doesNotMatch(header, /bg-white\/75 dark:bg-slate-900\/80 backdrop-blur-xl/);
  });

  it('keeps Soft UI utility chrome and a unified responsive mobile header', () => {
    const header = read('./app-header.component.ts');
    const shell = read('./app-shell.component.ts');

    assert.match(header, /fa-circle-info/);
    assert.match(header, /openChangelog\(\)/);
    assert.match(header, /UNIFIED MOBILE TOP NAVIGATION/);
    assert.match(header, /md:hidden/);
    assert.match(header, /openPalette\(\)/);
    assert.match(header, /mobileMenuRequested\.emit\(\)/);
    assert.match(header, /\[headerMode\]="true"/);
    assert.match(header, /soft-ui-mobile-header/);
    assert.match(header, /host:\s*\{\s*class:\s*'block shrink-0'\s*\}/);
    assert.match(header, /soft-ui-mobile-header relative z-\[45\] flex h-14 w-full shrink-0/);
    assert.doesNotMatch(header, /soft-ui-mobile-header fixed/);
    assert.match(header, /height: calc\(3\.5rem \+ env\(safe-area-inset-top, 0px\)\)/);
    assert.match(header, /padding-top: env\(safe-area-inset-top, 0px\)/);
    assert.match(shell, /\[class\.md:pt-16\]="!state\.focusMode\(\)"/);
    assert.doesNotMatch(shell, /shell-mobile-header-offset/);
    assert.match(header, /flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-soft/);
    assert.match(header, /flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/);
    const notificationBell = read('../../shared/components/notification-bell/notification-bell.component.ts');
    assert.match(notificationBell, /h-10 w-10[^\n]*md:h-8 md:w-8/);
    const profileMenu = header.slice(header.indexOf('<!-- ── Profile Dropdown ── -->'), header.indexOf('<!-- ═══════ UNIFIED MOBILE TOP NAVIGATION ═══════ -->'));
    assert.doesNotMatch(profileMenu, /Nhật ký thay đổi/);
    assert.doesNotMatch(profileMenu, /Giao diện Sáng|Giao diện Tối/);
  });

  it('keeps Quick SOP access inside the permission-aware command palette', () => {
    const header = read('./app-header.component.ts');

    assert.match(header, /this\.canAccessRoute\('calculator'\)/);
    assert.match(header, /this\.state\.sops\(\)/);
    assert.match(header, /\.filter\(sop => !sop\.isArchived\)/);
    assert.match(header, /Tra cứu SOP nhanh/);
    assert.match(header, /this\.state\.selectedSop\.set\(sop\)/);
    assert.match(header, /this\.router\.navigate\(\['\/calculator'\]\)/);
  });

  it('keeps one dashboard greeting, global date scope and Soft UI surfaces', () => {
    const component = read('../../features/dashboard/dashboard.component.ts');
    const template = read('../../features/dashboard/dashboard.component.html');

    assert.match(component, /AppPageHeaderComponent/);
    assert.match(template, /<app-page-header\b/);
    assert.doesNotMatch(template, /<app-toolbar\b/);
    assert.match(template, /<app-date-range-filter\b/);
    assert.match(template, /containerClass="bg-transparent p-0 border-0 shadow-none"/);
    assert.ok(template.indexOf('<app-date-range-filter') > template.indexOf('Hiệu Suất Phân Tích'));
    assert.match(template, /@if\(!auth\.canViewSop\(\)\)/);
    assert.match(template, /soft-ui-kpi/);
    assert.match(template, /soft-ui-icon-tile/);
    assert.match(template, /soft-ui-panel/);
  });

  it('keeps authenticated route pages transparent inside the elevated workspace canvas', () => {
    const pageSurfaces = [
      ['documents', read('../../features/documents/documents.component.ts'), /documents-page-enter[^\"]*bg-slate-/],
      ['smart preparation', read('../../features/preparation/smart-prep.component.html'), /<div class="flex min-h-full flex-col[^\"]*bg-slate-/],
      ['standard detail', read('../../features/standards/standard-detail.component.html'), /<div class="flex flex-col h-full[^\"]*bg-slate-/],
      ['batch detail', read('../../features/results-view/batch-detail-view.component.ts'), /<div class="h-full flex flex-col animate-fade-in[^\"]*bg-slate-/],
      ['master targets', read('../../features/targets/master-target-manager.component.ts'), /<div class="h-full flex flex-col fade-in[^\"]*bg-slate-/],
      ['target groups', read('../../features/targets/target-group-manager.component.ts'), /<div class="h-full flex flex-col fade-in[^\"]*bg-slate-/],
      ['label printing', read('../../features/labels/label-print.component.html'), /<div class="h-full flex flex-col md:flex-row[^\"]*bg-slate-/],
      ['SOP editor', read('../../features/sop/editor/sop-editor.component.html'), /<div class="h-full flex flex-col[^\"]*bg-slate-/],
    ] as const;

    for (const [name, source, rootBackground] of pageSurfaces) {
      assert.doesNotMatch(source, rootBackground, `${name} must inherit the elevated workspace canvas background`);
    }

    const masterTargets = read('../../features/targets/master-target-manager.component.ts');
    const targetGroups = read('../../features/targets/target-group-manager.component.ts');
    assert.doesNotMatch(masterTargets, /flex-1 p-6 overflow-hidden flex flex-col bg-slate-/);
    assert.doesNotMatch(targetGroups, /flex-1 bg-slate-[^\"]* flex flex-col overflow-hidden relative/);
  });

  it('locks the Creative Tim Soft UI reference parity for desktop dashboard chrome', () => {
    const navigation = read('./navigation-panel.component.ts');
    const header = read('./app-header.component.ts');
    const dashboard = read('../../features/dashboard/dashboard.component.html');
    const styles = read('../../../styles.css');

    assert.match(navigation, /class="fixed bottom-4 top-4/);
    assert.match(navigation, /<app-logo size="38px"/);
    assert.match(navigation, /LIMS <span class="font-normal text-slate-400">NAFIQPM6<\/span>/);
    assert.doesNotMatch(navigation, /fixed top-4 z-\[46\] h-14/);

    assert.match(header, /md:flex/);
    assert.match(header, /w-56[^\n]*shrink-0/);
    assert.match(header, /xl:w-64/);
    assert.match(header, /h-8 w-8/);

    assert.match(dashboard, /soft-ui-dashboard-page/);
    assert.doesNotMatch(dashboard, /soft-ui-dashboard-toolbar/);
    assert.match(dashboard, /grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4/);
    assert.match(dashboard, /soft-ui-icon-tile--warning/);
    assert.match(dashboard, /soft-ui-icon-tile--info/);
    assert.match(dashboard, /soft-ui-icon-tile--dark/);
    assert.match(dashboard, /lg:h-\[500px\]/);
    assert.doesNotMatch(dashboard, /soft-ui-panel[^\n]*border border-slate-200/);

    assert.match(styles, /--soft-ui-gradient-info:/);
    assert.match(styles, /--soft-ui-gradient-success:/);
    assert.match(styles, /--soft-ui-gradient-warning:/);
    assert.match(styles, /--soft-ui-gradient-dark:/);
    assert.match(styles, /--soft-ui-underlay:/);
    assert.match(styles, /--soft-ui-workspace:/);
    assert.match(styles, /--soft-ui-workspace-shadow:/);
    assert.match(styles, /--soft-ui-underlay: #f8fafc;/);
    assert.match(styles, /--soft-ui-panel-subtle: #f8f7fa;/);
    assert.match(styles, /--soft-ui-border: rgba\(120, 100, 145, 0\.10\);/);
    assert.match(styles, /--soft-ui-nav-icon-text: #756a83;/);
    assert.match(styles, /--soft-ui-nav-icon-hover: #7928ca;/);
    assert.match(styles, /--soft-ui-nav-item-hover: rgba\(120, 100, 145, 0\.09\);/);
    assert.match(styles, /\.soft-ui-nav-item--active:not\(\.soft-ui-nav-item--collapsed\)/);
    assert.match(styles, /\.soft-ui-nav-item--active\.soft-ui-nav-item--collapsed/);
    assert.match(styles, /\.dark[\s\S]*--soft-ui-underlay: #14131d;/);
    assert.match(styles, /\.dark[\s\S]*--soft-ui-workspace: #1c1b29;/);
    assert.match(styles, /\.dark[\s\S]*--soft-ui-panel: #211f30;/);
    assert.match(styles, /\.dark[\s\S]*--soft-ui-nav-item-hover: rgba\(196, 181, 253, 0\.09\);/);
    assert.match(styles, /\.soft-ui-nav-icon\.soft-ui-nav-icon--active[\s\S]*background: var\(--soft-ui-gradient\)/);
    assert.match(styles, /@media \(min-width: 1024px\)[\s\S]*\.soft-ui-app-shell[\s\S]*background: var\(--soft-ui-underlay\)/);
    assert.doesNotMatch(styles, /\.soft-ui-app-shell::before/);
    assert.match(styles, /\.soft-ui-dashboard-toolbar/);
    assert.match(styles, /\.soft-ui-dashboard-page/);
  });

  it('keeps the global Soft UI PRO visual language and brand primary', () => {
    const styles = read('../../../styles.css');
    const tailwind = read('../../../../tailwind.config.js');
    const login = read('../../features/auth/login.component.ts');
    const results = read('../../features/results/result-list.component.ts');
    const inventory = read('../../features/inventory/inventory.component.html');

    assert.match(styles, /\.soft-ui-app-shell/);
    assert.match(styles, /\.soft-ui-panel/);
    assert.match(styles, /\.soft-ui-kpi/);
    assert.match(styles, /\.soft-ui-icon-tile/);
    assert.match(tailwind, /sans: \['"Open Sans"'/);
    assert.match(tailwind, /linear-gradient\(310deg, #7928ca 0%, #ff0080 100%\)/);
    assert.match(login, /fuchsia-/);
    assert.match(results, /fuchsia-/);
    assert.match(inventory, /fuchsia-/);
    assert.doesNotMatch(login, /animate-blob|animate-laser/);
  });

  it('preserves explicit mobile table widths for component-owned horizontal scrolling', () => {
    const styles = read('../../../styles.css');

    assert.match(styles, /\.soft-ui-app-shell \*:not\(\[class\*='min-w-'\]\)/);
    assert.match(styles, /\.soft-ui-app-shell table\s*\{\s*max-width: 100%;/);
  });

  it('keeps production surfaces on the Soft UI radius and removes the prior Mosaic namespace', () => {
    const production = readProductionTree('../../');

    assert.doesNotMatch(production, /mosaic-/);
    assert.doesNotMatch(production, /rounded-3xl/);
    assert.doesNotMatch(production, /rounded-\[(?:2(?:\.\d+)?|3(?:\.\d+)?|4(?:\.\d+)?)rem\]/);
  });

  it('keeps workflow controls on the Soft UI fuchsia primary instead of the Mosaic indigo primary', () => {
    const workflowSources = [
      readProductionTree('../../features/auth/'),
      readProductionTree('../../features/preparation/'),
      readProductionTree('../../features/requests/'),
      readProductionTree('../../features/sop/'),
      readProductionTree('../../features/standards/'),
      readProductionTree('../../features/traceability/'),
      readProductionTree('../../features/results/sops/'),
    ].join('\n');

    assert.match(workflowSources, /fuchsia-\d{2,3}/);
    assert.doesNotMatch(workflowSources, /indigo-\d{2,3}/);
  });

  it('covers every existing LIMS feature area with the Soft UI design system', () => {
    const featureAreas = [
      'auth', 'batch', 'checklist', 'config', 'dashboard', 'documents',
      'inventory', 'labels', 'preparation', 'public', 'recipes', 'requests',
      'results', 'results-view', 'settings', 'sop', 'standards', 'targets',
      'traceability',
    ];

    for (const featureArea of featureAreas) {
      const source = readProductionTree(`../../features/${featureArea}/`);
      assert.match(
        source,
        /soft-ui-|bg-gradient-soft|fuchsia-\d{2,3}|<app-page-header\b|<app-toolbar\b|<app-ui-button\b|<app-modal-shell\b/,
        `Feature area ${featureArea} must remain mapped to Soft UI`,
      );
      assert.doesNotMatch(source, /indigo-\d{2,3}/);
      assert.doesNotMatch(source, /mosaic-/);
    }
  });
});
