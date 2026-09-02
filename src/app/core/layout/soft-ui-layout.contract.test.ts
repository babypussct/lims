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
    assert.match(shell, /\[class\.md:ml-16\]="state\.sidebarCollapsed\(\)/);
    assert.match(shell, /\[class\.md:ml-\[17rem\]\]="!state\.sidebarCollapsed\(\)/);
    assert.match(navigation, /state\.sidebarCollapsed\(\) \? 'left-1 w-14/);
    assert.match(navigation, /: 'left-4 w-60/);
    assert.match(navigation, /Thu gọn thanh điều hướng/);
    assert.match(header, /state\.sidebarCollapsed\(\) \? '4rem' : '17rem'/);
  });

  it('keeps Soft UI utility chrome and a dedicated responsive mobile header', () => {
    const header = read('./app-header.component.ts');

    assert.match(header, /fa-circle-info/);
    assert.match(header, /openChangelog\(\)/);
    assert.match(header, /MOBILE TOP HEADER BAR/);
    assert.match(header, /md:hidden/);
    assert.match(header, /openPalette\(\)/);
    assert.match(header, /state\.toggleDarkMode\(\)/);
  });

  it('keeps the dashboard toolbar, global date scope and Soft UI surfaces', () => {
    const component = read('../../features/dashboard/dashboard.component.ts');
    const template = read('../../features/dashboard/dashboard.component.html');

    assert.match(component, /AppToolbarComponent/);
    assert.match(template, /<app-toolbar\b/);
    assert.match(template, /<app-date-range-filter\b/);
    assert.match(template, /containerClass="bg-transparent p-0 border-0 shadow-none"/);
    assert.match(template, /soft-ui-kpi/);
    assert.match(template, /soft-ui-panel/);
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
    assert.match(tailwind, /sans: \['"Open Sans"'/);
    assert.match(tailwind, /linear-gradient\(310deg, #7928ca 0%, #ff0080 100%\)/);
    assert.match(login, /fuchsia-/);
    assert.match(results, /fuchsia-/);
    assert.match(inventory, /fuchsia-/);
    assert.doesNotMatch(login, /animate-blob|animate-laser/);
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
