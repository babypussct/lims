import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

function read(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
}

describe('shared UI primitive contracts', () => {
  it('keeps button variants, sizes, loading and disabled states on the shared contract', () => {
    const source = read('./button/button.component.ts');

    assert.match(source, /export type AppButtonVariant = 'primary' \| 'secondary' \| 'danger' \| 'ghost'/);
    assert.match(source, /export type AppButtonSize = 'sm' \| 'md'/);
    assert.match(source, /\[disabled\]="disabled\(\) \|\| loading\(\)"/);
    assert.match(source, /\[attr\.aria-busy\]="loading\(\) \? 'true' : null"/);
    assert.match(source, /primary: 'bg-gradient-soft/);
    assert.match(source, /danger: 'bg-red-600/);
    assert.match(source, /rounded-xl/);
  });

  it('keeps a single semantic page heading and action slot in the page header', () => {
    const source = read('./page-header/page-header.component.ts');

    assert.match(source, /<h1\b/);
    assert.equal((source.match(/<h1\b/g) ?? []).length, 1);
    assert.match(source, /select="\[pageHeaderActions\]"/);
    assert.match(source, /soft-ui-page-header/);
    assert.match(source, /sticky = input\(false\)/);
  });

  it('integrates the shared modal accessibility directive and standard close affordance', () => {
    const source = read('./modal-shell/modal-shell.component.ts');

    assert.match(source, /appModalA11y/);
    assert.match(source, /\[modalLabelledBy\]="titleId"/);
    assert.match(source, /\(modalEscape\)="requestClose\(\)"/);
    assert.match(source, /aria-label="Đóng"/);
    assert.match(source, /\[disabled\]="closeDisabled\(\)"/);
    assert.match(source, /closeDisabled = input\(false\)/);
    assert.match(source, /if \(!this\.closeDisabled\(\)\)/);
    assert.match(source, /export type AppModalSize = 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'/);
    assert.match(source, /'2xl': 'max-w-\[96rem\]'/);
    assert.match(source, /fa-xmark/);
    assert.match(source, /select="\[modalBody\]"/);
    assert.match(source, /select="\[modalFooter\]"/);
    assert.match(source, /shadow-soft-xl/);
  });

  it('keeps empty state and toolbar slots aligned with the shared layout contract', () => {
    const emptyState = read('./empty-state/empty-state.component.ts');
    const toolbar = read('./toolbar/toolbar.component.ts');

    assert.match(emptyState, /rounded-2xl/);
    assert.match(emptyState, /select="\[emptyStateActions\]"/);
    assert.match(emptyState, /dark:bg-slate-800/);

    assert.match(toolbar, /select="\[toolbarSearch\]"/);
    assert.match(toolbar, /select="\[toolbarFilters\]"/);
    assert.match(toolbar, /select="\[toolbarActions\]"/);
    assert.match(toolbar, /soft-ui-toolbar-host/);
    assert.match(toolbar, /gap-3/);
  });

  it('keeps the primitive gallery dev-only and demonstrates light/dark plus main variants', () => {
    const demo = read('./ui-primitives-demo.component.ts');
    const routes = read('../../../app.routes.ts');
    const appComponent = read('../../../app.component.ts');

    assert.match(demo, /\[class\.dark\]="darkPreview\(\)"/);
    assert.match(demo, /variant="secondary"/);
    assert.match(demo, /variant="danger"/);
    assert.match(demo, /variant="ghost"/);
    assert.match(demo, /\[loading\]="true"/);
    assert.match(demo, /\[disabled\]="true"/);
    assert.match(demo, /<app-modal-shell/);

    assert.match(routes, /environment\.production \? \[\] : \[/);
    assert.match(routes, /path: '__ui-primitives'/);
    assert.match(appComponent, /!environment\.production && url\.startsWith\('\/__ui-primitives'\)/);
  });
});
