import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

function read(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
}

describe('Soft UI timeline primitive', () => {
  it('keeps the normalized item model and five semantic statuses', () => {
    const model = read('./timeline.model.ts');
    assert.match(model, /'primary' \| 'success' \| 'info' \| 'warning' \| 'danger'/);
    assert.match(model, /interface TimelineItemAction/);
    assert.match(model, /routerLink\?: string \| any\[\]/);
    assert.match(model, /href\?: string/);
    assert.match(model, /interface TimelineItem/);
    assert.match(model, /metadata\?: TimelineMetadataItem\[\]/);
    assert.match(model, /isCurrent\?: boolean/);
  });

  it('renders an accessible vertical event list with current-state and responsive metadata', () => {
    const source = read('./timeline.component.ts');
    assert.match(source, /selector: 'app-ui-timeline'/);
    assert.match(source, /<ol class="soft-ui-timeline" role="list"/);
    assert.match(source, /role="listitem"/);
    assert.match(source, /\[attr\.aria-current\]="item\.isCurrent \? 'step' : null"/);
    assert.match(source, /soft-ui-timeline__node/);
    assert.match(source, /soft-ui-timeline__line/);
    assert.match(source, /actorName\(item\)/);
    assert.match(source, /Hệ thống LIMS/);
    assert.match(source, /sm:flex-row/);
    assert.match(source, /break-all/);
    assert.match(source, /\[routerLink\]="action\.routerLink"/);
    assert.match(source, /\[href\]="action\.href"/);
    assert.match(source, /rel="noopener noreferrer"/);
  });

  it('uses global Soft UI timeline tokens instead of component hex colors', () => {
    const source = read('./timeline.component.ts');
    const styles = read('../../../../../styles.css');
    assert.doesNotMatch(source, /#[0-9a-fA-F]{3,8}/);
    assert.match(styles, /--soft-ui-timeline-line:/);
    assert.match(styles, /--soft-ui-timeline-node-primary: var\(--soft-ui-gradient\)/);
    assert.match(styles, /--soft-ui-timeline-node-success: var\(--soft-ui-gradient-success\)/);
    assert.match(styles, /--soft-ui-timeline-node-info: var\(--soft-ui-gradient-info\)/);
    assert.match(styles, /--soft-ui-timeline-node-warning: var\(--soft-ui-gradient-warning\)/);
    assert.match(styles, /--soft-ui-timeline-node-danger:/);
    assert.match(styles, /\.soft-ui-timeline__node\[data-current='true'\]::after/);
    assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  });
});
