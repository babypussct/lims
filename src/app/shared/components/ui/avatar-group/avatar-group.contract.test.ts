import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

function read(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
}

describe('Soft UI avatar group primitive', () => {
  it('keeps a compact reusable item model with a bounded visible facepile', () => {
    const model = read('./avatar-group.model.ts');
    const source = read('./avatar-group.component.ts');

    assert.match(model, /interface AvatarGroupItem/);
    assert.match(model, /imageUrl\?: string \| null/);
    assert.match(source, /selector: 'app-ui-avatar-group'/);
    assert.match(source, /maxVisible = input\(5\)/);
    assert.match(source, /visibleItems = computed/);
    assert.match(source, /hiddenCount = computed/);
  });

  it('renders an accessible overlapping facepile with image and initials fallbacks', () => {
    const source = read('./avatar-group.component.ts');
    const styles = read('../../../../../styles.css');

    assert.match(source, /class="flex -space-x-2" role="list"/);
    assert.match(source, /role="listitem"/);
    assert.match(source, /\[alt\]="item\.name"/);
    assert.match(source, /initials\(item\.name\)/);
    assert.match(source, /\+\{\{ hiddenCount\(\) \}\}/);
    assert.doesNotMatch(source, /#[0-9a-fA-F]{3,8}/);
    assert.match(styles, /\.soft-ui-avatar-group__item/);
    assert.match(styles, /\.soft-ui-avatar-group__more/);
  });
});
